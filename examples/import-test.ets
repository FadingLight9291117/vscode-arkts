// 测试跨文件 import 跳转
// 在下面的 import 语句中，按 F12 或 Ctrl+Click 测试跳转

// ========== 测试 1: 命名导入 ==========
// 将光标放在 UserCard 上，按 F12，应该跳转到 UserCard.ets 中的 struct 定义
import { UserCard, UserInfo, UserService, UserId, UserStatus, formatUserName, DEFAULT_AVATAR } from './components/UserCard'

// ========== 测试 2: 在代码中使用导入的符号 ==========
// 将光标放在下面的 UserCard 上，按 F12，也应该跳转到定义

@Entry
@Component
struct UserListPage {
  @State users: UserInfo[] = []
  @State status: UserStatus = UserStatus.Active
  @State avatarUrl: string = DEFAULT_AVATAR
  
  async aboutToAppear() {
    // 测试：光标放在 UserService 上，按 F12
    const user = await UserService.getUser(1)
    
    // 测试：光标放在 formatUserName 上，按 F12
    const name = formatUserName(user)
    console.log(name)
  }
  
  build() {
    Column() {
      ForEach(this.users, (user: UserInfo) => {
        // 测试：光标放在 UserCard 上，按 F12
        UserCard()
      })
    }
  }
}
