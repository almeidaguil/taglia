import { Link, useLocation } from 'react-router-dom'
import { Box, Wrench } from 'lucide-react'

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-white"
        >
          <Box className="w-5 h-5 text-blue-400" />
          <span>Taglia</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              location.pathname === '/'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            Modelos
          </Link>
          <Link
            to="/tools"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              location.pathname === '/tools'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Ferramentas
          </Link>
        </nav>
      </div>
    </header>
  )
}
