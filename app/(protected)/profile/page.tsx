import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { User, Order } from '@/types';
import ProfileClient from './ProfileClient';

const AUTH_COOKIE_NAME = 'auth_user';

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

async function getUserData(userId: number): Promise<User | null> {
  try {
    const user: User = await apiClient.get(`/users/${userId}`);
    return user;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}

async function getUserOrders(userId: number): Promise<Order[]> {
  try {
    const orders: Order[] = await apiClient.get('/orders', { userId });
    // Sort by creation date (newest first)
    return orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!authCookie) {
    redirect('/login?redirect=/profile');
  }

  let userId: number;
  try {
    const userCookie = JSON.parse(authCookie);
    userId = userCookie.id;
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    redirect('/login?redirect=/profile');
  }

  // Fetch user data and orders in parallel
  const [userData, userOrders] = await Promise.all([
    getUserData(userId),
    getUserOrders(userId),
  ]);

  if (!userData) {
    redirect('/login?redirect=/profile');
  }

  const params = await searchParams;
  const activeTab = params.tab || 'account';

  return (
    <ProfileClient 
      user={userData} 
      orders={userOrders} 
      activeTab={activeTab} 
    />
  );
}

