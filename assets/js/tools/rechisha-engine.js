/**
 * Purchase tax on a home, and the full cost of the purchase (wave 3, HAD-498).
 *
 * Dependency-free ES module. Every number comes from registry.purchase_tax, read on its checked_on date:
 *  - Single home (יחיד תושב ישראל, the only home in Israel and the Area): s.9(ג1ג)(3) of the Land Taxation
 *    Law, frozen from 16.1.2025 to 15.1.2028 (Tax Authority execution instruction 1/2025, s.2(א)).
 *  - Additional home: 8% up to 6,055,070 NIS and 10% above, s.9(ג1ו), extended to 31.12.2026
 *    (instruction 1/2025, s.2(ב)). After that day the tool refuses to guess the rate.
 *  - Replacement home: single-home rates if the previous only home is sold within 18 months (bought
 *    1.6.2023-31.5.2025) or 24 months (bought from 1.6.2025), or within 12 months of delivery when bought
 *    from a contractor (s.9(ג1ג)(2)(ב), instruction 2/2026 note 2); a period that touches 28.2.2026-31.5.2026
 *    ends at the later of its end + 3 months or 31.8.2026 (extension law s.3א, instruction 2/2026 s.2).
 *  - Oleh (reg. 12א, from 15.8.2024): 0% to the first single-home limit, 0.5% to 6,055,070, then the single-
 *    home rate; once, within a year before to seven years after aliyah, not above 20,183,565 NIS.
 *  - Disability track (reg. 11(א)): 0% to the first single-home limit and 0.5% to 2,500,000 NIS; above
 *    2,500,000 NIS, 0.5% on the whole value; twice per person.
 *  - Deadlines: a declaration within 30 days (s.73(ג)), payment within 60 days (s.90א), then linkage and
 *    interest (s.94(א)). VAT on a lawyer's or broker's fee: 18% (the 2005 VAT rate order, s.1).
 */

const DAY = 86400000;
const ms = (iso) => Date.parse(`${iso}T00:00:00Z`);
const isoOf = (t) => new Date(t).toISOString().slice(0, 10);
export function addDays(iso, n) { return isoOf(ms(iso) + n * DAY); }
/** n months later. From the last day of a month, the result is the last day of the target month, as the
 * Tax Authority counts it (instruction 2/2026: bought 30.4.2025, 18 months end on 31.10.2026). */
