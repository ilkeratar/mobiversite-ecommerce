import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_user';

const protectedRoutes = ['/profile', '/wishlist'];

const publicOnlyRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  const cookie = request.cookies.get(AUTH_COOKIE_NAME);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicOnlyRoute && cookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};