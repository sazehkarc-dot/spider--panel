import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const sidebarLinks = [
  { to: '/admin', label: 'داشبورد', icon: '📊' },
  { to: '/admin/products', label: 'محصولات', icon: '📦' },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: '🏷️' },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: '🛒' },
  { to: '/admin/customers', label: 'مشتریان', icon: '👥' },
  { to: '/admin/discounts', label: 'تخفیف‌ها', icon: '🎁' },
  { to: '/admin/settings', label: 'تنظیمات', icon: '⚙️' },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">در حال بارگذاری...</div>
  if (!user || !user.is_admin) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-l border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b">
          <Link to="/admin" className="text-lg font-bold text-beesa-pink">بیسا ادمین</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(link => {
            const active = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to)
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-beesa-pink text-white' : 'text-gray-600 hover:bg-beesa-pink/10'}`}>
                <span>{link.icon}</span> {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t space-y-1">
          <Link to="/" className="block px-3 py-2 text-sm text-gray-500 hover:text-beesa-pink">← بازگشت به فروشگاه</Link>
          <button onClick={logout} className="w-full text-right px-3 py-2 text-sm text-gray-500 hover:text-red-500">خروج</button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
