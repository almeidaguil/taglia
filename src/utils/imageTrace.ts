/**
 * imageTrace.ts
 * Pipeline: imagem (data URL) → potrace SVG → polygon points → código OpenSCAD
 *
 * Lições aprendidas:
 * - Potrace gera retângulo delimitador quando pixels pretos tocam a borda → padding + filtro de área
 * - Remoção de fundo via flood fill a partir das bordas da imagem
 * - Even-odd correto no OpenSCAD requer agrupamento por nível de aninhamento (point-in-polygon)
 * - Todos os subpaths devem usar o mesmo transform global (bounding box de all.points)
 * - Estrutura correta de relevo: union(diff(L0,L1), diff(L2,L3), ...)
 */
import { potrace, init } from 'esm-potrace-wasm'

let initialized = false

async function ensureInit() {
  if (!initialized) {
    await init()
    initialized = true
  }
}

// ─── Bézier samplers ─────────────────────────────────────────────────────────

function sampleCubic(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  steps = 12,
): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 1; i <= steps; i++) {
    const t = i / steps,
      mt = 1 - t
    pts.push([
      mt * mt * mt * p0[0] +
        3 * mt * mt * t * p1[0] +
        3 * mt * t * t * p2[0] +
        t * t * t * p3[0],
      mt * mt * mt * p0[1] +
        3 * mt * mt * t * p1[1] +
        3 * mt * t * t * p2[1] +
        t * t * t * p3[1],
    ])
  }
  return pts
}

function sampleQuad(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  steps = 12,
): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 1; i <= steps; i++) {
    const t = i / steps,
      mt = 1 - t
    pts.push([
      mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
      mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
    ])
  }
  return pts
}

// ─── SVG path parser ──────────────────────────────────────────────────────────

/**
 * Converte o atributo `d` de um path SVG em subpaths de pontos [x,y].
 * Suporta M,L,H,V,C,S,Q,T,Z (maiúsculas=absoluto, minúsculas=relativo).
 */
function parsePathD(d: string): Array<Array<[number, number]>> {
  const tokens =
    d
      .trim()
      .match(/[MmLlHhVvCcSsQqTtZz]|[+-]?[0-9]*\.?[0-9]+(?:e[+-]?[0-9]+)?/gi) ??
    []
  const subPaths: Array<Array<[number, number]>> = []
  let cur: Array<[number, number]> = []
  let cx = 0,
    cy = 0,
    sx = 0,
    sy = 0
  let prevCtrl: [number, number] | null = null
  let i = 0

  const rn = () => Number(tokens[i++])
  const rel = (abs: boolean, dx: number, dy: number): [number, number] =>
    abs ? [dx, dy] : [cx + dx, cy + dy]
  const hasNum = () => i < tokens.length && !/[A-Za-z]/.test(tokens[i])

  while (i < tokens.length) {
    const cmd = tokens[i++]
    if (!/[A-Za-z]/.test(cmd)) {
      i--
      continue
    }
    const abs = cmd === cmd.toUpperCase()
    const C = cmd.toUpperCase()

    if (C === 'M') {
      if (cur.length > 0) {
        subPaths.push(cur)
        cur = []
      }
      const [x, y] = rel(abs, rn(), rn())
      ;[cx, cy] = [x, y]
      ;[sx, sy] = [x, y]
      cur.push([cx, cy])
      while (hasNum()) {
        const [nx, ny] = rel(abs, rn(), rn())
        cur.push([nx, ny])
        ;[cx, cy] = [nx, ny]
      }
      prevCtrl = null
    } else if (C === 'L') {
      while (hasNum()) {
        const [nx, ny] = rel(abs, rn(), rn())
        cur.push([nx, ny])
        ;[cx, cy] = [nx, ny]
      }
      prevCtrl = null
    } else if (C === 'H') {
      while (hasNum()) {
        cx = abs ? rn() : cx + rn()
        cur.push([cx, cy])
      }
      prevCtrl = null
    } else if (C === 'V') {
      while (hasNum()) {
        cy = abs ? rn() : cy + rn()
        cur.push([cx, cy])
      }
      prevCtrl = null
    } else if (C === 'C') {
      while (hasNum()) {
        const p1 = rel(abs, rn(), rn())
        const p2 = rel(abs, rn(), rn())
        const p3 = rel(abs, rn(), rn())
        cur.push(...sampleCubic([cx, cy], p1, p2, p3))
        prevCtrl = p2
        ;[cx, cy] = p3
      }
    } else if (C === 'S') {
      while (hasNum()) {
        const p1: [number, number] = prevCtrl
          ? [2 * cx - prevCtrl[0], 2 * cy - prevCtrl[1]]
          : [cx, cy]
        const p2 = rel(abs, rn(), rn())
        const p3 = rel(abs, rn(), rn())
        cur.push(...sampleCubic([cx, cy], p1, p2, p3))
        prevCtrl = p2
        ;[cx, cy] = p3
      }
    } else if (C === 'Q') {
      while (hasNum()) {
        const p1 = rel(abs, rn(), rn())
        const p2 = rel(abs, rn(), rn())
        cur.push(...sampleQuad([cx, cy], p1, p2))
        prevCtrl = p1
        ;[cx, cy] = p2
      }
    } else if (C === 'T') {
      while (hasNum()) {
        const p1: [number, number] = prevCtrl
          ? [2 * cx - prevCtrl[0], 2 * cy - prevCtrl[1]]
          : [cx, cy]
        const p2 = rel(abs, rn(), rn())
        cur.push(...sampleQuad([cx, cy], p1, p2))
        prevCtrl = p1
        ;[cx, cy] = p2
      }
    } else if (C === 'Z') {
      if (cur.length > 0) {
        subPaths.push(cur)
        cur = []
      }
      ;[cx, cy] = [sx, sy]
      prevCtrl = null
    }

    if (!['C', 'S', 'Q', 'T'].includes(C)) prevCtrl = null
  }
  if (cur.length > 0) subPaths.push(cur)
  return subPaths
}

