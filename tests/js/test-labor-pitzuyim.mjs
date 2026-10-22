/**
 * Golden tests for the severance upgrade (pitzuyim, the labor wave, 22.10.2026): the payslip components (reg. 1 of the
 * 1964 calculation regulations), the pension-deposit check (the comprehensive pension extension order, consolidated 2011,
 * ss.6-9; the 2016 increase order's rates from 1.1.2017), the lead card, the scenario, the print summary, the .ics and
 * "what changed". Run: node tests/js/test-labor-pitzuyim.mjs
 *
 * Every expected amount is computed by hand in the message: the example earns 12,000 a month from 1.3.2018 to 30.9.2026
 * (103 months = 8 7/12 years: 103,000), s.14 at 72% (6% of 12,000 = 720 a month; the completion to 8.33% = 279.60), the
 * order's severance rates 0.834 / 1.68 / 2.5 / 3.34 / 4.18 / 5 / 6% (2008-2014) replace rate x 12 percent of a year's
 * severance, the average wage of s.2 (13,769 from 1.1.2026) is the order's ceiling.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/pitzuyim-engine.js';
import * as U from '../../assets/js/tools/pitzuyim-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.011) => Math.abs(a - b) <= eps;
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const EX = U.EXAMPLE;
const run = (over) => E.compute(reg, Object.assign({}, EX, over));
const fc = (r, inp) => E.pzFundCheck(reg, r, inp || {});
const lp = reg.labor_pitzuyim;

/* ---------- The registry ---------- */
check(lp && lp.checked_on === '2026-10-22' && /nevo\.co\.il\/law_html\/law00\/4567/.test(lp.source_url) && lp.next_update === '2027-01-01', 'registry: labor_pitzuyim read 22.10.2026 from the 1964 regulations on Nevo');
check(lp.components.length === 12 && lp.components.every((c) => c.section && c.rule_he && ['in', 'avg', 'out', 'check'].includes(c.status)), 'registry: 12 payslip components, each with its regulation and status');
check(lp.components.filter((c) => c.status === 'in').map((c) => c.code).join(',') === 'base,seniority,col,family,dept', 'reg. 1(א)-(ב): base, seniority, cost of living, family, departmental/professional count');
check(lp.order.rows.length === 7 && lp.order.rows[0].severance === 0.834 && lp.order.rows[6].severance === 6 && lp.order.rows[6].employee === 5.5 && /gov\.il\/BlobFolder/.test(lp.order.url), 'registry: the order table s.6(ד) 2008-2014 (0.834% to 6%), from the gov.il PDF');
check(reg.rights_neto.pension.severance_pct === 6 && reg.rights_neto.pension.employer_pct === 6.5 && reg.rights_btl.avg_wage.s2_benefits === 13769, 'read, not copied: 6 / 6.5 from 1.1.2017 (rights_neto) and the s.2 average wage 13,769 (rights_btl)');
check(Object.values(lp.services).every((x) => /^https:\/\//.test(x.url)) && !JSON.stringify(lp).includes('kolzchut'), 'every official service has an https url; no private portal');

/* ---------- Reg. 1: the payslip -> the severance salary ---------- */
const pz = E.pzBase(reg, { base: 10000, seniority: 500, col: '', family: 200, commission: 1500, overtime: 2000, travel: 400, other: 300 });
check(pz.ok && pz.fixed === 10700 && pz.avg === 1500 && pz.base === 12200, 'reg. 1 + reg. 9: 10,000 + 500 + 200 = 10,700 counted, commissions 1,500 at the average: 12,200');
check(pz.out === 2400 && pz.check === 300 && pz.payslip === 14900, 'overtime 2,000 + travel 400 are not in reg. 1(א); the other fixed 300 is "for checking"; the payslip is 14,900');
check(E.pzBase(reg, { base: 9000, dept: 1000 }).fixed === 10000, 'reg. 1(ב): a departmental or professional allowance counts as base pay: 9,000 + 1,000 = 10,000');
check(E.pzBase(reg, {}).ok && !E.pzBase(reg, {}).any && E.pzBase(reg, { base: '' }).any === false, 'an empty picker is not in use');
check(!E.pzBase(reg, { base: -5 }).ok && E.pzBase(reg, { base: -5 }).errors[0].field === 'pz-base', 'a negative amount is an error');
check(!E.pzBase(reg, { overtime: 3000 }).ok && E.pzBase(reg, { overtime: 3000 }).errors[0].he.includes('שכר יסוד'), 'only components outside reg. 1(א) and no base pay: asks for the base pay');
const fromPay = E.compute(reg, { salary: pz.fixed, commission: pz.avg, start: '2018-03-01', end: '2026-09-30', reason: 'fired' });
check(fromPay.ok && near(fromPay.severance, 104716.67), 'the picker\'s salary in the frozen engine: 12,200 x 103/12 = 104,716.67');

/* ---------- The deposit check: the payslip lines ---------- */
const ex = run({});
const f0 = fc(ex);
check(ex.severance === 103000 && ex.employer === 28840, 'the frozen engine is unchanged: 103,000 and the 28,840 completion');
check(f0.ok && f0.monthly.severance === 720 && f0.monthly.completion === 279.6 && f0.monthly.employer === 780 && f0.monthly.employee === 720 && f0.monthly.total === 1779.6, 'on 12,000: 6% = 720 severance, 2.33% = 279.60 completion, 6.5% = 780, employee 6% = 720; employer total 1,779.60');
check(f0.from === '2018-03-01' && f0.months === 103 && !f0.gap && !f0.fund && !f0.order, 'the deposit period of the example: 103 months from 1.3.2018; no gap, no fund, no order route');
const full = run({ s14: 'full' });
check(fc(full).monthly.severance === 999.6 && fc(full).monthly.completion === 0, 'full s.14: 8.33% of 12,000 = 999.60, no completion line');
const hi = E.compute(reg, { salary: 20000, start: '2020-01-01', end: '2026-09-30', s14: 'partial' });
check(fc(hi).mandatory.severance === 826.14 && fc(hi).flags.some((x) => x.code === 'cap'), 'above the average wage: the duty is on 13,769 (s.6(ג)): 6% = 826.14, and the cap is flagged');
check(!fc(E.compute(reg, { salary: 13769, start: '2020-01-01', end: '2026-09-30', s14: 'partial' })).flags.some((x) => x.code === 'cap') && fc(E.compute(reg, { salary: 13770, start: '2020-01-01', end: '2026-09-30', s14: 'partial' })).flags.some((x) => x.code === 'cap'), 'exactly at 13,769 no cap flag; one shekel above, flagged');
const part = E.compute(reg, { salary: 6000, jobPct: 50, start: '2020-01-01', end: '2026-09-30', s14: 'partial' });
check(part.ok && fc(part).monthly.severance === 360, 'part-time (50%, 6,000): 6% = 360 a month');

/* ---------- A deposit wage below the law's salary (s.7 of the order) ---------- */
const g = fc(ex, { depWage: 10000 });
check(g.gap && g.gap.short === 2000 && g.gap.extra === 12360 && g.gap.employer === 41200, 'deposits on 10,000 of 12,000: 103,000 x 2,000/12,000 x 72% = 12,360 more; the employer pays 41,200 (= 103,000 - 85,833.33 x 72%)');
check(fc(ex, { depWage: 12000 }).gap === null, 'deposits on the full salary: no gap');
check(near(fc(ex, { depWage: 11999 }).gap.employer, 28846.18), 'one shekel below: 103,000 x 1/12,000 x 72% = 6.18 more: 28,846.18');
check(!fc(ex, { depWage: 0 }).ok && !fc(ex, { depWage: -1 }).ok && fc(ex, { depWage: '' }).ok, 'a deposit wage of 0 or below is an error; empty means the law\'s salary');

/* ---------- The fund balance against the deposits (without returns) ---------- */
const fb = fc(ex, { fundBal: 80000 });
check(fb.fund.deposits === 74160 && fb.fund.diff === 5840 && fb.fund.pct === 107.87 && !fb.fund.low, 'balance 80,000 vs 720 x 103 = 74,160 deposited: +5,840 (107.87%), no warning');
check(fc(ex, { fundBal: 66744 }).fund.low === false && fc(ex, { fundBal: 66743 }).fund.low === true, 'the warning starts below 90% of the deposits: 66,744 (exactly 90%) no, 66,743 yes');
check(fc(ex, { fundBal: 0 }).fund.low && fc(ex, { fundBal: 0 }).flags.find((x) => x.code === 'fund').level === 'warn', 'a zero balance warns (missing deposits are not covered by s.14, s.7 of the order)');
check(!fc(ex, { fundBal: -1 }).ok, 'a negative balance is an error');

/* ---------- The order's rising rates (2008-2014) ---------- */
check(E.pzCoverPct(6, 8.33) === 72 && E.pzCoverPct(8.33, 8.33) === 100 && E.pzCoverPct(0.834, 8.33) === 10.01 && E.pzCoverPct(5, 8.33) === 60, 'cover = rate x 12: 6% -> 72%, 8.33% -> 100%, 0.834% -> 10.01%, 5% -> 60%');
check(E.pzOrderRate(reg, '2007-12-31') === null && E.pzOrderRate(reg, '2008-01-01').severance === 0.834 && E.pzOrderRate(reg, '2016-12-31').employee === 5.5 && E.pzOrderRate(reg, '2017-01-01').employer === 6.5, 'the rate on a day: none before 1.1.2008, 0.834% on it, 5.5% employee to 31.12.2016, 6.5% employer from 1.1.2017');
const vet = E.compute(reg, U.PROFILES.veteran.input);
const vo = fc(vet, { orderRates: true, depFrom: '2009-07-01' });
check(vet.severance === 248500 && vo.order && vo.order.rows.length === 7, 'the veteran: 14,000 x 17.75 years = 248,500; seven rate periods from 1.7.2009');
check(near(vo.order.replaced, 155164.8) && near(vo.order.employer, 93335.2), 'by hand: 7,000 x 20.16% + 14,000 x (30 + 40.08 + 50.16 + 60)% + 42,000 x 72% + 136,500 x 72% = 155,164.80; the employer completes 93,335.20');
check(vo.order.coverPct === 64.25 && near(vo.order.sevCovered, 241500), 'the fund replaces 64.25% of the 241,500 for the deposit period');
check(fc(vet, { orderRates: true }).flags.some((x) => x.code === 'waiting') && !vo.flags.some((x) => x.code === 'waiting'), 'without a first-deposit day the waiting period (s.6(ה)) is flagged');
check(!fc(vet, { orderRates: true, depFrom: '2008-05-01' }).ok && !fc(vet, { orderRates: true, depFrom: 'xx' }).ok, 'a first-deposit day before the start or not a date is an error');
check(fc(vet).flags.some((x) => x.code === 'order_s7'), 'without s.14 and without the order route: the order\'s s.7 is explained');
const pre = E.compute(reg, { salary: 10000, start: '2006-01-01', end: '2025-12-31', reason: 'fired', s14: 'partial' });
const po = fc(pre, { orderRates: true });
check(pre.severance === 200000 && po.order.rows[0].rate === null && po.order.rows[0].cover === 72 && near(po.order.rows[0].sev, 20000) && near(po.order.replaced, 14400 + 10000 * (0.1001 + 0.2016 + 0.30 + 0.4008 + 0.5016 + 0.60) + 30000 * 0.72 + 90000 * 0.72), 's.14 from 2006 with the order route: 2006-2007 at the arrangement\'s 72% (14,400), then the order\'s rates (21,041 for 2008-2013, 21,600 for 2014-2016, 64,800 from 2017): 121,841 replaced of 200,000');
const quit = run({ reason: 'resign', s14: 'none' });
check(!quit.entitled && fc(quit, { orderRates: true, depWage: 9000 }).order === null && fc(quit, { orderRates: true, depWage: 9000 }).gap === null, 'a plain resignation: no completion is computed either way');

/* ---------- What changed and when ---------- */
const ch = E.pzChanges(reg);
check(ch.length === 14 && ch[0].date === '1998' && ch[1].date === '2008-01-01' && ch.some((x) => x.he.includes('13,750')) && ch.some((x) => x.he.includes('13,769')) && ch.some((x) => x.he.includes('6,443.85')), 'what changed: 1998 approval, the order 2008-2014, 2017 rates, the tax ceiling 13,750, the average wage 13,769, the minimum wage rows');
check(ch.every((x) => x.src && /^https:\/\//.test(x.url)), 'every row of "what changed" has its source and url');

/* ---------- Rendered HTML ---------- */
const res = U.renderResult(reg, ex, { example: true });
const det = U.renderDetails(reg, ex);
const all = res + det + U.renderForm(reg, EX);
check(res.includes('jt49-strip') && res.includes('השכר הקובע לפיצויים: 12,000') && res.includes('שעות נוספות'), 'the payslip strip: 12,000 counted, overtime listed as not counted');
check(res.includes('<h4>התרחיש לסימולציה</h4>') && res.includes('data-act="rehearse"') && res.includes('purpose=mediation') && res.includes('topic=employment'), 'the scenario under its h4 with the rehearse link (mediation, employment)');
check(res.includes('<h4>מה עושים עכשיו</h4>') && res.includes('notice-of-retirement') && res.includes('href="/gmar-cheshbon/"') && res.includes('href="/hafrashot-pensia/"'), 'next actions: form 161 on gov.il and the internal next steps');
check(det.includes('jt49-fund') && det.includes('מה השתנה ומתי') && det.includes('data-act="print"') && det.includes('jt49-print') && det.includes('הודפס ב-'), 'details: the deposit check, what changed, the print button and the print summary');
check(!all.includes('74,160') && !bad(all) && !/<h2/i.test(all), 'the example never shows a computed fund amount (review, PR 128); no undefined/NaN/null; no h2');
const withBal = Object.assign({}, ex, { pzIn: { fundBal: 80000 } });
check(U.renderDetails(reg, withBal).includes('74,160') && U.renderDetails(reg, withBal).includes('80,000'), 'with the reader\'s balance the deposits (74,160) are shown next to it');
const own = Object.assign(E.compute(reg, { salary: pz.fixed, commission: pz.avg, start: '2018-03-01', end: '2026-09-30' }), {});
own.pzIn = { parts: { base: 10000, seniority: 500, family: 200, commission: 1500, overtime: 2000, travel: 400 } };
const ownStrip = U.payStrip(reg, own);
check(ownStrip.includes('מתוך 14,600') && ownStrip.includes('2,400 ₪ לא נכנסים') && ownStrip.includes('jt49-strip__seg--out'), 'the reader\'s payslip: 12,200 of 14,600 counted, 2,400 not');
const form = U.renderForm(reg, EX);
check((form.match(/data-act="profile"/g) || []).length === 5 && (form.match(/data-pz="/g) || []).length === 12 && form.includes('id="jt13-dw"') && form.includes('id="jt13-fb"') && form.includes('id="jt13-df"'), 'the form: 5 quick profiles, 12 payslip lines, the deposit wage, the balance, the first-deposit day');
check(!/כל.זכות|kolzchut/i.test(all + det), 'no private portal named anywhere');
const every = Object.values(U.PROFILES).map((p) => { const r = E.compute(reg, p.input); r.pzIn = { orderRates: p.input.orderRates, depFrom: p.input.depFrom, fundBal: 1000, depWage: 5000 }; return U.renderResult(reg, r) + U.renderDetails(reg, r) + U.leadCard(reg, r) + U.renderForm(reg, p.input); }).join('');
check(!bad(every) && !/<h2/i.test(every) && every.includes('jt49-order'), 'every profile, with a balance and a low deposit wage, renders without undefined/NaN/null or h2 (the veteran shows the order table)');

/* ---------- The lead card and the snapshot ---------- */
const lead = U.leadCard(reg, ex, { example: true });
check(lead.includes('103,000') && lead.includes('דוגמה מחושבת') && lead.includes('data-lead-go') && lead.includes('jtool-lead__figure') && lead.includes('28,840'), 'the lead card carries the example figure, the completion and the jump');
check(U.leadCard(reg, run({ end: '' })).includes('—') && U.leadCard(reg, quit).includes('אין פיצויים מהמעסיק'), 'the lead card on an error and on a plain resignation');
const snap = U.snapshot(reg);
check(snap.lead === lead && snap.total === 103000 && !bad(snap.lead), 'snapshot().lead is the example card');

/* ---------- The scenario ---------- */
for (const [k, p] of Object.entries(U.PROFILES)) {
	const r = E.compute(reg, p.input);
	const b = U.aiBrief(reg, r);
	const words = b.split(/\s+/).filter(Boolean).length;
	check(r.ok && words >= 40 && words <= 90 && !/\d{9}/.test(b.replace(/[,.]/g, '')) && !bad(b) && b.includes('השאלה לתרגול'), `aiBrief (${k}): ${words} words, facts only, ends with the question`);
}
check(U.aiBrief(reg, ex).includes('103,000') && U.aiBrief(reg, ex).includes('28,840'), 'aiBrief has the key figures');
const near11 = E.compute(reg, U.PROFILES.near.input);
check(near11.conditional && near11.severance === 8250 && E.compute(reg, U.PROFILES.hourly.input).severance === 21600, 'profiles: 11 months -> s.3, 9,000 x 11/12 = 8,250; hourly 45 x 160 = 7,200 x 3 = 21,600');

/* ---------- .ics and print ---------- */
const evs = U.icsEvents(reg, ex);
check(evs.length === 5 && evs.map((e) => e.date).join(',') === '2026-09-30,2026-10-15,2026-10-30,2026-10-14,2033-09-30', 'ics: due 30.9, grace 15.10, +20% after 30.10, certificate 14.10, limitation 30.9.2033');
const evN = U.icsEvents(reg, run({ noticeDate: '2026-09-15' }));
check(evN.length === 6 && evN[0].date === '2026-10-15' && ics(evN, '2026-10-22T10:00:00Z').includes('DTSTART;VALUE=DATE:20261015'), 'ics: a notice on 15.9 adds its legal end, 15.10.2026');
check(U.icsEvents(reg, quit).length === 1 && U.icsEvents(reg, quit)[0].date === '2026-10-14', 'ics for a plain resignation: only the certificate day');
const pr = U.printSummary(reg, ex, E.pzFundCheck(reg, ex, {}), '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק') && pr.includes('103,000') && pr.includes('720.00') && !bad(pr) && !/<h2/i.test(pr), 'print summary: the result, the payslip lines, the sources with dates, the print date');

/* ---------- Share state round trip ---------- */
const inp = Object.assign({}, EX, { parts: { base: 10000, seniority: 500, commission: 1500 }, depWage: 11000, fundBal: 70000, orderRates: true, depFrom: '2019-01-01', s14: 'none' });
const back = U.inputOf(decodeState(`#s=${U.stateOf(inp)}`, U.KEYS));
check(back && back.parts.base === 10000 && back.parts.commission === 1500 && back.depWage === 11000 && back.fundBal === 70000 && back.orderRates === true && back.depFrom === '2019-01-01' && back.salary === 12000 && back.s14 === 'none', 'stateOf -> decodeState -> inputOf keeps the payslip lines and the deposit check');
check(!/[^0-9A-Za-z._~/-]/.test(U.stateOf(inp)), 'the share state has no free text');

/* ---------- One notice rule on both pages (the Ministry of Labor's table; the labor wave integration) ---------- */
{
	const sv = reg.severance;
	const nb = (pt, months, days) => E.noticeByMonth(sv, pt, { months, days });
	check(nb('hourly', 12, 0).days === 12 && nb('hourly', 12, 1).days === 14 && nb('hourly', 18, 0).days === 16 && nb('hourly', 36, 0).days === 26 && nb('hourly', 36, 1).month, 'wage worker: month 12 = 12 days, month 13 = 14, month 18 = 16, month 36 = 26, then a month (s.4 as the Ministry table reads it)');
	check(nb('monthly', 8, 22).days === 13.5 && nb('monthly', 11, 5).days === 21 && nb('monthly', 12, 0).month, 'monthly: 8 months and 22 days is the 9th month: 6 + 2.5 x 3 = 13.5; the 12th month 21 days; 12 full months a month (s.3)');
	const hourly12 = E.compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '2025-01-01', end: '2025-12-31', reason: 'fired' });
	check(hourly12.ok && hourly12.notice.days === 12 && hourly12.notice.section === 'סעיף 4(1)', 'the severance result uses the same reading: a wage worker dismissed on the last day of the first year gets 12 days, not 14');
	const monthly9 = E.compute(reg, { payType: 'monthly', salary: 9000, start: '2026-01-10', end: '2026-10-01', reason: 'fired' });
	check(monthly9.ok && monthly9.notice.days === 13.5, 'a monthly worker in the 9th month (10.1 to 1.10): 13.5 days, as on the notice page');
}

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
