# FinPilot AI -- TRAE AI 创造力大赛 参赛提交指南

---

## 项目名称

**FinPilot AI -- AI 驱动的金融智能平台**

---

## 项目简介

FinPilot AI 是一款面向金融领域的 AI 智能工作台，集 AI 金融学习、AI 股票研究、AI 知识库管理于一体。本项目通过集成先进的 DeepSeek 大语言模型、RAG 检索增强生成技术以及多 Agent 协作系统，为金融从业者、投资者和学习者提供一站式的智能化金融助手。

项目从零开始，基于 Next.js 15 + FastAPI 的现代技术栈，在 TRAE AI 助手的辅助下完成了从工程搭建到功能开发的全部工作。

---

## 技术栈总结

### 前端

| 技术 | 用途 |
|------|------|
| Next.js 15 + React 18 | 前端应用框架 |
| TypeScript 5 | 类型安全 |
| TailwindCSS v4 + Shadcn UI | UI 组件与样式系统 |
| Zustand 5 | 轻量级状态管理 |
| Axios | HTTP 客户端 |
| Recharts | K 线图与数据可视化 |
| Framer Motion | 交互动画 |
| React Hook Form + Zod | 表单验证 |

### 后端

| 技术 | 用途 |
|------|------|
| FastAPI + Python 3.12 | 异步后端框架 |
| SQLAlchemy 2.x | 异步 ORM |
| Alembic | 数据库迁移管理 |
| Pydantic v2 | 数据验证与配置管理 |

### AI 与数据

| 技术 | 用途 |
|------|------|
| DeepSeek API | 大语言模型推理 |
| ChromaDB | 向量数据库（RAG） |
| AKShare | A 股实时行情数据 |

### DevOps

| 技术 | 用途 |
|------|------|
| Docker + Docker Compose | 容器化部署 |
| Railway / Vercel | 云平台部署支持 |

---

## 创新亮点

### 1. AI + 金融垂直场景深度融合

不同于通用的 AI 聊天机器人，FinPilot AI 深耕金融垂直领域，将 AI 能力与金融知识体系、股票分析、投资研究等实际场景深度结合。产品设计围绕"金融学习-股票研究-知识管理"三大核心场景展开，每个场景都有针对性的 AI 能力优化。

### 2. RAG 检索增强生成知识库

通过 ChromaDB 向量数据库实现文档的语义级检索，用户上传的金融文档（研报、财报、政策文件等）经过智能分割和向量化索引后，AI 可以基于知识库内容进行精准问答。这一机制有效缓解了大语言模型在金融专业领域的幻觉问题，提升了回答的准确性和可信度。

### 3. 多 Agent 协作系统

设计了"学习专家、研究专家、知识专家"三个专项 Agent，每个 Agent 承担不同的专业角色。通过任务编排引擎实现多 Agent 协同工作，例如：用户提出跨领域问题时，系统可自动调度相关 Agent 分工处理并汇总结果。这种架构比单一大模型调用更加灵活和专业。

### 4. AI 辅助股票深度研究

集成 AKShare 获取实时股票行情数据，结合 DeepSeek API 的分析推理能力，一键生成结构化的深度研究报告。报告涵盖技术分析、基本面评估、风险提示等维度，为投资者提供有价值的参考信息。

### 5. 系统化金融学习体系

覆盖 431 金融综合考试全部考点，构建了从基础概念到综合应用的完整学习路径。配合智能练习系统（选择题、判断题、简答题）和错题本功能，形成"学-练-测-纠"的闭环学习体验。

### 6. 全栈工程化实践

采用 Monorepo 目录结构管理前后端代码，完善的 Docker 容器化支持，覆盖多种部署方案的部署文档，规范的 Git 提交流程与代码风格。这些工程化实践保证了项目的可维护性和可扩展性。

---

## 提交清单

请确认以下材料已准备完毕：

### 必需材料

