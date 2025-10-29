import { Suspense } from 'react';
import { getProducts } from '@/services/productService';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryCards from '@/components/home/CategoryCards';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Loading from './loading';


export default function HomePage() {
  const productsPromise = getProducts({});

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <Suspense fallback={<Loading />}>
        <HeroSlider />
      </Suspense>

      {/* Category Cards */}
      <CategoryCards />

      {/* Featured Products */}
      <Suspense fallback={<Loading />}>
        <FeaturedProducts productsPromise={productsPromise} />
      </Suspense>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}