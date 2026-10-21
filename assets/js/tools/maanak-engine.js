/**
 * The rights wave 2A (22.10.2026, HAD-578): the work-grant engine (maanak-avoda, /maanak-avoda/), "מס הכנסה שלילי".
 *
 * Dependency-free ES module. Every number comes from registry.rights_maanak, read from the Work Grant Law (current version,
 * the indexation notice of 11.2.2026) and the Tax Authority's guides:
 *  - Tax year 2025, every rule of the law: the regular schedule by family size (s.2), additional income such as a pension
 *    (s.4), the spouse's income (s.5), 150% for a working parent (s.6א), the single-parent schedule with its own additional-
 *    income rule (s.6ב), the toddler supplement with its spouse rule (s.6ב1) and the single parent's toddler supplement
 *    (s.6ב2), the track for working women aged 60-67 born from 1960 (s.6ה), the real-estate exclusion (s.3(א)(1)), the
 *    20 ₪ minimum and the months actually worked; then the payment calendar of s.12 by the filing date, the deadline and
 *    the objection window.
 *  - Tax year 2024: only the bands and maxima were published, so the engine checks the band and says so.
 * The grant curve (the monthly grant against the monthly income, for the reader's family) is computed by the same function.
 */

const r2m = (n) => Math.round((Number(n) + 1e-9) * 100) / 100;
const blankM = (v) => v === '' || v === undefined || v === null;
const numM = (v) => (blankM(v) ? NaN : Number(String(v).replace(/,/g, '')));

export const MAANAK_DEFAULT = {
	year: 2025, by: 1991, sex: 'f', kids: 2, toddlers: 1, single: false, income: 5000, months: 12, extra: 0,
	spouse: true, spouseIncome: 6000, realEstate: false, filed: '',
};

/** One schedule of the law (s.2, s.6ב or s.6ה), with the additional-income rule (s.4, s.6ב(ב), s.6ה(ב)).
 * p = { floor, p1, p2, ceiling, base, rate_in, max, rate_out, extra_threshold }. Returns the monthly amount and the phase. */
export function schedule(p, income, extra = 0) {
	const I = Number(income) || 0;
	const A = Math.max(0, Number(extra) || 0);
	let p1 = p.p1;
	let p2 = p.p2;
	let max = p.max;
	if (A > 0 && A < p.extra_threshold) {
		p2 = p.p2 - A;
	} else if (A >= p.extra_threshold) {
		const S = (p.p2 - p.floor) - A;
		if (S <= 0) { return { amount: 0, phase: 'extra', p1: p.p2 - A, p2: p.p2 - A, max: 0 }; }
		p1 = p.p2 - A;
		p2 = p.p2 - A;
		max = p.base + (p.rate_in / 100) * S;
	}
	let amount = 0;
	let phase = 'below';
	if (I <= p.floor) {
		phase = 'below';
	} else if (I < p1) {
		amount = p.base + (p.rate_in / 100) * (I - p.floor);
		phase = 'in';
	} else if (I <= p2) {
		amount = max;
		phase = 'plateau';
	} else if (I <= p.ceiling) {
		amount = max - (p.rate_out / 100) * (I - p2);
		phase = 'out';
	} else {
		phase = 'above';
	}
	return { amount: r2m(Math.max(0, amount)), phase, p1, p2, max: r2m(max) };
}

/** The toddler supplement for ONE toddler (s.6ב1(א)): rate_out is divided by the number of toddlers. */
export function toddlerOne(t, g, income, n) {
	const I = Number(income) || 0;
	const k = t[g];
	if (I <= t.floor) { return 0; }
	if (I < t.p1) { return r2m(Math.min(t.max, (t.rate_in / 100) * (I - t.floor))); }
	if (I <= k.p2) { return t.max; }
	return r2m(Math.max(0, t.max - ((k.rate_out / Math.max(1, n)) / 100) * (I - k.p2)));
}

/** The single parent's toddler supplement for ONE toddler (s.6ב2(א)): the phase-out rate is 500 / (end - p2). */
export function singleToddlerOne(t, g, income) {
	const I = Number(income) || 0;
	const k = t[g];
	if (I <= t.floor) { return 0; }
	if (I < t.p1) { return r2m(Math.min(t.max, (t.rate_in / 100) * (I - t.floor))); }
	if (I <= k.p2) { return t.max; }
	return r2m(Math.max(0, t.max - (t.max / (k.end - k.p2)) * (I - k.p2)));
}

