/**
 * T04 engine: CPI linkage and the Interest Adjudication Law (HAD-485).
 *
 * Dependency-free ES module. Every number comes from the registry object
 * (assets/data/justice-tools-registry.json); the engine never holds a rate or an index.
 *
 * Law: חוק פסיקת ריבית והצמדה, התשכ"א-1961, as in force from 1.1.2025 (Amendment 9):
 *  - s.1 "הפרשי הצמדה": multiply by the new (known) index, divide by the base (known) index.
 *  - s.4א(א): shekel or linked interest is added daily = updated principal x annual rate / 365.
 *  - s.4א(ב): daily interest joins the updated principal once every 12 months from the day it
 *    began to be added, and on the due date.
 *  - s.4א(ג): linked interest not yet joined carries linkage from the day it was added.
 *  - s.5, s.5א: from the due date to payment: shekel interest, plus arrears fees every 3 months
 *    from the end of 3 months after the due date, at the annual fee rate / 4, on the updated
 *    principal as at its last joining; fees never join the principal.
 *  - Amendment 9 s.117(ב): days before 1.1.2025 keep the old law. This engine computes linkage
 *    for those days and flags that old-law interest is not included.
 */

const DAY_MS = 86400000;

export function parseDate(text) {
	if (text instanceof Date) { return Date.UTC(text.getUTCFullYear(), text.getUTCMonth(), text.getUTCDate()) / DAY_MS; }
	if (typeof text === 'number') { return text; }
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	let y; let mo; let d;
	if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
		m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
		if (!m) { return null; }
		d = +m[1]; mo = +m[2]; y = +m[3];
		if (y < 100) { y += y >= 70 ? 1900 : 2000; }
	}
	if (mo < 1 || mo > 12 || d < 1 || d > 31) { return null; }
	const t = Date.UTC(y, mo - 1, d);
	const back = new Date(t);
	if (back.getUTCDate() !== d) { return null; }
	return t / DAY_MS;
}

