/**
 * Rights wave 2B (21.10.2026): the child allowance (קצבת ילדים), the savings plan for every child (חיסכון לכל ילד), the
 * supplement for the third and the fourth child, and the study grant (מענק לימודים), month by month until the youngest
 * child turns 18.
 *
 * Dependency-free ES module (dates.js only). Every number comes from the registry: the per-child amounts and the
 * income-support point are basic amount 2 in registry.rights_btl; the rules, the supplement, the study grant and the
 * savings figures in registry.rights_yeladim (the National Insurance Institute's children pages and chapter 4 of the
 * National Insurance Law, read on its checked_on date):
 *  - The amount for each child by its place in the parent's count: the first and the fifth and later child one amount, the
 *    second to the fourth a higher one (s.68(א); s.1, "the basic amount", para. (2)). Only children under 18 who are in
 *    Israel are counted (s.65), so when the eldest turns 18 every other child moves up one place.
 *  - The start: born (or arrived, or adopted) by the 15th of a month, from the 1st of that month; from the 16th, from the 1st
 *    of the next month; the end: the last day of the month in which the child turns 18 (s.72(א)).
 *  - The supplement for the third and the fourth child of a parent who receives income support, alimony through the
 *    Institute, or an old-age or survivors' pension with the income supplement (s.68(ג); the Institute's rates page).
 *  - The study grant for the published school year: a single parent, or 4 children and more with one of the listed
 *    benefits in July or August (s.74(ב), (ב1), (ב2)).
 *  - The savings plan: the monthly deposit for every month the allowance is paid, the parents' optional addition from the
 *    allowance, the grants at 3, at the bar or bat mitzvah age, at 18 (born before 2017) and at 21 (s.74ב-74ג). Deposits
 *    only: the return depends on the fund and is never computed here.
 */

import { addMonths, parseDate, fullYears, daysBetween } from './dates.js';

const blank = (v) => v === '' || v === undefined || v === null;
export const BENEFITS = ['none', 'hb', 'mz', 'hh', 'old', 'nc'];
export const MAX_KIDS = 12;
export const ORD_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'שמיני', 'תשיעי', 'עשירי', 'אחד עשר', 'שנים עשר'];
export const YL_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const heDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };

/* ---------- Months ---------- */

/** "2026-10" + n months -> "2027-02". */
export function shiftMonth(key, n) {
	const [y, m] = key.split('-').map(Number);
	const t = y * 12 + (m - 1) + n;
	return `${String(Math.floor(t / 12)).padStart(4, '0')}-${String((t % 12) + 1).padStart(2, '0')}`;
}
/** Months from a to b, both included; 0 when b is before a. */
export function monthSpan(a, b) {
	const [ay, am] = a.split('-').map(Number);
	const [by, bm] = b.split('-').map(Number);
	return Math.max(0, (by * 12 + bm) - (ay * 12 + am) + 1);
}
/** The last day of a month, as ISO. */
export function monthEnd(key) {
	const [y, m] = key.split('-').map(Number);
	return `${key}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}`;
}
/** "אוקטובר 2026" from "2026-10". */
export function ymHe(key) {
	const [y, m] = String(key).split('-').map(Number);
	return `${YL_MONTHS[m - 1] || ''} ${y}`;
}
/** The day a child reaches an age (29 February -> 28 February, as dates.js counts months). */
export function birthdayAt(birth, years) { return addMonths(birth, 12 * years); }

/** The first month of the allowance: by the cutoff day (the 15th), this month; after it, the next (s.72(א)). */
export function startMonthOf(yl, iso) {
	const day = Number(iso.slice(8, 10));
	return day <= yl.allowance.start_cutoff_day ? iso.slice(0, 7) : shiftMonth(iso.slice(0, 7), 1);
}
/** The last month of the allowance: the month in which the child turns 18 (s.72(א)). */
export function endMonthOf(yl, birth) { return shiftMonth(birth.slice(0, 7), 12 * yl.allowance.end_age); }

