/**
 * Golden tests for the family tools (HAD-506). Run: node tests/js/test-justice-tools-family.mjs
 *
 * Child support: the arithmetic of בע"מ 919/15 (under 6: the father alone owes the necessary needs and the children's
 * share of the mother's home, paras. 13-14 and 22; beyond that by income, para. 29(ב)), the ratio method as the Hadera
 * family court applied it (תלה"מ 42487-03-18, paras. 46-51: all needs x (income share - time share)), and the default of
 * para. 61. CPI linkage of a support amount against the wave-1 linkage engine, which is golden against the CBS calculator.
 * National Insurance: the 1.1.2026 table and the lower-of rule (s.3). Property balancing: ss.5, 5א, 6 and 14 of the 1973
 * law, the time rule for options (BS family court 16405-09-19, para. 23), and the specific-sharing scenario.
 * The prenup routes of ss.2(א)-(ג1) and the notary fee (item 11(א)-(ב) + VAT). The parenting plan: nights per pattern,
 * Hebrew-calendar holidays and the yearly turn. Every expected value here is computed by hand from the sources, not
 * read back from the engine.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as MZ from '../../assets/js/tools/mezonot-engine.js';
import * as MZUI from '../../assets/js/tools/mezonot-ui.js';
import * as IZ from '../../assets/js/tools/izun-engine.js';
import * as IZUI from '../../assets/js/tools/izun-ui.js';
import * as MM from '../../assets/js/tools/mamon-engine.js';
import * as MMUI from '../../assets/js/tools/mamon-ui.js';
import * as HR from '../../assets/js/tools/horut-engine.js';
import * as HK from '../../assets/js/tools/heskem-engine.js';
import * as HKUI from '../../assets/js/tools/heskem-ui.js';
import * as T04 from '../../assets/js/tools/hatzmada-engine.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.005) => Math.abs(a - b) <= eps;
const r10 = (x) => Math.round(x / 10) * 10;

/* ---------- Registry: the family datasets carry their sources and dates ---------- */
for (const k of ['child_support', 'property_balance', 'prenup', 'divorce_agreement']) {
	const d = reg[k];
	check(d && d.checked_on === '2026-10-14' && d.source_url.startsWith('https://') && d.refresh_every_days > 0, `${k}: https source, checked 14.10.2026, refresh period`);
}
const cs = reg.child_support;
check(cs.ruling.date === '2017-07-19' && cs.ruling.url.includes('supremedecisions.court.gov.il'), '919/15: 19.7.2017, from the Supreme Court site');
check(cs.needs.cases.length === 8 && cs.needs.cases.every((c) => c.url.startsWith('https://www.gov.il/') && c.total >= 1500 && c.total <= 2250), 'needs: eight judgments from gov.il, 1,500 to 2,250 per child');
check(cs.methods.ratio.official === false && cs.methods.para61.official === true, 'the Hadera copy is marked not official; 919/15 is');
check(cs.housing.default_pct.join() === '0,30,40,50', 'housing share: 30% / 40% / 50%');
const nii = Object.fromEntries(cs.nii.rows.map((x) => [x.key, x]));
check(cs.nii.from === '2026-01-01' && nii.woman0.under55 === 2076 && nii.woman1.under55 === 3478 && nii.woman2.under55 === 4049 && nii.woman2.over55 === 5289 && nii.remarried1.under55 === 2434 && nii.remarried2.under55 === 3569 && nii.guardian_extra.under55 === 1038, 'NII amounts from 1.1.2026 (btl.gov.il)');
const pn = reg.prenup;
check(pn.routes.notary.fee === 446 && pn.routes.notary.fee_copy === 74 && pn.vat.pct === 18 && pn.routes.court.fee === 541 && pn.routes.rabbinical.fee === 536 && pn.routes.registrar.fee === null, 'prenup fees: notary 446 + 74, VAT 18%, court 541, rabbinical 536, registrar unknown');

/* ---------- Child support: under 6, the father alone owes the necessary needs (919/15) ---------- */
{
	// One child aged 4. Necessary 1,300 of 2,000 needs; the children's share of the mother's home 30% x 5,000 = 1,500;
	// beyond the necessary 700 x the father's income share 14/23. High: no offset. Low: minus his in-kind spending on the
	// stay-dependent needs, 5/14 x 1,500 (paras. 59-60).
	const r = MZ.computeSupport(reg, { incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000, children: ['2022-03-01'], nightsA: 5, father: 'A', law: 'jewish', asOf: '2026-10-14' });
	const high = 1300 + 0.3 * 5000 + 700 * (14000 / 23000);
	const low = high - (5 / 14) * 1500;
	check(r.ok && r.payer === 'A' && r.high === r10(high) && r.low === r10(low), `under 6: the father pays ${r10(low)} to ${r10(high)} (engine ${r.low} to ${r.high})`);
	check(r.perChild[0].bracket === 'under6' && r.flags.some((f) => f.code === 'under6'), 'under 6: the bracket and the warning');
	// Mother as parent A: the sign flips, the amount stays.
	const m = MZ.computeSupport(reg, { incomeA: 9000, incomeB: 14000, housingA: 5000, housingB: 4500, children: ['2022-03-01'], nightsA: 9, father: 'B', law: 'jewish', asOf: '2026-10-14' });
	check(m.ok && m.payer === 'B' && m.high === r.high && m.low === r.low, 'under 6 with the father as parent B: the same amounts, B pays');
	// The necessary needs are owed even when the father earns less (para. 13).
	const poor = MZ.computeSupport(reg, { incomeA: 4000, incomeB: 20000, housingA: 3000, housingB: 6000, children: ['2023-01-01'], nightsA: 4, father: 'A', asOf: '2026-10-14' });
	check(poor.ok && poor.payer === 'A' && poor.low >= r10(0.3 * 6000), 'under 6: a father who earns less still owes at least the housing share and the necessary needs');
}

