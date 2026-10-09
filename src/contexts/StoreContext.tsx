import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../lib/api'

interface StoreContextType {
  settings: Record<string, string>
  loading: boolean
}

const StoreContext = createContext<StoreContextType>({ settings: {}, loading: true })

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <StoreContext.Provider value={{ settings, loading }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
