import { getProductById } from '@/services/productService';
import Image from 'next/image';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductById(Number(params.id));
  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image src={product.image} alt={product.title} fill className="object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="text-2xl font-semibold mb-2">${product.price}</div>
          <div className="text-sm text-gray-500">Kategori: {product.category}</div>
        </div>
      </div>
    </div>
  );
}

