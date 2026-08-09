"use client";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ButtonPrimary } from "@/components/ui/ui";
import { Container } from "./Container";
import { ArrowRight } from "lucide-react";

const slides = [
  "/hero/imagen1.jpeg",
  "/hero/imagen2.jpeg",
  "/hero/imagen3.jpeg",
  "/hero/imagen4.jpeg",
  "/hero/imagen5.jpeg",
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-screen bg-black overflow-hidden">
      {/* Carrusel — fondo completo */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((src, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] md:flex-[0_0_85%] min-w-0 relative"
            >
              <img
                src={src}
                alt={`Estética Innova ${i + 1}`}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  i === selectedIndex
                    ? "scale-100 opacity-100"
                    : "scale-[0.92] opacity-60"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Título + Botón — encima del carrusel */}
      <div className="relative z-[2] h-full flex flex-col justify-center pointer-events-none">
        <Container className="py-2 md:py-4">
          <div className="max-w-2xl">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.08] text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tu estilo, nuestra
              <br />
              inspiración.
            </h1>
            <Link
              href="/productos"
              className="inline-flex items-center gap-3 p-2 pr-5 pointer-events-auto rounded-xs group cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
              }}
            >
              <span
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xs text-[var(--color-text-primary)] font-semibold text-sm"
                style={{
                  backgroundImage: "url('/btnbg.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                Ver productos
              </span>
              <ArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Dots indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60 w-2.5"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
