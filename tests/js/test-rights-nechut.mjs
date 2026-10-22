/**
 * Golden tests for the general-disability-pension instrument (kitzbat-nechut, the rights wave, 21.10.2026).
 * Run: node tests/js/test-rights-nechut.mjs
 *
 * By hand, from chapter 9 of the National Insurance Law and the Institute's 2026 pages (rights_nechut, rights_btl):
 * basic amount 4 = 11,352; the full single pension 25% = 2,838 (s.200(ב)); the full monthly pension 107 + 20.6 + 21.4 + 17 =
 * 166% of it = 4,711.08 -> 4,711 (s.200(א)); a partial degree d: d x 124% + 21.4% of 2,838 (s.201(א)): 74% 3,211.48,
 * 65% 2,894.76, 60% 2,718.80 -> 3,211 / 2,894 / 2,718; a spouse 12.5% x 1.07 = 1,518.33 -> 1,518, a child 10% x 1.07 =
 * 1,214.66 -> 1,214 (s.200(ג)-(ד)). The average wage of section 2 is 13,769: 21% = 2,891.49 (s.201(ב)), 50.23% = 6,916.17,
 * 68% = 9,362.92, 93% = 12,805.17 (schedule 8.1: 0/30/40/60%), 60% = 8,261.40 (s.195), 57% = 7,848.33 (schedule 9),
 * 11.37% = 1,565.54 -> 1,566 (s.202(ב)(3)); nothing below 2.68% x 11,352 = 304.23 is paid (s.202(ג)).
 * The example: 45, medical 60%, degree 74%, a spouse without income, 2 children, 3,000 a month from work (> 2,891.49, so
 * the additions are full): 3,211 + 1,518 + 2 x 1,214 = 7,157 a month; 85,884 a year; with the wage 10,157.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as NE from '../../assets/js/tools/nechut-engine.js';
import * as NU from '../../assets/js/tools/nechut-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const nc = reg.rights_nechut;
const btl = reg.rights_btl;
const EX = NU.EXAMPLE;
const run = (over) => NE.compute(reg, Object.assign({}, EX, over));
const pay = (o) => NE.pensionAt(reg, Object.assign({ spouseDep: false, kids: 0, wage: 0, other: 0, homemaker: false }, o)).pay;
const near = (a, b, e = 0.005) => Math.abs(a - b) < e;

// The Institute's four tables "כמה תוכל להרוויח מעבודה ולהמשיך לקבל קצבה", from 1.1.2026 (WORK_100/74Per/65Per/60Per pages):
// [wage (the lower end of a range), the upper end or 0, the reduction for a single person, then the pension for: single,
// + a child, + 2 children, + a spouse, + a spouse and a child, + a spouse and 2 children].
const TABLES = {
	100: [[6916,0,0,4711,5925,7139,6229,7443,8657],[7000,0,25,4686,5900,7114,6204,7418,8632],[7500,0,175,4536,5750,6964,6054,7268,8482],[8000,0,325,4386,5600,6814,5904,7118,8332],[8500,0,475,4236,5450,6664,5754,6968,8182],[9000,0,625,4086,5300,6514,5604,6818,8032],[9500,0,789,3922,5136,6350,5440,6654,7868],[10000,0,989,3722,4936,6150,5240,6454,7668],[10500,0,1189,3522,4736,5950,5040,6254,7468],[11000,0,1389,3322,4536,5750,4840,6054,7268],[11500,0,1589,3122,4336,5550,4640,5854,7068],[12000,0,1789,2922,4136,5350,4440,5654,6868],[12500,0,1989,2722,3936,5150,4240,5454,6668],[13000,0,2228,2483,3697,4911,4001,5215,6429],[13500,0,2528,2183,3397,4611,3701,4915,6129],[14000,0,2828,1883,3097,4311,3401,4615,5829],[14500,0,3128,1583,2797,4011,3101,4315,5529],[15000,0,3428,1283,2497,3711,2801,4015,5229],[15500,0,3728,983,2197,3411,2501,3715,4929],[16000,0,4028,683,1897,3111,2201,3415,4629],[16500,0,4328,383,1597,2811,1901,3115,4329],[17000,0,4628,0,1297,2511,1601,2815,4029],[17500,0,4928,0,997,2211,1301,2515,3729],[18000,0,5228,0,697,1911,1001,2215,3429],[18500,0,5528,0,397,1611,701,1915,3129],[19000,0,5828,0,0,1311,401,1615,2829],[19500,0,6128,0,0,1011,0,1315,2529],[20000,0,6428,0,0,711,0,1015,2229],[20500,0,6728,0,0,411,0,715,1929],[21000,0,7028,0,0,0,0,415,1629],[21500,0,7328,0,0,0,0,0,1329],[22000,0,7628,0,0,0,0,0,1029],[22500,0,7928,0,0,0,0,0,729],[23000,0,8228,0,0,0,0,0,429],[23500,0,8528,0,0,0,0,0,0]],
	74: [[2891,0,0,3211,4109,5008,4334,5233,6131],[2892,11278,0,3211,4425,5639,4729,5943,7157],[11500,0,89,3122,4336,5550,4640,5854,7068],[12000,0,289,2922,4136,5350,4440,5654,6868],[12500,0,489,2722,3936,5150,4240,5454,6668],[13000,0,728,2483,3697,4911,4001,5215,6429],[13500,0,1028,2183,3397,4611,3701,4915,6129],[14000,0,1328,1883,3097,4311,3401,4615,5829],[14500,0,1628,1583,2797,4011,3101,4315,5529],[15000,0,1928,1283,2497,3711,2801,4015,5229],[15500,0,2228,983,2197,3411,2501,3715,4929],[16000,0,2528,683,1897,3111,2201,3415,4629],[16500,0,2828,383,1597,2811,1901,3115,4329],[17000,0,3128,0,1297,2511,1601,2815,4029],[17500,0,3428,0,997,2211,1301,2515,3729],[18000,0,3728,0,697,1911,1001,2215,3429],[18500,0,4028,0,397,1611,701,1915,3129],[19000,0,4328,0,0,1311,401,1615,2829],[19500,0,4628,0,0,1011,0,1315,2529],[20000,0,4928,0,0,711,0,1015,2229],[20500,0,5228,0,0,411,0,715,1929],[21000,0,5528,0,0,0,0,415,1629],[21500,0,5828,0,0,0,0,0,1329],[22000,0,6128,0,0,0,0,0,1029],[22500,0,6428,0,0,0,0,0,729],[23000,0,6728,0,0,0,0,0,429],[23500,0,7028,0,0,0,0,0,0]],
	65: [[2891,0,0,2894,3683,4472,3881,4670,5459],[2892,12071,0,2894,4108,5322,4412,5626,6840],[12500,0,172,2722,3936,5150,4240,5454,6668],[13000,0,411,2483,3697,4911,4001,5215,6429],[13500,0,711,2183,3397,4611,3701,4915,6129],[14000,0,1011,1883,3097,4311,3401,4615,5829],[14500,0,1311,1583,2797,4011,3101,4315,5529],[15000,0,1611,1283,2497,3711,2801,4015,5229],[15500,0,1911,983,2197,3411,2501,3715,4929],[16000,0,2211,683,1897,3111,2201,3415,4629],[16500,0,2511,383,1597,2811,1901,3115,4329],[17000,0,2811,0,1297,2511,1601,2815,4029],[17500,0,3111,0,997,2211,1301,2515,3729],[18000,0,3411,0,697,1911,1001,2215,3429],[18500,0,3711,0,397,1611,701,1915,3129],[19000,0,4011,0,0,1311,401,1615,2829],[19500,0,4311,0,0,1011,0,1315,2529],[20000,0,4611,0,0,711,0,1015,2229],[20500,0,4911,0,0,411,0,715,1929],[21000,0,5211,0,0,0,0,415,1629],[21500,0,5511,0,0,0,0,0,1329],[22000,0,5811,0,0,0,0,0,1029],[22500,0,6111,0,0,0,0,0,729],[23000,0,6411,0,0,0,0,0,429],[23500,0,6711,0,0,0,0,0,0]],
	60: [[2891,0,0,2718,3446,4175,3629,4357,5086],[2892,12511,0,2718,3932,5146,4236,5450,6664],[13000,0,235,2483,3697,4911,4001,5215,6429],[13500,0,535,2183,3397,4611,3701,4915,6129],[14000,0,835,1883,3097,4311,3401,4615,5829],[14500,0,1135,1583,2797,4011,3101,4315,5529],[15000,0,1435,1283,2497,3711,2801,4015,5229],[15500,0,1735,983,2197,3411,2501,3715,4929],[16000,0,2035,683,1897,3111,2201,3415,4629],[16500,0,2335,383,1597,2811,1901,3115,4329],[17000,0,2635,0,1297,2511,1601,2815,4029],[17500,0,2935,0,997,2211,1301,2515,3729],[18000,0,3235,0,697,1911,1001,2215,3429],[18500,0,3535,0,397,1611,701,1915,3129],[19000,0,3835,0,0,1311,401,1615,2829],[19500,0,4135,0,0,1011,0,1315,2529],[20000,0,4435,0,0,711,0,1015,2229],[20500,0,4735,0,0,411,0,715,1929],[21000,0,5035,0,0,0,0,415,1629],[21500,0,5335,0,0,0,0,0,1329],[22000,0,5635,0,0,0,0,0,1029],[22500,0,5935,0,0,0,0,0,729],[23000,0,6235,0,0,0,0,0,429],[23500,0,6535,0,0,0,0,0,0]],
};

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
const paths = [
	'age.min', 'age.men_max', 'age.women_from', 'age.women_max', 'medical.min', 'medical.alt_min', 'medical.single_min', 'medical.homemaker_min',
	'degree.min_loss', 'degree.levels', 'degree.full_above', 'pension.single_full_pct', 'pension.components', 'pension.amounts', 'dependents.children_max',
	'dependents.spouse_income_pct', 'dependents.spouse_income_max', 'work.new_claim_pct', 'work.new_claim_max', 'work.full_add_pct', 'work.full_add_from',
	'work.tiers', 'work.free_upto', 'work.crossover', 'work.min_pct_of_basic', 'other_income.disregard', 'clock.wait_days', 'clock.early_from_day',
	'clock.early_to_day', 'clock.det_back_months', 'clock.retro_months', 'clock.pay_day', 'appeal.days', 'appeal.court_days', 'appeal.other_court_months',
	'recheck.months', 'changes.days', 'claim.form', 'claim.form_url',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(nc, p) !== undefined && get(nc, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(nc, p) == null).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(nc, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(urls.length >= 30 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|govforms\.gov\.il)\//.test(u)), `registry: every url is an official https source of the Institute (${urls.length} urls)`);
check(['age', 'medical', 'degree', 'pension', 'dependents', 'work', 'other_income', 'clock', 'appeal', 'recheck', 'changes', 'claim'].every((k) => typeof nc[k].url === 'string' && nc[k].url.startsWith('https://')), 'registry: every rule block carries its own source url');
check(nc.law_url === 'https://www.btl.gov.il/Laws1/00_0001_000009.pdf' && nc.general_law_url.endsWith('00_0001_000014.pdf') && nc.schedules_url.endsWith('00_0001_000020.pdf') && !JSON.stringify(nc).includes('72734'), 'registry: the law is cited from the Institute\'s Laws1 PDFs (chapter 9, chapter 14, the schedules), never the dead nevo 72734 page');
check(nc.checked_on === '2026-10-21' && nc.from === '2026-01-01' && nc.next_update === '2027-01-01' && nc.refresh_every_days === 365, 'registry: checked 21.10.2026, figures from 1.1.2026, next update 1.1.2027');
const b4 = btl.basic_amount.b4;
const unit = b4 * nc.pension.single_full_pct / 100;
const sumPct = nc.pension.components.reduce((a, x) => a + x.pct, 0);
check(b4 === 11352 && unit === 2838 && near(sumPct, 166) && Math.floor(unit * sumPct / 100) === nc.pension.amounts['100'].pension && nc.pension.amounts['100'].pension === 4711, 'derivation: 25% x 11,352 = 2,838 (s.200(ב)); 107 + 20.6 + 21.4 + 17 = 166% -> 4,711.08 -> 4,711 (s.200(א)), the Institute\'s figure');
const partial = (d) => Math.floor(unit * (d / 100 * (107 + 17) + 21.4) / 100 + 1e-9);
check(partial(74) === 3211 && partial(65) === 2894 && partial(60) === 2718 && ['74', '65', '60'].every((d) => nc.pension.amounts[d].pension === partial(Number(d))), 'derivation: s.201(א) 74% 3,211.48 / 65% 2,894.76 / 60% 2,718.80 -> 3,211 / 2,894 / 2,718');
check(Math.floor(b4 * 0.125 * 1.07) === 1518 && Math.floor(b4 * 0.1 * 1.07) === 1214 && nc.pension.amounts['74'].child === Math.round(0.74 * 1214) && nc.pension.amounts['65'].spouse === Math.round(0.65 * 1518) && nc.pension.amounts['60'].spouse === 911, 'derivation: spouse 12.5% x 1.07 = 1,518.33, child 10% x 1.07 = 1,214.66 (s.200(ג)-(ד)); 74% child 898, 65% spouse 987, 60% spouse 911');
const th = NE.thresholds(reg);
check(th.avg === 13769 && Math.floor(th.t21) === nc.work.full_add_from && Math.floor(th.tiers[0]) === nc.work.free_upto && Math.floor(th.t60) === nc.work.new_claim_max && Math.floor(th.spouseMax) === nc.dependents.spouse_income_max && Math.round(th.avg * 0.1137) === nc.other_income.disregard && near(th.minPay, 304.2336), 'thresholds from 13,769: 2,891.49 (21%), 6,916.17 (50.23%), 8,261.40 (60%), 7,848.33 (57%), 1,565.54 -> 1,566 (11.37%); minimum 2.68% x 11,352 = 304.23');

/* ---------- 2. Every cell of the Institute's four 2026 tables ---------- */
const fams = [[false, 0], [false, 1], [false, 2], [true, 0], [true, 1], [true, 2]];
let cells = 0;
const misses = [];
for (const [d, rows] of Object.entries(TABLES)) {
	for (const [lo, hi, red, ...want] of rows) {
		for (const w of hi ? [lo, hi] : [lo]) {
			fams.forEach(([sp, k], i) => { cells += 1; const got = pay({ degree: Number(d), spouseDep: sp, kids: k, wage: w }); if (got !== want[i]) { misses.push(`${d}%/${w}/${i}: ${got} vs ${want[i]}`); } });
			if (want[0] > 0 && nc.pension.amounts[d].pension - pay({ degree: Number(d), wage: w }) !== red) { misses.push(`${d}%/${w} reduction`); }
		}
	}
}
check(cells === 684 && !misses.length, `the Institute's tables, 100%/74%/65%/60% x 6 families, every row from "up to 2,891/6,916" to 23,500: ${cells} cells match${misses.length ? `; off: ${misses.slice(0, 5).join('; ')}` : ''}`);
check(['74', '65', '60'].every((d) => Math.ceil(NE.crossoverWage(reg, Number(d))) === nc.work.crossover[d]) && near(NE.crossoverWage(reg, 74), 11277.86, 0.01), 'the flat row "2,892 - X": 9,362.92 + (1,500 - 734.03) / 40% = 11,277.86 -> 11,278 (74%); 12,071 (65%); 12,511 (60%), as published');

