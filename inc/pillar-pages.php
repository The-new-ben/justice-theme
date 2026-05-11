<?php
/**
 * Legal pillar page CMS fields and draft seeding.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_pillar_page_meta(): void {
	$fields = array(
		'pillar_keyword'           => 'string',
		'pillar_cluster'           => 'string',
		'pillar_summary'           => 'string',
		'pillar_legaltech_url'     => 'string',
		'pillar_lawyer_area'       => 'string',
		'pillar_supporting_topics' => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'page', $key, array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $type,
			'auth_callback' => static function () {
				return current_user_can( 'edit_pages' );
			},
		) );
	}
}
add_action( 'init', 'justice_theme_register_pillar_page_meta' );

function justice_theme_pillar_page_meta_boxes(): void {
	add_meta_box(
		'justice_pillar_page_fields',
		'Legal pillar settings',
		'justice_theme_render_pillar_page_box',
		'page',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_pillar_page_meta_boxes' );

function justice_theme_render_pillar_page_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_pillar_page_meta', 'justice_pillar_page_nonce' );

	$fields = array(
		array( 'key' => 'pillar_keyword', 'label' => 'Primary Hebrew keyword', 'type' => 'text', 'placeholder' => 'עורך דין גירושין' ),
		array( 'key' => 'pillar_cluster', 'label' => 'Cluster label', 'type' => 'text', 'placeholder' => 'משפחה וגירושין' ),
		array( 'key' => 'pillar_summary', 'label' => 'Hero summary', 'type' => 'textarea', 'placeholder' => 'תקציר קצר שיופיע בראש העמוד.' ),
		array( 'key' => 'pillar_lawyer_area', 'label' => 'Practice-area slug for lawyer cards', 'type' => 'text', 'placeholder' => 'family-law' ),
		array( 'key' => 'pillar_legaltech_url', 'label' => 'LegalTech CTA URL', 'type' => 'url', 'placeholder' => '/legal-tools/family-agreement/' ),
		array( 'key' => 'pillar_supporting_topics', 'label' => 'Supporting topics: label | URL, one per line', 'type' => 'textarea', 'placeholder' => "גירושין בהסכמה | /consensual-divorce/\nמזונות ילדים | /child-support/" ),
	);
	?>
	<div class="justice-admin-fields">
		<p><strong>Use with template:</strong> Legal Pillar Page. Visible content stays Hebrew; the page slug should be short English.</p>
		<?php foreach ( $fields as $field ) : ?>
			<?php $value = get_post_meta( $post->ID, $field['key'], true ); ?>
			<p>
				<label for="<?php echo esc_attr( $field['key'] ); ?>"><strong><?php echo esc_html( $field['label'] ); ?></strong></label><br>
				<?php if ( 'textarea' === $field['type'] ) : ?>
					<textarea id="<?php echo esc_attr( $field['key'] ); ?>" name="<?php echo esc_attr( $field['key'] ); ?>" rows="4" style="width:100%;" placeholder="<?php echo esc_attr( $field['placeholder'] ); ?>"><?php echo esc_textarea( $value ); ?></textarea>
				<?php else : ?>
					<input id="<?php echo esc_attr( $field['key'] ); ?>" name="<?php echo esc_attr( $field['key'] ); ?>" type="<?php echo esc_attr( $field['type'] ); ?>" value="<?php echo esc_attr( $value ); ?>" style="width:100%;" placeholder="<?php echo esc_attr( $field['placeholder'] ); ?>">
				<?php endif; ?>
			</p>
		<?php endforeach; ?>
	</div>
	<?php
}

function justice_theme_save_pillar_page_meta( int $post_id ): void {
	if ( ! isset( $_POST['justice_pillar_page_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_pillar_page_nonce'] ) ), 'justice_pillar_page_meta' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_page', $post_id ) ) {
		return;
	}

	$text_fields = array( 'pillar_keyword', 'pillar_cluster', 'pillar_lawyer_area' );
	foreach ( $text_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
		}
	}

	$textarea_fields = array( 'pillar_summary', 'pillar_supporting_topics' );
	foreach ( $textarea_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_textarea_field( wp_unslash( $_POST[ $field ] ) ) );
		}
	}

	if ( isset( $_POST['pillar_legaltech_url'] ) ) {
		update_post_meta( $post_id, 'pillar_legaltech_url', esc_url_raw( wp_unslash( $_POST['pillar_legaltech_url'] ) ) );
	}
}
add_action( 'save_post_page', 'justice_theme_save_pillar_page_meta' );

function justice_theme_seed_pillar_page_drafts(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_pillar_page_draft_seed' ) || get_option( 'justice_pillar_drafts_seeded_v1' ) ) {
		return;
	}

	$pages = justice_theme_get_pillar_seed_pages();

	foreach ( $pages as $slug => $page ) {
		if ( get_page_by_path( $slug, OBJECT, 'page' ) ) {
			continue;
		}

		$post_id = wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'draft',
			'post_name'    => $slug,
			'post_title'   => $page['title'],
			'post_excerpt' => $page['summary'],
			'post_content' => $page['content'],
			'meta_input'   => array(
				'_wp_page_template'        => 'page-legal-pillar.php',
				'pillar_keyword'           => $page['keyword'],
				'pillar_cluster'           => $page['cluster'],
				'pillar_summary'           => $page['summary'],
				'pillar_lawyer_area'       => $page['lawyer_area'],
				'pillar_legaltech_url'     => $page['tool_url'],
				'pillar_supporting_topics' => $page['topics'],
			),
		) );

		if ( $post_id && ! is_wp_error( $post_id ) && function_exists( 'uje_log' ) ) {
			uje_log( 'seeded_pillar_page', 'Created draft pillar page: ' . $slug );
		}
	}

	update_option( 'justice_pillar_drafts_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_pillar_page_drafts' );

function justice_theme_get_pillar_seed_pages(): array {
	return array(
		'divorce-lawyer' => array(
			'title'       => 'עורך דין גירושין',
			'keyword'     => 'עורך דין גירושין',
			'cluster'     => 'משפחה וגירושין',
			'lawyer_area' => 'family-law',
			'tool_url'    => '/legal-tools/family-agreement/',
			'summary'     => 'מדריך מעשי לבחירת עורך דין גירושין, הבנת שלבי ההליך, מסמכים חשובים, עלויות אפשריות והדרך להשאיר פנייה מסודרת לעורך דין מתאים.',
			'topics'      => "גירושין בהסכמה | /consensual-divorce/\nגישור גירושין | /divorce-mediation/\nמזונות ילדים | /child-support/\nמשמורת ילדים | /child-custody/\nחלוקת רכוש בגירושין | /divorce-property-division/",
			'content'     => '<h2>מתי כדאי לפנות לעורך דין גירושין?</h2><p>כאשר יש מחלוקת על ילדים, מזונות, רכוש, דירה, כתובה, זמני שהות או הסכם גירושין, חשוב לקבל הכוונה מסודרת לפני שמקבלים החלטות. המטרה של העמוד היא להסביר את המסלול, לא להחליף ייעוץ משפטי פרטני.</p><h2>מה להכין לפני הפנייה?</h2><ul><li>תעודות זהות ופרטי בני הזוג.</li><li>מסמכים על הכנסות, דירה, חשבונות ונכסים.</li><li>מידע על ילדים, מסגרות, הוצאות וזמני שהות.</li><li>הסכמים קיימים, כתובה או הסכם ממון אם יש.</li></ul><h2>איך לבחור עורך דין גירושין?</h2><p>כדאי לבדוק ניסיון בתחום המשפחה, זמינות, גישה לניהול משא ומתן, יכולת לנסח הסכם ברור והבנה של בתי המשפט לענייני משפחה ובתי הדין הרבניים.</p><h2>חשוב לדעת</h2><p>המידע בעמוד הוא כללי בלבד ואינו ייעוץ משפטי. לפני פעולה משפטית יש להתייעץ עם עורך דין מוסמך.</p>',
		),
		'criminal-lawyer' => array(
			'title'       => 'עורך דין פלילי',
			'keyword'     => 'עורך דין פלילי',
			'cluster'     => 'משפט פלילי',
			'lawyer_area' => 'criminal-law',
			'tool_url'    => '/legal-tools/ai-intake/',
			'summary'     => 'מדריך ראשוני למי שנמצא לפני חקירה, כתב אישום או הליך פלילי וצריך להבין איך לפעול בזהירות.',
			'topics'      => "חקירה במשטרה | /police-investigation/\nכתב אישום | /indictment/\nמעצר ימים | /pretrial-detention/\nעבירות סמים | /drug-offenses/",
			'content'     => '<h2>לפני חקירה או הליך פלילי</h2><p>במצבים פליליים הזמן חשוב. העמוד מרכז מידע ראשוני על זכויות, שלבי הליך והכנה לפנייה לעורך דין פלילי.</p><h2>מידע זהיר בלבד</h2><p>אין לראות בתוכן ייעוץ משפטי. במצב דחוף יש לפנות לעורך דין מוסמך.</p>',
		),
		'real-estate-lawyer' => array(
			'title'       => 'עורך דין מקרקעין',
			'keyword'     => 'עורך דין מקרקעין',
			'cluster'     => 'מקרקעין ונדל״ן',
			'lawyer_area' => 'real-estate-law',
			'tool_url'    => '/legal-tools/real-estate-contract-review/',
			'summary'     => 'מדריך לרוכשים, מוכרים ומשקיעים בעסקאות נדל״ן: חוזה, טאבו, מסים, בדיקות מקדימות וסיכונים.',
			'topics'      => "קניית דירה | /buying-apartment/\nחוזה מכר | /real-estate-purchase-agreement/\nרישום בטאבו | /land-registry/\nליקויי בנייה | /construction-defects/",
			'content'     => '<h2>למה צריך עורך דין מקרקעין?</h2><p>עסקת נדל״ן משלבת חוזים, רישום זכויות, מיסוי, משכנתא וסיכונים כספיים משמעותיים. העמוד מסביר מה לבדוק לפני חתימה.</p><h2>בדיקות מרכזיות</h2><ul><li>זהות בעלי הזכויות.</li><li>מצב רישום בטאבו או ברשות מקרקעי ישראל.</li><li>משכנתאות, הערות אזהרה ועיקולים.</li><li>התחייבויות מס ותשלומים נלווים.</li></ul>',
		),
		'medical-malpractice-lawyer' => array(
			'title'       => 'עורך דין רשלנות רפואית',
			'keyword'     => 'עורך דין רשלנות רפואית',
			'cluster'     => 'רשלנות רפואית',
			'lawyer_area' => 'medical-malpractice',
			'tool_url'    => '/legal-tools/ai-intake/',
			'summary'     => 'מדריך ראשוני לבדיקת עילת תביעה ברשלנות רפואית, איסוף מסמכים, חוות דעת רפואית והערכת סיכויי ההליך.',
			'topics'      => "רשלנות רפואית בהריון | /pregnancy-malpractice/\nרשלנות רפואית בלידה | /birth-malpractice/\nאבחון שגוי | /misdiagnosis/\nחוות דעת רפואית | /medical-expert-opinion/",
			'content'     => '<h2>מה בודקים בתביעת רשלנות רפואית?</h2><p>בדרך כלל נדרש לבדוק האם הייתה סטייה מסטנדרט רפואי סביר, האם נגרם נזק, והאם קיים קשר סיבתי בין הטיפול לנזק. מדובר בתחום מורכב שמצריך מסמכים רפואיים ולעיתים חוות דעת מומחה.</p><h2>מסמכים שכדאי לאסוף</h2><ul><li>סיכומי אשפוז וביקור.</li><li>בדיקות דימות ומעבדה.</li><li>מרשמים והפניות.</li><li>תיעוד התכתבויות ותלונות.</li></ul><p>המידע הוא כללי בלבד ואינו ייעוץ רפואי או משפטי.</p>',
		),
	);
}
