import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Only protect admin routes
  if (path.startsWith('/admin') || path === '/admin.html') {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
               || request.ip 
               || '0.0.0.0';

    const allowedIP = process.env.ADMIN_ALLOWED_IP;

    // Block if IP doesn't match
    if (ip !== allowedIP) {
      return new Response('Forbidden', { status: 403 });
    }

    // Log successful access (visible in Vercel logs)
    console.log(`✅ Admin access granted to IP: ${ip}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin.html', '/admin/:path*'],
};