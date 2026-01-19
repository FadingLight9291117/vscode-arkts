# ArkTS Language Support for Visual Studio Code

[![VS Code 版本](https://img.shields.io/badge/VS%20Code-%3E%3D1.85.0-blue?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)
[![许可证](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

为 Visual Studio Code 提供 ArkTS（鸿蒙应用开发语言）语言支持，包含语法高亮、智能补全、悬停文档、代码导航等功能。未来计划支持代码编译，支持LLM的MCP功能。

![功能演示](images/demo.gif)

## 快速开始

1. 安装插件
2. 打开任意 `.ets` 文件，插件将自动激活
3. 开始享受 ArkTS 开发体验！

## 功能特性

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

#### 状态管理 V1（推荐用于 API 11 及以下）
| 装饰器 | 说明 |
|--------|------|
| `@Entry` | 页面入口组件 |
| `@Component` | 自定义组件 |
| `@State` | 组件内状态 |
| `@Prop` | 单向数据传递 |
| `@Link` | 双向数据绑定 |
| `@Provide` / `@Consume` | 跨层级数据传递 |
| `@Watch` | 状态变化监听 |
| `@Observed` / `@ObjectLink` | 嵌套对象观察 |
| `@Builder` / `@BuilderParam` | UI 复用 |
| `@Styles` / `@Extend` | 样式复用 |
| `@StorageLink` / `@StorageProp` | 应用级状态管理 |
| `@LocalStorageLink` / `@LocalStorageProp` | 页面级状态管理 |

#### 状态管理 V2（推荐用于 API 12+）
| 装饰器 | 说明 |
|--------|------|
| `@ComponentV2` | V2 版自定义组件 |
| `@Local` | 组件内部状态（替代 @State） |
| `@Param` | 外部输入属性（替代 @Prop） |
| `@Once` | 仅初始化一次的属性 |
| `@Event` | 组件事件回调 |
| `@Monitor` | 状态变化监听（替代 @Watch） |
| `@Provider` / `@Consumer` | 跨层级数据传递（替代 @Provide/@Consume） |
| `@Computed` | 计算属性 |
| `@ObservedV2` / `@Trace` | 深度观察类属性 |

详见 [华为官方文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-state-management-overview-0000001774279614)。

## 可用命令

| 命令 | 说明 |
|------|------|
| `ArkTS: Hello World` | 测试插件是否正常工作 |
| `ArkTS: Format Document` | 格式化当前文档 |

## 支持的配置项

以下配置项可在 VS Code 设置中使用：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `arkts.enableAutoComplete` | `boolean` | `true` | 启用/禁用自动补全功能 |
| `arkts.completion.enableKeywords` | `boolean` | `true` | 启用/禁用关键字补全（`const/if/try` 等） |
| `arkts.completion.keywordMode` | `string` | `common` | 关键字补全范围：`common`（推荐，贴近 ArkTS 迁移指南约束）/ `full`（更完整，可能包含 ArkTS 不推荐/不支持项）/ `arkts`（最精简，仅 ArkTS 结构相关） |
| `arkts.completion.enableImportSnippets` | `boolean` | `true` | 启用/禁用 HarmonyOS Kit `import` 模板补全（`@kit.*` 推荐写法） |
| `arkts.completion.enableLifecycleSnippets` | `boolean` | `true` | 启用/禁用生命周期回调模板补全（自定义组件/UIAbility） |
| `arkts.diagnostics.enable` | `boolean` | `true` | 启用/禁用实时诊断（Problems 面板提示） |
| `arkts.diagnostics.enableUnusedState` | `boolean` | `true` | 启用/禁用未使用的 `@State` 变量提示（简化规则） |
| `arkts.diagnostics.enableMigrationRules` | `boolean` | `true` | 启用/禁用 TS→ArkTS 迁移建议诊断（如避免 `var/any/unknown` 等） |
| `arkts.diagnostics.severity` | `string` | `warning` | 诊断严重程度：`information` / `warning` / `error` |
| `arkts.enableHover` | `boolean` | `true` | 启用/禁用悬停提示功能 |

### 关于关键字模式（keywordMode）

- `common`：更偏向 ArkTS 迁移指南推荐（例如默认不“强调”不推荐/不支持项）。
- `full`：更接近 TS/JS 的关键字/保留字集合，适合需要更全面提示的场景。
- `arkts`：仅保留 ArkTS 生命周期/结构相关，适合极简补全偏好。

### HarmonyOS Kit import 模板

在文件中输入 `import`（或 `im`）时，插件会优先提示常用的 `@kit.*` import 模板，帮助快速写出推荐写法。

### 生命周期回调模板

- 在 `struct` 组件内部：提示 `aboutToAppear` / `onDidBuild` / `aboutToDisappear` 等自定义组件生命周期回调。
- 在 `class Xxx extends UIAbility` 内部：提示 `onCreate` / `onForeground` / `onBackground` / `onNewWant` 等 UIAbility 生命周期回调。

## 代码片段

插件提供了丰富的代码片段以提升开发效率：

### V1 代码片段
| 前缀 | 说明 |
|------|------|
| `entry` | 创建 @Entry 入口组件 |
| `comp` | 创建 @Component 自定义组件 |
| `state` | 声明 @State 状态变量 |
| `prop` | 声明 @Prop 属性 |
| `link` | 声明 @Link 双向绑定 |
| `builder` | 创建 @Builder 函数 |
| `styles` | 创建 @Styles 样式函数 |
| `col` / `row` | 创建 Column/Row 布局 |
| `list` | 创建 List 列表 |
| `foreach` | 创建 ForEach 循环 |
| `btn` | 创建 Button 按钮 |

### V2 代码片段（API 12+）
| 前缀 | 说明 |
|------|------|
| `entryv2` | 创建 V2 版入口组件 |
| `compv2` | 创建 @ComponentV2 组件 |
| `local` | 声明 @Local 状态 |
| `param` | 声明 @Param 参数 |
| `event` | 声明 @Event 事件 |
| `monitor` | 创建 @Monitor 监听 |
| `computed` | 创建 @Computed 计算属性 |
| `provider` / `consumer` | 创建跨层级数据传递 |

## 代码导航

插件支持以下代码导航功能：

- **跳转到定义**（`F12` 或 `Ctrl+Click`）
  - 跳转到组件（struct）定义
  - 跳转到变量/常量定义
  - 跳转到函数/方法定义
  - 跳转到 @Builder 函数定义
  - 跳转到 @Styles 样式定义
  - 跳转到成员变量定义

- **查看定义**（`Alt+F12`）
  - 在弹出窗口中预览定义

详细信息请参阅 [代码导航文档](docs/CODE_NAVIGATION.md)。

## 安装

### 从 VSIX 安装

1. 下载最新的 `.vsix` 文件
2. 在 VS Code 中，打开命令面板（`Ctrl+Shift+P`）
3. 输入 `Install from VSIX` 并选择下载的文件

### 开发模式

1. 克隆项目并安装依赖：
```bash
git clone https://github.com/FadingLight9291117/vscode-arkts.git
cd arkts-vscode-plugin
npm install
```

2. 编译项目：
```bash
npm run compile
```

3. 按 `F5` 启动调试，会打开一个新的 VS Code 扩展开发宿主窗口

4. 在新窗口中打开 `.ets` 文件即可测试插件功能

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
arkts-vscode-plugin/
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
    └── providers/
        ├── completionProvider.ts # 代码补全提供器
        ├── hoverProvider.ts      # 悬停文档提供器
        └── definitionProvider.ts # 定义跳转提供器
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

## 反馈

- 💬 有问题？请[提交 Issue](https://github.com/your-username/arkts-vscode-plugin/issues)
- 💡 有建议？欢迎[提交 PR](https://github.com/your-username/arkts-vscode-plugin/pulls)
- ⭐ 觉得有用？欢迎 Star 支持！

## 相关资源

- [HarmonyOS 开发者文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/application-dev-guide-V5)
- [ArkTS 语言介绍](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-get-started-0000001774279582)
- [状态管理概述](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-state-management-overview-0000001774279614)

## 未来规划

我们计划持续改进插件，以下是一些规划中的功能：

### 代码导航增强
- 跨文件定义跳转（import 解析）
- 查找所有引用（Find All References）
- 符号重命名（Rename）
- 文档大纲（DocumentSymbolProvider）
- 工作区符号搜索

### AI 集成
- **MCP（Model Context Protocol）支持**
  - 作为 MCP 服务器：让 AI 助手（如 Claude Desktop）能访问和分析 ArkTS 项目
  - 提供专业工具：组件分析、装饰器检查、代码生成
  - 智能代码助手：基于项目上下文的代码建议
- AI 驱动的代码补全和重构建议

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
