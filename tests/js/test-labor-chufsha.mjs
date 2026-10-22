/**
 * Golden tests for annual leave and its redemption (chufsha-shnatit, the labor wave, 22.10.2026).
 * Run: node tests/js/test-labor-chufsha.mjs
 *
 * Every expected figure is computed by hand from the official texts: the Annual Leave Law 1951 (Nevo, current to
 * 21.7.2026): s.1 (the work year is the calendar year), s.3(א) (16 days for years 1-5, 18, 21, then one more a year to 28),
 * s.3(ב) (a whole year: full days from 200 worked, else days x worked / 200, a part of a day dropped), s.3(ג) (part of a
 * year: by 240), ss.4 and 15(א) (a wage worker under 75 consecutive days: 4%, no days), s.13 (redemption), s.17 (as wage),
 * s.31 (3 years); the Ministry of Labor guide (the law's table in work days: 5-day week 12, 14, 15, 16 ... 20; 6-day week
 * 14, 16, 18 ... 24; the shortened-week extension order: 5-day 10, 10, 11, 11, 12, 17, 17, 17, 23; 6-day 12, 12, 13, 13,
 * 14, 19, 19, 19, 26; the better of the two applies; the 2004 manpower order); the Minimum Wage Law s.1 (a day is the 25th
 * of a month in a 6-day week, the 21 2/3 part in a 5-day week); the Wage Protection Law s.9 (a monthly wage is due at the
 * end of the month) and s.1 (delayed from the ninth day after).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/chufsha-engine.js';
import * as U from '../../assets/js/tools/chufsha-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const lc = reg.labor_chufsha;
const EX = U.EXAMPLE;
const run = (over) => E.chCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const yr = (r, y) => r.years.find((x) => x.year === y);
const near = (a, b) => Math.abs(a - b) < 0.005;

/* ---------- The registry: every figure the engine reads exists and has its source ---------- */
check(lc && lc.source_url.startsWith('https://www.nevo.co.il/') && lc.checked_on === '2026-10-22', 'registry: labor_chufsha exists, with the law as source and checked 22.10.2026');
check(lc.law_table.rows.length === 10 && lc.law_table.rows[0].gross === 16 && lc.law_table.rows[9].gross === 28 && lc.law_table.url, 'registry: the s.3(א) table from 1.1.2017, 16 to 28 gross days, with its url');
check(lc.order_table.rows.length === 5 && lc.order_table.url && lc.manpower_table.rows.length === 4 && lc.manpower_table.url, 'registry: the extension order and the manpower order tables with urls');
check(lc.day_ratio.w6 === 25 && lc.day_ratio.w5_num / lc.day_ratio.w5_den === 65 / 3 && lc.day_ratio.url.includes('98675'), 'registry: Minimum Wage Law s.1 ratio 25 and 21 2/3, with its url');
check(lc.wage.late_day === 9 && lc.wage.url.includes('71689') && lc.law.limitation_years === 3 && lc.law.full_year_days === 200 && lc.law.part_year_days === 240, 'registry: wage law day 9, limitation 3 years, 200 and 240 days');
check(lc.history.amendment.from === '2017-01-01' && lc.history.amendment.temp_days === 15 && lc.history.before.rows[0].gross === 14 && lc.history.amendment.url.includes('knesset'), 'registry: amendment 15 from 1.1.2017, 15 days from 1.7.2016, 14 before, Knesset url');