export function addMonths(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const total = y * 12 + (m - 1) + n;
	const ny = Math.floor(total / 12);
	const nm = total % 12 + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	const endOfMonth = d === new Date(Date.UTC(y, m, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(nm).padStart(2, '0')}-${String(endOfMonth ? last : Math.min(d, last)).padStart(2, '0')}`;
}
export function parseDate(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	let y; let mo; let d;
	if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
		m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
		if (!m) { return null; }
		d = +m[1]; mo = +m[2]; y = +m[3];
		if (y < 100) { y += 2000; }
	}
	const t = Date.UTC(y, mo - 1, d);
	const back = new Date(t);
	if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) { return null; }
	return isoOf(t);
}

/** Tax by brackets: each part of the value at its own rate; the total is rounded to the agora once. */
export function byBrackets(brackets, value) {
	const lines = [];
	let low = 0;
	let tax = 0; // in agorot, unrounded: rounded once at the end
	for (const [upper, rate] of brackets) {
		if (value <= low) { break; }
		const top = upper === null ? value : Math.min(value, upper);
		const part = top - low;
		const exact = part * rate; // part x rate%, in agorot
		lines.push({ from: low, to: top, part, rate, tax: Math.round(exact) / 100 });
		tax += exact;
		if (upper === null || value <= upper) { break; }
		low = upper;
	}
	return { tax: Math.round(tax) / 100, lines };
}

export const TRACKS = ['single', 'replacement', 'additional', 'oleh', 'disabled'];

/** Tax for one track on one day. A day outside the track's verified period returns { refused }. */
export function taxFor(pt, track, value, on) {
	const key = track === 'replacement' ? 'single' : track;
	const t = pt.tracks[key];
	if (!t) { return { refused: 'track' }; }
	if (on < t.from) { return { refused: 'before', from: t.from }; }
	if (on > t.to) { return { refused: 'after', to: t.to }; }
	if (key === 'oleh' && value > t.max_value) { return { refused: 'oleh_cap', cap: t.max_value }; }
	if (key === 'disabled' && value > t.cap) {
		return { tax: Math.round(value * t.flat_above_cap) / 100, lines: [{ from: 0, to: value, part: value, rate: t.flat_above_cap, tax: Math.round(value * t.flat_above_cap) / 100 }], flat: true, section: t.section, track: key };
	}
	if (key === 'oleh') {
		// The first part at 0%, then 0.5%, and above 6,055,070 the single-home rates for that part (reg. 12א(א)(3)).
		const single = pt.tracks.single.brackets;
		const brackets = t.brackets.slice(0, 2).concat(single.filter(([upper]) => upper === null || upper > t.brackets[1][0]));
		return Object.assign(byBrackets(brackets, value), { section: t.section, track: key });
	}
	return Object.assign(byBrackets(t.brackets, value), { section: t.section, track: key });
}

/** The day by which the previous only home must be sold (replacement track), with the war extension. */
export function replacementDeadline(pt, purchase, opts = {}) {
	const r = pt.replacement;
	let start = purchase;
	let months = null;
	if (opts.contractor) {
		if (!opts.delivery) { return { ok: false, reason: 'delivery' }; }
		start = opts.delivery;
		months = r.contractor_months;
	} else {
		const w = r.windows.find((x) => purchase >= x.from && (x.to === null || purchase <= x.to));
		if (!w) { return { ok: false, reason: 'before', from: r.windows[0].from }; }
		months = w.months;
	}
	const original = addMonths(start, months);
	let deadline = original;
	let extended = false;
	// A period that touches the second determining period (at least one day) ends at the later of: its end
	// plus three months, or the floor date (s.3א of the extension law, instruction 2/2026 s.2).
	if (start <= r.war.to && original >= r.war.from) {
		const plus = addMonths(original, r.war.add_months);
		deadline = plus > r.war.floor ? plus : r.war.floor;
		extended = true;
	}
	return { ok: true, start, months, original, deadline, extended, contractor: Boolean(opts.contractor) };
}

/**
 * input = { price, date (purchase day), track, contractor, delivery, aliyah (oleh: the aliyah day),
 *           lawyerPct, brokerPct, other, vat: true (fees plus VAT) }
 */
export function compute(registry, input) {
	const pt = registry.purchase_tax;
	const errors = [];
	const price = Number(input.price);
	const on = parseDate(input.date);
	const track = TRACKS.includes(input.track) ? input.track : 'single';
	if (!(price > 0)) { errors.push({ field: 'price', he: 'מחיר הדירה צריך להיות גדול מ-0' }); }
	if (price > 1e10) { errors.push({ field: 'price', he: 'המחיר גדול מדי לבדיקה' }); }
	if (!on) { errors.push({ field: 'date', he: 'תאריך הרכישה לא תקין. לדוגמה: 13.10.2026' }); }
	const pct = (v) => (v === '' || v === undefined || v === null ? 0 : Number(v));
	const lawyerPct = pct(input.lawyerPct);
	const brokerPct = pct(input.brokerPct);
	const other = pct(input.other);
	if (!(lawyerPct >= 0 && lawyerPct <= 10)) { errors.push({ field: 'lawyer', he: 'שכר טרחת עורך הדין באחוזים: 0 עד 10' }); }
	if (!(brokerPct >= 0 && brokerPct <= 10)) { errors.push({ field: 'broker', he: 'דמי התיווך באחוזים: 0 עד 10' }); }
	if (!(other >= 0 && other < 1e8)) { errors.push({ field: 'other', he: 'עלויות אחרות: מספר חיובי' }); }
	const delivery = input.delivery ? parseDate(input.delivery) : null;
	if (input.delivery && !delivery) { errors.push({ field: 'delivery', he: 'מועד המסירה לא תקין' }); }
	const aliyah = input.aliyah ? parseDate(input.aliyah) : null;
	if (input.aliyah && !aliyah) { errors.push({ field: 'aliyah', he: 'תאריך העלייה לא תקין' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const main = taxFor(pt, track, price, on);
	if (main.refused) {
		const why = ({
			before: () => `הכלי מחשב רכישות מ-${rqDate(main.from)}. לרכישה מוקדמת יותר: הסימולטור של רשות המסים.`,
			after: () => `הוראת השעה של 8% ו-10% על דירה נוספת הוארכה עד ${rqDate(main.to)}. השיעור לרכישה אחרי היום הזה עוד לא פורסם, ולכן הכלי לא מנחש אותו.`,
			oleh_cap: () => `ההטבה לעולה לא חלה כששווי הדירה עולה על ${main.cap.toLocaleString('en-US')} ₪ (תקנה 12א(ג)).`,
		}[main.refused] || (() => 'מחוץ לתחום של הכלי'))();
		return { ok: false, outOfScope: true, errors: [{ field: 'date', he: why }] };
	}
	const vat = input.vat === false ? 0 : pt.vat_pct;
	const lawyer = Math.round(price * lawyerPct * (100 + vat) / 100) / 100;
	const broker = Math.round(price * brokerPct * (100 + vat) / 100) / 100;
	const total = Math.round((main.tax + lawyer + broker + other) * 100) / 100;

	// The other tracks on the same price and day, for the side-by-side compare.
	const scenarios = {};
	for (const t of ['single', 'additional', 'oleh', 'disabled']) {
		const r = taxFor(pt, t, price, on);
		scenarios[t] = r.refused ? null : r.tax;
	}

	let replacement = null;
	if (track === 'replacement') {
		replacement = replacementDeadline(pt, on, { contractor: Boolean(input.contractor), delivery });
		if (!replacement.ok && replacement.reason === 'delivery') { flags.push({ code: 'delivery', he: 'ברכישה מקבלן, 12 החודשים נספרים מיום מסירת הדירה החדשה. הזינו את מועד המסירה לפי ההסכם.' }); }
		if (!replacement.ok && replacement.reason === 'before') { flags.push({ code: 'replacement_before', he: `חלון המכירה מחושב כאן לרכישות מ-${rqDate(replacement.from)}.` }); }
		if (scenarios.additional !== null) {
			flags.push({ code: 'at_stake', he: `אם הדירה הקודמת לא תימכר בזמן, המס הוא כמו בדירה נוספת: ${rqMoney(scenarios.additional)} ₪, כלומר ${rqMoney(Math.max(0, scenarios.additional - main.tax))} ₪ יותר.` });
		}
	}
	if (track === 'oleh') {
		const o = pt.tracks.oleh;
		if (aliyah) {
			const first = addMonths(aliyah, -12 * o.years_before);
			const last = addMonths(aliyah, 12 * o.years_after);
			if (on < first || on > last) { flags.push({ code: 'oleh_window', he: `ההטבה לעולה חלה ברכישה משנה לפני העלייה ועד 7 שנים אחריה (${rqDate(first)} עד ${rqDate(last)}), בלי לספור שירות חובה. תאריך הרכישה מחוץ לחלון.` }); }
		}
		flags.push({ code: 'oleh_once', he: 'הטבת עולה ניתנת פעם אחת, ורק כשהדירה יחידה או חלופית (תקנה 12א).' });
	}
	if (track === 'disabled') { flags.push({ code: 'disabled', he: 'המסלול לנכים, עיוורים, נפגעים ובני משפחה של חיילים שנספו (תקנה 11(א)): לכל אדם פעמיים בלבד, לפי ההגדרות שבתקנה.' }); }
	if (track === 'additional' || track === 'single' || track === 'replacement') {
		flags.push({ code: 'third', he: 'יש לכם חלק של שליש או פחות בדירה אחרת (למשל מירושה)? הוא לא נספר, והדירה עדיין יחידה (סעיף 9(ג1ג)(4)(א)).', soft: true });
	}

	const declare = addDays(on, pt.declare_days);
	const pay = addDays(on, pt.pay_days);
	return {
		ok: true, track, price, on, tax: main.tax, lines: main.lines, flat: Boolean(main.flat), section: main.section,
		effective: price ? Math.round(main.tax / price * 10000) / 100 : 0,
		lawyer, broker, other, vat, total, scenarios, replacement, flags, declare, pay,
	};
}

function rqDate(iso) { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; }
function rqMoney(n) { const v = Math.round(n * 100) / 100; return v.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }); }