// ─── Geometria ────────────────────────────────────────────────────────────────

/** Área de polígono pelo método shoelace */
function polygonArea(pts: Array<[number, number]>): number {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]
  }
  return Math.abs(a) / 2
}

/** Testa se um ponto está dentro de um polígono (ray-casting) */
function pointInPolygon(
  pt: [number, number],
  poly: Array<[number, number]>,
): boolean {
  const [px, py] = pt
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i],
      [xj, yj] = poly[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside
  }
  return inside
}

/**
 * Conta quantos outros paths contêm o centroide deste path.
 * Nível 0 = externo (sólido), 1 = buraco, 2 = sólido interno, etc.
 *
 * Usa centroide em vez do primeiro ponto para evitar falsos positivos:
 * potrace gera bordas adjacentes cujo primeiro ponto fica exatamente sobre
 * a borda de outro path, fazendo o ray-casting retornar resultado errado.
 */
function nestingLevel(
  idx: number,
  paths: Array<Array<[number, number]>>,
): number {
  const path = paths[idx]
  const cx = path.reduce((s, [x]) => s + x, 0) / path.length
  const cy = path.reduce((s, [, y]) => s + y, 0) / path.length
  let level = 0
  for (let i = 0; i < paths.length; i++) {
    if (i !== idx && pointInPolygon([cx, cy], paths[i])) level++
  }
  return level
}

// ─── Remoção de fundo ─────────────────────────────────────────────────────────

/**
 * Flood fill a partir de todas as bordas. Pixels conectados às bordas com cor
 * similar ao fundo (amostrado nos 4 cantos) viram branco (255).
 */
function removeBackground(
  gray: Uint8Array,
  w: number,
  h: number,
  tolerance = 28,
): void {
  const corners = [0, w - 1, (h - 1) * w, h * w - 1]
  const bgGray = corners.reduce((s, c) => s + gray[c], 0) / 4
  const isBg = (px: number) => Math.abs(gray[px] - bgGray) <= tolerance
  const visited = new Uint8Array(w * h)
  const stack: number[] = []

  const push = (px: number) => {
    if (px >= 0 && px < w * h && !visited[px] && isBg(px)) {
      visited[px] = 1
      stack.push(px)
    }
  }
  for (let x = 0; x < w; x++) {
    push(x)
    push((h - 1) * w + x)
  }
  for (let y = 1; y < h - 1; y++) {
    push(y * w)
    push(y * w + w - 1)
  }

  while (stack.length > 0) {
    const px = stack.pop()!
    gray[px] = 255
    const x = px % w,
      y = Math.floor(px / w)
    if (x > 0) push(px - 1)
    if (x < w - 1) push(px + 1)
    if (y > 0) push(px - w)
    if (y < h - 1) push(px + w)
  }
}

// ─── Parse SVG → subpaths por nível ──────────────────────────────────────────

interface ParsedPaths {
  points: Array<[number, number]>
  paths: number[][]
}

interface SvgParseResult {
  /** Contorno externo (maior área) — para cookie cutter */
  outer: ParsedPaths
  /** Todos os paths concatenados */
  all: ParsedPaths
  /**
   * Paths agrupados por nível de aninhamento even-odd:
   * byLevel[0] = externos (sólidos), byLevel[1] = buracos, byLevel[2] = sólidos internos, ...
   * Usado para: union(diff(L0,L1), diff(L2,L3), ...)
   */
  byLevel: Array<Array<Array<[number, number]>>>
}

