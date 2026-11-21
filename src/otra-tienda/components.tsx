import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useOtCart } from './cart'
import { OT_BASE } from './data'
import type { OtProduct } from './data'
import { formatUSD } from './utils'
import { cn } from '../utils/cn'

function BeanMark() {
  return (
    <svg className="ot-bean" viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="60" rx="34" ry="50" transform="rotate(32 60 60)" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M36 25c18 18 30 52 30 71" transform="rotate(32 60 60)" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function OtProductCard({ product }: { product: OtProduct }) {
  const { add } = useOtCart()

  return (
    <article className={cn('ot-card', `ot-card--${product.category}`)}>
      <Link to={`${OT_BASE}/producto/${product.slug}`} className="ot-card__art">
        <span className="ot-card__roast">{product.roast}</span>
        {product.badge && <span className="ot-card__badge">{product.badge}</span>}
        <BeanMark />
        <span className="ot-card__origin">{product.origin}</span>
        <span className="ot-card__region">{product.region}</span>
      </Link>
      <div className="ot-card__body">
        <div className="ot-card__title-row">
          <Link to={`${OT_BASE}/producto/${product.slug}`} className="ot-card__name">
            {product.name}
          </Link>
          <span className="ot-card__price">{formatUSD(product.priceUSD)}</span>
        </div>
        <p className="ot-card__notes">{product.notes.join(' · ')}</p>
        <div className="ot-card__foot">
          <span className="ot-card__weight">{product.weight}</span>
          <button type="button" className="ot-card__add" onClick={() => add(product.id)}>
            Añadir
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
