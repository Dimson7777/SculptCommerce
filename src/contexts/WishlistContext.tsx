import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type Product = Tables<"products">;

interface WishlistContextType {
  items: Product[];
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  itemCount: number;
}

const WISHLIST_KEY_PREFIX = "ironforge-wishlist";

function getStorageKey(userId: string | null): string {
  return userId ? `${WISHLIST_KEY_PREFIX}-${userId}` : WISHLIST_KEY_PREFIX;
}

function loadWishlist(userId: string | null): Product[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(userId: string | null, items: Product[]) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
  } catch {}
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [items, setItems] = useState<Product[]>([]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    setItems(loadWishlist(userId));
    hasLoadedRef.current = true;
  }, [userId]);

  useEffect(() => {
    if (hasLoadedRef.current) {
      saveWishlist(userId, items);
    }
  }, [items, userId]);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      if (exists) return prev.filter((i) => i.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.id === productId),
    [items]
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isWishlisted, removeItem, clearWishlist, itemCount: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
