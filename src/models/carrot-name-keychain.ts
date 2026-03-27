import type { ModelDefinition } from '../types'

export const carrotNameKeychain: ModelDefinition = {
  id: 'carrot-name-keychain',
  slug: 'carrot-name-keychain',
  title: 'Chaveiro Cenoura',
  subtitle: 'Fofo chaveiro em formato de cenoura com seu nome gravado. Perfeito para fãs de coelhinhos!',
  category: 'keychains',
  difficulty: 'easy',
  tags: ['chaveiro', 'cenoura', 'fofo', 'nome', 'presente', 'criança'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'CarrotKeychain' },
  ],
  scadFile: 'carrot-name-keychain.scad',
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
      parameterOrder: ['Name_Size', 'Carrot_Width', 'Carrot_Height'],
      parameters: {
        Name_Size: {
          type: 'number',
          description: 'Tamanho do nome (mm)',
          default: 25,
          min: 10,
          max: 50,
          step: 5,
        },
        Carrot_Width: {
          type: 'number',
          description: 'Largura da cenoura (mm)',
          default: 28,
          min: 15,
          max: 50,
          step: 2,
        },
        Carrot_Height: {
          type: 'number',
          description: 'Comprimento da cenoura (mm)',
          default: 65,
          min: 40,
          max: 100,
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
