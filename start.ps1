#Requires -Version 5.1
<#
.SYNOPSIS
    FinPilot AI v1.0.0 一键启动脚本 (PowerShell 版)
.DESCRIPTION
    自动检测环境、安装依赖、启动前后端服务，并在浏览器打开应用。
    支持彩色输出、端口冲突处理、双窗口分别运行前后端。
.EXAMPLE
    .\start.ps1
    .\start.ps1 -SkipInstall
    .\start.ps1 -Port 3001 -ApiPort 8001
#>

param(
    [switch]$SkipInstall,
    [int]$Port = 3000,
    [int]$ApiPort = 8000
)

# ========== 全局配置 ==========
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ApiDir = Join-Path $ProjectRoot "apps\api"
$WebDir = Join-Path $ProjectRoot "apps\web"
$VenvDir = Join-Path $ApiDir "venv"
$BackendUrl = "http://localhost:$ApiPort"
$FrontendUrl = "http://localhost:$Port"

# ========== 颜色配置 ==========
function Write-Step($Step, $Total, $Text) {
    Write-Host "`n[$Step/$Total] " -ForegroundColor Cyan -NoNewline
    Write-Host $Text
}
function Write-Ok($Text) {
    Write-Host "   [OK] " -ForegroundColor Green -NoNewline
    Write-Host $Text
}
function Write-Warn($Text) {
    Write-Host "   [WARN] " -ForegroundColor Yellow -NoNewline
    Write-Host $Text
}
function Write-Err($Text) {
    Write-Host "   [ERROR] " -ForegroundColor Red -NoNewline
    Write-Host $Text
}
function Write-Info($Text) {
    Write-Host "   [INFO] " -ForegroundColor DarkGray -NoNewline
    Write-Host $Text
}

# ========== Banner ==========
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║         FinPilot AI v1.0.0 一键启动             ║" -ForegroundColor Cyan
Write-Host "  ║         AI 金融智能工作台                       ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

# ========== Step 1: 项目目录 ==========
Write-Step 1 8 "项目目录"
Write-Ok $ProjectRoot

# ========== Step 2: 环境检测 ==========
Write-Step 2 8 "环境检测"
$envErrors = @()

# Node.js
$nodeVer = $null
try {
    $nodeVer = & node -v 2>$null
    Write-Ok "Node.js $nodeVer"
    $majorVer = [int]($nodeVer -replace '^v(\d+)\..*', '$1')
    if ($majorVer -lt 20) {
        Write-Warn "Node.js 版本过低，建议 >= 20"
    }
} catch {
    Write-Err "未检测到 Node.js >= 20"
    Write-Info "下载: https://nodejs.org/"
    $envErrors += "Node.js"
}

# Python
$pythonVer = $null
try {
    $pythonVer = & python --version 2>&1
    Write-Ok $pythonVer
    $pyMajor = [int]($pythonVer -replace '^Python (\d+)\..*', '$1')
    if ($pyMajor -lt 3 -or ($pyMajor -eq 3 -and [int]($pythonVer -replace '^Python 3\.(\d+).*', '$1') -lt 12)) {
        Write-Warn "Python 版本过低，建议 >= 3.12"
    }
} catch {
    Write-Err "未检测到 Python >= 3.12"
    Write-Info "下载: https://www.python.org/downloads/"
    $envErrors += "Python"
}

# npm
try {
    $npmVer = & npm -v 2>$null
    Write-Ok "npm $npmVer"
} catch {
    Write-Err "未检测到 npm"
    $envErrors += "npm"
}

# pip
try {
    & pip --version 2>$null | Out-Null
    Write-Ok "pip"
} catch {
    Write-Err "未检测到 pip"
    $envErrors += "pip"
}

# GPU 检测（可选）
try {
    $nvidiaSmi = & nvidia-smi --query-gpu=name --format=csv,noheader 2>$null
    if ($nvidiaSmi) {
        Write-Info "GPU: $($nvidiaSmi.Trim())"
    }
} catch { /* GPU 不是必需的 */ }

if ($envErrors.Count -gt 0) {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "  ║              环境检测失败！                       ║" -ForegroundColor Red
    Write-Host "  ║   缺少依赖: $($envErrors -join ', ')              " -ForegroundColor Red
    Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

# ========== Step 3: 配置检查 ==========
Write-Step 3 8 "配置检查"
$envFile = Join-Path $ProjectRoot ".env"
$envExample = Join-Path $ProjectRoot ".env.example"

if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile -Force
        Write-Ok "已从 .env.example 创建 .env 文件"
        Write-Warn "请编辑 .env 文件，填入你的 DEEPSEEK_API_KEY"
        Write-Info "不填 API Key 也可以启动（AI 功能将使用 Mock 数据）"
    } else {
        Write-Warn "未找到 .env.example，跳过配置"
    }
} else {
    Write-Ok ".env 文件已存在"

    # 检查是否填了 API Key
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match 'DEEPSEEK_API_KEY=your-deepseek-api-key-here') {
        Write-Warn "DEEPSEEK_API_KEY 尚未配置，AI 功能将使用 Mock 数据"
    } else {
        Write-Ok "DEEPSEEK_API_KEY 已配置"
    }
}

