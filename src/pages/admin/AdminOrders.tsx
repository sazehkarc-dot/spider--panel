import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { formatPrice, formatDate } from '../../lib/utils'
import { ORDER_STATUS } from '../../types'

const statuses = Object.entries(ORDER_STATUS)

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = () => { setLoading(true); api.adminGetOrders().then(setOrders).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleStatusChange = async (id: number, status: string) => {
    await api.adminUpdateOrderStatus(id, status); load()
  }

  const viewOrder = async (id: number) => {
    try { const detail = await api.adminGetOrder(id); setSelected(detail) } catch {}
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">سفارش‌ها ({orders.length})</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr><th className="text-right p-3">شماره</th><th className="text-right p-3">مشتری</th><th className="text-right p-3">مبلغ</th><th className="text-right p-3">تاریخ</th><th className="text-right p-3">وضعیت</th><th className="text-right p-3">عملیات</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">در حال بارگذاری...</td></tr> :
            orders.map(o => (
              <tr key={o.id} className="border-t border-gray-50">
                <td className="p-3 font-mono text-beesa-pink text-xs">{o.order_number}</td>
                <td className="p-3">{o.customer_name || o.full_name}<br /><span className="text-xs text-gray-400" dir="ltr">{o.phone}</span></td>
                <td className="p-3 font-bold whitespace-nowrap">{formatPrice(o.total)} ت</td>
                <td className="p-3 text-xs text-gray-500">{formatDate(o.created_at)}</td>
                <td className="p-3">
                  <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-beesa-pink">
                    {statuses.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                </td>
                <td className="p-3"><button onClick={() => viewOrder(o.id)} className="text-blue-500 hover:underline text-xs">جزئیات</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="card p-6 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">جزئیات سفارش</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">شماره:</span><span className="font-mono">{selected.order_number}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">مشتری:</span><span>{selected.full_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">موبایل:</span><span dir="ltr">{selected.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">استان:</span><span>{selected.province || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">شهر:</span><span>{selected.city || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">آدرس:</span><span className="text-left max-w-xs">{selected.address}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">کد پستی:</span><span dir="ltr">{selected.postal_code || '—'}</span></div>
              {selected.notes && <div className="flex justify-between"><span className="text-gray-500">توضیحات:</span><span>{selected.notes}</span></div>}
            </div>
            <h3 className="font-bold text-sm mb-2">اقلام سفارش</h3>
            <div className="space-y-1 mb-4">
              {selected.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-50">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)} ت</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">جمع کل:</span><span>{formatPrice(selected.subtotal)} ت</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ارسال:</span><span>{formatPrice(selected.shipping)} ت</span></div>
              <div className="flex justify-between font-bold"><span>مبلغ نهایی:</span><span className="text-beesa-pink">{formatPrice(selected.total)} ت</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
