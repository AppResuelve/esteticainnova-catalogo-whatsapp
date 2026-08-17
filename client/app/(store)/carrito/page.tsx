// @ts-nocheck
'use client'
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";
import { ButtonPrimary } from "@/components/ui/ui";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/store/CartItem";
import { ordersService } from "@/services/storeService";
import { WholesaleProgressBar } from "@/components/store/WholesaleProgressBar";
import { CheckoutModal, DeliveryFormModal } from "@/components/store/CheckoutModal";

function ThinLine({ className = "", style = {} }) {
  return (
    <div
      className={`h-px ${className}`}
      style={{ backgroundColor: "var(--color-border)", ...style }}
    />
  );
}

/* ── Estado vacío ─────────────────────────────────────────────────────── */
function CartEmpty({ emptyTitle, emptyMessage, browseProducts }) {
  const router = useRouter();
  return (
    <>
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pb-8 md:pb-20"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
        }}
      >
        <div className="relative max-w-7xl mx-auto">
          <button
            onClick={() => {
              if (document.referrer && document.referrer.startsWith(window.location.origin)) router.back()
              else router.push('/productos')
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {content.productDetail.backTo}
          </button>
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-text-primary)] mb-3">
              Carrito
            </span>
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight text-[var(--color-text-primary)] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {emptyTitle}
            </h1>
            <ThinLine className="w-16 my-4" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="w-28 h-28 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center">
              <ShoppingCart
                className="w-12 h-12 text-[var(--color-primary)]"
                style={{ opacity: 0.5 }}
              />
            </div>
          </div>

          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            {emptyMessage}
          </p>
          <ButtonPrimary
            href="/productos"
          >
            {browseProducts}
          </ButtonPrimary>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CART PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Cart() {
  const { items, totalItems, totalPrice, wholesale } = useCart();
  const {
    title,
    emptyTitle,
    emptyMessage,
    browseProducts,
    itemCount,
    subtotal,
    total,
    requestQuote,
  } = content.cart;
  const { store, loading } = useStore();
  const router = useRouter();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDeliveryFormOpen, setIsDeliveryFormOpen] = useState(false);

  const finalTotal = wholesale?.finalTotal ?? totalPrice

  if (loading) {
    return (
      <section className="bg-white min-h-[60vh] flex items-center justify-center px-4 py-24">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center animate-pulse">
              <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Cargando...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0)
    return (
      <CartEmpty
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        browseProducts={browseProducts}
      />
    );

  const generateWhatsAppMessage = (deliveryInfo?: { type: "pickup" | "delivery"; name?: string; address?: string }) => {
    const itemsList = items
      .map(
        (item) =>
          `🌸 ${item.quantity}x ${item.name} — ${formatPrice(item.unitPrice)} c/u`,
      )
      .join("\n");

    let deliveryLine = "";
    if (deliveryInfo) {
      deliveryLine = deliveryInfo.type === "pickup"
        ? "\n\n📦 *Retiro en local*"
        : `\n\n🚚 *Envío a domicilio*\n📍 ${deliveryInfo.name} — ${deliveryInfo.address}`;
    }

    const message = `Hola, me interesa consultar por un producto de ${store?.business_name || 'Estética Innova'}:\n\n${itemsList}${deliveryLine}\n\n💰 *Total: $${finalTotal.toLocaleString("es-AR")}*`;
    return encodeURIComponent(message);
  };

  const openWhatsApp = (message) => {
    const whatsappLink = `https://wa.me/${(store?.whatsapp_number || "").replace(/\D/g, "")}?text=${message}`;
    window.open(whatsappLink, "_blank");
  };

  const handleRequest = () => {
    setIsCheckoutOpen(true);
  };

  const handlePickup = () => {
    setIsCheckoutOpen(false);
    const message = generateWhatsAppMessage({ type: "pickup" });
    openWhatsApp(message);
    ordersService.create({
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.unitPrice,
        qty: i.quantity,
      })),
      total: finalTotal,
    }).catch(() => {});
  };

  const handleDelivery = () => {
    setIsCheckoutOpen(false);
    setIsDeliveryFormOpen(true);
  };

  const handleConfirmDelivery = (name: string, address: string) => {
    setIsDeliveryFormOpen(false);
    const message = generateWhatsAppMessage({ type: "delivery", name, address });
    openWhatsApp(message);
    ordersService.create({
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.unitPrice,
        qty: i.quantity,
      })),
      total: finalTotal,
    }).catch(() => {});
  };

  return (
    <>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirmDelivery={handleDelivery}
        onConfirmPickup={handlePickup}
      />
      <DeliveryFormModal
        isOpen={isDeliveryFormOpen}
        onClose={() => setIsDeliveryFormOpen(false)}
        onConfirm={handleConfirmDelivery}
        onBack={() => {
          setIsDeliveryFormOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* ══ HERO — crema floral ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pb-4 md:pb-12"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("/fondo-infinito.jpg")',
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto",
            opacity: 0.15,
          }}
        />

        <div className="relative max-w-6xl mx-auto z-10">
          <button
            onClick={() => {
              if (document.referrer && document.referrer.startsWith(window.location.origin)) router.back()
              else router.push('/productos')
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {content.productDetail.backTo}
          </button>

          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-text-primary)] mb-2">
                Carrito
              </span>
              <h1
                className="text-4xl md:text-5xl font-normal tracking-tight text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {title}
              </h1>
            </div>
            <div
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 mb-1 text-sm font-semibold text-[var(--color-text-primary)]"
              style={{
                backgroundColor: "var(--color-primary-light)",
                borderRadius: "2px",
                color: "var(--color-text-primary)",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount.replace("{count}", totalItems)}
            </div>
          </div>

          <img src="/guarda-hojas.png" alt="" className="w-48" />
        </div>
      </section>

      {/* ══ CONTENIDO ══ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* ── Items ── */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
              <Link
                href="/productos"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                {content.cart.continueShopping}
              </Link>
            </div>

            {/* ── Resumen ── */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-24 rounded-xs border overflow-hidden"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
              >
                <div className="px-6 pt-6 pb-4">
                  <h3
                    className="text-lg font-normal text-[var(--color-text-primary)] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Resumen
                  </h3>
                  <ThinLine className="w-10 mb-6" />

                  <div className="mb-5">
                    <WholesaleProgressBar wholesale={wholesale} />
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {subtotal}
                    </span>
                    <span className="text-sm text-[var(--color-text-primary)]">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {wholesale?.eligible && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        Descuento mayorista
                      </span>
                      <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
                        -${wholesale.discountAmount.toLocaleString("es-AR")}
                      </span>
                    </div>
                  )}

                  <ThinLine className="my-4" />

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {total}
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      ${finalTotal.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <ButtonPrimary
                    onClick={handleRequest}
                    className="w-full"
                  >
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {requestQuote}
                  </ButtonPrimary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
