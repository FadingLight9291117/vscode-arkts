# Completion Config 目录结构说明

此目录包含 ArkTS 插件的所有代码补全配置。

## 目录结构

```
config/
└── completion/                 # 代码补全配置根目录
    ├── index.ts               # 主入口，统一导出所有配置
    ├── types.ts               # 类型定义和工具函数
    ├── README.md              # 本文档
    │
    ├── ui/                    # UI 相关配置
    │   ├── index.ts          # UI 模块导出
    │   ├── components.ts     # UI 组件（Text, Button, Column等）
    │   └── attributes.ts     # 组件属性（width, height, onClick等）
    │
    ├── language/              # 语言特性配置
    │   ├── index.ts          # 语言模块导出
    │   ├── decorators.ts     # 装饰器（@State, @Component等）
    │   └── keywords.ts       # 关键字（const, let, if, for等）
    │
    └── snippets/              # 代码片段配置
        ├── index.ts          # 代码片段模块导出
        ├── imports.ts        # 导入语句片段
        ├── component-lifecycle.ts # 组件生命周期片段
        └── ability-lifecycle.ts   # UIAbility 生命周期片段
```

## 使用方式

### 从 config 根目录导入（推荐）

```typescript
import {
    DECORATORS,
    COMPONENTS,
    ATTRIBUTES,
    KEYWORDS,
    IMPORT_SNIPPETS,
    COMPONENT_LIFECYCLE_SNIPPETS,
    UIABILITY_LIFECYCLE_SNIPPETS,
} from '../config';
```

### 从 completion 模块导入

```typescript
import {
    DECORATORS,
    COMPONENTS,
    ATTRIBUTES,
} from '../config/completion';
```

### 按子模块导入

```typescript
// 只导入 UI 相关
import { COMPONENTS, ATTRIBUTES } from '../config/completion/ui';

// 只导入语言特性
import { DECORATORS, KEYWORDS } from '../config/completion/language';

// 只导入代码片段
import { IMPORT_SNIPPETS } from '../config/completion/snippets';
```

## 文件说明

### types.ts
- `CompletionItem` 接口定义
- `dedupeCompletionItems` 去重工具函数

### ui/components.ts
包含所有 UI 组件的补全配置：
- 基础组件：Text, Button, Image 等
- 容器组件：Column, Row, Stack, List 等
- 列表项：ListItem, GridItem 等

### ui/attributes.ts
包含组件属性和方法的补全配置：
- 布局属性：width, height, padding 等
- 样式属性：backgroundColor, fontSize 等
- 事件方法：onClick, onChange 等

### language/decorators.ts
包含 ArkTS 装饰器的补全配置：
- V1 装饰器：@State, @Component, @Builder 等
- V2 装饰器：@ComponentV2, @Local, @Param 等

### language/keywords.ts
包含 TypeScript/ArkTS 关键字的补全配置：
- 声明关键字：const, let, function, class 等
- 控制流：if, for, while, switch 等
- 异步：async, await, Promise 等
- ArkTS 特有：struct, build, aboutToAppear 等

提供多个关键字集合：
- `KEYWORDS` - 默认集合
- `KEYWORDS_COMMON` - 常用关键字
- `KEYWORDS_ARKTS_ONLY` - 仅 ArkTS 特有
- `KEYWORDS_FULL` - 完整集合（包含所有 TS/JS 特性）

### snippets/imports.ts
导入语句代码片段：
- 通用模块导入
- 鸿蒙 SDK 模块导入（hilog, router, http 等）

### snippets/component-lifecycle.ts
组件生命周期方法片段：
- aboutToAppear
- onDidBuild
- aboutToDisappear
- onPageShow/onPageHide
- onBackPress

### snippets/ability-lifecycle.ts
UIAbility 生命周期方法片段：
- onCreate
- onForeground/onBackground
- onWindowStageCreate/Destroy
- onDestroy
- onNewWant

## 维护指南

### 添加新的 UI 组件
编辑 `ui/components.ts`，在 `COMPONENTS` 数组中添加：

```typescript
{ 
    name: 'NewComponent', 
    description: '组件说明', 
    snippet: 'NewComponent() {\n  $0\n}' 
}
```

### 添加新的装饰器
编辑 ` completion 的 `index.ts` 中添加重新导出

## 迁移说明

原有的 `completion.config.ts` (456行) 已被拆分为模块化结构，旧文件已备份为 `../completion.config.ts.backup`。

所有导入路径保持兼容，从 `../config` 导入即可获取所有补全配置
### 添加新的配置类别
1. 在对应文件夹下创建新文件（如 `ui/animations.ts`）
2. 在文件夹的 `index.ts` 中添加导出
3. 在主 `index.ts` 中添加重新导出

## 迁移说明

原有的 `completion.config.ts` (456行) 已被拆分，旧文件已备份为 `completion.config.ts.backup`。

所有导入路径已自动更新为使用新的模块化结构。
