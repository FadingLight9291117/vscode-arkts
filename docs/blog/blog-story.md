# 我是如何让 AI 帮我写 HarmonyOS 应用的：一个周末项目的诞生

## 起因：一次凌晨的吐槽

时间回到一个月前的凌晨 2 点。

我正在赶一个 HarmonyOS 应用的项目，测试环节需要在 5 台不同的设备上验证兼容性。每台设备都要重复这些步骤：

1. `hdc list targets` - 找到设备 ID
2. `hdc -t <设备ID> shell param get` - 查看系统版本
3. `hdc -t <设备ID> install entry.hap` - 安装应用
4. `hdc -t <设备ID> shell hilog` - 查看日志

每台设备大概要花 10 分钟，5 台设备就是 50 分钟。

我突然想起白天在用 Claude 写代码时的场景：

```
我: "帮我写一个网络请求函数"
Claude: "好的，这是代码..."
```

然后我尝试问：

```
我: "帮我检查一下我的 HarmonyOS 设备是否连接"
Claude: "抱歉，我无法执行系统命令。请在终端运行 `hdc list targets`"
```

**我当时的想法是：Claude 这么聪明，为什么不能帮我执行命令呢？**

凌晨 2 点的疲惫 + 一个想法 = 一个新项目的诞生。

## 第一步：调研 MCP

我记得 Anthropic 几个月前发布了一个叫 MCP（Model Context Protocol）的东西，号称能让 AI 调用外部工具。

我打开文档，看到这段话：

> "MCP enables AI assistants to securely interact with local and remote resources through a standardized protocol."

**这不就是我想要的吗？**

