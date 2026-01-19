# 代码跳转功能清单

本文档记录 ArkTS Language Support 插件的代码跳转功能实现状态。

## 1. 定义跳转实现

### struct 组件定义
- [x] 跳转到 `struct` 定义位置
- 匹配模式: `struct {word} {`
- 示例: `struct MyComponent { }`

### V1 状态变量跳转
| 装饰器 | 状态 | 说明 |
|--------|------|------|
| @State | ✅ | 组件内状态 |
| @Prop | ✅ | 单向数据传递 |
| @Link | ✅ | 双向数据绑定 |
| @Provide | ✅ | 跨组件层级数据传递（提供方） |
| @Consume | ✅ | 跨组件层级数据传递（消费方） |
| @Watch | ✅ | 监听状态变化 |
| @ObjectLink | ✅ | 嵌套对象双向绑定 |
| @StorageLink | ✅ | AppStorage 双向绑定 |
| @StorageProp | ✅ | AppStorage 单向绑定 |
| @LocalStorageLink | ✅ | LocalStorage 双向绑定 |
| @LocalStorageProp | ✅ | LocalStorage 单向绑定 |
| @Track | ✅ | 精确观察类属性 |

### V2 状态变量跳转 (API 12+)
| 装饰器 | 状态 | 说明 |
|--------|------|------|
| @Local | ✅ | 组件内部状态，不可外部初始化 |
| @Param | ✅ | 组件输入参数 |
| @Once | ✅ | 仅初始化同步一次 |
| @Event | ✅ | 组件输出事件 |
| @Provider | ✅ | 跨组件层级数据传递（提供方） |
| @Consumer | ✅ | 跨组件层级数据传递（消费方） |
| @Computed | ✅ | 计算属性 |
| @Trace | ✅ | 深度观测类属性 |

### UI 构建函数跳转
| 类型 | 状态 | 匹配模式 |
|------|------|----------|
| @Builder | ✅ | `@Builder {word}(` |
| @Styles | ✅ | `@Styles {word}(` |
| @Extend | ✅ | `@Extend({Component}) function {word}(` |

---

## 2. 类变量和函数跳转

### 变量定义跳转
| 类型 | 状态 | 匹配模式 |
|------|------|----------|
| let 变量 | ✅ | `let {word} =` 或 `let {word}:` |
| const 常量 | ✅ | `const {word} =` 或 `const {word}:` |
| var 变量 | ✅ | `var {word} =` 或 `var {word}:` |

### 成员变量跳转
| 类型 | 状态 | 匹配模式 |
|------|------|----------|
| private 成员 | ✅ | `private {word}: {type}` |
| public 成员 | ✅ | `public {word}: {type}` |
| protected 成员 | ✅ | `protected {word}: {type}` |
| 无修饰符成员 | ✅ | `{word}: {type}` |

### 函数定义跳转
| 类型 | 状态 | 匹配模式 |
|------|------|----------|
| function 声明 | ✅ | `function {word}(` |
| 类/struct 方法 | ✅ | `{word}(...) {` |
| 箭头函数 | ✅ | `const {word} = (...) =>` |

---

## 3. 跳转精确度

- [x] **精确定位到变量名** - 跳转后光标定位到目标单词，而非行首
- [x] **选中目标单词** - 返回 Range 而非 Position，跳转后目标单词被选中

### 实现原理
```typescript
const createLocationForWord = (matchIndex: number, matchedText: string): vscode.Location => {
    // 在匹配文本中找到 word 的偏移位置
    const wordIndexInMatch = matchedText.indexOf(word);
    const wordStartIndex = matchIndex + wordIndexInMatch;
    const wordEndIndex = wordStartIndex + word.length;
    
    const startPos = document.positionAt(wordStartIndex);
    const endPos = document.positionAt(wordEndIndex);
    
    return new vscode.Location(document.uri, new vscode.Range(startPos, endPos));
};
```

---

## 4. 待实现功能

