\# Taglia vs Mafagrafos — Comparativo

**Data:** 2026-03-27
**Referência:** mafagrafos.com (3d.mafagrafos.com)

---

## Sobre o Mafagrafos

- **Criadora:** Aline Borges (engenheira de software, Curitiba-PR)
- **URL:** mafagrafos.com / 3d.mafagrafos.com
- **Modelo de negócio:** Assinatura com créditos (R$42-69/mês, 35-65 créditos/mês)
- **Idiomas:** PT/EN/ES
- **MakerWorld:** 96 modelos publicados, 4.4k+ seguidores
- **Comunidade:** 900 usuários, 80 assinantes (2 semanas após lançamento)
- **Loja:** mafagrafos.lojavirtualnuvem.com.br (produtos físicos)

## Status Geral

| Métrica | Mafagrafos | Taglia | Gap |
|---------|-----------|--------|-----|
| Modelos implementados | ~40+ (site) + 96 (MakerWorld) | 33 | ~7 no site |
| Modelos baseados em texto | ~18 | 18 | ✅ **Paridade** |
| Modelos baseados em imagem | ~12 | 10 | ⚠️ Gap pequeno |
| Modelos de alta complexidade | ~3+ | 0 | ❌ Não implementados |
| Preço | R$42-69/mês | Grátis | ✅ **Diferencial Taglia** |
| Backend necessário | Não (também WASM) | Não | Paridade técnica |
| Open source | Não | Sim | ✅ **Diferencial Taglia** |
| Idiomas | 3 (PT/EN/ES) | 1 (PT) | ⚠️ Gap |
| Licença comercial | Só assinantes | Livre (open source) | ✅ **Diferencial Taglia** |

---

## Comparação por Categoria

### Letreiros / Signs

| Modelo | Mafagrafos | Taglia | Status |
|--------|-----------|--------|--------|
| Letreiro Palavra 3 Cores | ✅ | ✅ word-offset-3color | Paridade |
| Letreiro Palavra 2 Cores | ✅ | ✅ word-offset-2color | Paridade |
| Letreiro com Coração | ✅ | ✅ word-heart-2colors | Paridade |
| Social Handle Offset 3 Cores | ✅ | ✅ social-handle-offset-3color | Paridade |
| Social Handle Offset 2 Cores | ✅ | ✅ social-handle-offset-2color | Paridade |
| Social Handle + QR Code | ✅ | ✅ social-handle-offset-2color-qr-code | Paridade |
| Social Handle Retângulo 3 Cores | ✅ | ✅ social-handle-rectangle-3color | Paridade |
| Social Handle Retângulo 2 Cores | ✅ | ✅ social-handle-rectangle-2color | Paridade |
| Letras Separadas 3 Cores | ✅ | ✅ separate-letters-offset-3color | Paridade |
| Letras Separadas 2 Cores | ✅ | ✅ separate-letters-offset-2color | Paridade |

**Resultado:** ✅ **Paridade total em letreiros**

### Chaveiros / Keychains

| Modelo | Mafagrafos | Taglia | Status |
|--------|-----------|--------|--------|
| Chaveiro Nome Completo | ✅ | ✅ full-name-keychain | Paridade |
| Chaveiro Retangular | ✅ | ✅ rectangle-name-keychain | Paridade |
| Chaveiro 2 Cores | ✅ | ✅ text-offset-keychain-2colors | Paridade |
| Chaveiro 3 Cores | ✅ | ✅ text-offset-keychain-3colors | Paridade |
| Chaveiro Cenoura | ✅ | ✅ carrot-name-keychain | Paridade |
| Chaveiro Coelho | ✅ | ✅ bunny-name-keychain | Paridade |
| Chaveiro NFC Quadrado | ✅ | ✅ square-nfc-keychain | Paridade |
| Chaveiro NFC Circular | ✅ | ✅ circle-nfc-keychain | Paridade |

**Resultado:** ✅ **Paridade total em chaveiros**

### Cozinha / Kitchen

| Modelo | Mafagrafos | Taglia | Status |
|--------|-----------|--------|--------|
| Forminha de Brigadeiro | ✅ | ✅ candy-mold | Paridade |
| Forminha Arredondada | ✅ | ✅ candy-mold-rounded | Paridade |
| Cortador de Biscoito | ✅ | ✅ cookie-cutter-generator | Paridade |
| Carimbo de Brigadeiro | ✅ | ⚠️ image-brigadeiro-stamp | Só silhueta |

**Resultado:** ⚠️ **Quase paridade** — carimbo sem detalhes internos

### Ferramentas / Tools