function parseSvgToPaths(svgString: string): SvgParseResult {
  const svgW = parseFloat(svgString.match(/width="([^"]+)"/)?.[1] ?? '0')
  const svgH = parseFloat(svgString.match(/height="([^"]+)"/)?.[1] ?? '0')
  const canvasArea = svgW * svgH

  // Extrai transform do grupo <g> do potrace
  let tx = 0,
    ty = 0,
    scaleX = 1,
    scaleY = 1
  const tm = svgString.match(/transform="([^"]+)"/)
  if (tm) {
    const t = tm[1]
    const tr = t.match(/translate\(\s*([^,)]+)(?:,\s*([^)]+))?\s*\)/)
    const sc = t.match(/scale\(\s*([^,)]+)(?:,\s*([^)]+))?\s*\)/)
    if (tr) {
      tx = parseFloat(tr[1])
      ty = parseFloat(tr[2] ?? '0')
    }
    if (sc) {
      scaleX = parseFloat(sc[1])
      scaleY = parseFloat(sc[2] ?? sc[1])
    }
  }

  // Coleta todos os subpaths com transform aplicado
  const raw: Array<Array<[number, number]>> = []
  const pathRe = /\sd="([^"]+)"/g
  let m: RegExpExecArray | null
  while ((m = pathRe.exec(svgString)) !== null) {
    for (const sub of parsePathD(m[1])) {
      if (sub.length < 3) continue
      raw.push(sub.map(([x, y]) => [tx + x * scaleX, ty + y * scaleY]))
    }
  }

  const empty: ParsedPaths = { points: [], paths: [] }
  if (raw.length === 0) return { outer: empty, all: empty, byLevel: [] }

  // Descarta retângulo de fundo (área ≥ 90% do canvas) que potrace gera quando
  // pixels pretos tocam a borda — resolvido também pelo padding branco de 8px
  const withArea = raw.map((sub) => ({ sub, area: polygonArea(sub) }))
  const maxAllowed = canvasArea > 0 ? canvasArea * 0.9 : Infinity
  const candidates = withArea.filter(({ area }) => area < maxAllowed)
  const filtered = candidates.length > 0 ? candidates : withArea

  console.log(
    `[imageTrace] subpaths: ${raw.length} total, ${filtered.length} após filtro de fundo`,
    `(canvasArea=${canvasArea.toFixed(0)}, maior area=${Math.max(...withArea.map((x) => x.area)).toFixed(0)})`,
  )

  // Contorno externo = path de maior área
  const outerEntry = filtered.reduce((best, cur) =>
    cur.area > best.area ? cur : best,
  )
  const outer: ParsedPaths = {
    points: [...outerEntry.sub],
    paths: [outerEntry.sub.map((_, i) => i)],
  }

  // Todos os paths concatenados (para subpathsScad)
  const allPoints: Array<[number, number]> = []
  const allPaths: number[][] = []
  for (const { sub } of filtered) {
    const start = allPoints.length
    allPoints.push(...sub)
    allPaths.push(sub.map((_, i) => start + i))
  }
  const all: ParsedPaths = { points: allPoints, paths: allPaths }

  // Agrupa por nível de aninhamento (point-in-polygon)
  const subs = filtered.map((c) => c.sub)
  const byLevel: Array<Array<Array<[number, number]>>> = []
  for (let i = 0; i < subs.length; i++) {
    const lvl = nestingLevel(i, subs)
    if (!byLevel[lvl]) byLevel[lvl] = []
    byLevel[lvl].push(subs[i])
  }

  console.log(
    `[imageTrace] níveis: ${byLevel.map((l, i) => `L${i}:${l.length}`).join(' ')}`,
  )

  return { outer, all, byLevel }
}

// ─── API pública ──────────────────────────────────────────────────────────────

export interface TraceResult {
  /** Contorno externo apenas — para cookie cutter */
  pointsStr: string
  pathsStr: string
  /** Todos os paths — para relevos sem even-odd */
  allPointsStr: string
  allPathsStr: string
  /** Todos os subpaths como polygon() SCAD */
  subpathsScad: string[]
  /**
   * Paths agrupados por nível de aninhamento como polygon() SCAD.
   * subpathsByLevel[0] = externos, [1] = buracos, [2] = sólidos internos, ...
   * Use para even-odd correto: union(diff(L0,L1), diff(L2,L3), ...)
   */
  subpathsByLevel: string[][]
  pointCount: number
  pathCount: number
}

