// 这是一个 ArkTS 示例文件，用于测试插件功能

import router from '@ohos.router'

// 自定义组件示例
@Component
struct CustomButton {
  @Prop buttonText: string = 'Button'
  
  build() {
    Button(this.buttonText)
      .width(120)
      .height(40)
      .backgroundColor('#007AFF')
      .borderRadius(20)
  }
}

// 入口页面组件
@Entry
@Component
struct Index {
  @State message: string = 'Hello ArkTS'
  @State count: number = 0
  @State items: string[] = ['Item 1', 'Item 2', 'Item 3']
  
  @Watch('onCountChange')
  @State watchedValue: number = 0
  
  // 生命周期 - 组件即将出现
  aboutToAppear() {
    console.log('Index page is about to appear')
  }

  // 生命周期 - 组件即将销毁
  aboutToDisappear() {
    console.log('Index page is about to disappear')
  }
  
  // 监听器回调
  onCountChange() {
    console.log('Count changed to: ' + this.count)
  }
  
  // 自定义构建器
  @Builder
  ItemCard(title: string, index: number) {
    Row() {
      Text(`${index + 1}. ${title}`)
        .fontSize(16)
        .fontColor('#333333')
      
      Blank()
      
      Image($r('app.media.arrow_right'))
        .width(20)
        .height(20)
    }
    .width('100%')
    .height(50)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
  }
  
  build() {
    Column() {
      // 标题栏
      Row() {
        Text(this.message)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#000000')
      }
      .width('100%')
      .height(56)
      .justifyContent(FlexAlign.Center)
      .backgroundColor('#F5F5F5')
      
      // 计数器
      Column({ space: 20 }) {
        Text(`Count: ${this.count}`)
          .fontSize(32)
          .fontColor('#007AFF')
        
        Row({ space: 20 }) {
          Button('-')
            .width(60)
            .height(60)
            .fontSize(24)
            .onClick(() => {
              this.count--
            })
          
          Button('+')
            .width(60)
            .height(60)
            .fontSize(24)
            .onClick(() => {
              this.count++
            })
        }
      }
      .width('100%')
      .padding(20)
      
      // 分割线
      Divider()
        .strokeWidth(1)
        .color('#EEEEEE')
      
      // 列表
      List({ space: 1 }) {
        ForEach(this.items, (item: string, index: number) => {
          ListItem() {
            this.ItemCard(item, index)
          }
          .onClick(() => {
            console.log(`Clicked: ${item}`)
          })
        }, (item: string) => item)
      }
      .width('100%')
      .layoutWeight(1)
      .backgroundColor('#F0F0F0')
      
      // 底部按钮
      CustomButton({ buttonText: '自定义按钮' })
        .margin({ bottom: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}
