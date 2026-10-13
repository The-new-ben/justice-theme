/**
 * What a divorce costs, and how long the law's own clocks run (wave 4, HAD-502). For a Jewish couple, whose divorce
 * (the get) is given in the rabbinical court; property and children may be decided there (joined claims) or in the
 * family court.
 *
 * Dependency-free ES module. Every number comes from registry.divorce_cost, read on its checked_on date:
 *  - Rabbinical court fees: the Dayanim (Fees) Regulations 1957, first and second schedules, current to 22.1.2026
 *    (updated each 1 January). A divorce claim 4(1)(א), a joined property claim 4(1)(ב), custody 7, maintenance 3
 *    (the person who files is exempt, reg. 14א), an agreement given the force of a judgment 4(2), a request to arrange
 *    the get 4(3)(א)-(ב), the get itself free when both are in Israel 4(3)(ג), a divorce certificate for each side
 *    4(4)(א), a dispute-settlement request 19(טז), and the transcript fee of the second schedule.
 *  - Family court fees: the Family Court (Fees) Regulations 1995, current to 1.7.2026 (updated each 1 January and
 *    1 July): a property claim between spouses 2א, maintenance 5, custody 6ב, an agreement approved 6א, a dispute-
 *    settlement request 13, and the transcript fee of the second schedule (not on items 8 and 13).
 *  - The clocks: the Family Disputes Settlement Law 2014 (permanent since 8.12.2020): a dispute-settlement request first
 *    (s.3(א)), except for a divorce filed by consent and an agreement brought for approval (s.2, definitions); up to
 *    four free information meetings within 45 days, once extendable by 15 (s.3(ב)(1), (3); regs, form 2); no claim
 *    for 60 days, or 75 (s.3(ה)); and the claims filed within 15 days after (s.4). The law sets no duration for a
 *    contested case, so the tool never states one.
 *  - The balance of resources (Spouses Property Relations Law 1973): each spouse is entitled to half of the value of
 *    the combined assets, less assets from before the marriage, gifts, inheritance, National Insurance benefits and
 *    compensation for bodily injury or death, and assets agreed in writing (s.5(א)); pensions and savings included
 *    (s.5(ג)); each side's debts deducted (s.6(א)); the richer side pays half the difference (s.6(ב)); a court may
 *    depart from half (s.8); not for couples married before 1.1.1974 (s.14).
 *  - Lawyers: only the Israel Bar's recommended minimum tariff (2000 rules, current to 5.1.2026), which is a
 *    non-binding recommendation (rule 2) before VAT (rule 1). The tool shows it as a reference, never as a price.
 */
import { addDays, addCountedDays, isFamilyPause, parseDate } from './dates.js';

export const ROUTES = ['agree', 'mediate', 'court'];
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * The statutory clock of a dispute-settlement request, from the day it is filed. The 45/60/75 days do not count the
 * holiday days of s.6א(א)(1); the 15 days to file a claim (s.4) count them, unless the last day falls on one (s.6א(ג)).
 */
export function clock(dc, start, extended) {
	const d = dc.disputes;
	const meetings = d.meetings_days + (extended ? d.extend_days : 0);
	const stay = extended ? d.stay_days_extended : d.stay_days;
	const stayEnds = addCountedDays(start, stay, isFamilyPause);
	// s.6א(ג): the holiday days count in the 15 days, unless the last day falls on one; then they do not count (s.6א(א)).
	let claimsBy = addDays(stayEnds, d.claim_days);
	if (isFamilyPause(claimsBy)) { claimsBy = addCountedDays(stayEnds, d.claim_days, isFamilyPause); }
	const meetingsBy = addCountedDays(start, meetings, isFamilyPause);
	return {
		start, extended: Boolean(extended), meetingsBy, stayEnds, claimsBy,
		paused: meetingsBy !== addDays(start, meetings) || stayEnds !== addDays(start, stay),
		meetingsDays: meetings, stayDays: stay, claimDays: d.claim_days, meetings: d.meetings_max,
	};
}

/**
 * input = { route ('agree' | 'mediate' | 'court'), forum ('rabbinical' | 'family': where the agreement is approved or
 *           where property and children are claimed), children (bool), property (bool), abroad (one spouse lives
 *           abroad: the get request), certificates (0-2), separateRequest (a separate request to arrange the get),
 *           lawyer ('none' | 'bar'), start (the day the request is filed), extended (the meetings were extended),
 *           notJewish (bool), before1974 (married before 1.1.1974),
 *           balance: { a: { assets, excluded, debts }, b: { assets, excluded, debts } } (optional) }
 */
