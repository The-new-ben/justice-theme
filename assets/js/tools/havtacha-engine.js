/**
 * The rights wave 2B (21.10.2026): income support (הבטחת הכנסה), from the eligibility gates to the benefit, line by line.
 *
 * Dependency-free ES module (dates.js only). Every number comes from registry.rights_havtacha (the National Insurance
 * Institute's income-support pages, the Income Support Law, 1980 and its 1982 regulations, read on its checked_on date),
 * registry.rights_btl (basic amount 3, the income-support point of basic amount 2, the average wage of section 2) and
 * registry.rights_tax (the credit point of the year, for the alternative of regulation 9):
 *  - The gates: Israeli residence 24 months in a row (s.2(ב)); from 20, from 18 in special circumstances, a parent at any
 *    age (s.2, regulation 1א); the employment test of the claimant and the spouse (ss.2(א), 4); the exclusions of s.3
 *    (students, yeshiva, kibbutz, regular army service); the car (s.9א, regulations 10(ג), 10ב); the assets (s.9(ג)); the
 *    income test (s.5(ב)). From the retirement age the route is the old-age pension's income supplement (s.5(א)(1)).
 *  - The full benefit: the second schedule's percentage of basic amount 3 by family, column B under 55 and column C from
 *    55 (s.5(א)(2)); a single parent from 55 less the income-support point; 80% at 20-24 for those who report to the
 *    employment service (s.5(ה)(3), the Institute's 2026 table); 7.95% for a woman born 1960-1964 from 62 (s.5(ז)).
 *  - The countable income: work income (and wage-replacing benefits) less a first disregard of 5%/7% of the average wage
 *    under 55 (13%/17% from 55), shared with an occupational pension (s.12(ב), regulation 12); then 70%, 67.5% or 62.5% of
 *    the rest under 55 (the third schedule), 60% from 55, and for a single parent 25% of the part up to 33.81% of the
 *    average wage and 60% above it (s.12(א)(2)); other income in full (s.9). The benefit is the full amount less the
 *    countable income (s.5(ב)); from 55 (a single person, or a couple both over 55) not above the determining amount less
 *    the whole income (s.7, regulation 9); less 3% of the car's value above the credit (regulation 10(ג)); nothing below
 *    6 shekels (s.8).
 *  - The clock: paid from the month of the claim, no retroactive months (s.14(א)), on the 12th for the month before; 45
 *    days for a hearing; 12 months to appeal to the regional labour court.
 */

import { addDays, addMonths, parseDate } from './dates.js';

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const heDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const shekels = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
/** 'YYYY-MM' -> 'נובמבר 2026'. */
export function monthHe(ym) { return ym ? `${MONTHS_HE[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}` : ''; }
export const FAMS = ['single', 'couple', 'parent'];
export const EMPS = ['registered', 'fulltime', 'exempt', 'none'];
export const CARS = ['none', 'one', 'two'];
export const EXCLS = ['none', 'student', 'yeshiva', 'kibbutz', 'army'];
export const RESS = ['yes', 'new'];

/** To the nearest shekel, a half up: the Institute's own example (922.75 + 87 = 1,009.75 -> 1,010). */
export function roundShekel(x) { return Math.floor(x + 0.5 + 1e-9); }

/** The family's line in the second schedule. */
export function kindOf(fam, kids) {
	if (fam === 'couple') { return kids >= 2 ? 'couple2' : kids === 1 ? 'couple1' : 'couple'; }
	if (fam === 'parent') { return kids >= 2 ? 'parent2' : 'parent1'; }
	return 'single';
}

/** 'YYYY-MM' plus n months. */
export function addYm(ym, n) {
	const [y, m] = ym.split('-').map(Number);
	const t = y * 12 + (m - 1) + n;
	return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
}

/** The month a woman born in `born` (YYYY-MM) reaches the retirement age, by the Institute's table; null outside it. */
export function womenRetirementYm(hv, born) {
	const row = hv.age.women_retirement.find((x) => born >= x[0] && (x[1] === null || born <= x[1]));
	return row ? { ym: addYm(born, row[2] * 12 + row[3]), years: row[2], months: row[3] } : null;
}

/** The determining amount of s.7 and regulation 9 (from 55): the higher of the percentage of the average wage and the
 * credit points of the regulation times the credit point of the year. */
export function determining(reg, kind, spouseWorks) {
	const rule = reg.rights_havtacha.determining.rules[kind];
	if (!rule) { return null; }
	const avg = reg.rights_btl.avg_wage.s2_benefits;
	const tax = reg.rights_tax;
	const point = tax && tax.years && tax.years[String(tax.current_year)] ? tax.years[String(tax.current_year)].point_month : 0;
	const pct = rule.pct + rule.uplift;
	const byWage = avg * pct / 100;
	const points = spouseWorks ? rule.points_working : rule.points;
	const byPoints = points * point;
	return { kind, pct, byWage, points, point, byPoints, amount: Math.max(byWage, byPoints) };
}