/** The excess household income (s.5(ב)): both incomes over base + each one's part above the pivot, up to the cap. */
export function excessIncome(s, own, spouse) {
	const o = Math.max(0, Number(own) || 0);
	const sp = Math.max(0, Number(spouse) || 0);
	const allow = s.base + Math.min(Math.max(0, o - s.pivot), s.cap) + Math.min(Math.max(0, sp - s.pivot), s.cap);
	return r2m(Math.max(0, o + sp - allow));
}

/** The women-60 excess (s.6ה(ג)): her pivot and cap differ from the spouse's. */
export function excessWomen(w, own, spouse) {
	const s = w.spouse;
	const o = Math.max(0, Number(own) || 0);
	const sp = Math.max(0, Number(spouse) || 0);
	const allow = s.base + Math.min(Math.max(0, o - s.pivot_self), s.cap_self) + Math.min(Math.max(0, sp - s.pivot_spouse), s.cap_spouse);
	return r2m(Math.max(0, o + sp - allow));
}

export function groupOf(kids) { return kids >= 3 ? 'k3' : 'k12'; }

/** The year's payment calendar (s.12): equal installments by the filing date; one payment up to the single-payment line. */
export function payments(rm, year, filedIso, total, singleMax) {
	const filed = String(filedIso || '');
	const next = year + 1;
	let row = null;
	for (const r of rm.payments.rows) {
		if (filed <= `${next}-${r.filed_by}`) { row = r; break; }
	}
	if (!row || !(total > 0)) { return { rows: [], late: Boolean(!row && total > 0) }; }
	const dates = row.dates.map((d) => (d.startsWith('+') ? `${next + 1}-${d.slice(1)}` : `${next}-${d}`));
	if (total <= singleMax) { return { rows: [{ date: dates[0], amount: r2m(total) }], late: false, single: true }; }
	const each = Math.floor((total / dates.length) * 100) / 100;
	const rows = dates.map((d, i) => ({ date: d, amount: i === dates.length - 1 ? r2m(total - each * (dates.length - 1)) : each }));
	return { rows, late: false, single: false };
}

function err(errors, field, he) { errors.push({ field, he }); }

/** Read and check the input. */
export function normalize(rm, raw) {
	const i = Object.assign({}, MAANAK_DEFAULT, raw || {});
	const errors = [];
	const year = Number(i.year);
	if (!rm.years[String(year)]) { err(errors, 'year', `שנת המס: ${rm.years_open.join(' או ')}`); }
	const by = numM(i.by);
	if (!(Number.isInteger(by) && by >= 1900 && by <= (year || 2025))) { err(errors, 'by', 'שנת לידה: 4 ספרות, למשל 1990'); }
	const kids = numM(blankM(i.kids) ? 0 : i.kids);
	if (!(Number.isInteger(kids) && kids >= 0 && kids <= 20)) { err(errors, 'kids', 'מספר הילדים: 0 עד 20'); }
	const toddlers = numM(blankM(i.toddlers) ? 0 : i.toddlers);
	if (!(Number.isInteger(toddlers) && toddlers >= 0 && toddlers <= 10)) { err(errors, 'toddlers', 'מספר הפעוטות: 0 עד 10'); } else if (Number.isInteger(kids) && toddlers > kids) { err(errors, 'toddlers', 'הפעוטות הם חלק מהילדים: לא יותר ממספר הילדים'); }
	const income = numM(i.income);
	if (!(income >= 0 && income <= 1000000)) { err(errors, 'income', 'ההכנסה החודשית הממוצעת: מספר, למשל 5,000'); }
	const months = numM(blankM(i.months) ? 12 : i.months);
	if (!(Number.isInteger(months) && months >= 1 && months <= 12)) { err(errors, 'months', 'חודשי עבודה: 1 עד 12'); }
	const extra = numM(blankM(i.extra) ? 0 : i.extra);
	if (!(extra >= 0 && extra <= 1000000)) { err(errors, 'extra', 'הכנסה נוספת: מספר, 0 אם אין'); }
	const single = Boolean(i.single) && kids > 0;
	const spouse = Boolean(i.spouse) && !single;
	const spouseIncome = spouse ? numM(blankM(i.spouseIncome) ? 0 : i.spouseIncome) : 0;
	if (!(spouseIncome >= 0 && spouseIncome <= 1000000)) { err(errors, 'spouseIncome', 'הכנסת בן/בת הזוג: מספר, 0 אם אין'); }
	const sex = i.sex === 'm' ? 'm' : 'f';
	return { errors, p: { year, by, kids, toddlers, income, months, extra, single, spouse, spouseIncome, sex, realEstate: Boolean(i.realEstate), filed: String(i.filed || '') } };
}

