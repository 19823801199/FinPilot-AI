# FinPilot AI - 部署文档

## 环境要求

- Node.js >= 18
- Python >= 3.10
- npm >= 9

## 1. 本地开发部署

### 1.1 克隆项目

```bash
git clone <repository-url>
cd FinPilot
```

### 1.2 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY 等配置
```

### 1.3 启动后端

```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

后端运行在 http://localhost:8000

### 1.4 启动前端

```bash
cd apps/web
npm install
npm run dev
```

前端运行在 http://localhost:3000

## 2. 生产部署

### 2.1 构建前端

```bash
cd apps/web
npm install
npm run build
npm run start
```

### 2.2 启动后端（生产模式）

```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 3. Docker 部署

```bash
docker-compose up --build
```

访问 http://localhost:3000

## 4. 云平台部署

### Railway

1. 连接 GitHub 仓库
2. 设置环境变量
3. 自动部署

### Vercel

1. 导入 GitHub 仓库
2. 设置构建命令：`cd apps/web && npm run build`
3. 设置输出目录：`apps/web/.next`