/* ---------- 3. The example ---------- */
const ex = NE.compute(reg, EX);
check(ex.ok && ex.eligible && ex.verdict === 'ok' && ex.gates.every((g) => g.state === 'ok') && ex.medVia === 'main', 'example: eligible, every gate passes (45, medical 60%, degree 74%, income 3,000 <= 8,261)');
check(ex.calc.addFull && ex.calc.fullAdd === 3946 && ex.calc.partialAdd === 2920 && ex.calc.own === 7157 && ex.calc.fromFull === 8657 && !ex.calc.laronBinds, 'example: 3,000 > 2,891.49 -> full additions 1,518 + 2 x 1,214 = 3,946 (s.201(ב)), not 74% x 3,946 = 2,920.04 -> 2,920; own 7,157 < 8,657');
check(ex.monthly === 7157 && ex.annual === 85884 && ex.total === 10157 && ex.noWork.pay === 6131, 'example: 3,211 + 3,946 = 7,157 a month; x 12 = 85,884; + 3,000 = 10,157; without work 3,211 + 2,920 = 6,131');
check(ex.keep === 100 && ex.nextKeep.from === 11278 && ex.nextKeep.keep === 60 && ex.end === 23208, 'example: every 100 shekels stay up to 11,278; then 60 of every 100 (40% band); the pension ends at 23,208');
check(pay({ degree: 74, spouseDep: true, kids: 2, wage: 23207 }) === 305 && pay({ degree: 74, spouseDep: true, kids: 2, wage: 23208 }) === 0, 'the end: 8,657 - round(2,110.92 + 10,401.83 x 60% = 8,352.02) = 305 paid; 23,208: 8,657 - 8,353 = 304 < 304.23, not paid (s.202(ג))');
check(ex.ladder.map((x) => `${x.degree}:${x.pay}`).join(' ') === '100:8657 74:7157 65:6840 60:6664' && ex.ladder[1].here, 'the ladder at 3,000 with a spouse and 2 children: 100% 8,657; 74% 7,157; 65% 2,894 + 3,946 = 6,840; 60% 2,718 + 3,946 = 6,664');
check(ex.ledger.map((x) => `${x.w}:${x.pay}`).join(' ') === '0:6131 2891:6131 2892:7157 3000:7157 11278:7157 12805:6546 23207:305 23208:0', 'the ledger: 0, 2,891 (6,131), 2,892 (7,157: +1,026), 3,000, 11,278, 12,805 (8,657 - 2,111 = 6,546), 23,207 (305), 23,208 (0)');
check(ex.clock.start === '2026-05-31' && ex.clock.retroFrom === '2025-06-01' && !ex.clock.lost && ex.appealBy === '2026-11-30', 'example clock: 1.3.2026 + 91 = 31.5.2026 (s.196(ב)); claim June 2026 pays back to 1.6.2025 (s.296(ב)(1)); decision 1.10.2026 + 60 = 30.11.2026');
check(ex.deadlines.map((d) => `${d.key}:${d.date}`).join(' ') === 'det:2026-03-01 start:2026-05-31 claim:2026-06-01 notice:2026-10-01 appeal:2026-11-30 recheck:2027-04-01 other_court:2027-10-01', 'example dates: the determining date, day 91, the claim, the decision, the appeal, the re-check from 6 months, 12 months for other decisions');
check(ex.flags.map((f) => f.code).join(',') === 'full_add,changes', 'example flags: full additions because of the wage; report changes within 30 days');

