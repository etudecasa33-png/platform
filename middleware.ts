import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth');
  const clientAuth = request.cookies.get('client_auth'); // The new client key
  const path = request.nextUrl.pathname;

  // Let APIs and images load normally
  if (path.startsWith('/api/') || path.startsWith('/uploads')) {
    return NextResponse.next();
  }

  const isLoginPage = path === '/login';

  // SCENARIO 1: Nobody is logged in -> Kick to Login screen
  if (!adminAuth && !clientAuth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // SCENARIO 2: A CLIENT is logged in
  if (clientAuth && !adminAuth) {
    // If they try to go ANYWHERE except their portal, force them back to the portal
    if (path !== '/portal' && !isLoginPage) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    // If they are on the login page, send to portal
    if (isLoginPage) return NextResponse.redirect(new URL('/portal', request.url));
  }

  // SCENARIO 3: The ADMIN (You) is logged in
  if (adminAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};