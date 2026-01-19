// 测试跨文件 import 跳转功能

// 模拟从其他文件导入组件
// 按 F12 或 Ctrl+Click 测试跳转

export struct UserCard {
  @State username: string = ''
  @State avatar: string = ''
  
  build() {
    Column() {
      Image(this.avatar)
        .width(80)
        .height(80)
        .borderRadius(40)
      
      Text(this.username)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
    }
  }
}

export interface UserInfo {
  id: number
  name: string
  email: string
}

export class UserService {
  static async getUser(id: number): Promise<UserInfo> {
    // 模拟 API 调用
    return { id, name: 'Test User', email: 'test@example.com' }
  }
}

export type UserId = string | number

export enum UserStatus {
  Active,
  Inactive,
  Banned
}

export function formatUserName(user: UserInfo): string {
  return user.name.toUpperCase()
}

export const DEFAULT_AVATAR = 'https://example.com/default-avatar.png'
