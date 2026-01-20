# 更新日志

本文件记录 ArkTS Language Support 插件的所有重要更改。

## [1.3.0] - 2026-01-20

### 新增
- 代码片段重构
  - 将代码片段拆分为 4 个分类文件，便于管理和扩展
  - `snippets/arkts/basic.json` - 基础组件和装饰器（Entry、Component、Dialog、State、Prop、Link、Watch、Builder）
  - `snippets/arkts/ui.json` - UI 组件（Column、Row、Text、Button、Image、List、ForEach、TextInput）
  - `snippets/arkts/v2.json` - V2 状态管理（ComponentV2、Local、Param、Event、Monitor、Provider、Consumer、Computed、ObservedV2）
  - `snippets/arkts/api.json` - API 调用（HTTP Request）

### 改进
- 语法高亮增强
  - 新增箭头函数 `=>` 语法高亮支持
  - 新增运算符高亮支持（比较、逻辑、赋值、算术、位运算、三元、可选链、空值合并）
  - 优化代码可读性和视觉体验

## [1.2.9] - 2026-01-20

### 优化
- 重命名关键字导出标识符
  - 将 `KEYWORDS_FULL` 重命名为 `KEYWORDS`，简化命名
  - 更新所有相关导入和文档说明

## [1.2.8] - 2026-01-20

### 优化
- 简化关键字补全配置
  - 统一使用 `KEYWORDS` 作为唯一关键字导出
  - 移除 `arkts.completion.keywordMode` 配置项，简化用户配置
  - 移除向后兼容的冗余导出（KEYWORDS, KEYWORDS_COMMON, KEYWORDS_ARKTS_ONLY）
  - 将 ArkTS 不推荐/不支持的关键字移至列表末尾，优化补全体验
- 优化代码片段职责分工
  - 移除 snippets/arkts.json 中的生命周期方法定义
  - 生命周期补全由 CompletionProvider 统一提供，支持智能上下文感知
  - 避免重复补全项，符合 VS Code 官方最佳实践
- 修正模块导入路径
  - 统一旧目录结构中的类型导入路径，指向 completion/types.ts

## [1.2.7] - 2026-01-20

### 改进
- 重构代码补全配置系统
  - 将 456 行的单一配置文件拆分为模块化结构
  - 新增 `config/completion/` 目录，按功能分类组织配置
    - `ui/` - UI 组件和属性配置
    - `language/` - 语言特性（装饰器、关键字）配置
    - `snippets/` - 代码片段配置
  - 采用桶式导出（barrel exports）模式，保持 API 兼容性
  - 添加完整的 README 文档说明
- 改进打包配置
  - 新增 `npm run package` 脚本，简化打包流程
  - 自动排除 `.backup` 备份文件
  - 启用 `--no-dependencies` 选项优化包体积

## [1.2.5] - 2026-01-19

### 新增
- 为 .ets 文件添加文件图标（蓝色 "ETS" 文字，透明背景，32x32 分辨率）
- 图标在 VS Code 文件资源管理器中显示

## [1.2.4] - 2026-01-19

### 修复
- 修复 Hover 文档模板字符串导致的编译问题

### 改进
- 清理 package.json 中冗余 activationEvents，避免 VS Code 警告
- 文档补充：关键字模式、import 模板、生命周期模板、诊断配置项
- 打包排除 `examples/**` 与 `*.vsix`（避免示例/产物进入 VSIX 包）

### 发布
- 版本号更新（1.2.1 → 1.2.4）

## [1.2.0] - 2026-01-19

### 新增
- **关键字补全可配置**
  - 支持 `arkts.completion.enableKeywords`
  - 支持 `arkts.completion.keywordMode`（common/full/arkts）
- **HarmonyOS Kit import 模板补全**
  - 支持 `arkts.completion.enableImportSnippets`
  - 提供 `@kit.*` 推荐写法模板
- **生命周期回调模板补全**
  - 支持 `arkts.completion.enableLifecycleSnippets`
  - struct 场景：自定义组件/页面生命周期（如 aboutToAppear/onDidBuild/onPageShow/onBackPress）
  - UIAbility 场景：UIAbility 生命周期（如 onCreate/onForeground/onBackground/onNewWant）
