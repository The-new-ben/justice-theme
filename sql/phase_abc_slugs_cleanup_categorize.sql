-- ============================================================
-- PHASE A: Convert practice-areas category slugs to English
-- These are the 47 categories that control URL structure
-- ============================================================

-- Step 1: Update top categories (highest traffic first)
-- עורך דין (term_id 308, count 157)
UPDATE wpjl_terms SET slug = 'lawyer-directory' WHERE term_id = 308;

-- דיני משפחה (term_id 68, count 154) 
UPDATE wpjl_terms SET slug = 'family-law' WHERE term_id = 68;

-- משפט פלילי (term_id 170, count 113)
UPDATE wpjl_terms SET slug = 'criminal-law' WHERE term_id = 170;

-- פסקי דין חשובים (term_id 646, count 81)
UPDATE wpjl_terms SET slug = 'court-rulings' WHERE term_id = 646;

-- דיני נזיקין (term_id 76, count 21)
UPDATE wpjl_terms SET slug = 'personal-injury' WHERE term_id = 76;

-- גירושין (term_id 392, count 28)
UPDATE wpjl_terms SET slug = 'divorce' WHERE term_id = 392;

-- דיני עבודה (term_id 325, count 16)
UPDATE wpjl_terms SET slug = 'employment-law' WHERE term_id = 325;

-- נהיגה בשכרות (term_id 401, count 16)
UPDATE wpjl_terms SET slug = 'dui' WHERE term_id = 401;

-- פלילי פסקי דין חשובים (term_id 642, count 31)
UPDATE wpjl_terms SET slug = 'criminal-court-rulings' WHERE term_id = 642;

-- פסקי דין גירושין (term_id 651, count 30)
UPDATE wpjl_terms SET slug = 'family-court-rulings' WHERE term_id = 651;

-- פורטוגל (term_id 683, count 44) 
UPDATE wpjl_terms SET slug = 'portugal' WHERE term_id = 683;

-- Step 2: Update remaining categories by name matching
-- (for categories where we don't have exact term_id)
UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'real-estate-law'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%מקרקעין%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'privacy-law'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%פגיעה בפרטיות%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'class-action'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%תביעה ייצוגית%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'traffic-court-rulings'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%פסקי דין תעבורה%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'knesset'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%כנסת%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'child-custody'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%משמורת%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'child-support'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%מזונות%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'tax-law'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%מיסים%' OR t.name LIKE '%מס%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'immigration-law'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%הגירה%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'military-law'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%צבאי%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'medical-malpractice'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%רשלנות רפואית%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'contract-law'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%חוזים%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'intellectual-property'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%קניין רוחני%';

UPDATE wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
SET t.slug = 'notary-services'
WHERE tt.taxonomy = 'practice-areas' AND t.name LIKE '%נוטריון%';

-- Step 3: Catch-all - update any remaining Hebrew slugs to transliterated English
-- This query finds practice-areas categories still with Hebrew slugs
SELECT t.term_id, t.name, t.slug 
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'practice-areas' AND t.slug LIKE '%d7%'
ORDER BY tt.count DESC;

-- ============================================================
-- PHASE B: Delete empty/broken articles
-- ============================================================

-- Delete articles with 0 content
DELETE FROM wpjl_posts WHERE ID = 8562 AND post_type = 'articles';

-- ============================================================  
-- PHASE C: Auto-categorize uncategorized articles
-- Match articles to practice-areas by title keywords
-- ============================================================

-- Family law articles
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT p.ID, tt.term_taxonomy_id
FROM wpjl_posts p, wpjl_term_taxonomy tt
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
  AND tt.taxonomy = 'practice-areas' AND tt.term_id = 68
  AND (p.post_title LIKE '%גירושין%' OR p.post_title LIKE '%משפחה%' 
       OR p.post_title LIKE '%משמורת%' OR p.post_title LIKE '%מזונות%'
       OR p.post_title LIKE '%ירושה%' OR p.post_title LIKE '%צוואה%')
  AND p.ID NOT IN (SELECT object_id FROM wpjl_term_relationships 
                   JOIN wpjl_term_taxonomy ON wpjl_term_relationships.term_taxonomy_id = wpjl_term_taxonomy.term_taxonomy_id 
                   WHERE wpjl_term_taxonomy.taxonomy = 'practice-areas');

-- Criminal law articles
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT p.ID, tt.term_taxonomy_id
FROM wpjl_posts p, wpjl_term_taxonomy tt
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
  AND tt.taxonomy = 'practice-areas' AND tt.term_id = 170
  AND (p.post_title LIKE '%פלילי%' OR p.post_title LIKE '%מעצר%'
       OR p.post_title LIKE '%עבירות%' OR p.post_title LIKE '%סמים%'
       OR p.post_title LIKE '%רצח%' OR p.post_title LIKE '%גניבה%')
  AND p.ID NOT IN (SELECT object_id FROM wpjl_term_relationships 
                   JOIN wpjl_term_taxonomy ON wpjl_term_relationships.term_taxonomy_id = wpjl_term_taxonomy.term_taxonomy_id 
                   WHERE wpjl_term_taxonomy.taxonomy = 'practice-areas');

-- Real estate articles
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT p.ID, tt.term_taxonomy_id
FROM wpjl_posts p, wpjl_term_taxonomy tt
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
  AND tt.taxonomy = 'practice-areas' 
  AND t.slug = 'real-estate-law'
  AND (p.post_title LIKE '%מקרקעין%' OR p.post_title LIKE '%נדל"ן%'
       OR p.post_title LIKE '%דירה%' OR p.post_title LIKE '%תמ"א%'
       OR p.post_title LIKE '%שכירות%')
  AND p.ID NOT IN (SELECT object_id FROM wpjl_term_relationships 
                   JOIN wpjl_term_taxonomy ON wpjl_term_relationships.term_taxonomy_id = wpjl_term_taxonomy.term_taxonomy_id 
                   WHERE wpjl_term_taxonomy.taxonomy = 'practice-areas');

-- Employment law articles
INSERT IGNORE INTO wpjl_term_relationships (object_id, term_taxonomy_id)
SELECT p.ID, tt.term_taxonomy_id
FROM wpjl_posts p, wpjl_term_taxonomy tt
WHERE p.post_type = 'articles' AND p.post_status = 'publish'
  AND tt.taxonomy = 'practice-areas' AND tt.term_id = 325
  AND (p.post_title LIKE '%עבודה%' OR p.post_title LIKE '%פיטורים%'
       OR p.post_title LIKE '%עובד%' OR p.post_title LIKE '%מעסיק%'
       OR p.post_title LIKE '%שכר%')
  AND p.ID NOT IN (SELECT object_id FROM wpjl_term_relationships 
                   JOIN wpjl_term_taxonomy ON wpjl_term_relationships.term_taxonomy_id = wpjl_term_taxonomy.term_taxonomy_id 
                   WHERE wpjl_term_taxonomy.taxonomy = 'practice-areas');
