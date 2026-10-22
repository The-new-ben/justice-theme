/**
 * Golden tests for the reserve-duty instrument (tagmulei-miluim, rights guide wave 2B, 21.10.2026).
 * Run: node tests/js/test-rights-miluim.mjs
 *
 * By hand, from chapter 12 of the National Insurance Law, the Institute's reserve-service pages, the Discharged Soldiers
 * (Return to Work) Law, the extension order of 29.4.2026 and the IDF's 2026 policy (rights_miluim, rights_btl, rights_tax):
 * the income of the 3 months before the 1st of the start month / 90 (s.273(א)(1)), each month at least 68% of basic amount 3
 * = 7,059.76 (s.273(א)(2)); at least 10,382 x 95% / 30 = 328.76 and at most 10,382 x 5 / 30 = 1,730.33 a day (s.270);
 * every week paid as 7 days, a remainder of 6 as 7, a smaller one x 1.4 (s.271(א)); the self-employed 25% on top, together at
 * most the maximum; no dismissal in the service, 30 days after a service of more than 2 days (s.41א(ב)), days 31 to 60 after
 * 60 cumulative days and 7 in a row (the order, s.5, from 29.4.2026).
 * The example: an employee, 15,000 a month, served 1.11.2026 to 30.11.2026: 45,000 / 90 = 500; 30 days = 4 weeks + 2 ->
 * 28 + 2.8 = 30.8 days paid; 500 x 30.8 = 15,400; the employer pays and is refunded; protected to 30.12.2026.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ME from '../../assets/js/tools/miluim-engine.js';
import * as MU from '../../assets/js/tools/miluim-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const ml = reg.rights_miluim;
const btl = reg.rights_btl;
const EX = MU.EXAMPLE;
const run = (over) => ME.compute(reg, Object.assign({}, EX, over));
const codes = (r) => r.flags.map((f) => f.code);
const errs = (over) => { const r = run(over); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
// The unofficial portal's name, built from char codes so the name itself is never written in the repo (contract rule).
const PORTAL_HE = String.fromCharCode(0x05db, 0x05dc, 0x20, 0x05d6, 0x05db, 0x05d5, 0x05ea);
const PORTAL_EN = String.fromCharCode(0x6b, 0x6f, 0x6c, 0x7a, 0x63, 0x68, 0x75, 0x74);
const noPortal = (s) => !s.toLowerCase().includes(PORTAL_EN) && !s.includes(PORTAL_HE);

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
const paths = [
	'pay.max_daily', 'pay.min_daily', 'pay.max_month', 'pay.min_month', 'pay.max_mult', 'pay.min_pct', 'pay.divisor_month', 'pay.quarter_months',
	'pay.quarter_divisor', 'pay.long_months', 'pay.short_days', 'pay.month_floor_pct', 'pay.basic_key', 'addition.week', 'addition.factor', 'addition.six',
	'addition.six_paid', 'addition.table', 'self.comp_pct', 'self.auto_weeks', 'stopped.days', 'drag.days', 'emergency.gap_days', 'emergency.raise_pct',
	'emergency.raise_months', 'payer.employer_days', 'claim.deadline_months', 'protect.after_days', 'protect.after_min_days', 'protect.remedy.avg_mult',
	'protect.remedy.wage_mult', 'protect.appeal.days', 'protect.order.min_days', 'protect.order.consecutive', 'protect.order.ext_from_day',
	'protect.order.ext_to_day', 'protect.order.clause_from', 'protect.order.from', 'protect.order.spouse_days', 'grants.year', 'grants.old8.from',
	'grants.special.rates', 'grants.special.from_day', 'grants.special.paid_on', 'grants.personal.rates', 'grants.personal.min_days', 'grants.family.rates',
	'grants.household.amounts', 'grants.special_family.amount', 'grants.voucher.rows', 'grants.wallet.tiers', 'grants.additional_2025.bands', 'tax.tiers', 'history',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(ml, p) !== undefined && get(ml, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(ml, p) === undefined || get(ml, p) === null).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(ml, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(ml.source_url.startsWith('https://www.btl.gov.il/') && ml.law_url.startsWith('https://www.btl.gov.il/Laws1/') && ml.protect.law_url.startsWith('https://www.nevo.co.il/') && urls.length >= 30 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|forms\.btl\.gov\.il|www\.gov\.il|www\.nevo\.co\.il|www\.miluim\.idf\.il|api\.miluim\.idf\.il)\//.test(u)), `registry: every url is an official https source (${urls.length} urls)`);
check(['pay', 'addition', 'half_day', 'self', 'stopped', 'drag', 'emergency', 'payer', 'claim', 'unemployment', 'deductions', 'protect', 'grants', 'tax'].every((k) => typeof ml[k].url === 'string' || typeof ml[k].law_url === 'string'), 'registry: every rule block carries its own source url');
check(noPortal(JSON.stringify(ml)), 'registry: no unofficial portal anywhere');
check(ml.checked_on === '2026-10-21' && ml.from === '2026-01-01' && ml.next_update === '2027-01-01' && reg.rights_tax.points.reservist.section === 'סעיף 39ב', 'registry: checked 21.10.2026, figures from 1.1.2026, next update 1.1.2027; the credit points come from rights_tax (s.39ב)');
const b3 = btl.basic_amount.b3;
check(b3 === 10382 && b3 * 5 === ml.pay.max_month && Math.round(b3 * 5 / 30 * 100) / 100 === ml.pay.max_daily && Math.round(b3 * 0.95) === ml.pay.min_month && Math.round(b3 * 0.95 / 30 * 100) / 100 === ml.pay.min_daily, 'limits: 10,382 x 5 = 51,910 / 30 = 1,730.33; 10,382 x 95% = 9,862.90 -> 9,863 / 30 = 328.76 (s.270), consistent with rights_btl b3');
check(ml.addition.table.filter(([d, paid]) => ME.paidDays(ml, d).paid !== paid).map(([d]) => d).join(',') === '120' && ME.paidDays(ml, 120).paid === 120.4, 's.271(א): the Institute\'s own table (7 -> 7, 20 -> 21, 22 -> 22.4, 33 -> 35, 60 -> 61.6, 75 -> 77, 160 -> 161 ...) is reproduced row for row; its row 120 -> 122 breaks its own rule: 120 = 17 x 7 + 1 -> 119 + 1.4 = 120.4 by the law (notes.md)');
check(ME.monthFloor(reg) === 7059.76, 's.273(א)(2): each month at least 68% x 10,382 = 7,059.76');

/* ---------- 2. The example ---------- */
const ex = ME.compute(reg, EX);
check(ex.ok && ex.base.sum === 45000 && ex.base.daily === 500 && ex.daily === 500 && !ex.atMin && !ex.atMax && ex.months.slice(3).join(',') === '2026-08,2026-09,2026-10', 'example: August to October 2026, 15,000 x 3 = 45,000 / 90 = 500 a day (s.273(א)(1))');
check(ex.days === 30 && ex.pd.weeks === 4 && ex.pd.rem === 2 && ex.pd.paid === 30.8 && ex.pd.add === 0.8 && ex.reward === 15400 && ex.total === 15400 && ex.comp === 0, 'example: 30 days = 4 x 7 + 2; 28 + 2 x 1.4 = 30.8 days paid; 500 x 30.8 = 15,400 (s.271(א))');
check(ex.payer === 'employer' && ex.monthly === 15000 && codes(ex).includes('diff'), 'example: a monthly wage: the employer pays and the Institute refunds (s.276(א), s.280); 500 x 30 = 15,000 a month');
check(ex.after && ex.p30.from === '2026-12-01' && ex.p30.to === '2026-12-30' && ex.ext === 'no' && ex.protectEnd === '2026-12-30' && ex.windows.length === 2, 'example: no dismissal in the service, and 30 days after it, 1.12 to 30.12.2026 (s.41א(ב)); 30 cumulative days: no days 31 to 60');
check(ex.deadlines.map((d) => `${d.key}:${d.date}`).join(' ') === 'after:2026-12-30', 'example dates: only the end of the protection (the employer claims, so no claim deadline of the reservist)');
check(ex.n26 === 30 && ex.grants.length === 6 && ex.grants.map((g) => g.other).join(',') === '1350,1200,900,0,0,0' && ex.grants.every((g) => g.cash === 0), 'example grants, tier unknown: 30 days of 2026: only the digital wallet, 45 / 40 / 30 x 30 = 1,350 / 1,200 / 900 for tiers א\'+ / א\' / ב\'');
check(ex.points === 0.5 && ex.taxYear === 2027 && ex.taxOk === null && ex.spouse === 0 && ex.remedy.avg5 === 67830 && ex.remedy.higher === 75000, 'example: 30 days -> 0.5 credit point in 2027 (s.39ב, tier to check); 5 x 13,566 = 67,830 vs 5 x 15,000 = 75,000: the higher (s.21(ג)(2))');
check(ex.strip.length === 2 && ex.strip[0].cells.filter((c) => c.k === 'svc').length === 30 && ex.strip[1].cells.filter((c) => c.k === 'after').length === 30 && ex.strip[1].cells.find((c) => c.stop).d === '2026-12-30', 'example calendar: November, 30 service cells; December, 30 protection cells, the last one marked 30.12');

