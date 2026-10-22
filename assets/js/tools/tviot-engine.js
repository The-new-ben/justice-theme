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
	const on = parseDate(input.on) || registry.checked_on;
	// The consumer-law wave (HAD-593): in the full mode, claim heads (input.heads) make the amount; with no head the
	// reader's own amount stands exactly as before.
	const kh = input.mode === 'fee' ? null : ktHeads(input.heads);
	const kx = input.mode === 'fee' ? null : ktExtra(input);
	const amount = kh && kh.any ? ktClaimed(sc, kh.total, on, input.waive) : Number(input.amount);
	if (kh) { errors.push(...kh.errors); }
	if (kx) { errors.push(...kx.errors); }
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
	// The ceiling is re-indexed every 1 January (the 2008 order, s.2(ג)). Past the registry's next_update with no
	// newer row, the old ceiling is not used for a verdict: the amount test becomes "depends" until it is refreshed.
	const ceilingUnknown = Boolean(sc.next_update && on >= sc.next_update && ceil.from < sc.next_update);
	if (ceilingUnknown) {
		flags.push({ code: 'ceiling_unknown', he: `התקרה מתעדכנת ב-1 בינואר לפי המדד. הכלי עוד לא קיבל את התקרה מ-${sc.next_update.split('-').reverse().map(Number).join('.')}, ולכן לא קובע אם הסכום מתחתיה. התקרה האחרונה שנבדקה: ${ceil.amount.toLocaleString('en-US')} ₪.` });
	}
	if (input.mode === 'fee') {
		return { ok: true, mode: 'fee', forum: amount > sc.magistrate_max ? 'district' : 'magistrate', amount, ceiling: ceil.amount, ceilingFrom: ceil.from, ceilingUnknown, overCeiling: ceilingUnknown ? null : amount > ceil.amount, fee: f.fee, onePct: f.onePct, rounded: f.rounded, floor: f.floor, flags };
	}

	const plaintiff = PLAINTIFF_KEYS.includes(input.plaintiff) ? input.plaintiff : 'individual';
	// Each condition: met (true), not met (false), or depends (null). Never a percentage.
	const conds = [];
	conds.push({ code: 'plaintiff', met: plaintiff === 'individual' || plaintiff === 'osek', sec: 's60a' });
	conds.push({ code: 'amount', met: ceilingUnknown ? null : amount <= ceil.amount, sec: 's60a1' });
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

	// Not a small claim: a money claim goes to the magistrate court up to its limit, above it to the district court.
	const forum = amount > sc.magistrate_max ? 'district' : 'magistrate';
	return ktAttach(registry, input, {
		ok: true, mode: 'full', verdict, forum, amount, plaintiff, remedy: input.remedy === 'product' ? 'product' : 'money', claims,
		ceiling: ceil.amount, ceilingFrom: ceil.from, ceilingUnknown, overCeiling: ceilingUnknown ? null : amount > ceil.amount, overBy: ceilingUnknown ? 0 : Math.max(0, Math.round((amount - ceil.amount) * 100) / 100),
		fee: f.fee, onePct: f.onePct, rounded: f.rounded, floor: f.floor, conds, dates, flags, on,
	}, kh, kx);
}
/* ---------------- The claim against a business (the consumer-law wave, 22.10.2026, HAD-593) ----------------
 * Additive: compute() keeps every field it had; in the full mode it also returns `timeline` (every dated step from the event
 * to enforcement) and, when the reader gives claim heads, `claim` (the heads, the total against the ceiling, the waiver, the
 * fee on what is claimed, the compensation of s.31A and its gates). The texts and periods come from
 * registry.consumer_ktanot (tools/justice_tools_consumer_ktanot.py): reg. 15(a) the judgment within 7 days, reg. 16(a) leave
 * to appeal in 30 days, the Courts Authority's 30 days before the Execution Office form, the Aviation Services Law s.19 (4
 * years) and s.3(a)(2) (a refund within 21 days of the written request), the Consumer Protection Law s.31A (10,000; 50,000
 * under (c)(1); the written request of (b)). The amount of every head is the reader's own; nothing here invents one. */

