/**
 * Rights guide wave 2B (21.10.2026): reserve-duty pay (תגמולי מילואים), the grants the IDF publishes for 2026, and the
 * dismissal protection, from the service dates to the last protected day.
 *
 * Dependency-free ES module (dates.js only). Every number comes from registry.rights_miluim (the National Insurance
 * Institute's reserve-service pages, chapter 12 of the National Insurance Law, the Discharged Soldiers (Return to Work) Law,
 * the extension order of 29.4.2026 and the IDF's 2026 policy, read on its checked_on date), registry.rights_btl (the basic
 * amount and the average wage) and registry.rights_tax (the reservist credit points):
 *  - The daily reward: the income of the 3 months before the 1st of the month in which the service starts / 90 (s.273(א)(1)),
 *    each month at least 68% of the basic amount (s.273(א)(2)); fewer than 60 days worked: the best 3 of 6 months (s.273(ב));
 *    at least 95% of basic amount 3 / 30 = 328.76 and at most 5 x basic amount 3 / 30 = 1,730.33 a day (s.270, s.272(ב)).
 *    A student and a person not working get the minimum (s.272(א)(3)); a person who stopped working less than 60 days before
 *    the service is paid by the 3 months before stopping (s.274(א)).
 *  - The days paid: every full week as 7, a remainder of 6 days as 7, a smaller remainder x 1.4 (s.271(א)).
 *  - The self-employed compensation: 25% of the reward, reward and compensation together at most the maximum (the
 *    Institute's page).
 *  - A further service: within 60 days of the previous one, the previous basis if higher (s.279(א)); in an emergency period,
 *    within 90 days (to the 1st of the month), the basis of the first emergency service plus a rise of up to 20% (s.274ב).
 *  - Who pays: the employer, for a monthly wage or 75 days in the quarter with one employer, on the regular pay day, and the
 *    Institute refunds it (s.276(א), s.280); everyone else, the Institute (s.276(ב)); a claim within 12 months (s.296).
 *  - The protection: no dismissal in the service without a permit (s.41א(ב)); more than 2 consecutive days, also 30 days
 *    after; 60 cumulative days in the calendar year and 7 consecutive days, also days 31 to 60 (the extension order, s.5,
 *    from 29.4.2026), and no unpaid leave in those days (s.6 of the order, read with the same gate).
 *  - The IDF's 2026 grants by activity tier (special payment, personal expenses, family, household, special family, the
 *    holiday voucher, the digital wallet), and the credit points of s.39ב in the next tax year.
 */

import { addDays, addMonths, parseDate, daysBetween } from './dates.js';

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const r1 = (n) => Math.round((n + Number.EPSILON) * 10) / 10;
const blank = (v) => v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v));
const heDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
export const STATUS = ['employee', 'self', 'student', 'none'];
export const TIERS = ['ap', 'a', 'b', 'c', 'd', 'e'];
export const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

/** "נובמבר 2026" from "2026-11" or "2026-11-01". */
export function monthHe(key) {
	const [y, m] = String(key).split('-').map(Number);
	return `${MONTHS_HE[m - 1] || ''} ${y}`;
}
/** The 6 months before the month in which the service starts, oldest first; the last 3 are the quarter of s.273(א)(1). */
export function basisMonths(startIso) {
	const out = [];
	for (let i = 6; i >= 1; i -= 1) { out.push(addMonths(`${startIso.slice(0, 7)}-01`, -i).slice(0, 7)); }
	return out;
}
/** The number of days of [from, to] that fall inside [a, b]. */
export function overlapDays(from, to, a, b) {
	const s = from > a ? from : a;
	const e = to < b ? to : b;
	return e < s ? 0 : daysBetween(s, e) + 1;
}
/** The service split by calendar month: [{ ym, days }]. */
export function serviceMonths(start, end) {
	const out = [];
	let first = `${start.slice(0, 7)}-01`;
	while (first <= end) {
		const last = addDays(addMonths(first, 1), -1);
		out.push({ ym: first.slice(0, 7), days: overlapDays(start, end, first, last) });
		first = addMonths(first, 1);
	}
	return out;
}

