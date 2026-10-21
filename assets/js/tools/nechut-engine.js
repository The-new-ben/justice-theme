/**
 * The rights wave (21.10.2026): the general disability pension (קצבת נכות כללית) with work income, from the eligibility gate
 * to the appeal deadline.
 *
 * Dependency-free ES module (dates.js only). Every number comes from registry.rights_nechut (the National Insurance
 * Institute's general-disability pages and chapter 9 of the National Insurance Law, read on its checked_on date) and
 * registry.rights_btl (the average wage of section 2 and basic amount 4, from 1.1.2026):
 *  - The gate: 18 to the retirement age (s.195, "insured"); a medical disability of 60%, or 40% with one impairment of 25%
 *    (s.208(א)), 50% for a homemaker (the Institute's homemaker pages); a loss of 50% of the capacity to earn, set as a
 *    degree of 60, 65, 74 or 100% (s.195 "disabled" (2), s.209(א1)); a new claimant's work income not above 60% of the
 *    average wage for 90 days (s.195 "disabled" (3)).
 *  - The amount: the Institute's 2026 table by degree (ss.200, 201); a spouse whose income is up to 57% of the average wage
 *    (schedule 9) and the first two children (s.200(ג)-(ד)); a partial degree gets the degree's share of the additions, and
 *    the full additions once its work income is above 21% of the average wage (s.201(ב)).
 *  - Work income: schedule 8.1 deducts 0/30/40/60% of the parts of the income up to 50.23/68/93% of the average wage and
 *    above, from the full monthly pension and then from the additions; a partial degree is paid the lower of that and its
 *    own amount (s.202(ב)(2)); nothing is paid below 2.68% of the basic amount (s.202(ג)); other income above 11.37% of the
 *    average wage cuts only what is above the full pension (s.202(ב)(3)).
 *  - The clock: the pension from the 91st day after the determining date (s.196(ב)), the 31st for a 100% degree of six
 *    months (s.196(ג)); the determining date no earlier than 15 months before the claim (s.195); payment for at most the 12
 *    months before the month of the claim (s.296(ב)(1)); 60 days to appeal to the committees, 60 days from their decision to
 *    the labour court, 12 months for other decisions (the Institute's appeal page; s.213).
 */

import { addDays, addMonths, parseDate, offRestDays } from './dates.js';

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const heDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const shekels = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
export const STATUSES = ['new', 'receiving'];
export const SPOUSE_KINDS = ['none', 'dep', 'earns'];

/** The 1st of the month of a day. */
export function firstOfMonth(iso) { return `${iso.slice(0, 7)}-01`; }

/** Several impairments: each one is taken from what the earlier ones left (the Institute's medical page), largest first. */
export function weightedMedical(list) {
	const ps = list.map(Number).filter((p) => p > 0).sort((a, b) => b - a);
	let rest = 1;
	const steps = ps.map((p) => {
		const from = rest * 100;
		const add = from * p / 100;
		rest *= (100 - p) / 100;
		return { p, from: r2(from), add: r2(add) };
	});
	return { total: ps.length ? r2(100 - rest * 100) : 0, largest: ps.length ? ps[0] : 0, steps };
}

/** Schedule 8.1 (s.202(ב)(2)): the deduction for a monthly work income, part by part, exact and to the shekel. */
export function laronDeduction(nc, avg, wage) {
	let prev = 0;
	let sum = 0;
	const parts = nc.work.tiers.map((t) => {
		const upto = t.to_pct === null ? Infinity : avg * t.to_pct / 100;
		const part = Math.max(0, Math.min(wage, upto) - prev);
		const cut = part * t.rate / 100;
		sum += cut;
		const row = { from: r2(prev), to: upto === Infinity ? null : r2(upto), part: r2(part), rate: t.rate, cut: r2(cut), he: t.he };
		prev = upto;
		return row;
	});
	return { parts, exact: sum, rounded: Math.round(sum) };
}