/* ---------- 4. Each degree, no work, single and with a spouse and 3 children ---------- */
check(['100:4711', '74:3211', '65:2894', '60:2718'].every((x) => { const [d, v] = x.split(':').map(Number); return pay({ degree: d }) === v; }), 'single, no work: 4,711 / 3,211 / 2,894 / 2,718');
const big = run({ degree: 100, spouse: 'dep', kids: 3, wage: 0 });
check(big.monthly === 8657 && run({ degree: 100, spouse: 'none', kids: 0, wage: 0 }).monthly === 4711 && big.flags.some((f) => f.code === 'kids'), 'no dependents 4,711; a spouse and 3 children: 4,711 + 1,518 + 2 x 1,214 = 8,657, the third child not counted');
check(run({ degree: 60, spouse: 'dep', kids: 3, wage: 0 }).monthly === 5086 && run({ degree: 65, spouse: 'earns', kids: 1, wage: 0 }).monthly === 3683, '60%, spouse + 3 children, no work: 2,718 + round(60% x 3,946 = 2,367.6) = 5,086; 65%, an earning spouse, 1 child: 2,894 + 789 = 3,683');

/* ---------- 5. The medical gate ---------- */
const m40 = run({ med: 40, single: 25 });
check(m40.eligible && m40.medVia === 'single' && !run({ med: 40, single: 24 }).eligible && !run({ med: 59.99, single: '' }).eligible && run({ med: 59.99, single: '' }).flags.some((f) => f.code === 'single'), '40% with a 25% impairment passes (s.208(א)); 40% with 24% does not; 59.99% without a single figure does not, and asks for it');
const low = run({ med: 30, single: 20 });
check(!low.eligible && low.verdict === 'no' && low.gates.find((g) => g.key === 'medical').state === 'no' && NU.verdictSentence(reg, low).startsWith('אין זכאות לקצבת נכות כללית') && low.monthly === 0 && low.flags.some((f) => f.code === 'medical'), 'medical 30% below the threshold: not eligible, the reason in the sentence, nothing paid');
check(NE.weightedMedical([20, 10]).total === 28 && NE.weightedMedical([45, 25]).total === 58.75 && NE.weightedMedical([50, 20]).total === 60, 'weighted: 20% + 10% of 80% = 28% (the Institute\'s example); 45% + 25% of 55% = 58.75%; 50% + 20% of 50% = 60%');
check(NE.weightedMedical([45, 25]).rounded === 59 && NE.weightedMedical([20, 10]).rounded === 28 && NE.weightedMedical([25, 19]).rounded === 40, 'reg. 3(ב) of the 1984 regulations (HAD-591): a fraction is rounded up: 58.75% -> 59%, 28% stays, 25% + 19% of 75% = 39.25% -> 40%');
check(run({ medMode: 'list', meds: [25, 19] }).med === 40 && run({ medMode: 'list', meds: [25, 19] }).medVia === 'single', 'list mode: 25% and 19% weigh 39.25%, rounded up to 40%, so the 40% + 25% gate is met (it was missed before the rounding)');
const wl = run({ medMode: 'list', med: '', meds: [45, 25, '', '', '', ''] });
check(wl.eligible && wl.med === 59 && wl.single === 45 && wl.medVia === 'single' && run({ medMode: 'list', meds: [50, 20] }).medVia === 'main', 'list mode: 45% and 25% -> 58.75%, rounded up to 59%, the largest 45% >= 25%: eligible by the 40% rule; 50% and 20% -> 60%');

