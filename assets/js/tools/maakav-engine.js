/**
 * Child-support payment tracker (the divorce world, HAD-539): the instalments a judgment or an approved agreement
 * makes due, month after month, the CPI updates it carries, what was actually paid, and the arrears with linkage and
 * interest, ready for a demand letter.
 *
 * Dependency-free ES module. Every number comes from the registry:
 *  - Indexation: the amount is updated every N months by the index known on the update day over the index known on
 *    the base day (registry.child_support.indexation; the CPI series and the CBS chaining of registry.cpi), through the
 *    wave-1 linkage engine (hatzmada-engine.linkAmount), which is golden against the CBS calculator.
 *  - Arrears: each unpaid instalment carries linkage and linked interest from its due day (Interest Adjudication Law
 *    1961, ss.1 and 4א, as in force from 1.1.2025) through hatzmada-engine.compute(mode 'linked'). Arrears fees of
 *    s.5א and the Execution Office's own fees are added in an Execution Office file, not here.
 *  - Payments are allocated to the oldest open instalment first (the ordinary rule for a running account).
 * Nothing here is sent anywhere: the page keeps the log in the browser only.
 */
import { fIsIso, fAddMonths, fR2 } from './family-common.js';
import { compute, linkAmount } from './hatzmada-engine.js';

export const MK_EVERY = [0, 3, 6, 12];
const mkIsoHe = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const mkMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** The due days from the first one up to asOf (inclusive), on the chosen day of the month. */
export function mkDueDays(first, asOf) {
	const out = [];
	for (let i = 0; i < 600; i += 1) {
		const day = fAddMonths(first, i);
		if (day > asOf) { break; }
		out.push(day);
	}
	return out;
}

/** The amount due on a day: the judgment amount updated on every anniversary of the base day that has passed. */
export function mkAmountOn(registry, amount, base, every, day) {
	if (!every) { return { amount: fR2(amount), update: null, factor: 1 }; }
	let update = null;
	for (let i = 1; i < 400; i += 1) {
		const d = fAddMonths(base, every * i);
		if (d > day) { break; }
		update = d;
	}
	if (!update) { return { amount: fR2(amount), update: null, factor: 1 }; }
	const linked = linkAmount(registry, amount, base, update, 'known');
	if (linked === null) { return { amount: fR2(amount), update, factor: 1, stale: true }; }
	return { amount: fR2(linked), update, factor: Math.round((linked / amount) * 10000) / 10000 };
}

/**
 * input = { amount (the monthly amount in the judgment), base (ISO: the judgment or agreement day, the base index),
 *           first (ISO: the first due day in the log), every (0 | 3 | 6 | 12 months), asOf (ISO),
 *           payments: [{ date, amount, note }], meta: { creditor, debtor, file } (names for the letter only) }
 */
