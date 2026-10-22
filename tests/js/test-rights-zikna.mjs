/**
 * Golden tests for the old-age pension instrument (kitzbat-zikna, the rights wave 2B, 22.10.2026, HAD-585).
 * Run: node tests/js/test-rights-zikna.mjs
 *
 * By hand, from chapter 11 of the National Insurance Law, its tables, the Retirement Age Law and the Institute's 2026 pages
 * (rights_zikna, rights_btl): basic amount 3 = 10,382; the average wage of section 2 = 13,769.
 * s.244(א) 17.7% x 10,382 = 1,837.61 -> 1,838; s.247א 18.7% = 1,941.43 -> 1,941; s.244(ב) 8.9% = 924.00 -> 924, 5.6% = 581.39
 * -> 581. Table ט1: 73.45% x 13,769 = 10,113.33 -> 10,113; 97.93% = 13,483.98 -> 13,484; 104.93% = 14,447.81 -> 14,448.
 * Table ט item 1: 57% = 7,848.33 -> 7,848. s.269א: 73.5% = 10,120.22 -> 10,120. s.248: 2% a year up to 50%.
 * The example: a woman born 9.8.1964, single, 28 insured years, 11,000 a month from work. Retirement age 63 and 6 months
 * (born 1964): 9.2.2028; 70 on 9.8.2034; 80 on 9.8.2044. Full pension 1,838 x 1.5 = 2,757; 60% x (11,000 - 10,113) = 532.20;
 * 2,757 - 532.20 = 2,224.80 -> 2,225 a month; it ends at work income 10,113 + (2,757 - 184) / 0.6 = 14,401.33 -> 14,402.
 * At 70 2,757; from 80 1,941 x 1.5 = 2,911.5 -> 2,912. Born on the 9th: first paid for February 2028, on 28.2.2028.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ZE from '../../assets/js/tools/zikna-engine.js';
import * as ZU from '../../assets/js/tools/zikna-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const z = reg.rights_zikna;
const btl = reg.rights_btl;
const EX = ZU.EXAMPLE;
const BASE = { sex: 'f', birth: '1964-08-09', fam: 'single', spouseBirth: '', spouseIncome: '', spousePension: false, together: true, kids: 0, years: 28, status: 'worker', work: '', other: '', workYears: '', waive: false, disability: false, immigrant: false, grantWork: false, decision: '' };
const run = (over) => ZE.compute(reg, Object.assign({}, EX, over));
const one = (over) => ZE.compute(reg, Object.assign({}, BASE, over));
const head = (over) => one(over).head.pay;
const p1 = (over) => one(over).phases[0].pay;
const man = (over) => one(Object.assign({ sex: 'm', birth: '1959-06-20', years: 40 }, over));

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
const paths = [
	'ages.men_retirement', 'ages.women_retirement', 'ages.women_eligibility', 'ages.men_eligibility', 'ages.women_now_from', 'amounts.basic', 'amounts.basic80',
	'amounts.spouse', 'amounts.child', 'amounts.max_children', 'amounts.from80', 'amounts.pct', 'seniority.pct_per_year', 'seniority.max_pct', 'deferral.pct_per_year',
	'deferral.nine_months', 'income_test.single', 'income_test.couple', 'income_test.max_pct', 'income_test.deduct_pct', 'income_test.min_partial', 'income_test.both_other_mult',
	'income_test.end_single', 'income_test.end_couple', 'income_test.other', 'income_test.both', 'income_test.history', 'spouse.income_limit', 'spouse.wife_min_age',
	'spouse.wife_free_age', 'spouse.husband_min_age', 'spouse.husband_free_age', 'achshara.last10_months', 'achshara.total_months', 'grant.rates', 'grant.months',
	'grant.from_age', 'grant.claim_age', 'grant.det', 'supplement.table', 'health.single', 'health.couple', 'claim.retro_months', 'claim.pay_day', 'claim.cutoff_day',
	'appeal.committee_months', 'appeal.court_months', 'history', 'rehearse_url', 'penal.serious_years',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(z, p) !== undefined && get(z, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(z, p) == null).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(z, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(urls.length >= 40 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|www\.nevo\.co\.il|jus-tice\.com)\//.test(u)), `registry: every url is an official https source (the Institute, the law on nevo) or the rehearsal (${urls.length} urls)`);
check(['ages', 'achshara', 'insured', 'amounts', 'seniority', 'deferral', 'income_test', 'spouse', 'grant', 'supplement', 'health', 'claim', 'appeal', 'from_other', 'paid', 'penal'].every((k) => typeof z[k].url === 'string' && z[k].url.startsWith('https://')), 'registry: every rule block carries its own source url');
check(z.law_url === 'https://www.btl.gov.il/Laws1/00_0001_000011.pdf' && z.tables_url === 'https://www.btl.gov.il/Laws1/00_0001_000020.pdf' && z.retirement_law_url === 'https://www.nevo.co.il/law_html/law00/73761.htm' && z.checked_on === '2026-10-21' && z.from === '2026-01-01' && z.next_update === '2027-01-01', 'registry: chapter 11 and the tables from the Institute\'s Laws1, the Retirement Age Law on nevo; checked 21.10.2026, figures from 1.1.2026');
check(btl.basic_amount.b3 === 10382 && btl.avg_wage.s2_benefits === 13769, 'inputs: basic amount 3 = 10,382 and the average wage of section 2 = 13,769 (rights_btl)');

/* ---------- 2. Every published 2026 figure is the law's percentage of the shared figures ---------- */
const rnd = ZE.roundShekel;
const b3 = btl.basic_amount.b3;
const avg = btl.avg_wage.s2_benefits;
check(z.amounts.basic === rnd(b3 * 0.177) && z.amounts.basic === 1838 && z.amounts.basic80 === rnd(b3 * 0.187) && z.amounts.basic80 === 1941, 's.244(א): 17.7% x 10,382 = 1,837.61 -> 1,838; s.247א: 18.7% = 1,941.43 -> 1,941');
check(z.amounts.spouse === 924 && z.amounts.child === 581 && z.amounts.published.couple === 2762 && z.amounts.published.couple_children === 3924 && z.amounts.published.single_children === 3000, 's.244(ב): 8.9% = 924, 5.6% = 581.39 -> 581; couple 1,838 + 924 = 2,762; couple and 2 children + 1,162 = 3,924; single and 2 children 3,000');
check(z.income_test.single === rnd(avg * 0.7345) && z.income_test.single === 10113 && z.income_test.couple === 13484 && z.spouse.income_limit === 7848 && z.grant.det === 10120, 'table ט1: 73.45% x 13,769 = 10,113.33 -> 10,113; 97.93% -> 13,484; table ט: 57% -> 7,848; s.269א: 73.5% -> 10,120');
check(ZE.maxIncome(reg, 2).amount === 14448 && ZE.maxIncome(reg, 3).amount === rnd(avg * 1.1193) && ZE.maxIncome(reg, 0).amount === 10113, 'the maximum income by dependants: two dependants 104.93% = 14,447.81 -> 14,448; three 111.93% -> 15,412');
check(z.income_test.end_single === 14402 && z.income_test.end_couple === 20082 && z.income_test.min_partial === 184 && z.income_test.other.single[1] === 34627 && z.income_test.other.couple_pension[1] === 44740, 'the published ceilings: 10,113.33 + (2,757 - 184) / 0.6 -> 14,402; 13,483.98 + (4,143 - 184) / 0.6 -> 20,082; 30,339 + 4,288.33 -> 34,627; 40,452 + 4,288.33 -> 44,740');