/* ---------- 6. The homemaker ---------- */
const hm = run({ homemaker: true, med: 50, degree: 100, spouse: 'dep', kids: 2, wage: 5000 });
check(hm.eligible && hm.medVia === 'homemaker' && hm.monthly === 7139 && hm.calc.spouse === false && hm.wage === 0 && hm.flags.some((f) => f.code === 'hm_spouse') && hm.flags.some((f) => f.code === 'hm_wage'), 'homemaker, medical 50%, 100%, 2 children: 4,711 + 2,428 = 7,139, no spouse addition, the wage ignored and flagged');
check(!run({ homemaker: true, med: 49 }).eligible && run({ homemaker: true, med: 50, degree: 74, spouse: 'none', kids: 0 }).monthly === 3211, 'homemaker 49% not eligible; 74% pays the same 3,211');

/* ---------- 7. Wages exactly at each threshold and one shekel above ---------- */
check(pay({ degree: 74, spouseDep: true, kids: 2, wage: 2891 }) === 6131 && pay({ degree: 74, spouseDep: true, kids: 2, wage: 2892 }) === 7157 && run({ wage: 2891 }).flags.some((f) => f.code === 'cliff'), '21%: 2,891 -> 3,211 + 2,920 = 6,131; 2,892 -> 3,211 + 3,946 = 7,157 (s.201(ב)); the cliff note below it');
const L = (w) => NE.laronDeduction(nc, 13769, w);
check(pay({ degree: 100, wage: 6916 }) === 4711 && near(L(6917).exact, 0.25, 0.001) && pay({ degree: 100, wage: 6917 }) === 4711 && pay({ degree: 100, wage: 7000 }) === 4686, '50.23%: 6,916 -> 4,711; 6,917 -> 0.83 x 30% = 0.25 -> 0, still 4,711; 7,000 -> 83.83 x 30% = 25.15 -> 25, 4,686');
check(near(L(9362).exact, 733.75, 0.01) && near(L(9400).exact - L(9399).exact, 0.4, 1e-6) && near(L(9300).exact - L(9299).exact, 0.3, 1e-6) && L(9363).rounded === 734, '68%: 9,362 -> 2,445.83 x 30% = 733.75; under it each shekel takes 0.30, over it 0.40');
check(near(L(12900).exact - L(12899).exact, 0.6, 1e-6) && near(L(12806).exact - L(12805).exact, 0.566, 1e-6) && L(12805).rounded === 2111, '93%: 12,805 -> 734.03 + 1,376.90 = 2,110.93 -> 2,111; above 12,805.17 each shekel takes 0.60');
const n1 = run({ wage: 8261 });
const n2 = run({ wage: 8262 });
check(n1.eligible && !n2.eligible && n2.gates.find((g) => g.key === 'income').state === 'no' && n2.flags.some((f) => f.code === 'income') && run({ wage: 8262, status: 'receiving' }).eligible, 'a new claim: 8,261 <= 8,261.40 passes, 8,262 fails (s.195 "disabled" (3)); already receiving, 8,262 only reduces');
check(pay({ degree: 100, wage: 16631 }) === 305 && pay({ degree: 100, wage: 16632 }) === 0 && run({ status: 'receiving', degree: 100, spouse: 'none', kids: 0, wage: 16632 }).monthly === 0, 'the minimum: 16,631 -> 4,711 - 4,406 = 305 paid; 16,632 -> 4,711 - 4,407 = 304 < 304.23, nothing (s.202(ג))');
const st = run({ status: 'receiving', degree: 100, spouse: 'none', kids: 0, wage: 25000 });
check(st.eligible && st.monthly === 0 && st.flags.some((f) => f.code === 'stopped') && NU.verdictSentence(reg, st).includes('הדרגה נשמרת') && NU.renderResult(reg, st).includes('jtool-state--info'), 'receiving, 25,000: no pension, the degree is protected (s.209(ד)) and the 36-month benefits note');
check(run({ status: 'receiving', degree: 100, spouse: 'none', kids: 0, wage: 9000 }).monthly === 4086 && run({ status: 'receiving', degree: 65, spouse: 'none', kids: 0, wage: 12500 }).monthly === 2722, 'receiving: 100% at 9,000 -> 4,086; 65% at 12,500 -> 4,711 - 1,989 = 2,722 (the Institute\'s rows)');

