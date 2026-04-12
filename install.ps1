# Analisador de Recibos com IA - PowerShell Install Script
# Usage: irm https://raw.githubusercontent.com/magnobas/analisador-de-recibos/main/install.ps1 | iex

param(
    [string]$GeminiApiKey = "",
    [switch]$Run
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Header {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "   Analisador de Recibos com IA - Instalador   " -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Check-NodeJS {
    Write-Host "Verificando Node.js..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -ne 0) { throw }
        Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "ERRO: Node.js nao encontrado." -ForegroundColor Red
        Write-Host "Instale o Node.js em: https://nodejs.org/" -ForegroundColor Red
        exit 1
    }

    Write-Host "Verificando npm..." -ForegroundColor Yellow
    try {
        $npmVersion = npm --version 2>&1
        if ($LASTEXITCODE -ne 0) { throw }
        Write-Host "npm encontrado: v$npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "ERRO: npm nao encontrado." -ForegroundColor Red
        exit 1
    }
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

    if (Test-Path $envFile) {
        Write-Host "Arquivo $envFile ja existe." -ForegroundColor Cyan
        $existing = Get-Content $envFile | Where-Object { $_ -match "^GEMINI_API_KEY=" }
        if ($existing) {
            Write-Host "GEMINI_API_KEY ja configurada." -ForegroundColor Green
            return
        }
    }

    if (-not $GeminiApiKey) {
        Write-Host ""
        Write-Host "Para usar o Analisador de Recibos, voce precisa de uma chave da API Gemini." -ForegroundColor Cyan
        Write-Host "Obtenha sua chave em: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
        Write-Host ""
        $GeminiApiKey = Read-Host "Digite sua GEMINI_API_KEY (ou pressione Enter para configurar depois)"
    }

    if ($GeminiApiKey) {
        "GEMINI_API_KEY=$GeminiApiKey" | Out-File -FilePath $envFile -Encoding utf8 -Append
        Write-Host "GEMINI_API_KEY salva em $envFile" -ForegroundColor Green
    } else {
        Write-Host "Aviso: GEMINI_API_KEY nao configurada. Edite o arquivo $envFile antes de iniciar." -ForegroundColor Yellow
        "GEMINI_API_KEY=" | Out-File -FilePath $envFile -Encoding utf8 -Append
    }
}

function Show-Instructions {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "   Instalacao concluida com sucesso!           " -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para iniciar o aplicativo, execute:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Acesse em: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
}

# Main
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