我立马写了一个 Hello World 版本的 MCP Server：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "test-server",
  version: "0.0.1"
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "say_hello",
    description: "Say hello",
    inputSchema: { type: "object", properties: {} }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "say_hello") {
    return {
      content: [{ type: "text", text: "Hello from MCP!" }]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

配置到 Claude Desktop：

```json
{
  "mcpServers": {
    "test": {
      "command": "node",
      "args": ["/path/to/server.js"]
    }
  }
}
```

重启 Claude，问它：

```
我: "say hello to me"
Claude: 
[调用 say_hello 工具]
Hello from MCP!
```

**卧槽，成功了！** 

这是凌晨 3 点，我决定通宵把这个项目做出来。

## 第二步：第一个 HarmonyOS 工具

既然 MCP 能用，那就直接调用 `hdc` 命令吧。

我写了第一个工具：

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function listDevices() {
  try {
    const { stdout } = await execAsync('hdc list targets -v');
    return {
      content: [{ 
        type: "text", 
        text: stdout 
      }]
    };
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error.message}` 
      }],
      isError: true
    };
  }
}

// 注册到 MCP Server
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "list_devices") {
    return await listDevices();
  }
});
```

测试：

```
我: "我有哪些设备连接？"
Claude: 
[调用 list_devices]
192.168.1.100:5555
emulator-5554
```

**又成功了！** 凌晨 4 点，我已经有点飘了。

## 第三步：解析设备信息（第一个大坑）

`hdc list targets -v` 的输出是这样的：

```
192.168.1.100:5555      TCP     HUAWEI Mate 60 Pro
emulator-5554           USB     HUAWEI Phone
```

我需要解析出：设备 ID、连接方式、设备型号。

第一版代码（凌晨 4:30，脑子已经不太清醒）：

```typescript
function parseDevices(output: string) {
  const lines = output.split('\n');
  const devices = lines.map(line => {
    const parts = line.split(/\s+/);
    return {
      deviceId: parts[0],
      connection: parts[1],
      model: parts.slice(2).join(' ')
    };
  });
  return devices;
}
```

测试...失败了。

原来 `hdc list targets -v` 在某些情况下输出格式不一样：

```
# 有时候会有这种格式
192.168.1.100:5555      Connected       HUAWEI Mate 60 Pro

# 有时候设备名字里有空格
emulator-5554           USB     HUAWEI  Mate  60  Pro  Plus
```

我意识到简单的字符串分割不够，需要用正则表达式。

经过 10 次调试（和 3 杯咖啡），最终版本：

```typescript
function parseDevices(output: string) {
  const deviceRegex = /^(\S+)\s+(\S+)\s+(.+)$/;
  const lines = output.trim().split('\n');
  
  return lines
    .filter(line => line.trim())
    .map(line => {
      const match = line.match(deviceRegex);
      if (!match) return null;
      
      return {
        deviceId: match[1],
        connection: match[2],
        model: match[3].trim()
      };
    })
    .filter(Boolean);
}
```

凌晨 5:30，第一个工具完美运行。

## 第四步：获取更多设备信息（第二个大坑）

现在能列出设备了，但我还想知道：
- 系统版本
- 设备内存
- 屏幕分辨率

我需要执行：

```bash
hdc -t <设备ID> shell param get const.ohos.fullname
hdc -t <设备ID> shell param get const.product.memory
hdc -t <设备ID> shell wm size
```

第一版代码（天真的我）：

```typescript
async function getDeviceInfo(deviceId: string) {
  const version = await execAsync(`hdc -t ${deviceId} shell param get const.ohos.fullname`);
  const memory = await execAsync(`hdc -t ${deviceId} shell param get const.product.memory`);
  const screen = await execAsync(`hdc -t ${deviceId} shell wm size`);
  
  return { version, memory, screen };
}
```

运行...超级慢！每个命令都要 1-2 秒，串行执行要 3-6 秒。

**改用并行**：

```typescript
async function getDeviceInfo(deviceId: string) {
  const [version, memory, screen] = await Promise.all([
    execAsync(`hdc -t ${deviceId} shell param get const.ohos.fullname`),
    execAsync(`hdc -t ${deviceId} shell param get const.product.memory`),
    execAsync(`hdc -t ${deviceId} shell wm size`)
  ]);
  
  return { version, memory, screen };
}
```

从 6 秒降到 2 秒，快了 3 倍！

但还有一个问题：**某些参数在某些设备上不存在**。

比如模拟器没有 `const.product.memory`，执行会报错：

```
Error: param not found: const.product.memory
```

需要加错误处理：

```typescript
async function getParam(deviceId: string, paramName: string): Promise<string> {
  try {
    const { stdout } = await execAsync(
      `hdc -t ${deviceId} shell param get ${paramName}`
    );
    return stdout.trim();
  } catch (error) {
    return 'N/A';  // 参数不存在时返回 N/A
  }
}

async function getDeviceInfo(deviceId: string) {
  const [version, memory, screen] = await Promise.all([
    getParam(deviceId, 'const.ohos.fullname'),
    getParam(deviceId, 'const.product.memory'),
    getParam(deviceId, 'const.product.screenDensity')
  ]);
  
  return { version, memory, screen };
}
```

凌晨 6:30，设备信息获取完美运行。

## 第五步：项目信息解析（第三个大坑）

现在要读取 HarmonyOS 项目的配置文件。

HarmonyOS 项目有这些配置文件：
- `AppScope/app.json5` - 应用级配置
- `oh-package.json5` - 项目元数据
- `build-profile.json5` - 构建配置

**注意：这些都是 JSON5 格式，不是标准 JSON！**

JSON5 允许：
- 单行注释 `// comment`
- 多行注释 `/* comment */`
- 尾随逗号 `{ "a": 1, }`
- 单引号字符串 `'value'`

我天真地用 `JSON.parse()`：

```typescript
const content = fs.readFileSync('app.json5', 'utf-8');
const config = JSON.parse(content);  // ❌ 报错！
```

```
SyntaxError: Unexpected token / in JSON at position 12
```

因为文件里有注释：

```json5
{
  // 应用配置
  "bundleName": "com.example.app",
  "version": {
    "code": 1000000,
    "name": "1.0.0"
  }
}
```

**解决方案**：使用 `json5` 库

```bash
npm install json5
```

```typescript
import JSON5 from 'json5';

const content = fs.readFileSync('app.json5', 'utf-8');
const config = JSON5.parse(content);  // ✅ 成功！
```

凌晨 7:00，项目信息解析完成。

天已经亮了，我看着窗外的朝阳，感觉自己像个黑客。

## 第六步：集成到 VS Code（转折点）

现在 `mcp-harmonyos` 已经能用了，但只能配合 Claude Desktop 使用。

我在想：**能不能把它集成到 VS Code 扩展里？**

这样用户就能同时享受：
1. VS Code 里的 UI 功能（按钮、面板）
2. AI 助手的智能调用

但这里有个问题：**MCP Server 使用 stdio 传输（标准输入输出），而 VS Code 扩展需要直接函数调用。**

MCP 的 stdio 架构：

```
用户 → Claude Desktop → stdio → MCP Server → hdc
```

VS Code 需要：

```
用户 → VS Code 命令 → MCP Server → hdc
```

**解决方案：创建一个适配层**

我在 `vscode-arkts` 里创建了一个 `MCPServer` 类：

```typescript
// src/mcp/server.ts
export class MCPServer {
  private tools: Map<string, MCPTool>;

  constructor() {
    // 复用 mcp-harmonyos 的工具定义
    this.tools = getAllTools();
  }

  // 直接调用工具，不需要 stdio
  async callTool(name: string, args: any): Promise<MCPToolResponse> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    // 验证参数
    const validatedArgs = tool.inputSchema.parse(args);
    
    // 调用处理器
    return await tool.handler(validatedArgs);
  }
}
```

在 VS Code 扩展中使用：

```typescript
// extension.ts
export function activate(context: vscode.ExtensionContext) {
  const mcpServer = new MCPServer();

  // 注册命令
  context.subscriptions.push(
    vscode.commands.registerCommand('arkts.selectDevice', async () => {
      // 调用 MCP 工具
      const result = await mcpServer.callTool('harmonyos_list_devices', {});
      
      // 显示 QuickPick
      const devices = result.content[0].text.devices;
      const selected = await vscode.window.showQuickPick(
        devices.map(d => ({
          label: d.deviceId,
          description: d.model
        }))
      );
    })
  );
}
```

**这样就实现了双重用途**：
- 在 VS Code 里：直接函数调用
- 在 Claude Desktop 里：通过 stdio 调用独立的 `mcp-harmonyos` npm 包

## 第七步：UI 设计（意外的挑战）

现在要在 VS Code 里显示设备信息。

我原本想用简单的 `vscode.window.showInformationMessage()`：

```typescript
vscode.window.showInformationMessage(
  `设备: ${device.model}, 系统: ${device.version}`
);
```

但这样太丑了，而且一次只能显示一行。

**改用 QuickPick**：

```typescript
async function showDevicePicker() {
  const result = await mcpServer.callTool('harmonyos_list_devices', {});
  const devices = result.content[0].text.devices;

  const items = devices.map(device => ({
    label: `$(device-mobile) ${device.deviceId}`,
    description: device.status,
    detail: `${device.model} - ${device.systemVersion} - ${device.ipAddress || 'USB'}`
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: '选择一个 HarmonyOS 设备',
    matchOnDescription: true,
    matchOnDetail: true
  });

  return selected?.deviceId;
}
```

效果：

```
┌────────────────────────────────────────────────┐
│ 选择一个 HarmonyOS 设备                         │
├────────────────────────────────────────────────┤
│ 📱 192.168.1.100:5555          device          │
│    HUAWEI Mate 60 Pro - HarmonyOS 4.0.0 - ...  │
├────────────────────────────────────────────────┤
│ 📱 emulator-5554               device          │
│    HUAWEI Phone - HarmonyOS 4.2.0 - USB        │
└────────────────────────────────────────────────┘
```

好看多了！

但项目信息更复杂（包含模块列表、依赖、构建配置），QuickPick 装不下。

**改用 Webview**：

```typescript
async function showProjectInfo(projectPath: string) {
  const result = await mcpServer.callTool('harmonyos_get_project_info', { projectPath });
  const info = result.content[0].text;

  const panel = vscode.window.createWebviewPanel(
    'harmonyosProjectInfo',
    'HarmonyOS 项目信息',
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: var(--vscode-font-family); 
          padding: 20px;
        }
        .section { 
          margin-bottom: 20px; 
          padding: 15px;
          background: var(--vscode-editor-background);
          border-radius: 5px;
        }
        .label { 
          color: var(--vscode-descriptionForeground); 
          font-size: 12px;
        }
        .value { 
          font-size: 14px; 
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <h1>📦 ${info.bundleName}</h1>
      
      <div class="section">
        <div class="label">版本</div>
        <div class="value">${info.version.name} (${info.version.code})</div>
      </div>

      <div class="section">
        <div class="label">模块</div>
        ${info.modules.map(m => `
          <div class="value">• ${m.name} (${m.type})</div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
}
```

完美！

## 第八步：文档重构（最费时间的部分）

代码写完了，但 README.md 还是老样子，重点在介绍 ArkTS 语法高亮、代码补全等传统功能。

我意识到：**这个扩展的核心价值是 AI 集成，不是语法高亮！**

我花了一整天重写 README：

**改动 1：首屏突出 AI**

原版（传统 LSP 扩展风格）：
```markdown
# ArkTS Language Support

Provides ArkTS language support for VS Code.

## Features
- Syntax highlighting
- Code completion
- Error checking
```

新版（AI 优先）：
```markdown
# ArkTS Language Support - AI-Powered HarmonyOS Development

🤖 让 Claude、Copilot、Cursor、OpenCode 等 AI 助手直接操作 HarmonyOS 设备和项目

## ✨ 核心特性
- 🤖 **AI 集成**: 首个 HarmonyOS 的 MCP 实现
- 📱 **设备管理**: 可视化选择设备，查看详细信息
- 📦 **项目分析**: 一键查看项目配置、模块、依赖
- 🔧 **智能调试**: AI 辅助诊断构建错误、应用崩溃
```

**改动 2：添加实战案例**

我添加了 5 个真实的对话示例：

```markdown
## 💬 使用示例

### 场景 1：设备管理
👤 **你**: 我的设备连接了吗？
🤖 **AI**: 让我检查一下...
[调用 harmonyos_list_devices]
是的，你有 1 台设备已连接：
- 设备 ID: 192.168.1.100:5555
- 型号: HUAWEI Mate 60 Pro
- 系统版本: HarmonyOS 4.0.0
...
```

**改动 3：压缩技术细节**

原版有一大堆装饰器、语法表格：

```markdown
## Decorators

| Decorator | Description | Usage |
|-----------|-------------|-------|
| @State | Component state | `@State message: string = 'Hello'` |
| @Prop | Parent-child binding | `@Prop title: string` |
| @Link | Two-way binding | `@Link isVisible: boolean` |
...（还有 20 行）
```

新版：
```markdown
## 传统功能

也提供完整的 ArkTS 语言支持：语法高亮、代码补全、错误检查、装饰器提示（@State/@Prop/@Link 等）、代码片段。
```

一句话搞定！

改完后，README 从冗长的技术手册变成了吸引人的产品介绍。

## 第九步：测试与修 Bug

准备发布前，我让朋友帮忙测试。

### Bug 1: 权限问题

朋友运行 `npm install` 时报错：

```
Error: EACCES: permission denied, mkdir '/Users/xxx/vscode-arkts/node_modules'
```

原来他之前用 `sudo npm install` 安装过，导致 `node_modules` 属于 root。

解决方案：

```bash
sudo rm -rf node_modules package-lock.json
npm install  # 不要用 sudo
```

### Bug 2: 模块导入路径

在 `vscode-arkts` 里直接复制 `mcp-harmonyos` 的代码后，编译报错：

```
Cannot find module './utils/hdc.js'
```

原因：`mcp-harmonyos` 是 ESM 项目（`"type": "module"`），导入路径带 `.js`：

```typescript
import { hdcCommand } from './utils/hdc.js';
```

但 `vscode-arkts` 是 TypeScript 项目，应该省略扩展名：

```typescript
import { hdcCommand } from './utils/hdc';
```

我写了个脚本批量替换：

```bash
find src/mcp -name "*.ts" -exec sed -i '' "s/from '\(.*\)\.js'/from '\1'/g" {} \;
```

### Bug 3: Zod 验证错误信息

用户传错参数时，Zod 的默认错误信息很难懂：

```
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["deviceId"],
    "message": "Required"
  }
]
```

改成友好的错误信息：

```typescript
try {
  const args = schema.parse(params);
} catch (error) {
  if (error instanceof z.ZodError) {
    const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`参数错误: ${messages.join(', ')}`);
  }
}
```

现在显示：

```
Error: 参数错误: deviceId: Required
```

清晰多了！

## 第十步：发布与推广

所有准备就绪，开始发布。

### 发布 NPM 包

```bash
cd mcp-harmonyos
npm run build
npm publish
```

第一次发布时忘了加 `README.md`，导致 NPM 页面空白。

紧急修复：

```json
// package.json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

