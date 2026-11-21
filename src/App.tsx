import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { OrdersPage } from './pages/OrdersPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OtraTiendaLayout } from './otra-tienda/OtraTiendaLayout'
import { OtraTiendaHome } from './otra-tienda/pages/Inicio'
import { OtCatalogo } from './otra-tienda/pages/Catalogo'
import { OtProducto } from './otra-tienda/pages/Producto'
import { OtCarrito } from './otra-tienda/pages/Carrito'
import { OtCheckout } from './otra-tienda/pages/Checkout'
import { OtPedido } from './otra-tienda/pages/Pedido'

export function App() {
  return (
    <Routes>
      <Route path="proyectos/otra_tinea" element={<OtraTiendaLayout />}>
        <Route index element={<OtraTiendaHome />} />
        <Route path="catalogo" element={<OtCatalogo />} />
        <Route path="producto/:slug" element={<OtProducto />} />
        <Route path="carrito" element={<OtCarrito />} />
        <Route path="checkout" element={<OtCheckout />} />
        <Route path="pedido/:code" element={<OtPedido />} />
      </Route>

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<CatalogPage />} />
        <Route path="producto/:slug" element={<ProductPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="pedido/:code" element={<OrderConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