/**
 * The benefit at a work income, after every rule of the law (ss.5(ב), 7, 8, 12, 12א, regulation 10(ג)).
 * o = { kind, col ('b'|'c'), young (bool), women (bool), work (the family's work income), pension, other,
 *       det (the determining amount or null), car ({ value, deduct } or null) }
 */
export function benefitAt(reg, o) {
	const hv = reg.rights_havtacha;
	const avg = reg.rights_btl.avg_wage.s2_benefits;
	const wk = hv.work;
	const famKey = o.kind === 'single' ? 'single' : 'family';
	const parent = o.kind.startsWith('parent');
	const base = o.young ? hv.amounts.young[o.kind] : hv.amounts[o.col][o.kind];
	const full = base + (o.women ? hv.women.amount : 0);
	const first = wk.first[o.col][famKey];
	const W = Math.max(0, Number(o.work) || 0);
	const Pn = Math.max(0, Number(o.pension) || 0);
	const O = Math.max(0, Number(o.other) || 0);
	const dP = Math.min(Pn, first);
	const dW = Math.min(W, first - dP);
	const parts = [];
	let counted = 0;
	if (parent) {
		const band = wk.parent.band;
		const low = Math.max(0, Math.min(W, band) - dW);
		const high = Math.max(0, W - band);
		parts.push({ key: 'low', base: low, pct: wk.parent.low_pct, amt: low * wk.parent.low_pct / 100 });
		if (high > 0) { parts.push({ key: 'high', base: high, pct: wk.parent.high_pct, amt: high * wk.parent.high_pct / 100 }); }
	} else {
		const p = o.col === 'c' ? wk.counted_pct.c : wk.counted_pct.b[o.kind];
		parts.push({ key: 'rest', base: W - dW, pct: p, amt: (W - dW) * p / 100 });
	}
	counted = parts.reduce((a, x) => a + x.amt, 0);
	const workCounted = roundShekel(counted);
	const pensionCounted = Pn - dP;
	const income = workCounted + pensionCounted + O;
	const before = full - income;
	let pay = before;
	let cap = null;
	let capBinds = false;
	if (o.det) {
		cap = o.det - (W + Pn + O);
		if (cap < pay) { pay = cap; capBinds = true; }
	}
	let carDed = 0;
	let credit = 0;
	const worker = W > avg * hv.car.worker_pct / 100;
	if (o.car && o.car.deduct && o.car.value > 0) {
		credit = worker ? hv.car.credit_worker : hv.car.credit_other;
		carDed = roundShekel(Math.max(0, o.car.value - credit) * hv.car.rate_pct / 100);
		pay -= carDed;
	}
	pay = Math.max(0, roundShekel(pay));
	const belowMin = pay > 0 && pay < hv.min_pay;
	if (belowMin) { pay = 0; }
	return { kind: o.kind, col: o.col, young: Boolean(o.young), women: Boolean(o.women), base, full, first, dP, dW, parts, counted: r2(counted), workCounted, pensionCounted, other: O, income, before, cap: cap === null ? null : r2(cap), capBinds, worker, credit, carDed, pay, belowMin, work: W, pension: Pn };
}

/** Of every extra 100 shekels of work just above `w`, how many stay with the family (the law's own reduction only). */
export function keepAt(reg, o, w) {
	const x = benefitAt(reg, Object.assign({}, o, { work: w }));
	if (x.pay === 0) { return 100; }
	if (x.capBinds) { return 0; }
	if (w < x.first - x.dP) { return 100; }
	const wk = reg.rights_havtacha.work;
	if (o.kind.startsWith('parent')) { return 100 - (w < wk.parent.band ? wk.parent.low_pct : wk.parent.high_pct); }
	return 100 - x.parts[0].pct;
}

/** The first whole-shekel work income from which nothing is paid. */
export function endWork(reg, o) {
	const at = (w) => benefitAt(reg, Object.assign({}, o, { work: w })).pay;
	if (at(0) === 0) { return 0; }
	const avg = reg.rights_btl.avg_wage.s2_benefits;
	const a = Math.floor(avg * reg.rights_havtacha.car.worker_pct / 100) + 1;
	let lo;
	let hi;
	if (at(a) > 0) { lo = a; hi = 200000; } else { lo = 0; hi = a; }
	while (hi - lo > 1) {
		const mid = Math.floor((lo + hi) / 2);
		if (at(mid) === 0) { hi = mid; } else { lo = mid; }
	}
	return hi;
}