/* ---------- Child support: 6 to 15, the ratio method and para. 61 ---------- */
{
	// One child aged 9. Disposable income after each parent's own share of the home: 14,000 - 70% x 4,500 and
	// 9,000 - 70% x 5,000; time share 5/14; all needs per child 2,000 + the children's housing in both homes (30%).
	const r = MZ.computeSupport(reg, { incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000, children: ['2017-06-01'], nightsA: 5, father: 'A', law: 'jewish', asOf: '2026-10-14' });
	const sAd = (14000 - 0.7 * 4500) / ((14000 - 0.7 * 4500) + (9000 - 0.7 * 5000));
	const ratio = (sAd - 5 / 14) * (2000 + 0.3 * 4500 + 0.3 * 5000);
	const sA = 14000 / 23000;
	const p61 = (sA - 5 / 14) * 1500 + sA * 500;
	check(r.ok && r.payer === 'A' && r.high === r10(ratio) && r.low === r10(p61), `6-15: ratio method ${r10(ratio)}, para. 61 ${r10(p61)} (engine ${r.low} to ${r.high})`);
	check(r.perChild[0].bracket === '6to15' && near(r.ratio.income, sA, 1e-9), '6-15: the bracket and the income share');
	// The Hadera formula (paras. 46-51): two children, needs 1,600 + 500 each, housing 40% = 4,100 in all, so 8,300;
	// income share 65%, time share 6/14. The court rounded the time share to 43% and got 1,826, "1,830 rounded".
	const h = MZ.computeSupport(reg, { incomeA: 6500 + 0.6 * 10250, incomeB: 3500, housingA: 10250, housingB: 0, children: ['2010-01-01', '2011-01-01'], nightsA: 6, father: 'A', needsDependent: 1600, needsIndependent: 500, housingShare: 0.4, asOf: '2019-03-17' });
	const ratioSum = h.perChild.reduce((s, c) => s + c.values.ratio, 0);
	check(h.ok && near(ratioSum, r10(8300 * (0.65 - 6 / 14) / 2) * 2, 10.01), `the ratio method is the Hadera formula: 8,300 x (65% - 6/14) = ${(8300 * (0.65 - 6 / 14)).toFixed(2)} (engine ${ratioSum})`);
	check(r10(8300 * (0.65 - 0.43)) === 1830, 'with the court\'s rounded 43%: 1,830, as in para. 51');
	// Equal time and equal income: nothing moves (para. 61).
	const eq = MZ.computeSupport(reg, { incomeA: 10000, incomeB: 10000, housingA: 4000, housingB: 4000, children: ['2016-01-01'], nightsA: 7, father: 'A', asOf: '2026-10-14' });
	check(eq.ok && Math.abs(eq.low) <= 260 && Math.abs(eq.high) <= 260 && eq.flags.some((f) => f.code === 'equal'), 'equal time and income: little or no transfer, and the para. 61 note');
	// 15 to 18: both parents, by means (paras. 20, 29(ד)).
	const t = MZ.computeSupport(reg, { incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000, children: ['2010-03-01'], nightsA: 5, father: 'A', asOf: '2026-10-14' });
	check(t.ok && t.perChild[0].bracket === '15to18' && t.flags.some((f) => f.code === 'over15'), '15-18: the bracket and the warning');
	// Periods: the amount changes on the 6th, 15th and 18th birthdays; service at a third.
	const p = MZ.computeSupport(reg, { incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000, children: ['2022-03-01', '2017-06-01'], nightsA: 5, father: 'A', asOf: '2026-10-14' });
	check(p.periods[1].from === '2028-03-01' && p.periods.some((x) => x.from === '2035-06-01' && x.ages.join() === '13') && p.service.length === 2 && p.service[0].from === '2040-03-01', 'periods break on the 6th and 18th birthdays (6-15 and 15-18 share one formula); service from the 18th');
	check(p.service.every((s) => s.high <= r10(Math.max(...p.periods.map((x) => x.high)) / 3) + 10), 'service: a third of the amount');
	// Errors.
	check(!MZ.computeSupport(reg, { incomeA: 1000, children: [] }).ok && !MZ.computeSupport(reg, { incomeA: 1000, children: ['2001-01-01'], asOf: '2026-10-14' }).ok && !MZ.computeSupport(reg, { incomeA: 1000, children: ['2020-01-01'], nightsA: 15 }).ok, 'no child, only adults, or more than 14 nights: an error, never a figure');
}

/* ---------- CPI linkage of support, against the wave-1 linkage engine (golden against the CBS) ---------- */
{
	const x = MZ.indexSupport(reg, { amount: 3000, base: '2023-02-10', every: 3, asOf: '2026-10-14' });
	const link = T04.compute(reg, { principal: 3000, start: '2023-02-10', end: x.lastUpdate, mode: 'link' });
	check(x.ok && x.lastUpdate === '2026-08-10' && x.next === '2026-11-10' && near(x.current, link.total, 0.011), `3,000 from 10.2.2023, every 3 months: ${x.current} = the linkage engine ${link.total}`);
	check(x.baseMonth === '2022-12' && x.updates.every((u) => u.day.slice(8) === '10'), 'the base index is the one known on 10.2.2023 (December 2022); updates on the 10th');
	const y = MZ.indexSupport(reg, { amount: 3000, base: '2023-02-20', every: 12, asOf: '2026-10-14' });
	check(y.ok && y.baseMonth === '2023-01' && y.lastUpdate === '2026-02-20' && y.updates.length === 3, 'after the 15th the January index is known; yearly updates');
	check(!MZ.indexSupport(reg, { amount: 3000, base: '2027-01-01', asOf: '2026-10-14' }).ok && !MZ.indexSupport(reg, { amount: 0, base: '2023-01-01' }).ok, 'a future base day or no amount: an error');
}

/* ---------- National Insurance: the table and the lower of the two (s.3) ---------- */
{
	check(MZ.mzNii(reg, { children: 2 }).amount === 4049 && MZ.mzNii(reg, { children: 2, over55: true }).amount === 5289, 'two children: 4,049; from 55: 5,289');
	check(MZ.mzNii(reg, { children: 1, judgment: 2500 }).amount === 2500 && MZ.mzNii(reg, { children: 1, judgment: 2500 }).lower, 'a judgment lower than the table: the judgment');
	check(MZ.mzNii(reg, { children: 3, remarried: true }).amount === 3569 && MZ.mzNii(reg, { children: 1, remarried: true }).amount === 2434, 'remarried: the children\'s part');
	check(MZ.mzNii(reg, { children: 0, remarried: true }).ok === false, 'remarried with no children: no payment, never the woman-alone amount');
}

