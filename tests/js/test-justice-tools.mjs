/**
 * Golden tests for the co.il tools engines (HAD-485, HAD-490, HAD-498, HAD-502, HAD-504). Run: node tests/js/test-justice-tools.mjs
 *
 * CBS cases: the official linkage calculator (api.cbs.gov.il/index/data/calculator/120010),
 * queried on 12.10.2026; each case is the exact answer the CBS returned. The engine must
 * reproduce every one to the agora, which also proves the chaining coefficients and the
 * "known index" day rule.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as T04 from '../../assets/js/tools/hatzmada-engine.js';
import * as T02 from '../../assets/js/tools/minwage-engine.js';
import * as T03 from '../../assets/js/tools/havraa-engine.js';
import * as T05 from '../../assets/js/tools/tviot-engine.js';
import * as T05UI from '../../assets/js/tools/tviot-ui.js';
import * as YE from '../../assets/js/tools/yerusha-engine.js';
import * as YUI from '../../assets/js/tools/yerusha-ui.js';
import * as RQ from '../../assets/js/tools/rechisha-engine.js';
import * as RQUI from '../../assets/js/tools/rechisha-ui.js';
import * as HB from '../../assets/js/tools/hashbacha-engine.js';
import * as HBUI from '../../assets/js/tools/hashbacha-ui.js';
import * as TZ from '../../assets/js/tools/tzavaa-engine.js';
import * as TZUI from '../../assets/js/tools/tzavaa-ui.js';
import * as TE from '../../assets/js/tools/teuna-engine.js';
import * as TEUI from '../../assets/js/tools/teuna-ui.js';
import * as DT from '../../assets/js/tools/dates.js';
import * as GE from '../../assets/js/tools/gerushin-engine.js';
import * as GEUI from '../../assets/js/tools/gerushin-ui.js';
import * as RE from '../../assets/js/tools/schirut-engine.js';
import * as REUI from '../../assets/js/tools/schirut-ui.js';
import * as PE from '../../assets/js/tools/pitzuyim-engine.js';
import * as PEUI from '../../assets/js/tools/pitzuyim-ui.js';
import * as SH from '../../assets/js/tools/shevach-engine.js';
import * as SHUI from '../../assets/js/tools/shevach-ui.js';
import { encodeState, decodeState, decodeList, parseMoney, csv, ics, isStale, track, ilToday } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.005) => Math.abs(a - b) <= eps;

/* ---------- 1. CBS official calculator, to the agora ---------- */
const CBS = [
	// [amount, from, to, CBS to_value, CBS from-index month, CBS to-index month]
	[100, '2020-01-15', '2026-10-12', 119.74, '2019-11', '2026-08'],
	[1000000, '1990-03-20', '2026-10-12', 4276372.31, '1990-02', '2026-08'],
	[1000000, '1994-03-20', '2026-10-12', 2540297.98, '1994-02', '2026-08'],
	[1000000, '1999-03-20', '2026-10-12', 1637695.69, '1999-02', '2026-08'],
	[1000000, '2001-03-20', '2026-10-12', 1607252.26, '2001-02', '2026-08'],
	[1000000, '2003-03-20', '2026-10-12', 1469473.26, '2003-02', '2026-08'],
	[1000000, '2007-03-20', '2026-10-12', 1461575.88, '2007-02', '2026-08'],
	[1000000, '2009-03-20', '2026-10-12', 1364387.78, '2009-02', '2026-08'],
	[1000000, '2011-03-20', '2026-10-12', 1264575.56, '2011-02', '2026-08'],
	[1000000, '2013-03-20', '2026-10-12', 1226037.48, '2013-02', '2026-08'],
	[1000000, '2015-03-20', '2026-10-12', 1223962.97, '2015-02', '2026-08'],
	[1000000, '2017-03-20', '2026-10-12', 1221455.57, '2017-02', '2026-08'],
	[1000000, '2019-03-20', '2026-10-12', 1204534.16, '2019-02', '2026-08'],
	[1000000, '2021-03-20', '2026-10-12', 1203333.23, '2021-02', '2026-08'],
	[1000000, '2023-03-20', '2026-10-12', 1105342.41, '2023-02', '2026-08'],
	[1000000, '2025-03-20', '2026-10-12', 1042364.53, '2025-02', '2026-08'],
];
for (const [amount, from, to, expected, fromMonth, toMonth] of CBS) {
	const r = T04.compute(reg, { principal: amount, start: from, end: to, mode: 'link' });
	check(r.ok && near(r.total, expected), `CBS ${amount} ${from} -> ${to}: engine ${r.total}, CBS ${expected}`);
	check(r.ok && r.index.from.month === fromMonth && r.index.to.month === toMonth, `CBS index months ${from}: ${r.index && r.index.from.month} / ${fromMonth}`);
}

/* ---------- 2. The known-index day rule, as the CBS calculator applies it ---------- */
const cpi = T04.makeCpi(reg.cpi);
const KNOWN = [
	['2020-01-14', '2019-11'], ['2020-01-15', '2019-11'], ['2020-01-16', '2019-12'],
	['2020-02-15', '2019-12'], ['2020-02-16', '2020-01'], // 15.2.2020 was a Saturday
	['2026-09-15', '2026-07'], ['2026-09-16', '2026-08'],
];
for (const [day, month] of KNOWN) {
	check(cpi.knownMonth(T04.parseDate(day)) === month, `known index on ${day} is ${month}`);
}
check(cpi.monthOf(T04.parseDate('2026-03-01')) === '2026-03', 'index-for-the-month reading');

/* ---------- 3. Interest under the law (s.4א, 5, 5א), against arithmetic done here ---------- */
// Shekel interest, one quarter: 10,000 x 6.5% x 90 / 365 (rate from 1.1.2025).
let r = T04.compute(reg, { principal: 10000, start: '2025-01-01', end: '2025-04-01', mode: 'shekel' });
check(r.ok && near(r.total, 10000 + 10000 * 0.065 * 90 / 365), `shekel one quarter: ${r.total}`);

// Shekel interest over 12 months joins the principal on 1.1.2026 (s.4א(ב)(1)), then accrues on it.
r = T04.compute(reg, { principal: 10000, start: '2025-01-01', end: '2026-04-01', mode: 'shekel' });
{
	const y1 = 10000 * (0.065 * 90 + 0.0649 * 91 + 0.0646 * 92 + 0.0641 * 92) / 365;
	const p2 = 10000 + y1;
	const q1 = p2 * 0.0623 * 90 / 365;
	check(r.ok && near(r.total, p2 + q1, 0.01), `shekel with annual joining: engine ${r.total}, expected ${(p2 + q1).toFixed(2)}`);
	check(r.rows.some((row) => row.from === '2026-01-01' && row.join), 'joining is shown on 1.1.2026');
}

// Linked interest: interest on the real (linked) principal; total = units x index ratio.
r = T04.compute(reg, { principal: 10000, start: '2025-04-16', end: '2025-07-01', mode: 'linked' });
{
	const ratio = cpi.chained(cpi.knownMonth(T04.parseDate('2025-07-01'))) / cpi.chained(cpi.knownMonth(T04.parseDate('2025-04-16')));
	const expected = 10000 * (1 + 0.0386 * 76 / 365) * ratio;
	check(r.ok && near(r.total, expected, 0.01), `linked interest + linkage: engine ${r.total}, expected ${expected.toFixed(2)}`);
}

// Arrears (s.5, 5א): from the due date, shekel interest; fees every 3 months at rate/4 on the
// principal as joined at the due date; fees never join the principal.
r = T04.compute(reg, { principal: 10000, start: '2026-01-01', end: '2026-07-01', mode: 'shekel', due: '2026-03-01' });
{
	const atDue = 10000 * (1 + 0.0623 * 59 / 365);
	const arrearsInterest = atDue * (0.0623 * 31 + 0.0592 * 91) / 365;
	const fee = atDue * 0.0496 / 4; // 1.6.2026, rate in force from 1.4.2026
	check(r.ok && near(r.fees, fee, 0.01), `arrears fee on 1.6.2026: engine ${r.fees}, expected ${fee.toFixed(2)}`);
	check(r.ok && near(r.total, atDue + arrearsInterest + fee, 0.01), `arrears total: engine ${r.total}, expected ${(atDue + arrearsInterest + fee).toFixed(2)}`);
}

// Payments come off the updated principal (s.1, "קרן עדכנית").
r = T04.compute(reg, { principal: 40000, start: '2025-03-01', end: '2026-10-01', mode: 'link', payments: [{ date: '2025-09-01', amount: 10000 }, { date: '2026-03-01', amount: 5000 }] });
{
	const CI = (d) => cpi.chained(cpi.knownMonth(T04.parseDate(d)));
	const v1 = 40000 * CI('2025-09-01') / CI('2025-03-01') - 10000;
	const v2 = v1 * CI('2026-03-01') / CI('2025-09-01') - 5000;
	const v3 = v2 * CI('2026-10-01') / CI('2026-03-01');
	check(r.ok && near(r.total, v3, 0.01), `linkage with two part-payments: engine ${r.total}, expected ${v3.toFixed(2)}`);
}

// The worked example on the board and the page.
r = T04.compute(reg, { principal: 40000, start: '2025-03-01', end: '2026-10-01', mode: 'linked', payments: [{ date: '2025-09-01', amount: 10000 }, { date: '2026-03-01', amount: 5000 }] });
check(r.ok && r.total === 28547.33 && r.linkage === 1393.61 && r.interest === 2153.72, `board example T04: ${r.total}`);
{
	const sumClose = r.rows[r.rows.length - 1].closeTotal;
	check(sumClose === r.total, 'the court table closes on the verdict figure');
	const recon = Math.round((r.principal + r.linkage + r.interest + r.fees - r.paid) * 100) / 100;
	check(Math.abs(recon - r.total) <= 0.02, `table columns reconcile: ${recon} vs ${r.total}`);
}

// Old-law days are flagged, never silently computed.
r = T04.compute(reg, { principal: 1000, start: '2024-06-01', end: '2025-06-01', mode: 'linked' });
check(r.ok && r.flags.some((f) => f.code === 'old_law_period'), 'pre-2025 interest is flagged (Amendment 9, s.117)');
r = T04.compute(reg, { principal: 1000, start: '2024-01-01', end: '2025-06-01', mode: 'shekel', due: '2024-06-01' });
check(r.ok && r.flags.some((f) => f.code === 'old_law_arrears') && r.arrearsFrom === '2025-01-01', 'arrears before 2025 restart counting on 1.1.2025');

// Errors and scope.
check(!T04.compute(reg, { principal: 0, start: '2025-01-01', end: '2025-02-01' }).ok, 'zero amount is an input error');
check(!T04.compute(reg, { principal: 10, start: '2025-02-01', end: '2025-01-01' }).ok, 'end before start is an input error');
check(T04.compute(reg, { principal: 10, start: '1985-01-01', end: '2025-01-01' }).outOfScope === true, 'before the series is out of scope');
r = T04.compute(reg, { principal: 100, start: '2026-01-01', end: '2027-03-01', mode: 'link' });
check(r.ok && r.flags.some((f) => f.code === 'index_not_published'), 'an index not yet published is flagged');
check(T04.parseDate('1.3.25') === T04.parseDate('2025-03-01') && T04.parseDate('01/03/2025') === T04.parseDate('2025-03-01'), 'date formats 1.3.25, 01/03/2025, 2025-03-01');
check(T04.parseDate('31.2.2025') === null, 'impossible dates are rejected');

// Review fixes (PR 121): a half-filled or mistyped payment row is an error, never dropped.
const base = { principal: 40000, start: '2025-03-01', end: '2026-10-01', mode: 'link' };
r = T04.compute(reg, Object.assign({}, base, { payments: [{ date: '2025-09-01', amount: '' }] }));
check(!r.ok && r.errors.some((e) => e.field === 'payments'), 'a payment row without an amount is an error');
r = T04.compute(reg, Object.assign({}, base, { payments: [{ date: '31.2.2025', amount: 5000 }] }));
check(!r.ok && r.errors.some((e) => e.field === 'payments'), 'a payment row with an impossible date is an error');
r = T04.compute(reg, Object.assign({}, base, { payments: [{ date: '', amount: 'abc' }] }));
check(!r.ok && r.errors.some((e) => e.field === 'payments'), 'a payment row with a mistyped amount is an error');
r = T04.compute(reg, Object.assign({}, base, { payments: [{ date: '', amount: '' }] }));
check(r.ok && r.paid === 0, 'an empty payment row is ignored');
// Review fixes (PR 121): no interest rate is guessed beyond the last published quarter.
r = T04.compute(reg, { principal: 1000, start: '2026-01-01', end: '2027-01-15', mode: 'linked' });
check(!r.ok && r.errors.some((e) => e.field === 'end' && e.he.includes('31.12.2026')), 'interest past 31.12.2026 is refused, not extrapolated');
r = T04.compute(reg, { principal: 1000, start: '2026-01-01', end: '2026-12-31', mode: 'shekel' });
check(r.ok, 'interest through the last published quarter is computed');
r = T04.compute(reg, { principal: 1000, start: '2026-01-01', end: '2027-02-01', mode: 'link', due: '2026-06-01' });
check(!r.ok, 'arrears past the last published quarter are refused too');

/* ---------- 4. Minimum wage (T02) ---------- */
let m = T02.compute(reg, { age: 'adult', payType: 'hourly', from: '2025-01', to: '2026-09', pay: 33, hours: 182, divisor: 182 });
check(m.ok && m.gapTotal === 5503.68 && m.monthsShort === 18 && m.months === 21, `board example T02: ${m.gapTotal}`);
check(m.ok && near(m.gapTotal, 12 * (34.32 - 33) * 182 + 6 * (35.4 - 33) * 182, 0.01), 'T02 gap = 12 x (34.32-33) x 182 + 6 x (35.40-33) x 182');
m = T02.compute(reg, { age: 'adult', payType: 'hourly', from: '2025-01', to: '2026-09', pay: 33, hours: 182, divisor: 186 });
check(m.ok && m.gapTotal === 3057.6, `T02 at 186 hours: ${m.gapTotal}`);
m = T02.compute(reg, { age: 'adult', payType: 'monthly', from: '2026-04', to: '2026-04', pay: 6443.85, jobPct: 100 });
check(m.ok && m.state === 'ok' && m.gapTotal === 0, 'exactly the minimum is not a gap');
m = T02.compute(reg, { age: 'adult', payType: 'monthly', from: '2026-04', to: '2026-04', pay: 3000, jobPct: 50 });
check(m.ok && m.gapTotal === 221.93, `part-time: 50% of 6,443.85 = 3,221.93, gap ${m.gapTotal}`);
let y = T02.minimumFor(reg.min_wage, '2026-05', { age: 'age17' });
check(y.monthly === 5348.4 && y.hourly === 30.92, `youth 17: ${y.monthly} / ${y.hourly}`);
y = T02.minimumFor(reg.min_wage, '2026-05', { age: 'under16' });
check(y.monthly === 4510.7 && y.hourly === 26.07, `youth under 16: ${y.monthly} / ${y.hourly}`);
y = T02.minimumFor(reg.min_wage, '2026-05', { age: 'apprentice' });
check(y.monthly === 3866.31, `apprentice 60%: ${y.monthly}`);
y = T02.minimumFor(reg.min_wage, '2017-06', { age: 'adult', divisor: 182 });
check(y.monthly === 5000 && y.divisor === 186 && y.hourly === 26.88, 'before 1.4.2018 only the 186-hour rate exists');
check(T02.minimumFor(reg.min_wage, '2026-03', { age: 'adult' }).monthly === 6247.67, 'March 2026 still uses the 1.4.2025 rate');
check(T02.compute(reg, { age: 'adult', payType: 'hourly', from: '2014-01', to: '2015-06', pay: 20, hours: 100 }).outOfScope === true, 'before the table is out of scope');
m = T02.compute(reg, { age: 'adult', payType: 'hourly', from: '2027-01', to: '2027-05', pay: 30, hours: 100 });
check(m.ok && m.flags.some((f) => f.code === 'rate_not_published'), 'a rate after the next 1 April is flagged');

/* ---------- 5. Instrument helpers ---------- */
const st = encodeState({ a: 40000, f: '2025-03-01', m: 'linked', p: [['2025-09-01', 10000], ['2026-03-01', 5000]] });
check(st === 'a40000/f2025-03-01/mlinked/p2025-09-01_10000~2026-03-01_5000', `share state ${st}`);
const back = decodeState(`#s=${st}`, ['a', 'f', 'm', 'p']);
check(back.a === '40000' && back.f === '2025-03-01' && decodeList(back.p).length === 2, 'share state round-trips');
check(!/[?&=]/.test(st.replace(/^s=/, '')), 'share state has no query-string characters');
check(Object.keys(decodeState('#s=a1/x<script>/f2025-01-01', ['a', 'f'])).join() === 'a,f', 'unknown or unsafe keys are dropped');
check(parseMoney('12,000') === 12000 && parseMoney('12 אלף') === 12000 && parseMoney('₪ 1,234.5') === 1234.5 && Number.isNaN(parseMoney('abc')), 'money parsing');
check(csv([['a', 'b,c']]).endsWith('a,"b,c"'), 'CSV quoting');
check(ics([{ date: '2026-10-02', summary: 'x' }], '2026-10-12T13:00:00').includes('DTSTART;VALUE=DATE:20261002'), 'ics all-day event');
check(isStale('2026-10-12', 31, new Date('2026-11-20T00:00:00Z')) && !isStale('2026-10-12', 31, new Date('2026-10-20T00:00:00Z')), 'stale-data window');

// Review fix (PR 121): analytics go through one transport only, and never carry amounts.
{
	const calls = [];
	globalThis.window = { location: { pathname: '/hatzmada-madad/' }, dataLayer: [], gtag: (...a) => calls.push(a) };
	track('tool_result', { tool_id: 'hatzmada', band: 'linked', amount: 40000 });
	check(calls.length === 1 && window.dataLayer.length === 0, 'with gtag present, the event is sent once (no extra dataLayer push)');
	check(!JSON.stringify(calls).includes('40000'), 'no amount in the analytics payload');
	window.gtag = undefined;
	track('tool_view', { tool_id: 'hatzmada' });
	check(window.dataLayer.length === 1, 'without gtag, the data layer receives the event');
	delete globalThis.window;
}