/* ---------- 3. The example: a woman born 9.8.1964, single, 28 insured years, 11,000 from work ---------- */
const ex = ZE.compute(reg, EX);
check(ex.ok && ex.ret.years === 63 && ex.ret.months === 6 && ex.ret.date === '2028-02-09' && ex.elig.date === '2034-08-09' && ex.at80 === '2044-08-09' && ex.womenStep === 18, 'born 8.1964: retirement age 63 and 6 months (Retirement Age Law, part ב) = 9.2.2028, 18 months after 62; 70 on 9.8.2034; 80 on 9.8.2044');
check(ex.start.full === 2757 && ex.start.senPct === 50 && ex.test.max === 10113 && ex.test.excess === 887 && ex.test.deduction === 532.2 && ex.test.partial === 2224.8 && ex.test.pay === 2225 && ex.head.pay === 2225, 'example: 28 years -> 56%, capped at 50%: 1,838 x 1.5 = 2,757; 60% x (11,000 - 10,113) = 532.20; 2,757 - 532.20 = 2,224.80 -> 2,225 (s.245(ב))');
check(ex.test.end === 14402 && ex.phases.map((p) => `${p.key}:${p.pay}`).join(' ') === 'test:2225 seventy:2757 eighty:2912', 'the end of the pension at 14,402 a month from work; the phases: 2,225 until 70, 2,757 from 70, 1,941 x 1.5 = 2,911.5 -> 2,912 from 80');
check(ex.firstPay.ym === '2028-02' && ex.firstPay.date === '2028-02-28' && ex.health === 237 && ex.net === 1988 && ex.verdict === 'ok' && ex.window === 78, 'born on the 9th: first paid for February 2028 on the 28th; health 237 -> 1,988 to the account; the income-test window 78 months');
check(ex.grant && ex.grant.rate === 3500 && ex.grant.total === 14000 && ex.grant.from === '2026-08-09' && ex.grant.to === '2026-12-09' && ex.grant.deadline === '2028-08-09' && ex.grant.state === 'no', 'the transition grant (s.269א): born 1964, 3,500 a month x 4 = 14,000 from 9.8.2026 to 9.12.2026, claim by 64 (9.8.2028); she works in those months: none');
check(ZU.verdictSentence(reg, ex).startsWith('קצבת אזרח ותיק של 2,225 ₪ בחודש מ-9.2.2028') && ZU.verdictSentence(reg, ex).includes('בגיל 70, ב-9.8.2034: 2,757 ₪') && ZU.verdictSentence(reg, ex).includes('532.20'), 'the sentence: 2,225 from 9.2.2028, 2,757 at 70, the 532.20 the work income takes');

