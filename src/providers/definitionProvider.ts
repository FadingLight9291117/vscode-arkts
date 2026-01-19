import * as vscode from 'vscode';

/**
 * ArkTS 定义跳转提供器
 * 支持跳转到组件、变量的定义位置
 */
export class ArkTSDefinitionProvider implements vscode.DefinitionProvider {
    
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);
        const text = document.getText();

        // 辅助函数：创建精确指向 word 的 Location
        const createLocationForWord = (matchIndex: number, matchedText: string): vscode.Location => {
            // 在匹配的文本中找到 word 的位置
            const wordIndexInMatch = matchedText.indexOf(word);
            const wordStartIndex = matchIndex + wordIndexInMatch;
            const wordEndIndex = wordStartIndex + word.length;
            
            const startPos = document.positionAt(wordStartIndex);
            const endPos = document.positionAt(wordEndIndex);
            
            return new vscode.Location(document.uri, new vscode.Range(startPos, endPos));
        };

        // 查找 struct 定义
        const structRegex = new RegExp(`struct\\s+${word}\\s*\\{`, 'g');
        let match = structRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 V1 状态变量定义: @State, @Prop, @Link 等
        const v1VarRegex = new RegExp(`@(State|Prop|Link|Provide|Consume|Watch|ObjectLink|StorageLink|StorageProp|LocalStorageLink|LocalStorageProp|Track)\\s+${word}\\s*:`, 'g');
        match = v1VarRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 V2 状态变量定义: @Local, @Param 等
        const v2VarRegex = new RegExp(`@(Local|Param|Once|Event|Provider|Consumer|Computed|Trace)\\s+${word}\\s*:?`, 'g');
        match = v2VarRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找普通变量定义
        const normalVarRegex = new RegExp(`(let|const|var)\\s+${word}\\s*[=:]`, 'g');
        match = normalVarRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找私有/公有成员变量定义
        const memberVarRegex = new RegExp(`(private|public|protected)?\\s*${word}\\s*:\\s*\\w+`, 'g');
        match = memberVarRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找函数定义
        const funcRegex = new RegExp(`function\\s+${word}\\s*\\(`, 'g');
        match = funcRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找方法定义 (类/struct 内的方法)
        const methodRegex = new RegExp(`^\\s*${word}\\s*\\([^)]*\\)\\s*\\{`, 'gm');
        match = methodRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找箭头函数定义
        const arrowFuncRegex = new RegExp(`(const|let|var)\\s+${word}\\s*=\\s*\\([^)]*\\)\\s*=>`, 'g');
        match = arrowFuncRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 @Builder 函数定义
        const builderRegex = new RegExp(`@Builder\\s+${word}\\s*\\(`, 'g');
        match = builderRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 @Styles 定义
        const stylesRegex = new RegExp(`@Styles\\s+${word}\\s*\\(`, 'g');
        match = stylesRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 @Extend 定义
        const extendRegex = new RegExp(`@Extend\\s*\\(\\w+\\)\\s+function\\s+${word}\\s*\\(`, 'g');
        match = extendRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        return null;
    }
}
