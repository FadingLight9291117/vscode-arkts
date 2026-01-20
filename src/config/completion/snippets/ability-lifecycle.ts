/**
 * UIAbility 生命周期代码片段
 */

import { CompletionItem } from '../types';

export const UIABILITY_LIFECYCLE_SNIPPETS: CompletionItem[] = [
    {
        name: 'onCreate',
        description: 'UIAbility 生命周期：创建时回调（初始化应用资源）',
        snippet: 'onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {\n  $0\n}',
    },
    {
        name: 'onForeground',
        description: 'UIAbility 生命周期：前台运行时回调（申请系统资源，WindowStage 可用）',
        snippet: 'onForeground(): void {\n  $0\n}',
    },
    {
        name: 'onBackground',
        description: 'UIAbility 生命周期：后台运行时回调（释放系统资源，WindowStage 不可用）',
        snippet: 'onBackground(): void {\n  $0\n}',
    },
    {
        name: 'onWindowStageCreate',
        description: 'UIAbility 生命周期：WindowStage 创建后回调（设置 UI 加载、WindowStage 事件订阅）',
        snippet: 'onWindowStageCreate(windowStage: window.WindowStage): void {\n  $0\n}',
    },
    {
        name: 'onWindowStageRestore',
        description: 'UIAbility 生命周期：WindowStage 恢复后回调（恢复数据）',
        snippet: 'onWindowStageRestore(windowStage: window.WindowStage): void {\n  $0\n}',
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
