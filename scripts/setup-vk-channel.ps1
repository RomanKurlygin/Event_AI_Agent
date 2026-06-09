# Setup VK channel for EventGenie (OpenClaw + @openclaw-vk/vk)
# Usage: .\scripts\setup-vk-channel.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Resolve-NodeToolchain {
    $candidates = @(
        "C:\Program Files\nodejs",
        "${env:ProgramFiles(x86)}\nodejs",
        "$env:LOCALAPPDATA\Programs\nodejs"
    )
    foreach ($dir in $candidates) {
        if (Test-Path "$dir\npx.cmd") {
            $env:Path = "$dir;" + $env:Path
            return "$dir\npx.cmd"
        }
    }
    $npx = Get-Command npx -ErrorAction SilentlyContinue
    if ($npx) { return $npx.Source }
    return $null
}

function Read-EnvFile {
    param([string]$Path)
    $vars = @{}
    if (-not (Test-Path $Path)) { return $vars }
    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $vars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
    return $vars
}

function Test-VkToken {
    param([string]$Token)
    if (-not $Token) { return $false }
    if ($Token -match 'your_vk|placeholder|example') { return $false }
    return $Token.Length -ge 20
}

Write-Host "=== EventGenie: VK channel setup ===" -ForegroundColor Cyan

$npx = Resolve-NodeToolchain
if (-not $npx) {
    Write-Host "Node.js not found. Install: winget install OpenJS.NodeJS.LTS" -ForegroundColor Red
    exit 1
}

$envVars = Read-EnvFile ".env"
$vkToken = $envVars["VK_GROUP_TOKEN"]
if (-not $vkToken) { $vkToken = $envVars["VK_TOKEN"] }

if (-not (Test-VkToken $vkToken)) {
    Write-Host ""
    Write-Host "VK token not found in .env" -ForegroundColor Red
    Write-Host ""
    Write-Host "1. Create a VK community (group/public page)" -ForegroundColor Yellow
    Write-Host "2. Enable Messages + Long Poll API (incoming messages)" -ForegroundColor Yellow
    Write-Host "3. Create API key with rights: messages, manage" -ForegroundColor Yellow
    Write-Host "4. Add to .env:" -ForegroundColor Yellow
    Write-Host "   VK_GROUP_TOKEN=vk1.a..." -ForegroundColor White
    Write-Host ""
    Write-Host "Guide: docs/VK-CHANNEL-SETUP.md" -ForegroundColor Cyan
    exit 1
}

$vkInspect = & $npx openclaw plugins inspect vk 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing VK plugin (@openclaw-vk/vk)..." -ForegroundColor Green
    & $npx openclaw plugins install @openclaw-vk/vk
    if ($LASTEXITCODE -ne 0) { exit 1 }
} else {
    Write-Host "VK plugin already installed." -ForegroundColor DarkGray
}
& $npx openclaw plugins enable vk

$secretsDir = Join-Path $env:USERPROFILE ".openclaw\workspace\secrets"
if (-not (Test-Path $secretsDir)) {
    New-Item -ItemType Directory -Path $secretsDir -Force | Out-Null
}
$tokenFile = Join-Path $secretsDir "vk-token.txt"
Set-Content -Path $tokenFile -Value $vkToken.Trim() -Encoding UTF8 -NoNewline
Write-Host "Token saved: $tokenFile" -ForegroundColor DarkGray

$openClawEnvPath = Join-Path $env:USERPROFILE ".openclaw\.env"
$gatewayEnvLines = @()
if (Test-Path $openClawEnvPath) {
    $gatewayEnvLines = Get-Content $openClawEnvPath | Where-Object { $_ -notmatch '^\s*VK_TOKEN=' }
}
$gatewayEnvLines += "VK_TOKEN=$vkToken"
Set-Content -Path $openClawEnvPath -Value $gatewayEnvLines -Encoding UTF8

$patch = @{
    channels = @{
        vk = @{
            enabled  = $true
            tokenFile = $tokenFile.Replace('\', '/')
            dmPolicy = "pairing"
            groupPolicy = "disabled"
        }
    }
} | ConvertTo-Json -Depth 5 -Compress

$patchFile = Join-Path $env:TEMP "openclaw-vk-patch.json"
Set-Content -Path $patchFile -Value $patch -Encoding UTF8

Write-Host "Updating OpenClaw config..." -ForegroundColor Green
Set-Content -Path $patchFile -Value $patch -Encoding UTF8
Get-Content $patchFile -Raw | & $npx openclaw config patch --stdin

Write-Host ""
Write-Host "=== VK channel configured ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start gateway:  .\scripts\start-gateway.ps1"
Write-Host "2. Message your VK bot from vk.com"
Write-Host "3. Bot replies with pairing code"
Write-Host "4. Approve:         npx openclaw pairing approve vk CODE"
Write-Host ""
Write-Host "Check status: npx openclaw channels status --probe" -ForegroundColor DarkGray
