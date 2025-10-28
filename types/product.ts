import { Rating } from './common';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  details: ProductDetails;
}

export interface ProductDetails {
  inStock: boolean;
  sku: string;
  brand: string;
  weight: string;
  dimensions: string;
  sizes?: string[];
  colors?: string[];
  material?: string[];
  fit?: string[];
  size?: string[];
  color?: string[];
  chainLength?: string[];
  storage?: string[];
  connectivity?: string[];
  warranty?: string[];
}

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  JEWELERY = 'jewelery',
  MENS_CLOTHING = "men's clothing",
  WOMENS_CLOTHING = "women's clothing"
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
  rating?: number;
  search?: string;
  size?: string;
  color?: string;
  material?: string;
  storage?: string;
}

export enum ProductSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING_ASC = 'rating_asc',
  RATING_DESC = 'rating_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest'
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: {
    size?: string;
    color?: string;
    material?: string;
    storage?: string;
    [key: string]: string | undefined;
  };
  addedAt?: Date;
}

export interface CartItemWithSubtotal extends CartItem {
  subtotal: number;
}

export interface CartStats {
  totalItems: number;
  totalPrice: number;
  uniqueProducts: number;
  averageItemPrice: number;
}
