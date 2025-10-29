'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Category, ProductFilters, ProductSortBy } from '@/types';
import ProductList from '@/components/products/ProductList';
import ProductSidebarFilters from '@/components/products/ProductSidebarFilters';
import { getProducts } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface ProductsPageClientProps {
  initialProducts: Product[];
  categories: Category[];
}

const sortOptions = [
  { name: 'Newest', value: ProductSortBy.NEWEST },
  { name: 'Price: Low to High', value: ProductSortBy.PRICE_ASC },
  { name: 'Price: High to Low', value: ProductSortBy.PRICE_DESC },
  { name: 'Best Rating', value: ProductSortBy.RATING_DESC },
  { name: 'Name: A to Z', value: ProductSortBy.NAME_ASC },
  { name: 'Name: Z to A', value: ProductSortBy.NAME_DESC },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductsPageClient({ 
  initialProducts, 
  categories 
}: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<ProductFilters>({
    search: initialSearchQuery
  });
  const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.NEWEST);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const router = useRouter();

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];


    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.details.inStock);
    }

    if (filters.rating !== undefined) {
      filtered = filtered.filter(product => product.rating.rate >= filters.rating!);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.details.brand === filters.brand);
    }

    if (filters.size) {
      filtered = filtered.filter(product => {
        const sizes = product.details.sizes || product.details.size;
        return sizes ? sizes.includes(filters.size!) : false;
      });
    }

    if (filters.color) {
      filtered = filtered.filter(product => {
        const colors = product.details.colors || product.details.color;
        return colors ? colors.includes(filters.color!) : false;
      });
    }

    if (filters.material) {
      filtered = filtered.filter(product => {
        const material = product.details.material;
        return material ? material.includes(filters.material!) : false;
      });
    }

    if (filters.storage) {
      filtered = filtered.filter(product => {
        const storage = product.details.storage;
        return storage ? storage.includes(filters.storage!) : false;
      });
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case ProductSortBy.PRICE_ASC:
        filtered.sort((a, b) => a.price - b.price);
        break;
      case ProductSortBy.PRICE_DESC:
        filtered.sort((a, b) => b.price - a.price);
        break;
      case ProductSortBy.RATING_DESC:
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case ProductSortBy.RATING_ASC:
        filtered.sort((a, b) => a.rating.rate - b.rating.rate);
        break;
      case ProductSortBy.NAME_ASC:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case ProductSortBy.NAME_DESC:
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case ProductSortBy.NEWEST:
      default:
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  const isInitialMount = useRef(true);

  // Load products when filters change
  useEffect(() => {
    const { search, category, minPrice, maxPrice, inStock } = filters;

    const loadProducts = async () => {
      setLoading(true);
      setError(undefined);
      
      try {
        const searchParams = new URLSearchParams();
        
        if (search) searchParams.set('q', search);
        if (category) searchParams.set('category', category);
        if (minPrice !== undefined) searchParams.set('minPrice', minPrice.toString());
        if (maxPrice !== undefined) searchParams.set('maxPrice', maxPrice.toString());
        if (inStock) searchParams.set('inStock', 'true');

        const newProducts = await getProducts(Object.fromEntries(searchParams));
        setProducts(newProducts);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      loadProducts();
    }
  }, [filters]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success('Product added to cart');
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product);
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== false
  );

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Sort and View Controls */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Products</h1>

          <div className="flex items-center gap-3">
            {/* Sort Menu */}
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <button
                        onClick={() => setSortBy(option.value)}
                        className={classNames(
                          option.value === sortBy ? 'font-medium text-gray-900' : 'text-gray-500',
                          'block w-full px-4 py-2 text-sm text-left data-focus:bg-gray-100 data-focus:outline-hidden',
                        )}
                      >
                        {option.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            {/* View Mode Toggle - Hidden on Mobile */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <Squares2X2Icon className="size-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsFiltersOpen(true)}
              className="-m-2 ml-2 p-2 text-gray-400 hover:text-gray-500 lg:hidden relative"
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon aria-hidden="true" className="size-5" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== undefined && v !== '' && v !== false).length}
                </span>
              )}
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

            <div className="hidden lg:block">
              <ProductSidebarFilters
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
              />
            </div>

            <div className="lg:hidden">
              <ProductSidebarFilters
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
              />
            </div>

            <div className="lg:col-span-3">
              <ProductList
                products={filteredAndSortedProducts}
                loading={loading}
                error={error}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
