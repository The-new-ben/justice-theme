<?php
/**
 * AI tools strip (navy band) per Homepage.dc.html.
 *
 * Six real tools deep-linking into the gated generator at /legal-tools/
 * (the app supports ?tool= deep links), each with a lawyer cross-link:
 * the content ↔ tool ↔ lawyer mesh from the strategy doc.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_tools_hub = justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' );

$justice_ai_tools = array(
	array(
		'type'        => __( 'חדש · AI', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'סימולציית בית משפט: CourtAI Arena', 'justice-theme' ),
		'desc'        => __( 'דיון מדומה מלא על המקרה שלכם: פתיחות, חקירות, מוצגים והכרעה מנומקת לפי הראיות.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'court-arena', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'עורכי דין לפי תחום ועיר', 'justice-theme' ),
	),
	array(
		'type'        => __( 'חדש · AI', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'סימולציית הכנה לדיון', 'justice-theme' ),
		'desc'        => __( 'שאלות צפויות מהשופט, טיעוני הצד השני ורשימת הכנה, לפי המקרה שלכם.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'hearing-simulation', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'עורכי דין לפי תחום ועיר', 'justice-theme' ),
	),
	array(
		'type'        => __( 'חדש · AI', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'הערכת עלות עורך דין', 'justice-theme' ),
		'desc'        => __( 'טווחי שכר טרחה צפויים לפי תחום ומורכבות, לפי הנתונים שמפורסמים באתר.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'cost-estimator', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'להשוואת הצעות בתחום', 'justice-theme' ),
	),
	array(
		'type'        => __( 'טיוטה חינם', 'justice-theme' ),
		'badge'       => 'free',
		'title'       => __( 'הסכם גירושין', 'justice-theme' ),
		'desc'        => __( 'רכוש, מזונות והוצאות לפני בדיקה משפטית.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'divorce-settlement', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/?area=family-law' ),
		'cross_label' => __( 'עורכי דין גירושין', 'justice-theme' ),
	),
	array(
		'type'        => __( 'טיוטה חינם', 'justice-theme' ),
		'badge'       => 'free',
		'title'       => __( 'בדיקת חוזה נדל"ן', 'justice-theme' ),
		'desc'        => __( 'ריכוז סעיפים ונקודות סיכון לפני חתימה.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'residential-lease', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/?area=real-estate-law' ),
		'cross_label' => __( 'עורכי דין מקרקעין', 'justice-theme' ),
	),
	array(
		'type'        => __( 'שאלון חכם', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'אבחון משפטי ראשוני', 'justice-theme' ),
		'desc'        => __( 'שאלון קצר שמסדר עובדות, מסמכים חסרים והצעד הבא.', 'justice-theme' ),
		'url'         => justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/legal-tools/' ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'איך ההתאמה עובדת', 'justice-theme' ),
	),
);
?>

<section class="jt2-section jt2-section--navy jt2-ai" id="ai-tools">
	<div class="jt2-section__inner">
		<span class="jt2-eyebrow"><?php esc_html_e( 'מרכז ה-AI המשפטי', 'justice-theme' ); ?></span>
		<h2 class="jt2-h2"><?php esc_html_e( 'מתארים פעם אחת, וכל הכלים ממשיכים מאותה נקודה', 'justice-theme' ); ?></h2>
		<p class="jt2-sub"><?php esc_html_e( 'סימולציית בית משפט שאפשר גם לדבר איתה, טיוטות מסמכים, הערכת עלות ועורכי דין מתאימים: הכל מחובר. תיאור המקרה יוצר כאן מפת דיון ראשונית; המעבר ל-Matter המאובטח נושא רק תחום ועמוד מקור, בלי לשלוח את הטקסט בכתובת.', 'justice-theme' ); ?></p>

		<div class="jt2-ai__launcher" id="ai-launcher">
			<div class="jt2-ai__launcher-fields">
				<label class="screen-reader-text" for="ai-launcher-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
				<select id="ai-launcher-area">
					<option value=""><?php esc_html_e( 'בחרו תחום', 'justice-theme' ); ?></option>
					<option value="family-law"><?php esc_html_e( 'משפחה וגירושין', 'justice-theme' ); ?></option>
					<option value="criminal-law"><?php esc_html_e( 'פלילי ותעבורה', 'justice-theme' ); ?></option>
					<option value="real-estate-law"><?php esc_html_e( 'מקרקעין ונדל"ן', 'justice-theme' ); ?></option>
					<option value="labor-law"><?php esc_html_e( 'עבודה', 'justice-theme' ); ?></option>
					<option value="torts"><?php esc_html_e( 'נזיקין וביטוח לאומי', 'justice-theme' ); ?></option>
					<option value="debt-collection"><?php esc_html_e( 'חוזים וכספים', 'justice-theme' ); ?></option>
				</select>
				<label class="screen-reader-text" for="ai-launcher-facts"><?php esc_html_e( 'תיאור המקרה', 'justice-theme' ); ?></label>
				<textarea id="ai-launcher-facts" rows="2" placeholder="<?php esc_attr_e( 'תארו בכמה משפטים מה קרה, והסימולציה תתחיל מזה…', 'justice-theme' ); ?>"></textarea>
			</div>
			<button type="button" id="ai-launcher-go" data-lead-utm-source="homepage" data-lead-utm-medium="ai_center" data-lead-utm-campaign="court_arena"><?php esc_html_e( 'הפעלת הסימולציה כאן ←', 'justice-theme' ); ?></button>
			<span class="jt2-ai__launcher-note"><?php esc_html_e( 'הפרוטוקול נבנה כאן בעמוד. בהמשך תוכלו גם להשיב לשופט בקול ולקבל את המשך הדיון. תרגול בלבד, לא ייעוץ משפטי.', 'justice-theme' ); ?></span>

			<div id="ai-sim-stage" class="jt2-ai__sim">
				<div class="jt2-ai__sim-head">
					<strong><?php esc_html_e( 'אולם בית המשפט הווירטואלי', 'justice-theme' ); ?></strong>
					<span class="jt2-badge jt2-badge--ai"><?php esc_html_e( 'סימולציה חיה', 'justice-theme' ); ?></span>
				</div>
				<div class="jt2-courtroom" aria-label="<?php esc_attr_e( 'משתתפי הדיון', 'justice-theme' ); ?>">
					<div class="jt2-courtroom__seat is-judge"><span class="jt2-courtroom__avatar">&#9878;</span><strong><?php esc_html_e( 'השופט/ת', 'justice-theme' ); ?></strong><em id="ai-sim-status-judge"><?php esc_html_e( 'ממתין/ה לתיק', 'justice-theme' ); ?></em></div>
					<div class="jt2-courtroom__seat"><span class="jt2-courtroom__avatar">&#128100;</span><strong><?php esc_html_e( 'ב"כ התובע', 'justice-theme' ); ?></strong><em><?php esc_html_e( 'מוכן לטעון', 'justice-theme' ); ?></em></div>
					<div class="jt2-courtroom__seat"><span class="jt2-courtroom__avatar">&#128100;</span><strong><?php esc_html_e( 'ב"כ הנתבע', 'justice-theme' ); ?></strong><em><?php esc_html_e( 'מוכן להגיב', 'justice-theme' ); ?></em></div>
					<div class="jt2-courtroom__seat is-you"><span class="jt2-courtroom__avatar">&#11088;</span><strong><?php esc_html_e( 'אתם', 'justice-theme' ); ?></strong><em><?php esc_html_e( 'ספרו מה קרה למעלה', 'justice-theme' ); ?></em></div>
				</div>
				<pre id="ai-sim-paper" class="jt2-ai__sim-paper" dir="rtl" hidden></pre>
				<div class="jt2-ai__sim-actions">
					<a href="#" id="ai-sim-continue" data-lead-utm-source="homepage" data-lead-utm-medium="ai_center" data-lead-utm-campaign="court_arena_continue"><?php esc_html_e( 'המשך: תמליל AI מלא ותשובה לשופט ←', 'justice-theme' ); ?></a>
					<a href="#" id="ai-sim-lawyers"><?php esc_html_e( 'עורכי דין בתחום הזה', 'justice-theme' ); ?></a>
				</div>

				<?php
				// The courtai visual courtroom (owner-supplied embed, 2026-07-03).
				// Click-to-load facade: the external SPA never loads on first
				// paint, so homepage performance and CWV stay untouched.
				$justice_visual_sim_url = (string) apply_filters(
					'justice_theme_visual_simulation_embed_url',
					'https://jus-tice.com/#/intake?jurisdiction=IL&source=organic'
				);
				?>
				<?php if ( '' !== $justice_visual_sim_url ) : ?>
				<div class="jt2-courtroom-visual" id="ai-visual-sim" data-embed-url="<?php echo esc_url( $justice_visual_sim_url ); ?>">
					<button type="button" id="ai-visual-sim-load" class="jt2-courtroom-visual__load">
						<span aria-hidden="true">&#9654;</span>
						<?php esc_html_e( 'פתיחת Matter מאובטח והמשך לזירת JURIS', 'justice-theme' ); ?>
					</button>
					<span class="jt2-courtroom-visual__note"><?php esc_html_e( 'ההדמיה נטענת רק בלחיצה. תרגול והמחשה בלבד, לא ייעוץ משפטי.', 'justice-theme' ); ?></span>
				</div>
				<?php endif; ?>
			</div>
		</div>
		<script>
		( function () {
			var visualWrap = document.getElementById( 'ai-visual-sim' );
			var visualBtn  = document.getElementById( 'ai-visual-sim-load' );
			if ( visualWrap && visualBtn ) {
				visualBtn.addEventListener( 'click', function () {
					var frame = document.createElement( 'iframe' );
					frame.src = visualWrap.getAttribute( 'data-embed-url' );
					frame.className = 'jt2-courtroom-visual__frame';
					frame.setAttribute( 'title', 'הדמיה חזותית של אולם בית המשפט' );
					frame.setAttribute( 'allow', 'camera; microphone; fullscreen; autoplay; display-capture' );
					frame.setAttribute( 'allowfullscreen', '' );
					visualWrap.replaceChildren( frame );
				} );
			}

			var btn = document.getElementById( 'ai-launcher-go' );
			if ( ! btn ) { return; }
			var heByArea = { 'family-law': 'משפחה וגירושין', 'criminal-law': 'פלילי ותעבורה', 'real-estate-law': 'מקרקעין ונדל"ן', 'labor-law': 'עבודה', 'torts': 'נזיקין וביטוח לאומי', 'debt-collection': 'חוזים וכספים' };
			var lawyersUrl = <?php echo wp_json_encode( esc_url( home_url( '/lawyers/' ) ) ); ?>;
			var productIntakeUrl = 'https://jus-tice.com/#/intake';
			var handoffByArea = <?php
				echo wp_json_encode( array(
					'family-law'      => justice_theme_simulation_handoff_context( 'family-law' ),
					'criminal-law'    => justice_theme_simulation_handoff_context( 'criminal-law' ),
					'real-estate-law' => justice_theme_simulation_handoff_context( 'real-estate-law' ),
					'labor-law'       => justice_theme_simulation_handoff_context( 'labor-law' ),
					'torts'           => justice_theme_simulation_handoff_context( 'torts' ),
					'debt-collection' => null,
				) );
			?>;

			function productHandoffUrl( area ) {
				var context = handoffByArea[ area ];
				var params = new URLSearchParams( { jurisdiction: 'IL', source: 'organic' } );
				if ( context ) {
					params.set( 'cluster', context.cluster );
					params.set( 'owner', context.owner );
				}
				return productIntakeUrl + '?' + params.toString();
			}

			function docket( areaHe, facts ) {
				var today = new Date().toLocaleDateString( 'he-IL', { year: 'numeric', month: 'long', day: 'numeric' } );
				return 'פרוטוקול סימולציה: תיק ' + ( areaHe || '__________' ) + '\n' +
					'הוכן ביום ' + today + '\n\n' +
					'א. תיק הדיון\n' + ( facts || '__________' ) + '\n\n' +
					'ב. סדר הדיון\n' +
					'1. פתיחת הדיון על ידי בית המשפט\n' +
					'2. דבר פתיחה: בא כוח התובע\n' +
					'3. דבר פתיחה: בא כוח הנתבע\n' +
					'4. פרשת התביעה: מוצגים וחקירה ראשית\n' +
					'5. חקירה נגדית\n' +
					'6. פרשת ההגנה\n' +
					'7. סיכומים והכרעה מנומקת לפי הראיות\n\n' +
					'בשלב המלא: תמליל דיון שלם, ציוני עוצמה לכל צד, סתירות שהתגלו, ותור אישי מול השופט.\n' +
					'תרגול בלבד. לא ייעוץ משפטי ולא חיזוי תוצאה.';
			}

			btn.addEventListener( 'click', function () {
				var area = document.getElementById( 'ai-launcher-area' ).value;
				var facts = document.getElementById( 'ai-launcher-facts' ).value.trim();
				var stage = document.getElementById( 'ai-sim-stage' );
				var paper = document.getElementById( 'ai-sim-paper' );
				var judge = document.getElementById( 'ai-sim-status-judge' );

				paper.textContent = '';
				paper.hidden = false;
				if ( judge ) { judge.textContent = 'מקריא/ה את התיק...'; }

				// Typewriter render of the real docket, then wire the continue links.
				var full = docket( heByArea[ area ] || '', facts );
				var i = 0;
				var timer = setInterval( function () {
					i += 6;
					paper.textContent = full.slice( 0, i );
					if ( i >= full.length ) {
						clearInterval( timer );
						if ( judge ) { judge.textContent = 'הדיון מוכן. המשיכו לתמליל המלא'; }
					}
				}, 12 );

				try {
					localStorage.setItem( 'justice_ai_prefill', JSON.stringify( {
						tool: 'court-arena',
						ts: Date.now(),
						fields: { arenaArea: heByArea[ area ] || '', arenaFacts: facts }
					} ) );
				} catch ( e ) {}

				var continueUrl = productHandoffUrl( area );
				document.getElementById( 'ai-sim-continue' ).setAttribute( 'href', continueUrl );
				document.getElementById( 'ai-sim-lawyers' ).setAttribute( 'href', area ? lawyersUrl + '?area=' + encodeURIComponent( area ) : lawyersUrl );
				stage.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
			} );
		}() );
		</script>

		<div class="jt2-ai__grid">
			<?php foreach ( $justice_ai_tools as $justice_ai_tool ) : ?>
				<div class="jt2-ai__card">
					<span class="jt2-badge jt2-badge--<?php echo esc_attr( $justice_ai_tool['badge'] ); ?>"><?php echo esc_html( $justice_ai_tool['type'] ); ?></span>
					<h4><a href="<?php echo esc_url( $justice_ai_tool['url'] ); ?>" style="color:inherit;text-decoration:none" data-lead-source-keyword="<?php echo esc_attr( $justice_ai_tool['title'] ); ?>" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools"><?php echo esc_html( $justice_ai_tool['title'] ); ?></a></h4>
					<p><?php echo esc_html( $justice_ai_tool['desc'] ); ?></p>
					<a class="jt2-ai__cross" href="<?php echo esc_url( $justice_ai_tool['cross_url'] ); ?>">↗ <?php echo esc_html( $justice_ai_tool['cross_label'] ); ?></a>
				</div>
			<?php endforeach; ?>
		</div>

		<a class="jt2-ai__all" href="<?php echo esc_url( $justice_tools_hub ); ?>" data-lead-source-keyword="כלים משפטיים" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools"><?php esc_html_e( 'לכל 50 הכלים ←', 'justice-theme' ); ?></a>
	</div>
</section>
