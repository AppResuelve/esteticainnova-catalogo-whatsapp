export function getWholesaleLevel(pct: number): { color: string; shakeDuration: number } {
  if (pct >= 100) return { color: 'var(--color-primary)', shakeDuration: 3 }
  if (pct <= 33) return { color: '#facc15', shakeDuration: 5 }
  if (pct <= 66) return { color: '#f97316', shakeDuration: 4 }
  return { color: '#ef4444', shakeDuration: 3 }
}
