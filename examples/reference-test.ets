/**
 * 测试 Find All References 功能
 * 
 * 测试步骤：
 * 1. 将光标放在第 18 行的 UserData 上，右键 → Find All References（或 Shift+F12）
 *    → 应该显示所有 UserData 的引用位置（第 10、18、25、29、33、37 行）
 * 
 * 2. 将光标放在第 19 行的 loadUserData 上，右键 → Find All References
 *    → 应该显示所有 loadUserData 的引用位置（第 19、33、48 行）
 * 
 * 3. 将光标放在第 24 行的 userId 上，右键 → Find All References
 *    → 应该显示所有 userId 的引用位置（第 24、30、34、40 行）
 */

// 定义：interface UserData
export interface UserData {
  id: string;
  name: string;
  age: number;
}

// 定义：class DataManager
export class DataManager {
  private userId: string = '';
  private userData: UserData | null = null;

  // 定义：方法 loadUserData
  async loadUserData(id: string): Promise<UserData> {
    this.userId = id;
    
    // 引用：UserData
    const data: UserData = {
      id: this.userId,
      name: 'Test User',
      age: 25
    };

    // 引用：loadUserData（递归调用示例）
    if (id === 'refresh') {
      return this.loadUserData('default');
    }

    this.userData = data;
    return data;
  }

  getUserId(): string {
    return this.userId;
  }
}

@Entry
@Component
struct ReferenceTest {
  private manager: DataManager = new DataManager();
  @State data: UserData | null = null;

  aboutToAppear() {
    // 引用：loadUserData
    this.manager.loadUserData('user123')
      .then((result: UserData) => {
        this.data = result;
      });
  }

  build() {
    Column() {
      if (this.data) {
        Text(`User: ${this.data.name}`)
        Text(`Age: ${this.data.age}`)
      }
    }
  }
}
