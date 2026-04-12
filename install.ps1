# Analisador de Recibos com IA - PowerShell Install Script
# Usage: irm https://raw.githubusercontent.com/magnobas/analisador-de-recibos/main/install.ps1 | iex

param(
    [string]$GeminiApiKey = "",
    [switch]$Run
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$EnvKeyName = "GEMINI_API_KEY"

function Write-Banner {
    Write-Host "================================================" -ForegroundColor Cyan
}

function Write-Header {
    Write-Host ""
    Write-Banner
    Write-Host "   Analisador de Recibos com IA - Instalador   " -ForegroundColor Cyan
    Write-Banner
    Write-Host ""
}

function Assert-Tool {
    param([string]$Name, [string]$InstallHint = "")
    Write-Host "Verificando $Name..." -ForegroundColor Yellow
    $version = & $Name --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: $Name nao encontrado." -ForegroundColor Red
        if ($InstallHint) { Write-Host $InstallHint -ForegroundColor Red }
        exit 1
    }
    Write-Host "$Name encontrado: $version" -ForegroundColor Green
}

function Check-NodeJS {
    Assert-Tool -Name "node" -InstallHint "Instale o Node.js em: https://nodejs.org/"
    Assert-Tool -Name "npm"
}

function Install-Dependencies {
    Write-Host ""
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha ao instalar dependencias." -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencias instaladas com sucesso." -ForegroundColor Green
}

function Setup-EnvFile {
    Write-Host ""
    Write-Host "Configurando variaveis de ambiente..." -ForegroundColor Yellow

    $envFile = ".env.local"
    $existing = Get-Content $envFile -ErrorAction SilentlyContinue | Where-Object { $_ -match "^$EnvKeyName=" }
    if ($existing) {
        Write-Host "$EnvKeyName ja configurada." -ForegroundColor Green
        return
    }

    if (-not $GeminiApiKey) {
        Write-Host ""
        Write-Host "Para usar o Analisador de Recibos, voce precisa de uma chave da API Gemini." -ForegroundColor Cyan
        Write-Host "Obtenha sua chave em: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
        Write-Host ""
        $GeminiApiKey = Read-Host "Digite sua GEMINI_API_KEY (ou pressione Enter para configurar depois)"
    }

    if ($GeminiApiKey) {
        "$EnvKeyName=$GeminiApiKey" | Out-File -FilePath $envFile -Encoding utf8 -Append
        Write-Host "$EnvKeyName salva em $envFile" -ForegroundColor Green
    } else {
        Write-Host "Aviso: $EnvKeyName nao configurada. Edite o arquivo $envFile antes de iniciar." -ForegroundColor Yellow
        "$EnvKeyName=" | Out-File -FilePath $envFile -Encoding utf8 -Append
    }
}

function Show-Instructions {
    Write-Host ""
    Write-Banner
    Write-Host "   Instalacao concluida com sucesso!           " -ForegroundColor Green
    Write-Banner
    Write-Host ""
    Write-Host "Para iniciar o aplicativo, execute:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Acesse em: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
}

Write-Header
Check-NodeJS
Install-Dependencies
Setup-EnvFile

if ($Run) {
    Write-Host ""
    Write-Host "Iniciando o servidor de desenvolvimento..." -ForegroundColor Yellow
    npm run dev
} else {
    Show-Instructions
}