/* ---------- 8. Other income, age, degree ---------- */
check(run({ degree: 100, spouse: 'dep', kids: 2, wage: 0, other: 3000 }).monthly === 7223 && run({ degree: 100, spouse: 'none', kids: 0, wage: 0, other: 3000 }).monthly === 4711 && run({ homemaker: true, med: 50, degree: 100, spouse: 'none', kids: 2, other: 3000 }).monthly === 4711, 'other income 3,000: 8,657 - (3,000 - 1,566 = 1,434) = 7,223 (s.202(ב)(3)); single stays 4,711; homemaker: the whole 3,000 from the children\'s 2,428, not below 4,711');
const ageState = (o) => run(o).gates.find((g) => g.key === 'age').state;
check(ageState({ age: 17 }) === 'no' && ageState({ age: 18 }) === 'ok' && ageState({ age: 66, sex: 'm' }) === 'ok' && ageState({ age: 67, sex: 'm' }) === 'no' && ageState({ age: 61, sex: 'f' }) === 'ok' && ageState({ age: 63, sex: 'f' }) === 'check' && ageState({ age: 65, sex: 'f' }) === 'no' && ageState({ age: 63 }) === 'check', 'age: 17 no; 18 yes; a man 66 yes, 67 no; a woman 61 yes, 63 check (62-65 by birth month), 65 no; 63 without the sex: check');
check(run({ age: 63, sex: 'f' }).verdict === 'check' && run({ age: 17 }).flags.some((f) => f.code === 'under18') && !run({ degree: 0 }).eligible && run({ degree: 0 }).calc === null, 'the check state for a woman of 63; under 18 points to the child benefit; a loss under 50% is not eligible and computes no money');

