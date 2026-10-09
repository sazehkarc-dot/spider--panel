import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useStore } from '../contexts/StoreContext'
import ProductCard from '../components/ProductCard'
import { categoryEmoji } from '../lib/utils'
import type { Product, Category } from '../types'

export default function Home() {
  const { settings } = useStore()
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [specialOffers, setSpecialOffers] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    Promise.all([
      api.getCategories(), api.getNewProducts(), api.getBestSellers(), api.getSpecialOffers(),
    ]).then(([cats, news, bests, offers]) => {
      setCategories(cats)
      setNewProducts(news)
      setBestSellers(bests)
      setSpecialOffers(offers)
    }).catch(console.error)
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-beesa-cream via-pink-50 to-purple-50 py-16 sm:py-24 px-4">
        <div className="absolute top-8 right-8 text-6xl opacity-20 animate-bounce-soft">💗</div>
        <div className="absolute bottom-8 left-8 text-5xl opacity-20 animate-bounce-soft">✨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-10">🎀</div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {settings.hero_title || 'یه چیز بامزه برای خودت پیدا کن 💗'}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-8">
            {settings.hero_description || 'بیسا، فروشگاه آنلاین اکسسوری‌های فانتزی و زیبا. بهترین هدیه برای خودت و عزیزانت'}
          </p>
          <Link to="/shop" className="btn-primary text-base sm:text-lg px-8 py-3.5">
            {settings.hero_button_text || 'مشاهده محصولات'}
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-beesa-pink-light to-beesa-lavender-light flex items-center justify-center text-2xl sm:text-3xl">
                  {categoryEmoji(cat.slug)}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">✨ جدیدترین محصولات</h2>
            <Link to="/shop?sort=new" className="text-beesa-pink text-sm hover:underline">مشاهده همه</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {newProducts.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">🔥 پرفروش‌ترین‌ها</h2>
              <Link to="/shop?sort=best_seller" className="text-beesa-pink text-sm hover:underline">مشاهده همه</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {bestSellers.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Special Offers */}
      {specialOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">🎁 پیشنهادهای ویژه</h2>
            <Link to="/shop" className="text-beesa-pink text-sm hover:underline">مشاهده همه</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {specialOffers.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="bg-beesa-pink/5 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'ارسال سریع', desc: 'تحویل در کوتاه‌ترین زمان' },
              { icon: '💗', title: 'بسته‌بندی با عشق', desc: 'هر سفارش با دقت بسته‌بندی می‌شود' },
              { icon: '🎧', title: 'پشتیبانی', desc: 'همیشه پاسخگوی شما هستیم' },
              { icon: '🔒', title: 'خرید امن', desc: 'اطلاعات شما محفوظ است' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center text-center p-3">
                <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-gradient-to-br from-beesa-pink/10 to-beesa-lavender/10 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">بیسا در اینستاگرام 📸</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">ما را دنبال کنید و از جدیدترین محصولات باخبر شوید</p>
          <a href={`https://instagram.com/${settings.instagram || 'beesa_accessory'}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
            @{settings.instagram || 'beesa_accessory'}
          </a>
        </div>
      </section>
    </div>
  )
}
