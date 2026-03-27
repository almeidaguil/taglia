# Taglia — Documento de Escopo do Projeto

**Versão:** 1.0
**Data:** 2026-03-27
**Referência:** mafagrafos.com

---

## 1. Visão Geral

O Taglia é um gerador de modelos 3D paramétricos para impressão 3D, inspirado no mafagrafos.com. Roda 100% no navegador (sem backend), usando OpenSCAD compilado para WebAssembly.

### Público-alvo
- Makers e entusiastas de impressão 3D
- Pequenos negócios de personalização (letreiros, chaveiros, carimbos)
- Pessoas que querem criar modelos 3D sem saber modelagem

### Diferencial
- **Zero dependência de servidor** — tudo roda no browser
- **Código aberto** — hospedável em GitHub Pages gratuitamente
- **Extensível** — cada modelo é um arquivo TypeScript independente

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Framework | React 18 + TypeScript | SPA moderna, tipagem forte |
| Build | Vite 8 | HMR rápido, ESM nativo, worker support |
| Estilo | Tailwind CSS | Produtividade, design consistente |
| 3D Viewer | Three.js | STLLoader + OrbitControls |
| CAD Engine | OpenSCAD WASM | Geração paramétrica no browser |
| Image Trace | esm-potrace-wasm | Vetorização de imagens |
| Routing | React Router DOM | Navegação SPA |

### Alternativas para contingência

| Se falhar | Alternativa |
|-----------|------------|
| OpenSCAD WASM performance | Pré-computar modelos comuns, cache agressivo |
| esm-potrace-wasm | Implementar contour tracing manual com Canvas API |
| Three.js viewer | model-viewer (Google), Babylon.js |
| Tailwind CSS | CSS Modules, Styled Components |
| GitHub Pages COOP/COEP | coi-serviceworker, Cloudflare Pages, Netlify |

---

## 3. Arquitetura

### Diagrama de Fluxo

```
[Usuário]
    │
    ▼
[CatalogPage] ──→ [ModelPage]
                      │
                      ├── [ParameterPanel] → valores do form
                      │
                      ├── [buildScadCode()]
                      │     ├── Path A: fetch .scad + injectParameters()
                      │     └── Path B: generateScadCode() (imagem)
                      │
                      ├── [useOpenSCAD] → Web Worker
                      │     └── OpenSCAD WASM → STL blob
                      │
                      └── [ModelViewer] → Three.js render
```

### Padrões de Projeto Utilizados

| Padrão | Onde | Por quê |
|--------|------|---------|
| **Registry** | models/index.ts | Centraliza modelos, descoberta por slug |
| **Strategy** | scadFile vs generateScadCode | Duas formas de gerar SCAD |
| **Observer** | useOpenSCAD hook | Status reativo (idle→rendering→done) |
| **Worker** | openscad.worker.ts | Processamento pesado off-main-thread |
| **Template Method** | .scad + injectParameters | Parâmetros substituídos em templates |
| **Factory** | ModelDefinition.sections | Gera UI dinamicamente por tipo |

### Convenções de Código

- **1 arquivo = 1 modelo** em src/models/
- **Slugs kebab-case** para URLs e IDs
- **import type** obrigatório (verbatimModuleSyntax)
- **Sem backend** — tudo que precisa de servidor é feito via WASM
- **Parâmetros com nomes OpenSCAD** — snake_case para compatibilidade

---

## 4. Pipeline de Processamento de Imagens

### Fluxo Completo

```
Imagem (PNG/JPG/WebP)
  │
  ▼ loadImage() + resize ≤1024px
Canvas 1: imagem original + fundo branco
  │
  ▼ Escala de cinza (Y = 0.299R + 0.587G + 0.114B)
  │
  ▼ removeBackground() — flood fill das bordas (tolerância 28)
  │
  ▼ Threshold binário (pixel >= limiar ? branco : preto)
  │
  ▼ Padding 8px branco (evita retângulo de fundo do potrace)
Canvas 2: imagem binarizada com padding
  │
  ▼ potrace WASM → SVG com paths
  │
  ▼ parseSvgToPaths() — parse M,L,C,S,Q,T,Z + Bézier sampling
  │
  ▼ Filtro de área (remove paths >= 90% canvas = fundo)
  │
  ▼ Transform global (center + scale + flip Y)
  │
  ▼ Fix winding (reverse indices para CCW/CW correto)
  │
  ▼ TraceResult {pointsStr, pathsStr, allPointsStr, allPathsStr, ...}
```

