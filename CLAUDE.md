# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

VS Code extension providing ArkTS (HarmonyOS `.ets`) language support plus HarmonyOS device/build tooling via an in-process MCP-style tool registry. No CI, no test suite. Comments, commit messages, and user-facing strings are mostly Chinese — keep that convention.

## Commands

- `npm run compile` — typecheck only (`tsc --noEmit`). Produces no output files.
- `npm run bundle` — esbuild bundles `src/extension.ts` → `out/extension.js` (the only artifact that ships). Append `-- --production` for minified.
- `npm run watch` — esbuild watch mode (default VS Code build task; F5 debug uses it).
- `npm run package` — `vsce package` (runs production bundle via `vscode:prepublish`).
- `npm run lint` is **broken**: the `eslint src --ext ts` script exists but no ESLint config file is in the repo. Don't rely on it; don't "fix" it unless asked.
- `npm test` (`vscode-test`) has no tests behind it — there is no `src/test/`. Verification = `npm run compile` + `npm run bundle`.
- If `compile` fails with `Cannot find module 'zod'` etc., `node_modules` is stale — run `npm install` first.

## Architecture (non-obvious parts)

- `src/extension.ts` is the single entrypoint; everything is registered in `activate()`.
- `src/mcp/` is **not** a real stdio MCP server. `MCPServer` (`src/mcp/server.ts`) is an in-process tool registry (zod-validated handlers in `src/mcp/tools/`) invoked by VS Code commands/UI (`src/mcp/ui/`). Tools shell out synchronously to the `hdc` CLI (`src/mcp/utils/hdc.ts`) — requires HarmonyOS `hdc` on PATH at runtime.
- Completion/hover data lives in `src/config/completion/` (`ui` / `language` / `snippets` submodules). Import via `from '../config'` (the barrel only re-exports `./completion`). Top-level `src/config/ui/` and `src/config/language/` are legacy duplicates not exported by the barrel.
- Grammars (`syntaxes/`), snippets (`snippets/arkts/*.json`), and language configs are declared in `package.json` `contributes` — edit both sides when adding files there.
- The extension also registers a `json5` language for HarmonyOS config files (`oh-package.json5`, `module.json5`, etc.).
- A separate `mcp-harmonyos` npm package exists for external AI assistants (Claude Desktop, Cursor, etc.); this repo only ships the in-process variant.

## Gotchas

- `out/` contains only the esbuild bundle; stale `tsc`-emitted subdirs may exist but are ignored (see `.vscodeignore`).
- All runtime deps (zod, MCP SDK) are in `devDependencies` on purpose — esbuild bundles them; `dependencies` must stay empty or the VSIX bloats.
- Version bumps go in `package.json` + `CHANGELOG.md`; publishing steps are in `docs/publish.md`.
