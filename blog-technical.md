# 为 HarmonyOS 开发打造 AI 辅助工具：vscode-arkts + MCP 技术实现详解

## 前言

在 HarmonyOS 应用开发过程中，开发者需要频繁与工具链交互：使用 `hdc` 管理设备、用 `hvigorw` 构建项目、用 `ohpm` 管理依赖。这些命令行工具虽然功能强大，但学习曲线陡峭，使用繁琐。

随着 AI 编程助手的兴起，我在思考：**能否让 Claude、Copilot、Cursor、OpenCode 等 AI 助手直接帮我们操作 HarmonyOS 工具链？**

答案是肯定的。通过 Anthropic 推出的 **Model Context Protocol (MCP)**，我们可以让 AI 助手获得"操作系统能力"。本文将详细介绍我如何构建了两个开源项目：

- **mcp-harmonyos**: 首个 HarmonyOS 开发的 MCP Server
- **vscode-arkts**: 集成 MCP 的 ArkTS 语言 VS Code 扩展

## 技术背景：什么是 MCP？

### MCP 协议简介

Model Context Protocol (MCP) 是 Anthropic 在 2024 年推出的开放协议，旨在让 AI 助手能够安全、标准化地访问外部工具和数据源。

传统的 AI 助手只能：
- ✅ 理解代码
- ✅ 生成代码
- ❌ 执行系统命令
- ❌ 读取项目配置
- ❌ 操作开发工具

而通过 MCP，AI 助手可以：
- ✅ 调用工具（Tools）：执行特定操作
- ✅ 访问资源（Resources）：读取文件、数据库等
- ✅ 发送提示（Prompts）：结构化交互

### MCP 架构

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   AI Assistant  │ ◄─MCP──►│   MCP Server    │ ◄─────► │  Tool/Resource  │
│ (Claude/Copilot/ │         │ (mcp-harmonyos) │         │ (hdc/hvigorw)   │
│  Cursor/OpenCode)│         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 项目架构设计

### 整体架构

我设计了一个"双层架构"，既支持独立使用，也支持 VS Code 集成：

```
┌──────────────────────────────────────────────────────────────┐
│                      vscode-arkts Extension                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          Embedded MCP Server (In-Memory)               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ Device Tools │  │Project Tools │  │  App Tools   │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └─────────────┬──────────────────────────────────────────┘  │
│                │                                              │
│       ┌────────┴────────┐                                    │
│       ▼                 ▼                                    │
│  ┌─────────┐      ┌──────────┐                              │
│  │ VS Code │      │ External │                              │
│  │Commands │      │AI Access │                              │
│  └─────────┘      └──────────┘                              │
└──────────────────────────────────────────────────────────────┘

External Usage:
┌─────────────┐  stdio  ┌──────────────────┐
│Claude Desktop│ ◄─────► │mcp-harmonyos (npm)│
└─────────────┘         └──────────────────┘
```

### 核心组件

#### 1. MCP Server (`mcp-harmonyos`)

**技术选型**：
- 语言：TypeScript
- MCP SDK：`@modelcontextprotocol/sdk@^1.0.4`
- 验证：`zod@^3.24.1`（运行时类型检查）
- 传输：stdio（标准输入输出）

**目录结构**：
```
mcp-harmonyos/
├── src/
│   ├── index.ts           # MCP Server 入口（stdio transport）
│   ├── tools/
│   │   ├── index.ts       # 工具注册中心
│   │   ├── devices.ts     # 设备管理工具（2个）
│   │   ├── projects.ts    # 项目分析工具（2个）
│   │   ├── apps.ts        # 应用管理工具（2个）
│   │   └── build.ts       # 构建验证工具（1个）
│   ├── types/
│   │   ├── tool.ts        # MCP Tool 接口定义
│   │   └── harmonyos-types.ts  # HarmonyOS 领域类型
│   └── utils/
│       ├── hdc.ts         # HDC 命令行包装器
│       ├── json5.ts       # JSON5 解析器（oh-package.json5）
│       └── response.ts    # MCP 响应格式化
```

**工具清单**（共7个）：

| 工具名称 | 功能 | 参数 |
|---------|------|------|
| `harmonyos_list_devices` | 列出所有已连接设备 | 无 |
| `harmonyos_get_device_info` | 获取设备详细信息 | `deviceId` |
| `harmonyos_get_project_info` | 获取项目配置信息 | `projectPath` |
| `harmonyos_list_modules` | 列出项目所有模块 | `projectPath` |
| `harmonyos_check_build_outputs` | 检查构建产物 | `projectPath` |
| `harmonyos_list_installed_apps` | 列出已安装应用 | `deviceId` |
| `harmonyos_get_app_info` | 获取应用详细信息 | `deviceId`, `bundleName` |

