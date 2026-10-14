/**
 * Property balancing between spouses (איזון משאבים), family wave (HAD-506). Dependency-free ES module.
 *
 * The law, read on registry.property_balance.checked_on (חוק יחסי ממון בין בני זוג, התשל"ג-1973, Nevo current version):
 *  - s.3: the balancing regime applies unless a property agreement (s.1-2) says otherwise.
 *  - s.5(א): each spouse is entitled to half of the value of all the spouses' assets, except (1) assets held on the eve
 *    of the marriage or received as a gift or an inheritance during it, (2) National Insurance benefits and statutory
 *    compensation for bodily injury or death, (3) assets the spouses agreed in writing not to balance.
 *  - s.5(ג): "all the assets" include future pension rights, severance pay, study funds (keren hishtalmut), provident
 *    funds and savings.
 *  - s.5א: balancing before the marriage ends, on a request, once a year has passed since a divorce or property
 *    proceeding opened, or after a break / living apart (even under one roof) for 9 months out of 12; a court may
 *    shorten the periods or bring the date forward (s.5א(ב)).
 *  - s.6(א)-(ב): value each spouse's balanceable assets, deduct that spouse's debts (except debts tied to excluded
 *    assets); the richer spouse gives the other half of the difference, in kind or in money.
 *  - s.6א: a family home is not sold for the balance until the minor children and the parent holding them have
 *    another suitable home.
 *  - s.7: assets given away or hidden to defeat the balance may be counted as still held.
 *  - s.8: in special circumstances the court may exclude more assets, depart from half (also by future assets and
 *    earning capacity), value at an earlier date, or balance the assets held at an earlier date.
 *  - s.14: not for couples married before 1.1.1974.
 * Options, RSUs and crypto have no statutory formula: the tool shows the approaches courts use (registry
 * property_balance.options.methods, each with its source) as a range, never one figure. A business and its goodwill
 * are flagged, never valued.
 */

import { fDay, fMs, fIsoOf, fIsIso, fR2, fEntered, fVal, fAddMonths } from './family-common.js';

export const IZ_KINDS = ['home', 'pension', 'severance', 'hishtalmut', 'gemel', 'savings', 'car', 'business', 'other', 'debt'];
export const IZ_EXCLUDE = ['', 'premarital', 'gift', 'inheritance', 'nii', 'agreed'];

/** Months between two ISO days (whole and part), never negative. */
export function izMonths(a, b) {
	if (!fIsIso(a) || !fIsIso(b) || fMs(b) <= fMs(a)) { return 0; }
	return (fMs(b) - fMs(a)) / fDay / (365.2425 / 12);
}

/** The earliest day a spouse may ask for balancing before the divorce (s.5א(א)), from what is known. */
export function izEarly(pb, input) {
	const out = [];
	const e = pb.early;
	if (fIsIso(input.filed)) {
		out.push({ key: 'filed', date: fAddMonths(input.filed, 12 * e.proceeding_years), section: e.sections.proceeding });
	}
	if (fIsIso(input.apart)) {
		out.push({ key: 'apart', date: fAddMonths(input.apart, e.apart_months), section: e.sections.apart });
	}
	out.sort((x, y) => (x.date < y.date ? -1 : 1));
	return out;
}

/**
 * Options and RSUs granted to one spouse: the value of the units, and the part that is balanced under each approach.
 * g = { owner, units, price (per unit today), strike (0 for RSU), grant (ISO), vestStart (ISO), vestEnd (ISO),
 *       tranches (equal vesting tranches, e.g. 4 or 16) }.
 * Approaches (pb.options.methods): 'granted' every unit granted before the break date; 'time' each tranche by the
 * share of its vesting period that fell inside the marriage and before the break date; 'vested' only the units
 * vested by the break date.
 */