# ========== Step 4: 后端环境 ==========
if (-not $SkipInstall) {
    Write-Step 4 8 "后端环境准备"

    if (-not (Test-Path $VenvDir)) {
        Write-Info "正在创建 Python 虚拟环境..."
        & python -m venv $VenvDir
        if ($LASTEXITCODE -ne 0) {
            Write-Err "创建虚拟环境失败"
            Read-Host "按回车键退出"
            exit 1
        }
        Write-Ok "虚拟环境已创建"
    } else {
        Write-Ok "虚拟环境已存在"
    }

    $pipExe = Join-Path $VenvDir "Scripts\pip.exe"
    $reqFile = Join-Path $ApiDir "requirements.txt"
    Write-Info "正在安装后端依赖..."
    & $pipExe install -r $reqFile -q
    if ($LASTEXITCODE -ne 0) {
        Write-Err "后端依赖安装失败，请检查 requirements.txt"
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Ok "后端依赖安装完成"
} else {
    Write-Step 4 8 "后端环境准备"
    Write-Info "跳过（-SkipInstall）"
}

# ========== Step 5: 前端环境 ==========
if (-not $SkipInstall) {
    Write-Step 5 8 "前端环境准备"
    $nodeModules = Join-Path $WebDir "node_modules"

    if (-not (Test-Path $nodeModules)) {
        Write-Info "正在安装前端依赖（首次可能需要几分钟）..."
        Push-Location $WebDir
        & npm install
        Pop-Location
        if ($LASTEXITCODE -ne 0) {
            Write-Err "前端依赖安装失败"
            Read-Host "按回车键退出"
            exit 1
        }
        Write-Ok "前端依赖安装完成"
    } else {
        Write-Ok "前端依赖已安装"
    }
} else {
    Write-Step 5 8 "前端环境准备"
    Write-Info "跳过（-SkipInstall）"
}

# ========== Step 6: 端口检查 ==========
Write-Step 6 8 "端口检查"

function Kill-Port($PortNum) {
    $connections = Get-NetTCPConnection -LocalPort $PortNum -ErrorAction SilentlyContinue |
        Where-Object { $_.State -eq 'Listen' }
    if ($connections) {
        $pids = $connections.OwningProcess | Select-Object -Unique
        foreach ($pid in $pids) {
            $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Warn "端口 $PortNum 被占用（PID: $pid, $($proc.ProcessName)），尝试终止..."
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
            }
        }
    }
}

Kill-Port $ApiPort
Write-Ok "端口 $ApiPort 可用"

Kill-Port $Port
Write-Ok "端口 $Port 可用"

# ========== Step 7: 启动后端 ==========
Write-Step 7 8 "启动后端服务（端口 $ApiPort）"
$activateScript = Join-Path $VenvDir "Scripts\activate.ps1"
$backendCmd = @"
cd '$ApiDir'
& '$activateScript'
python -m uvicorn main:app --host 0.0.0.0 --port $ApiPort --reload
"@

# 在新的 PowerShell 窗口中启动后端
$backendScript = [System.IO.Path]::GetTempFileName() + ".ps1"
$backendCmd | Out-File -FilePath $backendScript -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScript -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Ok "后端已在新窗口启动"

# ========== Step 8: 启动前端 ==========
Write-Step 8 8 "启动前端服务（端口 $Port）"
$frontendCmd = @"
cd '$WebDir'
npm run dev
"@

$frontendScript = [System.IO.Path]::GetTempFileName() + ".ps1"
$frontendCmd | Out-File -FilePath $frontendScript -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $frontendScript -WindowStyle Normal
Start-Sleep -Seconds 5
Write-Ok "前端已在新窗口启动"

# ========== 启动完成 ==========
Start-Sleep -Seconds 2
Start-Process $FrontendUrl

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║              启动完成！                          ║" -ForegroundColor Green
Write-Host "  ║                                                  ║" -ForegroundColor Green
Write-Host "  ║   前端:    $FrontendUrl" -ForegroundColor Green
Write-Host "  ║   后端:    $BackendUrl" -ForegroundColor Green
Write-Host "  ║   API文档: $BackendUrl/docs" -ForegroundColor Green
Write-Host "  ║                                                  ║" -ForegroundColor Green
Write-Host "  ║   关闭服务: 关闭弹出的两个 PowerShell 窗口       ║" -ForegroundColor Green
Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "按回车键关闭此启动窗口..."
Read-Host
