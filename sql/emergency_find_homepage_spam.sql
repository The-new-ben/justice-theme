-- ============================================================
-- EMERGENCY: CLEAN HOMEPAGE CONTENT
-- The homepage (likely a static page or widget area) has casino
-- spam injected directly into the post_content.
-- This finds and identifies which post/page contains the homepage content
-- ============================================================

-- Find the homepage setting
SELECT option_name, option_value FROM wpjl_options
WHERE option_name IN ('page_on_front', 'show_on_front', 'page_for_posts');

-- Find any post/page containing the casino spam text
SELECT ID, post_title, post_type, post_status, LENGTH(post_content) as content_length
FROM wpjl_posts
WHERE post_content LIKE '%extremegaming%'
   OR post_content LIKE '%FB777%'
   OR post_content LIKE '%Pin Up Casino%'
   OR post_content LIKE '%5Gringos%'
   OR post_content LIKE '%EnergyCasino%'
   OR post_content LIKE '%Lemon Casino%'
   OR post_content LIKE '%Mostbet%'
   OR post_content LIKE '%Lodi777%'
   OR post_content LIKE '%TG777%'
   OR post_content LIKE '%Gamemania%'
   OR post_content LIKE '%Sweet Bonanza%'
   OR post_content LIKE '%Rabbit Reel%'
   OR post_content LIKE '%lysa kasino%'
   OR post_content LIKE '%winwin portugal%'
   OR post_content LIKE '%Genie Riches%'
   OR post_content LIKE '%Taya777%'
   OR post_content LIKE '%B7 Casino%'
   OR post_content LIKE '%Stake%casino%';

-- Also check widgets for injected spam
SELECT option_name, LENGTH(option_value) as size
FROM wpjl_options
WHERE option_name LIKE 'widget_%'
AND (option_value LIKE '%casino%' OR option_value LIKE '%betting%' OR option_value LIKE '%slots%');

-- Check for injected spam in theme options
SELECT option_name, LENGTH(option_value) as size
FROM wpjl_options
WHERE (option_value LIKE '%casino%' OR option_value LIKE '%extremegaming%' OR option_value LIKE '%FB777%')
AND option_name NOT LIKE '%transient%';
