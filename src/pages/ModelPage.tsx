import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, ChevronLeft, Play, AlertCircle, Info } from 'lucide-react'
import { getModel, getDefaultValues } from '../models'
import { ParameterPanel } from '../components/parameters/ParameterPanel'
import { ModelViewer } from '../components/viewer/ModelViewer'
import { Button } from '../components/ui/Button'
import { useOpenSCAD } from '../hooks/useOpenSCAD'
import { buildScadCode } from '../utils/scad'
import type { ExportOption, ModelDefinition, ParameterValues } from '../types'

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-zinc-500">Modelo não encontrado.</p>
      <Link to="/" className="text-blue-400 hover:underline mt-2 inline-block">
        Voltar ao catálogo
      </Link>
    </div>
  )
}

function ViewerPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-2 pointer-events-none">
      <Play className="w-10 h-10" />
      <p className="text-sm">
        Configure os parâmetros e clique em &quot;Gerar&quot;
      </p>
    </div>
  )
}

function RenderingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-10 gap-3">
      <span className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-zinc-400">Gerando modelo com OpenSCAD...</p>
      <p className="text-xs text-zinc-600">Isso pode levar alguns segundos</p>
    </div>
  )
}

function ErrorSection({ error }: { error: string }) {
  return (
    <div className="flex items-start gap-2 bg-red-950/50 border border-red-900 rounded-lg p-3 text-sm text-red-400">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        <p className="font-medium">Erro ao gerar modelo</p>
        <p className="text-red-500/80 text-xs mt-0.5">{error}</p>
      </div>
    </div>
  )
}

function DownloadSection({
  filename,
  format,
  onDownload,
}: {
  filename: string
  format: string
  onDownload: () => void
}) {
  return (
    <div className="flex items-center gap-3 bg-green-950/30 border border-green-900/50 rounded-lg p-3">
      <div className="flex-1 text-sm text-green-400">
        <span className="font-medium">Modelo pronto!</span>
        <span className="text-green-600 ml-2 text-xs">{filename}</span>
      </div>
      <Button onClick={onDownload} size="sm">
        <Download className="w-4 h-4" />
        Baixar {format.toUpperCase()}
      </Button>
    </div>
  )
}

function DescriptionBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-400">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
      <p>{text}</p>
    </div>
  )
}

function ViewerOverlay({
  stlBlob,
  isRendering,
}: {
  stlBlob: Blob | null
  isRendering: boolean
}) {
  if (isRendering) return <RenderingOverlay />
  if (!stlBlob) return <ViewerPlaceholder />
  return null
}

function ExportButtons({
  model,
  renderedExport,
  hasResult,
  isRendering,
  onRender,
}: {
  model: ModelDefinition
  renderedExport: ExportOption | null
  hasResult: boolean
  isRendering: boolean
  onRender: (opt: ExportOption) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-zinc-600 uppercase tracking-wide font-medium">
        Gerar e baixar
      </p>
      {model.exportOptions.map((opt) => (
        <Button
          key={opt.parameter}
          variant={
            renderedExport?.parameter === opt.parameter && hasResult
              ? 'primary'
              : 'secondary'
          }
          loading={isRendering}
          onClick={() => onRender(opt)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Play className="w-3.5 h-3.5" />
            Gerar: {opt.parameter}
          </span>
          <span className="text-xs opacity-60 uppercase">{opt.format}</span>
        </Button>
      ))}
    </div>
  )
}

function ViewerSection({
  model,
  stlBlob,
  isRendering,
  error,
  downloadBlob,
  renderedExport,
  onDownload,
}: {
  model: ModelDefinition
  stlBlob: Blob | null
  isRendering: boolean
  error: string | null
  downloadBlob: { blob: Blob; filename: string } | null
  renderedExport: ExportOption | null
  onDownload: () => void
}) {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">{model.title}</h1>
        <p className="text-zinc-500 text-sm mt-1">{model.subtitle}</p>
      </div>

      <div
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        style={{ height: 420 }}
      >
        <ViewerOverlay stlBlob={stlBlob} isRendering={isRendering} />
        <ModelViewer stlBlob={stlBlob} className="w-full h-full" />
      </div>

      {error && <ErrorSection error={error} />}

      {downloadBlob && (
        <DownloadSection
          filename={downloadBlob.filename}
          format={renderedExport?.format ?? ''}
          onDownload={onDownload}
        />
      )}

      {model.description && <DescriptionBox text={model.description} />}
    </div>
  )
}