export function mkTrack(registry, input) {
	const errors = [];
	const amount = Number(input.amount);
	const asOf = fIsIso(input.asOf) ? input.asOf : registry.child_support.checked_on;
	const every = MK_EVERY.includes(Number(input.every)) ? Number(input.every) : registry.child_support.indexation.every_months;
	if (!(amount > 0 && amount < 1e7)) { errors.push({ field: 'amount', he: 'סכום המזונות לחודש: מספר חיובי' }); }
	if (!fIsIso(input.base)) { errors.push({ field: 'base', he: 'תאריך פסק הדין או ההסכם לא תקין. לדוגמה: 10.1.2024' }); }
	if (!fIsIso(input.first)) { errors.push({ field: 'first', he: 'התשלום הראשון במעקב: תאריך לא תקין. לדוגמה: 10.1.2026' }); }
	if (!errors.length && input.first < input.base) { errors.push({ field: 'first', he: 'התשלום הראשון לא יכול להיות לפני פסק הדין' }); }
	if (!errors.length && input.first > asOf) { errors.push({ field: 'first', he: 'התשלום הראשון עוד לא הגיע: אין מה לעקוב' }); }
	const payments = [];
	(input.payments || []).forEach((p, i) => {
		const date = p && p.date ? String(p.date) : '';
		const sum = p && p.amount !== '' && p.amount !== undefined && p.amount !== null ? Number(p.amount) : NaN;
		if (!date && Number.isNaN(sum)) { return; }
		if (!fIsIso(date) || !(sum > 0)) { errors.push({ field: `payment-${i}`, he: `תשלום ${i + 1}: ${fIsIso(date) ? 'הסכום צריך להיות גדול מ-0' : 'התאריך לא תקין'}` }); return; }
		if (date > asOf) { errors.push({ field: `payment-${i}`, he: `תשלום ${i + 1}: תאריך עתידי` }); return; }
		payments.push({ date, amount: fR2(sum), note: p.note ? String(p.note).slice(0, 80) : '' });
	});
	if (errors.length) { return { ok: false, errors }; }
	payments.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	const flags = [];
	// An instalment is late from the day after its due day: due today is not yet arrears.
	const rows = mkDueDays(input.first, asOf).map((due) => {
		const a = mkAmountOn(registry, amount, input.base, every, due);
		if (a.stale) { flags.push({ code: 'index', he: `המדד הדרוש לעדכון של ${mkIsoHe(a.update)} עוד לא בסדרה: הסכום הוצג בלי העדכון הזה.` }); }
		return { due, amount: a.amount, update: a.update, factor: a.factor, paid: 0, onTime: 0, later: [], open: a.amount, late: due < asOf, linkage: 0, interest: 0, total: a.amount };
	});
	// Payments oldest first, each to the oldest instalment still open, keeping its own day: paid on or before the due
	// day it reduces the principal before any interest runs; paid later it goes into that instalment's running balance
	// on the day it was paid, so the days in between carry linkage and interest (Codex review, PR 137).
	let unallocated = 0;
	for (const p of payments) {
		let left = p.amount;
		for (const r of rows) {
			if (left <= 0) { break; }
			if (r.open <= 0) { continue; }
			const take = Math.min(left, r.open);
			r.open = fR2(r.open - take);
			r.paid = fR2(r.paid + take);
			left = fR2(left - take);
			if (p.date <= r.due) { r.onTime = fR2(r.onTime + take); } else { r.later.push({ date: p.date, amount: take }); }
		}
		unallocated = fR2(unallocated + left);
	}
	// Arrears: linkage and linked interest on what was still owed after the due day, from that day to asOf, with the
	// late payments applied on their days (the law from 1.1.2025; the wave-1 engine).
	const regime = registry.interest.regime_start;
	let oldLaw = false;
	let ratesMissing = false;
	for (const r of rows) {
		const principal = fR2(r.amount - r.onTime);
		r.total = r.open;
		if (!r.late || principal <= 0) { continue; }
		const x = compute(registry, { principal, start: r.due, end: asOf, mode: 'linked', payments: r.later });
		if (x.ok) {
			r.linkage = fR2(x.linkage || 0);
			r.interest = fR2(x.interest || 0);
			r.total = fR2(Math.max(0, x.total));
			if (r.due < regime) { oldLaw = true; }
		} else {
			ratesMissing = true;
		}
	}
	const late = rows.filter((r) => r.late);
	const totals = {
		due: fR2(rows.reduce((s, r) => s + r.amount, 0)),
		paid: fR2(rows.reduce((s, r) => s + r.paid, 0)),
		open: fR2(late.reduce((s, r) => s + r.open, 0)),
		upcoming: fR2(rows.filter((r) => !r.late).reduce((s, r) => s + r.open, 0)),
		linkage: fR2(late.reduce((s, r) => s + r.linkage, 0)),
		interest: fR2(late.reduce((s, r) => s + r.interest, 0)),
		total: fR2(late.reduce((s, r) => s + r.total, 0)),
		credit: unallocated,
		openCount: late.filter((r) => r.open > 0).length,
		lateCount: late.filter((r) => r.open <= 0 && r.total > 0).length,
	};
	if (unallocated > 0) { flags.push({ code: 'credit', he: `שולם ${mkMoney(unallocated)} ₪ יותר מהמגיע עד היום: יתרת זכות לתשלום הבא.` }); }
	if (totals.upcoming > 0 && totals.open <= 0) { flags.push({ code: 'today', he: `תשלום של ${mkMoney(totals.upcoming)} ₪ מגיע היום: עוד לא בפיגור.` }); }
	if (oldLaw) { flags.push({ code: 'old_law', he: 'תשלומים שמועדם לפני 1.1.2025: לימים האלה חל הנוסח הקודם של חוק פסיקת ריבית והצמדה, והכלי מחשב להם הצמדה בלבד.' }); }
	if (ratesMissing) { flags.push({ code: 'rates', he: 'לחלק מהתשלומים לא חושבו הצמדה וריבית: שיעורי הריבית ידועים רק עד סוף הרבעון האחרון שפרסם החשב הכללי.' }); }
	// The next update of the amount.
	let next = null;
	if (every) {
		for (let i = 1; i < 400; i += 1) {
			const d = fAddMonths(input.base, every * i);
			if (d > asOf) { next = d; break; }
		}
	}
	const current = mkAmountOn(registry, amount, input.base, every, asOf);
	const nextDue = fAddMonths(input.first, rows.length);
	return {
		ok: true, amount: fR2(amount), base: input.base, first: input.first, every, asOf, payments, rows, totals, flags,
		current: current.amount, currentUpdate: current.update, factor: current.factor, next, nextDue,
		meta: { creditor: mkStr(input.meta && input.meta.creditor), debtor: mkStr(input.meta && input.meta.debtor), file: mkStr(input.meta && input.meta.file) },
	};
}
const mkStr = (v) => (v ? String(v).slice(0, 80) : '');

