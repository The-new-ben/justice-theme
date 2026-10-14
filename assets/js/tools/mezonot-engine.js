/**
 * Child support (מזונות ילדים) after בע"מ 919/15, family wave (HAD-506). Dependency-free ES module.
 *
 * Ported from the jus-tice.com estimator (HAD-454) and extended for the co.il instrument. Every rule and default is
 * read from registry.child_support (checked_on), each with its source:
 *  - בע"מ 919/15 (Supreme Court, 19.7.2017): from 6 to 15 both parents owe support equally by tzedaka law, split by
 *    their relative economic capacity from all sources and the actual physical custody; 15-18 was already shared
 *    equally; under 6 a Jewish father alone owes the essential needs. Para. 60: needs that depend on where the child
 *    stays vs needs that do not (housing is the clear example). Para. 61 (Justice Barak-Erez), adopted as the default
 *    for shared custody: running costs in kind, a "central parent" for the other needs, extraordinary expenses by
 *    earning capacity, housing in kind.
 *  - The ratio method family courts use after 919/15 (e.g. Hadera family court, 2019): all needs including the
 *    children's share of both homes, multiplied by (disposable-income share minus custody share).
 *  - חוק לתיקון דיני המשפחה (מזונות), 1959, ss.3, 3א: where personal law imposes no duty, the parents share in
 *    proportion to their income from every source.
 * "Needs" have no official figure: the defaults are case-law amounts, shown as estimates the user can change.
 * The result is a range between the methods that fit each child's age, summed over the children.
 */

import { fDay, fMs, fIsoOf, fIsIso, fR2, fR10, fEntered, fAddMonths } from './family-common.js';

