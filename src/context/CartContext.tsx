import { createContext, useCallback, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { CART_STORAGE_KEY } from '../config'
import { getProductById } from '../data/products'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { CartItem, CartLine, Product } from '../types'

interface CartContextValue {
  lines: CartLine[]
  items: CartItem[]
  totalItems: number
  subtotalUSD: number
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextValue | null>(null)

function sanitizeLines(lines: CartLine[]): CartLine[] {
  return lines.filter((line) => {
    const product = getProductById(line.productId)
    return Boolean(product) && line.quantity > 0
  })
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedLines, setLines] = useLocalStorage<CartLine[]>(CART_STORAGE_KEY, [])

  const lines = useMemo(() => sanitizeLines(storedLines), [storedLines])

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock <= 0) return
      setLines((current) => {
        const safe = sanitizeLines(current)
        const existing = safe.find((line) => line.productId === product.id)
        if (existing) {
          return safe.map((line) =>
            line.productId === product.id
              ? { ...line, quantity: Math.min(line.quantity + quantity, product.stock) }
              : line,
          )
        }
        return [...safe, { productId: product.id, quantity: Math.min(quantity, product.stock) }]
      })
    },
    [setLines],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = getProductById(productId)
      if (!product) return
      setLines((current) =>
        sanitizeLines(current).map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.max(1, Math.min(quantity, product.stock)) }
            : line,
        ),
      )
    },
    [setLines],
  )

  const removeItem = useCallback(
    (productId: string) => {
      setLines((current) => sanitizeLines(current).filter((line) => line.productId !== productId))
    },
    [setLines],
  )

  const clearCart = useCallback(() => setLines([]), [setLines])

  const items = useMemo<CartItem[]>(
    () =>
      lines.flatMap((line) => {
        const product = getProductById(line.productId)
        if (!product) return []
        return [
          {
            ...line,
            product,
            lineTotalUSD: product.priceUSD * line.quantity,
          },
        ]
      }),
    [lines],
  )

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const subtotalUSD = useMemo(
    () => items.reduce((total, item) => total + item.lineTotalUSD, 0),
    [items],
  )

  const getQuantity = useCallback(
    (productId: string) => lines.find((line) => line.productId === productId)?.quantity ?? 0,
    [lines],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      totalItems,
      subtotalUSD,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getQuantity,
    }),
    [
      lines,
      items,
      totalItems,
      subtotalUSD,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getQuantity,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
