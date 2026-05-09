-- ============================================================
-- CONSOLIDATION STEP 2: Delete spam categories
-- These are casino/hacker-injected categories with 0 content
-- ============================================================

-- 2A. Verify spam categories have 0 posts
SELECT t.term_id, t.name, t.slug, tt.count
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE t.slug IN (
  'blog',            -- "best" category
  'casino-minimum-deposit',
  'blog-2',          -- cassinoBR
  'en',              -- EN
  'fi',              -- FI
  'pt',              -- PT
  'uncategorized-3',
  'uncategorized-6',
  'www-zaferhurdametal-com'
);

-- 2B. Delete term_taxonomy entries for spam categories
DELETE tt FROM wpjl_term_taxonomy tt
JOIN wpjl_terms t ON t.term_id = tt.term_id
WHERE t.slug IN (
  'blog','casino-minimum-deposit','blog-2','en','fi','pt',
  'uncategorized-3','uncategorized-6','www-zaferhurdametal-com'
);

-- 2C. Delete term entries for spam categories
DELETE FROM wpjl_terms
WHERE slug IN (
  'blog','casino-minimum-deposit','blog-2','en','fi','pt',
  'uncategorized-3','uncategorized-6','www-zaferhurdametal-com'
);

-- 2D. Clean up any orphaned term_relationships
DELETE tr FROM wpjl_term_relationships tr
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
WHERE tt.term_taxonomy_id IS NULL;

-- 2E. Verify - should return 0 rows
SELECT t.term_id, t.name, t.slug
FROM wpjl_terms t
WHERE t.slug IN (
  'blog','casino-minimum-deposit','blog-2','en','fi','pt',
  'uncategorized-3','uncategorized-6','www-zaferhurdametal-com'
);
