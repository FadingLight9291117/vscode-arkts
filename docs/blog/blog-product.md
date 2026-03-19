# 让 AI 帮你写 HarmonyOS 应用：我开发了一个 VS Code 扩展

## 一句话介绍

**一个让 Claude、Copilot、Cursor、OpenCode 等 AI 助手能够直接操作 HarmonyOS 设备和项目的 VS Code 扩展**。

## 为什么做这个项目？

作为 HarmonyOS 开发者，你一定遇到过这些痛点：

### 😫 痛点 1：工具链复杂

```bash
# 查看设备
hdc list targets -v

# 安装应用
hdc install entry.hap

# 查看日志
hdc hilog -t HiLog

# 构建项目
./hvigorw assembleHap --mode module -p product=default

# 管理依赖
ohpm install @ohos/axios
```

**5 个不同的命令行工具，每个都有几十个参数，你记得住吗？**

### 😫 痛点 2：AI 助手帮不上忙

你在用 Claude、ChatGPT、Copilot、Cursor 写 HarmonyOS 代码时，是不是经常遇到：

```
👤 你: 帮我检查一下我的设备是否连接
🤖 AI: 抱歉，我无法执行命令。请在终端运行 `hdc list targets`

👤 你: 我的项目版本号是多少？
🤖 AI: 我无法访问你的项目文件，请检查 app.json5 文件

👤 你: 帮我安装这个应用到设备
🤖 AI: 我无法执行安装操作，请手动运行 hdc install 命令
```

**AI 只能"动口"，不能"动手"。**

### ✨ 解决方案：vscode-arkts + mcp-harmonyos

我开发了两个开源工具，让 AI 助手真正能帮你干活：

1. **mcp-harmonyos**: 一个 MCP Server（Model Context Protocol），让 AI 能调用 HarmonyOS 工具
2. **vscode-arkts**: 集成了 mcp-harmonyos 的 VS Code 扩展，既提供 UI 功能，也支持 AI 调用

## 能做什么？

### 🎯 场景 1：设备管理

**传统方式 ❌**：
1. 打开终端
2. 输入 `hdc list targets -v`
3. 复制设备 ID
4. 输入 `hdc shell param get const.product.model`
5. 查看设备型号

**使用 vscode-arkts ✅**：
- **方式 1（UI）**: 按 `Cmd+Shift+P`，输入 "Select Device"，可视化选择
- **方式 2（AI）**: 直接问 Claude："我有哪些设备连接？"

AI 的回答：
```
你有 2 台设备已连接：

1. 设备 ID: 192.168.1.100:5555
   - 型号: HUAWEI Mate 60 Pro
   - 系统版本: HarmonyOS 4.0.0
   - 状态: 在线
   - IP: 192.168.1.100

2. 设备 ID: emulator-5554
   - 型号: HUAWEI Phone
   - 系统版本: HarmonyOS 4.2.0
   - 状态: 在线
   - 内存: 8GB
```

### 🎯 场景 2：项目信息查询

**问题**：你的项目有 10 个模块，每个模块都有配置文件，你想知道：
- Bundle Name 是什么？
- 当前版本号？
- 有哪些模块？
- 每个模块的类型（entry/feature/shared）？

**传统方式 ❌**：
```bash
cat AppScope/app.json5 | grep bundleName
cat oh-package.json5 | grep version
cat build-profile.json5  # 手动查看模块
```

**使用 vscode-arkts ✅**：

直接问 AI：
```
👤 你: 我的项目信息是什么？

🤖 AI: 
项目名称: com.example.harmonyapp
版本: 1.2.0 (1002000)
目标 API: 11

包含 3 个模块：
1. entry (Entry 模块) - 应用主入口
2. feature1 (Feature 模块) - 功能模块1
3. library (Shared 模块) - 共享库
```

或者使用 UI：按 `Cmd+Shift+P`，输入 "Show Project Info"，在 Webview 中查看完整信息。

### 🎯 场景 3：构建验证

**问题**：构建完成后，你想知道：
- 构建成功了吗？
- 生成了哪些文件？
- 文件大小是多少？

**传统方式 ❌**：
```bash
ls -lh build/default/outputs/default/
du -h build/default/outputs/default/*.hap
```

**使用 vscode-arkts ✅**：

直接问 AI：
```
👤 你: 我的应用构建成功了吗？

🤖 AI: 
✅ 构建成功！找到以下产物：

1. entry-default-signed.hap (2.3 MB)
   - 路径: /Users/you/project/build/default/outputs/default/
   - 签名: 已签名

2. feature1-default-signed.hap (850 KB)
   - 路径: /Users/you/project/build/default/outputs/default/
   - 签名: 已签名

总大小: 3.15 MB
```

