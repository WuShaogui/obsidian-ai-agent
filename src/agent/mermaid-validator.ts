import mermaid from 'mermaid';

let mermaidReady = false;
const api = (mermaid as any).default || mermaid;

/** Initialize mermaid for parsing (no DOM needed for parse-only). */
export function initMermaid(): void {
    if (mermaidReady) return;
    try {
        if (typeof api.initialize === 'function') {
            api.initialize({
                startOnLoad: false,
                securityLevel: 'loose',  // skip DOMPurify sanitization
            });
        }
        mermaidReady = true;
    } catch {
        mermaidReady = true;
    }
}

/**
 * Validate a Mermaid diagram using mermaid.parse().
 * Returns { ok: true } on success, { ok: false, error } with the parse error message.
 */
export async function validateMermaid(diagram: string): Promise<{ ok: boolean; error?: string }> {
    initMermaid();
    try {
        await api.parse(diagram);
        return { ok: true };
    } catch (err: any) {
        const msg = err.message || String(err);

        // Skip non-syntax errors (DOMPurify, missing browser APIs, etc.)
        // These don't indicate an actual Mermaid syntax problem
        if (/DOMPurify|addHook|sanitize/i.test(msg)) return { ok: true };

        // Extract the meaningful parse error
        const parseMatch = msg.match(/Parse error[^\n]*\n([^\n]*)\n([^\n]*)/);
        const cleanMsg = parseMatch
            ? `Parse error: ${parseMatch[2].trim()}\n${parseMatch[1].trim()}`
            : msg.replace(/at .*\n/g, '').trim().slice(0, 500);

        return { ok: false, error: cleanMsg || msg.slice(0, 500) };
    }
}

/**
 * Extract all ```mermaid blocks from markdown content.
 * Returns array of { full, diagram, start, end }.
 */
export function extractMermaidBlocks(content: string): Array<{ full: string; diagram: string; start: number; end: number }> {
    const blocks: Array<{ full: string; diagram: string; start: number; end: number }> = [];
    const regex = /```mermaid\s*\n?([\s\S]*?)```/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
        const diagram = m[1].trim();
        if (!diagram) continue;
        blocks.push({
            full: m[0],
            diagram,
            start: m.index,
            end: m.index + m[0].length,
        });
    }
    return blocks;
}

/**
 * Build a prompt for the LLM to fix a broken Mermaid diagram.
 */
export function buildMermaidFixPrompt(diagram: string, error: string, attempt: number): string {
    return `你是一位 Mermaid 语法专家。下面的 Mermaid 图表编译失败，请根据错误信息修复。

## 错误信息
${error}

## 当前图表
\`\`\`mermaid
${diagram}
\`\`\`

## 修复规则
1. flowchart 节点文本若含 [ ] ( ) { } < > | 等特殊字符，必须用双引号包裹
2. mindmap 子节点缩进必须是 2 空格倍数
3. 同个 \`\`\`mermaid 块只能有一种图表类型
4. flowchart 箭头 --> 前后空格
5. 保持原有结构和语义，只修复语法错误

这是第 ${attempt}/3 次修复尝试。请只输出修复后的 mermaid 代码块，不要有任何解释。`;
}
