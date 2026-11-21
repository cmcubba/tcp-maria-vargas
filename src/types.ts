export type Currency = 'USD' | 'CUP'

export type ProductTag = 'nuevo' | 'oferta' | 'mas-vendido'

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
  icon: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand?: string
  description: string
  presentation: string
  categoryId: string
  priceUSD: number
  compareAtUSD?: number
  image: string
  stock: number
  tags: ProductTag[]
  featured?: boolean
}

export interface CartLine {
  productId: string
  quantity: number
}

export interface CartItem extends CartLine {
  product: Product
  lineTotalUSD: number
}

export interface CustomerData {
  fullName: string
  phone: string
  email: string
}

export type DeliveryMethod = 'pickup' | 'delivery'

export type PaymentMethod = 'cash-usd' | 'zelle' | 'cash-cup'

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'listo'
  | 'en-camino'
  | 'entregado'
  | 'cancelado'

export interface DeliveryData {
  method: DeliveryMethod
  pickupDate: string
  pickupSlot: string
  province: string
  municipality: string
  address: string
  neighborhood: string
  reference: string
  notes: string
  costUSD: number
}

export interface OrderItem {
  productId: string
  name: string
  brand?: string
  presentation: string
  image: string
  unitPriceUSD: number
  quantity: number
  lineTotalUSD: number
}

export interface Order {
  code: string
  createdAt: string
  customer: CustomerData
  delivery: DeliveryData
  items: OrderItem[]
  subtotalUSD: number
  deliveryUSD: number
  totalUSD: number
  currency: Currency
  exchangeRate: number
  paymentMethod: PaymentMethod
  status: OrderStatus
}

export interface OrderDraft {
  customer: CustomerData
  delivery: DeliveryData
  items: OrderItem[]
  subtotalUSD: number
  deliveryUSD: number
  totalUSD: number
  currency: Currency
  exchangeRate: number
  paymentMethod: PaymentMethod
}
