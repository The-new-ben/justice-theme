<?php
/**
 * Front page — premium legal portal homepage.
 *
 * Section order based on competitive analysis:
 * 1. Hero (search-first, like din.co.il/Justia)
 * 2. Practice areas grid (primary navigation)
 * 3. Cities grid (location navigation — like Justia states)
 * 4. Featured lawyers (social proof — like din.co.il carousel)
 * 5. Latest articles (content authority)
 * 6. Featured pillars (deep guides)
 * 7. Topic clusters (supporting content)
 * 8. Ask a lawyer (lead capture — din.co.il's key CTA)
 * 9. Trust section (authority signals)
 * 10. Lawyer CTA (B2B conversion)
 * 11. Newsletter (retention)
 * 12. Footer CTA
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php get_template_part( 'template-parts/sections/hero' ); ?>

<?php get_template_part( 'template-parts/sections/practice-areas-grid' ); ?>

<?php get_template_part( 'template-parts/sections/cities-grid' ); ?>

<?php get_template_part( 'template-parts/sections/featured-lawyers' ); ?>

<?php get_template_part( 'template-parts/sections/latest-articles' ); ?>

<?php get_template_part( 'template-parts/sections/featured-pillars' ); ?>

<?php get_template_part( 'template-parts/sections/topic-clusters' ); ?>

<?php get_template_part( 'template-parts/sections/ask-lawyer' ); ?>

<?php get_template_part( 'template-parts/sections/trust-section' ); ?>

<?php get_template_part( 'template-parts/sections/lawyer-cta' ); ?>

<?php get_template_part( 'template-parts/sections/newsletter' ); ?>

<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

<?php
get_footer();
