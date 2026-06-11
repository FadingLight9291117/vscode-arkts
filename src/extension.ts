import * as vscode from 'vscode';
import { ArkTSCompletionProvider } from './providers/completionProvider';
import { ArkTSHoverProvider } from './providers/hoverProvider';
import { ArkTSDefinitionProvider } from './providers/definitionProvider';
import { ArkTSReferenceProvider } from './providers/referenceProvider';
import { ArkTSDiagnosticsProvider } from './providers/diagnosticsProvider';
import { MCPServer } from './mcp/server';
import { DevicePickerUI } from './mcp/ui/devicePicker';
import { ProjectInfoUI } from './mcp/ui/projectInfo';

const DIAGNOSTICS_DEBOUNCE_MS = 250;

export async function activate(context: vscode.ExtensionContext) {
    console.log('ArkTS Language Support 插件已激活');

    const mcpServer = new MCPServer();
    await mcpServer.start();

    const arktsSelector: vscode.DocumentSelector = { language: 'arkts', scheme: 'file' };

    const completionProvider = vscode.languages.registerCompletionItemProvider(
        arktsSelector,
        new ArkTSCompletionProvider(),
        '.', '@'
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        arktsSelector,
        new ArkTSHoverProvider()
    );

    const definitionProvider = vscode.languages.registerDefinitionProvider(
        arktsSelector,
        new ArkTSDefinitionProvider()
    );

    const referenceProvider = vscode.languages.registerReferenceProvider(
        arktsSelector,
        new ArkTSReferenceProvider()
    );

    const devicePickerUI = new DevicePickerUI(mcpServer);
    const selectDeviceCommand = vscode.commands.registerCommand('arkts.selectDevice', async () => {
        await devicePickerUI.show();
    });

    const projectInfoUI = new ProjectInfoUI(mcpServer);
    const showProjectInfoCommand = vscode.commands.registerCommand('arkts.showProjectInfo', async () => {
        await projectInfoUI.show();
    });

    const diagnosticsProvider = new ArkTSDiagnosticsProvider();

    // Per-document debounce so we don't re-scan on every keystroke
    const debounceTimers = new Map<string, NodeJS.Timeout>();
    const scheduleDiagnostics = (document: vscode.TextDocument) => {
        const key = document.uri.toString();
        const existing = debounceTimers.get(key);
        if (existing) clearTimeout(existing);
        debounceTimers.set(key, setTimeout(() => {
            debounceTimers.delete(key);
            diagnosticsProvider.updateDiagnostics(document);
        }, DIAGNOSTICS_DEBOUNCE_MS));
    };

    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'arkts') {
            scheduleDiagnostics(event.document);
        }
    });

    const documentOpenListener = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'arkts') {
            diagnosticsProvider.updateDiagnostics(document);
        }
    });

    const documentCloseListener = vscode.workspace.onDidCloseTextDocument(document => {
        const key = document.uri.toString();
        const timer = debounceTimers.get(key);
        if (timer) {
            clearTimeout(timer);
            debounceTimers.delete(key);
        }
        diagnosticsProvider.collection.delete(document.uri);
    });

    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('arkts.diagnostics')) {
            diagnosticsProvider.refreshAllOpenDocuments();
        }
    });

    context.subscriptions.push(
        mcpServer,
        completionProvider,
        hoverProvider,
        definitionProvider,
        referenceProvider,
        selectDeviceCommand,
        showProjectInfoCommand,
        diagnosticsProvider.collection,
        documentChangeListener,
        documentOpenListener,
        documentCloseListener,
        configChangeListener,
        { dispose: () => debounceTimers.forEach(t => clearTimeout(t)) }
    );

    diagnosticsProvider.refreshAllOpenDocuments();
}

export function deactivate() {
    console.log('ArkTS Language Support 插件已停用');
}
