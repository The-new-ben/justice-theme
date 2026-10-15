/**
 * Golden tests for the divorce-world apps (HAD-539). Run: node tests/js/test-divorce-world.mjs
 *
 * The custody calendar: the nights of each pattern and the handovers they cost, counted by hand; a year of 365 nights
 * from a Sunday (26 cycles of two weeks and one night more); the holidays laid over it through the parenting engine,
 * with Rosh Hashana 5788 (1-2 Tishri = the nights of 1.10 and 2.10.2027) checked against the week-week schedule.
 * The tracker: the due days, the oldest-first allocation of payments (hand sums), the CPI update of the amount against
 * the CBS chaining of the registry and against the family engine's indexSupport, and the arrears against the wave-1
 * linkage-and-interest engine, which is golden against the CBS calculator.
 * The roadmap: the fees of every route summed by hand from the fee regulations, the statutory clock from 1.11.2026
 * (45, 60 and 15 days, no holiday pause in November-December), the steps each route carries, and the progress.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as LU from '../../assets/js/tools/luach-engine.js';
import * as LUUI from '../../assets/js/tools/luach-ui.js';
import * as MK from '../../assets/js/tools/maakav-engine.js';
import * as MKUI from '../../assets/js/tools/maakav-ui.js';
import * as MP from '../../assets/js/tools/mapat-engine.js';
import * as MPUI from '../../assets/js/tools/mapat-ui.js';
import * as MZ from '../../assets/js/tools/mezonot-engine.js';
import * as T04 from '../../assets/js/tools/hatzmada-engine.js';
import * as GE from '../../assets/js/tools/gerushin-engine.js';
import { ics, decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.011) => Math.abs(a - b) <= eps;

/* ---------- The calendar: patterns, by hand ---------- */
{
	check(LU.luNights('two_two_three').join('') === 'AABBAAABBAABBB', '2-2-3: A A B B A A A | B B A A B B B');
	check(LU.luNights('two_two_five').join('') === 'BAABBAAAAABBBB' && LU.luNights('week_week').join('') === 'AAAAAAABBBBBBB', '2-2-5-5 and week-week nights');
	const hand = { two_two_three: 6, two_two_five: 4, week_week: 2, three_four: 4, weekends_2mid: 8, weekends_mid: 6, weekends: 2 };
	for (const [k, n] of Object.entries(hand)) { check(LU.luHandovers(LU.luNights(k)) === n, `${k}: ${n} handovers in two weeks (engine ${LU.luHandovers(LU.luNights(k))})`); }
	check(LU.luNights('custom', [0, 13, 99, -1, 2.5]).join('') === 'ABBBBBBBBBBBBA', 'custom: only whole nights 0-13 count');
	check(Object.keys(LU.LU_PATTERNS).length === 7 && LU.luCompare().map((c) => c.handovers).join() === '6,4,2,4,8,6,2', 'the comparison table carries the seven patterns with their handovers');
	check(LU.luSunday('2026-11-03') === '2026-11-01' && LU.luSunday('2026-11-01') === '2026-11-01' && LU.luSunday('2026-11-07') === '2026-11-01', 'the Sunday on or before a day');
}