/* ---------- 9. The clock ---------- */
const late = run({ det: '2024-06-01', claim: '2026-10-01', notice: '' });
check(late.clock.detEff === '2025-07-01' && late.clock.start === '2025-09-30' && late.clock.payFrom === '2025-10-01' && late.flags.some((f) => f.code === 'det_min') && late.flags.some((f) => f.code === 'late'), 'late claim 1.10.2026 for 1.6.2024: the determining date no earlier than 1.7.2025 (15 months, s.195); day 91 = 30.9.2025; paid from 1.10.2025 (12 months, s.296(ב)(1))');
const early = run({ degree: 100, full6: true });
check(early.clock.early.from === '2026-04-01' && early.clock.early.to === '2026-05-30' && early.deadlines.some((d) => d.key === 'early') && run({ full6: true }).flags.some((f) => f.code === 'early_only100'), '100% for 6 months: the full pension from day 31 (1.4.2026) to day 90 (30.5.2026) (s.196(ג)); at 74% only a note');
check(run({ notice: '2026-10-06' }).appealBy === '2026-12-06' && run({ ruling: '2026-12-01' }).deadlines.find((d) => d.key === 'court').date === '2027-01-31', 'rest days: 6.10.2026 + 60 = Saturday 5.12.2026 -> 6.12.2026; a committee decision 1.12.2026 + 60 = Saturday 30.1.2027 -> 31.1.2027 (s.213)');
check(run({ claim: '2026-04-01' }).flags.some((f) => f.code === 'early_claim') && run({ det: '', claim: '' }).clock === null && run({ det: '', claim: '', notice: '' }).deadlines.length === 0, 'a claim before day 91 waits (s.207(א)); no dates, no clock');

