import { App, TFile, normalizePath } from 'obsidian';
import type { ToolDefinition } from '../types';

// ===== Tool Definitions =====

export function getVaultToolDefinitions(): ToolDefinition[] {
    return [
        // --- Read-only queries ---
        {
            type: 'function',
            function: {
                name: 'search_files',
                description: '在仓库中全文搜索文件，返回匹配的文件路径和匹配行。多关键词用空格分隔(AND逻辑)。',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: '搜索关键词，多词用空格表示AND' },
                        path: { type: 'string', description: '限制在指定文件夹内搜索(可选)' },
                        limit: { type: 'number', description: '最大返回文件数，默认10' },
                    },
                    required: ['query'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'read_file',
                description: '读取指定文件的完整内容。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径(从仓库根目录)' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_outline',
                description: '获取文档的大纲(标题结构)，返回所有标题及其层级。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                        depth: { type: 'number', description: '限制最大标题层级(1只返回一级标题)' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'list_files',
                description: '列出仓库中的文件，可按文件夹或扩展名过滤。',
                parameters: {
                    type: 'object',
                    properties: {
                        folder: { type: 'string', description: '按文件夹过滤(可选)' },
                        ext: { type: 'string', description: '按扩展名过滤，如md(可选)' },
                    },
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'list_folders',
                description: '列出仓库中的所有文件夹。',
                parameters: {
                    type: 'object',
                    properties: {
                        folder: { type: 'string', description: '按父文件夹过滤(可选)' },
                    },
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_file_info',
                description: '显示文件的详细信息(大小、修改时间、创建时间等)。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_backlinks',
                description: '列出指向目标文件的所有反向链接(哪些文件引用了它)。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '目标文件路径' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_links',
                description: '列出指定文件的所有出站链接(它引用了哪些文件)。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_tags',
                description: '列出仓库中所有标签及其出现次数。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '仅显示指定文件的标签(可选，不指定则扫描整个仓库)' },
                    },
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_properties',
                description: '显示指定文件的所有frontmatter属性及其值。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'count_words',
                description: '统计文件的字数、字符数等信息。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                    },
                    required: ['path'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_unresolved_links',
                description: '列出仓库中所有指向不存在文件的未解析链接。',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_orphans',
                description: '列出仓库中没有被任何其他文件引用的孤立文件。',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_deadends',
                description: '列出仓库中没有包含任何出站链接的死胡同文件。',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        },

        // --- Write operations ---
        {
            type: 'function',
            function: {
                name: 'create_file',
                description: '创建新文件。⚠️ 此操作会实际写入磁盘。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                        content: { type: 'string', description: '初始内容' },
                    },
                    required: ['path', 'content'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'append_file',
                description: '向文件末尾追加内容。⚠️ 此操作会实际修改文件。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                        content: { type: 'string', description: '要追加的内容' },
                    },
                    required: ['path', 'content'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'move_file',
                description: '移动或重命名文件。⚠️ 此操作会实际移动文件。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '源文件路径' },
                        to: { type: 'string', description: '目标路径或文件夹' },
                    },
                    required: ['path', 'to'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'delete_file',
                description: '删除文件(移至回收站)。⚠️ 此操作不可逆，请先确认。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '文件路径' },
                    },
                    required: ['path'],
                },
            },
        },
    ];
}

// ===== Tool Executor =====

export async function executeTool(
    name: string,
    args: Record<string, unknown>,
    app: App,
): Promise<string> {
    try {
        switch (name) {
            case 'search_files':
                return await searchFiles(args, app);
            case 'read_file':
                return await readFile(args, app);
            case 'get_outline':
                return await getOutline(args, app);
            case 'list_files':
                return await listFiles(args, app);
            case 'list_folders':
                return await listFolders(args, app);
            case 'get_file_info':
                return await getFileInfo(args, app);
            case 'get_backlinks':
                return await getBacklinks(args, app);
            case 'get_links':
                return await getLinks(args, app);
            case 'get_tags':
                return await getTags(args, app);
            case 'get_properties':
                return await getProperties(args, app);
            case 'count_words':
                return await countWords(args, app);
            case 'get_unresolved_links':
                return await getUnresolvedLinks(app);
            case 'get_orphans':
                return await getOrphans(app);
            case 'get_deadends':
                return await getDeadends(app);
            case 'create_file':
                return await createFile(args, app);
            case 'append_file':
                return await appendFile(args, app);
            case 'move_file':
                return await moveFile(args, app);
            case 'delete_file':
                return await deleteFile(args, app);
            default:
                return `未知工具: ${name}`;
        }
    } catch (err: any) {
        return `工具执行出错: ${err.message}`;
    }
}

