export const siteData = {
  navbar: {
    logoOnly: false,
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos' },
      { label: 'Carrito', href: '/carrito', showCartCount: true },
      { label: 'Contacto', href: '/contacto' },
    ],
    ctaText: 'Ver carrito',
  },

  footer: {
    columns: [
      {
        title: 'Navegación',
        links: [
          { label: 'Inicio', href: '/' },
          { label: 'Productos', href: '/productos' },
          { label: 'Carrito', href: '/carrito' },
          { label: 'Contacto', href: '/contacto' },
        ],
      },
    ],
  },

  cart: {
    persistenceEnabled: true,
    persistenceKey: 'esteticainnova-cart',
    showDeliveryModal: false,
  },
}

export const content = {
  home: {
    hero: {
      badge: 'Estética Innova',
      title: 'Tu estilo, nuestra',
      highlightedText: 'inspiración',
      subtitle:
        'Productos de peluquería, maquillaje, cosmética y skincare para cuidarte todos los días.',
      primaryButtonText: 'Ver productos',
      primaryButtonLink: '/productos',
      secondaryButtonText: 'Consultar',
      secondaryButtonLink: '/contacto',
    },
    featuredTitle: 'Destacados',
    featuredSubtitle: 'Nuestros productos más elegidos',
    categoriesTitle: 'Categorías',
    categoriesSubtitle: 'Explorá por tipo de producto',
    cta: {
      title: '¿Necesitás asesoramiento?',
      subtitle: 'Te ayudamos a encontrar los productos ideales para tu tipo de piel y estilo.',
      buttonText: 'Consultar',
      buttonLink: '/contacto',
    },
  },

  products: {
    badge: 'Catálogo',
    title: 'Nuestros productos',
    subtitle: 'Encontrá lo que buscás',
    noResults: 'No hay productos que coincidan con tu búsqueda.',
    clearFilters: 'Limpiar filtros',
  },

  productDetail: {
    backTo: 'Volver al catálogo',
    categoryLabel: 'Categoría',
    tagsLabel: 'Etiquetas',
    addToCart: 'Agregar al carrito',
    addedToCart: '¡Agregado!',
    relatedTitle: 'También te puede gustar',
  },

  cart: {
    title: 'Tu pedido',
    emptyTitle: 'Tu pedido está vacío',
    emptyMessage: 'Elegí tus productos favoritos para armar tu pedido.',
    browseProducts: 'Ver productos',
    itemCount: '{count} producto(s)',
    subtotal: 'Subtotal',
    total: 'Total',
    requestQuote: 'Consultar por WhatsApp',
    removeItem: 'Eliminar',
    clearCart: 'Vaciar carrito',
    continueShopping: 'Seguir eligiendo',
  },

  contact: {
    badge: 'Contacto',
    title: 'Hablemos',
    subtitle:
      '¿Tenés alguna pregunta o querés asesoramiento? Escribinos y te respondemos a la brevedad.',
    infoTitle: 'Encontranos',
  },

  notFound: {
    title: '404',
    subtitle: 'Página no encontrada',
    message: 'Lo sentimos, la página que buscás no existe o fue movida.',
    buttonText: 'Volver al inicio',
    buttonLink: '/',
  },
}