/* ---------- 6. Recuperation pay, T03 (HAD-490) ---------- */
// Days by seniority, the order's s.5(א) (Yalkut HaPirsumim 7417).
const DAYS = [5, 6, 6, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10];
DAYS.forEach((d, i) => check(T03.daysFor(reg.havraa.days, i + 1) === d, `havraa: work year ${i + 1} = ${d} days`));
check(T03.priceOn(reg.havraa.private_rates, '2023-06-30').rate === 378 && T03.priceOn(reg.havraa.private_rates, '2023-07-01').rate === 418, 'havraa: 378 until 30.6.2023, 418 from 1.7.2023 (Yalkut 11651, s.3)');
check(T03.priceOn(reg.havraa.private_rates, '2026-07-01').rate === 451.5, 'havraa: 451.50 for havraa year 2026 (Yalkut 14863, s.3)');
// The Ministry of Labor guide's own examples (gov.il "קצובת הבראה", calculation chapter).
let hv = T03.compute(reg, { mode: 'period', start: '2020-01-01', end: '2021-12-31', asOf: '2026-10-12', jobPct: 50, applyDeduction: false });
check(hv.ok && hv.daysDue === 5.5, `Ministry example: half-time for two years = 5.5 days (${hv.daysDue})`);
hv = T03.compute(reg, { mode: 'year', years: 1, jobPct: 100, havraaYear: 2026, leaveMonths: 3 });
check(hv.ok && hv.daysDue === 4.5 && T03.daysFor(reg.havraa.days, 1) + hv.daysDue === 9.5, `Ministry example: two full years with 3 months unpaid leave in the second = 9.5 days (${hv.daysDue} + 5)`);
// The board's worked results.
hv = T03.compute(reg, { mode: 'year', years: 4, jobPct: 100, havraaYear: 2026 });
check(hv.ok && hv.state === 'due' && hv.full === 7 && hv.net === 3160.5, `board example T03 (year): 7 x 451.50 = ${hv.net}`);
hv = T03.compute(reg, { mode: 'year', years: 4, jobPct: 100, havraaYear: 2025 });
check(hv.ok && hv.gross === 2926 && hv.deduction === 418 && hv.net === 2508, `2025: 7 x 418 less one day under the 2025 law = ${hv.net}`);
hv = T03.compute(reg, { mode: 'year', years: 4, jobPct: 100, havraaYear: 2025, lowPay: true });
check(hv.ok && hv.deduction === 209 && hv.net === 2717, `2025, partial-deduction worker: half a day = ${hv.deduction}`);
hv = T03.compute(reg, { mode: 'year', years: 4, jobPct: 100, havraaYear: 2025, applyDeduction: false });
check(hv.ok && hv.net === 2926, 'the deduction can be switched off for the what-if');
hv = T03.compute(reg, { mode: 'year', years: 10, jobPct: 50, havraaYear: 2026 });
check(hv.ok && hv.full === 8 && hv.daysDue === 4 && hv.net === 1806, `part-time: 8 days x 50% x 451.50 = ${hv.net} (s.5(ג))`);
hv = T03.compute(reg, { mode: 'year', years: 0, jobPct: 100 });
check(hv.ok && hv.state === 'not_yet' && hv.net === 0, 'first year not completed: nothing yet (s.5(ב))');
hv = T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', jobPct: 100, paid: 0 });
check(hv.ok && hv.daysDue === 34.5 && hv.gross === 14098.25 && hv.deduction === 836 && hv.gap === 13262.25, `board example T03 (period): ${hv.gap}`);
check(hv.ok && hv.rows.map((v) => v.price).join() === '378,378,418,418,418,451.5' && hv.rows[5].fraction === 0.5, 'each work year at the price on the 1 July inside it; the last part-year by months');
check(hv.ok && hv.rows[3].deduction === 418 && hv.rows[4].deduction === 418 && hv.rows[2].deduction === 0, 'deductions only in the work years valued in 2024 and 2025');
const latestHv = T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', jobPct: 100, paid: 0, valuation: 'latest' });
check(latestHv.ok && latestHv.gap === 15576.75, `what-if: all years at 451.50 = ${latestHv.gap}`);
hv = T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', jobPct: 100, paid: 5000 });
check(hv.ok && hv.gap === 8262.25 && hv.state === 'owed', 'payments made come off the total');
hv = T03.compute(reg, { mode: 'period', start: '2023-09-01', end: '2024-08-31', asOf: '2026-10-12', jobPct: 100, lowPay: true });
check(hv.ok && hv.rows[0].full === 5 && hv.rows[0].deduction === 209 && hv.gap === 1881, `2024, 5-day worker on low pay: half a day (2024 law, partial deduction) = ${hv.gap}`);
hv = T03.compute(reg, { mode: 'period', start: '2026-01-01', end: '2026-06-30', asOf: '2026-10-12', jobPct: 100 });
check(hv.ok && hv.state === 'not_eligible' && hv.gap === 0, 'less than a year of work: no havraa under the order (s.5(ב))');
hv = T03.compute(reg, { mode: 'period', start: '2015-01-01', end: '', asOf: '2026-10-12', jobPct: 100 });
check(hv.ok && hv.flags.some((f) => f.code === 'limitation') && hv.rows.filter((v) => v.barred).length === 5 && hv.rows[4].valueOn === '2019-07-01' && hv.rows[4].barred && !hv.rows[5].barred && hv.limitFrom === '2019-10-12', 'a year whose payment fell due more than 7 years ago is barred, counted from its due date (Limitation Law s.5(1), s.6)');
check(T03.compute(reg, { mode: 'year', years: 3, sector: 'public' }).outOfScope === true, 'public sector is out of scope');
check(T03.compute(reg, { mode: 'year', years: 3, havraaYear: 2027 }).outOfScope === true, 'a havraa year with no published price is refused, never guessed');
check(!T03.compute(reg, { mode: 'period', start: '2024-01-01', end: '2026-12-31', asOf: '2026-10-12' }).ok, 'an end date after today is an input error');
check(!T03.compute(reg, { mode: 'year', years: 3, jobPct: 0 }).ok, 'job % 0 is an input error');
check(T03.monthsWorked('2026-03-01', '2026-08-31') === 6 && Math.abs(T03.monthsWorked('2026-03-01', '2026-03-15') - 15 / 31) < 1e-9, 'months worked: 6 whole months; half a month as days of that month');

// Review fixes (PR 123): unpaid leave in period mode, and the low-pay half day per law year.
hv = T03.compute(reg, { mode: 'period', start: '2020-01-01', end: '2021-12-31', asOf: '2026-10-12', jobPct: 100, applyDeduction: false, leaves: [{ from: '2021-01-01', to: '2021-03-31' }] });
check(hv.ok && hv.daysDue === 9.5 && hv.leaveMonths === 3 && hv.rows[1].leave === 3, `Ministry example in period mode: 3 months of unpaid leave in year 2 -> 9.5 days (${hv.daysDue})`);
hv = T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', leaves: [{ from: '2024-03-01', to: '2024-04-15' }] });
check(hv.ok && Math.abs(hv.rows[3].leave - 1.5) < 1e-9 && hv.rows[3].daysDue === 6.125, `leave inside work year 4 (1.5 months) cuts its days: ${hv.rows[3].daysDue}`);
check(!T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', leaves: [{ from: '2024-03-01', to: '' }] }).ok, 'a half-filled leave row is an error, never dropped');
check(!T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', leaves: [{ from: '2020-01-01', to: '2020-02-01' }] }).ok, 'a leave period outside the employment is an error');
check(!T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', leaves: [{ from: '2024-01-01', to: '2024-03-31' }, { from: '2024-01-01', to: '2024-03-31' }] }).ok, 'overlapping leave periods are refused, never counted twice');
check(T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', leaves: [{ from: '2024-01-01', to: '2024-01-31' }, { from: '2024-02-01', to: '2024-02-29' }] }).ok, 'back-to-back leave periods are fine');
hv = T03.compute(reg, { mode: 'period', start: '2021-03-01', end: '2026-08-31', asOf: '2026-10-12', lowPay: { 2024: false, 2025: true } });
check(hv.ok && hv.rows[3].deduction === 418 && hv.rows[4].deduction === 209 && hv.gap === 13471.25, `low pay in 2025 only: half a day in 2025, a full day in 2024 (${hv.gap})`);
hv = T03.compute(reg, { mode: 'year', years: 4, havraaYear: 2025, lowPay: { 2024: true, 2025: false } });
check(hv.ok && hv.deduction === 418, 'year mode reads the low-pay flag of the year asked for');

/* ---------- 7. Small claims, T05 (HAD-490) ---------- */
const sc = reg.small_claims;
const FEES = [[12748, 130], [39900, 400], [5000, 50], [5001, 55], [100, 50], [25010, 255], [12500, 125], [1234.56, 50], [10000, 100]];
for (const [a, f] of FEES) { check(T05.fee(sc, a).fee === f, `small claims fee on ${a}: ${T05.fee(sc, a).fee} (expected ${f}; reg. 6(א)(1)-(3))`); }
let s5 = T05.compute(reg, { mode: 'full', amount: 12748, plaintiff: 'individual', on: '2026-10-12' });
check(s5.ok && s5.verdict === 'yes' && s5.fee === 130 && s5.ceiling === 39900, 'board example T05: an individual, 12,748 ₪, fits; fee 130 ₪');
check(T05.compute(reg, { mode: 'full', amount: 12748, plaintiff: 'osek', on: '2026-10-12' }).verdict === 'yes', 'an osek patur or murshe sues as an individual');
check(T05.compute(reg, { mode: 'full', amount: 12748, plaintiff: 'company', on: '2026-10-12' }).verdict === 'no', 'a company may not sue in small claims (s.60(א): an individual)');
check(T05.compute(reg, { mode: 'full', amount: 39900, plaintiff: 'individual', on: '2026-10-12' }).verdict === 'yes', 'exactly the ceiling fits');
s5 = T05.compute(reg, { mode: 'full', amount: 45000, plaintiff: 'individual', on: '2026-10-12' });
check(s5.verdict === 'no' && s5.overCeiling && s5.overBy === 5100, 'over the ceiling by 5,100 ₪ does not fit');
check(T05.compute(reg, { mode: 'full', amount: 5000, labor: true, on: '2026-10-12' }).verdict === 'no', 'an employee-employer dispute belongs to the labour court');
check(T05.compute(reg, { mode: 'full', amount: 5000, assigned: true, on: '2026-10-12' }).verdict === 'no', 'a claim by an assigned right does not fit');
check(T05.compute(reg, { mode: 'full', amount: 5000, claimsThisYear: 5, on: '2026-10-12' }).verdict === 'depends' && T05.compute(reg, { mode: 'full', amount: 5000, claimsThisYear: 4, on: '2026-10-12' }).verdict === 'yes', 'more than five claims a year in the same court: the court may transfer (s.60(ב))');
s5 = T05.compute(reg, { mode: 'full', amount: 12748, eventDate: '2026-03-01', hearingDate: '2027-02-15', servedDate: '2026-10-05', on: '2026-10-12' });
const byCode = Object.fromEntries(s5.dates.map((d) => [d.code, d.date]));
check(byCode.service_check === '2026-12-17' && byCode.witness === '2026-12-17' && byCode.plaintiff_service === '2027-01-06' && byCode.interpreter === '2027-02-08', 'deadlines before a hearing on 15.2.2027: 60, 40 and 7 days');
check(byCode.defence === '2026-11-04', 'defence: 30 days from service on 5.10.2026 (reg. 4(ב))');
check(byCode.limitation === '2033-03-01', 'limitation: 7 years from 1.3.2026');
check(T05.compute(reg, { mode: 'full', amount: 1000, eventDate: '2019-01-01', on: '2026-10-12' }).flags.some((f) => f.code === 'limitation_passed'), 'an event more than 7 years ago is flagged');
s5 = T05.compute(reg, { mode: 'fee', amount: 39900, on: '2026-10-12' });
check(s5.ok && s5.mode === 'fee' && s5.fee === 400 && !s5.overCeiling, 'fee-only mode: 39,900 ₪ -> 400 ₪');
check(T05.compute(reg, { mode: 'fee', amount: 50000, on: '2026-10-12' }).overCeiling === true, 'fee-only mode flags an amount over the ceiling');
// Review fix (PR 123): no verdict on the 2026 ceiling once the 1 January update is due and not yet registered.
s5 = T05.compute(reg, { mode: 'full', amount: 39950, plaintiff: 'individual', on: '2027-01-02' });
check(s5.ok && s5.ceilingUnknown && s5.verdict === 'depends' && s5.conds[1].met === null && s5.flags.some((f) => f.code === 'ceiling_unknown'), 'from 1.1.2027 the amount test is "depends", not a 39,900-based no');
s5 = T05.compute(reg, { mode: 'fee', amount: 39950, on: '2027-01-02' });
check(s5.ok && s5.overCeiling === null && s5.fee === 400, 'fee-only after the update date: the fee still computes, the ceiling check does not');
check(T05.compute(reg, { mode: 'full', amount: 39950, plaintiff: 'individual', on: '2026-12-31' }).verdict === 'no', 'until 31.12.2026 the 39,900 ceiling decides');
// Review fix (PR 123, second pass): the court for a claim that is not a small claim (Courts Law s.51(א)(2), s.40(1)).
check(T05.compute(reg, { mode: 'full', amount: 45000, on: '2026-10-12' }).forum === 'magistrate' && T05.compute(reg, { mode: 'full', amount: 2500000, on: '2026-10-12' }).forum === 'magistrate', 'up to 2,500,000 NIS: magistrate court');
check(T05.compute(reg, { mode: 'full', amount: 3000000, on: '2026-10-12' }).forum === 'district', 'above 2,500,000 NIS: district court');
// Review fix (PR 123, third pass): no small-claims fee breakdown or fee what-if for a claim that does not belong there,
// and the fee page's hint carries the ceiling's date.
{
	const no = T05.compute(reg, { mode: 'full', amount: 12748, plaintiff: 'company', on: '2026-10-12' });
	const html = T05UI.renderDetails(reg, no, T05.compute(reg, { mode: 'full', amount: 39900, plaintiff: 'company', on: '2026-10-12' }));
	check(!html.includes('האגרה, שורה אחרי שורה') && !html.includes('data-compare') && html.includes('לא חלה'), 'a rejected claim shows no small-claims fee breakdown and no fee what-if');
	const yes = T05.compute(reg, { mode: 'full', amount: 12748, plaintiff: 'individual', on: '2026-10-12' });
	check(T05UI.renderDetails(reg, yes, null).includes('האגרה, שורה אחרי שורה'), 'an eligible claim keeps its fee breakdown');
	check(T05UI.renderForm(reg, { mode: 'fee', amount: 39900 }).includes('התקרה מ-1.1.2026: 39,900'), 'the fee page hint names the ceiling with its date');
}
check(!T05.compute(reg, { mode: 'full', amount: 0, on: '2026-10-12' }).ok && !T05.compute(reg, { mode: 'full', amount: 100, hearingDate: '31.2.2027', on: '2026-10-12' }).ok, 'zero amount and impossible dates are input errors');

/* ---------- Wave 3 (HAD-498): inheritance without a will, Succession Law ss.10-17, 55 ---------- */
{
	const shares = (input) => { const r = YE.compute(reg, input); return r.ok ? Object.fromEntries(r.heirs.map((h) => [h.key, YE.fracText(h.share)])) : r; };
	const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
	check(eq(shares({ spouse: 'married', children: 2 }), { spouse: '1/2', 'child-1': '1/4', 'child-2': '1/4' }), 's.11(א)(1) + s.13: spouse 1/2, two children 1/4 each');
	check(eq(shares({ spouse: 'married', children: 1, childLines: [2] }), { spouse: '1/2', 'child-1': '1/4', 'grandchild-1-1': '1/8', 'grandchild-1-2': '1/8' }), 's.14(א)-(ב): a child who died first is replaced by his two children, 1/8 each');
	check(eq(shares({ spouse: 'married', mother: true, siblingsFull: 2 }), { spouse: '1/2', mother: '1/2' }), 's.14(א) end: spouse and a living parent, the siblings do not represent the parent who died');
	{
		const q = YE.compute(reg, { spouse: 'married', mother: true, children: 1, childLines: [2] });
		check(q.ok && q.question && eq(shares({ spouse: 'married', mother: true, children: 1, childLines: [2] }), { spouse: '1/2', 'child-1': '1/4', 'childline-1': '1/4' }) && q.flags.some((f) => f.code === 'rep_children_question'), 's.14(א) end with a predeceased child: that line is a legal question, not split (review, PR 124)');
		check(!YE.compute(reg, { spouse: 'married', children: 1, childLines: [2] }).question, 'no parent or grandparent alive: grandchildren represent as usual');
		const pm = YE.compute(reg, { spouse: 'partner', partnerFree: false, children: 2 });
		check(pm.ok && pm.spouse === 'none' && pm.flags.some((f) => f.code === 'partner_married') && eq(shares({ spouse: 'partner', partnerFree: false, children: 2 }), { 'child-1': '1/2', 'child-2': '1/2' }), 's.55: a partner married to another at the death does not inherit (review, PR 124)');
		check(YE.compute(reg, { spouse: 'partner', children: 2 }).spouse === 'partner', 's.55: by default the partner condition is taken as met');
		const pd = YE.compute(reg, { spouse: 'partner', partnerMarried: 'deceased', children: 1 });
		check(!pd.ok && pd.outOfScope && /סעיף 11/.test(pd.errors[0].he) && YE.compute(reg, { spouse: 'partner', partnerMarried: 'survivor', children: 1 }).spouse === 'none', 's.55: the deceased married elsewhere -> the legal spouse case; the survivor married elsewhere -> no partner (review, PR 124)');
		const ad = YE.compute(reg, { spouse: 'none', mother: true, adopted: true });
		check(ad.ok && ad.flags.some((f) => f.code === 'adopted') && ad.path.some((p) => p.rule === reg.yerusha.sections.adopted), 's.16: an adopted deceased, the parents entered are the adoptive side and the rule is stated (review, PR 124)');
	}
	check(eq(shares({ siblingsFull: 2, siblingsFather: 1 }), { 'sib-full-1': '5/12', 'sib-full-2': '5/12', 'sib-father-1': '1/6' }), 'both parents died: full siblings take from both halves (5/12), a paternal half sibling only from the father side (1/6)');
	check(eq(shares({ spouse: 'married', siblingsFull: 2 }), { spouse: '2/3', 'sib-full-1': '1/6', 'sib-full-2': '1/6' }), 's.11(א)(2): spouse 2/3 with siblings only');
	check(eq(shares({ spouse: 'married', grandparents: 2 }), { spouse: '2/3', 'grand-1': '1/6', 'grand-2': '1/6' }), 's.11(א)(2): spouse 2/3 with grandparents; no representation for the others');
	check(eq(shares({ spouse: 'married' }), { spouse: '1' }), 's.11(ב): spouse with none of those relatives takes all');
	check(eq(shares({ spouse: 'none', mother: true, father: true }), { father: '1/2', mother: '1/2' }), 's.13: parents in equal shares');
	check(eq(shares({ spouse: 'none', mother: true }), { mother: '1' }), 'a parent who died with no other descendants: the other parent takes the whole parents part');
	{
		const r = YE.compute(reg, { spouse: 'married', spouseApartment: true, siblingsFull: 2, apartment: 2400000, other: 600000 });
		check(r.ok && r.spouseApt && r.heirs[0].amount === 2800000 && r.heirs[1].amount === 100000, 's.11(א)(2) proviso: married 3 years and lived there -> the whole apartment + 2/3 of the rest (2,800,000 / 100,000)');
	}
	{
		const r = YE.compute(reg, { spouse: 'partner', spouseApartment: true, siblingsFull: 1 });
		check(r.ok && !r.spouseApt && r.flags.some((f) => f.code === 'partner_apartment') && r.flags.some((f) => f.code === 'partner'), 's.55: a cohabiting partner gets the spouse shares; the apartment proviso is flagged, not applied');
	}
	check(YE.compute(reg, {}).state === true, 's.17: no spouse and no relatives -> the State');
	{
		const un = YE.compute(reg, { otherRelatives: true });
		check(un.ok && un.unknown && un.heirs.length === 1 && un.heirs[0].unresolved && YUI.renderResult(reg, un).includes('דודים ובני דודים') && !YUI.renderResult(reg, un).includes('0 יורשים'), 'only uncles or cousins: an unresolved row, no "0 heirs" (review, PR 124)');
	}
	{
		const r = YE.compute(reg, { grandparents: 2 });
		const g = r.ok && r.heirs.find((h) => h.key === 'grand-1');
		check(r.ok && r.unresolved && g && YE.fracText(g.share) === '1/4', 'no spouse, two grandparents alive: each 1/4, the rest flagged to their descendants');
	}
	{
		let total = [0, 1];
		for (const h of YE.compute(reg, { spouse: 'married', children: 3, childLines: [3, 1] }).heirs) { total = YE.fadd(total, h.share); }
		check(YE.fracText(total) === '1', 'the shares always add up to the whole estate');
	}
	check(!YE.compute(reg, { children: -1 }).ok && !YE.compute(reg, { childLines: [1.5] }).ok, 'negative or fractional counts are input errors');
	const fee = YE.compute(reg, { spouse: 'married', children: 1 }).fee;
	check(fee.fee === 597 && fee.online === 507 && fee.publication === 66, 'registrar fee 597 NIS from 1.1.2026; online 507 and publication 66 as charged by the government payments service (review, PR 126)');
	const snap = YUI.snapshot(reg);
	check(snap.sentence.includes('1/2') && snap.details.includes('597') && snap.details.includes('jt6-chart'), 'yerusha snapshot: sentence, the cost of the order and the family chart');
	check(snap.details.includes('תקנה 17(ג)') && snap.details.includes('הוצאות הפרסום'), 'review fix (PR 124): the order cost names the publication expense the applicant also pays');
}

/* ---------- Wave 3: purchase tax (Land Taxation Law s.9; Tax Authority instructions 2/2024, 1/2025, 2/2026) ---------- */
{
	const pt = reg.purchase_tax;
	const tax = (trk, price, on = '2026-10-13') => RQ.taxFor(pt, trk, price, on);
	check(tax('single', 1978745).tax === 0 && tax('single', 1978746).tax === 0.04, 'single home: 0% up to 1,978,745, then 3.5% (1 NIS -> 0.035 -> 0.04)');
	check(near(tax('single', 2650000).tax, 28038.33), 'single home 2,650,000: 368,295 x 3.5% + 302,960 x 5% = 28,038.33');
	check(near(tax('single', 8000000).tax, 353886.23), 'single home 8,000,000: four brackets = 353,886.23');
	check(tax('additional', 2650000).tax === 212000 && near(tax('additional', 8000000).tax, 678898.6), 'additional home: 8% to 6,055,070, 10% above');
	check(tax('additional', 2650000, '2027-02-10').tax === 212000 && tax('additional', 2650000, '2027-02-11').refused === 'after', 'additional home: 8%/10% through 10.2.2027 (Tax Authority notice, 12.10.2026), refused after, not guessed');
	check(tax('single', 2650000, '2024-01-15').refused === 'before' && near(tax('single', 2650000, '2024-01-16').tax, 28038.33), 'single home: verified from 16.1.2024 (instruction 2/2024), not before');
	check(near(tax('oleh', 3000000).tax, 5106.28) && near(tax('oleh', 8000000).tax, 175976.03), 'oleh (reg. 12א): 0%, 0.5% to 6,055,070, then 8%');
	check(tax('oleh', 20183566).refused === 'oleh_cap', 'oleh relief not above 20,183,565 NIS (reg. 12א(ג))');
	check(tax('disabled', 2400000).tax === 2106.28 && tax('disabled', 3000000).tax === 15000, 'disability track (reg. 11(א)): 0.5% from 1,978,745 to 2,500,000; above it 0.5% on all');
	{
		const other = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'disabled', otherHome: true });
		const sole = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'disabled' });
		check(other.ok && other.tax === 10000 && other.flat, 'reg. 11(א): a disabled buyer with another home pays 0.5% on all, 10,000 on 2,000,000 (review, PR 124)');
		check(sole.ok && sole.tax === 106.28 && sole.flags.some((f) => f.code === 'disabled_sole'), 'reg. 11(א): the brackets for a sole home, with the condition stated');
	}
	// The Tax Authority's own examples (instruction 2/2026, s.2.1.1.1.1-4): the sale window and the war extension.
	const dl = (d, o = {}) => RQ.replacementDeadline(pt, d, o).deadline;
	check(dl('2024-09-01') === '2026-08-31', 'instruction 2/2026 example 1: bought 1.9.24, 18 months -> 1.3.26 -> extended to 31.8.26');
	check(dl('2025-04-30') === '2027-01-31', 'instruction 2/2026 example 2: bought 30.4.25 -> 31.10.26 -> 31.1.27');
	check(dl('2025-06-01') === '2027-09-01', 'instruction 2/2026 example 3: bought 1.6.25, 24 months -> 1.6.27 -> 1.9.27');
	check(dl('2024-06-01', { contractor: true, delivery: '2025-12-31' }) === '2027-03-31', 'instruction 2/2026 example 4: contractor, delivered 31.12.25 -> 31.12.26 -> 31.3.27');
	{
		const u1 = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2026-01-01', reliefUsed: true });
		const u2 = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'disabled', reliefUsed: true });
		check(!u1.ok && u1.outOfScope && /12א\(ב\)/.test(u1.errors[0].he) && !u2.ok && u2.outOfScope && /פעמיים/.test(u2.errors[0].he), 'reg. 12א(ב) once, reg. 11(א) twice: a spent relief is refused (review, PR 124)');
	}
	{
		const nr = RQ.compute(reg, { price: 1500000, date: '2026-10-13', track: 'single', nonResident: true });
		const nd = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'disabled', nonResident: true });
		const na = RQ.compute(reg, { price: 1500000, date: '2026-10-13', track: 'additional', nonResident: true });
		check(!nr.ok && nr.outOfScope && nd.ok && nd.tax === 10000 && na.ok && na.tax === 120000, 's.9(ג1ג)(2): a non-resident gets no single-home brackets; additional 8% = 120,000 on 1.5M (review, PR 124)');
	}
	{
		const nh = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'disabled', notForHousing: true });
		check(!nh.ok && nh.outOfScope && /שיכונו/.test(nh.errors[0].he), 'reg. 11(א): the disability relief only for the person\'s own housing (review, PR 124)');
		check(/מחצית/.test(reg.purchase_tax.share_ignored_he), 's.49ג(3): an inherited home is ignored up to a half');
		check(/תושב חוזר ותיק/.test(reg.purchase_tax.resident_he), 's.9(ג1ג)(4)(ב): the two-year rule names first-time and veteran returning residents (review, PR 124)');
		const late = { price: 2000000, date: '2024-01-16', track: 'replacement', today: '2026-10-13' };
		const l1 = RQ.compute(reg, late);
		check(!l1.ok && l1.outOfScope && /עבר/.test(l1.errors[0].he) && RQ.compute(reg, Object.assign({ priorSold: true }, late)).ok, 'replacement deadline passed: the single-home result needs "sold in time" (review, PR 124)');
		const dp = YE.compute(reg, { spouse: 'married', children: 1, childLines: [2], deeper: true });
		check(!dp.ok && dp.outOfScope && YUI.renderResult(reg, dp).includes('לא מחלק'), 's.14 beyond one generation: named and stopped (review, PR 124)');
		check(ilToday(new Date('2026-10-13T22:30:00Z')) === '2026-10-14' && ilToday(new Date('2026-10-13T12:00:00Z')) === '2026-10-13', 'today is the civil date in Israel, not UTC (review, PR 124)');
		const nd = RQ.compute(reg, { price: 2000000, date: '2024-01-16', track: 'replacement', contractor: true });
		check(!nd.ok && !nd.outOfScope && nd.errors[0].field === 'delivery', 'contractor replacement without delivery: an input error, no headline (review, PR 124)');
		check(RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'single', delivery: 'xx', aliyah: 'yy' }).ok, 'hidden dates of other tracks do not block the result (review, PR 124)');
		const gp = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'replacement', groupPrev: true });
		check(!gp.ok && gp.outOfScope && /\(ב1\)/.test(gp.errors[0].he), 's.9(ג1ג)(2)(ב1): a delayed purchasing-group previous home is named, not computed (review, PR 124)');
		const gr = YE.compute(reg, { grandparents: 2 });
		check(gr.unresolved && YUI.renderResult(reg, gr).includes('לפחות 2'), 'unresolved groups: the headline says at least N heirs (review, PR 124)');
		const big = HB.compute(reg, { mode: 'assessment', levy: 120000, received: '2026-10-01', kind: 'plan' });
		check(HBUI.renderResult(reg, big).includes('שתי דרכים'), 'above 90,000: the heading counts two routes');
		const v24 = RQ.compute(reg, { price: 2000000, date: '2024-06-01', track: 'single', lawyerPct: 1 });
		const v26 = RQ.compute(reg, { price: 2000000, date: '2026-10-13', track: 'single', lawyerPct: 1 });
		check(v24.vat === 17 && v24.lawyer === 23400 && v26.vat === 18 && v26.lawyer === 23600, 'VAT by the purchase day: 17% before 1.1.2025, 18% after (review, PR 124)');
		const vb = RQ.compute(reg, { price: 2000000, date: '2024-06-01', track: 'single', lawyerPct: 1, brokerPct: 1, lawyerBefore: true, brokerBefore: false });
		check(vb.vatLawyer === 17 && vb.vatBroker === 18 && vb.lawyer === 23400 && vb.broker === 23600, 'VAT per fee at its own tax point (review, PR 124)');
		check(RQ.offRestDays('2026-09-21') === '2026-09-22' && RQ.offRestDays('2026-09-12') === '2026-09-14' && HB.offRestDays('2026-11-21') === '2026-11-22', 'rest days (s.18א): Yom Kippur 21.9.2026 -> 22.9; Rosh Hashana on a Saturday 12.9 -> 14.9; a Saturday appeal deadline -> Sunday (review, PR 124)');
		check(reg.purchase_tax.independence_days.every((d) => RQ.independenceDay(Number(d.slice(0, 4))) === d) && RQ.independenceDay(2024) === '2024-05-14' && HB.independenceDay(2029) === '2029-04-19', 'Independence Day rule reproduces the official 2025-2027 dates; 14.5.2024 (review, PR 124)');
		check(RQ.compute(reg, { price: 2000000, date: '2024-03-15', track: 'single' }).pay === '2024-05-15' && HB.compute(reg, { mode: 'assessment', levy: 84000, received: '2024-03-30', kind: 'plan' }).appealBy === '2024-05-15', 'Independence Day 14.5.2024 moves the deadlines to 15.5');
		check(RQ.compute(reg, { price: 2000000, date: '2027-03-13', track: 'single' }).pay === '2027-05-13' && HB.compute(reg, { mode: 'assessment', levy: 84000, received: '2027-03-28', kind: 'plan' }).appealBy === '2027-05-13', 'Independence Day 12.5.2027 (official calendar) moves a deadline to 13.5 (review, PR 124)');
		check(HB.compute(reg, { mode: 'assessment', levy: 84000, received: '2026-10-07', kind: 'plan' }).appealBy === '2026-11-22', 's.14(א) 45 days ending on Saturday 21.11.2026 -> 22.11 (review, PR 124)');
		check(RQ.offSaturday('2027-06-05') === '2027-06-06' && RQ.offSaturday('2027-06-06') === '2027-06-06', 'Interpretation Law s.10(ג): a Saturday deadline moves to Sunday (review, PR 124)');
		check(RQ.compute(reg, { price: 2000000, date: '2024-06-01', track: 'single', lawyerPct: 1, feesBefore: false }).vat === 18, 'VAT at the fee tax point: fees paid after 1.1.2025 on a 2024 purchase -> 18% (review, PR 124)');
		check(/151\(ג\)\(2\)/.test(reg.betterment.rates.mamad.area_he), 's.19(ב)(9)(ג): the mamad rule names the Amendment 163 additional area');
	}
	check(dl('2025-06-01', { contractor: true, delivery: '2026-07-01' }) === '2027-09-01', 'contractor: each window extended first; 1.6.27 + 3 months beats 1.7.27 from delivery (review, PR 124)');
	check(dl('2025-06-01', { contractor: true, delivery: '2025-07-01' }) === '2027-09-01', 'instruction 2/2016 s.2.1: contractor, the later of 12 months from delivery and 24 from purchase (1.6.27), then +3 months (review, PR 124)');
	{
		const o1 = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2026-01-01', otherHome: true });
		check(!o1.ok && o1.outOfScope && /12א\(א\)/.test(o1.errors[0].he), 'reg. 12א(א): an oleh with another home gets no relief (review, PR 124)');
		const o2 = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2028-06-01' });
		check(!o2.ok && o2.outOfScope && /בבנייה/.test(o2.errors[0].he), 'reg. 12א(א): bought 1-3 years before aliyah, the construction-time exception is named, not computed');
		const o3 = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2030-06-01' });
		check(!o3.ok && o3.outOfScope && !/בבנייה/.test(o3.errors[0].he), 'more than 3 years before aliyah: outside the window');
	}
	check(dl('2023-06-01') === '2024-12-01' && dl('2026-06-15') === '2028-06-15', 'no extension for a window outside 28.2.2026-31.5.2026');
	const r = RQ.compute(reg, { price: 2650000, date: '2026-10-13', track: 'single', lawyerPct: 0.5, brokerPct: 2 });
	check(r.ok && near(r.lawyer, 15635) && near(r.broker, 62540) && near(r.total, 106213.33), 'full cost: lawyer 0.5% + 18% VAT = 15,635; broker 2% + VAT = 62,540; total 106,213.33');
	check(r.declare === '2026-11-12' && r.pay === '2026-12-13', 'declaration in 30 days (s.73(ג)), payment in 60 days (s.90א): 12.12.2026 is a Saturday, so 13.12 (Interpretation Law s.10(ג))');
	const rr = RQ.compute(reg, { price: 2650000, date: '2026-10-13', track: 'replacement' });
	check(rr.ok && rr.replacement.deadline === '2028-10-13' && rr.flags.some((f) => f.code === 'at_stake'), 'replacement: sell the previous home by 13.10.2028; the difference at stake is shown');
	check(!RQ.compute(reg, { price: 0, date: '2026-10-13' }).ok && !RQ.compute(reg, { price: 100, date: '31.2.2026' }).ok, 'zero price and impossible dates are input errors');
	// Review fix (PR 124): the oleh relief needs the aliyah day and a purchase inside its window.
	{
		const noDate = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh' });
		check(!noDate.ok && noDate.errors[0].field === 'aliyah', 'oleh without an aliyah date: an input error, no preferential tax');
		const late = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2018-01-01' });
		check(!late.ok && late.outOfScope && late.errors[0].he.includes('1.1.2025'), 'oleh 8 years after aliyah: outside the window, refused');
		const early = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2028-01-01' });
		check(!early.ok && early.outOfScope, 'oleh more than a year before aliyah: refused');
		const fine = RQ.compute(reg, { price: 3000000, date: '2026-10-13', track: 'oleh', aliyah: '2024-05-01' });
		check(fine.ok && near(fine.tax, 5106.28), 'oleh inside the window: 5,106.28');
	}
	const rs = RQUI.snapshot(reg);
	check(rs.details.includes('jt7-scns') && rs.result.includes('jt7-ladder'), 'purchase-tax snapshot: the ladder and the four scenarios');
}

