import { Message, PipelineStepId, ArticleTask, DocumentPlan, PipelineStepConfig } from '../types';
import { App, TFile, normalizePath } from 'obsidian';
import { APIClient } from './api-client';
import { UsageTracker } from './usage-tracker';
import { gatherLocalContext, countDocsInContext } from './local-context';
import { getVaultToolDefinitions, executeTool } from './vault-tools';
import { extractMermaidBlocks, validateMermaid, buildMermaidFixPrompt } from './mermaid-validator';
import type AIAgentPlugin from '../main';

export interface ToolCallRecord {
    name: string;
    params: Record<string, string>;
    result: string;
}

export interface PipelineCallbacks {
    onPlanGenerated: (plan: DocumentPlan) => void;
    onArticleStatusChange: (article: ArticleTask, step: PipelineStepId, status: string) => void;
    onStatusChange: (status: string) => void;
    onUsageUpdate: (summary: string) => void;
    onThinking: (stepName: string, thinking: string) => void;
    onReasoningDelta: (delta: string) => void;
    onContentDelta: (delta: string) => void;
    onToolCall: (toolCall: ToolCallRecord) => void;
    onManagementResponse: (response: string) => void;
    onAssistantMessage: (message: Message) => void;
    onComplete: () => void;
    onError: (error: string) => void;
}

function substituteVars(template: string, vars: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return result;
}

export class PipelineEngine {
    private plugin: AIAgentPlugin;
    private apiClient: APIClient;
    private aborted = false;
    usageTracker: UsageTracker;

    constructor(plugin: AIAgentPlugin) {
        this.plugin = plugin;
        this.apiClient = new APIClient(plugin.settings);
        this.usageTracker = new UsageTracker();
    }

    updateSettings(): void {
        this.apiClient.updateSettings(this.plugin.settings);
    }

    abort(): void {
        this.aborted = true;
        this.apiClient.abort();
    }

