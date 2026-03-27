import { useRef } from 'react'
import type { Parameter } from '../../types'

interface FieldProps {
  label: string
  value: string | number | boolean
  onChange: (v: string | number | boolean) => void
}

const inputClass =
  'w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors'

function StringField({ label, value, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        type="text"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  param,
}: FieldProps & { param: Parameter & { type: 'number' } }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400">
        {label}
        <span className="ml-2 text-zinc-500">{value}</span>
      </label>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value as number}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-xs text-zinc-600">
        <span>{param.min}</span>
        <span>{param.max}</span>
      </div>
    </div>
  )
}

function BooleanField({ label, value, onChange }: FieldProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-zinc-400">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={value as boolean}
        onClick={() => onChange(!(value as boolean))}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: FieldProps & { options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <select
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function ColorField({ label, value, onChange }: FieldProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-zinc-400">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">{value as string}</span>
        <input
          type="color"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        />
      </div>
    </div>
  )
}

function ImageUploadIcon() {
  return (
    <svg
      className="w-7 h-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}

function ImagePlaceholder({ accept }: { accept?: string[] }) {
  return (
    <div className="flex flex-col items-center gap-1 text-zinc-500 pointer-events-none select-none">
      <ImageUploadIcon />
      <span className="text-xs text-center px-2">
        Arraste uma imagem ou clique para enviar
      </span>
      <span className="text-[10px] text-zinc-600">
        {accept?.join(', ') ?? 'PNG, JPG, WebP'}
      </span>
    </div>
  )
}

function ImagePreview({ src }: { src: string }) {
  return (
    <>
      <img
        src={src}
        alt="preview"
        className="max-h-40 max-w-full object-contain p-1"
      />
      <span className="absolute bottom-1 right-2 text-[10px] text-zinc-500">
        clique para trocar
      </span>
    </>
  )
}

function readFileAsDataUrl(file: File, onLoad: (result: string) => void) {
  const reader = new FileReader()
  reader.onload = (evt) => {
    const result = evt.target?.result
    if (typeof result === 'string') onLoad(result)
  }
  reader.readAsDataURL(file)
}

function ImageField({
  label,
  value,
  onChange,
  accept,
}: FieldProps & { accept?: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dataUrl = value as string
  const hasImage = dataUrl.startsWith('data:')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-zinc-400">{label}</label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) readFileAsDataUrl(file, onChange as (v: string) => void)
        }}
        className="relative flex flex-col items-center justify-center w-full min-h-28 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
      >
        {hasImage ? (
          <ImagePreview src={dataUrl} />
        ) : (
          <ImagePlaceholder accept={accept} />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept?.join(',') ?? 'image/*'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) readFileAsDataUrl(file, onChange as (v: string) => void)
        }}
      />
    </div>
  )
}

interface ParameterFieldProps {
  name: string
  param: Parameter
  value: string | number | boolean
  onChange: (name: string, value: string | number | boolean) => void
}

export function ParameterField({
  name,
  param,
  value,
  onChange,
}: ParameterFieldProps) {
  const label = param.description || name
  const handleChange = (v: string | number | boolean) => onChange(name, v)

  if (param.type === 'string')
    return <StringField label={label} value={value} onChange={handleChange} />

  if (param.type === 'number')
    return (
      <NumberField
        label={label}
        value={value}
        onChange={handleChange}
        param={param}
      />
    )

  if (param.type === 'boolean')
    return <BooleanField label={label} value={value} onChange={handleChange} />

  if (param.type === 'select')
    return (
      <SelectField
        label={label}
        value={value}
        onChange={handleChange}
        options={param.options}
      />
    )

  if (param.type === 'color')
    return <ColorField label={label} value={value} onChange={handleChange} />

  if (param.type === 'image')
    return (
      <ImageField
        label={label}
        value={value}
        onChange={handleChange}
        accept={param.accept}
      />
    )

  return null
}
