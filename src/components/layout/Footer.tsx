import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { BUSINESS } from '../../config'
import { categories } from '../../data/categories'
import { buildWhatsAppLink } from '../../utils/validation'
import { InstallAppButton } from './InstallAppButton'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="footer__text">
            Tu mercado de confianza en La Habana. Alimentos, bebidas y artículos de aseo
            seleccionados para el bienestar de tu hogar.
          </p>
          <a
            className="footer__whatsapp"
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} aria-hidden="true" />
            Escríbenos por WhatsApp
          </a>
        </div>

        <div>
          <h3 className="footer__title">Secciones</h3>
          <ul className="footer__list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Catálogo completo</Link></li>
            <li><Link to="/productos?filtro=ofertas">Ofertas de la semana</Link></li>
            <li><Link to="/carrito">Mi carrito</Link></li>
            <li><Link to="/pedidos">Mis pedidos</Link></li>
            <li><Link to="/#nosotros">Sobre nosotros</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer__title">Categorías</h3>
          <ul className="footer__list">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link to={`/productos?categoria=${category.id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer__title">Visítanos</h3>
          <ul className="footer__list footer__list--contact">
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>{BUSINESS.address}</span>
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              <a href={`tel:+${BUSINESS.phoneRaw}`}>{BUSINESS.phone}</a>
            </li>
            <li>
              <Mail size={16} aria-hidden="true" />
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </li>
            <li>
              <Clock size={16} aria-hidden="true" />
              <span>
                {BUSINESS.hours.map((entry) => (
                  <span key={entry.days} className="footer__hours">
                    {entry.days}: {entry.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {BUSINESS.legalName}. Todos los derechos reservados.</p>
        <p className="footer__note">
          Precios de referencia en USD. Tasa de cambio CUP configurable por el negocio.
        </p>
        <InstallAppButton compact />
      </div>
    </footer>
  )
}
