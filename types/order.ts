import { CartItem } from './product';
import { Address } from './user';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus | string;
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: Address;
  paymentMethod?: string;
  notes?: string;
}

export interface OrderSummary {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus | string;
  createdAt: string;
  itemCount: number;
}

export interface CreateOrderPayload {
  userId: number;
  items: CartItem[];
  shippingAddress?: Address;
  paymentMethod?: string;
  notes?: string;
}

