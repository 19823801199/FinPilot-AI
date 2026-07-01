# FinPilot AI Launcher

一键启动系统，零门槛运行 FinPilot AI。

## 使用方式

### Windows

双击项目根目录的 `start.bat`，或在终端运行：

```bash
# 基本启动
start.bat

# 跳过依赖安装
start.bat --skip-install

# 自定义端口
start.bat --port 3001 --api-port 8001
```

### Mac / Linux

```bash
chmod +x launcher/start.sh
./launcher/start.sh

# 跳过依赖安装
./launcher/start.sh --skip-install

# 自定义端口
./launcher/start.sh --port 3001 --api-port 8001
```

### 直接用 Python 启动（跨平台）

```bash
python launcher/main.py
python launcher/main.py --verbose
python launcher/main.py --skip-install --port 3001
python launcher/main.py --no-browser
```

## 启动流程

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 环境检测 | Node.js >= 18、Python >= 3.10、npm、pip、git |
| 2 | 配置检查 | 自动从 .env.example 创建 .env，检测 API Key |
| 3 | 端口检查 | 自动终止占用 3000/8000 端口的旧进程 |
| 4 | 后端环境 | 创建 venv、安装 requirements.txt |
| 5 | 前端环境 | npm install（失败自动 fallback --legacy-peer-deps） |
| 6 | 启动后端 | uvicorn（失败自动 fallback python main.py） |
| 7 | 启动前端 | npm run dev（失败自动 fallback npm run start） |
| 8 | 健康检查 | 等待服务就绪，自动打开浏览器 |

## Fallback 机制

| 模块 | 主方案 | Fallback |
|------|--------|----------|
| 启动方式 | Python Launcher | BAT 简化模式 |
| 后端启动 | venv uvicorn | 系统 uvicorn → python main.py → python app.py |
| 前端安装 | npm install | npm install --legacy-peer-deps |
| 前端启动 | npm run dev | npm run start |
| AI 服务 | DeepSeek API | Mock 模式 |
| ChromaDB | PersistentClient | 内存 Fallback |
| requirements.txt | 使用现有文件 | 自动生成基础依赖列表 |

## 目录结构

```
launcher/
├── main.py              # 主入口（跨平台）
├── start.bat            # Windows 启动脚本
├── start.sh             # Mac/Linux 启动脚本
├── core/
│   ├── __init__.py
│   ├── logger.py         # ANSI 彩色日志
│   ├── env_checker.py    # 环境检测（Node/Python/npm/pip/git/GPU）
│   ├── port_manager.py   # 端口检测与冲突处理
│   ├── installer.py      # 依赖安装（venv/pip/npm）
│   ├── process_manager.py # 进程管理（启动/停止/日志流）
│   └── health_checker.py  # 健康检查 & 浏览器打开
├── config/
│   ├── default.env       # 默认环境变量模板
│   └── ports.json        # 端口和超时配置
└── README.md
```

## 日志系统

统一使用带颜色的标签输出：

```
  [INFO] 执行: npm install
  [SUCCESS] 前端依赖安装完成
  [WARN] DEEPSEEK_API_KEY 尚未配置
  [ERROR] 后端依赖安装失败
  [Backend] INFO:     Uvicorn running on http://0.0.0.0:8000
  [Frontend] ▲ Next.js 15.3.2
```

## 命令行参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--port N` | 3000 | 前端端口 |
| `--api-port N` | 8000 | 后端端口 |
| `--skip-install` | false | 跳过依赖安装 |
| `--verbose` | false | 详细日志 |
| `--no-browser` | false | 不自动打开浏览器 |
