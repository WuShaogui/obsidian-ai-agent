"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AIAgentPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/settings/settings-store.ts
var PLAN_PROMPT = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u5185\u5BB9\u7B56\u5212\u4E13\u5BB6\u3002\u5206\u6790\u7528\u6237\u9700\u6C42\uFF0C\u5224\u65AD\u9700\u8981\u751F\u6210\u51E0\u7BC7\u6587\u7AE0\u3002

\u7528\u6237\u9700\u6C42\uFF1A{{user_input}}

\u89C4\u5219\uFF1A
- \u5982\u679C\u7528\u6237\u660E\u786E\u8BF4"\u591A\u7BC7"\u3001"N\u7BC7"\u3001"\u51E0\u7BC7"\uFF0C\u6216\u8005\u9700\u6C42\u672C\u8EAB\u9002\u5408\u62C6\u5206\u4E3A\u591A\u7BC7\u72EC\u7ACB\u6587\u7AE0\uFF0C\u5219\u8F93\u51FA\u591A\u7BC7\u6587\u7AE0\u7684\u8BA1\u5212
- \u5982\u679C\u7528\u6237\u9700\u6C42\u53EF\u4EE5\uFF08\u4E14\u5E94\u8BE5\uFF09\u7528\u4E00\u7BC7\u5B8C\u6574\u7684\u6587\u7AE0\u8986\u76D6\uFF0C\u5219\u8F93\u51FA\u5355\u7BC7\u6587\u7AE0
- \u6BCF\u7BC7\u6587\u7AE0\u90FD\u9700\u8981\uFF1A\u6807\u9898\u3001\u6587\u4EF6\u8DEF\u5F84\u3001\u4E3B\u9898\u6982\u8FF0

\u4EE5 JSON \u6570\u7EC4\u683C\u5F0F\u8F93\u51FA\uFF0C\u4E0D\u8981\u6709\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\uFF1A
[{"title": "\u6587\u7AE0\u6807\u9898", "path": "\u76EE\u5F55/\u6587\u4EF6\u540D.md", "topic": "\u4E00\u53E5\u8BDD\u63CF\u8FF0\u6587\u7AE0\u6838\u5FC3\u5185\u5BB9"}]`;
var DRAFT_PROMPT = `\u4F60\u662F\u4E00\u4F4D\u8D44\u6DF1\u6280\u672F\u6587\u6863\u64B0\u5199\u4E13\u5BB6\u3002\u6839\u636E\u4E0B\u9762\u63D0\u4F9B\u7684\u4E3B\u9898\u548C\u7528\u6237\u9700\u6C42\uFF0C\u64B0\u5199\u4E00\u7BC7\u5B8C\u6574\u7684 Markdown \u6587\u7AE0\u3002

\u6587\u7AE0\u6807\u9898\uFF1A{{article_title}}
\u6587\u7AE0\u4E3B\u9898\uFF1A{{article_topic}}
\u7528\u6237\u539F\u59CB\u9700\u6C42\uFF1A{{user_input}}

\u5199\u4F5C\u8981\u6C42\uFF1A
1. \u5408\u7406\u4F7F\u7528\u6807\u9898\u5C42\u7EA7\uFF08# \u2192 ## \u2192 ###\uFF09\uFF0C\u7ED3\u6784\u6E05\u6670
2. \u5185\u5BB9\u4E30\u5BCC\u8BE6\u5B9E\uFF0C\u63D0\u4F9B\u5177\u4F53\u793A\u4F8B\u548C\u4EE3\u7801\u7247\u6BB5\uFF08\u5982\u9002\u7528\uFF09
3. \u8BED\u8A00\u4E13\u4E1A\u4F46\u6613\u61C2\uFF0C\u7528\u4E2D\u6587\u4E66\u5199
4. \u4F7F\u7528 Markdown \u6807\u51C6\u683C\u5F0F\uFF0C\u4EE3\u7801\u5757\u6807\u6CE8\u8BED\u8A00\u7C7B\u578B
5. \u5982\u6709\u5FC5\u8981\uFF0C\u4F7F\u7528\u8868\u683C\u6574\u7406\u5BF9\u6BD4\u4FE1\u606F

\u76F4\u63A5\u8F93\u51FA\u6587\u7AE0\u6B63\u6587\uFF0C\u4E0D\u8981\u52A0"\u8FD9\u662F\u751F\u6210\u7684\u6587\u7AE0"\u4E4B\u7C7B\u7684\u524D\u7F00\u3002`;
var POLISH_PROMPT = `\u4F60\u662F\u4E00\u4F4D\u6587\u6863\u7F8E\u5316\u4E0E\u77E5\u8BC6\u53EF\u89C6\u5316\u4E13\u5BB6\u3002\u5BF9\u4EE5\u4E0B\u6587\u7AE0\u8FDB\u884C\u6DA6\u8272\u548C\u589E\u5F3A\u3002

\u6587\u7AE0\u6807\u9898\uFF1A{{article_title}}
\u6587\u7AE0\u8DEF\u5F84\uFF1A{{article_path}}

\u539F\u6587\u5185\u5BB9\uFF1A
{{draft_content}}

\u6DA6\u8272\u8981\u6C42\uFF1A
1. \u5728\u5408\u9002\u4F4D\u7F6E\u63D2\u5165 mindmap \u601D\u7EF4\u5BFC\u56FE\uFF08\`\`\`mermaid mindmap ... \`\`\`\uFF09\uFF0C\u5E2E\u52A9\u8BFB\u8005\u5FEB\u901F\u628A\u63E1\u6587\u7AE0\u7ED3\u6784
2. \u5728\u5408\u9002\u4F4D\u7F6E\u63D2\u5165 Mermaid \u56FE\u8868\uFF08flowchart/sequenceDiagram/classDiagram/gantt/pie \u7B49\uFF09\uFF0C\u5C06\u6587\u5B57\u63CF\u8FF0\u8F6C\u4E3A\u53EF\u89C6\u5316
3. \u5728\u91CD\u70B9\u3001\u6CE8\u610F\u3001\u63D0\u793A\u3001\u8B66\u544A\u5904\u6DFB\u52A0 Obsidian callout \u5757\uFF08> [!note]\u3001> [!tip]\u3001> [!warning]\u3001> [!important]\u3001> [!info] \u7B49\uFF09
4. \u4F18\u5316\u6392\u7248\uFF1A\u6BB5\u843D\u957F\u77ED\u9002\u4E2D\uFF0C\u5217\u8868\u683C\u5F0F\u6E05\u6670\uFF0C\u5F15\u7528\u548C\u5F3A\u8C03\u5F97\u5F53
5. \u4FDD\u6301\u539F\u6587\u7684\u6838\u5FC3\u4FE1\u606F\u548C\u7ED3\u6784\u4E0D\u53D8

\u76F4\u63A5\u8F93\u51FA\u6DA6\u8272\u540E\u7684\u5B8C\u6574\u6587\u7AE0\u3002`;
var CHECK_PROMPT = `\u4F60\u662F\u4E00\u4F4D Markdown \u8BED\u6CD5\u68C0\u67E5\u4E13\u5BB6\u3002\u4ED4\u7EC6\u68C0\u67E5\u4EE5\u4E0B\u6587\u7AE0\u7684\u8BED\u6CD5\u95EE\u9898\u5E76\u4FEE\u590D\u3002

\u6587\u7AE0\u8DEF\u5F84\uFF1A{{article_path}}

\u539F\u6587\u5185\u5BB9\uFF1A
{{draft_content}}

\u68C0\u67E5\u6E05\u5355\uFF1A
1. \u6807\u9898\u5C42\u7EA7\u662F\u5426\u8FDE\u7EED\uFF08\u4E0D\u8DF3\u7EA7\uFF0C\u5982 # \u540E\u76F4\u63A5 ### \u9700\u8981\u4FEE\u6B63\uFF09
2. \u4EE3\u7801\u5757\u662F\u5426\u6B63\u786E\u95ED\u5408\uFF08\`\`\` \u662F\u5426\u6210\u5BF9\u51FA\u73B0\uFF0C\u8BED\u8A00\u6807\u6CE8\u662F\u5426\u9057\u6F0F\uFF09
3. Mermaid \u56FE\u8868\u8BED\u6CD5\u662F\u5426\u6B63\u786E\uFF08mindmap \u7F29\u8FDB\u3001flowchart \u7BAD\u5934\u3001\u8282\u70B9\u5B9A\u4E49\u7B49\uFF09
4. Callout \u8BED\u6CD5\u662F\u5426\u6B63\u786E\uFF08> [!type] \u683C\u5F0F\u3001\u6807\u9898\u884C\u3001\u5185\u5BB9\u7F29\u8FDB\uFF09
5. \u8868\u683C\u683C\u5F0F\u662F\u5426\u6B63\u786E\uFF08\u5217\u5BF9\u9F50\u3001\u5206\u9694\u884C |---|---|\uFF09
6. \u5185\u90E8\u94FE\u63A5\u683C\u5F0F\u662F\u5426\u89C4\u8303\uFF08[[wikilink]] \u683C\u5F0F\uFF09
7. \u6709\u65E0\u660E\u663E\u7684 Markdown \u683C\u5F0F\u9519\u8BEF\uFF08\u5217\u8868\u7F29\u8FDB\u3001\u52A0\u7C97/\u659C\u4F53\u672A\u95ED\u5408\u7B49\uFF09

\u5982\u53D1\u73B0\u95EE\u9898\uFF0C\u76F4\u63A5\u4FEE\u590D\u540E\u8F93\u51FA\u5B8C\u6574\u6587\u7AE0\u3002\u5982\u65E0\u95EE\u9898\uFF0C\u8F93\u51FA\u539F\u6587\u4E0D\u53D8\u3002`;
var LINK_PROMPT = `\u4F60\u662F\u4E00\u4F4D\u77E5\u8BC6\u7BA1\u7406\u4E13\u5BB6\u3002\u4E3A\u4E00\u7EC4\u7CFB\u5217\u6587\u7AE0\u6DFB\u52A0\u76F8\u4E92\u4E4B\u95F4\u7684\u4EA4\u53C9\u5F15\u7528\u94FE\u63A5\u3002

\u6240\u6709\u6587\u7AE0\u7684\u8DEF\u5F84\u548C\u5185\u5BB9\uFF1A
{{all_articles}}

\u8981\u6C42\uFF1A
1. \u5728\u6BCF\u7BC7\u6587\u7AE0\u7684\u6B63\u6587\u4E2D\uFF0C\u9047\u5230\u5176\u4ED6\u6587\u7AE0\u8986\u76D6\u7684\u4E3B\u9898\u65F6\uFF0C\u81EA\u7136\u5730\u5728\u6587\u5B57\u4E2D\u6DFB\u52A0 [[\u5176\u4ED6\u6587\u7AE0\u8DEF\u5F84|\u663E\u793A\u6587\u5B57]] \u7684\u5185\u90E8\u94FE\u63A5
2. \u5728\u6BCF\u7BC7\u6587\u7AE0\u672B\u5C3E\u6DFB\u52A0"## \u76F8\u5173\u6587\u7AE0"\u90E8\u5206\uFF0C\u5217\u51FA\u6307\u5411\u5176\u4ED6\u6587\u7AE0\u7684\u94FE\u63A5\u5E76\u9644\u7B80\u8981\u8BF4\u660E
3. \u94FE\u63A5\u5E94\u5F53\u81EA\u7136\u3001\u6709\u610F\u4E49\uFF0C\u4E0D\u5F3A\u884C\u63D2\u5165
4. \u4E0D\u4FEE\u6539\u6587\u7AE0\u7684\u5B9E\u8D28\u5185\u5BB9\uFF08\u9664\u6DFB\u52A0\u94FE\u63A5\u5916\uFF09

\u8BF7\u8F93\u51FA\u4FEE\u6539\u540E\u7684\u6240\u6709\u6587\u7AE0\uFF0C\u683C\u5F0F\u5982\u4E0B\uFF1A
---FILE:\u8DEF\u5F841---
\u4FEE\u6539\u540E\u7684\u5185\u5BB91
---FILE:\u8DEF\u5F842---
\u4FEE\u6539\u540E\u7684\u5185\u5BB92`;
var DEFAULT_PIPELINE_PROMPTS = {
  plan: {
    id: "plan",
    name: "\u751F\u6210\u8BA1\u5212",
    description: "\u5206\u6790\u7528\u6237\u9700\u6C42\uFF0C\u751F\u6210\u591A\u7BC7\u6587\u7AE0\u7684\u4E3B\u9898\u3001\u8DEF\u5F84\u548C\u6982\u8FF0\uFF08\u4EC5\u591A\u7BC7\u65F6\u6267\u884C\uFF09",
    promptTemplate: PLAN_PROMPT,
    enabled: true
  },
  draft: {
    id: "draft",
    name: "\u751F\u6210\u8349\u7A3F",
    description: "\u6839\u636E\u4E3B\u9898\u751F\u6210\u6587\u7AE0\u521D\u7A3F",
    promptTemplate: DRAFT_PROMPT,
    enabled: true
  },
  polish: {
    id: "polish",
    name: "\u6DA6\u8272\u589E\u5F3A",
    description: "\u6DFB\u52A0 mindmap\u3001Mermaid \u56FE\u8868\u3001callout \u63D0\u793A\u5757",
    promptTemplate: POLISH_PROMPT,
    enabled: true
  },
  check: {
    id: "check",
    name: "\u8BED\u6CD5\u68C0\u67E5",
    description: "\u68C0\u67E5\u5E76\u4FEE\u590D Markdown \u8BED\u6CD5\u95EE\u9898",
    promptTemplate: CHECK_PROMPT,
    enabled: true
  },
  link: {
    id: "link",
    name: "\u6587\u7AE0\u94FE\u63A5",
    description: "\u5728\u591A\u7BC7\u6587\u7AE0\u4E4B\u95F4\u6DFB\u52A0 [[wikilink]] \u76F8\u4E92\u5F15\u7528",
    promptTemplate: LINK_PROMPT,
    enabled: true
  }
};
var DEFAULT_SETTINGS = {
  providers: [
    {
      id: "deepseek",
      name: "DeepSeek",
      baseUrl: "https://api.deepseek.com",
      apiKey: "$DEEPSEEK_API_KEY",
      models: ["deepseek-v4-pro", "deepseek-v4-flash"],
      enabled: true
    },
    {
      id: "openai",
      name: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      apiKey: "$OPENAI_API_KEY",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
      enabled: false
    }
  ],
  defaultProvider: "deepseek",
  defaultModel: "auto",
  temperature: 0.7,
  topP: 1,
  maxTokens: 4096,
  contextWindowSize: 50,
  showThinking: false,
  showCostInfo: true,
  fontSize: "medium",
  maxRetries: 3,
  requestTimeout: 120,
  compressThreshold: 5e4,
  pipelinePrompts: DEFAULT_PIPELINE_PROMPTS,
  mcpServers: []
};
function resolveApiKey(apiKey) {
  var _a;
  if (apiKey.startsWith("$")) {
    const envVar = apiKey.slice(1);
    return typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a[envVar]) || "";
  }
  return apiKey;
}

