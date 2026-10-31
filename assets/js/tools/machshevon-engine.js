/**
 * The divorce calculator and price list (HAD-616, 31.10.2026): "מחשבון גירושין" and "מחירון גירושין" on /divorce-lawyer/
 * (machshevon-gerushin). What a divorce costs a Jewish couple in Israel by route (consent, mediation, a compromise half way,
 * a full dispute), forum (the rabbinical court or the family court), the subjects that are open (child support, custody and
 * parenting time, property), the experts and the after-judgment steps: low, expected and high, each side's share, VAT, the
 * time, what raises and what lowers the bill, and the four routes side by side.
 *
 * Dependency-free ES module. Every number is read from the registry, never typed here:
 *  - Official amounts by their dotted path (reg.fl_mechiron.official[].ref): the Dayanim (Fees) Regulations 1957 and the
 *    Family Court (Fees) Regulations 1995 (reg.divorce_cost, wave 4), the rest of the rabbinical schedule and the district
 *    court's appeal items (reg.fl_rabanut), the notary's tariff (reg.prenup), the Bar's recommended minimum (reg.divorce_cost
 *    .bar), legal aid (reg.malpractice_mechir.legal_aid), VAT (reg.divorce_cost.vat), and the statutory clock of a dispute-
 *    settlement request (reg.divorce_cost.disputes).
 *  - Market amounts (reg.fl_mechiron.market[]): what named offices, mediators and experts publish, each source with its url,
 *    a short quote, whether VAT is included and the day it was read. Never one firm's price: low = the lowest published low,
 *    high = the highest published high, expected = the median of the sources' mid-points; a source that states its figure
 *    with VAT is brought to before VAT first. A row with no verified source is "לא נבדק" and never enters a total.
 * Every top-level name starts with "mg": the bundle concatenates this file with instrument.js.
 */

export const MG_ROUTES = ['agree', 'mediate', 'compromise', 'contested'];
export const MG_FORUMS = ['rabbinical', 'family'];
export const MG_REPS = ['each', 'one', 'self', 'aid'];
export const MG_SPLITS = ['equal', 'a', 'b', 'pct'];
export const MG_SUBJECTS = ['support', 'custody', 'property'];
export const MG_EXPERTS = ['actuary', 'appraiser', 'business', 'courtExpert', 'coordinator'];
export const MG_AFTER = ['appeal', 'execution'];
export const MG_EXTRAS = ['prenup', 'notary', 'pleader'];

const mgR = (n) => Math.round(n);
const mgR100 = (n) => Math.round(n / 100) * 100;
const mgBlank = (v) => v === '' || v === undefined || v === null;

/** A value in the registry by its dotted path ("divorce_cost.rabbinical.divorce"); undefined when it does not resolve. */
export function mgGet(reg, path) {
	return String(path || '').split('.').reduce((o, k) => (o && typeof o === 'object' && k in o ? o[k] : undefined), reg);
}

/**
 * An official row by id: { id, he, amount, item, url, vat, src_he, ref }. The dataset stores each amount resolved from the
 * registry path in `ref` (so the page's data island carries only this dataset), and the golden test checks that every stored
 * amount still equals the value at its path.
 */
export function mgOfficial(reg, id) {
	const row = reg.fl_mechiron.official.find((x) => x.id === id);
	if (!row) { return null; }
	return Object.assign({}, row, { amount: Number(row.amount) });
}

/** The median of a list of numbers. */
export function mgMedian(list) {
	const s = list.slice().sort((a, b) => a - b);
	if (!s.length) { return null; }
	const k = Math.floor(s.length / 2);
	return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
}

/**
 * A market row, summarised over its verified sources and brought to before VAT: { id, he, low, mid, high, n, unit_he,
 * sources }. low/high round to the shekel, mid to 100 (a median of published ranges is never more precise than that).
 * Null when the row has no verified source.
 */
