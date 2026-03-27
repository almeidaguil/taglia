# Taglia — Referência Completa de Modelos

**33 modelos** | **4 categorias** | **114 seções de parâmetros**
Dados extraídos do código-fonte em 2026-03-27.

---

## Resumo por Categoria

| Categoria | Modelos | Dinâmicos | Multi-parte |
|-----------|---------|-----------|-------------|
| Signs (Letreiros) | 10 | 0 | 10 (2-3 STL) |
| Keychains (Chaveiros) | 8 | 0 | 2 (2-3 STL) |
| Kitchen (Cozinha) | 5 | 3 | 0 |
| Tools (Ferramentas) | 10 | 7 | 2 (puzzle, multipart) |

**Fontes disponíveis:** Bebas Neue, Dancing Script, Great Vibes, Lobster, Montserrat, Pacifico, Roboto Mono, Sacramento

---

## Letreiros / Signs

### 1. word-offset-3color — Letreiro de Palavra - 3 Camadas
> Letreiro multicolorido com efeito 3D deslocado. Imprime em 3 partes: base, meio e topo.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Text | string | `Mafa3D` | - | - | - |
| Font | select | `Bebas Neue` | - | - | - |
| Target_Size | number | 150 | 40 | 280 | 1 |
| Base_Width | number | 180 | 50 | 320 | 5 |
| Offset | number | 2 | 0.5 | 8 | 0.5 |
| Tolerance | number | 0.2 | 0.1 | 0.5 | 0.05 |
| Base_Height | number | 3 | 1 | 10 | 0.5 |
| Layer_Height | number | 4 | 2 | 12 | 0.5 |
| Base_Color | color | `#1a1a2e` | - | - | - |
| Middle_Color | color | `#e94560` | - | - | - |
| Top_Color | color | `#f5f5f5` | - | - | - |

**Export:** Base (`Word-3Color-Base`), Middle (`Word-3Color-Middle`), Top (`Word-3Color-Top`)

---

### 2. word-offset-2color — Letreiro de Palavra - 2 Camadas
> Letreiro bicolorido com efeito 3D deslocado. Imprime em 2 partes.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Text | string | `Mafa3D` | - | - | - |
| Font | select | `Bebas Neue` | - | - | - |
| Target_Size | number | 150 | 40 | 280 | 1 |
| Base_Width | number | 180 | 50 | 320 | 5 |
| Offset | number | 2 | 0.5 | 8 | 0.5 |
| Tolerance | number | 0.2 | 0.1 | 0.5 | 0.05 |
| Base_Height | number | 3 | 1 | 10 | 0.5 |
| Layer_Height | number | 4 | 2 | 12 | 0.5 |

**Export:** Base (`Word-2Color-Base`), Top (`Word-2Color-Top`)

---

### 3. word-heart-2colors — Letreiro com Coração
> Dois nomes com um coração entre eles. Perfeito para casais e datas especiais.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Word1 | string | `Ana` | - | - | - |
| Word2 | string | `João` | - | - | - |
| Font | select | `Bebas Neue` | - | - | - |
| Word_Size | number | 80 | 30 | 150 | 5 |
| Heart_Size | number | 40 | 15 | 80 | 5 |
| Spacing | number | 15 | 5 | 40 | 5 |
| Base_Width | number | 270 | 100 | 400 | 10 |
| Tolerance | number | 0.2 | 0.1 | 0.5 | 0.05 |
| Base_Height | number | 3 | 1 | 10 | 0.5 |
| Layer_Height | number | 4 | 2 | 12 | 0.5 |

**Export:** Base (`WordHeart-Base`), Top (`WordHeart-Top`)

---

### 4. social-handle-offset-3color — Social Handle - 3 Cores
> Letreiro com seu @ das redes sociais em 3 camadas coloridas.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Handle | string | `mafa3d` | - | - | - |
| Show_At | boolean | `true` | - | - | - |
| Font | select | `Bebas Neue` | - | - | - |
| Target_Size | number | 150 | 40 | 280 | 1 |
| Base_Width | number | 200 | 60 | 350 | 5 |
| Offset | number | 2 | 0.5 | 8 | 0.5 |
| Tolerance | number | 0.2 | 0.1 | 0.5 | 0.05 |
| Base_Height | number | 3 | 1 | 10 | 0.5 |
| Layer_Height | number | 4 | 2 | 12 | 0.5 |
| Base_Color | color | `#833ab4` | - | - | - |
| Middle_Color | color | `#fd1d1d` | - | - | - |
| Top_Color | color | `#fcb045` | - | - | - |

