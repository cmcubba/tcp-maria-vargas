import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 'carnes',
    slug: 'carnes-y-embutidos',
    name: 'Carnes y embutidos',
    description: 'Pollo, res, cerdo y picadillos.',
    image: '/images/productos/53974.webp',
    icon: 'beef',
  },
  {
    id: 'lacteos',
    slug: 'lacteos-y-helados',
    name: 'Lácteos y helados',
    description: 'Leche, quesos, yogures y helados.',
    image: '/images/productos/54076.webp',
    icon: 'milk',
  },
  {
    id: 'granos',
    slug: 'granos-y-cereales',
    name: 'Granos y cereales',
    description: 'Arroz, frijoles, pastas y cereales.',
    image: '/images/productos/54293.webp',
    icon: 'wheat',
  },
  {
    id: 'conservas',
    slug: 'conservas-y-enlatados',
    name: 'Conservas y enlatados',
    description: 'Pasta de tomate, salsas y enlatados.',
    image: '/images/productos/54308.webp',
    icon: 'package',
  },
  {
    id: 'dulces',
    slug: 'dulces-y-confituras',
    name: 'Dulces y confituras',
    description: 'Galletas, chocolates y jaleas.',
    image: '/images/productos/54279.webp',
    icon: 'candy',
  },
  {
    id: 'combos',
    slug: 'combos-y-regalos',
    name: 'Combos y regalos',
    description: 'Combos de alimentos, meriendas y regalos.',
    image: '/images/productos/54203.webp',
    icon: 'gift',
  },
  {
    id: 'bebidas',
    slug: 'bebidas',
    name: 'Bebidas',
    description: 'Refrescos, jugos y líquidos.',
    image: '/images/productos/54215.webp',
    icon: 'cup',
  },
  {
    id: 'aseo',
    slug: 'aseo-y-limpieza',
    name: 'Aseo y limpieza',
    description: 'Productos de limpieza para el hogar.',
    image: '/images/productos/54218.webp',
    icon: 'sparkles',
  },
  {
    id: 'otros',
    slug: 'otros-productos',
    name: 'Otros productos',
    description: 'Todo lo demás que encontrarás en la tienda.',
    image: '/images/productos/54304.webp',
    icon: 'basket',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}
