# Taglia — Modelos Paramétricos 3D

Clone inspirado no mafagrafos.com para geração de modelos 3D paramétricos para impressão 3D.
Uso local e hospedagem no GitHub Pages (100% estático, sem backend).

## Stack

- React + Vite + TypeScript
- Tailwind CSS (via @tailwindcss/vite)
- Three.js — viewer 3D interativo (STLLoader + OrbitControls)
- OpenSCAD WASM (`openscad-wasm`) — geração dos modelos no browser via Web Worker
- React Router DOM

## Arquitetura

```
src/
├── types/           # ModelDefinition, Parameter, RenderStatus, etc.
├── models/          # Uma definição .ts por modelo + index.ts (registry)
├── scad/            # Um script .scad por modelo
├── workers/         # openscad.worker.ts — roda OpenSCAD WASM em background thread
├── hooks/           # useOpenSCAD.ts — gerencia worker + estados (idle/rendering/done/error)
├── utils/           # scad.ts — buildScadCode() injeta parâmetros no .scad via regex
├── components/
│   ├── viewer/      # ModelViewer.tsx — Three.js, rotacionar/zoom/pan
│   ├── parameters/  # ParameterPanel + ParameterField — form dinâmico por tipo
│   ├── layout/      # Header, Layout
│   └── ui/          # Button, Badge
└── pages/           # CatalogPage, ModelPage, ToolsPage
```

## Como adicionar um novo modelo

1. Criar `src/models/<slug>.ts` com a interface `ModelDefinition`
2. Criar `src/scad/<slug>.scad` com o script OpenSCAD (parâmetros como variáveis no topo)
3. Importar e adicionar no array `models` em `src/models/index.ts`

O `buildScadCode()` em `src/utils/scad.ts` injeta os valores do usuário via regex replace nas linhas `Key = valor;` do .scad.

### Tipos de parâmetro disponíveis

| tipo     | UI gerada                      |
|----------|-------------------------------|
| string   | input text                    |
| number   | range slider com min/max/step |
| boolean  | toggle switch                 |
| select   | dropdown                      |
| color    | color picker                  |
| image    | file upload (SVG/PNG)         |

## Modelos implementados

### Grupo A — Letreiros

| Slug | Nome | Status |
|------|------|--------|
| `word-offset-3color` | Letreiro de Palavra - 3 Camadas | ✅ |
| `word-offset-2color` | Letreiro de Palavra - 2 Camadas | ✅ |
| `word-heart-2colors` | Letreiro com Coração | ✅ |
| `social-handle-offset-3color` | Social Handle - 3 Cores | ✅ |
| `social-handle-offset-2color` | Social Handle - 2 Cores | ✅ |
| `social-handle-offset-2color-qr-code` | Social Handle + QR Code | ✅ |
| `social-handle-rectangle-3color` | Social Handle Retângulo - 3 Cores | ✅ |
| `social-handle-rectangle-2color` | Social Handle Retângulo - 2 Cores | ✅ |
| `separate-letters-offset-3color` | Letras Separadas - 3 Cores | ✅ |
| `separate-letters-offset-2color` | Letras Separadas - 2 Cores | ✅ |

### Grupo A — Chaveiros

| Slug | Nome | Status |
|------|------|--------|
| `full-name-keychain` | Chaveiro Nome Completo | ✅ |
| `rectangle-name-keychain` | Chaveiro Retangular | ✅ |
| `text-offset-keychain-2colors` | Chaveiro 2 Cores | ✅ |
| `text-offset-keychain-3colors` | Chaveiro 3 Cores | ✅ |
| `carrot-name-keychain` | Chaveiro Cenoura | ✅ |
| `bunny-name-keychain` | Chaveiro Coelho | ✅ |
| `square-nfc-keychain` | Chaveiro NFC Quadrado | ✅ |
| `circle-nfc-keychain` | Chaveiro NFC Circular | ✅ |

### Grupo A — Cozinha e Ferramentas

| Slug | Nome | Status |
|------|------|--------|
| `candy-mold` | Forminha de Brigadeiro | ✅ |
| `candy-mold-rounded` | Forminha Arredondada | ✅ |
| `sized-pen-holder` | Porta-canetas Paramétrico | ✅ |
| `scratch-off-counter` | Contador Raspadinha | ✅ |
| `text-placement-helper` | Auxiliar de Posicionamento | ✅ |

## Grupo B — baseados em imagem (Potrace.js)

| Slug | Nome | Status |
|------|------|--------|
| `cookie-cutter-generator` | Cortador de Biscoito | ✅ |
| `image-brigadeiro-stamp` | Carimbo de Brigadeiro | ⚠️ Só silhueta externa |
| `image-to3d-offset` | Imagem para 3D com Offset | ✅ |
| `image-to3d-resin-border` | Imagem para 3D Resina | ✅ |
| `sunken-image-coloring` | Imagem Afundada | ✅ |
| `sunken-image-coloring-offset` | Imagem Afundada Offset | ✅ |
| `name-side-bookmark` | Marcador de Livro | ✅ |
| `bowl-anything` | Cumbuca a partir de Imagem | ✅ |
| `image-puzzle` | Quebra-cabeça | ✅ |
| `image-multipart` | Imagem Multipartes | ✅ |

## Grupo C — alta complexidade (não implementados)

| Slug | Nome | Status |
|------|------|--------|
| `string-art-rectangle-name-radial` | String Art Retângulo | ❌ |
| `social-handle-string-art-floating` | String Art Social | ❌ |
| `string-art-heart-name-vertical-floating` | String Art Coração | ❌ |

## Dev

```bash
npm run dev      # localhost:5173
npm run build    # produção em /dist
```

## Notas importantes

- O OpenSCAD WASM (~13MB) carrega uma vez e fica em cache no Web Worker
- Os headers COOP/COEP estão configurados no vite.config.ts (necessário para SharedArrayBuffer do WASM)
- Import type obrigatório por causa do verbatimModuleSyntax no tsconfig
- Para GitHub Pages: `base: '/taglia/'` no vite.config.ts (subpath absoluto obrigatório)
- Ver `CONTRIBUTING.md` para workflow de Git, padrões de commit e convenções
- Ver `PROJECT_STATUS.md` para estado atual do projeto e histórico de sessões