// src/settings/settings-tab.ts
var import_obsidian = require("obsidian");
var STEP_ORDER = ["plan", "draft", "polish", "check", "link"];
var AIAgentSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("ai-agent-settings");
    this.renderProviderSection(containerEl);
    this.renderModelSection(containerEl);
    this.renderPipelineSection(containerEl);
    this.renderMCPSection(containerEl);
    this.renderUISection(containerEl);
  }
  // ===== Provider Section =====
  renderProviderSection(el) {
    el.createEl("h2", { text: "AI \u670D\u52A1\u5546" });
    const providerList = el.createDiv({ cls: "ai-agent-provider-list" });
    this.plugin.settings.providers.forEach((provider, index) => {
      const card = providerList.createDiv({ cls: "ai-agent-provider-card" });
      const header = card.createDiv({ cls: "ai-agent-provider-header" });
      header.createEl("h3", { text: provider.name });
      new import_obsidian.Setting(card).setName("\u542F\u7528").addToggle((toggle) => toggle.setValue(provider.enabled).onChange(async (value) => {
        provider.enabled = value;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(card).setName("API \u5730\u5740").setDesc("\u517C\u5BB9 OpenAI \u63A5\u53E3\u683C\u5F0F\u7684 Base URL").addText((text) => text.setPlaceholder("https://api.deepseek.com").setValue(provider.baseUrl).onChange(async (value) => {
        provider.baseUrl = value;
        await this.plugin.saveSettings();
      }));
      const apiKeySetting = new import_obsidian.Setting(card).setName("API Key").setDesc("\u76F4\u63A5\u586B\u5165 Key\uFF0C\u6216\u4F7F\u7528 $\u73AF\u5883\u53D8\u91CF\u540D \u5F15\u7528\u73AF\u5883\u53D8\u91CF\uFF08\u5982 $DEEPSEEK_API_KEY\uFF09").addText((text) => {
        text.setPlaceholder("$DEEPSEEK_API_KEY").setValue(provider.apiKey).onChange(async (value) => {
          provider.apiKey = value;
          await this.plugin.saveSettings();
          const resolved2 = resolveApiKey(value);
          if (resolved2 && value.startsWith("$")) {
            apiKeySetting.setDesc(
              `\u73AF\u5883\u53D8\u91CF ${value.slice(1)} \u2192 ${resolved2.slice(0, 4)}${"*".repeat(Math.min(resolved2.length - 8, 20))}${resolved2.slice(-4)}`
            );
          } else {
            apiKeySetting.setDesc("\u76F4\u63A5\u586B\u5165 Key\uFF0C\u6216\u4F7F\u7528 $\u73AF\u5883\u53D8\u91CF\u540D \u5F15\u7528\u73AF\u5883\u53D8\u91CF\uFF08\u5982 $DEEPSEEK_API_KEY\uFF09");
          }
        });
        text.inputEl.type = "password";
      });
      const resolved = resolveApiKey(provider.apiKey);
      if (resolved && provider.apiKey.startsWith("$")) {
        apiKeySetting.setDesc(
          `\u73AF\u5883\u53D8\u91CF ${provider.apiKey.slice(1)} \u2192 ${resolved.slice(0, 4)}${"*".repeat(Math.min(resolved.length - 8, 20))}${resolved.slice(-4)}`
        );
      }
      new import_obsidian.Setting(card).setName("\u6A21\u578B\u5217\u8868").setDesc("\u9017\u53F7\u5206\u9694\u7684\u6A21\u578B\u540D\u79F0\u5217\u8868").addText((text) => text.setPlaceholder("deepseek-chat, deepseek-reasoner").setValue(provider.models.join(", ")).onChange(async (value) => {
        provider.models = value.split(",").map((m) => m.trim()).filter(Boolean);
        await this.plugin.saveSettings();
      }));
      if (!provider.id.startsWith("builtin-")) {
        new import_obsidian.Setting(card).setName("\u5220\u9664\u670D\u52A1\u5546").addButton((btn) => btn.setButtonText("\u5220\u9664").setWarning().onClick(async () => {
          var _a;
          this.plugin.settings.providers.splice(index, 1);
          if (this.plugin.settings.defaultProvider === provider.id) {
            this.plugin.settings.defaultProvider = ((_a = this.plugin.settings.providers[0]) == null ? void 0 : _a.id) || "";
          }
          await this.plugin.saveSettings();
          this.display();
        }));
      }
    });
    new import_obsidian.Setting(el).setName("\u6DFB\u52A0\u670D\u52A1\u5546").setDesc("\u6DFB\u52A0\u517C\u5BB9 OpenAI API \u683C\u5F0F\u7684\u81EA\u5B9A\u4E49\u670D\u52A1\u5546").addButton((btn) => btn.setButtonText("\u6DFB\u52A0").onClick(() => {
      const newProvider = {
        id: `custom-${Date.now()}`,
        name: "\u65B0\u670D\u52A1\u5546",
        baseUrl: "https://api.example.com/v1",
        apiKey: "",
        models: ["gpt-3.5-turbo"],
        enabled: false
      };
      this.plugin.settings.providers.push(newProvider);
      this.plugin.saveSettings();
      this.display();
    }));
  }
  // ===== Model Section =====
  renderModelSection(el) {
    el.createEl("h2", { text: "\u6A21\u578B\u53C2\u6570" });
    const enabledProviders = this.plugin.settings.providers.filter((p) => p.enabled);
    new import_obsidian.Setting(el).setName("\u9ED8\u8BA4\u670D\u52A1\u5546").addDropdown((dropdown) => {
      enabledProviders.forEach((p) => dropdown.addOption(p.id, p.name));
      if (enabledProviders.length === 0) {
        dropdown.addOption("", "\uFF08\u65E0\u53EF\u7528\u670D\u52A1\u5546\uFF09");
      }
      dropdown.setValue(this.plugin.settings.defaultProvider).onChange(async (value) => {
        this.plugin.settings.defaultProvider = value;
        await this.plugin.saveSettings();
        this.display();
      });
    });
    const currentProvider = enabledProviders.find((p) => p.id === this.plugin.settings.defaultProvider);
    new import_obsidian.Setting(el).setName("\u9ED8\u8BA4\u6A21\u578B").setDesc("Auto = \u81EA\u52A8\u9009\u62E9 Pro\uFF08\u590D\u6742\u4EFB\u52A1\uFF09\u6216 Flash\uFF08\u7B80\u5355\u4EFB\u52A1\uFF09").addDropdown((dropdown) => {
      dropdown.addOption("auto", "Auto - \u81EA\u52A8\u9009\u62E9");
      if (currentProvider) {
        currentProvider.models.forEach((m) => dropdown.addOption(m, m));
      }
      dropdown.setValue(this.plugin.settings.defaultModel || "auto").onChange(async (value) => {
        this.plugin.settings.defaultModel = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(el).setName("Temperature").setDesc("\u63A7\u5236\u751F\u6210\u968F\u673A\u6027\uFF0C0=\u786E\u5B9A\u6027\uFF0C2=\u6700\u5927\u968F\u673A\u6027").addSlider((slider) => slider.setLimits(0, 2, 0.05).setValue(this.plugin.settings.temperature).setDynamicTooltip().onChange(async (value) => {
      this.plugin.settings.temperature = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(el).setName("Top P").setDesc("\u6838\u91C7\u6837\u53C2\u6570\uFF0C0-1").addSlider((slider) => slider.setLimits(0, 1, 0.05).setValue(this.plugin.settings.topP).setDynamicTooltip().onChange(async (value) => {
      this.plugin.settings.topP = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(el).setName("\u6700\u5927 Token \u6570").setDesc("\u6BCF\u6B21\u751F\u6210\u7684\u6700\u5927 Token \u6570\u91CF").addText((text) => text.setPlaceholder("4096").setValue(String(this.plugin.settings.maxTokens)).onChange(async (value) => {
      const num = parseInt(value);
      if (!isNaN(num) && num > 0) {
        this.plugin.settings.maxTokens = num;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian.Setting(el).setName("\u8BF7\u6C42\u8D85\u65F6\uFF08\u79D2\uFF09").addText((text) => text.setPlaceholder("120").setValue(String(this.plugin.settings.requestTimeout)).onChange(async (value) => {
      const num = parseInt(value);
      if (!isNaN(num) && num > 0) {
        this.plugin.settings.requestTimeout = num;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian.Setting(el).setName("\u5931\u8D25\u91CD\u8BD5\u6B21\u6570").addText((text) => text.setPlaceholder("3").setValue(String(this.plugin.settings.maxRetries)).onChange(async (value) => {
      const num = parseInt(value);
      if (!isNaN(num) && num >= 0) {
        this.plugin.settings.maxRetries = num;
        await this.plugin.saveSettings();
      }
    }));
  }
  // ===== Pipeline Section =====
  renderPipelineSection(el) {
    el.createEl("h2", { text: "\u6D41\u6C34\u7EBF Prompt \u914D\u7F6E" });
    el.createEl("p", { text: "\u6BCF\u4E2A\u6B65\u9AA4\u4F7F\u7528\u72EC\u7ACB Prompt\uFF0C\u652F\u6301\u53D8\u91CF\u66FF\u6362\u3002\u4FEE\u6539\u540E\u53EF\u81EA\u5B9A\u4E49 AI \u5728\u5404\u6B65\u9AA4\u7684\u884C\u4E3A\u3002" });
    const varHelp = el.createDiv({ cls: "ai-agent-pipeline-vars" });
    varHelp.createEl("p", { text: "\u53EF\u7528\u53D8\u91CF\uFF1A" });
    const vars = varHelp.createEl("ul");
    vars.createEl("li", { text: "{{user_input}} \u2014 \u7528\u6237\u539F\u59CB\u8F93\u5165" });
    vars.createEl("li", { text: "{{article_title}} \u2014 \u5F53\u524D\u6587\u7AE0\u6807\u9898" });
    vars.createEl("li", { text: "{{article_topic}} \u2014 \u5F53\u524D\u6587\u7AE0\u4E3B\u9898" });
    vars.createEl("li", { text: "{{article_path}} \u2014 \u5F53\u524D\u6587\u7AE0\u8DEF\u5F84" });
    vars.createEl("li", { text: "{{draft_content}} \u2014 \u5F53\u524D\u6587\u7AE0\u5185\u5BB9\uFF08\u6DA6\u8272/\u68C0\u67E5\u6B65\u9AA4\uFF09" });
    vars.createEl("li", { text: "{{all_articles}} \u2014 \u6240\u6709\u6587\u7AE0\u8DEF\u5F84\u548C\u5185\u5BB9\uFF08\u94FE\u63A5\u6B65\u9AA4\uFF09" });
    const prompts = this.plugin.settings.pipelinePrompts;
    for (const stepId of STEP_ORDER) {
      const config = prompts[stepId];
      if (!config)
        continue;
      const section = el.createDiv({ cls: "ai-agent-pipeline-step" });
      const header = section.createDiv({ cls: "ai-agent-pipeline-step-header" });
      header.createEl("h3", { text: `${config.name} \u2014 ${config.description}` });
      new import_obsidian.Setting(section).setName("\u542F\u7528\u6B64\u6B65\u9AA4").addToggle((toggle) => toggle.setValue(config.enabled).onChange(async (value) => {
        config.enabled = value;
        await this.plugin.saveSettings();
      }));
      const textAreaContainer = section.createDiv({ cls: "ai-agent-textarea-container" });
      const textArea = textAreaContainer.createEl("textarea", {
        cls: "ai-agent-pipeline-textarea",
        attr: { rows: "14" }
      });
      textArea.value = config.promptTemplate;
      let saveTimeout;
      textArea.addEventListener("input", () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
          config.promptTemplate = textArea.value;
          await this.plugin.saveSettings();
        }, 500);
      });
      new import_obsidian.Setting(section).setName("\u91CD\u7F6E\u4E3A\u9ED8\u8BA4").addButton((btn) => btn.setButtonText("\u91CD\u7F6E").onClick(async () => {
        const defaults = DEFAULT_PIPELINE_PROMPTS;
        if (defaults[stepId]) {
          config.promptTemplate = defaults[stepId].promptTemplate;
          textArea.value = config.promptTemplate;
          await this.plugin.saveSettings();
        }
      }));
    }
  }
  // ===== MCP Section =====
  renderMCPSection(el) {
    el.createEl("h2", { text: "MCP \u670D\u52A1\u5668" });
    el.createEl("p", { text: "\u914D\u7F6E Model Context Protocol \u670D\u52A1\u5668\u4EE5\u6269\u5C55\u5DE5\u5177\u80FD\u529B\u3002" });
    const serverList = el.createDiv({ cls: "ai-agent-mcp-list" });
    this.plugin.settings.mcpServers.forEach((server, index) => {
      const card = serverList.createDiv({ cls: "ai-agent-mcp-card" });
      card.createEl("h3", { text: server.name });
      new import_obsidian.Setting(card).setName("\u542F\u7528").addToggle((toggle) => toggle.setValue(server.enabled).onChange(async (value) => {
        server.enabled = value;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(card).setName("\u547D\u4EE4").addText((text) => text.setPlaceholder("npx").setValue(server.command).onChange(async (value) => {
        server.command = value;
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(card).setName("\u53C2\u6570").setDesc("\u7A7A\u683C\u5206\u9694\u7684\u53C2\u6570\u5217\u8868").addText((text) => text.setPlaceholder("-y @modelcontextprotocol/server-filesystem /path").setValue(server.args.join(" ")).onChange(async (value) => {
        server.args = value.split(" ").filter(Boolean);
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(card).setName("\u73AF\u5883\u53D8\u91CF").setDesc("\u683C\u5F0F\uFF1AKEY1=VALUE1,KEY2=VALUE2").addText((text) => text.setValue(
        Object.entries(server.env || {}).map(([k, v]) => `${k}=${v}`).join(", ")
      ).onChange(async (value) => {
        server.env = {};
        value.split(",").forEach((pair) => {
          const [k, v] = pair.split("=");
          if (k && v)
            server.env[k.trim()] = v.trim();
        });
        await this.plugin.saveSettings();
      }));
      new import_obsidian.Setting(card).setName("\u5220\u9664").addButton((btn) => btn.setButtonText("\u5220\u9664").setWarning().onClick(async () => {
        this.plugin.settings.mcpServers.splice(index, 1);
        await this.plugin.saveSettings();
        this.display();
      }));
    });
    new import_obsidian.Setting(el).setName("\u6DFB\u52A0 MCP \u670D\u52A1\u5668").addButton((btn) => btn.setButtonText("\u6DFB\u52A0").onClick(() => {
      const newServer = {
        id: `mcp-${Date.now()}`,
        name: "\u65B0 MCP \u670D\u52A1\u5668",
        command: "npx",
        args: [],
        enabled: false
      };
      this.plugin.settings.mcpServers.push(newServer);
      this.plugin.saveSettings();
      this.display();
    }));
  }
  // ===== UI Section =====
  renderUISection(el) {
    el.createEl("h2", { text: "\u754C\u9762\u8BBE\u7F6E" });
    new import_obsidian.Setting(el).setName("\u5B57\u4F53\u5927\u5C0F").addDropdown((dropdown) => {
      dropdown.addOption("small", "\u5C0F");
      dropdown.addOption("medium", "\u4E2D");
      dropdown.addOption("large", "\u5927");
      dropdown.setValue(this.plugin.settings.fontSize).onChange(async (value) => {
        this.plugin.settings.fontSize = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(el).setName("\u663E\u793A\u8D39\u7528\u4FE1\u606F").addToggle((toggle) => toggle.setValue(this.plugin.settings.showCostInfo).onChange(async (value) => {
      this.plugin.settings.showCostInfo = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/view/chat-view.ts
var import_obsidian2 = require("obsidian");
var VIEW_TYPE_AI_CHAT = "ai-agent-chat-view";
var STEP_LABELS = {
  plan: "\u8BA1\u5212",
  draft: "\u8349\u7A3F",
  polish: "\u6DA6\u8272",
  check: "\u68C0\u67E5",
  link: "\u94FE\u63A5"
};
var ChatView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    // Input history
    this.sentMessages = [];
    this.historyIndex = -1;
    this.currentDraft = "";
    // Markdown renderer component
    this.rendererComponent = new import_obsidian2.Component();
    this.taskItems = [];
    this.taskPanelCollapsed = false;
    // Pipeline state
    this.isRunning = false;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_AI_CHAT;
  }
  getDisplayText() {
    return "AI Agent";
  }
  getIcon() {
    return "bot";
  }
  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.addClass("ai-agent-chat-container");
    container.addClass(`ai-agent-font-${this.plugin.settings.fontSize}`);
    this.renderHeader(container);
    this.messageContainer = container.createDiv({ cls: "ai-agent-messages" });
    this.taskPanelWrapper = container.createDiv({ cls: "ai-agent-task-panel-wrapper" });
    this.taskPanelWrapper.style.display = "none";
    this.taskPanelHeader = this.taskPanelWrapper.createDiv({ cls: "ai-agent-task-panel-header" });
    this.taskPanelToggle = this.taskPanelHeader.createEl("button", {
      cls: "ai-agent-task-panel-toggle",
      attr: { title: "\u6298\u53E0/\u5C55\u5F00\u4EFB\u52A1\u5217\u8868" }
    });
    this.taskPanelToggle.setText("\u25BE");
    this.taskPanelHeader.createSpan({ cls: "ai-agent-task-panel-title", text: "" });
    const toggleCollapse = () => {
      this.taskPanelCollapsed = !this.taskPanelCollapsed;
      this.taskPanelToggle.setText(this.taskPanelCollapsed ? "\u25B8" : "\u25BE");
      this.taskPanelBody.style.display = this.taskPanelCollapsed ? "none" : "";
    };
    this.taskPanelToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCollapse();
    });
    this.taskPanelHeader.addEventListener("click", (e) => {
      if (e.target === this.taskPanelToggle)
        return;
      toggleCollapse();
    });
    this.taskPanelBody = this.taskPanelWrapper.createDiv({ cls: "ai-agent-task-panel-body" });
    this.taskListEl = this.taskPanelBody.createDiv({ cls: "ai-agent-task-list" });
    this.restoreActiveSession();
    if (this.messageContainer.children.length === 0) {
      this.renderWelcomeMessage();
    }
    this.scrollToBottom();
    this.renderInputArea(container);
    const bottomBar = container.createDiv({ cls: "ai-agent-bottom-bar" });
    this.usageStatsEl = bottomBar.createDiv({ cls: "ai-agent-usage-stats" });
    this.statusBar = bottomBar.createDiv({ cls: "ai-agent-statusbar" });
    this.updateStatusBar();
    this.progressBar = container.createDiv({ cls: "ai-agent-progress-bar" });
    for (let i = 0; i < 5; i++) {
      this.progressBar.createDiv({ cls: "ai-agent-progress-segment" });
    }
  }
  async onClose() {
    this.rendererComponent.unload();
  }
  refreshFontSize() {
    this.contentEl.removeClass("ai-agent-font-small", "ai-agent-font-medium", "ai-agent-font-large");
    this.contentEl.addClass(`ai-agent-font-${this.plugin.settings.fontSize}`);
  }
  // ===== Header =====
  renderHeader(container) {
    const header = container.createDiv({ cls: "ai-agent-header" });
    const left = header.createDiv({ cls: "ai-agent-header-left" });
    left.createSpan({ text: "AI Agent", cls: "ai-agent-header-title" });
    this.sessionTitleEl = left.createSpan({ cls: "ai-agent-session-title" });
    const right = header.createDiv({ cls: "ai-agent-header-right" });
    this.sessionSelector = right.createEl("select", { cls: "ai-agent-session-select" });
    this.sessionSelector.addEventListener("change", () => {
      this.plugin.switchSession(this.sessionSelector.value);
      this.refreshMessages();
    });
    this.updateSessionSelector();
    const newBtn = right.createEl("button", { text: "+", cls: "ai-agent-btn ai-agent-btn-new" });
    newBtn.addEventListener("click", () => {
      this.plugin.createNewSession();
      this.updateSessionSelector();
      this.refreshMessages();
    });
  }
  // ===== Input Area =====
  renderInputArea(container) {
    const inputWrapper = container.createDiv({ cls: "ai-agent-input-wrapper" });
    const inputRow = inputWrapper.createDiv({ cls: "ai-agent-input-row" });
    this.inputArea = inputRow.createEl("textarea", {
      cls: "ai-agent-input",
      attr: {
        placeholder: "\u8F93\u5165\u9700\u6C42\uFF0CAI \u5C06\u81EA\u52A8\u751F\u6210\u6587\u6863... (Enter \u53D1\u9001, Shift+Enter \u6362\u884C)",
        rows: "2"
      }
    });
    this.sendBtn = inputRow.createEl("button", {
      text: "\u53D1\u9001",
      cls: "ai-agent-send-btn"
    });
    this.inputArea.addEventListener("paste", (e) => {
      var _a;
      const items = (_a = e.clipboardData) == null ? void 0 : _a.items;
      if (!items)
        return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          this.handleImagePaste(item);
          break;
        }
      }
    });
    this.inputArea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const content = this.inputArea.value.trim();
        if (content) {
          this.sentMessages.push(content);
          this.historyIndex = -1;
          this.currentDraft = "";
        }
        this.sendMessage();
      } else if (e.key === "ArrowUp" && !e.shiftKey && this.inputArea.selectionStart === 0) {
        e.preventDefault();
        if (this.sentMessages.length === 0)
          return;
        if (this.historyIndex === -1) {
          this.currentDraft = this.inputArea.value;
        }
        if (this.historyIndex < this.sentMessages.length - 1) {
          this.historyIndex++;
        }
        this.inputArea.value = this.sentMessages[this.sentMessages.length - 1 - this.historyIndex];
      } else if (e.key === "ArrowDown" && !e.shiftKey && this.inputArea.selectionStart === this.inputArea.value.length) {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputArea.value = this.sentMessages[this.sentMessages.length - 1 - this.historyIndex];
        } else if (this.historyIndex === 0) {
          this.historyIndex = -1;
          this.inputArea.value = this.currentDraft;
        }
      } else if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.inputArea.value = "";
        this.historyIndex = -1;
        this.currentDraft = "";
      }
    });
    this.sendBtn.addEventListener("click", () => {
      if (this.isRunning) {
        this.plugin.getEngine().abort();
      } else {
        this.sendMessage();
      }
    });
  }
  // ===== Message Sending =====
  async sendMessage() {
    const content = this.inputArea.value.trim();
    if (!content)
      return;
    if (this.isRunning)
      return;
    if (content.startsWith("/")) {
      const handled = this.handleSlashCommand(content);
      if (handled) {
        this.inputArea.value = "";
        return;
      }
    }
    this.inputArea.value = "";
    this.inputArea.disabled = true;
    this.sendBtn.textContent = "\u505C\u6B62";
    this.sendBtn.classList.add("ai-agent-send-btn-stop");
    this.isRunning = true;
    if (!this.plugin.getSessionManager().getActiveSession()) {
      this.plugin.createNewSession();
      this.updateSessionSelector();
    }
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now()
    };
    this.plugin.addMessageToActiveSession(userMsg);
    this.renderUserMessage(userMsg);
    this.taskItems = [];
    this.taskListEl.empty();
    this.taskPanelWrapper.style.display = "none";
    this.progressBar.classList.add("ai-agent-progress-active");
    let pendingPlanResolver = null;
    await this.plugin.getEngine().runPipeline(content, {
      onPlanGenerated: (plan) => {
        this.renderPlanPreview(plan);
      },
      requestPlanConfirmation: async (plan) => {
        return new Promise((resolve) => {
          pendingPlanResolver = resolve;
          this.showPlanConfirmationDialog(plan, (confirmedPlan) => {
            pendingPlanResolver = null;
            resolve(confirmedPlan);
          });
        });
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
      onComplete: () => {
        this.inputArea.disabled = false;
        this.sendBtn.textContent = "\u53D1\u9001";
        this.sendBtn.classList.remove("ai-agent-send-btn-stop");
        this.progressBar.classList.remove("ai-agent-progress-active");
        this.isRunning = false;
        this.statusBar.setText("");
        if (pendingPlanResolver) {
          pendingPlanResolver(null);
          pendingPlanResolver = null;
        }
        const doneCount = this.taskItems.filter(
          (t) => t.steps.every((s) => s.status === "done")
        ).length;
        const failCount = this.taskItems.filter(
          (t) => t.steps.some((s) => s.status === "failed")
        ).length;
        if (doneCount + failCount > 0) {
          const msg = failCount > 0 ? `AI Agent \u5B8C\u6210\uFF1A${doneCount} \u7BC7\u6210\u529F\uFF0C${failCount} \u7BC7\u5931\u8D25` : `AI Agent \u5B8C\u6210\uFF1A\u751F\u6210 ${doneCount} \u7BC7\u6587\u7AE0`;
          new import_obsidian2.Notice(msg);
        }
        this.updateSessionSelector();
        this.scrollToBottom();
      },
      onError: (error) => {
        this.progressBar.classList.remove("ai-agent-progress-active");
        this.renderError(error);
        new import_obsidian2.Notice(`\u9519\u8BEF\uFF1A${error}`, 5e3);
        if (pendingPlanResolver) {
          pendingPlanResolver(null);
          pendingPlanResolver = null;
        }
      }
    });
  }
  handleSlashCommand(cmd) {
    switch (cmd.trim()) {
      case "/clear":
        this.clearCurrentSession();
        return true;
      case "/export":
        this.exportCurrentSession();
        return true;
      case "/help":
        this.showHelp();
        return true;
    }
    return false;
  }
  // ===== Plan Preview (shown in message area) =====
  renderPlanPreview(plan) {
    const msgEl = this.messageContainer.createDiv({ cls: "ai-agent-message ai-agent-message-assistant" });
    const bubble = msgEl.createDiv({ cls: "ai-agent-bubble ai-agent-bubble-assistant" });
    bubble.createDiv({ cls: "ai-agent-plan-preview-title" }).setText(
      `\u751F\u6210\u8BA1\u5212\uFF1A\u5171 ${plan.articles.length} \u7BC7\u6587\u7AE0`
    );
    const list = bubble.createDiv({ cls: "ai-agent-plan-preview-list" });
    for (const a of plan.articles) {
      const item = list.createDiv({ cls: "ai-agent-plan-preview-item" });
      item.createSpan({ text: `\u{1F4C4} ${a.title}`, cls: "ai-agent-plan-file-name" });
      item.createSpan({ text: ` \u2014 ${a.path}`, cls: "ai-agent-plan-file-path" });
    }
  }
  // ===== Plan Confirmation Dialog =====
  showPlanConfirmationDialog(plan, onConfirm) {
    const overlay = this.messageContainer.createDiv({ cls: "ai-agent-confirm-overlay" });
    const dialog = overlay.createDiv({ cls: "ai-agent-confirm-dialog" });
    dialog.createDiv({ cls: "ai-agent-confirm-title" }).setText("\u786E\u8BA4\u751F\u6210\u8BA1\u5212");
    dialog.createDiv({ cls: "ai-agent-confirm-subtitle" }).setText(
      `\u5171 ${plan.articles.length} \u7BC7\u6587\u7AE0\uFF0C\u53EF\u4FEE\u6539\u6807\u9898\u548C\u8DEF\u5F84\u540E\u786E\u8BA4`
    );
    const articleEditors = [];
    for (const article of plan.articles) {
      const card = dialog.createDiv({ cls: "ai-agent-plan-edit-card" });
      card.createDiv({ text: `\u6587\u7AE0 ${articleEditors.length + 1}`, cls: "ai-agent-plan-edit-label" });
      const titleRow = card.createDiv({ cls: "ai-agent-plan-edit-row" });
      titleRow.createSpan({ text: "\u6807\u9898", cls: "ai-agent-plan-edit-field" });
      const titleInput = titleRow.createEl("input", {
        cls: "ai-agent-plan-edit-input",
        attr: { type: "text" }
      });
      titleInput.value = article.title;
      const pathRow = card.createDiv({ cls: "ai-agent-plan-edit-row" });
      pathRow.createSpan({ text: "\u8DEF\u5F84", cls: "ai-agent-plan-edit-field" });
      const pathInput = pathRow.createEl("input", {
        cls: "ai-agent-plan-edit-input",
        attr: { type: "text" }
      });
      pathInput.value = article.path;
      articleEditors.push({ titleInput, pathInput });
    }
    const btnRow = dialog.createDiv({ cls: "ai-agent-confirm-btns" });
    const confirmBtn = btnRow.createEl("button", { text: "\u786E\u8BA4\u5E76\u751F\u6210", cls: "ai-agent-btn ai-agent-btn-approve" });
    const cancelBtn = btnRow.createEl("button", { text: "\u53D6\u6D88", cls: "ai-agent-btn ai-agent-btn-reject" });
    const cleanup = (result) => {
      overlay.remove();
      onConfirm(result);
    };
    confirmBtn.addEventListener("click", () => {
      plan.articles.forEach((a, i) => {
        const editor = articleEditors[i];
        if (editor) {
          a.title = editor.titleInput.value.trim() || a.title;
          a.path = editor.pathInput.value.trim() || a.path;
        }
      });
      cleanup(plan);
    });
    cancelBtn.addEventListener("click", () => {
      cleanup(null);
    });
    this.scrollToBottom();
  }
  // ===== Message Rendering =====
  renderUserMessage(msg) {
    const msgEl = this.messageContainer.createDiv({ cls: "ai-agent-message ai-agent-message-user" });
    const bubble = msgEl.createDiv({ cls: "ai-agent-bubble ai-agent-bubble-user" });
    bubble.createDiv({ cls: "ai-agent-bubble-content" }).setText(msg.content);
    bubble.createDiv({ cls: "ai-agent-bubble-time" }).setText(
      new Date(msg.timestamp).toLocaleTimeString("zh-CN")
    );
  }
  renderAssistantMessage(msg) {
    const msgEl = this.messageContainer.createDiv({ cls: "ai-agent-message ai-agent-message-assistant" });
    const bubble = msgEl.createDiv({ cls: "ai-agent-bubble ai-agent-bubble-assistant" });
    const contentEl = bubble.createDiv({ cls: "ai-agent-bubble-content markdown-rendered" });
    contentEl.setText(msg.content);
    this.renderMarkdownContent(contentEl);
    bubble.createDiv({ cls: "ai-agent-bubble-time" }).setText(
      new Date(msg.timestamp).toLocaleTimeString("zh-CN")
    );
  }
  renderError(error) {
    const msgEl = this.messageContainer.createDiv({ cls: "ai-agent-message ai-agent-message-error" });
    msgEl.createDiv({ cls: "ai-agent-error" }).setText(`\u9519\u8BEF: ${error}`);
  }
  async renderMarkdownContent(el) {
    const text = el.textContent || "";
    el.empty();
    if (text) {
      await import_obsidian2.MarkdownRenderer.renderMarkdown(text, el, "", this.rendererComponent);
    }
  }
  // ===== Session Management =====
  updateSessionSelector() {
    const sessions = this.plugin.getSessionManager().getSessions();
    this.sessionSelector.empty();
    sessions.forEach((s) => {
      const option = this.sessionSelector.createEl("option");
      option.value = s.id;
      option.text = s.title;
    });
    const activeId = this.plugin.getSessionManager().getActiveSessionId();
    if (activeId) {
      this.sessionSelector.value = activeId;
    }
    const activeSession = this.plugin.getSessionManager().getActiveSession();
    if (this.sessionTitleEl) {
      this.sessionTitleEl.setText(activeSession ? `\u2014 ${activeSession.title}` : "");
    }
  }
  refreshMessages() {
    this.messageContainer.empty();
    this.taskItems = [];
    this.taskPanelCollapsed = false;
    this.taskPanelToggle.setText("\u25BE");
    this.taskPanelBody.style.display = "";
    this.taskPanelWrapper.style.display = "none";
    this.taskListEl.empty();
    const session = this.plugin.getSessionManager().getActiveSession();
    if (session) {
      for (const msg of session.messages) {
        switch (msg.role) {
          case "user":
            this.renderUserMessage(msg);
            break;
          case "assistant":
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
  restoreActiveSession() {
    this.refreshMessages();
    this.updateSessionSelector();
  }
  clearCurrentSession() {
    const sessionId = this.plugin.getSessionManager().getActiveSessionId();
    if (sessionId) {
      this.plugin.getSessionManager().clearMessages(sessionId);
      this.refreshMessages();
      this.statusBar.setText("\u4F1A\u8BDD\u5DF2\u6E05\u7A7A");
    }
  }
  async exportCurrentSession() {
    const sessionId = this.plugin.getSessionManager().getActiveSessionId();
    if (!sessionId) {
      this.statusBar.setText("\u6CA1\u6709\u6D3B\u8DC3\u7684\u4F1A\u8BDD");
      return;
    }
    try {
      const markdown = await this.plugin.getSessionManager().exportSession(sessionId);
      if (!markdown) {
        this.statusBar.setText("\u5BFC\u51FA\u5931\u8D25\uFF1A\u4F1A\u8BDD\u4E3A\u7A7A");
        return;
      }
      const session = this.plugin.getSessionManager().getActiveSession();
      const rawName = (session == null ? void 0 : session.title) || "\u5BFC\u51FA\u4F1A\u8BDD";
      const safeName = rawName.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();
      const baseDir = "AI\u5BF9\u8BDD\u5BFC\u51FA";
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
        role: "assistant",
        content: `\u4F1A\u8BDD\u5DF2\u5BFC\u51FA\u5230 **${finalPath}**`,
        timestamp: Date.now()
      });
      const file = this.app.vault.getAbstractFileByPath(finalPath);
      if (file) {
        const leaf = this.app.workspace.getLeaf("tab");
        await leaf.openFile(file);
      }
      this.statusBar.setText(`\u5DF2\u5BFC\u51FA\uFF1A${finalPath}`);
    } catch (err) {
      this.statusBar.setText(`\u5BFC\u51FA\u5931\u8D25\uFF1A${err.message}`);
      this.renderError(`\u5BFC\u51FA\u5931\u8D25\uFF1A${err.message}`);
    }
  }
  async handleImagePaste(item) {
    const file = item.getAsFile();
    if (!file)
      return;
    const ext = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : file.type === "image/gif" ? "gif" : file.type === "image/webp" ? "webp" : "png";
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `ai-pasted-${timestamp}.${ext}`;
    const dir = "attachments/ai-agent";
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
      this.statusBar.setText(`\u56FE\u7247\u5DF2\u4FDD\u5B58\uFF1A${path}`);
      setTimeout(() => this.updateStatusBar(), 2e3);
    } catch (err) {
      this.statusBar.setText(`\u56FE\u7247\u4FDD\u5B58\u5931\u8D25\uFF1A${err.message}`);
    }
  }
  renderWelcomeMessage() {
    const welcome = [
      "**\u6B22\u8FCE\u4F7F\u7528 Obsidian AI Agent**",
      "",
      "\u8F93\u5165\u9700\u6C42\uFF0CAI \u5C06\u81EA\u52A8\u5B8C\u6210\u6587\u6863\u751F\u6210\u3002\u4F8B\u5982\uFF1A",
      "",
      "- `\u5199 3 \u7BC7 React Hook \u6280\u672F\u6587\u6863\uFF0C\u4FDD\u5B58\u5230 \u6280\u672F\u6587\u6863/React \u76EE\u5F55`",
      "- `\u521B\u4F5C\u4E00\u4E2A 5 \u7AE0\u7684\u60AC\u7591\u5C0F\u8BF4\uFF0C\u6BCF\u7AE0\u4E00\u4E2A\u6587\u4EF6`",
      "- `\u603B\u7ED3\u6700\u8FD1\u4E00\u5468\u7684\u6280\u672F\u7B14\u8BB0\uFF0C\u751F\u6210\u4E00\u7BC7\u5468\u62A5`",
      "",
      "---",
      "",
      "**\u751F\u6210\u6D41\u7A0B**\uFF1A",
      "",
      "| \u6B65\u9AA4 | \u8BF4\u660E |",
      "|------|------|",
      "| **\u8BA1\u5212** | AI \u5206\u6790\u9700\u6C42\uFF0C\u751F\u6210\u6587\u7AE0\u4E3B\u9898\u548C\u76EE\u5F55\u7ED3\u6784 |",
      "| **\u8349\u7A3F** | \u6839\u636E\u4E3B\u9898\u64B0\u5199\u521D\u7A3F |",
      "| **\u6DA6\u8272** | \u6DFB\u52A0\u601D\u7EF4\u5BFC\u56FE\u3001\u6D41\u7A0B\u56FE\u3001callout \u63D0\u793A\u5757 |",
      "| **\u68C0\u67E5** | Markdown \u8BED\u6CD5\u68C0\u67E5\u4E0E\u4FEE\u590D |",
      "| **\u94FE\u63A5** | \u591A\u7BC7\u6587\u7AE0\u81EA\u52A8\u6DFB\u52A0 [[wikilink]] \u76F8\u4E92\u5F15\u7528 |",
      "",
      "\u591A\u7BC7\u6587\u7AE0\u751F\u6210\u65F6\u4F1A\u5148\u5C55\u793A\u8BA1\u5212\u4F9B\u786E\u8BA4\uFF0C\u5355\u7BC7\u6587\u7AE0\u76F4\u63A5\u751F\u6210\u3002",
      "\u6BCF\u4E2A\u6B65\u9AA4\u7684 Prompt \u53EF\u5728\u8BBE\u7F6E\u4E2D\u81EA\u5B9A\u4E49\u3002",
      "",
      "**\u5FEB\u6377\u64CD\u4F5C**\uFF1A",
      "- `\u2191\u2193` \u952E\u56DE\u6EAF\u5386\u53F2\u6D88\u606F",
      "- `Ctrl+K` \u6E05\u7A7A\u8F93\u5165\u6846",
      "- `/clear` \u6E05\u7A7A\u4F1A\u8BDD \xB7 `/export` \u5BFC\u51FA \xB7 `/help` \u5E2E\u52A9"
    ].join("\n");
    this.renderAssistantMessage({
      id: "welcome",
      role: "assistant",
      content: welcome,
      timestamp: Date.now()
    });
  }
  showHelp() {
    const helpContent = [
      "**\u53EF\u7528\u547D\u4EE4\uFF1A**",
      "- `/clear` - \u6E05\u7A7A\u5F53\u524D\u4F1A\u8BDD",
      "- `/export` - \u5BFC\u51FA\u5F53\u524D\u4F1A\u8BDD\u4E3A Markdown",
      "- `/help` - \u663E\u793A\u6B64\u5E2E\u52A9"
    ].join("\n");
    this.renderAssistantMessage({
      id: "help",
      role: "assistant",
      content: helpContent,
      timestamp: Date.now()
    });
  }
  // ===== Pipeline Task Progress =====
  updateTaskItem(article, step, status) {
    let item = this.taskItems.find((t) => t.article.path === article.path);
    if (!item) {
      item = {
        id: `task-${article.path}`,
        article,
        steps: [
          { step: "draft", status: "pending" },
          { step: "polish", status: "pending" },
          { step: "check", status: "pending" }
        ]
      };
      this.taskItems.push(item);
    }
    const stepItem = item.steps.find((s) => s.step === step);
    if (stepItem) {
      stepItem.status = status;
    }
    item.article.status = article.status;
  }
  renderTaskPanel() {
    if (this.taskItems.length === 0) {
      this.taskPanelWrapper.style.display = "none";
      return;
    }
    this.taskPanelWrapper.style.display = "";
    const totalArticles = this.taskItems.length;
    const doneArticles = this.taskItems.filter(
      (t) => t.steps.every((s) => s.status === "done")
    ).length;
    const failArticles = this.taskItems.filter(
      (t) => t.steps.some((s) => s.status === "failed")
    ).length;
    const allDone = doneArticles + failArticles === totalArticles;
    const hasRunning = this.taskItems.some(
      (t) => t.steps.some((s) => s.status === "running")
    );
    this.taskPanelHeader.querySelector(".ai-agent-task-panel-title").setText(
      allDone ? `\u751F\u6210\u5B8C\u6210 (${doneArticles} \u6210\u529F${failArticles > 0 ? ` / ${failArticles} \u5931\u8D25` : ""})` : `\u751F\u6210\u4E2D (${doneArticles}/${totalArticles})`
    );
    if (hasRunning && this.taskPanelCollapsed) {
      this.taskPanelCollapsed = false;
      this.taskPanelToggle.setText("\u25BE");
      this.taskPanelBody.style.display = "";
    }
    this.taskListEl.empty();
    for (const task of this.taskItems) {
      const item = this.taskListEl.createDiv({
        cls: `ai-agent-task-item ai-agent-task-${task.steps.some((s) => s.status === "failed") ? "failed" : task.steps.every((s) => s.status === "done") ? "done" : task.steps.some((s) => s.status === "running") ? "running" : "pending"}`
      });
      const icon = task.steps.some((s) => s.status === "failed") ? "\u2717" : task.steps.every((s) => s.status === "done") ? "\u2713" : task.steps.some((s) => s.status === "running") ? "\u27F3" : "\u25CB";
      item.createSpan({ cls: "ai-agent-task-icon", text: icon });
      const info = item.createDiv({ cls: "ai-agent-task-info" });
      info.createDiv({ cls: "ai-agent-task-desc", text: task.article.title });
      const stepsEl = info.createDiv({ cls: "ai-agent-task-steps" });
      for (const step of task.steps) {
        const sIcon = step.status === "done" ? "\u2713" : step.status === "running" ? "\u27F3" : step.status === "failed" ? "\u2717" : "\u25CB";
        stepsEl.createSpan({
          cls: `ai-agent-step-badge ai-agent-step-${step.status}`,
          text: `${sIcon} ${STEP_LABELS[step.step]}`
        });
      }
      if (task.article.error) {
        item.createSpan({ cls: "ai-agent-task-error", text: task.article.error.slice(0, 80) });
      }
    }
  }
  // ===== Utils =====
  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    });
  }
  updateStatusBar() {
    this.statusBar.setText(this.plugin.settings.defaultProvider);
  }
  applySettings() {
    this.refreshFontSize();
    this.statusBar.setText("");
    this.updateStatusBar();
  }
  normalizePath(path) {
    return path.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+/, "");
  }
};

// src/agent/engine.ts
var import_obsidian3 = require("obsidian");

// src/agent/api-client.ts
function sanitizeString(s) {
  if (!s)
    return s;
  return s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
function safeJSONStringify(obj, space) {
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === "string") {
      return sanitizeString(value);
    }
    return value;
  }, space);
}
var APIClient = class {
  constructor(settings) {
    this.abortController = null;
    this.settings = settings;
  }
  updateSettings(settings) {
    this.settings = settings;
  }
  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  async fetchWithRetry(url, init, isStreaming) {
    var _a;
    const maxRetries = this.settings.maxRetries;
    const timeoutMs = this.settings.requestTimeout * 1e3;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
      const combinedSignal = timeoutController.signal;
      const mergedInit = { ...init, signal: combinedSignal };
      const onExternalAbort = () => timeoutController.abort();
      if (this.abortController) {
        this.abortController.signal.addEventListener("abort", onExternalAbort);
      }
      try {
        const response = await fetch(url, mergedInit);
        if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
          const delay = Math.min(1e3 * Math.pow(2, attempt) + Math.random() * 1e3, 3e4);
          console.warn(`[AI Agent] API ${response.status}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        return response;
      } catch (err) {
        lastError = err;
        if (err.name === "AbortError") {
          if ((_a = this.abortController) == null ? void 0 : _a.signal.aborted)
            throw err;
          if (attempt < maxRetries) {
            const delay = Math.min(1e3 * Math.pow(2, attempt), 15e3);
            console.warn(`[AI Agent] Request timeout, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          throw new Error(`\u8BF7\u6C42\u8D85\u65F6\uFF08${this.settings.requestTimeout}\u79D2\uFF09`);
        }
        if (attempt < maxRetries) {
          const delay = Math.min(1e3 * Math.pow(2, attempt), 15e3);
          console.warn(`[AI Agent] Network error: ${err.message}, retrying in ${Math.round(delay)}ms`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
        if (this.abortController) {
          this.abortController.signal.removeEventListener("abort", onExternalAbort);
        }
      }
    }
    throw lastError || new Error("API \u8BF7\u6C42\u5931\u8D25\uFF0C\u5DF2\u8FBE\u6700\u5927\u91CD\u8BD5\u6B21\u6570");
  }
  async chat(messages, tools, modelOverride) {
    var _a;
    const provider = this.settings.providers.find((p) => p.id === this.settings.defaultProvider);
    if (!provider)
      throw new Error("\u672A\u627E\u5230\u53EF\u7528\u7684 AI \u670D\u52A1\u5546\u914D\u7F6E");
    const apiKey = resolveApiKey(provider.apiKey);
    if (!apiKey)
      throw new Error(`API Key \u672A\u914D\u7F6E\uFF08\u670D\u52A1\u5546\uFF1A${provider.name}\uFF09`);
    const url = `${provider.baseUrl.replace(/\/$/, "")}/chat/completions`;
    let model = modelOverride || this.settings.defaultModel;
    if (model === "auto") {
      model = provider.models[0] || "default";
    }
    const body = {
      model,
      messages,
      temperature: this.settings.temperature,
      top_p: this.settings.topP,
      max_tokens: this.settings.maxTokens,
      stream: false
    };
    this.abortController = new AbortController();
    const response = await this.fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: safeJSONStringify(body)
    }, false);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "\u672A\u77E5\u9519\u8BEF");
      throw new Error(`API \u8BF7\u6C42\u5931\u8D25 (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    const choice = (_a = data.choices) == null ? void 0 : _a[0];
    const message = (choice == null ? void 0 : choice.message) || {};
    const content = message.content || "";
    return {
      content,
      usage: data.usage ? {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens,
        cacheHit: data.usage.prompt_cache_hit_tokens,
        cacheMiss: data.usage.prompt_cache_miss_tokens
      } : void 0
    };
  }
  async chatStream(messages, callbacks, modelOverride) {
    var _a;
    const provider = this.settings.providers.find((p) => p.id === this.settings.defaultProvider);
    if (!provider)
      throw new Error("\u672A\u627E\u5230\u53EF\u7528\u7684 AI \u670D\u52A1\u5546\u914D\u7F6E");
    const apiKey = resolveApiKey(provider.apiKey);
    if (!apiKey)
      throw new Error(`API Key \u672A\u914D\u7F6E\uFF08\u670D\u52A1\u5546\uFF1A${provider.name}\uFF09`);
    const url = `${provider.baseUrl.replace(/\/$/, "")}/chat/completions`;
    let model = modelOverride || this.settings.defaultModel;
    if (model === "auto") {
      model = provider.models[0] || "default";
    }
    const body = {
      model,
      messages,
      temperature: this.settings.temperature,
      top_p: this.settings.topP,
      max_tokens: this.settings.maxTokens,
      stream: true
    };
    this.abortController = new AbortController();
    try {
      const response = await this.fetchWithRetry(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: safeJSONStringify(body)
      }, true);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "\u672A\u77E5\u9519\u8BEF");
        callbacks.onError(new Error(`API \u8BF7\u6C42\u5931\u8D25 (${response.status}): ${errorText}`));
        return;
      }
      const reader = (_a = response.body) == null ? void 0 : _a.getReader();
      if (!reader) {
        callbacks.onError(new Error("\u65E0\u6CD5\u83B7\u53D6\u54CD\u5E94\u6D41"));
        return;
      }
      const decoder = new TextDecoder();
      let fullContent = "";
      let lineBuffer = "";
      let usage;
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        const text = decoder.decode(value, { stream: true });
        lineBuffer += text;
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: "))
            continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]")
            continue;
          try {
            const chunk = JSON.parse(data);
            if (chunk.usage) {
              usage = {
                prompt: chunk.usage.prompt_tokens,
                completion: chunk.usage.completion_tokens,
                total: chunk.usage.total_tokens,
                cacheHit: chunk.usage.prompt_cache_hit_tokens,
                cacheMiss: chunk.usage.prompt_cache_miss_tokens
              };
            }
            for (const choice of chunk.choices) {
              const delta = choice.delta;
              if (delta.content) {
                fullContent += delta.content;
                callbacks.onToken(delta.content);
              }
            }
          } catch (e) {
          }
        }
      }
      callbacks.onComplete(fullContent, usage);
    } catch (err) {
      if (err.name === "AbortError") {
        callbacks.onError(new Error("\u8BF7\u6C42\u5DF2\u53D6\u6D88"));
      } else {
        callbacks.onError(err);
      }
    }
  }
};

// src/agent/usage-tracker.ts
var PRICING = {
  "deepseek-v4-pro": { input: 0.28, output: 1.68, cacheHit: 0.07 },
  "deepseek-v4-flash": { input: 0.14, output: 0.84, cacheHit: 0.035 }
};
var DEFAULT_PRICING = { input: 0.28, output: 1.68, cacheHit: 0.07 };
var UsageTracker = class {
  constructor() {
    this.stats = {
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalTokens: 0,
      cacheHitTokens: 0,
      cacheMissTokens: 0,
      estimatedCostUSD: 0,
      apiCalls: 0
    };
    this.currentModel = "deepseek-v4-pro";
  }
  setModel(model) {
    this.currentModel = model;
  }
  addUsage(promptTokens, completionTokens, cacheHitTokens, cacheMissTokens) {
    this.stats.totalPromptTokens += promptTokens;
    this.stats.totalCompletionTokens += completionTokens;
    this.stats.totalTokens += promptTokens + completionTokens;
    this.stats.cacheHitTokens += cacheHitTokens || 0;
    this.stats.cacheMissTokens += cacheMissTokens || 0;
    this.stats.apiCalls++;
    const pricing = PRICING[this.currentModel] || DEFAULT_PRICING;
    const inputCost = promptTokens / 1e6 * pricing.input;
    const outputCost = completionTokens / 1e6 * pricing.output;
    if (cacheHitTokens && pricing.cacheHit) {
      const cacheHitCost = cacheHitTokens / 1e6 * pricing.cacheHit;
      const cacheMissCost = (promptTokens - cacheHitTokens) / 1e6 * pricing.input;
      this.stats.estimatedCostUSD += cacheHitCost + cacheMissCost + outputCost;
    } else {
      this.stats.estimatedCostUSD += inputCost + outputCost;
    }
  }
  getStats() {
    return { ...this.stats };
  }
  getCacheHitRate() {
    const total = this.stats.cacheHitTokens + this.stats.cacheMissTokens;
    if (total === 0)
      return 0;
    return this.stats.cacheHitTokens / total;
  }
  getSummary() {
    const s = this.stats;
    const cacheRate = this.getCacheHitRate();
    const costStr = s.estimatedCostUSD < 0.01 ? "< $0.01" : `$${s.estimatedCostUSD.toFixed(3)}`;
    let summary = `${this.formatTokens(s.totalTokens)} tokens`;
    if (s.apiCalls > 1) {
      summary += ` \xB7 ${s.apiCalls} \u6B21\u8C03\u7528`;
    }
    summary += ` \xB7 \u8D39\u7528 ${costStr}`;
    if (cacheRate > 0) {
      summary += ` \xB7 \u7F13\u5B58\u547D\u4E2D ${(cacheRate * 100).toFixed(0)}%`;
    }
    return summary;
  }
  reset() {
    this.stats = {
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalTokens: 0,
      cacheHitTokens: 0,
      cacheMissTokens: 0,
      estimatedCostUSD: 0,
      apiCalls: 0
    };
  }
  formatTokens(n) {
    if (n >= 1e6)
      return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3)
      return `${(n / 1e3).toFixed(1)}K`;
    return String(n);
  }
};

// src/agent/engine.ts
function substituteVars(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}
var PipelineEngine = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.apiClient = new APIClient(plugin.settings);
    this.usageTracker = new UsageTracker();
  }
  updateSettings() {
    this.apiClient.updateSettings(this.plugin.settings);
  }
  abort() {
    this.apiClient.abort();
  }
  async runPipeline(userInput, callbacks) {
    const prompts = this.plugin.settings.pipelinePrompts;
    const model = this.resolveModel(userInput);
    try {
      callbacks.onStatusChange("\u6B63\u5728\u5206\u6790\u9700\u6C42\uFF0C\u751F\u6210\u8BA1\u5212...");
      const planConfig = prompts.plan;
      let plan;
      if (planConfig.enabled) {
        const planPrompt = substituteVars(planConfig.promptTemplate, {
          user_input: userInput
        });
        const planContent = await this.callLLM(planPrompt, model, callbacks);
        plan = this.parsePlan(planContent, userInput);
      } else {
        plan = this.createSingleArticlePlan(userInput);
      }
      callbacks.onPlanGenerated(plan);
      if (plan.articles.length > 1) {
        const confirmed = await callbacks.requestPlanConfirmation(plan);
        if (!confirmed) {
          callbacks.onError("\u7528\u6237\u53D6\u6D88\u4E86\u64CD\u4F5C");
          callbacks.onComplete();
          return;
        }
        plan = confirmed;
      }
      if (plan.articles.length === 0) {
        callbacks.onError("\u672A\u80FD\u751F\u6210\u6709\u6548\u7684\u6587\u7AE0\u8BA1\u5212");
        callbacks.onComplete();
        return;
      }
      for (const article of plan.articles) {
        try {
          callbacks.onArticleStatusChange(article, "draft", "drafting");
          callbacks.onStatusChange(`\u6B63\u5728\u751F\u6210\uFF1A${article.title}`);
          const draft = await this.generateDraft(article, userInput, prompts.draft, model, callbacks);
          callbacks.onArticleStatusChange(article, "draft", "done");
          callbacks.onArticleStatusChange(article, "polish", "polishing");
          callbacks.onStatusChange(`\u6B63\u5728\u6DA6\u8272\uFF1A${article.title}`);
          const polished = await this.polishArticle(article, draft, userInput, prompts.polish, model, callbacks);
          await this.saveFile(article.path, polished);
          callbacks.onArticleStatusChange(article, "polish", "done");
          callbacks.onArticleStatusChange(article, "check", "checking");
          callbacks.onStatusChange(`\u6B63\u5728\u68C0\u67E5\u8BED\u6CD5\uFF1A${article.title}`);
          const checked = await this.checkArticle(article, polished, prompts.check, model, callbacks);
          await this.saveFile(article.path, checked);
          callbacks.onArticleStatusChange(article, "check", "done");
          article.status = "done";
          callbacks.onStatusChange(`\u5B8C\u6210\uFF1A${article.title}`);
        } catch (err) {
          article.status = "failed";
          article.error = err.message;
          callbacks.onArticleStatusChange(article, "draft", "failed");
          callbacks.onStatusChange(`\u5931\u8D25\uFF1A${article.title} - ${err.message}`);
        }
      }
      const succeeded = plan.articles.filter((a) => a.status === "done");
      if (succeeded.length > 1 && prompts.link.enabled) {
        callbacks.onStatusChange("\u6B63\u5728\u6DFB\u52A0\u6587\u7AE0\u95F4\u94FE\u63A5...");
        try {
          await this.crossLink(succeeded, prompts.link, model, callbacks);
          callbacks.onStatusChange("\u6587\u7AE0\u94FE\u63A5\u5B8C\u6210");
        } catch (err) {
          callbacks.onStatusChange(`\u6587\u7AE0\u94FE\u63A5\u5931\u8D25\uFF1A${err.message}`);
        }
      }
    } catch (err) {
      callbacks.onError(err.message || "\u6D41\u6C34\u7EBF\u6267\u884C\u51FA\u9519");
    } finally {
      callbacks.onComplete();
    }
  }
  // ===== Step 1: Draft =====
  async generateDraft(article, userInput, config, model, callbacks) {
    if (!config.enabled) {
      return `# ${article.title}

${article.topic}
`;
    }
    const prompt = substituteVars(config.promptTemplate, {
      article_title: article.title,
      article_topic: article.topic,
      user_input: userInput
    });
    return this.callLLM(prompt, model, callbacks);
  }
  // ===== Step 2: Polish =====
  async polishArticle(article, draftContent, userInput, config, model, callbacks) {
    if (!config.enabled)
      return draftContent;
    const prompt = substituteVars(config.promptTemplate, {
      article_title: article.title,
      article_path: article.path,
      draft_content: draftContent,
      user_input: userInput
    });
    return this.callLLM(prompt, model, callbacks);
  }
  // ===== Step 3: Check =====
  async checkArticle(article, content, config, model, callbacks) {
    if (!config.enabled)
      return content;
    const prompt = substituteVars(config.promptTemplate, {
      article_path: article.path,
      draft_content: content,
      article_title: article.title,
      user_input: ""
    });
    return this.callLLM(prompt, model, callbacks);
  }
  // ===== Step 4: Cross-link =====
  async crossLink(articles, config, model, callbacks) {
    if (!config.enabled)
      return;
    const articleInfos = [];
    for (const a of articles) {
      const content = await this.readFile(a.path);
      articleInfos.push(`--- \u6587\u4EF6\uFF1A${a.path} ---
\u6807\u9898\uFF1A${a.title}
\u5185\u5BB9\uFF1A
${content}`);
    }
    const prompt = substituteVars(config.promptTemplate, {
      all_articles: articleInfos.join("\n\n"),
      user_input: "",
      article_title: "",
      article_topic: "",
      article_path: "",
      draft_content: ""
    });
    const result = await this.callLLM(prompt, model, callbacks);
    const filePattern = /---FILE:(.+?)---\n([\s\S]*?)(?=\n---FILE:|---$|$)/g;
    let match;
    while ((match = filePattern.exec(result)) !== null) {
      const filePath = match[1].trim();
      const fileContent = match[2].trim();
      if (filePath && fileContent) {
        await this.saveFile((0, import_obsidian3.normalizePath)(filePath), fileContent);
      }
    }
  }
  // ===== LLM Call =====
  async callLLM(systemPrompt, model, callbacks) {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: "\u8BF7\u5F00\u59CB\u3002" }
    ];
    const result = await this.apiClient.chat(messages, void 0, model);
    if (result.usage) {
      this.usageTracker.setModel(model);
      this.usageTracker.addUsage(
        result.usage.prompt,
        result.usage.completion,
        result.usage.cacheHit,
        result.usage.cacheMiss
      );
      callbacks.onUsageUpdate(this.usageTracker.getSummary());
    }
    return result.content || "";
  }
  // ===== File Helpers =====
  async saveFile(path, content) {
    const normalized = (0, import_obsidian3.normalizePath)(path);
    const dir = normalized.substring(0, normalized.lastIndexOf("/"));
    if (dir) {
      const dirExists = this.plugin.app.vault.getAbstractFileByPath(dir);
      if (!dirExists) {
        await this.plugin.app.vault.createFolder(dir);
      }
    }
    const existing = this.plugin.app.vault.getAbstractFileByPath(normalized);
    if (existing instanceof import_obsidian3.TFile) {
      await this.plugin.app.vault.modify(existing, content);
    } else {
      await this.plugin.app.vault.create(normalized, content);
    }
  }
  async readFile(path) {
    const normalized = (0, import_obsidian3.normalizePath)(path);
    const file = this.plugin.app.vault.getAbstractFileByPath(normalized);
    if (file instanceof import_obsidian3.TFile) {
      return this.plugin.app.vault.read(file);
    }
    return "";
  }
  // ===== Plan Parsing =====
  parsePlan(content, userInput) {
    let jsonStr = content;
    const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }
    try {
      const articles = JSON.parse(jsonStr);
      if (!Array.isArray(articles) || articles.length === 0) {
        return this.createSingleArticlePlan(userInput);
      }
      return {
        articles: articles.map((a, i) => ({
          title: a.title || `\u6587\u6863 ${i + 1}`,
          path: a.path || `AI\u751F\u6210/\u6587\u6863${i + 1}.md`,
          topic: a.topic || userInput.slice(0, 100),
          status: "pending"
        }))
      };
    } catch (e) {
      return this.createSingleArticlePlan(userInput);
    }
  }
  createSingleArticlePlan(userInput) {
    const title = userInput.length > 40 ? userInput.slice(0, 40) + "..." : userInput;
    const safeTitle = title.replace(/[\\/:*?"<>|]/g, "-");
    const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return {
      articles: [{
        title: safeTitle,
        path: `AI\u751F\u6210/${dateStr}-${safeTitle}.md`,
        topic: userInput,
        status: "pending"
      }]
    };
  }
  resolveModel(userInput) {
    if (this.plugin.settings.defaultModel !== "auto") {
      return this.plugin.settings.defaultModel;
    }
    return "deepseek-v4-pro";
  }
};

// src/session/session-manager.ts
var import_obsidian4 = require("obsidian");
var SESSION_DIR = ".obsidian/ai-agent-sessions";
var SessionManager = class {
  constructor(vault) {
    this.sessions = [];
    this.activeSessionId = null;
    this.loaded = false;
    this.vault = vault;
  }
  async loadSessions() {
    if (this.loaded)
      return;
    try {
      const dir = this.vault.getAbstractFileByPath((0, import_obsidian4.normalizePath)(SESSION_DIR));
      if (!dir) {
        await this.vault.createFolder((0, import_obsidian4.normalizePath)(SESSION_DIR));
        this.loaded = true;
        return;
      }
      const files = this.vault.getFiles().filter(
        (f) => f.path.startsWith(SESSION_DIR) && f.extension === "json"
      );
      this.sessions = [];
      for (const file of files) {
        try {
          const content = await this.vault.read(file);
          const session = JSON.parse(content);
          this.sessions.push(session);
        } catch (e) {
        }
      }
      this.sessions.sort((a, b) => b.updatedAt - a.updatedAt);
      this.loaded = true;
    } catch (err) {
      console.error("Failed to load sessions:", err);
      this.loaded = true;
    }
  }
  getSessions() {
    return this.sessions;
  }
  getActiveSession() {
    if (!this.activeSessionId)
      return null;
    return this.sessions.find((s) => s.id === this.activeSessionId) || null;
  }
  getActiveSessionId() {
    return this.activeSessionId;
  }
  createSession(title) {
    const session = {
      id: `session-${Date.now()}`,
      title: title || `\u4F1A\u8BDD ${this.sessions.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    this.sessions.unshift(session);
    this.activeSessionId = session.id;
    this.saveSession(session);
    return session;
  }
  switchSession(sessionId) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      this.activeSessionId = sessionId;
    }
    return session || null;
  }
  deleteSession(sessionId) {
    var _a;
    const index = this.sessions.findIndex((s) => s.id === sessionId);
    if (index === -1)
      return;
    this.sessions.splice(index, 1);
    const path = (0, import_obsidian4.normalizePath)(`${SESSION_DIR}/${sessionId}.json`);
    const file = this.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian4.TFile) {
      this.vault.delete(file).catch(() => {
      });
    }
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = ((_a = this.sessions[0]) == null ? void 0 : _a.id) || null;
    }
  }
  renameSession(sessionId, newTitle) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.title = newTitle;
      session.updatedAt = Date.now();
      this.saveSession(session);
    }
  }
  addMessage(sessionId, message) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = Date.now();
      if (session.title.startsWith("\u4F1A\u8BDD ") && message.role === "user") {
        const content = message.content.trim();
        session.title = content.length > 30 ? content.slice(0, 30) + "..." : content;
      }
      this.saveSession(session);
    }
  }
  clearMessages(sessionId) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.messages = [];
      session.updatedAt = Date.now();
      this.saveSession(session);
    }
  }
  getMessages(sessionId) {
    const session = this.sessions.find((s) => s.id === sessionId);
    return (session == null ? void 0 : session.messages) || [];
  }
  async exportSession(sessionId) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session)
      return "";
    let markdown = `# ${session.title}

`;
    markdown += `> \u521B\u5EFA\u65F6\u95F4\uFF1A${new Date(session.createdAt).toLocaleString("zh-CN")}
`;
    markdown += `> \u66F4\u65B0\u65F6\u95F4\uFF1A${new Date(session.updatedAt).toLocaleString("zh-CN")}

---

`;
    for (const msg of session.messages) {
      switch (msg.role) {
        case "user":
          markdown += `### \u7528\u6237

${msg.content}

`;
          break;
        case "assistant":
          markdown += `### AI

${msg.content}

`;
          break;
      }
    }
    return markdown;
  }
  async saveSession(session) {
    const path = (0, import_obsidian4.normalizePath)(`${SESSION_DIR}/${session.id}.json`);
    const content = JSON.stringify(session, null, 2);
    try {
      const file = this.vault.getAbstractFileByPath(path);
      if (file instanceof import_obsidian4.TFile) {
        await this.vault.modify(file, content);
      } else {
        await this.vault.create(path, content);
      }
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  }
};

// src/main.ts
var AIAgentPlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    this.chatView = null;
  }
  async onload() {
    console.log("Obsidian AI Agent: loading plugin");
    await this.loadSettings();
    this.sessionManager = new SessionManager(this.app.vault);
    await this.sessionManager.loadSessions();
    this.engine = new PipelineEngine(this);
    this.registerView(
      VIEW_TYPE_AI_CHAT,
      (leaf) => {
        this.chatView = new ChatView(leaf, this);
        return this.chatView;
      }
    );
    this.addSettingTab(new AIAgentSettingTab(this.app, this));
    this.addRibbonIcon("bot", "\u6253\u5F00 AI Agent", () => {
      this.activateView();
    });
    this.addCommand({
      id: "open-ai-agent-chat",
      name: "\u6253\u5F00 AI Agent \u5BF9\u8BDD\u9762\u677F",
      callback: () => {
        this.activateView();
      }
    });
    this.addCommand({
      id: "new-ai-agent-session",
      name: "\u65B0\u5EFA AI Agent \u4F1A\u8BDD",
      callback: () => {
        this.createNewSession();
        this.activateView();
      }
    });
    this.app.workspace.onLayoutReady(() => {
    });
  }
  async onunload() {
    console.log("Obsidian AI Agent: unloading plugin");
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_AI_CHAT);
    this.engine.abort();
  }
  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    if (loaded && loaded.pipelinePrompts) {
      this.settings.pipelinePrompts = {
        ...DEFAULT_SETTINGS.pipelinePrompts,
        ...loaded.pipelinePrompts
      };
    }
  }
  async saveSettings() {
    var _a;
    await this.saveData(this.settings);
    (_a = this.engine) == null ? void 0 : _a.updateSettings();
    if (this.chatView) {
      this.chatView.applySettings();
    }
  }
  // ===== Public API =====
  getEngine() {
    return this.engine;
  }
  getSessionManager() {
    return this.sessionManager;
  }
  addMessageToActiveSession(msg) {
    const sessionId = this.sessionManager.getActiveSessionId();
    if (sessionId) {
      this.sessionManager.addMessage(sessionId, msg);
    }
  }
  createNewSession(title) {
    this.sessionManager.createSession(title);
  }
  switchSession(sessionId) {
    this.sessionManager.switchSession(sessionId);
  }
  async activateView() {
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
        active: true
      });
      workspace.revealLeaf(leaf);
    }
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3NldHRpbmdzL3NldHRpbmdzLXN0b3JlLnRzIiwgInNyYy9zZXR0aW5ncy9zZXR0aW5ncy10YWIudHMiLCAic3JjL3ZpZXcvY2hhdC12aWV3LnRzIiwgInNyYy9hZ2VudC9lbmdpbmUudHMiLCAic3JjL2FnZW50L2FwaS1jbGllbnQudHMiLCAic3JjL2FnZW50L3VzYWdlLXRyYWNrZXIudHMiLCAic3JjL3Nlc3Npb24vc2Vzc2lvbi1tYW5hZ2VyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBBSUFnZW50U2V0dGluZ3MsIE1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERFRkFVTFRfU0VUVElOR1MgfSBmcm9tICcuL3NldHRpbmdzL3NldHRpbmdzLXN0b3JlJztcbmltcG9ydCB7IEFJQWdlbnRTZXR0aW5nVGFiIH0gZnJvbSAnLi9zZXR0aW5ncy9zZXR0aW5ncy10YWInO1xuaW1wb3J0IHsgQ2hhdFZpZXcsIFZJRVdfVFlQRV9BSV9DSEFUIH0gZnJvbSAnLi92aWV3L2NoYXQtdmlldyc7XG5pbXBvcnQgeyBQaXBlbGluZUVuZ2luZSB9IGZyb20gJy4vYWdlbnQvZW5naW5lJztcbmltcG9ydCB7IFNlc3Npb25NYW5hZ2VyIH0gZnJvbSAnLi9zZXNzaW9uL3Nlc3Npb24tbWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFJQWdlbnRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHNldHRpbmdzITogQUlBZ2VudFNldHRpbmdzO1xuICAgIHByaXZhdGUgZW5naW5lITogUGlwZWxpbmVFbmdpbmU7XG4gICAgcHJpdmF0ZSBzZXNzaW9uTWFuYWdlciE6IFNlc3Npb25NYW5hZ2VyO1xuICAgIHByaXZhdGUgY2hhdFZpZXc6IENoYXRWaWV3IHwgbnVsbCA9IG51bGw7XG5cbiAgICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPYnNpZGlhbiBBSSBBZ2VudDogbG9hZGluZyBwbHVnaW4nKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgICAgIC8vIEluaXRpYWxpemUgc2Vzc2lvbiBtYW5hZ2VyXG4gICAgICAgIHRoaXMuc2Vzc2lvbk1hbmFnZXIgPSBuZXcgU2Vzc2lvbk1hbmFnZXIodGhpcy5hcHAudmF1bHQpO1xuICAgICAgICBhd2FpdCB0aGlzLnNlc3Npb25NYW5hZ2VyLmxvYWRTZXNzaW9ucygpO1xuXG4gICAgICAgIC8vIEluaXRpYWxpemUgcGlwZWxpbmUgZW5naW5lXG4gICAgICAgIHRoaXMuZW5naW5lID0gbmV3IFBpcGVsaW5lRW5naW5lKHRoaXMpO1xuXG4gICAgICAgIC8vIFJlZ2lzdGVyIGN1c3RvbSB2aWV3XG4gICAgICAgIHRoaXMucmVnaXN0ZXJWaWV3KFxuICAgICAgICAgICAgVklFV19UWVBFX0FJX0NIQVQsXG4gICAgICAgICAgICAobGVhZjogV29ya3NwYWNlTGVhZikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhdFZpZXcgPSBuZXcgQ2hhdFZpZXcobGVhZiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhdFZpZXc7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgc2V0dGluZ3MgdGFiXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgQUlBZ2VudFNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgICAgICAvLyBBZGQgcmliYm9uIGljb25cbiAgICAgICAgdGhpcy5hZGRSaWJib25JY29uKCdib3QnLCAnXHU2MjUzXHU1RjAwIEFJIEFnZW50JywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZVZpZXcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgY29tbWFuZDogb3BlbiBjaGF0IHBhbmVsXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ29wZW4tYWktYWdlbnQtY2hhdCcsXG4gICAgICAgICAgICBuYW1lOiAnXHU2MjUzXHU1RjAwIEFJIEFnZW50IFx1NUJGOVx1OEJERFx1OTc2Mlx1Njc3RicsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVWaWV3KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWdpc3RlciBjb21tYW5kOiBuZXcgc2Vzc2lvblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6ICduZXctYWktYWdlbnQtc2Vzc2lvbicsXG4gICAgICAgICAgICBuYW1lOiAnXHU2NUIwXHU1RUZBIEFJIEFnZW50IFx1NEYxQVx1OEJERCcsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3U2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVWaWV3KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBPcHRpb25hbDogYXV0by1vcGVuIG9uIGxvYWRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgb251bmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPYnNpZGlhbiBBSSBBZ2VudDogdW5sb2FkaW5nIHBsdWdpbicpO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5kZXRhY2hMZWF2ZXNPZlR5cGUoVklFV19UWVBFX0FJX0NIQVQpO1xuICAgICAgICB0aGlzLmVuZ2luZS5hYm9ydCgpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgbG9hZGVkID0gYXdhaXQgdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgbG9hZGVkIGFzIFBhcnRpYWw8QUlBZ2VudFNldHRpbmdzPik7XG5cbiAgICAgICAgLy8gTWVyZ2UgcGlwZWxpbmUgcHJvbXB0czoga2VlcCBkZWZhdWx0cyBmb3IgYW55IG1pc3Npbmcgc3RlcHNcbiAgICAgICAgaWYgKGxvYWRlZCAmJiAobG9hZGVkIGFzIGFueSkucGlwZWxpbmVQcm9tcHRzKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnBpcGVsaW5lUHJvbXB0cyA9IHtcbiAgICAgICAgICAgICAgICAuLi5ERUZBVUxUX1NFVFRJTkdTLnBpcGVsaW5lUHJvbXB0cyxcbiAgICAgICAgICAgICAgICAuLi4obG9hZGVkIGFzIGFueSkucGlwZWxpbmVQcm9tcHRzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHNhdmVTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5lbmdpbmU/LnVwZGF0ZVNldHRpbmdzKCk7XG4gICAgICAgIGlmICh0aGlzLmNoYXRWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLmNoYXRWaWV3LmFwcGx5U2V0dGluZ3MoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vID09PT09IFB1YmxpYyBBUEkgPT09PT1cblxuICAgIGdldEVuZ2luZSgpOiBQaXBlbGluZUVuZ2luZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZ2luZTtcbiAgICB9XG5cbiAgICBnZXRTZXNzaW9uTWFuYWdlcigpOiBTZXNzaW9uTWFuYWdlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb25NYW5hZ2VyO1xuICAgIH1cblxuICAgIGFkZE1lc3NhZ2VUb0FjdGl2ZVNlc3Npb24obXNnOiBNZXNzYWdlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHRoaXMuc2Vzc2lvbk1hbmFnZXIuZ2V0QWN0aXZlU2Vzc2lvbklkKCk7XG4gICAgICAgIGlmIChzZXNzaW9uSWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbk1hbmFnZXIuYWRkTWVzc2FnZShzZXNzaW9uSWQsIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVOZXdTZXNzaW9uKHRpdGxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbk1hbmFnZXIuY3JlYXRlU2Vzc2lvbih0aXRsZSk7XG4gICAgfVxuXG4gICAgc3dpdGNoU2Vzc2lvbihzZXNzaW9uSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlc3Npb25NYW5hZ2VyLnN3aXRjaFNlc3Npb24oc2Vzc2lvbklkKTtcbiAgICB9XG5cbiAgICBhc3luYyBhY3RpdmF0ZVZpZXcoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcblxuICAgICAgICBjb25zdCBleGlzdGluZyA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFX0FJX0NIQVQpO1xuICAgICAgICBpZiAoZXhpc3RpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd29ya3NwYWNlLnJldmVhbExlYWYoZXhpc3RpbmdbMF0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGVhZiA9IHdvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgICAgICBpZiAobGVhZikge1xuICAgICAgICAgICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFZJRVdfVFlQRV9BSV9DSEFULFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgQUlBZ2VudFNldHRpbmdzLCBQaXBlbGluZVN0ZXBJZCwgUGlwZWxpbmVTdGVwQ29uZmlnIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgdHlwZSB7IEFJQWdlbnRTZXR0aW5ncyB9O1xuXG5jb25zdCBQTEFOX1BST01QVCA9IGBcdTRGNjBcdTY2MkZcdTRFMDBcdTRGNERcdTRFMTNcdTRFMUFcdTc2ODRcdTUxODVcdTVCQjlcdTdCNTZcdTUyMTJcdTRFMTNcdTVCQjZcdTMwMDJcdTUyMDZcdTY3OTBcdTc1MjhcdTYyMzdcdTk3MDBcdTZDNDJcdUZGMENcdTUyMjRcdTY1QURcdTk3MDBcdTg5ODFcdTc1MUZcdTYyMTBcdTUxRTBcdTdCQzdcdTY1ODdcdTdBRTBcdTMwMDJcblxuXHU3NTI4XHU2MjM3XHU5NzAwXHU2QzQyXHVGRjFBe3t1c2VyX2lucHV0fX1cblxuXHU4OUM0XHU1MjE5XHVGRjFBXG4tIFx1NTk4Mlx1Njc5Q1x1NzUyOFx1NjIzN1x1NjYwRVx1Nzg2RVx1OEJGNFwiXHU1OTFBXHU3QkM3XCJcdTMwMDFcIk5cdTdCQzdcIlx1MzAwMVwiXHU1MUUwXHU3QkM3XCJcdUZGMENcdTYyMTZcdTgwMDVcdTk3MDBcdTZDNDJcdTY3MkNcdThFQUJcdTkwMDJcdTU0MDhcdTYyQzZcdTUyMDZcdTRFM0FcdTU5MUFcdTdCQzdcdTcyRUNcdTdBQ0JcdTY1ODdcdTdBRTBcdUZGMENcdTUyMTlcdThGOTNcdTUxRkFcdTU5MUFcdTdCQzdcdTY1ODdcdTdBRTBcdTc2ODRcdThCQTFcdTUyMTJcbi0gXHU1OTgyXHU2NzlDXHU3NTI4XHU2MjM3XHU5NzAwXHU2QzQyXHU1M0VGXHU0RUU1XHVGRjA4XHU0RTE0XHU1RTk0XHU4QkU1XHVGRjA5XHU3NTI4XHU0RTAwXHU3QkM3XHU1QjhDXHU2NTc0XHU3Njg0XHU2NTg3XHU3QUUwXHU4OTg2XHU3NkQ2XHVGRjBDXHU1MjE5XHU4RjkzXHU1MUZBXHU1MzU1XHU3QkM3XHU2NTg3XHU3QUUwXG4tIFx1NkJDRlx1N0JDN1x1NjU4N1x1N0FFMFx1OTBGRFx1OTcwMFx1ODk4MVx1RkYxQVx1NjgwN1x1OTg5OFx1MzAwMVx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFx1MzAwMVx1NEUzQlx1OTg5OFx1Njk4Mlx1OEZGMFxuXG5cdTRFRTUgSlNPTiBcdTY1NzBcdTdFQzRcdTY4M0NcdTVGMEZcdThGOTNcdTUxRkFcdUZGMENcdTRFMERcdTg5ODFcdTY3MDlcdTRFRkJcdTRGNTVcdTUxNzZcdTRFRDZcdTY1ODdcdTVCNTdcdUZGMUFcblt7XCJ0aXRsZVwiOiBcIlx1NjU4N1x1N0FFMFx1NjgwN1x1OTg5OFwiLCBcInBhdGhcIjogXCJcdTc2RUVcdTVGNTUvXHU2NTg3XHU0RUY2XHU1NDBELm1kXCIsIFwidG9waWNcIjogXCJcdTRFMDBcdTUzRTVcdThCRERcdTYzQ0ZcdThGRjBcdTY1ODdcdTdBRTBcdTY4MzhcdTVGQzNcdTUxODVcdTVCQjlcIn1dYDtcblxuY29uc3QgRFJBRlRfUFJPTVBUID0gYFx1NEY2MFx1NjYyRlx1NEUwMFx1NEY0RFx1OEQ0NFx1NkRGMVx1NjI4MFx1NjcyRlx1NjU4N1x1Njg2M1x1NjRCMFx1NTE5OVx1NEUxM1x1NUJCNlx1MzAwMlx1NjgzOVx1NjM2RVx1NEUwQlx1OTc2Mlx1NjNEMFx1NEY5Qlx1NzY4NFx1NEUzQlx1OTg5OFx1NTQ4Q1x1NzUyOFx1NjIzN1x1OTcwMFx1NkM0Mlx1RkYwQ1x1NjRCMFx1NTE5OVx1NEUwMFx1N0JDN1x1NUI4Q1x1NjU3NFx1NzY4NCBNYXJrZG93biBcdTY1ODdcdTdBRTBcdTMwMDJcblxuXHU2NTg3XHU3QUUwXHU2ODA3XHU5ODk4XHVGRjFBe3thcnRpY2xlX3RpdGxlfX1cblx1NjU4N1x1N0FFMFx1NEUzQlx1OTg5OFx1RkYxQXt7YXJ0aWNsZV90b3BpY319XG5cdTc1MjhcdTYyMzdcdTUzOUZcdTU5Q0JcdTk3MDBcdTZDNDJcdUZGMUF7e3VzZXJfaW5wdXR9fVxuXG5cdTUxOTlcdTRGNUNcdTg5ODFcdTZDNDJcdUZGMUFcbjEuIFx1NTQwOFx1NzQwNlx1NEY3Rlx1NzUyOFx1NjgwN1x1OTg5OFx1NUM0Mlx1N0VBN1x1RkYwOCMgXHUyMTkyICMjIFx1MjE5MiAjIyNcdUZGMDlcdUZGMENcdTdFRDNcdTY3ODRcdTZFMDVcdTY2NzBcbjIuIFx1NTE4NVx1NUJCOVx1NEUzMFx1NUJDQ1x1OEJFNlx1NUI5RVx1RkYwQ1x1NjNEMFx1NEY5Qlx1NTE3N1x1NEY1M1x1NzkzQVx1NEY4Qlx1NTQ4Q1x1NEVFM1x1NzgwMVx1NzI0N1x1NkJCNVx1RkYwOFx1NTk4Mlx1OTAwMlx1NzUyOFx1RkYwOVxuMy4gXHU4QkVEXHU4QTAwXHU0RTEzXHU0RTFBXHU0RjQ2XHU2NjEzXHU2MUMyXHVGRjBDXHU3NTI4XHU0RTJEXHU2NTg3XHU0RTY2XHU1MTk5XG40LiBcdTRGN0ZcdTc1MjggTWFya2Rvd24gXHU2ODA3XHU1MUM2XHU2ODNDXHU1RjBGXHVGRjBDXHU0RUUzXHU3ODAxXHU1NzU3XHU2ODA3XHU2Q0U4XHU4QkVEXHU4QTAwXHU3QzdCXHU1NzhCXG41LiBcdTU5ODJcdTY3MDlcdTVGQzVcdTg5ODFcdUZGMENcdTRGN0ZcdTc1MjhcdTg4NjhcdTY4M0NcdTY1NzRcdTc0MDZcdTVCRjlcdTZCRDRcdTRGRTFcdTYwNkZcblxuXHU3NkY0XHU2M0E1XHU4RjkzXHU1MUZBXHU2NTg3XHU3QUUwXHU2QjYzXHU2NTg3XHVGRjBDXHU0RTBEXHU4OTgxXHU1MkEwXCJcdThGRDlcdTY2MkZcdTc1MUZcdTYyMTBcdTc2ODRcdTY1ODdcdTdBRTBcIlx1NEU0Qlx1N0M3Qlx1NzY4NFx1NTI0RFx1N0YwMFx1MzAwMmA7XG5cbmNvbnN0IFBPTElTSF9QUk9NUFQgPSBgXHU0RjYwXHU2NjJGXHU0RTAwXHU0RjREXHU2NTg3XHU2ODYzXHU3RjhFXHU1MzE2XHU0RTBFXHU3N0U1XHU4QkM2XHU1M0VGXHU4OUM2XHU1MzE2XHU0RTEzXHU1QkI2XHUzMDAyXHU1QkY5XHU0RUU1XHU0RTBCXHU2NTg3XHU3QUUwXHU4RkRCXHU4ODRDXHU2REE2XHU4MjcyXHU1NDhDXHU1ODlFXHU1RjNBXHUzMDAyXG5cblx1NjU4N1x1N0FFMFx1NjgwN1x1OTg5OFx1RkYxQXt7YXJ0aWNsZV90aXRsZX19XG5cdTY1ODdcdTdBRTBcdThERUZcdTVGODRcdUZGMUF7e2FydGljbGVfcGF0aH19XG5cblx1NTM5Rlx1NjU4N1x1NTE4NVx1NUJCOVx1RkYxQVxue3tkcmFmdF9jb250ZW50fX1cblxuXHU2REE2XHU4MjcyXHU4OTgxXHU2QzQyXHVGRjFBXG4xLiBcdTU3MjhcdTU0MDhcdTkwMDJcdTRGNERcdTdGNkVcdTYzRDJcdTUxNjUgbWluZG1hcCBcdTYwMURcdTdFRjRcdTVCRkNcdTU2RkVcdUZGMDhcXGBcXGBcXGBtZXJtYWlkIG1pbmRtYXAgLi4uIFxcYFxcYFxcYFx1RkYwOVx1RkYwQ1x1NUUyRVx1NTJBOVx1OEJGQlx1ODAwNVx1NUZFQlx1OTAxRlx1NjI4QVx1NjNFMVx1NjU4N1x1N0FFMFx1N0VEM1x1Njc4NFxuMi4gXHU1NzI4XHU1NDA4XHU5MDAyXHU0RjREXHU3RjZFXHU2M0QyXHU1MTY1IE1lcm1haWQgXHU1NkZFXHU4ODY4XHVGRjA4Zmxvd2NoYXJ0L3NlcXVlbmNlRGlhZ3JhbS9jbGFzc0RpYWdyYW0vZ2FudHQvcGllIFx1N0I0OVx1RkYwOVx1RkYwQ1x1NUMwNlx1NjU4N1x1NUI1N1x1NjNDRlx1OEZGMFx1OEY2Q1x1NEUzQVx1NTNFRlx1ODlDNlx1NTMxNlxuMy4gXHU1NzI4XHU5MUNEXHU3MEI5XHUzMDAxXHU2Q0U4XHU2MTBGXHUzMDAxXHU2M0QwXHU3OTNBXHUzMDAxXHU4QjY2XHU1NDRBXHU1OTA0XHU2REZCXHU1MkEwIE9ic2lkaWFuIGNhbGxvdXQgXHU1NzU3XHVGRjA4PiBbIW5vdGVdXHUzMDAxPiBbIXRpcF1cdTMwMDE+IFshd2FybmluZ11cdTMwMDE+IFshaW1wb3J0YW50XVx1MzAwMT4gWyFpbmZvXSBcdTdCNDlcdUZGMDlcbjQuIFx1NEYxOFx1NTMxNlx1NjM5Mlx1NzI0OFx1RkYxQVx1NkJCNVx1ODQzRFx1OTU3Rlx1NzdFRFx1OTAwMlx1NEUyRFx1RkYwQ1x1NTIxN1x1ODg2OFx1NjgzQ1x1NUYwRlx1NkUwNVx1NjY3MFx1RkYwQ1x1NUYxNVx1NzUyOFx1NTQ4Q1x1NUYzQVx1OEMwM1x1NUY5N1x1NUY1M1xuNS4gXHU0RkREXHU2MzAxXHU1MzlGXHU2NTg3XHU3Njg0XHU2ODM4XHU1RkMzXHU0RkUxXHU2MDZGXHU1NDhDXHU3RUQzXHU2Nzg0XHU0RTBEXHU1M0Q4XG5cblx1NzZGNFx1NjNBNVx1OEY5M1x1NTFGQVx1NkRBNlx1ODI3Mlx1NTQwRVx1NzY4NFx1NUI4Q1x1NjU3NFx1NjU4N1x1N0FFMFx1MzAwMmA7XG5cbmNvbnN0IENIRUNLX1BST01QVCA9IGBcdTRGNjBcdTY2MkZcdTRFMDBcdTRGNEQgTWFya2Rvd24gXHU4QkVEXHU2Q0Q1XHU2OEMwXHU2N0U1XHU0RTEzXHU1QkI2XHUzMDAyXHU0RUQ0XHU3RUM2XHU2OEMwXHU2N0U1XHU0RUU1XHU0RTBCXHU2NTg3XHU3QUUwXHU3Njg0XHU4QkVEXHU2Q0Q1XHU5NUVFXHU5ODk4XHU1RTc2XHU0RkVFXHU1OTBEXHUzMDAyXG5cblx1NjU4N1x1N0FFMFx1OERFRlx1NUY4NFx1RkYxQXt7YXJ0aWNsZV9wYXRofX1cblxuXHU1MzlGXHU2NTg3XHU1MTg1XHU1QkI5XHVGRjFBXG57e2RyYWZ0X2NvbnRlbnR9fVxuXG5cdTY4QzBcdTY3RTVcdTZFMDVcdTUzNTVcdUZGMUFcbjEuIFx1NjgwN1x1OTg5OFx1NUM0Mlx1N0VBN1x1NjYyRlx1NTQyNlx1OEZERVx1N0VFRFx1RkYwOFx1NEUwRFx1OERGM1x1N0VBN1x1RkYwQ1x1NTk4MiAjIFx1NTQwRVx1NzZGNFx1NjNBNSAjIyMgXHU5NzAwXHU4OTgxXHU0RkVFXHU2QjYzXHVGRjA5XG4yLiBcdTRFRTNcdTc4MDFcdTU3NTdcdTY2MkZcdTU0MjZcdTZCNjNcdTc4NkVcdTk1RURcdTU0MDhcdUZGMDhcXGBcXGBcXGAgXHU2NjJGXHU1NDI2XHU2MjEwXHU1QkY5XHU1MUZBXHU3M0IwXHVGRjBDXHU4QkVEXHU4QTAwXHU2ODA3XHU2Q0U4XHU2NjJGXHU1NDI2XHU5MDU3XHU2RjBGXHVGRjA5XG4zLiBNZXJtYWlkIFx1NTZGRVx1ODg2OFx1OEJFRFx1NkNENVx1NjYyRlx1NTQyNlx1NkI2M1x1Nzg2RVx1RkYwOG1pbmRtYXAgXHU3RjI5XHU4RkRCXHUzMDAxZmxvd2NoYXJ0IFx1N0JBRFx1NTkzNFx1MzAwMVx1ODI4Mlx1NzBCOVx1NUI5QVx1NEU0OVx1N0I0OVx1RkYwOVxuNC4gQ2FsbG91dCBcdThCRURcdTZDRDVcdTY2MkZcdTU0MjZcdTZCNjNcdTc4NkVcdUZGMDg+IFshdHlwZV0gXHU2ODNDXHU1RjBGXHUzMDAxXHU2ODA3XHU5ODk4XHU4ODRDXHUzMDAxXHU1MTg1XHU1QkI5XHU3RjI5XHU4RkRCXHVGRjA5XG41LiBcdTg4NjhcdTY4M0NcdTY4M0NcdTVGMEZcdTY2MkZcdTU0MjZcdTZCNjNcdTc4NkVcdUZGMDhcdTUyMTdcdTVCRjlcdTlGNTBcdTMwMDFcdTUyMDZcdTk2OTRcdTg4NEMgfC0tLXwtLS18XHVGRjA5XG42LiBcdTUxODVcdTkwRThcdTk0RkVcdTYzQTVcdTY4M0NcdTVGMEZcdTY2MkZcdTU0MjZcdTg5QzRcdTgzMDNcdUZGMDhbW3dpa2lsaW5rXV0gXHU2ODNDXHU1RjBGXHVGRjA5XG43LiBcdTY3MDlcdTY1RTBcdTY2MEVcdTY2M0VcdTc2ODQgTWFya2Rvd24gXHU2ODNDXHU1RjBGXHU5NTE5XHU4QkVGXHVGRjA4XHU1MjE3XHU4ODY4XHU3RjI5XHU4RkRCXHUzMDAxXHU1MkEwXHU3Qzk3L1x1NjU5Q1x1NEY1M1x1NjcyQVx1OTVFRFx1NTQwOFx1N0I0OVx1RkYwOVxuXG5cdTU5ODJcdTUzRDFcdTczQjBcdTk1RUVcdTk4OThcdUZGMENcdTc2RjRcdTYzQTVcdTRGRUVcdTU5MERcdTU0MEVcdThGOTNcdTUxRkFcdTVCOENcdTY1NzRcdTY1ODdcdTdBRTBcdTMwMDJcdTU5ODJcdTY1RTBcdTk1RUVcdTk4OThcdUZGMENcdThGOTNcdTUxRkFcdTUzOUZcdTY1ODdcdTRFMERcdTUzRDhcdTMwMDJgO1xuXG5jb25zdCBMSU5LX1BST01QVCA9IGBcdTRGNjBcdTY2MkZcdTRFMDBcdTRGNERcdTc3RTVcdThCQzZcdTdCQTFcdTc0MDZcdTRFMTNcdTVCQjZcdTMwMDJcdTRFM0FcdTRFMDBcdTdFQzRcdTdDRkJcdTUyMTdcdTY1ODdcdTdBRTBcdTZERkJcdTUyQTBcdTc2RjhcdTRFOTJcdTRFNEJcdTk1RjRcdTc2ODRcdTRFQTRcdTUzQzlcdTVGMTVcdTc1MjhcdTk0RkVcdTYzQTVcdTMwMDJcblxuXHU2MjQwXHU2NzA5XHU2NTg3XHU3QUUwXHU3Njg0XHU4REVGXHU1Rjg0XHU1NDhDXHU1MTg1XHU1QkI5XHVGRjFBXG57e2FsbF9hcnRpY2xlc319XG5cblx1ODk4MVx1NkM0Mlx1RkYxQVxuMS4gXHU1NzI4XHU2QkNGXHU3QkM3XHU2NTg3XHU3QUUwXHU3Njg0XHU2QjYzXHU2NTg3XHU0RTJEXHVGRjBDXHU5MDQ3XHU1MjMwXHU1MTc2XHU0RUQ2XHU2NTg3XHU3QUUwXHU4OTg2XHU3NkQ2XHU3Njg0XHU0RTNCXHU5ODk4XHU2NUY2XHVGRjBDXHU4MUVBXHU3MTM2XHU1NzMwXHU1NzI4XHU2NTg3XHU1QjU3XHU0RTJEXHU2REZCXHU1MkEwIFtbXHU1MTc2XHU0RUQ2XHU2NTg3XHU3QUUwXHU4REVGXHU1Rjg0fFx1NjYzRVx1NzkzQVx1NjU4N1x1NUI1N11dIFx1NzY4NFx1NTE4NVx1OTBFOFx1OTRGRVx1NjNBNVxuMi4gXHU1NzI4XHU2QkNGXHU3QkM3XHU2NTg3XHU3QUUwXHU2NzJCXHU1QzNFXHU2REZCXHU1MkEwXCIjIyBcdTc2RjhcdTUxNzNcdTY1ODdcdTdBRTBcIlx1OTBFOFx1NTIwNlx1RkYwQ1x1NTIxN1x1NTFGQVx1NjMwN1x1NTQxMVx1NTE3Nlx1NEVENlx1NjU4N1x1N0FFMFx1NzY4NFx1OTRGRVx1NjNBNVx1NUU3Nlx1OTY0NFx1N0I4MFx1ODk4MVx1OEJGNFx1NjYwRVxuMy4gXHU5NEZFXHU2M0E1XHU1RTk0XHU1RjUzXHU4MUVBXHU3MTM2XHUzMDAxXHU2NzA5XHU2MTBGXHU0RTQ5XHVGRjBDXHU0RTBEXHU1RjNBXHU4ODRDXHU2M0QyXHU1MTY1XG40LiBcdTRFMERcdTRGRUVcdTY1MzlcdTY1ODdcdTdBRTBcdTc2ODRcdTVCOUVcdThEMjhcdTUxODVcdTVCQjlcdUZGMDhcdTk2NjRcdTZERkJcdTUyQTBcdTk0RkVcdTYzQTVcdTU5MTZcdUZGMDlcblxuXHU4QkY3XHU4RjkzXHU1MUZBXHU0RkVFXHU2NTM5XHU1NDBFXHU3Njg0XHU2MjQwXHU2NzA5XHU2NTg3XHU3QUUwXHVGRjBDXHU2ODNDXHU1RjBGXHU1OTgyXHU0RTBCXHVGRjFBXG4tLS1GSUxFOlx1OERFRlx1NUY4NDEtLS1cblx1NEZFRVx1NjUzOVx1NTQwRVx1NzY4NFx1NTE4NVx1NUJCOTFcbi0tLUZJTEU6XHU4REVGXHU1Rjg0Mi0tLVxuXHU0RkVFXHU2NTM5XHU1NDBFXHU3Njg0XHU1MTg1XHU1QkI5MmA7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BJUEVMSU5FX1BST01QVFM6IFJlY29yZDxQaXBlbGluZVN0ZXBJZCwgUGlwZWxpbmVTdGVwQ29uZmlnPiA9IHtcbiAgICBwbGFuOiB7XG4gICAgICAgIGlkOiAncGxhbicsXG4gICAgICAgIG5hbWU6ICdcdTc1MUZcdTYyMTBcdThCQTFcdTUyMTInLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTIwNlx1Njc5MFx1NzUyOFx1NjIzN1x1OTcwMFx1NkM0Mlx1RkYwQ1x1NzUxRlx1NjIxMFx1NTkxQVx1N0JDN1x1NjU4N1x1N0FFMFx1NzY4NFx1NEUzQlx1OTg5OFx1MzAwMVx1OERFRlx1NUY4NFx1NTQ4Q1x1Njk4Mlx1OEZGMFx1RkYwOFx1NEVDNVx1NTkxQVx1N0JDN1x1NjVGNlx1NjI2N1x1ODg0Q1x1RkYwOScsXG4gICAgICAgIHByb21wdFRlbXBsYXRlOiBQTEFOX1BST01QVCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICB9LFxuICAgIGRyYWZ0OiB7XG4gICAgICAgIGlkOiAnZHJhZnQnLFxuICAgICAgICBuYW1lOiAnXHU3NTFGXHU2MjEwXHU4MzQ5XHU3QTNGJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdcdTY4MzlcdTYzNkVcdTRFM0JcdTk4OThcdTc1MUZcdTYyMTBcdTY1ODdcdTdBRTBcdTUyMURcdTdBM0YnLFxuICAgICAgICBwcm9tcHRUZW1wbGF0ZTogRFJBRlRfUFJPTVBULFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gICAgcG9saXNoOiB7XG4gICAgICAgIGlkOiAncG9saXNoJyxcbiAgICAgICAgbmFtZTogJ1x1NkRBNlx1ODI3Mlx1NTg5RVx1NUYzQScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2REZCXHU1MkEwIG1pbmRtYXBcdTMwMDFNZXJtYWlkIFx1NTZGRVx1ODg2OFx1MzAwMWNhbGxvdXQgXHU2M0QwXHU3OTNBXHU1NzU3JyxcbiAgICAgICAgcHJvbXB0VGVtcGxhdGU6IFBPTElTSF9QUk9NUFQsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICBjaGVjazoge1xuICAgICAgICBpZDogJ2NoZWNrJyxcbiAgICAgICAgbmFtZTogJ1x1OEJFRFx1NkNENVx1NjhDMFx1NjdFNScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU2OEMwXHU2N0U1XHU1RTc2XHU0RkVFXHU1OTBEIE1hcmtkb3duIFx1OEJFRFx1NkNENVx1OTVFRVx1OTg5OCcsXG4gICAgICAgIHByb21wdFRlbXBsYXRlOiBDSEVDS19QUk9NUFQsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICBsaW5rOiB7XG4gICAgICAgIGlkOiAnbGluaycsXG4gICAgICAgIG5hbWU6ICdcdTY1ODdcdTdBRTBcdTk0RkVcdTYzQTUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NTcyOFx1NTkxQVx1N0JDN1x1NjU4N1x1N0FFMFx1NEU0Qlx1OTVGNFx1NkRGQlx1NTJBMCBbW3dpa2lsaW5rXV0gXHU3NkY4XHU0RTkyXHU1RjE1XHU3NTI4JyxcbiAgICAgICAgcHJvbXB0VGVtcGxhdGU6IExJTktfUFJPTVBULFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgIH0sXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogQUlBZ2VudFNldHRpbmdzID0ge1xuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ2RlZXBzZWVrJyxcbiAgICAgICAgICAgIG5hbWU6ICdEZWVwU2VlaycsXG4gICAgICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZGVlcHNlZWsuY29tJyxcbiAgICAgICAgICAgIGFwaUtleTogJyRERUVQU0VFS19BUElfS0VZJyxcbiAgICAgICAgICAgIG1vZGVsczogWydkZWVwc2Vlay12NC1wcm8nLCAnZGVlcHNlZWstdjQtZmxhc2gnXSxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnb3BlbmFpJyxcbiAgICAgICAgICAgIG5hbWU6ICdPcGVuQUknLFxuICAgICAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEnLFxuICAgICAgICAgICAgYXBpS2V5OiAnJE9QRU5BSV9BUElfS0VZJyxcbiAgICAgICAgICAgIG1vZGVsczogWydncHQtNG8nLCAnZ3B0LTRvLW1pbmknLCAnZ3B0LTQtdHVyYm8nXSxcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgZGVmYXVsdFByb3ZpZGVyOiAnZGVlcHNlZWsnLFxuICAgIGRlZmF1bHRNb2RlbDogJ2F1dG8nLFxuXG4gICAgdGVtcGVyYXR1cmU6IDAuNyxcbiAgICB0b3BQOiAxLFxuICAgIG1heFRva2VuczogNDA5NixcbiAgICBjb250ZXh0V2luZG93U2l6ZTogNTAsXG5cbiAgICBzaG93VGhpbmtpbmc6IGZhbHNlLFxuICAgIHNob3dDb3N0SW5mbzogdHJ1ZSxcblxuICAgIGZvbnRTaXplOiAnbWVkaXVtJyxcblxuICAgIG1heFJldHJpZXM6IDMsXG4gICAgcmVxdWVzdFRpbWVvdXQ6IDEyMCxcbiAgICBjb21wcmVzc1RocmVzaG9sZDogNTAwMDAsXG5cbiAgICBwaXBlbGluZVByb21wdHM6IERFRkFVTFRfUElQRUxJTkVfUFJPTVBUUyxcblxuICAgIG1jcFNlcnZlcnM6IFtdLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVBcGlLZXkoYXBpS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChhcGlLZXkuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgIGNvbnN0IGVudlZhciA9IGFwaUtleS5zbGljZSgxKTtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnY/LltlbnZWYXJdKSB8fCAnJztcbiAgICB9XG4gICAgcmV0dXJuIGFwaUtleTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSBBSUFnZW50UGx1Z2luIGZyb20gJy4uL21haW4nO1xuaW1wb3J0IHsgQUlQcm92aWRlciwgTUNQU2VydmVyQ29uZmlnLCBQaXBlbGluZVN0ZXBJZCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IERFRkFVTFRfUElQRUxJTkVfUFJPTVBUUywgcmVzb2x2ZUFwaUtleSB9IGZyb20gJy4vc2V0dGluZ3Mtc3RvcmUnO1xuXG5jb25zdCBTVEVQX09SREVSOiBQaXBlbGluZVN0ZXBJZFtdID0gWydwbGFuJywgJ2RyYWZ0JywgJ3BvbGlzaCcsICdjaGVjaycsICdsaW5rJ107XG5cbmV4cG9ydCBjbGFzcyBBSUFnZW50U2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHBsdWdpbjogQUlBZ2VudFBsdWdpbjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEFJQWdlbnRQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgICAgICBjb250YWluZXJFbC5hZGRDbGFzcygnYWktYWdlbnQtc2V0dGluZ3MnKTtcblxuICAgICAgICB0aGlzLnJlbmRlclByb3ZpZGVyU2VjdGlvbihjb250YWluZXJFbCk7XG4gICAgICAgIHRoaXMucmVuZGVyTW9kZWxTZWN0aW9uKGNvbnRhaW5lckVsKTtcbiAgICAgICAgdGhpcy5yZW5kZXJQaXBlbGluZVNlY3Rpb24oY29udGFpbmVyRWwpO1xuICAgICAgICB0aGlzLnJlbmRlck1DUFNlY3Rpb24oY29udGFpbmVyRWwpO1xuICAgICAgICB0aGlzLnJlbmRlclVJU2VjdGlvbihjb250YWluZXJFbCk7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gUHJvdmlkZXIgU2VjdGlvbiA9PT09PVxuICAgIHByaXZhdGUgcmVuZGVyUHJvdmlkZXJTZWN0aW9uKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdBSSBcdTY3MERcdTUyQTFcdTU1NDYnIH0pO1xuXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyTGlzdCA9IGVsLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXByb3ZpZGVyLWxpc3QnIH0pO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmQgPSBwcm92aWRlckxpc3QuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtcHJvdmlkZXItY2FyZCcgfSk7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXByb3ZpZGVyLWhlYWRlcicgfSk7XG5cbiAgICAgICAgICAgIGhlYWRlci5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6IHByb3ZpZGVyLm5hbWUgfSk7XG4gICAgICAgICAgICBuZXcgU2V0dGluZyhjYXJkKVxuICAgICAgICAgICAgICAgIC5zZXROYW1lKCdcdTU0MkZcdTc1MjgnKVxuICAgICAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocHJvdmlkZXIuZW5hYmxlZClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIuZW5hYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgbmV3IFNldHRpbmcoY2FyZClcbiAgICAgICAgICAgICAgICAuc2V0TmFtZSgnQVBJIFx1NTczMFx1NTc0MCcpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoJ1x1NTE3Q1x1NUJCOSBPcGVuQUkgXHU2M0E1XHU1M0UzXHU2ODNDXHU1RjBGXHU3Njg0IEJhc2UgVVJMJylcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdodHRwczovL2FwaS5kZWVwc2Vlay5jb20nKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocHJvdmlkZXIuYmFzZVVybClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIuYmFzZVVybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgY29uc3QgYXBpS2V5U2V0dGluZyA9IG5ldyBTZXR0aW5nKGNhcmQpXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoJ0FQSSBLZXknKVxuICAgICAgICAgICAgICAgIC5zZXREZXNjKCdcdTc2RjRcdTYzQTVcdTU4NkJcdTUxNjUgS2V5XHVGRjBDXHU2MjE2XHU0RjdGXHU3NTI4ICRcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTU0MEQgXHU1RjE1XHU3NTI4XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHVGRjA4XHU1OTgyICRERUVQU0VFS19BUElfS0VZXHVGRjA5JylcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5zZXRQbGFjZWhvbGRlcignJERFRVBTRUVLX0FQSV9LRVknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHByb3ZpZGVyLmFwaUtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlci5hcGlLZXkgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmVBcGlLZXkodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvbHZlZCAmJiB2YWx1ZS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpS2V5U2V0dGluZy5zZXREZXNjKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRiAke3ZhbHVlLnNsaWNlKDEpfSBcdTIxOTIgJHtyZXNvbHZlZC5zbGljZSgwLCA0KX0keycqJy5yZXBlYXQoTWF0aC5taW4ocmVzb2x2ZWQubGVuZ3RoIC0gOCwgMjApKX0ke3Jlc29sdmVkLnNsaWNlKC00KX1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpS2V5U2V0dGluZy5zZXREZXNjKCdcdTc2RjRcdTYzQTVcdTU4NkJcdTUxNjUgS2V5XHVGRjBDXHU2MjE2XHU0RjdGXHU3NTI4ICRcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTU0MEQgXHU1RjE1XHU3NTI4XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHVGRjA4XHU1OTgyICRERUVQU0VFS19BUElfS0VZXHVGRjA5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuaW5wdXRFbC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZUFwaUtleShwcm92aWRlci5hcGlLZXkpO1xuICAgICAgICAgICAgaWYgKHJlc29sdmVkICYmIHByb3ZpZGVyLmFwaUtleS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICBhcGlLZXlTZXR0aW5nLnNldERlc2MoXG4gICAgICAgICAgICAgICAgICAgIGBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0YgJHtwcm92aWRlci5hcGlLZXkuc2xpY2UoMSl9IFx1MjE5MiAke3Jlc29sdmVkLnNsaWNlKDAsIDQpfSR7JyonLnJlcGVhdChNYXRoLm1pbihyZXNvbHZlZC5sZW5ndGggLSA4LCAyMCkpfSR7cmVzb2x2ZWQuc2xpY2UoLTQpfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXcgU2V0dGluZyhjYXJkKVxuICAgICAgICAgICAgICAgIC5zZXROYW1lKCdcdTZBMjFcdTU3OEJcdTUyMTdcdTg4NjgnKVxuICAgICAgICAgICAgICAgIC5zZXREZXNjKCdcdTkwMTdcdTUzRjdcdTUyMDZcdTk2OTRcdTc2ODRcdTZBMjFcdTU3OEJcdTU0MERcdTc5RjBcdTUyMTdcdTg4NjgnKVxuICAgICAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ2RlZXBzZWVrLWNoYXQsIGRlZXBzZWVrLXJlYXNvbmVyJylcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHByb3ZpZGVyLm1vZGVscy5qb2luKCcsICcpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlci5tb2RlbHMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChtID0+IG0udHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBpZiAoIXByb3ZpZGVyLmlkLnN0YXJ0c1dpdGgoJ2J1aWx0aW4tJykpIHtcbiAgICAgICAgICAgICAgICBuZXcgU2V0dGluZyhjYXJkKVxuICAgICAgICAgICAgICAgICAgICAuc2V0TmFtZSgnXHU1MjIwXHU5NjY0XHU2NzBEXHU1MkExXHU1NTQ2JylcbiAgICAgICAgICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnXHU1MjIwXHU5NjY0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRXYXJuaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm92aWRlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVmYXVsdFByb3ZpZGVyID09PSBwcm92aWRlci5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0UHJvdmlkZXIgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm92aWRlcnNbMF0/LmlkIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnXHU2REZCXHU1MkEwXHU2NzBEXHU1MkExXHU1NTQ2JylcbiAgICAgICAgICAgIC5zZXREZXNjKCdcdTZERkJcdTUyQTBcdTUxN0NcdTVCQjkgT3BlbkFJIEFQSSBcdTY4M0NcdTVGMEZcdTc2ODRcdTgxRUFcdTVCOUFcdTRFNDlcdTY3MERcdTUyQTFcdTU1NDYnKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1x1NkRGQlx1NTJBMCcpXG4gICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQcm92aWRlcjogQUlQcm92aWRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBgY3VzdG9tLSR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1x1NjVCMFx1NjcwRFx1NTJBMVx1NTU0NicsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vdjEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpS2V5OiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsczogWydncHQtMy41LXR1cmJvJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvdmlkZXJzLnB1c2gobmV3UHJvdmlkZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8vID09PT09IE1vZGVsIFNlY3Rpb24gPT09PT1cbiAgICBwcml2YXRlIHJlbmRlck1vZGVsU2VjdGlvbihlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgZWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnXHU2QTIxXHU1NzhCXHU1M0MyXHU2NTcwJyB9KTtcblxuICAgICAgICBjb25zdCBlbmFibGVkUHJvdmlkZXJzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvdmlkZXJzLmZpbHRlcihwID0+IHAuZW5hYmxlZCk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnXHU5RUQ4XHU4QkE0XHU2NzBEXHU1MkExXHU1NTQ2JylcbiAgICAgICAgICAgIC5hZGREcm9wZG93bihkcm9wZG93biA9PiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZFByb3ZpZGVycy5mb3JFYWNoKHAgPT4gZHJvcGRvd24uYWRkT3B0aW9uKHAuaWQsIHAubmFtZSkpO1xuICAgICAgICAgICAgICAgIGlmIChlbmFibGVkUHJvdmlkZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJycsICdcdUZGMDhcdTY1RTBcdTUzRUZcdTc1MjhcdTY3MERcdTUyQTFcdTU1NDZcdUZGMDknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVmYXVsdFByb3ZpZGVyKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0UHJvdmlkZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFByb3ZpZGVyID0gZW5hYmxlZFByb3ZpZGVycy5maW5kKHAgPT4gcC5pZCA9PT0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVmYXVsdFByb3ZpZGVyKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhlbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdcdTlFRDhcdThCQTRcdTZBMjFcdTU3OEInKVxuICAgICAgICAgICAgLnNldERlc2MoJ0F1dG8gPSBcdTgxRUFcdTUyQThcdTkwMDlcdTYyRTkgUHJvXHVGRjA4XHU1OTBEXHU2NzQyXHU0RUZCXHU1MkExXHVGRjA5XHU2MjE2IEZsYXNoXHVGRjA4XHU3QjgwXHU1MzU1XHU0RUZCXHU1MkExXHVGRjA5JylcbiAgICAgICAgICAgIC5hZGREcm9wZG93bihkcm9wZG93biA9PiB7XG4gICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdhdXRvJywgJ0F1dG8gLSBcdTgxRUFcdTUyQThcdTkwMDlcdTYyRTknKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQcm92aWRlci5tb2RlbHMuZm9yRWFjaChtID0+IGRyb3Bkb3duLmFkZE9wdGlvbihtLCBtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlZmF1bHRNb2RlbCB8fCAnYXV0bycpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlZmF1bHRNb2RlbCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnVGVtcGVyYXR1cmUnKVxuICAgICAgICAgICAgLnNldERlc2MoJ1x1NjNBN1x1NTIzNlx1NzUxRlx1NjIxMFx1OTY4Rlx1NjczQVx1NjAyN1x1RkYwQzA9XHU3ODZFXHU1QjlBXHU2MDI3XHVGRjBDMj1cdTY3MDBcdTU5MjdcdTk2OEZcdTY3M0FcdTYwMjcnKVxuICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXG4gICAgICAgICAgICAgICAgLnNldExpbWl0cygwLCAyLCAwLjA1KVxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wZXJhdHVyZSlcbiAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGVyYXR1cmUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ1RvcCBQJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdcdTY4MzhcdTkxQzdcdTY4MzdcdTUzQzJcdTY1NzBcdUZGMEMwLTEnKVxuICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXG4gICAgICAgICAgICAgICAgLnNldExpbWl0cygwLCAxLCAwLjA1KVxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50b3BQKVxuICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50b3BQID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhlbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdcdTY3MDBcdTU5MjcgVG9rZW4gXHU2NTcwJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdcdTZCQ0ZcdTZCMjFcdTc1MUZcdTYyMTBcdTc2ODRcdTY3MDBcdTU5MjcgVG9rZW4gXHU2NTcwXHU5MUNGJylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignNDA5NicpXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhUb2tlbnMpKVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bSkgJiYgbnVtID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4VG9rZW5zID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnXHU4QkY3XHU2QzQyXHU4RDg1XHU2NUY2XHVGRjA4XHU3OUQyXHVGRjA5JylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignMTIwJylcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlcXVlc3RUaW1lb3V0KSlcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG51bSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW0pICYmIG51bSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnJlcXVlc3RUaW1lb3V0ID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnXHU1OTMxXHU4RDI1XHU5MUNEXHU4QkQ1XHU2QjIxXHU2NTcwJylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignMycpXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhSZXRyaWVzKSlcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG51bSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW0pICYmIG51bSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhSZXRyaWVzID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gUGlwZWxpbmUgU2VjdGlvbiA9PT09PVxuICAgIHByaXZhdGUgcmVuZGVyUGlwZWxpbmVTZWN0aW9uKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdcdTZENDFcdTZDMzRcdTdFQkYgUHJvbXB0IFx1OTE0RFx1N0Y2RScgfSk7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdwJywgeyB0ZXh0OiAnXHU2QkNGXHU0RTJBXHU2QjY1XHU5QUE0XHU0RjdGXHU3NTI4XHU3MkVDXHU3QUNCIFByb21wdFx1RkYwQ1x1NjUyRlx1NjMwMVx1NTNEOFx1OTFDRlx1NjZGRlx1NjM2Mlx1MzAwMlx1NEZFRVx1NjUzOVx1NTQwRVx1NTNFRlx1ODFFQVx1NUI5QVx1NEU0OSBBSSBcdTU3MjhcdTU0MDRcdTZCNjVcdTlBQTRcdTc2ODRcdTg4NENcdTRFM0FcdTMwMDInIH0pO1xuXG4gICAgICAgIGNvbnN0IHZhckhlbHAgPSBlbC5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1waXBlbGluZS12YXJzJyB9KTtcbiAgICAgICAgdmFySGVscC5jcmVhdGVFbCgncCcsIHsgdGV4dDogJ1x1NTNFRlx1NzUyOFx1NTNEOFx1OTFDRlx1RkYxQScgfSk7XG4gICAgICAgIGNvbnN0IHZhcnMgPSB2YXJIZWxwLmNyZWF0ZUVsKCd1bCcpO1xuICAgICAgICB2YXJzLmNyZWF0ZUVsKCdsaScsIHsgdGV4dDogJ3t7dXNlcl9pbnB1dH19IFx1MjAxNCBcdTc1MjhcdTYyMzdcdTUzOUZcdTU5Q0JcdThGOTNcdTUxNjUnIH0pO1xuICAgICAgICB2YXJzLmNyZWF0ZUVsKCdsaScsIHsgdGV4dDogJ3t7YXJ0aWNsZV90aXRsZX19IFx1MjAxNCBcdTVGNTNcdTUyNERcdTY1ODdcdTdBRTBcdTY4MDdcdTk4OTgnIH0pO1xuICAgICAgICB2YXJzLmNyZWF0ZUVsKCdsaScsIHsgdGV4dDogJ3t7YXJ0aWNsZV90b3BpY319IFx1MjAxNCBcdTVGNTNcdTUyNERcdTY1ODdcdTdBRTBcdTRFM0JcdTk4OTgnIH0pO1xuICAgICAgICB2YXJzLmNyZWF0ZUVsKCdsaScsIHsgdGV4dDogJ3t7YXJ0aWNsZV9wYXRofX0gXHUyMDE0IFx1NUY1M1x1NTI0RFx1NjU4N1x1N0FFMFx1OERFRlx1NUY4NCcgfSk7XG4gICAgICAgIHZhcnMuY3JlYXRlRWwoJ2xpJywgeyB0ZXh0OiAne3tkcmFmdF9jb250ZW50fX0gXHUyMDE0IFx1NUY1M1x1NTI0RFx1NjU4N1x1N0FFMFx1NTE4NVx1NUJCOVx1RkYwOFx1NkRBNlx1ODI3Mi9cdTY4QzBcdTY3RTVcdTZCNjVcdTlBQTRcdUZGMDknIH0pO1xuICAgICAgICB2YXJzLmNyZWF0ZUVsKCdsaScsIHsgdGV4dDogJ3t7YWxsX2FydGljbGVzfX0gXHUyMDE0IFx1NjI0MFx1NjcwOVx1NjU4N1x1N0FFMFx1OERFRlx1NUY4NFx1NTQ4Q1x1NTE4NVx1NUJCOVx1RkYwOFx1OTRGRVx1NjNBNVx1NkI2NVx1OUFBNFx1RkYwOScgfSk7XG5cbiAgICAgICAgY29uc3QgcHJvbXB0cyA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnBpcGVsaW5lUHJvbXB0cztcblxuICAgICAgICBmb3IgKGNvbnN0IHN0ZXBJZCBvZiBTVEVQX09SREVSKSB7XG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSBwcm9tcHRzW3N0ZXBJZF07XG4gICAgICAgICAgICBpZiAoIWNvbmZpZykgY29udGludWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSBlbC5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1waXBlbGluZS1zdGVwJyB9KTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlciA9IHNlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtcGlwZWxpbmUtc3RlcC1oZWFkZXInIH0pO1xuXG4gICAgICAgICAgICBoZWFkZXIuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiBgJHtjb25maWcubmFtZX0gXHUyMDE0ICR7Y29uZmlnLmRlc2NyaXB0aW9ufWAgfSk7XG5cbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKHNlY3Rpb24pXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoJ1x1NTQyRlx1NzUyOFx1NkI2NFx1NkI2NVx1OUFBNCcpXG4gICAgICAgICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShjb25maWcuZW5hYmxlZClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmVuYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRleHRBcmVhQ29udGFpbmVyID0gc2VjdGlvbi5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC10ZXh0YXJlYS1jb250YWluZXInIH0pO1xuICAgICAgICAgICAgY29uc3QgdGV4dEFyZWEgPSB0ZXh0QXJlYUNvbnRhaW5lci5jcmVhdGVFbCgndGV4dGFyZWEnLCB7XG4gICAgICAgICAgICAgICAgY2xzOiAnYWktYWdlbnQtcGlwZWxpbmUtdGV4dGFyZWEnLFxuICAgICAgICAgICAgICAgIGF0dHI6IHsgcm93czogJzE0JyB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0ZXh0QXJlYS52YWx1ZSA9IGNvbmZpZy5wcm9tcHRUZW1wbGF0ZTtcblxuICAgICAgICAgICAgbGV0IHNhdmVUaW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PjtcbiAgICAgICAgICAgIHRleHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChzYXZlVGltZW91dCk7XG4gICAgICAgICAgICAgICAgc2F2ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnByb21wdFRlbXBsYXRlID0gdGV4dEFyZWEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUmVzZXQgdG8gZGVmYXVsdCBidXR0b25cbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKHNlY3Rpb24pXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoJ1x1OTFDRFx1N0Y2RVx1NEUzQVx1OUVEOFx1OEJBNCcpXG4gICAgICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdcdTkxQ0RcdTdGNkUnKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IERFRkFVTFRfUElQRUxJTkVfUFJPTVBUUztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0c1tzdGVwSWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnByb21wdFRlbXBsYXRlID0gZGVmYXVsdHNbc3RlcElkXS5wcm9tcHRUZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QXJlYS52YWx1ZSA9IGNvbmZpZy5wcm9tcHRUZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPT09PT0gTUNQIFNlY3Rpb24gPT09PT1cbiAgICBwcml2YXRlIHJlbmRlck1DUFNlY3Rpb24oZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ01DUCBcdTY3MERcdTUyQTFcdTU2NjgnIH0pO1xuICAgICAgICBlbC5jcmVhdGVFbCgncCcsIHsgdGV4dDogJ1x1OTE0RFx1N0Y2RSBNb2RlbCBDb250ZXh0IFByb3RvY29sIFx1NjcwRFx1NTJBMVx1NTY2OFx1NEVFNVx1NjI2OVx1NUM1NVx1NURFNVx1NTE3N1x1ODBGRFx1NTI5Qlx1MzAwMicgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmVyTGlzdCA9IGVsLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LW1jcC1saXN0JyB9KTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tY3BTZXJ2ZXJzLmZvckVhY2goKHNlcnZlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmQgPSBzZXJ2ZXJMaXN0LmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LW1jcC1jYXJkJyB9KTtcblxuICAgICAgICAgICAgY2FyZC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6IHNlcnZlci5uYW1lIH0pO1xuXG4gICAgICAgICAgICBuZXcgU2V0dGluZyhjYXJkKVxuICAgICAgICAgICAgICAgIC5zZXROYW1lKCdcdTU0MkZcdTc1MjgnKVxuICAgICAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoc2VydmVyLmVuYWJsZWQpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5lbmFibGVkID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBuZXcgU2V0dGluZyhjYXJkKVxuICAgICAgICAgICAgICAgIC5zZXROYW1lKCdcdTU0N0RcdTRFRTQnKVxuICAgICAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ25weCcpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShzZXJ2ZXIuY29tbWFuZClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmNvbW1hbmQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKGNhcmQpXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoJ1x1NTNDMlx1NjU3MCcpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoJ1x1N0E3QVx1NjgzQ1x1NTIwNlx1OTY5NFx1NzY4NFx1NTNDMlx1NjU3MFx1NTIxN1x1ODg2OCcpXG4gICAgICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignLXkgQG1vZGVsY29udGV4dHByb3RvY29sL3NlcnZlci1maWxlc3lzdGVtIC9wYXRoJylcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHNlcnZlci5hcmdzLmpvaW4oJyAnKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmFyZ3MgPSB2YWx1ZS5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKGNhcmQpXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoJ1x1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRicpXG4gICAgICAgICAgICAgICAgLnNldERlc2MoJ1x1NjgzQ1x1NUYwRlx1RkYxQUtFWTE9VkFMVUUxLEtFWTI9VkFMVUUyJylcbiAgICAgICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoc2VydmVyLmVudiB8fCB7fSkubWFwKChbaywgdl0pID0+IGAke2t9PSR7dn1gKS5qb2luKCcsICcpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmVudiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3BsaXQoJywnKS5mb3JFYWNoKHBhaXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtrLCB2XSA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoayAmJiB2KSBzZXJ2ZXIuZW52IVtrLnRyaW0oKV0gPSB2LnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgbmV3IFNldHRpbmcoY2FyZClcbiAgICAgICAgICAgICAgICAuc2V0TmFtZSgnXHU1MjIwXHU5NjY0JylcbiAgICAgICAgICAgICAgICAuYWRkQnV0dG9uKGJ0biA9PiBidG5cbiAgICAgICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1x1NTIyMFx1OTY2NCcpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRXYXJuaW5nKClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWNwU2VydmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhlbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdcdTZERkJcdTUyQTAgTUNQIFx1NjcwRFx1NTJBMVx1NTY2OCcpXG4gICAgICAgICAgICAuYWRkQnV0dG9uKGJ0biA9PiBidG5cbiAgICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnXHU2REZCXHU1MkEwJylcbiAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1NlcnZlcjogTUNQU2VydmVyQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGBtY3AtJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnXHU2NUIwIE1DUCBcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ25weCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tY3BTZXJ2ZXJzLnB1c2gobmV3U2VydmVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PSBVSSBTZWN0aW9uID09PT09XG4gICAgcHJpdmF0ZSByZW5kZXJVSVNlY3Rpb24oZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1x1NzU0Q1x1OTc2Mlx1OEJCRVx1N0Y2RScgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnXHU1QjU3XHU0RjUzXHU1OTI3XHU1QzBGJylcbiAgICAgICAgICAgIC5hZGREcm9wZG93bihkcm9wZG93biA9PiB7XG4gICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdzbWFsbCcsICdcdTVDMEYnKTtcbiAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ21lZGl1bScsICdcdTRFMkQnKTtcbiAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ2xhcmdlJywgJ1x1NTkyNycpO1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbnRTaXplKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250U2l6ZSA9IHZhbHVlIGFzIGFueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ1x1NjYzRVx1NzkzQVx1OEQzOVx1NzUyOFx1NEZFMVx1NjA2RicpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGVcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0Nvc3RJbmZvKVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0Nvc3RJbmZvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIE1hcmtkb3duUmVuZGVyZXIsIENvbXBvbmVudCwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgQUlBZ2VudFBsdWdpbiBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7IE1lc3NhZ2UsIEFydGljbGVUYXNrLCBEb2N1bWVudFBsYW4sIFBpcGVsaW5lU3RlcElkIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgVklFV19UWVBFX0FJX0NIQVQgPSAnYWktYWdlbnQtY2hhdC12aWV3JztcblxuaW50ZXJmYWNlIFRhc2tJdGVtIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGFydGljbGU6IEFydGljbGVUYXNrO1xuICAgIHN0ZXBzOiB7IHN0ZXA6IFBpcGVsaW5lU3RlcElkOyBzdGF0dXM6ICdwZW5kaW5nJyB8ICdydW5uaW5nJyB8ICdkb25lJyB8ICdmYWlsZWQnIH1bXTtcbn1cblxuY29uc3QgU1RFUF9MQUJFTFM6IFJlY29yZDxQaXBlbGluZVN0ZXBJZCwgc3RyaW5nPiA9IHtcbiAgICBwbGFuOiAnXHU4QkExXHU1MjEyJyxcbiAgICBkcmFmdDogJ1x1ODM0OVx1N0EzRicsXG4gICAgcG9saXNoOiAnXHU2REE2XHU4MjcyJyxcbiAgICBjaGVjazogJ1x1NjhDMFx1NjdFNScsXG4gICAgbGluazogJ1x1OTRGRVx1NjNBNScsXG59O1xuXG5leHBvcnQgY2xhc3MgQ2hhdFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gICAgcHJpdmF0ZSBwbHVnaW46IEFJQWdlbnRQbHVnaW47XG4gICAgcHJpdmF0ZSBtZXNzYWdlQ29udGFpbmVyITogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpbnB1dEFyZWEhOiBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIHByaXZhdGUgc2VuZEJ0biE6IEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHByaXZhdGUgc3RhdHVzQmFyITogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzZXNzaW9uU2VsZWN0b3IhOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICBwcml2YXRlIHNlc3Npb25UaXRsZUVsITogSFRNTEVsZW1lbnQ7XG5cbiAgICAvLyBJbnB1dCBoaXN0b3J5XG4gICAgcHJpdmF0ZSBzZW50TWVzc2FnZXM6IHN0cmluZ1tdID0gW107XG4gICAgcHJpdmF0ZSBoaXN0b3J5SW5kZXggPSAtMTtcbiAgICBwcml2YXRlIGN1cnJlbnREcmFmdCA9ICcnO1xuXG4gICAgLy8gTWFya2Rvd24gcmVuZGVyZXIgY29tcG9uZW50XG4gICAgcHJpdmF0ZSByZW5kZXJlckNvbXBvbmVudDogQ29tcG9uZW50ID0gbmV3IENvbXBvbmVudCgpO1xuXG4gICAgLy8gVGFzayBwcm9ncmVzcyB0cmFja2luZ1xuICAgIHByaXZhdGUgdGFza1BhbmVsV3JhcHBlciE6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgdGFza1BhbmVsSGVhZGVyITogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB0YXNrUGFuZWxUb2dnbGUhOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHRhc2tQYW5lbEJvZHkhOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHRhc2tMaXN0RWwhOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHRhc2tJdGVtczogVGFza0l0ZW1bXSA9IFtdO1xuICAgIHByaXZhdGUgdGFza1BhbmVsQ29sbGFwc2VkID0gZmFsc2U7XG5cbiAgICAvLyBQaXBlbGluZSBzdGF0ZVxuICAgIHByaXZhdGUgaXNSdW5uaW5nID0gZmFsc2U7XG5cbiAgICAvLyBQcm9ncmVzcyB3YXZlXG4gICAgcHJpdmF0ZSBwcm9ncmVzc0JhciE6IEhUTUxFbGVtZW50O1xuXG4gICAgLy8gVXNhZ2Ugc3RhdHNcbiAgICBwcml2YXRlIHVzYWdlU3RhdHNFbCE6IEhUTUxFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcGx1Z2luOiBBSUFnZW50UGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGxlYWYpO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gVklFV19UWVBFX0FJX0NIQVQ7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdBSSBBZ2VudCc7XG4gICAgfVxuXG4gICAgZ2V0SWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ2JvdCc7XG4gICAgfVxuXG4gICAgYXN5bmMgb25PcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRlbnRFbDtcbiAgICAgICAgY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcygnYWktYWdlbnQtY2hhdC1jb250YWluZXInKTtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKGBhaS1hZ2VudC1mb250LSR7dGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9udFNpemV9YCk7XG5cbiAgICAgICAgLy8gSGVhZGVyIHRvb2xiYXJcbiAgICAgICAgdGhpcy5yZW5kZXJIZWFkZXIoY29udGFpbmVyKTtcblxuICAgICAgICAvLyBNZXNzYWdlIGFyZWFcbiAgICAgICAgdGhpcy5tZXNzYWdlQ29udGFpbmVyID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LW1lc3NhZ2VzJyB9KTtcblxuICAgICAgICAvLyBUYXNrIHByb2dyZXNzIHBhbmVsXG4gICAgICAgIHRoaXMudGFza1BhbmVsV3JhcHBlciA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC10YXNrLXBhbmVsLXdyYXBwZXInIH0pO1xuICAgICAgICB0aGlzLnRhc2tQYW5lbFdyYXBwZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICB0aGlzLnRhc2tQYW5lbEhlYWRlciA9IHRoaXMudGFza1BhbmVsV3JhcHBlci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC10YXNrLXBhbmVsLWhlYWRlcicgfSk7XG4gICAgICAgIHRoaXMudGFza1BhbmVsVG9nZ2xlID0gdGhpcy50YXNrUGFuZWxIZWFkZXIuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgICAgICAgIGNsczogJ2FpLWFnZW50LXRhc2stcGFuZWwtdG9nZ2xlJyxcbiAgICAgICAgICAgIGF0dHI6IHsgdGl0bGU6ICdcdTYyOThcdTUzRTAvXHU1QzU1XHU1RjAwXHU0RUZCXHU1MkExXHU1MjE3XHU4ODY4JyB9LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YXNrUGFuZWxUb2dnbGUuc2V0VGV4dCgnXHUyNUJFJyk7XG4gICAgICAgIHRoaXMudGFza1BhbmVsSGVhZGVyLmNyZWF0ZVNwYW4oeyBjbHM6ICdhaS1hZ2VudC10YXNrLXBhbmVsLXRpdGxlJywgdGV4dDogJycgfSk7XG5cbiAgICAgICAgY29uc3QgdG9nZ2xlQ29sbGFwc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRhc2tQYW5lbENvbGxhcHNlZCA9ICF0aGlzLnRhc2tQYW5lbENvbGxhcHNlZDtcbiAgICAgICAgICAgIHRoaXMudGFza1BhbmVsVG9nZ2xlLnNldFRleHQodGhpcy50YXNrUGFuZWxDb2xsYXBzZWQgPyAnXHUyNUI4JyA6ICdcdTI1QkUnKTtcbiAgICAgICAgICAgIHRoaXMudGFza1BhbmVsQm9keS5zdHlsZS5kaXNwbGF5ID0gdGhpcy50YXNrUGFuZWxDb2xsYXBzZWQgPyAnbm9uZScgOiAnJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50YXNrUGFuZWxUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRvZ2dsZUNvbGxhcHNlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhc2tQYW5lbEhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMudGFza1BhbmVsVG9nZ2xlKSByZXR1cm47XG4gICAgICAgICAgICB0b2dnbGVDb2xsYXBzZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRhc2tQYW5lbEJvZHkgPSB0aGlzLnRhc2tQYW5lbFdyYXBwZXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtdGFzay1wYW5lbC1ib2R5JyB9KTtcbiAgICAgICAgdGhpcy50YXNrTGlzdEVsID0gdGhpcy50YXNrUGFuZWxCb2R5LmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXRhc2stbGlzdCcgfSk7XG5cbiAgICAgICAgLy8gUmVzdG9yZSBhY3RpdmUgc2Vzc2lvbiBtZXNzYWdlc1xuICAgICAgICB0aGlzLnJlc3RvcmVBY3RpdmVTZXNzaW9uKCk7XG5cbiAgICAgICAgLy8gV2VsY29tZSBndWlkZVxuICAgICAgICBpZiAodGhpcy5tZXNzYWdlQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJXZWxjb21lTWVzc2FnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuXG4gICAgICAgIC8vIElucHV0IGFyZWFcbiAgICAgICAgdGhpcy5yZW5kZXJJbnB1dEFyZWEoY29udGFpbmVyKTtcblxuICAgICAgICAvLyBCb3R0b20gYmFyXG4gICAgICAgIGNvbnN0IGJvdHRvbUJhciA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1ib3R0b20tYmFyJyB9KTtcbiAgICAgICAgdGhpcy51c2FnZVN0YXRzRWwgPSBib3R0b21CYXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtdXNhZ2Utc3RhdHMnIH0pO1xuICAgICAgICB0aGlzLnN0YXR1c0JhciA9IGJvdHRvbUJhci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1zdGF0dXNiYXInIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1c0JhcigpO1xuXG4gICAgICAgIC8vIFByb2dyZXNzIHdhdmVcbiAgICAgICAgdGhpcy5wcm9ncmVzc0JhciA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1wcm9ncmVzcy1iYXInIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1wcm9ncmVzcy1zZWdtZW50JyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucmVuZGVyZXJDb21wb25lbnQudW5sb2FkKCk7XG4gICAgfVxuXG4gICAgcmVmcmVzaEZvbnRTaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5yZW1vdmVDbGFzcygnYWktYWdlbnQtZm9udC1zbWFsbCcsICdhaS1hZ2VudC1mb250LW1lZGl1bScsICdhaS1hZ2VudC1mb250LWxhcmdlJyk7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmFkZENsYXNzKGBhaS1hZ2VudC1mb250LSR7dGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9udFNpemV9YCk7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gSGVhZGVyID09PT09XG4gICAgcHJpdmF0ZSByZW5kZXJIZWFkZXIoY29udGFpbmVyOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtaGVhZGVyJyB9KTtcblxuICAgICAgICBjb25zdCBsZWZ0ID0gaGVhZGVyLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LWhlYWRlci1sZWZ0JyB9KTtcbiAgICAgICAgbGVmdC5jcmVhdGVTcGFuKHsgdGV4dDogJ0FJIEFnZW50JywgY2xzOiAnYWktYWdlbnQtaGVhZGVyLXRpdGxlJyB9KTtcbiAgICAgICAgdGhpcy5zZXNzaW9uVGl0bGVFbCA9IGxlZnQuY3JlYXRlU3Bhbih7IGNsczogJ2FpLWFnZW50LXNlc3Npb24tdGl0bGUnIH0pO1xuXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gaGVhZGVyLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LWhlYWRlci1yaWdodCcgfSk7XG5cbiAgICAgICAgdGhpcy5zZXNzaW9uU2VsZWN0b3IgPSByaWdodC5jcmVhdGVFbCgnc2VsZWN0JywgeyBjbHM6ICdhaS1hZ2VudC1zZXNzaW9uLXNlbGVjdCcgfSk7XG4gICAgICAgIHRoaXMuc2Vzc2lvblNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnN3aXRjaFNlc3Npb24odGhpcy5zZXNzaW9uU2VsZWN0b3IudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTWVzc2FnZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2Vzc2lvblNlbGVjdG9yKCk7XG5cbiAgICAgICAgY29uc3QgbmV3QnRuID0gcmlnaHQuY3JlYXRlRWwoJ2J1dHRvbicsIHsgdGV4dDogJysnLCBjbHM6ICdhaS1hZ2VudC1idG4gYWktYWdlbnQtYnRuLW5ldycgfSk7XG4gICAgICAgIG5ld0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmNyZWF0ZU5ld1Nlc3Npb24oKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vzc2lvblNlbGVjdG9yKCk7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNZXNzYWdlcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyA9PT09PSBJbnB1dCBBcmVhID09PT09XG4gICAgcHJpdmF0ZSByZW5kZXJJbnB1dEFyZWEoY29udGFpbmVyOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbnB1dFdyYXBwZXIgPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtaW5wdXQtd3JhcHBlcicgfSk7XG5cbiAgICAgICAgY29uc3QgaW5wdXRSb3cgPSBpbnB1dFdyYXBwZXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtaW5wdXQtcm93JyB9KTtcblxuICAgICAgICB0aGlzLmlucHV0QXJlYSA9IGlucHV0Um93LmNyZWF0ZUVsKCd0ZXh0YXJlYScsIHtcbiAgICAgICAgICAgIGNsczogJ2FpLWFnZW50LWlucHV0JyxcbiAgICAgICAgICAgIGF0dHI6IHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ1x1OEY5M1x1NTE2NVx1OTcwMFx1NkM0Mlx1RkYwQ0FJIFx1NUMwNlx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NjU4N1x1Njg2My4uLiAoRW50ZXIgXHU1M0QxXHU5MDAxLCBTaGlmdCtFbnRlciBcdTYzNjJcdTg4NEMpJyxcbiAgICAgICAgICAgICAgICByb3dzOiAnMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNlbmRCdG4gPSBpbnB1dFJvdy5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgICAgICAgdGV4dDogJ1x1NTNEMVx1OTAwMScsXG4gICAgICAgICAgICBjbHM6ICdhaS1hZ2VudC1zZW5kLWJ0bicsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEltYWdlIHBhc3RlIGhhbmRsZXJcbiAgICAgICAgdGhpcy5pbnB1dEFyZWEuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBlLmNsaXBib2FyZERhdGE/Lml0ZW1zO1xuICAgICAgICAgICAgaWYgKCFpdGVtcykgcmV0dXJuO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVJbWFnZVBhc3RlKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEtleWJvYXJkIHNob3J0Y3V0c1xuICAgICAgICB0aGlzLmlucHV0QXJlYS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5pbnB1dEFyZWEudmFsdWUudHJpbSgpO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VudE1lc3NhZ2VzLnB1c2goY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeUluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERyYWZ0ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJyAmJiAhZS5zaGlmdEtleSAmJiB0aGlzLmlucHV0QXJlYS5zZWxlY3Rpb25TdGFydCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZW50TWVzc2FnZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlzdG9yeUluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREcmFmdCA9IHRoaXMuaW5wdXRBcmVhLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oaXN0b3J5SW5kZXggPCB0aGlzLnNlbnRNZXNzYWdlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeUluZGV4Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRBcmVhLnZhbHVlID0gdGhpcy5zZW50TWVzc2FnZXNbdGhpcy5zZW50TWVzc2FnZXMubGVuZ3RoIC0gMSAtIHRoaXMuaGlzdG9yeUluZGV4XTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd0Rvd24nICYmICFlLnNoaWZ0S2V5ICYmIHRoaXMuaW5wdXRBcmVhLnNlbGVjdGlvblN0YXJ0ID09PSB0aGlzLmlucHV0QXJlYS52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlzdG9yeUluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpc3RvcnlJbmRleC0tO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0QXJlYS52YWx1ZSA9IHRoaXMuc2VudE1lc3NhZ2VzW3RoaXMuc2VudE1lc3NhZ2VzLmxlbmd0aCAtIDEgLSB0aGlzLmhpc3RvcnlJbmRleF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhpc3RvcnlJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpc3RvcnlJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0QXJlYS52YWx1ZSA9IHRoaXMuY3VycmVudERyYWZ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdrJyAmJiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEFyZWEudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICB0aGlzLmhpc3RvcnlJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERyYWZ0ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VuZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUnVubmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmdldEVuZ2luZSgpLmFib3J0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gTWVzc2FnZSBTZW5kaW5nID09PT09XG4gICAgcHJpdmF0ZSBhc3luYyBzZW5kTWVzc2FnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuaW5wdXRBcmVhLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgaWYgKCFjb250ZW50KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmlzUnVubmluZykgcmV0dXJuO1xuXG4gICAgICAgIC8vIEhhbmRsZSBzbGFzaCBjb21tYW5kc1xuICAgICAgICBpZiAoY29udGVudC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZWQgPSB0aGlzLmhhbmRsZVNsYXNoQ29tbWFuZChjb250ZW50KTtcbiAgICAgICAgICAgIGlmIChoYW5kbGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEFyZWEudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlucHV0QXJlYS52YWx1ZSA9ICcnO1xuICAgICAgICB0aGlzLmlucHV0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VuZEJ0bi50ZXh0Q29udGVudCA9ICdcdTUwNUNcdTZCNjInO1xuICAgICAgICB0aGlzLnNlbmRCdG4uY2xhc3NMaXN0LmFkZCgnYWktYWdlbnQtc2VuZC1idG4tc3RvcCcpO1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gRW5zdXJlIHNlc3Npb24gZXhpc3RzXG4gICAgICAgIGlmICghdGhpcy5wbHVnaW4uZ2V0U2Vzc2lvbk1hbmFnZXIoKS5nZXRBY3RpdmVTZXNzaW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmNyZWF0ZU5ld1Nlc3Npb24oKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vzc2lvblNlbGVjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdXNlciBtZXNzYWdlXG4gICAgICAgIGNvbnN0IHVzZXJNc2c6IE1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBpZDogYG1zZy0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgIHJvbGU6ICd1c2VyJyxcbiAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucGx1Z2luLmFkZE1lc3NhZ2VUb0FjdGl2ZVNlc3Npb24odXNlck1zZyk7XG4gICAgICAgIHRoaXMucmVuZGVyVXNlck1lc3NhZ2UodXNlck1zZyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGFzayBwcm9ncmVzc1xuICAgICAgICB0aGlzLnRhc2tJdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLnRhc2tMaXN0RWwuZW1wdHkoKTtcbiAgICAgICAgdGhpcy50YXNrUGFuZWxXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgLy8gU2hvdyBwcm9ncmVzcyB3YXZlXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZCgnYWktYWdlbnQtcHJvZ3Jlc3MtYWN0aXZlJyk7XG5cbiAgICAgICAgLy8gUGVuZGluZyBwbGFuIGNvbmZpcm1hdGlvblxuICAgICAgICBsZXQgcGVuZGluZ1BsYW5SZXNvbHZlcjogKChwbGFuOiBEb2N1bWVudFBsYW4gfCBudWxsKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmdldEVuZ2luZSgpLnJ1blBpcGVsaW5lKGNvbnRlbnQsIHtcbiAgICAgICAgICAgIG9uUGxhbkdlbmVyYXRlZDogKHBsYW4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclBsYW5QcmV2aWV3KHBsYW4pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVxdWVzdFBsYW5Db25maXJtYXRpb246IGFzeW5jIChwbGFuKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdQbGFuUmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dQbGFuQ29uZmlybWF0aW9uRGlhbG9nKHBsYW4sIChjb25maXJtZWRQbGFuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZW5kaW5nUGxhblJlc29sdmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29uZmlybWVkUGxhbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25BcnRpY2xlU3RhdHVzQ2hhbmdlOiAoYXJ0aWNsZSwgc3RlcCwgc3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUYXNrSXRlbShhcnRpY2xlLCBzdGVwLCBzdGF0dXMpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVGFza1BhbmVsKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvblN0YXR1c0NoYW5nZTogKHN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFRleHQoc3RhdHVzKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uVXNhZ2VVcGRhdGU6IChzdW1tYXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dDb3N0SW5mbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzYWdlU3RhdHNFbC5zZXRUZXh0KHN1bW1hcnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0QXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEJ0bi50ZXh0Q29udGVudCA9ICdcdTUzRDFcdTkwMDEnO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdhaS1hZ2VudC1zZW5kLWJ0bi1zdG9wJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKCdhaS1hZ2VudC1wcm9ncmVzcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFRleHQoJycpO1xuXG4gICAgICAgICAgICAgICAgLy8gRGlzbWlzcyBhbnkgcGVuZGluZyBwbGFuIGRpYWxvZ1xuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nUGxhblJlc29sdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdQbGFuUmVzb2x2ZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdQbGFuUmVzb2x2ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbmVDb3VudCA9IHRoaXMudGFza0l0ZW1zLmZpbHRlcih0ID0+XG4gICAgICAgICAgICAgICAgICAgIHQuc3RlcHMuZXZlcnkocyA9PiBzLnN0YXR1cyA9PT0gJ2RvbmUnKVxuICAgICAgICAgICAgICAgICkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZhaWxDb3VudCA9IHRoaXMudGFza0l0ZW1zLmZpbHRlcih0ID0+XG4gICAgICAgICAgICAgICAgICAgIHQuc3RlcHMuc29tZShzID0+IHMuc3RhdHVzID09PSAnZmFpbGVkJylcbiAgICAgICAgICAgICAgICApLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZUNvdW50ICsgZmFpbENvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBmYWlsQ291bnQgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGBBSSBBZ2VudCBcdTVCOENcdTYyMTBcdUZGMUEke2RvbmVDb3VudH0gXHU3QkM3XHU2MjEwXHU1MjlGXHVGRjBDJHtmYWlsQ291bnR9IFx1N0JDN1x1NTkzMVx1OEQyNWBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYEFJIEFnZW50IFx1NUI4Q1x1NjIxMFx1RkYxQVx1NzUxRlx1NjIxMCAke2RvbmVDb3VudH0gXHU3QkM3XHU2NTg3XHU3QUUwYDtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShtc2cpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vzc2lvblNlbGVjdG9yKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25FcnJvcjogKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKCdhaS1hZ2VudC1wcm9ncmVzcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGBcdTk1MTlcdThCRUZcdUZGMUEke2Vycm9yfWAsIDUwMDApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdQbGFuUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ1BsYW5SZXNvbHZlcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ1BsYW5SZXNvbHZlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVTbGFzaENvbW1hbmQoY21kOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgc3dpdGNoIChjbWQudHJpbSgpKSB7XG4gICAgICAgICAgICBjYXNlICcvY2xlYXInOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDdXJyZW50U2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgY2FzZSAnL2V4cG9ydCc6XG4gICAgICAgICAgICAgICAgdGhpcy5leHBvcnRDdXJyZW50U2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgY2FzZSAnL2hlbHAnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gUGxhbiBQcmV2aWV3IChzaG93biBpbiBtZXNzYWdlIGFyZWEpID09PT09XG4gICAgcHJpdmF0ZSByZW5kZXJQbGFuUHJldmlldyhwbGFuOiBEb2N1bWVudFBsYW4pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbXNnRWwgPSB0aGlzLm1lc3NhZ2VDb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtbWVzc2FnZSBhaS1hZ2VudC1tZXNzYWdlLWFzc2lzdGFudCcgfSk7XG4gICAgICAgIGNvbnN0IGJ1YmJsZSA9IG1zZ0VsLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LWJ1YmJsZSBhaS1hZ2VudC1idWJibGUtYXNzaXN0YW50JyB9KTtcbiAgICAgICAgYnViYmxlLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXBsYW4tcHJldmlldy10aXRsZScgfSkuc2V0VGV4dChcbiAgICAgICAgICAgIGBcdTc1MUZcdTYyMTBcdThCQTFcdTUyMTJcdUZGMUFcdTUxNzEgJHtwbGFuLmFydGljbGVzLmxlbmd0aH0gXHU3QkM3XHU2NTg3XHU3QUUwYFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBsaXN0ID0gYnViYmxlLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXBsYW4tcHJldmlldy1saXN0JyB9KTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHBsYW4uYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0LmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXBsYW4tcHJldmlldy1pdGVtJyB9KTtcbiAgICAgICAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IHRleHQ6IGBcdUQ4M0RcdURDQzQgJHthLnRpdGxlfWAsIGNsczogJ2FpLWFnZW50LXBsYW4tZmlsZS1uYW1lJyB9KTtcbiAgICAgICAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IHRleHQ6IGAgXHUyMDE0ICR7YS5wYXRofWAsIGNsczogJ2FpLWFnZW50LXBsYW4tZmlsZS1wYXRoJyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vID09PT09IFBsYW4gQ29uZmlybWF0aW9uIERpYWxvZyA9PT09PVxuICAgIHByaXZhdGUgc2hvd1BsYW5Db25maXJtYXRpb25EaWFsb2coXG4gICAgICAgIHBsYW46IERvY3VtZW50UGxhbixcbiAgICAgICAgb25Db25maXJtOiAocGxhbjogRG9jdW1lbnRQbGFuIHwgbnVsbCkgPT4gdm9pZCxcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMubWVzc2FnZUNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1jb25maXJtLW92ZXJsYXknIH0pO1xuICAgICAgICBjb25zdCBkaWFsb2cgPSBvdmVybGF5LmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LWNvbmZpcm0tZGlhbG9nJyB9KTtcblxuICAgICAgICBkaWFsb2cuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtY29uZmlybS10aXRsZScgfSkuc2V0VGV4dCgnXHU3ODZFXHU4QkE0XHU3NTFGXHU2MjEwXHU4QkExXHU1MjEyJyk7XG4gICAgICAgIGRpYWxvZy5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1jb25maXJtLXN1YnRpdGxlJyB9KS5zZXRUZXh0KFxuICAgICAgICAgICAgYFx1NTE3MSAke3BsYW4uYXJ0aWNsZXMubGVuZ3RofSBcdTdCQzdcdTY1ODdcdTdBRTBcdUZGMENcdTUzRUZcdTRGRUVcdTY1MzlcdTY4MDdcdTk4OThcdTU0OENcdThERUZcdTVGODRcdTU0MEVcdTc4NkVcdThCQTRgXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgYXJ0aWNsZUVkaXRvcnM6IHsgdGl0bGVJbnB1dDogSFRNTElucHV0RWxlbWVudDsgcGF0aElucHV0OiBIVE1MSW5wdXRFbGVtZW50IH1bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXJ0aWNsZSBvZiBwbGFuLmFydGljbGVzKSB7XG4gICAgICAgICAgICBjb25zdCBjYXJkID0gZGlhbG9nLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXBsYW4tZWRpdC1jYXJkJyB9KTtcblxuICAgICAgICAgICAgY2FyZC5jcmVhdGVEaXYoeyB0ZXh0OiBgXHU2NTg3XHU3QUUwICR7YXJ0aWNsZUVkaXRvcnMubGVuZ3RoICsgMX1gLCBjbHM6ICdhaS1hZ2VudC1wbGFuLWVkaXQtbGFiZWwnIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0aXRsZVJvdyA9IGNhcmQuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtcGxhbi1lZGl0LXJvdycgfSk7XG4gICAgICAgICAgICB0aXRsZVJvdy5jcmVhdGVTcGFuKHsgdGV4dDogJ1x1NjgwN1x1OTg5OCcsIGNsczogJ2FpLWFnZW50LXBsYW4tZWRpdC1maWVsZCcgfSk7XG4gICAgICAgICAgICBjb25zdCB0aXRsZUlucHV0ID0gdGl0bGVSb3cuY3JlYXRlRWwoJ2lucHV0Jywge1xuICAgICAgICAgICAgICAgIGNsczogJ2FpLWFnZW50LXBsYW4tZWRpdC1pbnB1dCcsXG4gICAgICAgICAgICAgICAgYXR0cjogeyB0eXBlOiAndGV4dCcgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGl0bGVJbnB1dC52YWx1ZSA9IGFydGljbGUudGl0bGU7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhdGhSb3cgPSBjYXJkLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXBsYW4tZWRpdC1yb3cnIH0pO1xuICAgICAgICAgICAgcGF0aFJvdy5jcmVhdGVTcGFuKHsgdGV4dDogJ1x1OERFRlx1NUY4NCcsIGNsczogJ2FpLWFnZW50LXBsYW4tZWRpdC1maWVsZCcgfSk7XG4gICAgICAgICAgICBjb25zdCBwYXRoSW5wdXQgPSBwYXRoUm93LmNyZWF0ZUVsKCdpbnB1dCcsIHtcbiAgICAgICAgICAgICAgICBjbHM6ICdhaS1hZ2VudC1wbGFuLWVkaXQtaW5wdXQnLFxuICAgICAgICAgICAgICAgIGF0dHI6IHsgdHlwZTogJ3RleHQnIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBhdGhJbnB1dC52YWx1ZSA9IGFydGljbGUucGF0aDtcblxuICAgICAgICAgICAgYXJ0aWNsZUVkaXRvcnMucHVzaCh7IHRpdGxlSW5wdXQsIHBhdGhJbnB1dCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ0blJvdyA9IGRpYWxvZy5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1jb25maXJtLWJ0bnMnIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpcm1CdG4gPSBidG5Sb3cuY3JlYXRlRWwoJ2J1dHRvbicsIHsgdGV4dDogJ1x1Nzg2RVx1OEJBNFx1NUU3Nlx1NzUxRlx1NjIxMCcsIGNsczogJ2FpLWFnZW50LWJ0biBhaS1hZ2VudC1idG4tYXBwcm92ZScgfSk7XG4gICAgICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ0blJvdy5jcmVhdGVFbCgnYnV0dG9uJywgeyB0ZXh0OiAnXHU1M0Q2XHU2RDg4JywgY2xzOiAnYWktYWdlbnQtYnRuIGFpLWFnZW50LWJ0bi1yZWplY3QnIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsZWFudXAgPSAocmVzdWx0OiBEb2N1bWVudFBsYW4gfCBudWxsKSA9PiB7XG4gICAgICAgICAgICBvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICAgICAgb25Db25maXJtKHJlc3VsdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIC8vIEFwcGx5IGVkaXRzIGJhY2sgdG8gcGxhblxuICAgICAgICAgICAgcGxhbi5hcnRpY2xlcy5mb3JFYWNoKChhLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWRpdG9yID0gYXJ0aWNsZUVkaXRvcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICBhLnRpdGxlID0gZWRpdG9yLnRpdGxlSW5wdXQudmFsdWUudHJpbSgpIHx8IGEudGl0bGU7XG4gICAgICAgICAgICAgICAgICAgIGEucGF0aCA9IGVkaXRvci5wYXRoSW5wdXQudmFsdWUudHJpbSgpIHx8IGEucGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFudXAocGxhbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFudXAobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PSBNZXNzYWdlIFJlbmRlcmluZyA9PT09PVxuICAgIHByaXZhdGUgcmVuZGVyVXNlck1lc3NhZ2UobXNnOiBNZXNzYWdlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1zZ0VsID0gdGhpcy5tZXNzYWdlQ29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LW1lc3NhZ2UgYWktYWdlbnQtbWVzc2FnZS11c2VyJyB9KTtcbiAgICAgICAgY29uc3QgYnViYmxlID0gbXNnRWwuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtYnViYmxlIGFpLWFnZW50LWJ1YmJsZS11c2VyJyB9KTtcbiAgICAgICAgYnViYmxlLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LWJ1YmJsZS1jb250ZW50JyB9KS5zZXRUZXh0KG1zZy5jb250ZW50KTtcbiAgICAgICAgYnViYmxlLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LWJ1YmJsZS10aW1lJyB9KS5zZXRUZXh0KFxuICAgICAgICAgICAgbmV3IERhdGUobXNnLnRpbWVzdGFtcCkudG9Mb2NhbGVUaW1lU3RyaW5nKCd6aC1DTicpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXJBc3Npc3RhbnRNZXNzYWdlKG1zZzogTWVzc2FnZSk6IHZvaWQge1xuICAgICAgICBjb25zdCBtc2dFbCA9IHRoaXMubWVzc2FnZUNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1tZXNzYWdlIGFpLWFnZW50LW1lc3NhZ2UtYXNzaXN0YW50JyB9KTtcbiAgICAgICAgY29uc3QgYnViYmxlID0gbXNnRWwuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtYnViYmxlIGFpLWFnZW50LWJ1YmJsZS1hc3Npc3RhbnQnIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnRFbCA9IGJ1YmJsZS5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC1idWJibGUtY29udGVudCBtYXJrZG93bi1yZW5kZXJlZCcgfSk7XG4gICAgICAgIGNvbnRlbnRFbC5zZXRUZXh0KG1zZy5jb250ZW50KTtcbiAgICAgICAgdGhpcy5yZW5kZXJNYXJrZG93bkNvbnRlbnQoY29udGVudEVsKTtcblxuICAgICAgICBidWJibGUuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtYnViYmxlLXRpbWUnIH0pLnNldFRleHQoXG4gICAgICAgICAgICBuZXcgRGF0ZShtc2cudGltZXN0YW1wKS50b0xvY2FsZVRpbWVTdHJpbmcoJ3poLUNOJylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbmRlckVycm9yKGVycm9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbXNnRWwgPSB0aGlzLm1lc3NhZ2VDb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtbWVzc2FnZSBhaS1hZ2VudC1tZXNzYWdlLWVycm9yJyB9KTtcbiAgICAgICAgbXNnRWwuY3JlYXRlRGl2KHsgY2xzOiAnYWktYWdlbnQtZXJyb3InIH0pLnNldFRleHQoYFx1OTUxOVx1OEJFRjogJHtlcnJvcn1gKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJlbmRlck1hcmtkb3duQ29udGVudChlbDogSFRNTEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGVsLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICBlbC5lbXB0eSgpO1xuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgYXdhaXQgTWFya2Rvd25SZW5kZXJlci5yZW5kZXJNYXJrZG93bih0ZXh0LCBlbCwgJycsIHRoaXMucmVuZGVyZXJDb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPT09PT0gU2Vzc2lvbiBNYW5hZ2VtZW50ID09PT09XG4gICAgcHJpdmF0ZSB1cGRhdGVTZXNzaW9uU2VsZWN0b3IoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNlc3Npb25zID0gdGhpcy5wbHVnaW4uZ2V0U2Vzc2lvbk1hbmFnZXIoKS5nZXRTZXNzaW9ucygpO1xuICAgICAgICB0aGlzLnNlc3Npb25TZWxlY3Rvci5lbXB0eSgpO1xuXG4gICAgICAgIHNlc3Npb25zLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb24gPSB0aGlzLnNlc3Npb25TZWxlY3Rvci5jcmVhdGVFbCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBzLmlkO1xuICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBzLnRpdGxlO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhY3RpdmVJZCA9IHRoaXMucGx1Z2luLmdldFNlc3Npb25NYW5hZ2VyKCkuZ2V0QWN0aXZlU2Vzc2lvbklkKCk7XG4gICAgICAgIGlmIChhY3RpdmVJZCkge1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uU2VsZWN0b3IudmFsdWUgPSBhY3RpdmVJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVNlc3Npb24gPSB0aGlzLnBsdWdpbi5nZXRTZXNzaW9uTWFuYWdlcigpLmdldEFjdGl2ZVNlc3Npb24oKTtcbiAgICAgICAgaWYgKHRoaXMuc2Vzc2lvblRpdGxlRWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvblRpdGxlRWwuc2V0VGV4dChhY3RpdmVTZXNzaW9uID8gYFx1MjAxNCAke2FjdGl2ZVNlc3Npb24udGl0bGV9YCA6ICcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVmcmVzaE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1lc3NhZ2VDb250YWluZXIuZW1wdHkoKTtcbiAgICAgICAgdGhpcy50YXNrSXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy50YXNrUGFuZWxDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50YXNrUGFuZWxUb2dnbGUuc2V0VGV4dCgnXHUyNUJFJyk7XG4gICAgICAgIHRoaXMudGFza1BhbmVsQm9keS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgIHRoaXMudGFza1BhbmVsV3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB0aGlzLnRhc2tMaXN0RWwuZW1wdHkoKTtcblxuICAgICAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5wbHVnaW4uZ2V0U2Vzc2lvbk1hbmFnZXIoKS5nZXRBY3RpdmVTZXNzaW9uKCk7XG4gICAgICAgIGlmIChzZXNzaW9uKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG1zZyBvZiBzZXNzaW9uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChtc2cucm9sZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1c2VyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVXNlck1lc3NhZ2UobXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhc3Npc3RhbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJBc3Npc3RhbnRNZXNzYWdlKG1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uLm1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyV2VsY29tZU1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc3RvcmVBY3RpdmVTZXNzaW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZnJlc2hNZXNzYWdlcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNlc3Npb25TZWxlY3RvcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJDdXJyZW50U2Vzc2lvbigpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklkID0gdGhpcy5wbHVnaW4uZ2V0U2Vzc2lvbk1hbmFnZXIoKS5nZXRBY3RpdmVTZXNzaW9uSWQoKTtcbiAgICAgICAgaWYgKHNlc3Npb25JZCkge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZ2V0U2Vzc2lvbk1hbmFnZXIoKS5jbGVhck1lc3NhZ2VzKHNlc3Npb25JZCk7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hNZXNzYWdlcygpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0VGV4dCgnXHU0RjFBXHU4QkREXHU1REYyXHU2RTA1XHU3QTdBJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydEN1cnJlbnRTZXNzaW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBzZXNzaW9uSWQgPSB0aGlzLnBsdWdpbi5nZXRTZXNzaW9uTWFuYWdlcigpLmdldEFjdGl2ZVNlc3Npb25JZCgpO1xuICAgICAgICBpZiAoIXNlc3Npb25JZCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0VGV4dCgnXHU2Q0ExXHU2NzA5XHU2RDNCXHU4REMzXHU3Njg0XHU0RjFBXHU4QkREJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWFya2Rvd24gPSBhd2FpdCB0aGlzLnBsdWdpbi5nZXRTZXNzaW9uTWFuYWdlcigpLmV4cG9ydFNlc3Npb24oc2Vzc2lvbklkKTtcbiAgICAgICAgICAgIGlmICghbWFya2Rvd24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0Jhci5zZXRUZXh0KCdcdTVCRkNcdTUxRkFcdTU5MzFcdThEMjVcdUZGMUFcdTRGMUFcdThCRERcdTRFM0FcdTdBN0EnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb24gPSB0aGlzLnBsdWdpbi5nZXRTZXNzaW9uTWFuYWdlcigpLmdldEFjdGl2ZVNlc3Npb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHJhd05hbWUgPSBzZXNzaW9uPy50aXRsZSB8fCAnXHU1QkZDXHU1MUZBXHU0RjFBXHU4QkREJztcbiAgICAgICAgICAgIGNvbnN0IHNhZmVOYW1lID0gcmF3TmFtZS5yZXBsYWNlKC9bXFxcXC86Kj9cIjw+fF0vZywgJy0nKS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICAgICAgICAgICAgY29uc3QgYmFzZURpciA9ICdBSVx1NUJGOVx1OEJERFx1NUJGQ1x1NTFGQSc7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChiYXNlRGlyKTtcbiAgICAgICAgICAgIGlmICghZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKGJhc2VEaXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmluYWxQYXRoID0gdGhpcy5ub3JtYWxpemVQYXRoKGAke2Jhc2VEaXJ9LyR7c2FmZU5hbWV9Lm1kYCk7XG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDE7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZpbmFsUGF0aCkpIHtcbiAgICAgICAgICAgICAgICBmaW5hbFBhdGggPSB0aGlzLm5vcm1hbGl6ZVBhdGgoYCR7YmFzZURpcn0vJHtzYWZlTmFtZX1fJHtjb3VudGVyfS5tZGApO1xuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKGZpbmFsUGF0aCwgbWFya2Rvd24pO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlckFzc2lzdGFudE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGlkOiBgZXhwb3J0LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgICAgICAgIHJvbGU6ICdhc3Npc3RhbnQnLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGBcdTRGMUFcdThCRERcdTVERjJcdTVCRkNcdTUxRkFcdTUyMzAgKioke2ZpbmFsUGF0aH0qKmAsXG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmluYWxQYXRoKTtcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKCd0YWInKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGZpbGUgYXMgYW55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXIuc2V0VGV4dChgXHU1REYyXHU1QkZDXHU1MUZBXHVGRjFBJHtmaW5hbFBhdGh9YCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0Jhci5zZXRUZXh0KGBcdTVCRkNcdTUxRkFcdTU5MzFcdThEMjVcdUZGMUEke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJFcnJvcihgXHU1QkZDXHU1MUZBXHU1OTMxXHU4RDI1XHVGRjFBJHtlcnIubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VQYXN0ZShpdGVtOiBEYXRhVHJhbnNmZXJJdGVtKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBleHQgPSBmaWxlLnR5cGUgPT09ICdpbWFnZS9wbmcnID8gJ3BuZydcbiAgICAgICAgICAgIDogZmlsZS50eXBlID09PSAnaW1hZ2UvanBlZycgPyAnanBnJ1xuICAgICAgICAgICAgOiBmaWxlLnR5cGUgPT09ICdpbWFnZS9naWYnID8gJ2dpZidcbiAgICAgICAgICAgIDogZmlsZS50eXBlID09PSAnaW1hZ2Uvd2VicCcgPyAnd2VicCcgOiAncG5nJztcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1s6Ll0vZywgJy0nKS5zbGljZSgwLCAxOSk7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYGFpLXBhc3RlZC0ke3RpbWVzdGFtcH0uJHtleHR9YDtcbiAgICAgICAgY29uc3QgZGlyID0gJ2F0dGFjaG1lbnRzL2FpLWFnZW50JztcbiAgICAgICAgY29uc3QgcGF0aCA9IGAke2Rpcn0vJHtmaWxlbmFtZX1gO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkaXJFeGlzdHMgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZGlyKTtcbiAgICAgICAgICAgIGlmICghZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlRm9sZGVyKGRpcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlQmluYXJ5KHBhdGgsIGFycmF5QnVmZmVyKTtcblxuICAgICAgICAgICAgY29uc3QgaW1nTWFya2Rvd24gPSBgIVtbJHtmaWxlbmFtZX1dXWA7XG4gICAgICAgICAgICBjb25zdCBjdXJzb3JQb3MgPSB0aGlzLmlucHV0QXJlYS5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuaW5wdXRBcmVhLnZhbHVlLnNsaWNlKDAsIGN1cnNvclBvcyk7XG4gICAgICAgICAgICBjb25zdCBhZnRlciA9IHRoaXMuaW5wdXRBcmVhLnZhbHVlLnNsaWNlKGN1cnNvclBvcyk7XG4gICAgICAgICAgICB0aGlzLmlucHV0QXJlYS52YWx1ZSA9IGJlZm9yZSArIGltZ01hcmtkb3duICsgYWZ0ZXI7XG4gICAgICAgICAgICB0aGlzLmlucHV0QXJlYS5zZWxlY3Rpb25TdGFydCA9IHRoaXMuaW5wdXRBcmVhLnNlbGVjdGlvbkVuZCA9IGN1cnNvclBvcyArIGltZ01hcmtkb3duLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRBcmVhLmZvY3VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFRleHQoYFx1NTZGRVx1NzI0N1x1NURGMlx1NEZERFx1NUI1OFx1RkYxQSR7cGF0aH1gKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVTdGF0dXNCYXIoKSwgMjAwMCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0Jhci5zZXRUZXh0KGBcdTU2RkVcdTcyNDdcdTRGRERcdTVCNThcdTU5MzFcdThEMjVcdUZGMUEke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXJXZWxjb21lTWVzc2FnZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgd2VsY29tZSA9IFtcbiAgICAgICAgICAgICcqKlx1NkIyMlx1OEZDRVx1NEY3Rlx1NzUyOCBPYnNpZGlhbiBBSSBBZ2VudCoqJyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJ1x1OEY5M1x1NTE2NVx1OTcwMFx1NkM0Mlx1RkYwQ0FJIFx1NUMwNlx1ODFFQVx1NTJBOFx1NUI4Q1x1NjIxMFx1NjU4N1x1Njg2M1x1NzUxRlx1NjIxMFx1MzAwMlx1NEY4Qlx1NTk4Mlx1RkYxQScsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICctIGBcdTUxOTkgMyBcdTdCQzcgUmVhY3QgSG9vayBcdTYyODBcdTY3MkZcdTY1ODdcdTY4NjNcdUZGMENcdTRGRERcdTVCNThcdTUyMzAgXHU2MjgwXHU2NzJGXHU2NTg3XHU2ODYzL1JlYWN0IFx1NzZFRVx1NUY1NWAnLFxuICAgICAgICAgICAgJy0gYFx1NTIxQlx1NEY1Q1x1NEUwMFx1NEUyQSA1IFx1N0FFMFx1NzY4NFx1NjBBQ1x1NzU5MVx1NUMwRlx1OEJGNFx1RkYwQ1x1NkJDRlx1N0FFMFx1NEUwMFx1NEUyQVx1NjU4N1x1NEVGNmAnLFxuICAgICAgICAgICAgJy0gYFx1NjAzQlx1N0VEM1x1NjcwMFx1OEZEMVx1NEUwMFx1NTQ2OFx1NzY4NFx1NjI4MFx1NjcyRlx1N0IxNFx1OEJCMFx1RkYwQ1x1NzUxRlx1NjIxMFx1NEUwMFx1N0JDN1x1NTQ2OFx1NjJBNWAnLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnLS0tJyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJyoqXHU3NTFGXHU2MjEwXHU2RDQxXHU3QTBCKipcdUZGMUEnLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnfCBcdTZCNjVcdTlBQTQgfCBcdThCRjRcdTY2MEUgfCcsXG4gICAgICAgICAgICAnfC0tLS0tLXwtLS0tLS18JyxcbiAgICAgICAgICAgICd8ICoqXHU4QkExXHU1MjEyKiogfCBBSSBcdTUyMDZcdTY3OTBcdTk3MDBcdTZDNDJcdUZGMENcdTc1MUZcdTYyMTBcdTY1ODdcdTdBRTBcdTRFM0JcdTk4OThcdTU0OENcdTc2RUVcdTVGNTVcdTdFRDNcdTY3ODQgfCcsXG4gICAgICAgICAgICAnfCAqKlx1ODM0OVx1N0EzRioqIHwgXHU2ODM5XHU2MzZFXHU0RTNCXHU5ODk4XHU2NEIwXHU1MTk5XHU1MjFEXHU3QTNGIHwnLFxuICAgICAgICAgICAgJ3wgKipcdTZEQTZcdTgyNzIqKiB8IFx1NkRGQlx1NTJBMFx1NjAxRFx1N0VGNFx1NUJGQ1x1NTZGRVx1MzAwMVx1NkQ0MVx1N0EwQlx1NTZGRVx1MzAwMWNhbGxvdXQgXHU2M0QwXHU3OTNBXHU1NzU3IHwnLFxuICAgICAgICAgICAgJ3wgKipcdTY4QzBcdTY3RTUqKiB8IE1hcmtkb3duIFx1OEJFRFx1NkNENVx1NjhDMFx1NjdFNVx1NEUwRVx1NEZFRVx1NTkwRCB8JyxcbiAgICAgICAgICAgICd8ICoqXHU5NEZFXHU2M0E1KiogfCBcdTU5MUFcdTdCQzdcdTY1ODdcdTdBRTBcdTgxRUFcdTUyQThcdTZERkJcdTUyQTAgW1t3aWtpbGlua11dIFx1NzZGOFx1NEU5Mlx1NUYxNVx1NzUyOCB8JyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJ1x1NTkxQVx1N0JDN1x1NjU4N1x1N0FFMFx1NzUxRlx1NjIxMFx1NjVGNlx1NEYxQVx1NTE0OFx1NUM1NVx1NzkzQVx1OEJBMVx1NTIxMlx1NEY5Qlx1Nzg2RVx1OEJBNFx1RkYwQ1x1NTM1NVx1N0JDN1x1NjU4N1x1N0FFMFx1NzZGNFx1NjNBNVx1NzUxRlx1NjIxMFx1MzAwMicsXG4gICAgICAgICAgICAnXHU2QkNGXHU0RTJBXHU2QjY1XHU5QUE0XHU3Njg0IFByb21wdCBcdTUzRUZcdTU3MjhcdThCQkVcdTdGNkVcdTRFMkRcdTgxRUFcdTVCOUFcdTRFNDlcdTMwMDInLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnKipcdTVGRUJcdTYzNzdcdTY0Q0RcdTRGNUMqKlx1RkYxQScsXG4gICAgICAgICAgICAnLSBgXHUyMTkxXHUyMTkzYCBcdTk1MkVcdTU2REVcdTZFQUZcdTUzODZcdTUzRjJcdTZEODhcdTYwNkYnLFxuICAgICAgICAgICAgJy0gYEN0cmwrS2AgXHU2RTA1XHU3QTdBXHU4RjkzXHU1MTY1XHU2ODQ2JyxcbiAgICAgICAgICAgICctIGAvY2xlYXJgIFx1NkUwNVx1N0E3QVx1NEYxQVx1OEJERCBcdTAwQjcgYC9leHBvcnRgIFx1NUJGQ1x1NTFGQSBcdTAwQjcgYC9oZWxwYCBcdTVFMkVcdTUyQTknLFxuICAgICAgICBdLmpvaW4oJ1xcbicpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyQXNzaXN0YW50TWVzc2FnZSh7XG4gICAgICAgICAgICBpZDogJ3dlbGNvbWUnLFxuICAgICAgICAgICAgcm9sZTogJ2Fzc2lzdGFudCcsXG4gICAgICAgICAgICBjb250ZW50OiB3ZWxjb21lLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dIZWxwKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBoZWxwQ29udGVudCA9IFtcbiAgICAgICAgICAgICcqKlx1NTNFRlx1NzUyOFx1NTQ3RFx1NEVFNFx1RkYxQSoqJyxcbiAgICAgICAgICAgICctIGAvY2xlYXJgIC0gXHU2RTA1XHU3QTdBXHU1RjUzXHU1MjREXHU0RjFBXHU4QkREJyxcbiAgICAgICAgICAgICctIGAvZXhwb3J0YCAtIFx1NUJGQ1x1NTFGQVx1NUY1M1x1NTI0RFx1NEYxQVx1OEJERFx1NEUzQSBNYXJrZG93bicsXG4gICAgICAgICAgICAnLSBgL2hlbHBgIC0gXHU2NjNFXHU3OTNBXHU2QjY0XHU1RTJFXHU1MkE5JyxcbiAgICAgICAgXS5qb2luKCdcXG4nKTtcblxuICAgICAgICB0aGlzLnJlbmRlckFzc2lzdGFudE1lc3NhZ2Uoe1xuICAgICAgICAgICAgaWQ6ICdoZWxwJyxcbiAgICAgICAgICAgIHJvbGU6ICdhc3Npc3RhbnQnLFxuICAgICAgICAgICAgY29udGVudDogaGVscENvbnRlbnQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vID09PT09IFBpcGVsaW5lIFRhc2sgUHJvZ3Jlc3MgPT09PT1cbiAgICBwcml2YXRlIHVwZGF0ZVRhc2tJdGVtKGFydGljbGU6IEFydGljbGVUYXNrLCBzdGVwOiBQaXBlbGluZVN0ZXBJZCwgc3RhdHVzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnRhc2tJdGVtcy5maW5kKHQgPT4gdC5hcnRpY2xlLnBhdGggPT09IGFydGljbGUucGF0aCk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICBpZDogYHRhc2stJHthcnRpY2xlLnBhdGh9YCxcbiAgICAgICAgICAgICAgICBhcnRpY2xlLFxuICAgICAgICAgICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgc3RlcDogJ2RyYWZ0Jywgc3RhdHVzOiAncGVuZGluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdGVwOiAncG9saXNoJywgc3RhdHVzOiAncGVuZGluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdGVwOiAnY2hlY2snLCBzdGF0dXM6ICdwZW5kaW5nJyB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy50YXNrSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0ZXBJdGVtID0gaXRlbS5zdGVwcy5maW5kKHMgPT4gcy5zdGVwID09PSBzdGVwKTtcbiAgICAgICAgaWYgKHN0ZXBJdGVtKSB7XG4gICAgICAgICAgICBzdGVwSXRlbS5zdGF0dXMgPSBzdGF0dXMgYXMgVGFza0l0ZW1bJ3N0ZXBzJ11bMF1bJ3N0YXR1cyddO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uYXJ0aWNsZS5zdGF0dXMgPSBhcnRpY2xlLnN0YXR1cztcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbmRlclRhc2tQYW5lbCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudGFza0l0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy50YXNrUGFuZWxXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhc2tQYW5lbFdyYXBwZXIuc3R5bGUuZGlzcGxheSA9ICcnO1xuXG4gICAgICAgIGNvbnN0IHRvdGFsQXJ0aWNsZXMgPSB0aGlzLnRhc2tJdGVtcy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGRvbmVBcnRpY2xlcyA9IHRoaXMudGFza0l0ZW1zLmZpbHRlcih0ID0+XG4gICAgICAgICAgICB0LnN0ZXBzLmV2ZXJ5KHMgPT4gcy5zdGF0dXMgPT09ICdkb25lJylcbiAgICAgICAgKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGZhaWxBcnRpY2xlcyA9IHRoaXMudGFza0l0ZW1zLmZpbHRlcih0ID0+XG4gICAgICAgICAgICB0LnN0ZXBzLnNvbWUocyA9PiBzLnN0YXR1cyA9PT0gJ2ZhaWxlZCcpXG4gICAgICAgICkubGVuZ3RoO1xuICAgICAgICBjb25zdCBhbGxEb25lID0gKGRvbmVBcnRpY2xlcyArIGZhaWxBcnRpY2xlcykgPT09IHRvdGFsQXJ0aWNsZXM7XG4gICAgICAgIGNvbnN0IGhhc1J1bm5pbmcgPSB0aGlzLnRhc2tJdGVtcy5zb21lKHQgPT5cbiAgICAgICAgICAgIHQuc3RlcHMuc29tZShzID0+IHMuc3RhdHVzID09PSAncnVubmluZycpXG4gICAgICAgICk7XG5cbiAgICAgICAgKHRoaXMudGFza1BhbmVsSGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5haS1hZ2VudC10YXNrLXBhbmVsLXRpdGxlJykgYXMgSFRNTEVsZW1lbnQpLnNldFRleHQoXG4gICAgICAgICAgICBhbGxEb25lXG4gICAgICAgICAgICAgICAgPyBgXHU3NTFGXHU2MjEwXHU1QjhDXHU2MjEwICgke2RvbmVBcnRpY2xlc30gXHU2MjEwXHU1MjlGJHtmYWlsQXJ0aWNsZXMgPiAwID8gYCAvICR7ZmFpbEFydGljbGVzfSBcdTU5MzFcdThEMjVgIDogJyd9KWBcbiAgICAgICAgICAgICAgICA6IGBcdTc1MUZcdTYyMTBcdTRFMkQgKCR7ZG9uZUFydGljbGVzfS8ke3RvdGFsQXJ0aWNsZXN9KWBcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoaGFzUnVubmluZyAmJiB0aGlzLnRhc2tQYW5lbENvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy50YXNrUGFuZWxDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudGFza1BhbmVsVG9nZ2xlLnNldFRleHQoJ1x1MjVCRScpO1xuICAgICAgICAgICAgdGhpcy50YXNrUGFuZWxCb2R5LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFza0xpc3RFbC5lbXB0eSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgdGFzayBvZiB0aGlzLnRhc2tJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMudGFza0xpc3RFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgICAgICAgIGNsczogYGFpLWFnZW50LXRhc2staXRlbSBhaS1hZ2VudC10YXNrLSR7XG4gICAgICAgICAgICAgICAgICAgIHRhc2suc3RlcHMuc29tZShzID0+IHMuc3RhdHVzID09PSAnZmFpbGVkJykgPyAnZmFpbGVkJ1xuICAgICAgICAgICAgICAgICAgICA6IHRhc2suc3RlcHMuZXZlcnkocyA9PiBzLnN0YXR1cyA9PT0gJ2RvbmUnKSA/ICdkb25lJ1xuICAgICAgICAgICAgICAgICAgICA6IHRhc2suc3RlcHMuc29tZShzID0+IHMuc3RhdHVzID09PSAncnVubmluZycpID8gJ3J1bm5pbmcnXG4gICAgICAgICAgICAgICAgICAgIDogJ3BlbmRpbmcnXG4gICAgICAgICAgICAgICAgfWAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgaWNvbiA9IHRhc2suc3RlcHMuc29tZShzID0+IHMuc3RhdHVzID09PSAnZmFpbGVkJykgPyAnXHUyNzE3J1xuICAgICAgICAgICAgICAgIDogdGFzay5zdGVwcy5ldmVyeShzID0+IHMuc3RhdHVzID09PSAnZG9uZScpID8gJ1x1MjcxMydcbiAgICAgICAgICAgICAgICA6IHRhc2suc3RlcHMuc29tZShzID0+IHMuc3RhdHVzID09PSAncnVubmluZycpID8gJ1x1MjdGMydcbiAgICAgICAgICAgICAgICA6ICdcdTI1Q0InO1xuXG4gICAgICAgICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6ICdhaS1hZ2VudC10YXNrLWljb24nLCB0ZXh0OiBpY29uIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gaXRlbS5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC10YXNrLWluZm8nIH0pO1xuICAgICAgICAgICAgaW5mby5jcmVhdGVEaXYoeyBjbHM6ICdhaS1hZ2VudC10YXNrLWRlc2MnLCB0ZXh0OiB0YXNrLmFydGljbGUudGl0bGUgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0ZXBzRWwgPSBpbmZvLmNyZWF0ZURpdih7IGNsczogJ2FpLWFnZW50LXRhc2stc3RlcHMnIH0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCBzdGVwIG9mIHRhc2suc3RlcHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzSWNvbiA9IHN0ZXAuc3RhdHVzID09PSAnZG9uZScgPyAnXHUyNzEzJ1xuICAgICAgICAgICAgICAgICAgICA6IHN0ZXAuc3RhdHVzID09PSAncnVubmluZycgPyAnXHUyN0YzJ1xuICAgICAgICAgICAgICAgICAgICA6IHN0ZXAuc3RhdHVzID09PSAnZmFpbGVkJyA/ICdcdTI3MTcnXG4gICAgICAgICAgICAgICAgICAgIDogJ1x1MjVDQic7XG4gICAgICAgICAgICAgICAgc3RlcHNFbC5jcmVhdGVTcGFuKHtcbiAgICAgICAgICAgICAgICAgICAgY2xzOiBgYWktYWdlbnQtc3RlcC1iYWRnZSBhaS1hZ2VudC1zdGVwLSR7c3RlcC5zdGF0dXN9YCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYCR7c0ljb259ICR7U1RFUF9MQUJFTFNbc3RlcC5zdGVwXX1gLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFzay5hcnRpY2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiAnYWktYWdlbnQtdGFzay1lcnJvcicsIHRleHQ6IHRhc2suYXJ0aWNsZS5lcnJvci5zbGljZSgwLCA4MCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA9PT09PSBVdGlscyA9PT09PVxuICAgIHByaXZhdGUgc2Nyb2xsVG9Cb3R0b20oKTogdm9pZCB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VDb250YWluZXIuc2Nyb2xsVG9wID0gdGhpcy5tZXNzYWdlQ29udGFpbmVyLnNjcm9sbEhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTdGF0dXNCYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFRleHQodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVmYXVsdFByb3ZpZGVyKTtcbiAgICB9XG5cbiAgICBhcHBseVNldHRpbmdzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZnJlc2hGb250U2l6ZSgpO1xuICAgICAgICB0aGlzLnN0YXR1c0Jhci5zZXRUZXh0KCcnKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5vcm1hbGl6ZVBhdGgocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL1xcLysvZywgJy8nKS5yZXBsYWNlKC9eXFwvKy8sICcnKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgTWVzc2FnZSwgUGlwZWxpbmVTdGVwSWQsIEFydGljbGVUYXNrLCBEb2N1bWVudFBsYW4sIFBpcGVsaW5lU3RlcENvbmZpZyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEFwcCwgVEZpbGUsIG5vcm1hbGl6ZVBhdGggfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBBUElDbGllbnQgfSBmcm9tICcuL2FwaS1jbGllbnQnO1xuaW1wb3J0IHsgVXNhZ2VUcmFja2VyIH0gZnJvbSAnLi91c2FnZS10cmFja2VyJztcbmltcG9ydCB0eXBlIEFJQWdlbnRQbHVnaW4gZnJvbSAnLi4vbWFpbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVDYWxsYmFja3Mge1xuICAgIG9uUGxhbkdlbmVyYXRlZDogKHBsYW46IERvY3VtZW50UGxhbikgPT4gdm9pZDtcbiAgICByZXF1ZXN0UGxhbkNvbmZpcm1hdGlvbjogKHBsYW46IERvY3VtZW50UGxhbikgPT4gUHJvbWlzZTxEb2N1bWVudFBsYW4gfCBudWxsPjtcbiAgICBvbkFydGljbGVTdGF0dXNDaGFuZ2U6IChhcnRpY2xlOiBBcnRpY2xlVGFzaywgc3RlcDogUGlwZWxpbmVTdGVwSWQsIHN0YXR1czogc3RyaW5nKSA9PiB2b2lkO1xuICAgIG9uU3RhdHVzQ2hhbmdlOiAoc3RhdHVzOiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgb25Vc2FnZVVwZGF0ZTogKHN1bW1hcnk6IHN0cmluZykgPT4gdm9pZDtcbiAgICBvbkNvbXBsZXRlOiAoKSA9PiB2b2lkO1xuICAgIG9uRXJyb3I6IChlcnJvcjogc3RyaW5nKSA9PiB2b2lkO1xufVxuXG5mdW5jdGlvbiBzdWJzdGl0dXRlVmFycyh0ZW1wbGF0ZTogc3RyaW5nLCB2YXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0ID0gdGVtcGxhdGU7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFycykpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UobmV3IFJlZ0V4cChgXFxcXHtcXFxceyR7a2V5fVxcXFx9XFxcXH1gLCAnZycpLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZUVuZ2luZSB7XG4gICAgcHJpdmF0ZSBwbHVnaW46IEFJQWdlbnRQbHVnaW47XG4gICAgcHJpdmF0ZSBhcGlDbGllbnQ6IEFQSUNsaWVudDtcbiAgICB1c2FnZVRyYWNrZXI6IFVzYWdlVHJhY2tlcjtcblxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogQUlBZ2VudFBsdWdpbikge1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5hcGlDbGllbnQgPSBuZXcgQVBJQ2xpZW50KHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgIHRoaXMudXNhZ2VUcmFja2VyID0gbmV3IFVzYWdlVHJhY2tlcigpO1xuICAgIH1cblxuICAgIHVwZGF0ZVNldHRpbmdzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFwaUNsaWVudC51cGRhdGVTZXR0aW5ncyh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgYWJvcnQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBpQ2xpZW50LmFib3J0KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuUGlwZWxpbmUoXG4gICAgICAgIHVzZXJJbnB1dDogc3RyaW5nLFxuICAgICAgICBjYWxsYmFja3M6IFBpcGVsaW5lQ2FsbGJhY2tzLFxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBwcm9tcHRzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MucGlwZWxpbmVQcm9tcHRzO1xuICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMucmVzb2x2ZU1vZGVsKHVzZXJJbnB1dCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vID09PT09IFN0ZXAgMDogUGxhbiA9PT09PVxuICAgICAgICAgICAgY2FsbGJhY2tzLm9uU3RhdHVzQ2hhbmdlKCdcdTZCNjNcdTU3MjhcdTUyMDZcdTY3OTBcdTk3MDBcdTZDNDJcdUZGMENcdTc1MUZcdTYyMTBcdThCQTFcdTUyMTIuLi4nKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYW5Db25maWcgPSBwcm9tcHRzLnBsYW47XG4gICAgICAgICAgICBsZXQgcGxhbjogRG9jdW1lbnRQbGFuO1xuXG4gICAgICAgICAgICBpZiAocGxhbkNvbmZpZy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGxhblByb21wdCA9IHN1YnN0aXR1dGVWYXJzKHBsYW5Db25maWcucHJvbXB0VGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9pbnB1dDogdXNlcklucHV0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBsYW5Db250ZW50ID0gYXdhaXQgdGhpcy5jYWxsTExNKHBsYW5Qcm9tcHQsIG1vZGVsLCBjYWxsYmFja3MpO1xuXG4gICAgICAgICAgICAgICAgcGxhbiA9IHRoaXMucGFyc2VQbGFuKHBsYW5Db250ZW50LCB1c2VySW5wdXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBQbGFuIHN0ZXAgZGlzYWJsZWQ6IGNyZWF0ZSBzaW5nbGUgYXJ0aWNsZSBmcm9tIHVzZXIgaW5wdXRcbiAgICAgICAgICAgICAgICBwbGFuID0gdGhpcy5jcmVhdGVTaW5nbGVBcnRpY2xlUGxhbih1c2VySW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWxsYmFja3Mub25QbGFuR2VuZXJhdGVkKHBsYW4pO1xuXG4gICAgICAgICAgICAvLyBBc2sgZm9yIGNvbmZpcm1hdGlvbiBpZiBtdWx0aXBsZSBhcnRpY2xlc1xuICAgICAgICAgICAgaWYgKHBsYW4uYXJ0aWNsZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpcm1lZCA9IGF3YWl0IGNhbGxiYWNrcy5yZXF1ZXN0UGxhbkNvbmZpcm1hdGlvbihwbGFuKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbmZpcm1lZCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25FcnJvcignXHU3NTI4XHU2MjM3XHU1M0Q2XHU2RDg4XHU0RTg2XHU2NENEXHU0RjVDJyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGxhbiA9IGNvbmZpcm1lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBsYW4uYXJ0aWNsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uRXJyb3IoJ1x1NjcyQVx1ODBGRFx1NzUxRlx1NjIxMFx1NjcwOVx1NjU0OFx1NzY4NFx1NjU4N1x1N0FFMFx1OEJBMVx1NTIxMicpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA9PT09PSBFeGVjdXRlIGVhY2ggYXJ0aWNsZSB0aHJvdWdoIHN0ZXBzIDEtMyA9PT09PVxuICAgICAgICAgICAgZm9yIChjb25zdCBhcnRpY2xlIG9mIHBsYW4uYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdGVwIDE6IERyYWZ0XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vbkFydGljbGVTdGF0dXNDaGFuZ2UoYXJ0aWNsZSwgJ2RyYWZ0JywgJ2RyYWZ0aW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vblN0YXR1c0NoYW5nZShgXHU2QjYzXHU1NzI4XHU3NTFGXHU2MjEwXHVGRjFBJHthcnRpY2xlLnRpdGxlfWApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkcmFmdCA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVEcmFmdChhcnRpY2xlLCB1c2VySW5wdXQsIHByb21wdHMuZHJhZnQsIG1vZGVsLCBjYWxsYmFja3MpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25BcnRpY2xlU3RhdHVzQ2hhbmdlKGFydGljbGUsICdkcmFmdCcsICdkb25lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU3RlcCAyOiBQb2xpc2hcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uQXJ0aWNsZVN0YXR1c0NoYW5nZShhcnRpY2xlLCAncG9saXNoJywgJ3BvbGlzaGluZycpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25TdGF0dXNDaGFuZ2UoYFx1NkI2M1x1NTcyOFx1NkRBNlx1ODI3Mlx1RkYxQSR7YXJ0aWNsZS50aXRsZX1gKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9saXNoZWQgPSBhd2FpdCB0aGlzLnBvbGlzaEFydGljbGUoYXJ0aWNsZSwgZHJhZnQsIHVzZXJJbnB1dCwgcHJvbXB0cy5wb2xpc2gsIG1vZGVsLCBjYWxsYmFja3MpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVGaWxlKGFydGljbGUucGF0aCwgcG9saXNoZWQpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25BcnRpY2xlU3RhdHVzQ2hhbmdlKGFydGljbGUsICdwb2xpc2gnLCAnZG9uZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFN0ZXAgMzogQ2hlY2tcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uQXJ0aWNsZVN0YXR1c0NoYW5nZShhcnRpY2xlLCAnY2hlY2snLCAnY2hlY2tpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uU3RhdHVzQ2hhbmdlKGBcdTZCNjNcdTU3MjhcdTY4QzBcdTY3RTVcdThCRURcdTZDRDVcdUZGMUEke2FydGljbGUudGl0bGV9YCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBhd2FpdCB0aGlzLmNoZWNrQXJ0aWNsZShhcnRpY2xlLCBwb2xpc2hlZCwgcHJvbXB0cy5jaGVjaywgbW9kZWwsIGNhbGxiYWNrcyk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZUZpbGUoYXJ0aWNsZS5wYXRoLCBjaGVja2VkKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uQXJ0aWNsZVN0YXR1c0NoYW5nZShhcnRpY2xlLCAnY2hlY2snLCAnZG9uZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFydGljbGUuc3RhdHVzID0gJ2RvbmUnO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25TdGF0dXNDaGFuZ2UoYFx1NUI4Q1x1NjIxMFx1RkYxQSR7YXJ0aWNsZS50aXRsZX1gKTtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGUuc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGUuZXJyb3IgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uQXJ0aWNsZVN0YXR1c0NoYW5nZShhcnRpY2xlLCAnZHJhZnQnLCAnZmFpbGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vblN0YXR1c0NoYW5nZShgXHU1OTMxXHU4RDI1XHVGRjFBJHthcnRpY2xlLnRpdGxlfSAtICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA9PT09PSBTdGVwIDQ6IENyb3NzLWxpbmsgKGlmIG11bHRpcGxlIGFydGljbGVzIHN1Y2NlZWRlZCkgPT09PT1cbiAgICAgICAgICAgIGNvbnN0IHN1Y2NlZWRlZCA9IHBsYW4uYXJ0aWNsZXMuZmlsdGVyKGEgPT4gYS5zdGF0dXMgPT09ICdkb25lJyk7XG4gICAgICAgICAgICBpZiAoc3VjY2VlZGVkLmxlbmd0aCA+IDEgJiYgcHJvbXB0cy5saW5rLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25TdGF0dXNDaGFuZ2UoJ1x1NkI2M1x1NTcyOFx1NkRGQlx1NTJBMFx1NjU4N1x1N0FFMFx1OTVGNFx1OTRGRVx1NjNBNS4uLicpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY3Jvc3NMaW5rKHN1Y2NlZWRlZCwgcHJvbXB0cy5saW5rLCBtb2RlbCwgY2FsbGJhY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uU3RhdHVzQ2hhbmdlKCdcdTY1ODdcdTdBRTBcdTk0RkVcdTYzQTVcdTVCOENcdTYyMTAnKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25TdGF0dXNDaGFuZ2UoYFx1NjU4N1x1N0FFMFx1OTRGRVx1NjNBNVx1NTkzMVx1OEQyNVx1RkYxQSR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICBjYWxsYmFja3Mub25FcnJvcihlcnIubWVzc2FnZSB8fCAnXHU2RDQxXHU2QzM0XHU3RUJGXHU2MjY3XHU4ODRDXHU1MUZBXHU5NTE5Jyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBjYWxsYmFja3Mub25Db21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPT09PT0gU3RlcCAxOiBEcmFmdCA9PT09PVxuICAgIHByaXZhdGUgYXN5bmMgZ2VuZXJhdGVEcmFmdChcbiAgICAgICAgYXJ0aWNsZTogQXJ0aWNsZVRhc2ssXG4gICAgICAgIHVzZXJJbnB1dDogc3RyaW5nLFxuICAgICAgICBjb25maWc6IFBpcGVsaW5lU3RlcENvbmZpZyxcbiAgICAgICAgbW9kZWw6IHN0cmluZyxcbiAgICAgICAgY2FsbGJhY2tzOiBQaXBlbGluZUNhbGxiYWNrcyxcbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIWNvbmZpZy5lbmFibGVkKSB7XG4gICAgICAgICAgICAvLyBJZiBkcmFmdCBpcyBkaXNhYmxlZCwgY3JlYXRlIGVtcHR5IHRlbXBsYXRlXG4gICAgICAgICAgICByZXR1cm4gYCMgJHthcnRpY2xlLnRpdGxlfVxcblxcbiR7YXJ0aWNsZS50b3BpY31cXG5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbXB0ID0gc3Vic3RpdHV0ZVZhcnMoY29uZmlnLnByb21wdFRlbXBsYXRlLCB7XG4gICAgICAgICAgICBhcnRpY2xlX3RpdGxlOiBhcnRpY2xlLnRpdGxlLFxuICAgICAgICAgICAgYXJ0aWNsZV90b3BpYzogYXJ0aWNsZS50b3BpYyxcbiAgICAgICAgICAgIHVzZXJfaW5wdXQ6IHVzZXJJbnB1dCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbExMTShwcm9tcHQsIG1vZGVsLCBjYWxsYmFja3MpO1xuICAgIH1cblxuICAgIC8vID09PT09IFN0ZXAgMjogUG9saXNoID09PT09XG4gICAgcHJpdmF0ZSBhc3luYyBwb2xpc2hBcnRpY2xlKFxuICAgICAgICBhcnRpY2xlOiBBcnRpY2xlVGFzayxcbiAgICAgICAgZHJhZnRDb250ZW50OiBzdHJpbmcsXG4gICAgICAgIHVzZXJJbnB1dDogc3RyaW5nLFxuICAgICAgICBjb25maWc6IFBpcGVsaW5lU3RlcENvbmZpZyxcbiAgICAgICAgbW9kZWw6IHN0cmluZyxcbiAgICAgICAgY2FsbGJhY2tzOiBQaXBlbGluZUNhbGxiYWNrcyxcbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIWNvbmZpZy5lbmFibGVkKSByZXR1cm4gZHJhZnRDb250ZW50O1xuXG4gICAgICAgIGNvbnN0IHByb21wdCA9IHN1YnN0aXR1dGVWYXJzKGNvbmZpZy5wcm9tcHRUZW1wbGF0ZSwge1xuICAgICAgICAgICAgYXJ0aWNsZV90aXRsZTogYXJ0aWNsZS50aXRsZSxcbiAgICAgICAgICAgIGFydGljbGVfcGF0aDogYXJ0aWNsZS5wYXRoLFxuICAgICAgICAgICAgZHJhZnRfY29udGVudDogZHJhZnRDb250ZW50LFxuICAgICAgICAgICAgdXNlcl9pbnB1dDogdXNlcklucHV0LFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jYWxsTExNKHByb21wdCwgbW9kZWwsIGNhbGxiYWNrcyk7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gU3RlcCAzOiBDaGVjayA9PT09PVxuICAgIHByaXZhdGUgYXN5bmMgY2hlY2tBcnRpY2xlKFxuICAgICAgICBhcnRpY2xlOiBBcnRpY2xlVGFzayxcbiAgICAgICAgY29udGVudDogc3RyaW5nLFxuICAgICAgICBjb25maWc6IFBpcGVsaW5lU3RlcENvbmZpZyxcbiAgICAgICAgbW9kZWw6IHN0cmluZyxcbiAgICAgICAgY2FsbGJhY2tzOiBQaXBlbGluZUNhbGxiYWNrcyxcbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIWNvbmZpZy5lbmFibGVkKSByZXR1cm4gY29udGVudDtcblxuICAgICAgICBjb25zdCBwcm9tcHQgPSBzdWJzdGl0dXRlVmFycyhjb25maWcucHJvbXB0VGVtcGxhdGUsIHtcbiAgICAgICAgICAgIGFydGljbGVfcGF0aDogYXJ0aWNsZS5wYXRoLFxuICAgICAgICAgICAgZHJhZnRfY29udGVudDogY29udGVudCxcbiAgICAgICAgICAgIGFydGljbGVfdGl0bGU6IGFydGljbGUudGl0bGUsXG4gICAgICAgICAgICB1c2VyX2lucHV0OiAnJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbExMTShwcm9tcHQsIG1vZGVsLCBjYWxsYmFja3MpO1xuICAgIH1cblxuICAgIC8vID09PT09IFN0ZXAgNDogQ3Jvc3MtbGluayA9PT09PVxuICAgIHByaXZhdGUgYXN5bmMgY3Jvc3NMaW5rKFxuICAgICAgICBhcnRpY2xlczogQXJ0aWNsZVRhc2tbXSxcbiAgICAgICAgY29uZmlnOiBQaXBlbGluZVN0ZXBDb25maWcsXG4gICAgICAgIG1vZGVsOiBzdHJpbmcsXG4gICAgICAgIGNhbGxiYWNrczogUGlwZWxpbmVDYWxsYmFja3MsXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghY29uZmlnLmVuYWJsZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBhcnRpY2xlSW5mb3M6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcnRpY2xlcykge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMucmVhZEZpbGUoYS5wYXRoKTtcbiAgICAgICAgICAgIGFydGljbGVJbmZvcy5wdXNoKGAtLS0gXHU2NTg3XHU0RUY2XHVGRjFBJHthLnBhdGh9IC0tLVxcblx1NjgwN1x1OTg5OFx1RkYxQSR7YS50aXRsZX1cXG5cdTUxODVcdTVCQjlcdUZGMUFcXG4ke2NvbnRlbnR9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9tcHQgPSBzdWJzdGl0dXRlVmFycyhjb25maWcucHJvbXB0VGVtcGxhdGUsIHtcbiAgICAgICAgICAgIGFsbF9hcnRpY2xlczogYXJ0aWNsZUluZm9zLmpvaW4oJ1xcblxcbicpLFxuICAgICAgICAgICAgdXNlcl9pbnB1dDogJycsXG4gICAgICAgICAgICBhcnRpY2xlX3RpdGxlOiAnJyxcbiAgICAgICAgICAgIGFydGljbGVfdG9waWM6ICcnLFxuICAgICAgICAgICAgYXJ0aWNsZV9wYXRoOiAnJyxcbiAgICAgICAgICAgIGRyYWZ0X2NvbnRlbnQ6ICcnLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmNhbGxMTE0ocHJvbXB0LCBtb2RlbCwgY2FsbGJhY2tzKTtcblxuICAgICAgICAvLyBTcGxpdCByZXN1bHQgYmFjayBpbnRvIGluZGl2aWR1YWwgZmlsZXNcbiAgICAgICAgY29uc3QgZmlsZVBhdHRlcm4gPSAvLS0tRklMRTooLis/KS0tLVxcbihbXFxzXFxTXSo/KSg/PVxcbi0tLUZJTEU6fC0tLSR8JCkvZztcbiAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICB3aGlsZSAoKG1hdGNoID0gZmlsZVBhdHRlcm4uZXhlYyhyZXN1bHQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBtYXRjaFsxXS50cmltKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IG1hdGNoWzJdLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aCAmJiBmaWxlQ29udGVudCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZUZpbGUobm9ybWFsaXplUGF0aChmaWxlUGF0aCksIGZpbGVDb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vID09PT09IExMTSBDYWxsID09PT09XG4gICAgcHJpdmF0ZSBhc3luYyBjYWxsTExNKFxuICAgICAgICBzeXN0ZW1Qcm9tcHQ6IHN0cmluZyxcbiAgICAgICAgbW9kZWw6IHN0cmluZyxcbiAgICAgICAgY2FsbGJhY2tzOiBQaXBlbGluZUNhbGxiYWNrcyxcbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtcbiAgICAgICAgICAgIHsgcm9sZTogJ3N5c3RlbScsIGNvbnRlbnQ6IHN5c3RlbVByb21wdCB9LFxuICAgICAgICAgICAgeyByb2xlOiAndXNlcicsIGNvbnRlbnQ6ICdcdThCRjdcdTVGMDBcdTU5Q0JcdTMwMDInIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5hcGlDbGllbnQuY2hhdChtZXNzYWdlcywgdW5kZWZpbmVkLCBtb2RlbCk7XG5cbiAgICAgICAgLy8gVHJhY2sgdXNhZ2VcbiAgICAgICAgaWYgKHJlc3VsdC51c2FnZSkge1xuICAgICAgICAgICAgdGhpcy51c2FnZVRyYWNrZXIuc2V0TW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgdGhpcy51c2FnZVRyYWNrZXIuYWRkVXNhZ2UoXG4gICAgICAgICAgICAgICAgcmVzdWx0LnVzYWdlLnByb21wdCwgcmVzdWx0LnVzYWdlLmNvbXBsZXRpb24sXG4gICAgICAgICAgICAgICAgcmVzdWx0LnVzYWdlLmNhY2hlSGl0LCByZXN1bHQudXNhZ2UuY2FjaGVNaXNzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5vblVzYWdlVXBkYXRlKHRoaXMudXNhZ2VUcmFja2VyLmdldFN1bW1hcnkoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0LmNvbnRlbnQgfHwgJyc7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gRmlsZSBIZWxwZXJzID09PT09XG4gICAgcHJpdmF0ZSBhc3luYyBzYXZlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplUGF0aChwYXRoKTtcbiAgICAgICAgLy8gRW5zdXJlIHBhcmVudCBkaXJlY3RvcnkgZXhpc3RzXG4gICAgICAgIGNvbnN0IGRpciA9IG5vcm1hbGl6ZWQuc3Vic3RyaW5nKDAsIG5vcm1hbGl6ZWQubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpckV4aXN0cyA9IHRoaXMucGx1Z2luLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZGlyKTtcbiAgICAgICAgICAgIGlmICghZGlyRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihkaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLnBsdWdpbi5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG5vcm1hbGl6ZWQpO1xuICAgICAgICBpZiAoZXhpc3RpbmcgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLnZhdWx0Lm1vZGlmeShleGlzdGluZywgY29udGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5hcHAudmF1bHQuY3JlYXRlKG5vcm1hbGl6ZWQsIGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZWFkRmlsZShwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplUGF0aChwYXRoKTtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMucGx1Z2luLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgobm9ybWFsaXplZCk7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gPT09PT0gUGxhbiBQYXJzaW5nID09PT09XG4gICAgcHJpdmF0ZSBwYXJzZVBsYW4oY29udGVudDogc3RyaW5nLCB1c2VySW5wdXQ6IHN0cmluZyk6IERvY3VtZW50UGxhbiB7XG4gICAgICAgIC8vIFRyeSB0byBleHRyYWN0IEpTT04gZnJvbSB0aGUgcmVzcG9uc2VcbiAgICAgICAgbGV0IGpzb25TdHIgPSBjb250ZW50O1xuXG4gICAgICAgIC8vIExvb2sgZm9yIEpTT04gYXJyYXlcbiAgICAgICAgY29uc3QgYXJyYXlNYXRjaCA9IGNvbnRlbnQubWF0Y2goL1xcW1xccypcXHtbXFxzXFxTXSpcXH1cXHMqXFxdLyk7XG4gICAgICAgIGlmIChhcnJheU1hdGNoKSB7XG4gICAgICAgICAgICBqc29uU3RyID0gYXJyYXlNYXRjaFswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhcnRpY2xlcyA9IEpTT04ucGFyc2UoanNvblN0cikgYXMgQXJyYXk8e1xuICAgICAgICAgICAgICAgIHRpdGxlPzogc3RyaW5nO1xuICAgICAgICAgICAgICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgdG9waWM/OiBzdHJpbmc7XG4gICAgICAgICAgICB9PjtcblxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFydGljbGVzKSB8fCBhcnRpY2xlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVTaW5nbGVBcnRpY2xlUGxhbih1c2VySW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFydGljbGVzOiBhcnRpY2xlcy5tYXAoKGEsIGkpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBhLnRpdGxlIHx8IGBcdTY1ODdcdTY4NjMgJHtpICsgMX1gLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBhLnBhdGggfHwgYEFJXHU3NTFGXHU2MjEwL1x1NjU4N1x1Njg2MyR7aSArIDF9Lm1kYCxcbiAgICAgICAgICAgICAgICAgICAgdG9waWM6IGEudG9waWMgfHwgdXNlcklucHV0LnNsaWNlKDAsIDEwMCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3BlbmRpbmcnIGFzIGNvbnN0LFxuICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgLy8gSlNPTiBwYXJzZSBmYWlsZWQsIGNyZWF0ZSBzaW5nbGUgYXJ0aWNsZSBwbGFuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVTaW5nbGVBcnRpY2xlUGxhbih1c2VySW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTaW5nbGVBcnRpY2xlUGxhbih1c2VySW5wdXQ6IHN0cmluZyk6IERvY3VtZW50UGxhbiB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gdXNlcklucHV0Lmxlbmd0aCA+IDQwID8gdXNlcklucHV0LnNsaWNlKDAsIDQwKSArICcuLi4nIDogdXNlcklucHV0O1xuICAgICAgICBjb25zdCBzYWZlVGl0bGUgPSB0aXRsZS5yZXBsYWNlKC9bXFxcXC86Kj9cIjw+fF0vZywgJy0nKTtcbiAgICAgICAgY29uc3QgZGF0ZVN0ciA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFydGljbGVzOiBbe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBzYWZlVGl0bGUsXG4gICAgICAgICAgICAgICAgcGF0aDogYEFJXHU3NTFGXHU2MjEwLyR7ZGF0ZVN0cn0tJHtzYWZlVGl0bGV9Lm1kYCxcbiAgICAgICAgICAgICAgICB0b3BpYzogdXNlcklucHV0LFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ3BlbmRpbmcnLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvbHZlTW9kZWwodXNlcklucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVmYXVsdE1vZGVsICE9PSAnYXV0bycpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0TW9kZWw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXV0bzogYWx3YXlzIHVzZSBQcm8gZm9yIHBpcGVsaW5lIChtdWx0aS1zdGVwIGRvY3VtZW50IGdlbmVyYXRpb24pXG4gICAgICAgIHJldHVybiAnZGVlcHNlZWstdjQtcHJvJztcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgQ2hhdENvbXBsZXRpb25SZXF1ZXN0LCBDaGF0Q29tcGxldGlvbkNodW5rLCBBSVByb3ZpZGVyIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQUlBZ2VudFNldHRpbmdzLCByZXNvbHZlQXBpS2V5IH0gZnJvbSAnLi4vc2V0dGluZ3Mvc2V0dGluZ3Mtc3RvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmVhbUNhbGxiYWNrcyB7XG4gICAgb25Ub2tlbjogKHRva2VuOiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgb25Db21wbGV0ZTogKGNvbnRlbnQ6IHN0cmluZywgdXNhZ2U/OiB7IHByb21wdDogbnVtYmVyOyBjb21wbGV0aW9uOiBudW1iZXI7IHRvdGFsOiBudW1iZXI7IGNhY2hlSGl0PzogbnVtYmVyOyBjYWNoZU1pc3M/OiBudW1iZXIgfSkgPT4gdm9pZDtcbiAgICBvbkVycm9yOiAoZXJyb3I6IEVycm9yKSA9PiB2b2lkO1xufVxuXG5mdW5jdGlvbiBzYW5pdGl6ZVN0cmluZyhzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghcykgcmV0dXJuIHM7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvW1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD88IVtcXHVEODAwLVxcdURCRkZdKVtcXHVEQzAwLVxcdURGRkZdL2csICcnKVxuICAgICAgICAucmVwbGFjZSgvW1xceDAwLVxceDA4XFx4MEJcXHgwQ1xceDBFLVxceDFGXFx4N0ZdL2csICcnKTtcbn1cblxuZnVuY3Rpb24gc2FmZUpTT05TdHJpbmdpZnkob2JqOiB1bmtub3duLCBzcGFjZT86IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgKF9rZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2FuaXRpemVTdHJpbmcodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LCBzcGFjZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBBUElDbGllbnQge1xuICAgIHByaXZhdGUgc2V0dGluZ3M6IEFJQWdlbnRTZXR0aW5ncztcbiAgICBwcml2YXRlIGFib3J0Q29udHJvbGxlcjogQWJvcnRDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nczogQUlBZ2VudFNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB9XG5cbiAgICB1cGRhdGVTZXR0aW5ncyhzZXR0aW5nczogQUlBZ2VudFNldHRpbmdzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB9XG5cbiAgICBhYm9ydCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpO1xuICAgICAgICAgICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBmZXRjaFdpdGhSZXRyeShcbiAgICAgICAgdXJsOiBzdHJpbmcsXG4gICAgICAgIGluaXQ6IFJlcXVlc3RJbml0LFxuICAgICAgICBpc1N0cmVhbWluZzogYm9vbGVhbixcbiAgICApOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IG1heFJldHJpZXMgPSB0aGlzLnNldHRpbmdzLm1heFJldHJpZXM7XG4gICAgICAgIGNvbnN0IHRpbWVvdXRNcyA9IHRoaXMuc2V0dGluZ3MucmVxdWVzdFRpbWVvdXQgKiAxMDAwO1xuICAgICAgICBsZXQgbGFzdEVycm9yOiBFcnJvciB8IG51bGwgPSBudWxsO1xuXG4gICAgICAgIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDw9IG1heFJldHJpZXM7IGF0dGVtcHQrKykge1xuICAgICAgICAgICAgY29uc3QgdGltZW91dENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgICBjb25zdCB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHRpbWVvdXRDb250cm9sbGVyLmFib3J0KCksIHRpbWVvdXRNcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkU2lnbmFsID0gdGltZW91dENvbnRyb2xsZXIuc2lnbmFsO1xuICAgICAgICAgICAgY29uc3QgbWVyZ2VkSW5pdCA9IHsgLi4uaW5pdCwgc2lnbmFsOiBjb21iaW5lZFNpZ25hbCB9O1xuXG4gICAgICAgICAgICBjb25zdCBvbkV4dGVybmFsQWJvcnQgPSAoKSA9PiB0aW1lb3V0Q29udHJvbGxlci5hYm9ydCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25FeHRlcm5hbEFib3J0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgbWVyZ2VkSW5pdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDI5IHx8IHJlc3BvbnNlLnN0YXR1cyA+PSA1MDApICYmIGF0dGVtcHQgPCBtYXhSZXRyaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5taW4oMTAwMCAqIE1hdGgucG93KDIsIGF0dGVtcHQpICsgTWF0aC5yYW5kb20oKSAqIDEwMDAsIDMwMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBbQUkgQWdlbnRdIEFQSSAke3Jlc3BvbnNlLnN0YXR1c30sIHJldHJ5aW5nIGluICR7TWF0aC5yb3VuZChkZWxheSl9bXMgKGF0dGVtcHQgJHthdHRlbXB0ICsgMX0vJHttYXhSZXRyaWVzfSlgKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIGRlbGF5KSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgbGFzdEVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgIGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFib3J0Q29udHJvbGxlcj8uc2lnbmFsLmFib3J0ZWQpIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGVtcHQgPCBtYXhSZXRyaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgubWluKDEwMDAgKiBNYXRoLnBvdygyLCBhdHRlbXB0KSwgMTUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBbQUkgQWdlbnRdIFJlcXVlc3QgdGltZW91dCwgcmV0cnlpbmcgaW4gJHtNYXRoLnJvdW5kKGRlbGF5KX1tcyAoYXR0ZW1wdCAke2F0dGVtcHQgKyAxfS8ke21heFJldHJpZXN9KWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIGRlbGF5KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFx1OEJGN1x1NkM0Mlx1OEQ4NVx1NjVGNlx1RkYwOCR7dGhpcy5zZXR0aW5ncy5yZXF1ZXN0VGltZW91dH1cdTc5RDJcdUZGMDlgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dGVtcHQgPCBtYXhSZXRyaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5taW4oMTAwMCAqIE1hdGgucG93KDIsIGF0dGVtcHQpLCAxNTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgW0FJIEFnZW50XSBOZXR3b3JrIGVycm9yOiAke2Vyci5tZXNzYWdlfSwgcmV0cnlpbmcgaW4gJHtNYXRoLnJvdW5kKGRlbGF5KX1tc2ApO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgZGVsYXkpKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uRXh0ZXJuYWxBYm9ydCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbGFzdEVycm9yIHx8IG5ldyBFcnJvcignQVBJIFx1OEJGN1x1NkM0Mlx1NTkzMVx1OEQyNVx1RkYwQ1x1NURGMlx1OEZCRVx1NjcwMFx1NTkyN1x1OTFDRFx1OEJENVx1NkIyMVx1NjU3MCcpO1xuICAgIH1cblxuICAgIGFzeW5jIGNoYXQoXG4gICAgICAgIG1lc3NhZ2VzOiB7IHJvbGU6IHN0cmluZzsgY29udGVudDogc3RyaW5nIHwgbnVsbCB9W10sXG4gICAgICAgIHRvb2xzPzogYW55W10sXG4gICAgICAgIG1vZGVsT3ZlcnJpZGU/OiBzdHJpbmcsXG4gICAgKTogUHJvbWlzZTx7XG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICAgICAgdXNhZ2U/OiB7IHByb21wdDogbnVtYmVyOyBjb21wbGV0aW9uOiBudW1iZXI7IHRvdGFsOiBudW1iZXI7IGNhY2hlSGl0PzogbnVtYmVyOyBjYWNoZU1pc3M/OiBudW1iZXIgfTtcbiAgICB9PiB7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5zZXR0aW5ncy5wcm92aWRlcnMuZmluZCgocDogQUlQcm92aWRlcikgPT4gcC5pZCA9PT0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0UHJvdmlkZXIpO1xuICAgICAgICBpZiAoIXByb3ZpZGVyKSB0aHJvdyBuZXcgRXJyb3IoJ1x1NjcyQVx1NjI3RVx1NTIzMFx1NTNFRlx1NzUyOFx1NzY4NCBBSSBcdTY3MERcdTUyQTFcdTU1NDZcdTkxNERcdTdGNkUnKTtcblxuICAgICAgICBjb25zdCBhcGlLZXkgPSByZXNvbHZlQXBpS2V5KHByb3ZpZGVyLmFwaUtleSk7XG4gICAgICAgIGlmICghYXBpS2V5KSB0aHJvdyBuZXcgRXJyb3IoYEFQSSBLZXkgXHU2NzJBXHU5MTREXHU3RjZFXHVGRjA4XHU2NzBEXHU1MkExXHU1NTQ2XHVGRjFBJHtwcm92aWRlci5uYW1lfVx1RkYwOWApO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGAke3Byb3ZpZGVyLmJhc2VVcmwucmVwbGFjZSgvXFwvJC8sICcnKX0vY2hhdC9jb21wbGV0aW9uc2A7XG4gICAgICAgIGxldCBtb2RlbCA9IG1vZGVsT3ZlcnJpZGUgfHwgdGhpcy5zZXR0aW5ncy5kZWZhdWx0TW9kZWw7XG4gICAgICAgIGlmIChtb2RlbCA9PT0gJ2F1dG8nKSB7XG4gICAgICAgICAgICBtb2RlbCA9IHByb3ZpZGVyLm1vZGVsc1swXSB8fCAnZGVmYXVsdCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBib2R5OiBDaGF0Q29tcGxldGlvblJlcXVlc3QgPSB7XG4gICAgICAgICAgICBtb2RlbCxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlcyBhcyBhbnksXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogdGhpcy5zZXR0aW5ncy50ZW1wZXJhdHVyZSxcbiAgICAgICAgICAgIHRvcF9wOiB0aGlzLnNldHRpbmdzLnRvcFAsXG4gICAgICAgICAgICBtYXhfdG9rZW5zOiB0aGlzLnNldHRpbmdzLm1heFRva2VucyxcbiAgICAgICAgICAgIHN0cmVhbTogZmFsc2UsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZldGNoV2l0aFJldHJ5KHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHthcGlLZXl9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBzYWZlSlNPTlN0cmluZ2lmeShib2R5KSxcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKS5jYXRjaCgoKSA9PiAnXHU2NzJBXHU3N0U1XHU5NTE5XHU4QkVGJyk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSBcdThCRjdcdTZDNDJcdTU5MzFcdThEMjUgKCR7cmVzcG9uc2Uuc3RhdHVzfSk6ICR7ZXJyb3JUZXh0fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgY29uc3QgY2hvaWNlID0gZGF0YS5jaG9pY2VzPy5bMF07XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBjaG9pY2U/Lm1lc3NhZ2UgfHwge307XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBtZXNzYWdlLmNvbnRlbnQgfHwgJyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICB1c2FnZTogZGF0YS51c2FnZSA/IHtcbiAgICAgICAgICAgICAgICBwcm9tcHQ6IGRhdGEudXNhZ2UucHJvbXB0X3Rva2VucyxcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9uOiBkYXRhLnVzYWdlLmNvbXBsZXRpb25fdG9rZW5zLFxuICAgICAgICAgICAgICAgIHRvdGFsOiBkYXRhLnVzYWdlLnRvdGFsX3Rva2VucyxcbiAgICAgICAgICAgICAgICBjYWNoZUhpdDogZGF0YS51c2FnZS5wcm9tcHRfY2FjaGVfaGl0X3Rva2VucyxcbiAgICAgICAgICAgICAgICBjYWNoZU1pc3M6IGRhdGEudXNhZ2UucHJvbXB0X2NhY2hlX21pc3NfdG9rZW5zLFxuICAgICAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBjaGF0U3RyZWFtKFxuICAgICAgICBtZXNzYWdlczogeyByb2xlOiBzdHJpbmc7IGNvbnRlbnQ6IHN0cmluZyB8IG51bGwgfVtdLFxuICAgICAgICBjYWxsYmFja3M6IFN0cmVhbUNhbGxiYWNrcyxcbiAgICAgICAgbW9kZWxPdmVycmlkZT86IHN0cmluZyxcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLnNldHRpbmdzLnByb3ZpZGVycy5maW5kKChwOiBBSVByb3ZpZGVyKSA9PiBwLmlkID09PSB0aGlzLnNldHRpbmdzLmRlZmF1bHRQcm92aWRlcik7XG4gICAgICAgIGlmICghcHJvdmlkZXIpIHRocm93IG5ldyBFcnJvcignXHU2NzJBXHU2MjdFXHU1MjMwXHU1M0VGXHU3NTI4XHU3Njg0IEFJIFx1NjcwRFx1NTJBMVx1NTU0Nlx1OTE0RFx1N0Y2RScpO1xuXG4gICAgICAgIGNvbnN0IGFwaUtleSA9IHJlc29sdmVBcGlLZXkocHJvdmlkZXIuYXBpS2V5KTtcbiAgICAgICAgaWYgKCFhcGlLZXkpIHRocm93IG5ldyBFcnJvcihgQVBJIEtleSBcdTY3MkFcdTkxNERcdTdGNkVcdUZGMDhcdTY3MERcdTUyQTFcdTU1NDZcdUZGMUEke3Byb3ZpZGVyLm5hbWV9XHVGRjA5YCk7XG5cbiAgICAgICAgY29uc3QgdXJsID0gYCR7cHJvdmlkZXIuYmFzZVVybC5yZXBsYWNlKC9cXC8kLywgJycpfS9jaGF0L2NvbXBsZXRpb25zYDtcbiAgICAgICAgbGV0IG1vZGVsID0gbW9kZWxPdmVycmlkZSB8fCB0aGlzLnNldHRpbmdzLmRlZmF1bHRNb2RlbDtcbiAgICAgICAgaWYgKG1vZGVsID09PSAnYXV0bycpIHtcbiAgICAgICAgICAgIG1vZGVsID0gcHJvdmlkZXIubW9kZWxzWzBdIHx8ICdkZWZhdWx0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJvZHk6IENoYXRDb21wbGV0aW9uUmVxdWVzdCA9IHtcbiAgICAgICAgICAgIG1vZGVsLFxuICAgICAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzIGFzIGFueSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiB0aGlzLnNldHRpbmdzLnRlbXBlcmF0dXJlLFxuICAgICAgICAgICAgdG9wX3A6IHRoaXMuc2V0dGluZ3MudG9wUCxcbiAgICAgICAgICAgIG1heF90b2tlbnM6IHRoaXMuc2V0dGluZ3MubWF4VG9rZW5zLFxuICAgICAgICAgICAgc3RyZWFtOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2hXaXRoUmV0cnkodXJsLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHthcGlLZXl9YCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IHNhZmVKU09OU3RyaW5naWZ5KGJvZHkpLFxuICAgICAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCkuY2F0Y2goKCkgPT4gJ1x1NjcyQVx1NzdFNVx1OTUxOVx1OEJFRicpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vbkVycm9yKG5ldyBFcnJvcihgQVBJIFx1OEJGN1x1NkM0Mlx1NTkzMVx1OEQyNSAoJHtyZXNwb25zZS5zdGF0dXN9KTogJHtlcnJvclRleHR9YCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gcmVzcG9uc2UuYm9keT8uZ2V0UmVhZGVyKCk7XG4gICAgICAgICAgICBpZiAoIXJlYWRlcikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vbkVycm9yKG5ldyBFcnJvcignXHU2NUUwXHU2Q0Q1XHU4M0I3XHU1M0Q2XHU1NENEXHU1RTk0XHU2RDQxJykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuICAgICAgICAgICAgbGV0IGZ1bGxDb250ZW50ID0gJyc7XG4gICAgICAgICAgICBsZXQgbGluZUJ1ZmZlciA9ICcnO1xuICAgICAgICAgICAgbGV0IHVzYWdlOiB7IHByb21wdDogbnVtYmVyOyBjb21wbGV0aW9uOiBudW1iZXI7IHRvdGFsOiBudW1iZXI7IGNhY2hlSGl0PzogbnVtYmVyOyBjYWNoZU1pc3M/OiBudW1iZXIgfSB8IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCByZWFkZXIucmVhZCgpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSBicmVhaztcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBkZWNvZGVyLmRlY29kZSh2YWx1ZSwgeyBzdHJlYW06IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgbGluZUJ1ZmZlciArPSB0ZXh0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gbGluZUJ1ZmZlci5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgbGluZUJ1ZmZlciA9IGxpbmVzLnBvcCgpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbGluZS5zdGFydHNXaXRoKCdkYXRhOiAnKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBsaW5lLnNsaWNlKDYpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09ICdbRE9ORV0nKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2h1bms6IENoYXRDb21wbGV0aW9uQ2h1bmsgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2h1bmsudXNhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0OiBjaHVuay51c2FnZS5wcm9tcHRfdG9rZW5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uOiBjaHVuay51c2FnZS5jb21wbGV0aW9uX3Rva2VucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IGNodW5rLnVzYWdlLnRvdGFsX3Rva2VucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVIaXQ6IGNodW5rLnVzYWdlLnByb21wdF9jYWNoZV9oaXRfdG9rZW5zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZU1pc3M6IGNodW5rLnVzYWdlLnByb21wdF9jYWNoZV9taXNzX3Rva2VucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNob2ljZSBvZiBjaHVuay5jaG9pY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBjaG9pY2UuZGVsdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlbHRhLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsbENvbnRlbnQgKz0gZGVsdGEuY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLm9uVG9rZW4oZGVsdGEuY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNraXAgbWFsZm9ybWVkIGNodW5rc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWxsYmFja3Mub25Db21wbGV0ZShmdWxsQ29udGVudCwgdXNhZ2UpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5vbkVycm9yKG5ldyBFcnJvcignXHU4QkY3XHU2QzQyXHU1REYyXHU1M0Q2XHU2RDg4JykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja3Mub25FcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwgImV4cG9ydCBpbnRlcmZhY2UgVXNhZ2VTdGF0cyB7XG4gICAgdG90YWxQcm9tcHRUb2tlbnM6IG51bWJlcjtcbiAgICB0b3RhbENvbXBsZXRpb25Ub2tlbnM6IG51bWJlcjtcbiAgICB0b3RhbFRva2VuczogbnVtYmVyO1xuICAgIGNhY2hlSGl0VG9rZW5zOiBudW1iZXI7XG4gICAgY2FjaGVNaXNzVG9rZW5zOiBudW1iZXI7XG4gICAgZXN0aW1hdGVkQ29zdFVTRDogbnVtYmVyO1xuICAgIGFwaUNhbGxzOiBudW1iZXI7XG59XG5cbi8vIERlZXBTZWVrIFY0IHByaWNpbmcgcGVyIG1pbGxpb24gdG9rZW5zIChVU0QpXG5jb25zdCBQUklDSU5HOiBSZWNvcmQ8c3RyaW5nLCB7IGlucHV0OiBudW1iZXI7IG91dHB1dDogbnVtYmVyOyBjYWNoZUhpdDogbnVtYmVyIH0+ID0ge1xuICAgICdkZWVwc2Vlay12NC1wcm8nOiB7IGlucHV0OiAwLjI4LCBvdXRwdXQ6IDEuNjgsIGNhY2hlSGl0OiAwLjA3IH0sXG4gICAgJ2RlZXBzZWVrLXY0LWZsYXNoJzogeyBpbnB1dDogMC4xNCwgb3V0cHV0OiAwLjg0LCBjYWNoZUhpdDogMC4wMzUgfSxcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJJQ0lORyA9IHsgaW5wdXQ6IDAuMjgsIG91dHB1dDogMS42OCwgY2FjaGVIaXQ6IDAuMDcgfTtcblxuZXhwb3J0IGNsYXNzIFVzYWdlVHJhY2tlciB7XG4gICAgcHJpdmF0ZSBzdGF0czogVXNhZ2VTdGF0cyA9IHtcbiAgICAgICAgdG90YWxQcm9tcHRUb2tlbnM6IDAsXG4gICAgICAgIHRvdGFsQ29tcGxldGlvblRva2VuczogMCxcbiAgICAgICAgdG90YWxUb2tlbnM6IDAsXG4gICAgICAgIGNhY2hlSGl0VG9rZW5zOiAwLFxuICAgICAgICBjYWNoZU1pc3NUb2tlbnM6IDAsXG4gICAgICAgIGVzdGltYXRlZENvc3RVU0Q6IDAsXG4gICAgICAgIGFwaUNhbGxzOiAwLFxuICAgIH07XG5cbiAgICBwcml2YXRlIGN1cnJlbnRNb2RlbCA9ICdkZWVwc2Vlay12NC1wcm8nO1xuXG4gICAgc2V0TW9kZWwobW9kZWw6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRNb2RlbCA9IG1vZGVsO1xuICAgIH1cblxuICAgIGFkZFVzYWdlKFxuICAgICAgICBwcm9tcHRUb2tlbnM6IG51bWJlcixcbiAgICAgICAgY29tcGxldGlvblRva2VuczogbnVtYmVyLFxuICAgICAgICBjYWNoZUhpdFRva2Vucz86IG51bWJlcixcbiAgICAgICAgY2FjaGVNaXNzVG9rZW5zPzogbnVtYmVyLFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXRzLnRvdGFsUHJvbXB0VG9rZW5zICs9IHByb21wdFRva2VucztcbiAgICAgICAgdGhpcy5zdGF0cy50b3RhbENvbXBsZXRpb25Ub2tlbnMgKz0gY29tcGxldGlvblRva2VucztcbiAgICAgICAgdGhpcy5zdGF0cy50b3RhbFRva2VucyArPSBwcm9tcHRUb2tlbnMgKyBjb21wbGV0aW9uVG9rZW5zO1xuICAgICAgICB0aGlzLnN0YXRzLmNhY2hlSGl0VG9rZW5zICs9IGNhY2hlSGl0VG9rZW5zIHx8IDA7XG4gICAgICAgIHRoaXMuc3RhdHMuY2FjaGVNaXNzVG9rZW5zICs9IGNhY2hlTWlzc1Rva2VucyB8fCAwO1xuICAgICAgICB0aGlzLnN0YXRzLmFwaUNhbGxzKys7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNvc3RcbiAgICAgICAgY29uc3QgcHJpY2luZyA9IFBSSUNJTkdbdGhpcy5jdXJyZW50TW9kZWxdIHx8IERFRkFVTFRfUFJJQ0lORztcbiAgICAgICAgY29uc3QgaW5wdXRDb3N0ID0gKHByb21wdFRva2VucyAvIDFfMDAwXzAwMCkgKiBwcmljaW5nLmlucHV0O1xuICAgICAgICBjb25zdCBvdXRwdXRDb3N0ID0gKGNvbXBsZXRpb25Ub2tlbnMgLyAxXzAwMF8wMDApICogcHJpY2luZy5vdXRwdXQ7XG5cbiAgICAgICAgLy8gQ2FjaGUgaGl0cyBhcmUgY2hlYXBlclxuICAgICAgICBpZiAoY2FjaGVIaXRUb2tlbnMgJiYgcHJpY2luZy5jYWNoZUhpdCkge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVIaXRDb3N0ID0gKGNhY2hlSGl0VG9rZW5zIC8gMV8wMDBfMDAwKSAqIHByaWNpbmcuY2FjaGVIaXQ7XG4gICAgICAgICAgICBjb25zdCBjYWNoZU1pc3NDb3N0ID0gKChwcm9tcHRUb2tlbnMgLSBjYWNoZUhpdFRva2VucykgLyAxXzAwMF8wMDApICogcHJpY2luZy5pbnB1dDtcbiAgICAgICAgICAgIHRoaXMuc3RhdHMuZXN0aW1hdGVkQ29zdFVTRCArPSBjYWNoZUhpdENvc3QgKyBjYWNoZU1pc3NDb3N0ICsgb3V0cHV0Q29zdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHMuZXN0aW1hdGVkQ29zdFVTRCArPSBpbnB1dENvc3QgKyBvdXRwdXRDb3N0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U3RhdHMoKTogVXNhZ2VTdGF0cyB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuc3RhdHMgfTtcbiAgICB9XG5cbiAgICBnZXRDYWNoZUhpdFJhdGUoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdG90YWwgPSB0aGlzLnN0YXRzLmNhY2hlSGl0VG9rZW5zICsgdGhpcy5zdGF0cy5jYWNoZU1pc3NUb2tlbnM7XG4gICAgICAgIGlmICh0b3RhbCA9PT0gMCkgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRzLmNhY2hlSGl0VG9rZW5zIC8gdG90YWw7XG4gICAgfVxuXG4gICAgZ2V0U3VtbWFyeSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBzID0gdGhpcy5zdGF0cztcbiAgICAgICAgY29uc3QgY2FjaGVSYXRlID0gdGhpcy5nZXRDYWNoZUhpdFJhdGUoKTtcbiAgICAgICAgY29uc3QgY29zdFN0ciA9IHMuZXN0aW1hdGVkQ29zdFVTRCA8IDAuMDFcbiAgICAgICAgICAgID8gJzwgJDAuMDEnXG4gICAgICAgICAgICA6IGAkJHtzLmVzdGltYXRlZENvc3RVU0QudG9GaXhlZCgzKX1gO1xuXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gYCR7dGhpcy5mb3JtYXRUb2tlbnMocy50b3RhbFRva2Vucyl9IHRva2Vuc2A7XG4gICAgICAgIGlmIChzLmFwaUNhbGxzID4gMSkge1xuICAgICAgICAgICAgc3VtbWFyeSArPSBgIFx1MDBCNyAke3MuYXBpQ2FsbHN9IFx1NkIyMVx1OEMwM1x1NzUyOGA7XG4gICAgICAgIH1cbiAgICAgICAgc3VtbWFyeSArPSBgIFx1MDBCNyBcdThEMzlcdTc1MjggJHtjb3N0U3RyfWA7XG4gICAgICAgIGlmIChjYWNoZVJhdGUgPiAwKSB7XG4gICAgICAgICAgICBzdW1tYXJ5ICs9IGAgXHUwMEI3IFx1N0YxM1x1NUI1OFx1NTQ3RFx1NEUyRCAkeyhjYWNoZVJhdGUgKiAxMDApLnRvRml4ZWQoMCl9JWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bW1hcnk7XG4gICAgfVxuXG4gICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICAgICAgICB0b3RhbFByb21wdFRva2VuczogMCxcbiAgICAgICAgICAgIHRvdGFsQ29tcGxldGlvblRva2VuczogMCxcbiAgICAgICAgICAgIHRvdGFsVG9rZW5zOiAwLFxuICAgICAgICAgICAgY2FjaGVIaXRUb2tlbnM6IDAsXG4gICAgICAgICAgICBjYWNoZU1pc3NUb2tlbnM6IDAsXG4gICAgICAgICAgICBlc3RpbWF0ZWRDb3N0VVNEOiAwLFxuICAgICAgICAgICAgYXBpQ2FsbHM6IDAsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JtYXRUb2tlbnMobjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG4gPj0gMV8wMDBfMDAwKSByZXR1cm4gYCR7KG4gLyAxXzAwMF8wMDApLnRvRml4ZWQoMSl9TWA7XG4gICAgICAgIGlmIChuID49IDFfMDAwKSByZXR1cm4gYCR7KG4gLyAxXzAwMCkudG9GaXhlZCgxKX1LYDtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhuKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgU2Vzc2lvbiwgTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFZhdWx0LCBURmlsZSwgbm9ybWFsaXplUGF0aCB9IGZyb20gJ29ic2lkaWFuJztcblxuY29uc3QgU0VTU0lPTl9ESVIgPSAnLm9ic2lkaWFuL2FpLWFnZW50LXNlc3Npb25zJztcblxuZXhwb3J0IGNsYXNzIFNlc3Npb25NYW5hZ2VyIHtcbiAgICBwcml2YXRlIHZhdWx0OiBWYXVsdDtcbiAgICBwcml2YXRlIHNlc3Npb25zOiBTZXNzaW9uW10gPSBbXTtcbiAgICBwcml2YXRlIGFjdGl2ZVNlc3Npb25JZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHZhdWx0OiBWYXVsdCkge1xuICAgICAgICB0aGlzLnZhdWx0ID0gdmF1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNlc3Npb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAodGhpcy5sb2FkZWQpIHJldHVybjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gdGhpcy52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgobm9ybWFsaXplUGF0aChTRVNTSU9OX0RJUikpO1xuICAgICAgICAgICAgaWYgKCFkaXIpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZhdWx0LmNyZWF0ZUZvbGRlcihub3JtYWxpemVQYXRoKFNFU1NJT05fRElSKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLnZhdWx0LmdldEZpbGVzKCkuZmlsdGVyKGYgPT5cbiAgICAgICAgICAgICAgICBmLnBhdGguc3RhcnRzV2l0aChTRVNTSU9OX0RJUikgJiYgZi5leHRlbnNpb24gPT09ICdqc29uJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5zZXNzaW9ucyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IEpTT04ucGFyc2UoY29udGVudCkgYXMgU2Vzc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9ucy5wdXNoKHNlc3Npb24pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICAvLyBTa2lwIGNvcnJ1cHRlZCBmaWxlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXNzaW9ucy5zb3J0KChhLCBiKSA9PiBiLnVwZGF0ZWRBdCAtIGEudXBkYXRlZEF0KTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBzZXNzaW9uczonLCBlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2Vzc2lvbnMoKTogU2Vzc2lvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbnM7XG4gICAgfVxuXG4gICAgZ2V0QWN0aXZlU2Vzc2lvbigpOiBTZXNzaW9uIHwgbnVsbCB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVTZXNzaW9uSWQpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gdGhpcy5hY3RpdmVTZXNzaW9uSWQpIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QWN0aXZlU2Vzc2lvbklkKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVTZXNzaW9uSWQ7XG4gICAgfVxuXG4gICAgY3JlYXRlU2Vzc2lvbih0aXRsZT86IHN0cmluZyk6IFNlc3Npb24ge1xuICAgICAgICBjb25zdCBzZXNzaW9uOiBTZXNzaW9uID0ge1xuICAgICAgICAgICAgaWQ6IGBzZXNzaW9uLSR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlIHx8IGBcdTRGMUFcdThCREQgJHt0aGlzLnNlc3Npb25zLmxlbmd0aCArIDF9YCxcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbXSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNlc3Npb25zLnVuc2hpZnQoc2Vzc2lvbik7XG4gICAgICAgIHRoaXMuYWN0aXZlU2Vzc2lvbklkID0gc2Vzc2lvbi5pZDtcbiAgICAgICAgdGhpcy5zYXZlU2Vzc2lvbihzZXNzaW9uKTtcblxuICAgICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9XG5cbiAgICBzd2l0Y2hTZXNzaW9uKHNlc3Npb25JZDogc3RyaW5nKTogU2Vzc2lvbiB8IG51bGwge1xuICAgICAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5zZXNzaW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gc2Vzc2lvbklkKTtcbiAgICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXNzaW9uIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZGVsZXRlU2Vzc2lvbihzZXNzaW9uSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2Vzc2lvbnMuZmluZEluZGV4KHMgPT4gcy5pZCA9PT0gc2Vzc2lvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuc2Vzc2lvbnMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICBjb25zdCBwYXRoID0gbm9ybWFsaXplUGF0aChgJHtTRVNTSU9OX0RJUn0vJHtzZXNzaW9uSWR9Lmpzb25gKTtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICB0aGlzLnZhdWx0LmRlbGV0ZShmaWxlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVTZXNzaW9uSWQgPT09IHNlc3Npb25JZCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVTZXNzaW9uSWQgPSB0aGlzLnNlc3Npb25zWzBdPy5pZCB8fCBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuYW1lU2Vzc2lvbihzZXNzaW9uSWQ6IHN0cmluZywgbmV3VGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5zZXNzaW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gc2Vzc2lvbklkKTtcbiAgICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgICAgIHNlc3Npb24udGl0bGUgPSBuZXdUaXRsZTtcbiAgICAgICAgICAgIHNlc3Npb24udXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVNlc3Npb24oc2Vzc2lvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRNZXNzYWdlKHNlc3Npb25JZDogc3RyaW5nLCBtZXNzYWdlOiBNZXNzYWdlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSB0aGlzLnNlc3Npb25zLmZpbmQocyA9PiBzLmlkID09PSBzZXNzaW9uSWQpO1xuICAgICAgICBpZiAoc2Vzc2lvbikge1xuICAgICAgICAgICAgc2Vzc2lvbi5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICAgICAgc2Vzc2lvbi51cGRhdGVkQXQgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbi50aXRsZS5zdGFydHNXaXRoKCdcdTRGMUFcdThCREQgJykgJiYgbWVzc2FnZS5yb2xlID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gbWVzc2FnZS5jb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLnRpdGxlID0gY29udGVudC5sZW5ndGggPiAzMCA/IGNvbnRlbnQuc2xpY2UoMCwgMzApICsgJy4uLicgOiBjb250ZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmVTZXNzaW9uKHNlc3Npb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJNZXNzYWdlcyhzZXNzaW9uSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5zZXNzaW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gc2Vzc2lvbklkKTtcbiAgICAgICAgaWYgKHNlc3Npb24pIHtcbiAgICAgICAgICAgIHNlc3Npb24ubWVzc2FnZXMgPSBbXTtcbiAgICAgICAgICAgIHNlc3Npb24udXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVNlc3Npb24oc2Vzc2lvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNZXNzYWdlcyhzZXNzaW9uSWQ6IHN0cmluZyk6IE1lc3NhZ2VbXSB7XG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSB0aGlzLnNlc3Npb25zLmZpbmQocyA9PiBzLmlkID09PSBzZXNzaW9uSWQpO1xuICAgICAgICByZXR1cm4gc2Vzc2lvbj8ubWVzc2FnZXMgfHwgW107XG4gICAgfVxuXG4gICAgYXN5bmMgZXhwb3J0U2Vzc2lvbihzZXNzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSB0aGlzLnNlc3Npb25zLmZpbmQocyA9PiBzLmlkID09PSBzZXNzaW9uSWQpO1xuICAgICAgICBpZiAoIXNlc3Npb24pIHJldHVybiAnJztcblxuICAgICAgICBsZXQgbWFya2Rvd24gPSBgIyAke3Nlc3Npb24udGl0bGV9XFxuXFxuYDtcbiAgICAgICAgbWFya2Rvd24gKz0gYD4gXHU1MjFCXHU1RUZBXHU2NUY2XHU5NUY0XHVGRjFBJHtuZXcgRGF0ZShzZXNzaW9uLmNyZWF0ZWRBdCkudG9Mb2NhbGVTdHJpbmcoJ3poLUNOJyl9XFxuYDtcbiAgICAgICAgbWFya2Rvd24gKz0gYD4gXHU2NkY0XHU2NUIwXHU2NUY2XHU5NUY0XHVGRjFBJHtuZXcgRGF0ZShzZXNzaW9uLnVwZGF0ZWRBdCkudG9Mb2NhbGVTdHJpbmcoJ3poLUNOJyl9XFxuXFxuLS0tXFxuXFxuYDtcblxuICAgICAgICBmb3IgKGNvbnN0IG1zZyBvZiBzZXNzaW9uLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG1zZy5yb2xlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndXNlcic6XG4gICAgICAgICAgICAgICAgICAgIG1hcmtkb3duICs9IGAjIyMgXHU3NTI4XHU2MjM3XFxuXFxuJHttc2cuY29udGVudH1cXG5cXG5gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhc3Npc3RhbnQnOlxuICAgICAgICAgICAgICAgICAgICBtYXJrZG93biArPSBgIyMjIEFJXFxuXFxuJHttc2cuY29udGVudH1cXG5cXG5gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXJrZG93bjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNhdmVTZXNzaW9uKHNlc3Npb246IFNlc3Npb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IG5vcm1hbGl6ZVBhdGgoYCR7U0VTU0lPTl9ESVJ9LyR7c2Vzc2lvbi5pZH0uanNvbmApO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoc2Vzc2lvbiwgbnVsbCwgMik7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZhdWx0Lm1vZGlmeShmaWxlLCBjb250ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy52YXVsdC5jcmVhdGUocGF0aCwgY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHNhdmUgc2Vzc2lvbjonLCBlcnIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBQXNDOzs7QUNJdEMsSUFBTSxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZcEIsSUFBTSxlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFlckIsSUFBTSxnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFpQnRCLElBQU0sZUFBZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0JyQixJQUFNLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FB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RUFFQSxjQUFjLFdBQXlCO0FBQ25DLFNBQUssZUFBZSxjQUFjLFNBQVM7QUFBQSxFQUMvQztBQUFBLEVBRUEsTUFBTSxlQUE4QjtBQUNoQyxVQUFNLEVBQUUsVUFBVSxJQUFJLEtBQUs7QUFFM0IsVUFBTSxXQUFXLFVBQVUsZ0JBQWdCLGlCQUFpQjtBQUM1RCxRQUFJLFNBQVMsU0FBUyxHQUFHO0FBQ3JCLGdCQUFVLFdBQVcsU0FBUyxDQUFDLENBQUM7QUFDaEM7QUFBQSxJQUNKO0FBRUEsVUFBTSxPQUFPLFVBQVUsYUFBYSxLQUFLO0FBQ3pDLFFBQUksTUFBTTtBQUNOLFlBQU0sS0FBSyxhQUFhO0FBQUEsUUFDcEIsTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLE1BQ1osQ0FBQztBQUNELGdCQUFVLFdBQVcsSUFBSTtBQUFBLElBQzdCO0FBQUEsRUFDSjtBQUNKOyIsCiAgIm5hbWVzIjogWyJpbXBvcnRfb2JzaWRpYW4iLCAicmVzb2x2ZWQiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
