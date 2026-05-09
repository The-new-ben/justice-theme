-- ============================================================
-- PHASE 2: CREATE PROPER CATEGORY STRUCTURE
-- Table prefix: wpjl_
-- Run in phpMyAdmin after spam cleanup
-- ============================================================

-- First, insert the parent legal practice area categories
INSERT INTO wpjl_terms (name, slug) VALUES
('דיני משפחה', 'family-law'),
('משפט פלילי', 'criminal-law'),
('דיני עבודה', 'labor-law'),
('דיני מקרקעין', 'real-estate-law'),
('דיני תעבורה', 'traffic-law'),
('מיסים', 'tax-law'),
('דיני סייבר', 'cyber-law'),
('נזיקין', 'torts-law'),
('דיני חברות', 'corporate-law'),
('פסקי דין', 'court-rulings'),
('חדשות משפטיות', 'legal-news'),
('מדריכים משפטיים', 'legal-guides');

-- Now create the taxonomy entries for each (category type)
INSERT INTO wpjl_term_taxonomy (term_id, taxonomy, description, parent, count)
SELECT t.term_id, 'category', '', 0, 0
FROM wpjl_terms t
WHERE t.slug IN ('family-law','criminal-law','labor-law','real-estate-law','traffic-law','tax-law','cyber-law','torts-law','corporate-law','court-rulings','legal-news','legal-guides')
AND t.term_id NOT IN (SELECT term_id FROM wpjl_term_taxonomy WHERE taxonomy = 'category');

-- Sub-categories under דיני משפחה (Family Law)
INSERT INTO wpjl_terms (name, slug) VALUES
('גירושין', 'divorce'),
('ירושה וצוואות', 'inheritance-wills'),
('משמורת ילדים', 'child-custody'),
('מזונות', 'alimony'),
('הסכמי ממון', 'prenuptial-agreements'),
('אפוטרופסות', 'guardianship');

-- Sub-categories under משפט פלילי (Criminal Law)
INSERT INTO wpjl_terms (name, slug) VALUES
('עבירות סמים', 'drug-offenses'),
('עבירות מין', 'sexual-offenses'),
('צווארון לבן', 'white-collar-crime'),
('מעצרים', 'arrests-detention'),
('רישום פלילי', 'criminal-record');

-- Sub-categories under דיני עבודה (Labor Law)
INSERT INTO wpjl_terms (name, slug) VALUES
('פיטורים ופיצויים', 'termination-compensation'),
('הסכמי עבודה', 'employment-agreements'),
('זכויות עובדים', 'employee-rights'),
('הטרדה בעבודה', 'workplace-harassment');

-- Sub-categories under דיני מקרקעין (Real Estate)
INSERT INTO wpjl_terms (name, slug) VALUES
('קניית דירה', 'buying-apartment'),
('תמא 38', 'tama-38'),
('שכירות', 'rental-law'),
('ליקויי בנייה', 'construction-defects');

-- Sub-categories under מיסים (Tax)
INSERT INTO wpjl_terms (name, slug) VALUES
('מס הכנסה', 'income-tax'),
('מיסוי בינלאומי', 'international-tax'),
('מיסוי מקרקעין', 'real-estate-tax');

-- Note: After running this, you need to set parent IDs for sub-categories
-- by running UPDATE queries linking them to their parent term_taxonomy_id.
-- This will be done in the next script after we verify the term_ids created.
