import type { ReactNode } from 'react'
import { useCurrency } from '../../context/CurrencyContext'
import { CURRENCY } from '../../config'
import { formatUsd } from '../../utils/money'

interface SummaryCardProps {
  title?: string
  subtotalUSD: number
  deliveryUSD?: number
  totalUSD: number
  note?: ReactNode
  cta?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export function SummaryCard({
  title = 'Resumen del pedido',
  subtotalUSD,
  deliveryUSD,
  totalUSD,
  note,
  cta,
  footer,
  children,
}: SummaryCardProps) {
  const { currency, format, formatWithCode } = useCurrency()

  return (
    <aside className="summary">
      <h2 className="summary__title">{title}</h2>

      {children}

      <div className="summary__rows">
        <div className="summary__row">
          <span>Subtotal</span>
          <span>{format(subtotalUSD)}</span>
        </div>
        <div className="summary__row">
          <span>Entrega</span>
          <span>{deliveryUSD === undefined ? 'Se calcula al finalizar' : format(deliveryUSD)}</span>
        </div>
        {currency === 'CUP' && (
          <div className="summary__row summary__row--muted">
            <span>Equivalente</span>
            <span>{formatUsd(totalUSD)}</span>
          </div>
        )}
        <div className="summary__total">
          <span>Total</span>
          <strong>{formatWithCode(totalUSD)}</strong>
        </div>
      </div>

      {currency === 'CUP' && (
        <p className="summary__rate">Tasa aplicada: 1 USD = {CURRENCY.cupRate} CUP</p>
      )}

      {note && <p className="summary__note">{note}</p>}
      {cta && <div className="summary__cta">{cta}</div>}
      {footer}
    </aside>
  )
}
