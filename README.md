# Obsidian AI Agent

在 Obsidian 中像 Claude Code 一样与 AI 对话——输入需求，AI 自动规划并操作你的笔记文件。

## 功能

- **对话式交互** — 自然语言输入需求，AI 自动完成多步骤任务
- **批量文档生成** — 一句话生成多篇技术文档、连续故事、系列笔记
- **文件操作工具** — AI 可创建、读取、修改、删除、搜索 Vault 中的 Markdown 文件
- **三种工作模式** — Plan（先规划）、Agent（逐项确认）、Auto（自动执行）
- **多模型支持** — DeepSeek V4（Pro / Flash）、OpenAI 兼容服务商
- **模型自动切换** — 简单问题自动用 Flash（快又省），复杂任务自动切 Pro
- **灵魂模板** — 预置 4 套角色（技术文档作者 / 故事创作者 / 知识整理者 / 通用助手），支持 AI 生成自定义灵魂
- **MCP 协议** — 接入 Model Context Protocol 服务器扩展工具能力
- **会话管理** — 多会话持久化、导出 Markdown
- **费用统计** — 实时 Token 用量、缓存命中率、费用估算

## 安装

### 社区插件市场（推荐）

在 Obsidian 设置 → 第三方插件 → 社区插件市场中搜索 "AI Agent" 安装。

### 手动安装

1. 从 [Releases](https://github.com/你的用户名/obsidian-ai-agent/releases) 下载最新版
2. 解压到 Vault 的 `.obsidian/plugins/obsidian-ai-agent/` 目录
3. 在 Obsidian 设置 → 第三方插件中启用

## 配置

### 设置 API Key（推荐方式）

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY = "sk-your-key"

# macOS / Linux
export DEEPSEEK_API_KEY="sk-your-key"
```

然后在插件设置中，API Key 栏填入 `$DEEPSEEK_API_KEY`。

### 或直接在设置中填写

在 Obsidian 设置 → AI Agent → AI 服务商 → API Key 栏直接填入密钥。

## 使用

### 打开对话面板

- 点击左侧功能区 🤖 图标
- 或命令面板执行 `打开 AI Agent 对话面板`

### 基本对话

直接在输入框输入需求，例如：

```
请帮我写 3 篇 React Hook 技术文档（useState、useEffect、useContext），
保存到 技术文档/React/ 目录
```

AI 会自动创建目录、逐篇生成文档，每步操作可见。

### 三种模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Plan** | AI 仅输出执行计划 | 需要先确认方案再动手 |
| **Agent** | 每步操作弹窗确认 | 重要文件修改 |
| **Auto** | 自动执行全部操作 | 信任度高的批量任务 |

模式通过顶栏下拉菜单或 `/plan` `/agent` `/auto` 命令切换。

### 快捷操作

| 操作 | 方式 |
|------|------|
| 命令提示 | 输入 `/` 弹出所有命令 |
| 文件引用 | 输入 `@` 快速插入文件链接 |
| 历史回溯 | `↑` / `↓` 键浏览已发送消息 |
| 清空输入 | `Ctrl+K` |
| 切换灵魂 | 顶栏下拉菜单 |
| 切换模型 | 顶栏下拉菜单或 `/model auto` |

### Soul 生成

在设置面板的灵魂配置区输入角色描述（如 "擅长写诗的浪漫诗人"），点击生成即可由 AI 自动创建专属灵魂模板。

## 开发

```bash
git clone https://github.com/你的用户名/obsidian-ai-agent.git
cd obsidian-ai-agent
npm install
npm run dev        # 开发模式，文件变更自动构建
npm run build      # 生产构建
```

将仓库目录放到 Vault 的 `.obsidian/plugins/obsidian-ai-agent/` 即可加载。

## 许可

MIT License