- **迁移建议诊断（TS→ArkTS）**
  - 支持 `arkts.diagnostics.enableMigrationRules` 等开关与严重程度配置

### 改进
- Completion 配置集中化与去重策略优化（后定义覆盖前定义）

## [1.1.1] - 2026-01-19

### 新增
- **Find All References 功能**
  - 支持 `Shift+F12` 查找当前文件内所有引用
  - 支持 struct、class、interface、type、enum、function、变量、方法
  - 支持精确单词匹配
  - 支持选择是否包含定义位置

- **跨模块 import 跳转**
  - 支持 `import { X } from '@wps/module'` 包名跳转
  - 支持解析 oh-package.json5 中的 `file:` 协议
  - 支持读取目标模块的 `main` 入口字段
  - 向上查找 oh-package.json5（最多10层）

### 改进
- 方法跳转正则增强：支持 private/public/protected、async、返回类型

## [1.1.0] - 2026-01-19

### 新增
- **JSON5 语法高亮支持**
  - 支持单行注释 `//` 和块注释 `/* */`
  - 支持双引号和单引号字符串
  - 支持无引号键名（identifier keys）
  - 支持尾随逗号
  - 支持十六进制数字 `0xFF`
  - 支持 `Infinity` 和 `NaN`
  - 自动识别 `.json5` 文件扩展名
  - 自动识别 HarmonyOS 配置文件：`oh-package.json5`、`build-profile.json5`、`module.json5`、`hvigorfile.json5`

- **跨文件 import 跳转**（P0 功能）
  - 支持 `import { Component } from './path'` 跳转到目标文件
  - 支持在 import 语句中跳转到导入的符号定义
  - 支持在代码中使用导入符号时跳转到原定义
  - 支持别名导入：`import { A as B } from './path'`
  - 支持默认导入：`import Component from './path'`
  - 自动解析相对路径（./、../）
  - 自动识别 .ets、.ts 扩展名

- **类型系统跳转增强**
  - 支持 interface 定义跳转
  - 支持 class 定义跳转
  - 支持 type 别名跳转
  - 支持 enum 枚举跳转

### 技术改进
- DefinitionProvider 改为异步实现
- 添加路径解析模块
- 添加跨文件符号查找
- 新增 JSON5 语言配置文件
- 新增 JSON5 TextMate 语法规则

### 构建优化
- tsconfig.json 排除 examples 目录避免编译错误

## [1.0.6] - 2026-01-19

### 新增
- **跨文件 import 跳转**（P0 功能）
  - 支持 `import { Component } from './path'` 跳转到目标文件
  - 支持在 import 语句中跳转到导入的符号定义
  - 支持在代码中使用导入符号时跳转到原定义
  - 支持别名导入：`import { A as B } from './path'`
  - 支持默认导入：`import Component from './path'`
  - 自动解析相对路径（./、../）
  - 自动识别 .ets、.ts 扩展名

- **类型系统跳转增强**
  - 支持 interface 定义跳转
  - 支持 class 定义跳转
  - 支持 type 别名跳转
  - 支持 enum 枚举跳转

### 技术改进
- DefinitionProvider 改为异步实现
- 添加路径解析模块
- 添加跨文件符号查找

## [1.0.5] - 2026-01-19

### 修复
- 修复 VS Code Marketplace 发布错误（移除无效 categories）

## [1.0.4] - 2026-01-19

### 修复
- 修复 package.json categories 配置错误
- 移除自定义类别（ArkTs, HarmonyOS, OpenHarmony）
- 只保留 VS Code Marketplace 支持的标准类别

## [1.0.3] - 2026-01-19

### 文档
- 添加未来规划章节到 README
- 详细规划 MCP（Model Context Protocol）集成
  - MCP Server 能力设计：组件分析、代码生成、规范检查
  - 应用场景：AI 代码审查、智能生成、快速查找
  - 工具和资源规划
- 更新 CODE_NAVIGATION.md 添加 AI 增强路线图

