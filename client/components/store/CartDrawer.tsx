'use client'

import Link from 'next/link'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatPrice'
import { WholesaleProgressBar } from './WholesaleProgressBar'

export function CartDrawer({ open, onClose }) {
  const { items, totalItems, totalPrice, wholesale, removeItem, clearCart } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Tu pedido
            </h3>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-xs"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-text-primary)',
              }}
            >
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xs transition-colors hover:bg-[var(--color-border)]/50"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart
                className="w-12 h-12 mb-4"
                style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}
              />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Tu pedido está vacío
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Agregá productos desde el catálogo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xs"
                  style={{
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                  }}
                >
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xs shrink-0"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xs shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary-light)' }}
                    >
                      <ShoppingCart className="w-6 h-6" style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium line-clamp-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {item.variantLabel}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {item.quantity}x {formatPrice(item.unitPrice)}
                      </span>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 self-start text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="mb-4">
              <WholesaleProgressBar wholesale={wholesale} />
            </div>

            {wholesale?.eligible && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Descuento mayorista
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                  -${wholesale.discountAmount.toLocaleString('es-AR')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Total
              </span>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                ${(wholesale?.finalTotal ?? totalPrice).toLocaleString('es-AR')}
              </span>
            </div>

            <Link
              href="/carrito"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xs font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