/** The demand letter, from the open instalments. Names only where the user typed them; nothing is stored. */
export function mkLetter(registry, r) {
	if (!r.ok) { return ''; }
	const cs = registry.child_support;
	const open = r.rows.filter((x) => x.open > 0 && x.late);
	const paidLate = r.rows.filter((x) => x.late && x.open <= 0 && x.total > 0);
	const to = r.meta.debtor || '_______________';
	const from = r.meta.creditor || '_______________';
	const file = r.meta.file ? ` (${r.meta.file})` : '';
	const lines = [
		`תאריך: ${mkIsoHe(r.asOf)}`,
		'',
		`לכבוד ${to}`,
		'',
		`הנדון: דרישה לתשלום מזונות שלא שולמו${file}`,
		'',
		`1. על פי פסק הדין / ההסכם המאושר מיום ${mkIsoHe(r.base)} עליך לשלם מזונות בסך ${mkMoney(r.amount)} ₪ לחודש${r.every ? `, צמודים למדד המחירים לצרכן ומתעדכנים כל ${r.every} חודשים` : ''}. ${r.every && r.currentUpdate ? `הסכום המעודכן מיום ${mkIsoHe(r.currentUpdate)} הוא ${mkMoney(r.current)} ₪ לחודש.` : ''}`,
		`2. עד היום לא שולמו ${open.length} תשלומים, כמפורט:`,
	];
	for (const x of open) {
		lines.push(`   - מועד ${mkIsoHe(x.due)}: מגיע ${mkMoney(x.amount)} ₪${x.paid ? `, שולם ${mkMoney(x.paid)} ₪` : ''}, חסר ${mkMoney(x.open)} ₪; בצירוף הפרשי הצמדה וריבית עד ${mkIsoHe(r.asOf)}: ${mkMoney(x.total)} ₪.`);
	}
	if (paidLate.length) {
		lines.push(`   - תשלומים ששולמו באיחור (${paidLate.map((x) => mkIsoHe(x.due)).join(', ')}): הפרשי הצמדה וריבית על ימי האיחור: ${mkMoney(paidLate.reduce((s, x) => s + x.total, 0))} ₪.`);
	}
	lines.push(
		`3. סך החוב ליום ${mkIsoHe(r.asOf)}: ${mkMoney(r.totals.open)} ₪ קרן, ובצירוף הפרשי הצמדה וריבית לפי חוק פסיקת ריבית והצמדה, התשכ"א-1961: ${mkMoney(r.totals.total)} ₪.`,
		'4. הנך נדרש/ת לשלם את מלוא הסכום בתוך 7 ימים מקבלת מכתב זה.',
		'5. לא ישולם החוב במועד, אפתח תיק בלשכת ההוצאה לפועל במסלול מזונות, ואפעל לקבלת התשלום גם מהמוסד לביטוח לאומי לפי חוק המזונות (הבטחת תשלום), התשל"ב-1972, והכול בלי לגרוע מכל זכות אחרת.',
		'',
		`בכבוד רב,`,
		from,
		'',
		`(נוסח כללי שהוכן ב-jus-tice.co.il לפי ${cs.indexation.he.split(';')[0]}; לא ייעוץ משפטי. ההצמדה והריבית חושבו לפי הנתונים שהוקלדו.)`,
	);
	return lines.join('\n');
}

/** The log, for export: settings and payments only (no names). */
export function mkExport(input) {
	return JSON.stringify({ v: 1, tool: 'maakav-mezonot', amount: input.amount, base: input.base, first: input.first, every: input.every, payments: (input.payments || []).map((p) => ({ date: p.date, amount: p.amount, note: p.note || '' })) }, null, 1);
}

/** Reverse of mkExport: a saved log, checked field by field; null when it is not ours. */
export function mkImport(text) {
	let j = null;
	try { j = JSON.parse(String(text)); } catch (e) { return null; }
	if (!j || j.tool !== 'maakav-mezonot' || !Array.isArray(j.payments)) { return null; }
	return {
		amount: Number(j.amount) || '', base: fIsIso(j.base) ? j.base : '', first: fIsIso(j.first) ? j.first : '',
		every: MK_EVERY.includes(Number(j.every)) ? Number(j.every) : 3,
		payments: j.payments.slice(0, 400).map((p) => ({ date: fIsIso(p && p.date) ? p.date : '', amount: p && p.amount !== undefined ? Number(p.amount) : '', note: p && p.note ? String(p.note).slice(0, 80) : '' })),
	};
}
