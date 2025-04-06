import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/', '/about', '/contact', '/features'];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // For authenticated routes, check user flow
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
      headers: {
        Cookie: `token=${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Handle user flow based on nextStep
    if (path !== '/pricing' && data.nextStep === 'pricing' && !path.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
    
    if (path !== '/setup' && data.nextStep === 'setup' && !path.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/setup', request.url));
    }
    
    // If user is trying to access setup but has already completed it
    if (path === '/setup' && data.hasCompany && data.setupStatus.has_completed_office_setup) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // If user is trying to access dashboard but hasn't subscribed
    if (path === '/dashboard' && !data.hasActiveSubscription) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
    
  } catch (error) {
    console.error('Middleware error:', error);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/login|api/auth/register|api/auth/check).*)',
  ],
};