    async runPipeline(
        userInput: string,
        callbacks: PipelineCallbacks,
    ): Promise<void> {
        this.aborted = false;
        this.apiClient.resetAbortState();

        try {
            // ===== Step 0: Intent classification =====
            // Gather recent conversation for context-aware classification
            const session = this.plugin.getSessionManager().getActiveSession();
            const recentMessages = (session?.messages ?? []).slice(-6);
            const conversationHistory = recentMessages
                .map(m => `${m.role === 'user' ? '用户' : '助手'}: ${m.content.slice(0, 200)}`)
                .join('\n');

            const intent = await this.classifyIntent(userInput, conversationHistory);

            if (intent === 'chat') {
                await this.runChatAgent(userInput, recentMessages, callbacks);
                return;
            }

            if (intent === 'manage') {
                await this.runManagementAgent(userInput, recentMessages, callbacks);
                return;
            }

            // ===== Document Creation Pipeline =====
            const prompts = this.plugin.settings.pipelinePrompts;
            // ===== Step 0: Gather local context (connected mode only) =====
            let vaultContext = '';

            if (this.plugin.settings.creationMode === 'connected') {
                callbacks.onStatusChange('正在检索本地知识库...');
                callbacks.onThinking('🔍 检索本地知识库', '搜索 vault 中与用户需求相关的文档...');
                vaultContext = await gatherLocalContext(this.plugin.app, userInput);

                const docCount = countDocsInContext(vaultContext);
                callbacks.onToolCall({
                    name: '检索本地知识库',
                    params: { '用户需求': userInput.slice(0, 80) },
                    result: docCount > 0
                        ? `找到 ${docCount} 篇相关文档，已提取参考内容`
                        : vaultContext || '未找到相关文档，AI 将基于自身知识生成',
                });
            }

            // ===== Step 1: Plan =====
            callbacks.onStatusChange('正在分析需求，生成计划...');
            callbacks.onThinking('📋 步骤 1/4：分析需求并生成计划', '分析用户输入，确定需要生成的文章数量、标题和目录结构...');
            const planConfig = prompts.plan;
            let plan: DocumentPlan;

            if (planConfig.enabled) {
                const planVars: Record<string, string> = {
                    user_input: userInput,
                    vault_context: vaultContext || '',
                };
                let planPrompt = substituteVars(planConfig.promptTemplate, planVars);

                // Include conversation history for context continuity (e.g., chat → create)
                if (conversationHistory) {
                    planPrompt += '\n\n---\n## 对话上下文\n\n以下是用户之前的对话记录，请结合上下文理解用户当前需求：\n\n' + conversationHistory;
                }

                // If template doesn't use {{vault_context}} and context exists, auto-append
                if (vaultContext && !planConfig.promptTemplate.includes('{{vault_context}}')) {
                    planPrompt += '\n\n---\n## 本地知识库参考\n\n以下内容来自用户的本地 Obsidian 知识库，请参考这些资料来生成贴合用户知识体系的计划：\n\n' + vaultContext;
                }

                const planResult = await this.callLLMStream(planPrompt, this.resolveModel('plan'), callbacks);
                if (planResult.reasoning) {
                    callbacks.onThinking('生成计划 — AI 推理细节', planResult.reasoning);
                }

                plan = this.parsePlan(planResult.content, userInput);
            } else {
                // Plan step disabled: create single article from user input
                plan = this.createSingleArticlePlan(userInput);
            }

            callbacks.onThinking('计划完成', `共 ${plan.articles.length} 篇文章：\n${plan.articles.map(a => `  • ${a.title} → ${a.path}`).join('\n')}`);

            callbacks.onPlanGenerated(plan);

            if (plan.articles.length === 0) {
                callbacks.onError('未能生成有效的文章计划');
                callbacks.onComplete();
                return;
            }

            // ===== Execute each article through steps 1-2 =====
            for (const article of plan.articles) {
                if (this.aborted) break;
                try {
                    // Step 1: Draft → save immediately
                    callbacks.onArticleStatusChange(article, 'draft', 'drafting');
                    callbacks.onStatusChange(`正在生成草稿：${article.title}`);
                    callbacks.onThinking(`✍️ 步骤 2/4：生成草稿 — ${article.title}`, `根据主题「${article.topic}」撰写 Markdown 初稿...`);
                    let content = await this.generateDraft(article, userInput, prompts.draft, this.resolveModel('draft'), vaultContext, callbacks);
                    await this.saveFile(article.path, content, callbacks);
                    callbacks.onArticleStatusChange(article, 'draft', 'done');
                    if (this.aborted) break;

                    // Step 2: Polish — read from file, polish, save back
                    callbacks.onArticleStatusChange(article, 'polish', 'polishing');
                    callbacks.onStatusChange(`正在润色：${article.title}`);
                    callbacks.onThinking(`✨ 步骤 3/4：润色增强 — ${article.title}`, '添加 mindmap、Mermaid 图表、callout 提示块...');
                    content = await this.readFile(article.path, callbacks);
                    content = await this.polishArticle(article, content, userInput, prompts.polish, this.resolveModel('polish'), callbacks);
                    await this.saveFile(article.path, content, callbacks);
                    callbacks.onArticleStatusChange(article, 'polish', 'done');
                    if (this.aborted) break;

                    article.status = 'done';
                    callbacks.onStatusChange(`完成：${article.title}`);

                } catch (err: any) {
                    if (this.aborted) {
                        callbacks.onStatusChange('已取消');
                        break;
                    }
                    article.status = 'failed';
                    article.error = err.message;
                    callbacks.onArticleStatusChange(article, 'draft', 'failed');
                    callbacks.onStatusChange(`失败：${article.title} - ${err.message}`);
                }
            }

            // ===== Step 3: Cross-link (if multiple articles succeeded) =====
            const succeeded = plan.articles.filter(a => a.status === 'done');
            if (succeeded.length > 1 && prompts.link.enabled) {
                callbacks.onStatusChange('正在添加文章间链接...');
                callbacks.onThinking('🔗 步骤 4/4：添加文章间链接', `为 ${succeeded.length} 篇文章添加 [[wikilink]] 相互引用...`);
                try {
                    await this.crossLink(succeeded, prompts.link, this.resolveModel('link'), callbacks);
                    callbacks.onStatusChange('文章链接完成');
                } catch (err: any) {
                    callbacks.onStatusChange(`文章链接失败：${err.message}`);
                }
            }

        } catch (err: any) {
            callbacks.onError(err.message || '流水线执行出错');
        } finally {
            callbacks.onComplete();
        }
    }

    // ===== Step 1: Draft =====
    private async generateDraft(
        article: ArticleTask,
        userInput: string,
        config: PipelineStepConfig,
        model: string,
        vaultContext: string,
        callbacks: PipelineCallbacks,
    ): Promise<string> {
        if (!config.enabled) {
            return `# ${article.title}\n\n${article.topic}\n`;
        }

        const draftVars: Record<string, string> = {
            article_title: article.title,
            article_topic: article.topic,
            article_outline: (article.outline || []).join('\n'),
            user_input: userInput,
            vault_context: vaultContext || '',
        };
        let prompt = substituteVars(config.promptTemplate, draftVars);

        if (vaultContext && !config.promptTemplate.includes('{{vault_context}}')) {
            prompt += '\n\n---\n## 本地知识库参考\n\n以下内容来自用户的本地 Obsidian 知识库，请在写作时参考：\n\n' + vaultContext;
        }

        const result = await this.callLLMStream(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking(`草稿：${article.title} — AI 推理细节`, result.reasoning);
        }
        let content = this.stripMultiArticle(result.content);
        return this.fixLatexWrapping(this.stripCodeFenceWrapper(content));
    }

