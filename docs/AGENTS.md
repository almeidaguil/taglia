# Taglia — Sistema de Agentes

Arquitetura de 3 agentes especializados + 1 orquestrador para desenvolvimento eficiente.

---

## Orquestrador

### Papel
Coordena os 3 agentes, define prioridades, resolve conflitos e mantém a visão do projeto.

### Quando invocar qual agente
```
Novo modelo?             → Agente 1 (Modelador 3D)
Bug visual ou de UI?     → Agente 2 (Frontend)
Erro no WASM/pipeline?   → Agente 3 (Infra/Pipeline)
Dúvida de arquitetura?   → Agente 2 + 3 em paralelo
Modelo com imagem?       → Agente 1 + 3 em paralelo
```

### Fluxo de decisão
```
1. Usuário pede feature/fix
2. Orquestrador classifica: {modelo, ui, pipeline}
3. Lança agente(s) relevante(s)
4. Se erro > 15min → Orquestrador muda estratégia
5. Se bloqueio → Orquestrador busca referência (SCOPE.md § troubleshooting)
6. Resultado → Orquestrador valida + registra aprendizado
```

### Regras de escalação
- **Erro em 15 min**: tente abordagem alternativa
- **Erro em 30 min**: mude a estratégia completamente
- **Erro em 1h**: aceite limitação, documente, prossiga
- **Nunca**: ficar mais de 1h no mesmo bug sem progresso

---

## Agente 1 — Modelador 3D (SCAD Specialist)

### Responsabilidades
- Criar/editar arquivos em `src/models/` e `src/scad/`
- Escrever código OpenSCAD (templates .scad ou generateScadCode)
- Definir parâmetros corretos para cada modelo (tipos, ranges, defaults)
- Registrar modelos no `src/models/index.ts`

### Conhecimento necessário
- OpenSCAD: modules, difference, union, hull, offset, linear_extrude
- Padrão de offset multi-camada (2 ou 3 cores)
- text() com fonts e styles para modelos de texto
- polygon() para modelos baseados em imagem
- Convenções de nomes: slug kebab-case, parâmetros Snake_Case

### Template de novo modelo
```typescript
import type { ModelDefinition, ParameterValues } from '../types'

// Path A: template .scad
export const meuModelo: ModelDefinition = {
  id: 'meu-modelo',
  slug: 'meu-modelo',
  title: 'Meu Modelo',
  subtitle: 'Descrição curta.',
  category: 'tools',
  difficulty: 'easy',
  tags: ['tag1', 'tag2'],
  scadFile: 'meu-modelo.scad',  // OU generateScadCode
  exportOptions: [
    { format: 'stl', parameter: 'Part', filename: 'meu-modelo' },
  ],
  sections: [/* ... */],
}
```

### Checklist de novo modelo
- [ ] Arquivo .ts com ModelDefinition completa
- [ ] Arquivo .scad (se template) com parâmetros no topo
- [ ] Import + registro no index.ts
- [ ] Todos os parâmetros com min/max/step/default razoáveis
- [ ] Export options com nomes de arquivo descritivos
- [ ] `npx tsc --noEmit` sem erros
- [ ] Render funcional no browser

---

## Agente 2 — Frontend (React/UI Specialist)

### Responsabilidades
- Componentes React em `src/components/`
- Páginas em `src/pages/`
- Styling com Tailwind CSS
- Viewer 3D (Three.js) em `src/components/viewer/`
- Painel de parâmetros em `src/components/parameters/`

### Conhecimento necessário
- React 18 (hooks, refs, effects)
- TypeScript strict mode
- Tailwind CSS (classes utilitárias)
- Three.js (Scene, Camera, Renderer, STLLoader, OrbitControls)
- React Router DOM (routes, params, navigation)

### Padrões
- Componentes funcionais com hooks
- Props tipadas via interfaces
- useRef para canvas (evita re-render)
- Tailwind: dark mode via `dark:` prefix
- Responsivo: mobile-first com `md:` breakpoints

---

## Agente 3 — Pipeline/Infra (WASM & Image Specialist)

### Responsabilidades
- `src/utils/imageTrace.ts` — pipeline de imagem
- `src/utils/scad.ts` — build e injeção de parâmetros
- `src/workers/openscad.worker.ts` — Web Worker WASM
- `src/hooks/useOpenSCAD.ts` — hook de renderização
- `vite.config.ts` — configuração de build
- Headers COOP/COEP para SharedArrayBuffer

### Conhecimento necessário
- Web Workers e postMessage
- WebAssembly (WASM) e Emscripten filesystem
- Canvas API (getImageData, putImageData)
- Potrace (vetorização bitmap → SVG)
- SVG path commands (M, L, C, S, Q, T, Z)
- Bézier curves (cubic, quadratic)
- Polygon geometry (signed area, point-in-polygon, winding)
- OpenSCAD polygon() winding rules (CCW=solid, CW=hole)

### Problemas comuns e soluções

| Problema | Solução |
|----------|---------|
| "mesh not closed" | Simplificar polygon, usar offset(0), ou usar abordagem individual |
| Worker não responde | createFreshInstance() a cada render (callMain corrompe) |
| WASM não carrega | Verificar headers COOP/COEP |
| Imagem não traça | Ajustar threshold, verificar removeBackground |
| Render lento | Reduzir $fn, limitar pontos do polygon |
| Fonts não encontradas | Verificar VFS setup no worker |

---

## Comunicação entre Agentes

### Formato de handoff
```
{agente_origem} → {agente_destino}:
  contexto: o que foi feito
  artefatos: arquivos criados/modificados
  bloqueios: o que não funcionou
  próximo: o que precisa ser feito
```

### Exemplo
```
Agente 1 → Agente 3:
  contexto: Modelo `image-puzzle` precisa de grid + silhueta
  artefatos: src/models/image-puzzle.ts (parâmetros definidos)
  bloqueios: Preciso de função que divida polygon em grid NxM
  próximo: Implementar splitPolygonGrid() em imageTrace.ts
```

---

## Fluxo de Trabalho Paralelo

```
Novo sprint:
  ├── Agente 1: cria 2-3 modelos em paralelo
  ├── Agente 2: melhora UI/UX (categorias, filtros, preview)
  └── Agente 3: resolve issues de pipeline + prepara infra

Review:
  ├── Orquestrador: tsc --noEmit + teste manual
  ├── Agente 2: visual review no browser
  └── Agente 3: performance check (render times)
```
