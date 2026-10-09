import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useStore } from '../../contexts/StoreContext'

const navLinks = [
  { to: '/', label: 'خانه' },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/shop?sort=new', label: 'جدیدها' },
  { to: '/shop?sort=best_seller', label: 'پرفروش‌ها' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' },
]

export default function Navbar() {
  const { count } = useCart()
  const { user } = useAuth()
  const { settings } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setMobileOpen(false)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-beesa-pink/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -mr-2 text-gray-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2 mx-auto md:mx-0">
          <span className="text-2xl font-bold bg-gradient-to-r from-beesa-pink to-beesa-lavender bg-clip-text text-transparent">
            {settings.store_name || 'بیسا'}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-gray-600 hover:text-beesa-pink transition-colors whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-beesa-pink transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-beesa-pink transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -left-0.5 bg-beesa-pink text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link to={user ? '/account' : '/login'} className="p-2 text-gray-600 hover:text-beesa-pink transition-colors">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} className="pb-3 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full px-4 py-3 pr-12 bg-beesa-cream rounded-full border border-beesa-pink/20 focus:outline-none focus:border-beesa-pink text-gray-800"
              autoFocus
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-beesa-pink">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  </nav>

  {mobileOpen && (
    <div className="md:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setMobileOpen(false)}>
      <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-beesa-pink">منو</span>
          <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-500">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className="block py-3 px-3 text-gray-700 hover:bg-beesa-pink/10 hover:text-beesa-pink rounded-xl transition-colors">
              {link.label}
            </Link>
          ))}
          <Link to={user ? '/account' : '/login'} onClick={() => setMobileOpen(false)}
            className="block py-3 px-3 text-gray-700 hover:bg-beesa-pink/10 hover:text-beesa-pink rounded-xl transition-colors">
            {user ? 'حساب من' : 'ورود / ثبت‌نام'}
          </Link>
        </div>
      </div>
    </div>
  )}
</>
  )
}
