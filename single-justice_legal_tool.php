<?php
/**
 * Single LegalTech tool page.
 *
 * @package JusticeTheme
 */

get_header();

while ( have_posts() ) :
	the_post();

	$tool_id    = get_the_ID();
	$type       = get_post_meta( $tool_id, 'tool_type', true );
	$price      = get_post_meta( $tool_id, 'starting_price', true );
	$turnaround = get_post_meta( $tool_id, 'estimated_turnaround', true );
	$area       = get_post_meta( $tool_id, 'target_practice_area', true );
	$review     = get_post_meta( $tool_id, 'requires_lawyer_review', true );
	?>

	<article <?php post_class( 'legaltool-single' ); ?>>
		<section class="legaltool-single__hero section">
			<div class="container legaltool-single__hero-grid">
				<div>
					<p class="section-header__eyebrow"><?php echo esc_html( $type ?: 'LegalTech' ); ?></p>
					<h1><?php the_title(); ?></h1>
					<p><?php echo esc_html( get_the_excerpt() ?: 'מסלול דיגיטלי לאיסוף מידע, בניית טיוטה וסיכום לעורך דין, עם בדיקה אנושית לפני שימוש משפטי מחייב.' ); ?></p>
					<div class="legaltool-single__actions">
						<a class="button button--gold" href="#tool-request">התחלת תהליך</a>
						<a class="button button--ghost" href="<?php echo esc_url( home_url( '/legal-tools/' ) ); ?>">כל הכלים</a>
					</div>
				</div>

				<aside class="legaltool-single__panel" aria-label="פרטי כלי">
					<dl>
						<?php if ( $price ) : ?><dt>מודל</dt><dd><?php echo esc_html( $price ); ?></dd><?php endif; ?>
						<?php if ( $turnaround ) : ?><dt>זמן טיפול</dt><dd><?php echo esc_html( $turnaround ); ?></dd><?php endif; ?>
						<?php if ( $area ) : ?><dt>תחום</dt><dd><?php echo esc_html( $area ); ?></dd><?php endif; ?>
						<dt>בדיקה אנושית</dt><dd><?php echo $review ? 'עורך דין בלופ' : 'אבחון ראשוני בלבד'; ?></dd>
					</dl>
				</aside>
			</div>
		</section>

		<section class="legaltool-single__body section">
			<div class="container legaltool-single__layout">
				<div class="legaltool-single__content entry-content">
					<?php the_content(); ?>

					<div class="legaltool-flow">
						<div><span>1</span><strong>שאלון חכם</strong><p>המשתמש מוסר פרטים, מסמכים, עיר, דחיפות והקשר עסקי או אישי.</p></div>
						<div><span>2</span><strong>טיוטה וסיכום</strong><p>המערכת בונה תקציר מקרה, רשימת חסרים וטיוטה ראשונית לעיון.</p></div>
						<div><span>3</span><strong>עורך דין בלופ</strong><p>הבקשה יכולה לעבור לעורך דין מתאים לבדיקה, שיפור והמשך טיפול.</p></div>
					</div>
				</div>

				<aside class="legaltool-request" id="tool-request">
					<?php if ( isset( $_GET['request'] ) && 'sent' === $_GET['request'] ) : ?>
						<div class="legaltool-request__notice">הבקשה התקבלה במערכת.</div>
					<?php endif; ?>

					<h2>התחלת תהליך</h2>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
						<input type="hidden" name="action" value="justice_submit_legal_request">
						<input type="hidden" name="tool_id" value="<?php echo esc_attr( $tool_id ); ?>">
						<?php wp_nonce_field( 'justice_legal_tool_request', 'justice_legal_tool_nonce' ); ?>

						<label>
							<span>שם מלא</span>
							<input type="text" name="visitor_name" autocomplete="name" required>
						</label>
						<label>
							<span>טלפון</span>
							<input type="tel" name="visitor_phone" autocomplete="tel" required>
						</label>
						<label>
							<span>אימייל</span>
							<input type="email" name="visitor_email" autocomplete="email">
						</label>
						<label>
							<span>מה צריך להכין או לבדוק?</span>
							<textarea name="message" rows="5" required></textarea>
						</label>
						<label class="legaltool-request__consent">
							<input type="checkbox" name="consent" value="1" required>
							<span>אני מסכים/ה להעברת הפרטים לצורך אבחון ראשוני וחזרה אליי.</span>
						</label>
						<button class="button button--gold" type="submit">שליחת בקשה</button>
					</form>
				</aside>
			</div>
		</section>
	</article>

<?php
endwhile;

get_footer();
