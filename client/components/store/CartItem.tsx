'use client'
import { X } from 'lucide-react'
import Link from 'next/link'
import { QuantitySelector } from './QuantitySelector'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatPrice'
import { optimizeImageUrl } from '@/utils/imageUrl'

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  const hasWholesale = item.wholesalePrice && item.wholesaleMinQty
  const usesWholesale = hasWholesale && item.quantity >= item.wholesaleMinQty

  return (
    <div className="flex gap-4 p-4 rounded-xs border border-[var(--color-border)] bg-[var(--color-card)]">
      <Link href={`/productos/${item.slug}`} className="shrink-0">
        <img
          src={optimizeImageUrl(item.images[0])}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xs"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            href={`/productos/${item.slug}`}
            className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          {item.variantLabel && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {item.variantLabel}
            </p>
          )}
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {formatPrice(item.unitPrice)} c/u
          {usesWholesale && (
            <span className="ml-2 text-[var(--color-text-primary)] font-medium">(mayorista)</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          />

          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            {formatPrice(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
