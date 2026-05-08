<?php
/**
 * Generic single post template.
 *
 * @package JusticeTheme
 */

get_header();

while ( have_posts() ) :
	the_post();
	?>

	<?php
	if ( function_exists( 'justice_theme_breadcrumbs' ) ) {
		justice_theme_breadcrumbs();
	}
	?>

	<article <?php post_class( 'single-article' ); ?>>
		<header class="single-article__header">
			<div class="container container--narrow">
				<h1 class="single-article__title"><?php the_title(); ?></h1>

				<div class="single-article__meta">
					<span class="meta-date">
						<?php esc_html_e( 'פורסם:', 'justice-theme' ); ?>
						<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
							<?php echo esc_html( get_the_date() ); ?>
						</time>
					</span>
					
					<?php if ( get_the_modified_date() !== get_the_date() ) : ?>
					<span class="meta-updated">
						<?php esc_html_e( 'עודכן לאחרונה:', 'justice-theme' ); ?>
						<time datetime="<?php echo esc_attr( get_the_modified_date( DATE_W3C ) ); ?>">
							<?php echo esc_html( get_the_modified_date() ); ?>
						</time>
					</span>
					<?php endif; ?>

					<?php if ( get_the_author() ) : ?>
						<span class="meta-author"><?php esc_html_e( 'נכתב ע"י:', 'justice-theme' ); ?> <?php the_author(); ?></span>
					<?php endif; ?>
				</div>
			</div>
		</header>

		<div class="container container--narrow">
			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="single-article__image">
					<?php the_post_thumbnail( 'justice-hero' ); ?>
				</figure>
			<?php endif; ?>

			<div class="single-article__content entry-content">
				<?php the_content(); ?>
			</div>
			
			<div class="single-article__eeat-box">
				<div class="eeat-box__content">
					<h4><?php esc_html_e( 'מדיניות עריכה וגילוי נאות', 'justice-theme' ); ?></h4>
					<p><?php esc_html_e( 'המידע במאמר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי. אנו עושים מאמצים רבים להביא מידע מדויק ועדכני ככל הניתן, אך מומלץ תמיד להתייעץ עם עורך דין מוסמך בטרם נקיטת פעולה משפטית.', 'justice-theme' ); ?></p>
				</div>
			</div>

			<div class="single-article__lead-cta">
				<h3><?php esc_html_e( 'לא בטוחים לאיזה עורך דין לפנות?', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'פנו אלינו ונעזור לכם למצוא את הייצוג המשפטי המתאים למקרה שלכם.', 'justice-theme' ); ?></p>
				<a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="button button--primary"><?php esc_html_e( 'שליחת פנייה להתאמה ראשונית', 'justice-theme' ); ?></a>
			</div>
		</div>
	</article>

	<?php
	if ( function_exists( 'justice_theme_related_articles' ) ) {
		justice_theme_related_articles( get_the_ID() );
	}
	?>

	<?php
endwhile;

get_footer();
