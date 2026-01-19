import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * ArkTS 定义跳转提供器
 * 支持跳转到组件、变量的定义位置
 * 支持跨文件 import 跳转
 */
export class ArkTSDefinitionProvider implements vscode.DefinitionProvider {
    
    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Definition | vscode.LocationLink[] | null> {
        
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);
        const text = document.getText();
        const line = document.lineAt(position.line).text;

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

        // ========== 跨文件 import 跳转 ==========
        const importResult = await this.handleImportJump(document, position, word, line);
        if (importResult) {
            return importResult;
        }

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
        // 支持：methodName()、private methodName()、async methodName()、methodName(): void
        const methodRegex = new RegExp(`^\\s*(?:private|public|protected)?\\s*(?:async)?\\s*${word}\\s*\\([^)]*\\)(?:\\s*:\\s*[\\w<>\\[\\]|]+)?\\s*\\{`, 'gm');
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

        // 查找 interface 定义
        const interfaceRegex = new RegExp(`interface\\s+${word}\\s*\\{`, 'g');
        match = interfaceRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 class 定义
        const classRegex = new RegExp(`class\\s+${word}\\s*(extends|implements|\\{)`, 'g');
        match = classRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 type 别名定义
        const typeRegex = new RegExp(`type\\s+${word}\\s*=`, 'g');
        match = typeRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // 查找 enum 定义
        const enumRegex = new RegExp(`enum\\s+${word}\\s*\\{`, 'g');
        match = enumRegex.exec(text);
        if (match) {
            return createLocationForWord(match.index, match[0]);
        }

        // ========== 跨文件符号查找（在 import 之外使用导入的符号） ==========
        const crossFileResult = await this.findSymbolInImportedFiles(document, word);
        if (crossFileResult) {
            return crossFileResult;
        }

