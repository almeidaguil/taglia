# Taglia — Guia Completo de Instalação e Uso

Guia passo a passo para qualquer pessoa: como instalar, rodar e publicar a aplicação.

---

## O que é o Taglia?

O Taglia gera modelos 3D paramétricos (personalizáveis) diretamente no navegador. Você escolhe um modelo (letreiro, chaveiro, carimbo, etc.), ajusta os parâmetros (texto, tamanho, cores) e baixa o arquivo STL pronto para impressão 3D.

**Tudo roda localmente no seu computador** — nenhum dado é enviado para servidores.

---

## Instalação por Sistema Operacional

### Windows

#### 1. Instalar Node.js

1. Acesse https://nodejs.org/
2. Clique no botão **"LTS"** (versão recomendada, ex: 20.x.x)
3. Execute o instalador `.msi` baixado
4. **IMPORTANTE:** Marque a opção **"Add to PATH"** durante a instalação
5. Clique "Next" em todas as telas e depois "Install"
6. Após instalar, **reinicie o computador**

**Verificar:** Abra o **Prompt de Comando** (tecle `Win+R`, digite `cmd`, Enter) e execute:
```cmd
node --version
npm --version
```
Deve mostrar algo como `v20.x.x` e `10.x.x`.

**Erros comuns:**
| Erro | Causa | Solução |
|------|-------|---------|
| `'node' não é reconhecido como comando` | Node.js não está no PATH | Reinstale marcando "Add to PATH" ou reinicie o PC |
| `EPERM: operation not permitted` | Sem permissão de administrador | Execute o cmd como Administrador (clique direito → "Executar como administrador") |
| `npm ERR! cb() never called!` | Cache do npm corrompido | Execute `npm cache clean --force` e tente novamente |
| `ENOENT: no such file or directory` | Caminho com caracteres especiais | Mova o projeto para `C:\projetos\taglia` (sem espaços/acentos no caminho) |

#### 2. Instalar Git

1. Acesse https://git-scm.com/download/win
2. Execute o instalador
3. Na tela **"Adjusting your PATH"**, selecione **"Git from the command line and also from 3rd-party software"**
4. Nas demais telas, aceite os padrões e clique "Next"
5. Clique "Install"

**Verificar:**
```cmd
git --version
```

**Erros comuns:**
| Erro | Causa | Solução |
|------|-------|---------|
| `'git' não é reconhecido` | Git não está no PATH | Reinstale selecionando a opção de PATH ou reinicie o terminal |
| SSL certificate problem | Proxy corporativo ou antivírus | `git config --global http.sslVerify false` (temporário) |

#### 3. Clonar e rodar

Abra o **Prompt de Comando** ou **PowerShell** e execute:

```cmd
cd C:\Users\SEU_USUARIO\Documents
git clone https://github.com/SEU_USUARIO/taglia.git
cd taglia
npm install
npm run dev
```

Abra **http://localhost:5173** no navegador.

**Erros comuns durante `npm install`:**
| Erro | Causa | Solução |
|------|-------|---------|
| `npm ERR! code EACCES` | Sem permissão | Execute como Administrador |
| `gyp ERR! find Python` | Python não encontrado (dependência nativa) | `npm install --global windows-build-tools` |
| `Error: ENOSPC` | Sem espaço em disco | Libere pelo menos 500MB |
| Trava em `idealTree` | Rede lenta ou proxy | Tente `npm install --prefer-offline` ou configure proxy |

---

### macOS

#### 1. Instalar Homebrew (gerenciador de pacotes)

Abra o **Terminal** (Spotlight → digite "Terminal") e execute:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Siga as instruções na tela. Se pedir senha, digite a senha do seu Mac (não aparece enquanto digita, é normal).

**Após instalar**, adicione o Homebrew ao PATH (o instalador mostra o comando exato, mas geralmente é):

