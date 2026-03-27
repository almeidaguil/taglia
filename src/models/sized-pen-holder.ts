import type { ModelDefinition } from '../types'

export const sizedPenHolder: ModelDefinition = {
  id: 'sized-pen-holder',
  slug: 'sized-pen-holder',
  title: 'Porta-canetas Paramétrico',
  subtitle: 'Porta-canetas com furos de diferentes diâmetros para organizar canetas, lápis e marcadores.',
  category: 'tools',
  difficulty: 'easy',
  tags: ['porta-canetas', 'organizador', 'escrivaninha', 'escritório', 'canetas', 'lápis'],
  exportOptions: [
    { format: 'stl', parameter: 'Base', filename: 'PenHolder' },
  ],
  scadFile: 'sized-pen-holder.scad',
  sections: [
    {
      name: 'Dimensões',
      parameterOrder: ['Outer_D', 'Height', 'Wall', 'Base_H'],
      parameters: {
        Outer_D: {
          type: 'number',
          description: 'Diâmetro externo (mm)',
          default: 80,
          min: 50,
          max: 150,
          step: 5,
        },
        Height: {
          type: 'number',
          description: 'Altura (mm)',
          default: 100,
          min: 60,
          max: 200,
          step: 10,
        },
        Wall: {
          type: 'number',
          description: 'Espessura da parede (mm)',
          default: 4,
          min: 2,
          max: 8,
          step: 0.5,
        },
        Base_H: {
          type: 'number',
          description: 'Espessura da base (mm)',
          default: 3,
          min: 2,
          max: 8,
          step: 0.5,
        },
      },
    },
    {
      name: 'Furos',
      parameterOrder: ['Hole1_D', 'Hole2_D', 'Hole3_D', 'Holes_Per_Ring'],
      parameters: {
        Hole1_D: {
          type: 'number',
          description: 'Diâmetro furo pequeno (mm)',
          default: 8,
          min: 5,
          max: 15,
          step: 0.5,
        },
        Hole2_D: {
          type: 'number',
          description: 'Diâmetro furo médio (mm)',
          default: 10,
          min: 6,
          max: 20,
          step: 0.5,
        },
        Hole3_D: {
          type: 'number',
          description: 'Diâmetro furo grande (mm)',
          default: 14,
          min: 8,
          max: 25,
          step: 0.5,
        },
        Holes_Per_Ring: {
          type: 'number',
          description: 'Furos por anel',
          default: 6,
          min: 3,
          max: 12,
          step: 1,
        },
      },
    },
  ],
}
