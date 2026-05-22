import { App, TFile } from 'obsidian';

interface ScoredFile {
    file: TFile;
    score: number;
    matchSnippets: string[];
}

interface FileCache {
    headings?: { heading: string; level: number }[];
    tags?: { tag: string }[];
    frontmatter?: Record<string, unknown>;
    sections?: { type: string; position: { start: { line: number; col: number; offset: number }; end: { line: number; col: number; offset: number } } }[];
}

// Common intent/action words in Chinese that shouldn't be search terms
const STOP_WORDS = new Set([
    '帮我', '请', '写', '生成', '创建', '一篇', '几篇', '文章', '文档',
    '总结', '介绍', '说明', '分析', '讨论', '讲解', '解释',
    '需要', '希望', '想要', '可以', '应该', '能够',
    '这个', '那个', '这些', '那些', '什么', '怎么', '如何',
    '一下', '一些', '一个', '一份', '的', '了', '是', '在', '和', '与', '或',
    '以及', '还有', '包括', '比如', '例如', '按照', '根据', '关于',
    '保存到', '目录', '文件', '路径',
]);

/**
 * Extract meaningful search terms from natural language input.
 * Splits into phrases by punctuation, filters stop words,
 * and returns both full phrases and component keywords.
 */
function extractSearchTerms(input: string): { phrases: string[]; keywords: string[] } {
    // Split by common delimiters
    const segments = input.split(/[\s,，。、；：！？\n\r\t\/\\()（）\[\]【】{}「」""''"'　]+/);

    const phrases: string[] = [];
    const keywords: string[] = [];

    for (const seg of segments) {
        if (seg.length < 2) continue;
        if (STOP_WORDS.has(seg)) continue;

        phrases.push(seg);

        // Also extract 2-char sub-words from longer Chinese phrases
        if (seg.length >= 4) {
            for (let i = 0; i <= seg.length - 2; i++) {
                const sub = seg.slice(i, i + 2);
                if (!STOP_WORDS.has(sub) && sub.length >= 2) {
                    keywords.push(sub);
                }
            }
        } else {
            keywords.push(seg);
        }
    }

    return {
        phrases: [...new Set(phrases)],
        keywords: [...new Set(keywords)],
    };
}

/**
 * Score a file based on Obsidian-style search rules.
 * Phase 1: quick metadata scan.
 *
 * Rules (like Obsidian search):
 * - Multiple terms = AND (all must match for full score)
 * - Each term match adds to the score
 * - Path matches weigh most, then headings, then tags, then frontmatter
 */
function quickScore(file: TFile, cache: FileCache | null, phrases: string[], keywords: string[]): number {
    let score = 0;
    const pathLower = file.path.toLowerCase();
    const pathName = file.path.replace(/\.md$/i, '');

    // Phrase matching (exact phrase = higher weight, like Obsidian "quoted search")
    for (const phrase of phrases) {
        const pLower = phrase.toLowerCase();
        // Path contains phrase — strong signal
        if (pathLower.includes(pLower)) {
            score += 8;
        } else {
            // Partial path match
            const nameLower = pathName.toLowerCase();
            if (nameLower.includes(pLower)) score += 4;
        }
        // Heading contains phrase
        if (cache?.headings) {
            for (const h of cache.headings) {
                if (h.heading.includes(phrase)) {
                    score += 5;
                    break;
                }
            }
        }
        // Tag matches phrase
        if (cache?.tags) {
            for (const t of cache.tags) {
                const tagClean = t.tag.replace(/^#/, '');
                if (tagClean.toLowerCase().includes(pLower)) {
                    score += 5;
                    break;
                }
            }
        }
    }

    // Keyword matching (individual words = AND logic)
    let kwMatches = 0;
    for (const kw of keywords) {
        const kwLower = kw.toLowerCase();
        let matched = false;
        if (pathLower.includes(kwLower)) { matched = true; score += 2; }
        if (!matched && cache?.headings) {
            for (const h of cache.headings) {
                if (h.heading.includes(kw)) { matched = true; score += 1; break; }
            }
        }
        if (!matched && cache?.tags) {
            for (const t of cache.tags) {
                if (t.tag.toLowerCase().includes(kwLower)) { matched = true; score += 1; break; }
            }
        }
        if (matched) kwMatches++;
    }

    // Bonus: more keywords matched = more relevant
    if (keywords.length > 0 && kwMatches >= keywords.length * 0.5) {
        score += 5; // most keywords found
    }

    // Frontmatter bonus
    if (cache?.frontmatter) {
        for (const [, val] of Object.entries(cache.frontmatter)) {
            if (typeof val === 'string') {
                for (const phrase of phrases) {
                    if (val.includes(phrase)) { score += 2; break; }
                }
            }
        }
    }

    return Math.min(score, 50);
}

/**
 * Phase 2: full-content verification.
 * Reads file content and checks if terms actually appear in the body.
 * Implements Obsidian-style AND logic: all phrases should appear
 * (or at least a majority of them).
 */
function contentRelevanceScore(
    content: string,
    phrases: string[],
    keywords: string[],
): { score: number; snippets: string[] } {
    const contentLower = content.toLowerCase();
    let score = 0;
    const snippets: string[] = [];

    // Phrase matching in content (AND logic — each phrase should appear)
    let phraseHits = 0;
    for (const phrase of phrases) {
        const pLower = phrase.toLowerCase();
        let count = 0;
        let idx = 0;
        while ((idx = contentLower.indexOf(pLower, idx)) !== -1) {
            count++;
            idx += phrase.length;
        }
        if (count > 0) {
            phraseHits++;
            score += count * 3; // each occurrence adds weight

            // Capture a snippet around the first occurrence
            const firstIdx = contentLower.indexOf(pLower);
            if (firstIdx !== -1 && snippets.length < 3) {
                const start = Math.max(0, firstIdx - 40);
                const end = Math.min(content.length, firstIdx + phrase.length + 60);
                const snip = (start > 0 ? '…' : '') + content.slice(start, end).replace(/\n/g, ' ') + (end < content.length ? '…' : '');
                snippets.push(snip.trim());
            }
        }
    }

    // Keyword match density
    let kwHits = 0;
    for (const kw of keywords) {
        if (contentLower.includes(kw.toLowerCase())) {
            kwHits++;
        }
    }
    if (keywords.length > 0) {
        score += Math.round((kwHits / keywords.length) * 10);
    }

    // Bonus: most phrases found (AND-like match)
    if (phrases.length > 0 && phraseHits >= phrases.length * 0.6) {
        score += 10;
    }

    return { score, snippets };
}

function formatDocumentContext(
    path: string,
    tags: string[],
    headings: string[],
    content: string,
    snippets: string[],
    maxContentLen: number,
): string {
    const parts: string[] = [];
    parts.push(`## 📄 笔记: ${path}`);

    if (tags.length > 0) {
        parts.push(`\n**标签**: ${tags.join(', ')}`);
    }

    if (headings.length > 0) {
        parts.push(`\n**目录结构**:`);
        for (const h of headings.slice(0, 12)) {
            parts.push(`  ${h}`);
        }
    }

    // Show relevant snippets first (they're more useful than raw content start)
    if (snippets.length > 0) {
        parts.push(`\n**匹配片段**:`);
        for (const s of snippets) {
            parts.push(`> ${s}`);
        }
    }

    // Then show content from the beginning
    const snippet = content.length > maxContentLen
        ? content.slice(0, maxContentLen) + '\n\n...（内容过长，已截断）'
        : content;

    parts.push(`\n**正文开头**:\n${snippet}`);
    return parts.join('\n');
}

/**
 * Search the Obsidian vault for documents relevant to userInput.
 * Two-phase search:
 * 1. Quick metadata scan to find top candidates
 * 2. Full-content verification for relevance scoring
 *
 * Implements Obsidian-style search logic:
 * - Multiple terms = AND (all should match)
 * - Exact phrases get higher weight
 * - Content occurrence count boosts ranking
 */
export async function gatherLocalContext(
    app: App,
    userInput: string,
    maxDocuments = 5,
    maxCharLength = 8000,
): Promise<string> {
    try {
        const mdFiles = app.vault.getMarkdownFiles();

        if (mdFiles.length === 0) {
            return '本地知识库为空，尚未存储任何笔记。';
        }

        const { phrases, keywords } = extractSearchTerms(userInput);
        if (phrases.length === 0) {
            return '';
        }

        // Phase 1: Quick metadata scan
        const candidates: ScoredFile[] = [];
        for (const file of mdFiles) {
            // Skip the AI-generated output folder to avoid self-reference
            if (file.path.startsWith('AI生成/')) continue;

            const cache = app.metadataCache.getFileCache(file) as FileCache | null;
            const score = quickScore(file, cache, phrases, keywords);
            if (score > 0) {
                candidates.push({ file, score, matchSnippets: [] });
            }
        }

        if (candidates.length === 0) {
            return `未找到与「${phrases.join('、')}」直接相关的本地文档，AI 将基于自身知识生成。`;
        }

        // Sort by score descending, shorter path as tiebreaker
        candidates.sort((a, b) => b.score - a.score || a.file.path.length - b.file.path.length);

        // Take top candidates for Phase 2
        const topN = Math.min(candidates.length, maxDocuments * 3);
        const topCandidates = candidates.slice(0, topN);

        // Phase 2: Full-content verification
        const verified: ScoredFile[] = [];
        for (const c of topCandidates) {
            try {
                const content = await app.vault.cachedRead(c.file);
                const { score, snippets } = contentRelevanceScore(content, phrases, keywords);
                if (score > 0) {
                    verified.push({ file: c.file, score: c.score + score, matchSnippets: snippets });
                }
            } catch {
                // If read fails, keep the metadata score
                if (c.score >= 10) {
                    verified.push(c);
                }
            }
        }

        // Re-sort after Phase 2
        verified.sort((a, b) => b.score - a.score || a.file.path.length - b.file.path.length);

        if (verified.length === 0) {
            return `未找到与「${phrases.join('、')}」直接相关的本地文档，AI 将基于自身知识生成。`;
        }

        // Format results
        const results: string[] = [];
        let totalChars = 0;

        for (const { file, matchSnippets } of verified.slice(0, maxDocuments)) {
            try {
                const content = await app.vault.cachedRead(file);
                const cache = app.metadataCache.getFileCache(file) as FileCache | null;

                const tags = (cache?.tags ?? []).map(t => t.tag.startsWith('#') ? t.tag : '#' + t.tag);
                const headings = (cache?.headings ?? []).map(
                    h => '  '.repeat(Math.max(0, h.level - 1)) + '- ' + h.heading,
                );

                const maxContentLen = 1500;
                const doc = formatDocumentContext(file.path, tags, headings, content, matchSnippets, maxContentLen);
                const docLen = doc.length;

                if (totalChars + docLen > maxCharLength && results.length > 0) {
                    break;
                }

                results.push(doc);
                totalChars += docLen;
            } catch {
                continue;
            }
        }

        if (results.length === 0) {
            return `未找到与「${phrases.join('、')}」直接相关的本地文档，AI 将基于自身知识生成。`;
        }

        return results.join('\n\n---\n\n');
    } catch {
        return '';
    }
}

/** Count documents found (for UI reporting). */
export function countDocsInContext(context: string): number {
    const matches = context.match(/## 📄 笔记:/g);
    return matches ? matches.length : 0;
}
