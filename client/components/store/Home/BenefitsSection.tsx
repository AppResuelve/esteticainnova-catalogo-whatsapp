'use client'
import { Container } from './Container'
import { Truck, Banknote, Sparkles, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Hacemos envíos',
    description: 'Recibí tu pedido en la comodidad de tu hogar.',
  },
  {
    icon: Banknote,
    title: 'Efectivo y transferencia',
    description: 'Pagá con efectivo o transferencia bancaria.',
  },
  {
    icon: Sparkles,
    title: 'Marcas premium',
    description: 'Trabajamos con las mejores marcas del mercado para garantizarte productos de alta calidad.',
  },
  {
    icon: Headphones,
    title: 'Asesoramiento personalizado',
    description: 'Te ayudamos a encontrar los productos ideales según tu tipo de piel, cabello y estilo de vida.',
  },
]

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-surface)]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-4">
              {b.icon && (
                <div className="shrink-0 w-10 h-10 rounded-xs bg-[var(--color-primary-light)] flex items-center justify-center" style={{ border: "2px solid var(--color-secondary)" }}>
                  <b.icon className="w-5 h-5 text-[var(--color-text-primary)]" />
                </div>
              )}
              <div>
                <h3
                  className="text-xl md:text-2xl font-light text-[var(--color-text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {b.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
