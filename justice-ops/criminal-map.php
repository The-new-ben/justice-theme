<?php
/**
 * The criminal process map: the criminal vertical's embedded application
 * (the "every money page is an application" rule), built ahead of the
 * criminal mega article so the article lands into a ready home.
 *
 * One action: pick the stage you are in (summons, interrogation, arrest,
 * hearing, indictment, appeal) and get what happens now, the rights that
 * matter at THIS stage, the mistakes people make, and the clock that is
 * running. Fully deterministic and server-rendered (no AI dependency, no
 * per-use cost); only the panel toggle is JavaScript. Deadlines shown are
 * the statutory basics only (24 hours to a judge, 30 days to request a
 * 60A hearing, 45 days to appeal), nothing invented.
 *
 * Every panel ends at a human: criminal defense is time-critical, so the
 * CTA pair is WhatsApp now plus the AI desk for orientation.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The stage data. Plain-Hebrew, statutory-basics only.
 *
 * @return array<string,array{label:string,now:string,rights:array<int,string>,avoid:array<int,string>,clock:string}>
 */
function justice_crim_stages(): array {
	return array(
		'summons'     => array(
			'label'  => 'זומנתי לחקירה',
			'now'    => 'זימון לחקירה הוא לא הרשעה ולא כתב אישום. זה השלב שבו הכי קל להשפיע על ההמשך, כי מה שנאמר בחדר החקירה מלווה את התיק עד סופו.',
			'rights' => array(
				'זכות להתייעץ עם עורך דין לפני החקירה, ומומלץ לממש אותה לפני שמוסרים גרסה.',
				'אפשר לברר אם אתם מוזמנים כחשודים או כעדים. זה משנה את כל התמונה.',
				'זכות השתיקה קיימת לחשוד, עם משמעויות ראייתיות שכדאי להבין מראש עם עורך הדין.',
			),
			'avoid'  => array(
				'למסור גרסה מפורטת בלי ייעוץ, מתוך מחשבה שזה ייגמר מהר.',
				'לא להגיע, או להגיע באיחור בלי תיאום. זה עלול להוביל למעצר.',
				'לדבר על החקירה עם מעורבים אחרים בתיק.',
			),
			'clock'  => 'הייעוץ נכון לפני החקירה, לא אחריה. תיאום דחייה קצרה של מועד החקירה לצורך ייעוץ הוא בקשה מקובלת.',
		),
		'interrogation' => array(
			'label'  => 'נחקרתי באזהרה',
			'now'    => 'אחרי חקירה באזהרה התיק נמצא בידי המשטרה או התביעה, והוא יכול להיסגר, לעבור לשימוע או להבשיל לכתב אישום. זה שלב של איסוף מידע ובניית קו.',
			'rights' => array(
				'זכות להמשיך להיוועץ בעורך דין בכל שלב, כולל לפני חקירות המשך.',
				'אפשר לבקש עיון במסמכים שנמסרו לכם ולשמור העתק של כל מסמך שקיבלתם.',
				'אם נתפסו חפצים או מכשירים, יש הליכים לבקש את השבתם.',
			),
			'avoid'  => array(
				'ליצור קשר עם מתלוננים או עדים. זה עלול להפוך לעבירה נפרדת של שיבוש.',
				'למחוק תכתובות או חומרים. גם זה שיבוש.',
				'להתעלם מהתיק כי "לא שמעתם כלום". דברים קורים גם בשקט.',
			),
			'clock'  => 'אין מועד חוקי שבו חייבים לעדכן אתכם. מעקב יזום של עורך דין אחרי סטטוס התיק הוא הדרך לדעת לפני שמאוחר.',
		),
		'arrest'      => array(
			'label'  => 'מעצר',
			'now'    => 'עצור מובא בפני שופט לכל המאוחר בתוך 24 שעות ממעצרו, בכפוף לחריגים שבחוק. הדיון הראשון הוא צומת קריטי: שחרור, תנאים מגבילים או הארכת מעצר.',
			'rights' => array(
				'זכות להיפגש עם עורך דין בהקדם האפשרי, עוד לפני הדיון.',
				'זכות שבן משפחה יעודכן על המעצר, בכפוף לחריגים.',
				'בדיון: זכות להיות מיוצג ולטעון לחלופת מעצר.',
			),
			'avoid'  => array(
				'לחתום על מסמכים בלי להבין אותם.',
				'לנהל שיחות על התיק בטלפון של בית המעצר או מול עצורים אחרים.',
			),
			'clock'  => 'הבאה בפני שופט: עד 24 שעות ככלל. כל הארכה נדונה מחדש בבית המשפט, ולייצוג טוב בדיון הראשון יש משקל מכריע.',
		),
		'hearing'     => array(
			'label'  => 'קיבלתי מכתב שימוע',
			'now'    => 'מכתב יידוע או שימוע לפי סעיף 60א אומר שהתביעה שוקלת כתב אישום בעבירת פשע. זו הזדמנות אמיתית לשכנע שלא להגיש, לצמצם סעיפים או להגיע להסדר.',
			'rights' => array(
				'זכות לפנות בבקשה מנומקת לתביעה בתוך 30 ימים מקבלת ההודעה, ולבקש שלא להגיש כתב אישום.',
				'אפשר לבקש ארכה מנומקת להגשת הטיעונים.',
				'אפשר לבקש לעיין בעיקרי חומר החקירה לצורך השימוע, בהיקף שנקבע בדין ובפסיקה.',
			),
			'avoid'  => array(
				'לתת למועד לחלוף. שימוע שלא מוגש הוא ויתור על ההזדמנות הטובה ביותר בתיק.',
				'להגיש מכתב כללי בלי היכרות עם חומר החקירה.',
			),
			'clock'  => '30 ימים מקבלת ההודעה לפנייה מנומקת. זה המועד הקריטי ביותר בכל ההליך שלפני כתב האישום.',
		),
		'indictment'  => array(
			'label'  => 'הוגש כתב אישום',
			'now'    => 'מרגע שהוגש כתב אישום, ההליך עובר לבית המשפט: הקראה, מענה לאישום, ראיות, הכרעה. מכאן העבודה היא משפטית מלאה.',
			'rights' => array(
				'זכות לקבל את כל חומר החקירה ולעיין בו לפני מענה לאישום.',
				'זכות לייצוג, ובמקרים שבחוק גם לייצוג מטעם הסנגוריה הציבורית.',
				'אפשר לנהל משא ומתן להסדר טיעון בכל שלב.',
			),
			'avoid'  => array(
				'למסור מענה לאישום בלי שעורך הדין עבר על כל חומר החקירה.',
				'לאחר לדיונים. איחור עלול להוביל לצו הבאה או מעצר.',
			),
			'clock'  => 'המועדים נקבעים על ידי בית המשפט מרגע ההקראה. את לוח הזמנים המחייב מנהל עורך הדין מול המזכירות.',
		),
		'appeal'      => array(
			'label'  => 'אחרי הכרעה או גזר דין',
			'now'    => 'גם אחרי הכרעת דין או גזר דין יש דרכים: ערעור, בקשות שונות, ובהמשך גם מחיקת רישום לפי כללי חוק המידע הפלילי ותקנת השבים.',
			'rights' => array(
				'זכות ערעור לערכאה שמעל, ככלל בתוך 45 ימים מיום מתן פסק הדין.',
				'אפשר לבקש עיכוב ביצוע של רכיבי הענישה עד להכרעה בערעור.',
				'בהמשך הדרך: בדיקת זכאות למחיקת רישום לפי תקופות ההתיישנות והמחיקה שבחוק.',
			),
			'avoid'  => array(
				'לתת ל-45 הימים לחלוף מתוך התלבטות. אפשר להגיש ולמשוך, אי אפשר להחיות מועד שחלף בלי הליך מיוחד.',
			),
			'clock'  => 'ערעור: ככלל 45 ימים. עיכוב ביצוע נדון בנפרד וכדאי לבקש אותו מיד עם ההחלטה על ערעור.',
		),
	);
}

