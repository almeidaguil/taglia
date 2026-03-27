import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

async function generateScadCode(values: ParameterValues, exportParam: string): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.')
  }

  const sizeMm    = values['Size'] as number
  const parts     = values['Parts'] as number
  const direction = values['Direction'] as string
  const thickness = values['Thickness'] as number
  const tolerance = values['Tolerance'] as number
  const threshold = values['Threshold'] as number

  // Determina qual parte renderizar (1-indexed)
  const partIndex = parseInt(exportParam.replace('Part_', '')) - 1

  // Se a parte solicitada excede o número de partes configurado, gera SCAD vazio
  if (partIndex >= parts) {
    return `// Imagem Multipartes — gerado pelo Taglia
// Parte ${partIndex + 1} não existe (total de partes: ${parts})
// Nada a renderizar.
`
  }

  const { pointsStr, pathsStr, pointCount } =
    await traceImageToScadPolygon(dataUrl, sizeMm, threshold)

  // Bounding box generosa para cobrir toda a silhueta
  const bbox = sizeMm * 1.5
  const bandSize = bbox / parts

  // Gera o corte da faixa para a parte solicitada
  const i = partIndex
  let bandTranslate: string
  let bandCube: string

  if (direction === 'horizontal') {
    const yPos = -bbox / 2 + i * bandSize + bandSize / 2
    bandTranslate = `translate([0, ${yPos.toFixed(3)}, ${(thickness / 2).toFixed(1)}])`
    bandCube = `cube([${(bbox * 2).toFixed(1)}, ${(bandSize - tolerance).toFixed(3)}, ${(thickness + 0.2).toFixed(1)}], center = true)`
  } else {
    const xPos = -bbox / 2 + i * bandSize + bandSize / 2
    bandTranslate = `translate([${xPos.toFixed(3)}, 0, ${(thickness / 2).toFixed(1)}])`
    bandCube = `cube([${(bandSize - tolerance).toFixed(3)}, ${(bbox * 2).toFixed(1)}, ${(thickness + 0.2).toFixed(1)}], center = true)`
  }

  return `// Imagem Multipartes — gerado pelo Taglia
// ${pointCount} ponto(s) | Parte ${partIndex + 1} de ${parts} (${direction})

Thickness = ${thickness};
Tolerance = ${tolerance};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Parte ${partIndex + 1}: interseção da silhueta com faixa ${direction === 'horizontal' ? 'horizontal' : 'vertical'}
intersection() {
  linear_extrude(Thickness, convexity = 10)
    shape_outer();

  ${bandTranslate}
    ${bandCube};
}
`
}

export const imageMultipart: ModelDefinition = {
  id: 'image-multipart',
  slug: 'image-multipart',
  title: 'Imagem Multipartes',
  subtitle: 'Silhueta dividida em partes para impressão multi-cor.',
  description: 'Divide a silhueta da imagem em faixas horizontais ou verticais. Cada faixa é uma peça separada que pode ser impressa em uma cor diferente. Monte as peças para criar um efeito de cores listrado.',
  category: 'tools',
  difficulty: 'medium',
  tags: ['imagem', 'silhueta', 'multicolor', 'partes', 'faixas', 'multipart'],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Part_1', filename: 'multipart-1' },
    { format: 'stl', parameter: 'Part_2', filename: 'multipart-2' },
    { format: 'stl', parameter: 'Part_3', filename: 'multipart-3' },
    { format: 'stl', parameter: 'Part_4', filename: 'multipart-4' },
    { format: 'stl', parameter: 'Part_5', filename: 'multipart-5' },
    { format: 'stl', parameter: 'Part_6', filename: 'multipart-6' },
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
      parameterOrder: ['Size', 'Thickness'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 80,
          min: 30,
          max: 200,
          step: 5,
        },
        Thickness: {
          type: 'number',
          description: 'Espessura da peça (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 0.5,
        },
      },
    },
    {
      name: 'Partes',
      parameterOrder: ['Parts', 'Direction', 'Tolerance'],
      parameters: {
        Parts: {
          type: 'number',
          description: 'Número de partes (cores)',
          default: 3,
          min: 2,
          max: 6,
          step: 1,
        },
        Direction: {
          type: 'select',
          description: 'Direção das faixas',
          default: 'horizontal',
          options: ['horizontal', 'vertical'],
        },
        Tolerance: {
          type: 'number',
          description: 'Folga entre partes para encaixe (mm)',
          default: 0.3,
          min: 0,
          max: 1,
          step: 0.1,
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
