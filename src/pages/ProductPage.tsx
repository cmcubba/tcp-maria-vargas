import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ProductGrid } from '../components/product/ProductGrid'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { useToast } from '../context/ToastContext'
import { BUSINESS } from '../config'
import { getCategoryById } from '../data/categories'
import { getProductBySlug, products } from '../data/products'
import { cn } from '../utils/cn'
import { buildWhatsAppLink } from '../utils/validation'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  const { format } = useCurrency()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="container section">
        <EmptyState
          icon={<ShoppingBag size={30} />}
          title="Producto no encontrado"
          description="El producto que buscas no está disponible o cambió de nombre."
          action={
            <Link to="/productos" className="btn btn--primary">
              Volver al catálogo
            </Link>
          }
        />
      </div>
    )
  }

  const category = getCategoryById(product.categoryId)
  const soldOut = product.stock <= 0
  const savings = product.compareAtUSD ? product.compareAtUSD - product.priceUSD : 0
  const related = products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 4)
  const fallbackRelated = products.filter((item) => item.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addItem(product, quantity)
    showToast(`${product.name} agregado al carrito`, { image: product.image })
    setQuantity(1)
  }

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to="/productos">Productos</Link>
          {category && (
            <>
              <ChevronRight size={14} aria-hidden="true" />
              <Link to={`/productos?categoria=${category.id}`}>{category.name}</Link>
            </>
          )}
          <ChevronRight size={14} aria-hidden="true" />
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-detail__media">
            <div className="product-detail__image-wrap">
              <img src={product.image} alt={product.name} className="product-detail__image" />
              <div className="product-detail__badges">
                {soldOut && <Badge tone="muted">Agotado</Badge>}
                {product.tags.includes('oferta') && !soldOut && <Badge tone="offer">Oferta</Badge>}
                {product.tags.includes('nuevo') && <Badge tone="new">Nuevo</Badge>}
                {product.tags.includes('mas-vendido') && <Badge tone="best">Más vendido</Badge>}
              </div>
            </div>
            <div className="product-detail__perks">
              <span><Truck size={16} aria-hidden="true" /> Entrega a domicilio</span>
              <span><Store size={16} aria-hidden="true" /> Recogida en el local</span>
              <span><ShieldCheck size={16} aria-hidden="true" /> Producto garantizado</span>
            </div>
          </div>

          <div className="product-detail__info">
            <div className="product-detail__head">
              <p className="product-detail__brand">{product.brand ?? 'TCP Maria Vargas'}</p>
              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__presentation">{product.presentation}</p>
            </div>

            <div className="product-detail__price">
              <span className="price__now price__now--lg">{format(product.priceUSD)}</span>
              {product.compareAtUSD && (
                <>
                  <span className="price__was">{format(product.compareAtUSD)}</span>
                  <Badge tone="offer">Ahorras {format(savings)}</Badge>
                </>
              )}
            </div>

            <p className={cn('stock stock--lg', soldOut && 'stock--out')}>
              {soldOut
                ? 'Producto agotado temporalmente'
                : product.stock <= 5
                  ? `Disponible · últimas ${product.stock} unidades`
                  : `Disponible · ${product.stock} unidades`}
            </p>

            <p className="product-detail__description">{product.description}</p>

            <dl className="product-meta">
              <div>
                <dt>Marca</dt>
                <dd>{product.brand ?? 'TCP Maria Vargas'}</dd>
              </div>
              <div>
                <dt>Formato</dt>
                <dd>{product.presentation}</dd>
              </div>
              <div>
                <dt>Categoría</dt>
                <dd>{category?.name ?? 'Productos'}</dd>
              </div>
              <div>
                <dt>Disponibilidad</dt>
                <dd>{soldOut ? 'Agotado' : 'En existencia'}</dd>
              </div>
            </dl>

            <div className="product-detail__buy">
              <div className="product-detail__qty">
                <span className="field__label">Cantidad</span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.max(1, product.stock)}
                  disabled={soldOut}
                />
              </div>
              <button
                type="button"
                className="btn btn--primary btn--lg product-detail__add"
                onClick={handleAdd}
                disabled={soldOut}
              >
                <ShoppingBag size={18} aria-hidden="true" />
                {soldOut ? 'Producto agotado' : 'Agregar al carrito'}
              </button>
            </div>

            <div className="product-detail__notes">
              <p><Clock size={15} aria-hidden="true" /> {BUSINESS.pickupNote}</p>
              <p><Truck size={15} aria-hidden="true" /> {BUSINESS.deliveryNote}</p>
            </div>

            <a
              href={buildWhatsAppLink(`Hola, tengo una consulta sobre ${product.name} (${product.presentation}).`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--whatsapp-outline product-detail__whatsapp"
            >
              <MessageCircle size={17} aria-hidden="true" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <div className="product-back">
          <Link to="/productos" className="link-arrow">
            <ArrowLeft size={15} aria-hidden="true" />
            Seguir comprando
          </Link>
        </div>
      </div>

      <div className="section section--cream related">
        <div className="container">
          <SectionHeading
            eyebrow="También podría interesarte"
            title="Productos relacionados"
            action={
              category ? (
                <Link to={`/productos?categoria=${category.id}`} className="link-arrow">
                  Ver toda la categoría
                </Link>
              ) : undefined
            }
          />
          <ProductGrid products={related.length > 0 ? related : fallbackRelated} />
        </div>
      </div>
    </div>
  )
}