/** The work income from which the determining amount of s.7 caps the benefit (cap = the benefit by s.12), exact. */
export function capFrom(reg, o) {
	if (!o.det) { return null; }
	let lo = 0;
	let hi = o.det;
	const binds = (w) => benefitAt(reg, Object.assign({}, o, { work: w, car: null })).capBinds;
	if (!binds(hi)) { return null; }
	if (binds(lo)) { return 0; }
	while (hi - lo > 1) { const mid = Math.floor((lo + hi) / 2); if (binds(mid)) { hi = mid; } else { lo = mid; } }
	return hi;
}

function ymOk(v) { return /^\d{4}-\d{2}$/.test(v) && Number(v.slice(5)) >= 1 && Number(v.slice(5)) <= 12; }

/**
 * input = { fam ('single'|'couple'|'parent'), kids (0..15), age, sex ('m'|'f'|''), born (YYYY-MM, optional), spouseAge,
 *           emp, spouseEmp ('registered'|'fulltime'|'exempt'|'none'), work, spouseWork (monthly gross, wage-replacing
 *           benefits included), pension (occupational, the family), other (the family's other income), car ('none'|'one'|
 *           'two'), carValue, carEx (an exception of s.9א(ג)), savings, realty (another property), res ('yes'|'new'),
 *           excl ('none'|'student'|'yeshiva'|'kibbutz'|'army'), month (the claim month, YYYY-MM), decision (the day the
 *           Institute's decision arrived), hearing (the day a hearing notice arrived) }
 */
