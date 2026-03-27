import type { ModelDefinition } from '../types'

export const circleNfcKeychain: ModelDefinition = {
  id: 'circle-nfc-keychain',
  slug: 'circle-nfc-keychain',
  title: 'Chaveiro NFC Circular',
  subtitle: 'Chaveiro circular com cavidade para chip NFC e nome gravado. Design minimalista e funcional.',
  category: 'keychains',
  difficulty: 'medium',
  tags: ['chaveiro', 'nfc', 'tecnologia', 'circular', 'nome', 'personalizado'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'CircleNFC-Keychain' },
  ],
  scadFile: 'circle-nfc-keychain.scad',
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
      parameterOrder: ['Name_Size', 'Diameter', 'Thickness'],
      parameters: {
        Name_Size: {
          type: 'number',
          description: 'Tamanho do nome (mm)',
          default: 25,
          min: 10,
          max: 45,
          step: 2,
        },
        Diameter: {
          type: 'number',
          description: 'Diâmetro do chaveiro (mm)',
          default: 45,
          min: 30,
          max: 70,
          step: 5,
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
      parameterOrder: ['NFC_Diameter', 'NFC_Depth'],
      parameters: {
        NFC_Diameter: {
          type: 'number',
          description: 'Diâmetro da cavidade NFC (mm)',
          default: 28,
          min: 20,
          max: 45,
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
