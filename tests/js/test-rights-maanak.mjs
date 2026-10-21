/**
 * The rights wave 2A (22.10.2026, HAD-578): golden tests of the work-grant engine and UI (maanak-avoda).
 * Every expected value is computed by hand from the Work Grant Law as indexed on 1.1.2026 (tax year 2025); the section
 * is in the message. Run: node tests/js/test-rights-maanak.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compute, schedule, curve, payments, excessIncome } from '../../assets/js/tools/maanak-engine.js';
import { snapshot, renderForm, renderResult, renderDetails, stateOf, inputOf, KEYS, EXAMPLE, scenarioText, bandsTable } from '../../assets/js/tools/maanak-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.005) => Math.abs(a - b) <= eps;
const run = (i) => compute(reg, Object.assign({ filed: '2026-10-22' }, i));
const solo = { spouse: false, spouseIncome: 0, toddlers: 0 };

// The example (s.2(1), s.6א, s.6ב1, s.6ב1(ב)): 390 × 150% + 500 = 1,085 a month; the spouse rule with a toddler:
// 5,000 + 6,000 = 11,000 < 16,180 + 0 + min(6,000 − 5,690, 3,100) = 16,490, so no cut; × 12 = 13,020.
let r = run(EXAMPLE);
check(r.ok && r.eligible && near(r.monthly, 1085) && near(r.annual, 13020), `example: 1,085 a month, 13,020 a year (got ${r.monthly} / ${r.annual})`);
check(r.pay.rows.length === 2 && r.pay.rows[0].date === '2026-12-15' && r.pay.rows[1].date === '2027-02-15' && near(r.pay.rows[0].amount, 6510), 's.12: filed 22.10.2026 → two payments of 6,510, 15.12.2026 and 15.2.2027');
check(r.deadline === '2027-12-31', 'tax year 2025: online until 31.12.2027');

// s.2(1) without children, age 55+ (born 1965): plateau 390 × 12 = 4,680.
r = run(Object.assign({}, solo, { kids: 0, by: 1965, sex: 'm', income: 5000 }));
check(r.eligible && near(r.monthly, 390) && near(r.annual, 4680), 's.2(1)(ב): no children, 55+, 5,000 → 390 a month, 4,680 a year');
// s.2(2) + s.6א: 3 children, plateau 570 × 150% = 855; × 12 = 10,260 = the published maximum.
r = run(Object.assign({}, solo, { kids: 3, income: 5000 }));
check(near(r.monthly, 855) && near(r.annual, reg.rights_maanak.years['2025'].max_year), 's.2(2)(ב) + s.6א: 3 children → 855 a month, 10,260 = the published maximum');
// Phase-in: 3,000 → 100 + 16.1% × 550 = 188.55; × 150% = 282.83 (rounded to the agora).
r = run(Object.assign({}, solo, { kids: 2, income: 3000 }));
check(near(r.monthly, 282.83) && near(r.annual, 3393.96), 's.2(1)(א): 3,000 → (100 + 0.161 × 550) × 1.5 = 282.83; × 12 = 3,393.96');
// Phase-out: 6,500 → 390 − 23% × 820 = 201.40; × 150% = 302.10.
r = run(Object.assign({}, solo, { kids: 2, income: 6500 }));
check(near(r.monthly, 302.1) && near(r.annual, 3625.2), 's.2(1)(ג): 6,500 → (390 − 0.23 × 820) × 1.5 = 302.10; × 12 = 3,625.20');
// The floor: "עלה על 2,450" — 2,450 itself gets nothing; 2,451 → 100.16 × 1.5 = 150.24.
r = run(Object.assign({}, solo, { kids: 2, income: 2450 }));
check(r.ok && !r.eligible && r.annual === 0, 's.2(1)(א): exactly 2,450 is not above the floor → no grant');
r = run(Object.assign({}, solo, { kids: 2, income: 2451 }));
check(near(r.monthly, 150.24), 's.2(1)(א): 2,451 → (100 + 0.161) × 1.5 = 150.24');
// The 20 ₪ monthly line (Tax Authority; the published top 7,289): 7,288 → 390 − 0.23 × 1,608 = 20.16 → 30.24; 7,289 → 19.93 → 0.
r = run(Object.assign({}, solo, { kids: 2, income: 7288 }));
check(near(r.monthly, 30.24), 'the 20 ₪ line: 7,288 → 20.16 × 1.5 = 30.24');
r = run(Object.assign({}, solo, { kids: 2, income: 7289 }));
check(!r.eligible && r.annual === 0, 'the 20 ₪ line: 7,289 → 19.93 before 150%, under 20 → nothing (the published band ends at 7,289)');
// Single parent (s.6ב(א)(1)): 9,000 → (390 − 11.6% × 1,000) × 150% = 411.
r = run(Object.assign({}, solo, { kids: 1, single: true, income: 9000 }));
check(r.track === 'single' && near(r.monthly, 411) && near(r.annual, 4932), 's.6ב(א)(1)(ג): single parent, 9,000 → (390 − 116) × 1.5 = 411; × 12 = 4,932');
// Single parent, 3 children, phase-in (s.6ב(א)(2)(א)): 3,000 → (140 + 15.5% × 1,490) × 150% = 556.43.
r = run(Object.assign({}, solo, { kids: 3, single: true, income: 3000 }));
check(near(r.monthly, 556.43), 's.6ב(א)(2)(א): single parent of 3, 3,000 → (140 + 230.95) × 1.5 = 556.43');
// Single parent with a toddler (s.6ב2(א)(1)(ג)): 9,000 → 411 + (500 − 500/3,190 × 1,000) = 411 + 343.26 = 754.26.
r = run(Object.assign({}, solo, { kids: 1, toddlers: 1, single: true, income: 9000 }));
check(near(r.monthly, 754.26), 's.6ב2: single parent, toddler, 9,000 → 411 + 343.26 = 754.26');
// Toddler past the regular ceiling (s.6ב1(א)(1)(ג)): 8,000 → base 0; toddler 500 − 34.5% × 610 = 289.55.
r = run(Object.assign({}, solo, { kids: 2, toddlers: 1, income: 8000 }));
check(r.eligible && near(r.monthly, 289.55) && near(r.annual, 3474.6), 's.6ב1: 8,000 is above the regular grant, the toddler supplement alone: 500 − 210.45 = 289.55');
// Two toddlers: the phase-out rate is divided by 2 → each 500 − 17.25% × 610 = 394.78; × 2 = 789.56.
r = run(Object.assign({}, solo, { kids: 2, toddlers: 2, income: 8000 }));
check(near(r.monthly, 789.56), 's.6ב1(א)(1)(ג): two toddlers, 8,000 → 2 × (500 − 0.1725 × 610) = 789.56');
// Additional income below the line (s.4(1)): pension 1,000 moves 5,680 to 4,680: 5,000 → 390 − 23% × 320 = 316.40 → 474.60.
r = run(Object.assign({}, solo, { kids: 2, income: 5000, extra: 1000 }));
check(near(r.monthly, 474.6), 's.4(1): extra 1,000 → the plateau ends at 4,680; 5,000 → (390 − 73.6) × 1.5 = 474.60');
// Additional income at or above the line (s.4(2)): 2,000 → the determining sum 3,230 − 2,000 = 1,230; 3,000 → 188.55.
let sc = schedule(reg.rights_maanak.years['2025'].regular.k12, 3000, 2000);
check(near(sc.amount, 188.55) && near(sc.max, 298.03) && sc.p1 === 3680, 's.4(2): extra 2,000 → max 100 + 0.161 × 1,230 = 298.03, pivot 3,680; 3,000 → 188.55');
sc = schedule(reg.rights_maanak.years['2025'].regular.k12, 3000, 3300);
check(sc.amount === 0, 's.4(2): extra 3,300 > 3,230 → the determining sum is negative → 0');
// The spouse (s.5): 5,000 + 12,000 = 17,000 − (14,210 + 0 + 1,710) = 1,080 excess; 23% = 248.40; (390 − 248.40) × 1.5 = 212.40.
check(near(excessIncome(reg.rights_maanak.years['2025'].spouse, 5000, 12000), 1080), 's.5(ב): excess income 1,080');
r = run({ kids: 2, toddlers: 0, spouse: true, spouseIncome: 12000, income: 5000 });
check(near(r.monthly, 212.4), 's.5(א)(1): spouse 12,000 → (390 − 248.40) × 1.5 = 212.40');
r = run({ kids: 3, toddlers: 0, spouse: true, spouseIncome: 12000, income: 5000 });
check(near(r.monthly, 474.3), 's.5(א)(2): 3 children, 23.5% × 1,080 = 253.80; (570 − 253.80) × 1.5 = 474.30');
// The spouse with a toddler (s.6ב1(ב)): 20,000 − (16,180 + 0 + 3,100) = 720; 23% = 165.60 off the total 1,085 → 919.40.
r = run({ kids: 2, toddlers: 1, spouse: true, spouseIncome: 15000, income: 5000 });
check(near(r.monthly, 919.4), 's.6ב1(ב): spouse 15,000 with a toddler → 1,085 − 165.60 = 919.40');
// Women aged 60-67 born from 1960 (s.6ה): born 1963 (62 in 2025), 5,000 → 1,210; × 12 = 14,520.
r = run(Object.assign({}, solo, { kids: 0, by: 1963, sex: 'f', income: 5000 }));
check(r.track === 'women60' && near(r.monthly, 1210) && near(r.annual, 14520), 's.6ה(א)(2): working woman born 1963, 5,000 → 1,210 a month, 14,520 a year');
r = run(Object.assign({}, solo, { kids: 3, by: 1963, sex: 'f', income: 5000 }));
check(r.track === 'women60' && near(r.monthly, 1210), 's.6ה(א): the higher of 1,210 and the regular 855 is paid');
r = run(Object.assign({}, solo, { kids: 0, by: 1959, sex: 'f', income: 5000 }));
check(r.track === 'regular' && near(r.monthly, 390), 's.6ה: born 1959, before 1.1.1960 → the regular 55+ grant, 390');
r = run(Object.assign({}, solo, { kids: 0, by: 1963, sex: 'f', income: 2000 }));
check(near(r.monthly, 498.67), 's.6ה(א)(1): 2,000 → 140 + 33.21% × 1,080 = 498.67 (the regular grant is 0 below 2,450)');
r = run({ kids: 0, toddlers: 0, by: 1963, sex: 'f', income: 5000, spouse: true, spouseIncome: 12000 });
check(near(r.monthly, 1151.2), 's.6ה(ג): spouse 12,000 → 17,000 − (15,210 + 0 + 1,650) = 140; 42% = 58.80; 1,210 − 58.80 = 1,151.20');
// Age (ss.1-2): a parent from 21; without children from 55.
r = run(Object.assign({}, solo, { kids: 1, by: 2005, income: 5000 }));
check(r.ok && !r.eligible && r.reasons.length === 1, 's.1: a parent aged 20 in 2025 → not eligible');
r = run(Object.assign({}, solo, { kids: 1, by: 2004, income: 5000 }));
check(r.eligible, 's.1: a parent aged 21 in 2025 → eligible');
r = run(Object.assign({}, solo, { kids: 0, by: 1971, sex: 'm', income: 5000 }));
check(!r.eligible, 's.2: no children, 54 → not eligible');
r = run(Object.assign({}, solo, { kids: 0, by: 1970, sex: 'm', income: 5000 }));
check(r.eligible, 's.2: no children, 55 → eligible');
// Real estate (s.3(א)(1)) and the months (s.2: per month of actual work).
r = run(Object.assign({}, EXAMPLE, { realEstate: true }));
check(r.ok && !r.eligible && r.annual === 0, 's.3(א)(1): another real-estate right above 50% → no grant');
r = run(Object.assign({}, EXAMPLE, { months: 6 }));
check(near(r.annual, 6510), 's.2: 6 months of actual work → 1,085 × 6 = 6,510');
// Payments (s.12): filed by 30.6 → four; after 30.11 → no published schedule; a small grant → one payment.
const rm = reg.rights_maanak;
let pay = payments(rm, 2025, '2026-05-01', 13020, 950);
check(pay.rows.length === 4 && pay.rows[0].date === '2026-07-15' && pay.rows[3].date === '2027-02-15' && near(pay.rows[0].amount, 3255), 's.12(1): filed 1.5.2026 → four payments of 3,255 from 15.7.2026');
pay = payments(rm, 2025, '2026-12-05', 13020, 950);
check(pay.rows.length === 0 && pay.late, 's.12(4): filed after 30.11.2026 → no published calendar');
r = run(Object.assign({}, solo, { kids: 0, by: 1960, sex: 'm', income: 7200, months: 10 }));
check(near(r.annual, 404) && r.pay.rows.length === 1 && r.pay.single, 's.12(3א): 390 − 0.23 × 1,520 = 40.40 × 10 = 404 ≤ 950 → one payment');
// The official simulator (misim.gov.il, run on 22.10.2026 with a single mother born 1990, 2 children, 60,000 ₪ in 12 months):
// 7,020 ₪. The engine: single parent, 1-2 children, 5,000 a month is on the plateau → 390 × 150% × 12 = 7,020.
r = run(Object.assign({}, solo, { kids: 2, single: true, by: 1990, income: 5000 }));
check(near(r.annual, 7020), 'equals the Tax Authority simulator: single parent of 2, 60,000 ₪ a year → 7,020');
// Tax year 2024: the bands only.
r = run(Object.assign({}, solo, { year: 2024, kids: 2, income: 5000 }));
check(r.mode === 'bands' && r.eligible && r.monthly === null, '2024: 5,000 is inside 2,390-7,220 → in the band, no invented amount');
r = run(Object.assign({}, solo, { year: 2024, kids: 2, income: 7300 }));
check(r.mode === 'bands' && !r.eligible, '2024: 7,300 is above 7,220 → outside the band');
// Input errors.
check(!compute(reg, { income: 'abc' }).ok, 'error: income not a number');
check(!compute(reg, Object.assign({}, EXAMPLE, { months: 13 })).ok, 'error: 13 months');
check(!compute(reg, Object.assign({}, EXAMPLE, { kids: 1, toddlers: 2 })).ok, 'error: more toddlers than children');
check(!compute(reg, Object.assign({}, EXAMPLE, { by: 19 })).ok, 'error: birth year of 2 digits');
check(!compute(reg, Object.assign({}, EXAMPLE, { year: 2023 })).ok, 'error: 2023 is closed');
// The curve: the same function at each income; the peak for the example family is 585 + 500.
const c = curve(rm, run(EXAMPLE).p);
check(c.pts.length === 49 && near(Math.max(...c.pts.map((x) => x[1])), 1085) && c.pts[0][1] === 0, 'the curve: 49 points, peak 1,085, zero at 0');
// The snapshot and the renderers.
const s = snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.sentence, renderForm(reg, { kids: 0 }), renderResult(reg, run({ income: 'x' })), renderDetails(reg, run(Object.assign({}, EXAMPLE, { realEstate: true }))), bandsTable(reg)].join('');
check(s.result.includes('13,020') && s.result.includes('15.12.2026') && s.method.includes('סעיף 6ב1') && s.compare_table.includes('<caption'), 'snapshot: the example figures, the dates, the sections and the table');
check(!/<h2[\s>]/.test(all), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|>null</.test(all), 'no undefined / NaN / null in any rendered string');
check(s.result.includes('<svg') && s.result.includes('role="img"'), 'the grant curve renders as a labelled SVG');
// Share state round trip and the scenario.
const back = inputOf(decodeState(`#s=${stateOf(EXAMPLE)}`, KEYS));
check(back && near(run(back).annual, 13020), 'share state round trip: stateOf → decodeState → inputOf gives the same 13,020');
const text = scenarioText(reg, run(EXAMPLE));
check(text.includes('13,020') && text.includes('2025') && !/undefined|NaN/.test(text), 'the simulation scenario carries the figures');
const hs = handoffState('abc', text, 'court_rehearsal');
check(hs.phase === 'intake' && hs.locale === 'he' && hs.intensity === 'medium' && hs.judgePersona === 'procedural' && Array.isArray(hs.chatHistory) && hs.caseData === null, 'the handoff state is what the simulation accepts (intake, he, medium, procedural)');
// The registry: every figure read carries a source.
for (const k of ['law_url', 'claim_url', 'service_url', 'simulator_url', 'faq_url', 'status_url']) { check(/^https:\/\//.test(rm[k] || ''), `registry: ${k} is an https url`); }
for (const y of ['2025', '2024']) { check(/^https:\/\/www\.gov\.il\//.test(rm.years[y].guide_url), `registry: the ${y} guide is on gov.il`); }

console.log(`rights maanak-avoda: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