add_shortcode( 'justice_criminal_map', function () {
	$stages = justice_crim_stages();
	$wa     = 'https://wa.me/972525101555?text=' . rawurlencode( 'שלום, אני צריך עזרה דחופה בעניין פלילי ואשמח לשיחה עם עורך דין.' );

	$pills = '';
	$panels = '';
	$first = true;

	foreach ( $stages as $key => $s ) {
		$pills .= '<button type="button" class="jt-cm__pill' . ( $first ? ' is-on' : '' ) . '" data-stage="' . esc_attr( $key ) . '" aria-pressed="' . ( $first ? 'true' : 'false' ) . '">' . esc_html( $s['label'] ) . '</button>';

		$rights = '';
		foreach ( $s['rights'] as $r ) {
			$rights .= '<li>' . esc_html( $r ) . '</li>';
		}

		$avoid = '';
		foreach ( $s['avoid'] as $a ) {
			$avoid .= '<li>' . esc_html( $a ) . '</li>';
		}

		$panels .= '<div class="jt-cm__panel" data-stage="' . esc_attr( $key ) . '"' . ( $first ? '' : ' hidden' ) . '>'
			. '<p class="jt-cm__now">' . esc_html( $s['now'] ) . '</p>'
			. '<div class="jt-cm__cols">'
			. '<div class="jt-cm__col"><h4>הזכויות שלכם עכשיו</h4><ul>' . $rights . '</ul></div>'
			. '<div class="jt-cm__col jt-cm__col--avoid"><h4>טעויות שעולות ביוקר</h4><ul>' . $avoid . '</ul></div>'
			. '</div>'
			. '<p class="jt-cm__clock"><strong>השעון:</strong> ' . esc_html( $s['clock'] ) . '</p>'
			. '</div>';

		$first = false;
	}

	return '<div class="jt-cm" id="jt-cm">'
		. '<h3 class="jt-cm__h">מפת ההליך הפלילי: איפה אתם עומדים?</h3>'
		. '<p class="jt-cm__sub">בחרו את השלב שלכם וקבלו את מה שחשוב עכשיו: הזכויות, הטעויות והמועדים שרצים.</p>'
		. '<div class="jt-cm__pills" role="group" aria-label="שלבי ההליך">' . $pills . '</div>'
		. $panels
		. '<div class="jt-cm__cta">'
		. '<a class="jt-cm__wa" href="' . esc_url( $wa ) . '" target="_blank" rel="noopener nofollow">שיחה דחופה עם עורך דין בוואטסאפ</a>'
		. '<a class="jt-cm__desk" href="' . esc_url( home_url( '/legal-ai-desk/' ) ) . '">קודם להבין את המצב: העוזר המשפטי המיידי</a>'
		. '</div>'
		. '<p class="jt-cm__disc">המפה מציגה עקרונות כלליים ומועדים בסיסיים שבחוק, והיא אינה ייעוץ משפטי. בענייני מעצר, שימוע וערעור המועדים קריטיים, ובכל מקרה אישי נכון לפנות מיד לעורך דין.</p>'
		. '</div>';
} );