/* ---------- 4. The income test at its edges (s.245(ב)) ---------- */
check(p1({ work: 10113 }) === 2757 && one({ work: 10113 }).test.state === 'full' && p1({ work: 10114 }) === 2756, 'exactly at the maximum 10,113: the full 2,757; one shekel above: 2,757 - 0.60 = 2,756.40 -> 2,756');
check(p1({ work: 11113 }) === 2157, 'the Institute\'s own example: 11,113 a month, 60% x 1,000 = 600, 2,757 - 600 = 2,157');
check(p1({ work: 14401 }) === 184 && one({ work: 14401 }).test.state === 'partial' && p1({ work: 14402 }) === 0 && one({ work: 14402 }).test.state === 'none', '14,401: 2,757 - 0.6 x 4,288 = 184.20 -> 184; 14,402: 183.60, under the minimum of 10% of 1,838: nothing (the published ceiling)');
const cpl = (w) => man({ fam: 'couple', spouseBirth: '1962-04-02', work: w });
check(cpl(13484).phases[0].pay === 4143 && cpl(13485).phases[0].pay === 4142 && cpl(16000).phases[0].pay === 2633, 'a couple (dependent wife), 40 years: 2,762 x 1.5 = 4,143 up to 13,484; 13,485 -> 4,142.40 -> 4,142; 16,000: 4,143 - 0.6 x 2,516 = 2,633.40 -> 2,633');
check(cpl(20082).phases[0].pay === 184 && cpl(20083).phases[0].pay === 0 && cpl(16000).test.end === 20083, 'the couple\'s ceiling: 20,082 -> 184.20 -> 184; 20,083 -> nothing (the Institute: above 20,082 none)');
check(p1({ other: 30339 }) === 2757 && p1({ other: 30340 }) === 2756 && one({ other: 30340 }).gates.find((g) => g.key === 'income').state === 'check' && p1({ other: 34627 }) === 184 && p1({ other: 34628 }) === 0, 'other income only: full up to 3 x 10,113 = 30,339; 30,340 -> 2,756 (flagged for a check); 34,627 -> 184; 34,628 -> nothing (the published bands)');
check(p1({ work: 10113, other: 20226 }) === 2757 && one({ work: 10113, other: 20226 }).test.otherCounted === 0 && one({ work: 10113, other: 20227 }).test.state === 'partial', 'both: up to 10,113 from work and 2 x 10,113 = 20,226 otherwise, the full pension; one shekel more of other income makes it partial');
check(one({ other: 40000 }).deferPct === 0 && one({ other: 40000 }).flags.some((f) => f.code === 'other_only'), 'other income only above the band: no deferral increment (s.249(א), the Institute\'s page)');
check(p1({ work: 30000, disability: true }) === 2757 && one({ work: 30000, disability: true }).gates.find((g) => g.key === 'income').state === 'ok', 'from the general disability pension: no income test (s.245(ב1)): the full 2,757 with 30,000 of work');

