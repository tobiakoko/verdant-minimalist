/**
 * Security Utilities for URL and Input Validation
 */

/**
 * Validates that a URL is safe to use as an external link.
 * Prevents javascript: URLs, data: URLs, and other potentially malicious schemes.
 */
export function isValidExternalUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Validates that a URL is a valid Google Maps embed URL.
 * Only allows URLs from Google's embed domains.
 */
export function isValidGoogleMapsEmbedUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'www.google.com',
      'google.com',
      'maps.google.com',
    ];
    return (
      parsed.protocol === 'https:' &&
      allowedHosts.includes(parsed.hostname) &&
      parsed.pathname.startsWith('/maps/embed')
    );
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL for safe use in links.
 * Returns undefined if the URL is invalid.
 */
export function sanitizeUrl(url: string | undefined | null): string | undefined {
  if (isValidExternalUrl(url)) {
    return url as string;
  }
  return undefined;
}

/**
 * Validates an email address format.
 */
export function isValidEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') return false;

  // Basic email validation - checks for @ and domain
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email) && email.length <= 254;
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * Validates a slug format (lowercase alphanumeric with hyphens).
 */
export function isValidSlug(slug: string | undefined | null): boolean {
  if (!slug || typeof slug !== 'string') return false;

  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug) && slug.length <= 200;
}
