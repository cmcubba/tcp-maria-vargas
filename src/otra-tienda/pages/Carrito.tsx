import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { useOtCart } from '../cart'
import { OT_BASE } from '../data'
import { formatUSD } from '../utils'
import { cn } from '../../utils/cn'

export function OtCarrito() {
  const { items, subtotalUSD, setQuantity, remove, totalItems } = useOtCart()

  if (items.length === 0) {
    return (
      <div className="ot-wrap ot-page">
        <div className="ot-empty ot-empty--cart">
          <span className="ot-empty__icon"><ShoppingBag size={26} aria-hidden="true" /></span>
          <h1 className="ot-page__title">Tu carrito está vacío</h1>
          <p>Todavía no has elegido café. El lote de esta semana se está tostando.</p>
          <Link to={`${OT_BASE}/catalogo`} className="ot-btn ot-btn--copper">
            Ver todo el café
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ot-wrap ot-page">
      <header className="ot-page__head">
        <span className="ot-eyebrow">Tu selección</span>
        <h1 className="ot-page__title">Carrito</h1>
        <p className="ot-page__lead">{totalItems} {totalItems === 1 ? 'producto listo' : 'productos listos'} para tostar.</p>
      </header>

      <div className="ot-cart">
        <div className="ot-cart__list">
          {items.map((item) => (
            <article key={item.product.id} className="ot-cart-item">
              <Link
                to={`${OT_BASE}/producto/${item.product.slug}`}
                className={cn('ot-cart-item__art', `ot-card--${item.product.category}`)}
              >
                {item.product.origin.slice(0, 2).toUpperCase()}
              </Link>
              <div className="ot-cart-item__body">
                <Link to={`${OT_BASE}/producto/${item.product.slug}`} className="ot-cart-item__name">
                  {item.product.name}
                </Link>
                <span className="ot-cart-item__meta">
                  {item.product.weight} · {item.product.roast}
                </span>
                <div className="ot-cart-item__controls">
                  <div className="ot-qty ot-qty--small">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                      aria-label={`Quitar uno de ${item.product.name}`}
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                      aria-label={`Añadir uno de ${item.product.name}`}
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="ot-cart-item__remove"
                    onClick={() => remove(item.product.id)}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Quitar
                  </button>
                </div>
              </div>
              <span className="ot-cart-item__total">{formatUSD(item.lineTotalUSD)}</span>
            </article>
          ))}
        </div>

        <aside className="ot-summary">
          <h2 className="ot-summary__title">Resumen</h2>
          <div className="ot-summary__row">
            <span>Subtotal</span>
            <span>{formatUSD(subtotalUSD)}</span>
          </div>
          <div className="ot-summary__row">
            <span>Envío</span>
            <span>Se calcula en el checkout</span>
          </div>
          <div className="ot-summary__total">
            <span>Total</span>
            <strong>{formatUSD(subtotalUSD)}</strong>
          </div>
          <Link to={`${OT_BASE}/checkout`} className="ot-btn ot-btn--copper ot-btn--block">
            Ir al checkout
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link to={`${OT_BASE}/catalogo`} className="ot-summary__continue">
            Seguir comprando
          </Link>
          <p className="ot-summary__note">
            <Truck size={15} aria-hidden="true" />
            Recogida gratis en el Vedado. Envío a domicilio en La Habana.
          </p>
        </aside>
      </div>
    </div>
  )
}
