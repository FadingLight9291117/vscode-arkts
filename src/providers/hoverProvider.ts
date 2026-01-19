import * as vscode from 'vscode';

/**
 * ArkTS 悬停提示提供器
 * 当用户将鼠标悬停在代码上时，显示相关文档信息
 */
export class ArkTSHoverProvider implements vscode.HoverProvider {
    
    // ArkTS 装饰器文档
    private decoratorDocs: Map<string, string> = new Map([
        ['@Entry', `
**@Entry 装饰器**

标记当前组件为页面入口组件。一个页面有且仅有一个 @Entry 装饰的组件。

\`\`\`typescript
@Entry
@Component
struct Index {
  build() {
    // ...
  }
}
\`\`\`
`],
        ['@Component', `
**@Component 装饰器**

标记一个 struct 为自定义组件。自定义组件必须实现 build() 方法。

\`\`\`typescript
@Component
struct MyComponent {
  build() {
    Column() {
      Text('Hello')
    }
  }
}
\`\`\`
`],
        ['@State', `
**@State 装饰器**

标记组件内部的状态变量。当 @State 变量变化时，会触发组件重新渲染。

\`\`\`typescript
@State message: string = 'Hello World'
\`\`\`

**注意事项：**
- @State 变量必须被初始化
- @State 变量不能在组件外部被直接修改
`],
        ['@Prop', `
**@Prop 装饰器**

单向数据传递。父组件数据变化时会同步到子组件，但子组件不能修改父组件数据。

\`\`\`typescript
// 父组件
MyChild({ count: this.parentCount })

// 子组件
@Prop count: number
\`\`\`
`],
        ['@Link', `
**@Link 装饰器**

双向数据绑定。子组件可以修改父组件的状态。

\`\`\`typescript
// 父组件
MyChild({ count: $count })

// 子组件
@Link count: number
\`\`\`

**注意：** 父组件传递时需要使用 $ 符号
`],
        ['@Provide', `
**@Provide 装饰器**

跨组件层级的数据传递（提供方）。可以跨越多层组件传递数据。

\`\`\`typescript
@Provide('theme') theme: string = 'dark'
\`\`\`
`],
        ['@Consume', `
**@Consume 装饰器**

跨组件层级的数据传递（消费方）。与 @Provide 配合使用。

\`\`\`typescript
@Consume('theme') theme: string
\`\`\`
`],
        ['@Watch', `
**@Watch 装饰器**

监听状态变量的变化，当变量变化时触发回调函数。

\`\`\`typescript
@Watch('onCountChange')
@State count: number = 0

onCountChange() {
  console.log('count changed to: ' + this.count)
}
\`\`\`
`],
        ['@Builder', `
**@Builder 装饰器**

定义一个可复用的 UI 构建函数。

\`\`\`typescript
@Builder
MyBuilder(text: string) {
  Text(text)
    .fontSize(20)
    .fontColor('#333')
}

build() {
  Column() {
    this.MyBuilder('Hello')
  }
}
\`\`\`
`],
        ['@Styles', `
**@Styles 装饰器**

定义可复用的样式。只能用于通用属性。

\`\`\`typescript
@Styles
commonStyle() {
  .width('100%')
  .padding(10)
  .backgroundColor('#F5F5F5')
}

build() {
  Text('Hello')
    .commonStyle()
}
\`\`\`
`],
        ['@Extend', `
**@Extend 装饰器**

扩展特定组件的样式。可以使用组件特有的属性。

\`\`\`typescript
@Extend(Text)
function textStyle() {
  .fontSize(20)
  .fontColor('#333')
}

build() {
  Text('Hello')
    .textStyle()
}
\`\`\`
`],
        ['@CustomDialog', `
**@CustomDialog 装饰器**

标记一个自定义弹窗组件。

\`\`\`typescript
@CustomDialog
struct MyDialog {
  controller: CustomDialogController
  
  build() {
    Column() {
      Text('Dialog Content')
      Button('Close')
        .onClick(() => this.controller.close())
    }
  }
}
\`\`\`
`],
    ]);

