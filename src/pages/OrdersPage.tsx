import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  Clock,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  User,
  Wallet,
} from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../context/ToastContext'
import { getOrderStatus, orderStatuses } from '../data/orderStatus'
import { getPaymentOption } from '../data/payments'
import { getOrders, updateOrderStatus } from '../services/orders'
import type { Order, OrderStatus } from '../types'
import { formatOrderDate, formatPickupDate } from '../utils/dates'
import { getPaymentTotal } from '../utils/orderWhatsApp'
import { convertFromUSD, formatAmount } from '../utils/money'
import { cn } from '../utils/cn'

function orderMoney(order: Order, amountUSD: number): string {
  const value = convertFromUSD(amountUSD, order.currency)
  return `$${formatAmount(value, order.currency === 'CUP' ? 0 : 2)}`
}

export function OrdersPage() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<Order[]>(() => getOrders())

  const handleStatusChange = (code: string, status: OrderStatus) => {
    const updated = updateOrderStatus(code, status)
    if (!updated) {
      showToast('No pudimos actualizar el estado del pedido.', { tone: 'error' })
      return
    }
    setOrders((current) => current.map((order) => (order.code === code ? updated : order)))
    showToast(`Estado actualizado: ${getOrderStatus(status).label}.`, { tone: 'success' })
  }

  return (
    <div className="container section orders-page">
      <header className="page-head">
        <span className="eyebrow">Seguimiento</span>
        <h1 className="page-title">Pedidos</h1>
        <p className="page-subtitle">
          Consulta los pedidos guardados en este dispositivo y actualiza su estado para que el
          cliente sepa cómo va su compra.
        </p>
      </header>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package size={32} />}
          title="Todavía no hay pedidos"
          description="Cuando confirmes un pedido aparecerá aquí con su número, productos y estado."
          action={
            <Link to="/productos" className="btn btn--primary btn--lg">
              Ver productos
            </Link>
          }
        />
      ) : (
        <>
          <p className="orders-count">
            {orders.length} {orders.length === 1 ? 'pedido guardado' : 'pedidos guardados'}
          </p>
          <div className="orders-list">
            {orders.map((order) => {
              const status = getOrderStatus(order.status)
              const payment = getPaymentOption(order.paymentMethod)
              const paymentTotal = getPaymentTotal(order)
              const isPickup = order.delivery.method === 'pickup'
              const itemCount = order.items.reduce((total, item) => total + item.quantity, 0)

              return (
                <article key={order.code} className="order-card">
                  <div className="order-card__head">
                    <div>
                      <strong className="order-card__code">{order.code}</strong>
                      <span className="order-card__date">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    <span className={cn('order-status', `order-status--${status.tone}`)}>
                      {status.shortLabel}
                    </span>
                  </div>

                  <div className="order-card__meta">
                    <span><User size={15} aria-hidden="true" /> {order.customer.fullName}</span>
                    <span><Phone size={15} aria-hidden="true" /> {order.customer.phone}</span>
                    <span>
                      {isPickup ? <Store size={15} aria-hidden="true" /> : <Truck size={15} aria-hidden="true" />}
                      {isPickup ? 'Recogida en el local' : `Entrega en ${order.delivery.municipality || order.delivery.province}`}
                    </span>
                    <span><Wallet size={15} aria-hidden="true" /> {payment.label}</span>
                  </div>

                  <div className="order-card__summary">
                    <span><ShoppingBag size={15} aria-hidden="true" /> {itemCount} artículos</span>
                    <span className="order-card__pay">Pago: {paymentTotal.label}</span>
                    <span className="order-card__total">
                      Total: <strong>{orderMoney(order, order.totalUSD)} {order.currency}</strong>
                    </span>
                  </div>

                  <details className="order-card__details">
                    <summary>
                      Ver detalle del pedido
                      <ChevronDown size={16} aria-hidden="true" />
                    </summary>
                    <div className="order-card__details-body">
                      <ul className="order-card__items">
                        {order.items.map((item) => (
                          <li key={item.productId}>
                            <span>{item.quantity} × {item.name} <small>({item.presentation})</small></span>
                            <strong>{orderMoney(order, item.lineTotalUSD)}</strong>
                          </li>
                        ))}
                      </ul>

                      <ul className="order-card__info">
                        <li>
                          <MapPin size={15} aria-hidden="true" />
                          <span>
                            {isPickup
                              ? order.delivery.pickupDate
                                ? `${formatPickupDate(order.delivery.pickupDate)}${order.delivery.pickupSlot ? ` · ${order.delivery.pickupSlot}` : ''}`
                                : 'Recogida en el local'
                              : `${order.delivery.address}, ${order.delivery.neighborhood}, ${order.delivery.municipality}, ${order.delivery.province}`}
                          </span>
                        </li>
                        {order.delivery.notes && (
                          <li>
                            <Clock size={15} aria-hidden="true" />
                            <span>{order.delivery.notes}</span>
                          </li>
                        )}
                      </ul>

                      <Link to={`/pedido/${order.code}`} className="btn btn--outline btn--sm">
                        Ver comprobante
                      </Link>
                    </div>
                  </details>

                  <div className="order-card__status-row">
                    <label htmlFor={`status-${order.code}`}>Estado del pedido</label>
                    <select
                      id={`status-${order.code}`}
                      className="order-status-select"
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.code, event.target.value as OrderStatus)
                      }
                    >
                      {orderStatuses.map((option) => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
