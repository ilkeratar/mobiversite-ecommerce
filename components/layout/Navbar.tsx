'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search 
} from 'lucide-react';

interface CartItem {
  id: number;
  quantity: number;
}

// TODO
// import { useAuth } from '@/context/AuthContext';
// import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TODO
  // const { user, logout } = useAuth();
  // const { cart } = useCart();
  
  // Temporary data (until Context's are connected)
  const user = null; 
  const cart: CartItem[] = [];

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
            <form className="relative">
              <input
                type="text"
                placeholder="Search for a product..."
                className="w-72 rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </form>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-gray-800">
              <Heart className="h-6 w-6" />
              {/* TODO: Wishlist count */}
            </Link>
            
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-800">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800">
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                {/* TODO: Logout button */}
                {/* <button onClick={logout} className="...">Log Out</button> */}
              </>
            ) : (
              <Link 
                href="/login" 
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Login
              </Link>
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
            <Link 
              href="/products" 
              className="block rounded-md px-3 py-2 text-base font-semibold text-gray-800 hover:bg-gray-100"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              All Products
            </Link>
            <Link 
              href="/cart" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Cart ({cartItemCount})
            </Link>
            <Link 
              href="/wishlist" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Wishlist
            </Link>
            {user ? (
              <Link 
                href="/profile" 
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="block rounded-md bg-blue-500 px-3 py-2 text-base font-medium text-white hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}