/* ---------- Property balancing: the statute, by hand ---------- */
{
	const base = { marriage: '2010-01-01', breakDate: '2025-01-01' };
	const r = IZ.computeBalance(reg, Object.assign({}, base, {
		items: [
			{ kind: 'home', owner: 'joint', value: 2000000, mortgage: 600000 },
			{ kind: 'pension', owner: 'a', value: 500000, atMarriage: 100000 },
			{ kind: 'pension', owner: 'b', value: 200000, atMarriage: 0 },
			{ kind: 'savings', owner: 'a', value: 100000, exclude: 'inheritance' },
			{ kind: 'debt', owner: 'b', value: 50000 },
		],
	}));
	// A: half the home 1,000,000 + pension accrued 400,000 - half the mortgage 300,000 = 1,100,000.
	// B: 1,000,000 + 200,000 - 300,000 - 50,000 = 850,000. Half the difference: 125,000 from A (s.6(ב)).
	check(r.ok && r.a.net === 1100000 && r.b.net === 850000 && r.payer === 'a' && r.pay === 125000, `ss.5-6: A pays B 125,000 (engine ${r.payer} ${r.pay})`);
	check(r.lines.find((l) => l.kind === 'savings').counted === 0 && r.a.excluded === 200000, 'an inheritance and the pension held on the wedding day stay out (s.5(א)(1))');
	const linked = IZ.computeBalance(reg, Object.assign({}, base, { items: [{ kind: 'savings', owner: 'a', value: 300000 }, { kind: 'debt', owner: 'a', value: 100000, linked: true }] }));
	check(linked.ok && linked.pay === 150000, 'a debt tied to an excluded asset is not deducted (s.6(א))');
	// A home bought in the marriage in A's name: balanced; with specific sharing proven it is half each.
	const one = IZ.computeBalance(reg, Object.assign({}, base, { items: [{ kind: 'home', owner: 'a', value: 1000000 }] }));
	check(one.ok && one.payer === 'a' && one.pay === 500000 && one.sharedHome && one.sharedHome.pay === 0 && one.flags.some((f) => f.code === 'home_one_name'), 'a home in one name: 500,000 in the balance, or half each if sharing is proven (1398/11)');
	// Active increase in value of a premarital home is balanced, passive is not (3462/23).
	const act = IZ.computeBalance(reg, Object.assign({}, base, { items: [{ kind: 'home', owner: 'a', value: 1800000, exclude: 'premarital', activeGain: 300000 }] }));
	check(act.ok && act.pay === 150000, 'a premarital home: only the active gain is balanced (3462/23)');
	// Before 1.1.1974: out of scope (s.14).
	const old = IZ.computeBalance(reg, { marriage: '1970-01-01', breakDate: '2025-01-01', before1974: true, items: [] });
	check(old.ok === false && old.outOfScope, 'married before 1974: out of scope, no figure');
	// Early balancing (s.5א): a year after the proceeding, or 9 months apart.
	const e = IZ.computeBalance(reg, Object.assign({}, base, { filed: '2025-03-01', apart: '2025-01-15', items: [{ kind: 'savings', owner: 'a', value: 1000 }] }));
	const ed = Object.fromEntries(e.early.map((x) => [x.key, x.date]));
	check(ed.filed === '2026-03-01' && ed.apart === '2025-10-15', 's.5א: 1.3.2026 after the claim, 15.10.2025 after 9 months apart');
}

/* ---------- Options and RSUs: the time rule, tranche by tranche (16405-09-19, para. 23) ---------- */
{
	// 400 RSUs granted 1.1.2020, four yearly tranches to 1.1.2024; break date 1.7.2022; price 100.
	// Tranches 1-2 vested in the marriage: whole. Tranche 3: 912 of 1,096 days; tranche 4: 912 of 1,461 days.
	const g = { owner: 'a', units: 400, price: 100, strike: 0, grant: '2020-01-01', vestStart: '2020-01-01', vestEnd: '2024-01-01', tranches: 4 };
	const o = IZ.izOptions(reg.property_balance, g, '2015-01-01', '2022-07-01');
	const time = 100 * 100 * (2 + 912 / 1096 + 912 / 1461);
	check(near(o.balanced.time, time, 0.02) && o.balanced.vested === 20000 && o.balanced.granted === 40000, `time rule ${time.toFixed(2)} (engine ${o.balanced.time}); vested 20,000; granted 40,000`);
	check(o.rows.map((x) => x.vest).join() === '2021-01-01,2022-01-01,2023-01-01,2024-01-01', 'tranches vest on the grant-letter calendar days');
	const r = IZ.computeBalance(reg, { marriage: '2015-01-01', breakDate: '2022-07-01', items: [], options: [g] });
	check(r.ok && r.range.min === 20000 && r.range.max === 40000 && near(r.pay, time / 2, 0.02), 'the headline uses the time rule; the range spans vested to granted');
	const c = IZ.computeBalance(reg, { marriage: '2015-01-01', breakDate: '2022-07-01', items: [], crypto: [{ owner: 'b', units: 0.5, priceBreak: 60000, priceToday: 100000, where: 'wallet' }] });
	check(c.ok && c.payer === 'b' && c.pay === 25000 && c.range.min === -50000 && c.range.max === -30000 && c.flags.some((f) => f.code === 'wallet'), 'crypto: today by default, the break-date value in the range, a private-wallet flag');
}

/* ---------- Prenup: who can validate it, and the cost ---------- */
{
	const ok = MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'separate', copies: 2 });
	check(ok.ok && ok.cost.total === Math.round((446 + 74) * 1.18 * 100) / 100, `notary, two copies: (446 + 74) x 1.18 = ${((446 + 74) * 1.18).toFixed(2)}`);
	check(!MM.draftMamon(reg, { timing: 'during', route: 'notary' }).ok && !MM.draftMamon(reg, { timing: 'during', route: 'registrar' }).ok, 'after the wedding: no notary, no registrar (s.2(א); procedure s.89(ו))');
	check(MM.draftMamon(reg, { timing: 'during', route: 'court' }).ok && MM.draftMamon(reg, { timing: 'during', route: 'rabbinical' }).ok, 'after the wedding: the family court or the rabbinical court');
	check(!MM.draftMamon(reg, { timing: 'cohab', route: 'rabbinical' }).ok && MM.draftMamon(reg, { timing: 'cohab', route: 'court' }).ok, 'cohabitants: the family court, not the rabbinical court');
	check(ok.text.includes('מזונות') && ok.text.includes('12(א)'), 'the draft says it does not set child support (Maintenance Law s.12(א))');
	check(MM.draftMamon(reg, { timing: 'before', route: 'registrar' }).cost.known === false, 'the registrar: no fee is invented');
	check(MMUI.snapshot(reg).sticky === MMUI.stickyFigure(ok.ok ? MM.draftMamon(reg, MMUI.EXAMPLE) : ok), 'the server sticky figure is the client\'s');
}

