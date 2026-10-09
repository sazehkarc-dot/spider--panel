import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextType>(null as any)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('beesa_cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('beesa_cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === item.product_id)
      if (existing) {
        return prev.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: number) =>
    setItems(prev => prev.filter(i => i.product_id !== productId))

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) return removeItem(productId)
    setItems(prev => prev.map(i =>
      i.product_id === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
    ))
  }

  const clearCart = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) =>
    sum + (i.discount_price || i.price) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
