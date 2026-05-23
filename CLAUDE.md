# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev

```bash
npm run dev          # watch mode, auto-rebuild on change
npm run build        # type-check + production bundle
```

Outputs: `main.js` (bundled CJS), `styles.css`. Obsidian loads these directly from the plugin directory.

## Architecture

This is an **Obsidian plugin** (`obsidian-ai-agent`) that embeds an AI agent chat panel with intent-based routing:

```
User Input → classifyIntent (Flash)
  ├── create → 4-Step Document Pipeline (Plan→Draft→Polish→Link)
  ├── manage → Document Management Agent (LLM + Function Calling)
  └── chat   → Free Conversation (Flash, direct reply)
```

### Intent Routing

Every user input is classified as `create`, `manage`, or `chat` before execution. The classifier uses a Flash model call with keyword fallback.

- **create**: Document generation pipeline. `creationMode` controls independent vs connected (vault-aware) mode.
- **manage**: Document management agent with full vault operation tools (20+ tools). LLM uses function calling to search, read, analyze, and modify files.
- **chat**: Free-form conversation. No vault tools, no pipeline. Direct LLM reply with conversation history context.

### 4-Step Document Pipeline (create intent)

```
Plan → Draft → Polish → Link
 1/4    2/4      3/4      4/4
```

Each step is an independent LLM call with its own configurable prompt template (supports `{{variable}}` substitution). Steps write to disk after each stage.

- Plan/Link use Flash model; Draft/Polish use Pro model (when `defaultModel: 'auto'`).
- Plan step automatically injects vault directory structure (`listVaultFolders()`).
- Connected creation mode searches vault for relevant context before Plan (two-phase: metadata→content).
- Draft/Polish receive conversation history for multi-turn context continuity.
- Polish output is post-processed: `stripMultiArticle → stripCodeFenceWrapper → validateAndFixMermaid → fixLatexWrapping`.
- After completion, the first generated file is automatically opened in Obsidian.

### Document Management Agent (manage intent)

Uses `chatWithTools()` agent loop: LLM receives user request + vault tool definitions, calls tools via function calling, executes against Obsidian vault API, and returns final answer. Unlimited rounds (user cancels via stop button). Receives recent 6 messages as conversation context.

### Chat Agent (chat intent)

Simple `callLLMStreamMessages()` with Flash model. Receives recent 8 messages as conversation context. Streaming content displayed in thinking panel.

### Content Post-Processing

**LaTeX Fixer** (`fixLatexWrapping`):
1. Convert `\(...\)` → `$...$`, `\[...\]` → `$$...$$`
2. Trim spaces inside `$...$`/`$$...$$`
3. Protect code blocks, inline code, and existing math (NUL-byte placeholders)
4. Fix `\begin{env}...\end{env}` → wrap in `$$`
5. Scan 200+ known LaTeX commands, wrap bare ones in `$...$` with depth-aware bracket matching
6. Fix big-O notation: `O(n)`, `Θ(n)` → wrap in `$`
7. Restore protected regions using replacer function (not string, to avoid `$` replacement pattern bugs)

**Mermaid Validator** (`validateAndFixMermaid`):
1. Extract ```mermaid blocks
2. Validate with `mermaid.parse()` (same engine as Obsidian)
3. Broken diagrams → LLM fix loop (configurable `mermaidMaxFixes`, default 3)
4. Unfixable diagrams removed; DOMPurify errors treated as pass (Electron has DOM)

**Multi-Article Guard** (`stripMultiArticle`): detects `\n---\n# ` pattern and truncates to first article.

**Critical architectural constraints:**
- `max_tokens` is **intentionally NOT set** in API requests — the model uses its own default. Never re-add it.
- Template variable substitution uses replacer function to avoid `$` interpretation bugs (`substituteVars()`).
- Safe-region restoration in LaTeX fixer also uses replacer function.
- Session saves are serialized via `saveQueue` Promise chain to prevent write races.

### Source modules

