/**
 * The inheritance-dispute navigator (the inheritance wave, 21.10.2026). Invented: no Hebrew tool takes the quarrel as the
 * family describes it (a will they doubt, a sibling living in the flat, one heir holding the money, a parent who gave gifts
 * before dying) and the stage the file is at, and returns the routes the law opens, with the forum, the fee, the clock and
 * the evidence each one needs.
 *
 * Dependency-free ES module. Every amount, day and section comes from registry.inheritance_process and, for the Bar's
 * recommended minimum, registry.will_cost.bar:
 *  - the objection within two weeks of the publication (s.67, reg. 17(א)), filed with the registrar and heard by the family
 *    court (s.67א, regs. 19-21), fee item 4 of the family court's fee regulations;
 *  - amendment or cancellation of an order already given (s.72; reg. 27: the heirs answer within 14 days), item 2 of the
 *    registrar's fees or item 4א of the court's; good-faith buyers keep what they bought (s.73);
 *  - an estate manager (ss.78-79; the registrar only with everyone's consent), item 3 / item 4ב;
 *  - partition of a co-owned flat (Land Law ss.37-40): by agreement, in kind, or by sale;
 *  - a claim about the estate's assets, accounts or lifetime gifts (ss.121-122; the family court);
 *  - maintenance from the estate (ss.56-65; before the division, or up to 6 months after it with reasons, s.60; reg. 28);
 *  - an agreement among the heirs (s.110; the first division is not a sale, s.5(ג)(4) of the Land Taxation Law) and
 *    mediation (Courts Law s.79ג).
 */
import { addDays, daysBetween } from './dates.js';

export const SC_ISSUES = {
	will: 'צוואה שאנחנו מפקפקים בה (כשרות, השפעה, זיוף, פגם)',
	shares: 'מחלוקת על מי יורש וכמה',
	apartment: 'דירה משותפת: מישהו גר בה, ואחרים רוצים למכור',
	control: 'יורש אחד שולט בכסף, בחשבון או במסמכים, ולא משתף',
	manager: 'אין מי שינהל את העיזבון: חובות, נכסים, עסק',
	pressure: 'לוחצים על יורש להסתלק או לחתום',
	mutual: 'צוואה הדדית ששונתה אחרי מות בן הזוג',
	support: 'בן זוג או ילד שנשארו בלי פרנסה מהעיזבון',
	gifts: 'מתנות, העברות או ייפוי כוח בחיי המנוח',
};
export const SC_STAGES = { before: 'עוד לא הוגשה בקשה לצו', published: 'הבקשה פורסמה, הצו טרם ניתן', issued: 'הצו ניתן, העיזבון טרם חולק', divided: 'העיזבון כבר חולק' };
const r2 = (n) => Math.round(n * 100) / 100;

/** A fee reference "family_court.objection" → { amount, he, item, url }. */
export function scFee(ip, ref) {
	if (!ref) { return null; }
	const [group, key] = ref.split('.');
	const g = ip[group];
	const it = g && g.items && g.items[key];
	if (!it) { return null; }
	return { amount: it.amount, he: it.he, item: it.item, url: g.url, group };
}

