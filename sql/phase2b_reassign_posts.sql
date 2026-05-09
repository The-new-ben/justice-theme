-- ============================================================
-- PHASE 2B: REASSIGN EXISTING POSTS TO PROPER CATEGORIES
-- Maps known legitimate Hebrew posts to their correct categories
-- Run AFTER phase2_create_categories.sql
-- ============================================================

-- Step 1: Get the new category term_taxonomy_ids
-- (Run this SELECT first to see the IDs, then update the INSERTs below)
SELECT t.term_id, t.name, t.slug, tt.term_taxonomy_id
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'category'
ORDER BY t.name;

-- Step 2: Remove all posts from "Uncategorized" (category 1)
-- BUT only after they've been assigned to a real category
-- We'll do this per-post based on content/title matching

-- Family Law posts (גירושין, משפחה, נישואין, ירושה, צוואה, משמורת, מזונות)
-- This assigns posts containing family law keywords to the family-law category
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'family-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%גירושין%' OR p.post_title LIKE '%משפחה%'
  OR p.post_title LIKE '%נישואין%' OR p.post_title LIKE '%ירושה%'
  OR p.post_title LIKE '%צוואה%' OR p.post_title LIKE '%משמורת%'
  OR p.post_title LIKE '%מזונות%' OR p.post_title LIKE '%אפוטרופ%'
  OR p.post_title LIKE '%ידועים בציבור%' OR p.post_title LIKE '%כתובה%');

-- Criminal Law posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'criminal-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%פלילי%' OR p.post_title LIKE '%סמים%'
  OR p.post_title LIKE '%מעצר%' OR p.post_title LIKE '%רישום פלילי%'
  OR p.post_title LIKE '%כתב אישום%' OR p.post_title LIKE '%הלבנת הון%'
  OR p.post_title LIKE '%החזקת סמים%' OR p.post_title LIKE '%סחר בסמים%');

-- Traffic Law posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'traffic-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%תעבורה%' OR p.post_title LIKE '%שכרות%'
  OR p.post_title LIKE '%מהירות%' OR p.post_title LIKE '%נהיגה%'
  OR p.post_title LIKE '%רישיון%' OR p.post_title LIKE '%ביטוח חובה%'
  OR p.post_title LIKE '%נקודות%');

-- Labor Law posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'labor-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%עבודה%' OR p.post_title LIKE '%פיטורי%'
  OR p.post_title LIKE '%מעסיק%' OR p.post_title LIKE '%עובד%'
  OR p.post_title LIKE '%הטרדה מינית%' OR p.post_title LIKE '%שעות נוספות%');

-- Real Estate Law posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'real-estate-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%מקרקעין%' OR p.post_title LIKE '%דירה%'
  OR p.post_title LIKE '%תמ"א%' OR p.post_title LIKE '%שכירות%'
  OR p.post_title LIKE '%ליקויי בני%' OR p.post_title LIKE '%נדל"ן%');

-- Tax Law posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'tax-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%מס %' OR p.post_title LIKE '%מיסים%'
  OR p.post_title LIKE '%מיסוי%' OR p.post_title LIKE '%שומת%'
  OR p.post_title LIKE '%החזרי מס%' OR p.post_title LIKE '%רואה חשבון%');

-- Cyber Law posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'cyber-law'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%סייבר%' OR p.post_title LIKE '%פגסוס%'
  OR p.post_title LIKE '%האזנות%' OR p.post_title LIKE '%AGI%'
  OR p.post_title LIKE '%FBI%');

-- Court Rulings posts
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT p.ID, tt.term_taxonomy_id, 0
FROM wpjl_posts p
JOIN wpjl_term_taxonomy tt ON tt.taxonomy = 'category'
JOIN wpjl_terms t ON t.term_id = tt.term_id AND t.slug = 'court-rulings'
WHERE p.post_type = 'post' AND p.post_status = 'publish'
AND (p.post_title LIKE '%פס"ד%' OR p.post_title LIKE '%פסק דין%'
  OR p.post_title LIKE '%בית המשפט העליון%' OR p.post_title LIKE '%השופט%'
  OR p.post_title LIKE '%השופטת%' OR p.post_title LIKE '%בג"ץ%');

-- Update term counts after reassignment
UPDATE wpjl_term_taxonomy tt
SET count = (
    SELECT COUNT(*) FROM wpjl_term_relationships tr
    WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
);
