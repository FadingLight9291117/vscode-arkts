# 更新日志

本文件记录 ArkTS Language Support 插件的所有重要更改。

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
