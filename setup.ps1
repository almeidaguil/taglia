# ============================================================
# Taglia - Setup do Ambiente (Windows PowerShell)
# ============================================================
# Execucao:  powershell -ExecutionPolicy Bypass -File setup.ps1
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

# ----- verificacao -----

function Invoke-Verify {
    Write-Title "Verificacao do Ambiente"

    $allOk = $true

    if (Test-Command "git") {
        $gitVersion = (git --version) -replace "git version ", ""
        Write-Ok "Git instalado ($gitVersion)"
    } else {
        Write-Fail "Git nao encontrado"
        $allOk = $false
    }

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
        Write-Fail "Node.js nao encontrado"
        $allOk = $false
    }

    if (Test-Command "npm") {
        $npmVersion = npm --version
        Write-Ok "npm instalado (v$npmVersion)"
    } else {
        Write-Fail "npm nao encontrado"
        $allOk = $false
    }

    if (Test-Command "gh") {
        $ghVersion = (gh --version | Select-Object -First 1) -replace "gh version ", ""
        Write-Ok "GitHub CLI instalado ($ghVersion)"

        $ghAuth = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "GitHub CLI autenticado"
        } else {
            Write-Warn "GitHub CLI instalado, mas nao autenticado (rode: gh auth login)"
        }
    } else {
        Write-Warn "GitHub CLI nao instalado (opcional, usado para PRs)"
    }

    if (Test-Path "node_modules") {
        Write-Ok "Dependencias instaladas (node_modules existe)"
    } else {
        Write-Warn "Dependencias nao instaladas (rode: npm install)"
        $allOk = $false
    }

    if (Test-Command "code") {
        $installed = code --list-extensions 2>&1
        $required = @(
            "esbenp.prettier-vscode",
            "dbaeumer.vscode-eslint",
            "editorconfig.editorconfig"
        )
        $missing = $required | Where-Object {
            $installed -notcontains $_
        }
        if ($missing.Count -eq 0) {
            Write-Ok "Extensoes VS Code instaladas"
        } else {
            Write-Warn "Extensoes faltando: $($missing -join ', ')"
            $allOk = $false
        }
    } else {
        Write-Warn "VS Code CLI nao encontrado (opcional)"
    }

    if (Test-Path "node_modules") {
        Write-Info "Testando build..."
        $buildResult = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Build executado com sucesso"
        } else {
            Write-Fail "Build falhou - verifique os erros acima"
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
    Write-Title "Instalacao do Git"

    if (Test-Command "git") {
        $v = (git --version) -replace "git version ", ""
        Write-Ok "Git ja instalado ($v)"
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
        Write-Fail "winget nao disponivel. Instale o Git manualmente: https://git-scm.com/download/win"
    }
}

function Install-Node {
    Write-Title "Instalacao do Node.js"

    if (Test-Command "node") {
        $v = (node --version) -replace "v", ""
        $major = [int]($v.Split(".")[0])
        if ($major -ge $HOST_MIN_NODE) {
            Write-Ok "Node.js ja instalado (v$v)"
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
        Write-Fail "winget nao disponivel. Instale o Node.js manualmente: https://nodejs.org"
    }
}

function Install-GhCli {
    Write-Title "Instalacao do GitHub CLI"

    if (Test-Command "gh") {
        $v = (gh --version | Select-Object -First 1) -replace "gh version ", ""
        Write-Ok "GitHub CLI ja instalado ($v)"
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
        Write-Fail "winget nao disponivel. Instale manualmente: https://cli.github.com"
    }
}

function Install-Dependencies {
    Write-Title "Instalacao das Dependencias do Projeto"

    if (-not (Test-Command "npm")) {
        Write-Fail "npm nao encontrado. Instale o Node.js primeiro."
        return
    }

    if (-not (Test-Path "package.json")) {
        Write-Fail "package.json nao encontrado. Verifique se esta na pasta do projeto."
        return
    }

    Write-Info "Executando npm install..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Dependencias instaladas com sucesso"
    } else {
        Write-Fail "Falha ao instalar dependencias"
    }
}

function Install-VsCodeExtensions {
    Write-Title "Extensoes do VS Code"

    if (-not (Test-Command "code")) {
        Write-Warn "VS Code CLI nao encontrado. Instale manualmente as extensoes recomendadas."
        return
    }

    $extensions = @(
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "editorconfig.editorconfig",
        "github.copilot",
        "github.copilot-chat",
        "bradlc.vscode-tailwindcss"
    )

    foreach ($ext in $extensions) {
        Write-Info "Instalando $ext..."
        code --install-extension $ext --force 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "$ext"
        } else {
            Write-Warn "Falha ao instalar $ext"
        }
    }
}

function Install-All {
    Write-Title "Instalacao Completa"
    Install-Git
    Install-Node
    Install-GhCli
    Install-Dependencies
    Install-VsCodeExtensions
    Write-Host ""
    Write-Info "Instalacao completa. Executando verificacao..."
    Invoke-Verify
}

function Show-Menu {
    while ($true) {
        Clear-Host
        Write-Host ""
        Write-Host "  +------------------------------------------------+" -ForegroundColor Cyan
        Write-Host "  |     Taglia - Setup do Ambiente (Windows)      |" -ForegroundColor Cyan
        Write-Host "  +------------------------------------------------+" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  Instalar tudo" -ForegroundColor White
        Write-Host "  [2]  Instalar Git" -ForegroundColor White
        Write-Host "  [3]  Instalar Node.js" -ForegroundColor White
        Write-Host "  [4]  Instalar GitHub CLI" -ForegroundColor White
        Write-Host "  [5]  Instalar dependencias do projeto (npm install)" -ForegroundColor White
        Write-Host "  [6]  Instalar extensoes do VS Code" -ForegroundColor White
        Write-Host "  [7]  Verificar ambiente" -ForegroundColor White
        Write-Host "  [0]  Sair" -ForegroundColor DarkGray
        Write-Host ""
        $choice = Read-Host "  Escolha uma opcao"

        switch ($choice) {
            "1" { Install-All;              Pause-Menu }
            "2" { Install-Git;              Pause-Menu }
            "3" { Install-Node;             Pause-Menu }
            "4" { Install-GhCli;            Pause-Menu }
            "5" { Install-Dependencies;     Pause-Menu }
            "6" { Install-VsCodeExtensions; Pause-Menu }
            "7" { Invoke-Verify;            Pause-Menu }
            "0" { Write-Host ""; Write-Host "  Ate mais!" -ForegroundColor Cyan; return }
            default { Write-Warn "Opcao invalida"; Start-Sleep -Seconds 1 }
        }
    }
}

Show-Menu
