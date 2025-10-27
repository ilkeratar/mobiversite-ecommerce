import { getProducts, getCategories } from '@/services/productService';
import ProductsPageClient from './ProductsPageClient';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({}),
    getCategories()
  ]);

  return (
    <ProductsPageClient 
      initialProducts={products} 
      categories={categories} 
    />
  );
}

