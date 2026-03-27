import type { ModelDefinition } from '../types'

export const wordOffset2Color: ModelDefinition = {
  id: 'word-offset-2color',
  slug: 'word-offset-2color',
  title: 'Letreiro de Palavra - 2 Camadas',
  subtitle: 'Letreiro bicolorido com efeito 3D deslocado. Imprime em 2 partes: base e topo.',
  category: 'signs',
  difficulty: 'easy',
  tags: ['palavra', 'letreiro', 'texto', 'decoração', 'presente', '2 cores'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'Word-2Color-Base' },
    { format: 'stl', parameter: 'Top', filename: 'Word-2Color-Top' },
  ],
  scadFile: 'word-offset-2color.scad',
  sections: [
    {
      name: 'default',
      parameterOrder: ['Text', 'Font'],
      parameters: {
        Text: {
          type: 'string',
          description: 'Texto',
          default: 'Mafa3D',
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
      parameterOrder: ['Target_Size', 'Base_Width'],
      parameters: {
        Target_Size: {
          type: 'number',
          description: 'Tamanho do texto (mm)',
          default: 150,
          min: 40,
          max: 280,
          step: 1,
        },
        Base_Width: {
          type: 'number',
          description: 'Largura da base (mm)',
          default: 180,
          min: 50,
          max: 320,
          step: 5,
        },
      },
    },
    {
      name: 'Ajustes',
      parameterOrder: ['Offset', 'Tolerance', 'Base_Height', 'Layer_Height'],
      parameters: {
        Offset: {
          type: 'number',
          description: 'Deslocamento (mm)',
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