**Export:** Base, Middle, Top (`SocialHandle-3C-*`)

---

### 5-10. Demais letreiros (padrão similar)

| Slug | Título | Partes | Defaults únicos |
|------|--------|--------|-----------------|
| `social-handle-offset-2color` | Social Handle 2 Cores | 2 | Handle=`mafa3d` |
| `social-handle-offset-2color-qr-code` | Social Handle + QR | 2 | QR_Size=70, QR_Depth=1 |
| `social-handle-rectangle-3color` | Social Retângulo 3C | 3 | Rect_Width=220, Rect_Height=80, Corner_Radius=8 |
| `social-handle-rectangle-2color` | Social Retângulo 2C | 2 | Rect_Width=220, Rect_Height=80 |
| `separate-letters-offset-3color` | Letras Separadas 3C | 3 | Letter=`A`, Letter_Size=60, Padding=6 |
| `separate-letters-offset-2color` | Letras Separadas 2C | 2 | Letter=`A`, Letter_Size=60 |

---

## Chaveiros / Keychains

### 11. full-name-keychain — Chaveiro Nome Completo

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Name | string | `Maria` | - | - | - |
| Font | select | `Bebas Neue` | - | - | - |
| Name_Size | number | 50 | 20 | 120 | 5 |
| Padding | number | 5 | 2 | 15 | 1 |
| Thickness | number | 4 | 2 | 8 | 0.5 |
| Ring_Hole_D | number | 6 | 4 | 12 | 0.5 |

**Export:** 1 STL (`NameKeychain`)

---

### 12-18. Demais chaveiros

| Slug | Título | Partes | Defaults únicos |
|------|--------|--------|-----------------|
| `rectangle-name-keychain` | Chaveiro Retangular | 1 | Rect_Width=70, Rect_Height=30, Border=1.5 |
| `text-offset-keychain-2colors` | Chaveiro 2 Cores | 2 | Rect_Width=75, Rect_Height=32 |
| `text-offset-keychain-3colors` | Chaveiro 3 Cores | 3 | Offset=1.5, Layer_Height=2.5 |
| `carrot-name-keychain` | Chaveiro Cenoura | 1 | Carrot_Width=28, Carrot_Height=65, Text_Depth=1.5 |
| `bunny-name-keychain` | Chaveiro Coelho | 1 | Bunny_Size=55, Text_Depth=1.5 |
| `square-nfc-keychain` | Chaveiro NFC Quadrado | 1 | Side=45, NFC_Width=26, NFC_Depth=1.2 |
| `circle-nfc-keychain` | Chaveiro NFC Circular | 1 | Diameter=45, NFC_Diameter=28 |

---

## Cozinha / Kitchen

### 19. candy-mold — Forminha de Brigadeiro

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Cols | number | 4 | 1 | 8 | 1 |
| Rows | number | 3 | 1 | 6 | 1 |
| Cavity_D | number | 35 | 20 | 60 | 5 |
| Cavity_Depth | number | 14 | 8 | 25 | 1 |
| Spacing | number | 5 | 3 | 15 | 1 |
| Wall | number | 3 | 2 | 8 | 0.5 |
| Base_H | number | 2 | 1 | 5 | 0.5 |

### 20. candy-mold-rounded — Forminha Arredondada
Mesmos parâmetros + `Round_Base` (default: 8, min: 2, max: 15)

### 21. cookie-cutter-generator — Cortador de Biscoito (dinâmico)

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 80 | 30 | 200 | 5 |
| Height | number | 12 | 8 | 25 | 1 |
| Wall_Thickness | number | 1.2 | 0.8 | 2.5 | 0.1 |
| Threshold | number | 128 | 10 | 245 | 5 |
| Handle | boolean | true | - | - | - |
| Handle_Height | number | 4 | 2 | 8 | 1 |
| Handle_Width | number | 3 | 1 | 6 | 0.5 |

