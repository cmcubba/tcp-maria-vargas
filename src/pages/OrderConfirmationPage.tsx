import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  User,
  Wallet,
} from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { CURRENCY, BUSINESS } from '../config'
import { getOrderByCode } from '../services/orders'
import type { Order } from '../types'
import { formatPickupDate, formatOrderDate } from '../utils/dates'
import { formatAmount, convertFromUSD } from '../utils/money'
import { getOrderStatus } from '../data/orderStatus'
import { getPaymentOption } from '../data/payments'
import { buildOrderWhatsAppLink, getPaymentTotal } from '../utils/orderWhatsApp'
import { cn } from '../utils/cn'

function orderMoney(order: Order, amountUSD: number): string {
  const value = convertFromUSD(amountUSD, order.currency)
  return `$${formatAmount(value, order.currency === 'CUP' ? 0 : 2)}`
}

export function OrderConfirmationPage() {
  const { code } = useParams<{ code: string }>()
  const location = useLocation()
  const stateOrder = (location.state as { order?: Order } | null)?.order
  const order = stateOrder ?? (code ? getOrderByCode(code) : null)

  if (!order) {
    return (
      <div className="container section">
        <EmptyState
          icon={<Package size={32} />}
          title="Pedido no encontrado"
          description="No encontramos un pedido con ese número. Si acabas de comprar, revisa el enlace de confirmación o escríbenos por WhatsApp."
          action={
            <div className="empty-state__actions">
              <Link to="/productos" className="btn btn--primary">
                Volver al catálogo
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  const firstName = order.customer.fullName.split(' ')[0]
  const isPickup = order.delivery.method === 'pickup'
  const totalLabel = `${orderMoney(order, order.totalUSD)} ${order.currency}`
  const payment = getPaymentOption(order.paymentMethod)
  const paymentTotal = getPaymentTotal(order)
  const status = getOrderStatus(order.status)

  return (
    <div className="container section confirmation">
      <div className="confirm-hero">
        <span className="confirm-hero__icon">
          <CheckCircle2 size={34} aria-hidden="true" />
        </span>
        <span className="eyebrow">Pedido recibido</span>
        <h1 className="confirm-hero__title">¡Gracias, {firstName}!</h1>
        <p className="confirm-hero__text">
          Tu pedido fue registrado correctamente. Te contactaremos para confirmar los detalles de
          {isPickup ? ' la recogida' : ' la entrega'}.
        </p>
        <div className="order-code">
          <span>Número de pedido</span>
          <strong>{order.code}</strong>
        </div>
        <span className={cn('order-status', `order-status--${status.tone}`)}>{status.label}</span>
        <p className="confirm-hero__date">Realizado el {formatOrderDate(order.createdAt)}</p>
        <Link to="/pedidos" className="confirm-orders-link">Ver todos mis pedidos</Link>
      </div>

      <div className="confirmation__grid">
        <div className="confirmation__main">
          <section className="confirm-card">
            <div className="confirm-card__head">
              <span className="confirm-card__icon">
                {isPickup ? <Store size={19} aria-hidden="true" /> : <Truck size={19} aria-hidden="true" />}
              </span>
              <div>
                <h2>{isPickup ? 'Recogida en el establecimiento' : 'Entrega a domicilio'}</h2>
                <span className="confirm-card__status">{status.label}</span>
              </div>
            </div>

            {isPickup ? (
              <ul className="confirm-list">
                <li>
                  <MapPin size={17} aria-hidden="true" />
                  <span>{BUSINESS.address}</span>
                </li>
                <li>
                  <Clock size={17} aria-hidden="true" />
                  <span>
                    {formatPickupDate(order.delivery.pickupDate)}
                    {order.delivery.pickupSlot ? ` · ${order.delivery.pickupSlot}` : ''}
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="confirm-list">
                <li>
                  <MapPin size={17} aria-hidden="true" />
                  <span>
                    {order.delivery.address}, {order.delivery.neighborhood}
                    <br />
                    {order.delivery.municipality}, {order.delivery.province}
                  </span>
                </li>
                {order.delivery.reference && (
                  <li>
                    <span className="confirm-list__label">Referencia:</span>
                    <span>{order.delivery.reference}</span>
                  </li>
                )}
                <li>
                  <Truck size={17} aria-hidden="true" />
                  <span>Costo de entrega: {orderMoney(order, order.delivery.costUSD)}</span>
                </li>
              </ul>
            )}

            {order.delivery.notes && (
              <p className="confirm-notes">
                <strong>Observaciones:</strong> {order.delivery.notes}
              </p>
            )}
          </section>

          <section className="confirm-card">
            <div className="confirm-card__head">
              <span className="confirm-card__icon"><User size={19} aria-hidden="true" /></span>
              <div>
                <h2>Datos del cliente</h2>
              </div>
            </div>
            <ul className="confirm-list">
              <li>
                <User size={17} aria-hidden="true" />
                <span>{order.customer.fullName}</span>
              </li>
              <li>
                <Phone size={17} aria-hidden="true" />
                <a href={`tel:+${order.customer.phone.replace(/\D/g, '')}`}>{order.customer.phone}</a>
              </li>
              {order.customer.email && (
                <li>
                  <span className="confirm-list__label">Correo:</span>
                  <span>{order.customer.email}</span>
                </li>
              )}
            </ul>
          </section>

          <section className="confirm-card">
            <div className="confirm-card__head">
              <span className="confirm-card__icon"><Wallet size={19} aria-hidden="true" /></span>
              <div>
                <h2>Método de pago</h2>
                <span className="confirm-card__status">Pago al recibir o coordinar</span>
              </div>
            </div>
            <ul className="confirm-list">
              <li>
                <Banknote size={17} aria-hidden="true" />
                <span>{payment.label}</span>
              </li>
              <li>
                <span className="confirm-list__label">Total a pagar:</span>
                <strong>{paymentTotal.label}</strong>
              </li>
              {payment.currency !== order.currency && (
                <li>
                  <span className="confirm-list__label">Total del pedido:</span>
                  <span>{totalLabel}</span>
                </li>
              )}
            </ul>
          </section>

          <section className="confirm-card">
            <div className="confirm-card__head">
              <span className="confirm-card__icon"><ShoppingBag size={19} aria-hidden="true" /></span>
              <div>
                <h2>Productos del pedido</h2>
                <span className="confirm-card__status">
                  {order.items.reduce((total, item) => total + item.quantity, 0)} artículos
                </span>
              </div>
            </div>
            <ul className="confirm-items">
              {order.items.map((item) => (
                <li key={item.productId}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.presentation} · {item.quantity} × {orderMoney(order, item.unitPriceUSD)}</span>
                  </div>
                  <span className="confirm-items__total">{orderMoney(order, item.lineTotalUSD)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="confirmation__aside">
          <div className="summary summary--confirm">
            <h2 className="summary__title">Total del pedido</h2>
            <div className="summary__rows">
              <div className="summary__row">
                <span>Subtotal</span>
                <span>{orderMoney(order, order.subtotalUSD)}</span>
              </div>
              <div className="summary__row">
                <span>Entrega</span>
                <span>{order.delivery.costUSD > 0 ? orderMoney(order, order.delivery.costUSD) : 'Gratis'}</span>
              </div>
              <div className="summary__total">
                <span>Total</span>
                <strong>{totalLabel}</strong>
              </div>
            </div>
            {order.currency === 'CUP' && (
              <p className="summary__rate">
                Tasa aplicada: 1 USD = {order.exchangeRate} CUP
              </p>
            )}
            <p className="summary__note">
              Pago: {payment.label} · {paymentTotal.label}. No se realizó ningún cobro en línea.
            </p>
            <div className="summary__cta">
              <a
                href={buildOrderWhatsAppLink(order)}
                target="_blank"
                rel="noreferrer"
                className="btn btn--whatsapp btn--block"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Enviar pedido por WhatsApp
              </a>
            </div>
            <Link to="/productos" className="btn btn--outline btn--block confirm-shop">
              Seguir comprando
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="confirm-hint">
            Guarda tu número de pedido <strong>{order.code}</strong> para cualquier consulta.
          </p>
          <p className="confirm-currency">
            Precios mostrados en {order.currency}
            {order.currency === 'CUP' ? ` (1 USD = ${CURRENCY.cupRate} CUP)` : ''}.
          </p>
        </aside>
      </div>
    </div>
  )
}
