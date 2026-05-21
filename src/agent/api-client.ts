import { ChatCompletionRequest, ChatCompletionChunk, AIProvider } from '../types';
import { AIAgentSettings, resolveApiKey } from '../settings/settings-store';

export interface StreamCallbacks {
    onToken: (token: string) => void;
    onReasoning?: (reasoning: string) => void;
    onComplete: (content: string, reasoning?: string, usage?: { prompt: number; completion: number; total: number; cacheHit?: number; cacheMiss?: number }) => void;
    onError: (error: Error) => void;
}

function sanitizeString(s: string): string {
    if (!s) return s;
    return s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

function safeJSONStringify(obj: unknown, space?: number): string {
    return JSON.stringify(obj, (_key, value) => {
        if (typeof value === 'string') {
            return sanitizeString(value);
        }
        return value;
    }, space);
}

export class APIClient {
    private settings: AIAgentSettings;
    private abortController: AbortController | null = null;

    constructor(settings: AIAgentSettings) {
        this.settings = settings;
    }

    updateSettings(settings: AIAgentSettings): void {
        this.settings = settings;
    }

    abort(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    private async fetchWithRetry(
        url: string,
        init: RequestInit,
        isStreaming: boolean,
    ): Promise<Response> {
        const maxRetries = this.settings.maxRetries;
        const timeoutMs = this.settings.requestTimeout * 1000;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            const timeoutController = new AbortController();
            const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

            const combinedSignal = timeoutController.signal;
            const mergedInit = { ...init, signal: combinedSignal };

            const onExternalAbort = () => timeoutController.abort();
            if (this.abortController) {
                this.abortController.signal.addEventListener('abort', onExternalAbort);
            }

            try {
                const response = await fetch(url, mergedInit);

                if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
                    console.warn(`[AI Agent] API ${response.status}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }

                return response;
            } catch (err: any) {
                lastError = err;
                if (err.name === 'AbortError') {
                    if (this.abortController?.signal.aborted) throw err;
                    if (attempt < maxRetries) {
                        const delay = Math.min(1000 * Math.pow(2, attempt), 15000);
                        console.warn(`[AI Agent] Request timeout, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
                        await new Promise(r => setTimeout(r, delay));
                        continue;
                    }
                    throw new Error(`请求超时（${this.settings.requestTimeout}秒）`);
                }
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt), 15000);
                    console.warn(`[AI Agent] Network error: ${err.message}, retrying in ${Math.round(delay)}ms`);
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }
                throw err;
            } finally {
                clearTimeout(timeoutId);
                if (this.abortController) {
                    this.abortController.signal.removeEventListener('abort', onExternalAbort);
                }
            }
        }

        throw lastError || new Error('API 请求失败，已达最大重试次数');
    }

    async chat(
        messages: { role: string; content: string | null }[],
        tools?: any[],
        modelOverride?: string,
    ): Promise<{
        content: string;
        reasoning?: string;
        usage?: { prompt: number; completion: number; total: number; cacheHit?: number; cacheMiss?: number };
    }> {
        const provider = this.settings.providers.find((p: AIProvider) => p.id === this.settings.defaultProvider);
        if (!provider) throw new Error('未找到可用的 AI 服务商配置');

        const apiKey = resolveApiKey(provider.apiKey);
        if (!apiKey) throw new Error(`API Key 未配置（服务商：${provider.name}）`);

        const url = `${provider.baseUrl.replace(/\/$/, '')}/chat/completions`;
        let model = modelOverride || this.settings.defaultModel;
        if (model === 'auto') {
            model = provider.models[0] || 'default';
        }

        const body: ChatCompletionRequest = {
            model,
            messages: messages as any,
            temperature: this.settings.temperature,
            top_p: this.settings.topP,
            max_tokens: this.settings.maxTokens,
            stream: false,
        };

        this.abortController = new AbortController();

        const response = await this.fetchWithRetry(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: safeJSONStringify(body),
        }, false);

        if (!response.ok) {
            const errorText = await response.text().catch(() => '未知错误');
            throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        const message = choice?.message || {};
        const content = message.content || '';
        const reasoning = message.reasoning_content || '';

        return {
            content,
            reasoning: reasoning || undefined,
            usage: data.usage ? {
                prompt: data.usage.prompt_tokens,
                completion: data.usage.completion_tokens,
                total: data.usage.total_tokens,
                cacheHit: data.usage.prompt_cache_hit_tokens,
                cacheMiss: data.usage.prompt_cache_miss_tokens,
            } : undefined,
        };
    }

    async chatStream(
        messages: { role: string; content: string | null }[],
        callbacks: StreamCallbacks,
        modelOverride?: string,
    ): Promise<void> {
        const provider = this.settings.providers.find((p: AIProvider) => p.id === this.settings.defaultProvider);
        if (!provider) throw new Error('未找到可用的 AI 服务商配置');

        const apiKey = resolveApiKey(provider.apiKey);
        if (!apiKey) throw new Error(`API Key 未配置（服务商：${provider.name}）`);

        const url = `${provider.baseUrl.replace(/\/$/, '')}/chat/completions`;
        let model = modelOverride || this.settings.defaultModel;
        if (model === 'auto') {
            model = provider.models[0] || 'default';
        }

        const body: ChatCompletionRequest = {
            model,
            messages: messages as any,
            temperature: this.settings.temperature,
            top_p: this.settings.topP,
            max_tokens: this.settings.maxTokens,
            stream: true,
        };

        this.abortController = new AbortController();

        try {
            const response = await this.fetchWithRetry(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: safeJSONStringify(body),
            }, true);

            if (!response.ok) {
                const errorText = await response.text().catch(() => '未知错误');
                callbacks.onError(new Error(`API 请求失败 (${response.status}): ${errorText}`));
                return;
            }

            const reader = response.body?.getReader();
            if (!reader) {
                callbacks.onError(new Error('无法获取响应流'));
                return;
            }

            const decoder = new TextDecoder();
            let fullContent = '';
            let fullReasoning = '';
            let lineBuffer = '';
            let usage: { prompt: number; completion: number; total: number; cacheHit?: number; cacheMiss?: number } | undefined;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                lineBuffer += text;
                const lines = lineBuffer.split('\n');
                lineBuffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;

                    try {
                        const chunk: ChatCompletionChunk = JSON.parse(data);

                        if (chunk.usage) {
                            usage = {
                                prompt: chunk.usage.prompt_tokens,
                                completion: chunk.usage.completion_tokens,
                                total: chunk.usage.total_tokens,
                                cacheHit: chunk.usage.prompt_cache_hit_tokens,
                                cacheMiss: chunk.usage.prompt_cache_miss_tokens,
                            };
                        }

                        for (const choice of chunk.choices) {
                            const delta = choice.delta;
                            if (delta.reasoning_content) {
                                fullReasoning += delta.reasoning_content;
                                if (callbacks.onReasoning) {
                                    callbacks.onReasoning(delta.reasoning_content);
                                }
                            }
                            if (delta.content) {
                                fullContent += delta.content;
                                callbacks.onToken(delta.content);
                            }
                        }
                    } catch {
                        // Skip malformed chunks
                    }
                }
            }

            callbacks.onComplete(fullContent, fullReasoning || undefined, usage);

        } catch (err: any) {
            if (err.name === 'AbortError') {
                callbacks.onError(new Error('请求已取消'));
            } else {
                callbacks.onError(err);
            }
        }
    }
}
