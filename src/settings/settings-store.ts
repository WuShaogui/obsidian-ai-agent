import { AIAgentSettings, PipelineStepId, PipelineStepConfig } from '../types';

export type { AIAgentSettings };

const PLAN_PROMPT = `你是一位资深内容架构师。分析用户需求，将复杂主题拆分为结构清晰的多篇独立文章。

用户需求：{{user_input}}

核心原则：
1. 每篇文章在一个固定篇幅内讲清楚一个完整叙述，不贪多求全。一篇文章 = 一个独立的知识单元。
2. 阶段式、里程碑式的概念必须拆分为独立文档。例如"入门→进阶→实战"各一篇，"需求→设计→实现→测试"各一篇。
3. 每篇文章内部重点突出、层层递进：从问题出发 → 核心概念 → 深入细节 → 总结要点。
4. 文章之间有清晰的逻辑关系（递进、并列、总分），形成完整的知识体系。

输出规则：
- 每篇文章必须包含：title（中文标题）、path（中文目录+文件名，.md 结尾）、topic（一句话核心内容）、outline（大纲，3-6 个 ## 二级中文标题，体现层层递进结构）
- 标题和路径均使用中文命名，便于阅读和检索
- 如果用户需求可以且应该用一篇完整文章覆盖，输出单篇文章即可

以 JSON 数组格式输出，不要有任何其他文字：
[{"title": "贝叶斯思维入门指南", "path": "概率与统计/贝叶斯思维入门指南.md", "topic": "从零理解贝叶斯定理及其在信念更新中的应用", "outline": ["## 背景与问题", "## 核心概念", "## 深入实践", "## 总结"]}]`;

const DRAFT_PROMPT = `你是一位资深技术文档撰写专家。根据主题和大纲，撰写一篇完整的高质量 Markdown 文章。

文章标题：{{article_title}}
文章主题：{{article_topic}}
推荐大纲：
{{article_outline}}
用户需求：{{user_input}}

写作要求：
1. 遵循推荐大纲的结构，但可根据内容需要微调标题措辞
2. 结构完整：开头概述 → 主体分节（##）→ 结尾总结，自然收尾不截断
3. 层次递进：每节内容由浅入深，从问题或概念出发逐步展开
4. 标题层级：连续不跳级（# → ## → ###）
5. 数学公式（严格遵守，零容忍错误）：只允许用 \$ 行内 \$ 或 \$\$ 块级 \$\$ 包裹数学公式。严禁使用 \\(...\\) 或 \\[...\\] 作为公式分隔符。所有以下 LaTeX 命令开头的表达式均视为数学公式，必须包裹：\\frac \\sum \\int \\prod \\lim \\sqrt \\alpha \\beta \\gamma \\theta \\lambda \\pi \\sigma \\binom \\begin \\end \\partial \\nabla \\infty \\pm \\times \\div \\cdot \\leq \\geq \\neq \\approx \\equiv \\subset \\subseteq \\forall \\exists \\in \\notin \\cup \\cap \\setminus \\mathbb \\mathbf \\mathcal \\text。包含 _ ^ 下标上标结构的数学符号也必须包裹，如 x_i → \$x_i\$，O(n^2) → \$O(n^2)\$。裸写 LaTeX 是严重格式错误，逐字检查。
6. 表格：每个表格前必须空一行（即表格前有一个空行）。表格列对齐，分隔行 |---|---|，列数一致。
7. 代码块：\`\`\`language 标注语言类型，所有 \`\`\` 必须成对闭合
8. 列表缩进一致，加粗/斜体正确闭合
9. 不生成 Mermaid 图表、mindmap，只写纯 Markdown
10. 语言专业但易懂，用中文书写

直接输出完整文章，以 # 标题开头，不要加"这是生成的"之类的前缀。
- 禁止用 \`\`\`markdown 或 \`\`\` 代码块包裹整篇文章。
- 只输出一篇文章，文章只能有一个 # 一级标题。
- 禁止使用 --- 分隔符分割多个版本或多篇文章。
- 如果大纲中包含多个标题，它们应该作为文章的 ## 二级章节，而非拆分成独立文章。`;

