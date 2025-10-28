import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cookies } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import apiClient from '@/lib/apiClient';
import { Product, User } from '@/types';

const inter = Inter({ subsets: ["latin"] });

const AUTH_COOKIE_NAME = 'auth_user';

export const metadata: Metadata = {
  title: {
    default: 'Ecomversite - Modern E-Commerce Platform',
    template: '%s | Ecomversite'
  },
  description: 'Discover quality products across electronics, fashion, and accessories. Modern shopping experience with secure payments and fast delivery.',
  keywords: ['e-commerce', 'online shopping', 'electronics', 'fashion', 'jewelry', 'accessories'],
  authors: [{ name: 'Ecomversite Team' }],
  
  // SEO & Social Media
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Ecomversite',
    title: 'Ecomversite - Modern E-Commerce Platform',
    description: 'Discover quality products across electronics, fashion, and accessories.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecomversite - Modern E-Commerce Platform',
    description: 'Discover quality products across electronics, fashion, and accessories.',
  },
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

async function getWishlistProducts(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }

  try {
    const query = ids.map(id => `id=${id}`).join('&');
    const products = await apiClient.get(`/products?${query}`);
    return products as Product[];
  } catch (error) {
    console.error('Failed to fetch wishlist products:', error);
    return [];
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

  let initialWishlistItems: Product[] = [];

  if (user && user.wishlist && user.wishlist.length > 0) {
    initialWishlistItems = await getWishlistProducts(user.wishlist);
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider initialUser={user}>
          <CartProvider>
            <WishlistProvider initialItems={initialWishlistItems}>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 
