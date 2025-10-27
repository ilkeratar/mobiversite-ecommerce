// Örnek bir loading.tsx
// ProductList'te yaptığımız skeleton'un aynısını buraya koyabilirsin.
// Bu, sayfanın kabuğudur (shell).

const ProductCardSkeleton = () => (
  <div className="group relative border border-gray-200 rounded-lg p-4 animate-pulse">
    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-300 lg:aspect-none h-48"></div>
    <div className="mt-4 flex flex-col space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header (Filtre/Sıralama alanı) için de bir skeleton */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
          <div className="h-10 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
          </div>
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filtre Skeleton */}
            <div className="hidden lg:block">
              <div className="h-96 bg-gray-300 rounded animate-pulse"></div>
            </div>
            
            {/* Ürün Listesi Skeleton */}
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