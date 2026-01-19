/**
 * ArkTS 代码补全配置文件
 * 包含所有补全项的定义
 */

export interface CompletionItem {
    name: string;
    description: string;
    snippet?: string;
}

function dedupeCompletionItems(items: CompletionItem[]): CompletionItem[] {
    const map = new Map<string, CompletionItem>();
    for (const item of items) {
        // later wins (so *_EXTRA can override base descriptions/snippets)
        map.set(item.name, item);
    }
    return Array.from(map.values());
}

// ArkTS 装饰器列表 (V1 + V2)
export const DECORATORS: CompletionItem[] = [
    // V1 装饰器 - 组件相关
    { name: '@Entry', description: '标记为入口组件' },
    { name: '@Component', description: '标记为自定义组件 (V1)' },
    { name: '@Preview', description: '预览组件' },
    { name: '@Reusable', description: '可复用组件 (V1)' },
    { name: '@CustomDialog', description: '自定义弹窗' },
    
    // V1 装饰器 - 状态管理
    { name: '@State', description: '组件内状态 (V1)' },
    { name: '@Prop', description: '单向数据传递 (V1)' },
    { name: '@Link', description: '双向数据绑定 (V1)' },
    { name: '@Provide', description: '跨组件层级数据传递-提供方 (V1)' },
    { name: '@Consume', description: '跨组件层级数据传递-消费方 (V1)' },
    { name: '@Watch', description: '监听状态变化 (V1)' },
    { name: '@Observed', description: '标记类为可观察 (V1)' },
    { name: '@ObjectLink', description: '嵌套对象双向绑定 (V1)' },
    { name: '@Track', description: '精确观察类属性 (V1)' },
    { name: '@StorageLink', description: 'AppStorage 双向绑定' },
    { name: '@StorageProp', description: 'AppStorage 单向绑定' },
    { name: '@LocalStorageLink', description: 'LocalStorage 双向绑定' },
    { name: '@LocalStorageProp', description: 'LocalStorage 单向绑定' },
    
    // V1 装饰器 - UI 构建
    { name: '@Builder', description: '自定义构建函数' },
    { name: '@BuilderParam', description: '构建函数参数' },
    { name: '@Styles', description: '复用通用样式' },
    { name: '@Extend', description: '扩展特定组件样式' },
    { name: '@Require', description: '必填参数校验' },
    
    // V2 装饰器 - 组件相关 (API 12+)
    { name: '@ComponentV2', description: '自定义组件 (V2，支持深度观测)' },
    { name: '@ReusableV2', description: '可复用组件 (V2)' },
    
    // V2 装饰器 - 状态管理 (API 12+)
    { name: '@Local', description: '组件内部状态，不可外部初始化 (V2)' },
    { name: '@Param', description: '组件输入参数 (V2)' },
    { name: '@Once', description: '仅初始化同步一次，需配合 @Param (V2)' },
    { name: '@Event', description: '组件输出事件 (V2)' },
    { name: '@Monitor', description: '深度监听状态变化 (V2)' },
    { name: '@Provider', description: '跨组件层级数据传递-提供方 (V2)' },
    { name: '@Consumer', description: '跨组件层级数据传递-消费方 (V2)' },
    { name: '@Computed', description: '计算属性 (V2)' },
    { name: '@ObservedV2', description: '标记类为深度可观察 (V2)' },
    { name: '@Trace', description: '深度观测类属性，需配合 @ObservedV2 (V2)' },
];