/* ---------- The example: monthly 12,000, 5-day week, 1.9.2021 to 31.10.2026, 20 days used ---------- */
const r = run({});
check(r.ok && r.mode === 'compute', 'example computes');
// 2021: 1.9-31.12, 87 Sun-Thu days < 240: 87 x 12 / 240 = 4.35 -> 4 (s.3(ג)); seniority 1.
check(yr(r, 2021).n === 1 && yr(r, 2021).worked === 87 && yr(r, 2021).net === 4 && !yr(r, 2021).inWindow, 'example: 2021, 87 days of 240: 87 x 12 / 240 = 4.35 -> 4, outside the window');
// 2022-2025: whole years, 260+ days >= 200: full 12 (law 12 > order 10/11/12).
check([2022, 2023, 2024, 2025].every((y) => yr(r, y).net === 12 && yr(r, y).threshold === 200), 'example: 2022-2025 whole years, at least 200 days: 12 days each (s.3(ב))');
// 2026: seniority 6, the order gives 17 > law 14; 1.1-31.10: 216 days < 240: 216 x 17 / 240 = 15.3 -> 15.
check(yr(r, 2026).n === 6 && yr(r, 2026).full === 17 && yr(r, 2026).src === 'order' && yr(r, 2026).worked === 216 && yr(r, 2026).net === 15, 'example: 2026, seniority 6, order 17 over law 14, 216 x 17 / 240 = 15.3 -> 15');
check(r.accrued === 51 && r.older === 16 && r.window.from === 2023 && r.window.to === 2026, 'example: window 2023-2026 holds 12+12+12+15 = 51; older years 4+12 = 16');
check(r.days === 31, 'example: 51 - 20 used = 31 days');
check(r.dayValue === 553.85 && near(r.divisor, 65 / 3), 'example: a day = 12,000 / 21 2/3 = 553.846 -> 553.85');
check(r.value === 17169.35, 'example: 31 x 553.85 = 17,169.35');
check(r.dates.due === '2026-10-31' && r.dates.lateFrom === '2026-11-09' && r.dates.limitation === '2029-10-31', 'example: due 31.10.2026, delayed from 9.11.2026, limitation 31.10.2029');
check(r.row.n === 6 && r.row.net === 17 && r.nextRow && r.nextRow.n === 9 && r.nextRow.net === 23 && r.nextRow.year === 2029, 'example: this step 17 days (seniority 6), the next step 23 at seniority 9 in 2029');

/* ---------- The table and the extension order, step by step ---------- */
const S = (n, w, g) => E.chSeniority(lc, n, w, g);
check(S(5, 5, 'law').net === 12 && S(6, 5, 'law').net === 14 && S(7, 5, 'law').net === 15 && S(12, 5, 'law').net === 20 && S(13, 5, 'law').net === 20, 'law, 5-day week: 12 / 14 / 15 / 20 / 20 at seniority 5 / 6 / 7 / 12 / 13');
check(S(13, 6, 'law').net === 24 && S(13, 6, 'law').gross === 27 && S(14, 6, 'law').gross === 28 && S(30, 6, 'law').gross === 28, 'law, 6-day week: 24 work days at 13 (27 gross) and at 14+ (28 gross), capped at 28');
check(S(1, 5, 'order').net === 12 && S(1, 5, 'order').src === 'law', 'order, seniority 1, 5-day: the law (12) beats the order (10)');
check(S(6, 5, 'order').net === 17 && S(8, 5, 'order').net === 17 && S(9, 5, 'order').net === 23 && S(9, 6, 'order').net === 26, 'order: 17 at 6 and 8 (5-day), 23 from 9 (5-day), 26 from 9 (6-day)');
check(S(5, 6, 'order').net === 14 && S(5, 6, 'order').src === 'law', 'order, seniority 5, 6-day: equal 14, the law is shown as the source (not higher)');
check(S(4, 6, 'manpower').net === 14 && S(6, 6, 'manpower').net === 19 && S(6, 6, 'manpower').src === 'manpower', 'manpower order: 13 < law 14 at 4; 19 > law 16 at 6 (6-day)');

/* ---------- 200 / 240 at, under and over the line ---------- */
const whole = (worked, extra = {}) => run(Object.assign({ start: '2025-01-01', end: '2025-12-31', used: 0, workedEnd: worked }, extra));
check(whole(200).years[0].net === 12, 'a whole year with exactly 200 days: full 12 (s.3(ב)(1))');
check(whole(199).years[0].net === 11, 'a whole year with 199 days: 199 x 12 / 200 = 11.94 -> 11 (s.3(ב)(2))');
check(whole(201).years[0].net === 12, 'a whole year with 201 days: full 12');
const part = (worked) => run({ start: '2026-01-01', end: '2026-10-31', used: 0, workedEnd: worked });
check(part(240).years[0].net === 12 && part(239).years[0].net === 11 && part(241).years[0].net === 12, 'part of a year: 240 -> 12; 239 -> 239 x 12 / 240 = 11.95 -> 11; 241 -> 12 (s.3(ג))');
// The Ministry's own examples (guide, chapter 2): 150/200 x 14 = 10 (10.5 dropped to 10); 120/240 x 14 = 7.
check(run({ start: '2021-01-01', end: '2025-12-31', week: 6, regime: 'law', used: 0, workedEnd: 150 }).years[4].net === 10, 'the guide\'s example: seniority 5, 6-day week, 150 days: 150 x 14 / 200 = 10.5 -> 10');
check(run({ start: '2021-01-01', end: '2025-06-30', week: 6, regime: 'law', used: 0, workedEnd: 120 }).years[4].net === 7, 'the guide\'s example: part of a year, 120 days: 120 x 14 / 240 = 7');
check(run({ start: '2026-01-01', end: '2026-01-01', used: 0 }).years[0].net === 0, 'one day of work: 1 x 12 / 240 = 0.05 -> 0 days');