/* ---------- Parenting plan: nights, Hebrew holidays, the yearly turn ---------- */
{
	const counts = Object.fromEntries(Object.keys(HR.HR_PATTERNS).map((k) => [k, HR.hrCount(HR.hrNights(k))]));
	check(counts.weekends === 2 && counts.weekends_mid === 4 && counts.weekends_2mid === 6 && counts.two_two_five === 7 && counts.three_four === 7 && counts.week_week === 7, 'nights per pattern: 2, 4, 6, 7, 7, 7');
	check(HR.hrCount(HR.hrNights('custom', [0, 3, 13, 14, -1])) === 3, 'custom nights: only 0-13 count');
	const p = HR.hrPlan({ pattern: 'weekends_mid', holidays: 'alternate', from: '2026-10-14' });
	const y = Object.fromEntries(p.years[0].map((h) => [h.key, h]));
	const z = Object.fromEntries(p.years[1].map((h) => [h.key, h]));
	check(y.hanukkah.start === '2026-12-04' && y.purim.start === '2027-03-22' && y.pesach.start === '2027-04-21' && y.indep.end === '2027-05-12' && y.shavuot.start === '2027-06-10', '5787: Hanukkah eve 4.12.2026, Purim (Adar II) 23.3.2027, Seder 21.4.2027, Independence Day 12.5.2027, Shavuot eve 10.6.2027');
	check(z.rh.start === '2027-10-01' && z.indep.end === '2028-05-02', '5788: Rosh Hashana eve 1.10.2027; Independence Day moves from Monday to Tuesday 2.5.2028');
	check(['hanukkah', 'pesach', 'shavuot', 'summer'].every((k) => y[k].who !== z[k].who), 'each holiday changes hands the next year');
	check(p.years[0].every((h) => h.end >= '2026-10-14'), 'holidays already past are left out');
	const gap = HR.hrPlan({ pattern: 'weekends', holidays: 'alternate', from: '2026-09-02' });
	check(gap.years.length === 2 && gap.years[0][0].key === 'rh', 'between the summer and Rosh Hashana the plan still shows two whole years');
	const s = HR.hrPlan({ pattern: 'two_two_five', holidays: 'split', from: '2026-10-14' });
	const ps = s.years[0].find((h) => h.key === 'pesach');
	check(ps.halves && ps.halves[0].from === '2027-04-21' && ps.halves[1].to === '2027-04-28' && ps.halves[0].who !== ps.halves[1].who, 'split: Pesach in two halves, one to each parent');
}

/* ---------- The divorce agreement: one document from the three engines ---------- */
{
	const d = HK.draftAgreement(reg, { route: 'family', from: '2026-10-14', children: ['2018-05-01', '2021-09-15'], custody: 'joint', parentA: 'אבא', pattern: 'weekends_2mid', holidays: 'alternate', support: { incomeA: 15000, incomeB: 9000, housingA: 4000, housingB: 5500 }, property: { home: 'b_keeps', homeValue: 2500000, mortgage: 800000, aAssets: 300000, bAssets: 150000, aDebts: 20000, pension: true } });
	const sup = MZ.computeSupport(reg, { incomeA: 15000, incomeB: 9000, housingA: 4000, housingB: 5500, children: ['2018-05-01', '2021-09-15'], nightsA: 6, father: 'A', asOf: '2026-10-14' });
	check(d.ok && d.plan.nightsA === 6 && d.amount === r10((sup.low + sup.high) / 2) && d.payer === 'A', `support in the draft: the middle of the range ${sup.low}-${sup.high}, from the same nights`);
	check(d.text.includes('האב ישלם לאם') && !d.text.includes('ישלם להאם') && !d.text.includes('תשלם לאם'), 'the draft names the payer in correct Hebrew');
	check(d.text.includes('סעיף 24') && d.text.includes('919/15') && d.text.includes('סעיף 6(ב)'), 'the draft cites s.24, 919/15 and s.6(ב)');
	const o = HK.draftAgreement(reg, { onlyPlan: true, from: '2026-10-14', children: ['2018-05-01'], pattern: 'two_two_five', holidays: 'split' });
	check(o.ok && o.only && o.plan.nightsA === 7 && !o.text.includes('מזונות הילדים'), 'plan only: no support chapter');
	check(!HK.draftAgreement(reg, { onlyPlan: true, from: '2026-10-14', children: [] }).ok, 'a parenting plan with no child: an error');
	const nk = HK.draftAgreement(reg, { from: '2026-10-14', children: [], property: { home: 'a_keeps', homeValue: 2000000, mortgage: 500000 } });
	check(nk.ok && nk.kids === 0 && nk.text.includes('"הבעל"') && !nk.text.includes('נספח א\'')&& !nk.text.includes('הילדים') && nk.text.includes('חלקה של האישה'), 'no children: husband and wife, no annex, no word about children');
}

