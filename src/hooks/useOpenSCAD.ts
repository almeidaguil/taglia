import { useCallback, useEffect, useRef, useState } from 'react'
import type { RenderStatus } from '../types'

interface RenderOptions {
  scadCode: string
  format: 'stl' | '3mf'
}

interface UseOpenSCADResult {
  render: (opts: RenderOptions) => Promise<Blob>
  status: RenderStatus
  error: string | null
}

export function useOpenSCAD(): UseOpenSCADResult {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState<RenderStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<Map<string, { resolve: (b: Blob) => void; reject: (e: Error) => void }>>(new Map())

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/openscad.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = (e) => {
      const { id, status: s, blob, error: err } = e.data
      const pending = pendingRef.current.get(id)
      if (!pending) return

      if (s === 'rendering') {
        setStatus('rendering')
        return
      }

      pendingRef.current.delete(id)

      if (s === 'done' && blob) {
        setStatus('done')
        setError(null)
        pending.resolve(blob)
      } else {
        setStatus('error')
        setError(err ?? 'Unknown error')
        pending.reject(new Error(err ?? 'Unknown error'))
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const render = useCallback(({ scadCode, format }: RenderOptions): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'))
        return
      }

      const id = crypto.randomUUID()
      pendingRef.current.set(id, { resolve, reject })
      setStatus('rendering')
      setError(null)

      workerRef.current.postMessage({ id, scadCode, format })
    })
  }, [])

  return { render, status, error }
}
