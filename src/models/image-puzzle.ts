import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

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
  const cols = values['Cols'] as number
  const rows = values['Rows'] as number
  const thickness = values['Thickness'] as number
  const cutWidth = values['Cut_Width'] as number
  const frameWidth = values['Frame_Width'] as number
  const frameHeight = values['Frame_Height'] as number
  const threshold = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  // BBox um pouco maior que a silhueta para garantir cortes completos
  const bbox = (sizeMm * 1.1).toFixed(2)

  const isPuzzle = exportParam === 'Puzzle'

  return `// Quebra-cabeça de Imagem — gerado pelo Taglia
// ${pointCount} ponto(s) no contorno | ${cols}x${rows} peças

Thickness    = ${thickness};
Cut_Width    = ${cutWidth};
Frame_Width  = ${frameWidth};
Frame_Height = ${frameHeight};
BBox         = ${bbox};
Cols         = ${cols};
Rows         = ${rows};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Placa plana na forma da silhueta
module puzzle_plate() {
  linear_extrude(Thickness, convexity = 10)
    shape_outer();
}

// Cortes em grade — linhas verticais e horizontais
module grid_cuts() {
  // Cortes verticais (Cols - 1)
  for (i = [1 : Cols - 1]) {
    translate([-BBox/2 + i * BBox/Cols, 0, -0.1])
      cube([Cut_Width, BBox * 2, Thickness + 0.2], center = true);
  }
  // Cortes horizontais (Rows - 1)
  for (j = [1 : Rows - 1]) {
    translate([0, -BBox/2 + j * BBox/Rows, -0.1])
      cube([BBox * 2, Cut_Width, Thickness + 0.2], center = true);
  }
}

// Moldura ao redor da silhueta para segurar as peças
module frame() {
  linear_extrude(Frame_Height, convexity = 10)
    difference() {
      offset(r = Frame_Width) shape_outer();
      shape_outer();
    }
}

${
  isPuzzle
    ? `// Peças do quebra-cabeça (placa com cortes)
difference() {
  puzzle_plate();
  grid_cuts();
}`
    : `// Moldura do quebra-cabeça
frame();`
}
`
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
    { format: 'stl', parameter: 'Puzzle', filename: 'puzzle-pieces' },
    { format: 'stl', parameter: 'Frame', filename: 'puzzle-frame' },
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