export function compute(registry, input) {
	const dc = registry.divorce_cost;
	const rb = dc.rabbinical;
	const fc = dc.family;
	const errors = [];
	const route = ROUTES.includes(input.route) ? input.route : 'agree';
	const forum = input.forum === 'family' ? 'family' : 'rabbinical';
	const certificates = input.certificates === undefined || input.certificates === '' ? 2 : Number(input.certificates);
	if (!(Number.isInteger(certificates) && certificates >= 0 && certificates <= 2)) { errors.push({ field: 'certificates', he: 'תעודות גירושין: 0, 1 או 2' }); }
	// The filing day must be a real calendar day: 31.2.2026 is an error, never 3.3.2026 (review, PR 126). It is read only
	// where the statutory clock applies, so a value left in the hidden field never blocks the agreement route.
	const clockApplies = route !== 'agree' && !input.abroad;
	const startIso = clockApplies && input.start ? parseDate(input.start) : null;
	if (clockApplies && input.start && !startIso) { errors.push({ field: 'start', he: 'יום הגשת הבקשה לא תקין. לדוגמה: 1.11.2026' }); }
	if (input.notJewish) {
		return { ok: false, outOfScope: true, errors: [{ field: 'route', he: dc.scope_he }] };
	}
	// The balance of resources, when amounts are entered.
	let balance = null;
	const b = input.balance;
	const val = (v) => (v === '' || v === undefined || v === null ? 0 : Number(v));
	// Married before 1.1.1974: the balance regime does not apply (s.14), so no payment figure is shown (review, PR 126).
	// A field counts as entered when it holds anything, even a malformed number (NaN), so a lone bad amount is an error
	// on its field and never a silently skipped balance (review, PR 126).
	const entered = (v) => v !== '' && v !== undefined && v !== null;
	const any = (s) => Boolean(s) && (entered(s.assets) || entered(s.excluded) || entered(s.debts));
	if (!input.before1974 && b && (any(b.a) || any(b.b))) {
		const side = (s, key) => {
			const assets = val(s && s.assets);
			const excluded = val(s && s.excluded);
			const debts = val(s && s.debts);
			for (const [f, v] of [['assets', assets], ['excluded', excluded], ['debts', debts]]) {
				if (!(v >= 0 && v < 1e10)) { errors.push({ field: `${key}-${f}`, he: 'סכום: מספר חיובי' }); }
			}
			if (excluded > assets) { errors.push({ field: `${key}-excluded`, he: 'מה שלא מאזנים לא יכול להיות יותר מכל הנכסים' }); }
			return { assets, excluded, debts, net: r2(assets - excluded - debts) };
		};
		const A = side(b.a, 'a');
		const B = side(b.b, 'b');
		if (!errors.length) {
			const diff = r2(A.net - B.net);
			balance = { a: A, b: B, diff, pay: r2(Math.abs(diff) / 2), payer: diff > 0 ? 'a' : diff < 0 ? 'b' : null };
		}
	}
	if (errors.length) { return { ok: false, errors }; }

	const lines = [];
	const add = (who, key, he, amount, section, url, opts = {}) => { lines.push(Object.assign({ who, key, he, amount, section, url }, opts)); };
	const R = (key, he, amount, section, opts) => add('rabbinical', key, he, amount, section, rb.url, opts);
	const F = (key, he, amount, section, opts) => add('family', key, he, amount, section, fc.url, opts);
	const flags = [];

	// 1. The dispute-settlement request: the mediate and court routes (not a divorce by consent, not an agreement), and
	// not when a party's domicile is abroad: the law does not apply to that proceeding (s.4א(1)).
	const lawApplies = clockApplies;
	if (lawApplies) {
		if (forum === 'family') { F('request', 'בקשה ליישוב סכסוך בבית המשפט לענייני משפחה', fc.request, fc.items.request); } else { R('request', 'בקשה ליישוב סכסוך בבית הדין הרבני', rb.request, rb.items.request); }
	}
	// 2. Agreement routes: the agreement is approved, then the get.
	if (route === 'agree' || route === 'mediate') {
		if (forum === 'rabbinical') {
			R('agreement', 'בקשה לתת להסכם הגירושין תוקף של פסק דין', rb.agreement, rb.items.agreement);
		} else {
			F('agreement', 'אישור הסכם בין בני הזוג בבית המשפט לענייני משפחה', fc.agreement, fc.items.agreement);
			F('agreement_tr', 'אגרת פרוטוקול על אישור ההסכם', fc.transcript, fc.items.transcript);
			R('get_request', input.abroad ? 'בקשה לסידור גט כשאחד מבני הזוג בחוץ לארץ' : 'בקשה לסידור גט בבית הדין הרבני', input.abroad ? rb.get_request_abroad : rb.get_request, input.abroad ? rb.items.get_request_abroad : rb.items.get_request);
		}
	}
	// 3. The court route: the claims after the stay.
	if (route === 'court') {
		R('divorce', 'תביעת גירושין בבית הדין הרבני', rb.divorce, rb.items.divorce);
		R('divorce_tr', 'אגרת פרוטוקול על תביעת הגירושין', rb.transcript_divorce, rb.items.transcript_divorce);
		if (forum === 'rabbinical') {
			if (input.property) { R('property', 'תביעה לחלוקת רכוש הכרוכה בגירושין', rb.property, rb.items.property); R('property_tr', 'אגרת פרוטוקול על תביעת הרכוש', rb.transcript_other, rb.items.transcript_other); }
			if (input.children) {
				R('custody', 'בקשה להחזקת ילדים', rb.custody, rb.items.custody); R('custody_tr', 'אגרת פרוטוקול על החזקת הילדים', rb.transcript_other, rb.items.transcript_other);
				R('support', 'תביעת מזונות: מי שמגיש פטור מאגרה', 0, rb.items.support_exempt, { free: true });
			}
		} else {
			if (input.property) { F('property', 'תביעה רכושית בין בני זוג (איזון משאבים, פירוק שיתוף)', fc.property, fc.items.property); F('property_tr', 'אגרת פרוטוקול על התביעה הרכושית', fc.transcript, fc.items.transcript); }
			if (input.children) {
				F('custody', 'תביעה בעניין החזקת ילדים', fc.custody, fc.items.custody); F('custody_tr', 'אגרת פרוטוקול על החזקת הילדים', fc.transcript, fc.items.transcript);
				F('support', 'תביעת מזונות', fc.support, fc.items.support); F('support_tr', 'אגרת פרוטוקול על המזונות', fc.transcript, fc.items.transcript);
			}
		}
		if (input.abroad) { R('get_request', 'בקשה לסידור גט כשאחד מבני הזוג בחוץ לארץ', rb.get_request_abroad, rb.items.get_request_abroad); }
		flags.push({ code: 'refund', he: dc.refund_he });
	}
	// 4. The get itself, and the certificates.
	R('get', input.abroad ? 'סידור הגט: עלויות הסדר מיוחד משולמות בנוסף, כשצריך' : 'סידור הגט כששני בני הזוג בארץ: פטור', 0, input.abroad ? rb.items.get_special : rb.items.get_free, { free: true });
	if (certificates) { R('certificates', `תעודת גירושין${certificates === 2 ? ', לכל אחד מבני הזוג' : ''}`, rb.certificate * certificates, rb.items.certificate, { unit: rb.certificate, count: certificates }); }
	if (route === 'agree' && forum === 'rabbinical') { flags.push({ code: 'get_request', he: dc.get_request_he }); }
	if (lawApplies) { flags.push({ code: 'meetings', he: dc.meetings_he }); }
	if (route !== 'agree' && input.abroad) { flags.push({ code: 'abroad', he: dc.abroad_he }); }
	const clk0 = lawApplies ? clock(dc, startIso || dc.checked_on, input.extended) : null;
	if (clk0 && clk0.paused) { flags.push({ code: 'pause', he: dc.pause_he }); }
	if (input.children && route === 'court' && forum === 'rabbinical') { flags.push({ code: 'support', he: dc.support_he }); }
	if (input.before1974) { flags.push({ code: 'pre1974', he: dc.pre1974_he }); }

	const total = r2(lines.reduce((a, l) => a + l.amount, 0));
	const byWho = { rabbinical: r2(lines.filter((l) => l.who === 'rabbinical').reduce((a, l) => a + l.amount, 0)), family: r2(lines.filter((l) => l.who === 'family').reduce((a, l) => a + l.amount, 0)) };

	// 5. The Bar's recommended minimum (non-binding), per side, before VAT.
	const bar = dc.bar;
	const barLines = [];
	if (route === 'court') {
		barLines.push({ he: 'תביעה לגט בלי הסכמה', amount: bar.get_contested, section: bar.items.get_contested });
		if (input.children) { barLines.push({ he: 'החזקת ילדים שיש בה התנגדות', amount: bar.custody_opposed, section: bar.items.custody_opposed }); }
		if (input.property) { barLines.push({ he: 'תביעה רכושית: לפי שווי הרכוש, בלי סכום קבוע', amount: null, section: bar.items.property }); }
	} else {
		barLines.push({ he: 'סידור גט בהסכמה', amount: bar.get_consent, section: bar.items.get_consent });
		// Item 8(9): the agreement for the get ruling, net of the get fee but never under 2,480; custody and property agreed
		// inside it are part of that agreement, so no separate custody item is added (the minimum stays a minimum).
		barLines.push({ he: 'עריכת הסכם לפסק הגט: לא פחות מ-', amount: bar.agreement_min, section: bar.items.agreement, min: true });
	}
	const barTotal = r2(barLines.reduce((a, l) => a + (l.amount || 0), 0));
	const vatPct = dc.vat.pct;
	const barWithVat = r2(barTotal * (100 + vatPct) / 100);

	const clk = clk0;

	return {
		ok: true, route, forum, children: Boolean(input.children), property: Boolean(input.property), abroad: Boolean(input.abroad),
		lines, total, byWho, flags, balance, clock: clk, certificates,
		bar: { lines: barLines, total: barTotal, withVat: barWithVat, vatPct, shown: input.lawyer === 'bar' },
	};
}

/** The same family on every route, for the side-by-side (fees and the Bar minimum). */
export function byRoute(registry, input) {
	const out = {};
	for (const r of ROUTES) {
		const x = compute(registry, Object.assign({}, input, { route: r, balance: null }));
		out[r] = x.ok ? { total: x.total, bar: x.bar.total, barWithVat: x.bar.withVat } : null;
	}
	return out;
}
