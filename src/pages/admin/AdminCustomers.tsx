import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { formatPrice, formatDate } from '../../lib/utils'
import { ORDER_STATUS } from '../../types'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => { api.adminGetCustomers().then(setCustomers).catch(() => {}) }, [])

  const viewCustomer = async (id: number) => {
    try { const detail = await api.adminGetCustomer(id); setSelected(detail) } catch {}
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مشتریان ({customers.length})</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr><th className="text-right p-3">نام</th><th className="text-right p-3">موبایل</th><th className="text-right p-3">سفارش‌ها</th><th className="text-right p-3">مجموع خرید</th><th className="text-right p-3">عملیات</th></tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-t border-gray-50">
                <td className="p-3 font-medium">{c.full_name || '—'}</td>
                <td className="p-3" dir="ltr">{c.phone}</td>
                <td className="p-3">{c.order_count}</td>
                <td className="p-3 font-bold">{formatPrice(c.total_spent)} ت</td>
                <td className="p-3"><button onClick={() => viewCustomer(c.id)} className="text-blue-500 hover:underline text-xs">جزئیات</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="card p-6 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">جزئیات مشتری</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">نام:</span><span>{selected.full_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">موبایل:</span><span dir="ltr">{selected.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ایمیل:</span><span>{selected.email || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">عضویت:</span><span>{formatDate(selected.created_at)}</span></div>
            </div>
            <h3 className="font-bold text-sm mb-2">سفارش‌ها</h3>
            <div className="space-y-2">
              {selected.orders?.map((o: any) => (
                <div key={o.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm">
                  <div><span className="font-mono text-beesa-pink text-xs">{o.order_number}</span><p className="text-xs text-gray-400">{formatDate(o.created_at)}</p></div>
                  <div className="text-left"><span className="font-bold">{formatPrice(o.total)} ت</span><p className="text-xs">{ORDER_STATUS[o.status] || o.status}</p></div>
                </div>
              ))}
              {selected.orders?.length === 0 && <p className="text-gray-400 text-sm">سفارشی ثبت نشده</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