/** The work income at which the schedule-8.1 deduction reaches an amount (the inverse of laronDeduction). */
export function wageForDeduction(nc, avg, target) {
	let prev = 0;
	let sum = 0;
	for (const t of nc.work.tiers) {
		const upto = t.to_pct === null ? Infinity : avg * t.to_pct / 100;
		const span = (upto - prev) * t.rate / 100;
		if (t.rate > 0 && sum + span >= target) { return prev + (target - sum) / (t.rate / 100); }
		sum += t.rate > 0 ? span : 0;
		prev = upto;
	}
	return Infinity;
}

/** The thresholds of the average wage the law uses (rights_btl, s.2): exact, for the comparisons. */
export function thresholds(registry) {
	const nc = registry.rights_nechut;
	const avg = registry.rights_btl.avg_wage.s2_benefits;
	const tiers = nc.work.tiers.filter((t) => t.to_pct !== null).map((t) => avg * t.to_pct / 100);
	return {
		avg, t21: avg * nc.work.full_add_pct / 100, t60: avg * nc.work.new_claim_pct / 100, tiers,
		spouseMax: avg * nc.dependents.spouse_income_pct / 100,
		minPay: registry.rights_btl.basic_amount.b4 * nc.work.min_pct_of_basic / 100,
	};
}

/**
 * The monthly pension for a degree, a family and a work income (ss.200-202), before any gate.
 * o = { degree (60|65|74|100), spouseDep (bool), kids (n), wage, other, homemaker (bool) }
 */
export function pensionAt(registry, o) {
	const nc = registry.rights_nechut;
	const th = thresholds(registry);
	const table = nc.pension.amounts;
	const full = table['100'];
	const row = table[String(o.degree)];
	const kidsN = Math.min(Math.max(0, o.kids || 0), nc.dependents.children_max);
	const spouse = Boolean(o.spouseDep) && !o.homemaker;
	const fullAdd = (spouse ? full.spouse : 0) + kidsN * full.child;
	const w = o.homemaker ? 0 : Math.max(0, Number(o.wage) || 0);
	const partialAdd = o.degree === 100 ? fullAdd : Math.round(o.degree / 100 * fullAdd);
	const addFull = o.degree === 100 || w > th.t21;
	const addB = addFull ? fullAdd : partialAdd;
	const own = row.pension + addB;
	const ded = laronDeduction(nc, th.avg, w);
	const fromFull = full.pension + fullAdd - ded.rounded;
	const laronBinds = fromFull < own;
	let pay = Math.max(0, Math.min(fromFull, own));
	const disregard = o.homemaker ? 0 : nc.other_income.disregard;
	const other = Math.max(0, Number(o.other) || 0);
	let otherCut = Math.min(Math.max(0, other - disregard), Math.max(0, pay - full.pension));
	if (o.homemaker) { otherCut = Math.min(otherCut, kidsN ? addB : 0); }
	pay -= otherCut;
	const beforeMin = pay;
	const belowMin = pay > 0 && pay < th.minPay;
	if (belowMin) { pay = 0; }
	return { degree: o.degree, pension: row.pension, fullAdd, partialAdd, addB, addFull, own, fromFull, ded, laronBinds, otherCut, other, disregard, beforeMin, belowMin, pay, kidsN, spouse, wage: w };
}

/** The wage above which a partial degree's own amount stops protecting the pension (fromFull = own), exact. */
export function crossoverWage(registry, degree) {
	const nc = registry.rights_nechut;
	if (degree === 100) { return thresholds(registry).tiers[0]; }
	return wageForDeduction(nc, thresholds(registry).avg, nc.pension.amounts['100'].pension - nc.pension.amounts[String(degree)].pension);
}

/** The first whole-shekel wage from which no pension is paid (it never comes back above it). */
export function endWage(registry, o) {
	let lo = Math.floor(thresholds(registry).t21) + 1;
	let hi = 200000;
	if (pensionAt(registry, Object.assign({}, o, { wage: lo })).pay === 0) { return lo; }
	while (hi - lo > 1) {
		const mid = Math.floor((lo + hi) / 2);
		if (pensionAt(registry, Object.assign({}, o, { wage: mid })).pay === 0) { hi = mid; } else { lo = mid; }
	}
	return hi;
}

