import { AIAgentSettings, PipelineStepId, PipelineStepConfig } from '../types';

export type { AIAgentSettings };

const PLAN_PROMPT = `你是一位专业的内容策划专家。分析用户需求，判断需要生成几篇文章。

用户需求：{{user_input}}

规则：
- 如果用户明确说"多篇"、"N篇"、"几篇"，或者需求本身适合拆分为多篇独立文章，则输出多篇文章的计划
- 如果用户需求可以（且应该）用一篇完整的文章覆盖，则输出单篇文章
- 每篇文章都需要：标题、文件路径、主题概述

以 JSON 数组格式输出，不要有任何其他文字：
[{"title": "文章标题", "path": "目录/文件名.md", "topic": "一句话描述文章核心内容"}]`;

const DRAFT_PROMPT = `你是一位资深技术文档撰写专家。根据下面提供的主题和用户需求，撰写一篇完整的 Markdown 文章。

文章标题：{{article_title}}
文章主题：{{article_topic}}
用户原始需求：{{user_input}}

写作要求：
1. 合理使用标题层级（# → ## → ###），结构清晰
2. 内容丰富详实，提供具体示例和代码片段（如适用）
3. 语言专业但易懂，用中文书写
4. 使用 Markdown 标准格式，代码块标注语言类型
5. 如有必要，使用表格整理对比信息

直接输出文章正文，不要加"这是生成的文章"之类的前缀。`;

const POLISH_PROMPT = `你是一位文档美化与知识可视化专家。对以下文章进行润色和增强。

文章标题：{{article_title}}
文章路径：{{article_path}}

原文内容：
{{draft_content}}

润色要求：
1. 在合适位置插入 mindmap 思维导图（\`\`\`mermaid mindmap ... \`\`\`），帮助读者快速把握文章结构
2. 在合适位置插入 Mermaid 图表（flowchart/sequenceDiagram/classDiagram/gantt/pie 等），将文字描述转为可视化
3. 在重点、注意、提示、警告处添加 Obsidian callout 块（> [!note]、> [!tip]、> [!warning]、> [!important]、> [!info] 等）
4. 优化排版：段落长短适中，列表格式清晰，引用和强调得当
5. 保持原文的核心信息和结构不变

直接输出润色后的完整文章。`;

const CHECK_PROMPT = `你是一位 Markdown 语法检查专家。仔细检查以下文章的语法问题并修复。

文章路径：{{article_path}}

原文内容：
{{draft_content}}

检查清单：
1. 标题层级是否连续（不跳级，如 # 后直接 ### 需要修正）
2. 代码块是否正确闭合（\`\`\` 是否成对出现，语言标注是否遗漏）
3. Mermaid 图表语法是否正确（mindmap 缩进、flowchart 箭头、节点定义等）
4. Callout 语法是否正确（> [!type] 格式、标题行、内容缩进）
5. 表格格式是否正确（列对齐、分隔行 |---|---|）
6. 内部链接格式是否规范（[[wikilink]] 格式）
7. 有无明显的 Markdown 格式错误（列表缩进、加粗/斜体未闭合等）

如发现问题，直接修复后输出完整文章。如无问题，输出原文不变。`;

const LINK_PROMPT = `你是一位知识管理专家。为一组系列文章添加相互之间的交叉引用链接。

所有文章的路径和内容：
{{all_articles}}

要求：
1. 在每篇文章的正文中，遇到其他文章覆盖的主题时，自然地在文字中添加 [[其他文章路径|显示文字]] 的内部链接
2. 在每篇文章末尾添加"## 相关文章"部分，列出指向其他文章的链接并附简要说明
3. 链接应当自然、有意义，不强行插入
4. 不修改文章的实质内容（除添加链接外）

请输出修改后的所有文章，格式如下：
---FILE:路径1---
修改后的内容1
---FILE:路径2---
修改后的内容2`;

export const DEFAULT_PIPELINE_PROMPTS: Record<PipelineStepId, PipelineStepConfig> = {
    plan: {
        id: 'plan',
        name: '生成计划',
        description: '分析用户需求，生成多篇文章的主题、路径和概述（仅多篇时执行）',
        promptTemplate: PLAN_PROMPT,
        enabled: true,
    },
    draft: {
        id: 'draft',
        name: '生成草稿',
        description: '根据主题生成文章初稿',
        promptTemplate: DRAFT_PROMPT,
        enabled: true,
    },
    polish: {
        id: 'polish',
        name: '润色增强',
        description: '添加 mindmap、Mermaid 图表、callout 提示块',
        promptTemplate: POLISH_PROMPT,
        enabled: true,
    },
    check: {
        id: 'check',
        name: '语法检查',
        description: '检查并修复 Markdown 语法问题',
        promptTemplate: CHECK_PROMPT,
        enabled: true,
    },
    link: {
        id: 'link',
        name: '文章链接',
        description: '在多篇文章之间添加 [[wikilink]] 相互引用',
        promptTemplate: LINK_PROMPT,
        enabled: true,
    },
};

export const DEFAULT_SETTINGS: AIAgentSettings = {
    providers: [
        {
            id: 'deepseek',
            name: 'DeepSeek',
            baseUrl: 'https://api.deepseek.com',
            apiKey: '$DEEPSEEK_API_KEY',
            models: ['deepseek-v4-pro', 'deepseek-v4-flash'],
            enabled: true,
        },
        {
            id: 'openai',
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            apiKey: '$OPENAI_API_KEY',
            models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
            enabled: false,
        },
    ],
    defaultProvider: 'deepseek',
    defaultModel: 'auto',

    temperature: 0.7,
    topP: 1,
    maxTokens: 4096,
    contextWindowSize: 50,

    showThinking: false,
    showCostInfo: true,

    fontSize: 'medium',

    maxRetries: 3,
    requestTimeout: 120,
    compressThreshold: 50000,

    pipelinePrompts: DEFAULT_PIPELINE_PROMPTS,

    mcpServers: [],
};

export function resolveApiKey(apiKey: string): string {
    if (apiKey.startsWith('$')) {
        const envVar = apiKey.slice(1);
        return (typeof process !== 'undefined' && process.env?.[envVar]) || '';
    }
    return apiKey;
}