/* ---------- 3. The ceiling: exactly at, one shekel above; the floor ---------- */
const at = run({ wage: 51910 });
const above = run({ wage: 51911 });
check(at.raw === 1730.33 && at.daily === 1730.33 && !at.atMax && at.total === 53294.16, 'exactly at: 51,910 x 3 = 155,730 / 90 = 1,730.33, not capped; x 30.8 = 53,294.16');
check(above.raw === 1730.37 && above.daily === 1730.33 && above.atMax && above.total === 53294.16 && codes(above).includes('max'), 'one shekel above: 51,911 x 3 = 155,733 / 90 = 1,730.37 -> paid 1,730.33 (s.270)');
const low = run({ wage: 8000 });
check(low.raw === 266.67 && low.daily === 328.76 && low.atMin && low.total === 10125.81 && codes(low).includes('min'), 'below the floor: 8,000 x 3 / 90 = 266.67 -> the minimum 328.76; x 30.8 = 10,125.81');
check(run({ wage: 9862.8 }).daily === 328.76 && !run({ wage: 9862.8 }).atMin && run({ wage: 9862.6 }).raw === 328.75 && run({ wage: 9862.6 }).atMin, 'exactly at the minimum: 9,862.80 x 3 / 90 = 328.76, not below it; 9,862.60 -> 328.753 -> 328.75, raised to 328.76');
const fl = run({ wageMode: 'each', wages: [15000, 15000, 15000, 15000, 15000, 0] });
check(fl.base.sum === 37059.76 && fl.base.daily === 411.78 && codes(fl).includes('floor'), 'a month without income counts 7,059.76: 15,000 + 15,000 + 7,059.76 = 37,059.76 / 90 = 411.78 (s.273(א)(2))');

