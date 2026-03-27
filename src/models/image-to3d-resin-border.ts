import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

async function generateScadCode(values: ParameterValues, _exportParam: string): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.')
  }

  const sizeMm        = values['Size'] as number
  const wallMargin     = values['Wall_Margin'] as number
  const baseThickness  = values['Base_Thickness'] as number
  const fillHeight     = values['Fill_Height'] as number
  const wallHeight     = values['Wall_Height'] as number
  const threshold      = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } =
    await traceImageToScadPolygon(dataUrl, sizeMm, threshold)

  return `// Imagem para 3D — Bordas para Resina — gerado pelo Taglia
// ${pointCount} ponto(s) | base ${baseThickness}mm, preenchimento ${fillHeight}mm, parede ${wallHeight}mm

Base_Thickness = ${baseThickness};
Fill_Height    = ${fillHeight};
Wall_Height    = ${wallHeight};
Wall_Margin    = ${wallMargin};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Base plate (follows silhouette shape + margin)
linear_extrude(Base_Thickness, convexity = 10)
  offset(r = Wall_Margin)
  shape_outer();

// Raised silhouette (the image area — resin fills on top of this)
translate([0, 0, Base_Thickness])
  linear_extrude(Fill_Height, convexity = 10)
  shape_outer();

// Tall border wall (dam for resin) — ring around the silhouette
translate([0, 0, Base_Thickness])
  linear_extrude(Wall_Height, convexity = 10)
  difference() {
    offset(r = Wall_Margin) shape_outer();
    offset(r = -0.01) shape_outer();
  }
`
}

export const imageTo3dResinBorder: ModelDefinition = {
  id: 'image-to3d-resin-border',
  slug: 'image-to3d-resin-border',
  title: 'Imagem para 3D - Bordas para Resina',
  subtitle: 'Silhueta com bordas altas para preenchimento com resina colorida.',
  description: 'Gera uma placa com a silhueta da imagem em relevo baixo, cercada por paredes altas que servem como represa para preencher com resina UV ou epóxi colorida.',
  category: 'tools',
  difficulty: 'easy',
  tags: ['imagem', 'silhueta', 'resina', 'resin', 'bordas', '3d', 'relevo'],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Model', filename: 'image-3d-resin' },
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
      parameterOrder: ['Size'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 60,
          min: 20,
          max: 150,
          step: 5,
        },
      },
    },
    {
      name: 'Dimensões',
      parameterOrder: ['Wall_Margin', 'Base_Thickness', 'Fill_Height', 'Wall_Height'],
      parameters: {
        Wall_Margin: {
          type: 'number',
          description: 'Largura da borda ao redor da silhueta (mm)',
          default: 3,
          min: 1,
          max: 10,
          step: 0.5,
        },
        Base_Thickness: {
          type: 'number',
          description: 'Espessura da base (mm)',
          default: 2,
          min: 1,
          max: 6,
          step: 0.5,
        },
        Fill_Height: {
          type: 'number',
          description: 'Altura do relevo da imagem (mm) — resina preenche aqui',
          default: 1.5,
          min: 0.5,
          max: 5,
          step: 0.5,
        },
        Wall_Height: {
          type: 'number',
          description: 'Altura das paredes de contenção (mm) — deve ser > que altura do relevo',
          default: 4,
          min: 2,
          max: 10,
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
