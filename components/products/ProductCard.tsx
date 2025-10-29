'use client';

import { ProductCardProps } from '@/types';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

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
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const wished = isInWishlist(product.id);
  const toggleWishlist = async (event?: React.MouseEvent) => {
    event?.preventDefault(); 
    event?.stopPropagation();
  
    if (isWishlistLoading) return;
    
    setIsWishlistLoading(true); 
  
    try {
      if (wished) {
        await removeFromWishlist(product.id); 
        toast.success('Product removed from wishlist');
      } else {
        await addToWishlist(product); 
        toast.success('Product added to wishlist');
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      toast.error('Could not update wishlist. Please try again.');
    } finally {
      setIsWishlistLoading(false); 
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      onAddToCart?.(product);
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  // Grid view - Modern Design
  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          {/* Image Container with fixed aspect ratio */}
          <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
            
            {/* Gradient Overlay on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {!product.details.inStock && (
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  Stokta Yok
                </span>
              )}
              {product.rating.rate >= 4.5 && (
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  ⭐ Populer
                </span>
              )}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              disabled={isWishlistLoading}
              aria-pressed={wished}
              className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 ${
                isWishlistLoading 
                  ? 'cursor-not-allowed opacity-100' 
                  : 'hover:bg-white hover:scale-110'
              } ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              {isWishlistLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                wished ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-500" />
                )
              )}
            </button>
          </div>
          
          {/* Product Info */}
          <div className="p-5">
            {/* Category */}
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">
              {product.category}
            </p>
            
            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[3rem] group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating.rate)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {product.rating.rate}
              </span>
              <span className="text-xs text-gray-400">
                ({product.rating.count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.details.brand && (
                <span className="text-xs text-gray-500 font-medium">
                  {product.details.brand}
                </span>
              )}
            </div>
          </div>
        </Link>
        
        {/* Add to Cart Button */}
        <div className="px-5 pb-5">
          <button
            onClick={handleAddToCart}
            disabled={!product.details.inStock || isAddingToCart}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 transform ${
              product.details.inStock && !isAddingToCart
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {!product.details.inStock ? (
              'Stokta Yok'
            ) : isAddingToCart ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ShoppingCartIcon className="w-5 h-5" />
                Add to Cart
              </div>
            )}
          </button>
        </div>
      </div>
    );
  }

  // List view - Modern Design
  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="relative w-full sm:w-64 h-64 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {!product.details.inStock && (
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                Stokta Yok
              </span>
            )}
            {product.rating.rate >= 4.5 && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                ⭐ Populer
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Category */}
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">
              {product.category}
            </p>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating.rate)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {product.rating.rate}
              </span>
              <span className="text-xs text-gray-400">
                ({product.rating.count})
              </span>
            </div>

            {/* Brand */}
            {product.details.brand && (
              <p className="text-sm text-gray-500 mb-2">
                Marka: <span className="font-medium text-gray-700">{product.details.brand}</span>
              </p>
            )}
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={toggleWishlist}
                disabled={isWishlistLoading}
                className={`w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl transition-all duration-300 shadow-sm ${
                  isWishlistLoading 
                    ? 'cursor-not-allowed' 
                    : 'hover:bg-gray-100 hover:scale-110'
                }`}
              >
                {isWishlistLoading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  wished ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-600" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-500" />
                  )
                )}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!product.details.inStock || isAddingToCart}
                className={`flex-1 sm:flex-initial py-3 px-8 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm ${
                  product.details.inStock && !isAddingToCart
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!product.details.inStock ? (
                  'Stokta Yok'
                ) : isAddingToCart ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
