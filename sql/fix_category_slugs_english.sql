-- ============================================================
-- CATEGORY RESTRUCTURE: Rebuild practice-areas taxonomy
-- with ENGLISH slugs, proper hierarchy, and SEO-optimized naming
-- ============================================================
-- Run AFTER consolidation step 1

-- STEP 1: First see what categories currently exist
SELECT t.term_id, t.name, t.slug, tt.term_taxonomy_id, tt.count, tt.parent
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'practice-areas'
ORDER BY tt.count DESC;

-- STEP 2: Update existing Hebrew slugs to English
-- (Only update slugs, keep Hebrew names for display)

-- Most valuable categories - update slugs to English
UPDATE wpjl_terms SET slug = 'criminal-law' 
WHERE slug = '%d7%9e%d7%a9%d7%a4%d7%98-%d7%a4%d7%9c%d7%99%d7%9c%d7%99' OR name = 'משפט פלילי';

UPDATE wpjl_terms SET slug = 'family-law' 
WHERE name = 'דיני משפחה';

UPDATE wpjl_terms SET slug = 'personal-injury' 
WHERE name = 'דיני נזיקין' OR name = 'נזיקין';

UPDATE wpjl_terms SET slug = 'employment-law' 
WHERE name = 'דיני עבודה';

UPDATE wpjl_terms SET slug = 'real-estate-law' 
WHERE name = 'מקרקעין' OR name = 'נדל"ן';

UPDATE wpjl_terms SET slug = 'tax-law' 
WHERE name = 'מיסים' OR name = 'דיני מיסים';

UPDATE wpjl_terms SET slug = 'international-law' 
WHERE name = 'משפט בינלאומי';

UPDATE wpjl_terms SET slug = 'cyber-law' 
WHERE name = 'סייבר' OR name = 'דיני סייבר';

UPDATE wpjl_terms SET slug = 'lawyer-directory' 
WHERE name = 'עורך דין' OR name = 'עורכי דין';

UPDATE wpjl_terms SET slug = 'criminal-defense-lawyer' 
WHERE name = 'עורך דין פלילי';

UPDATE wpjl_terms SET slug = 'divorce-lawyer' 
WHERE name = 'עורך דין גירושין' OR name = 'גירושין';

UPDATE wpjl_terms SET slug = 'notary-services' 
WHERE name = 'נוטריון';

UPDATE wpjl_terms SET slug = 'law-firms' 
WHERE name = 'משרדי עורכי דין';

UPDATE wpjl_terms SET slug = 'legal-guides' 
WHERE name = 'מדריכים משפטיים' OR name = 'מדריכים';

-- STEP 3: Verify the slug updates
SELECT t.term_id, t.name, t.slug, tt.count
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'practice-areas'
ORDER BY tt.count DESC;

-- NOTE: After running this, go to WordPress Admin > Settings > Permalinks
-- and click "Save Changes" to flush rewrite rules