// ArkTS UI 组件列表
export const COMPONENTS: CompletionItem[] = [
    // 基础组件
    { name: 'Text', description: '文本显示组件', snippet: "Text('${1:text}')" },
    { name: 'Image', description: '图片组件', snippet: "Image(${1:\\$r('app.media.icon')})" },
    { name: 'Button', description: '按钮组件', snippet: "Button('${1:按钮}')" },
    { name: 'TextInput', description: '文本输入框', snippet: "TextInput({ placeholder: '${1:请输入}' })" },
    { name: 'TextArea', description: '多行文本输入框', snippet: "TextArea({ placeholder: '${1:请输入}' })" },
    
    // 容器组件
    { name: 'Column', description: '垂直布局容器', snippet: 'Column() {\n  $0\n}' },
    { name: 'Row', description: '水平布局容器', snippet: 'Row() {\n  $0\n}' },
    { name: 'Stack', description: '堆叠布局容器', snippet: 'Stack() {\n  $0\n}' },
    { name: 'Flex', description: '弹性布局容器', snippet: 'Flex() {\n  $0\n}' },
    { name: 'List', description: '列表容器', snippet: 'List() {\n  $0\n}' },
    { name: 'Grid', description: '网格容器', snippet: 'Grid() {\n  $0\n}' },
    { name: 'Scroll', description: '滚动容器', snippet: 'Scroll() {\n  $0\n}' },
    { name: 'Swiper', description: '轮播容器', snippet: 'Swiper() {\n  $0\n}' },
    { name: 'Tabs', description: '标签页容器', snippet: 'Tabs() {\n  $0\n}' },
    
    // 列表项
    { name: 'ListItem', description: '列表项', snippet: 'ListItem() {\n  $0\n}' },
    { name: 'GridItem', description: '网格项', snippet: 'GridItem() {\n  $0\n}' },
    { name: 'TabContent', description: '标签页内容', snippet: 'TabContent() {\n  $0\n}' },
    
    // 其他组件
    { name: 'Divider', description: '分割线', snippet: 'Divider()' },
    { name: 'Blank', description: '空白填充', snippet: 'Blank()' },
    { name: 'LoadingProgress', description: '加载进度', snippet: 'LoadingProgress()' },
    { name: 'Progress', description: '进度条', snippet: "Progress({ value: ${1:50}, total: ${2:100}, type: ProgressType.${3:Linear} })" },
    { name: 'Slider', description: '滑动条', snippet: "Slider({ value: ${1:50}, min: ${2:0}, max: ${3:100} })" },
    { name: 'Toggle', description: '切换按钮', snippet: "Toggle({ type: ToggleType.${1:Switch}, isOn: ${2:false} })" },
    { name: 'Checkbox', description: '复选框', snippet: "Checkbox({ name: '${1:checkbox}' })" },
    { name: 'Radio', description: '单选按钮', snippet: "Radio({ value: '${1:radio}', group: '${2:group}' })" },
    { name: 'Select', description: '下拉选择', snippet: "Select([${1:{ value: 'option1' \\}}])" },
    { name: 'Search', description: '搜索框', snippet: "Search({ placeholder: '${1:搜索}' })" },
    { name: 'DatePicker', description: '日期选择器', snippet: 'DatePicker()' },
    { name: 'TimePicker', description: '时间选择器', snippet: 'TimePicker()' },
    { name: 'Rating', description: '评分组件', snippet: 'Rating({ rating: ${1:3}, indicator: ${2:false} })' },
    { name: 'Badge', description: '徽章组件', snippet: "Badge({ count: ${1:1}, position: BadgePosition.${2:RightTop} }) {\n  $0\n}" },
    { name: 'Video', description: '视频组件', snippet: "Video({ src: '${1:url}' })" },
    { name: 'Web', description: '网页组件', snippet: "Web({ src: '${1:url}', controller: ${2:webController} })" },
    { name: 'Canvas', description: '画布组件', snippet: "Canvas(${1:canvasContext})" },
    { name: 'XComponent', description: '自定义渲染组件', snippet: "XComponent({ id: '${1:xcomponent}', type: '${2:surface}' })" },
];

