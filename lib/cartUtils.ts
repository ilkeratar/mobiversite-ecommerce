import { CartItem, Product, CartStats } from '@/types';

// Validates if a quantity is valid (positive integer)
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0;
}

// Calculates the total price for an array of cart items
export function calculateTotal(items: CartItem[]): number {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return Number(total.toFixed(2));
}

// Calculates the total number of items in the cart
export function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// Creates a CartItem from a Product with default quantity
export function createCartItem(
  product: Product,
  quantity: number = 1,
  selectedOptions?: CartItem['selectedOptions']
): CartItem {
  if (!isValidQuantity(quantity)) {
    throw new Error('Quantity must be a positive integer');
  }

  return {
    ...product,
    quantity,
    selectedOptions,
    addedAt: new Date(),
  };
}

// Merges cart items with the same ID and selected options
export function mergeCartItems(items: CartItem[]): CartItem[] {
  const mergedMap = new Map<string, CartItem>();

  items.forEach((item) => {
    const key = generateCartItemKey(item);
    const existing = mergedMap.get(key);

    if (existing) {
      mergedMap.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      mergedMap.set(key, { ...item });
    }
  });

  return Array.from(mergedMap.values());
}

// Generates a unique key for a cart item based on ID and selected options
function generateCartItemKey(item: CartItem): string {
  const optionsKey = item.selectedOptions
    ? JSON.stringify(Object.entries(item.selectedOptions).sort())
    : '';
  return `${item.id}-${optionsKey}`;
}

// Checks if a cart item matches specific criteria
export function matchesCartItem(
  item: CartItem,
  productId: number,
  selectedOptions?: CartItem['selectedOptions']
): boolean {
  if (item.id !== productId) return false;
  
  if (!selectedOptions && !item.selectedOptions) return true;
  
  if (!selectedOptions || !item.selectedOptions) return false;
  
  return JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions);
}

// Filters out cart items with invalid quantities
export function filterValidCartItems(items: CartItem[]): CartItem[] {
  return items.filter((item) => isValidQuantity(item.quantity));
}


export function calculateCartStats(items: CartItem[]): CartStats {
  const totalItems = calculateTotalItems(items);
  const totalPrice = calculateTotal(items);
  const uniqueProducts = items.length;
  const averageItemPrice = uniqueProducts > 0 
    ? Number((totalPrice / totalItems).toFixed(2))
    : 0;

  return {
    totalItems,
    totalPrice,
    uniqueProducts,
    averageItemPrice,
  };
}

