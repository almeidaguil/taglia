/**
 * imageTrace.ts
 * Pipeline: imagem (data URL) -> potrace SVG -> polygon points -> codigo OpenSCAD
 */
import { potrace, init } from 'esm-potrace-wasm'

let initialized = false

async function ensureInit() {
  if (!initialized) {
    await init()
    initialized = true
  }
}

// --- Bezier samplers ---

type Pt = [number, number]

interface CubicParams {
  p0: Pt
  p1: Pt
  p2: Pt
  p3: Pt
}

function sampleCubic({ p0, p1, p2, p3 }: CubicParams, steps = 12): Array<Pt> {
  const pts: Array<Pt> = []
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

function sampleQuad(p0: Pt, p1: Pt, p2: Pt, steps = 12): Array<Pt> {
  const pts: Array<Pt> = []
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

// --- SVG path parser ---

interface PathState {
  tokens: string[]
  i: number
  cx: number
  cy: number
  sx: number
  sy: number
  prevCtrl: Pt | null
  cur: Array<Pt>
  subPaths: Array<Array<Pt>>
}

function psRn(s: PathState): number {
  return Number(s.tokens[s.i++])
}

function psRel(s: PathState, abs: boolean, dx: number, dy: number): Pt {
  return abs ? [dx, dy] : [s.cx + dx, s.cy + dy]
}

function psHasNum(s: PathState): boolean {
  return s.i < s.tokens.length && !/[A-Za-z]/.test(s.tokens[s.i])
}

function handleMove(s: PathState, abs: boolean) {
  if (s.cur.length > 0) {
    s.subPaths.push(s.cur)
    s.cur = []
  }
  const [x, y] = psRel(s, abs, psRn(s), psRn(s))
  ;[s.cx, s.cy] = [x, y]
  ;[s.sx, s.sy] = [x, y]
  s.cur.push([s.cx, s.cy])
  while (psHasNum(s)) {
    const [nx, ny] = psRel(s, abs, psRn(s), psRn(s))
    s.cur.push([nx, ny])
    ;[s.cx, s.cy] = [nx, ny]
  }
  s.prevCtrl = null
}

function handleLine(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    const [nx, ny] = psRel(s, abs, psRn(s), psRn(s))
    s.cur.push([nx, ny])
    ;[s.cx, s.cy] = [nx, ny]
  }
  s.prevCtrl = null
}

function handleH(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    s.cx = abs ? psRn(s) : s.cx + psRn(s)
    s.cur.push([s.cx, s.cy])
  }
  s.prevCtrl = null
}

function handleV(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    s.cy = abs ? psRn(s) : s.cy + psRn(s)
    s.cur.push([s.cx, s.cy])
  }
  s.prevCtrl = null
}

function reflectCtrl(s: PathState): Pt {
  return s.prevCtrl
    ? [2 * s.cx - s.prevCtrl[0], 2 * s.cy - s.prevCtrl[1]]
    : [s.cx, s.cy]
}

function handleCubic(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    const p1 = psRel(s, abs, psRn(s), psRn(s))
    const p2 = psRel(s, abs, psRn(s), psRn(s))
    const p3 = psRel(s, abs, psRn(s), psRn(s))
    s.cur.push(...sampleCubic({ p0: [s.cx, s.cy], p1, p2, p3 }))
    s.prevCtrl = p2
    ;[s.cx, s.cy] = p3
  }
}

function handleSmoothCubic(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    const p1 = reflectCtrl(s)
    const p2 = psRel(s, abs, psRn(s), psRn(s))
    const p3 = psRel(s, abs, psRn(s), psRn(s))
    s.cur.push(...sampleCubic({ p0: [s.cx, s.cy], p1, p2, p3 }))
    s.prevCtrl = p2
    ;[s.cx, s.cy] = p3
  }
}

function handleQuad(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    const p1 = psRel(s, abs, psRn(s), psRn(s))
    const p2 = psRel(s, abs, psRn(s), psRn(s))
    s.cur.push(...sampleQuad([s.cx, s.cy], p1, p2))
    s.prevCtrl = p1
    ;[s.cx, s.cy] = p2
  }
}