/* ---------- 4. Self-employed, student, not working ---------- */
const se = run({ status: 'self', wage: 12000, end: '2026-12-15' });
check(se.ok && se.days === 45 && se.pd.paid === 46.2 && se.daily === 400 && se.reward === 18480 && se.compDaily === 100 && se.comp === 4620 && se.total === 23100 && se.payer === 'self', 'self-employed, 45 days: 6 x 7 + 3 -> 42 + 4.2 = 46.2; 12,000 x 3 / 90 = 400; 400 x 46.2 = 18,480 + 25% (100 x 46.2 = 4,620) = 23,100');
check(se.deadlines.map((d) => `${d.key}:${d.date}`).join(' ') === 'self_wait:2027-01-05 after:2027-01-14 claim:2027-11-01', 'self-employed dates: 3 weeks after 15.12.2026 = 5.1.2027 (form 502 if not paid), protection to 14.1.2027, the claim by 1.11.2027 (s.296(א))');
const seMax = run({ status: 'self', wage: 50000 });
check(seMax.daily === 1666.67 && seMax.compDaily === 63.66 && Math.round((seMax.daily + seMax.compDaily) * 100) / 100 === 1730.33, 'self-employed near the top: 1,666.67 + 25% (416.67) is capped: 63.66, together 1,730.33');
const seLow = run({ status: 'self', wage: 5000 });
check(seLow.daily === 328.76 && seLow.compDaily === 82.19, 'self-employed below the minimum: the reward 328.76, the compensation 25% of the minimum = 82.19');
const st = run({ status: 'student', wage: '', end: '2026-11-20' });
check(st.ok && st.days === 20 && st.pd.paid === 21 && st.daily === 328.76 && st.total === 6903.96 && st.payer === 'institute' && codes(st).includes('min_status'), 'student, 20 days: 2 x 7 + 6 -> 14 + 7 = 21; 328.76 x 21 = 6,903.96; the Institute pays');
const no = run({ status: 'none', wage: '', end: '2026-11-10' });
check(no.ok && no.pd.paid === 11.2 && no.total === 3682.11 && codes(no).includes('unemployment') && no.deadlines.some((d) => d.key === 'claim' && d.date === '2027-11-01'), 'not working, 10 days: 7 + 3 x 1.4 = 11.2; 328.76 x 11.2 = 3,682.11; the claim by 1.11.2027');
const sp = run({ status: 'none', stopped: true, wage: 15000 });
check(sp.needsIncome && sp.daily === 500 && sp.total === 15400 && codes(sp).includes('stopped'), 'stopped working less than 60 days before: the 3 months before stopping, 500 a day (s.274(א))');
const cl = run({ employerPays: false });
check(cl.payer === 'claim' && cl.deadlines.some((d) => d.key === 'claim') && MU.checklist(reg, cl).some((x) => x.he.includes('502')), 'an hourly employee with fewer than 75 days: the Institute pays on a personal claim, form 502 (s.276(ב))');

