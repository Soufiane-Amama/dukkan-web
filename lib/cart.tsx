"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { finalPrice } from "./format";
import type { CartItem, ProductCard } from "./types";

const KEY = "dukkan:cart";

type Cart = {
  items: CartItem[];
  ready: boolean; // false حتى نقرأ السلة المحفوظة في المتصفح
  count: number;
  total: number;
  add: (product: ProductCard) => void;
  setQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // localStorage موجود في المتصفح فقط، فنقرؤه بعد أول عرض
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<Cart>(() => {
    const add = (p: ProductCard) =>
      setItems((old) => {
        const found = old.find((i) => i.id === p.id);
        if (found) return old.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
        const { id, title, price, discountPercentage, thumbnail } = p;
        return [...old, { id, title, price, discountPercentage, thumbnail, quantity: 1 }];
      });
    const remove = (id: number) => setItems((old) => old.filter((i) => i.id !== id));
    const setQuantity = (id: number, quantity: number) =>
      quantity < 1
        ? remove(id)
        : setItems((old) => old.map((i) => (i.id === id ? { ...i, quantity } : i)));
    return {
      items,
      ready,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce(
        (sum, i) => sum + finalPrice(i.price, i.discountPercentage) * i.quantity,
        0,
      ),
      add,
      setQuantity,
      remove,
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart يجب أن يُستعمل داخل CartProvider");
  return cart;
}
