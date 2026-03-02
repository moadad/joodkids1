"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ProductDoc } from "@/lib/products";

export type CartItem = {
  code: number;
  name: string;
  seriesQty: 6 | 9 | 12;
  seriesCount: number;
  promo: "عادي" | "عرض" | "خصم";
  imageUrl?: string;
};

type CartState = {
  items: Record<string, CartItem>;
};

type CartAction =
  | { type: "ADD"; product: ProductDoc }
  | { type: "ADD_WITH_COUNT"; product: ProductDoc; seriesCount: number }
  | { type: "SET_COUNT"; code: number; seriesCount: number }
  | { type: "REMOVE"; code: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

const STORAGE_KEY = "joodkids_cart_v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD": {
      const codeKey = String(action.product.code);
      const existing = state.items[codeKey];
      const nextCount = (existing?.seriesCount ?? 0) + 1;
      return {
        items: {
          ...state.items,
          [codeKey]: {
            code: action.product.code,
            name: action.product.name,
            seriesQty: action.product.seriesQty,
            promo: action.product.promo,
            imageUrl: action.product.images?.[0]?.url,
            seriesCount: nextCount,
          },
        },
      };
    }

    case "ADD_WITH_COUNT": {
      const codeKey = String(action.product.code);
      const existing = state.items[codeKey];
      const addCount = Math.max(1, Math.floor(action.seriesCount));
      const nextCount = (existing?.seriesCount ?? 0) + addCount;
      return {
        items: {
          ...state.items,
          [codeKey]: {
            code: action.product.code,
            name: action.product.name,
            seriesQty: action.product.seriesQty,
            promo: action.product.promo,
            imageUrl: action.product.images?.[0]?.url,
            seriesCount: nextCount,
          },
        },
      };
    }

    case "SET_COUNT": {
      const codeKey = String(action.code);
      const existing = state.items[codeKey];
      if (!existing) return state;
      const c = Math.max(1, Math.floor(action.seriesCount));
      return { items: { ...state.items, [codeKey]: { ...existing, seriesCount: c } } };
    }

    case "REMOVE": {
      const codeKey = String(action.code);
      const next = { ...state.items };
      delete next[codeKey];
      return { items: next };
    }

    case "CLEAR":
      return { items: {} };

    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  totalSeries: number;
  add: (p: ProductDoc) => void;
  addWithCount: (p: ProductDoc, seriesCount: number) => void;
  setSeriesCount: (code: number, seriesCount: number) => void;
  remove: (code: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: {} });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) as CartState });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const items = useMemo(() => Object.values(state.items), [state.items]);
  const totalSeries = useMemo(() => items.reduce((sum, i) => sum + (i.seriesCount || 0), 0), [items]);

  const value: CartContextValue = {
    items,
    totalSeries,
    add: (p) => dispatch({ type: "ADD", product: p }),
    addWithCount: (p, seriesCount) => dispatch({ type: "ADD_WITH_COUNT", product: p, seriesCount }),
    setSeriesCount: (code, seriesCount) => dispatch({ type: "SET_COUNT", code, seriesCount }),
    remove: (code) => dispatch({ type: "REMOVE", code }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}