### 22. image-brigadeiro-stamp — Carimbo de Brigadeiro (dinâmico)

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 40 | 15 | 80 | 5 |
| Margin | number | 4 | 1 | 10 | 0.5 |
| Base_Thickness | number | 3 | 1.5 | 6 | 0.5 |
| Relief_Height | number | 2 | 0.5 | 5 | 0.5 |
| Handle | boolean | true | - | - | - |
| Handle_Height | number | 18 | 8 | 35 | 1 |
| Handle_Diameter | number | 18 | 10 | 30 | 1 |
| Threshold | number | 128 | 10 | 245 | 5 |

> **Limitação:** Renderiza apenas a silhueta externa. Detalhes internos (olhos, nariz) não aparecem devido a limitação de geometria não-manifold no CGAL.

---

## Ferramentas / Tools

### 23. sized-pen-holder — Porta-canetas Paramétrico

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Outer_D | number | 80 | 50 | 150 | 5 |
| Height | number | 100 | 60 | 200 | 10 |
| Wall | number | 4 | 2 | 8 | 0.5 |
| Base_H | number | 3 | 2 | 8 | 0.5 |
| Hole1_D | number | 8 | 5 | 15 | 0.5 |
| Hole2_D | number | 10 | 6 | 20 | 0.5 |
| Hole3_D | number | 14 | 8 | 25 | 0.5 |
| Holes_Per_Ring | number | 6 | 3 | 12 | 1 |

### 24. scratch-off-counter — Contador Raspadinha

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Cols | number | 5 | 2 | 10 | 1 |
| Rows | number | 6 | 2 | 10 | 1 |
| Circle_D | number | 22 | 12 | 40 | 2 |
| Spacing | number | 4 | 2 | 10 | 1 |
| Number_Size | number | 8 | 4 | 16 | 1 |
| Base_H | number | 3 | 2 | 6 | 0.5 |

### 25. text-placement-helper — Auxiliar de Posicionamento

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Width | number | 200 | 50 | 400 | 10 |
| Height | number | 30 | 15 | 60 | 5 |
| Thickness | number | 2.5 | 1.5 | 5 | 0.5 |
| Grid_Spacing | number | 10 | 5 | 25 | 5 |

### 26. sunken-image-coloring — Imagem Afundada (dinâmico)

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 60 | 20 | 150 | 5 |
| Frame_Margin | number | 5 | 1 | 20 | 0.5 |
| Base_Thickness | number | 4 | 2 | 10 | 0.5 |
| Carve_Depth | number | 2 | 0.5 | 5 | 0.5 |
| Threshold | number | 128 | 10 | 245 | 5 |

### 27. image-to3d-offset — Imagem para 3D com Offset (dinâmico)

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 60 | 20 | 150 | 5 |
| Layers | number | 3 | 1 | 5 | 1 |
| Layer_Height | number | 2 | 0.5 | 8 | 0.5 |
| Offset_Step | number | 2 | 0.5 | 8 | 0.5 |
| Threshold | number | 128 | 10 | 245 | 5 |

### 28. image-to3d-resin-border — Imagem para 3D - Bordas para Resina (dinâmico)
> Silhueta com bordas altas para preenchimento com resina colorida.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 60 | 20 | 150 | 5 |
| Wall_Margin | number | 3 | 1 | 10 | 0.5 |
| Base_Thickness | number | 2 | 1 | 6 | 0.5 |
| Fill_Height | number | 1.5 | 0.5 | 5 | 0.5 |
| Wall_Height | number | 4 | 2 | 10 | 0.5 |
| Threshold | number | 128 | 10 | 245 | 5 |

**Export:** 1 STL (`image-3d-resin`)

---

### 29. sunken-image-coloring-offset — Imagem Afundada com Offset (dinâmico)
> Silhueta entalhada em placa com bordas offset multi-cor.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 60 | 20 | 150 | 5 |
| Frame_Margin | number | 3 | 1 | 15 | 0.5 |
| Layers | number | 3 | 1 | 5 | 1 |
| Layer_Height | number | 1.5 | 0.5 | 5 | 0.5 |
| Offset_Step | number | 2 | 0.5 | 6 | 0.5 |
| Carve_Depth | number | 1.5 | 0.5 | 4 | 0.5 |
| Threshold | number | 128 | 10 | 245 | 5 |

**Export:** 1 STL (`sunken-image-offset`)

---

