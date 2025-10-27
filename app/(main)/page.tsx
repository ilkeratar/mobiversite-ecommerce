import { getProducts, getCategories } from '@/services/productService';
import ProductList from '@/components/products/ProductList';
import { Suspense } from 'react';
import { Product } from '@/types';

function LoadingSkeleton() {
  return <div>Ürünler yükleniyor...</div>;
}

export default async function HomePage(props: { 
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.q;
  
  const productsPromise = new Promise<Product[]>((resolve) => {
    setTimeout(async () => {
      const products = await getProducts({ q: searchQuery });
      resolve(products);
    }, 1000);
  });

  const [products] = await Promise.all([productsPromise]);

  return (
    <div>
      {/* Ürün Listesi (Server Component)
        Suspense, filtreleme sırasında (sayfa yeniden render olurken) 
        kullanıcıya bir 'loading' durumu göstermemizi sağlar.
        Bunun çalışması için app/(main)/loading.tsx dosyası oluşturabilirsiniz.
      */}
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductList products={products} />
      </Suspense>
    </div>
  );
}