import type { ModelDefinition } from '../types'

export const candyMoldRounded: ModelDefinition = {
  id: 'candy-mold-rounded',
  slug: 'candy-mold-rounded',
  title: 'Forminha Arredondada',
  subtitle: 'Molde com cavidades cilíndricas de fundo arredondado para docinhos com formato mais suave.',
  category: 'kitchen',
  difficulty: 'easy',
  tags: ['brigadeiro', 'doce', 'molde', 'cozinha', 'confeitaria', 'arredondado'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'CandyMold-Rounded' },
  ],
  scadFile: 'candy-mold-rounded.scad',
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
      parameterOrder: ['Cavity_D', 'Cavity_Depth', 'Round_Base', 'Spacing'],
      parameters: {
        Cavity_D: {
          type: 'number',
          description: 'Diâmetro da cavidade (mm)',
          default: 32,
          min: 20,
          max: 60,
          step: 2,
        },
        Cavity_Depth: {
          type: 'number',
          description: 'Profundidade da cavidade (mm)',
          default: 15,
          min: 8,
          max: 25,
          step: 1,
        },
        Round_Base: {
          type: 'number',
          description: 'Arredondamento do fundo (mm)',
          default: 8,
          min: 2,
          max: 15,
          step: 1,
        },
        Spacing: {
          type: 'number',
          description: 'Espaço entre cavidades (mm)',
          default: 6,
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
