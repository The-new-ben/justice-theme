-- ============================================================
-- STEP 2: Verify count before deleting
-- Run after step1. Should show ~2319 rows.
-- ============================================================
SELECT COUNT(*) as spam_ids_staged FROM wpjl_spam_to_delete;
