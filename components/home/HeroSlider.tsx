'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Fashion World',
    subtitle: 'New Season',
    description: 'Discover the trendiest pieces and reflect your style',
    image: '/images/hero/fashion-hero.jpg',
    category: 'women\'s clothing',
    ctaText: 'Start Shopping',
    ctaLink: '/products?category=women\'s clothing',
    gradient: 'from-pink-600/70 to-purple-600/70'
  },
  {
    id: 2,
    title: 'Electronics',
    subtitle: 'Technology',
    description: 'Make your life easier with the latest technology products',
    image: '/images/hero/electronics-hero.jpg',
    category: 'electronics',
    ctaText: 'Explore',
    ctaLink: '/products?category=electronics',
    gradient: 'from-blue-600/70 to-cyan-600/70'
  },
  {
    id: 3,
    title: 'Jewelry',
    subtitle: 'Elegance',
    description: 'Unique pieces that beautify your special moments',
    image: '/images/hero/jewelry-hero.jpg',
    category: 'jewelery',
    ctaText: 'Browse',
    ctaLink: '/products?category=jewelery',
    gradient: 'from-amber-600/70 to-yellow-600/70'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="relative h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-8">
                  <div className="max-w-2xl">
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        {slide.title}
                      </h1>
                      <h2 className="text-2xl md:text-3xl font-semibold text-white/90">
                        {slide.subtitle}
                      </h2>
                      <p className="text-lg md:text-xl text-white/80 max-w-lg">
                        {slide.description}
                      </p>
                      <div className="pt-4">
                        <Link
                          href={slide.ctaLink}
                          className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          {slide.ctaText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
