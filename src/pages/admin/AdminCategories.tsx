import { useState, useEffect } from 'react'
import { api } from '../../lib/api'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', sort_order: '0', is_active: true })

  const load = () => api.adminGetCategories().then(setCategories)
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...form, sort_order: parseInt(form.sort_order) || 0 }
    if (editing) await api.adminUpdateCategory(editing.id, data)
    else await api.adminCreateCategory(data)
    setShowForm(false); setEditing(null)
    setForm({ name: '', slug: '', description: '', sort_order: '0', is_active: true })
    load()
  }

  const handleEdit = (cat: any) => {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', sort_order: String(cat.sort_order), is_active: cat.is_active })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('حذف این دسته‌بندی؟')) return
    await api.adminDeleteCategory(id); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', description: '', sort_order: '0', is_active: true }); setShowForm(true) }} className="btn-primary text-sm">+ دسته جدید</button>
      </div>

      {showForm && (
        <div className="card p-5 mb-4">
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">نام *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label-field">آدرس (slug)</label>
              <input className="input-field" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="label-field">ترتیب</label>
              <input type="number" className="input-field" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="label-field">توضیحات</label>
              <input className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-beesa-pink" /> فعال
            </label>
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
            <tr><th className="text-right p-3">نام</th><th className="text-right p-3">آدرس</th><th className="text-right p-3">ترتیب</th><th className="text-right p-3">وضعیت</th><th className="text-right p-3">عملیات</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t border-gray-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500" dir="ltr">{c.slug}</td>
                <td className="p-3">{c.sort_order}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.is_active ? 'فعال' : 'غیرفعال'}</span></td>
                <td className="p-3"><div className="flex gap-3"><button onClick={() => handleEdit(c)} className="text-blue-500 hover:underline text-xs">ویرایش</button><button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">حذف</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