export function mgMarket(reg, id) {
	const row = reg.fl_mechiron.market.find((x) => x.id === id);
	if (!row) { return null; }
	const vatPct = reg.divorce_cost.vat.pct;
	// Each source is brought to the row's unit (factor: a price "per hour from each side" is 2 for "per hour for the couple")
	// and to before VAT. A source that gives only "up to" adds a high and no low; one that gives only "from" adds a low.
	const net = (v, s) => (s.vat === 'incl' ? v * 100 / (100 + vatPct) : v) * (s.factor || 1);
	const src = (row.sources || []).filter((s) => s.status !== 'not_checked' && (s.low > 0 || s.high > 0));
	if (!src.length) { return Object.assign({}, row, { low: null, mid: null, high: null, n: 0, sources: row.sources || [] }); }
	const lows = src.filter((s) => s.low > 0).map((s) => net(s.low, s));
	const highs = src.filter((s) => s.high > 0).map((s) => net(s.high, s));
	const mids = src.filter((s) => s.low > 0 && s.high > 0).map((s) => net((s.low + s.high) / 2, s));
	const low = lows.length ? Math.min(...lows) : Math.min(...highs);
	const high = highs.length ? Math.max(...highs) : Math.max(...lows);
	const mid = mids.length ? mgMedian(mids) : (low + high) / 2;
	return Object.assign({}, row, { low: mgR(low), mid: mgR100(mid), high: mgR(high), n: src.length });
}

/** The statutory clock of a dispute-settlement request, in days (reg.divorce_cost.disputes): read, never typed. */
export function mgClock(reg) {
	const d = reg.divorce_cost.disputes;
	return { meetings: d.meetings_days, extend: d.extend_days, stay: d.stay_days, stayExtended: d.stay_days_extended, claims: d.claim_days, max: d.meetings_max };
}

/** Months a route takes, from the published sources (reg.fl_mechiron.durations[route]); null bounds = not checked. */
export function mgDuration(reg, route) {
	const d = (reg.fl_mechiron.durations || {})[route];
	if (!d) { return { low: null, high: null, sources: [] }; }
	const src = (d.sources || []).filter((s) => s.status !== 'not_checked' && (s.low > 0 || s.high > 0));
	if (!src.length) { return { low: null, high: null, sources: d.sources || [], he: d.he }; }
	return { low: Math.min(...src.map((s) => s.low || s.high)), high: Math.max(...src.map((s) => s.high || s.low)), sources: src, he: d.he };
}

/**
 * input = { route (MG_ROUTES), forum (MG_FORUMS: where the agreement is approved or where the claims are filed; the get is
 *           always at the rabbinical court), support, custody, property (bool: the subject is open), actuary, appraiser,
 *           business, courtExpert (bool), coordinator (bool) + hours (the parenting coordinator's hours), joint (one agreed
 *           expert instead of one per side, in a dispute), appeal, execution (bool), prenup, notary, pleader (bool), rep
 *           (MG_REPS: a lawyer for each side, one lawyer for both, no lawyer, legal aid for side A), quote (side A's own quote,
 *           optional) + quoteVat ('plus' | 'incl'), split (MG_SPLITS) + pct (side A's share of the shared costs, 0-100),
 *           abroad (one spouse lives abroad), notJewish }
 */
