/**
 * The rights wave (21.10.2026): maternity allowance (דמי לידה) and the birth grant (מענק לידה), from the qualifying
 * months to the last day of the dismissal protection.
 *
 * Dependency-free ES module (dates.js only). Every number comes from registry.rights_leida (the National Insurance
 * Institute's maternity pages, the gov.il claim service, chapter 3 of the National Insurance Law and the Women's
 * Employment Law, read on its checked_on date):
 *  - Eligibility: insurance contributions for 10 of the 14 months before the stop day, or 15 of 22 -> 105 days (15 weeks);
 *    6 of 14 -> 56 days (8 weeks) (s.50(א)). Employee and self-employed roles are counted separately.
 *  - The daily amount: an employee's wage in the 3 full months before the month of the stop day / 90, or in the 6 months
 *    / 180, the higher (s.54(א)); a self-employed person's income of the quarter (the advances) / 90, or a quarter of the
 *    previous year's assessment, the higher (s.54(ב)(2)); at most basic amount x 5 / 30 = 1,752.33 a day (s.53(א)).
 *  - The period starts on the stop day, but not earlier than 53 days (full) or 28 days (partial) before the birth (s.52);
 *    + 3 weeks per extra baby (2 when partial) (s.51(א1)); hospitalization of the mother (15 days and up: up to 4 weeks,
 *    2 when partial) and of the baby (up to 20 weeks, 12 when partial), all hospital extensions together up to 20 / 12
 *    weeks (s.51(א)); a complex disability, 5 weeks from 1.4.2026, all extensions up to 20 weeks (s.51(א3)).
 *  - The partner: 7 days together (twins 3 weeks, triplets 5) or instead of the mother after 6 weeks from the birth, at
 *    least 7 days, at the end of the period, paid by the partner's own wage (s.49(ב), (ד1)).
 *  - The birth grant by birth order and the multiple-birth figures (s.44), the multiple-birth allowance (s.45), the
 *    hospitalization grant paid to the hospital (s.43).
 *  - The Women's Employment Law: 26 weeks of leave (15 below 12 months with the employer), up to 7 before the expected
 *    birth (s.6(ב)); the same extensions; no dismissal in the leave (s.9(ג)(1)) and for 60 days after it without a
 *    permit (s.9(ג)(1א)); the parenting hour for 4 months (s.7(ג)(3)).
 *  - The claim: not before 9 weeks before the expected birth, not later than 12 months (s.296; the Institute's page).
 */

import { addDays, addMonths, parseDate, daysBetween } from './dates.js';

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const later = (a, b) => (a > b ? a : b);
const heDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
export const WHO = ['employee', 'self', 'both'];
export const SENIORITY = ['lt6', '6to12', 'gte12'];
export const PARTNER = ['none', 'together', 'swap'];
export const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

/** "נובמבר 2026" from "2026-11" or "2026-11-01". */
export function monthHe(key) {
	const [y, m] = String(key).split('-').map(Number);
	return `${MONTHS_HE[m - 1] || ''} ${y}`;
}
/** The 6 months before the month of the stop day, oldest first (the last 3 are the short basis). */
export function baseMonths(stopIso) {
	const out = [];
	for (let i = 6; i >= 1; i -= 1) { out.push(addMonths(`${stopIso.slice(0, 7)}-01`, -i).slice(0, 7)); }
	return out;
}

/** The qualifying period of one role: 'full' (105 days), 'partial' (56) or 'none', s.50(א). */
export function qualifyTier(lq, m14, m22) {
	const q = lq.qualify;
	if (m14 >= q.full_months) { return { tier: 'full', days: q.full_days, weeks: q.full_weeks, section: q.full_section, via: '14' }; }
	if (!blank(m22) && m22 >= q.full_alt_months) { return { tier: 'full', days: q.full_days, weeks: q.full_weeks, section: q.full_section, via: '22' }; }
	if (m14 >= q.partial_months) { return { tier: 'partial', days: q.partial_days, weeks: q.partial_weeks, section: q.partial_section, via: '14' }; }
	return { tier: 'none', days: 0, weeks: 0, section: q.full_section, via: '' };
}

