import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react'
import { BUSINESS } from '../config'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CategoryCard } from '../components/product/CategoryCard'
import { ProductGrid } from '../components/product/ProductGrid'
import { categories } from '../data/categories'
import { bestSellers, offers, products } from '../data/products'
import { useCurrency } from '../context/CurrencyContext'
import { buildWhatsAppLink } from '../utils/validation'

export function HomePage() {
  const { format } = useCurrency()
  const weeklyOffers = offers.slice(0, 4)
  const favorites = bestSellers.slice(0, 8)
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const bestDiscount = Math.max(
    ...offers.map((product) =>
      product.compareAtUSD
        ? Math.round(((product.compareAtUSD - product.priceUSD) / product.compareAtUSD) * 100)
        : 0,
    ),
  )

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="eyebrow eyebrow--pill">
              <Sparkles size={14} aria-hidden="true" />
              Mercado TCP · La Habana
            </span>
            <h1 className="hero__title">
              {BUSINESS.name}
              <span className="hero__title-accent">tu mercado de confianza</span>
            </h1>
            <p className="hero__lead">{BUSINESS.tagline}</p>
            <p className="hero__text">
              Carnes, lácteos, granos, bebidas y productos de aseo en un solo lugar.
              Compra desde tu teléfono y elige recoger en el local o recibir a domicilio.
            </p>
            <div className="hero__actions">
              <Link to="/productos" className="btn btn--primary btn--lg">
                Ver productos
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero__trust">
              <span><Truck size={16} aria-hidden="true" /> Entrega a domicilio</span>
              <span><Store size={16} aria-hidden="true" /> Recogida en el local</span>
              <span><MessageCircle size={16} aria-hidden="true" /> Pedidos por WhatsApp</span>
            </div>
          </div>

          <div className="hero__media">
            <div className="hero__image-wrap">
              <img
                src="/images/hero.jpg"
                alt="Productos frescos y alimentos disponibles en TCP Maria Vargas"
                className="hero__image"
              />
            </div>
            <div className="float-card float-card--top">
              <span className="float-card__icon"><Truck size={18} aria-hidden="true" /></span>
              <div>
                <strong>Entrega en 1–5 h</strong>
                <span>Solo La Habana · 16 municipios</span>
              </div>
            </div>
            <div className="float-card float-card--bottom">
              <span className="float-card__icon float-card__icon--gold">
                <PackageCheck size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>{products.length}+ productos</strong>
                <span>Seleccionados cada semana</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container benefits__grid">
          <div className="benefit">
            <span className="benefit__icon"><Truck size={20} aria-hidden="true" /></span>
            <div>
              <h3>Entrega a domicilio</h3>
              <p>Recibe tu pedido en 1 a 5 horas en La Habana.</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit__icon"><Store size={20} aria-hidden="true" /></span>
            <div>
              <h3>Recogida en el local</h3>
              <p>Listo en 2 horas, sin costo adicional.</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit__icon"><ShieldCheck size={20} aria-hidden="true" /></span>
            <div>
              <h3>Compra segura</h3>
              <p>Atención personalizada y productos garantizados.</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit__icon"><Clock size={20} aria-hidden="true" /></span>
            <div>
              <h3>Horarios amplios</h3>
              <p>De lunes a sábado, de 8 a. m. a 7 p. m.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Explora por categorías"
            title="Todo lo que buscas, bien organizado"
            description="Encuentra rápidamente lo que necesitas para tu despensa y tu hogar."
            action={
              <Link to="/productos" className="link-arrow">
                Ver catálogo completo <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                count={products.filter((product) => product.categoryId === category.id).length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream" id="ofertas">
        <div className="container">
          <SectionHeading
            eyebrow="Ahorra esta semana"
            title="Ofertas y promociones"
            description={`Descuentos de hasta ${bestDiscount} % en productos seleccionados.`}
            action={
              <Link to="/productos?filtro=ofertas" className="link-arrow">
                Ver todas las ofertas <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <ProductGrid products={weeklyOffers} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Los favoritos de la casa"
            title="Productos más vendidos"
            description="Los que nunca faltan en la mesa de nuestros clientes."
            action={
              <Link to="/productos" className="link-arrow">
                Ver más productos <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <ProductGrid products={favorites} />
        </div>
      </section>

      <section className="promo-band">
        <div className="container promo-band__inner">
          <div>
            <span className="eyebrow eyebrow--light">Productos destacados</span>
            <h2 className="promo-band__title">Calidad que se nota en cada detalle</h2>
            <p className="promo-band__text">
              Seleccionamos marcas y productos que cumplen con nuestros estándares de frescura,
              presentación y sabor. Haz tu pedido hoy y recibe sin complicaciones.
            </p>
            <Link to="/productos" className="btn btn--light btn--lg">
              Explorar el catálogo
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="promo-band__cards">
            {featured.map((product) => (
              <Link key={product.id} to={`/producto/${product.slug}`} className="promo-mini">
                <img src={product.image} alt={product.name} loading="lazy" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{format(product.priceUSD)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="nosotros">
        <div className="container about">
          <div className="about__content">
            <span className="eyebrow">Sobre nosotros</span>
            <div className="about__badge about__badge--inline">
              <strong>TCP</strong>
              <span>Forma de gestión no estatal</span>
            </div>
            <h2 className="section-head__title">Un mercado cercano, pensado para tu familia</h2>
            <p className="about__text">
              En {BUSINESS.name} reunimos alimentos, bebidas y artículos de aseo de proveedores
              seleccionados, con precios claros y atención directa. Somos un negocio cubano que
              apuesta por un servicio ágil, cercano y confiable.
            </p>
            <div className="about__list">
              <div className="about__item">
                <span className="about__icon"><MapPin size={18} aria-hidden="true" /></span>
                <div>
                  <h3>Ubicación</h3>
                  <p>{BUSINESS.address}</p>
                  <a href={BUSINESS.mapUrl} target="_blank" rel="noreferrer" className="about__link">
                    Ver en el mapa
                  </a>
                </div>
              </div>
              <div className="about__item">
                <span className="about__icon"><Clock size={18} aria-hidden="true" /></span>
                <div>
                  <h3>Horarios</h3>
                  {BUSINESS.hours.map((entry) => (
                    <p key={entry.days}>{entry.days}: {entry.time}</p>
                  ))}
                </div>
              </div>
              <div className="about__item">
                <span className="about__icon"><Truck size={18} aria-hidden="true" /></span>
                <div>
                  <h3>Entregas</h3>
                  <p>{BUSINESS.deliveryNote}</p>
                  <p>{BUSINESS.pickupNote}</p>
                </div>
              </div>
            </div>
            <a
              className="btn btn--whatsapp btn--lg"
              href={buildWhatsAppLink('Hola, quisiera más información sobre TCP Maria Vargas.')}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>Haz tu pedido en minutos</h2>
            <p>Agrega tus productos al carrito y elige cómo recibirlos. Nosotros nos encargamos del resto.</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/productos" className="btn btn--primary btn--lg">Empezar a comprar</Link>
            <a
              href={buildWhatsAppLink()}
              className="btn btn--ghost-light btn--lg"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
