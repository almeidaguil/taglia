import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

interface BandGeometry {
  translate: string
  cube: string
}

interface BandConfig {
  direction: string
  bbox: number
  bandSize: number
  partIndex: number
  thickness: number
  tolerance: number
}

function computeBand(cfg: BandConfig): BandGeometry {
  const halfZ = (cfg.thickness / 2).toFixed(1)
  const hFull = (cfg.thickness + 0.2).toFixed(1)
  const bw = (cfg.bandSize - cfg.tolerance).toFixed(3)
  const dbl = (cfg.bbox * 2).toFixed(1)
  if (cfg.direction === 'horizontal') {
    const yPos = -cfg.bbox / 2 + cfg.partIndex * cfg.bandSize + cfg.bandSize / 2
    return {
      translate: `translate([0, ${yPos.toFixed(3)}, ${halfZ}])`,
      cube: `cube([${dbl}, ${bw}, ${hFull}], center = true)`,
    }
  }
  const xPos = -cfg.bbox / 2 + cfg.partIndex * cfg.bandSize + cfg.bandSize / 2
  return {
    translate: `translate([${xPos.toFixed(3)}, 0, ${halfZ}])`,
    cube: `cube([${bw}, ${dbl}, ${hFull}], center = true)`,
  }
}

interface MultipartTemplateParams {
  pointsStr: string
  pathsStr: string
  pointCount: number
  partIndex: number
  parts: number
  direction: string
  thickness: number
  tolerance: number
  band: BandGeometry
}

function buildMultipartTemplate(p: MultipartTemplateParams): string {
  const dirLabel = p.direction === 'horizontal' ? 'horizontal' : 'vertical'
  return `// Imagem Multipartes — gerado pelo Taglia
// ${p.pointCount} ponto(s) | Parte ${p.partIndex + 1} de ${p.parts} (${p.direction})

Thickness = ${p.thickness};
Tolerance = ${p.tolerance};

module shape_outer() {
  polygon(points = ${p.pointsStr}, paths = ${p.pathsStr}, convexity = 10);
}

// Parte ${p.partIndex + 1}: interseção da silhueta com faixa ${dirLabel}
intersection() {
  linear_extrude(Thickness, convexity = 10)
    shape_outer();

  ${p.band.translate}
    ${p.band.cube};
}
`
}

async function generateScadCode(
  values: ParameterValues,
  exportParam: string,
): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error(
      'Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.',
    )
  }

  const sizeMm = values['Size'] as number
  const parts = values['Parts'] as number
  const direction = values['Direction'] as string
  const thickness = values['Thickness'] as number
  const tolerance = values['Tolerance'] as number
  const threshold = values['Threshold'] as number
  const partIndex = parseInt(exportParam.replace('Part_', '')) - 1

  if (partIndex >= parts) {
    return `// Imagem Multipartes — gerado pelo Taglia
// Parte ${partIndex + 1} não existe (total de partes: ${parts})
// Nada a renderizar.
`
  }

  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )
  const bbox = sizeMm * 1.5
  const band = computeBand({
    direction,
    bbox,
    bandSize: bbox / parts,
    partIndex,
    thickness,
    tolerance,
  })

  return buildMultipartTemplate({
    pointsStr,
    pathsStr,
    pointCount,
    partIndex,
    parts,
    direction,
    thickness,
    tolerance,
    band,
  })
}

export const imageMultipart: ModelDefinition = {
  id: 'image-multipart',
  slug: 'image-multipart',
  title: 'Imagem Multipartes',
  subtitle: 'Silhueta dividida em partes para impressão multi-cor.',
  description:
    'Divide a silhueta da imagem em faixas horizontais ou verticais. Cada faixa é uma peça separada que pode ser impressa em uma cor diferente. Monte as peças para criar um efeito de cores listrado.',
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
