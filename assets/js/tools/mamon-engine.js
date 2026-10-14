/**
 * The prenup generator (הסכם ממון), family wave (HAD-506). Dependency-free ES module; deterministic text assembly from a
 * questionnaire, no AI and nothing sent anywhere.
 *
 * The law, from registry.prenup (חוק יחסי ממון בין בני זוג, התשל"ג-1973, Nevo current version 22.8.2024):
 *  - s.1: the agreement and every change to it in writing.
 *  - s.2(א)-(ב): approval by the family court or the competent religious court, after it is satisfied the couple agreed
 *    freely and understand the meaning and consequences; s.2(ג): before or at the wedding the marriage registrar may
 *    verify instead; s.2(ג1): before the wedding a notary may verify. After the wedding only a court (the Chief
 *    Rabbinate's marriage-registration procedure s.89(ו): a registrar never verifies a prenup made after it).
 *  - s.3(א): where the agreement says nothing, the balancing regime of the law applies.
 *  - s.5(א)(3): assets the spouses agree in writing not to balance are excluded; s.5(ב): heirs take a spouse's place.
 *  - Children: an agreement on a child's support does not bind the child until a court approves it (Maintenance Law
 *    s.12(א)), and even then the child may sue when the court did not examine his interest (919/15, para. 83). The
 *    draft therefore never sets child support, custody or parenting time.
 *  - Cohabitants: the 1973 law applies to married couples only (5620/24, para. 20); their agreement is a contract, and
 *    the family court has jurisdiction over them (Family Court Law s.1(2)).
 * Fees: the notary's item 11(א)-(ב) plus VAT, the family court's item 6א, the rabbinical court's item 4(2).
 */
import { fEntered, fR2 } from './family-common.js';

export const MM_TIMINGS = ['before', 'during', 'cohab'];
export const MM_ROUTES = ['notary', 'registrar', 'court', 'rabbinical'];
export const MM_REGIMES = ['separate', 'law_except', 'graded'];

const mmBlank = '____________';
const mmMoney = (n) => `${Math.round(Number(n) || 0).toLocaleString('en-US')} ש"ח`;

/** The approval routes open at a given timing, from the registry. */
export function mmRoutesFor(pn, timing) {
	return MM_ROUTES.filter((k) => pn.routes[k].when.includes(timing === 'before' ? 'before' : timing));
}

/** The cost of the chosen route: the official fee, VAT where it applies, extra copies at the notary. */
export function mmCost(pn, route, copies) {
	const r = pn.routes[route];
	if (!r || r.fee === null || r.fee === undefined) { return { known: false, he: r ? r.fee_he : '' }; }
	const extra = route === 'notary' ? Math.max(0, (Number(copies) || 1) - 1) * r.fee_copy : 0;
	const net = r.fee + extra;
	const vat = r.vat ? fR2(net * pn.vat.pct / 100) : 0;
	return { known: true, fee: r.fee, extra, net, vat, total: fR2(net + vat), item: r.fee_item, copyItem: r.fee_copy_item || '', law: r.fee_he, url: r.fee_url, vatPct: pn.vat.pct };
}

function mmAssetsRows(list) {
	return (list || []).filter((x) => x && (fEntered(x.label) || fEntered(x.value))).map((x) => ({ label: String(x.label || '').trim() || 'נכס', value: fEntered(x.value) ? Number(x.value) : null }));
}

/**
 * input = {
 *   timing, route, regime, names: { a, b } (optional, only for the document), wedding (ISO, optional),
 *   home: 'none' | 'a' | 'b' | 'joint_new', homeAddress (optional), gradePct (graded), gradeCap, residenceMonths,
 *   pension: 'own' | 'law', business: 'none' | 'a' | 'b', businessGrowth: 'separate' | 'shared',
 *   fruits (bool: income and growth of separate assets stay separate), jointAccount (bool), household: 'equal' | 'income',
 *   second (bool: children from an earlier relationship), assetsA: [{label, value}], assetsB: [...], copies (notary)
 * }
 */
