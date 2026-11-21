import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  Coins,
  Landmark,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react'
import { SummaryCard } from '../components/cart/SummaryCard'
import { EmptyState } from '../components/ui/EmptyState'
import { FormField } from '../components/ui/FormField'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { useToast } from '../context/ToastContext'
import { BUSINESS, CURRENCY } from '../config'
import { DELIVERY_COST_USD, DELIVERY_MIN_SUBTOTAL_USD, getMunicipalities, meetsDeliveryMinimum, pickupSlots } from '../data/delivery'
import { getPaymentOption, paymentMethods } from '../data/payments'
import { submitOrder } from '../services/orders'
import type { CustomerData, DeliveryData, DeliveryMethod, OrderItem, PaymentMethod } from '../types'
import { formatPickupDate, getPickupDates } from '../utils/dates'
import { buildOrderWhatsAppLink } from '../utils/orderWhatsApp'
import { buildWhatsAppLink } from '../utils/validation'
import { validateCheckout, type CheckoutErrors } from '../utils/validation'
import { cn } from '../utils/cn'

export function CheckoutPage() {
  const { items, subtotalUSD, clearCart } = useCart()
  const { currency, rate, format } = useCurrency()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<CustomerData>({ fullName: '', phone: '', email: '' })
  const [method, setMethod] = useState<DeliveryMethod>('pickup')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupSlot, setPickupSlot] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [address, setAddress] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const pickupDates = useMemo(() => getPickupDates(14), [])
  const municipalities = getMunicipalities()
  const deliveryCost = method === 'delivery' ? DELIVERY_COST_USD : 0
  const deliveryLocked = method === 'delivery' && !meetsDeliveryMinimum(subtotalUSD)
  const totalUSD = subtotalUSD + deliveryCost

  const delivery = useMemo<DeliveryData>(
    () => ({
      method,
      pickupDate: method === 'pickup' ? pickupDate : '',
      pickupSlot: method === 'pickup' ? pickupSlot : '',
      province: method === 'delivery' ? 'La Habana' : '',
      municipality: method === 'delivery' ? municipality : '',
      address: method === 'delivery' ? address : '',
      neighborhood: method === 'delivery' ? neighborhood : '',
      reference: method === 'delivery' ? reference : '',
      notes,
      costUSD: deliveryCost,
    }),
    [
      method,
      pickupDate,
      pickupSlot,
      municipality,
      address,
      neighborhood,
      reference,
      notes,
      deliveryCost,
    ],
  )

  const clearError = (field: keyof CheckoutErrors) => {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const updateCustomer = (field: keyof CustomerData, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }))
    clearError(field)
  }

  const focusFirstError = () => {
    window.setTimeout(() => {
      const element = document.querySelector<HTMLElement>('[aria-invalid="true"]')
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element?.focus({ preventScroll: true })
    }, 80)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validateCheckout(customer, delivery)
    if (deliveryLocked) {
      nextErrors.form = `El envío a domicilio requiere un mínimo de $${DELIVERY_MIN_SUBTOTAL_USD} en productos.`
    }
    if (!paymentMethod) {
      nextErrors.payment = 'Selecciona un método de pago.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      showToast(
        deliveryLocked
          ? `El envío requiere un mínimo de $${DELIVERY_MIN_SUBTOTAL_USD} en productos`
          : 'Revisa los campos marcados en el formulario',
        { tone: 'error' },
      )
      if (deliveryLocked) {
        window.setTimeout(() => {
          document.querySelector('.delivery-cost')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 80)
      } else {
        focusFirstError()
      }
      return
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      brand: item.product.brand,
      presentation: item.product.presentation,
      image: item.product.image,
      unitPriceUSD: item.product.priceUSD,
      quantity: item.quantity,
      lineTotalUSD: item.lineTotalUSD,
    }))

    if (!paymentMethod) return
    const selectedPayment = paymentMethod
    setSubmitting(true)
    setSubmitError(null)
    const whatsappWindow = window.open('about:blank', '_blank')
    try {
      const order = await submitOrder({
        customer: {
          fullName: customer.fullName.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
        },
        delivery,
        items: orderItems,
        subtotalUSD,
        deliveryUSD: deliveryCost,
        totalUSD,
        currency,
        exchangeRate: rate,
        paymentMethod: selectedPayment,
      })
      clearCart()
      const whatsappLink = buildOrderWhatsAppLink(order)
      if (whatsappWindow) {
        whatsappWindow.location.replace(whatsappLink)
      } else {
        window.open(whatsappLink, '_blank', 'noopener,noreferrer')
      }
      showToast('Pedido creado. Abrimos WhatsApp con el resumen del pedido.', { tone: 'success' })
      navigate(`/pedido/${order.code}`, { state: { order } })
    } catch {
      whatsappWindow?.close()
      setSubmitError(
        'No pudimos registrar tu pedido en este momento. Intenta nuevamente o escríbenos por WhatsApp.',
      )
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="container section">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="No hay productos para procesar"
          description="Agrega productos al carrito antes de continuar con el pedido."
          action={
            <Link to="/productos" className="btn btn--primary btn--lg">
              Ver productos
            </Link>
          }
        />
      </div>
    )
  }

  const inputClass = (field: keyof CheckoutErrors) => cn('input', errors[field] && 'input--error')

  return (
    <div className="container section checkout-page">
      <header className="page-head">
        <span className="eyebrow">Último paso</span>
        <h1 className="page-title">Finalizar pedido</h1>
        <p className="page-subtitle">
          Completa tus datos y elige cómo quieres recibir tu compra. No se realiza ningún cobro en
          línea.
        </p>
      </header>

      <form id="checkout-form" className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form">
          <section className="form-card" aria-labelledby="customer-title">
            <div className="form-card__head">
              <span className="form-card__step">1</span>
              <div>
                <h2 id="customer-title">Datos del cliente</h2>
                <p>Usaremos estos datos para contactarte y coordinar tu pedido.</p>
              </div>
            </div>

            <div className="field-grid">
              <FormField
                label="Nombre y apellidos"
                htmlFor="fullName"
                required
                error={errors.fullName}
                className="field--full"
              >
                <input
                  id="fullName"
                  type="text"
                  className={inputClass('fullName')}
                  value={customer.fullName}
                  onChange={(event) => updateCustomer('fullName', event.target.value)}
                  placeholder="Ej. María Fernanda López"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
              </FormField>

              <FormField label="Teléfono" htmlFor="phone" required error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  className={inputClass('phone')}
                  value={customer.phone}
                  onChange={(event) => updateCustomer('phone', event.target.value)}
                  placeholder="+53 5 467 6775"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </FormField>

              <FormField label="Correo electrónico" htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  className={inputClass('email')}
                  value={customer.email}
                  onChange={(event) => updateCustomer('email', event.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </FormField>
            </div>
          </section>

          <section className="form-card" aria-labelledby="delivery-title">
            <div className="form-card__head">
              <span className="form-card__step">2</span>
              <div>
                <h2 id="delivery-title">Modalidad de entrega</h2>
                <p>Elige cómo prefieres recibir tu pedido.</p>
              </div>
            </div>

            <div className="method-grid" role="radiogroup" aria-label="Modalidad de entrega">
              <button
                type="button"
                role="radio"
                aria-checked={method === 'pickup'}
                className={cn('method-option', method === 'pickup' && 'is-active')}
                onClick={() => {
                  setMethod('pickup')
                  setErrors({})
                }}
              >
                <span className="method-option__icon"><Store size={22} aria-hidden="true" /></span>
                <span className="method-option__body">
                  <strong>Recoger en el establecimiento</strong>
                  <span>Sin costo · listo en 2 horas</span>
                </span>
                <span className="method-option__check">
                  {method === 'pickup' && <CheckCircle2 size={20} aria-hidden="true" />}
                </span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={method === 'delivery'}
                className={cn('method-option', method === 'delivery' && 'is-active')}
                onClick={() => {
                  setMethod('delivery')
                  setErrors({})
                }}
              >
                <span className="method-option__icon"><Truck size={22} aria-hidden="true" /></span>
                <span className="method-option__body">
                  <strong>Servicio a domicilio</strong>
                  <span>La Habana · ${DELIVERY_COST_USD} · 1 a 5 horas</span>
                </span>
                <span className="method-option__check">
                  {method === 'delivery' && <CheckCircle2 size={20} aria-hidden="true" />}
                </span>
              </button>
            </div>

            {method === 'pickup' ? (
              <div className="pickup-block">
                <div className="pickup-address">
                  <span className="pickup-address__icon"><MapPin size={18} aria-hidden="true" /></span>
                  <div>
                    <strong>{BUSINESS.name}</strong>
                    <p>{BUSINESS.address}</p>
                    <p className="pickup-address__hours">
                      <Clock size={14} aria-hidden="true" />
                      {BUSINESS.hours[0].days}: {BUSINESS.hours[0].time}
                    </p>
                  </div>
                </div>

                <div className="field-grid">
                  <FormField
                    label="Fecha de recogida"
                    htmlFor="pickupDate"
                    required
                    error={errors.pickupDate}
                  >
                    <select
                      id="pickupDate"
                      className={inputClass('pickupDate')}
                      value={pickupDate}
                      onChange={(event) => {
                        setPickupDate(event.target.value)
                        clearError('pickupDate')
                      }}
                      aria-invalid={Boolean(errors.pickupDate)}
                      aria-describedby={errors.pickupDate ? 'pickupDate-error' : undefined}
                    >
                      <option value="">Selecciona una fecha</option>
                      {pickupDates.map((date) => (
                        <option key={date.iso} value={date.iso}>
                          {date.weekday} · {date.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Horario de recogida"
                    htmlFor="pickupSlot"
                    required
                    error={errors.pickupSlot}
                  >
                    <select
                      id="pickupSlot"
                      className={inputClass('pickupSlot')}
                      value={pickupSlot}
                      onChange={(event) => {
                        setPickupSlot(event.target.value)
                        clearError('pickupSlot')
                      }}
                      aria-invalid={Boolean(errors.pickupSlot)}
                      aria-describedby={errors.pickupSlot ? 'pickupSlot-error' : undefined}
                    >
                      <option value="">Selecciona un horario</option>
                      {pickupSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </div>
            ) : (
              <div className="delivery-block">
                <div className="field-grid">
                  <FormField
                    label="Municipio"
                    htmlFor="municipality"
                    required
                    error={errors.municipality}
                  >
                    <select
                      id="municipality"
                      className={inputClass('municipality')}
                      value={municipality}
                      onChange={(event) => {
                        setMunicipality(event.target.value)
                        clearError('municipality')
                      }}
                      aria-invalid={Boolean(errors.municipality)}
                      aria-describedby={errors.municipality ? 'municipality-error' : undefined}
                    >
                      <option value="">Selecciona tu municipio</option>
                      {municipalities.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Dirección exacta"
                    htmlFor="address"
                    required
                    error={errors.address}
                    className="field--full"
                  >
                    <input
                      id="address"
                      type="text"
                      className={inputClass('address')}
                      value={address}
                      onChange={(event) => {
                        setAddress(event.target.value)
                        clearError('address')
                      }}
                      placeholder="Calle, número, entre calles, edificio, apartamento"
                      autoComplete="street-address"
                      aria-invalid={Boolean(errors.address)}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                  </FormField>

                  <FormField
                    label="Barrio o reparto"
                    htmlFor="neighborhood"
                    required
                    error={errors.neighborhood}
                  >
                    <input
                      id="neighborhood"
                      type="text"
                      className={inputClass('neighborhood')}
                      value={neighborhood}
                      onChange={(event) => {
                        setNeighborhood(event.target.value)
                        clearError('neighborhood')
                      }}
                      placeholder="Ej. Nuevo Vedado"
                      aria-invalid={Boolean(errors.neighborhood)}
                      aria-describedby={errors.neighborhood ? 'neighborhood-error' : undefined}
                    />
                  </FormField>

                  <FormField label="Referencias para localizar" htmlFor="reference">
                    <input
                      id="reference"
                      type="text"
                      className="input"
                      value={reference}
                      onChange={(event) => setReference(event.target.value)}
                      placeholder="Ej. frente al parque, casa amarilla"
                    />
                  </FormField>
                </div>

                <div className="delivery-cost">
                  <div>
                    <span className="delivery-cost__label">Costo de entrega</span>
                    <strong className="delivery-cost__value">{format(deliveryCost)}</strong>
                  </div>
                  <p className="delivery-cost__note">
                    Entregamos únicamente en los 16 municipios de La Habana, en 1 a 5 horas. El
                    envío requiere un mínimo de ${DELIVERY_MIN_SUBTOTAL_USD} en productos.
                  </p>
                </div>
              </div>
            )}

            <FormField
              label="Observaciones adicionales"
              htmlFor="notes"
              className="field--full checkout-notes"
            >
              <textarea
                id="notes"
                className="textarea"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="¿Alguna indicación especial para tu pedido o entrega?"
              />
            </FormField>
          </section>

          <section className="form-card" aria-labelledby="payment-title">
            <div className="form-card__head">
              <span className="form-card__step">3</span>
              <div>
                <h2 id="payment-title">Método de pago</h2>
                <p>
                  Elige cómo vas a pagar. No se realiza ningún cobro en línea: el pago se coordina
                  directamente con el negocio.
                </p>
              </div>
            </div>

            <div
              className="method-grid method-grid--payment"
              role="radiogroup"
              aria-label="Método de pago"
              aria-invalid={Boolean(errors.payment)}
              aria-describedby={errors.payment ? 'payment-error' : undefined}
            >
              {paymentMethods.map((option) => {
                const Icon = option.id === 'zelle' ? Landmark : option.id === 'cash-cup' ? Coins : Banknote
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === option.id}
                    className={cn('method-option', paymentMethod === option.id && 'is-active')}
                    onClick={() => {
                      setPaymentMethod(option.id)
                      clearError('payment')
                    }}
                  >
                    <span className="method-option__icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="method-option__body">
                      <strong>
                        {option.label}
                        {option.id === 'cash-cup' && ` · 1 USD = ${CURRENCY.cupRate} CUP`}
                      </strong>
                      <span>{option.description}</span>
                    </span>
                    <span className="method-option__check">
                      {paymentMethod === option.id && <CheckCircle2 size={20} aria-hidden="true" />}
                    </span>
                  </button>
                )
              })}
            </div>

            {errors.payment && <p className="field__error" id="payment-error">{errors.payment}</p>}

            <p className="payment-note">
              <MessageCircle size={15} aria-hidden="true" />
              Al confirmar, se abrirá WhatsApp con el resumen completo del pedido para enviarlo al
              negocio.
            </p>

            {submitError && <p className="alert alert--error">{submitError}</p>}
          </section>
        </div>

        <div className="checkout-summary">
          <SummaryCard
            title="Resumen y confirmación"
            subtotalUSD={subtotalUSD}
            deliveryUSD={deliveryCost}
            totalUSD={totalUSD}
            note={
              <span>
                {method === 'pickup'
                  ? pickupDate
                    ? `Recogida: ${formatPickupDate(pickupDate)}${pickupSlot ? `, ${pickupSlot}` : ''}`
                    : 'Recogida en el establecimiento, sin costo.'
                  : municipality
                    ? `Entrega a domicilio en ${municipality}, La Habana.`
                    : `Entrega a domicilio en La Habana · mínimo $${DELIVERY_MIN_SUBTOTAL_USD}.`}
              </span>
            }
            cta={
              <button
                type="submit"
                className="btn btn--primary btn--lg btn--block"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="spin" aria-hidden="true" />
                    Procesando pedido…
                  </>
                ) : (
                  <>
                    Confirmar pedido
                    <ArrowRight size={17} aria-hidden="true" />
                  </>
                )}
              </button>
            }
            footer={
              <a
                href={buildWhatsAppLink('Hola, necesito ayuda con mi pedido en TCP Maria Vargas.')}
                target="_blank"
                rel="noreferrer"
                className="summary__whatsapp"
              >
                <MessageCircle size={16} aria-hidden="true" />
                ¿Dudas? Escríbenos por WhatsApp
              </a>
            }
          >
            <ul className="summary-items">
              {items.map((item) => (
                <li key={item.productId} className="summary-item">
                  <img src={item.product.image} alt="" />
                  <div className="summary-item__info">
                    <span className="summary-item__name">{item.product.name}</span>
                    <span className="summary-item__meta">
                      {item.product.presentation} · {item.quantity} × {format(item.product.priceUSD)}
                    </span>
                  </div>
                  <strong>{format(item.lineTotalUSD)}</strong>
                </li>
              ))}
            </ul>
            <div className="summary-customer">
              <h3>Entrega y cliente</h3>
              <p><strong>{customer.fullName || 'Nombre por completar'}</strong></p>
              <p>{customer.phone || 'Teléfono por completar'}</p>
              <p>{method === 'pickup' ? 'Recogida en el local' : 'Entrega a domicilio'}</p>
              {paymentMethod && <p>Pago: {getPaymentOption(paymentMethod).label}</p>}
            </div>
          </SummaryCard>
          <p className="checkout-safe">
            <ShieldCheck size={15} aria-hidden="true" />
            Recibirás la confirmación del pedido con todos los detalles.
          </p>
        </div>
      </form>
    </div>
  )
}
