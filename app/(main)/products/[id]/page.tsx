import { getProductById } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductById(Number(params.id));
  return <ProductDetailClient product={product} />;
}

