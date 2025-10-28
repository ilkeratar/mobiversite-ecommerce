'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Product, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';


interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
  initialItems: Product[];
}

export function WishlistProvider({ children, initialItems }: WishlistProviderProps) {
  const [items, setItems] = useState<Product[]>(initialItems || []);
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (!user) {
      setItems([]);
    }
  }, [user]);

  // Ensure wishlist items are populated on the client immediately after login
  // even if the layout/providers are not remounted (client-side navigation).
  useEffect(() => {
    const syncWishlistFromUser = async () => {
      if (!user) {
        setItems([]);
        return;
      }

      const wishlistIds = user.wishlist || [];
      if (wishlistIds.length === 0) {
        setItems([]);
        return;
      }

      try {
        const query = wishlistIds.map((id) => `id=${id}`).join('&');
        const products = await apiClient.get(`/products?${query}`);
        setItems(products as Product[]);
      } catch (error) {
        console.error('Failed to sync wishlist products:', error);
      }
    };

    // Run on mount and whenever the authenticated user reference changes
    syncWishlistFromUser();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Update client-side state first
    setItems(prev => {
      const currentItems = prev || [];

      if (currentItems.find(item => item.id === product.id)) 
        return currentItems;

      return [...currentItems, product];
    });

    // Update wishlist on server
    const newWishlistIds = [...(user.wishlist || []), product.id];
    try {
      const updatedUser = await apiClient.put(`/users/${user.id}`, {
        ...user,
        wishlist: newWishlistIds
      });
      // Update user state in context
      setUser(updatedUser as User);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      // Rollback to previous state
      setItems((prev) => (prev || []).filter(item => item.id !== product.id));
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;

    let removedItem: Product | undefined;
    setItems((prev) => {
      const currentItems = prev || [];
      removedItem = currentItems.find(item => item.id === productId);
      return currentItems.filter(item => item.id !== productId);
    });

    if (!removedItem) return;

    // Update wishlist on server
    const newWishlistIds = (user.wishlist || []).filter(id => id !== productId);
    try {
      const updatedUser = await apiClient.put(`/users/${user.id}`, {
        ...user,
        wishlist: newWishlistIds
      });
      setUser(updatedUser as User);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      if (removedItem) {
        setItems((prev) => [...(prev || []), removedItem!]);
      }
    }
  };

  const isInWishlist = (productId: number) => {
    return (items || []).some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
