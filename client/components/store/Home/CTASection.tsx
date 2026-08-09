"use client";
import Link from "next/link";
import { Container } from "./Container";
import { SparkleStar } from "./SparkleStar";
import { SparkleStarOutline } from "./SparkleStarOutline";
import { useStore } from "@/context/StoreContext";
import { MessageCircle, ArrowRight } from "lucide-react";

export function CTASection() {
  const { store } = useStore();
  const whatsappNumber = (store?.whatsapp_number || "").replace(/\D/g, "");

  return (
    <section
      className="relative h-[450px] md:h-[550px] flex items-center bg-cover bg-center bg-no-repeat max-w-7xl mx-auto rounded-xs"
      style={{
        backgroundImage: "url('/home/bgcta.webp')",
        boxShadow: "0 0 40px rgba(0,0,0,0.3)",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <Container>
        <div className="relative text-center max-w-2xl mx-auto">
          <SparkleStar
            size={24}
            className="absolute -top-2 -right-6 md:right-[-40px]"
          />
          <SparkleStarOutline
            size={18}
            className="absolute top-4 -right-10 md:right-[-52px]"
          />
          <h2
            className="text-3xl md:text-5xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ¿Necesitás asesoramiento?
          </h2>
          {whatsappNumber && (
            <Link
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola! Me gustaría recibir asesoramiento.")}`}
              className="inline-flex items-center gap-3 p-2 pr-5 rounded-xs group cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
              }}
            >
              <span
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xs text-[var(--color-text-primary)] font-semibold text-sm"
                style={{
                  backgroundImage: "url('/btnbg.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <MessageCircle className="w-5 h-5" />
                Escribinos por WhatsApp
              </span>
              <ArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