```bash
# Para Apple Silicon (M1/M2/M3/M4):
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Para Intel:
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

#### 2. Instalar Node.js e Git

```bash
brew install node git
```

**Verificar:**
```bash
node --version    # deve mostrar v20+
npm --version     # deve mostrar 10+
git --version     # deve mostrar 2.x+
```

**Erros comuns:**
| Erro | Causa | Solução |
|------|-------|---------|
| `command not found: brew` | Homebrew não está no PATH | Execute o comando `eval` acima para seu chip (Silicon ou Intel) |
| `Xcode Command Line Tools` | Precisa das ferramentas de build | `xcode-select --install` |
| `Permission denied` | Permissões do Homebrew | `sudo chown -R $(whoami) /opt/homebrew` |

#### 3. Clonar e rodar

```bash
cd ~/Documents
git clone https://github.com/SEU_USUARIO/taglia.git
cd taglia
npm install
npm run dev
```

Abra **http://localhost:5173** no navegador.

**Erros comuns durante `npm install`:**
| Erro | Causa | Solução |
|------|-------|---------|
| `gyp: No Xcode or CLT version` | Ferramentas de build ausentes | `xcode-select --install` |
| `EACCES: permission denied` | Permissões do npm | `sudo chown -R $(whoami) ~/.npm` |
| `node-gyp rebuild failed` | Compilação nativa falhou | `brew install python3` e tente novamente |

---

### Linux (Ubuntu/Debian)

#### 1. Instalar Node.js via nvm (recomendado)

O `nvm` (Node Version Manager) facilita instalar e gerenciar versões do Node.js.

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reiniciar o terminal (feche e abra novamente) ou execute:
source ~/.bashrc

# Instalar Node.js LTS
nvm install --lts
nvm use --lts
```

**Verificar:**
```bash
node --version    # deve mostrar v20+
npm --version     # deve mostrar 10+
```

