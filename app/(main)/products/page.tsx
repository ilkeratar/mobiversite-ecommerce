import { getProducts } from '@/services/productService';
import ProductList from '@/components/products/ProductList';

export default async function ProductsPage() {
  const products = await getProducts({});
  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Tüm Ürünler</h1>
      <ProductList products={products} />
    </div>
  );
}

