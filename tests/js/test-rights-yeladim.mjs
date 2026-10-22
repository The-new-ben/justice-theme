/**
 * Golden tests for the child allowance instrument (kitzbat-yeladim, rights wave 2B, 21.10.2026).
 * Run: node tests/js/test-rights-yeladim.mjs
 *
 * By hand, from chapter 4 of the National Insurance Law, section 1 (the basic amount) and the Institute's children pages
 * (rights_btl, rights_yeladim): the first and the fifth and later child in the count 173, the second to the fourth 219
 * (s.68(א); s.1, para. (2)); only children under 18 count (s.65); born by the 15th, from that month, from the 16th, from the
 * next; the last month is the month of the 18th birthday (s.72(א)); the supplement 113 = 70% x 162 for the third and the
 * fourth child of a parent with income support, alimony or the income supplement (s.68(ג)); the study grant 1,204 =
 * 11.6% x 10,382 (s.74(ב)(2)); the savings 58 a month, the parents' 58, the grants 291 / 291 / 582 / 582 (s.74ב-74ג).
 * The example, on 21.10.2026: children born 22.1.2015, 4.6.2020 and 10.3.2024: 173 + 219 + 219 = 611 a month; 611 x 12 =
 * 7,332 in the next 12 months; 611 x 76 (to January 2033) + 392 x 65 (to June 2038) + 173 x 45 (to March 2042) = 79,701.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as YE from '../../assets/js/tools/yeladim-engine.js';
import * as YU from '../../assets/js/tools/yeladim-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const yl = reg.rights_yeladim;
const btl = reg.rights_btl;
const DAY = '2026-10-21';
const fam = (births, over = {}) => YE.compute(reg, Object.assign({ kids: births.map((b) => (typeof b === 'string' ? { birth: b } : b)), benefit: 'none', asOf: DAY }, over));
const codes = (r) => r.flags.map((f) => f.code);
const errs = (r) => (r.ok ? '' : r.errors.map((e) => e.field).join(','));
// The unofficial portal's name, built from char codes so the name itself is never written in the repo (contract rule).
const PORTAL_HE = String.fromCharCode(0x05db, 0x05dc, 0x20, 0x05d6, 0x05db, 0x05d5, 0x05ea);
const PORTAL_EN = String.fromCharCode(0x6b, 0x6f, 0x6c, 0x7a, 0x63, 0x68, 0x75, 0x74);
const noPortal = (s) => !s.toLowerCase().includes(PORTAL_EN) && !s.includes(PORTAL_HE);

/* ---------- 1. The registry: every figure the engine reads exists, with an official source ---------- */
const paths = [
	'allowance.high_from', 'allowance.high_to', 'allowance.end_age', 'allowance.start_cutoff_day', 'allowance.pay_day', 'allowance.abroad_months', 'allowance.section',
	'allowance.start_section', 'allowance.child_section', 'supplement.amount', 'supplement.pct_of_income_support', 'supplement.positions', 'supplement.benefits',
	'study.amount', 'study.pct_of_basic', 'study.born_from', 'study.born_to', 'study.pay_date', 'study.check_months', 'study.min_children', 'study.benefits4', 'study.prev.amount',
	'savings.monthly', 'savings.parent_add', 'savings.grant_18', 'savings.grant_21', 'savings.grant_3', 'savings.grant_mitzvah', 'savings.mitzvah_boy', 'savings.mitzvah_girl',
	'savings.new_from', 'savings.deposits_from', 'savings.choose_months', 'savings.free_age', 'history.rows', 'claim.deadline_months', 'legacy.born_before',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(yl, p) !== undefined && get(yl, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(yl, p) === undefined).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(yl, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(yl.law_url.startsWith('https://www.btl.gov.il/Laws1/') && urls.length >= 30 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|b2b\.btl\.gov\.il|govforms\.gov\.il)\//.test(u)), `registry: every url is an official https source (${urls.length} urls)`);
check(['allowance', 'history', 'supplement', 'study', 'savings', 'payee', 'claim', 'legacy'].every((k) => Object.values(yl[k]).some((v) => typeof v === 'string' && v.startsWith('https://'))), 'registry: every rule block carries its own source url');
check(noPortal(JSON.stringify(yl)), 'registry: no unofficial portal anywhere');
check(yl.checked_on === '2026-10-21' && yl.from === '2026-01-01' && yl.next_update === '2027-01-01' && yl.refresh_every_days === 365, 'registry: checked 21.10.2026, figures from 1.1.2026, next update 1.1.2027');
check(btl.basic_amount.b2_child_first_fifth === 173 && btl.basic_amount.b2_child_second_to_fourth === 219 && !('first' in yl.allowance) && !JSON.stringify(yl.allowance).includes('173'), 'the 2026 per-child amounts are read from rights_btl (173 / 219), not repeated in rights_yeladim');
check(Math.round(btl.basic_amount.b2_income_support * yl.supplement.pct_of_income_support / 100) === yl.supplement.amount, 'the supplement: 70% x 162 = 113.4 -> 113 (s.68(ג); the rates page publishes 113)');
check(Math.round(btl.basic_amount.b3 * yl.study.pct_of_basic / 100) === yl.study.amount && Math.round(yl.study.prev.b3 * yl.study.pct_of_basic / 100) === yl.study.prev.amount, 'the study grant: 11.6% x 10,382 = 1,204.3 -> 1,204; 2025: 11.6% x 10,139 = 1,176.1 -> 1,176 (s.74(ב)(2)), the Institute\'s figures');
check(yl.history.rows[0].from === '2025-01-01' && yl.history.rows[0].first_fifth === 169 && yl.history.rows[0].second_to_fourth === 214 && yl.history.rows[1].first_fifth === 169 && yl.history.rows[1].second_to_fourth === 214, 'history: 2025 = 2024 = 169 / 214, the 1.1.2025 freeze (s.1, the update para. (3))');
check(YE.birthdayAt(yl.legacy.born_before, 18) < '2021-06-02' && YE.endMonthOf(yl, '2003-05-31') === '2021-05', 's.68(ב) (born before 1.6.2003): every such child left the count by May 2021');

/* ---------- 2. The example ---------- */
const EX = YU.EXAMPLE;
const ex = YE.compute(reg, EX);
check(ex.ok && ex.asOf === '2026-10-21' && ex.M0 === '2026-10' && ex.n === 3, 'example: computed on the registry check day (21.10.2026), 3 children in the count');
check(ex.now.list.map((x) => `${x.i}:${x.pos}:${x.amount}`).join(' ') === '0:1:173 1:2:219 2:3:219' && ex.monthly === 611, 'example: 22.1.2015 first (173), 4.6.2020 second (219), 10.3.2024 third (219): 611 a month (s.68(א))');
check(ex.next12 === 7332 && ex.now.savings === 174 && ex.now.parentAdd === 0 && ex.toBank === 611, 'example: 611 x 12 = 7,332 in the next 12 months; 58 x 3 = 174 to the savings, beside the allowance');
check(ex.periods.map((p) => `${p.from}..${p.to}:${p.months}x${p.total}`).join(' ') === '2026-10..2033-01:76x611 2033-02..2038-06:65x392 2038-07..2042-03:45x173' && ex.remaining === 79701, 'example timeline: 611 x 76 + 392 x 65 + 173 x 45 = 46,436 + 25,480 + 7,785 = 79,701');
check(ex.periods[1].left.join() === '0' && ex.periods[1].list.map((x) => `${x.i}:${x.pos}:${x.amount}`).join(' ') === '1:1:173 2:2:219', 'February 2033: the eldest left (18 in January 2033), the second becomes first (219 -> 173), the third second (219)');
const k0 = ex.kids[0];
check(k0.start === '2015-02' && k0.end === '2033-01' && k0.endDay === '2033-01-31' && k0.monthsPast === 137 && k0.monthsAhead === 76 && k0.depositsAhead === 4408 && k0.toEighteen === 4990, 'child 1, born 22.1.2015 (after the 15th): from February 2015 to 31.1.2033; deposits since May 2015: 137 months; 76 x 58 = 4,408 + the 18 grant 582 = 4,990');
check(k0.grants.map((g) => `${g.kind}:${g.date}:${g.amount}`).join(' ') === 'g18:2033-01-22:582 g21:2036-01-22:582', 'child 1, born before 2017: 582 at 18 (22.1.2033), 582 at 21 if not withdrawn (22.1.2036)');
const k2 = ex.kids[2];
check(k2.start === '2024-03' && k2.monthsPast === 31 && k2.monthsAhead === 186 && k2.depositsAhead === 10788 && k2.toEighteen === 11370 && k2.grants.map((g) => g.kind).join() === 'g3,mitzvah,g21', 'child 3, born 10.3.2024: 186 x 58 = 10,788 + 291 at 3 + 291 at the mitzvah = 11,370; 582 at 21');
check(ex.kids[1].toEighteen === 8469 && ex.kids[1].grants[0].kind === 'mitzvah' && ex.kids[1].grants[0].date === '2032-06-04', 'child 2, born 4.6.2020: 141 x 58 = 8,178 + 291 = 8,469; the age-3 grant is past; the mitzvah at 12 (girl) on 4.6.2032');
check(ex.compare.prev === 597 && ex.compare.cur === 611, 'what changed: the same children at the 2025 amounts 169 + 214 + 214 = 597; 2026: 611');
check(!ex.suppOn && ex.now.supplement === 0 && !ex.study.on && ex.study.nJA === 3 && ex.flags.length === 0, 'example: no supplement, no study grant (3 children, no listed benefit), no flags');
check(ex.deadlines.map((d) => `${d.key}:${d.date}${d.ics ? '' : '-'}`).join(' ') === 'g3:2027-03-10 mitzvah:2032-06-04- end18:2033-01-31 g21:2036-01-22 mitzvah:2036-03-10- end18:2038-06-30 g21:2041-06-04 end18:2042-03-31 g21:2045-03-10', 'example dates: the grants, the end of each allowance (the last day of the month of 18) and 21; the mitzvah without the child\'s sex stays out of the .ics');

/* ---------- 3. The hard cases ---------- */
const one = fam(['2025-10-21']);
check(one.monthly === 173 && one.next12 === 2076 && one.now.savings === 58 && one.kids[0].monthsAhead === 205, 'one child born 21.10.2025: 173; 173 x 12 = 2,076; 58 to the savings; October 2026 to October 2043 = 205 deposits');
const four = fam(['2012-01-05', '2014-04-05', '2017-06-05', '2020-09-05']);
check(four.monthly === 830 && four.now.list.map((x) => x.amount).join('+') === '173+219+219+219', 'four children: 173 + 219 + 219 + 219 = 830 (the second to the fourth, 219)');
const six = fam(['2010-01-05', '2011-01-05', '2013-01-05', '2015-01-05', '2018-01-05', '2021-01-05']);
check(six.monthly === 1176 && six.now.list.map((x) => x.amount).join('+') === '173+219+219+219+173+173', 'six children: 173 + 219 x 3 + 173 x 2 = 1,176 (the fifth and later, 173)');
const shift = fam(['2008-11-05', '2012-05-14', '2017-07-30']);
check(shift.monthly === 611 && shift.periods[0].to === '2026-11' && shift.periods[1].from === '2026-12' && shift.periods[1].total === 392 && shift.next12 === 5142, 'the eldest turns 18 on 5.11.2026: 611 in October and November, 392 from December (173 + 219); 611 x 2 + 392 x 10 = 5,142');
check(shift.change && shift.change.from === '2026-12' && codes(shift).includes('shift') && shift.flags.find((f) => f.code === 'shift').level === 'warn', 'the shift within 12 months is flagged: 611 -> 392 on 1.12.2026');
check(fam(['2008-10-21', '2012-05-14']).now.n === 2 && fam(['2008-09-30', '2012-05-14']).now.n === 1 && fam(['2008-09-30', '2012-05-14']).kids[0].status === 'ended', 'the month of the 18th birthday is still paid (born 21.10.2008: counted in October 2026); the month after is not (born 30.9.2008)');
const twins = fam(['2019-04-02', '2023-09-09', '2023-09-09']);
check(twins.monthly === 611 && twins.now.list.map((x) => `${x.i}:${x.pos}`).join(' ') === '0:1 1:2 2:3' && codes(twins).includes('twins') && twins.now.savings === 174, 'twins: each a child in the count (second and third, 219 each): 173 + 219 + 219 = 611; 58 each to the savings');
const last = fam(['2026-08-31']);
const mid = fam(['2026-08-15']);
const mid16 = fam(['2026-08-16']);
check(last.kids[0].start === '2026-09' && last.kids[0].end === '2044-08' && last.kids[0].monthsPast + last.kids[0].monthsAhead === 216 && mid.kids[0].start === '2026-08' && mid.kids[0].monthsPast + mid.kids[0].monthsAhead === 217 && mid16.kids[0].start === '2026-09', 'born on the last day of a month (31.8.2026): from September 2026 to August 2044 = 216 months; born 15.8: from August = 217; born 16.8: from September (s.72(א))');
check(last.kids[0].mustChoose && last.kids[0].chooseBy === '2027-02-28' && last.deadlines.some((d) => d.key === 'choose' && d.date === '2027-02-28'), 'the savings choice within 6 months of 31.8.2026: by 28.2.2027 (s.74ב(ד)(1א))');
const supp4 = fam(['2012-01-05', '2014-04-05', '2017-06-05', '2020-09-05'], { benefit: 'hb' });
check(supp4.monthly === 1056 && supp4.now.supplement === 226 && supp4.now.list.map((x) => x.supp).join() === '0,0,113,113' && supp4.study.on && supp4.study.total === 4816, 'four children and income support: 830 + 113 + 113 = 1,056 (s.68(ג)); all four born 2009-2020: the study grant 4 x 1,204 = 4,816 (s.74(ב2))');
check(fam(['2015-01-05', '2018-01-05', '2021-01-05'], { benefit: 'mz' }).monthly === 724 && fam(['2015-01-05', '2018-01-05'], { benefit: 'hb' }).monthly === 392 && codes(fam(['2015-01-05', '2018-01-05'], { benefit: 'hb' })).includes('supp_short'), 'three children and alimony: 611 + 113 = 724; two children and income support: 392, no supplement (only the third and the fourth)');
check(fam(['2015-01-05', '2018-01-05', '2021-01-05'], { benefit: 'old' }).now.supplement === 0 && fam(['2015-01-05', '2018-01-05', '2021-01-05'], { benefit: 'hh' }).now.supplement === 113 && fam(['2015-01-05', '2018-01-05', '2021-01-05'], { benefit: 'nc' }).now.supplement === 0, 'the supplement only with the income supplement: old age without it 0, with it 113; general disability 0');
const supp6 = fam(['2010-01-05', '2011-01-05', '2013-01-05', '2015-01-05', '2018-01-05', '2021-01-05'], { benefit: 'hb' });
check(supp6.monthly === 1402, 'six children and income support: 1,176 + 113 x 2 = 1,402 (only the third and the fourth)');

/* ---------- 4. The study grant and the savings ---------- */
const single = fam(['2016-02-05', '2022-02-05'], { single: true });
check(single.study.on && single.study.via === 'single' && single.study.kids.length === 1 && single.study.total === 1204 && single.study.past, 'a single parent: the child born 5.2.2016 is in 1.1.2009-31.12.2020: 1,204, paid on 11.8.2026 (already paid on 21.10.2026); the 2022 child is not');
check(fam(['2010-01-05', '2012-01-05', '2014-01-05', '2016-01-05'], { benefit: 'nc' }).study.total === 4816 && !fam(['2010-01-05', '2012-01-05', '2014-01-05'], { benefit: 'nc' }).study.on, 'general disability: 4 children -> 4 x 1,204 = 4,816; 3 children -> none (s.74(ב2))');
const add = fam(['2020-06-04'], { addSave: true });
check(add.now.parentAdd === 58 && add.toBank === 115 && add.kids[0].parentAhead === add.kids[0].depositsAhead && add.kids[0].toEighteen === 2 * 141 * 58 + 291, 'the parents add 58: 173 - 58 = 115 to the bank; 141 months x 116 + the mitzvah grant 291 = 16,647');
check(fam([{ birth: '2018-05-05', sex: 'b' }]).kids[0].grants.find((g) => g.kind === 'mitzvah').date === '2031-05-05' && fam([{ birth: '2018-05-05', sex: 'g' }]).kids[0].grants.find((g) => g.kind === 'mitzvah').date === '2030-05-05' && fam([{ birth: '2018-05-05', sex: 'g' }]).deadlines.find((d) => d.key === 'mitzvah').ics, 'the mitzvah grant: a boy at 13 (5.5.2031), a girl at 12 (5.5.2030), and then it goes to the .ics');
const old = fam(['2007-03-05', '2015-03-05']);
check(old.kids[0].status === 'ended' && old.now.n === 1 && old.monthly === 173 && codes(old).includes('ended') && old.kids[0].grants.map((g) => g.kind).join() === 'g21' && old.kids[0].monthsAhead === 0, 'a child of 19: out of the count (the other is first: 173), the savings open, the 21 grant on 5.3.2028 still ahead');
const exp = fam(['2026-12-20', '2020-01-05']);
check(exp.ok && exp.kids[0].status === 'expected' && exp.kids[0].start === '2027-01' && exp.monthly === 173 && exp.periods[1].from === '2027-01' && exp.periods[1].total === 392 && codes(exp).includes('expected'), 'an expected baby (20.12.2026, after the 15th): from January 2027, then 173 + 219 = 392');
const adopt = fam([{ birth: '2020-01-05', arrive: '2026-11-20' }]);
check(adopt.kids[0].start === '2026-12' && adopt.kids[0].status === 'expected' && adopt.monthly === 0 && YU.verdictSentence(reg, adopt).startsWith('הקצבה תתחיל ב-1.12.2026'), 'adoption on 20.11.2026: the allowance from December 2026 (the day the child came, after the 15th)');
check(fam(['2008-02-29']).kids[0].at18 === '2026-02-28' && fam(['2008-02-29']).kids[0].end === '2026-02', 'born 29.2.2008: 18 in February 2026, out of the count');

/* ---------- 5. Input errors ---------- */
check(errs(fam([])) === 'kids' && errs(fam([''])) === 'kids' && errs(fam(['31.2.2020'])) === 'k0' && errs(fam(['2020-01-01', 'x'])) === 'k1', 'no children, an empty row only, an impossible date, a bad second row: each to its field');
check(errs(fam(['2027-09-01'])) === 'k0' && errs(fam(['1990-01-01'])) === 'k0' && errs(fam(['2027-07-21'])) === '', 'a birth more than 9 months ahead, or more than 30 years ago, is an error; 9 months ahead is allowed');
check(errs(fam([{ birth: '2020-01-01', arrive: '2019-01-01' }])) === 'a0' && errs(fam(['2020-01-01'], { benefit: 'x' })) === 'benefit' && errs(fam(Array(13).fill('2020-01-01'))) === 'kids', 'an arrival before the birth, an unknown benefit, more than 12 children');
check(fam(['2020-01-01', '', '2022-01-01']).ok && fam(['2020-01-01', '', 'x']).errors[0].field === 'k2', 'an empty row in the middle is skipped and keeps the numbering of the rows after it');
check(YU.renderResult(reg, fam(['x'])).includes('צריך לתקן את הקלט') && YU.renderDetails(reg, fam(['x'])) === '', 'the error state renders, details stay empty');

/* ---------- 6. The snapshot ---------- */
const snap = YU.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'kitzbat-yeladim' && snap.registry_version === reg.registry_version && snap.total === 611 && snap.sticky.includes('611') && snap.sentence === YU.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 611, the sticky, the sentence, the input');
check(snap.form.includes('value="22.1.2015"') && snap.form.includes('value="4.6.2020"') && snap.form.includes('value="10.3.2024"') && snap.form.includes('name="jt52-ben" value="none" checked') && (snap.form.match(/data-act="profile"/g) || []).length === 5 && snap.form.includes('data-act="add-kid"'), 'the form: the example children, the benefit, 5 one-click families, the + child chip');
check(snap.result.includes('דוגמה מחושבת') && snap.result.includes('611') && snap.result.includes('7,332') && snap.result.includes('79,701') && snap.result.includes('1.2.2033') && snap.sentence.includes('173 + 219 + 219'), 'the result: the example label, 611, 7,332, 79,701 and the next change on 1.2.2033');
check((snap.result.match(/class="jt52-row /g) || []).length === 3 && (snap.result.match(/jt52-now"/g) || []).length === 3 && (snap.result.match(/class="jt52-mk/g) || []).length === 7 && (snap.result.match(/<rect class="jt52-st__bar/g) || []).length === 3, 'the pictures: 3 ledger rows with today\'s line, 7 grant marks, 3 steps in the chart');
check(snap.details.includes('data-act="ics"') && snap.details.includes('data-act="copy-list"') && snap.details.includes('data-act="print"') && snap.details.includes('data-act="rehearse"') && snap.details.includes('topic=family-law') && snap.details.includes('purpose=mediation') && snap.details.includes(yl.savings.personal_url) && snap.details.includes(yl.claim.url), 'the details: .ics, copy-list, print, the rehearsal (family law, mediation), the savings and claim links');
check(snap.details.includes('186 × 58') && snap.details.includes('10,788') && snap.details.includes('597') && snap.details.includes('1,176') && snap.details.includes('1,204') && snap.details.includes('11.8.2026'), 'the details: the deposits arithmetic, 2025 vs 2026 (597 / 611), the study grant 1,176 -> 1,204 paid 11.8.2026');
check(snap.method.startsWith('<ol>') && ['סעיף 65', 'סעיף 68(א)', 'סעיף 72(א)', 'סעיף 74ב(א)(1)', 'סעיף 68(ג)', 'סעיף 74(ב)'].every((s) => snap.method.includes(s)) && snap.method.includes('611 × 76 + 392 × 65 + 173 × 45 = 79,701') && snap.method.includes('186 × 58 = 10,788') && snap.method.includes(yl.law_url), 'the method: every section on the path and the arithmetic');
check((snap.compare_table.match(/<caption>/g) || []).length === 2 && snap.compare_table.includes('1,176') && snap.compare_table.includes('1,402') && snap.compare_table.includes('12,586') && snap.compare_table.includes('582'), 'the page tables: by number of children (6: 1,176; with the supplement 1,402), the savings grants and 217 x 58 = 12,586');
check(all.split('jtool-cite').length > 25 && all.includes(yl.pages.rates) && all.includes(yl.savings.url) && all.includes(yl.law_general_url), 'cites throughout, to the rates page, the savings page and section 1');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence];
[one, four, six, shift, twins, last, supp4, single, add, old, exp, adopt, supp6, fam(['x']), fam(['2007-01-05']), fam(['2003-05-01'])].forEach((r) => { renders.push(YU.renderResult(reg, r), YU.renderDetails(reg, r), YU.verdictSentence(reg, r)); });
renders.push(YU.renderForm(reg, { kids: [] }), YU.renderForm(reg, { kids: [{ birth: '', sex: 'g', arrive: '2026-01-01' }], benefit: 'hb', single: true, addSave: true }));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null/.test(joined), 'no undefined / NaN / null in any rendered string (example, one, four, six, the shift, twins, the month end, the supplement, single, the parents\' addition, 19, expected, adoption, errors, all over 18)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');
check(noPortal(joined), 'no unofficial portal in any rendered string');
check(codes(fam(['2003-05-01'])).includes('legacy') && codes(fam(['2003-05-01'])).includes('none') && fam(['2003-05-01']).monthly === 0, 'a child born before 1.6.2003: over 18, no allowance, the s.68(ב) note');

