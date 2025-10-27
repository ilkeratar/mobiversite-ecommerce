'use client';

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

export default function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
  // Grid view skeleton
  if (viewMode === 'grid') {
    return (
      <div className="group relative animate-pulse">
        {/* Image skeleton */}
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-[7/8]"></div>
        
        {/* Title skeleton */}
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Rating skeleton */}
        <div className="mt-1 flex items-center gap-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-12 ml-2"></div>
        </div>

        {/* Price skeleton */}
        <div className="mt-1 h-6 bg-gray-200 rounded w-20"></div>
        
        {/* Button skeleton */}
        <div className="mt-4 w-full h-10 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  // List view skeleton
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-48 h-48 flex-shrink-0 bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          </div>
          
          {/* Category skeleton */}
          <div className="h-4 bg-gray-200 rounded w-24 mt-1"></div>
          
          {/* Rating skeleton */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-12 ml-2"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Price skeleton */}
          <div className="h-8 bg-gray-200 rounded w-24"></div>

          <div className="flex items-center gap-2">
            {/* Wishlist button skeleton */}
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            
            {/* Add to cart button skeleton */}
            <div className="w-32 h-10 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