function handleSmoothQuad(s: PathState, abs: boolean) {
  while (psHasNum(s)) {
    const p1 = reflectCtrl(s)
    const p2 = psRel(s, abs, psRn(s), psRn(s))
    s.cur.push(...sampleQuad([s.cx, s.cy], p1, p2))
    s.prevCtrl = p1
    ;[s.cx, s.cy] = p2
  }
}

function handleClose(s: PathState) {
  if (s.cur.length > 0) {
    s.subPaths.push(s.cur)
    s.cur = []
  }
  ;[s.cx, s.cy] = [s.sx, s.sy]
  s.prevCtrl = null
}

const CMD_HANDLERS: Record<string, (s: PathState, abs: boolean) => void> = {
  M: handleMove,
  L: handleLine,
  H: handleH,
  V: handleV,
  C: handleCubic,
  S: handleSmoothCubic,
  Q: handleQuad,
  T: handleSmoothQuad,
  Z: handleClose,
}

function parsePathD(d: string): Array<Array<Pt>> {
  const tokens =
    d
      .trim()
      .match(/[MmLlHhVvCcSsQqTtZz]|[+-]?[0-9]*\.?[0-9]+(?:e[+-]?[0-9]+)?/gi) ??
    []
  const s: PathState = {
    tokens,
    i: 0,
    cx: 0,
    cy: 0,
    sx: 0,
    sy: 0,
    prevCtrl: null,
    cur: [],
    subPaths: [],
  }

  while (s.i < tokens.length) {
    const cmd = tokens[s.i++]
    if (!/[A-Za-z]/.test(cmd)) {
      s.i--
      continue
    }
    const abs = cmd === cmd.toUpperCase()
    const C = cmd.toUpperCase()
    const handler = CMD_HANDLERS[C]
    if (handler) handler(s, abs)
    if (!['C', 'S', 'Q', 'T'].includes(C)) s.prevCtrl = null
  }
  if (s.cur.length > 0) s.subPaths.push(s.cur)
  return s.subPaths
}

// --- Geometria ---

function polygonArea(pts: Array<Pt>): number {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]
  }
  return Math.abs(a) / 2
}

function pointInPolygon(pt: Pt, poly: Array<Pt>): boolean {
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

function nestingLevel(idx: number, paths: Array<Array<Pt>>): number {
  const path = paths[idx]
  const cx = path.reduce((s, [x]) => s + x, 0) / path.length
  const cy = path.reduce((s, [, y]) => s + y, 0) / path.length
  let level = 0
  for (let i = 0; i < paths.length; i++) {
    if (i !== idx && pointInPolygon([cx, cy], paths[i])) level++
  }
  return level
}

// --- Remocao de fundo ---

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

// --- Parse SVG -> subpaths por nivel ---

interface ParsedPaths {
  points: Array<Pt>
  paths: number[][]
}

interface SvgParseResult {
  outer: ParsedPaths
  all: ParsedPaths
  byLevel: Array<Array<Array<Pt>>>
}

interface SvgTransform {
  tx: number
  ty: number
  scaleX: number
  scaleY: number
}

function extractSvgTransform(svgString: string): SvgTransform {
  const result: SvgTransform = {
    tx: 0,
    ty: 0,
    scaleX: 1,
    scaleY: 1,
  }
  const tm = svgString.match(/transform="([^"]+)"/)
  if (!tm) return result
  const t = tm[1]
  const tr = t.match(/translate\(\s*([^,)]+)(?:,\s*([^)]+))?\s*\)/)
  const sc = t.match(/scale\(\s*([^,)]+)(?:,\s*([^)]+))?\s*\)/)
  if (tr) {
    result.tx = parseFloat(tr[1])
    result.ty = parseFloat(tr[2] ?? '0')
  }
  if (sc) {
    result.scaleX = parseFloat(sc[1])
    result.scaleY = parseFloat(sc[2] ?? sc[1])
  }
  return result
}

