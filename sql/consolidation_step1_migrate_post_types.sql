-- ============================================================
-- CONSOLIDATION STEP 1: Migrate all post types into yada_wiki
-- This merges labor_law, corona_virus, supreme_court, 
-- small_claims, tort into yada_wiki
-- ============================================================
-- IMPORTANT: Run these ONE AT A TIME and verify after each

-- 1A. Count before migration
SELECT post_type, COUNT(*) as cnt 
FROM wpjl_posts 
WHERE post_status = 'publish' 
  AND post_type IN ('yada_wiki','labor_law','corona_virus','supreme_court','small_claims','tort')
GROUP BY post_type;

-- 1B. Migrate labor_law → yada_wiki (13 articles)
UPDATE wpjl_posts 
SET post_type = 'yada_wiki' 
WHERE post_type = 'labor_law' AND post_status = 'publish';

-- 1C. Migrate corona_virus → yada_wiki (22 articles)
UPDATE wpjl_posts 
SET post_type = 'yada_wiki' 
WHERE post_type = 'corona_virus' AND post_status = 'publish';

-- 1D. Migrate supreme_court → yada_wiki (5 articles)
UPDATE wpjl_posts 
SET post_type = 'yada_wiki' 
WHERE post_type = 'supreme_court' AND post_status = 'publish';

-- 1E. Migrate small_claims → yada_wiki (1 article)
UPDATE wpjl_posts 
SET post_type = 'yada_wiki' 
WHERE post_type = 'small_claims' AND post_status = 'publish';

-- 1F. Migrate tort → yada_wiki (3 articles)
UPDATE wpjl_posts 
SET post_type = 'yada_wiki' 
WHERE post_type = 'tort' AND post_status = 'publish';

-- 1G. Verify after migration
SELECT post_type, COUNT(*) as cnt 
FROM wpjl_posts 
WHERE post_status = 'publish' 
  AND post_type IN ('yada_wiki','labor_law','corona_virus','supreme_court','small_claims','tort')
GROUP BY post_type;
-- Expected: yada_wiki should show ~215+, all others should show 0
