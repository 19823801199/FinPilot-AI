@echo off
chcp 65001 >nul 2>&1
setlocal

:: ============================================
::  FinPilot AI Launcher v1.0.0 (Windows BAT)
::  Usage: 双击运行 或 start.bat [options]
:: ============================================

cd /d "%~dp0"
cd ..

:: Parse arguments
set SKIP_INSTALL=
set API_PORT=8000
set WEB_PORT=3000

:parse_args
if "%~1"=="" goto done_args
if /I "%~1"=="--skip-install" set SKIP_INSTALL=1
if /I "%~1"=="--skip" set SKIP_INSTALL=1
echo %~1 | findstr /R "^--api-port=[0-9]*$" >nul && set API_PORT=%~1
echo %~1 | findstr /R "^--port=[0-9]*$" >nul && set WEB_PORT=%~1
shift
goto parse_args
:done_args

:: Build arguments for Python launcher
set ARGS=--port %WEB_PORT% --api-port %API_PORT%
if defined SKIP_INSTALL set ARGS=%ARGS% --skip-install

:: Launch Python launcher
python launcher\main.py %ARGS%

if errorlevel 1 (
    echo.
    echo   启动失败。请检查上方错误信息。
    pause
)