/* ---------- Review fixes (PR 130, Codex pass 1) ---------- */
{
	// A shared link keeps an explicit 0 apart from a blank (a 0% housing share is not "the default").
	const keys = ['o', 'p', 'l', 'i', 'k', 'n', 'd', 'c', 'x', 'a', 'b'];
	const zero = Object.assign({}, MZUI.EXAMPLE, { housingShare: 0, necessary: '', nii: { over55: false, remarried: false, judgment: 0 } });
	const back = MZUI.modelOf(decodeState(`#s=${MZUI.stateOf(zero)}`, keys));
	check(back.housingShare === 0 && back.necessary === '' && back.nii.judgment === 0, 'share link: 0% housing and a 0 judgment survive; a blank stays blank');
	const r0 = MZ.computeSupport(reg, Object.assign(MZUI.toSupportInput(back), { asOf: '2026-10-14' }));
	const rz = MZ.computeSupport(reg, Object.assign(MZUI.toSupportInput(zero), { asOf: '2026-10-14' }));
	check(r0.ok && r0.low === rz.low && r0.high === rz.high && r0.housingShare === 0, 'the shared link gives the same result as the screen');
	const izKeys = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
	const izBack = IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(IZUI.EXAMPLE)}`, izKeys));
	const sameSide = (x, y) => Object.keys(y).every((k) => String((x[k] || [])[0] ?? '') === String(y[k][0] ?? '') && String((x[k] || [])[1] ?? '') === String(y[k][1] ?? ''));
	const zeroAt = Object.assign({}, IZUI.EXAMPLE, { b: Object.assign({}, IZUI.EXAMPLE.b, { pension: [260000, 0] }) });
	const izZero = IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(zeroAt)}`, izKeys));
	check(sameSide(izBack.a, IZUI.EXAMPLE.a) && sameSide(izBack.b, IZUI.EXAMPLE.b) && izZero.b.pension[1] === 0 && izBack.a.severance[1] === '', 'balance link: a 0 on the wedding day stays 0, a blank stays blank');
	// An agreed amount needs no incomes, and keeps its payer when the estimate methods cross zero.
	const base = { route: 'family', from: '2026-10-14', children: ['2018-05-01'], parentA: 'אבא', pattern: 'weekends_2mid', holidays: 'alternate' };
	const noInc = HK.draftAgreement(reg, Object.assign({}, base, { support: { amount: 2500 } }));
	check(noInc.ok && noInc.amount === 2500 && noInc.payer === 'A' && noInc.text.includes('האב ישלם לאם מזונות לילדים בסך 2,500'), 'an agreed amount with no incomes: the draft is made, the parent with fewer nights pays');
	const cross = HK.draftAgreement(reg, Object.assign({}, base, { pattern: 'two_two_five', support: { incomeA: 5000, incomeB: 6000, housingA: 3000, housingB: 3000, amount: 3000 } }));
	check(cross.ok && cross.payer && cross.text.includes('3,000') && !cross.text.includes('ואין ביניהם תשלום מזונות חודשי'), 'an agreed 3,000 is never replaced by "no monthly payment" when the methods cross zero');
	const chosen = HK.draftAgreement(reg, Object.assign({}, base, { support: { amount: 1800, payer: 'B' } }));
	check(chosen.ok && chosen.payer === 'B' && chosen.text.includes('האם תשלם לאב מזונות לילדים בסך 1,800'), 'the payer the user chose is the payer in the draft');
	const none = HK.draftAgreement(reg, Object.assign({}, base, { support: { amount: 0 } }));
	check(none.ok && none.text.includes('הסכימו שאין ביניהם תשלום מזונות חודשי'), 'an agreed 0: no monthly payment, in words');
	// A buyout of the joint home states its price: half the net equity.
	const buy = HK.draftAgreement(reg, Object.assign({}, base, { support: { amount: 2000 }, property: { home: 'a_keeps', homeValue: 2000000, mortgage: 500000 } }));
	check(buy.ok && buy.buyout.amount === 750000 && buy.text.includes('תמורת 750,000') && buy.text.includes('מחצית ההון העצמי'), 'the buyout clause: 750,000 for a 2,000,000 home with 500,000 left on the mortgage');
	const under = HK.draftAgreement(reg, Object.assign({}, base, { support: { amount: 2000 }, property: { home: 'b_keeps', homeValue: 900000, mortgage: 1000000 } }));
	check(under.ok && under.buyout.amount === 0 && under.text.includes('בלי תמורה'), 'a home under water: no price, and the reason');
	// The specific-sharing scenario changes the family home only, never an inherited flat.
	const two = IZ.computeBalance(reg, { marriage: '2010-01-01', breakDate: '2025-01-01', items: [
		{ kind: 'home', main: true, owner: 'a', value: 1000000 },
		{ kind: 'home', owner: 'b', value: 800000, exclude: 'inheritance' },
	] });
	check(two.ok && two.pay === 500000 && two.sharedHome && two.sharedHome.pay === 0, 'shared-home scenario: the inherited flat stays out (A pays 500,000; with sharing, 0, not 400,000)');
}

/* ---------- Review fixes (PR 130, Codex pass 2) ---------- */
{
	const base = { route: 'family', from: '2026-10-14', children: ['2018-05-01'], parentA: 'אבא', pattern: 'weekends_2mid', holidays: 'alternate', support: { amount: 2000 } };
	const noValue = HK.draftAgreement(reg, Object.assign({}, base, { property: { home: 'a_keeps' } }));
	check(noValue.ok && noValue.text.includes('תמורת _') && !noValue.text.includes('בלי תמורה'), 'a buyout with no home value leaves the price blank, never "without consideration"');
	const debtsOnly = HK.draftAgreement(reg, Object.assign({}, base, { property: { aDebts: 40000 } }));
	check(debtsOnly.ok && debtsOnly.clauses.some((c) => c.title === 'הרכוש') && debtsOnly.balance && debtsOnly.balance.pay === 0 && debtsOnly.balance.flags.some((f) => f.code === 'debts_exceed'), 'debts alone make a property chapter, and a personal debt is not passed to the other spouse (6839/19)');
	const deep = IZ.computeBalance(reg, { marriage: '2010-01-01', breakDate: '2025-01-01', items: [{ kind: 'savings', owner: 'a', value: 50000 }, { kind: 'debt', owner: 'a', value: 200000 }, { kind: 'savings', owner: 'b', value: 100000 }] });
	check(deep.ok && deep.a.net === 0 && deep.a.rawNet === -150000 && deep.payer === 'b' && deep.pay === 50000, 'debts above assets count as zero: B pays half of its own 100,000, not half of 250,000');
	const pensionOnly = HK.draftAgreement(reg, Object.assign({}, base, { property: { pension: true } }));
	check(pensionOnly.ok && pensionOnly.text.includes('חוק לחלוקת חיסכון פנסיוני'), 'the pension division alone makes a property chapter');
	const badDate = HK.draftAgreement(reg, Object.assign({}, base, { children: ['2031-01-01'] }));
	check(!badDate.ok && badDate.errors.some((e) => /אחרי היום/.test(e.he)), 'an agreed amount does not hide a birth date in the future');
	const exDebt = IZ.computeBalance(reg, { marriage: '2010-01-01', breakDate: '2025-01-01', items: [{ kind: 'savings', owner: 'a', value: 100000 }, { kind: 'debt', owner: 'a', value: 60000, exclude: 'agreed' }] });
	check(exDebt.ok && exDebt.pay === 50000 && exDebt.lines.find((l) => l.kind === 'debt').counted === 0, 'a debt agreed in writing to be left out is not deducted');
	const fromUi = IZUI.toInput(Object.assign({}, IZUI.EXAMPLE, { others: [{ owner: 'a', kind: 'debt', value: 60000, exclude: 'agreed' }] }));
	check(fromUi.items.some((it) => it.kind === 'debt' && it.linked === true), 'the form marks an excluded debt as not deducted');
	const noPrice = IZ.computeBalance(reg, { marriage: '2015-01-01', breakDate: '2022-07-01', items: [], options: [{ owner: 'a', units: 400, price: '', strike: 0, grant: '2020-01-01', vestStart: '2020-01-01', vestEnd: '2024-01-01', tranches: 4 }] });
	check(!noPrice.ok && noPrice.errors.some((e) => e.field === 'opt-0-price'), 'options with no price: an error, never a zero value');
}