/** The day a child born on `birth` turns `years`; a 29 February birthday falls on 28 February. */
export function mzAnniversary(birth, years) {
	const [y, m, d] = birth.split('-').map(Number);
	const ny = y + years;
	const last = new Date(Date.UTC(ny, m, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
export function mzAgeOn(birth, day) {
	let a = Number(day.slice(0, 4)) - Number(birth.slice(0, 4));
	if (mzAnniversary(birth, a) > day) { a -= 1; }
	return a;
}

/** The children's share of a home: from the registry (30% / 40% / 50% for 1 / 2 / 3+ children by default). */
export function mzHousingShare(cs, n) {
	if (n <= 0) { return 0; }
	const t = cs.housing.default_pct;
	return (n >= t.length ? t[t.length - 1] : t[n]) / 100;
}

/**
 * One period (a fixed set of child ages), in "A pays B" terms: a negative figure means B pays A.
 */
function mzPeriod(cs, p, kids) {
	const minors = kids.filter((k) => k.age < cs.ages.adult);
	const n = minors.length;
	const k = p.shareOverride !== null ? p.shareOverride : mzHousingShare(cs, n);
	const HA = k * p.housingA;
	const HB = k * p.housingB;
	const tA = p.nightsA / 14;
	const tB = 1 - tA;
	const sA = p.incomeA + p.incomeB > 0 ? p.incomeA / (p.incomeA + p.incomeB) : 0.5;
	// Disposable income: what is left after each parent's own (adult) share of their home (the Hadera method).
	const dispA = Math.max(0, p.incomeA - (1 - k) * p.housingA);
	const dispB = Math.max(0, p.incomeB - (1 - k) * p.housingB);
	const sAd = dispA + dispB > 0 ? dispA / (dispA + dispB) : 0.5;
	const D = p.needsDependent;
	const I = p.needsIndependent;
	const perChild = minors.map((c) => {
		const housingHere = n ? (HA + HB) / n : 0;
		const under6 = c.age < cs.ages.father_only_to && p.law === 'jewish' && (p.father === 'A' || p.father === 'B');
		if (under6) {
			// The father alone owes the essential needs, the children's share of the mother's home included (919/15, paras.
			// 13-14 and 22); what is beyond them is tzedaka, split by income (para. 29(ב); Haifa family court 45415-04-23).
			// High: no offset. Low: his in-kind spending on the stay-dependent needs while the child is with him is offset
			// (paras. 59-60), never below the housing share he owes.
			const motherIsB = p.father === 'A';
			const tFather = motherIsB ? tA : tB;
			const sFather = motherIsB ? sA : 1 - sA;
			const HMother = (motherIsB ? HB : HA) / n;
			const N = Math.min(p.necessary, D + I);
			const beyond = Math.max(0, D + I - N);
			const high = N + HMother + beyond * sFather;
			const low = Math.max(HMother, high - tFather * D);
			const sign = motherIsB ? 1 : -1;
			const a = sign * low;
			const b = sign * high;
			return { age: c.age, idx: c.idx, bracket: 'under6', method: 'father', min: Math.min(a, b), max: Math.max(a, b), values: { fatherLow: a, fatherHigh: b } };
		}
		const m1 = (sAd - tA) * (D + I + housingHere);
		const m2 = (sA - tA) * D + (p.central === 'B' ? sA * I : -(1 - sA) * I);
		const bracket = c.age < cs.ages.father_only_to ? 'under6-shared' : c.age < cs.ages.equal_from ? '6to15' : '15to18';
		return { age: c.age, idx: c.idx, bracket, method: 'ratio', min: Math.min(m1, m2), max: Math.max(m1, m2), values: { ratio: m1, para61: m2 } };
	});
	const min = perChild.reduce((s, c) => s + c.min, 0);
	const max = perChild.reduce((s, c) => s + c.max, 0);
	return { n, k, HA, HB, tA, sA, sAd, dispA, dispB, perChild, min, max };
}

function mzDirection(min, max) {
	if (min >= 0 && max >= 0) { return { payer: 'A', payee: 'B', low: fR10(min), high: fR10(max) }; }
	if (min <= 0 && max <= 0) { return { payer: 'B', payee: 'A', low: fR10(-max), high: fR10(-min) }; }
	return { payer: null, payee: null, low: fR10(min), high: fR10(max) };
}

/**
 * input = {
 *   incomeA, incomeB         net monthly income from all sources (NIS)
 *   housingA, housingB       each home's monthly rent or mortgage, with upkeep
 *   children: [ISO birth dates]
 *   nightsA                  nights out of 14 with parent A
 *   father: 'A'|'B'|''       for the under-6 rule; law: 'jewish'|'proportional'
 *   needsDependent, needsIndependent   per child (defaults: registry, case law)
 *   housingShare             optional override, 0..1 or a percent
 *   central: 'A'|'B'|''      the "central parent" of para. 61 (default: the one with more nights, B when equal)
 *   extras: { education, health, childcare }   monthly totals for all the children, split by income (para. 61(ג))
 *   asOf                     ISO day (default: the registry's checked_on; the page passes today)
 * }
 */
export function computeSupport(registry, input) {
	const cs = registry.child_support;
	const errors = [];
	const num = (v, fallback, field) => {
		if (!fEntered(v)) { return fallback; }
		const n = Number(v);
		if (!(n >= 0 && n < 1e9)) { errors.push({ field, he: 'סכום: מספר חיובי' }); return 0; }
		return n;
	};
	const p = {
		incomeA: num(input.incomeA, 0, 'incomeA'), incomeB: num(input.incomeB, 0, 'incomeB'),
		housingA: num(input.housingA, 0, 'housingA'), housingB: num(input.housingB, 0, 'housingB'),
		nightsA: num(input.nightsA, 7, 'nightsA'),
		needsDependent: num(input.needsDependent, cs.needs.dependent, 'needsDependent'),
		needsIndependent: num(input.needsIndependent, cs.needs.independent, 'needsIndependent'),
		necessary: num(input.necessary, cs.needs.necessary, 'necessary'),
		father: input.father === 'A' || input.father === 'B' ? input.father : null,
		law: input.law === 'proportional' ? 'proportional' : 'jewish',
		shareOverride: null,
	};
	if (fEntered(input.housingShare)) {
		let s = Number(input.housingShare);
		if (s > 1) { s /= 100; }
		if (!(s >= 0 && s <= 1)) { errors.push({ field: 'housingShare', he: 'חלק הילדים במדור: בין 0% ל-100%' }); } else { p.shareOverride = s; }
	}
	if (!(Number.isInteger(p.nightsA) && p.nightsA >= 0 && p.nightsA <= 14)) { errors.push({ field: 'nightsA', he: 'מספר לילות מתוך 14: מספר שלם בין 0 ל-14' }); }
	const extras = {};
	for (const k of ['education', 'health', 'childcare']) { extras[k] = num(input.extras && input.extras[k], 0, `extra-${k}`); }
	const asOf = fIsIso(input.asOf) ? input.asOf : cs.checked_on;
	const births = (input.children || []).filter((b) => fEntered(b));
	if (!births.length) { errors.push({ field: 'children', he: 'צריך לפחות ילד אחד עם תאריך לידה' }); }
	births.forEach((b, i) => {
		if (!fIsIso(b)) { errors.push({ field: `child-${i}`, he: 'תאריך לידה לא תקין. לדוגמה: 1.3.2019' }); } else if (b > asOf) { errors.push({ field: `child-${i}`, he: 'תאריך הלידה אחרי היום' }); }
	});
	if (births.length > cs.max_children) { errors.push({ field: 'children', he: `עד ${cs.max_children} ילדים` }); }
	if (p.incomeA + p.incomeB <= 0 && !errors.length) { errors.push({ field: 'incomeA', he: 'צריך הכנסה של לפחות אחד ההורים' }); }
	if (!errors.length && births.every((b) => mzAgeOn(b, asOf) >= cs.ages.adult)) { errors.push({ field: 'children', he: 'כל הילדים כבר בני 18 ומעלה. על מזונות בזמן שירות חובה: ראו את ההסבר בעמוד' }); }
	if (errors.length) { return { ok: false, errors }; }
	p.central = input.central === 'A' || input.central === 'B' ? input.central : (p.nightsA > 7 ? 'A' : 'B');

	// Periods: each 6th, 15th and 18th birthday after asOf changes the picture.
	const bounds = new Set();
	births.forEach((b) => [cs.ages.father_only_to, cs.ages.equal_from, cs.ages.adult].forEach((y) => { const d = mzAnniversary(b, y); if (d > asOf) { bounds.add(d); } }));
	const cuts = [asOf, ...[...bounds].sort()];
	const periods = [];
	for (let i = 0; i < cuts.length && periods.length < 12; i += 1) {
		const from = cuts[i];
		const to = i + 1 < cuts.length ? fIsoOf(fMs(cuts[i + 1]) - fDay) : null;
		const kids = births.map((b, idx) => ({ idx, age: mzAgeOn(b, from) }));
		if (!kids.some((k) => k.age < cs.ages.adult)) { break; }
		const est = mzPeriod(cs, p, kids);
		const dir = mzDirection(est.min, est.max);
		const shape = est.perChild.map((c) => (c.bracket === 'under6' ? 'u6' : 'r')).join();
		const prev = periods[periods.length - 1];
		if (prev && prev.shape === shape && prev.low === dir.low && prev.high === dir.high && prev.payer === dir.payer) { prev.to = to; continue; }
		periods.push(Object.assign({ from, to, ages: kids.filter((k) => k.age < cs.ages.adult).map((k) => k.age), est, shape }, dir));
	}
	const now = periods[0];
	const e = now.est;
	// Compulsory service after 18 (or the end of high school): courts set a third of the amount on the eve of it (Haifa
	// family court 17791-01-22, s.48.2). Each child's share the day before its 18th birthday, divided by three.
	const service = [];
	births.forEach((b, idx) => {
		const at = fIsoOf(fMs(mzAnniversary(b, cs.ages.adult)) - fDay);
		if (at < asOf) { return; }
		const kids = births.map((bb, j) => ({ idx: j, age: mzAgeOn(bb, at) }));
		const est = mzPeriod(cs, p, kids).perChild.find((c) => c.idx === idx);
		if (!est) { return; }
		const f = cs.service.fraction;
		service.push({ idx, from: mzAnniversary(b, cs.ages.adult), low: fR10(Math.abs(est.min) * f), high: fR10(Math.abs(est.max) * f), sign: est.max >= 0 ? 'A' : 'B' });
	});
	const extrasTotal = extras.education + extras.health + extras.childcare;
	const split = { A: fR2(extrasTotal * e.sA), B: fR2(extrasTotal * (1 - e.sA)) };
	const flags = [];
	if (e.perChild.some((c) => c.bracket === 'under6')) { flags.push({ code: 'under6', he: cs.flags.under6_he }); }
	if (e.perChild.some((c) => c.bracket === '15to18')) { flags.push({ code: 'over15', he: cs.flags.over15_he }); }
	if (p.nightsA === 7) { flags.push({ code: 'equal', he: cs.flags.equal_he }); }
	if (now.payer === null) { flags.push({ code: 'mixed', he: cs.flags.mixed_he }); }
	if (births.some((b) => mzAgeOn(b, asOf) >= cs.ages.adult)) { flags.push({ code: 'adult', he: cs.flags.adult_he }); }
	if (p.law === 'proportional') { flags.push({ code: 'law', he: cs.flags.proportional_he }); }
	if (!p.father && p.law === 'jewish' && e.perChild.some((c) => c.age < cs.ages.father_only_to)) { flags.push({ code: 'nofather', he: cs.flags.no_father_he }); }
	return {
		ok: true, asOf, payer: now.payer, payee: now.payee, low: now.low, high: now.high,
		ratio: { income: e.sA, disposable: e.sAd }, custody: e.tA, housingShare: e.k, central: p.central,
		housing: { A: fR2(e.HA), B: fR2(e.HB) }, needs: { dependent: p.needsDependent, independent: p.needsIndependent },
		incomes: { A: p.incomeA, B: p.incomeB }, nightsA: p.nightsA, father: p.father, law: p.law,
		extras: Object.assign({ total: fR2(extrasTotal), split }, extras),
		perChild: e.perChild.map((c) => Object.assign({}, c, { min: fR10(c.min), max: fR10(c.max), values: Object.fromEntries(Object.entries(c.values).map(([k, v]) => [k, fR10(v)])) })),
		periods: periods.map((x) => ({ from: x.from, to: x.to, ages: x.ages, payer: x.payer, payee: x.payee, low: x.low, high: x.high })),
		service, necessary: p.necessary, flags,
	};
}

/* ---------------- CPI linkage of a support amount (the "madad" mode) ---------------- */

/** The CPI as one chained scale, with the "known index" day rule (published on the 15th). */
export function mzCpi(cpi) {
	const values = new Map(cpi.series.map(([k, v]) => [k, v]));
	const bases = cpi.bases;
	const factorTo = new Map();
	let factor = 1;
	for (let i = bases.length - 1; i >= 0; i -= 1) {
		if (i < bases.length - 1) { factor *= bases[i].to_next; }
		factorTo.set(bases[i].id, factor);
	}
	const baseOf = (key) => { const b = bases.find((x) => key >= x.from && key <= x.to); return b ? b.id : bases[bases.length - 1].id; };
	const knownFrom = cpi.known_from_day || 16;
	const shift = (key, d) => { const [y, m] = key.split('-').map(Number); const t = y * 12 + (m - 1) + d; return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`; };
	return {
		latest: cpi.series[cpi.series.length - 1][0],
		has: (key) => values.has(key),
		value: (key) => values.get(key),
		chained: (key) => values.get(key) / factorTo.get(baseOf(key)),
		knownMonth(iso) { const d = Number(iso.slice(8, 10)); return shift(iso.slice(0, 7), d >= knownFrom ? -1 : -2); },
	};
}

/**
 * input = { amount (monthly, as set in the judgment or agreement), base (ISO: the day of the judgment or agreement, or
 *           the base day it names), every (months between updates; default registry), asOf (ISO) }
 * The base index is the one known on the base day; the amount is updated on every `every`-month anniversary of the base
 * day by the index known then, and stays fixed between updates.
 */
export function indexSupport(registry, input) {
	const cs = registry.child_support;
	const cpi = mzCpi(registry.cpi);
	const errors = [];
	const amount = Number(input.amount);
	if (!(amount > 0 && amount < 1e8)) { errors.push({ field: 'amount', he: 'סכום המזונות: מספר חיובי' }); }
	if (!fIsIso(input.base)) { errors.push({ field: 'base', he: 'התאריך לא תקין. לדוגמה: 1.3.2022' }); }
	const asOf = fIsIso(input.asOf) ? input.asOf : cs.checked_on;
	const every = fEntered(input.every) ? Number(input.every) : cs.indexation.every_months;
	if (!(Number.isInteger(every) && every >= 1 && every <= 12)) { errors.push({ field: 'every', he: 'מספר חודשים בין עדכונים: 1 עד 12' }); }
	if (!errors.length && input.base > asOf) { errors.push({ field: 'base', he: 'התאריך אחרי היום' }); }
	if (!errors.length && !cpi.has(cpi.knownMonth(input.base))) { errors.push({ field: 'base', he: 'אין בסדרה את המדד הידוע ביום הזה' }); }
	if (errors.length) { return { ok: false, errors }; }
	const baseMonth = cpi.knownMonth(input.base);
	const updates = [];
	for (let i = 1; i < 400; i += 1) {
		const day = fAddMonths(input.base, every * i);
		if (day > asOf) { break; }
		let month = cpi.knownMonth(day);
		const stale = !cpi.has(month);
		if (stale) { month = cpi.latest; }
		const factor = cpi.chained(month) / cpi.chained(baseMonth);
		updates.push({ day, month, index: cpi.value(month), factor: Math.round(factor * 10000) / 10000, amount: fR2(amount * factor), stale });
	}
	const cur = updates.length ? updates[updates.length - 1] : { day: input.base, month: baseMonth, index: cpi.value(baseMonth), factor: 1, amount: fR2(amount), stale: false };
	const nextDay = fAddMonths(input.base, every * (updates.length + 1));
	return {
		ok: true, amount: fR2(amount), base: input.base, baseMonth, baseIndex: cpi.value(baseMonth), every, asOf,
		current: cur.amount, factor: cur.factor, lastUpdate: cur.day, lastMonth: cur.month, next: nextDay,
		updates: updates.slice(-8), latestCpi: cpi.latest, change: fR2(cur.amount - amount),
	};
}

/**
 * The National Insurance payment that replaces unpaid support (Maintenance (Assurance of Payment) Law 1972, s.3): the
 * lower of the judgment and the regulations' amount, by family. input = { children, over55, remarried }.
 */
export function mzNii(registry, input) {
	const nii = registry.child_support.nii;
	const kids = Math.max(0, Number(input.children) || 0);
	if (input.remarried && kids === 0) {
		// A woman who remarried or lives with a partner gets the children's part only; with no children, nothing.
		return { ok: false, key: 'none', row: null, amount: 0, table: 0, cap: 0, lower: false, errors: [{ field: 'children', he: 'אישה שנישאה שוב או חיה עם בן זוג מקבלת מהביטוח הלאומי רק את החלק של הילדים. בלי ילדים אין תשלום' }] };
	}
	const key = input.remarried ? (kids >= 2 ? 'remarried2' : 'remarried1') : (kids >= 2 ? 'woman2' : kids === 1 ? 'woman1' : 'woman0');
	const row = nii.rows.find((r) => r.key === key);
	const over = Boolean(input.over55) && row.over55 !== null;
	const cap = over ? row.cap_over55 : row.cap_under55;
	const table = row[over ? 'over55' : 'under55'];
	const jRaw = input.judgment;
	if (!(jRaw === '' || jRaw === undefined || jRaw === null) && !(Number(jRaw) >= 0 && Number(jRaw) < 1e8)) {
		return { ok: false, key: '', row: null, amount: 0, table: 0, cap: 0, lower: false, errors: [{ field: 'judgment', he: 'הסכום שבפסק הדין: מספר חיובי' }] };
	}
	const judged = fEnteredNum(jRaw);
	return { ok: true, key, row, amount: judged === null ? table : Math.min(table, judged), table, cap, lower: judged !== null && judged < table };
}
function fEnteredNum(v) { return v === '' || v === undefined || v === null || !(Number(v) >= 0) ? null : Number(v); }