/** The monthly grant for tax year 2025 by the law, without the 20 ₪ line and the months: every component with its section. */
export function monthly2025(rm, p) {
	const y = rm.years['2025'];
	const g = groupOf(p.kids);
	const own = p.income + p.extra;
	const lines = [];
	let total = 0;
	let track = 'regular';
	let cut = 0;
	const minM = y.min_month;
	if (p.single) {
		track = 'single';
		const s = y.single[g];
		const b = schedule(s, p.income, p.extra);
		const base = b.amount >= minM ? r2m(b.amount * y.single.pct / 100) : 0;
		lines.push({ key: 'base', he: `הורה יחיד, ${p.kids >= 3 ? '3 ילדים ומעלה' : 'ילד אחד או שניים'}: ${b.amount ? `${b.amount.toFixed(2)} ₪ × ${y.single.pct}%` : 'מחוץ לטווח'}`, amount: base, section: s.section, phase: b.phase, raw: b.amount });
		total += base;
		if (p.extra > 0) { lines.push({ key: 'extra', he: 'ההכנסה הנוספת הקטינה את המענק', amount: 0, section: y.single.extra_section, info: true }); }
		if (p.toddlers > 0) {
			const one = singleToddlerOne(y.single_toddler, g, p.income);
			const t = one >= minM ? r2m(one * p.toddlers) : 0;
			lines.push({ key: 'toddler', he: `תוספת פעוטות: ${p.toddlers} × ${one.toFixed(2)} ₪`, amount: t, section: y.single_toddler.section });
			total += t;
		}
		return { track, group: g, lines, total: r2m(total), cut, phase: b.phase, schedule: s };
	}
	const s = y.regular[g];
	const b = schedule(s, p.income, p.extra);
	let base = b.amount;
	const rate = g === 'k3' ? y.spouse.rate_k3 : y.spouse.rate_k12;
	if (p.toddlers > 0 && p.kids > 0) {
		// s.6ב1: the supplement is added to the 150% grant, and the spouse rule then applies to the total with its own lines.
		const b2 = base >= minM ? r2m(base * rm.parent_pct / 100) : 0;
		lines.push({ key: 'base', he: `הורה, ${p.kids >= 3 ? '3 ילדים ומעלה' : 'ילד אחד או שניים'}: ${base.toFixed(2)} ₪ × ${rm.parent_pct}%`, amount: b2, section: `${s.section}; ${rm.parent_section}`, phase: b.phase, raw: base });
		const one = toddlerOne(y.toddler, g, p.income, p.toddlers);
		const t = one >= minM ? r2m(one * p.toddlers) : 0;
		lines.push({ key: 'toddler', he: `תוספת פעוטות: ${p.toddlers} × ${one.toFixed(2)} ₪`, amount: t, section: y.toddler.section });
		total = r2m(b2 + t);
		if (p.extra > 0) { lines.push({ key: 'extra', he: 'ההכנסה הנוספת הקטינה את המענק הבסיסי (לא את תוספת הפעוטות)', amount: 0, section: 'סעיף 4', info: true }); }
		if (p.spouse) {
			const e = excessIncome(y.spouse_toddler, own, p.spouseIncome);
			cut = r2m(Math.min(total, e * rate / 100));
			lines.push({ key: 'spouse', he: e > 0 ? `הכנסת בן/בת הזוג: ${rate}% מההכנסה העודפת (${e.toFixed(2)} ₪)` : 'הכנסת בן/בת הזוג: אין הכנסה עודפת, אין הפחתה', amount: -cut, section: y.spouse_toddler.section });
			total = r2m(total - cut);
		}
		return { track, group: g, lines, total, cut, phase: b.phase, schedule: s };
	}
	if (p.extra > 0) { lines.push({ key: 'extra', he: 'ההכנסה הנוספת הקטינה את המענק', amount: 0, section: 'סעיף 4', info: true }); }
	if (p.spouse) {
		const e = excessIncome(y.spouse, own, p.spouseIncome);
		cut = r2m(Math.min(base, e * rate / 100));
		lines.push({ key: 'spouse', he: e > 0 ? `הכנסת בן/בת הזוג: ${rate}% מההכנסה העודפת (${e.toFixed(2)} ₪)` : 'הכנסת בן/בת הזוג: אין הכנסה עודפת, אין הפחתה', amount: -cut, section: y.spouse.section });
		base = r2m(base - cut);
	}
	if (base < minM) { base = 0; }
	const pct = p.kids > 0 ? rm.parent_pct : 100;
	const v = r2m(base * pct / 100);
	lines.unshift({ key: 'base', he: p.kids > 0 ? `הורה, ${p.kids >= 3 ? '3 ילדים ומעלה' : 'ילד אחד או שניים'}: ${b.amount.toFixed(2)} ₪${cut ? ` פחות ${cut.toFixed(2)} ₪` : ''} × ${pct}%` : `בלי ילדים, גיל 55 ומעלה: ${b.amount.toFixed(2)} ₪`, amount: v, section: p.kids > 0 ? `${s.section}; ${rm.parent_section}` : s.section, phase: b.phase, raw: b.amount });
	return { track, group: g, lines, total: v, cut, phase: b.phase, schedule: s };
}

