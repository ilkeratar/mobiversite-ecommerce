'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCard {
  id: number;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description: string;
}

const categories: CategoryCard[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    image: '/images/categories/electronics-category.jpg',
    productCount: 150,
    description: 'Latest technology products'
  },
  {
    id: 2,
    name: "Men's Clothing",
    slug: 'men\'s clothing',
    image: '/images/categories/mens-clothing-category.jpg',
    productCount: 200,
    description: "Modern men's fashion"
  },
  {
    id: 3,
    name: "Women's Clothing",
    slug: 'women\'s clothing',
    image: '/images/categories/womens-clothing-category.jpg',
    productCount: 180,
    description: "Elegant women's collection"
  },
  {
    id: 4,
    name: 'Jewelry',
    slug: 'jewelery',
    image: '/images/categories/jewelry-category.jpg',
    productCount: 120,
    description: 'Elegant jewelry collection'
  }
];

export default function CategoryCards() {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our curated collections
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden bg-gray-100 aspect-[3/4] hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                  quality={95}
                />
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Arrow Icon */}
                  <div className="flex justify-end">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/95 font-light">
                      {category.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <span className="text-xs text-white/90 uppercase tracking-wider font-medium">
                        {category.productCount}+ Products
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
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
