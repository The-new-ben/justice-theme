import { getAllPageSlugs, getAllPosts, getAllLawyers } from '@/lib/wordpress';

export default async function sitemap() {
  const domain = 'https://jus-tice.co.il';
  
  // Fetch dynamic content from headless CMS, fallback to empty arrays if offline
  const [pages, posts, lawyers] = await Promise.all([
    getAllPageSlugs().catch((err) => {
      console.warn('Sitemap warning: Failed to fetch pages from headless WordPress', err.message);
      return [];
    }),
    getAllPosts().catch((err) => {
      console.warn('Sitemap warning: Failed to fetch posts from headless WordPress', err.message);
      return [];
    }),
    getAllLawyers().catch((err) => {
      console.warn('Sitemap warning: Failed to fetch lawyers from headless WordPress', err.message);
      return [];
    }),
  ]);

  // Map CMS pages
  const pageEntries = pages.map((page) => ({
    url: `${domain}/${encodeURIComponent(page.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Map CMS blog posts / guides
  const postEntries = posts.map((post) => ({
    url: `${domain}/${encodeURIComponent(post.slug)}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Map CMS lawyer profile routes
  const lawyerEntries = lawyers.map((lawyer) => ({
    url: `${domain}/lawyers/${encodeURIComponent(lawyer.slug)}`,
    lastModified: lawyer.date ? new Date(lawyer.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...pageEntries,
    ...postEntries,
    ...lawyerEntries,
  ];
}
