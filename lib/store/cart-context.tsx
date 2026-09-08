"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { CART_STORAGE_KEY, upsertCartItem } from "@/lib/store/cart-store";

export type CartItem = { productId: string; quantity: number };
type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function reducer(items: CartItem[], action: { type: string; productId?: string; quantity?: number }) {
  if (action.type === "clear") return [];
  if (!action.productId) return items;
  if (action.type === "remove") return items.filter((item) => item.productId !== action.productId);
  const quantity = Math.max(0, action.quantity ?? 1);
  if (!quantity) return items.filter((item) => item.productId !== action.productId);
  const current = items.find((item) => item.productId === action.productId)?.quantity ?? 0;
  return upsertCartItem(items, { productId: action.productId, quantity: quantity - current });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as CartItem[];
      saved.forEach((item) => dispatch({ type: "set", productId: item.productId, quantity: Math.max(1, item.quantity) }));
    } catch { /* A broken browser value should not stop the store. */ }
  }, []);
  useEffect(() => { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }, [items]);
  return <CartContext.Provider value={{ items,
    addItem: (productId, quantity = 1) => {
      const current = items.find((item) => item.productId === productId)?.quantity ?? 0;
      dispatch({ type: "set", productId, quantity: current + quantity });
    },
    changeQuantity: (productId, quantity) => dispatch({ type: "set", productId, quantity }),
    removeItem: (productId) => dispatch({ type: "remove", productId }), clearCart: () => dispatch({ type: "clear" }),
  }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe usarse dentro de CartProvider");
  return value;
}
