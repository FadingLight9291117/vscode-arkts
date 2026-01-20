/**
 * ArkTS UI 组件配置
 */

import { CompletionItem } from '../completion/types';

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
    { name: 'Checkbox', description: '复选框', snippet: "Checkbox({ name: '${1:checkbox}', group: '${2:group}' })" },
    { name: 'Radio', description: '单选框', snippet: "Radio({ value: '${1:radio}', group: '${2:group}' })" },
    { name: 'Rating', description: '评分组件', snippet: "Rating({ rating: ${1:3.5}, indicator: ${2:false} })" },
    { name: 'Gauge', description: '仪表盘', snippet: "Gauge({ value: ${1:50}, min: ${2:0}, max: ${3:100} })" },
    { name: 'Marquee', description: '跑马灯', snippet: "Marquee({ start: ${1:true}, step: ${2:5}, src: '${3:text}' })" },
    { name: 'Refresh', description: '下拉刷新', snippet: "Refresh({ refreshing: ${1:false} }) {\n  $0\n}" },
    { name: 'WaterFlow', description: '瀑布流容器', snippet: 'WaterFlow() {\n  $0\n}' },
];
