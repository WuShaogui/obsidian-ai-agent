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
    requestPlanConfirmation: (plan: DocumentPlan) => Promise<DocumentPlan | null>;
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
        this.apiClient.abort();
    }

    async runPipeline(
        userInput: string,
        callbacks: PipelineCallbacks,
    ): Promise<void> {
        const prompts = this.plugin.settings.pipelinePrompts;
        const model = this.resolveModel(userInput);

        try {
            // ===== Step 0: Plan =====
            callbacks.onStatusChange('正在分析需求，生成计划...');
            callbacks.onThinking('📋 步骤 1/5：分析需求并生成计划', '分析用户输入，确定需要生成的文章数量、标题和目录结构...');
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

            // Ask for confirmation if multiple articles
            if (plan.articles.length > 1) {
                const confirmed = await callbacks.requestPlanConfirmation(plan);
                if (!confirmed) {
                    callbacks.onError('用户取消了操作');
                    callbacks.onComplete();
                    return;
                }
                plan = confirmed;
            }

            if (plan.articles.length === 0) {
                callbacks.onError('未能生成有效的文章计划');
                callbacks.onComplete();
                return;
            }

            // ===== Execute each article through steps 1-3 =====
            for (const article of plan.articles) {
                try {
                    // Step 1: Draft
                    callbacks.onArticleStatusChange(article, 'draft', 'drafting');
                    callbacks.onStatusChange(`正在生成：${article.title}`);
                    callbacks.onThinking(`✍️ 步骤 2/5：生成草稿 — ${article.title}`, `根据主题「${article.topic}」撰写 Markdown 初稿...`);
                    const draft = await this.generateDraft(article, userInput, prompts.draft, model, callbacks);
                    callbacks.onArticleStatusChange(article, 'draft', 'done');

                    // Step 2: Polish
                    callbacks.onArticleStatusChange(article, 'polish', 'polishing');
                    callbacks.onStatusChange(`正在润色：${article.title}`);
                    callbacks.onThinking(`✨ 步骤 3/5：润色增强 — ${article.title}`, '添加 Mermaid 图表、callout 提示块、优化排版...');
                    const polished = await this.polishArticle(article, draft, userInput, prompts.polish, model, callbacks);
                    await this.saveFile(article.path, polished, callbacks);
                    callbacks.onArticleStatusChange(article, 'polish', 'done');

                    // Step 3: Check
                    callbacks.onArticleStatusChange(article, 'check', 'checking');
                    callbacks.onStatusChange(`正在检查语法：${article.title}`);
                    callbacks.onThinking(`🔍 步骤 4/5：语法检查 — ${article.title}`, '检查 Markdown 语法、代码块闭合、表格格式、标题层级...');
                    const checked = await this.checkArticle(article, polished, prompts.check, model, callbacks);
                    await this.saveFile(article.path, checked, callbacks);
                    callbacks.onArticleStatusChange(article, 'check', 'done');

                    article.status = 'done';
                    callbacks.onStatusChange(`完成：${article.title}`);

                } catch (err: any) {
                    article.status = 'failed';
                    article.error = err.message;
                    callbacks.onArticleStatusChange(article, 'draft', 'failed');
                    callbacks.onStatusChange(`失败：${article.title} - ${err.message}`);
                }
            }

            // ===== Step 4: Cross-link (if multiple articles succeeded) =====
            const succeeded = plan.articles.filter(a => a.status === 'done');
            if (succeeded.length > 1 && prompts.link.enabled) {
                callbacks.onStatusChange('正在添加文章间链接...');
                callbacks.onThinking('🔗 步骤 5/5：添加文章间链接', `为 ${succeeded.length} 篇文章添加 [[wikilink]] 相互引用...`);
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
            // If draft is disabled, create empty template
            return `# ${article.title}\n\n${article.topic}\n`;
        }

        const prompt = substituteVars(config.promptTemplate, {
            article_title: article.title,
            article_topic: article.topic,
            user_input: userInput,
        });

        const result = await this.callLLM(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking(`草稿：${article.title} — AI 推理细节`, result.reasoning);
        }
        return result.content;
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
        return result.content;
    }

    // ===== Step 3: Check =====
    private async checkArticle(
        article: ArticleTask,
        content: string,
        config: PipelineStepConfig,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<string> {
        if (!config.enabled) return content;

        const prompt = substituteVars(config.promptTemplate, {
            article_path: article.path,
            draft_content: content,
            article_title: article.title,
            user_input: '',
        });

        const result = await this.callLLM(prompt, model, callbacks);
        if (result.reasoning) {
            callbacks.onThinking(`检查：${article.title} — AI 推理细节`, result.reasoning);
        }
        return result.content;
    }

    // ===== Step 4: Cross-link =====
    private async crossLink(
        articles: ArticleTask[],
        config: PipelineStepConfig,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<void> {
        if (!config.enabled) return;

        const articleInfos: string[] = [];
        for (const a of articles) {
            const content = await this.readFile(a.path, callbacks);
            articleInfos.push(`--- 文件：${a.path} ---\n标题：${a.title}\n内容：\n${content}`);
        }

        const prompt = substituteVars(config.promptTemplate, {
            all_articles: articleInfos.join('\n\n'),
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

        // Split result back into individual files
        const filePattern = /---FILE:(.+?)---\n([\s\S]*?)(?=\n---FILE:|---$|$)/g;
        let match;
        while ((match = filePattern.exec(result.content)) !== null) {
            const filePath = match[1].trim();
            const fileContent = match[2].trim();
            if (filePath && fileContent) {
                await this.saveFile(normalizePath(filePath), fileContent, callbacks);
            }
        }
    }

    // ===== LLM Call =====
    private async callLLM(
        systemPrompt: string,
        model: string,
        callbacks: PipelineCallbacks,
    ): Promise<{ content: string; reasoning?: string }> {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: '请开始。' },
        ];

        const result = await this.apiClient.chat(messages, undefined, model);

        // Track usage
        if (result.usage) {
            this.usageTracker.setModel(model);
            this.usageTracker.addUsage(
                result.usage.prompt, result.usage.completion,
                result.usage.cacheHit, result.usage.cacheMiss,
            );
            callbacks.onUsageUpdate(this.usageTracker.getSummary());
        }

        return { content: result.content || '', reasoning: result.reasoning };
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
            }>;

            if (!Array.isArray(articles) || articles.length === 0) {
                return this.createSingleArticlePlan(userInput);
            }

            return {
                articles: articles.map((a, i) => ({
                    title: a.title || `文档 ${i + 1}`,
                    path: a.path || `AI生成/文档${i + 1}.md`,
                    topic: a.topic || userInput.slice(0, 100),
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
