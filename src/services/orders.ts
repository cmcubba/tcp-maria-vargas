import { ORDERS_STORAGE_KEY } from '../config'
import type { Order, OrderDraft, OrderStatus } from '../types'

const LATENCY_MS = 900

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function buildOrderCode(date: Date): string {
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `LC-${stamp}-${random}`
}

function normalizeOrder(order: Order): Order {
  return { ...order, status: order.status ?? 'pendiente' }
}

function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    return (JSON.parse(raw) as Order[]).map(normalizeOrder)
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // El pedido ya fue creado; el almacenamiento local es solo una copia de respaldo.
  }
}

function persistOrder(order: Order) {
  writeOrders([order, ...readOrders()].slice(0, 50))
}

/**
 * Punto único de salida para los pedidos.
 * Al conectar el backend, reemplazar el cuerpo por una llamada real, por ejemplo:
 *   const response = await fetch(`${API_URL}/orders`, { method: 'POST', body: JSON.stringify(draft) })
 *   return (await response.json()) as Order
 * La firma se mantiene para que ninguna vista tenga que cambiar.
 */
export async function submitOrder(draft: OrderDraft): Promise<Order> {
  await delay(LATENCY_MS)
  const order: Order = {
    ...draft,
    code: buildOrderCode(new Date()),
    createdAt: new Date().toISOString(),
    status: 'pendiente',
  }
  persistOrder(order)
  return order
}

export function getOrders(): Order[] {
  return readOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getOrderByCode(code: string): Order | null {
  return readOrders().find((order) => order.code === code) ?? null
}

export function updateOrderStatus(code: string, status: OrderStatus): Order | null {
  const orders = readOrders()
  const index = orders.findIndex((order) => order.code === code)
  if (index === -1) return null

  const updated: Order = { ...orders[index], status }
  orders[index] = updated
  writeOrders(orders)
  return updated
}
