import { createOpenSCAD } from 'openscad-wasm'

const FONT_MAP: Record<string, string> = {
  'BebasNeue-Regular.ttf': 'Bebas Neue',
  'DancingScript-Regular.ttf': 'Dancing Script',
  'GreatVibes-Regular.ttf': 'Great Vibes',
  'Lobster-Regular.ttf': 'Lobster',
  'Montserrat-Regular.ttf': 'Montserrat',
  'Pacifico-Regular.ttf': 'Pacifico',
  'RobotoMono-Regular.ttf': 'Roboto Mono',
  'Sacramento-Regular.ttf': 'Sacramento',
}

const FONT_DIR = '/usr/share/fonts/truetype/google'

// Buffers de fontes cacheados após o primeiro fetch (browser também cacheia via HTTP)
let fontBuffersPromise: Promise<Map<string, Uint8Array>> | null = null

function getFontBuffers(): Promise<Map<string, Uint8Array>> {
  if (!fontBuffersPromise) {
    fontBuffersPromise = (async () => {
      const buffers = new Map<string, Uint8Array>()
      const results = await Promise.allSettled(
        Object.keys(FONT_MAP).map(async (filename) => {
          const url = new URL(`/fonts/${filename}`, self.location.origin).href
          const resp = await fetch(url)
          if (!resp.ok) throw new Error(`Font não encontrada: ${filename}`)
          const buf = await resp.arrayBuffer()
          buffers.set(filename, new Uint8Array(buf))
        })
      )
      const failed = results.filter((r) => r.status === 'rejected').length
      if (failed > 0) {
        console.warn(`[openscad] ${failed} fonte(s) não carregada(s) — usando fonte padrão`)
      }
      return buffers
    })()
  }
  return fontBuffersPromise
}

// Cria uma instância nova a cada render: callMain só pode ser chamado uma vez por instância
// (o runtime C++ interno corrompe estado após a primeira execução).
// Os buffers de fontes são cacheados em memória para que o VFS seja populado sem re-fetch.
async function createFreshInstance() {
  const [scad, fontBuffers] = await Promise.all([
    createOpenSCAD({
      print: (text: string) => console.log('[openscad]', text),
      printErr: (text: string) => console.warn('[openscad]', text),
    }),
    getFontBuffers(),
  ])

  const fs = scad.getInstance().FS

  // Emscripten inicia sem /usr — criar cada nível separadamente
  for (const dir of ['/usr', '/usr/share', '/usr/share/fonts', '/usr/share/fonts/truetype', FONT_DIR]) {
    try { fs.mkdir(dir) } catch { /* já existe */ }
  }
  try { fs.mkdir('/etc') } catch {}
  try { fs.mkdir('/etc/fonts') } catch {}
  try {
    fs.writeFile('/etc/fonts/fonts.conf', `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${FONT_DIR}</dir>
  <cachedir>/tmp/fc-cache</cachedir>
</fontconfig>`)
  } catch { /* sem fonts.conf — OpenSCAD usa fonte embutida */ }
  try { fs.mkdir('/tmp/fc-cache') } catch {}

  for (const [filename, buf] of fontBuffers) {
    try { fs.writeFile(`${FONT_DIR}/${filename}`, buf) } catch { /* ignora falha individual */ }
  }

  return scad
}

self.onmessage = async (e: MessageEvent) => {
  const { id, scadCode } = e.data

  try {
    self.postMessage({ id, status: 'rendering' })

    const scad = await createFreshInstance()
    const stlString = await scad.renderToStl(scadCode)

    if (!stlString || stlString.trim().length === 0) {
      throw new Error('OpenSCAD não produziu saída. Verifique o código SCAD.')
    }

    const encoder = new TextEncoder()
    const bytes = encoder.encode(stlString)
    const blob = new Blob([bytes], { type: 'model/stl' })
    self.postMessage({ id, status: 'done', blob, format: 'stl' })
  } catch (err) {
    const msg = err instanceof Error
      ? err.message
      : (typeof err === 'string' ? err : JSON.stringify(err))
    self.postMessage({ id, status: 'error', error: msg })
  }
}
