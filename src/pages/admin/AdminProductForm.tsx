import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../lib/api'

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', discount_price: '', stock: '',
    sku: '', category_id: '', is_featured: false, is_new: false, is_best_seller: false,
    is_active: true, seo_title: '', seo_description: '',
  })

  useEffect(() => {
    api.adminGetCategories().then(setCategories).catch(() => {})
    if (isEdit) {
      api.adminGetProducts().then((products: any[]) => {
        const p = products.find(x => x.id === parseInt(id!))
        if (p) {
          setForm({
            name: p.name, slug: p.slug, description: p.description || '',
            price: String(p.price), discount_price: p.discount_price ? String(p.discount_price) : '',
            stock: String(p.stock), sku: p.sku || '', category_id: p.category_id ? String(p.category_id) : '',
            is_featured: p.is_featured, is_new: p.is_new, is_best_seller: p.is_best_seller,
            is_active: p.is_active, seo_title: p.seo_title || '', seo_description: p.seo_description || '',
          })
          api.getProduct(p.slug).then((detail: any) => {
            if (detail.images) setImages(detail.images.map((img: any) => img.image_url))
          }).catch(() => {})
        }
        setLoading(false)
      })
    }
  }, [id])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const result = await api.uploadImage(file)
        setImages(prev => [...prev, result.url])
      }
    } catch { setError('خطا در آپلود تصویر') }
    setUploading(false)
  }

  const removeImage = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) { setError('نام و قیمت الزامی است'); return }
    try {
      setSaving(true); setError('')
      const data = {
        ...form,
        price: parseInt(form.price),
        discount_price: form.discount_price ? parseInt(form.discount_price) : null,
        stock: parseInt(form.stock) || 0,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        images,
      }
      if (isEdit) await api.adminUpdateProduct(parseInt(id!), data)
      else await api.adminCreateProduct(data)
      navigate('/admin/products')
    } catch (err: any) { setError(err.message || 'خطا در ذخیره') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="text-gray-400">در حال بارگذاری...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/products" className="text-gray-400 hover:text-beesa-pink text-xl">→</Link>
        <h1 className="text-2xl font-bold">{isEdit ? 'ویرایش محصول' : 'محصول جدید'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card p-5 space-y-4">
          <div>
            <label className="label-field">نام محصول *</label>
            <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label-field">آدرس (slug)</label>
            <input className="input-field" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} dir="ltr" placeholder="خودی ساخته می‌شود" />
          </div>
          <div>
            <label className="label-field">توضیحات</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">قیمت (تومان) *</label>
              <input type="number" className="input-field" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} dir="ltr" required />
            </div>
            <div>
              <label className="label-field">قیمت با تخفیف</label>
              <input type="number" className="input-field" value={form.discount_price} onChange={e => setForm({ ...form, discount_price: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="label-field">موجودی</label>
              <input type="number" className="input-field" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="label-field">کد محصول (SKU)</label>
              <input className="input-field" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} dir="ltr" />
            </div>
            <div className="col-span-2">
              <label className="label-field">دسته‌بندی</label>
              <select className="input-field" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">بدون دسته</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'is_featured', label: 'ویژه' },
              { key: 'is_new', label: 'جدید' },
              { key: 'is_best_seller', label: 'پرفروش' },
              { key: 'is_active', label: 'فعال' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={(form as any)[item.key]} onChange={e => setForm({ ...form, [item.key]: e.target.checked })} className="w-4 h-4 accent-beesa-pink" />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <label className="label-field">تصاویر محصول</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="text-sm" disabled={uploading} />
          {uploading && <p className="text-xs text-gray-400 mt-1">در حال آپلود...</p>}
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <label className="label-field">عنوان SEO</label>
            <input className="input-field" value={form.seo_title} onChange={e => setForm({ ...form, seo_title: e.target.value })} />
          </div>
          <div>
            <label className="label-field">توضیحات SEO</label>
            <textarea className="input-field" rows={2} value={form.seo_description} onChange={e => setForm({ ...form, seo_description: e.target.value })} />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'در حال ذخیره...' : 'ذخیره محصول'}</button>
          <Link to="/admin/products" className="btn-secondary">انصراف</Link>
        </div>
      </form>
    </div>
  )
}
