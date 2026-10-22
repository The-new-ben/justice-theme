/**
 * Golden tests for the income-support instrument (havtachat-hachnasa, the rights wave 2B, 21.10.2026).
 * Run: node tests/js/test-rights-havtacha.mjs
 *
 * By hand, from the Income Support Law, 1980, its 1982 regulations and the Institute's 2026 pages (rights_havtacha,
 * rights_btl): basic amount 3 = 10,382, the income-support point 162, the average wage of section 2 = 13,769.
 * The second schedule: under 55 20% = 2,076.4 -> 2,076 (single), 27.5% = 2,855.05 -> 2,855, 30% = 3,114.6 -> 3,115,
 * 33.5% = 3,477.97 -> 3,478, 39% = 4,048.98 -> 4,049; from 55 25% = 2,595.5 -> 2,596, 37.5% = 3,893.25 -> 3,893,
 * 43.5% = 4,516.17 -> 4,516, 49.5% = 5,139.09 -> 5,139, 42.5% - 162 = 4,250.35 -> 4,250, 52.5% - 162 = 5,288.55 -> 5,289;
 * 20-24 reporting: 80% x 2,076.4 = 1,661.12 -> 1,661, 80% x 2,855.05 = 2,284.04 -> 2,284 (s.5(ה)(3)).
 * The disregards (ss.12, 12א): 5% x 13,769 = 688.45 -> 688, 7% = 963.83 -> 964, 13% = 1,789.97 -> 1,790, 17% =
 * 2,340.73 -> 2,341, 33.81% = 4,655.30 -> 4,655 (the single parent's band), 25% = 3,442.25 -> 3,442 (a "worker" for the car).
 * The determining amounts from 55 (s.7, reg. 9): 38% = 5,232.22, 54.5% = 7,504.11, 60.5% = 8,330.25, 66.5% = 9,156.39.
 * The example: a single parent of 34 with 2 children, 3,000 a month from work: 4,049 - 25% x (3,000 - 964) = 4,049 - 509 =
 * 3,540 a month; 42,480 a year; with the work 6,540.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as HE from '../../assets/js/tools/havtacha-engine.js';
import * as HU from '../../assets/js/tools/havtacha-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const hv = reg.rights_havtacha;
const btl = reg.rights_btl;
const EX = HU.EXAMPLE;
const BASE = { fam: 'single', kids: 0, age: 30, sex: '', born: '', spouseAge: '', emp: 'registered', spouseEmp: 'registered', work: '', spouseWork: '', pension: '', other: '', car: 'none', carValue: '', carEx: false, savings: '', realty: false, res: 'yes', excl: 'none', month: '', decision: '', hearing: '' };
const run = (over) => HE.compute(reg, Object.assign({}, EX, over));
const one = (over) => HE.compute(reg, Object.assign({}, BASE, over));
const pay = (over) => one(over).monthly;
const near = (a, b, e = 0.005) => Math.abs(a - b) < e;

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
const paths = [
	'amounts.pct', 'amounts.b', 'amounts.c', 'amounts.young', 'amounts.young_pct', 'amounts.max_work', 'work.first', 'work.first_pct', 'work.counted_pct',
	'work.parent.band', 'work.parent.low_pct', 'work.parent.high_pct', 'determining.rules', 'determining.by_wage', 'car.limit', 'car.credit_worker',
	'car.credit_other', 'car.worker_pct', 'car.rate_pct', 'assets.free_x', 'assets.interest_pct', 'age.min', 'age.young_to', 'age.older_from',
	'age.men_retirement', 'age.women_retirement', 'women.amount', 'women.months', 'deductions.health', 'min_pay', 'clock.pay_day', 'clock.hearing_days',
	'clock.appeal_months', 'clock.changes_days', 'residence.months', 'claim.form', 'claim.online_url', 'history', 'rehearse_url',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(hv, p) !== undefined && get(hv, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(hv, p) == null).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(hv, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(urls.length >= 30 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|govforms\.gov\.il|www\.taasuka\.gov\.il|jus-tice\.com)\//.test(u)), `registry: every url is an official https source (the Institute, govforms, the employment service) or the rehearsal (${urls.length} urls)`);
check(['residence', 'age', 'amounts', 'work', 'other_income', 'determining', 'car', 'assets', 'employment', 'exclusions', 'women', 'deductions', 'clock', 'claim'].every((k) => typeof (hv[k].url || hv[k].form_url) === 'string'), 'registry: every rule block carries its own source url');
check(hv.law_url === 'https://www.btl.gov.il/Laws1/00_0002_000000.pdf' && hv.regs_url === 'https://www.btl.gov.il/Laws1/02_0002_111450.pdf' && hv.checked_on === '2026-10-21' && hv.from === '2026-01-01' && hv.next_update === '2027-01-01', 'registry: the law and the regulations from the Institute\'s Laws1 PDFs; checked 21.10.2026, figures from 1.1.2026');
check(btl.basic_amount.b3 === 10382 && btl.basic_amount.b2_income_support === 162 && btl.avg_wage.s2_benefits === 13769 && reg.rights_tax.years['2026'].point_month === 242, 'inputs: basic amount 3 = 10,382, the income-support point 162, the average wage 13,769 (rights_btl), the credit point 242 (rights_tax)');

/* ---------- 2. Every published 2026 figure is the law's percentage of the shared basic amounts ---------- */
const rnd = HE.roundShekel;
const kinds = ['single', 'couple', 'couple1', 'couple2', 'parent1', 'parent2'];
const derived = (col, k) => rnd(btl.basic_amount.b3 * hv.amounts.pct[k][col] / 100 - (col === 'c' && hv.amounts.pct[k].less_point ? btl.basic_amount.b2_income_support : 0));
check(kinds.every((k) => derived('b', k) === hv.amounts.b[k] && derived('c', k) === hv.amounts.c[k]) && hv.amounts.b.single === 2076 && hv.amounts.c.parent2 === 5289, 'the second schedule: 20% 2,076.4 -> 2,076 ... 39% 4,048.98 -> 4,049; from 55 25% 2,595.5 -> 2,596 ... 52.5% - 162 = 5,288.55 -> 5,289 (s.5(א))');
check(hv.amounts.young.single === rnd(btl.basic_amount.b3 * 0.2 * 0.8) && hv.amounts.young.couple === 2284 && hv.amounts.young.couple2 === hv.amounts.b.couple2, '20-24 reporting: 80% of 2,076.4 = 1,661.12 -> 1,661; 80% of 2,855.05 -> 2,284; with children the full amount');
const avg = btl.avg_wage.s2_benefits;
check(rnd(avg * 0.05) === 688 && rnd(avg * 0.07) === 964 && rnd(avg * 0.13) === 1790 && rnd(avg * 0.17) === 2341 && rnd(avg * 0.3381) === hv.work.parent.band && hv.work.first.b.family === 964 && hv.work.first.c.single === 1790, 'the disregards: 688.45 -> 688, 963.83 -> 964, 1,789.97 -> 1,790, 2,340.73 -> 2,341, 4,655.30 -> 4,655 (ss.12, 12א)');
const det = (k) => HE.determining(reg, k, false);
check(near(det('single').amount, 5232.22) && near(det('couple').amount, 7504.105) && near(det('couple1').amount, 8330.245) && near(det('couple2').amount, 9156.385) && det('single').byPoints === 11.25 * 242 && HE.determining(reg, 'couple2', true).byPoints === 21.25 * 242, 'the determining amounts: 38% 5,232.22, 54.5% 7,504.11, 60.5% 8,330.25, 66.5% 9,156.39; the points (2,722.50, 5,142.50) lower (reg. 9)');
check(['single', 'couple', 'couple1'].every((k) => Math.round(det(k).amount) === hv.amounts.max_work.c[k]) && hv.amounts.max_work.c.couple2 === 9318 && Math.round(det('couple2').amount) === 9156, 'the Institute\'s 55+ maximum-income column is the determining amount for single, couple, couple + child (5,232 / 7,504 / 8,330); couple + 2 children: published 9,318 vs 9,156 by reg. 9 (flagged)');
// The under-55 maximum-income column, reproduced from the disregards: the work income at which the countable income equals the full benefit.
const zero = (col, k) => {
	const full = hv.amounts[col][k];
	const first = hv.work.first[col][k === 'single' ? 'single' : 'family'];
	if (k.startsWith('parent')) { const band = hv.work.parent.band; const lowMax = (band - first) * 0.25; return full <= lowMax ? first + full / 0.25 : band + (full - lowMax) / 0.6; }
	return first + full / ((col === 'c' ? hv.work.counted_pct.c : hv.work.counted_pct.b[k]) / 100);
};
check(kinds.every((k) => Math.round(zero('b', k)) === hv.amounts.max_work.b[k]) && Math.round(zero('c', 'parent1')) === 10774 && Math.round(zero('c', 'parent2')) === 12506, 'every cell of the Institute\'s under-55 column (3,654 / 5,043 / 5,579 / 6,529 / 8,914 / 9,865) and the single parent\'s 55+ cells (10,774 / 12,506) come out of the disregards exactly');
check(hv.women.amount === 825 && rnd(btl.basic_amount.b3 * 0.0795) === 825 && hv.deductions.spouse_away === 779 && hv.car.worker_from === 3442, 'women from 62: 7.95% x 10,382 = 825.37 -> 825 (s.5(ז)); a spouse away 7.5% = 778.65 -> 779 (s.6(ד)); a "worker" 3,442');

