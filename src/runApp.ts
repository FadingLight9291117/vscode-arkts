import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { execFile } from 'child_process';

/**
 * 工具链管理 + 编辑器标题栏按钮（arkts.buildApp / arkts.runApp）：
 * - devecocli 按需全局安装（命令行工具，需进 PATH）
 * - @arkts/language-server 按需安装到扩展数据目录（无需进 PATH，避免 VSIX 体积膨胀）
 */

let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('ArkTS Run');
  }
  return outputChannel;
}

/** deactivate 时由 extension.ts 调用 */
export function disposeRunApp() {
  outputChannel?.dispose();
  outputChannel = undefined;
}

/**
 * 从 startDir 逐级向上找项目根：
 * 取最顶层含 oh-package.json5 的目录（不要求 hvigorw——部分工程由 CLI 生成，没有该脚本；
 * 取最顶层可避免误把 entry 等模块目录当成项目根）。
 */
export function findProjectRoot(startDir: string): string | undefined {
  let dir = startDir;
  let found: string | undefined;
  while (dir && dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'oh-package.json5'))) {
      found = dir;
    }
    dir = path.dirname(dir);
  }
  return found;
}

/** 解析当前活动 .ets 文件的项目根；无活动文件/找不到项目根时提示并返回 undefined */
function resolveProject(out: vscode.OutputChannel): string | undefined {
  const docPath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (!docPath) {
    vscode.window.showErrorMessage('ArkTS: 请先打开一个 .ets 文件');
    return undefined;
  }
  const projectRoot = findProjectRoot(path.dirname(docPath));
  if (!projectRoot) {
    vscode.window.showErrorMessage(
      'ArkTS: 未找到 HarmonyOS 项目根（未发现 oh-package.json5）'
    );
    return undefined;
  }
  out.appendLine(`[项目] ${projectRoot}`);
  return projectRoot;
}

const DEVECO_CLI_PKG = '@deveco/deveco-cli';
const LANGUAGE_SERVER_SPEC = '@arkts/language-server@1.3.10';

/**
 * 确保语言服务器已安装到 installDir（扩展数据目录），返回 bin 路径；失败返回 undefined。
 * 检测到已存在则直接复用；缺失时 npm install --prefix 安装。
 */
export async function ensureLanguageServer(installDir: string): Promise<string | undefined> {
  const binPath = path.join(
    installDir, 'node_modules', '@arkts', 'language-server', 'bin', 'ets-language-server.js'
  );
  if (fs.existsSync(binPath)) return binPath;

  const out = getOutputChannel();
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'ArkTS: 正在安装语言服务器（首次约 1 分钟）...' },
      async () => {
        fs.mkdirSync(installDir, { recursive: true });
        out.show(true);
        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        await execWithOutput(out, npmCmd, ['install', '--prefix', installDir, LANGUAGE_SERVER_SPEC], { timeoutMs: 600_000 });
      }
    );
    if (fs.existsSync(binPath)) return binPath;
    throw new Error('安装完成后未找到语言服务器入口');
  } catch (error: any) {
    vscode.window
      .showErrorMessage(
        `ArkTS: 语言服务器安装失败 - ${error.message}。可手动执行: npm install --prefix "${installDir}" ${LANGUAGE_SERVER_SPEC}`,
        '复制命令'
      )
      .then((choice) => {
        if (choice === '复制命令') {
          vscode.env.clipboard.writeText(`npm install --prefix "${installDir}" ${LANGUAGE_SERVER_SPEC}`);
        }
      });
    return undefined;
  }
}

/** 执行命令，stdout/stderr 实时写入输出面板；非 0 退出码或 spawn 失败时 reject */
function execWithOutput(out: vscode.OutputChannel, cmd: string, args: string[], opts: { cwd?: string; timeoutMs: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    out.appendLine(`\n$ ${cmd} ${args.join(' ')}`);
    const child = execFile(cmd, args, {
      cwd: opts.cwd,
      timeout: opts.timeoutMs,
      maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, FORCE_COLOR: '0' }, // 去掉 ANSI 颜色，避免输出面板乱码
    }, (error, _stdout, stderr) => {
      if (error) {
        reject(new Error((error as any).killed ? '命令超时' : stderr?.trim() || error.message));
      }
    });
    child.stdout?.on('data', (d) => out.append(d.toString()));
    child.stderr?.on('data', (d) => out.append(d.toString()));
    child.on('error', (err) => {
      if ((err as any).code === 'ENOENT') {
        reject(new Error(`找不到命令 ${cmd}`));
      } else {
        reject(new Error(`无法执行 ${cmd}: ${err.message}`));
      }
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
    });
  });
}

/** 在项目根执行 devecocli */
function runDevecocli(out: vscode.OutputChannel, args: string[], cwd: string, timeoutMs: number): Promise<void> {
  return execWithOutput(out, 'devecocli', args, { cwd, timeoutMs });
}

/** 检测 devecocli 是否可用（PATH 中） */
function isDevecoCliInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    execFile('devecocli', ['--version'], { timeout: 10_000 }, (err) => resolve(!err));
  });
}

/**
 * 确保 devecocli 可用；未安装则自动全局安装（扩展激活时调用）。
 * 也作为 arkts.installDevecoCli 命令的手动入口。
 */
