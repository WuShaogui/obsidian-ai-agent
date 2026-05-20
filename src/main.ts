import { Plugin, WorkspaceLeaf } from 'obsidian';
import { AIAgentSettings, Message } from './types';
import { DEFAULT_SETTINGS } from './settings/settings-store';
import { AIAgentSettingTab } from './settings/settings-tab';
import { ChatView, VIEW_TYPE_AI_CHAT } from './view/chat-view';
import { PipelineEngine } from './agent/engine';
import { SessionManager } from './session/session-manager';

export default class AIAgentPlugin extends Plugin {
    settings!: AIAgentSettings;
    private engine!: PipelineEngine;
    private sessionManager!: SessionManager;
    private chatView: ChatView | null = null;

    async onload(): Promise<void> {
        console.log('Obsidian AI Agent: loading plugin');

        await this.loadSettings();

        // Initialize session manager
        this.sessionManager = new SessionManager(this.app.vault);
        await this.sessionManager.loadSessions();

        // Initialize pipeline engine
        this.engine = new PipelineEngine(this);

        // Register custom view
        this.registerView(
            VIEW_TYPE_AI_CHAT,
            (leaf: WorkspaceLeaf) => {
                this.chatView = new ChatView(leaf, this);
                return this.chatView;
            }
        );

        // Register settings tab
        this.addSettingTab(new AIAgentSettingTab(this.app, this));

        // Add ribbon icon
        this.addRibbonIcon('bot', '打开 AI Agent', () => {
            this.activateView();
        });

        // Register command: open chat panel
        this.addCommand({
            id: 'open-ai-agent-chat',
            name: '打开 AI Agent 对话面板',
            callback: () => {
                this.activateView();
            },
        });

        // Register command: new session
        this.addCommand({
            id: 'new-ai-agent-session',
            name: '新建 AI Agent 会话',
            callback: () => {
                this.createNewSession();
                this.activateView();
            },
        });

        this.app.workspace.onLayoutReady(() => {
            // Optional: auto-open on load
        });
    }

    async onunload(): Promise<void> {
        console.log('Obsidian AI Agent: unloading plugin');

        this.app.workspace.detachLeavesOfType(VIEW_TYPE_AI_CHAT);
        this.engine.abort();
    }

    async loadSettings(): Promise<void> {
        const loaded = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded as Partial<AIAgentSettings>);

        // Merge pipeline prompts: keep defaults for any missing steps
        if (loaded && (loaded as any).pipelinePrompts) {
            this.settings.pipelinePrompts = {
                ...DEFAULT_SETTINGS.pipelinePrompts,
                ...(loaded as any).pipelinePrompts,
            };
        }
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
        this.engine?.updateSettings();
        if (this.chatView) {
            this.chatView.applySettings();
        }
    }

    // ===== Public API =====

    getEngine(): PipelineEngine {
        return this.engine;
    }

    getSessionManager(): SessionManager {
        return this.sessionManager;
    }

    addMessageToActiveSession(msg: Message): void {
        const sessionId = this.sessionManager.getActiveSessionId();
        if (sessionId) {
            this.sessionManager.addMessage(sessionId, msg);
        }
    }

    createNewSession(title?: string): void {
        this.sessionManager.createSession(title);
    }

    switchSession(sessionId: string): void {
        this.sessionManager.switchSession(sessionId);
    }

    async activateView(): Promise<void> {
        const { workspace } = this.app;

        const existing = workspace.getLeavesOfType(VIEW_TYPE_AI_CHAT);
        if (existing.length > 0) {
            workspace.revealLeaf(existing[0]);
            return;
        }

        const leaf = workspace.getRightLeaf(false);
        if (leaf) {
            await leaf.setViewState({
                type: VIEW_TYPE_AI_CHAT,
                active: true,
            });
            workspace.revealLeaf(leaf);
        }
    }
}
