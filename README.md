# TCP Maria Vargas — Tienda virtual TCP

Tienda de alimentos para un negocio TCP cubano. Catálogo, carrito persistente, checkout con recogida o entrega a domicilio, conversión USD/CUP y confirmación de pedido.

## Tecnologías

- React 19 + TypeScript + Vite
- React Router
- CSS propio con sistema de diseño y tipografía Poppins autoalojada
- Persistencia local del carrito, la moneda y los pedidos (preparado para API)

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # producción en dist/
npm run preview
```

## Configuración del negocio

- `src/config.ts`: nombre, dirección, teléfono, WhatsApp, correo, horarios y tasa de cambio (`cupRate: 940`).
- Los precios base se definen en **USD** en `src/data/products.ts`.
- La moneda elegida (USD/CUP) se guarda en el navegador y se aplica a todo el sitio.
- Zonas y costos de entrega: `src/data/delivery.ts` (provincias, municipios y tarifas).

## Arquitectura

```
src/
  components/   UI reutilizable (layout, producto, carrito, formularios)
  context/      Carrito, moneda y notificaciones
  data/         Catálogo, categorías y zonas de entrega
  pages/        Inicio, catálogo, producto, carrito, checkout, confirmación
  services/     submitOrder() — punto único para conectar el backend
  styles/       Sistema de diseño responsive
  utils/        Formatos de moneda, fechas y validaciones
```

## Integración con backend

`src/services/orders.ts` concentra la creación de pedidos. Para conectar una API real basta con reemplazar el cuerpo de `submitOrder()` por el `fetch` al endpoint correspondiente, manteniendo la firma. El pedido se guarda además en `localStorage` como respaldo y para poder consultar la confirmación al recargar.

## PWA (app instalable)

El sitio es instalable como aplicación (manifest + service worker generado con `vite-plugin-pwa`):

- Iconos en `public/pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png` y `apple-touch-icon.png`.
- Configuración del manifest y del precache en `vite.config.ts`.
- El botón «Instalar app» aparece automáticamente cuando el navegador lo permite (menú móvil y pie de página); en iPhone/iPad muestra las instrucciones de Safari.
- El service worker precachea la app y las imágenes: funciona sin conexión tras la primera visita.

Para probar la PWA usa `npm run build && npm run preview` (el service worker no se activa en `dev`).

## Otra tienda: Tostado (/proyectos/otra_tinea)

Segunda tienda completa con identidad y diseño distintos, pensada como proyecto paralelo:

- **Ruta**: `/proyectos/otra_tinea` (catálogo, producto, carrito, checkout y confirmación en subrutas).
- **Marca**: Tostado, café de especialidad en el Vedado.
- **Diseño**: tema oscuro editorial, tipografía Fraunces autoalojada, acentos cobre y tarjetas tipográficas sin fotos de producto.
- **Funcionalidad**: catálogo con filtros y búsqueda, carrito propio persistente, checkout con recogida/envío, métodos de pago y pedido por WhatsApp.
- **Código**: `src/otra-tienda/` (componentes, datos, carrito, estilos y páginas). No comparte carrito ni estilos con TCP Maria Vargas.

## Pedidos y estados

- La página `/pedidos` muestra el historial de pedidos guardados en el dispositivo con su estado, datos del cliente, pago, productos y totales.
- Cada pedido permite actualizar su estado: pendiente, confirmado, en preparación, listo, en camino, entregado o cancelado.
- El estado se refleja en el comprobante del pedido (`/pedido/:code`).
- Al confirmar un pedido se vacía el carrito.

## Pedidos y pagos

- Al confirmar el pedido se vacía el carrito y se abre WhatsApp con un resumen completo (cliente, método de pago, entrega o recogida, productos y totales).
- Métodos de pago disponibles: efectivo USD, Zelle y efectivo CUP (tasa configurable en `src/config.ts`).
- La confirmación muestra el total a pagar en la moneda del método elegido y mantiene el botón «Enviar pedido por WhatsApp».

## Notas

- No se simulan pagos: el checkout indica que el pago se coordina con el negocio.
- El número de WhatsApp y el teléfono en `src/config.ts` son de ejemplo; sustitúyelos por los reales.
- Fotografías: Unsplash y generaciones propias para productos específicos (atún, avena, frijoles, harina, dulces y refrescos).
