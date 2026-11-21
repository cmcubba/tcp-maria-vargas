import { BUSINESS } from '../config'
import { getPaymentOption } from '../data/payments'
import type { Currency, Order } from '../types'
import { formatPickupDate, formatOrderDate } from './dates'
import { convertFromUSD, formatAmount } from './money'

function money(amountUSD: number, currency: Currency): string {
  const value = convertFromUSD(amountUSD, currency)
  return `$${formatAmount(value, currency === 'CUP' ? 0 : 2)} ${currency}`
}

export function getPaymentTotal(order: Order): { currency: Currency; label: string } {
  const option = getPaymentOption(order.paymentMethod)
  const value =
    option.currency === 'CUP' ? order.totalUSD * order.exchangeRate : order.totalUSD

  return {
    currency: option.currency,
    label: `$${formatAmount(value, option.currency === 'CUP' ? 0 : 2)} ${option.currency}`,
  }
}

export function buildOrderWhatsAppMessage(order: Order): string {
  const payment = getPaymentOption(order.paymentMethod)
  const paymentTotal = getPaymentTotal(order)
  const isPickup = order.delivery.method === 'pickup'

  const lines: string[] = [
    `*NUEVO PEDIDO ${order.code}*`,
    `Fecha: ${formatOrderDate(order.createdAt)}`,
    '',
    '*Cliente*',
    `Nombre: ${order.customer.fullName}`,
    `Teléfono: ${order.customer.phone}`,
  ]

  if (order.customer.email) {
    lines.push(`Correo: ${order.customer.email}`)
  }

  lines.push('', '*Método de pago*', `${payment.label} — ${paymentTotal.label}`)

  if (isPickup) {
    lines.push(
      '',
      '*Recogida en el establecimiento*',
      BUSINESS.address,
      `Fecha: ${formatPickupDate(order.delivery.pickupDate)}${order.delivery.pickupSlot ? ` · ${order.delivery.pickupSlot}` : ''}`,
    )
  } else {
    lines.push(
      '',
      '*Entrega a domicilio*',
      `${order.delivery.address}, ${order.delivery.neighborhood}`,
      `${order.delivery.municipality}, ${order.delivery.province}`,
    )
    if (order.delivery.reference) {
      lines.push(`Referencia: ${order.delivery.reference}`)
    }
  }

  if (order.delivery.notes) {
    lines.push(`Observaciones: ${order.delivery.notes}`)
  }

  lines.push('', '*Productos*')
  order.items.forEach((item) => {
    lines.push(
      `• ${item.quantity} × ${item.name} (${item.presentation}) — ${money(item.lineTotalUSD, order.currency)}`,
    )
  })

  lines.push(
    '',
    `Subtotal: ${money(order.subtotalUSD, order.currency)}`,
    `Entrega: ${order.delivery.costUSD > 0 ? money(order.delivery.costUSD, order.currency) : 'Gratis'}`,
    `*Total: ${money(order.totalUSD, order.currency)}*`,
  )

  if (payment.currency !== order.currency) {
    lines.push(`Total a pagar (${payment.label}): *${paymentTotal.label}*`)
  }

  lines.push('', 'Pedido creado desde la tienda en línea de TCP Maria Vargas.')

  return lines.join('\n')
}

export function buildOrderWhatsAppLink(order: Order): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(buildOrderWhatsAppMessage(order))}`
}
