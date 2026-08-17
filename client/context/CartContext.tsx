'use client'

import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { siteData } from '@/data/siteData'
import { useStore } from '@/context/StoreContext'

const CartContext = createContext<any>(null)

const STORAGE_KEY = siteData.cart.persistenceKey || 'appresuelve-cart'

function itemKey(productId, skuId) {
  return `${productId}-${skuId || 0}`
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, skuId } = action.payload
      const quantityToAdd = action.payload.quantity || 1
      const key = itemKey(productId, skuId)
      const existingIndex = state.items.findIndex(
        (item) => item.key === key
      )

      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantityToAdd,
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          { key, productId, skuId: skuId || null, quantity: quantityToAdd },
        ],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.key !== action.payload.key),
      }

    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.key !== key),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === key ? { ...item, quantity } : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { productsMap, loading, store } = useStore()

  const [state, dispatch] = useReducer(cartReducer, undefined, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return { items: stored ? JSON.parse(stored) : [] }
    } catch {
      return { items: [] }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const cartItems = useMemo(() => {
    return state.items.map((item) => {
      const product = productsMap[item.productId]
      if (!product) {
        return {
          ...item,
          id: item.key,
          name: loading ? 'Cargando...' : 'Producto',
          images: [],
          retailPrice: 0,
          unitPrice: 0,
          subtotal: 0,
          variantLabel: null,
        }
      }

      let unitPrice = Number(product.retailPrice)
      let variantLabel = null

      if (item.skuId) {
        const sku = (product.skus || []).find(s => s.id === item.skuId)
        if (sku) {
          unitPrice = Number(sku.retailPrice)
          if (sku.attributeValues?.length) {
            variantLabel = sku.attributeValues.map(v => v.value).join(' / ')
          }
          if (sku.wholesalePrice && sku.wholesaleMinQty && item.quantity >= sku.wholesaleMinQty) {
            unitPrice = Number(sku.wholesalePrice)
          }
        }
      } else if (product.wholesalePrice && product.wholesaleMinQty && item.quantity >= product.wholesaleMinQty) {
        unitPrice = Number(product.wholesalePrice)
      }

      return {
        ...item,
        ...product,
        id: item.key,
        unitPrice,
        subtotal: unitPrice * item.quantity,
        variantLabel,
      }
    })
  }, [state.items, productsMap, loading])

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  const wholesale = useMemo(() => {
    const enabled = !!(store?.wholesale_discount_enabled)
    const minAmount = Number(store?.wholesale_discount_min_amount) || 0
    const percentage = Number(store?.wholesale_discount_percentage) || 0
    const countDiscounted = !!store?.wholesale_discount_count_discounted
    const applyToDiscounted = !!store?.wholesale_discount_apply_to_discounted

    let minBase = 0
    let discountBase = 0

    for (const item of cartItems) {
      const hasIndividualDiscount = Number(item.discountPercentage) > 0
      if (hasIndividualDiscount) {
        if (countDiscounted) {
          minBase += item.subtotal
          if (applyToDiscounted) discountBase += item.subtotal
        }
      } else {
        minBase += item.subtotal
        discountBase += item.subtotal
      }
    }

    const active = enabled && minAmount > 0 && percentage > 0
    const eligible = active && minBase >= minAmount
    const discountAmount = eligible ? discountBase * (percentage / 100) : 0
    const finalTotal = totalPrice - discountAmount

    return {
      enabled,
      minAmount,
      percentage,
      countDiscounted,
      applyToDiscounted,
      minBase,
      discountBase,
      eligible,
      discountAmount,
      finalTotal,
      progress: {
        current: minBase,
        min: minAmount,
        remaining: Math.max(0, minAmount - minBase),
        pct: minAmount > 0 ? Math.min((minBase / minAmount) * 100, 100) : 0,
      },
    }
  }, [cartItems, totalPrice, store])

  const addItem = (productId, quantity = 1, skuId = null) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, quantity, skuId } })
  }

  const removeItem = (key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { key } })
  }

  const updateQuantity = (key, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (productId, skuId = null) => {
    const key = itemKey(productId, skuId)
    const item = state.items.find((item) => item.key === key)
    return item ? item.quantity : 0
  }

  const value = {
    items: cartItems,
    totalItems,
    totalPrice,
    wholesale,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
