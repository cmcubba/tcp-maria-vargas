import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'md'
  label?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  label = 'Cantidad',
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(Math.min(max, value + 1))

  return (
    <div className={cn('qty', `qty--${size}`, disabled && 'qty--disabled')} role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Disminuir cantidad"
      >
        <Minus size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      </button>
      <span className="qty__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="qty__btn"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Aumentar cantidad"
      >
        <Plus size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      </button>
    </div>
  )
}
