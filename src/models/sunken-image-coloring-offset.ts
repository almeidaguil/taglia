import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

async function generateScadCode(values: ParameterValues, _exportParam: string): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.')
  }

  const sizeMm      = values['Size'] as number
  const frameMargin = values['Frame_Margin'] as number
  const layers      = values['Layers'] as number
  const layerH      = values['Layer_Height'] as number
  const offsetStep  = values['Offset_Step'] as number
  const carveDepth  = values['Carve_Depth'] as number
  const threshold   = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } =
    await traceImageToScadPolygon(dataUrl, sizeMm, threshold)

  // Gera camadas offset (mesma lógica de image-to3d-offset, mas com frameMargin adicionado).
  // Camada 0 = base (maior), camada layers-1 = topo (menor, mais próxima da silhueta).
  const layerLines: string[] = []
  for (let i = 0; i < layers; i++) {
    const r = (layers - 1 - i) * offsetStep + frameMargin
    const z = i * layerH
    const h = layers * layerH - z  // cada camada se estende até o topo
    layerLines.push(
      `    // Camada ${i + 1} (z=${z.toFixed(1)}mm, offset r=${r.toFixed(1)}mm)\n` +
      `    translate([0, 0, ${z.toFixed(1)}])\n` +
      `      linear_extrude(${h.toFixed(1)}, convexity = 10)\n` +
      `        offset(r = ${r.toFixed(1)}) shape_outer();`
    )
  }

  const totalH = layers * layerH
  const carveZ = totalH - carveDepth

  return `// Imagem Afundada com Offset — gerado pelo Taglia
// ${pointCount} ponto(s) | ${layers} camadas, passo ${offsetStep}mm, altura ${layerH}mm/camada

Frame_Margin = ${frameMargin};
Layers       = ${layers};
Layer_Height = ${layerH};
Offset_Step  = ${offsetStep};
Carve_Depth  = ${carveDepth};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Placa com camadas offset escalonadas e silhueta entalhada no topo.
// Para impressão multi-cor: trocar filamento a cada ${layerH}mm de altura.
difference() {
  union() {
${layerLines.join('\n\n')}
  }

  // Entalhe da silhueta a partir do topo
  translate([0, 0, ${carveZ.toFixed(1)}])
    linear_extrude(${(carveDepth + 0.1).toFixed(1)}, convexity = 10)
    shape_outer();
}
`
}

export const sunkenImageColoringOffset: ModelDefinition = {
  id: 'sunken-image-coloring-offset',
  slug: 'sunken-image-coloring-offset',
  title: 'Imagem Afundada com Offset',
  subtitle: 'Silhueta entalhada em placa com bordas offset multi-cor.',
  description: 'Gera uma placa com camadas offset escalonadas e a silhueta da imagem entalhada no centro. Cada camada pode ser impressa em uma cor diferente para efeito visual rico.',
  category: 'tools',
  difficulty: 'easy',
  tags: ['imagem', 'silhueta', 'offset', 'multicolor', 'entalhe', 'sunken', 'camadas'],
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
