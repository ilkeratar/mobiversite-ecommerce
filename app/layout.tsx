import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mobiversite E-Commerce App',
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
        {/* TODO: Context API'leri oluşturduktan sonra 
          bu provider'lar ile uygulamayı sarmalayacağız.
        */}
        {/* <AuthProvider initialUser={user}> */}
        {/* <CartProvider> */}
        {/* <WishlistProvider> */}
        
        {children}
              {/* </WishlistProvider> */}
              {/* </CartProvider> */}
              {/* </AuthProvider> */}
      </body>
    </html>
  );
}
