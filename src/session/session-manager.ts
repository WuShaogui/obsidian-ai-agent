import { Session, Message } from '../types';
import { Vault, TFile, normalizePath } from 'obsidian';

const SESSION_DIR = '.obsidian/ai-agent-sessions';

export class SessionManager {
    private vault: Vault;
    private sessions: Session[] = [];
    private activeSessionId: string | null = null;
    private loaded = false;
    private saveQueue: Promise<void> = Promise.resolve();

    constructor(vault: Vault) {
        this.vault = vault;
    }

    async loadSessions(): Promise<void> {
        if (this.loaded) return;
        this.loaded = true; // set early to prevent duplicate loads

        try {
            const dir = this.vault.getAbstractFileByPath(normalizePath(SESSION_DIR));
            if (!dir) {
                try {
                    await this.vault.createFolder(normalizePath(SESSION_DIR));
                    return; // new folder created, no sessions to load
                } catch (e: any) {
                    // Folder may already exist despite getAbstractFileByPath returning falsy
                    if (e?.message?.includes('already exists')) {
                        // Fall through to load sessions from existing folder
                    } else {
                        throw e;
                    }
                }
            }

            const files = this.vault.getFiles().filter(f =>
                f.path.startsWith(SESSION_DIR) && f.extension === 'json'
            );

            this.sessions = [];
            for (const file of files) {
                try {
                    const content = await this.vault.read(file);
                    const session = JSON.parse(content) as Session;
                    this.sessions.push(session);
                } catch {
                    // Skip corrupted files
                }
            }

            this.sessions.sort((a, b) => b.updatedAt - a.updatedAt);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        }
    }

    getSessions(): Session[] {
        return this.sessions;
    }

    getActiveSession(): Session | null {
        if (!this.activeSessionId) return null;
        return this.sessions.find(s => s.id === this.activeSessionId) || null;
    }

    getActiveSessionId(): string | null {
        return this.activeSessionId;
    }

    createSession(title?: string): Session {
        const session: Session = {
            id: `session-${Date.now()}`,
            title: title || `会话 ${this.sessions.length + 1}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
        };

        this.sessions.unshift(session);
        this.activeSessionId = session.id;
        this.saveSession(session);

        return session;
    }

    switchSession(sessionId: string): Session | null {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            this.activeSessionId = sessionId;
        }
        return session || null;
    }

    deleteSession(sessionId: string): void {
        const index = this.sessions.findIndex(s => s.id === sessionId);
        if (index === -1) return;

        this.sessions.splice(index, 1);

        const path = normalizePath(`${SESSION_DIR}/${sessionId}.json`);
        const file = this.vault.getAbstractFileByPath(path);
        if (file instanceof TFile) {
            this.vault.delete(file).catch(() => {});
        }

        if (this.activeSessionId === sessionId) {
            this.activeSessionId = this.sessions[0]?.id || null;
        }
    }

    renameSession(sessionId: string, newTitle: string): void {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.title = newTitle;
            session.updatedAt = Date.now();
            this.saveSession(session);
        }
    }

    addMessage(sessionId: string, message: Message): void {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.messages.push(message);
            session.updatedAt = Date.now();

            if (session.title.startsWith('会话 ') && message.role === 'user') {
                const content = message.content.trim();
                session.title = content.length > 30 ? content.slice(0, 30) + '...' : content;
            }

            this.saveSession(session);
        }
    }

    clearMessages(sessionId: string): void {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.messages = [];
            session.updatedAt = Date.now();
            this.saveSession(session);
        }
    }

    getMessages(sessionId: string): Message[] {
        const session = this.sessions.find(s => s.id === sessionId);
        return session?.messages || [];
    }

    async exportSession(sessionId: string): Promise<string> {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return '';

        let markdown = `# ${session.title}\n\n`;
        markdown += `> 创建时间：${new Date(session.createdAt).toLocaleString('zh-CN')}\n`;
        markdown += `> 更新时间：${new Date(session.updatedAt).toLocaleString('zh-CN')}\n\n---\n\n`;

        for (const msg of session.messages) {
            switch (msg.role) {
                case 'user':
                    markdown += `## 👤 用户\n\n${msg.content}\n\n`;
                    break;
                case 'assistant': {
                    markdown += `## 🤖 AI\n\n${msg.content}\n\n`;

                    // Render thinking blocks (collapsible)
                    if (msg.thinking && msg.thinking.length > 0) {
                        markdown += `<details>\n<summary><b>💭 思考过程 (${msg.thinking.length} 步)</b></summary>\n\n`;
                        for (const t of msg.thinking) {
                            markdown += `> **${t.title}**\n>\n`;
                            const lines = t.body.split('\n');
                            for (const line of lines) {
                                markdown += `> ${line}\n`;
                            }
                            markdown += `>\n`;
                        }
                        markdown += `</details>\n\n`;
                    }

                    // Render tool calls (collapsible)
                    if (msg.toolCalls && msg.toolCalls.length > 0) {
                        markdown += `<details>\n<summary><b>🔧 工具调用 (${msg.toolCalls.length} 次)</b></summary>\n\n`;
                        for (const tc of msg.toolCalls) {
                            markdown += `**${tc.name}**\n`;
                            markdown += `- 参数：${Object.entries(tc.params).map(([k, v]) => `\`${k}=${v}\``).join('，')}\n`;
                            markdown += `- 结果：${tc.result}\n\n`;
                        }
                        markdown += `</details>\n\n`;
                    }

                    markdown += `---\n\n`;
                    break;
                }
            }
        }

        return markdown;
    }

    private saveSession(session: Session): void {
        // Serialize writes to prevent race conditions from rapid-fire saves
        const snapshot = JSON.stringify(session, null, 2);
        const path = normalizePath(`${SESSION_DIR}/${session.id}.json`);
        this.saveQueue = this.saveQueue.then(async () => {
            // Try modify first (most common), fallback to create
            const existing = this.vault.getAbstractFileByPath(path);
            if (existing instanceof TFile) {
                await this.vault.modify(existing, snapshot);
                return;
            }
            // Only create if nothing exists at that path
            if (!existing) {
                try {
                    await this.vault.create(path, snapshot);
                    return;
                } catch (createErr: any) {
                    // File was created between check and create (rare race)
                    if (createErr?.message?.includes('already exists')) {
                        const retry = this.vault.getAbstractFileByPath(path);
                        if (retry instanceof TFile) {
                            await this.vault.modify(retry, snapshot);
                        }
                    } else {
                        console.error('Failed to save session:', createErr);
                    }
                }
            }
        }).catch(() => {});
    }
}
