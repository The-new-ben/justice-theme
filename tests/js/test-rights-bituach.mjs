/**
 * Golden tests for the National Insurance and health contributions calculator (dmei-bituach, the rights wave, 21.10.2026).
 * Run: node tests/js/test-rights-bituach.mjs
 *
 * Every expected figure is computed by hand from the Institute's 2026 pages: the reduced collection tier 7,703 (s.334(א)),
 * the maximum insurable income 51,910 (Table 11: basic amount 10,382 x 5), employee 1.04% + 3.23% / 7% + 5.17%, employer
 * 4.51% / 7.6%, self-employed 4.47% + 3.23% / 12.83% + 5.17% on the base after the 52% deduction (s.345(ב)(1)(א), s.47A),
 * early pension 1.02% + 3.23% / 6.79% + 5.17% (s.345ב), not working 143 + 123, a student 171, income not from work 6.92% /
 * 7% + 5.17% after 3,442 (s.348(א1)). Each line is rounded to the agora as a payslip line.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as BE from '../../assets/js/tools/bituach-engine.js';
import * as BUI from '../../assets/js/tools/bituach-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const rb = reg.rights_bituach;
const EX = BUI.EXAMPLE;
const run = (over) => BE.compute(reg, Object.assign({}, EX, over));
const near = (a, b) => Math.abs(a - b) < 0.005;

/* ---------- 1. The registry carries every figure the engine reads, each with its source ---------- */
check(rb.tier.amount === 7703 && rb.tier.base_amount === 7522 && rb.tier.section === 'סעיף 334(א) לחוק' && /^https:\/\/www\.btl\.gov\.il\//.test(rb.tier.url), 'registry: tier 7,703 (s.334(א), 7,522 indexed), with the law url');
check(rb.max.amount === 51910 && rb.max.amount === rb.max.times * reg.rights_btl.basic_amount.b3 && /btl\.gov\.il/.test(rb.max.url), 'registry: ceiling 51,910 = 5 x b3 10,382 (Table 11), cross-checked with rights_btl');
check(rb.min_self.amount === Math.floor(reg.rights_btl.avg_wage.s2_contributions * rb.min_self.pct / 100) && rb.passive_exempt.amount === 3442, 'registry: self-employed minimum 3,442 = 25% x 13,769 (Table 11 item 2), and the 3,442 not counted (s.348(א1))');
check(Math.round(7522 * (1 + reg.rights_btl.basic_amount.b3_change_pct / 100)) === rb.tier.amount, 'registry: 7,522 x 1.024 (the 2026 CPI rise of b3) = 7,703');
const urls = [rb.source_url, rb.law_url, rb.employee.url, rb.employee.health_url, rb.self.url, rb.self.example_url, rb.self.deduct_url, rb.pension.url, rb.pension.exempt_url, rb.none.url, rb.student.url, rb.oap_health.url, rb.coordination.when_url, rb.coordination.refund_url, rb.coordination.form_low.url, rb.coordination.form_max.url, rb.dues.url, rb.advance_fix.url, rb.retirement.url, rb.personal_url, rb.min_self.url, rb.mixed.url];
check(urls.every((u) => typeof u === 'string' && /^https:\/\/(www\.btl\.gov\.il|ps\.btl\.gov\.il|b2b\.btl\.gov\.il|www\.nevo\.co\.il)\//.test(u)), 'registry: every source url is official (btl.gov.il or Nevo)');
const e = rb.employee;
check(e.work.bl.join() === '1.04,7' && e.work.health.join() === '3.23,5.17' && e.work.employer.join() === '4.51,7.6' && e.u18.employer.join() === '0.61,2.12' && e.oap.employer.join() === '0.61,2.12', 'registry: employee rates 1.04/7 + 3.23/5.17, employer 4.51/7.6; under 18 and old-age pensioners: employer 0.61/2.12');
check(e.w_ret.total.join() === '3.95,10.24' && e.w_ret.bl.join() === '0.72,5.07' && e.r67.total.join() === '3.93,10.03' && e.r67.bl.join() === '0.7,4.86' && e.w_ret.derived && e.r67.derived, 'registry: above retirement age the published totals 3.95/10.24 and 3.93/10.03; the National Insurance share derived (total - health)');
check(rb.self.work.bl.join() === '4.47,12.83' && rb.self.ret.total.join() === '6.92,15.79' && rb.self.u18.bl.join() === '0.26,0.78' && rb.self.deduct_pct === 52 && rb.pension.bl.join() === '1.02,6.79', 'registry: self-employed 4.47/12.83, at retirement 6.92/15.79, under 18 0.26/0.78, deduct 52%; early pension 1.02/6.79');
check(rb.none.total === 266 && rb.none.bl + rb.none.health === 266 && rb.student.total === 171 && rb.oap_health.single === 237 && rb.none.passive.bl.join() === '6.92,7', 'registry: not working 143 + 123 = 266, student 171, old-age health 237, income not from work 6.92/7');
check(rb.dues.dates.length === 12 && rb.dues.dates[7] === '2026-08-16' && rb.dues.dates.every((d) => /^2026-\d\d-1[56]$/.test(d)) && rb.advance_fix.form === '672' && rb.coordination.form_low.number === '657' && rb.coordination.form_max.number === '752', 'registry: 12 dues days of 2026 (16.8 for the Saturday), forms 672, 657 and 752');

/* ---------- 2. The example: an employee aged 35 earning 14,000 ---------- */
const ex = BE.compute(reg, EX);
check(ex.ok && ex.salary.parts.reduced === 7703 && ex.salary.parts.full === 6297 && ex.salary.parts.above === 0, 'example: 14,000 = 7,703 reduced + 6,297 full');
check(ex.salary.charge.blR === 80.11 && ex.salary.charge.blF === 440.79 && ex.monthly.bl === 520.9, 'example: NI 7,703 x 1.04% = 80.11 + 6,297 x 7% = 440.79 = 520.90');
check(ex.salary.charge.hR === 248.81 && ex.salary.charge.hF === 325.55 && ex.monthly.health === 574.36, 'example: health 7,703 x 3.23% = 248.81 + 6,297 x 5.17% = 325.55 = 574.36');
check(ex.monthly.total === 1095.26 && ex.annual.total === 13143.12 && ex.salary.net === 12904.74, 'example: deduction 1,095.26 a month, 13,143.12 a year; 12,904.74 after NI and health');
check(ex.salary.employer === 825.98 && ex.salary.charge.eR === 347.41 && ex.salary.charge.eF === 478.57 && ex.salary.cost === 14825.98 && ex.annual.employer === 9911.76, 'example: employer 7,703 x 4.51% = 347.41 + 6,297 x 7.6% = 478.57 = 825.98; cost 14,825.98; 9,911.76 a year');

/* ---------- 3. The tier and the ceiling: exactly at, one shekel above ---------- */
const atT = run({ salary: 7703 });
const aboveT = run({ salary: 7704 });
check(atT.monthly.total === 328.92 && atT.salary.parts.full === 0 && atT.salary.employer === 347.41, 'at the tier 7,703: 7,703 x 4.27% = 80.11 + 248.81 = 328.92, employer 347.41, nothing at the full rate');
check(aboveT.monthly.total === 329.04 && aboveT.salary.charge.blF === 0.07 && aboveT.salary.charge.hF === 0.05 && aboveT.salary.employer === 347.49, 'one shekel above the tier: + 1 x 7% (0.07) + 1 x 5.17% (0.05) = 329.04; employer + 0.08 = 347.49');
const atM = run({ salary: 51910 });
const aboveM = run({ salary: 51911 });
check(atM.monthly.total === 5708.91 && atM.monthly.bl === 3174.6 && atM.monthly.health === 2534.31 && atM.salary.employer === 3707.14, 'at the ceiling 51,910: 44,207 full; NI 80.11 + 3,094.49, health 248.81 + 2,285.50 = 5,708.91; employer 347.41 + 3,359.73 = 3,707.14');
check(aboveM.monthly.total === 5708.91 && aboveM.salary.parts.above === 1 && aboveM.flags.some((f) => f.code === 'above'), 'one shekel above the ceiling: the same 5,708.91, 1 shekel not counted (s.348(א)), flagged');
check(run({ salary: 60000 }).monthly.total === 5708.91 && run({ salary: 60000 }).salary.parts.above === 8090, 'above the ceiling (60,000): 8,090 not counted, still 5,708.91');

/* ---------- 4. Several employers (s.342(ב), (ד), (ה)) ---------- */
const two = run({ salary: 6000, extra: [5000, ''] });
check(two.coord && two.coord.law === 730.16 && two.coord.actual === 864.7 && two.coord.diff === 134.54 && two.coord.kind === 'refund' && two.coord.form === 'low' && two.coord.annual === 1614.48, 'two employers 6,000 + 5,000, the second at the full rate: deducted 256.20 + 608.50 = 864.70, the law 328.92 + 3,297 x 12.17% (401.24) = 730.16, refund 134.54 a month (form 657)');
check(two.monthly.employer === 496.1, 'two employers: each pays as if alone (s.342(ב)): 6,000 x 4.51% + 5,000 x 4.51% = 270.60 + 225.50 = 496.10');
const twoTier = run({ salary: 6000, extra: [5000, ''], mode: 'tier' });
check(twoTier.coord.actual === 469.7 && twoTier.coord.diff === -260.46 && twoTier.coord.kind === 'owe', 'two employers each as if alone: 256.20 + 213.50 = 469.70 against 730.16: 260.46 owed (s.342(ד)(1))');
const big = run({ salary: 40000, extra: [30000, ''], mode: 'tier' });
check(big.coord.actual === 7301.92 && big.coord.law === 5708.91 && big.coord.diff === 1593.01 && big.coord.form === 'max', 'over the ceiling across employers (40,000 + 30,000, each alone): 4,259.46 + 3,042.46 = 7,301.92 against 5,708.91: refund 1,593.01 a month (form 752)');
check(run({ salary: 40000, extra: [30000, ''] }).coord.diff === 2201.55, 'the same with the second at the full rate: 4,259.46 + 30,000 x 12.17% (3,651) = 7,910.46: refund 2,201.55');

/* ---------- 5. Salary and early pension (s.345ב) ---------- */
const sp = run({ status: 'pension', salary: 5000, pension: 6000 });
check(sp.ok && sp.salary.charge.total === 213.5 && sp.pension.parts.reduced === 2703 && sp.pension.parts.full === 3297, 'salary 5,000 + early pension 6,000: the pension gets the reduced rate only on 7,703 - 5,000 = 2,703 (s.345ב(ה)), 3,297 at the full rate');
check(sp.pension.charge.total === 509.2 && sp.monthly.total === 722.7 && sp.coord.actual === 931.1 && sp.coord.diff === 208.4, 'pension: 2,703 x 4.25% (27.57 + 87.31) + 3,297 x 11.96% (223.87 + 170.45) = 509.20; with the salary 722.70; the payer at the full rate takes 717.60: refund 208.40');
check(run({ status: 'pension', salary: '', pension: 500 }).pension.counted === 688.45 && run({ status: 'pension', salary: '', pension: 500 }).pension.minApplied, 'early pension 500 alone: below the 5% minimum (688.45), pay as if 688.45 (s.345ב(ג)(2))');
const retiredP = run({ status: 'pension', band: 'r67', salary: '', pension: 8000 });
check(retiredP.ok && retiredP.pension.retired && retiredP.monthly.total === 0 && retiredP.flags.some((f) => f.code === 'pension_retired'), 'a pension from the retirement age: nothing deducted (the exemption page)');

/* ---------- 6. Self-employed ---------- */
const se = run({ status: 'self', selfIncome: 12000 });
check(se.self.base === 11563.4 && se.monthly.total === 1288 && near(se.monthly.total * 3, rb.self.example.quarter_total), 'self-employed 12,000: base (12,000 + 7,703 x 0.52 x 8.36%) / 1.066716 = 11,563.40; 1,288 a month = 3,864 a quarter, the Institute\'s own example');
check(se.self.charge.blR === 344.32 && se.self.charge.blF === 495.29 && se.self.charge.hR === 248.81 && se.self.charge.hF === 199.58, 'self-employed 12,000: NI 344.32 + 495.29, health 248.81 + 199.58');
check(se.self.deduct === 436.6 && se.self.deductAnnual === 5239.17, 'self-employed 12,000: 52% of NI (839.61) = 436.60 a month; 52% x 10,075.32 = 5,239.17 a year (s.47A)');
const seLow = run({ status: 'self', selfIncome: 2500 });
check(seLow.self.minApplied && seLow.self.base === 3442 && seLow.monthly.total === 265.04 && seLow.flags.some((f) => f.code === 'min_self'), 'self-employed below the minimum (2,500): base 3,442: 153.86 + 111.18 = 265.04 (Table 11 item 2)');
check(run({ status: 'self', selfIncome: 0 }).monthly.total === 265.04, 'self-employed with no income: the minimum base 3,442 too');
const seT = run({ status: 'self', selfIncome: 7882.05 });
check(seT.self.base === 7703 && seT.self.parts.full === 0 && run({ status: 'self', selfIncome: 7883.05 }).self.parts.full > 0, 'self-employed at the tier: 7,703 x (1 + 0.52 x 4.47%) = 7,882.05 gives a base of exactly 7,703; one shekel more crosses it');
const both = run({ status: 'both', salary: 6000, selfIncome: 5000 });
check(both.self.room === 1703 && both.self.base === 4756.69 && both.self.charge.total === 680.8 && both.monthly.total === 937, 'salary 6,000 + self 5,000: reduced room 1,703 (s.342(ו)); base 4,756.69; 680.80 + 256.20 = 937');
check(run({ status: 'both', salary: 52000, selfIncome: 8000 }).self.base === 0 && run({ status: 'both', salary: 52000, selfIncome: 8000 }).flags.some((f) => f.code === 'both_cap'), 'salary above the ceiling: nothing on the self-employed income');

/* ---------- 7. Not working, students, income not from work, age bands ---------- */
check(run({ status: 'none', noneKind: 'none' }).monthly.total === 266 && run({ status: 'none', noneKind: 'student' }).monthly.total === 171, 'not working: 143 + 123 = 266; a student: 171');
check(run({ status: 'none', noneKind: 'none' }).flags.some((f) => f.code === 'homemaker' && f.section === 'סעיף 342(א) לחוק' && /btl\.gov\.il/.test(f.url)), 'not working: the homemaker exemption is flagged with s.342(א) and the health-rates page');
const pv = run({ status: 'none', noneKind: 'passive', passive: 12000 });
check(pv.none.counted === 8558 && pv.none.total === 1035.35 && Math.round(pv.none.total) === rb.none.example.total, 'rent 12,000: 3,442 not counted, 8,558: 7,703 x 12.09% + 855 x 12.17% = 1,035.35 (the Institute rounds to 1,035)');
check(run({ status: 'none', noneKind: 'passive', passive: 4000 }).none.minApplied && run({ status: 'none', noneKind: 'passive', passive: 4000 }).monthly.total === 266, 'income not from work 4,000: 558 x 12.09% = 67.46 is below the minimum: 266');
const u18 = run({ band: 'u18', salary: 3000 });
check(u18.monthly.total === 0 && u18.salary.employer === 18.3, 'under 18 earning 3,000: nothing from the salary, employer 3,000 x 0.61% = 18.30');
const oap = run({ band: 'oap', salary: 9000 });
check(oap.salary.charge.total === 0 && oap.salary.employer === 74.49 && oap.monthly.total === 237, 'old-age pensioner earning 9,000: nothing from the salary (s.342(ג)(2)); employer 46.99 + 1,297 x 2.12% (27.50) = 74.49; 237 health from the pension');
check(run({ band: 'r67' }).monthly.total === 934.31 && run({ band: 'w_ret' }).monthly.total === 949.08, '14,000 at 67-70: 7,703 x 3.93% + 6,297 x 10.03% = 934.31; a woman between her retirement age and 67: 3.95% / 10.24% = 949.08');
check(run({ disabled: true }).monthly.total === 574.36 && run({ disabled: true }).monthly.bl === 0 && run({ disabled: true }).salary.employer === 180.49, 'disability pensioner with the annual certificate: health only 574.36; employer 46.99 + 133.50 = 180.49');
const a = BE.bandFor(rb, 'f', '1963-04', '2026-10', false);
check(a.band === 'w_ret' && a.ret.y === 63 && a.ret.m === 3 && a.retMonth === '7.2026' && BE.bandFor(rb, 'm', '1991-01', '2026-10', false).band === 'work', 'a woman born 4/1963: retirement age 63 and 3 months (7.2026), in October 2026 between it and 67; a man born 1/1991: 18 to retirement');
check(BE.bandFor(rb, 'f', '1959-06', '2026-10', false).ret.y === 62 && BE.bandFor(rb, 'f', '1970-02', '2026-10', false).ret.y === 65 && BE.bandFor(rb, 'm', '1956-05', '2026-10', false).band === 'oap' && BE.bandFor(rb, 'm', '2009-01', '2026-10', false).band === 'u18', 'retirement table: 1959 -> 62, from 1970 -> 65; 70 and over -> old-age band; under 18');
check(run({ sex: 'f', born: '4/1963', month: '2026-10' }).band === 'w_ret' && run({ sex: 'f', born: '4/1963', month: '2026-10' }).monthly.total === 949.08, 'the birth month sets the band (a woman born 4/1963 in 10.2026)');

/* ---------- 8. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((x) => x.field === field); };
check(err({ salary: '' }, 'salary') && err({ salary: -5 }, 'salary') && err({ salary: 'abc' }, 'salary'), 'error: an employee without a positive salary');
check(err({ status: 'self', selfIncome: '' }, 'selfIncome') && err({ status: 'pension', pension: '' }, 'pension') && err({ status: 'none', noneKind: 'passive', passive: '' }, 'passive'), 'errors: self-employed income, early pension, income not from work');
check(err({ extra: [-1, ''] }, 'extra0') && err({ born: '13/1990' }, 'born') && err({ born: '1/2030', month: '2026-10' }, 'born'), 'errors: a negative second salary, a month that is not a month, a birth after the month computed');
check(err({ status: 'pension', band: 'u18', pension: 3000 }, 'band') && err({ status: 'none', band: 'u18' }, 'band') && err({ status: 'none', band: 'r67' }, 'band') && err({ status: 'none', noneKind: 'student', band: 'oap' }, 'noneKind'), 'errors: the bands the published rates do not cover');

/* ---------- 9. The snapshot, the share state, the HTML ---------- */
const snap = BUI.snapshot(reg);
check(snap.tool === 'dmei-bituach' && snap.total === 1095.26 && snap.input === EX && snap.registry_version === reg.registry_version, 'snapshot: tool id, total 1,095.26, the example input');
check(snap.result.includes('1,095.26') && snap.result.includes('520.90') && snap.result.includes('574.36') && snap.result.includes('825.98') && snap.result.includes('14,825.98') && snap.result.includes('jt28-slip') && snap.result.includes('jt28-bar__line--max') === false && snap.result.includes('jt28-bar__line'), 'snapshot result: the figures, the payslip lines and the tier bar (the ceiling beyond the scale at 14,000)');
check(snap.method.includes('80.11') && snap.method.includes('440.79') && snap.method.includes('248.81') && snap.method.includes('325.55') && snap.method.includes('347.41') && snap.method.includes('478.57') && snap.method.includes('סעיף 334(א) לחוק') && snap.method.includes('jtool-cite'), 'snapshot method: every line of the arithmetic, with the s.334(א) cite');
check(snap.compare_table.includes('<caption>') && snap.compare_table.includes('7,703') && snap.compare_table.includes('51,910') && snap.compare_table.includes('4.47%') && snap.compare_table.includes('6.92%') && snap.compare_table.includes('btl.gov.il'), 'snapshot compare table: caption, tier, ceiling, rates, official links');
check(snap.details.includes('על איזה חלק, באיזה שיעור') && snap.details.includes('מה עושים עכשיו') && snap.details.includes('ps.btl.gov.il'), 'snapshot details: the lines table and the next steps with the personal area');
const sampleInputs = [EX, { status: 'self', selfIncome: 12000 }, { status: 'both', salary: 6000, selfIncome: 5000 }, { status: 'pension', salary: 5000, pension: 6000, extra: [3000, ''] }, { salary: 40000, extra: [30000, 9000], mode: 'tier' }, { status: 'none', noneKind: 'student' }, { status: 'none', noneKind: 'passive', passive: 60000 }, { status: 'none', band: 'oap' }, { band: 'u18', salary: 2000 }, { band: 'oap', salary: 9000 }, { disabled: true }, { status: 'pension', band: 'r67', pension: 8000 }, { status: 'self', band: 'r67', selfIncome: 9000 }, { status: 'self', band: 'oap', selfIncome: 9000 }, { sex: 'f', born: '4/1963', month: '2026-10' }, { salary: '' }];
const html = sampleInputs.map((i) => { const r = run(i); return [BUI.renderForm(reg, Object.assign({}, EX, i)), BUI.renderResult(reg, r), BUI.renderDetails(reg, r, { today: '2026-10-21' }), BUI.verdictSentence(reg, r)].join('\n'); }).join('\n') + snap.form + snap.result + snap.details + snap.method + snap.compare_table;
check(!/<h2/i.test(html), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|\bnull\b/.test(html), 'no "undefined", "NaN" or "null" in any rendered string');
check(!html.includes(String.fromCharCode(0x5db, 0x5dc, 0x20, 0x5d6, 0x5db, 0x5d5, 0x5ea)),'the forbidden portal name (escaped here so it is not written) is nowhere in the rendered HTML');
const selfHtml = BUI.renderDetails(reg, se, { today: '2026-10-21' });
check(selfHtml.includes('data-act="ics"') && selfHtml.includes('15.11.2026') && selfHtml.includes('15.12.2026') && !selfHtml.includes('15.10.2026') && selfHtml.includes('טופס 672') && selfHtml.includes('5,239.17'), 'self-employed details: the .ics button, the dues ahead from 21.10.2026 (15.11, 15.12), form 672, the annual 52% deduction');
const coordHtml = BUI.renderDetails(reg, two, { today: '2026-10-21' });
check(coordHtml.includes('864.70') && coordHtml.includes('730.16') && coordHtml.includes('134.54') && coordHtml.includes('טופס 657') && coordHtml.includes('1,614.48'), 'coordination details: deducted, the law, the monthly and yearly difference, form 657');
for (const i of [EX, { status: 'both', salary: 6000, selfIncome: 5000, extra: [3000, ''], mode: 'tier' }, { status: 'none', noneKind: 'passive', passive: 12000 }, { status: 'pension', salary: 5000, pension: 6000, pensionExempt: true }, { band: 'r67', salary: 9000, disabled: true }]) {
	const full = Object.assign({}, EX, i);
	const r = run(i);
	const back = BUI.inputOf(decodeState(`#s=${BUI.stateOf(full, r.band)}`, BUI.KEYS));
	const r2 = BE.compute(reg, back);
	check(r2.ok && r2.monthly.total === r.monthly.total && r2.status === r.status && r2.band === r.band, `share state round trip (${full.status}, ${r.band}): stateOf -> decodeState -> inputOf gives the same ${r.monthly.total}`);
}
const st = BUI.stateOf(Object.assign({}, EX, { sex: 'f', born: '4/1963', month: '2026-10' }), 'w_ret');
check(!st.includes('1963') && st.includes('bf'), 'the share link carries the band, never the birth month');

/* ---------- 10. Follow-up is owned by the selected journey, not the initial employee example (HAD-552) ---------- */
const followCases = [
	[{}, 'employee'],
	[{ status: 'self', selfIncome: 12000 }, 'advance'],
	[{ status: 'both', salary: 6000, selfIncome: 5000 }, 'mixed'],
	[{ status: 'none', noneKind: 'none' }, 'personal'],
	[{ status: 'none', noneKind: 'student' }, 'personal'],
	[{ status: 'none', noneKind: 'passive', passive: 12000 }, 'personal'],
	[{ status: 'none', band: 'oap' }, 'personal'],
	[{ status: 'pension', salary: '', pension: 6000 }, 'pension'],
	[{ status: 'pension', band: 'r67', salary: '', pension: 6000 }, 'pension'],
	[{ status: 'pension', salary: 5000, pension: 6000 }, 'coordination'],
	[{ salary: 6000, extra: [5000, ''] }, 'coordination'],
	[{ salary: 6000, extra: [5000, ''], mode: 'tier' }, 'coordination'],
	[{ salary: '' }, 'input'],
	[{ status: 'self', selfIncome: '' }, 'input'],
];
for (const [input, kind] of followCases) {
	const result = run(input);
	const action = BUI.nextAction(reg, result);
	check(action.kind === kind, `follow-up for ${JSON.stringify(input)} routes to ${kind}`);
	if (kind !== 'employee') {
		check(!/מעסיק|תלוש השכר/.test(action.label), `${kind}: primary label is not the employee rehearsal`);
		if (action.href.startsWith('#') && kind !== 'input') {
			check(BUI.renderDetails(reg, result).includes(`id="${action.href.slice(1)}"`), `${kind}: action anchor exists in that result`);
		}
	}
}
check(!BUI.nextSteps(reg, se)[0].includes('תלוש'), 'self-employed checklist begins with the advance, not a payslip');
check(!BUI.nextSteps(reg, run({ status: 'none' }))[0].includes('תלוש'), 'non-working checklist begins with status/payment, not a payslip');
check(BUI.nextSteps(reg, run({ status: 'none', band: 'oap' }))[0].includes('קצבת האזרח הוותיק'), 'old-age pension checklist refers to its own statement');
check(!BUI.nextSteps(reg, run({ status: 'pension', salary: '', pension: 6000 })).join(' ').includes('הכנסה נוספת'), 'pension-only does not instruct declaring additional salary');
check(BUI.nextSteps(reg, run({ status: 'pension', salary: 5000, pension: 6000 })).join(' ').includes('הכנסה נוספת'), 'pension plus salary keeps the additional-income instruction');
check(BUI.nextSteps(reg, run({ status: 'self', selfIncome: '' })).length === 0, 'invalid input produces no actionable result checklist');

// Exercise the same DOM updater called after compute on input, initial shared state and restore.
const original = { text: 'employee next', label: 'employee rehearsal', href: 'https://jus-tice.com/#/simulation', target: '_blank', rel: 'noopener', 'data-act': 'rehearse' };
const attrs = new Map(Object.entries(original).filter(([k]) => !['text', 'label'].includes(k)));
const link = { textContent: original.label, setAttribute: (k, v) => attrs.set(k, v), removeAttribute: (k) => attrs.delete(k) };
const paragraph = { textContent: original.text };
const boxAttrs = new Map();
const box = { querySelector: (selector) => selector === '.jtool-next__text' ? paragraph : link, setAttribute: (k, v) => boxAttrs.set(k, v) };
const root = { querySelector: () => box };
for (const status of ['self', 'none', 'pension', 'both', 'employee']) {
	const r = run({ status, selfIncome: 12000, pension: 6000, salary: status === 'pension' ? '' : 14000 });
	BUI.updateNextAction(root, reg, r, original);
	check(boxAttrs.get('data-followup-kind') === BUI.nextAction(reg, r).kind, `DOM follow-up updates after switch to ${status}`);
	check(status === 'employee' ? attrs.get('data-act') === 'rehearse' : !attrs.has('data-act'), `${status}: only actual rehearsal retains rehearsal tracking`);
}
check(attrs.get('href') === original.href && attrs.get('target') === '_blank' && attrs.get('rel') === 'noopener' && paragraph.textContent === original.text && link.textContent === original.label, 'returning to employee restores original label, URL, target, rel and tracking');
BUI.updateNextAction(root, reg, run({ salary: '' }), original);
check(attrs.get('href') === '#jtool-dmei-bituach' && !attrs.has('target') && !attrs.has('data-act'), 'invalid input removes stale rehearsal URL/tracking and goes to calculator inputs');
BUI.updateNextAction(root, reg, se, original);
check(attrs.get('href') === '#jt28-self-h' && link.textContent.includes('מקדמה'), 'correcting invalid input re-enables the matching self-employed next step');

// A CTA click during the debounce must use the newly computed journey in either direction.
const target = { closest: () => attrs.has('data-act') ? { getAttribute: (k) => attrs.get(k) } : null };
for (const status of ['self', 'none', 'pension', 'both']) {
	BUI.updateNextAction(root, reg, run({}), original);
	const pending = run({ status, selfIncome: 12000, pension: 6000, salary: status === 'pension' ? '' : 14000 });
	const act = BUI.actionAfterFlush(target, () => BUI.updateNextAction(root, reg, pending, original));
	check(act === null, `rapid employee-to-${status} click does not emit a stale rehearsal action`);
	check(attrs.get('href') === BUI.nextAction(reg, pending).href, `${status}: rapid click sees the updated destination`);
	const restored = BUI.actionAfterFlush(target, () => BUI.updateNextAction(root, reg, run({}), original));
	check(restored === 'rehearse' && attrs.get('href') === original.href, `rapid ${status}-to-employee click restores the real rehearsal action`);
}

// Native follow-up fragments must land below the actual sticky masthead, including admin padding.
const anchorTarget = { style: {} };
const masthead = { getBoundingClientRect: () => ({ height: 134 }) };
const documentRoot = {};
let headingMargin = '0px', rootPadding = '32px', headerTop = '32px', headerPosition = 'sticky';
let fragment = '#jt28-self-h', inside = true;
const anchorRoot = { contains: () => inside, ownerDocument: {
	getElementById: () => anchorTarget, querySelector: () => masthead, documentElement: documentRoot,
	defaultView: { getComputedStyle: el => el === masthead ? { position: headerPosition, display: 'block', top: headerTop } : el === documentRoot ? { scrollPaddingTop: rootPadding } : { scrollMarginTop: headingMargin } },
} };
const anchorClick = { closest: () => ({ getAttribute: () => fragment }) };
BUI.clearFollowupAnchor(anchorRoot, anchorClick);
check(anchorTarget.style.scrollMarginTop === '146px', 'follow-up clears actual masthead without double-counting admin padding');
rootPadding = '0px'; headerTop = '0px'; BUI.clearFollowupAnchor(anchorRoot, anchorClick);
check(anchorTarget.style.scrollMarginTop === '146px', 'anonymous native anchor gets the same visible header clearance');
headingMargin = '240px'; BUI.clearFollowupAnchor(anchorRoot, anchorClick);
check(anchorTarget.style.scrollMarginTop === '240px', 'larger existing heading clearance is retained');
anchorTarget.style = {}; fragment = 'https://ps.btl.gov.il/'; BUI.clearFollowupAnchor(anchorRoot, anchorClick);
check(Object.keys(anchorTarget.style).length === 0, 'external personal-area action is untouched');
fragment = '#jt28-self-h'; inside = false; BUI.clearFollowupAnchor(anchorRoot, anchorClick);
check(Object.keys(anchorTarget.style).length === 0, 'unrelated targets outside this tool are untouched');
inside = true; headerPosition = 'static'; BUI.clearFollowupAnchor(anchorRoot, anchorClick);
check(Object.keys(anchorTarget.style).length === 0, 'non-sticky header does not add unnecessary clearance');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
