// ===== AI Provider =====
export interface AIProvider {
    id: string;
    name: string;
    baseUrl: string;
    apiKey: string;
    models: string[];
    enabled: boolean;
}

// ===== Pipeline =====
export type PipelineStepId = 'plan' | 'draft' | 'polish' | 'link';

export interface PipelineStepConfig {
    id: PipelineStepId;
    name: string;
    description: string;
    promptTemplate: string;
    enabled: boolean;
}

export interface ArticleTask {
    title: string;
    path: string;
    topic: string;
    outline?: string[];
    status: 'pending' | 'drafting' | 'polishing' | 'done' | 'failed';
    error?: string;
}

export interface DocumentPlan {
    articles: ArticleTask[];
}

// ===== Message =====
export interface Message {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: number;
    tokenCount?: number;
    thinking?: { title: string; body: string }[];
    toolCalls?: { name: string; params: Record<string, string>; result: string }[];
}

// ===== Session =====
export interface Session {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: Message[];
}

// ===== MCP Server =====
export interface MCPServerConfig {
    id: string;
    name: string;
    command: string;
    args: string[];
    env?: Record<string, string>;
    enabled: boolean;
}

// ===== Main Settings =====
export interface AIAgentSettings {
    // AI Provider
    providers: AIProvider[];
    defaultProvider: string;
    defaultModel: string;

    // Model params
    temperature: number;
    topP: number;
    contextWindowSize: number;

    // Feature toggles
    showThinking: boolean;
    showCostInfo: boolean;

    // UI
    fontSize: 'small' | 'medium' | 'large';

    // Creation mode
    creationMode: 'independent' | 'connected';

    // Agent
    maxRetries: number;
    requestTimeout: number;
    compressThreshold: number;
    mermaidMaxFixes: number;

    // Pipeline prompts (configurable per step)
    pipelinePrompts: Record<PipelineStepId, PipelineStepConfig>;

    // MCP servers
    mcpServers: MCPServerConfig[];
}

// ===== API Types =====
// ===== Tool Calling (Function Calling) =====
export interface ToolDefinition {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, unknown>;
            required?: string[];
        };
    };
}

export interface ToolCall {
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
}

export interface ChatCompletionRequest {
    model: string;
    messages: APIMessage[];
    temperature?: number;
    top_p?: number;
    stream?: boolean;
    tools?: ToolDefinition[];
    tool_choice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };
}

export interface APIMessage {
    role: string;
    content: string | null;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
    name?: string;
    reasoning_content?: string;
}

export interface ChatCompletionChunk {
    id: string;
    choices: {
        index: number;
        delta: {
            role?: string;
            content?: string;
            reasoning_content?: string;
            tool_calls?: Array<{ index: number; id?: string; type?: 'function'; function?: { name?: string; arguments?: string } }>;
        };
        finish_reason?: string | null;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_cache_hit_tokens?: number;
        prompt_cache_miss_tokens?: number;
    };
}

// ===== Plugin globals type augmentation =====
declare module 'obsidian' {
    interface App {
        plugins: {
            plugins: Record<string, any>;
        };
    }
    interface Vault {
        getFiles(): TFile[];
    }
}
