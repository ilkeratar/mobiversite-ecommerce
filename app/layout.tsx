import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cookies } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ecomversite',
  description: 'ECommerce Test Application',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionId = (await cookies()).get('session_id')?.value;
  // TODO
  // const user = sessionId ? await getUserFromApi(sessionId) : null;
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <AuthProvider initialUser={null}>
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
