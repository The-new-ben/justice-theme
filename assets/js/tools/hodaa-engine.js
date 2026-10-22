/**
 * The labor wave (22.10.2026): the advance notice, both directions (hodaa-mukdemet, /notice-of-dismissal/).
 *
 * Dependency-free ES module on top of the wave-5 severance engine (its frozen notice helpers) and dates.js. Every number
 * comes from the registry: reg.severance (the tiers of ss.3-4, the certificate days, the late-payment rule, the
 * limitation), reg.rights_leida.protect (the 6 months and the 60 days of the Women's Employment Law s.9) and
 * reg.labor_hodaa (the sections, the Annual Leave Law s.5(a)(7), the other protected periods, the reserve-duty rules).
 *  - Days: Advance Notice Law s.3 (monthly), s.4 (wage), s.5 (the same tiers for a resignation), counted as the Ministry of
 *    Labor's published table counts them (gov.il guide, chapter "תקופת ההודעה המוקדמת"): by the month of work in which the
 *    notice is given (a month that has started counts; the monthly worker's first year reaches "up to three weeks"; the
 *    wage worker's table: month 12 = 12 days, 13 = 14, 24 = 19, 25 = 21, 36 = 26, more than 36 = a month). A monthly
 *    worker who has accumulated 12 months gets a month. A longer notice in the contract or a collective agreement wins (s.12).
 *    The severance engine holds that reading (noticeByMonth) and both instruments use it.
 *  - The calendar: the notice day is not counted, a month ends on the same day number in the next month (Interpretation
 *    Law s.10, as the severance tool counts); protected periods are not counted in a dismissal notice (Women's Employment
 *    Law s.9(c)(3), (d), (f); Discharged Soldiers Law s.41A(c), s.41A2(h)), so the last day moves by the paused days.
 *  - Pay: the regular wage for the period (ss.6-7): a month's notice is one month's wage; a notice in days is the wage of
 *    each counted calendar day as a share of its own month (the reader's salary; for a wage worker, the hourly rate times
 *    the reader's own average monthly hours). Who pays whom: s.6(a)/(b) waived, s.7(a) employer, s.7(b) employee.
 *  - Vacation inside a dismissal notice: notice days count as vacation only beyond 14 (Annual Leave Law s.5(a)(7)).
 *  - Gates: flags with sections and the official permit route, never a verdict.
 * Every top-level name starts with "hd": the bundle concatenates this file with pitzuyim-engine.js and dates.js.
 */

import { addDays, addMonths, parseDate, daysBetween, offRestDays, addCountedDays } from './dates.js';
import { serviceSpan, monthLater, noticeByMonth } from './pitzuyim-engine.js';

const hdR2 = (n) => Math.round(n * 100) / 100;
const hdBlank = (v) => v === '' || v === undefined || v === null;
const hdHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const hdMonthDays = (iso) => { const [y, m] = iso.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).getUTCDate(); };
export const HD_MODES = ['worked', 'waived', 'none', 'short'];
export const HD_GATES = ['pregnant', 'leave', 'after_leave', 'unpaid_after', 'fertility', 'shelter', 'miscarriage', 'reserve', 'reserve_after', 'partner'];
export const HD_PAUSES = ['reserve', 'leave', 'partner', 'shelter', 'miscarriage'];

/**
 * The notice the law sets, as the Ministry of Labor's table reads ss.3-4: n = the month of work in which the notice is given
 * (full months, plus one when days of a further month have started). Monthly: n <= 6 -> n days (s.3(1)); 7..12 -> 6 + 2.5
 * for each month from the 7th (s.3(2), up to 21 days); 12 full months or more -> a month (s.3(3)). Wage: n <= 12 -> n days
 * (s.4(1)); 13..24 -> 14 + 1 for every two months after the 13th (s.4(2)); 25..36 -> 21 + the same (s.4(3)); more than 36
 * months -> a month (s.4(4)).
 */
export function hdNoticeDays(sv, payType, span) {
	return noticeByMonth(sv, payType, span);
}

/** The days after `from` up to `to` (inclusive) that the predicate keeps, each as a share of its own month. */
export function hdMonthShare(from, to, keep = () => true) {
	let share = 0;
	let days = 0;
	for (let d = addDays(from, 1), guard = 0; d <= to && guard < 800; d = addDays(d, 1), guard += 1) {
		if (keep(d)) { share += 1 / hdMonthDays(d); days += 1; }
	}
	return { share, days };
}