function ParameterSidebar({
  model,
  values,
  renderedExport,
  hasResult,
  isRendering,
  onParamChange,
  onRender,
}: {
  model: ModelDefinition
  values: ParameterValues
  renderedExport: ExportOption | null
  hasResult: boolean
  isRendering: boolean
  onParamChange: (name: string, value: string | number | boolean) => void
  onRender: (opt: ExportOption) => void
}) {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Parâmetros</h2>
        <ParameterPanel
          model={model}
          values={values}
          onChange={onParamChange}
        />
      </div>

      <ExportButtons
        model={model}
        renderedExport={renderedExport}
        hasResult={hasResult}
        isRendering={isRendering}
        onRender={onRender}
      />

      <p className="text-xs text-zinc-700 leading-relaxed">
        O modelo é gerado localmente no seu browser via OpenSCAD WebAssembly.
        Nenhum dado é enviado para servidores externos.
      </p>
    </div>
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface RenderState {
  stlBlob: Blob | null
  renderedExport: ExportOption | null
  downloadBlob: { blob: Blob; filename: string } | null
}

function applyRenderResult(
  blob: Blob,
  exportOption: ExportOption,
): RenderState {
  return {
    stlBlob: exportOption.format === 'stl' ? blob : null,
    renderedExport: exportOption,
    downloadBlob: {
      blob,
      filename: `${exportOption.filename}.${exportOption.format}`,
    },
  }
}

function useModelState(model: ModelDefinition | undefined) {
  const [values, setValues] = useState<ParameterValues>(() =>
    model ? getDefaultValues(model) : {},
  )
  const [renderState, setRenderState] = useState<RenderState>({
    stlBlob: null,
    renderedExport: null,
    downloadBlob: null,
  })
  const { render, status, error } = useOpenSCAD()

  const handleParamChange = useCallback(
    (name: string, value: string | number | boolean) => {
      setValues((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const handleRender = useCallback(
    async (exportOption: ExportOption) => {
      if (!model) return
      try {
        const scadCode = await buildScadCode(
          model,
          values,
          exportOption.parameter,
        )
        const blob = await render({ scadCode, format: exportOption.format })
        setRenderState(applyRenderResult(blob, exportOption))
      } catch (e) {
        console.error(e)
      }
    },
    [model, values, render],
  )

  const handleDownload = useCallback(() => {
    const dl = renderState.downloadBlob
    if (dl) triggerDownload(dl.blob, dl.filename)
  }, [renderState.downloadBlob])

  return {
    values,
    ...renderState,
    status,
    error,
    handleParamChange,
    handleRender,
    handleDownload,
  }
}

export function ModelPage() {
  const { slug } = useParams<{ slug: string }>()
  const model = getModel(slug ?? '')
  const state = useModelState(model)

  if (!model) return <NotFound />

  const isRendering = state.status === 'rendering'
  const hasResult = state.status === 'done' && !!state.downloadBlob

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Modelos
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <ViewerSection
          model={model}
          stlBlob={state.stlBlob}
          isRendering={isRendering}
          error={state.error}
          downloadBlob={state.downloadBlob}
          renderedExport={state.renderedExport}
          onDownload={state.handleDownload}
        />
        <ParameterSidebar
          model={model}
          values={state.values}
          renderedExport={state.renderedExport}
          hasResult={hasResult}
          isRendering={isRendering}
          onParamChange={state.handleParamChange}
          onRender={state.handleRender}
        />
      </div>
    </div>
  )
}
