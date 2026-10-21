/**
 * National Insurance and health-insurance contributions for 2026 (the rights wave, 21.10.2026; tool dmei-bituach).
 *
 * Dependency-free ES module. Every number comes from registry.rights_bituach, read on its checked_on date:
 *  - Two tiers: the reduced rate on income up to the reduced collection tier (s.334(א), 7,703 from 1.1.2026; since
 *    amendment 256 a fixed sum indexed by the CPI, no longer 60% of the average wage), the full rate above it, nothing
 *    above the maximum insurable income (s.348(א); Table 11 items 1-2: basic amount x 5 = 51,910).
 *  - Employees: the Institute's table by age (18 to retirement age; under 18; a woman between her retirement age and 67;
 *    67 to 70 without an old-age pension; an old-age pensioner, from whose salary nothing is deducted, s.342(ג)(2)), the
 *    employer's share by the same tiers, and the annual-certificate row for disability pensioners.
 *  - Several employers: each employer pays as if it alone were the employer (s.342(ב)); the secondary employer deducts at
 *    the full rate also below the tier once form 101 says there is other income (s.342(ה)(3)); the difference against the
 *    contributions "as if one employer paid" is owed or refunded (s.342(ד)): forms 657 and 752, 7 years back.
 *  - Self-employed: the base is the income after deducting 52% of the National Insurance contributions (s.345(ב)(1)(א)
 *    and s.47A of the Income Tax Ordinance), by the Institute's own formula; never below the minimum income (Table 11 item
 *    2: 25% of the average wage = 3,442); with a salary, the reduced rate only on the gap between the salary and the tier
 *    (s.342(ו)); the advance is due on the dues calendar's day of each month; form 672 changes it.
 *  - Early pension: its own rates (s.345ב), counted only up to the ceiling left after other income (s.345ב(ג)(1)); with
 *    a salary, the reduced rate only on the gap between the salary and the tier (s.345ב(ה)); not deducted from the
 *    retirement age on; below the 5% minimum with no other income, the minimum (s.345ב(ג)(2)).
 *  - Not working: the published monthly minimum (143 + 123), a student's 171, or income not from work at its rates after
 *    the 3,442 that is not counted (s.348(א1)), never below the minimum.
 *  - Retirement age: men 67, women by month of birth from the Institute's table; 70 for the old-age pension without an
 *    income test.
 */

export const STATUSES = ['employee', 'self', 'both', 'none', 'pension'];
export const BANDS = ['u18', 'work', 'w_ret', 'r67', 'oap'];
export const NONE_KINDS = ['none', 'student', 'passive'];

const r2 = (n) => Math.round((Number(n) + 1e-9) * 100) / 100;
const blankish = (v) => v === '' || v === undefined || v === null;
const numOr = (v) => (blankish(v) ? null : Number(v));

/** Split an income slice that starts after `from` (income already counted below it) into the reduced part, the full part
 * and the part above the ceiling. */
export function tierParts(amount, from, tier, max) {
	const a = Math.max(0, Number(amount) || 0);
	const f = Math.max(0, Number(from) || 0);
	const reduced = Math.max(0, Math.min(f + a, tier) - Math.min(f, tier));
	const full = Math.max(0, Math.min(f + a, max) - Math.max(f, tier));
	const above = Math.max(0, f + a - Math.max(f, max));
	return { reduced: r2(reduced), full: r2(full), above: r2(above) };
}

/** Contributions on the two parts: National Insurance, health and (for an employee) the employer, each part rounded to
 * the agora as a payslip line. */
export function charge(parts, rate) {
	const p = (x, r) => r2(x * r / 100);
	const blR = p(parts.reduced, rate.bl[0]);
	const blF = p(parts.full, rate.bl[1]);
	const hR = p(parts.reduced, rate.health[0]);
	const hF = p(parts.full, rate.health[1]);
	const eR = rate.employer ? p(parts.reduced, rate.employer[0]) : 0;
	const eF = rate.employer ? p(parts.full, rate.employer[1]) : 0;
	return { blR, blF, hR, hF, eR, eF, bl: r2(blR + blF), health: r2(hR + hF), employer: r2(eR + eF), total: r2(blR + blF + hR + hF) };
}

