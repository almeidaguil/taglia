import type { ModelDefinition } from '../types'

export const socialHandleOffset2ColorQrCode: ModelDefinition = {
  id: 'social-handle-offset-2color-qr-code',
  slug: 'social-handle-offset-2color-qr-code',
  title: 'Social Handle + QR Code',
  subtitle: 'Handle das redes sociais com área de QR code. Coloque uma etiqueta de QR code ou imprima separadamente.',
  category: 'signs',
  difficulty: 'easy',
  tags: ['instagram', 'tiktok', 'social', 'qr code', 'handle', 'letreiro', '2 cores'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'SocialQR-Base' },
    { format: 'stl', parameter: 'Top', filename: 'SocialQR-Top' },
  ],
  scadFile: 'social-handle-offset-2color-qr-code.scad',
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
      parameterOrder: ['Text_Size', 'QR_Size', 'Rect_Width', 'Rect_Height', 'Corner_Radius'],
      parameters: {
        Text_Size: {
          type: 'number',
          description: 'Tamanho do texto (mm)',
          default: 100,
          min: 30,
          max: 200,
          step: 5,
        },
        QR_Size: {
          type: 'number',
          description: 'Tamanho do QR code (mm)',
          default: 70,
          min: 40,
          max: 120,
          step: 5,
        },
        Rect_Width: {
          type: 'number',
          description: 'Largura total (mm)',
          default: 280,
          min: 150,
          max: 450,
          step: 10,
        },
        Rect_Height: {
          type: 'number',
          description: 'Altura total (mm)',
          default: 100,
          min: 50,
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
      parameterOrder: ['Tolerance', 'Base_Height', 'Layer_Height', 'QR_Depth'],
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
        QR_Depth: {
          type: 'number',
          description: 'Profundidade do recesso QR (mm)',
          default: 1,
          min: 0.5,
          max: 3,
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
