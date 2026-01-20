import * as vscode from 'vscode';
import {
    DECORATORS,
    COMPONENTS,
    ATTRIBUTES,
    IMPORT_SNIPPETS,
    COMPONENT_LIFECYCLE_SNIPPETS,
    UIABILITY_LIFECYCLE_SNIPPETS,
    KEYWORDS_COMMON,
    KEYWORDS_FULL,
    KEYWORDS_ARKTS_ONLY,
} from '../config';

/**
 * ArkTS 代码补全提供器
 * 提供 ArkTS 特有的代码补全功能
 */
export class ArkTSCompletionProvider implements vscode.CompletionItemProvider {

    private isLifecycleSnippetsEnabled(): boolean {
        const config = vscode.workspace.getConfiguration('arkts');
        return config.get<boolean>('completion.enableLifecycleSnippets', true) !== false;
    }

    private isWithinBlock(text: string, blockStartIndex: number, cursorIndex: number): boolean {
        if (blockStartIndex < 0 || cursorIndex < 0 || cursorIndex <= blockStartIndex) {
            return false;
        }

        const slice = text.slice(blockStartIndex, cursorIndex);
        let depth = 0;
        for (const ch of slice) {
            if (ch === '{') depth++;
            else if (ch === '}') depth--;
        }
        return depth > 0;
    }

    private isUIAbilityContext(document: vscode.TextDocument, position: vscode.Position): boolean {
        const text = document.getText();
        const cursorIndex = document.offsetAt(position);

        // Find the last "class X extends UIAbility" before cursor
        const head = text.slice(0, cursorIndex);
        const classRegex = /class\s+\w+\s+extends\s+UIAbility\b/g;
        let lastMatch: RegExpExecArray | null = null;
        let match: RegExpExecArray | null;
        while ((match = classRegex.exec(head)) !== null) {
            lastMatch = match;
        }
        if (!lastMatch) {
            return false;
        }

        const braceIndex = head.indexOf('{', lastMatch.index + lastMatch[0].length);
        if (braceIndex === -1) {
            return false;
        }
        return this.isWithinBlock(text, braceIndex, cursorIndex);
    }

