-- ============================================================
-- DELETE SPAM CATEGORIES
-- Run after step4 to remove all the hacker-added categories
-- ============================================================

-- Delete the spam categories themselves from term_taxonomy
DELETE FROM wpjl_term_taxonomy WHERE term_taxonomy_id IN (
    SELECT term_id FROM wpjl_terms WHERE
    slug IN ('casino-minimum-deposit', 'blog-2', 'en', 'fi', 'pt', 'uncategorized-3', 'uncategorized-6', 'www-zaferhurdametal-com')
);

-- Delete the spam terms
DELETE FROM wpjl_terms WHERE
    slug IN ('casino-minimum-deposit', 'blog-2', 'en', 'fi', 'pt', 'uncategorized-3', 'uncategorized-6', 'www-zaferhurdametal-com');