// ===== Read-only Implementations =====

async function searchFiles(args: Record<string, unknown>, app: App): Promise<string> {
    const query = String(args.query || '');
    const folder = args.path ? String(args.path) : '';
    const limit = Number(args.limit) || 10;

    if (!query) return '请提供搜索关键词。';

    const terms = query.split(/\s+/).filter(Boolean);
    const files = app.vault.getMarkdownFiles();
    const results: string[] = [];

    for (const file of files) {
        if (results.length >= limit * 2) break; // search more than limit, then take top
        if (folder && !file.path.startsWith(folder)) continue;

        try {
            const content = await app.vault.cachedRead(file);
            const contentLower = content.toLowerCase();

            // AND logic: all terms must match
            const allMatch = terms.every(t => contentLower.includes(t.toLowerCase()));
            if (!allMatch) continue;

            // Extract matching lines
            const lines = content.split('\n');
            const matchLines: string[] = [];
            for (let i = 0; i < lines.length; i++) {
                const lineLower = lines[i].toLowerCase();
                if (terms.some(t => lineLower.includes(t.toLowerCase()))) {
                    matchLines.push(`  ${i + 1}: ${lines[i].slice(0, 120)}`);
                    if (matchLines.length >= 3) break;
                }
            }

            results.push(`- **${file.path}**\n${matchLines.join('\n')}`);
        } catch {
            continue;
        }
    }

    const topResults = results.slice(0, limit);
    if (topResults.length === 0) {
        return `未找到包含「${query}」的文件。`;
    }
    return `找到 ${results.length} 个匹配文件，显示前 ${topResults.length} 个：\n\n${topResults.join('\n\n')}`;
}

async function readFile(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const content = await app.vault.cachedRead(file);
    if (content.length > 5000) {
        return `**${path}** (${content.length} 字符，以下为前5000字符):\n\n${content.slice(0, 5000)}\n\n...（内容过长，已截断）`;
    }
    return `**${path}** (${content.length} 字符):\n\n${content}`;
}

async function getOutline(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const cache = app.metadataCache.getFileCache(file);
    const headings = cache?.headings;
    if (!headings || headings.length === 0) return `「${path}」没有标题。`;

    const maxDepth = Number(args.depth) || 0;
    const lines: string[] = [];
    for (const h of headings) {
        if (maxDepth > 0 && h.level > maxDepth) continue;
        const indent = '  '.repeat(Math.max(0, h.level - 1));
        lines.push(`${indent}- ${'#'.repeat(h.level)} ${h.heading}`);
    }
    return `**${path}** 大纲 (${headings.length} 个标题):\n\n${lines.join('\n')}`;
}

async function listFiles(args: Record<string, unknown>, app: App): Promise<string> {
    const folder = args.folder ? String(args.folder) : '';
    const ext = args.ext ? String(args.ext) : '';
    let files = app.vault.getMarkdownFiles();

    if (folder) files = files.filter(f => f.path.startsWith(folder));
    if (ext) files = files.filter(f => f.extension === ext);

    if (files.length === 0) return '没有匹配的文件。';
    if (files.length > 50) {
        files = files.slice(0, 50);
        return `共 ${app.vault.getMarkdownFiles().length} 个文件，显示前50个：\n\n${files.map(f => `- ${f.path}`).join('\n')}\n\n...还有更多文件。`;
    }
    return `共 ${files.length} 个文件：\n\n${files.map(f => `- ${f.path}`).join('\n')}`;
}