/** The women-60 track (s.6ה): her own schedule and spouse rule, no 150% and no toddler supplement. */
export function women2025(rm, p) {
	const w = rm.years['2025'].women60;
	const b = schedule(w, p.income, p.extra);
	let v = b.amount;
	let cut = 0;
	if (p.spouse) {
		const e = excessWomen(w, p.income + p.extra, p.spouseIncome);
		cut = r2m(Math.min(v, e * w.spouse.rate / 100));
		v = r2m(v - cut);
	}
	if (v < rm.years['2025'].min_month) { v = 0; }
	return { total: v, cut, phase: b.phase, raw: b.amount };
}

/** The grant curve for the reader's family: the monthly grant (no spouse, no extra income) at each income. */
export function curve(rm, p, steps = 48) {
	const y = rm.years['2025'];
	const g = groupOf(p.kids);
	const top = p.single ? y.single[g].ceiling : Math.max(y.regular[g].ceiling, p.toddlers > 0 ? y.toddler[g].published_top + 200 : 0);
	const max = Math.ceil((top + 600) / 500) * 500;
	const pts = [];
	for (let i = 0; i <= steps; i += 1) {
		const inc = Math.round((max * i) / steps);
		const r = monthly2025(rm, Object.assign({}, p, { income: inc, extra: 0, spouse: false, spouseIncome: 0 }));
		pts.push([inc, r.total]);
	}
	return { max, pts };
}

