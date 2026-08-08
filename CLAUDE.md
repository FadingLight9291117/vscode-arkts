# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

VS Code extension providing ArkTS (HarmonyOS `.ets`) language support plus HarmonyOS device/build tooling via an in-process MCP-style tool registry. No CI, no test suite. Comments, commit messages, and user-facing strings are mostly Chinese — keep that convention.

## Commands

- `npm run compile` — typecheck only (`tsc --noEmit`). Produces no output files.
- `npm run bundle` — esbuild bundles `src/extension.ts` → `out/extension.js`. Append `-- --production` for minified.
- `npm run watch` — esbuild watch mode (default VS Code build task; F5 debug uses it).
- `npm run package` — `vsce package` (runs production bundle via `vscode:prepublish`).
- `npm run lint` is **broken**: no ESLint config file in the repo. Don't rely on it; don't "fix" it unless asked.
- `npm test` (`vscode-test`) has no tests behind it — there is no `src/test/`. Verification = `npm run compile` + `npm run bundle`.
- If `compile` fails with `Cannot find module 'zod'` etc., `node_modules` is stale — run `npm install` first.

## Architecture (non-obvious parts)

- `src/extension.ts` is the single entrypoint; `activate()` starts both the LSP client and the MCP server.
- **LSP client** (`vscode-languageclient`): connects to `@arkts/language-server` via IPC. The server is **not bundled in the VSIX** — `ensureLanguageServer()` (`src/runApp.ts`) installs `@arkts/language-server@1.3.10` on demand to the extension's global storage dir (`<globalStorage>/language-server/node_modules/...`) and the bin path is resolved from there. Completion, hover, go-to-definition, references, and diagnostics all come from the LSP — there are no hand-rolled providers in `src/providers/`. The client's `documentSelector` covers both `ets` and `json5` files (the LSP also serves the `json5` language). Debug port for the language server is 6009.
- **Required config**: `ets.sdkPath` must point to the OpenHarmony SDK (`sdk/default/openharmony` under DevEco Studio). If unset the LSP does not start and a warning is shown. Other `ets.*` settings: `ets.hmsPath` (optional HMS SDK, passed to the server via `initializationOptions`), `ets.linterVersion` (`1.1` | `off`), `ets.resourceReferenceDiagnostic` (diagnostic level for missing `$r()` refs). Changing `ets.sdkPath` or `ets.hmsPath` auto-restarts the client; `arkts.restartServer` restarts it manually. LSP startup failure degrades gracefully — the extension (and MCP tools) stay active.
- **Editor title-bar build/run** (`src/runApp.ts`): `arkts.buildApp` / `arkts.runApp` find the project root by walking up from the active `.ets` file for the **topmost** `oh-package.json5` (`findProjectRoot` — deliberately tolerant of projects without `hvigorw`), then shell out to `devecocli build` / `devecocli run` with output streamed to the "ArkTS Run" output channel. `devecocli` (`@deveco/deveco-cli`) is installed **globally** on demand at activation (not into global storage, unlike the language server); `arkts.installDevecoCli` is the manual entry point.
- **Custom LSP request** `ets/formatDocument`: the extension registers a `DocumentFormattingEditProvider` that proxies format requests to the language server via this non-standard request. It receives `{ code?, errors? }` and applies a full-document replacement edit.
- **`src/mcp/`** is **not** a real stdio MCP server. `MCPServer` (`src/mcp/server.ts`) is an in-process tool registry (zod-validated handlers in `src/mcp/tools/`) invoked by VS Code commands/UI (`src/mcp/ui/`). Tools shell out to the `hdc` CLI (`src/mcp/utils/hdc.ts`) — requires HarmonyOS `hdc` on PATH at runtime.
- Grammars (`syntaxes/`), snippets (`snippets/arkts/*.json`), and language configs are declared in `package.json` `contributes` — edit both sides when adding files there.
- The extension also registers a `json5` language for HarmonyOS config files (`oh-package.json5`, `module.json5`, etc.).
- A separate `mcp-harmonyos` npm package exists for external AI assistants (Claude Desktop, Cursor, etc.); this repo only ships the in-process variant.

## Adding an MCP tool

Each tool in `src/mcp/tools/` follows this shape:

```typescript
const MySchema = z.object({ /* params */ });
export const myTool: ToolDefinition<typeof MySchema> = {
  definition: {
    name: 'harmonyos_my_tool',
    description: '...',
    // inputSchema 是手写 JSON Schema（与 schema 字段保持字段一致）
    inputSchema: { type: 'object', properties: { /* ... */ }, required: [/* ... */] },
  },
  schema: MySchema,
  handler: async (args) => { /* return toolResult(data) or toolError(msg) */ },
};
```

Use `wrapTool(myTool)` (from `src/mcp/utils/response.ts`) to add automatic try/catch. Register in `src/mcp/tools/index.ts`'s `allTools` array. HDC calls go through `hdcExec` (`src/mcp/utils/hdc.ts`) — default timeout 5 s, pass `{ deviceId }` for `-t` targeting.

## Gotchas

- `vscode-languageclient` is marked **external** in `esbuild.js` (not bundled) and is the only entry in `dependencies` — it's resolved from `node_modules` at runtime. `@arkts/language-server` was removed from dependencies to keep the VSIX at ~545 KB; it's installed on demand to the extension's global storage dir. Other runtime deps (zod, MCP SDK) remain in `devDependencies` and are bundled by esbuild.
- `out/` contains only the esbuild bundle; stale `tsc`-emitted subdirs may exist but are ignored (see `.vscodeignore`).
- `docs/CODE_NAVIGATION.md` is **stale**: it documents the pre-LSP hand-rolled providers architecture (`src/providers/definitionProvider.ts` etc.) that no longer exists — trust `CLAUDE.md`/`AGENTS.md` over it.
- Version bumps go in `package.json` + `CHANGELOG.md`; publishing steps are in `docs/publish.md`.
- `AGENTS.md` at the repo root is an agent-focused architecture guide; keep it in sync when adding tools or changing the LSP setup.
