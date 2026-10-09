import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import { formatPrice, hasDiscount, discountPercent, effectivePrice } from '../lib/utils'
import ProductImage from './ProductImage'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const [wished, setWished] = useState(false)

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount_price: product.discount_price,
      image_url: product.images?.[0]?.image_url || null,
      quantity: 1,
      stock: product.stock,
    })
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      if (wished) {
        await api.removeFromWishlist(product.id)
        setWished(false)
      } else {
        await api.addToWishlist(product.id)
        setWished(true)
      }
    } catch {}
  }

  const out = product.stock <= 0

  return (
    <Link to={`/product/${product.slug}`} className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden">
        <ProductImage product={product} className="aspect-square w-full" />
        {hasDiscount(product.price, product.discount_price) && (
          <span className="absolute top-2 right-2 bg-beesa-pink text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            ٪{discountPercent(product.price, product.discount_price!)}
          </span>
        )}
        {product.is_new && !hasDiscount(product.price, product.discount_price) && (
          <span className="absolute top-2 right-2 bg-beesa-lavender text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            جدید
          </span>
        )}
        <button onClick={handleWishlist}
          className={`absolute top-2 left-2 w-9 h-9 rounded-full flex items-center justify-center transition-all ${wished ? 'bg-beesa-pink text-white' : 'bg-white/80 text-gray-400 hover:text-beesa-pink'}`}>
          <svg width="18" height="18" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm leading-6 min-h-[3rem]">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          {hasDiscount(product.price, product.discount_price) && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
          <span className="text-lg font-bold text-beesa-pink">{formatPrice(effectivePrice(product.price, product.discount_price))}</span>
          <span className="text-xs text-gray-500">تومان</span>
        </div>
        {out ? (
          <span className="block text-center py-2.5 text-gray-400 bg-gray-100 rounded-full text-sm font-medium">ناموجود</span>
        ) : (
          <button onClick={handleAddCart} className="btn-primary w-full text-sm py-2.5">
            افزودن به سبد
          </button>
        )}
      </div>
    </Link>
  )
}
