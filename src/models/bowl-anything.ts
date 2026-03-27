import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

interface BowlSlice {
  z0: string
  z1: string
  s0: string
  s1: string
}

function computeBowlSlices(
  bowlH: number,
  slices: number,
  baseScale: number,
): BowlSlice[] {
  const step = bowlH / slices
  const result: BowlSlice[] = []
  for (let i = 0; i < slices; i++) {
    const t0 = i / slices
    const t1 = (i + 1) / slices
    result.push({
      z0: (i * step).toFixed(2),
      z1: ((i + 1) * step).toFixed(2),
      s0: (baseScale + (1 - baseScale) * Math.sqrt(t0)).toFixed(4),
      s1: (baseScale + (1 - baseScale) * Math.sqrt(t1)).toFixed(4),
    })
  }
  return result
}

interface BowlTemplateParams {
  pointsStr: string
  pathsStr: string
  pointCount: number
  bowlH: number
  wall: number
  baseScale: number
  slices: BowlSlice[]
}

function buildBowlTemplate(p: BowlTemplateParams): string {
  const outerLines = p.slices.map(
    ({ z0, z1, s0, s1 }) =>
      `    hull() {\n` +
      `      translate([0, 0, ${z0}])\n` +
      `        linear_extrude(0.01, convexity = 10)\n` +
      `        scale([${s0}, ${s0}]) shape_outer();\n` +
      `      translate([0, 0, ${z1}])\n` +
      `        linear_extrude(0.01, convexity = 10)\n` +
      `        scale([${s1}, ${s1}]) shape_outer();\n` +
      `    }`,
  )
  const innerLines = p.slices.map(
    ({ z0, z1, s0, s1 }) =>
      `    hull() {\n` +
      `      translate([0, 0, ${z0}])\n` +
      `        linear_extrude(0.01, convexity = 10)\n` +
      `        scale([${s0}, ${s0}]) offset(r = -Wall_Thickness) shape_outer();\n` +
      `      translate([0, 0, ${z1}])\n` +
      `        linear_extrude(0.01, convexity = 10)\n` +
      `        scale([${s1}, ${s1}]) offset(r = -Wall_Thickness) shape_outer();\n` +
      `    }`,
  )
  const pct = (p.baseScale * 100).toFixed(0)
  return `// Cumbuca a partir de Imagem — gerado pelo Taglia
// ${p.pointCount} ponto(s), ${p.slices.length} fatias, escala base ${pct}%

Bowl_Height    = ${p.bowlH};
Wall_Thickness = ${p.wall};

module shape_outer() {
  polygon(points = ${p.pointsStr}, paths = ${p.pathsStr}, convexity = 10);
}

module outer_shell() {
  union() {
${outerLines.join('\n')}
  }
}

module inner_cavity() {
  union() {
${innerLines.join('\n')}
  }
}

difference() {
  outer_shell();
  translate([0, 0, Wall_Thickness])
    inner_cavity();
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
  const bowlH = values['Bowl_Height'] as number
  const wall = values['Wall_Thickness'] as number
  const baseScale = (values['Base_Scale'] as number) / 100
  const numSlices = values['Slices'] as number
  const threshold = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  const slices = computeBowlSlices(bowlH, numSlices, baseScale)
  return buildBowlTemplate({
    pointsStr,
    pathsStr,
    pointCount,
    bowlH,
    wall,
    baseScale,
    slices,
  })
}

export const bowlAnything: ModelDefinition = {
  id: 'bowl-anything',
  slug: 'bowl-anything',
  title: 'Cumbuca a partir de Imagem',
  subtitle: 'Tigela personalizada com formato de qualquer silhueta.',
  description:
    'Crie uma cumbuca/tigela arredondada com qualquer forma de imagem. A borda segue o contorno da silhueta e as paredes curvam suavemente até a base. Perfeita para organizar pequenos objetos ou como decoração.',
  category: 'kitchen',
  difficulty: 'medium',
  tags: [
    'tigela',
    'cumbuca',
    'bowl',
    'imagem',
    'silhueta',
    'decoração',
    'organizador',
  ],
  generateScadCode,
  exportOptions: [{ format: 'stl', parameter: 'Bowl', filename: 'bowl' }],
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
      parameterOrder: ['Size', 'Bowl_Height'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da borda (mm — lado maior)',
          default: 80,
          min: 30,
          max: 200,
          step: 5,
        },
        Bowl_Height: {
          type: 'number',
          description: 'Altura da tigela (mm)',
          default: 40,
          min: 15,
          max: 80,
          step: 5,
        },
      },
    },
    {
      name: 'Formato',
      parameterOrder: ['Base_Scale', 'Wall_Thickness', 'Slices'],
      parameters: {
        Base_Scale: {
          type: 'number',
          description: 'Tamanho da base em relação à borda (%)',
          default: 40,
          min: 10,
          max: 80,
          step: 5,
        },
        Wall_Thickness: {
          type: 'number',
          description: 'Espessura da parede (mm)',
          default: 2.5,
          min: 1,
          max: 5,
          step: 0.5,
        },
        Slices: {
          type: 'number',
          description: 'Suavidade da curva (mais = mais liso, mais lento)',
          default: 8,
          min: 4,
          max: 20,
          step: 1,
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