/* ---------- Wave 3: betterment levy (Planning and Building Law, Third Schedule) ---------- */
{
	const est = (i) => HB.compute(reg, Object.assign({ mode: 'estimate', share: 100, event: 'sale' }, i));
	check(est({ betterment: 800000, share: 50, plan: 'regular' }).levy === 200000, 's.3 + s.11(א): half of a 50% share of 800,000 = 200,000');
	check(est({ betterment: 800000, plan: 'pinui' }).levy === 200000, 's.3א(א): a quarter in pinui-binui');
	{
		const st = est({ betterment: 600000, event: 'permit', ownHome: true, areaBefore: 140, areaAfter: 160, storage: true });
		check(!st.ok && st.outOfScope && /19\(ג1\)/.test(st.errors[0].he), 's.19(ג1): a permit with a storage room is answered out of scope (review, PR 124)');
		const ox = est({ betterment: 800000, otherExempt: true });
		check(!ox.ok && ox.outOfScope && /שכונת שיקום/.test(ox.errors[0].he), 's.19(ב): other exemptions (rehabilitation neighbourhood and more) are screened, not computed (review, PR 124)');
	}
	check(est({ betterment: 800000, plan: 'mamad', event: 'permit' }).levy === 0, 's.19(ב)(9)(א): no levy on building a protected space, with the permit');
	check(!est({ betterment: 800000, plan: 'mamad', event: 'sale' }).ok && est({ betterment: 800000, plan: 'mamad', event: 'sale', mamadPlan: true }).levy === 0, 's.19(ב)(9)(ב): on a sale only a mamad-purpose plan is exempt (review, PR 124)');
	check(!est({ betterment: 600000, event: 'permit', ownHome: true, areaAfter: 160 }).ok && est({ betterment: 600000, event: 'permit', ownHome: true, areaBefore: 0, areaAfter: 160 }).ok, 'own-home deferral: the current area is required, 0 allowed for new building (review, PR 124)');
	check(YUI.compareFor({ spouse: 'partner', partnerMarried: 'survivor', children: 1 }).spouse === 'married', 'a barred partner: the what-if adds a married spouse (review, PR 124)');
	check(YE.compute(reg, { spouse: 'married', children: 2 }).flags.some((f) => f.code === 'vesting'), 'shares vest at the death; an heir who died later passes his share on (review, PR 124)');
	{
		const s4 = est({ betterment: 800000, sale4: true });
		check(!s4.ok && s4.outOfScope && /19\(ג\)\(2\)/.test(s4.errors[0].he), 's.19(ג)(2): a sale after 4 years of living in the home is answered as out of scope, with the section (review, PR 124)');
		check(est({ betterment: 800000, event: 'permit', sale4: true }).ok, 'the 4-year sale box only matters for a sale');
	}
	{
		const m = est({ betterment: 800000, plan: 'mamad', event: 'permit', mamadBeyond: 100000 });
		check(m.levy === 50000 && m.beyond === 100000, 's.19(ב)(9) + s.3: area beyond the protected space pays the regular half (review, PR 124)');
		check(est({ betterment: 800000, plan: 'mamad', event: 'permit' }).flags.some((f) => f.code === 'mamad_area'), 'mamad: the statutory-area limit is always stated');
		check(est({ betterment: 800000, plan: 'mamad', event: 'permit', share: 50, mamadBeyond: 100000 }).levy === 25000, 'mamad beyond: by the owner\'s share');
		check(!est({ betterment: 800000, plan: 'mamad', event: 'permit', mamadBeyond: 900000 }).ok, 'mamad beyond cannot exceed the betterment');
		check(est({ betterment: 800000, plan: 'tama38', event: 'permit', tamaBeyond: 100000 }).flags.some((f) => f.code === 'tama_local'), 's.19(ב2)(1): TAMA 38 beyond 2.5 floors carries the local-reduction warning');
		check(!est({ betterment: 800000, plan: 'tama38', event: 'permit', tamaBeyond: 0 }).flags.some((f) => f.code === 'tama_local'), 'TAMA 38 with nothing beyond: no local warning');
		check(est({ betterment: 800000, plan: 'seismic', event: 'permit' }).flags.some((f) => f.code === 'seismic_local'), 's.19(ב2)(1): seismic plans carry the local-reduction warning');
		check(est({ betterment: 800000, plan: 'pinui', pinuiRate: 'half' }).levy === 400000 && est({ betterment: 800000, plan: 'pinui', pinuiRate: 'none' }).levy === 0 && est({ betterment: 800000, plan: 'pinui' }).levy === 200000, 's.3א(ב): the area rate the local authority set: half, none, or the statutory quarter (review, PR 124)');
		check(est({ betterment: 800000, share: 100, plan: 'seismic', event: 'permit', localQ: 'eighth' }).levy === 100000 && est({ betterment: 800000, share: 100, plan: 'seismic', event: 'permit', localQ: 'none' }).levy === 0 && est({ betterment: 800000, plan: 'tama38', event: 'permit', tamaBeyond: 100000, localQ: 'eighth' }).levy === 12500, 's.19(ב2)(1): the local eighth or none for seismic and TAMA 38 beyond (review, PR 124)');
		const dq = YE.compute(reg, { spouse: 'married', children: 2, disqualified: true });
		check(!dq.ok && dq.outOfScope && /סעיף 5/.test(dq.errors[0].he), 's.5: a disqualified heir stops the split (review, PR 124)');
		const rn = YE.compute(reg, { spouse: 'married', children: 2, renounce: true });
		check(!rn.ok && rn.outOfScope && /סעיף 15/.test(rn.errors[0].he), 'ss.6, 15: a renunciation stops the split with the rule (review, PR 124)');
		const ab = YE.compute(reg, { spouse: 'married', children: 2, abroad: true });
		check(!ab.ok && ab.outOfScope && /137/.test(ab.errors[0].he), 's.137: a domicile abroad stops the Israeli split (review, PR 124)');
		check(!est({ betterment: 800000, plan: 'seismic', event: 'sale' }).ok && !est({ betterment: 800000, plan: 'tama38', event: 'sale' }).ok, 's.19(ב)(10), (10א): TAMA 38 and the seismic quarter only with a building permit (review, PR 124)');
		const sm = est({ betterment: 800000, plan: 'seismic', event: 'permit', seismicPct: 50 });
		check(sm.levy === 300000 && sm.mixed && HBUI.verdictSentence(reg, sm).includes('רבע על 50%'), 's.19(ב)(10א)(ב)-(ג): half qualifying -> a quarter on half, a half on the rest = 37.5% (review, PR 124)');
		check(est({ betterment: 800000, plan: 'seismic', event: 'permit' }).levy === 200000, 's.19(ב)(10א)(א): the plan on the lot itself, a quarter on all');
	}
	check(est({ betterment: 800000, plan: 'tama38', event: 'permit', tamaBeyond: 100000 }).levy === 25000, 's.19(ב)(10)(א): TAMA 38 exempt except a quarter beyond 2.5 floors');
	const home = est({ betterment: 600000, plan: 'regular', event: 'permit', ownHome: true, areaBefore: 100, areaAfter: 160 });
	check(home.levy === 300000 && home.due === 100000 && home.deferred === 200000, 's.19(ג)(1): 100 -> 160 m2, only the 20 m2 above 140 pays now (1/3 of 300,000)');
	check(est({ betterment: 600000, event: 'permit', ownHome: true, areaBefore: 90, areaAfter: 135 }).due === 0, 'a home of 135 m2 after the work: nothing to pay at the permit');
	const a = HB.compute(reg, { mode: 'assessment', levy: 84000, received: '2026-10-01', mine: 52000 });
	check(a.ok && a.appealBy === '2026-11-15' && a.recheck && a.saving === 32000 && a.routes.length === 3, 's.14(א)/(ב)/(ב1): 45 days to 15.11.2026, three routes under 90,000, saving 32,000');
	check(HB.compute(reg, { mode: 'assessment', levy: 95000, received: '2026-10-01' }).routes.length === 2, 'above 90,000: no re-examination route');
	check(HB.compute(reg, { mode: 'assessment', levy: 95000, received: '2026-10-01', kind: 'schedule' }).appealBy === '2027-10-01', 'a valuation schedule: a year from its display to appeal');
	{
		const s = HB.compute(reg, { mode: 'assessment', levy: 84000, received: '2026-10-01', kind: 'schedule' });
		check(s.ok && s.routes.some((x) => x.code === 'recheck'), 's.14(ב1)(1): re-examination is open for a schedule of up to 90,000 too (review, PR 124)');
		const half = est({ betterment: 800000, realized: 50 });
		check(half.levy === 400000 && half.due === 200000 && half.deferred === 200000, 's.7(ב): realising half the rights pays half now (review, PR 124)');
		check(!est({ betterment: 800000, realized: 0 }).ok && !est({ betterment: 800000, realized: 120 }).ok, 'realised share must be above 0 and up to 100');
		const both = est({ betterment: 800000, event: 'permit', ownHome: true, areaBefore: 100, areaAfter: 160, realized: 50 });
		check(both.due === 66666.67 && both.deferred === 333333.33, 'the residence deferral and partial realisation combine');
	}
	check(!est({ betterment: 0 }).ok && !est({ betterment: 100, share: 120 }).ok, 'zero betterment and a share over 100% are input errors');
	const hs = HBUI.snapshot(reg);
	check(hs.result.includes('jt8-strip') && hs.assessment.result.includes('15.11.2026'), 'betterment snapshot: the plan strip, and the assessment example deadline');
}