add_action( 'wp_head', function () {
	$uri = (string) ( $_SERVER['REQUEST_URI'] ?? '' );

	if ( false === strpos( $uri, 'criminal' ) && false === strpos( $uri, 'legal-tools' ) ) {
		return;
	}

	echo '<style id="jt-cm-css">'
		. '.jt-cm{background:#f7f9fd;border:1px solid #dbe3f0;border-radius:16px;padding:24px;margin:26px 0}'
		. '.jt-cm__h{font-size:22px;color:#14213d;margin:0 0 6px}'
		. '.jt-cm__sub{font-size:14.5px;color:#44506b;margin:0 0 16px}'
		. '.jt-cm__pills{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}'
		. '.jt-cm__pill{background:#fff;border:1.5px solid #cbd6e8;border-radius:999px;padding:9px 16px;font:inherit;font-size:14px;font-weight:700;color:#14213d;cursor:pointer}'
		. '.jt-cm__pill.is-on{background:#14213d;border-color:#14213d;color:#e7c765}'
		. '.jt-cm__now{font-size:15px;color:#1d2740;line-height:1.65;margin:0 0 14px}'
		. '.jt-cm__cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}'
		. '.jt-cm__col{background:#fff;border:1px solid #dbe3f0;border-radius:12px;padding:16px 18px}'
		. '.jt-cm__col--avoid{border-inline-start:4px solid #c8553d}'
		. '.jt-cm__col h4{margin:0 0 8px;font-size:14.5px;color:#14213d}'
		. '.jt-cm__col ul{margin:0;padding-inline-start:18px;font-size:14px;color:#44506b;line-height:1.7}'
		. '.jt-cm__clock{background:#fffdf5;border:1px solid #e7c765;border-radius:10px;padding:10px 14px;font-size:14px;color:#14213d;margin:14px 0 0}'
		. '.jt-cm__cta{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 0}'
		. '.jt-cm__wa{background:#25d366;color:#fff;border-radius:12px;padding:12px 22px;font-weight:800;font-size:15px;text-decoration:none}'
		. '.jt-cm__desk{background:#14213d;color:#e7c765;border-radius:12px;padding:12px 22px;font-weight:800;font-size:15px;text-decoration:none}'
		. '.jt-cm__disc{font-size:12.5px;color:#6b7690;margin:14px 0 0;line-height:1.5}'
		. '</style>';
}, 8 );