    // ArkTS 组件文档
    private componentDocs: Map<string, string> = new Map([
        ['Column', `
**Column 组件**

垂直方向布局容器，子组件从上到下依次排列。

\`\`\`typescript
Column({ space: 10 }) {
  Text('Item 1')
  Text('Item 2')
  Text('Item 3')
}
.width('100%')
.alignItems(HorizontalAlign.Center)
\`\`\`

**常用属性：**
- \`space\`: 子组件间距
- \`alignItems\`: 水平对齐方式
- \`justifyContent\`: 垂直对齐方式
`],
        ['Row', `
**Row 组件**

水平方向布局容器，子组件从左到右依次排列。

\`\`\`typescript
Row({ space: 10 }) {
  Text('Left')
  Text('Right')
}
.width('100%')
.justifyContent(FlexAlign.SpaceBetween)
\`\`\`

**常用属性：**
- \`space\`: 子组件间距
- \`alignItems\`: 垂直对齐方式
- \`justifyContent\`: 水平对齐方式
`],
        ['Text', `
**Text 组件**

文本显示组件。

\`\`\`typescript
Text('Hello World')
  .fontSize(20)
  .fontColor('#333333')
  .fontWeight(FontWeight.Bold)
  .textAlign(TextAlign.Center)
\`\`\`

**常用属性：**
- \`fontSize\`: 字体大小
- \`fontColor\`: 字体颜色
- \`fontWeight\`: 字体粗细
- \`textAlign\`: 文本对齐
- \`maxLines\`: 最大行数
- \`textOverflow\`: 文本溢出处理
`],
        ['Button', `
**Button 组件**

按钮组件，支持点击交互。

\`\`\`typescript
Button('Click Me')
  .width(120)
  .height(40)
  .type(ButtonType.Capsule)
  .onClick(() => {
    console.log('Button clicked')
  })
\`\`\`

**ButtonType 类型：**
- \`Capsule\`: 胶囊按钮
- \`Circle\`: 圆形按钮
- \`Normal\`: 普通按钮
`],
        ['List', `
**List 组件**

列表容器，用于展示大量数据。

\`\`\`typescript
List({ space: 10 }) {
  ForEach(this.items, (item: string) => {
    ListItem() {
      Text(item)
    }
  })
}
.width('100%')
.divider({ strokeWidth: 1, color: '#EEEEEE' })
\`\`\`

**常用属性：**
- \`space\`: 列表项间距
- \`divider\`: 分割线样式
- \`scrollBar\`: 滚动条样式
`],
        ['Image', `
**Image 组件**

图片显示组件。

\`\`\`typescript
// 本地资源
Image($r('app.media.icon'))
  .width(100)
  .height(100)

// 网络图片
Image('https://example.com/image.png')
  .objectFit(ImageFit.Cover)
\`\`\`

**ImageFit 类型：**
- \`Cover\`: 保持宽高比填充
- \`Contain\`: 保持宽高比完整显示
- \`Fill\`: 拉伸填充
- \`None\`: 原始尺寸
`],
        ['ForEach', `
**ForEach 函数**

循环渲染组件。

\`\`\`typescript
ForEach(
  this.items,                          // 数据源
  (item: ItemType, index: number) => { // 渲染函数
    ListItem() {
      Text(item.name)
    }
  },
  (item: ItemType) => item.id          // 键值生成函数
)
\`\`\`

**参数说明：**
1. 数据源数组
2. 渲染每一项的回调函数
3. 键值生成函数（用于优化渲染性能）
`],
    ]);

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);
        
        // 检查是否是装饰器
        const lineText = document.lineAt(position.line).text;
        const decoratorMatch = lineText.match(/@(\w+)/);
        if (decoratorMatch) {
            const decorator = '@' + decoratorMatch[1];
            const doc = this.decoratorDocs.get(decorator);
            if (doc) {
                return new vscode.Hover(new vscode.MarkdownString(doc));
            }
        }

        // 检查是否是组件
        const componentDoc = this.componentDocs.get(word);
        if (componentDoc) {
            return new vscode.Hover(new vscode.MarkdownString(componentDoc));
        }

        return null;
    }
}