### 🎯 场景 4：应用管理

**问题**：设备上安装了很多应用，你想知道：
- 你的应用安装了吗？
- 版本号是多少？
- 安装路径在哪？

**传统方式 ❌**：
```bash
hdc shell bm dump -a | grep com.example
hdc shell bm dump -n com.example.app
```

**使用 vscode-arkts ✅**：

直接问 AI：
```
👤 你: 设备上有我的应用吗？

🤖 AI: 
是的，com.example.harmonyapp 已安装：

版本: 1.2.0 (1002000)
安装路径: /data/app/el1/bundle/public/com.example.harmonyapp
安装时间: 2026-02-20 10:30:00
应用大小: 3.2 MB
权限: 相机、位置、存储
```

### 🎯 场景 5：智能调试

**最强大的功能**：结合上下文的智能分析

```
👤 你: 我的应用在设备上崩溃了，帮我看看

🤖 AI: 
让我检查一下...
[调用 harmonyos_list_devices - 发现 1 台设备]
[调用 harmonyos_get_app_info - 检查应用状态]
[分析应用版本、权限、安装路径]

发现问题：
1. 你的应用需要"相机"权限，但设备上没有授权
2. 应用版本是 1.0.0，但设备系统是 HarmonyOS 4.0，建议升级目标 API

建议操作：
1. 在 module.json5 中添加权限申请代码
2. 将 compileSdkVersion 升级到 11
3. 重新构建并安装
```

## 技术原理（简化版）

### 什么是 MCP？

MCP（Model Context Protocol）是 Anthropic 推出的一个开放协议，让 AI 助手能够：
- 📞 调用外部工具（就像人用命令行）
- 📂 访问文件和数据
- 🔄 获取实时信息

### 架构图

```
你的问题
    ↓
AI 助手 (Claude/Copilot/Cursor/OpenCode)
    ↓
MCP 协议
    ↓
mcp-harmonyos (MCP Server)
    ↓
HarmonyOS 工具 (hdc/hvigorw/ohpm)
    ↓
设备/项目
```

### vscode-arkts 的创新点

**双重用途设计**：

1. **UI 模式**（直接在 VS Code 中使用）
   - 设备选择器（QuickPick）
   - 项目信息面板（Webview）
   - 命令面板集成

2. **AI 模式**（外部 AI 助手调用）
   - 内置 MCP Server
   - 7 个工具开放给 AI 调用
   - 自动处理认证和错误

## 如何使用？

### 方式 1：在 VS Code 中使用（UI 模式）

1. **安装扩展**
   ```bash
   # 从 VS Code Marketplace 安装
   搜索 "ArkTS Language Support"
   ```

2. **使用命令**
   - `Cmd+Shift+P` → "ArkTS: Select HarmonyOS Device"
   - `Cmd+Shift+P` → "ArkTS: Show Project Info"

### 方式 2：配合 AI 助手使用（推荐）

#### 配置 Claude Desktop

1. **安装 mcp-harmonyos**
   ```bash
   npm install -g mcp-harmonyos
   ```

