import * as vscode from 'vscode';
import { ArkTSCompletionProvider } from './providers/completionProvider';
import { ArkTSHoverProvider } from './providers/hoverProvider';
import { ArkTSDefinitionProvider } from './providers/definitionProvider';
import { ArkTSReferenceProvider } from './providers/referenceProvider';
import { ArkTSDiagnosticsProvider } from './providers/diagnosticsProvider';

// 插件激活时调用
export function activate(context: vscode.ExtensionContext) {
    console.log('ArkTS Language Support 插件已激活');

    // 注册语言选择器
    const arktsSelector: vscode.DocumentSelector = { language: 'arkts', scheme: 'file' };

    // 注册代码补全提供器
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        arktsSelector,
        new ArkTSCompletionProvider(),
        '.', '@' // 触发字符
    );

    // 注册悬停提示提供器
    const hoverProvider = vscode.languages.registerHoverProvider(
        arktsSelector,
        new ArkTSHoverProvider()
    );

    // 注册定义跳转提供器
    const definitionProvider = vscode.languages.registerDefinitionProvider(
        arktsSelector,
        new ArkTSDefinitionProvider()
    );

    // 注册引用查找提供器
    const referenceProvider = vscode.languages.registerReferenceProvider(
        arktsSelector,
        new ArkTSReferenceProvider()
    );

    // 注册命令
    const helloWorldCommand = vscode.commands.registerCommand('arkts.helloWorld', () => {
        vscode.window.showInformationMessage('Hello from ArkTS Extension!');
    });

    // 注册格式化命令
    const formatCommand = vscode.commands.registerCommand('arkts.formatDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            vscode.window.showInformationMessage('ArkTS 文档格式化功能（待实现）');
        }
    });

    // 实时诊断（Problems 面板提示）
    const diagnosticsProvider = new ArkTSDiagnosticsProvider();

    // 监听文档变化，进行实时诊断
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'arkts') {
            diagnosticsProvider.updateDiagnostics(event.document);
        }
    });

    // 监听文档打开
    const documentOpenListener = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'arkts') {
            diagnosticsProvider.updateDiagnostics(document);
        }
    });

    // 配置项变化时，刷新已打开的 ArkTS 文档诊断
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('arkts.diagnostics')) {
            diagnosticsProvider.refreshAllOpenDocuments();
        }
    });

    // 将所有订阅添加到 context.subscriptions
    context.subscriptions.push(
        completionProvider,
        hoverProvider,
        definitionProvider,
        referenceProvider,
        helloWorldCommand,
        formatCommand,
        diagnosticsProvider.collection,
        documentChangeListener,
        documentOpenListener,
        configChangeListener
    );

    // 激活后对已打开文档做一次诊断
    diagnosticsProvider.refreshAllOpenDocuments();
}

// 插件停用时调用
export function deactivate() {
    console.log('ArkTS Language Support 插件已停用');
}
