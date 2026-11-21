import { createContext, useCallback, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { CURRENCY, CURRENCY_STORAGE_KEY } from '../config'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Currency } from '../types'
import { convertFromUSD, formatMoney, formatMoneyWithCode } from '../utils/money'

interface CurrencyContextValue {
  currency: Currency
  rate: number
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  convert: (amountUSD: number) => number
  format: (amountUSD: number) => string
  formatWithCode: (amountUSD: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useLocalStorage<Currency>(
    CURRENCY_STORAGE_KEY,
    CURRENCY.baseCurrency,
  )

  const toggleCurrency = useCallback(() => {
    setCurrency((current) => (current === 'USD' ? 'CUP' : 'USD'))
  }, [setCurrency])

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      rate: CURRENCY.cupRate,
      setCurrency,
      toggleCurrency,
      convert: (amountUSD: number) => convertFromUSD(amountUSD, currency),
      format: (amountUSD: number) => formatMoney(amountUSD, currency),
      formatWithCode: (amountUSD: number) => formatMoneyWithCode(amountUSD, currency),
    }),
    [currency, setCurrency, toggleCurrency],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency debe usarse dentro de CurrencyProvider')
  return context
}