/* ---------- 5. Seniority, deferral, 80 ---------- */
const sen = (years) => one({ years, work: 0 }).start;
check(sen(0).full === 1838 && sen(10).full === 2206 && sen(15).senPct === 30 && sen(15).full === 2389 && sen(25).full === 2757 && sen(26).full === 2757 && sen(40).senPct === 50, 'seniority (s.248): 0 -> 1,838; 10 years 20% -> 2,205.60 -> 2,206; 15 years 30% (the Institute\'s example) -> 2,389.40 -> 2,389; 25 years 50% -> 2,757; 26 and 40 capped at 50%');
const def = man({ birth: '1960-01-12', years: 35, work: 20000 });
check(def.test.state === 'none' && def.deferYears === 3 && def.deferPct === 15 && def.seventy.pay === 3171 && def.head === def.seventy, 'a man born 12.1.1960 earning 20,000 until 70: no pension from 67, 3 years x 5% = 15%: 2,757 + 413.55 -> 414 = 3,171 from 12.1.2030 (s.249)');
const def2 = man({ birth: '1960-01-12', years: 35, work: 20000, workYears: 2 });
check(def2.deferPct === 10 && def2.phases.map((p) => `${p.key}:${p.pay}`).join(' ') === 'test:0 after:3033 seventy:3033 eighty:3203' && def2.stop === '2029-01-12', 'working 2 years only: 10%, 2,757 + 275.70 -> 276 = 3,033 from 12.1.2029 (after the work, before 70); from 80: 2,912 + 291.20 -> 291 = 3,203');
check(ZE.deferralYears(reg, 78) === 6 && ZE.deferralYears(reg, 81) === 7 && ZE.deferralYears(reg, 92) === 7 && ZE.deferralYears(reg, 69) === 6 && ZE.deferralYears(reg, 36) === 3, 'the 9-month rule (s.249(ב)): 78 months = 6 years and 6 months -> 6; 81 (6 and 9) -> 7; 92 (7 and 8) -> 7; 69 (5 and 9) -> 6; 36 -> 3');
const wv = one({ work: 11000, waive: true });
check(wv.waived && wv.phases[0].pay === 0 && wv.deferPct === 30 && wv.seventy.pay === 3584, 'waiving the partial pension (s.249(ג)): nothing until 70, then 6 years x 5% = 30%: 2,757 + 827.10 -> 827 = 3,584');
const old = man({ birth: '1956-09-03', fam: 'couple', spouseBirth: '1958-05-01', years: 45, work: 25000 });
check(old.deferPct === 15 && old.head.key === 'seventy' && old.head.pay === 4764 && old.phases.find((p) => p.key === 'eighty').pay === 4943, 'the profile "a couple, he is 70": 4,143 + 15% (621.45 -> 621) = 4,764 since 3.9.2026; from 80: (1,941 + 924) x 1.5 = 4,297.5 -> 4,298, + 644.70 -> 645 = 4,943');