/* ---------- Wave 4 (HAD-502): what a will costs (Succession Law; registrar fee regs and notary fee regs from 1.1.2026) ---------- */
{
	const w = reg.will_cost;
	check(w.checked_on === '2026-10-14' && w.registrar.order === 597 && w.registrar.will_before_registrar === 280 && w.registrar.deposit === 126 && w.registrar.deposit_free_years === 5 && w.registrar.online_pct === 85, 'will registry: 597 / 280 / 126, free deposit after 5 years, 85% online (fee regs, items 1, 4, 5, 5א; reg. 1(א))');
	check(w.notary.will_first === 293 && w.notary.will_additional === 147 && w.notary.outside_first_hour === 645 && w.notary.outside_half_hour === 197 && w.notary.night_pct === 50 && w.vat.pct === 18, 'will registry: notary 293 / 147, away 645 + 197, +50% at night, VAT 18%');
	const one = TZ.compute(reg, { form: 'notary', people: 1, deposit: true, recent: [false, false], online: true });
	check(one.ok && one.nowTotal === 345.74 && one.laterTotal === 573 && one.total === 918.74, 'notary, one testator: 293 x 1.18 = 345.74 now; first deposit free; later 507 online + 66 publication = 573 (review, PR 126)');
	const two = TZ.compute(reg, { form: 'notary', people: 2, docs: 'one', deposit: false, online: false });
	check(two.ok && two.laterTotal === 2 * (597 + 66), 'mutual wills filed on paper: a request and a publication for each estate, 2 x (597 + 66)');
	check(TZ.compute(reg, { form: 'notary', people: 2, docs: 'one', deposit: false }).nowTotal === 519.2, 'mutual wills in one document: (293 + 147) x 1.18 = 519.20 (item 4(א)-(ב))');
	check(TZ.compute(reg, { form: 'notary', people: 2, docs: 'two', deposit: false }).nowTotal === 691.48, 'mutual wills in two documents: two first signers, 586 x 1.18 = 691.48');
	check(TZ.compute(reg, { form: 'registrar', people: 1, deposit: false }).nowTotal === 280 && TZ.compute(reg, { form: 'registrar', people: 2, deposit: false }).nowTotal === 560, 'before the registrar: 280 per will, no VAT (item 4)');
	check(TZ.compute(reg, { form: 'witnesses', people: 1, deposit: true, recent: [true, false] }).nowTotal === 126, 'witnesses: no fee; a deposit after an earlier one within 5 years: 126 (item 5)');
	check(TZ.compute(reg, { form: 'handwritten', people: 2, deposit: true, recent: [true, true] }).nowTotal === 252, 'two testators who both deposited within 5 years: 2 x 126');
	check(TZ.compute(reg, { form: 'handwritten', people: 2, deposit: true, recent: [false, false], online: false }).laterTotal === 1326, 'two probate requests on paper, each with its publication: 2 x (597 + 66) = 1,326');
	check(TZ.translationFee(w.notary, 250) === 645 && TZ.translationFee(w.notary, 1250) === 2321 && TZ.translationFee(w.notary, 100) === 251 && TZ.translationFee(w.notary, 0) === 0, 'translation item 3(א): 251, then 197 per 100 to 1,000, then 99 per 100');
	check(TZ.compute(reg, { form: 'notary', people: 1, words: 250 }).nowTotal === 726.29, 'a will translated by the notary: (293 + 645 / 2) x 1.18 = 726.29 (item 4(ד))');
	check(TZ.compute(reg, { form: 'notary', people: 1, night: true }).nowTotal === 518.61, 'at night or on a rest day: 293 x 1.5 x 1.18 = 518.61 (item 10)');
	check(TZ.outsideFee(w.notary, 1) === 645 && TZ.outsideFee(w.notary, 1.2) === 842 && TZ.outsideFee(w.notary, 1.5) === 842 && TZ.outsideFee(w.notary, 2) === 1039, 'away from the office: 645 for the first hour or part, 197 for each half hour or part (item 9(א))');
	check(TZ.compute(reg, { form: 'notary', people: 1, outside: true, hours: 1, night: true }).nowTotal === Math.round((293 + 645) * 118) / 100, 'away from the office at night: no 50% on top (item 10 excludes item 9)');
	check(TZ.compute(reg, { form: 'notary', people: 1, foreign: true }).nowTotal === Math.round((293 + 104) * 118) / 100, 'a certificate in a foreign language other than Arabic or English: +104 (item 12)');
	check(TZ.compute(reg, { form: 'witnesses', people: 1, lawyer: 2000 }).nowTotal === 2360 && TZ.compute(reg, { form: 'witnesses', people: 1, lawyer: 2000, lawyerVat: false }).nowTotal === 2000, 'a lawyer quote: plus VAT unless it already includes it');
	check(!TZ.compute(reg, { form: 'notary', lawyer: -5 }).ok && !TZ.compute(reg, { form: 'notary', words: NaN }).ok && !TZ.compute(reg, { form: 'notary', outside: true, hours: '' }).ok, 'negative quote, bad word count and a visit without hours are input errors');
	const forms = TZ.byForm(reg, { people: 1, deposit: true, recent: [false, false], online: true });
	check(forms.handwritten.now === 0 && forms.witnesses.now === 0 && forms.registrar.now === 280 && forms.notary.now === 345.74, 'the same will in four forms: 0, 0, 280, 345.74');
	const ts = TZUI.snapshot(reg);
	check(ts.total === 345.74 && ts.result.includes('jt11-track') && ts.result.includes('חינם') && ts.method.includes('507') && !ts.method.includes('507.45') && ts.method.includes('66') && ts.compare_table.includes('519.20'), 'will snapshot: 345.74, the track with the free deposit, 507 + 66 later, the forms table');
}

/* ---------- Wave 4: road-accident compensation (1975 law, 1976 regulations, 1977 Bar rules, Limitation Law) ---------- */
{
	const ca = reg.car_accident;
	check(ca.checked_on === '2026-10-14' && ca.nonpecuniary.hospital_permille === 2 && ca.nonpecuniary.age_from === 30 && ca.nonpecuniary.death_pct === 25 && ca.nonpecuniary.no_permanent_max_pct === 10, 'car registry: 2 permille a day, 1% a year over 30, 25% on death, up to 10% with no disability');
	check(ca.fees.stages.none.pct === 8 && ca.fees.stages.settle.pct === 11 && ca.fees.stages.judgment.pct === 13 && ca.fees.vat_pct === 18, 'car registry: fee caps 8 / 11 / 13% plus VAT 18% (s.16(א); rules 2-5)');
	check(ca.earnings.nii[0].s1 === 13566 && ca.earnings.nii[0].s2 === 13769 && ca.earnings.ceiling_multiple === 3 && ca.earnings.tax_cap_pct === 25, 'car registry: NII average wage 13,566 / 13,769 from 1.1.2026; ceiling x3; tax cut at most 25%');
	const base = { disability: 20, days: 5, age: 40, accident: '2025-03-10', amount: 150000, stage: 'none', today: '2026-10-14' };
	const r = TE.compute(reg, base);
	check(r.ok && r.np.pct === 19 && r.np.parts.find((p) => p.key === 'disability').pct === 18 && r.np.parts.find((p) => p.key === 'hospital').pct === 1, '20% disability at 40 and 5 hospital days: 18% + 1% = 19% of the maximum (regs 2(א), 3)');
	check(TE.compute(reg, Object.assign({}, base, { age: 30 })).np.pct === 21 && TE.compute(reg, Object.assign({}, base, { age: 31 })).np.pct === 20.8 && TE.compute(reg, Object.assign({}, base, { age: 25 })).np.pct === 21, 'the age cut starts above 30: 1% of the disability part per full year');
	const cap = TE.compute(reg, Object.assign({}, base, { disability: 100, age: 30, days: 10 }));
	check(cap.np.pct === 100 && cap.flags.some((f) => f.code === 'np_cap'), 'never above the maximum (s.4(א)(3)): 100% + 10 days stops at 100%');
	check(TE.compute(reg, Object.assign({}, base, { death: true })).np.pct === 25, 'death: 25% of the maximum to the estate (reg. 4)');
	const other = TE.compute(reg, Object.assign({}, base, { disability: 0, days: 0 }));
	check(other.ok && other.np.kind === 'other' && other.np.pct === null && other.flags.some((f) => f.code === 'np_other'), 'no disability and no hospital days: up to 10%, agreed or awarded (reg. 2(ב)), not computed');
	check(TE.compute(reg, Object.assign({}, base, { max: 200000 })).npAmount === 38000, 'with a maximum the person entered: 19% x 200,000 = 38,000');
	check(r.fees.none.withVat === 14160 && r.fees.none.net === 135840 && r.fees.settle.withVat === 19470 && r.fees.settle.net === 130530 && r.fees.judgment.withVat === 23010 && r.fees.judgment.net === 126990, 'fee caps on 150,000 with VAT: 14,160 / 19,470 / 23,010; net 135,840 / 130,530 / 126,990');
	check(r.lim.deadline === '2032-03-10' && r.lim.added === 0, 'limitation: 7 years from 10.3.2025 -> 10.3.2032');
	const war = TE.limitation(ca, '2020-01-15', null);
	check(war.added === 183 && war.deadline === '2027-07-18' && war.rolled, 'a period running in the war: +183 days (7.10.2023-6.4.2024, s.15א(א)) -> Saturday 17.7.2027 -> 18.7.2027');
	const inside = TE.limitation(ca, '2023-12-01', null);
	check(inside.added === 128 && inside.deadline === '2031-04-09' && inside.rolled, 'an accident inside the war window: the 128 days from it to 6.4.2024 are not counted; 8.4.2031 is 15 Nisan -> 9.4.2031');
	check(TE.limitation(ca, '2016-05-01', null).added === 0 && TE.limitation(ca, '2016-05-01', null).deadline === '2023-05-01', 'a period that ended before 7.10.2023: no extension');
	const minor = TE.limitation(ca, '2020-01-01', '2010-06-04');
	check(minor.minor && minor.start === '2028-06-04' && minor.deadline === '2035-06-04', 'a minor: the 7 years start at 18 (Limitation Law s.10)');
	check(TE.compute(reg, Object.assign({}, base, { age: 12 })).flags.some((f) => f.code === 'minor_birth'), 'a minor without a birth date: a flag asks for it');
	const e = TE.compute(reg, Object.assign({}, base, { income: 12000, months: 4 }));
	check(e.earnings.ceilingAtLeast === 40698 && e.earnings.lowPerMonth === 9000 && e.earnings.highPerMonth === 12000 && e.earnings.low === 36000 && e.earnings.high === 48000 && !e.earnings.capped, 'earnings: the ceiling is at least 3 x 13,566 = 40,698; a month off is between 75% and 100% of 12,000');
	const hi = TE.compute(reg, Object.assign({}, base, { income: 50000 }));
	check(hi.earnings.capped && hi.earnings.lowPerMonth === 30523.5 && hi.flags.some((f) => f.code === 'ceiling'), 'income above the verified ceiling: flagged; the low bound uses 75% of 40,698');
	check(TE.compute(reg, Object.assign({}, base, { excluded: ['licence'] })).outOfScope, 's.7: driving without a licence -> may not be entitled (out of scope)');
	check(!TE.compute(reg, Object.assign({}, base, { accident: '1975-01-01' })).ok && !TE.compute(reg, Object.assign({}, base, { disability: 120 })).ok && !TE.compute(reg, Object.assign({}, base, { age: 40.5 })).ok, 'before 25.9.1976, disability over 100 and a non-whole age are input errors');
	check(TE.compute(reg, Object.assign({}, base, { work: true })).flags.some((f) => f.code === 'nii'), 'on the way to work: the NII deduction flag (s.328א)');
	check(TE.compute(reg, Object.assign({}, base, { death: true })).lim === null, 'death: no limitation date computed (the cause arises on the death, s.6)');
	check(DT.fullYears('2010-06-04', '2028-06-03') === 17 && DT.fullYears('2010-06-04', '2028-06-04') === 18, 'full years: the birthday counts on the day');
	const cs = TEUI.snapshot(reg);
	check(cs.total === 19 && cs.result.includes('jt10-bar') && cs.result.includes('10.3.2032') && cs.method.includes('135,840.00') && cs.compare_table.includes('<bdi>18%</bdi>'), 'car snapshot: 19%, the formula bar, the limitation date, the fee and the share table');
}

/* ---------- Wave 4: what a divorce costs (Dayanim fee regs, Family Court fee regs, Disputes Settlement Law, Property Relations Law) ---------- */
{
	const dc = reg.divorce_cost;
	check(dc.checked_on === '2026-10-14' && dc.rabbinical.divorce === 457 && dc.rabbinical.property === 596 && dc.rabbinical.agreement === 536 && dc.rabbinical.certificate === 326 && dc.rabbinical.request === 119 && dc.rabbinical.custody === 417, 'divorce registry: rabbinical 457 / 596 / 536 / 326 / 119 / 417 (Dayanim fee regs, current to 22.1.2026)');
	check(dc.family.property === 601 && dc.family.support === 283 && dc.family.custody === 421 && dc.family.agreement === 541 && dc.family.request === 120 && dc.family.transcript === 86, 'divorce registry: family court 601 / 283 / 421 / 541 / 120, transcript 86 (current to 1.7.2026)');
	check(dc.disputes.meetings_max === 4 && dc.disputes.meetings_days === 45 && dc.disputes.extend_days === 15 && dc.disputes.stay_days === 60 && dc.disputes.stay_days_extended === 75 && dc.disputes.claim_days === 15, 'disputes law: 4 meetings in 45 days (+15), 60 or 75 days stay, claims within 15 days');
	check(dc.bar.get_consent === 1287 && dc.bar.get_contested === 3173 && dc.bar.agreement_min === 2480 && dc.bar.custody_opposed === 3008, 'Bar recommended minimum (non-binding): 1,287 / 3,173 / 2,480 / 3,008');
	const agree = GE.compute(reg, { route: 'agree', forum: 'rabbinical', children: true, property: true });
	check(agree.ok && agree.total === 1188 && !agree.lines.some((l) => l.key === 'request') && agree.clock === null, 'by consent in the rabbinical court: 536 + 2 x 326 = 1,188; no dispute-settlement request (s.2 definitions)');
	check(agree.bar.total === 3767 && agree.bar.withVat === 4445.06, 'by consent, with a lawyer: at least 1,287 (get, item 8(5)) + 2,480 (the agreement, item 8(9)) = 3,767 before VAT, 4,445.06 with VAT 18%');
	check(GE.compute(reg, { route: 'agree' }).bar.total === 3767, 'by consent without children: at least 1,287 + 2,480 = 3,767 before VAT (items 8(5), 8(9))');
	const agreeFam = GE.compute(reg, { route: 'agree', forum: 'family' });
	check(agreeFam.total === 541 + 86 + 326 + 652 && agreeFam.byWho.family === 627 && agreeFam.byWho.rabbinical === 978, 'agreement approved in the family court: 541 + 86 there; get request 326 + certificates 652 in the rabbinical court');
	check(GE.compute(reg, { route: 'agree', forum: 'family', abroad: true }).lines.find((l) => l.key === 'get_request').amount === 457, 'one spouse abroad: the get request is 457 (item 4(3)(ב))');
	check(GE.compute(reg, { route: 'mediate', forum: 'rabbinical' }).total === 119 + 536 + 652, 'mediation then agreement: 119 + 536 + 652');
	const c0 = GE.compute(reg, { route: 'court', forum: 'rabbinical' });
	check(c0.total === 1346 && c0.lines.some((l) => l.key === 'divorce_tr' && l.amount === 118), 'contested, no children, no property: 119 + 457 + 118 + 652 = 1,346');
	const c1 = GE.compute(reg, { route: 'court', forum: 'rabbinical', children: true, property: true });
	check(c1.total === 2535 && c1.lines.find((l) => l.key === 'support').amount === 0 && c1.flags.some((f) => f.code === 'support'), 'contested in the rabbinical court with children and property: 2,535; the maintenance filer is exempt (reg. 14א)');
	const c2 = GE.compute(reg, { route: 'court', forum: 'family', children: true, property: true });
	check(c2.total === 2910 && c2.byWho.family === 120 + 601 + 86 + 421 + 86 + 283 + 86, 'contested with property and children in the family court: 2,910, of which 1,683 there');
	check(c2.bar.total === 3173 + 3008 && c2.bar.lines.some((l) => l.amount === null), 'contested with a lawyer: 3,173 + 3,008, and the property claim by value (no number)');
	const clk = GE.compute(reg, { route: 'court', start: '2026-11-01' }).clock;
	check(clk.meetingsBy === '2026-12-16' && clk.stayEnds === '2026-12-31' && clk.claimsBy === '2027-01-15', 'the clock from 1.11.2026: meetings by 16.12.2026, stay to 31.12.2026, claims by 15.1.2027');
	const ext = GE.compute(reg, { route: 'mediate', start: '2026-11-01', extended: true }).clock;
	check(ext.meetingsBy === '2026-12-31' && ext.stayEnds === '2027-01-15' && ext.claimsBy === '2027-01-31' && ext.rolled.claims, 'extended meetings: 60 days, a stay of 75; the 15 days would end on Saturday 30.1.2027, so they run to Sunday 31.1 (Interpretation Law s.10(ג); review, PR 126)');
	const bal = GE.compute(reg, { route: 'agree', balance: { a: { assets: 1200000, excluded: 300000, debts: 100000 }, b: { assets: 500000, excluded: 0, debts: 0 } } });
	check(bal.balance.a.net === 800000 && bal.balance.b.net === 500000 && bal.balance.payer === 'a' && bal.balance.pay === 150000, 'balance of resources: (800,000 - 500,000) / 2 = 150,000 from A to B (ss.5, 6(א)-(ב))');
	check(GE.compute(reg, { route: 'agree', balance: { a: { assets: 100, excluded: 0 }, b: { assets: 100 } } }).balance.payer === null, 'equal nets: no payment');
	check(!GE.compute(reg, { route: 'agree', balance: { a: { assets: 100, excluded: 200 }, b: {} } }).ok, 'excluded above all assets is an input error');
	check(GE.compute(reg, { route: 'agree', before1974: true, balance: { a: { assets: 100 }, b: {} } }).flags.some((f) => f.code === 'pre1974'), 'married before 1.1.1974: the balance regime does not apply (s.14)');
	check(GE.compute(reg, { route: 'agree', notJewish: true }).outOfScope, 'a couple that is not Jewish: out of scope (another religious court, other fees)');
	const routes = GE.byRoute(reg, { forum: 'rabbinical', children: true, property: true });
	check(routes.agree.total === 1188 && routes.mediate.total === 1307 && routes.court.total === 2535, 'one family, three routes: 1,188 / 1,307 / 2,535');
	const gs = GEUI.snapshot(reg);
	check(gs.total === 1188 && gs.result.includes('jt9-lanes') && gs.result.includes('3,767') && gs.compare_table.includes('2,910') && gs.method.includes('536'), 'divorce snapshot: 1,188, the two lanes, the lawyer minimum, the routes table');
}

