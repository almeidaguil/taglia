import type { ModelDefinition } from '../types'

export const squareNfcKeychain: ModelDefinition = {
  id: 'square-nfc-keychain',
  slug: 'square-nfc-keychain',
  title: 'Chaveiro NFC Quadrado',
  subtitle: 'Chaveiro quadrado com cavidade interna para chip NFC e nome gravado. Technologia + estilo.',
  category: 'keychains',
  difficulty: 'medium',
  tags: ['chaveiro', 'nfc', 'tecnologia', 'quadrado', 'nome', 'personalizado'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'SquareNFC-Keychain' },
  ],
  scadFile: 'square-nfc-keychain.scad',
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
      parameterOrder: ['Name_Size', 'Side', 'Corner_Radius', 'Thickness'],
      parameters: {
        Name_Size: {
          type: 'number',
          description: 'Tamanho do nome (mm)',
          default: 28,
          min: 10,
          max: 50,
          step: 2,
        },
        Side: {
          type: 'number',
          description: 'Tamanho do lado (mm)',
          default: 45,
          min: 30,
          max: 70,
          step: 5,
        },
        Corner_Radius: {
          type: 'number',
          description: 'Raio dos cantos (mm)',
          default: 6,
          min: 0,
          max: 15,
          step: 1,
        },
        Thickness: {
          type: 'number',
          description: 'Espessura total (mm)',
          default: 5,
          min: 3,
          max: 8,
          step: 0.5,
        },
      },
    },
    {
      name: 'Chip NFC',
      parameterOrder: ['NFC_Width', 'NFC_Height', 'NFC_Depth'],
      parameters: {
        NFC_Width: {
          type: 'number',
          description: 'Largura da cavidade NFC (mm)',
          default: 26,
          min: 20,
          max: 40,
          step: 1,
        },
        NFC_Height: {
          type: 'number',
          description: 'Altura da cavidade NFC (mm)',
          default: 26,
          min: 20,
          max: 40,
          step: 1,
        },
        NFC_Depth: {
          type: 'number',
          description: 'Profundidade da cavidade (mm)',
          default: 1.2,
          min: 0.5,
          max: 3,
          step: 0.1,
        },
      },
    },
    {
      name: 'Acabamento',
      parameterOrder: ['Text_Depth', 'Ring_Hole_D'],
      parameters: {
        Text_Depth: {
          type: 'number',
          description: 'Profundidade da gravação (mm)',
          default: 1.2,
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
