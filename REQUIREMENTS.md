# Obsidian AI Agent 插件需求说明书

## 一、项目概述

### 1.1 项目名称
**Obsidian AI Agent**（暂定名，插件ID：`obsidian-ai-agent`）

### 1.2 项目定位
一款嵌入 Obsidian 的 AI 对话智能体插件。采用类似 Claude Code / DeepSeek-TUI 的 Agent 交互模式，用户在对话面板中下达自然语言需求，AI 智能体自动规划并通过 Obsidian CLI 工具批量完成 Markdown 文档的创建、编辑、删除等操作。

### 1.3 核心价值
- **批量文档生成**：一句话生成多篇技术文档、连续故事章节、系列笔记等
- **Vault 原生操作**：AI 直接读写 Obsidian Vault 中的 Markdown 文件，无缝融入笔记工作流
- **多模型支持**：可接入 OpenAI、DeepSeek 等多种 AI 服务商，自由切换
- **可定制灵魂**：通过系统提示词（Soul）定义 AI 的角色、风格和行为规范

### 1.4 参考项目
| 项目 | 参考点 |
|------|--------|
| Claude Code (Anthropic) | Agent 循环逻辑、工具调用机制、交互体验 |
| DeepSeek-TUI (GitHub) | 开源 Agent 架构、工具注册表、会话管理 |
| QuickAdd (Obsidian 插件) | 设置面板设计、AI 提供商配置模式 |

---

## 二、功能需求

### 2.1 AI 对话面板（Chat View）

**2.1.1 面板形态**
- 以 Obsidian 右侧/底部侧边栏面板形式存在，可自由拖拽、调整大小
- 也可通过命令面板以独立 Modal 弹窗形式打开
- 面板关闭后会话保持，再次打开自动恢复

**2.1.2 对话交互**
- 用户输入框位于底部，支持单行/多行输入（Enter 发送，Shift+Enter 换行）
- 对话历史以聊天气泡形式展示，区分用户消息和 AI 回复
- 支持 Markdown 渲染（代码高亮、表格、列表等）
- 消息区内显示：
  - 模型思考过程（Thinking 折叠块，类似 Claude Code 的思维链）
  - 工具调用过程（工具名、参数、返回值，折叠显示）
  - 最终回复内容

**2.1.3 三种工作模式**（参考 DeepSeek-TUI）
| 模式 | 说明 |
|------|------|
| **Plan（规划模式）** | AI 仅分析需求、输出执行计划，不调用任何工具。用户确认计划后再进入 Agent 模式执行 |
| **Agent（代理模式）** | AI 规划并调用工具，每次工具调用前需用户审批确认 |
| **Auto（自动模式）** | AI 自主规划并执行所有工具调用，无需逐次确认。适合信任度高的批量任务 |

**2.1.4 会话管理**
- 支持创建多个独立会话，每个会话有独立的标题和历史
- 会话列表（左侧或下拉菜单），可切换、重命名、删除会话
- 会话自动持久化到 Vault 的 `.obsidian/ai-agent-sessions/` 目录（JSON 格式）
- 支持导出会话为 Markdown 笔记

**2.1.5 消息操作**
- 单条消息可复制、重新生成（仅最后一条 AI 回复）
- 可编辑已发送的用户消息并重新提交（编辑后该消息之后的对话分支自动丢弃）
- 支持在任意位置插入新的用户消息（分支对话）

### 2.2 设置面板（Settings Tab）

**2.2.1 AI 服务商配置**
- 支持多个服务商（Provider），每个服务商独立配置：
  - **名称**：自定义显示名（如 "DeepSeek"、"OpenAI"）
  - **API 地址**：Base URL（兼容 OpenAI 接口规范）
  - **API Key**：密钥，存储时进行基础混淆（Obsidian 本身不提供加密，将使用 `window.localStorage` 加密存储或提示用户自行承担安全风险）
  - **启用状态**：可临时禁用某个服务商
- 至少预置两个服务商模板：
  - DeepSeek（默认 Base URL: `https://api.deepseek.com`）
  - OpenAI（默认 Base URL: `https://api.openai.com/v1`）
