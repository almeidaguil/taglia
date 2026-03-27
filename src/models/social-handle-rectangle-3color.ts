import type { ModelDefinition } from '../types'

export const socialHandleRectangle3Color: ModelDefinition = {
  id: 'social-handle-rectangle-3color',
  slug: 'social-handle-rectangle-3color',
  title: 'Social Handle Retângulo - 3 Cores',
  subtitle:
    'Handle das redes sociais sobre base retangular em 3 camadas coloridas.',
  category: 'signs',
  difficulty: 'easy',
  tags: [
    'instagram',
    'tiktok',
    'social',
    'handle',
    'retângulo',
    'letreiro',
    '3 cores',
  ],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'SocialRect-3C-Base' },
    { format: 'stl', parameter: 'Middle', filename: 'SocialRect-3C-Middle' },
    { format: 'stl', parameter: 'Top', filename: 'SocialRect-3C-Top' },
  ],
  scadFile: 'social-handle-rectangle-3color.scad',
  sections: [
    {
      name: 'default',
      parameterOrder: ['Handle', 'Show_At', 'Font'],
      parameters: {
        Handle: {
          type: 'string',
          description: 'Nome do perfil (sem @)',
          default: 'mafa3d',
        },
        Show_At: {
          type: 'boolean',
          description: 'Mostrar @ antes do handle',
          default: true,
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
        'Target_Size',
        'Rect_Width',
        'Rect_Height',
        'Corner_Radius',
      ],
      parameters: {
        Target_Size: {
          type: 'number',
          description: 'Tamanho do texto (mm)',
          default: 140,
          min: 40,
          max: 280,
          step: 1,
        },
        Rect_Width: {
          type: 'number',
          description: 'Largura do retângulo (mm)',
          default: 220,
          min: 80,
          max: 400,
          step: 5,
        },
        Rect_Height: {
          type: 'number',
          description: 'Altura do retângulo (mm)',
          default: 80,
          min: 30,
          max: 200,
          step: 5,
        },
        Corner_Radius: {
          type: 'number',
          description: 'Raio dos cantos (mm)',
          default: 8,
          min: 0,
          max: 30,
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
