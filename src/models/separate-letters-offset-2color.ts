import type { ModelDefinition } from '../types'

export const separateLettersOffset2Color: ModelDefinition = {
  id: 'separate-letters-offset-2color',
  slug: 'separate-letters-offset-2color',
  title: 'Letras Separadas - 2 Cores',
  subtitle:
    'Letras individuais 3D em 2 camadas coloridas. Digite uma letra por vez e imprima cada peça separadamente.',
  category: 'signs',
  difficulty: 'easy',
  tags: [
    'letras',
    'alfabeto',
    'separado',
    'decoração',
    '2 cores',
    'personalizado',
  ],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'Letter-2C-Base' },
    { format: 'stl', parameter: 'Top', filename: 'Letter-2C-Top' },
  ],
  scadFile: 'separate-letters-offset-2color.scad',
  sections: [
    {
      name: 'default',
      parameterOrder: ['Letter', 'Font'],
      parameters: {
        Letter: {
          type: 'string',
          description: 'Uma letra (ex: A, B, C)',
          default: 'A',
          maxLength: 1,
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
      parameterOrder: ['Letter_Size', 'Padding'],
      parameters: {
        Letter_Size: {
          type: 'number',
          description: 'Tamanho da letra (mm)',
          default: 60,
          min: 20,
          max: 150,
          step: 5,
        },
        Padding: {
          type: 'number',
          description: 'Margem ao redor da letra (mm)',
          default: 6,
          min: 2,
          max: 20,
          step: 1,
        },
      },
    },
    {
      name: 'Ajustes',
      parameterOrder: ['Tolerance', 'Base_Height', 'Layer_Height'],
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
          min: 1,
          max: 10,
          step: 0.5,
        },
        Layer_Height: {
          type: 'number',
          description: 'Altura da camada de texto (mm)',
          default: 4,
          min: 2,
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
          description: 'Cor do topo',
          default: '#f5f5f5',
        },
      },
    },
  ],
}
