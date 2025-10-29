const ProductCardSkeleton = () => (
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

export default function Loading() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
          <div className="h-10 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
          </div>
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <div className="hidden lg:block">
              <div className="h-96 bg-gray-300 rounded animate-pulse"></div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}