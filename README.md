# LandscapeFlow AI

景观设计全流程 AI 工作台 —— 让设计师回到设计本身。

> WorkBuddy × Tencent EdgeOne AI Prompts × Skills 挑战赛 · Prompts 赛道作品

## 在线访问

[部署完成后请把 EdgeOne Pages URL 写在这里]

## 技术栈

- 静态站点：HTML + CSS + 原生 JavaScript
- 边缘计算：EdgeOne Pages Edge Functions
- 数据存储：EdgeOne KV Storage
- 部署平台：EdgeOne Pages（通过 edgeone-pages-skills 自动部署）

## 核心功能

- 6 步 AI 工作流展示
- 模板库（KV 动态加载）
- AI 在线生成项目说明（Edge Function）
- 三次生产力革命叙事

## 项目结构

```
landscapeflow/
├── index.html                    # 首页（7 个区块）
├── workbench.html                # 工作台页面（6 步 Tab）
├── functions/
│   ├── api/
│   │   ├── brief.js              # Edge Function：AI 生成项目说明
│   │   └── cases.js              # Edge Function：从 KV 读取案例库
│   └── _middleware.js            # 中间件：CORS 与简易访问日志
└── README.md
```

## 一键复现

复制本仓库 PROMPT.md 中的完整 Prompt，粘贴到 WorkBuddy / Claude Code / Cursor 等任一支持 Skills 的 AI 编程工具，即可一键复现整站。
