import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { CartItemRow } from '../components/cart/CartItemRow'
import { SummaryCard } from '../components/cart/SummaryCard'
import { EmptyState } from '../components/ui/EmptyState'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { CURRENCY } from '../config'

export function CartPage() {
  const { items, subtotalUSD, totalItems, updateQuantity, removeItem, clearCart } = useCart()
  const { showToast } = useToast()

  if (items.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Tu carrito está vacío"
          description="Explora nuestro catálogo y agrega los productos que necesitas para tu hogar."
          action={
            <Link to="/productos" className="btn btn--primary btn--lg">
              Ver productos
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container section cart-page">
      <header className="page-head page-head--row">
        <div>
          <span className="eyebrow">Tu compra</span>
          <h1 className="page-title">Carrito de compras</h1>
          <p className="page-subtitle">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} seleccionados
          </p>
        </div>
        <button
          type="button"
          className="cart-clear"
          onClick={() => {
            clearCart()
            showToast('Carrito vaciado')
          }}
        >
          <Trash2 size={15} aria-hidden="true" />
          Vaciar carrito
        </button>
      </header>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Productos en el carrito">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={(productId) => {
                removeItem(productId)
                showToast('Producto eliminado del carrito')
              }}
            />
          ))}

          <Link to="/productos" className="link-arrow cart-continue">
            <ArrowLeft size={15} aria-hidden="true" />
            Continuar comprando
          </Link>
        </section>

        <SummaryCard
          subtotalUSD={subtotalUSD}
          totalUSD={subtotalUSD}
          note={
            <span className="summary__delivery-note">
              <Truck size={15} aria-hidden="true" />
              Envío a domicilio en La Habana: $5 (mínimo $20 en productos), en 1 a 5 horas. La
              recogida en el local no tiene costo.
            </span>
          }
          cta={
            <Link to="/checkout" className="btn btn--primary btn--lg btn--block">
              Proceder al pedido
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          }
          footer={
            <p className="summary__hint">
              Moneda seleccionada: <strong>{CURRENCY.label.USD}/{CURRENCY.label.CUP}</strong>. Puedes
              cambiarla desde el encabezado.
            </p>
          }
        />
      </div>
    </div>
  )
}
