import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/account'
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true); setError('')
      await login(phone, password)
      navigate(from)
    } catch (err: any) { setError(err.message || 'خطا در ورود') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-center mb-2">ورود به حساب</h1>
        <p className="text-gray-500 text-center text-sm mb-6">خوش آمدید به بیسا 💗</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">شماره موبایل</label>
            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xxxxxxxxx" dir="ltr" required />
          </div>
          <div>
            <label className="label-field">رمز عبور</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          حساب ندارید؟ <Link to="/register" className="text-beesa-pink hover:underline">ثبت‌نام کنید</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-4">
          <Link to="/admin/login" className="hover:text-beesa-pink">ورود مدیر</Link>
        </p>
      </div>
    </div>
  )
}
