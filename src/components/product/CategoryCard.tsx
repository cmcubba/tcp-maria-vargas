import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '../../types'

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link to={`/productos?categoria=${category.id}`} className="category-card">
      <div className="category-card__media">
        <img src={category.image} alt={category.name} loading="lazy" />
        <span className="category-card__count">{count} productos</span>
      </div>
      <div className="category-card__body">
        <h3>{category.name}</h3>
        <span className="category-card__link">
          Ver categoría
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