- 支持添加自定义服务商（任何兼容 OpenAI API 格式的服务）

**2.2.2 模型参数配置**
- **默认模型**：下拉选择（如 `deepseek-chat`、`deepseek-reasoner`、`gpt-4o`、`gpt-4o-mini` 等）
- **Temperature**：滑块，0~2，默认 0.7
- **Top P**：滑块，0~1，默认 1
- **最大 Token 数**：数字输入，默认 4096
- **上下文窗口大小**：保留最近 N 轮对话，默认 50 轮
- **流式输出**：开关，默认开启

**2.2.3 灵魂配置（Soul）**
- **系统提示词**：多行文本区域，定义 AI 的基础行为、角色、写作风格
- 预置多套灵魂模板，用户可切换和编辑：
  | 模板名称 | 适用场景 |
  |----------|----------|
  | 技术文档作者 | 生成 API 文档、架构设计文档、技术方案 |
  | 故事创作者 | 创作连续故事、小说章节、叙事内容 |
  | 知识整理者 | 归纳总结、概念解释、学习笔记 |
  | 通用助手 | 通用对话，按需执行文件操作 |
  | 自定义 | 用户完全自定义 |
- 灵魂模板可导入/导出（JSON 格式）

**2.2.4 工具权限配置**
- 每个工具可单独设置权限级别：
  | 级别 | 说明 |
  |------|------|
  | **允许** | 始终允许调用 |
  | **询问** | 每次调用前弹窗确认 |
  | **禁止** | 不允许调用 |
- 可按工作模式设置不同的默认权限级别

**2.2.5 界面设置**
- 面板默认位置：右侧边栏 / 底部面板 / 独立窗口
- 字体大小：小 / 中 / 大
- 是否显示思考过程：开 / 关
- 是否显示工具调用详情：开 / 关
- 是否显示 Token 用量和费用：开 / 关

### 2.3 Agent 引擎（Agent Engine）

**2.3.1 Agent 循环**
```
用户输入需求
    ↓
[1] 构建消息上下文（系统提示词 + 对话历史 + 用户输入）
    ↓
[2] 调用 AI 模型 API（流式）
    ↓
[3] 解析 AI 响应：
    ├── 文本回复 → 追加到对话历史，展示给用户
    ├── 工具调用请求 → 进入步骤 [4]
    └── 任务完成 → 展示总结，等待下一次用户输入
    ↓
[4] 执行工具调用：
    ├── 根据工作模式决定是否需要用户确认
    ├── 执行工具，获取结果
    └── 将工具结果追加到消息上下文，回到步骤 [2]
```

**2.3.2 工具调用协议**
- 使用标准的 Function Calling / Tool Use 协议（兼容 OpenAI 格式）
- 工具定义通过 JSON Schema 描述参数
- 工具调用请求解析支持：
  - 原生 Function Calling（`tool_calls` 字段）
  - 文本解析回退（当模型不支持原生 Function Calling 时，从文本中解析工具调用意图）

**2.3.3 流式响应处理**
- 使用 SSE（Server-Sent Events）接收流式响应
- 实时渲染 AI 思考过程和回复内容
- 支持中途停止生成（Abort）

**2.3.4 错误处理与重试**
- API 调用失败自动重试（可配置重试次数，默认 3 次）
- 网络超时处理（可配置超时时间，默认 120 秒）
- 错误信息友好展示，区分网络错误、认证错误、速率限制等

**2.3.5 上下文压缩**
- 当对话历史超过上下文窗口限制时，自动压缩早期消息
- 压缩策略：对早期对话生成摘要，替换原始消息
- 压缩阈值可配置（Token 数）

### 2.4 Obsidian 工具集（Vault Tools）

以下工具以 Obsidian Vault API 为底层实现，每个工具都有独立的 JSON Schema 定义，供 AI 模型进行 Function Calling。

**2.4.1 文件创建**
- **工具名**：`create_note`
- **参数**：
  - `path` (string, required)：文件路径，相对于 Vault 根目录，如 `技术文档/React Hooks 详解.md`
  - `content` (string, required)：Markdown 格式的文件内容
  - `overwrite` (boolean, optional, default: false)：是否覆盖已存在的文件
