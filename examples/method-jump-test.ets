/**
 * 测试方法调用跳转
 * 
 * 测试步骤：
 * 1. 将光标放在第 28 行的 syncOpenStatus 上按 F12
 *    → 应跳转到第 12 行的方法定义
 * 
 * 2. 将光标放在第 29 行的 loadData 上按 F12
 *    → 应跳转到第 17 行的方法定义
 * 
 * 3. 将光标放在第 30 行的 updateUI 上按 F12
 *    → 应跳转到第 22 行的方法定义
 */

@Component
export struct MethodJumpTest {
  @State isOpen: boolean = false;
  @State data: string[] = [];

  // 方法定义 1
  syncOpenStatus() {
    console.log('Syncing open status:', this.isOpen);
  }

  // 方法定义 2
  loadData() {
    this.data = ['item1', 'item2', 'item3'];
  }

  // 方法定义 3
  updateUI() {
    console.log('Updating UI with data:', this.data);
  }

  aboutToAppear() {
    // 测试：点击这些方法名应该跳转到上面的定义
    this.syncOpenStatus();
    this.loadData();
    this.updateUI();
  }

  build() {
    Column() {
      Text('Method Jump Test')
        .onClick(() => {
          // 测试：点击这里的方法名也应该跳转
          this.syncOpenStatus();
          this.loadData();
          this.updateUI();
        })
    }
  }
}
