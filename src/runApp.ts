import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { execFile } from 'child_process';

/**
 * 编辑器标题栏按钮（arkts.buildApp / arkts.runApp）：
 * 通过 devecocli 编译 / 构建并运行，自动识别项目根。
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

/** 编译（arkts.buildApp）→ devecocli build */
export async function buildApp(): Promise<void> {
  const out = getOutputChannel();
  out.show(true);
  const projectRoot = resolveProject(out);
  if (!projectRoot) return;

  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'ArkTS: 编译中...' },
      () => runDevecocli(out, ['build'], projectRoot, 600_000)
    );
    out.appendLine('[编译] 完成');
    vscode.window.showInformationMessage('ArkTS: 编译完成');
  } catch (error: any) {
    const hint = error.message.includes('找不到命令 devecocli')
      ? '（devecocli 未安装，插件会自动安装，或运行 "ArkTS: 安装 deveco-cli"）'
      : '';
    out.appendLine(`[失败] ${error.message}${hint}`);
    vscode.window.showErrorMessage(`ArkTS: 编译失败 - ${error.message}${hint}`);
  }
}

/** 运行（arkts.runApp）→ devecocli run（编译+安装+启动） */
export async function runApp(): Promise<void> {
  const out = getOutputChannel();
  out.show(true);
  const projectRoot = resolveProject(out);
  if (!projectRoot) return;

  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'ArkTS: 构建并运行...' },
      () => runDevecocli(out, ['run'], projectRoot, 900_000)
    );
    out.appendLine('[运行] 完成');
    vscode.window.showInformationMessage('ArkTS: 运行完成');
  } catch (error: any) {
    const hint = error.message.includes('找不到命令 devecocli')
      ? '（devecocli 未安装，插件会自动安装，或运行 "ArkTS: 安装 deveco-cli"）'
      : '';
    out.appendLine(`[失败] ${error.message}${hint}`);
    vscode.window.showErrorMessage(`ArkTS: 运行失败 - ${error.message}${hint}`);
  }
}
