import type { Currency, PaymentMethod } from '../types'

export interface PaymentOption {
  id: PaymentMethod
  label: string
  description: string
  currency: Currency
}

export const paymentMethods: PaymentOption[] = [
  {
    id: 'cash-usd',
    label: 'Efectivo USD',
    description: 'Paga en dólares en efectivo al recibir o recoger tu pedido.',
    currency: 'USD',
  },
  {
    id: 'zelle',
    label: 'Zelle',
    description: 'Transferencia electrónica en USD. Te enviamos los datos al confirmar.',
    currency: 'USD',
  },
  {
    id: 'cash-cup',
    label: 'Efectivo CUP',
    description: 'Paga en pesos cubanos en efectivo, según la tasa del día.',
    currency: 'CUP',
  },
]

export function getPaymentOption(method: PaymentMethod): PaymentOption {
  return paymentMethods.find((option) => option.id === method) ?? paymentMethods[0]
}
