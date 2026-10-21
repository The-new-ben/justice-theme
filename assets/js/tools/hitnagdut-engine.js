/**
 * The objection clock and grounds checker (שעון ההתנגדות לצוואה ובודק העילות), the inheritance wave (21.10.2026).
 * Invented: no Hebrew page runs the 14-day clock from the publication, maps the grounds against the evidence in hand,
 * and writes the objection's skeleton with the section of each ground.
 *
 * Dependency-free ES module (dates.js only). Every number and every section comes from registry.inheritance_process
 * (and the Bar's figures and VAT from registry.will_cost), read on their checked_on date:
 *  - Once a request for an order is filed, the registrar publishes it and invites objections within two weeks of the
 *    publication, or a longer period he sets, and may extend (Succession Law s.67; Succession Regulations reg. 17(א)).
 *    The objection is filed with the registrar and heard by the family court (s.67א; reg. 20-21: the applicant is the
 *    plaintiff, the objector the defendant). Its contents: reg. 19.
 *  - The fee: family-court fee regulations, first schedule item 4, indexed on 1 January and 1 July.
 *  - A will found in the registrar's registry: its beneficiaries get 14 days (reg. 18).
 *  - After an order was issued: amendment or cancellation on facts not before the registrar (s.72; reg. 27: the heirs
 *    get 14 days to respond); when the applicant could have raised them earlier the registrar refers it to the court.
 *    Fees: registrar item 2, family court item 4א. Good-faith buyers are protected (s.73).
 *  - The Bar's recommended minimum (non-binding, before VAT): a probate request 1.5% of the estate, at least the minimum,
 *    +25% with an objection, and a fixed sum for each extra hearing.
 * The strength words ("with evidence", "needs evidence") are the tool's reading of the person's own answers, not a forecast.
 */
import { addDays, daysBetween, parseDate, isRestDay } from './dates.js';

export const FILED = ['probate', 'inheritance'];
export const STAGES = ['published', 'before', 'issued'];
export const STANDINGS = ['heir', 'prior_will', 'creditor', 'other'];
export const STANDING_HE = { heir: 'יורש/ת על פי דין', prior_will: 'זוכה בצוואה קודמת', creditor: 'נושה של העיזבון', other: 'מעוניין/ת בדבר מסיבה אחרת' };
export const FILED_HE = { probate: 'צו קיום צוואה', inheritance: 'צו ירושה' };

const r2 = (n) => Math.round(n * 100) / 100;
const isoNow = () => new Date().toISOString().slice(0, 10);
export function heDate(iso) {
	if (!iso) { return ''; }
	const [y, m, d] = iso.split('-').map(Number);
	return `${d}.${m}.${y}`;
}
const list = (v) => (Array.isArray(v) ? v.map(String) : typeof v === 'string' && v ? v.split('.') : []);

/**
 * An objection to an inheritance order (no will): the dispute is about who the heirs are and their shares under the
 * law's order of succession, which the registrar states in the order (s.66) after the publication (s.67). The texts are
 * the tool's; the sections are the registry's.
 */
export function inheritanceGrounds(ip) {
	const section = ip.sections.orders;
	const url = ip.law_url;
	return [
		{ key: 'missing_heir', he: 'יורש/ת על פי דין שלא נכלל/ה בבקשה (ילד, בן זוג, הורה או אח של המנוח/ה)', section, url, evidence: 'תמצית רישום ממרשם האוכלוסין, תעודת לידה או נישואין, תצהיר על הקרבה', effect: 'הצו ייתן את רשימת היורשים הנכונה' },
		{ key: 'wrong_share', he: 'החלקים בבקשה לא לפי סדר הירושה שבחוק', section, url, evidence: 'מי היורשים ומה הקרבה של כל אחד; הסתלקויות שנעשו', effect: 'הצו ייתן את החלקים הנכונים' },
		{ key: 'not_heir', he: 'מי שרשום בבקשה כיורש/ת אינו/ה יורש/ת על פי דין', section, url, evidence: 'מסמכי המעמד האישי: גירושין, פסק דין, תמצית רישום', effect: 'הצו יוציא אותו/ה מרשימת היורשים' },
		{ key: 'will_exists', he: 'יש צוואה, ולכן אין מקום לצו ירושה אלא לבקשה לצו קיום צוואה', section: ip.sections.publication, url, evidence: 'הצוואה עצמה, או אישור ההפקדה אצל הרשם', effect: 'הבקשה לצו ירושה תידחה; מגישים בקשה לצו קיום צוואה' },
	];
}

