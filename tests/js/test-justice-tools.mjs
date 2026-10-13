/**
 * Golden tests for the co.il tools engines (HAD-485, HAD-490, HAD-498). Run: node tests/js/test-justice-tools.mjs
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
import { encodeState, decodeState, decodeList, parseMoney, csv, ics, isStale, track } from '../../assets/js/tools/instrument.js';

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
	check(fee.fee === 597 && near(fee.online, 507.45), 'registrar fee 597 NIS from 1.1.2026; 85% online = 507.45 (fee regulations, reg. 1(א))');
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
	// The Tax Authority's own examples (instruction 2/2026, s.2.1.1.1.1-4): the sale window and the war extension.
	const dl = (d, o = {}) => RQ.replacementDeadline(pt, d, o).deadline;
	check(dl('2024-09-01') === '2026-08-31', 'instruction 2/2026 example 1: bought 1.9.24, 18 months -> 1.3.26 -> extended to 31.8.26');
	check(dl('2025-04-30') === '2027-01-31', 'instruction 2/2026 example 2: bought 30.4.25 -> 31.10.26 -> 31.1.27');
	check(dl('2025-06-01') === '2027-09-01', 'instruction 2/2026 example 3: bought 1.6.25, 24 months -> 1.6.27 -> 1.9.27');
	check(dl('2024-06-01', { contractor: true, delivery: '2025-12-31' }) === '2027-03-31', 'instruction 2/2026 example 4: contractor, delivered 31.12.25 -> 31.12.26 -> 31.3.27');
	check(dl('2023-06-01') === '2024-12-01' && dl('2026-06-15') === '2028-06-15', 'no extension for a window outside 28.2.2026-31.5.2026');
	const r = RQ.compute(reg, { price: 2650000, date: '2026-10-13', track: 'single', lawyerPct: 0.5, brokerPct: 2 });
	check(r.ok && near(r.lawyer, 15635) && near(r.broker, 62540) && near(r.total, 106213.33), 'full cost: lawyer 0.5% + 18% VAT = 15,635; broker 2% + VAT = 62,540; total 106,213.33');
	check(r.declare === '2026-11-12' && r.pay === '2026-12-12', 'declaration in 30 days (s.73(ג)), payment in 60 days (s.90א)');
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
	check(est({ betterment: 800000, plan: 'mamad' }).levy === 0, 's.19(ב)(9): no levy on a protected space');
	{
		const m = est({ betterment: 800000, plan: 'mamad', mamadBeyond: 100000 });
		check(m.levy === 50000 && m.beyond === 100000, 's.19(ב)(9) + s.3: area beyond the protected space pays the regular half (review, PR 124)');
		check(est({ betterment: 800000, plan: 'mamad' }).flags.some((f) => f.code === 'mamad_area'), 'mamad: the statutory-area limit is always stated');
		check(est({ betterment: 800000, plan: 'mamad', share: 50, mamadBeyond: 100000 }).levy === 25000, 'mamad beyond: by the owner\'s share');
		check(!est({ betterment: 800000, plan: 'mamad', mamadBeyond: 900000 }).ok, 'mamad beyond cannot exceed the betterment');
		check(est({ betterment: 800000, plan: 'tama38', tamaBeyond: 100000 }).flags.some((f) => f.code === 'tama_local'), 's.19(ב2)(1): TAMA 38 beyond 2.5 floors carries the local-reduction warning');
		check(!est({ betterment: 800000, plan: 'tama38', tamaBeyond: 0 }).flags.some((f) => f.code === 'tama_local'), 'TAMA 38 with nothing beyond: no local warning');
		check(est({ betterment: 800000, plan: 'seismic' }).flags.some((f) => f.code === 'seismic_local'), 's.19(ב2)(1): seismic plans carry the local-reduction warning');
	}
	check(est({ betterment: 800000, plan: 'tama38', tamaBeyond: 100000 }).levy === 25000, 's.19(ב)(10)(א): TAMA 38 exempt except a quarter beyond 2.5 floors');
	const home = est({ betterment: 600000, plan: 'regular', event: 'permit', ownHome: true, areaBefore: 100, areaAfter: 160 });
	check(home.levy === 300000 && home.due === 100000 && home.deferred === 200000, 's.19(ג)(1): 100 -> 160 m2, only the 20 m2 above 140 pays now (1/3 of 300,000)');
	check(est({ betterment: 600000, event: 'permit', ownHome: true, areaBefore: 90, areaAfter: 135 }).due === 0, 'a home of 135 m2 after the work: nothing to pay at the permit');
	const a = HB.compute(reg, { mode: 'assessment', levy: 84000, received: '2026-10-01', mine: 52000 });
	check(a.ok && a.appealBy === '2026-11-15' && a.recheck && a.saving === 32000 && a.routes.length === 3, 's.14(א)/(ב)/(ב1): 45 days to 15.11.2026, three routes under 90,000, saving 32,000');
	check(HB.compute(reg, { mode: 'assessment', levy: 95000, received: '2026-10-01' }).routes.length === 2, 'above 90,000: no re-examination route');
	check(HB.compute(reg, { mode: 'assessment', levy: 95000, received: '2026-10-01', kind: 'schedule' }).appealBy === '2027-10-01', 'a valuation schedule: a year to appeal');
	check(!est({ betterment: 0 }).ok && !est({ betterment: 100, share: 120 }).ok, 'zero betterment and a share over 100% are input errors');
	const hs = HBUI.snapshot(reg);
	check(hs.result.includes('jt8-strip') && hs.assessment.result.includes('15.11.2026'), 'betterment snapshot: the plan strip, and the assessment example deadline');
}

if (failures) {
	console.error(`justice tools engines: ${failures} failure(s), ${passed} passed`);
	process.exit(1);
}
console.log(`justice tools engines: ok (${passed} checks)`);
