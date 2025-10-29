'use client';

import { useRouter } from 'next/navigation';

import { User, Order } from '@/types';
import AccountSettings from '@/components/profile/AccountSettings';
import OrderHistory from '@/components/profile/OrderHistory';

interface ProfileClientProps {
  user: User;
  orders: Order[];
  activeTab: string;
}

type TabType = 'account' | 'orders';

export default function ProfileClient({ user, orders, activeTab }: ProfileClientProps) {
  const router = useRouter();

  const handleTabChange = (tab: TabType) => {
    router.push(`/profile?tab=${tab}`);
  };

  const isActiveTab = (tab: TabType) => activeTab === tab;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your account and orders
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            <button
              onClick={() => handleTabChange('account')}
              className={`
                pb-4 text-sm font-medium transition-colors relative cursor-pointer
                ${
                  isActiveTab('account')
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              Account
              {isActiveTab('account') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={`
                pb-4 text-sm font-medium transition-colors relative cursor-pointer
                ${
                  isActiveTab('orders')
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              Orders
              {orders.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">
                  ({orders.length})
                </span>
              )}
              {isActiveTab('orders') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div>
          {isActiveTab('account') && <AccountSettings user={user} />}
          {isActiveTab('orders') && <OrderHistory orders={orders} />}
        </div>
      </div>
    </div>
  );
}
