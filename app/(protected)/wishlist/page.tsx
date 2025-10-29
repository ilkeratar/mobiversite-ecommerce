'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Wishlist' }
];

export default function WishlistPage() {
  const { items } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAddingAll, setIsAddingAll] = React.useState(false);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success('Product added to cart');
  };

  const handleAddAllToCart = () => {
    if (isAddingAll) return;
    
    setIsAddingAll(true);
    
    setTimeout(() => {
      items.forEach(item => {
        if (item.details.inStock) {
          addToCart(item);
        }
      });
      
      setIsAddingAll(false);
      const inStockCount = items.filter(item => item.details.inStock).length;
      toast.success(`${inStockCount} products added to cart`);
    }, 1000);
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Page Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Wishlist
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Save your favorite items for later
            </p>
          </div>

          {/* Empty State */}
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-gray-100 p-6">
              <HeartIcon className="h-16 w-16 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              Start adding products you love to your wishlist. You can find them here later!
            </p>
            <button
              onClick={() => router.push('/products')}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                My Wishlist
              </h1>
            </div>
            
            {/* Quick action to move all to cart */}
            {items.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                disabled={isAddingAll}
                className={`hidden sm:inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
                  isAddingAll
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                }`}
              >
                {isAddingAll ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
                    Add All to Cart
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      </div>
  );
}