/* ---------- 3. The example ---------- */
const ex = HE.compute(reg, EX);
check(ex.ok && ex.eligible && ex.verdict === 'ok' && ex.gates.every((g) => g.state === 'ok') && ex.kind === 'parent2' && ex.col === 'b', 'example: eligible, every gate holds (a single parent of 34 with 2 children, reporting, 3,000 from work)');
check(ex.calc.full === 4049 && ex.calc.dW === 964 && near(ex.calc.counted, 509) && ex.calc.workCounted === 509 && ex.monthly === 3540 && ex.annual === 42480 && ex.total === 6540, 'example: 4,049 - 25% x (3,000 - 964 = 2,036) = 4,049 - 509 = 3,540; x 12 = 42,480; + 3,000 = 6,540');
check(ex.keep === 75 && ex.nextKeep.from === 4655 && ex.nextKeep.keep === 40 && ex.end === 9857, 'example: 75 of every 100 stay up to 4,655, then 40; the benefit ends at 9,857 (9,856: 4,049 - round(922.75 + 3,120.60) = 6 paid; 9,857: 5, below 6, s.8)');
check(ex.ledger.map((x) => `${x.w}:${x.pay}`).join(' ') === '0:4049 964:4049 965:4049 3000:3540 4655:3126 4656:3126 9856:6 9857:0', 'the ledger: 0, 964, 965, 3,000, 4,655 (4,049 - 923 = 3,126), 4,656 (923.35 -> 923), 9,856 (6), 9,857 (0)');
check(ex.deadlines.map((d) => `${d.key}:${d.date}`).join(' ') === 'from:2026-11-01 file_by:2026-11-30' && ex.deadlines.find((d) => d.key === 'file_by').ics, 'example dates: the benefit from 1.11.2026, the claim by 30.11.2026 for November (s.14(א)), to the calendar');
check(ex.flags.map((f) => f.code).join(',') === 'refuse,changes' && ex.next.length === 3 && ex.next[0].url === hv.claim.online_url && ex.next[2].url === '/kitzbat-yeladim/' && ex.rehearse.url === hv.rehearse_url, 'example: the refusal and changes notes; next steps: the online claim, the employment service, the child allowance page; the rehearsal');
check(ex.columns.map((x) => `${x.key}:${x.pay}`).join(' ') === 'b:3540 c:5124' && ex.columns[0].here, 'the same family at 55+: 5,289 - 25% x (3,000 - 2,341) = 5,289 - 164.75 -> 165 = 5,124');