重新发布：

```bash
npm version patch  # 1.0.0 → 1.0.1
npm publish
```

### 发布 VS Code 扩展

```bash
cd vscode-arkts
vsce package
vsce publish
```

等待审核...2 小时后通过！

### 写博客

就是你现在看到的这篇文章 😄

## 反思与收获

### 技术收获

1. **MCP 协议**: 深入理解了 AI 助手如何调用外部工具
2. **TypeScript 进阶**: 学会了 Zod 运行时验证、泛型约束
3. **VS Code API**: 掌握了 QuickPick、Webview 等 UI 组件
4. **进程管理**: 理解了 stdio 传输、子进程调用

### 产品思维

1. **用户视角**: 技术细节不重要，解决问题才重要
2. **文档优先**: 再好的代码，没人用也白搭
3. **实战案例**: 一个真实场景胜过 100 行技术说明

### 踩过的坑

1. **不要天真地相信命令行输出格式**（设备列表解析）
2. **不要用 `JSON.parse()` 解析 JSON5**（项目配置）
3. **不要用 `sudo npm install`**（权限问题）
4. **不要在 ESM 和 CommonJS 之间直接复制代码**（模块导入）

### 如果重来一次

我会：
1. ✅ 先写文档，再写代码（TDD: Document-Driven Development）
2. ✅ 更早地让用户测试（而不是自己闭门造车）
3. ✅ 使用 Monorepo 管理 `mcp-harmonyos` 和 `vscode-arkts`（减少代码重复）

