/**
 * 测试各种方法定义格式的跳转
 */

@Component
export struct AdvancedMethodJumpTest {
  @State status: boolean = false;

  // 测试1: 简单方法
  syncOpenStatus() {
    console.log('sync');
  }

  // 测试2: 私有方法
  private loadData() {
    console.log('load');
  }

  // 测试3: 异步方法
  async fetchData() {
    console.log('fetch');
  }

  // 测试4: 带返回类型的方法
  getData(): string {
    return 'data';
  }

  // 测试5: 异步 + 返回类型
  async loadUserInfo(): Promise<void> {
    console.log('loading');
  }

  // 测试6: 私有 + 异步 + 返回类型
  private async saveData(): Promise<boolean> {
    return true;
  }

  aboutToAppear() {
    // 点击下面的方法名应该跳转到上面的定义
    this.syncOpenStatus();       // → 第 10 行
    this.loadData();             // → 第 15 行
    this.fetchData();            // → 第 20 行
    this.getData();              // → 第 25 行
    this.loadUserInfo();         // → 第 30 行
    this.saveData();             // → 第 35 行
  }

  build() {
    Column() {
      Text('Test')
    }
  }
}