- **返回**：创建结果（成功/失败，文件路径）

**2.4.2 文件读取**
- **工具名**：`read_note`
- **参数**：
  - `path` (string, required)：文件路径
  - `offset` (number, optional)：起始行号
  - `limit` (number, optional)：读取行数
- **返回**：文件内容（含行号）

**2.4.3 文件修改**
- **工具名**：`update_note`
- **参数**：
  - `path` (string, required)：文件路径
  - `old_content` (string, required)：要替换的原始内容片段
  - `new_content` (string, required)：替换后的新内容
  - `replace_all` (boolean, optional, default: false)：是否替换所有匹配项
- **返回**：修改结果

**2.4.4 文件删除**
- **工具名**：`delete_note`
- **参数**：
  - `path` (string, required)：文件路径
  - `permanent` (boolean, optional, default: false)：是否永久删除（false 则移到系统回收站）
- **返回**：删除结果

**2.4.5 Vault 搜索**
- **工具名**：`search_vault`
- **参数**：
  - `query` (string, required)：搜索关键词（支持正则表达式）
  - `path_prefix` (string, optional)：限定搜索路径范围
  - `file_types` (string[], optional, default: ["md"])：限定文件类型
  - `max_results` (number, optional, default: 20)：最大返回结果数
- **返回**：匹配结果列表（文件路径、匹配行、行号）

**2.4.6 文件列表**
- **工具名**：`list_notes`
- **参数**：
  - `path` (string, optional, default: "")：目录路径，空字符串表示 Vault 根目录
  - `recursive` (boolean, optional, default: false)：是否递归列出子目录
  - `pattern` (string, optional)：文件名匹配模式（glob 风格）
- **返回**：文件和目录列表

**2.4.7 文件元数据**
- **工具名**：`get_note_info`
- **参数**：
  - `path` (string, required)：文件路径
- **返回**：文件大小、创建时间、修改时间、字数、行数、Frontmatter 属性等

**2.4.8 目录创建**
- **工具名**：`create_folder`
- **参数**：
  - `path` (string, required)：目录路径
- **返回**：创建结果

**2.4.9 文件移动/重命名**
- **工具名**：`move_note`
- **参数**：
  - `from` (string, required)：源文件路径
  - `to` (string, required)：目标文件路径
- **返回**：移动结果

**2.4.10 追加内容**
- **工具名**：`append_to_note`
- **参数**：
  - `path` (string, required)：文件路径
  - `content` (string, required)：要追加的内容
  - `position` (string, optional, enum: ["end", "start", "cursor"])：追加位置
- **返回**：追加结果

### 2.5 批量文档生成能力（核心用例）

基于以上 Agent 引擎和工具集，实现以下典型场景：

**场景 1：批量技术文档生成**
```
用户输入：请生成 React 18 核心 Hook 的使用文档，每个 Hook 一篇，
         包括 useState、useEffect、useContext、useReducer、
         useCallback、useMemo、useRef，共 7 篇。
         保存到 技术文档/React/ 目录下。

AI 执行：
  1. 规划 → 列出 7 篇文档的标题和结构框架
  2. 逐一创建 → create_note 每篇文档
  3. 完成后总结 → 列出创建的文件清单
```

**场景 2：连续故事创作**
```
用户输入：创作一个短篇悬疑小说，分 5 章。
         保存到 创作/悬疑小说/ 目录下，
         每章一个文件，文件名为 第X章-章节标题.md。

AI 执行：
  1. 规划 → 设计故事大纲、人物设定
  2. 逐一创作 → 按章节顺序创建
  3. 保持连续性和一致性（通过之前已创建的内容作为上下文）
```

**场景 3：笔记批量整理**
```
用户输入：搜索 Vault 中所有包含 "TODO" 的笔记，
         将 TODO 项目汇总到 工作/TODO汇总.md 中。

AI 执行：
  1. search_vault → 找到所有含 TODO 的文件
  2. read_note → 读取每个文件中的 TODO 行
  3. create_note → 生成汇总文件
```

---

## 三、技术架构

### 3.1 整体架构

