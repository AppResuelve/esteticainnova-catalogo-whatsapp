'use client'

import { createContext, useContext, useState } from 'react'

const CartDrawerContext = createContext<any>(null)

export function CartDrawerProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openCart = () => setOpen(true)
  const closeCart = () => setOpen(false)

  return (
    <CartDrawerContext.Provider value={{ open, openCart, closeCart }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  return useContext(CartDrawerContext)
}
