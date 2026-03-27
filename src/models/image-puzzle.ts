import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

interface PuzzleTemplateParams {
  pointsStr: string
  pathsStr: string
  pointCount: number
  cols: number
  rows: number
  thickness: number
  cutWidth: number
  frameWidth: number
  frameHeight: number
  isPuzzle: boolean
}

function buildPuzzleTemplate(p: PuzzleTemplateParams): string {
  const bbox = (Math.max(p.cols, p.rows) * 20 * 1.1).toFixed(2)
  const bboxCalc = p.pointCount > 0 ? 'BBox' : bbox
  return `// Quebra-cabeça de Imagem — gerado pelo Taglia
// ${p.pointCount} ponto(s) no contorno | ${p.cols}x${p.rows} peças

Thickness    = ${p.thickness};
Cut_Width    = ${p.cutWidth};
Frame_Width  = ${p.frameWidth};
Frame_Height = ${p.frameHeight};
BBox         = ${bboxCalc};
Cols         = ${p.cols};
Rows         = ${p.rows};

module shape_outer() {
  polygon(points = ${p.pointsStr}, paths = ${p.pathsStr}, convexity = 10);
}

module puzzle_plate() {
  linear_extrude(Thickness, convexity = 10)
    shape_outer();
}

module grid_cuts() {
  for (i = [1 : Cols - 1]) {
    translate([-BBox/2 + i * BBox/Cols, 0, -0.1])
      cube([Cut_Width, BBox * 2, Thickness + 0.2], center = true);
  }
  for (j = [1 : Rows - 1]) {
    translate([0, -BBox/2 + j * BBox/Rows, -0.1])
      cube([BBox * 2, Cut_Width, Thickness + 0.2], center = true);
  }
}

module frame() {
  linear_extrude(Frame_Height, convexity = 10)
    difference() {
      offset(r = Frame_Width) shape_outer();
      shape_outer();
    }
}

${
  p.isPuzzle
    ? `difference() {
  puzzle_plate();
  grid_cuts();
}`
    : `frame();`
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
  const threshold = values['Threshold'] as number
  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  return buildPuzzleTemplate({
    pointsStr,
    pathsStr,
    pointCount,
    cols: values['Cols'] as number,
    rows: values['Rows'] as number,
    thickness: values['Thickness'] as number,
    cutWidth: values['Cut_Width'] as number,
    frameWidth: values['Frame_Width'] as number,
    frameHeight: values['Frame_Height'] as number,
    isPuzzle: exportParam === 'Puzzle',
  })
}

export const imagePuzzle: ModelDefinition = {
  id: 'image-puzzle',
  slug: 'image-puzzle',
  title: 'Quebra-cabeça de Imagem',
  subtitle: 'Quebra-cabeça personalizado a partir de qualquer silhueta.',
  description:
    'Gera um quebra-cabeça plano com a forma da silhueta, dividido em grade. Inclui moldura opcional para montar. Imprima cada peça em uma cor diferente!',
  category: 'tools',
  difficulty: 'medium',
  tags: [
    'puzzle',
    'quebra-cabeça',
    'imagem',
    'silhueta',
    'jogo',
    'personalizado',
  ],
  generateScadCode,
  exportOptions: [
    {
      format: 'stl',
      parameter: 'Puzzle',
      filename: 'puzzle-pieces',
    },
    {
      format: 'stl',
      parameter: 'Frame',
      filename: 'puzzle-frame',
    },
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
      parameterOrder: ['Size', 'Cols', 'Rows'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 80,
          min: 30,
          max: 200,
          step: 5,
        },
        Cols: {
          type: 'number',
          description: 'Número de colunas',
          default: 3,
          min: 2,
          max: 6,
          step: 1,
        },
        Rows: {
          type: 'number',
          description: 'Número de linhas',
          default: 3,
          min: 2,
          max: 6,
          step: 1,
        },
      },
    },
    {
      name: 'Peças',
      parameterOrder: ['Thickness', 'Cut_Width'],
      parameters: {
        Thickness: {
          type: 'number',
          description: 'Espessura das peças (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 0.5,
        },
        Cut_Width: {
          type: 'number',
          description: 'Largura do corte entre peças (mm)',
          default: 0.5,
          min: 0.3,
          max: 1.5,
          step: 0.1,
        },
      },
    },
    {
      name: 'Moldura',
      parameterOrder: ['Frame_Width', 'Frame_Height'],
      parameters: {
        Frame_Width: {
          type: 'number',
          description: 'Largura da borda da moldura (mm)',
          default: 3,
          min: 1,
          max: 8,
          step: 0.5,
        },
        Frame_Height: {
          type: 'number',
          description: 'Altura da parede da moldura (mm)',
          default: 6,
          min: 3,
          max: 12,
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
