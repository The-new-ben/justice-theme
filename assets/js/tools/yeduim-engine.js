/**
 * The rights map for cohabiting partners (the family + land wave, 21.10.2026, HAD-579): the yeduim-batzibur instrument on
 * /cohabiting-couples-rights/. A ledger, line by line: what you have, and what you must prove first.
 *
 * Dependency-free ES module (plus ./dates.js). Every figure and rule comes from the registry:
 *  - fl_yeduim: Succession Law ss.55, 57(ג), 60(א), 36(א); National Insurance Law s.1 ("אשתו"), s.238 (widow and widower:
 *    a year under one roof, half a year from age 55; a child together for a widow), the Institute's 2026 survivors table
 *    and grant (under 40 without children), s.296 (the claim within 12 months; a grant within 18); the Income Tax
 *    Ordinance s.1 ("בן זוג" is married), s.9(6ו), s.40(ב) with form 101; the Family Court Law s.1(2)(א) and 1(4); the
 *    Capacity and Guardianship Law s.14; the Maintenance Law ss.2-3א; the Pension Savings Division Law s.2; the notary
 *    tariff item 6 (an affidavit); C.A. 52/80 (the presumption of sharing applies to cohabitants, with a heavier burden);
 *    the five tests of the proof meter, each named from the law or the ruling.
 *  - prenup: the family-court fee for approving an agreement (item 6א), VAT, 5620/24 (the Property Relations Law is for
 *    married couples), the gov.il approval service. yerusha: the spouse's share (s.11) and the inheritance-request fees.
 * Nothing is estimated: the survivors' grant is "36 monthly pensions" because the Institute's page names no base for it.
 */
import { addDays, addMonths, parseDate } from './dates.js';

export const QUESTIONS = ['daily', 'separation', 'death'];
export const HOMES = ['none', 'one', 'both'];
export const AGES = ['u40', '40to50', '50to55', '55to80', '80p'];
export const FAMILIES = ['kids', 'parents', 'siblings', 'none'];