/* ---------- 5. Two days vs three; across months; the extended protection ---------- */
const two = run({ end: '2026-11-02' });
const three = run({ end: '2026-11-03' });
check(two.days === 2 && two.pd.paid === 2.8 && !two.after && two.p30 === null && two.protectEnd === '2026-11-02' && two.windows.length === 1 && codes(two).includes('short'), 'exactly 2 days: 2.8 days paid; protected only in the service (s.41א(ב) needs more than 2 consecutive days)');
check(three.days === 3 && three.pd.paid === 4.2 && three.after && three.p30.to === '2026-12-03' && three.protectEnd === '2026-12-03', '3 consecutive days: 4.2 days paid; protected 30 days after, to 3.12.2026');
const ac = run({ start: '2026-03-25', end: '2026-04-10' });
check(ac.days === 17 && ac.pd.paid === 18.2 && ac.months.slice(3).join(',') === '2025-12,2026-01,2026-02' && ac.byMonth.map((m) => `${m.ym}:${m.days}`).join(' ') === '2026-03:7 2026-04:10' && ac.total === 9100 && ac.p30.to === '2026-05-10', 'across months, 25.3 to 10.4.2026: 17 days -> 14 + 3 x 1.4 = 18.2; the basis is December to February (the start month); 500 x 18.2 = 9,100; protection to 10.5.2026');
const ext = run({ prior: 40 });
check(ext.cum === 70 && ext.ext === 'ok' && ext.extFrom === '2026-12-31' && ext.extTo === '2027-01-29' && ext.protectEnd === '2027-01-29' && ext.windows.map((w) => w.key).join(',') === 'during,after,ext' && ext.deadlines.some((d) => d.key === 'ext' && d.date === '2027-01-29'), '40 earlier days + 30 = 70 cumulative, 30 in a row: days 31 to 60 protected, 31.12.2026 to 29.1.2027 (the order, s.5)');
const chk = run({ prior: 58, end: '2026-11-05' });
check(chk.cum === 63 && chk.ext === 'check' && codes(chk).includes('ext_check'), '58 earlier days + a 5-day service: 63 cumulative but fewer than 7 in a row here: the extension needs a check');
const old = run({ start: '2026-01-10', end: '2026-01-31', prior: 40 });
check(old.ext === 'old' && codes(old).includes('ext_old') && old.p30.to === '2026-03-02', 'a service that ended 31.1.2026: day 60 (1.4.2026) falls before 29.4.2026, when s.5 of the order took effect');
check(ME.spouseDays(ml, 30) === 0 && ME.spouseDays(ml, 31) === 2 && ME.spouseDays(ml, 70) === 4 && ME.spouseDays(ml, 120) === 6 && ME.spouseDays(ml, 121) === 8, 'the partner\'s paid absence days by cumulative days: up to 30 none, 31-60 two, 61-90 four, 91-120 six, 121 and up eight (s.12.1 of the order)');

/* ---------- 6. A further service: s.279(א) and, in an emergency, s.274ב ---------- */
const em = (prevWage) => run({ emergency: true, prevEnd: '2026-09-15', prevWage });
check(em(10000).rule === '274b' && em(10000).gapMonth === 47 && em(10000).prevDaily === 333.33 && em(10000).raw === 400 && em(10000).total === 12320 && em(10000).claimTotal === 15400 && codes(em(10000)).includes('emergency'), 'emergency, 47 days to 1.11: previous 10,000 -> 333.33; now 500, more than 20% above: 333.33 x 1.2 = 400 -> 12,320; 15,400 with the difference claim (the Institute\'s own example: 15,000 vs 10,000 -> 12,000)');
check(em(18000).raw === 600 && em(18000).sub === 'down' && em(18000).total === 18480 && em(13000).raw === 500 && em(13000).sub === 'up', 'emergency: income went down (18,000 before): by the previous 600 -> 18,480; up by less than 20% (13,000 before, 520 top): by the current 500');
const far = run({ emergency: true, prevEnd: '2026-08-01', prevWage: 18000 });
check(far.rule === 'base' && far.gapMonth === 92 && far.daily === 500 && codes(far).includes('emergency_gap'), 'emergency, 92 days to 1.11: the ordinary rule, 500');
check(run({ prevEnd: '2026-10-01', prevWage: 18000 }).rule === '279' && run({ prevEnd: '2026-10-01', prevWage: 18000 }).raw === 600 && run({ prevEnd: '2026-08-01', prevWage: 18000 }).rule === 'base' && run({ prevEnd: '2026-10-01', prevWage: 12000 }).raw === 500, 'no emergency: 31 days after the previous service, its basis if higher (600; with 12,000 before, 500 stays); 92 days: the ordinary rule (s.279(א))');
check(codes(run({ status: 'self', wage: 12000, emergency: true, prevEnd: '2026-09-15', prevWage: 10000 })).includes('emergency_self'), 'emergency rule is for employees and those not working: a self-employed person is told to ask the Institute');
const b3m = run({ wageMode: 'each', wages: [20000, 20000, 20000, 0, 5000, 5000], short60: true });
check(b3m.base.kind === 'best3' && b3m.base.picked.join(',') === '0,1,2' && b3m.daily === 666.67 && run({ wageMode: 'each', wages: [20000, 20000, 20000, 0, 5000, 5000] }).daily === 328.76, 'fewer than 60 days worked: the best 3 of 6 months, 60,000 / 90 = 666.67 (s.273(ב)); without it: 7,059.76 + 5,000 + 5,000... floored -> the minimum');

