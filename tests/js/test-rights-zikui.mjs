/**
 * Golden tests for the credit-points builder (nekudot-zikui, the rights wave, 21.10.2026).
 * Run: node tests/js/test-rights-zikui.mjs
 *
 * Hand-computed from the Ordinance and the Tax Authority's own tables: the point is 219/218/223/235/242/242/242 a month in
 * 2020-2026 (s.33א; the January booklets); resident 2 + ¼ (ss.34, 36), woman ½ (s.36א); the children columns of each
 * period (s.66(ג)(4)-(5), s.40(ב)(1)-(1א); the notices of 18.5.2022, 3.1.2024 and 26.3.2024); the 2020 booklet's
 * chapter ז examples are asserted as published (2.25 ... 7.75).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/mas-engine.js';
import * as Z from '../../assets/js/tools/zikui-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const rt = reg.rights_tax;
const EX = Z.EXAMPLE;
const pts = (over) => E.computePoints(reg, Object.assign({}, E.PROFILE_DEFAULT, over));
const near = (a, b) => Math.abs(a - b) < 0.0001;
const line = (r, key) => (r.lines.find((l) => l.key === key) || { pts: 0 }).pts;

/* ---------- 1. The registry carries every figure the engine reads, each with a source ---------- */
check(['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((y) => rt.years[y].point_month).join(',') === '219,218,223,235,242,242,242', 'registry: the point a month 2020-2026: 219, 218, 223, 235, 242, 242, 242 (s.33א, the January booklets)');
check(Object.values(rt.years).every((y) => y.point_year === y.point_month * 12 && /^https:\/\/www\.gov\.il\/BlobFolder\//.test(y.url) && y.source_he && y.brackets.length === 6 && y.surtax.pct === 3 && y.donation.min > 0), 'registry: every year has its annual point, six brackets, the surtax, the donation minimum and a gov.il booklet url');
check(rt.points.resident.pts === 2 && rt.points.travel.pts === 0.25 && rt.points.woman.pts === 0.5 && rt.points.disabled_child.pts === 2 && rt.points.soldier.min_months_man === 23 && rt.points.soldier.min_months_woman === 22 && rt.points.reservist.max_pts === 4, 'registry: 2 + ¼, ½, 2 per disabled child, 23/22 months, reservists up to 4');
check(rt.points.kids.length === 3 && rt.points.kids.every((k) => /^https:\/\//.test(k.url) && k.source_he) && rt.law_url === 'https://www.nevo.co.il/law_html/law00/84255.htm', 'registry: three children periods with their notices; the Ordinance on Nevo');
check(rt.points.immigrant.reform_from === '2022-01-01' && rt.points.degree.rule_from === 2023 && rt.points.degree.temp.to === 2022 && /^https:\/\//.test(rt.points.immigrant.url) && /^https:\/\//.test(rt.points.reservist.url), 'registry: immigrants from 1.1.2022, degrees from 2023 and the 2014-2022 rule, sourced');

/* ---------- 2. The example: a married mother of two (2019, 2023), BA finished 2024, year 2026 ---------- */
const ex = E.computePoints(reg, EX);
check(ex.ok && ex.year === 2026 && near(ex.total, 9.25), 'example 2026: 2.25 + 0.5 + 2 (age 7, 6-17 from 2024) + 3.5 (age 3) + 1 (BA 2024: 2025-2027) = 9.25');
check(line(ex, 'kid0') === 2 && line(ex, 'kid1') === 3.5 && line(ex, 'degree') === 1 && line(ex, 'woman') === 0.5 && line(ex, 'resident') === 2.25, 'example: each line as computed: 2.25, 0.5, 2, 3.5, 1');
check(ex.monthly === 2238.5 && ex.value === 26862, 'example: 9.25 × 242 = 2,238.50 a month; 9.25 × 2,904 = 26,862 a year');
check(ex.years.map((y) => `${y.year}:${y.total}:${y.value}`).join('|') === '2020:5.25:13797|2021:5.25:13734|2022:5.25:14049|2023:6.75:19035|2024:9.75:28314|2025:10.25:29766|2026:9.25:26862',
	'the years: 2020-2022 5.25 (2.75 + 2.5 for 1-5) × 2,628/2,616/2,676; 2023 6.75 (+1.5 born) × 2,820; 2024 9.75 (2.5 + 4.5) × 2,904; 2025 10.25 (2 + 4.5 + 1); 2026 9.25');
check(ex.missed.map((m) => m.year).join(',') === '2020,2021,2022,2023,2024,2025' && ex.years[0].deadline === '2026-12-31' && ex.years[5].deadline === '2031-12-31' && !ex.years[6].refundable, 'missed years 2020-2025, deadlines 31.12.2026 to 31.12.2031 (s.160); 2026 not a refund year');
check(ex.f101.includes('חלק ח, סעיף 1') && ex.f101.includes('חלק ח, סעיף 7') && ex.f101.includes('חלק ח, סעיף 15 (וטופס 119)') && ex.f101.includes('חלק ב: מין'), 'Form 101: resident (1), children in custody (7), degree (15 with Form 119), the gender in part ב');

/* ---------- 3. The 2020 booklet's own examples (chapter ז), as published ---------- */
const y20 = (over) => pts(Object.assign({ year: 2020 }, over)).total;
check(y20({ gender: 'm', marital: 'single' }) === 2.25 && y20({ gender: 'f', marital: 'single' }) === 2.75, '2020 table: single man 2.25; single woman 2.75');
check(y20({ gender: 'm', marital: 'married', spouse: true }) === 3.25, '2020 table: married man, wife without income, one of them retirement age or disabled (s.37): 3.25');
check(y20({ gender: 'm', marital: 'single', kids: [[2012, 0]], pays: true }) === 3.25, '2020 table: separated man paying for a child over 5 who lives elsewhere: 2.25 + 1 (s.40(ב)(2)) = 3.25');
check(y20({ gender: 'f', kids: [[2002, 1]] }) === 3.25 && y20({ gender: 'm', kids: [[2020, 1]] }) === 3.75 && y20({ gender: 'f', kids: [[2020, 1]] }) === 4.25, '2020 table: married woman, child of 18: 3.25; father in the birth year: 3.75; mother in the birth year: 4.25');
check(y20({ gender: 'm', kids: [[2018, 1]] }) === 4.75 && y20({ gender: 'm', marital: 'single', kids: [[2020, 0]], pays: true }) === 4.75, '2020 table: father of a child aged 1-5: 4.75; separated father, baby with the mother, paying: 2.25 + 1.5 + 1 = 4.75');
check(y20({ gender: 'm', marital: 'single', kids: [[2010, 1], [2012, 1]] }) === 5.25 && y20({ gender: 'm', marital: 'single', kids: [[2018, 1]] }) === 5.75 && y20({ gender: 'f', marital: 'single', kids: [[2017, 1]] }) === 6.25, '2020 table: separated father of two aged 6-17: 5.25; of one aged 1-5: 5.75; separated mother of one aged 1-5: 6.25');
check(y20({ gender: 'f', marital: 'single', sole: true, kids: [[2020, 1]] }) === 6.75 && y20({ gender: 'm', marital: 'single', kids: [[2020, 1], [2018, 1]] }) === 7.25 && y20({ gender: 'f', marital: 'single', sole: true, kids: [[2020, 1], [2010, 1]] }) === 7.75, '2020 table: sole mother, baby: 2.75 + 1.5 + 1.5 + 1 = 6.75; separated father, baby and toddler: 7.25; sole mother, baby and a child of 10: 7.75');

/* ---------- 4. The years where the rules changed ---------- */
const kid = (y, by, g = 'f', over = {}) => line(pts(Object.assign({ year: y, gender: g, kids: [[by, 1]] }, over)), 'kid0');
check(kid(2021, 2013) === 1 && kid(2022, 2014) === 2 && kid(2023, 2015) === 2 && kid(2024, 2016) === 2, 'mother, a child of 8: 2021 1; 2022 and 2023 2 (the temporary 6-12 point); 2024 2 (6-17)');
check(kid(2021, 2013, 'm') === 0 && kid(2022, 2014, 'm') === 1 && kid(2024, 2016, 'm') === 1 && kid(2023, 2008, 'm') === 0 && kid(2024, 2009, 'm') === 1, 'father: age 8: 0 in 2021, 1 in 2022 and 2024; age 15: 0 in 2023, 1 in 2024 (the 2023 law)');
check(kid(2023, 2023) === 1.5 && kid(2024, 2024) === 2.5 && kid(2023, 2022) === 2.5 && kid(2024, 2023) === 4.5 && kid(2024, 2021) === 3.5 && kid(2024, 2019) === 2.5, 'toddlers (amendment 271, 2024): birth 1.5 -> 2.5; age 1 2.5 -> 4.5; age 3 3.5; age 5 2.5');
check(kid(2026, 2008) === 0.5 && kid(2026, 2008, 'm') === 0 && kid(2026, 2007) === 0, 'the year of 18: mother 0.5, father 0; 19: nothing');

/* ---------- 5. Discharged soldiers, immigrants, degrees, reservists ---------- */
const sol = (y, over) => line(pts(Object.assign({ year: y, gender: 'f', discharge: '31.8.2022', served: 24 }, over)), 'soldier');
check(near(sol(2022), 4 / 6) && sol(2023) === 2 && sol(2024) === 2 && near(sol(2025), 8 / 6) && sol(2026) === 0, 'soldier, discharged 31.8.2022 after 24 months (woman, ≥22): 4/6 in 2022, 2, 2, 8/6 in 2025 (the guide\'s 8 months), 0 after');
check(near(sol(2023, { gender: 'm', served: 22 }), 1) && near(sol(2023, { gender: 'm', served: 23 }), 2) && near(sol(2023, { gender: 'f', served: 21 }), 1), 'soldier thresholds: a man with 22 months 1/12 (1 a year), 23 months 1/6 (2); a woman with 21 months 1/12');
const oleh = (y, date) => line(pts({ year: y, gender: 'm', aliyah: date }), 'immigrant');
check(near(oleh(2023, '15.3.2023'), 10 / 12) && near(oleh(2024, '15.3.2023'), 2 / 12 + 10 / 4) && near(oleh(2025, '15.3.2023'), 8 / 4 + 4 / 6) && near(oleh(2026, '15.3.2023'), 8 / 6 + 4 / 12), 'immigrant from March 2023 (after amendment 262): 10/12; 2/12 + 10/4; 8/4 + 4/6; 8/6 + 4/12');
check(near(oleh(2021, '1.7.2021'), 1.5) && near(oleh(2022, '1.7.2021'), 3) && near(oleh(2023, '1.7.2021'), 2) && near(oleh(2024, '1.7.2021'), 1) && oleh(2025, '1.7.2021') === 0, 'immigrant from July 2021 (before the reform): 6/4, 12/4, 12/6, 12/12, then nothing');
const ret = pts({ year: 2024, gender: 'm', aliyah: '1.1.2024', returning: true });
check(line(ret, 'immigrant') === 0 && ret.notes.some((n) => n.code === 'returning'), 'a returning resident: no s.35 points, and the note says why');
const dg = (y, over) => line(pts(Object.assign({ year: y, gender: 'm' }, over)), over.ma ? 'ma' : 'degree');
check(dg(2022, { degree: 'ba', degreeYear: 2021 }) === 1 && dg(2023, { degree: 'ba', degreeYear: 2021 }) === 0 && dg(2023, { degree: 'ba', degreeYear: 2021, degreeLater: true }) === 1 && dg(2022, { degree: 'ba', degreeYear: 2021, degreeLater: true }) === 0, 'BA finished 2021 (the 2014-2022 rule): one point in 2022, or in 2023 by choice, never both');
check(dg(2024, { degree: 'ba', degreeYear: 2023 }) === 1 && dg(2026, { degree: 'ba', degreeYear: 2023 }) === 1 && dg(2026, { degree: 'ba', degreeYear: 2023, degreeYears: 2 }) === 0 && dg(2025, { degree: 'cert', degreeYear: 2024, degreeYears: 1 }) === 1 && dg(2026, { degree: 'cert', degreeYear: 2024, degreeYears: 1 }) === 0, 'from 2023: BA 2023 -> 2024-2026; with 2 study years only 2024-2025; a one-year certificate 2024 -> 2025 only');
check(dg(2025, { ma: true, maYear: 2024 }) === 0.5 && dg(2026, { ma: true, maYear: 2024 }) === 0.5 && dg(2023, { ma: true, maYear: 2022 }) === 0.5 && dg(2024, { ma: true, maYear: 2022 }) === 0, 'MA: finished 2024 -> 0.5 in 2025 and 2026; finished 2022 -> 0.5 in 2023 only');
check(dg(2022, { degree: 'med', degreeYear: 2021 }) === 1 && dg(2023, { degree: 'med', degreeYear: 2021 }) === 0.5 && dg(2026, { degree: 'med', degreeYear: 2023 }) === 1, 'medicine: finished 2021 -> 1 then 0.5 (temporary rule); finished 2023 -> 1 a year in 2024-2026');
check([29, 30, 39, 40, 49, 50, 54, 55, 110, 200].map((d) => E.reservistPts(rt, 2026, d)).join(',') === '0,0.5,0.5,0.75,0.75,1,1,1.25,4,4' && E.reservistPts(rt, 2025, 60) === 0, 'reservists (s.39ב, 2026 for 2025 days): 29 -> 0, 30 and 39 -> 0.5, 40 and 49 -> 0.75, 50 and 54 -> 1, 55 -> 1.25, 110 and above -> 4; nothing before 2026');
const res25 = pts({ year: 2025, gender: 'm', reserve: 60 });
check(line(res25, 'reservist') === 0 && res25.notes.some((n) => n.code === 'reservist_year'), 'reserve days entered for 2025: no points, and a note that the law starts in 2026');

/* ---------- 6. Family points ---------- */
const fam = pts({ year: 2026, gender: 'm', marital: 'married', alimony: true, disabled: 2 });
check(near(fam.total, 2.25 + 1 + 4) && line(fam, 'alimony') === 1 && line(fam, 'disabled') === 4, 'remarried and paying alimony (s.40א) + 1; two disabled children (s.45) 2 × 2 = 4: total 7.25');
const shared = pts({ year: 2026, gender: 'f', marital: 'single', kids: [[2016, 1]], shared: true });
check(near(shared.total, 4.75) && shared.notes.some((n) => n.code === 'shared') && near(pts({ year: 2026, gender: 'f', marital: 'single', kids: [[2016, 1]] }).total, 5.75), 'a single mother of a 10-year-old: 2.75 + 2 + 1 = 5.75; sharing a household: no single-parent point, 4.75, with a note');
check(near(pts({ year: 2026, gender: 'f', marital: 'married', kids: [[2026, 0]] }).total, 2.75 + 2.5) && line(pts({ year: 2026, gender: 'f', marital: 'married', kids: [[2026, 0]] }), 'kid0') === 2.5, 'a married woman whose child lives with the other parent: column 2 (2.5 in the birth year from 2024)');

/* ---------- 7. Input errors ---------- */
const bad = (over) => pts(over);
check(!bad({ gender: '' }).ok && bad({ gender: '' }).errors[0].field === 'gender', 'no gender: an error on the gender field');
check(!bad({ kids: [[1980, 1]] }).ok && !bad({ kids: [[2027, 1]] }).ok && bad({ kids: [['', 1]] }).ok && bad({ kids: [[2027, 1]] }).errors[0].field === 'kid-0', 'a child born 1980 or 2027: an error on that child; a row not filled yet is ignored');
check(!bad({ degree: 'ba', degreeYear: '' }).ok && !bad({ degree: 'ba', degreeYear: 2024, degreeYears: 0 }).ok && !bad({ ma: true, maYear: 1985 }).ok, 'a degree without its year, zero study years, an MA in 1985: errors');
check(!bad({ discharge: '31.2.2022', served: 24 }).ok && !bad({ discharge: '31.8.2022', served: '' }).ok && !bad({ aliyah: 'אתמול' }).ok, 'an impossible discharge date, a discharge without months, an aliyah that is not a date: errors');
check(!bad({ disabled: 13 }).ok && !bad({ disabled: 1.5 }).ok && !bad({ reserve: 400 }).ok && !bad({ year: 2019 }).ok && !bad({ year: 2027 }).ok, 'disabled 13 or 1.5, reserve 400 days, year 2019 or 2027: errors');
check(bad({ gender: '', year: 2019, disabled: 99 }).errors.map((e) => e.field).join(',') === 'gender,disabled,year', 'every error at once, with its field');

/* ---------- 8. The snapshot ---------- */
const snap = Z.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'nekudot-zikui' && snap.registry_version === reg.registry_version && snap.total === 9.25 && snap.sticky === '<bdi>9.25</bdi>' && snap.sentence === Z.verdictSentence(reg, ex), 'snapshot: tool id, registry version, 9.25 points, the sticky, the sentence');
check(snap.form.includes('value="2026" checked') && snap.form.includes('value="2019"') && snap.form.includes('value="2023"') && snap.form.includes('value="ba" checked') && snap.form.includes('value="2024"'), 'the form is pre-filled with the example');
check(snap.result.includes('jt29-ledger') && snap.result.includes('jt29-years') && snap.result.includes('2,238.50') && snap.result.includes('26,862.00') && snap.result.includes('דוגמה מחושבת') && snap.result.includes('role="img"'), 'the result: the ledger and the year strip (with aria labels), 2,238.50 and 26,862.00, the example label');
check(snap.details.includes('data-act="copy-list"') && snap.details.includes('data-act="ics"') && snap.details.includes('חלק ח, סעיף 7') && snap.details.includes('טופס 116') && snap.details.includes('31.12.2026') && snap.details.includes('/guide-tax-calculator-updated-2025/'), 'the details: the Form 101 list, the .ics, Form 116, the 2020 deadline and the link to the refund calculator');
check(snap.method.includes('<ol>') && snap.method.includes('2,238.50') && snap.method.includes('26,862.00') && snap.method.includes('סעיף 66(ג)(4)') && snap.method.includes('סעיף 40ג(א)') && snap.method.includes(rt.points.kids[2].url), 'the method: the path with 2,238.50 and 26,862.00, s.66(ג)(4), s.40ג(א) and the 2024 notice');
check(snap.compare_table.includes('<caption>') && (snap.compare_table.match(/<tr>/g) || []).length === 8 && snap.compare_table.includes('2,628') && snap.compare_table.includes('2,904'), 'the page table: a caption, a header and seven years, 2,628 and 2,904 a year');
check(all.split('jtool-cite').length > 10 && all.includes(rt.law_url), 'cites throughout, to the Ordinance');
check(!/<h2[\s>]/.test(all) && !all.includes('undefined') && !all.includes('NaN') && !all.includes('null'), 'no <h2>, no undefined / NaN / null in the snapshot');
const other = [Z.renderResult(reg, pts({ year: 2020, gender: 'm', marital: 'single', sole: true, kids: [[2020, 1], [2005, 0]], pays: true, discharge: '31.12.2019', served: 30, aliyah: '1.6.2019' })), Z.renderDetails(reg, pts({ year: 2023, gender: 'f', reserve: 40, returning: true, aliyah: '1.1.2020' })), Z.renderResult(reg, pts({ gender: '' }))].join('');
check(!other.includes('undefined') && !other.includes('NaN') && !/<h2[\s>]/.test(other) && other.includes('צריך לתקן את הקלט'), 'other states (sole parent, soldier from December, an old immigrant, a past year with a note, an error) render clean');

/* ---------- 9. The share state ---------- */
const full = Object.assign({}, E.PROFILE_DEFAULT, { gender: 'm', marital: 'single', kids: [[2016, 1], [2010, 0]], sole: true, shared: false, pays: true, disabled: 1, degree: 'cert', degreeYear: 2023, degreeYears: 2, degreeLater: true, ma: true, maYear: 2025, maYears: 1, discharge: '2022-08-31', served: 30, aliyah: '2021-07-01', returning: false, reserve: 55, year: 2025 });
const st = Z.stateOf(full);
const back = Z.inputOf(decodeState(`#s=${st}`, Z.KEYS));
check(JSON.stringify(E.computePoints(reg, back)) === JSON.stringify(E.computePoints(reg, full)) && back.year === 2025 && back.kids.length === 2 && back.discharge === '2022-08-31', 'stateOf -> decodeState -> inputOf gives the same points, year and dates');
check(/^[0-9A-Za-z._~\/-]+$/.test(st) && Z.inputOf({}) === null && Z.TOOL_ID === 'nekudot-zikui', 'the state is plain codes; an empty hash gives no input');
check(Z.stateOf(EX) === 'y2026/Gf/K2019_1~2023_1/Tba/E2024/N3', 'the example state is short and readable');

console.log(`nekudot-zikui: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
