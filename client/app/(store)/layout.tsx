'use client'

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { StoreProvider, useStore } from "@/context/StoreContext"
import { CartProvider } from "@/context/CartContext"
import { CartDrawerProvider, useCartDrawer } from "@/context/CartDrawerContext"
import { Navbar } from "@/components/store/Navbar"
import { Footer } from "@/components/store/Footer"
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton"
import { ScrollToTop } from "@/components/ScrollToTop"
import { StoreBlocked } from "@/components/store/StoreBlocked"
import { CartDrawer } from "@/components/store/CartDrawer"

function StoreInner({ children }: { children: React.ReactNode }) {
  const { store, loading } = useStore()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const status = store?.store_status || "active"
  const { open, openCart, closeCart } = useCartDrawer()

  if (loading) return null
  if (status !== "active") return <StoreBlocked status={status} />

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            backgroundImage: 'url("/fondo-infinito.jpg")',
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto",
            opacity: 0.15,
          }}
        />
        <Suspense fallback={<div className="h-16" />}>
          <Navbar heroMode={isHome} onOpenCart={openCart} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer waveFromColor="#ffffff" />
      </div>
      <FloatingWhatsAppButton />
      <CartDrawer open={open} onClose={closeCart} />
    </CartProvider>
  )
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CartDrawerProvider>
        <StoreInner>{children}</StoreInner>
      </CartDrawerProvider>
    </StoreProvider>
  )
}
