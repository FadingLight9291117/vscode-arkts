# Config 目录

此目录包含 ArkTS 插件的所有配置文件。

## 目录结构

```
config/
├── index.ts                          # 配置统一导出入口
├── completion/                       # 代码补全相关配置
│   ├── index.ts                     # 补全配置导出
│   ├── types.ts                     # 类型定义
│   ├── README.md                    # 详细说明文档
│   ├── ui/                          # UI 组件配置
│   ├── language/                    # 语言特性配置
│   └── snippets/                    # 代码片段配置
└── completion.config.ts.backup      # 旧配置文件备份
```

## 使用说明

### 从 config 根目录导入（推荐）

```typescript
import {
    DECORATORS,
    COMPONENTS,
    ATTRIBUTES,
    KEYWORDS,
    IMPORT_SNIPPETS,
} from './config';
```

### 直接从子模块导入

```typescript
import { COMPONENTS } from './config/completion/ui';
import { DECORATORS } from './config/completion/language';
```

## 详细文档

请查看 [completion/README.md](completion/README.md) 了解代码补全配置的详细说明。