```
┌──────────────────────────────────────────────┐
│              Obsidian 宿主环境                │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │         AIAgentPlugin (main.ts)          │ │
│  │  - onload() / onunload()                │ │
│  │  - 注册视图、命令、设置 Tab 页            │ │
│  └──────────────┬──────────────────────────┘ │
│                 │                              │
│     ┌───────────┼───────────┐                 │
│     │           │           │                 │
│     ▼           ▼           ▼                 │
│ ┌───────┐ ┌─────────┐ ┌──────────┐          │
│ │ Chat  │ │Settings │ │ Agent    │          │
│ │ View  │ │ Tab     │ │ Engine   │          │
│ └───┬───┘ └─────────┘ └────┬─────┘          │
│     │                      │                 │
│     │    ┌─────────────────┼──────┐          │
│     │    │                 │      │          │
│     ▼    ▼                 ▼      ▼          │
│ ┌──────┐ ┌──────────┐ ┌──────┐ ┌─────────┐ │
│ │Session│ │API Client│ │Tool  │ │Context  │ │
│ │Manager│ │(OpenAI   │ │Regis-│ │Manager  │ │
│ │       │ │ Compat)  │ │try   │ │         │ │
│ └───────┘ └──────────┘ └──┬───┘ └─────────┘ │
│                           │                  │
│                           ▼                  │
│                    ┌──────────────┐          │
│                    │ Vault Tools  │          │
│                    │ (10 tools)   │          │
│                    └──────────────┘          │
└──────────────────────────────────────────────┘
```

### 3.2 模块职责

| 模块 | 文件 | 职责 |
|------|------|------|
| **Plugin 入口** | `src/main.ts` | 插件生命周期管理，注册视图/命令/设置 Tab 页 |
| **Chat View** | `src/view/chat-view.ts` | AI 对话面板 UI，消息渲染，输入处理 |
| **Settings Tab** | `src/settings/settings-tab.ts` | 设置面板 UI |
| **Settings Store** | `src/settings/settings-store.ts` | 设置数据结构、默认值、加载/持久化 |
| **Agent Engine** | `src/agent/engine.ts` | Agent 主循环：消息构建→API调用→工具执行→循环 |
| **API Client** | `src/agent/api-client.ts` | OpenAI 兼容 API 调用（含流式），多服务商适配 |
| **Tool Registry** | `src/tools/registry.ts` | 工具注册、定义、权限检查 |
| **Vault Tools** | `src/tools/vault-tools.ts` | Vault 文件操作工具实现 |
| **Context Manager** | `src/agent/context-manager.ts` | 对话上下文管理、压缩策略 |
| **Session Manager** | `src/session/session-manager.ts` | 会话创建、持久化、恢复、导出 |
| **Types** | `src/types/index.ts` | TypeScript 类型定义 |

### 3.3 数据流

```
用户输入文本
    │
    ▼
Chat View ──► Agent Engine ──► Context Manager (构建消息上下文)
                                    │
                                    ▼
                              API Client (调用 AI API)
                                    │
                                    ▼
                              解析响应
                               ╱       ╲
                            文本回复   工具调用请求
                              │           │
                              │     Tool Registry
                              │     (权限检查 + 执行)
                              │           │
                              │     Vault Tools
                              │     (操作文件)
                              │           │
                              ▼           ▼
                         Chat View (展示结果)
                              │
                              ▼
                     Session Manager (持久化)
```

### 3.4 技术选型

| 技术项 | 选择 | 原因 |
|--------|------|------|
| 打包工具 | esbuild | Obsidian 官方推荐，轻量快速 |
| UI 框架 | 原生 DOM + Obsidian API | 避免引入 React/Vue 等重型框架 |
| Markdown 渲染 | Obsidian MarkdownRenderer | 与 Obsidian 渲染效果一致 |
| HTTP 客户端 | 原生 fetch API | 零依赖，Obsidian 环境内置 |
| 流式解析 | 手动 SSE 解析 | 处理 `data:` 行分块 |
| 存储 | `this.loadData()/saveData()` | Obsidian 插件标准持久化机制 |

### 3.5 文件结构

