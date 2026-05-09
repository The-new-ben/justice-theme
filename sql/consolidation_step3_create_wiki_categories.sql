-- ============================================================
-- CONSOLIDATION STEP 3: Create proper wiki_cats hierarchy
-- These are the categories for the unified yada_wiki post type
-- wiki_cats taxonomy is already registered for yada_wiki
-- ============================================================

-- 3A. First check what wiki_cats already exist
SELECT t.term_id, t.name, t.slug, tt.term_taxonomy_id, tt.parent, tt.count
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'wiki_cats'
ORDER BY t.name;

-- 3B. Create parent categories (10 main practice areas)
-- Run these INSERT statements one at a time

-- Parent 1: משפט פלילי (Criminal Law)
INSERT INTO wpjl_terms (name, slug) VALUES ('משפט פלילי', 'criminal-law-cat');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'מידע משפטי בתחום הפלילי, עבירות, מעצרים ופסקי דין', 0, 0);

-- Parent 2: דיני משפחה (Family Law)
INSERT INTO wpjl_terms (name, slug) VALUES ('דיני משפחה', 'family-law-cat');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'גירושין, משמורת, מזונות, הסכמי ממון, ירושות וצוואות', 0, 0);

-- Parent 3: עורכי דין בחו"ל (International Lawyers)
INSERT INTO wpjl_terms (name, slug) VALUES ('עורכי דין בחו"ל', 'international-lawyers');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'ייצוג משפטי ישראלי בחו"ל - ארה"ב, אירופה, אסיה', 0, 0);

-- Parent 4: מיסים ופיננסים (Tax & Finance)
INSERT INTO wpjl_terms (name, slug) VALUES ('מיסים ופיננסים', 'tax-finance');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'דיני מיסים, מיסוי בינלאומי, פינטק ושוק ההון', 0, 0);

-- Parent 5: מקרקעין ונדל"ן (Real Estate)
INSERT INTO wpjl_terms (name, slug) VALUES ('מקרקעין ונדל"ן', 'real-estate-cat');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'קניית דירה, תמ"א 38, שכירות ונדל"ן', 0, 0);

-- Parent 6: טכנולוגיה ומשפט (Legal Tech)
INSERT INTO wpjl_terms (name, slug) VALUES ('טכנולוגיה ומשפט', 'legal-tech');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'בינה מלאכותית, סייבר, חתימה דיגיטלית', 0, 0);

-- Parent 7: נוטריון (Notary Services)
INSERT INTO wpjl_terms (name, slug) VALUES ('נוטריון', 'notary-services');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'שירותי נוטריון בישראל ובחו"ל', 0, 0);

-- Parent 8: משרדי עורכי דין (Law Firms)
INSERT INTO wpjl_terms (name, slug) VALUES ('משרדי עורכי דין', 'law-firms');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'פרופילים של משרדי עורכי דין מובילים', 0, 0);

-- Parent 9: מדריכים משפטיים (Legal Guides)
INSERT INTO wpjl_terms (name, slug) VALUES ('מדריכים משפטיים', 'legal-guides-cat');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'מדריכים שימושיים: איך לבחור עורך דין, עלויות, הגשת תביעה', 0, 0);

-- Parent 10: דיני עבודה (Labor Law)
INSERT INTO wpjl_terms (name, slug) VALUES ('דיני עבודה', 'labor-law-cat');
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (LAST_INSERT_ID(), 'wiki_cats', 'זכויות עובדים, פיטורים, הסכמי עבודה, הטרדה', 0, 0);

-- 3C. After creating parents, verify they exist and note the term_taxonomy_ids
SELECT t.term_id, t.name, t.slug, tt.term_taxonomy_id
FROM wpjl_terms t
JOIN wpjl_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'wiki_cats' AND tt.parent = 0
ORDER BY t.name;

-- 3D. Sub-categories will be created AFTER we know parent IDs
-- Run consolidation_step4 after verifying parent IDs above
