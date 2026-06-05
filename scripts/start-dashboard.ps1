# Open EventGenie dashboard (with auto token)
$NodeDir = "C:\Program Files\nodejs"
if (-not (Test-Path "$NodeDir\npx.cmd")) {
    Write-Host "Node.js not found. Install: winget install OpenJS.NodeJS.LTS" -ForegroundColor Red
    Write-Host "Then close and reopen PowerShell." -ForegroundColor Yellow
    exit 1
}

$env:Path = "$NodeDir;" + $env:Path
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "Opening OpenClaw dashboard..." -ForegroundColor Cyan
& "$NodeDir\npx.cmd" openclaw dashboard
