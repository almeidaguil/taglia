import type { ModelDefinition } from '../types'

export const fullNameKeychain: ModelDefinition = {
  id: 'full-name-keychain',
  slug: 'full-name-keychain',
  title: 'Chaveiro Nome Completo',
  subtitle: 'Chaveiro personalizado com seu nome. Simples, elegante e pronto para imprimir em uma cor.',
  category: 'keychains',
  difficulty: 'easy',
  tags: ['chaveiro', 'nome', 'presente', 'personalizado', 'simples'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'NameKeychain' },
  ],
  scadFile: 'full-name-keychain.scad',
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
      parameterOrder: ['Name_Size', 'Padding', 'Thickness'],
      parameters: {
        Name_Size: {
          type: 'number',
          description: 'Tamanho do nome (mm)',
          default: 50,
          min: 20,
          max: 120,
          step: 5,
        },
        Padding: {
          type: 'number',
          description: 'Margem ao redor do texto (mm)',
          default: 5,
          min: 2,
          max: 15,
          step: 1,
        },
        Thickness: {
          type: 'number',
          description: 'Espessura do chaveiro (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 0.5,
        },
      },
    },
    {
      name: 'Anel',
      parameterOrder: ['Ring_Hole_D'],
      parameters: {
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
