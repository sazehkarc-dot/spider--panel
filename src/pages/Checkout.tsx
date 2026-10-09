import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useStore } from '../contexts/StoreContext'
import { api } from '../lib/api'
import { formatPrice } from '../lib/utils'
import type { Order } from '../types'

const provinces = ['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'مازندران', 'گیلان', 'کرمان', 'یزد', 'البرز', 'قم', 'سمنان', 'هرمزگان', 'بوشهر', 'سیستان و بلوچستان', 'کرمانشاه', 'همدان', 'مرکزی', 'قزوین', 'زنجان', 'اردبیل', 'گلستان', 'خراسان شمالی', 'خراسان جنوبی', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'لرستان', 'ایلام', 'خوزستان', 'کردستان', 'آذربایجان غربی']

export default function Checkout() {
  const { user, loading } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const { settings } = useStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '', province: '', city: '', address: '', postal_code: '', notes: '' })

  if (loading) return <div className="py-20 text-center text-gray-400">در حال بارگذاری...</div>
  if (!user) return <Navigate to="/login" state={{ from: '/checkout' }} replace />

  const shippingFee = parseInt(settings.shipping_fee || '50000')
  const freeThreshold = parseInt(settings.free_shipping_threshold || '500000')
  const shipping = subtotal >= freeThreshold ? 0 : shippingFee
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.phone || !form.address) { setError('لطفاً تمام فیلدهای الزامی را پر کنید'); return }
    try {
      setSubmitting(true); setError('')
      const result = await api.createOrder({
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        ...form,
      })
      clearCart()
      setOrder(result)
    } catch (err: any) { setError(err.message || 'خطا در ثبت سفارش') }
    finally { setSubmitting(false) }
  }

  if (order) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">سفارش شما با موفقیت ثبت شد!</h1>
      <p className="text-gray-600 mb-2">شماره سفارش: <span className="font-mono font-bold text-beesa-pink">{order.order_number}</span></p>
      <p className="text-gray-500 mb-6 text-sm">مبلغ: {formatPrice(order.total)} تومان</p>
      <p className="text-gray-500 mb-6">سفارش شما در حال پردازش است. به زودی با شما تماس خواهیم گرفت.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/account" className="btn-primary">مشاهده سفارش‌ها</Link>
        <Link to="/shop" className="btn-secondary">ادامه خرید</Link>
      </div>
    </div>
  )

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h1 className="text-2xl font-bold mb-2">سبد خرید خالی است</h1>
      <Link to="/shop" className="btn-primary mt-4">مشاهده محصولات</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">تکمیل خرید</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-bold mb-4">اطلاعات تحویل</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">نام و نام خانوادگی *</label>
                <input className="input-field" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="نام کامل" />
              </div>
              <div>
                <label className="label-field">شماره موبایل *</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" />
              </div>
              <div>
                <label className="label-field">استان</label>
                <select className="input-field" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })}>
                  <option value="">انتخاب کنید</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">شهر</label>
                <input className="input-field" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="نام شهر" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">آدرس کامل *</label>
                <textarea className="input-field" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="آدرس کامل پستی" />
              </div>
              <div>
                <label className="label-field">کد پستی</label>
                <input className="input-field" value={form.postal_code} onChange={e => setForm({ ...form, postal_code: e.target.value })} placeholder="کد پستی" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">توضیحات سفارش</label>
                <textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="در صورت نیاز توضیحات خود را وارد کنید" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-bold mb-4">خلاصه سفارش</h2>
          <div className="space-y-2 mb-4 max-h-48 overflow-auto">
            {items.map(item => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <span className="text-gray-600 line-clamp-1">{item.name} × {item.quantity}</span>
                <span className="text-gray-800 whitespace-nowrap">{formatPrice((item.discount_price || item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
            <div className="flex justify-between"><span className="text-gray-500">جمع کل</span><span>{formatPrice(subtotal)} ت</span></div>
            <div className="flex justify-between"><span className="text-gray-500">ارسال</span><span>{shipping === 0 ? 'رایگان' : `${formatPrice(shipping)} ت`}</span></div>
            <div className="flex justify-between font-bold border-t border-gray-100 pt-2"><span>مبلغ کل</span><span className="text-beesa-pink">{formatPrice(total)} ت</span></div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-4">
            {submitting ? 'در حال ثبت...' : 'ثبت سفارش'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">پس از ثبت سفارش، همکاران ما با شما تماس خواهند گرفت.</p>
        </div>
      </form>
    </div>
  )
}
