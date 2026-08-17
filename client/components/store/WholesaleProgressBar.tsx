'use client'

import { formatPrice } from '@/utils/formatPrice'
import { getWholesaleLevel } from '@/utils/wholesaleLevel'

export function WholesaleProgressBar({ wholesale }) {
  if (!wholesale || !wholesale.enabled || wholesale.minAmount <= 0 || wholesale.percentage <= 0) {
    return null
  }

  const { progress, eligible, percentage } = wholesale
  const remaining = progress.remaining
  const { color } = getWholesaleLevel(progress.pct)

  return (
    <div className="w-full">
      <p
        className="text-xs mb-1.5"
        style={{ color: eligible ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
      >
        {eligible
          ? `¡Descuento del ${percentage}% aplicado!`
          : `Te faltan ${formatPrice(remaining)} para obtener ${percentage}% de descuento`}
      </p>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress.pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
