/**
 * ArkTS 装饰器配置
 */

import { CompletionItem } from '../completion/types';

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
