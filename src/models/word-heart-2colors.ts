import type { ModelDefinition } from '../types'

export const wordHeart2Colors: ModelDefinition = {
  id: 'word-heart-2colors',
  slug: 'word-heart-2colors',
  title: 'Letreiro com Coração',
  subtitle: 'Dois nomes com um coração entre eles. Perfeito para casais e datas especiais.',
  category: 'signs',
  difficulty: 'easy',
  tags: ['coração', 'casal', 'amor', 'letreiro', 'decoração', 'presente', 'aniversário'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'WordHeart-Base' },
    { format: 'stl', parameter: 'Top', filename: 'WordHeart-Top' },
  ],
  scadFile: 'word-heart-2colors.scad',
  sections: [
    {
      name: 'Nomes',
      parameterOrder: ['Word1', 'Word2', 'Font'],
      parameters: {
        Word1: {
          type: 'string',
          description: 'Nome 1 (esquerda)',
          default: 'Ana',
        },
        Word2: {
          type: 'string',
          description: 'Nome 2 (direita)',
          default: 'João',
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
      parameterOrder: ['Word_Size', 'Heart_Size', 'Spacing', 'Base_Width'],
      parameters: {
        Word_Size: {
          type: 'number',
          description: 'Tamanho de cada nome (mm)',
          default: 80,
          min: 30,
          max: 150,
          step: 5,
        },
        Heart_Size: {
          type: 'number',
          description: 'Tamanho do coração (mm)',
          default: 40,
          min: 15,
          max: 80,
          step: 5,
        },
        Spacing: {
          type: 'number',
          description: 'Espaço entre elementos (mm)',
          default: 15,
          min: 5,
          max: 40,
          step: 5,
        },
        Base_Width: {
          type: 'number',
          description: 'Largura da base (mm)',
          default: 270,
          min: 100,
          max: 400,
          step: 10,
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
          default: '#e94560',
        },
      },
    },
  ],
}
