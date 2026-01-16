// 1. Import the necessary tools from the libraries we installed.
import { createClient, QueryParams } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url';
import { getCustomerId } from './tenant';

// 2. Define the configuration variables for connecting to your Sanity project.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!; // Your project ID from .env.local
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'; // The dataset to connect to
const apiVersion = '2023-05-03'; // Use a fixed date for stable API results

// Check if multi-tenant mode is enabled
const isMultiTenantMode = process.env.NEXT_PUBLIC_MULTI_TENANT === 'true';

// --- Custom Error Check ---
// This check runs when the code is built. It will immediately stop the build
// with a clear message if the Project ID isn't found.
if (!projectId) {
  console.error("The `NEXT_PUBLIC_SANITY_PROJECT_ID` environment variable is missing or not loaded correctly.");
  throw new Error(
    "Configuration error: Sanity Project ID is not defined. Please check your .env file or Vercel environment variables."
  );
}


// 3. Create the main client for fetching data.
// This client object is what you'll use to send queries to Sanity.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `true` for faster performance, `false` for fresh data every time
});

// 4. Create a helper function for generating Image URLs.
// This takes the raw image data from Sanity and turns it into usable URLs.
const builder = createImageUrlBuilder(client);

// The analogy: Sanity gives you a "recipe" for an image.
// The urlFor function is the "chef" that turns that recipe into an actual image URL.
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============================================
// MULTI-TENANT QUERY HELPERS
// ============================================

/**
 * Fetch data with automatic customer ID filtering (for multi-tenant mode)
 * In single-tenant mode, this just passes through to the regular client
 * If in multi-tenant mode but no customerId, returns null/empty (direct template access)
 */
export async function fetchTenantData<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  if (!isMultiTenantMode) {
    return client.fetch<T>(query, params);
  }

  const customerId = await getCustomerId();

  // If no customer ID in multi-tenant mode, return empty/null result
  // This happens when accessing the template directly without going through prosophia.io
  if (!customerId) {
    // Return appropriate empty value based on query type
    // Arrays return [], single documents return null
    const isArrayQuery = !query.includes('[0]');
    return (isArrayQuery ? [] : null) as T;
  }

  return client.fetch<T>(query, { ...params, customerId });
}

/**
 * Generate a GROQ filter for the current tenant
 * Use this when building queries manually
 */
export function tenantFilter(): string {
  if (!isMultiTenantMode) {
    return '';
  }
  return '&& customerId == $customerId';
}

// ============================================
// COMMON QUERIES (Multi-tenant aware)
// ============================================

export async function fetchSiteSettings() {
  const filter = tenantFilter();
  const query = `*[_type == "siteSettings" ${filter}][0]`;
  return fetchTenantData(query);
}

export async function fetchHomePage() {
  const filter = tenantFilter();
  const query = `*[_type == "homePage" ${filter}][0]`;
  return fetchTenantData(query);
}

export async function fetchPublications() {
  const filter = tenantFilter();
  const query = `*[_type == "publication" ${filter}] | order(publicationDate desc)`;
  return fetchTenantData(query);
}

export async function fetchTeamMembers() {
  const filter = tenantFilter();
  const query = `*[_type == "person" ${filter}] | order(orderRank asc)`;
  return fetchTenantData(query);
}

export async function fetchNewsArticles(limit?: number) {
  const filter = tenantFilter();
  const limitClause = limit ? `[0...${limit}]` : '';
  const query = `*[_type == "newsArticle" ${filter}] | order(publicationDate desc) ${limitClause}`;
  return fetchTenantData(query);
}

export async function fetchResearchPage() {
  const filter = tenantFilter();
  const query = `*[_type == "researchPage" ${filter}][0]`;
  return fetchTenantData(query);
}

export async function fetchContactPage() {
  const filter = tenantFilter();
  const query = `*[_type == "contactPage" ${filter}][0]`;
  return fetchTenantData(query);
}

export async function fetchGalleryImages() {
  const filter = tenantFilter();
  const query = `*[_type == "galleryImage" ${filter}] | order(_createdAt desc)`;
  return fetchTenantData(query);
}