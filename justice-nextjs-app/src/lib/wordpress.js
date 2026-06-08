const API_URL = process.env.WORDPRESS_API_URL || 'https://cms.jus-tice.co.il/graphql';

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`;
  }

  // Fetch from WPGraphQL
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 }, // Cache pages for 1 hour (ISR)
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API from Headless WordPress');
  }
  return json.data;
}

// 1. Get all page slugs (for static site generation routes)
export async function getAllPageSlugs() {
  const data = await fetchAPI(`
    query AllPageSlugs {
      pages(first: 100) {
        nodes {
          slug
        }
      }
    }
  `);
  return data?.pages?.nodes || [];
}

// 2. Get a single page by slug
export async function getPageBySlug(slug) {
  const data = await fetchAPI(`
    query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        title
        content
        slug
        date
        modified
      }
    }
  `, {
    variables: {
      id: slug,
      idType: 'URI'
    }
  });
  return data?.page;
}

// 3. Get all posts/articles
export async function getAllPosts() {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `);
  return data?.posts?.nodes || [];
}

// 4. Get post by slug (incorporates E-E-A-T reviewedBy metadata placeholders)
export async function getPostBySlug(slug) {
  const data = await fetchAPI(`
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        title
        content
        slug
        date
        modified
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  `, {
    variables: {
      id: slug,
      idType: 'SLUG'
    }
  });
  return data?.post;
}

// 5. Get all lawyers directory list
export async function getAllLawyers() {
  // Query custom post type: justice_lawyer
  const data = await fetchAPI(`
    query AllLawyers {
      posts(where: { postTypes: ["justice_lawyer"] }, first: 100) {
        nodes {
          title
          slug
          excerpt
          date
        }
      }
    }
  `);
  return data?.posts?.nodes || [];
}
