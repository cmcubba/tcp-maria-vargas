import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone ?? 'success'}`}>
          {toast.image ? (
            <img src={toast.image} alt="" className="toast__img" />
          ) : (
            <span className="toast__icon" aria-hidden="true">
              {toast.tone === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            </span>
          )}
          <p className="toast__text">{toast.message}</p>
          <button
            type="button"
            className="toast__close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Cerrar notificación"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
