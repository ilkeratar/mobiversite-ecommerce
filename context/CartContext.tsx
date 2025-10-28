'use client';

import { 
  createContext, 
  useContext, 
  ReactNode, 
  useState, 
  useEffect,
  useMemo
} from 'react';
import { Product, CartItem, CartStats } from '@/types';
import * as CartUtils from '@/lib/cartUtils';

const CART_STORAGE_KEY = 'ecomversite_cart';

interface CartContextType {
  items: CartItem[];
  stats: CartStats;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, selectedOptions?: CartItem['selectedOptions']) => void;
  removeFromCart: (productId: number, selectedOptions?: CartItem['selectedOptions']) => void;
  updateQuantity: (productId: number, quantity: number, selectedOptions?: CartItem['selectedOptions']) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);



export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) {
        const parsedItems = CartUtils.filterValidCartItems(JSON.parse(storedItems));
        setItems(parsedItems);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const stats = useMemo(() => {
    return CartUtils.calculateCartStats(items);
  }, [items]);

  // Actions 

  const addToCart = (
    product: Product, 
    quantity: number = 1, 
    selectedOptions?: CartItem['selectedOptions']
  ) => {
    setItems((prevItems) => {
      // 1. Create a new CartItem from the incoming product (Utils)
      const newItem = CartUtils.createCartItem(product, quantity, selectedOptions);
      // 2. Add the new item to the current list and merge duplicates (Utils)
      const mergedItems = CartUtils.mergeCartItems([...prevItems, newItem]);
      return mergedItems;
    });
  };

  const removeFromCart = (
    productId: number, 
    selectedOptions?: CartItem['selectedOptions']
  ) => {
    setItems((prevItems) => 
      prevItems.filter(
        // Use Utils to remove a specific variant of the product
        (item) => !CartUtils.matchesCartItem(item, productId, selectedOptions)
      )
    );
  };

  const updateQuantity = (
    productId: number, 
    quantity: number, 
    selectedOptions?: CartItem['selectedOptions']
  ) => {
    if (!CartUtils.isValidQuantity(quantity)) {
      // If quantity is invalid (e.g. 0), remove the product
      removeFromCart(productId, selectedOptions);
      return;
    }
    
    setItems((prevItems) => 
      prevItems.map((item) => {
        if (CartUtils.matchesCartItem(item, productId, selectedOptions)) {
          // Update the quantity of the matching product
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        stats,
        isLoading: !isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}