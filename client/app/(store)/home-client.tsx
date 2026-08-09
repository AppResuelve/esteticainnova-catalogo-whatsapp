"use client";
import { Container } from "@/components/store/Home/Container";
import { Hero } from "@/components/store/Home/Hero";
import { SectionTitle } from "@/components/store/Home/SectionTitle";
import { CategoryShowcase } from "@/components/store/Home/CategoryShowcase";
import { FeaturedProducts } from "@/components/store/Home/FeaturedProducts";
import { BenefitsSection } from "@/components/store/Home/BenefitsSection";
import { CTASection } from "@/components/store/Home/CTASection";

export default function HomeClient() {
  return (
    <main className="store-home-bg md:pb-12">
      <Hero />

      <Container>
        <SectionTitle
          title="Productos más vendidos"
          sparkle="right"
        />
      </Container>
      <FeaturedProducts />

      <BenefitsSection />

      <Container>
        <SectionTitle
          title="Encontrá todo lo que necesitás para tu cuidado personal"
          sparkle="left"
        />
      </Container>
      <CategoryShowcase />

      <CTASection />
    </main>
  );
}
