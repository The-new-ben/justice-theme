/**
 * Wave 5 (HAD-504): severance pay, the advance notice, section 14 and the tax-exempt part, with the deadlines.
 *
 * Dependency-free ES module. Every number comes from registry.severance (and registry.min_wage for the floor), read on
 * their checked_on dates:
 *  - Entitlement: a year of work and a dismissal (Severance Pay Law s.1(א)), or a resignation the law treats as one
 *    (ss.6, 7, 8, 9, 11); a dismissal close to the end of the first year is presumed to dodge severance (s.3).
 *  - Amount: one month's salary for each year of work, and a proportional part for part of a year (s.12(א)); for a
 *    wage-paid employee also one month per year from 1.8.1983 (the 1983 regulations); never on less than the minimum
 *    wage for the job's share (s.13ב).
 *  - Section 14: pension payments replace severance only to the extent approved: the 1998 general approval makes
 *    14⅓% (6% + 8⅓%) replace 100% and 12% without the 2⅓% top-up replace 72% (s.14; the approval, items 1-3).
 *  - Notice: Advance Notice Law ss.3-4 by tenure and pay type; pay in lieu (s.6), compensation when none was given (s.7).
 *  - Tax: exempt up to one month's last salary per year of work, never above the ceiling per year (Income Tax Ordinance
 *    s.9(7א)(א); 13,750 in 2026); the Commissioner may exempt more up to that ceiling.
 *  - Deadlines: due on the last day of work, late after 15 days, +20% a month after 30 (Wage Protection Law s.20);
 *    the end-of-work certificate within 14 days (Advance Notice Law s.8(ב)); limitation 7 years.
 */

import { addDays, addMonths, parseDate, daysBetween } from './dates.js';