/** The window a protected period keeps out of a dismissal notice: the period itself and the days after it the law adds. */
export function hdPauseWindow(reg, kind, from, to) {
	const lh = reg.labor_hodaa;
	const leida = reg.rights_leida.protect;
	if (!kind || !from || !to || to < from) { return null; }
	const len = daysBetween(from, to) + 1;
	const gate = (code) => lh.women.gates.find((g) => g.code === code);
	if (kind === 'reserve') {
		const after = len >= lh.reserve.min_days_for_after ? lh.reserve.after_days : 0;
		return { kind, from, to: addDays(to, after), served: len, after, section: lh.reserve.not_counted_section, url: lh.reserve.url };
	}
	if (kind === 'partner') { return { kind, from, to, served: len, after: 0, section: lh.reserve.partner_not_counted_section, url: lh.reserve.url }; }
	if (kind === 'leave') { return { kind, from, to: addDays(to, leida.after_days), served: len, after: leida.after_days, section: lh.women.not_counted_section, url: lh.women.url }; }
	if (kind === 'shelter') { const g = gate('shelter'); return { kind, from, to: addDays(to, g.days_after), served: len, after: g.days_after, section: g.section, url: lh.women.url }; }
	if (kind === 'miscarriage') { const g = gate('miscarriage'); return { kind, from, to, served: len, after: 0, section: g.section, url: lh.women.url }; }
	return null;
}

/**
 * input = { dir ('fire'|'resign'), payType ('monthly'|'hourly'), salary, hourly, hours, start, noticeDate,
 *           mode (HD_MODES), lastDay (mode 'short'), contractDays, vacation, pauseKind (HD_PAUSES), pauseFrom, pauseTo,
 *           gates (HD_GATES[]) }
 */