## [1.0.2] - 2026-01-19

### 优化
- 修复图标四角白边问题，改为透明背景
- 优化图标设计，缩小圆角矩形以留出透明边距
- 使用 sharp 库重新生成高质量 PNG 图标
- 改进 SVG 到 PNG 的转换流程

### 技术改进
- 添加 sharp 依赖用于 SVG 渲染
- 优化图标生成脚本

## [1.0.1] - 2026-01-19

### 发布
- 首次发布到 VS Code Marketplace
- 添加项目图标（128x128 PNG）
- 添加 MIT LICENSE
- 完善 package.json 发布元数据（repository, keywords, icon 等）
- 添加发布文档

### 文档
- 重写 README，参照 vscode-java 风格
- 添加徽章（VS Code 版本、许可证）
- 详细列出 V1/V2 装饰器支持表格
- 添加命令和配置项说明
- 添加代码片段、代码导航功能说明
- 添加安装指南（VSIX/开发模式）
- 添加问题排查和贡献指南
- 添加华为官方文档链接

## [0.0.1] - 2026-01-19

### 新增

#### 语法高亮
- 支持 ArkTS V1 装饰器: `@Entry`, `@Component`, `@State`, `@Prop`, `@Link`, `@Provide`, `@Consume`, `@Watch`, `@Observed`, `@ObjectLink`, `@Track`, `@StorageLink`, `@StorageProp`, `@LocalStorageLink`, `@LocalStorageProp`, `@Builder`, `@BuilderParam`, `@Styles`, `@Extend`, `@CustomDialog`, `@Preview`, `@Reusable`, `@Require`
- 支持 ArkTS V2 装饰器 (API 12+): `@ComponentV2`, `@Local`, `@Param`, `@Once`, `@Event`, `@Monitor`, `@Provider`, `@Consumer`, `@Computed`, `@ObservedV2`, `@Trace`, `@ReusableV2`
- 支持 ArkUI 组件关键字高亮
- 支持渲染控制函数: `ForEach`, `LazyForEach`, `Repeat`
- 支持生命周期方法: `aboutToAppear`, `aboutToDisappear`, `onPageShow`, `onPageHide`, `onBackPress`, `onDidBuild`, `aboutToReuse`, `aboutToRecycle`, `onWillApplyTheme`, `build`

#### 智能补全
- 输入 `@` 触发装饰器补全
- 输入 `.` 触发组件属性方法补全
- ArkUI 组件名称补全

#### 代码片段
- V1 组件模板: `entry`, `comp`, `state`, `prop`, `link`, `watch`, `builder` 等
- V2 组件模板: `entryv2`, `compv2`, `local`, `param`, `event`, `monitor`, `provider`, `consumer`, `computed`, `observedv2` 等
- 常用布局片段: `col`, `row`, `list`, `foreach` 等

#### 悬停提示
- 装饰器文档说明
- 组件 API 文档

#### 代码跳转
##### 1. 定义跳转实现
- [x] struct 组件定义跳转
- [x] V1 状态变量跳转（@State, @Prop, @Link, @Provide, @Consume, @Watch, @ObjectLink, @StorageLink, @StorageProp, @LocalStorageLink, @LocalStorageProp, @Track）
- [x] V2 状态变量跳转（@Local, @Param, @Once, @Event, @Provider, @Consumer, @Computed, @Trace）
- [x] @Builder 函数跳转
- [x] @Styles 样式函数跳转
- [x] @Extend 扩展函数跳转

##### 2. 类变量和函数跳转
- [x] 普通变量跳转（let, const, var）
- [x] 成员变量跳转（private, public, protected）
- [x] 函数定义跳转（function 声明）
- [x] 方法定义跳转（类/struct 内方法）
- [x] 箭头函数跳转
- [x] 精确定位到变量名（而非行首）

#### 实时诊断
- 检测未使用的 @State 变量

### 技术说明
- 基于华为官方文档实现，参考 [ArkTS 状态管理概述](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-state-management-overview)
- 支持 `.ets` 文件扩展名
