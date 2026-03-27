import type { ModelDefinition } from '../types'

export const rectangleNameKeychain: ModelDefinition = {
  id: 'rectangle-name-keychain',
  slug: 'rectangle-name-keychain',
  title: 'Chaveiro Retangular',
  subtitle: 'Chaveiro retangular com nome gravado. Design clássico e elegante.',
  category: 'keychains',
  difficulty: 'easy',
  tags: [
    'chaveiro',
    'retângulo',
    'nome',
    'gravado',
    'presente',
    'personalizado',
  ],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'RectKeychain' },
  ],
  scadFile: 'rectangle-name-keychain.scad',
  sections: [
    {
      name: 'default',
      parameterOrder: ['Name', 'Font'],
      parameters: {
        Name: {
          type: 'string',
          description: 'Nome',
          default: 'Maria',
        },
        Font: {
          type: 'select',
          description: 'Fonte',
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
      },
    },
    {
      name: 'Tamanho',
      parameterOrder: [
        'Name_Size',
        'Rect_Width',
        'Rect_Height',
        'Corner_Radius',
      ],
      parameters: {
        Name_Size: {
          type: 'number',
          description: 'Tamanho do nome (mm)',
          default: 40,
          min: 15,
          max: 90,
          step: 5,
        },
        Rect_Width: {
          type: 'number',
          description: 'Largura do chaveiro (mm)',
          default: 70,
          min: 30,
          max: 130,
          step: 5,
        },
        Rect_Height: {
          type: 'number',
          description: 'Altura do chaveiro (mm)',
          default: 30,
          min: 15,
          max: 60,
          step: 5,
        },
        Corner_Radius: {
          type: 'number',
          description: 'Raio dos cantos (mm)',
          default: 5,
          min: 0,
          max: 15,
          step: 1,
        },
      },
    },
    {
      name: 'Acabamento',
      parameterOrder: ['Thickness', 'Border', 'Ring_Hole_D'],
      parameters: {
        Thickness: {
          type: 'number',
          description: 'Espessura (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 0.5,
        },
        Border: {
          type: 'number',
          description: 'Largura da borda (mm)',
          default: 1.5,
          min: 0.8,
          max: 4,
          step: 0.5,
        },
        Ring_Hole_D: {
          type: 'number',
          description: 'Diâmetro do furo do anel (mm)',
          default: 6,
          min: 4,
          max: 12,
          step: 0.5,
        },
      },
    },
  ],
}
