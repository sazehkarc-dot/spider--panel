import { Link } from 'react-router-dom'
import { useStore } from '../../contexts/StoreContext'

export default function Footer() {
  const { settings } = useStore()
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">{settings.store_name || 'بیسا'}</h3>
            <p className="text-sm text-gray-400 leading-7">{settings.about_text || 'بیسا برندی از ایران برای دخترانی که عاشق زیبایی و رنگ هستند.'}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-4">صفحات مهم</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-beesa-pink transition-colors">فروشگاه</Link></li>
              <li><Link to="/about" className="hover:text-beesa-pink transition-colors">درباره ما</Link></li>
              <li><Link to="/contact" className="hover:text-beesa-pink transition-colors">تماس با ما</Link></li>
              <li><Link to="/faq" className="hover:text-beesa-pink transition-colors">سوالات متداول</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-4">دسته‌بندی‌ها</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop?category=necklace" className="hover:text-beesa-pink transition-colors">گردنبند</Link></li>
              <li><Link to="/shop?category=bracelet" className="hover:text-beesa-pink transition-colors">دستبند</Link></li>
              <li><Link to="/shop?category=ring" className="hover:text-beesa-pink transition-colors">انگشتر</Link></li>
              <li><Link to="/shop?category=hair-accessory" className="hover:text-beesa-pink transition-colors">اکسسوری مو</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-4">ارتباط با ما</h3>
            <ul className="space-y-2.5 text-sm">
              {settings.contact_phone && <li className="flex items-center gap-2">📞 {settings.contact_phone}</li>}
              <li>
                <a href={`https://instagram.com/${settings.instagram || 'beesa_accessory'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-beesa-pink transition-colors">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>
                  @{settings.instagram || 'beesa_accessory'}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {settings.store_name || 'بیسا'} — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  )
}