/** The amount for a place in the count: the second to the fourth the higher amount, the others the lower (s.68(א)). */
export function amountAt(yl, row, pos) {
	return pos >= yl.allowance.high_from && pos <= yl.allowance.high_to ? row.second_to_fourth : row.first_fifth;
}
/** The 2026 row, read from rights_btl (basic amount 2). */
export function currentRow(registry) {
	const b = registry.rights_btl.basic_amount;
	return { from: registry.rights_btl.from, first_fifth: b.b2_child_first_fifth, second_to_fourth: b.b2_child_second_to_fourth, income_support: b.b2_income_support, b3: b.b3 };
}

/**
 * One month of the family: the children in the count that month (oldest first; the same birth day keeps the order typed),
 * their place, the allowance, the supplement and the savings deposits.
 */
export function monthCalc(registry, kids, month, opts = {}) {
	const yl = registry.rights_yeladim;
	const row = opts.row || currentRow(registry);
	const sp = yl.supplement;
	const sv = yl.savings;
	const inCount = kids.filter((k) => k.start <= month && month <= k.end).sort((a, b) => (a.birth < b.birth ? -1 : a.birth > b.birth ? 1 : a.i - b.i));
	const list = inCount.map((k, j) => {
		const pos = j + 1;
		const supp = opts.supp && sp.positions.includes(pos) ? sp.amount : 0;
		return { i: k.i, pos, amount: amountAt(yl, row, pos), supp };
	});
	const allowance = list.reduce((a, x) => a + x.amount, 0);
	const supplement = list.reduce((a, x) => a + x.supp, 0);
	const n = list.length;
	return { month, list, n, allowance, supplement, total: allowance + supplement, savings: n * sv.monthly, parentAdd: opts.add ? n * sv.parent_add : 0 };
}

/** The family's monthly total for 1..n children in the count, with and without the supplement (the page table). */
export function familyTable(registry, max = 6) {
	const yl = registry.rights_yeladim;
	const row = currentRow(registry);
	const out = [];
	let sum = 0;
	let supp = 0;
	for (let n = 1; n <= max; n += 1) {
		sum += amountAt(yl, row, n);
		if (yl.supplement.positions.includes(n)) { supp += yl.supplement.amount; }
		out.push({ n, add: amountAt(yl, row, n), total: sum, withSupp: sum + supp, savings: n * yl.savings.monthly });
	}
	return out;
}

/** The quick profiles: whole families relative to a day (the browser passes today). */
export function profile(key, asOf) {
	const back = (months) => addMonths(asOf, -months);
	const kid = (months, sex = '') => ({ birth: back(months), sex, arrive: '' });
	const base = { benefit: 'none', single: false, addSave: false, asOf };
	const p = {
		one: { kids: [kid(12)] },
		three: { kids: [kid(12 * 11 + 3), kid(12 * 6 + 4), kid(12 * 2 + 7)] },
		five: { kids: [kid(12 * 15 + 2), kid(12 * 12 + 5), kid(12 * 9 + 1), kid(12 * 6 + 8), kid(12 * 3 + 3)] },
		support: { kids: [kid(12 * 14 + 1), kid(12 * 10 + 6), kid(12 * 7 + 2), kid(12 * 4 + 9)], benefit: 'hb' },
		shift: { kids: [kid(12 * 18 - 1), kid(12 * 14 + 5), kid(12 * 9 + 3)] },
	}[key];
	return p ? Object.assign({}, base, p) : null;
}

/**
 * input = { kids: [{ birth (ISO or d.m.yyyy), sex ('' | 'b' | 'g', for the bar or bat mitzvah grant only),
 *           arrive (optional: the day the child came to the family or to Israel, for an adoption or an aliyah) }],
 *           benefit ('none' | 'hb' income support | 'mz' alimony through the Institute | 'hh' old-age or survivors' pension
 *           with the income supplement | 'old' old-age or survivors' pension without it | 'nc' general disability),
 *           single (a single parent), addSave (the parents add to the savings), asOf (ISO: today; default checked_on) }
 */