/** Whole will, one clause, or depends: the registry's effect text, read from its opening words. */
export function scopeOf(effect) {
	const t = String(effect || '');
	if (/^(הצוואה בטלה|אין צוואה)/.test(t)) { return 'whole'; }
	if (/^ההוראה/.test(t)) { return 'clause'; }
	return 'depends';
}

/**
 * input = { filed ('probate' | 'inheritance'), stage ('published' | 'before' | 'issued'), published (ISO or d.m.y text),
 *           issued (ISO or d.m.y text; the order's day), standing ('heir' | 'prior_will' | 'creditor' | 'other'),
 *           grounds [keys], evidence [keys with evidence in hand], represented (bool), barRef (bool), estate (number, for
 *           the Bar reference only), extension (bool: an extension was asked from the registrar), today (ISO; the tests
 *           pass it, the browser passes the civil date in Israel) }
 */
export function compute(registry, input) {
	const ip = registry.inheritance_process;
	const wc = registry.will_cost;
	const errors = [];
	const filed = FILED.includes(input.filed) ? input.filed : 'probate';
	const stage = STAGES.includes(input.stage) ? input.stage : 'published';
	const standing = STANDINGS.includes(input.standing) ? input.standing : 'heir';
	const today = parseDate(input.today) || isoNow();
	const pubRaw = String(input.published ?? '').trim();
	const issRaw = String(input.issued ?? '').trim();
	const published = pubRaw ? parseDate(pubRaw) : null;
	const issued = issRaw ? parseDate(issRaw) : null;
	if (stage === 'published') {
		if (!published) { errors.push({ field: 'published', he: 'יום הפרסום: יום.חודש.שנה, לדוגמה 11.10.2026' }); } else if (published > today) { errors.push({ field: 'published', he: `יום הפרסום לא יכול להיות אחרי היום (${heDate(today)})` }); }
	}
	if (stage === 'issued') {
		if (!issued) { errors.push({ field: 'issued', he: 'יום מתן הצו: יום.חודש.שנה' }); } else if (issued > today) { errors.push({ field: 'issued', he: `יום מתן הצו לא יכול להיות אחרי היום (${heDate(today)})` }); }
		if (pubRaw && !published) { errors.push({ field: 'published', he: 'יום הפרסום: יום.חודש.שנה, או להשאיר ריק' }); }
		if (issued && published && issued < published) { errors.push({ field: 'issued', he: 'הצו לא יכול להינתן לפני שהבקשה פורסמה' }); }
	}
	// The estate value feeds only the Bar reference: with the reference off it is neither read nor validated.
	const barRef = Boolean(input.barRef);
	const estate = !barRef || input.estate === '' || input.estate === undefined || input.estate === null ? null : Number(input.estate);
	if (estate !== null && !(estate >= 0 && estate < 1e11)) { errors.push({ field: 'estate', he: 'שווי העיזבון: מספר חיובי' }); }
	if (errors.length) { return { ok: false, errors }; }

	// 1. The clock: two weeks from the publication (s.67; reg. 17(א)).
	const windowDays = ip.days.objection;
	const deadline = published ? addDays(published, windowDays) : null;
	const daysLeft = stage === 'published' ? daysBetween(today, deadline) : null;
	const elapsed = stage === 'published' ? daysBetween(published, today) : null;
	let band = 'open';
	if (stage === 'before') { band = 'none'; } else if (stage === 'issued') { band = 'issued'; } else if (daysLeft < 0) { band = 'passed'; } else if (daysLeft === 0) { band = 'last'; } else if (daysLeft <= 3) { band = 'closing'; }
	const count = stage === 'published' ? Math.max(0, daysLeft) : stage === 'issued' ? ip.days.amend_response : windowDays;
	const route = stage === 'issued' ? 'amend' : 'objection';

	// 2. The grounds map: the registry's list (or the inheritance-order list), with the person's answers on each.
	const source = filed === 'probate' ? ip.grounds.map((g) => Object.assign({}, g, { url: ip.law_url })) : inheritanceGrounds(ip);
	const mine = new Set(list(input.grounds));
	const ev = new Set(list(input.evidence));
	const grounds = source.map((g) => {
		const picked = mine.has(g.key);
		const has = picked && ev.has(g.key);
		return { key: g.key, he: g.he, section: g.section, url: g.url, evidence: g.evidence, effect: g.effect, mine: picked, hasEvidence: has, strength: !picked ? '' : has ? 'strong' : 'needs', scope: scopeOf(g.effect) };
	});
	const selected = grounds.filter((g) => g.mine);
	const counts = { selected: selected.length, withEvidence: selected.filter((g) => g.hasEvidence).length, without: selected.filter((g) => !g.hasEvidence).length, whole: selected.filter((g) => g.scope === 'whole').length, clause: selected.filter((g) => g.scope === 'clause').length };

	// 3. The fees of each route.
	const fc = ip.family_court;
	const rg = ip.registrar;
	const fee = { amount: fc.items.objection.amount, item: fc.items.objection.item, he: fc.items.objection.he, url: fc.url, indexed: fc.indexed_he, pay: rg.payments.url, pay_he: rg.payments.he };
	const amend = {
		registrar: { amount: rg.items.amend.amount, item: rg.items.amend.item, he: rg.items.amend.he, url: rg.url },
		court: { amount: fc.items.amend.amount, item: fc.items.amend.item, he: fc.items.amend.he, url: fc.url },
		days: ip.days.amend_response, section: ip.sections.amend, regulation: ip.regulation_sections.amend, good_faith: ip.sections.good_faith,
		responseBy: issued ? addDays(issued, ip.days.amend_response) : null,
	};

	// 4. The Bar's recommended minimum, only when asked for and an estate value was typed (non-binding, before VAT).
	const bar = wc.bar;
	const vatPct = wc.vat.pct;
	let barRefOut = { shown: false };
	if (barRef && estate !== null) {
		const base = Math.max(r2(estate * bar.probate_pct / 100), bar.probate_min);
		const withObjection = r2(base * (100 + bar.objection_add_pct) / 100);
		barRefOut = { shown: true, estate, base, add: r2(withObjection - base), withObjection, hearing: ip.bar.hearing, vatPct, withVat: r2(withObjection * (100 + vatPct) / 100), pct: bar.probate_pct, min: bar.probate_min, addPct: bar.objection_add_pct, items: { probate: bar.items.probate, objection: ip.bar.items.objection, hearing: ip.bar.items.hearing }, url: bar.url, note: bar.note_he, atMin: r2(estate * bar.probate_pct / 100) < bar.probate_min };
	}

	// 5. Flags: what the answers change, each with its section.
	const flags = [];
	if (stage === 'published' && band === 'passed') {
		flags.push(input.extension
			? { code: 'extension_asked', he: `ביקשתם הארכה: ${ip.days.objection_he}. כל עוד הרשם לא נתן צו, הגישו את ההתנגדות עם הבקשה להארכה; הרשם רשאי לקבל אותה`, section: ip.regulation_sections.publication, url: ip.regulations_url }
			: { code: 'extension', he: `חלון השבועיים נסגר ב-${heDate(deadline)}: ${ip.days.objection_he}. בקשו מהרשם הארכה, ובינתיים הכינו את ההתנגדות; כל עוד לא ניתן צו אפשר עדיין להגיש`, section: ip.regulation_sections.publication, url: ip.regulations_url });
	}
	if (stage === 'published' && band !== 'passed' && isRestDay(deadline)) {
		flags.push({ code: 'rest_day', he: `המועד האחרון (${heDate(deadline)}) חל ביום מנוחה: הגישו לפניו` });
	}
	if (standing === 'prior_will') { flags.push({ code: 'other_will', he: ip.days.other_will_he, section: ip.regulation_sections.other_will, url: ip.regulations_url }); }
	if (standing === 'other') { flags.push({ code: 'standing', he: `מי שאינו יורש או זוכה כותב בכתב ההתנגדות מה הזכות בעיזבון שהוא טוען לה: ${ip.objection_contents[0].he}`, section: ip.objection_contents[0].section, url: ip.regulations_url }); }
	if (stage === 'issued') { flags.push({ code: 'good_faith', he: 'מי שקנה בתום לב ובתמורה מיורש שרשום בצו מוגן גם אם הצו יתוקן או יבוטל', section: ip.sections.good_faith, url: ip.law_url }); }
	if (stage === 'issued' && issued && today > amend.responseBy) { flags.push({ code: 'amend_old', he: `הצו ניתן לפני ${daysBetween(issued, today)} ימים. עובדות שאפשר היה להביא בפני הרשם לפני הצו: הרשם מעביר את הבקשה לבית המשפט לענייני משפחה`, section: ip.sections.amend, url: ip.law_url }); }
	if (filed === 'inheritance' && mine.has('will_exists')) { flags.push({ code: 'will_exists', he: 'כשיש צוואה, הבקשה הנכונה היא לצו קיום צוואה; ההתנגדות אומרת זאת ומצרפת את הצוואה או את אישור ההפקדה', section: ip.sections.publication, url: ip.law_url }); }
	if (input.represented) { flags.push({ code: 'poa', he: 'עם עורך דין: ייפוי כוח מצורף להתנגדות', section: ip.objection_contents[4].section, url: ip.regulations_url }); }
	if (counts.selected && !counts.withEvidence) { flags.push({ code: 'no_evidence', he: 'לכל העילות שסימנתם עוד אין ראיה בידכם. ההתנגדות נתמכת בתצהיר ובמסמכים; אספו אותם לפני ההגשה, ובקשו מבית המשפט צווים לקבלת מסמכים כשהם אצל אחרים', section: ip.objection_contents[3].section, url: ip.regulations_url }); }

	return {
		ok: true, filed, stage, standing, today, published, issued, deadline, daysLeft, elapsed, windowDays, band, count, route,
		extension: Boolean(input.extension), represented: Boolean(input.represented),
		grounds, selected, counts, fee, amend, bar: barRefOut, flags,
		contents: ip.objection_contents,
	};
}