/* ---------- Wave 4: the Bar's recommended minimum as a reference in the will tool (non-binding, before VAT) ---------- */
{
	const b = reg.will_cost.bar;
	check(b.will === 2161 && b.mutual === 3159 && b.deposit_other === 1068 && b.probate_pct === 1.5 && b.probate_min === 4281 && b.objection_add_pct === 25, 'will registry, Bar tariff: 2,161 / 3,159 / 1,068; probate 1.5% of the estate, at least 4,281 (items 11(3), 4.א(4))');
	const one = TZ.compute(reg, { form: 'notary', people: 1, barRef: true });
	check(one.bar.make === 2161 && one.bar.probateEach === 4281 && one.bar.total === 6442 && one.bar.withVat === 7601.56 && one.bar.shown, 'one testator, no estate value: drafting 2,161 + probate 4,281 = 6,442 before VAT');
	check(TZ.compute(reg, { form: 'notary', people: 1, barRef: true, estate: 1000000 }).bar.probateEach === 15000, 'an estate of 1,000,000: 1.5% = 15,000 for the probate request');
	check(TZ.compute(reg, { form: 'notary', people: 1, barRef: true, estate: 100000 }).bar.probateEach === 4281, 'a small estate: the minimum, 4,281');
	check(TZ.compute(reg, { form: 'notary', people: 2, barRef: true }).bar.total === 3159 + 2 * 4281, 'mutual wills: 3,159 for both, and a probate request for each estate');
	check(!TZ.compute(reg, { form: 'notary', barRef: true, estate: -1 }).ok, 'a negative estate value is an input error when the Bar reference is on');
	check(TZUI.snapshot(reg).details.includes('2,161') && TZUI.snapshot(reg).result.includes('4,281'), 'will snapshot: the Bar reference in the result and the details');
}

/* ---------- Wave 4: the divorce clock skips the holiday days of s.6א, and the law does not apply abroad (s.4א(1)) ---------- */
{
	const dc = reg.divorce_cost;
	check(DT.isFamilyPause('2026-09-12') && DT.isFamilyPause('2026-09-13') && DT.isFamilyPause('2026-09-21') && DT.isFamilyPause('2026-09-25') && DT.isFamilyPause('2026-10-03') && !DT.isFamilyPause('2026-10-04') && !DT.isFamilyPause('2026-09-24'), 's.6א(א)(1): 1-2 Tishri, 10 Tishri and 14-22 Tishri 5787 (12.9, 13.9, 21.9, 25.9-3.10.2026) are not counted');
	check(DT.isFamilyPause('2027-04-21') && DT.isFamilyPause('2027-04-28') && !DT.isFamilyPause('2027-04-29'), 's.6א(א)(1): 14-21 Nisan 5787 (21.4-28.4.2027)');
	const autumn = GE.clock(dc, '2026-09-01', false);
	check(autumn.meetingsBy === '2026-10-28' && autumn.stayEnds === '2026-11-12' && autumn.claimsBy === '2026-11-27' && autumn.paused, 'a request on 1.9.2026: 12 holiday days are not counted -> meetings by 28.10, stay to 12.11, claims by 27.11.2026');
	const spring = GE.clock(dc, '2027-03-20', false);
	check(spring.meetingsBy === '2027-05-13' && spring.rolled.meetings && spring.stayEnds === '2027-05-27', 'a request on 20.3.2027: the 8 Pesach days are not counted; the meetings period would end on Independence Day 12.5.2027, so it runs to 13.5 (s.10(ג))');
	const lastDay = GE.clock(dc, '2026-07-15', false);
	check(lastDay.stayEnds === '2026-09-15' && lastDay.claimsBy === '2026-10-11', 'request on 15.7.2026: the stay ends 15.9 (Rosh Hashana not counted); 15 days would end on 30.9 (19 Tishri), so the holidays are not counted (s.6א(ג)) and the window runs to Saturday 10.10, moved to Sunday 11.10.2026 (s.10(ג))');
	check(GE.compute(reg, { route: 'court', start: '2026-09-01' }).flags.some((f) => f.code === 'pause'), 'a clock that crosses the holidays carries the s.6א flag');
	const abroad = GE.compute(reg, { route: 'court', forum: 'rabbinical', abroad: true });
	check(abroad.ok && abroad.clock === null && !abroad.lines.some((l) => l.key === 'request') && abroad.flags.some((f) => f.code === 'abroad') && abroad.lines.some((l) => l.key === 'get_request' && l.amount === 457), 'a spouse domiciled abroad: no dispute-settlement request or clock (s.4א(1)); the get request 457 (item 4(3)(ב))');
	check(GEUI.renderResult(reg, abroad).includes('סעיף 4א(1)'), 'the lanes say why there is no request when a spouse lives abroad');
}

/* ---------- Review fixes (PR 126, Codex pass 1) ---------- */
{
	const adult = TE.compute(reg, { disability: 10, days: 0, age: 20, accident: '2025-01-01', birth: '2010-01-01' });
	check(adult.ok && !adult.lim.minor && adult.lim.deadline === '2032-01-01', 'an adult on the accident day: a birth date left over is ignored, 7 years from the accident (review, PR 126)');
	const minor = TE.compute(reg, { disability: 10, days: 0, age: 15, accident: '2025-01-01', birth: '2010-01-01' });
	check(minor.ok && minor.lim.minor && minor.lim.deadline === '2035-01-01', 'a minor: the birth date starts the 7 years at 18');
	check(!TE.compute(reg, { disability: 10, days: 0, age: 15, accident: '2025-01-01', birth: '2026-01-01' }).ok, 'a birth date after the accident is an input error');
	const pre = GE.compute(reg, { route: 'agree', before1974: true, balance: { a: { assets: 900000 }, b: { assets: 100000 } } });
	check(pre.ok && pre.balance === null && pre.flags.some((f) => f.code === 'pre1974') && !GEUI.renderResult(reg, pre).includes('משלם ל'), 'married before 1.1.1974: no balance figure at all, only the s.14 note (review, PR 126)');
	check(!GE.compute(reg, { route: 'court', start: '2026-02-31' }).ok && GE.compute(reg, { route: 'court', start: '2026-02-31' }).errors[0].field === 'start', 'an impossible filing day (31.2.2026) is an input error, not 3.3.2026 (review, PR 126)');
	check(GE.compute(reg, { route: 'court', start: '1.11.2026' }).clock.meetingsBy === '2026-12-16', 'the filing day may be typed as 1.11.2026');
	check(GEUI.renderResult(reg, GE.compute(reg, { route: 'agree' })).includes('class="jt9-lanes" role="group"'), 'the lanes are a labelled group (axe: aria-prohibited-attr)');
}

/* ---------- Review fixes (PR 126, Codex pass 2) ---------- */
{
	check(GE.compute(reg, { route: 'agree', start: '2026-02-31' }).ok, 'the agreement route ignores a bad filing day left in the hidden field (review, PR 126)');
	check(GE.compute(reg, { route: 'court', abroad: true, start: '2026-02-31' }).ok, 'no clock abroad, so a hidden filing day does not block either');
	const bad = TE.compute(reg, { disability: 10, days: 0, age: 15, accident: '2025-01-01', birth: '2000-01-01' });
	check(!bad.ok && bad.errors.some((e) => e.field === 'birth'), 'a birth date that contradicts the age on the accident day is an error (review, PR 126)');
	check(TE.compute(reg, { disability: 10, days: 0, age: 14, accident: '2025-01-01', birth: '2010-06-04' }).ok, 'a matching birth date passes (14 on 1.1.2025)');
}

/* ---------- Review fixes (PR 126, Codex pass 3) ---------- */
{
	const dead = TE.compute(reg, { death: true, accident: '2025-03-10', age: 15, birth: '2000-99-99', income: 'x', months: -4, max: 200000 });
	check(dead.ok, 'death mode ignores a bad birth date, income and month count left in the hidden living fields (review, PR 126)');
	check(dead.ok && dead.earnings === null && dead.lim === null, 'death mode shows no earnings of the injured person and no limitation date');
	check(dead.ok && dead.npAmount === 50000, 'death mode still uses the maximum: 25% of 200,000 is 50,000');
	const f = TEUI.renderForm(reg, Object.assign({}, TEUI.EXAMPLE, { death: true, max: 200000 }));
	const maxAt = f.indexOf('-max"');
	const lastAlive = f.lastIndexOf('<details class="jtool-more" data-if-alive', maxAt);
	const maxBlock = f.lastIndexOf('<details', maxAt);
	check(maxAt > 0 && maxBlock !== lastAlive, 'the maximum field stays visible in death mode (it feeds the death formula)');
}

/* ---------- Review fixes (PR 126, Codex pass 4) ---------- */
{
	const kid = TE.compute(reg, { disability: 10, days: 0, age: 12, accident: '2025-01-01' });
	check(kid.ok && kid.lim === null, 'a minor without a birth date gets no limitation date (review, PR 126)');
	check(kid.ok && kid.flags.some((f) => f.code === 'minor_birth'), 'and the flag asks for the birth date');
	const kidB = TE.compute(reg, { disability: 10, days: 0, age: 12, accident: '2025-01-01', birth: '2012-06-04' });
	check(kidB.ok && kidB.lim && kidB.lim.minor, 'with the birth date the minor deadline is computed from 18');
	const off = TZ.compute(reg, Object.assign({}, TZUI.EXAMPLE, { barRef: false, estate: -5 }));
	check(off.ok && off.bar.estate === null, 'with the Bar reference off, a bad estate value in the hidden field is ignored (review, PR 126)');
	const on = TZ.compute(reg, Object.assign({}, TZUI.EXAMPLE, { barRef: true, estate: -5 }));
	check(!on.ok && on.errors[0].field === 'estate', 'with the Bar reference on, a bad estate value is still an error');
}

/* ---------- Review fixes (PR 126, Codex pass 5) ---------- */
{
	const lone = GE.compute(reg, { route: 'court', forum: 'family', start: '2026-11-01', balance: { a: { assets: NaN, excluded: '', debts: '' }, b: { assets: '', excluded: '', debts: '' } } });
	check(!lone.ok && lone.errors.some((e) => e.field === 'a-assets'), 'a lone malformed balance amount is an error on its field (review, PR 126)');
	const zero = GE.compute(reg, { route: 'court', forum: 'family', start: '2026-11-01', balance: { a: { assets: 0, excluded: '', debts: '' }, b: { assets: '', excluded: '', debts: '' } } });
	check(zero.ok && zero.balance && zero.balance.pay === 0, 'an entered zero is a balance of zero, not a skipped balance');
	const none = GE.compute(reg, { route: 'court', forum: 'family', start: '2026-11-01', balance: { a: { assets: '', excluded: '', debts: '' }, b: { assets: '', excluded: '', debts: '' } } });
	check(none.ok && none.balance === null, 'nothing entered: no balance');
}

/* ---------- Review fixes (PR 126, Codex pass 7) ---------- */
{
	const kid = TE.compute(reg, { disability: 10, days: 0, age: 12, accident: '2025-01-01' });
	const rows = TEUI.deadlines(reg, kid);
	check(rows[0].date === '' && rows[0].what.includes('מגיל 18') && !rows[0].what.includes('העיזבון'), 'a minor without a birth date gets the minor no-date row, not the death row (review, PR 126)');
	const dead = TE.compute(reg, { death: true, accident: '2025-01-01' });
	check(TEUI.deadlines(reg, dead)[0].what.includes('העיזבון'), 'a death claim keeps the estate and dependants row');
}

/* ---------- Review fixes (PR 126, Codex pass 8) ---------- */
{
	const jan = GE.clock(reg.divorce_cost, '2026-01-05', false);
	check(jan.claimsBy === '2026-03-22' && jan.rolled.claims, 'a request on 5.1.2026: the 15 days would end on Saturday 21.3.2026, so they run to Sunday 22.3 (Interpretation Law s.10(ג); review, PR 126)');
	for (const s of ['2026-01-05', '2026-11-01', '2027-03-20', '2026-07-15', '2026-09-01']) {
		for (const ext of [false, true]) {
			const c = GE.clock(reg.divorce_cost, s, ext);
			check(![c.meetingsBy, c.stayEnds, c.claimsBy].some((x) => DT.isRestDay(x)), `no clock end on a rest day (${s}${ext ? ', extended' : ''})`);
		}
	}
	const rows = GEUI.deadlines(reg, { clock: GE.clock(reg.divorce_cost, '2026-01-05', false) });
	check(rows[2].what.includes('עבר ליום שאחריו') && rows[2].what.includes('סעיף 10(ג)'), 'the deadlines table says when an end moved off a rest day');
}

/* ---------- Review fixes (PR 126, Codex pass 10) ---------- */
{
	const hiddenClock = (input) => /data-if-clock hidden/.test(GEUI.renderForm(reg, Object.assign({}, GEUI.EXAMPLE, input)));
	check(hiddenClock({ route: 'court', abroad: true }), 'the clock inputs are hidden when a spouse lives abroad (s.4א(1); review, PR 126)');
	check(hiddenClock({ route: 'agree' }) && !hiddenClock({ route: 'court', abroad: false }), 'hidden on the agreement route, shown for a contested route in Israel');
}