async function listFolders(args: Record<string, unknown>, app: App): Promise<string> {
    const folder = args.folder ? String(args.folder) : '';
    const files = app.vault.getMarkdownFiles();
    const dirs = new Set<string>();
    for (const f of files) {
        const parts = f.path.split('/');
        if (parts.length > 1) {
            const dir = parts.slice(0, -1).join('/');
            if (!folder || dir.startsWith(folder)) dirs.add(dir);
        }
    }
    if (dirs.size === 0) return '没有文件夹。';
    const sorted = [...dirs].sort();
    return `共 ${sorted.length} 个文件夹：\n\n${sorted.map(d => `- ${d}`).join('\n')}`;
}

async function getFileInfo(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const stat = file.stat;
    return [
        `**文件**: ${path}`,
        `**大小**: ${stat.size} 字节`,
        `**创建时间**: ${new Date(stat.ctime).toLocaleString('zh-CN')}`,
        `**修改时间**: ${new Date(stat.mtime).toLocaleString('zh-CN')}`,
    ].join('\n');
}

async function getBacklinks(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const backlinks = (app.metadataCache as any).getBacklinksForFile(file);
    if (!backlinks) return `「${path}」没有反向链接。`;

    const data = backlinks.data;
    const keys = Object.keys(data);
    if (keys.length === 0) return `「${path}」没有反向链接。`;

    const lines = keys.map(k => `- [[${k}]]`);
    return `**${path}** 的反向链接 (${keys.length} 个):\n\n${lines.join('\n')}`;
}

async function getLinks(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const cache = app.metadataCache.getFileCache(file);
    const links = cache?.links || [];
    const embeds = cache?.embeds || [];

    const outlinks = [...links, ...embeds];
    if (outlinks.length === 0) return `「${path}」没有出站链接。`;

    const lines = outlinks.map(l => `- [[${l.link}]]`);
    return `**${path}** 的出站链接 (${outlinks.length} 个):\n\n${lines.join('\n')}`;
}

async function getTags(args: Record<string, unknown>, app: App): Promise<string> {
    const targetPath = args.path ? normalizePath(String(args.path)) : '';

    if (targetPath) {
        const file = app.vault.getAbstractFileByPath(targetPath);
        if (!(file instanceof TFile)) return `文件不存在: ${targetPath}`;
        const cache = app.metadataCache.getFileCache(file);
        const tags = cache?.tags?.map(t => t.tag) || [];
        if (tags.length === 0) return `「${targetPath}」没有标签。`;
        return `「${targetPath}」的标签:\n${tags.join('\n')}`;
    }

    // Whole vault: collect from all files
    const tagMap = new Map<string, number>();
    for (const f of app.vault.getMarkdownFiles()) {
        const cache = app.metadataCache.getFileCache(f);
        for (const t of cache?.tags || []) {
            tagMap.set(t.tag, (tagMap.get(t.tag) || 0) + 1);
        }
    }
    if (tagMap.size === 0) return '仓库中没有标签。';
    const sorted = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);
    return `仓库标签 (${tagMap.size} 个):\n\n${sorted.map(([tag, count]) => `- ${tag} (${count})`).join('\n')}`;
}

async function getProperties(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter;
    if (!fm) return `「${path}」没有 frontmatter 属性。`;

    const entries = Object.entries(fm).filter(([, v]) => v !== undefined && v !== null);
    if (entries.length === 0) return `「${path}」没有 frontmatter 属性。`;
    return `**${path}** 的属性:\n\n${entries.map(([k, v]) => `- **${k}**: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`).join('\n')}`;
}

async function countWords(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    const content = await app.vault.cachedRead(file);
    const chars = content.length;
    const charsNoSpace = content.replace(/\s/g, '').length;
    // Chinese word count: count CJK characters + non-CJK words
    const cjkChars = (content.match(/[一-鿿㐀-䶿]/g) || []).length;
    const nonCjkWords = content.replace(/[一-鿿㐀-䶿]/g, ' ').split(/\s+/).filter(Boolean).length;
    const lines = content.split('\n').length;

    return [
        `**${path}** 统计：`,
        `- 总字符数: ${chars}`,
        `- 不含空格字符数: ${charsNoSpace}`,
        `- 中文字数: ${cjkChars}`,
        `- 英文/数字词数: ${nonCjkWords}`,
        `- 估算总词数: ${cjkChars + nonCjkWords}`,
        `- 行数: ${lines}`,
    ].join('\n');
}