/** The heads, in the order of the ledger: the price or refund, an unlawful cancellation fee, repair or replacement, the
 * compensation of s.31A, the flight compensation, other expenses. */
export const KT_HEADS = ['price', 'fee', 'repair', 'comp', 'flight', 'other'];
/** Kinds of case: a defect / warranty, a flight, a subscription that kept charging, a refund not paid, not supplied, a price
 * above the shown one, other. */
export const KT_KINDS = ['def', 'flt', 'sub', 'ref', 'sup', 'prc', 'oth'];
/** The paragraphs of s.31A(a) (1, 1א, 2, 2א, 2ב, 2ב1, 2ג, 3, 4, 4א, 4ב, 5, 6, 7, 8). */
export const KT_PARS = ['1', '1a', '2', '2a', '2b', '2b1', '2c', '3', '4', '4a', '4b', '5', '6', '7', '8'];

/** The heads as numbers, in agorot then back to shekels: a blank head is no head; a negative or broken one is an error. */
export function ktHeads(heads) {
	const list = [];
	const errors = [];
	let ag = 0;
	for (const code of KT_HEADS) {
		const raw = heads ? heads[code] : undefined;
		if (raw === undefined || raw === null || raw === '') { continue; }
		const v = Number(raw);
		if (!Number.isFinite(v) || v < 0) { errors.push({ field: `head_${code}`, he: 'סכום בראש התביעה צריך להיות מספר, 0 או יותר' }); continue; }
		if (v > 100000000) { errors.push({ field: `head_${code}`, he: 'הסכום גדול מדי לבדיקה' }); continue; }
		if (v === 0) { continue; }
		const a = Math.round(v * 100);
		list.push({ code, amount: a / 100 });
		ag += a;
	}
	return { list, total: ag / 100, any: list.length > 0, errors };
}

/** What is claimed: the heads' total, or the ceiling when the reader gives up the rest (never when the ceiling is unknown). */
export function ktClaimed(sc, total, on, waive) {
	const ceil = ceilingOn(sc, on);
	if (!waive || !ceil) { return total; }
	const unknown = Boolean(sc.next_update && on >= sc.next_update && ceil.from < sc.next_update);
	return !unknown && total > ceil.amount ? ceil.amount : total;
}

/** The new inputs of the claim: its kind, the s.31A paragraph, passengers, the demand, filing and judgment days. */
export function ktExtra(input) {
	const errors = [];
	const day = (key, field, he) => {
		const raw = input[key];
		if (!raw) { return ''; }
		const iso = parseDate(raw);
		if (!iso) { errors.push({ field, he }); }
		return iso || '';
	};
	const demand = day('demandDate', 'demand', 'תאריך הדרישה בכתב לא תקין. לדוגמה: 15.3.2026');
	const filing = day('filingDate', 'filing', 'יום ההגשה לא תקין. לדוגמה: 1.11.2026');
	const judgment = day('judgmentDate', 'judgment', 'יום פסק הדין לא תקין. לדוגמה: 15.2.2027');
	let passengers = 0;
	if (input.passengers !== undefined && input.passengers !== null && input.passengers !== '') {
		passengers = Number(input.passengers);
		if (!(Number.isInteger(passengers) && passengers >= 1 && passengers <= 500)) { errors.push({ field: 'passengers', he: 'מספר הנוסעים: מספר שלם, 1 או יותר' }); passengers = 0; }
	}
	const kind = KT_KINDS.includes(input.kind) ? input.kind : '';
	const par = KT_PARS.includes(String(input.compPar || '')) ? String(input.compPar) : '';
	return { errors, demand, filing, judgment, passengers, kind, par };
}

const ktOrder = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

/** Every dated step of the case, from the event to enforcement: the wave-1 dates plus the claim's own. A step that rests on
 * an assumption (the judgment given at the hearing, in the parties' presence) is marked cond. */
