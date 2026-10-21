/**
 * Golden tests for the contractor-purchase instrument (dira-mikablan, the family + land wave, 22.10.2026, HAD-579).
 * Run: node tests/js/test-fl-kablan.mjs
 *
 * Every expected figure is computed by hand from the official texts: the Sale (Apartments) Law 1973 as amended by
 * amendment 9 (s.5א: one month of grace, then rent x1 for months 2-4, x1.25 for 5-10, x1.5 from 11; the old version:
 * 60 days, then from the first day x1.5 for months 1-8 and x1.25 from 9; s.5ג: at most half of each payment linked,
 * the first 20% never, not after the contract delivery date; s.4 and the addendum: inspection 1-7 years, warranty 3
 * years after it, fundamental 20 years; s.4א: one year for what was visible at delivery), the Investments Law (s.2: 7%
 * without a security; s.3ב(ה): 14 business days) and CBS series 200010 (base July 2011 to 7.2025, July 2025 from 8.2025,
 * chaining coefficient 1.387; an index is the known one from the 16th of the next month).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/kablan-engine.js';
import * as U from '../../assets/js/tools/kablan-ui.js';
import { decodeState, ics, ils } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const fl = reg.fl_kablan;
const TODAY = '2026-10-21';
const EX = Object.assign({}, U.EXAMPLE, { today: TODAY });
const run = (over) => E.kbCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const words = (s) => s.trim().split(/\s+/).length;

/* ---------- 1. The registry: every figure the engine reads exists and has its source ---------- */
check(fl && fl.checked_on === '2026-10-21' && fl.index.latest_month === '2026-09' && fl.next_update === '2026-11-16', 'registry: fl_kablan checked 21.10.2026, CBS index to 9.2026, next index known from 16.11.2026');
check(Object.keys(fl.index.series_2011).length === 127 && Object.keys(fl.index.series_2025).length === 14 && fl.index.series_2011['2025-07'] === 138.7 && fl.index.series_2025['2026-09'] === 104.0, 'registry: CBS 200010 from 1.2015 (127 months base 2011, to 7.2025 = 138.7) and 14 months base 2025 (9.2026 = 104.0)');
check(fl.index.chaining.coefficient === 1.387 && /api\.cbs\.gov\.il/.test(fl.index.source_url) && fl.index.code === 200010, 'registry: chaining coefficient 1.387 from the CBS calculator; source = CBS API series 200010');
const rules = [fl.linkage.none, fl.linkage.half, fl.linkage.until, fl.linkage.index_def, fl.delay.new.rule, fl.delay.new.pay, fl.delay.new.except, fl.delay.old.rule, fl.delay.old.pay, fl.delay.waiver, fl.warranty.inspection, fl.warranty.warranty, fl.warranty.fundamental, fl.warranty.visible, fl.warranty.repair, fl.arrears.rule, fl.registration, fl.guarantee.free, fl.guarantee.per_payment, fl.guarantee.notice, ...fl.guarantee.securities];
check(rules.every((x) => x && x.he && x.section && /^https:\/\//.test(x.url)), `registry: all ${rules.length} rules carry words, a section and an https source`);
check(fl.warranty.items.length === 10 && fl.warranty.items.map((i) => i.years).join(',') === '2,2,3,3,3,4,4,5,7,1' && fl.warranty.warranty_years === 3 && fl.warranty.fundamental_years === 20 && fl.warranty.visible_years === 1, 'registry: the addendum (2,2,3,3,3,4,4,5,7,1 years), warranty 3 years (s.4(ג)), fundamental 20 (s.4(א)(4)), visible 1 (s.4א)');
check(fl.delay.new.tiers.map((t) => `${t.from_month}-${t.to_month}x${t.mult}`).join(' ') === '2-4x1 5-10x1.25 11-nullx1.5' && fl.delay.old.tiers.map((t) => `${t.from_month}-${t.to_month}x${t.mult}`).join(' ') === '1-8x1.5 9-nullx1.25', 'registry: s.5א tiers, new (2-4 x1, 5-10 x1.25, 11+ x1.5) and old (1-8 x1.5, 9+ x1.25)');
check(fl.linkage.max_share_pct === 50 && fl.linkage.unlinked_first_pct === 20 && fl.linkage.from === '2022-07-07' && fl.guarantee.free_pct === 7 && fl.guarantee.days_business === 14, 'registry: s.5ג 50% / 20% from 7.7.2022; Investments Law 7% and 14 business days');
check(fl.sources.length >= 4 && fl.sources.every((s) => /^https:\/\//.test(s.url)), 'registry: four official sources with urls');

/* ---------- 2. The index: the CBS rules ---------- */
check(E.kbKnownMonth(reg, '2026-01-15') === '2025-11' && E.kbKnownMonth(reg, '2026-01-16') === '2025-12', 'known index: on 15.1.2026 the 11.2025 index, from 16.1.2026 the 12.2025 one (CBS calculator probe)');
check(E.kbKnownMonth(reg, '2026-10-15') === '2026-08' && E.kbKnownMonth(reg, '2026-10-16') === '2026-09', 'known index: 15.10.2026 -> 8.2026, 16.10.2026 -> 9.2026 (CBS calculator probe)');
const cc = fl.index.calc_check;
check(Math.round(cc.sum * E.kbIndex(reg, cc.to_month).value / E.kbIndex(reg, cc.from_month).value * 100) / 100 === cc.to_value, 'CBS calculator answer reproduced: 100 x 101.1 x 1.387 / 133.2 = 105.27 across the change of base');

/* ---------- 3. The example: linkage ---------- */
const r = run({});
check(r.ok && r.regime === 'new' && r.stage === 'waiting', 'example: contract of 1.3.2023 = amendment 9; on 21.10.2026 still waiting for the delivery');
check(r.pay.baseMonth === '2023-01' && r.pay.base.published === 128.8, 'example: base index = the one known on 1.3.2023 = 1.2023, 128.8 (base 2011)');
const p = r.pay.rows;
check(p[0].amount === 400000 && p[0].unlinked === 400000 && p[0].linked === 0 && p[0].diff === 0, 'payment 1: 20% at signing = 400,000, all of it the unlinked first 20% (s.5ג(ב))');
check(p[1].linked === 200000 && p[1].indexUsed === '2023-07' && p[1].diff === 776, 'payment 2 (1.9.2023): half linked 200,000 x (129.3 / 128.8 - 1) = 776');
check(p[2].diff === 2019 && p[2].indexUsed === '2024-04', 'payment 3 (1.6.2024): 200,000 x (130.1 / 128.8 - 1) = 2,018.6 -> 2,019');
check(p[3].diff === 14907 && p[3].indexUsed === '2025-04', 'payment 4 (1.6.2025): 200,000 x (138.4 / 128.8 - 1) = 14,906.8 -> 14,907');
check(p[4].capped && p[4].capDate === '2026-03-01' && p[4].indexUsed === '2026-01' && p[4].diff === 18173, 'payment 5 (15.11.2026, after the contract date): linked only to 1.3.2026 (s.5ג(ג)): 200,000 x (101.3 x 1.387 / 128.8 - 1) = 18,172.5 -> 18,173');
check(r.pay.diffTotal === 35875 && r.pay.linkedTotal === 800000 && r.pay.total === 2000000, 'example: linkage 0 + 776 + 2,019 + 14,907 + 18,173 = 35,875 on 800,000 linked of 2,000,000');
check(r.pay.line.length === 37 && r.pay.line[0].change === 0, 'the index line: 37 published months from 1.2023 to 1.2026, starting at 0%');

/* ---------- 4. The example: delay (s.5א, new version) ---------- */
check(r.delay.months === 9 && r.delay.compMonths === 8 && r.delay.total === 55500, 'delay 1.3.2026 -> 15.11.2026: 9 months (part counts); months 2-4 x 6,000 = 18,000 + months 5-9 x 7,500 = 37,500; total 55,500');
check(r.delay.rows[0].pay === '2026-05-01' && r.delay.rows[0].mult === 1 && r.delay.rows[3].mult === 1.25 && r.delay.rows[3].k === 5, 'delay: month 2 paid at its end 1.5.2026 (s.5א(ב)); month 5 is the first x1.25');
check(r.delay.paidByToday === 40500, 'delay: by 21.10.2026 months 2-7 were due: 3 x 6,000 + 3 x 7,500 = 40,500');

/* ---------- 5. Hard cases of the delay ---------- */
const nd = (actual, rent = 5000) => run({ deliveryDate: '2026-03-01', actualDate: actual, rent, today: '2027-06-01' }).delay;
check(nd('2026-04-01').total === 0 && !nd('2026-04-01').started, 'new: delivered exactly one month late (1.4.2026) -> no compensation (s.5א(א))');
check(nd('2026-04-02').total === 5000 && nd('2026-04-02').compMonths === 1, 'new: one month and one day -> month 2 counts as a part: 1 x 5,000');
check(nd('2026-07-01').total === 15000, 'new: exactly 4 months -> months 2-4: 3 x 5,000 = 15,000');
check(nd('2026-07-02').total === 21250, 'new: 4 months and a day -> 15,000 + month 5 x 1.25 = 6,250 -> 21,250');
check(nd('2027-01-02').total === 60000 && nd('2027-01-02').rows[9].mult === 1.5, 'new: 10 months and a day -> 3 x 5,000 + 6 x 6,250 + 1 x 7,500 = 60,000; month 11 x1.5');
const od = (actual) => E.kbCompute(reg, { price: 1500000, signDate: '2021-01-01', deliveryDate: '2022-01-01', actualDate: actual, rent: 4000, linkShare: 100, payments: [{ pct: 100, date: '2021-01-01' }], today: '2023-01-01' });
check(od('2022-03-01').ok && od('2022-03-01').regime === 'old' && od('2022-03-01').delay.total === 0, 'old (contract 1.1.2021): 59 days late -> within the 60 days, no compensation');
check(od('2022-03-03').delay.total === 18000 && od('2022-03-03').delay.rows[0].pay === '2022-03-02', 'old: 61 days -> from the first day: 3 months x 4,000 x 1.5 = 18,000; the first 60 days paid at day 60 = 2.3.2022');
check(od('2022-10-15').delay.total === 58000, 'old: 10 months (part) -> 8 x 6,000 + 2 x 5,000 = 58,000 (x1.5 to month 8, x1.25 from 9)');
check(run({ excused: true }).delay.total === 0 && run({ excused: true }).pay.rows[4].capped === false, 'excused (buyer only / frustration): no compensation (s.5א(ג)) and no linkage cap at the contract date (s.5ג(ג))');
const noRent = run({ rent: '' });
check(noRent.ok && noRent.delay.compMonths === 8 && noRent.delay.total === 0 && noRent.flags.some((f) => f.he.includes('שכר הדירה')), 'no rent typed: 8 months counted, no invented amount, a flag asks for the rent');
const accrued = run({ actualDate: '' });
check(accrued.delay.toToday && accrued.delay.months === 8 && accrued.delay.total === 48000, 'no delivery date: accrued to 21.10.2026 = 8 months; 3 x 6,000 + 4 x 7,500 = 48,000');

/* ---------- 6. Linkage hard cases ---------- */
const pend = run({ signDate: '2026-01-01', deliveryDate: '2027-12-01', actualDate: '', payments: [{ pct: 20, date: '2026-01-01' }, { pct: 80, date: '2027-06-01' }] });
check(pend.ok && pend.pay.rows[1].pending && pend.pay.rows[1].indexMonth === '2027-04' && pend.pay.rows[1].indexUsed === '2026-09', 'a future payment: its index (4.2027) is not published; computed so far with 9.2026 and flagged');
check(pend.pay.rows[1].linked === 800000 && pend.pay.rows[1].diff === 22948, 'future payment so far: base = 11.2025 (101.1, known on 1.1.2026); 80% = 1,600,000, half linked 800,000 x (104.0 / 101.1 - 1) = 22,947.6 -> 22,948');
check(run({ linkShare: 60 }).ok === false && run({ linkShare: 60 }).errors[0].field === 'linkShare', 'new contract: 60% linked -> error (s.5ג(ב) allows half)');
const old = E.kbCompute(reg, { price: 1000000, signDate: '2021-06-01', deliveryDate: '2023-06-01', actualDate: '2023-06-01', rent: 0, linkShare: 100, payments: [{ pct: 50, date: '2021-06-01' }, { pct: 50, date: '2023-06-01' }], today: TODAY });
check(old.ok && old.regime === 'old' && old.pay.baseMonth === '2021-04' && old.pay.rows[0].linked === 500000 && old.pay.rows[1].diff === 50213, 'old contract (1.6.2021): 100% linked, no 20% rule; base 4.2021 = 117.5; payment of 1.6.2023: 500,000 x (129.3 / 117.5 - 1) = 50,212.8 -> 50,213');
const straddle = run({ payments: [{ pct: 10, date: '2023-03-01' }, { pct: 30, date: '2023-09-01' }, { pct: 60, date: '2025-06-01' }] });
check(straddle.pay.rows[0].unlinked === 200000 && straddle.pay.rows[1].unlinked === 200000 && straddle.pay.rows[1].linked === 300000, 'first 20% across two payments: 10% (200,000) all unlinked; of 30% (600,000) 200,000 unlinked, linked min(half = 300,000, 400,000) = 300,000');

/* ---------- 7. Securities (Investments Law) ---------- */
check(p[0].secured === 260000 && p[0].guaranteeBy === '2023-03-21', 'security: of 400,000 at signing, 260,000 above the 7% (140,000) needs a guarantee by 21.3.2023 (14 business days, Sun-Thu)');
check(E.kbBusinessDays('2026-10-22', 1) === '2026-10-25', 'business days: from Thursday 22.10.2026, the next is Sunday 25.10.2026');
const seven = run({ payments: U.kbPresetPayments('seven', '2023-03-01', '2026-03-01') });
check(seven.ok && seven.pay.rows[0].secured === 0 && seven.pay.rows[1].secured === 260000, 'preset 7%: the first payment of 7% (140,000) needs no security; the second 13% (260,000) is fully secured');

/* ---------- 8. Warranty clock ---------- */
const w = r.warranty;
check(w.d0 === '2026-11-15' && w.visible === '2027-11-15' && w.fundamental === '2046-11-15', 'warranty from 15.11.2026: visible-defect notice to 15.11.2027 (s.4א), fundamental to 15.11.2046 (s.4(א)(4))');
const it9 = w.items.find((i) => i.n === 9);
check(it9.inspEnd === '2033-11-15' && it9.warrEnd === '2036-11-15', 'external cladding (item 9): inspection 7 years to 15.11.2033, warranty 3 more to 15.11.2036');
check(w.nearestDate === '2027-11-15' && w.nearest.length === 2 && w.nearestLeft === 390, 'nearest: 15.11.2027, the visible-defect notice and item 10 (one year), 390 days from 21.10.2026');
const after = run({ today: '2028-06-01' });
check(after.stage === 'after' && after.warranty.nearestDate === '2028-11-15' && after.warranty.nearest.every((e) => e.kind === 'insp' && (e.n === 1 || e.n === 2)), 'after delivery (1.6.2028): nearest = end of the 2-year inspection of frames and flooring, 15.11.2028');

/* ---------- 9. Input errors ---------- */
check(!run({ price: 0 }).ok && run({ price: 0 }).errors[0].field === 'price', 'error: price 0');
check(!run({ price: 200000000 }).ok, 'error: price above 100 million');
check(!run({ signDate: '31.2.2023' }).ok, 'error: an impossible signing date');
check(!run({ deliveryDate: '2023-01-01' }).ok, 'error: delivery before the signing');
check(!run({ payments: [{ pct: 20, date: '2023-03-01' }, { pct: 70, date: '2024-03-01' }] }).ok && run({ payments: [{ pct: 20, date: '2023-03-01' }, { pct: 70, date: '2024-03-01' }] }).errors[0].field === 'paysum', 'error: payments add to 90%');
check(!run({ payments: [{ pct: 100, date: '2022-01-01' }] }).ok, 'error: a payment before the signing');
check(!run({ rent: -5 }).ok, 'error: a negative rent');
check(!run({ baseMonth: '2014-01' }).ok, 'error: a base month without a published index in the file');

/* ---------- 10. The UI: snapshot, brief, print, ics, links, share ---------- */
const s = U.snapshot(reg);
const html = [s.form, s.result, s.details, s.method, s.compare_table, s.sentence].join('\n');
check(s.tool === 'dira-mikablan' && s.total === 55500 && s.result.includes('55,500') && s.result.includes('35,875'), 'snapshot: the example result shows 55,500 (delay) and 35,875 (linkage)');
check(!/<h2/i.test(html) && !bad(html), 'snapshot: no <h2>, no undefined/NaN/null');
check((s.result.match(/class="jtool-cite"/g) || []).length >= 10 && s.method.includes('סעיף 5ג(ג)') && s.method.includes('1.387'), 'snapshot: cites on the figures; the method names s.5ג(ג) and the coefficient');
check(/<caption>/.test(s.compare_table) && (s.compare_table.match(/<tr>/g) || []).length >= 13, 'compare table: captions, 10 addendum rows + the two versions of s.5א');
const brief = U.aiBrief(reg, r);
check(brief.includes('9 חודשים') && brief.includes('בין 50 ל-60 אלף') && brief.includes('15.11.2027') && brief.includes('השאלה לתרגול'), 'aiBrief: the delay months, the compensation band, the nearest deadline and the question');
check(words(brief) >= 40 && words(brief) <= 90 && !/\d{9}/.test(brief) && !bad(brief), `aiBrief: 40-90 words (${words(brief)}), no 9-digit sequence, no undefined`);
const bSign = U.aiBrief(reg, run({ signDate: '2026-12-01', deliveryDate: '2029-12-01', actualDate: '', payments: [{ pct: 100, date: '2026-12-01' }] }));
const rSign = run({ signDate: '2026-12-01', deliveryDate: '2029-12-01', actualDate: '', payments: [{ pct: 100, date: '2026-12-01' }] });
check(rSign.ok && rSign.stage === 'signing' && rSign.pay.basePending && rSign.flags.some((f) => f.he.includes('עוד לא פורסם')), 'signing on 1.12.2026: the base index (10.2026) is not published; the latest stands in and a flag says so');
check(bSign.includes('לפני חתימה') && bSign.includes('לפני החתימה') && words(bSign) >= 30 && words(bSign) <= 90, 'aiBrief at the signing stage: the meeting before signing');
const printed = U.printSummary(reg, r, '2026-10-22');
check(printed.includes('הודפס ב-22.10.2026') && printed.includes('55,500') && printed.includes('35,875') && printed.includes('סדרה 200010') && !bad(printed), 'print: one-page buyer sheet with the result, the path, the sources and the day printed');
const text = ics(r.events.map((e) => ({ date: e.date, summary: e.what })), '2026-10-22T00:00:00Z');
check((text.match(/BEGIN:VEVENT/g) || []).length === r.events.length && text.includes('DTSTART;VALUE=DATE:20271115') && text.includes('DTSTART;VALUE=DATE:20261101') && text.includes('DTSTART;VALUE=DATE:20461115'), `ics: ${r.events.length} events, incl. the compensation for month 8 (1.11.2026), the nearest end (15.11.2027) and the 20 years (15.11.2046)`);
check(r.events.some((e) => e.kind === 'pay' && e.date === '2026-11-15') && r.events.some((e) => e.kind === 'guar') && r.events.every((e) => e.date >= TODAY), 'ics: the next payment, its guarantee date, and only future dates');
check(/<title id="jt45-strip-t">/.test(s.result) && /<desc id="jt45-strip-d">[^<]*35,875/.test(s.result) && /<desc id="jt45-clock-d">[^<]*15\.11\.2046/.test(s.result), 'pictures: both SVGs have a title and a text summary (linkage 35,875; fundamental 15.11.2046)');
check(s.result.includes('jt45-pays') && (s.result.match(/<th scope="row"><bdi>/g) || []).length === 5, 'the strip text equivalent: a table row per payment');
const na = U.nextActions(reg, r);
check(na.links.length >= 2 && na.links.length <= 4 && na.links.every((l) => /^\/[a-z0-9-]+\/$/.test(l.path)) && na.official.filter((o) => o.url).every((o) => /^https:\/\//.test(o.url)), 'next actions: 2-4 internal paths and official https links');
check(na.official.some((o) => o.he.includes('בית משפט השלום')) && !na.links.some((l) => l.path === '/small-claims-court-israel/'), 'next actions: 55,500 is above the small-claims ceiling, so the magistrate court is named');
const naSmall = U.nextActions(reg, run({ rent: 3000 }));
check(naSmall.official.some((o) => o.he.includes('תביעה קטנה')) && naSmall.links.some((l) => l.path === '/small-claims-court-israel/'), 'next actions: 27,750 (rent 3,000) is under the ceiling: small claim');
check(s.result.includes('מה עושים עכשיו') && s.result.includes('התרחיש לסימולציה') && s.result.includes('topic=real-estate') && s.result.includes('purpose=court_rehearsal'), 'result: the next steps, the brief with the rehearse link (real-estate, court_rehearsal)');
const st = U.stateOf(U.EXAMPLE);
const back = U.inputOf(decodeState(`#s=${st}`, U.KEYS));
check(JSON.stringify(back) === JSON.stringify(U.EXAMPLE), 'share state round trip (stateOf -> decodeState -> inputOf)');
check(!/[א-ת]/.test(st) && !st.includes('name'), 'share state: no free text');
check(U.kbPresetPayments('five', '2023-03-01', '2026-03-01').map((x) => x.date).join(' ') === '2023-03-01 2023-12-01 2024-09-01 2025-06-01 2026-03-01', 'preset five: 20% at 1.3.2023, 1.12.2023, 1.9.2024, 1.6.2025, 1.3.2026');
for (const [name, over] of [['old', { signDate: '2021-01-01', deliveryDate: '2022-01-01', actualDate: '2022-10-15', linkShare: 100, payments: [{ pct: 100, date: '2021-01-01' }] }], ['after', { today: '2030-01-01' }], ['excused', { excused: true }], ['ontime', { actualDate: '2026-02-01' }], ['norent', { rent: '' }]]) {
	const rr = run(over);
	const all = [U.renderResult(reg, rr), U.renderDetails(reg, rr), U.verdictSentence(reg, rr), U.aiBrief(reg, rr)].join('');
	check(rr.ok && !bad(all) && !/<h2/i.test(all), `render ${name}: no undefined/NaN/null, no <h2>`);
}
check(U.renderResult(reg, run({ price: 0 })).includes('צריך לתקן'), 'an input error renders the fix-the-input state');

/* ---------- 11. Polish: the window handoff into the simulation, the sticky string ---------- */
check(s.result.includes('data-act="rehearse">לתרגל את השיחה עם הנתונים שלכם</a>') && !s.result.includes('להעתיק ולתרגל'), 'rehearse button: "לתרגל את השיחה עם הנתונים שלכם" (no "copy" in the label)');
const hs = handoffState('x', U.aiBrief(reg, r), 'court_rehearsal');
check(hs.phase === 'intake' && hs.locale === 'he' && hs.simulationPurpose === 'court_rehearsal' && hs.description.includes('9 חודשים') && hs.description.includes('בין 50 ל-60 אלף') && hs.description.includes('15.11.2027') && !/\d{9}/.test(hs.description), 'handoff state: intake, he, court_rehearsal; the brief with the delay months, the compensation band and the nearest deadline; no 9-digit run');
check(s.sticky === ils(55500, 0) && typeof s.sticky === 'string' && U.kbStickyFigure(r) === s.sticky, `snapshot sticky = the string the mount writes (${s.sticky})`);
check(U.kbStickyFigure(run({ rent: '' })) === ils(35875, 0) && U.kbStickyFigure(run({ price: 0 })) === '—', 'sticky: the linkage when no rent is typed; "—" on an input error');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