/* ---------- Wave 5 (HAD-504): the residential lease (Rental and Borrowing Law ss.25א-25טו, current to 30.9.2026) ---------- */
{
	const rc = reg.rent_contract;
	check(rc.checked_on === '2026-10-14' && rc.law_current_to === '2026-09-30' && rc.deposit.months === 3 && rc.deposit.term_share.join('/') === '1/3' && rc.deposit.return_days === 60, 'lease registry: the cap of s.25י(ב) (3 months, a third of the term), return in 60 days, read 14.10.2026 on the text current to 30.9.2026');
	check(rc.repairs.days === 30 && rc.repairs.urgent_days === 3 && rc.option.landlord_days === 90 && rc.option.tenant_days === 60 && rc.exit.landlord_days === 90 && rc.exit.tenant_days === 60 && rc.scope.rent_cap === 20000, 'lease registry: repairs 30/3 (s.25ח(ב)), options 90/60 (s.25יב), cancellation 90/60 (s.25יג), scope 20,000 (s.25טו(א)(4))');
	check(rc.amend_2026.gazette_he.includes('3510') && rc.amend_2026.url.includes('25_lsr_12224370'), 'lease registry: the March 2026 amendment of s.25י (Sefer HaChukim 3510) is recorded with its official PDF');
	const c1 = RE.depositCap(rc, 6000, 12);
	check(c1.byTerm === 24000 && c1.byMonths === 18000 && c1.cap === 18000 && c1.binding === 'months', 'cap: 6,000 a month for 12 months: the lower of 24,000 (a third of the term) and 18,000 (3 months) = 18,000');
	const c2 = RE.depositCap(rc, 6000, 6);
	check(c2.cap === 12000 && c2.binding === 'term', 'cap: a 6-month lease: a third of the term (12,000) is the lower limit');
	check(RE.depositCap(rc, 4500, 9).cap === 13500, 'cap: 4,500 for 9 months: both limits are 13,500');
	const over = RE.compute(reg, { rent: 6000, months: 12, start: '2026-11-01', cash: 30000 });
	const overText = RE.contractText(rc, over);
	check(over.ok && over.flags.some((f) => f.code === 'deposit_over' && f.level === 'bad') && over.sec.cash === 18000 && overText.includes('18,000 ₪') && !overText.includes('30,000'), 'a 30,000 cash deposit on 6,000 a month: flagged, and the lease carries 18,000, never 30,000');
	const mix = RE.compute(reg, { rent: 6000, months: 12, cash: 10000, bank: 10000 });
	check(mix.sec.cash + mix.sec.bank === 18000 && mix.sec.cash === 9000, 'cash and a bank guarantee over the cap are scaled together to the cap');
	check(RE.compute(reg, { rent: 6000, months: 12, other: 20000 }).flags.some((f) => f.code === 'deposit_over'), 'a guarantee from an insurer or a credit licensee counts in the cap (2026 amendment)');
	const notes = RE.compute(reg, { rent: 6000, months: 12, bank: 18000, note: 40000, guarantors: 2 });
	check(!notes.flags.some((f) => f.code === 'deposit_over') && notes.flags.some((f) => f.code === 'not_counted') && RE.contractText(rc, notes).includes('נספח ב'), 'a promissory note and guarantors cost the tenant nothing: outside the cap, and the guarantee appendix is added');
	const bad = RE.compute(reg, { rent: 6000, months: 12, bank: 18000, forbidden: { insurance: true, broker: true, systems: true }, asIs: true, exit: 'landlord', returnDays: 90, repairDays: 45, urgentDays: 7 });
	const badText = RE.contractText(rc, bad);
	check(bad.bad === 8 && ['pay_insurance', 'pay_broker', 'pay_systems', 'as_is', 'exit_landlord', 'return_late', 'repair_late'].every((k) => bad.flags.some((f) => f.code === k)), 'the check flags building insurance, the landlord\'s broker, fixed systems, "as is", a landlord-only exit and late deadlines (ss.25ט(ב), 25ו, 25יג, 25י(ה), 25ח(ב))');
	check(bad.flags.some((f) => f.code === 'urgent_late') && !RE.compute(reg, { rent: 6000, months: 12, returnDays: 90 }).flags.some((f) => f.code === 'return_late') && !badText.includes('כמות שהיא') && badText.includes('לא יאוחר מ-30 ימים') && badText.includes('לא יאוחר מ-3 ימים') && badText.includes('בתוך 60 ימים') && badText.includes('אין לצדדים זכות לבטל'), 'the lease never carries a void clause: 30 and 3 days for repairs, 60 days for the deposit, no landlord-only exit, no "as is"');
	check(badText.includes('השוכר לא יישא בביטוח המבנה') && !/ישלם השוכר[^\n]*ביטוח המבנה/.test(badText), 'the lease says the tenant does not pay the building insurance, even when the landlord asked');
	const exits = RE.compute(reg, { rent: 6000, months: 12, exit: 'both', exitLandlordDays: 30, exitTenantDays: 90 });
	check(exits.flags.some((f) => f.code === 'exit_landlord_days') && exits.flags.some((f) => f.code === 'exit_tenant_days') && RE.contractText(rc, exits).includes('המשכיר בהודעה בכתב 90 ימים') && RE.contractText(rc, exits).includes('והשוכר בהודעה בכתב 60 ימים'), 'mutual cancellation: the landlord at least 90 days, the tenant 60 at most (s.25יג(ב), s.25יד)');
	const opts = RE.compute(reg, { rent: 6000, months: 12, option: 'both', optionMonths: 12, optionPct: 5, optTenantDays: 90, optLandlordDays: 30 });
	const optText = RE.contractText(rc, opts);
	check(opts.optionRent === 6300 && opts.flags.some((f) => f.code === 'opt_tenant_days') && opts.flags.some((f) => f.code === 'opt_landlord_days') && optText.includes('6,300 ₪') && optText.includes('לא יאוחר מ-60 ימים לפני') && optText.includes('לא יאוחר מ-90 ימים לפני'), 'options: rent set in advance (6,300), the tenant notifies up to 60 days before, the landlord at least 90 (s.25יב(ב)-(ג))');
	check(RE.compute(reg, { rent: 6000, months: 3 }).flags.some((f) => f.code === 'short') && !RE.compute(reg, { rent: 6000, months: 3, option: 'tenant', optionMonths: 3 }).flags.some((f) => f.code === 'short'), 'a lease of up to 3 months without an option is outside the part (s.25טו(א)(2)); with an option it is not');
	check(RE.compute(reg, { rent: 25000, months: 12 }).flags.some((f) => f.code === 'rent_cap' && f.level === 'warn') && RE.compute(reg, { rent: 6000, months: 12, relative: true }).flags.some((f) => f.code === 'relative'), 'rent above 20,000 is flagged for a check (the indexed amount is not published); a relative tenant is noted (s.25טו(ב))');
	const ex = RE.compute(reg, { rent: 6000, months: 12, start: '2026-11-01' });
	check(ex.end === '2027-10-31' && ex.clauses.length === 15 && ex.clauses.every((c) => c.cites.length > 0), 'a 12-month lease from 1.11.2026 ends on 31.10.2027; 15 clauses, every one with its sections');
	check(RE.contractText(rc, ex, true).includes('[סעיף 25ב; סעיף 25ג]') && !RE.contractText(rc, ex).includes('[סעיף'), 'the copy with sources carries them; the clean copy does not');
	check(ex.schedule.map((s) => s.state).join(',') === 'hand,hand,list,filled,filled,filled,declared', 'the Second Schedule check: address and parties to fill by hand, the furniture list, the defects declaration');
	check(Object.values(rc.cites).every((t) => t.length > 20) && ['25ב', '25ח(ב)', '25י(ב)', '25יג', 'guarantee'].every((k) => rc.cites[k]), 'every section chip has the text of its section');
	const share = REUI.shareState(Object.assign({}, REUI.EXAMPLE, { landlord: 'משה כהן', tenant: 'דנה לוי', address: 'הרצל 5', city: 'חיפה', defects: 'רטיבות', furniture: 'מקרר' }));
	check(!/משה|דנה|הרצל|חיפה|רטיבות|מקרר/.test(share) && share.includes('r6000'), 'privacy: the share link carries the terms only, never names, the address, defects or furniture');
	const rs = REUI.snapshot(reg);
	check(rs.total === 18000 && rs.result.includes('jt12-meter') && rs.result.includes('jtool-state--ok') && rs.details.includes('jt12-cite') && rs.details.includes('6,180') && rs.compare_table.includes('13,500') && rs.method.includes('24,000'), 'lease snapshot: the 18,000 cap and meter, a clean check, section chips, the option rent 6,180, the cap table');
}

/* ---------- Wave 5: severance pay, section 14, the advance notice, the tax ceiling and the deadlines ---------- */
{
	const sv = reg.severance;
	check(sv.checked_on === '2026-10-14' && sv.tax.ceiling === 13750 && sv.tax.year === 2026 && sv.approval.partial_pct === 72 && sv.approval.full_pct === 100 && sv.late.grace_days === 15 && sv.late.monthly_pct === 20 && sv.notice.cert_days === 14, 'severance registry: the 2026 tax ceiling 13,750 per year, s.14 at 72% / 100%, late after 15 days, +20% a month, the certificate in 14 days');
	const span = PE.serviceSpan('2018-03-01', '2026-09-30');
	check(span.months === 103 && span.days === 0 && near(span.years, 103 / 12, 1e-9), '1.3.2018 to 30.9.2026 is 8 years and 7 months (103 months)');
	const ex = PE.compute(reg, PEUI.EXAMPLE);
	check(ex.ok && ex.severance === 103000 && ex.coveredSev === 103000 && ex.fundReplaces === 74160 && ex.employer === 28840 && ex.notice.month && ex.exempt === 103000 && ex.taxable === null && ex.taxNote === 'fund', 'example: 12,000 x 8 7/12 = 103,000; s.14 on 72%: the fund stands for 72%, the employer adds 28,840; a month notice; exempt up to 103,000 (the taxable part depends on the fund)');
	check(PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14: 'none' })).employer === 103000 && PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14: 'full' })).employer === 0, 'no s.14: the employer pays 103,000; s.14 at 100%: the fund replaces it all');
	const from20 = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14From: '2020-01-01' }));
	check(near(from20.coveredYears, 6.75, 1e-9) && from20.fundReplaces === 58320 && from20.employer === 44680, 's.14 from 1.1.2020 only: 6.75 years x 12,000 x 72% = 58,320 replaced, 44,680 from the employer');
	const short = PE.compute(reg, { salary: 10000, start: '2026-01-01', end: '2026-09-30' });
	check(!short.entitled && short.severance === 0 && short.flags.some((f) => f.code === 'under_year') && short.notice.days === 13.5, 'under a year: no severance (s.1(א)); after 9 months a monthly employee gets 6 + 2.5 x 3 = 13.5 days of notice (s.3(2))');
	check(PE.compute(reg, { salary: 10000, start: '2025-11-01', end: '2026-09-30' }).flags.some((f) => f.code === 'near_year'), 'a dismissal after 11 months: the s.3 presumption is flagged');
	const resign = PE.compute(reg, { salary: 10000, start: '2018-01-01', end: '2026-09-30', reason: 'resign', s14: 'partial' });
	check(!resign.entitled && resign.employer === 0 && resign.flags.some((f) => f.code === 'resign'), 'an ordinary resignation: nothing from the employer; the s.14 fund stays the worker\'s');
	const worse = PE.compute(reg, { salary: 10000, start: '2018-01-01', end: '2026-09-30', reason: 'worse', groundOk: true });
	check(worse.entitled && worse.severance > 0 && worse.flags.some((f) => f.code === 'resign_as_fired' && f.section === 'סעיף 11(א)'), 'a resignation for worse conditions, confirmed, counts as a dismissal (s.11(א))');
	const hourly = PE.compute(reg, { payType: 'hourly', hourly: 45, hours: 160, start: '2020-01-01', end: '2025-12-31' });
	check(hourly.base === 7200 && hourly.severance === 43200 && !hourly.floored, 'a wage-paid employee: 45 x 160 = 7,200 a month, 6 years = 43,200 (1983 regulations)');
	const low = PE.compute(reg, { payType: 'hourly', hourly: 30, hours: 160, start: '2020-01-01', end: '2026-09-30' });
	check(low.floored && low.base === 5664 && low.flags.some((f) => f.code === 'min_wage'), 'below the minimum wage: computed on 35.40 x 160 = 5,664 (s.13ב)');
	check(PE.compute(reg, { salary: 5000, start: '2020-01-01', end: '2026-09-30' }).base === 6443.85 && !PE.compute(reg, { salary: 5000, jobPct: 50, start: '2020-01-01', end: '2026-09-30' }).floored, 'a monthly salary below the minimum is floored to 6,443.85; at a 50% job it is not');
	const nd = (pt, m) => PE.noticeDays(sv, pt, m);
	check(nd('monthly', 1).days === 1 && nd('monthly', 6).days === 6 && nd('monthly', 7).days === 8.5 && nd('monthly', 11).days === 18.5 && nd('monthly', 12).month, 'notice for a monthly salary: 1 day a month, then 6 + 2.5 a month, a month after a year (s.3)');
	check(nd('hourly', 11).days === 11 && nd('hourly', 12).days === 14 && nd('hourly', 14).days === 15 && nd('hourly', 24).days === 21 && nd('hourly', 26).days === 22 && nd('hourly', 36).month, 'notice for a wage: 1 a month in year 1, 14 + 1 per 2 months in year 2, 21 + 1 per 2 months in year 3, then a month (s.4)');
	const late = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { noticeDate: '2026-09-15' }));
	check(late.noticeEnd === '2026-10-15' && late.short === 15 && late.flags.some((f) => f.code === 'short_notice'), 'notice given 15.9.2026 ends 15.10.2026 (Interpretation Law s.10(ב)); a last day of 30.9 leaves 15 days to compensate (s.7(א))');
	check(PE.monthLater('2026-01-31') === '2026-02-28' && PE.monthLater('2026-04-30') === '2026-05-30', 'a month after 31.1 is 28.2, after 30.4 is 30.5 (s.10(ב))');
	const rich = PE.compute(reg, { salary: 20000, start: '2016-10-01', end: '2026-09-30' });
	check(rich.exempt === 137500 && rich.taxable === 62500 && !rich.flags.some((f) => f.code === 'commissioner'), 'tax: 20,000 x 10 years: exempt up to 13,750 a year = 137,500, taxable 62,500 (s.9(7א)(א))');
	const mid = PE.compute(reg, { salary: 10000, start: '2016-10-01', end: '2026-09-30' });
	check(mid.exempt === 100000 && mid.taxable === 0, 'tax: 10,000 x 10 years: one month per year, all exempt');
	const dls = Object.fromEntries(ex.deadlines.map((d) => [d.key, d.date]));
	check(dls.due === '2026-09-30' && dls.grace === '2026-10-15' && dls.twenty === '2026-10-30' && dls.cert === '2026-10-14' && dls.limit === '2033-09-30', 'deadlines: due on the last day, late after 15 days, +20% after 30, the certificate in 14 days, limitation 7 years');
	check(PEUI.letter(reg, ex).includes('103,000') && PEUI.letter(reg, ex).includes('סעיף 20') && PEUI.letter(reg, ex).includes('28,840'), 'the letter to the employer states the sum, the s.14 top-up and the late-payment rule');
	const ps = PEUI.snapshot(reg);
	check(ps.total === 103000 && ps.result.includes('jt13-ruler') && ps.result.includes('jt13-time') && ps.details.includes('data-act="ics"') && ps.compare_table.includes('8½ ימים'), 'severance snapshot: the ruler, the payment timeline, the .ics, the notice table');
}

/* ---------- Wave 5: capital gains tax on a home (Land Taxation Law; Tax Authority instruction 1/2026; CBS index) ---------- */
{
	const sh = reg.shevach;
	check(sh.checked_on === '2026-10-14' && sh.single.ceiling === 5008000 && sh.single.ceiling_to === '2027-12-31' && sh.surtax.threshold === 5385285 && sh.rates.post2012 === 25 && sh.rates.mid === 20 && sh.rates.pre2001 === 47 && sh.rates.inflation === 10, 'capital-gains registry: ceiling 5,008,000 to 31.12.2027, surtax line 5,385,285 (instruction 1/2026), rates 25 / 20 / 47 / 10');
	// CBS linkage calculator (api.cbs.gov.il/index/data/calculator/120010), read on 14.10.2026: the indexed purchase value.
	const cbs = [
		[{ buyDate: '2010-06-01', buyPrice: 1200000, buyCosts: 60000, saleDate: '2026-09-01', salePrice: 2600000 }, 1633080.74],
		[{ buyDate: '2010-06-01', buyPrice: 1200000, buyCosts: 60000, saleDate: '2026-10-01', salePrice: 2600000 }, 1643957.59],
		[{ buyDate: '1992-05-10', buyPrice: 300000, saleDate: '2026-09-01', salePrice: 3000000 }, 909961.17],
		[{ buyDate: '2015-01-01', buyPrice: 3000000, saleDate: '2026-09-01', salePrice: 6000000 }, 3589361.83],
	];
	for (const [inp, value] of cbs) {
		const r = SH.compute(reg, Object.assign({ status: 'other' }, inp));
		check(r.ok && near(r.adjusted, value, 0.011), `CBS linkage from ${inp.buyDate} to ${inp.saleDate}: ${value} (got ${r.adjusted})`);
	}
	const old = SH.compute(reg, { status: 'other', buyDate: '1992-05-10', buyPrice: 300000, saleDate: '2026-09-01', salePrice: 3000000 });
	check(near(old.inflTaxable, 53445.85, 0.011) && old.regular.parts.length === 4 && old.regular.parts[0].rate === 47 && old.regular.parts[3].rate === 10, 'a 1992 purchase: the inflation up to 31.12.1993 (CBS: 353,445.85) is taxed at 10%, the real gain in three periods at 47 / 20 / 25%');
	const ex = SH.compute(reg, SHUI.EXAMPLE);
	check(ex.ok && ex.path === 'linear' && near(ex.inflationary, 383957.59, 0.011) && near(ex.shares.linear, 1310 / 5966, 1e-9) && near(ex.tax, ex.realGain * (1 - 1310 / 5966) * 0.25, 0.011), 'example: a qualifying home bought 1.6.2010: the real gain up to 1.1.2014 (1,310 of 5,966 days) is exempt, the rest at 25% (s.48א(ב2))');
	check(ex.regular.tax > ex.tax && ex.net === Math.round((2600000 - ex.tax - 30000) * 100) / 100, 'the linear rule beats the regular one; the net is the price less the tax and the sale costs');
	const single = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true }));
	check(single.path === 'exempt' && single.tax === 0, 'the only home, held 18 months, under the ceiling: exempt (s.49ב(2))');
	check(SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, buyDate: '2025-06-01', buyPrice: 2000000 })).flags.some((f) => f.code === 'held') && SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, priorExempt: true })).path === 'linear', 'held under 18 months, or an exempt sale in the 18 months before: no single-home exemption');
	const big = SH.compute(reg, { status: 'single', family: true, buyDate: '2015-01-01', buyPrice: 3000000, saleDate: '2026-09-01', salePrice: 6000000 });
	check(big.path === 'partial' && near(big.exemptShare, 5008000 / 6000000, 1e-12) && near(big.tax, big.regular.tax * (1 - 5008000 / 6000000), 0.011) && big.flags.some((f) => f.code === 'surtax') && big.flags.some((f) => f.code === 'ceiling'), 'above the ceiling: the share above 5,008,000 is taxed (s.49א(א1)); above 5,385,285 the surtax is flagged');
	check(SH.compute(reg, { status: 'qualified', buyDate: '2016-01-01', buyPrice: 2000000, saleDate: '2026-09-01', salePrice: 1900000 }).path === 'loss', 'a sale under the purchase price: no gain, no tax');
	check(!SH.compute(reg, { status: 'other', buyDate: '1990-02-01', buyPrice: 100000, saleDate: '2026-09-01', salePrice: 900000 }).ok, 'a purchase before the registry\'s index (16.3.1990) is refused, never guessed');
	const imp = SH.compute(reg, { status: 'other', buyDate: '2010-06-01', buyPrice: 1200000, improve: 100000, improveDate: '2015-06-01', saleDate: '2026-09-01', salePrice: 2600000 });
	check(imp.ok && imp.adjusted > SH.compute(reg, { status: 'other', buyDate: '2010-06-01', buyPrice: 1200000, saleDate: '2026-09-01', salePrice: 2600000 }).adjusted + 100000, 'an improvement is indexed from its own day (s.47, "יתרת שווי רכישה מתואמת" (2))');
	check(SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { saleDate: '2026-12-01' })).flags.some((f) => f.code === 'index_ahead'), 'a sale whose known index is not yet published is flagged');
	const dl = Object.fromEntries(ex.deadlines.map((d) => [d.key, d.date]));
	check(dl.declare === '2026-11-01' && dl.pay === '2026-11-30', 'a sale on 1.10.2026: the 30 days end on Saturday 31.10, so the declaration is due 1.11.2026 (Interpretation Law s.10(ג)); payment by 30.11.2026 (s.90א)');
	const ss = SHUI.snapshot(reg);
	check(near(ss.total, ex.tax, 0.001) && ss.result.includes('jt14-strip') && ss.details.includes('48א(ב2)') && ss.compare_table.includes('1995') && ss.method.includes('383,957.59'), 'capital-gains snapshot: the strip, the linear section, the years table, the CBS inflation in the method');
}

/* ---------- Wave 5: hidden fields never block, and the partial exemption is a scenario of its own ---------- */
{
	check(RE.compute(reg, { rent: 6000, months: 12, guarantors: 0, guarantorMax: 'abc' }).ok && !RE.compute(reg, { rent: 6000, months: 12, guarantors: 1, guarantorMax: -5 }).ok, 'the guarantee ceiling is read only with guarantors: a stale value in the hidden field never blocks the lease');
	check(RE.compute(reg, { rent: 6000, months: 12, option: 'none', optionMonths: 'x', optionPct: 'y' }).ok, 'the option fields are ignored when there is no option');
	const big = SH.compute(reg, { status: 'single', family: true, buyDate: '2015-01-01', buyPrice: 3000000, saleDate: '2026-09-01', salePrice: 6000000 });
	check(big.scen.exempt === big.tax && big.scen.exempt > 0 && SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'qualified' })).scen.exempt === null, 'the single-home card shows the partial tax above the ceiling, and nothing when the home is not the only one');
	check(PE.compute(reg, { payType: 'monthly', salary: 9000, hourly: 'x', hours: 'y', start: '2020-01-01', end: '2026-09-30', s14: 'none', s14Pct: 'z', s14From: 'bad' }).ok, 'severance: hidden hourly and section-14 fields never block a monthly calculation');
	check(SH.compute(reg, { status: 'qualified', buyDate: '2010-06-01', buyPrice: 1200000, saleDate: '2026-09-01', salePrice: 2600000, improve: '', improveDate: 'junk' }).ok, 'capital gains: the improvement date is read only with an improvement');
}

