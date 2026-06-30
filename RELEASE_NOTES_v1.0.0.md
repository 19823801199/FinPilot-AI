# FinPilot AI v1.0.0 发布说明

---

**版本标签**: v1.0.0  
**发布日期**: 2026-06-23  
**上一版本**: v0.1.0-RC2  
**项目状态**: 正式发布 (Stable)

---

## 关于 FinPilot AI

FinPilot AI 是一款面向金融领域的 AI 智能工作台，集 AI 金融学习、AI 股票研究、AI 知识库管理于一体。本项目专为 TRAE AI 创造力大赛而开发，致力于为金融从业者、投资者和学习者提供一站式的智能化金融助手。

通过集成先进的 DeepSeek 大语言模型、RAG 检索增强生成技术以及多 Agent 协作系统，FinPilot AI 能够在金融学习辅导、股票深度分析、知识管理等多个场景下提供高效、精准的 AI 辅助服务。

---

## 自 v0.1.0-RC2 以来的新变化

### 主要新增功能

| 模块 | 新增内容 |
|------|----------|
| AI 工作台 | 多轮对话、上下文记忆、流式输出（SSE）、会话管理 |
| 股票研究员 | 股票搜索、实时行情、K 线图、AI 深度研究报告 |
| 知识库 | 文档上传（PDF/Markdown）、ChromaDB 向量检索、RAG 问答 |
| 多 Agent | 学习专家、研究专家、知识专家协同工作、任务编排 |
| 学习中心 | 系统课程体系、智能练习、错题本、学习统计 |
| 交互体验 | 打字机效果、对话控制、文件拖拽上传 |
| Docker | 多阶段构建、Docker Compose 一键部署 |

### 工程改进

- **依赖清理**: 移除未使用的 npm 和 pip 依赖，构建体积缩减约 30%
- **目录优化**: 重构 Monorepo 目录结构，移除冗余文件夹
- **组件复用**: 通用 UI 逻辑抽取，代码复用率显著提升
- **性能优化**: 优化状态管理订阅机制，减少不必要的组件渲染

### 问题修复

- 修复 chat-area 组件中的 XSS 跨站脚本安全漏洞
- 消除重复的 TypeScript 类型定义
- 清理残留的 Mock 数据和孤立目录
- 修复部分 API 路由注册异常
- 修复 Zustand store 状态未正确清理导致的内存泄漏

---

## 核心功能一览

### AI 智能工作台
- 基于 DeepSeek API 的智能对话系统
- 流式输出（SSE），实时呈现 AI 思考过程
- 完整的会话管理：新建、保存、搜索、历史回顾

### AI 股票研究员
- A 股实时数据查询（集成 AKShare）
- 股票 K 线图可视化（Recharts）
- AI 一键生成深度研究报告
- 自选股关注与提醒

### AI 知识库 (RAG)
- 支持 PDF、Markdown 文档上传
- ChromaDB 向量语义检索
- 基于知识库内容的智能问答
- 文档自动分割与索引管理

### 多 Agent 协作
- 学习专家 Agent：个性化学习路径
- 研究专家 Agent：股票深度分析
- 知识专家 Agent：文档智能问答
- 多 Agent 任务编排与协同调度

### 金融学习中心
- 系统化金融课程（覆盖 431 考点）
- 智能练习：选择题、判断题、简答题
- 错题本与学习进度追踪
- 学习统计与分析面板

---

## 快速安装指南

### 环境要求

- Node.js >= 20
- Python >= 3.12
- npm >= 10
- Docker (可选，推荐)

### 安装步骤

```bash
# 1. 配置环境变量
cp .env.example .env

# 2. 启动后端
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. 启动前端
cd apps/web
npm install
npm run dev
```

### Docker 一键部署（推荐）

```bash
docker-compose up --build
```

详细部署指南请参阅 [DEPLOY.md](DEPLOY.md)。

---

## 已知问题

1. **路由 404**: 股票详情页 (`/stocks/600519`) 和学习中心课程详情页 (`/learn/course-1`) 暂不支持直接 URL 访问，需通过搜索页面进入
2. **认证系统**: 登录/注册页面的后端 API 对接尚待完成
3. **依赖安装**: `chromadb` 和 `akshare` 在部分 Windows 环境可能遇到依赖问题，建议使用 Docker 部署
4. **端口冲突**: 前端开发服务器默认端口 3000 被占用时自动切换到 3001
5. **测试覆盖**: 单元测试和 E2E 测试尚未完全覆盖

---

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Next.js 15 + React 18 + TypeScript |
| UI 框架 | TailwindCSS v4 + Shadcn UI |
| 状态管理 | Zustand 5 |
| 后端框架 | FastAPI + Python 3.12 |
| 数据库 | SQLAlchemy 2.x (异步) + SQLite/PostgreSQL |
| 大语言模型 | DeepSeek API |
| 向量数据库 | ChromaDB |
| 股票数据 | AKShare |
| 容器化 | Docker + Docker Compose |

---

## 致谢

感谢 TRAE AI 创造力大赛提供的平台和机会。感谢 DeepSeek、AKShare、ChromaDB 等开源社区的卓越贡献。感谢所有参与测试和提供反馈的早期用户。

---

> **FinPilot AI** -- 让金融更智能  
> 为 TRAE AI 创造力大赛而开发  
> MIT License