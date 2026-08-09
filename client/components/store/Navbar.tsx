// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { siteData } from "@/data/siteData";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

/*
  Navbar con dos estados:
  - transparente (solo en Home, cuando scrollY === 0): texto blanco sobre hero
  - sólido (siempre en otras páginas + al hacer scroll en Home): bg blanco, texto oscuro

  Prop `heroMode`: el Home lo pone en true, las demás páginas en false.
  Se controla desde cada page o desde el layout pasando la prop.
*/

export function Navbar({ heroMode = false, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = usePathname();
  const { totalItems } = useCart();
  const { categories } = useStore();
  const searchParams = useSearchParams();
  const currentCat = searchParams?.get("cat") || null;
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleProductsEnter = () => {
    clearTimeout(closeTimer.current);
    setDesktopProductsOpen(true);
  };
  const handleProductsLeave = () => {
    closeTimer.current = setTimeout(() => setDesktopProductsOpen(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  const isActive = (path: string) => location === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = siteData.navbar.items.filter((i) => i.href !== "/carrito");

  /* Colores según estado */
  const textColor = "#C0C0C0";
  const textColorActive = "#FFFFFF";
  const bgStyle = { backgroundColor: "#000000" };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={bgStyle}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              {siteData.company?.logo ? (
                <img
                  src={siteData.company.logo}
                  alt={siteData.business?.name || ""}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <img
                  src="/logotipo.png"
                  alt={siteData.business?.name || "Estética Innova"}
                  className="h-12 w-auto object-contain"
                />
              )}
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isProducts = item.href === "/productos";
                const hasCategories = isProducts && categories.length > 0;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={
                      hasCategories ? handleProductsEnter : undefined
                    }
                    onMouseLeave={
                      hasCategories ? handleProductsLeave : undefined
                    }
                  >
                    <Link
                      href={item.href}
                      className="relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300 group"
                      style={{
                        color: isActive(item.href)
                          ? textColorActive
                          : textColor,
                      }}
                    >
                      {item.label}
                      {hasCategories && (
                        <ChevronDown
                          suppressHydrationWarning
                          className={`w-3.5 h-3.5 transition-transform ${desktopProductsOpen ? "rotate-180" : ""}`}
                        />
                      )}
                      <span
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: isActive(item.href) ? "#FFFFFF" : "transparent",
                        }}
                      />
                    </Link>
                    {hasCategories && (
                      <div
                        className="absolute top-full left-0 mt-6"
                        style={{
                          opacity: desktopProductsOpen ? 1 : 0,
                          transform: desktopProductsOpen
                            ? "translateY(0)"
                            : "translateY(-6px)",
                          pointerEvents: desktopProductsOpen ? "auto" : "none",
                          transition:
                            "opacity 0.15s ease, transform 0.15s ease",
                        }}
                      >
                        <div
                          className="w-48 py-2 rounded-xs"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                          }}
                        >
                          <Link
                            href="/productos"
                            className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary-light)]"
                            style={{
                              color: !currentCat
                                ? "var(--color-text-primary)"
                                : "var(--color-text-secondary)",
                            }}
                          >
                            Todo
                          </Link>
                          {categories.map((cat) => {
                            const isCurrentCat =
                              currentCat === cat.slug ||
                              currentCat === cat.name;
                            return (
                              <Link
                                key={cat.id}
                                href={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                                className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary-light)]"
                                style={{
                                  color: isCurrentCat
                                    ? "var(--color-text-primary)"
                                    : "var(--color-text-secondary)",
                                }}
                              >
                                {cat.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Carrito + hamburger */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2 rounded-xs text-sm font-medium transition-all duration-300 bg-transparent text-[#C0C0C0] md:bg-[var(--color-primary)] md:text-white md:hover:bg-[var(--color-primary-hover)]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:block">Carrito</span>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center bg-[var(--color-accent)] text-white"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-xs transition-colors"
                style={{
                  color: "#C0C0C0",
                }}
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── SIDEBAR MÓVIL ── */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          backgroundColor: "rgba(44,44,44,0.5)",
          backdropFilter: "blur(4px)",
        }}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: "#000000",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header sidebar */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #222222" }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#C0C0C0",
            }}
          >
            {siteData.business?.name || "Estética Innova"}
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xs"
            style={{ color: "#8A8A8A" }}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navLinks.map((item) => {
              const isProducts = item.href === "/productos";
              const hasSubitems = isProducts && categories.length > 0;

              return (
                <li key={item.href}>
                  {hasSubitems ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileProductsOpen(!mobileProductsOpen)
                        }
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xs text-sm font-medium transition-colors"
                        style={{
                          color: isActive(item.href)
                            ? "#FFFFFF"
                            : "#C0C0C0",
                          backgroundColor: isActive(item.href)
                            ? "var(--color-text-primary)"
                            : "transparent",
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{
                              backgroundColor: isActive(item.href)
                                ? "#FFFFFF"
                                : "#666666",
                            }}
                          />
                          {item.label}
                        </span>
                        <ChevronDown
                          suppressHydrationWarning
                          className="w-4 h-4 transition-transform"
                          style={{
                            transform: mobileProductsOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>
                      {mobileProductsOpen && (
                        <div className="ml-6 mt-1 space-y-0.5">
                          <Link
                            href="/productos"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xs text-sm transition-colors"
                            style={{
                              color:
                                !currentCat && isActive(item.href)
                                  ? "#FFFFFF"
                                  : "#C0C0C0",
                              backgroundColor:
                                !currentCat && isActive(item.href)
                                  ? "var(--color-text-primary)"
                                  : "transparent",
                            }}
                          >
                            Todo
                          </Link>
                          {categories.map((cat) => {
                            const isCurrentCat =
                              currentCat === cat.slug ||
                              currentCat === cat.name;
                            return (
                              <Link
                                key={cat.id}
                                href={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xs text-sm transition-colors"
                                style={{
                                  color: isCurrentCat
                                    ? "#FFFFFF"
                                    : "#C0C0C0",
                                  backgroundColor: isCurrentCat
                                    ? "var(--color-text-primary)"
                                    : "transparent",
                                }}
                              >
                                {cat.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xs text-sm font-medium transition-colors"
                      style={{
                        color: isActive(item.href)
                          ? "#FFFFFF"
                          : "#C0C0C0",
                        backgroundColor: isActive(item.href)
                          ? "var(--color-text-primary)"
                          : "transparent",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: isActive(item.href)
                            ? "#FFFFFF"
                            : "#666666",
                        }}
                      />
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA carrito */}
        <div
          className="px-4 pb-8 pt-4"
          style={{ borderTop: "1px solid #222222" }}
        >
          <button
            onClick={() => { onOpenCart(); setIsOpen(false); }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xs font-medium text-sm transition-colors relative"
            style={{
              backgroundImage: "url('/btnbg.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              color: "#000000",
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Ver carrito
            {totalItems > 0 && (
              <span
                className="absolute -top-2 right-3 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center bg-[var(--color-accent)] text-white"
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
