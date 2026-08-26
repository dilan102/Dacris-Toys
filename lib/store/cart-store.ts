import type { Product } from "@/lib/catalog";

export type CartItem = {
  productId: Product["id"];
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export const CART_STORAGE_KEY = "dacris-toys-cart";

export function calculateCartQuantity(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function upsertCartItem(items: CartItem[], nextItem: CartItem) {
  const existingItem = items.find((item) => item.productId === nextItem.productId);

  if (!existingItem) {
    return [...items, nextItem];
  }

  return items.map((item) =>
    item.productId === nextItem.productId
      ? { ...item, quantity: item.quantity + nextItem.quantity }
      : item,
  );
}