/* ---------- 10. Input errors ---------- */
const errs = (over) => { const r = run(over); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
check(errs({ age: 'x' }) === 'age' && errs({ age: 45.5 }) === 'age' && errs({ age: '' }) === 'age' && errs({ status: 'x' }) === 'status', 'age: a whole number; the status chip');
check(errs({ med: 101 }) === 'med' && errs({ med: '' }) === 'med' && errs({ single: 70 }) === 'single' && errs({ medMode: 'list', meds: [] }) === 'm0' && errs({ medMode: 'list', meds: [30, 0, 120] }) === 'm1,m2', 'medical: 0 to 100; a single impairment not above the total; at least one impairment, each 1 to 100');
check(errs({ degree: 50 }) === 'degree' && errs({ spouse: 'x' }) === 'spouse' && errs({ kids: -1 }) === 'kids' && errs({ kids: 1.5 }) === 'kids' && errs({ wage: -1 }) === 'wage' && errs({ other: 'x' }) === 'other', 'the degree, the spouse, the children, the wage and other income');
check(errs({ det: '31.2.2026' }) === 'det' && errs({ claim: '2026-01-01' }) === 'claim' && errs({ notice: '2026-05-01' }) === 'notice' && errs({ ruling: '2026-09-01' }) === 'ruling' && errs({ age: 'x', med: 200, wage: -5 }) === 'age,med,wage', 'dates: real dates in order (claim after the determining date, the decision after the claim); every error at once');
check(NU.renderResult(reg, run({ age: 'x' })).includes('צריך לתקן את הקלט') && NU.renderDetails(reg, run({ age: 'x' })) === '', 'the error state renders, details stay empty');

/* ---------- 11. The snapshot ---------- */
const snap = NU.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'kitzbat-nechut' && snap.registry_version === reg.registry_version && snap.total === 7157 && snap.sticky.includes('7,157') && snap.sentence === NU.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 7,157, the sticky, the sentence, the input');
check(snap.form.includes('id="jt33-age"') && snap.form.includes('value="45"') && snap.form.includes('value="new" checked') && snap.form.includes('value="74" checked') && snap.form.includes('value="dep" checked') && snap.form.includes('name="jt33-kids" value="2" checked') && snap.form.includes('value="3,000"') && snap.form.includes('value="1.3.2026"') && snap.form.includes('value="1.10.2026"'), 'the form is pre-filled with the example');
check(['7,157', '85,884', '10,157', '30.11.2026', 'דוגמה מחושבת'].every((s) => snap.result.includes(s)) && snap.result.includes('jt33-lad') && (snap.result.match(/class="jt33-rung[" ]/g) || []).length === 5 && snap.result.includes('jt33-rung--here') && snap.result.includes('jt33-ch__svg') && (snap.result.match(/class="jt33-ch__w"/g) || []).length === 26 && snap.result.includes('jt33-ch__you'), 'the result: 7,157, 85,884, 10,157, the appeal date; the ladder (4 degrees + under 50%), the ledger chart of 26 wage columns (0 to 25,000) with the reader\'s line');
check(['3,211', '1,518', '3,946', '4,711.08', '2,838', 'data-act="ics"', 'data-act="copy-list"', 'טופס 7801', nc.claim.form_url, nc.claim.prep_url].every((s) => snap.details.includes(s)), 'the details: the degree amount, the additions, the composition of 4,711.08 from 2,838, the .ics and checklist buttons, form 7801, the online claim and the free preparation');
check(snap.method.startsWith('<ol>') && ['סעיף 208(א)', 'סעיף 209(א1)', 'סעיף 201(א)', 'סעיף 201(ב)', 'לוח ח1', 'סעיף 196(ב)', 'סעיף 296(ב)(1)'].every((s) => snap.method.includes(s)) && snap.method.includes('3,211 + 3,946 = 7,157') && snap.method.includes('13,769 × 21% = 2,891.49') && snap.method.includes(nc.law_url) && snap.method.includes(nc.general_law_url), 'the method: every section on the path, the arithmetic, the law chapters');
const plain = snap.compare_table.replace(/<[^>]+>/g, ' ');
check((snap.compare_table.match(/<caption>/g) || []).length === 2 && ['4,711', '3,211', '2,894', '2,718', '1,214', '898', '789', '728', '1,518', '1,123', '987', '911', '8,657', '6,131', '4,086'].every((s) => plain.includes(s)), 'the page tables: the 2026 amounts by degree with every addition (8,657 and 6,131 with a spouse and 2 children), and the pension by wage (9,000 at 100%: 4,086)');
check(all.split('jtool-cite').length > 30 && all.includes(nc.pages.work) && all.includes(nc.pages.appeal) && all.includes(nc.pension.url), 'cites throughout, to the work, appeal and amounts pages');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence];
[low, hm, st, late, early, wl, m40, n2, big, run({ age: 'x' }), run({ degree: 0 }), run({ age: 63, sex: 'f' }), run({ det: '', claim: '', notice: '' }), run({ other: 2000 }), run({ ruling: '2026-12-01' })].forEach((r) => { renders.push(NU.renderResult(reg, r), NU.renderDetails(reg, r), NU.verdictSentence(reg, r)); });
renders.push(NU.renderForm(reg, Object.assign({}, EX, { medMode: 'list', meds: [], age: 63, homemaker: true, full6: true })), NU.renderForm(reg, { age: '', det: '', claim: '' }));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null|Infinity/.test(joined), 'no undefined / NaN / null / Infinity in any rendered string (example, low medical, homemaker, stopped, late, early, list, errors, no degree, women 63, no dates, other income, court)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');
const banned = [[0x5db, 0x5dc, 0x20, 0x5d6, 0x5db, 0x5d5, 0x5ea], [107, 111, 108, 122, 99, 104, 117, 116]].map((c) => String.fromCharCode(...c));
check(!banned.some((b) => (joined + JSON.stringify(nc)).toLowerCase().includes(b)), 'the unofficial rights portal is never named, in the registry or the pages (checked by code points, so the name is not written here either)');