/* ---------- 4. The disregard steps: exactly at and one shekel above ---------- */
check(pay({ work: 688 }) === 2076 && pay({ work: 689 }) === 2075 && pay({ work: 1000 }) === 2076 - rnd(0.7 * 312), 'single: 688 -> 2,076; 689 -> 0.70 -> 1 -> 2,075; 1,000 -> 0.7 x 312 = 218.4 -> 218 -> 1,858');
const pk = (w) => run({ work: w }).monthly;
check(pk(4655) === 3126 && pk(4656) === 3126 && pk(4657) === 3125, 'single parent at the band: 4,655 -> 922.75 -> 923 -> 3,126; 4,656 -> 923.35 -> 3,126; 4,657 -> 923.95 -> 924 -> 3,125 (s.12(א)(2))');
check(run({ work: 4800 }).calc.workCounted === 1010 && run({ work: 4800 }).monthly === 3039 && run({ kids: 1, work: 4800 }).monthly === 2468, 'the Institute\'s own example: 4,800 -> 25% x 3,691 + 60% x 145 = 922.75 + 87 = 1,010; 4,049 - 1,010 = 3,039 (2 children), 3,478 - 1,010 = 2,468 (1 child)');
check(pay({ work: 3645 }) === 6 && pay({ work: 3646 }) === 0 && one({ work: 3646 }).calc.belowMin, 'single: 3,645 -> 0.7 x 2,957 = 2,069.9 -> 2,070, 6 paid; 3,646 -> 2,071, 5 is below 6, nothing (s.8); the Institute\'s 3,654 is the zero point');

