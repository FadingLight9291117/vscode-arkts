/**
 * TypeScript/ArkTS 关键字配置
 */

import { CompletionItem } from '../types';

// TypeScript/ArkTS 关键字完整列表
export const KEYWORDS: CompletionItem[] = [
    // 声明关键字
    { name: 'const', description: '常量声明', snippet: 'const ${1:name} = ${2:value};' },
    { name: 'let', description: '变量声明', snippet: 'let ${1:name} = ${2:value};' },
    { name: 'function', description: '函数声明', snippet: 'function ${1:name}(${2:params}): ${3:void} {\n  $0\n}' },
    { name: 'class', description: '类声明', snippet: 'class ${1:ClassName} {\n  $0\n}' },
    { name: 'interface', description: '接口声明', snippet: 'interface ${1:InterfaceName} {\n  $0\n}' },
    { name: 'type', description: '类型别名', snippet: 'type ${1:TypeName} = ${2:Type};' },
    { name: 'enum', description: '枚举声明', snippet: 'enum ${1:EnumName} {\n  ${2:Value1},\n  ${3:Value2}\n}' },
    { name: 'declare', description: '声明（仅类型，无运行时输出）', snippet: 'declare ${1:statement}' },
    
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
    
    // 异步关键字
    { name: 'async', description: '异步函数', snippet: 'async function ${1:name}(${2:params}): Promise<${3:void}> {\n  $0\n}' },
    { name: 'await', description: '等待异步', snippet: 'await ${1:promise}' },
    
    // 异常处理
    { name: 'try', description: '异常捕获', snippet: 'try {\n  $0\n} catch (${1:error}) {\n  \n}' },
    { name: 'catch', description: '捕获异常', snippet: 'catch (${1:error}) {\n  $0\n}' },
    { name: 'finally', description: '最终清理', snippet: 'finally {\n  $0\n}' },
    { name: 'throw', description: '抛出异常', snippet: "throw new Error('${1:message}');" },
    { name: 'return', description: '返回值', snippet: 'return ${1:value};' },
    { name: 'break', description: '跳出循环', snippet: 'break;' },
    { name: 'continue', description: '继续循环', snippet: 'continue;' },
    
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
    { name: 'never', description: '永不类型', snippet: 'never' },
    { name: 'object', description: '对象类型', snippet: 'object' },
    { name: 'Array', description: '数组类型', snippet: 'Array<${1:T}>' },
    { name: 'Map', description: 'Map 类型', snippet: 'Map<${1:K}, ${2:V}>' },
    { name: 'Set', description: 'Set 类型', snippet: 'Set<${1:T}>' },
    { name: 'Record', description: 'Record 类型', snippet: 'Record<${1:K}, ${2:V}>' },
    
    // 其他常用关键字
    { name: 'typeof', description: '获取类型', snippet: 'typeof ${1:value}' },
    { name: 'instanceof', description: '实例判断', snippet: '${1:obj} instanceof ${2:Class}' },
    { name: 'in', description: '属性存在', snippet: "'${1:prop}' in ${2:obj}" },
    { name: 'as', description: '类型断言', snippet: 'as ${1:Type}' },
    { name: 'is', description: '类型谓词', snippet: 'is ${1:Type}' },
    { name: 'keyof', description: '键类型', snippet: 'keyof ${1:Type}' },
    { name: 'debugger', description: '触发调试断点', snippet: 'debugger;' },
    { name: 'delete', description: '删除对象属性', snippet: 'delete ${1:obj}.${2:prop}' },
    
    // ArkTS 特有
    { name: 'struct', description: 'ArkTS 组件结构体', snippet: 'struct ${1:ComponentName} {\n  build() {\n    $0\n  }\n}' },
    { name: 'build', description: 'UI 构建方法', snippet: 'build() {\n  $0\n}' },
    { name: 'aboutToAppear', description: '组件即将显示', snippet: 'aboutToAppear() {\n  $0\n}' },
    { name: 'onDidBuild', description: '首次 build 完成后回调（仅首次渲染触发）', snippet: 'onDidBuild() {\n  $0\n}' },
    { name: 'aboutToDisappear', description: '组件即将消失', snippet: 'aboutToDisappear() {\n  $0\n}' },
    { name: 'onPageShow', description: '页面显示', snippet: 'onPageShow() {\n  $0\n}' },
    { name: 'onPageHide', description: '页面隐藏', snippet: 'onPageHide() {\n  $0\n}' },
    { name: 'onBackPress', description: '返回按键', snippet: 'onBackPress(): boolean {\n  $0\n  return false;\n}' },
    
    // ArkTS 不推荐/不支持的关键字（放在最后）
    { name: 'var', description: '变量声明（ArkTS 不推荐，请使用 let）', snippet: 'var ${1:name} = ${2:value};' },
    { name: 'any', description: '任意类型（ArkTS 不推荐，请使用具体类型）', snippet: 'any' },
    { name: 'unknown', description: '未知类型（ArkTS 不推荐，请使用具体类型）', snippet: 'unknown' },
    { name: 'namespace', description: '命名空间（ArkTS 受限）', snippet: 'namespace ${1:Name} {\n  $0\n}' },
    { name: 'module', description: '模块声明（ArkTS 受限）', snippet: 'module ${1:"module-name"} {\n  $0\n}' },
    { name: 'symbol', description: 'Symbol 类型（ArkTS 不支持）', snippet: 'symbol' },
    { name: 'bigint', description: '大整数类型（ArkTS 支持有限）', snippet: 'bigint' },
    { name: 'as const', description: '字面量收窄（TS 特性）', snippet: 'as const' },
    { name: 'satisfies', description: '满足某类型（TS 4.9+）', snippet: 'satisfies ${1:Type}' },
    { name: 'asserts', description: '断言谓词（TS 特性）', snippet: 'asserts ${1:condition}' },
    { name: 'infer', description: '条件类型中推断（TS 特性）', snippet: 'infer ${1:T}' },
    { name: 'yield', description: '生成器产出（ArkTS 支持有限）', snippet: 'yield ${1:value}' },
];
