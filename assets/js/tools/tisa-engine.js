/**
 * The consumer-law wave (22.10.2026, HAD-593): the flight-disruption instrument of the Aviation Services Law (pitzui-tisa,
 * /law-compensation-cancellation-2012/).
 *
 * Dependency-free ES module on top of dates.js, the road engine's limitation() (teuna-engine.js, bundled as TE: the war
 * window of the Limitation Law and the rest-day move, applied to the 4 years of s.19 through s.15A(e)) and the small-claims
 * engine (tviot-engine.js, bundled as TV: the ceiling in force and the fee of reg. 6(a)). Every number comes from the
 * registry: reg.consumer_tisa (the law, each rule with its section), reg.car_accident.limitation (the war window, rest
 * days), reg.small_claims (the ceiling and the fee).
 *  - What happened: a cancelled flight (s.6), a delayed departure (s.7; 8 hours or more is a cancelled flight by the
 *    definition of s.1, 3 hours on a domestic flight, reg. 1), denied boarding (s.5), a departure brought forward (s.8), a
 *    downgrade (s.9 and the Second Schedule).
 *  - The gates of s.2: checking in on time (not needed for a cancelled flight), a free or non-public fare, a transfer that
 *    still landed on time.
 *  - The money compensation of the First Schedule by the distance band (s.12: the great-circle distance) and the number of
 *    passengers; the notice exemptions of s.6(c) (14 days; 7-14 days and 2/4 hours; under 7 days and 1/2 hours) and s.6(d);
 *    the halving of s.6(b) and s.5(c) when an alternative ticket was accepted; the exemptions of s.6(e) as the airline's to
 *    prove (s.6(g) for the notice); the war-time temporary order (SH 3372, s.2(a)-(b)); s.20 (a benefit under a foreign law).
 *  - The refund (s.3(a)(2), 21 days; the round trip and the package of s.3(b)), the alternative ticket, the assistance by
 *    the hours of delay (s.3(a)(1), s.7), the downgrade percentage (21 days from the flight), the 45 days to pay the
 *    compensation (s.3(a)(4)), the 4-year limitation (s.19), the small claim and its fee.
 *  - The domestic regulations: the base amounts of 2013 with their date; the tool never computes their linkage.
 * Never a verdict: an exemption the airline raises is the airline's to prove, and the result says so.
 * Every top-level helper starts with "ts": the bundle concatenates this file with instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, daysBetween, parseDate, offRestDays } from './dates.js';
import * as TE from './teuna-engine.js';
import * as TV from './tviot-engine.js';

export const TS_TYPES = ['intl', 'domestic'];
export const TS_EVENTS = ['cancel', 'delay', 'denied', 'advance', 'downgrade'];
export const TS_BANDS = ['b1', 'b2', 'b3'];
export const TS_LINES = ['eilat', 'north', 'other'];
export const TS_CHOICES = ['refund', 'alt', 'flew'];
export const TS_LEGS = ['one', 'out', 'back'];
export const TS_EXEMPT = ['none', 'extraordinary', 'strike', 'shabbat'];
export const TS_DENIED = ['overbooking', 'security', 'health', 'documents'];
export const TS_DOWN = ['fb', 'be', 'fe'];
export const TS_CLASSES = ['economy', 'business', 'first'];

const tsBlank = (v) => v === '' || v === undefined || v === null;
const tsHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const tsR2 = (n) => Math.round(n * 100) / 100;
const tsMoney = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });

/** The band of the First Schedule: the distance in km (s.12) when given, otherwise the band the reader picked. */
export function tsBandOf(reg, km, band) {
	const bands = reg.consumer_tisa.amounts.bands;
	if (km > 0) {
		for (const b of bands) { if (b.max_km === null || km <= b.max_km) { return b.key; } }
	}
	return TS_BANDS.includes(band) ? band : 'b1';
}