/** s.271(א): every full week paid as 7 days, a remainder of 6 as 7, a smaller remainder x 1.4. */
export function paidDays(ml, days) {
	const a = ml.addition;
	const weeks = Math.floor(days / a.week);
	const rem = days - weeks * a.week;
	const extra = rem === a.six ? a.six_paid : r1(rem * a.factor);
	const paid = r1(weeks * a.week + extra);
	return { days, weeks, rem, extra, paid, add: r1(paid - days) };
}

/** s.273(א)(2): each month of the quarter counts at least 68% of the basic amount. */
export function monthFloor(reg) {
	const p = reg.rights_miluim.pay;
	return r2(reg.rights_btl.basic_amount[p.basic_key] * p.month_floor_pct / 100);
}
/** s.273(א)(1): the income of the months (each floored) / 90. */
export function quarterDaily(reg, months) {
	const p = reg.rights_miluim.pay;
	const floor = monthFloor(reg);
	const raw = months.map((m) => Number(m) || 0);
	const used = raw.map((m) => Math.max(m, floor));
	const sum = r2(used.reduce((s, m) => s + m, 0));
	return { raw, used, floored: used.map((u, i) => u > raw[i]), sum, daily: r2(sum / p.quarter_divisor) };
}
/** s.273(ב): the three months with the highest income of six (their positions, oldest first). */
export function bestThree(six) {
	return six.map((v, i) => [Number(v) || 0, i]).sort((x, y) => y[0] - x[0] || x[1] - y[1]).slice(0, 3).map((x) => x[1]).sort((x, y) => x - y);
}

/** The digital wallet of one tier for n days of 2026: the day bands, up to the maximum. */
export function walletFor(w, n) {
	if (!w) { return 0; }
	const sum = w.bands.reduce((s, [a, b, rate]) => s + Math.max(0, Math.min(n, b === null ? n : b) - a + 1) * rate, 0);
	return Math.min(w.max, sum);
}

/**
 * The IDF's 2026 grants for one tier. n = the days served in 2026 (any order type), old8 = the days of צו 8 from 7.10.2023
 * to 31.12.2025 (they count toward the 40 and 60 days), kid14 / special = the family facts the grants depend on.
 * Each line: { key, ok, days, rate, amount, low (where the page's wording leaves a range), cash, date }.
 */
