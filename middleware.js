export function middleware(request) {
  const url = new URL(request.url);
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

    // ✅ If IP matches, do nothing – let the request continue
    // (no return = proceed to the static file)
  }

  // For all other routes, also do nothing – let them through
}

export const config = {
  matcher: ['/admin', '/admin.html', '/admin/:path*'],
};