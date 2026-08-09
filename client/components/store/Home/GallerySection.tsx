"use client";
import { Container } from "./Container";

const images = Array.from(
  { length: 9 },
  (_, i) => `/ambientes/ambiente${i + 1}.jpeg`,
);

export function GallerySection() {
  return (
    <section className="relative py-16 md:py-24 bg-[var(--color-background)]">
      <Container>
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-text-primary)] mb-4">
            Galería
          </span>
          <h2
            className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Nuestros productos
          </h2>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Producto Estética Innova ${i + 1}`}
              className="w-full break-inside-avoid rounded-xs"
              loading="lazy"
            />
          ))}
        </div>
      </Container>
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to top, var(--color-primary-light), transparent)",
        }}
      />
    </section>
  );
}