/* ---------- Pay types, part-time, the day value ---------- */
const h = run({ start: '2025-05-01', end: '2026-10-31', perWeek: 3, payType: 'hourly', salary: '', hourly: 45, hours: 72, used: 4 });
// Sun-Tue: 105 days in 2025 (5 days), 129 in 2026 (6 days); divisor 21 2/3 x 3 / 5 = 13; 45 x 72 = 3,240 / 13 = 249.23.
check(h.ok && yr(h, 2025).worked === 105 && yr(h, 2025).net === 5 && yr(h, 2026).worked === 129 && yr(h, 2026).net === 6, 'hourly, 3 days a week: 105 x 12 / 240 = 5.25 -> 5; 129 x 12 / 240 = 6.45 -> 6');
check(near(h.divisor, 13) && h.dayValue === 249.23 && h.days === 7 && h.value === 1744.61, 'hourly: 3,240 / 13 = 249.23 a day; 11 - 4 = 7 days = 1,744.61');
check(h.flags.some((f) => f.code === 'quarter') && h.flags.some((f) => f.code === 'perweek'), 'hourly: the quarter rule of s.10(ב)(2) and the proportional day are flagged');
const six = run({ start: '2011-01-01', end: '2026-12-31', week: 6, salary: 9000, mode: 'balance', balance: 40, used: '' });
check(six.ok && six.row.n === 16 && six.row.net === 26 && six.dayValue === 360 && six.value === 14400, '6-day week, balance 40: seniority 16, 26 days (order); 9,000 / 25 = 360; 40 x 360 = 14,400');
check(run({ dayValue: 500 }).value === 15500 && run({ dayValue: 500 }).dayMethod === 'own', 'a payslip day value of 500 replaces the ratio: 31 x 500 = 15,500');
check(run({ scope: 'all' }).accrued === 67 && run({ scope: 'all' }).days === 47, 'all years: 4 + 12 + 51 = 67, minus 20 = 47');
const over = run({ used: 60 });
check(over.days === 0 && over.flags.some((f) => f.code === 'used'), 'more days used than accrued: 0 days and a flag');
const small = run({ start: '2019-06-01', regime: 'law', salary: 8000, used: 25 });
check(small.ok && [12, 14, 15, 14].join() === [2023, 2024, 2025, 2026].map((y) => yr(small, y).net).join() && small.days === 30 && small.value === 11076.9, 'law only: 12, 14, 15 and 216 x 16 / 240 = 14.4 -> 14; 55 - 25 = 30 x 369.23 = 11,076.90');

/* ---------- Temporary wage worker (ss.4, 15(א)) ---------- */
const t74 = run({ start: '2026-09-01', end: '2026-11-13', payType: 'hourly', salary: '', hourly: 40, hours: 100 });
const t75 = run({ start: '2026-09-01', end: '2026-11-14', payType: 'hourly', salary: '', hourly: 40, hours: 100 });
check(t74.ok && t74.mode === 'temp' && t74.spanDays === 74 && t74.tempPct === 4 && t74.days === 0, 'hourly, 74 days: no days, 4% of the wage (ss.4, 15(א))');
check(t75.ok && t75.mode === 'compute', 'hourly, 75 days: leave days by s.3');
check(run({ start: '2026-09-01', end: '2026-11-13' }).mode === 'compute', 'monthly, 74 days: the 75-day rule is for wage workers only');

/* ---------- Dates: month ends, leap years, still working ---------- */
const feb = run({ start: '2024-01-01', end: '2026-02-28' });
check(feb.dates.due === '2026-02-28' && feb.dates.lateFrom === '2026-03-09' && feb.dates.limitation === '2029-02-28', 'end 28.2.2026: due 28.2, delayed from 9.3, limitation 28.2.2029');
const leap = run({ start: '2024-01-01', end: '2028-02-29' });
check(leap.dates.limitation === '2031-02-28' && leap.dates.due === '2028-02-29', 'end 29.2.2028 (leap): limitation 28.2.2031');
check(run({ end: '2026-10-30' }).dates.due === '2026-10-31', 'end one day before the month end: due on the month end');
const w = run({ end: '', asOf: '2026-10-22' });
check(w.ok && !w.p.ended && w.dates.yearEnd === '2026-12-31' && w.dates.takeBy === '2027-12-31' && !w.dates.due, 'still working: the work year ends 31.12.2026, its leave is taken by 31.12.2027 (s.6(א)), no due date');
check(w.events.length === 2 && w.events.every((e) => e.rule.includes('חוק חופשה שנתית')), 'still working: two law dates for the calendar');
check(yr(w, 2026).worked === 211 && yr(w, 2026).net === 14 && w.days === 30, 'still working on 22.10.2026: 211 days, 211 x 17 / 240 = 14.95 -> 14; 50 - 20 = 30');

