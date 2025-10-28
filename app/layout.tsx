import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cookies } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import apiClient from '@/lib/apiClient';
import { User } from '@/types';

const inter = Inter({ subsets: ["latin"] });

const AUTH_COOKIE_NAME = 'auth_user';

export const metadata: Metadata = {
  title: 'Ecomversite',
  description: 'ECommerce Test Application',
};

async function getUserData(userId: string): Promise<User | null> {
  try {
    const user = await apiClient.get(`/users/${userId}`);
    return user as User;
  } catch (error) {
    console.error('Failed to fetch user in layout:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authCookieValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  let user: User | null = null;

  if (authCookieValue) {
    let userId: string | undefined = undefined;
    try {
      const userCookie = JSON.parse(authCookieValue);
      userId = userCookie.id;
    } catch (error) {
      console.error('Failed to parse auth cookie:', error);
    }

    if (userId) {
      user = await getUserData(String(userId));
    }
  }

  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <AuthProvider initialUser={user}>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 