/* ---------- 5. Couples, the young, the age boundaries ---------- */
const both = one({ fam: 'couple', kids: 1, spouseAge: 31, emp: 'fulltime', spouseEmp: 'fulltime', work: 1500, spouseWork: 1500 });
check(both.monthly === 1741 && both.total === 4741 && both.calc.workCounted === 1374, 'a couple with a child, both working 1,500: 67.5% x (3,000 - 964) = 1,374.3 -> 1,374; 3,115 - 1,374 = 1,741; with the work 4,741 (the third schedule)');
const c3 = one({ fam: 'couple', kids: 3, age: 38, spouseAge: 36, emp: 'fulltime', work: 4500 });
check(c3.monthly === 1268 && c3.kind === 'couple2' && HU.PROFILES[2].input.kids === 3, 'a couple with 3 children, one working 4,500: 62.5% x 3,536 = 2,210; 3,478 - 2,210 = 1,268');
check(pay({ age: 54 }) === 2076 && pay({ age: 55 }) === 2596 && pay({ age: 24 }) === 1661 && pay({ age: 25 }) === 2076 && pay({ age: 24, emp: 'exempt' }) === 2076 && pay({ age: 20 }) === 1661, 'the boundaries: 54 -> 2,076, 55 -> 2,596; 24 reporting -> 1,661, 25 -> 2,076, 24 exempt -> 2,076 (s.5(א)(2), s.5(ה)(3))');
check(pay({ age: 54, work: 2000 }) === 2076 - 918 && pay({ age: 55, work: 2000 }) === 2596 - 126, 'at 2,000 from work: 54 -> 70% x 1,312 = 918.4 -> 918 -> 1,158; 55 -> 60% x 210 = 126 -> 2,470 (s.12 from 55)');
const yc = one({ fam: 'couple', age: 22, spouseAge: 23 });
check(yc.monthly === 2284 && yc.young && one({ fam: 'couple', age: 22, spouseAge: 23, spouseEmp: 'fulltime' }).monthly === 2855 && one({ fam: 'couple', age: 22, spouseAge: 26 }).monthly === 2855 && yc.flags.some((f) => f.code === 'young'), 'a young couple reporting: 2,284; one working full time or one of 26: the higher rate 2,855 (s.6(ב))');
check(one({ fam: 'couple', age: 56, spouseAge: 50 }).col === 'c' && one({ fam: 'couple', age: 56, spouseAge: 50 }).monthly === 3893, 'a couple, one of 56: the 55+ column, 3,893 (the higher personal rate)');

/* ---------- 6. From 55: the determining amount ---------- */
const s57 = one({ age: 57, sex: 'm', work: 4000 });
check(s57.calc.capBinds && s57.monthly === 1232 && s57.calc.before === 1270 && s57.capFrom === 3907 && s57.flags.some((f) => f.code === 'cap'), 'single 57, 4,000: by s.12 2,596 - 60% x 2,210 = 1,270, but 5,232.22 - 4,000 = 1,232.22 -> 1,232 (s.7); the cap takes over from 3,907');
check(pay({ age: 57, sex: 'm', work: 5226 }) === 6 && pay({ age: 57, sex: 'm', work: 5227 }) === 0 && one({ age: 57, sex: 'm' }).end === 5227 && one({ age: 57, sex: 'm' }).keep === 100, 'single 57: 5,226 -> 6.22 -> 6 paid; 5,227 -> 5 not paid; the end 5,227, the Institute\'s column 5,232');
check(one({ fam: 'couple', age: 56, spouseAge: 58, work: 7000 }).monthly === 504 && one({ fam: 'couple', age: 56, spouseAge: 50, work: 7000 }).monthly === 1098, 'a couple 56 and 58, 7,000: min(3,893 - 2,795, 7,504.11 - 7,000 = 504) = 504; 56 and 50: no cap (s.7(ג)), 1,098');
const conf = one({ fam: 'couple', kids: 2, age: 58, spouseAge: 57, work: 9200 });
check(conf.conflict && conf.verdict === 'check' && conf.monthly === 0 && conf.flags.some((f) => f.code === 'conflict') && HU.verdictSentence(reg, conf).includes('9,318') && HU.verdictSentence(reg, conf).includes('9,156.39'), 'a couple 58/57 with 2 children at 9,200: reg. 9 gives nothing (above 9,156.39), the Institute\'s table goes to 9,318: check, both named');
check(one({ fam: 'parent', kids: 1, age: 57, work: 9000 }).calc.cap === null && one({ fam: 'parent', kids: 1, age: 57, work: 9000 }).monthly === 4250 - rnd(0.25 * (4655 - 2341) + 0.6 * (9000 - 4655)), 'a single parent of 57: no determining amount; 4,250 - (578.5 + 2,607 = 3,185.5 -> 3,186) = 1,064');

/* ---------- 7. The car ---------- */
check(one({ car: 'one', carValue: 60000 }).verdict === 'no' && one({ car: 'one', carValue: 60000 }).flags.some((f) => f.code === 'car') && one({ car: 'one', carValue: 60000, carEx: true }).monthly === 2076, 'a car of 60,000 without an exception: not eligible (s.9א(ב)); with an exception: no deduction, 2,076 (s.9א(ג))');
check(pay({ car: 'one', carValue: 30000 }) === 2076 - 589 && pay({ car: 'one', carValue: 46138 }) === 2076 - 1073 && one({ car: 'one', carValue: 46139 }).verdict === 'no', 'no work, a car of 30,000: 3% x (30,000 - 10,380) = 588.6 -> 589 -> 1,487; 46,138: 1,072.74 -> 1,073 -> 1,003; 46,139: above the limit (reg. 10ב)');
const car = (w) => one({ fam: 'couple', spouseAge: 30, car: 'one', carValue: 30000, work: w });
check(car(3442).calc.carDed === 589 && car(3442).monthly === 531 && car(3443).calc.carDed === 312 && car(3443).monthly === 808 && car(4000).monthly === 418, 'a couple with a car of 30,000: 3,442 is not a "worker" (25% x 13,769 = 3,442.25): 2,855 - 1,735 - 589 = 531; 3,443: credit 19,610, 311.7 -> 312: 808; 4,000: 2,855 - 2,125 - 312 = 418');
check(one({ car: 'two' }).verdict === 'no' && one({ car: 'two', carEx: true }).verdict === 'check', 'two cars: not eligible; with a car for a person with a disability: check the second');

