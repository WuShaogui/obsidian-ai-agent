import { Message, PipelineStepId, ArticleTask, DocumentPlan, PipelineStepConfig } from '../types';
import { App, TFile, normalizePath } from 'obsidian';
import { APIClient } from './api-client';
import { UsageTracker } from './usage-tracker';
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
    onToolCall: (toolCall: ToolCallRecord) => void;
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
        const prompts = this.plugin.settings.pipelinePrompts;
        const model = this.resolveModel(userInput);

        try {
            // ===== Step 0: Plan =====
            callbacks.onStatusChange('正在分析需求，生成计划...');
            callbacks.onThinking('📋 步骤 1/4：分析需求并生成计划', '分析用户输入，确定需要生成的文章数量、标题和目录结构...');
            const planConfig = prompts.plan;
            let plan: DocumentPlan;

            if (planConfig.enabled) {
                const planPrompt = substituteVars(planConfig.promptTemplate, {
                    user_input: userInput,
                });
                const planResult = await this.callLLM(planPrompt, model, callbacks);
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
                    let content = await this.generateDraft(article, userInput, prompts.draft, model, callbacks);
                    await this.saveFile(article.path, content, callbacks);
                    callbacks.onArticleStatusChange(article, 'draft', 'done');
                    if (this.aborted) break;

                    // Step 2: Polish — read from file, polish, save back
                    callbacks.onArticleStatusChange(article, 'polish', 'polishing');
                    callbacks.onStatusChange(`正在润色：${article.title}`);
                    callbacks.onThinking(`✨ 步骤 3/4：润色增强 — ${article.title}`, '添加 mindmap、Mermaid 图表、callout 提示块...');
                    content = await this.readFile(article.path, callbacks);
                    content = await this.polishArticle(article, content, userInput, prompts.polish, model, callbacks);
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
                    await this.crossLink(succeeded, prompts.link, model, callbacks);
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
        callbacks: PipelineCallbacks,
    ): Promise<string> {
        if (!config.enabled) {
            return `# ${article.title}\n\n${article.topic}\n`;
        }

        const prompt = substituteVars(config.promptTemplate, {
            article_title: article.title,
            article_topic: article.topic,
            article_outline: (article.outline || []).join('\n'),
            user_input: userInput,
        });

        const result = await this.callLLM(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking(`草稿：${article.title} — AI 推理细节`, result.reasoning);
        }
        return this.fixLatexWrapping(this.stripCodeFenceWrapper(result.content));
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

        const result = await this.callLLM(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking(`润色：${article.title} — AI 推理细节`, result.reasoning);
        }
        return this.fixLatexWrapping(this.stripCodeFenceWrapper(result.content));
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

        const result = await this.callLLM(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking('文章链接 — AI 推理细节', result.reasoning);
        }

        // Parse the LLM output and append each "相关文章" block to the corresponding file
        const filePattern = /---FILE:(.+?)---\n([\s\S]*?)(?=\n---FILE:|---$|$)/g;
        let match;
        while ((match = filePattern.exec(result.content)) !== null) {
            const filePath = match[1].trim();
            const linkSection = match[2].trim();
            if (filePath && linkSection) {
                const existing = await this.readFile(filePath.replace(/\\/g, '/'), callbacks);
                const appended = existing.trimEnd() + '\n\n' + linkSection.trim();
                await this.saveFile(normalizePath(filePath), appended, callbacks);
            }
        }
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

    private resolveModel(userInput: string): string {
        if (this.plugin.settings.defaultModel !== 'auto') {
            return this.plugin.settings.defaultModel;
        }
        // Auto: always use Pro for pipeline (multi-step document generation)
        return 'deepseek-v4-pro';
    }
}