/* ---------- Review fixes (PR 128, Codex pass 1) ---------- */
{
	check(!SH.compute(reg, { status: 'single', family: true, buyDate: '2015-01-01', buyPrice: 2000000, saleDate: '2023-06-01', salePrice: 4900000 }).ok && !SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { saleDate: '2028-01-02' })).ok && SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { saleDate: '2025-01-01' })).ok, 'a sale outside 1.1.2025-31.12.2027 is refused: the 5,008,000 ceiling and the rates are for that period only (review, PR 128)');
	const plan = { status: 'single', family: true, buyDate: '2020-01-01', buyPrice: 1500000, saleDate: '2026-09-01', salePrice: 2500000, offPlan: true };
	check(!SH.compute(reg, plan).ok && SH.compute(reg, Object.assign({}, plan, { dwellingDate: '2025-12-01' })).flags.some((f) => f.code === 'held') && SH.compute(reg, Object.assign({}, plan, { dwellingDate: '2024-12-01' })).path === 'exempt', 'off-plan: the 18 months run from the day the home became a dwelling, which must be given (s.49ב(2); review, PR 128)');
	check(SH.compute(reg, Object.assign({}, plan, { status: 'qualified', offPlan: true, dwellingDate: '' })).ok, 'the delivery date is asked only for the single-home exemption');
	const near = PE.compute(reg, { salary: 10000, start: '2025-11-01', end: '2026-09-30' });
	check(near.entitled && near.conditional && near.severance === Math.round(10000 * (11 / 12) * 100) / 100 && !near.flags.some((f) => f.code === 'under_year') && PEUI.renderResult(reg, near).includes('סעיף 3'), 'a dismissal after 11 months: a conditional right under s.3, computed pro rata (review, PR 128)');
	check(!PE.compute(reg, { salary: 10000, start: '2026-01-01', end: '2026-09-30' }).entitled && PE.compute(reg, { salary: 10000, start: '2025-12-01', end: '2026-09-30' }).conditional && !PE.compute(reg, { salary: 10000, start: '2025-11-01', end: '2026-09-30', reason: 'resign' }).entitled, 'within the last two months of the first year the right is conditional; after 9 months, or on a resignation, there is none');
	const chip = REUI.renderDetails(reg, RE.compute(reg, { rent: 6000, months: 12 }));
	check(chip.includes(reg.rent_contract.protected_law_url) && reg.rent_contract.protected_law_url.includes('71616'), 'the protected-tenancy chip links to the Tenant Protection Law (review, PR 128)');
}

/* ---------- Wave 5: the Tax Authority's own self-assessment simulator (misim.gov.il, run on 14.10.2026) ---------- */
{
	// A qualifying home (not the only one) bought 1.6.2010 for 1,200,000 with 60,000 costs, sold 1.9.2026 for 2,600,000
	// with 30,000 costs. The simulator's tax screen: real gain to the transition 206,766.21 at 0%, after it 730,153.05
	// at 25%, inflationary amount 0, tax 182,538.26.
	const r = SH.compute(reg, { status: 'qualified', buyDate: '2010-06-01', buyPrice: 1200000, buyCosts: 60000, saleDate: '2026-09-01', salePrice: 2600000, saleCosts: 30000 });
	check(r.ok && r.path === 'linear' && near(r.linear.parts[0].gain, 206766.21, 0.011) && near(r.linear.parts[1].gain, 730153.05, 0.011) && near(r.tax, 182538.26, 0.005) && r.inflTaxable === 0, 'the Tax Authority simulator, to the agora: 206,766.21 exempt, 730,153.05 at 25%, tax 182,538.26');
}

/* ---------- Review fixes (PR 128, Codex pass 2) ---------- */
{
	const office = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, residential: false }));
	check(office.path === 'regular' && office.tax === office.regular.tax && office.scen.exempt === null && office.scen.linear === null && office.flags.some((f) => f.code === 'not_residential'), 'a home not used mainly for residence: no single-home exemption and no linear rule (s.49(א); review, PR 128)');
	check(SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true })).path === 'exempt', 'confirmed residential use keeps the exemption');
	const quit = PE.compute(reg, { salary: 10000, start: '2018-01-01', end: '2026-09-30', reason: 'resign', s14: 'partial' });
	const quitHtml = PEUI.renderResult(reg, quit) + PEUI.renderDetails(reg, quit);
	check(quit.fundUnknown && quitHtml.includes('מה שנצבר') && !/מהקופה[^<]*<\/td><td[^>]*>[^<]*0 ₪/.test(quitHtml), 'an ordinary resignation with s.14: the fund is shown as what accumulated and belongs to the worker, never as 0 (review, PR 128)');
	check(!PE.compute(reg, PEUI.EXAMPLE).fundUnknown, 'with a right to severance the share of the fund is computed');
}

/* ---------- Review fixes (PR 128, Codex pass 3) ---------- */
{
	// Notice runs both ways: a dismissal without notice is owed by the employer (s.7(א)); a resignation without notice is
	// owed by the worker to the employer (s.7(ב)), and the letter never demands it.
	for (const reason of ['resign', 'health']) {
		const q = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason, noticeMode: 'none' }));
		const f = q.flags.find((x) => x.code === 'no_notice');
		check(q.ok && f && f.section === 'סעיף 7(ב)' && f.he.includes('למעסיק') && !PEUI.letter(reg, q).includes('7(א)'), `a resignation (${reason}) without notice: the worker owes the employer (s.7(ב)), and the letter does not demand notice pay (review, PR 128)`);
	}
	const fired = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { noticeMode: 'none' }));
	check(fired.flags.find((x) => x.code === 'no_notice').section === 'סעיף 7(א)' && PEUI.letter(reg, fired).includes('סעיף 7(א)'), 'a dismissal without notice: the employer owes it, and the letter asks for it');
	const shortQuit = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'resign', noticeDate: '2026-09-15' }));
	const shortFired = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { noticeDate: '2026-09-15' }));
	check(shortQuit.short > 0 && shortQuit.flags.find((x) => x.code === 'short_notice').section === 'סעיף 7(ב)' && !PEUI.letter(reg, shortQuit).includes('ימים לפני המועד'), 'a short notice on a resignation is owed by the worker (s.7(ב)), not claimed in the letter');
	check(shortFired.short > 0 && shortFired.flags.find((x) => x.code === 'short_notice').section === 'סעיף 7(א)' && PEUI.letter(reg, shortFired).includes(`${shortFired.short} ימים לפני המועד`), 'a short notice on a dismissal: the letter asks for the missing days');
	check(PEUI.renderForm(reg, PEUI.EXAMPLE).includes('לא ניתנה הודעה') && !PEUI.renderForm(reg, PEUI.EXAMPLE).includes('לא קיבלתי הודעה'), 'the no-notice chip reads for both directions');

	// A gift (s.49ו): the single-home exemption waits 4 years from the gift, or 3 years from moving in as owner.
	const g = Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, buyDate: '2023-03-01', buyPrice: 1500000, buyCosts: 0, saleDate: '2026-10-01', salePrice: 1900000, saleCosts: 0, gift: true, giftDate: '2023-03-01' });
	const cold = SH.compute(reg, g);
	check(cold.ok && cold.path !== 'exempt' && cold.tax > 0 && cold.scen.exempt === null && cold.flags.some((f) => f.code === 'gift_cooling' && f.he.includes('1.3.2027') && f.section === 'סעיף 49ו'), 'a gift received 1.3.2023 and sold 1.10.2026 without living there: no exemption before 1.3.2027 (s.49ו(א)(1); review, PR 128)');
	const lived = SH.compute(reg, Object.assign({}, g, { giftLived: true, livedFrom: '2023-06-01' }));
	check(lived.ok && lived.path === 'exempt' && lived.flags.some((f) => f.code === 'gift_cooled'), 'lived there from 1.6.2023: 3 years end 1.6.2026, so a sale on 1.10.2026 is exempt (s.49ו(א)(2))');
	const early = SH.compute(reg, Object.assign({}, g, { giftLived: true, livedFrom: '2024-01-01' }));
	check(early.ok && early.path !== 'exempt' && early.flags.some((f) => f.code === 'gift_cooling' && f.he.includes('1.1.2027')), 'moved in on 1.1.2024: the 3 years end 1.1.2027');
	const before = SH.compute(reg, Object.assign({}, g, { giftLived: true, livedFrom: '2020-01-01' }));
	check(before.ok && before.flags.some((f) => f.code === 'gift_cooled' && f.he.includes('1.3.2026')), 'living there before the gift counts from the gift (1.3.2023 + 3 years)');
	const minor = SH.compute(reg, Object.assign({}, g, { giftMinor: true }));
	check(!minor.ok && minor.errors.some((e) => e.field === 'gift' && e.he.includes('סעיף 49ו(ב)')) && SHUI.renderForm(reg, Object.assign({}, g, { giftMinor: true })).includes('id="jt14-gift-e"'), 'a gift received before 18 is refused with a pointer to the simulator, on its own error line (s.49ו(ב))');
	check(!SH.compute(reg, Object.assign({}, g, { giftLived: true, livedFrom: '' })).ok, 'living there needs the day it began');
	check(SH.compute(reg, Object.assign({}, g, { gift: false })).path === 'exempt' && SH.compute(reg, Object.assign({}, g, { status: 'qualified' })).flags.every((f) => !f.code.startsWith('gift')), 'without a gift, or for a second home, the gift rule does not apply');
	check(SH.compute(reg, Object.assign({}, g, { saleDate: '2027-03-01' })).path === 'exempt', 'a sale on 1.3.2027, four years from the gift, is exempt');
	check(reg.shevach.gift.other_months === 48 && reg.shevach.gift.lived_months === 36 && reg.shevach.gift.section === 'סעיף 49ו', 'the registry holds the s.49ו periods');
}

/* ---------- Review fixes (PR 128, Codex pass 4) ---------- */
{
	// Depreciation on a rented home (s.47): required for a taxable sale, it lowers the acquisition value.
	const base = Object.assign({}, SHUI.EXAMPLE, { rented: true });
	const missing = SH.compute(reg, base);
	check(!missing.ok && missing.errors[0].field === 'depreciation' && missing.errors[0].he.includes('סעיף 47'), 'a rented home sold with tax and no depreciation: no estimate, the field is asked for (s.47; review, PR 128)');
	const plain = SH.compute(reg, SHUI.EXAMPLE);
	const dep = SH.compute(reg, Object.assign({}, base, { depreciation: 100000 }));
	check(dep.ok && Math.abs(dep.gain - plain.gain - 100000) < 0.01 && dep.realGain > plain.realGain + 100000 && dep.tax > plain.tax && dep.flags.some((f) => f.code === 'depreciation'), 'depreciation of 100,000 adds 100,000 to the gain and more than that to the real gain (the balance is indexed after it)');
	check(SH.compute(reg, Object.assign({}, base, { depreciation: 0 })).tax === plain.tax, 'a depreciation of 0 entered is accepted as given');
	check(SH.compute(reg, Object.assign({}, base, { status: 'single', family: true })).path === 'exempt', 'a fully exempt single home needs no depreciation figure');
	check(SHUI.renderDetails(reg, dep).includes('פחת בשנות ההשכרה') && SHUI.renderForm(reg, base).includes('id="jt14-dep"') && !/data-if-rented hidden/.test(SHUI.renderForm(reg, base)), 'the depreciation field shows when the home was rented, and the table shows the deduction');
	// The family unit is one seller (s.49(ב)); a foreign resident needs the certificate of no home abroad (s.49א(א)).
	const one = Object.assign({}, SHUI.EXAMPLE, { status: 'single' });
	const unconfirmed = SH.compute(reg, Object.assign({}, one, { family: false }));
	check(unconfirmed.path !== 'exempt' && unconfirmed.scen.exempt === null && unconfirmed.flags.some((f) => f.code === 'family' && f.section === 'סעיף 49(ב)'), 'the single-home exemption waits for the family-unit confirmation (s.49(ב); review, PR 128)');
	check(SH.compute(reg, Object.assign({}, one, { family: true })).path === 'exempt', 'confirmed: exempt');
	const abroad = SH.compute(reg, Object.assign({}, one, { family: true, resident: 'foreign' }));
	check(abroad.path !== 'exempt' && abroad.flags.some((f) => f.code === 'foreign' && f.section === 'סעיף 49א(א)'), 'a foreign resident without the certificate of no home abroad: no exemption (s.49א(א); review, PR 128)');
	check(SH.compute(reg, Object.assign({}, one, { family: true, resident: 'foreign', foreignNoHome: true })).path === 'exempt', 'with the certificate: exempt');
	const f1 = SHUI.renderForm(reg, one);
	check(f1.includes('name="jt14-fm"') && f1.includes('תושבות המוכר') && f1.includes('name="jt14-rs"') && f1.includes(reg.shevach.seller_he), 'the single-home block asks for the family unit and the residency, and shows the one-seller rule');
	// Severance: the tax ceiling is the one of the grant's year; only 2025-2027 is held.
	const old = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { start: '2015-03-01', end: '2023-09-30' }));
	const oldHtml = PEUI.renderResult(reg, old) + PEUI.renderDetails(reg, old) + PEUI.verdictSentence(reg, old);
	check(old.ok && old.exempt === null && old.taxable === null && old.flags.some((f) => f.code === 'tax_year') && oldHtml.includes('לא חושב') && !/NaN|null|undefined/.test(oldHtml), 'a dismissal in 2023: no tax split with the 2025-2027 ceiling, said plainly (review, PR 128)');
	check(PE.compute(reg, PEUI.EXAMPLE).exempt === 103000 && PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { end: '2027-12-31' })).exempt !== null && PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { end: '2028-01-01' })).exempt === null, 'the ceiling applies to an end of work from 1.1.2025 to 31.12.2027 only');
}

/* ---------- Review fixes (PR 128, Codex pass 5) ---------- */
{
	// Calculation regulations 7 and 8: one change of scope or pay, each period on its own salary.
	const up = PE.compute(reg, { salary: 10000, start: '2024-07-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevPct: 50 });
	check(up.ok && up.severance === 12500 && up.flags.some((f) => f.code === 'change' && f.section === 'תקנה 7'), 'six months at 50% then a year full-time at 10,000: 12,500, not 15,000 (reg. 7; review, PR 128)');
	const down = PE.compute(reg, { salary: 5000, jobPct: 50, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevPct: 100 });
	check(down.ok && down.severance === 15000 && down.prevBase === 10000 && down.exempt === 15000, 'a year full-time then a year at 50% on 5,000: the full-time year on the full-time salary, 15,000 (reg. 7; the exempt ceiling per s.9(7א)(ד))');
	const cutPay = PE.compute(reg, { salary: 8000, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevSalary: 10000 });
	check(cutPay.ok && cutPay.cut && cutPay.severance === 18000 && cutPay.flags.some((f) => f.code === 'change' && f.section === 'תקנה 8'), 'a pay cut from 10,000 to 8,000: the year before it on 10,000 (reg. 8)');
	check(!PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { change: true, changeDate: '2022-01-01', prevPct: 50, manyChanges: true })).ok && PEUI.renderForm(reg, PEUI.EXAMPLE).includes('id="jt13-change-e"') && PEUI.renderForm(reg, PEUI.EXAMPLE).includes('name="jt13-chg"'), 'more than one change is refused, on its own error line');
	check(!PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { change: true, changeDate: '2017-01-01' })).ok && !PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { change: true, changeDate: '' })).ok, 'the change day must fall inside the work');
	check(!PE.compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '2020-01-01', end: '2025-12-31', change: true, changeDate: '2022-01-01', prevPct: 50 }).ok, 'an hourly worker states the change in hours, not in percent (pass 8)');
	const same = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14: 'none', change: true, changeDate: '2022-01-01', prevPct: 100 }));
	check(same.severance === 103000, 'a "change" with the same scope and no pay cut gives the plain result');
	// Section 14: the fund's balance is unknown and never shown as an amount (review, PR 128).
	const ex = PE.compute(reg, PEUI.EXAMPLE);
	const html = PEUI.renderResult(reg, ex) + PEUI.renderDetails(reg, ex) + PEUI.verdictSentence(reg, ex);
	const ltr = PEUI.letter(reg, ex);
	check(!html.includes('74,160') && !ltr.includes('74,160') && html.includes('מה שנצבר') && ltr.includes('כל הכספים שנצברו לפיצויים') && ltr.includes('28,840'), 'with s.14 the fund is "what accumulated", never a computed amount; the letter asks to release it all and pay the 28,840 completion');
	const full = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14: 'full' }));
	check(full.employer === 0 && !PEUI.letter(reg, full).includes('מגיעים לי פיצויי פיטורים של') && PEUI.renderDetails(reg, full).includes('תלוי במה שנצבר בקופה'), 'full s.14: the employer owes 0, and the tax line depends on the fund');
}

/* ---------- Review fixes (PR 128, Codex pass 6) ---------- */
{
	const paid = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { noticeDate: '2026-09-15', noticeMode: 'paid' }));
	check(paid.short > 0 && !paid.flags.some((f) => f.code === 'short_notice') && paid.flags.some((f) => f.code === 'paid_notice' && f.section === 'סעיף 6') && !PEUI.letter(reg, paid).includes('ימים לפני המועד'), 'notice paid instead of work: no shortfall claimed and none in the letter, only a check that the pay covered the period (review, PR 128)');
	const worked = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { noticeDate: '2026-09-15', noticeMode: 'worked' }));
	check(worked.flags.some((f) => f.code === 'short_notice') && PEUI.letter(reg, worked).includes('ימים לפני המועד'), 'a worked notice that ended early: the shortfall is claimed');
	const cutPay = PE.compute(reg, { salary: 8000, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevSalary: 10000 });
	check(cutPay.severance === 18000 && cutPay.exempt === 16000 && cutPay.taxable === 2000, 'after a pay cut the exempt ceiling is the final salary x the service: 8,000 x 2 = 16,000, so 2,000 is taxable (s.9(7א)(א); review, PR 128)');
	const down = PE.compute(reg, { salary: 5000, jobPct: 50, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevPct: 100 });
	check(down.exempt === 15000, 'final salary part-time: the full-time year counts on the full-time salary (s.9(7א)(ד))');
	const up = PE.compute(reg, { salary: 10000, start: '2024-07-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevPct: 50 });
	check(up.severance === 12500 && up.exempt === 12500, 'after a raise in scope the ceiling (10,000 x 1.5 = 15,000) covers the 12,500');
	const late = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14From: '2027-01-01' }));
	check(!late.ok && late.errors.some((e) => e.field === 's14From'), 'a s.14 start after the last day is an input error, not a silent zero (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 7) ---------- */
{
	const one = Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true });
	const f = SHUI.renderForm(reg, one);
	check(f.includes('שנספרת (סעיף 49ג)') && f.includes(reg.shevach.family_he) && reg.shevach.family_he.includes('עד שליש'), 'the family confirmation counts only dwellings s.49ג does not exclude, and lists the exclusions (review, PR 128)');
	const rights = SH.compute(reg, Object.assign({}, one, { buildingRights: true }));
	check(!rights.ok && rights.errors.some((e) => e.field === 'rights' && e.he.includes('סעיף 49ז')) && f.includes('id="jt14-rights-e"') && f.includes('name="jt14-br"'), 'a price with additional building rights on the single-home path is refused (s.49ז; review, PR 128)');
	check(SH.compute(reg, Object.assign({}, one, { status: 'other', buildingRights: true })).ok, 'the s.49ז screen is for dwellings only (pass 9 extends it to the linear path)');
	const quit = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'resign' }));
	check(!quit.entitled && quit.deadlines.length === 1 && quit.deadlines[0].key === 'cert' && !PEUI.renderResult(reg, quit).includes('הפיצויים צריכים להיות בחשבון'), 'no severance due: only the employment certificate deadline, no payment clock (review, PR 128)');
	check(PE.compute(reg, PEUI.EXAMPLE).deadlines.length === 5, 'with severance due all five deadlines stay');
}

