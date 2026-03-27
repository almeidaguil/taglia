import type { ModelDefinition } from '../types'

export const socialHandleOffset2Color: ModelDefinition = {
  id: 'social-handle-offset-2color',
  slug: 'social-handle-offset-2color',
  title: 'Social Handle - 2 Cores',
  subtitle: 'Letreiro com seu @ das redes sociais em 2 camadas coloridas.',
  category: 'signs',
  difficulty: 'easy',
  tags: [
    'instagram',
    'tiktok',
    'social',
    'handle',
    'arroba',
    'letreiro',
    '2 cores',
  ],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'SocialHandle-2C-Base' },
    { format: 'stl', parameter: 'Top', filename: 'SocialHandle-2C-Top' },
  ],
  scadFile: 'social-handle-offset-2color.scad',
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
          default: 200,
          min: 60,
          max: 350,
          step: 5,
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
          default: '#833ab4',
        },
        Top_Color: {
          type: 'color',
          description: 'Cor do topo',
          default: '#fcb045',
        },
      },
    },
  ],
}
