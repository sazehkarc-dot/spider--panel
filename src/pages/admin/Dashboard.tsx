import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { formatPrice, formatDate } from '../../lib/utils'
import { ORDER_STATUS } from '../../types'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => { api.adminDashboard().then(setData).catch(console.error) }, [])

  if (!data) return <div className="text-gray-400 py-8">در حال بارگذاری...</div>

  const stats = [
    { label: 'فروش کل', value: `${formatPrice(data.total_sales)} ت`, icon: '💰', color: 'bg-green-50 text-green-600' },
    { label: 'سفارش‌ها', value: data.total_orders, icon: '🛒', color: 'bg-blue-50 text-blue-600' },
    { label: 'مشتریان', value: data.total_customers, icon: '👥', color: 'bg-purple-50 text-purple-600' },
    { label: 'محصولات', value: data.total_products, icon: '📦', color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-bold mb-4">سفارش‌های اخیر</h2>
          <div className="space-y-2">
            {data.recent_orders?.map((o: any) => (
              <div key={o.id} className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
                <div>
                  <span className="font-mono text-beesa-pink text-xs">{o.order_number}</span>
                  <p className="text-xs text-gray-400">{o.customer_name || o.full_name} • {formatDate(o.created_at)}</p>
                </div>
                <div className="text-left">
                  <span className="font-bold">{formatPrice(o.total)} ت</span>
                  <p className="text-xs">{ORDER_STATUS[o.status] || o.status}</p>
                </div>
              </div>
            ))}
            {data.recent_orders?.length === 0 && <p className="text-gray-400 text-sm">سفارشی ثبت نشده</p>}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold mb-4">موجودی کم</h2>
          <div className="space-y-2">
            {data.low_stock?.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
                <span>{p.name}</span>
                <span className={`font-bold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>{p.stock} عدد</span>
              </div>
            ))}
            {data.low_stock?.length === 0 && <p className="text-gray-400 text-sm">موجودی کافی است ✓</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
