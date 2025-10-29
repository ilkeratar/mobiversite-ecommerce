'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Order } from '@/types';

interface OrderHistoryProps {
  orders: Order[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-gray-400 mb-6">No orders yet</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          {/* Order Header */}
          <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Order number</p>
                <p className="text-sm text-gray-600">
                  #{order.id.toString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Date placed</p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Total amount</p>
                <p className="text-sm text-gray-600">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <div className="space-y-6">
              {order.items.map((item, index) => {
                const completionDate = new Date(order.createdAt);
                completionDate.setDate(completionDate.getDate() + 6);
                
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="bg-gray-50 rounded-lg p-5"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-3"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 break-words">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 break-words">
                            {item.description || 'High-quality product with excellent features and durability.'}
                          </p>
                        </div>
                        
                        <span className="text-sm font-medium text-green-600">
                          Completed on {formatDate(completionDate.toISOString())}
                        </span>
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between text-left sm:text-right gap-3">
                        <p className="text-lg font-semibold text-gray-900 shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        
                        <Link
                          href={`/products/${item.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors whitespace-normal break-words"
                        >
                          View product
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>
                    {order.shippingAddress.city}
                    {order.shippingAddress.state &&
                      `, ${order.shippingAddress.state}`}{' '}
                    {order.shippingAddress.zipcode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
