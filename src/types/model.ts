export type ParameterType = 'string' | 'number' | 'boolean' | 'select' | 'color' | 'image'

export interface BaseParameter {
  type: ParameterType
  description: string
  default: string | number | boolean
}

export interface StringParameter extends BaseParameter {
  type: 'string'
  default: string
  maxLength?: number
}

export interface NumberParameter extends BaseParameter {
  type: 'number'
  default: number
  min: number
  max: number
  step: number
}

export interface BooleanParameter extends BaseParameter {
  type: 'boolean'
  default: boolean
}

export interface SelectParameter extends BaseParameter {
  type: 'select'
  default: string
  options: string[]
}

export interface ColorParameter extends BaseParameter {
  type: 'color'
  default: string
}

export interface ImageParameter extends BaseParameter {
  type: 'image'
  default: string
  accept: string[]
}

export type Parameter =
  | StringParameter
  | NumberParameter
  | BooleanParameter
  | SelectParameter
  | ColorParameter
  | ImageParameter

export interface ParameterSection {
  name: string
  parameterOrder: string[]
  parameters: Record<string, Parameter>
}

export interface ExportOption {
  format: 'stl' | '3mf'
  parameter: string
  filename: string
}

export type ModelCategory =
  | 'signs'
  | 'keychains'
  | 'kitchen'
  | 'string-art'
  | 'image-based'
  | 'tools'

export interface ModelDefinition {
  id: string
  slug: string
  title: string
  subtitle: string
  description?: string
  category: ModelCategory
  tags: string[]
  sections: ParameterSection[]
  exportOptions: ExportOption[]
  /** Arquivo .scad template (modelos padrão) */
  scadFile?: string
  /** Geração dinâmica de código SCAD (modelos baseados em imagem) */
  generateScadCode?: (values: ParameterValues, exportParam: string) => Promise<string>
  coverImage?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type ParameterValues = Record<string, string | number | boolean>

export type RenderStatus = 'idle' | 'rendering' | 'done' | 'error'

export interface RenderResult {
  status: RenderStatus
  blob?: Blob
  format?: 'stl' | '3mf'
  error?: string
}
