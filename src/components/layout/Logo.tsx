import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <Link to="/" className={cn('logo', className)} aria-label="TCP Maria Vargas, ir al inicio">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <rect x="1" y="1" width="46" height="46" rx="14" fill="#5F7142" />
          <path
            d="M13 25.5h22l-2.6 10a4 4 0 0 1-3.9 3H19.5a4 4 0 0 1-3.9-3L13 25.5Z"
            fill="none"
            stroke="#FBF7EE"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M18 25.5c0-5.2 2.7-9.5 6-9.5s6 4.3 6 9.5"
            fill="none"
            stroke="#FBF7EE"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M24 16.5c.4-4 2.8-6.3 6.8-6.8-.3 4.3-2.7 6.6-6.8 6.8Z"
            fill="#D9A441"
          />
          <path d="M20 30.5h8" stroke="#FBF7EE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="logo__text">
        <span className="logo__name">TCP Maria Vargas</span>
        {!compact && <span className="logo__tag">TCP · Mercado de alimentos</span>}
      </span>
    </Link>
  )
}
