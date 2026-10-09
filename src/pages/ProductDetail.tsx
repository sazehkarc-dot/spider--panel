import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice, hasDiscount, discountPercent, effectivePrice } from '../lib/utils'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [wished, setWished] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    setActiveImage(0)
    setQuantity(1)
    api.getProduct(slug!).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">در حال بارگذاری...</div>
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">محصول یافت نشد</div>

  const out = product.stock <= 0
  const images = product.images?.length ? product.images : [{ image_url: '' } as any]

  const handleAddCart = () => {
    addItem({
      product_id: product.id, name: product.name, slug: product.slug,
      price: product.price, discount_price: product.discount_price,
      image_url: product.images?.[0]?.image_url || null, quantity, stock: product.stock,
    })
  }

  const handleBuyNow = () => { handleAddCart(); navigate('/checkout') }

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return }
    try {
      if (wished) { await api.removeFromWishlist(product.id); setWished(false) }
      else { await api.addToWishlist(product.id); setWished(true) }
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-4 flex gap-2">
        <Link to="/" className="hover:text-beesa-pink">خانه</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-beesa-pink">فروشگاه</Link>
        {product.category_slug && <><span>/</span><Link to={`/shop?category=${product.category_slug}`} className="hover:text-beesa-pink">{product.category_name}</Link></>}
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="card overflow-hidden mb-3">
            {images[activeImage]?.image_url ? (
              <img src={images[activeImage].image_url} alt={product.name} className="w-full aspect-square object-cover" />
            ) : (
              <ProductImage product={product} className="w-full aspect-square" />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img: any, i: number) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-beesa-pink' : 'border-transparent'}`}>
                  {img.image_url ? <img src={img.image_url} alt="" className="w-full h-full object-cover" /> : <ProductImage product={product} className="w-full h-full" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          {product.category_name && <span className="text-sm text-beesa-pink bg-beesa-pink/10 px-3 py-1 rounded-full inline-block mb-4">{product.category_name}</span>}

          <div className="flex items-baseline gap-3 mb-4">
            {hasDiscount(product.price, product.discount_price) && (
              <>
                <span className="text-gray-400 line-through text-lg">{formatPrice(product.price)}</span>
                <span className="bg-beesa-pink text-white text-sm font-bold px-2 py-0.5 rounded-full">٪{discountPercent(product.price, product.discount_price!)}</span>
              </>
            )}
            <span className="text-3xl font-bold text-beesa-pink">{formatPrice(effectivePrice(product.price, product.discount_price))}</span>
            <span className="text-gray-500">تومان</span>
          </div>

          <div className="mb-4">
            {out ? <span className="text-red-500 font-medium">ناموجود</span> :
              <span className="text-green-600 text-sm flex items-center gap-1">✓ موجود ({product.stock} عدد)</span>}
          </div>

          {product.description && <p className="text-gray-600 leading-7 mb-6">{product.description}</p>}

          {!out && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-600">تعداد:</span>
              <div className="flex items-center border border-gray-200 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-beesa-pink">−</button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-beesa-pink">+</button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {!out && <>
              <button onClick={handleAddCart} className="btn-primary flex-1">افزودن به سبد</button>
              <button onClick={handleBuyNow} className="btn-secondary flex-1">خرید الان</button>
            </>}
            <button onClick={handleWishlist} className={`px-4 py-3 rounded-full border-2 transition-all ${wished ? 'border-beesa-pink text-beesa-pink bg-beesa-pink/5' : 'border-gray-200 text-gray-400 hover:border-beesa-pink'}`}>
              <svg width="22" height="22" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {product.related && product.related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {product.related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