        return null;
    }

    /**
     * 处理 import 语句中的跳转
     * 支持：
     * - import { Component } from './path'
     * - import Component from './path'
     * - import * as name from './path'
     * - import { Component as Alias } from './path'
     */
    private async handleImportJump(
        document: vscode.TextDocument,
        position: vscode.Position,
        word: string,
        line: string
    ): Promise<vscode.Location | null> {
        // 检查是否在 import 行
        const importMatch = line.match(/import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/);
        if (!importMatch) {
            return null;
        }

        const importPath = importMatch[1];
        
        // 解析目标文件路径
        const targetUri = await this.resolveImportPath(document, importPath);
        if (!targetUri) {
            return null;
        }

        // 检查光标是否在路径字符串上
        const pathStartIndex = line.indexOf(importPath);
        if (position.character >= pathStartIndex && position.character <= pathStartIndex + importPath.length) {
            // 跳转到文件开头
            return new vscode.Location(targetUri, new vscode.Position(0, 0));
        }

        // 检查光标是否在导入的符号上
        const symbolsMatch = line.match(/import\s+\{([^}]+)\}/);
        if (symbolsMatch) {
            const symbolsText = symbolsMatch[1];
            const symbols = symbolsText.split(',').map(s => s.trim());
            
            for (const sym of symbols) {
                // 处理别名: Component as Alias
                const aliasMatch = sym.match(/(\w+)\s+as\s+(\w+)/);
                const originalName = aliasMatch ? aliasMatch[1] : sym;
                const localName = aliasMatch ? aliasMatch[2] : sym;
                
                if (localName === word || originalName === word) {
                    // 在目标文件中查找符号定义
                    return await this.findSymbolInFile(targetUri, originalName);
                }
            }
        }

        // 处理默认导入: import Component from './path'
        const defaultImportMatch = line.match(/import\s+(\w+)\s+from/);
        if (defaultImportMatch && defaultImportMatch[1] === word) {
            // 查找 export default
            return await this.findDefaultExportInFile(targetUri);
        }

        return null;
    }

    /**
     * 解析 import 路径到实际文件 URI
     */
    private async resolveImportPath(document: vscode.TextDocument, importPath: string): Promise<vscode.Uri | null> {
        const documentDir = path.dirname(document.uri.fsPath);

        // 相对路径: ./xxx 或 ../xxx
        if (importPath.startsWith('.')) {
            const extensions = ['.ets', '.ts', '.js', '/index.ets', '/index.ts'];
            
            for (const ext of extensions) {
                const fullPath = path.resolve(documentDir, importPath + ext);
                if (fs.existsSync(fullPath)) {
                    return vscode.Uri.file(fullPath);
                }
            }

            // 尝试不加扩展名（可能已包含）
            const directPath = path.resolve(documentDir, importPath);
            if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
                return vscode.Uri.file(directPath);
            }
        }

        // @ohos 模块暂不支持
        if (importPath.startsWith('@ohos') || importPath.startsWith('@kit')) {
            return null;
        }

        // 包名（如 @wps/support_res 或 dayjs）
        // 查找 oh-package.json5 中的依赖配置
        const packagePath = await this.resolvePackagePath(document.uri.fsPath, importPath);
        if (packagePath) {
            return vscode.Uri.file(packagePath);
        }

        return null;
    }

    /**
     * 解析包名到实际文件路径
     * 支持 oh-package.json5 中的 file: 协议
     */
    private async resolvePackagePath(currentFilePath: string, packageName: string): Promise<string | null> {
        // 向上查找 oh-package.json5
        const ohPackagePath = this.findOhPackageJson5(currentFilePath);
        if (!ohPackagePath) {
            return null;
        }

        try {
            // 读取并解析 oh-package.json5
            const content = fs.readFileSync(ohPackagePath, 'utf-8');
            const packageJson = this.parseJson5(content);
            
            if (!packageJson || !packageJson.dependencies) {
                return null;
            }

            // 查找包的配置
            const packageConfig = packageJson.dependencies[packageName];
            if (!packageConfig || typeof packageConfig !== 'string') {
                return null;
            }

            // 解析 file: 协议
            if (packageConfig.startsWith('file:')) {
                const relativePath = packageConfig.substring(5); // 移除 'file:'
                const ohPackageDir = path.dirname(ohPackagePath);
                const targetDir = path.resolve(ohPackageDir, relativePath);
                
                // 查找目标模块的 oh-package.json5
                const targetOhPackage = path.join(targetDir, 'oh-package.json5');
                if (fs.existsSync(targetOhPackage)) {
                    const targetContent = fs.readFileSync(targetOhPackage, 'utf-8');
                    const targetJson = this.parseJson5(targetContent);
                    
                    if (targetJson && targetJson.main) {
                        // 返回入口文件路径
                        return path.join(targetDir, targetJson.main);
                    }
                }
                
                // 如果没有 main 字段，尝试默认的 index.ets
                const indexPath = path.join(targetDir, 'index.ets');
                if (fs.existsSync(indexPath)) {
                    return indexPath;
                }
            }

            // TODO: 支持 npm registry 包解析（从 node_modules 查找）
            
        } catch (error) {
            console.error('解析 oh-package.json5 失败:', error);
        }

        return null;
    }

    /**
     * 向上查找 oh-package.json5 文件
     */
    private findOhPackageJson5(startPath: string): string | null {
        let currentDir = path.dirname(startPath);
        
        // 最多向上查找 10 层
        for (let i = 0; i < 10; i++) {
            const packagePath = path.join(currentDir, 'oh-package.json5');
            if (fs.existsSync(packagePath)) {
                return packagePath;
            }
            
            const parentDir = path.dirname(currentDir);
            if (parentDir === currentDir) {
                // 已到达根目录
                break;
            }
            currentDir = parentDir;
        }
        
        return null;
    }

    /**
     * 简单的 JSON5 解析器
     * 移除注释后使用标准 JSON.parse
     */
    private parseJson5(content: string): any {
        try {
            // 移除单行注释
            let cleaned = content.replace(/\/\/.*$/gm, '');
            // 移除块注释
            cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
            // 移除尾随逗号
            cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
            
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('JSON5 解析失败:', error);
            return null;
        }
    }

    /**
     * 在目标文件中查找符号定义
     */
    private async findSymbolInFile(uri: vscode.Uri, symbolName: string): Promise<vscode.Location | null> {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const text = document.getText();

            // 查找各种导出定义
            const patterns = [
                // export struct Component
                new RegExp(`export\\s+struct\\s+${symbolName}\\s*\\{`),
                // export class ClassName
                new RegExp(`export\\s+class\\s+${symbolName}\\s*(extends|implements|\\{)`),
                // export interface InterfaceName
                new RegExp(`export\\s+interface\\s+${symbolName}\\s*\\{`),
                // export type TypeName =
                new RegExp(`export\\s+type\\s+${symbolName}\\s*=`),
                // export enum EnumName
                new RegExp(`export\\s+enum\\s+${symbolName}\\s*\\{`),
                // export function funcName
                new RegExp(`export\\s+function\\s+${symbolName}\\s*\\(`),
                // export const/let/var name
                new RegExp(`export\\s+(const|let|var)\\s+${symbolName}\\s*[=:]`),
                // struct (without export, for re-export)
                new RegExp(`struct\\s+${symbolName}\\s*\\{`),
                // class (without export)
                new RegExp(`class\\s+${symbolName}\\s*(extends|implements|\\{)`),
                // interface (without export)
                new RegExp(`interface\\s+${symbolName}\\s*\\{`),
            ];

            for (const pattern of patterns) {
                const match = pattern.exec(text);
                if (match) {
                    const wordIndex = match.index + match[0].indexOf(symbolName);
                    const startPos = document.positionAt(wordIndex);
                    const endPos = document.positionAt(wordIndex + symbolName.length);
                    return new vscode.Location(uri, new vscode.Range(startPos, endPos));
                }
            }
        } catch (error) {
            console.error('Error finding symbol in file:', error);
        }

        return null;
    }

    /**
     * 查找文件中的 default export
     */
    private async findDefaultExportInFile(uri: vscode.Uri): Promise<vscode.Location | null> {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const text = document.getText();

            // export default class/struct/function
            const defaultMatch = text.match(/export\s+default\s+(class|struct|function)\s+(\w+)/);
            if (defaultMatch) {
                const symbolName = defaultMatch[2];
                const wordIndex = defaultMatch.index! + defaultMatch[0].indexOf(symbolName);
                const startPos = document.positionAt(wordIndex);
                const endPos = document.positionAt(wordIndex + symbolName.length);
                return new vscode.Location(uri, new vscode.Range(startPos, endPos));
            }

            // export default expression (跳转到 export default 位置)
            const defaultExprMatch = text.match(/export\s+default\s+/);
            if (defaultExprMatch) {
                const pos = document.positionAt(defaultExprMatch.index!);
                return new vscode.Location(uri, pos);
            }
        } catch (error) {
            console.error('Error finding default export:', error);
        }

        return null;
    }

    /**
     * 在导入的文件中查找符号（用于在代码中使用导入符号时的跳转）
     */
    private async findSymbolInImportedFiles(document: vscode.TextDocument, symbolName: string): Promise<vscode.Location | null> {
        const text = document.getText();

        // 查找所有 import 语句
        const importRegex = /import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
        let importMatch;

        while ((importMatch = importRegex.exec(text)) !== null) {
            const namedImports = importMatch[1]; // { a, b, c }
            const namespaceImport = importMatch[2]; // * as name
            const defaultImport = importMatch[3]; // import Name
            const importPath = importMatch[4];

            // 检查符号是否来自这个 import
            let originalName: string | null = null;

            if (namedImports) {
                const symbols = namedImports.split(',').map(s => s.trim());
                for (const sym of symbols) {
                    const aliasMatch = sym.match(/(\w+)\s+as\s+(\w+)/);
                    const original = aliasMatch ? aliasMatch[1] : sym;
                    const local = aliasMatch ? aliasMatch[2] : sym;
                    
                    if (local === symbolName) {
                        originalName = original;
                        break;
                    }
                }
            } else if (defaultImport === symbolName) {
                // 默认导入
                const targetUri = await this.resolveImportPath(document, importPath);
                if (targetUri) {
                    return await this.findDefaultExportInFile(targetUri);
                }
            }

            if (originalName) {
                const targetUri = await this.resolveImportPath(document, importPath);
                if (targetUri) {
                    return await this.findSymbolInFile(targetUri, originalName);
                }
            }
        }

        return null;
    }
}
