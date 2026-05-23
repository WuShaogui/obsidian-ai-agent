# Obsidian AI Agent

在 Obsidian 中与 AI 对话——智能创作文档、管理知识库、自由聊天。输入需求，AI 自动规划并操作你的笔记。

## 功能

### 智能意图识别

每次输入自动判断三类意图：

| 模式 | 说明 | 示例 |
|------|------|------|
| **文档创作** | 4 步流水线自动生成文档：计划 → 草稿 → 润色 → 链接 | "写 3 篇 React Hook 技术文档" |
| **文档管理** | 授予 AI 全部 vault 操作权限，搜索、阅读、整理已有文档 | "查找关于贝叶斯的笔记" |
| **自由对话** | 直接回复，不涉及文档操作 | "什么是马尔可夫链？" |

### 文档创作流水线

```
Plan（计划）→ Draft（草稿）→ Polish（润色）→ Link（交叉链接）
 1/4   Flash      2/4  Pro       3/4  Pro       4/4  Flash
```

- **Plan**：分析需求，生成文章标题、路径、大纲（感知仓库目录结构）
- **Draft**：根据大纲撰写完整 Markdown 初稿，自动处理 LaTeX 公式包裹
- **Polish**：添加思维导图、Mermaid 图表、callout 提示块，mmdc 自动验证修复
- **Link**：内联引用 + 篇尾相关文章 + 上下篇系列导航（`[[wikilink]]` 格式）

关联创作模式可检索本地知识库，让 AI 参考已有文档生成内容。

### 文档管理工具

20+ vault 操作工具，LLM function calling 自动调用：

| 类别 | 工具 |
|------|------|
| 搜索 | 全文搜索、上下文搜索 |
| 阅读 | 读取文件、查看大纲、属性 |
| 链接 | 反向链接、出站链接、孤立文件、死胡同 |
| 标签 | 仓库标签列表、单文件标签 |
| 统计 | 字数统计、文件信息 |
| 写入 | 创建、追加、移动、删除 |

### 实时交互

- **思考面板**：流式展示 AI 推理过程 + 生成内容
- **任务面板**：生成计划展示标题/路径，步骤进度实时更新
- **停止按钮**：随时中止执行
- **流式输出**：逐 token 显示，无需等待完整响应

### 其他特性

- **多种模型**：DeepSeek V4 (Pro/Flash) 及 OpenAI 兼容服务商
- **自动选模**：Plan/Link 用 Flash (快)，Draft/Polish 用 Pro (好)
- **斜杠命令**：`/clear` 清空会话 · `/export` 导出 · `/help` 帮助
- **会话管理**：多会话持久化，导出含思考过程和工具调用详情
- **费用统计**：实时 Token 用量、缓存命中率

## 安装

### 手动安装

1. 从 [Releases](https://github.com/WuShaogui/obsidian-ai-agent/releases) 下载 `main.js`、`styles.css`、`manifest.json`
2. 放入 Vault 的 `.obsidian/plugins/obsidian-ai-agent/` 目录
3. 在 Obsidian 设置 → 第三方插件中启用

### 开发安装

```bash
git clone https://github.com/WuShaogui/obsidian-ai-agent.git
cd obsidian-ai-agent
npm install
npm run build
```

将仓库目录放到 Vault 的 `.obsidian/plugins/obsidian-ai-agent/` 即可加载。

## 配置

### API Key

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY = "sk-your-key"

# macOS / Linux
export DEEPSEEK_API_KEY="sk-your-key"
```

在插件设置 → AI 服务商 → API Key 栏填入 `$DEEPSEEK_API_KEY`（或直接填入密钥）。

### 推荐模型配置

| 服务商 | Base URL | 模型 |
|--------|----------|------|
| DeepSeek | `https://api.deepseek.com` | `deepseek-v4-pro`, `deepseek-v4-flash` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4o-mini` |

默认模型选 `auto`，AI 自动按步骤分配合适的模型。

### Mermaid 验证

安装 `mermaid` 依赖后，润色步骤自动验证并修复 Mermaid 语法：

```bash
npm install --save mermaid@10
```

## 使用

### 打开面板

- 点击左侧功能区 🤖 图标
- 或命令面板执行 `打开 AI Agent 对话面板`

### 文档创作

```
写一篇贝叶斯推理入门指南，保存到 概率与统计/
```

AI 会自动：分析需求 → 生成计划（含标题/路径/大纲）→ 逐篇撰写 → 润色增强 → 添加交叉引用。

### 文档管理

```
列出所有标签为 #贝叶斯 的笔记
总结这篇文档的大纲
哪些文件链接到了 概率论基础？
```

### 模式切换

聊天头部提供 **独立创作** / **关联创作** 切换。关联模式下 AI 检索本地知识库辅助生成。

### 快捷操作

| 操作 | 方式 |
|------|------|
| 命令提示 | 输入 `/` 弹出命令菜单，↑↓ 选择 |
| 历史回溯 | `↑` / `↓` 浏览已发送消息 |
| 清空输入 | `Ctrl+K` |
| 换行 | `Shift+Enter` |
| 停止 | 发送按钮变红后点击中止 |

## 开发

```bash
npm run dev          # watch 模式
npm run build        # 类型检查 + 打包
```

### Mermaid 语法验证

润色阶段基于 `mermaid.parse()` 自动验证图表语法，失败时由 LLM 自动修复（最多 N 次，可在设置面板配置）。

### Prompt 配置

四个步骤的 Prompt 均可在设置面板中自定义编辑，支持变量替换：

```
{{user_input}} {{article_title}} {{article_topic}} {{article_outline}}
{{article_path}} {{draft_content}} {{all_articles}}
{{vault_context}} {{vault_structure}}
```

## 许可

MIT License
