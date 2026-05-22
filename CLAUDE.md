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
  └── manage → Document Management Agent (LLM + Function Calling)
```

### Intent Routing

Every user input is classified as `create` or `manage` before execution. The classifier uses a Flash model call with keyword fallback.

- **create**: Document generation pipeline. `creationMode` controls independent vs connected (vault-aware) mode.
- **manage**: Document management agent with full vault operation tools (20+ tools). LLM uses function calling to search, read, analyze, and modify files.

### 4-Step Document Pipeline (create intent)

```
Plan → Draft → Polish → Link
 1/4    2/4      3/4      4/4
```

Each step is an independent LLM call with its own configurable prompt template (supports `{{variable}}` substitution). Steps write to disk after each stage so the user can inspect intermediate files.

- Plan/Link use Flash model; Draft/Polish use Pro model (when `defaultModel: 'auto'`).

### Document Management Agent (manage intent)

Uses `chatWithTools()` agent loop: LLM receives user request + vault tool definitions, calls tools via function calling, executes against Obsidian vault API, and returns final answer. Max 8 rounds per request.

**Critical architectural constraints:**
- `max_tokens` is **intentionally NOT set** in API requests — the model uses its own default. Never re-add it.
- Mermaid node text containing `[ ] ( ) { }` must use double-quote wrapping: `A["dp[i][j]"]`
- All LaTeX expressions must be wrapped in `$` or `$$` — the DRAFT_PROMPT enforces this strictly

### Source modules

| Module | Role |
|--------|------|
| `src/main.ts` | Plugin lifecycle, registers the ItemView, settings tab, ribbon icon, commands |
| `src/agent/engine.ts` | **Agent core** — `runPipeline()` intent routing, 4-step creation pipeline, `runManagementAgent()` function-calling loop |
| `src/agent/api-client.ts` | OpenAI-compatible HTTP client. `chat()` with tools support, `chatWithTools()` agent loop (max 8 rounds), retry logic with exponential backoff |
| `src/agent/vault-tools.ts` | **20+ vault operation tools** — search, read, outline, files, folders, backlinks, links, tags, properties, wordcount, orphans, deadends, create, append, move, delete |
| `src/agent/local-context.ts` | **Vault search for connected creation** — two-phase (metadata→content) scoring, AND-semantic, snippet extraction |
| `src/agent/usage-tracker.ts` | Token counting + cost estimation (DeepSeek V4 pricing) |
| `src/view/chat-view.ts` | `ItemView` — chat messages, input handling, task progress, plan confirmation dialog, collapsible thinking/tool-call blocks nested inside assistant bubbles |
| `src/session/session-manager.ts` | Multi-session CRUD, JSON persistence to `.obsidian/ai-agent-sessions/`, Markdown export |
| `src/settings/settings-store.ts` | `DEFAULT_SETTINGS`, all 4 prompt templates, `resolveApiKey()` (env var `$VAR_NAME` support) |
| `src/settings/settings-tab.ts` | Settings UI: providers, model params, pipeline prompt editor, MCP config |
| `src/types/index.ts` | All TypeScript interfaces |

### Key interfaces

- `PipelineCallbacks` — bridge between engine and UI: `onThinking`, `onToolCall`, `onPlanGenerated`, `onArticleStatusChange`, etc.
- `PipelineStepId = 'plan' | 'draft' | 'polish' | 'link'`
- `DocumentPlan = { articles: ArticleTask[] }` — each article has `title`, `path`, `topic`, `outline?`, `status`
- `defaultModel: 'auto'` → Plan/Link use flash, Draft/Polish use Pro; explicit model overrides all steps

### Prompt variables

`{{user_input}}` `{{article_title}}` `{{article_topic}}` `{{article_outline}}` `{{article_path}}` `{{draft_content}}` `{{all_articles}}`

### Data flow

```
User input → ChatView.sendMessage()
  → PipelineEngine.runPipeline()
    → classifyIntent (Flash)
      ├── create → Plan → per-article(Draft→Polish) → CrossLink
      └── manage → chatWithTools loop → tool execute → onManagementResponse
  → ChatView callbacks render thinking/tool blocks or management response
```

### API Client patterns

- `APIClient.abort()` sets `this.aborted = true` and aborts the current `AbortController`
- `fetchWithRetry()` checks `this.aborted` at every retry entry point (timeout, HTTP error, network error) — must throw immediately when set
- `safeJSONStringify()` sanitizes control chars and unpaired surrogates before sending
- API Key supports env var references: `$DEEPSEEK_API_KEY` is resolved at call time


# Tool Calling Rules
When calling tools, follow these rules strictly. They override any conflicting habits from chat training.
## Argument formatting
1. **Omit optional fields you don't need.** Do not send `null`, `""`, `{}`, or `[]` as a placeholder. If a field is optional and you have no value, leave it out of the JSON entirely.
2. **Match the container type exactly.**- Array fields take JSON arrays: `["a", "b"]`, never `"[\"a\",\"b\"]"` (string), never `{}` (object), never `"foo"` (bare string).- Single-element arrays still need brackets: `["foo"]`, not `"foo"`.- Object fields take JSON objects, not arrays or strings.
3. **Strings are raw strings.** Do not wrap values in extra quotes, code fences, or markdown.
4. **Numbers and booleans are unquoted.** `30`, not `"30"`. `true`, not `"true"`.
## Paths and identifiers
5. **File paths, URLs, IDs, and similar fields go to system functions, not chat output.** Never format them as markdown links, never wrap them in backticks, never add explanatory parentheses.
Correct: `"/Users/me/notes.md"`Wrong: `"[notes.md](notes.md)"`Wrong: `` "`/Users/me/notes.md`" ``Wrong: `"/Users/me/notes.md (the notes file)"`
6. **If a tool description says "path", treat it as input to a filesystem call.** No formatting, no decoration.
## Related parameters
7. **When a tool has paired parameters (e.g., offset + limit, start + end, from + to), provide both or neither.** Read the description — if two fields work together, half the pair often produces an error.
## Recovery
8. **If a tool returns a validation error, read the error message carefully and fix only what it complains about.** Do not rewrite the whole call. Do not retry the same arguments.
9. **If a tool returns a "Note:" with a defaulted value, that's informational, not an error.** Continue the task. If the default is wrong, retry with the correct explicit value.
## Tool selection
10. **Use the tool whose description matches your intent most specifically.** Don't reach for `shellCommand` if a dedicated tool exists. Don't reach for `execute_code` for things a single tool call can handle.