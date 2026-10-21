/**
 * The rights wave (21.10.2026): unemployment benefit (דמי אבטלה), from the eligibility gate to the last payment.
 *
 * Dependency-free ES module (dates.js only). Every number comes from registry.rights_avtala (the National Insurance
 * Institute's unemployment pages and chapter 7 of the National Insurance Law, read on its checked_on date), and
 * registry.min_wage for one warning:
 *  - Eligibility: age 20 to 67 (s.160(א); schedule A1 part B); 12 calendar months with contributions, one day enough, in
 *    the 18 months before the determining date (s.161(א)); the way the work ended (s.166(ב): a resignation without
 *    justification waits 90 days from the day work stopped; unpaid leave only at the employer's initiative, 30 days or
 *    more); registration at the Employment Service (the claim runs from the first registration).
 *  - The daily wage: the income of the 6 months before the month of the first registration, divided by 150 (s.170(א);
 *    the Institute's calculation page).
 *  - The rate: schedule 7 (s.167(א)): 80/50/45/30% (under 28: 60/40/35/25%) of the parts of the daily wage up to a half,
 *    three quarters, the whole and five times the basic daily amount (415 from 1.1.2026).
 *  - The ceiling: the average daily wage in the economy (550.76) for the first 125 payment days, two thirds of it (367.17)
 *    from the 126th (s.167(ב)); women born from 1.1.1960 aged 57 to 60: 201.03 from the 176th (s.167(ג)); a repeat claim
 *    under 40: 85% (468.15) and 80% of the days (s.171א).
 *  - The days: by age and dependents (s.171(א)), in the 12 months from the 1st of the month of the first registration
 *    (18 months for the 300 days of women born from 1960).
 *  - Waiting days: the first 5 unemployment days of every 4 consecutive months from the determining date are not paid and
 *    do not use the quota (s.172).
 *  - Payment: Sunday to Friday (Saturday never), on the 12th of the next month (the Institute's payment page).
 */

import { addDays, addMonths, parseDate, daysBetween } from './dates.js';

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const heDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
export const ENDINGS = ['fired', 'contract', 'resign_ok', 'resign', 'leave', 'leave_short', 'leave_own'];
export const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

/** "אוקטובר 2026" from "2026-10" or "2026-10-18". */
export function monthHe(key) {
	const [y, m] = String(key).split('-').map(Number);
	return `${MONTHS_HE[m - 1] || ''} ${y}`;
}
/** The 1st of the month of a day. */
export function monthStart(iso) { return `${iso.slice(0, 7)}-01`; }
/** Whole calendar months from the 1st of one month to a day. */
export function monthsFrom(startIso, iso) {
	const [sy, sm] = startIso.split('-').map(Number);
	const [y, m] = iso.split('-').map(Number);
	return (y - sy) * 12 + (m - sm);
}
/** The 6 months whose wages make the base: the six months before the month of the first registration, oldest first. */
export function baseMonths(regIso) {
	const out = [];
	for (let i = 6; i >= 1; i -= 1) { out.push(addMonths(monthStart(regIso), -i).slice(0, 7)); }
	return out;
}
const isSaturday = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay() === 6;

/** The average daily wage: the six months' income divided by the divisor (150), s.170(א). */
export function averageDaily(av, wages) {
	const total = r2(wages.reduce((a, w) => a + Number(w), 0));
	return { total, avg: r2(total / av.base.divisor) };
}

/** Schedule 7: the daily benefit before the ceiling, tier by tier, for an age. */
export function dailyBenefit(av, avg, age) {
	const rt = av.rates;
	const young = age < rt.young_under;
	let prev = 0;
	let raw = 0;
	const tiers = rt.tiers.map((t) => {
		const upto = rt.basic_daily * t.upto;
		const part = Math.max(0, Math.min(avg, upto) - prev);
		const pct = young ? t.pct_young : t.pct;
		const amount = part * pct / 100;
		const row = { from: prev, to: upto, part: r2(part), pct, amount: r2(amount), he: t.he };
		raw += amount;
		prev = upto;
		return row;
	});
	return { young, tiers, raw: r2(raw), rawExact: raw };
}

