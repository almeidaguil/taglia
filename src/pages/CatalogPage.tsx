import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { models } from '../models'
import type { ModelDefinition } from '../types'
import { Badge } from '../components/ui/Badge'
import { Box, Tag, Search } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  signs: 'Letreiros',
  keychains: 'Chaveiros',
  kitchen: 'Cozinha',
  'string-art': 'String Art',
  'image-based': 'Baseado em Imagem',
  tools: 'Ferramentas',
}

const filterCategories = [
  { key: 'all', label: 'Todos' },
  { key: 'signs', label: 'Letreiros' },
  { key: 'keychains', label: 'Chaveiros' },
  { key: 'kitchen', label: 'Cozinha' },
  { key: 'tools', label: 'Ferramentas' },
] as const

const difficultyLabel: Record<string, { label: string; variant: 'green' | 'yellow' | 'default' }> = {
  easy: { label: 'Fácil', variant: 'green' },
  medium: { label: 'Médio', variant: 'yellow' },
  hard: { label: 'Difícil', variant: 'default' },
}

function ModelCard({ model }: { model: ModelDefinition }) {
  const diff = difficultyLabel[model.difficulty]

  return (
    <Link
      to={`/model/${model.slug}`}
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20"
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-zinc-800 flex items-center justify-center">
        <Box className="w-12 h-12 text-zinc-600 group-hover:text-blue-500 transition-colors" />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{model.title}</h3>
          <Badge variant={diff.variant}>{diff.label}</Badge>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed flex-1">{model.subtitle}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-zinc-600 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {categoryLabels[model.category] ?? model.category}
          </span>
          <div className="flex gap-1">
            {model.exportOptions.map((opt) => (
              <span
                key={opt.format + opt.parameter}
                className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-mono"
              >
                {opt.format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function CatalogPage() {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: models.length }
    for (const m of models) {
      counts[m.category] = (counts[m.category] ?? 0) + 1
    }
    return counts
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return models
      .filter((m) => category === 'all' || m.category === category)
      .filter(
        (m) =>
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      )
  }, [category, search])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Modelos Paramétricos</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          {models.length} modelo{models.length !== 1 ? 's' : ''} disponíveis — personalize e baixe STL/3MF direto no browser.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, descrição ou tag..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-600 transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {cat.label}
            <span
              className={`ml-1.5 text-xs ${
                category === cat.key ? 'text-blue-200' : 'text-zinc-500'
              }`}
            >
              {categoryCounts[cat.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
          <Box className="w-12 h-12 mb-3" />
          <p>Nenhum modelo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((model) => (
            <ModelCard key={model.slug} model={model} />
          ))}
        </div>
      )}
    </div>
  )
}
