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

    // 🔍 DEBUG: Show what's happening (remove after testing)
    return new Response(
      `🔍 Diagnostic\n` +
      `Your IP: ${ip}\n` +
      `Allowed IP: ${allowedIP || 'NOT SET'}\n` +
      `Match: ${ip === allowedIP ? '✅ YES' : '❌ NO'}\n\n` +
      `(This is a diagnostic page. Remove this middleware after testing.)`,
      { status: 200 }
    );
  }

  // For all other routes, let them through
}
export const config = {
matcher: ['/admin', '/admin.html', '/admin/:path*'],
};