export function izOptions(pb, g, marriage, breakDate) {
	const units = fVal(g.units);
	const spread = Math.max(0, fVal(g.price) - fVal(g.strike));
	const tranches = Math.max(1, Math.round(fVal(g.tranches) || 1));
	const per = units / tranches;
	const start = g.vestStart || g.grant;
	const end = g.vestEnd || g.grant;
	const span = Math.max(0, fMs(end) - fMs(start));
	const [sy, sm, sd] = String(start).split('-').map(Number);
	const [ey, em, ed] = String(end).split('-').map(Number);
	const wholeMonths = sd === ed ? (ey * 12 + em) - (sy * 12 + sm) : 0;
	// Granted inside the marriage and before the break date: the "granted" approach balances all of them.
	const grantedInMarriage = fIsIso(g.grant) && g.grant >= marriage && g.grant <= breakDate;
	let vested = 0;
	let time = 0;
	const rows = [];
	for (let i = 1; i <= tranches; i += 1) {
		// Vesting days on the calendar: with whole months from start to end (the usual grant letter), each tranche vests
		// on the same day of a month; otherwise the period is split evenly by days.
		const vestIso = tranches === 1 ? end : (wholeMonths && (wholeMonths * i) % tranches === 0
			? fAddMonths(start, (wholeMonths * i) / tranches)
			: fIsoOf(Math.round((fMs(start) + span * (i / tranches)) / fDay) * fDay));
		const vestT = fMs(vestIso);
		// The time rule: the share of this tranche's period (grant to vesting) that fell inside the marriage and before
		// the break date.
		const from = Math.max(fMs(g.grant), fMs(marriage));
		const to = Math.min(vestT, fMs(breakDate));
		const whole = vestT - fMs(g.grant);
		const frac = whole <= 0
			? (vestT >= fMs(marriage) && vestT <= fMs(breakDate) ? 1 : 0)
			: Math.max(0, Math.min(1, (to - from) / whole));
		// Vested inside the marriage, by the break date (a tranche vested before the marriage is the spouse's own).
		const vestedHere = vestT <= fMs(breakDate) && vestT >= fMs(marriage) && fMs(g.grant) <= fMs(breakDate);
		if (vestedHere) { vested += per; }
		time += per * frac;
		rows.push({ vest: vestIso, units: fR2(per), frac: fR2(frac), vested: vestedHere });
	}
	const granted = grantedInMarriage ? units : 0;
	return {
		units, spread, tranches, rows,
		value: fR2(units * spread),
		balanced: { granted: fR2(granted * spread), time: fR2(time * spread), vested: fR2(vested * spread) },
		units_by: { granted: fR2(granted), time: fR2(time), vested: fR2(vested) },
	};
}

/** Crypto held by one spouse: the value on the break date and today; the law's default is the value at balancing. */
export function izCrypto(c) {
	const units = fVal(c.units);
	return { units, atBreak: fR2(units * fVal(c.priceBreak)), today: fR2(units * fVal(c.priceToday)), where: c.where === 'wallet' ? 'wallet' : 'exchange' };
}

/**
 * input = {
 *   marriage (ISO), breakDate (ISO, the break / filing date the court is likely to use), filed (ISO, optional),
 *   apart (ISO, optional), before1974 (bool),
 *   items: [{ kind, owner ('a'|'b'|'joint'), value, atMarriage (pension etc.: value on the marriage day, optional),
 *             exclude (EXCLUDE), mortgage (home: the loan balance), linked (debt: tied to an excluded asset), label }],
 *   options: [{ owner, units, price, strike, grant, vestStart, vestEnd, tranches }],
 *   crypto: [{ owner, units, priceBreak, priceToday, where ('exchange'|'wallet') }],
 *   method ('time' | 'granted' | 'vested': the options approach used for the headline), cryptoAt ('today' | 'break')
 * }
 * items[].activeGain: for an asset from before the marriage, the increase in value made by effort during it (balanced).
 */
