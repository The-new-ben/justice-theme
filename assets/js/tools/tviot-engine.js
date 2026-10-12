/**
 * T05 engine: small claims — does the claim fit, the fee, the deadlines, the claim's structure (HAD-490).
 *
 * Dependency-free ES module. Every number comes from registry.small_claims, checked against the
 * official source on the registry's checked_on date:
 *  - Who may sue and for what: חוק בתי המשפט [נוסח משולב], התשמ"ד-1984, s.60(א) (an individual; money
 *    up to the ceiling, or replacing/repairing a product or cancelling a deal up to that value; not by
 *    an assigned right; not in another court's exclusive jurisdiction) and s.60(ב) (more than five
 *    claims a year in the same court: the court may transfer the claim).
 *  - Ceiling: 39,900 ₪ from 1.1.2026 (notice of the Director of Courts, 22.12.2025).
 *  - Fee: 1% of the claim, rounded UP to a multiple of 5 ₪, never below 50 ₪ (reg. 6(א)(1)-(3),
 *    תקנות שיפוט בתביעות קטנות (סדרי דין), התשל"ז-1976).
 *  - Deadlines: defence 30 days from service (reg. 4(ב)); a claim not served by the court 60 days
 *    before the hearing is served by the plaintiff at least 40 days before it (reg. 7(ב1)); setting
 *    aside a decision given in one's absence: 30 days (reg. 12); limitation 7 years from the day the
 *    cause arose (חוק ההתיישנות, s.5(1), s.6). Witness summons (60 days) and interpreter (7 days): the
 *    Courts Authority's filing page.
 */

