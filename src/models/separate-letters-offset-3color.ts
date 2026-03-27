import type { ModelDefinition } from '../types'

export const separateLettersOffset3Color: ModelDefinition = {
  id: 'separate-letters-offset-3color',
  slug: 'separate-letters-offset-3color',
  title: 'Letras Separadas - 3 Cores',
  subtitle: 'Letras individuais 3D em 3 camadas coloridas. Digite uma letra por vez e imprima cada peça separadamente.',
  category: 'signs',
  difficulty: 'easy',
  tags: ['letras', 'alfabeto', 'separado', 'decoração', '3 cores', 'personalizado'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'Letter-3C-Base' },
    { format: 'stl', parameter: 'Middle', filename: 'Letter-3C-Middle' },
    { format: 'stl', parameter: 'Top', filename: 'Letter-3C-Top' },
  ],
  scadFile: 'separate-letters-offset-3color.scad',
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
      parameterOrder: ['Offset', 'Tolerance', 'Base_Height', 'Layer_Height'],
      parameters: {
        Offset: {
          type: 'number',
          description: 'Deslocamento entre camadas (mm)',
          default: 2,
          min: 0.5,
          max: 8,
          step: 0.5,
        },
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
          description: 'Altura de cada camada (mm)',
          default: 4,
          min: 2,
          max: 12,
          step: 0.5,
        },
      },
    },
    {
      name: 'Cores (para referência visual)',
      parameterOrder: ['Base_Color', 'Middle_Color', 'Top_Color'],
      parameters: {
        Base_Color: {
          type: 'color',
          description: 'Cor da base',
          default: '#1a1a2e',
        },
        Middle_Color: {
          type: 'color',
          description: 'Cor do meio',
          default: '#e94560',
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
