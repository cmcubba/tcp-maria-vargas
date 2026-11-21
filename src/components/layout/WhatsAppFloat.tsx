import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { buildWhatsAppLink } from '../../utils/validation'

export function WhatsAppFloat() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/checkout') || pathname.startsWith('/pedido/')) {
    return null
  }

  return (
    <a
      className="whatsapp-float"
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      title="¿Necesitas ayuda? Escríbenos por WhatsApp"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  )
}
