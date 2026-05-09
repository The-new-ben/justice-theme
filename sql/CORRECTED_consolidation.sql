-- ============================================================
-- CORRECTED CONSOLIDATION: Merge INTO 'articles' (NOT yada_wiki)
-- The 'articles' post type is the PRIMARY content with 1,017 pieces
-- All other post types merge INTO articles
-- ============================================================

-- STEP 1: Verify current state
SELECT post_type, COUNT(*) as cnt 
FROM wpjl_posts 
WHERE post_status = 'publish' 
GROUP BY post_type 
ORDER BY cnt DESC;

-- STEP 2: Migrate yada_wiki → articles (174 posts)
UPDATE wpjl_posts 
SET post_type = 'articles' 
WHERE post_type = 'yada_wiki' AND post_status = 'publish';

-- STEP 3: Migrate labor_law → articles (13 posts)
UPDATE wpjl_posts 
SET post_type = 'articles' 
WHERE post_type = 'labor_law' AND post_status = 'publish';

-- STEP 4: Migrate corona_virus → articles (22 posts)
UPDATE wpjl_posts 
SET post_type = 'articles' 
WHERE post_type = 'corona_virus' AND post_status = 'publish';

-- STEP 5: Migrate supreme_court → articles (5 posts)
UPDATE wpjl_posts 
SET post_type = 'articles' 
WHERE post_type = 'supreme_court' AND post_status = 'publish';

-- STEP 6: Migrate tort → articles (3 posts)
UPDATE wpjl_posts 
SET post_type = 'articles' 
WHERE post_type = 'tort' AND post_status = 'publish';

-- STEP 7: Migrate small_claims → articles (1 post)
UPDATE wpjl_posts 
SET post_type = 'articles' 
WHERE post_type = 'small_claims' AND post_status = 'publish';

-- STEP 8: Verify final count
-- Expected: articles should now show ~1,235 (1017 + 174 + 13 + 22 + 5 + 3 + 1)
SELECT post_type, COUNT(*) as cnt 
FROM wpjl_posts 
WHERE post_status = 'publish' 
GROUP BY post_type 
ORDER BY cnt DESC;

-- STEP 9: Find what taxonomy the 'articles' post type uses
SELECT DISTINCT tt.taxonomy, COUNT(*) as cnt
FROM wpjl_term_relationships tr
JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
JOIN wpjl_posts p ON tr.object_id = p.ID
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
GROUP BY tt.taxonomy;

-- STEP 10: See existing categories for 'articles' post type
SELECT t.term_id, t.name, t.slug, tt.taxonomy, tt.count, tt.parent
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
JOIN wpjl_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
JOIN wpjl_posts p ON tr.object_id = p.ID
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
GROUP BY t.term_id, t.name, t.slug, tt.taxonomy, tt.count, tt.parent
ORDER BY tt.taxonomy, tt.count DESC;
