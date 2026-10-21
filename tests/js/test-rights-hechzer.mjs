/**
 * Golden tests for the salaried tax-refund calculator (hechzer-mas, the rights wave, 21.10.2026).
 * Run: node tests/js/test-rights-hechzer.mjs
 *
 * Each year with its own annual brackets (s.121, the January booklets), the surtax of s.121ב (3% above 651,600 in 2020 ...
 * 721,560 in 2024-2026), its credit point (s.33א) and the donation credit of s.46 (35%, above the yearly minimum, up to
 * 30% of the income). Refund = tax withheld (Form 106, field 042) minus the liability, six years back (s.160(א)).
 * The arithmetic of each hard case is written in its message.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/mas-engine.js';
import * as H from '../../assets/js/tools/hechzer-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const rt = reg.rights_tax;
const EX = H.EXAMPLE;
const man = { gender: 'm', marital: 'single' };
const one = (profile, row) => E.computeRefund(reg, Object.assign({}, E.PROFILE_DEFAULT, profile, { rows: [row] }));
const y1 = (r) => r.years[0];
const codes = (y) => y.reasons.map((x) => x.code).join(',');

/* ---------- 1. The registry ---------- */
check(JSON.stringify(rt.years['2024'].brackets) === '[[84120,10],[120720,14],[193800,20],[269280,31],[560280,35],[null,47]]' && JSON.stringify(rt.years['2025'].brackets) === JSON.stringify(rt.years['2024'].brackets) && rt.years['2025'].frozen, 'registry: the 2024 brackets, and 2025 the same (the freeze law)');
check(rt.years['2026'].brackets[2][0] === 228000 && rt.years['2026'].brackets[3][0] === 301200 && /^https:\/\//.test(rt.years['2026'].change_url), 'registry: 2026 widened: 20% to 228,000 and 31% to 301,200 (the law of 31.3.2026), with the notice');
check(['2020', '2021', '2022', '2023', '2024'].map((y) => rt.years[y].surtax.threshold).join(',') === '651600,647640,663240,698280,721560' && rt.years['2026'].surtax.threshold === 721560, 'registry: the surtax line 651,600 / 647,640 / 663,240 / 698,280 / 721,560 (2024-2026)');
check(['2020', '2021', '2022', '2023', '2024'].map((y) => rt.years[y].donation.min).join(',') === '190,190,190,200,207' && rt.donation.pct === 35 && rt.donation.income_cap_pct === 30, 'registry: the s.46 minimum 190/190/190/200/207, 35%, 30% of the income');
check(rt.refund.years_back === 6 && rt.refund.section === 'סעיף 160(א)' && rt.refund.interest.pct === 4 && /^https:\/\/secapp\.taxes\.gov\.il\//.test(rt.refund.online_url) && /^https:\/\/www\.gov\.il\//.test(rt.refund.form_url) && rt.form106.fields.salary.field === '158/172' && rt.form106.fields.tax.field === '042', 'registry: six years (s.160(א)), 4% (s.159א), the online filing and Form 135, fields 158/172 and 042');
check(E.refundYears(rt).join(',') === '2020,2021,2022,2023,2024,2025' && E.refundDeadline(rt, 2020) === '2026-12-31', 'in 2026 the open years are 2020-2025; 2020 closes on 31.12.2026');

/* ---------- 2. The example: 7 months of 2024, one employer, the degree point missed ---------- */
const ex = E.computeRefund(reg, EX);
const e = y1(ex);
check(ex.ok && e.points === 3.25 && e.pointsSource === 'profile', 'example: 3.25 points from the profile: 2.25 resident + 1 for a BA finished in 2023 (s.40ג, the rule from 2023)');
check(e.gross.bracketTax === 11335.2 && e.gross.surtax === 0 && e.gross.marginal === 14, 'example: 84,120 × 10% = 8,412 + 20,880 × 14% = 2,923.20 = 11,335.20; marginal 14%');
check(e.ptsValue === 9438 && e.ptsCredit === 9438 && e.liability === 1897.2, 'example: 3.25 × 2,904 = 9,438; liability 11,335.20 − 9,438 = 1,897.20');
check(e.refund === 9102.8 && ex.total === 9102.8 && e.owe === 0 && e.deadline === '2030-12-31', 'example: refund 11,000 − 1,897.20 = 9,102.80, until 31.12.2030');
check(codes(e) === 'partial,points' && e.reasons[1].he.includes('2,904'), 'example: two reasons: a partial year (7 months), and 1 point not given, worth 2,904 a year');

/* ---------- 3. Hard cases ---------- */
const top = y1(one(man, { y: 2024, income: 800000, tax: 262000, months: 12 }));
check(top.gross.bracketTax === 266069.2 && top.gross.surtax === 2353.2 && top.gross.total === 268422.4 && top.gross.marginal === 50, 'top bracket 2024, 800,000: 8,412 + 5,124 + 14,616 + 23,398.80 + 101,850 + 239,720 × 47% = 112,668.40 = 266,069.20; surtax 78,440 × 3% = 2,353.20; marginal 50%');
check(top.liability === 261888.4 && top.refund === 111.6 && codes(top).includes('surtax'), 'top bracket: 268,422.40 − 2.25 × 2,904 (6,534) = 261,888.40; withheld 262,000 -> refund 111.60; the surtax reason');
check(E.grossTax(rt, 2024, 721560).surtax === 0 && E.grossTax(rt, 2024, 721561).surtax === 0.03 && E.grossTax(rt, 2020, 651601).surtax === 0.03, 'the surtax line: exactly 721,560 -> 0; one shekel above -> 0.03 (2024); 651,601 -> 0.03 (2020)');
const zero = y1(one(man, { y: 2023, income: 0, tax: 0, months: 0 }));
check(zero.liability === 0 && zero.refund === 0 && zero.owe === 0 && codes(zero) === 'none', 'zero income, zero months: no tax, no refund, the reason says so');
const over = y1(one(Object.assign({ degree: 'ba', degreeYear: 2023 }, man), { y: 2025, income: 60000, tax: 1200, months: 12, emp: 3.25 }));
check(over.gross.total === 6000 && over.ptsCredit === 6000 && over.unused === 3438 && over.liability === 0 && over.refund === 1200 && codes(over) === 'unused', 'points above the tax: 60,000 × 10% = 6,000; points 9,438; no negative tax: liability 0, 3,438 unused; refund = the 1,200 withheld');
check(E.grossTax(rt, 2026, 250000).total === 41812 && E.grossTax(rt, 2025, 250000).total === 45574, 'a year where the rules changed: 250,000 in 2026 = 8,412 + 5,124 + 107,280 × 20% + 22,000 × 31% = 41,812; in 2025 = 8,412 + 5,124 + 14,616 + 56,200 × 31% = 45,574');
const y22 = y1(one({ gender: 'f', kids: [[2014, 1]] }, { y: 2022, income: 150000, tax: 10216.2, months: 12, emp: 3.75 }));
check(y22.points === 4.75 && y22.gross.total === 20251.2 && y22.liability === 7540.2 && y22.refund === 2676 && codes(y22) === 'points,change', '2022, a mother of an 8-year-old: 4.75 points with the 6-12 point (law of 18.5.2022); 20,251.20 − 12,711 = 7,540.20; withheld on 3.75 points -> refund 2,676 (one point), with the change reason');
const y24 = y1(one({ gender: 'f', kids: [[2023, 1]] }, { y: 2024, income: 200000, tax: 12000, months: 12 }));
check(y24.points === 7.25 && y24.gross.total === 30074 && y24.liability === 9020 && y24.refund === 2980 && codes(y24) === 'change', '2024, a mother of a one-year-old: 2.75 + 4.5 (amendment 271) = 7.25; 30,074 − 21,054 = 9,020; refund 2,980, with the change reason');
const two = y1(one(man, { y: 2023, income: 180000, tax: 40000, months: 12, jobs: 2, coord: false }));
check(two.gross.total === 25735.2 && two.liability === 19390.2 && two.refund === 20609.8 && codes(two) === 'twojobs', 'two employers without coordination, 2023: 8,148 + 4,939.20 + 12,648 = 25,735.20 − 6,345 = 19,390.20; withheld 40,000 -> refund 20,609.80');
check(codes(y1(one(man, { y: 2023, income: 180000, tax: 19390.2, months: 12, jobs: 2, coord: true }))) === '' && y1(one(man, { y: 2023, income: 180000, tax: 19390.2, months: 12, jobs: 2, coord: true })).refund === 0, 'two employers with coordination, withheld exactly the liability: no reason, no refund');
const owe = y1(one(man, { y: 2023, income: 180000, tax: 15000, months: 12 }));
check(owe.refund === 0 && owe.owe === 4390.2 && H.verdictSentence(reg, one(man, { y: 2023, income: 180000, tax: 15000, months: 12 })).includes('אין החזר'), 'withheld less than the liability: no refund, 4,390.20 short, the sentence says so');

/* ---------- 4. Donations (s.46) ---------- */
const don = (d, income = 180000, tax = 40000) => y1(one(man, { y: 2023, income, tax, months: 12, don: d }));
check(don(1000).donation.applied === 350 && don(1000).refund === 20959.8, 'donations 1,000 in 2023: 35% = 350; refund 20,609.80 + 350 = 20,959.80');
check(don(200).donation.applied === 0 && codes(don(200)).includes('don_min') && don(201).donation.applied === 70.35, 'the 2023 minimum is 200 and the law says "a sum exceeding": 200 -> no credit; 201 -> 70.35');
const big = don(100000, 300000, 57351);
check(big.gross.total === 63696 && big.donation.eligible === 90000 && big.donation.applied === 31500 && big.liability === 25851 && big.refund === 31500, 'the cap: 300,000 in 2023 -> tax 63,696; donations 100,000 capped at 30% = 90,000; credit 31,500; liability 63,696 − 6,345 − 31,500 = 25,851');
check(y1(one(man, { y: 2023, income: 50000, tax: 0, months: 12, don: 5000 })).donation.applied === 0, 'a donation credit never makes the tax negative: 50,000 -> 5,000 tax, all covered by points; 0 applied');

/* ---------- 5. Several years, pending rows, manual points, insurance ---------- */
const multi = E.computeRefund(reg, Object.assign({}, E.PROFILE_DEFAULT, man, { rows: [{ y: 2024, income: 105000, tax: 11000, months: 7, emp: 2.25 }, { y: 2021, income: 90000, tax: 5000, months: 12 }, { y: 2025 }] }));
check(multi.ok && multi.years.map((y) => y.y).join(',') === '2021,2024' && multi.pending.join(',') === '2025', 'several years sorted; a year with no 106 figures waits, no error');
check(multi.years[0].gross.total === 9580.8 && multi.years[0].liability === 3694.8 && multi.years[0].refund === 1305.2, '2021, 90,000: 75,480 × 10% = 7,548 + 14,520 × 14% = 2,032.80 = 9,580.80 − 2.25 × 2,616 (5,886) = 3,694.80; refund 5,000 − 3,694.80 = 1,305.20');
check(multi.years[1].refund === 6198.8 && multi.total === 7504 && multi.deadlines.map((d) => d.date).join(',') === '2027-12-31,2030-12-31', '2024 with 2.25 points: 11,000 − (11,335.20 − 6,534) = 6,198.80; total 1,305.20 + 6,198.80 = 7,504; deadlines 31.12.2027 and 31.12.2030');
check(y1(one(man, { y: 2024, income: 105000, tax: 11000, months: 7, pts: 5 })).points === 5 && y1(one(man, { y: 2024, income: 105000, tax: 11000, months: 7, pts: 5 })).pointsSource === 'manual', 'a manual number of points replaces the profile');
const ins = y1(one(man, { y: 2024, income: 105000, tax: 11000, months: 12, life: 1000, pen: 2000 }));
check(ins.insuranceUpTo === 950 && ins.refund === y1(one(man, { y: 2024, income: 105000, tax: 11000, months: 12 })).refund, 'life insurance 1,000 × 25% + own pension 2,000 × 35% = up to 950, shown apart and not added to the refund (s.45א ceilings)');

/* ---------- 6. Input errors ---------- */
const err = (row) => E.computeRefund(reg, Object.assign({}, E.PROFILE_DEFAULT, man, { rows: [row] }));
check(!err({ y: 2019, income: 1, tax: 1 }).ok && !err({ y: 2026, income: 1, tax: 1 }).ok && err({ y: 2026, income: 1, tax: 1 }).errors[0].field === 'y-0', 'years 2019 and 2026 are outside the six open years: an error on y-0');
check(!err({ y: 2024, income: -1, tax: 0 }).ok && !err({ y: 2024, income: 1000, tax: 0, months: 13 }).ok && !err({ y: 2024, income: 1000, tax: 0, months: 0 }).ok && !err({ y: 2024, income: 1000, tax: 0, emp: 50 }).ok && !err({ y: 2024, income: 1000, tax: 0, jobs: 0 }).ok, 'negative income, 13 months, income with 0 months, 50 points, 0 employers: errors');
check(!E.computeRefund(reg, Object.assign({}, man, { rows: [] })).ok && !E.computeRefund(reg, Object.assign({}, man, { rows: [{ y: 2024, income: 1, tax: 1 }, { y: 2024, income: 2, tax: 2 }] })).ok, 'no year at all, or the same year twice: errors');
check(err({ y: 2019, income: -5, tax: 'x', months: 14 }).errors.map((x) => x.field).join(',') === 'y-0,income-0,tax-0,months-0', 'every error at once, with its row field');

/* ---------- 7. The snapshot and the pictures ---------- */
const snap = H.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'hechzer-mas' && snap.registry_version === reg.registry_version && snap.total === 9102.8 && snap.sticky.includes('9,102.80') && snap.sentence === H.verdictSentence(reg, ex), 'snapshot: tool id, version, the refund 9,102.80 and the sentence');
check(snap.form.includes('value="2024" selected') && snap.form.includes('105,000') && snap.form.includes('11,000') && snap.form.includes('value="2.25"') && snap.form.includes('value="ba" checked'), 'the form is pre-filled with the example');
check(snap.result.includes('jt30-stairs') && snap.result.includes('role="img"') && snap.result.includes('jt30-f106') && snap.result.includes('158/172') && snap.result.includes('042') && snap.result.includes('9,102.80') && snap.result.includes('דוגמה מחושבת'), 'the result: the staircase (with an aria label), the Form 106 map with 158/172 and 042, the refund');
check(snap.details.includes('11,335.20') && snap.details.includes('1,897.20') && snap.details.includes('31.12.2030') && snap.details.includes('data-act="ics"') && snap.details.includes('data-act="copy-list"') && snap.details.includes(rt.refund.online_url) && snap.details.includes('/nekudot-zikui/'), 'the details: 11,335.20, 1,897.20, the deadline, .ics, the documents, the online filing and the link to the builder');
check(snap.method.includes('<ol>') && snap.method.includes('2,923.20') && snap.method.includes('9,438.00') && snap.method.includes('1,897.20') && snap.method.includes('9,102.80') && snap.method.includes('סעיף 160(א)'), 'the method: 2,923.20, 9,438.00, 1,897.20, 9,102.80 and s.160(א)');
check(snap.compare_table.includes('<caption>') && (snap.compare_table.match(/<tr>/g) || []).length === 8 && snap.compare_table.includes('228,000') && snap.compare_table.includes('651,600'), 'the page table: seven years of brackets with 228,000 (2026) and 651,600 (2020)');
const stairs = H.staircase(reg, top);
check(stairs.includes('jt30-st--surtax') && stairs.includes('+3%') && stairs.includes('800,000') && H.staircase(reg, zero).includes('<svg'), 'the staircase of 800,000 shows the surtax step and the marker; zero income still draws');
check(!/<h2[\s>]/.test(all) && !all.includes('undefined') && !all.includes('NaN') && !all.includes('null'), 'no <h2>, no undefined / NaN / null in the snapshot');
const others = [H.renderResult(reg, multi), H.renderDetails(reg, multi), H.renderResult(reg, E.computeRefund(reg, Object.assign({}, man, { rows: [{ y: 2025 }] }))), H.renderResult(reg, err({ y: 2019 })), H.renderDetails(reg, one(man, { y: 2023, income: 180000, tax: 15000, months: 12, life: 500 }))].join('');
check(!others.includes('undefined') && !others.includes('NaN') && others.includes('ממתין לטופס 106') && others.includes('צריך לתקן את הקלט') && others.includes('חוסר'), 'other states (several years, pending, error, short) render clean');

/* ---------- 8. The share state ---------- */
const full = Object.assign({}, E.PROFILE_DEFAULT, { gender: 'f', marital: 'single', kids: [[2014, 1]], sole: true, degree: 'ba', degreeYear: 2022, degreeLater: true, rows: [{ y: 2022, income: 150000, tax: 10216.2, months: 12, emp: 3.75, jobs: 2, coord: true, don: 300, life: 1000, pen: '', pts: '' }, { y: 2025, income: '', tax: '', months: '', emp: '', jobs: '', coord: false, don: '', life: '', pen: '', pts: 4 }] });
const st = H.stateOf(full);
const back = H.inputOf(decodeState(`#s=${st}`, H.KEYS));
check(JSON.stringify(E.computeRefund(reg, back)) === JSON.stringify(E.computeRefund(reg, full)) && back.rows.length === 2 && back.rows[0].coord === true && back.rows[0].income === 150000, 'stateOf -> decodeState -> inputOf: the same refund, rows and flags');
check(/^[0-9A-Za-z._~\/-]+$/.test(st) && !/[֐-׿]/.test(st) && H.inputOf({}) === null, 'the state holds only codes and numbers: no Hebrew, no names');
check(H.inputOf(decodeState('#s=y2026/Gf/K2019_1~2023_1/Tba/E2024/N3', H.KEYS)).rows.length === 0 && H.TOOL_ID === 'hechzer-mas', 'a state from the builder (profile only) has no rows: the page lists the open years for the Form 106 figures');

console.log(`hechzer-mas: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
