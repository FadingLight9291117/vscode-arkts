/**
 * TypeScript/ArkTS 关键字配置
 */

import { CompletionItem, dedupeCompletionItems } from '../types';

// TypeScript/ArkTS 关键字
export const KEYWORDS: CompletionItem[] = [
    // 声明关键字
    { name: 'const', description: '常量声明', snippet: 'const ${1:name} = ${2:value};' },
    { name: 'let', description: '变量声明', snippet: 'let ${1:name} = ${2:value};' },
    { name: 'var', description: '变量声明（不推荐）', snippet: 'var ${1:name} = ${2:value};' },
    { name: 'function', description: '函数声明', snippet: 'function ${1:name}(${2:params}): ${3:void} {\n  $0\n}' },
    { name: 'class', description: '类声明', snippet: 'class ${1:ClassName} {\n  $0\n}' },
    { name: 'interface', description: '接口声明', snippet: 'interface ${1:InterfaceName} {\n  $0\n}' },
    { name: 'type', description: '类型别名', snippet: 'type ${1:TypeName} = ${2:Type};' },
    { name: 'enum', description: '枚举声明', snippet: 'enum ${1:EnumName} {\n  ${2:Value1},\n  ${3:Value2}\n}' },
    { name: 'declare', description: '声明（仅类型，无运行时输出）', snippet: 'declare ${1:statement}' },
    { name: 'namespace', description: '命名空间', snippet: 'namespace ${1:Name} {\n  $0\n}' },
    { name: 'module', description: '模块声明/增强（较少使用）', snippet: 'module ${1:"module-name"} {\n  $0\n}' },
    
    // 控制流关键字
    { name: 'if', description: '条件判断', snippet: 'if (${1:condition}) {\n  $0\n}' },
    { name: 'else', description: '否则分支', snippet: 'else {\n  $0\n}' },
    { name: 'else if', description: '否则如果', snippet: 'else if (${1:condition}) {\n  $0\n}' },
    { name: 'switch', description: '分支选择', snippet: 'switch (${1:expression}) {\n  case ${2:value}:\n    $0\n    break;\n  default:\n    break;\n}' },
    { name: 'case', description: '分支条件', snippet: 'case ${1:value}:\n  $0\n  break;' },
    { name: 'default', description: '默认分支', snippet: 'default:\n  $0\n  break;' },
    
    // 循环关键字
    { name: 'for', description: 'for 循环', snippet: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n  $0\n}' },
    { name: 'for...of', description: '遍历可迭代对象', snippet: 'for (const ${1:item} of ${2:array}) {\n  $0\n}' },
    { name: 'for...in', description: '遍历对象属性', snippet: 'for (const ${1:key} in ${2:object}) {\n  $0\n}' },
    { name: 'while', description: 'while 循环', snippet: 'while (${1:condition}) {\n  $0\n}' },
    { name: 'do...while', description: 'do-while 循环', snippet: 'do {\n  $0\n} while (${1:condition});' },
    { name: 'do', description: 'do（配合 while）', snippet: 'do {\n  $0\n} while (${1:condition});' },
    { name: 'forEach', description: '数组遍历', snippet: '${1:array}.forEach((${2:item}) => {\n  $0\n});' },
    { name: 'map', description: '数组映射', snippet: '${1:array}.map((${2:item}) => {\n  return $0;\n});' },
    { name: 'filter', description: '数组过滤', snippet: '${1:array}.filter((${2:item}) => {\n  return $0;\n});' },
    
    // 异步关键字
    { name: 'async', description: '异步函数', snippet: 'async function ${1:name}(${2:params}): Promise<${3:void}> {\n  $0\n}' },
    { name: 'await', description: '等待异步', snippet: 'await ${1:promise}' },
    { name: 'await using', description: '资源自动释放（TS/JS 新特性，视目标版本而定）', snippet: 'await using ${1:resource} = ${2:expr};' },
    { name: 'Promise', description: 'Promise 构造', snippet: 'new Promise<${1:T}>((resolve, reject) => {\n  $0\n});' },
    
    // 异常处理
    { name: 'try', description: '异常捕获', snippet: 'try {\n  $0\n} catch (${1:error}) {\n  \n}' },
    { name: 'try...finally', description: '异常捕获+清理', snippet: 'try {\n  $0\n} catch (${1:error}) {\n  \n} finally {\n  \n}' },
    { name: 'catch', description: '捕获异常', snippet: 'catch (${1:error}) {\n  $0\n}' },
    { name: 'finally', description: '最终清理', snippet: 'finally {\n  $0\n}' },
    { name: 'throw', description: '抛出异常', snippet: "throw new Error('${1:message}');" },
    
    // 模块关键字
    { name: 'import', description: '导入模块', snippet: "import { ${1:module} } from '${2:path}';" },
    { name: 'import type', description: '仅导入类型（不影响运行时）', snippet: "import type { ${1:Type} } from '${2:path}';" },
    { name: 'from', description: 'import/export 的 from', snippet: "from '${1:path}'" },
    { name: 'import default', description: '导入默认', snippet: "import ${1:module} from '${2:path}';" },
    { name: 'import *', description: '导入全部', snippet: "import * as ${1:name} from '${2:path}';" },
    { name: 'export', description: '导出', snippet: 'export { ${1:module} };' },
    { name: 'export type', description: '仅导出类型', snippet: 'export type { ${1:Type} };' },
    { name: 'export *', description: '导出全部', snippet: "export * from '${1:path}';" },
    { name: 'export default', description: '默认导出', snippet: 'export default ${1:module};' },
    
    // 类相关
    { name: 'constructor', description: '构造函数', snippet: 'constructor(${1:params}) {\n  $0\n}' },
    { name: 'extends', description: '继承', snippet: 'extends ${1:BaseClass}' },
    { name: 'implements', description: '实现接口', snippet: 'implements ${1:Interface}' },
    { name: 'public', description: '公开成员', snippet: 'public ' },
    { name: 'private', description: '私有成员', snippet: 'private ' },
    { name: 'protected', description: '受保护成员', snippet: 'protected ' },
    { name: 'static', description: '静态成员', snippet: 'static ' },
    { name: 'readonly', description: '只读属性', snippet: 'readonly ' },
    { name: 'abstract', description: '抽象类/方法', snippet: 'abstract ' },
    { name: 'override', description: '覆写父类成员（TS 4.3+）', snippet: 'override ' },
    { name: 'super', description: '调用父类', snippet: 'super(${1:params});' },
    { name: 'this', description: '当前实例', snippet: 'this.' },
    { name: 'new', description: '创建实例', snippet: 'new ${1:ClassName}(${2:params})' },
    { name: 'get', description: 'getter 访问器', snippet: 'get ${1:name}(): ${2:type} {\n  $0\n}' },
    { name: 'set', description: 'setter 访问器', snippet: 'set ${1:name}(${2:value}: ${3:type}) {\n  $0\n}' },
    
    // 类型关键字
    { name: 'string', description: '字符串类型', snippet: 'string' },
    { name: 'number', description: '数字类型', snippet: 'number' },
    { name: 'boolean', description: '布尔类型', snippet: 'boolean' },
    { name: 'true', description: '布尔字面量', snippet: 'true' },
    { name: 'false', description: '布尔字面量', snippet: 'false' },
    { name: 'void', description: '无返回值', snippet: 'void' },
    { name: 'null', description: '空值', snippet: 'null' },
    { name: 'undefined', description: '未定义', snippet: 'undefined' },
    { name: 'any', description: '任意类型', snippet: 'any' },
    { name: 'unknown', description: '未知类型', snippet: 'unknown' },
    { name: 'never', description: '永不类型', snippet: 'never' },
    { name: 'bigint', description: '大整数类型', snippet: 'bigint' },
    { name: 'symbol', description: 'Symbol 类型', snippet: 'symbol' },
    { name: 'object', description: '对象类型', snippet: 'object' },
    { name: 'Array', description: '数组类型', snippet: 'Array<${1:T}>' },
    { name: 'Map', description: 'Map 类型', snippet: 'Map<${1:K}, ${2:V}>' },
    { name: 'Set', description: 'Set 类型', snippet: 'Set<${1:T}>' },
    { name: 'Record', description: 'Record 类型', snippet: 'Record<${1:K}, ${2:V}>' },
    
    // 其他关键字
    { name: 'return', description: '返回值', snippet: 'return ${1:value};' },
    { name: 'break', description: '跳出循环', snippet: 'break;' },
    { name: 'continue', description: '继续循环', snippet: 'continue;' },
    { name: 'debugger', description: '触发调试断点', snippet: 'debugger;' },
    { name: 'delete', description: '删除对象属性', snippet: 'delete ${1:obj}.${2:prop}' },
    { name: 'typeof', description: '获取类型', snippet: 'typeof ${1:value}' },
    { name: 'instanceof', description: '实例判断', snippet: '${1:obj} instanceof ${2:Class}' },
    { name: 'in', description: '属性存在', snippet: "'${1:prop}' in ${2:obj}" },
    { name: 'as', description: '类型断言', snippet: 'as ${1:Type}' },
    { name: 'as const', description: '字面量收窄', snippet: 'as const' },
    { name: 'satisfies', description: '满足某类型（TS 4.9+）', snippet: 'satisfies ${1:Type}' },
    { name: 'is', description: '类型谓词', snippet: 'is ${1:Type}' },
    { name: 'asserts', description: '断言谓词（TS）', snippet: 'asserts ${1:condition}' },
    { name: 'infer', description: '条件类型中推断（TS）', snippet: 'infer ${1:T}' },
    { name: 'keyof', description: '键类型', snippet: 'keyof ${1:Type}' },
    { name: 'yield', description: '生成器产出（generator）', snippet: 'yield ${1:value}' },
    
    // ArkTS 特有
    { name: 'struct', description: 'ArkTS 组件结构体', snippet: 'struct ${1:ComponentName} {\n  build() {\n    $0\n  }\n}' },
    { name: 'build', description: 'UI 构建方法', snippet: 'build() {\n  $0\n}' },
    { name: 'aboutToAppear', description: '组件即将显示', snippet: 'aboutToAppear() {\n  $0\n}' },
    { name: 'onDidBuild', description: '首次 build 完成后回调（仅首次渲染触发）', snippet: 'onDidBuild() {\n  $0\n}' },
    { name: 'aboutToDisappear', description: '组件即将消失', snippet: 'aboutToDisappear() {\n  $0\n}' },
    { name: 'onPageShow', description: '页面显示', snippet: 'onPageShow() {\n  $0\n}' },
    { name: 'onPageHide', description: '页面隐藏', snippet: 'onPageHide() {\n  $0\n}' },
    { name: 'onBackPress', description: '返回按键', snippet: 'onBackPress(): boolean {\n  $0\n  return false;\n}' },
];

