<?php
/**
 * Taxonomy archive: practice-areas.
 *
 * @package JusticeTheme
 */

get_header();

$term       = get_queried_object();
$term_name  = $term instanceof WP_Term ? $term->name : single_term_title( '', false );
$term_slug  = $term instanceof WP_Term ? $term->slug : '';
$term_desc  = $term instanceof WP_Term ? $term->description : '';
$clean_name = trim( str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ' ), '', $term_name ) );

$practice_area_seo_overrides = array(
	'real-estate-law' => array(
		'title'          => __( 'עורך דין מקרקעין ונדל״ן', 'justice-theme' ),
		'display_area'   => __( 'מקרקעין ונדל״ן', 'justice-theme' ),
		'description'    => __( 'מרכז מידע לקניית דירה, מכירת נכס, חוזה מכר, רישום בטאבו, ליקויי בנייה, מס שבח והתחדשות עירונית. אפשר לקרוא מדריכים, להבין מה להכין לפני חתימה ולפנות לעורך דין מקרקעין בצורה מסודרת.', 'justice-theme' ),
		'guides_heading' => __( 'מדריכים בנושא מקרקעין ונדל״ן', 'justice-theme' ),
	),
	'labor-law' => array(
		'title'          => __( 'עורך דין דיני עבודה', 'justice-theme' ),
		'display_area'   => __( 'דיני עבודה', 'justice-theme' ),
		'description'    => __( 'מרכז מידע לעובדים ולמעסיקים בנושא פיטורים, שימוע, זכויות עובדים, שכר, חוזה עבודה, שעות נוספות ופנסיה. אפשר להבין את הצעדים הראשונים, לאסוף מסמכים ולפנות לעורך דין דיני עבודה לפי צורך.', 'justice-theme' ),
		'guides_heading' => __( 'מדריכים בנושא דיני עבודה', 'justice-theme' ),
	),
);

$practice_area_seo = $practice_area_seo_overrides[ $term_slug ] ?? array();

$lawyers = null;
if ( post_type_exists( 'justice_lawyer' ) && $term_slug ) {
	$lawyers = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 3,
		'orderby'        => 'meta_value_num',
		'meta_key'       => 'priority_score',
		'order'          => 'DESC',
		'tax_query'      => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $term_slug,
			),
		),
	) );
}

$tools = null;
if ( post_type_exists( 'justice_legal_tool' ) ) {
	$tools = new WP_Query( array(
		'post_type'      => 'justice_legal_tool',
		'post_status'    => 'publish',
		'posts_per_page' => 3,
		'orderby'        => 'menu_order',
		'order'          => 'ASC',
	) );
}

$related_terms = get_terms( array(
	'taxonomy'   => 'practice-areas',
	'hide_empty' => false,
	'exclude'    => $term instanceof WP_Term ? array( $term->term_id ) : array(),
	'number'     => 8,
) );

