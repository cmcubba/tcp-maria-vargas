export type OtCategory = 'filtro' | 'espresso' | 'cold-brew'

export interface OtProduct {
  id: string
  slug: string
  name: string
  origin: string
  region: string
  roast: 'Claro' | 'Medio' | 'Oscuro'
  process: string
  notes: string[]
  priceUSD: number
  weight: string
  category: OtCategory
  description: string
  badge?: string
}

export const OT_BASE = '/proyectos/otra_tinea'

export const OT_CAFE = {
  name: 'Tostado',
  fullName: 'Tostado · Café de especialidad',
  tagline: 'Café tostado en lotes pequeños, en el Vedado.',
  address: 'Calle 10 No. 214, entre 1ra y 3ra, Vedado, La Habana',
  hours: 'Lunes a sábado · 8:00 a. m. – 6:00 p. m.',
  whatsapp: '5354676775',
  instagram: '@tostado.cafe',
  email: 'hola@tostado.cafe',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vedado%2C%20La%20Habana',
}

export const OT_CATEGORIES: Array<{ id: OtCategory | 'todos'; label: string }> = [
  { id: 'todos', label: 'Todo el café' },
  { id: 'filtro', label: 'Filtro' },
  { id: 'espresso', label: 'Espresso' },
  { id: 'cold-brew', label: 'Cold brew' },
]

export const otProducts: OtProduct[] = [
  {
    id: 'etiopia-guji',
    slug: 'etiopia-guji',
    name: 'Etiopía Guji',
    origin: 'Etiopía',
    region: 'Guji · Oromia',
    roast: 'Claro',
    process: 'Lavado',
    notes: ['Jazmín', 'Durazno', 'Miel'],
    priceUSD: 18,
    weight: '250 g',
    category: 'filtro',
    description:
      'Un café de altura, delicado y aromático. Tostado claro para conservar el perfume floral y una acidez jugosa que recuerda al durazno maduro.',
    badge: 'Nuevo lote',
  },
  {
    id: 'colombia-huila',
    slug: 'colombia-huila',
    name: 'Colombia Huila',
    origin: 'Colombia',
    region: 'Huila · Pitalito',
    roast: 'Medio',
    process: 'Lavado',
    notes: ['Panela', 'Cacao', 'Naranja'],
    priceUSD: 16,
    weight: '250 g',
    category: 'filtro',
    description:
      'El café de todos los días: dulce, redondo y fácil de disfrutar. Notas de panela y cacao con un final cítrico que lo mantiene vivo.',
  },
  {
    id: 'brasil-cerrado',
    slug: 'brasil-cerrado',
    name: 'Brasil Cerrado',
    origin: 'Brasil',
    region: 'Cerrado Mineiro',
    roast: 'Medio',
    process: 'Natural',
    notes: ['Chocolate', 'Avellana', 'Caramelo'],
    priceUSD: 15,
    weight: '250 g',
    category: 'espresso',
    description:
      'Cuerpo alto y dulzor profundo. Ideal para espresso y bebidas con leche: chocolate, avellana y un caramelo que se queda en la taza.',
  },
  {
    id: 'guatemala-antigua',
    slug: 'guatemala-antigua',
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    region: 'Antigua · Sacatepéquez',
    roast: 'Medio',
    process: 'Lavado',
    notes: ['Miel', 'Ciruela', 'Especias'],
    priceUSD: 17,
    weight: '250 g',
    category: 'filtro',
    description:
      'Elegante y especiado, con dulzor de miel y una acidez de ciruela. Un café de mesa, para tomar sin prisa.',
  },
  {
    id: 'kenia-nyeri',
    slug: 'kenia-nyeri',
    name: 'Kenia Nyeri',
    origin: 'Kenia',
    region: 'Nyeri · Aberdare',
    roast: 'Claro',
    process: 'Lavado',
    notes: ['Grosella', 'Cítricos', 'Té negro'],
    priceUSD: 20,
    weight: '250 g',
    category: 'filtro',
    description:
      'Intenso y brillante. Grosella negra, cítricos y un final de té negro para quien busca una taza con carácter y mucha acidez.',
    badge: 'Edición limitada',
  },
  {
    id: 'casa-tostado',
    slug: 'casa-tostado',
    name: 'Casa Tostado',
    origin: 'Blend',
    region: 'Brasil + Colombia',
    roast: 'Oscuro',
    process: 'Blend',
    notes: ['Cacao', 'Nuez', 'Azúcar morena'],
    priceUSD: 14,
    weight: '250 g',
    category: 'espresso',
    description:
      'Nuestra mezcla de la casa. Tueste oscuro, cuerpo generoso y dulzor de azúcar morena. Perfecto para la greca o la máquina de espresso.',
  },
  {
    id: 'descafeinado-colombia',
    slug: 'descafeinado-colombia',
    name: 'Descafeinado Colombia',
    origin: 'Colombia',
    region: 'Cauca',
    roast: 'Medio',
    process: 'Sugarcane',
    notes: ['Cacao', 'Vainilla', 'Manzana'],
    priceUSD: 16,
    weight: '250 g',
    category: 'filtro',
    description:
      'Todo el sabor, sin la cafeína. Descafeinado con método de caña de azúcar: dulce, limpio y con notas de vainilla.',
  },
  {
    id: 'cold-brew',
    slug: 'cold-brew',
    name: 'Cold Brew',
    origin: 'Blend',
    region: 'Extracción en frío',
    roast: 'Medio',
    process: '18 horas',
    notes: ['Chocolate', 'Dátil', 'Cacao'],
    priceUSD: 12,
    weight: '500 ml',
    category: 'cold-brew',
    description:
      'Concentrado listo para servir. Diluye una parte de cold brew por dos de agua o leche y sírvelo bien frío. Dura hasta 10 días en refrigeración.',
    badge: 'Listo para servir',
  },
]

export function getOtProduct(slug: string) {
  return otProducts.find((product) => product.slug === slug)
}
