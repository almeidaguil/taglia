import type { ModelDefinition, ParameterValues } from '../types'

/**
 * Loads a .scad file from /src/scad/ and injects parameter overrides at the top.
 * This replaces the default values in the SCAD file with the user-chosen ones.
 */
export async function buildScadCode(
  model: ModelDefinition,
  values: ParameterValues,
  exportParam: string
): Promise<string> {
  // Modelos baseados em imagem geram o SCAD dinamicamente
  if (model.generateScadCode) {
    return model.generateScadCode(values, exportParam)
  }

  if (!model.scadFile) throw new Error(`Modelo "${model.id}" não tem scadFile nem generateScadCode`)

  const scadUrl = new URL(`../scad/${model.scadFile}`, import.meta.url).href
  const response = await fetch(scadUrl)
  if (!response.ok) throw new Error(`Failed to load SCAD file: ${model.scadFile}`)

  const template = await response.text()

  return injectParameters(template, values, exportParam)
}


/**
 * Replace parameter default lines in the template with user values.
 * Matches lines like:  ParameterName = <anything>;
 */
function injectParameters(
  template: string,
  values: ParameterValues,
  exportParam: string
): string {
  const allValues = { ...values, Part: exportParam }
  let result = template

  for (const [key, value] of Object.entries(allValues)) {
    // Match: key = <value>;  (with optional spaces and inline comment)
    const regex = new RegExp(
      `^(${escapeRegex(key)}\\s*=\\s*)([^;]+)(;.*)$`,
      'gm'
    )
    const replacement = `$1${scadValue(value)}$3`
    result = result.replace(regex, replacement)
  }

  return result
}

function scadValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    return `"${escaped}"`
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
