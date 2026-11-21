import { OT_CAFE } from './data'

export type OtPaymentMethod = 'cash-usd' | 'zelle' | 'cash-cup'
export type OtDeliveryMethod = 'pickup' | 'delivery'

export interface OtOrderItem {
  name: string
  presentation: string
  unitPriceUSD: number
  quantity: number
  lineTotalUSD: number
}

export interface OtOrder {
  code: string
  createdAt: string
  customer: { name: string; phone: string }
  delivery: {
    method: OtDeliveryMethod
    address: string
    reference: string
    notes: string
  }
  payment: OtPaymentMethod
  items: OtOrderItem[]
  subtotalUSD: number
  shippingUSD: number
  totalUSD: number
}

export const OT_PAYMENT_LABELS: Record<OtPaymentMethod, string> = {
  'cash-usd': 'Efectivo USD',
  zelle: 'Zelle',
  'cash-cup': 'Efectivo CUP (tasa del día)',
}

const STORAGE_KEY = 'tostado.orders.v1'

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function buildOrderCode(date = new Date()): string {
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  return `TS-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`
}

function readOrders(): OtOrder[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as OtOrder[]) : []
  } catch {
    return []
  }
}

export function saveOtOrder(order: OtOrder) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([order, ...readOrders()].slice(0, 50)),
    )
  } catch {
    // El pedido ya fue creado.
  }
}

export function getOtOrder(code: string): OtOrder | null {
  return readOrders().find((order) => order.code === code) ?? null
}

export function buildOtOrderMessage(order: OtOrder): string {
  const isPickup = order.delivery.method === 'pickup'
  const lines = [
    `*NUEVO PEDIDO ${order.code}*`,
    `Tostado · Café de especialidad`,
    '',
    '*Cliente*',
    `Nombre: ${order.customer.name}`,
    `Teléfono: ${order.customer.phone}`,
    '',
    `*Pago*: ${OT_PAYMENT_LABELS[order.payment]}`,
    '',
    isPickup ? '*Recogida en la cafetería*' : '*Entrega a domicilio*',
    isPickup ? OT_CAFE.address : `${order.delivery.address}${order.delivery.reference ? ` · ${order.delivery.reference}` : ''}`,
  ]

  if (order.delivery.notes) {
    lines.push(`Notas: ${order.delivery.notes}`)
  }

  lines.push('', '*Productos*')
  order.items.forEach((item) => {
    lines.push(`• ${item.quantity} × ${item.name} (${item.presentation}) — ${formatUSD(item.lineTotalUSD)}`)
  })

  lines.push(
    '',
    `Subtotal: ${formatUSD(order.subtotalUSD)}`,
    `Envío: ${order.shippingUSD > 0 ? formatUSD(order.shippingUSD) : 'Gratis'}`,
    `*Total: ${formatUSD(order.totalUSD)} USD*`,
    '',
    'Pedido creado desde la tienda de Tostado.',
  )

  return lines.join('\n')
}

export function buildOtWhatsAppLink(order: OtOrder): string {
  return `https://wa.me/${OT_CAFE.whatsapp}?text=${encodeURIComponent(buildOtOrderMessage(order))}`
}

export function buildOtChatLink(message = 'Hola, quiero saber más sobre el café de Tostado.'): string {
  return `https://wa.me/${OT_CAFE.whatsapp}?text=${encodeURIComponent(message)}`
}
