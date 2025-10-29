import { notFound } from 'next/navigation';

import { getProductById } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  try {
    const product = await getProductById(Number(id));
    return <ProductDetailClient product={product} />;
  } catch (error) {
    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 404) {
      notFound();
    }
    throw error;
  }
}

