import { Rating } from './common';

// Base product interface matching the db.json structure
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

// Product details interface for different product types
export interface ProductDetails {
  inStock: boolean;
  sku: string;
  brand: string;
  weight: string;
  dimensions: string;
  // Clothing specific properties
  sizes?: string[];
  colors?: string[];
  material?: string[];
  fit?: string[];
  // Jewelry specific properties
  size?: string[];
  color?: string[];
  chainLength?: string[];
  // Electronics specific properties
  storage?: string[];
  connectivity?: string[];
  warranty?: string[];
}

// Product category enum for type safety
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  JEWELERY = 'jewelery',
  MENS_CLOTHING = "men's clothing",
  WOMENS_CLOTHING = "women's clothing"
}

// Product list props interface
export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}

// Product card props interface
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

// Product filters interface
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
  rating?: number;
  search?: string;
}

// Product sort options
export enum ProductSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING_ASC = 'rating_asc',
  RATING_DESC = 'rating_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest'
}
