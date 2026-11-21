import { Link, useLocation, useParams } from 'react-router-dom'
import { Check, MapPin, MessageCircle, Store, Truck } from 'lucide-react'
import { OT_BASE, OT_CAFE } from '../data'
import { buildOtWhatsAppLink, formatUSD, getOtOrder, OT_PAYMENT_LABELS } from '../utils'
import type { OtOrder } from '../utils'

export function OtPedido() {
  const { code = '' } = useParams<{ code: string }>()
  const location = useLocation()
  const stateOrder = (location.state as { order?: OtOrder } | null)?.order
  const order = stateOrder ?? getOtOrder(code)

  if (!order) {
    return (
      <div className="ot-wrap ot-page">
        <div className="ot-empty">
          <h1 className="ot-page__title">Pedido no encontrado</h1>
          <p>No encontramos un pedido con ese número en este dispositivo.</p>
          <Link to={`${OT_BASE}/catalogo`} className="ot-btn ot-btn--copper">
            Volver al café
          </Link>
        </div>
      </div>
    )
  }

  const firstName = order.customer.name.split(' ')[0]
  const isPickup = order.delivery.method === 'pickup'

  return (
    <div className="ot-wrap ot-page">
      <div className="ot-confirm">
        <span className="ot-confirm__icon"><Check size={24} aria-hidden="true" /></span>
        <span className="ot-eyebrow">Pedido recibido</span>
        <h1 className="ot-confirm__title">Gracias, {firstName}.</h1>
        <p className="ot-confirm__lead">
          Guardamos tu pedido y abrimos WhatsApp con el resumen. Si la ventana no se abrió, envíalo
          con el botón de abajo para coordinar el pago y la entrega.
        </p>
        <div className="ot-confirm__code">
          <span>Número de pedido</span>
          <strong>{order.code}</strong>
        </div>
        <span className="ot-confirm__status">Pendiente de confirmación</span>
      </div>

      <div className="ot-confirm__grid">
        <div className="ot-confirm__card">
          <h2>{isPickup ? 'Recogida' : 'Entrega'}</h2>
          <p className="ot-confirm__line">
            {isPickup ? <Store size={16} aria-hidden="true" /> : <Truck size={16} aria-hidden="true" />}
            {isPickup
              ? OT_CAFE.address
              : `${order.delivery.address}${order.delivery.reference ? ` · ${order.delivery.reference}` : ''}`}
          </p>
          <p className="ot-confirm__muted">
            {isPickup ? OT_CAFE.hours : 'Envío en La Habana · coordinamos el horario por WhatsApp.'}
          </p>
          <p className="ot-confirm__muted">
            Pago: {OT_PAYMENT_LABELS[order.payment]}
          </p>
          {order.delivery.notes && (
            <p className="ot-confirm__muted">Notas: {order.delivery.notes}</p>
          )}
          <p className="ot-confirm__muted">
            <MapPin size={14} aria-hidden="true" /> Te contactaremos al {order.customer.phone}.
          </p>
        </div>

        <div className="ot-confirm__card">
          <h2>Productos</h2>
          <ul className="ot-confirm__items">
            {order.items.map((item) => (
              <li key={item.name}>
                <span>{item.quantity} × {item.name} <small>({item.presentation})</small></span>
                <span>{formatUSD(item.lineTotalUSD)}</span>
              </li>
            ))}
          </ul>
          <div className="ot-confirm__row">
            <span>Subtotal</span>
            <span>{formatUSD(order.subtotalUSD)}</span>
          </div>
          <div className="ot-confirm__row">
            <span>{isPickup ? 'Recogida' : 'Envío'}</span>
            <span>{order.shippingUSD > 0 ? formatUSD(order.shippingUSD) : 'Gratis'}</span>
          </div>
          <div className="ot-confirm__total">
            <span>Total</span>
            <strong>{formatUSD(order.totalUSD)}</strong>
          </div>
        </div>
      </div>

      <div className="ot-confirm__actions">
        <a href={buildOtWhatsAppLink(order)} target="_blank" rel="noreferrer" className="ot-btn ot-btn--copper">
          <MessageCircle size={17} aria-hidden="true" />
          Enviar pedido por WhatsApp
        </a>
        <Link to={`${OT_BASE}/catalogo`} className="ot-btn ot-btn--ghost">
          Seguir comprando
        </Link>
      </div>

      <p className="ot-confirm__foot">
        Guarda tu número <strong>{order.code}</strong> para cualquier consulta.
      </p>
    </div>
  )
}
