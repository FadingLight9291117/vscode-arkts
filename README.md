# ArkTS Language Support for Visual Studio Code

[![VS Code 版本](https://img.shields.io/badge/VS%20Code-%3E%3D1.85.0-blue?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)
[![许可证](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![AI 增强](https://img.shields.io/badge/AI-MCP%20Ready-orange?style=for-the-badge)](https://modelcontextprotocol.io)

为 Visual Studio Code 提供 ArkTS（鸿蒙应用开发语言）完整语言支持，并内置 20 个 MCP 工具，让 Claude、Copilot、Cursor、OpenCode 等 AI 助手直接操作 HarmonyOS 设备和项目。

![功能演示](images/demo.gif)

## 前置要求

- [HarmonyOS DevEco Studio](https://developer.huawei.com/consumer/cn/deveco-studio/) 已安装，`hdc` 命令在 PATH 中可用
- 在 VS Code 设置中配置 **`ets.sdkPath`**（指向 DevEco Studio 下的 `sdk/default/openharmony`）

> **重要**：`ets.sdkPath` 未配置时语言服务器不会启动，补全、诊断、跳转等功能不可用。

## 快速开始

1. 安装插件
2. 打开设置（`Ctrl+,`），搜索 `ets.sdkPath`，填入 OpenHarmony SDK 路径
3. 打开任意 `.ets` 文件，插件自动激活

需要设备操作时，确保已连接 HarmonyOS 设备或模拟器，然后通过命令面板（`Ctrl+Shift+P` → 输入 `ArkTS`）访问设备管理功能。

## 功能特性

### 语言支持（LSP 驱动）

- 智能代码补全、悬停文档、实时诊断
- 跳转到定义（`F12`）、查找引用（`Shift+F12`）
- 文档格式化
- ArkTS Linter 规范检查（可配置版本或关闭）
- `$r()` 资源引用验证
- 代码片段：组件模板（`entry`、`comp`、`compv2`）、装饰器（`state`、`local`、`param`）、UI 组件（`col`、`row`、`list`）等
- JSON5 语法高亮（`oh-package.json5`、`module.json5`、`build-profile.json5` 等）

### 支持的装饰器

- **V1**：`@Entry`、`@Component`、`@State`、`@Prop`、`@Link`、`@Provide`/`@Consume`、`@Watch`、`@Observed`/`@ObjectLink`、`@Builder`/`@BuilderParam`、`@Styles`/`@Extend` 等
- **V2**（API 12+）：`@ComponentV2`、`@Local`、`@Param`、`@Monitor`、`@Computed`、`@Provider`/`@Consumer`、`@ObservedV2`/`@Trace` 等

### MCP 工具（AI 集成，20 个）

AI 助手可直接调用以下工具完成 HarmonyOS 开发任务：

**设备管理**

| 工具 | 功能 |
|------|------|
| `harmonyos_list_devices` | 列出所有已连接设备 |
| `harmonyos_get_device_info` | 获取设备详细信息（型号、系统版本等） |
| `harmonyos_reboot_device` | 重启设备 |

**项目信息**

| 工具 | 功能 |
|------|------|
| `harmonyos_get_project_info` | 获取项目配置（包名、版本、目标 API） |
| `harmonyos_list_modules` | 列出所有模块（HAP/HSP/HAR） |
| `harmonyos_list_dependencies` | 解析 oh-package.json5 依赖树（含各模块） |

**构建**

| 工具 | 功能 |
|------|------|
| `harmonyos_check_build_outputs` | 检查构建产物是否存在 |
| `harmonyos_build` | 触发 hvigorw 构建（assembleHap/App/Hsp） |

**应用管理**

| 工具 | 功能 |
|------|------|
| `harmonyos_list_installed_apps` | 列出设备已安装应用 |
| `harmonyos_get_app_info` | 获取应用详细信息 |
| `harmonyos_install_app` | 安装 HAP 包到设备 |
| `harmonyos_uninstall_app` | 从设备卸载应用 |
| `harmonyos_launch_app` | 启动应用（`aa start`） |
| `harmonyos_clear_app_data` | 清除应用数据/缓存（data/cache/all） |

**文件传输**

| 工具 | 功能 |
|------|------|
| `harmonyos_push_file` | 推送本地文件到设备 |
| `harmonyos_pull_file` | 从设备拉取文件到本机 |

**日志与诊断**

| 工具 | 功能 |
|------|------|
| `harmonyos_tail_hilog` | 抓取日志快照（支持 tag/level 过滤） |
| `harmonyos_screenshot` | 截取设备屏幕并保存到本地 |
| `harmonyos_get_crash_logs` | 列出崩溃日志，可拉取最新一条 |
| `harmonyos_get_app_memory` | 获取运行中应用的内存报告 |

## 命令与配置

### 命令

| 命令 | 说明 |
|------|------|
| `ArkTS: Select HarmonyOS Device` | 查看并选择已连接的 HarmonyOS 设备 |
| `ArkTS: Show Project Info` | 查看当前项目的详细信息和模块列表 |
| `ArkTS: Restart Language Server` | 手动重启 ArkTS 语言服务器 |

### 配置项

| 配置项 | 说明 |
|--------|------|
| `ets.sdkPath` | OpenHarmony SDK 路径（**必填**） |
| `ets.hmsPath` | HMS SDK 路径（可选，留空不加载 HMS 类型） |
| `ets.linterVersion` | ArkTS Linter 版本：`1.1`（默认）或 `off` |
| `ets.resourceReferenceDiagnostic` | `$r()` 找不到时的诊断级别：`error`/`warning`/`information`/`off` |

## 外部 AI 助手集成

如果需要在 VS Code **以外**使用 HarmonyOS 工具（如 Claude Desktop），安装独立的 `mcp-harmonyos` 包：

```bash
npm install -g mcp-harmonyos
```

将以下配置添加到 Claude Desktop、Cursor 或 OpenCode 的配置文件：

```json
{
  "mcpServers": {
    "harmonyos": {
      "command": "npx",
      "args": ["-y", "mcp-harmonyos"]
    }
  }
}
```

## 安装

### 从 Marketplace 安装

在 VS Code 扩展面板搜索 `ArkTS Language Support` 并安装。

### 从 VSIX 安装

1. 下载最新的 `.vsix` 文件
2. `Ctrl+Shift+P` → `Install from VSIX` → 选择文件

### 开发模式

```bash
git clone https://github.com/FadingLight9291117/vscode-arkts.git
cd vscode-arkts
npm install
```

按 `F5` 启动调试（使用 `npm run watch` 监听文件变化）。验证：`npm run compile && npm run bundle`。

## 问题排查

**语言功能无响应（补全、诊断、跳转）**
- 检查 `ets.sdkPath` 是否已配置并指向有效路径
- 执行 `ArkTS: Restart Language Server` 重启语言服务器
- 查看"输出"面板 → 选择"ArkTS Language Server"查看错误日志

**MCP 工具报错 `hdc not found`**
- 确认 DevEco Studio 已安装，`hdc` 在系统 PATH 中
- 在终端执行 `hdc list targets` 验证

**语法高亮不正确**
- `Ctrl+Shift+P` → `Reload Window`

如遇其他问题，请[提交 Issue](https://github.com/FadingLight9291117/vscode-arkts/issues)。

## 贡献指南

欢迎任何形式的贡献！

**常见开发任务：**
- 添加 MCP 工具：在 `src/mcp/tools/` 新建或编辑文件，在 `src/mcp/tools/index.ts` 注册
- 修改语法高亮：编辑 `syntaxes/arkts.tmLanguage.json`
- 添加代码片段：编辑 `snippets/arkts/*.json`，同步更新 `package.json` 中的 `contributes.snippets`

**提交 PR：**
1. Fork 本仓库，创建功能分支
2. 验证：`npm run compile && npm run bundle`
3. 提交 Pull Request

## 相关资源

- [HarmonyOS 开发者文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/application-dev-guide-V5)
- [ArkTS 语言介绍](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-get-started-0000001774279582)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
- [mcp-harmonyos](https://github.com/FadingLight9291117/mcp-harmonyos) — 独立的 HarmonyOS MCP 服务器

## 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)。

## 许可证

MIT — 详见 [LICENSE](LICENSE)。
