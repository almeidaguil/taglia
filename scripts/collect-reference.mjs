/**
 * collect-reference.mjs
 *
 * Coleta screenshots e dados dos modelos do mafagrafos.com usando Playwright.
 * O site é uma SPA — precisa de headless browser para renderizar o JavaScript.
 *
 * Uso:
 *   node scripts/collect-reference.mjs
 *
 * Saída:
 *   docs/screenshots/          — screenshots de cada modelo
 *   docs/reference-data.json   — dados coletados (modelos, parâmetros, etc.)
 */

import { chromium } from 'playwright'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const BASE_URL = 'https://www.mafagrafos.com'
const SCREENSHOT_DIR = join(import.meta.dirname, '..', 'docs', 'screenshots')
const DATA_FILE = join(import.meta.dirname, '..', 'docs', 'reference-data.json')

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  await mkdir(SCREENSHOT_DIR, { recursive: true })

  console.log('Lançando browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'pt-BR',
  })
  const page = await context.newPage()

  const collectedModels = []

  try {
    // 1. Acessar página principal / catálogo
    console.log('Acessando mafagrafos.com...')
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 })
    await delay(3000) // Aguarda SPA renderizar

    // Screenshot do catálogo
    await page.screenshot({ path: join(SCREENSHOT_DIR, '00-catalog.png'), fullPage: true })
    console.log('Screenshot do catálogo salvo')

    // 2. Tentar encontrar links de modelos
    // O site pode ter diferentes estruturas — tentamos vários seletores
    const modelLinks = await page.evaluate(() => {
      const links = []
      // Tenta encontrar cards/links de modelos
      const anchors = document.querySelectorAll('a[href*="/model"], a[href*="/generator"], a[href*="/customizer"]')
      anchors.forEach(a => {
        links.push({ href: a.href, text: a.textContent?.trim() || '' })
      })
      // Se não encontrou por href, tenta por cards genéricos
      if (links.length === 0) {
        document.querySelectorAll('[class*="card"], [class*="model"], [class*="item"]').forEach(el => {
          const a = el.querySelector('a') || el.closest('a')
          if (a) links.push({ href: a.href, text: el.textContent?.trim().substring(0, 100) || '' })
        })
      }
      // Último recurso: pega todos os links internos
      if (links.length === 0) {
        document.querySelectorAll('a').forEach(a => {
          if (a.href.includes('mafagrafos') && !a.href.includes('mailto') && !a.href.includes('#')) {
            links.push({ href: a.href, text: a.textContent?.trim().substring(0, 100) || '' })
          }
        })
      }
      return links
    })

    console.log(`Encontrados ${modelLinks.length} links no catálogo`)

    // 3. Também tenta a rota /pt/models ou /models
    for (const route of ['/pt/', '/en/', '/models', '/pt/models']) {
      try {
        console.log(`Tentando ${BASE_URL}${route}...`)
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 15000 })
        await delay(3000)

        const routeScreenshot = route.replace(/\//g, '-').replace(/^-|-$/g, '') || 'root'
        await page.screenshot({ path: join(SCREENSHOT_DIR, `00-${routeScreenshot}.png`), fullPage: true })

        // Coleta mais links
        const moreLinks = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a')).map(a => ({
            href: a.href,
            text: a.textContent?.trim().substring(0, 100) || ''
          })).filter(l => l.href.includes('mafagrafos') && !l.href.includes('mailto'))
        })

        console.log(`  → ${moreLinks.length} links encontrados em ${route}`)
        modelLinks.push(...moreLinks)
      } catch (e) {
        console.log(`  → Erro em ${route}: ${e.message}`)
      }
    }

    // 4. Deduplica links
    const uniqueLinks = [...new Map(modelLinks.map(l => [l.href, l])).values()]
    console.log(`\nTotal de links únicos: ${uniqueLinks.length}`)

    // 5. Filtra links que parecem ser modelos
    const modelUrls = uniqueLinks.filter(l =>
      l.href.includes('/model') ||
      l.href.includes('/generator') ||
      l.href.includes('/customizer') ||
      l.href.includes('/tool')
    )
    console.log(`Links de modelos: ${modelUrls.length}`)

    // 6. Visita cada modelo e coleta dados
    for (let i = 0; i < modelUrls.length; i++) {
      const { href, text } = modelUrls[i]
      const slug = href.split('/').pop() || `model-${i}`
      console.log(`\n[${i + 1}/${modelUrls.length}] ${slug}: ${text}`)

      try {
        await page.goto(href, { waitUntil: 'networkidle', timeout: 20000 })
        await delay(3000) // Aguarda viewer 3D carregar

        // Screenshot do modelo
        await page.screenshot({
          path: join(SCREENSHOT_DIR, `${String(i + 1).padStart(2, '0')}-${slug}.png`),
          fullPage: false // Só a viewport
        })

        // Coleta parâmetros visíveis na página
        const modelData = await page.evaluate(() => {
          const data = {
            title: document.querySelector('h1, h2, [class*="title"]')?.textContent?.trim() || '',
            description: document.querySelector('[class*="description"], [class*="subtitle"]')?.textContent?.trim() || '',
            parameters: [],
            buttons: [],
          }

          // Coleta inputs, sliders, selects
          document.querySelectorAll('input, select, textarea').forEach(el => {
            const label = el.closest('label')?.textContent?.trim() ||
                         el.closest('[class*="field"], [class*="param"]')?.querySelector('label, [class*="label"]')?.textContent?.trim() ||
                         el.name || el.id || ''
            data.parameters.push({
              label: label.substring(0, 80),
              type: el.type || el.tagName.toLowerCase(),
              value: el.value,
              min: el.min || undefined,
              max: el.max || undefined,
              step: el.step || undefined,
            })
          })

          // Coleta botões de ação
          document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent?.trim()
            if (text && text.length < 50) data.buttons.push(text)
          })

          return data
        })

        collectedModels.push({
          slug,
          url: href,
          ...modelData,
          screenshotFile: `${String(i + 1).padStart(2, '0')}-${slug}.png`,
        })

        console.log(`  ✓ ${modelData.title || slug} — ${modelData.parameters.length} params`)

      } catch (e) {
        console.log(`  ✗ Erro: ${e.message}`)
        collectedModels.push({ slug, url: href, error: e.message })
      }
    }

    // 7. Se não encontrou modelos via links, tenta slugs conhecidos do Taglia
    if (collectedModels.length === 0) {
      console.log('\nNenhum modelo via links. Tentando slugs conhecidos...')
      const knownSlugs = [
        'word-offset-3color', 'word-offset-2color', 'word-heart-2colors',
        'social-handle-offset-3color', 'social-handle-offset-2color',
        'cookie-cutter-generator', 'image-brigadeiro-stamp',
        'full-name-keychain', 'rectangle-name-keychain',
        'candy-mold', 'sunken-image-coloring',
      ]

      for (let i = 0; i < knownSlugs.length; i++) {
        const slug = knownSlugs[i]
        // Tenta várias estruturas de URL
        for (const pattern of [
          `${BASE_URL}/pt/model/${slug}`,
          `${BASE_URL}/model/${slug}`,
          `${BASE_URL}/pt/generator/${slug}`,
          `${BASE_URL}/generator/${slug}`,
          `${BASE_URL}/${slug}`,
        ]) {
          try {
            console.log(`  Tentando: ${pattern}`)
            const response = await page.goto(pattern, { waitUntil: 'networkidle', timeout: 10000 })

            if (response && response.status() < 400) {
              await delay(3000)
              await page.screenshot({
                path: join(SCREENSHOT_DIR, `${String(i + 1).padStart(2, '0')}-${slug}.png`),
                fullPage: false
              })

              const title = await page.evaluate(() =>
                document.querySelector('h1, h2')?.textContent?.trim() || document.title
              )

              collectedModels.push({ slug, url: pattern, title, screenshotFile: `${String(i + 1).padStart(2, '0')}-${slug}.png` })
              console.log(`  ✓ ${slug}: ${title}`)
              break // Encontrou, para de tentar patterns
            }
          } catch {
            // Continua para o próximo pattern
          }
        }
      }
    }

  } catch (e) {
    console.error('Erro geral:', e.message)
  } finally {
    // 8. Salva dados coletados
    const result = {
      collectedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      totalModels: collectedModels.length,
      models: collectedModels,
    }

    await writeFile(DATA_FILE, JSON.stringify(result, null, 2), 'utf-8')
    console.log(`\n═══════════════════════════════`)
    console.log(`Coleta finalizada!`)
    console.log(`  Modelos coletados: ${collectedModels.length}`)
    console.log(`  Screenshots em: docs/screenshots/`)
    console.log(`  Dados em: docs/reference-data.json`)
    console.log(`═══════════════════════════════`)

    await browser.close()
  }
}

main().catch(console.error)
