import { ItemView, WorkspaceLeaf, MarkdownRenderer, Component, Notice } from 'obsidian';
import type AIAgentPlugin from '../main';
import { Message, ArticleTask, DocumentPlan, PipelineStepId } from '../types';

export const VIEW_TYPE_AI_CHAT = 'ai-agent-chat-view';

interface TaskItem {
    id: string;
    article: ArticleTask;
    steps: { step: PipelineStepId; status: 'pending' | 'running' | 'done' | 'failed' }[];
}

const STEP_LABELS: Record<PipelineStepId, string> = {
    plan: '计划',
    draft: '草稿',
    polish: '润色',
    link: '链接',
};

export class ChatView extends ItemView {
    private plugin: AIAgentPlugin;
    private messageContainer!: HTMLElement;
    private inputArea!: HTMLTextAreaElement;
    private sendBtn!: HTMLButtonElement;
    private statusBar!: HTMLElement;
    private sessionSelector!: HTMLSelectElement;
    private sessionTitleEl!: HTMLElement;

    // Input history
    private sentMessages: string[] = [];
    private historyIndex = -1;
    private currentDraft = '';

    // Markdown renderer component
    private rendererComponent: Component = new Component();

    // Task progress tracking
    private taskPanelWrapper!: HTMLElement;
    private taskPanelHeader!: HTMLElement;
    private taskPanelToggle!: HTMLElement;
    private taskPanelBody!: HTMLElement;
    private taskListEl!: HTMLElement;
    private taskItems: TaskItem[] = [];
    private taskPanelCollapsed = false;

    // Pipeline state
    private isRunning = false;

    // Progress wave
    private progressBar!: HTMLElement;

    // Usage stats
    private usageStatsEl!: HTMLElement;

    constructor(leaf: WorkspaceLeaf, plugin: AIAgentPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_AI_CHAT;
    }

    getDisplayText(): string {
        return 'AI Agent';
    }

    getIcon(): string {
        return 'bot';
    }

