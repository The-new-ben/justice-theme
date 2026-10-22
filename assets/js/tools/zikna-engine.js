/**
 * The rights wave 2B (22.10.2026, HAD-585): the old-age pension (קצבת אזרח ותיק, קצבת זקנה) and the retirement-age clock.
 *
 * Dependency-free ES module (dates.js only). Every number comes from registry.rights_zikna (the National Insurance
 * Institute's old-age pages, chapter 11 of the National Insurance Law and its tables, the Retirement Age Law, read on its
 * checked_on date) and registry.rights_btl (basic amount 3 and the average wage of section 2):
 *  - The dates: the retirement age by sex and month of birth (table א1 part א; for women born from 1956 the Retirement Age
 *    Law's schedule, 62 to 65), the eligibility age (70; for women born before May 1950 table א1 part ד), the first payment
 *    month (born before the 15th: the month of the birthday; after it: the month after), 80.
 *  - The gates: insured (s.240; a late immigrant takes the special benefit), the qualifying period (s.246: 60 months in the
 *    10 years before the age, or 144 months; a woman may be exempt), the income test between the retirement age and 70
 *    (s.245), the dependent spouse (s.247).
 *  - The pension: 17.7% of basic amount 3 (18.7% from 80, s.247א), 8.9% for a dependent spouse and 5.6% for each of the
 *    first two children (s.244(ב)), 2% seniority for each insured year up to 50% (s.248), 5% deferral for each year the
 *    pension was not paid because of work income or was waived (s.249). The income test: the maximum income of table ט1
 *    (73.45% of the average wage, 97.93% with one dependant, 7% more for each further one); above it the pension less 60% of
 *    the excess, not below 10% of the basic pension (s.245(ב)). Other income counts only above twice the maximum (the
 *    Institute's published bands, flagged for a check).
 *  - The transition grant for women born 1960-1966 (s.269א): a monthly amount by year of birth, for the 4 months from 62.
 */

import { addMonths, parseDate } from './dates.js';

const zkBlank = (v) => v === '' || v === undefined || v === null;
const zkFmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const zkHe = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const ZK_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
/** 'YYYY-MM' -> 'פברואר 2028'. */
export function zkMonthHe(ym) { return ym ? `${ZK_MONTHS[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}` : ''; }
export const ZK_FAMS = ['single', 'couple'];
export const ZK_STATUS = ['worker', 'exempt', 'housewife'];

/** To the nearest shekel, a half up (every published 2026 figure fits). */
export function roundShekel(x) { return Math.floor(x + 0.5 + 1e-9); }

