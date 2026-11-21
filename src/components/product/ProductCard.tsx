import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useToast } from '../../context/ToastContext'
import type { Product } from '../../types'
import { cn } from '../../utils/cn'
import { Badge } from '../ui/Badge'
import { QuantityStepper } from '../ui/QuantityStepper'

function discountPercent(product: Product): number | null {
  if (!product.compareAtUSD || product.compareAtUSD <= product.priceUSD) return null
  return Math.round(((product.compareAtUSD - product.priceUSD) / product.compareAtUSD) * 100)
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, getQuantity } = useCart()
  const { format } = useCurrency()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)

  const soldOut = product.stock <= 0
  const inCart = getQuantity(product.id)
  const discount = discountPercent(product)

  const handleAdd = () => {
    addItem(product, quantity)
    showToast(`${product.name} agregado al carrito`, { image: product.image })
    setQuantity(1)
  }

  return (
    <article className={cn('product-card', soldOut && 'product-card--soldout')}>
      <Link
        to={`/producto/${product.slug}`}
        className="product-card__media"
        aria-label={`Ver detalle de ${product.name}`}
      >
        <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />
        <div className="product-card__badges">
          {soldOut && <Badge tone="muted">Agotado</Badge>}
          {discount !== null && <Badge tone="offer">-{discount}%</Badge>}
          {product.tags.includes('nuevo') && !soldOut && <Badge tone="new">Nuevo</Badge>}
          {product.tags.includes('mas-vendido') && !soldOut && (
            <Badge tone="best">Más vendido</Badge>
          )}
        </div>
        {inCart > 0 && (
          <span className="product-card__in-cart">
            <ShoppingBag size={13} aria-hidden="true" />
            {inCart} en el carrito
          </span>
        )}
      </Link>

      <div className="product-card__body">
        <p className="product-card__brand">{product.brand ?? 'TCP Maria Vargas'}</p>
        <h3 className="product-card__name">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card__presentation">{product.presentation}</p>

        <div className="product-card__price">
          <span className="price__now">{format(product.priceUSD)}</span>
          {product.compareAtUSD && (
            <span className="price__was">{format(product.compareAtUSD)}</span>
          )}
        </div>

        <p className={cn('stock', soldOut && 'stock--out')}>
          {soldOut
            ? 'No disponible por el momento'
            : product.stock <= 5
              ? `Últimas ${product.stock} unidades`
              : 'Disponible'}
        </p>

        <div className="product-card__actions">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={Math.max(1, product.stock)}
            disabled={soldOut}
            size="sm"
          />
          <button
            type="button"
            className="btn btn--primary btn--sm product-card__add"
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus size={15} aria-hidden="true" />
            {soldOut ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