/* ---------- The calendar: a year of nights ---------- */
{
	// 1.11.2026 is a Sunday. 365 nights = 26 cycles of 14 (182 + 182) and night 365, which is night 0 of a cycle (A).
	const none = LU.luPlan(reg, { pattern: 'two_two_three', custom: [], start: '2026-11-01', holidays: 'none', firstA: true, parentA: 'אבא' });
	check(none.ok && none.year.a === 183 && none.year.b === 182 && none.year.regularA === 183 && none.year.holidayNights === 0 && none.spans.length === 0 && none.flags.length === 0, `no holidays: 183 and 182 nights (engine ${none.year.a}, ${none.year.b})`);
	check(none.year.from === '2026-11-01' && none.year.to === '2027-10-31' && none.months.length === 12 && none.months[0].days.length === 30 && none.months[11].days.length === 31, 'the year runs 1.11.2026 to 31.10.2027, month by month');
	check(none.year.aPct === 50.1 && none.handovers === 6 && none.equal, '50.1%, six handovers, an equal split');
	const tue = LU.luPlan(reg, { pattern: 'two_two_three', custom: [], start: '2026-11-03', holidays: 'none', firstA: true, parentA: 'אמא' });
	check(tue.ok && tue.start === '2026-11-01' && tue.flags.some((f) => f.code === 'sunday') && tue.year.a === 183, 'a Tuesday start snaps to its Sunday and says so');
	// Rosh Hashana 5788: 1 Tishri = 2.10.2027, so the holiday runs from the evening of 1.10 to 3.10: the nights of 1.10 and
	// 2.10.2027, days 334 and 335 from the start, which fall in the second week of the cycle (334 mod 14 = 12, 13): B's
	// nights under week-week. Alternate holidays, the first to A in an even Hebrew year (5788): both nights move to A.
	const ww = LU.luPlan(reg, { pattern: 'week_week', custom: [], start: '2026-11-01', holidays: 'alternate', firstA: true, parentA: 'אבא' });
	const rh = ww.spans.find((s) => s.key === 'rh');
	if (rh) {
		check(rh.from === '2027-10-01' && rh.to === '2027-10-03' && rh.who === 'A' && rh.nights === 2 && rh.shifted === 2, `Rosh Hashana 5788: 1.10-3.10.2027, two nights, both moved to A (engine ${rh.from} ${rh.to} ${rh.who} ${rh.nights} ${rh.shifted})`);
	} else {
		console.error('WARN: no Hebrew calendar in this Node build; the holiday check was skipped');
	}
	check(ww.year.a + ww.year.b === 365 && ww.year.a === ww.year.regularA + ww.year.shiftedToA - ww.year.shiftedToB, 'the year balances: a + b = 365, a = regular + moved in - moved out');
	// An independent count of the same year, night by night, from the spans the engine reports.
	let a = 0;
	for (let i = 0; i < 365; i += 1) {
		const t = Date.UTC(2026, 10, 1) + i * 86400000;
		const iso = new Date(t).toISOString().slice(0, 10);
		const span = ww.spans.find((s) => s.from <= iso && iso < s.to);
		const who = span ? span.who : (i % 14 < 7 ? 'A' : 'B');
		if (who === 'A') { a += 1; }
	}
	check(a === ww.year.a, `an independent night-by-night count gives the same ${a} nights`);
	check(ww.spans.every((s) => s.nights === Math.round((Date.parse(`${s.to}T00:00:00Z`) - Date.parse(`${s.from}T00:00:00Z`)) / 86400000) || s.from < '2026-11-01' || s.to > '2027-10-31'), 'a span fully inside the year counts every night between its evening and its end');
	const split = LU.luPlan(reg, { pattern: 'week_week', custom: [], start: '2026-11-01', holidays: 'split', firstA: true, parentA: 'אבא' });
	const summer = split.spans.filter((s) => s.key === 'summer');
	check(summer.length === 2 && summer[0].who !== summer[1].who && summer[0].to === summer[1].from && summer[0].from === '2027-07-01' && summer[1].to === '2027-08-31', 'split: the summer is cut in two halves, one to each parent');
	check(Math.abs(split.year.a - split.year.b) < Math.abs(ww.year.a - ww.year.b), 'split keeps the year closer to half-half than whole holidays in turn');
	// Errors.
	check(!LU.luPlan(reg, { pattern: 'week_week', start: '31.2.2027' }).ok && !LU.luPlan(reg, { pattern: 'custom', custom: [], start: '2026-11-01' }).ok, 'a bad day or an empty custom list: an error, never a plan');
	// Text and calendar file.
	check(none.text.includes('שבוע 1: ראשון האב, שני האב, שלישי האם') && none.text.includes('183 לילות אצל האב'), 'the plan as text names the nights and the year');
	check(none.events[0].date === '2026-11-01' && ics(ww.events, '2026-10-15T10:00:00.000Z').includes('BEGIN:VEVENT') && ww.events.some((e) => e.summary.includes('ראש השנה')), 'the calendar file starts on the first Sunday and lists the holidays');
}

