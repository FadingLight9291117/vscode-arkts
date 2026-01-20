/**
 * ArkTS 组件属性配置
 */

import { CompletionItem } from '../types';

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
