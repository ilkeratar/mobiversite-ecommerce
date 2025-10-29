'use client';

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

export default function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
  // Grid view skeleton
  if (viewMode === 'grid') {
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
        {/* Image skeleton */}
        <div className="relative w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200"></div>
        
        {/* Content skeleton */}
        <div className="p-5">
          {/* Category skeleton */}
          <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
          
          {/* Title skeleton */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Rating skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
            <div className="h-3 bg-gray-200 rounded w-10"></div>
          </div>

          {/* Price skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-7 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        
        {/* Button skeleton */}
        <div className="px-5 pb-5">
          <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // List view skeleton
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        {/* Image skeleton */}
        <div className="relative w-full sm:w-64 h-64 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Category skeleton */}
            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
            
            {/* Title skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Rating skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
              <div className="h-3 bg-gray-200 rounded w-10"></div>
            </div>

            {/* Brand skeleton */}
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          </div>

          {/* Price and Actions skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="h-9 bg-gray-200 rounded w-28"></div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Wishlist button skeleton */}
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              
              {/* Add to cart button skeleton */}
              <div className="flex-1 sm:flex-initial w-full sm:w-40 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