/* ---------- 8. Income above the full benefit, other income and a pension ---------- */
check(one({ other: 2100 }).verdict === 'no' && one({ other: 2076 }).monthly === 0 && pay({ other: 2070 }) === 6 && pay({ other: 2071 }) === 0, 'other income in full: 2,100 > 2,076, nothing; 2,076 -> 0; 2,070 -> 6 paid; 2,071 -> 5, not paid (s.8)');
check(pay({ pension: 1000 }) === 2076 - 312 && pay({ pension: 500, work: 1000 }) === 2076 - 568, 'a pension of 1,000: only the first 688 do not count -> 2,076 - 312 = 1,764; 500 pension + 1,000 work: the shared 688 -> 188 left for work, 70% x 812 = 568.4 -> 568 -> 1,508 (reg. 12)');
check(one({ work: 0 }).health && one({ work: 0 }).net === 2076 - 123 && !ex.health, 'not working: the minimum health insurance 123 is deducted, 1,953 into the account; the example works, no deduction');

/* ---------- 9. The gates ---------- */
const g = (r, k) => r.gates.find((x) => x.key === k).state;
check(g(one({ age: 19 }), 'age') === 'check' && g(run({ age: 19 }), 'age') === 'ok' && g(one({ age: 67, sex: 'm' }), 'age') === 'route' && one({ age: 67, sex: 'm' }).verdict === 'route' && one({ age: 67, sex: 'm' }).calc === null, 'age: 19 alone -> check (special circumstances), a parent of 19 -> ok, a man of 67 -> the old-age supplement route, no money computed');
check(g(one({ age: 63, sex: 'f' }), 'age') === 'check' && one({ age: 65, sex: 'f' }).route && g(one({ age: 60, sex: 'f' }), 'age') === 'ok', 'women: 63 without the birth month -> check; 65 -> route; 60 -> ok');
const w62 = one({ age: 62, sex: 'f', born: '1964-03', month: '2026-11' });
check(w62.women && w62.calc.full === 2596 + 825 && w62.monthly === 3421 && w62.womenMonths === 18, 'a woman born 3.1964, November 2026: 62 since 3.2026, retirement at 63 and 6 months (9.2027): 2,596 + 825 = 3,421 (s.5(ז), 18 months)');
check(one({ age: 64, sex: 'f', born: '1962-05', month: '2026-11' }).route && !one({ age: 64, sex: 'f', born: '1962-05', month: '2026-11' }).women, 'a woman born 5.1962: retirement at 63 (5.2025), so in November 2026 the route is the old-age supplement');
check(g(one({ emp: 'none' }), 'emp') === 'no' && one({ emp: 'none' }).verdict === 'no' && one({ fam: 'couple', spouseAge: 30, spouseEmp: 'none' }).verdict === 'no', 'the employment test: not registered and not exempt -> no; a spouse who is neither -> no (s.4)');
check(one({ excl: 'student' }).verdict === 'no' && run({ excl: 'student' }).verdict === 'check' && one({ excl: 'yeshiva' }).verdict === 'no' && one({ excl: 'kibbutz' }).verdict === 'no' && one({ excl: 'army' }).verdict === 'no', 's.3: a student -> no, a single parent student -> check (16 of 20 months, 36 months); yeshiva, kibbutz, army -> no');
check(one({ res: 'new' }).verdict === 'check' && g(one({ savings: 41528 }), 'assets') === 'ok' && g(one({ savings: 41529 }), 'assets') === 'check' && g(one({ fam: 'couple', spouseAge: 30, savings: 62292 }), 'assets') === 'ok' && g(one({ realty: true }), 'assets') === 'check', 'residence under 24 months -> check; savings 4 x 10,382 = 41,528 ok, 41,529 check; a couple 6 x = 62,292 ok; another property -> check (s.9(ג))');
check(HU.verdictSentence(reg, one({ emp: 'none' })).startsWith('אין זכאות להבטחת הכנסה') && HU.renderResult(reg, one({ emp: 'none' })).includes('אילו התנאים היו מתקיימים'), 'not eligible: the reason in the sentence, and what would have been paid');

