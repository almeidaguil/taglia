import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        Taglia — uso local / open source
      </footer>
    </div>
  )
}