/** The day a person born on `iso` is `years` and `months` old; a day the target month lacks is that month's last day. */
export function addAge(iso, years, months = 0) {
	const [y, m, d] = iso.split('-').map(Number);
	const total = y * 12 + (m - 1) + years * 12 + months;
	const ny = Math.floor(total / 12);
	const nm = total % 12 + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(nm).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
export function addYm(ym, n) {
	const [y, m] = ym.split('-').map(Number);
	const t = y * 12 + (m - 1) + n;
	return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
}
/** Whole years and months from a birth day to a day. */
export function ageOn(birth, on) {
	const [by, bm, bd] = birth.split('-').map(Number);
	const [y, m, d] = on.split('-').map(Number);
	let months = (y - by) * 12 + (m - bm) - (d < bd ? 1 : 0);
	if (d < bd && addAge(birth, 0, months + 1) <= on) { months += 1; }
	return { years: Math.floor(months / 12), months: months % 12, total: months };
}

/** The row of a birth-month table ([from, to, years, months]) that holds `ym`. */
export function ageRow(rows, ym) {
	const row = rows.find((x) => (x[0] === null || ym >= x[0]) && (x[1] === null || ym <= x[1]));
	return row ? { years: row[2], months: row[3], from: row[0], to: row[1] } : null;
}
export function retirementAge(z, sex, birth) {
	const row = ageRow(sex === 'f' ? z.ages.women_retirement : z.ages.men_retirement, birth.slice(0, 7));
	return Object.assign(row, { date: addAge(birth, row.years, row.months) });
}
export function eligibilityAge(z, sex, birth) {
	const row = sex === 'f' ? ageRow(z.ages.women_eligibility, birth.slice(0, 7)) : { years: z.ages.men_eligibility, months: 0 };
	return Object.assign(row, { date: addAge(birth, row.years, row.months) });
}
/** The first month paid (the Institute's payment page): born before the 15th, the month of the age; after it, the next. */
export function firstPay(z, birth, reach) {
	const day = Number(birth.slice(8, 10));
	const ym = reach.slice(0, 7);
	const cut = z.claim.cutoff_day;
	if (day < cut) { return { ym, date: `${ym}-${String(z.claim.pay_day).padStart(2, '0')}`, check: false }; }
	const next = addYm(ym, 1);
	return { ym: day > cut ? next : ym, alt: day === cut ? next : null, date: `${day > cut ? next : ym}-${String(z.claim.pay_day).padStart(2, '0')}`, check: day === cut };
}

/** The maximum income of table ט1 by the number of dependants (the published figure for none and one). */
export function maxIncome(reg, deps) {
	const it = reg.rights_zikna.income_test;
	const avg = reg.rights_btl.avg_wage.s2_benefits;
	if (deps <= 0) { return { amount: it.single, pct: it.max_pct.none, exact: avg * it.max_pct.none / 100 }; }
	const pct = it.max_pct.one + it.max_pct.each * (deps - 1);
	const exact = avg * pct / 100;
	return { amount: deps === 1 ? it.couple : roundShekel(exact), pct: Math.round(pct * 100) / 100, exact };
}

/** The pension of a phase: o = { age80, spouse, kids, years, basicOnly, deferPct }. */
export function pensionAt(reg, o) {
	const am = reg.rights_zikna.amounts;
	const sn = reg.rights_zikna.seniority;
	const base = o.age80 ? am.basic80 : am.basic;
	const spouse = o.spouse ? am.spouse : 0;
	const kids = Math.min(o.kids || 0, am.max_children);
	const children = kids * am.child;
	const subtotal = base + spouse + children;
	const senPct = o.basicOnly ? 0 : Math.min(sn.max_pct, sn.pct_per_year * Math.floor(o.years || 0));
	const full = roundShekel(subtotal * (100 + senPct) / 100);
	const deferPct = o.deferPct || 0;
	const deferral = roundShekel(full * deferPct / 100);
	return { base, spouse, kids, children, subtotal, senPct, seniority: full - subtotal, full, deferPct, deferral, total: full + deferral };
}

/** The income test of s.245 on a full pension: work counts in full, other income only above twice the maximum. */
export function incomeTest(reg, full, work, other, max) {
	const it = reg.rights_zikna.income_test;
	const otherCounted = Math.max(0, other - it.both_other_mult * max);
	const counted = work + otherCounted;
	const excess = Math.max(0, counted - max);
	const deduction = Math.round(excess * it.deduct_pct) / 100;
	const partial = full - deduction;
	let state = 'full';
	let pay = full;
	if (excess > 0) {
		if (partial >= it.min_partial) { state = 'partial'; pay = roundShekel(partial); } else { state = 'none'; pay = 0; }
	}
	// The first whole shekel of work income from which nothing is paid (with this other income).
	const bound = max - otherCounted + (full - it.min_partial) * 100 / it.deduct_pct;
	const end = Math.floor(bound + 1e-9) + 1;
	return { max, work, other, otherCounted, counted, excess, deduction, partial: Math.round(partial * 100) / 100, state, pay, end: Math.max(0, end) };
}

/** Deferral years over a span of months: whole years, and a last part of 9 months or more counts as a year (s.249(ב)). */
export function deferralYears(reg, months) {
	const nine = reg.rights_zikna.deferral.nine_months;
	return Math.floor(months / 12) + (months % 12 >= nine ? 1 : 0);
}

const zkNum = (errors, input, key, label, max = 1e6) => {
	const v = zkBlank(input[key]) ? 0 : Number(input[key]);
	if (!(v >= 0 && v < max)) { errors.push({ field: key, he: `${label}: מספר, 0 אם אין` }); return 0; }
	return v;
};

/**
 * input = { sex ('m'|'f'), birth (YYYY-MM-DD), fam ('single'|'couple'), spouseBirth, spouseIncome (monthly gross), spousePension
 *           (the spouse gets an Institute pension), together (married or living together a year, or a child together), kids
 *           (0..9 dependent children), years (insured years), status ('worker'|'exempt'|'housewife', women), work (monthly gross
 *           from work between the retirement age and 70), other (monthly income not from work; pensions are not counted),
 *           workYears (years of that work after the retirement age; blank = until 70), waive (waive a partial pension),
 *           disability (general disability pension until the retirement age), immigrant (first came after the insured age),
 *           grantWork (work in the 4 months from 62), decision (the day a decision arrived), today (YYYY-MM-DD) }
 */
export function compute(registry, input) {
	const z = registry.rights_zikna;
	const errors = [];
	const sex = input.sex === 'm' || input.sex === 'f' ? input.sex : null;
	if (!sex) { errors.push({ field: 'sex', he: 'בחרו גבר או אישה: גיל הפרישה תלוי בזה' }); }
	const birth = zkBlank(input.birth) ? null : parseDate(input.birth);
	if (!birth || birth < '1920-01-01' || birth > '2008-12-31') { errors.push({ field: 'birth', he: 'תאריך הלידה: יום, חודש ושנה, לדוגמה 9.8.1964' }); }
	const fam = ZK_FAMS.includes(input.fam) ? input.fam : null;
	if (!fam) { errors.push({ field: 'fam', he: 'בחרו יחיד או בני זוג' }); }
	const couple = fam === 'couple';
	let spouseBirth = null;
	if (couple) {
		spouseBirth = zkBlank(input.spouseBirth) ? null : parseDate(input.spouseBirth);
		if (!spouseBirth || spouseBirth < '1910-01-01' || spouseBirth > '2010-12-31') { errors.push({ field: 'spouseBirth', he: 'תאריך הלידה של בן או בת הזוג: לדוגמה 1.2.1961' }); }
	}
	const kids = zkBlank(input.kids) ? 0 : Number(input.kids);
	if (!(Number.isInteger(kids) && kids >= 0 && kids <= 9)) { errors.push({ field: 'kids', he: 'מספר הילדים: 0 עד 9' }); }
	const years = zkBlank(input.years) ? NaN : Number(input.years);
	if (!(Number.isInteger(years) && years >= 0 && years <= 60)) { errors.push({ field: 'years', he: 'שנות ביטוח: מספר שלם, 0 עד 60' }); }
	const status = sex === 'f' && ZK_STATUS.includes(input.status) ? input.status : 'worker';
	const work = zkNum(errors, input, 'work', 'הכנסה מעבודה');
	const other = zkNum(errors, input, 'other', 'הכנסה שלא מעבודה');
	const spouseIncome = couple ? zkNum(errors, input, 'spouseIncome', 'הכנסת בן או בת הזוג') : 0;
	const workYears = zkBlank(input.workYears) ? null : Number(input.workYears);
	if (workYears !== null && !(Number.isInteger(workYears) && workYears >= 0 && workYears <= 10)) { errors.push({ field: 'workYears', he: 'שנות עבודה אחרי גיל הפרישה: 0 עד 10, או ריק עד גיל 70' }); }
	const decision = zkBlank(input.decision) ? null : parseDate(input.decision);
	if (!zkBlank(input.decision) && !decision) { errors.push({ field: 'decision', he: 'היום שבו נמסרה ההחלטה: תאריך מלא, לדוגמה 1.12.2026' }); }
	if (errors.length) { return { ok: false, errors }; }

	const today = parseDate(input.today) || z.checked_on;
	const together = input.together !== false;
	const spousePension = couple && input.spousePension === true;
	const waive = input.waive === true;
	const disability = input.disability === true;
	const immigrant = input.immigrant === true;
	const grantWork = input.grantWork === true;
	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const it = z.income_test;
	const sp = z.spouse;
	const ac = z.achshara;

	// 1. The clock.
	const ret = retirementAge(z, sex, birth);
	const elig = eligibilityAge(z, sex, birth);
	const at80 = addAge(birth, z.amounts.from80, 0);
	const now = ageOn(birth, today);
	const womenStep = sex === 'f' ? (ret.years - z.ages.women_now_from) * 12 + ret.months : 0;

	// 2. The qualifying period (s.246) and the insured gate (s.240).
	const months = years * 12;
	let achState = 'ok';
	let achHe = '';
	let toSeventy = false;
	let basicOnly = false;
	if (immigrant) {
		achState = 'route';
		achHe = z.insured.special_he;
	} else if (sex === 'f' && status === 'exempt') {
		achHe = `${ac.exempt_he}`;
	} else if (sex === 'f' && status === 'housewife') {
		achState = 'route';
		toSeventy = true;
		achHe = ac.housewife_he;
	} else if (months >= ac.total_months) {
		achHe = `${years} שנות ביטוח: ${months} חודשים, יותר מ-${ac.total_months}`;
	} else if (months >= ac.last10_months) {
		achState = 'check';
		achHe = `${years} שנות ביטוח (${months} חודשים): פחות מ-${ac.total_months}; מספיק אם ${ac.last10_months} מהם בתוך 10 השנים שלפני הגיל, או לפי החלופה השלישית`;
	} else if (sex === 'f') {
		achState = 'check';
		toSeventy = true;
		basicOnly = true;
		achHe = `${years} שנות ביטוח: פחות מ-${ac.last10_months} חודשים. ${ac.basic70_he}`;
	} else {
		achState = 'no';
		achHe = `${years} שנות ביטוח: פחות מ-${ac.last10_months} חודשים; ${ac.returning_he}`;
	}

	// 3. The date the pension can start, and the window of the income test.
	const conditional = toSeventy ? elig : ret;
	const window = Math.max(0, (elig.years * 12 + elig.months) - (conditional.years * 12 + conditional.months));
	const stop = workYears === null || workYears * 12 >= window ? elig.date : addAge(conditional.date, workYears, 0);
	const workMonths = workYears === null ? window : Math.min(window, workYears * 12);
	const ref = conditional.date > today ? conditional.date : today;

	// 4. The spouse (s.247) and the dependants.
	let spouseDep = false;
	let spouseState = null;
	let spouseHe = '';
	let spouseAge = null;
	if (couple) {
		spouseAge = ageOn(spouseBirth, ref).years;
		const limitOk = spouseIncome <= sp.income_limit;
		if (sex === 'm') {
			const ageOk = spouseAge >= sp.wife_min_age || kids > 0;
			const incOk = spouseAge >= sp.wife_free_age || limitOk;
			spouseDep = together && ageOk && incOk;
			spouseHe = spouseDep ? `בת הזוג בת ${spouseAge}${spouseAge >= sp.wife_free_age ? `, מעל ${sp.wife_free_age}: ההכנסה שלה לא נבדקת` : `, הכנסה של ${zkFmt(spouseIncome)} ש"ח, עד ${zkFmt(sp.income_limit)}`}`
				: !together ? 'פחות משנה יחד ובלי ילד משותף' : !ageOk ? `בת הזוג בת ${spouseAge}: מתחת ל-${sp.wife_min_age} ובלי ילד` : `הכנסת בת הזוג ${zkFmt(spouseIncome)} ש"ח: מעל ${zkFmt(sp.income_limit)} ש"ח`;
		} else {
			const incOk = spouseAge >= sp.husband_free_age || (spouseAge >= sp.husband_min_age && limitOk);
			spouseDep = together && incOk;
			spouseHe = spouseDep ? `בן הזוג בן ${spouseAge}${spouseAge >= sp.husband_free_age ? `, מעל ${sp.husband_free_age}: ההכנסה שלו לא נבדקת` : `, הכנסה של ${zkFmt(spouseIncome)} ש"ח, עד ${zkFmt(sp.income_limit)}`}`
				: !together ? 'פחות משנה יחד' : spouseAge < sp.husband_min_age ? `בן הזוג בן ${spouseAge}: מתחת ל-${sp.husband_min_age}` : `הכנסת בן הזוג ${zkFmt(spouseIncome)} ש"ח: מעל ${zkFmt(sp.income_limit)} ש"ח`;
		}
		spouseHe += ` (נבדק ל-${zkHe(ref)})`;
		spouseState = !spouseDep ? 'no' : spousePension ? 'route' : status === 'housewife' && sex === 'f' ? 'route' : 'ok';
		if (spouseDep && spousePension) { spouseHe += `. ${sp.pension_he}: ${z.amounts.both_he}`; }
	}
	const housewife = sex === 'f' && status === 'housewife';
	const paySpouse = spouseDep && !spousePension && !housewife;
	const payKids = housewife ? 0 : kids;
	const deps = (spouseDep ? 1 : 0) + kids;
	const max = maxIncome(registry, deps);

	// 5. The pension at the start, the income test, the deferral.
	const shape = { spouse: paySpouse, kids: payKids, years, basicOnly };
	const start = pensionAt(registry, Object.assign({}, shape, { age80: conditional.date >= at80 }));
	let test = null;
	let testState = 'none';
	if (window > 0 && !immigrant) {
		test = disability ? { max: max.amount, work, other, otherCounted: 0, counted: 0, excess: 0, deduction: 0, partial: start.full, state: 'full', pay: start.full, end: 0, disability: true }
			: incomeTest(registry, start.full, work, other, max.amount);
		testState = test.state;
	}
	const waived = Boolean(test && waive && test.state === 'partial');
	const notPaidForWork = Boolean(test && !test.disability && ((test.state === 'none' && work > 0) || waived));
	const deferYears = notPaidForWork ? deferralYears(registry, workMonths) : 0;
	const deferPct = deferYears * z.deferral.pct_per_year;
	const otherOnly = Boolean(test && test.state === 'none' && work === 0);
	const otherMatters = Boolean(test && !test.disability && test.otherCounted > 0);

	// 6. The phases of the clock, in 2026 values.
	const phases = [];
	if (immigrant) {
		const sb = pensionAt(registry, Object.assign({}, shape, { basicOnly: true, age80: false }));
		phases.push({ key: 'special', from: ret.date, to: null, pay: sb.full, p: sb, he: 'גמלת אזרח ותיק מיוחדת (בדיקה בסניף)' });
	} else {
		if (window > 0) {
			phases.push({ key: 'test', from: conditional.date, to: stop, pay: waived ? 0 : test.pay, p: start, test, he: test.disability ? 'מגיל הפרישה, בלי מבחן הכנסות (מעבר מנכות)' : waived ? 'ויתור על הקצבה החלקית' : { full: 'מבחן הכנסות: קצבה מלאה', partial: 'מבחן הכנסות: קצבה חלקית', none: 'מבחן הכנסות: הקצבה לא משולמת' }[test.state] });
			if (stop < elig.date) {
				const p2 = pensionAt(registry, Object.assign({}, shape, { age80: false, deferPct }));
				const t2 = incomeTest(registry, p2.total, 0, other, max.amount);
				phases.push({ key: 'after', from: stop, to: elig.date, pay: t2.pay, p: p2, test: t2, he: deferPct ? `אחרי העבודה, עם תוספת דחייה של ${deferPct}%` : 'אחרי העבודה' });
			}
		}
		const p3 = pensionAt(registry, Object.assign({}, shape, { age80: false, deferPct }));
		if (elig.date < at80) { phases.push({ key: 'seventy', from: elig.date, to: at80, pay: p3.total, p: p3, he: deferPct ? `מגיל ${elig.years}: בלי מבחן הכנסות, עם תוספת דחייה של ${deferPct}%` : `מגיל ${elig.years}${elig.months ? ` ו-${elig.months} חודשים` : ''}: בלי מבחן הכנסות` }); }
		const p4 = pensionAt(registry, Object.assign({}, shape, { age80: true, deferPct }));
		phases.push({ key: 'eighty', from: elig.date > at80 ? elig.date : at80, to: null, pay: p4.total, p: p4, he: `מגיל ${z.amounts.from80}: הקצבה הבסיסית ${zkFmt(z.amounts.basic80)} במקום ${zkFmt(z.amounts.basic)}` });
	}
	const live = phases.filter((p) => p.to === null || p.to > today);
	const head = live.find((p) => p.pay > 0) || phases.find((p) => p.pay > 0) || phases[0];
	const seventy = phases.find((p) => p.key === 'seventy') || phases.find((p) => p.key === 'eighty');

	// 7. The gates.
	const gates = [];
	gates.push(immigrant ? { key: 'insured', state: 'route', he: z.insured.special_he, section: z.insured.section, url: z.insured.special_url }
		: { key: 'insured', state: 'ok', he: z.insured.he, section: z.insured.section, url: sex === 'f' ? z.insured.woman_url : z.insured.url });
	const retHe = `${ret.years}${ret.months ? ` ו-${ret.months} חודשים` : ''}`;
	gates.push({ key: 'age', state: toSeventy ? 'route' : 'ok', he: toSeventy ? `הקצבה מגיל ${elig.years}, ב-${zkHe(elig.date)} (גיל הפרישה ${retHe}, ב-${zkHe(ret.date)})` : `גיל הפרישה ${retHe}: ${conditional.date <= today ? 'הגעתם אליו' : 'תגיעו אליו'} ב-${zkHe(ret.date)}${sex === 'f' && womenStep > 0 ? ` (${womenStep} חודשים אחרי גיל ${z.ages.women_now_from})` : ''}`, section: sex === 'f' && birth >= `${z.ages.law_from_1956}-01` ? 'חוק גיל פרישה, התוספת' : z.ages.retirement_section, url: z.ages.url });
	gates.push({ key: 'achshara', state: achState, he: achHe, section: ac.section, url: sex === 'f' ? ac.woman_url : ac.url });
	if (test) {
		const tState = test.disability || test.state === 'full' ? (otherMatters ? 'check' : 'ok') : test.state === 'partial' ? (otherMatters ? 'check' : 'part') : (otherMatters ? 'check' : 'no');
		const tHe = test.disability ? it.disability_he
			: test.state === 'full' ? `הכנסה שנחשבת ${zkFmt(test.counted)} ש"ח, עד ההכנסה המרבית ${zkFmt(test.max)} ש"ח: קצבה מלאה`
				: test.state === 'partial' ? `${zkFmt(test.counted)} ש"ח: ${zkFmt(test.excess)} מעל ${zkFmt(test.max)}, ו-60% מזה (${zkFmt(test.deduction)}) יורדים מהקצבה${waived ? '; בחרתם לוותר עליה ולקבל תוספת דחייה' : ''}`
					: `${zkFmt(test.counted)} ש"ח: מהקצבה נשאר פחות מ-${zkFmt(it.min_partial)} ש"ח, ולכן עד גיל ${elig.years} היא לא משולמת`;
		gates.push({ key: 'income', state: tState, he: otherMatters ? `${tHe}. ההכנסה שלא מעבודה מעל פי ${it.both_other_mult} מההכנסה המרבית: לפי הספים שהמוסד מפרסם, החישוב לבדיקה` : tHe, section: test.disability ? 'סעיף 245(ב1)' : it.section, url: test.disability ? z.from_other.url : otherMatters ? it.other_url : it.work_url });
	}
	if (couple) { gates.push({ key: 'spouse', state: spouseState, he: spouseHe, section: sp.section, url: sex === 'm' ? sp.wife_url : sp.husband_url }); }
	const verdict = achState === 'no' ? 'no' : immigrant ? 'route' : gates.some((g) => g.state === 'check') ? 'check' : 'ok';
	const eligible = verdict !== 'no';

	// 8. The transition grant (s.269א), women born 1960-1966.
	let grant = null;
	const gr = z.grant;
	const by = Number(birth.slice(0, 4));
	if (sex === 'f' && by >= gr.born_from && by <= gr.born_to) {
		const from = addAge(birth, gr.from_age, 0);
		const to = addAge(birth, gr.from_age, gr.months);
		const deadline = addAge(birth, gr.claim_age, 0);
		const rate = gr.rates[String(by)];
		const achOk = achState === 'ok';
		const state = grantWork ? 'no' : immigrant || achState === 'no' ? 'no' : achOk ? 'ok' : 'check';
		grant = { from, to, deadline, rate, months: gr.months, total: rate * gr.months, state, past: deadline < today, running: from <= today && today < to };
	}

	// 9. The notes.
	const hl = z.health;
	const healthAmt = sex === 'f' && couple ? 0 : paySpouse || spousePension ? hl.couple : hl.single;
	if (achState === 'no') { add('bad', 'achshara', `${ac.he}. ${ac.later_he}.`, ac.section, ac.url); }
	if (immigrant) { add('warn', 'special', `${z.insured.special_he}.`, z.insured.section, z.insured.special_url); }
	if (test && test.state === 'none' && !test.disability) { add('warn', 'none', `${it.he}. עם ההכנסה הזאת הקצבה מתחילה בגיל ${elig.years}, ב-${zkHe(elig.date)}${deferPct ? `, עם תוספת דחייה של ${deferPct}%` : ''}.`, it.section, it.partial_url); }
	if (otherOnly) { add('warn', 'other_only', `${z.deferral.other_he}.`, z.deferral.section, z.deferral.url); }
	if (otherMatters) { add('warn', 'other', `${it.other_he}. החישוב כאן לפי אותו כלל של 60%, והסכום הסופי נקבע אצל פקיד התביעות.`, it.section, it.other_url); }
	if (test && test.state === 'partial' && !waived) { add('info', 'waive', `${it.waive_he}: ויתור בשנים שעד ${elig.years} מוסיף ${z.deferral.pct_per_year}% לכל שנה (${deferralYears(registry, workMonths) * z.deferral.pct_per_year}% על פני ${Math.round(workMonths / 12 * 10) / 10} שנים).`, z.deferral.section, z.deferral.url); }
	if (notPaidForWork && work > 0 && work <= max.amount) { add('warn', 'defer_check', 'הקצבה לא משולמת בגלל השילוב של הכנסה מעבודה והכנסה אחרת: תוספת הדחייה לבדיקה מול פקיד התביעות.', z.deferral.section, z.deferral.url); }
	if (couple && spouseDep && spousePension) { add('info', 'both', `${z.amounts.both_he}.`, z.amounts.section, z.amounts.url); }
	if (kids > z.amounts.max_children) { add('info', 'kids', `${z.amounts.children_he}.`, z.amounts.section, z.amounts.dependants_url); }
	if (kids > 0 && test && test.state !== 'full' && deps > 1) { add('info', 'deps', `${it.dependants_he}: כאן ${deps} תלויים, ${zkFmt(max.amount)} ש"ח. המחשבון של המוסד שולח לסניף מי שעובד ויש לו יותר משני ילדים.`, it.table_section, it.tables_url); }
	if (disability) { add('info', 'disability', `${it.disability_he}.`, 'סעיף 245(ב1)', z.from_other.url); }
	if (sex === 'f' && womenStep > 0) { add('info', 'women', `${z.ages.women_he}. אצלכם ${retHe}: ${womenStep} חודשים אחרי ${z.ages.women_now_from}.`, 'חוק גיל פרישה', z.ages.retirement_law_url); }
	if (housewife) { add('info', 'housewife', `${ac.housewife_he}. ${z.amounts.housewife_he}.`, ac.section, z.paid.url); }
	if (toSeventy && !housewife) { add('info', 'later', `${ac.later_he}.`, ac.section, ac.woman_url); }
	if (work > 0 && test && !test.disability) { add('info', 'extra', `${it.extra_he}. ${z.deferral.avtala_he}.`, it.section, it.extra_url); }
	add('info', 'excluded', `${it.excluded_he}.`, it.section, it.url);
	add('info', 'health', `${hl.he}${healthAmt === 0 ? `; ${hl.wife_he}` : ''}.`, '', hl.url);
	add('info', 'supplement', `${z.supplement.he}: עד ${zkFmt(z.supplement.table.to70[couple && paySpouse ? 'couple' : 'single'])} ש"ח בחודש עד גיל 70, כולל הקצבה.`, '', z.supplement.amounts_url);
	if (test && !test.disability) { add('info', 'report', `${it.report_he}.`, it.section, it.extra_url); }
	if (now.years >= elig.years && conditional.date <= today) { add('info', 'retro', `${z.claim.retro_he}.`, '', z.claim.url); }

	// 10. The dates.
	const fp = firstPay(z, birth, conditional.date);
	const deadlines = [];
	const dl = (key, date, he, section, url, ics) => deadlines.push({ key, date, he, section: section || '', url: url || '', ics: Boolean(ics) && date >= today, past: date < today });
	if (!toSeventy) { dl('retire', ret.date, `גיל הפרישה: ${retHe}${immigrant ? '' : '; מכאן הקצבה לפי מבחן הכנסות'}`, z.ages.retirement_section, z.ages.url, true); }
	if (eligible && !immigrant) {
		dl('first_pay', fp.date, `התשלום הראשון הצפוי, עבור ${zkMonthHe(fp.ym)}${fp.check ? ` (נולדתם ב-${z.claim.cutoff_day} בחודש: אולי רק ב${zkMonthHe(fp.alt)})` : ''}; אחר כך ב-${z.claim.pay_day} בכל חודש`, '', z.claim.payment_url, head && head.from === conditional.date && head.pay > 0);
		dl('claim_by', addMonths(conditional.date, z.claim.retro_months), `עד היום הזה מגישים תביעה בלי לאבד חודשים (עד ${z.claim.retro_months} חודשים אחורה)`, '', z.claim.url, true);
	}
	dl('seventy', elig.date, `גיל ${elig.years}${elig.months ? ` ו-${elig.months} חודשים` : ''}: הקצבה בלי מבחן הכנסות${toSeventy ? ', ומכאן היא מתחילה' : ''}`, z.ages.section, z.ages.eligibility_url, true);
	dl('eighty', at80, `גיל ${z.amounts.from80}: הקצבה הבסיסית עולה ל-${zkFmt(z.amounts.basic80)} ש"ח`, z.amounts.section80, z.amounts.url, true);
	if (grant) {
		dl('grant_from', grant.from, `גיל ${gr.from_age}: מתחילים 4 חודשי מענק המעבר`, gr.section, gr.url, false);
		dl('grant_by', grant.deadline, `גיל ${gr.claim_age}: היום האחרון להגיש בקשה למענק המעבר`, gr.section, gr.claim_url, grant.state !== 'no');
	}
	if (decision) {
		dl('decision', decision, 'נמסרה החלטת הביטוח הלאומי', '', z.appeal.url, false);
		dl('committee', addMonths(decision, z.appeal.committee_months), `היום האחרון לפנות לוועדת התביעות (${z.appeal.committee_months} חודשים, טופס ${z.appeal.committee_form})`, '', z.appeal.committee_url, true);
		dl('court', addMonths(decision, z.appeal.court_months), `היום האחרון להגיש תביעה לבית הדין האזורי לעבודה (${z.appeal.court_months} חודשים)`, '', z.appeal.court_url, true);
	}
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	// 11. The next steps and the rehearsal.
	const next = [];
	next.push({ he: 'הגשת תביעה לקצבת אזרח ותיק באתר הביטוח הלאומי', url: z.claim.url, kind: 'official' });
	if (grant && grant.state !== 'no' && !grant.past) { next.push({ he: 'בקשה למענק מעבר (עד גיל 64)', url: gr.claim_url, kind: 'official' }); }
	next.push({ he: 'השלמת הכנסה לפנסיונרים עם הכנסה נמוכה', url: '/havtachat-hachnasa/', kind: 'site' });
	next.push(verdict === 'no' || decision ? { he: 'ערר וערעור על החלטות הביטוח הלאומי', url: '/bituach-leumi-appeal-guide/', kind: 'site' } : { he: 'מה עוד מגיע לפנסיונרים: זכויות פנסיה', url: '/pension-rights-israel/', kind: 'site' });
	const rehearse = verdict === 'no' || decision
		? { purpose: 'court_rehearsal', url: z.rehearse_url, he: `${decision ? 'יש החלטה' : 'לפי מה שהוזן אין זכאות'}: לתרגל את הדיון בבית הדין האזורי לעבודה, שבו מערערים על החלטת הביטוח הלאומי בתוך ${z.appeal.court_months} חודשים` }
		: { purpose: 'witness_prep', url: z.rehearse_url.replace('court_rehearsal', 'witness_prep'), he: test && test.state !== 'full' ? 'לתרגל את השיחה עם פקיד התביעות: ההכנסות בין גיל הפרישה ל-70, ויתור על קצבה חלקית ותוספת הדחייה' : 'לתרגל את השיחה עם פקיד התביעות: תקופות הביטוח, בן או בת הזוג והמסמכים' };

	return {
		ok: true, verdict, eligible, sex, birth, fam, couple, kids, years, status, work, other, spouseBirth, spouseIncome, spousePension, together,
		workYears, waive, waived, disability, immigrant, grantWork, decision, today, now, ret, elig, at80, conditional, toSeventy, basicOnly, womenStep,
		window, workMonths, stop, deps, max, start, test, testState, deferYears, deferPct, otherMatters, spouseDep, spouseAge, paySpouse,
		phases, head, seventy, gates, flags, grant, firstPay: fp, deadlines, next, rehearse, health: healthAmt,
		net: head ? Math.max(0, head.pay - healthAmt) : 0,
	};
}