/** The maximum days by age, dependents and (for women born from 1.1.1960, aged 57 and over) the 300-day rule, s.171(א). */
export function maxDaysFor(av, age, deps, women) {
	const w = av.women;
	if (women && age >= w.from_age && age < av.age.max) {
		return { days: w.days, section: age >= w.upper_age ? w.section_60 : w.section_57, windowMonths: w.window_months, women: true, womenCap: age < w.upper_age };
	}
	const band = av.days.bands.find((b) => age >= b.from && age < b.to);
	if (!band) { return { days: 0, section: av.age.section, windowMonths: av.days.window_months, women: false, womenCap: false, band: null }; }
	const many = deps >= av.days.dependents_many;
	return { days: many ? band.many : band.few, section: many ? band.many_section : band.few_section, windowMonths: av.days.window_months, women: false, womenCap: false, band, many };
}

/**
 * input = { age (completed years on the registration day), women (a woman born from 1.1.1960; read from 57), deps (0..20),
 *           ending (one of ENDINGS), stop (the day work stopped, ISO), reg (the first registration at the Employment
 *           Service, ISO), months (months with wage in the 18 before the registration month), wageMode ('same'|'each'),
 *           wage (the same monthly wage in all six months), wages (six wages, oldest first), repeat (under 40: a full claim
 *           in the last 4 years; 40 and over: benefits in the 11 months before) }
 */
