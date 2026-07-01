# FinPilot AI 启动指南

## 快速启动

### 方式一：双击启动（推荐）

克隆项目后，双击根目录下的 `start.bat` 即可自动完成所有准备工作。

```bash
git clone https://github.com/19823801199/FinPilot-AI.git
cd FinPilot-AI
# 双击 start.bat
```

脚本会自动：检测 Node.js 和 Python 环境、创建虚拟环境、安装依赖、检查端口、启动前后端服务、打开浏览器。

### 方式二：PowerShell 启动

PowerShell 版本支持彩色输出和更多参数：

```powershell
# 基本启动
.\start.ps1

# 跳过依赖安装（已安装过时使用）
.\start.ps1 -SkipInstall

# 自定义端口
.\start.ps1 -Port 3001 -ApiPort 8001
```

### 方式三：Docker 启动

```bash
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY
docker-compose up --build
```

---

## 前置要求

| 工具 | 最低版本 | 用途 | 下载 |
|------|---------|------|------|
| Node.js | >= 20 | 前端运行时 | https://nodejs.org/ |
| Python | >= 3.12 | 后端运行时 | https://www.python.org/downloads/ |
| npm | 随 Node.js 安装 | 前端包管理 | - |
| pip | 随 Python 安装 | 后端包管理 | - |
| DeepSeek API Key | - | AI 功能（可选） | https://platform.deepseek.com/ |

> 没有 DeepSeek API Key 也能启动，AI 功能会使用内置 Mock 数据。配置 Key 后可获得真实的 AI 对话、股票分析和 RAG 问答能力。

---

## 启动流程说明

一键启动脚本按以下顺序执行：

1. **环境检测** — 检查 Node.js、Python、npm、pip 是否已安装，版本是否满足要求
2. **配置检查** — 如果 `.env` 不存在，自动从 `.env.example` 复制一份
3. **后端环境** — 创建 Python 虚拟环境（如不存在），安装 `requirements.txt` 中的依赖
4. **前端环境** — 如果 `node_modules` 不存在，执行 `npm install`
5. **端口检查** — 检测 3000 和 8000 端口是否被占用，自动终止旧进程
6. **启动后端** — 在新窗口中启动 FastAPI 服务（端口 8000，热重载）
7. **启动前端** — 在新窗口中启动 Next.js 开发服务器（端口 3000）
8. **打开浏览器** — 自动访问 http://localhost:3000

---

## 服务地址

启动成功后可访问以下地址：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:3000 | FinPilot AI 工作台 |
| 后端 API | http://localhost:8000/api/v1 | RESTful API |
| API 文档 | http://localhost:8000/docs | Swagger 交互式文档 |
| API 文档 | http://localhost:8000/redoc | ReDoc 格式文档 |

---

## 如何停止服务

### 正常关闭

直接关闭启动脚本弹出的两个命令行窗口即可。前端和后端分别运行在独立的窗口中。

### 命令行关闭

```powershell
# 查找并终止 Node.js 进程（前端）
taskkill /F /IM node.exe

# 查找并终止 Python uvicorn 进程（后端）
taskkill /F /FI "WINDOWTITLE eq FinPilot API*"
```

### 按 PID 关闭

```powershell
# 查看占用端口的进程
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# 终止指定 PID
taskkill /F /PID <进程ID>
```

---

## 如何重新启动

如果需要重启服务：

1. 先关闭已有的两个服务窗口（或运行上面的 taskkill 命令）
2. 再次双击 `start.bat` 或运行 `.\start.ps1`
3. 脚本会自动检测已安装的依赖，跳过安装步骤，直接启动服务

---

## 常见问题

### 端口被占用

**症状**：启动时提示端口 3000 或 8000 被占用。

**解决**：脚本会自动尝试终止占用端口的进程。如果自动处理失败：

```powershell
# 手动查看并终止
netstat -ano | findstr :3000
taskkill /F /PID <进程ID>
```

或者使用自定义端口启动：

```powershell
.\start.ps1 -Port 3001 -ApiPort 8001
```

### npm install 失败

**症状**：前端依赖安装时报错。

**解决**：

```bash
# 清除 npm 缓存
cd apps\web
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

如果网络问题导致下载慢，可切换国内镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

### Python 虚拟环境问题

**症状**：后端启动时报 `No module named` 错误。

**解决**：

```powershell
# 删除旧虚拟环境并重新创建
cd apps\api
Remove-Item -Recurse -Force venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 启动后页面空白

**症状**：浏览器打开后页面为空白或报错。

**解决**：

1. 确认后端服务是否正常运行（访问 http://localhost:8000/api/v1/health）
2. 检查前端终端是否有编译错误
3. 清除浏览器缓存后刷新

### AI 功能不工作

**症状**：对话、股票分析、RAG 问答返回 Mock 数据。

**原因**：未配置 DeepSeek API Key。

**解决**：

1. 编辑项目根目录的 `.env` 文件
2. 将 `DEEPSEEK_API_KEY=your-deepseek-api-key-here` 替换为你的真实 Key
3. 重启后端服务

---

## 功能可用性说明

| 功能 | 无需 API Key | 需要 API Key |
|------|:----------:|:----------:|
| 页面浏览和 UI 交互 | 可用 | - |
| 学习中心（课程/练习/错题本） | 可用 | - |
| 股票搜索和 K 线图 | 可用（AKShare 真实数据） | - |
| Multi-Agent 调度演示 | 可用（Mock 结果） | - |
| SSE 流式 AI 对话 | - | 可用 |
| AI 股票分析报告 | - | 可用 |
| RAG 知识库问答 | - | 可用（需 ChromaDB） |
