<?php
/**
 * Owner-only revenue stream map.
 *
 * This keeps strategic revenue ideas visible inside wp-admin without exposing
 * internal pricing, blockers, partner strategy or payment status to the public.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_revenue_streams_admin_menu(): void {
	add_submenu_page(
		'justice-crm',
		'Revenue Streams',
		'Revenue Streams',
		'edit_pages',
		'justice-revenue-streams',
		'justice_theme_render_revenue_streams_admin_page'
	);
}
add_action( 'admin_menu', 'justice_theme_revenue_streams_admin_menu' );

function justice_theme_revenue_streams_linear_url( string $issue ): string {
	$slug_by_issue = array(
		'HAD-75' => 'revenue-streams-backlog-consolidate-plays-1-32-into-execution-system',
		'HAD-76' => 'finish-started-bituach-leumi-appeal-funnel-to-first-billable-lead',
		'HAD-77' => 'build-internal-revenue-streams-map-admin-page',
		'HAD-78' => 'anti-cannibalization-audit-for-calculators-and-money-tools',
		'HAD-79' => 'supplier-and-immigration-marketplace-with-smart-bidding-mechanism',
		'HAD-80' => 'wave-1-urgent-legal-money-funnels-aliyah-tax-hostile-act-reservists',
		'HAD-81' => 'wave-2-conversion-infrastructure-ai-intake-whatsapp-rag-demand-letters',
		'HAD-82' => 'multi-professional-directory-and-claim-profile-expansion',
		'HAD-83' => 'advanced-niche-revenue-streams-accessibility-crypto-class-actions',
		'HAD-84' => 'enterprise-and-premium-platform-plays-harvil-contract-ai-virtual-law',
		'HAD-85' => 'legal-qa-and-court-ruling-seo-moat',
		'HAD-86' => 'employment-and-real-estate-due-diligence-tool-funnels',
	);

	if ( ! isset( $slug_by_issue[ $issue ] ) ) {
		return '';
	}

	return sprintf( 'https://linear.app/hadmaia/issue/%s/%s', strtolower( $issue ), $slug_by_issue[ $issue ] );
}

function justice_theme_revenue_streams_backlog(): array {
	return array(
		array(
			'id'             => '1',
			'name'           => 'Bituach Leumi appeal funnel',
			'status'         => 'started',
			'wave'           => 'Started work',
			'issue'          => 'HAD-76',
			'public_title'   => 'ערעור ביטוח לאומי: בדיקת כדאיות וליווי עורך דין',
			'slug'           => '/bituach-leumi-appeal-guide/',
			'target_keyword' => 'ערעור ביטוח לאומי',
			'monetization'   => 'Qualified appeal lead fee, manual invoice first.',
			'infrastructure' => 'Live route, calculator JS, paid-lawyer routing, lead caps, CRM billing queue.',
			'guard'          => 'Do not promise disability percentage, award size or appeal result.',
			'next_action'    => 'Recruit 3 specialist lawyers and run one real lead through billing.',
		),
		array(
			'id'             => '2',
			'name'           => 'Severance-pay calculator and demand letter',
			'status'         => 'backlog',
			'wave'           => 'Wave 1 tools',
			'issue'          => 'HAD-86',
			'public_title'   => 'מחשבון פיצויי פיטורים ובדיקת זכויות לפני פנייה לעורך דין',
			'slug'           => 'audit first',
			'target_keyword' => 'מחשבון פיצויי פיטורים',
			'monetization'   => 'Paid lawyer review and labor-law lead fee.',
			'infrastructure' => 'justice_legal_tool, justice_legal_request, CRM billing queue.',
			'guard'          => 'Audit existing labor pages first. Calculator must be an estimate, not legal advice.',
			'next_action'    => 'Map existing labor URLs and define safe formula/disclaimer.',
		),
		array(
			'id'             => '3',
			'name'           => 'Claim your profile conversion campaign',
			'status'         => 'backlog',
			'wave'           => 'Supply growth',
			'issue'          => 'HAD-82',
			'public_title'   => 'האם זה הפרופיל שלך? קבלת גישה לעדכון פרופיל משפטי',
			'slug'           => '/claim-profile/',
			'target_keyword' => 'פרופיל עורך דין',
			'monetization'   => 'Free claim to paid Pro/Featured conversion.',
			'infrastructure' => 'justice_lawyer CPT, claimed_by_user_id, magic-link onboarding.',
			'guard'          => 'Verify identity before account ownership transfer.',
			'next_action'    => 'Add claim CTA and owner approval flow.',
		),
		array(
			'id'             => '4',
			'name'           => 'Hebrew legal Q&A moat',
			'status'         => 'backlog',
			'wave'           => 'SEO moat',
			'issue'          => 'HAD-85',
			'public_title'   => 'שאלות משפטיות ותשובות עורכי דין בישראל',
			'slug'           => '/ask/',
			'target_keyword' => 'שאלה לעורך דין',
			'monetization'   => 'Paid guaranteed answer, lead routing, lawyer subscription value.',
			'infrastructure' => 'New Q&A CPTs, lawyer dashboard, schema, moderation queue.',
			'guard'          => 'Moderation and lawyer attribution required before publication.',
			'next_action'    => 'Design CPTs and manual review workflow.',
		),
		array(
			'id'             => '5',
			'name'           => 'Multi-professional directory',
			'status'         => 'backlog',
			'wave'           => 'Supply growth',
			'issue'          => 'HAD-82',
			'public_title'   => 'אנשי מקצוע משפטיים: עורכי דין, מגשרים, מומחים ונוטריונים',
			'slug'           => '/legal-professionals/',
			'target_keyword' => 'אנשי מקצוע משפטיים',
			'monetization'   => 'Professional subscriptions and lead fees.',
			'infrastructure' => 'justice_lawyer plus supplier pipeline and professional type fields.',
			'guard'          => 'Publicly distinguish lawyer from non-lawyer professional.',
			'next_action'    => 'Add professional type model and registration copy.',
		),
		array(
			'id'             => '6',
			'name'           => 'Process server marketplace',
			'status'         => 'backlog',
			'wave'           => 'Supplier marketplace',
			'issue'          => 'HAD-82',
			'public_title'   => 'מסירת כתבי בית דין: איתור נותן שירות לפי אזור וזמינות',
			'slug'           => '/process-serving/',
			'target_keyword' => 'מסירת כתבי בית דין',
			'monetization'   => 'Order commission and process-server subscription.',
			'infrastructure' => 'Supplier marketplace, bid model, manual order tracking first.',
			'guard'          => 'Verify service area, proof-of-service process and pricing before public launch.',
			'next_action'    => 'Add supplier type and bid fields, then seed providers.',
		),
		array(
			'id'             => '7',
			'name'           => 'Real-estate due diligence report',
			'status'         => 'backlog',
			'wave'           => 'Wave 1 tools',
			'issue'          => 'HAD-86',
			'public_title'   => 'בדיקת נכס לפני קנייה: רשימת סיכונים וליווי עורך דין מקרקעין',
			'slug'           => '/property-check/',
			'target_keyword' => 'בדיקת דירה לפני קנייה',
			'monetization'   => 'Paid attorney verification and real-estate lead fee.',
			'infrastructure' => 'justice_legal_tool and real-estate lawyer routing.',
			'guard'          => 'Do not scrape protected services or imply official registry verification without source.',
			'next_action'    => 'Audit real-estate calculator pages before creating route.',
		),
		array(
			'id'             => '8',
			'name'           => 'HarvIL enterprise legal AI',
			'status'         => 'blocked',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'AI workspace for Israeli legal teams',
			'slug'           => '/enterprise-ai-legal-workspace/',
			'target_keyword' => 'AI לעורכי דין',
			'monetization'   => 'Enterprise seats and firm pilots.',
			'infrastructure' => 'New workspace CPT, usage logging, SSO, API client.',
			'guard'          => 'Blocked until paid AI/API spend, security, confidentiality and sales motion are approved.',
			'next_action'    => 'Write pilot spec only, no API implementation yet.',
		),
		array(
			'id'             => '9',
			'name'           => 'Pitzuy AI appeal/package drafting',
			'status'         => 'blocked',
			'wave'           => 'AI conversion',
			'issue'          => 'HAD-81',
			'public_title'   => 'הכנת תיק פיצוי לבדיקת עורך דין',
			'slug'           => '/pitzuy-ai/',
			'target_keyword' => 'מכתב דרישה פיצויים',
			'monetization'   => 'Paid intake, lawyer review, qualified lead fee.',
			'infrastructure' => 'justice_legal_tool, legal requests, future AI client.',
			'guard'          => 'No unattended legal drafting or paid API use without approval.',
			'next_action'    => 'Create no-API structured intake checklist first.',
		),
		array(
			'id'             => '10',
			'name'           => 'AI-native managed legal services',
			'status'         => 'blocked',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'שירות משפטי דיגיטלי בליווי עורך דין',
			'slug'           => '/digital-legal-services/',
			'target_keyword' => 'שירות משפטי אונליין',
			'monetization'   => 'Packaged services with lawyer fulfillment.',
			'infrastructure' => 'Legal request fulfillment mode and customer case portal.',
			'guard'          => 'Needs Israeli Bar ethics review and engagement-letter structure.',
			'next_action'    => 'Get legal/ethics opinion before public product copy.',
		),
		array(
			'id'             => '11',
			'name'           => 'Contract review for in-house counsel',
			'status'         => 'blocked',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'בדיקת חוזים בעברית ובאנגלית לצוותים משפטיים',
			'slug'           => '/contract-review-ai/',
			'target_keyword' => 'בדיקת חוזה AI',
			'monetization'   => 'Seat subscription.',
			'infrastructure' => 'Future REST contract-review endpoint and workspace billing.',
			'guard'          => 'Blocked until confidentiality, API spend and enterprise terms are approved.',
			'next_action'    => 'Define manual contract-review pilot with one lawyer first.',
		),
		array(
			'id'             => '12',
			'name'           => 'SMB compliance subscription',
			'status'         => 'backlog',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'חבילת ציות משפטי לעסקים קטנים',
			'slug'           => '/business-compliance/',
			'target_keyword' => 'ציות משפטי לעסק',
			'monetization'   => 'Monthly business subscription and legal requests.',
			'infrastructure' => 'Compliance obligation CPT, reminders, lawyer routing.',
			'guard'          => 'Avoid pretending Jus-Tice is the law firm unless engagement model is approved.',
			'next_action'    => 'Design obligation model and first five reminder types.',
		),
		array(
			'id'             => '13',
			'name'           => 'Hostile-act compensation hub',
			'status'         => 'next',
			'wave'           => 'Wave 1 urgent',
			'issue'          => 'HAD-80',
			'public_title'   => 'נפגעי פעולות איבה: זכויות, מסמכים והתאמה לעורך דין',
			'slug'           => '/hostile-act-compensation-guide/',
			'target_keyword' => 'נפגע פעולות איבה',
			'monetization'   => 'Qualified lead fee and specialist coverage plan.',
			'infrastructure' => 'Lead classifier, legal tool intake, lawyer routing.',
			'guard'          => 'Use verified official sources and sensitive tone. No compensation promises.',
			'next_action'    => 'Verify sources and recruit lawyers before traffic push.',
		),
		array(
			'id'             => '14',
			'name'           => 'Reservist rights hub',
			'status'         => 'next',
			'wave'           => 'Wave 1 urgent',
			'issue'          => 'HAD-80',
			'public_title'   => 'זכויות מילואים: פיטורים, תשלומים ופנייה לעורך דין',
			'slug'           => '/reservist-rights-guide/',
			'target_keyword' => 'זכויות מילואים',
			'monetization'   => 'Labor-law lead fee and demand-letter review.',
			'infrastructure' => 'Lead classifier, labor-law routing, legal tools.',
			'guard'          => 'Verify law effective dates before headline copy.',
			'next_action'    => 'Source-check Jan 2026 claim and create canonical brief.',
		),
		array(
			'id'             => '15',
			'name'           => 'Aliyah tax and cross-border consult',
			'status'         => 'next',
			'wave'           => 'Wave 1 urgent',
			'issue'          => 'HAD-80',
			'public_title'   => 'עולה חדש ותושב חוזר: מס, דיווחים וליווי מומחים',
			'slug'           => '/aliyah-tax-guide/',
			'target_keyword' => 'מס עולה חדש',
			'monetization'   => 'Bundled CPA/lawyer consult and supplier marketplace.',
			'infrastructure' => 'Supplier marketplace, bid model, legal request intake.',
			'guard'          => 'Needs verified tax-source review and qualified CPA/lawyer suppliers.',
			'next_action'    => 'Define supplier criteria and price bands.',
		),
		array(
			'id'             => '16',
			'name'           => 'HNW estate planning',
			'status'         => 'backlog',
			'wave'           => 'Advanced niche',
			'issue'          => 'HAD-83',
			'public_title'   => 'תכנון הון משפחתי, נאמנות וירושה לבעלי נכסים',
			'slug'           => '/wealth-and-estate-attorney/',
			'target_keyword' => 'עורך דין נאמנות',
			'monetization'   => 'Premium audit and boutique firm lead fee.',
			'infrastructure' => 'Supplier/lawyer qualification and high-value lead CRM.',
			'guard'          => 'No public tax planning claims without professional review.',
			'next_action'    => 'Identify 2-3 boutique partner firms.',
		),
		array(
			'id'             => '17',
			'name'           => 'Accessibility compliance and claims',
			'status'         => 'backlog',
			'wave'           => 'Advanced niche',
			'issue'          => 'HAD-83',
			'public_title'   => 'בדיקת נגישות אתר וסיכון משפטי לעסק',
			'slug'           => '/accessibility-legal-audit/',
			'target_keyword' => 'תביעת נגישות אתר',
			'monetization'   => 'Compliance vendor referral, legal opinion, plaintiff/defense leads.',
			'infrastructure' => 'Supplier marketplace and legal tool request.',
			'guard'          => 'Source-check statutory damages and avoid solicitation problems.',
			'next_action'    => 'Verify legal basis and vendor credentials.',
		),
		array(
			'id'             => '18',
			'name'           => 'Property purchase tax calculator',
			'status'         => 'blocked',
			'wave'           => 'Wave 1 urgent',
			'issue'          => 'HAD-80',
			'public_title'   => 'מחשבון מס רכישה: בדיקת עלות לפני עסקת דירה',
			'slug'           => 'audit first',
			'target_keyword' => 'מחשבון מס רכישה',
			'monetization'   => 'Real-estate lead fee and lawyer consult.',
			'infrastructure' => 'Existing real-estate/tax pages plus legal request capture.',
			'guard'          => 'Blocked until HAD-78 maps existing purchase-tax and tax-support URLs.',
			'next_action'    => 'Audit purchase-tax and land-appreciation URLs.',
		),
		array(
			'id'             => '19',
			'name'           => 'Arnona appeal checker',
			'status'         => 'backlog',
			'wave'           => 'Wave 1 urgent',
			'issue'          => 'HAD-80',
			'public_title'   => 'בדיקת חיוב ארנונה לעסק והפחתת סיווג',
			'slug'           => '/arnona-appeal-checker/',
			'target_keyword' => 'ערעור ארנונה לעסק',
			'monetization'   => 'Qualified business lead and success-fee partner model.',
			'infrastructure' => 'Legal tool request and municipal-law lawyer/supplier coverage.',
			'guard'          => 'Requires city-specific legal/source review.',
			'next_action'    => 'Define intake fields and partner criteria.',
		),
		array(
			'id'             => '20',
			'name'           => 'Crypto and VASP legal niche',
			'status'         => 'backlog',
			'wave'           => 'Advanced niche',
			'issue'          => 'HAD-83',
			'public_title'   => 'עורך דין קריפטו: מס, רגולציה וסכסוכי בורסות',
			'slug'           => '/crypto-attorney-israel/',
			'target_keyword' => 'עורך דין קריפטו',
			'monetization'   => 'Specialist lead fee and premium lawyer placement.',
			'infrastructure' => 'Lead classifier and lawyer prospect pipeline.',
			'guard'          => 'Needs fresh regulatory source review.',
			'next_action'    => 'Identify real specialist lawyers and source pages.',
		),
		array(
			'id'             => '21',
			'name'           => 'Conversational intake agent',
			'status'         => 'blocked',
			'wave'           => 'AI conversion',
			'issue'          => 'HAD-81',
			'public_title'   => 'אבחון משפטי קצר לפני התאמה לעורך דין',
			'slug'           => 'homepage/component',
			'target_keyword' => 'ייעוץ עורך דין אונליין',
			'monetization'   => 'Lead conversion lift across all streams.',
			'infrastructure' => 'Lead form, classifier, future AI endpoint.',
			'guard'          => 'Blocked for paid AI. Build no-API structured intake first.',
			'next_action'    => 'Replace static questions with rule-based guided intake.',
		),
		array(
			'id'             => '22',
			'name'           => 'Voice AI receptionist',
			'status'         => 'blocked',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'מענה טלפוני חכם למשרדי עורכי דין',
			'slug'           => '/lawyer-voice-receptionist/',
			'target_keyword' => 'מענה טלפוני לעורכי דין',
			'monetization'   => 'Monthly lawyer upsell.',
			'infrastructure' => 'Lawyer dashboard, telephony provider, summaries.',
			'guard'          => 'Blocked until provider/API spend and privacy terms are approved.',
			'next_action'    => 'Draft no-code pilot process for one lawyer.',
		),
		array(
			'id'             => '23',
			'name'           => 'WhatsApp first-touch bot',
			'status'         => 'blocked',
			'wave'           => 'AI conversion',
			'issue'          => 'HAD-81',
			'public_title'   => 'פנייה בוואטסאפ להתאמת עורך דין',
			'slug'           => 'component',
			'target_keyword' => 'עורך דין וואטסאפ',
			'monetization'   => 'Higher lead conversion and routing speed.',
			'infrastructure' => 'Lead intake and future WhatsApp Business webhook.',
			'guard'          => 'Blocked until WhatsApp provider and privacy approval.',
			'next_action'    => 'Create manual WhatsApp message templates first.',
		),
		array(
			'id'             => '24',
			'name'           => 'Article RAG and Q&A widget',
			'status'         => 'blocked',
			'wave'           => 'AI conversion',
			'issue'          => 'HAD-81',
			'public_title'   => 'שאלות ותשובות מתוך מדריכי Jus-Tice',
			'slug'           => 'component',
			'target_keyword' => 'שאלה משפטית',
			'monetization'   => 'Conversion lift and internal-link depth.',
			'infrastructure' => 'Article index, embeddings or search, lead CTA.',
			'guard'          => 'No paid embedding/API pipeline without approval.',
			'next_action'    => 'Prototype no-API related-answer widget using existing articles.',
		),
		array(
			'id'             => '25',
			'name'           => 'Court-ruling SEO library',
			'status'         => 'backlog',
			'wave'           => 'SEO moat',
			'issue'          => 'HAD-85',
			'public_title'   => 'פסקי דין מוסברים לפי תחום משפטי',
			'slug'           => '/verdicts/',
			'target_keyword' => 'פסקי דין',
			'monetization'   => 'Organic lead capture and lawyer profile authority.',
			'infrastructure' => 'Official-source import, drafts, review gate, internal links.',
			'guard'          => 'Manual review before publication. Do not mass-publish AI summaries.',
			'next_action'    => 'Connect to HAD-70 official-source pilot.',
		),
		array(
			'id'             => '26',
			'name'           => 'Deepfake and AI defamation niche',
			'status'         => 'backlog',
			'wave'           => 'Advanced niche',
			'issue'          => 'HAD-83',
			'public_title'   => 'פגיעה בשם טוב, דיפפייק ותוכן AI פוגעני',
			'slug'           => '/deepfake-defamation-attorney/',
			'target_keyword' => 'עורך דין דיפפייק',
			'monetization'   => 'Cyber/defamation specialist leads.',
			'infrastructure' => 'Lead classifier and specialist lawyer prospects.',
			'guard'          => 'Needs fresh legal/source review and sensitive evidence handling.',
			'next_action'    => 'Source-check and identify cyber/defamation lawyers.',
		),
		array(
			'id'             => '27',
			'name'           => 'Demand-letter marketplace',
			'status'         => 'blocked',
			'wave'           => 'AI conversion',
			'issue'          => 'HAD-81',
			'public_title'   => 'מכתב דרישה לפני תביעה עם בדיקת עורך דין',
			'slug'           => '/demand-letter/',
			'target_keyword' => 'מכתב התראה לפני תביעה',
			'monetization'   => 'Paid draft download and lawyer review.',
			'infrastructure' => 'justice_legal_tool and legal requests.',
			'guard'          => 'No automatic legal drafting without legal review and API approval.',
			'next_action'    => 'Build manual structured request product first.',
		),
		array(
			'id'             => '28',
			'name'           => 'EOR and immigration one-stop Israel',
			'status'         => 'backlog',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'העסקה, הגירה ומיסוי לעבודה מול ישראל',
			'slug'           => '/israel-eor-immigration/',
			'target_keyword' => 'העסקה בישראל עובד זר',
			'monetization'   => 'Supplier referral, consult package and monthly support.',
			'infrastructure' => 'Supplier marketplace with jurisdictions and bid model.',
			'guard'          => 'Must distinguish EOR, immigration consultant, CPA and lawyer roles.',
			'next_action'    => 'Add supplier categories and qualify first partners.',
		),
		array(
			'id'             => '29',
			'name'           => 'English diaspora subsite',
			'status'         => 'backlog',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'Israeli lawyers for Israelis abroad',
			'slug'           => 'en.jus-tice.co.il',
			'target_keyword' => 'Israeli lawyer abroad',
			'monetization'   => 'Premium lawyer placement and diaspora leads.',
			'infrastructure' => 'Multisite or subsite, translated funnels, supplier coverage.',
			'guard'          => 'Do not translate at scale before canonical/SEO plan.',
			'next_action'    => 'Select top 10 English diaspora use cases.',
		),
		array(
			'id'             => '30',
			'name'           => 'Lawyer marketing as a service',
			'status'         => 'backlog',
			'wave'           => 'Premium platform',
			'issue'          => 'HAD-84',
			'public_title'   => 'ניהול שיווק דיגיטלי למשרדי עורכי דין',
			'slug'           => '/lawyer-marketing-services/',
			'target_keyword' => 'שיווק לעורכי דין',
			'monetization'   => 'Monthly managed-service upsell.',
			'infrastructure' => 'Lawyer plans, supplier marketplace, reporting.',
			'guard'          => 'No ranking or lead-volume promises.',
			'next_action'    => 'Package as owner/manual service first.',
		),
		array(
			'id'             => '31',
			'name'           => 'Class action lead aggregator',
			'status'         => 'backlog',
			'wave'           => 'Advanced niche',
			'issue'          => 'HAD-83',
			'public_title'   => 'בדיקת זכאות לתביעה ייצוגית',
			'slug'           => '/class-actions/',
			'target_keyword' => 'תביעה ייצוגית',
			'monetization'   => 'Qualified plaintiff lead fee.',
			'infrastructure' => 'New class action CPT, eligibility forms, lawyer routing.',
			'guard'          => 'Avoid solicitation problems and verify case status before public landing.',
			'next_action'    => 'Design class-action CPT and compliance review.',
		),
		array(
			'id'             => '32',
			'name'           => 'Insurance denial dispute pipeline',
			'status'         => 'backlog',
			'wave'           => 'Advanced niche',
			'issue'          => 'HAD-83',
			'public_title'   => 'דחיית תביעת ביטוח: בדיקת מכתב סירוב והתאמת עורך דין',
			'slug'           => '/insurance-denial-helper/',
			'target_keyword' => 'דחיית תביעת ביטוח',
			'monetization'   => 'Qualified insurance-dispute lead fee.',
			'infrastructure' => 'Legal tool request and personal-injury/insurance lawyer routing.',
			'guard'          => 'Sensitive document upload and privacy flow needed.',
			'next_action'    => 'Define denial-letter intake without file upload first.',
		),
	);
}

function justice_theme_revenue_streams_status_labels(): array {
	return array(
		'started' => array( 'label' => 'Started', 'style' => 'background:#e0f2fe;color:#075985;' ),
		'live'    => array( 'label' => 'Live', 'style' => 'background:#dcfce7;color:#166534;' ),
		'next'    => array( 'label' => 'Next', 'style' => 'background:#fef9c3;color:#854d0e;' ),
		'backlog' => array( 'label' => 'Backlog', 'style' => 'background:#f1f5f9;color:#334155;' ),
		'blocked' => array( 'label' => 'Blocked', 'style' => 'background:#fee2e2;color:#991b1b;' ),
	);
}

function justice_theme_revenue_streams_summary( array $streams ): array {
	$summary = array();

	foreach ( $streams as $stream ) {
		$status = (string) ( $stream['status'] ?? 'backlog' );
		$summary[ $status ] = ( $summary[ $status ] ?? 0 ) + 1;
	}

	return $summary;
}

function justice_theme_render_revenue_streams_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	$streams       = justice_theme_revenue_streams_backlog();
	$status_labels = justice_theme_revenue_streams_status_labels();
	$summary       = justice_theme_revenue_streams_summary( $streams );
	$report_path   = 'project-control/revenue-streams-backlog-2026-05-25.md';
	?>
	<div class="wrap justice-revenue-streams-wrap">
		<h1>Jus-Tice Revenue Streams Map</h1>
		<p>Owner-only execution map for revenue streams, SEO surfaces, blockers and anti-cannibalization rules. This page is internal and should not be exposed publicly.</p>

		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:18px 0;">
			<?php foreach ( $status_labels as $status => $meta ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
					<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) ( $summary[ $status ] ?? 0 ) ); ?></strong>
					<span><?php echo esc_html( $meta['label'] ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="notice notice-warning inline">
			<p><strong>Execution rule:</strong> finish started work first, especially the Bituach Leumi funnel, before opening large speculative builds. Paid AI/API work stays blocked until explicit owner approval.</p>
		</div>

		<p>
			<a class="button button-primary" href="<?php echo esc_url( justice_theme_revenue_streams_linear_url( 'HAD-75' ) ); ?>" target="_blank" rel="noopener">Open parent Linear backlog</a>
			<a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=justice-crm' ) ); ?>">Open Justice CRM</a>
			<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=justice_supplier' ) ); ?>">Open supplier pipeline</a>
			<span style="display:inline-block;margin-inline-start:8px;color:#646970;">Repo report: <code><?php echo esc_html( $report_path ); ?></code></span>
		</p>

		<input type="search" id="justiceRevenueSearch" placeholder="Search stream, keyword, issue, blocker..." style="width:100%;max-width:520px;padding:8px 10px;margin:12px 0;">

		<table class="widefat striped" id="justiceRevenueTable">
			<thead>
				<tr>
					<th>Play</th>
					<th>Status</th>
					<th>Wave</th>
					<th>SEO surface</th>
					<th>Monetization</th>
					<th>Infrastructure</th>
					<th>Guard / blocker</th>
					<th>Next action</th>
					<th>Linear</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $streams as $stream ) : ?>
					<?php
					$status = (string) ( $stream['status'] ?? 'backlog' );
					$status_meta = $status_labels[ $status ] ?? $status_labels['backlog'];
					$issue = (string) ( $stream['issue'] ?? '' );
					?>
					<tr>
						<td><strong><?php echo esc_html( '#' . $stream['id'] . ' ' . $stream['name'] ); ?></strong></td>
						<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $status_meta['style'] ); ?>"><?php echo esc_html( $status_meta['label'] ); ?></span></td>
						<td><?php echo esc_html( $stream['wave'] ); ?></td>
						<td>
							<strong><?php echo esc_html( $stream['public_title'] ); ?></strong>
							<br><code><?php echo esc_html( $stream['slug'] ); ?></code>
							<br><small><?php echo esc_html( $stream['target_keyword'] ); ?></small>
						</td>
						<td><?php echo esc_html( $stream['monetization'] ); ?></td>
						<td><?php echo esc_html( $stream['infrastructure'] ); ?></td>
						<td><?php echo esc_html( $stream['guard'] ); ?></td>
						<td><?php echo esc_html( $stream['next_action'] ); ?></td>
						<td>
							<?php if ( $issue && justice_theme_revenue_streams_linear_url( $issue ) ) : ?>
								<a href="<?php echo esc_url( justice_theme_revenue_streams_linear_url( $issue ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $issue ); ?></a>
							<?php else : ?>
								<?php echo esc_html( $issue ?: '-' ); ?>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>

		<script>
			(function () {
				var input = document.getElementById('justiceRevenueSearch');
				var rows = document.querySelectorAll('#justiceRevenueTable tbody tr');
				if (!input || !rows.length) {
					return;
				}

				input.addEventListener('input', function () {
					var query = input.value.toLowerCase();
					rows.forEach(function (row) {
						row.style.display = row.textContent.toLowerCase().indexOf(query) > -1 ? '' : 'none';
					});
				});
			}());
		</script>
	</div>
	<?php
}