/** The evidence to gather for each route: the facts the regulations and the law ask for. */
const EVIDENCE = {
	objection: ['הצוואה שמבקשים לקיים, וכל צוואה קודמת', 'תיק רפואי ומכתבי רופאים מהתקופה של עריכת הצוואה', 'מי ערך, מי העיד, מי נכח, ומה הקשר שלהם לזוכה', 'התכתבויות והקלטות שמראות לחץ, בידוד או תלות', 'תצהיר על העובדות, מאומת בפני עורך דין'],
	amend: ['העובדות שלא היו לפני הרשם כשנתן את הצו, ולמה לא אפשר היה לטעון אותן קודם', 'הצו שניתן, ומה צריך לשנות בו', 'הודעה לכל היורשים שבצו'],
	manager: ['רשימת נכסי העיזבון, החובות והנושים', 'הסכמת היורשים למינוי, כשיש', 'מועמד לניהול, ומה הוא דורש', 'הסכום שהעיזבון לא מצליח לשלם או לגבות בלי מנהל'],
	partition: ['נסח טאבו של הדירה', 'הערכת שמאי', 'מי גר בדירה, מאיזה יום ובאילו תנאים', 'הצעות קנייה ומכירה שהוחלפו'],
	declaration: ['דפי חשבון של המנוח ב-12 החודשים האחרונים', 'ייפויי כוח שהיו בתוקף ומה נעשה בהם', 'העברות, מתנות והלוואות, עם התאריכים', 'מי החזיק במסמכים ומה נמסר'],
	support: ['ההכנסות שלכם ב-12 החודשים שלפני הבקשה', 'מה המנוח נתן לכם בחייו, ומה הצורך עכשיו', 'מי היורשים ומה חלקם'],
	agreement: ['הצו או הבקשה, ורשימת הנכסים עם שווי', 'מה כל יורש רוצה לקבל, ומה הוא מוכן לשלם או לוותר', 'אישור בית משפט כשיש קטין או חסוי'],
	mediation: ['מה כל אחד רוצה באמת: הדירה, הכסף, הזיכרון, הכבוד', 'מגשר שכולם מקבלים: מגשר פרטי, או הפניה מבית המשפט'],
};

/** Which routes an issue opens, in the order they should be read. */
const ISSUE_ROUTES = {
	will: ['objection', 'amend', 'mediation', 'agreement'],
	shares: ['objection', 'amend', 'agreement', 'mediation'],
	apartment: ['agreement', 'mediation', 'partition', 'manager'],
	control: ['declaration', 'manager', 'mediation', 'agreement'],
	manager: ['manager', 'agreement', 'mediation'],
	pressure: ['mediation', 'objection', 'amend', 'declaration'],
	mutual: ['objection', 'amend', 'mediation'],
	support: ['support', 'mediation', 'agreement'],
	gifts: ['declaration', 'mediation', 'agreement', 'manager'],
};

/**
 * input = { issues: [keys], stage, publication (ISO or ''), orderDate (ISO or ''), today (ISO), heirs (2-30), apartment (bool),
 *           minor (bool), willing ('yes' | 'no' | 'unknown'), estate (number or ''), share (number or '': the user's share %),
 *           barRef (bool) }
 */