export function grantsFor(ml, tier, n, old8, kid14, special) {
	const g = ml.grants;
	const out = [];
	const add = (key, ok, extra) => out.push(Object.assign({ key, ok }, extra));
	const sp = g.special;
	const spDays = Math.max(0, n - Math.max(0, sp.from_day - 1 - (sp.counts_old8 ? old8 : 0)));
	add('special', spDays > 0, { days: spDays, rate: sp.rates[tier], amount: spDays * sp.rates[tier], cash: true, date: sp.paid_on });
	const pe = g.personal;
	const peOk = n + (pe.counts_old8 ? old8 : 0) >= pe.min_days && n > 0;
	const peDays = peOk ? Math.max(0, n - Math.max(0, pe.from_day - 1 - old8)) : 0;
	const peLow = peOk ? Math.max(0, n - Math.max(0, pe.heading_from_day - 1 - old8)) : 0;
	add('personal', peOk && peDays > 0, { days: peDays, lowDays: peLow, rate: pe.rates[tier], amount: peDays * pe.rates[tier], low: peLow * pe.rates[tier], cash: true });
	const fa = g.family;
	const faOk = kid14 && n > 0 && n + (fa.counts_old8 ? old8 : 0) >= fa.min_days;
	const faDays = faOk ? Math.max(0, n - Math.max(0, fa.from_day - 1 - old8)) : 0;
	add('family', faOk && faDays > 0, { days: faDays, rate: fa.rates[tier], amount: faDays * fa.rates[tier], cash: true, needs: !kid14 });
	const hh = g.household;
	const hhAmt = hh.amounts[tier];
	add('household', Boolean(hhAmt) && n >= hh.min_days, { amount: hhAmt && n >= hh.min_days ? hhAmt : 0, cash: true, tierOk: Boolean(hhAmt) });
	const sf = g.special_family;
	add('special_family', special && n >= sf.min_days, { amount: special && n >= sf.min_days ? sf.amount : 0, cash: true, needs: !special });
	const vo = g.voucher;
	const row = vo.rows[tier][kid14 ? 'kids' : 'none'];
	const voOk = n >= vo.min_days;
	const voAmt = voOk ? Math.min(row[2], row[0] + row[1] * (Math.min(n, vo.to_day) - vo.min_days)) : 0;
	add('voucher', voOk, { amount: voAmt, base: row[0], step: row[1], max: row[2], approx: voOk && n > vo.min_days && n < vo.to_day, cash: false });
	const wa = g.wallet;
	const wt = wa.tiers[tier];
	const waOk = Boolean(wt) && n >= wa.min_days;
	add('wallet', waOk, { amount: waOk ? walletFor(wt, n) : 0, max: wt ? wt.max : 0, cash: false, tierOk: Boolean(wt) });
	const cash = out.filter((x) => x.cash && x.ok).reduce((s, x) => s + x.amount, 0);
	const cashLow = out.filter((x) => x.cash && x.ok).reduce((s, x) => s + (x.low !== undefined ? x.low : x.amount), 0);
	const other = out.filter((x) => !x.cash && x.ok).reduce((s, x) => s + x.amount, 0);
	return { tier, lines: out, cash, cashLow, other };
}

/** s.39ב (rights_tax): the credit points in a tax year for the reserve days of the year before. */
export function reservistPoints(rt, taxYear, days) {
	const rv = rt && rt.points ? rt.points.reservist : null;
	const d = Number(days) || 0;
	if (!rv || taxYear < rv.from_year || !rv.temp_years.includes(taxYear) || d <= 0) { return 0; }
	if (d >= rv.base_days) { return Math.min(rv.max_pts, rv.base_pts + Math.floor((d - rv.base_days) / rv.step_days) * rv.step_pts); }
	const band = rv.temp_bands.find((b) => b[0] <= d && d <= b[1]);
	return band ? band[2] : 0;
}

/** The spouse's extra paid absence days by the reservist's cumulative days in the year (s.12.1 of the order). */
export function spouseDays(ml, cum) {
	const row = ml.protect.order.spouse_days.find((x) => cum >= x[0] && (x[1] === null || cum <= x[1]));
	return row ? row[2] : 0;
}

const intIn = (v, lo, hi) => { const n = blank(v) ? NaN : Number(v); return Number.isInteger(n) && n >= lo && n <= hi ? n : NaN; };
const optInt = (v, lo, hi) => (blank(v) ? 0 : intIn(v, lo, hi));

/**
 * input = { status ('employee'|'self'|'student'|'none'), wageMode ('same'|'each'), wage (monthly gross, or the self-employed
 *           monthly income of the advances), wages (six months before the start month, oldest first), employerPays (monthly wage
 *           or 75 days with one employer), short60 (fewer than 60 days worked in the quarter), stopped (not working, stopped less
 *           than 60 days before), start, end (ISO), prior (reserve days earlier in the same calendar year), emergency (צו 8 /
 *           an emergency period), prevEnd (ISO, the end of the previous service), prevWage (monthly income before the first
 *           service), tier ('' or one of TIERS), old8 (צו 8 days 7.10.2023-31.12.2025), kid14, special }
 */
