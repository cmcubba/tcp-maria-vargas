import type { OrderStatus } from '../types'

export interface OrderStatusOption {
  id: OrderStatus
  label: string
  shortLabel: string
  tone: 'pending' | 'progress' | 'ready' | 'done' | 'cancelled'
}

export const orderStatuses: OrderStatusOption[] = [
  { id: 'pendiente', label: 'Pendiente de confirmación', shortLabel: 'Pendiente', tone: 'pending' },
  { id: 'confirmado', label: 'Pedido confirmado', shortLabel: 'Confirmado', tone: 'progress' },
  { id: 'preparando', label: 'En preparación', shortLabel: 'Preparando', tone: 'progress' },
  { id: 'listo', label: 'Listo para entrega o recogida', shortLabel: 'Listo', tone: 'ready' },
  { id: 'en-camino', label: 'En camino', shortLabel: 'En camino', tone: 'ready' },
  { id: 'entregado', label: 'Entregado', shortLabel: 'Entregado', tone: 'done' },
  { id: 'cancelado', label: 'Cancelado', shortLabel: 'Cancelado', tone: 'cancelled' },
]

export function getOrderStatus(status: OrderStatus): OrderStatusOption {
  return orderStatuses.find((option) => option.id === status) ?? orderStatuses[0]
}
