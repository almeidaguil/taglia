import type { ModelDefinition } from '../types'

export const bunnyNameKeychain: ModelDefinition = {
  id: 'bunny-name-keychain',
  slug: 'bunny-name-keychain',
  title: 'Chaveiro Coelho',
  subtitle:
    'Adorável chaveiro em formato de coelho com seu nome gravado. Ideal para crianças e amantes de animais.',
  category: 'keychains',
  difficulty: 'easy',
  tags: ['chaveiro', 'coelho', 'fofo', 'nome', 'presente', 'criança', 'animal'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'BunnyKeychain' },
  ],
  scadFile: 'bunny-name-keychain.scad',
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
      parameterOrder: ['Name_Size', 'Bunny_Size'],
      parameters: {
        Name_Size: {
          type: 'number',
          description: 'Tamanho do nome (mm)',
          default: 20,
          min: 10,
          max: 40,
          step: 5,
        },
        Bunny_Size: {
          type: 'number',
          description: 'Tamanho do coelho (mm)',
          default: 55,
          min: 30,
          max: 90,
          step: 5,
        },
      },
    },
    {
      name: 'Acabamento',
      parameterOrder: ['Thickness', 'Text_Depth', 'Ring_Hole_D'],
      parameters: {
        Thickness: {
          type: 'number',
          description: 'Espessura (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 0.5,
        },
        Text_Depth: {
          type: 'number',
          description: 'Profundidade da gravação (mm)',
          default: 1.5,
          min: 0.5,
          max: 3,
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
