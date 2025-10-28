'use client';

import { Product, ProductCardProps } from '@/types';
import { HeartIcon, ShoppingCartIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

interface ExtendedProductCardProps extends ProductCardProps {
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onViewDetails,
  viewMode = 'grid'
}: ExtendedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      setIsWishlistAnimating(true);
      setTimeout(() => setIsWishlistAnimating(false), 200);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  // Grid view (Tailwind UI style)
  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-[7/8]">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
            />
            
            {/* Badge */}
            {!product.details.inStock && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Out of Stock
              </div>
            )}
            
            {/* Quick Actions */}
            <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <span className={`inline-flex items-center justify-center transition-transform ${isWishlistAnimating ? 'scale-125' : 'scale-100'}`}>
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-600" />
                  )}
                </span>
              </button>
            </div>
          </div>
          
          <h3 className="mt-4 text-sm text-gray-700 line-clamp-2">{product.title}</h3>
          
          {/* Rating */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating.rate)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.rating.count})
            </span>
          </div>

          <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </Link>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.details.inStock}
          className={`mt-4 w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${
            product.details.inStock
              ? 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.details.inStock ? (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </div>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    );
  }

  // List view
  return (
    <div 
      className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="flex w-full">
        {/* Product Image */}
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          {!product.details.inStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 capitalize">{product.category}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating.rate)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.rating.count})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className={`inline-flex items-center justify-center transition-transform ${isWishlistAnimating ? 'scale-125' : 'scale-100'}`}>
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-600" />
                  )}
                </span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!product.details.inStock}
                className={`py-2 px-6 rounded-md text-sm font-medium transition-colors ${
                  product.details.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.details.inStock ? (
                  <div className="flex items-center gap-2">
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to Cart
                  </div>
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
