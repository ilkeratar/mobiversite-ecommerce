'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import { Product } from '@/types';

interface FeaturedProductsClientProps {
  products: Product[];
}

export default function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  const featuredProducts = products
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(1, 5);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3.5 h-3.5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-white/40'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our top-rated collection
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative overflow-hidden bg-white aspect-[3/4] hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-full overflow-hidden bg-white">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                  quality={95}
                />
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top Section - Arrow Icon */}
                  <div className="flex justify-end">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Bottom Section - Product Info */}
                  <div className="text-white space-y-3">
                    {/* Category */}
                    <div className="text-xs text-white/80 uppercase tracking-wider font-medium">
                      {product.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold line-clamp-2 tracking-tight">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(product.rating.rate)}
                      </div>
                      <span className="text-sm text-white/90">
                        {product.rating.rate} ({product.rating.count})
                      </span>
                    </div>

                    {/* Price & Brand */}
                    <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        ${product.price}
                      </div>
                      {product.details.brand && (
                        <div className="text-xs text-white/80 uppercase tracking-wider">
                          {product.details.brand}
                        </div>
                      )}
                    </div>

                    {/* Stock Status */}
                    {!product.details.inStock && (
                      <div className="pt-2">
                        <span className="text-xs text-rose-300 font-medium uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 group text-center"
          >
            <span>View All Products</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
