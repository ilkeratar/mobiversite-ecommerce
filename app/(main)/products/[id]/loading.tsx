export default function Loading() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 h-4 w-64 bg-gray-200 rounded animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image skeleton */}
          <div className="w-full">
            <div className="relative w-full aspect-square rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* Right: Content skeleton */}
          <div className="w-full">
            {/* Title */}
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />

            {/* Price */}
            <div className="mt-4 h-6 w-32 bg-gray-200 rounded animate-pulse" />

            {/* Rating */}
            <div className="mt-4 h-5 w-40 bg-gray-200 rounded animate-pulse" />

            {/* Color options */}
            <div className="mt-6">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Size options */}
            <div className="mt-6">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 flex gap-2 flex-wrap">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 w-14 bg-gray-200 rounded-md animate-pulse" />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <div className="h-12 flex-1 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-12 w-12 bg-gray-200 rounded-md animate-pulse" />
            </div>

            {/* Description */}
            <div className="mt-10 space-y-3">
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Key details */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
