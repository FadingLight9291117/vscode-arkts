import * as vscode from 'vscode';

/**
 * ArkTS 引用查找提供器
 * 实现 Find All References 功能（当前文件内）
 */
export class ArkTSReferenceProvider implements vscode.ReferenceProvider {
    
    async provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Location[]> {
        
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return [];
        }

        const word = document.getText(wordRange);
        
        // 查找当前文件中的所有引用
        const locations = this.findReferencesInDocument(document, word);

        // 如果不包含定义位置，移除定义
        if (!context.includeDeclaration) {
            const defLocation = this.findDefinitionLocation(document, word);
            if (defLocation) {
                return locations.filter(loc => 
                    !(loc.uri.toString() === defLocation.uri.toString() && 
                      loc.range.start.line === defLocation.range.start.line)
                );
            }
        }

        return locations;
    }

    /**
     * 在文档中查找所有引用
     */
    private findReferencesInDocument(document: vscode.TextDocument, symbolName: string): vscode.Location[] {
        const text = document.getText();
        const locations: vscode.Location[] = [];
        
        // 使用正则查找所有出现的位置（完整单词匹配）
        const regex = new RegExp(`\\b${this.escapeRegex(symbolName)}\\b`, 'g');
        let match;

        while ((match = regex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + symbolName.length);
            
            locations.push(new vscode.Location(
                document.uri,
                new vscode.Range(startPos, endPos)
            ));
        }

        return locations;
    }

    /**
     * 查找符号的定义位置
     */
    private findDefinitionLocation(document: vscode.TextDocument, symbolName: string): vscode.Location | null {
        const text = document.getText();

        // 查找各种定义模式
        const patterns = [
            new RegExp(`(?:export\\s+)?struct\\s+${symbolName}\\s*\\{`),
            new RegExp(`(?:export\\s+)?class\\s+${symbolName}\\b`),
            new RegExp(`(?:export\\s+)?interface\\s+${symbolName}\\s*\\{`),
            new RegExp(`(?:export\\s+)?type\\s+${symbolName}\\s*=`),
            new RegExp(`(?:export\\s+)?enum\\s+${symbolName}\\s*\\{`),
            new RegExp(`(?:export\\s+)?function\\s+${symbolName}\\s*\\(`),
            new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${symbolName}\\s*[=:]`),
            new RegExp(`^\\s*(?:private|public|protected)?\\s*(?:async)?\\s*${symbolName}\\s*\\(`,'m'),
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match.index !== undefined) {
                const pos = document.positionAt(match.index);
                return new vscode.Location(document.uri, pos);
            }
        }

        return null;
    }

    /**
     * 转义正则表达式特殊字符
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
