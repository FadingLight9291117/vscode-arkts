import * as path from 'path';
import * as vscode from 'vscode';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node';
import type { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';
import { MCPServer } from './mcp/server';
import { DevicePickerUI } from './mcp/ui/devicePicker';
import { ProjectInfoUI } from './mcp/ui/projectInfo';

let client: LanguageClient | undefined;

function getServerBin(context: vscode.ExtensionContext): string {
    return path.join(context.extensionPath, 'node_modules', '@arkts', 'language-server', 'bin', 'ets-language-server.js');
}

function getSdkPath(): string {
    return vscode.workspace.getConfiguration('ets').get<string>('sdkPath', '');
}

function getHmsPath(): string {
    return vscode.workspace.getConfiguration('ets').get<string>('hmsPath', '');
}

async function startLanguageClient(context: vscode.ExtensionContext): Promise<void> {
    const sdkPath = getSdkPath();
    const hmsPath = getHmsPath();
    if (!sdkPath) {
        vscode.window.showWarningMessage(
            'ArkTS: 未配置 SDK 路径（ets.sdkPath），语言服务器未启动。',
            '打开设置'
        ).then(choice => {
            if (choice === '打开设置') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'ets.sdkPath');
            }
        });
        return;
    }

    const serverBin = getServerBin(context);
    const serverOptions: ServerOptions = {
        run: {
            module: serverBin,
            transport: TransportKind.ipc,
            options: { execArgv: [] },
        },
        debug: {
            module: serverBin,
            transport: TransportKind.ipc,
            options: { execArgv: ['--nolazy', '--inspect=6009'] },
        },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { language: 'ets', scheme: 'file' },
            { pattern: '**/*.json5', scheme: 'file' },
        ],
        outputChannel: vscode.window.createOutputChannel('ArkTS Language Server'),
        initializationOptions: {
            ets: { sdkPath, hmsPath: hmsPath || undefined },
        },
        synchronize: {
            fileEvents: [
                vscode.workspace.createFileSystemWatcher('**/*.ets'),
                vscode.workspace.createFileSystemWatcher('**/*.json5'),
            ],
        },
    };

    client = new LanguageClient(
        'ets-language-server',
        'ArkTS Language Server',
        serverOptions,
        clientOptions,
    );

    // 代理 ets/formatDocument 自定义请求给文档格式化提供器
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('ets', {
            async provideDocumentFormattingEdits(document) {
                if (!client?.isRunning()) return [];
                try {
                    const result = await client.sendRequest<{ code?: string; errors?: string[] } | undefined>(
                        'ets/formatDocument',
                        { textDocument: { uri: document.uri.toString(), text: document.getText() } },
                    );
                    if (!result?.code) return [];
                    if (result.errors && result.errors.length > 0) {
                        vscode.window.showErrorMessage(`ArkTS format error: ${result.errors.join(', ')}`);
                        return [];
                    }
                    return [vscode.TextEdit.replace(
                        new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length)),
                        result.code,
                    )];
                } catch (error) {
                    // server 不支持该请求或已断开时静默降级，不打断用户
                    console.error('ets/formatDocument failed:', error);
                    return [];
                }
            },
        }),
    );

    try {
        await client.start();
    } catch (error) {
        // 语言服务器启动失败只警告，不阻断插件激活（MCP 工具等仍需可用）
        console.error('ArkTS language server failed to start:', error);
        vscode.window.showWarningMessage(
            'ArkTS: 语言服务器启动失败，格式化/补全等功能不可用。可运行 "ArkTS: Restart Language Server" 重试。'
        );
    }
}

async function restartLanguageClient(context: vscode.ExtensionContext): Promise<void> {
    if (client) {
        await client.stop();
        client = undefined;
    }
    await startLanguageClient(context);
}

export async function activate(context: vscode.ExtensionContext) {
    const mcpServer = new MCPServer();
    await mcpServer.start();

    const devicePickerUI = new DevicePickerUI(mcpServer);
    const projectInfoUI = new ProjectInfoUI(mcpServer);

    context.subscriptions.push(
        mcpServer,
        vscode.commands.registerCommand('arkts.selectDevice', () => devicePickerUI.show()),
        vscode.commands.registerCommand('arkts.showProjectInfo', () => projectInfoUI.show()),
        vscode.commands.registerCommand('arkts.restartServer', () => restartLanguageClient(context)),
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('ets.sdkPath') || e.affectsConfiguration('ets.hmsPath')) {
                restartLanguageClient(context);
            }
        }),
    );

    await startLanguageClient(context);
}

export async function deactivate() {
    if (client) {
        await client.stop();
    }
}
