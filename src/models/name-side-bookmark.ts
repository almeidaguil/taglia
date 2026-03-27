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

  const name = values['Name'] as string
  const font = values['Font'] as string
  const sizeMm = values['Size'] as number
  const bookmarkWidth = values['Bookmark_Width'] as number
  const bookmarkLength = values['Bookmark_Length'] as number
  const thickness = values['Thickness'] as number
  const nameSize = values['Name_Size'] as number
  const nameDepth = values['Name_Depth'] as number
  const clipLength = values['Clip_Length'] as number
  const pageThickness = values['Page_Thickness'] as number
  const threshold = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  return `// Marcador de Livro — gerado pelo Taglia
// ${pointCount} ponto(s) no contorno da silhueta

Bookmark_Width  = ${bookmarkWidth};
Bookmark_Length = ${bookmarkLength};
Thickness       = ${thickness};
Name            = "${name}";
Name_Size       = ${nameSize};
Name_Depth      = ${nameDepth};
Font            = "${font}";
Clip_Length      = ${clipLength};
Page_Thickness   = ${pageThickness};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Corpo retangular do marcador
module body() {
  translate([0, -Bookmark_Length / 2, 0])
    linear_extrude(Thickness, convexity = 10)
    square([Bookmark_Width, Bookmark_Length], center = true);
}

// Silhueta decorativa no topo
module decoration() {
  linear_extrude(Thickness, convexity = 10)
    shape_outer();
}

// Nome gravado no corpo (rotacionado 90° para ficar ao longo do comprimento)
module name_text() {
  translate([0, -Bookmark_Length / 4, Thickness - Name_Depth])
    linear_extrude(Name_Depth + 0.1, convexity = 10)
    rotate([0, 0, 90])
    text(Name, size = Name_Size, font = str(Font, ":style=Bold"), halign = "center", valign = "center");
}

// Fenda para prender na página (slot cortado na parte inferior)
module page_slot() {
  translate([0, -Bookmark_Length + Clip_Length / 2, Thickness / 2])
    cube([Bookmark_Width - 2, Clip_Length, Page_Thickness], center = true);
}

// Montagem final
difference() {
  union() {
    body();
    decoration();
  }
  name_text();
  page_slot();
}
`
}

export const nameSideBookmark: ModelDefinition = {
  id: 'name-side-bookmark',
  slug: 'name-side-bookmark',
  title: 'Marcador de Livro',
  subtitle: 'Marcador de página com nome e imagem personalizada.',
  description:
    'Gera um marcador de livro com silhueta decorativa no topo e nome gravado no corpo. Inclui encaixe para prender na página.',
  category: 'tools',
  difficulty: 'easy',
  tags: ['marcador', 'livro', 'bookmark', 'nome', 'imagem', 'personalizado'],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Bookmark', filename: 'bookmark' },
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
      name: 'Texto',
      parameterOrder: ['Name', 'Font', 'Name_Size', 'Name_Depth'],
      parameters: {
        Name: {
          type: 'string',
          description: 'Nome para gravar no marcador',
          default: 'Maria',
          maxLength: 30,
        },
        Font: {
          type: 'select',
          description: 'Fonte do texto',
          default: 'Bebas Neue',
          options: [
            'Bebas Neue',
            'Dancing Script',
            'Great Vibes',
            'Lobster',
            'Montserrat',
            'Pacifico',
            'Roboto Mono',
            'Sacramento',
          ],
        },
        Name_Size: {
          type: 'number',
          description: 'Tamanho do texto (mm)',
          default: 8,
          min: 4,
          max: 16,
          step: 1,
        },
        Name_Depth: {
          type: 'number',
          description: 'Profundidade da gravação (mm)',
          default: 1,
          min: 0.5,
          max: 2,
          step: 0.5,
        },
      },
    },
    {
      name: 'Tamanho',
      parameterOrder: [
        'Size',
        'Bookmark_Width',
        'Bookmark_Length',
        'Thickness',
      ],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 40,
          min: 20,
          max: 80,
          step: 5,
        },
        Bookmark_Width: {
          type: 'number',
          description: 'Largura do marcador (mm)',
          default: 25,
          min: 15,
          max: 50,
          step: 5,
        },
        Bookmark_Length: {
          type: 'number',
          description: 'Comprimento do corpo (mm)',
          default: 80,
          min: 40,
          max: 150,
          step: 10,
        },
        Thickness: {
          type: 'number',
          description: 'Espessura (mm)',
          default: 2,
          min: 1,
          max: 4,
          step: 0.5,
        },
      },
    },
    {
      name: 'Encaixe',
      parameterOrder: ['Clip_Length', 'Page_Thickness'],
      parameters: {
        Clip_Length: {
          type: 'number',
          description: 'Comprimento da fenda (mm)',
          default: 15,
          min: 8,
          max: 30,
          step: 5,
        },
        Page_Thickness: {
          type: 'number',
          description: 'Espessura da fenda para a página (mm)',
          default: 1.5,
          min: 0.5,
          max: 3,
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