export function ktTimeline(registry, input, r, kx) {
	const k = registry.consumer_ktanot || {};
	const sc = registry.small_claims;
	const event = input.eventDate ? parseDate(input.eventDate) : null;
	const flt = kx.kind === 'flt' && Boolean(k.aviation);
	const tl = [];
	const push = (code, date, extra) => { if (date) { tl.push(Object.assign({ code, date, cond: false }, extra || {})); } };
	push('event', event);
	push('demand', kx.demand);
	if (flt && kx.demand) { push('refund21', addDays(kx.demand, k.aviation.refund_days)); }
	push('filing', kx.filing);
	for (const d of r.dates) { if (d.code !== 'limitation') { push(d.code, d.date); } }
	const hearing = (r.dates.find((d) => d.code === 'hearing') || {}).date || '';
	const rg = k.regs;
	if (rg) {
		if (kx.judgment) { push('judgment', kx.judgment); } else if (hearing) { push('judgment_latest', addDays(hearing, rg.judgment_max_days)); }
		const base = kx.judgment || hearing;
		if (base) {
			push('appeal', addDays(base, rg.appeal_days), { cond: !kx.judgment });
			if (k.execution) { push('execution', addDays(base, k.execution.after_days), { cond: !kx.judgment }); }
		}
	}
	if (event) {
		const years = flt ? k.aviation.limitation_years : sc.limitation_years;
		push('limitation', addYears(event, years), { years, aviation: flt });
	}
	tl.sort(ktOrder);
	for (const e of tl) { e.past = e.date < r.on; e.soon = !e.past && ms(e.date) - ms(r.on) <= 30 * DAY; }
	return tl;
}

