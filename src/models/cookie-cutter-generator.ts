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
  const wall = values['Wall_Thickness'] as number
  const height = values['Height'] as number
  const threshold = values['Threshold'] as number
  const hasHandle = values['Handle'] as boolean
  const handleHeight = values['Handle_Height'] as number
  const handleWidth = values['Handle_Width'] as number

  const { pointsStr, pathsStr, pointCount, pathCount } =
    await traceImageToScadPolygon(dataUrl, sizeMm, threshold)

  return `// Cortador de Biscoito — gerado pelo Taglia
// ${pointCount} pontos, ${pathCount} caminho(s)

Wall_Thickness = ${wall};   // espessura da parede (mm)
Height         = ${height}; // altura total (mm)
Handle         = ${hasHandle ? 'true' : 'false'};
Handle_Height  = ${handleHeight};
Handle_Width   = ${handleWidth};

module shape_2d() {
  polygon(
    points = ${pointsStr},
    paths  = ${pathsStr},
    convexity = 10
  );
}

module cutter_wall() {
  difference() {
    // Face externa: contorno expandido pela espessura da parede
    linear_extrude(Height, convexity = 10)
      offset(r = Wall_Thickness)
      shape_2d();

    // Remove o interior (lâmina de corte)
    translate([0, 0, -0.1])
      linear_extrude(Height + 0.2, convexity = 10)
      shape_2d();
  }
}

// Aba horizontal no topo da lâmina (facilita pressionar)
// É um anel plano que se projeta para fora da parede — sem hull() convexo.
module handle_strip() {
  linear_extrude(Handle_Height, convexity = 10)
    difference() {
      offset(r = Wall_Thickness + Handle_Width) shape_2d();
      offset(r = Wall_Thickness) shape_2d();
    }
}

if (Handle) {
  union() {
    cutter_wall();
    translate([0, 0, Height - Handle_Height])
      handle_strip();
  }
} else {
  cutter_wall();
}
`
}

export const cookieCutterGenerator: ModelDefinition = {
  id: 'cookie-cutter-generator',
  slug: 'cookie-cutter-generator',
  title: 'Cortador de Biscoito',
  subtitle:
    'Gera um cortador de biscoito a partir de qualquer imagem. Imprime pronto para usar.',
  description:
    'Faça upload de uma imagem em preto e branco (alto contraste) para melhores resultados. O cortador é gerado com parede fina seguindo o contorno da silhueta.',
  category: 'kitchen',
  difficulty: 'easy',
  tags: [
    'cortador',
    'biscoito',
    'cookie',
    'cutter',
    'imagem',
    'silhueta',
    'confeitaria',
  ],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Cutter', filename: 'cookie-cutter' },
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
      parameterOrder: ['Size', 'Height'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho (mm — lado maior)',
          default: 80,
          min: 30,
          max: 200,
          step: 5,
        },
        Height: {
          type: 'number',
          description: 'Altura da lâmina (mm)',
          default: 12,
          min: 8,
          max: 25,
          step: 1,
        },
      },
    },
    {
      name: 'Lâmina',
      parameterOrder: ['Wall_Thickness', 'Threshold'],
      parameters: {
        Wall_Thickness: {
          type: 'number',
          description: 'Espessura da parede (mm)',
          default: 1.2,
          min: 0.8,
          max: 2.5,
          step: 0.1,
        },
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
    {
      name: 'Alça',
      parameterOrder: ['Handle', 'Handle_Height', 'Handle_Width'],
      parameters: {
        Handle: {
          type: 'boolean',
          description: 'Adicionar tira de apoio',
          default: true,
        },
        Handle_Height: {
          type: 'number',
          description: 'Altura da tira (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 1,
        },
        Handle_Width: {
          type: 'number',
          description: 'Largura da tira (mm)',
          default: 3,
          min: 1,
          max: 6,
          step: 0.5,
        },
      },
    },
  ],
}