export function compute(registry, input) {
	const ml = registry.rights_miluim;
	const btl = registry.rights_btl;
	const p = ml.pay;
	const errors = [];
	const status = STATUS.includes(input.status) ? input.status : null;
	if (!status) { errors.push({ field: 'status', he: 'בחרו מה עשיתם לפני השירות: עבודה שכירה, עבודה עצמאית, לימודים או בלי עבודה' }); }
	const start = parseDate(input.start);
	const end = parseDate(input.end);
	if (!start) { errors.push({ field: 'start', he: 'היום הראשון של השירות: תאריך מלא, לדוגמה 1.11.2026' }); }
	if (!end) { errors.push({ field: 'end', he: 'היום האחרון של השירות: תאריך מלא, לדוגמה 30.11.2026' }); }
	if (start && end && end < start) { errors.push({ field: 'end', he: 'היום האחרון לפני היום הראשון: בדקו את התאריכים' }); }
	if (start && end && end >= start && daysBetween(start, end) + 1 > 366) { errors.push({ field: 'end', he: 'יותר מ-366 ימים ברצף: הזינו כל תקופת שירות בנפרד' }); }
	const stopped = status === 'none' && input.stopped === true;
	const needsIncome = status === 'employee' || status === 'self' || stopped;
	const each = input.wageMode === 'each';
	let six = [];
	if (needsIncome) {
		if (each) {
			const list = Array.isArray(input.wages) ? input.wages : [];
			for (let i = 0; i < p.long_months; i += 1) {
				const v = blank(list[i]) ? NaN : Number(list[i]);
				if (!(v >= 0 && v < 1e7)) { errors.push({ field: `w${i}`, he: `ההכנסה בחודש ${i + 1} מתוך ${p.long_months}: מספר, 0 בחודש בלי הכנסה` }); }
				six.push(v);
			}
			if (six.every((v) => v >= 0) && !six.slice(p.long_months - p.quarter_months).some((v) => v > 0) && !(status === 'employee' && input.short60 === true)) {
				errors.push({ field: 'w5', he: 'אין הכנסה ב-3 החודשים האחרונים: הזינו את ההכנסה ברוטו, או סמנו שעבדתם פחות מ-60 ימים' });
			}
		} else {
			const w = blank(input.wage) ? NaN : Number(input.wage);
			if (!(w > 0 && w < 1e7)) { errors.push({ field: 'wage', he: status === 'self' ? 'ההכנסה החודשית שעליה משולמות המקדמות: מספר חיובי' : 'השכר החודשי ברוטו: מספר חיובי' }); }
			six = Array(p.long_months).fill(w);
		}
	}
	const prior = optInt(input.prior, 0, 365);
	if (Number.isNaN(prior)) { errors.push({ field: 'prior', he: 'ימי מילואים קודמים באותה שנה: מספר שלם, 0 עד 365' }); }
	const g = ml.grants;
	const old8Max = daysBetween(g.old8.from, g.old8.to) + 1;
	const old8 = optInt(input.old8, 0, old8Max);
	if (Number.isNaN(old8)) { errors.push({ field: 'old8', he: `ימי צו 8 מ-${heDay(g.old8.from)} עד ${heDay(g.old8.to)}: מספר שלם, 0 עד ${old8Max}` }); }
	const prevEnd = blank(input.prevEnd) ? null : parseDate(input.prevEnd);
	if (!blank(input.prevEnd) && !prevEnd) { errors.push({ field: 'pe', he: 'סיום השירות הקודם: תאריך מלא, או ריק' }); }
	if (prevEnd && start && prevEnd >= start) { errors.push({ field: 'pe', he: 'השירות הקודם צריך להסתיים לפני היום הראשון של השירות הזה' }); }
	const prevWage = blank(input.prevWage) ? null : Number(input.prevWage);
	if (prevWage !== null && !(prevWage > 0 && prevWage < 1e7)) { errors.push({ field: 'pw', he: 'ההכנסה החודשית לפני השירות הקודם: מספר חיובי, או ריק' }); }
	const tier = TIERS.includes(input.tier) ? input.tier : '';
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });
	const max = p.max_daily;
	const min = p.min_daily;
	const days = daysBetween(start, end) + 1;
	const months = basisMonths(start);

	// 1. The basis (s.273, s.274(א)).
	let base = null;
	if (needsIncome) {
		const q = quarterDaily(registry, six.slice(p.long_months - p.quarter_months));
		base = Object.assign({ kind: 'quarter', picked: [3, 4, 5] }, q);
		if (status === 'employee' && input.short60 === true) {
			const idx = bestThree(six);
			const b = quarterDaily(registry, idx.map((i) => six[i]));
			base = Object.assign({ kind: 'best3', picked: idx }, b);
		}
	}
	let raw = needsIncome ? base.daily : 0;
	const current = raw;

	// 2. A further service (s.279(א); s.274ב in an emergency period).
	const floor = monthFloor(registry);
	let rule = needsIncome ? 'base' : 'min';
	let sub = '';
	let prevDaily = null;
	let claimRaw = null;
	const firstOfMonth = `${start.slice(0, 7)}-01`;
	const gapStart = prevEnd ? daysBetween(prevEnd, start) : null;
	const gapMonth = prevEnd ? daysBetween(prevEnd, firstOfMonth) : null;
	const em = ml.emergency;
	if (prevEnd && prevWage !== null) {
		prevDaily = r2(Math.max(prevWage, floor) * p.quarter_months / p.quarter_divisor);
		if (input.emergency === true && gapMonth < em.gap_days && (status === 'employee' || status === 'none')) {
			rule = '274b';
			const top = r2(prevDaily * (100 + em.raise_pct) / 100);
			if (current <= prevDaily) { raw = prevDaily; sub = 'down'; } else if (current <= top) { raw = current; sub = 'up'; } else { raw = top; claimRaw = current; sub = 'over'; }
		} else if (input.emergency !== true && gapStart <= ml.drag.days) {
			rule = '279';
			if (prevDaily > raw) { raw = prevDaily; sub = 'prev'; } else { sub = 'current'; }
		}
	}
	const daily = Math.min(max, Math.max(min, raw));
	const atMin = raw < min;
	const atMax = raw > max;
	const claimDaily = claimRaw === null ? null : Math.min(max, Math.max(min, claimRaw));

	// 3. The days paid (s.271(א)) and the money.
	const pd = paidDays(ml, days);
	const reward = r2(daily * pd.paid);
	const compDaily = status === 'self' ? Math.max(0, Math.min(r2(daily * ml.self.comp_pct / 100), r2(max - daily))) : 0;
	const comp = r2(compDaily * pd.paid);
	const total = r2(reward + comp);
	const claimTotal = claimDaily === null ? null : r2(claimDaily * pd.paid);
	const monthly = r2(daily * p.divisor_month);

	// 4. Who pays (s.276, s.280) and the claim (s.296).
	const payer = status === 'employee' ? (input.employerPays === false ? 'claim' : 'employer') : status === 'self' ? 'self' : 'institute';

	// 5. The protection (s.41א(ב); the extension order of 29.4.2026).
	const pr = ml.protect;
	const ord = pr.order;
	const after = days >= pr.after_min_days;
	const p30 = after ? { from: addDays(end, 1), to: addDays(end, pr.after_days) } : null;
	const cum = prior + days;
	const extFrom = addDays(end, ord.ext_from_day);
	const extTo = addDays(end, ord.ext_to_day);
	const ext = !after || cum < ord.min_days ? 'no' : extTo < ord.clause_from ? 'old' : days >= ord.consecutive ? 'ok' : 'check';
	const extOn = ext === 'ok' || ext === 'check';
	// s.6 of the order (no unpaid leave in days 31 to 60) speaks of "משרת המילואים", the term s.5 defines (60 days, 7 in a row):
	// it is read here with the same gate as the dismissal protection.
	const unpaid = extOn;
	const protectEnd = extOn ? extTo : p30 ? p30.to : end;
	const windows = [{ key: 'during', from: start, to: end }];
	if (p30) { windows.push({ key: 'after', from: p30.from, to: p30.to }); }
	if (extOn) { windows.push({ key: 'ext', from: extFrom, to: extTo, state: ext }); }
	const avg5 = btl.avg_wage.s1_benefits * pr.remedy.avg_mult;
	const wageNow = needsIncome ? (Number(six[p.long_months - 1]) || 0) : 0;
	const wage5 = status === 'employee' ? r2(wageNow * pr.remedy.wage_mult) : 0;
	const remedy = { avg5, wage5, higher: Math.max(avg5, wage5) };
	const spouse = spouseDays(ml, cum);

	// 6. The grants of 2026 and the credit points of the next tax year.
	const gy = g.year;
	const n26 = overlapDays(start, end, `${gy}-01-01`, `${gy}-12-31`) + (Number(start.slice(0, 4)) === gy ? prior : 0);
	const tiers = tier ? [tier] : TIERS;
	const grants = n26 > 0 ? tiers.map((t) => grantsFor(ml, t, n26, old8, input.kid14 === true, input.special === true)) : [];
	const svcYear = Number(end.slice(0, 4));
	const yearDays = overlapDays(start, end, `${svcYear}-01-01`, `${svcYear}-12-31`) + (Number(start.slice(0, 4)) === svcYear ? prior : 0);
	const taxYear = svcYear + 1;
	const points = reservistPoints(registry.rights_tax, taxYear, yearDays);
	const taxOk = tier ? ml.tax.tiers.includes(tier) : null;
	const add25 = g.additional_2025;
	const addBand = add25.bands.find((b) => yearDays >= b[0] && (b[1] === null || yearDays <= b[1])) || null;

	// 7. Flags.
	if (status === 'student' || (status === 'none' && !stopped)) { add('info', 'min_status', `${p.min_he} (${p.section_min}).`, p.section_min); }
	if (needsIncome && atMin) { add('info', 'min', `לפי ההכנסה ${fmt(raw)} ש"ח ליום, פחות מהמינימום: משולמים ${fmt(min)} ש"ח ליום (${p.section_min}).`, p.section_min); }
	if (atMax) { add('info', 'max', `לפי ההכנסה ${fmt(raw)} ש"ח ליום, יותר מהמקסימום: משולמים ${fmt(max)} ש"ח ליום (${p.section_max}).`, p.section_max); }
	if (needsIncome && base.floored.some(Boolean)) { add('info', 'floor', `${p.floor_he} (${fmt(floor)} ש"ח), ולכן חודש עם הכנסה נמוכה נחשב בסכום הזה (${p.section_floor}).`, p.section_floor); }
	if (base && base.kind === 'best3') { add('info', 'best3', `${p.short_he}: ${base.picked.map((i) => monthHe(months[i])).join(', ')} (${p.section_short}).`, p.section_short); }
	if (stopped) { add('info', 'stopped', `${ml.stopped.he} (${ml.stopped.section}).`, ml.stopped.section); }
	if (status === 'none' && !stopped) { add('info', 'unemployment', `${ml.unemployment.he} (${ml.unemployment.section}).`, ml.unemployment.section); }
	if (rule === '274b') {
		const what = sub === 'down' ? 'ההכנסה ירדה: לפי ההכנסה שלפני השירות הראשון' : sub === 'up' ? `ההכנסה עלתה בפחות מ-${em.raise_pct}%: לפי ההכנסה הנוכחית` : `ההכנסה עלתה ביותר מ-${em.raise_pct}%: אוטומטית לפי ההכנסה הקודמת ועוד ${em.raise_pct}%; את היתרה אפשר לבקש אם העלייה נמשכה ${em.raise_months} חודשים רצופים והיא מעבודה (המעסיק מגיש בקשת הפרשים, או בתביעה אישית)`;
		add(sub === 'over' ? 'warn' : 'info', 'emergency', `שירות נוסף בתקופת חירום: ${what} (${em.section}).`, em.section);
	}
	if (input.emergency === true && prevEnd && prevWage !== null && status === 'self' && gapMonth < em.gap_days) { add('warn', 'emergency_self', `${em.self_he} (${em.section}).`, em.section); }
	if (input.emergency === true && prevEnd && prevWage !== null && rule !== '274b' && gapMonth >= em.gap_days) { add('info', 'emergency_gap', `ה-1 בחודש השירות חל ${gapMonth} ימים אחרי סיום השירות הקודם, ${em.gap_days} או יותר: החישוב הרגיל לפי 3 החודשים (${em.section}).`, em.section); }
	if (rule === '279') { add('info', 'drag', `השירות התחיל ${gapStart} ימים אחרי השירות הקודם, בתוך ${ml.drag.days}: ${sub === 'prev' ? 'לפי ההכנסה שלפני השירות הקודם, כי היא גבוהה יותר' : 'ההכנסה הנוכחית גבוהה יותר, ולכן לפיה'} (${ml.drag.section}).`, ml.drag.section); }
	if (prevEnd && prevWage === null) { add('info', 'prev_wage', 'יש שירות קודם, אבל בלי ההכנסה שלפניו: ההשוואה לשירות הקודם לא חושבה.', ml.drag.section); }
	if (input.emergency === true) { add('info', 'war', `${ml.addition.war_he}.`, ''); }
	if (start < ml.from) { add('warn', 'other_year', `השירות מתחיל לפני ${heDay(ml.from)}: הסכומים כאן הם של ${ml.from.slice(0, 4)}, והמינימום והמקסימום של שנה קודמת היו אחרים.`, p.section_max); }
	if (end >= ml.next_update) { add('info', 'next_year', `המינימום והמקסימום כאן הם של ${ml.from.slice(0, 4)}; הם מתעדכנים ב-1 בינואר לפי הסכום הבסיסי.`, p.section_max); }
	if (status === 'self') { add('info', 'self', `${ml.self.basis_he}.`, ''); }
	if (status === 'self' && Number(start.slice(0, 4)) <= 2025) { add('info', 'self_years', `${ml.self.years_he}.`, ''); }
	if (payer === 'employer') { add('info', 'diff', `${ml.payer.diff_he} (${ml.payer.transfer_section}).`, ml.payer.transfer_section); }
	if (needsIncome && status !== 'self') { add('info', 'bonus', `${p.bonus_he}.`, ''); }
	if (!after) { add('warn', 'short', `שירות של ${days === 1 ? 'יום אחד' : 'יומיים'}: ההגנה חלה רק בזמן השירות עצמו; 30 ימי ההגנה שאחריו חלים רק בשירות של יותר מיומיים רצופים (${pr.after_section}).`, pr.after_section); }
	if (ext === 'check') { add('warn', 'ext_check', `${cum} ימים מצטברים בשנה, אבל השירות הזה ${days} ימים: ההגנה בימים 31 עד 60 דורשת גם ${ord.consecutive} ימים רצופים; אם היו כאלה בשירות קודם השנה, היא חלה (${ord.section}).`, ord.section); }
	if (ext === 'old') { add('warn', 'ext_old', `ההגנה בימים 31 עד 60 לפי הצו חלה מ-${heDay(ord.clause_from)}; לפני כן חל הצו הקודם (${heDay(ord.prev.from)} עד ${heDay(ord.prev.to)}).`, ord.section); }
	if (n26 === 0) { add('info', 'grants_year', `המענקים כאן הם של מדיניות ${gy}; לשירות בשנה אחרת יש מדיניות אחרת באתר המילואים.`, ''); }
	if (n26 > 0 && !tier) { add('info', 'tier', `המענקים תלויים במדרג הפעילות של היחידה. ${g.tier_examples_he}.`, ''); }

	// 8. The dates to keep (only dates the law, the order or the policy set).
	const deadlines = [];
	const dl = (key, date, he, section, url) => { if (date) { deadlines.push({ key, date, he, section, url }); } };
	if (p30) { dl('after', p30.to, 'סוף 30 ימי ההגנה מפיטורים אחרי השירות', pr.after_section, pr.law_url); }
	if (extOn) { dl('ext', extTo, `סוף ההגנה בימים 31 עד 60 (${ext === 'check' ? 'אם היו 7 ימים רצופים' : 'לפי הצו'})`, ord.section, ord.url); }
	if (payer === 'self') { dl('self_wait', addDays(end, ml.self.auto_weeks * 7), `${ml.self.auto_weeks} שבועות אחרי השירות: אם התגמול לא שולם, תביעה אישית בטופס ${ml.payer.personal_form}`, 'אופן הגשת התביעה', ml.payer.claim_url); }
	if (payer !== 'employer') { dl('claim', addMonths(start, ml.claim.deadline_months), `הגשת תביעה לתגמול לכל המאוחר (${ml.claim.deadline_months} חודשים, נספר מהיום הראשון)`, ml.claim.section, ml.claim.url); }
	const gOne = tier && grants.length ? grants[0] : null;
	const special = gOne ? gOne.lines.find((x) => x.key === 'special') : null;
	if (special && special.ok) { dl('special', g.special.paid_on, `התגמול המיוחד לשנת ${gy}, ${fmt(special.amount)} ש"ח, משולם`, 'מדיניות 2026', g.url); }
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	// 9. The calendar strip: a row per month, from the month of the first service day to the last protected day.
	const lastDay = protectEnd > end ? protectEnd : end;
	const strip = [];
	let first = `${start.slice(0, 7)}-01`;
	while (first <= lastDay) {
		const monthLast = addDays(addMonths(first, 1), -1);
		const cells = [];
		for (let d = first; d <= monthLast; d = addDays(d, 1)) {
			let k = 'off';
			if (d >= start && d <= end) { k = 'svc'; } else if (p30 && d >= p30.from && d <= p30.to) { k = 'after'; } else if (d >= extFrom && d <= extTo && extOn) { k = 'ext'; } else if (d > end && d <= lastDay) { k = 'free'; }
			cells.push({ d, k, first: d === start, last: d === end, stop: d === protectEnd && protectEnd !== end });
		}
		strip.push({ ym: first.slice(0, 7), cells });
		first = addMonths(first, 1);
	}

	return {
		ok: true, status, stopped, needsIncome, wageMode: each ? 'each' : 'same', six, months, base, current, raw, rule, sub, prevEnd, prevWage, prevDaily, gapStart, gapMonth,
		claimRaw, claimDaily, claimTotal, daily, atMin, atMax, min, max, floor, monthly, start, end, days, pd, reward, compDaily, comp, total, payer,
		employerPays: input.employerPays !== false, emergency: input.emergency === true, prior, cum, after, p30, ext, extOn, extFrom, extTo, unpaid, protectEnd, windows,
		remedy, spouse, tier, old8, kid14: input.kid14 === true, special: input.special === true, n26, grants, svcYear, yearDays, taxYear, points, taxOk, addBand,
		byMonth: serviceMonths(start, end), deadlines, flags, strip,
	};
}

/** The same service at a range of monthly incomes, for the page table: the daily reward and the total for 30 days (s.271-273). */
export function byIncome(registry, base, list) {
	return list.map((w) => {
		const r = compute(registry, Object.assign({}, base, { status: 'employee', wageMode: 'same', wage: w, prevEnd: '', prevWage: '', short60: false }));
		return { wage: w, daily: r.daily, total: r.total, atMin: r.atMin, atMax: r.atMax };
	});
}