/* ---------- Review fixes (PR 128, Codex pass 8) ---------- */
{
	// Unpaid leave above 14 days a year is not counted (reg. 10(3)).
	const leave = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14: 'none', unpaidExcess: 76 }));
	check(leave.ok && leave.severance === Math.round(12000 * (103 / 12 - 76 / 365) * 100) / 100 && leave.flags.some((f) => f.code === 'leave' && f.section === 'תקנה 10(3)') && PEUI.verdictSentence(reg, leave).includes('76 ימי חופשה ללא תשלום'), 'a 90-day unpaid leave in one year (76 days above 14): the service is shortened, and the result says so (review, PR 128)');
	check(!PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { unpaidExcess: -3 })).ok && PEUI.renderForm(reg, PEUI.EXAMPLE).includes('id="jt13-ul"'), 'the unpaid-leave field is validated and in the form');
	// Hourly workers: the scope is the hours (reg. 7 applies correspondingly).
	const hr = PE.compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevHours: 80 });
	check(hr.ok && hr.change && hr.prevBase === 4000 && hr.severance === 12000 && hr.flags.some((f) => f.code === 'change' && f.he.includes('80 שעות')), 'an hourly worker from 80 to 160 hours a month at 50: 4,000 x 1 + 8,000 x 1 = 12,000 (review, PR 128)');
	check(!PE.compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '2024-01-01', end: '2025-12-31', change: true, changeDate: '2025-01-01' }).ok, 'an hourly change needs the earlier hours');
	const hrCut = PE.compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevHours: 160, prevHourly: 60 });
	check(hrCut.cut && hrCut.severance === 9600 + 8000, 'an hourly pay cut from 60 to 50: the year before on 60 (reg. 8)');
	// s.14 on a resignation: the fund's tax split is unknown too.
	const quit = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'resign' }));
	check(quit.fundUnknown && quit.taxNote === 'fund' && quit.taxable === null && quit.exempt > 0 && PEUI.renderResult(reg, quit).includes('עד '), 'a resignation with a s.14 fund: exempt up to the ceiling, the taxable part unknown, never 0 / 0 (review, PR 128)');
	// The rent chapter's scope (s.25טו): outside it a deposit above the cap is not a violation.
	const shortLease = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { months: 3, option: 'none', bank: '', cash: 30000, forbidden: { insurance: true } }));
	check(shortLease.ok && !shortLease.applies && shortLease.bad === 0 && shortLease.sec.cash === 30000 && shortLease.flags.some((f) => f.code === 'deposit_free') && !shortLease.flags.some((f) => f.code === 'deposit_over') && shortLease.flags.find((f) => f.code === 'pay_insurance').level === 'info' && RE.contractText(reg.rent_contract, shortLease, false).includes('30,000'), 'a 3-month lease with no option: the deposit stays as agreed, nothing is called a violation (s.25טו; review, PR 128)');
	const longLease = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { bank: '', cash: 30000 }));
	check(longLease.applies && longLease.flags.some((f) => f.code === 'deposit_over' && f.level === 'bad') && longLease.sec.cash === 18000, 'inside the chapter the cap still binds');
}

/* ---------- Review fixes (PR 128, Codex pass 9) ---------- */
{
	// Between relatives the s.25יד(2) terms are the parties' (s.25טו(ב)); s.25ו stays (s.25יד(1)).
	const rel = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { relative: true, returnDays: 90, bank: '', cash: 30000, exit: 'landlord', forbidden: { insurance: true }, asIs: true }));
	const relText = RE.contractText(reg.rent_contract, rel, false);
	check(rel.ok && rel.free && rel.lawful.returnDays === 90 && rel.sec.cash === 30000 && rel.exit === 'landlord' && relText.includes('תוך 90 ימים') && relText.includes('30,000') && relText.includes('בהסכמת הצדדים ישא השוכר בביטוח המבנה') && relText.includes('המשכיר רשאי לבטל את החוזה') && !relText.includes('אינן עולות יחד על'), 'between relatives a 90-day return, a 30,000 deposit, a landlord exit and building insurance on the tenant stay as agreed (s.25טו(ב); review, PR 128)');
	check(rel.bad === 1 && rel.flags.find((f) => f.code === 'as_is').level === 'bad' && ['return_late', 'pay_insurance', 'exit_landlord'].every((c) => rel.flags.find((f) => f.code === c).level === 'info'), 'only the "as is" waiver (s.25ו, kept by s.25יד(1)) is still against the law between relatives');
	// Above the unindexed 20,000 line the chapter may not apply: protections kept, nothing called a violation.
	const rich = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { rent: 100000, bank: '', cash: 400000 }));
	check(rich.ok && rich.bad === 0 && rich.flags.find((f) => f.code === 'deposit_over').level === 'warn' && rich.flags.find((f) => f.code === 'deposit_over').he.includes('25טו(א)(4)'), 'rent above 20,000: the cap is a kept protection with a "may not apply" warning, not a violation (review, PR 128)');
	// The lease text never contradicts itself: no cap sentence above a kept higher deposit.
	const shortL = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { months: 3, option: 'none', bank: '', cash: 30000 }));
	check(!RE.contractText(reg.rent_contract, shortL, false).includes('אינן עולות יחד על') && !RE.contractText(reg.rent_contract, shortL, false).includes('בכל סתירה יחול החוק'), 'outside the chapter the lease neither states the cap nor says the chapter overrides it');
	// Capital gains: the building-rights screen covers the linear path too (s.49ז).
	const q = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { buildingRights: true }));
	check(!q.ok && q.errors.some((e) => e.field === 'rights') && /data-if-home[^>]*>[\s\S]*name="jt14-br"/.test(SHUI.renderForm(reg, SHUI.EXAMPLE)) && SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'other', buildingRights: true })).ok, 'building rights in the price are screened on the linear path too, not for a non-dwelling (s.49ז; review, PR 128)');
	// Severance: unpaid leave with a change of scope or pay is refused.
	check(!PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { change: true, changeDate: '2022-01-01', prevPct: 50, unpaidExcess: 30 })).ok, 'unpaid leave together with a change: refused, never spread across the periods (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 10) ---------- */
{
	const term = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'term', noticeMode: 'none' }));
	check(term.ok && term.entitled && !term.flags.some((f) => f.code === 'no_notice') && term.flags.some((f) => f.code === 'no_notice_term') && !PEUI.letter(reg, term).includes('7(א)'), 'a fixed term that ended without renewal: no notice debt on the worker, no notice demand (s.9; review, PR 128)');
	const scopes = PE.compute(reg, { salary: 5000, jobPct: 50, start: '2022-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2024-01-01', prevPct: 80 });
	check(scopes.ok && scopes.exempt === 26000 && scopes.severance === 26000, 'two years at 80% then two at 50% (10,000 full-time): the ceiling counts the 80% years on 8,000, 26,000 (Form 161; review, PR 128)');
	const free = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { months: 2, option: 'none', bank: '', cash: 30000 }));
	const html = REUI.renderResult(reg, free);
	check(!html.includes('הערובה המרבית שמותר לבקש') && html.includes('הערובות בחוזה') && html.includes('30,000') && html.includes('לא מחייבת כאן') && !REUI.verdictSentence(reg, free).includes('עד 12,000'), 'outside the chapter the result shows the agreed deposit and the cap only as a non-binding reference (review, PR 128)');
	const rich = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { rent: 100000, bank: '', cash: 400000 }));
	check(REUI.verdictSentence(reg, rich).startsWith('ייתכן שהסימן לא חל'), 'above the 20,000 line the verdict says the chapter may not apply');
}

/* ---------- Review fixes (PR 128, Codex pass 11) ---------- */
{
	check(!PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { s14From: '2020-01-01', unpaidExcess: 30 })).ok && PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { unpaidExcess: 30 })).ok, 'unpaid leave with s.14 from a date inside the work is refused; with s.14 from the start it is computed (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 12) ---------- */
{
	const term11 = PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2025-11-30', reason: 'term' });
	check(term11.ok && term11.entitled && term11.conditional && term11.severance > 0, 'a fixed term not renewed after 11 months: the s.3 presumption applies as to a dismissal (review, PR 128)');
	const old = PE.compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '1980-01-01', end: '2025-12-31', reason: 'fired' });
	check(!old.ok && old.errors.some((e) => e.field === 'start' && e.he.includes('1.8.1983')), 'an hourly worker who started before 1.8.1983 is refused, never computed at a month a year (s.12(א); review, PR 128)');
	const cert = PE.compute(reg, PEUI.EXAMPLE).deadlines.find((d) => d.key === 'cert');
	check(cert.he.includes('לכל המאוחר') && cert.he.includes('בקשה בכתב מקדימה'), 'the certificate date is the latest one, and a written request brings it forward');
}

/* ---------- Review fixes (PR 128, Codex pass 13) ---------- */
{
	// The gift day apart from the donor's acquisition: the cooling runs from the gift, the gain from the donor's basis.
	const g = Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, buyDate: '2012-05-01', buyPrice: 900000, buyCosts: 0, saleDate: '2026-10-01', salePrice: 1900000, saleCosts: 0, gift: true, giftDate: '2024-01-01' });
	const r1 = SH.compute(reg, g);
	check(r1.ok && r1.path !== 'exempt' && r1.buyDate === '2012-05-01' && r1.gain === 1000000 && r1.flags.some((f) => f.code === 'gift_cooling' && f.he.includes('1.1.2028')), 'a gift on 1.1.2024 of a home the donor bought in 2012: the cooling runs from the gift (to 1.1.2028), the gain from the donor basis of 2012 (review, PR 128)');
	check(!SH.compute(reg, Object.assign({}, g, { giftDate: '' })).ok && SHUI.renderForm(reg, g).includes('id="jt14-gd"'), 'a gift needs the day it was received');
	// Acquisitions 7.11.2001-31.12.2003: no number for a taxable sale (transitional reduction).
	const t = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'other', buyDate: '2002-06-01' }));
	check(!t.ok && t.errors.some((e) => e.field === 'buyDate' && e.he.includes('7.11.2001')), 'a taxable sale of a right bought in 2002 is refused (transitional reduction; review, PR 128)');
	check(SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, buyDate: '2002-06-01' })).path === 'exempt' && SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'other', buyDate: '2004-01-01' })).ok, 'an exempt sale, or a purchase from 2004, is still computed');
	// The rental chapter's excluded kinds of dwelling (s.25טו(א)(1)).
	const hotel = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { excluded: true }));
	check(!hotel.ok && hotel.errors.some((e) => e.field === 'excl' && e.he.includes('25טו(א)(1)')) && REUI.renderForm(reg, REUI.EXAMPLE).includes('id="jt12-excl-e"'), 'a hotel, hostel, assisted-living, dormitory or protected-tenancy dwelling is screened out (s.25טו(א)(1); review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 14) ---------- */
{
	check(SHUI.renderForm(reg, SHUI.EXAMPLE).includes('של נותן המתנה, כי הם עוברים אליכם'), 'the donor-basis guidance shows on every path, next to the acquisition fields (review, PR 128)');
	const tooLong = PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2025-12-31', reason: 'fired', unpaidExcess: 500 });
	check(!tooLong.ok && tooLong.errors.some((e) => e.field === 'unpaidExcess'), 'unpaid leave longer than the whole service is an input error, never a silent 0 (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 15) ---------- */
{
	const hr = PE.compute(reg, { payType: 'hourly', hourly: 50, hours: 80, start: '2024-01-01', end: '2025-12-31', reason: 'fired', change: true, changeDate: '2025-01-01', prevHours: 160 });
	check(hr.ok && hr.severance === 12000 && hr.exempt === 12000 && hr.taxable === 0, 'hourly, a year at 160 hours then a year at 80 at 50: 12,000, all exempt (the higher earlier hours count; Form 161; review, PR 128)');
	const stale = PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2026-03-31', reason: 'fired', noticeMode: 'none', noticeDate: '2025-11-01' });
	check(stale.ok && stale.notice.month && stale.noticeDate === null && PEUI.letter(reg, stale).includes('חודש'), 'with no notice given, a stale notice date is ignored: a month after a year (review, PR 128)');
	const f = PEUI.renderForm(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'term' }));
	check(/name="jt13-rk" value="term" checked/.test(f) && !/name="jt13-rw" value="term"/.test(f) && /data-if-resign hidden/.test(f), 'a fixed term that ended is its own ending choice, not under resignation (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 16) ---------- */
{
	const inh = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { inherited: true }));
	check(!inh.ok && inh.errors.some((e) => e.field === 'inherited' && e.he.includes('49ב(5)')) && SHUI.renderForm(reg, SHUI.EXAMPLE).includes('id="jt14-inherited-e"'), 'an inherited dwelling sold with tax is refused: it may be exempt under s.49ב(5) (review, PR 128)');
	check(!SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'single', family: true, inherited: true })).ok, 'any inherited dwelling is refused, also when it looks exempt as a single home (the heir holding period; pass 19)');
	const par = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'parent' }));
	check(par.ok && !par.entitled && par.flags.some((f) => f.code === 'parent_unconfirmed' && f.he.includes('סעיף 7(ג)')), 'a parent resignation without the s.7 conditions confirmed: no severance computed (review, PR 128)');
	check(PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'parent', parentOk: true })).entitled && PEUI.renderForm(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'parent' })).includes('name="jt13-po"'), 'confirmed: entitled; the form asks for it');
	const rel = RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { relative: true }));
	check(rel.flags.find((f) => f.code === 'relative').he.includes('כפי שסוכם') && !rel.flags.find((f) => f.code === 'relative').he.includes('שומר עליהן'), 'the relative note matches the lease written as agreed (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 17) ---------- */
{
	const f = PEUI.renderForm(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'term' }));
	check(f.includes('ולא הוצע לי לחדש אותו 3 חודשים לפני הסוף') && f.includes('סעיף 9'), 'the fixed-term choice states the s.9 condition: no renewal offer 3 months before the end (review, PR 128)');
	const nine = PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2025-09-30', reason: 'fired' });
	check(nine.ok && !nine.entitled && nine.flags.some((f2) => f2.code === 'near_year_ask'), 'a dismissal after 9 months: the s.3 question is raised, not closed by a cutoff');
	const claimed = PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2025-09-30', reason: 'fired', nearClaim: true });
	check(claimed.entitled && claimed.conditional && claimed.severance === 7500, 'when the person says it was close to the year end, the amount is computed under s.3 (review, PR 128)');
	check(PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2025-09-30', reason: 'resign', nearClaim: true }).entitled === false, 's.3 is for dismissals only');
}

/* ---------- Review fixes (PR 128, Codex pass 18) ---------- */
{
	for (const reason of ['health', 'move', 'worse', 'retire']) {
		const r = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason }));
		check(r.ok && !r.entitled && r.flags.some((f) => f.code === 'ground_unconfirmed'), `a resignation for "${reason}" without its conditions confirmed: no severance (review, PR 128)`);
		check(PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason, groundOk: true })).entitled, `"${reason}" confirmed: entitled`);
	}
	const f = PEUI.renderForm(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'move' }));
	check(f.includes('name="jt13-po"') && f.includes('תקנה 12(ב)') && /data-ground-hint="move">/.test(f), 'the form shows the conditions of the chosen ground and asks to confirm them');
	const rf = REUI.renderForm(reg, Object.assign({}, REUI.EXAMPLE, { relative: true }));
	check(rf.includes('סב או סבתא, צאצא או צאצא של בן הזוג') && rf.includes('אינם קרובים לעניין זה'), 'the relative choice lists the s.25טו(ב) relations (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 19) ---------- */
{
	const shop = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'other', buyDate: '2015-01-01', buyPrice: 1300000, buyCosts: 0, salePrice: 4000000, saleCosts: 0 }));
	check(shop.ok && shop.tax > 0 && shop.flags.some((f) => f.code === 'surtax' && f.he.includes('בכל מחיר מכירה')), 'a non-residential sale under 5,385,285: the surtax warning still shows (review, PR 128)');
	check(!SH.compute(reg, SHUI.EXAMPLE).flags.some((f) => f.code === 'surtax'), 'a dwelling under the price line: no surtax warning');
}

/* ---------- Review fixes (PR 128, Codex pass 20) ---------- */
{
	const worse = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'worse', groundOk: true, s14: 'none' }));
	const arr = PE.byArrangement(reg, { payType: worse.payType, salary: worse.monthly, start: worse.start, end: worse.end, reason: worse.reason, groundOk: worse.groundOk });
	check(worse.entitled && arr.none.employer === 103000 && PEUI.renderDetails(reg, worse).includes('103,000'), 'the three-arrangements cards keep a confirmed ground: the employer pays 103,000 without s.14 (review, PR 128)');
	const near = PE.compute(reg, { salary: 10000, start: '2025-01-01', end: '2025-09-30', reason: 'fired', nearClaim: true });
	check(near.nearClaim && PE.byArrangement(reg, { salary: 10000, start: '2025-01-01', end: '2025-09-30', reason: 'fired', nearClaim: near.nearClaim }).none.employer === 7500, 'and a claimed s.3 dismissal');
}

/* ---------- Review fixes (PR 128, Codex pass 21) ---------- */
{
	const health = reg.severance.reasons.find((x) => x.code === 'health');
	check(health.conditions_he.includes('סיבה מספקת') && health.conditions_he.includes('תקנה 11') && health.conditions_he.includes('הורה של בן הזוג'), 'the health ground states the sufficient-reason test and the reg. 11 family list (review, PR 128)');
	check(['worse', 'retire', 'parent', 'move'].every((c) => reg.severance.reasons.find((x) => x.code === c).conditions_he), 'every confirmable ground has its conditions');
	const f = PEUI.renderForm(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'health' }));
	check(/data-ground-hint="health">[^<]*סיבה מספקת/.test(f), 'the form shows them for the chosen ground');
	const shop = SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'other', inherited: true }));
	check(!shop.ok && shop.errors.some((e) => e.field === 'inherited' && e.he.includes('לפי המוריש')) && /name="jt14-inh"/.test(SHUI.renderForm(reg, Object.assign({}, SHUI.EXAMPLE, { status: 'other' }))), 'an inherited non-residential right is refused too, and the question shows for every status (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 22) ---------- */
{
	const term = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'term' }));
	check(!term.flags.some((f) => f.code === 'resign_as_fired') && term.flags.some((f) => f.code === 'term_as_fired' && f.section === 'סעיף 9'), 'a fixed term that ended is described as a dismissal, never as a resignation (review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 23) ---------- */
{
	const other = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'other_ground' }));
	check(!other.ok && other.errors.some((e) => e.field === 'reason') && PEUI.renderForm(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'resign' })).includes('value="other_ground"'), 'other statutory grounds (enlistment, a shelter, elected office ...) are offered and decline a definitive result (review, PR 128)');
	const ret = PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { reason: 'retire', groundOk: true, s14: 'none' }));
	const html = PEUI.renderResult(reg, ret) + PEUI.renderDetails(reg, ret);
	check(ret.retireCredit && html.includes('פחות כספי הפיצויים בקופה') && html.includes('סעיף 11(ה)') && PEUI.letter(reg, ret).includes('נזקפים על חשבונם'), 'retirement: fund money for severance is credited even without s.14, and the result and letter say so (s.11(ה); review, PR 128)');
	const f = SHUI.renderForm(reg, SHUI.EXAMPLE);
	check(f.includes('הוצאות ששולמו ביום הרכישה') && f.includes('מוצמדת למדד מיום התשלום'), 'expenses are asked by their payment date (s.47; review, PR 128)');
}

/* ---------- Review fixes (PR 128, Codex pass 24) ---------- */
{
	check(!SH.compute(reg, Object.assign({}, SHUI.EXAMPLE, { replacement: true })).ok && SHUI.renderForm(reg, SHUI.EXAMPLE).includes('id="jt14-replacement-e"'), 'a replacement within two homes (s.49ה) is screened (review, PR 128)');
	check(!PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { seasonal: true })).ok && !PE.compute(reg, Object.assign({}, PEUI.EXAMPLE, { otherBreaks: true })).ok, 'seasonal work and the other reg. 10 breaks decline a definitive result (review, PR 128)');
	const pf = PEUI.renderForm(reg, PEUI.EXAMPLE);
	check(pf.includes('id="jt13-seasonal-e"') && pf.includes('id="jt13-breaks-e"'), 'the severance form asks for both');
	check(!RE.compute(reg, Object.assign({}, REUI.EXAMPLE, { sublease: true })).ok && REUI.renderForm(reg, REUI.EXAMPLE).includes('id="jt12-sub-e"'), 'a sublease is screened out (s.25טו(ג); review, PR 128)');
}

if (failures) {
	console.error(`justice tools engines: ${failures} failure(s), ${passed} passed`);
	process.exit(1);
}
console.log(`justice tools engines: ok (${passed} checks)`);
