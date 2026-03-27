import type { ModelDefinition, ParameterValues } from '../types'
import { traceImageToScadPolygon } from '../utils/imageTrace'

async function generateScadCode(values: ParameterValues, _exportParam: string): Promise<string> {
  const dataUrl = values['Image'] as string
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Nenhuma imagem enviada. Faça upload de uma imagem antes de gerar.')
  }

  const sizeMm      = values['Size'] as number
  const layerH      = values['Layer_Height'] as number
  const offsetStep  = values['Offset_Step'] as number
  const layers      = values['Layers'] as number
  const threshold   = values['Threshold'] as number

  const { pointsStr, pathsStr, pointCount } =
    await traceImageToScadPolygon(dataUrl, sizeMm, threshold)

  // Gera camadas: camada base é a maior (offset * (layers-1)), topo é a silhueta exata.
  // Cada camada i (0=base, layers-1=topo) tem offset = (layers-1-i) * Offset_Step.
  // A altura acumulada de cada camada é Layer_Height, empilhadas de baixo para cima.
  const layerLines: string[] = []
  for (let i = 0; i < layers; i++) {
    const r = (layers - 1 - i) * offsetStep
    const z = i * layerH
    const h = (layers - i) * layerH  // cada camada se estende até o topo para preencher
    const offsetExpr = r > 0 ? `offset(r = ${r.toFixed(1)}) ` : ''
    layerLines.push(
      `  // Camada ${i + 1} (z=${z}mm, offset r=${r}mm)\n` +
      `  translate([0, 0, ${z}])\n` +
      `    linear_extrude(${h.toFixed(1)}, convexity = 10)\n` +
      `      ${offsetExpr}shape_outer();`
    )
  }

  return `// Imagem para 3D com Offset — gerado pelo Taglia
// ${pointCount} ponto(s) | ${layers} camadas, passo ${offsetStep}mm, altura ${layerH}mm/camada

Layer_Height = ${layerH};
Offset_Step  = ${offsetStep};

module shape_outer() {
  polygon(points = ${pointsStr}, paths = ${pathsStr}, convexity = 10);
}

// Camadas empilhadas: cada uma um pouco menor que a anterior (efeito topográfico/offset).
// Para impressão multi-cor: trocar filamento a cada ${layerH}mm de altura.
union() {
${layerLines.join('\n\n')}
}
`
}

export const imageTo3dOffset: ModelDefinition = {
  id: 'image-to3d-offset',
  slug: 'image-to3d-offset',
  title: 'Imagem para 3D com Offset',
  subtitle: 'Silhueta em camadas offset para efeito topográfico multi-cor.',
  description: 'Transforma qualquer silhueta em um relevo 3D em camadas escalonadas. Cada camada pode ser impressa em uma cor diferente trocando o filamento — cria um efeito visual de profundidade e bordas.',
  category: 'tools',
  difficulty: 'easy',
  tags: ['imagem', 'silhueta', 'offset', '3d', 'multicolor', 'relevo', 'camadas', 'topográfico'],
  generateScadCode,
  exportOptions: [
    { format: 'stl', parameter: 'Model', filename: 'image-3d-offset' },
  ],
  sections: [
    {
      name: 'default',
      parameterOrder: ['Image'],
      parameters: {
        Image: {
          type: 'image',
          description: 'Imagem',
          default: '',
          accept: ['image/png', 'image/jpeg', 'image/webp'],
        },
      },
    },
    {
      name: 'Tamanho',
      parameterOrder: ['Size'],
      parameters: {
        Size: {
          type: 'number',
          description: 'Tamanho da silhueta (mm — lado maior)',
          default: 60,
          min: 20,
          max: 150,
          step: 5,
        },
      },
    },
    {
      name: 'Camadas',
      parameterOrder: ['Layers', 'Layer_Height', 'Offset_Step'],
      parameters: {
        Layers: {
          type: 'number',
          description: 'Número de camadas (cores)',
          default: 3,
          min: 1,
          max: 5,
          step: 1,
        },
        Layer_Height: {
          type: 'number',
          description: 'Altura de cada camada (mm)',
          default: 2,
          min: 0.5,
          max: 8,
          step: 0.5,
        },
        Offset_Step: {
          type: 'number',
          description: 'Passo de offset entre camadas (mm)',
          default: 2,
          min: 0.5,
          max: 8,
          step: 0.5,
        },
      },
    },
    {
      name: 'Ajuste',
      parameterOrder: ['Threshold'],
      parameters: {
        Threshold: {
          type: 'number',
          description: 'Limiar de binarização (0 = mais escuro)',
          default: 128,
          min: 10,
          max: 245,
          step: 5,
        },
      },
    },
  ],
}