**Alternativa sem nvm (via apt):**
```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 2. Instalar Git

```bash
sudo apt update
sudo apt install -y git
```

**Para Fedora/CentOS:**
```bash
sudo dnf install git nodejs npm
```

**Para Arch Linux:**
```bash
sudo pacman -S git nodejs npm
```

#### 3. Clonar e rodar

```bash
cd ~/Documents
git clone https://github.com/SEU_USUARIO/taglia.git
cd taglia
npm install
npm run dev
```

Abra **http://localhost:5173** no navegador.

**Erros comuns:**
| Erro | Causa | Solução |
|------|-------|---------|
| `nvm: command not found` | Terminal não recarregou | `source ~/.bashrc` ou feche/abra o terminal |
| `EACCES: permission denied /usr/lib/node_modules` | npm global sem permissão | Use nvm (não precisa sudo) ou `sudo npm install` |
| `Error: ENOSPC: System limit for file watchers` | Limite de watchers do sistema | `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf && sudo sysctl -p` |
| `libc++: not found` | Biblioteca C++ ausente | `sudo apt install -y build-essential` |
| Canvas/sharp build error | Dependências nativas ausentes | `sudo apt install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++` |

---

## Após a Instalação (todos os sistemas)

### Verificação rápida

Após `npm run dev`, confirme que tudo funciona:

1. Abra **http://localhost:5173** no navegador
2. Você deve ver o catálogo de modelos
3. Clique em qualquer modelo (ex: "Letreiro de Palavra - 3 Camadas")
4. Clique em **"Gerar: Base STL"**
5. Aguarde o processamento (~10-30 segundos na primeira vez)
6. O modelo 3D deve aparecer no viewer

Se algo der errado, abra o **Console do navegador** (F12 → aba Console) e veja os erros.

### Erros comuns no navegador

| Erro no Console | Causa | Solução |
|----------------|-------|---------|
| `SharedArrayBuffer is not defined` | Headers COOP/COEP ausentes | Normal em produção (GitHub Pages). Em dev, o Vite configura automaticamente |
| `Failed to fetch openscad.wasm` | WASM não encontrado | Execute `npm install` novamente para baixar o pacote |
| `RangeError: Maximum call stack size` | Imagem muito complexa | Use imagens menores ou mais simples |
| `Uncaught TypeError: Cannot read property` | Navegador incompatível | Use Chrome 90+, Firefox 90+, Edge 90+ ou Safari 15+ |
| Viewer 3D preto/vazio | WebGL não suportado | Atualize drivers de vídeo ou use outro navegador |

---

## Como Usar

### Navegação

- **Página inicial** → Catálogo com todos os modelos disponíveis
- **Clique em um modelo** → Abre o editor com parâmetros e visualização 3D

### Gerando um modelo

1. **Escolha um modelo** no catálogo
2. **Ajuste os parâmetros** no painel direito (texto, tamanho, cores, etc.)
3. **Clique em "Gerar: [Nome] STL"** — aguarde o processamento
4. **Visualize o resultado** no viewer 3D (arraste para rotacionar, scroll para zoom)
5. **Clique em "Baixar STL"** para salvar o arquivo

### Controles do Viewer 3D

| Ação | Mouse | Trackpad (Mac) |
|------|-------|----------------|
| Rotacionar | Arrastar com botão esquerdo | Arrastar com dois dedos |
| Zoom | Scroll do mouse | Pinça com dois dedos |
| Mover (pan) | Arrastar com botão direito | Shift + arrastar |
| Resetar vista | Duplo clique | Duplo toque |

### Para modelos com imagem

1. Clique na área de upload ou arraste uma imagem (PNG, JPG, WebP)
2. Ajuste o **"Limiar de binarização"** se o contorno não ficar bom
   - Valor menor (ex: 80) → captura mais detalhes escuros
   - Valor maior (ex: 200) → captura apenas áreas muito escuras
3. Gere normalmente

**Dicas para melhores resultados com imagens:**
- Use imagens com fundo branco e silhueta preta
- Resolução mínima: 200x200px
- Formatos aceitos: PNG (melhor), JPG, WebP
- Evite imagens com muitos detalhes finos (podem não aparecer no 3D)

### Modelos multi-cor (2 ou 3 peças)

Modelos como "Letreiro 3 Cores" geram **peças separadas** que se encaixam:
- Clique em cada botão "Gerar: Base STL", "Gerar: Middle STL", "Gerar: Top STL"
- Baixe cada peça separadamente
- Imprima cada peça em uma cor diferente
- Monte as peças (encaixe por pressão)

**Dica:** O parâmetro "Tolerância" (0.1-0.5mm) ajusta a folga do encaixe. Se as peças ficarem apertadas demais, aumente para 0.3mm.

---

## Publicar no GitHub Pages (gratuito)

### 1. Crie uma conta no GitHub

Se ainda não tem: acesse https://github.com/signup e crie uma conta gratuita.

### 2. Crie um repositório

- Acesse https://github.com/new
- Nome: `taglia` (ou o nome que preferir)
- Visibilidade: **Public** (necessário para Pages gratuito)
- Clique **"Create repository"**

### 3. Configure o repositório local

No terminal, dentro da pasta `taglia`:

```bash
git remote add origin https://github.com/SEU_USUARIO/taglia.git
git branch -M main
git push -u origin main
```

Se pedir credenciais, use seu usuário do GitHub e um **Personal Access Token** (não a senha). Para criar um token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token.

### 4. Gere o build de produção

```bash
npm run build
```

Isso cria a pasta `dist/` com todos os arquivos otimizados.

### 5. Configure o GitHub Actions para deploy automático

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Ative o GitHub Pages

1. No repositório do GitHub, vá em **Settings** → **Pages**
2. Em "Source", selecione **GitHub Actions**
3. Faça o push do workflow:

```bash
mkdir -p .github/workflows
# (salve o arquivo deploy.yml acima)
git add .github/workflows/deploy.yml
git commit -m "Adiciona deploy automático para GitHub Pages"
git push
```

4. Vá em **Actions** no repositório e acompanhe o build
5. Quando completar (ícone verde), acesse: `https://SEU_USUARIO.github.io/taglia/`