function extractRawSubpaths(
  svgString: string,
  tf: SvgTransform,
): Array<Array<Pt>> {
  const raw: Array<Array<Pt>> = []
  const pathRe = /\sd="([^"]+)"/g
  let m: RegExpExecArray | null
  while ((m = pathRe.exec(svgString)) !== null) {
    for (const sub of parsePathD(m[1])) {
      if (sub.length < 3) continue
      raw.push(
        sub.map(([x, y]) => [tf.tx + x * tf.scaleX, tf.ty + y * tf.scaleY]),
      )
    }
  }
  return raw
}

function filterBackground(
  raw: Array<Array<Pt>>,
  canvasArea: number,
): Array<{ sub: Array<Pt>; area: number }> {
  const withArea = raw.map((sub) => ({
    sub,
    area: polygonArea(sub),
  }))
  const maxAllowed = canvasArea > 0 ? canvasArea * 0.9 : Infinity
  const candidates = withArea.filter(({ area }) => area < maxAllowed)
  const filtered = candidates.length > 0 ? candidates : withArea
  console.log(
    `[imageTrace] subpaths: ${raw.length} total, ${filtered.length} apos filtro de fundo`,
    `(canvasArea=${canvasArea.toFixed(0)}, maior area=${Math.max(...withArea.map((x) => x.area)).toFixed(0)})`,
  )
  return filtered
}

function buildAllPaths(
  filtered: Array<{ sub: Array<Pt>; area: number }>,
): ParsedPaths {
  const allPoints: Array<Pt> = []
  const allPaths: number[][] = []
  for (const { sub } of filtered) {
    const start = allPoints.length
    allPoints.push(...sub)
    allPaths.push(sub.map((_, i) => start + i))
  }
  return { points: allPoints, paths: allPaths }
}

function groupByNesting(
  filtered: Array<{ sub: Array<Pt> }>,
): Array<Array<Array<Pt>>> {
  const subs = filtered.map((c) => c.sub)
  const byLevel: Array<Array<Array<Pt>>> = []
  for (let i = 0; i < subs.length; i++) {
    const lvl = nestingLevel(i, subs)
    if (!byLevel[lvl]) byLevel[lvl] = []
    byLevel[lvl].push(subs[i])
  }
  console.log(
    `[imageTrace] niveis: ${byLevel.map((l, i) => `L${i}:${l.length}`).join(' ')}`,
  )
  return byLevel
}

function parseSvgToPaths(svgString: string): SvgParseResult {
  const svgW = parseFloat(svgString.match(/width="([^"]+)"/)?.[1] ?? '0')
  const svgH = parseFloat(svgString.match(/height="([^"]+)"/)?.[1] ?? '0')
  const tf = extractSvgTransform(svgString)
  const raw = extractRawSubpaths(svgString, tf)
  const empty: ParsedPaths = { points: [], paths: [] }
  if (raw.length === 0) return { outer: empty, all: empty, byLevel: [] }

  const filtered = filterBackground(raw, svgW * svgH)
  const outerEntry = filtered.reduce((best, cur) =>
    cur.area > best.area ? cur : best,
  )
  const outer: ParsedPaths = {
    points: [...outerEntry.sub],
    paths: [outerEntry.sub.map((_, i) => i)],
  }

  return {
    outer,
    all: buildAllPaths(filtered),
    byLevel: groupByNesting(filtered),
  }
}

// --- API publica ---

