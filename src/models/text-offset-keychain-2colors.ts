import type { ModelDefinition } from '../types'

export const textOffsetKeychain2Colors: ModelDefinition = {
  id: 'text-offset-keychain-2colors',
  slug: 'text-offset-keychain-2colors',
  title: 'Chaveiro 2 Cores',
  subtitle:
    'Chaveiro bicolorido com texto em relevo. Design moderno para presentear.',
  category: 'keychains',
  difficulty: 'easy',
  tags: ['chaveiro', '2 cores', 'nome', 'relevo', 'presente', 'personalizado'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'Keychain-2C-Base' },
    { format: 'stl', parameter: 'Top', filename: 'Keychain-2C-Top' },
  ],
  scadFile: 'text-offset-keychain-2colors.scad',
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
          default: 75,
          min: 30,
          max: 130,
          step: 5,
        },
        Rect_Height: {
          type: 'number',
          description: 'Altura do chaveiro (mm)',
          default: 32,
          min: 15,
          max: 60,
          step: 2,
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
      name: 'Ajustes',
      parameterOrder: [
        'Tolerance',
        'Base_Height',
        'Layer_Height',
        'Ring_Hole_D',
      ],
      parameters: {
        Tolerance: {
          type: 'number',
          description: 'Tolerância de encaixe (mm)',
          default: 0.2,
          min: 0.1,
          max: 0.5,
          step: 0.05,
        },
        Base_Height: {
          type: 'number',
          description: 'Altura da base (mm)',
          default: 3,
          min: 1.5,
          max: 6,
          step: 0.5,
        },
        Layer_Height: {
          type: 'number',
          description: 'Altura do texto (mm)',
          default: 3,
          min: 1.5,
          max: 6,
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
    {
      name: 'Cores (para referência visual)',
      parameterOrder: ['Base_Color', 'Top_Color'],
      parameters: {
        Base_Color: {
          type: 'color',
          description: 'Cor da base',
          default: '#1a1a2e',
        },
        Top_Color: {
          type: 'color',
          description: 'Cor do texto',
          default: '#f5f5f5',
        },
      },
    },
  ],
}
