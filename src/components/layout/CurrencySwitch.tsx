import { CURRENCY } from '../../config'
import { cn } from '../../utils/cn'
import type { Currency } from '../../types'
import { useCurrency } from '../../context/CurrencyContext'

export function CurrencySwitch({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()

  const options: Array<{ value: Currency; label: string }> = [
    { value: 'USD', label: 'USD' },
    { value: 'CUP', label: 'CUP' },
  ]

  return (
    <div
      className={cn('currency-switch', className)}
      role="group"
      aria-label={`Moneda de compra. Tasa: 1 USD = ${CURRENCY.cupRate} CUP`}
      title={`Tasa de cambio: 1 USD = ${CURRENCY.cupRate} CUP`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn('currency-switch__btn', currency === option.value && 'is-active')}
          aria-pressed={currency === option.value}
          onClick={() => setCurrency(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
