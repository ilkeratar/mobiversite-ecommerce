'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, Tag, X } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';


const SHIPPING_RATE = 15.00;
const TAX_RATE = 0.18;

export default function CartPage() {
  const { 
    items, 
    stats, 
    isLoading, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    appliedPromoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode
  } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const subtotal = stats?.totalPrice ?? 0;
  const shipping = items && items.length > 0 ? SHIPPING_RATE : 0;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax - promoDiscount).toFixed(2));

  const handleClearCart = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    setIsClearing(true);
    clearCart();
    setIsConfirmOpen(false);
    toast.success('Your cart has been cleared');
    setTimeout(() => setIsClearing(false), 300);
  };

  const handleApplyPromoCode = () => {
    const trimmedCode = promoCode.trim();
    
    if (!trimmedCode) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    const success = applyPromoCode(trimmedCode);
    if (success) {
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleRemovePromoCode = () => {
    removePromoCode();
    setPromoCode('');
    setPromoError('');
  };

  const breadcrumbItems = [
    { label: 'Shopping Cart' }
  ];

  const handleQuantityChange = (
    productId: number,
    currentQuantity: number,
    change: number,
    selectedOptions?: any
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0 && newQuantity <= 99) {
      updateQuantity(productId, newQuantity, selectedOptions);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Start shopping by browsing our products and add your favorites to the cart.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Left Side - Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Cart Items Header */}
            <div className="px-3 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const itemSubtotal = Number((item.price * item.quantity).toFixed(2));
                
                return (
                  <div
                    key={`${item.id}-${JSON.stringify(item.selectedOptions)}`}
                    className="p-3 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.id}`}
                        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title || 'Product image'}
                            width={128}
                            height={128}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.id}`}
                              className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                            >
                              {item.title || 'Product'}
                            </Link>
                            {item.category && (
                              <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedOptions)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Remove from Cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Selected Options */}
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Object.entries(item.selectedOptions).map(([key, value]) => (
                              value && (
                                <span
                                  key={key}
                                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                >
                                  <span className="font-medium capitalize">{key}:</span>
                                  <span className="ml-1">{value}</span>
                                </span>
                              )
                            ))}
                          </div>
                        )}

                        {/* Price and Quantity Controls */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-gray-600">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1, item.selectedOptions)}
                                disabled={item.quantity <= 1}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1;
                                  if (newQuantity > 0 && newQuantity <= 99) {
                                    updateQuantity(item.id, newQuantity, item.selectedOptions);
                                  }
                                }}
                                className="w-10 sm:w-14 text-center border-x border-gray-300 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.selectedOptions)}
                                disabled={item.quantity >= 99}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          <div className="text-left sm:text-right w-full sm:w-auto">
                            <div className="text-xs text-gray-500 mb-1">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-gray-900">
                              ${itemSubtotal.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Stock Status */}
                        {item.details && (
                          <div className="mt-3">
                            {item.details.inStock ? (
                              <span className="inline-flex items-center text-xs text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs text-red-700">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                Out of Stock
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="px-3 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-4">
            <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>

            <div className="px-3 sm:px-6 py-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-gray-700">
                <span className="text-sm">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-gray-700">
                <div>
                  <div className="text-sm">Shipping</div>
                  <div className="text-xs text-gray-500">Standard delivery</div>
                </div>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>

              {/* Tax */}
              <div className="flex items-center justify-between text-gray-700">
                <div>
                  <div className="text-sm">Tax Estimate</div>
                  <div className="text-xs text-gray-500">(18%)</div>
                </div>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              {/* Promo Discount */}
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <div>
                      <div className="text-sm font-medium">Promo Discount</div>
                      <div className="text-xs">Code: {appliedPromoCode}</div>
                    </div>
                  </div>
                  <span className="font-medium">-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-gray-900">
                  <span className="text-lg font-bold">Order Total</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="mt-2 text-xs text-green-600 text-right">
                    You saved ${promoDiscount.toFixed(2)}!
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                disabled={items.some(item => item.details && !item.details.inStock)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleCheckout}
              >
                {items.some(item => item.details && !item.details.inStock) 
                  ? 'Item Out of Stock' 
                  : 'Proceed to Checkout'
                }
              </button>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Order Information
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Free returns within 30 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>1-3 business days delivery</span>
                  </li>
                </ul>
              </div>

              {/* Promo Code */}
              <div className="pt-4 border-t border-gray-200">
                {appliedPromoCode ? (
                  // Applied promo code display
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-green-900">
                            Promo Code Applied
                          </div>
                          <div className="text-xs text-green-700">
                            {appliedPromoCode} - 20% off
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleRemovePromoCode}
                        className="text-green-600 hover:text-green-800 transition-colors p-1"
                        title="Remove promo code"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Promo code input
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Have a promo code?
                      </span>
                      <span className="transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value.toUpperCase());
                            setPromoError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyPromoCode();
                            }
                          }}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        />
                        <button 
                          onClick={handleApplyPromoCode}
                          className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <div className="text-xs text-red-600 flex items-center gap-1">
                          <span className="font-medium">✕</span>
                          {promoError}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 italic">
                        Tip: Try "MOBIVERSITE" for 20% off!
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>

          {/* Cart Statistics */}
          <div className="mt-4 lg:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">
              Cart Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-blue-600 mb-1">Total Items</div>
                <div className="text-base sm:text-lg font-bold text-blue-900">{stats?.totalItems ?? 0}</div>
              </div>
              <div>
                <div className="text-blue-600 mb-1">Unique Products</div>
                <div className="text-base sm:text-lg font-bold text-blue-900">{stats?.uniqueProducts ?? 0}</div>
              </div>
              <div className="col-span-2">
                <div className="text-blue-600 mb-1">Average Item Price</div>
                <div className="text-base sm:text-lg font-bold text-blue-900">
                  ${(stats?.averageItemPrice ?? 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Clear cart"
        description={
          'This will remove all items from your cart. This action cannot be undone.'
        }
        confirmText="Clear cart"
        cancelText="Cancel"
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