    async onOpen(): Promise<void> {
        const container = this.contentEl;
        container.empty();
        container.addClass('ai-agent-chat-container');
        container.addClass(`ai-agent-font-${this.plugin.settings.fontSize}`);

        // Header toolbar
        this.renderHeader(container);

        // Message area
        this.messageContainer = container.createDiv({ cls: 'ai-agent-messages' });

        // Task progress panel
        this.taskPanelWrapper = container.createDiv({ cls: 'ai-agent-task-panel-wrapper' });
        this.taskPanelWrapper.style.display = 'none';

        this.taskPanelHeader = this.taskPanelWrapper.createDiv({ cls: 'ai-agent-task-panel-header' });
        this.taskPanelToggle = this.taskPanelHeader.createEl('button', {
            cls: 'ai-agent-task-panel-toggle',
            attr: { title: '折叠/展开任务列表' },
        });
        this.taskPanelToggle.setText('▾');
        this.taskPanelHeader.createSpan({ cls: 'ai-agent-task-panel-title', text: '' });

        const toggleCollapse = () => {
            this.taskPanelCollapsed = !this.taskPanelCollapsed;
            this.taskPanelToggle.setText(this.taskPanelCollapsed ? '▸' : '▾');
            this.taskPanelBody.style.display = this.taskPanelCollapsed ? 'none' : '';
        };
        this.taskPanelToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCollapse();
        });
        this.taskPanelHeader.addEventListener('click', (e) => {
            if (e.target === this.taskPanelToggle) return;
            toggleCollapse();
        });

        this.taskPanelBody = this.taskPanelWrapper.createDiv({ cls: 'ai-agent-task-panel-body' });
        this.taskListEl = this.taskPanelBody.createDiv({ cls: 'ai-agent-task-list' });

        // Restore active session messages
        this.restoreActiveSession();

        // Welcome guide
        if (this.messageContainer.children.length === 0) {
            this.renderWelcomeMessage();
        }

        this.scrollToBottom();

        // Input area
        this.renderInputArea(container);

        // Bottom bar
        const bottomBar = container.createDiv({ cls: 'ai-agent-bottom-bar' });
        this.usageStatsEl = bottomBar.createDiv({ cls: 'ai-agent-usage-stats' });
        this.statusBar = bottomBar.createDiv({ cls: 'ai-agent-statusbar' });
        this.updateStatusBar();

        // Progress wave
        this.progressBar = container.createDiv({ cls: 'ai-agent-progress-bar' });
        for (let i = 0; i < 5; i++) {
            this.progressBar.createDiv({ cls: 'ai-agent-progress-segment' });
        }
    }

    async onClose(): Promise<void> {
        this.rendererComponent.unload();
    }

    refreshFontSize(): void {
        this.contentEl.removeClass('ai-agent-font-small', 'ai-agent-font-medium', 'ai-agent-font-large');
        this.contentEl.addClass(`ai-agent-font-${this.plugin.settings.fontSize}`);
    }

    // ===== Header =====
    private renderHeader(container: HTMLElement): void {
        const header = container.createDiv({ cls: 'ai-agent-header' });

        const left = header.createDiv({ cls: 'ai-agent-header-left' });
        left.createSpan({ text: 'AI Agent', cls: 'ai-agent-header-title' });
        this.sessionTitleEl = left.createSpan({ cls: 'ai-agent-session-title' });

        const right = header.createDiv({ cls: 'ai-agent-header-right' });

        this.sessionSelector = right.createEl('select', { cls: 'ai-agent-session-select' });
        this.sessionSelector.addEventListener('change', () => {
            this.plugin.switchSession(this.sessionSelector.value);
            this.refreshMessages();
        });
        this.updateSessionSelector();

        const newBtn = right.createEl('button', { text: '+', cls: 'ai-agent-btn ai-agent-btn-new' });
        newBtn.addEventListener('click', () => {
            this.plugin.createNewSession();
            this.updateSessionSelector();
            this.refreshMessages();
        });
    }

    // ===== Input Area =====
    private renderInputArea(container: HTMLElement): void {
        const inputWrapper = container.createDiv({ cls: 'ai-agent-input-wrapper' });

        const inputRow = inputWrapper.createDiv({ cls: 'ai-agent-input-row' });

        this.inputArea = inputRow.createEl('textarea', {
            cls: 'ai-agent-input',
            attr: {
                placeholder: '输入需求，AI 将自动生成文档... (Enter 发送, Shift+Enter 换行)',
                rows: '2',
            },
        });

        this.sendBtn = inputRow.createEl('button', {
            text: '发送',
            cls: 'ai-agent-send-btn',
        });

        // Image paste handler
        this.inputArea.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    this.handleImagePaste(item);
                    break;
                }
            }
        });

        // Keyboard shortcuts
        this.inputArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const content = this.inputArea.value.trim();
                if (content) {
                    this.sentMessages.push(content);
                    this.historyIndex = -1;
                    this.currentDraft = '';
                }
                this.sendMessage();
            } else if (e.key === 'ArrowUp' && !e.shiftKey && this.inputArea.selectionStart === 0) {
                e.preventDefault();
                if (this.sentMessages.length === 0) return;
                if (this.historyIndex === -1) {
                    this.currentDraft = this.inputArea.value;
                }
                if (this.historyIndex < this.sentMessages.length - 1) {
                    this.historyIndex++;
                }
                this.inputArea.value = this.sentMessages[this.sentMessages.length - 1 - this.historyIndex];
            } else if (e.key === 'ArrowDown' && !e.shiftKey && this.inputArea.selectionStart === this.inputArea.value.length) {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputArea.value = this.sentMessages[this.sentMessages.length - 1 - this.historyIndex];
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    this.inputArea.value = this.currentDraft;
                }
            } else if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.inputArea.value = '';
                this.historyIndex = -1;
                this.currentDraft = '';
            }
        });

        this.sendBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.plugin.getEngine().abort();
            } else {
                this.sendMessage();
            }
        });
    }

    // ===== Message Sending =====
    private async sendMessage(): Promise<void> {
        const content = this.inputArea.value.trim();
        if (!content) return;
        if (this.isRunning) return;

        // Handle slash commands
        if (content.startsWith('/')) {
            const handled = this.handleSlashCommand(content);
            if (handled) {
                this.inputArea.value = '';
                return;
            }
        }

        this.inputArea.value = '';
        this.inputArea.disabled = true;
        this.sendBtn.textContent = '停止';
        this.sendBtn.classList.add('ai-agent-send-btn-stop');
        this.isRunning = true;

        // Ensure session exists
        if (!this.plugin.getSessionManager().getActiveSession()) {
            this.plugin.createNewSession();
            this.updateSessionSelector();
        }

        // Add user message
        const userMsg: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        this.plugin.addMessageToActiveSession(userMsg);
        this.renderUserMessage(userMsg);

        // Reset task progress
        this.processBubble = null;
        this.taskItems = [];
        this.taskListEl.empty();
        this.taskPanelWrapper.style.display = 'none';

        // Show progress wave
        this.progressBar.classList.add('ai-agent-progress-active');

        await this.plugin.getEngine().runPipeline(content, {
            onPlanGenerated: (plan) => {
                this.renderPlanPreview(plan);
            },

            onArticleStatusChange: (article, step, status) => {
                this.updateTaskItem(article, step, status);
                this.renderTaskPanel();
            },

            onStatusChange: (status) => {
                this.statusBar.setText(status);
            },

            onUsageUpdate: (summary) => {
                if (this.plugin.settings.showCostInfo) {
                    this.usageStatsEl.setText(summary);
                }
            },

            onThinking: (stepName, thinking) => {
                this.appendStepBlock('thinking', '💭', '#8b5cf6', stepName, thinking);
                this.scrollToBottom();
            },

            onToolCall: (toolCall) => {
                const params = Object.entries(toolCall.params)
                    .map(([k, v]) => `${k}: ${v}`).join(', ');
                const body = `参数: ${params}\n结果: ${toolCall.result}`;
                this.appendStepBlock('tool', '🔧', '#10b981', toolCall.name, body);
                this.scrollToBottom();
            },

            onComplete: () => {
                this.inputArea.disabled = false;
                this.sendBtn.textContent = '发送';
                this.sendBtn.classList.remove('ai-agent-send-btn-stop');
                this.progressBar.classList.remove('ai-agent-progress-active');
                this.isRunning = false;
                this.statusBar.setText('');

                const doneCount = this.taskItems.filter(t =>
                    t.steps.every(s => s.status === 'done')
                ).length;
                const failCount = this.taskItems.filter(t =>
                    t.steps.some(s => s.status === 'failed')
                ).length;
                if (doneCount + failCount > 0) {
                    const msg = failCount > 0
                        ? `AI Agent 完成：${doneCount} 篇成功，${failCount} 篇失败`
                        : `AI Agent 完成：生成 ${doneCount} 篇文章`;
                    new Notice(msg);
                }

                this.updateSessionSelector();
                this.scrollToBottom();
                this.processBubble = null;
            },

            onError: (error) => {
                this.processBubble = null;
                this.progressBar.classList.remove('ai-agent-progress-active');
                this.renderError(error);
                new Notice(`错误：${error}`, 5000);
            },
        });
    }

    private handleSlashCommand(cmd: string): boolean {
        switch (cmd.trim()) {
            case '/clear':
                this.clearCurrentSession();
                return true;
            case '/export':
                this.exportCurrentSession();
                return true;
            case '/help':
                this.showHelp();
                return true;
        }
        return false;
    }

    // ===== Plan Preview (shown in message area) =====
    private renderPlanPreview(plan: DocumentPlan): void {
        const msgEl = this.messageContainer.createDiv({ cls: 'ai-agent-message ai-agent-message-assistant' });
        const bubble = msgEl.createDiv({ cls: 'ai-agent-bubble ai-agent-bubble-assistant' });
        bubble.createDiv({ cls: 'ai-agent-plan-preview-title' }).setText(
            `生成计划：共 ${plan.articles.length} 篇文章`
        );
        const list = bubble.createDiv({ cls: 'ai-agent-plan-preview-list' });
        for (const a of plan.articles) {
            const item = list.createDiv({ cls: 'ai-agent-plan-preview-item' });
            item.createSpan({ text: `📄 ${a.title}`, cls: 'ai-agent-plan-file-name' });
            item.createSpan({ text: ` — ${a.path}`, cls: 'ai-agent-plan-file-path' });
        }
    }

    // ===== Message Rendering =====
    private renderUserMessage(msg: Message): void {
        const msgEl = this.messageContainer.createDiv({ cls: 'ai-agent-message ai-agent-message-user' });
        const bubble = msgEl.createDiv({ cls: 'ai-agent-bubble ai-agent-bubble-user' });
        bubble.createDiv({ cls: 'ai-agent-bubble-content' }).setText(msg.content);
        bubble.createDiv({ cls: 'ai-agent-bubble-time' }).setText(
            new Date(msg.timestamp).toLocaleTimeString('zh-CN')
        );
    }

    private renderAssistantMessage(msg: Message): void {
        const msgEl = this.messageContainer.createDiv({ cls: 'ai-agent-message ai-agent-message-assistant' });
        const bubble = msgEl.createDiv({ cls: 'ai-agent-bubble ai-agent-bubble-assistant' });

        const contentEl = bubble.createDiv({ cls: 'ai-agent-bubble-content markdown-rendered' });
        contentEl.setText(msg.content);
        this.renderMarkdownContent(contentEl);

        bubble.createDiv({ cls: 'ai-agent-bubble-time' }).setText(
            new Date(msg.timestamp).toLocaleTimeString('zh-CN')
        );
    }

    private renderError(error: string): void {
        const msgEl = this.messageContainer.createDiv({ cls: 'ai-agent-message ai-agent-message-error' });
        msgEl.createDiv({ cls: 'ai-agent-error' }).setText(`错误: ${error}`);
    }

    private async renderMarkdownContent(el: HTMLElement): Promise<void> {
        const text = el.textContent || '';
        el.empty();
        if (text) {
            await MarkdownRenderer.renderMarkdown(text, el, '', this.rendererComponent);
        }
    }

    // ===== Collapsible blocks nested inside an assistant bubble =====

    private processBubble: HTMLElement | null = null;
    private processBody: HTMLElement | null = null;

    /** Get or create the outer assistant bubble that holds all step blocks. */
    private ensureProcessBubble(): HTMLElement {
        if (!this.processBubble || !this.processBubble.parentNode) {
            const msgEl = this.messageContainer.createDiv({ cls: 'ai-agent-message ai-agent-message-assistant' });
            this.processBubble = msgEl.createDiv({ cls: 'ai-agent-bubble ai-agent-bubble-assistant' });
            this.processBody = this.processBubble.createDiv();
        }
        return this.processBody!;
    }

    /**
     * Append a collapsible sub-block (thinking or tool-call) inside the process bubble.
     * Each block has a colored left-border, click-to-toggle header, and detail body.
     */
    private appendStepBlock(
        type: 'thinking' | 'tool',
        icon: string,
        accent: string,
        headerText: string,
        bodyText: string,
    ): void {
        const container = this.ensureProcessBubble();

        const block = container.createDiv();
        block.style.cssText = [
            'margin:4px 0',
            'border-radius:4px',
            'overflow:hidden',
            'border:1px solid var(--background-modifier-border)',
            `border-left:3px solid ${accent}`,
        ].join(';');

        // --- clickable header ---
        const header = block.createDiv();
        header.style.cssText = [
            'display:flex',
            'align-items:center',
            'gap:5px',
            'padding:4px 8px',
            'cursor:pointer',
            'user-select:none',
            'font-size:11px',
            'font-weight:600',
            `color:${accent}`,
            `background:${accent}14`,
        ].join(';');

        const arrow = header.createSpan({ text: '▾' });
        arrow.style.cssText = 'flex-shrink:0;font-size:9px;';

        const tag = header.createSpan();
        tag.style.cssText = [
            'flex-shrink:0',
            'font-size:10px',
            'font-weight:700',
            'text-transform:uppercase',
            'letter-spacing:0.04em',
            'padding:0 5px',
            'border-radius:3px',
            `background:${accent}22`,
        ].join(';');
        tag.setText(type === 'thinking' ? '思考' : '工具');

        const summary = header.createSpan({ text: `${icon} ${headerText}` });
        summary.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;opacity:0.88;';

        // --- collapsible body ---
        const body = block.createDiv();
        body.style.cssText = [
            'padding:6px 8px',
            'border-top:1px solid var(--background-modifier-border)',
            'font-size:11px',
            'line-height:1.5',
            'white-space:pre-wrap',
            'word-break:break-word',
            'max-height:220px',
            'overflow-y:auto',
            'color:var(--text-muted)',
            `background:${accent}06`,
        ].join(';');
        body.setText(bodyText);

        // toggle on header click
        let collapsed = false;
        header.addEventListener('click', () => {
            collapsed = !collapsed;
            arrow.setText(collapsed ? '▸' : '▾');
            body.style.display = collapsed ? 'none' : '';
        });
    }

    // ===== Session Management =====
    private updateSessionSelector(): void {
        const sessions = this.plugin.getSessionManager().getSessions();
        this.sessionSelector.empty();

        sessions.forEach(s => {
            const option = this.sessionSelector.createEl('option');
            option.value = s.id;
            option.text = s.title;
        });

        const activeId = this.plugin.getSessionManager().getActiveSessionId();
        if (activeId) {
            this.sessionSelector.value = activeId;
        }

        const activeSession = this.plugin.getSessionManager().getActiveSession();
        if (this.sessionTitleEl) {
            this.sessionTitleEl.setText(activeSession ? `— ${activeSession.title}` : '');
        }
    }

    private refreshMessages(): void {
        this.messageContainer.empty();
        this.taskItems = [];
        this.taskPanelCollapsed = false;
        this.taskPanelToggle.setText('▾');
        this.taskPanelBody.style.display = '';
        this.taskPanelWrapper.style.display = 'none';
        this.taskListEl.empty();

        const session = this.plugin.getSessionManager().getActiveSession();
        if (session) {
            for (const msg of session.messages) {
                switch (msg.role) {
                    case 'user':
                        this.renderUserMessage(msg);
                        break;
                    case 'assistant':
                        this.renderAssistantMessage(msg);
                        break;
                }
            }

            if (session.messages.length === 0) {
                this.renderWelcomeMessage();
            }
        }

        this.scrollToBottom();
    }

    private restoreActiveSession(): void {
        this.refreshMessages();
        this.updateSessionSelector();
    }

    private clearCurrentSession(): void {
        const sessionId = this.plugin.getSessionManager().getActiveSessionId();
        if (sessionId) {
            this.plugin.getSessionManager().clearMessages(sessionId);
            this.refreshMessages();
            this.statusBar.setText('会话已清空');
        }
    }

    private async exportCurrentSession(): Promise<void> {
        const sessionId = this.plugin.getSessionManager().getActiveSessionId();
        if (!sessionId) {
            this.statusBar.setText('没有活跃的会话');
            return;
        }

        try {
            const markdown = await this.plugin.getSessionManager().exportSession(sessionId);
            if (!markdown) {
                this.statusBar.setText('导出失败：会话为空');
                return;
            }

            const session = this.plugin.getSessionManager().getActiveSession();
            const rawName = session?.title || '导出会话';
            const safeName = rawName.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
            const baseDir = 'AI对话导出';

            const dirExists = this.app.vault.getAbstractFileByPath(baseDir);
            if (!dirExists) {
                await this.app.vault.createFolder(baseDir);
            }

            let finalPath = this.normalizePath(`${baseDir}/${safeName}.md`);
            let counter = 1;
            while (this.app.vault.getAbstractFileByPath(finalPath)) {
                finalPath = this.normalizePath(`${baseDir}/${safeName}_${counter}.md`);
                counter++;
            }

            await this.app.vault.create(finalPath, markdown);

            this.renderAssistantMessage({
                id: `export-${Date.now()}`,
                role: 'assistant',
                content: `会话已导出到 **${finalPath}**`,
                timestamp: Date.now(),
            });

            const file = this.app.vault.getAbstractFileByPath(finalPath);
            if (file) {
                const leaf = this.app.workspace.getLeaf('tab');
                await leaf.openFile(file as any);
            }

            this.statusBar.setText(`已导出：${finalPath}`);
        } catch (err: any) {
            this.statusBar.setText(`导出失败：${err.message}`);
            this.renderError(`导出失败：${err.message}`);
        }
    }

    private async handleImagePaste(item: DataTransferItem): Promise<void> {
        const file = item.getAsFile();
        if (!file) return;

        const ext = file.type === 'image/png' ? 'png'
            : file.type === 'image/jpeg' ? 'jpg'
            : file.type === 'image/gif' ? 'gif'
            : file.type === 'image/webp' ? 'webp' : 'png';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `ai-pasted-${timestamp}.${ext}`;
        const dir = 'attachments/ai-agent';
        const path = `${dir}/${filename}`;

        try {
            const dirExists = this.app.vault.getAbstractFileByPath(dir);
            if (!dirExists) {
                await this.app.vault.createFolder(dir);
            }

            const arrayBuffer = await file.arrayBuffer();
            await this.app.vault.createBinary(path, arrayBuffer);

            const imgMarkdown = `![[${filename}]]`;
            const cursorPos = this.inputArea.selectionStart;
            const before = this.inputArea.value.slice(0, cursorPos);
            const after = this.inputArea.value.slice(cursorPos);
            this.inputArea.value = before + imgMarkdown + after;
            this.inputArea.selectionStart = this.inputArea.selectionEnd = cursorPos + imgMarkdown.length;
            this.inputArea.focus();

            this.statusBar.setText(`图片已保存：${path}`);
            setTimeout(() => this.updateStatusBar(), 2000);
        } catch (err: any) {
            this.statusBar.setText(`图片保存失败：${err.message}`);
        }
    }

    private renderWelcomeMessage(): void {
        const welcome = [
            '**欢迎使用 Obsidian AI Agent**',
            '',
            '输入需求，AI 将自动完成文档生成。例如：',
            '',
            '- `写 3 篇 React Hook 技术文档，保存到 技术文档/React 目录`',
            '- `创作一个 5 章的悬疑小说，每章一个文件`',
            '- `总结最近一周的技术笔记，生成一篇周报`',
            '',
            '---',
            '',
            '**生成流程**：',
            '',
            '| 步骤 | 说明 |',
            '|------|------|',
            '| **计划** | AI 分析需求，生成文章主题和目录结构 |',
            '| **草稿** | 根据主题撰写初稿 |',
            '| **润色** | 添加思维导图、流程图、callout 提示块 |',
            '| **链接** | 多篇文章自动添加 [[wikilink]] 相互引用 |',
            '',
            '多篇文章生成时会先展示计划供确认，单篇文章直接生成。',
            '每个步骤的 Prompt 可在设置中自定义。',
            '',
            '**快捷操作**：',
            '- `↑↓` 键回溯历史消息',
            '- `Ctrl+K` 清空输入框',
            '- `/clear` 清空会话 · `/export` 导出 · `/help` 帮助',
        ].join('\n');

        this.renderAssistantMessage({
            id: 'welcome',
            role: 'assistant',
            content: welcome,
            timestamp: Date.now(),
        });
    }

    private showHelp(): void {
        const helpContent = [
            '**可用命令：**',
            '- `/clear` - 清空当前会话',
            '- `/export` - 导出当前会话为 Markdown',
            '- `/help` - 显示此帮助',
        ].join('\n');

        this.renderAssistantMessage({
            id: 'help',
            role: 'assistant',
            content: helpContent,
            timestamp: Date.now(),
        });
    }

    // ===== Pipeline Task Progress =====
    private updateTaskItem(article: ArticleTask, step: PipelineStepId, status: string): void {
        let item = this.taskItems.find(t => t.article.path === article.path);
        if (!item) {
            item = {
                id: `task-${article.path}`,
                article,
                steps: [
                    { step: 'draft', status: 'pending' },
                    { step: 'polish', status: 'pending' },
                ],
            };
            this.taskItems.push(item);
        }

        const stepItem = item.steps.find(s => s.step === step);
        if (stepItem) {
            stepItem.status = status as TaskItem['steps'][0]['status'];
        }
        item.article.status = article.status;
    }

    private renderTaskPanel(): void {
        if (this.taskItems.length === 0) {
            this.taskPanelWrapper.style.display = 'none';
            return;
        }

        this.taskPanelWrapper.style.display = '';

        const totalArticles = this.taskItems.length;
        const doneArticles = this.taskItems.filter(t =>
            t.steps.every(s => s.status === 'done')
        ).length;
        const failArticles = this.taskItems.filter(t =>
            t.steps.some(s => s.status === 'failed')
        ).length;
        const allDone = (doneArticles + failArticles) === totalArticles;
        const hasRunning = this.taskItems.some(t =>
            t.steps.some(s => s.status === 'running')
        );

        (this.taskPanelHeader.querySelector('.ai-agent-task-panel-title') as HTMLElement).setText(
            allDone
                ? `生成完成 (${doneArticles} 成功${failArticles > 0 ? ` / ${failArticles} 失败` : ''})`
                : `生成中 (${doneArticles}/${totalArticles})`
        );

        if (hasRunning && this.taskPanelCollapsed) {
            this.taskPanelCollapsed = false;
            this.taskPanelToggle.setText('▾');
            this.taskPanelBody.style.display = '';
        }

        this.taskListEl.empty();

        for (const task of this.taskItems) {
            const item = this.taskListEl.createDiv({
                cls: `ai-agent-task-item ai-agent-task-${
                    task.steps.some(s => s.status === 'failed') ? 'failed'
                    : task.steps.every(s => s.status === 'done') ? 'done'
                    : task.steps.some(s => s.status === 'running') ? 'running'
                    : 'pending'
                }`,
            });

            const icon = task.steps.some(s => s.status === 'failed') ? '✗'
                : task.steps.every(s => s.status === 'done') ? '✓'
                : task.steps.some(s => s.status === 'running') ? '⟳'
                : '○';

            item.createSpan({ cls: 'ai-agent-task-icon', text: icon });

            const info = item.createDiv({ cls: 'ai-agent-task-info' });
            info.createDiv({ cls: 'ai-agent-task-desc', text: task.article.title });

            const stepsEl = info.createDiv({ cls: 'ai-agent-task-steps' });
            for (const step of task.steps) {
                const sIcon = step.status === 'done' ? '✓'
                    : step.status === 'running' ? '⟳'
                    : step.status === 'failed' ? '✗'
                    : '○';
                stepsEl.createSpan({
                    cls: `ai-agent-step-badge ai-agent-step-${step.status}`,
                    text: `${sIcon} ${STEP_LABELS[step.step]}`,
                });
            }

            if (task.article.error) {
                item.createSpan({ cls: 'ai-agent-task-error', text: task.article.error.slice(0, 80) });
            }
        }
    }

    // ===== Utils =====
    private scrollToBottom(): void {
        requestAnimationFrame(() => {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        });
    }

    private updateStatusBar(): void {
        this.statusBar.setText(this.plugin.settings.defaultProvider);
    }

    applySettings(): void {
        this.refreshFontSize();
        this.statusBar.setText('');
        this.updateStatusBar();
    }

    private normalizePath(path: string): string {
        return path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '');
    }
}
