export interface UsageStats {
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalTokens: number;
    cacheHitTokens: number;
    cacheMissTokens: number;
    estimatedCostUSD: number;
    apiCalls: number;
}

// DeepSeek V4 pricing per million tokens (USD)
const PRICING: Record<string, { input: number; output: number; cacheHit: number }> = {
    'deepseek-v4-pro': { input: 0.28, output: 1.68, cacheHit: 0.07 },
    'deepseek-v4-flash': { input: 0.14, output: 0.84, cacheHit: 0.035 },
};

const DEFAULT_PRICING = { input: 0.28, output: 1.68, cacheHit: 0.07 };

export class UsageTracker {
    private stats: UsageStats = {
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalTokens: 0,
        cacheHitTokens: 0,
        cacheMissTokens: 0,
        estimatedCostUSD: 0,
        apiCalls: 0,
    };

    private currentModel = 'deepseek-v4-pro';

    setModel(model: string): void {
        this.currentModel = model;
    }

    addUsage(
        promptTokens: number,
        completionTokens: number,
        cacheHitTokens?: number,
        cacheMissTokens?: number,
    ): void {
        this.stats.totalPromptTokens += promptTokens;
        this.stats.totalCompletionTokens += completionTokens;
        this.stats.totalTokens += promptTokens + completionTokens;
        this.stats.cacheHitTokens += cacheHitTokens || 0;
        this.stats.cacheMissTokens += cacheMissTokens || 0;
        this.stats.apiCalls++;

        // Calculate cost
        const pricing = PRICING[this.currentModel] || DEFAULT_PRICING;
        const inputCost = (promptTokens / 1_000_000) * pricing.input;
        const outputCost = (completionTokens / 1_000_000) * pricing.output;

        // Cache hits are cheaper
        if (cacheHitTokens && pricing.cacheHit) {
            const cacheHitCost = (cacheHitTokens / 1_000_000) * pricing.cacheHit;
            const cacheMissCost = ((promptTokens - cacheHitTokens) / 1_000_000) * pricing.input;
            this.stats.estimatedCostUSD += cacheHitCost + cacheMissCost + outputCost;
        } else {
            this.stats.estimatedCostUSD += inputCost + outputCost;
        }
    }

    getStats(): UsageStats {
        return { ...this.stats };
    }

    getCacheHitRate(): number {
        const total = this.stats.cacheHitTokens + this.stats.cacheMissTokens;
        if (total === 0) return 0;
        return this.stats.cacheHitTokens / total;
    }

    getSummary(): string {
        const s = this.stats;
        const costStr = s.estimatedCostUSD < 0.01
            ? '<$0.01'
            : `$${s.estimatedCostUSD.toFixed(2)}`;
        return `${this.formatTokens(s.totalTokens)}  ${s.apiCalls}次  ${costStr}`;
    }

    reset(): void {
        this.stats = {
            totalPromptTokens: 0,
            totalCompletionTokens: 0,
            totalTokens: 0,
            cacheHitTokens: 0,
            cacheMissTokens: 0,
            estimatedCostUSD: 0,
            apiCalls: 0,
        };
    }

    private formatTokens(n: number): string {
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
        return String(n);
    }
}
