"use client";
import { useMemo } from "react";
import { Container } from "./Container";
import { ProductCarousel } from "@/components/shared/ProductCarousel";
import { useStore } from "@/context/StoreContext";

export function FeaturedProducts() {
  const { productsMap } = useStore();

  const products = useMemo(() => {
    const tagged = Object.values(productsMap)
      .filter((p: any) =>
        p.tagValues?.some(
          (tv: any) => tv.tag?.name?.toLowerCase() === "destacados",
        ),
      )
      .slice(0, 10);

    if (tagged.length > 0) return tagged;

    return Object.values(productsMap)
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 6);
  }, [productsMap]);

  if (products.length === 0) return null;

  return (
    <Container>
      <ProductCarousel products={products} className="mb-8" />
    </Container>
  );
}