```
obsidian-ai-agent/
├── manifest.json               # 插件元数据
├── package.json                # 依赖与构建脚本
├── tsconfig.json               # TS 配置
├── esbuild.config.mjs          # 打包配置
├── styles.css                  # UI 样式
├── versions.json               # 版本兼容映射
├── souls/                      # 内置灵魂模板
│   ├── tech-writer.json
│   ├── story-creator.json
│   ├── knowledge-organizer.json
│   └── general-assistant.json
└── src/
    ├── main.ts                 # 插件入口
    ├── types/
    │   └── index.ts            # 公共类型定义
    ├── settings/
    │   ├── settings-store.ts   # 设置数据与默认值
    │   └── settings-tab.ts     # 设置 Tab 页 UI
    ├── view/
    │   └── chat-view.ts        # 对话面板视图
    ├── agent/
    │   ├── engine.ts           # Agent 主循环
    │   ├── api-client.ts       # API 调用客户端
    │   └── context-manager.ts  # 上下文管理
    ├── tools/
    │   ├── registry.ts         # 工具注册表
    │   ├── types.ts            # 工具接口定义
    │   └── vault-tools.ts      # Vault 操作工具集
    └── session/
        └── session-manager.ts  # 会话管理
```

---

## 四、交互原型

### 4.1 对话面板布局

```
┌─────────────────────────────────────┐
│ 🤖 AI Agent          [会话选择 ▾]  │  ← 顶部工具栏
│ 模式: [Auto ▾]   💰 ¥0.12          │  ← 模式切换 + 费用
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐    │
│ │ 👤 用户                      │    │
│ │ 请帮我生成 React 18 核心      │    │
│ │ Hook 的使用文档，每个一篇     │    │
│ └─────────────────────────────┘    │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ 🤖 AI Agent                  │    │
│ │                              │    │
│ │ 📋 计划：                     │    │  ← AI 回复
│ │ 1. 创建目录 技术文档/React   │    │
│ │ 2. 创建 useState.md         │    │
│ │ 3. 创建 useEffect.md        │    │
│ │ ...                          │    │
│ │                              │    │
│ │ ▶ 思考过程 [展开]             │    │  ← Thinking 折叠
│ │                              │    │
│ │ 🔧 工具调用: create_folder   │    │  ← 工具调用记录
│ │    参数: {path: "技术文档/"}| │    │
│ │    结果: ✓ 创建成功          │    │
│ │                              │    │
│ │ 🔧 工具调用: create_note     │    │
│ │    ...                       │    │
│ └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│ 📎 附件  🔧 工具  ⚙️               │  ← 底部工具栏（可选）
│ ┌─────────────────────────────────┐│
│ │ 输入你的需求...              📤 ││  ← 输入框
│ └─────────────────────────────────┘│
│ Enter 发送 · Shift+Enter 换行 ·   │
│ 230 / 200K tokens                 │  ← 状态栏
└─────────────────────────────────────┘
```

### 4.2 模式切换快捷键

- `/plan` — 切换到规划模式
- `/agent` — 切换到代理模式
- `/auto` — 切换到自动模式
- `/model <name>` — 切换模型
- `/clear` — 清空当前会话
- `/export` — 导出当前会话

### 4.3 工具确认弹窗（Agent 模式下）

```
┌─────────────────────────────────────┐
│ ⚠️ 工具调用确认                      │
├─────────────────────────────────────┤
│                                     │
│ 工具: create_note                   │
│ 文件: 技术文档/React/useState.md    │
│                                     │
│ 内容预览:                           │
│ ┌─────────────────────────────────┐│
│ │ # useState Hook 详解            ││
│ │                                 ││
│ │ ## 基本用法                     ││
│ │ useState 是 React 中最基础的... ││
│ │ ...                             ││
│ └─────────────────────────────────┘│
│                                     │
│ [✓ 批准]  [✗ 拒绝]  [批准全部]     │
└─────────────────────────────────────┘
```

---

## 五、配置项详细设计

### 5.1 设置数据结构