export function mgCompute(reg, input) {
	const m = reg.fl_mechiron;
	const dc = reg.divorce_cost;
	const errors = [];
	const route = MG_ROUTES.includes(input.route) ? input.route : 'agree';
	const forum = input.forum === 'family' ? 'family' : 'rabbinical';
	const rep = MG_REPS.includes(input.rep) ? input.rep : 'each';
	const split = MG_SPLITS.includes(input.split) ? input.split : 'equal';
	if (input.notJewish) { return { ok: false, outOfScope: true, errors: [{ field: 'route', he: dc.scope_he }] }; }
	let pct = 50;
	if (split === 'a') { pct = 100; } else if (split === 'b') { pct = 0; } else if (split === 'pct') {
		pct = mgBlank(input.pct) ? 50 : Number(input.pct);
		if (!(pct >= 0 && pct <= 100)) { errors.push({ field: 'pct', he: 'החלק של צד א בהוצאות המשותפות: בין 0 ל-100' }); }
	}
	let quote = null;
	if (!mgBlank(input.quote)) {
		quote = Number(input.quote);
		if (!(quote > 0 && quote < 1e8)) { errors.push({ field: 'quote', he: 'הצעת המחיר: סכום בשקלים, לדוגמה 18,000' }); quote = null; }
	}
	// The coordinator's hours are the reader's own number; without one the line is one hour, labelled "per hour".
	let hours = 0;
	if (input.coordinator && !mgBlank(input.hours)) {
		hours = Number(input.hours);
		if (!(Number.isInteger(hours) && hours >= 1 && hours <= 200)) { errors.push({ field: 'hours', he: 'שעות תיאום הורי: מספר שלם בין 1 ל-200' }); }
	}
	if (rep === 'aid' && input.pleader) { errors.push({ field: 'rep', he: 'טוען רבני או סיוע משפטי: בחרו אחד' }); }
	if (errors.length) { return { ok: false, errors }; }

	const vatPct = dc.vat.pct;
	const shareA = pct / 100;
	const lines = [];
	const missing = [];
	const subjects = MG_SUBJECTS.filter((s) => input[s]);
	const disputed = route === 'compromise' || route === 'contested';
	const rb = forum === 'rabbinical';
	/** payer: 'a' side A alone, 'b' side B alone, 'each' both sides pay it, 'split' shared by the split. */
	const add = (code, group, he, low, mid, high, payer, opts = {}) => {
		lines.push(Object.assign({ code, group, he, low, mid, high, payer, vat: group !== 'fee', kind: 'market' }, opts));
	};
	const fee = (code, id, he, payer, times = 1, opts = {}) => {
		const o = mgOfficial(reg, id);
		if (!o || !(o.amount >= 0)) { missing.push(id); return; }
		const v = o.amount * times;
		add(code, 'fee', he || o.he, v, v, v, payer, Object.assign({ kind: 'official', vat: Boolean(o.vat), section: o.item || o.section || '', url: o.url, unit: o.amount, times }, opts));
	};
	const market = (code, id, he, payer, times = 1, opts = {}) => {
		const x = mgMarket(reg, id);
		if (!x || x.low === null) { missing.push(id); return; }
		add(code, opts.group || 'pro', he || x.he, x.low * times, x.mid * times, x.high * times, payer, Object.assign({ kind: 'market', id, n: x.n, times }, opts));
	};

	// 1. Representation. The quote replaces the market range for side A only; legal aid replaces side A's lawyer with the
	// participation fee of the regulations (78 or 157 ₪, reg.1A); "one lawyer" is one fee for the couple, shared.
	// Mediation: each side's lawyer checks the mediated agreement; no source prices that check on its own, so it is priced as
	// a consultation meeting (lawyer_consult) and labelled so.
	const lawyerId = { agree: 'lawyer_agreement', mediate: 'lawyer_consult', compromise: 'lawyer_claim', contested: 'lawyer_contested' }[route];
	const times = route === 'compromise' ? Math.max(1, subjects.length) : 1;
	const lawyerHe = { agree: 'עורך דין: עריכת הסכם הגירושין', mediate: 'עורך דין: פגישת ייעוץ לבדיקת הסכם הגישור', compromise: `עורך דין: ${times === 1 ? 'תביעה אחת' : `${times} תביעות`} עד הפשרה`, contested: 'עורך דין: הליך מלא במחלוקת' }[route];
	const pleader = input.pleader && rb;
	const lawyerSide = (side) => {
		if (pleader) { market(`rep_${side}`, disputed ? 'pleader' : 'pleader_agreement', `טוען רבני: ${disputed ? 'ליווי התיק' : 'הסכם הגירושין'}, ${side === 'a' ? 'צד א' : 'צד ב'}`, side); return; }
		if (side === 'a' && quote !== null) {
			const v = input.quoteVat === 'incl' ? quote * 100 / (100 + vatPct) : quote;
			add('rep_a', 'pro', `${lawyerHe}, צד א (ההצעה שלכם)`, v, v, v, 'a', { kind: 'own' });
			return;
		}
		if (side === 'a' && rep === 'aid') {
			const lo = mgOfficial(reg, 'aid_low');
			const hi = mgOfficial(reg, 'aid_high');
			add('rep_a', 'fee', 'סיוע משפטי: אגרת השתתפות, צד א (שכר עורך הדין משולם בידי הסיוע)', lo.amount, hi.amount, hi.amount, 'a', { kind: 'official', vat: false, section: hi.item, url: hi.url });
			return;
		}
		if (route === 'compromise') {
			// A claim per open subject, never more than the whole contested proceeding (each bound on its own).
			const c = mgMarket(reg, 'lawyer_claim');
			const full = mgMarket(reg, 'lawyer_contested');
			if (!c || c.low === null || !full || full.low === null) { missing.push('lawyer_claim'); return; }
			add(`rep_${side}`, 'pro', `${lawyerHe}, ${side === 'a' ? 'צד א' : 'צד ב'}`, Math.min(c.low * times, full.low), Math.min(c.mid * times, full.mid), Math.min(c.high * times, full.high), side, { kind: 'market', id: 'lawyer_claim', n: c.n, times });
			return;
		}
		market(`rep_${side}`, lawyerId, `${lawyerHe}, ${side === 'a' ? 'צד א' : 'צד ב'}`, side, times);
	};
	if (rep === 'each' || rep === 'aid' || pleader) {
		lawyerSide('a');
		lawyerSide('b');
	} else if (rep === 'one') {
		// One lawyer drafts for the couple (shared); the other side checks the draft in one consultation meeting.
		if (quote !== null) {
			const v = input.quoteVat === 'incl' ? quote * 100 / (100 + vatPct) : quote;
			add('rep_one', 'pro', `${lawyerHe}, עורך דין אחד לשניכם (ההצעה שלכם)`, v, v, v, 'split', { kind: 'own' });
		} else {
			market('rep_one', lawyerId, `${lawyerHe}, עורך דין אחד לשניכם`, 'split', times);
		}
		if (route !== 'mediate') { market('rep_check_b', 'lawyer_consult', 'פגישת ייעוץ לבדיקת ההסכם אצל עורך דין אחר, צד ב', 'b'); }
	}
	// 2. The mediator, shared.
	if (route === 'mediate') { market('mediator', 'mediation_process', 'המגשר: הליך גישור שלם לזוג', 'split'); }

	// 3. Official fees by route and forum (the get is always at the rabbinical court).
	if (disputed && !input.abroad) { fee('request', rb ? 'rb_request' : 'fam_request', null, 'a'); }
	if (route === 'agree' || route === 'mediate' || route === 'compromise') {
		if (rb) {
			fee('agreement', 'rb_agreement', null, 'split');
		} else {
			fee('agreement', 'fam_agreement', null, 'split');
			fee('agreement_tr', 'fam_transcript', 'אגרת פרוטוקול על אישור ההסכם', 'split');
			fee('get_request', input.abroad ? 'rb_get_request_abroad' : 'rb_get_request', null, 'split');
		}
	}
	if (disputed) {
		if (rb || route === 'contested') { fee('divorce', 'rb_divorce', null, 'a'); fee('divorce_tr', 'rb_transcript_divorce', null, 'a'); }
		for (const s of subjects) {
			if (s === 'support') { fee('claim_support', rb ? 'rb_support' : 'fam_support', null, 'a'); if (!rb) { fee('claim_support_tr', 'fam_transcript', 'אגרת פרוטוקול על תביעת המזונות', 'a'); } }
			if (s === 'custody') { fee('claim_custody', rb ? 'rb_custody' : 'fam_custody', null, 'a'); fee('claim_custody_tr', rb ? 'rb_transcript_other' : 'fam_transcript', 'אגרת פרוטוקול על תביעת המשמורת', 'a'); }
			if (s === 'property') { fee('claim_property', rb ? 'rb_property' : 'fam_property', null, 'a'); fee('claim_property_tr', rb ? 'rb_transcript_other' : 'fam_transcript', 'אגרת פרוטוקול על התביעה הרכושית', 'a'); }
		}
	}
	fee('certificates', 'rb_certificate', 'תעודת גירושין, לכל אחד מבני הזוג', 'each');

	// 4. Experts. In a dispute each side brings its own unless the reader marks one agreed expert; the court's expert and the
	// parenting coordinator are one, shared. The welfare officer's report (תסקיר) costs the parties nothing.
	const each = disputed && !input.joint;
	const expert = (flag, id, he) => { if (input[flag]) { market(flag, id, `${he}${each ? ', לכל צד' : ''}`, each ? 'each' : 'split', 1, { group: 'expert' }); } };
	expert('actuary', 'actuary', 'אקטואר: חוות דעת לחלוקת הפנסיה והזכויות');
	expert('appraiser', 'appraiser', 'שמאי מקרקעין: חוות דעת על הדירה');
	expert('business', 'business_valuation', 'הערכת שווי לעסק או לחברה');
	if (input.courtExpert) { market('courtExpert', 'court_expert', 'מומחה מטעם בית המשפט (הערכת מסוגלות הורית)', 'split', 1, { group: 'expert' }); }
	if (input.coordinator) {
		const c = mgMarket(reg, 'coordinator_hour');
		const h = hours || 1;
		if (c && c.low !== null) { add('coordinator', 'expert', hours ? `מתאם הורי: ${hours} שעות` : 'מתאם הורי: שעה אחת (הזינו את מספר השעות)', c.low * h, c.mid * h, c.high * h, 'split', { kind: 'market', id: 'coordinator_hour', n: c.n, times: h }); } else { missing.push('coordinator_hour'); }
	}

	// 5. After the judgment, and extras.
	if (input.appeal) {
		fee('appeal_fee', rb ? 'rb_appeal' : 'district_appeal', null, 'a');
		market('appeal_lawyer', 'lawyer_appeal', 'עורך דין: ערעור', 'a');
	}
	if (input.execution) {
		fee('execution_fee', input.support ? 'exec_support' : 'exec_judgment', null, 'a');
		market('execution_lawyer', 'lawyer_execution', 'עורך דין: תיק בהוצאה לפועל', 'a');
	}
	if (input.prenup) {
		fee('prenup_notary', 'notary_prenup', null, 'split');
		market('prenup_lawyer', 'lawyer_prenup', 'עורך דין: עריכת הסכם ממון', 'split');
	}
	if (input.notary) { fee('notary', 'notary_signature', null, 'a'); }

	// 6. Totals, VAT and the two sides.
	// A line paid by "each" side is a per-side amount: the couple's total counts it twice.
	const sum = (k, f) => lines.filter(f || (() => true)).reduce((s, l) => s + l[k] * (l.payer === 'each' ? 2 : 1), 0);
	const vatOf = (k) => sum(k, (l) => l.vat) * vatPct / 100;
	const totals = {};
	for (const k of ['low', 'mid', 'high']) {
		const net = sum(k);
		const vat = vatOf(k);
		totals[k] = { net: mgR(net), vat: mgR(vat), gross: mgR(net + vat) };
	}
	const sideOf = (side, k) => lines.reduce((s, l) => {
		const v = l[k] * (l.vat ? (100 + vatPct) / 100 : 1);
		if (l.payer === 'each') { return s + v; }
		if (l.payer === side) { return s + v; }
		if (l.payer === 'split') { return s + v * (side === 'a' ? shareA : 1 - shareA); }
		return s;
	}, 0);
	const sides = { a: {}, b: {} };
	for (const k of ['low', 'mid', 'high']) { sides.a[k] = mgR(sideOf('a', k)); sides.b[k] = mgR(sideOf('b', k)); }
	// Each line's share of the expected cost, for "what raises the bill" (the reader's own selections, largest first).
	const byMid = lines.map((l) => ({ code: l.code, he: l.he, mid: mgR(l.mid * (l.vat ? (100 + vatPct) / 100 : 1) * (l.payer === 'each' ? 2 : 1)), kind: l.kind, group: l.group })).sort((a, b) => b.mid - a.mid);

	// 7. Time: the law's clock where a dispute starts with a request, and the published months of the route.
	const clock = mgClock(reg);
	const dur = mgDuration(reg, route);

	const flags = [];
	if (route === 'agree' && rep === 'one') { flags.push({ code: 'one_lawyer', he: m.one_lawyer_he }); }
	if ((route === 'agree' || route === 'mediate') && subjects.length) { flags.push({ code: 'complexity', he: m.complexity_he }); }
	if (rep === 'self') { flags.push({ code: 'self', he: m.self_he }); }
	if (pleader) { flags.push({ code: 'pleader', he: m.pleader_he }); }
	if (input.pleader && !rb) { flags.push({ code: 'pleader_family', he: m.pleader_family_he }); }
	if (disputed && input.abroad) { flags.push({ code: 'abroad', he: dc.abroad_he }); }
	if (route === 'compromise') { flags.push({ code: 'refund', he: dc.refund_he }); }
	if (quote !== null) { flags.push({ code: 'quote', he: m.quote_he }); }
	if (missing.length) { flags.push({ code: 'missing', he: m.missing_he, ids: missing }); }

	return {
		ok: true, route, forum, rep, split, pct, subjects, disputed, pleader, quote, hours, lines, totals, sides, byMid, clock, dur,
		vatPct, flags, missing, abroad: Boolean(input.abroad),
	};
}

