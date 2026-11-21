import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import type { CartItem } from '../../types'
import { QuantityStepper } from '../ui/QuantityStepper'

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const { format } = useCurrency()
  const { product, quantity, lineTotalUSD } = item

  return (
    <article className="cart-item">
      <Link to={`/producto/${product.slug}`} className="cart-item__media">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>

      <div className="cart-item__info">
        <p className="cart-item__brand">{product.brand ?? 'TCP Maria Vargas'}</p>
        <h3 className="cart-item__name">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="cart-item__meta">{product.presentation}</p>
        <p className="cart-item__unit">{format(product.priceUSD)} por unidad</p>

        <div className="cart-item__controls">
          <QuantityStepper
            value={quantity}
            onChange={(value) => onQuantityChange(product.id, value)}
            max={Math.max(1, product.stock)}
            size="sm"
          />
          <button
            type="button"
            className="cart-item__remove"
            onClick={() => onRemove(product.id)}
          >
            <Trash2 size={15} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="cart-item__total">
        <span className="cart-item__total-label">Subtotal</span>
        <strong>{format(lineTotalUSD)}</strong>
      </div>
    </article>
  )
}
