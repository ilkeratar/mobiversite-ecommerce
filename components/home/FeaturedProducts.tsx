import { Product } from '@/types';

import FeaturedProductsClient from './FeaturedProductsClient';

interface FeaturedProductsProps {
  productsPromise: Promise<Product[]>;
}

export default async function FeaturedProducts({ productsPromise }: FeaturedProductsProps) {
  
  const products = await productsPromise;

  return <FeaturedProductsClient products={products} />;
}