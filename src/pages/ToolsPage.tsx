import { Wrench } from 'lucide-react'

export function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-3">
      <Wrench className="w-10 h-10 text-zinc-600" />
      <h1 className="text-xl font-bold text-white">Ferramentas</h1>
      <p className="text-zinc-500 text-sm">Em breve: Conversor SVG e Gerador de QR Code.</p>
    </div>
  )
}