### Problemas Conhecidos e Soluções

| Problema | Causa | Solução Atual | Solução Futura |
|----------|-------|--------------|----------------|
| Retângulo de fundo | Potrace gera rect quando preto toca borda | Padding 8px + filtro área 90% | - |
| Fundo colorido | Flood fill não identifica fundo | Amostra 4 cantos + tolerância | ML-based background removal |
| Interior sem detalhes | Polygon multi-path → "mesh not closed" | Usar apenas silhueta externa | Pixel-based height field |
| Nesting incorreto | Centroide dentro de frame da imagem | Filtro de paths grandes | Signed area classification |
| Shapes complexas | Muitos pontos → render lento | Limitar 1024px + turdsize=4 | Simplificação Douglas-Peucker |

---

## 5. Catálogo de Modelos

### Implementados e Funcionais (33 modelos)

#### Letreiros (10)
| Slug | Nome | Cores | Status |
|------|------|-------|--------|
| word-offset-3color | Letreiro de Palavra | 3 | ✅ |
| word-offset-2color | Letreiro de Palavra | 2 | ✅ |
| word-heart-2colors | Letreiro com Coração | 2 | ✅ |
| social-handle-offset-3color | Social Handle Offset | 3 | ✅ |
| social-handle-offset-2color | Social Handle Offset | 2 | ✅ |
| social-handle-offset-2color-qr-code | Social Handle + QR | 2 | ✅ |
| social-handle-rectangle-3color | Social Handle Retângulo | 3 | ✅ |
| social-handle-rectangle-2color | Social Handle Retângulo | 2 | ✅ |
| separate-letters-offset-3color | Letras Separadas | 3 | ✅ |
| separate-letters-offset-2color | Letras Separadas | 2 | ✅ |

#### Chaveiros (8)
| Slug | Nome | Status |
|------|------|--------|
| full-name-keychain | Chaveiro Nome Completo | ✅ |
| rectangle-name-keychain | Chaveiro Retangular | ✅ |
| text-offset-keychain-2colors | Chaveiro 2 Cores | ✅ |
| text-offset-keychain-3colors | Chaveiro 3 Cores | ✅ |
| carrot-name-keychain | Chaveiro Cenoura | ✅ |
| bunny-name-keychain | Chaveiro Coelho | ✅ |
| square-nfc-keychain | Chaveiro NFC Quadrado | ✅ |
| circle-nfc-keychain | Chaveiro NFC Circular | ✅ |

#### Cozinha (5)
| Slug | Nome | Status |
|------|------|--------|
| candy-mold | Forminha de Brigadeiro | ✅ |
| candy-mold-rounded | Forminha Arredondada | ✅ |
| cookie-cutter-generator | Cortador de Biscoito | ✅ |
| image-brigadeiro-stamp | Carimbo de Brigadeiro | ⚠️ Só silhueta |
| bowl-anything | Cumbuca a partir de Imagem | ✅ |

#### Ferramentas e Imagem (10)
| Slug | Nome | Status |
|------|------|--------|
| sized-pen-holder | Porta-canetas | ✅ |
| scratch-off-counter | Contador Raspadinha | ✅ |
| text-placement-helper | Auxiliar de Posicionamento | ✅ |
| sunken-image-coloring | Imagem Afundada | ✅ |
| image-to3d-offset | Imagem 3D Offset | ✅ |
| image-to3d-resin-border | Imagem 3D Resina | ✅ |
| sunken-image-coloring-offset | Imagem Afundada Offset | ✅ |
| name-side-bookmark | Marcador de Livro | ✅ |
| image-puzzle | Quebra-cabeça de Imagem | ✅ |
| image-multipart | Imagem Multipartes | ✅ |