/** The objection's skeleton (reg. 19), or the s.72 request after an order: placeholders, never a real name. */
export function draftText(registry, r) {
	if (!r.ok) { return ''; }
	const ip = registry.inheritance_process;
	const order = FILED_HE[r.filed];
	const amend = r.stage === 'issued';
	const who = amend ? 'המבקש/ת' : 'המתנגד/ת';
	const standingDoc = { heir: 'יורש/ת על פי דין', prior_will: 'זוכה בצוואה קודמת מיום [תאריך הצוואה הקודמת]', creditor: 'נושה', other: '[הזכות בעיזבון שבגללה הוא/היא מעוניין/ת בדבר]' }[r.standing];
	const fee = amend ? `${r.amend.registrar.amount.toLocaleString('en-US')} ₪ אצל הרשם (${r.amend.registrar.item} לתקנות האגרות של הרשם) או ${r.amend.court.amount.toLocaleString('en-US')} ₪ בבית המשפט לענייני משפחה (${r.amend.court.item})` : `${r.fee.amount.toLocaleString('en-US')} ₪ (${r.fee.item} לתקנות בית המשפט לענייני משפחה (אגרות))`;
	const L = [];
	L.push('בפני הרשם לענייני ירושה ב[מחוז]');
	L.push('בעניין: עיזבון המנוח/ה [שם מלא], ת"ז [מספר זהות], שנפטר/ה ביום [תאריך הפטירה]');
	L.push(`המבקש/ת${amend ? ' את הצו' : ''}: [שם מלא של מי שביקש/ה את הצו]`);
	L.push(`${who}: [שם מלא], ת"ז [מספר זהות], [הקשר למנוח/ה]`);
	L.push('');
	L.push(amend ? `בקשה לתיקון או לביטול ${order} (${ip.sections.amend} לחוק הירושה; ${ip.regulation_sections.amend} לתקנות הירושה)` : `כתב התנגדות למתן ${order}`);
	L.push('');
	L.push(`1. הזכות של ${who}`);
	L.push(`${who} הוא/היא ${standingDoc} של המנוח/ה, ולכן מעוניין/ת בדבר (${ip.sections.publication} לחוק הירושה; ${ip.regulation_sections.objection} לתקנות הירושה).`);
	L.push('');
	L.push(amend ? '2. העובדות שלא היו בפני הרשם' : '2. העובדות');
	if (amend) {
		L.push(`הצו ניתן ביום ${heDate(r.issued)}. העובדות והטענות שלא היו בפני הרשם כשנתן את הצו, ומתי ואיך נודעו ל${who}: [...]`);
	} else {
		L.push(`המנוח/ה נפטר/ה ביום [תאריך הפטירה]. ביום [תאריך ההגשה] הוגשה בקשה למתן ${order}, והיא פורסמה ביום ${r.published ? heDate(r.published) : '[יום הפרסום]'}. [העובדות, לפי סדר הזמנים: מצב המנוח/ה, מי טיפל בו/בה, איך נערכה הצוואה, מה היה לפניה]`);
	}
	L.push('');
	L.push('3. העילות');
	if (r.selected.length) {
		r.selected.forEach((g, i) => {
			L.push(`3.${i + 1} ${g.he} (${g.section} לחוק הירושה). ${g.hasEvidence ? `הראיות: ${g.evidence}; מצורפות כנספח.` : `הראיות שיצורפו: ${g.evidence} [להשלים לפני ההגשה].`}`);
		});
	} else {
		L.push('3.1 [העילה, עם סעיף החוק והראיות שתומכות בה]');
	}
	L.push('');
	L.push('4. הסעד המבוקש');
	if (amend) {
		L.push(`לתקן את הצו כך ש-[...], או לבטל אותו, ולהחליט בבקשה לאחר שתינתן ליורשים הרשומים בצו תשובה בתוך ${ip.days.amend_response} ימים (${ip.regulation_sections.amend}).`);
	} else if (r.filed === 'inheritance') {
		L.push(`לדחות את הבקשה למתן צו ירושה כפי שהוגשה, ולתת צו לפי רשימת היורשים וחלקיהם הנכונים (${ip.sections.orders}); ${r.selected.some((g) => g.key === 'will_exists') ? 'לקבוע שקיימת צוואה ולדון בבקשה לצו קיום צוואה' : '[או: לתקן את הבקשה בפרט ...]'}.`);
	} else {
		const onlyClause = r.selected.length && r.selected.every((g) => g.scope === 'clause');
		L.push(onlyClause
			? `לבטל את ההוראות שנגדן ההתנגדות ולקיים את שאר הצוואה (${ip.sections.partial}); ${r.standing === 'prior_will' ? `ולגבי מה שבטל, לקיים את הצוואה הקודמת מיום [...]` : '[או: לדחות את הבקשה כולה]'}.`
			: `לדחות את הבקשה למתן צו קיום צוואה${r.standing === 'prior_will' ? ', ולקיים את הצוואה הקודמת מיום [תאריך הצוואה הקודמת]' : r.standing === 'heir' ? ', ולתת צו ירושה על פי דין' : ''}.`);
	}
	L.push('');
	L.push('5. נספחים');
	const annex = ['תצהיר לאימות העובדות, מאומת בפני עורך דין', `קבלה על תשלום האגרה: ${fee}`];
	if (r.represented) { annex.push('ייפוי כוח'); }
	annex.push(r.selected.length ? `המסמכים: ${r.selected.map((g) => g.evidence).join('; ')}` : 'המסמכים שתומכים בטענות');
	if (!amend) { annex.push('אישור על המצאת ההתנגדות למבקש/ת ולשאר הנוגעים בדבר'); }
	const letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
	annex.forEach((a, i) => L.push(`${letters[i]}. ${a}`));
	L.push('');
	L.push('תאריך: [...]        חתימה: ____________');
	L.push('');
	L.push(`תצהיר לאימות העובדות: אני הח"מ [שם מלא], ת"ז [מספר זהות], מצהיר/ה כי העובדות ב${amend ? 'בקשה' : 'כתב ההתנגדות'} נכונות, זה שמי וזו חתימתי. חתימה: ____________ אימות עורך דין: [שם, מספר רישיון, תאריך]`);
	return L.join('\n');
}
