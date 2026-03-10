# ArkTS Language Support for Visual Studio Code

[![VS Code 版本](https://img.shields.io/badge/VS%20Code-%3E%3D1.85.0-blue?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)
[![许可证](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![AI 增强](https://img.shields.io/badge/AI-MCP%20Ready-orange?style=for-the-badge)](https://modelcontextprotocol.io)

为 Visual Studio Code 提供 ArkTS（鸿蒙应用开发语言）语言支持，包含语法高亮、智能补全、悬停文档、代码导航等功能。**内置 MCP (Model Context Protocol) 服务器，可与 AI 助手（如 Claude、Copilot、Cursor、OpenCode）深度集成，实现智能 HarmonyOS 开发体验。**

![功能演示](images/demo.gif)

## 快速开始

### 基础使用

1. 安装插件
2. 打开任意 `.ets` 文件，插件将自动激活
3. 开始享受 ArkTS 开发体验！

### AI 增强功能（推荐）

插件内置了 MCP 服务器，可以与 AI 助手协作：

1. **在 VS Code 中使用**
   - 插件启动后 MCP 服务器自动运行
   - 使用命令面板访问 AI 增强功能（`Cmd+Shift+P` → 输入 `ArkTS`）
   - 例如：选择设备、查看项目信息等

2. **与外部 AI 助手集成**（如 Claude Desktop、Copilot、Cursor、OpenCode）
   - 安装独立的 `mcp-harmonyos`：`npm install -g mcp-harmonyos`
   - 在 AI 助手配置中添加 MCP 服务器
   - 详见 [AI 集成使用指南](#-ai-集成使用指南)

3. **前置要求**
   - 安装 [HarmonyOS DevEco Studio](https://developer.huawei.com/consumer/cn/deveco-studio/)
   - 确保 `hdc` 命令在 PATH 中可用
   - 连接 HarmonyOS 设备或模拟器

## 功能特性

### 🤖 AI 智能功能（NEW!）

- ✨ **内置 MCP 服务器** - 与 AI 助手无缝协作
- ✨ **设备管理** - AI 可查询和选择 HarmonyOS 设备
- ✨ **项目分析** - AI 理解项目结构、模块和配置
- ✨ **应用管理** - AI 查看已安装应用和版本信息
- ✨ **构建验证** - AI 检查构建输出和打包结果
- ✨ **智能命令** - 通过命令面板快速访问 HarmonyOS 工具

### 📝 语言支持功能

- ✅ 支持 ArkTS 状态管理 V1 和 V2 装饰器语法
- ✅ 支持 HarmonyOS API 12+ 新特性
- ✅ 即时语法错误提示
- ✅ 智能代码补全
- ✅ 悬停文档提示
- ✅ 代码导航与跳转
- ✅ 代码大纲
- ✅ 代码片段
- ✅ 代码高亮

### 支持的装饰器

支持 ArkTS 状态管理 V1 和 V2 全部装饰器，包括：

- **V1**：`@Entry`、`@Component`、`@State`、`@Prop`、`@Link`、`@Provide`/`@Consume`、`@Watch`、`@Observed`/`@ObjectLink`、`@Builder`/`@BuilderParam`、`@Styles`/`@Extend` 等
- **V2** (API 12+)：`@ComponentV2`、`@Local`、`@Param`、`@Monitor`、`@Computed`、`@Provider`/`@Consumer`、`@ObservedV2`/`@Trace` 等

详见 [华为官方文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-state-management-overview-0000001774279614)。

## 🚀 AI 集成使用指南

### 在扩展中使用（无需额外配置）

插件启动后，MCP 服务器会自动运行，可通过命令面板使用 AI 增强功能：

1. **选择 HarmonyOS 设备**
   - 打开命令面板：`Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入：`ArkTS: Select HarmonyOS Device`
   - 查看所有已连接设备并获取详细信息（型号、系统版本、SDK 版本等）

2. **查看项目信息**
   - 命令面板输入：`ArkTS: Show Project Info`
   - 查看当前 HarmonyOS 项目的完整信息（包名、版本、模块列表等）

### 与外部 AI 助手集成（Claude Desktop、Copilot、Cursor、OpenCode 等）

#### 方法 1: 直接使用 mcp-harmonyos（推荐独立使用）

如果你想让 AI 助手访问 HarmonyOS 工具但**不需要 VS Code 运行**，可以使用独立的 `mcp-harmonyos` 包：

```bash
# 全局安装
npm install -g mcp-harmonyos

# 或者使用 npx 运行
npx mcp-harmonyos
```

配置示例（添加到 Claude Desktop、Copilot、Cursor 或 OpenCode 配置文件）：

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

#### 方法 2: 通过 VS Code 扩展（适合开发时使用）

扩展内置的 MCP 服务器主要用于增强 VS Code 内的用户体验。如果你想在 VS Code 外部访问，建议使用方法 1。

### 可用的 MCP 工具

AI 助手可以调用以下工具来帮助你开发 HarmonyOS 应用：

| 工具名称 | 功能 | 示例用法 |
|---------|------|---------|
| `harmonyos_list_devices` | 列出所有已连接的 HarmonyOS 设备 | "有哪些设备连接了？" |
| `harmonyos_get_device_info` | 获取设备详细信息（型号、系统版本、SDK 版本等） | "告诉我设备的详细信息" |
| `harmonyos_get_project_info` | 获取项目信息（包名、版本、目标 API 等） | "这个项目的配置是什么？" |
| `harmonyos_list_modules` | 列出项目中的所有模块（HAP/HSP/HAR） | "这个项目有哪些模块？" |
| `harmonyos_check_build_outputs` | 检查构建输出是否存在 | "构建产物在哪里？" |
| `harmonyos_list_installed_apps` | 列出设备上所有已安装的应用 | "设备上安装了哪些应用？" |
| `harmonyos_get_app_info` | 获取应用详细信息（版本、安装时间等） | "查看某个应用的信息" |

### AI 使用场景示例

与 AI 助手（如 Claude、Copilot、Cursor、OpenCode）协作时，你可以这样提问：

**场景 1: 设备管理**
```
你: "我连接了几台 HarmonyOS 设备？每台设备的详细信息是什么？"
AI: [调用 harmonyos_list_devices]
    "你有 2 台设备连接：
    1. 7001005428323933328a (已连接)
    2. emulator-5554 (已连接)"
    
    [调用 harmonyos_get_device_info 获取详情]
    "设备 1 详情：
    - 型号: Mate 60 Pro
    - 品牌: HUAWEI
    - 系统版本: 4.0.0
    - SDK 版本: 12"
```

**场景 2: 项目分析**
```
你: "帮我分析一下当前项目的结构和配置"
AI: [调用 harmonyos_get_project_info 和 harmonyos_list_modules]
    "项目分析：
    📱 包名: com.example.myapp
    📦 版本: 1.0.0 (versionCode: 1000000)
    🎯 目标 API: 12
    
    模块列表：
    - entry (HAP) - 主入口模块
    - common (HSP) - 共享库模块
    - utils (HAR) - 工具库模块"
```

**场景 3: 应用部署检查**
```
你: "检查一下我的应用是否成功部署到设备上"
AI: [调用 harmonyos_list_installed_apps]
    "在设备上找到了你的应用：
    - 包名: com.example.myapp
    - 已安装版本: 1.0.0
    - 安装时间: 2024-02-20 10:30:00
    - 是否为系统应用: 否"
```

**场景 4: 构建验证**
```
你: "构建完成后，帮我检查输出文件"
AI: [调用 harmonyos_check_build_outputs]
    "构建输出检查：
    ✅ 找到 HAP 文件: entry-default-signed.hap (2.3 MB)
    ✅ 找到 HSP 文件: common-default.hsp (512 KB)
    📂 输出目录: /path/to/project/outputs/"
```

**场景 5: 智能故障排查**
```
你: "我的应用安装失败了，帮我排查一下"
AI: [综合调用多个工具]
    "让我帮你检查：
    
    1. [检查设备] 设备已连接，状态正常
    2. [检查构建] 构建输出存在，文件完整
    3. [检查已安装应用] 发现设备上已有旧版本 (v0.9.0)
    
    💡 建议：设备上已有旧版本应用，你需要：
    - 先卸载旧版本，或
    - 确保新版本的 versionCode 大于旧版本"
```

## 可用命令

### 用户命令

| 命令 | 说明 |
|------|------|
| `ArkTS: Select HarmonyOS Device` | 🤖 查看并选择已连接的 HarmonyOS 设备 |
| `ArkTS: Show Project Info` | 🤖 查看当前项目的详细信息和模块列表 |
| `ArkTS: Hello World` | 测试插件是否正常工作 |
| `ArkTS: Format Document` | 格式化当前文档 |

> 🤖 标记的命令使用了 AI 增强功能

## 配置项

支持多种配置项，包括：

- **代码补全**：`arkts.enableAutoComplete`、`arkts.completion.enableKeywords`、`arkts.completion.keywordMode` 等
- **实时诊断**：`arkts.diagnostics.enable`、`arkts.diagnostics.enableUnusedState`、`arkts.diagnostics.severity` 等
- **其他**：`arkts.enableHover` 等

在 VS Code 设置中搜索 `arkts` 查看所有配置项。

## 代码片段

提供丰富的代码片段，包括组件模板（`entry`、`comp`、`compv2`）、装饰器（`state`、`local`、`param`）、UI 组件（`col`、`row`、`list`、`btn`）等，输入前缀即可快速插入。

## 代码导航

支持跳转到定义（`F12`）和查看定义（`Alt+F12`），包括组件、变量、函数、@Builder、@Styles 等。详见 [代码导航文档](docs/CODE_NAVIGATION.md)。

## 安装

### 从 VSIX 安装

1. 下载最新的 `.vsix` 文件
2. 在 VS Code 中，打开命令面板（`Ctrl+Shift+P`）
3. 输入 `Install from VSIX` 并选择下载的文件

### 开发模式

1. 克隆项目并安装依赖：
```bash
git clone https://github.com/FadingLight9291117/vscode-arkts.git
cd vscode-arkts
npm install
```

2. 编译项目：
```bash
npm run compile
```

3. 按 `F5` 启动调试，会打开一个新的 VS Code 扩展开发宿主窗口

4. 在新窗口中打开 `.ets` 文件即可测试插件功能

> **注意**：如果遇到 node_modules 权限问题，运行：
> ```bash
> sudo chown -R $(whoami) node_modules
> npm install
> ```

### 打包发布

```bash
# 安装 vsce 工具
npm install -g @vscode/vsce

# 打包插件
vsce package

# 生成 .vsix 文件
```

## 项目结构

```
vscode-arkts/
├── package.json                  # 插件清单配置
├── tsconfig.json                 # TypeScript 配置
├── language-configuration.json   # 语言配置（括号匹配、注释等）
├── syntaxes/
│   └── arkts.tmLanguage.json     # TextMate 语法高亮规则
├── snippets/
│   └── arkts.json                # 代码片段定义
├── docs/
│   └── CODE_NAVIGATION.md        # 代码导航功能文档
├── examples/
│   └── demo.ets                  # 示例代码
└── src/
    ├── extension.ts              # 插件入口点
    ├── mcp/                      # 🤖 MCP 服务器（AI 集成）
    │   ├── server.ts             # MCP 服务器实现
    │   ├── tools/                # HarmonyOS 工具集
    │   │   ├── devices.ts        # 设备管理工具
    │   │   ├── projects.ts       # 项目信息工具
    │   │   ├── apps.ts           # 应用管理工具
    │   │   └── build.ts          # 构建验证工具
    │   ├── types/                # 类型定义
    │   ├── utils/                # 工具函数（hdc、json5 解析等）
    │   └── ui/                   # UI 组件
    │       ├── devicePicker.ts   # 设备选择器
    │       └── projectInfo.ts    # 项目信息查看器
    └── providers/                # 语言功能提供器
        ├── completionProvider.ts # 代码补全
        ├── hoverProvider.ts      # 悬停文档
        ├── definitionProvider.ts # 定义跳转
        ├── referenceProvider.ts  # 引用查找
        └── diagnosticsProvider.ts # 实时诊断
```

## 问题排查

1. **插件未激活**
   - 确保打开的文件扩展名为 `.ets`
   - 检查 VS Code 版本是否 >= 1.85.0

2. **语法高亮不正确**
   - 尝试重新加载窗口（`Ctrl+Shift+P` → `Reload Window`）

3. **智能提示无响应**
   - 检查 `arkts.enableAutoComplete` 设置是否启用

如遇其他问题，请[提交 Issue](https://github.com/your-username/arkts-vscode-plugin/issues)。

## 贡献指南

这是一个开源项目，欢迎任何形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 提交 Pull Request

### 开发指南

- **添加新装饰器补全**：编辑 `src/providers/completionProvider.ts`
- **添加悬停文档**：编辑 `src/providers/hoverProvider.ts`
- **添加代码片段**：编辑 `snippets/arkts.json`
- **修改语法高亮**：编辑 `syntaxes/arkts.tmLanguage.json`
- **添加 MCP 工具**：在 `src/mcp/tools/` 目录下添加新工具
- **添加 UI 功能**：在 `src/mcp/ui/` 目录下添加新的 UI 组件

## 反馈

- 💬 有问题？请[提交 Issue](https://github.com/your-username/arkts-vscode-plugin/issues)
- 💡 有建议？欢迎[提交 PR](https://github.com/your-username/arkts-vscode-plugin/pulls)
- ⭐ 觉得有用？欢迎 Star 支持！

## 相关资源

### HarmonyOS 开发
- [HarmonyOS 开发者文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/application-dev-guide-V5)
- [ArkTS 语言介绍](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-get-started-0000001774279582)
- [状态管理概述](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-state-management-overview-0000001774279614)

### AI 集成
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io) - AI 助手与工具的标准协议
- [mcp-harmonyos](https://github.com/FadingLight9291117/mcp-harmonyos) - 独立的 HarmonyOS MCP 服务器
- [Claude Desktop](https://claude.ai/download) - 支持 MCP 的 AI 助手
- [OpenCode](https://opencode.ai) - VS Code AI 编程助手

## 未来规划

我们计划持续改进插件，以下是一些规划中的功能：

### AI 功能增强 🤖
- ✅ **MCP 服务器集成**（已完成）
  - ✅ 设备管理工具
  - ✅ 项目分析工具
  - ✅ 应用管理工具
  - ✅ 构建验证工具
- 🚧 **AI 驱动的代码分析**（规划中）
  - 组件分析和优化建议
  - 装饰器使用检查
  - 性能优化建议
  - 代码质量评估
- 🚧 **智能代码生成**（规划中）
  - 基于项目上下文的组件生成
  - 自动生成测试代码
  - 代码重构建议
  - 最佳实践推荐

### 代码导航增强
- 跨文件定义跳转（import 解析）
- 查找所有引用（Find All References）
- 符号重命名（Rename）
- 文档大纲（DocumentSymbolProvider）
- 工作区符号搜索

### 其他功能
- 代码格式化器（Formatter）
- 更多诊断规则（Linter）
- 测试支持
- 调试器集成
- LSP（Language Server Protocol）架构重构

欢迎在 [Issues](https://github.com/FadingLight9291117/vscode-arkts/issues) 中提出您的需求和建议！

## 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)。

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。
