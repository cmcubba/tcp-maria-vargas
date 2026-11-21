import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="container section">
      <EmptyState
        icon={<Compass size={32} />}
        title="Página no encontrada"
        description="La dirección que buscas no existe o fue movida. Vuelve al inicio o explora nuestro catálogo."
        action={
          <div className="empty-state__actions">
            <Link to="/" className="btn btn--outline">Ir al inicio</Link>
            <Link to="/productos" className="btn btn--primary">Ver productos</Link>
          </div>
        }
      />
    </div>
  )
}
