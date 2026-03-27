import type { ModelDefinition } from '../types'

export const scratchOffCounter: ModelDefinition = {
  id: 'scratch-off-counter',
  slug: 'scratch-off-counter',
  title: 'Contador Raspadinha',
  subtitle:
    'Grade de círculos numerados para riscar. Use como calendário do advento, tracker de desafios ou contador.',
  category: 'tools',
  difficulty: 'easy',
  tags: [
    'contador',
    'raspadinha',
    'calendário',
    'advento',
    'desafio',
    'tracker',
    'números',
  ],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'ScratchCounter' },
  ],
  scadFile: 'scratch-off-counter.scad',
  sections: [
    {
      name: 'Grade',
      parameterOrder: ['Cols', 'Rows', 'Circle_D', 'Spacing'],
      parameters: {
        Cols: {
          type: 'number',
          description: 'Colunas',
          default: 5,
          min: 2,
          max: 10,
          step: 1,
        },
        Rows: {
          type: 'number',
          description: 'Linhas',
          default: 6,
          min: 2,
          max: 10,
          step: 1,
        },
        Circle_D: {
          type: 'number',
          description: 'Diâmetro de cada círculo (mm)',
          default: 22,
          min: 12,
          max: 40,
          step: 2,
        },
        Spacing: {
          type: 'number',
          description: 'Espaço entre círculos (mm)',
          default: 4,
          min: 2,
          max: 10,
          step: 1,
        },
      },
    },
    {
      name: 'Números',
      parameterOrder: ['Number_Size', 'Font'],
      parameters: {
        Number_Size: {
          type: 'number',
          description: 'Tamanho dos números (mm)',
          default: 8,
          min: 4,
          max: 16,
          step: 1,
        },
        Font: {
          type: 'select',
          description: 'Fonte',
          default: 'Bebas Neue',
          options: ['Bebas Neue', 'Montserrat', 'Roboto Mono'],
        },
      },
    },
    {
      name: 'Estrutura',
      parameterOrder: ['Base_H', 'Wall', 'Recess_D', 'Recess_Depth'],
      parameters: {
        Base_H: {
          type: 'number',
          description: 'Espessura da base (mm)',
          default: 3,
          min: 2,
          max: 6,
          step: 0.5,
        },
        Wall: {
          type: 'number',
          description: 'Margem da borda (mm)',
          default: 3,
          min: 1,
          max: 10,
          step: 1,
        },
        Recess_D: {
          type: 'number',
          description: 'Diâmetro do recesso (mm)',
          default: 18,
          min: 10,
          max: 35,
          step: 1,
        },
        Recess_Depth: {
          type: 'number',
          description: 'Profundidade do recesso (mm)',
          default: 0.8,
          min: 0.4,
          max: 2,
          step: 0.2,
        },
      },
    },
  ],
}