export function ymd(day) {
	const dt = new Date(day * DAY_MS);
	return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function isoDay(day) {
	const p = ymd(day);
	return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

export function heDate(day) {
	const p = ymd(day);
	return `${p.d}.${p.m}.${p.y}`;
}

export function addMonths(day, months) {
	const p = ymd(day);
	const total = p.y * 12 + (p.m - 1) + months;
	const y = Math.floor(total / 12);
	const m = total - y * 12 + 1;
	const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
	return Date.UTC(y, m - 1, Math.min(p.d, last)) / DAY_MS;
}

function monthKey(y, m) { return `${y}-${String(m).padStart(2, '0')}`; }

function shiftMonth(key, delta) {
	const [y, m] = key.split('-').map(Number);
	const total = y * 12 + (m - 1) + delta;
	return monthKey(Math.floor(total / 12), (total % 12) + 1);
}

const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
export function heMonth(key) {
	const [y, m] = key.split('-').map(Number);
	return `${HE_MONTHS[m - 1]} ${y}`;
}

/**
 * The CPI series as one chained scale. CI(month) = published index / the product of the CBS
 * chaining coefficients from its base to the latest base, so CI(b)/CI(a) equals the official
 * "index b x coefficient / index a".
 */
export function makeCpi(cpi) {
	const values = new Map();
	const baseOf = new Map();
	const factorTo = new Map();
	const bases = cpi.bases;
	let factor = 1;
	for (let i = bases.length - 1; i >= 0; i--) {
		if (i < bases.length - 1) { factor *= bases[i].to_next; }
		factorTo.set(bases[i].id, factor);
	}
	for (const [key, value] of cpi.series) {
		values.set(key, value);
		const base = bases.find((b) => key >= b.from && key <= b.to);
		baseOf.set(key, base ? base.id : bases[bases.length - 1].id);
	}
	const first = cpi.series[0][0];
	const latest = cpi.series[cpi.series.length - 1][0];
	const knownFrom = cpi.known_from_day || 16;
	return {
		first,
		latest,
		has: (key) => values.has(key),
		value: (key) => values.get(key),
		base: (key) => baseOf.get(key),
		chained: (key) => values.get(key) / factorTo.get(baseOf.get(key)),
		/** The month whose index is the one known on this day (published by the CBS on the 15th). */
		knownMonth(day) {
			const p = ymd(day);
			return shiftMonth(monthKey(p.y, p.m), p.d >= knownFrom ? -1 : -2);
		},
		/** "Index for the month" reading, used by many contracts instead of the known index. */
		monthOf(day) { const p = ymd(day); return monthKey(p.y, p.m); },
		chainBetween(fromKey, toKey) {
			return factorTo.get(baseOf.get(fromKey)) / factorTo.get(baseOf.get(toKey));
		},
	};
}

function rateOn(rows, day) {
	const iso = isoDay(day);
	let rate = null;
	for (const row of rows) { if (row.from <= iso) { rate = row.rate; } }
	return rate;
}

function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }

/**
 * Compute linkage and interest.
 * input = { principal, start, end, mode: 'link'|'linked'|'shekel', rule: 'known'|'month',
 *           due (optional), payments: [{date, amount}] }
 * Returns { ok, total, linkage, interest, fees, paid, rows[], flags[], index{} } or { ok:false, errors[] }.
 */
export function compute(registry, input) {
	const cpi = makeCpi(registry.cpi);
	const law = registry.interest;
	const regimeStart = parseDate(law.regime_start);
	const flags = [];
	const errors = [];
	const principal = Number(input.principal);
	const start = parseDate(input.start);
	const end = parseDate(input.end);
	const mode = ['link', 'linked', 'shekel'].includes(input.mode) ? input.mode : 'link';
	const rule = input.rule === 'month' ? 'month' : 'known';
	const due = input.due ? parseDate(input.due) : null;
	if (!(principal > 0)) { errors.push({ field: 'principal', he: 'הסכום צריך להיות גדול מ-0' }); }
	if (start === null) { errors.push({ field: 'start', he: 'תאריך ההתחלה לא תקין. לדוגמה: 1.1.2025' }); }
	if (end === null) { errors.push({ field: 'end', he: 'תאריך הסיום לא תקין. לדוגמה: 12.10.2026' }); }
	if (start !== null && end !== null && end <= start) { errors.push({ field: 'end', he: 'תאריך הסיום צריך להיות אחרי תאריך ההתחלה' }); }
	if (input.due && due === null) { errors.push({ field: 'due', he: 'מועד הפירעון לא תקין' }); }
	if (due !== null && start !== null && due < start) { errors.push({ field: 'due', he: 'מועד הפירעון צריך להיות אחרי תאריך תחילת החישוב' }); }
	const payments = (input.payments || []).map((p) => ({ day: parseDate(p.date), amount: Number(p.amount) }))
		.filter((p) => p.day !== null && p.amount > 0).sort((a, b) => a.day - b.day);
	for (const p of payments) {
		if (start !== null && end !== null && (p.day <= start || p.day > end)) {
			errors.push({ field: 'payments', he: `תשלום ב-${heDate(p.day)} נמצא מחוץ לתקופת החישוב` });
		}
	}
	if (errors.length) { return { ok: false, errors }; }

	const indexMonth = (day) => (rule === 'month' ? cpi.monthOf(day) : cpi.knownMonth(day));
	if (indexMonth(start) < cpi.first) {
		return { ok: false, outOfScope: true, errors: [{ field: 'start', he: `הכלי מחשב הצמדה ממדד ${heMonth(cpi.first)} ואילך` }] };
	}
	const clampMonth = (key) => (key > cpi.latest ? cpi.latest : key);
	if (indexMonth(end) > cpi.latest) {
		flags.push({ code: 'index_not_published', he: `המדד של ${heMonth(indexMonth(end))} עוד לא פורסם. החישוב משתמש במדד האחרון שפורסם, ${heMonth(cpi.latest)}.` });
	}
	const CI = (day) => cpi.chained(clampMonth(indexMonth(day)));
	const linkedMode = mode === 'link' || mode === 'linked';
	const interestMode = mode === 'linked' || mode === 'shekel';
	if (interestMode && start < regimeStart) {
		flags.push({ code: 'old_law_period', he: 'לימים שלפני 1.1.2025 חל הנוסח הקודם של החוק (הוראת המעבר בתיקון מס\' 9). לתקופה הזו הכלי מחשב הפרשי הצמדה בלבד, בלי הריבית לפי הדין הקודם, ולכן הסכום בפועל גבוה יותר.' });
	}
	const arrearsBegins = due !== null && due < end ? Math.max(due, regimeStart) : null;
	if (due !== null && due < regimeStart && due < end) {
		flags.push({ code: 'old_law_arrears', he: 'מועד הפירעון לפני 1.1.2025: ריבית הפיגורים לפי הדין הקודם עד 31.12.2024 לא נכללה. מ-1.1.2025 נוספים ריבית שקלית ודמי פיגורים, ומניין שלושת החודשים מתחיל ב-1.1.2025 (סעיף 117(ב)(2) לתיקון מס\' 9).' });
	}

	// Days that open a new line in the court-style table.
	const interestBegins = Math.max(start, regimeStart);
	const cutSet = new Set([start, end]);
	payments.forEach((p) => cutSet.add(p.day));
	if (due !== null && due > start && due < end) { cutSet.add(due); }
	if (arrearsBegins !== null) { cutSet.add(arrearsBegins); }
	if (interestMode || arrearsBegins !== null) {
		if (regimeStart > start && regimeStart < end) { cutSet.add(regimeStart); }
		for (const row of law.linked) {
			const d = parseDate(row.from);
			if (d > start && d < end) { cutSet.add(d); }
		}
	}
	const joinDays = new Set();
	if (interestMode && interestBegins < end) {
		const stop = arrearsBegins !== null ? arrearsBegins : end;
		for (let k = 1; ; k++) {
			const d = addMonths(interestBegins, 12 * k);
			if (d >= stop) { break; }
			joinDays.add(d); cutSet.add(d);
		}
	}
	const feeDays = new Set();
	if (arrearsBegins !== null) {
		for (let k = 1; ; k++) {
			const d = addMonths(arrearsBegins, 12 * k);
			if (d >= end) { break; }
			joinDays.add(d); cutSet.add(d);
		}
		for (let k = 1; ; k++) {
			const d = addMonths(arrearsBegins, 3 * k);
			if (d > end) { break; }
			feeDays.add(d); cutSet.add(d);
		}
	}
	const cuts = [...cutSet].sort((a, b) => a - b);

	// State. Before the arrears period, linked amounts are held in index units (amount / CI),
	// so the linkage of the principal and of interest not yet joined is exact (s.4א(ג)).
	let inArrears = false;
	let P = linkedMode ? principal / CI(start) : principal; // updated principal
	let A = 0; // daily interest added and not yet joined
	let fees = 0;
	let joinedPrincipal = null; // updated principal as at the last joining, nominal (s.5א(ב))
	let paid = 0;
	let overpaid = 0;
	let interestTotal = 0;
	const interestByKind = { linked: 0, shekel: 0 };
	let linkageTotal = 0;
	const units = () => linkedMode && !inArrears;
	const nominal = (x, day) => (units() ? x * CI(day) : x);
	const rows = [];

	const applyEvents = (day) => {
		const ev = { join: false, arrears: false, payment: 0, fee: 0 };
		if (joinDays.has(day) || (due !== null && day === due && interestMode)) {
			P += A; A = 0; ev.join = true;
			joinedPrincipal = nominal(P, day);
		}
		if (arrearsBegins !== null && day === arrearsBegins && !inArrears) {
			if (A) { P += A; A = 0; ev.join = true; }
			if (units()) { P *= CI(day); A *= CI(day); }
			inArrears = true;
			joinedPrincipal = P;
			ev.arrears = true;
		}
		for (const p of payments) {
			if (p.day !== day) { continue; }
			paid += p.amount;
			ev.payment += p.amount;
			let rest = units() ? p.amount / CI(day) : p.amount;
			const fromP = Math.min(P, rest); P -= fromP; rest -= fromP;
			const fromA = Math.min(A, rest); A -= fromA; rest -= fromA;
			let restNominal = units() ? rest * CI(day) : rest;
			const fromF = Math.min(fees, restNominal); fees -= fromF; restNominal -= fromF;
			overpaid += restNominal;
		}
		if (feeDays.has(day)) {
			const rate = rateOn(law.arrears_fee, day);
			const fee = (joinedPrincipal ?? P) * rate / 100 / 4;
			fees += fee;
			ev.fee = fee;
		}
		return ev;
	};

	for (let i = 0; i < cuts.length - 1; i++) {
		const a = cuts[i];
		const b = cuts[i + 1];
		const ev = applyEvents(a);
		const openTotal = nominal(P + A, a) + fees;
		const openPrincipal = nominal(P, a);
		const linkage = units() ? (P + A) * (CI(b) - CI(a)) : 0;
		let rate = null;
		let kind = null;
		if (inArrears) { rate = rateOn(law.shekel, a); kind = 'shekel'; } else if (a >= regimeStart && mode === 'shekel') {
			rate = rateOn(law.shekel, a); kind = 'shekel';
		} else if (a >= regimeStart && mode === 'linked') { rate = rateOn(law.linked, a); kind = 'linked'; }
		const days = b - a;
		const added = rate !== null ? P * rate / 100 / 365 * days : 0;
		A += added;
		const interest = units() ? added * CI(b) : added;
		interestTotal += interest;
		if (kind) { interestByKind[kind] += interest; }
		linkageTotal += linkage;
		rows.push({
			from: isoDay(a), to: isoDay(b), days,
			openPrincipal: round2(openPrincipal), openTotal: round2(openTotal),
			indexFrom: units() ? clampMonth(indexMonth(a)) : null,
			indexTo: units() ? clampMonth(indexMonth(b)) : null,
			linkage: round2(linkage), rate, kind, interest: round2(interest),
			join: ev.join, arrears: ev.arrears, payment: round2(ev.payment), fee: round2(ev.fee),
			closeTotal: round2(nominal(P + A, b) + fees),
		});
	}
	const before = nominal(P + A, end) + fees;
	const last = applyEvents(end);
	if (last.payment || last.fee) {
		rows.push({
			from: isoDay(end), to: isoDay(end), days: 0,
			openPrincipal: round2(nominal(P, end)), openTotal: round2(before),
			indexFrom: null, indexTo: null, linkage: 0, rate: null, kind: null, interest: 0,
			join: last.join, arrears: last.arrears, payment: round2(last.payment), fee: round2(last.fee),
			closeTotal: round2(nominal(P + A, end) + fees),
		});
	}
	const total = nominal(P + A, end) + fees;
	const firstKey = clampMonth(indexMonth(start));
	const lastKey = clampMonth(indexMonth(arrearsBegins !== null ? arrearsBegins : end));
	const ratio = cpi.chained(lastKey) / cpi.chained(firstKey);
	return {
		ok: true,
		mode, rule,
		total: round2(Math.max(total, 0)),
		principal: round2(principal),
		paid: round2(paid),
		overpaid: round2(overpaid),
		linkage: round2(linkageTotal),
		interest: round2(interestTotal),
		interestLinked: round2(interestByKind.linked),
		interestShekel: round2(interestByKind.shekel),
		fees: round2(fees),
		index: {
			from: { month: firstKey, value: cpi.value(firstKey), base: cpi.base(firstKey) },
			to: { month: lastKey, value: cpi.value(lastKey), base: cpi.base(lastKey) },
			chain: cpi.chainBetween(firstKey, lastKey),
			ratio,
			changePct: Math.round((ratio - 1) * 1000) / 10,
		},
		rows,
		flags,
		start: isoDay(start), end: isoDay(end), due: due !== null ? isoDay(due) : null,
		arrearsFrom: arrearsBegins !== null ? isoDay(arrearsBegins) : null,
	};
}

/** Linkage of one amount between two dates, as the CBS linkage calculator states it. */
export function linkAmount(registry, amount, from, to, rule = 'known') {
	const r = compute(registry, { principal: amount, start: from, end: to, mode: 'link', rule });
	return r.ok ? r.total : null;
}
