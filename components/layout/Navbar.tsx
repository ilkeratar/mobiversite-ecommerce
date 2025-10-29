'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search,
  ChevronDown,
  Package,
  LogOut,
  Loader2
} from 'lucide-react';

import { User as AppUser, Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { logout } from '@/lib/actions';
import { getProducts } from '@/services/productService';


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const { user } = useAuth();
  const { stats } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartItemCount = stats?.totalItems ?? 0;
  const wishlistItemCount = (wishlistItems || []).length;

  const computeDisplayName = (user: AppUser | null): string => {
    if (!user) return 'Login';
    const first = user.name?.firstname || '';
    const last = user.name?.lastname || '';
    const full = `${first} ${last}`.trim();
    return full || user.email;
  };

  const computeInitials = (user: AppUser | null): string => {
    if (!user) return '👤';
    const first = user.name?.firstname?.[0] || user.email?.[0] || 'U';
    const last = user.name?.lastname?.[0] || '';
    return (first + last).toUpperCase();
  };

  const displayName = computeDisplayName(user);
  const initials = computeInitials(user);

  // Search functionality
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    try {
      const allProducts = await getProducts();
      const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 results
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white justify-between whitespace-nowrap shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                <svg 
                  className="h-8 w-8 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-800">
              Ecomversite
              </span>
            </Link>
          </div>

          {/* Middle Section: Search and Main Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              href="/products" 
              className="rounded-md px-4 py-2 text-base font-semibold text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              All Products
            </Link>
            
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a product..."
                  className="w-72 rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
                )}
              </form>

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 object-contain rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.title}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {product.category}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              ${product.price.toFixed(2)}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 p-2">
                        <button
                          onClick={() => {
                            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          See all results for &quot;{searchQuery}&quot;
                        </button>
                      </div>
                    </>
                  ) : searchQuery && !isSearching ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">No products found</p>
                      <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-gray-800">
                <Heart className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
            )}
            
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-800">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {!user ? (
              <Link
                href="/login"
                className="group inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm cursor-pointer transition-colors transition-shadow duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                  <User className="h-4 w-4" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium text-gray-500">Helllo,</span>
                  <span className="text-sm font-semibold text-gray-800">Login</span>
                </span>
              </Link>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="group inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm cursor-pointer transition-colors transition-shadow duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                    <span className="text-xs font-semibold leading-none">{initials}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="flex flex-col items-start leading-tight">
                      <span className="text-[11px] font-medium text-gray-500">Helllo,</span>
                      <span className="text-sm font-semibold text-gray-800">{displayName}</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>My Orders</span>
                      </Link>
                      <div className="my-1 border-t border-gray-200" />
                      <form action={logout}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>

          {/* Mobile Menu (Open/Close) */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Mobile Search */}
            <div className="px-3 pt-2 pb-3">
              <div className="relative">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a product..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
                  )}
                </form>
                
                {/* Mobile Search Results */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="py-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                handleProductClick(product.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-12 h-12 object-contain rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.title}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {product.category}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                ${product.price.toFixed(2)}
                              </p>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 p-2">
                          <button
                            onClick={() => {
                              router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            See all results for &quot;{searchQuery}&quot;
                          </button>
                        </div>
                      </>
                    ) : searchQuery && !isSearching ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <Link 
              href="/products" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-100"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              <Package className="h-5 w-5 text-gray-500" />
              <span>All Products</span>
            </Link>
            <Link 
              href="/cart" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5 text-gray-500" />
              <span>Cart ({cartItemCount})</span>
            </Link>
            {user && (
              <Link 
                href="/wishlist" 
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                <Heart className="h-5 w-5 text-gray-500" />
                <span>Wishlist ({wishlistItemCount})</span>
              </Link>
            )}
                {!user ? (
                  <Link 
                    href="/login" 
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Login</span>
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-5 w-5 text-gray-500" />
                      <span>My Account</span>
                    </Link>
                    <Link 
                      href="/profile?tab=orders" 
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Package className="h-5 w-5 text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                    <form action={logout}>
                      <button 
                        type="submit" 
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                )}
          </div>
        </div>
      )}
    </nav>
  );
}