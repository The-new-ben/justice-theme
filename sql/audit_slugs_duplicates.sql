-- ============================================================
-- ARTICLE SLUG AUDIT: Find Hebrew slugs that need English conversion
-- Run these queries to identify all Hebrew-encoded slugs
-- ============================================================

-- Query 1: Find all articles with Hebrew slugs (URL-encoded Hebrew starts with %d7)
SELECT ID, post_title, post_name as current_slug, post_type
FROM wpjl_posts 
WHERE post_type = 'articles' 
  AND post_status = 'publish'
  AND post_name LIKE '%d7%'
ORDER BY ID DESC
LIMIT 50;

-- Query 2: Count how many articles have Hebrew vs English slugs
SELECT 
  CASE 
    WHEN post_name LIKE '%d7%' THEN 'HEBREW_SLUG'
    ELSE 'ENGLISH_SLUG'
  END as slug_type,
  COUNT(*) as cnt
FROM wpjl_posts
WHERE post_type = 'articles' AND post_status = 'publish'
GROUP BY slug_type;

-- Query 3: Find potential DUPLICATE/CANNIBALIZING titles
-- Articles with similar titles that may compete for same keyword
SELECT p1.ID as id1, p1.post_title as title1, 
       p2.ID as id2, p2.post_title as title2
FROM wpjl_posts p1
JOIN wpjl_posts p2 ON p1.ID < p2.ID
WHERE p1.post_type = 'articles' AND p1.post_status = 'publish'
  AND p2.post_type = 'articles' AND p2.post_status = 'publish'
  AND (
    p1.post_title LIKE CONCAT('%', SUBSTRING(p2.post_title, 1, 20), '%')
    OR p2.post_title LIKE CONCAT('%', SUBSTRING(p1.post_title, 1, 20), '%')
  )
LIMIT 50;

-- Query 4: Find thin content (articles with very short content)
SELECT ID, post_title, post_name, 
       LENGTH(post_content) as content_length,
       CHAR_LENGTH(post_content) as char_count
FROM wpjl_posts
WHERE post_type = 'articles' AND post_status = 'publish'
ORDER BY content_length ASC
LIMIT 30;

-- Query 5: Find articles with no categories assigned
SELECT p.ID, p.post_title, p.post_name
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL
LIMIT 50;
