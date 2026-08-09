import * as vscode from 'vscode';
import { MCPServer } from '../server';

/**
 * Project Info UI that uses MCP tools to display project information.
 * 并行获取项目信息、模块列表、依赖，渲染为结构化面板。
 */
export class ProjectInfoUI {
  constructor(private mcpServer: MCPServer) {}

  async show(): Promise<void> {
    try {
      // Get workspace folder
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('未打开工作区文件夹');
        return;
      }

      const projectPath = workspaceFolders[0].uri.fsPath;

      // 并行获取：项目信息 / 模块 / 依赖（各自失败时回退为空，不阻断整体展示）
      const [infoResult, modulesResult, depsResult] = await Promise.all([
        this.mcpServer.callTool('harmonyos_get_project_info', { projectPath }),
        this.mcpServer.callTool('harmonyos_list_modules', { projectPath }),
        this.mcpServer.callTool('harmonyos_list_dependencies', { projectPath }),
      ]);

      let projectInfo: any = {};
      if (!infoResult.isError) {
        projectInfo = JSON.parse(infoResult.content[0].text);
      }

      let modules: any[] = [];
      if (!modulesResult.isError) {
        modules = JSON.parse(modulesResult.content[0].text);
      }

      let deps: any = null;
      if (!depsResult.isError) {
        deps = JSON.parse(depsResult.content[0].text);
      }

      const panel = vscode.window.createWebviewPanel(
        'harmonyosProjectInfo',
        'HarmonyOS 项目信息',
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = this.getWebviewContent(projectPath, projectInfo, modules, deps);
    } catch (error: any) {
      vscode.window.showErrorMessage(`获取项目信息失败: ${error.message}`);
    }
  }

  private escapeHtml(s: any): string {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private getWebviewContent(projectPath: string, info: any, modules: any[], deps: any): string {
    const esc = (s: any) => this.escapeHtml(s);

    // 依赖：根依赖表 + dev 依赖数量
    const rootDeps = deps?.root?.dependencies;
    const depRows = rootDeps && Object.keys(rootDeps).length > 0
      ? Object.entries(rootDeps).map(([k, v]) =>
          `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')
      : '<tr><td colspan="2" class="muted">（无依赖）</td></tr>';
    const devCount = deps?.root?.devDependencies ? Object.keys(deps.root.devDependencies).length : 0;

    // 模块表
    const moduleRows = modules.length > 0
      ? modules.map((m: any) =>
          `<tr><td>${esc(m.name)}</td><td>${esc(m.type)}</td><td>${esc(m.srcPath ?? m.path)}</td></tr>`).join('')
      : '<tr><td colspan="3" class="muted">（无模块信息）</td></tr>';

    // 产品表
    const products = info.products ?? [];
    const productRows = products.length > 0
      ? products.map((p: any) =>
          `<tr><td>${esc(p.name)}</td><td>${esc(p.signingConfig ?? '—')}</td><td>${esc(p.compatibleSdkVersion ?? '—')}</td><td>${esc(p.runtimeOS ?? '—')}</td></tr>`).join('')
      : '<tr><td colspan="4" class="muted">（无产品配置）</td></tr>';

    // 签名配置
    const signingConfigs = (info.signingConfigs ?? [])
      .map((s: any) => `${esc(s.name)}${s.type ? `（${esc(s.type)}）` : ''}`)
      .join('、') || '（未配置）';

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HarmonyOS Project Info</title>
        <style>
          body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
          }
          h1 {
            color: var(--vscode-textLink-foreground);
            margin-bottom: 4px;
          }
          .path {
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin-bottom: 16px;
            word-break: break-all;
          }
          h2 {
            font-size: 14px;
            margin: 20px 0 8px;
            color: var(--vscode-textLink-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 4px;
          }
          .info-item { margin: 6px 0; }
          .label { font-weight: bold; }
          .value { margin-left: 10px; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th, td {
            text-align: left;
            padding: 4px 8px;
            border-bottom: 1px solid var(--vscode-panel-border);
          }
          th { color: var(--vscode-descriptionForeground); font-weight: normal; }
          .muted { color: var(--vscode-descriptionForeground); }
        </style>
      </head>
      <body>
        <h1>📱 HarmonyOS 项目信息</h1>
        <div class="path">${esc(projectPath)}</div>

        <h2>基本信息</h2>
        <div class="info-item"><span class="label">Bundle Name:</span><span class="value">${esc(info.bundleName)}</span></div>
        <div class="info-item"><span class="label">版本:</span><span class="value">${esc(info.versionName)}（${esc(info.versionCode)}）</span></div>
        <div class="info-item"><span class="label">兼容最低版本:</span><span class="value">${esc(info.minCompatibleVersionCode ?? '—')}</span></div>
        <div class="info-item"><span class="label">Target API:</span><span class="value">${esc(info.targetAPIVersion ?? '—')}</span></div>
        <div class="info-item"><span class="label">API Release Type:</span><span class="value">${esc(info.apiReleaseType ?? '—')}</span></div>

        <h2>构建产品</h2>
        <table>
          <tr><th>名称</th><th>签名配置</th><th>兼容 SDK</th><th>运行系统</th></tr>
          ${productRows}
        </table>

        <h2>签名配置</h2>
        <div class="info-item"><span class="value">${signingConfigs}</span></div>

        <h2>模块（${modules.length}）</h2>
        <table>
          <tr><th>名称</th><th>类型</th><th>路径</th></tr>
          ${moduleRows}
        </table>

        <h2>根依赖（${rootDeps ? Object.keys(rootDeps).length : 0}${devCount > 0 ? `，dev ${devCount}` : ''}）</h2>
        <table>
          <tr><th>包名</th><th>版本</th></tr>
          ${depRows}
        </table>
      </body>
      </html>
    `;
  }
}