/* ---------- 6. The women's schedule, row by row, and the men ---------- */
const lastDay = (ym) => { const [y, m] = ym.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).getUTCDate(); };
const rowOk = (rows, sex) => rows.every((row) => {
	const tests = [];
	if (row[0]) { tests.push(`${row[0]}-01`); }
	if (row[1]) { tests.push(`${row[1]}-${String(lastDay(row[1])).padStart(2, '0')}`); }
	return tests.every((b) => { const r = ZE.retirementAge(z, sex, b); return r.years === row[2] && r.months === row[3]; });
});
check(rowOk(z.ages.women_retirement, 'f'), 'every women\'s row, its first and its last day of birth: 60 (to 6.1944) ... 62 (5.1947 to 12.1959), 62+4 (1960), 62+8 (1961), 63 (1962), 63+3, 63+6, 63+9, 64, 64+3, 64+6, 64+9 (1969), 65 (1970 on)');
check(ZE.retirementAge(z, 'f', '1959-12-31').years === 62 && ZE.retirementAge(z, 'f', '1960-01-01').months === 4 && ZE.retirementAge(z, 'f', '1969-12-31').months === 9 && ZE.retirementAge(z, 'f', '1970-01-01').years === 65 && ZE.retirementAge(z, 'f', '1944-06-30').years === 60 && ZE.retirementAge(z, 'f', '1944-07-01').months === 4, 'the edges: 31.12.1959 -> 62, 1.1.1960 -> 62+4, 31.12.1969 -> 64+9, 1.1.1970 -> 65; 30.6.1944 -> 60, 1.7.1944 -> 60+4 (table א1)');
check(rowOk(z.ages.men_retirement, 'm') && ZE.retirementAge(z, 'm', '1942-04-30').months === 8 && ZE.retirementAge(z, 'm', '1942-05-01').years === 67 && ZE.retirementAge(z, 'm', '1990-01-01').years === 67, 'the men: every row of table א1 part א, 30.4.1942 -> 66+8, 1.5.1942 on -> 67');
check(ZE.eligibilityAge(z, 'f', '1950-04-30').years === 69 && ZE.eligibilityAge(z, 'f', '1950-04-30').months === 8 && ZE.eligibilityAge(z, 'f', '1950-05-01').years === 70 && ZE.eligibilityAge(z, 'f', '1944-12-31').years === 67 && ZE.eligibilityAge(z, 'm', '1939-01-01').years === 70, 'the eligibility age (table א1 part ד): a woman born 30.4.1950 69+8, 1.5.1950 70, 12.1944 67; a man 70');
const bd = run({ today: '2028-02-09' });
const bdBefore = run({ today: '2028-02-08' });
check(bd.gates.find((g) => g.key === 'age').he.includes('הגעתם') && bdBefore.gates.find((g) => g.key === 'age').he.includes('תגיעו') && bd.now.years === 63 && bd.now.months === 6 && bdBefore.now.months === 5, 'the birthday itself: on 9.2.2028 she is 63 and 6 months and has reached the age; on 8.2.2028 not yet');
check(ZE.addAge('1961-10-31', 62, 8) === '2024-06-30' && ZE.addAge('1963-03-31', 63, 3) === '2026-06-30' && ZE.addAge('1960-02-29', 70, 0) === '2030-02-28' && ZE.addAge('1960-01-31', 62, 4) === '2022-05-31' && ZE.addAge('1961-02-28', 62, 8) === '2023-10-28', 'the last day of a month: 31.10.1961 + 62y8m -> 30.6.2024; 31.3.1963 + 63y3m -> 30.6.2026; 29.2.1960 + 70 -> 28.2.2030; 31.1.1960 + 62y4m -> 31.5.2022; 28.2.1961 stays the 28th');
check(ZE.ageOn('1960-01-31', '2022-05-31').total === 748 && ZE.ageOn('1961-10-31', '2024-06-30').total === 752 && ZE.ageOn('1964-08-09', '2026-10-21').years === 62, 'the age on a day: born on the 31st reaches the month on the shorter month\'s last day');
const fp = (d) => ZE.firstPay(z, `1964-08-${d}`, `2028-02-${d}`);
check(fp('14').ym === '2028-02' && !fp('14').check && fp('15').check && fp('15').ym === '2028-02' && fp('15').alt === '2028-03' && fp('16').ym === '2028-03', 'the first payment month: born on the 14th, the same month; on the 15th, the Institute\'s page does not say (a check); on the 16th, the month after');

/* ---------- 7. The qualifying period, the insured, the spouse, the children ---------- */
check(man({ years: 4 }).verdict === 'no' && man({ years: 5 }).gates.find((g) => g.key === 'achshara').state === 'check' && man({ years: 11 }).verdict === 'check' && man({ years: 12 }).verdict === 'ok', 'a man (s.246): 48 months -> no; 60 to 143 months -> to check (60 in the last 10 years); 144 months -> ok');
const w4 = one({ years: 4, work: 0 });
check(w4.toSeventy && w4.basicOnly && w4.head.from === '2034-08-09' && w4.head.pay === 1838 && w4.verdict === 'check', 'a woman who must complete the period and has 48 months: a basic pension (1,838, no seniority) from 70, 9.8.2034');
const hw = one({ status: 'housewife', years: 10, fam: 'couple', spouseBirth: '1960-01-01', kids: 1 });
check(hw.toSeventy && hw.window === 0 && hw.test === null && hw.paySpouse === false && hw.head.pay === 2206 && hw.head.from === '2034-08-09', 'a housewife: from 70, no income test, no dependants\' increment: 1,838 x 1.2 = 2,205.60 -> 2,206');
check(head({ status: 'exempt', years: 0, work: 0 }) === 1838 && one({ status: 'exempt', years: 0 }).verdict === 'ok', 'an exempt woman (single, divorced, widowed): no qualifying period; with no insured years, the basic 1,838');
const im = one({ immigrant: true });
check(im.verdict === 'route' && im.head.pay === 1838 && im.phases.length === 1 && im.gates[0].state === 'route', 'a late immigrant: the special benefit, the basic amounts only (1,838), checked at the branch');
const wife = (age, income, kids = 0) => man({ fam: 'couple', spouseBirth: `${2026 - age}-01-01`, spouseIncome: income, kids, work: 0 });
check(wife(44, 0).spouseDep === false && wife(44, 0, 1).spouseDep === true && wife(45, 0).spouseDep === true && wife(45, 7848).spouseDep === true && wife(45, 7849).spouseDep === false && wife(67, 20000).spouseDep === true, 'a wife (s.247(1)): 44 without a child no; with his child yes; 45 yes; income 7,848 yes, 7,849 no; 67 with 20,000 yes');
const husb = (age, income) => one({ fam: 'couple', spouseBirth: `${2028 - age}-01-01`, spouseIncome: income, work: 0 });
check(husb(49, 0).spouseDep === false && husb(50, 7848).spouseDep === true && husb(50, 7849).spouseDep === false && husb(71, 30000).spouseDep === true, 'a husband (s.247(3)): 49 no; 50 with 7,848 yes, 7,849 no; 70 and over whatever the income');
check(wife(60, 0).head.pay === 4143 && wife(60, 9000).head.pay === 2757 && man({ fam: 'couple', spouseBirth: '1962-04-02', together: false, work: 0 }).paySpouse === false, 'the increment: a dependent wife 2,762 x 1.5 = 4,143; a wife earning 9,000, 2,757; less than a year together and no child, none');
const sp = man({ fam: 'couple', spouseBirth: '1962-04-02', spousePension: true, work: 16000 });
check(sp.paySpouse === false && sp.max.amount === 13484 && sp.start.full === 2757 && sp.phases[0].pay === 1247 && sp.health === 340, 'a spouse with an own pension: each gets a single pension (2,757), the couple\'s maximum 13,484 still applies: 2,757 - 0.6 x 2,516 = 1,247.40 -> 1,247; health for a couple 340');
const kid = (k) => one({ kids: k, work: 0, status: 'exempt', years: 0 });
check(kid(1).head.pay === 2419 && kid(2).head.pay === 3000 && kid(3).head.pay === 3000 && kid(1).max.amount === 13484 && kid(2).max.amount === 14448, 'children (s.244(ב)(2)): one 1,838 + 581 = 2,419; two 3,000; a third adds nothing; the maximum income 13,484 with one dependant, 14,448 with two');

