'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Package,
  ShoppingBag,
  Truck,
  Clock,
  Shield,
  Home,
  AlertCircle
} from 'lucide-react';

import Breadcrumb from '@/components/ui/Breadcrumb';
import { verifyOrderAction } from '@/lib/actions';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyOrder = async () => {
      const id = searchParams.get('orderId');
      
      if (!id) {
        // If no order ID, redirect to home
        router.push('/');
        return;
      }

      // Verify the order
      const result = await verifyOrderAction(id);
      
      if (!result.valid || result.error) {
        // Order is invalid or doesn't belong to user
        setError(result.error || 'Order not found');
        setLoading(false);
        // Redirect to home after showing error briefly
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        // Order is valid
        setOrderId(id);
        setLoading(false);
      }
    };

    verifyOrder();
  }, [searchParams, router]);

  const breadcrumbItems = [
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
    { label: 'Order Confirmation' }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Verifying order...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if order is invalid
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to home page...
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} className="mb-8" />

      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Order Successfully Created! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase!
          </p>
          <p className="text-gray-500 mb-8">
            Your order has been successfully placed and is being processed.
          </p>

          {/* Order Details */}
          {orderId && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 font-medium mb-2">Your Order Number</p>
              <p className="text-3xl font-bold text-blue-900">#{orderId}</p>
              <p className="text-sm text-blue-700 mt-2">
                Please save this number for tracking your order
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Confirmation</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive an email confirmation shortly with your order details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Processing</h4>
                  <p className="text-sm text-gray-600">
                    We'll prepare your items for shipment within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Shipping</h4>
                  <p className="text-sm text-gray-600">
                    Your order will be shipped and you'll receive tracking information
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
              <Truck className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Delivery within 1-3 business days</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 hover:shadow-md transition-shadow">
              <Clock className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Order Tracking</h3>
              <p className="text-sm text-gray-600">Real-time updates on your order</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
              <Shield className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Your transaction is protected</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile?tab=orders"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-md hover:shadow-lg"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 font-semibold"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 font-semibold"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-700 mb-4">
            If you have any questions about your order, our customer service team is here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 font-medium">
              Email Support
            </a>
            <span className="text-gray-400">•</span>
            <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 font-medium">
              Call Us
            </a>
            <span className="text-gray-400">•</span>
            <Link href="/profile?tab=orders" className="text-blue-600 hover:text-blue-700 font-medium">
              Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