const POLISH_PROMPT = `你是一位文档美化与知识可视化专家。对以下文章进行润色和增强。

文章标题：{{article_title}}
文章路径：{{article_path}}

原文内容：
{{draft_content}}

润色要求：
1. 在文章开头附近插入一个 mindmap 思维导图，帮助读者快速把握文章结构。
2. 在合适位置插入 1-2 个 Mermaid 图表（flowchart/sequenceDiagram 等），将文字描述转为可视化。
3. 在重点处添加 Obsidian callout 块（> [!note]、> [!tip]、> [!warning]、> [!important]、> [!info]）。
4. 优化排版：段落长短适中，列表清晰。

Mermaid 语法规则（严格遵守）：
- mindmap：根节点无缩进，子节点 2 空格缩进，每层递增 2 空格。节点文本不含特殊字符。
- flowchart：节点文本若含 [ ] ( ) { } 等特殊字符，必须用双引号包裹：A["文本含[i]"]。反例：A[dp[i][j]] → 正解：A["dp[i][j]"]。
- 节点 ID 只用字母数字加下划线，箭头 --> 前后空格。
- 一个 \`\`\`mermaid 块内只能有一种图表类型。

数学公式规则：
- 只允许用 \$ 或 \$\$ 包裹公式。严禁使用 \\(...\\) 或 \\[...\\] 作为分隔符。严禁裸写 LaTeX。

输出完整文章，不截断。`;

const LINK_PROMPT = `你是一位知识管理专家。为一组系列文章添加交叉引用链接。

## 链接语法

Obsidian Wiki 链接格式：
- 引用整篇文章：` + "`[[文章文件名]]`" + `（去掉 .md 扩展名）
- 引用文章下的标题：` + "`[[文章文件名#标题]]`" + `
- 显示别名：` + "`[[文章文件名|别名]]`" + ` 或 ` + "`[[文章文件名#标题|别名]]`" + `

示例：
` + "`[[贝叶斯推理入门]]`" + ` → 链接到"贝叶斯推理入门.md"
` + "`[[贝叶斯推理入门#先验概率|先验]]`" + ` → 链接到该文章的"先验概率"章节，显示为"先验"

## 任务

以下是各文章的文件路径、标题和章节大纲（不含正文）：
{{all_articles}}

基于大纲，完成三件事：

### 1. 文章内联引用
观察每篇文章的大纲，找出与其他文章主题重叠、概念依赖的地方，在相关标题下插入内联引用链接。格式：
INLINE:标题文本
- 详见 ` + "`[[文件名#标题|说明]]`" + `

### 2. 篇尾相关文章
列出 2-5 篇确实相关的文章，说明关联理由。格式：
## 相关文章
- ` + "`[[文件名|标题]]`" + ` — 关联理由

### 3. 系列导航
判断文章之间的前后顺序关系（递进、入门到进阶、需求到实现等），在末尾添加上下篇导航。格式：
NAV:上篇标题|下篇标题（没有则留空）

---
输出格式（每篇文章一段）：
---FILE:目录/文件名.md---
INLINE:被引用的标题文本
- 详见 [[其他文章#相关章节|简要说明]]

INLINE:另一个被引用的标题文本
- 参考 [[其他文章]] 中的讨论

## 相关文章
- [[文章A|标题A]] — 关联理由
- [[文章B#章节|标题B]] — 关联理由

NAV:上篇文章标题|下篇文章标题
---FILE:目录/下一篇.md---
...`;

export const DEFAULT_PIPELINE_PROMPTS: Record<PipelineStepId, PipelineStepConfig> = {
    plan: {
        id: 'plan',
        name: '生成计划',
        description: '分析用户需求，生成文章主题、路径和大纲',
        promptTemplate: PLAN_PROMPT,
        enabled: true,
    },
    draft: {
        id: 'draft',
        name: '生成草稿',
        description: '根据主题生成完整文章初稿',
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
    contextWindowSize: 50,

    showThinking: false,
    showCostInfo: true,

    fontSize: 'medium',

    creationMode: 'independent',

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
