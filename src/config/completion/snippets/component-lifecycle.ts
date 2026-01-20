/**
 * 组件生命周期代码片段
 */

import { CompletionItem } from '../types';

export const COMPONENT_LIFECYCLE_SNIPPETS: CompletionItem[] = [
    {
        name: 'aboutToAppear',
        description: '组件生命周期：即将出现（初始化，仅触发一次）',
        snippet: 'aboutToAppear(): void {\n  $0\n}',
    },
    {
        name: 'onDidBuild',
        description: '组件生命周期：首次 build 完成后回调（仅首次渲染触发一次）',
        snippet: 'onDidBuild(): void {\n  $0\n}',
    },
    {
        name: 'aboutToDisappear',
        description: '组件生命周期：即将消失（清理资源，仅触发一次）',
        snippet: 'aboutToDisappear(): void {\n  $0\n}',
    },
    {
        name: 'onPageShow',
        description: '页面生命周期：页面显示（每次显示都会触发）',
        snippet: 'onPageShow(): void {\n  $0\n}',
    },
    {
        name: 'onPageHide',
        description: '页面生命周期：页面隐藏（每次隐藏都会触发）',
        snippet: 'onPageHide(): void {\n  $0\n}',
    },
    {
        name: 'onBackPress',
        description: '页面生命周期：返回按键按下（返回 true 拦截，false 不拦截）',
        snippet: 'onBackPress(): boolean {\n  $0\n  return false;\n}',
    },
];