const ydR2 = (n) => Math.round(n * 100) / 100;
const ydIsIso = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`))
	&& new Date(Date.parse(`${s}T00:00:00Z`)).toISOString().slice(0, 10) === s;
const ydFilled = (v) => !(v === '' || v === undefined || v === null);
const ydHeDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const ydMoney = (n) => { const v = ydR2(Number(n) || 0); return v.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }); };

/** Today's civil date in Israel; the UI passes input.today, the tests pass a fixed day. */
export function ydToday(now = new Date()) {
	try {
		return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
	} catch (e) {
		return now.toISOString().slice(0, 10);
	}
}

/** A day typed as 1.3.2019 or 2019-03-01, as ISO; '' stays ''; anything else is null (an error). */
export function ydDate(v) {
	if (!ydFilled(v)) { return ''; }
	if (ydIsIso(v)) { return v; }
	const p = parseDate(String(v));
	return p && ydIsIso(p) ? p : null;
}

/** Full calendar months from a to b (b >= a): 1.3.2019 -> 21.10.2026 = 91 (7 years, 7 months). */
export function monthsBetween(a, b) {
	const [ay, am, ad] = a.split('-').map(Number);
	const [by, bm, bd] = b.split('-').map(Number);
	return Math.max(0, (by - ay) * 12 + (bm - am) - (bd < ad ? 1 : 0));
}

/** The last day of the month that is n months after the month of iso. */
export function lastDayOfMonthAfter(iso, n) {
	const [y, m] = iso.split('-').map(Number);
	const total = y * 12 + (m - 1) + n + 1;
	const last = new Date(Date.UTC(Math.floor(total / 12), total % 12, 0));
	return last.toISOString().slice(0, 10);
}

const ydFrac = (f) => {
	const [n, d] = f;
	if (n === 1 && d === 2) { return 'מחצית'; }
	if (n === 2 && d === 3) { return 'שני שלישים'; }
	return `${n}/${d}`;
};

/** What the surviving partner takes under s.55: the share of a married spouse under s.11 (yerusha). */
export function shareOf(reg, family) {
	const y = reg.yerusha;
	if (family === 'none') { return { key: 'all', frac: [1, 1], he: 'כל העיזבון', section: y.sections.spouse_all, url: y.law_url }; }
	if (family === 'siblings') { return { key: 'two_thirds', frac: y.spouse_two_thirds, he: `${ydFrac(y.spouse_two_thirds)} מהעיזבון, ועוד המיטלטלין של משק הבית והמכונית`, section: `${y.sections.spouse}(2)`, url: y.law_url }; }
	return { key: 'half', frac: y.spouse_half, he: `${ydFrac(y.spouse_half)} מהעיזבון, ועוד המיטלטלין של משק הבית והמכונית`, section: `${y.sections.spouse}(1)`, url: y.law_url };
}

/** The survivors' pension row of the Institute's 2026 table for an age band and the number of children. */
export function survivorsRow(fy, age, kids) {
	const s = fy.nii.survivors;
	const a = s.amounts;
	if (kids >= 1) {
		const amount = kids === 1 ? a.kid1 : a.kid2 + (kids - 2) * a.kid_extra;
		return { key: `kids${kids}`, grant: false, amount, he: kids === 1 ? 'עם ילד אחד' : kids === 2 ? 'עם שני ילדים' : `עם ${kids} ילדים (ועוד ${ydMoney(a.kid_extra)} ₪ לכל ילד נוסף)` };
	}
	if (age === 'u40') { return { key: 'grant', grant: true, amount: null, pensions: s.grant_pensions, he: `מתחת לגיל ${s.grant_under_age} בלי ילדים` }; }
	if (age === '40to50') { return { key: 'age40to50', grant: false, amount: a.age40to50, he: 'בגיל 40 עד 50, בלי ילדים' }; }
	if (age === '80p') { return { key: 'age80plus', grant: false, amount: a.age80plus, he: 'בגיל 80 ומעלה' }; }
	return { key: 'age50plus', grant: false, amount: a.age50plus, he: 'בגיל 50 ומעלה, בלי ילדים' };
}

/** The notary's fee for one affidavit signed by both partners (item 6(א)+(ב)), with VAT. */
export function affidavitCost(reg) {
	const n = reg.fl_yeduim.notary;
	const vatPct = reg.prenup.vat.pct;
	const base = n.affidavit_first + n.affidavit_additional;
	return { base, vatPct, vat: ydR2(base * vatPct / 100), total: ydR2(base * (100 + vatPct) / 100) };
}

/** The five tests of the proof meter: met / open / not / na, each from the inputs only. */
export function proofTests(reg, i) {
	const fy = reg.fl_yeduim;
	const s = fy.nii.survivors;
	const out = [];
	for (const t of fy.tests) {
		let state = 'open';
		let note = '';
		if (t.key === 'family') {
			state = i.kids > 0 ? 'met' : 'open';
			note = i.kids > 0 ? 'יש לכם ילד משותף' : 'מוכיחים בעדויות ובמסמכים: הופעה יחד כבני זוג, אירועים, תמונות';
		} else if (t.key === 'household') {
			state = i.household ? 'met' : 'not';
			note = i.household ? 'סימנתם שאתם גרים יחד ומנהלים משק בית משותף' : 'סימנתם שאתם לא גרים יחד';
		} else if (t.key === 'single') {
			state = i.married ? 'not' : 'met';
			note = i.married ? 'אחד מכם עדיין נשוי לאחר' : 'אף אחד מכם לא נשוי לאחר';
		} else if (t.key === 'roof') {
			if (!i.household) { state = 'not'; note = 'צריך מגורים תחת קורת גג אחת'; } else if (i.months >= i.minMonths) { state = 'met'; note = `${i.months} חודשים יחד, יותר מ-${i.minMonths}`; } else if (i.kids > 0) { state = 'open'; note = `${i.months} חודשים יחד, פחות מ-${i.minMonths}; הילד המשותף מספיק לאלמנה, לא לאלמן`; } else { state = 'not'; note = `${i.months} חודשים יחד, פחות מ-${i.minMonths}${i.minMonths === s.min_months ? ` (מגיל ${s.older_age}: ${s.min_months_older})` : ''}`; }
		} else if (t.key === 'sharing') {
			state = i.home === 'both' ? 'met' : i.home === 'one' ? 'open' : 'na';
			note = i.home === 'both' ? 'הדירה רשומה על שניכם' : i.home === 'one' ? 'הדירה רשומה על אחד מכם: צריך להוכיח כוונה לשתף בה' : 'אין דירה: המבחן לא נבדק כאן';
		}
		out.push({ key: t.key, he: t.he, why: t.why_he, section: t.section, url: t.url, state, note });
	}
	return out;
}

const FOCUS = {
	daily: ['nii', 'inherit', 'survivors', 'agreement', 'children', 'tax', 'property', 'home', 'pension'],
	separation: ['property', 'home', 'property_law', 'pension_split', 'spousal', 'children', 'agreement', 'court', 'inherit'],
	death: ['inherit', 'survivors', 'estate_maint', 'pension', 'home', 'property', 'children', 'tax'],
};

/**
 * input = { question ('daily'|'separation'|'death'), since (the day you started living together), household (bool),
 *           kids (0-3, 3 = three or more), married (bool: one of you is still married to someone else), home ('none'|'one'|
 *           'both': the apartment is registered to one of you or both), age, family, died (death only), remind (a day for
 *           the documents reminder), today }
 */
export function compute(registry, input) {
	const fy = registry.fl_yeduim;
	const pn = registry.prenup;
	const y = registry.yerusha;
	const errors = [];
	const today = ydIsIso(input.today) ? input.today : ydToday();
	const question = QUESTIONS.includes(input.question) ? input.question : 'daily';
	const since = ydDate(input.since);
	if (!since) { errors.push({ field: 'since', he: 'ממתי אתם גרים יחד: תאריך כמו 1.3.2019' }); } else if (since > today) { errors.push({ field: 'since', he: 'תאריך תחילת החיים המשותפים לא יכול להיות אחרי היום' }); } else if (since < '1930-01-01') { errors.push({ field: 'since', he: 'תאריך תחילת החיים המשותפים: מ-1930 והלאה' }); }
	const kids = Number(input.kids);
	if (!(Number.isInteger(kids) && kids >= 0 && kids <= 3)) { errors.push({ field: 'kids', he: 'ילדים משותפים: 0 עד 3 ומעלה' }); }
	const home = HOMES.includes(input.home) ? input.home : 'none';
	const age = AGES.includes(input.age) ? input.age : '40to50';
	const household = input.household !== false;
	const married = input.married === true;
	const family = FAMILIES.includes(input.family) ? input.family : (kids > 0 ? 'kids' : 'parents');
	let died = '';
	if (question === 'death') {
		died = ydDate(input.died);
		if (died === null) { errors.push({ field: 'died', he: 'יום הפטירה: תאריך כמו 10.5.2026, או להשאיר ריק' }); } else if (died && since && died < since) { errors.push({ field: 'died', he: 'יום הפטירה לא יכול להיות לפני תחילת החיים המשותפים' }); } else if (died && died > today) { errors.push({ field: 'died', he: 'יום הפטירה לא יכול להיות אחרי היום' }); }
	}
	let remind = ydDate(input.remind);
	if (remind === null) { errors.push({ field: 'remind', he: 'יום התזכורת: תאריך כמו 15.11.2026, או להשאיר ריק' }); } else if (remind && remind < today) { errors.push({ field: 'remind', he: 'יום התזכורת: היום או אחריו' }); }
	if (errors.length) { return { ok: false, errors }; }

	const s = fy.nii.survivors;
	const end = died || today;
	const months = monthsBetween(since, end);
	const older = question === 'death' && (age === '55to80' || age === '80p');
	const minMonths = older ? s.min_months_older : s.min_months;
	const ctx = { kids, household, married, home, months, minMonths };
	const tests = proofTests(registry, ctx);
	const applicable = tests.filter((t) => t.state !== 'na').length;
	const met = tests.filter((t) => t.state === 'met').length;
	const flags = [];

	const court = pn.routes.court;
	const vatPct = pn.vat.pct;
	const aff = affidavitCost(registry);
	const order = { fee: y.fees.order_fee, online: y.payments.online_fee, publication: y.payments.publication, from: y.fees.from };
	const caseOf = (key) => (pn.cases || []).find((c) => c.key === key) || {};
	const c5620 = caseOf('5620_24');
	const sc = fy.succession;
	const pr = fy.property;
	const tx = fy.tax;
	const ch = fy.children;
	const separated = question === 'separation';
	const lines = [];
	const add = (l) => lines.push(Object.assign({ cites: [], amount: null }, l));

	// 1. Inheritance without a will (Succession Law s.55, the share of s.11).
	if (married) {
		add({ key: 'inherit', topic: 'ירושה בלי צוואה', state: 'no', have: `סעיף 55 לא חל: הוא דורש שאף אחד מכם לא היה נשוי לאחר בשעת המוות. בלי צוואה, בן הזוג שנשאר לא יורש.`, prove: 'צוואה שבה אתם מורישים זה לזה, בצורה שהחוק מכיר.', cites: [{ text: sc.s55, url: sc.url }] });
	} else if (separated) {
		add({ key: 'inherit', topic: 'ירושה בלי צוואה', state: 'no', have: 'אחרי פרידה אתם כבר לא חיים במשק בית משותף, ולכן סעיף 55 לא יחול אם אחד מכם ימות.', prove: `${sc.revoke_he}.`, cites: [{ text: sc.s55, url: sc.url }, { text: sc.revoke, url: sc.url }] });
	} else {
		const share = shareOf(registry, family);
		const general = `${ydFrac(y.spouse_half)} כשיש ילדים או הורים, ${ydFrac(y.spouse_two_thirds)} כשיש רק אחים או סבים, וכל העיזבון כשאין אף אחד מהם; ועוד המיטלטלין של הבית והמכונית`;
		add({
			key: 'inherit', topic: 'ירושה בלי צוואה', state: 'prove',
			have: question === 'death' ? `כמו בן זוג נשוי: ${share.he}.` : `כמו בן זוג נשוי: ${general}.`,
			prove: `חיי משפחה במשק בית משותף, ושאף אחד מכם לא היה נשוי לאחר בשעת המוות. צוואה עם הוראה אחרת גוברת. הבקשה לרשם לענייני ירושה: ${ydMoney(order.fee)} ₪ (${ydMoney(order.online)} במקוון) ועוד ${ydMoney(order.publication)} ₪ פרסום.`,
			cites: [{ text: sc.s55, url: sc.url }, { text: question === 'death' ? share.section : y.sections.spouse, url: y.law_url }, { text: y.fees.section, url: y.fees.url }],
			amount: order.online,
		});
		if (question === 'death' && family === 'siblings') { flags.push({ code: 'apartment', level: 'info', he: sc.apartment_years_he }); }
	}
	// 2. Maintenance from the estate (s.57(ג)), with the deadline of s.60(א).
	if (married || separated) {
		add({ key: 'estate_maint', topic: 'מזונות מן העיזבון', state: 'no', have: married ? 'לא חל: גם כאן התנאי הוא שאף אחד מכם לא היה נשוי לאחר בשעת המוות.' : 'אחרי פרידה: לא חל, כי כבר אינכם חיים במשק בית משותף.', prove: '—', cites: [{ text: sc.s57c, url: sc.url }] });
	} else {
		add({ key: 'estate_maint', topic: 'מזונות מן העיזבון', state: 'prove', have: `${sc.s57c_he}.`, prove: `שאתם זקוקים למזונות. ${sc.s59_he}. ${sc.maint_deadline_he}.`, cites: [{ text: sc.s57c, url: sc.url }, { text: sc.s60, url: sc.url }] });
	}
	// 3. National Insurance: recognized cohabitants are married for its rights and duties (s.1, the Institute's page).
	const nii = fy.nii;
	if (household) {
		add({ key: 'nii', topic: 'ביטוח לאומי: המעמד', state: 'prove', have: `${nii.status_he}.`, prove: `${nii.form_107_he}. ${nii.report_he}.`, cites: [{ text: nii.def_section, url: nii.def_url }, { text: 'ידועים בציבור, המוסד', url: nii.page_url }, { text: `שאלון ${nii.form_107}`, url: nii.form_107_page }] });
	} else {
		add({ key: 'nii', topic: 'ביטוח לאומי: המעמד', state: 'no', have: 'בלי מגורים משותפים הביטוח הלאומי לא רואה אתכם כבני זוג: ההגדרה כוללת ידועה בציבור "והיא גרה עמו".', prove: '—', cites: [{ text: nii.def_section, url: nii.def_url }] });
	}
	// 4. The survivors' pension (s.238 with the Institute's 2026 table).
	const row = survivorsRow(fy, question === 'death' ? age : '40to50', kids);
	const amountText = row.grant ? `מענק חד-פעמי של ${row.pensions} קצבאות חודשיות, במקום קצבה` : `${ydMoney(row.amount)} ₪ בחודש (${row.he}, מ-${ydHeDate(s.amounts_from)})`;
	let survState = 'prove';
	let survHave = '';
	if (separated) {
		survState = 'no';
		survHave = 'אחרי הפרידה אתם כבר לא בני זוג לעניין הביטוח הלאומי: ההגדרה דורשת מגורים יחד.';
	} else if (!household) {
		survState = 'no';
		survHave = 'בלי מגורים תחת קורת גג אחת אין קצבת שארים לבן זוג שלא היה נשוי.';
	} else if (months < minMonths && kids === 0) {
		survState = 'no';
		survHave = `פחות מ-${minMonths} חודשים יחד (${months} חודשים) ואין ילד משותף: לפי סעיף 238 זה לא מספיק.`;
	} else if (question === 'death') {
		survHave = `קצבת שארים כמו לאלמן או לאלמנה: ${amountText}. ${s.supplements_he}.`;
	} else {
		survHave = `אם אחד מכם ימות: קצבת שארים כמו לאלמן או לאלמנה, ${kids > 0 ? `${ydMoney(row.amount)} ₪ בחודש ${row.he}` : `${ydMoney(s.amounts.age40to50)} עד ${ydMoney(s.amounts.age80plus)} ₪ בחודש לפי הגיל, ומתחת לגיל ${s.grant_under_age} מענק`} (מ-${ydHeDate(s.amounts_from)}).`;
	}
	if (survState === 'prove' && months < minMonths) { survHave += ` ${s.widow_child_he}; אלמן צריך ${minMonths} חודשים.`; }
	add({
		key: 'survivors', topic: 'קצבת שארים מהביטוח הלאומי', state: survState, have: survHave,
		prove: survState === 'no' ? '—' : `מגורים תחת קורת גג אחת לפחות ${s.min_months} חודשים עד הפטירה (מגיל ${s.older_age}: ${s.min_months_older}). ${nii.form_112_he} (שאלון ${nii.form_112}). אלמן בלי ילד: רק אם ההכנסות שלו עד ${ydMoney(s.widower_income_cap)} ₪ בחודש.`,
		cites: [{ text: s.section, url: s.url }, { text: 'אלמנה', url: s.widow_url }, { text: 'אלמן', url: s.widower_url }, { text: 'סכומי הקצבה', url: s.amounts_url }].concat(row.grant ? [{ text: 'מענק שאירים', url: s.grant_url }] : []),
		amount: survState === 'no' || row.grant ? null : row.amount,
	});
	if (question === 'death' && married) { flags.push({ code: 'several', level: 'info', he: `${s.several_he}.` }); }
	// 5. Pension funds: by the fund's rules; the tax exemption counts a cohabitant (s.9(6ו)).
	add({ key: 'pension', topic: 'קצבת שארים מקרן פנסיה', state: separated ? 'no' : 'prove', have: separated ? 'אחרי הפרידה הזכות תלויה בתקנון הקרן. אם רשמתם זה את זה כמוטבים, השינוי בידיים שלכם.' : `אפשרית. ${tx.survivors_he}.`, prove: separated ? '—' : `${fy.pension.fund_he}.`, cites: [{ text: tx.survivors_section, url: tx.url }] });
	// 6. Income tax: separate assessment; the single-parent point; the family unit for the home exemption.
	add({ key: 'tax', topic: 'מס הכנסה', state: 'info', have: `${tx.spouse_he}.`, prove: `${tx.single_parent_he} (${tx.form101_item}).${home !== 'none' ? ` ${tx.family_unit_he} (${tx.guide_he}, עמוד ${tx.guide_page}).` : ''}`, cites: [{ text: tx.spouse_section, url: tx.url }, { text: tx.single_parent_section, url: tx.url }, { text: 'טופס 101', url: tx.form101_url }].concat(home !== 'none' ? [{ text: `המדריך, עמוד ${tx.guide_page}`, url: tx.guide_url }] : []) });
	// 7. Children: the same law as married parents.
	if (kids > 0) {
		add({ key: 'children', topic: 'הילדים', state: 'have', have: `${ch.guardian_he}. ${ch.support_he}.`, prove: `אבהות: אם האב לא רשום, תובענה לאבהות בבית המשפט לענייני משפחה (${fy.family_court.law_he}, ${fy.family_court.paternity_section}).${separated ? ` ${nii.alimony_he}.` : ''}`, cites: [{ text: ch.guardian_section, url: ch.capacity_url }, { text: ch.maint_section, url: ch.maint_url }, { text: fy.family_court.paternity_section, url: fy.family_court.url }].concat(separated ? [{ text: 'שיעורי המזונות, המוסד', url: nii.alimony_url }] : []) });
	} else {
		add({ key: 'children', topic: 'הילדים', state: 'info', have: `אין לכם ילדים משותפים. לילד שייוולד: ${ch.guardian_he}.`, prove: '—', cites: [{ text: ch.guardian_section, url: ch.capacity_url }] });
	}
	// 8. The Property Relations Law does not apply (5620/24 via prenup.cohab_he).
	add({ key: 'property_law', topic: 'חוק יחסי ממון ואיזון משאבים', state: 'no', have: 'לא חל עליכם: החוק ואיזון המשאבים שבו הם לנשואים. אין חלוקה אוטומטית חצי-חצי של מה שצברתם.', prove: '—', cites: [{ text: c5620.he ? `${c5620.he}, פסקה 20` : 'חוק יחסי ממון', url: c5620.url || pn.law_url }, { text: 'חוק יחסי ממון', url: pr.law_url }] });
	// 9. The presumption of sharing (C.A. 52/80).
	add({ key: 'property', topic: 'רכוש שנצבר יחד', state: 'prove', have: `${pr.applies_he}.`, prove: `${pr.test_he}. ${pr.burden_he}.`, cites: [{ text: `ע"א 52/80, ${pr.applies_para}`, url: pr.ruling_url }, { text: pr.test_para, url: pr.ruling_url }, { text: pr.burden_para, url: pr.ruling_url }] });
	// 10. The apartment, by registration.
	if (home === 'both') {
		add({ key: 'home', topic: 'הדירה', state: 'have', have: 'רשומה על שניכם: שניכם בעלים בה, לפי החלקים שברישום.', prove: `מי שטוען לחלוקה אחרת מהרישום צריך להוכיח הסכמה אחרת: ${pr.fact_he}.`, cites: [{ text: `ע"א 52/80, ${pr.fact_para}`, url: pr.ruling_url }] });
	} else if (home === 'one') {
		add({ key: 'home', topic: 'הדירה', state: 'prove', have: 'רשומה על אחד מכם. השני יכול לקבל בה חלק רק אם יוכיח כוונה לשתף בדירה.', prove: `${pr.test_he}. ${pr.later_he}.`, cites: [{ text: `ע"א 52/80, ${pr.test_para}`, url: pr.ruling_url }, { text: pr.later_para, url: pr.ruling_url }] });
	}
	// 11. A cohabitation agreement: an ordinary contract; approval at the family court (prenup), the notary's affidavit.
	add({ key: 'agreement', topic: 'הסכם חיים משותפים', state: 'have', have: 'אפשר לחתום הסכם שקובע מה של מי, ומה קורה בפרידה ובפטירה. זה חוזה רגיל, לא הסכם ממון לפי חוק יחסי ממון.', prove: `אישור בבית המשפט לענייני משפחה: אגרה ${ydMoney(court.fee)} ₪ (${court.fee_item}). פסק דין שמחייב אישור כזה לא מצאנו. תצהיר משותף אצל נוטריון: ${ydMoney(fy.notary.affidavit_first)} ועוד ${ydMoney(fy.notary.affidavit_additional)} ₪ ומע"מ ${vatPct}%, ${ydMoney(aff.total)} ₪.`, cites: [{ text: court.fee_item, url: court.fee_url }, { text: fy.notary.item, url: fy.notary.url }, { text: fy.family_court.section, url: fy.family_court.url }], amount: aff.total });
	// 12. Separation: no spousal maintenance by law; the pension split law applies; the family court.
	add({ key: 'spousal', topic: 'מזונות בין בני הזוג', state: 'no', have: `${fy.spousal.he}.`, prove: 'הסכם ביניכם, אם יש.', cites: [{ text: fy.spousal.section, url: fy.spousal.url }] });
	add({ key: 'pension_split', topic: 'חיסכון פנסיוני בפרידה', state: 'prove', have: `${fy.pension.split_rule_he}.`, prove: 'פסק דין לחלוקה, וההכרה בכם כבני זוג.', cites: [{ text: fy.pension.split_section, url: fy.pension.split_url }] });
	add({ key: 'court', topic: 'איפה מתדיינים', state: 'info', have: `${fy.family_court.he}.`, prove: '—', cites: [{ text: fy.family_court.section, url: fy.family_court.url }] });

	// Focus: the lines of the question first, the rest below.
	const order1 = FOCUS[question];
	lines.forEach((l) => { l.focus = order1.includes(l.key); l.rank = l.focus ? order1.indexOf(l.key) : 100 + lines.indexOf(l); });
	lines.sort((a, b) => a.rank - b.rank);
	const count = (st) => lines.filter((l) => l.focus && l.state === st).length;

	// Dates: the Institute's claim window after a death (s.296); otherwise one reminder on the day the reader picks.
	const deadlines = [];
	const claim = nii.claim;
	if (question === 'death' && died && survState !== 'no') {
		if (row.grant) {
			const last = lastDayOfMonthAfter(died, claim.grant_months - 1);
			deadlines.push({ date: last, kind: 'law', he: `מענק שאירים: התביעה לפני שחלפו ${claim.grant_months} חודשים מחודש הפטירה`, section: claim.late_section, url: claim.url });
		} else {
			const last = addMonths(died, claim.months);
			deadlines.push({ date: last, kind: 'law', he: `תביעה לקצבת שארים: ${claim.months} חודשים מיום הפטירה. תביעה מאוחרת משולמת רק על ${claim.late_back_months} החודשים שלפני ההגשה`, section: `${claim.section}, ${claim.late_section}`, url: claim.url });
		}
		deadlines.forEach((d) => { if (d.date < today) { flags.push({ code: 'late', level: 'warn', he: `המועד ${ydHeDate(d.date)} עבר. אפשר עדיין להגיש, אבל ${row.grant ? 'המענק לא ישולם' : `הקצבה תשולם רק על ${claim.late_back_months} החודשים שלפני החודש שבו מגישים`} (${claim.late_section}).` }); } });
	}
	if (!deadlines.length) {
		const day = remind || addDays(today, 30);
		deadlines.push({ date: day, kind: 'reminder', he: 'להכין את המסמכים שמוכיחים את החיים המשותפים (רשימת שאלון 107)', section: nii.documents_section, url: nii.form_107_page, picked: Boolean(remind) });
	}
	if (question === 'death' && !died) { flags.push({ code: 'died', level: 'info', he: 'כשתזינו את יום הפטירה, הכלי יחשב את המועד האחרון לתביעה בביטוח הלאומי.' }); }
	if (!household) { flags.push({ code: 'apart', level: 'warn', he: 'בלי מגורים משותפים קשה להוכיח שאתם ידועים בציבור: גם החוק וגם הביטוח הלאומי מדברים על משק בית משותף.' }); }
	if (!married && question !== 'separation') { flags.push({ code: 'same_sex', level: 'info', he: `${sc.text_he}.` }); }
	if (question === 'death') { flags.push({ code: 'maint_deadline', level: 'info', he: `${sc.maint_deadline_he} (${sc.s60}).` }); }

	const docs = nii.documents_he.slice();
	if (question === 'death') { docs.unshift(`${nii.form_112_he} (שאלון ${nii.form_112}), ותביעה לקצבת שארים`); }

	return {
		ok: true, question, since, today, end, died, remind: remind || '', months, years: Math.floor(months / 12), monthsRem: months % 12,
		household, kids, married, home, age, family, older, minMonths,
		tests, met, applicable, lines, flags, deadlines, docs,
		have: count('have'), prove: count('prove'), no: count('no'),
		survivors: { state: survState, row, amount: survState === 'no' || row.grant ? null : row.amount },
		costs: { affidavit: aff, court: { fee: court.fee, item: court.fee_item, url: court.fee_url }, order, vatPct },
		rehearse: { topic: 'family-law', purpose: separated ? 'mediation' : 'court_rehearsal' },
	};
}
