// @ts-nocheck
'use client'
// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Check, ShoppingCart } from "lucide-react";
import DOMPurify from "dompurify";
import { content } from "@/data/siteData";
import { useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { ProductGallery } from "@/components/store/ProductGallery";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/utils/formatPrice";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuantitySelector } from "@/components/store/QuantitySelector";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();
  const { openCart } = useCartDrawer();
  const [justAdded, setJustAdded] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  const [localQuantity, setLocalQuantity] = useState(1);

  const categoryId = product?.categoryId;
  const { products: relatedProducts } = useRelatedProducts(
    categoryId,
    product?.id,
  );

  const skus = useMemo(() => product?.skus || [], [product])

  const attributeGroups = useMemo(() => {
    const groups = {}
    skus.forEach(sku => {
      sku.attributeValues.forEach(av => {
        if (!av.attribute) return
        const aId = av.attribute.id
        if (!groups[aId]) groups[aId] = { name: av.attribute.name, ids: [], valueMap: {} }
        if (!groups[aId].valueMap[av.id]) {
          groups[aId].ids.push(av.id)
          groups[aId].valueMap[av.id] = av.value
        }
      })
    })
    return Object.entries(groups).map(([aId, g]) => ({
      attributeId: Number(aId),
      name: g.name,
      ids: g.ids,
      valueMap: g.valueMap,
    }))
  }, [skus])

  const derivedSku = useMemo(() => {
    const selected = Object.values(selectedValues).filter(Boolean)
    if (!selected.length) return skus[0]
    return skus.find(sku =>
      selected.every(vId => sku.attributeValues.some(av => av.id === vId))
    ) || skus[0]
  }, [skus, selectedValues])

  const price = derivedSku ? derivedSku.retailPrice : product?.retailPrice
  const wholesalePrice = derivedSku?.wholesalePrice ?? product?.wholesalePrice
  const wholesaleMinQty = derivedSku?.wholesaleMinQty ?? product?.wholesaleMinQty
  const hasWholesale = wholesalePrice && wholesaleMinQty

  const displayImages = useMemo(() => {
    const baseImages = product?.images || []
    if (!derivedSku) return baseImages
    const attrImages = (derivedSku.attributeValues || [])
      .flatMap(av => av.images || [])
      .filter(Boolean)
    return [...attrImages, ...baseImages]
  }, [derivedSku, product])

  // Auto-seleccionar primer valor de cada grupo
  useEffect(() => {
    if (!attributeGroups.length || Object.keys(selectedValues).length) return
    const init = {}
    attributeGroups.forEach(g => { if (g.ids.length > 0) init[g.attributeId] = g.ids[0] })
    setSelectedValues(init)
  }, [attributeGroups])

  const related = relatedProducts
    .filter((p) => String(p.id) !== String(product?.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product.id, localQuantity, derivedSku?.id)
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleAddWholesale = () => {
    const qty = wholesaleMinQty || product.wholesaleMinQty
    addItem(product.id, qty, derivedSku?.id)
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const quantity = getItemQuantity(product.id);
  const hasDiscount = product.discountPercentage;

  return (
    <section
      className="pb-24 px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: "5rem" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Back link ── */}
        <button
          onClick={() => {
            if (document.referrer && document.referrer.startsWith(window.location.origin)) {
              router.back()
            } else {
              const slug = product.category?.slug
              router.push(slug ? `/productos?cat=${slug}` : '/productos')
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-10 group transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-muted)")
          }
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {content.productDetail.backTo}
        </button>

        {/* ── Grid principal ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Galería */}
          <ProductGallery
            images={displayImages}
            productName={product.name}
            discountPercentage={hasDiscount ? product.discountPercentage : null}
          />

          {/* Info */}
          <div>
            {/* Categoría */}
            {product.category && (
              <div className="mb-5">
                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Nombre */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--color-text-primary)",
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>

            {/* Descripción corta */}
            {product.shortDescription && (
              <p
                className="mb-6 leading-relaxed"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                {product.shortDescription}
              </p>
            )}

            {/* Línea decorativa */}
            <div className="flex items-center gap-3 mb-6" aria-hidden="true">
              <div
                className="h-px w-8"
                style={{ backgroundColor: "var(--color-lila)", opacity: 0.6 }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)", opacity: 0.6 }}
              />
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            </div>

            {/* Selector de variantes por atributo */}
            {attributeGroups.length >= 1 && (
              <div className="mb-4 space-y-4">
                {attributeGroups.map(group => (
                  <div key={group.attributeId}>
                    <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>{group.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.ids.map(vId => {
                        const selected = selectedValues[group.attributeId] === vId
                        return (
                          <button
                            key={vId}
                            onClick={() => setSelectedValues(prev => ({ ...prev, [group.attributeId]: vId }))}
                            className="text-xs px-3 py-1.5 rounded-xs border transition-all"
                            style={{
                              borderColor: selected ? "var(--color-text-primary)" : "var(--color-border)",
                              backgroundColor: selected ? "var(--color-text-primary)" : "transparent",
                              color: selected ? "#ffffff" : "var(--color-text-secondary)",
                            }}
                          >
                            {group.valueMap[vId]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Precio minorista */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {formatPrice(price)}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  x 1 u.
                </span>
              </div>
              {product.discountPercentage && product.comparePrice && (
                <span
                  className="text-base line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Precio mayorista */}
            {hasWholesale && (
              <div
                className="mt-4 mb-6 p-4 rounded-xs"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  border: "1px solid var(--color-lila)",
                }}
              >
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Precio mayorista · a partir de {wholesaleMinQty}{" "}
                  unidades
                </p>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {formatPrice(wholesalePrice)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    x 1 u.
                  </span>
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-xs font-medium flex items-center gap-1.5 mb-3"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Tag className="w-3.5 h-3.5" />
                  {content.productDetail.tagsLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción larga */}
            {product.description && (
              <div
                className="markdown mb-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
              />
            )}

            {/* QuantitySelector */}
            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>Cantidad</p>
              <QuantitySelector
                quantity={localQuantity}
                onIncrease={() => setLocalQuantity(prev => Math.min(prev + 1, 99))}
                onDecrease={() => setLocalQuantity(prev => Math.max(prev - 1, 1))}
                min={1}
                max={99}
              />
            </div>

            {/* Botón principal */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{
                borderRadius: "2px",
                backgroundImage: justAdded ? "none" : "url('/btnbg.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundColor: justAdded ? "var(--color-accent)" : "transparent",
                color: "var(--color-text-primary)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  {content.productDetail.addedToCart}
                </>
              ) : (
                <>
                  {content.productDetail.addToCart}
                  {quantity > 0 && ` (${quantity} en carrito)`}
                </>
              )}
            </button>

            {/* Ver carrito */}
            <button
              onClick={openCart}
              className="flex items-center justify-center gap-2 w-full px-8 py-3 font-medium text-sm transition-all duration-200 mt-2"
              style={{
                color: "var(--color-text-secondary)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Ver carrito
            </button>

            {/* Botón mayorista — outline pill */}
            {hasWholesale && (
              <button
                onClick={handleAddWholesale}
                className="flex items-center justify-center gap-2 w-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 mt-3"
                style={{
                  borderRadius: "2px",
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-text-primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-primary)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
              >
                Agregar por {wholesaleMinQty} u. (mayorista)
              </button>
            )}
          </div>
        </div>

        {/* ── Productos relacionados ── */}
        {related.length > 0 && (
          <>
            {/* Header de sección minimalista */}
            <div className="mb-8">
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase block mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                También te puede gustar
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                }}
              >
                {content.productDetail.relatedTitle}
              </h2>
            </div>
            <ProductGrid products={related} />
          </>
        )}
      </div>
    </section>
  );
}
