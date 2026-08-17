// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button, Input } from '@/components/admin/ui/Form'
import { Card } from '@/components/admin/ui/Card'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { Spinner } from '@/components/admin/ui/Spinner'
import api from '@/services/admin-api'

const DEFAULTS = {
  wholesale_discount_enabled: false,
  wholesale_discount_min_amount: 0,
  wholesale_discount_percentage: 0,
  wholesale_discount_count_discounted: false,
  wholesale_discount_apply_to_discounted: false,
}

export default function DiscountsPage() {
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => setForm((prev) => ({ ...prev, ...data })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const payload = {
        wholesale_discount_enabled: !!form.wholesale_discount_enabled,
        wholesale_discount_min_amount: Number(form.wholesale_discount_min_amount) || 0,
        wholesale_discount_percentage: Number(form.wholesale_discount_percentage) || 0,
        wholesale_discount_count_discounted: !!form.wholesale_discount_count_discounted,
        wholesale_discount_apply_to_discounted: !!form.wholesale_discount_apply_to_discounted,
      }
      await api.put('/admin/settings', payload)
      setMessage('Descuento mayorista guardado')
    } catch {
      setMessage('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner />
      </div>
    )
  }

  const countDiscounted = !!form.wholesale_discount_count_discounted

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Descuentos</h1>
          <p className="text-sm text-zinc-500">Descuento mayorista sobre el total del carrito</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="pb-24 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Descuento mayorista</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Aplicá un porcentaje de descuento cuando el carrito supere un monto mínimo.
            </p>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <Checkbox
                  checked={!!form.wholesale_discount_enabled}
                  onChange={(e) => setField('wholesale_discount_enabled', e.target.checked)}
                />
                Activar descuento mayorista
              </label>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monto mínimo ($)"
                  type="number"
                  min="0"
                  value={form.wholesale_discount_min_amount || ''}
                  onChange={(e) => setField('wholesale_discount_min_amount', e.target.value)}
                  placeholder="Ej: 50000"
                />
                <Input
                  label="Porcentaje de descuento (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={form.wholesale_discount_percentage || ''}
                  onChange={(e) => setField('wholesale_discount_percentage', e.target.value)}
                  placeholder="Ej: 10"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Productos con descuento individual</h2>
            <p className="text-sm text-zinc-500 mb-4">
              Definí cómo participan del descuento mayorista los productos que ya tienen un descuento propio.
            </p>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <Checkbox
                  checked={countDiscounted}
                  onChange={(e) => setField('wholesale_discount_count_discounted', e.target.checked)}
                />
                Cuentan para alcanzar el monto mínimo
              </label>

              {countDiscounted && (
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer pl-6">
                  <Checkbox
                    checked={!!form.wholesale_discount_apply_to_discounted}
                    onChange={(e) => setField('wholesale_discount_apply_to_discounted', e.target.checked)}
                  />
                  Reciben el descuento mayorista
                </label>
              )}
            </div>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 justify-end items-center px-4 pb-8 pt-4 lg:p-0 lg:mt-6 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 lg:border-0 lg:bg-transparent z-20">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          {message && (
            <span className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
