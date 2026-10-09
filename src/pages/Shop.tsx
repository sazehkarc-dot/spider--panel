import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import ProductCard from '../components/ProductCard'
import type { Product, Category } from '../types'

const sortOptions = [
  { value: '', label: 'مرتب‌سازی' },
  { value: 'new', label: 'جدیدترین' },
  { value: 'best_seller', label: 'پرفروش‌ترین' },
  { value: 'price_low', label: 'ارزان‌ترین' },
  { value: 'price_high', label: 'گران‌ترین' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const inStock = searchParams.get('in_stock') === 'true'

  useEffect(() => { api.getCategories().then(setCategories).catch(() => {}) }, [])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (category) params.category = category
    if (sort) params.sort = sort
    if (inStock) params.in_stock = 'true'
    api.getProducts(params).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false))
  }, [search, category, sort, inStock])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">فروشگاه</h1>
      {search && <p className="text-gray-500 mb-4 text-sm">نتایج جستجو برای: «{search}»</p>}

      <div className="flex items-center justify-between mb-4 gap-2">
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden btn-ghost text-sm">
          فیلترها {showFilters ? '▲' : '▼'}
        </button>
        <select value={sort} onChange={e => updateParam('sort', e.target.value)}
          className="input-field max-w-44 py-2 text-sm mr-auto">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0 space-y-6`}>
          <div>
            <h3 className="font-bold text-sm mb-3">دسته‌بندی‌ها</h3>
            <div className="space-y-1.5">
              <button onClick={() => updateParam('category', '')}
                className={`block w-full text-right px-3 py-1.5 rounded-lg text-sm transition-colors ${!category ? 'bg-beesa-pink text-white' : 'hover:bg-beesa-pink/10'}`}>
                همه
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => updateParam('category', c.slug)}
                  className={`block w-full text-right px-3 py-1.5 rounded-lg text-sm transition-colors ${category === c.slug ? 'bg-beesa-pink text-white' : 'hover:bg-beesa-pink/10'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">موجودی</h3>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={e => updateParam('in_stock', e.target.checked ? 'true' : '')}
                className="w-4 h-4 accent-beesa-pink" />
              فقط کالاهای موجود
            </label>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">محصولی یافت نشد</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