```typescript
interface AIAgentSettings {
    // === AI 服务商配置 ===
    providers: AIProvider[];

    // === 默认服务商和模型 ===
    defaultProvider: string;    // 当前使用的服务商 ID
    defaultModel: string;       // 当前使用的模型 ID

    // === 模型参数 ===
    temperature: number;        // 0-2, 默认 0.7
    topP: number;              // 0-1, 默认 1
    maxTokens: number;         // 默认 4096
    contextWindowSize: number; // 对话轮数，默认 50

    // === 功能开关 ===
    streamEnabled: boolean;    // 流式输出，默认 true
    showThinking: boolean;     // 显示思考过程，默认 true
    showToolCalls: boolean;    // 显示工具调用详情，默认 true
    showCostInfo: boolean;     // 显示费用信息，默认 true

    // === 界面设置 ===
    panelPosition: 'right' | 'bottom' | 'floating';
    fontSize: 'small' | 'medium' | 'large';
    maxPreviewLines: number;   // 文件内容预览最大行数，默认 20

    // === Agent 设置 ===
    defaultMode: 'plan' | 'agent' | 'auto';
    maxRetries: number;        // API 重试次数，默认 3
    requestTimeout: number;    // 请求超时(秒)，默认 120
    compressThreshold: number; // 上下文压缩 Token 阈值，默认 50000

    // === 灵魂配置 ===
    souls: SoulTemplate[];
    activeSoul: string;        // 当前使用的灵魂 ID

    // === 工具权限 ===
    toolPermissions: Record<string, ToolPermission>;
    // ToolPermission: 'allow' | 'ask' | 'deny'
}

interface AIProvider {
    id: string;                // 唯一标识
    name: string;              // 显示名称
    baseUrl: string;           // API 地址
    apiKey: string;            // API 密钥
    models: string[];          // 可用模型列表
    enabled: boolean;          // 是否启用
}

interface SoulTemplate {
    id: string;
    name: string;
    description: string;
    content: string;           // 系统提示词正文
    isBuiltin: boolean;       // 是否内置模板（内置不可删除）
}

type ToolPermission = 'allow' | 'ask' | 'deny';

interface Session {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    mode: 'plan' | 'agent' | 'auto';
    messages: Message[];
}

interface Message {
    id: string;
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    toolCalls?: ToolCall[];
    toolResults?: ToolResult[];
    thinking?: string;
    timestamp: number;
    tokenCount?: number;
}
```

---

## 六、开发阶段划分

### 第一阶段：基础框架（MVP）
1. 项目脚手架搭建（esbuild + TypeScript）
2. 设置面板：服务商配置、API Key、模型选择
3. 基本对话面板：单轮对话、流式输出
4. API Client：OpenAI 兼容格式调用

### 第二阶段：Agent 核心
5. Agent 引擎主循环
6. 工具注册表 + Vault Tools 实现（全部 10 个工具）
7. 工具调用协议（Function Calling + 文本回退解析）
8. 三种工作模式（Plan/Agent/Auto）
9. 工具确认弹窗

### 第三阶段：会话与灵魂
10. 会话持久化与管理
11. 灵魂模板系统（预置 + 自定义）
12. 上下文压缩

### 第四阶段：完善与优化
13. Token 用量与费用统计
14. 错误处理与重试完善
15. 会话导出为 Markdown
16. 消息编辑与分支对话

---

## 七、待确认事项

请确认以下设计决策：

1. **面板形态**：默认采用右侧边栏面板（ItemView），还是侧边栏 + 独立窗口双模式？
2. **是否保留 Shell 执行工具**：如果增加 `execute_command` 工具，可让 AI 运行外部脚本辅助处理，但这涉及安全风险。是否加入（默认禁用）？
3. **是否接入 MCP 协议**：类似 DeepSeek-TUI，支持 Model Context Protocol 扩展工具能力？这可以作为远期规划。
4. **API Key 存储安全**：Obsidian 插件没有内置加密机制。方案 A：直接存储在 data.json（明文，依赖本地文件系统安全）；方案 B：使用简单的 XOR/Base64 混淆（聊胜于无）；方案 C：提示用户在系统环境变量中设置（更安全但门槛高）。推荐方案 A，在设置页提示安全风险。
5. **多语言支持**：首版仅支持中文界面，还是同时支持中英文？
6. **插件名称**：暂定 "Obsidian AI Agent"，是否有更倾向的名称？