/* ---------- Review fixes (PR 130, Codex pass 3) ---------- */
{
	const plan = (kids) => HK.draftAgreement(reg, { onlyPlan: true, from: '2026-10-14', children: kids, pattern: 'two_two_five', holidays: 'split' });
	check(!plan(['not-a-date']).ok && !plan(['2030-01-01']).ok && plan(['2019-03-01']).ok, 'a parenting plan alone still rejects a bad or future birth date');
	const bad = MZ.mzNii(reg, { children: 1, judgment: Number.NaN });
	check(bad.ok === false && bad.errors[0].field === 'judgment' && MZ.mzNii(reg, { children: 1, judgment: -5 }).ok === false, 'a malformed or negative judgment is an input error, never the full table amount');
	check(MZ.mzNii(reg, { children: 1, judgment: '' }).amount === 3478, 'no judgment entered: the table amount');
	const hkKeys = ['o', 'r', 'a', 'k', 'c', 'p', 'n', 'h', 'f', 's', 'q'];
	const zeroHome = Object.assign({}, HKUI.EXAMPLE, { property: Object.assign({}, HKUI.EXAMPLE.property, { home: 'a_keeps', homeValue: 0 }) });
	const hkBack = HKUI.modelOf(decodeState(`#s=${HKUI.stateOf(zeroHome)}`, hkKeys));
	const blankHome = HKUI.modelOf(decodeState(`#s=${HKUI.stateOf(Object.assign({}, zeroHome, { property: Object.assign({}, zeroHome.property, { homeValue: '' }) }))}`, hkKeys));
	check(hkBack.property.homeValue === 0 && blankHome.property.homeValue === '', 'agreement link: a 0 home value stays 0, a blank stays blank');
	const izKeys = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
	const zeroPrice = Object.assign({}, IZUI.EXAMPLE, { options: [Object.assign({}, IZUI.EXAMPLE.options[0], { price: 0 })], crypto: [Object.assign({}, IZUI.EXAMPLE.crypto[0], { priceBreak: 0 })] });
	const izBack = IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(zeroPrice)}`, izKeys));
	check(izBack.options[0].price === 0 && izBack.crypto[0].priceBreak === 0 && IZ.computeBalance(reg, IZUI.toInput(izBack)).ok, 'balance link: a 0 option or crypto price stays 0 and still computes');
}

/* ---------- Review fixes (PR 130, Codex pass 4) ---------- */
{
	const pct = (v) => MZ.computeSupport(reg, MZUI.toSupportInput(Object.assign({}, MZUI.EXAMPLE, { housingShare: v, asOf: '2026-10-14' })));
	check(pct(1).housingShare === 0.01 && pct(40).housingShare === 0.4 && pct(0.5).housingShare === 0.005, 'the form\'s housing share is a percent: 1 means 1%, never 100%');
	check(!MZ.computeSupport(reg, { incomeA: 10000, children: ['2016-01-01'], housingShare: 40 }).ok, 'the engine takes a fraction and rejects 40 instead of guessing');
	const nii = (births) => MZ.mzNii(reg, { births, asOf: '2026-10-14' });
	check(nii(['2016-01-01', '2004-01-01']).amount === 3478 && nii(['2016-01-01', '2018-01-01']).amount === 4049, 'National Insurance counts only children under 18: one minor and one adult is the one-child row');
	check(nii(['2016-01-01', 'bad']).ok === false && nii(['2030-01-01']).ok === false, 'a bad or future birth date in the NII mode is an input error');
	const half = IZ.computeBalance(reg, { marriage: '2010-01-01', breakDate: '2025-01-01', items: [{ kind: 'pension', owner: 'a', value: '', atMarriage: 50000 }] });
	check(!half.ok && half.errors.some((e) => e.field === 'item-0-value'), 'a wedding-day amount with no value today: an error, never a zero pension');
	const izKeys5 = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
	const zz = Object.assign({}, IZUI.EXAMPLE, { a: Object.assign({}, IZUI.EXAMPLE.a, { severance: [0, 0] }) });
	const zzBack = IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(zz)}`, izKeys5));
	check(zzBack.a.severance[0] === 0 && zzBack.a.severance[1] === 0 && IZ.computeBalance(reg, IZUI.toInput(zzBack)).ok, 'balance link: a 0 value today with a 0 on the wedding day survives and still computes (Codex pass 5)');
}

/* ---------- Review fixes (PR 130, Codex pass 6) ---------- */
{
	const base = { route: 'family', from: '2026-10-14', children: ['2018-05-01'], parentA: 'אבא', pattern: 'weekends_2mid', holidays: 'alternate', support: { amount: 2000 } };
	const noChoice = HK.draftAgreement(reg, Object.assign({}, base, { property: { home: 'none', homeValue: 2000000, mortgage: 500000 } }));
	check(!noChoice.ok && noChoice.errors.some((e) => e.field === 'property-home'), 'a home value with no choice of sell or keep: an error, never a draft without the home');
	const copies = (n) => MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'separate', copies: n });
	check(!copies(1.5).ok && !copies(-1).ok && copies(3).ok && copies(3).cost.extra === 148, 'notary copies: a whole number from 1; three copies add 2 x 74');
	check(MM.draftMamon(reg, { timing: 'before', route: 'court', regime: 'separate', home: 'none', residenceMonths: 99 }).ok, 'a hidden residence period never blocks a draft without a home of one spouse');
	check(!MM.draftMamon(reg, { timing: 'before', route: 'court', regime: 'separate', home: 'a', residenceMonths: 99 }).ok, 'with a home of one spouse, the residence period is checked');
}

