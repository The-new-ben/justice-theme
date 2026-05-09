-- ============================================================
-- STEP 3: BATCH DELETE (run this multiple times until 0 rows affected)
-- Deletes posts + their meta + their term relationships in batches of 500
-- Safe for shared hosting - won't timeout
-- ============================================================
DELETE p, pm, tr
FROM wpjl_posts p
LEFT JOIN wpjl_postmeta pm ON p.ID = pm.post_id
LEFT JOIN wpjl_term_relationships tr ON p.ID = tr.object_id
WHERE p.ID IN (SELECT ID FROM wpjl_spam_to_delete LIMIT 500);
