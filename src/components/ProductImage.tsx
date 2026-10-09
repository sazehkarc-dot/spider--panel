import { categoryGradient, categoryEmoji } from '../lib/utils'
import type { Product } from '../types'

export default function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const imageUrl = product.images?.[0]?.image_url
  if (imageUrl) {
    return <img src={imageUrl} alt={product.name} className={`${className} object-cover`} loading="lazy" />
  }
  return (
    <div className={`${className} bg-gradient-to-br ${categoryGradient(product.category_slug)} flex items-center justify-center`}>
      <span className="text-6xl opacity-80 select-none">{categoryEmoji(product.category_slug)}</span>
    </div>
  )
}
