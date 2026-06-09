import { NextResponse } from 'next/server';
import redirectMap from './lib/redirect-map.json';

import { getLocalHub, getAllLocalSpokes } from './lib/wordpress';

export function middleware(request) {
  let pathname, search;
  let lookupPath;
  try {
    ({ pathname, search } = request.nextUrl);
    lookupPath = decodeURIComponent(pathname);
  } catch (e) {
    return new NextResponse(null, { status: 404 });
  }

  // 2. Normalize: lowercase and trim
  lookupPath = lookupPath.toLowerCase().trim();

  // 3. Normalize trailing slash: if it ends with '/' and length > 1, strip it for lookup
  let altLookupPath = lookupPath;
  if (lookupPath.endsWith('/') && lookupPath.length > 1) {
    altLookupPath = lookupPath.slice(0, -1);
  } else if (!lookupPath.endsWith('/')) {
    altLookupPath = lookupPath + '/';
  }

  // 4. Perform direct lookup in the pre-compiled redirect mapping
  // Checks both raw path and slash/no-slash variations
  const destinationSlug = redirectMap[lookupPath] || redirectMap[altLookupPath];

  if (destinationSlug) {
    // If destination slug is a full URL path (e.g. starts with '/'), redirect there
    let targetPath = destinationSlug.startsWith('/') ? destinationSlug : `/${destinationSlug}`;
    
    // Resolve if the target path is a category hub or spoke page to avoid double redirects
    const cleanSlug = targetPath.replace(/^\/+|\/+$/g, '');
    const hub = getLocalHub(cleanSlug);
    if (hub) {
      targetPath = `/practice-areas/${hub.slug}`;
    } else {
      const spokes = getAllLocalSpokes();
      const spoke = spokes.find(s => s.slug === cleanSlug);
      if (spoke) {
        targetPath = `/practice-areas/${spoke.category}/${spoke.slug}`;
      }
    }
    
    // Construct the destination URL preserving query search parameters
    const targetUrl = new URL(targetPath + search, request.url);
    
    return NextResponse.redirect(targetUrl, 301);
  }

  return NextResponse.next();
}

// Enforce middleware only on content pages, excluding static resources and APIs
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (public static assets)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
};