/* ---------- 8. The grant, the dates, the .ics ---------- */
const g = (y, over = {}) => one(Object.assign({ birth: `${y}-03-10` }, over)).grant;
check(g(1960).rate === 4000 && g(1960).total === 16000 && g(1963).rate === 3750 && g(1965).total === 13000 && g(1966).rate === 3000 && g(1959) === null && g(1967) === null && man({ birth: '1962-03-10' }).grant === null, 'the transition grant by year of birth: 1960 4,000 x 4 = 16,000; 1963 3,750; 1965 3,250 x 4 = 13,000; 1966 3,000; 1959, 1967 and men: none');
check(g(1965).state === 'ok' && g(1965).deadline === '2029-03-10' && g(1965, { grantWork: true }).state === 'no' && g(1962).past === true, 'the grant\'s claim deadline is 64 (10.3.2029); work in the 4 months: none; born 1962: the deadline has passed');
const keys = ex.deadlines.filter((d) => d.ics).map((d) => `${d.key}@${d.date}`).join(' ');
check(keys === 'retire@2028-02-09 first_pay@2028-02-28 claim_by@2029-02-09 seventy@2034-08-09 eighty@2044-08-09', `the dates for the calendar: the retirement age, the first payment, 12 months to claim, 70, 80 (${keys})`);
const cal = ics(ex.deadlines.filter((d) => d.ics).map((d) => ({ date: d.date, summary: d.he })), '2026-10-22T12:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20280209') && cal.includes('DTSTART;VALUE=DATE:20340809') && (cal.match(/BEGIN:VEVENT/g) || []).length === 5 && !cal.includes('20260809'), 'the .ics: 5 events, nothing invented, nothing in the past');
const dc = one({ decision: '2026-12-01' });
check(dc.deadlines.find((d) => d.key === 'committee').date === '2027-06-01' && dc.deadlines.find((d) => d.key === 'court').date === '2027-12-01' && dc.rehearse.purpose === 'court_rehearsal' && ex.rehearse.purpose === 'witness_prep', 'a decision on 1.12.2026: the claims committee by 1.6.2027 (6 months), the labour court by 1.12.2027 (12 months); the rehearsal turns to the court');
check(ex.next.length >= 3 && ex.next.some((n) => n.url === '/havtachat-hachnasa/') && ex.next[0].kind === 'official', 'the next steps: the official claim, the income supplement on the site, more');

