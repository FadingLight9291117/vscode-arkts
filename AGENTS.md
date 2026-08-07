# AGENTS.md

VS Code extension providing ArkTS (HarmonyOS `.ets`) language support plus HarmonyOS device/build tooling. No CI, no test suite. Comments, commit messages, and user-facing strings are mostly Chinese — keep that convention.

## Commands

- `npm run compile` — typecheck only (`tsc --noEmit`). Produces no output files.
- `npm run bundle` — esbuild bundles `src/extension.ts` → `out/extension.js` (the only artifact that ships). Add `-- --production` for minified.
- `npm run watch` — esbuild watch mode (default VS Code build task; F5 debug uses it).
- `npm run package` — `vsce package` (runs production bundle via `vscode:prepublish`).
- `npm run lint` is **broken**: the `eslint src --ext ts` script exists but no ESLint config file is in the repo. Don't rely on it; don't "fix" it unless asked.
- `npm test` (`vscode-test`) has no tests behind it — there is no `src/test/`. Verification = `npm run compile` + `npm run bundle`.
- If `compile` fails with `Cannot find module 'zod'` etc., `node_modules` is stale — run `npm install` first.

## Architecture (non-obvious parts)

- `src/extension.ts` is the single entrypoint; `activate()` starts both the LSP client and the MCP server.
- **LSP client** (`vscode-languageclient`): connects to `@arkts/language-server` via IPC. The server binary is at `node_modules/@arkts/language-server/bin/ets-language-server.js`. Completion, hover, go-to-definition, references, and diagnostics all come from the LSP — there are no hand-rolled providers in `src/providers/`. Requires `ets.sdkPath` to be set or the LSP won't start.
- **Custom LSP request** `ets/formatDocument`: the extension registers a `DocumentFormattingEditProvider` that proxies format requests to the language server. Returns `{ code?, errors? }` and applies a full-document replacement.
- **`src/mcp/`** is **not** a real stdio MCP server. `MCPServer` (`src/mcp/server.ts`) is an in-process tool registry (zod-validated handlers in `src/mcp/tools/`) invoked by VS Code commands/UI (`src/mcp/ui/`). Tools shell out to the `hdc` CLI (`src/mcp/utils/hdc.ts`) — requires HarmonyOS `hdc` on PATH at runtime. Currently 20 tools across 7 files: `devices`, `projects`, `apps`, `build`, `runtime`, `files`, `diagnostics`.
- Grammars (`syntaxes/`), snippets (`snippets/arkts/*.json`), and language configs are declared in `package.json` `contributes` — edit both sides when adding files there.
- The extension also registers a `json5` language for HarmonyOS config files (`oh-package.json5`, `module.json5`, etc.).

## Gotchas

- `out/` contains only the esbuild bundle; stale `tsc`-emitted subdirs may exist but are ignored (see `.vscodeignore`).
- `vscode-languageclient` is marked **external** in `esbuild.js` (not bundled) and lives in `dependencies`. `@arkts/language-server` is also in `dependencies` and ships verbatim in the VSIX. Other runtime deps (zod, MCP SDK) stay in `devDependencies` and are bundled.
- `AGENTS.md`, `CLAUDE.md`, `.claude/` are excluded from VSIX via `.vscodeignore` — they're dev-only and must not ship to users.
- Version bumps go in `package.json` + `CHANGELOG.md`; publishing steps are in `docs/publish.md`.
