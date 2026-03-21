'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { CartItem } from '@food-app/shared'

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  pendingItem: CartItem | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { menuItemId: string } }
  | { type: 'INCREMENT'; payload: { menuItemId: string } }
  | { type: 'DECREMENT'; payload: { menuItemId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'CONFIRM_SWITCH' }
  | { type: 'CANCEL_SWITCH' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { restaurantId } = action.payload
      // Different restaurant — set pendingItem for confirmation dialog
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return { ...state, pendingItem: action.payload }
      }
      const existing = state.items.find((i) => i.menuItemId === action.payload.menuItemId)
      if (existing) {
        return {
          ...state,
          restaurantId,
          items: state.items.map((i) =>
            i.menuItemId === action.payload.menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        restaurantId,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.menuItemId !== action.payload.menuItemId)
      return { ...state, items, restaurantId: items.length === 0 ? null : state.restaurantId }
    }
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItemId === action.payload.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    case 'DECREMENT': {
      const items = state.items
        .map((i) =>
          i.menuItemId === action.payload.menuItemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
      return { ...state, items, restaurantId: items.length === 0 ? null : state.restaurantId }
    }
    case 'CLEAR_CART':
      return { items: [], restaurantId: null, pendingItem: null }
    case 'CONFIRM_SWITCH': {
      if (!state.pendingItem) return state
      return {
        items: [{ ...state.pendingItem, quantity: 1 }],
        restaurantId: state.pendingItem.restaurantId,
        pendingItem: null,
      }
    }
    case 'CANCEL_SWITCH':
      return { ...state, pendingItem: null }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  restaurantId: string | null
  pendingItem: CartItem | null
  totalItems: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (menuItemId: string) => void
  increment: (menuItemId: string) => void
  decrement: (menuItemId: string) => void
  clearCart: () => void
  confirmSwitch: () => void
  cancelSwitch: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurantId: null,
    pendingItem: null,
  })

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        ...state,
        totalItems,
        subtotal,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (menuItemId) => dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId } }),
        increment: (menuItemId) => dispatch({ type: 'INCREMENT', payload: { menuItemId } }),
        decrement: (menuItemId) => dispatch({ type: 'DECREMENT', payload: { menuItemId } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        confirmSwitch: () => dispatch({ type: 'CONFIRM_SWITCH' }),
        cancelSwitch: () => dispatch({ type: 'CANCEL_SWITCH' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
