import { NextResponse } from 'next/server';
import redirectMap from './lib/redirect-map.json';

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  
  // 1. Decode URI characters (crucial for Hebrew slugs like %D7%90... to match decoded keys)
  let lookupPath = pathname;
  try {
    lookupPath = decodeURIComponent(pathname);
  } catch (e) {
    // If the path is malformed, return 404 response immediately
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
    const targetPath = destinationSlug.startsWith('/') ? destinationSlug : `/${destinationSlug}`;
    
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
