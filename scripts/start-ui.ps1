# EventGenie Web UI (Figma React app → OpenClaw)
# Usage: .\scripts\start-ui.ps1
# Requires: .\scripts\start-gateway.ps1 running in another window

$ErrorActionPreference = "Stop"
$NodeDir = "C:\Program Files\nodejs"
if (-not (Test-Path "$NodeDir\node.exe")) {
    Write-Host "Node.js not found. Install: winget install OpenJS.NodeJS.LTS" -ForegroundColor Red
    exit 1
}

$env:Path = "$NodeDir;" + $env:Path
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$FrontendDir = Join-Path $ProjectRoot "web\frontend"
Set-Location $ProjectRoot

$port = if ($env:EVENTGENIE_UI_PORT) { $env:EVENTGENIE_UI_PORT } else { "3080" }

Write-Host "Building EventGenie UI..." -ForegroundColor Cyan
Set-Location $FrontendDir
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    & npm install
}
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}

Set-Location $ProjectRoot

# Stop previous UI server on the same port (old process may miss new API routes)
$existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $existing) {
    if ($procId -and $procId -ne $PID) {
        Write-Host "Stopping previous UI on port $port (PID $procId)..." -ForegroundColor Yellow
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

Write-Host "Starting EventGenie UI on http://127.0.0.1:$port ..." -ForegroundColor Cyan
Write-Host "Gateway must be running: .\scripts\start-gateway.ps1" -ForegroundColor Yellow

Start-Process "http://127.0.0.1:$port"
& "$NodeDir\node.exe" "web\server.mjs"
