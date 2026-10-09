import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useStore } from '../contexts/StoreContext'
import { formatPrice, effectivePrice } from '../lib/utils'
import ProductImage from '../components/ProductImage'
import type { Product } from '../types'

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, count } = useCart()
  const { settings } = useStore()
  const navigate = useNavigate()

  const shippingFee = parseInt(settings.shipping_fee || '50000')
  const freeThreshold = parseInt(settings.free_shipping_threshold || '500000')
  const shipping = subtotal >= freeThreshold || subtotal === 0 ? 0 : shippingFee
  const total = subtotal + shipping

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">سبد خرید خالی است</h1>
        <p className="text-gray-500 mb-6">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
        <Link to="/shop" className="btn-primary">مشاهده محصولات</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">سبد خرید ({count})</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.product_id} className="card flex gap-3 p-3">
              <Link to={`/product/${item.slug}`} className="shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <div className="w-20 h-20"><ProductImage product={{ slug: '', name: item.name } as Product} className="w-full h-full rounded-xl" /></div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-beesa-pink">{item.name}</Link>
                <p className="text-beesa-pink font-bold mt-1">{formatPrice(item.discount_price || item.price)} <span className="text-xs text-gray-500">تومان</span></p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600">−</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, Math.min(item.quantity + 1, item.stock))} className="w-8 h-8 flex items-center justify-center text-gray-600">+</button>
                  </div>
                  <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-600 text-sm">حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4 h-fit sticky top-20">
          <h2 className="font-bold mb-4">خلاصه سفارش</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">جمع کل</span><span>{formatPrice(subtotal)} تومان</span></div>
            <div className="flex justify-between"><span className="text-gray-500">هزینه ارسال</span>
              <span>{shipping === 0 ? <span className="text-green-600">رایگان</span> : `${formatPrice(shipping)} تومان`}</span>
            </div>
            {shipping > 0 && subtotal < freeThreshold && (
              <p className="text-xs text-beesa-pink bg-beesa-pink/10 rounded-lg p-2">
                با {formatPrice(freeThreshold - subtotal)} تومان خرید بیشتر، ارسال رایگان!
              </p>
            )}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
              <span>مبلغ قابل پرداخت</span><span className="text-beesa-pink">{formatPrice(total)} تومان</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-4">تکمیل خرید</button>
          <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-beesa-pink mt-3">ادامه خرید</Link>
        </div>
      </div>
    </div>
  )
}