/** The work grant for the year: eligibility, the monthly and annual amount, the calendar. */
export function compute(registry, input) {
	const rm = registry.rights_maanak;
	const { errors, p } = normalize(rm, input);
	if (errors.length) { return { ok: false, errors }; }
	const y = rm.years[String(p.year)];
	const age = p.year - p.by;
	const w60 = rm.years['2025'].women60;
	const isWomen60 = p.sex === 'f' && p.by >= w60.born_from && age >= w60.age_from && age < w60.age_below;
	const reasons = [];
	const notes = [];
	if (p.realEstate) { reasons.push({ he: rm.real_estate.he, section: rm.real_estate.section }); }
	if (p.kids > 0 && age < rm.age.with_kids && !isWomen60) { reasons.push({ he: `להורה המענק מגיל ${rm.age.with_kids}; בשנת המס מלאו לך ${age}`, section: rm.age.section }); }
	if (p.kids === 0 && age < rm.age.no_kids && !isWomen60) { reasons.push({ he: `בלי ילדים מתחת לגיל ${rm.child_under}, המענק מגיל ${rm.age.no_kids}; בשנת המס מלאו לך ${age}`, section: rm.age.section }); }
	const base = { ok: true, year: p.year, p, age, women: isWomen60, reasons, notes, deadline: y.deadline_online, deadlineHe: y.deadline_he };
	if (y.status === 'bands') {
		const g = groupOf(p.kids);
		const key = p.single ? `single_${g}` : g;
		const band = isWomen60 ? y.bands.women60 : y.bands[key];
		const inBand = p.income > band[0] && p.income <= band[1];
		const tBand = p.toddlers > 0 && !p.single ? y.bands[`toddler_${g}`] : null;
		const inT = tBand ? p.income > tBand[0] && p.income <= tBand[1] : false;
		const eligible = !reasons.length && (inBand || inT);
		if (!reasons.length && !eligible) { reasons.push({ he: `ההכנסה החודשית הממוצעת מחוץ לטווח של ${p.year}: ${band[0].toLocaleString('en-US')} עד ${band[1].toLocaleString('en-US')} ₪`, section: 'מדריך רשות המסים לשנת המס 2024' }); }
		return Object.assign(base, { mode: 'bands', eligible, band, tBand, inBand, inT, monthly: null, annual: null, maxYear: y.max_year, toddlerMax: y.toddler_max, lines: [], pay: { rows: [], late: false } });
	}
	let m = { track: 'none', lines: [], total: 0, cut: 0, phase: 'below', group: groupOf(p.kids) };
	if (!reasons.length) {
		if (p.kids > 0 || age >= rm.age.no_kids) { m = monthly2025(rm, p); }
		if (isWomen60) {
			const wv = women2025(rm, p);
			if (wv.total > m.total) {
				m = { track: 'women60', group: m.group, lines: [{ key: 'women60', he: `מסלול עובדת מגיל 60: ${wv.raw.toFixed(2)} ₪${wv.cut ? ` פחות ${wv.cut.toFixed(2)} ₪ בשל הכנסת בן הזוג` : ''}`, amount: wv.total, section: w60.section }], total: wv.total, cut: wv.cut, phase: wv.phase };
				notes.push({ he: 'מסלול העובדת מגיל 60 גבוה מהמסלול הרגיל, ולכן הוא שנבחר (סעיף 6ה(א))' });
			} else if (wv.total > 0) {
				notes.push({ he: `גם מסלול העובדת מגיל 60 נבדק (${wv.total.toFixed(2)} ₪ בחודש); הרגיל גבוה יותר` });
			}
		}
	}
	const monthly = m.total >= y.min_month ? m.total : 0;
	let annual = r2m(monthly * p.months);
	if (annual > 0 && annual < y.min_month) { annual = 0; }
	const eligible = !reasons.length && annual > 0;
	if (!reasons.length && !eligible) {
		const sch = m.schedule || rm.years['2025'].regular[m.group];
		if (m.phase === 'below' || p.income <= (sch ? sch.floor : 0)) { reasons.push({ he: `ההכנסה החודשית הממוצעת (${p.income.toLocaleString('en-US')} ₪) לא עולה על הסף שבו המענק מתחיל`, section: sch ? sch.section : 'סעיף 2' }); } else { reasons.push({ he: 'ההכנסה גבוהה מהתקרה, או שהפחתות ההכנסה הנוספת והכנסת בן/בת הזוג איפסו את המענק', section: 'סעיפים 2, 4 ו-5' }); }
	}
	const pay = payments(rm, p.year, p.filed, annual, y.single_payment_max);
	if (p.months < 12) { notes.push({ he: `המענק משולם על ${p.months} חודשי עבודה בפועל; חודש של דמי אבטלה או של שכר ממעסיק קרוב משפחה בלבד לא נספר` }); }
	const g = m.group;
	const sch = p.single ? rm.years['2025'].single[g] : rm.years['2025'].regular[g];
	const maxMonth = isWomen60 && m.track === 'women60' ? w60.max : r2m(sch.max * (p.kids > 0 ? rm.parent_pct / 100 : 1) + (p.toddlers > 0 ? p.toddlers * rm.years['2025'].toddler.max : 0));
	return Object.assign(base, { mode: 'full', eligible, track: m.track, group: g, lines: m.lines, monthly, annual, cut: m.cut, phase: m.phase, maxMonth, maxYear: r2m(maxMonth * 12), pay, schedule: sch });
}

/** A band for analytics: never an amount. */
export function grantBand(r) {
	if (!r.ok) { return 'error'; }
	if (!r.eligible) { return 'none'; }
	if (r.mode === 'bands') { return 'band'; }
	return r.annual < 3000 ? 'low' : r.annual < 7000 ? 'mid' : 'high';
}
