import * as vscode from 'vscode';

type SeveritySetting = 'information' | 'warning' | 'error';

function getConfiguredSeverity(): vscode.DiagnosticSeverity {
    const config = vscode.workspace.getConfiguration('arkts');
    const severity = config.get<SeveritySetting>('diagnostics.severity', 'warning');
    switch (severity) {
        case 'information':
            return vscode.DiagnosticSeverity.Information;
        case 'error':
            return vscode.DiagnosticSeverity.Error;
        case 'warning':
        default:
            return vscode.DiagnosticSeverity.Warning;
    }
}

/**
 * Mask comments and string literals with spaces, preserving string length.
 * This keeps offsets stable for diagnostics ranges.
 */
function maskCommentsAndStrings(text: string): string {
    const chars = Array.from(text);

    let inLineComment = false;
    let inBlockComment = false;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplate = false;
    let escapeNext = false;

    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        const next = i + 1 < chars.length ? chars[i + 1] : '';

        if (inLineComment) {
            if (c === '\n') {
                inLineComment = false;
            } else {
                chars[i] = ' ';
            }
            continue;
        }

        if (inBlockComment) {
            if (c === '*' && next === '/') {
                chars[i] = ' ';
                chars[i + 1] = ' ';
                i++;
                inBlockComment = false;
            } else {
                chars[i] = ' ';
            }
            continue;
        }

        if (inSingleQuote || inDoubleQuote || inTemplate) {
            if (escapeNext) {
                chars[i] = ' ';
                escapeNext = false;
                continue;
            }

            if (c === '\\') {
                chars[i] = ' ';
                escapeNext = true;
                continue;
            }

            if (inSingleQuote && c === "'") {
                chars[i] = ' ';
                inSingleQuote = false;
                continue;
            }
            if (inDoubleQuote && c === '"') {
                chars[i] = ' ';
                inDoubleQuote = false;
                continue;
            }
            if (inTemplate && c === '`') {
                chars[i] = ' ';
                inTemplate = false;
                continue;
            }

            // mask content within quotes
            chars[i] = ' ';
            continue;
        }

        // not in any string/comment
        if (c === '/' && next === '/') {
            chars[i] = ' ';
            chars[i + 1] = ' ';
            i++;
            inLineComment = true;
            continue;
        }
        if (c === '/' && next === '*') {
            chars[i] = ' ';
            chars[i + 1] = ' ';
            i++;
            inBlockComment = true;
            continue;
        }
        if (c === "'") {
            chars[i] = ' ';
            inSingleQuote = true;
            continue;
        }
        if (c === '"') {
            chars[i] = ' ';
            inDoubleQuote = true;
            continue;
        }
        if (c === '`') {
            chars[i] = ' ';
            inTemplate = true;
            continue;
        }
    }

    return chars.join('');
}

function pushRegexDiagnostics(
    document: vscode.TextDocument,
    maskedText: string,
    diagnostics: vscode.Diagnostic[],
    regex: RegExp,
    message: string,
    severity: vscode.DiagnosticSeverity
) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(maskedText)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(startPos, endPos),
            message,
            severity
        );
        diagnostic.source = 'arkts';
        diagnostics.push(diagnostic);

        // Guard against zero-length matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
    }
}

export class ArkTSDiagnosticsProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(collection?: vscode.DiagnosticCollection) {
        this.diagnosticCollection = collection ?? vscode.languages.createDiagnosticCollection('arkts');
    }

    get collection(): vscode.DiagnosticCollection {
        return this.diagnosticCollection;
    }

    public updateDiagnostics(document: vscode.TextDocument): void {
        const config = vscode.workspace.getConfiguration('arkts');
        if (config.get<boolean>('diagnostics.enable', true) === false) {
            this.diagnosticCollection.set(document.uri, []);
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];
        const rawText = document.getText();
        const maskedText = maskCommentsAndStrings(rawText);
        const severity = getConfiguredSeverity();

        // 1) Unused @State variables (simplified)
        if (config.get<boolean>('diagnostics.enableUnusedState', true) !== false) {
            const stateRegex = /@State\s+(\w+)/g;
            let match: RegExpExecArray | null;
            while ((match = stateRegex.exec(maskedText)) !== null) {
                const varName = match[1];
                const usageRegex = new RegExp(`\\b${varName}\\b`, 'g');
                const usages = maskedText.match(usageRegex);

                // If only appears once (declaration), it may be unused
                if (usages && usages.length === 1) {
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

                if (match.index === stateRegex.lastIndex) {
                    stateRegex.lastIndex++;
                }
            }
        }

        // 2) TS→ArkTS migration suggestions (conservative)
        if (config.get<boolean>('diagnostics.enableMigrationRules', true) !== false) {
            pushRegexDiagnostics(
                document,
                maskedText,
                diagnostics,
                /\bvar\b/g,
                "ArkTS 建议避免使用 'var'，请使用 'let' 或 'const'",
                severity
            );

            pushRegexDiagnostics(
                document,
                maskedText,
                diagnostics,
                /\bany\b/g,
                "ArkTS 迁移建议避免使用 'any'，请使用更具体的类型",
                severity
            );

            pushRegexDiagnostics(
                document,
                maskedText,
                diagnostics,
                /\bunknown\b/g,
                "ArkTS 迁移建议避免使用 'unknown'，请使用更具体的类型",
                severity
            );

            pushRegexDiagnostics(
                document,
                maskedText,
                diagnostics,
                /\bSymbol\s*\(/g,
                "ArkTS 迁移指南中提示：不支持 Symbol() API（请避免使用）",
                severity
            );

            pushRegexDiagnostics(
                document,
                maskedText,
                diagnostics,
                /#\w+/g,
                "ArkTS 迁移指南中提示：不支持以 # 开头的私有字段",
                severity
            );
        }

        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    public refreshAllOpenDocuments(): void {
        for (const doc of vscode.workspace.textDocuments) {
            if (doc.languageId === 'arkts') {
                this.updateDiagnostics(doc);
            }
        }
    }
}
