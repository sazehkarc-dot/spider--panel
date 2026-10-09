import { useState, useEffect } from 'react'
import { api } from '../../lib/api'

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { api.adminGetSettings().then(setSettings).catch(() => {}) }, [])

  const handleChange = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.adminUpdateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  const fields = [
    { key: 'store_name', label: 'نام فروشگاه', ltr: false, area: false },
    { key: 'store_name_en', label: 'نام انگلیسی', ltr: true, area: false },
    { key: 'instagram', label: 'اینستاگرام', ltr: true, area: false },
    { key: 'contact_phone', label: 'تلفن تماس', ltr: true, area: false },
    { key: 'contact_email', label: 'ایمیل', ltr: true, area: false },
    { key: 'shipping_fee', label: 'هزینه ارسال (تومان)', ltr: true, area: false },
    { key: 'free_shipping_threshold', label: 'حداقل خرید رایگان (تومان)', ltr: true, area: false },
    { key: 'hero_title', label: 'عنوان صفحه اصلی', ltr: false, area: false },
    { key: 'hero_description', label: 'توضیحات صفحه اصلی', ltr: false, area: true },
    { key: 'hero_button_text', label: 'متن دکمه صفحه اصلی', ltr: false, area: false },
    { key: 'about_text', label: 'درباره ما', ltr: false, area: true },
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">تنظیمات فروشگاه</h1>
      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="label-field">{f.label}</label>
            {f.area ? (
              <textarea className="input-field" rows={3} value={settings[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} />
            ) : (
              <input className="input-field" value={settings[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} dir={f.ltr ? 'ltr' : 'rtl'} />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}</button>
          {saved && <span className="text-green-600 text-sm">✓ ذخیره شد</span>}
        </div>
      </form>
    </div>
  )
}
