'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCard {
  id: number;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description: string;
  gradient: string;
  hoverGradient: string;
}

const categories: CategoryCard[] = [
  {
    id: 1,
    name: 'Elektronik',
    slug: 'electronics',
    image: '/images/categories/electronics-category.jpg',
    productCount: 150,
    description: 'En son teknoloji ürünleri',
    gradient: 'from-blue-500 to-cyan-500',
    hoverGradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 2,
    name: 'Erkek Giyim',
    slug: 'men\'s clothing',
    image: '/images/categories/mens-clothing-category.jpg',
    productCount: 200,
    description: 'Modern erkek modası',
    gradient: 'from-gray-700 to-gray-900',
    hoverGradient: 'from-gray-800 to-black'
  },
  {
    id: 3,
    name: 'Kadın Giyim',
    slug: 'women\'s clothing',
    image: '/images/categories/womens-clothing-category.jpg',
    productCount: 180,
    description: 'Şık kadın koleksiyonu',
    gradient: 'from-pink-500 to-rose-500',
    hoverGradient: 'from-pink-600 to-rose-600'
  },
  {
    id: 4,
    name: 'Mücevher',
    slug: 'jewelery',
    image: '/images/categories/jewelry-category.jpg',
    productCount: 120,
    description: 'Zarif mücevher koleksiyonu',
    gradient: 'from-amber-500 to-yellow-500',
    hoverGradient: 'from-amber-600 to-yellow-600'
  }
];

export default function CategoryCards() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Kategoriler
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            En popüler kategorilerimizi keşfedin ve ihtiyacınıza uygun ürünleri bulun
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-[-4px] transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-3 group-hover:translate-y-[-4px] transition-transform duration-300 delay-75">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-end">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 delay-100" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.hoverGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-7 py-3 bg-white text-gray-900 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            Tüm Kategorileri Gör
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
