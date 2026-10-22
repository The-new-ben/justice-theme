/**
 * The road-accident and personal-injury wave (22.10.2026, HAD-591): the disability-degree instrument (shiklul-nechut,
 * /regulations-insurance-1956/).
 *
 * Dependency-free ES module on top of dates.js and the road-accident engine (its frozen nonPecuniary(), through the
 * namespace TE, so the pain-and-suffering share is the one the road tool computes). Every number comes from the registry:
 * reg.injury_shiklul (the 1956 regulations, chapter 5 of the National Insurance Law, the 1984 general-disability
 * regulations, the Institute's pages and circular, the curated items and the two tables of the schedule),
 * reg.rights_nechut.medical (the general-disability gates) and reg.car_accident (the 1976 non-pecuniary regulations).
 *  - An item's % is the one the schedule prints next to it (reg. 11(א)); an item with a right and a left column is read
 *    by the side, and for a left-handed person the columns swap (reg. 11(ו)). The hearing item 72(1) and the sight item
 *    52(1) are read from their two-dimensional tables. A free % stands for any other item (reg. 14 for an unlisted one).
 *  - A previous condition inside the same item is taken off it (s.120(א) of the law; the Institute's example: 30% - 10% =
 *    20%). Several items of the same joint never exceed that joint's unfavourable ankylosis (reg. 11(ג)(1)).
 *  - The weighting (reg. 11(ב)): the largest first, each next one times what the earlier ones left. Never above 100%.
 *  - Reg. 15 (a stable degree only): the increase the committee gave, up to half; under 20% the result stays at 19% or
 *    less, otherwise at 100% or less. The tool never predicts that a committee will apply it: the reader marks it.
 *  - Reg. 19א: a degree that entitles to a pension and is a fraction is rounded up; it is applied once, to the final
 *    degree (the text does not say more, and the notes say so).
 *  - What it means (ss.103-107 of the law): stable 20% or more: a monthly pension; stable 9% to under 20%: a grant of 43
 *    monthly pensions; temporary 9% or more: a pension for the period; under 9%: no payment. With the reader's daily
 *    injury allowance: the full pension is 30 times it (s.105(א)) and the pension is its share (s.106).
 *  - General disability (the 1984 regulations): the same weighting, without reg. 15 and without the items those
 *    regulations leave out, a fraction rounded up (reg. 3(ב)); the gates of reg.rights_nechut.medical.
 *  - Road accident: the 1976 regulations count the degree "by the tests" of this schedule (reg. 2(א)(2)): the degree
 *    before reg. 15, through TE.nonPecuniary (1% of the maximum per percent, less 1% a year over 30).
 *  - Dates (regs. 27-28, 36, 17 and the Institute's appeal page): the appeal 30 days from delivery, the reasons 30 more,
 *    the labour court 60 days from the appeals committee's decision; a last day on a rest day moves to the next day.
 * Every top-level name starts with "sk" (the bundle concatenates this file with instrument.js, sim-handoff.js, dates.js).
 */

import { addDays, addMonths, parseDate, offRestDays } from './dates.js';
import * as TE from './teuna-engine.js';

