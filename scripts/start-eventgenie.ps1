# Start EventGenie: OpenClaw gateway + Web UI
# Usage: .\scripts\start-eventgenie.ps1

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "=== EventGenie ===" -ForegroundColor Cyan
Write-Host "1. Starting OpenClaw gateway (new window)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot'; .\scripts\start-gateway.ps1"

Start-Sleep -Seconds 5

Write-Host "2. Starting Web UI..." -ForegroundColor Green
& "$ProjectRoot\scripts\start-ui.ps1"
