import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getOtProduct } from './data'
import type { OtProduct } from './data'

interface OtCartLine {
  productId: string
  quantity: number
}

export interface OtCartItem {
  product: OtProduct
  quantity: number
  lineTotalUSD: number
}

interface OtCartValue {
  items: OtCartItem[]
  totalItems: number
  subtotalUSD: number
  add: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  notice: string | null
  notify: (message: string) => void
}

const STORAGE_KEY = 'tostado.cart.v1'

const OtCartContext = createContext<OtCartValue | null>(null)

function readLines(): OtCartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return (JSON.parse(raw) as OtCartLine[]).filter((line) => getOtProduct(line.productId))
  } catch {
    return []
  }
}

export function OtCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OtCartLine[]>(readLines)
  const [notice, setNotice] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // El carrito sigue funcionando en memoria.
    }
  }, [lines])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const notify = useCallback((message: string) => {
    setNotice(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setNotice(null), 2600)
  }, [])

  const add = useCallback(
    (productId: string, quantity = 1) => {
      const product = getOtProduct(productId)
      if (!product) return
      setLines((current) => {
        const existing = current.find((line) => line.productId === productId)
        if (existing) {
          return current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
              : line,
          )
        }
        return [...current, { productId, quantity }]
      })
      notify(`${product.name} añadido al carrito`)
    },
    [notify],
  )

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.productId !== productId)
        : current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(99, quantity) }
              : line,
          ),
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const items = useMemo<OtCartItem[]>(
    () =>
      lines.flatMap((line) => {
        const product = getOtProduct(line.productId)
        if (!product) return []
        return [
          {
            product,
            quantity: line.quantity,
            lineTotalUSD: product.priceUSD * line.quantity,
          },
        ]
      }),
    [lines],
  )

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotalUSD = items.reduce((total, item) => total + item.lineTotalUSD, 0)

  const value = useMemo<OtCartValue>(
    () => ({
      items,
      totalItems,
      subtotalUSD,
      add,
      setQuantity,
      remove,
      clear,
      notice,
      notify,
    }),
    [items, totalItems, subtotalUSD, add, setQuantity, remove, clear, notice, notify],
  )

  return <OtCartContext.Provider value={value}>{children}</OtCartContext.Provider>
}

export function useOtCart() {
  const context = useContext(OtCartContext)
  if (!context) throw new Error('useOtCart debe usarse dentro de OtCartProvider')
  return context
}