add_action( 'wp_footer', function () {
	$uri = (string) ( $_SERVER['REQUEST_URI'] ?? '' );

	if ( false === strpos( $uri, 'criminal' ) && false === strpos( $uri, 'legal-tools' ) ) {
		return;
	}
	?>
	<script id="jt-cm-js">
	(function () {
		var root = document.getElementById('jt-cm');
		if (!root) { return; }
		var pills = root.querySelectorAll('.jt-cm__pill');
		var panels = root.querySelectorAll('.jt-cm__panel');
		pills.forEach(function (p) {
			p.addEventListener('click', function () {
				pills.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
				p.classList.add('is-on');
				p.setAttribute('aria-pressed', 'true');
				panels.forEach(function (pan) { pan.hidden = pan.dataset.stage !== p.dataset.stage; });
			});
		});
	})();
	</script>
	<?php
}, 24 );

/**
 * A standalone tool home until the criminal mega article lands: the map
 * is discoverable today, and the article will embed the same shortcode.
 */
add_action( 'init', function () {
	if ( get_option( 'justice_crim_map_page_v1' ) ) {
		return;
	}

	$existing = get_posts( array(
		'post_type'      => 'page',
		'name'           => 'criminal-process-map',
		'post_status'    => array( 'publish', 'draft' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
	) );

	if ( ! empty( $existing ) ) {
		update_option( 'justice_crim_map_page_v1', 1 );

		return;
	}

	$pid = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'מפת ההליך הפלילי: זכויות, מועדים וצעדים לפי שלב',
		'post_name'    => 'criminal-process-map',
		'post_content' => '<p>ההליך הפלילי מרגיש כמו מבוך, אבל יש לו מפה. בחרו את השלב שבו אתם נמצאים, מזימון לחקירה ועד ערעור, וקבלו תמונה מיידית: מה קורה עכשיו, אילו זכויות עומדות לכם, אילו טעויות עולות ביוקר ואילו מועדים רצים. הכלי חינמי, בלי הרשמה.</p>' . "\n\n" . '[justice_criminal_map]' . "\n\n" . '<p>להרחבה: <a href="/criminal-defense-attorney/">המדריך המלא לעורך דין פלילי</a>, <a href="/apply-for-police-criminal-information-certificates/">תעודת יושר ומידע פלילי</a>, <a href="/lahav-433/">להב 433</a>.</p>',
	) );

	if ( $pid && ! is_wp_error( $pid ) ) {
		update_post_meta( $pid, '_yoast_wpseo_title', 'ההליך הפלילי שלב אחר שלב: זכויות ומועדים | Jus-Tice' );
		update_post_meta( $pid, '_yoast_wpseo_metadesc', 'מפה אינטראקטיבית של ההליך הפלילי: זימון לחקירה, מעצר, שימוע 60א, כתב אישום וערעור. הזכויות, הטעויות והמועדים בכל שלב. חינם, בלי הרשמה.' );
		update_option( 'justice_crim_map_page_v1', 1 );
	}
}, 20 );