/* ---------- Pre-2017 years ---------- */
const pre = run({ start: '2014-01-01', end: '2019-06-30', used: 0 });
check(pre.ok && yr(pre, 2016).pre && yr(pre, 2016).net === null && pre.flags.some((f) => f.code === 'pre2017'), 'a window that reaches 2016: the year counts for seniority but its days are not computed, and it is flagged');
check(yr(pre, 2019).n === 6 && yr(pre, 2017).net === 12, 'start 2014: 2019 is seniority 6; 2017 (seniority 4) gives 12');

/* ---------- Input errors ---------- */
const errs = (over2) => { const x = run(over2); return x.ok ? [] : x.errors.map((e) => e.field); };
check(errs({ start: '' }).includes('start') && errs({ start: '31.2.2024' }).includes('start'), 'empty start and 31.2.2024 are errors');
check(errs({ end: '2021-08-01' }).includes('end'), 'end before start is an error');
check(errs({ start: '2015-01-01', end: '2016-12-31' }).includes('end'), 'an end before 1.1.2017 is refused (the older table)');
check(errs({ salary: 0 }).includes('salary') && errs({ salary: 'abc' }).includes('salary') && errs({ salary: -5 }).includes('salary'), 'salary 0, text or negative is an error');
check(errs({ payType: 'hourly', salary: '', hourly: 40, hours: 0 }).includes('hours'), 'hourly with 0 hours is an error');
check(errs({ perWeek: 6 }).includes('perWeek') && errs({ perWeek: 0 }).includes('perWeek'), 'perWeek 6 in a 5-day week, or 0, is an error');
check(errs({ used: -1 }).includes('used') && errs({ mode: 'balance', balance: '' }).includes('balance'), 'negative used, or balance mode without a balance, is an error');
check(errs({ workedEnd: 400 }).includes('workedEnd') && errs({ dayValue: -3 }).includes('dayValue'), 'worked 400 days or a negative day value is an error');
check(errs({ end: '', asOf: '' }).includes('end'), 'still working without a reference day is an error');
check(E.chRedemption(reg, Object.assign({}, EX, { end: '' })).ok === false, 'chRedemption refuses a missing end date');

/* ---------- The redemption function (for gmar) ---------- */
const v = E.chRedemption(reg, EX);
check(v.ok && v.days === 31 && v.dayValue === 553.85 && v.value === 17169.35 && v.due === '2026-10-31' && v.lateFrom === '2026-11-09' && v.limitation === '2029-10-31', 'chRedemption: 31 days, 553.85, 17,169.35, due/late/limitation');
check(v.perYear.length === 6 && v.sections.redeem === 'סעיף 13' && v.sections.limitation === 'סעיף 31' && Array.isArray(v.flags), 'chRedemption: per year, sections and flags');
check(E.chRedemption(reg, Object.assign({}, EX, { start: '2026-09-01', end: '2026-11-13', payType: 'hourly', salary: '', hourly: 40, hours: 100 })).tempPct === 4, 'chRedemption: temp mode carries 4%');

