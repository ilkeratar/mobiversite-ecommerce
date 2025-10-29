'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';

import animationData from '@/public/animations/empty.json';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">

        <div className="mb-8">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '300px' }}
          />
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600 mb-8">
            The product you are looking for does not exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Homepage
          </Link>
          <div className="text-sm text-gray-500">
            or
          </div>
          <Link
            href="/products"
            className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}