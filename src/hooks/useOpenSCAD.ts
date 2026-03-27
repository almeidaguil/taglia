import { useCallback, useEffect, useRef, useState } from 'react'
import type { RenderStatus } from '../types'

interface RenderOptions {
  scadCode: string
  format: 'stl' | '3mf'
}

type PendingMap = Map<
  string,
  { resolve: (b: Blob) => void; reject: (e: Error) => void }
>

function handleWorkerMessage(
  data: { id: string; status: string; blob?: Blob; error?: string },
  pending: PendingMap,
  setStatus: (s: RenderStatus) => void,
  setError: (e: string | null) => void,
) {
  const entry = pending.get(data.id)
  if (!entry) return

  if (data.status === 'rendering') {
    setStatus('rendering')
    return
  }

  pending.delete(data.id)

  if (data.status === 'done' && data.blob) {
    setStatus('done')
    setError(null)
    entry.resolve(data.blob)
  } else {
    setStatus('error')
    setError(data.error ?? 'Unknown error')
    entry.reject(new Error(data.error ?? 'Unknown error'))
  }
}

export function useOpenSCAD() {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState<RenderStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<PendingMap>(new Map())

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/openscad.worker.ts', import.meta.url),
      { type: 'module' },
    )
    workerRef.current.onmessage = (e) =>
      handleWorkerMessage(e.data, pendingRef.current, setStatus, setError)
    return () => workerRef.current?.terminate()
  }, [])

  const render = useCallback(
    ({ scadCode, format }: RenderOptions): Promise<Blob> =>
      new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Worker not initialized'))
          return
        }
        const id = crypto.randomUUID()
        pendingRef.current.set(id, { resolve, reject })
        setStatus('rendering')
        setError(null)
        workerRef.current.postMessage({ id, scadCode, format })
      }),
    [],
  )

  return { render, status, error }
}