// HarmonyOS / ArkTS 常用 import 模板（Kit 推荐写法）
export const IMPORT_SNIPPETS: CompletionItem[] = [
    {
        name: 'import { UIAbility } from @kit.AbilityKit',
        description: '导入 Kit 下单个模块能力（推荐）',
        snippet: "import { ${1:UIAbility} } from '@kit.${2:AbilityKit}';",
    },
    {
        name: 'import { UIAbility, Ability, Context } from @kit.AbilityKit',
        description: '导入 Kit 下多个模块能力',
        snippet: "import { ${1:UIAbility}, ${2:Ability}, ${3:Context} } from '@kit.${4:AbilityKit}';",
    },
    {
        name: 'import * as module from @kit.AbilityKit',
        description: '导入 Kit 全部能力（可能导致包体积变大，谨慎使用）',
        snippet: "import * as ${1:module} from '@kit.${2:AbilityKit}';",
    },
    {
        name: "import UIAbility from @ohos.app.ability.UIAbility",
        description: '直接导入接口模块（旧写法/兼容用法）',
        snippet: "import ${1:UIAbility} from '@ohos.app.ability.UIAbility';",
    },
];

// 生命周期回调（来自华为官方文档）
// - 自定义组件生命周期: aboutToAppear / onDidBuild / aboutToDisappear
// - UIAbility 生命周期: onCreate / onWindowStageCreate / onForeground / onBackground / onWindowStageWillDestroy / onWindowStageDestroy / onDestroy / onNewWant
export const COMPONENT_LIFECYCLE_SNIPPETS: CompletionItem[] = [
    {
        name: 'aboutToAppear',
        description: '自定义组件生命周期：build 之前回调（组件即将出现）',
        snippet: 'aboutToAppear() {\n  $0\n}',
    },
    {
        name: 'onDidBuild',
        description: '自定义组件生命周期：首次 build 完成之后回调（仅首次渲染触发）',
        snippet: 'onDidBuild() {\n  $0\n}',
    },
    {
        name: 'aboutToDisappear',
        description: '自定义组件生命周期：组件析构销毁之前回调（不建议做耗时/异步）',
        snippet: 'aboutToDisappear() {\n  $0\n}',
    },
    {
        name: 'onPageShow',
        description: '页面生命周期：页面显示时回调',
        snippet: 'onPageShow() {\n  $0\n}',
    },
    {
        name: 'onPageHide',
        description: '页面生命周期：页面隐藏时回调',
        snippet: 'onPageHide() {\n  $0\n}',
    },
    {
        name: 'onBackPress',
        description: '页面生命周期：返回按键回调（返回 true 拦截，false 不拦截）',
        snippet: 'onBackPress(): boolean {\n  $0\n  return false;\n}',
    },
];

export const UIABILITY_LIFECYCLE_SNIPPETS: CompletionItem[] = [
    {
        name: 'onCreate',
        description: 'UIAbility 生命周期：首次创建 UIAbility 实例时回调（仅一次）',
        snippet: 'onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {\n  $0\n}',
    },
    {
        name: 'onWindowStageCreate',
        description: 'UIAbility 生命周期：WindowStage 创建完成后回调（可加载 UI、订阅 WindowStage 事件）',
        snippet: 'onWindowStageCreate(windowStage: window.WindowStage): void {\n  $0\n}',
    },
    {
        name: 'onForeground',
        description: 'UIAbility 生命周期：切到前台、UI 可见之前回调（申请资源等）',
        snippet: 'onForeground(): void {\n  $0\n}',
    },
    {
        name: 'onBackground',
        description: 'UIAbility 生命周期：切到后台、UI 不可见之后回调（释放资源，避免耗时操作）',
        snippet: 'onBackground(): void {\n  $0\n}',
    },
    {
        name: 'onWindowStageWillDestroy',
        description: 'UIAbility 生命周期：WindowStage 销毁前回调（此时 WindowStage 仍可用）',
        snippet: 'onWindowStageWillDestroy(windowStage: window.WindowStage): void {\n  $0\n}',
    },
    {
        name: 'onWindowStageDestroy',
        description: 'UIAbility 生命周期：WindowStage 销毁后回调（释放 UI 资源，WindowStage 不可用）',
        snippet: 'onWindowStageDestroy(): void {\n  $0\n}',
    },
    {
        name: 'onDestroy',
        description: 'UIAbility 生命周期：实例销毁前回调（释放资源/保存数据）',
        snippet: 'onDestroy(): void {\n  $0\n}',
    },
    {
        name: 'onNewWant',
        description: 'UIAbility 生命周期：已创建实例再次启动时回调（更新要加载的资源和数据）',
        snippet: 'onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {\n  $0\n}',
    },
];

