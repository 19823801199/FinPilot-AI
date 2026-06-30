---
tag: v1.0.0
title: "FinPilot AI v1.0.0"
---

# FinPilot AI v1.0.0

> AI 驱动的金融智能平台 -- 金融学习、股票研究与知识管理

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Highlights

- **AI 智能工作台** -- 基于 DeepSeek 大语言模型的多轮对话系统，支持流式输出与上下文记忆
- **AI 股票研究员** -- 集成 AKShare 实时数据，AI 一键生成深度研究报告
- **AI 知识库 (RAG)** -- 支持 PDF/Markdown 文档上传，基于 ChromaDB 的检索增强生成问答
- **多 Agent 协作** -- 学习专家、研究专家、知识专家协同工作，智能任务编排
- **金融学习中心** -- 系统化课程体系，覆盖 431 金融综合考点，智能练习与错题本
- **Docker 支持** -- 多阶段构建，Docker Compose 一键部署

---

## What's New

### Features

#### AI 智能工作台
- 多轮 AI 对话，完整的上下文记忆与理解
- SSE 流式输出，打字机效果实时展示回复
- 会话管理系统：创建、历史记录、删除、搜索与标签分组
- Markdown 富文本渲染，支持代码块、表格、数学公式

#### AI 股票研究员
- A 股股票搜索（支持代码与名称模糊匹配）
- 实时行情数据展示，K 线图可视化（Recharts）
- AI 深度研究报告自动生成
- 自选股关注列表与历史分析记录

#### AI 知识库 (RAG)
- PDF、Markdown 文档上传与管理
- ChromaDB 向量数据库集成，语义级检索
- 基于知识库的智能问答
- 文档自动分割与索引构建

#### 多 Agent 协作系统
- 学习专家：个性化学习路径规划与辅导
- 研究专家：股票深度分析报告生成
- 知识专家：文档内容理解与问答
- Agent 任务编排引擎与结果汇总

#### 金融学习中心
- 结构化金融课程体系，覆盖 431 金融综合各考点
- 章节知识点讲解与配套练习
- 智能练习系统：选择题、判断题、简答题
- 错题本集与学习进度追踪
- 学习统计面板：正确率、学习时长、掌握度分析

#### 流式交互体验
- 全双工流式聊天，打字机效果
- 对话中断、重新生成、继续生成等高级控制
- 聊天历史即时保存与恢复
- 文件拖拽上传到聊天区

#### Docker 与部署
- 前端多阶段 Docker 构建（web.Dockerfile）
- 后端多阶段 Docker 构建（api.Dockerfile）
- Docker Compose 一键编排
- Railway、Vercel 云平台部署支持

### Changed

- 版本从 v0.1.0-RC2 升级至 v1.0.0
- 移除未使用的 npm 和 pip 依赖，构建体积缩减约 30%
- 优化 Monorepo 目录结构，统一命名规范
- 重构重复 UI 逻辑为通用组件
- 优化 Zustand store 订阅机制，提升渲染性能

### Fixed

- **安全**: 修复 chat-area 组件的 XSS 跨站脚本漏洞，增加输入消毒与转义处理
- **类型**: 消除重复的 TypeScript 类型定义，统一导入入口
- **清理**: 移除残留 Mock 数据和孤立目录
- **路由**: 修复部分 API 路由未正确注册的问题
- **内存**: 修复 Zustand store 状态未正确清理导致的内存泄漏

---

## Key Features

| 特性 | 描述 |
|------|------|
| AI 对话 | DeepSeek API 驱动，支持流式输出与多轮对话 |
| 股票研究 | AKShare 实时数据，AI 分析报告生成 |
| 知识图谱 | ChromaDB 向量检索，RAG 增强问答 |
| Agent 协作 | 多专家协同，任务编排调度 |
| 学习系统 | 431 金融考点课程，智能练习与统计 |
| Docket 部署 | Docker Compose 一键启动 |

---

## Full Changelog

完整的变更日志请参见 [CHANGELOG.md](CHANGELOG.md)。

### 新增 (v0.1.0-RC2 -> v1.0.0)

- AI 对话工作台（流式输出、会话管理、上下文记忆）
- 股票研究员（搜索、详情、AI 分析、自选股）
- 知识库（文档上传、ChromaDB 向量检索、RAG 问答）
- 多 Agent 协作（学习/研究/知识专家）
- 金融学习中心（课程体系、练习系统、错题本）
- Docker 多阶段构建与 Compose 编排

### 修复

- XSS 安全漏洞修复
- 重复类型定义清理
- 孤立目录与 Mock 数据清理
- API 路由修复
- 内存泄漏修复

---

## Installation

### 环境要求

- Node.js >= 20
- Python >= 3.12
- npm >= 10
- Docker（可选，推荐）

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/your-username/FinPilot.git
cd FinPilot

# 配置环境变量
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# 使用 Docker 一键启动（推荐）
docker-compose up --build
```

### 手动启动

```bash
# 启动后端
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 启动前端（新终端窗口）
cd apps/web
npm install
npm run dev
```

访问 http://localhost:3000 即可使用。

---

## Contributors

FinPilot AI 由 TRAE AI 创造力大赛参赛团队开发。

---

## License

MIT License

---

> Built with TRAE AI for TRAE AI 创造力大赛