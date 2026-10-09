import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, setToken } from '../lib/api'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  register: (data: { phone: string; password: string; full_name?: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null as any)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('beesa_token')
    if (token) {
      api.getMe()
        .then(u => setUser(u))
        .catch(() => setToken(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (phone: string, password: string) => {
    const { user, token } = await api.login({ phone, password })
    setToken(token)
    setUser(user)
  }

  const register = async (data: { phone: string; password: string; full_name?: string }) => {
    const { user, token } = await api.register(data)
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