export function scBuild(registry, input) {
	const ip = registry.inheritance_process;
	const bar = registry.will_cost ? registry.will_cost.bar : null;
	const vatPct = registry.will_cost ? registry.will_cost.vat.pct : 18;
	const errors = [];
	const issues = (Array.isArray(input.issues) ? input.issues : []).filter((k) => SC_ISSUES[k]);
	if (!issues.length) { errors.push({ field: 'issues', he: 'בוחרים לפחות עניין אחד שבמחלוקת' }); }
	const stage = SC_STAGES[input.stage] ? input.stage : 'before';
	const heirs = input.heirs === '' || input.heirs === undefined || input.heirs === null ? 2 : Number(input.heirs);
	if (!(Number.isInteger(heirs) && heirs >= 2 && heirs <= 30)) { errors.push({ field: 'heirs', he: 'מספר היורשים: 2 עד 30' }); }
	const publication = /^\d{4}-\d{2}-\d{2}$/.test(String(input.publication || '')) ? input.publication : '';
	if (stage === 'published' && input.publication && !publication) { errors.push({ field: 'publication', he: 'יום הפרסום: תאריך, לדוגמה 11.10.2026' }); }
	const today = /^\d{4}-\d{2}-\d{2}$/.test(String(input.today || '')) ? input.today : '';
	const estate = !input.barRef || input.estate === '' || input.estate === undefined || input.estate === null ? null : Number(input.estate);
	if (estate !== null && !(estate >= 0 && estate < 1e11)) { errors.push({ field: 'estate', he: 'שווי העיזבון: מספר חיובי' }); }
	const share = !input.barRef || input.share === '' || input.share === undefined || input.share === null ? null : Number(input.share);
	if (share !== null && !(share > 0 && share <= 100)) { errors.push({ field: 'share', he: 'החלק שלכם באחוזים: 1 עד 100' }); }
	if (errors.length) { return { ok: false, errors }; }

	const willing = ['yes', 'no'].includes(input.willing) ? input.willing : 'unknown';
	const apartment = Boolean(input.apartment) || issues.includes('apartment');
	const d = ip.days;
	const byKey = {};
	for (const r of ip.routes) { byKey[r.key] = r; }

	// 1. The routes the issues open, deduplicated in reading order, then filtered by the stage.
	const order = [];
	for (const k of issues) { for (const r of ISSUE_ROUTES[k]) { if (!order.includes(r)) { order.push(r); } } }
	if (apartment && !order.includes('partition')) { order.push('partition'); }
	const stageOf = (key) => {
		if (key === 'objection') { return stage === 'published' ? 'now' : stage === 'before' ? 'later' : 'closed'; }
		if (key === 'amend') { return stage === 'issued' || stage === 'divided' ? 'now' : 'later'; }
		if (key === 'support') { return stage === 'divided' ? 'late' : 'now'; }
		if (key === 'agreement') { return stage === 'divided' ? 'closed' : 'now'; }
		return 'now';
	};
	const routes = [];
	for (const key of order) {
		const src = byKey[key];
		if (!src) { continue; }
		const timing = stageOf(key);
		if (timing === 'closed') { continue; }
		const fee = scFee(ip, src.fee);
		const feeCourt = scFee(ip, src.fee_court);
		let clock = '';
		let clockDate = '';
		if (key === 'objection') {
			clockDate = publication ? addDays(publication, d.objection) : '';
			clock = clockDate ? `עד ${heDate(clockDate)}` : d.objection_he;
		} else if (key === 'amend') {
			clock = `אין מועד בחוק; מי שקנה מהיורש שבצו בתום לב ובתמורה שומר על זכותו (${ip.sections.good_faith}), ולכן מגישים מהר; ליורשים ${d.amend_response} ימים לתשובה`;
		} else if (key === 'support') {
			clock = d.support_he;
		} else if (key === 'manager') {
			clock = 'אין מועד בחוק; בית המשפט ממנה כשיש צורך בניהול, גם לפני הצו';
		} else if (key === 'partition') {
			clock = `אפשר לדרוש בכל עת (${ip.land_law.partition_right} לחוק המקרקעין)`;
		} else if (key === 'agreement' || key === 'mediation') {
			clock = stage === 'divided' ? 'אחרי החלוקה: הסכמה חדשה היא עסקה חדשה' : 'כל עוד העיזבון לא חולק; גם במקביל להליך בבית המשפט';
		} else {
			clock = `התיישנות: ${ip.limitation.years} שנים (${ip.limitation.section} לחוק ההתיישנות), במקרקעין ${ip.limitation.land_years} (${ip.limitation.land_section}), מהיום שנודעו העובדות (${ip.limitation.discovery_section}); מוקדם יותר כשיש חשש להברחת נכסים`;
		}
		const why = ISSUE_WHY[key] || '';
		routes.push({
			key, he: src.he, where: src.where, sections: src.sections, fee, feeCourt, clock, clockDate, timing, why,
			evidence: EVIDENCE[key] || [],
			rehearse: key === 'mediation' || key === 'agreement' ? 'mediation' : key === 'objection' || key === 'partition' || key === 'declaration' ? 'court_rehearsal' : 'witness_prep',
		});
	}
	// 2. The first step: willing heirs talk first; otherwise the first legal route that is open now.
	let first = routes.find((r) => r.key === 'mediation' && willing !== 'no') || routes.find((r) => r.key === 'agreement' && willing === 'yes');
	if (!first) { first = routes.find((r) => r.timing === 'now' && r.key !== 'mediation' && r.key !== 'agreement') || routes[0]; }

	// 3. The clock of the stage.
	const clock = { stage, publication, objectionsBy: '', daysLeft: null, band: 'none' };
	if (stage === 'published' && publication) {
		clock.objectionsBy = addDays(publication, d.objection);
		if (today) {
			clock.daysLeft = daysBetween(today, clock.objectionsBy);
			clock.band = clock.daysLeft < 0 ? 'passed' : clock.daysLeft <= 3 ? 'closing' : 'open';
		}
	}

	// 4. The fees that apply, summed once per route group (what you would pay to open each route).
	const feeLines = routes.filter((r) => r.fee || r.feeCourt).map((r) => ({ key: r.key, he: r.he, registrar: r.fee && r.fee.group === 'registrar' ? r.fee : null, court: r.feeCourt || (r.fee && r.fee.group === 'family_court' ? r.fee : null) }));

	// 5. The Bar's recommended minimum, when asked (before VAT).
	let barRef = null;
	if (input.barRef && bar) {
		const probate = estate !== null ? Math.max(r2(estate * bar.probate_pct / 100), bar.probate_min) : bar.probate_min;
		const objection = r2(probate * (100 + bar.objection_add_pct) / 100);
		const ownShare = estate !== null && share !== null ? r2(estate * share / 100) : null;
		const partition = ownShare !== null ? Math.max(r2(ownShare * ip.bar.partition_pct / 100), ip.bar.partition_min) : ip.bar.partition_min;
		barRef = {
			estate, share, probate, objection, partition, nonmonetary: ip.bar.nonmonetary, interim: ip.bar.interim, hearing: ip.bar.hearing,
			vatPct, withVat: (n) => r2(n * (100 + vatPct) / 100), note: ip.bar.note_he, url: ip.bar.url, items: ip.bar.items, barItems: bar.items,
		};
	}

	// 6. Flags.
	const flags = [];
	if (input.minor) { flags.push({ code: 'minor', he: `יורש קטין או חסוי: הסכם, ויתור או חלוקה של דירה בשמו רק באישור בית המשפט מראש (${ip.capacity.minor_property} לחוק הכשרות)`, url: ip.capacity.url }); }
	if (issues.includes('pressure')) { flags.push({ code: 'pressure', he: `הסתלקות שנחתמה בלחץ: הסתלקות על תנאי בטלה (${ip.sections.renounce_conditional}); הסתלקות של קטין טעונה אישור בית המשפט (${ip.sections.renounce_minor}); חתימה שהושגה באיום או בתרמית היא עילה בבית המשפט`, url: ip.law_url }); }
	if (issues.includes('mutual')) { flags.push({ code: 'mutual', he: `צוואה הדדית: אחרי מות אחד מבני הזוג, השני מבטל רק אם הסתלק ממה שקיבל לפי צוואת המנוח (${ip.sections.mutual})`, url: ip.law_url }); }
	if (apartment) { flags.push({ code: 'apartment', he: ip.land_law.partition_he, url: ip.land_law.url }); }
	if (stage === 'divided') { flags.push({ code: 'divided', he: 'העיזבון חולק: התנגדות והסכם חלוקה ראשון כבר לא פתוחים; נשארים תיקון או ביטול הצו, תביעות על הנכסים, ומזונות עד 6 חודשים אחרי החלוקה', url: ip.law_url }); }
	flags.push({ code: 'forum', he: `${ip.courts.family_he}. ${ip.courts.religious_he}`, url: ip.law_url });

	return { ok: true, issues, stage, stageHe: SC_STAGES[stage], heirs, apartment, willing, routes, first, clock, feeLines, barRef, flags };
}

const ISSUE_WHY = {
	objection: 'כל עוד הצו לא ניתן, זו הדרך היחידה לעצור אותו: התנגדות בכתב, עם העילות והראיות',
	amend: 'צו שכבר ניתן משנים רק על עובדות שלא היו לפני מי שנתן אותו',
	manager: 'מנהל עיזבון מרכז את הנכסים, משלם חובות ומחלק; הוא פותר "מי מחזיק במה"',
	partition: 'שותף בדירה לא חייב להישאר שותף: חלוקה בעין כשאפשר, ואם לא, מכירה',
	declaration: 'בית המשפט מצהיר מה שייך לעיזבון ומחייב לתת חשבון ולהשיב',
	support: 'מי שהמנוח פרנס יכול לקבל מזונות מהעיזבון, לפני החלוקה',
	agreement: 'היורשים יכולים לחלק אחרת מהצו, בלי בית משפט ובלי מס על החלוקה הראשונה',
	mediation: 'הסכם שנולד בגישור מחזיק יותר מפסק דין, וזול ממנו',
};

function heDate(iso) { const [y, m, dd] = iso.split('-').map(Number); return `${dd}.${m}.${y}`; }
