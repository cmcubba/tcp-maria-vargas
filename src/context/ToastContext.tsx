import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface Toast {
  id: number
  message: string
  image?: string
  tone?: 'success' | 'error'
}

interface ToastContextValue {
  toasts: Toast[]
  showToast: (message: string, options?: { image?: string; tone?: 'success' | 'error' }) => void
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback<ToastContextValue['showToast']>(
    (message, options) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [
        ...current.slice(-2),
        { id, message, image: options?.image, tone: options?.tone ?? 'success' },
      ])
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 2800)
    },
    [],
  )

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [toasts, showToast, dismissToast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider')
  return context
}
