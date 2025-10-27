import { getProducts } from '@/services/productService';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryCards from '@/components/home/CategoryCards';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import { Suspense } from 'react';
import { Product } from '@/types';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200"></div>
    </div>
  );
}

export default async function HomePage() {
  // Get products for featured section
  const productsPromise = new Promise<Product[]>((resolve) => {
    setTimeout(async () => {
      const products = await getProducts({});
      resolve(products);
    }, 1000);
  });

  const [products] = await Promise.all([productsPromise]);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <Suspense fallback={<LoadingSkeleton />}>
        <HeroSlider />
      </Suspense>

      {/* Category Cards */}
      <CategoryCards />

      {/* Featured Products */}
      <Suspense fallback={<div className="py-16 text-center">Loading products...</div>}>
        <FeaturedProducts products={products} />
      </Suspense>

      {/* Features Section */}
      <FeaturesSection />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
}