/* ---------- The calendar: the UI and its snapshot ---------- */
{
	const s = LUUI.snapshot(reg);
	const r = LU.luPlan(reg, LUUI.EXAMPLE);
	check(s.tool === 'luach-shahut' && s.total === r.year.a && s.sticky === '<bdi>7</bdi>/14', `snapshot: ${r.year.a} nights, the sticky figure`);
	check(s.result.includes('jt19-cal') && s.result.includes('jt20-year') && (s.result.match(/jt20-d jt20-d--[ab]/g) || []).length === 365 && s.result.includes('jt20-d--h'), 'the result draws the two weeks and 365 nights with holiday dots');
	check(s.details.includes('חגים וחופשות בשנה הקרובה') && s.details.includes('data-act="ics"') && s.details.includes('data-act="copytext"') && s.compare_table.includes('2-2-3') && s.method.includes('26 מחזורים'), 'details: the holidays table, the calendar and text exports, the patterns table, the method');
	check(s.form.includes('jt20-pat') && s.form.includes('value="custom"') && s.form.includes("name=\"jt20-ho\" value=\"split\" checked"), 'form: the pattern select with custom, split holidays checked');
	const custom = LUUI.renderResult(reg, Object.assign(LU.luPlan(reg, { pattern: 'custom', custom: [1, 2], start: '2026-11-01', holidays: 'none' }), { input: { pattern: 'custom', parentA: 'אבא' } }), { input: { pattern: 'custom', parentA: 'אבא' } });
	check((custom.match(/<button type="button" class="jt19-night/g) || []).length === 14 && custom.includes('aria-pressed="true"'), 'custom: every night is a button');
	check(decodeState('#s=ptwo_two_three/s2026-11-01/ha', ['p', 's', 'h']).h === 'a', 'the share state carries the holiday rule');
}

/* ---------- The tracker: due days and the oldest-first allocation, by hand ---------- */
{
	const due = MK.mkDueDays('2026-01-10', '2026-10-14');
	check(due.length === 10 && due[0] === '2026-01-10' && due[9] === '2026-10-10', 'ten due days from 10.1 to 10.10.2026');
	check(MK.mkDueDays('2026-01-31', '2026-04-15').join() === '2026-01-31,2026-02-28,2026-03-31', 'from the 31st: the last day of a shorter month');
	// No indexation: 3,000 x 10 due; paid 3,000 + 3,000 + 1,500 = 7,500: January and February covered, March 1,500 open,
	// April to October 7 x 3,000 open: 22,500 open in 8 instalments.
	const flat = MK.mkTrack(reg, { amount: 3000, base: '2024-01-10', first: '2026-01-10', every: 0, asOf: '2026-10-14', payments: [{ date: '2026-01-12', amount: 3000 }, { date: '2026-02-10', amount: 3000 }, { date: '2026-03-11', amount: 1500 }] });
	check(flat.ok && flat.totals.due === 30000 && flat.totals.paid === 7500 && flat.totals.open === 22500 && flat.totals.openCount === 8 && flat.rows[2].open === 1500 && flat.rows[1].open === 0 && flat.rows[9].open === 3000, `flat: 22,500 open in 8 instalments (engine ${flat.totals.open}, ${flat.totals.openCount})`);
	check(flat.totals.total > flat.totals.open && flat.totals.linkage >= 0 && flat.totals.interest > 0 && flat.rows[9].interest > 0 && flat.rows[9].total - 3000 < 5 && flat.rows[3].total > flat.rows[9].total, 'arrears carry linkage and interest; the instalment due four days ago carries four days of it, April far more');
	// Payments keep their own day: January was paid two days late, so two days of interest remain on it although its
	// principal is paid; February was paid on the day; March's 1,500 came one day late and the rest runs from 10.3.
	check(flat.rows[0].open === 0 && flat.rows[0].paid === 3000 && flat.rows[0].total > 0 && flat.rows[0].total < 1 && flat.rows[1].total === 0 && flat.totals.lateCount === 1, `a payment two days late leaves two days of interest (${flat.rows[0].total}); on the day leaves nothing`);
	const marchGold = T04.compute(reg, { principal: 3000, start: '2026-03-10', end: '2026-10-14', mode: 'linked', payments: [{ date: '2026-03-11', amount: 1500 }] });
	check(marchGold.ok && near(flat.rows[2].total, marchGold.total) && near(flat.rows[2].interest, marchGold.interest), `March: 3,000 from 10.3 with 1,500 paid on 11.3 = the wave-1 engine's ${marchGold.total} (engine ${flat.rows[2].total})`);
	const early = MK.mkTrack(reg, { amount: 3000, base: '2024-01-10', first: '2026-01-10', every: 0, asOf: '2026-10-14', payments: [{ date: '2026-01-05', amount: 3000 }] });
	check(early.ok && early.rows[0].open === 0 && early.rows[0].total === 0 && early.rows[0].onTime === 3000, 'a payment before the due day reduces the principal with no interest');
	const over = MK.mkTrack(reg, { amount: 3000, base: '2024-01-10', first: '2026-09-10', every: 0, asOf: '2026-10-14', payments: [{ date: '2026-09-10', amount: 7000 }] });
	check(over.ok && over.totals.open === 0 && over.totals.credit === 1000 && over.flags.some((f) => f.code === 'credit') && over.totals.total === 0, 'overpayment: nothing open and a 1,000 credit');
	check(over.next === null && over.current === 3000, 'without indexation there is no next update');
	// Due today is not arrears: nothing open, nothing to demand, a note that it is due.
	const today = MK.mkTrack(reg, { amount: 3000, base: '2024-01-10', first: '2026-10-14', every: 0, asOf: '2026-10-14', payments: [] });
	check(today.ok && today.rows.length === 1 && !today.rows[0].late && today.totals.open === 0 && today.totals.total === 0 && today.totals.upcoming === 3000 && today.flags.some((f) => f.code === 'today') && !MK.mkLetter(reg, today).includes('1 תשלומים'), 'an instalment due today is upcoming, not late');
	check(MKUI.verdictSentence(reg, today).includes('מגיעים היום') && !MKUI.renderResult(reg, today).includes('copyletter'), 'the UI shows no arrears and no letter for an instalment due today');
}

/* ---------- The tracker: the CPI update, against the registry's chaining and the family engine ---------- */
{
	const r = MK.mkTrack(reg, MKUI.EXAMPLE);
	const cpi = T04.makeCpi(reg.cpi);
	// Base 10.1.2024: the index known on that day is November 2023 (published 15.12.2023); the update on 10.1.2026 reads
	// the index known then, November 2025.
	const factor = cpi.chained('2025-11') / cpi.chained('2023-11');
	check(r.ok && r.rows[0].update === '2026-01-10' && near(r.rows[0].amount, Math.round(3000 * factor * 100) / 100) && r.rows[0].factor === Math.round(factor * 10000) / 10000, `the amount due in 2026 is 3,000 x CPI(11.2025)/CPI(11.2023) = ${(3000 * factor).toFixed(2)} (engine ${r.rows[0].amount})`);
	const fam = MZ.indexSupport(reg, { amount: 3000, base: '2024-01-10', every: 12, asOf: '2026-10-14' });
	check(fam.ok && near(fam.current, r.current) && fam.lastUpdate === r.currentUpdate && fam.next === r.next && r.next === '2027-01-10', `the same number as the family engine's indexation: ${fam.current} = ${r.current}, next 10.1.2027`);
	check(r.rows.every((x) => x.amount === r.rows[0].amount) && r.totals.due === Math.round(r.rows[0].amount * 10 * 100) / 100, 'every 2026 instalment carries the same updated amount');
	// March: 1,500 paid of the updated amount; the open part carries linkage and linked interest from 10.3 to 14.10.2026,
	// exactly as the wave-1 engine computes them.
	// Oldest first, by hand: 3,000 on 12.1 leaves 176.02 of January; 3,000 on 10.2 closes January (29 days late) and
	// puts 2,823.98 on February; 1,500 on 11.3 closes February's 352.04 and puts 1,147.96 on March.
	const jan = r.rows[0];
	const feb = r.rows[1];
	const march = r.rows[2];
	check(jan.onTime === 0 && jan.later.length === 2 && jan.later[0].amount === 3000 && jan.later[1].amount === 176.02 && jan.later[1].date === '2026-02-10' && jan.open === 0, 'January: 3,000 two days late and 176.02 a month late');
	check(feb.onTime === 2823.98 && feb.later.length === 1 && feb.later[0].amount === 352.04 && feb.open === 0 && march.onTime === 0 && march.later[0].amount === 1147.96 && march.open === 2028.06, 'February and March take the rest in order, each payment on its own day');
	const t = T04.compute(reg, { principal: march.amount, start: '2026-03-10', end: '2026-10-14', mode: 'linked', payments: [{ date: '2026-03-11', amount: 1147.96 }] });
	check(t.ok && near(march.total, t.total) && near(march.linkage, t.linkage) && near(march.interest, t.interest), `March: the updated amount from 10.3 with 1,147.96 paid on 11.3: ${t.total} with linkage and interest (engine ${march.total})`);
	const tj = T04.compute(reg, { principal: jan.amount, start: '2026-01-10', end: '2026-10-14', mode: 'linked', payments: jan.later });
	check(tj.ok && near(jan.total, tj.total) && jan.total > 0 && jan.total < 5, `January, paid late in two parts, keeps only the interest of the late days: ${tj.total} (engine ${jan.total})`);
	check(near(r.totals.total, r.rows.filter((x) => x.late).reduce((s, x) => s + x.total, 0)), 'the total is the sum of the late instalments with their linkage and interest');
	// Before 1.1.2025 the old law applies to those days: flagged, never silently included.
	const old = MK.mkTrack(reg, { amount: 2000, base: '2023-06-10', first: '2024-06-10', every: 0, asOf: '2026-10-14', payments: [] });
	check(old.ok && old.flags.some((f) => f.code === 'old_law') && old.rows[0].linkage > 0, 'instalments due before 1.1.2025 carry linkage and the old-law flag');
}

/* ---------- The tracker: letter, export, import, errors ---------- */
{
	const r = MK.mkTrack(reg, Object.assign({}, MKUI.EXAMPLE, { meta: { creditor: 'א', debtor: 'ב', file: 'תלה"מ 1-2-3' } }));
	const letter = MK.mkLetter(reg, r);
	check(letter.includes('הנדון: דרישה לתשלום מזונות שלא שולמו (תלה"מ 1-2-3)') && letter.includes('לכבוד ב') && letter.includes('8 תשלומים') && letter.includes(r.totals.total.toLocaleString('en-US', { minimumFractionDigits: 2 })) && letter.includes('מסלול מזונות'), 'the demand letter: names, the file, the open count, the total, the next step');
	const input = { amount: 3000, base: '2024-01-10', first: '2026-01-10', every: 12, payments: [{ date: '2026-01-12', amount: 3000, note: 'x' }] };
	const back = MK.mkImport(MK.mkExport(input));
	check(back && back.amount === 3000 && back.base === '2024-01-10' && back.every === 12 && back.payments.length === 1 && back.payments[0].note === 'x' && !MK.mkExport(input).includes('creditor'), 'export and import round-trip the settings and the payments, never names');
	check(MK.mkImport('not json') === null && MK.mkImport('{"tool":"other","payments":[]}') === null && MK.mkImport('{"tool":"maakav-mezonot","payments":[{"date":"31.2.2026","amount":"x"}]}').payments[0].date === '', 'foreign or broken files are refused; a bad row comes back empty, not wrong');
	const bad = (i) => MK.mkTrack(reg, Object.assign({ amount: 3000, base: '2024-01-10', first: '2026-01-10', every: 0, asOf: '2026-10-14', payments: [] }, i));
	check(!bad({ amount: 0 }).ok && !bad({ base: '2024-13-01' }).ok && !bad({ first: '2023-01-10' }).ok && !bad({ first: '2027-01-10' }).ok, 'no amount, a bad base, a first payment before the judgment or in the future: errors');
	check(!bad({ payments: [{ date: '2026-12-01', amount: 100 }] }).ok && !bad({ payments: [{ date: '2026-02-01', amount: 0 }] }).ok && bad({ payments: [{ date: '', amount: '' }] }).ok, 'a future or zero payment is an error; an empty row is skipped');
	const s = MKUI.snapshot(reg);
	check(s.tool === 'maakav-mezonot' && s.total === r.totals.total && s.result.includes('jt21-ledger') && (s.result.match(/class="jt21-bar(?: |")/g) || []).length === 10 && s.details.includes('מכתב דרישה') && s.details.includes('data-import') && s.compare_table.includes('10.1.2027'), 'snapshot: the ledger of ten months, the letter, the import control, the next update');
	check(!s.form.includes('jt21-cr" type="text" autocomplete="off" value="א"'), 'the snapshot never carries a name');
}

/* ---------- The roadmap: fees by hand, the clock, the steps ---------- */
{
	const rb = reg.divorce_cost.rabbinical;
	const fc = reg.divorce_cost.family;
	const base = { children: true, property: true, pension: true, start: '2026-11-01', done: [] };
	const ar = MP.mpBuild(reg, Object.assign({}, base, { route: 'agree', forum: 'rabbinical' }));
	check(ar.ok && ar.fees.total === rb.agreement + 2 * rb.certificate && ar.fees.total === 1188 && ar.fees.stepsTotal === ar.fees.total && ar.fees.bar.total === 3767 && ar.clock === null, `agreement in the rabbinical court: 536 + 2 x 326 = 1,188 in fees, 3,767 at the Bar's minimum (engine ${ar.fees.total})`);
	check(ar.phases.map((p) => p.key).join() === 'prepare,agreement,get,after' && ar.steps.length === 13 && !ar.steps.some((s) => s.id === 'get_request'), 'agreement route: four phases, 13 steps, no separate get request in the rabbinical court');
	const af = MP.mpBuild(reg, Object.assign({}, base, { route: 'agree', forum: 'family' }));
	check(af.ok && af.fees.total === fc.agreement + fc.transcript + rb.get_request + 2 * rb.certificate && af.fees.total === 1605 && af.fees.stepsTotal === 1605 && af.steps.some((s) => s.id === 'get_request'), `agreement in the family court: 541 + 86 + 326 + 652 = 1,605 (engine ${af.fees.total})`);
	const mr = MP.mpBuild(reg, Object.assign({}, base, { route: 'mediate', forum: 'rabbinical' }));
	check(mr.ok && mr.fees.total === rb.request + rb.agreement + 2 * rb.certificate && mr.fees.total === 1307 && mr.fees.stepsTotal === 1307, `settlement then agreement, rabbinical: 119 + 536 + 652 = 1,307 (engine ${mr.fees.total})`);
	const cf = MP.mpBuild(reg, Object.assign({}, base, { route: 'court', forum: 'family' }));
	const cfHand = fc.request + rb.divorce + rb.transcript_divorce + fc.property + fc.transcript + fc.custody + fc.transcript + fc.support + fc.transcript + 2 * rb.certificate;
	check(cf.ok && cf.fees.total === cfHand && cfHand === 2910 && cf.fees.stepsTotal === 2910 && cf.fees.bar.total === 6181, `claims in the family court: ${cfHand} = 2,910 in fees; the Bar's 3,173 + 3,008 (engine ${cf.fees.total}, ${cf.fees.bar.total})`);
	const cr = MP.mpBuild(reg, Object.assign({}, base, { route: 'court', forum: 'rabbinical' }));
	const crHand = rb.request + rb.divorce + rb.transcript_divorce + rb.property + rb.transcript_other + rb.custody + rb.transcript_other + 2 * rb.certificate;
	check(cr.ok && cr.fees.total === crHand && crHand === 2535 && cr.fees.stepsTotal === 2535 && cr.steps.find((s) => s.id === 'children_claims').cost.he.includes('פטור'), `claims in the rabbinical court: ${crHand} = 2,535; the maintenance claimant is exempt (engine ${cr.fees.total})`);
	// The clock from 1.11.2026: 45 days = 16.12 (Wednesday), 60 days = 31.12 (Thursday), + 15 = 15.1.2027 (Friday); no
	// family-pause day falls in that stretch, and none of the ends is a rest day.
	check(cf.clock.meetingsBy === '2026-12-16' && cf.clock.stayEnds === '2026-12-31' && cf.clock.claimsBy === '2027-01-15', `the clock: 16.12.2026, 31.12.2026, 15.1.2027 (engine ${cf.clock.meetingsBy} ${cf.clock.stayEnds} ${cf.clock.claimsBy})`);
	check(cf.steps.find((s) => s.id === 'meetings').when.includes('16.12.2026') && cf.steps.find((s) => s.id === 'window').when.includes('15.1.2027') && cf.steps.find((s) => s.id === 'meetings').cost.amount === 0, 'the dates are printed on the stations; the meetings are free');
	const ids = cf.steps.map((s) => s.id);
	check(['docs', 'consult', 'route', 'request', 'meetings', 'stay', 'window', 'divorce_claim', 'property_claim', 'children_claims', 'hearings', 'get', 'certificate', 'pension', 'home', 'support', 'plan', 'docs_after'].every((id) => ids.includes(id)) && cf.steps.length === 18, 'the court route carries every station, 18 in all');
	const noKids = MP.mpBuild(reg, { route: 'court', forum: 'family', children: false, property: false, pension: false, start: '2026-11-01', done: [] });
	check(!noKids.steps.some((s) => ['property_claim', 'children_claims', 'pension', 'home', 'support', 'plan'].includes(s.id)) && noKids.fees.total === fc.request + rb.divorce + rb.transcript_divorce + 2 * rb.certificate, 'without children, property or a pension the stations and the fees fall away');
	check(cf.steps.every((s) => !s.cost || s.cost.amount === null || s.cost.amount === 0 || (s.cost.section && s.cost.url)), 'every fee on a station carries its item and its source');
	// Progress.
	const prog = MP.mpBuild(reg, Object.assign({}, base, { route: 'agree', forum: 'rabbinical', done: ['docs', 'consult', 'nope'] }));
	check(prog.progress.done === 2 && prog.progress.total === 13 && prog.progress.pct === 15 && prog.steps[0].done && !prog.steps[2].done, 'progress: two of 13 done (15%), unknown ids ignored');
	check(prog.text.includes('[V] אוספים את המסמכים') && prog.text.includes('[ ] בוחרים מסלול') && prog.text.includes('1,188 ₪'), 'the checklist as text ticks the done steps and states the fees');
	check(!MP.mpBuild(reg, Object.assign({}, base, { route: 'mediate', forum: 'family', start: '2026-02-30' })).ok && MP.mpBuild(reg, Object.assign({}, base, { route: 'agree', forum: 'family', start: '2026-02-30' })).ok, 'a bad request day is an error where the clock applies, and ignored on the agreement route');
	const gs = GE.compute(reg, { route: 'court', forum: 'family', children: true, property: true, certificates: 2, lawyer: 'bar', start: '2026-11-01' });
	check(gs.ok && gs.total === cf.fees.total && gs.bar.total === cf.fees.bar.total, 'the roadmap and the divorce-cost tool read the same engine');
	const s = MPUI.snapshot(reg);
	check(s.tool === 'mapat-gerushin' && s.total === 1725 && s.result.includes('jt22-rail') && (s.result.match(/jt22-st__box/g) || []).length === 18 && s.result.includes('jt22-st--done') && s.details.includes('המועדים שבחוק') && s.compare_table.includes('בהסכמה') && s.compare_table.includes('2,910'), 'snapshot: the example route at 1,725 in fees, 18 stations with one ticked, the clock, the three routes compared');
}

// HAD-541: on the command center a share link names its tool (/@name). decodeState ignores that segment, so the named
// tool reads its own keys unchanged; every sharing tool on the page appends its name and reads only its own links.
{
	check(JSON.stringify(decodeState('#s=r1/fr/k1/@mapat-gerushin', ['r', 'f', 'k'])) === JSON.stringify({ r: '1', f: 'r', k: '1' }), 'share link: the /@tool segment is ignored by the decoder');
	const owners = { 'gerushin-ui.js': 'gerushin', 'mezonot-ui.js': 'mezonot', 'izun-ui.js': 'izun', 'heskem-ui.js': 'heskem-gerushin', 'mamon-ui.js': 'heskem-mamon', 'mapat-ui.js': 'mapat-gerushin', 'luach-ui.js': 'luach-shahut' };
	for (const [file, tool] of Object.entries(owners)) {
		const src = readFileSync(join(ROOT, 'assets/js/tools', file), 'utf8');
		check(src.includes(`/@${tool}\`;`) && src.includes(`shareOwner === '${tool}'`), `share link: ${file} names ${tool} and reads only its own links`);
	}
	const cmd = readFileSync(join(ROOT, 'assets/js/tools/dist/jt-command.js'), 'utf8');
	check(cmd.includes(String.raw`/\/@([a-z-]+)$/`), 'the tab script opens the tab the share link names');
}

if (failures) {
	console.error(`divorce world: ${failures} failure(s), ${passed} passed`);
	process.exit(1);
}
console.log(`divorce world: ok (${passed} checks)`);
