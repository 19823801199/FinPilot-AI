@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

title FinPilot AI v1.0.0 - 一键启动

echo ╔══════════════════════════════════════════════════╗
echo ║         FinPilot AI v1.0.0 一键启动             ║
echo ║         AI 金融智能工作台                       ║
echo ╚══════════════════════════════════════════════════╝
echo.

:: ===== Step 0: 切换到脚本所在目录（项目根目录） =====
cd /d "%~dp0"
echo [1/8] 项目目录: %cd%

:: ===== Step 1: 环境检测 =====
echo.
echo [2/8] 环境检测...

where node >nul 2>&1
if errorlevel 1 (
    echo    [ERROR] 未检测到 Node.js，请先安装 Node.js ^>= 20
    echo    下载地址: https://nodejs.org/
    goto :fail
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo    [OK] Node.js !NODE_VER!

where python >nul 2>&1
if errorlevel 1 (
    echo    [ERROR] 未检测到 Python，请先安装 Python ^>= 3.12
    echo    下载地址: https://www.python.org/downloads/
    goto :fail
)
for /f "tokens=*" %%v in ('python --version') do set PYTHON_VER=%%v
echo    [OK] !PYTHON_VER!

where npm >nul 2>&1
if errorlevel 1 (
    echo    [ERROR] 未检测到 npm
    goto :fail
)
echo    [OK] npm

where pip >nul 2>&1
if errorlevel 1 (
    echo    [ERROR] 未检测到 pip
    goto :fail
)
echo    [OK] pip

:: ===== Step 2: 检查 .env 配置 =====
echo.
echo [3/8] 配置检查...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul 2>&1
        echo    [OK] 已从 .env.example 创建 .env 文件
        echo    [!!] 请编辑 .env 文件，填入你的 DEEPSEEK_API_KEY
        echo        不填 API Key 也可以启动（AI 功能将使用 Mock 数据）
    ) else (
        echo    [WARN] 未找到 .env.example，跳过配置
    )
) else (
    echo    [OK] .env 文件已存在
)

:: ===== Step 3: 后端依赖安装 =====
echo.
echo [4/8] 后端环境准备...

if not exist "apps\api\venv" (
    echo    正在创建 Python 虚拟环境...
    python -m venv apps\api\venv
    if errorlevel 1 (
        echo    [ERROR] 创建虚拟环境失败
        goto :fail
    )
    echo    [OK] 虚拟环境已创建
) else (
    echo    [OK] 虚拟环境已存在
)

echo    正在安装后端依赖...
"apps\api\venv\Scripts\pip.exe" install -r apps\api\requirements.txt -q
if errorlevel 1 (
    echo    [ERROR] 后端依赖安装失败，请检查 requirements.txt
    goto :fail
)
echo    [OK] 后端依赖安装完成

:: ===== Step 4: 前端依赖安装 =====
echo.
echo [5/8] 前端环境准备...

if not exist "apps\web\node_modules" (
    echo    正在安装前端依赖（首次可能需要几分钟）...
    cd apps\web
    call npm install
    cd /d "%~dp0"
    if errorlevel 1 (
        echo    [ERROR] 前端依赖安装失败
        goto :fail
    )
    echo    [OK] 前端依赖安装完成
) else (
    echo    [OK] 前端依赖已安装
)

:: ===== Step 5: 端口检查 =====
echo.
echo [6/8] 端口检查...

:: 检查 8000 端口
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING 2^>nul') do set PID_8000=%%a
if defined PID_8000 (
    echo    [WARN] 端口 8000 被占用（PID: !PID_8000!），尝试终止...
    taskkill /PID !PID_8000! /F >nul 2>&1
    timeout /t 2 /nobreak >nul
    echo    [OK] 已释放端口 8000
) else (
    echo    [OK] 端口 8000 可用
)

:: 检查 3000 端口
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do set PID_3000=%%a
if defined PID_3000 (
    echo    [WARN] 端口 3000 被占用（PID: !PID_3000!），尝试终止...
    taskkill /PID !PID_3000! /F >nul 2>&1
    timeout /t 2 /nobreak >nul
    echo    [OK] 已释放端口 3000
) else (
    echo    [OK] 端口 3000 可用
)

:: ===== Step 6: 启动后端 =====
echo.
echo [7/8] 启动后端服务（端口 8000）...
start "FinPilot API - Backend" cmd /k "cd /d "%~dp0apps\api" && venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul
echo    [OK] 后端已在新窗口启动

:: ===== Step 7: 启动前端 =====
echo.
echo [8/8] 启动前端服务（端口 3000）...
start "FinPilot Web - Frontend" cmd /k "cd /d "%~dp0apps\web" && npm run dev"
timeout /t 5 /nobreak >nul
echo    [OK] 前端已在新窗口启动

:: ===== Step 8: 打开浏览器 =====
echo.
start http://localhost:3000

echo ╔══════════════════════════════════════════════════╗
echo ║              启动完成！                          ║
echo ║                                                  ║
echo ║   前端: http://localhost:3000                     ║
echo ║   后端: http://localhost:8000                     ║
echo ║   API文档: http://localhost:8000/docs             ║
echo ║                                                  ║
echo ║   关闭服务: 直接关闭弹出 的两个命令行窗口          ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo 按任意键关闭此启动窗口...
pause >nul
exit /b 0

:fail
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║              启动失败！                          ║
echo ║   请检查上方错误信息并修复后重试                  ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo 按任意键退出...
pause >nul
exit /b 1
