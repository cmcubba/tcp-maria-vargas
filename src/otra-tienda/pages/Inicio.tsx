import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock, MapPin, MoveDown } from 'lucide-react'
import { OtProductCard } from '../components'
import { OT_BASE, OT_CAFE, otProducts } from '../data'
import { buildOtChatLink } from '../utils'

export function OtraTiendaHome() {
  const featured = otProducts.slice(0, 6)

  return (
    <>
      <section className="ot-hero">
        <div className="ot-wrap ot-hero__grid">
          <div className="ot-hero__copy">
            <span className="ot-eyebrow">Café de especialidad · Vedado, La Habana</span>
            <h1 className="ot-hero__title">
              Café con <em>carácter</em>, tostado aquí.
            </h1>
            <p className="ot-hero__lead">
              Lotes pequeños de café de origen, tostados cada semana en nuestro taller del Vedado.
              Sin atajos, sin mezclas que escondan el grano.
            </p>
            <div className="ot-hero__actions">
              <Link to={`${OT_BASE}/catalogo`} className="ot-btn ot-btn--copper">
                Comprar café
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to={`${OT_BASE}#metodos`} className="ot-btn ot-btn--ghost">
                Cómo lo preparamos
              </Link>
            </div>
            <dl className="ot-hero__stats">
              <div>
                <dt>Referencias</dt>
                <dd>08</dd>
              </div>
              <div>
                <dt>Tueste</dt>
                <dd>Semanal</dd>
              </div>
              <div>
                <dt>Lotes</dt>
                <dd>Pequeños</dd>
              </div>
            </dl>
          </div>

          <figure className="ot-hero__media">
            <img
              src="/images/ot-hero.jpg"
              alt="Taza de café y granos tostados en la cafetería Tostado"
            />
            <span className="ot-hero__sticker" aria-hidden="true">
              <span>100% arábica</span>
              <span>tostado aquí</span>
            </span>
            <figcaption>
              <span>Lote 07 · Tueste de la semana</span>
              <span>Notas de cacao y panela</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="ot-marquee" aria-hidden="true">
        <div className="ot-marquee__track">
          <span>Tostado en La Habana</span>
          <span>·</span>
          <span>Lotes pequeños</span>
          <span>·</span>
          <span>Origen trazable</span>
          <span>·</span>
          <span>Envío en el día</span>
          <span>·</span>
          <span>Tostado en La Habana</span>
          <span>·</span>
          <span>Lotes pequeños</span>
          <span>·</span>
          <span>Origen trazable</span>
          <span>·</span>
          <span>Envío en el día</span>
          <span>·</span>
        </div>
      </div>

      <section className="ot-section">
        <div className="ot-wrap">
          <header className="ot-section__head">
            <div>
              <span className="ot-eyebrow">La despensa</span>
              <h2 className="ot-section__title">Nuestro café</h2>
            </div>
            <Link to={`${OT_BASE}/catalogo`} className="ot-link">
              Ver todo el café
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </header>

          <div className="ot-grid">
            {featured.map((product) => (
              <OtProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="ot-methods" id="metodos">
        <div className="ot-wrap">
          <div className="ot-methods__intro">
            <span className="ot-eyebrow">Del grano a la taza</span>
            <h2 className="ot-section__title">
              Tres formas de<br />
              <em>llegar a la taza.</em>
            </h2>
            <a href={buildOtChatLink('Hola, necesito ayuda para elegir un método de preparación.')} target="_blank" rel="noreferrer" className="ot-link">
              Pregúntanos por WhatsApp
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <ol className="ot-steps">
            <li>
              <span className="ot-steps__num">01</span>
              <div>
                <h3>Filtro</h3>
                <p>V60, Chemex o prensa francesa. Tueste claro, molienda media y agua a 93 °C. La taza más limpia para descubrir el origen.</p>
              </div>
            </li>
            <li>
              <span className="ot-steps__num">02</span>
              <div>
                <h3>Espresso</h3>
                <p>Molienda fina, 18 g de café y 25 segundos de extracción. Nuestros tuestes medios y oscuros brillan con leche.</p>
              </div>
            </li>
            <li>
              <span className="ot-steps__num">03</span>
              <div>
                <h3>Cold brew</h3>
                <p>Extracción en frío durante 18 horas. Dulce, redondo y sin amargor. Diluye el concentrado y sírvelo con hielo.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="ot-story" id="nosotros">
        <div className="ot-wrap ot-story__grid">
          <div>
            <span className="ot-eyebrow">Nosotros</span>
            <p className="ot-story__quote">
              «Tostamos café para que sepa a café. Nada más.»
            </p>
          </div>
          <div className="ot-story__body">
            <p>
              Tostado nació en 2021 con una tostadora de 5 kilos y una idea simple: que en La Habana
              se pueda tomar café fresco, de origen y bien hecho.
            </p>
            <p>
              Compramos lotes verdes directamente a importadores que conocemos, tostamos cada semana
              y anotamos fecha de tueste en cada bolsa. Si no está fresco, no sale del taller.
            </p>
            <ul className="ot-story__facts">
              <li><MoveDown size={15} aria-hidden="true" /> Tueste semanal en tandas de 5 kg</li>
              <li><MapPin size={15} aria-hidden="true" /> Taller y barra en el Vedado</li>
              <li><Clock size={15} aria-hidden="true" /> Abierto de lunes a sábado</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ot-cta">
        <div className="ot-wrap ot-cta__inner">
          <div>
            <span className="ot-eyebrow">Suscripción</span>
            <h2 className="ot-cta__title">Café fresco cada semana, en tu puerta.</h2>
            <p>Elige 250 g o 1 kg, filtro o espresso. Pausa cuando quieras. 10% de descuento en cada entrega.</p>
          </div>
          <a
            href={buildOtChatLink('Hola, quiero suscribirme al café semanal de Tostado.')}
            target="_blank"
            rel="noreferrer"
            className="ot-btn ot-btn--copper"
          >
            Quiero suscribirme
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="ot-visit">
        <div className="ot-wrap ot-visit__grid">
          <div>
            <span className="ot-eyebrow">Visítanos</span>
            <h2 className="ot-section__title">La barra</h2>
            <p className="ot-visit__text">
              Café recién tostado, métodos en barra y bolsas para llevar. Si vienes por primera vez,
              pide el vuelo de degustación.
            </p>
            <a href={OT_CAFE.mapUrl} target="_blank" rel="noreferrer" className="ot-link">
              Ver en el mapa
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <dl className="ot-visit__data">
            <div>
              <dt>Dirección</dt>
              <dd>{OT_CAFE.address}</dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd>{OT_CAFE.hours}</dd>
            </div>
            <div>
              <dt>Contacto</dt>
              <dd>
                <a href={`tel:+${OT_CAFE.whatsapp}`}>+53 5 467 6775</a>
                <br />
                <a href={`mailto:${OT_CAFE.email}`}>{OT_CAFE.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}
