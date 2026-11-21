import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Tone = 'offer' | 'new' | 'best' | 'muted' | 'stock'

export function Badge({
  tone = 'muted',
  children,
  className,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return <span className={cn('badge', `badge--${tone}`, className)}>{children}</span>
}
