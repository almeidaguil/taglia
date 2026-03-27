# ============================================================
# Taglia — Setup do Ambiente (Windows PowerShell)
# ============================================================
# Execução:  powershell -ExecutionPolicy Bypass -File setup.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$HOST_MIN_NODE = 20
$REPO_URL      = "https://github.com/almeidaguil/taglia.git"

# ----- helpers -----

function Write-Title($text) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Ok($text)   { Write-Host "  [OK]    $text" -ForegroundColor Green }
function Write-Warn($text) { Write-Host "  [WARN]  $text" -ForegroundColor Yellow }
function Write-Fail($text) { Write-Host "  [FAIL]  $text" -ForegroundColor Red }
function Write-Info($text) { Write-Host "  [INFO]  $text" -ForegroundColor Gray }

function Test-Command($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Pause-Menu {
    Write-Host ""
    Write-Host "  Pressione qualquer tecla para voltar ao menu..." -ForegroundColor DarkGray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# ----- verificação -----

function Invoke-Verify {
    Write-Title "Verificação do Ambiente"

    $allOk = $true

    # Git
    if (Test-Command "git") {
        $gitVersion = (git --version) -replace "git version ", ""
        Write-Ok "Git instalado ($gitVersion)"
    } else {
        Write-Fail "Git não encontrado"
        $allOk = $false
    }

    # Node.js
    if (Test-Command "node") {
        $nodeVersion = (node --version) -replace "v", ""
        $nodeMajor   = [int]($nodeVersion.Split(".")[0])
        if ($nodeMajor -ge $HOST_MIN_NODE) {
            Write-Ok "Node.js instalado (v$nodeVersion)"
        } else {
            Write-Warn "Node.js v$nodeVersion encontrado, mas recomendado >= $HOST_MIN_NODE"
            $allOk = $false
        }
    } else {
        Write-Fail "Node.js não encontrado"
        $allOk = $false
    }

    # npm
    if (Test-Command "npm") {
        $npmVersion = npm --version
        Write-Ok "npm instalado (v$npmVersion)"
    } else {
        Write-Fail "npm não encontrado"
        $allOk = $false
    }

    # GitHub CLI
    if (Test-Command "gh") {
        $ghVersion = (gh --version | Select-Object -First 1) -replace "gh version ", ""
        Write-Ok "GitHub CLI instalado ($ghVersion)"

        $ghAuth = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "GitHub CLI autenticado"
        } else {
            Write-Warn "GitHub CLI instalado, mas não autenticado (rode: gh auth login)"
        }
    } else {
        Write-Warn "GitHub CLI não instalado (opcional, usado para PRs)"
    }

    # node_modules
    if (Test-Path "node_modules") {
        Write-Ok "Dependências instaladas (node_modules existe)"
    } else {
        Write-Warn "Dependências não instaladas (rode: npm install)"
        $allOk = $false
    }

    # Build test
    if (Test-Path "node_modules") {
        Write-Info "Testando build..."
        $buildResult = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Build executado com sucesso"
        } else {
            Write-Fail "Build falhou — verifique os erros acima"
            $allOk = $false
        }
    }

    Write-Host ""
    if ($allOk) {
        Write-Host "  Ambiente OK! Pronto para desenvolver." -ForegroundColor Green
    } else {
        Write-Host "  Ambiente incompleto. Corrija os itens acima." -ForegroundColor Yellow
    }
}

# ----- instaladores -----

function Install-Git {
    Write-Title "Instalação do Git"

    if (Test-Command "git") {
        $v = (git --version) -replace "git version ", ""
        Write-Ok "Git já instalado ($v)"
        return
    }

    if (Test-Command "winget") {
        Write-Info "Instalando Git via winget..."
        winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        if (Test-Command "git") {
            Write-Ok "Git instalado com sucesso"
        } else {
            Write-Warn "Git instalado. Feche e reabra o terminal para usar."
        }
    } else {
        Write-Fail "winget não disponível. Instale o Git manualmente: https://git-scm.com/download/win"
    }
}