// 关键字集合（用于根据配置切换）
// - KEYWORDS: 保持向后兼容（当前默认集合）
// - KEYWORDS_COMMON: 与 KEYWORDS 相同
// - KEYWORDS_ARKTS_ONLY: 仅 ArkTS 生命周期/结构相关
// - KEYWORDS_FULL: 在 KEYWORDS 基础上补齐更多 TS/JS 保留字/上下文关键字

const COMMON_KEYWORD_NAMES = new Set<string>([
    // 声明
    'const', 'let', 'function', 'class', 'interface', 'type', 'enum', 'declare',

    // 控制流/异常
    'if', 'else', 'else if', 'switch', 'case', 'default',
    'for', 'for...of', 'for...in', 'while', 'do...while', 'do',
    'try', 'catch', 'finally', 'throw',
    'return', 'break', 'continue',

    // 异步
    'async', 'await',

    // 模块
    'import', 'import type', 'import default', 'import *', 'from',
    'export', 'export type', 'export *', 'export default',

    // 类相关
    'constructor', 'extends', 'implements',
    'public', 'private', 'protected', 'static', 'readonly', 'abstract', 'override',
    'super', 'this', 'new', 'get', 'set',

    // 类型/字面量
    'string', 'number', 'boolean', 'true', 'false', 'void',
    'null', 'undefined', 'never',
    'object', 'Array', 'Map', 'Set', 'Record',

    // 运算符/其他
    'typeof', 'instanceof', 'in', 'as', 'is', 'keyof',
    'debugger', 'delete',

    // ArkTS 特有（生命周期/结构）
    'struct', 'build',
    'aboutToAppear', 'onDidBuild', 'aboutToDisappear',
    'onPageShow', 'onPageHide', 'onBackPress',
]);