### 7. Headers COOP/COEP (importante para WASM)

O OpenSCAD WASM precisa de `SharedArrayBuffer`, que requer headers HTTP especiais. Há duas formas de resolver:

**Opção A — Service Worker (funciona em qualquer hosting):**

Já incluído no projeto. O arquivo `coi-serviceworker.js` em `public/` adiciona os headers via Service Worker na primeira visita.

**Opção B — Cloudflare Pages (alternativa ao GitHub Pages):**

Se preferir hosting com headers nativos:
1. Acesse https://dash.cloudflare.com/ e crie uma conta
2. Pages → Create project → Connect to Git
3. Selecione o repositório `taglia`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Crie o arquivo `public/_headers`:
```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

**Erros comuns no deploy:**
| Erro | Causa | Solução |
|------|-------|---------|
| Build falha no Actions | Versão do Node diferente | Verifique `node-version: 20` no workflow |
| 404 ao acessar a página | Pages não ativado | Settings → Pages → Source: GitHub Actions |
| Modelos não geram | SharedArrayBuffer bloqueado | Use coi-serviceworker ou Cloudflare Pages |
| CSS quebrado | Base path errado | Confirme `base: './'` no vite.config.ts |
| Rotas 404 (ex: /model/xyz) | SPA routing | Adicione `public/404.html` copiando `index.html` |

---

## Estrutura do Projeto (para desenvolvedores)

```
taglia/
├── src/
│   ├── models/      # Definições dos modelos (1 arquivo por modelo)
│   ├── scad/        # Templates OpenSCAD (modelos baseados em texto)
│   ├── workers/     # Web Worker para OpenSCAD WASM
│   ├── hooks/       # Hook useOpenSCAD (gerencia o worker)
│   ├── utils/       # buildScadCode, imageTrace
│   ├── components/  # React: viewer 3D, painel de parâmetros, UI
│   ├── pages/       # Catálogo, página do modelo, ferramentas
│   └── types/       # Interfaces TypeScript
├── public/          # Assets estáticos
├── docs/            # Documentação
└── dist/            # Build de produção (gerado pelo npm run build)
```

### Como adicionar um novo modelo

1. Crie `src/models/meu-modelo.ts` com a interface `ModelDefinition`
2. (Opcional) Crie `src/scad/meu-modelo.scad` se for baseado em template
3. Importe e adicione no array em `src/models/index.ts`
4. Rode `npm run dev` e teste em `/model/meu-modelo`

---

## Comandos úteis

```bash
npm run dev      # Servidor de desenvolvimento (localhost:5173)
npm run build    # Build de produção em /dist
npm run preview  # Visualizar o build de produção localmente
npm run lint     # Verificar qualidade do código
npx tsc --noEmit # Verificar erros de TypeScript sem compilar
```

---

## FAQ

**P: Preciso de internet para usar o Taglia?**
R: Só na primeira vez (para carregar o OpenSCAD WASM ~13MB). Depois fica em cache.

**P: Funciona no celular?**
R: Sim, mas a experiência é melhor no desktop por causa do viewer 3D e dos controles.

**P: Posso vender os modelos que gero?**
R: Sim! O Taglia é open source e os modelos gerados são seus. Use como quiser.

**P: Os arquivos STL funcionam em qualquer impressora 3D?**
R: Sim. STL é o formato universal aceito por todas as impressoras e fatiadores (Cura, PrusaSlicer, Bambu Studio, etc.).

**P: Quanto de filamento cada modelo usa?**
R: Depende do tamanho. Um letreiro de 150mm gasta ~10-30g. Use o fatiador para estimar.