export async function ensureDevecoCli(): Promise<void> {
  let installed = false;
  try {
    installed = await isDevecoCliInstalled();
  } catch {
    /* 探测失败按未安装处理，走自动安装 */
  }
  if (installed) return;

  const out = getOutputChannel();
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'ArkTS: 正在安装 devecocli 工具（首次需 1-2 分钟）...' },
      async () => {
        out.show(true);
        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        await execWithOutput(out, npmCmd, ['install', '-g', DEVECO_CLI_PKG], { timeoutMs: 600_000 });
      }
    );
    vscode.window.showInformationMessage('ArkTS: devecocli 安装完成，现在可以使用"编译/运行"按钮了');
  } catch (error: any) {
    vscode.window
      .showErrorMessage(
        `ArkTS: devecocli 自动安装失败 - ${error.message}。可手动执行: npm install -g ${DEVECO_CLI_PKG}`,
        '复制命令'
      )
      .then((choice) => {
        if (choice === '复制命令') {
          vscode.env.clipboard.writeText(`npm install -g ${DEVECO_CLI_PKG}`);
        }
      });
  }
}

/** 构建版本选项（编译前 QuickPick 选择） */
const BUILD_MODES: vscode.QuickPickItem[] = [
  { label: 'default', description: '默认构建（产品 default · debug 构建模式）' },
  { label: 'debug', description: 'debug 构建模式' },
  { label: 'release', description: 'release 构建模式' },
];

/** workspaceState 键：记住上次选择的构建版本（按工作区持久化，编译/运行共用） */
const LAST_BUILD_MODE_KEY = 'arkts.lastBuildMode';

/**
 * 弹出构建版本 QuickPick（上次选择置顶，回车即复用），选择后写入 workspaceState；
 * 用户取消时返回 undefined。仅「构建模式」按钮（arkts.selectBuildMode）调用。
 */
async function pickBuildMode(state: vscode.Memento, title: string): Promise<string | undefined> {
  const lastMode = state.get<string>(LAST_BUILD_MODE_KEY);
  const items = lastMode
    ? [BUILD_MODES.find((m) => m.label === lastMode)!, ...BUILD_MODES.filter((m) => m.label !== lastMode)]
    : BUILD_MODES;
  const mode = await vscode.window.showQuickPick(items, {
    placeHolder: `选择构建版本${lastMode ? `（上次：${lastMode}）` : ''}`,
    title,
  });
  if (!mode) return undefined; // 用户取消
  await state.update(LAST_BUILD_MODE_KEY, mode.label);
  return mode.label;
}

/** 选择构建模式（arkts.selectBuildMode）→ 弹出 QuickPick 并写入 workspaceState，供编译/运行复用 */
export async function selectBuildMode(state: vscode.Memento): Promise<void> {
  const mode = await pickBuildMode(state, 'ArkTS: 选择构建模式');
  if (!mode) return;
  vscode.window.showInformationMessage(`ArkTS: 构建模式已设为 ${mode}`);
}

/** 编译（arkts.buildApp）→ devecocli build（直接使用「构建模式」预设的值，未设置时默认 default） */
export async function buildApp(state: vscode.Memento): Promise<void> {
  const out = getOutputChannel();
  out.show(true);
  const projectRoot = resolveProject(out);
  if (!projectRoot) return;

  const mode = state.get<string>(LAST_BUILD_MODE_KEY) ?? 'default';
  const args = mode === 'default' ? ['build'] : ['build', '--build-mode', mode];
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `ArkTS: 编译中（${mode}）...` },
      () => runDevecocli(out, args, projectRoot, 600_000)
    );
    out.appendLine(`[编译] 完成（${mode}）`);
    vscode.window.showInformationMessage(`ArkTS: 编译完成（${mode}）`);
  } catch (error: any) {
    const hint = error.message.includes('找不到命令 devecocli')
      ? '（devecocli 未安装，插件会自动安装，或运行 "ArkTS: 安装 deveco-cli"）'
      : '';
    out.appendLine(`[失败] ${error.message}${hint}`);
    vscode.window.showErrorMessage(`ArkTS: 编译失败 - ${error.message}${hint}`);
  }
}

/** 运行（arkts.runApp）→ devecocli run（编译+安装+启动，直接使用「构建模式」预设的值） */
export async function runApp(state: vscode.Memento): Promise<void> {
  const out = getOutputChannel();
  out.show(true);
  const projectRoot = resolveProject(out);
  if (!projectRoot) return;

  const mode = state.get<string>(LAST_BUILD_MODE_KEY) ?? 'default';
  const args = mode === 'default' ? ['run'] : ['run', '--build-mode', mode];
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `ArkTS: 构建并运行（${mode}）...` },
      () => runDevecocli(out, args, projectRoot, 900_000)
    );
    out.appendLine(`[运行] 完成（${mode}）`);
    vscode.window.showInformationMessage(`ArkTS: 运行完成（${mode}）`);
  } catch (error: any) {
    const hint = error.message.includes('找不到命令 devecocli')
      ? '（devecocli 未安装，插件会自动安装，或运行 "ArkTS: 安装 deveco-cli"）'
      : '';
    out.appendLine(`[失败] ${error.message}${hint}`);
    vscode.window.showErrorMessage(`ArkTS: 运行失败 - ${error.message}${hint}`);
  }
}

/** 签名（arkts.signApp）→ devecocli signature generate（生成签名材料并写入项目配置） */
export async function signApp(): Promise<void> {
  const out = getOutputChannel();
  out.show(true);
  const projectRoot = resolveProject(out);
  if (!projectRoot) return;

  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'ArkTS: 生成签名中...' },
      () => runDevecocli(out, ['signature', 'generate'], projectRoot, 600_000)
    );
    out.appendLine('[签名] 完成');
    vscode.window.showInformationMessage('ArkTS: 签名完成');
  } catch (error: any) {
    const hint = error.message.includes('找不到命令 devecocli')
      ? '（devecocli 未安装，插件会自动安装，或运行 "ArkTS: 安装 deveco-cli"）'
      : '';
    out.appendLine(`[失败] ${error.message}${hint}`);
    vscode.window.showErrorMessage(`ArkTS: 签名失败 - ${error.message}${hint}`);
  }
}