$display_area        = $practice_area_seo['display_area'] ?? ( $clean_name ?: $term_name );
$hero_title          = $practice_area_seo['title'] ?? $display_area;
$hero_description    = $practice_area_seo['description'] ?? '';
$guides_heading      = $practice_area_seo['guides_heading'] ?? __( 'מדריכים ומאמרים בתחום', 'justice-theme' );
$lawyer_archive_link = justice_theme_public_url( (string) ( get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' ) ) );
$filtered_lawyers    = $term_slug ? add_query_arg( 'area', $term_slug, $lawyer_archive_link ) : $lawyer_archive_link;
$lead_area_label     = $display_area ?: __( 'התחום המשפטי', 'justice-theme' );
?>

<section class="practice-hub-hero section">
	<div class="container practice-hub-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></p>
			<h1><?php echo esc_html( $hero_title ); ?></h1>
			<?php if ( $term_desc ) : ?>
				<div class="practice-hub-hero__description">
					<?php echo wp_kses_post( wpautop( $term_desc ) ); ?>
				</div>
			<?php elseif ( $hero_description ) : ?>
				<p><?php echo esc_html( $hero_description ); ?></p>
			<?php else : ?>
				<p><?php echo esc_html( sprintf( 'מרכז מידע, עורכי דין וכלים דיגיטליים בתחום %s. העמוד נועד לעזור להבין את הבעיה, לקרוא מדריכים רלוונטיים ולהשאיר פנייה מסודרת.', $display_area ) ); ?></p>
			<?php endif; ?>
			<div class="practice-hub-hero__actions">
				<a class="button button--gold" href="#practice-lawyers"><?php esc_html_e( 'עורכי דין בתחום', 'justice-theme' ); ?></a>
				<a class="button button--ghost" href="#practice-guides"><?php esc_html_e( 'מדריכים משפטיים', 'justice-theme' ); ?></a>
			</div>
		</div>

		<aside class="practice-hub-hero__panel">
			<strong><?php esc_html_e( 'מה אפשר לעשות כאן?', 'justice-theme' ); ?></strong>
			<ul>
				<li><?php esc_html_e( 'להבין את התחום והשלבים הראשונים.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'למצוא מדריכים קשורים לפי צורך.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'לעבור לעורך דין או לכלי דיגיטלי מתאים.', 'justice-theme' ); ?></li>
			</ul>
		</aside>
	</div>
</section>

<section class="practice-hub-intent section" aria-label="<?php esc_attr_e( 'הכוונה ראשונית לפי תחום משפטי', 'justice-theme' ); ?>">
	<div class="container practice-hub-intent__grid">
		<article class="practice-hub-intent__card">
			<span><?php esc_html_e( 'הבעיה', 'justice-theme' ); ?></span>
			<h2><?php echo esc_html( sprintf( 'מה חשוב להבין בנושא %s?', $lead_area_label ) ); ?></h2>
			<p><?php echo esc_html( sprintf( 'בעמוד זה אנחנו מרכזים מדריכים, עורכי דין, שאלות וכלים שקשורים ל%s. המטרה היא לעזור להבין את המצב, לאסוף עובדות ולהימנע מצעד פזיז.', $lead_area_label ) ); ?></p>
		</article>

		<article class="practice-hub-intent__card">
			<span><?php esc_html_e( 'מתי לפנות', 'justice-theme' ); ?></span>
			<h2><?php esc_html_e( 'מתי כדאי לערב עורך דין?', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'כאשר יש מועד קרוב, סיכון כספי, ילדים, מסמך לחתימה, חקירה, תביעה, צו, חוזה או חוסר ודאות לגבי זכויות וחובות, עדיף לקבל בדיקה מקצועית מוקדם.', 'justice-theme' ); ?></p>
		</article>

		<article class="practice-hub-intent__card">
			<span><?php esc_html_e( 'הכנה', 'justice-theme' ); ?></span>
			<h2><?php esc_html_e( 'מה להכין לפני פנייה?', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'תיאור קצר של האירועים, מסמכים מרכזיים, מועדים, פרטי הצד השני, עיר רלוונטית, רמת דחיפות ושאלות שחשוב לברר. פנייה מסודרת מייצרת טיפול טוב יותר.', 'justice-theme' ); ?></p>
		</article>
	</div>
</section>

<?php if ( $lawyers && $lawyers->have_posts() ) : ?>
	<section class="practice-hub-lawyers section" id="practice-lawyers">
		<div class="container">
			<div class="section-header section-header--split">
				<div>
					<p class="section-header__eyebrow"><?php esc_html_e( 'עורכי דין', 'justice-theme' ); ?></p>
					<h2><?php echo esc_html( sprintf( 'עורכי דין בתחום %s', $display_area ) ); ?></h2>
				</div>
				<a class="button button--primary" href="<?php echo esc_url( $filtered_lawyers ); ?>"><?php esc_html_e( 'כל הפרופילים', 'justice-theme' ); ?></a>
			</div>
			<div class="lawyers-grid">
				<?php while ( $lawyers->have_posts() ) : $lawyers->the_post(); ?>
					<?php get_template_part( 'template-parts/cards/lawyer-card' ); ?>
				<?php endwhile; ?>
			</div>
		</div>
	</section>
	<?php wp_reset_postdata(); ?>
<?php endif; ?>

<section class="practice-hub-cta section">
	<div class="container practice-hub-cta__panel">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'פנייה מסודרת', 'justice-theme' ); ?></p>
			<h2><?php echo esc_html( sprintf( 'צריכים הכוונה בנושא %s?', $lead_area_label ) ); ?></h2>
			<p><?php esc_html_e( 'השאירו פרטים קצרים עם תחום, עיר ודחיפות. המערכת נועדה להפוך פנייה כללית לליד מסודר שאפשר לבדוק ולנתב בצורה אחראית.', 'justice-theme' ); ?></p>
		</div>
		<div class="practice-hub-cta__actions">
			<a class="button button--gold" href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>"><?php esc_html_e( 'השארת פנייה', 'justice-theme' ); ?></a>
			<a class="button button--ghost" href="<?php echo esc_url( $filtered_lawyers ); ?>"><?php esc_html_e( 'חיפוש עורכי דין בתחום', 'justice-theme' ); ?></a>
		</div>
	</div>
</section>

<section class="practice-hub-content section" id="practice-guides">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'מדריכים', 'justice-theme' ); ?></p>
				<h2><?php echo esc_html( $guides_heading ); ?></h2>
			</div>
			<a class="button button--ghost" href="<?php echo esc_url( justice_theme_public_url( (string) get_post_type_archive_link( 'articles' ) ) ); ?>"><?php esc_html_e( 'כל המאמרים', 'justice-theme' ); ?></a>
		</div>

		<?php if ( have_posts() ) : ?>
			<div class="article-grid">
				<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'template-parts/cards/article-card' ); ?>
				<?php endwhile; ?>
			</div>

			<div class="pagination">
				<?php
				the_posts_pagination( array(
					'mid_size'  => 2,
					'prev_text' => esc_html__( 'הקודם', 'justice-theme' ),
					'next_text' => esc_html__( 'הבא', 'justice-theme' ),
				) );
				?>
			</div>
		<?php else : ?>
			<div class="directory-empty">
				<h2><?php esc_html_e( 'המדריכים בתחום הזה בהכנה', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'העמוד כבר מחובר למערכת התחומים, וברגע שמדריכים ישויכו לתחום הם יופיעו כאן.', 'justice-theme' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php if ( $tools && $tools->have_posts() ) : ?>
	<section class="practice-hub-tools section">
		<div class="container">
			<div class="section-header">
				<p class="section-header__eyebrow">LegalTech</p>
				<h2><?php esc_html_e( 'כלים דיגיטליים שיכולים לעזור לפני פנייה', 'justice-theme' ); ?></h2>
			</div>
			<div class="legaltools-grid">
				<?php while ( $tools->have_posts() ) : $tools->the_post(); ?>
					<?php
					$tool_type = get_post_meta( get_the_ID(), 'tool_type', true );
					$price     = get_post_meta( get_the_ID(), 'starting_price', true );
					$tool_url  = justice_theme_public_permalink( get_the_ID() );
					?>
					<article class="legaltool-card">
						<a href="<?php echo esc_url( $tool_url ); ?>" class="legaltool-card__link">
							<span><?php echo esc_html( $tool_type ?: 'LegalTech' ); ?></span>
							<h3><?php the_title(); ?></h3>
							<p><?php echo esc_html( get_the_excerpt() ?: wp_trim_words( wp_strip_all_tags( get_the_content() ), 22 ) ); ?></p>
							<?php if ( $price ) : ?><strong><?php echo esc_html( $price ); ?></strong><?php endif; ?>
						</a>
					</article>
				<?php endwhile; ?>
			</div>
		</div>
	</section>
	<?php wp_reset_postdata(); ?>
<?php endif; ?>

<?php if ( ! empty( $related_terms ) && ! is_wp_error( $related_terms ) ) : ?>
	<section class="practice-hub-related section">
		<div class="container">
			<div class="section-header">
				<p class="section-header__eyebrow"><?php esc_html_e( 'תחומים נוספים', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'אולי רלוונטי גם', 'justice-theme' ); ?></h2>
			</div>
			<div class="practice-areas-grid">
				<?php foreach ( $related_terms as $related_term ) : ?>
					<?php get_template_part( 'template-parts/cards/practice-area-card', null, array( 'term' => $related_term ) ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
<?php endif; ?>

<?php
get_footer();