### Grupo C — Alta complexidade (futuro)

| Slug | Nome | Complexidade |
|------|------|-------------|
| string-art-rectangle-name-radial | String Art Retângulo | Muito Alta |
| social-handle-string-art-floating | String Art Social | Muito Alta |
| string-art-heart-name-vertical-floating | String Art Coração | Muito Alta |

---

## 6. Gestão de Erros e Troubleshooting

### Protocolo para erros que demoram

1. **15 min sem progresso** → Parar, documentar o que tentou, buscar alternativa
2. **30 min no mesmo erro** → Mudar abordagem completamente (ex: de polygon para pixel)
3. **1h+** → Aceitar limitação, documentar, seguir para próximo modelo

### Onde buscar referências

| Problema | Onde buscar |
|----------|-----------|
| OpenSCAD WASM bugs | https://github.com/nickenzi/openscad-wasm/issues |
| Polygon/mesh errors | OpenSCAD forum: https://forum.openscad.org/ |
| Potrace issues | https://github.com/nickenzi/esm-potrace-wasm |
| Three.js rendering | https://discourse.threejs.org/ |
| CGAL geometry | https://doc.cgal.org/latest/Nef_3/ |
| Even-odd fill rule | SVG spec: https://www.w3.org/TR/SVG11/painting.html#FillRuleProperty |

### Base de Conhecimento: Problemas Resolvidos

| Problema | Causa raiz | Solução |
|----------|-----------|---------|
| Cookie cutter renderiza como retângulo | Potrace gera rect de fundo | Padding 8px + filtro área ≥90% |
| handle_strip convexo | hull() em polygon não-convexo | difference(offset_outer, offset_inner) |
| "mesh not closed" no carimbo | Potrace paths com pontos compartilhados | Aceitar limitação, usar só silhueta |
| Imagem espelhada | SVG Y cresce para baixo | Inverter Y no transform |
| Winding errado no OpenSCAD | Y-flip inverte CW/CCW | Reverter índices dos paths |
| Fundo não removido | Fundo colorido (não branco) | Flood fill das bordas com tolerância |

---

## 7. Métricas de Qualidade

### Critérios de Aceite por Modelo

- [ ] Renderiza sem erro no OpenSCAD WASM
- [ ] STL exporta corretamente (manifold, watertight)
- [ ] Todos os parâmetros produzem resultado válido
- [ ] Tempo de render < 2 minutos
- [ ] Preview 3D mostra resultado correto
- [ ] Funciona em Chrome, Firefox, Safari

### Performance Targets

| Métrica | Target |
|---------|--------|
| Primeiro render (com cache WASM) | < 30s |
| Render subsequente | < 15s |
| Tamanho do build | < 5MB (sem WASM) |
| WASM load time | < 5s (com cache) |
| Pontos por polygon | < 5000 (evitar lag) |

---

## 8. Roadmap

### Sprint 1 (concluída) — Grupo B completo
- [x] cookie-cutter-generator
- [x] image-brigadeiro-stamp (limitado — só silhueta)
- [x] sunken-image-coloring
- [x] image-to3d-offset
- [x] image-to3d-resin-border
- [x] sunken-image-coloring-offset
- [x] name-side-bookmark
- [x] image-puzzle
- [x] image-multipart
- [x] bowl-anything

### Sprint 2 (atual) — String Art + UI polish
- [ ] String art models (Grupo C)
- [ ] Categorias/filtros na CatalogPage
- [ ] Preview thumbnail por modelo
- [ ] Histórico de parâmetros (localStorage)

### Sprint 3 — Features avançadas
- [ ] Export 3MF (multi-cor)
- [ ] Interior details — resolver "mesh not closed" para carimbo

### Sprint 4 — Polish
- [ ] PWA (offline)
- [ ] Compartilhar modelo via URL params
- [ ] Galeria de exemplos por modelo
- [ ] Multi-idioma (PT/EN)
