import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Minus, Plus, Truck } from 'lucide-react'
import { OtProductCard } from '../components'
import { useOtCart } from '../cart'
import { OT_BASE, getOtProduct, otProducts } from '../data'
import { formatUSD } from '../utils'
import { cn } from '../../utils/cn'

export function OtProducto() {
  const { slug = '' } = useParams<{ slug: string }>()
  const product = getOtProduct(slug)
  const { add } = useOtCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="ot-wrap ot-page">
        <div className="ot-empty">
          <h1 className="ot-page__title">Café no encontrado</h1>
          <p>Ese lote ya no está en la tienda.</p>
          <Link to={`${OT_BASE}/catalogo`} className="ot-btn ot-btn--copper">
            Ver todo el café
          </Link>
        </div>
      </div>
    )
  }

  const related = otProducts.filter((item) => item.id !== product.id).slice(0, 3)

  const handleAdd = () => add(product.id, quantity)

  const handleBuy = () => {
    add(product.id, quantity)
    navigate(`${OT_BASE}/carrito`)
  }

  return (
    <div className="ot-wrap ot-page">
      <div className="ot-product">
        <div className={cn('ot-product__art', `ot-card--${product.category}`)}>
          <span className="ot-card__roast">{product.roast}</span>
          {product.badge && <span className="ot-card__badge">{product.badge}</span>}
          <span className="ot-product__origin">{product.origin}</span>
          <span className="ot-product__region">{product.region}</span>
          <svg className="ot-bean ot-bean--large" viewBox="0 0 120 120" aria-hidden="true">
            <ellipse cx="60" cy="60" rx="34" ry="50" transform="rotate(32 60 60)" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M36 25c18 18 30 52 30 71" transform="rotate(32 60 60)" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="ot-product__info">
          <span className="ot-eyebrow">{product.process} · {product.roast}</span>
          <h1 className="ot-product__title">{product.name}</h1>
          <p className="ot-product__desc">{product.description}</p>

          <div className="ot-product__notes">
            {product.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>

          <dl className="ot-product__meta">
            <div>
              <dt>Origen</dt>
              <dd>{product.region}</dd>
            </div>
            <div>
              <dt>Proceso</dt>
              <dd>{product.process}</dd>
            </div>
            <div>
              <dt>Formato</dt>
              <dd>{product.weight}</dd>
            </div>
          </dl>

          <div className="ot-product__buy">
            <span className="ot-product__price">{formatUSD(product.priceUSD)}</span>
            <div className="ot-qty" aria-label="Cantidad">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Quitar uno"
              >
                <Minus size={15} aria-hidden="true" />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                aria-label="Añadir uno"
              >
                <Plus size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="ot-product__actions">
            <button type="button" className="ot-btn ot-btn--copper" onClick={handleBuy}>
              Comprar ahora
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button type="button" className="ot-btn ot-btn--ghost" onClick={handleAdd}>
              Añadir al carrito
            </button>
          </div>

          <p className="ot-product__shipping">
            <Truck size={15} aria-hidden="true" />
            Envío en La Habana o recogida gratis en el Vedado. Tostado esta semana.
          </p>
        </div>
      </div>

      <section className="ot-related">
        <header className="ot-section__head">
          <h2 className="ot-section__title">También te puede gustar</h2>
          <Link to={`${OT_BASE}/catalogo`} className="ot-link">
            Ver todo
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="ot-grid">
          {related.map((item) => (
            <OtProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  )
}