const skExact = (n) => Math.round(n * 1e6) / 1e6;
const skR2 = (n) => Math.round(n * 100) / 100;
const skBlank = (v) => v === '' || v === undefined || v === null;
const skHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const skPct = (n) => `${Number(skR2(n)).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
export const SK_MAX_ITEMS = 8;
export const SK_KINDS = ['stable', 'temp'];
export const SK_R15 = ['', 'q', 't', 'h', 'x'];
export const SK_TABLES = ['hear', 'see'];

/** The curated item of the schedule, or null. */
export function skItem(reg, id) {
	return (reg.injury_shiklul.items || []).find((x) => x.id === id) || null;
}

/** The column of an item with a right and a left column: by the side, swapped for a left-handed person (reg. 11(ו)). */
export function skColumn(side, lefty) {
	const right = side !== 'l';
	return (right !== Boolean(lefty)) ? 'r' : 'l';
}

/** Reg. 11(ב): the largest first, then each one times what the earlier ones left; every step for the bar. */
export function skCombine(pcts) {
	const ps = pcts.map(Number).filter((p) => p > 0).sort((a, b) => b - a);
	let rest = 100;
	const steps = [];
	for (const p of ps) {
		const add = skExact(rest * Math.min(p, 100) / 100);
		steps.push({ pct: p, from: rest, add, rest: skExact(rest - add) });
		rest = skExact(rest - add);
	}
	return { total: skExact(100 - rest), rest, steps };
}

/** The class (0-13) of a hearing loss in decibels on the table of item 72(1); 'below', 'gap' (between two classes) or a row. */
export function skHearingBand(tbl, db) {
	const v = Number(db);
	if (!(v >= 0) || v > 200) { return { kind: 'invalid' }; }
	if (v < tbl.min_db) { return { kind: 'below' }; }
	for (let i = 0; i < tbl.bands.length; i += 1) {
		const [lo, hi] = tbl.bands[i];
		if (v >= lo && (hi === null || v <= hi)) { return { kind: 'row', i }; }
		if (hi !== null && v > hi && i + 1 < tbl.bands.length && v < tbl.bands[i + 1][0]) { return { kind: 'gap', lo: i, hi: i + 1 }; }
	}
	return { kind: 'invalid' };
}

/** Item 72(1): the % for the two ears' average losses (dB), or why the table gives no single figure. */
export function skHearing(reg, a, b) {
	const t = reg.injury_shiklul.tables.hearing;
	const x = skHearingBand(t, a);
	const y = skHearingBand(t, b);
	if (x.kind === 'invalid' || y.kind === 'invalid') { return { ok: false, why: 'invalid' }; }
	if (x.kind === 'below' || y.kind === 'below') { return { ok: false, why: 'below' }; }
	if (x.kind === 'gap' || y.kind === 'gap') {
		const xs = x.kind === 'gap' ? [x.lo, x.hi] : [x.i];
		const ys = y.kind === 'gap' ? [y.lo, y.hi] : [y.i];
		const vals = [];
		xs.forEach((i) => ys.forEach((j) => { if (!vals.includes(t.grid[i][j])) { vals.push(t.grid[i][j]); } }));
		vals.sort((p, q) => p - q);
		if (vals.length === 1) { return { ok: true, pct: vals[0], row: xs[0], col: ys[0], gap: true }; }
		return { ok: false, why: 'gap', options: vals };
	}
	return { ok: true, pct: t.grid[x.i][y.i], row: x.i, col: y.i };
}

/** Item 52(1): the % for the two eyes' classes (0 = 6/6 ... 9 = no light perception). */
export function skVision(reg, a, b) {
	const t = reg.injury_shiklul.tables.vision;
	const i = Number(a);
	const j = Number(b);
	if (!(Number.isInteger(i) && i >= 0 && i < t.grid.length && Number.isInteger(j) && j >= 0 && j < t.grid.length)) { return { ok: false, why: 'invalid' }; }
	return { ok: true, pct: t.grid[i][j], row: i, col: j };
}

/** The label of an item row, for sentences and the bar. */
export function skLabel(reg, it) {
	if (it.code === 'hear') { return `ליקוי שמיעה (${reg.injury_shiklul.tables.hearing.item})`; }
	if (it.code === 'see') { return `ליקוי ראייה (${reg.injury_shiklul.tables.vision.item})`; }
	const d = it.code ? skItem(reg, it.code) : null;
	if (!d) { return 'פגימה אחרת'; }
	const area = { arm: true, hand: true, leg: true };
	return `${d.he}${d.limb || area[d.area] ? (it.side === 'l' ? ', שמאל' : ', ימין') : ''}`;
}

/**
 * input = { items: [{ code (curated id | 'hear' | 'see' | ''), pct (free %), side ('r'|'l'), prev (% of a previous
 *           condition in the same item), a, b (hearing dB of each ear | sight class of each eye) }], lefty (bool),
 *           kind ('stable'|'temp'), r15 (SK_R15), r15pct (custom increase, % of the degree), age, daily (the daily
 *           injury allowance), decided (the committee's decision), received (the day it reached the reader),
 *           appealReceived (the appeals committee's decision reached the reader), tempTo (end of a temporary degree),
 *           injury (the day of the injury) }
 */
export function skCompute(reg, input) {
	const S = reg.injury_shiklul;
	const errors = [];
	const rows = Array.isArray(input.items) ? input.items.slice(0, SK_MAX_ITEMS) : [];
	const lefty = Boolean(input.lefty);
	const kind = input.kind === 'temp' ? 'temp' : 'stable';
	const items = [];
	rows.forEach((raw, idx) => {
		const it = Object.assign({ code: '', pct: '', side: 'r', prev: '', a: '', b: '' }, raw || {});
		const code = String(it.code || '');
		const side = it.side === 'l' ? 'l' : 'r';
		const blankRow = !code && skBlank(it.pct);
		if (blankRow) { return; }
		const err = (he) => errors.push({ field: `item${idx}`, he: `פגימה ${idx + 1}: ${he}` });
		let base = null;
		let def = null;
		let table = null;
		if (code === 'hear') {
			const h = skHearing(reg, it.a, it.b);
			if (!h.ok) {
				if (h.why === 'below') { err(`הלוח של פרט ${S.tables.hearing.item} מתחיל בירידה של ${S.tables.hearing.min_db} דציבל; ירידה קטנה יותר לא מופיעה בו`); }
				else if (h.why === 'gap') { err(`הממוצע נופל בין שתי שורות בלוח (${h.options.map((v) => `${v}%`).join(' או ')}); הלוח רושם דציבלים שלמים, ולכן צריך להזין את הממוצע כפי שהוועדה רשמה אותו`); }
				else { err('ירידה בשמיעה בדציבלים, לכל אוזן: מספר בין 0 ל-200'); }
				return;
			}
			base = h.pct;
			table = { kind: 'hear', a: Number(it.a), b: Number(it.b), row: h.row, col: h.col };
		} else if (code === 'see') {
			const v = skVision(reg, it.a, it.b);
			if (!v.ok) { err('חדות הראייה של כל עין: לבחור מהרשימה'); return; }
			base = v.pct;
			table = { kind: 'see', a: Number(it.a), b: Number(it.b), row: v.row, col: v.col };
		} else if (code) {
			def = skItem(reg, code);
			if (!def) { err('פריט לא מוכר ברשימה'); return; }
			base = def.pct !== undefined ? def.pct : def[skColumn(side, lefty)];
		} else {
			const p = Number(it.pct);
			if (!(p > 0 && p <= 100)) { err('אחוז הנכות: מספר גדול מ-0 ועד 100'); return; }
			base = p;
		}
		const prev = skBlank(it.prev) ? 0 : Number(it.prev);
		if (!(prev >= 0 && prev <= 100)) { err('מצב קודם: מספר בין 0 ל-100, או ריק'); return; }
		if (prev > base) { err(`המצב הקודם (${skPct(prev)}) גדול מהאחוז של הפריט (${skPct(base)})`); return; }
		const net = skExact(base - prev);
		items.push({ idx, code, side, def, table, base, prev, net, item: def ? def.item : table ? S.tables[table.kind === 'hear' ? 'hearing' : 'vision'].item : '', label: skLabel(reg, { code, side }), joint: def && def.joint ? def.joint : '' });
	});
	if (!items.length && !errors.length) { errors.push({ field: 'items', he: 'צריך לפחות פגימה אחת: לבחור פריט מהרשימה או להזין אחוז' }); }
	const r15code = SK_R15.includes(input.r15) ? input.r15 : '';
	let r15frac = 0;
	if (r15code === 'x') {
		const p = Number(input.r15pct);
		if (skBlank(input.r15pct) || !(p > 0 && p <= 50)) { errors.push({ field: 'r15', he: `ההגדלה לפי תקנה 15: אחוז מהדרגה, יותר מ-0 ועד 50 (עד מחצית, ${S.r15.section})` }); } else { r15frac = p / 100; }
	} else if (r15code) {
		const st = S.r15.steps.find((s) => s.code === r15code);
		r15frac = st.num / st.den;
	}
	const age = skBlank(input.age) ? null : Number(input.age);
	if (age !== null && !(Number.isInteger(age) && age >= 0 && age <= 120)) { errors.push({ field: 'age', he: 'גיל: מספר שלם, או ריק' }); }
	const daily = skBlank(input.daily) ? null : Number(input.daily);
	if (daily !== null && !(daily > 0 && daily < 100000)) { errors.push({ field: 'daily', he: 'דמי פגיעה ליום: מספר חיובי, או ריק' }); }
	const dateOf = (key, he) => {
		if (skBlank(input[key])) { return null; }
		const d = parseDate(input[key]);
		if (!d) { errors.push({ field: key, he: `${he}: תאריך מלא, לדוגמה 1.10.2026` }); }
		return d;
	};
	const decided = dateOf('decided', 'יום החלטת הוועדה');
	const received = dateOf('received', 'היום שבו קיבלתם את ההחלטה');
	const appealReceived = dateOf('appealReceived', 'היום שבו קיבלתם את החלטת הוועדה לעררים');
	const tempTo = dateOf('tempTo', 'סוף תקופת הנכות הזמנית');
	const injury = dateOf('injury', 'יום הפגיעה');
	if (decided && received && received < decided) { errors.push({ field: 'received', he: 'ההחלטה לא יכולה להגיע לפני שניתנה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });

	// Reg. 11(ג)(1): the items of one joint (by side) are weighted together and capped at its unfavourable ankylosis.
	const units = [];
	const groups = {};
	for (const it of items) {
		if (it.joint) {
			const key = `${it.joint}-${it.side}`;
			(groups[key] = groups[key] || []).push(it);
		} else {
			units.push({ kind: 'item', label: it.label, item: it.item, pct: it.net, gross: it.base, members: [it], general: !skGeneralOut(reg, it) });
		}
	}
	for (const [key, members] of Object.entries(groups)) {
		const J = S.joints[members[0].joint];
		const cap = J[skColumn(members[0].side, lefty)];
		const c = skCombine(members.map((m) => m.net));
		const g = skCombine(members.filter((m) => !skGeneralOut(reg, m)).map((m) => m.base));
		const capped = c.total > cap;
		const label = members.length === 1 ? members[0].label : `${J.he} ${members[0].side === 'l' ? 'שמאל' : 'ימין'} (${members.length} פגימות)`;
		if (members.length > 1) {
			add(capped ? 'warn' : 'info', 'joint', capped
				? `${members.length} פגימות ב${J.he} ${members[0].side === 'l' ? 'שמאל' : 'ימין'}: יחד ${skPct(c.total)}, אבל לא יותר מ-${cap}% (${J.cap_he}, פרט ${J.cap_item}); הוכנס ${cap}%.`
				: `${members.length} פגימות ב${J.he} ${members[0].side === 'l' ? 'שמאל' : 'ימין'} שוקללו יחד: ${skPct(c.total)}, מתחת לתקרה של ${cap}% (${J.cap_he}, פרט ${J.cap_item}).`, S.rules.joint_cap.section, S.regs.url);
		}
		units.push({ kind: 'joint', key, label, item: members.map((m) => m.item).join(' + '), pct: Math.min(c.total, cap), raw: c.total, cap, capped, members, gross: Math.min(g.total, cap), general: g.steps.length > 0, generalPct: Math.min(g.total, cap) });
	}
	units.sort((p, q) => q.pct - p.pct);
	const comb = skCombine(units.map((u) => u.pct));
	const medical = Math.min(S.rules.item.max, comb.total);
	const anyPrev = items.some((it) => it.prev > 0);

	// Reg. 15: a stable degree only, the increase the committee gave, its limits.
	let r15 = null;
	if (r15frac && kind === 'temp') { add('info', 'r15_temp', `${S.r15.stable_he} (${S.r15.section}); ההגדלה שסימנתם לא חושבה.`, S.r15.section, S.regs.url); }
	if (r15frac && kind === 'stable') {
		const raw = skExact(medical * (1 + r15frac));
		const limit = medical < S.r15.under ? S.r15.grant_cap : S.r15.cap;
		// The increase never lowers the degree: a degree of 19% to under 20% stays as it is.
		const value = Math.max(medical, Math.min(raw, limit));
		r15 = { frac: r15frac, code: r15code, raw, limit, value, capped: raw > limit, added: skExact(value - medical) };
		if (r15.capped) { add('warn', 'r15_cap', `ההגדלה נעצרה ב-${limit}%: ${medical < S.r15.under ? `כשהדרגה פחותה מ-${S.r15.under}%, התוצאה לא תעלה על ${S.r15.grant_cap}%` : 'דרגה לא עולה על 100%'} (${S.r15.section}).`, S.r15.section, S.regs.url); }
		if (medical >= S.r15.under) { add('info', 'r15_consult', `${S.rules.consult.he} (${S.rules.consult.section}).`, S.rules.consult.section, S.regs.url); }
	}
	const degreeRaw = r15 ? r15.value : medical;
	// Reg. 19א: a degree that entitles to a pension and is a fraction is rounded up.
	const L = S.law;
	const pensionLine = kind === 'stable' ? L.pension_stable_min : L.pension_temp_min;
	const entitles = degreeRaw >= pensionLine;
	const fractional = Math.abs(degreeRaw - Math.round(degreeRaw)) > 1e-6;
	const degree = entitles && fractional ? Math.ceil(degreeRaw - 1e-9) : skR2(degreeRaw);
	const rounded = entitles && fractional;
	if (!entitles && fractional && kind === 'stable' && degreeRaw >= L.grant_min) { add('info', 'no_round_grant', `${S.rules.rounding.he} (${S.rules.rounding.section}). דרגה של ${skPct(degreeRaw)} מזכה במענק ולא בקצבה, ולכן לפי לשון התקנה היא לא מעוגלת.`, S.rules.rounding.section, S.regs.url); }

	// What the degree means for a work injury (ss.103-107).
	let outcome = 'none';
	if (kind === 'stable') { outcome = degree >= L.pension_stable_min ? 'pension' : degree >= L.grant_min ? 'grant' : 'none'; } else { outcome = degree >= L.pension_temp_min ? 'temp' : 'none'; }
	const money = { daily, full: null, monthly: null, grant: null };
	if (daily !== null) {
		money.full = skR2(daily * L.full_days);
		money.monthly = skR2(money.full * degree / 100);
		if (outcome === 'grant') { money.grant = skR2(money.monthly * L.grant_months); }
	}
	if (kind === 'stable' && medical >= S.rules.special100.min) { add('info', 'reg16', `${S.rules.special100.he} (${S.rules.special100.section}). זו החלטה של הוועדה; הכלי לא מנבא אותה.`, S.rules.special100.section, S.regs.url); }
	if (kind === 'temp' && degree < 100) { add('info', 'needy', `${S.rules.needy.he} (${S.rules.needy.section}).`, S.rules.needy.section, S.regs.url); }
	if (kind === 'temp') { add('info', 'temp', `${L.unstable_he} (${L.unstable_section}); ${S.institute.temp_he}.`, L.unstable_section, L.url); }
	if (degree >= S.rehab.min) { add('info', 'rehab', `${S.rehab.rule_he} (${S.rehab.section} לתקנות השיקום המקצועי).`, S.rehab.section, S.rehab.url); }
	if (kind === 'stable' && degree >= L.special_min) { add('info', 'special', `${L.special_he} (${L.special_section}).`, L.special_section, L.url); }
	if (kind === 'stable' && degree >= L.raise_min) { add('info', 'raise', `${L.raise_he} (${L.raise_section}); הסכום בכלי לא כולל את ההגדלה הזאת.`, L.raise_section, L.url); }
	if (outcome === 'pension') { add('info', 'capitalize', `${L.capitalize_he} (${L.capitalize_section}).`, L.capitalize_section, L.url); }
	if (anyPrev) { add('info', 'previous', `${L.previous_he} (${L.previous_section}). ${S.institute.previous_he}.`, L.previous_section, L.url); }
	if (lefty && items.some((it) => it.def && it.def.r !== undefined)) { add('info', 'lefty', `${S.rules.lefty.he} (${S.rules.lefty.section}): העמודות של פריטי היד הוחלפו.`, S.rules.lefty.section, S.regs.url); }
	if (items.some((it) => !it.code)) { add('info', 'free', `פגימה שהוזנה כאחוז חופשי נכנסת כמו שהיא; ליקוי שלא מופיע ברשימה נקבע לפי פריט דומה (${S.rules.similar.section}).`, S.rules.similar.section, S.regs.url); }

	// General disability (the 1984 regulations): the same weighting, no reg. 15, the left-out items, a fraction rounded up.
	const nc = reg.rights_nechut.medical;
	const genUnits = units.filter((u) => u.general).map((u) => ({ label: u.label, pct: u.kind === 'joint' ? u.generalPct : u.gross }));
	const genComb = skCombine(genUnits.map((u) => u.pct));
	const genRaw = Math.min(100, genComb.total);
	const genPct = Math.abs(genRaw - Math.round(genRaw)) > 1e-6 ? Math.ceil(genRaw - 1e-9) : Math.round(genRaw);
	const genSingles = items.filter((it) => !skGeneralOut(reg, it)).map((it) => it.base);
	const largest = genSingles.length ? Math.max(...genSingles) : 0;
	const genGate = genPct >= nc.min ? 'min' : (genPct >= nc.alt_min && largest >= nc.single_min) ? 'alt' : 'no';
	const genOut = items.filter((it) => skGeneralOut(reg, it));
	const general = { pct: genPct, raw: genRaw, steps: genComb.steps, gate: genGate, largest, out: genOut.map((it) => ({ item: it.item, label: it.label })), units: genUnits };

	// Road accident: the degree by the tests (before reg. 15), through the road tool's own nonPecuniary().
	const roadPct = skR2(medical);
	const np = TE.nonPecuniary(reg.car_accident, { disability: roadPct, days: 0, age: age === null ? 0 : age, death: false });
	const roadShare = np.parts.find((p) => p.key === 'disability');
	const road = { pct: roadPct, share: roadShare ? roadShare.pct : 0, raw: roadShare ? roadShare.raw : 0, ageCut: age === null ? null : np.ageCut, permanent: kind === 'stable' };

	// The dates the regulations and the Institute set.
	const A = S.appeal;
	const events = [];
	const from = received || decided;
	if (from) {
		events.push({ key: 'appeal', date: offRestDays(addDays(from, A.days)), he: `ערר לוועדה הרפואית לעררים: היום האחרון (${A.days} ימים מהיום שבו ההחלטה נמסרה)`, section: A.section, url: A.url });
		events.push({ key: 'reasons', date: offRestDays(addDays(from, A.days + A.reasons_extra)), he: `ערר שהוגש בזמן בלי נימוקים: היום האחרון לנימוקים (עוד ${A.reasons_extra} ימים)`, section: A.reasons_section, url: A.url });
	}
	if (decided) {
		const ag = S.rules.aggravation;
		events.push({ key: 'aggravation', date: addMonths(decided, ag.months), he: `מהיום הזה אפשר לבקש קביעה מחדש בגלל החמרה, עם אישור רופא (${ag.months} חודשים מהקביעה)`, section: ag.section, url: S.regs.url });
		if (kind === 'stable' && degree >= S.rules.income_review.min) {
			const ir = S.rules.income_review;
			events.push({ key: 'review_from', date: addMonths(decided, ir.from_months), he: `תחילת החלון לבקשה לפי תקנה 17 (ירידה ניכרת בהכנסות): ${ir.from_months} חודשים מהקביעה`, section: ir.section, url: S.r15.page_url });
			events.push({ key: 'review_to', date: addMonths(decided, ir.to_months), he: `סוף החלון לבקשה לפי תקנה 17: ${ir.to_months} חודשים מהקביעה`, section: ir.section, url: S.r15.page_url });
		}
	}
	if (appealReceived) { events.push({ key: 'court', date: offRestDays(addDays(appealReceived, A.court_days)), he: `ערעור לבית הדין האזורי לעבודה על החלטת הוועדה לעררים, בשאלה משפטית בלבד: היום האחרון (${A.court_days} ימים)`, section: L.court_section, url: A.url }); }
	if (tempTo && kind === 'temp') { events.push({ key: 'temp_end', date: tempTo, he: 'סוף תקופת הנכות הזמנית: מוזמנים לוועדה נוספת', section: S.rules.recheck_date.section, url: S.institute.permanent_url }); }
	events.sort((p, q) => (p.date < q.date ? -1 : p.date > q.date ? 1 : 0));
	if (received && decided && received !== decided) { add('info', 'received', `הערר נספר מהיום שבו ההחלטה נמסרה לכם (${skHe(received)}), והקביעה מחדש מיום ההחלטה (${skHe(decided)}).`, A.section, A.url); }

	return {
		ok: true, kind, lefty, items, units, steps: comb.steps, rest: comb.rest, medical, r15, degreeRaw, degree, rounded, entitles, outcome, money,
		general, road, age, decided, received, appealReceived, tempTo, injury, events, flags,
	};
}

/** True when the 1984 general-disability regulations leave this item out of their list (their schedule). */
export function skGeneralOut(reg, it) {
	const G = reg.injury_shiklul.general;
	if (it.def && it.def.general_out) { return true; }
	if (it.table && it.table.kind === 'hear') { return it.table.a <= G.hearing_out_db || it.table.b <= G.hearing_out_db; }
	if (it.table && it.table.kind === 'see') {
		const labels = reg.injury_shiklul.tables.vision.labels;
		const three = labels.indexOf(G.vision_out_except);
		return it.base <= G.vision_out_max && it.table.a !== three && it.table.b !== three;
	}
	return false;
}

/** The analytics band: kind and the degree's range only, never the items. */
export function skBand(r) {
	if (!r || !r.ok) { return 'error'; }
	const d = r.degree;
	const band = d < 9 ? 'u9' : d < 20 ? '9-19' : d < 50 ? '20-49' : d < 75 ? '50-74' : '75up';
	return `${r.kind}-${band}`;
}
