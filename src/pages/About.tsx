import { useStore } from '../contexts/StoreContext'

export default function About() {
  const { settings } = useStore()
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">درباره {settings.store_name || 'بیسا'}</h1>
      <div className="card p-6 mb-6">
        <p className="text-gray-600 leading-8 whitespace-pre-line">{settings.about_text || 'بیسا برندی از ایران برای دخترانی که عاشق زیبایی و رنگ هستند. ما انواع اکسسوری‌های فانتزی و شیک را با بهترین کیفیت و قیمت مناسب ارائه می‌دهیم.'}</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: '💗', title: 'عشق به زیبایی', desc: 'هر محصول با عشق انتخاب شده' },
          { icon: '✨', title: 'کیفیت و تنوع', desc: 'بهترین محصولات با قیمت مناسب' },
          { icon: '🚚', title: 'ارسال سریع', desc: 'تحویل در کوتاه‌ترین زمان' },
        ].map(item => (
          <div key={item.title} className="card p-5 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
