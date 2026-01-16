import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Simplified middleware for multi-tenant template
 *
 * The main prosophia-website handles subdomain detection and sets headers:
 * - x-tenant-id: The customer/tenant identifier
 * - x-tenant-subdomain: The subdomain used
 *
 * This middleware just ensures those headers are propagated if needed.
 */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get tenant info from incoming headers (set by prosophia-website middleware)
  const tenantId = request.headers.get('x-tenant-id')
  const tenantSubdomain = request.headers.get('x-tenant-subdomain')

  // If we have tenant info, ensure it's available for the app
  if (tenantId) {
    // Set cookie for client-side access if needed
    response.cookies.set('customerId', tenantId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
