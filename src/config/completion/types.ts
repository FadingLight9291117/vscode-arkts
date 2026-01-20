/**
 * 代码补全相关类型定义
 */

export interface CompletionItem {
    name: string;
    description: string;
    snippet?: string;
}

/**
 * 去重补全项（后面的项覆盖前面的同名项）
 */
export function dedupeCompletionItems(items: CompletionItem[]): CompletionItem[] {
    const map = new Map<string, CompletionItem>();
    for (const item of items) {
        // later wins (so *_EXTRA can override base descriptions/snippets)
        map.set(item.name, item);
    }
    return Array.from(map.values());
}
