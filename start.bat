@echo off
chcp 65001 >nul 2>&1
setlocal

:: ============================================
::  FinPilot AI v1.0.0 - 一键启动入口
::  Windows: 双击此文件即可
::  Mac/Linux: ./launcher/start.sh
:: ============================================

cd /d "%~dp0"

:: Try Python launcher first (production launcher with health checks)
python launcher\main.py %*

:: If Python launcher fails, fallback to simple BAT launcher
if errorlevel 1 (
    echo.
    echo   [WARN] Python 启动器失败，使用简化模式启动...
    echo.
    timeout /t 2 /nobreak >nul

    :: ========== Simple fallback launcher ==========
    echo   [1/6] 项目目录: %cd%

    :: Check Node.js
    where node >nul 2>&1
    if errorlevel 1 (
        echo   [ERROR] 未检测到 Node.js，请先安装
        echo   下载: https://nodejs.org/
        pause
        exit /b 1
    )
    for /f "tokens=*" %%v in ('node -v') do echo   [OK] Node.js %%v

    :: Check Python
    where python >nul 2>&1
    if errorlevel 1 (
        echo   [ERROR] 未检测到 Python，请先安装
        echo   下载: https://www.python.org/downloads/
        pause
        exit /b 1
    )
    for /f "tokens=*" %%v in ('python --version') do echo   [OK] %%v

    :: Check .env
    echo   [2/6] 配置检查...
    if not exist ".env" (
        if exist ".env.example" (
            copy ".env.example" ".env" >nul 2>&1
            echo   [OK] 已创建 .env（请编辑填入 DEEPSEEK_API_KEY）
        )
    ) else (
        echo   [OK] .env 已存在
    )

    :: Backend venv
    echo   [3/6] 后端环境...
    if not exist "apps\api\venv" (
        python -m venv apps\api\venv
        echo   [OK] 虚拟环境已创建
    )
    apps\api\venv\Scripts\pip.exe install -r apps\api\requirements.txt -q 2>nul
    echo   [OK] 后端依赖就绪

    :: Frontend deps
    echo   [4/6] 前端环境...
    if not exist "apps\web\node_modules" (
        cd apps\web
        call npm install
        cd /d "%~dp0"
    )
    echo   [OK] 前端依赖就绪

    :: Kill port conflicts
    echo   [5/6] 端口检查...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING 2^>nul') do taskkill /PID %%a /F >nul 2>&1
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do taskkill /PID %%a /F >nul 2>&1
    echo   [OK] 端口就绪

    :: Start services
    echo   [6/6] 启动服务...
    start "FinPilot API" cmd /k "cd /d "%~dp0apps\api" && venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
    timeout /t 3 /nobreak >nul
    start "FinPilot Web" cmd /k "cd /d "%~dp0apps\web" && npm run dev"
    timeout /t 5 /nobreak >nul

    start http://localhost:3000

    echo.
    echo   ========================================
    echo     启动完成！
    echo     前端: http://localhost:3000
    echo     后端: http://localhost:8000
    echo     API文档: http://localhost:8000/docs
    echo     关闭: 关闭弹出的窗口
    echo   ========================================
    echo.
    pause
)
