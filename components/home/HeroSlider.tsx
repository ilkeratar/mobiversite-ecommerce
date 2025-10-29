'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  ctaText: string;
  ctaLink: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Fashion World',
    subtitle: 'New Season',
    description: 'Discover the trendiest pieces and reflect your style',
    image: '/images/hero/clothes-hero.jpg',
    category: 'women\'s clothing',
    ctaText: 'Start Shopping',
    ctaLink: '/products?category=women\'s clothing'
  },
  {
    id: 2,
    title: 'Electronics',
    subtitle: 'Technology',
    description: 'Make your life easier with the latest technology',
    image: '/images/hero/electronics-hero.jpg',
    category: 'electronics',
    ctaText: 'Explore',
    ctaLink: '/products?category=electronics'
  },
  {
    id: 3,
    title: 'Jewelry',
    subtitle: 'Elegance',
    description: 'Unique pieces that beautify your special moments',
    image: '/images/hero/jewelry-hero.jpg',
    category: 'jewelery',
    ctaText: 'Browse',
    ctaLink: '/products?category=jewelery'
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
    <div className="relative h-[55vh] md:h-[65vh] overflow-hidden bg-gray-50">
      {/* Slides Container */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 ' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <div className="relative h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover grayscale-[20%]"
                priority={index === 0}
              />
              
              {/* Minimal Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">
                  <div className="max-w-xl lg:max-w-2xl">
                    <div className="space-y-5 animate-in fade-in slide-in-from-left duration-700">
                      {/* Title */}
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                        {slide.title}
                      </h1>
                      
                      {/* Description */}
                      <p className="text-base md:text-lg text-white/90 max-w-md font-light leading-relaxed">
                        {slide.description}
                      </p>
                      
                      {/* CTA Button */}
                      <div className="pt-2">
                        <Link
                          href={slide.ctaLink}
                          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium hover:bg-gray-100 transition-colors duration-200 group"
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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
        className="absolute left-2 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 
                   bg-white/10 backdrop-blur-md border border-white/20 text-white 
                   p-2 md:p-3 lg:p-3.5 rounded-full
                   hover:bg-white/30 hover:border-white/40 hover:scale-110
                   active:scale-95
                   transition-all duration-300 ease-out
                   shadow-lg hover:shadow-xl
                   group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 
                                 group-hover:stroke-[2.5] transition-all duration-200" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 
                   bg-white/10 backdrop-blur-md border border-white/20 text-white 
                   p-2 md:p-3 lg:p-3.5 rounded-full
                   hover:bg-white/30 hover:border-white/40 hover:scale-110
                   active:scale-95
                   transition-all duration-300 ease-out
                   shadow-lg hover:shadow-xl
                   group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 
                                  group-hover:stroke-[2.5] transition-all duration-200" />
      </button>

      {/* Minimal Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-8 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
