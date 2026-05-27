import { App, PluginSettingTab, Setting } from 'obsidian';
import type AIAgentPlugin from '../main';
import { AIProvider, PipelineStepId } from '../types';
import { DEFAULT_PIPELINE_PROMPTS, resolveApiKey } from './settings-store';

function maskKey(key: string): string {
    if (key.length <= 4) return '****';
    const show = Math.min(4, Math.floor(key.length / 4));
    return key.slice(0, show) + '*'.repeat(key.length - show * 2) + key.slice(-show);
}

const STEP_ORDER: PipelineStepId[] = ['plan', 'draft', 'polish', 'link'];

export class AIAgentSettingTab extends PluginSettingTab {
    plugin: AIAgentPlugin;

    constructor(app: App, plugin: AIAgentPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.addClass('ai-agent-settings');

        this.renderProviderSection(containerEl);
        this.renderModelSection(containerEl);
        this.renderPipelineSection(containerEl);
        this.renderUISection(containerEl);
    }

    // ===== Provider Section =====
    private renderProviderSection(el: HTMLElement): void {
        el.createEl('h2', { text: 'AI 服务商' });

        const providerList = el.createDiv({ cls: 'ai-agent-provider-list' });

        this.plugin.settings.providers.forEach((provider, index) => {
            const card = providerList.createDiv({ cls: 'ai-agent-provider-card' });
            const header = card.createDiv({ cls: 'ai-agent-provider-header' });

            header.createEl('h3', { text: provider.name });
            new Setting(card)
                .setName('启用')
                .addToggle(toggle => toggle
                    .setValue(provider.enabled)
                    .onChange(async (value) => {
                        provider.enabled = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(card)
                .setName('API 地址')
                .setDesc('兼容 OpenAI 接口格式的 Base URL')
                .addText(text => text
                    .setPlaceholder('https://api.deepseek.com')
                    .setValue(provider.baseUrl)
                    .onChange(async (value) => {
                        provider.baseUrl = value;
                        await this.plugin.saveSettings();
                    }));

            const apiKeySetting = new Setting(card)
                .setName('API Key')
                .setDesc('直接填入 Key，或使用 $环境变量名 引用环境变量（如 $DEEPSEEK_API_KEY）')
                .addText(text => {
                    text.setPlaceholder('$DEEPSEEK_API_KEY')
                        .setValue(provider.apiKey)
                        .onChange(async (value) => {
                            provider.apiKey = value;
                            await this.plugin.saveSettings();
                            const resolved = resolveApiKey(value);
                            if (resolved && value.startsWith('$')) {
                                apiKeySetting.setDesc(
                                    `环境变量 ${value.slice(1)} → ${maskKey(resolved)}`
                                );
                            } else {
                                apiKeySetting.setDesc('直接填入 Key，或使用 $环境变量名 引用环境变量（如 $DEEPSEEK_API_KEY）');
                            }
                        });
                    text.inputEl.type = 'password';
                });
            const resolved = resolveApiKey(provider.apiKey);
            if (resolved && provider.apiKey.startsWith('$')) {
                apiKeySetting.setDesc(
                    `环境变量 ${provider.apiKey.slice(1)} → ${maskKey(resolved)}`
                );
            }

            new Setting(card)
                .setName('模型列表')
                .setDesc('逗号分隔的模型名称列表')
                .addText(text => text
                    .setPlaceholder('deepseek-chat, deepseek-reasoner')
                    .setValue(provider.models.join(', '))
                    .onChange(async (value) => {
                        provider.models = value.split(',').map(m => m.trim()).filter(Boolean);
                        await this.plugin.saveSettings();
                    }));

            if (!provider.id.startsWith('builtin-')) {
                new Setting(card)
                    .setName('删除服务商')
                    .addButton(btn => btn
                        .setButtonText('删除')
                        .setWarning()
                        .onClick(async () => {
                            this.plugin.settings.providers.splice(index, 1);
                            if (this.plugin.settings.defaultProvider === provider.id) {
                                this.plugin.settings.defaultProvider = this.plugin.settings.providers[0]?.id || '';
                            }
                            await this.plugin.saveSettings();
                            this.display();
                        }));
            }
        });

        new Setting(el)
            .setName('添加服务商')
            .setDesc('添加兼容 OpenAI API 格式的自定义服务商')
            .addButton(btn => btn
                .setButtonText('添加')
                .onClick(() => {
                    const newProvider: AIProvider = {
                        id: `custom-${Date.now()}`,
                        name: '新服务商',
                        baseUrl: 'https://api.example.com/v1',
                        apiKey: '',
                        models: ['gpt-3.5-turbo'],
                        enabled: false,
                    };
                    this.plugin.settings.providers.push(newProvider);
                    this.plugin.saveSettings();
                    this.display();
                }));
    }

    // ===== Model Section =====
    private renderModelSection(el: HTMLElement): void {
        el.createEl('h2', { text: '模型参数' });

        const enabledProviders = this.plugin.settings.providers.filter(p => p.enabled);

        new Setting(el)
            .setName('默认服务商')
            .addDropdown(dropdown => {
                enabledProviders.forEach(p => dropdown.addOption(p.id, p.name));
                if (enabledProviders.length === 0) {
                    dropdown.addOption('', '（无可用服务商）');
                }
                dropdown.setValue(this.plugin.settings.defaultProvider)
                    .onChange(async (value) => {
                        this.plugin.settings.defaultProvider = value;
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });

        const currentProvider = enabledProviders.find(p => p.id === this.plugin.settings.defaultProvider);

        new Setting(el)
            .setName('默认模型')
            .setDesc('Auto = 自动选择 Pro（复杂任务）或 Flash（简单任务）')
            .addDropdown(dropdown => {
                dropdown.addOption('auto', 'Auto - 自动选择');
                if (currentProvider) {
                    currentProvider.models.forEach(m => dropdown.addOption(m, m));
                }
                dropdown.setValue(this.plugin.settings.defaultModel || 'auto')
                    .onChange(async (value) => {
                        this.plugin.settings.defaultModel = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(el)
            .setName('Temperature')
            .setDesc('控制生成随机性，0=确定性，2=最大随机性')
            .addSlider(slider => slider
                .setLimits(0, 2, 0.05)
                .setValue(this.plugin.settings.temperature)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.temperature = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(el)
            .setName('Top P')
            .setDesc('核采样参数，0-1')
            .addSlider(slider => slider
                .setLimits(0, 1, 0.05)
                .setValue(this.plugin.settings.topP)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.topP = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(el)
            .setName('请求超时（秒）')
            .addText(text => text
                .setPlaceholder('120')
                .setValue(String(this.plugin.settings.requestTimeout))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num > 0) {
                        this.plugin.settings.requestTimeout = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(el)
            .setName('失败重试次数')
            .addText(text => text
                .setPlaceholder('3')
                .setValue(String(this.plugin.settings.maxRetries))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 0) {
                        this.plugin.settings.maxRetries = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(el)
            .setName('Mermaid 最大修复次数')
            .setDesc('润色时 Mermaid 图表编译失败后，LLM 最多尝试修复几次（设为 0 则不修复直接移除）')
            .addText(text => text
                .setPlaceholder('3')
                .setValue(String(this.plugin.settings.mermaidMaxFixes))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 0 && num <= 10) {
                        this.plugin.settings.mermaidMaxFixes = num;
                        await this.plugin.saveSettings();
                    }
                }));
    }

    // ===== Pipeline Section =====
    private renderPipelineSection(el: HTMLElement): void {
        el.createEl('h2', { text: '流水线 Prompt 配置' });
        el.createEl('p', { text: '每个步骤使用独立 Prompt，支持变量替换。修改后可自定义 AI 在各步骤的行为。' });

        const varHelp = el.createDiv({ cls: 'ai-agent-pipeline-vars' });
        varHelp.createEl('p', { text: '可用变量：' });
        const vars = varHelp.createEl('ul');
        vars.createEl('li', { text: '{{user_input}} — 用户原始输入' });
        vars.createEl('li', { text: '{{article_title}} — 当前文章标题' });
        vars.createEl('li', { text: '{{article_topic}} — 当前文章主题' });
        vars.createEl('li', { text: '{{article_outline}} — 当前文章大纲（计划步骤生成）' });
        vars.createEl('li', { text: '{{article_path}} — 当前文章路径' });
        vars.createEl('li', { text: '{{draft_content}} — 当前文章内容（润色步骤）' });
        vars.createEl('li', { text: '{{vault_structure}} — 仓库目录结构（计划步骤自动注入）' });
        vars.createEl('li', { text: '{{vault_context}} — 本地知识库相关内容（仅关联创作模式）' });
        vars.createEl('li', { text: '{{all_articles}} — 所有文章路径和内容（链接步骤）' });

        const prompts = this.plugin.settings.pipelinePrompts;

        for (const stepId of STEP_ORDER) {
            const config = prompts[stepId];
            if (!config) continue;

            const section = el.createDiv({ cls: 'ai-agent-pipeline-step' });
            const header = section.createDiv({ cls: 'ai-agent-pipeline-step-header' });

            header.createEl('h3', { text: `${config.name} — ${config.description}` });

            new Setting(section)
                .setName('启用此步骤')
                .addToggle(toggle => toggle
                    .setValue(config.enabled)
                    .onChange(async (value) => {
                        config.enabled = value;
                        await this.plugin.saveSettings();
                    }));

            const textAreaContainer = section.createDiv({ cls: 'ai-agent-textarea-container' });
            const textArea = textAreaContainer.createEl('textarea', {
                cls: 'ai-agent-pipeline-textarea',
                attr: { rows: '14' },
            });
            textArea.value = config.promptTemplate;

            let saveTimeout: ReturnType<typeof setTimeout>;
            textArea.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(async () => {
                    config.promptTemplate = textArea.value;
                    await this.plugin.saveSettings();
                }, 500);
            });

            // Reset to default button
            new Setting(section)
                .setName('重置为默认')
                .addButton(btn => btn
                    .setButtonText('重置')
                    .onClick(async () => {
                        const defaults = DEFAULT_PIPELINE_PROMPTS;
                        if (defaults[stepId]) {
                            config.promptTemplate = defaults[stepId].promptTemplate;
                            textArea.value = config.promptTemplate;
                            await this.plugin.saveSettings();
                        }
                    }));
        }
    }

    // ===== UI Section =====
    private renderUISection(el: HTMLElement): void {
        el.createEl('h2', { text: '界面设置' });

        new Setting(el)
            .setName('字体大小')
            .addDropdown(dropdown => {
                dropdown.addOption('small', '小');
                dropdown.addOption('medium', '中');
                dropdown.addOption('large', '大');
                dropdown.setValue(this.plugin.settings.fontSize)
                    .onChange(async (value) => {
                        this.plugin.settings.fontSize = value as any;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(el)
            .setName('创作模式')
            .setDesc('独立创作：AI 基于自身知识生成。关联创作：AI 检索并参考本地知识库中的相关内容。')
            .addDropdown(dropdown => {
                dropdown.addOption('independent', '独立创作');
                dropdown.addOption('connected', '关联创作');
                dropdown.setValue(this.plugin.settings.creationMode)
                    .onChange(async (value) => {
                        this.plugin.settings.creationMode = value as 'independent' | 'connected';
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(el)
            .setName('显示费用信息')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showCostInfo)
                .onChange(async (value) => {
                    this.plugin.settings.showCostInfo = value;
                    await this.plugin.saveSettings();
                }));
    }
}