/** The war-time temporary order (SH 3372, s.2): which window the flight date falls in, if any. */
export function tsWar(reg, flight, noticeDays) {
	const w = reg.consumer_tisa.war;
	const a = w.nocomp.find((p) => flight >= p.from && flight <= p.to);
	if (a) { return { code: 'a', from: a.from, to: a.to, section: w.nocomp_section }; }
	if (flight >= w.notice_from && flight <= w.notice_to) {
		const enough = noticeDays !== null && noticeDays >= w.notice_days;
		return { code: enough ? 'b' : 'b_short', from: w.notice_from, to: w.notice_to, section: w.notice_section, enough };
	}
	return null;
}

/** The 4 years of s.19 from the flight day, with the Limitation Law's war window (s.15A(e)) and the rest-day move. */
export function tsLimit(reg, flight) {
	const ca = reg.car_accident;
	const lim = Object.assign({}, ca.limitation, { years: reg.consumer_tisa.limitation.years });
	return TE.limitation(Object.assign({}, ca, { limitation: lim }), flight, null);
}

/** The notice exemption of s.6(c) for a cancelled flight (and s.8 for an advanced one), from the days and the offer. */
export function tsNotice(reg, noticeDays, offer) {
	const C = reg.consumer_tisa.cancel;
	if (noticeDays === null) { return { exempt: false, tier: 'none' }; }
	if (noticeDays >= C.notice_full_days) { return { exempt: true, tier: 'full' }; }
	const fits = (early, late) => Boolean(offer.offered) && offer.early !== null && offer.late !== null && offer.early <= early && offer.late <= late;
	if (noticeDays >= C.notice_mid_days) { return { exempt: fits(C.notice_mid_early_hours, C.notice_mid_late_hours), tier: 'mid' }; }
	return { exempt: fits(C.notice_short_early_hours, C.notice_short_late_hours), tier: 'short' };
}

/**
 * input = { type (TS_TYPES), event (TS_EVENTS), hours (the delay of the departure, or how much earlier it left), flight
 *           (the date on the ticket), notice (the day the notice of the change came, optional), band (TS_BANDS), km (the
 *           great-circle distance, optional; wins over band), line (TS_LINES, domestic), pax (passengers), price (paid per
 *           passenger, optional), leg (TS_LEGS: one-way, the outbound or the return leg of a round trip), pkg (bool: a
 *           package tour), cls (TS_CLASSES: the class on the ticket, for the package price), choice (TS_CHOICES), offered
 *           (bool: an alternative flight was offered), early (hours the alternative departs before the original), late
 *           (hours it lands after the original arrival), refusedAlt (bool: s.6(d)), exempt (TS_EXEMPT: what the airline
 *           claims), denied (TS_DENIED), securityOk (bool: s.5(e)), down (TS_DOWN), segKm (the downgraded segment's
 *           km, optional), free (bool, s.2(b)(2)), moved (bool, s.2(b)(1)), noCheckin (bool, s.2(a)), foreign (bool, s.20),
 *           order (bool: an order under s.9A covers the flight date), demand (the day the written demand was sent, optional),
 *           today }
 */
