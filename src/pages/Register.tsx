import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('رمز عبور حداقل ۶ کاراکتر باشد'); return }
    try {
      setLoading(true); setError('')
      await register(form)
      navigate('/account')
    } catch (err: any) { setError(err.message || 'خطا در ثبت‌نام') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-center mb-2">ثبت‌نام</h1>
        <p className="text-gray-500 text-center text-sm mb-6">به خانواده بیسا بپیوندید 💗</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">نام و نام خانوادگی</label>
            <input className="input-field" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="نام کامل" />
          </div>
          <div>
            <label className="label-field">شماره موبایل</label>
            <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" required />
          </div>
          <div>
            <label className="label-field">رمز عبور</label>
            <input type="password" className="input-field" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="حداقل ۶ کاراکتر" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'در حال ثبت...' : 'ثبت‌نام'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          حساب دارید؟ <Link to="/login" className="text-beesa-pink hover:underline">ورود</Link>
        </p>
      </div>
    </div>
  )
}
