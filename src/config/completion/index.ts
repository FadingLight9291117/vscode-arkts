/**
 * ArkTS 代码补全配置统一导出
 * 
 * 目录结构：
 * - types.ts - 类型定义和工具函数
 * - ui/ - UI 相关配置
 *   - components.ts - UI 组件
 *   - attributes.ts - 组件属性
 * - language/ - 语言特性配置
 *   - decorators.ts - 装饰器
 *   - keywords.ts - 关键字
 * - snippets/ - 代码片段配置
 *   - imports.ts - 导入语句
 *   - component-lifecycle.ts - 组件生命周期
 *   - ability-lifecycle.ts - UIAbility 生命周期
 */

// 类型定义
export type { CompletionItem } from './types';
export { dedupeCompletionItems } from './types';

// UI 相关
export { COMPONENTS, ATTRIBUTES } from './ui';

// 语言特性
export {
    DECORATORS,
    KEYWORDS,
    KEYWORDS_COMMON,
    KEYWORDS_ARKTS_ONLY,
    KEYWORDS_FULL,
} from './language';

// 代码片段
export {
    IMPORT_SNIPPETS,
    COMPONENT_LIFECYCLE_SNIPPETS,
    UIABILITY_LIFECYCLE_SNIPPETS,
} from './snippets';