/**
 * The self-employed base after the 52% deduction (s.345(ב)(1)(א); the Institute's formula x = (y + m·d·(t2−t1)) / (1 + d·t2),
 * and x = y / (1 + d·t1) while the base stays within the reduced room): y the monthly taxable income, room the reduced
 * tier left after a salary, cap the ceiling left, t1/t2 the National Insurance rates (no health), d the deductible percent.
 */
export function selfBase(y, room, cap, t1, t2, d) {
	if (!(y > 0) || cap <= 0) { return 0; }
	const k = d / 100;
	const a = t1 / 100;
	const b = t2 / 100;
	let x = y / (1 + k * a);
	if (x > room) { x = (y + k * room * (b - a)) / (1 + k * b); }
	return r2(Math.min(x, cap));
}

/** "YYYY-MM" from "4/1963", "04.1963", "1963-04"; '' when it is not a month. */
export function monthOf(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})$/);
	if (m) { return +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}-${m[2].padStart(2, '0')}` : ''; }
	m = raw.match(/^(\d{1,2})[./-](\d{4})$/);
	if (m) { return +m[1] >= 1 && +m[1] <= 12 ? `${m[2]}-${m[1].padStart(2, '0')}` : ''; }
	return '';
}
const monthIndex = (ym) => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
const monthText = (idx) => `${idx % 12 + 1}.${Math.floor(idx / 12)}`;

/** Retirement age by sex and month of birth (the Institute's table; men 67). */
export function retirementAge(rb, sex, born) {
	const t = rb.retirement;
	if (sex !== 'f') { return { y: t.men[0], m: t.men[1] }; }
	const row = t.women.find((w) => born <= w[0]);
	return row ? { y: row[1], m: row[2] } : { y: t.women_after[0], m: t.women_after[1] };
}

/**
 * The age band for a month: under 18, 18 to retirement age, a woman between her retirement age and 67, 67 to 70 without
 * an old-age pension, an old-age pensioner (or 70 and over). Month precision: in the month of a birthday the band of the
 * new age is shown and `edge` says the exact day decides.
 */
export function bandFor(rb, sex, born, month, oap) {
	const age = monthIndex(month) - monthIndex(born);
	const ret = retirementAge(rb, sex, born);
	const retAt = ret.y * 12 + ret.m;
	const ent = rb.retirement.entitlement_age * 12;
	let band;
	if (age < 18 * 12) { band = 'u18'; } else if (age < retAt) { band = 'work'; } else if (age >= ent || oap) { band = 'oap'; } else if (sex === 'f' && age < 67 * 12) { band = 'w_ret'; } else { band = 'r67'; }
	const edges = [18 * 12, retAt, 67 * 12, ent];
	return {
		band, ageY: Math.floor(age / 12), ageM: age % 12, ret, sex: sex === 'f' ? 'f' : 'm',
		retMonth: monthText(monthIndex(born) + retAt), month70: monthText(monthIndex(born) + ent), edge: edges.includes(age),
	};
}

function employeeRate(rb, band, disabled) {
	if (disabled && band === 'work') { return rb.employee.disabled; }
	return rb.employee[band];
}
function selfRate(rb, band) {
	return rb.self[band === 'w_ret' || band === 'r67' ? 'ret' : band];
}

/**
 * input = { status (STATUSES), band (BANDS), salary (the main employer, monthly gross), extra ([other employers' salaries]),
 *           mode ('full': the secondary employer deducts at the full rate, form 101 marked; 'tier': each as if alone),
 *           selfIncome (monthly taxable income from the business, before the 52% deduction), pension (early pension,
 *           monthly), noneKind (NONE_KINDS), passive (monthly income not from work), disabled (the annual certificate),
 *           pensionExempt (a signed exemption for the pension), sex ('m'|'f'), born ('YYYY-MM' or '4/1963'), oap (receives
 *           an old-age pension), month ('YYYY-MM', the month computed: the age band from the birth month) }
 */
export function compute(registry, input) {
	const rb = registry.rights_bituach;
	const T = rb.tier.amount;
	const M = rb.max.amount;
	const errors = [];
	const status = STATUSES.includes(input.status) ? input.status : 'employee';
	const born = monthOf(input.born);
	const month = monthOf(input.month) || `${rb.year}-01`;
	if (!blankish(input.born) && !born) { errors.push({ field: 'born', he: 'חודש ושנת לידה, לדוגמה 4/1963' }); }
	if (born && monthIndex(born) > monthIndex(month)) { errors.push({ field: 'born', he: 'חודש הלידה אחרי החודש שמחשבים' }); }
	const age = born && monthIndex(born) <= monthIndex(month) ? bandFor(rb, input.sex, born, month, Boolean(input.oap)) : null;
	const band = age ? age.band : BANDS.includes(input.band) ? input.band : 'work';
	const money1 = (v) => Number.isFinite(v) && v >= 0 && v < 1e7;
	const salaryIn = numOr(input.salary);
	const extras = (Array.isArray(input.extra) ? input.extra : []).filter((v) => !blankish(v)).map(Number);
	const usesSalary = status === 'employee' || status === 'both' || status === 'pension';
	if (status === 'employee' || status === 'both') {
		if (!(money1(salaryIn) && salaryIn > 0)) { errors.push({ field: 'salary', he: 'השכר החודשי ברוטו: מספר חיובי' }); }
	}
	if (status === 'pension' && salaryIn !== null && !money1(salaryIn)) { errors.push({ field: 'salary', he: 'השכר החודשי ברוטו: מספר חיובי, 0 או ריק' }); }
	if (usesSalary) { extras.forEach((v, i) => { if (!(money1(v) && v > 0)) { errors.push({ field: `extra${i}`, he: 'השכר אצל המעסיק הנוסף: מספר חיובי, או להשאיר ריק' }); } }); }
	const selfIn = numOr(input.selfIncome);
	if ((status === 'self' || status === 'both') && !(money1(selfIn))) { errors.push({ field: 'selfIncome', he: 'ההכנסה החייבת החודשית מהעסק: מספר, 0 ומעלה' }); }
	const pensionIn = numOr(input.pension);
	if (status === 'pension' && !(money1(pensionIn) && pensionIn > 0)) { errors.push({ field: 'pension', he: 'הפנסיה המוקדמת החודשית ברוטו: מספר חיובי' }); }
	const noneKind = NONE_KINDS.includes(input.noneKind) ? input.noneKind : 'none';
	const passiveIn = numOr(input.passive);
	if (status === 'none' && noneKind === 'passive' && !(money1(passiveIn) && passiveIn > 0)) { errors.push({ field: 'passive', he: 'ההכנסה החודשית שלא מעבודה (שכירות, דיבידנד, ריבית): מספר חיובי' }); }
	// Who the published rates cover (the band chips and the status chips together).
	if (status === 'pension' && band === 'u18') { errors.push({ field: 'band', he: 'פנסיה מוקדמת משתלמת למי שפרש מעבודה לפני גיל הפרישה; לגיל מתחת ל-18 אין חישוב כזה' }); }
	if (status === 'none' && band === 'u18') { errors.push({ field: 'band', he: 'דמי ביטוח בריאות משלם כל תושב מגיל 18; מי שלא עובד מתחת לגיל 18 לא מחושב כאן' }); }
	if (status === 'none' && (band === 'w_ret' || band === 'r67')) { errors.push({ field: 'band', he: 'למי שהגיע לגיל הפרישה, לא עובד ולא מקבל קצבת אזרח ותיק, דף השיעורים של הביטוח הלאומי לא מפרסם סכום. בדקו באזור האישי באתר הביטוח הלאומי' }); }
	if (status === 'none' && band === 'oap' && noneKind !== 'none') { errors.push({ field: 'noneKind', he: 'למקבלי קצבת אזרח ותיק דמי ביטוח הבריאות מנוכים מהקצבה; בחרו "בלי הכנסות"' }); }
	if (status === 'none' && noneKind === 'student' && band !== 'work') { errors.push({ field: 'noneKind', he: 'הסכום לסטודנט מתפרסם לסטודנט שלא עובד, מגיל 18 ועד גיל הפרישה' }); }
	if (extras.length > 2) { errors.push({ field: 'extra2', he: 'עד שלושה מעסיקים במחשבון' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (code, he, section, url) => flags.push({ code, he, section: section || '', url: url || '' });
	const empRate = employeeRate(rb, band, Boolean(input.disabled));
	const salaries = usesSalary ? [salaryIn || 0].concat(extras).filter((v, i) => v > 0 || i === 0) : [];
	const S = r2(salaries.reduce((t, v) => t + v, 0));
	const out = { ok: true, status, band, age, T, M, flags, salaries, S };

	// 1. Salaries, by law: one tier and one ceiling over all employers together.
	if (usesSalary && S > 0) {
		const parts = tierParts(S, 0, T, M);
		const c = charge(parts, empRate);
		// The employer's share: each employer as if it alone were the employer (s.342(ב)).
		const employer = r2(salaries.reduce((t, s) => t + charge(tierParts(s, 0, T, M), empRate).employer, 0));
		out.salary = { parts, charge: c, rate: empRate, employer, cost: r2(S + employer), net: r2(S - c.total) };
		if (parts.above > 0) { add('above', `על ${amountText(parts.above)} ₪ שמעל ההכנסה המרבית (${amountText(M)} ₪) לא משלמים דמי ביטוח.`, rb.max.section, rb.max.url); }
		if (band === 'u18') { add('u18', 'עד גיל 18 לא מנכים משכר העובד דמי ביטוח לאומי ובריאות; המעסיק משלם את חלקו.', '', rb.employee.url); }
		if (band === 'oap') { add('oap', `${rb.employee.oap.section_he}.`, rb.employee.oap.section, rb.law_url); }
		if (input.disabled && band === 'work') { add('disabled', 'בלי ניכוי ביטוח לאומי מהשכר, רק דמי ביטוח בריאות: בתנאי שיש אישור שנתי מהביטוח הלאומי, ושהמעסיק קיבל אותו.', '', rb.employee.url); }
		if (empRate.derived) { add('derived', `השיעור הכולל שמנוכה מהעובד (${empRate.total[0]}% ו-${empRate.total[1]}%) מתפרסם בטבלה של הביטוח הלאומי; חלוקתו לביטוח לאומי ולבריאות מחושבת לפי שיעורי דמי ביטוח בריאות לעובד שכיר (${empRate.health[0]}% ו-${empRate.health[1]}%).`, '', rb.employee.health_url); }
	}
	// 2. Self-employed income: after the salary in the order of the law.
	if (status === 'self' || status === 'both') {
		const sr = selfRate(rb, band);
		const room = Math.max(0, T - S);
		const cap = Math.max(0, M - S);
		const y = selfIn;
		let base = selfBase(y, room, cap, sr.bl[0], sr.bl[1], rb.self.deduct_pct);
		let minApplied = false;
		if (status === 'self' && base < rb.min_self.amount) { base = rb.min_self.amount; minApplied = true; }
		const reduced = r2(Math.min(base, room));
		const parts = { reduced, full: r2(base - reduced), above: 0 };
		const c = charge(parts, sr);
		if (cap > 0 && y > 0 && base >= cap - 0.005) { add('above_self', `הבסיס לדמי הביטוח מגיע להכנסה המרבית (${amountText(M)} ₪${S > 0 ? ' יחד עם השכר' : ''}); על ההכנסה שמעליה לא משלמים דמי ביטוח.`, rb.max.section, rb.max.url); }
		const deduct = r2(c.bl * rb.self.deduct_pct / 100);
		out.self = { income: y, base, room, cap, minApplied, parts, charge: c, rate: sr, deduct, deductAnnual: r2(c.bl * 12 * rb.self.deduct_pct / 100), aboveCap: y > 0 && base >= cap && cap > 0 };
		if (minApplied) { add('min_self', `ההכנסה נמוכה מההכנסה המזערית לעצמאי: משלמים כאילו ההכנסה ${amountText(rb.min_self.amount)} ₪. ${rb.min_self.definition_he} (${rb.min_self.definition_section}).`, rb.min_self.section, rb.min_self.url); }
		if (status === 'both' && y > 0 && base < rb.min_self.amount) { add('both_min', `ההכנסה כעצמאי נמוכה מ-${amountText(rb.min_self.amount)} ₪ (ההכנסה המזערית לעצמאי). כשיש גם שכר, המחשבון לא מחיל עליה את הבסיס המזערי; את החיוב הקובע קובע הביטוח הלאומי.`, rb.min_self.section, rb.min_self.url); }
		if (status === 'both' && S >= M) { add('both_cap', `השכר כבר מגיע להכנסה המרבית (${amountText(M)} ₪), ולכן על ההכנסה כעצמאי לא משלמים דמי ביטוח.`, rb.mixed.section, rb.mixed.url); }
		if (sr.derived) { add('derived_self', `השיעור הכולל לעצמאי שהגיע לגיל הפרישה (${sr.total[0]}% ו-${sr.total[1]}%) מתפרסם בדף השיעורים; חלק הביטוח הלאומי בו (לניכוי של ${rb.self.deduct_pct}%) מחושב לפי שיעורי דמי ביטוח בריאות לעצמאי. מחשבון הביטוח הלאומי עצמו לא מחשב עצמאי בגיל הפרישה.`, '', rb.self.url); }
		if (band === 'oap') { add('oap_self', `דמי ביטוח הבריאות של מקבל קצבת אזרח ותיק מנוכים מהקצבה (${amountText(rb.oap_health.single)} ₪ ליחיד בלי השלמת הכנסה), ולא מההכנסה מהעסק.`, '', rb.oap_health.url); }
		if (band === 'u18') { add('u18_self', 'עד גיל 18 עצמאי פטור מדמי ביטוח בריאות ומשלם ביטוח לאומי בשיעור מופחת.', '', rb.self.url); }
	}
	// 3. Early pension, last in the order of the law.
	if (status === 'pension') {
		const P = pensionIn;
		const pr = rb.pension;
		const retired = band !== 'work';
		const exempt = Boolean(input.pensionExempt);
		let counted = retired || exempt ? 0 : Math.min(P, Math.max(0, M - S));
		let minApplied = false;
		if (!retired && !exempt && S === 0 && P < rb.min_pension.amount) { counted = rb.min_pension.amount; minApplied = true; }
		const room = S > 0 ? Math.max(0, T - S) : T;
		const reduced = r2(Math.min(counted, room));
		const parts = { reduced, full: r2(counted - reduced), above: r2(Math.max(0, P - counted)) };
		const c = charge(parts, pr);
		out.pension = { amount: P, counted: r2(counted), parts, charge: c, rate: pr, retired, exempt, minApplied };
		if (retired) { add('pension_retired', 'מגיל הפרישה משלם הפנסיה לא מנכה ממנה דמי ביטוח לאומי ובריאות (ולפני כן היא נקראת פנסיה מוקדמת).', pr.section, pr.exempt_url); }
		if (exempt && !retired) { add('pension_exempt', `${pr.exempt_he}.`, '', pr.exempt_url); }
		if (minApplied) { add('min_pension', `הפנסיה נמוכה מההכנסה המזערית (${rb.min_pension.pct}% מהשכר הממוצע, ${amountText(rb.min_pension.amount)} ₪) ואין הכנסה אחרת: משלמים כאילו הפנסיה היא ההכנסה המזערית.`, rb.min_pension.section, rb.min_pension.url); }
		if (S > 0 && S < T && !retired && !exempt) { add('pension_room', `השיעור המופחת חל על הפנסיה רק על ההפרש בין השכר (${amountText(S)} ₪) למדרגה המופחתת (${amountText(T)} ₪).`, pr.with_work_section, rb.law_url); }
		if (S >= T && !retired && !exempt) { add('pension_full', 'השכר כבר ממצה את המדרגה המופחתת, ולכן על כל הפנסיה חל השיעור המלא.', pr.with_work_section, rb.law_url); }
	}
	// 4. Not working.
	if (status === 'none') {
		const nn = rb.none;
		if (band === 'oap') {
			out.none = { kind: 'oap', total: rb.oap_health.single, bl: 0, health: rb.oap_health.single };
		} else if (noneKind === 'student') {
			out.none = { kind: 'student', total: rb.student.total, bl: null, health: null };
		} else if (noneKind === 'passive') {
			const I = passiveIn;
			const counted = Math.max(0, Math.min(I, M) - rb.passive_exempt.amount);
			const parts = tierParts(counted, 0, T, M);
			const c = charge(parts, nn.passive);
			const minApplied = c.total < nn.total;
			out.none = { kind: 'passive', income: I, counted: r2(counted), parts, charge: c, minApplied, total: minApplied ? nn.total : c.total, bl: minApplied ? nn.bl : c.bl, health: minApplied ? nn.health : c.health };
			if (minApplied) { add('min_none', `דמי הביטוח על ההכנסה נמוכים מהסכום המינימלי למי שלא עובד, ולכן משלמים ${amountText(nn.total)} ₪ (${amountText(nn.bl)} ₪ ביטוח לאומי ו-${amountText(nn.health)} ₪ ביטוח בריאות).`, '', nn.url); }
			if (I > M) { add('above', `על ${amountText(r2(I - M))} ₪ שמעל ההכנסה המרבית (${amountText(M)} ₪) לא משלמים דמי ביטוח.`, rb.max.section, rb.max.url); }
		} else {
			out.none = { kind: 'none', total: nn.total, bl: nn.bl, health: nn.health };
			add('homemaker', `${nn.homemaker_he}.`, nn.homemaker_section, nn.homemaker_url);
		}
	}
	// 5. Several payers: the payslips against the law (s.342(ב), (ד), (ה)).
	const payers = [];
	if (usesSalary) { salaries.forEach((s, i) => { if (s > 0) { payers.push({ kind: 'salary', idx: i, amount: s, rate: empRate }); } }); }
	if (out.pension && out.pension.counted > 0) { payers.push({ kind: 'pension', amount: out.pension.amount, rate: rb.pension }); }
	const mode = input.mode === 'tier' ? 'tier' : 'full';
	out.payers = payers.map((p, i) => {
		const secondaryFull = i > 0 && mode === 'full';
		const parts = secondaryFull ? { reduced: 0, full: r2(Math.min(p.amount, M)), above: r2(Math.max(0, p.amount - M)) } : tierParts(p.amount, 0, T, M);
		return Object.assign({}, p, { main: i === 0, parts, charge: charge(parts, p.rate) });
	});
	out.mode = mode;
	if (payers.length > 1) {
		const actual = r2(out.payers.reduce((t, p) => t + p.charge.total, 0));
		const law = r2((out.salary ? out.salary.charge.total : 0) + (out.pension ? out.pension.charge.total : 0));
		const diff = r2(actual - law);
		const main = payers[0].amount;
		const total = r2(payers.reduce((t, p) => t + p.amount, 0));
		const form = total > M ? 'max' : main < T ? 'low' : null;
		out.coord = { actual, law, diff, kind: diff > 0.004 ? 'refund' : diff < -0.004 ? 'owe' : 'none', form, main, total, annual: r2(Math.abs(diff) * 12) };
	} else {
		out.coord = null;
	}
	// 6. The month and the year.
	const oapHealth = band === 'oap' && status !== 'none' ? rb.oap_health.single : 0;
	const bl = r2((out.salary ? out.salary.charge.bl : 0) + (out.self ? out.self.charge.bl : 0) + (out.pension ? out.pension.charge.bl : 0) + (out.none && out.none.bl ? out.none.bl : 0));
	const health = r2((out.salary ? out.salary.charge.health : 0) + (out.self ? out.self.charge.health : 0) + (out.pension ? out.pension.charge.health : 0) + (out.none && out.none.health ? out.none.health : 0) + oapHealth);
	const total = out.none && out.none.kind === 'student' ? out.none.total : r2(bl + health);
	const employer = out.salary ? out.salary.employer : 0;
	out.oapHealth = oapHealth;
	if (band === 'oap') { add('oap_health', `מקצבת אזרח ותיק מנוכים דמי ביטוח בריאות: ${amountText(rb.oap_health.single)} ₪ ליחיד בלי השלמת הכנסה, ${amountText(rb.oap_health.with_supplement)} ₪ עם השלמת הכנסה, ${amountText(rb.oap_health.couple)} ₪ לזוג. ${rb.oap_health.other_income_he}.`, '', rb.oap_health.url); }
	out.monthly = { bl, health, total, employer };
	out.annual = { bl: r2(bl * 12), health: r2(health * 12), total: r2(total * 12), employer: r2(employer * 12) };
	// What is paid directly to the Institute each month (the self-employed advance, the not-working payment).
	out.direct = r2((out.self ? out.self.charge.total : 0) + (out.none && out.none.kind !== 'oap' ? out.none.total : 0));
	out.incomeBand = incomeBand(S + (out.self ? out.self.income : 0) + (out.pension ? out.pension.amount : 0) + (out.none && out.none.income ? out.none.income : 0), T, M);
	return out;
}

/** A coarse band for analytics only: never an amount. */
export function incomeBand(total, tier, max) {
	if (!(total > 0)) { return 'none'; }
	if (total <= tier) { return 'below_tier'; }
	if (total <= max) { return 'between'; }
	return 'above_max';
}

/** 7,703 or 7,703.50: for the engine's own sentences. */
export function amountText(n) {
	const v = r2(n);
	return v.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 });
}

/** The dues days of the year that are still ahead (the Institute's calendar), for the self-employed advance. */
export function duesAhead(rb, today) {
	return rb.dues.dates.filter((d) => d >= today);
}
