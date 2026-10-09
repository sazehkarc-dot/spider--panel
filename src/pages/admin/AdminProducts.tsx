import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { formatPrice } from '../../lib/utils'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.adminGetProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return
    await api.adminDeleteProduct(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">محصولات ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm">+ محصول جدید</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-right p-3">نام</th>
              <th className="text-right p-3">دسته</th>
              <th className="text-right p-3">قیمت</th>
              <th className="text-right p-3">موجودی</th>
              <th className="text-right p-3">وضعیت</th>
              <th className="text-right p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">در حال بارگذاری...</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-gray-500">{p.category_name || '—'}</td>
                <td className="p-3 whitespace-nowrap">{formatPrice(p.discount_price || p.price)}</td>
                <td className="p-3"><span className={p.stock < 10 ? 'text-red-500 font-bold' : ''}>{p.stock}</span></td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-blue-500 hover:underline text-xs">ویرایش</Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
