-- ============================================================
-- STEP 1: Create a staging table of spam post IDs (safe - no deletion yet)
-- Run this first alone.
-- ============================================================
CREATE TABLE IF NOT EXISTS wpjl_spam_to_delete AS
SELECT ID FROM wpjl_posts
WHERE post_type = 'post'
AND post_status = 'publish'
AND (
    post_title LIKE '%casino%' OR
    post_title LIKE '%kasino%' OR
    post_title LIKE '%Winnerz%' OR
    post_title LIKE '%VikingLuck%' OR
    post_title LIKE '%TiktakBet%' OR
    post_title LIKE '%SpinaBet%' OR
    post_title LIKE '%Slota%' OR
    post_title LIKE '%slots%' OR
    post_title LIKE '%roulette%' OR
    post_title LIKE '%blackjack%' OR
    post_title LIKE '%betting%' OR
    post_content LIKE '%online casino%' OR
    post_content LIKE '%spilleautomater%' OR
    post_content LIKE '%pelivalikoimamme%' OR
    post_content LIKE '%kasinopelit%' OR
    post_content LIKE '%nettikasino%' OR
    post_content LIKE '%spelbolag%' OR
    post_content LIKE '%casinobonus%'
);
