import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Authentication check
  const token = request.cookies.get('token')?.value;
  if (!token &&
      !pathname.startsWith('/login') &&
      !pathname.startsWith('/register') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Set cache control for static assets
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/images') ||
    pathname.includes('.svg') ||
    pathname.includes('.jpg') ||
    pathname.includes('.png')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except for API routes that handle their own caching
    '/((?!api/avatar/download|api/face).*)',
    // Match all static files
    '/_next/static/:path*',
    '/images/:path*',
  ],
};