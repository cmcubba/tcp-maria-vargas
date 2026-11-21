import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, RotateCcw, Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { categories } from '../data/categories'
import { products } from '../data/products'
import type { Product } from '../types'
import { cn } from '../utils/cn'

type SortOption = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre'

const MAX_PRICE = 10

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list]
  switch (sort) {
    case 'precio-asc':
      return sorted.sort((a, b) => a.priceUSD - b.priceUSD)
    case 'precio-desc':
      return sorted.sort((a, b) => b.priceUSD - a.priceUSD)
    case 'nombre':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    default:
      return sorted.sort((a, b) => {
        const score = (product: Product) =>
          (product.featured ? 2 : 0) +
          (product.tags.includes('mas-vendido') ? 2 : 0) +
          (product.tags.includes('oferta') ? 1 : 0) +
          (product.stock > 0 ? 1 : 0)
        return score(b) - score(a)
      })
  }
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = params.get('categoria') ?? 'todas'
  const query = params.get('q') ?? ''
  const sort = (params.get('orden') as SortOption | null) ?? 'relevancia'
  const maxPrice = Number(params.get('max') ?? MAX_PRICE)
  const onlyOffers = params.get('filtro') === 'ofertas'
  const onlyAvailable = params.get('disponible') === '1'

  const update = (key: string, value: string | null) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (!value) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const filtered = useMemo(() => {
    const term = normalize(query.trim())
    const list = products.filter((product) => {
      if (category !== 'todas' && product.categoryId !== category) return false
      if (onlyOffers && !product.compareAtUSD) return false
      if (onlyAvailable && product.stock <= 0) return false
      if (product.priceUSD > maxPrice) return false
      if (term) {
        const haystack = normalize(
          `${product.name} ${product.brand ?? ''} ${product.description} ${product.presentation}`,
        )
        if (!haystack.includes(term)) return false
      }
      return true
    })
    return sortProducts(list, sort)
  }, [category, query, sort, maxPrice, onlyOffers, onlyAvailable])

  const activeCategory = categories.find((item) => item.id === category)
  const activeFilters =
    (category !== 'todas' ? 1 : 0) +
    (query ? 1 : 0) +
    (onlyOffers ? 1 : 0) +
    (onlyAvailable ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0)

  const resetFilters = () => setParams(new URLSearchParams(), { replace: true })

  return (
    <div className="catalog-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span>{activeCategory ? activeCategory.name : 'Productos'}</span>
        </nav>

        <header className="page-head">
          <span className="eyebrow">Catálogo</span>
          <h1 className="page-title">
            {activeCategory ? activeCategory.name : 'Nuestros productos'}
          </h1>
          <p className="page-subtitle">
            {activeCategory
              ? activeCategory.description
              : 'Explora alimentos, bebidas y productos de aseo con precios claros y disponibilidad actualizada.'}
          </p>
        </header>

        <div className="catalog-toolbar">
          <div className="search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => update('q', event.target.value || null)}
              placeholder="Buscar productos, marcas o presentaciones…"
              aria-label="Buscar productos"
            />
          </div>
          <div className="catalog-toolbar__actions">
            <button
              type="button"
              className="btn btn--outline btn--sm filters-toggle"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filtros
              {activeFilters > 0 && <span className="filters-toggle__count">{activeFilters}</span>}
            </button>
            <label className="sort">
              <span>Ordenar por</span>
              <select
                value={sort}
                onChange={(event) => update('orden', event.target.value)}
                aria-label="Ordenar productos"
              >
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre">Nombre (A–Z)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="catalog-layout">
          <aside className={cn('filters', filtersOpen && 'is-open')} aria-label="Filtros de productos">
            <div className="filters__header">
              <h2>Filtros</h2>
              {activeFilters > 0 && (
                <button type="button" className="filters__reset" onClick={resetFilters}>
                  <RotateCcw size={13} aria-hidden="true" />
                  Limpiar
                </button>
              )}
            </div>

            <div className="filter-group">
              <h3 className="filter-group__title">Categorías</h3>
              <ul className="filter-list">
                <li>
                  <button
                    type="button"
                    className={cn('filter-category', category === 'todas' && 'is-active')}
                    onClick={() => update('categoria', null)}
                  >
                    <span>Todas las categorías</span>
                    <span className="filter-category__count">{products.length}</span>
                  </button>
                </li>
                {categories.map((item) => {
                  const count = products.filter((product) => product.categoryId === item.id).length
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={cn('filter-category', category === item.id && 'is-active')}
                        onClick={() => update('categoria', item.id)}
                      >
                        <span>{item.name}</span>
                        <span className="filter-category__count">{count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="filter-group">
              <h3 className="filter-group__title">Precio máximo</h3>
              <div className="range">
                <input
                  type="range"
                  min={1}
                  max={MAX_PRICE}
                  step={0.5}
                  value={Math.min(maxPrice, MAX_PRICE)}
                  onChange={(event) => update('max', event.target.value)}
                  aria-label="Precio máximo en dólares"
                />
                <div className="range__labels">
                  <span>$1</span>
                  <strong>Hasta ${maxPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group__title">Filtros rápidos</h3>
              <label className="check">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(event) => update('filtro', event.target.checked ? 'ofertas' : null)}
                />
                <span>Solo ofertas</span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(event) => update('disponible', event.target.checked ? '1' : null)}
                />
                <span>Solo disponibles</span>
              </label>
            </div>
          </aside>

          <section className="catalog-results" aria-live="polite">
            <div className="results-bar">
              <p>
                <strong>{filtered.length}</strong> {filtered.length === 1 ? 'producto' : 'productos'}
                {activeCategory && <span> en {activeCategory.name}</span>}
              </p>
              {activeFilters > 0 && (
                <button type="button" className="results-bar__clear" onClick={resetFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <ProductGrid products={filtered} />
            ) : (
              <EmptyState
                icon={<SearchX size={30} />}
                title="No encontramos productos"
                description="Prueba con otras palabras, cambia la categoría o ajusta el precio máximo."
                action={
                  <button type="button" className="btn btn--primary" onClick={resetFilters}>
                    Ver todos los productos
                  </button>
                }
              />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
