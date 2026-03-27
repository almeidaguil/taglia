import type { ModelDefinition, ParameterValues } from '../../types'
import { ParameterField } from './ParameterField'

interface ParameterPanelProps {
  model: ModelDefinition
  values: ParameterValues
  onChange: (name: string, value: string | number | boolean) => void
}

export function ParameterPanel({ model, values, onChange }: ParameterPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {model.sections.map((section) => (
        <div key={section.name} className="flex flex-col gap-3">
          {section.name !== 'default' && (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-800 pb-1">
              {section.name}
            </h3>
          )}
          {section.parameterOrder.map((paramName) => {
            const param = section.parameters[paramName]
            if (!param) return null
            return (
              <ParameterField
                key={paramName}
                name={paramName}
                param={param}
                value={values[paramName] ?? param.default}
                onChange={onChange}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
