<?php
/**
 * Agreements, forms and calculators that already rank, new look (v3).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_tools = justice_theme_look3_tools( 6 );

if ( count( $justice_tools ) < 3 ) {
	return;
}

$justice_tools_all = justice_theme_look3_resolve( array( 'legal-documents', 'legal-tools' ), '/legal-tools/' );
?>

<section class="l3-section l3-section--paper l3-tools" id="tools" aria-label="<?php esc_attr_e( 'הסכמים, טפסים ומחשבונים להורדה', 'justice-theme' ); ?>">
	<div class="l3-section__inner">
		<div class="l3-section__head">
			<h2 class="l3-h2 l3-h2--small"><?php esc_html_e( 'הסכמים, טפסים ומחשבונים להורדה', 'justice-theme' ); ?></h2>
			<?php if ( $justice_tools_all ) : ?>
				<a class="l3-more" href="<?php echo esc_url( $justice_tools_all['url'] ); ?>"><?php esc_html_e( 'לכל ההסכמים והטפסים ←', 'justice-theme' ); ?></a>
			<?php endif; ?>
		</div>
		<div class="l3-tools__grid">
			<?php foreach ( $justice_tools as $justice_tool ) : ?>
				<a class="l3-tool" href="<?php echo esc_url( $justice_tool['url'] ); ?>">
					<span class="l3-tool__kind"><?php echo esc_html( $justice_tool['kind'] ); ?></span>
					<strong><?php echo esc_html( $justice_tool['title'] ); ?></strong>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
