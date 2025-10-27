'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { StarIcon, HeartIcon as HeartOutline, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '@/context/WishlistContext';

interface ProductDetailClientProps {
  product: Product;
}

function classNames(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const colors = useMemo(() => product.details.colors || product.details.color || [], [product]);
  const sizes = useMemo(() => product.details.sizes || product.details.size || [], [product]);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const wished = isInWishlist(product.id);
  const toggleWishlist = () => {
    if (wished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      setIsWishlistAnimating(true);
      setTimeout(() => setIsWishlistAnimating(false), 200);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/products" className="hover:text-gray-900">Products</Link>
            </li>
            {product.category && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="capitalize hover:text-gray-900">
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 truncate max-w-[40ch]" aria-current="page">{product.title}</li>
          </ol>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image */}
          <div className="w-full">
            <div className="relative w-full aspect-square rounded-xl bg-gray-100 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>

            {/* Price */}
            <div className="mt-3 text-2xl font-semibold text-gray-900">${product.price.toFixed(2)}</div>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={classNames(
                      'w-5 h-5',
                      i < Math.round(product.rating?.rate || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              {product.rating?.count !== undefined && (
                <span className="text-sm text-gray-500">({product.rating.count})</span>
              )}
            </div>

            {/* Options */}
            {colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={classNames(
                        'px-3 py-1.5 rounded-full border text-sm capitalize cursor-pointer',
                        selectedColor === color ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={classNames(
                        'px-3 py-1.5 rounded-md border text-sm uppercase cursor-pointer',
                        selectedSize === size ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.details.inStock}
                className={classNames(
                  'flex-1 rounded-md px-6 py-3 text-base font-semibold shadow-sm transition-colors',
                  product.details.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                {product.details.inStock ? (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCartIcon className="w-5 h-5 stroke-2" />
                    Add to Cart
                  </span>
                ) : (
                  'Out of Stock'
                )}
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                aria-pressed={wished}
                className={classNames(
                  'inline-flex items-center justify-center rounded-md border transition-colors w-12 h-12 cursor-pointer',
                  wished ? 'border-red-600 bg-red-50 hover:bg-red-100' : 'border-gray-300 bg-white hover:bg-gray-50'
                )}
                title={wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <span
                  className={classNames(
                    'inline-flex items-center justify-center transition-transform',
                    isWishlistAnimating ? 'scale-125' : 'scale-100'
                  )}
                >
                  {wished ? (
                    <HeartSolid className="w-6 h-6 text-red-600" />
                  ) : (
                    <HeartOutline className="w-6 h-6 text-gray-500" />
                  )}
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="mt-10">
              <h2 className="text-base font-semibold text-gray-900">Description</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Key details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {product.details.brand && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Brand</span>
                  <span className="text-gray-900 font-medium">{product.details.brand}</span>
                </div>
              )}
              {product.details.sku && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">SKU</span>
                  <span className="text-gray-900 font-medium">{product.details.sku}</span>
                </div>
              )}
              {product.details.weight && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Weight</span>
                  <span className="text-gray-900 font-medium">{product.details.weight}</span>
                </div>
              )}
              {product.details.dimensions && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Dimensions</span>
                  <span className="text-gray-900 font-medium">{product.details.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