#### 2. VS Code Extension (`vscode-arkts`)

**集成策略**：
- 将 `mcp-harmonyos` 源码复制到 `src/mcp/`
- 移除 stdio transport，改用内存调用
- 创建 `MCPServer` 类，提供 `callTool()` 方法

**关键代码**（`src/mcp/server.ts`）：
```typescript
export class MCPServer {
  private tools: Map<string, MCPTool>;

  constructor() {
    this.tools = getAllTools();
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<MCPToolResponse> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    // Zod 验证参数
    const validatedArgs = tool.inputSchema.parse(args);
    
    // 执行工具
    return await tool.handler(validatedArgs);
  }

  listTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }
}
```

**UI 组件设计**：

1. **Device Picker** (`src/mcp/ui/devicePicker.ts`)
   - 使用 `vscode.QuickPick` API
   - 实时显示设备状态（在线/离线）
   - 展示设备型号、系统版本、IP 地址

```typescript
export async function showDevicePicker(): Promise<string | undefined> {
  const server = new MCPServer();
  const result = await server.callTool('harmonyos_list_devices', {});
  
  const items = result.content[0].text.devices.map(device => ({
    label: `$(device-mobile) ${device.deviceId}`,
    description: device.status,
    detail: `${device.productModel} - ${device.systemVersion}`,
    deviceId: device.deviceId
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a HarmonyOS device'
  });

  return selected?.deviceId;
}
```

2. **Project Info Webview** (`src/mcp/ui/projectInfo.ts`)
   - 使用 `vscode.WebviewPanel`
   - HTML + CSS 渲染项目信息
   - 展示 bundleName、版本号、模块列表

## 技术难点与解决方案

### 1. 模块系统兼容性

**问题**：
- `mcp-harmonyos` 使用 ESM (`"type": "module"`)，导入路径带 `.js` 扩展名
- `vscode-arkts` 使用 CommonJS/混合模式
- 直接复制代码会导致 TypeScript 编译错误

**解决方案**：
```typescript
// mcp-harmonyos (ESM)
import { hdcCommand } from './utils/hdc.js';  // ❌ VS Code 不兼容

// vscode-arkts (TypeScript)
import { hdcCommand } from './utils/hdc';     // ✅ TypeScript 自动解析
```

批量移除 `.js` 扩展名：
```bash
find src/mcp -name "*.ts" -exec sed -i '' "s/from '\(.*\)\.js'/from '\1'/g" {} \;
```

### 2. stdio vs 内存调用

**问题**：
- MCP SDK 默认使用 stdio transport（命令行交互）
- VS Code 扩展需要同步/异步函数调用

**解决方案**：
创建适配层，绕过 stdio，直接调用工具处理器：

```typescript
// 原始 MCP Server (stdio)
const server = new Server({
  name: "mcp-harmonyos",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // stdio 交互
});

// VS Code 适配 (in-memory)
export class MCPServer {
  async callTool(name: string, args: any) {
    const tool = this.tools.get(name);
    return await tool.handler(args);  // 直接调用
  }
}
```

### 3. JSON5 解析

**问题**：
HarmonyOS 项目配置文件 `oh-package.json5` 不是标准 JSON：
- 支持注释 `// 单行注释`, `/* 多行 */`
- 支持尾随逗号 `{ "a": 1, }`
- 支持单引号字符串 `'value'`

**解决方案**：
使用 `json5` 库解析：

```typescript
import JSON5 from 'json5';

function parseOhPackage(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON5.parse(content);
}
```

### 4. 错误处理与类型安全

**问题**：
- 命令行工具可能失败（设备未连接、项目路径错误）
- MCP 要求统一的错误格式

**解决方案**：
使用 Zod + 统一错误处理：

```typescript
// 1. Zod Schema 定义
const GetDeviceInfoSchema = z.object({
  deviceId: z.string().describe("Device UDID")
});

// 2. 运行时验证
async function getDeviceInfo(args: unknown) {
  const { deviceId } = GetDeviceInfoSchema.parse(args);  // 自动抛出验证错误
  
  try {
    const result = await hdcCommand(['shell', 'param', 'get']);
    return successResponse(result);
  } catch (error) {
    return errorResponse(`Failed to get device info: ${error.message}`);
  }
}

// 3. 统一响应格式
function successResponse(data: any): MCPToolResponse {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
  };
}

function errorResponse(message: string): MCPToolResponse {
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true
  };
}
```

## 实际使用场景

### 场景 1：设备管理

**传统方式**：
```bash
$ hdc list targets
192.168.1.100:5555

$ hdc -t 192.168.1.100:5555 shell param get const.product.model
HUAWEI Mate 60 Pro
```

