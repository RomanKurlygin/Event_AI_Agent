# Start OpenClaw gateway (keep this window open)
$NodeDir = "C:\Program Files\nodejs"
if (-not (Test-Path "$NodeDir\npx.cmd")) {
    Write-Host "Node.js not found. Install: winget install OpenJS.NodeJS.LTS" -ForegroundColor Red
    exit 1
}

$env:Path = "$NodeDir;" + $env:Path
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Import-DotEnvFile {
    param([string]$Path)
    if (-not (Test-Path $Path)) { return }
    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

Import-DotEnvFile (Join-Path $ProjectRoot ".env")
Import-DotEnvFile (Join-Path $env:USERPROFILE ".openclaw\.env")

Write-Host "Starting gateway on http://127.0.0.1:18789 ..." -ForegroundColor Cyan
Write-Host ""
Write-Host ">>> This terminal is BUSY (gateway). Do not close it." -ForegroundColor Yellow
Write-Host ">>> For Web UI: open a NEW terminal and run:" -ForegroundColor Green
Write-Host "      .\scripts\start-ui.ps1" -ForegroundColor White
Write-Host ">>> Or start both at once: .\scripts\start-eventgenie.ps1" -ForegroundColor Cyan
Write-Host ""
& "$NodeDir\npx.cmd" openclaw gateway run