export function compute(registry, input) {
	const hv = registry.rights_havtacha;
	const btl = registry.rights_btl;
	const errors = [];
	const fam = FAMS.includes(input.fam) ? input.fam : null;
	if (!fam) { errors.push({ field: 'fam', he: 'בחרו את הרכב המשפחה' }); }
	let kids = blank(input.kids) ? 0 : Number(input.kids);
	if (!(Number.isInteger(kids) && kids >= 0 && kids <= 15)) { errors.push({ field: 'kids', he: 'מספר הילדים: 0 עד 15' }); kids = -1; }
	if (fam === 'single') { kids = 0; }
	if (fam === 'parent' && kids === 0) { errors.push({ field: 'kids', he: 'הורה יחיד: לפחות ילד אחד' }); }
	const age = blank(input.age) ? NaN : Number(input.age);
	if (!(Number.isInteger(age) && age >= 14 && age <= 120)) { errors.push({ field: 'age', he: 'הגיל: מספר שלם בשנים' }); }
	const sex = input.sex === 'f' || input.sex === 'm' ? input.sex : '';
	const born = blank(input.born) ? '' : String(input.born);
	if (born && !(ymOk(born) && born >= '1900-01' && born <= '2026-12')) { errors.push({ field: 'born', he: 'חודש הלידה: חודש ושנה, לדוגמה 3.1964' }); }
	const couple = fam === 'couple';
	const spouseAge = couple && !blank(input.spouseAge) ? Number(input.spouseAge) : NaN;
	if (couple && !(Number.isInteger(spouseAge) && spouseAge >= 14 && spouseAge <= 120)) { errors.push({ field: 'spouseAge', he: 'הגיל של בן או בת הזוג: מספר שלם' }); }
	const emp = EMPS.includes(input.emp) ? input.emp : null;
	if (!emp) { errors.push({ field: 'emp', he: 'בחרו את המצב מול שירות התעסוקה' }); }
	const spouseEmp = couple ? (EMPS.includes(input.spouseEmp) ? input.spouseEmp : null) : null;
	if (couple && !spouseEmp) { errors.push({ field: 'spouseEmp', he: 'בחרו את המצב של בן או בת הזוג מול שירות התעסוקה' }); }
	const cash = (key, label) => {
		const v = blank(input[key]) ? 0 : Number(input[key]);
		if (!(v >= 0 && v < 1e6)) { errors.push({ field: key, he: `${label}: מספר, 0 אם אין` }); return 0; }
		return v;
	};
	const work = cash('work', 'הכנסה מעבודה');
	const spouseWork = couple ? cash('spouseWork', 'הכנסה מעבודה של בן או בת הזוג') : 0;
	const pension = cash('pension', 'פנסיה');
	const other = cash('other', 'הכנסה אחרת');
	const savings = cash('savings', 'חסכונות');
	const car = CARS.includes(input.car) ? input.car : 'none';
	const carValue = car === 'none' || (car === 'two' && blank(input.carValue)) ? 0 : (blank(input.carValue) ? NaN : Number(input.carValue));
	if (car !== 'none' && !(carValue >= 0 && carValue < 1e7)) { errors.push({ field: 'carValue', he: 'שווי הרכב לפי המחירון: מספר' }); }
	const carEx = input.carEx === true && car !== 'none';
	const realty = input.realty === true;
	const res = RESS.includes(input.res) ? input.res : 'yes';
	const excl = EXCLS.includes(input.excl) ? input.excl : 'none';
	const month = blank(input.month) ? '' : String(input.month);
	if (month && !(ymOk(month) && month >= '2026-01')) { errors.push({ field: 'month', he: 'חודש התביעה: חודש ושנה מ-2026, לדוגמה 11.2026' }); }
	const date = (key, label) => {
		if (blank(input[key])) { return null; }
		const d = parseDate(input[key]);
		if (!d) { errors.push({ field: key, he: `${label}: תאריך מלא, לדוגמה 1.11.2026` }); }
		return d;
	};
	const decision = date('decision', 'היום שבו נמסרה ההחלטה');
	const hearing = date('hearing', 'היום שבו הגיעה ההודעה על השימוע');
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const ag = hv.age;
	const kind = kindOf(fam, kids);
	const parent = fam === 'parent';
	const adults = couple ? [{ who: 'self', age, sex, emp }, { who: 'spouse', age: spouseAge, sex: '', emp: spouseEmp }] : [{ who: 'self', age, sex, emp }];
	const older = Math.max(...adults.map((a) => a.age));

	// 1. The retirement age: the route of the old-age pension's income supplement (s.5(א)(1)).
	let retireSelf = 'no';
	const retireYm = sex === 'f' && born && month ? womenRetirementYm(hv, born) : null;
	if (retireYm) {
		retireSelf = month >= retireYm.ym ? 'yes' : 'no';
	} else if (age >= ag.men_retirement || (sex === 'f' && age >= ag.women_retirement_max)) {
		retireSelf = 'yes';
	} else if (sex !== 'm' && age >= ag.women_retirement_from) {
		retireSelf = 'check';
	}
	let retireSpouse = 'no';
	if (couple) { retireSpouse = spouseAge >= ag.men_retirement ? 'yes' : spouseAge >= ag.women_retirement_from ? 'check' : 'no'; }
	const route = retireSelf === 'yes' || retireSpouse === 'yes';
	const retireCheck = !route && (retireSelf === 'check' || retireSpouse === 'check');

	// 2. The column and the rate.
	const col = older >= ag.older_from ? 'c' : 'b';
	const young = col === 'b' && kids === 0 && adults.every((a) => a.age >= ag.min && a.age <= ag.young_to && a.emp === 'registered');
	const under20 = adults.some((a) => a.age < ag.min);
	let women = false;
	let womenMonths = null;
	if (sex === 'f' && col === 'c' && born && month && !route) {
		const y = Number(born.slice(0, 4));
		const at62 = addYm(born, hv.women.from_age * 12);
		if (y >= hv.women.born_from && y <= hv.women.born_to && month >= at62 && retireYm && month < retireYm.ym) { women = true; womenMonths = hv.women.months[String(y)]; }
	}

	// 3. The gates.
	const gates = [];
	gates.push(res === 'yes'
		? { key: 'res', state: 'ok', he: `תושבות בישראל ${hv.residence.months} חודשים רצופים לפחות`, section: hv.residence.section, url: hv.residence.url }
		: { key: 'res', state: 'check', he: `תושבות של פחות מ-${hv.residence.months} חודשים: ${hv.residence.new_he}`, section: hv.residence.section, url: hv.residence.new_url });
	let ageState = 'ok';
	let ageHe = couple ? `גיל ${age} ו-${spouseAge}: ${col === 'c' ? `מעל ${ag.older_from}, הסכומים של טור ג'` : `מתחת ל-${ag.older_from}, הסכומים של טור ב'`}` : `גיל ${age}: ${col === 'c' ? `מ-${ag.older_from} ועד גיל הפרישה, הסכומים של טור ג'` : `מתחת ל-${ag.older_from}, הסכומים של טור ב'`}`;
	if (route) { ageState = 'route'; ageHe = `${couple && retireSpouse === 'yes' && retireSelf !== 'yes' ? 'בן או בת הזוג הגיעו' : 'הגעתם'} לגיל הפרישה: ${ag.retirement_he}`; } else if (under20) {
		if (parent) { ageHe = `גיל ${Math.min(...adults.map((a) => a.age))}: הורה לילד זכאי בכל גיל`; } else { ageState = 'check'; ageHe = `מתחת לגיל ${ag.min}: ${ag.special_he}`; }
	} else if (retireCheck) { ageState = 'check'; ageHe = `${ageHe}. ${ag.women_he}: בדקו אם הגעתם לגיל הפרישה`; } else if (young) { ageHe = `גיל ${adults.map((a) => a.age).join(' ו-')}: בני ${ag.min} עד ${ag.young_to} שמתייצבים בשירות התעסוקה מקבלים ${hv.amounts.young_pct}% מהקצבה המלאה`; }
	gates.push({ key: 'age', state: ageState, he: ageHe, section: route ? 'סעיף 5(א)(1)' : young ? ag.young_section : under20 && !parent ? ag.under20_section : ag.column_section, url: route ? hv.pages.old_age_supplement : ag.url });
	const empHe = { registered: 'רשום ומתייצב בשירות התעסוקה', fulltime: 'עובד 36 שעות בשבוע ומעלה (פטור מהתייצבות)', exempt: 'בקבוצת פטור מהתייצבות', none: 'לא רשום בשירות התעסוקה ולא בקבוצת פטור' };
	const empNo = adults.filter((a) => a.emp === 'none');
	gates.push(route ? { key: 'emp', state: 'ok', he: 'מגיל הפרישה אין חובת התייצבות', section: hv.employment.section, url: hv.employment.exemption_url }
		: { key: 'emp', state: empNo.length ? 'no' : 'ok', he: adults.map((a) => `${a.who === 'self' ? (couple ? 'אתם' : 'מבחן התעסוקה') : 'בן או בת הזוג'}: ${empHe[a.emp]}`).join('; '), section: hv.employment.section, url: empNo.length ? hv.employment.url : hv.employment.exemption_url });
	const ex = hv.exclusions;
	const exclState = excl === 'none' ? 'ok' : excl === 'student' && parent ? 'check' : 'no';
	const exclHe = { none: 'לא לומדים במוסד להשכלה גבוהה, לא בישיבה, לא חברי קיבוץ ולא בשירות סדיר', student: parent ? ex.parent_study_he : ex.student_he, yeshiva: ex.yeshiva_he, kibbutz: ex.kibbutz_he, army: ex.army_he }[excl];
	gates.push({ key: 'excl', state: exclState, he: exclHe, section: ex.section, url: excl === 'student' && parent ? ex.study_url : ex.url });
	const cr = hv.car;
	let carState = 'ok';
	let carHe = 'אין רכב';
	let carDeduct = false;
	if (car === 'one') {
		if (carEx) { carHe = `רכב בשווי ${shekels(carValue)} ש"ח, עם אחד החריגים: הרכב לא נחשב`; } else if (carValue <= cr.limit) { carDeduct = true; carHe = `רכב אחד בשווי ${shekels(carValue)} ש"ח: עד ${shekels(cr.limit)} ש"ח, ולכן מנוכה ממנו סכום מהקצבה`; } else { carState = 'no'; carHe = `רכב בשווי ${shekels(carValue)} ש"ח: מעל ${shekels(cr.limit)} ש"ח, בלי חריג`; }
	} else if (car === 'two') {
		if (carEx) { carState = 'check'; carHe = 'שני רכבים, ואחד מהם משמש אדם עם מוגבלות: הרכב השני נבדק לפי שוויו'; } else { carState = 'no'; carHe = 'שני רכבים במשפחה, בלי חריג'; }
	}
	gates.push({ key: 'car', state: carState, he: carHe, section: cr.section, url: cr.url });
	const as = hv.assets;
	const free = btl.basic_amount.b3 * as.free_x[kind === 'single' ? 'single' : 'family'];
	const assetState = realty || savings > free ? 'check' : 'ok';
	gates.push({ key: 'assets', state: assetState, he: realty ? as.realty_he : savings > free ? `חסכונות של ${shekels(savings)} ש"ח: מעל ${shekels(free)} ש"ח (פי ${as.free_x[kind === 'single' ? 'single' : 'family']} מהסכום הבסיסי), ולכן ההכנסה מהם נבדקת` : `חסכונות עד ${shekels(free)} ש"ח (פי ${as.free_x[kind === 'single' ? 'single' : 'family']} מהסכום הבסיסי) לא נחשבים; דירת המגורים לא נחשבת`, section: as.section, url: as.url });

	// 4. The money (unless the route is the old-age supplement).
	const W = work + spouseWork;
	const spouseWorks = couple && spouseWork > 0;
	const detApplies = col === 'c' && !parent && !route && (fam === 'single' || adults.every((a) => a.age >= ag.older_from));
	const det = detApplies ? determining(registry, kind, spouseWorks) : null;
	const o = { kind, col, young, women, work: W, pension, other, det: det ? det.amount : null, car: carDeduct ? { value: carValue, deduct: true } : null };
	let calc = null;
	let ledger = [];
	let bars = [];
	let end = null;
	let cap0 = null;
	let keep = 100;
	let nextKeep = null;
	let columns = [];
	let conflict = false;
	if (!route) {
		calc = benefitAt(registry, o);
		end = endWork(registry, o);
		cap0 = capFrom(registry, o);
		keep = keepAt(registry, o, W);
		const marks = [calc.first - calc.dP];
		if (parent) { marks.push(hv.work.parent.band); }
		if (cap0 !== null) { marks.push(cap0); }
		if (end) { marks.push(end); }
		const nx = marks.filter((m) => m > W).sort((a, b) => a - b)[0];
		if (nx !== undefined) { nextKeep = { from: Math.ceil(nx), keep: keepAt(registry, o, Math.ceil(nx) + 0.5) }; }
		const pts = [{ w: 0, why: 'none' }, { w: calc.first - calc.dP, why: 'first' }, { w: calc.first - calc.dP + 1, why: 'first_up' }];
		if (parent) { pts.push({ w: hv.work.parent.band, why: 'band' }, { w: hv.work.parent.band + 1, why: 'band_up' }); }
		if (cap0 !== null) { pts.push({ w: cap0, why: 'cap' }); }
		if (carDeduct) { const a = Math.floor(btl.avg_wage.s2_benefits * cr.worker_pct / 100); pts.push({ w: a, why: 'car' }, { w: a + 1, why: 'car_up' }); }
		if (end > 0) { pts.push({ w: end - 1, why: 'last' }, { w: end, why: 'end' }); }
		if (W > 0) { pts.push({ w: W, why: 'you' }); }
		const seen = new Set();
		ledger = pts.filter((p) => p.w >= 0 && !seen.has(p.w) && seen.add(p.w)).sort((a, b) => a.w - b.w).map((p) => {
			const x = benefitAt(registry, Object.assign({}, o, { work: p.w }));
			return { w: p.w, why: p.why, pay: x.pay, total: r2(p.w + x.pay + pension + other), keep: keepAt(registry, o, p.w + 0.5), you: p.w === W };
		});
		const span = Math.max(end || 0, W, 2000);
		const step = span > 14000 ? 1000 : 500;
		const top = Math.min(40000, Math.ceil((span + step) / step) * step);
		for (let w = 0; w <= top; w += step) { bars.push({ w, pay: benefitAt(registry, Object.assign({}, o, { work: w })).pay }); }
		// The same family and income in every age group of the table.
		const youngOk = kids === 0;
		columns = [
			{ key: 'young', he: `${ag.min} עד ${ag.young_to}, מתייצבים`, x: youngOk ? benefitAt(registry, Object.assign({}, o, { col: 'b', young: true, women: false, det: null })) : null },
			{ key: 'b', he: `עד ${ag.older_from - 1}`, x: benefitAt(registry, Object.assign({}, o, { col: 'b', young: false, women: false, det: null })) },
			{ key: 'c', he: `${ag.older_from} עד גיל הפרישה`, x: benefitAt(registry, Object.assign({}, o, { col: 'c', young: false, women: false, det: !parent ? determining(registry, kind, spouseWorks).amount : null })) },
		].filter((c) => c.x).map((c) => ({ key: c.key, he: c.he, full: c.x.full, pay: c.x.pay, here: c.key === (young ? 'young' : col) }));
		const published = hv.amounts.max_work[col] && hv.amounts.max_work[col][kind];
		conflict = Boolean(det && kind === 'couple2' && published && W + pension + other >= det.amount && W + pension + other < published && calc.pay === 0);
	}
	const incomeState = route ? 'route' : conflict ? 'check' : calc.pay > 0 ? 'ok' : 'no';
	const incomeHe = route ? 'מגיל הפרישה נבדקת השלמת הכנסה לקצבת אזרח ותיק' : calc.pay > 0 ? `ההכנסה שנחשבת (${shekels(calc.income)} ש"ח) נמוכה מהקצבה המלאה (${shekels(calc.full)} ש"ח)` : calc.capBinds ? `ההכנסה כולה (${shekels(W + pension + other)} ש"ח) מגיעה לסכום הקובע (${shekels(r2(det.amount))} ש"ח)` : calc.belowMin ? `נשארו פחות מ-${hv.min_pay} ש"ח, ולכן לא משולם` : `ההכנסה שנחשבת (${shekels(calc.income + calc.carDed)} ש"ח עם הרכב) לא נמוכה מהקצבה המלאה (${shekels(calc.full)} ש"ח)`;
	gates.push({ key: 'income', state: incomeState, he: incomeHe, section: route ? 'סעיף 5(א)(1)' : calc && calc.capBinds ? hv.determining.section : 'סעיף 5(ב)', url: route ? hv.pages.old_age_supplement : calc && calc.capBinds ? hv.determining.url : hv.work.income_url });
	const verdict = gates.some((g) => g.state === 'no') ? 'no' : route ? 'route' : gates.some((g) => g.state === 'check') ? 'check' : 'ok';
	const eligible = verdict === 'ok' || verdict === 'check';
	const monthly = eligible && calc ? calc.pay : 0;
	const health = eligible && monthly > 0 && work === 0;
	const net = health ? Math.max(0, monthly - hv.deductions.health) : monthly;

	// 5. The notes.
	const dd = hv.deductions;
	if (route) { add('bad', 'route', `${ag.retirement_he}; מגישים טופס ${hv.claim.old_age_form}.`, 'סעיף 5(א)(1)', hv.pages.old_age_supplement); }
	if (empNo.length && !route) { add('bad', 'emp', `${hv.employment.he}. ${hv.employment.fulltime_he}; קבוצות הפטור: ${hv.employment.groups_he.slice(0, 4).join(', ')} ועוד.`, hv.employment.section, hv.employment.url); }
	if (carState === 'no') { add('bad', 'car', `${cr.over_he}: ${cr.exceptions_he.join('; ')}.`, cr.section, cr.url); }
	if (exclState === 'no') { add('bad', 'excl', `${exclHe}.`, ex.section, ex.url); }
	if (calc && calc.capBinds && calc.pay >= 0 && !route) { add('warn', 'cap', `${hv.determining.he}: ${shekels(r2(det.amount))} ש"ח (${shekels(det.pct)}% מהשכר הממוצע). מכאן כל שקל נוסף של הכנסה מוריד שקל מהקצבה.`, hv.determining.section, hv.determining.url); }
	if (conflict) { add('warn', 'conflict', `${hv.determining.conflict_he}.`, hv.determining.section, hv.determining.published_url); }
	if (calc && calc.belowMin && !route) { add('warn', 'min', `לפי החישוב נשארו פחות מ-${hv.min_pay} ש"ח: סכום כזה לא משולם.`, hv.min_pay_section, hv.law_url); }
	if (calc && calc.carDed && !route) { add('info', 'car_ded', `${cr.rule_he}. כאן ${shekels(calc.carDed)} ש"ח. ${cr.value_he}.`, cr.section, cr.income_url); }
	if (car !== 'none' && !route) { add('info', 'car_3m', `${cr.three_months_he}.`, cr.section, cr.url); }
	if (young) { add('info', 'young', `בני ${ag.min} עד ${ag.young_to} שמתייצבים בשירות התעסוקה ואין להם ילדים מקבלים ${hv.amounts.young_pct}% מהקצבה המלאה; מי שבקבוצת פטור או עובד 36 שעות בשבוע מקבל את הסכום המלא (${shekels(hv.amounts.b[kind])} ש"ח).`, ag.young_section, hv.amounts.url); }
	if (women) { add('info', 'women', `${hv.women.he}: ${womenMonths} חודשים לילידות ${born.slice(0, 4)}.`, hv.women.section, hv.women.url); } else if (sex === 'f' && col === 'c' && !route && age >= hv.women.from_age && !(born && month)) { add('info', 'women_check', `${hv.women.he}: הזינו את חודש הלידה ואת חודש התביעה כדי לחשב.`, hv.women.section, hv.women.url); }
	if (health) { add('info', 'health', `${dd.health_he}: נכנס לחשבון ${shekels(net)} ש"ח.`, '', dd.url); }
	if (assetState === 'check') { add('warn', 'assets', `${realty ? as.realty_he : as.he}; שיעור הריבית מ-${heDate(as.interest_from)}: ${as.interest_pct}% (${as.interest_section}).`, as.section, as.url); }
	if (res === 'new') { add('warn', 'res', `${hv.residence.new_he}.`, hv.residence.section, hv.residence.new_url); }
	if (exclState === 'check') { add('warn', 'study', `${ex.parent_study_he}.`, ex.section, ex.study_url); }
	if (!route && adults.some((a) => a.emp === 'registered') && W === 0) { add('info', 'avtala', 'מי שעבד עד לאחרונה בודק קודם דמי אבטלה: דמי אבטלה נחשבים כמו הכנסה מעבודה, והבטחת הכנסה משלימה עד הסכום המלא.', 'סעיף 12(ג)', hv.work.url); }
	if (pension > 0 && !route) { add('info', 'pension', `${hv.work.pension_he}.`, hv.work.section_b, hv.work.income_url); }
	if (other > 0 && !route) { add('info', 'other', `${hv.other_income.he}. ${hv.other_income.excluded_he}.`, hv.other_income.section, hv.other_income.url); }
	if (couple && !route) { add('info', 'couple', `${hv.amounts.couple_he}. במקרים מסוימים, כמו חיים בנפרד או מאסר של בן הזוג, הזכאות נבדקת בנפרד.`, 'סעיף 6', hv.pages.separate); }
	if (!route) { add('info', 'refuse', `${hv.employment.refuse_he}; ${hv.employment.missed_he}.`, hv.employment.refuse_section, hv.employment.url); }
	add('info', 'changes', `${hv.clock.changes_he}.`, '', hv.clock.changes_url);

	// 6. The clock.
	const c = hv.clock;
	const deadlines = [];
	if (month && !route) {
		const first = `${month}-01`;
		const last = addDays(addMonths(first, 1), -1);
		deadlines.push({ key: 'from', date: first, he: `הקצבה בעד ${monthHe(month)}: מהחודש שבו מגישים`, section: c.section, url: c.url, ics: false });
		deadlines.push({ key: 'file_by', date: last, he: `היום האחרון להגיש את התביעה ולקבל קצבה בעד ${monthHe(month)}`, section: c.section, url: c.claim_url, ics: true });
	}
	if (hearing) {
		deadlines.push({ key: 'hearing_notice', date: hearing, he: 'הגיעה הודעה על כוונה להפסיק את הקצבה (שימוע)', section: '', url: c.hearing_url, ics: false });
		deadlines.push({ key: 'hearing', date: addDays(hearing, c.hearing_days), he: `היום האחרון להציג עמדה בשימוע (${c.hearing_days} ימים); בינתיים הקצבה ממשיכה`, section: 'שימוע', url: c.hearing_url, ics: true });
	}
	if (decision) {
		deadlines.push({ key: 'decision', date: decision, he: 'נמסרה החלטת הביטוח הלאומי', section: '', url: c.appeal_url, ics: false });
		deadlines.push({ key: 'appeal', date: addMonths(decision, c.appeal_months), he: `היום האחרון להגיש ערעור לבית הדין האזורי לעבודה (${c.appeal_months} חודשים)`, section: 'ערעור לבית הדין לעבודה', url: c.appeal_url, ics: true });
	}
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	// 7. The next steps and the rehearsal.
	const next = [];
	if (route) {
		next.push({ he: 'השלמת הכנסה לקצבת אזרח ותיק באתר הביטוח הלאומי', url: hv.pages.old_age_supplement, kind: 'official' });
		next.push({ he: 'מדריך זכויות לגיל השלישי באתר', url: '/elder-law-israel/', kind: 'site' });
	} else {
		next.push({ he: `להגיש תביעה מקוונת (טופס ${hv.claim.form})`, url: hv.claim.online_url, kind: 'official' });
		if (adults.some((a) => a.emp === 'registered' || a.emp === 'none')) { next.push({ he: 'להירשם ולהתייצב בשירות התעסוקה', url: hv.employment.taasuka_url, kind: 'official' }); }
		next.push(kids > 0 ? { he: 'קצבת ילדים: כמה מגיע, והיא לא נחשבת הכנסה', url: '/kitzbat-yeladim/', kind: 'site' } : { he: 'דמי אבטלה: לבדוק קודם', url: '/unemployment-benefits-eligibility/', kind: 'site' });
		if (verdict === 'no' || decision) { next.push({ he: 'ערעור על החלטות הביטוח הלאומי', url: '/bituach-leumi-appeal-guide/', kind: 'site' }); }
	}
	const rehearse = {
		url: hv.rehearse_url,
		he: verdict === 'no' || decision ? `${decision ? 'יש החלטה' : 'אין זכאות לפי מה שהוזן'}: לתרגל את הדיון בבית הדין האזורי לעבודה, שבו מערערים על החלטת הביטוח הלאומי בתוך ${c.appeal_months} חודשים`
			: hearing || car !== 'none' || couple ? 'לתרגל את השיחה עם פקיד התביעות או עם החוקר: רכב, ידוע בציבור, הכנסות ומי גר בבית'
				: 'לתרגל את הבירור אצל פקיד התביעות: ההכנסות, ההתייצבות ומה משתנה כשמתחילים לעבוד',
	};

	return {
		ok: true, verdict, eligible, route, fam, kids, kind, age, sex, born, spouseAge: couple ? spouseAge : null, emp, spouseEmp, work, spouseWork, W, pension, other,
		car, carValue, carEx, savings, realty, res, excl, month, decision, hearing, col, young, women, womenMonths, under20, det, calc, monthly, net, health,
		annual: monthly * 12, total: r2(W + pension + other + monthly), keep, nextKeep, end, capFrom: cap0, ledger, bars, columns, conflict, gates, flags, deadlines, next, rehearse,
		free, published: calc ? (hv.amounts.max_work[col] || {})[kind] : null,
	};
}