**AI 辅助方式**：
```
👤 用户: 我的设备连接了吗？

🤖 AI: 让我检查一下...
[调用 harmonyos_list_devices]
是的，你有 1 台设备已连接：
- 设备 ID: 192.168.1.100:5555
- 型号: HUAWEI Mate 60 Pro
- 系统版本: HarmonyOS 4.0.0
- 状态: device (在线)
```

### 场景 2：项目信息查询

**传统方式**：
```bash
$ cat AppScope/app.json5 | grep bundleName
"bundleName": "com.example.myapp"

$ cat oh-package.json5 | grep version
"version": "1.0.0"
```

**AI 辅助方式**：
```
👤 用户: 我的项目版本号是多少？

🤖 AI: 让我查看项目配置...
[调用 harmonyos_get_project_info]
你的项目信息：
- Bundle Name: com.example.myapp
- 版本: 1.0.0
- 版本号: 1000000
- API 版本: 11
```

### 场景 3：构建验证

**传统方式**：
```bash
$ ls build/default/outputs/default/
entry-default-signed.hap

$ du -h build/default/outputs/default/entry-default-signed.hap
2.3M
```

**AI 辅助方式**：
```
👤 用户: 我的应用构建成功了吗？

🤖 AI: 让我检查构建产物...
[调用 harmonyos_check_build_outputs]
✅ 构建成功！找到以下产物：
- entry-default-signed.hap (2.3 MB)
- 位置: /path/to/project/build/default/outputs/default/
```

## 性能优化

### 1. 命令缓存

多次调用 `hdc` 命令开销大，实现简单缓存：

```typescript
const deviceCache = new Map<string, { data: any, expiry: number }>();

async function listDevices(useCache = true) {
  if (useCache) {
    const cached = deviceCache.get('devices');
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
  }

  const result = await hdcCommand(['list', 'targets', '-v']);
  deviceCache.set('devices', {
    data: result,
    expiry: Date.now() + 5000  // 5秒缓存
  });
  
  return result;
}
```

### 2. 并行执行

获取多个设备信息时，使用 `Promise.all`：

```typescript
const devices = ['device1', 'device2', 'device3'];
const infos = await Promise.all(
  devices.map(id => getDeviceInfo({ deviceId: id }))
);
```

### 3. 延迟初始化

VS Code 扩展启动时不立即扫描设备，仅在用户调用命令时执行：

```typescript
export function activate(context: vscode.ExtensionContext) {
  // ✅ 快速启动，不阻塞
  const server = new MCPServer();

  context.subscriptions.push(
    vscode.commands.registerCommand('arkts.selectDevice', async () => {
      // 仅在用户调用时执行
      await showDevicePicker();
    })
  );
}
```

## 部署与发布

### 1. NPM 包发布 (`mcp-harmonyos`)

```bash
# 构建
npm run build

# 发布到 NPM
npm publish

# 用户安装
npm install -g mcp-harmonyos
```

**Claude Desktop 配置**：
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

### 2. VS Code 扩展发布

```bash
# 打包
vsce package

# 发布到 Marketplace
vsce publish
```

## 未来规划

1. **更多工具**：
   - 日志实时查看 (`hdc hilog`)
   - 截图/录屏 (`hdc shell snapshot_display`)
   - 性能分析集成

2. **智能分析**：
   - AI 分析崩溃日志
   - 依赖冲突自动解决
   - 构建错误智能诊断

3. **多平台支持**：
   - OpenHarmony 设备支持
   - 鸿蒙模拟器集成

## 总结

通过 MCP 协议，我们成功地将 HarmonyOS 开发工具链与 AI 助手连接起来。这个项目的关键价值在于：

1. **降低学习门槛**：新手无需记忆复杂命令
2. **提升开发效率**：自然语言替代命令行
3. **标准化接口**：MCP 协议保证与多种 AI 助手（Claude、Copilot、Cursor、OpenCode）兼容
4. **双重用途**：既是 VS Code 扩展，也是独立 MCP Server

技术亮点：
- ✅ 首个 HarmonyOS 的 MCP 实现
- ✅ 嵌入式 MCP Server 架构创新
- ✅ 完整的类型安全（TypeScript + Zod）
- ✅ 开源可扩展

## 项目链接

- **GitHub**: 
  - [vscode-arkts](https://github.com/yourusername/vscode-arkts)
  - [mcp-harmonyos](https://github.com/yourusername/mcp-harmonyos)
- **NPM**: [mcp-harmonyos](https://www.npmjs.com/package/mcp-harmonyos)
- **VS Code Marketplace**: [ArkTS Language Support](https://marketplace.visualstudio.com/items?itemName=yourpublisher.vscode-arkts)

欢迎 Star、Fork 和贡献代码！

---

**作者**: [你的名字]  
**联系方式**: [你的邮箱/Twitter]  
**发布日期**: 2026年2月
