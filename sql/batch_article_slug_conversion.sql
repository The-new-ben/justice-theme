-- ============================================================
-- BATCH ARTICLE SLUG CONVERSION: Hebrew → English
-- This converts article post_name (slug) from Hebrew to English
-- Must be done carefully with 301 redirects planned
-- ============================================================

-- PHASE 1: Identify the scale of the problem
-- Count articles with Hebrew slugs
SELECT 
  CASE WHEN post_name LIKE '%d7%' THEN 'HEBREW' ELSE 'ENGLISH' END as type,
  COUNT(*) as cnt
FROM wpjl_posts 
WHERE post_type='articles' AND post_status='publish'
GROUP BY type;

-- PHASE 2: Sample articles to understand naming patterns
SELECT ID, post_title, post_name, post_date
FROM wpjl_posts
WHERE post_type='articles' AND post_status='publish' AND post_name NOT LIKE '%d7%'
ORDER BY post_date DESC
LIMIT 20;

-- PHASE 3: For articles that ALREADY have English slugs, verify quality
SELECT ID, post_title, post_name
FROM wpjl_posts
WHERE post_type='articles' AND post_status='publish' AND post_name NOT LIKE '%d7%'
ORDER BY ID;

-- ============================================================
-- NOTE: Converting 1,183 Hebrew slugs to English cannot be done
-- with simple SQL UPDATE. Each article needs a unique, SEO-optimized 
-- English slug that matches its content.
--
-- OPTIONS:
-- A) WordPress plugin: "Custom Permalinks" or "Permalink Manager Pro"
--    - Can batch-update slugs
--    - Creates automatic 301 redirects
--
-- B) PHP script via functions.php to transliterate titles
--    - Can auto-generate English slugs from Hebrew titles
--    - Needs Google Translate API or manual mapping
--
-- C) Manual SQL with pre-built mapping table
--    - Most control but most labor
--
-- RECOMMENDED: Option A (Permalink Manager Pro plugin)
-- It handles slug changes AND creates 301 redirects automatically
-- ============================================================

-- PHASE 4: For NOW, fix the most high-value articles that rank well
-- These are articles with high traffic potential keywords

-- Attorney directory / lawyer search pages
UPDATE wpjl_posts SET post_name = 'find-lawyer-guide'
WHERE post_type='articles' AND post_title LIKE '%איך למצוא עורך דין%' AND post_name LIKE '%d7%';

UPDATE wpjl_posts SET post_name = 'lawyer-costs-guide'
WHERE post_type='articles' AND post_title LIKE '%כמה עולה עורך דין%' AND post_name LIKE '%d7%';

UPDATE wpjl_posts SET post_name = 'how-to-file-lawsuit'
WHERE post_type='articles' AND post_title LIKE '%איך מגישים תביעה%' AND post_name LIKE '%d7%';

-- Criminal law high-value pages
UPDATE wpjl_posts SET post_name = 'criminal-lawyer-arrest-costs'
WHERE post_type='articles' AND post_title LIKE '%הליך המעצר%כמה עולה%' AND post_name LIKE '%d7%';

UPDATE wpjl_posts SET post_name = 'sex-crimes-defense-lawyer'
WHERE post_type='articles' AND post_title LIKE '%עבירות מין%' AND post_name LIKE '%d7%' LIMIT 1;

-- Family law pages
UPDATE wpjl_posts SET post_name = 'divorce-lawyer-guide'
WHERE post_type='articles' AND post_title LIKE '%עורך דין גירושין%' AND post_name LIKE '%d7%' LIMIT 1;

UPDATE wpjl_posts SET post_name = 'prenuptial-agreement-lawyer'
WHERE post_type='articles' AND post_title LIKE '%הסכם ממון%' AND post_name LIKE '%d7%' LIMIT 1;

-- Real estate
UPDATE wpjl_posts SET post_name = 'buying-apartment-lawyer'
WHERE post_type='articles' AND post_title LIKE '%קניית דירה%' AND post_name LIKE '%d7%' LIMIT 1;

-- Notary
UPDATE wpjl_posts SET post_name = 'notary-public-israel'
WHERE post_type='articles' AND post_title LIKE '%נוטריון%מה זה%' AND post_name LIKE '%d7%' LIMIT 1;

-- Medical malpractice
UPDATE wpjl_posts SET post_name = 'medical-malpractice-lawyer-guide'
WHERE post_type='articles' AND post_title LIKE '%רשלנות רפואית%' AND post_name LIKE '%d7%' LIMIT 1;

-- Cyber law
UPDATE wpjl_posts SET post_name = 'cyber-law-lawyers-role'
WHERE post_type='articles' AND post_title LIKE '%סייבר%' AND post_name LIKE '%d7%' LIMIT 1;

-- Military law
UPDATE wpjl_posts SET post_name = 'military-lawyer-guide'
WHERE post_type='articles' AND post_title LIKE '%צבאי%' AND post_name LIKE '%d7%' LIMIT 1;

-- Online reputation for lawyers
UPDATE wpjl_posts SET post_name = 'online-reputation-lawyers'
WHERE post_type='articles' AND post_title LIKE '%מוניטין מקוון%' AND post_name LIKE '%d7%' LIMIT 1;

-- PHASE 5: Store old→new URL mapping for 301 redirects
-- Create a mapping table
CREATE TABLE IF NOT EXISTS wpjl_url_redirects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  old_slug VARCHAR(500),
  new_slug VARCHAR(500),
  post_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PHASE 6: After all slug changes, flush permalinks
-- Go to WordPress Admin > Settings > Permalinks > Save Changes