/* ---------- 7. The share state, the .ics, the profiles, the tables ---------- */
check(YU.stateOf(EX) === 'k2015-01-22~2020-06-04~2024-03-10', 'the example state: the birth dates only');
const rich = { kids: [{ birth: '2015-01-22', sex: 'b', arrive: '' }, { birth: '2020-06-04', sex: '', arrive: '2020-09-01' }, { birth: '2024-03-10', sex: 'g', arrive: '' }], benefit: 'hh', single: true, addSave: true, asOf: '' };
check(JSON.stringify(YU.inputOf(decodeState(`#s=${YU.stateOf(rich)}`, YU.KEYS))) === JSON.stringify(rich) && JSON.stringify(YU.inputOf(decodeState(`#s=${YU.stateOf(EX)}`, YU.KEYS)).kids) === JSON.stringify(EX.kids), 'stateOf -> decodeState -> inputOf returns the same answers (sex, arrival, benefit, single, the parents\' addition)');
check(!/[֐-׿]/.test(YU.stateOf(rich)) && /^[0-9A-Za-z._~/-]+$/.test(YU.stateOf(rich)) && YU.inputOf({}) === null && YU.inputOf({ k: 'bad' }) === null, 'the state carries no Hebrew, no name or ID; an empty or broken hash gives no input');
const cal = ics(ex.deadlines.filter((d) => d.ics).map((d) => ({ date: d.date, summary: d.he })), '2026-10-21T12:00:00Z');
check((cal.match(/BEGIN:VEVENT/g) || []).length === 7 && cal.includes('DTSTART;VALUE=DATE:20330131') && cal.includes('DTSTART;VALUE=DATE:20270310') && cal.includes('DTSTART;VALUE=DATE:20450310'), 'the .ics: 7 events (the age-3 grant, three ends of the allowance, three 21st birthdays)');
const pr = ['one', 'three', 'five', 'support', 'shift'].map((k) => YE.compute(reg, YE.profile(k, DAY)));
check(pr.map((r) => r.monthly).join() === '173,611,1003,1056,611' && pr[4].change && pr[4].change.total === 392 && pr[3].study.on && YE.profile('none', DAY) === null, 'the five one-click families: 173, 611, 1,003, 1,056 (with the supplement), 611 -> 392 next month');
check(YE.familyTable(reg, 6).map((x) => `${x.total}/${x.withSupp}`).join(' ') === '173/173 392/392 611/724 830/1056 1003/1229 1176/1402', 'the family table: 173, 392, 611, 830, 1,003, 1,176; with the supplement 724, 1,056, 1,229, 1,402');
check(YE.shiftMonth('2026-11', 2) === '2027-01' && YE.monthSpan('2026-10', '2027-09') === 12 && YE.monthSpan('2027-01', '2026-12') === 0 && YE.monthEnd('2028-02') === '2028-02-29' && YE.startMonthOf(yl, '2026-01-15') === '2026-01' && YE.startMonthOf(yl, '2026-12-16') === '2027-01', 'the month helpers: shift, span, the end of a leap February, the 15th and the 16th');
const cl = YU.checklistText(reg, ex);
check(cl.startsWith('1. ') && cl.split('\n').length === 4 && YU.nextSteps(reg, supp4).length === 4 && YU.nextSteps(reg, single).some((x) => x.path === '/child-support/') && YU.TOOL_ID === 'kitzbat-yeladim', 'the next steps: 3 + the rehearsal for the example; 4 with the study grant; the child-support link for a single parent');

console.log(`kitzbat-yeladim: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
