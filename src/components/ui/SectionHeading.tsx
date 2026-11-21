import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={cn('section-head', align === 'center' && 'section-head--center')}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-head__title">{title}</h2>
        {description && <p className="section-head__text">{description}</p>}
      </div>
      {action && <div className="section-head__action">{action}</div>}
    </div>
  )
}
