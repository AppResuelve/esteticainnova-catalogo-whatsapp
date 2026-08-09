"use client";
import { Container } from "./Container";

export function StorySection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-secondary-light)]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <span className="inline-block text-lg font-medium tracking-[0.2em] uppercase text-[var(--color-text-primary)] mb-4">
              Sobre nosotros
            </span>
            <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                Estética Innova nace con la misión de ofrecer productos de calidad para el cuidado personal.
                Trabajamos con las mejores marcas para que encuentres todo lo que necesitás en un solo lugar.
              </p>
              <p>
                Creemos que cada persona merece sentirse bien consigo misma. Por eso, seleccionamos cuidadosamente
                cada producto para ofrecerte lo mejor en peluquería, barbería, maquillaje, cosmética y skincare.
              </p>
            </div>
          </div>
          <div>
            <img
              src="/home/taller2.jpeg"
              alt="Estética Innova - Local"
              className="w-full h-[350px] md:h-[500px] rounded-xs object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