/* ---------- 7. The IDF's 2026 grants ---------- */
const cb = run({ wage: 20000, prior: 40, tier: 'ap', kid14: true });
const line = (r, k) => r.grants[0].lines.find((x) => x.key === k);
check(cb.daily === 666.67 && cb.total === 20533.44 && cb.n26 === 70, 'combat profile: 20,000 x 3 / 90 = 666.67 x 30.8 = 20,533.44; 70 days in 2026');
check(line(cb, 'special').amount === 1330 && line(cb, 'personal').amount === 1840 && line(cb, 'personal').low === 1380 && line(cb, 'family').amount === 2490 && line(cb, 'household').amount === 1250, 'tier א\'+, 70 days: special 10 x 133 = 1,330; personal 40 x 46 = 1,840 (from day 41: 30 x 46 = 1,380); family 30 x 83 = 2,490; household 1,250');
check(line(cb, 'voucher').amount === 4500 && line(cb, 'wallet').amount === 4900 && cb.grants[0].cash === 6910 && cb.grants[0].cashLow === 6450 && cb.grants[0].other === 9400, 'voucher with a child: 3,375 + 75 x 15 = 4,500 (the maximum); wallet 45 x 30 + 120 x 15 + 70 x 25 = 4,900; cash 6,910 (or 6,450), vouchers 9,400');
check(cb.deadlines.some((d) => d.key === 'special' && d.date === '2027-05-01') && cb.points === 2 && cb.taxOk === true && cb.spouse === 4, 'the special payment is paid 1.5.2027; 70 days -> 1 + 4 x 0.25 = 2 credit points in 2027 (tier א\'+ qualifies); the partner 4 days');
const o8 = ME.grantsFor(ml, 'a', 30, 50, false, false);
check(o8.lines.find((x) => x.key === 'special').amount === 2260 && o8.lines.find((x) => x.key === 'personal').amount === 1170, 'with 50 צו 8 days before: special from the 11th day of 2026 (20 x 113 = 2,260); personal every day (30 x 39 = 1,170)');
check(ME.grantsFor(ml, 'ap', 39, 0, false, false).lines.find((x) => x.key === 'personal').amount === 0 && ME.grantsFor(ml, 'ap', 40, 0, false, false).lines.find((x) => x.key === 'personal').amount === 460 && ME.grantsFor(ml, 'ap', 40, 0, false, false).lines.find((x) => x.key === 'personal').low === 0, 'the 40-day edge: 39 days nothing, not even partly; 40 days: 10 x 46 = 460 (from day 31), or none from day 41');
const vb = ME.grantsFor(ml, 'b', 50, 0, false, false).lines.find((x) => x.key === 'voucher');
check(vb.amount === 1900 && vb.approx && ME.grantsFor(ml, 'b', 44, 0, false, false).lines.find((x) => x.key === 'voucher').amount === 0, 'voucher, tier ב\', 50 days: 1,700 + about 40 x 5 = 1,900 (approximate); 44 days: none');
check(ME.walletFor(ml.grants.wallet.tiers.ap, 100) === 5000 && ME.walletFor(ml.grants.wallet.tiers.b, 10) === 300 && ME.grantsFor(ml, 'c', 100, 0, false, false).lines.find((x) => x.key === 'wallet').amount === 0, 'wallet: א\'+ 100 days 7,000 capped at 5,000; ב\' 10 days 300; ג\' none');
check(ME.grantsFor(ml, 'd', 45, 0, false, true).lines.find((x) => x.key === 'special_family').amount === 2000 && ME.grantsFor(ml, 'd', 45, 0, false, false).lines.find((x) => x.key === 'special_family').amount === 0 && ME.grantsFor(ml, 'd', 45, 0, false, false).lines.find((x) => x.key === 'household').amount === 0, 'special family 2,000 at 45 days only for that parent; no household grant in tier ד\'');
check(run({ start: '2025-11-01', end: '2025-11-30' }).n26 === 0 && run({ start: '2025-11-01', end: '2025-11-30' }).grants.length === 0 && codes(run({ start: '2025-11-01', end: '2025-11-30' })).includes('grants_year') && codes(run({ start: '2025-11-01', end: '2025-11-30' })).includes('other_year'), 'a service in 2025: no 2026 grants computed, and the 2026 pay limits are flagged');
check(ME.reservistPoints(reg.rights_tax, 2027, 29) === 0 && ME.reservistPoints(reg.rights_tax, 2027, 40) === 0.75 && ME.reservistPoints(reg.rights_tax, 2027, 55) === 1.25 && ME.reservistPoints(reg.rights_tax, 2028, 100) === 0 && ME.reservistPoints(reg.rights_tax, 2027, 300) === 4, 'credit points (rights_tax): 29 days none, 40 three quarters, 55 one and a quarter, at most 4; 2028 not in the temporary years');

/* ---------- 8. Input errors ---------- */
check(errs({ status: 'x' }) === 'status' && errs({ start: '31.2.2026' }) === 'start' && errs({ end: '' }) === 'end' && errs({ end: '2026-10-01' }) === 'end' && errs({ end: '2027-12-01' }) === 'end', 'status, a real start, an end, the end not before the start, at most 366 days');
check(errs({ wage: 0 }) === 'wage' && errs({ wage: '' }) === 'wage' && errs({ wageMode: 'each', wages: [1, 2, '', 4, 5, 6] }) === 'w2' && errs({ wageMode: 'each', wages: [5, 5, 5, 0, 0, 0] }) === 'w5' && errs({ status: 'student', wage: '' }) === '', 'income: a positive amount; every month in the six-month mode; not all zero in the quarter; none asked of a student');
check(errs({ prior: 400 }) === 'prior' && errs({ old8: 900 }) === 'old8' && errs({ prevEnd: '2026-12-01' }) === 'pe' && errs({ prevEnd: 'x' }) === 'pe' && errs({ prevWage: -1 }) === 'pw', 'earlier days 0-365, צו 8 days at most 817, the previous end before the start, the previous income positive');
check(errs({ status: 'x', end: '', wage: -5 }) === 'status,end', 'every error reported at once, with its field');
check(MU.renderResult(reg, run({ wage: 0 })).includes('צריך לתקן את הקלט') && MU.renderDetails(reg, run({ wage: 0 })) === '', 'the error state renders, details stay empty');

