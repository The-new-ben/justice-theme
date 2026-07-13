<?php
/**
 * Legacy URL rescue: 301s for dead historical URLs that still carry Search
 * equity. Wave-0 sweep (2026-07-13) HEAD-checked all 1,215 GSC-known
 * non-inventory URLs: 1,016 already redirect, 70 live, and these 129 were
 * hard 404s carrying 748 clicks / 289k impressions over 16 months. Each
 * entry maps to its topical owner (slug-match first, then practice pillar,
 * then the articles hub). Full evidence: project-control/rebuild-plan-2026-07.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_legacy_redirect_map(): array {
	return array(
		'//' => '/articles/',
		'/?sfid=335&sf_action=get_data&sf_data=form/' => '/articles/',
		'/attorneys-how-to-manage-your-stress-and-stop-procrastinating/' => '/lawyers/',
		'/avvo/' => '/articles/',
		'/corona_virus/אזור-מוגבל-הרובעים-בעיר-ירושלם/amp/' => '/articles/',
		'/corona_virus/מתווה-הקניונים/amp/' => '/articles/',
		'/decision66529-11-19/' => '/articles/',
		'/department-of-justice/' => '/articles/',
		'/edp/' => '/articles/',
		'/epa-guide-qa/' => '/articles/',
		'/find-lawyer/' => '/lawyers/',
		'/how-much-does-a-lawyer-cost/' => '/lawyers/',
		'/immigration/' => '/immigration-lawyer/',
		'/international-contract-lawyer/' => '/lawyers/',
		'/israeli-lawyer-explains-real-estate/' => '/real-estate-attorney/',
		'/join-justice-lawyers-group/' => '/lawyers/',
		'/lahav-433/' => '/articles/',
		'/lawyers/firm_name_he/' => '/lawyers/',
		'/lawyers/א-ב-עורך-דין-בהקמה/' => '/lawyers/',
		'/lawyers/עורך-דין/' => '/lawyers/',
		'/leading-criminal-law-firm/' => '/criminal-defense-attorney/',
		'/legal-tax-saving-guide/' => '/articles/',
		'/medical-malpractice-lawyer-1130/' => '/medical-malpractice-lawyer/',
		'/notice-of-termination/' => '/labor-lawyer/',
		'/petition-approval-debt-arrangement-creditors/' => '/articles/',
		'/practice-areas/איכות-סביבה/' => '/articles/',
		'/practice-areas/ביטוח/' => '/articles/',
		'/practice-areas/בלוקציין-ומטבעות-קריפטוגרפים/' => '/articles/',
		'/practice-areas/לשון-הרע/' => '/articles/',
		'/practice-areas/מיסים/' => '/articles/',
		'/practice-areas/משפט-מנהלי/' => '/articles/',
		'/practice-areas/ענייני-ירושה/' => '/inheritance-lawyer/',
		'/practice-areas/פיצויים/' => '/personal-injury-law/',
		'/psakdin/criminal-conviction/' => '/criminal-defense-attorney/',
		'/psakdin/offense-license/' => '/articles/',
		'/psakdin/page/3/' => '/articles/',
		'/psakdin/page/4/' => '/articles/',
		'/psakdin/procedures-law/' => '/articles/',
		'/psakdin/חוק-הכשרות-המשפטית-והאפוטרופסות-תשכב-1962/feed/' => '/articles/',
		'/psakdin/מה-עושים-עורךי-דין-בבית-המשפט-ומהם-חומ/' => '/articles/',
		'/psakdin/תשלום-מס-שכר-בגין-שכרם-של-עובדי-העירייה/' => '/articles/',
		'/real-estate-registration-procedure-israel/' => '/real-estate-attorney/',
		'/recommended-jus-tice-team-lawyer/' => '/recommended-jus-tice-team-lawyer/',
		'/review-of-divorce-by-divorce-lawyer-israel/' => '/divorce-lawyer/',
		'/small_claims/company/' => '/articles/',
		'/supreme-court-of-israel/' => '/articles/',
		'/tma-38-and-urban-renewal-lawyer?amp/' => '/lawyers/',
		'/what-is-child-custody/' => '/articles/',
		'/איזורים/תל-אביב-והמרכז/' => '/articles/',
		'/איפה-כדאי-להששקיע-נדלן-בדובאי/' => '/real-estate-attorney/',
		'/דוגמא-לסכם-פינוי-בינוי/' => '/articles/',
		'/דרכון-יווני-הגירה-רילוחיישן-מגורים-מה-הדרישות-והעלויות/' => '/immigration-lawyer/',
		'/דרכון-יווני-הגירה-רילוקישן-מגורים-מה-הדרישות-והעלויות/' => '/immigration-lawyer/',
		'/הלילי-המעצר-כמה-עולה-עורך-דין-מעצרים-מחירון-עוד-פלילי/' => '/criminal-defense-attorney/',
		'/חתימת-עורך-דין-נוטריוני/' => '/lawyers/',
		'/טופס-לפי-חוק-למניעת-העסקה-של-עברייני-מין-במוסד-המכוון-למתן-שירות-לקטיים/' => '/articles/',
		'/כיצד-למצוא-עזרה-משפטית-כאשר-אינך-יכול-להרשות-לעצמך-עורך-דין/' => '/lawyers/',
		'/מדיה/' => '/articles/',
		'/מדריך-עדכני-לגירושין/)/' => '/divorce-lawyer/',
		'/מדריכי-דירוג-עורכי-דין-מובילים-ושיטות-דירוג/' => '/lawyers/',
		'/מדריע-עדכני-לגירושין/' => '/divorce-lawyer/',
		'/מועד-הקרע-בגירושין-לצורך-איזון-משאבים-בינ-בני-זוג-לשעבר-תלהמ-23952-08-19/' => '/divorce-lawyer/',
		'/משרד-המשפטים-ישראל/סניגוריה-ציבורית/' => '/articles/',
		'/משרד-עורכי-דין-פלילי-הכי-טוב-תל-אביב/' => '/criminal-defense-attorney/',
		'/עונש-פלילי-עבירות-נשק-נשיאה-והובלה/' => '/criminal-defense-attorney/',
		'/עורך-דין-פלילי-הכי-טוב-בארץ/' => '/criminal-defense-attorney/',
		'/עורך-דין-פלילי-שכר-כמה-מרוויח-עוד-עלילי-בישראל/' => '/criminal-defense-attorney/',
		'/עורך-דין-פלילי-תותח/' => '/criminal-defense-attorney/',
		'/עורך-דין-תאילד/' => '/lawyers/',
		'/עורכי-דין/' => '/lawyers/',
		'/עורכי-דין/10-הטיפים-הטובים-ביותר-לשכירת-עורך-דין/' => '/lawyers/',
		'/עורכי-דין/א-ב-עורך-דין-בהקמה/' => '/lawyers/',
		'/עורכי-דין/עוד-גיא-פרץ/' => '/lawyers/',
		'/עורכי-דין/עוד-דניאל-אשכנזי/' => '/lawyers/',
		'/עורכי-דין/עוד-יוסי-לוי/' => '/lawyers/',
		'/עורכי-דין/עוד-מרים-כהן/' => '/lawyers/',
		'/עורכי-דין/עוד-רונית-בנימין/' => '/lawyers/',
		'/עורכי-דין/עורכי-דין-בתחום-הנזיקין/' => '/personal-injury-law/',
		'/עורכי-דין/עורכי-הדין-המפורסמים-ביותר-להגנה-פליל/' => '/criminal-defense-attorney/',
		'/עורכת-דין-גאסטיס-ישראל/' => '/articles/',
		'/קטגוריות-מאמרים/איכות-סביבה/' => '/articles/',
		'/קטגוריות-מאמרים/ביטוח/' => '/articles/',
		'/קטגוריות-מאמרים/בלוקציין-ומטבעות-קריפטוגרפים/' => '/articles/',
		'/קטגוריות-מאמרים/דיני-משפחה/גירושין/מזונות-ילדים/' => '/divorce-lawyer/',
		'/קטגוריות-מאמרים/דיני-משפחה/פסקי-דין-גירושיו-דיני-משפחה-2022/' => '/family-law/',
		'/קטגוריות-מאמרים/דיני-משפחה/פסקי-דין-חשובים/' => '/family-law/',
		'/קטגוריות-מאמרים/דיני-נזיקין/' => '/personal-injury-law/',
		'/קטגוריות-מאמרים/דיני-נזיקין/עוד-נזיקין-פסקי-דין/' => '/personal-injury-law/',
		'/קטגוריות-מאמרים/דיני-תעבורה/' => '/traffic-lawyer/',
		'/קטגוריות-מאמרים/דיני-תקשורת/' => '/articles/',
		'/קטגוריות-מאמרים/חדלות-פירעון/' => '/articles/',
		'/קטגוריות-מאמרים/ירושות-וצוואות/' => '/articles/',
		'/קטגוריות-מאמרים/כנסת-ישראל/' => '/articles/',
		'/קטגוריות-מאמרים/לשון-הרע/' => '/articles/',
		'/קטגוריות-מאמרים/מיזוגים-ורכישות/' => '/articles/',
		'/קטגוריות-מאמרים/מיסים/' => '/articles/',
		'/קטגוריות-מאמרים/מסחרי-אזרחי/' => '/articles/',
		'/קטגוריות-מאמרים/מסחרי-אזרחי/רישוי-עסקים/' => '/articles/',
		'/קטגוריות-מאמרים/משפט-ימי/' => '/articles/',
		'/קטגוריות-מאמרים/משפט-מנהלי/' => '/articles/',
		'/קטגוריות-מאמרים/משפט-פלילי/עורך-דין-פלילי-פסקי-דין-2022/' => '/criminal-defense-attorney/',
		'/קטגוריות-מאמרים/משפט-פלילי/פלילי-פסקי-דין-חשובים/' => '/criminal-defense-attorney/',
		'/קטגוריות-מאמרים/ענייני-ירושה/' => '/inheritance-lawyer/',
		'/קטגוריות-מאמרים/פיצויים/' => '/personal-injury-law/',
		'/קטגוריות-מאמרים/פלתד/' => '/articles/',
		'/קטגוריות-מאמרים/צוואות/' => '/articles/',
		'/קטגוריות-מאמרים/קניין-רוחני/' => '/articles/',
		'/קטגוריות-מאמרים/תובענות-ייצוגיות/' => '/articles/',
		'/תחומי-התמחות/bankruptcy/' => '/articles/',
		'/תחומי-התמחות/family-law/' => '/family-law/',
		'/תחומי-התמחות/labor-law/' => '/labor-lawyer/',
		'/תחומי-התמחות/real-estate/' => '/real-estate/',
		'/תחומי-התמחות/torts/' => '/articles/',
		'/תחומי-התמחות/עוד-נזיקין-פסקי-דין/' => '/personal-injury-law/',
		'/תחנות-משטרה-כתובת-בשוטרה-רשימה-ארצית-מעודכן/' => '/articles/',
		'/תחנות-משטרה-כתובת-טלפון-רשימה-רצית-מעודכן/' => '/articles/',
		'/תחנות-משטרה-כתובת-לפון-רשימה-ארצית-מעודכן/' => '/articles/',
		'/תחנות-משטרה-כתובת-מעודכן/' => '/articles/',
	);
}

add_action( 'template_redirect', function () {
	if ( ! is_404() ) {
		return;
	}

	$path = rawurldecode( (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ) );
	$path = '/' . trim( $path, '/' ) . '/';

	if ( '//' === $path ) {
		return;
	}

	$map = justice_legacy_redirect_map();

	if ( isset( $map[ $path ] ) ) {
		wp_redirect( home_url( $map[ $path ] ), 301 );
		exit;
	}
}, -9000 );
