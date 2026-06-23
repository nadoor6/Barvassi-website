// middleware.js – Barvassi Admin IP Gatekeeper (Vercel Edge)
// Place this file in your project root

export default function middleware(req) {
  const url = new URL(req.url);
  
  // Only protect admin routes
  if (url.pathname === '/admin' || url.pathname === '/admin.html' || url.pathname.startsWith('/admin/')) {
    // Get the client's IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
               || req.headers.get('x-real-ip')
               || req.ip 
               || '0.0.0.0';

    const allowedIP = process.env.ADMIN_ALLOWED_IP || '';

    // If no allowed IP is set, block everything (fail secure)
    if (!allowedIP) {
      console.log('🚫 ADMIN BLOCKED: No ALLOWED_IP set');
      return new Response('Forbidden – Admin not configured', { status: 403 });
    }

    // Block if IP doesn't match
    if (ip !== allowedIP) {
      console.log(`🚫 ADMIN BLOCKED: ${ip} (allowed: ${allowedIP})`);
      return new Response('Forbidden', { status: 403 });
    }

    console.log(`✅ ADMIN GRANTED: ${ip} (matches ${allowedIP})`);
  }

  // Allow all other requests to proceed
}

// Required for Vercel Edge Runtime
export const config = {
  runtime: 'edge',
};