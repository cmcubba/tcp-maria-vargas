import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Clock, Menu, Phone, ShoppingCart, X } from 'lucide-react'
import { BUSINESS } from '../../config'
import { useCart } from '../../context/CartContext'
import { cn } from '../../utils/cn'
import { buildWhatsAppLink } from '../../utils/validation'
import { CurrencySwitch } from './CurrencySwitch'
import { InstallAppButton } from './InstallAppButton'
import { Logo } from './Logo'

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', key: 'home' },
  { to: '/productos', label: 'Productos', key: 'products' },
  { to: '/productos?filtro=ofertas', label: 'Ofertas', key: 'offers' },
  { to: '/#nosotros', label: 'Nosotros', key: 'about' },
  { to: '/pedidos', label: 'Pedidos', key: 'orders' },
]

export function Header() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const isOffers = location.pathname === '/productos' && location.search.includes('ofertas')
  const isProducts = location.pathname === '/productos' && !isOffers
  const isHome = location.pathname === '/'
  const isAbout = isHome && location.hash === '#nosotros'
  const isOrders = location.pathname === '/pedidos' || location.pathname.startsWith('/pedido/')

  const activeKey = isOffers
    ? 'offers'
    : isProducts
      ? 'products'
      : isOrders
        ? 'orders'
        : isAbout
          ? 'about'
          : isHome
            ? 'home'
            : ''

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Logo />

          <nav className="nav" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={cn('nav__link', activeKey === item.key && 'is-active')}
                aria-current={activeKey === item.key ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <CurrencySwitch className="header__currency" />

            <Link to="/carrito" className="cart-btn" aria-label={`Carrito de compras, ${totalItems} productos`}>
              <ShoppingCart size={19} aria-hidden="true" />
              <span className="cart-btn__label">Carrito</span>
              {totalItems > 0 && <span className="cart-btn__count">{totalItems}</span>}
            </Link>

            <button
              type="button"
              className="icon-btn mobile-toggle"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div className="container mobile-menu__top">
            <Logo />
            <button
              type="button"
              className="icon-btn"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={22} />
            </button>
          </div>

          <div className="container mobile-menu__inner">
            <nav aria-label="Navegación móvil" className="mobile-nav" onClick={() => setOpen(false)}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={cn('mobile-nav__link', activeKey === item.key && 'is-active')}
                  aria-current={activeKey === item.key ? 'page' : undefined}
                >
                  {item.label}
                  <ChevronRight size={18} className="mobile-nav__chevron" aria-hidden="true" />
                </Link>
              ))}
              <Link to="/carrito" className="mobile-nav__link">
                Carrito
                {totalItems > 0 && <span className="mobile-nav__count">{totalItems}</span>}
                <ChevronRight size={18} className="mobile-nav__chevron" aria-hidden="true" />
              </Link>
            </nav>

            <div className="mobile-menu__contact">
              <a href={buildWhatsAppLink()} target="_blank" rel="noreferrer" className="mobile-menu__contact-link">
                <Phone size={17} aria-hidden="true" />
                <span>
                  <strong>WhatsApp</strong>
                  {BUSINESS.phone}
                </span>
              </a>
              <p className="mobile-menu__hours">
                <Clock size={16} aria-hidden="true" />
                <span>
                  <strong>{BUSINESS.hours[0].days}</strong>
                  {BUSINESS.hours[0].time}
                </span>
              </p>
            </div>

            <div className="mobile-menu__footer">
              <div className="mobile-menu__currency">
                <span className="mobile-menu__label">Moneda</span>
                <CurrencySwitch />
              </div>
              <InstallAppButton />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
