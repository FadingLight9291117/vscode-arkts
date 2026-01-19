发布 VS Code 插件到市场需要以下步骤：

## 1. 创建发布者账号

1. 访问 [Azure DevOps](https://dev.azure.com/) 并登录/注册
2. 访问 [VS Code 发布者管理页面](https://marketplace.visualstudio.com/manage)
3. 创建发布者（Publisher），记住你的 Publisher ID

## 2. 获取 Personal Access Token (PAT)

1. 在 Azure DevOps 中，点击右上角头像 → **Personal access tokens**
2. 点击 **New Token**
3. 设置：
   - **Name**: `vsce` 或任意名称
   - **Organization**: 选择 `All accessible organizations`
   - **Scopes**: 选择 **Custom defined**，然后找到 **Marketplace** → 勾选 **Manage**
4. 点击 **Create**，**复制并保存 Token**（只显示一次）

## 3. 更新 package.json

确保以下字段正确：

```json
{
  "publisher": "你的Publisher ID",
  "repository": {
    "type": "git",
    "url": "https://github.com/FadingLight9291117/vscode-arkts.git"
  },
  "icon": "images/icon.png",  // 需要一个 128x128 的图标
  "license": "MIT"
}
```

## 4. 发布命令

```bash
# 安装 vsce（如果还没安装）
npm install -g @vscode/vsce

# 登录（会要求输入 PAT）
vsce login <你的Publisher ID>

# 打包预览
vsce package

# 发布
vsce publish
```

## 5. 版本更新发布

```bash
# 更新补丁版本 (0.0.1 → 0.0.2)
vsce publish patch

# 更新次版本 (0.0.2 → 0.1.0)
vsce publish minor

# 更新主版本 (0.1.0 → 1.0.0)
vsce publish major
```

---

**发布前检查清单：**
- [ ] `publisher` 字段已设置
- [ ] 有 `icon`（128x128 PNG）
- [ ] 有 `repository` 字段
- [ ] 有 `LICENSE` 文件
- [ ] README 完整
- [ ] 运行 `npm run compile` 无错误

需要我帮你完善 package.json 或创建图标吗？