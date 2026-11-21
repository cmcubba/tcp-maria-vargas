export const DELIVERY_MIN_SUBTOTAL_USD = 20
export const DELIVERY_COST_USD = 5

export interface DeliveryZone {
  province: string
  municipalities: string[]
  costUSD: number
  note?: string
}

export const deliveryZones: DeliveryZone[] = [
  {
    province: 'La Habana',
    costUSD: DELIVERY_COST_USD,
    municipalities: [
      'Plaza de la Revolución',
      'Centro Habana',
      'La Habana Vieja',
      'Vedado',
      'Cerro',
      'Diez de Octubre',
      'Marianao',
      'La Lisa',
      'Playa',
      'Boyeros',
      'Arroyo Naranjo',
      'San Miguel del Padrón',
      'Regla',
      'Guanabacoa',
      'La Habana del Este',
      'Cotorro',
    ],
    note: 'Entrega en 1 a 5 horas.',
  },
]

export function getDeliveryCost(_province?: string): number {
  return DELIVERY_COST_USD
}

export function getMunicipalities(_province?: string): string[] {
  return deliveryZones[0].municipalities
}

export function meetsDeliveryMinimum(subtotalUSD: number): boolean {
  return subtotalUSD >= DELIVERY_MIN_SUBTOTAL_USD
}

export const pickupSlots = [
  '8:00 a. m. – 10:00 a. m.',
  '10:00 a. m. – 12:00 m.',
  '12:00 m. – 2:00 p. m.',
  '2:00 p. m. – 4:00 p. m.',
  '4:00 p. m. – 6:00 p. m.',
  '6:00 p. m. – 7:00 p. m.',
]
