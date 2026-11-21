import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { OtProductCard } from '../components'
import { OT_CATEGORIES, otProducts } from '../data'
import type { OtCategory } from '../data'
import { cn } from '../../utils/cn'

type Filter = OtCategory | 'todos'

function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function OtCatalogo() {
  const [filter, setFilter] = useState<Filter>('todos')
  const [query, setQuery] = useState('')

  const products = useMemo(() => {
    const term = normalize(query.trim())
    return otProducts.filter((product) => {
      if (filter !== 'todos' && product.category !== filter) return false
      if (!term) return true
      const haystack = normalize(
        [product.name, product.origin, product.region, ...product.notes].join(' '),
      )
      return haystack.includes(term)
    })
  }, [filter, query])

  return (
    <div className="ot-wrap ot-page">
      <header className="ot-page__head">
        <span className="ot-eyebrow">La despensa</span>
        <h1 className="ot-page__title">Todo el café</h1>
        <p className="ot-page__lead">
          Ocho referencias, tostadas esta semana. Filtra por método o busca por origen y notas de
          cata.
        </p>
      </header>

      <div className="ot-filters">
        <div className="ot-chips" role="group" aria-label="Filtrar por método">
          {OT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={cn('ot-chip', filter === category.id && 'is-active')}
              aria-pressed={filter === category.id}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="ot-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por origen o nota"
            aria-label="Buscar café"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda">
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="ot-results">{products.length} referencias</p>

      {products.length === 0 ? (
        <div className="ot-empty">
          <p>No encontramos café con esa búsqueda.</p>
          <button
            type="button"
            className="ot-btn ot-btn--ghost"
            onClick={() => {
              setQuery('')
              setFilter('todos')
            }}
          >
            Ver todo el café
          </button>
        </div>
      ) : (
        <div className="ot-grid">
          {products.map((product) => (
            <OtProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
