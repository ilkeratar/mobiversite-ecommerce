"use server";

import apiClient from './apiClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {CartItem, Order, User } from '@/types';

const AUTH_COOKIE_NAME = 'auth_user';

export interface AuthState {
      error?: string;
    }

export async function login(
      prevState: AuthState | undefined, 
      formData: FormData
    ): Promise<AuthState>{
      
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const rememberMe = String(formData.get('remember-me') || '') === 'on';
  const redirectPath = String(formData.get('redirect') || '/');

  if (!email || !password) {
    return { error: 'Missing credentials' };
  }

  let users: User[] = [];
  try {
    users = await apiClient.get('/users', { email });
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'Unexpected error occurred. Please try again later.' };
  }

  const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30d or 7d

  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE_NAME,
    JSON.stringify({ id: user!.id }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    }
  );

  redirect(redirectPath);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/');
}

export interface CreateOrderState {
  error?: string;
  success?: boolean;
  orderId?: number;
}

export interface UpdateAddressState {
  error?: string;
  success?: boolean;
}

export async function updateUserAddress(
  prevState: UpdateAddressState | undefined,
  formData: FormData
): Promise<UpdateAddressState> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!authCookie) {
    return { error: 'Unauthorized' };
  }

  let userId: number | undefined = undefined;
  try {
    const userCookie = JSON.parse(authCookie);
    userId = userCookie.id;
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return { error: 'Unexpected error occurred. Please try again later.' };
  }

  const addressLine = String(formData.get('addressLine') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const state = String(formData.get('state') || '').trim();
  const zipcode = String(formData.get('zipcode') || '').trim();
  const country = String(formData.get('country') || '').trim();

  if (!addressLine || !city || !zipcode || !country) {
    return { error: 'All address fields are required except state' };
  }

  const address = {
    addressLine,
    city,
    state,
    zipcode,
    country,
  };

  try {
    await apiClient.patch(`/users/${userId}`, { address });
    return { success: true };
  } catch (error) {
    console.error('Failed to update address:', error);
    return { error: 'Failed to update address. Please try again later.' };
  }
}

export async function createOrderAction(
  items: CartItem[],
  total: number,
  paymentMethod: string,
  shippingAddress?: any,
  notes?: string
): Promise<CreateOrderState> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if(!authCookie) {
    return { error: 'Unauthorized' };
  }

  let userId: number | undefined = undefined;
  try {
    const userCookie = JSON.parse(authCookie);
    userId = userCookie.id;
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return { error: 'Unexpected error occurred. Please try again later.' };
  }
  if(!items || items.length === 0) {
    return { error: 'Items are required' };
  }

  const newOrder: Omit<Order, 'id'> = {
    userId: userId!,
    items,
    totalPrice: total,
    status: 'completed',
    createdAt: new Date().toISOString(),
    shippingAddress,
    paymentMethod,
    notes,
  };

  try {
    const createdOrder = await apiClient.post('/orders', newOrder);
    return { success: true, orderId: createdOrder.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { error: 'Failed to create order. Please try again later.' };
  }
}

export interface VerifyOrderState {
  error?: string;
  valid?: boolean;
  order?: Order;
}

export async function verifyOrderAction(orderId: string): Promise<VerifyOrderState> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if(!authCookie) {
    return { error: 'Unauthorized', valid: false };
  }

  let userId: number | undefined = undefined;
  try {
    const userCookie = JSON.parse(authCookie);
    userId = userCookie.id;
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return { error: 'Unauthorized', valid: false };
  }

  // Validate orderId is a number
  const orderIdNum = parseInt(orderId, 10);
  if (isNaN(orderIdNum)) {
    return { error: 'Invalid order ID', valid: false };
  }

  try {
    // Fetch the order
    const order: Order = await apiClient.get(`/orders/${orderIdNum}`);
    
    // Verify the order exists and belongs to the current user
    if (!order || order.userId !== userId) {
      return { error: 'Order not found or unauthorized', valid: false };
    }

    return { valid: true, order };
  } catch (error) {
    console.error('Failed to verify order:', error);
    return { error: 'Order not found', valid: false };
  }
}