export function hdCompute(reg, input) {
	const sv = reg.severance;
	const lh = reg.labor_hodaa;
	const leida = reg.rights_leida.protect;
	const errors = [];
	const dir = input.dir === 'resign' ? 'resign' : 'fire';
	const payType = input.payType === 'hourly' ? 'hourly' : 'monthly';
	const start = parseDate(input.start);
	const noticeDate = parseDate(input.noticeDate);
	if (!start) { errors.push({ field: 'start', he: 'יום תחילת העבודה: תאריך מלא, לדוגמה 1.2.2026' }); }
	if (!noticeDate) { errors.push({ field: 'noticeDate', he: 'יום מסירת ההודעה: תאריך מלא' }); }
	if (start && noticeDate && noticeDate < start) { errors.push({ field: 'noticeDate', he: 'ההודעה ניתנה לפני יום תחילת העבודה' }); }
	// Pay is optional: the days and the dates never need it; the amounts do.
	let monthly = null;
	if (payType === 'monthly' && !hdBlank(input.salary)) {
		monthly = Number(input.salary);
		if (!(monthly > 0 && monthly < 1e7)) { errors.push({ field: 'salary', he: 'השכר החודשי: מספר חיובי, או ריק' }); }
	}
	if (payType === 'hourly' && (!hdBlank(input.hourly) || !hdBlank(input.hours))) {
		const h = Number(input.hourly);
		const n = Number(input.hours);
		if (!(h > 0 && h < 10000)) { errors.push({ field: 'hourly', he: 'שכר לשעה: מספר חיובי' }); }
		if (!(n > 0 && n <= 400)) { errors.push({ field: 'hours', he: 'ממוצע שעות בחודש: 1 עד 400' }); }
		if (h > 0 && n > 0) { monthly = hdR2(h * n); }
	}
	const mode = HD_MODES.includes(input.mode) ? input.mode : 'worked';
	const lastDayIn = mode === 'short' ? parseDate(input.lastDay) : null;
	if (mode === 'short' && !lastDayIn) { errors.push({ field: 'lastDay', he: 'היום האחרון שבו עבדתם בפועל: תאריך מלא' }); }
	if (lastDayIn && noticeDate && lastDayIn < noticeDate) { errors.push({ field: 'lastDay', he: 'היום האחרון בעבודה לפני יום ההודעה' }); }
	const contractDays = hdBlank(input.contractDays) ? 0 : Number(input.contractDays);
	if (!(Number.isInteger(contractDays) && contractDays >= 0 && contractDays <= 365)) { errors.push({ field: 'contractDays', he: 'ימי הודעה לפי החוזה: מספר שלם, 0 עד 365, או ריק' }); }
	const vacation = hdBlank(input.vacation) ? 0 : Number(input.vacation);
	if (!(Number.isInteger(vacation) && vacation >= 0 && vacation <= 366)) { errors.push({ field: 'vacation', he: 'ימי חופשה בתוך ההודעה: מספר שלם, 0 או ריק' }); }
	const pauseKind = HD_PAUSES.includes(input.pauseKind) ? input.pauseKind : '';
	const pauseFrom = pauseKind ? parseDate(input.pauseFrom) : null;
	const pauseTo = pauseKind ? parseDate(input.pauseTo) : null;
	if (pauseKind && (!pauseFrom || !pauseTo)) { errors.push({ field: 'pause', he: 'התקופה שלא נספרת: תאריך התחלה ותאריך סיום מלאים' }); }
	if (pauseFrom && pauseTo && pauseTo < pauseFrom) { errors.push({ field: 'pause', he: 'סוף התקופה לפני תחילתה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const span = serviceSpan(start, noticeDate);
	const months = span.months;
	const stat = hdNoticeDays(sv, payType, span);
	const statEnd = stat.month ? monthLater(noticeDate) : addDays(noticeDate, Math.ceil(stat.days));
	const statCal = daysBetween(noticeDate, statEnd);
	// s.12: a longer notice in the contract or a collective agreement wins over the law's minimum in a dismissal; in a
	// resignation the contract cannot make the notice longer than the law (the Ministry of Labor's guide).
	const useContract = dir === 'fire' && contractDays > statCal;
	const baseCal = useContract ? contractDays : statCal;
	// The protected period that the law keeps out of a dismissal notice.
	const win = dir === 'fire' && pauseKind ? hdPauseWindow(reg, pauseKind, pauseFrom, pauseTo) : null;
	const inWin = (d) => Boolean(win && d >= win.from && d <= win.to);
	const end = win ? addCountedDays(noticeDate, baseCal, inWin) : addDays(noticeDate, baseCal);
	const paused = win ? daysBetween(noticeDate, end) - baseCal : 0;
	if (win && !paused) { add('info', 'pause_outside', `התקופה שהזנתם (${hdHe(win.from)} עד ${hdHe(win.to)}) לא נופלת בתוך תקופת ההודעה, ולכן היום האחרון לא זז.`, win.section, win.url); }
	if (pauseKind && dir === 'resign') { add('info', 'pause_resign', 'הכלל שתקופות מוגנות לא נספרות בימי ההודעה נכתב בחוק על הודעה מוקדמת לפיטורים. בהתפטרות הוא לא חל, והחישוב לא עצר את הספירה.', lh.women.not_counted_section, lh.women.url); }
	if (win && noticeDate >= win.from && noticeDate <= win.to) { add('danger', 'notice_in_window', `ההודעה ניתנה בתוך התקופה המוגנת (${hdHe(win.from)} עד ${hdHe(win.to)}): בתקופה כזו אסור לפטר או לתת הודעת פיטורים שתחול בה בלי היתר, ובחלק מהמקרים בכלל. ימי התקופה לא נספרו בהודעה.`, win.section, win.url); }

	// When the work actually ended.
	const endWork = mode === 'none' ? noticeDate : mode === 'short' ? (lastDayIn < end ? lastDayIn : end) : end;
	const counted = (d) => !inWin(d);
	// The regular wage for a stretch of counted notice days: a full month's notice is one month's wage.
	const fullMonth = stat.month && !useContract;
	// s.3(2) gives half days (6 + 2.5 a month): the calendar ends on the next whole day, and the pay counts the half only.
	const frac = !stat.month && !useContract ? Math.ceil(stat.days) - stat.days : 0;
	const wageFor = (from, to) => {
		if (monthly === null) { return null; }
		const s = hdMonthShare(from, to, counted);
		const half = frac && to === end && from < end ? frac / hdMonthDays(end) : 0;
		return hdR2(monthly * (s.share - half));
	};
	const periodPay = monthly === null ? null : (fullMonth ? monthly : wageFor(noticeDate, end));
	const countedAll = hdMonthShare(noticeDate, end, counted).days;
	const noticeLen = useContract ? contractDays : stat.month ? null : stat.days;
	let missing = { days: 0, from: null, to: null, pay: null };
	if (mode === 'none' || (mode === 'short' && endWork < end)) {
		const m = hdMonthShare(endWork, end, counted);
		const pay = monthly === null ? null : (mode === 'none' && fullMonth ? monthly : wageFor(endWork, end));
		missing = { days: m.days, from: addDays(endWork, 1), to: end, pay };
	}
	const owedBy = mode === 'waived' ? 'employer' : (mode === 'none' || (mode === 'short' && missing.days)) ? (dir === 'fire' ? 'employer' : 'employee') : null;
	const paySection = mode === 'waived' ? (dir === 'fire' ? lh.law.sections.waive_fire : lh.law.sections.waive_resign) : owedBy ? (dir === 'fire' ? lh.law.sections.none_fire : lh.law.sections.none_resign) : '';
	const owed = mode === 'waived' ? periodPay : owedBy ? missing.pay : null;
	const L = lh.law.sections;
	if (!stat.month && span.days > 0) { add('info', 'month_started', `ההודעה ניתנה בחודש העבודה ה-${stat.n} (${months} חודשים שלמים ועוד ${span.days} ימים): כמו בטבלה של משרד העבודה, חודש שהתחיל נספר.`, stat.section, lh.guide.url); }
	if (dir === 'resign' && contractDays > statCal) { add('info', 'contract_resign', `החוזה קובע ${contractDays} ימים, אבל בהתפטרות: ${lh.guide.contract_he} (משרד העבודה). החישוב לפי החוק.`, L.resign, lh.guide.url); }
	if (useContract) { add('info', 'contract', `החוזה או ההסכם קובעים ${contractDays} ימים, יותר מ-${statCal} הימים שבחוק: החוק לא גורע מזכות לפי הסכם או חוזה (${L.rights}), והחישוב לפי ${contractDays} הימים.`, L.rights, lh.law.url); }
	if (dir === 'resign') { add('info', 'resign_tiers', `בהתפטרות חלות אותן מדרגות (${L.resign}): ההודעה היא חובה של העובד כלפי המעסיק.`, L.resign, lh.law.url); }
	if (mode === 'waived') { add('info', 'waived', `המעסיק ויתר על העבודה בפועל בתקופת ההודעה: הוא משלם את השכר הרגיל בעד התקופה שעליה ויתר (${dir === 'fire' ? L.waive_fire : L.waive_resign}).`, dir === 'fire' ? L.waive_fire : L.waive_resign, lh.law.url); }
	if (owedBy === 'employer' && mode !== 'waived') { add('warn', 'owed_employer', `${mode === 'none' ? 'לא ניתנה הודעה מוקדמת' : `העבודה הסתיימה ב-${hdHe(endWork)}, ${missing.days} ימים לפני סוף ההודעה`}: המעסיק משלם פיצוי בגובה השכר הרגיל בעד הימים האלה (${L.none_fire}).`, L.none_fire, lh.law.url); }
	if (owedBy === 'employee') { add('warn', 'owed_employee', `${mode === 'none' ? 'הפסקתם לעבוד בלי הודעה מוקדמת' : `הפסקתם לעבוד ב-${hdHe(endWork)}, ${missing.days} ימים לפני סוף ההודעה`}: העובד משלם למעסיק פיצוי בגובה השכר הרגיל בעד הימים האלה (${L.none_resign}), והמעסיק רשאי לקזז אותו מכל סכום שהוא חייב לכם; אם המעסיק ויתר על הימים האלה, אין חוב (${L.waive_resign}).`, L.none_resign, lh.law.url); }

	// Vacation inside a dismissal notice (Annual Leave Law s.5(a)(7)): only the days beyond 14 can count as vacation.
	const lv = lh.leave;
	const allowed = Math.max(0, countedAll - lv.free_days);
	const vac = { planned: vacation, allowed, over: dir === 'fire' ? Math.max(0, vacation - allowed) : 0, applies: dir === 'fire' };
	if (vacation > 0 && dir === 'fire' && vac.over > 0) { add('warn', 'vacation_over', `מתוך ${countedAll} ימי ההודעה, רק ${allowed} יכולים להיחשב ימי חופשה (${lv.section}: ${lv.rule_he}). ${vac.over} מתוך ${vacation} ימי החופשה שתוכננו לא נחשבים חופשה: הם נשארים לזכותכם, ואם לא ינוצלו, משולם עליהם פדיון חופשה (${lv.redeem_section} לחוק חופשה שנתית).`, lv.section, lv.url); }
	if (vacation > 0 && dir === 'fire' && !vac.over) { add('info', 'vacation_ok', `${vacation} ימי חופשה בתוך ${countedAll} ימי הודעה: בגבול ${allowed} הימים שיכולים להיחשב חופשה (${lv.section}).`, lv.section, lv.url); }
	if (vacation > 0 && dir === 'resign') { add('info', 'vacation_resign', `הכלל של ${lv.free_days} הימים (${lv.section}) נכתב על הודעה מוקדמת לפיטורים; בהתפטרות הוא לא חל.`, lv.section, lv.url); }

	// The gates: who must not be dismissed now, each with its section. Flags, never a verdict.
	const gates = [];
	const picked = Array.isArray(input.gates) ? input.gates.filter((g) => HD_GATES.includes(g)) : [];
	const W = lh.women;
	const R = lh.reserve;
	const wg = (code) => W.gates.find((g) => g.code === code);
	for (const code of picked) {
		let g = null;
		if (code === 'pregnant') {
			const ok6 = months >= leida.pregnancy_months;
			g = { code, level: ok6 ? 'danger' : 'info', section: leida.pregnancy_section, url: W.permit_url, he: ok6 ? `${leida.pregnancy_he}. עבדתם ${months} חודשים, ולכן הפיטורים טעונים היתר.` : `ההגנה של ${leida.pregnancy_section} חלה אחרי ${leida.pregnancy_months} חודשי עבודה אצל אותו מעסיק; עד יום ההודעה עבדתם ${months} חודשים, ולכן היתר לא נדרש לפי הסעיף הזה.` };
		} else if (code === 'reserve') {
			g = { code, level: 'danger', section: R.during_section, url: R.url, he: `${R.during_he}. ${R.because_he} (${R.because_section}).` };
		} else if (code === 'reserve_after') {
			g = { code, level: 'danger', section: R.during_section, url: R.url, he: `${R.after_days} ימים אחרי שירות מילואים של יותר מיומיים רצופים: פיטורים רק בהיתר מ${R.committee_he}. ${R.not_counted_he} (${R.not_counted_section}).` };
		} else if (code === 'partner') {
			g = { code, level: 'warn', section: R.partner_section, url: R.url, he: `${R.partner_he}. ${R.partner_temp_he}.` };
		} else {
			const w = wg(code);
			const need6 = code === 'fertility';
			g = { code, level: code === 'leave' || code === 'miscarriage' ? 'danger' : 'warn', section: w.section, url: W.permit_url, he: `${w.he}.${w.not_counted ? ' התקופה הזאת לא באה במניין ימי ההודעה.' : ''}${need6 && months < 6 ? ` עבדתם ${months} חודשים: ההגנה למי שלא נעדר מהעבודה חלה אחרי 6 חודשים (סעיף 9(ה)(3)), וההגנה בימי ההיעדרות חלה בלי תנאי ותק.` : ''}` };
		}
		if (dir === 'resign') { g.level = 'info'; g.he = `${g.he} ההגנות האלה מגבילות פיטורים; בהתפטרות הן לא חלות.`; }
		gates.push(g);
	}
	const blocked = dir === 'fire' && gates.some((g) => g.level === 'danger');

	// The dates the law sets.
	const late = sv.late;
	const tenureEnd = serviceSpan(start, endWork);
	const severanceDue = dir === 'fire' && tenureEnd.months >= sv.min_months;
	const events = [
		{ key: 'notice', date: noticeDate, he: `${dir === 'fire' ? 'הודעה מוקדמת לפיטורים' : 'הודעה מוקדמת להתפטרות'}: יום מסירת ההודעה בכתב`, section: `${L.written} לחוק הודעה מוקדמת`, url: lh.law.url },
		{ key: 'end', date: end, he: `היום האחרון של תקופת ההודעה: ${stat.month && !useContract ? 'חודש' : `${baseCal} ימים`}${paused ? `, ועוד ${paused} ימים שלא נספרו` : ''}`, section: `${useContract ? L.rights : stat.section} לחוק הודעה מוקדמת`, url: lh.law.url },
	];
	if (endWork < end) { events.push({ key: 'work_end', date: endWork, he: 'היום האחרון שבו עבדתם בפועל', section: `${dir === 'fire' ? L.none_fire : L.none_resign} לחוק הודעה מוקדמת`, url: lh.law.url }); }
	events.push({ key: 'cert', date: offRestDays(addDays(endWork, sv.notice.cert_days)), he: `אישור בכתב על תחילת העבודה וסיומה: לכל המאוחר ${sv.notice.cert_days} ימים מהיום האחרון, או ${sv.notice.cert_request_days} ימים מבקשה בכתב, המוקדם מביניהם`, section: `${L.cert_late} לחוק הודעה מוקדמת`, url: lh.law.url });
	if (severanceDue) {
		events.push({ key: 'sev_due', date: endWork, he: 'פיצויי פיטורים: המועד לתשלום הוא יום סיום יחסי העבודה', section: `${late.section}(א)(1) לחוק הגנת השכר`, url: late.url });
		events.push({ key: 'sev_grace', date: offRestDays(addDays(endWork, late.grace_days)), he: `פיצויי פיטורים: היום ה-${late.grace_days}, אחריו מתחיל פיצוי הלנה`, section: `${late.section}(ב) לחוק הגנת השכר`, url: late.url });
		events.push({ key: 'sev_late', date: offRestDays(addDays(endWork, late.linkage_to_day)), he: `פיצויי פיטורים: אחרי היום ה-${late.linkage_to_day}, עוד ${late.monthly_pct}% לכל חודש של איחור (בית הדין רשאי להפחית)`, section: `${late.section}(ב) לחוק הגנת השכר`, url: late.url });
	}
	events.push({ key: 'limit', date: offRestDays(addMonths(endWork, 12 * sv.limitation.years)), he: `התיישנות תביעה כספית מיחסי העבודה: ${sv.limitation.years} שנים`, section: `${sv.limitation.section} לחוק ההתיישנות`, url: sv.limitation.url });
	if (win && paused) { events.push({ key: 'pause_end', date: win.to, he: 'סוף התקופה שלא נספרת בימי ההודעה', section: win.section, url: win.url }); }
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	if (!severanceDue && dir === 'fire') { add('info', 'no_severance_year', `עד היום האחרון עבדתם ${tenureEnd.months} חודשים: הזכות לפיצויי פיטורים לפי החוק נוצרת אחרי שנת עבודה (סעיף 1(א) לחוק פיצויי פיטורים; פיטורים סמוך לסוף השנה הראשונה: סעיף 3). ההודעה המוקדמת מגיעה בכל מקרה.`, 'סעיף 1(א)', sv.law_url); }

	// The ribbon: every day from the day after the notice to the last day of the notice, with its kind.
	const ribbon = [];
	for (let d = addDays(noticeDate, 1), guard = 0; d <= end && guard < 800; d = addDays(d, 1), guard += 1) {
		const kind = inWin(d) ? 'pause' : d > endWork ? (mode === 'none' || mode === 'short' ? 'missing' : 'counted') : mode === 'waived' ? 'waived' : 'counted';
		ribbon.push({ date: d, kind });
	}
	return {
		ok: true, dir, payType, start, noticeDate, span, months, stat, statEnd, statCal, contractDays, useContract, baseCal, fullMonth, noticeLen, frac,
		end, endWork, paused, win, counted: countedAll, mode, monthly, hourly: payType === 'hourly' ? Number(input.hourly) || null : null,
		hours: payType === 'hourly' ? Number(input.hours) || null : null, periodPay, missing, owedBy, owed, paySection,
		vacation: vac, gates, blocked, severanceDue, tenureEnd, events, ribbon, flags,
	};
}

/** The analytics band: tier and direction only, never a date or an amount. */
export function hdBand(r) {
	if (!r || !r.ok) { return 'error'; }
	const tier = r.stat.month ? 'month' : r.stat.n <= 6 ? 'n1-6' : r.stat.n <= 12 ? 'n7-12' : 'y2-3';
	return `${r.dir}-${r.payType}-${tier}`;
}