async function getUnresolvedLinks(app: App): Promise<string> {
    const unresolved = (app.metadataCache as any).unresolvedLinks || {};
    const result: string[] = [];
    for (const [srcPath, links] of Object.entries(unresolved)) {
        const linkMap = links as Record<string, number>;
        for (const [target, count] of Object.entries(linkMap)) {
            result.push(`- [[${target}]] (来自 ${srcPath}，${count} 次)`);
        }
    }
    if (result.length === 0) return '没有未解析链接。';
    if (result.length > 30) return `共 ${result.length} 个未解析链接，显示前30个：\n\n${result.slice(0, 30).join('\n')}`;
    return `共 ${result.length} 个未解析链接：\n\n${result.join('\n')}`;
}

async function getOrphans(app: App): Promise<string> {
    const files = app.vault.getMarkdownFiles();
    const orphans: string[] = [];

    for (const file of files) {
        const backlinks = (app.metadataCache as any).getBacklinksForFile(file);
        const keys = backlinks ? Object.keys(backlinks.data) : [];
        if (keys.length === 0) {
            orphans.push(file.path);
        }
    }

    if (orphans.length === 0) return '没有孤立文件。';
    if (orphans.length > 30) return `共 ${orphans.length} 个孤立文件，显示前30个：\n\n${orphans.slice(0, 30).map(f => `- ${f}`).join('\n')}`;
    return `共 ${orphans.length} 个孤立文件：\n\n${orphans.map(f => `- ${f}`).join('\n')}`;
}

async function getDeadends(app: App): Promise<string> {
    const files = app.vault.getMarkdownFiles();
    const deadends: string[] = [];

    for (const file of files) {
        const cache = app.metadataCache.getFileCache(file);
        const links = cache?.links?.length || 0;
        const embeds = cache?.embeds?.length || 0;
        if (links + embeds === 0) {
            deadends.push(file.path);
        }
    }

    if (deadends.length === 0) return '没有死胡同文件。';
    if (deadends.length > 30) return `共 ${deadends.length} 个死胡同文件，显示前30个：\n\n${deadends.slice(0, 30).map(f => `- ${f}`).join('\n')}`;
    return `共 ${deadends.length} 个死胡同文件：\n\n${deadends.map(f => `- ${f}`).join('\n')}`;
}

// ===== Write Implementations =====

async function createFile(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const content = String(args.content || '');

    const existing = app.vault.getAbstractFileByPath(path);
    if (existing) return `文件已存在: ${path}。如需覆盖请先删除。`;

    const dir = path.substring(0, path.lastIndexOf('/'));
    if (dir) {
        const dirExists = app.vault.getAbstractFileByPath(dir);
        if (!dirExists) await app.vault.createFolder(dir);
    }

    await app.vault.create(path, content);
    return `✅ 已创建文件: ${path} (${content.length} 字符) ⚠️ 此操作已实际执行。`;
}

async function appendFile(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const content = String(args.content || '');

    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    await app.vault.append(file, '\n' + content);
    return `✅ 已追加内容到: ${path} ⚠️ 此操作已实际执行。`;
}

async function moveFile(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));
    const to = String(args.to || '');

    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    // Determine new path
    let newPath: string;
    if (to.includes('/') || to.endsWith('.md')) {
        newPath = normalizePath(to);
    } else {
        // Moving to a folder
        const name = path.split('/').pop() || '';
        newPath = normalizePath(`${to}/${name}`);
    }

    await app.vault.rename(file, newPath);
    return `✅ 已移动: ${path} → ${newPath} ⚠️ 此操作已实际执行。`;
}

async function deleteFile(args: Record<string, unknown>, app: App): Promise<string> {
    const path = normalizePath(String(args.path || ''));

    const file = app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return `文件不存在: ${path}`;

    await app.vault.trash(file, false);
    return `✅ 已移至回收站: ${path} ⚠️ 此操作已实际执行。可在回收站中恢复。`;
}