/* ---------- 10. The clock ---------- */
const dl = run({ decision: '2026-12-01', hearing: '2026-12-01' });
check(dl.deadlines.find((d) => d.key === 'appeal').date === '2027-12-01' && dl.deadlines.find((d) => d.key === 'hearing').date === '2027-01-15' && dl.next.some((x) => x.url === '/bituach-leumi-appeal-guide/') && dl.rehearse.he.includes('בית הדין'), 'a decision on 1.12.2026: appeal to the regional labour court by 1.12.2027 (12 months); a hearing notice on 1.12.2026: 45 days -> 15.1.2027; the appeal guide and the court rehearsal');
check(run({ month: '' }).deadlines.length === 0 && run({ month: '2026-02' }).deadlines.find((d) => d.key === 'file_by').date === '2026-02-28', 'no claim month, no dates; February 2026 ends on the 28th');

/* ---------- 11. Input errors ---------- */
const errs = (over, base = EX) => { const r = HE.compute(reg, Object.assign({}, base, over)); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
check(errs({ fam: 'x' }) === 'fam' && errs({ kids: 0 }) === 'kids' && errs({ kids: -1 }) === 'kids' && errs({ age: 'x' }) === 'age' && errs({ age: 30.5 }) === 'age', 'the family, the children (a single parent has at least one), the age');
check(errs({ fam: 'couple', spouseAge: '' }) === 'spouseAge' && errs({ emp: 'x' }) === 'emp' && errs({ fam: 'couple', spouseAge: 30, spouseEmp: 'x' }) === 'spouseEmp' && errs({ work: -1 }) === 'work' && errs({ other: 'x' }) === 'other', 'the spouse\'s age and status, the work income, other income');
check(errs({ car: 'one', carValue: '' }) === 'carValue' && errs({ month: '2026-13' }) === 'month' && errs({ decision: '31.2.2026' }) === 'decision' && errs({ born: '1964-3' }) === 'born' && errs({ age: 'x', work: -5, month: 'x' }) === 'age,work,month', 'the car value, the month, the dates, the birth month; every error at once');
check(HU.renderResult(reg, run({ age: 'x' })).includes('צריך לתקן את הקלט') && HU.renderDetails(reg, run({ age: 'x' })) === '', 'the error state renders, details stay empty');

/* ---------- 12. The snapshot ---------- */
const snap = HU.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'havtachat-hachnasa' && snap.registry_version === reg.registry_version && snap.total === 3540 && snap.sticky.includes('3,540') && snap.sentence === HU.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 3,540, the sticky, the sentence, the input');
check(snap.form.includes('data-act="profile"') && (snap.form.match(/data-act="profile"/g) || []).length === 5 && snap.form.includes('value="parent" checked') && snap.form.includes('name="jt53-kids" value="2" checked') && snap.form.includes('value="34"') && snap.form.includes('value="3,000"') && snap.form.includes('value="11.2026"'), 'the form: five quick profiles, pre-filled with the example (single parent, 2 children, 34, 3,000, November 2026)');
check(['3,540', '42,480', '6,540', '30.11.2026', 'דוגמה מחושבת'].every((s) => snap.result.includes(s)) && (snap.result.match(/class="jt53-rung jt53-rung--/g) || []).length === 7 && snap.result.includes('jt53-ch__svg') && (snap.result.match(/class="jt53-ch__p[" ]/g) || []).length >= 15 && snap.result.includes('jt53-ch__you') && snap.result.includes('data-act="rehearse"'), 'the result: 3,540, 42,480, 6,540, the claim date; the gate ladder of 7 rungs, the staircase with the reader\'s line, the next steps and the rehearsal');
check(['4,049', '4,048.98', '509', '964', '2,036', 'data-act="ics"', 'data-act="copy-list"', 'טופס 5619', 'מה השתנה ומתי', '10,139', '9,857', '9,865'].every((s) => snap.details.includes(s)), 'the details: 39% x 10,382 = 4,048.98 -> 4,049, the disregard 964, 25% of 2,036 = 509, the .ics and checklist buttons, form 5619, what changed (10,139 in 2025), the end 9,857 and the Institute\'s 9,865');
check(snap.method.startsWith('<ol>') && ['סעיף 2(ב)', 'סעיף 5(א) והתוספת השנייה', 'סעיף 12א והתוספת השלישית', 'סעיף 12(א)(2)', 'סעיף 5(ב)', 'סעיף 14(א)'].every((s) => snap.method.includes(s)) && snap.method.includes('4,049 − 509 = 3,540') && snap.method.includes(hv.law_url), 'the method: every section on the path, the arithmetic, the law');
const plain = snap.compare_table.replace(/<[^>]+>/g, ' ');
check((snap.compare_table.match(/<caption>/g) || []).length === 3 && ['1,661', '2,284', '2,076', '2,855', '3,115', '3,478', '4,049', '2,596', '3,893', '4,516', '5,139', '4,250', '5,289', '3,654', '9,865', '5,232', '12,506', '688', '1,790', '2,341', '4,655', '62.5%', '10,382', '162'].every((s) => plain.includes(s)), 'the page tables: the 2026 amounts by family and age, the Institute\'s maximum-income columns, the disregards, the basic amounts by year');
check(all.split('jtool-cite').length > 25 && all.includes(hv.work.url) && all.includes(hv.amounts.url) && all.includes(hv.law_url) && HU.renderDetails(reg, car(3443)).includes(hv.regs_url) && HU.renderDetails(reg, s57).includes(hv.regs_url), 'cites throughout: the work-income page, the amounts page, the law; the regulations on the car and the determining-amount lines');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence];
[s57, conf, w62, yc, both, dl, one({ emp: 'none' }), one({ age: 67, sex: 'm' }), one({ car: 'one', carValue: 30000 }), one({ car: 'two', carEx: true }), one({ age: 19 }), one({ pension: 500, work: 1000, other: 300 }), run({ excl: 'student' }), one({ savings: 50000, realty: true, res: 'new' }), run({ age: 'x' }), car(3443)].forEach((r) => { renders.push(HU.renderResult(reg, r), HU.renderDetails(reg, r), HU.verdictSentence(reg, r)); });
HU.PROFILES.forEach((p) => { const r = HE.compute(reg, p.input); renders.push(HU.renderForm(reg, p.input), HU.renderResult(reg, r), HU.renderDetails(reg, r)); });
renders.push(HU.renderForm(reg, { age: '', fam: 'couple', car: 'one', sex: 'f' }));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null|Infinity/.test(joined), 'no undefined / NaN / null / Infinity in any rendered string (example, 55+, conflict, women, young, couples, route, car, errors, profiles)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');
const banned = [[0x5db, 0x5dc, 0x20, 0x5d6, 0x5db, 0x5d5, 0x5ea], [107, 111, 108, 122, 99, 104, 117, 116]].map((c) => String.fromCharCode(...c));
check(!banned.some((b) => (joined + JSON.stringify(hv)).toLowerCase().includes(b)), 'the unofficial rights portal is never named, in the registry or the pages (checked by code points)');

/* ---------- 13. The quick profiles, the share state, the .ics and the checklist ---------- */
check(HU.PROFILES.map((p) => HE.compute(reg, p.input).monthly).join(' ') === '2076 3540 1268 2596 2284', 'the five profiles in one click: 2,076 (single 40), 3,540 (the example), 1,268 (couple, 3 children), 2,596 (57), 2,284 (young couple)');
check(JSON.stringify(HU.inputOf(decodeState(`#s=${HU.stateOf(EX)}`, HU.KEYS))) === JSON.stringify(EX) && HU.stateOf(EX) === 'fp/k2/a34/er/w3000/m2026-11', 'the example round-trips exactly, as a short readable state');
const full = { fam: 'couple', kids: 3, age: 58, sex: 'f', born: '1968-02', spouseAge: 60, emp: 'exempt', spouseEmp: 'fulltime', work: 1200.5, spouseWork: 4000, pension: 800, other: 300, car: 'one', carValue: 25000, carEx: true, savings: 20000, realty: true, res: 'new', excl: 'student', month: '2026-12', decision: '2026-10-05', hearing: '2026-10-20' };
check(JSON.stringify(HU.inputOf(decodeState(`#s=${HU.stateOf(full)}`, HU.KEYS))) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns every answer');
check(!/[֐-׿]/.test(HU.stateOf(full)) && /^[0-9A-Za-z._~/-]+$/.test(HU.stateOf(full)) && HU.inputOf({}) === null, 'the state carries no Hebrew, no name or ID; an empty hash gives no input');
const cal = ics(dl.deadlines.filter((d) => d.ics).map((d) => ({ date: d.date, summary: d.he })), '2026-10-21T12:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20261130') && cal.includes('DTSTART;VALUE=DATE:20270115') && cal.includes('DTSTART;VALUE=DATE:20271201') && (cal.match(/BEGIN:VEVENT/g) || []).length === 3, 'the .ics: the claim deadline, the hearing deadline, the appeal deadline, nothing invented');
const cl = HU.checklist(reg, ex);
check(cl.length === 9 && cl[0].he.includes(hv.claim.form) && HU.checklistText(reg, ex).startsWith('1. ') && HU.TOOL_ID === 'havtachat-hachnasa', 'the checklist: form 5619, 4 documents, reporting, the full month, changes, the related grants: 9 numbered lines');

/* ---------- 14. The result-first card and the simulation hand-off (the wave-2A bar, HAD-585) ---------- */
check(typeof snap.lead === 'string' && snap.lead.includes('דוגמה מחושבת') && snap.lead.includes('3,540') && snap.lead.includes('42,480') && snap.lead.includes('6,540') && snap.lead.includes('נשארים 75') && snap.lead.includes('30.11.2026') && snap.lead.includes('href="#jtool-havtachat-hachnasa"') && snap.lead.includes('data-lead-go') && snap.lead.includes('לחשב לפי הנתונים שלכם'), 'snapshot.lead: 3,540 a month (42,480 a year), 6,540 with the work, 75 of every 100, file by 30.11.2026, the jump to the form');
check(!/<h2[\s>]/.test(snap.lead) && !/undefined|NaN|null/.test(snap.lead) && !/[A-Za-z]{4,}/.test(snap.lead.replace(/<[^>]+>/g, ' ')), 'snapshot.lead: no <h2>, no undefined / NaN / null, no English');
check(HU.leadCard(reg, ex).includes('החישוב שלכם') && HU.leadCard(reg, ex).includes('לשנות את הנתונים'), 'the reader\'s own card says so and offers to change the answers');
const carNo = run({ car: 'one', carValue: 90000 });
const retired = one({ age: 70, sex: 'm' });
const badAge = run({ age: '' });
check(carNo.ok && !carNo.eligible && HU.leadCard(reg, carNo).includes('אין זכאות') && HU.leadCard(reg, carNo).includes('התנאי שנכשל: רכב') && HU.leadCard(reg, carNo).includes('3,540'), 'a car above the limit: the card says "no entitlement", names the failing gate (the car) and what it would have been (3,540)');
check(retired.ok && retired.route && HU.leadCard(reg, retired).includes('השלמת הכנסה') && HU.leadCard(reg, retired).includes(String(hv.claim.old_age_form)), 'from the retirement age: the card points to the old-age income supplement and its form');
check(!badAge.ok && HU.leadCard(reg, badAge).includes('jtool-lead__figure">—</strong>') && HU.leadCard(reg, badAge).includes(badAge.errors[0].he) && HU.scenarioText(reg, badAge) === '', 'an input error: the card shows a dash and the error, and no scenario is written');
const profs = HU.PROFILES.map((p) => HE.compute(reg, p.input));
const leadsAll = profs.concat([ex, carNo, retired, badAge, run({ decision: '2026-12-01' }), run({ hearing: '2026-12-01' }), run({ excl: 'student' })]).map((r) => HU.leadCard(reg, r) + HU.scenarioText(reg, r)).join('');
check(!/<h2[\s>]/.test(leadsAll) && !/undefined|NaN|null/.test(leadsAll) && profs.map((r) => r.monthly).join() === '2076,3540,1268,2596,2284' && HU.leadCard(reg, profs[2]).includes('1,268') && HU.leadCard(reg, profs[2]).includes('37.5'), 'every profile and case: no <h2> / undefined / NaN / null; the couple working 4,500 gets 1,268 and keeps 37.5 of every 100');
const sc = HU.scenarioText(reg, ex);
check(sc.startsWith('הבטחת הכנסה') && sc.includes('3,540') && sc.includes('4,049') && sc.includes('509') && sc.includes('3,000') && sc.includes('גיל 34') && sc.includes('פקיד התביעות') && HU.rehearsal(ex).purpose === 'witness_prep', 'the scenario: 3,540 = 4,049 - 509, the work 3,000, age 34; the claims-officer interview (witness_prep)');
check(HU.scenarioText(reg, carNo).includes('בית הדין האזורי לעבודה') && HU.rehearsal(carNo).purpose === 'court_rehearsal' && HU.rehearsal(run({ decision: '2026-12-01' })).purpose === 'court_rehearsal' && HU.scenarioText(reg, run({ hearing: '2026-12-01' })).includes('החוקר') && HU.rehearsal(run({ hearing: '2026-12-01' })).purpose === 'witness_prep' && HU.scenarioText(reg, retired).includes('אזרח ותיק'), 'the hearing fits the result: a rejection or a decision -> the regional labour court; a hearing notice -> the investigator; the retirement age -> the old-age claim');
const priv = HE.compute(reg, Object.assign({}, EX, { name: 'ישראלה ישראלי', id: '123456782', phone: '0501234567', address: 'רחוב הדוגמה 5' }));
const scP = HU.scenarioText(reg, priv) + HU.leadCard(reg, priv);
check(!scP.includes('ישראלה') && !scP.includes('123456782') && !scP.includes('0501234567') && !scP.includes('רחוב הדוגמה') && scP.includes('3,540'), 'privacy: a name, an ID, a phone or an address slipped into the input never reach the scenario or the card');
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
check(!leaks.length && /\.jt53-quick, \.jt53-next, \.jt53-noprint \{ display: none !important; \}/.test(css), `print: the jt53 rules print the ladder and the staircase; no unscoped print rule hides the result or the sources (${leaks.join(' | ')})`);
check(/jtool-tablewrap jt53-noprint"><div class="jtool-tablewrap__head"><h3 id="jt53-gate-h"/.test(snap.details) && /jtool-tablewrap jt53-noprint"><div class="jtool-tablewrap__head"><h3 id="jt53-led-h"/.test(snap.details) && /<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="jt53-calc-h"/.test(snap.details) && /<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="jt53-dl-h"/.test(snap.details), 'the printed summary (two A4 pages): the ladder, the staircase, the calculation and the dates print; the gate list and the step table (their text twins) stay on screen');

console.log(`havtachat-hachnasa: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
