<?php
/**
 * Homepage section for approved legal-service providers.
 *
 * Displays only approved supplier records as real cards. When no supplier has
 * passed the public gate yet, shows a truthful category-level marketplace
 * opening state without fake provider names or copied competitor claims.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! post_type_exists( 'justice_supplier' ) || ! function_exists( 'justice_theme_lawyer_supplier_is_public_ready' ) ) {
	return;
}

$supplier_ids = get_posts(
	array(
		'post_type'      => 'justice_supplier',
		'post_status'    => 'publish',
		'posts_per_page' => 24,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'   => 'supplier_public_visibility',
				'value' => 'show',
			),
			array(
				'key'   => 'supplier_partnership_status',
				'value' => 'approved',
			),
		),
	)
);

$supplier_ids = array_values(
	array_filter(
		array_map( 'absint', $supplier_ids ),
		static function ( int $post_id ): bool {
			return justice_theme_lawyer_supplier_is_public_ready( $post_id );
		}
	)
);

$priority_rank = array(
	'high'   => 3,
	'medium' => 2,
	'low'    => 1,
);

$revenue_rank = array(
	'sponsorship'     => 5,
	'monthly_listing' => 4,
	'lead_fee'        => 3,
	'affiliate'       => 2,
	'barter'          => 1,
	'unknown'         => 0,
);

usort(
	$supplier_ids,
	static function ( int $a, int $b ) use ( $priority_rank, $revenue_rank ): int {
		$a_priority = $priority_rank[ (string) get_post_meta( $a, 'supplier_priority', true ) ] ?? 0;
		$b_priority = $priority_rank[ (string) get_post_meta( $b, 'supplier_priority', true ) ] ?? 0;

		if ( $a_priority !== $b_priority ) {
			return $b_priority <=> $a_priority;
		}

		$a_revenue = $revenue_rank[ (string) get_post_meta( $a, 'supplier_revenue_model', true ) ] ?? 0;
		$b_revenue = $revenue_rank[ (string) get_post_meta( $b, 'supplier_revenue_model', true ) ] ?? 0;

		if ( $a_revenue !== $b_revenue ) {
			return $b_revenue <=> $a_revenue;
		}

		return strcmp( get_the_modified_date( 'c', $b ), get_the_modified_date( 'c', $a ) );
	}
);

$supplier_ids    = array_slice( $supplier_ids, 0, 4 );
$has_suppliers   = ! empty( $supplier_ids );
$category_labels = function_exists( 'justice_theme_lawyer_supplier_categories' ) ? justice_theme_lawyer_supplier_categories() : array();
$contact_url     = add_query_arg(
	array(
		'source' => 'legal-service-provider-marketplace',
		'role'   => 'supplier',
	),
	home_url( '/contact/' )
);
$marketplace_categories = array(
	array(
		'badge'   => __( 'תרגום ונוטריון', 'justice-theme' ),
		'title'   => __( 'תרגום משפטי, נוטריון ואפוסטיל', 'justice-theme' ),
		'summary' => __( 'נותני שירותים שיוכלו לסייע למשרדי עורכי דין במסמכים מתורגמים, אישורים נוטריוניים והכנת מסמכים להגשה בארץ או בחו"ל.', 'justice-theme' ),
	),
	array(
		'badge'   => __( 'ראיות ומומחים', 'justice-theme' ),
		'title'   => __( 'מומחים, חוקרים פרטיים וחוות דעת', 'justice-theme' ),
		'summary' => __( 'מרחב לספקים שמחזקים תיק משפטי באמצעות בדיקות מקצועיות, איתור מידע, חוות דעת ותיעוד מסודר לפני הליך או משא ומתן.', 'justice-theme' ),
	),
	array(
		'badge'   => __( 'משרד ותפעול', 'justice-theme' ),
		'title'   => __( 'חדרי ישיבות, שליחויות ותפעול משפטי', 'justice-theme' ),
		'summary' => __( 'פתרונות תפעוליים למשרדים קטנים ובינוניים: פגישות לקוח, מסירות, שליחויות, תיאום הגשות ושירותים שמורידים עומס מהמשרד.', 'justice-theme' ),
	),
	array(
		'badge'   => __( 'צמיחה מקצועית', 'justice-theme' ),
		'title'   => __( 'שיווק משפטי, וידאו והכשרות', 'justice-theme' ),
		'summary' => __( 'ספקים שיכולים לעזור לעורכי דין לבנות נוכחות מקצועית, להפיק תוכן אמין, לצלם וידאו, ולפתח מיומנויות עסקיות בצורה אחראית.', 'justice-theme' ),
	),
);
?>

<section class="legal-service-providers section" id="legal-service-providers" aria-labelledby="legal-service-providers-title">
	<div class="section__inner">
		<div class="section__header section__header--split">
			<div>
				<span class="section__eyebrow"><?php esc_html_e( 'אקו-סיסטם משפטי', 'justice-theme' ); ?></span>
				<h2 id="legal-service-providers-title"><?php esc_html_e( 'נותני שירותים שמחזקים את המשרד', 'justice-theme' ); ?></h2>
			</div>
			<p>
				<?php
				echo esc_html(
					$has_suppliers
						? __( 'ספקים מקצועיים מוצגים כאן רק אחרי בדיקת מקור ואישור שיתוף פעולה. בלי כרטיסי דמה ובלי הבטחות לא מאומתות.', 'justice-theme' )
						: __( 'אנחנו פותחים מרחב שירותים מקצועיים לעורכי דין. עד שיאושרו ספקים אמיתיים, מוצגים כאן רק תחומי השירות שנמצאים בבדיקה, בלי שמות מומצאים ובלי המלצות לא מאומתות.', 'justice-theme' )
				);
				?>
			</p>
		</div>

		<div class="legal-service-providers__grid">
			<?php if ( $has_suppliers ) : ?>
				<?php foreach ( $supplier_ids as $supplier_id ) : ?>
					<?php
					$category     = (string) get_post_meta( $supplier_id, 'supplier_category', true );
					$badge        = trim( (string) get_post_meta( $supplier_id, 'supplier_public_badge', true ) );
					$service_area = trim( (string) get_post_meta( $supplier_id, 'supplier_service_area', true ) );
					$summary      = trim( (string) get_post_meta( $supplier_id, 'supplier_offer_summary', true ) );
					$website      = trim( (string) get_post_meta( $supplier_id, 'supplier_website', true ) );
					$source_url   = trim( (string) get_post_meta( $supplier_id, 'supplier_source_url', true ) );
					$label        = $badge ?: ( $category_labels[ $category ] ?? __( 'נותן שירות מקצועי', 'justice-theme' ) );
					$link_url     = $website ?: $source_url;
					?>
					<article class="legal-service-provider-card">
						<div class="legal-service-provider-card__top">
							<span class="legal-service-provider-card__badge"><?php echo esc_html( $label ); ?></span>
							<span class="legal-service-provider-card__signal"><?php esc_html_e( 'מאושר להצגה', 'justice-theme' ); ?></span>
						</div>
						<h3><?php echo esc_html( get_the_title( $supplier_id ) ); ?></h3>
						<?php if ( '' !== $service_area ) : ?>
							<p class="legal-service-provider-card__area"><?php echo esc_html( $service_area ); ?></p>
						<?php endif; ?>
						<p class="legal-service-provider-card__summary"><?php echo esc_html( wp_trim_words( $summary, 22, '...' ) ); ?></p>
						<div class="legal-service-provider-card__footer">
							<?php if ( '' !== $link_url ) : ?>
								<a href="<?php echo esc_url( $link_url ); ?>" target="_blank" rel="nofollow noopener"><?php esc_html_e( 'בדיקת מקור', 'justice-theme' ); ?></a>
							<?php endif; ?>
							<span><?php esc_html_e( 'מוצג לאחר בדיקה', 'justice-theme' ); ?></span>
						</div>
					</article>
				<?php endforeach; ?>
			<?php else : ?>
				<?php foreach ( $marketplace_categories as $category ) : ?>
					<article class="legal-service-provider-card legal-service-provider-card--placeholder">
						<div class="legal-service-provider-card__top">
							<span class="legal-service-provider-card__badge"><?php echo esc_html( $category['badge'] ); ?></span>
							<span class="legal-service-provider-card__signal"><?php esc_html_e( 'בבדיקה', 'justice-theme' ); ?></span>
						</div>
						<h3><?php echo esc_html( $category['title'] ); ?></h3>
						<p class="legal-service-provider-card__summary"><?php echo esc_html( $category['summary'] ); ?></p>
						<div class="legal-service-provider-card__footer">
							<span><?php esc_html_e( 'ספקים אמיתיים יוצגו רק לאחר אישור', 'justice-theme' ); ?></span>
						</div>
					</article>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>

		<div class="legal-service-providers__cta">
			<p><?php esc_html_e( 'נותני שירותים מקצועיים לעורכי דין יכולים לפנות לבדיקת שיתוף פעולה. פרסום ציבורי יעלה רק אחרי מקור ברור, התאמה ואישור.', 'justice-theme' ); ?></p>
			<a class="button button--ghost" href="<?php echo esc_url( $contact_url ); ?>"><?php esc_html_e( 'פנייה לשותפות', 'justice-theme' ); ?></a>
		</div>
	</div>
</section>
