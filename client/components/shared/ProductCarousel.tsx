import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";

export function ProductCarousel({ products, className = "" }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, products]);

  if (!products.length) return null;

  return (
    <div className={`relative group/carousel ${className}`}>
      <div
        ref={emblaRef}
        className="overflow-hidden py-6 px-12"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div className="flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-full md:w-1/2 lg:w-1/3 px-2 h-[420px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md"
          style={{
            backgroundColor: "var(--color-text-primary)",
            color: "#ffffff",
          }}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md"
          style={{
            backgroundColor: "var(--color-text-primary)",
            color: "#ffffff",
          }}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
