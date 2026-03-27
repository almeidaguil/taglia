import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

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
  const margin = values['Frame_Margin'] as number
  const baseThick = values['Base_Thickness'] as number
  const depth = values['Carve_Depth'] as number
  const threshold = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  return `// Imagem Afundada (Sunken Image Coloring) — gerado pelo Taglia
// ${pointCount} ponto(s) no contorno

Frame_Margin    = ${margin};
Base_Thickness  = ${baseThick};
Carve_Depth     = ${depth};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Placa base com entalhe em forma de silhueta.
// Para impressão multi-cor: trocar filamento quando o entalhe for fechado pela camada acima,
// ou preencher o entalhe com resina/tinta após a impressão.
difference() {
  // Placa completa (silhueta + margem)
  linear_extrude(Base_Thickness, convexity = 10)
    offset(r = Frame_Margin)
    shape_outer();

  // Entalhe da silhueta a partir do topo
  translate([0, 0, Base_Thickness - Carve_Depth])
    linear_extrude(Carve_Depth + 0.1, convexity = 10)
    shape_outer();
}
`
}

export const sunkenImageColoring: ModelDefinition = {
  id: 'sunken-image-coloring',
  slug: 'sunken-image-coloring',
  title: 'Imagem Afundada',
  subtitle: 'Silhueta entalhada em placa para impressão multi-cor.',
  description:
    'Gera uma placa com a silhueta da imagem entalhada. Use troca de filamento no momento certo para preencher o entalhe com outra cor, ou preencha com resina/tinta após a impressão.',
  category: 'tools',
  difficulty: 'easy',
  tags: [
    'imagem',
    'silhueta',
    'multicolor',
    'entalhe',
    'placa',
    'relevo',
    'sunken',
  ],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Plate', filename: 'sunken-image' },
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
          default: 5,
          min: 1,
          max: 20,
          step: 0.5,
        },
      },
    },
    {
      name: 'Entalhe',
      parameterOrder: ['Base_Thickness', 'Carve_Depth'],
      parameters: {
        Base_Thickness: {
          type: 'number',
          description: 'Espessura total da placa (mm)',
          default: 4,
          min: 2,
          max: 10,
          step: 0.5,
        },
        Carve_Depth: {
          type: 'number',
          description: 'Profundidade do entalhe (mm)',
          default: 2,
          min: 0.5,
          max: 5,
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