/* ---------- Review fixes (PR 130, Codex pass 7) ---------- */
{
	const hkKeys = ['o', 'r', 'a', 'k', 'c', 'p', 'n', 'h', 'f', 's', 'q'];
	const childless = Object.assign({}, HKUI.EXAMPLE, { children: [], property: Object.assign({}, HKUI.EXAMPLE.property, { home: 'sell' }) });
	const back = HKUI.modelOf(decodeState(`#s=${HKUI.stateOf(childless)}`, hkKeys));
	check(back !== null && back.children.length === 0 && back.property.home === 'sell', 'a childless agreement restores from its link');
	const mOnly = IZ.computeBalance(reg, { marriage: '2010-01-01', breakDate: '2025-01-01', items: [{ kind: 'home', owner: 'a', mortgage: 600000 }] });
	check(!mOnly.ok && mOnly.errors.some((e) => e.field === 'item-0-value'), 'a mortgage with no home value: an error, never a debt against a zero home');
	const tr = (t) => IZ.computeBalance(reg, { marriage: '2015-01-01', breakDate: '2022-07-01', items: [], options: [{ owner: 'a', units: 400, price: 100, strike: 0, grant: '2020-01-01', vestStart: '2020-01-01', vestEnd: '2024-01-01', tranches: t }] });
	check(!tr(0).ok && !tr(1.5).ok && !tr(Number.NaN).ok && tr(4).ok && tr('').ok, 'tranches: a whole number from 1, or blank for one; 0, 1.5 and text are errors');
}

/* ---------- Review fixes (PR 130, Codex pass 8) ---------- */
{
	const sB = MZ.computeSupport(reg, { incomeA: 3000, incomeB: 3000, housingA: 2000, housingB: 2000, children: ['2010-03-01'], nightsA: 8, father: 'A', asOf: '2026-10-14' });
	check(sB.ok && sB.service.every((x) => x.low <= x.high), 'the service range keeps its order when parent B pays');
	const izKeys = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
	const zeroHome = Object.assign({}, IZUI.EXAMPLE, { home: Object.assign({}, IZUI.EXAMPLE.home, { value: 0, mortgage: 300000 }) });
	const back = IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(zeroHome)}`, izKeys));
	check(back.home.value === 0 && IZ.computeBalance(reg, IZUI.toInput(back)).ok, 'balance link: a 0 home value with a mortgage survives and still computes');
}

/* ---------- Review fixes (PR 130, Codex pass 9) ---------- */
{
	const gainOnly = IZ.computeBalance(reg, IZUI.toInput(Object.assign({}, IZUI.EXAMPLE, { home: { value: '', mortgage: '', owner: 'a', source: 'premarital', activeGain: 500000 } })));
	check(!gainOnly.ok, 'an active gain with no home value: an error, never a result without the home');
	check(!MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'separate', wedding: '31.2.2027' }).ok && MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'separate', wedding: '2027-05-12' }).ok, 'a malformed wedding date is an input error');
	const hkKeys = ['o', 'r', 'a', 'k', 'c', 'p', 'n', 'h', 'f', 's', 'q'];
	const zeroTotals = Object.assign({}, HKUI.EXAMPLE, { property: { home: 'none', aAssets: 0, bAssets: '', aDebts: '', bDebts: '', pension: false } });
	const back = HKUI.modelOf(decodeState(`#s=${HKUI.stateOf(zeroTotals)}`, hkKeys));
	check(back.property.aAssets === 0 && back.property.bAssets === '', 'agreement link: a 0 property total stays 0, a blank stays blank');
}

/* ---------- Review fixes (PR 130, Codex pass 10) ---------- */
{
	const base = { route: 'family', from: '2026-10-14', parentA: 'אבא', pattern: 'weekends_2mid', holidays: 'alternate' };
	const two = HK.draftAgreement(reg, Object.assign({}, base, { children: ['2009-01-01', '2018-01-01'], support: { incomeA: 15000, incomeB: 9000, housingA: 4000, housingB: 5000 } }));
	const step = two.support.periods[1];
	check(two.ok && two.text.includes(`מ-${step.from.split('-').reverse().map(Number).join('.')}:`) && two.text.includes('הסכום משתנה כשילד מגיע לגיל 6, 15 או 18'), 'the draft steps the amount down on the dates the engine changes it');
	const agreed = HK.draftAgreement(reg, Object.assign({}, base, { children: ['2009-01-01', '2018-01-01'], support: { amount: 3000 } }));
	check(agreed.ok && agreed.text.includes('1,500 ש"ח לכל ילד'), 'an agreed amount for two children: 1,500 per child, ending child by child');
	const early = IZ.computeBalance(reg, { marriage: '2020-01-01', breakDate: '2025-01-01', filed: '2010-01-01', items: [{ kind: 'savings', owner: 'a', value: 1000 }] });
	check(!early.ok && early.errors.some((e) => e.field === 'filed'), 'a claim dated before the marriage is an input error');
	const g = (fruits) => MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'graded', home: 'a', fruits }).text;
	check(g(true) !== g(false), 'the fruits choice changes the graded agreement');
}

/* ---------- Review fixes (PR 130, Codex pass 11) ---------- */
{
	const base = { route: 'family', from: '2026-10-14', parentA: 'אבא', pattern: 'week_week', holidays: 'alternate' };
	const tie = HK.draftAgreement(reg, Object.assign({}, base, { children: ['2018-01-01'], support: { amount: 1200 } }));
	check(tie.ok && tie.payer === null && tie.text.includes('ישלם ל_') && tie.flags.some((f) => f.code === 'payer'), 'equal nights and incomes: the payer stays blank and the tool asks for it');
	const three = HK.draftAgreement(reg, Object.assign({}, base, { pattern: 'weekends', children: ['2012-01-01', '2015-01-01', '2018-01-01'], support: { amount: 1000 } }));
	check(three.ok && three.text.includes('333 ש"ח לכל ילד, ועוד 1 ש"ח לילד הצעיר'), 'per-child shares add up to the agreed total (333 x 3 + 1)');
	check(!MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'graded', home: 'none' }).ok && !MM.draftMamon(reg, { timing: 'before', route: 'notary', regime: 'graded', home: 'joint_new' }).ok, 'a graded agreement needs a home of one spouse');
}