/* ---------- 12. The share state, the .ics and the checklist ---------- */
check(JSON.stringify(NU.inputOf(decodeState(`#s=${NU.stateOf(EX)}`, NU.KEYS))) === JSON.stringify(EX) && NU.stateOf(EX) === 'a45/sn/m60/d74/pd/k2/w3000/t2026-03-01/c2026-06-01/n2026-10-01', 'the example round-trips exactly, as a short readable state');
const full = { age: 63, sex: 'f', status: 'receiving', homemaker: true, medMode: 'list', med: '', single: '', meds: [45, 25.5, '', '', '', ''], degree: 100, spouse: 'earns', kids: 3, wage: 12500.5, other: 2000, det: '2025-01-15', claim: '2025-05-01', notice: '2025-09-01', ruling: '2025-12-01', full6: true };
check(JSON.stringify(NU.inputOf(decodeState(`#s=${NU.stateOf(full)}`, NU.KEYS))) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns every answer, the impairments list included');
check(!/[֐-׿]/.test(NU.stateOf(full)) && /^[0-9A-Za-z._~/-]+$/.test(NU.stateOf(full)) && NU.inputOf({}) === null, 'the state carries no Hebrew, no name or ID; an empty hash gives no input');
const cal = ics(ex.deadlines.filter((d) => d.ics).map((d) => ({ date: d.date, summary: d.he })), '2026-10-21T12:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20260531') && cal.includes('DTSTART;VALUE=DATE:20261130') && cal.includes('DTSTART;VALUE=DATE:20270401') && (cal.match(/BEGIN:VEVENT/g) || []).length === 3, 'the .ics: day 91, the appeal deadline, the re-check date');
const cl = NU.checklist(reg, ex);
check(cl.length === 16 && cl[0].he.includes(nc.claim.form) && NU.checklistText(reg, ex).startsWith('1. ') && NU.TOOL_ID === 'kitzbat-nechut', 'the checklist: form 7801, 6 documents, the fast track, 5 committee steps, the free preparation, income support, changes: 16 numbered lines');
check(NE.byWage(reg, 100, [0, 9000, 16632]).map((x) => x.pay).join(',') === '4711,4086,0' && NU.workTable(reg).includes('2,483') && NU.amountsTable(reg).includes('5,086'), 'the page tables come from the same engine (9,000 -> 4,086; 13,000: 2,483 at every degree; 60% with a spouse and 2 children 5,086)');

console.log(`kitzbat-nechut: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
