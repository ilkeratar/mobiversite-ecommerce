import { getProductById } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  
  return <ProductDetailClient product={product} />;
}