    /** Detect and truncate multiple articles concatenated with --- separator. */
    private stripMultiArticle(content: string): string {
        // Pattern: \n---\n followed by # heading = a second article starting
        const multiMatch = content.match(/\n---\n# /);
        if (multiMatch && multiMatch.index !== undefined) {
            const truncated = content.slice(0, multiMatch.index);
            // Only truncate if first part is substantial (has actual content)
            if (truncated.length > 200) {
                console.warn(`[AI Agent] Detected multi-article output, truncated at position ${multiMatch.index}`);
                return truncated.trimEnd();
            }
        }
        return content;
    }

    // ===== Step 2: Polish =====
    private async polishArticle(
        article: ArticleTask,
        draftContent: string,
        userInput: string,
        config: PipelineStepConfig,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<string> {
        if (!config.enabled) return draftContent;

        const prompt = substituteVars(config.promptTemplate, {
            article_title: article.title,
            article_path: article.path,
            draft_content: draftContent,
            user_input: userInput,
        });

        const result = await this.callLLMStream(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking(`润色：${article.title} — AI 推理细节`, result.reasoning);
        }
        let content = this.stripMultiArticle(result.content);
        content = this.stripCodeFenceWrapper(content);
        content = await this.validateAndFixMermaid(content, model, callbacks);
        return this.fixLatexWrapping(content);
    }

    // ===== Mermaid Validator + LLM Fix Loop =====
    /**
     * Validate all ```mermaid blocks with mermaid-cli.
     * Broken diagrams are sent to LLM for fixing (max 3 attempts).
     * Unfixable diagrams are removed from the content.
     */
    private async validateAndFixMermaid(
        content: string,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<string> {
        const blocks = extractMermaidBlocks(content);
        if (blocks.length === 0) return content;

        // Process in reverse order to preserve positions
        for (let i = blocks.length - 1; i >= 0; i--) {
            const { full, diagram, start, end } = blocks[i];

            // Try validating with mmdc
            let result = await validateMermaid(diagram);
            if (result.ok) continue; // Diagram is valid, keep it

            // Diagram is broken — try LLM fix loop
            let fixedDiagram = diagram;
            let fixed = false;

            const maxFixes = this.plugin.settings.mermaidMaxFixes;
            if (maxFixes <= 0) {
                callbacks.onToolCall({
                    name: '移除 Mermaid 图表',
                    params: { reason: '修复次数设为0，直接移除' },
                    result: (result.error || '').slice(0, 100),
                });
                content = content.slice(0, start) + content.slice(end);
                continue;
            }

            for (let attempt = 1; attempt <= maxFixes; attempt++) {
                callbacks.onToolCall({
                    name: `修复 Mermaid 图表 (${attempt}/${maxFixes})`,
                    params: { error: (result.error || '').slice(0, 100) },
                    result: '请求 LLM 修复...',
                });

                const fixPrompt = buildMermaidFixPrompt(fixedDiagram, result.error || '未知错误', attempt);
                const fixResult = await this.callLLM(fixPrompt, model, callbacks);

                // Extract mermaid block from LLM response
                const codeMatch = fixResult.content.match(/```mermaid\n([\s\S]*?)```/);
                fixedDiagram = codeMatch ? codeMatch[1].trim() : fixResult.content.trim();

                // Validate the fixed diagram
                result = await validateMermaid(fixedDiagram);
                if (result.ok) {
                    fixed = true;
                    callbacks.onToolCall({
                        name: `修复 Mermaid 图表 (${attempt}/${maxFixes})`,
                        params: {},
                        result: '✓ 修复成功',
                    });
                    break;
                }

                callbacks.onToolCall({
                    name: `修复 Mermaid 图表 (${attempt}/${maxFixes})`,
                    params: {},
                    result: `✗ 第 ${attempt} 次修复后仍有错误`,
                });
            }

            if (fixed) {
                // Replace the broken diagram with the fixed one
                const newBlock = '```mermaid\n' + fixedDiagram + '\n```';
                content = content.slice(0, start) + newBlock + content.slice(end);
            } else {
                // Remove the unfixable diagram
                callbacks.onToolCall({
                    name: '移除 Mermaid 图表',
                    params: { reason: '3次修复后仍无法编译' },
                    result: '已移除',
                });
                content = content.slice(0, start) + content.slice(end);
            }
        }

        return content;
    }

    // ===== Step 3: Cross-link =====
    private async crossLink(
        articles: ArticleTask[],
        config: PipelineStepConfig,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<void> {
        if (!config.enabled) return;

        // Extract only headings (outline) from each article, not full content
        const articleOutlines: string[] = [];
        for (const a of articles) {
            const content = await this.readFile(a.path, callbacks);
            const headings = this.extractHeadings(content);
            articleOutlines.push(
                `---\n文件路径：${a.path}\n标题：${a.title}\n大纲：\n${headings}`,
            );
        }

        const prompt = substituteVars(config.promptTemplate, {
            all_articles: articleOutlines.join('\n\n'),
            user_input: '',
            article_title: '',
            article_topic: '',
            article_path: '',
            draft_content: '',
        });

        const result = await this.callLLMStream(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking('文章链接 — AI 推理细节', result.reasoning);
        }

        // Parse the LLM output and apply links to each file
        const filePattern = /---FILE:(.+?)---\n([\s\S]*?)(?=\n---FILE:|---$|$)/g;
        let match;
        while ((match = filePattern.exec(result.content)) !== null) {
            const filePath = match[1].trim();
            const block = match[2].trim();
            if (!filePath || !block) continue;

            const existing = await this.readFile(filePath.replace(/\\/g, '/'), callbacks);
            if (!existing) continue;

            // Parse INLINE blocks: insert links after matching headings
            const inlinePattern = /INLINE:(.+?)\n([\s\S]*?)(?=\nINLINE:|\n## |\nNAV:|$)/g;
            let content = existing;
            let im;
            while ((im = inlinePattern.exec(block)) !== null) {
                const headingText = im[1].trim();
                const linkLines = im[2].trim();
                content = this.insertAfterHeading(content, headingText, linkLines);
            }

            // Parse ## 相关文章 section
            const relatedMatch = block.match(/## 相关文章\n([\s\S]*?)(?=\nNAV:|$)/);
            if (relatedMatch) {
                content = content.trimEnd() + '\n\n## 相关文章\n' + relatedMatch[1].trim();
            }

            // Parse NAV: prev|next
            const navMatch = block.match(/NAV:(.*?)\|(.*)/);
            if (navMatch) {
                const prevTitle = navMatch[1].trim();
                const nextTitle = navMatch[2].trim();
                const navLines: string[] = [];
                if (prevTitle) {
                    const prevArticle = articles.find(a => a.title === prevTitle);
                    if (prevArticle) {
                        navLines.push(`← 上篇：[[${prevArticle.path.replace(/\.md$/, '')}|${prevTitle}]]`);
                    }
                }
                if (nextTitle) {
                    const nextArticle = articles.find(a => a.title === nextTitle);
                    if (nextArticle) {
                        navLines.push(`下篇：[[${nextArticle.path.replace(/\.md$/, '')}|${nextTitle}]] →`);
                    }
                }
                if (navLines.length > 0) {
                    content = content.trimEnd() + '\n\n---\n\n' + navLines.join('&nbsp;&nbsp;|&nbsp;&nbsp;');
                }
            }

            await this.saveFile(normalizePath(filePath), content, callbacks);
        }
    }

    /** Insert text after the first heading that contains the given text. */
    private insertAfterHeading(content: string, headingText: string, insertText: string): string {
        const lines = content.split('\n');
        const result: string[] = [];
        let inserted = false;

        for (let i = 0; i < lines.length; i++) {
            result.push(lines[i]);
            if (!inserted && lines[i].startsWith('#') && lines[i].includes(headingText)) {
                // Skip the heading line, then skip any immediately following lines until next heading or blank
                let j = i + 1;
                while (j < lines.length && lines[j].trim() !== '' && !lines[j].startsWith('#')) {
                    result.push(lines[j]);
                    j++;
                }
                // Insert a blank line and the link text
                result.push('');
                result.push(insertText);
                i = j - 1; // continue from where we left off
                inserted = true;
            }
        }

        // If heading not found, append at end
        if (!inserted) {
            result.push('');
            result.push(insertText);
        }

        return result.join('\n');
    }

    /** Extract heading lines from markdown content. */
    private extractHeadings(content: string): string {
        const lines = content.split('\n');
        const headings: string[] = [];
        for (const line of lines) {
            const match = line.match(/^(#{1,6})\s+(.+)/);
            if (match) {
                const level = match[1].length;
                const indent = '  '.repeat(level - 1);
                headings.push(`${indent}- ${match[2]}`);
            }
        }
        return headings.join('\n') || '（无标题）';
    }

    // ===== Content Fixers =====

    /** Strip ```markdown / ``` code-fence wrapper the LLM sometimes adds around the whole article. */
    private stripCodeFenceWrapper(content: string): string {
        let text = content.trim();
        // Strip leading ```markdown or ```md (with optional trailing newline)
        text = text.replace(/^```(?:markdown|md|Markdown)?\s*\n?/, '');
        // Strip trailing ```
        text = text.replace(/\n?```\s*$/, '');
        return text;
    }

    /** Post-process content to wrap bare LaTeX commands in $...$ or $$...$$. */
    private fixLatexWrapping(content: string): string {
        const KNOWN_COMMANDS = new Set([
            'frac', 'sqrt', 'sum', 'int', 'prod', 'lim', 'alpha', 'beta', 'gamma',
            'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda',
            'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon',
            'phi', 'chi', 'psi', 'omega', 'partial', 'nabla', 'infty', 'pm',
            'mp', 'times', 'div', 'cdot', 'leq', 'geq', 'neq', 'approx', 'equiv',
            'subset', 'supset', 'subseteq', 'supseteq', 'forall', 'exists', 'in',
            'notin', 'cup', 'cap', 'setminus', 'land', 'lor', 'lnot', 'neg',
            'to', 'mapsto', 'implies', 'iff', 'Rightarrow', 'Leftrightarrow',
            'rightarrow', 'leftarrow', 'uparrow', 'downarrow', 'updownarrow',
            'longrightarrow', 'longleftarrow', 'longmapsto', 'leftrightarrow',
            'Leftarrow', 'Uparrow', 'Downarrow', 'Updownarrow', 'nearrow',
            'nwarrow', 'searrow', 'swarrow', 'ldots', 'cdots', 'vdots', 'ddots',
            'mathbb', 'mathbf', 'mathcal', 'mathit', 'mathrm', 'textrm', 'text',
            'hat', 'tilde', 'bar', 'vec', 'dot', 'ddot', 'mathring', 'acute',
            'grave', 'breve', 'check', 'widehat', 'widetilde', 'overline',
            'underline', 'overrightarrow', 'overleftarrow', 'binom', 'choose',
            'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos',
            'arctan', 'sinh', 'cosh', 'tanh', 'log', 'ln', 'lg', 'exp', 'det',
            'dim', 'gcd', 'hom', 'ker', 'Pr', 'max', 'min', 'sup', 'inf',
            'limsup', 'liminf', 'argmax', 'argmin', 'deg', 'mod', 'bmod', 'pmod',
            'circ', 'bullet', 'oplus', 'ominus', 'otimes', 'oslash', 'odot',
            'star', 'ast', 'wedge', 'vee', 'bigcap', 'bigcup', 'bigvee',
            'bigwedge', 'bigoplus', 'bigotimes', 'bigodot', 'biguplus', 'coprod',
            'langle', 'rangle', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lbrace',
            'rbrace', 'lbrack', 'rbrack', 'Vert', 'vert', 'mid', 'nmid',
            'parallel', 'nparallel', 'perp', 'cong', 'sim', 'simeq', 'propto',
            'triangle', 'triangleright', 'triangleleft', 'Box', 'Diamond',
            'clubsuit', 'diamondsuit', 'heartsuit', 'spadesuit', 'aleph',
            'hbar', 'ell', 'wp', 'Re', 'Im', 'empty', 'emptyset', 'varnothing',
            'nabla', 'surd', 'top', 'bot', 'forall', 'exists', 'nexists',
            'square', 'blacksquare', 'lozenge', 'blacklozenge', 'measuredangle',
            'sphericalangle', 'angle', 'rightleftharpoons', 'leftharpoondown',
            'rightharpoondown', 'leftharpoonup', 'rightharpoonup',
            'leftrightharpoons', 'rightleftharpoons', 'hookleftarrow',
            'hookrightarrow', 'bowtie', 'Join', 'ltimes', 'rtimes',
            'displaystyle', 'textstyle', 'limits', 'nolimits',
            'left', 'right', 'middle', 'big', 'Big', 'bigg', 'Bigg',
            'operatorname', 'DeclareMathOperator', 'newcommand', 'renewcommand',
            'varepsilon', 'varphi', 'varkappa', 'vartheta', 'varpi', 'varrho',
            'varsigma', 'varGamma', 'varDelta', 'varTheta', 'varLambda',
            'varXi', 'varPi', 'varSigma', 'varUpsilon', 'varPhi', 'varPsi',
            'varOmega', 'Phi', 'Delta', 'Omega', 'Theta', 'Sigma', 'Pi',
            'Lambda', 'Gamma', 'Xi', 'Upsilon', 'Psi',
        ]);

        // Step 0a: convert LaTeX-style \(...\) → $...$ and \[...\] → $$...$$
        // This must happen FIRST so the resulting $ blocks get proper spacing fix + protection
        let working = content;
        working = working.replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => `$$${m.trim()}$$`);
        working = working.replace(/\\\(([\s\S]*?)\\\)/g, (_, m) => `$${m.trim()}$`);

        // Step 0b: fix spacing inside existing $...$ / $$...$$  (e.g. "$ L = ... $" → "$L = ...$")

        // Only touches content that looks like math (contains \, _, or ^)
        working = working.replace(/\$[^$\n\r]+\$/g, (m) => {
            const inner = m.slice(1, -1);
            if (!/[\\_^]/.test(inner)) return m;
            return `$${inner.trim()}$`;
        });
        working = working.replace(/\$\$[\s\S]*?\$\$/g, (m) => {
            const inner = m.slice(2, -2);
            return `$$${inner.trim()}$$`;
        });

        // Step 1: protect safe regions with placeholders
        const safe: string[] = [];

        const protect = (pattern: RegExp) => {
            working = working.replace(pattern, (m) => {
                safe.push(m);
                return `\x00${safe.length - 1}\x00`;
            });
        };

        protect(/```[\s\S]*?```/g);            // fenced code blocks
        protect(/`[^`\n]+`/g);                  // inline code
        protect(/\$\$[\s\S]*?\$\$/g);           // display math (already wrapped)
        protect(/\$[^$\n\r]+?\$/g);             // inline math (already wrapped, single-line only)

        // Step 2: fix \begin{env}...\end{env} → wrap in $$
        working = working.replace(
            /\\begin\{([^}]+)\}([\s\S]*?)\\end\{\1\}/g,
            (m) => `$$\n${m}\n$$`
        );

        // Re-protect newly added $$ blocks so inner \cmds won't be double-wrapped
        protect(/\$\$[\s\S]*?\$\$/g);

        // Step 3: for each remaining \command, check if it's a known LaTeX command
        // and extend to capture its brace arguments + sub/superscripts
        const cmdRegex = /\\([a-zA-Z]+)/g;
        const fixes: Array<{ start: number; end: number; replacement: string }> = [];

        let match: RegExpExecArray | null;
        while ((match = cmdRegex.exec(working)) !== null) {
            const cmd = match[1];
            if (!KNOWN_COMMANDS.has(cmd)) continue;

            let end = match.index + match[0].length;

            // Consume optional bracket arg: \cmd[opt]
            if (working[end] === '[') {
                const closeBracket = this.findMatchingDelim(working, end, '[', ']');
                if (closeBracket !== -1) end = closeBracket + 1;
            }

            // Consume brace groups: \cmd{arg1}{arg2}...
            while (end < working.length && working[end] === '{') {
                const closeBrace = this.findMatchingDelim(working, end, '{', '}');
                if (closeBrace === -1) break;
                end = closeBrace + 1;
            }

            // Consume any _{} and ^{} groups
            while (end < working.length && (working[end] === '_' || working[end] === '^')) {
                if (end + 1 < working.length && working[end + 1] === '{') {
                    const closeSub = this.findMatchingDelim(working, end + 1, '{', '}');
                    if (closeSub === -1) break;
                    end = closeSub + 1;
                } else {
                    break;
                }
            }

            const fullMatch = working.slice(match.index, end);
            // Don't wrap if it starts/ends with $ already
            if (match.index > 0 && working[match.index - 1] === '$') continue;
            if (end < working.length && working[end] === '$') continue;

            fixes.push({ start: match.index, end, replacement: `$${fullMatch}$` });
        }

        // Remove redundant fixes whose range is fully inside another fix (e.g. \partial inside \frac)
        const merged: typeof fixes = [];
        for (const f of fixes) {
            if (!fixes.some(other => other !== f && other.start <= f.start && other.end >= f.end)) {
                merged.push(f);
            }
        }

        // Apply fixes in reverse order (to preserve positions)
        for (let i = merged.length - 1; i >= 0; i--) {
            const f = merged[i];
            working = working.slice(0, f.start) + f.replacement + working.slice(f.end);
        }

        // Step 4: fix big-O / complexity notation: O(...), o(...), Θ(...), Ω(...)
        // Content inside parens should look mathy (has n, digits, log, ^, etc.)
        working = working.replace(
            /\b([OoΘΩθ]|Theta|Omega)\s*\(([^()]+)\)/g,
            (m, _prefix, inner) => {
                if (/[nNd]|log|sqrt|frac|\^|\*|\+|!|^\d+$/.test(inner)) {
                    return `$${m}$`;
                }
                return m;
            }
        );

        // Step 5: restore safe regions
        for (let i = 0; i < safe.length; i++) {
            working = working.replace(`\x00${i}\x00`, safe[i]);
        }

        return working;
    }

    /** Find position of matching closing delimiter, or -1. */
    private findMatchingDelim(text: string, openPos: number, openChar: string, closeChar: string): number {
        let depth = 1;
        let i = openPos + 1;
        while (i < text.length && depth > 0) {
            if (text[i] === '\\') {
                i += 2; // skip escaped char
                continue;
            }
            if (text[i] === openChar) depth++;
            else if (text[i] === closeChar) depth--;
            i++;
        }
        return depth === 0 ? i - 1 : -1;
    }

    // ===== LLM Call =====
    private async callLLM(
        systemPrompt: string,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<{ content: string; reasoning?: string; completionTokens: number }> {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: '请开始。' },
        ];

        const result = await this.apiClient.chat(messages, undefined, model);

        const completionTokens = result.usage?.completion ?? 0;

        // Track usage
        if (result.usage) {
            this.usageTracker.setModel(model);
            this.usageTracker.addUsage(
                result.usage.prompt, result.usage.completion,
                result.usage.cacheHit, result.usage.cacheMiss,
            );
            callbacks.onUsageUpdate(this.usageTracker.getSummary());
        }

        return { content: result.content || '', reasoning: result.reasoning, completionTokens };
    }

    /** Streaming with full messages array (for chat/manage agents with conversation history). */
    private async callLLMStreamMessages(
        messages: { role: string; content: string }[],
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<{ content: string; reasoning?: string; completionTokens: number }> {
        return new Promise((resolve, reject) => {
            this.apiClient.chatStream(messages, {
                onToken: (token) => callbacks.onContentDelta(token),
                onReasoning: (delta) => callbacks.onReasoningDelta(delta),
                onComplete: (content, reasoning, usage) => {
                    const completionTokens = usage?.completion ?? 0;
                    if (usage) {
                        this.usageTracker.setModel(model);
                        this.usageTracker.addUsage(
                            usage.prompt, usage.completion,
                            usage.cacheHit, usage.cacheMiss,
                        );
                        callbacks.onUsageUpdate(this.usageTracker.getSummary());
                    }
                    resolve({ content, reasoning, completionTokens });
                },
                onError: (err) => reject(err),
            }, model);
        });
    }

    /** Streaming variant that fires onReasoningDelta for real-time thinking display. */
    private async callLLMStream(
        systemPrompt: string,
        model: string,
        callbacks: PipelineCallbacks,
        userMessage?: string,
    ): Promise<{ content: string; reasoning?: string; completionTokens: number }> {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage || '请开始。' },
        ];

        return new Promise((resolve, reject) => {
            this.apiClient.chatStream(messages, {
                onToken: (token) => {
                    callbacks.onContentDelta(token);
                },
                onReasoning: (delta) => {
                    callbacks.onReasoningDelta(delta);
                },
                onComplete: (content, reasoning, usage) => {
                    const completionTokens = usage?.completion ?? 0;
                    if (usage) {
                        this.usageTracker.setModel(model);
                        this.usageTracker.addUsage(
                            usage.prompt, usage.completion,
                            usage.cacheHit, usage.cacheMiss,
                        );
                        callbacks.onUsageUpdate(this.usageTracker.getSummary());
                    }
                    resolve({ content, reasoning, completionTokens });
                },
                onError: (err) => reject(err),
            }, model);
        });
    }

    // ===== File Helpers =====
    private async saveFile(path: string, content: string, callbacks?: PipelineCallbacks): Promise<void> {
        const normalized = normalizePath(path);
        // Ensure parent directory exists
        const dir = normalized.substring(0, normalized.lastIndexOf('/'));
        if (dir) {
            const dirExists = this.plugin.app.vault.getAbstractFileByPath(dir);
            if (!dirExists) {
                await this.plugin.app.vault.createFolder(dir);
            }
        }

        const existing = this.plugin.app.vault.getAbstractFileByPath(normalized);
        const isNew = !(existing instanceof TFile);
        if (existing instanceof TFile) {
            await this.plugin.app.vault.modify(existing, content);
        } else {
            await this.plugin.app.vault.create(normalized, content);
        }

        if (callbacks) {
            const preview = content.length > 200 ? content.slice(0, 200) + '...' : content;
            callbacks.onToolCall({
                name: isNew ? '创建文件' : '修改文件',
                params: { path: normalized },
                result: isNew ? `✓ 已创建 (${content.length} 字符)` : `✓ 已更新 (${content.length} 字符)`,
            });
        }
    }

    private async readFile(path: string, callbacks?: PipelineCallbacks): Promise<string> {
        const normalized = normalizePath(path);
        const file = this.plugin.app.vault.getAbstractFileByPath(normalized);
        if (file instanceof TFile) {
            const content = await this.plugin.app.vault.read(file);
            if (callbacks) {
                callbacks.onToolCall({
                    name: '读取文件',
                    params: { path: normalized },
                    result: `${content.length} 字符`,
                });
            }
            return content;
        }
        return '';
    }

    // ===== Plan Parsing =====
    private parsePlan(content: string, userInput: string): DocumentPlan {
        // Try to extract JSON from the response
        let jsonStr = content;

        // Look for JSON array
        const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
            jsonStr = arrayMatch[0];
        }

        try {
            const articles = JSON.parse(jsonStr) as Array<{
                title?: string;
                path?: string;
                topic?: string;
                outline?: string[];
            }>;

            if (!Array.isArray(articles) || articles.length === 0) {
                return this.createSingleArticlePlan(userInput);
            }

            return {
                articles: articles.map((a, i) => ({
                    title: a.title || `文档 ${i + 1}`,
                    path: a.path || `AI生成/文档${i + 1}.md`,
                    topic: a.topic || userInput.slice(0, 100),
                    outline: a.outline,
                    status: 'pending' as const,
                })),
            };
        } catch {
            // JSON parse failed, create single article plan
            return this.createSingleArticlePlan(userInput);
        }
    }

    private createSingleArticlePlan(userInput: string): DocumentPlan {
        const title = userInput.length > 40 ? userInput.slice(0, 40) + '...' : userInput;
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, '-');
        const dateStr = new Date().toISOString().slice(0, 10);

        return {
            articles: [{
                title: safeTitle,
                path: `AI生成/${dateStr}-${safeTitle}.md`,
                topic: userInput,
                status: 'pending',
            }],
        };
    }

    // ===== Intent Classification =====
    private async classifyIntent(userInput: string, conversationHistory: string): Promise<'create' | 'manage' | 'chat'> {
        const historySection = conversationHistory
            ? `\n最近对话：\n${conversationHistory}\n`
            : '';

        const prompt = `根据对话上下文判断用户当前意图：
- 创作(create)：用户想生成/撰写/创建新的文档或文章，如"写一篇...""生成文档...""创建...文章""帮我写..."
- 管理(manage)：用户想查询/阅读/搜索/操作已经存在的文档，如"查找...""列出...""总结这篇...""移动到...""删除...""有多少字""哪些文件...""大纲..."
- 聊天(chat)：用户进行自由对话/闲聊/提问，不涉及文档操作也不涉及文档创作，如"你是谁""怎么做...""什么是...""介绍一下..."
- 如果用户引用之前对话中生成/提到的文档进行查询或操作，属于管理(manage)
- 如果用户基于之前搜索结果要求创建文档，属于创作(create)
${historySection}
用户当前输入：${userInput}
只回复一个词：create、manage 或 chat`;

        try {
            const result = await this.apiClient.chat(
                [{ role: 'system', content: prompt }, { role: 'user', content: userInput }],
                undefined,
                'deepseek-v4-flash',
            );
            const answer = result.content.toLowerCase().trim();
            if (answer.includes('manage')) return 'manage';
            if (answer.includes('chat')) return 'chat';
            return 'create';
        } catch {
            // Fallback: simple keyword check
            const manageKeywords = ['查找', '搜索', '列出所有', '多少', '统计', '字数',
                '移动', '删除', '重命名', '大纲', '标签', '反向链接', '链接到',
                '属性', '总结这篇', '这篇文档', '哪些文件', '孤立的', '未解析'];
            const createKeywords = ['写', '生成', '创建', '撰写', '篇文章', '文档生成', '列出', '总结'];
            const m = manageKeywords.filter(k => userInput.includes(k)).length;
            const c = createKeywords.filter(k => userInput.includes(k)).length;
            if (m > c) return 'manage';
            if (c > 0) return 'create';
            return 'chat';
        }
    }

    // ===== Chat Agent (free conversation) =====
    private async runChatAgent(
        userInput: string,
        recentMessages: { role: string; content: string }[],
        callbacks: PipelineCallbacks,
    ): Promise<void> {
        callbacks.onStatusChange('💬 自由对话');
        callbacks.onThinking('💬 自由对话', '');

        const systemPrompt = `你是 Obsidian AI Agent，一个友好的知识助手。你会直接回答用户的问题，不回避、不推脱、不反复自我介绍。
- 用户问什么就答什么，像朋友聊天一样自然。
- 介绍自己时：你是 Obsidian 知识库 AI 助手，可以创作文档、管理知识库、自由对话。
- 不知道就说不知道，不编造。`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...recentMessages.filter(m => m.role === 'user' || m.role === 'assistant').slice(-8),
            { role: 'user', content: userInput },
        ];

        try {
            const result = await this.callLLMStreamMessages(messages, 'deepseek-v4-flash', callbacks);
            callbacks.onManagementResponse(result.content);
        } catch (err: any) {
            if (!this.aborted) {
                callbacks.onError(err.message || '对话出错');
            }
        }
    }

    // ===== Management Agent =====
    private async runManagementAgent(
        userInput: string,
        recentMessages: { role: string; content: string }[],
        callbacks: PipelineCallbacks,
    ): Promise<void> {
        callbacks.onStatusChange('📋 文档管理');

        const systemPrompt = `你是 Obsidian 知识库管理助手。你可以使用工具搜索、阅读、分析本地文档。
- 用中文回复用户问题，简洁准确。
- 如果用户问的内容在知识库中找不到，如实说明。
- 执行写操作(创建/删除/移动)前，先告知用户将要执行的操作。
- 不要生成不在工具返回结果中的信息。`;

        const tools = getVaultToolDefinitions();
        const messages: { role: string; content: string | null; tool_calls?: any[]; tool_call_id?: string }[] = [
            { role: 'system', content: systemPrompt },
            ...recentMessages.filter(m => m.role === 'user' || m.role === 'assistant').slice(-6),
            { role: 'user', content: userInput },
        ];

        const finalResponse = await this.apiClient.chatWithTools(
            messages,
            tools,
            'deepseek-v4-pro',
            async (tc) => {
                const args = JSON.parse(tc.function.arguments || '{}');
                callbacks.onToolCall({
                    name: tc.function.name,
                    params: args,
                    result: '执行中...',
                });
                const result = await executeTool(tc.function.name, args, this.plugin.app);
                callbacks.onToolCall({
                    name: tc.function.name,
                    params: args,
                    result: result.slice(0, 300),
                });
                return result;
            },
        );

        callbacks.onManagementResponse(finalResponse);
    }

    private resolveModel(step: 'plan' | 'draft' | 'polish' | 'link'): string {
        if (this.plugin.settings.defaultModel !== 'auto') {
            return this.plugin.settings.defaultModel;
        }
        // Auto: flash for simple steps (plan, link), pro for content generation (draft, polish)
        return (step === 'plan' || step === 'link') ? 'deepseek-v4-flash' : 'deepseek-v4-pro';
    }
}