### 4.1 跨文件跳转 (高优先级 ⭐⭐⭐)
| 功能 | 状态 | 说明 |
|------|------|------|
| import 语句跳转 | ❌ | `import { MyComponent } from './MyComponent'` → 跳转到文件 |
| 组件跨文件引用 | ❌ | 使用其他文件定义的组件时跳转 |
| @ohos 模块跳转 | ❌ | `import router from '@ohos.router'` |
| 相对路径解析 | ❌ | 解析 `./`, `../` 路径 |

### 4.2 类型系统跳转
| 功能 | 状态 | 优先级 | 说明 |
|------|------|--------|------|
| interface 定义跳转 | ❌ | ⭐⭐⭐ | `interface Person { }` |
| class 类定义跳转 | ❌ | ⭐⭐⭐ | `class MyClass { }` |
| type 别名跳转 | ❌ | ⭐⭐ | `type ID = string` |
| enum 枚举跳转 | ❌ | ⭐⭐ | `enum Color { Red, Green }` |
| 泛型类型跳转 | ❌ | ⭐ | `Array<T>` 中的 T |

### 4.3 引用查找
| 功能 | 状态 | VS Code API | 说明 |
|------|------|-------------|------|
| Find All References | ❌ | `ReferenceProvider` | 查找所有引用位置 |
| Peek Definition | ✅ | 已有 DefinitionProvider | 预览定义（自动支持） |
| Go to Implementation | ❌ | `ImplementationProvider` | 跳转到实现 |
| Go to Type Definition | ❌ | `TypeDefinitionProvider` | 跳转到类型定义 |

### 4.4 符号导航
| 功能 | 状态 | VS Code API | 说明 |
|------|------|-------------|------|
| Document Outline | ❌ | `DocumentSymbolProvider` | 文档大纲（Ctrl+Shift+O） |
| Workspace Symbol Search | ❌ | `WorkspaceSymbolProvider` | 工作区符号搜索（Ctrl+T） |
| Breadcrumbs | ❌ | 依赖 DocumentSymbolProvider | 面包屑导航 |

### 4.5 代码编辑
| 功能 | 状态 | VS Code API | 说明 |
|------|------|-------------|------|
| Rename Symbol | ❌ | `RenameProvider` | 重命名符号（F2） |
| Highlight References | ❌ | `DocumentHighlightProvider` | 高亮所有引用 |

---

## 5. 准确性问题

### 当前正则匹配的局限性
| 问题 | 当前状态 | 解决方案 |
|------|----------|----------|
| 匹配到注释内容 | ❌ 可能误匹配 | 需要排除注释区域 |
| 作用域分析 | ❌ 不支持 | 需要 AST 解析 |
| 变量遮蔽 | ❌ 不支持 | 需要作用域链分析 |
| 同名但不同定义 | ❌ 可能跳错 | 需要语义分析 |

---

## 6. 技术改进路线

### 短期改进（正则增强）
- [ ] 添加 interface/type/enum/class 跳转
- [ ] 添加跨文件 import 解析（简单路径解析）
- [ ] 添加 DocumentSymbolProvider（文档大纲）
- [ ] 添加 ReferenceProvider（引用查找）
- [ ] 排除注释区域的匹配

### 长期改进（AST/LSP）
- [ ] 使用 TypeScript Compiler API 解析 AST
- [ ] 实现 Language Server Protocol (LSP)
- [ ] 建立工作区符号索引
- [ ] 支持增量解析
- [ ] 完整的作用域分析

---

## 7. 实现优先级建议

| 优先级 | 功能 | 原因 |
|--------|------|------|
| P0 | 跨文件 import 跳转 | 最常用功能 |
| P0 | DocumentSymbolProvider | 提供文档大纲，用户体验提升大 |
| P1 | interface/type/class 跳转 | 类型系统完整性 |
| P1 | ReferenceProvider | 查找引用是常用功能 |
| P2 | RenameProvider | 重构功能 |
| P2 | DocumentHighlightProvider | 辅助阅读 |
| P3 | WorkspaceSymbolProvider | 大型项目需要 |
| P3 | LSP 重构 | 长期架构优化 |

---

## 8. 相关文件

| 文件 | 说明 |
|------|------|
| [src/providers/definitionProvider.ts](src/providers/definitionProvider.ts) | 定义跳转提供器实现 |
| [src/extension.ts](src/extension.ts) | 插件入口，注册 DefinitionProvider |
