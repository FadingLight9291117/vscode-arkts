import * as vscode from 'vscode';
import { MCPServer } from '../server';

/**
 * Project Info UI that uses MCP tools to display project information
 */
export class ProjectInfoUI {
  constructor(private mcpServer: MCPServer) {}

  async show(): Promise<void> {
    try {
      // Get workspace folder
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('No workspace folder open');
        return;
      }

      const projectPath = workspaceFolders[0].uri.fsPath;

      // Call MCP tool to get project info
      const result = await this.mcpServer.callTool('harmonyos_get_project_info', {
        projectPath: projectPath
      });

      if (result.isError) {
        vscode.window.showErrorMessage(`Failed to get project info: ${result.content[0].text}`);
        return;
      }

      // Parse project info
      const projectInfo = JSON.parse(result.content[0].text);

      // Get modules info
      const modulesResult = await this.mcpServer.callTool('harmonyos_list_modules', {
        projectPath: projectPath
      });

      let modulesInfo = '';
      if (!modulesResult.isError) {
        const modules = JSON.parse(modulesResult.content[0].text);
        modulesInfo = '\n\n**Modules:**\n' + modules.map((m: any) => 
          `- ${m.name} (${m.type})`
        ).join('\n');
      }

      // Create and show information panel
      const panel = vscode.window.createWebviewPanel(
        'harmonyosProjectInfo',
        'HarmonyOS Project Info',
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = this.getWebviewContent(projectInfo, modulesInfo);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error getting project info: ${error.message}`);
    }
  }

  private getWebviewContent(projectInfo: any, modulesInfo: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
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
          }
          .info-item {
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
          }
          .value {
            margin-left: 10px;
          }
        </style>
      </head>
      <body>
        <h1>📱 HarmonyOS Project Information</h1>
        <div class="info-item">
          <span class="label">Bundle Name:</span>
          <span class="value">${projectInfo.bundleName}</span>
        </div>
        <div class="info-item">
          <span class="label">Version:</span>
          <span class="value">${projectInfo.versionName} (${projectInfo.versionCode})</span>
        </div>
        <div class="info-item">
          <span class="label">Target API:</span>
          <span class="value">${projectInfo.targetAPIVersion || 'N/A'}</span>
        </div>
        <div class="info-item">
          <span class="label">API Release Type:</span>
          <span class="value">${projectInfo.apiReleaseType || 'N/A'}</span>
        </div>
        ${modulesInfo.replace(/\n/g, '<br>').replace(/\*\*/g, '')}
      </body>
      </html>
    `;
  }
}
