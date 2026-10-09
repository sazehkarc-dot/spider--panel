import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import { formatPrice, formatDate } from '../lib/utils'
import { ORDER_STATUS } from '../types'
import ProductImage from '../components/ProductImage'
import type { Order } from '../types'

export default function Account() {
  const { user, loading, logout } = useAuth()
  const [tab, setTab] = useState('profile')
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      api.getOrders().then(setOrders).catch(() => {})
      api.getWishlist().then(setWishlist).catch(() => {})
    }
  }, [user])

  if (loading) return <div className="py-20 text-center text-gray-400">در حال بارگذاری...</div>
  if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace />

  const tabs = [
    { id: 'profile', label: 'پروفایل' },
    { id: 'orders', label: 'سفارش‌ها' },
    { id: 'wishlist', label: 'علاقه‌مندی‌ها' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">حساب من</h1>
        <button onClick={logout} className="btn-ghost text-sm">خروج</button>
      </div>
      <div className="flex gap-1 mb-6 border-b border-gray-100">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-beesa-pink text-beesa-pink' : 'border-transparent text-gray-500 hover:text-beesa-pink'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-beesa-pink to-beesa-lavender flex items-center justify-center text-white text-2xl font-bold">
              {(user.full_name || user.phone)[0]}
            </div>
            <div>
              <p className="font-bold text-lg">{user.full_name || 'کاربر بیسا'}</p>
              <p className="text-sm text-gray-500" dir="ltr">{user.phone}</p>
            </div>
          </div>
          <div className="border-t border-gray-50 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">ایمیل</span><span>{user.email || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">تاریخ عضویت</span><span>{formatDate(user.created_at)}</span></div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? <div className="text-center py-12 text-gray-400">
            <p className="mb-4">سفارشی ثبت نشده</p>
            <Link to="/shop" className="btn-primary">شروع خرید</Link>
          </div> : orders.map(o => (
            <div key={o.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-sm text-beesa-pink">{o.order_number}</span>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(o.created_at)}</p>
                </div>
                <div className="text-left">
                  <span className={`text-xs px-2 py-1 rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-beesa-pink/10 text-beesa-pink'}`}>
                    {ORDER_STATUS[o.status] || o.status}
                  </span>
                  <p className="font-bold mt-1">{formatPrice(o.total)} ت</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? <p className="text-gray-400 text-center py-12">لیست علاقه‌مندی‌ها خالی است</p> :
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishlist.map(w => (
                <Link key={w.product_id} to={`/product/${w.slug}`} className="card group hover:shadow-lg transition-all">
                  <ProductImage product={w as any} className="aspect-square w-full" />
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2">{w.name}</h3>
                    <p className="text-beesa-pink font-bold mt-1 text-sm">{formatPrice(w.discount_price || w.price)} ت</p>
                  </div>
                </Link>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  )
}