- [x] **源代码**: 完整的项目源代码，包含前端 (`apps/web`) 和后端 (`apps/api`)
- [x] **README.md**: 项目介绍、技术栈、快速开始、API 文档
- [x] **项目截图**: 工作台、学习中心、股票研究员、知识库、设置等页面截图
- [x] **系统架构图**: `docs/architecture.svg` -- 展示系统整体架构
- [x] **AI 工作流程图**: `docs/workflow.svg` -- 展示 AI 工作流程

### 推荐材料

- [x] **更新日志**: `CHANGELOG.md` -- 完整的版本变更记录
- [x] **发布说明**: `RELEASE_NOTES_v1.0.0.md` -- 正式版本发布详情
- [x] **部署文档**: `DEPLOY.md` -- 多平台部署指南
- [x] **Docker 配置**: `docker-compose.yml` + Dockerfile -- 容器化部署配置
- [x] **环境变量模板**: `.env.example` -- 配置说明文档
- [x] **项目 Logo**: `docs/logo.jpg` -- 品牌标识
- [x] **OpenGraph 图**: `docs/og-image.jpg` -- 社交分享

### 确认事项

- [ ] 代码仓库已设置为公开或向评委开放访问权限
- [ ] `.env` 和敏感信息未被提交到仓库
- [ ] 所有截图和图片素材完整且清晰
- [ ] 项目可在本地环境正常运行（参考下方"如何运行"）
- [ ] 提交材料格式符合大赛要求

---

## 如何运行

### 方式一：Docker 一键启动（推荐）

```bash
# 确保已安装 Docker 和 Docker Compose
docker-compose up --build
```

访问 http://localhost:3000

### 方式二：手动本地运行

```bash
# 1. 配置环境变量
cp .env.example .env
cp apps/api/.env.example apps/api/.env
# 编辑 .env 文件，填入 DeepSeek API Key 等配置

# 2. 启动后端
cd apps/api
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. 新终端窗口，启动前端
cd apps/web
npm install
npm run dev
```

访问 http://localhost:3000

### 方式三：分别部署

- **前端**: 可部署到 Vercel（参考 DEPLOY.md）
- **后端**: 可部署到 Railway（参考 DEPLOY.md）

---

## 给评委的备注

亲爱的评委老师，感谢您审阅 FinPilot AI 项目。以下是一些额外的说明，希望能帮助您更好地了解项目：

### 关于开发过程

本项目从零开始，在 TRAE AI 助手的辅助下完成了项目搭建、功能开发、文档编写和优化迭代的全过程。TRAE AI 在代码生成、架构设计、问题排查等方面提供了高效的辅助，极大地缩短了开发周期。

### 关于技术复杂性

项目采用了多项现代工程技术：
- **前端**: Next.js 15 App Router、Server Components、Streaming SSR
- **后端**: FastAPI 异步框架、SQLAlchemy 异步 ORM
- **AI**: LLM 集成、RAG 检索增强、多 Agent 协作
- **工程**: Monorepo、Docker 容器化、多环境配置管理

### 关于已知不足

我们诚实地记录了项目的已知问题（详见 RELEASE_NOTES_v1.0.0.md）：

- 部分动态路由（股票详情页、课程详情页）暂不支持直接 URL 访问
- 登录/注册页面的后端 API 对接待完成
- 单元测试和 E2E 测试尚未完全覆盖
- 部分 Python 依赖（chromadb）在 Windows 环境可能安装困难

这些不足不影响核心功能的演示，我们也已规划了后续的版本迭代来解决这些问题。

### 关于环境变量

运行项目需要配置 DeepSeek API Key。如果您在评审过程中需要协助配置或遇到运行问题，请随时联系我们。

---

## 联系信息

| 项目 | 链接 |
|------|------|
| 项目主页 | [待补充] |
| 问题反馈 | [待补充] |
| 演示视频 | [待补充] |

---

> FinPilot AI -- 让金融更智能  
> 专为 TRAE AI 创造力大赛而开发  
> MIT License