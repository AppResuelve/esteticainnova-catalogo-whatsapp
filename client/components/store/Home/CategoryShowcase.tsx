"use client";
import Link from "next/link";
import { Container } from "./Container";
import { ButtonDark } from "@/components/ui/ui";
import { SparkleStar } from "./SparkleStar";
import { SparkleStarOutline } from "./SparkleStarOutline";

const categories = [
  {
    name: "Peluquería",
    href: "/productos?cat=peluqueria",
    image: "/home/peluqueria.jpeg",
    description:
      "Shampoo, acondicionador, tratamientos capilares y más para el cuidado de tu cabello.",
  },
  {
    name: "Barbería",
    href: "/productos?cat=barberia",
    image: "/home/barberia.jpeg",
    description:
      "Productos especializados para el cuidado de la barba y el afeitado.",
  },
  {
    name: "Maquillaje",
    href: "/productos?cat=maquillaje",
    image: "/home/makeup.jpeg",
    description:
      "Base, rimel, labial, paletas y todo lo que necesitás para lucir increíble.",
  },
  {
    name: "Cosmética",
    href: "/productos?cat=cosmetica",
    image: "/home/uñas.jpeg",
    description:
      "Cremas, serums, protección solar y productos para el cuidado de tu piel.",
  },
  {
    name: "Skincare",
    href: "/productos?cat=skincare",
    image: "/home/skincare.jpeg",
    description:
      "Limpieza, exfoliación, hidratación y rutinas para cada tipo de piel.",
  },
];

export function CategoryShowcase() {
  const featured = categories[0];
  const rest = categories.slice(1);

  return (
    <section className="pb-16 md:pb-24 bg-transparent">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Destacada — full width, bg negro, texto invertido */}
          <div
            className="md:col-span-2 p-2 md:p-4"
            style={{
              background:
                "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
            }}
          >
            <div className="relative flex flex-col bg-[var(--color-text-primary)] p-4 md:p-6">
              <SparkleStar
                size={22}
                color="var(--color-accent)"
                className="absolute top-4 right-4"
              />
              <SparkleStarOutline
                size={16}
                stroke="var(--color-accent)"
                className="absolute top-2 right-10"
              />
              <Link href={featured.href}>
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="w-full h-[280px] md:h-[450px] object-cover"
                />
              </Link>
              <h3
                className="text-3xl md:text-4xl font-light text-white mt-4 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {featured.name}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-3 max-w-lg">
                {featured.description}
              </p>
              <Link
                href={featured.href}
                className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
              >
                Ver {featured.name.toLowerCase()}
              </Link>
            </div>
          </div>

          {/* Resto — 2 cols, sin rounded, 20px menos de height */}
          {rest.map((cat) => (
            <div
              key={cat.name}
              className="relative flex flex-col p-2"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
              }}
            >
              <SparkleStar
                size={18}
                className="absolute top-3 right-3"
              />
              <SparkleStarOutline
                size={12}
                className="absolute top-1 right-8"
              />
              <Link href={cat.href}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-[200px] md:h-[300px] object-cover"
                />
              </Link>
              <h3
                className="text-2xl md:text-3xl font-light text-[var(--color-text-primary)] mt-4 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cat.name}
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-3 max-w-md">
                {cat.description}
              </p>
              <ButtonDark
                href={cat.href}
                className="w-fit"
                style={{
                  backgroundImage: "none",
                  backgroundColor: "transparent",
                }}
              >
                Ver {cat.name.toLowerCase()}
              </ButtonDark>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