/* ---------- Rendering: snapshot, no h2, no undefined/NaN/null ---------- */
const snap = U.snapshot(reg);
const all = Object.values(snap).filter((x) => typeof x === 'string').join('\n');
check(snap.tool === 'chufsha-shnatit' && snap.total === 17169.35 && snap.result.includes('17,169.35') && snap.result.includes('553.85'), 'snapshot: the example figure 17,169.35 and the day 553.85');
check(!/<h2/i.test(all), 'snapshot: no <h2> anywhere');
check(!bad(all), 'snapshot: no undefined / NaN / null');
check(snap.lead.includes('17,169.35') && snap.lead.includes('data-lead-go') && snap.lead.includes('jtool-lead__figure') && snap.lead.includes('דוגמה מחושבת'), 'lead card: the example figure, the jump link, the markup');
check(snap.method.includes('סעיף 3(ג)') && snap.method.includes('216 × 17 ÷ 240 = 15') && snap.compare_table.includes('<caption>'), 'method carries the s.3(ג) step 216 x 17 / 240 = 15; the page table has a caption');
check(snap.details.includes('סעיף 13') && snap.details.includes('סעיף 31') && snap.details.includes('jtool-cite'), 'details cite s.13 and s.31');
check(snap.result.includes('אתם בשנת ותק 6') && snap.result.includes('המדרגה הבאה: שנת ותק 9') && (snap.result.match(/jt47-sr/g) || []).length >= 15, 'the staircase has its text equivalent (caption + a label per step)');
check(snap.result.includes('נצברו 51 ימים') && snap.result.includes('נוצלו 20, נשארו 31'), 'the ledger bar has its text equivalent');
const hist = U.historyTable(reg);
check(hist.includes('>14<') && hist.includes('>15<') && hist.includes('>16<') && hist.includes('1.7.2016') && hist.includes('ספר החוקים 2531'), 'what changed: 14 -> 15 (1.7.2016) -> 16 (1.1.2017), with the gazette');
for (const [k, pr] of Object.entries(U.PROFILES)) {
	const x = E.chCompute(reg, Object.assign({ asOf: '2026-10-22' }, pr.input));
	const html = U.renderResult(reg, x) + U.renderDetails(reg, x, { today: '2026-10-22', printedOn: '2026-10-22' }) + U.leadCard(reg, x);
	check(x.ok && !bad(html) && !/<h2/i.test(html), `profile ${k}: computes and renders clean`);
}
const errHtml = U.renderResult(reg, run({ start: '' }));
check(errHtml.includes('צריך לתקן') && errHtml.includes('יום תחילת העבודה') && U.leadCard(reg, run({ start: '' })).includes('—'), 'an input error renders its message; the lead card shows a dash');
const tHtml = U.renderResult(reg, t74);
check(tHtml.includes('4%') && !bad(tHtml), 'the temporary-worker result renders 4% clean');

/* ---------- The AI hand-off ---------- */
const brief = U.aiBrief(reg, r);
const words = brief.split(/\s+/).filter(Boolean).length;
check(brief.includes('31') && brief.includes('17,169.35') && brief.includes('553.85'), 'aiBrief carries the days, the value and the day value');
check(words >= 40 && words <= 90, `aiBrief has 40-90 words (${words})`);
check(!/\d{9}/.test(brief.replace(/[,.]/g, '')) && !bad(brief) && brief.includes('השאלה לתרגול'), 'aiBrief: no 9-digit run, no undefined, ends with the question');
check(snap.result.includes('<h4>התרחיש לסימולציה</h4>') && snap.result.includes('data-act="rehearse"') && snap.result.includes('purpose=mediation') && snap.result.includes('topic=employment'), 'the brief renders under its h4 with the rehearse button (mediation, employment)');
check(snap.result.includes('<h4>מה עושים עכשיו</h4>') && snap.result.includes('work-rights-violation-complaints') && snap.result.includes('href="/gmar-cheshbon/"'), 'next actions: the official complaint service and /gmar-cheshbon/');

/* ---------- .ics and print ---------- */
const cal = ics(r.events.map((e) => ({ date: e.date, summary: e.what })), '2026-10-22T10:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20261031') && cal.includes('DTSTART;VALUE=DATE:20261109') && cal.includes('DTSTART;VALUE=DATE:20291031'), 'ics: due 31.10.2026, delayed 9.11.2026, limitation 31.10.2029');
const pr = U.printSummary(reg, r, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('31 × 553.85 ₪ = 17,169.35 ₪') && snap.details.includes('jt47-print'), 'print summary: the result, the path, the sources with the date, the print date');

/* ---------- Share state round trip ---------- */
const rt = (inp) => U.inputOf(decodeState(`#s=${U.stateOf(inp)}`, U.KEYS));
const back = rt(EX);
check(back.start === EX.start && back.end === EX.end && back.week === 5 && back.salary === 12000 && back.used === 20 && back.mode === 'compute' && back.regime === 'order', 'stateOf -> decodeState -> inputOf round trip (example)');
const hb = rt(Object.assign({}, U.PROFILES.hourly.input));
check(hb.payType === 'hourly' && hb.hourly === 45 && hb.hours === 72 && hb.perWeek === 3 && hb.salary === '', 'round trip (hourly, 3 days)');
const bb = rt(Object.assign({}, U.PROFILES.six15.input));
check(bb.mode === 'balance' && bb.balance === 40 && bb.week === 6 && E.chCompute(reg, bb).value === 14400, 'round trip (balance mode, 6-day week) recomputes 14,400');
check(rt(Object.assign({}, U.PROFILES.work10.input)).end === '' && rt(Object.assign({}, U.PROFILES.small.input)).regime === 'law', 'round trip keeps "still working" and "law only"');
check(!/[a-z]{3,}@|\d{9}/.test(U.stateOf(EX)), 'the share state carries no name, mail or ID-like number');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