function Install-Node {
    Write-Title "Instalação do Node.js"

    if (Test-Command "node") {
        $v = (node --version) -replace "v", ""
        $major = [int]($v.Split(".")[0])
        if ($major -ge $HOST_MIN_NODE) {
            Write-Ok "Node.js já instalado (v$v)"
            return
        }
        Write-Warn "Node.js v$v encontrado, atualizando..."
    }

    if (Test-Command "winget") {
        Write-Info "Instalando Node.js LTS via winget..."
        winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        if (Test-Command "node") {
            $v = (node --version) -replace "v", ""
            Write-Ok "Node.js instalado (v$v)"
        } else {
            Write-Warn "Node.js instalado. Feche e reabra o terminal para usar."
        }
    } else {
        Write-Fail "winget não disponível. Instale o Node.js manualmente: https://nodejs.org"
    }
}

function Install-GhCli {
    Write-Title "Instalação do GitHub CLI"

    if (Test-Command "gh") {
        $v = (gh --version | Select-Object -First 1) -replace "gh version ", ""
        Write-Ok "GitHub CLI já instalado ($v)"
        return
    }

    if (Test-Command "winget") {
        Write-Info "Instalando GitHub CLI via winget..."
        winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        if (Test-Command "gh") {
            Write-Ok "GitHub CLI instalado"
            Write-Info "Para autenticar, rode: gh auth login"
        } else {
            Write-Warn "GitHub CLI instalado. Feche e reabra o terminal para usar."
        }
    } else {
        Write-Fail "winget não disponível. Instale manualmente: https://cli.github.com"
    }
}

function Install-Dependencies {
    Write-Title "Instalação das Dependências do Projeto"

    if (-not (Test-Command "npm")) {
        Write-Fail "npm não encontrado. Instale o Node.js primeiro."
        return
    }

    if (-not (Test-Path "package.json")) {
        Write-Fail "package.json não encontrado. Verifique se está na pasta do projeto."
        return
    }

    Write-Info "Executando npm install..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Dependências instaladas com sucesso"
    } else {
        Write-Fail "Falha ao instalar dependências"
    }
}

function Install-All {
    Write-Title "Instalação Completa"
    Install-Git
    Install-Node
    Install-GhCli
    Install-Dependencies
    Write-Host ""
    Write-Info "Instalação completa. Executando verificação..."
    Invoke-Verify
}

# ----- menu -----

function Show-Menu {
    while ($true) {
        Clear-Host
        Write-Host ""
        Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║     Taglia — Setup do Ambiente (Windows)    ║" -ForegroundColor Cyan
        Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  Instalar tudo" -ForegroundColor White
        Write-Host "  [2]  Instalar Git" -ForegroundColor White
        Write-Host "  [3]  Instalar Node.js" -ForegroundColor White
        Write-Host "  [4]  Instalar GitHub CLI" -ForegroundColor White
        Write-Host "  [5]  Instalar dependências do projeto (npm install)" -ForegroundColor White
        Write-Host "  [6]  Verificar ambiente" -ForegroundColor White
        Write-Host "  [0]  Sair" -ForegroundColor DarkGray
        Write-Host ""
        $choice = Read-Host "  Escolha uma opção"

        switch ($choice) {
            "1" { Install-All;          Pause-Menu }
            "2" { Install-Git;          Pause-Menu }
            "3" { Install-Node;         Pause-Menu }
            "4" { Install-GhCli;        Pause-Menu }
            "5" { Install-Dependencies; Pause-Menu }
            "6" { Invoke-Verify;        Pause-Menu }
            "0" { Write-Host ""; Write-Host "  Até mais!" -ForegroundColor Cyan; return }
            default { Write-Warn "Opção inválida"; Start-Sleep -Seconds 1 }
        }
    }
}

# ----- entrypoint -----
Show-Menu