/* ---------- Review fixes (PR 130, Codex pass 12) ---------- */
{
	check(MM.draftMamon(reg, { timing: 'during', route: 'court', regime: 'separate', wedding: '2019-06-20' }).text.includes('נשואים זה לזה מיום 20.6.2019'), 'after the wedding, the entered wedding date is in the recital');
	const izKeys = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
	const zeroBiz = Object.assign({}, IZUI.EXAMPLE, { others: [{ owner: 'a', kind: 'business', value: 0, exclude: '' }] });
	const back = IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(zeroBiz)}`, izKeys));
	check(back.others.length === 1 && back.others[0].value === 0 && IZ.computeBalance(reg, IZUI.toInput(back)).flags.some((f) => f.code === 'business'), 'balance link: a 0-valued extra asset survives with its warning');
}

/* ---------- Review fixes (PR 130, Codex pass 13) ---------- */
{
	const base = { route: 'family', from: '2026-10-14', parentA: 'אבא', pattern: 'week_week', holidays: 'alternate' };
	const mixed = HK.draftAgreement(reg, Object.assign({}, base, { children: ['2016-01-01', '2018-01-01'], support: { incomeA: 8000, incomeB: 12000, housingA: 8000, housingB: 4000 } }));
	check(mixed.ok && mixed.support.payer === null && !mixed.text.includes('ואין ביניהם תשלום מזונות חודשי') && mixed.text.includes('השיטות חלוקות בכיוון התשלום') && mixed.flags.some((f) => f.code === 'mixed'), 'a range that crosses zero is left to the parents, never "no payment"');
	const adultOnly = HK.draftAgreement(reg, { onlyPlan: true, from: '2026-10-14', children: ['2000-01-01'], pattern: 'two_two_five', holidays: 'split' });
	check(!adultOnly.ok, 'a parenting plan for an adult only: an error');
	const mix = HK.draftAgreement(reg, Object.assign({}, base, { children: ['2000-01-01', '2018-01-01'], support: { amount: 1500 } }));
	check(mix.ok && mix.kids === 1 && mix.text.includes('ילדים שמלאו להם 18 אינם בכלל ההסדרים') && mix.text.includes('נולדו 2 ילדים') && !mix.text.includes('1.1.2000'), 'an adult child is counted in the recital only, not in custody or support');
	const izKeys = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
	const badTr = Object.assign({}, IZUI.EXAMPLE, { options: [Object.assign({}, IZUI.EXAMPLE.options[0], { tranches: 0 })] });
	check(!IZ.computeBalance(reg, IZUI.toInput(IZUI.modelOf(decodeState(`#s=${IZUI.stateOf(badTr)}`, izKeys)))).ok, 'a rejected tranche count stays rejected after a shared link');
}

/* ---------- The server snapshots: the same renderers, the sticky figure, no <h2> in a card ---------- */
for (const [name, ui] of [['mezonot', MZUI], ['izun', IZUI], ['heskem-mamon', MMUI], ['heskem-gerushin', HKUI]]) {
	const s = ui.snapshot(reg);
	check(typeof s.sticky === 'string' && s.sticky.length > 0 && s.sticky !== '—', `${name}: the snapshot carries the sticky figure`);
	check(typeof s.numbers === 'string' && s.numbers.includes('jtool-datatable') && s.numbers.includes('jtool-cite'), `${name}: the numbers table, each row with its source`);
	check(s.details.includes('מה לבדוק עם עורך דין'), `${name}: the result says what to check with a lawyer`);
	check(!/<h2/i.test(s.form + s.result + s.details), `${name}: no <h2> inside the card (HAD-487)`);
	for (const part of [s, ...Object.values(s).filter((v) => v && typeof v === 'object' && v.form)]) {
		const ids = (part.form + part.result + part.details).match(/ id="[^"]+"/g) || [];
		check(new Set(ids).size === ids.length, `${name}: every id in the card is unique (axe duplicate-id-aria)`);
	}
	const labels = (s.form.match(/<(label|legend|summary)[^>]*>[\s\S]*?<\/\1>/g) || []).join(' ');
	check(labels.length > 0 && !/20\d\d/.test(labels.replace(/1\.1\.1974/g, '')), `${name}: no year in the form labels`);
}
{
	const s = MZUI.snapshot(reg);
	check(s.nii_table.includes('4,049') && s.needs_table.includes('17791-01-22'), 'mezonot: the NII and needs tables for the page sections');
	check(s.nii_table.includes('מלאה או חלקית') && !s.nii_table.includes('מלוא הסכום'), 'the NII income column is the income up to which some allowance is paid, full or partial (btl.gov.il), not a full-amount cap');
	const x = MZ.indexSupport(reg, Object.assign({}, MZUI.EXAMPLE_MADAD.madad, { asOf: reg.child_support.checked_on }));
	check(s.madad.sticky.includes(Math.round(x.current).toLocaleString('en-US')), `madad: the sticky figure is the linkage example, ${x.current}`);
	const years = cs.needs.cases.map((c) => Number(c.date.slice(0, 4)));
	check(s.numbers.includes(`${Math.min(...years)}-${Math.max(...years)}`), 'the years of the needs judgments come from the registry');
}

/* ---------- The stylesheet: one broken brace drops every rule after it ---------- */
{
	const css = readFileSync(join(ROOT, 'assets/css/justice-tools.css'), 'utf8');
	const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
	let depth = 0;
	let low = 0;
	for (const ch of bare) { if (ch === '{') { depth += 1; } else if (ch === '}') { depth -= 1; low = Math.min(low, depth); } }
	check(depth === 0 && low === 0 && (css.match(/\/\*/g) || []).length === (css.match(/\*\//g) || []).length, 'justice-tools.css: braces and comments balanced (a merge once dropped a closing brace)');
	for (const cls of ['.jt16-shares', '.jt16-strip', '.jt17-beam', '.jt18-gates', '.jt19-cal', '.jtool-simstrip']) {
		const at = bare.indexOf(`${cls} `);
		const before = bare.slice(0, Math.max(0, at));
		check(at > 0 && (before.match(/{/g) || []).length === (before.match(/}/g) || []).length, `justice-tools.css: ${cls} is styled at the top level, not swallowed by an open block`);
	}
}

if (failures) {
	console.error(`justice family tools: ${failures} failure(s), ${passed} passed`);
	process.exit(1);
}
console.log(`justice family tools: ok (${passed} checks)`);