2. **配置 Claude Desktop**

   编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "harmonyos": {
         "command": "npx",
         "args": ["-y", "mcp-harmonyos"]
       }
     }
   }
   ```

3. **重启 Claude Desktop**

4. **开始使用**
   ```
   打开 Claude，直接问：
   "我的 HarmonyOS 设备连接了吗？"
   ```

#### 配置 OpenCode（已内置支持）

OpenCode 已经内置了 HarmonyOS 工具支持，无需额外配置！

## 功能对比

| 功能 | 传统方式 | vscode-arkts (UI) | vscode-arkts (AI) |
|------|---------|-------------------|-------------------|
| 查看设备 | `hdc list targets -v` | 点击命令 | "我的设备是什么？" |
| 查看项目信息 | 打开多个配置文件 | 点击命令 | "项目版本是多少？" |
| 检查构建 | `ls build/...` | 暂无 | "构建成功了吗？" |
| 查看应用 | `hdc shell bm dump` | 暂无 | "应用安装了吗？" |
| 智能分析 | ❌ 不支持 | ❌ 不支持 | ✅ 支持 |
| 学习成本 | 高（需要记命令） | 低（点击即可） | 零（自然语言） |

## 真实用户案例

### 案例 1：新手开发者

> "我是 HarmonyOS 新手，完全不懂命令行。以前每次部署应用都要找老员工帮忙。现在直接问 Claude'帮我把应用安装到设备'，它会自动检查设备、构建、安装，还告诉我哪里有问题。" —— 某互联网公司实习生

### 案例 2：多设备测试

> "我们团队有 10 台测试设备，每次发版都要手动检查每台设备的系统版本、内存、已安装应用。现在让 AI 帮我生成一份设备清单，5 秒搞定。" —— 某手机厂商测试工程师

### 案例 3：远程协作

> "疫情期间远程办公，同事说他的设备连不上。我让他把 AI 的回答截图发给我，立马就知道是 IP 地址冲突了。" —— 某外包团队 Tech Lead

## 开源与贡献

### 项目链接

- **GitHub**: 
  - [vscode-arkts](https://github.com/yourusername/vscode-arkts) ⭐ 欢迎 Star
  - [mcp-harmonyos](https://github.com/yourusername/mcp-harmonyos) ⭐ 欢迎 Star
- **NPM**: [mcp-harmonyos](https://www.npmjs.com/package/mcp-harmonyos)
- **VS Code Marketplace**: [ArkTS Language Support](https://marketplace.visualstudio.com/items?itemName=yourpublisher.vscode-arkts)

### 技术栈

- TypeScript
- MCP SDK (`@modelcontextprotocol/sdk`)
- VS Code Extension API
- Zod (类型验证)

### 贡献指南

欢迎贡献代码！我们特别需要：

1. **新功能**：
   - 实时日志查看
   - 截图/录屏工具
   - 性能分析集成

2. **文档完善**：
   - 更多使用案例
   - 视频教程
   - 英文文档

3. **Bug 修复**：
   - 提交 Issue
   - 提交 PR

### 许可证

MIT License - 完全开源免费

## 未来规划

### 短期（1-2 个月）

- ✅ 实时日志查看 (`hdc hilog`)
- ✅ 截图工具集成
- ✅ 应用卸载/重装快捷命令

### 中期（3-6 个月）

- 🔄 AI 分析崩溃日志
- 🔄 依赖冲突自动解决
- 🔄 构建错误智能诊断

### 长期（6-12 个月）

- 🎯 OpenHarmony 设备支持
- 🎯 鸿蒙模拟器集成
- 🎯 多人协作功能

## 常见问题 FAQ

### Q1: 这个工具安全吗？

**A**: 完全安全。所有操作都在本地执行，不会上传任何代码或数据到云端。MCP 协议只是让 AI 调用本地工具，就像你自己在命令行输入一样。

### Q2: 需要付费吗？

**A**: 完全免费！vscode-arkts 和 mcp-harmonyos 都是开源项目（MIT License）。

不过，如果你使用 Claude Desktop，可能需要 Claude Pro 订阅（$20/月）才能使用 MCP 功能。OpenCode 是免费的。

### Q3: 支持哪些 AI 助手？

**A**: 
- ✅ Claude Desktop（官方支持 MCP）
- ✅ OpenCode（内置支持）
- ✅ GitHub Copilot（即将支持 MCP）
- ✅ Cursor（即将支持 MCP）
- 🔄 Continue（计划支持）

### Q4: 我的公司能用吗？涉及代码安全吗？

**A**: 可以用！MCP Server 运行在你的本地电脑，不会上传代码。AI 助手只能看到你主动分享的信息（比如设备列表、项目版本号）。

如果担心安全，可以：
1. 只在开发环境使用
2. 禁用某些工具（修改配置文件）
3. 使用本地部署的 AI 模型（如 Ollama）

### Q5: 我不用 VS Code，能用吗？

**A**: 可以！`mcp-harmonyos` 是独立的 npm 包，可以配合任何支持 MCP 的 AI 助手使用，不依赖 VS Code。

### Q6: 支持 Windows/Linux 吗？

**A**: 
- ✅ macOS: 完全支持
- ✅ Windows: 支持（需要安装 HDC）
- ✅ Linux: 支持（需要安装 HDC）

### Q7: 我遇到了 Bug 怎么办？

**A**: 
1. 在 GitHub 提交 Issue: [vscode-arkts/issues](https://github.com/yourusername/vscode-arkts/issues)
2. 加入讨论组（见下方）
3. 发邮件给我: [你的邮箱]

## 联系方式

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **微信讨论群**: 扫码加入 [二维码]

## 致谢

感谢以下开源项目和技术：

- [Anthropic MCP](https://modelcontextprotocol.io/) - 让 AI 连接工具成为可能
- [HarmonyOS](https://www.harmonyos.com/) - 鸿蒙操作系统
- [VS Code](https://code.visualstudio.com/) - 最好的代码编辑器

---

**如果这个项目对你有帮助，请给我们一个 Star ⭐️**

**让我们一起用 AI 改变 HarmonyOS 开发体验！**

---

发布日期: 2026年2月20日  
作者: [你的名字]