/** The claim and its gates, attached to the full-mode result. Never removes or changes a field compute() had. */
export function ktAttach(registry, input, r, kh, kx) {
	if (!kh || !kx) { return r; }
	r.timeline = ktTimeline(registry, input, r, kx);
	r.claim = null;
	if (!kh.any) { return r; }
	const k = registry.consumer_ktanot || {};
	const sc = registry.small_claims;
	const ex = k.exemplary;
	const kind = kx.kind || 'oth';
	const total = kh.total;
	const over = r.ceilingUnknown ? null : total > r.ceiling;
	const overBy = over ? Math.round((total - r.ceiling) * 100) / 100 : 0;
	const waive = Boolean(input.waive);
	const waived = waive && over ? overBy : 0;
	const compHead = kh.list.find((h) => h.code === 'comp');
	const comp = compHead ? { amount: compHead.amount, par: kx.par, overMax: Boolean(ex) && compHead.amount > ex.max, overAggravated: Boolean(ex) && compHead.amount > ex.aggravated_max } : null;
	const claim = {
		kind, par: kx.par, passengers: kx.passengers, heads: kh.list, total, claimed: r.amount, over, overBy, waive, waived,
		fee: r.fee, feeIfWaived: over ? fee(sc, r.ceiling).fee : r.fee, comp, demand: kx.demand, filing: kx.filing, judgment: kx.judgment, flags: [],
	};
	const flag = (code, he, extra) => { const f = Object.assign({ code, he }, extra || {}); claim.flags.push(f); r.flags.push(f); };
	const nis = (n) => `${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })} ₪`;
	if (over && !waive) {
		flag('kt_over_ceiling', `ראשי התביעה מגיעים ל-${nis(total)}, ${nis(overBy)} מעל התקרה. אפשר לוותר על היתרה ולתבוע ${nis(r.ceiling)}, או לתבוע הכול בבית משפט השלום בסדר דין רגיל.`);
	}
	if (waived) {
		flag('kt_waived', `ויתרתם על ${nis(waived)} כדי להיכנס לתקרה. את היתרה אי אפשר לתבוע אחר כך בנפרד בלי רשות בית המשפט.`, k.splitting ? { section: k.splitting.section, url: k.splitting.url } : {});
	}
	if (waive && r.ceilingUnknown) { flag('kt_waive_unknown', 'התקרה החדשה מ-1 בינואר עוד לא נטענה לכלי, ולכן הוא לא מקצץ את הסכום. בדקו את התקרה באתר הרשות השופטת.'); }
	if (comp && ex) {
		if (!kx.par) { flag('kt_comp_no_par', 'פיצויים לדוגמה ניתנים רק על הפרה של אחת ההוראות שבסעיף 31א(א). בחרו את הפסקה שעליה נשענת הבקשה.', { section: ex.max_section, url: ex.url }); }
		if (comp.overAggravated) {
			flag('kt_comp_over_law', `הפיצויים לדוגמה שביקשתם (${nis(comp.amount)}) מעל ${nis(ex.aggravated_max)}, הסכום הגבוה ביותר שהחוק מאפשר.`, { section: ex.aggravated_section, url: ex.url });
		} else if (comp.overMax) {
			flag('kt_comp_over_max', `מעל ${nis(ex.max)} בית המשפט רשאי לפסוק רק בהפרה חוזרת, הפרה נמשכת או נסיבות מחמירות, ועד ${nis(ex.aggravated_max)}.`, { section: ex.aggravated_section, url: ex.url });
		}
		if (!kx.demand) { flag('kt_demand_missing', 'לפני תביעה לפיצויים לדוגמה צריך לשלוח לעסק בקשה בכתב (גם בדואר אלקטרוני). הזינו את יום הדרישה, או שלחו אותה לפני ההגשה.', { section: ex.demand_section, url: ex.url }); }
	}
	if (kx.demand && kx.filing && kx.demand > kx.filing) { flag('kt_demand_after_filing', 'יום הדרישה בכתב מאוחר מיום ההגשה: הדרישה צריכה לבוא לפני התביעה.', ex ? { section: ex.demand_section, url: ex.url } : {}); }
	if (kx.judgment && r.dates.some((d) => d.code === 'hearing' && d.date > kx.judgment)) { flag('kt_judgment_before_hearing', 'יום פסק הדין שהזנתם מוקדם ממועד הדיון. בדקו את התאריכים.'); }
	if (kind === 'flt' && k.aviation) {
		if (!kh.list.some((h) => h.code === 'flight')) { flag('kt_flight_no_comp', 'בתביעה על טיסה אין כאן עדיין פיצוי כספי לפי החוק. מחשבים אותו לפי המרחק, ההודעה והשעות, ומוסיפים כראש תביעה.', { section: 'סעיף 6(א)(3) לחוק שירותי תעופה', url: k.aviation.url }); }
		if (kx.passengers > 1) { flag('kt_flight_plaintiffs', `${kx.passengers} נוסעים: כל נוסע בגיר הוא בעל הזכות שלו ותובע בעצמו. תביעה מכוח זכות שהומחתה לא נדונה בתביעות קטנות.`, { section: 'סעיף 60(א) לחוק בתי המשפט', url: sc.law_url }); }
		const lim = r.timeline.find((e) => e.code === 'limitation');
		if (lim && lim.date <= r.on) { flag('kt_limitation_passed', `עברו ${k.aviation.limitation_years} שנים מיום הטיסה: תביעה לפי חוק שירותי תעופה מתיישנת בתוך ${k.aviation.limitation_years} שנים.`, { section: `${k.aviation.limitation_section} לחוק שירותי תעופה`, url: k.aviation.url }); }
	}
	if (kx.passengers > sc.online_max_plaintiffs) { flag('kt_manual_filing', `בהגשה מקוונת אפשר עד ${sc.online_max_plaintiffs} תובעים. עם יותר תובעים מגישים במזכירות בית המשפט.`, { section: 'הרשות השופטת', url: sc.service_url }); }
	r.claim = claim;
	return r;
}

/** A band for analytics: never an amount. */
export function ktBand(r) {
	if (!r || !r.ok) { return 'error'; }
	if (!r.claim) { return r.mode === 'fee' ? 'fee' : r.verdict; }
	return `claim_${r.claim.kind}_${r.claim.over && !r.claim.waive ? 'over' : r.verdict}`;
}