/** The same selections on every route, for the side-by-side (expected and the range, with VAT, and the months). */
export function mgScenarios(reg, input) {
	const out = {};
	for (const r of MG_ROUTES) {
		const x = mgCompute(reg, Object.assign({}, input, { route: r }));
		out[r] = x.ok ? { low: x.totals.low.gross, mid: x.totals.mid.gross, high: x.totals.high.gross, a: x.sides.a.mid, b: x.sides.b.mid, dur: x.dur } : null;
	}
	return out;
}

/**
 * What lowers the bill, computed, never asserted: the expected saving of each change the reader can still make (the route,
 * one agreed expert, closing a subject), largest first. Only changes that save money are listed.
 */
export function mgSavings(reg, input) {
	const base = mgCompute(reg, input);
	if (!base.ok) { return []; }
	const out = [];
	const test = (code, he, over) => {
		const x = mgCompute(reg, Object.assign({}, input, over));
		if (x.ok) { const d = base.totals.mid.gross - x.totals.mid.gross; if (d > 0) { out.push({ code, he, save: d }); } }
	};
	if (input.route !== 'agree') { test('route_agree', 'לסגור הכול בהסכמה', { route: 'agree' }); }
	if (input.route === 'contested' || input.route === 'compromise') { test('route_mediate', 'לעבור לגישור', { route: 'mediate' }); }
	if (input.route === 'contested') { test('route_compromise', 'להגיע לפשרה באמצע הדרך', { route: 'compromise' }); }
	if ((input.route === 'contested' || input.route === 'compromise') && !input.joint && (input.actuary || input.appraiser || input.business)) { test('joint', 'מומחה מוסכם אחד במקום מומחה לכל צד', { joint: true }); }
	if (input.route === 'compromise' || input.route === 'contested') {
		for (const s of MG_SUBJECTS) { if (input[s]) { test(`close_${s}`, { support: 'לסגור את המזונות בהסכמה', custody: 'לסגור את המשמורת וזמני השהות בהסכמה', property: 'לסגור את הרכוש בהסכמה' }[s], { [s]: false }); } }
	}
	if (input.rep === 'each' && input.route === 'agree') { test('one', 'עורך דין אחד שמנסח, ובדיקה של ההסכם בפגישת ייעוץ לצד השני', { rep: 'one' }); }
	return out.sort((a, b) => b.save - a.save).slice(0, 5);
}

/** The analytics band: the route and the forum, never an amount. */
export function mgBandOf(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.route}-${r.forum}-${r.subjects.length}`;
}
