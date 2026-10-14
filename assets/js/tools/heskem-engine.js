/**
 * The divorce agreement and parenting plan generator (הסכם גירושין ותוכנית הורות), family wave (HAD-506).
 * Dependency-free ES module. It reuses the family engines, so the numbers in the draft are the tools' numbers:
 * the child-support clause comes from computeSupport (mezonot-engine.js) with the nights of the plan, and the property
 * clause from computeBalance (izun-engine.js); the schedule and the holidays from horut-engine.js.
 *
 * The law, from registry.divorce_agreement and registry.prenup:
 *  - Capacity and Guardianship Law s.24: an agreement between separated parents on guardianship, custody and contact
 *    needs the court's approval, given only if it is for the child's good; s.25: without one, the court decides by the
 *    child's good, and children up to 6 stay with their mother absent special reasons.
 *  - Maintenance Law s.12(א) and 919/15 paras. 83, 140: the child is not bound by the parents' agreement on support or on
 *    physical custody when the court did not examine his good; the draft says so.
 *  - Spouses Property Relations Law s.2(ד): an agreement approved in the rabbinical court's divorce judgment counts as an
 *    approved property agreement; the family court approves under s.2(א) (gov.il service page, fee item 6א; rabbinical
 *    court item 4(2)). No dispute-settlement request is needed first (Family Disputes Settlement Law s.2).
 *  - Pensions are split through the fund by the Pension Split Law 2014.
 * No law sets a schedule; the patterns are labelled templates.
 */
import { fEntered, fR10 } from './family-common.js';
import { computeSupport } from './mezonot-engine.js';
import { computeBalance } from './izun-engine.js';
import { hrPlan, HR_PATTERNS, HR_DAYS } from './horut-engine.js';

const hkBlank = '____________';
const hkMoney = (n) => `${Math.round(Number(n) || 0).toLocaleString('en-US')} ש"ח`;
const hkDate = (iso) => (iso ? iso.split('-').reverse().map(Number).join('.') : hkBlank);
const hkWho = (x, pa, pb) => (x === 'A' ? pa : pb);

/**
 * input = {
 *   route: 'family' | 'rabbinical', from (ISO: the plan starts; default registry checked_on),
 *   children: [ISO birth dates], custody: 'joint' | 'mother' | 'father', parentA: 'אבא' | 'אמא' (who is parent A),
 *   pattern (horut pattern key or 'custom'), custom: [nights], holidays: 'alternate' | 'split', firstA,
 *   support: { incomeA, incomeB, housingA, housingB, amount (optional override, monthly total), payDay, every }, law,
 *   property: { home: 'sell' | 'a_keeps' | 'b_keeps' | 'none', homeValue, mortgage, aAssets, bAssets, aDebts, bDebts,
 *               payDays, pension: bool },
 *   names: { a, b } (document only)
 * }
 */
