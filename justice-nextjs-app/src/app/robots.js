export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/private/'],
    },
    sitemap: 'https://jus-tice.co.il/sitemap.xml',
  };
}
