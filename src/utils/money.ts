import { CURRENCY } from '../config'
import type { Currency } from '../types'

export function convertFromUSD(amountUSD: number, currency: Currency): number {
  return currency === 'CUP' ? amountUSD * CURRENCY.cupRate : amountUSD
}

function groupThousands(value: string): string {
  const [intPart, decPart] = value.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${grouped}.${decPart}` : grouped
}

export function formatAmount(amount: number, decimals = 2): string {
  const fixed = Math.abs(amount).toFixed(decimals)
  return `${amount < 0 ? '-' : ''}${groupThousands(fixed)}`
}

export function formatMoney(amountUSD: number, currency: Currency): string {
  const converted = convertFromUSD(amountUSD, currency)
  const decimals = currency === 'CUP' ? 0 : 2
  return `$${formatAmount(converted, decimals)}`
}

export function formatMoneyWithCode(amountUSD: number, currency: Currency): string {
  return `${formatMoney(amountUSD, currency)} ${currency}`
}

export function formatUsd(amountUSD: number): string {
  return `$${formatAmount(amountUSD, 2)} USD`
}
