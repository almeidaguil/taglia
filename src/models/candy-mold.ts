import type { ModelDefinition } from '../types'

export const candyMold: ModelDefinition = {
  id: 'candy-mold',
  slug: 'candy-mold',
  title: 'Forminha de Brigadeiro',
  subtitle: 'Molde paramétrico para fazer brigadeiros e docinhos. Configure o número de cavidades e o tamanho.',
  category: 'kitchen',
  difficulty: 'easy',
  tags: ['brigadeiro', 'doce', 'molde', 'cozinha', 'confeitaria', 'forminha'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'CandyMold' },
  ],
  scadFile: 'candy-mold.scad',
  sections: [
    {
      name: 'Grade',
      parameterOrder: ['Cols', 'Rows'],
      parameters: {
        Cols: {
          type: 'number',
          description: 'Colunas de cavidades',
          default: 4,
          min: 1,
          max: 8,
          step: 1,
        },
        Rows: {
          type: 'number',
          description: 'Linhas de cavidades',
          default: 3,
          min: 1,
          max: 6,
          step: 1,
        },
      },
    },
    {
      name: 'Cavidade',
      parameterOrder: ['Cavity_D', 'Cavity_Depth', 'Spacing'],
      parameters: {
        Cavity_D: {
          type: 'number',
          description: 'Diâmetro da cavidade (mm)',
          default: 35,
          min: 20,
          max: 60,
          step: 5,
        },
        Cavity_Depth: {
          type: 'number',
          description: 'Profundidade da cavidade (mm)',
          default: 14,
          min: 8,
          max: 25,
          step: 1,
        },
        Spacing: {
          type: 'number',
          description: 'Espaço entre cavidades (mm)',
          default: 5,
          min: 3,
          max: 15,
          step: 1,
        },
      },
    },
    {
      name: 'Estrutura',
      parameterOrder: ['Wall', 'Base_H'],
      parameters: {
        Wall: {
          type: 'number',
          description: 'Espessura da parede (mm)',
          default: 3,
          min: 2,
          max: 8,
          step: 0.5,
        },
        Base_H: {
          type: 'number',
          description: 'Espessura da base (mm)',
          default: 2,
          min: 1,
          max: 5,
          step: 0.5,
        },
      },
    },
  ],
}