| Modelo | Mafagrafos | Taglia | Status |
|--------|-----------|--------|--------|
| Porta-canetas | ✅ | ✅ sized-pen-holder | Paridade |
| Contador Raspadinha | ✅ | ✅ scratch-off-counter | Paridade |
| Auxiliar de Posicionamento | ✅ | ✅ text-placement-helper | Paridade |

**Resultado:** ✅ **Paridade**

### Imagem → 3D (Grupo B)

| Modelo | Mafagrafos | Taglia | Status |
|--------|-----------|--------|--------|
| Imagem Afundada | ✅ | ✅ sunken-image-coloring | Paridade |
| Imagem 3D Offset | ✅ | ✅ image-to3d-offset | Paridade |
| Imagem 3D Resina | ✅ | ✅ image-to3d-resin-border | Paridade |
| Imagem Afundada Offset | ✅ | ✅ sunken-image-coloring-offset | Paridade |
| Marcador de Livro | ✅ | ✅ name-side-bookmark | Paridade |
| Quebra-cabeça | ✅ | ✅ image-puzzle | Paridade |
| Imagem Multipartes | ✅ | ✅ image-multipart | Paridade |
| Tigela de Imagem | ✅ | ✅ bowl-anything | Paridade |

**Resultado:** ✅ **Paridade total em modelos de imagem**

### String Art (Grupo C)

| Modelo | Mafagrafos | Taglia | Status |
|--------|-----------|--------|--------|
| String Art Retângulo | ✅ | ❌ | Grupo C |
| String Art Social | ✅ | ❌ | Grupo C |
| String Art Coração | ✅ | ❌ | Grupo C |

**Resultado:** ❌ **Não implementados** — alta complexidade

---

## Comparação de Features

| Feature | Mafagrafos | Taglia | Notas |
|---------|-----------|--------|-------|
| Preview 3D interativo | ✅ | ✅ | Three.js com OrbitControls |
| Export STL | ✅ | ✅ | |
| Export 3MF | ✅ | ❌ | Interface existe, não implementado |
| Multi-part export | ✅ | ✅ | Botões separados por peça |
| Upload de imagem | ✅ | ✅ | Drag-and-drop + click |
| Threshold ajustável | ? | ✅ | Slider de binarização |
| Processamento local | ❌ | ✅ | **Diferencial Taglia** |
| Open source | ❌ | ✅ | **Diferencial Taglia** |
| Categorias/filtros | ✅ | ❌ | A implementar |
| Thumbnails de preview | ✅ | ❌ | A implementar |
| Galeria de exemplos | ✅ | ❌ | A implementar |
| Responsivo/mobile | ✅ | ⚠️ | Funcional mas não otimizado |
| QR Code integrado | ✅ | ✅ | social-handle-qr-code |
| Fontes customizáveis | ✅ | ✅ | 8 Google Fonts |
| Cores indicativas | ✅ | ✅ | Color picker visual |

---

## Prioridades para Atingir Paridade

### Alta Prioridade (próximo sprint)
1. **String Art** — algoritmo complexo de nails + threads (Grupo C — 3 modelos)
2. **Categorias na CatalogPage** — filtrar por tipo (letreiro, chaveiro, imagem)
3. **Thumbnails** — preview estático por modelo no catálogo

### Média Prioridade
4. **Export 3MF** — multi-cor em um único arquivo
5. **Interior details** — resolver "mesh not closed" para carimbo
6. **Histórico de parâmetros** — salvar configurações no localStorage

### Baixa Prioridade (futuro)
7. **Multi-idioma** — suporte a EN/ES
8. **PWA (offline)** — progressive web app
9. **Galeria de exemplos** — por modelo

---

## Resumo Executivo

| Aspecto | Score Taglia | Score Mafagrafos |
|---------|-------------|-----------------|
| Modelos de texto | 18/18 (100%) | 18/18 (100%) |
| Modelos de imagem | 10/12 (83%) | 12/12 (100%) |
| Modelos complexos | 0/3 (0%) | 3/3 (100%) |
| **Total de modelos** | **33/36 (92%)** | **36/36 (100%)** |
| UI/UX | 70% | 100% |
| Performance | ⭐⭐⭐ | ⭐⭐⭐ |
| Privacidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Extensibilidade | ⭐⭐⭐⭐⭐ | ⭐⭐ |

**Para atingir paridade completa:** implementar 3 modelos String Art (Grupo C) + melhorias de UI (categorias, thumbnails, galeria).
**Diferencial competitivo do Taglia:** 100% local, open source, sem dados enviados a servidores.