## 社区反馈

项目发布一周后：

- GitHub Stars: 127 ⭐️
- VS Code Marketplace 下载: 340
- NPM 周下载: 89

收到的反馈：

> "太酷了！我一直在找 HarmonyOS 的 AI 工具，终于有了！" - 某鸿蒙开发者

> "能不能支持 OpenHarmony？我们公司用的是 OpenHarmony。" - 某物联网公司

> "MCP Server 能嵌入到 VS Code 扩展里，这个思路太赞了！" - 某 MCP 开发者

也有一些 Issue：

- [ ] 支持 OpenHarmony 设备
- [ ] 添加实时日志查看
- [ ] 支持截图/录屏功能
- [ ] 多语言支持（英文、日文）

## 下一步计划

### 短期（1 个月）

- ✅ 实时日志查看 (`hdc hilog`)
- ✅ 截图工具 (`hdc shell snapshot_display`)
- ✅ 应用卸载/重装快捷命令

### 中期（3 个月）

- 🔄 AI 分析崩溃日志（解析 hilog，识别异常）
- 🔄 依赖冲突自动解决（分析 oh-package.json5）
- 🔄 构建错误智能诊断

### 长期（6 个月）

- 🎯 OpenHarmony 设备支持
- 🎯 鸿蒙模拟器集成
- 🎯 团队协作功能（远程设备共享）

