<?php
/**
 * Document generators: the DoNotPay pattern, Hebrew-first.
 *
 * Guided builders that assemble a ready-to-send letter in the browser from
 * hand-written neutral skeletons (no model in the loop, no invented statute
 * citations). The output ends in two paths: copy the letter, or send it to
 * a lawyer for review over WhatsApp, which is a prequalified lead carrying
 * the full context. English slugs, auto-created pages, an index page, and
 * FAQ blocks for search.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_docs_registry(): array {
	return array(
		'demand-letter-generator' => array(
			'title' => 'מכתב התראה לפני נקיטת הליכים: מחולל מכתב מוכן לשליחה',
			'seo'   => 'מכתב התראה: מחולל חינמי לפני תביעה | Jus-Tice',
			'h1'    => 'מחולל מכתב התראה',
			'intro' => '<p><strong>מכתב התראה</strong> מסודר הוא לרוב הצעד שפותר סכסוך לפני שמגיעים לבית משפט: הוא מציג את הדרישה, קוצב מועד, ומאותת שהצד הדורש מתייחס ברצינות. ממלאים את הפרטים, מקבלים נוסח מוכן, ולפני שליחה כדאי שעורך דין יעבור עליו.</p>',
			'fields' => array(
				array( 'id' => 'sender', 'label' => 'שם השולח' ),
				array( 'id' => 'recipient', 'label' => 'שם הנמען' ),
				array( 'id' => 'subject', 'label' => 'נושא הדרישה (למשל: חוב בסך 8,000 ₪ עבור שירותי שיפוץ)' ),
				array( 'id' => 'facts', 'label' => 'תיאור קצר של העובדות', 'type' => 'textarea' ),
				array( 'id' => 'demand', 'label' => 'מה אתם דורשים (סכום או פעולה)' ),
				array( 'id' => 'days', 'label' => 'ימים למענה', 'type' => 'number', 'value' => 14 ),
			),
			'template' => "לכבוד {recipient}\n\nהנדון: התראה לפני נקיטת הליכים משפטיים, {subject}\n\n1. הריני לפנות אליך בעניין שבנדון.\n2. {facts}\n3. לאור האמור, הנך נדרש {demand} וזאת בתוך {days} ימים ממועד מכתב זה.\n4. ככל שלא תיענה דרישה זו במועד, אשקול נקיטת הליכים משפטיים, לרבות פנייה לערכאות, וזאת ללא התראה נוספת.\n5. אין באמור במכתב זה כדי למצות את מלוא הטענות והזכויות העומדות לי על פי כל דין.\n\nבכבוד רב,\n{sender}",
			'faq' => array(
				array( 'q' => 'האם חובה לשלוח מכתב התראה לפני תביעה', 'a' => 'ברוב ההליכים אין חובה חוקית, אך מכתב התראה מסודר משפר את העמדה: הוא מתעד את הדרישה, פותח פתח לפשרה מוקדמת, ולעיתים נדרש כתנאי להוצאות משפט.' ),
				array( 'q' => 'איך כדאי לשלוח את המכתב', 'a' => 'בדואר רשום עם אישור מסירה, במסירה אישית מתועדת, או בדוא"ל עם אישור קריאה. שמרו העתק של המכתב ושל אסמכתת המשלוח.' ),
				array( 'q' => 'מתי חשוב שעורך דין ינסח את ההתראה', 'a' => 'כשהסכום גבוה, כשיש חוזה עם סעיפי בוררות או התיישנות קרובה, וכשלצד השני יש ייצוג. מכתב על נייר של משרד עורכי דין גם משדר רצינות גבוהה יותר.' ),
			),
			'wa' => 'שלום, הכנתי מכתב התראה במחולל ואשמח שעורך דין יעבור עליו לפני שליחה.',
		),
		'parking-ticket-appeal-generator' => array(
			'title' => 'ערעור על דוח חניה: מחולל בקשה לביטול',
			'seo'   => 'ערעור על דוח חניה: מחולל מכתב לביטול | Jus-Tice',
			'h1'    => 'מחולל ערעור על דוח חניה',
			'intro' => '<p><strong>בקשה לביטול דוח חניה</strong> מוגשת בכתב לרשות שהוציאה את הדוח, בתוך המועד הנקוב בו. מנסחים עובדות בקצרה, מצרפים אסמכתאות, ושולחים לפי הפרטים שעל גבי הדוח. המחולל בונה נוסח פנייה מסודר.</p>',
			'fields' => array(
				array( 'id' => 'sender', 'label' => 'שם מלא' ),
				array( 'id' => 'idnum', 'label' => 'תעודת זהות' ),
				array( 'id' => 'ticket', 'label' => 'מספר הדוח' ),
				array( 'id' => 'car', 'label' => 'מספר רכב' ),
				array( 'id' => 'city', 'label' => 'הרשות שהוציאה את הדוח (עירייה)' ),
				array( 'id' => 'reason', 'label' => 'נימוק הבקשה (מה קרה בפועל)', 'type' => 'textarea' ),
			),
			'template' => "לכבוד\nהמחלקה לחניה, עיריית {city}\n\nהנדון: בקשה לביטול הודעת תשלום קנס מספר {ticket}\n\n1. אני, {sender}, ת\"ז {idnum}, מחזיק הרכב מספר {car}, פונה בבקשה לביטול הדוח שבנדון.\n2. נימוקי הבקשה: {reason}\n3. מצורפות אסמכתאות התומכות בבקשה.\n4. לאור האמור, אבקש להורות על ביטול הדוח. ככל שתידחה הבקשה, אבקש לקבל החלטה מנומקת בכתב.\n\nבכבוד רב,\n{sender}",
			'faq' => array(
				array( 'q' => 'תוך כמה זמן מגישים בקשה לביטול דוח חניה', 'a' => 'המועד נקוב על גבי הדוח עצמו ומתחיל ממועד ההמצאה. חשוב לא להמתין: איחור עלול לחסום את מסלול הבקשה ולהשאיר רק תשלום או משפט.' ),
				array( 'q' => 'אילו נימוקים מקובלים לביטול', 'a' => 'תמרור לא תקין או מוסתר, שילוט חסר, חניה בהוראת גורם מוסמך, רכב שנמכר לפני מועד הדוח, או נסיבות רפואיות דחופות מתועדות. לכל נימוק כדאי לצרף אסמכתה.' ),
				array( 'q' => 'מה עושים אם הבקשה נדחתה', 'a' => 'אפשר לבקש להישפט על הדוח בתוך המועד שבהחלטה. בשלב הזה ייעוץ משפטי קצר יכול לחסוך הליך מיותר או לחזק את התיק.' ),
			),
			'wa' => 'שלום, הכנתי ערעור על דוח חניה במחולל ואשמח לחוות דעת מהירה לפני הגשה.',
		),
	);
}

add_action( 'init', function () {
	if ( get_option( 'justice_docs_pages_v1' ) ) {
		return;
	}

	foreach ( justice_docs_registry() as $slug => $doc ) {
		if ( ! get_page_by_path( $slug, OBJECT, 'page' ) ) {
			$pid = wp_insert_post( array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $doc['title'],
				'post_name'    => $slug,
				'post_content' => '[justice_doc id="' . $slug . '"]',
			) );
			if ( $pid && ! is_wp_error( $pid ) ) {
				update_post_meta( $pid, 'seo_title', $doc['seo'] );
			}
		}
	}

	if ( ! get_page_by_path( 'legal-documents', OBJECT, 'page' ) ) {
		$pid = wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => 'מסמכים משפטיים מוכנים: מחוללים חינמיים',
			'post_name'    => 'legal-documents',
			'post_content' => '[justice_docs_index]',
		) );
		if ( $pid && ! is_wp_error( $pid ) ) {
			update_post_meta( $pid, 'seo_title', 'מחוללי מסמכים משפטיים: מכתב התראה, ערעור דוח ועוד | Jus-Tice' );
		}
	}

	update_option( 'justice_docs_pages_v1', 1 );
} );

add_shortcode( 'justice_docs_index', function () {
	$out = '<div class="jt-calc-grid">';
	foreach ( justice_docs_registry() as $slug => $doc ) {
		$out .= '<a class="jt-calc-tile" href="' . esc_url( home_url( '/' . $slug . '/' ) ) . '"><strong>' . esc_html( $doc['h1'] ) . '</strong><span>נוסח מוכן בתוך דקה, חינם</span></a>';
	}
	$out .= '<a class="jt-calc-tile" href="' . esc_url( home_url( '/legal-calculators/' ) ) . '"><strong>מחשבונים משפטיים</strong><span>פיצויים, הבראה, חופשה ואגרות</span></a>';
	return $out . '</div><style>.jt-calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin:20px 0}.jt-calc-tile{display:block;border:1.5px solid transparent;border-radius:16px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:18px;box-shadow:0 12px 28px -18px rgba(13,23,54,.3);text-decoration:none}.jt-calc-tile strong{display:block;color:#14213d;font-size:16.5px;margin-bottom:4px}.jt-calc-tile span{color:#6a7285;font-size:13px}</style>';
} );

add_shortcode( 'justice_doc', function ( $atts ) {
	$atts = shortcode_atts( array( 'id' => '' ), $atts );
	$reg  = justice_docs_registry();

	if ( ! isset( $reg[ $atts['id'] ] ) ) {
		return '';
	}

	$doc    = $reg[ $atts['id'] ];
	$fields = '';

	foreach ( $doc['fields'] as $f ) {
		$fields .= '<p class="jt-calc__field"><label for="jtd-' . esc_attr( $f['id'] ) . '">' . esc_html( $f['label'] ) . '</label>';
		if ( ( $f['type'] ?? '' ) === 'textarea' ) {
			$fields .= '<textarea id="jtd-' . esc_attr( $f['id'] ) . '" rows="3"></textarea>';
		} elseif ( ( $f['type'] ?? '' ) === 'number' ) {
			$fields .= '<input id="jtd-' . esc_attr( $f['id'] ) . '" type="number" value="' . esc_attr( (string) ( $f['value'] ?? '' ) ) . '">';
		} else {
			$fields .= '<input id="jtd-' . esc_attr( $f['id'] ) . '" type="text">';
		}
		$fields .= '</p>';
	}

	$ids = wp_json_encode( wp_list_pluck( $doc['fields'], 'id' ) );
	$faq = '';
	foreach ( $doc['faq'] as $item ) {
		$faq .= '<h3>' . esc_html( $item['q'] ) . '</h3><p>' . esc_html( $item['a'] ) . '</p>';
	}

	return $doc['intro']
		. '<div class="jt-calc">' . $fields
		. '<button type="button" class="jt-calc__go" onclick="jtDoc()">בניית המסמך</button>'
		. '<textarea id="jtd-out" class="jt-doc__out" rows="14" hidden readonly></textarea>'
		. '<div id="jtd-actions" hidden><button type="button" class="jt-calc__go" onclick="jtDocCopy()">העתקה</button> '
		. '<a class="jt-calc__wa" id="jtd-wa" href="#" target="_blank" rel="noopener nofollow">בדיקת עורך דין בוואטסאפ</a></div>'
		. '</div>'
		. '<script>var JTD_T=' . wp_json_encode( $doc['template'] ) . ';var JTD_F=' . $ids . ';var JTD_WA=' . wp_json_encode( $doc['wa'] ) . ';'
		. 'function jtDoc(){var t=JTD_T;JTD_F.forEach(function(id){var v=(document.getElementById("jtd-"+id).value||"________");t=t.split("{"+id+"}").join(v)});var o=document.getElementById("jtd-out");o.value=t;o.hidden=false;document.getElementById("jtd-actions").hidden=false;'
		. 'document.getElementById("jtd-wa").href="https://wa.me/972525101555?text="+encodeURIComponent(JTD_WA+"\\n\\n"+t.substring(0,600));}'
		. 'function jtDocCopy(){var o=document.getElementById("jtd-out");o.select();document.execCommand("copy");}</script>'
		. '<style>.jt-calc{border:1.5px solid transparent;border-radius:18px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:22px;margin:20px 0;box-shadow:0 14px 32px -20px rgba(13,23,54,.32)}.jt-calc__field label{display:block;font-weight:700;color:#26324e;margin:0 0 5px}.jt-calc__field input,.jt-calc__field textarea{width:100%;max-width:520px;border:1px solid #ccd3e2;border-radius:10px;padding:10px;font-size:15px}.jt-calc__go{background:#14213d;color:#fff;border:0;border-radius:11px;padding:12px 26px;font-weight:800;font-size:15px;cursor:pointer;margin-top:6px}.jt-doc__out{width:100%;margin-top:14px;border:1px solid #ccd3e2;border-radius:12px;padding:14px;font-size:14.5px;line-height:1.7;background:#fbfcff}.jt-calc__wa{display:inline-block;background:linear-gradient(180deg,#2ade70,#1fb355);color:#fff;border-radius:11px;padding:12px 20px;font-weight:800;text-decoration:none}</style>'
		. '<p style="color:#6a7285;font-size:13px">הנוסח כללי ואינו ייעוץ משפטי; מומלץ שעורך דין יתאים אותו לנסיבות.</p>'
		. '<h2>שאלות נפוצות</h2>' . $faq;
} );
