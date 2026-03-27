import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

interface SunkenOffsetParams {
  pointsStr: string
  pathsStr: string
  pointCount: number
  frameMargin: number
  layers: number
  layerH: number
  offsetStep: number
  carveDepth: number
}

function buildLayerLines(p: SunkenOffsetParams): string[] {
  const lines: string[] = []
  for (let i = 0; i < p.layers; i++) {
    const r = (p.layers - 1 - i) * p.offsetStep + p.frameMargin
    const z = i * p.layerH
    const h = p.layers * p.layerH - z
    lines.push(
      `    // Camada ${i + 1} (z=${z.toFixed(1)}mm, offset r=${r.toFixed(1)}mm)\n` +
        `    translate([0, 0, ${z.toFixed(1)}])\n` +
        `      linear_extrude(${h.toFixed(1)}, convexity = 10)\n` +
        `        offset(r = ${r.toFixed(1)}) shape_outer();`,
    )
  }
  return lines
}

function buildSunkenOffsetTemplate(p: SunkenOffsetParams): string {
  const layerLines = buildLayerLines(p)
  const totalH = p.layers * p.layerH
  const carveZ = totalH - p.carveDepth
  return `// Imagem Afundada com Offset — gerado pelo Taglia
// ${p.pointCount} ponto(s) | ${p.layers} camadas, passo ${p.offsetStep}mm, altura ${p.layerH}mm/camada

Frame_Margin = ${p.frameMargin};
Layers       = ${p.layers};
Layer_Height = ${p.layerH};
Offset_Step  = ${p.offsetStep};
Carve_Depth  = ${p.carveDepth};

module shape_outer() {
  polygon(points = ${p.pointsStr}, paths = ${p.pathsStr}, convexity = 10);
}

difference() {
  union() {
${layerLines.join('\n\n')}
  }

  translate([0, 0, ${carveZ.toFixed(1)}])
    linear_extrude(${(p.carveDepth + 0.1).toFixed(1)}, convexity = 10)
    shape_outer();
}
`
}

async function generateScadCode(
  values: ParameterValues,
  _exportParam: string,
): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error(
      'Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.',
    )
  }

  const sizeMm = values['Size'] as number
  const threshold = values['Threshold'] as number
  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  return buildSunkenOffsetTemplate({
    pointsStr,
    pathsStr,
    pointCount,
    frameMargin: values['Frame_Margin'] as number,
    layers: values['Layers'] as number,
    layerH: values['Layer_Height'] as number,
    offsetStep: values['Offset_Step'] as number,
    carveDepth: values['Carve_Depth'] as number,
  })
}

export const sunkenImageColoringOffset: ModelDefinition = {
  id: 'sunken-image-coloring-offset',
  slug: 'sunken-image-coloring-offset',
  title: 'Imagem Afundada com Offset',
  subtitle: 'Silhueta entalhada em placa com bordas offset multi-cor.',
  description:
    'Gera uma placa com camadas offset escalonadas e a silhueta da imagem entalhada no centro. Cada camada pode ser impressa em uma cor diferente para efeito visual rico.',
  category: 'tools',
  difficulty: 'easy',
  tags: [
    'imagem',
    'silhueta',
    'offset',
    'multicolor',
    'entalhe',
    'sunken',
    'camadas',
  ],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Model', filename: 'sunken-image-offset' },
  ],
  sections: [
    {
      name: 'default',
      parameterOrder: ['Image'],
      parameters: {
        Image: {
          type: 'image',
          description: 'Imagem',
          default: '',
          accept: ['image/png', 'image/jpeg', 'image/webp'],
        },
      },
    },
    {
      name: 'Tamanho',
      parameterOrder: ['Size', 'Frame_Margin'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 60,
          min: 20,
          max: 150,
          step: 5,
        },
        Frame_Margin: {
          type: 'number',
          description: 'Margem ao redor da silhueta (mm)',
          default: 3,
          min: 1,
          max: 15,
          step: 0.5,
        },
      },
    },
    {
      name: 'Camadas',
      parameterOrder: ['Layers', 'Layer_Height', 'Offset_Step'],
      parameters: {
        Layers: {
          type: 'number',
          description: 'Número de camadas offset (cores)',
          default: 3,
          min: 1,
          max: 5,
          step: 1,
        },
        Layer_Height: {
          type: 'number',
          description: 'Altura de cada camada (mm)',
          default: 1.5,
          min: 0.5,
          max: 5,
          step: 0.5,
        },
        Offset_Step: {
          type: 'number',
          description: 'Passo de offset entre camadas (mm)',
          default: 2,
          min: 0.5,
          max: 6,
          step: 0.5,
        },
      },
    },
    {
      name: 'Entalhe',
      parameterOrder: ['Carve_Depth'],
      parameters: {
        Carve_Depth: {
          type: 'number',
          description: 'Profundidade do entalhe (mm)',
          default: 1.5,
          min: 0.5,
          max: 4,
          step: 0.5,
        },
      },
    },
    {
      name: 'Ajuste',
      parameterOrder: ['Threshold'],
      parameters: {
        Threshold: {
          type: 'number',
          description: 'Limiar de binarização (0 = mais escuro)',
          default: 128,
          min: 10,
          max: 245,
          step: 5,
        },
      },
    },
  ],
}
