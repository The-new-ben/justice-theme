-- ============================================================
-- AUTO-CATEGORIZE: Assign practice-areas to uncategorized articles
-- 334 articles have NO category - fix by title keyword matching
-- ============================================================

-- First, get the term_taxonomy_ids we need
-- Run this to see current IDs:
SELECT t.term_id, t.name, t.slug, tt.term_taxonomy_id
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'practice-areas'
ORDER BY tt.count DESC;

-- ============================================================
-- CRIMINAL LAW: Match articles about criminal topics
-- ============================================================
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT DISTINCT p.ID, 
  (SELECT tt.term_taxonomy_id FROM wpjl_terms t2 
   JOIN wpjl_term_taxonomy tt ON t2.term_id=tt.term_id 
   WHERE t2.slug='criminal-law' AND tt.taxonomy='practice-areas' LIMIT 1)
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' 
  AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL
  AND (p.post_title LIKE '%פלילי%' 
    OR p.post_title LIKE '%מעצר%'
    OR p.post_title LIKE '%עבירות%' 
    OR p.post_title LIKE '%סמים%'
    OR p.post_title LIKE '%רצח%'
    OR p.post_title LIKE '%גניבה%'
    OR p.post_title LIKE '%הלבנת הון%'
    OR p.post_title LIKE '%סחיטה%'
    OR p.post_title LIKE '%שוחד%'
    OR p.post_title LIKE '%FBI%'
    OR p.post_title LIKE '%יורופול%');

-- ============================================================
-- FAMILY LAW: Match divorce, custody, alimony articles
-- ============================================================
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT DISTINCT p.ID,
  (SELECT tt.term_taxonomy_id FROM wpjl_terms t2 
   JOIN wpjl_term_taxonomy tt ON t2.term_id=tt.term_id 
   WHERE t2.slug='family-law' AND tt.taxonomy='practice-areas' LIMIT 1)
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' 
  AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL
  AND (p.post_title LIKE '%גירושין%'
    OR p.post_title LIKE '%משמורת%'
    OR p.post_title LIKE '%מזונות%'
    OR p.post_title LIKE '%משפחה%'
    OR p.post_title LIKE '%ירושה%'
    OR p.post_title LIKE '%צוואה%'
    OR p.post_title LIKE '%הסכם ממון%'
    OR p.post_title LIKE '%ידועים בציבור%'
    OR p.post_title LIKE '%כתובה%'
    OR p.post_title LIKE '%אלימות במשפחה%');

-- ============================================================
-- EMPLOYMENT LAW
-- ============================================================
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT DISTINCT p.ID,
  (SELECT tt.term_taxonomy_id FROM wpjl_terms t2 
   JOIN wpjl_term_taxonomy tt ON t2.term_id=tt.term_id 
   WHERE t2.slug='employment-law' AND tt.taxonomy='practice-areas' LIMIT 1)
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' 
  AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL
  AND (p.post_title LIKE '%עבודה%'
    OR p.post_title LIKE '%פיטורים%'
    OR p.post_title LIKE '%עובד%'
    OR p.post_title LIKE '%מעסיק%'
    OR p.post_title LIKE '%שכר%'
    OR p.post_title LIKE '%פנסיה%'
    OR p.post_title LIKE '%הטרדה%'
    OR p.post_title LIKE '%חופשה%'
    OR p.post_title LIKE '%פיצויי פיטורים%');

-- ============================================================
-- REAL ESTATE LAW
-- ============================================================
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT DISTINCT p.ID,
  (SELECT tt.term_taxonomy_id FROM wpjl_terms t2 
   JOIN wpjl_term_taxonomy tt ON t2.term_id=tt.term_id 
   WHERE t2.slug='real-estate-law' AND tt.taxonomy='practice-areas' LIMIT 1)
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' 
  AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL
  AND (p.post_title LIKE '%מקרקעין%'
    OR p.post_title LIKE '%נדל"ן%'
    OR p.post_title LIKE '%דירה%'
    OR p.post_title LIKE '%תמ"א%'
    OR p.post_title LIKE '%שכירות%'
    OR p.post_title LIKE '%טאבו%'
    OR p.post_title LIKE '%בנייה%');

-- ============================================================
-- LAWYER DIRECTORY: general lawyer articles
-- ============================================================
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT DISTINCT p.ID,
  (SELECT tt.term_taxonomy_id FROM wpjl_terms t2 
   JOIN wpjl_term_taxonomy tt ON t2.term_id=tt.term_id 
   WHERE t2.slug='lawyer-directory' AND tt.taxonomy='practice-areas' LIMIT 1)
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' 
  AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL
  AND (p.post_title LIKE '%עורך דין%'
    OR p.post_title LIKE '%עורכי דין%'
    OR p.post_title LIKE '%עו"ד%'
    OR p.post_title LIKE '%משרד עורכי%');

-- ============================================================
-- VERIFICATION: Check how many are still uncategorized
-- ============================================================
SELECT COUNT(*) as still_uncategorized
FROM wpjl_posts p
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wpjl_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id 
  AND tt.taxonomy = 'practice-areas'
WHERE p.post_type = 'articles' 
  AND p.post_status = 'publish'
  AND tt.term_taxonomy_id IS NULL;

-- ============================================================
-- UPDATE CATEGORY COUNTS (WordPress doesn't auto-update these)
-- ============================================================
UPDATE wpjl_term_taxonomy tt
SET count = (
  SELECT COUNT(*)
  FROM wpjl_term_relationships tr
  JOIN wpjl_posts p ON tr.object_id = p.ID
  WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
    AND p.post_status = 'publish'
    AND p.post_type = 'articles'
)
WHERE tt.taxonomy = 'practice-areas';