// 常用属性方法
export const ATTRIBUTES: CompletionItem[] = [
    { name: 'width', description: '设置宽度', snippet: ".width(${1:'100%'})" },
    { name: 'height', description: '设置高度', snippet: ".height(${1:'100%'})" },
    { name: 'size', description: '设置尺寸', snippet: ".size({ width: ${1:100}, height: ${2:100} })" },
    { name: 'padding', description: '设置内边距', snippet: ".padding(${1:10})" },
    { name: 'margin', description: '设置外边距', snippet: ".margin(${1:10})" },
    { name: 'backgroundColor', description: '设置背景色', snippet: ".backgroundColor(${1:'#FFFFFF'})" },
    { name: 'border', description: '设置边框', snippet: ".border({ width: ${1:1}, color: ${2:'#000000'}, radius: ${3:0} })" },
    { name: 'borderRadius', description: '设置圆角', snippet: ".borderRadius(${1:8})" },
    { name: 'opacity', description: '设置透明度', snippet: ".opacity(${1:1})" },
    { name: 'visibility', description: '设置可见性', snippet: ".visibility(Visibility.${1:Visible})" },
    { name: 'zIndex', description: '设置层级', snippet: ".zIndex(${1:0})" },
    { name: 'position', description: '设置位置', snippet: ".position({ x: ${1:0}, y: ${2:0} })" },
    { name: 'layoutWeight', description: '设置布局权重', snippet: ".layoutWeight(${1:1})" },
    { name: 'flexGrow', description: '设置弹性增长', snippet: ".flexGrow(${1:1})" },
    { name: 'flexShrink', description: '设置弹性收缩', snippet: ".flexShrink(${1:1})" },
    { name: 'alignItems', description: '设置子元素对齐', snippet: ".alignItems(${1:HorizontalAlign.Center})" },
    { name: 'justifyContent', description: '设置主轴对齐', snippet: ".justifyContent(${1:FlexAlign.Center})" },
    { name: 'onClick', description: '点击事件', snippet: ".onClick(() => {\n  $0\n})" },
    { name: 'onTouch', description: '触摸事件', snippet: ".onTouch((event: TouchEvent) => {\n  $0\n})" },
    { name: 'onChange', description: '变化事件', snippet: ".onChange((value) => {\n  $0\n})" },
    { name: 'onAppear', description: '出现事件', snippet: ".onAppear(() => {\n  $0\n})" },
    { name: 'onDisAppear', description: '消失事件', snippet: ".onDisAppear(() => {\n  $0\n})" },
    { name: 'fontSize', description: '设置字体大小', snippet: ".fontSize(${1:16})" },
    { name: 'fontColor', description: '设置字体颜色', snippet: ".fontColor(${1:'#000000'})" },
    { name: 'fontWeight', description: '设置字体粗细', snippet: ".fontWeight(FontWeight.${1:Normal})" },
    { name: 'textAlign', description: '设置文本对齐', snippet: ".textAlign(TextAlign.${1:Center})" },
    { name: 'shadow', description: '设置阴影', snippet: ".shadow({ radius: ${1:10}, color: ${2:'#000000'}, offsetX: ${3:0}, offsetY: ${4:2} })" },
];

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
    // 以下条目偏 TS/JS“更完整集合”，但在 ArkTS 中可能被限制/不推荐（参见 TS→ArkTS 迁移指南）
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
