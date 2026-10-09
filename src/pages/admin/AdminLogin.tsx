import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true); setError('')
      await login(phone, password)
      navigate('/admin')
    } catch (err: any) { setError(err.message || 'خطا در ورود') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">پنل مدیریت بیسا</h1>
        <p className="text-gray-500 text-center text-sm mb-6">برای ورود اطلاعات خود را وارد کنید</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">شماره موبایل</label>
            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xxxxxxxxx" dir="ltr" required />
          </div>
          <div>
            <label className="label-field">رمز عبور</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">پیش‌فرض: 09123456789 / admin123</p>
        <Link to="/" className="block text-center text-sm text-gray-500 hover:text-beesa-pink mt-4">← بازگشت به فروشگاه</Link>
      </div>
    </div>
  )
}