export function computeBalance(registry, input) {
	const pb = registry.property_balance;
	const errors = [];
	if (input.before1974) {
		return { ok: false, outOfScope: true, errors: [{ field: 'before1974', he: pb.pre1974_he }] };
	}
	const marriage = input.marriage;
	const breakDate = input.breakDate;
	if (!fIsIso(marriage)) { errors.push({ field: 'marriage', he: 'תאריך הנישואין לא תקין. לדוגמה: 1.6.2012' }); }
	if (!fIsIso(breakDate)) { errors.push({ field: 'breakDate', he: 'מועד הקרע לא תקין. לדוגמה: 1.3.2026' }); }
	if (fIsIso(marriage) && fIsIso(breakDate) && breakDate <= marriage) { errors.push({ field: 'breakDate', he: 'מועד הקרע צריך לבוא אחרי הנישואין' }); }
	if (fIsIso(marriage) && marriage < pb.from) { return { ok: false, outOfScope: true, errors: [{ field: 'marriage', he: pb.pre1974_he }] }; }
	for (const k of ['filed', 'apart']) {
		if (fEntered(input[k]) && !fIsIso(input[k])) { errors.push({ field: k, he: 'תאריך לא תקין. לדוגמה: 1.3.2026' }); } else if (fIsIso(input[k]) && fIsIso(marriage) && input[k] < marriage) { errors.push({ field: k, he: 'התאריך לפני הנישואין' }); }
	}
	const items = (input.items || []).filter((it) => it && (fEntered(it.value) || fEntered(it.mortgage) || fEntered(it.atMarriage) || fEntered(it.activeGain)));
	items.forEach((it, i) => {
		for (const f of ['value', 'mortgage', 'atMarriage']) {
			if (fEntered(it[f]) && !(Number(it[f]) >= 0 && Number(it[f]) < 1e11)) { errors.push({ field: `item-${i}-${f}`, he: 'סכום: מספר חיובי' }); }
		}
		if (!IZ_KINDS.includes(it.kind)) { errors.push({ field: `item-${i}-kind`, he: 'סוג נכס לא מוכר' }); }
		if (!['a', 'b', 'joint'].includes(it.owner)) { errors.push({ field: `item-${i}-owner`, he: 'על שם מי הנכס' }); }
		if (it.kind === 'home' && fEntered(it.mortgage) && !fEntered(it.value)) { errors.push({ field: `item-${i}-value`, he: 'הזנתם משכנתא בלי שווי הדירה: בלי השווי אי אפשר לאזן' }); }
		if (fEntered(it.atMarriage) && !fEntered(it.value) && it.kind !== 'home') { errors.push({ field: `item-${i}-value`, he: 'חסר השווי היום: בלי השווי אי אפשר לחשב את החלק שנצבר בנישואין' }); }
		if (fEntered(it.atMarriage) && fEntered(it.value) && Number(it.atMarriage) > Number(it.value)) { errors.push({ field: `item-${i}-atMarriage`, he: 'הסכום ביום הנישואין גבוה מהשווי היום' }); }
		if (fEntered(it.activeGain) && !(Number(it.activeGain) >= 0 && Number(it.activeGain) <= fVal(it.value))) { errors.push({ field: `item-${i}-activeGain`, he: 'עליית הערך האקטיבית: בין 0 לשווי הנכס' }); }
	});
	// A strike of 0 alone is the RSU default and says nothing; any other entered field makes it a holding to validate.
	const opts = (input.options || []).filter((g) => g && (['units', 'price', 'grant', 'vestStart', 'vestEnd', 'tranches'].some((f) => fEntered(g[f])) || (fEntered(g.strike) && Number(g.strike) !== 0)));
	opts.forEach((g, i) => {
		for (const f of ['units', 'price', 'strike', 'tranches']) {
			if (fEntered(g[f]) && !(Number(g[f]) >= 0 && Number(g[f]) < 1e11)) { errors.push({ field: `opt-${i}-${f}`, he: 'מספר חיובי' }); }
		}
		for (const f of ['grant', 'vestStart', 'vestEnd']) {
			if (!fIsIso(g[f])) { errors.push({ field: `opt-${i}-${f}`, he: 'תאריך לא תקין. לדוגמה: 1.3.2024' }); }
		}
		if (fIsIso(g.vestStart) && fIsIso(g.vestEnd) && g.vestEnd < g.vestStart) { errors.push({ field: `opt-${i}-vestEnd`, he: 'סוף ההבשלה לפני תחילתה' }); }
		if (fIsIso(g.grant) && fIsIso(g.vestStart) && g.vestStart < g.grant) { errors.push({ field: `opt-${i}-vestStart`, he: 'ההבשלה מתחילה לפני ההענקה' }); }
		if (!['a', 'b'].includes(g.owner)) { errors.push({ field: `opt-${i}-owner`, he: 'למי הוענקו' }); }
		if (fEntered(g.tranches) && !(Number.isInteger(Number(g.tranches)) && Number(g.tranches) >= 1 && Number(g.tranches) <= 120)) { errors.push({ field: `opt-${i}-tranches`, he: 'מספר המנות: מספר שלם, 1 ומעלה' }); }
		if (!fEntered(g.price)) { errors.push({ field: `opt-${i}-price`, he: 'מחיר ליחידה היום: בלי מחיר אי אפשר להעריך את האופציות' }); }
		if (!fEntered(g.units)) { errors.push({ field: `opt-${i}-units`, he: 'כמה יחידות הוענקו' }); }
	});
	const cry = (input.crypto || []).filter((c) => c && ['units', 'priceBreak', 'priceToday'].some((f) => fEntered(c[f])));
	cry.forEach((c, i) => {
		for (const f of ['units', 'priceBreak', 'priceToday']) {
			if (!(fEntered(c[f]) && Number(c[f]) >= 0 && Number(c[f]) < 1e11)) { errors.push({ field: `cry-${i}-${f}`, he: 'מספר חיובי' }); }
		}
		if (!['a', 'b'].includes(c.owner)) { errors.push({ field: `cry-${i}-owner`, he: 'על שם מי' }); }
	});
	if (errors.length) { return { ok: false, errors }; }

	const method = ['time', 'granted', 'vested'].includes(input.method) ? input.method : 'time';
	const cryptoAt = input.cryptoAt === 'break' ? 'break' : 'today';
	const side = { a: { in: 0, out: 0, debts: 0 }, b: { in: 0, out: 0, debts: 0 } };
	const lines = [];
	const flags = [];
	const S = pb.sections;
	const addTo = (owner, amount, inBalance) => {
		const parts = owner === 'joint' ? [['a', amount / 2], ['b', amount / 2]] : [[owner, amount]];
		for (const [o, v] of parts) { side[o][inBalance ? 'in' : 'out'] += v; }
	};
	const marriedMonths = izMonths(marriage, breakDate);
	for (const it of items) {
		const v = fVal(it.value);
		const label = it.label || pb.kinds[it.kind].he;
		if (it.kind === 'debt') {
			const dEx = IZ_EXCLUDE.includes(it.exclude) && it.exclude ? it.exclude : '';
			const linked = Boolean(it.linked) || Boolean(dEx);
			if (!linked) {
				if (it.owner === 'joint') { side.a.debts += v / 2; side.b.debts += v / 2; } else { side[it.owner].debts += v; }
			}
			lines.push({ kind: 'debt', owner: it.owner, label, value: -v, inBalance: !linked, counted: linked ? 0 : -v, why: dEx ? pb.exclude[dEx].he : linked ? pb.why.debt_linked_he : pb.why.debt_he, section: dEx ? pb.exclude[dEx].section : S.debts });
			continue;
		}
		if (it.kind === 'business') {
			flags.push({ code: 'business', he: pb.flags.business_he });
		}
		let counted = v;
		let why = pb.kinds[it.kind].why_he;
		let section = pb.kinds[it.kind].section;
		let estimate = false;
		const excl = IZ_EXCLUDE.includes(it.exclude) ? it.exclude : '';
		if (excl) {
			counted = 0;
			why = pb.exclude[excl].he;
			section = pb.exclude[excl].section;
			// An asset from before the marriage: its active increase in value during the marriage is balanced, net of its
			// value on the eve of the marriage and of passive increase (3462/23, paras. 25 and 29). Gifts and inheritance: open.
			if (excl === 'premarital' && fVal(it.activeGain) > 0) {
				counted = Math.min(v, fVal(it.activeGain));
				why = pb.why.active_gain_he;
			}
			if (it.kind === 'home') { flags.push({ code: 'home_excluded', he: pb.flags.home_excluded_he }); }
		} else if (['pension', 'severance', 'hishtalmut', 'gemel'].includes(it.kind)) {
			// Only what accrued during the marriage (to the break date) is balanced: the part held on the eve of the marriage
			// is excluded (s.5(א)(1)). With no figure for the marriage day, nothing is deducted and the line says so.
			if (fEntered(it.atMarriage)) {
				counted = Math.max(0, v - fVal(it.atMarriage));
				why = pb.why.accrued_he;
			} else {
				why = pb.why.accrued_unknown_he;
				estimate = true;
			}
		}
		if (it.kind === 'home' && fVal(it.mortgage) > 0) {
			// The loan on the home is a debt of its owner(s); on an excluded home it is not deducted (s.6(א)).
			const m = fVal(it.mortgage);
			const tied = Boolean(excl);
			if (!tied) {
				if (it.owner === 'joint') { side.a.debts += m / 2; side.b.debts += m / 2; } else { side[it.owner].debts += m; }
			}
			lines.push({ kind: 'mortgage', owner: it.owner, label: pb.kinds.home.mortgage_he, value: -m, inBalance: !tied, counted: tied ? 0 : -m, why: tied ? pb.why.debt_linked_he : pb.why.debt_he, section: S.debts });
		}
		if (it.kind === 'home' && it.owner !== 'joint' && !excl) {
			flags.push({ code: 'home_one_name', he: pb.flags.home_one_name_he });
		}
		addTo(it.owner, counted, true);
		if (v - counted > 0) { addTo(it.owner, v - counted, false); }
		lines.push({ kind: it.kind, owner: it.owner, label, value: v, inBalance: counted > 0, counted: fR2(counted), why, section, estimate, exclude: excl });
		if (it.kind === 'pension' && counted > 0) { flags.push({ code: 'pension', he: pb.flags.pension_split_he }); }
	}
	// Options and RSUs: the headline uses the chosen approach, the range shows all three.
	const optRows = [];
	for (const g of opts) {
		const o = izOptions(pb, g, marriage, breakDate);
		optRows.push(Object.assign({ owner: g.owner }, o));
		side[g.owner].in += o.balanced[method];
		side[g.owner].out += Math.max(0, o.value - o.balanced[method]);
		lines.push({ kind: 'options', owner: g.owner, label: pb.options.he, value: o.value, inBalance: o.balanced[method] > 0, counted: o.balanced[method], why: pb.options.methods[method].he, section: pb.options.methods[method].source_short, range: o.balanced });
	}
	if (optRows.length) { flags.push({ code: 'options', he: pb.flags.options_he }); }
	const cryRows = [];
	for (const c of cry) {
		const x = izCrypto(c);
		cryRows.push(Object.assign({ owner: c.owner }, x));
		const val = cryptoAt === 'break' ? x.atBreak : x.today;
		side[c.owner].in += val;
		lines.push({ kind: 'crypto', owner: c.owner, label: pb.crypto.he, value: val, inBalance: val > 0, counted: val, why: cryptoAt === 'break' ? pb.crypto.at_break_he : pb.crypto.at_today_he, section: cryptoAt === 'break' ? S.earlier_date : S.balance, range: { break: x.atBreak, today: x.today }, where: x.where });
	}
	if (cryRows.length) {
		flags.push({ code: 'crypto', he: pb.flags.crypto_he });
		if (cryRows.some((c) => c.where === 'wallet')) { flags.push({ code: 'wallet', he: pb.flags.wallet_he }); }
	}
	// Personal debts reduce a spouse's balanced worth to zero at most: the excess is not passed to the other spouse,
	// since there is no general sharing of personal debts (6839/19, paras. 15-16). rawNet keeps the real figure.
	const net = (s) => fR2(Math.max(0, s.in - s.debts));
	const A = { balanced: fR2(side.a.in), excluded: fR2(side.a.out), debts: fR2(side.a.debts), net: net(side.a), rawNet: fR2(side.a.in - side.a.debts) };
	const B = { balanced: fR2(side.b.in), excluded: fR2(side.b.out), debts: fR2(side.b.debts), net: net(side.b), rawNet: fR2(side.b.in - side.b.debts) };
	if (A.rawNet < 0 || B.rawNet < 0) { flags.push({ code: 'debts_exceed', he: pb.flags.debts_exceed_he }); }
	const diff = fR2(A.net - B.net);
	const pay = fR2(Math.abs(diff) / 2);
	const payer = diff > 0 ? 'a' : diff < 0 ? 'b' : null;

	// The range: the same family under each options approach and each crypto date.
	const variants = [];
	for (const m of input._inner ? [] : ['vested', 'time', 'granted']) {
		for (const at of cry.length ? ['break', 'today'] : [cryptoAt]) {
			if (!opts.length && m !== method) { continue; }
			const rr = m === method && at === cryptoAt ? null : computeBalance(registry, Object.assign({}, input, { method: m, cryptoAt: at, _inner: true }));
			const d = rr ? rr.diff : diff;
			variants.push({ method: m, cryptoAt: at, diff: d, pay: fR2(Math.abs(d) / 2), payer: d > 0 ? 'a' : d < 0 ? 'b' : null });
		}
	}
	const signed = variants.map((v) => v.diff);
	const range = signed.length ? { min: Math.min(...signed), max: Math.max(...signed) } : { min: diff, max: diff };
	// A home in one name (or excluded as premarital, a gift or an inheritance): the same family if specific sharing in it
	// were proven, i.e. the home owned half each, outside the balance (1398/11; 5620/24).
	// Only the family home is the disputed one: the item marked main, or else the first home; any other property keeps
	// its owner and its exclusion (review, PR 130).
	let sharedHome = null;
	const all = input.items || [];
	let homeAt = all.findIndex((it) => it && it.kind === 'home' && it.main);
	if (homeAt < 0) { homeAt = all.findIndex((it) => it && it.kind === 'home'); }
	const disputed = homeAt >= 0 ? all[homeAt] : null;
	const oneName = Boolean(disputed) && (disputed.owner !== 'joint' || (IZ_EXCLUDE.includes(disputed.exclude) && Boolean(disputed.exclude)));
	if (oneName && !input._inner) {
		const alt = computeBalance(registry, Object.assign({}, input, { _inner: true, items: all.map((it, i) => (i === homeAt ? Object.assign({}, it, { owner: 'joint', exclude: '', activeGain: '' }) : it)) }));
		if (alt.ok) { sharedHome = { diff: alt.diff, pay: alt.pay, payer: alt.payer }; flags.push({ code: 'home_shared', he: pb.flags.home_shared_he }); }
	}
	if (marriedMonths < 12) { flags.push({ code: 'short', he: pb.flags.short_marriage_he }); }
	flags.push({ code: 'deviate', he: pb.flags.deviate_he });
	const early = izEarly(pb, input);
	return {
		ok: true, a: A, b: B, diff, pay, payer, method, cryptoAt, lines, options: optRows, crypto: cryRows,
		range, variants, sharedHome, flags: izDedupe(flags), early, marriedMonths: fR2(marriedMonths),
	};
}

function izDedupe(flags) {
	const seen = new Set();
	return flags.filter((f) => (seen.has(f.code) ? false : (seen.add(f.code), true)));
}
