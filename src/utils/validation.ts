import { BUSINESS, WHATSAPP_MESSAGE } from '../config'
import type { CustomerData, DeliveryData } from '../types'

export type CheckoutErrors = Partial<Record<keyof CustomerData | keyof DeliveryData | 'form' | 'payment', string>>

export function validateCustomer(customer: CustomerData): CheckoutErrors {
  const errors: CheckoutErrors = {}
  if (!customer.fullName.trim()) {
    errors.fullName = 'Escribe tu nombre y apellidos.'
  } else if (customer.fullName.trim().length < 5) {
    errors.fullName = 'El nombre debe tener al menos 5 caracteres.'
  }
  const phone = customer.phone.replace(/[\s-]/g, '')
  if (!phone) {
    errors.phone = 'El teléfono es obligatorio.'
  } else if (!/^\+?\d{8,15}$/.test(phone)) {
    errors.phone = 'Escribe un número de teléfono válido (mínimo 8 dígitos).'
  }
  if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email.trim())) {
    errors.email = 'El correo electrónico no es válido.'
  }
  return errors
}

export function validateDelivery(delivery: DeliveryData): CheckoutErrors {
  const errors: CheckoutErrors = {}
  if (delivery.method === 'pickup') {
    if (!delivery.pickupDate) errors.pickupDate = 'Selecciona la fecha de recogida.'
    if (!delivery.pickupSlot) errors.pickupSlot = 'Selecciona un horario de recogida.'
    return errors
  }
  if (!delivery.province) errors.province = 'Selecciona la provincia.'
  if (!delivery.municipality) errors.municipality = 'Selecciona el municipio.'
  if (!delivery.address.trim()) errors.address = 'Escribe la dirección exacta.'
  if (!delivery.neighborhood.trim()) errors.neighborhood = 'Indica el barrio o reparto.'
  return errors
}

export function validateCheckout(customer: CustomerData, delivery: DeliveryData): CheckoutErrors {
  return { ...validateCustomer(customer), ...validateDelivery(delivery) }
}

export function buildWhatsAppLink(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`
}
