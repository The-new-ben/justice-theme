-- ============================================================
-- STEP 4: Cleanup after all batches are done
-- Run once after step3 shows 0 rows affected
-- ============================================================

-- Remove orphaned post meta
DELETE FROM wpjl_postmeta WHERE post_id NOT IN (SELECT ID FROM wpjl_posts);

-- Remove orphaned term relationships
DELETE FROM wpjl_term_relationships WHERE object_id NOT IN (SELECT ID FROM wpjl_posts);

-- Remove orphaned comments
DELETE FROM wpjl_comments WHERE comment_post_ID NOT IN (SELECT ID FROM wpjl_posts);

-- Drop the staging table
DROP TABLE IF EXISTS wpjl_spam_to_delete;

-- Update category counts
UPDATE wpjl_term_taxonomy tt
SET count = (
    SELECT COUNT(*) FROM wpjl_term_relationships tr
    WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
);
