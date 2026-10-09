import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { formatPrice, formatDate } from '../../lib/utils'

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', expires_at: '', usage_limit: '', is_active: true })

  const load = () => api.adminGetDiscounts().then(setDiscounts)
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.adminCreateDiscount({
      ...form, value: parseInt(form.value) || 0,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
    })
    setShowForm(false)
    setForm({ code: '', type: 'percentage', value: '', expires_at: '', usage_limit: '', is_active: true })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('حذف این تخفیف؟')) return
    await api.adminDeleteDiscount(id); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">تخفیف‌ها</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">+ تخفیف جدید</button>
      </div>

      {showForm && (
        <div className="card p-5 mb-4">
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">کد *</label>
              <input className="input-field" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} dir="ltr" required />
            </div>
            <div>
              <label className="label-field">نوع</label>
              <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="percentage">درصدی</option><option value="fixed">مبلغ ثابت</option>
              </select>
            </div>
            <div>
              <label className="label-field">مقدار *</label>
              <input type="number" className="input-field" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} dir="ltr" required />
            </div>
            <div>
              <label className="label-field">تاریخ انقضا</label>
              <input type="date" className="input-field" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="label-field">حد استفاده</label>
              <input type="number" className="input-field" value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} dir="ltr" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm">ذخیره</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">انصراف</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr><th className="text-right p-3">کد</th><th className="text-right p-3">نوع</th><th className="text-right p-3">مقدار</th><th className="text-right p-3">انقضا</th><th className="text-right p-3">استفاده</th><th className="text-right p-3">عملیات</th></tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="border-t border-gray-50">
                <td className="p-3 font-mono">{d.code}</td>
                <td className="p-3">{d.type === 'percentage' ? 'درصدی' : 'ثابت'}</td>
                <td className="p-3">{d.type === 'percentage' ? `${d.value}%` : formatPrice(d.value)}</td>
                <td className="p-3 text-xs">{d.expires_at ? formatDate(d.expires_at) : '—'}</td>
                <td className="p-3">{d.used_count}/{d.usage_limit || '∞'}</td>
                <td className="p-3"><button onClick={() => handleDelete(d.id)} className="text-red-500 hover:underline text-xs">حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
