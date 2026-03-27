import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, ChevronLeft, Play, AlertCircle, Info } from 'lucide-react'
import { getModel, getDefaultValues } from '../models'
import { ParameterPanel } from '../components/parameters/ParameterPanel'
import { ModelViewer } from '../components/viewer/ModelViewer'
import { Button } from '../components/ui/Button'
import { useOpenSCAD } from '../hooks/useOpenSCAD'
import { buildScadCode } from '../utils/scad'
import type { ExportOption, ParameterValues } from '../types'

export function ModelPage() {
  const { slug } = useParams<{ slug: string }>()
  const model = getModel(slug ?? '')

  const [values, setValues] = useState<ParameterValues>(() =>
    model ? getDefaultValues(model) : {},
  )
  const [stlBlob, setStlBlob] = useState<Blob | null>(null)
  const [renderedExport, setRenderedExport] = useState<ExportOption | null>(
    null,
  )
  const [downloadBlob, setDownloadBlob] = useState<{
    blob: Blob
    filename: string
  } | null>(null)

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
        setStlBlob(exportOption.format === 'stl' ? blob : null)
        setRenderedExport(exportOption)
        setDownloadBlob({
          blob,
          filename: `${exportOption.filename}.${exportOption.format}`,
        })
      } catch (e) {
        console.error(e)
      }
    },
    [model, values, render],
  )

  const handleDownload = useCallback(() => {
    if (!downloadBlob) return
    const url = URL.createObjectURL(downloadBlob.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadBlob.filename
    a.click()
    URL.revokeObjectURL(url)
  }, [downloadBlob])

  if (!model) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500">Modelo não encontrado.</p>
        <Link
          to="/"
          className="text-blue-400 hover:underline mt-2 inline-block"
        >
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const isRendering = status === 'rendering'
  const hasResult = status === 'done' && downloadBlob

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Modelos
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left — Viewer + info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{model.title}</h1>
            <p className="text-zinc-500 text-sm mt-1">{model.subtitle}</p>
          </div>

          {/* 3D Viewer */}
          <div
            className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            style={{ height: 420 }}
          >
            {!stlBlob && !isRendering && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-2 pointer-events-none">
                <Play className="w-10 h-10" />
                <p className="text-sm">
                  Configure os parâmetros e clique em "Gerar"
                </p>
              </div>
            )}

            {isRendering && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-10 gap-3">
                <span className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-zinc-400">
                  Gerando modelo com OpenSCAD...
                </p>
                <p className="text-xs text-zinc-600">
                  Isso pode levar alguns segundos
                </p>
              </div>
            )}

            <ModelViewer stlBlob={stlBlob} className="w-full h-full" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-950/50 border border-red-900 rounded-lg p-3 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Erro ao gerar modelo</p>
                <p className="text-red-500/80 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Download section */}
          {hasResult && (
            <div className="flex items-center gap-3 bg-green-950/30 border border-green-900/50 rounded-lg p-3">
              <div className="flex-1 text-sm text-green-400">
                <span className="font-medium">Modelo pronto!</span>
                <span className="text-green-600 ml-2 text-xs">
                  {downloadBlob?.filename}
                </span>
              </div>
              <Button onClick={handleDownload} size="sm">
                <Download className="w-4 h-4" />
                Baixar {renderedExport?.format.toUpperCase()}
              </Button>
            </div>
          )}

          {/* Print info */}
          {model.description && (
            <div className="flex items-start gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-400">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
              <p>{model.description}</p>
            </div>
          )}
        </div>

        {/* Right — Parameters + render buttons */}
        <div className="w-full lg:w-80 flex flex-col gap-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">
              Parâmetros
            </h2>
            <ParameterPanel
              model={model}
              values={values}
              onChange={handleParamChange}
            />
          </div>

          {/* Render / Export buttons */}
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
                onClick={() => handleRender(opt)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5" />
                  Gerar: {opt.parameter}
                </span>
                <span className="text-xs opacity-60 uppercase">
                  {opt.format}
                </span>
              </Button>
            ))}
          </div>

          <p className="text-xs text-zinc-700 leading-relaxed">
            O modelo é gerado localmente no seu browser via OpenSCAD
            WebAssembly. Nenhum dado é enviado para servidores externos.
          </p>
        </div>
      </div>
    </div>
  )
}
