import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { OtCartProvider, useOtCart } from './cart'
import { OT_BASE, OT_CAFE } from './data'
import './otra-tienda.css'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

function Notice() {
  const { notice } = useOtCart()
  if (!notice) return null
  return <div className="ot-notice">{notice}</div>
}

function Shell() {
  const { totalItems } = useOtCart()
  const { pathname } = useLocation()
  const isHome = pathname === OT_BASE || pathname === `${OT_BASE}/`

  useEffect(() => {
    const previousTitle = document.title
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    const previousTheme = themeMeta?.getAttribute('content')

    document.title = 'Tostado · Café de especialidad'
    themeMeta?.setAttribute('content', '#12100e')

    return () => {
      document.title = previousTitle
      if (themeMeta && previousTheme) themeMeta.setAttribute('content', previousTheme)
    }
  }, [])

  const crumb = pathname.includes('/producto/') || pathname.endsWith('/catalogo')
    ? 'Café'
    : pathname.endsWith('/carrito')
      ? 'Carrito'
      : pathname.includes('/checkout')
        ? 'Checkout'
        : 'Pedido'

  return (
    <div className="ot-app">
      <ScrollManager />

      <header className="ot-header">
        <div className="ot-wrap ot-header__inner">
          <Link to={OT_BASE} className="ot-logo" aria-label="Tostado, ir al inicio">
            <span className="ot-logo__mark" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <ellipse cx="20" cy="20" rx="9" ry="13" fill="none" stroke="currentColor" strokeWidth="1.4" transform="rotate(28 20 20)" />
                <path d="M13 11c5 5 9 13 9 18" fill="none" stroke="currentColor" strokeWidth="1.4" transform="rotate(28 20 20)" />
              </svg>
            </span>
            <span className="ot-logo__text">
              <strong>Tostado</strong>
              <small>café de especialidad</small>
            </span>
          </Link>

          <nav className="ot-nav" aria-label="Navegación de Tostado">
            <Link to={`${OT_BASE}/catalogo`}>Café</Link>
            <Link to={`${OT_BASE}#metodos`}>Métodos</Link>
            <Link to={`${OT_BASE}#nosotros`}>Nosotros</Link>
          </nav>

          <div className="ot-header__actions">
            <a
              href={OT_CAFE.instagram ? `https://instagram.com/${OT_CAFE.instagram.replace('@', '')}` : '#'}
              target="_blank"
              rel="noreferrer"
              className="ot-header__insta"
            >
              {OT_CAFE.instagram}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <Link to={`${OT_BASE}/carrito`} className="ot-cart-btn" aria-label={`Carrito, ${totalItems} productos`}>
              <ShoppingBag size={18} aria-hidden="true" />
              <span>Carrito</span>
              {totalItems > 0 && <em>{totalItems}</em>}
            </Link>
          </div>
        </div>
        {!isHome && (
          <div className="ot-wrap ot-breadcrumb">
            <Link to={OT_BASE}>Inicio</Link>
            <span>/</span>
            <span>{crumb}</span>
          </div>
        )}
      </header>

      <main className="ot-main">
        <Outlet />
      </main>

      <footer className="ot-footer">
        <div className="ot-wrap">
          <div className="ot-footer__top">
            <p className="ot-footer__word">Tostado.</p>
            <p className="ot-footer__tag">
              Lotes pequeños. Tueste honesto.<br />Vedado, La Habana.
            </p>
          </div>
          <div className="ot-footer__grid">
            <div>
              <h4>Visítanos</h4>
              <p>{OT_CAFE.address}</p>
              <p>{OT_CAFE.hours}</p>
            </div>
            <div>
              <h4>Contacto</h4>
              <a href={`tel:+${OT_CAFE.whatsapp}`}>+53 5 467 6775</a>
              <a href={`mailto:${OT_CAFE.email}`}>{OT_CAFE.email}</a>
              <a href={OT_CAFE.instagram ? `https://instagram.com/${OT_CAFE.instagram.replace('@', '')}` : '#'} target="_blank" rel="noreferrer">
                {OT_CAFE.instagram}
              </a>
            </div>
            <div>
              <h4>Tienda</h4>
              <Link to={`${OT_BASE}/catalogo`}>Todo el café</Link>
              <Link to={`${OT_BASE}/carrito`}>Mi carrito</Link>
              <Link to={`${OT_BASE}#metodos`}>Métodos de preparación</Link>
            </div>
          </div>
          <div className="ot-footer__bottom">
            <span>© {new Date().getFullYear()} Tostado</span>
            <span>Hecho con café, en La Habana.</span>
          </div>
        </div>
      </footer>

      <Notice />
    </div>
  )
}

export function OtraTiendaLayout() {
  return (
    <OtCartProvider>
      <Shell />
    </OtCartProvider>
  )
}