    private isStructComponentContext(document: vscode.TextDocument, position: vscode.Position): boolean {
        const text = document.getText();
        const cursorIndex = document.offsetAt(position);

        // Find the last "struct Name {" before cursor
        const head = text.slice(0, cursorIndex);
        const structRegex = /\bstruct\s+\w+\s*\{/g;
        let lastMatch: RegExpExecArray | null = null;
        let match: RegExpExecArray | null;
        while ((match = structRegex.exec(head)) !== null) {
            lastMatch = match;
        }
        if (!lastMatch) {
            return false;
        }

        const braceIndex = lastMatch.index + lastMatch[0].lastIndexOf('{');
        return this.isWithinBlock(text, braceIndex, cursorIndex);
    }

    private isImportContext(linePrefix: string): boolean {
        const trimmed = linePrefix.trimStart();
        // 用户刚开始输入 import（例如: "im" / "imp" / "import"）
        if (/^im\w*$/.test(trimmed)) {
            return true;
        }
        // 已经在 import 语句中
        if (/^import\b/.test(trimmed)) {
            return true;
        }
        return false;
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {

        const config = vscode.workspace.getConfiguration('arkts');
        if (config.get<boolean>('enableAutoComplete', true) === false) {
            return;
        }
        
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        const items: vscode.CompletionItem[] = [];

        // 如果以 @ 开头，提供装饰器补全
        if (linePrefix.endsWith('@') || context.triggerCharacter === '@') {
            return this.getDecoratorCompletions();
        }

        // 如果以 . 开头，提供属性方法补全
        if (linePrefix.endsWith('.') || context.triggerCharacter === '.') {
            return this.getAttributeCompletions();
        }

        // 默认提供组件和关键字补全
        const completions: vscode.CompletionItem[] = [
            ...this.getComponentCompletions(),
            ...this.getKeywordCompletions(),
        ];

        if (this.isImportContext(linePrefix)) {
            completions.unshift(...this.getImportSnippetCompletions());
        }

        if (this.isLifecycleSnippetsEnabled()) {
            if (this.isUIAbilityContext(document, position)) {
                completions.unshift(...this.getLifecycleSnippetCompletions(UIABILITY_LIFECYCLE_SNIPPETS, 'a_uiability_'));
            } else if (this.isStructComponentContext(document, position)) {
                completions.unshift(...this.getLifecycleSnippetCompletions(COMPONENT_LIFECYCLE_SNIPPETS, 'a_component_'));
            }
        }

        return completions;
    }

    private getLifecycleSnippetCompletions(snippets: { name: string; description: string; snippet?: string }[], sortPrefix: string): vscode.CompletionItem[] {
        return snippets.map(s => {
            const item = new vscode.CompletionItem(s.name, vscode.CompletionItemKind.Method);
            item.insertText = new vscode.SnippetString(s.snippet ?? '');
            item.detail = s.description;
            item.documentation = new vscode.MarkdownString(`**${s.name}**\n\n${s.description}`);
            item.sortText = `${sortPrefix}${s.name}`;
            return item;
        });
    }

    private getImportSnippetCompletions(): vscode.CompletionItem[] {
        const config = vscode.workspace.getConfiguration('arkts');
        if (config.get<boolean>('completion.enableImportSnippets', true) === false) {
            return [];
        }

        return IMPORT_SNIPPETS.map(snippet => {
            const item = new vscode.CompletionItem(
                snippet.name,
                vscode.CompletionItemKind.Snippet
            );
            item.insertText = new vscode.SnippetString(snippet.snippet ?? '');
            item.detail = snippet.description;
            item.documentation = new vscode.MarkdownString(`**${snippet.name}**\n\n${snippet.description}`);
            item.sortText = `a_${snippet.name}`;
            return item;
        });
    }

    private getDecoratorCompletions(): vscode.CompletionItem[] {
        return DECORATORS.map(decorator => {
            const item = new vscode.CompletionItem(
                decorator.name,
                vscode.CompletionItemKind.Keyword
            );
            item.insertText = decorator.name.substring(1); // 去掉 @，因为用户已经输入了
            item.detail = decorator.description;
            item.documentation = new vscode.MarkdownString(`**${decorator.name}**\n\n${decorator.description}`);
            return item;
        });
    }

    private getComponentCompletions(): vscode.CompletionItem[] {
        return COMPONENTS.map(comp => {
            const item = new vscode.CompletionItem(
                comp.name,
                vscode.CompletionItemKind.Class
            );
            item.insertText = new vscode.SnippetString(comp.snippet!);
            item.detail = `ArkTS 组件: ${comp.description}`;
            item.documentation = new vscode.MarkdownString(`**${comp.name}**\n\n${comp.description}`);
            return item;
        });
    }

    private getAttributeCompletions(): vscode.CompletionItem[] {
        return ATTRIBUTES.map(attr => {
            const item = new vscode.CompletionItem(
                attr.name,
                vscode.CompletionItemKind.Method
            );
            item.insertText = new vscode.SnippetString(attr.snippet!.substring(1)); // 去掉开头的 .
            item.detail = attr.description;
            item.documentation = new vscode.MarkdownString(`**${attr.name}**\n\n${attr.description}`);
            return item;
        });
    }

    private getKeywordCompletions(): vscode.CompletionItem[] {
        const config = vscode.workspace.getConfiguration('arkts');
        if (config.get<boolean>('completion.enableKeywords', true) === false) {
            return [];
        }

        const mode = config.get<'common' | 'full' | 'arkts'>('completion.keywordMode', 'common');
        const keywords = mode === 'full'
            ? KEYWORDS_FULL
            : mode === 'arkts'
                ? KEYWORDS_ARKTS_ONLY
                : KEYWORDS_COMMON;

        return keywords.map(kw => {
            const item = new vscode.CompletionItem(
                kw.name,
                vscode.CompletionItemKind.Keyword
            );
            item.insertText = new vscode.SnippetString(kw.snippet!);
            item.detail = kw.description;
            item.documentation = new vscode.MarkdownString(`**${kw.name}**\n\n${kw.description}`);
            // 设置排序优先级（关键字稍低于组件）
            item.sortText = `z_${kw.name}`;
            return item;
        });
    }
}