export function draftAgreement(registry, input) {
	const da = registry.divorce_agreement;
	const errors = [];
	const route = input.route === 'rabbinical' ? 'rabbinical' : 'family';
	const from = input.from || da.checked_on;
	const births = (input.children || []).filter((b) => fEntered(b));
	const plan = hrPlan({ pattern: input.pattern, custom: input.custom, from, holidays: input.holidays, firstA: input.firstA });
	const parentA = input.parentA === 'אמא' ? 'אמא' : 'אבא';
	const parentB = parentA === 'אבא' ? 'אמא' : 'אבא';
	// Child support from the support engine, with the plan's nights (parent A = the "other" parent of the plan).
	const only = Boolean(input.onlyPlan);
	if (only && !births.length) { errors.push({ field: 'children', he: 'צריך לפחות ילד אחד עם תאריך לידה' }); }
	const sIn = input.support || {};
	const agreed = fEntered(sIn.amount);
	let support = null;
	if (births.length && !only) {
		support = computeSupport(registry, {
			incomeA: sIn.incomeA, incomeB: sIn.incomeB, housingA: sIn.housingA, housingB: sIn.housingB, children: births,
			nightsA: plan.nightsA, father: parentA === 'אבא' ? 'A' : 'B', law: input.law, asOf: from,
		});
		// An agreed amount needs no estimate: missing incomes only block the draft when the tool has to compute the amount.
		if (!support.ok) {
			if (agreed) { support = null; } else { support.errors.forEach((e) => errors.push({ field: `support-${e.field}`, he: e.he })); }
		}
	}
	if (fEntered(sIn.amount) && !(Number(sIn.amount) >= 0 && Number(sIn.amount) < 1e7)) { errors.push({ field: 'support-amount', he: 'סכום המזונות: מספר חיובי' }); }
	// Property from the balancing engine: the home, then each side's other balanced assets and debts.
	const p = input.property || {};
	let balance = null;
	if (!only && (['sell', 'a_keeps', 'b_keeps'].includes(p.home) || fEntered(p.aAssets) || fEntered(p.bAssets))) {
		const items = [];
		if (fEntered(p.homeValue)) { items.push({ kind: 'home', owner: 'joint', value: p.homeValue, mortgage: p.mortgage }); }
		if (fEntered(p.aAssets)) { items.push({ kind: 'savings', owner: 'a', value: p.aAssets }); }
		if (fEntered(p.bAssets)) { items.push({ kind: 'savings', owner: 'b', value: p.bAssets }); }
		if (fEntered(p.aDebts)) { items.push({ kind: 'debt', owner: 'a', value: p.aDebts }); }
		if (fEntered(p.bDebts)) { items.push({ kind: 'debt', owner: 'b', value: p.bDebts }); }
		balance = computeBalance(registry, { marriage: p.marriage || '2000-01-01', breakDate: p.breakDate || from, items });
		if (!balance.ok) { balance.errors.forEach((e) => errors.push({ field: `property-${e.field}`, he: e.he })); }
	}
	if (errors.length) { return { ok: false, errors }; }

	const A = (input.names && String(input.names.a || '').trim()) || hkBlank;
	const B = (input.names && String(input.names.b || '').trim()) || hkBlank;
	// The document's defined terms: "האב" and "האם" (with no children, "הבעל" and "האישה"), the verb in the right gender.
	const kids = births.length > 0;
	const doc = (p) => (kids ? (p === 'אבא' ? 'האב' : 'האם') : (p === 'אבא' ? 'הבעל' : 'האישה'));
	const toDoc = (p) => (kids ? (p === 'אבא' ? 'לאב' : 'לאם') : (p === 'אבא' ? 'לבעל' : 'לאישה'));
	const verb = (p, m, f) => (p === 'אבא' ? m : f);
	const parentOf = (x) => hkWho(x, parentA, parentB);
	// The support figure: the user's amount, or the midpoint of the tool's range, rounded to 10. An agreed amount always
	// has a payer: the one the user chose, else the estimate's payer, else the parent with fewer nights, else the parent
	// with the higher income (review, PR 130).
	let amount = null;
	let payer = null;
	if (agreed) {
		amount = Number(sIn.amount);
		const iA = Number(sIn.incomeA) || 0;
		const iB = Number(sIn.incomeB) || 0;
		payer = sIn.payer === 'A' || sIn.payer === 'B' ? sIn.payer
			: support && support.ok && support.payer ? support.payer
				: plan.nightsA < 7 ? 'A' : plan.nightsA > 7 ? 'B' : (iA >= iB ? 'A' : 'B');
	} else if (support && support.ok && support.payer) {
		amount = fR10((support.low + support.high) / 2); payer = support.payer;
	}
	const kidsLine = births.map((b, i) => `ילד/ה ${i + 1}, ${hkBlank}, יליד/ת ${hkDate(b)}`).join('; ');
	const clauses = [];
	const add = (title, items) => { clauses.push({ n: clauses.length + 1, title, items: items.filter(Boolean) }); };
	add(kids ? 'המבוא והנספחים' : 'המבוא', [kids ? 'המבוא להסכם זה, תוכנית ההורות ולוח החגים שבנספח א\' הם חלק בלתי נפרד ממנו.' : 'המבוא להסכם זה הוא חלק בלתי נפרד ממנו.']);
	if (!only) add('הגירושין', [
		'הצדדים יתגרשו זה מזו בגט פיטורין כדת משה וישראל, בבית הדין הרבני האזורי, בהסכמה ובהקדם האפשרי אחרי אישור הסכם זה.',
		'כל צד יתייצב בבית הדין בכל מועד שייקבע לסידור הגט, ויחתום על כל מסמך הדרוש לשם כך.',
	]);
	if (births.length) {
		const custody = { joint: 'משמורת משותפת: הילדים יגדלו בשני הבתים, לפי תוכנית ההורות שבנספח א\'', mother: 'הילדים יהיו במשמורת האם, וזמני השהות עם האב יהיו לפי תוכנית ההורות שבנספח א\'', father: 'הילדים יהיו במשמורת האב, וזמני השהות עם האם יהיו לפי תוכנית ההורות שבנספח א\'' }[input.custody || 'joint'];
		add('הילדים: אפוטרופסות, משמורת וזמני שהות', [
			`הילדים: ${kidsLine}.`,
			'שני ההורים ימשיכו להיות האפוטרופסים הטבעיים של הילדים, ויחליטו יחד בעניינים מהותיים: חינוך, בריאות, דת ומקום מגורים.',
			`${custody}. לפי התוכנית, ב-14 לילות הילדים לנים ${plan.nightsA} לילות אצל ${doc(parentA)} ו-${14 - plan.nightsA} אצל ${doc(parentB)}.`,
			`בחגים ובחופש הגדול, החלוקה בנספח א' גוברת על השגרה. ${plan.rule === 'split' ? 'חגים ארוכים מתחלקים לשני חצאים, והחצאים מתחלפים מדי שנה.' : 'החגים מתחלקים לסירוגין, והסדר מתחלף מדי שנה.'}`,
			'שינוי מקום מגורים שמשפיע על זמני השהות, ונסיעה של הילדים לחו"ל, ייעשו בהסכמה בכתב של שני ההורים, ובהיעדר הסכמה, באישור בית המשפט.',
			'כל הורה יאפשר לילדים קשר טלפוני וקשר בווידאו עם ההורה השני, ולא ידבר בגנותו בפני הילדים.',
			da.child_not_bound_he + '.',
		]);
	}
	if (births.length && !only) {
		const items = [];
		if (agreed && amount === 0) {
			items.push('ההורים הסכימו שאין ביניהם תשלום מזונות חודשי: כל הורה יישא בעין בצורכי הילדים כשהם אצלו.');
		} else if (amount !== null && payer) {
			const pp = parentOf(payer);
			const pr = parentOf(payer === 'A' ? 'B' : 'A');
			items.push(`${doc(pp)} ${verb(pp, 'ישלם', 'תשלם')} ${toDoc(pr)} מזונות לילדים בסך ${hkMoney(amount)} לחודש, לכל הילדים יחד, ב-${Number(sIn.payDay) || 10} בכל חודש, מהחודש שאחרי אישור ההסכם.`);
		} else if (!agreed && support && support.ok && !support.payer) {
			items.push('לפי חלוקת הזמנים וההכנסות, כל הורה יישא בעין בצורכי הילדים כשהם אצלו, ואין ביניהם תשלום מזונות חודשי.');
		} else {
			items.push(`${hkBlank} ישלם ל${hkBlank} מזונות לילדים בסך ${hkBlank} ש"ח לחודש, ב-10 בכל חודש.`);
		}
		items.push(`סכום המזונות צמוד למדד המחירים לצרכן, ויעודכן כל ${Number(sIn.every) || registry.child_support.indexation.every_months} חודשים לפי המדד הידוע ביום העדכון; המדד הבסיסי הוא המדד הידוע ביום אישור ההסכם.`);
		items.push('המזונות ישולמו עד שכל ילד ימלא 18 שנים או יסיים את התיכון, לפי המאוחר. על התקופה של שירות חובה יסכימו ההורים בכתב, ובהיעדר הסכמה יכריע בית המשפט.');
		if (support && support.ok) {
			items.push(`הוצאות חינוך מיוחדות, חוגים, טיפולים רפואיים שאינם בסל הבריאות, טיפולי שיניים ומשקפיים יתחלקו בין ההורים לפי חלקם בהכנסות: ${Math.round(support.ratio.income * 100)}% על ${doc(parentA)} ו-${100 - Math.round(support.ratio.income * 100)}% על ${doc(parentB)}.`);
		} else {
			items.push('הוצאות חינוך מיוחדות וטיפולים רפואיים שאינם בסל הבריאות יתחלקו בין ההורים לפי חלקם בהכנסות.');
		}
		items.push('קצבת הילדים של המוסד לביטוח לאומי תשולם להורה שהילדים רשומים אצלו, ותשמש לצורכיהם.');
		add('מזונות הילדים', items);
	}
	// A buyout of the joint home: half the net equity (value less the mortgage), which the balance does not include,
	// because the balance counts the home as owned half each (review, PR 130).
	let buyout = null;
	if (balance && balance.ok && (p.home === 'a_keeps' || p.home === 'b_keeps') && fEntered(p.homeValue)) {
		const equity = Number(p.homeValue) - (Number(p.mortgage) || 0);
		buyout = { keeper: p.home === 'a_keeps' ? 'a' : 'b', equity, amount: Math.max(0, Math.round(equity / 2)) };
	}
	if (balance && balance.ok) {
		const items = [];
		if (p.home === 'sell') { items.push(`הדירה המשותפת תימכר, ומהתמורה, אחרי סילוק המשכנתא ועלויות המכירה, יקבל כל צד מחצית. עד המכירה ${births.length ? 'ההורה שהילדים גרים אצלו יגור בה, בכפוף לסעיף 6א לחוק יחסי ממון' : 'יוסכם בכתב מי גר בה'}.`); }
		if (p.home === 'a_keeps' || p.home === 'b_keeps') {
			const k = p.home === 'a_keeps' ? parentA : parentB;
			const o = k === parentA ? parentB : parentA;
			const price = buyout && buyout.amount > 0
				? `תמורת ${hkMoney(buyout.amount)}: מחצית ההון העצמי בדירה (שווי ${hkMoney(Number(p.homeValue))} פחות יתרת משכנתא ${hkMoney(Number(p.mortgage) || 0)}). התמורה תשולם עד ${hkBlank}`
				: `בלי תמורה, כי יתרת המשכנתא אינה נמוכה משווי הדירה (${hkMoney(Number(p.homeValue) || 0)})`;
			items.push(`${doc(k)} ${verb(k, 'ירכוש', 'תרכוש')} את ${verb(o, 'חלקו של', 'חלקה של')} ${doc(o)} בדירה המשותפת ${price}. ${doc(k)} ${verb(k, 'יקבל', 'תקבל')} על ${verb(k, 'עצמו', 'עצמה')} את יתרת המשכנתא ${verb(k, 'וידאג', 'ותדאג')} לשחרר את ${doc(o)} ממנה מול הבנק, והזכויות יירשמו על שם ${doc(k)} אחרי התשלום.`);
		}
		items.push(balance.payer
			? `לאיזון המשאבים ${verb(balance.payer === 'a' ? parentA : parentB, 'ישלם', 'תשלם')} ${doc(balance.payer === 'a' ? parentA : parentB)} ${toDoc(balance.payer === 'a' ? parentB : parentA)} ${hkMoney(balance.pay)}, תוך ${Number(p.payDays) || 90} ימים מאישור ההסכם (סעיף 6(ב) לחוק יחסי ממון בין בני זוג).`
			: 'שווי הנכסים של הצדדים לאיזון שווה, ולכן אין ביניהם תשלום איזון.');
		if (p.pension) { items.push('זכויות הפנסיה והחיסכון שנצברו מיום הנישואין ועד מועד הקרע יחולקו בחלקים שווים דרך הגופים המשלמים, לפי חוק לחלוקת חיסכון פנסיוני בין בני זוג שנפרדו, התשע"ד-2014, והצדדים יחתמו על כל טופס הדרוש לכך.'); }
		items.push('כל צד יישאר הבעלים של חשבונות הבנק, הרכב והמיטלטלין שבחזקתו, ויישא בחובות שעל שמו, אלא אם נקבע אחרת בהסכם זה.');
		add('הרכוש', items);
	}
	if (!only) add('סילוק טענות', [
		`עם ביצוע הסכם זה, לא יהיו לצדדים טענות ותביעות רכושיות זה כלפי זה, חוץ מההתחייבויות שבהסכם.${kids ? ' אין בסעיף זה כדי לפגוע בזכויות הילדים.' : ''}`,
		'צד שהסתיר נכס מהותי לא יוכל להסתמך על הסכם זה לגבי אותו נכס.',
	]);
	add('אישור ההסכם', [
		only ? 'ההורים יגישו את תוכנית ההורות לאישור בית המשפט לענייני משפחה (או לבית הדין הרבני, אם העניין כרוך שם), כדי שתקבל תוקף של החלטה.' : route === 'rabbinical'
			? 'הצדדים יגישו את ההסכם לבית הדין הרבני האזורי ויבקשו לתת לו תוקף של פסק דין. הסכם שאושר בפסק הדין להתרת הנישואין דינו כהסכם ממון מאושר (סעיף 2(ד) לחוק יחסי ממון).'
			: 'הצדדים יגישו את ההסכם לבית המשפט לענייני משפחה ויבקשו לאשר אותו ולתת לו תוקף של פסק דין. הגט יסודר בבית הדין הרבני.',
		kids ? 'ההסדרים לגבי הילדים טעונים אישור בית המשפט או בית הדין, שיאשר אותם רק אם הם לטובת הילדים (סעיף 24 לחוק הכשרות המשפטית והאפוטרופסות).' : '',
		'כל צד יישא בהוצאותיו ובשכר טרחת עורך דינו. כל שינוי בהסכם ייעשה בכתב ויאושר כדין.',
	]);
	const title = only ? 'הסכם הורות משותפת (תוכנית הורות)' : 'הסכם גירושין';
	const lines = [title, `שנערך ונחתם ב-${hkBlank} ביום ${hkBlank}`, '',
		`בין: ${A}, ת"ז ${hkBlank} (להלן: "${doc(parentA)}")`, `לבין: ${B}, ת"ז ${hkBlank} (להלן: "${doc(parentB)}")`, '',
		...(only ? [`הואיל והצדדים הם הורים ל${births.length === 1 ? 'ילד אחד' : `${births.length} ילדים`}, והם חיים או עומדים לחיות בנפרד;`,
			'והואיל וההורים רוצים להסדיר את האחריות ההורית, את זמני השהות ואת החגים, לטובת הילדים;']
			: [`הואיל והצדדים נישאו זה לזו ביום ${hkBlank}${births.length ? `, ומנישואיהם נולדו ${births.length === 1 ? 'ילד אחד' : `${births.length} ילדים`}` : ''};`,
				'והואיל ובין הצדדים נפלו חילוקי דעות, והם החליטו להתגרש בהסכמה;',
				`והואיל והצדדים רוצים להסדיר בהסכם זה את כל העניינים שביניהם, כולל ${kids ? 'הילדים והרכוש' : 'הרכוש'};`]),
		'והואיל וכל צד קיבל, או הוצע לו לקבל, ייעוץ משפטי עצמאי, והוא חותם בהסכמה חופשית ובהבינו את משמעות ההסכם ותוצאותיו;',
		'', 'לפיכך הוסכם בין הצדדים כדלקמן:', ''];
	for (const c of clauses) {
		lines.push(`${c.n}. ${c.title}`);
		c.items.forEach((t, i) => lines.push(`${c.n}.${i + 1} ${t}`));
		lines.push('');
	}
	lines.push('ולראיה באו הצדדים על החתום:', '', '____________________          ____________________', '');
	// Annex A: the plan in words (only when there are children).
	const weekRow = (w) => plan.nights.slice(w * 7, w * 7 + 7).map((x, i) => `${HR_DAYS[i]}: ${doc(x === 'A' ? parentA : parentB)}`).join(', ');
	if (kids) {
		lines.push("נספח א': תוכנית ההורות", `שבוע 1 (לינות): ${weekRow(0)}`, `שבוע 2 (לינות): ${weekRow(1)}`,
			`החלפה: ${HR_PATTERNS[plan.pattern] ? HR_PATTERNS[plan.pattern].he : 'לפי הלוח'}; ההורה שהילדים עוברים אליו אוסף אותם מבית הספר או מהגן, ובימים בלי לימודים מהבית בשעה 17:00.`, '');
	}
	for (const y of kids ? plan.years : []) {
		lines.push(`חגים, שנת ${y[0] ? y[0].hebrewYear : ''}:`);
		for (const h of y) {
			if (h.halves) { lines.push(`${h.he}: ${doc(parentOf(h.halves[0].who))} מ-${hkDate(h.halves[0].from)} עד ${hkDate(h.halves[0].to)}, ${doc(parentOf(h.halves[1].who))} מ-${hkDate(h.halves[1].from)} עד ${hkDate(h.halves[1].to)}`); } else {
				lines.push(`${h.he}: ${doc(parentOf(h.who))}${h.start ? `, מ-${hkDate(h.start)} עד ${hkDate(h.end)}` : ''}`);
			}
		}
		lines.push('');
	}
	const r = da.routes[route];
	const flags = [{ code: 'approval', he: da.s24_he }, { code: 'child', he: da.child_not_bound_he }, { code: 'schedule', he: da.schedule_he }, { code: 'request', he: da.no_request_he }];
	if (births.some((b) => support && support.ok && support.perChild.some((c) => c.bracket === 'under6'))) { flags.push({ code: 'under6', he: da.s25_he }); }
	const lawyer = [
		'הסכום החודשי: הכלי נותן טווח לפי שיטות החישוב בפסיקה, והסכום בהסכם הוא בחירה שלכם. בדקו אותו מול הצרכים בפועל',
		'מזונות בתקופת שירות החובה ואחרי גיל 18',
		'הדירה: הסכמת הבנק להחלפת לווים, מס שבח ומס רכישה בהעברה בין בני זוג',
		'פנסיה: נוסח פסק הדין שהקופה צריכה, ושיעור החלוקה המדויק',
		'כתובה ומזונות אישה: ההסכם הזה לא עוסק בהם',
		'מעבר דירה עם הילדים, נסיעות לחו"ל וחינוך דתי או חילוני',
	];
	return {
		ok: true, only, kids: births.length, title, route, plan, parentA, parentB, support, amount, payer, agreed, balance, buyout, clauses, text: lines.join('\n'),
		cost: { fee: r.fee, item: r.fee_item, law: r.fee_he, url: r.fee_url }, steps: r.steps_he, flags, lawyer,
	};
}
