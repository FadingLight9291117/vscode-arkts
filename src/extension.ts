import * as vscode from 'vscode';
import { ArkTSCompletionProvider } from './providers/completionProvider';
import { ArkTSHoverProvider } from './providers/hoverProvider';
import { ArkTSDefinitionProvider } from './providers/definitionProvider';
import { ArkTSReferenceProvider } from './providers/referenceProvider';

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

    // 创建诊断集合（用于显示错误和警告）
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('arkts');
    
    // 监听文档变化，进行实时诊断
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'arkts') {
            updateDiagnostics(event.document, diagnosticCollection);
        }
    });

    // 监听文档打开
    const documentOpenListener = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'arkts') {
            updateDiagnostics(document, diagnosticCollection);
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
        diagnosticCollection,
        documentChangeListener,
        documentOpenListener
    );
}

// 更新诊断信息
function updateDiagnostics(document: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();

    // 示例：检查是否缺少 @Entry 装饰器
    if (text.includes('@Component') && !text.includes('@Entry') && text.includes('struct')) {
        // 这只是一个示例，实际中可能不需要每个组件都有 @Entry
    }

    // 示例：检查未使用的 @State 变量（简化版）
    const stateRegex = /@State\s+(\w+)/g;
    let match;
    while ((match = stateRegex.exec(text)) !== null) {
        const varName = match[1];
        const varUsageRegex = new RegExp(`\\b${varName}\\b`, 'g');
        const matches = text.match(varUsageRegex);
        
        // 如果变量只出现一次（声明时），可能未使用
        if (matches && matches.length === 1) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(startPos, endPos),
                `@State 变量 '${varName}' 可能未使用`,
                vscode.DiagnosticSeverity.Warning
            );
            diagnostic.source = 'arkts';
            diagnostics.push(diagnostic);
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

// 插件停用时调用
export function deactivate() {
    console.log('ArkTS Language Support 插件已停用');
}