export interface TraceResult {
  pointsStr: string
  pathsStr: string
  allPointsStr: string
  allPathsStr: string
  subpathsScad: string[]
  subpathsByLevel: string[][]
  pointCount: number
  pathCount: number
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

function prepareCanvas(img: HTMLImageElement): HTMLCanvasElement {
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
  return canvas
}

function binarizeCanvas(canvas: HTMLCanvasElement, threshold: number): void {
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const w = canvas.width,
    h = canvas.height
  const gray = new Uint8Array(w * h)
  for (let i = 0; i < gray.length; i++) {
    gray[i] = Math.round(
      0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2],
    )
  }
  removeBackground(gray, w, h)
  for (let i = 0; i < gray.length; i++) {
    const bw = gray[i] >= threshold ? 255 : 0
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = bw
    data[i * 4 + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

function addPadding(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const PAD = 8
  const padded = document.createElement('canvas')
  padded.width = canvas.width + PAD * 2
  padded.height = canvas.height + PAD * 2
  const pCtx = padded.getContext('2d')!
  pCtx.fillStyle = '#ffffff'
  pCtx.fillRect(0, 0, padded.width, padded.height)
  pCtx.drawImage(canvas, PAD, PAD)
  return padded
}

interface BBox {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

function computeBBox(points: Array<Pt>): BBox {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity
  for (const [x, y] of points) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minX, maxX, minY, maxY }
}

function makeScaledTransform(
  bbox: BBox,
  targetMm: number,
): (pts: Array<Pt>) => Array<Pt> {
  const range = Math.max(bbox.maxX - bbox.minX, bbox.maxY - bbox.minY)
  const gScale = targetMm / range
  const gCx = (bbox.minX + bbox.maxX) / 2
  const gCy = (bbox.minY + bbox.maxY) / 2
  return (pts) => pts.map(([x, y]) => [(x - gCx) * gScale, -(y - gCy) * gScale])
}

function fmtPoints(pts: Array<Pt>): string {
  return (
    '[' +
    pts.map(([x, y]) => `[${x.toFixed(3)},${y.toFixed(3)}]`).join(',') +
    ']'
  )
}

function fmtIdxPaths(paths: number[][]): string {
  return '[' + paths.map((p) => '[' + p.join(',') + ']').join(',') + ']'
}

function toScadPolygon(pts: Array<Pt>): string {
  const pStr = fmtPoints(pts)
  const iStr = '[[' + pts.map((_, k) => k).join(',') + ']]'
  return `polygon(points=${pStr}, paths=${iStr}, convexity=10)`
}

function buildTraceResult(
  parsed: SvgParseResult,
  tf: (pts: Array<Pt>) => Array<Pt>,
): TraceResult {
  const { outer, all, byLevel } = parsed
  const scaledOuter = tf(outer.points)
  const scaledAll = tf(all.points)
  const subpathsScad = all.paths.map((idxList) =>
    toScadPolygon(idxList.map((i) => scaledAll[i])),
  )
  const subpathsByLevel = byLevel.map((lvlPaths) =>
    lvlPaths.map((sub) => toScadPolygon(tf(sub))),
  )
  const allPathsWindingFixed = all.paths.map((p) => [...p].reverse())
  return {
    pointsStr: fmtPoints(scaledOuter),
    pathsStr: fmtIdxPaths(outer.paths),
    allPointsStr: fmtPoints(scaledAll),
    allPathsStr: fmtIdxPaths(allPathsWindingFixed),
    subpathsScad,
    subpathsByLevel,
    pointCount: scaledOuter.length,
    pathCount: all.paths.length,
  }
}

export async function traceImageToScadPolygon(
  dataUrl: string,
  targetMm: number,
  threshold = 128,
): Promise<TraceResult> {
  console.log('[imageTrace] iniciando pipeline')
  await ensureInit()

  const img = await loadImage(dataUrl)
  const canvas = prepareCanvas(img)
  binarizeCanvas(canvas, threshold)
  const padded = addPadding(canvas)

  const svgString = await potrace(padded, {
    turdsize: 4,
    optcurve: true,
    opttolerance: 0.3,
  })
  console.log('[imageTrace] SVG (400 chars):', svgString.substring(0, 400))

  const parsed = parseSvgToPaths(svgString)
  if (parsed.outer.points.length === 0) {
    throw new Error(
      'Nenhum contorno encontrado na imagem. Tente aumentar o contraste.',
    )
  }

  const bbox = computeBBox(parsed.all.points)
  const tf = makeScaledTransform(bbox, targetMm)
  return buildTraceResult(parsed, tf)
}