### 30. name-side-bookmark — Marcador de Livro (dinâmico)
> Marcador de página com nome e imagem personalizada.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Name | string | `Maria` | - | - | - |
| Font | select | `Bebas Neue` | - | - | - |
| Name_Size | number | 8 | 4 | 16 | 1 |
| Name_Depth | number | 1 | 0.5 | 2 | 0.5 |
| Size | number | 40 | 20 | 80 | 5 |
| Bookmark_Width | number | 25 | 15 | 50 | 5 |
| Bookmark_Length | number | 80 | 40 | 150 | 10 |
| Thickness | number | 2 | 1 | 4 | 0.5 |
| Clip_Length | number | 15 | 8 | 30 | 5 |
| Page_Thickness | number | 1.5 | 0.5 | 3 | 0.5 |
| Threshold | number | 128 | 10 | 245 | 5 |

**Export:** 1 STL (`bookmark`)

---

### 31. image-puzzle — Quebra-cabeça de Imagem (dinâmico)
> Quebra-cabeça personalizado a partir de qualquer silhueta.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 80 | 30 | 200 | 5 |
| Cols | number | 3 | 2 | 6 | 1 |
| Rows | number | 3 | 2 | 6 | 1 |
| Thickness | number | 4 | 2 | 8 | 0.5 |
| Cut_Width | number | 0.5 | 0.3 | 1.5 | 0.1 |
| Frame_Width | number | 3 | 1 | 8 | 0.5 |
| Frame_Height | number | 6 | 3 | 12 | 1 |
| Threshold | number | 128 | 10 | 245 | 5 |

**Export:** Peças (`puzzle-pieces`), Moldura (`puzzle-frame`)

---

### 32. image-multipart — Imagem Multipartes (dinâmico)
> Silhueta dividida em partes para impressão multi-cor.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 80 | 30 | 200 | 5 |
| Thickness | number | 4 | 2 | 8 | 0.5 |
| Parts | number | 3 | 2 | 6 | 1 |
| Direction | select | `horizontal` | - | - | - |
| Tolerance | number | 0.3 | 0 | 1 | 0.1 |
| Threshold | number | 128 | 10 | 245 | 5 |

**Export:** Part_1 (`multipart-1`), Part_2 (`multipart-2`), Part_3 (`multipart-3`), Part_4 (`multipart-4`), Part_5 (`multipart-5`), Part_6 (`multipart-6`)

---

### 33. bowl-anything — Cumbuca a partir de Imagem (dinâmico)
> Tigela personalizada com formato de qualquer silhueta.

| Parâmetro | Tipo | Default | Min | Max | Step |
|-----------|------|---------|-----|-----|------|
| Image | image | (vazio) | - | - | - |
| Size | number | 80 | 30 | 200 | 5 |
| Bowl_Height | number | 40 | 15 | 80 | 5 |
| Base_Scale | number | 40 | 10 | 80 | 5 |
| Wall_Thickness | number | 2.5 | 1 | 5 | 0.5 |
| Slices | number | 8 | 4 | 20 | 1 |
| Threshold | number | 128 | 10 | 245 | 5 |

**Export:** 1 STL (`bowl`)

---

## Referência: Mafagrafos (site original)

### Modelos adicionais encontrados no MakerWorld (não implementados no Taglia)

| Modelo | Categoria | Descrição |
|--------|-----------|-----------|
| PIX QRCode Generator | Signs | Placa de pagamento Pix personalizada |
| Customizable Snowflake Ornament | Decoração | Ornamento de Natal personalizado |
| Customizable Toothpick Container | Tools | Porta-palitos paramétrico |
| Bluey House | Decoração | Casa da Bluey |
| Kit Cortadores Halloween | Kitchen | Cortadores temáticos |
| Ornamento Árvore com Nome | Decoração | Decoração de Natal com nome |
| Chaveiro Swift/Xcode | Keychains | Chaveiros temáticos de programação |

### Dados do Mafagrafos

- **Criadora:** Aline Borges (Curitiba-PR)
- **MakerWorld:** 96 modelos, 4.4k+ seguidores
- **Planos:** Free (5 créditos), Basic R$42/mês (35 créditos), Pro R$69/mês (65 créditos)
- **Idiomas:** PT, EN, ES
- **Licença comercial:** Inclusa nos planos pagos

> **Nota:** O site mafagrafos.com é uma SPA que não permite scraping de conteúdo renderizado. As imagens de referência dos modelos individuais não puderam ser coletadas automaticamente. Para comparação visual, acesse https://3d.mafagrafos.com diretamente.