export function compute(registry, input) {
	const av = registry.rights_avtala;
	const errors = [];
	const age = blank(input.age) ? NaN : Number(input.age);
	if (!(Number.isInteger(age) && age >= 16 && age <= 90)) { errors.push({ field: 'age', he: 'הגיל ביום הרישום: מספר שלם בשנים, 16 עד 90' }); }
	const deps = blank(input.deps) ? 0 : Number(input.deps);
	if (!(Number.isInteger(deps) && deps >= 0 && deps <= 20)) { errors.push({ field: 'deps', he: 'מספר התלויים: 0 עד 20' }); }
	const ending = ENDINGS.includes(input.ending) ? input.ending : null;
	if (!ending) { errors.push({ field: 'ending', he: 'בחרו איך הסתיימה העבודה' }); }
	const stop = parseDate(input.stop);
	const reg = parseDate(input.reg);
	if (!stop) { errors.push({ field: 'stop', he: 'יום הפסקת העבודה: תאריך מלא, לדוגמה 15.10.2026' }); }
	if (!reg) { errors.push({ field: 'reg', he: 'יום הרישום בשירות התעסוקה: תאריך מלא, לדוגמה 18.10.2026' }); }
	if (stop && reg && reg < stop) { errors.push({ field: 'reg', he: 'הרישום בשירות התעסוקה לפני יום הפסקת העבודה: בדקו את התאריכים' }); }
	if (stop && reg && reg >= stop && daysBetween(stop, reg) > 730) { errors.push({ field: 'reg', he: 'יותר משנתיים בין הפסקת העבודה לרישום: תקופת האכשרה נבדקת ב-18 החודשים שלפני הרישום, ולכן התאריכים כאן לא יתאימו. בדקו את התאריכים.' }); }
	const months = blank(input.months) ? NaN : Number(input.months);
	if (!(Number.isInteger(months) && months >= 0 && months <= av.qualify.window_months)) { errors.push({ field: 'months', he: `חודשי עבודה כשכירים ב-${av.qualify.window_months} החודשים האחרונים: 0 עד ${av.qualify.window_months}` }); }
	const each = input.wageMode === 'each';
	let wages = [];
	if (each) {
		const list = Array.isArray(input.wages) ? input.wages : [];
		for (let i = 0; i < av.base.months; i += 1) {
			const v = blank(list[i]) ? NaN : Number(list[i]);
			if (!(v > 0 && v < 1e6)) { errors.push({ field: `w${i}`, he: `השכר בחודש ${i + 1} מתוך ${av.base.months}: מספר חיובי. חודש בלי שכר לא נכנס לחישוב; הזינו במקומו את החודש הקודם שבו עבדתם` }); }
			wages.push(v);
		}
	} else {
		const w = blank(input.wage) ? NaN : Number(input.wage);
		if (!(w > 0 && w < 1e6)) { errors.push({ field: 'wage', he: 'השכר החודשי ברוטו: מספר חיובי' }); }
		wages = Array(av.base.months).fill(w);
	}
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });

	// 1. The gate.
	const ageOk = age >= av.age.min && age < av.age.max;
	const qualifyOk = months >= av.qualify.months;
	const endingOk = ending !== 'leave_own' && ending !== 'leave_short';
	const gates = [
		{ key: 'age', ok: ageOk, he: ageOk ? `גיל ${age}: בין ${av.age.min} ל-${av.age.max}` : age < av.age.min ? `גיל ${age}: מתחת ל-${av.age.min}` : `גיל ${age}: מגיל ${av.age.max} אין דמי אבטלה`, section: av.age.section, url: av.pages.conditions },
		{ key: 'qualify', ok: qualifyOk, he: `${months} חודשי עבודה מתוך ${av.qualify.window_months}: ${qualifyOk ? 'יש' : 'אין'} תקופת אכשרה (צריך ${av.qualify.months})`, section: av.qualify.section, url: av.qualify.extra_url },
		{ key: 'ending', ok: endingOk, he: { fired: 'פיטורים: מהיום הראשון לרישום', contract: 'סיום חוזה: מהיום הראשון לרישום', resign_ok: 'התפטרות מוצדקת: מהיום הראשון לרישום, עם המסמכים', resign: `התפטרות בלי הצדקה: רק אחרי ${av.resign.wait_days} ימים מיום הפסקת העבודה`, leave: `חל"ת ביוזמת המעסיק, ${av.leave.min_days} יום ומעלה: מהיום הראשון לרישום`, leave_short: `חל"ת קצר מ-${av.leave.min_days} יום: אין זכאות`, leave_own: 'חל"ת ביוזמתכם: אין זכאות' }[ending], section: ending === 'resign' ? av.resign.section : '', url: ending && ending.startsWith('leave') ? av.leave.url : av.resign.url },
		{ key: 'register', ok: true, he: `רישום בשירות התעסוקה ב-${heDay(reg)}; התייצבות בלשכה בתוך ${av.register.office_days} יום`, section: '', url: av.register.url },
	];
	const eligible = gates.every((g) => g.ok);
	if (!ageOk && age < av.age.min) { add('bad', 'under20', av.age.under20_he, 'סעיף 160(ג)'); }
	if (!ageOk && age >= av.age.max) { add('bad', 'over67', av.age.over_max_he, av.age.max_section); }
	if (!qualifyOk) { add('bad', 'qualify', `חסרים ${av.qualify.months - months} חודשים לתקופת האכשרה (${av.qualify.section}). ${av.qualify.partial_he}. ${av.qualify.extra_he}.`, av.qualify.section); }
	if (ending === 'leave_own') { add('bad', 'leave_own', av.leave.own_he); }
	if (ending === 'leave_short') { add('bad', 'leave_short', `חל"ת מזכה רק כשהוא ${av.leave.min_days} יום לפחות וביוזמת המעסיק.`); }

	// 2. The daily wage and the rate.
	const base = averageDaily(av, wages);
	const ben = dailyBenefit(av, base.avg, age);
	const mx = maxDaysFor(av, age, deps, input.women === true);
	const repeatUnder = input.repeat === true && age < av.repeat.under_age;
	const capFirst = repeatUnder ? av.repeat.cap_first : av.cap.first;
	const capFor = (i) => {
		let c = i <= av.cap.first_days ? capFirst : av.cap.after;
		if (mx.womenCap && i >= av.women.cap_from_day) { c = Math.min(c, av.women.cap); }
		return c;
	};
	const benefit1 = Math.min(ben.raw, capFirst);
	const benefit2 = Math.min(ben.raw, av.cap.after);
	const benefit3 = mx.womenCap ? Math.min(ben.raw, av.women.cap) : null;
	const capped = ben.raw > capFirst;
	const maxDays = eligible ? (repeatUnder ? Math.floor(mx.days * av.repeat.days_pct / 100) : mx.days) : 0;
	const monthly = eligible ? r2(benefit1 * av.month.table_days) : 0;
	if (ben.young) { add('info', 'young', `מתחת לגיל ${av.rates.young_under} השיעורים נמוכים יותר: ${av.rates.tiers.map((t) => `${t.pct_young}%`).join(', ')} במקום ${av.rates.tiers.map((t) => `${t.pct}%`).join(', ')} (לוח ז').`, av.rates.section); }
	if (eligible && capped) { add('info', 'capped', `הסכום לפי השכר, ${ben.raw.toLocaleString('en-US')} ₪ ליום, גבוה מהתקרה: משולמים ${capFirst.toLocaleString('en-US')} ₪ ליום ב-${av.cap.first_days} ימי התשלום הראשונים.`, repeatUnder ? av.repeat.section : av.cap.section); }
	if (eligible && maxDays > av.cap.first_days && ben.raw > av.cap.after) { add('warn', 'step', `מיום התשלום ה-${av.cap.first_days + 1} התקרה יורדת לשני שלישים: ${av.cap.after.toLocaleString('en-US')} ₪ ליום במקום ${benefit1.toLocaleString('en-US')} ₪.`, av.cap.section); }
	if (eligible && mx.womenCap && maxDays >= av.women.cap_from_day && ben.raw > av.women.cap) { add('warn', 'women_cap', `מיום התשלום ה-${av.women.cap_from_day}: עד ${av.women.cap.toLocaleString('en-US')} ₪ ליום (${av.women.cap_section}).`, av.women.cap_section); }
	if (eligible && mx.women) { add('info', 'women', av.women.he, mx.section); }
	if (repeatUnder && eligible) { add('warn', 'repeat', `${av.repeat.he}. כאן: ${maxDays} ימים במקום ${mx.days}${maxDays > av.cap.first_days ? '; לימים שאחרי ה-125 המוסד לא פרסם תקרה מופחתת, והחישוב לפי התקרה הרגילה' : ''}.`, av.repeat.section); }
	if (input.repeat === true && age >= av.repeat.under_age) { add('info', 'repeat_over', `${av.repeat.over_he}. החישוב כאן מניח שלא שולמו לכם ימי אבטלה באותם 11 חודשים.`, 'סעיף 171(א)'); }
	// A month far above the others (a bonus, a final settlement) lifts the average; a month cut by illness may be swapped.
	if (each) {
		const hi = Math.max(...wages);
		const restAvg = (base.total - hi) / (wages.length - 1);
		if (restAvg > 0 && hi > restAvg * 1.5) { add('info', 'spike', `חודש אחד (${Math.round(hi).toLocaleString('en-US')} ₪) גבוה בהרבה מהאחרים: כל ההכנסה החייבת בדמי ביטוח באותו חודש נכנסת לממוצע, ולכן הוא מעלה את דמי האבטלה. ${av.base.skip_he}.`, av.base.section); }
	}
	const mwRow = registry.min_wage ? registry.min_wage.rows.filter((r) => r.from <= reg).pop() : null;
	if (mwRow && base.avg < mwRow.daily_6) { add('info', 'floor', `השכר היומי הממוצע (${base.avg.toLocaleString('en-US')} ₪) נמוך משכר המינימום היומי (${mwRow.daily_6.toLocaleString('en-US')} ₪ לשבוע של 6 ימים, מ-${heDay(mwRow.from)}). במשרה מלאה השכר היומי הממוצע לא יפחת ממנו, ובמשרה חלקית לא משכר מינימום חלקי (${av.base.floor_section}); המחשבון מחשב לפי השכר שהזנתם, כמו טבלאות המוסד.`, av.base.floor_section); }

	// 3. The dates.
	const determining = monthStart(reg);
	const windowEnd = addDays(addMonths(determining, mx.windowMonths), -1);
	const entitledFrom = ending === 'resign' ? (addDays(stop, av.resign.wait_days + 1) > reg ? addDays(stop, av.resign.wait_days + 1) : reg) : reg;
	if (addMonths(stop, av.qualify.late_months) < determining) { add('warn', 'late', `${av.qualify.late_he}. אצלכם עברו יותר מ-${av.qualify.late_months} חודשים: ימי האבטלה נספרים רק מיום הרישום, ותקופת האכשרה נבדקת ב-${av.qualify.window_months} החודשים שלפני חודש הרישום.`); }
	if (ending === 'resign' && eligible) { add('warn', 'wait90', `התפטרות בלי הצדקה: דמי אבטלה רק מ-${heDay(entitledFrom)}, אחרי ${av.resign.wait_days} ימים מיום הפסקת העבודה (${av.resign.section}). נרשמים בכל זאת מיד, כדי ששום חודש אכשרה לא יאבד. התפטרות מסיבה מוצדקת (למשל הרעה מוחשית בתנאים, בריאות, מעבר של יותר מ-60 ק"מ) מזכה מהיום הראשון.`, av.resign.section); }
	if (ending === 'leave' && eligible) { add('info', 'vacation', `${av.leave.vacation_he}. המחשבון לא מקזז ימי חופשה; אם נותרו לכם, היום הראשון לתשלום מתאחר בהתאם.`); }
	if ((ending === 'fired' || ending === 'contract') && eligible) { add('info', 'notice', 'תקופה שבעדה קיבלתם שכר בהודעה מוקדמת, או תשלום במקום הודעה מוקדמת (עד חודש), לא מזכה בדמי אבטלה; גם פדיון ימי חופשה דוחה את התשלום. המחשבון מתחיל מיום הרישום; אם קיבלתם תשלומים כאלה, התשלום הראשון יתאחר.'); }

	// 4. The ledger: from the registration day, one entry per calendar day until the last paid day.
	const days = [];
	let paid = 0;
	let unemp = 0;
	let block = -1;
	let blockDays = 0;
	let total = 0;
	let firstPaid = null;
	let stepDay = null;
	let womenStepDay = null;
	let lastPaid = null;
	let waitingCount = 0;
	let holdCount = 0;
	if (eligible) {
		for (let d = reg, guard = 0; d <= windowEnd && paid < maxDays && guard < 800; d = addDays(d, 1), guard += 1) {
			if (isSaturday(d)) { days.push({ d, k: 'sat' }); continue; }
			unemp += 1;
			const b = Math.floor(monthsFrom(determining, d) / av.waiting.every_months);
			if (b !== block) { block = b; blockDays = 0; }
			blockDays += 1;
			if (blockDays <= av.waiting.days) { days.push({ d, k: 'wait' }); waitingCount += 1; continue; }
			if (d < entitledFrom) { days.push({ d, k: 'hold' }); holdCount += 1; continue; }
			paid += 1;
			const amount = Math.min(ben.raw, capFor(paid));
			total += amount;
			if (!firstPaid) { firstPaid = d; }
			if (paid === av.cap.first_days + 1) { stepDay = d; }
			if (mx.womenCap && paid === av.women.cap_from_day) { womenStepDay = d; }
			lastPaid = d;
			days.push({ d, k: paid > av.cap.first_days ? 'paid2' : 'paid', n: paid, amount });
		}
	}
	total = r2(total);
	const unused = eligible ? maxDays - paid : 0;
	if (eligible && unused > 0) { add('warn', 'window', `${unused} ימים לא ינוצלו: את הימים מנצלים עד ${heDay(windowEnd)}, סוף ${mx.windowMonths} החודשים מה-1 בחודש הרישום (${av.days.section}).`, av.days.section); }
	const payDate = (iso) => `${addMonths(monthStart(iso), 1).slice(0, 8)}${String(av.pay.day_of_month).padStart(2, '0')}`;
	// Month rows for the picture and the table.
	const rows = [];
	for (const e of days) {
		const key = e.d.slice(0, 7);
		let row = rows[rows.length - 1];
		if (!row || row.key !== key) { row = { key, he: monthHe(key), cells: [], paid: 0, wait: 0, hold: 0, amount: 0 }; rows.push(row); }
		row.cells.push(e);
		if (e.k === 'paid' || e.k === 'paid2') { row.paid += 1; row.amount += e.amount; }
		if (e.k === 'wait') { row.wait += 1; }
		if (e.k === 'hold') { row.hold += 1; }
	}
	rows.forEach((row) => { row.amount = r2(row.amount); row.payDate = row.paid ? payDate(`${row.key}-01`) : null; });
	const lastPay = lastPaid ? payDate(lastPaid) : null;
	const firstPay = firstPaid ? payDate(firstPaid) : null;
	if (eligible && lastPaid && av.next_update && lastPaid >= av.next_update) { add('info', 'next_year', `הסכומים מ-${heDay(av.next_update)} מחושבים כאן לפי נתוני ${av.from.slice(0, 4)}: הסכום היומי הבסיסי והתקרות מתעדכנים ב-1 בינואר, וכך גם השכר היומי הממוצע של מי שכבר מקבל דמי אבטלה (סעיף 170(ד)).`, 'סעיף 170(ד)'); }

	// 5. The dates to keep.
	const deadlines = [
		{ key: 'reg', date: reg, he: 'רישום בשירות התעסוקה: ממנו מחושבים דמי האבטלה', section: 'שירות התעסוקה', url: av.register.taasuka_url },
		{ key: 'office', date: addDays(reg, av.register.office_days), he: `התייצבות בלשכת התעסוקה, לכל המאוחר ${av.register.office_days} יום אחרי הרישום באתר`, section: 'תנאי הזכאות', url: av.register.url },
		{ key: 'claim', date: addMonths(reg, av.claim.deadline_months), he: `הגשת התביעה (טופס ${av.claim.form}) והמסמכים לביטוח הלאומי, לכל המאוחר`, section: 'איך מגישים תביעה', url: av.claim.url },
	];
	if (ending === 'resign' && eligible) { deadlines.push({ key: 'entitled', date: entitledFrom, he: `סוף ${av.resign.wait_days} הימים אחרי התפטרות: מכאן דמי אבטלה`, section: av.resign.section, url: av.resign.url }); }
	if (firstPay) { deadlines.push({ key: 'first_pay', date: firstPay, he: `התשלום הראשון (ב-${av.pay.day_of_month} לחודש או בסמוך לו)`, section: 'תשלום הקצבה', url: av.pay.url }); }
	if (stepDay && ben.raw > av.cap.after) { deadlines.push({ key: 'step', date: stepDay, he: `יום התשלום ה-${av.cap.first_days + 1}: התקרה יורדת ל-${av.cap.after.toLocaleString('en-US')} ₪ ליום`, section: av.cap.section, url: av.cap.url }); }
	if (womenStepDay && ben.raw > av.women.cap) { deadlines.push({ key: 'women_step', date: womenStepDay, he: `יום התשלום ה-${av.women.cap_from_day}: עד ${av.women.cap.toLocaleString('en-US')} ₪ ליום`, section: av.women.cap_section, url: av.women.url }); }
	if (lastPaid) { deadlines.push({ key: 'last_day', date: lastPaid, he: `יום האבטלה האחרון שמשולם (יום ${paid})`, section: repeatUnder ? av.repeat.section : mx.section, url: av.days.url }); }
	if (lastPay) { deadlines.push({ key: 'last_pay', date: lastPay, he: 'התשלום האחרון הצפוי', section: 'תשלום הקצבה', url: av.pay.url }); }
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	return {
		ok: true, eligible, status: !eligible ? 'no' : ending === 'resign' ? 'wait' : 'ok',
		age, deps, ending, stop, reg, months, wageMode: each ? 'each' : 'same', wages, women: input.women === true, repeat: input.repeat === true, repeatUnder,
		gates, base, ben, benefit1, benefit2, benefit3, capFirst, capped, maxDays, baseDays: mx.days, daysSection: mx.section, mx,
		monthly, determining, windowEnd, entitledFrom, days, rows, paid, unemp, waitingCount, holdCount, unused,
		firstPaid, stepDay, womenStepDay, lastPaid, firstPay, lastPay, total, deadlines, flags,
		baseMonths: baseMonths(reg),
	};
}

/** The same person at every age band, for the side-by-side and the page table. */
export function byAge(registry, input) {
	const av = registry.rights_avtala;
	return av.days.bands.map((b) => {
		const r = compute(registry, Object.assign({}, input, { age: b.from, women: false, repeat: false }));
		return { band: b, r };
	});
}
