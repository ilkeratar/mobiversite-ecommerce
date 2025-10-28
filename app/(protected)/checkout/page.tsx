'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Package
} from 'lucide-react';
import { createOrderAction } from '@/lib/actions';
import { Address } from '@/types';

const SHIPPING_RATE = 15.00;
const TAX_RATE = 0.18;

type CheckoutStep = 'address' | 'payment' | 'review';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
  },
  {
    id: 'debit_card',
    name: 'Debit Card',
    description: 'Direct bank payment',
    icon: '💰',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🅿️',
  },
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: '💵',
  },
];

// Step Indicator Component (moved outside)
interface StepIndicatorProps {
  currentStep: CheckoutStep;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: 'address' as CheckoutStep, label: 'Shipping', icon: MapPin },
    { id: 'payment' as CheckoutStep, label: 'Payment', icon: CreditCard },
    { id: 'review' as CheckoutStep, label: 'Review', icon: Package },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                    ${isActive ? 'bg-blue-600 border-blue-600 text-white' : ''}
                    ${isCompleted ? 'bg-green-600 border-green-600 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-white border-gray-300 text-gray-400' : ''}
                  `}
                >
                  <StepIcon className="w-6 h-6" />
                </div>
                <span
                  className={`
                    mt-2 text-sm font-medium
                    ${isActive ? 'text-blue-600' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-0.5 flex-1 mx-2 transition-all
                    ${index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Address Step Component (moved outside)
interface AddressStepProps {
  user: any;
  addressForm: Address;
  addressErrors: Partial<Address>;
  isAddingAddress: boolean;
  onAddressFormChange: (field: keyof Address, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function AddressStep({ 
  user, 
  addressForm, 
  addressErrors, 
  isAddingAddress,
  onAddressFormChange,
  onSubmit
}: AddressStepProps) {
  const hasAddress = user?.address && 
    user.address.addressLine && 
    user.address.city && 
    user.address.zipcode && 
    user.address.country;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
      </div>

      {!hasAddress && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">No Address Found</h3>
            <p className="text-sm text-yellow-800">
              Please add your shipping address to continue with the checkout process.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addressLine"
            value={addressForm.addressLine || ''}
            onChange={(e) => onAddressFormChange('addressLine', e.target.value)}
            className={`
              w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${addressErrors.addressLine ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="123 Main Street, Apt 4B"
          />
          {addressErrors.addressLine && (
            <p className="mt-1 text-sm text-red-600">{addressErrors.addressLine}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={addressForm.city || ''}
              onChange={(e) => onAddressFormChange('city', e.target.value)}
              className={`
                w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${addressErrors.city ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="New York"
            />
            {addressErrors.city && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              value={addressForm.state || ''}
              onChange={(e) => onAddressFormChange('state', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="NY"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
              Zipcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipcode"
              value={addressForm.zipcode || ''}
              onChange={(e) => onAddressFormChange('zipcode', e.target.value)}
              className={`
                w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${addressErrors.zipcode ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="10001"
            />
            {addressErrors.zipcode && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.zipcode}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="country"
              value={addressForm.country || ''}
              onChange={(e) => onAddressFormChange('country', e.target.value)}
              className={`
                w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${addressErrors.country ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="United States"
            />
            {addressErrors.country && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.country}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <button
            type="submit"
            disabled={isAddingAddress}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingAddress ? 'Saving...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Payment Step Component (moved outside)
interface PaymentStepProps {
  selectedPaymentMethod: string;
  orderError: string;
  onPaymentMethodSelect: (methodId: string) => void;
  onBack: () => void;
  onProceed: () => void;
}

function PaymentStep({ 
  selectedPaymentMethod, 
  orderError,
  onPaymentMethodSelect,
  onBack,
  onProceed
}: PaymentStepProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
      </div>

      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onPaymentMethodSelect(method.id)}
            className={`
              w-full p-4 border-2 rounded-lg text-left transition-all
              ${selectedPaymentMethod === method.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              {selectedPaymentMethod === method.id && (
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {orderError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{orderError}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Address
        </button>

        <button
          type="button"
          onClick={onProceed}
          disabled={!selectedPaymentMethod}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}

// Review Step Component (moved outside)
interface ReviewStepProps {
  items: any[];
  addressForm: Address;
  selectedPaymentMethod: string;
  orderNotes: string;
  orderError: string;
  isProcessing: boolean;
  total: number;
  onOrderNotesChange: (notes: string) => void;
  onEditAddress: () => void;
  onEditPayment: () => void;
  onBack: () => void;
  onPlaceOrder: () => void;
}

function ReviewStep({
  items,
  addressForm,
  selectedPaymentMethod,
  orderNotes,
  orderError,
  isProcessing,
  total,
  onOrderNotesChange,
  onEditAddress,
  onEditPayment,
  onBack,
  onPlaceOrder
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      {/* Shipping Address Review */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
          </div>
          <button
            onClick={onEditAddress}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
        </div>
        <div className="text-gray-700 space-y-1">
          <p>{addressForm.addressLine}</p>
          <p>
            {addressForm.city}
            {addressForm.state && `, ${addressForm.state}`} {addressForm.zipcode}
          </p>
          <p>{addressForm.country}</p>
        </div>
      </div>

      {/* Payment Method Review */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          </div>
          <button
            onClick={onEditPayment}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
        </div>
        <div className="text-gray-700">
          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div
              key={`${item.id}-${JSON.stringify(item.selectedOptions)}`}
              className="py-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title || 'Product'}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-1">Quantity: {item.quantity}</p>
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.entries(item.selectedOptions)
                      .filter(([, value]) => value)
                      .map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {key}: {String(value)}
                        </span>
                      ))}
                  </div>
                )}
                <p className="font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Notes (Optional)</h3>
        <textarea
          value={orderNotes}
          onChange={(e) => onOrderNotesChange(e.target.value)}
          rows={4}
          placeholder="Add any special instructions for your order..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {orderError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{orderError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payment
        </button>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Place Order (${total.toFixed(2)})
            </>
          )}
        </button>
      </div>
    </div>
  );
}


// Order Summary Sidebar Component (moved outside)
interface OrderSummaryProps {
  currentStep: CheckoutStep;
  stats: any;
  subtotal: number;
  shipping: number;
  tax: number;
  promoDiscount: number;
  appliedPromoCode: string;
  total: number;
}

function OrderSummary({ 
  currentStep, 
  stats, 
  subtotal, 
  shipping, 
  tax, 
  promoDiscount,
  appliedPromoCode,
  total 
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal ({stats?.totalItems ?? 0} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Tax (18%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <div>
              <div className="font-medium">Promo Discount</div>
              <div className="text-xs">Code: {appliedPromoCode}</div>
            </div>
            <span className="font-medium">-${promoDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="mt-2 text-xs text-green-600 text-right">
            You saved ${promoDiscount.toFixed(2)}!
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Includes:</h4>
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
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Real-time order tracking</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Main Component
export default function CheckoutPage() {
  const { items, stats, clearCart, isLoading: cartLoading, appliedPromoCode, promoDiscount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState<Address>({
    addressLine: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
  });
  const [addressErrors, setAddressErrors] = useState<Partial<Address>>({});
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Calculate totals
  const subtotal = stats?.totalPrice ?? 0;
  const shipping = items && items.length > 0 ? SHIPPING_RATE : 0;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax - promoDiscount).toFixed(2));

  const breadcrumbItems = [
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout' }
  ];

  // Initialize address form with user's address if available
  useEffect(() => {
    if (user?.address) {
      setAddressForm(user.address);
    }
  }, [user]);

  // Redirect if cart is empty (but not if order was just placed)
  useEffect(() => {
    if (!cartLoading && (!items || items.length === 0) && !isOrderPlaced) {
      router.push('/cart');
    }
  }, [items, cartLoading, router, isOrderPlaced]);

  const validateAddress = useCallback((): boolean => {
    const errors: Partial<Address> = {};
    
    if (!addressForm.addressLine?.trim()) {
      errors.addressLine = 'Address line is required';
    }
    if (!addressForm.city?.trim()) {
      errors.city = 'City is required';
    }
    if (!addressForm.zipcode?.trim()) {
      errors.zipcode = 'Zipcode is required';
    }
    if (!addressForm.country?.trim()) {
      errors.country = 'Country is required';
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }, [addressForm]);

  const handleAddressFormChange = useCallback((field: keyof Address, value: string) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddressSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress()) {
      return;
    }

    setIsAddingAddress(true);
    
    // Simulate API call to update user address
    setTimeout(() => {
      setIsAddingAddress(false);
      setCurrentStep('payment');
    }, 500);
  }, [validateAddress]);

  const handlePaymentMethodSelect = useCallback((methodId: string) => {
    setSelectedPaymentMethod(methodId);
  }, []);

  const handleProceedToReview = useCallback(() => {
    if (!selectedPaymentMethod) {
      setOrderError('Please select a payment method');
      return;
    }
    setOrderError('');
    setCurrentStep('review');
  }, [selectedPaymentMethod]);

  const handlePlaceOrder = useCallback(async () => {
    setIsProcessing(true);
    setOrderError('');

    try {
      const result = await createOrderAction(
        items,
        total,
        selectedPaymentMethod,
        addressForm,
        orderNotes
      );

      if (result.error) {
        setOrderError(result.error);
        setIsProcessing(false);
      } else if (result.success && result.orderId) {
        // Mark order as placed to prevent cart empty redirect
        setIsOrderPlaced(true);
        // Clear cart before redirecting
        clearCart();
        // Redirect to success page with order ID
        router.push(`/checkout/success?orderId=${result.orderId}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setOrderError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  }, [items, total, selectedPaymentMethod, addressForm, orderNotes, clearCart, router]);

  // Loading state
  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase in a few simple steps</p>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 'address' && (
            <AddressStep
              user={user}
              addressForm={addressForm}
              addressErrors={addressErrors}
              isAddingAddress={isAddingAddress}
              onAddressFormChange={handleAddressFormChange}
              onSubmit={handleAddressSubmit}
            />
          )}
          {currentStep === 'payment' && (
            <PaymentStep
              selectedPaymentMethod={selectedPaymentMethod}
              orderError={orderError}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              onBack={() => setCurrentStep('address')}
              onProceed={handleProceedToReview}
            />
          )}
          {currentStep === 'review' && (
            <ReviewStep
              items={items}
              addressForm={addressForm}
              selectedPaymentMethod={selectedPaymentMethod}
              orderNotes={orderNotes}
              orderError={orderError}
              isProcessing={isProcessing}
              total={total}
              onOrderNotesChange={setOrderNotes}
              onEditAddress={() => setCurrentStep('address')}
              onEditPayment={() => setCurrentStep('payment')}
              onBack={() => setCurrentStep('payment')}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            currentStep={currentStep}
            stats={stats}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            promoDiscount={promoDiscount}
            appliedPromoCode={appliedPromoCode}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