const DAY = 86400000;
const ms = (iso) => Date.parse(`${iso}T00:00:00Z`);
const isoOf = (t) => new Date(t).toISOString().slice(0, 10);
export function addDays(iso, n) { return isoOf(ms(iso) + n * DAY); }
export function addYears(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const last = new Date(Date.UTC(y + n, m, 0)).getUTCDate();
	return `${String(y + n).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

export function parseDate(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	let y; let mo; let d;
	if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
		m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
		if (!m) { return null; }
		d = +m[1]; mo = +m[2]; y = +m[3];
		if (y < 100) { y += y >= 70 ? 1900 : 2000; }
	}
	const t = Date.UTC(y, mo - 1, d);
	const back = new Date(t);
	if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) { return null; }
	return isoOf(t);
}

/** The ceiling in force on a date. */
export function ceilingOn(sc, isoDate) {
	let row = null;
	for (const r of sc.ceiling) { if (r.from <= isoDate) { row = r; } }
	return row;
}

/** Reg. 6(א): 1% of the claim, rounded up to a multiple of 5 ₪, and never below 50 ₪. Works in agorot. */
export function fee(sc, amount) {
	const agorot = Math.round(Number(amount) * 100);
	const onePct = agorot * sc.fee.pct / 100; // in agorot, may be fractional
	const step = sc.fee.round_up_to * 100;
	const rounded = Math.ceil(onePct / step - 1e-9) * step;
	const min = sc.fee.min * 100;
	return { onePct: Math.round(onePct) / 100, rounded: rounded / 100, fee: Math.max(rounded, min) / 100, floor: rounded < min };
}

const PLAINTIFF_KEYS = ['individual', 'osek', 'company', 'other_body'];

/**
 * input = { mode: 'full'|'fee', amount, plaintiff, remedy: 'money'|'product', assigned: bool,
 *           labor: bool (a dispute between employee and employer), claimsThisYear, on (the filing day),
 *           eventDate, hearingDate, servedDate }
 */
export function compute(registry, input) {
	const sc = registry.small_claims;
	const errors = [];
	const flags = [];
	const amount = Number(input.amount);
	const on = parseDate(input.on) || registry.checked_on;
	if (!(amount > 0)) { errors.push({ field: 'amount', he: 'סכום התביעה צריך להיות גדול מ-0' }); }
	if (amount > 100000000) { errors.push({ field: 'amount', he: 'הסכום גדול מדי לבדיקה' }); }
	const ceil = ceilingOn(sc, on);
	if (!ceil) { return { ok: false, outOfScope: true, errors: [{ field: 'on', he: 'אין בכלי תקרה לתאריך הזה.' }] }; }
	const event = input.eventDate ? parseDate(input.eventDate) : null;
	const hearing = input.hearingDate ? parseDate(input.hearingDate) : null;
	const served = input.servedDate ? parseDate(input.servedDate) : null;
	if (input.eventDate && !event) { errors.push({ field: 'event', he: 'תאריך האירוע לא תקין. לדוגמה: 1.3.2026' }); }
	if (input.hearingDate && !hearing) { errors.push({ field: 'hearing', he: 'מועד הדיון לא תקין. לדוגמה: 15.2.2027' }); }
	if (input.servedDate && !served) { errors.push({ field: 'served', he: 'תאריך המסירה לא תקין' }); }
	const claims = input.claimsThisYear === undefined || input.claimsThisYear === '' ? 0 : Number(input.claimsThisYear);
	if (!(Number.isInteger(claims) && claims >= 0 && claims <= 999)) { errors.push({ field: 'claims', he: 'מספר התביעות צריך להיות מספר שלם, 0 או יותר' }); }
	if (errors.length) { return { ok: false, errors }; }

	const f = fee(sc, amount);
	if (input.mode === 'fee') {
		return { ok: true, mode: 'fee', amount, ceiling: ceil.amount, ceilingFrom: ceil.from, overCeiling: amount > ceil.amount, fee: f.fee, onePct: f.onePct, rounded: f.rounded, floor: f.floor, flags };
	}

	const plaintiff = PLAINTIFF_KEYS.includes(input.plaintiff) ? input.plaintiff : 'individual';
	// Each condition: met (true), not met (false), or depends (null). Never a percentage.
	const conds = [];
	conds.push({ code: 'plaintiff', met: plaintiff === 'individual' || plaintiff === 'osek', sec: 's60a' });
	conds.push({ code: 'amount', met: amount <= ceil.amount, sec: 's60a1' });
	conds.push({ code: 'remedy', met: true, sec: input.remedy === 'product' ? 's60a2' : 's60a1' });
	conds.push({ code: 'assigned', met: !input.assigned, sec: 's60a' });
	conds.push({ code: 'exclusive', met: !input.labor, sec: 's60a' });
	conds.push({ code: 'claims', met: claims < sc.max_claims_per_year ? true : null, sec: 's60b' });
	const hardNo = conds.some((c) => c.met === false);
	const soft = conds.some((c) => c.met === null);
	const verdict = hardNo ? 'no' : (soft ? 'depends' : 'yes');

	const dl = sc.deadlines;
	const dates = [];
	if (event) {
		dates.push({ code: 'limitation', date: addYears(event, sc.limitation_years), from: event, rule: 'limitation' });
		if (addYears(event, sc.limitation_years) <= on) {
			flags.push({ code: 'limitation_passed', he: `עברו ${sc.limitation_years} שנים מיום האירוע. תביעה כזאת עלולה להידחות בטענת התיישנות (חוק ההתיישנות, סעיף 5(1)).` });
		}
	}
	if (served) { dates.push({ code: 'defence', date: addDays(served, dl.defence_days), from: served, rule: 'defence' }); }
	if (hearing) {
		dates.push({ code: 'service_check', date: addDays(hearing, -dl.service_check_days_before), from: hearing, rule: 'service_check' });
		dates.push({ code: 'witness', date: addDays(hearing, -dl.witness_request_days_before), from: hearing, rule: 'witness' });
		dates.push({ code: 'plaintiff_service', date: addDays(hearing, -dl.plaintiff_service_days_before), from: hearing, rule: 'plaintiff_service' });
		dates.push({ code: 'interpreter', date: addDays(hearing, -dl.interpreter_days_before), from: hearing, rule: 'interpreter' });
		dates.push({ code: 'hearing', date: hearing, from: hearing, rule: 'hearing' });
		if (hearing <= on) { flags.push({ code: 'hearing_past', he: 'מועד הדיון שהזנתם כבר עבר.' }); }
	}
	dates.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	for (const d of dates) { d.past = d.date < on; d.soon = !d.past && ms(d.date) - ms(on) <= 30 * DAY; }

	return {
		ok: true, mode: 'full', verdict, amount, plaintiff, remedy: input.remedy === 'product' ? 'product' : 'money', claims,
		ceiling: ceil.amount, ceilingFrom: ceil.from, overCeiling: amount > ceil.amount, overBy: Math.max(0, Math.round((amount - ceil.amount) * 100) / 100),
		fee: f.fee, onePct: f.onePct, rounded: f.rounded, floor: f.floor, conds, dates, flags, on,
	};
}