/* ---------- 9. The snapshot ---------- */
const snap = MU.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'tagmulei-miluim' && snap.registry_version === reg.registry_version && snap.total === 15400 && snap.sticky.includes('15,400') && snap.sentence === MU.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 15,400, the sticky, the sentence, the input');
check(snap.form.includes('name="jt51-st" value="employee" checked') && snap.form.includes('value="15,000"') && snap.form.includes('value="1.11.2026"') && snap.form.includes('value="30.11.2026"') && (snap.form.match(/data-profile="/g) || []).length === 5 && snap.form.includes('data-profile="emp" aria-pressed="true"'), 'the form: pre-filled with the example, five one-click profiles, the example\'s pressed');
check(snap.result.includes('דוגמה מחושבת') && snap.result.includes('15,400') && snap.result.includes('30.12.2026') && snap.result.includes('jt51-gauge__line--min') && snap.result.includes('jt51-gauge__line--max') && (snap.result.match(/jt51-c--svc/g) || []).length === 31 && (snap.result.match(/class="jt51-m"/g) || []).length === 2, 'the result: the example label, 15,400, the protection end; the slip with floor and ceiling lines; the calendar, 30 service cells (and the legend), 2 months');
check(snap.result.includes('data-act="rehearse"') && snap.result.includes('href="#jtool-tagmulei-miluim-next"') && (snap.result.match(/<li><a href=/g) || []).length === 4 && snap.result.includes('/hearing-before-dismissal/') && snap.result.includes(ml.grants.url), 'the result ends with the rehearse reason and four next steps (the official page, the IDF grants, an instrument, the guide)');
check(snap.details.includes('45,000 ÷ 90') && snap.details.includes('1,730.33') && snap.details.includes('328.76') && snap.details.includes('data-act="ics"') && snap.details.includes('data-act="copy-list"') && snap.details.includes('67,830') && snap.details.includes('מה השתנה ומתי') && snap.details.includes('29.4.2026'), 'the details: the basis, both limits, the .ics and checklist buttons, the 67,830 minimum compensation, what changed (the 29.4.2026 order)');
check(snap.method.startsWith('<ol>') && ['סעיף 273(א)(1)', 'סעיף 270', 'סעיף 271(א)', 'סעיף 276(א)', 'סעיף 41א(ב)', 'סעיף 5 לצו', 'סעיף 39ב'].every((s) => snap.method.includes(s)) && snap.method.includes('45,000 ÷ 90 = 500.00') && snap.method.includes('500.00 × 30.8 = 15,400.00') && snap.method.includes('10,382 × 5 ÷ 30 = 1,730.33'), 'the method: every section on the path, and the arithmetic');
check((snap.compare_table.match(/<caption>/g) || []).length === 3 && snap.compare_table.includes('53,294.16') && snap.compare_table.includes('(מקסימום)') && snap.compare_table.includes('(מינימום)') && snap.compare_table.includes('61.6') && snap.compare_table.includes('6,910') === false && snap.compare_table.includes('1,350'), 'the page tables: by income (51,910 at the maximum: 53,294.16), the 40% addition (60 -> 61.6), the grants by tier');
check(all.split('jtool-cite').length > 30 && all.includes(ml.law_url) && all.includes(ml.protect.law_url) && all.includes(ml.protect.order.url) && all.includes(ml.pages.amount), 'cites throughout: chapter 12, the Discharged Soldiers Law, the order, the Institute\'s amount page');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence];
[se, seMax, st, no, sp, cl, two, three, ac, ext, chk, old, em(10000), em(18000), far, b3m, cb, fl, above, low, run({ wage: 0 }), run({ start: '2025-11-01', end: '2025-11-30' }), run({ tier: 'e', kid14: true, special: true, old8: 100 })].forEach((r) => { renders.push(MU.renderResult(reg, r), MU.renderDetails(reg, r), MU.verdictSentence(reg, r)); });
Object.values(MU.PROFILES).forEach((p) => renders.push(MU.renderForm(reg, p.input)));
renders.push(MU.renderForm(reg, { start: '', end: '' }), MU.renderForm(reg, Object.assign({}, EX, { wageMode: 'each', status: 'none', stopped: true, emergency: true })));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null/.test(joined), 'no undefined / NaN / null in any rendered string (example, self, student, not working, stopped, claim, 2 and 3 days, across months, extended, check, old, emergency, drag, best 3, grants, errors)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');
check(noPortal(joined), 'no unofficial portal in any rendered string');

/* ---------- 10. The share state, the .ics, the checklist, the profiles ---------- */
check(MU.stateOf(EX) === 'ke/w15000/s2026-11-01/e2026-11-30' && JSON.stringify(MU.inputOf(decodeState(`#s=${MU.stateOf(EX)}`, MU.KEYS))) === JSON.stringify(EX), 'the example round-trips exactly, as a short readable state');
const full = { status: 'employee', wageMode: 'each', wage: '', wages: [9000, 9500, 10000, 11000, 0, 12000], employerPays: false, short60: true, stopped: false, start: '2026-03-25', end: '2026-04-10', prior: 12, emergency: true, prevEnd: '2026-02-01', prevWage: 8000, tier: 'b', old8: 61, kid14: true, special: true };
check(JSON.stringify(MU.inputOf(decodeState(`#s=${MU.stateOf(full)}`, MU.KEYS))) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns the same answers: six months, the payer, the emergency, the previous service, the tier and the family');
check(!/[֐-׿]/.test(MU.stateOf(full)) && /^[0-9A-Za-z._~/-]+$/.test(MU.stateOf(full)) && MU.inputOf({}) === null, 'the state carries no Hebrew, no name or ID; an empty hash gives no input');
const cal = ics(cb.deadlines.map((d) => ({ date: d.date, summary: d.he })), '2026-10-21T12:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20261230') && cal.includes('DTSTART;VALUE=DATE:20270129') && cal.includes('DTSTART;VALUE=DATE:20270501') && (cal.match(/BEGIN:VEVENT/g) || []).length === 3, 'the .ics of the combat profile: the 30 days (30.12.2026), day 60 (29.1.2027), the special payment (1.5.2027)');
check(MU.checklist(reg, ex).length === 7 &&MU.checklistText(reg, ex).startsWith('1. ') && MU.checklist(reg, cb).some((x) => x.he.includes('4 ימי היעדרות')) && MU.checklist(reg, cb).some((x) => x.he.includes('2027')) && MU.checklist(reg, st).some((x) => x.he.includes('502')), 'the checklist: 7 steps for the example (3010, the employer, the difference, the protection, legal aid, the 2027 points, the tier); the partner\'s 4 days and the 2027 points for the combat profile; form 502 for a student');
check(Object.entries(MU.PROFILES).map(([k, p]) => `${k}:${ME.compute(reg, p.input).total}`).join(' ') === 'emp:15400 self:23100 student:6903.96 none:3682.11 combat:20533.44', 'the five one-click profiles compute: 15,400 / 23,100 / 6,903.96 / 3,682.11 / 20,533.44');
check(MU.periods(reg, ext).map((s) => `${s.key}:${s.from}-${s.to}`).join(' ') === 'during:2026-11-01-2026-11-30 after:2026-12-01-2026-12-30 ext:2026-12-31-2027-01-29' && MU.TOOL_ID === 'tagmulei-miluim', 'the protection in text: the service, the 30 days, days 31 to 60');
check(ME.byIncome(reg, EX, [8000, 51911]).map((x) => `${x.daily}/${x.total}`).join(' ') === '328.76/10125.81 1730.33/53294.16', 'the income table: 8,000 -> the minimum, 10,125.81; 51,911 -> the maximum, 53,294.16');

/* ---------- 11. The result-first card and the simulation hand-off (the wave-2A bar, HAD-585) ---------- */
check(typeof snap.lead === 'string' && snap.lead.includes('דוגמה מחושבת') && snap.lead.includes('15,400') && snap.lead.includes('<bdi>500</bdi>') && snap.lead.includes('30.8') && snap.lead.includes('30.12.2026') && snap.lead.includes('href="#jtool-tagmulei-miluim"') && snap.lead.includes('data-lead-go') && snap.lead.includes('לחשב לפי הנתונים שלכם'), 'snapshot.lead: the example 15,400 (500 a day, 30.8 days paid), protected to 30.12.2026, the jump to the form');
check(!/<h2[\s>]/.test(snap.lead) && !/undefined|NaN|null/.test(snap.lead) && noPortal(snap.lead) && !/[A-Za-z]{4,}/.test(snap.lead.replace(/<[^>]+>/g, ' ')), 'snapshot.lead: no <h2>, no undefined / NaN / null, no English, no unofficial portal');
check(MU.leadCard(reg, ex).includes('החישוב שלכם') && MU.leadCard(reg, ex).includes('לשנות את הנתונים') && !MU.leadCard(reg, ex).includes('דוגמה מחושבת'), 'the reader\'s own card says so and offers to change the answers');
const badDates = run({ end: '2026-10-01' });
check(!badDates.ok && MU.leadCard(reg, badDates).includes('jtool-lead__figure">—</strong>') && MU.leadCard(reg, badDates).includes(badDates.errors[0].he) && MU.scenarioText(reg, badDates) === '' && !/undefined|NaN|null/.test(MU.leadCard(reg, badDates)), 'an input error: the card shows a dash and the error, and no scenario is written');
const cb2 = ME.compute(reg, MU.PROFILES.combat.input);
check(MU.leadCard(reg, se).includes('23,100') && MU.leadCard(reg, se).includes('4,620') && !MU.leadCard(reg, se).includes('ועדת התעסוקה') && MU.leadCard(reg, st).includes('6,903.96') && MU.leadCard(reg, st).includes('התגמול המזערי') && MU.leadCard(reg, cb2).includes('29.1.2027') && MU.leadCard(reg, cb2).includes('6,450') && MU.leadCard(reg, cb2).includes('6,910') && MU.leadCard(reg, two).includes('בימי השירות עצמם'), 'the card per case: self 23,100 with 4,620 compensation and no committee; student 6,903.96 at the minimum; combat protected to 29.1.2027 with grants 6,450 to 6,910; a 2-day service protected only in the service');
const leadsAll = [ex, se, seMax, st, no, sp, cl, two, three, ac, ext, chk, old, em(10000), em(18000), far, b3m, cb, fl, above, low, badDates].map((r) => MU.leadCard(reg, r) + MU.scenarioText(reg, r)).join('');
check(!/<h2[\s>]/.test(leadsAll) && !/undefined|NaN|null/.test(leadsAll) && noPortal(leadsAll), 'every case: the card and the scenario carry no <h2>, no undefined / NaN / null, no unofficial portal');
const sc = MU.scenarioText(reg, ex);
check(sc.startsWith('תגמולי מילואים') && sc.includes('15,000') && sc.includes('500 ₪ ליום') && sc.includes('30.8') && sc.includes('15,400') && sc.includes('30.12.2026') && sc.includes('ועדת התעסוקה') && sc.includes('המעסיק'), 'the scenario: the income, 500 a day, 30.8 days, 15,400, protected to 30.12.2026, the Employment Committee hearing and the employer talk');
check(MU.scenarioText(reg, se).includes('פקיד התביעות') && !MU.scenarioText(reg, se).includes('ועדת התעסוקה') && MU.scenarioText(reg, cb2).includes('29.1.2027') && MU.scenarioText(reg, cb2).includes('40 ימי מילואים קודמים'), 'self-employed: the claims officer, no committee; the combat profile: days 31 to 60 to 29.1.2027 and the 40 earlier days');
const priv = ME.compute(reg, Object.assign({}, EX, { name: 'ישראלה ישראלי', id: '123456782', phone: '0501234567', employer: 'מפעל הדוגמה' }));
const scP = MU.scenarioText(reg, priv) + MU.leadCard(reg, priv);
check(!scP.includes('ישראלה') && !scP.includes('123456782') && !scP.includes('0501234567') && !scP.includes('מפעל הדוגמה') && !/תעודת זהות|טלפון|כתובת/.test(scP) && scP.includes('15,400'), 'privacy: a name, an ID, a phone or an employer slipped into the input never reach the scenario or the card');
check(MU.renderResult(reg, se).includes('לתרגול השיחה') && MU.renderResult(reg, se).includes('פקיד התביעות') && MU.renderResult(reg, ex).includes('לתרגול הדיון'), 'the rehearse reason fits the result: the claims officer for the self-employed, the committee for an employee');
// The print rules: this instrument's own under its prefix, and no other instrument's print rule hides the shell's result or
// sources on every tool (the jt43 rule did until HAD-585 scoped it to its own tool).
const css = readFileSync(join(ROOT, 'assets/css/justice-tools.css'), 'utf8');
const printBlocks = [];
for (let i = css.indexOf('@media print'); i !== -1; i = css.indexOf('@media print', i + 1)) {
	let depth = 0;
	let j = css.indexOf('{', i);
	const start = j;
	for (; j < css.length; j += 1) { if (css[j] === '{') { depth += 1; } else if (css[j] === '}') { depth -= 1; if (!depth) { break; } } }
	printBlocks.push(css.slice(start + 1, j));
}
const leaks = printBlocks.join('\n').split('}').map((rule) => rule.split('{')).filter((x) => x.length === 2 && /display:\s*none/.test(x[1]))
	.flatMap((x) => x[0].split(',').map((sel) => sel.trim())).filter((sel) => /\.jtool-result\b|\.jtool-sources\b|\.jtool-verdict\b|\.jtool-details\b/.test(sel) && !sel.includes('[data-jtool='));
check(!leaks.length && /@media print \{\s*\.jt51-profiles, \.jt51-why a, \.jt51-next, \.jt51-p-no \{ display: none !important; \}/.test(css) && css.includes('.jtool[data-jtool="yeduim-batzibur"] .jtool-result'), `print: the jt51 rules print the slip and the calendar; no unscoped print rule hides the result or the sources (${leaks.join(' | ')})`);
const noPrint = ['gate', 'gr', 'chk', 'hist'].every((k) => new RegExp(`jtool-tablewrap jt51-p-no"><div class="jtool-tablewrap__head"><h3 id="jt51-${k}-h"`).test(snap.details));
const printed = ['calc', 'per', 'dl'].every((k) => new RegExp(`<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="jt51-${k}-h"`).test(snap.details));
check(noPrint && printed, 'the printed summary (two A4 pages): the calculation, the protection periods and the dates print; the gates, the grants, the checklist and what changed stay on screen');

console.log(`tagmulei-miluim: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