export function compute(registry, input) {
	const yl = registry.rights_yeladim;
	const al = yl.allowance;
	const sv = yl.savings;
	const sp = yl.supplement;
	const sg = yl.study;
	const errors = [];
	const asOf = parseDate(input.asOf) || yl.checked_on;
	const M0 = asOf.slice(0, 7);
	const list = Array.isArray(input.kids) ? input.kids : [];
	const latest = addMonths(asOf, 9);
	const earliest = addMonths(asOf, -12 * 30);
	if (list.length > MAX_KIDS) { errors.push({ field: 'kids', he: `עד ${MAX_KIDS} ילדים במחשבון` }); }
	const kids = [];
	list.slice(0, MAX_KIDS).forEach((raw, i) => {
		const k = raw || {};
		// A row the reader just added and has not filled yet is not an error: it is skipped, and keeps its number.
		if (blank(String(k.birth || '').trim()) && blank(String(k.arrive || '').trim())) { return; }
		const birth = parseDate(k.birth);
		if (!birth) { errors.push({ field: `k${i}`, he: `ילד ${i + 1}: תאריך לידה מלא, לדוגמה 10.3.2024` }); return; }
		if (birth > latest) { errors.push({ field: `k${i}`, he: `ילד ${i + 1}: לידה צפויה עד 9 חודשים מהיום בלבד` }); return; }
		if (birth < earliest) { errors.push({ field: `k${i}`, he: `ילד ${i + 1}: יותר מ-30 שנה; לבגיר אין קצבה ואין הפקדות` }); return; }
		let arrive = '';
		if (!blank(k.arrive)) {
			arrive = parseDate(k.arrive);
			if (!arrive || arrive < birth || arrive > latest) { errors.push({ field: `a${i}`, he: `ילד ${i + 1}: יום הקבלה למשפחה או לארץ, לא לפני הלידה` }); return; }
		}
		const sex = k.sex === 'b' || k.sex === 'g' ? k.sex : '';
		kids.push({ i, birth, arrive, sex });
	});
	if (!kids.length && !errors.length) { errors.push({ field: 'kids', he: 'הקלידו תאריך לידה לפחות לילד אחד' }); }
	const benefit = BENEFITS.includes(input.benefit) ? input.benefit : (blank(input.benefit) ? 'none' : null);
	if (!benefit) { errors.push({ field: 'benefit', he: 'בחרו אם מישהו מההורים מקבל קצבה מהרשימה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const single = input.single === true;
	const addSave = input.addSave === true;
	const suppOn = sp.benefits.includes(benefit);
	const flags = [];
	const flag = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });

	// 1. Every child: its months, its status today, and its savings.
	kids.forEach((k) => {
		k.start = startMonthOf(yl, k.arrive || k.birth);
		k.end = endMonthOf(yl, k.birth);
		k.endDay = monthEnd(k.end);
		k.at18 = birthdayAt(k.birth, al.end_age);
		k.at21 = birthdayAt(k.birth, sv.free_age);
		k.age = k.birth <= asOf ? fullYears(k.birth, asOf) : null;
		k.status = k.birth > asOf || (k.arrive && k.arrive > asOf) ? 'expected' : M0 > k.end ? 'ended' : M0 < k.start ? 'waiting' : 'active';
		const fromPast = k.start > sv.deposits_from ? k.start : sv.deposits_from;
		k.monthsPast = k.start > shiftMonth(M0, -1) ? 0 : monthSpan(fromPast, M0 > k.end ? k.end : shiftMonth(M0, -1));
		k.monthsAhead = monthSpan(k.start > M0 ? k.start : M0, k.end);
		k.depositsAhead = k.monthsAhead * sv.monthly;
		k.parentAhead = addSave ? k.monthsAhead * sv.parent_add : 0;
		const grants = [];
		const g = (kind, date, amount, he, cond) => { if (date >= asOf) { grants.push({ kind, date, amount, he, cond: Boolean(cond) }); } };
		if (k.birth < sv.new_from) {
			g('g18', k.at18, sv.grant_18, `מענק גיל ${al.end_age}`);
		} else {
			g('g3', birthdayAt(k.birth, sv.grant_3_age), sv.grant_3, `מענק גיל ${sv.grant_3_age}`);
			if (k.sex === 'g') { g('mitzvah', birthdayAt(k.birth, sv.mitzvah_girl), sv.grant_mitzvah, `מענק בת מצווה, גיל ${sv.mitzvah_girl}`); }
			if (k.sex === 'b') { g('mitzvah', birthdayAt(k.birth, sv.mitzvah_boy), sv.grant_mitzvah, `מענק בר מצווה, גיל ${sv.mitzvah_boy}`); }
			if (!k.sex) { g('mitzvah', birthdayAt(k.birth, sv.mitzvah_girl), sv.grant_mitzvah, `מענק בר או בת מצווה: גיל ${sv.mitzvah_girl} לבת, ${sv.mitzvah_boy} לבן`); }
		}
		g('g21', k.at21, sv.grant_21, `מענק גיל ${sv.free_age}, אם לא נמשך כסף לפני כן`, true);
		k.grants = grants;
		k.toEighteen = k.depositsAhead + k.parentAhead + grants.filter((x) => !x.cond).reduce((a, x) => a + x.amount, 0);
		k.chooseBy = addMonths(k.birth, sv.choose_months);
		k.mustChoose = k.chooseBy >= asOf;
	});

	// 2. Today, and every month until the youngest child turns 18 (the timeline of the step chart).
	const opts = { supp: suppOn, add: addSave };
	const now = monthCalc(registry, kids, M0, opts);
	kids.forEach((k) => { const x = now.list.find((y) => y.i === k.i); k.posNow = x ? x.pos : 0; k.amountNow = x ? x.amount : 0; k.suppNow = x ? x.supp : 0; });
	const live = kids.filter((k) => k.end >= M0);
	const lastEnd = live.length ? live.map((k) => k.end).sort().pop() : null;
	const periods = [];
	let prev = null;
	let remaining = 0;
	let remainingSave = 0;
	let next12 = 0;
	let next12Save = 0;
	if (lastEnd) {
		for (let m = M0, guard = 0; m <= lastEnd && guard < 400; m = shiftMonth(m, 1), guard += 1) {
			const c = monthCalc(registry, kids, m, opts);
			remaining += c.total;
			remainingSave += c.savings;
			if (guard < 12) { next12 += c.total; next12Save += c.savings; }
			const sig = c.list.map((x) => `${x.i}:${x.pos}:${x.supp}`).join('|');
			if (prev && prev.sig === sig) {
				prev.to = m;
				prev.months += 1;
			} else {
				const before = prev ? prev.ids : [];
				const ids = c.list.map((x) => x.i);
				const left = before.filter((i) => !ids.includes(i));
				const joined = ids.filter((i) => !before.includes(i));
				prev = { sig, ids, from: m, to: m, months: 1, n: c.n, allowance: c.allowance, supplement: c.supplement, total: c.total, savings: c.savings, list: c.list, left, joined, first: !periods.length };
				periods.push(prev);
			}
		}
	}
	// 3. The next change in the coming 12 months, and why.
	const change = periods.length > 1 && monthSpan(M0, periods[1].from) <= 12 ? periods[1] : null;

	// 4. The study grant for the published school year (s.74(ב)).
	const nJA = Math.max(...sg.check_months.map((m) => monthCalc(registry, kids, m, opts).n));
	const via4 = sg.benefits4.includes(benefit) && nJA >= sg.min_children;
	const inRange = kids.filter((k) => k.birth >= sg.born_from && k.birth <= sg.born_to && k.status !== 'expected');
	const studyOn = single || via4;
	const study = {
		on: studyOn, via: single ? 'single' : via4 ? 'four' : '', nJA, kids: inRange.map((k) => k.i),
		total: studyOn ? inRange.length * sg.amount : 0, amount: sg.amount, payDate: sg.pay_date, past: sg.pay_date < asOf,
	};

	// 5. The gates, each evaluated.
	const gates = [];
	const counted = now.n;
	gates.push({ state: counted ? 'ok' : 'no', he: `${counted} ${counted === 1 ? 'ילד' : 'ילדים'} מתחת לגיל ${al.end_age} במניין, נכון ל-${ymHe(M0)}`, section: al.child_section, url: yl.pages.conditions });
	gates.push({ state: 'check', he: `הורה תושב ישראל; הילד נמצא בישראל ואינו נשוי (יציאה לחוץ לארץ עד ${al.abroad_months} חודשים לא מפסיקה את הקצבה)`, section: al.abroad_section, url: yl.pages.conditions });
	if (suppOn) {
		gates.push({ state: counted >= sp.min_children ? 'ok' : 'no', he: counted >= sp.min_children ? `התוספת לילד השלישי${counted >= 4 ? ' ולילד הרביעי' : ''}: ${sp.amount} ₪ לכל אחד` : `התוספת משולמת רק בעד הילד השלישי והרביעי במניין; כאן ${counted} ${counted === 1 ? 'ילד' : 'ילדים'}`, section: sp.section, url: sp.url });
	} else {
		gates.push({ state: 'no', he: 'התוספת לילד השלישי והרביעי: רק למי שמקבל הבטחת הכנסה, מזונות מהביטוח הלאומי, או קצבת אזרח ותיק או שאירים עם השלמת הכנסה', section: sp.section, url: sp.url });
	}
	gates.push({
		state: studyOn ? 'ok' : 'no',
		he: single ? `מענק לימודים לשנת ${sg.school_year_he}: הורה עצמאי` : via4 ? `מענק לימודים לשנת ${sg.school_year_he}: ${nJA} ילדים ביולי או באוגוסט, וקצבה מהרשימה` : sg.benefits4.includes(benefit) ? `מענק לימודים: צריך ${sg.min_children} ילדים לפחות עד גיל 18 ביולי או באוגוסט; כאן ${nJA}` : 'מענק לימודים: להורה עצמאי, או למשפחה עם 4 ילדים ויותר שמקבלת הבטחת הכנסה, מזונות, נכות כללית, אזרח ותיק או שאירים',
		section: single ? sg.section : sg.four_section, url: sg.conditions_url,
	});
	kids.filter((k) => k.mustChoose).forEach((k) => gates.push({ state: 'check', he: `ילד ${k.i + 1}: לבחור קופת גמל או בנק ומסלול לחיסכון עד ${heDay(k.chooseBy)}, אחרת ברירת המחדל`, section: sv.default_section, url: sv.new_url }));

	// 6. Flags.
	kids.filter((k) => k.status === 'expected').forEach((k) => flag('info', 'expected', `ילד ${k.i + 1} עוד לא ${k.arrive && k.birth <= asOf ? 'הגיע' : 'נולד'}: הקצבה וההפקדות מתחילות ב-${heDay(`${k.start}-01`)}, ${al.alive_he}. המספרים כאן לפי סכומי ${yl.from.slice(0, 4)}.`, al.alive_section));
	kids.filter((k) => k.status === 'waiting').forEach((k) => flag('info', 'waiting', `ילד ${k.i + 1} ${k.arrive ? 'הגיע' : 'נולד'} אחרי ה-${al.start_cutoff_day} בחודש: הקצבה מתחילה ב-1 בחודש שאחרי, ${heDay(`${k.start}-01`)}.`, al.start_section));
	kids.filter((k) => k.status === 'ended').forEach((k) => flag('info', 'ended', `ילד ${k.i + 1}: הקצבה הסתיימה ב-${heDay(k.endDay)} והוא כבר לא במניין. ${k.at21 >= asOf ? `${sv.withdraw_he}; ${sv.grant_21_he} (${heDay(k.at21)}).` : 'כל המועדים של החיסכון עברו; הכסף זמין למשיכה אצל הגוף שמנהל אותו.'}`, sv.withdraw_section));
	const dup = {};
	kids.forEach((k) => { dup[k.birth] = (dup[k.birth] || 0) + 1; });
	if (Object.values(dup).some((v) => v > 1)) { flag('info', 'twins', 'תאומים: כל אחד הוא ילד נפרד במניין, ולכל אחד מקום משלו (ולכן סכום משלו) והפקדה משלו לחיסכון.', al.section); }
	if (change) {
		const why = change.left.length ? change.left.map((i) => `לילד ${i + 1} מלאו ${al.end_age} ב-${heDay(kids.find((k) => k.i === i).at18)}`).join(', ') : change.joined.map((i) => `ילד ${i + 1} נכנס למניין`).join(', ');
		flag(change.total < now.total ? 'warn' : 'info', 'shift', `ב-${heDay(`${change.from}-01`)} הקצבה ${change.total < now.total ? 'יורדת' : 'עולה'} מ-${now.total.toLocaleString('en-US')} ל-${change.total.toLocaleString('en-US')} ₪ בחודש: ${why}${change.left.length && change.n ? ', וכל אחד מהאחרים עולה מקום במניין' : ''}.`, al.start_section);
	}
	if (!counted && !kids.some((k) => k.status === 'expected' || k.status === 'waiting')) { flag('bad', 'none', `אין החודש ילד מתחת לגיל ${al.end_age} במניין: אין קצבת ילדים.`, al.child_section); }
	if (suppOn && counted < sp.min_children) { flag('info', 'supp_short', `${sp.he}. עם ${counted} ${counted === 1 ? 'ילד' : 'ילדים'} במניין אין תוספת.`, sp.section); }
	if (kids.some((k) => k.birth < yl.legacy.born_before)) { flag('info', 'legacy', `${yl.legacy.he} (${yl.legacy.section}): ילד כזה יצא מהמניין לכל המאוחר ב-${heDay(monthEnd(endMonthOf(yl, addMonths(yl.legacy.born_before, -1))))}, ולכן הסעיף לא חל היום על אף ילד.`, yl.legacy.section); }

	// 7. The dates the law or the Institute sets, from today on.
	const deadlines = [];
	const dl = (key, date, he, section, url, k, ics = true) => { if (date && date >= asOf) { deadlines.push({ key, date, he, section, url, i: k ? k.i : -1, ics }); } };
	kids.forEach((k) => {
		const who = `ילד ${k.i + 1}`;
		if (k.status === 'expected' || k.status === 'waiting') { dl('start', `${k.start}-01`, `${who}: הקצבה וההפקדה לחיסכון מתחילות (מ-1 בחודש)`, al.start_section, al.period_url, k); }
		if (k.mustChoose) { dl('choose', k.chooseBy, `${who}: הבחירה בקופת גמל או בבנק לחיסכון, ${sv.choose_months} חודשים מהלידה`, sv.default_section, sv.new_url, k); }
		k.grants.filter((x) => x.kind === 'g3' || x.kind === 'mitzvah').forEach((x) => {
			const both = x.kind === 'mitzvah' && !k.sex;
			dl(x.kind, x.date, `${who}: ${x.he}, ${x.amount.toLocaleString('en-US')} ₪ לחיסכון${both ? ` (לבן: ${heDay(birthdayAt(k.birth, sv.mitzvah_boy))})` : ''}`, sv.grants_section, sv.url, k, !both);
		});
		dl('end18', k.endDay, `${who}: סוף קצבת הילדים (חודש גיל ${al.end_age}); מכאן אפשר למשוך את החיסכון באישור הורה${k.birth < sv.new_from ? `, ומופקד מענק של ${sv.grant_18.toLocaleString('en-US')} ₪` : ''}`, al.start_section, sv.withdraw_url, k);
		dl('g21', k.at21, `${who}: גיל ${sv.free_age}: מענק של ${sv.grant_21.toLocaleString('en-US')} ₪ אם לא נמשך כסף, ומשיכה בלי אישור הורה`, sv.withdraw_section, sv.withdraw_url, k);
	});
	if (study.on && study.total) { dl('study', sg.pay_date, `מענק לימודים לשנת ${sg.school_year_he}: ${study.kids.length} × ${sg.amount.toLocaleString('en-US')} ₪`, sg.amount_section, sg.amount_url, null); }
	deadlines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.i - b.i));

	// 8. The same children at the published amounts of the year before.
	const prevRow = yl.history.rows[0];
	const before = monthCalc(registry, kids, M0, { row: prevRow }).allowance;

	return {
		ok: true, asOf, M0, kids, now, n: counted, monthly: now.total, toBank: now.total - now.parentAdd, next12, next12Save, remaining, remainingSave,
		periods, change, lastEnd, study, gates, flags, deadlines, benefit, single, addSave, suppOn,
		compare: { prevFrom: prevRow.from, prev: before, cur: now.allowance },
		status: !counted ? 'none' : counted === 1 ? 'one' : counted <= 3 ? 'two-three' : counted <= 5 ? 'four-five' : 'six-plus',
	};
}

/** Days from today to a date (for the "in N days" hints). */
export function daysTo(asOf, iso) { return daysBetween(asOf, iso); }
