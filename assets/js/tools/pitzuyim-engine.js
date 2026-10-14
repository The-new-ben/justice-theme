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
 *           ('worked'|'paid'|'none'), change (the job scope or the pay changed once), changeDate, prevPct and
 *           prevSalary (monthly: the scope before, the pay before a cut), prevHours and prevHourly (hourly: the hours
 *           before, the rate before a cut), manyChanges (more than one), unpaidExcess (days of unpaid leave above 14 in
 *           each work year, summed: reg. 10(3)) }
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
	// Commissions or output-based pay count at their average over the 12 months before the end (reg. 9) (review, PR 128).
	const commission = blank(input.commission) ? 0 : Number(input.commission);
	if (!(Number.isFinite(commission) && commission >= 0 && commission < 1e7)) { errors.push({ field: 'commission', he: 'ממוצע העמלות: מספר חיובי, 0 או ריק' }); } else if (commission > 0 && Number.isFinite(monthly)) { monthly = r2(monthly + commission); }
	const jobPct = blank(input.jobPct) ? 100 : Number(input.jobPct);
	if (!(jobPct > 0 && jobPct <= 100)) { errors.push({ field: 'jobPct', he: 'היקף המשרה: 1% עד 100%' }); }
	const s14 = ['full', 'partial', 'custom'].includes(input.s14) ? input.s14 : 'none';
	const s14Pct = s14 === 'full' ? sv.approval.full_pct : s14 === 'partial' ? sv.approval.partial_pct : s14 === 'custom' ? Number(input.s14Pct) : 0;
	if (s14 === 'custom' && !(s14Pct > 0 && s14Pct <= 100)) { errors.push({ field: 's14Pct', he: 'שיעור הכיסוי לפי ההסכם: 1% עד 100%' }); }
	const s14From = s14 === 'none' || blank(input.s14From) ? start : parseDate(input.s14From);
	if (s14 !== 'none' && !blank(input.s14From) && !s14From) { errors.push({ field: 's14From', he: 'תחילת ההפרשות לפי סעיף 14: תאריך מלא' }); }
	if (s14 !== 'none' && s14From && end && s14From > end) { errors.push({ field: 's14From', he: 'תחילת ההפרשות לפי סעיף 14 לפני היום האחרון בעבודה' }); }
	// One change of scope or pay (calculation regulations 7 and 8): each period on its own salary. More than one change is
	// not computed (review, PR 128).
	const change = Boolean(input.change);
	const changeDate = change ? parseDate(input.changeDate) : null;
	const monthlyChange = change && payType === 'monthly';
	const hourlyChange = change && payType === 'hourly';
	const prevPct = monthlyChange && !blank(input.prevPct) ? Number(input.prevPct) : jobPct;
	const prevSalary = monthlyChange && !blank(input.prevSalary) ? Number(input.prevSalary) : null;
	const prevHours = hourlyChange ? Number(input.prevHours) : null;
	const prevHourly = hourlyChange && !blank(input.prevHourly) ? Number(input.prevHourly) : null;
	if (hourlyChange && !(prevHours > 0 && prevHours <= 400)) { errors.push({ field: 'prevHours', he: 'ממוצע השעות בחודש לפני השינוי: 1 עד 400' }); }
	if (hourlyChange && prevHourly !== null && !(prevHourly > 0 && prevHourly < 10000)) { errors.push({ field: 'prevHourly', he: 'השכר לשעה לפני השינוי: מספר חיובי או ריק' }); }
	// Unpaid leave above 14 days in a work year is not counted (reg. 10(3)); the person sums the excess of each year.
	const unpaidExcess = blank(input.unpaidExcess) ? 0 : Number(input.unpaidExcess);
	if (!(Number.isFinite(unpaidExcess) && unpaidExcess >= 0 && unpaidExcess < 36500)) { errors.push({ field: 'unpaidExcess', he: 'ימי חופשה ללא תשלום: מספר ימים, 0 או ריק' }); }
	if (start && end && end >= start && unpaidExcess > 0 && unpaidExcess >= daysBetween(start, addDays(end, 1))) { errors.push({ field: 'unpaidExcess', he: 'ימי החופשה ללא תשלום ארוכים מתקופת העבודה כולה: בדקו את המספר' }); }
	// The leave belongs to one of the periods; with a change the tool would have to know which (review, PR 128).
	// Likewise with s.14 from a date inside the work: the leave may fall before or after the deposits began.
	if (unpaidExcess > 0 && s14 !== 'none' && s14From && start && s14From > start) { errors.push({ field: 'unpaidExcess', he: 'חופשה ללא תשלום יחד עם הפרשות לפי סעיף 14 שהתחילו באמצע העבודה: הימים מנוכים מהתקופה שבה היו, לפני ההפרשות או אחריהן. את השילוב המחשבון לא מחשב; חשבו כל תקופה בנפרד, או פנו לעורך דין.' }); }
	if (change && unpaidExcess > 0) { errors.push({ field: 'unpaidExcess', he: 'חופשה ללא תשלום יחד עם שינוי בהיקף המשרה או בשכר: הימים מנוכים מהתקופה שבה היו, לפי השכר שלה. את השילוב המחשבון לא מחשב; חשבו כל תקופה בנפרד, או פנו לעורך דין.' }); }
	if (change && input.manyChanges) { errors.push({ field: 'change', he: 'יותר משינוי אחד בהיקף המשרה או בשכר: כל תקופה מחושבת לפי ההיקף והשכר שלה (תקנות 7 ו-8 לתקנות החישוב). המחשבון מחשב שינוי אחד בלבד; את החישוב לכמה תקופות עושים לפי התלושים, עם עורך דין או רואה חשבון.' }); }
	if (change && !changeDate) { errors.push({ field: 'changeDate', he: 'מאיזה יום חל השינוי: תאריך מלא' }); }
	if (change && changeDate && start && end && (changeDate <= start || changeDate > end)) { errors.push({ field: 'changeDate', he: 'יום השינוי אחרי יום התחילה ועד היום האחרון' }); }
	if (monthlyChange && !(prevPct > 0 && prevPct <= 100)) { errors.push({ field: 'prevPct', he: 'היקף המשרה לפני השינוי: 1% עד 100%' }); }
	if (monthlyChange && prevSalary !== null && !(prevSalary > 0 && prevSalary < 1e7)) { errors.push({ field: 'prevSalary', he: 'השכר לפני השינוי: מספר חיובי או ריק' }); }
	// A wage worker's service before 1.8.1983 earns two weeks a year (s.12(א)); the tool does not split it (review, PR 128).
	if (payType === 'hourly' && start && start < sv.wage_regs_from) { errors.push({ field: 'start', he: 'לעובד לפי שעה או יום, תקופת העבודה שלפני 1.8.1983 מזכה בשכר שבועיים לשנה בלבד (סעיף 12(א)). את החישוב לתקופה כזאת המחשבון לא עושה; פנו לעורך דין או לרואה חשבון.' }); }
	// With no notice given, a date left in the field is ignored (review, PR 128).
	// Other grounds the law deems a dismissal (s.11(ב)-(ו) and more: seasonal work, enlistment or national service, a
	// shelter, an elected office, ...) each have their own conditions; the tool does not check them (review, PR 128).
	// A dismissal for serious misconduct may lose severance in whole or part by a collective agreement (s.16) or a ruling
	// of the labour court (s.17); the tool does not judge that (review, PR 128).
	if (input.misconduct && input.reason !== 'resign' && !RESIGN_CODES.includes(input.reason)) { errors.push({ field: 'misconduct', he: 'פיטורים בנסיבות משמעתיות חמורות: לפי הסכם קיבוצי, או בהחלטת בית הדין לעבודה בענף שאין בו הסכם, אפשר לשלול את הפיצויים כולם או חלקם (סעיפים 16 ו-17). את זה המחשבון לא קובע; פנו לעורך דין.' }); }
	if (input.seasonal) { errors.push({ field: 'seasonal', he: 'לעובד עונתי הזכות לפיצויים והתקופה שלהם נקבעות לפי עונות העבודה (סעיף 1 לחוק פיצויי פיטורים), לא לפי שנה רצופה. את החישוב הזה המחשבון לא עושה; פנו לעורך דין או למדריך של משרד העבודה.' }); }
	if (input.otherBreaks) { errors.push({ field: 'breaks', he: 'הפסקות נוספות שלא נספרות בחישוב (שירות צבאי, שירות חלקי מעל 120 יום, מחלה או תאונה בלי תשלום מעבר לימי המחלה, ועוד בתקנה 10): את ניכוין המחשבון לא מחשב; חשבו לפי התקופות, או פנו לעורך דין.' }); }
	if (input.reason === 'other_ground') { errors.push({ field: 'reason', he: 'התפטרות מסיבה אחרת שהחוק רואה כפיטורים (למשל גיוס לשירות סדיר, שירות לאומי או אזרחי, שהייה במקלט לנשים מוכות, בחירה לראש רשות מקומית, עבודה עונתית, סעיף 11(ב)-(ו) ועוד): לכל סיבה תנאים משלה. את התנאים האלה המחשבון לא בודק; פנו לעורך דין או למדריך של משרד העבודה.' }); }
	const noticeDate = blank(input.noticeDate) || input.noticeMode === 'none' ? null : parseDate(input.noticeDate);
	if (!blank(input.noticeDate) && input.noticeMode !== 'none' && !noticeDate) { errors.push({ field: 'noticeDate', he: 'יום מסירת ההודעה: תאריך מלא' }); }
	if (noticeDate && end && start && (noticeDate > end || noticeDate < start)) { errors.push({ field: 'noticeDate', he: 'ההודעה ניתנה בין יום התחילה ליום העבודה האחרון' }); }
	if (errors.length) { return { ok: false, errors }; }

	const span = serviceSpan(start, end);
	const reason = input.reason === 'resign' || RESIGN_CODES.includes(input.reason) ? input.reason : 'fired';
	const reasonRow = sv.reasons.find((x) => x.code === reason) || null;
	// A parent's resignation counts as a dismissal only under the s.7 conditions, which the person confirms (review, PR 128).
	// Every resignation the law treats as a dismissal (ss.6-8, 11) depends on facts the person confirms; a fixed term (s.9)
	// is confirmed by its own choice (review, PR 128).
	const ground = RESIGN_CODES.includes(reason) && reason !== 'term';
	const groundOk = !ground || input.groundOk === true || (reason === 'parent' && input.parentOk === true);
	const entitledByReason = reason !== 'resign' && groundOk;
	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });

	// The salary the severance is computed on: never below the minimum wage for the job's share (s.13ב).
	const mwRow = minWageOn(mw, end);
	let base = monthly;
	let floored = false;
	if (mwRow) {
		const floorMonthly = r2(mwRow.monthly * jobPct / 100);
		if (payType === 'monthly' && monthly < floorMonthly - 0.005) { base = floorMonthly; floored = true; }
		// Rows before April 2018 hold the hourly rate on a 186-hour month (review, PR 128).
		const mwHour = mwRow.hourly_182 ?? mwRow.hourly_186;
		if (payType === 'hourly' && mwHour && hourly < mwHour - 0.0001) { base = r2(mwHour * hours); floored = true; }
		if (floored) { add('warn', 'min_wage', `השכר שהזנתם נמוך משכר המינימום (${payType === 'hourly' ? `${mwHour} ₪ לשעה` : `${mwRow.monthly.toLocaleString('en-US')} ₪ לחודש במשרה מלאה`}, מ-${heDay(mwRow.from)}). הפיצויים מחושבים לפי שכר המינימום (סעיף 13ב), וגם על ההפרש בשכר עצמו אפשר לתבוע.`, 'סעיף 13ב'); }
	}
	const yearOk = span.months >= sv.min_months;
	// s.3: a dismissal shortly before the end of the first year is presumed made to dodge severance and does not impair
	// the right unless the employer proves otherwise. The tool treats the last two months of the year as "shortly before"
	// and computes the proportional amount as a conditional entitlement (review, PR 128).
	// A fixed term not renewed counts as a dismissal (s.9), so the presumption covers it too (review, PR 128).
	// "Shortly before" is a question of fact: the last two months are taken as such, and an earlier dismissal counts when
	// the person says it was close to the year's end and meant to avoid severance (review, PR 128).
	const dismissed = reason === 'fired' || reason === 'term';
	const nearYear = !yearOk && dismissed && (span.months >= sv.min_months - 2 || input.nearClaim === true);
	const conditional = nearYear;
	const entitled = (yearOk || nearYear) && entitledByReason;
	// The periods of work and the salary of each: reg. 7 (a change of scope: the last salary, proportional to the scope of
	// each period) and reg. 8 (a pay cut: the period before it on the salary before it).
	// For a wage worker the scope is the hours: the earlier period on the current hourly rate times the earlier hours.
	const fte = base * 100 / jobPct;
	const rate = payType === 'hourly' ? base / hours : null;
	const reg7 = hourlyChange ? r2(rate * prevHours) : r2(fte * prevPct / 100);
	const cut = hourlyChange ? prevHourly !== null && prevHourly > rate : monthlyChange && prevSalary !== null && prevSalary > reg7;
	const prevBase = !change ? base : cut ? (hourlyChange ? r2(prevHourly * prevHours) : prevSalary) : reg7;
	const pctNow = payType === 'hourly' ? 100 : jobPct;
	const periods = change
		? [{ from: start, to: addDays(changeDate, -1), salary: prevBase, pct: payType === 'hourly' ? (100 * prevHours) / hours : prevPct }, { from: changeDate, to: end, salary: base, pct: pctNow }]
		: [{ from: start, to: end, salary: base, pct: pctNow }];
	const yearsOf = (a, b) => (a > b ? 0 : serviceSpan(a, b).years);
	// Uncounted unpaid leave shortens the service the amount is computed on, spread over the periods in proportion.
	const leaveFactor = unpaidExcess > 0 ? Math.max(0, (span.years - unpaidExcess / 365) / span.years) : 1;
	const countedYears = span.years * leaveFactor;
	const sevFrom = (from) => periods.reduce((t, p) => t + p.salary * yearsOf(from > p.from ? from : p.from, p.to), 0) * leaveFactor;
	const severance = entitled ? r2(sevFrom(start)) : 0;
	const scopeText = (p, h) => (payType === 'hourly' ? `${h} שעות בחודש` : `${p}% משרה`);
	if (change) { add('info', 'change', `חושב לפי שתי תקופות (${cut ? 'תקנה 8: הפחתת שכר' : 'תקנה 7: שינוי בהיקף המשרה'}): עד ${heDay(periods[0].to)} לפי ${Math.round(prevBase).toLocaleString('en-US')} ₪ לחודש (${scopeText(prevPct, prevHours)}), ומ-${heDay(changeDate)} לפי ${Math.round(base).toLocaleString('en-US')} ₪ (${scopeText(jobPct, hours)}).`, cut ? 'תקנה 8' : 'תקנה 7'); }
	if (unpaidExcess > 0) { add('info', 'leave', `${unpaidExcess} ימי חופשה ללא תשלום, מעבר ל-14 בשנת עבודה, לא נספרים בחישוב הפיצויים (תקנה 10(3)): התקופה לחישוב ${countedYears.toFixed(2)} שנים במקום ${span.years.toFixed(2)}. חופשת לידה שמשולמים עליה דמי לידה נספרת.`, 'תקנה 10(3)'); }
	if (!yearOk && !nearYear && dismissed) { add('info', 'near_year_ask', 'אם הפיטורים היו סמוך לסוף השנה הראשונה, החוק מניח שנעשו כדי לחמוק מפיצויים (סעיף 3). אם זה המצב, סמנו זאת בטופס, והסכום יחושב בכפוף לכך.', 'סעיף 3'); }
	if (!yearOk && !nearYear) { add('bad', 'under_year', `עבדתם פחות משנה (${span.months} חודשים ו-${span.days} ימים): אין זכות לפיצויי פיטורים לפי החוק (סעיף 1(א)). ההודעה המוקדמת מגיעה בכל מקרה.`, 'סעיף 1(א)'); }
	if (nearYear) { add('warn', 'near_year', `פוטרתם אחרי ${span.months} חודשים, סמוך לסוף השנה הראשונה: חזקה שהפיטורים נעשו כדי לחמוק מפיצויים, והם לא פוגעים בזכות אלא אם המעסיק יוכיח אחרת (סעיף 3). הסכום כאן יחסי לתקופה שעבדתם.`, 'סעיף 3'); }
	if (reason === 'resign') { add('info', 'resign', 'בהתפטרות רגילה אין זכות לפיצויים מהמעסיק. כספים שהופרשו לפיצויים לפי סעיף 14 שייכים לכם גם בהתפטרות.', 'סעיף 14'); }
	if (!groundOk && reason === 'parent') { add('bad', 'parent_unconfirmed', `התפטרות של הורה נחשבת לפיטורים רק בתנאי סעיף 7: ${reasonRow.conditions_he}. סמנו שהתנאים מתקיימים כדי לחשב פיצויים.`, 'סעיף 7'); }
	if (!groundOk && reason !== 'parent') { add('bad', 'ground_unconfirmed', `התפטרות נחשבת לפיטורים רק כשמתקיימים התנאים של ${reasonRow.section}: ${reasonRow.conditions_he || reasonRow.he}. בתביעה מוכיחים אותם. סמנו שהם מתקיימים כדי לחשב פיצויים.`, reasonRow.section); }
	if (reason === 'term') { add('info', 'term_as_fired', `חוזה לתקופה קצובה שהסתיים בלי הצעה לחדש אותו 3 חודשים לפני הסוף נחשב לפיטורים (${reasonRow.section}).`, reasonRow.section); }
	if (reasonRow && groundOk && reason !== 'term') { add('info', 'resign_as_fired', `התפטרות שדינה כפיטורים: ${reasonRow.he} (${reasonRow.section}). בתביעה מוכיחים את הנסיבות, ובחלק מהמקרים צריך להודיע למעסיק מראש על הסיבה.`, reasonRow.section); }


	// Section 14.
	let coveredYears = 0;
	if (s14 !== 'none' && entitled) {
		const from = s14From > start ? s14From : start;
		coveredYears = from > end ? 0 : serviceSpan(from, end).years;
	}
	// The severance for the period of the deposits, on the law's salary; the fund replaces s14Pct of it. What the fund
	// actually holds (deposits on each month's pay, plus returns) is not known here and is never shown as an amount
	// (review, PR 128).
	const coveredSev = s14 !== 'none' && entitled ? r2(sevFrom(s14From > start ? s14From : start)) : 0;
	const fundReplaces = entitled ? r2(coveredSev * s14Pct / 100) : 0;
	// Without a right to severance the fund is still the worker's; its balance is unknown here, never zero (review, PR 128).
	const fundUnknown = !entitled && s14 !== 'none';
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
	// Who owes whom depends on who ended the work: the employer who dismissed without notice pays (s.7(א)); a worker who
	// resigned and stopped working without notice owes the employer the same sum (s.7(ב)) (review, PR 128).
	// A fixed-term contract that ended without renewal is not the worker's resignation (s.9): no notice debt either way.
	const fixedTerm = reason === 'term';
	const resigned = reason !== 'fired' && !fixedTerm;
	const amt = inLieu !== null ? `, כאן ${Math.round(inLieu).toLocaleString('en-US')} ₪` : '';
	if (noticeMode === 'none' && fixedTerm) { add('info', 'no_notice_term', 'חוזה לתקופה קצובה שהסתיים ולא חודש: יום הסיום ידוע מראש, והעובד לא חייב למעסיק הודעה מוקדמת; לעניין הפיצויים הסיום נחשב לפיטורים (סעיף 9 לחוק פיצויי פיטורים).', 'סעיף 9'); }
	if (noticeMode === 'none' && !fixedTerm) {
		if (resigned) { add('warn', 'no_notice', `התפטרתם בלי הודעה מוקדמת: החוק מחייב את העובד לשלם למעסיק פיצוי בגובה השכר הרגיל לתקופת ההודעה (סעיף 7(ב))${amt}, והמעסיק עשוי לקזז אותו.`, 'סעיף 7(ב)'); } else { add('warn', 'no_notice', `לא ניתנה הודעה מוקדמת: המעסיק משלם פיצוי בגובה השכר הרגיל לתקופת ההודעה (סעיף 7(א))${amt}.`, 'סעיף 7(א)'); }
	}
	// A shortfall is claimed only when the notice was worked; when it was paid instead of work, the payment should cover
	// the days to the end of the statutory period (s.6), which the tool cannot see (review, PR 128).
	if (short && noticeMode === 'paid' && !fixedTerm) { add('info', 'paid_notice', `שילמו לכם במקום עבודה בתקופת ההודעה: התשלום צריך לכסות את השכר הרגיל עד ${heDay(noticeEnd)}, סוף התקופה שבחוק (סעיף 6). בדקו בתלוש שכולם שולמו.`, 'סעיף 6'); }
	if (short && noticeMode === 'worked' && !fixedTerm) { add('warn', 'short_notice', `ההודעה ניתנה ב-${heDay(noticeDate)}, ותקופת ההודעה שבחוק מסתיימת ב-${heDay(noticeEnd)}: חסרים ${short} ימים עד היום האחרון שהזנתם. ${resigned ? 'עובד שהפסיק לעבוד לפני סוף ההודעה חייב למעסיק את השכר הרגיל בעד הימים החסרים (סעיף 7(ב)), אלא אם המעסיק ויתר עליהם (סעיף 6(ב)).' : 'עליהם מגיע פיצוי בגובה השכר הרגיל (סעיף 7(א)).'}`, resigned ? 'סעיף 7(ב)' : 'סעיף 7(א)'); }

	// Tax: one month's last salary per year, never above the ceiling per year (s.9(7א)(א)).
	// The ceiling is the one of the tax year of the grant: the registry holds 2025-2027 (frozen at 13,750); for an end of
	// work in another year the tool gives no tax split (review, PR 128).
	// With s.14 the grant is the fund's balance plus the completion, so only the exempt ceiling is known (taxNote 'fund').
	const tax = sv.tax;
	// The grant may lawfully be paid up to 15 days after the end (Wage Protection Law s.20); if that can cross into a year
	// outside the window, the split is not given (review, PR 128).
	const taxKnown = end >= tax.from && addDays(end, sv.late.grace_days) <= tax.to;
	const perYear = Math.min(base, tax.ceiling);
	// A fund exists whenever s.14 applied, also on a resignation: its balance is unknown, so only the ceiling is.
	const withFund = s14 !== 'none';
	// The ceiling is the final monthly salary times the whole service (s.9(7א)(א)); when the final salary was for part-time
	// work, the full-time years count on the full-time salary (s.9(7א)(ד)). Pay cuts (reg. 8) do not change it (review,
	// PR 128).
	// Every earlier period with a higher scope than the final one counts on the final salary for that scope (Form 161).
	// For a wage worker the scope is the hours relative to the final hours, on the final rate (review, PR 128).
	const capRef = payType === 'hourly' ? base : fte;
	const exemptCap = taxKnown ? r2(periods.reduce((t, p) => t + Math.min(p.pct > pctNow ? r2(capRef * p.pct / 100) : base, tax.ceiling) * yearsOf(p.from, p.to), 0)) : null;
	const exempt = !taxKnown ? null : withFund ? exemptCap : Math.min(severance, exemptCap);
	const taxable = !taxKnown || withFund ? null : r2(severance - exempt);
	const taxNote = !taxKnown ? 'year' : withFund ? 'fund' : '';
	const ceilingTotal = taxKnown ? r2(tax.ceiling * span.years) : null;
	if (!taxKnown && severance > 0) { add('info', 'tax_year', `תקרת הפטור ממס נקבעת לפי שנת המס שבה משולם המענק. במחשבון יש את התקרה של ${tax.from.slice(0, 4)} עד ${tax.to.slice(0, 4)} (${tax.ceiling.toLocaleString('en-US')} ₪ לשנת עבודה); לסיום עבודה ב-${end.slice(0, 4)} בדקו את התקרה בלוח העזר של רשות המסים לאותה שנה. החלק הפטור לא חושב.`, tax.section); }
	if (taxKnown && taxable > 0 && base < tax.ceiling) { add('info', 'commissioner', `מעל משכורת חודש לכל שנה, פקיד השומה רשאי לפטור עוד, עד ${tax.ceiling.toLocaleString('en-US')} ₪ לכל שנת עבודה (${ceilingTotal.toLocaleString('en-US')} ₪ אצלכם).`, tax.section); }

	// Deadlines (Wage Protection Law s.20; Advance Notice Law s.8(ב); Limitation Law s.5(1)).
	const late = sv.late;
	const deadlines = [
		{ key: 'due', date: end, he: 'המועד לתשלום הפיצויים: יום סיום יחסי העבודה', section: `${late.section}(א)(1)`, url: late.url },
		{ key: 'grace', date: addDays(end, late.grace_days), he: `היום ה-${late.grace_days}: עד אז אין פיצוי הלנה`, section: `${late.section}(ב)`, url: late.url },
		{ key: 'twenty', date: addDays(end, late.linkage_to_day), he: `מהיום ה-${late.grace_days + 1} ועד ה-${late.linkage_to_day}: הפרשי הצמדה; אחרי היום ה-${late.linkage_to_day}: עוד ${late.monthly_pct}% לכל חודש של איחור (בית הדין רשאי להפחית)`, section: `${late.section}(ב)`, url: late.url },
		{ key: 'cert', date: addDays(end, sv.notice.cert_days), he: `אישור בכתב על תחילת העבודה וסיומה: לכל המאוחר ${sv.notice.cert_days} ימים מהיום האחרון; בקשה בכתב מקדימה את המועד ל-${sv.notice.cert_request_days} ימים ממנה`, section: 'סעיף 8(ב) לחוק הודעה מוקדמת', url: sv.notice.url },
		{ key: 'limit', date: addMonths(end, 12 * sv.limitation.years), he: `התיישנות תביעה לפיצויים: ${sv.limitation.years} שנים`, section: `${sv.limitation.section} לחוק ההתיישנות`, url: sv.limitation.url },
	].filter((d) => entitled || d.key === 'cert'); // no severance due: only the certificate (review, PR 128)

	return {
		ok: true, payType, monthly, base, floored, hourly, hours, jobPct, start, end, span, reason, reasonRow, entitled, yearOk, conditional,
		severance, s14, s14Pct, s14From, coveredYears, coveredSev, fundReplaces, fundUnknown, employer,
		change, changeDate, prevPct, prevSalary, prevHours, prevHourly, prevBase, cut, periods, taxNote, unpaidExcess, countedYears,
		groundOk, nearClaim: input.nearClaim === true,
		// s.11(ה): on retirement the employer may credit provident-fund money meant for severance, even outside s.14.
		retireCredit: reason === 'retire' && entitled,
		notice, workedToNotice, noticeDate, noticeEnd, short, inLieu, noticeMode,
		exempt, taxable, exemptCap, ceilingTotal, perYear, deadlines, flags, mwRow,
	};
}

/** The same employee under each section-14 arrangement, for the side-by-side. */
export function byArrangement(registry, input) {
	const out = {};
	for (const k of ['none', 'partial', 'full']) {
		const r = compute(registry, Object.assign({}, input, { s14: k, s14From: '' }));
		out[k] = r.ok ? { employer: r.employer, pct: r.s14Pct, total: r.severance } : null;
	}
	return out;
}
