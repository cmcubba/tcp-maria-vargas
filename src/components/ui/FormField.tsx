import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('field', className)}>
      <label htmlFor={htmlFor} className="field__label">
        {label}
        {required ? <span className="field__required"> *</span> : <span className="field__optional"> (opcional)</span>}
      </label>
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