export async function traceImageToScadPolygon(
  dataUrl: string,
  targetMm: number,
  threshold = 128,
): Promise<TraceResult> {
  console.log('[imageTrace] iniciando pipeline')
  await ensureInit()

  // 1. Carrega imagem e limita a 1024px
  const img = await loadImage(dataUrl)
  const MAX_PX = 1024
  const scaleFactor = Math.min(
    1,
    MAX_PX / Math.max(img.naturalWidth, img.naturalHeight),
  )
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scaleFactor)
  canvas.height = Math.round(img.naturalHeight * scaleFactor)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const w = canvas.width,
    h = canvas.height

  // 2. Converte para escala de cinza
  const gray = new Uint8Array(w * h)
  for (let i = 0; i < gray.length; i++) {
    gray[i] = Math.round(
      0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2],
    )
  }

  // 3. Remove fundo via flood fill
  removeBackground(gray, w, h)

  // 4. Aplica threshold e reconverte para B&W
  for (let i = 0; i < gray.length; i++) {
    const bw = gray[i] >= threshold ? 255 : 0
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = bw
    data[i * 4 + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)

  // 5. Adiciona padding branco de 8px para evitar que o potrace gere retângulo de fundo
  const PAD = 8
  const padded = document.createElement('canvas')
  padded.width = canvas.width + PAD * 2
  padded.height = canvas.height + PAD * 2
  const pCtx = padded.getContext('2d')!
  pCtx.fillStyle = '#ffffff'
  pCtx.fillRect(0, 0, padded.width, padded.height)
  pCtx.drawImage(canvas, PAD, PAD)

  // 6. Potrace → SVG
  const svgString = await potrace(padded, {
    turdsize: 4,
    optcurve: true,
    opttolerance: 0.3,
  })
  console.log('[imageTrace] SVG (400 chars):', svgString.substring(0, 400))

  // 7. Parse SVG paths com agrupamento por nível
  const { outer, all, byLevel } = parseSvgToPaths(svgString)

  if (outer.points.length === 0) {
    throw new Error(
      'Nenhum contorno encontrado na imagem. Tente aumentar o contraste.',
    )
  }

  // 8. Calcula transform global (bounding box de all.points) e aplica a todos os subpaths
  //    Usar o mesmo transform garante que sólidos e buracos fiquem alinhados
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity
  for (const [x, y] of all.points) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const gScale = targetMm / Math.max(maxX - minX, maxY - minY)
  const gCx = (minX + maxX) / 2,
    gCy = (minY + maxY) / 2
  // Inverte Y: SVG cresce para baixo, OpenSCAD cresce para cima
  const tf = (pts: Array<[number, number]>): Array<[number, number]> =>
    pts.map(([x, y]) => [(x - gCx) * gScale, -(y - gCy) * gScale])

  const fmt = (pts: Array<[number, number]>) =>
    '[' +
    pts.map(([x, y]) => `[${x.toFixed(3)},${y.toFixed(3)}]`).join(',') +
    ']'
  const fmtPaths = (paths: number[][]) =>
    '[' + paths.map((p) => '[' + p.join(',') + ']').join(',') + ']'
  const toScad = (pts: Array<[number, number]>) => {
    const pStr =
      '[' +
      pts.map(([x, y]) => `[${x.toFixed(3)},${y.toFixed(3)}]`).join(',') +
      ']'
    const iStr = '[[' + pts.map((_, k) => k).join(',') + ']]'
    return `polygon(points=${pStr}, paths=${iStr}, convexity=10)`
  }

  const scaledOuter = tf(outer.points)
  const scaledAll = tf(all.points)

  const subpathsScad = all.paths.map((idxList) =>
    toScad(idxList.map((i) => scaledAll[i])),
  )
  const subpathsByLevel = byLevel.map((lvlPaths) =>
    lvlPaths.map((sub) => toScad(tf(sub))),
  )

  // A inversão de Y em `tf` reverte o winding (CW↔CCW) de todos os paths.
  // Para o polygon() multi-path do OpenSCAD (onde CCW=sólido, CW=buraco),
  // precisamos reverter os índices de cada path para restaurar o winding correto.
  // Potrace gera outer=CW-na-tela-SVG → Y-flip → CCW-math → reversed → CCW = sólido ✓
  //                   inner=CCW-na-tela-SVG → Y-flip → CW-math → reversed → CW = buraco ✓
  const allPathsWindingFixed = all.paths.map((p) => [...p].reverse())

  return {
    pointsStr: fmt(scaledOuter),
    pathsStr: fmtPaths(outer.paths),
    allPointsStr: fmt(scaledAll),
    allPathsStr: fmtPaths(allPathsWindingFixed),
    subpathsScad,
    subpathsByLevel,
    pointCount: scaledOuter.length,
    pathCount: all.paths.length,
  }
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}
