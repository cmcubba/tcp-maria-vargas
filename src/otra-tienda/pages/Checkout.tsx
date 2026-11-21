import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MapPin, Store, Truck } from 'lucide-react'
import { useOtCart } from '../cart'
import { OT_BASE, OT_CAFE } from '../data'
import {
  buildOrderCode,
  buildOtWhatsAppLink,
  formatUSD,
  OT_PAYMENT_LABELS,
  saveOtOrder,
} from '../utils'
import type { OtDeliveryMethod, OtOrder, OtPaymentMethod } from '../utils'
import { cn } from '../../utils/cn'

const DELIVERY_COST = 3

const PAYMENT_OPTIONS: Array<{ id: OtPaymentMethod; description: string }> = [
  { id: 'cash-usd', description: 'En efectivo al recibir o recoger.' },
  { id: 'zelle', description: 'Transferencia en USD; te enviamos los datos.' },
  { id: 'cash-cup', description: 'Pago en pesos, según la tasa del día.' },
]

interface FormState {
  name: string
  phone: string
  address: string
  reference: string
  notes: string
}

export function OtCheckout() {
  const { items, subtotalUSD, clear } = useOtCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    address: '',
    reference: '',
    notes: '',
  })
  const [method, setMethod] = useState<OtDeliveryMethod>('pickup')
  const [payment, setPayment] = useState<OtPaymentMethod | ''>('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'payment', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const shippingUSD = method === 'delivery' ? DELIVERY_COST : 0
  const totalUSD = subtotalUSD + shippingUSD

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        name: item.product.name,
        presentation: item.product.weight,
        unitPriceUSD: item.product.priceUSD,
        quantity: item.quantity,
        lineTotalUSD: item.lineTotalUSD,
      })),
    [items],
  )

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const next: Partial<Record<keyof FormState | 'payment', string>> = {}
    if (form.name.trim().length < 5) next.name = 'Escribe tu nombre completo.'
    if (form.phone.replace(/\D/g, '').length < 8) next.phone = 'Escribe un teléfono válido.'
    if (method === 'delivery' && form.address.trim().length < 6) {
      next.address = 'Escribe la dirección de entrega.'
    }
    if (!payment) next.payment = 'Selecciona un método de pago.'

    if (Object.keys(next).length > 0) {
      setErrors(next)
      setSubmitError('Revisa los campos marcados.')
      return
    }
    if (!payment) return

    const selectedPayment = payment
    setSubmitting(true)
    setSubmitError(null)
    const whatsappWindow = window.open('about:blank', '_blank')

    const order: OtOrder = {
      code: buildOrderCode(),
      createdAt: new Date().toISOString(),
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      delivery: {
        method,
        address: method === 'delivery' ? form.address.trim() : '',
        reference: method === 'delivery' ? form.reference.trim() : '',
        notes: form.notes.trim(),
      },
      payment: selectedPayment,
      items: orderItems,
      subtotalUSD,
      shippingUSD,
      totalUSD,
    }

    window.setTimeout(() => {
      saveOtOrder(order)
      clear()
      const link = buildOtWhatsAppLink(order)
      if (whatsappWindow) {
        whatsappWindow.location.replace(link)
      } else {
        window.open(link, '_blank', 'noopener,noreferrer')
      }
      navigate(`${OT_BASE}/pedido/${order.code}`, { replace: true, state: { order } })
    }, 700)
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="ot-wrap ot-page">
        <div className="ot-empty">
          <h1 className="ot-page__title">No hay café en el carrito</h1>
          <p>Agrega un lote antes de pasar por el checkout.</p>
          <Link to={`${OT_BASE}/catalogo`} className="ot-btn ot-btn--copper">
            Ver todo el café
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ot-wrap ot-page">
      <header className="ot-page__head">
        <span className="ot-eyebrow">Último paso</span>
        <h1 className="ot-page__title">Checkout</h1>
        <p className="ot-page__lead">
          Sin cobros en línea. Al confirmar se abrirá WhatsApp con el resumen para coordinar el pago
          y la entrega.
        </p>
      </header>

      <form id="ot-checkout" className="ot-checkout" onSubmit={handleSubmit} noValidate>
        <div className="ot-checkout__form">
          <section className="ot-form-block">
            <span className="ot-form-block__num">01</span>
            <h2>Datos</h2>
            <div className="ot-fields">
              <label className={cn('ot-field', errors.name && 'has-error')}>
                <span>Nombre y apellidos</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Ej. Ana Rodríguez"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <em>{errors.name}</em>}
              </label>
              <label className={cn('ot-field', errors.phone && 'has-error')}>
                <span>Teléfono</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder="+53 5 000 0000"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <em>{errors.phone}</em>}
              </label>
            </div>
          </section>

          <section className="ot-form-block">
            <span className="ot-form-block__num">02</span>
            <h2>Entrega</h2>
            <div className="ot-choice-grid">
              <button
                type="button"
                className={cn('ot-choice', method === 'pickup' && 'is-active')}
                onClick={() => setMethod('pickup')}
                aria-pressed={method === 'pickup'}
              >
                <Store size={19} aria-hidden="true" />
                <span>
                  <strong>Recoger</strong>
                  <small>Gratis · Vedado</small>
                </span>
                {method === 'pickup' && <CheckCircle2 size={17} aria-hidden="true" />}
              </button>
              <button
                type="button"
                className={cn('ot-choice', method === 'delivery' && 'is-active')}
                onClick={() => setMethod('delivery')}
                aria-pressed={method === 'delivery'}
              >
                <Truck size={19} aria-hidden="true" />
                <span>
                  <strong>Envío</strong>
                  <small>{formatUSD(DELIVERY_COST)} · La Habana</small>
                </span>
                {method === 'delivery' && <CheckCircle2 size={17} aria-hidden="true" />}
              </button>
            </div>

            {method === 'pickup' ? (
              <p className="ot-pickup">
                <MapPin size={16} aria-hidden="true" />
                {OT_CAFE.address}
              </p>
            ) : (
              <div className="ot-fields">
                <label className={cn('ot-field ot-field--full', errors.address && 'has-error')}>
                  <span>Dirección</span>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(event) => update('address', event.target.value)}
                    placeholder="Calle, número, entre calles, edificio, apto."
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && <em>{errors.address}</em>}
                </label>
                <label className="ot-field ot-field--full">
                  <span>Referencia (opcional)</span>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(event) => update('reference', event.target.value)}
                    placeholder="Ej. frente al parque"
                  />
                </label>
              </div>
            )}

            <label className="ot-field ot-field--full">
              <span>Notas (opcional)</span>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
                placeholder="Indicaciones para el tueste, la entrega o el pago"
              />
            </label>
          </section>

          <section className="ot-form-block">
            <span className="ot-form-block__num">03</span>
            <h2>Pago</h2>
            <div className="ot-payments">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={cn('ot-payment', payment === option.id && 'is-active')}
                  onClick={() => {
                    setPayment(option.id)
                    setErrors((current) => ({ ...current, payment: undefined }))
                  }}
                  aria-pressed={payment === option.id}
                >
                  <span className="ot-payment__radio" aria-hidden="true" />
                  <span>
                    <strong>{OT_PAYMENT_LABELS[option.id]}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              ))}
            </div>
            {errors.payment && <p className="ot-form-error">{errors.payment}</p>}
            {submitError && <p className="ot-form-error">{submitError}</p>}
          </section>
        </div>

        <aside className="ot-summary ot-summary--checkout">
          <h2 className="ot-summary__title">Tu pedido</h2>
          <ul className="ot-summary__items">
            {items.map((item) => (
              <li key={item.product.id}>
                <span>{item.quantity} × {item.product.name}</span>
                <span>{formatUSD(item.lineTotalUSD)}</span>
              </li>
            ))}
          </ul>
          <div className="ot-summary__row">
            <span>Subtotal</span>
            <span>{formatUSD(subtotalUSD)}</span>
          </div>
          <div className="ot-summary__row">
            <span>{method === 'pickup' ? 'Recogida' : 'Envío'}</span>
            <span>{shippingUSD > 0 ? formatUSD(shippingUSD) : 'Gratis'}</span>
          </div>
          <div className="ot-summary__total">
            <span>Total</span>
            <strong>{formatUSD(totalUSD)}</strong>
          </div>
          <button type="submit" className="ot-btn ot-btn--copper ot-btn--block" disabled={submitting}>
            {submitting ? 'Creando pedido…' : 'Confirmar pedido'}
            {!submitting && <ArrowRight size={17} aria-hidden="true" />}
          </button>
          <p className="ot-summary__note">
            Precios en USD. El pago se coordina directamente con la cafetería.
          </p>
        </aside>
      </form>
    </div>
  )
}