const r2 = (n) => Math.round(n * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const heDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
export const RESIGN_CODES = ['health', 'parent', 'move', 'term', 'worse', 'retire'];

/** Full months and the remaining days from the first day of work to the last (inclusive), and the years as a decimal. */
export function serviceSpan(start, end) {
	const endEx = addDays(end, 1);
	const [sy, sm] = start.split('-').map(Number);
	const [ey, em] = endEx.split('-').map(Number);
	let months = (ey - sy) * 12 + (em - sm);
	while (months > 0 && addMonths(start, months) > endEx) { months -= 1; }
	const days = daysBetween(addMonths(start, months), endEx);
	return { months, days, years: months / 12 + days / 365, y: Math.floor(months / 12), m: months % 12 };
}

/** Advance Notice Law: s.3 (monthly salary) and s.4 (wage), by completed months of work. */
export function noticeDays(sv, payType, months) {
	const n = sv.notice;
	if (payType === 'hourly') {
		if (months < 12) { return { days: months, month: false, section: 'סעיף 4(1)' }; }
		if (months < 24) { return { days: n.wage.y2_base + Math.floor((months - 12) / 2), month: false, section: 'סעיף 4(2)' }; }
		if (months < 36) { return { days: n.wage.y3_base + Math.floor((months - 24) / 2), month: false, section: 'סעיף 4(3)' }; }
		return { days: null, month: true, section: 'סעיף 4(4)' };
	}
	if (months <= n.monthly.first_months) { return { days: months, month: false, section: 'סעיף 3(1)' }; }
	if (months < 12) { return { days: n.monthly.base_days + n.monthly.per_month * (months - n.monthly.first_months), month: false, section: 'סעיף 3(2)' }; }
	return { days: null, month: true, section: 'סעיף 3(3)' };
}

/** One month after a day, by the Interpretation Law s.10(ב): the same day number, or the last day of a shorter month. */
export function monthLater(iso) {
	const [y, m, d] = iso.split('-').map(Number);
	const ny = m === 12 ? y + 1 : y;
	const nm = m === 12 ? 1 : m + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	return `${ny}-${String(nm).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

/** The minimum-wage row in force on a day (registry.min_wage). */
export function minWageOn(mw, day) {
	let row = null;
	for (const r of mw.rows) { if (r.from <= day) { row = r; } }
	return row;
}

/**
 * input = { payType ('monthly'|'hourly'), salary, hourly, hours, jobPct, start, end, reason ('fired'|'resign'|one of
 *           RESIGN_CODES), s14 ('none'|'full'|'partial'|'custom'), s14Pct, s14From, noticeDate, noticeMode
 *           ('worked'|'paid'|'none') }
 */
export function compute(registry, input) {
	const sv = registry.severance;
	const mw = registry.min_wage;
	const errors = [];
	const payType = input.payType === 'hourly' ? 'hourly' : 'monthly';
	const start = parseDate(input.start);
	const end = parseDate(input.end);
	if (!start) { errors.push({ field: 'start', he: 'יום תחילת העבודה: תאריך מלא, לדוגמה 1.3.2018' }); }
	if (!end) { errors.push({ field: 'end', he: 'יום העבודה האחרון: תאריך מלא' }); }
	if (start && end && end < start) { errors.push({ field: 'end', he: 'יום העבודה האחרון לפני יום התחילה' }); }
	let monthly = NaN;
	let hourly = null;
	let hours = null;
	if (payType === 'hourly') {
		hourly = Number(input.hourly);
		hours = Number(input.hours);
		if (!(hourly > 0 && hourly < 10000)) { errors.push({ field: 'hourly', he: 'שכר לשעה: מספר חיובי' }); }
		if (!(hours > 0 && hours <= 400)) { errors.push({ field: 'hours', he: 'ממוצע שעות בחודש: 1 עד 400' }); }
		monthly = r2(hourly * hours);
	} else {
		monthly = Number(input.salary);
		if (!(monthly > 0 && monthly < 1e7)) { errors.push({ field: 'salary', he: 'השכר החודשי האחרון: מספר חיובי' }); }
	}
	const jobPct = blank(input.jobPct) ? 100 : Number(input.jobPct);
	if (!(jobPct > 0 && jobPct <= 100)) { errors.push({ field: 'jobPct', he: 'היקף המשרה: 1% עד 100%' }); }
	const s14 = ['full', 'partial', 'custom'].includes(input.s14) ? input.s14 : 'none';
	const s14Pct = s14 === 'full' ? sv.approval.full_pct : s14 === 'partial' ? sv.approval.partial_pct : s14 === 'custom' ? Number(input.s14Pct) : 0;
	if (s14 === 'custom' && !(s14Pct > 0 && s14Pct <= 100)) { errors.push({ field: 's14Pct', he: 'שיעור הכיסוי לפי ההסכם: 1% עד 100%' }); }
	const s14From = s14 === 'none' || blank(input.s14From) ? start : parseDate(input.s14From);
	if (s14 !== 'none' && !blank(input.s14From) && !s14From) { errors.push({ field: 's14From', he: 'תחילת ההפרשות לפי סעיף 14: תאריך מלא' }); }
	const noticeDate = blank(input.noticeDate) ? null : parseDate(input.noticeDate);
	if (!blank(input.noticeDate) && !noticeDate) { errors.push({ field: 'noticeDate', he: 'יום מסירת ההודעה: תאריך מלא' }); }
	if (noticeDate && end && start && (noticeDate > end || noticeDate < start)) { errors.push({ field: 'noticeDate', he: 'ההודעה ניתנה בין יום התחילה ליום העבודה האחרון' }); }
	if (errors.length) { return { ok: false, errors }; }

	const span = serviceSpan(start, end);
	const reason = input.reason === 'resign' || RESIGN_CODES.includes(input.reason) ? input.reason : 'fired';
	const reasonRow = sv.reasons.find((x) => x.code === reason) || null;
	const entitledByReason = reason !== 'resign';
	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });

	// The salary the severance is computed on: never below the minimum wage for the job's share (s.13ב).
	const mwRow = minWageOn(mw, end);
	let base = monthly;
	let floored = false;
	if (mwRow) {
		const floorMonthly = r2(mwRow.monthly * jobPct / 100);
		if (payType === 'monthly' && monthly < floorMonthly - 0.005) { base = floorMonthly; floored = true; }
		if (payType === 'hourly' && hourly < mwRow.hourly_182 - 0.0001) { base = r2(mwRow.hourly_182 * hours); floored = true; }
		if (floored) { add('warn', 'min_wage', `השכר שהזנתם נמוך משכר המינימום (${payType === 'hourly' ? `${mwRow.hourly_182} ₪ לשעה` : `${mwRow.monthly.toLocaleString('en-US')} ₪ לחודש במשרה מלאה`}, מ-${heDay(mwRow.from)}). הפיצויים מחושבים לפי שכר המינימום (סעיף 13ב), וגם על ההפרש בשכר עצמו אפשר לתבוע.`, 'סעיף 13ב'); }
	}
	const yearOk = span.months >= sv.min_months;
	// s.3: a dismissal shortly before the end of the first year is presumed made to dodge severance and does not impair
	// the right unless the employer proves otherwise. The tool treats the last two months of the year as "shortly before"
	// and computes the proportional amount as a conditional entitlement (review, PR 128).
	const nearYear = !yearOk && span.months >= sv.min_months - 2 && reason === 'fired';
	const conditional = nearYear;
	const entitled = (yearOk || nearYear) && entitledByReason;
	const severance = entitled ? r2(base * span.years) : 0;
	if (!yearOk && !nearYear) { add('bad', 'under_year', `עבדתם פחות משנה (${span.months} חודשים ו-${span.days} ימים): אין זכות לפיצויי פיטורים לפי החוק (סעיף 1(א)). ההודעה המוקדמת מגיעה בכל מקרה.`, 'סעיף 1(א)'); }
	if (nearYear) { add('warn', 'near_year', `פוטרתם אחרי ${span.months} חודשים, סמוך לסוף השנה הראשונה: חזקה שהפיטורים נעשו כדי לחמוק מפיצויים, והם לא פוגעים בזכות אלא אם המעסיק יוכיח אחרת (סעיף 3). הסכום כאן יחסי לתקופה שעבדתם.`, 'סעיף 3'); }
	if (reason === 'resign') { add('info', 'resign', 'בהתפטרות רגילה אין זכות לפיצויים מהמעסיק. כספים שהופרשו לפיצויים לפי סעיף 14 שייכים לכם גם בהתפטרות.', 'סעיף 14'); }
	if (reasonRow) { add('info', 'resign_as_fired', `התפטרות שדינה כפיטורים: ${reasonRow.he} (${reasonRow.section}). בתביעה מוכיחים את הנסיבות, ובחלק מהמקרים צריך להודיע למעסיק מראש על הסיבה.`, reasonRow.section); }
	if (payType === 'hourly' && start < sv.wage_regs_from) { add('warn', 'pre_1983', 'לעובד בשכר, תקופת עבודה שלפני 1.8.1983 מזכה בשכר שבועיים לשנה בלבד (סעיף 12(א)); המחשבון מחשב חודש לכל שנה.', 'סעיף 12(א)'); }

	// Section 14.
	let coveredYears = 0;
	if (s14 !== 'none' && entitled) {
		const from = s14From > start ? s14From : start;
		coveredYears = from > end ? 0 : serviceSpan(from, end).years;
	}
	const fundReplaces = entitled ? r2(base * coveredYears * s14Pct / 100) : 0;
	const employer = r2(severance - fundReplaces);
	if (s14 !== 'none') { add('info', 's14', `לפי סעיף 14 הכספים בקופה באים במקום ${s14Pct}% מהפיצויים בעד התקופה שבה הופרשו, ושייכים לכם בכל מקרה. אם ההפרשות היו משכר נמוך מהשכר האמיתי, על ההפרש מגיעה השלמה (סעיף 3 לאישור הכללי).`, 'סעיף 14'); }

	// Advance notice.
	const at = noticeDate || end;
	const workedToNotice = serviceSpan(start, at).months;
	const notice = noticeDays(sv, payType, workedToNotice);
	// Interpretation Law s.10: a period in days does not count the day of the notice (10(א)); a month ends on the same day
	// number in the next month, or on its last day when it has no such day (10(ב)).
	const noticeEnd = noticeDate ? (notice.month ? monthLater(noticeDate) : addDays(noticeDate, Math.ceil(notice.days))) : null;
	const short = noticeDate && end < noticeEnd ? daysBetween(end, noticeEnd) : 0;
	const inLieu = payType === 'monthly' ? (notice.month ? base : r2(base * notice.days / 30)) : null;
	const noticeMode = ['paid', 'none'].includes(input.noticeMode) ? input.noticeMode : 'worked';
	if (noticeMode === 'none') { add('warn', 'no_notice', `לא ניתנה הודעה מוקדמת: המעסיק משלם פיצוי בגובה השכר הרגיל לתקופת ההודעה (סעיף 7(א))${inLieu !== null ? `, כאן ${Math.round(inLieu).toLocaleString('en-US')} ₪` : ''}.`, 'סעיף 7(א)'); }
	if (short && noticeMode !== 'none') { add('warn', 'short_notice', `ההודעה ניתנה ב-${heDay(noticeDate)}, ותקופת ההודעה שבחוק מסתיימת ב-${heDay(noticeEnd)}: חסרים ${short} ימים עד היום האחרון שהזנתם, ועליהם מגיע פיצוי בגובה השכר הרגיל (סעיף 7(א)).`, 'סעיף 7(א)'); }

	// Tax: one month's last salary per year, never above the ceiling per year (s.9(7א)(א)).
	const tax = sv.tax;
	const perYear = Math.min(base, tax.ceiling);
	const exemptCap = r2(perYear * span.years);
	const exempt = Math.min(severance, exemptCap);
	const taxable = r2(severance - exempt);
	const ceilingTotal = r2(tax.ceiling * span.years);
	if (taxable > 0 && base < tax.ceiling) { add('info', 'commissioner', `מעל משכורת חודש לכל שנה, פקיד השומה רשאי לפטור עוד, עד ${tax.ceiling.toLocaleString('en-US')} ₪ לכל שנת עבודה (${ceilingTotal.toLocaleString('en-US')} ₪ אצלכם).`, tax.section); }

	// Deadlines (Wage Protection Law s.20; Advance Notice Law s.8(ב); Limitation Law s.5(1)).
	const late = sv.late;
	const deadlines = [
		{ key: 'due', date: end, he: 'המועד לתשלום הפיצויים: יום סיום יחסי העבודה', section: `${late.section}(א)(1)`, url: late.url },
		{ key: 'grace', date: addDays(end, late.grace_days), he: `היום ה-${late.grace_days}: עד אז אין פיצוי הלנה`, section: `${late.section}(ב)`, url: late.url },
		{ key: 'twenty', date: addDays(end, late.linkage_to_day), he: `מהיום ה-${late.grace_days + 1} ועד ה-${late.linkage_to_day}: הפרשי הצמדה; אחרי היום ה-${late.linkage_to_day}: עוד ${late.monthly_pct}% לכל חודש של איחור (בית הדין רשאי להפחית)`, section: `${late.section}(ב)`, url: late.url },
		{ key: 'cert', date: addDays(end, sv.notice.cert_days), he: `אישור בכתב על תחילת העבודה וסיומה: עד ${sv.notice.cert_days} ימים מהיום האחרון, או ${sv.notice.cert_request_days} ימים מבקשה בכתב, המוקדם`, section: 'סעיף 8(ב) לחוק הודעה מוקדמת', url: sv.notice.url },
		{ key: 'limit', date: addMonths(end, 12 * sv.limitation.years), he: `התיישנות תביעה לפיצויים: ${sv.limitation.years} שנים`, section: `${sv.limitation.section} לחוק ההתיישנות`, url: sv.limitation.url },
	];

	return {
		ok: true, payType, monthly, base, floored, hourly, hours, jobPct, start, end, span, reason, reasonRow, entitled, yearOk, conditional,
		severance, s14, s14Pct, s14From, coveredYears, fundReplaces, employer,
		notice, workedToNotice, noticeDate, noticeEnd, short, inLieu, noticeMode,
		exempt, taxable, exemptCap, ceilingTotal, perYear, deadlines, flags, mwRow,
	};
}

/** The same employee under each section-14 arrangement, for the side-by-side. */
export function byArrangement(registry, input) {
	const out = {};
	for (const k of ['none', 'partial', 'full']) {
		const r = compute(registry, Object.assign({}, input, { s14: k, s14From: '' }));
		out[k] = r.ok ? { employer: r.employer, fund: r.fundReplaces, total: r.severance } : null;
	}
	return out;
}
