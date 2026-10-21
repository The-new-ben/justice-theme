/**
 * The rights wave 2A (22.10.2026, HAD-578): golden tests of the net-salary engine and UI (sachar-neto), 2026.
 * The reference case (10,000 ₪, 2.25 points, pension 6%, study fund 2.5%) equals the National Insurance calculator
 * (608.46) and the Tax Authority simulator (tax before the pension credit 575) as measured on 21.10.2026; the rest is
 * computed by hand from the 2026 brackets, the booklet's ceilings and the rates. Run: node tests/js/test-rights-neto.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeNeto, netoBl, netoImputed, netoPensionCredit, netoKids } from '../../assets/js/tools/neto-engine.js';
import { tierParts, charge } from '../../assets/js/tools/bituach-engine.js';
import { snapshot, renderForm, renderResult, renderDetails, stateOf, inputOf, KEYS, EXAMPLE, scenarioText, netTable } from '../../assets/js/tools/neto-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.005) => Math.abs(a - b) <= eps;
const man = { gender: 'm', marital: 'single', kids: [] };
const run = (i) => computeNeto(reg, i);

// The reference: 120,000 a year → 8,412 + 14% × 35,880 = 13,435.20 → 1,119.60 a month; − 2.25 × 242 = 544.50 → 575.10
// (the Tax Authority simulator: 575); − 35% × 600 = 210 → 365.10. NI 7,703 × 1.04% + 2,297 × 7% = 80.11 + 160.79 = 240.90;
// health 7,703 × 3.23% + 2,297 × 5.17% = 248.81 + 118.75 = 367.56 (the NI calculator: 608.46).
let r = run({ gross: 10000, profile: man, sf: true });
check(r.ok && near(r.m.tax.before, 1119.6) && near(r.m.tax.before - r.m.tax.pointsValue, 575.1), 'reference: tax before credits 1,119.60; after 2.25 points 575.10 (= the Tax Authority simulator)');
check(near(r.m.credit, 210) && near(r.tax, 365.1), 's.45א: 35% × 600 = 210 → tax 365.10');
check(near(r.bl, 240.9) && near(r.health, 367.56) && near(r.bl + r.health, 608.46), 'NI 240.90 + health 367.56 = 608.46 (= the NI calculator)');
check(near(r.pension, 600) && near(r.study, 250) && near(r.net, 8176.44), 'net 10,000 − 365.10 − 608.46 − 600 − 250 = 8,176.44');
// The example: a woman, married, no children, 12,000, pension 6%. 144,000 → 8,412 + 5,124 + 20% × 23,280 = 18,192 → 1,516;
// − 2.75 × 242 = 665.50; − 35% × min(720, 7% × 9,700 = 679) = 237.65 → 612.85. NI 80.11 + 300.79 = 380.90; health 248.81 + 222.15.
r = run(EXAMPLE);
check(near(r.m.points, 2.75) && near(r.m.tax.before, 1516) && near(r.m.credit, 237.65) && near(r.tax, 612.85), 'example: 1,516 − 665.50 − 237.65 = 612.85');
check(near(r.bl, 380.9) && near(r.health, 470.96) && near(r.net, 9815.29), 'example: NI 380.90, health 470.96, net 9,815.29');
check(near(r.employerCost, 14173.98), 'example: employer 12,000 + 780 + 720 + 347.41 + 326.57 = 14,173.98');
check(r.marginal === 20 && r.keep > 0 && r.keep < 1000, 'example: the 20% bracket; of 1,000 more, some is kept');
// The pension credit's cap: 7% of 9,700 = 679 → at most 237.65; a low salary: 7% × 3,000 = 210 → 35% × 180 = 63.
check(near(netoPensionCredit(reg.rights_neto, 30000, 1800), 237.65), 's.45א: the credit stops at 35% × 679 = 237.65');
check(near(netoPensionCredit(reg.rights_neto, 3000, 180), 63), 's.45א: 3,000 × 6% = 180 ≤ max(189, 210) → 63');
// Points override and no points.
r = run({ gross: 12000, points: 0, profile: man });
check(near(r.tax, 1278.35), 'no credit points: 1,516 − 237.65 = 1,278.35');
// Children from the profile (2026 table): a mother of children born 2019 and 2023: 2.75 + 2 + 3.5 = 8.25 points.
r = run({ gross: 12000, profile: { gender: 'f', marital: 'married', kids: [[2019, 1], [2023, 1]] } });
check(near(r.m.points, 8.25) && r.tax === 0, 'credit points from the profile: 8.25; the points cover all the tax');
check(r.notes.some((n) => n.key === 'zero'), 'the note: the points cover the tax, the rest is not paid out');
// Employer deposits above the ceilings (s.3(ה3), s.3(ה)): 80,000 with a study fund.
const imp = netoImputed(reg.rights_neto, 80000, 5200, 4800, 80000, 6000);
check(near(imp.erT, 2618.28) && near(imp.esT, 1000) && near(imp.krT, 4821.6), 's.3(ה3)/(ה): 5,200 − 7.5% × 34,423 = 2,618.28; 4,800 − 3,800 = 1,000; 6,000 − 7.5% × 15,712 = 4,821.60');
r = run({ gross: 80000, profile: man, sf: true });
check(near(r.m.taxable, 88439.88) && r.marginal === 50 && r.m.tax.surtax > 0, 'surtax: taxable 88,439.88 > 60,130 a month → 47% + 3%');
check(r.notes.some((n) => n.key === 'imputed'), 'the note: deposits above the ceiling were added to the income');
// The NI ceiling: 60,000 → only 51,910 counts: 80.11 + 7% × 44,207 = 3,174.60.
r = run({ gross: 60000, profile: man });
check(near(r.bl, 3174.6), 'NI ceiling: 80.11 + 0.07 × 44,207 = 3,174.60');
// The NI split cross-checked against the wave-1 National Insurance engine.
const rb = reg.rights_bituach;
for (const g of [5000, 7703, 20000, 51910]) {
	const a = netoBl(rb, 'work', g);
	const b = charge(tierParts(g, 0, rb.tier.amount, rb.max.amount), rb.employee.work);
	check(near(a.bl, b.bl) && near(a.health, b.health) && near(a.employer, b.employer), `NI on ${g}: the same as bituach-engine (${a.bl} / ${b.bl})`);
}
// Overtime (ss.16-17, divisor 182): 9,100 / 182 = 50 an hour; 10 h × 125% + 4 h × 150% = 625 + 300.
r = run({ gross: 9100, ot125: 10, ot150: 4, profile: man });
check(near(r.m.hourlyRate, 50) && near(r.m.ot, 925) && near(r.gross, 10025), 'overtime: 50 × (1.25 × 10 + 1.5 × 4) = 925; gross 10,025');
// Hourly: 40 × 182 = 7,280. Net to gross: 8,176.44 → 10,000 back.
r = run({ mode: 'hourly', hourly: 40, hours: 182, profile: man });
check(near(r.gross, 7280), 'hourly: 40 × 182 = 7,280');
r = run({ mode: 'hourly', hourly: 30, hours: 182, profile: man });
check(r.notes.some((n) => n.key === 'minwage'), 'hourly 30 is under the 2026 minimum 35.40 → the note');
r = run({ mode: 'net', net: 8176.44, profile: man, sf: true });
check(near(r.gross, 10000, 0.02), `net to gross: 8,176.44 → 10,000 (got ${r.gross})`);
// A second job (reg.5(א); NI letter 651): 3,000 → 47% = 1,410; NI + health from the first shekel 12.17% = 365.10 → 1,224.90;
// coordinated: 20% = 600 and the same 365.10 above the tier → 2,034.90; 810 a month waits for the refund.
r = run({ gross: 12000, second: true, gross2: 3000, profile: man });
check(near(r.sec.flatTax, 1410) && near(r.sec.netFlat, 1224.9) && near(r.sec.netCoord, 2034.9) && near(r.sec.stuck, 810), 'second job: 1,224.90 without coordination, 2,034.90 with it, 810 a month apart');
// Age bands: an old-age pensioner pays no NI or health; under 18 neither.
r = run({ gross: 8000, band: 'oap', profile: man });
check(r.bl === 0 && r.health === 0, 'old-age pension: no NI and no health deducted');
r = run({ gross: 8000, band: 'u18', profile: man });
check(r.bl === 0 && r.health === 0, 'under 18: no NI and no health deducted');
// Travel is taxable income; pension off removes the credit.
r = run({ gross: 10000, travel: 400, profile: man });
check(near(r.gross, 10400) && near(r.m.taxable, 10400), 'travel 400: part of the gross and of the taxable income');
r = run({ gross: 10000, pension: false, profile: man });
check(r.pension === 0 && r.m.credit === 0 && near(r.tax, 575.1), 'no pension: no deposit, no credit, tax 575.10');
// Errors.
check(!run({ gross: 'abc' }).ok, 'error: gross not a number');
check(!run({ gross: 10000, pe: 11 }).ok, 'error: employee pension 11%');
check(!run({ gross: 10000, points: 31 }).ok, 'error: 31 credit points');
check(!run({ mode: 'hourly', hourly: 40, hours: 0 }).ok, 'error: 0 hours');
// The work-grant hand-off: children under 19 and toddlers in tax year 2025.
const k = netoKids({ kids: [[2019, 1], [2023, 1], [2004, 1]] }, 2025);
check(k.kids === 2 && k.toddlers === 1, 'work-grant hint: born 2019 and 2023 count, 2004 does not (19 in 2025); one toddler');
// The page table: 11 salaries, the 2026 minimum wage and the average wage.
const t = netTable(reg);
check((t.match(/<tr>/g) || []).length === 12 && t.includes('6,443.85') && t.includes('13,769'), 'the page table: 11 rows from the minimum wage 6,443.85 to 50,000, with the average 13,769');
// Snapshot, renderers, state, scenario.
const s = snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.sentence, renderForm(reg, { mode: 'net' }), renderResult(reg, run({ gross: 'x' })), renderDetails(reg, run({ gross: 12000, second: true, gross2: 3000, ot125: 5, travel: 300, sf: true, profile: man }))].join('');
check(s.result.includes('9,815.29') && s.method.includes('סעיף 45א') && s.compare_table.includes('<caption'), 'snapshot: the example net, the sections and the table');
check(s.lead.includes('9,815.29') && s.lead.includes('data-lead-go') && !/<h[1-6][\s>]/.test(s.lead), 'the result-first card carries the example 9,815.29 and the jump to the form');
check(!/<h2[\s>]/.test(all), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|>null</.test(all), 'no undefined / NaN / null in any rendered string');
const back = inputOf(decodeState(`#s=${stateOf(Object.assign({}, EXAMPLE, { ot125: 5, sf: true, second: true, gross2: 2500 }))}`, KEYS));
const r1 = run(Object.assign({}, EXAMPLE, { ot125: 5, sf: true, second: true, gross2: 2500 }));
check(back && near(run(back).net, r1.net) && near(run(back).sec.netFlat, r1.sec.netFlat), 'share state round trip keeps the net and the second job');
check(inputOf(decodeState('#s=g5000', KEYS)).gross === 5000, 'the hand-off from the work grant (#s=g5000) opens on 5,000');
const text = scenarioText(reg, run(EXAMPLE));
check(text.includes('12,000') && text.includes('9,815') && !/undefined|NaN/.test(text), 'the simulation scenario carries the figures');
// The registry figures this engine reads exist and carry sources.
const rn = reg.rights_neto;
for (const key of ['pension', 'pension_credit', 'employer_ceiling', 'study_fund', 'overtime', 'travel', 'second_job']) { check(/^https:\/\//.test(rn[key].url || ''), `registry: rights_neto.${key} has an https source`); }

console.log(`rights sachar-neto: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
