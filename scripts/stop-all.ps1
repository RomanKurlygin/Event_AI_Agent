# Stop EventGenie: OpenClaw gateway + Web UI
# Usage: .\scripts\stop-all.ps1

$ErrorActionPreference = "SilentlyContinue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "Stopping EventGenie..." -ForegroundColor Cyan

& npx openclaw gateway stop 2>&1 | Out-Null

foreach ($port in 3080, 3081, 18789, 5173) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object {
            $procId = $_.OwningProcess
            if ($procId) {
                Write-Host "  Stopping port $port (PID $procId)" -ForegroundColor Yellow
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
}

Start-Sleep -Seconds 1

$still = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPort -in 3080, 3081, 18789, 5173 }

if ($still) {
    Write-Host "Some ports still in use. Close remaining terminals manually." -ForegroundColor Red
} else {
    Write-Host "All stopped." -ForegroundColor Green
}
