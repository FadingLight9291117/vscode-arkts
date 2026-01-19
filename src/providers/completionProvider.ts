import * as vscode from 'vscode';

/**
 * ArkTS 代码补全提供器
 * 提供 ArkTS 特有的代码补全功能
 */
export class ArkTSCompletionProvider implements vscode.CompletionItemProvider {
    
    // ArkTS 装饰器列表 (V1 + V2)
    private decorators = [
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
    private components = [
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

    // 常用属性方法
    private attributes = [
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

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        const items: vscode.CompletionItem[] = [];

        // 如果以 @ 开头，提供装饰器补全
        if (linePrefix.endsWith('@') || context.triggerCharacter === '@') {
            return this.getDecoratorCompletions();
        }

        // 如果以 . 开头，提供属性方法补全
        if (linePrefix.endsWith('.') || context.triggerCharacter === '.') {
            return this.getAttributeCompletions();
        }

        // 默认提供组件补全
        return this.getComponentCompletions();
    }

    private getDecoratorCompletions(): vscode.CompletionItem[] {
        return this.decorators.map(decorator => {
            const item = new vscode.CompletionItem(
                decorator.name,
                vscode.CompletionItemKind.Keyword
            );
            item.insertText = decorator.name.substring(1); // 去掉 @，因为用户已经输入了
            item.detail = decorator.description;
            item.documentation = new vscode.MarkdownString(`**${decorator.name}**\n\n${decorator.description}`);
            return item;
        });
    }

    private getComponentCompletions(): vscode.CompletionItem[] {
        return this.components.map(comp => {
            const item = new vscode.CompletionItem(
                comp.name,
                vscode.CompletionItemKind.Class
            );
            item.insertText = new vscode.SnippetString(comp.snippet);
            item.detail = `ArkTS 组件: ${comp.description}`;
            item.documentation = new vscode.MarkdownString(`**${comp.name}**\n\n${comp.description}`);
            return item;
        });
    }

    private getAttributeCompletions(): vscode.CompletionItem[] {
        return this.attributes.map(attr => {
            const item = new vscode.CompletionItem(
                attr.name,
                vscode.CompletionItemKind.Method
            );
            item.insertText = new vscode.SnippetString(attr.snippet.substring(1)); // 去掉开头的 .
            item.detail = attr.description;
            item.documentation = new vscode.MarkdownString(`**${attr.name}**\n\n${attr.description}`);
            return item;
        });
    }
}