/* ---------- 9. Input errors ---------- */
const errs = (over, base = EX) => { const r = ZE.compute(reg, Object.assign({}, base, over)); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
check(errs({ sex: '' }) === 'sex' && errs({ birth: '31.2.1964' }) === 'birth' && errs({ birth: '1919-12-31' }) === 'birth' && errs({ birth: '' }) === 'birth' && errs({ fam: 'x' }) === 'fam', 'the sex, the birth date (no 31 February, nothing before 1920, not empty), the family');
check(errs({ fam: 'couple', spouseBirth: '' }) === 'spouseBirth' && errs({ kids: 10 }) === 'kids' && errs({ years: 'x' }) === 'years' && errs({ years: 61 }) === 'years' && errs({ years: 2.5 }) === 'years', 'the spouse\'s birth date for a couple, the children, the insured years (whole, 0 to 60)');
check(errs({ work: -1 }) === 'work' && errs({ other: 'x' }) === 'other' && errs({ workYears: 11 }) === 'workYears' && errs({ decision: '32.1.2027' }) === 'decision' && errs({ sex: 'x', years: -1, work: -5 }) === 'sex,years,work', 'the incomes, the work years, the decision date; every error at once');
check(ZU.renderResult(reg, run({ sex: '' })).includes('צריך לתקן את הקלט') && ZU.renderDetails(reg, run({ sex: '' })) === '' && ZU.leadCard(reg, run({ sex: '' })).includes('jtool-lead__figure'), 'the error state renders, the details stay empty, the lead card shows a dash');

/* ---------- 10. The snapshot ---------- */
const snap = ZU.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky, snap.lead].join('');
check(snap.tool === 'kitzbat-zikna' && snap.registry_version === reg.registry_version && snap.total === 2225 && snap.sticky.includes('2,225') && snap.sentence === ZU.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 2,225, the sticky, the sentence, the input');
check(snap.lead.includes('דוגמה מחושבת') && snap.lead.includes('2,225') && snap.lead.includes('9.2.2028') && snap.lead.includes('data-lead-go') && snap.lead.includes('#jtool-kitzbat-zikna') && ZU.leadCard(reg, ex).includes('החישוב שלכם'), 'the lead card: the example 2,225 from 9.2.2028, the jump to the form; the reader\'s own card says so');
check((snap.form.match(/data-act="profile"/g) || []).length === 5 && snap.form.includes('value="9.8.1964"') && snap.form.includes('value="28"') && snap.form.includes('value="11,000"') && snap.form.includes('name="jt50-sex" value="f" checked'), 'the form: five quick profiles, pre-filled with the example (a woman, 9.8.1964, 28 years, 11,000)');
check(['2,225', '9.2.2028', '9.8.2034', '2,757', '2,912', '1,988', '14,402', 'דוגמה מחושבת'].every((s) => snap.result.includes(s)) && snap.result.includes('jt50-ck__svg') && snap.result.includes('jt50-ck__step') && snap.result.includes('jt50-ck__win') && snap.result.includes('jt50-ck__today') && (snap.result.match(/class="jt50-lg__row"/g) || []).length === 3 && snap.result.includes('jt50-lg__s--cut') && (snap.result.match(/class="jt50-rung jt50-rung--/g) || []).length === 4 && snap.result.includes('data-act="rehearse"'), 'the result: 2,225, the dates, 2,757 at 70, 2,912 at 80, 1,988 to the account, the end 14,402; the clock (step, window, today), the ledger (3 phases, the cut), 4 gates, the rehearsal');
check(['1,837.61', '532.20', '10,113.33', '2,224.80', 'data-act="ics"', 'data-act="copy-list"', 'מה השתנה ומתי', '10,139', '73.45%', 'מענק המעבר', '14,000', '9.8.2028'].every((s) => snap.details.includes(s)), 'the details: 17.7% x 10,382 = 1,837.61, 532.20, 73.45% x 13,769 = 10,113.33, 2,224.80, the .ics and checklist buttons, what changed (10,139 in 2025, 73.45%), the grant 14,000 by 9.8.2028');
check(snap.method.startsWith('<ol>') && ['חוק גיל פרישה', 'סעיף 246', 'סעיף 244', 'סעיף 248', 'סעיף 245(ב)', 'לוח ט1', 'סעיף 247א'].every((s) => snap.method.includes(s)) && snap.method.includes('2,757 − 532.20 = 2,224.80') && snap.method.includes(z.law_url), 'the method: every section on the path and the arithmetic');
const plain = snap.compare_table.replace(/<[^>]+>/g, ' ');
check((snap.compare_table.match(/<caption>/g) || []).length === 4 && ['62 ו-4 חודשים', '64 ו-9 חודשים', '1,838', '1,941', '2,762', '2,865', '3,924', '4,143', '10,113', '13,484', '14,402', '20,082', '30,339', '34,627', '47,050', '4,375', '6,912', '9,806', '63.97%'].every((s) => plain.includes(s)), 'the page tables: the women\'s schedule, the 2026 amounts with full seniority and the supplement, the income test bands, what changed');
check(all.split('jtool-cite').length > 30 && all.includes(z.ages.url) && all.includes(z.amounts.url) && all.includes(z.income_test.partial_url) && all.includes(z.retirement_law_url), 'cites throughout: the retirement-age page, the amounts page, the partial pension page, the Retirement Age Law');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.lead];
[def, def2, wv, old, w4, hw, im, sp, dc, cpl(16000), one({ other: 30340 }), one({ work: 30000, disability: true }), man({ years: 4 }), kid(3), one({ birth: '1964-08-15' }), run({ sex: '' }), one({ birth: '1940-01-01' }), one({ birth: '1990-05-05', years: 2 })].forEach((r) => { renders.push(ZU.renderResult(reg, r), ZU.renderDetails(reg, r), ZU.verdictSentence(reg, r), ZU.leadCard(reg, r), ZU.scenarioText(reg, r)); });
ZU.PROFILES.forEach((p) => { const r = ZE.compute(reg, p.input); renders.push(ZU.renderForm(reg, p.input), ZU.renderResult(reg, r), ZU.renderDetails(reg, r), ZU.leadCard(reg, r)); });
renders.push(ZU.renderForm(reg, { sex: '', fam: 'couple' }));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null|Infinity/.test(joined), 'no undefined / NaN / null / Infinity in any rendered string (example, deferral, waiver, 70, housewife, immigrant, spouse pension, decision, couple, other income, disability, errors, profiles)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');
const banned = [[0x5db, 0x5dc, 0x20, 0x5d6, 0x5db, 0x5d5, 0x5ea], [107, 111, 108, 122, 99, 104, 117, 116]].map((c) => String.fromCharCode(...c));
check(!banned.some((b) => (joined + JSON.stringify(z)).toLowerCase().includes(b)), 'the unofficial rights portal is never named, in the registry or the pages (checked by code points)');

/* ---------- 11. The quick profiles, the share state, the scenario ---------- */
check(ZU.PROFILES.map((p) => ZE.compute(reg, p.input).head.pay).join(' ') === '2757 2633 4764 2757 3171', 'the five profiles in one click: 2,757 (a woman born 1965), 2,633 (a man of 1959 who keeps working), 4,764 (he is 70, 15% deferral), 2,757 (born 1962), 3,171 (deferral to 70)');
check(JSON.stringify(ZU.inputOf(decodeState(`#s=${ZU.stateOf(EX)}`, ZU.KEYS))) === JSON.stringify(EX) && ZU.stateOf(EX) === 'xf/b1964-08-09/fs/y28/w11000/r1', 'the example round-trips exactly, as a short readable state');
const full = { sex: 'm', birth: '1959-06-20', fam: 'couple', spouseBirth: '1962-04-02', spouseIncome: 3500.5, spousePension: true, together: false, kids: 2, years: 40, status: 'worker', work: 16000, other: 1200, workYears: 2, waive: true, disability: true, immigrant: true, grantWork: true, decision: '2026-12-01' };
check(JSON.stringify(ZU.inputOf(decodeState(`#s=${ZU.stateOf(full)}`, ZU.KEYS))) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns every answer');
const fw = Object.assign({}, BASE, { status: 'housewife', fam: 'couple', spouseBirth: '1960-01-01' });
check(JSON.stringify(ZU.inputOf(decodeState(`#s=${ZU.stateOf(fw)}`, ZU.KEYS))) === JSON.stringify(fw) && !/[֐-׿]/.test(ZU.stateOf(full)) && /^[0-9A-Za-z._~/-]+$/.test(ZU.stateOf(full)) && ZU.inputOf({}) === null, 'a housewife round-trips; the state carries no Hebrew, no name or ID; an empty hash gives no input');
const sc = ZU.scenarioText(reg, ex);
check(sc.startsWith('קצבת אזרח ותיק') && sc.includes('אוגוסט 1964') && !sc.includes('9.8.1964') && !sc.includes('1964-08-09') && sc.includes('2,225') && sc.includes('11,000') && sc.includes('פקיד התביעות') && ZU.scenarioText(reg, dc).includes('בית הדין האזורי לעבודה'), 'the scenario: the figures and the month of birth only (never the full date), the interview; after a decision, the labour court');
const cl = ZU.checklist(reg, ex);
check(cl.length >= 6 && ZU.checklistText(reg, ex).startsWith('1. ') && cl.some((x) => x.he.includes('ביטוח בריאות')) && ZU.TOOL_ID === 'kitzbat-zikna', 'the checklist: the claim, the documents, the mail, the income reports, the health certificate, the retroactive months');

console.log(`kitzbat-zikna: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