export function tsCompute(reg, input) {
	const T = reg.consumer_tisa;
	const errors = [];
	const type = TS_TYPES.includes(input.type) ? input.type : 'intl';
	const intl = type === 'intl';
	const event = TS_EVENTS.includes(input.event) ? input.event : 'cancel';
	const today = parseDate(input.today);
	const flight = parseDate(input.flight);
	const num = (field, label, min, max, integer) => {
		if (tsBlank(input[field])) { return null; }
		const v = Number(input[field]);
		if (!Number.isFinite(v) || v < min || v > max || (integer && !Number.isInteger(v))) { errors.push({ field, he: label }); return null; }
		return v;
	};
	if (!flight) { errors.push({ field: 'flight', he: 'מועד הטיסה שבכרטיס: תאריך מלא, לדוגמה 14.9.2026' }); }
	if (flight && flight < T.law.in_force_from) { errors.push({ field: 'flight', he: `החוק חל על טיסות מ-${tsHe(T.law.in_force_from)}` }); }
	if (flight && today && daysBetween(today, flight) > 366) { errors.push({ field: 'flight', he: 'מועד הטיסה רחוק יותר משנה מהיום' }); }
	const pax = num('pax', 'מספר הנוסעים: מספר שלם בין 1 ל-99', 1, 99, true);
	if (pax === null && !errors.some((e) => e.field === 'pax')) { errors.push({ field: 'pax', he: 'מספר הנוסעים: מספר שלם בין 1 ל-99' }); }
	const needHours = event === 'delay' || event === 'advance';
	const hours = needHours ? num('hours', 'מספר השעות: בין 0 ל-72, אפשר עם חצי שעה (2.5)', 0, 72, false) : null;
	if (needHours && hours === null && !errors.some((e) => e.field === 'hours')) { errors.push({ field: 'hours', he: event === 'delay' ? 'בכמה שעות איחרה ההמראה: מספר' : 'בכמה שעות הוקדמה ההמראה: מספר' }); }
	const km = intl ? num('km', 'המרחק בק"מ: מספר חיובי עד 20,000, או ריק', 1, 20000, false) : null;
	const price = num('price', 'מחיר הכרטיס לנוסע: מספר חיובי, או ריק', 0, 1e6, false);
	const early = num('early', 'בכמה שעות החלופה ממריאה לפני המועד המקורי: 0 עד 72', 0, 72, false);
	const late = num('late', 'בכמה שעות החלופה נוחתת אחרי המועד המקורי: 0 עד 72', 0, 72, false);
	const segKm = event === 'downgrade' && intl ? num('segKm', 'מרחק הקטע: מספר חיובי, לא יותר מהמרחק הכולל', 1, 20000, false) : null;
	if (segKm !== null && km !== null && segKm > km) { errors.push({ field: 'segKm', he: 'מרחק הקטע גדול מהמרחק הכולל' }); }
	const date = (field, label) => {
		if (tsBlank(input[field])) { return null; }
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 1.9.2026` }); return null; }
		if (today && d > today) { errors.push({ field, he: `${label}: אחרי היום` }); return null; }
		return d;
	};
	const notice = event === 'cancel' || event === 'delay' || event === 'advance' ? date('notice', 'יום ההודעה על השינוי') : null;
	if (notice && flight && notice > flight) { errors.push({ field: 'notice', he: 'יום ההודעה אחרי מועד הטיסה' }); }
	const demand = date('demand', 'יום הדרישה בכתב');
	if (demand && flight && demand < (notice && notice < flight ? notice : flight)) { errors.push({ field: 'demand', he: 'יום הדרישה לפני שהעילה נוצרה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const lawUrl = T.law.url;
	const bandKey = intl ? tsBandOf(reg, km, input.band) : 'b1';
	const bi = TS_BANDS.indexOf(bandKey);
	const band = T.amounts.bands[bi];
	const line = TS_LINES.includes(input.line) ? input.line : 'other';
	const lineRow = T.domestic.lines.find((l) => l.key === line);
	const pkg = Boolean(input.pkg);
	const cls = TS_CLASSES.includes(input.cls) ? input.cls : 'economy';
	const leg = TS_LEGS.includes(input.leg) ? input.leg : 'one';
	let choice = TS_CHOICES.includes(input.choice) ? input.choice : 'refund';
	const exempt = TS_EXEMPT.includes(input.exempt) ? input.exempt : 'none';
	const deniedWhy = TS_DENIED.includes(input.denied) ? input.denied : 'overbooking';
	const down = TS_DOWN.includes(input.down) ? input.down : 'be';
	const offer = { offered: Boolean(input.offered) || choice === 'alt', early: early === null ? (input.offered || choice === 'alt' ? 0 : null) : early, late };
	const noticeDays = notice ? daysBetween(notice, flight) : null;
	const cancelHours = intl ? T.defs.cancelled_hours : T.domestic.cancelled_hours;
	const legalCancel = event === 'cancel' || (event === 'delay' && hours >= cancelHours);
	if (event === 'cancel' && choice === 'flew') { choice = 'alt'; }
	const per = intl ? band.amount : lineRow.base;
	const amountBase = !intl;

	// 1. The gates of s.2: no benefit at all.
	let none = null;
	const C = T.conditions;
	if (input.free) { none = { code: 'free', he: C.free_he, section: `${C.none_section}(2)` }; } else if (input.moved) {
		none = { code: 'moved', he: C.moved_he, section: `${C.none_section}(1)` };
	} else if (input.noCheckin && !legalCancel && (event === 'delay' || event === 'denied')) {
		none = { code: 'checkin', he: C.checkin_he, section: C.section };
	}

	// 2. What the law gives, by the event. comp = { due, code, section, he }.
	const B = T.benefits;
	const X = T.cancel;
	const D = T.delay;
	const assistance = [];
	const assist = (code, cond) => assistance.push({ code, he: B[`${code}_he`], cond: Boolean(cond) });
	let comp = { due: false, code: 'none', section: '', he: '' };
	let refundApplies = false;
	let altApplies = false;
	let halfHours = null;
	let halfSection = '';
	let war = null;
	let notc = null;
	let downgrade = null;
	if (!none && legalCancel) {
		assist('food'); assist('comms'); assist('hotel', true); assist('transport', true);
		refundApplies = true; altApplies = true;
		notc = tsNotice(reg, noticeDays, offer);
		war = tsWar(reg, flight, noticeDays);
		if (notc.exempt && input.refusedAlt) { notc = Object.assign({}, notc, { exempt: false, refused: true }); }
		if (war && war.code === 'a') {
			comp = { due: false, code: 'war_a', section: war.section, he: T.war.nocomp_quote_he };
		} else if (war && war.code === 'b') {
			comp = { due: false, code: 'war_b', section: war.section, he: T.war.notice_quote_he };
		} else if (notc.exempt) {
			comp = { due: false, code: `notice_${notc.tier}`, section: X.notice_section, he: X.notice_he };
		} else if (input.foreign) {
			comp = { due: false, code: 'foreign', section: T.foreign.section, he: T.foreign.he };
		} else {
			comp = { due: true, code: event === 'delay' ? 'delay8' : 'cancel', section: X.rights_section, he: X.rights_he };
			halfHours = X.half_hours[bi];
			halfSection = X.half_section;
		}
	} else if (!none && event === 'delay') {
		if (hours >= D.food_hours) { assist('food'); assist('comms'); }
		if (intl && hours >= D.refund_hours) {
			refundApplies = true;
			altApplies = exempt !== 'strike';
			if (exempt !== 'strike') { assist('hotel', true); assist('transport', true); }
		}
		comp = { due: false, code: hours >= D.food_hours ? 'delay_short' : 'delay_none', section: D.section, he: '' };
	} else if (!none && event === 'denied') {
		const Dn = T.denied;
		const blocked = deniedWhy === 'health' || deniedWhy === 'documents' || (deniedWhy === 'security' && !input.securityOk);
		if (blocked) {
			comp = { due: false, code: `denied_${deniedWhy}`, section: deniedWhy === 'security' ? Dn.security_section : Dn.not_section, he: deniedWhy === 'security' ? Dn.security_he : Dn.not_he };
		} else if (deniedWhy === 'security') {
			comp = { due: !input.foreign, code: input.foreign ? 'foreign' : 'denied_security', section: Dn.security_section, he: Dn.security_he };
		} else {
			assist('food'); assist('comms'); assist('hotel', true); assist('transport', true);
			refundApplies = true; altApplies = true;
			comp = input.foreign ? { due: false, code: 'foreign', section: T.foreign.section, he: T.foreign.he } : { due: true, code: 'denied', section: Dn.rights_section, he: Dn.rights_he };
			halfHours = Dn.half_hours[bi];
			halfSection = Dn.half_section;
		}
	} else if (!none && event === 'advance') {
		const A = T.advance;
		const lateNotice = noticeDays === null || noticeDays < A.notice_days;
		if (lateNotice && hours > A.comp_over_hours) {
			refundApplies = true; altApplies = true;
			war = tsWar(reg, flight, noticeDays);
			if (war && war.code === 'a') {
				comp = { due: false, code: 'war_a', section: war.section, he: T.war.nocomp_quote_he };
			} else if (war && war.code === 'b') {
				comp = { due: false, code: 'war_b', section: war.section, he: T.war.notice_quote_he };
			} else if (input.foreign) {
				comp = { due: false, code: 'foreign', section: T.foreign.section, he: T.foreign.he };
			} else {
				comp = { due: true, code: 'advance', section: A.comp_section, he: A.comp_he };
			}
		} else if (lateNotice && hours > A.refund_over_hours) {
			refundApplies = true; altApplies = true;
			comp = { due: false, code: 'advance_refund', section: A.refund_section, he: A.refund_he };
		} else {
			comp = { due: false, code: lateNotice ? 'advance_small' : 'advance_notice', section: A.refund_section, he: A.refund_he };
		}
	} else if (!none && event === 'downgrade') {
		const G = T.downgrade;
		const longHaul = intl && bi === 2 && (down === 'be' || down === 'fe');
		const row = longHaul ? G.rows.find((x) => x.key === 'long') : G.rows.find((x) => x.key === down);
		const pkgPrice = pkg ? T.package.rows[down === 'be' ? 'business' : 'first'].prices[bi] : null;
		const basePer = price !== null && price > 0 ? price : pkgPrice;
		const ratio = segKm !== null && km !== null ? segKm / km : 1;
		const amount = basePer === null ? null : tsR2(basePer * row.pct / 100 * ratio * pax);
		downgrade = { row: row.key, pct: row.pct, he: row.he, basePer, basis: price !== null && price > 0 ? 'price' : pkg ? 'package' : 'none', ratio, amount, due: offRestDays(addDays(flight, B.downgrade_days), reg.car_accident.independence_days), longHaul };
		comp = { due: amount !== null && amount > 0, code: 'downgrade', section: G.section, he: G.rows.find((x) => x.key === row.key).he };
		if (amount === null) { add('warn', 'need_price', `כדי לחשב את הפיצוי על הורדה במחלקה צריך את מחיר הכרטיס ששילמתם (${B.downgrade_section}); בחבילת תיור המחיר לפי התוספת השלישית.`, B.downgrade_section, lawUrl); }
	}

	// 3. The money: per passenger, the halving of s.6(b) / s.5(c), the total.
	const canHalve = comp.due && halfHours !== null && choice === 'alt' && late !== null && late <= halfHours;
	const perFull = comp.due && event !== 'downgrade' ? per : 0;
	const perDue = canHalve ? perFull / 2 : perFull;
	const total = event === 'downgrade' ? (downgrade && downgrade.amount) || 0 : perDue * pax;
	const totalFull = event === 'downgrade' ? total : perFull * pax;
	const advanceShabbat = comp.due && event === 'advance' && exempt === 'shabbat';
	const disputed = comp.due && exempt !== 'none' && (legalCancel || event === 'advance') && !advanceShabbat;
	if (advanceShabbat) { add('info', 'exempt_advance', `בהקדמת טיסה הפטור חל רק על נסיבות מיוחדות ועל שביתה (${T.advance.comp_section}); הימנעות מחילול שבת או חג לא פוטרת מהפיצוי כאן.`, T.advance.comp_section, lawUrl); }
	if (disputed) {
		const ex = X.exempt.find((x) => x.code === exempt);
		add('warn', 'exempt', `חברת התעופה טוענת: ${ex.he} (${ex.section}). אם תוכיח את זה, הפיצוי הכספי לא מגיע; ${X.exempt_keeps_he}. נטל ההוכחה עליה, והכלי מציג את הפיצוי כפי שהוא אם לא תוכיח.`, ex.section, lawUrl);
	}

	// 4. The refund (s.3(a)(2) and s.3(b)).
	const R = T.refund;
	let refund = null;
	if (refundApplies) {
		const pkgPer = pkg ? T.package.rows[cls].prices[bi] : null;
		const basePer = price !== null && price > 0 ? price : pkgPer;
		const factor = leg === 'back' ? R.return_back_pct / 100 : 1;
		const chosen = choice === 'refund';
		refund = {
			chosen, basePer, basis: price !== null && price > 0 ? 'price' : pkg ? 'package' : 'none', factor, leg,
			amount: chosen && basePer !== null ? tsR2(basePer * factor * pax) : null,
			section: event === 'delay' && !legalCancel ? D.refund_section : B.refund_section,
		};
	}

	// 5. The days: the written demand (or today, if it goes today), 21 and 45 days, the downgrade's 21, the limitation.
	const ind = reg.car_accident.independence_days;
	const sendDay = demand || today;
	const events = [];
	const ev = (key, d, kind, he, section, url) => { if (d) { events.push({ key, date: d, kind, he, section: section || '', url: url || lawUrl }); } };
	ev('flight', flight, 'start', 'מועד הטיסה שבכרטיס: מכאן נוצרת העילה', '', '');
	if (notice) { ev('notice', notice, 'start', `ההודעה על השינוי: ${noticeDays === 1 ? 'יום אחד' : `${noticeDays} ימים`} לפני הטיסה`, X.notice_section, lawUrl); }
	if (demand) { ev('demand', demand, 'start', 'נשלחה דרישה בכתב לחברת התעופה', B.comp_section, lawUrl); }
	const refundDue = refund && refund.chosen && sendDay ? offRestDays(addDays(sendDay, B.refund_days), ind) : null;
	const compDue = comp.due && event !== 'downgrade' && sendDay ? offRestDays(addDays(sendDay, B.comp_days), ind) : null;
	ev('refund_due', refundDue, 'deadline', `השבת התמורה: בתוך ${B.refund_days} ימים מהפנייה בכתב${demand ? '' : ' (אם הדרישה נשלחת היום)'}`, B.refund_section, lawUrl);
	ev('comp_due', compDue, 'deadline', `הפיצוי הכספי: בתוך ${B.comp_days} ימים מהפנייה בכתב${demand ? '' : ' (אם הדרישה נשלחת היום)'}`, B.comp_section, lawUrl);
	if (downgrade && downgrade.amount) { ev('downgrade_due', downgrade.due, 'deadline', `הפיצוי על ההורדה במחלקה: בתוך ${B.downgrade_days} ימים ממועד הטיסה`, B.downgrade_section, lawUrl); }
	const lim = tsLimit(reg, flight);
	ev('limit', lim.deadline, 'limit', `התיישנות התביעה לפי החוק: ${T.limitation.years} שנים מיום שנוצרה העילה${lim.added ? `, ועוד ${lim.added} ימי תקופת המלחמה` : ''}${lim.rolled ? ', אחרי מעבר מיום מנוחה' : ''}`, T.limitation.section, lawUrl);
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	const expired = Boolean(today && lim.deadline < today);
	const daysLeft = today ? daysBetween(today, lim.deadline) : null;

	// 6. The small claim: the compensation and the refund (if not paid) against the ceiling; the fee of reg. 6(a).
	const sc = reg.small_claims;
	const claim = tsR2(total + (refund && refund.amount ? refund.amount : 0));
	const ceil = TV.ceilingOn(sc, today || flight) || sc.ceiling[sc.ceiling.length - 1];
	const court = claim > 0 ? { claim, ceiling: ceil.amount, ceilingFrom: ceil.from, small: claim <= ceil.amount, fee: TV.fee(sc, claim).fee } : null;

	// 7. Flags.
	if (none) { add('danger', `none_${none.code}`, `${none.he}: לפי ${none.section} אין הטבות לפי החוק.`, none.section, lawUrl); }
	if (expired) { add('danger', 'expired', `לפי ${T.limitation.section}, ${T.limitation.years} השנים מהטיסה הסתיימו ב-${tsHe(lim.deadline)}. עורך דין בודק אם יש חריג.`, T.limitation.section, lawUrl); }
	if (lim.added) { add('info', 'limit_war', `${T.limitation.war_he} (${T.limitation.war_section}): ${lim.added} ימים נוספו ל-${T.limitation.years} השנים.`, T.limitation.war_section, T.limitation.url); }
	if (war && war.code === 'a') { add('warn', 'war_a', `מועד הטיסה ${tsHe(flight)} בתוך תקופת הוראת השעה ${tsHe(war.from)} עד ${tsHe(war.to)}: אין פיצוי כספי בביטול או בהקדמה (${T.war.nocomp_section}). ${T.war.keeps_he}.`, T.war.nocomp_section, T.war.url); }
	if (war && war.code === 'b') { add('warn', 'war_b', `מועד הטיסה בתקופה ${tsHe(war.from)} עד ${tsHe(war.to)}, וההודעה ניתנה ${noticeDays} ימים לפני (${T.war.notice_days} לפחות): אין פיצוי כספי (${T.war.notice_section}), אם המפעיל יוכיח את ההודעה. ${T.war.keeps_he}.`, T.war.notice_section, T.war.url); }
	if (war && war.code === 'b_short') { add('info', 'war_b_short', `מועד הטיסה בתקופה ${tsHe(war.from)} עד ${tsHe(war.to)}: הוראת השעה פוטרת מפיצוי רק כשההודעה ניתנה ${T.war.notice_days} ימים לפחות לפני הטיסה (${T.war.notice_section}); ${noticeDays === null ? 'לא הוזנה הודעה מראש' : `ההודעה ניתנה ${noticeDays} ימים לפני`}, ולכן הכללים הרגילים חלים.`, T.war.notice_section, T.war.url); }
	if (war) { add('info', 'war_judgments', `${T.war.judgments_he} (${T.war.judgments_section}).`, T.war.judgments_section, T.war.url); }
	if (legalCancel && flight >= T.war.stopped_from) { add('info', 'war_stopped', `${T.war.stopped_flag_he} (${T.war.stopped_section} להוראת השעה).`, T.war.stopped_section, T.war.url); }
	if (input.order) { add('warn', 'order', `${T.special.he} (${T.special.section}). הכלי לא קורא צווים: אם צו כזה חל על מועד הטיסה, הפיצוי או ההודעה מראש לפי הצו. ${T.special.notify_he} (${T.special.notify_section}).`, T.special.section, lawUrl); }
	if (notc && notc.exempt) { add('warn', 'notice', `ההודעה ניתנה ${noticeDays} ימים לפני הטיסה${notc.tier !== 'full' ? ', עם חלופה בתוך השעות שבחוק' : ''}: אין פיצוי כספי (${X.notice_section}), אם המפעיל יוכיח שמסר את ההודעה (${X.burden_section}). ${X.exempt_keeps_he}.`, X.notice_section, lawUrl); }
	if (notc && !notc.exempt && notc.tier !== 'none' && !notc.refused && comp.due) { add('info', 'notice_short', `ההודעה ניתנה ${noticeDays} ימים לפני הטיסה, וה${offer.offered ? 'חלופה שהוצעה לא עומדת בשעות' : 'מפעיל לא הציע חלופה'} של ${X.notice_section}: הפיצוי מגיע.`, X.notice_section, lawUrl); }
	if (notc && notc.refused) { add('info', 'refused', `${X.refused_he} (${X.refused_section}): הפיצוי מגיע.`, X.refused_section, lawUrl); }
	if (canHalve) { add('info', 'half', `קיבלתם כרטיס חלופי שנחת ${late} שעות אחרי המועד המקורי (עד ${halfHours} בטווח הזה): ${halfSection === X.half_section ? X.half_he : T.denied.half_he} (${halfSection}). הסכום המובטח: ${tsMoney(perDue)} ₪ לנוסע.`, halfSection, lawUrl); }
	if (comp.due && halfHours !== null && choice === 'alt' && late === null) { add('info', 'half_unknown', `קיבלתם כרטיס חלופי: אם הוא נחת עד ${halfHours} שעות אחרי המועד המקורי, חברת התעופה רשאית להפחית את הפיצוי למחצית (${halfSection}). הזינו בכמה שעות איחרה הנחיתה.`, halfSection, lawUrl); }
	if (input.foreign && comp.code === 'foreign') { add('info', 'foreign', `${T.foreign.he} (${T.foreign.section}).`, T.foreign.section, lawUrl); }
	if (event === 'delay' && !legalCancel && hours >= D.food_hours) { add('info', 'delay_comp', `פיצוי כספי מגיע מ-${cancelHours} שעות איחור בהמראה: אז הטיסה נחשבת "טיסה שבוטלה" (${intl ? T.defs.section : T.domestic.def_section}).`, intl ? T.defs.section : T.domestic.def_section, intl ? lawUrl : T.domestic.url); }
	if (event === 'delay' && !legalCancel && exempt === 'strike' && hours >= D.refund_hours) { add('info', 'strike', `${D.strike_he} (${D.refund_section}).`, D.refund_section, lawUrl); }
	if (!intl) { add('warn', 'domestic_base', `טיסה פנים-ארצית: ${T.domestic.cancelled_he} (${T.domestic.def_section}); הפיצוי לפי ${T.domestic.amounts_section} ל${T.domestic.he}. ${lineRow.base} ₪ הוא סכום הבסיס שבתקנות; ${T.domestic.update_he} (${T.domestic.update_section}). ${T.domestic.update_missing_he}.`, T.domestic.update_section, T.domestic.url); }
	if (intl && km !== null) { add('info', 'km', `המרחק שהוזן, ${tsMoney(km)} ק"מ, בטווח "${band.he}". ${T.distance.he} (${T.distance.section}).`, T.distance.section, lawUrl); }
	if (refund && refund.chosen && refund.basis === 'none') { add('info', 'refund_price', `השבת התמורה היא כל הסכום ששולם בעד הכרטיס, כולל אגרות, היטלים ומסים (${B.refund_section}). הזינו את המחיר כדי לראות סכום.`, B.refund_section, lawUrl); }
	if (refund && refund.chosen && leg === 'back') { add('info', 'return', `${R.return_he} (${R.return_section}).`, R.return_section, lawUrl); }
	if (refund && refund.basis === 'package') { add('info', 'package', `${R.package_he} (${R.package_section}).`, R.package_section, lawUrl); }
	if (choice === 'flew' && refundApplies) { add('info', 'flew', `${R.no_refund_he} (${R.no_refund_section}).`, R.no_refund_section, lawUrl); }
	if (event === 'downgrade' && downgrade && downgrade.longHaul) { add('info', 'long', `טיסה של יותר מ-4,500 ק"מ: ${downgrade.he}, ${downgrade.pct}% מהמחיר (התוספת השנייה).`, T.downgrade.section, lawUrl); }
	if (event === 'downgrade' && segKm !== null && km !== null) { add('info', 'segment', `${T.downgrade.segment_he}: ${tsMoney(segKm)} מתוך ${tsMoney(km)} ק"מ.`, T.downgrade.section, lawUrl); }
	if (court && !court.small) { add('warn', 'over_ceiling', `הסכום ${tsMoney(claim)} ₪ גבוה מתקרת התביעות הקטנות (${tsMoney(court.ceiling)} ₪): אפשר לוותר על היתרה או לתבוע בבית משפט השלום.`, '', sc.service_url); }
	if (comp.due && (legalCancel || event === 'denied' || event === 'advance')) { add('info', 'exemplary', `${T.exemplary.he} (${T.exemplary.section}). זה שיקול דעת של בית המשפט, והכלי לא מחשב אותו.`, T.exemplary.section, lawUrl); }

	const thresholds = intl ? { food: D.food_hours, refund: D.refund_hours, cancel: T.defs.cancelled_hours } : { food: D.food_hours, refund: null, cancel: T.domestic.cancelled_hours };
	return {
		ok: true, type, intl, event, legalCancel, hours, flight, notice, noticeDays, band: bandKey, bi, km, line, pax, price, pkg, cls, leg, choice,
		offer, exempt, denied: deniedWhy, down, segKm, none, comp, per, perFull, perDue, half: canHalve, halfHours, total, totalFull, amountBase,
		disputed, war, notc, assistance, refund, alt: altApplies, downgrade, demand, sendDay, assumedSend: !demand, refundDue, compDue,
		events, lim, deadline: lim.deadline, expired, daysLeft, claim, court, flags, thresholds, today,
	};
}

/** The analytics band: the event, whether money compensation is due, and the distance band; never a date or an amount. */
export function tsBand(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.event}-${r.comp.due ? 'comp' : 'nocomp'}-${r.intl ? r.band : 'dom'}`;
}