/** Of every extra 100 shekels of work just above a wage, how many stay (the pension's own reduction only). */
export function keepAt(registry, o, wage) {
	const p = pensionAt(registry, Object.assign({}, o, { wage }));
	if (p.pay === 0 || o.homemaker) { return 100; }
	if (o.degree !== 100 && wage < crossoverWage(registry, o.degree)) { return 100; }
	const th = thresholds(registry);
	const i = th.tiers.findIndex((t) => wage < t);
	const tier = registry.rights_nechut.work.tiers[i === -1 ? th.tiers.length : i];
	return 100 - tier.rate;
}

/**
 * input = { age, sex ('m'|'f'|''), status ('new'|'receiving'), homemaker (bool), medMode ('total'|'list'), med (total %),
 *           single (the largest single impairment %, optional), meds (impairments %, list mode), degree (0 = a loss under 50%,
 *           or 60|65|74|100), spouse ('none'|'dep'|'earns'), kids (0..20), wage (monthly gross work income), other (monthly
 *           income not from work), det (the determining date, ISO), claim (the claim date, ISO), notice (the day the decision
 *           arrived, ISO, optional), ruling (the day the appeals committee's decision arrived, ISO, optional), full6 (a 100%
 *           degree for six months or more) }
 */
export function compute(registry, input) {
	const nc = registry.rights_nechut;
	const errors = [];
	const age = blank(input.age) ? NaN : Number(input.age);
	if (!(Number.isInteger(age) && age >= 0 && age <= 120)) { errors.push({ field: 'age', he: 'הגיל: מספר שלם בשנים' }); }
	const sex = input.sex === 'f' || input.sex === 'm' ? input.sex : '';
	const status = STATUSES.includes(input.status) ? input.status : null;
	if (!status) { errors.push({ field: 'status', he: 'בחרו אם זו תביעה ראשונה או שכבר מקבלים קצבה' }); }
	const homemaker = input.homemaker === true;
	const medMode = input.medMode === 'list' ? 'list' : 'total';
	let med = NaN;
	let single = null;
	let weighted = null;
	if (medMode === 'list') {
		const list = Array.isArray(input.meds) ? input.meds : [];
		const vals = [];
		list.forEach((v, i) => {
			if (blank(v)) { return; }
			const p = Number(v);
			if (!(p > 0 && p <= 100)) { errors.push({ field: `m${i}`, he: `ליקוי ${i + 1}: אחוז בין 1 ל-100` }); } else { vals.push(p); }
		});
		if (!vals.length && !errors.some((e) => e.field.startsWith('m'))) { errors.push({ field: 'm0', he: 'הזינו לפחות ליקוי אחד, באחוזים' }); }
		weighted = weightedMedical(vals);
		med = weighted.total;
		single = weighted.largest;
	} else {
		med = blank(input.med) ? NaN : Number(input.med);
		if (!(med >= 0 && med <= 100)) { errors.push({ field: 'med', he: 'אחוז הנכות הרפואית: 0 עד 100' }); }
		if (!blank(input.single)) {
			single = Number(input.single);
			if (!(single >= 0 && single <= 100)) { errors.push({ field: 'single', he: 'הליקוי הגדול: 0 עד 100' }); } else if (med >= 0 && single > med) { errors.push({ field: 'single', he: 'ליקוי יחיד לא יכול להיות גבוה מהנכות הרפואית הכוללת' }); }
		}
	}
	const degree = blank(input.degree) ? NaN : Number(input.degree);
	if (!([0].concat(nc.degree.levels).includes(degree))) { errors.push({ field: 'degree', he: 'בחרו את דרגת אי-הכושר' }); }
	const spouseKind = SPOUSE_KINDS.includes(input.spouse) ? input.spouse : null;
	if (!spouseKind) { errors.push({ field: 'spouse', he: 'בחרו את המצב לגבי בן או בת זוג' }); }
	const kids = blank(input.kids) ? 0 : Number(input.kids);
	if (!(Number.isInteger(kids) && kids >= 0 && kids <= 20)) { errors.push({ field: 'kids', he: 'מספר הילדים: 0 עד 20' }); }
	const wage = blank(input.wage) ? 0 : Number(input.wage);
	if (!(wage >= 0 && wage < 1e6)) { errors.push({ field: 'wage', he: 'השכר החודשי ברוטו: מספר, 0 אם לא עובדים' }); }
	const other = blank(input.other) ? 0 : Number(input.other);
	if (!(other >= 0 && other < 1e6)) { errors.push({ field: 'other', he: 'הכנסה שלא מעבודה: מספר, 0 אם אין' }); }
	const date = (key, label, sample) => {
		if (blank(input[key])) { return null; }
		const d = parseDate(input[key]);
		if (!d) { errors.push({ field: key, he: `${label}: תאריך מלא, לדוגמה ${sample}` }); }
		return d;
	};
	const det = date('det', 'היום שממנו לא יכולתם לעבוד', '1.3.2026');
	const claim = date('claim', 'יום הגשת התביעה', '1.6.2026');
	const notice = date('notice', 'היום שבו קיבלתם את ההחלטה', '1.10.2026');
	const ruling = date('ruling', 'היום שבו קיבלתם את החלטת ועדת העררים', '1.12.2026');
	if (det && claim && claim < det) { errors.push({ field: 'claim', he: 'יום הגשת התביעה לפני היום שממנו לא יכולתם לעבוד: בדקו את התאריכים' }); }
	if (notice && claim && notice < claim) { errors.push({ field: 'notice', he: 'ההחלטה לפני הגשת התביעה: בדקו את התאריכים' }); }
	if (ruling && notice && ruling < notice) { errors.push({ field: 'ruling', he: 'החלטת ועדת העררים לפני ההחלטה הראשונה: בדקו את התאריכים' }); }
	if (errors.length) { return { ok: false, errors }; }

	const th = thresholds(registry);
	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });
	const md = nc.medical;

	// 1. The gate.
	const ag = nc.age;
	let ageState = 'ok';
	let ageHe = `גיל ${age}: בין ${ag.min} לגיל הפרישה`;
	if (age < ag.min) { ageState = 'no'; ageHe = `גיל ${age}: מתחת ל-${ag.min}`; } else if (age >= ag.men_max || (sex === 'f' && age >= ag.women_max)) { ageState = 'no'; ageHe = `גיל ${age}: הגיל עבר את גיל הפרישה`; } else if (age >= ag.women_from && sex !== 'm') { ageState = 'check'; ageHe = `גיל ${age}: ${sex === 'f' ? ag.women_he : `לגבר ${ag.men_max}; ${ag.women_he}`}`; }
	let medState = 'no';
	let medVia = null;
	if (homemaker && med >= md.homemaker_min) { medState = 'ok'; medVia = 'homemaker'; } else if (!homemaker && med >= md.min) { medState = 'ok'; medVia = 'main'; } else if (!homemaker && med >= md.alt_min && single !== null && single >= md.single_min) { medState = 'ok'; medVia = 'single'; }
	const medHe = medVia === 'homemaker' ? `נכות רפואית ${shekels(med)}%: לפחות ${md.homemaker_min}% במסלול עקרת בית`
		: medVia === 'main' ? `נכות רפואית ${shekels(med)}%: לפחות ${md.min}%`
			: medVia === 'single' ? `נכות רפואית ${shekels(med)}%, וליקוי יחיד של ${shekels(single)}%: לפחות ${md.alt_min}% עם ליקוי של ${md.single_min}%`
				: homemaker ? `נכות רפואית ${shekels(med)}%: פחות מ-${md.homemaker_min}% במסלול עקרת בית`
					: `נכות רפואית ${shekels(med)}%: פחות מ-${md.min}%${med >= md.alt_min ? `, ובלי ליקוי יחיד של ${md.single_min}% לפחות` : ''}`;
	const degOk = degree >= nc.degree.levels[0];
	const t60 = th.t60;
	const incomeOk = status === 'receiving' || homemaker || wage <= t60;
	const gates = [
		{ key: 'age', state: ageState, he: ageHe, section: ag.section, url: ag.url },
		{ key: 'medical', state: medState, he: medHe, section: homemaker ? '' : md.section, url: homemaker ? md.homemaker_url : md.url },
		{ key: 'degree', state: degOk ? 'ok' : 'no', he: degOk ? `דרגת אי-כושר ${degree}%${homemaker ? ' לתפקד במשק הבית' : ''}` : `אובדן כושר של פחות מ-${nc.degree.min_loss}%: אין דרגה מזכה`, section: degOk ? nc.degree.section : nc.degree.loss_section, url: nc.degree.url },
		{ key: 'income', state: incomeOk ? 'ok' : 'no', he: homemaker ? 'מסלול עקרת בית: לא עובדת' : status === 'receiving' ? 'כבר מקבלים קצבה: ההכנסה מעבודה מפחיתה לפי הטבלה שבחוק, ולא שוללת' : wage <= t60 ? `הכנסה מעבודה של ${shekels(wage)} ש"ח: עד ${shekels(nc.work.new_claim_max)} ש"ח (${nc.work.new_claim_pct}% מהשכר הממוצע) ב-${nc.work.new_claim_days} ימים` : `הכנסה מעבודה של ${shekels(wage)} ש"ח: מעל ${shekels(nc.work.new_claim_max)} ש"ח, ולכן עדיין לא נחשבים "נכה" לעניין התביעה`, section: status === 'receiving' && !homemaker ? nc.work.tiers_section : nc.work.new_claim_section, url: status === 'receiving' && !homemaker ? nc.work.url : nc.work.new_claim_url },
	];
	const eligible = gates.every((g) => g.state !== 'no');
	const verdict = !eligible ? 'no' : gates.some((g) => g.state === 'check') ? 'check' : 'ok';
	if (age < ag.min) { add('bad', 'under18', `מתחת לגיל ${ag.min} התביעה היא לקצבת ילד נכה, ולא לנכות כללית; אפשר להגיש תביעה לנכות כללית מגיל ${ag.min}.`, ag.section); }
	if (ageState === 'no' && age >= ag.min) { add('bad', 'over', `${ag.over_he}.`, ag.schedule); }
	if (ageState === 'check') { add('warn', 'women_age', `${ag.women_he}: אם הגעתם לגיל הפרישה, אין קצבת נכות כללית חדשה. ${ag.over_he}.`, ag.schedule); }
	if (medState === 'no' && !homemaker && med >= md.alt_min && single === null) { add('warn', 'single', `אם אחד הליקויים לבדו נקבע ב-${md.single_min}% לפחות, ${md.alt_min}% מספיקים (${md.section}): הזינו את הליקוי הגדול.`, md.section); }
	if (medState === 'no') { add('bad', 'medical', `${md.weighted_he}. ${md.filtered_he}. אם לדעתכם האחוזים נמוכים מדי: ערר בתוך ${nc.appeal.days} ימים.`, md.section); }
	if (!degOk) { add('bad', 'degree', `קצבה משולמת רק כשהכושר להשתכר${homemaker ? ' (או לתפקד במשק הבית)' : ''} ירד ב-${nc.degree.min_loss}% לפחות. ${nc.appeal.degree_he}.`, nc.degree.loss_section); }
	if (!incomeOk) { add('bad', 'income', `תביעה ראשונה: ההכנסה מעבודה צריכה להיות עד ${shekels(nc.work.new_claim_max)} ש"ח בחודש במשך ${nc.work.new_claim_days} ימים רצופים לפחות, בתוך ${nc.work.new_claim_window_months} החודשים שלפני התביעה. אחרי שנקבעה דרגה, אפשר לעבוד ולהרוויח יותר ולהמשיך לקבל קצבה לפי הטבלה שבחוק.`, nc.work.new_claim_section); }

	// 2. The money (whenever a degree is set; paid only when the gate passes).
	const fam = { spouseDep: spouseKind === 'dep', kids, other, homemaker };
	let calc = null;
	let noWork = null;
	let ladder = [];
	let ledger = [];
	let bars = [];
	let cross = null;
	let end = null;
	let keep = 100;
	let nextKeep = null;
	if (degOk) {
		const o = Object.assign({ degree, wage }, fam);
		calc = pensionAt(registry, o);
		noWork = pensionAt(registry, Object.assign({}, o, { wage: 0 }));
		cross = crossoverWage(registry, degree);
		end = homemaker ? null : endWage(registry, o);
		keep = keepAt(registry, o, wage);
		// The next change in the keep rate above the reader's wage.
		if (!homemaker) {
			const marks = [];
			if (degree !== 100 && cross > wage) { marks.push(cross); }
			th.tiers.forEach((t) => { if (t > wage && (degree === 100 || t > cross)) { marks.push(t); } });
			if (end && end > wage) { marks.push(end); }
			const nx = marks.sort((a, b) => a - b)[0];
			if (nx !== undefined) { nextKeep = { from: Math.ceil(nx), keep: keepAt(registry, o, nx + 0.5) }; }
		}
		ladder = nc.degree.levels.slice().reverse().map((d) => ({ degree: d, pay: pensionAt(registry, Object.assign({}, o, { degree: d })).pay, here: d === degree }));
		if (!homemaker) {
			const pts = [{ w: 0, why: 'none' }];
			if (degree !== 100 && calc.fullAdd > 0) { pts.push({ w: Math.floor(th.t21), why: 't21' }, { w: Math.floor(th.t21) + 1, why: 't21up' }); }
			if (degree === 100) { pts.push({ w: Math.floor(th.tiers[0]), why: 't1' }, { w: Math.floor(th.tiers[1]), why: 't2' }); } else { pts.push({ w: nc.work.crossover[String(degree)] || Math.ceil(cross), why: 'cross' }); }
			pts.push({ w: Math.floor(th.tiers[2]), why: 't3' }, { w: end - 1, why: 'last' }, { w: end, why: 'end' });
			if (wage > 0) { pts.push({ w: wage, why: 'you' }); }
			const seen = new Set();
			ledger = pts.filter((p) => p.w >= 0 && p.w <= end && !seen.has(p.w) && seen.add(p.w)).sort((a, b) => a.w - b.w).map((p) => {
				const x = pensionAt(registry, Object.assign({}, o, { wage: p.w }));
				return { w: p.w, why: p.why, pay: x.pay, total: r2(p.w + x.pay), keep: keepAt(registry, o, p.w + 0.5), you: p.w === wage };
			});
			const step = end > 26000 ? 2000 : 1000;
			const top = Math.min(40000, Math.ceil((Math.max(end, wage) + step) / step) * step);
			for (let w = 0; w <= top; w += step) { bars.push({ w, pay: pensionAt(registry, Object.assign({}, o, { wage: w })).pay }); }
		}
	}
	const monthly = eligible && calc ? calc.pay : 0;
	const annual = monthly * 12;
	const total = r2(monthly + (homemaker ? 0 : wage));

	if (calc && eligible) {
		const dp = nc.dependents;
		if (degree !== 100 && calc.fullAdd > 0 && !calc.addFull && !homemaker) { add('warn', 'cliff', `דרגה חלקית: התוספות לבן הזוג ולילדים משולמות לפי הדרגה (${shekels(calc.partialAdd)} ש"ח). אם ההכנסה מעבודה תעלה על ${shekels(nc.work.full_add_from)} ש"ח בחודש, התוספות יהיו מלאות (${shekels(calc.fullAdd)} ש"ח), והקצבה תעלה ב-${shekels(calc.fullAdd - calc.partialAdd)} ש"ח.`, nc.work.full_add_section); }
		if (degree !== 100 && calc.fullAdd > 0 && calc.addFull) { add('info', 'full_add', `כיוון שההכנסה מעבודה גבוהה מ-${shekels(nc.work.full_add_from)} ש"ח (${nc.work.full_add_pct}% מהשכר הממוצע), התוספות לבן הזוג ולילדים מלאות: ${shekels(calc.fullAdd)} ש"ח במקום ${shekels(calc.partialAdd)} ש"ח.`, nc.work.full_add_section); }
		if (calc.laronBinds && calc.pay > 0) { add('info', 'laron', `ההכנסה מעבודה מפחיתה ${shekels(calc.ded.rounded)} ש"ח מהקצבה המלאה ומהתוספות, לפי לוח ח1; הקצבה עדיין גבוהה מאפס, וההכנסה הכוללת גבוהה יותר מהקצבה לבדה.`, nc.work.tiers_section); }
		if (calc.belowMin) { add('warn', 'min', `לפי החישוב נשארו ${shekels(calc.beforeMin)} ש"ח, פחות מ-${shekels(r2(th.minPay))} ש"ח (${nc.work.min_pct_of_basic}% מהסכום הבסיסי): סכום כזה לא משולם.`, nc.work.min_section); }
		if (monthly === 0 && wage > 0) { add('warn', 'stopped', `${nc.work.protect_he}. ${nc.work.benefits_he}.`, nc.work.protect_section); }
		if (kids > dp.children_max) { add('info', 'kids', `${dp.kids_he}: ${kids} ילדים, התוספת בעד ${dp.children_max}.`, dp.section); }
		if (spouseKind === 'earns' && !homemaker) { add('info', 'spouse', `אין תוספת לבן הזוג: ${dp.spouse_he}.`, dp.spouse_section); }
		if (homemaker && spouseKind === 'dep') { add('info', 'hm_spouse', `${dp.homemaker_he}.`, ''); }
		if (homemaker && wage > 0) { add('warn', 'hm_wage', `במסלול עקרת בית לא עובדים, ולכן השכר לא נכנס לחישוב. ${nc.homemaker.worker_he}.`, nc.homemaker.section); }
		if (other > 0) { add('info', 'other', `${homemaker ? nc.other_income.homemaker_he : nc.other_income.he}. כאן: ${calc.otherCut ? `${shekels(calc.otherCut)} ש"ח פחות` : 'אין הפחתה'}. ${nc.other_income.alimony_he}.`, nc.other_income.section); }
		if (degree === 100) { add('info', 'deg75', `${nc.degree.he_75}.`, nc.degree.section); }
		add('info', 'changes', `${nc.changes.he}.`, '');
	}

	// 3. The clock.
	const c = nc.clock;
	let clock = null;
	const deadlines = [];
	if (det && claim) {
		const detMin = addMonths(claim, -c.det_back_months);
		const detEff = det < detMin ? detMin : det;
		const start = addDays(detEff, c.wait_days + 1);
		const retroFrom = addMonths(firstOfMonth(claim), -c.retro_months);
		const payFrom = start > retroFrom ? start : retroFrom;
		const early = input.full6 === true && degree === 100 ? { from: addDays(detEff, c.early_from_day), to: addDays(detEff, c.early_to_day) } : null;
		const lost = start < retroFrom ? { from: start, to: addDays(retroFrom, -1) } : null;
		clock = { det, detMin, detEff, start, retroFrom, payFrom, early, lost, early_claim: claim < start };
		if (det < detMin) { add('warn', 'det_min', `התאריך הקובע לא יכול להיות מוקדם מ-${c.det_back_months} החודשים שלפני הגשת התביעה: כאן ${heDate(detMin)} ולא ${heDate(det)}.`, c.det_section); }
		if (lost) { add('warn', 'late', `התביעה הוגשה מאוחר: קצבה משולמת לכל היותר בעד ${c.retro_months} החודשים שלפני חודש ההגשה, כלומר מ-${heDate(retroFrom)}. ${lost.from === lost.to ? `על ${heDate(lost.from)}` : `על הימים מ-${heDate(lost.from)} עד ${heDate(lost.to)}`} לא ישולם.`, c.retro_section); }
		if (claim < start) { add('info', 'early_claim', `הביטוח הלאומי דן בתביעה רק בתום ${c.consider_days} ימים מהיום שבו ההכנסה פסקה או ירדה, כלומר מ-${heDate(start)}; אפשר להגיש מוקדם, והתביעה תחכה.`, c.consider_section); }
		if (input.full6 === true && degree !== 100) { add('info', 'early_only100', `תשלום מהיום ה-${c.early_from_day} רק לדרגה ${nc.degree.levels[nc.degree.levels.length - 1]}% שנקבעה ל-${c.early_min_months} חודשים לפחות.`, c.early_section); }
		deadlines.push({ key: 'det', date: det, he: 'התאריך הקובע: היום שממנו לא יכולתם לעבוד, או שההכנסה ירדה', section: c.det_section, url: nc.law_url, ics: false });
		if (early) { deadlines.push({ key: 'early', date: early.from, he: `קצבה מלאה מהיום ה-${c.early_from_day} (דרגה ${nc.degree.levels[nc.degree.levels.length - 1]}% ל-${c.early_min_months} חודשים לפחות), עד היום ה-${c.early_to_day}`, section: c.early_section, url: c.url, ics: true }); }
		deadlines.push({ key: 'start', date: start, he: `היום ה-${c.wait_days + 1}: הזכות לקצבה מתחילה, ומכאן גם הדיון בתביעה`, section: c.start_section, url: c.url, ics: true });
		deadlines.push({ key: 'claim', date: claim, he: `הגשת התביעה (טופס ${nc.claim.form})`, section: 'אופן הגשת התביעה', url: nc.claim.url, ics: false });
		if (lost) { deadlines.push({ key: 'retro', date: retroFrom, he: `הקצבה משולמת רק מכאן: ${c.retro_months} החודשים שלפני חודש התביעה`, section: c.retro_section, url: nc.general_law_url, ics: false }); }
	}
	if (notice) {
		const appealBy = offRestDays(addDays(notice, nc.appeal.days));
		deadlines.push({ key: 'notice', date: notice, he: 'קיבלתם את ההחלטה (אחוזי נכות או דרגה)', section: '', url: nc.appeal.url, ics: false });
		deadlines.push({ key: 'appeal', date: appealBy, he: `היום האחרון להגיש ערר לוועדה הרפואית לעררים או לוועדה לעררים (${nc.appeal.days} ימים)`, section: nc.appeal.section, url: nc.appeal.url, ics: true });
		if (!eligible || degree !== 100) { deadlines.push({ key: 'recheck', date: addMonths(notice, nc.recheck.months), he: `מכאן אפשר לבקש בדיקה מחדש (${nc.recheck.months} חודשים מהקביעה)`, section: 'בדיקה מחדש', url: nc.recheck.url, ics: true }); }
		deadlines.push({ key: 'other_court', date: offRestDays(addMonths(notice, nc.appeal.other_court_months)), he: `החלטה אחרת של פקיד התביעות (הכנסות, תקופות, גיל): תביעה לבית הדין האזורי לעבודה עד היום הזה (${nc.appeal.other_court_months} חודשים)`, section: 'דף הערעור', url: nc.appeal.url, ics: false });
	}
	if (ruling) {
		deadlines.push({ key: 'ruling', date: ruling, he: 'קיבלתם את החלטת ועדת העררים', section: '', url: nc.appeal.url, ics: false });
		deadlines.push({ key: 'court', date: offRestDays(addDays(ruling, nc.appeal.court_days)), he: `היום האחרון לערעור לבית הדין האזורי לעבודה, בשאלה משפטית בלבד (${nc.appeal.court_days} ימים)`, section: nc.appeal.court_section, url: nc.appeal.url, ics: true });
	}
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	const appealBy = (deadlines.find((d) => d.key === 'appeal') || {}).date || null;

	return {
		ok: true, eligible, verdict, age, sex, status, homemaker, medMode, med, single, weighted, medVia, degree, spouse: spouseKind, kids, wage: homemaker ? 0 : wage, other,
		gates, calc, noWork, monthly, annual, total, keep, nextKeep, cross, end, ladder, ledger, bars, th,
		det, claim, notice, ruling, full6: input.full6 === true, clock, deadlines, appealBy, flags,
	};
}

/** The same family and wage at every degree and with no work: for the side-by-side and the page table. */
export function byWage(registry, degree, wages, family) {
	return wages.map((w) => ({ w, pay: pensionAt(registry, Object.assign({ degree, wage: w, spouseDep: false, kids: 0, other: 0, homemaker: false }, family || {})).pay }));
}
