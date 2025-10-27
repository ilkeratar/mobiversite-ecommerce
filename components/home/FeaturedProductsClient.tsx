'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';

interface FeaturedProductsClientProps {
  products: Product[];
}

export default function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const featuredProducts = products
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 4);

  const toggleWishlist = (productId: number) => {
    setWishlistItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most loved and highest rated products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button className="bg-white text-gray-900 p-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        wishlistItems.includes(product.id)
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlistItems.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-xl text-xs font-medium border ${
                    product.details.inStock 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {product.details.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-xl text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(product.rating.rate)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.rating.count})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.details.brand}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Actions */}
                  <div className="pt-4 space-y-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full text-center py-3 bg-white text-gray-900 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                    >
                      View Details
                    </Link>
                    
                    <button
                      disabled={!product.details.inStock}
                      className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        product.details.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {product.details.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Products
            <Eye className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
