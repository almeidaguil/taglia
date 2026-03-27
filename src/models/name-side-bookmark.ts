import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

interface BookmarkParams {
  pointsStr: string
  pathsStr: string
  pointCount: number
  name: string
  font: string
  bookmarkWidth: number
  bookmarkLength: number
  thickness: number
  nameSize: number
  nameDepth: number
  clipLength: number
  pageThickness: number
}

function buildBookmarkTemplate(p: BookmarkParams): string {
  return `// Marcador de Livro — gerado pelo Taglia
// ${p.pointCount} ponto(s) no contorno da silhueta

Bookmark_Width  = ${p.bookmarkWidth};
Bookmark_Length = ${p.bookmarkLength};
Thickness       = ${p.thickness};
Name            = "${p.name}";
Name_Size       = ${p.nameSize};
Name_Depth      = ${p.nameDepth};
Font            = "${p.font}";
Clip_Length      = ${p.clipLength};
Page_Thickness   = ${p.pageThickness};

module shape_outer() {
  polygon(points = ${p.pointsStr}, paths = ${p.pathsStr}, convexity = 10);
}

module body() {
  translate([0, -Bookmark_Length / 2, 0])
    linear_extrude(Thickness, convexity = 10)
    square([Bookmark_Width, Bookmark_Length], center = true);
}

module decoration() {
  linear_extrude(Thickness, convexity = 10)
    shape_outer();
}

module name_text() {
  translate([0, -Bookmark_Length / 4, Thickness - Name_Depth])
    linear_extrude(Name_Depth + 0.1, convexity = 10)
    rotate([0, 0, 90])
    text(Name, size = Name_Size, font = str(Font, ":style=Bold"), halign = "center", valign = "center");
}

module page_slot() {
  translate([0, -Bookmark_Length + Clip_Length / 2, Thickness / 2])
    cube([Bookmark_Width - 2, Clip_Length, Page_Thickness], center = true);
}

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
  const threshold = values['Threshold'] as number
  const { pointsStr, pathsStr, pointCount } = await traceImageToScadPolygon(
    dataUrl,
    sizeMm,
    threshold,
  )

  return buildBookmarkTemplate({
    pointsStr,
    pathsStr,
    pointCount,
    name: values['Name'] as string,
    font: values['Font'] as string,
    bookmarkWidth: values['Bookmark_Width'] as number,
    bookmarkLength: values['Bookmark_Length'] as number,
    thickness: values['Thickness'] as number,
    nameSize: values['Name_Size'] as number,
    nameDepth: values['Name_Depth'] as number,
    clipLength: values['Clip_Length'] as number,
    pageThickness: values['Page_Thickness'] as number,
  })
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