/** An employee's daily wage: 3 months / 90 or 6 months / 180, the higher (s.54(א)). wages: six months, oldest first. */
export function employeeDaily(lq, wages) {
	const b = lq.base;
	const sumLong = r2(wages.reduce((a, w) => a + Number(w), 0));
	const sumShort = r2(wages.slice(-b.months_short).reduce((a, w) => a + Number(w), 0));
	const short = r2(sumShort / b.divisor_short);
	const long = r2(sumLong / b.divisor_long);
	return { sumShort, sumLong, short, long, daily: Math.max(short, long), basis: long > short ? 'long' : 'short' };
}

/** A self-employed person's daily income: the quarter of the advances / 90, or a quarter of last year's assessment / 90. */
export function selfDaily(lq, monthly, prevAnnual) {
	const b = lq.base;
	const quarter = r2(Number(monthly) * b.months_short);
	const short = r2(quarter / b.divisor_short);
	const prevQuarter = blank(prevAnnual) ? null : r2(Number(prevAnnual) / b.self_quarters);
	const prev = prevQuarter === null ? null : r2(prevQuarter / b.divisor_short);
	return { quarter, short, prevQuarter, prev, daily: prev !== null && prev > short ? prev : short, basis: prev !== null && prev > short ? 'prev' : 'short' };
}

/** The birth grant, s.44: one baby by birth order; twins, triplets and every further baby by the multiple-birth figures. */
export function grantFor(lq, babies, order) {
	const g = lq.grant;
	if (babies === 1) {
		const k = order === 1 ? 'first' : order === 2 ? 'second' : 'third_plus';
		return { amount: g[k], kind: k, pct: order === 1 ? g.pct_first : order === 2 ? g.pct_second : g.pct_third };
	}
	if (babies === 2) { return { amount: g.twins, kind: 'twins', pct: g.pct_twins }; }
	return { amount: g.triplets + (babies - 3) * g.each_extra, kind: 'triplets', pct: g.pct_triplets + (babies - 3) * g.pct_extra };
}

/** The multiple-birth allowance (3 babies and more): the Institute's 2026 table, and its sum over 20 months. */
export function multiAllowance(lq, babies) {
	const ma = lq.multi_allowance;
	if (babies < ma.min_babies) { return null; }
	const row = ma.rows.find((x) => x.kids === Math.min(babies, ma.rows[ma.rows.length - 1].kids));
	const parts = ma.bands.map((b, i) => ({ from: b[0], to: b[1], months: b[1] - b[0] + 1, amount: row.amounts[i] }));
	return { row, parts, total: parts.reduce((a, p) => a + p.months * p.amount, 0) };
}

/** The partner's together-days cap by the number of babies (the Institute's partner page). */
export function togetherCap(lq, babies) {
	const p = lq.partner;
	return babies === 1 ? p.together_days : babies === 2 ? p.together_twins_days : p.together_triplets_days;
}

const intIn = (v, lo, hi) => { const n = blank(v) ? NaN : Number(v); return Number.isInteger(n) && n >= lo && n <= hi ? n : NaN; };
const optInt = (v, lo, hi) => (blank(v) ? 0 : intIn(v, lo, hi));
const monthsErr = (errors, q, m14, m22, f14, f22, who) => {
	if (Number.isNaN(m14)) { errors.push({ field: f14, he: `חודשי ביטוח${who} ב-${q.full_window} החודשים שלפני הפסקת העבודה: 0 עד ${q.full_window}` }); }
	if (Number.isNaN(m22)) { errors.push({ field: f22, he: `חודשי ביטוח${who} ב-${q.full_alt_window} החודשים: 0 עד ${q.full_alt_window}, או ריק` }); } else if (!Number.isNaN(m14) && m22 !== '' && (m22 < m14 || m22 > m14 + (q.full_alt_window - q.full_window))) {
		errors.push({ field: f22, he: `ב-${q.full_alt_window} החודשים יש לפחות ${m14} ולא יותר מ-${m14 + q.full_alt_window - q.full_window} (כל ${q.full_window} החודשים נמצאים בתוכם)` });
	}
};

