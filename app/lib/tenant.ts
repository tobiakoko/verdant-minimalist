import { headers, cookies } from 'next/headers'

/**
 * Get the current customer ID from the request context
 * This is set by the prosophia-website middleware based on subdomain or custom domain
 * Returns null if no customer ID is found (direct access to template)
 */
export async function getCustomerId(): Promise<string | null> {
  const headersList = await headers()

  // Check for tenant headers set by prosophia-website middleware
  const tenantId = headersList.get('x-tenant-id')
  if (tenantId) {
    return tenantId
  }

  const tenantSubdomain = headersList.get('x-tenant-subdomain')
  if (tenantSubdomain) {
    return tenantSubdomain
  }

  // Legacy header name
  const customerId = headersList.get('x-customer-id')
  if (customerId) {
    return customerId
  }

  // Fallback to cookie (for client components or edge cases)
  const cookieStore = await cookies()
  const cookieCustomerId = cookieStore.get('customerId')?.value

  if (cookieCustomerId) {
    return cookieCustomerId
  }

  // Development fallback - use env variable
  if (process.env.DEV_CUSTOMER_ID) {
    return process.env.DEV_CUSTOMER_ID
  }

  // No customer ID found - return null instead of throwing
  // This happens when accessing the template directly
  return null
}

/**
 * Check if we're running in multi-tenant mode
 */
export function isMultiTenantMode(): boolean {
  return process.env.NEXT_PUBLIC_MULTI_TENANT === 'true'
}