export const KEYWORDS_COMMON: CompletionItem[] = KEYWORDS.filter(k => COMMON_KEYWORD_NAMES.has(k.name));

export const KEYWORDS_ARKTS_ONLY: CompletionItem[] = [
    { name: 'struct', description: 'ArkTS 组件结构体', snippet: 'struct ${1:ComponentName} {\n  build() {\n    $0\n  }\n}' },
    { name: 'build', description: 'UI 构建方法', snippet: 'build() {\n  $0\n}' },
    { name: 'aboutToAppear', description: '组件即将显示', snippet: 'aboutToAppear() {\n  $0\n}' },
    { name: 'onDidBuild', description: '首次 build 完成后回调（仅首次渲染触发）', snippet: 'onDidBuild() {\n  $0\n}' },
    { name: 'aboutToDisappear', description: '组件即将消失', snippet: 'aboutToDisappear() {\n  $0\n}' },
    { name: 'onPageShow', description: '页面显示', snippet: 'onPageShow() {\n  $0\n}' },
    { name: 'onPageHide', description: '页面隐藏', snippet: 'onPageHide() {\n  $0\n}' },
    { name: 'onBackPress', description: '返回按键', snippet: 'onBackPress(): boolean {\n  $0\n  return false;\n}' },
];

const KEYWORDS_FULL_EXTRA: CompletionItem[] = [
    // 以下条目偏 TS/JS"更完整集合"，但在 ArkTS 中可能被限制/不推荐（参见 TS→ArkTS 迁移指南）
    { name: 'var', description: '变量声明（ArkTS 迁移指南建议使用 let）', snippet: 'var ${1:name} = ${2:value};' },
    { name: 'any', description: '任意类型（ArkTS 迁移指南建议使用具体类型）', snippet: 'any' },
    { name: 'unknown', description: '未知类型（ArkTS 迁移指南建议使用具体类型）', snippet: 'unknown' },
    { name: 'namespace', description: '命名空间（ArkTS 对命名/唯一性有约束）', snippet: 'namespace ${1:Name} {\n  $0\n}' },
    { name: 'module', description: '模块声明/增强（较少使用，ArkTS 对命名/唯一性有约束）', snippet: 'module ${1:"module-name"} {\n  $0\n}' },
    { name: 'symbol', description: 'symbol 类型（ArkTS 不支持 Symbol() API）', snippet: 'symbol' },

    // TS 高级类型/上下文关键字（不一定被 ArkTS 支持，放在 full）
    { name: 'as const', description: '字面量收窄（TS）', snippet: 'as const' },
    { name: 'satisfies', description: '满足某类型（TS 4.9+）', snippet: 'satisfies ${1:Type}' },
    { name: 'asserts', description: '断言谓词（TS）', snippet: 'asserts ${1:condition}' },
    { name: 'infer', description: '条件类型中推断（TS）', snippet: 'infer ${1:T}' },
    { name: 'out', description: '变型修饰符 out（TS）', snippet: 'out ' },

    // 其他 JS 特性（更完整集合）
    { name: 'with', description: 'with（不推荐/严格模式限制）', snippet: 'with (${1:obj}) {\n  $0\n}' },
    { name: 'yield*', description: '生成器委托产出', snippet: 'yield* ${1:iterable}' },
    { name: 'using', description: '资源自动释放（新特性，视目标版本而定）', snippet: 'using ${1:resource} = ${2:expr};' },
    { name: 'await using', description: '资源自动释放（新特性，视目标版本而定）', snippet: 'await using ${1:resource} = ${2:expr};' },
];

export const KEYWORDS_FULL: CompletionItem[] = dedupeCompletionItems([
    ...KEYWORDS,
    ...KEYWORDS_FULL_EXTRA,
]);
