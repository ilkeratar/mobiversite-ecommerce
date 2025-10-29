'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

interface ProductListProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductList({ 
  products, 
  viewMode = 'grid',
  onAddToCart,
  onAddToWishlist,
  onViewDetails
}: ProductListProps) {

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Squares2X2Icon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <>
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8'
          : 'space-y-4'
      }>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onViewDetails={onViewDetails}
            viewMode={viewMode}
          />
        ))}
      </div>
    </>
  );
}