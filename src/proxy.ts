import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'ebl_verify_super_secret_jwt_key_2026_masud_parvez';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const AUTH_COOKIE_NAME = 'ebl_admin_token';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let userRole = '';

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      isAuthenticated = true;
      userRole = (payload.role as string) || '';
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  const isAuthPath = pathname === '/login' || pathname === '/register';

  if (isProtectedPath) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=Unauthorized', request.url));
    }
  }

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