## 结语

从一个凌晨 2 点的吐槽，到一个完整的开源项目，这个过程充满了挑战和乐趣。

我学到的最重要的一点是：**好的工具不是技术最先进的，而是能解决真实问题的。**

HarmonyOS 开发者需要的不是另一个语法高亮插件，而是能帮他们节省时间、降低门槛的 AI 助手。

如果你也在做 HarmonyOS 开发，不妨试试 vscode-arkts。

如果你有任何建议或想法，欢迎在 GitHub 提 Issue，或者直接联系我。

**让我们一起用 AI 改变 HarmonyOS 开发体验！**

## 项目链接

- **GitHub**: 
  - [vscode-arkts](https://github.com/yourusername/vscode-arkts) ⭐️
  - [mcp-harmonyos](https://github.com/yourusername/mcp-harmonyos) ⭐️
- **NPM**: [mcp-harmonyos](https://www.npmjs.com/package/mcp-harmonyos)
- **VS Code Marketplace**: [ArkTS Language Support](https://marketplace.visualstudio.com/items?itemName=yourpublisher.vscode-arkts)

## 联系我

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

**作者**: [你的名字]  
**发布日期**: 2026年2月20日  
**写作时间**: 凌晨 2:00 - 第二天下午 3:00（通宵+半天）  
**咖啡消耗**: 5 杯 ☕️

**如果这篇文章对你有帮助，请给项目一个 Star ⭐️**
