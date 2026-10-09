import { useStore } from '../contexts/StoreContext'

export default function Contact() {
  const { settings } = useStore()
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">تماس با ما</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold mb-4">راه‌های ارتباطی</h2>
          <div className="space-y-4">
            {settings.contact_phone && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div><p className="text-sm text-gray-500">تلفن</p><p dir="ltr">{settings.contact_phone}</p></div>
              </div>
            )}
            <a href={`https://instagram.com/${settings.instagram || 'beesa_accessory'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-beesa-pink transition-colors">
              <span className="text-2xl">📷</span>
              <div><p className="text-sm text-gray-500">اینستاگرام</p><p>@{settings.instagram || 'beesa_accessory'}</p></div>
            </a>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-bold mb-4">پیام بدهید</h2>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); alert('پیام شما ارسال شد! به زودی با شما تماس خواهیم گرفت.') }}>
            <input className="input-field" placeholder="نام و نام خانوادگی" required />
            <input className="input-field" placeholder="شماره موبایل" dir="ltr" required />
            <textarea className="input-field" rows={3} placeholder="پیام شما" required />
            <button type="submit" className="btn-primary w-full">ارسال پیام</button>
          </form>
        </div>
      </div>
    </div>
  )
}
