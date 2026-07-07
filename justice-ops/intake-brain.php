<?php
/**
 * Intake brain: guided triage that turns "יש לי בעיה" into a structured,
 * routable lead. Deterministic decision tree (no model in the loop, nothing
 * to hallucinate): area, then situation, then urgency, ending in a WhatsApp
 * handoff whose prefill carries the full path, plus the standard lead form
 * pre-filled with the same context so it routes and bills through the
 * existing engine. Pure front end over machinery that already works.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_brain_tree(): array {
	return array(
		'family-law' => array( 'label' => 'משפחה וגירושין', 'situations' => array(
			'גירושין בהסכמה', 'סכסוך גירושין', 'משמורת והסדרי שהות', 'מזונות ילדים', 'הסכם ממון', 'אלימות במשפחה',
		) ),
		'criminal-law' => array( 'label' => 'פלילי', 'situations' => array(
			'זומנתי לחקירה', 'עצור או מעצר צפוי', 'קיבלתי כתב אישום', 'שימוע לפני כתב אישום', 'מחיקת רישום פלילי',
		) ),
		'real-estate-law' => array( 'label' => 'מקרקעין ונדל"ן', 'situations' => array(
			'קניית דירה', 'מכירת דירה', 'ליקויי בנייה', 'סכסוך שכירות', 'נכס בחו"ל',
		) ),
		'labor-law' => array( 'label' => 'עבודה', 'situations' => array(
			'פיטורים או שימוע', 'לא שולמו זכויות', 'הטרדה או התעמרות בעבודה', 'חוזה עבודה חדש',
		) ),
		'personal-injury-law' => array( 'label' => 'נזיקין ותאונות', 'situations' => array(
			'תאונת דרכים', 'תאונת עבודה', 'רשלנות רפואית', 'נזק מצד שלישי',
		) ),
		'traffic-law' => array( 'label' => 'תעבורה', 'situations' => array(
			'דוח תנועה', 'שלילת רישיון', 'תאונה עם נפגעים', 'נהיגה בשכרות',
		) ),
		'inheritance-law' => array( 'label' => 'ירושה וצוואות', 'situations' => array(
			'עריכת צוואה', 'התנגדות לצוואה', 'סכסוך ירושה', 'צו קיום צוואה',
		) ),
	);
}

add_action( 'init', function () {
	if ( get_option( 'justice_brain_page_v1' ) || get_page_by_path( 'legal-help', OBJECT, 'page' ) ) {
		update_option( 'justice_brain_page_v1', 1 );
		return;
	}

	$pid = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'אבחון משפטי מהיר: לאיזה עורך דין אתם צריכים',
		'post_name'    => 'legal-help',
		'post_content' => '[justice_brain]',
	) );

	if ( $pid && ! is_wp_error( $pid ) ) {
		update_post_meta( $pid, 'seo_title', 'אבחון משפטי מהיר: התאמת עורך דין לפי המצב שלכם | Jus-Tice' );
		update_option( 'justice_brain_page_v1', 1 );
	}
} );

add_shortcode( 'justice_brain', function () {
	$tree = justice_brain_tree();

	$areas = '';
	foreach ( $tree as $key => $node ) {
		$areas .= '<button type="button" class="jt-brain__opt" data-area="' . esc_attr( $key ) . '">' . esc_html( $node['label'] ) . '</button>';
	}

	$json = wp_json_encode( $tree, JSON_UNESCAPED_UNICODE );

	return '<p>שלוש שאלות קצרות, בלי פרטים אישיים, ובסוף: פנייה מסודרת בוואטסאפ או בטופס, כבר עם כל ההקשר.</p>'
		. '<div class="jt-brain" id="jt-brain">'
		. '<div class="jt-brain__step" id="jtb-1"><h2>מה התחום?</h2><div class="jt-brain__opts">' . $areas . '</div></div>'
		. '<div class="jt-brain__step" id="jtb-2" hidden><h2>מה המצב?</h2><div class="jt-brain__opts" id="jtb-sits"></div></div>'
		. '<div class="jt-brain__step" id="jtb-3" hidden><h2>כמה זה דחוף?</h2><div class="jt-brain__opts">'
		. '<button type="button" class="jt-brain__opt" data-urg="דחוף מאוד, עניין של ימים">דחוף מאוד</button>'
		. '<button type="button" class="jt-brain__opt" data-urg="בשבועות הקרובים">בשבועות הקרובים</button>'
		. '<button type="button" class="jt-brain__opt" data-urg="התייעצות ראשונית">רק מתייעץ</button>'
		. '</div></div>'
		. '<div class="jt-brain__step" id="jtb-4" hidden>'
		. '<h2>הפנייה מוכנה</h2><p id="jtb-summary" class="jt-brain__sum"></p>'
		. '<a id="jtb-wa" class="jt-brain__wa" href="#" target="_blank" rel="noopener nofollow">שליחה בוואטסאפ עכשיו</a>'
		. '<p style="margin:14px 0 6px;font-weight:700">או השאירו פרטים ונחזור אליכם:</p>'
		. '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="jt-brain__form">'
		. '<input type="hidden" name="action" value="justice_submit_lead">'
		. '<input type="hidden" name="lead_source_surface" value="intake_brain">'
		. wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce', true, false )
		. '<div class="justice-lead-guard" aria-hidden="true" style="position:absolute;inset-inline-start:-9999px"><label>Company<input type="text" name="justice_lead_company" tabindex="-1" autocomplete="off" value=""></label></div>'
		. '<input type="hidden" name="justice_lead_started_at" value="' . esc_attr( (string) time() ) . '">'
		. '<input type="hidden" name="lead_area" id="jtb-area-field" value="general">'
		. '<input type="hidden" name="lead_urgency" id="jtb-urg-field" value="normal">'
		. '<input type="hidden" name="lead_message" id="jtb-msg-field" value="">'
		. '<p><label>שם מלא</label><input type="text" name="lead_name" required></p>'
		. '<p><label>טלפון</label><input type="tel" name="lead_phone" required></p>'
		. '<p><label>עיר</label><input type="text" name="lead_city"></p>'
		. '<button type="submit" class="jt-brain__send">שליחת הפנייה</button>'
		. '</form>'
		. '<p><button type="button" class="jt-brain__restart" onclick="jtbGo(1)">התחלה מחדש</button></p>'
		. '</div></div>'
		. '<script>var JTB=' . $json . ';var jtbA="",jtbAL="",jtbS="",jtbU="";'
		. 'function jtbGo(n){for(var i=1;i<=4;i++){document.getElementById("jtb-"+i).hidden=(i!==n)}}'
		. 'document.querySelectorAll("#jtb-1 .jt-brain__opt").forEach(function(b){b.addEventListener("click",function(){jtbA=this.dataset.area;jtbAL=this.textContent;var c=document.getElementById("jtb-sits");c.innerHTML="";JTB[jtbA].situations.forEach(function(s){var x=document.createElement("button");x.type="button";x.className="jt-brain__opt";x.textContent=s;x.addEventListener("click",function(){jtbS=s;jtbGo(3)});c.appendChild(x)});jtbGo(2)})});'
		. 'document.querySelectorAll("#jtb-3 .jt-brain__opt").forEach(function(b){b.addEventListener("click",function(){jtbU=this.dataset.urg;var sum="תחום: "+jtbAL+" | מצב: "+jtbS+" | דחיפות: "+jtbU;document.getElementById("jtb-summary").textContent=sum;'
		. 'var msg="שלום, עברתי אבחון מהיר באתר. "+sum+". אשמח לשוחח עם עורך דין מתאים.";'
		. 'document.getElementById("jtb-wa").href="https://wa.me/972525101555?text="+encodeURIComponent(msg);'
		. 'document.getElementById("jtb-area-field").value=jtbA;'
		. 'document.getElementById("jtb-urg-field").value=(jtbU.indexOf("דחוף")===0?"high":(jtbU.indexOf("התייעצות")===0?"low":"normal"));'
		. 'document.getElementById("jtb-msg-field").value=sum;'
		. 'jtbGo(4)})});</script>'
		. '<style>.jt-brain{border:1.5px solid transparent;border-radius:20px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:24px;margin:18px 0;box-shadow:0 16px 36px -22px rgba(13,23,54,.35)}'
		. '.jt-brain h2{color:#14213d;font-size:19px;margin:0 0 12px}'
		. '.jt-brain__opts{display:flex;flex-wrap:wrap;gap:10px}'
		. '.jt-brain__opt{background:#f1f4fb;border:1.5px solid #dfe4f0;border-radius:999px;padding:11px 18px;font-size:15px;font-weight:700;color:#26324e;cursor:pointer;min-height:46px}'
		. '.jt-brain__opt:hover{background:#14213d;color:#fff;border-color:#14213d}'
		. '.jt-brain__sum{background:#f7f2e7;border-radius:12px;padding:12px 14px;font-weight:700;color:#14213d}'
		. '.jt-brain__wa{display:inline-block;background:linear-gradient(180deg,#2ade70,#1fb355);color:#fff;border-radius:12px;padding:13px 26px;font-weight:800;text-decoration:none;min-height:48px}'
		. '.jt-brain__form label{display:block;font-weight:700;color:#26324e;margin-bottom:4px}'
		. '.jt-brain__form input{width:100%;max-width:340px;border:1px solid #ccd3e2;border-radius:10px;padding:10px;font-size:15px}'
		. '.jt-brain__send{background:#14213d;color:#fff;border:0;border-radius:11px;padding:12px 28px;font-weight:800;cursor:pointer}'
		. '.jt-brain__restart{background:none;border:0;color:#6a7285;text-decoration:underline;cursor:pointer}</style>';
} );
