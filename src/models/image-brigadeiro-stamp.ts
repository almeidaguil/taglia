import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

async function generateScadCode(values: ParameterValues, _exportParam: string): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.')
  }

  const sizeMm       = values['Size'] as number
  const baseThick    = values['Base_Thickness'] as number
  const reliefHeight = values['Relief_Height'] as number
  const threshold    = values['Threshold'] as number
  const hasHandle    = values['Handle'] as boolean
  const handleHeight = values['Handle_Height'] as number
  const handleDiam   = values['Handle_Diameter'] as number
  const margin       = values['Margin'] as number

  const { pointsStr, pathsStr, allPointsStr, allPathsStr, pointCount, pathCount } =
    await traceImageToScadPolygon(dataUrl, sizeMm, threshold)

  // Estratégia: passa TODOS os paths como um único polygon() multi-path para o OpenSCAD.
  // O OpenSCAD aplica o winding-rule nativamente (CCW = sólido, CW = buraco).
  // Após a inversão de Y que fazemos no transform, os paths do potrace ficam com a
  // orientação correta para o OpenSCAD — sem precisar computar níveis de aninhamento.
  return `// Carimbo de Brigadeiro — gerado pelo Taglia
// ${pointCount} ponto(s), ${pathCount} caminho(s)

Base_Thickness  = ${baseThick};
Relief_Height   = ${reliefHeight};
Margin          = ${margin};
Handle          = ${hasHandle ? 'true' : 'false'};
Handle_Height   = ${handleHeight};
Handle_Diameter = ${handleDiam};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Relevo: polygon multi-path com todos os caminhos do potrace.
// OpenSCAD winding-rule: CCW = sólido, CW = buraco.
// Overlap de 0.01mm com a base evita faces coplanares que causam "mesh not closed".
module stamp_relief() {
  translate([0, 0, Base_Thickness - 0.01])
    linear_extrude(Relief_Height + 0.01, convexity = 10)
      polygon(points = ${allPointsStr}, paths = ${allPathsStr}, convexity = 10);
}

module stamp_body() {
  union() {
    linear_extrude(Base_Thickness, convexity = 10)
      offset(r = Margin)
      shape_outer();

    stamp_relief();
  }
}

module handle_knob() {
  cylinder(h = Handle_Height, r = Handle_Diameter / 2, $fn = 48);
}

if (Handle) {
  handle_knob();
  translate([0, 0, Handle_Height]) stamp_body();
} else {
  stamp_body();
}
`
}

export const imageBrigadeiroStamp: ModelDefinition = {
  id: 'image-brigadeiro-stamp',
  slug: 'image-brigadeiro-stamp',
  title: 'Carimbo de Brigadeiro',
  subtitle: 'Carimbo personalizado para brigadeiros e doces a partir de qualquer imagem.',
  description: 'Faça upload de uma silhueta em preto e branco para gerar o carimbo. O relevo deixa uma impressão no brigadeiro quando pressionado. Funciona também como carimbo de argila ou EVA.',
  category: 'kitchen',
  difficulty: 'easy',
  tags: ['carimbo', 'brigadeiro', 'doce', 'stamp', 'imagem', 'silhueta', 'confeitaria'],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Stamp', filename: 'brigadeiro-stamp' },
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
      parameterOrder: ['Size', 'Margin'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 40,
          min: 15,
          max: 80,
          step: 5,
        },
        Margin: {
          type: 'number',
          description: 'Margem da base ao redor (mm)',
          default: 4,
          min: 1,
          max: 10,
          step: 0.5,
        },
      },
    },
    {
      name: 'Relevo',
      parameterOrder: ['Base_Thickness', 'Relief_Height'],
      parameters: {
        Base_Thickness: {
          type: 'number',
          description: 'Espessura da base (mm)',
          default: 3,
          min: 1.5,
          max: 6,
          step: 0.5,
        },
        Relief_Height: {
          type: 'number',
          description: 'Altura do relevo (mm)',
          default: 2,
          min: 0.5,
          max: 5,
          step: 0.5,
        },
      },
    },
    {
      name: 'Cabo',
      parameterOrder: ['Handle', 'Handle_Height', 'Handle_Diameter'],
      parameters: {
        Handle: {
          type: 'boolean',
          description: 'Adicionar cabo',
          default: true,
        },
        Handle_Height: {
          type: 'number',
          description: 'Altura do cabo (mm)',
          default: 18,
          min: 8,
          max: 35,
          step: 1,
        },
        Handle_Diameter: {
          type: 'number',
          description: 'Diâmetro do cabo (mm)',
          default: 18,
          min: 10,
          max: 30,
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
