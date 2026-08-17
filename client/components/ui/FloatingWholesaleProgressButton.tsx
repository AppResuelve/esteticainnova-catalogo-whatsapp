'use client'

import { Flame } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCartDrawer } from '@/context/CartDrawerContext'
import { getWholesaleLevel } from '@/utils/wholesaleLevel'

export function FloatingWholesaleProgressButton({ className = '' }) {
  const { wholesale, totalItems } = useCart()
  const { openCart } = useCartDrawer()

  if (
    !wholesale ||
    !wholesale.enabled ||
    wholesale.minAmount <= 0 ||
    wholesale.percentage <= 0 ||
    totalItems <= 0
  ) {
    return null
  }

  const pct = Math.max(0, Math.min(100, wholesale.progress.pct))
  const { color, shakeDuration } = getWholesaleLevel(pct)
  const isComplete = pct >= 100

  return (
    <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
      {isComplete && (
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            inset: '-3px',
            backgroundColor: 'var(--color-secondary)',
            animation: 'wholesale-ring-pulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      <button
        onClick={openCart}
        className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-surface)',
          animation: `wholesale-shake ${shakeDuration}s ease-in-out infinite`,
        }}
        aria-label="Progreso del descuento mayorista"
        title={`${Math.round(pct)}% del descuento mayorista`}
      >
        {/* Relleno tipo agua desde abajo */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
          style={{
            height: `${pct}%`,
            backgroundColor: color,
          }}
        />

        {/* Ícono de oferta por encima del relleno */}
        <span
          className="relative z-10 flex items-center justify-center w-full h-full"
          style={{ color: isComplete ? 'var(--color-secondary)' : '#000000' }}
        >
          <Flame className="w-6 h-6" fill="currentColor" />
        </span>
      </button>
    </div>
  )
}
