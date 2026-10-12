/**
 * Golden tests for the co.il tools engines (HAD-485). Run: node tests/js/test-justice-tools.mjs
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
import { encodeState, decodeState, decodeList, parseMoney, csv, ics, isStale } from '../../assets/js/tools/instrument.js';

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

if (failures) {
	console.error(`justice tools engines: ${failures} failure(s), ${passed} passed`);
	process.exit(1);
}
console.log(`justice tools engines: ok (${passed} checks)`);
