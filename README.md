# Taglia

### Modelos 3D Parametricos no Navegador

Crie modelos 3D personalizados para impressao 3D — letreiros, chaveiros, carimbos, tigelas e muito mais. Tudo direto no navegador, sem instalar nada, sem enviar dados para servidores.

---

## Como funciona

```
1. Escolha um modelo    -->  Catalogo com 33+ modelos prontos
2. Personalize          -->  Ajuste texto, tamanho, cores, imagem
3. Gere o 3D            -->  OpenSCAD WASM processa no seu browser
4. Baixe o STL          -->  Pronto para imprimir
```

O motor de renderizacao roda **100% no seu computador** via WebAssembly. Nenhum dado sai do seu navegador.

---

## Modelos

### Letreiros & Placas
Letreiros de palavra, social handles (@), letras separadas — em 2 ou 3 cores com encaixe perfeito entre camadas.

### Chaveiros
Nome completo, retangular, cenoura, coelho, NFC quadrado/circular — com furo para argola e gravacao personalizada.

### Cozinha
Cortador de biscoito a partir de imagem, carimbo de brigadeiro, forminhas parametricas, cumbuca/tigela com formato de qualquer silhueta.

### Ferramentas & Imagem
Imagem afundada (sunken coloring), relevo 3D com offset, bordas para resina, quebra-cabeca, imagem multipartes, marcador de livro, porta-canetas, contador raspadinha.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Interface | React + TypeScript + Tailwind CSS |
| Build | Vite |
| Visualizacao 3D | Three.js (STLLoader + OrbitControls) |
| Motor CAD | OpenSCAD WASM (Web Worker) |
| Vetorizacao | Potrace WASM (imagem para poligono) |
| Hospedagem | GitHub Pages (100% estatico) |

---

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Servidor de desenvolvimento
npm run dev

# Build de producao
npm run build
```

Requer Node.js 18+ e um navegador moderno (Chrome, Firefox, Edge).

### Adicionar um novo modelo

```
1. Crie  src/models/meu-modelo.ts     (definicao do modelo)
2. Crie  src/scad/meu-modelo.scad     (template OpenSCAD, opcional)
3. Registre em  src/models/index.ts
```

Cada modelo e um arquivo TypeScript independente com parametros tipados, ranges, valores default e funcao de geracao de codigo OpenSCAD.

---

## Documentacao

| Documento | Conteudo |
|-----------|---------|
| [Guia de Instalacao](docs/SETUP.md) | Passo a passo por OS (Windows, macOS, Linux) + deploy |
| [Escopo do Projeto](docs/SCOPE.md) | Arquitetura, pipeline, roadmap |
| [Referencia de Modelos](docs/MODEL_REFERENCE.md) | 33 modelos com todos os parametros |
| [Sistema de Agentes](docs/AGENTS.md) | Arquitetura de desenvolvimento |

---

## Arquitetura

```
src/
  models/        33 definicoes de modelos parametricos
  scad/          Templates OpenSCAD para modelos de texto
  components/    React: viewer 3D, painel de parametros, UI
  workers/       Web Worker com OpenSCAD WASM
  utils/         Pipeline de imagem (Potrace) + injecao de parametros
  hooks/         useOpenSCAD — gerencia renderizacao async
  pages/         Catalogo, editor de modelo, ferramentas
  types/         Interfaces TypeScript
```

---

## Licenca

MIT
