<?php
/**
 * LegalTech tools archive.
 *
 * @package JusticeTheme
 */

get_header();
?>

<section class="legaltools-archive-hero section">
	<div class="container">
		<p class="section-header__eyebrow">LegalTech</p>
		<h1>כלים משפטיים, מסמכים וצ׳אט חכם עם עורך דין בלופ</h1>
		<p>מסלולים דיגיטליים לאבחון, איסוף מידע, יצירת טיוטות וסיכום מסודר לעורך דין. המטרה: פחות חיכוך למשתמש, יותר לידים איכותיים לעורכי הדין, ויותר מוצרים שניתן למכור בלי שיחות ידניות.</p>
	</div>
</section>

<section class="legaltools-archive section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="legaltools-grid">
				<?php while ( have_posts() ) : the_post(); ?>
					<?php
					$tool_type  = get_post_meta( get_the_ID(), 'tool_type', true );
					$price      = get_post_meta( get_the_ID(), 'starting_price', true );
					$turnaround = get_post_meta( get_the_ID(), 'estimated_turnaround', true );
					?>
					<article class="legaltool-card">
						<a href="<?php the_permalink(); ?>" class="legaltool-card__link">
							<span><?php echo esc_html( $tool_type ?: 'LegalTech' ); ?></span>
							<h2><?php the_title(); ?></h2>
							<p><?php echo esc_html( get_the_excerpt() ?: wp_trim_words( wp_strip_all_tags( get_the_content() ), 28 ) ); ?></p>
							<div class="legaltool-card__meta">
								<?php if ( $price ) : ?><strong><?php echo esc_html( $price ); ?></strong><?php endif; ?>
								<?php if ( $turnaround ) : ?><em><?php echo esc_html( $turnaround ); ?></em><?php endif; ?>
							</div>
						</a>
					</article>
				<?php endwhile; ?>
			</div>

			<div class="pagination">
				<?php the_posts_pagination(); ?>
			</div>
		<?php else : ?>
			<div class="directory-empty">
				<h2>מערכת הכלים המשפטיים בהקמה</h2>
				<p>לא נמצאו כלים פעילים. לאחר משיכת העדכון, כניסה אחת ללוח הניהול תיצור את כלי ה-MVP הראשונים.</p>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php get_footer(); ?>
