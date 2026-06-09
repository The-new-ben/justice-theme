import { 
  getAllPageSlugs, 
  getAllPosts, 
  getAllLawyers,
  getAllLocalHubs,
  getAllLocalSpokes
} from '@/lib/wordpress';

export default async function sitemap() {
  const domain = 'https://jus-tice.co.il';
  
  // 1. Fetch static pages, lawyers, and posts (dynamic CMS content or fallbacks)
  const [pages, lawyers, posts] = await Promise.all([
    getAllPageSlugs().catch(() => []),
    getAllLawyers().catch(() => []),
    getAllPosts().catch(() => []),
  ]);

  // 2. Fetch local/offline hubs and spokes for strict silo structure mapping
  const hubs = getAllLocalHubs();
  const spokes = getAllLocalSpokes();

  // Create helper sets of hub categories and spoke slugs to prevent keyword cannibalization/duplicates
  const hubCategories = new Set(hubs.map(hub => hub.category));
  const spokeSlugs = new Set(spokes.map(spoke => spoke.slug));
  const isDuplicate = (slug) => hubCategories.has(slug) || spokeSlugs.has(slug);

  // Map CMS static pages (e.g. about-us, contact) - excluding any category hub or spoke slugs
  const pageEntries = pages
    .filter(page => !isDuplicate(page.slug))
    .map((page) => ({
      url: `${domain}/${encodeURIComponent(page.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // Map CMS posts (blog articles) - excluding any category hub or spoke slugs
  const postEntries = posts
    .filter(post => !isDuplicate(post.slug))
    .map((post) => ({
      url: `${domain}/${encodeURIComponent(post.slug)}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  // Map Practice Area Hubs (Pillars) -> /practice-areas/[category]
  const hubEntries = hubs.map((hub) => ({
    url: `${domain}/practice-areas/${encodeURIComponent(hub.category)}`,
    lastModified: new Date(hub.modified || hub.date),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Map Practice Area Spokes -> /practice-areas/[category]/[slug]
  const spokeEntries = spokes.map((spoke) => ({
    url: `${domain}/practice-areas/${encodeURIComponent(spoke.category)}/${encodeURIComponent(spoke.slug)}`,
    lastModified: new Date(spoke.modified || spoke.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Map CMS lawyer profile routes -> /lawyers/[slug]
  const lawyerEntries = lawyers.map((lawyer) => ({
    url: `${domain}/lawyers/${encodeURIComponent(lawyer.slug)}`,
    lastModified: lawyer.date ? new Date(lawyer.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Directory indexes
  const directoryEntries = [
    {
      url: `${domain}/lawyers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${domain}/practice-areas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ];

  return [
    {
      url: `${domain}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...directoryEntries,
    ...pageEntries,
    ...postEntries,
    ...hubEntries,
    ...spokeEntries,
    ...lawyerEntries,
  ];
}
