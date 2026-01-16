/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path should be configured as a catch-all route.
 */

import Studio from './Studio'

// Disable static optimization for this route
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <Studio />
}