| Module | Role |
|--------|------|
| `src/main.ts` | Plugin lifecycle, registers the ItemView, settings tab, ribbon icon, commands |
| `src/agent/engine.ts` | **Agent core** — `runPipeline()` intent routing, 4-step creation pipeline, `runManagementAgent()` function-calling loop, `runChatAgent()` free conversation |
| `src/agent/api-client.ts` | OpenAI-compatible HTTP client. `chat()` with tools support, `chatWithTools()` agent loop (unlimited rounds), `chatStream()` SSE streaming, retry logic with exponential backoff |
| `src/agent/vault-tools.ts` | **20+ vault operation tools** — search, read, outline, files, folders, backlinks, links, tags, properties, wordcount, orphans, deadends, create, append, move, delete |
| `src/agent/local-context.ts` | **Vault search for connected creation** — two-phase (metadata→content) scoring, AND-semantic, snippet extraction |
| `src/agent/mermaid-validator.ts` | **Mermaid syntax validation** — `mermaid.parse()` based, no puppeteer/browser needed, LLM fix loop |
| `src/agent/usage-tracker.ts` | Token counting + cost estimation (DeepSeek V4 pricing) |
| `src/view/chat-view.ts` | `ItemView` — chat messages, input handling, task progress panel, thinking panel (streaming reasoning + content), slash command popup, creation mode toggle |
| `src/session/session-manager.ts` | Multi-session CRUD, JSON persistence to `.obsidian/ai-agent-sessions/`, Markdown export with thinking/tool-call details |
| `src/settings/settings-store.ts` | `DEFAULT_SETTINGS`, all 4 prompt templates, `resolveApiKey()` (env var `$VAR_NAME` support) |
| `src/settings/settings-tab.ts` | Settings UI: providers, model params, pipeline prompt editor, MCP config, Mermaid fix count |
| `src/types/index.ts` | All TypeScript interfaces |

### Key interfaces

- `PipelineCallbacks` — bridge between engine and UI: `onThinking`, `onReasoningDelta`, `onContentDelta`, `onToolCall`, `onPlanGenerated`, `onManagementResponse`, `onArticleStatusChange`, etc.
- `PipelineStepId = 'plan' | 'draft' | 'polish' | 'link'`
- `DocumentPlan = { articles: ArticleTask[] }` — each article has `title`, `path`, `topic`, `outline?`, `status`
- `defaultModel: 'auto'` → Plan/Link use flash, Draft/Polish use Pro; explicit model overrides all steps

### Prompt variables

`{{user_input}}` `{{article_title}}` `{{article_topic}}` `{{article_outline}}` `{{article_path}}` `{{draft_content}}` `{{all_articles}}` `{{vault_context}}` `{{vault_structure}}`

### Data flow

```
User input → ChatView.sendMessage()
  → PipelineEngine.runPipeline()
    → classifyIntent (Flash)
      ├── chat   → runChatAgent (streaming, conversation history)
      ├── create → Plan (with vault_structure + conversationHistory)
      │            → per-article(Draft→Polish with conversationHistory)
      │            → CrossLink
      └── manage → chatWithTools loop → tool execute → onManagementResponse
  → ChatView callbacks render thinking/tool blocks, streaming content, or management response
```

### API Client patterns

- `APIClient.abort()` sets `this.aborted = true` and aborts the current `AbortController`
- `APIClient.resetAbortState()` called at pipeline start; `chat()`/`chatStream()` do NOT reset abort state
- `fetchWithRetry()` checks `this.aborted` at every retry entry point and before returning success response
- `chatWithTools()` checks `this.aborted` at loop top and between tool executions
- `safeJSONStringify()` sanitizes control chars and unpaired surrogates before sending
- API Key supports env var references: `$DEEPSEEK_API_KEY` is resolved at call time

### UI Features

- **Thinking Panel**: right side of task panel, shows streaming reasoning (purple header) + streaming content (white body)
- **Task Panel**: left side, shows plan articles with titles/paths and step progress badges
- **Slash Command Popup**: type `/` to see `/clear`, `/export`, `/help` with arrow-key navigation
- **Creation Mode Toggle**: header segment control (独立/关联), also in settings
- **Session Export**: Markdown with `<details>` blocks for thinking processes and tool calls
- **Stop Button**: send button becomes red stop button during execution, aborts immediately

### Error Handling Notes

- `onError` callback resets all UI state (isRunning, inputArea, sendBtn) to prevent permanent UI freeze
- Session `saveSession()` is serialized via Promise chain to prevent concurrent write corruption
- `loadSessions()` sets `loaded = true` at function start to prevent duplicate concurrent loads
- `substituteVars()` and safe-region restoration use replacer functions to prevent `$`-pattern corruption