/**
 * input = { who ('employee'|'self'|'both'), m14, m22 (months insured in the 14 / 22 months before the stop day; for 'self'
 *           the self-employed months), sm14, sm22 (the self-employed role when who === 'both'), wageMode ('same'|'each'),
 *           wage (monthly gross), wages (six months, oldest first), selfIncome (monthly income of the advances),
 *           selfPrev (last year's assessed annual income, optional), stop (ISO), birth (ISO, expected or actual),
 *           babies (1-5), order (1, 2, 3 = third and later), seniority ('lt6'|'6to12'|'gte12', with the same employer),
 *           momHosp, babyHosp (days in hospital), complex (a complex disability recognised in the leave),
 *           partner ('none'|'together'|'swap'), pdays, pwage (the partner's monthly gross), pq (the partner qualifies) }
 */
export function compute(registry, input) {
	const lq = registry.rights_leida;
	const q = lq.qualify;
	const errors = [];
	const who = WHO.includes(input.who) ? input.who : null;
	if (!who) { errors.push({ field: 'who', he: 'בחרו: שכירה, עצמאית או שתיהן' }); }
	const m14 = intIn(input.m14, 0, q.full_window);
	const m22 = blank(input.m22) ? '' : intIn(input.m22, 0, q.full_alt_window);
	monthsErr(errors, q, m14, m22, 'm14', 'm22', who === 'both' ? ' כשכירה' : '');
	let sm14 = NaN;
	let sm22 = '';
	if (who === 'both') {
		sm14 = intIn(input.sm14, 0, q.full_window);
		sm22 = blank(input.sm22) ? '' : intIn(input.sm22, 0, q.full_alt_window);
		monthsErr(errors, q, sm14, sm22, 'sm14', 'sm22', ' כעצמאית');
	}
	const hasEmp = who === 'employee' || who === 'both';
	const hasSelf = who === 'self' || who === 'both';
	const each = input.wageMode === 'each';
	let wages = [];
	if (hasEmp) {
		if (each) {
			const list = Array.isArray(input.wages) ? input.wages : [];
			for (let i = 0; i < lq.base.months_long; i += 1) {
				const v = blank(list[i]) ? NaN : Number(list[i]);
				if (!(v >= 0 && v < 1e6)) { errors.push({ field: `w${i}`, he: `השכר בחודש ${i + 1} מתוך ${lq.base.months_long}: מספר, 0 בחודש בלי שכר` }); }
				wages.push(v);
			}
			if (wages.every((v) => v >= 0) && !wages.some((v) => v > 0)) { errors.push({ field: 'w5', he: 'אין שכר באף חודש: הזינו את השכר ברוטו של החודשים' }); }
		} else {
			const w = blank(input.wage) ? NaN : Number(input.wage);
			if (!(w > 0 && w < 1e6)) { errors.push({ field: 'wage', he: 'השכר החודשי ברוטו: מספר חיובי' }); }
			wages = Array(lq.base.months_long).fill(w);
		}
	}
	const selfIncome = hasSelf ? (blank(input.selfIncome) ? NaN : Number(input.selfIncome)) : '';
	const selfPrev = hasSelf && !blank(input.selfPrev) ? Number(input.selfPrev) : '';
	if (hasSelf && !(selfIncome > 0 && selfIncome < 1e6)) { errors.push({ field: 'si', he: 'ההכנסה החודשית שעליה שולמו המקדמות: מספר חיובי' }); }
	if (hasSelf && selfPrev !== '' && !(selfPrev >= 0 && selfPrev < 1e8)) { errors.push({ field: 'sp', he: 'ההכנסה השנתית בשומה הקודמת: מספר, או ריק' }); }
	const stop = parseDate(input.stop);
	const birth = parseDate(input.birth);
	if (!stop) { errors.push({ field: 'stop', he: 'יום הפסקת העבודה: תאריך מלא, לדוגמה 1.12.2026' }); }
	if (!birth) { errors.push({ field: 'birth', he: 'יום הלידה (המשוער): תאריך מלא, לדוגמה 8.12.2026' }); }
	if (stop && birth && stop > birth) { errors.push({ field: 'stop', he: 'יום הפסקת העבודה אחרי הלידה: דמי לידה נבדקים לפי היום שבו הפסקת לעבוד בהיריון. בדקו את התאריכים.' }); }
	if (stop && birth && stop <= birth && daysBetween(stop, birth) > 300) { errors.push({ field: 'stop', he: 'יותר מ-300 ימים בין הפסקת העבודה ללידה: הפסקת העבודה צריכה להיות בזמן ההיריון. בדקו את התאריכים.' }); }
	const babies = intIn(blank(input.babies) ? 1 : input.babies, 1, 5);
	if (Number.isNaN(babies)) { errors.push({ field: 'babies', he: 'מספר התינוקות בלידה: 1 עד 5' }); }
	const order = intIn(blank(input.order) ? 1 : input.order, 1, 3);
	if (Number.isNaN(order)) { errors.push({ field: 'order', he: 'איזה ילד במשפחה: ראשון, שני, או שלישי ואילך' }); }
	const seniority = hasEmp ? (SENIORITY.includes(input.seniority) ? input.seniority : null) : '';
	if (hasEmp && !seniority) { errors.push({ field: 'sen', he: 'בחרו כמה זמן עבדת אצל המעסיק הנוכחי' }); }
	const momHosp = optInt(input.momHosp, 0, 366);
	const babyHosp = optInt(input.babyHosp, 0, 366);
	if (Number.isNaN(momHosp)) { errors.push({ field: 'mh', he: 'ימי האשפוז של היולדת: 0 עד 366' }); }
	if (Number.isNaN(babyHosp)) { errors.push({ field: 'bh', he: 'ימי האשפוז של התינוק: 0 עד 366' }); }
	const partner = PARTNER.includes(input.partner) ? input.partner : 'none';
	const pq = input.pq !== false;
	const pOn = partner !== 'none' && pq;
	const pdays = pOn ? intIn(input.pdays, 1, 400) : 0;
	const pwage = pOn ? (blank(input.pwage) ? NaN : Number(input.pwage)) : 0;
	if (pOn && Number.isNaN(pdays)) { errors.push({ field: 'pd', he: 'כמה ימים בן הזוג בחופשה: מספר שלם, 7 לפחות' }); }
	if (pOn && !(pwage > 0 && pwage < 1e6)) { errors.push({ field: 'pw', he: 'השכר החודשי ברוטו של בן הזוג: מספר חיובי' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });
	const complex = input.complex === true;

	// 1. The qualifying period, per role (s.50(א)); the employee and the self-employed roles are counted apart.
	const empQ = hasEmp ? qualifyTier(lq, m14, m22) : null;
	const selfQ = hasSelf ? qualifyTier(lq, who === 'both' ? sm14 : m14, who === 'both' ? sm22 : m22) : null;
	const roles = [empQ, selfQ].filter(Boolean);
	const tier = roles.some((x) => x.tier === 'full') ? 'full' : roles.some((x) => x.tier === 'partial') ? 'partial' : 'none';
	const eligible = tier !== 'none';
	const full = tier === 'full';
	const tq = qualifyTier(lq, full ? q.full_months : tier === 'partial' ? q.partial_months : 0, '');

	// 2. The daily amount (s.54) and its maximum (s.53(א)).
	const emp = hasEmp ? employeeDaily(lq, wages) : null;
	const self = hasSelf ? selfDaily(lq, selfIncome, selfPrev) : null;
	const max = lq.max.daily;
	const cap = (v) => Math.min(v, max);
	const empOk = empQ && empQ.tier !== 'none';
	const selfOk = selfQ && selfQ.tier !== 'none';
	// Days paid at the combined amount (both roles), then at the longer role's amount alone (when the tiers differ).
	const rawBoth = r2((empOk ? emp.daily : 0) + (selfOk ? self.daily : 0));
	const split = empOk && selfOk && empQ.tier !== selfQ.tier;
	const longRole = split ? (empQ.tier === 'full' ? 'emp' : 'self') : null;
	const rawLong = split ? (longRole === 'emp' ? emp.daily : self.daily) : rawBoth;
	const daily = eligible ? cap(rawBoth) : 0;
	const dailyLong = eligible ? cap(rawLong) : 0;
	const capped = eligible && rawBoth > max;

	// 3. The period (s.50, s.51, s.52) and the leave under the Women's Employment Law (s.6).
	const baseDays = tq.days;
	const before = full ? lq.start.before_full : lq.start.before_partial;
	const paidStart = later(stop, addDays(birth, -before));
	const h = lq.hosp;
	const multipleExt = eligible ? (babies - 1) * (full ? lq.multiple.full_extra_days : lq.multiple.partial_extra_days) : 0;
	const momExt = eligible && momHosp >= h.min_days ? Math.min(momHosp, full ? h.mother_full : h.mother_partial) : 0;
	const babyExt = eligible && babyHosp >= h.min_days ? Math.min(babyHosp, full ? h.baby_full : h.baby_partial) : 0;
	const hospExt = Math.min(momExt + babyExt, full ? h.total_full : h.total_partial);
	const complexOn = complex && birth >= lq.complex.from;
	const complexExt = eligible && complexOn ? Math.max(0, Math.min(lq.complex.days, lq.complex.total_max_days - hospExt)) : 0;
	const extDays = multipleExt + hospExt + complexExt;
	const paidDays = eligible ? baseDays + extDays : 0;
	const paidEnd = eligible ? addDays(paidStart, paidDays - 1) : null;
	const shortDays = split ? q.partial_days : paidDays;

	// 4. The partner (s.49(ב), (ד1); the Institute's partner pages).
	const p = lq.partner;
	let partnerDays = 0;
	let partnerStart = null;
	let partnerDaily = 0;
	const tcap = togetherCap(lq, babies);
	const swapFrom = addDays(birth, p.swap_after_days);
	const swapMax = eligible ? Math.max(0, daysBetween(later(swapFrom, paidStart), paidEnd) + 1) : 0;
	if (partner !== 'none' && eligible && pq) {
		const most = partner === 'together' ? Math.min(tcap, paidDays - 1) : swapMax;
		if (pdays < p.min_days || pdays > most) {
			const rule = partner === 'swap' ? p.swap_he : p.together_he;
			return { ok: false, errors: [{ field: 'pd', he: most < p.min_days ? `אין ${p.min_days} ימים בתשלום שבן הזוג יכול לקחת כאן: ${rule}` : `ימים לבן הזוג: ${p.min_days} עד ${most} (${rule})` }] };
		}
		partnerDays = pdays;
		partnerStart = addDays(paidEnd, -(pdays - 1));
		partnerDaily = cap(r2(pwage * lq.base.months_short / lq.base.divisor_short));
	}
	if (partner !== 'none' && eligible && !pq) { add('warn', 'partner_no', `${p.qualify_he}. בלי זה הימים נשארים של היולדת, והחישוב מחשב אותם לה.`, p.section); }
	if (partner !== 'none' && !eligible) { add('warn', 'partner_none', 'בן הזוג יכול לקבל דמי לידה רק כשהיולדת זכאית להם.', p.section); }
	const motherDays = paidDays - partnerDays;
	// The mother's money: the combined days first, then the longer role alone; the partner's days come off the end.
	const atBoth = Math.min(motherDays, shortDays);
	const atLong = motherDays - atBoth;
	const motherTotal = eligible ? r2(atBoth * daily + atLong * dailyLong) : 0;
	const partnerTotal = r2(partnerDays * partnerDaily);
	const total = r2(motherTotal + partnerTotal);

	// 5. The grant, the multiple-birth allowance, the hospital.
	const grant = grantFor(lq, babies, order);
	const multi = multiAllowance(lq, babies);

	// 6. The leave and the protection (employees only).
	const lv = lq.leave;
	let leave = null;
	if (hasEmp) {
		const leaveStart = later(stop, addDays(birth, -lv.before_max_weeks * 7));
		const weeks = seniority === 'gte12' ? lv.weeks : lv.short_weeks;
		const wMult = (babies - 1) * lq.multiple.full_extra_days;
		const wMom = momHosp >= h.min_days ? Math.min(momHosp, h.mother_full) : 0;
		const wBaby = babyHosp >= h.min_days ? Math.min(babyHosp, h.baby_full) : 0;
		const wHosp = Math.min(wMom + wBaby, h.total_full);
		const wComplex = complexOn ? Math.max(0, Math.min(lq.complex.days, lq.complex.total_max_days - wHosp)) : 0;
		const ext = wMult + wHosp + wComplex;
		const end = addDays(leaveStart, weeks * 7 + ext - 1);
		// A swap: the mother goes back to work when the partner starts (s.6(ח)(1)(א)); her protection runs from her return.
		const motherEnd = partner === 'swap' && partnerDays ? addDays(partnerStart, -1) : end;
		leave = {
			start: leaveStart, weeks, ext, end, motherEnd, back: addDays(motherEnd, 1),
			protectEnd: addDays(motherEnd, lq.protect.after_days), hourEnd: addMonths(motherEnd, lq.parent_hour.months),
			unpaid: Math.max(0, daysBetween(eligible ? paidEnd : addDays(leaveStart, -1), motherEnd)),
		};
	}

	// 7. Flags.
	if (!eligible) {
		const best = Math.max(Number.isNaN(m14) ? 0 : m14, who === 'both' && !Number.isNaN(sm14) ? sm14 : 0);
		add('bad', 'none', `${best} חודשי ביטוח מתוך ${q.full_window}: צריך ${q.partial_months} ל-${q.partial_days} ימים, ו-${q.full_months} (או ${q.full_alt_months} מתוך ${q.full_alt_window}) ל-${q.full_days} ימים. ${q.partial_month_he}. ${q.extra_he}.`, q.full_section);
	}
	if (tier === 'partial') { add('warn', 'partial', `דמי לידה חלקיים: ${q.partial_days} ימים (${q.partial_weeks} שבועות). עם ${q.full_months} חודשים מתוך ${q.full_window}, או ${q.full_alt_months} מתוך ${q.full_alt_window}, מקבלים ${q.full_days} ימים.`, q.partial_section); }
	if (eligible && stop < paidStart) { add('warn', 'early_stop', `הפסקת לעבוד ${daysBetween(stop, birth)} ימים לפני הלידה: דמי הלידה מתחילים רק ${before} ימים לפני הלידה, ב-${heDay(paidStart)}; על ${daysBetween(stop, paidStart)} הימים שלפני כן הם לא משולמים (${lq.start.section}).`, lq.start.section); }
	if (capped) { add('info', 'capped', `לפי ההכנסה ${fmt(rawBoth)} ₪ ליום, יותר מהמקסימום: משולמים ${fmt(max)} ₪ ליום (${lq.max.section}).`, lq.max.section); }
	if (eligible && capped && paidEnd >= lq.next_update) { add('info', 'next_year', `המקסימום כאן הוא של ${lq.from.slice(0, 4)}; הוא מתעדכן ב-1 בינואר לפי הסכום הבסיסי.`, lq.max.section); }
	if (eligible && paidStart < lq.from) { add('warn', 'other_year', `התקופה מתחילה לפני ${heDay(lq.from)}: הסכומים כאן הם של ${lq.from.slice(0, 4)}, ולשנה קודמת המקסימום והמענק היו אחרים.`); }
	if (emp && emp.basis === 'long' && empOk) { add('info', 'basis_long', `השכר ב-6 החודשים חלקי 180 (${fmt(emp.long)} ₪) גבוה מהשכר ב-3 החודשים חלקי 90 (${fmt(emp.short)} ₪), ולכן החישוב לפי 6 החודשים.`, lq.base.section); }
	if (emp && each && wages.some((v) => v === 0)) { add('info', 'drop', `${lq.base.drop_he}.`, lq.base.section); }
	if (hasSelf) { add('info', 'self', `${lq.base.self_he}. ${q.self_he}.`, lq.base.self_section); }
	if (split) { add('warn', 'both_split', `${q.both_he}. כאן תקופת האכשרה שונה: ${longRole === 'emp' ? 'כשכירה' : 'כעצמאית'} ${q.full_days} ימים, ${longRole === 'emp' ? 'כעצמאית' : 'כשכירה'} ${q.partial_days}; החישוב מחבר את ההכנסות ב-${q.partial_days} הימים הראשונים, ואחריהם לפי ההכנסה מהעבודה הארוכה בלבד.`, q.full_section); }
	if (who === 'both' && eligible && !split && !(empOk && selfOk)) { add('warn', 'both_one', `${q.both_he}. כאן רק ${empOk ? 'העבודה כשכירה' : 'העבודה כעצמאית'} עומדת בתנאי, ולכן רק ההכנסה ממנה נכנסת לחישוב.`, q.full_section); }
	if (momHosp > 0 && momHosp < h.min_days) { add('info', 'mom_short', `${momHosp} ימי אשפוז של היולדת: הארכה רק מ-${h.min_days} ימים.`, h.section); }
	if (babyHosp > 0 && babyHosp < h.min_days) { add('info', 'baby_short', `${babyHosp} ימי אשפוז של התינוק: הארכה רק מ-${h.min_days} ימים.`, h.section); }
	if (momHosp > 0 && babyHosp > 0 && momHosp < h.min_days && babyHosp < h.min_days && momHosp + babyHosp >= h.min_days) { add('info', 'combine', `${h.combine_he}. המחשבון לא מוסיף את הימים האלה.`, h.section); }
	if (eligible && momExt + babyExt > hospExt) { add('info', 'hosp_cap', `כל הארכות האשפוז יחד עד ${full ? h.total_full / 7 : h.total_partial / 7} שבועות (${h.section}).`, h.section); }
	if (eligible && (momExt || babyExt)) { add('info', 'hosp', `${h.window_he}. ${h.home_he}. ${h.split_he}. ${h.claim_he}.`, h.section); }
	if (complex && !complexOn) { add('warn', 'complex_early', `ההארכה בשל מוגבלות מורכבת חלה מ-${heDay(lq.complex.from)} (${lq.complex.section}).`, lq.complex.section); }
	if (hasEmp && seniority !== 'gte12') { add('warn', 'leave_short', `${lv.short_he}, מהם עד ${lv.before_max_weeks} לפני הלידה (${lv.short_section}).`, lv.short_section); }
	if (hasEmp && seniority === 'lt6') { add('warn', 'preg_protect', `פחות מ-${lq.protect.pregnancy_months} חודשים אצל המעסיק: האיסור לפטר בהיריון בלי היתר (${lq.protect.pregnancy_section}) חל רק מ-${lq.protect.pregnancy_months} חודשים. בתקופת הלידה וההורות עצמה אסור לפטר בכל מקרה (${lq.protect.leave_section}).`, lq.protect.pregnancy_section); }
	if (partnerDays && tier === 'partial' && partner === 'swap') { add('info', 'partner_partial', `${p.partial_he}.`, p.section); }
	if (partnerDays) { add('info', 'partner', `${p.return_he}. ${p.amount_he}. ${p.notify_he}.`, p.section); }
	if (multi) { add('info', 'multi', `${lq.multi_allowance.he}.`, lq.multi_allowance.section); }
	if (tier !== 'full' && birth >= lq.war.from && birth <= lq.war.to) { add('info', 'war', `${lq.war.he} (${lq.war.section}).`, lq.war.section); }

	// 8. The dates to keep.
	const deadlines = [];
	const dl = (key, date, he, section, url) => { if (date) { deadlines.push({ key, date, he, section, url }); } };
	dl('earliest', addDays(birth, -lq.claim.earliest_weeks_before * 7), `${lq.claim.earliest_weeks_before} שבועות לפני הלידה: מכאן אפשר לשדר טופס ${lq.claim.employer_form} ולהגיש תביעה`, 'איך להגיש תביעה', lq.claim.url);
	dl('stop', stop, 'יום הפסקת העבודה (היום הקובע)', 'סעיף 48', lq.law_url);
	if (eligible && paidStart !== stop) { dl('paid_start', paidStart, 'היום הראשון של דמי הלידה', lq.start.section, lq.start.url); }
	if (leave && leave.start !== stop) { dl('leave_start', leave.start, `תחילת תקופת הלידה וההורות, ${lv.before_max_weeks} שבועות לפני הלידה`, lv.section, lv.url); }
	dl('birth', birth, 'יום הלידה (המשוער)', '', lq.pages.period);
	dl('grant', addMonths(birth, 1), `מענק הלידה, ${fmt(grant.amount)} ₪: משולם עד חודש אחרי הלידה`, lq.grant.section, lq.grant.claim_url);
	if (partnerStart) { dl('partner', partnerStart, `${partner === 'swap' ? 'בן הזוג מחליף את היולדת' : 'בן הזוג יוצא לחופשה יחד עם היולדת'}, ${partnerDays} ימים`, partner === 'swap' ? p.section : p.together_section, p.url); }
	if (eligible) { dl('paid_end', paidEnd, `היום האחרון של דמי הלידה (יום ${paidDays})`, extDays ? lq.multiple.section : tq.section, lq.pages.period); }
	if (leave) {
		dl('back', leave.back, partner === 'swap' && partnerDays ? 'היולדת חוזרת לעבודה (בן הזוג במקומה)' : 'החזרה לעבודה, אחרי תקופת הלידה וההורות', partner === 'swap' && partnerDays ? lv.section : leave.weeks === lv.weeks ? lv.section : lv.short_section, lv.url);
		dl('protect', leave.protectEnd, `סוף ${lq.protect.after_days} הימים שבהם אסור לפטר בלי היתר`, lq.protect.after_section, lq.protect.url);
		dl('hour', leave.hourEnd, `סוף ${lq.parent_hour.months} חודשי שעת ההורות`, lq.parent_hour.section, lq.parent_hour.url);
	}
	dl('claim', addMonths(stop, lq.claim.deadline_months), `הגשת התביעה לכל המאוחר, אם דמי הלידה לא שולמו אוטומטית`, lq.claim.section, lq.claim.url);
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	// 9. The leave calendar: from the stop day, a cell per day, until the end of the protection (or the paid days).
	const lastDay = [eligible ? paidEnd : null, leave ? leave.protectEnd : null, birth].filter(Boolean).sort().pop();
	const span = daysBetween(stop, lastDay) + 1;
	const weeksN = Math.ceil(span / 7);
	const days = [];
	for (let i = 0; i < weeksN * 7; i += 1) {
		const d = addDays(stop, i);
		let k = 'post';
		if (eligible && d >= paidStart && d <= paidEnd) {
			const n = daysBetween(paidStart, d) + 1;
			k = partnerStart && d >= partnerStart ? 'partner' : d < birth ? 'pre' : n > baseDays ? 'ext' : 'paid';
		} else if (leave && d >= leave.start && d <= leave.motherEnd) {
			k = 'unpaid';
		} else if (leave && d > leave.motherEnd && d <= leave.protectEnd) {
			k = 'protect';
		} else if (d < (eligible ? paidStart : leave ? leave.start : birth)) {
			k = 'gap';
		}
		const prot = Boolean(leave && k === 'partner' && d > leave.motherEnd && d <= leave.protectEnd);
		days.push({ d, k, prot, birth: d === birth });
	}
	const weeksOut = [];
	for (let w = 0; w < weeksN; w += 1) { weeksOut.push({ n: w + 1, start: days[w * 7].d, cells: days.slice(w * 7, w * 7 + 7) }); }

	return {
		ok: true, eligible, status: tier, tier, full, who, m14, m22, sm14: who === 'both' ? sm14 : '', sm22: who === 'both' ? sm22 : '',
		empQ, selfQ, emp, self, wageMode: each ? 'each' : 'same', wages, selfIncome, selfPrev, rawBoth, rawLong, daily, dailyLong, capped, max, split, longRole, shortDays,
		stop, birth, babies, order, seniority, momHosp, babyHosp, complex, complexOn, partner, pq, pwage,
		baseDays, before, paidStart, paidEnd, paidDays, multipleExt, momExt, babyExt, hospExt, complexExt, extDays,
		partnerDays, partnerStart, partnerDaily, motherDays, motherTotal, partnerTotal, total, swapMax, tcap,
		grant, multi, leave, deadlines, flags, weeks: weeksOut, baseMonths: baseMonths(stop),
	};
}

/** The same mother at a range of monthly wages, for the page table: the daily amount and 105 / 56 / twins (126) days. */
export function byWage(registry, base, wageList) {
	return wageList.map((w) => {
		const one = compute(registry, Object.assign({}, base, { who: 'employee', wageMode: 'same', wage: w, babies: 1, partner: 'none', momHosp: 0, babyHosp: 0, complex: false }));
		const two = compute(registry, Object.assign({}, base, { who: 'employee', wageMode: 'same', wage: w, babies: 2, partner: 'none', momHosp: 0, babyHosp: 0, complex: false }));
		return { wage: w, daily: one.daily, full: one.total, twins: two.total, partial: r2(one.daily * registry.rights_leida.qualify.partial_days), capped: one.capped };
	});
}