export function draftMamon(registry, input) {
	const pn = registry.prenup;
	const errors = [];
	const timing = MM_TIMINGS.includes(input.timing) ? input.timing : 'before';
	const regime = MM_REGIMES.includes(input.regime) ? input.regime : 'separate';
	const allowed = mmRoutesFor(pn, timing);
	const route = MM_ROUTES.includes(input.route) ? input.route : allowed[0];
	if (!allowed.includes(route)) {
		errors.push({ field: 'route', he: timing === 'during' ? pn.during_he : `${pn.routes[route].he} לא מאשר הסכם ממון ${timing === 'cohab' ? 'בין ידועים בציבור' : 'בשלב הזה'}` });
	}
	const gradePct = fEntered(input.gradePct) ? Number(input.gradePct) : 5;
	const gradeCap = fEntered(input.gradeCap) ? Number(input.gradeCap) : 50;
	const residence = fEntered(input.residenceMonths) ? Number(input.residenceMonths) : 6;
	if (regime === 'graded' && ['a', 'b'].includes(input.home)) {
		if (!(gradePct > 0 && gradePct <= 50)) { errors.push({ field: 'gradePct', he: 'אחוז לכל שנה: בין 1 ל-50' }); }
		if (!(gradeCap > 0 && gradeCap <= 50)) { errors.push({ field: 'gradeCap', he: 'התקרה: עד 50%' }); }
	}
	if (!(Number.isInteger(residence) && residence >= 0 && residence <= 36)) { errors.push({ field: 'residenceMonths', he: 'חודשי מגורים אחרי פרידה: 0 עד 36' }); }
	for (const [k, list] of [['assetsA', input.assetsA], ['assetsB', input.assetsB]]) {
		(list || []).forEach((x, i) => { if (x && fEntered(x.value) && !(Number(x.value) >= 0 && Number(x.value) < 1e11)) { errors.push({ field: `${k}-${i}`, he: 'שווי: מספר חיובי' }); } });
	}
	if (errors.length) { return { ok: false, errors }; }

	const A = (input.names && String(input.names.a || '').trim()) || mmBlank;
	const B = (input.names && String(input.names.b || '').trim()) || mmBlank;
	const married = timing === 'during';
	const cohab = timing === 'cohab';
	const marriageWord = cohab ? 'תחילת החיים המשותפים' : 'הנישואין';
	const periodWord = cohab ? 'תקופת החיים המשותפים' : 'תקופת הנישואין';
	const homeOwner = input.home === 'a' ? "צד א'" : input.home === 'b' ? "צד ב'" : '';
	const homeOther = input.home === 'a' ? "צד ב'" : "צד א'";
	const addr = String(input.homeAddress || '').trim() || mmBlank;
	const assetsA = mmAssetsRows(input.assetsA);
	const assetsB = mmAssetsRows(input.assetsB);

	const clauses = [];
	const add = (title, items) => { clauses.push({ n: clauses.length + 1, title, items: items.filter(Boolean) }); };
	add('המבוא והנספחים', ['המבוא להסכם זה ונספחיו הם חלק בלתי נפרד ממנו.', 'בהסכם זה "החוק" הוא חוק יחסי ממון בין בני זוג, התשל"ג-1973.']);
	// The property regime.
	if (regime === 'separate') {
		add('הפרדה רכושית', [
			`כל נכס, זכות וחיסכון הרשומים על שם צד או המוחזקים בידיו, בין שהיו לו לפני ${marriageWord} ובין שיצבור אותם אחריהם, הם שלו בלבד${input.fruits !== false ? ', וכך גם הפירות, ההכנסות ועליית הערך שלהם' : ''}.`,
			cohab ? 'הצדדים מסכימים שלא תחול ביניהם חזקת שיתוף בנכסים, ושלא יתקיים ביניהם איזון של שווי נכסים, אלא בנכסים הרשומים על שם שניהם.'
				: `הצדדים מסכימים שהסדר איזון המשאבים שבפרק השני לחוק לא יחול עליהם, ושלא יתקיים ביניהם איזון של שווי נכסים, אלא בנכסים הרשומים על שם שניהם (סעיפים 3(א) ו-5(א)(3) לחוק).`,
			'נכס הרשום על שם שני הצדדים הוא שלהם בחלקים שווים, אלא אם נקבע אחרת ברישום או בהסכם בכתב.',
		]);
	} else if (regime === 'law_except') {
		add('איזון משאבים עם חריגים', [
			cohab ? `בנכסים שיצברו בתקופת החיים המשותפים יחולו כללי השיתוף לפי הדין, למעט הנכסים המפורטים בהסכם זה ובנספחים א' ו-ב', שהם של הצד שלהם בלבד.`
				: `על הצדדים יחול הסדר איזון המשאבים שבפרק השני לחוק, למעט הנכסים המפורטים בהסכם זה ובנספחים א' ו-ב', ששוויים לא יאוזן ביניהם (סעיף 5(א)(3) לחוק).`,
			input.fruits !== false
				? `גם הפירות, ההכנסות ועליית הערך של הנכסים שבנספחים, כולל עליית ערך שתיווצר במאמץ ב${periodWord}, יישארו של הצד שלהם.`
				: `הפירות ועליית הערך הפסיבית של הנכסים שבנספחים יישארו של הצד שלהם; עליית ערך שתיווצר במאמץ ב${periodWord} תאוזן לפי הדין.`,
		]);
	} else {
		add('הסכם מדורג', [
			`הנכסים המפורטים בנספחים א' ו-ב' הם של הצד שלהם בלבד ואינם ברי איזון${homeOwner ? ', למעט הדירה, שהזכויות בה מוקנות בהדרגה כאמור בסעיף הדירה להלן' : ''}.`,
			cohab ? 'נכסים שיצברו בתקופת החיים המשותפים יחולקו לפי הדין.' : 'נכסים שיצברו בתקופת הנישואין יאוזנו לפי פרק ב\' לחוק.',
		]);
	}
	// The home.
	if (homeOwner) {
		const items = [`הדירה ב-${addr} (להלן: "הדירה") היא של ${homeOwner} בלבד, וכך גם השיפוצים, ההשבחה ועליית הערך שלה, גם אם הצדדים יגורו בה יחד וגם אם ${homeOther} ישתתף בהוצאות השוטפות או בתשלומי המשכנתא. השתתפות כזו לא תיצור שיתוף בדירה.`];
		if (regime === 'graded') {
			items.push(`בתום כל שנה מלאה של ${cohab ? 'חיים משותפים' : 'נישואין'} יהיה ${homeOther} זכאי ל-${gradePct}% מהזכויות בדירה, עד ${gradeCap}% לכל היותר. הזכויות יחושבו לפי מספר השנים המלאות עד מועד הפרידה, ויירשמו או ישולמו לפי שוויין באותו מועד.`);
			items.push('לבקשת צד, ירשמו הצדדים הערה מתאימה בלשכת רישום המקרקעין לגבי ההתחייבות שבסעיף זה.');
		}
		if (residence > 0) { items.push(`אם הצדדים ייפרדו, ${homeOther} יוכל להמשיך לגור בדירה עד ${residence} חודשים מיום שהודיע אחד הצדדים בכתב על הפרידה, ובלבד שיישא בהוצאות השוטפות של התקופה.`); }
		add('דירת המגורים', items);
	} else if (input.home === 'joint_new') {
		add('דירת המגורים', [
			`דירה שתירכש ב${periodWord} תירשם על שם שני הצדדים בחלקים שווים, וכל צד יישא במחצית המשכנתא וההוצאות.`,
			'צד שהשקיע בדירה הון עצמי מנכס שהוא שלו בלבד לפי הסכם זה, יקבל בחזרה את הסכום שהשקיע, צמוד למדד המחירים לצרכן, לפני חלוקת שווי הדירה ביניהם.',
		]);
	}
	// Pensions.
	add('פנסיה וזכויות סוציאליות', [
		input.pension === 'law'
			? `זכויות לפנסיה, פיצויי פרישה, קרנות השתלמות, קופות גמל וחסכונות שייצברו ב${periodWord} יאוזנו ביניהם${cohab ? ' לפי הדין' : ' לפי החוק (סעיף 5(ג))'}, ויחולקו לפי חוק לחלוקת חיסכון פנסיוני בין בני זוג שנפרדו, התשע"ד-2014. מה שנצבר לפני ${marriageWord} יישאר של הצד שצבר אותו.`
			: `כל צד יהיה זכאי לבדו לזכויות לפנסיה, לפיצויי פרישה, לקרנות השתלמות, לקופות גמל ולחסכונות שעל שמו, כולל מה שייצבר ב${periodWord}, ולא יתקיים ביניהם איזון של זכויות אלה.`,
	]);
	// A business.
	if (['a', 'b'].includes(input.business)) {
		const owner = input.business === 'a' ? "צד א'" : "צד ב'";
		const other = input.business === 'a' ? "צד ב'" : "צד א'";
		add('העסק', [
			`העסק או המניות של ${owner} ב-${mmBlank} (להלן: "העסק") הם של ${owner} בלבד, כולל המוניטין, הרווחים והזכויות בו.`,
			input.businessGrowth === 'shared'
				? `עליית הערך של העסק ב${periodWord} תאוזן בין הצדדים לפי שוויו במועד הפרידה בניכוי שוויו ערב ${marriageWord}, כפי שיקבע שמאי או רואה חשבון שימונה בהסכמה.`
				: `גם עליית הערך של העסק ב${periodWord} היא של ${owner} בלבד, ו${other} לא יטען לזכות בעסק מכוח עבודה, תמיכה או השקעה של זמן.`,
		]);
	}
	// Inheritance and gifts.
	add('ירושות ומתנות', [
		`ירושה או מתנה שצד קיבל או יקבל, לפני ${marriageWord} או אחריהם, וכן נכסים שיירכשו מכספן ופירותיהן, הם שלו בלבד, גם אם ישמשו את המשפחה, אלא אם הצד הסכים אחרת בכתב.`,
	]);
	if (input.jointAccount) {
		add('חשבון משותף והוצאות משק הבית', [
			`הצדדים ינהלו חשבון בנק משותף להוצאות משק הבית, וכל צד יפקיד בו ${input.household === 'income' ? 'לפי חלקו בהכנסות של שניהם' : 'סכום שווה'} מדי חודש.`,
			'היתרה בחשבון המשותף היא של שני הצדדים בחלקים שווים. כספים שבחשבון אישי של צד הם שלו.',
		]);
	}
	add('חובות', ['כל צד יישא לבדו בחובות שיצר, וישפה את הצד השני אם יחויב בהם. חוב שהצדדים נטלו יחד ייפרע בחלקים שווים, אלא אם הוסכם אחרת בכתב.']);
	add(cohab ? 'פרידה או פטירה' : 'פקיעת הנישואין במות צד', [
		cohab ? 'הסכם זה יחול גם אם הקשר יסתיים במות אחד הצדדים.' : 'הסכם זה יחול גם אם הנישואין יפקעו במות אחד הצדדים, ויורשיו יבואו במקומו לעניין ההסכם (סעיף 5(ב) לחוק).',
		'הסכם זה אינו צוואה. צד שרוצה להבטיח לבן זוגו זכות מגורים, נכס או חלק בעיזבון, יעשה זאת בצוואה.',
		input.second ? 'ידוע לצדדים שלכל אחד מהם ילדים מקשר קודם, וההסכם נועד גם לשמור את נכסי כל צד לטובת ילדיו. כל צד יערוך צוואה שתתאים להסכם.' : '',
	]);
	add('הילדים', ['אין בהסכם זה דבר שקובע או מגביל את מזונות ילדי הצדדים, את משמורתם או את הסדרי השהות עמם. אלה ייקבעו לפי טובת הילדים ולפי הדין (סעיף 12(א) לחוק לתיקון דיני המשפחה (מזונות), התשי"ט-1959).']);
	const condition = {
		notary: 'אימותו בידי נוטריון לפני הנישואין (סעיף 2(ג1) לחוק)',
		registrar: 'אימותו בידי רושם הנישואין לפני הנישואין או בשעת עריכתם (סעיף 2(ג) לחוק)',
		court: cohab ? 'אישורו בבית המשפט לענייני משפחה' : 'אישורו בבית המשפט לענייני משפחה (סעיף 2(א) לחוק)',
		rabbinical: 'אישורו בבית הדין הרבני (סעיף 2(א) לחוק)',
	}[route];
	add('תוקף ושינויים', [
		`תוקפו של הסכם זה מותנה ב${condition}.`,
		cohab ? 'כל שינוי בהסכם זה ייעשה בכתב ובחתימת שני הצדדים.' : 'כל שינוי בהסכם זה ייעשה בכתב, ויאושר כדין כמו ההסכם עצמו (סעיפים 1 ו-2(א) לחוק).',
		"כל צד מצהיר שהנספח שלו מפרט בתום לב את נכסיו, זכויותיו וחובותיו העיקריים ביום החתימה.",
		'הסכם זה ממצה את ההסכמות בין הצדדים בעניין יחסי הממון ביניהם, ועל יחסי הממון שלהם יחול הדין הישראלי.',
	]);
	const recitals = [
		cohab ? 'הואיל והצדדים חיים יחד כבני זוג ומנהלים משק בית משותף, ואינם נשואים זה לזה;'
			: married ? `הואיל והצדדים נשואים זה לזה מיום ${mmBlank};` : `הואיל והצדדים מתכוונים להינשא זה לזה${input.wedding ? ` ביום ${input.wedding.split('-').reverse().map(Number).join('.')}` : ''};`,
		cohab ? 'והואיל והצדדים רוצים להסדיר את יחסי הממון ביניהם בהסכם, במקום חזקת השיתוף שהפסיקה מחילה על ידועים בציבור;'
			: 'והואיל והצדדים רוצים להסדיר את יחסי הממון ביניהם בהסכם ממון לפי החוק, במקום הסדר איזון המשאבים שבו ובמידה שהסכם זה קובע;',
		"והואיל וכל צד גילה לצד השני את נכסיו, זכויותיו וחובותיו, כמפורט בנספחים א' ו-ב';",
		'והואיל וכל צד קיבל, או הוצע לו לקבל, ייעוץ משפטי עצמאי, והוא חותם על ההסכם בהסכמה חופשית ובהבינו את משמעותו ואת תוצאותיו;',
	];
	const title = cohab ? 'הסכם ממון בין ידועים בציבור' : 'הסכם ממון';
	const lines = [title, `שנערך ונחתם ב-${mmBlank} ביום ${mmBlank}`, '',
		`בין: ${A}, ת"ז ${mmBlank}, מרחוב ${mmBlank} (להלן: "צד א'")`, `לבין: ${B}, ת"ז ${mmBlank}, מרחוב ${mmBlank} (להלן: "צד ב'")`, '',
		...recitals, '', 'לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:', ''];
	for (const c of clauses) {
		lines.push(`${c.n}. ${c.title}`);
		c.items.forEach((t, i) => lines.push(c.items.length > 1 ? `${c.n}.${i + 1} ${t}` : `${c.n}.1 ${t}`));
		lines.push('');
	}
	lines.push('ולראיה באו הצדדים על החתום:', '', `____________________          ____________________`, `צד א'                                  צד ב'`, '');
	const annex = (name, rows) => [name, ...(rows.length ? rows.map((r, i) => `${i + 1}. ${r.label}${r.value !== null ? `: ${mmMoney(r.value)}` : ''}`) : ['1. ' + mmBlank]), ''];
	lines.push(...annex("נספח א': נכסיו, זכויותיו וחובותיו של צד א' ביום החתימה", assetsA));
	lines.push(...annex("נספח ב': נכסיו, זכויותיו וחובותיו של צד ב' ביום החתימה", assetsB));
	const cost = mmCost(pn, route, input.copies);
	const flags = [];
	if (cohab) { flags.push({ code: 'cohab', he: pn.cohab_he }); }
	if (married) { flags.push({ code: 'during', he: pn.during_he }); }
	flags.push({ code: 'children', he: pn.children_he });
	if (route === 'registrar') { flags.push({ code: 'registrar_fee', he: pn.routes.registrar.fee_he }); }
	flags.push({ code: 'unapproved', he: pn.unapproved_he });
	const checklist = [
		'תעודות זהות של שניכם (ודרכון, אם אחד מכם תושב חוץ)',
		'נסח טאבו או חוזה של כל דירה, ואישור יתרת משכנתא',
		'דוחות שנתיים של הפנסיה, קרן ההשתלמות וקופות הגמל, ואישורי יתרה מהבנק ומתיק ההשקעות',
		'מסמכי העסק או החברה (תעודת התאגדות, מאזן אחרון), אם יש',
		'הנספחים מלאים וחתומים: הסתרת נכס היא הסיבה הנפוצה לטענה שההסכם לא תקף',
		route === 'notary' ? 'פגישה אצל הנוטריון לפני החתונה; שניכם נוכחים, וקוראים את ההסכם בשפה שאתם מבינים (תרגום בידי הנוטריון בתוספת שכר)' : '',
		route === 'registrar' ? 'תיאום מראש עם רושם הנישואין בתיק הנישואין שלכם' : '',
		route === 'court' ? 'בקשה לאישור הסכם וטופס 3 (הרצאת פרטים), ואגרה לפי פרט 6א' : '',
		route === 'rabbinical' ? 'בקשה לבית הדין הרבני האזורי, ושניכם בדיון' : '',
		'מספר עותקים חתומים: אחד לכל אחד, ועותק לגוף המאשר',
	].filter(Boolean);
	const lawyer = [
		'סעיף הדירה: האם הבנק המממן צריך להסכים, ואם כדאי לרשום הערה בטאבו',
		regime === 'graded' ? 'ההסכם המדורג: איך מחשבים את השווי במועד הפרידה ומה קורה למשכנתא' : '',
		['a', 'b'].includes(input.business) ? 'העסק: איך יוערך, ומה דין משכורת ורווחים שנמשכו ממנו' : '',
		'פער גדול בהכנסות או ויתור על קריירה: בית המשפט רשאי לסטות מהסכם רק במקרים חריגים, ולכן כדאי לחשוב על זה עכשיו',
		'מזונות אישה: ההסכם הזה לא עוסק בהם. ויתור או התחייבות בעניין הזה דורשים ייעוץ',
		'מיסוי: העברת זכויות בדירה בין בני זוג, והשלכות של רישום מאוחר',
		'נכסים או מגורים בחו"ל: איזה דין יחול (סעיף 15 לחוק)',
		input.second ? 'צוואות שמתאימות להסכם, וזכות מגורים לבן הזוג אחרי פטירה' : 'צוואות שמתאימות להסכם',
	].filter(Boolean);
	return {
		ok: true, timing, regime, route, routeAllowed: allowed, title, clauses, recitals, assetsA, assetsB, cost, flags, checklist, lawyer,
		steps: pn.routes[route].steps_he, text: lines.join('\n'),
	};
}
