/**
 * Golden tests for the maternity instrument (dmei-leida, the rights wave, 21.10.2026).
 * Run: node tests/js/test-rights-leida.mjs
 *
 * By hand, from chapter 3 of the National Insurance Law, the Institute's maternity pages and the Women's Employment Law
 * (rights_leida, rights_btl): 10 of 14 months (or 15 of 22) -> 105 days, 6 of 14 -> 56 (s.50(א)); an employee's wage in
 * the 3 full months before the month of the stop day / 90, or 6 months / 180, the higher (s.54(א)); at most
 * 10,514 x 5 / 30 = 1,752.33 a day (s.53(א)); the period from the stop day, not earlier than 53 days before the birth
 * (28 when partial) (s.52); 3 weeks per extra baby (s.51(א1)); hospitalization from 15 days (s.51(א)); the partner's days
 * at the end of the period (s.49); the grant 20% / 9% / 6% of 10,514, twins 100%, triplets 150% (s.44); 26 weeks of leave
 * (s.6(ב)) and 60 days of protection after it (s.9(ג)(1א)).
 * The example: an employee, 12 of 14 months, 15,000 a month, stopped 1.12.2026, birth 8.12.2026, second child:
 * 45,000 / 90 = 500 = 90,000 / 180; 500 x 105 = 52,500; paid 1.12.2026 to 15.3.2027; grant 9% x 10,514 = 946.26 -> 946;
 * leave 1.12.2026 + 182 days -> 31.5.2027; protection to 30.7.2027; the claim by 1.12.2027.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as LE from '../../assets/js/tools/leida-engine.js';
import * as LU from '../../assets/js/tools/leida-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const lq = reg.rights_leida;
const btl = reg.rights_btl;
const EX = LU.EXAMPLE;
const run = (over) => LE.compute(reg, Object.assign({}, EX, over));
const near = (a, b) => Math.abs(a - b) < 0.005;
const codes = (r) => r.flags.map((f) => f.code);
// The unofficial portal's name, built from char codes so the name itself is never written in the repo (contract rule).
const PORTAL_HE = String.fromCharCode(0x05db, 0x05dc, 0x20, 0x05d6, 0x05db, 0x05d5, 0x05ea);
const PORTAL_EN = String.fromCharCode(0x6b, 0x6f, 0x6c, 0x7a, 0x63, 0x68, 0x75, 0x74);
const noPortal = (s) => !s.toLowerCase().includes(PORTAL_EN) && !s.includes(PORTAL_HE);

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
const paths = [
	'qualify.full_months', 'qualify.full_window', 'qualify.full_alt_months', 'qualify.full_alt_window', 'qualify.full_days', 'qualify.full_weeks', 'qualify.partial_months',
	'qualify.partial_window', 'qualify.partial_days', 'qualify.partial_weeks', 'qualify.full_section', 'qualify.partial_section', 'base.months_short', 'base.divisor_short',
	'base.months_long', 'base.divisor_long', 'base.self_quarters', 'base.section', 'max.daily', 'max.b1_mult', 'max.divisor', 'max.section', 'start.before_full', 'start.before_partial',
	'multiple.full_extra_days', 'multiple.partial_extra_days', 'hosp.min_days', 'hosp.mother_full', 'hosp.mother_partial', 'hosp.baby_full', 'hosp.baby_partial', 'hosp.total_full',
	'hosp.total_partial', 'complex.days', 'complex.from', 'complex.total_max_days', 'partner.min_days', 'partner.together_days', 'partner.together_twins_days',
	'partner.together_triplets_days', 'partner.swap_after_days', 'leave.weeks', 'leave.before_max_weeks', 'leave.short_weeks', 'protect.after_days', 'protect.pregnancy_months', 'war.from', 'war.to',
	'parent_hour.months', 'claim.earliest_weeks_before', 'claim.deadline_months', 'claim.form', 'claim.employer_form', 'grant.first', 'grant.second', 'grant.third_plus',
	'grant.twins', 'grant.triplets', 'grant.each_extra', 'multi_allowance.rows', 'multi_allowance.bands', 'hospital.amount', 'hospital.premature', 'differences.min',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(lq, p) !== undefined && get(lq, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(lq, p) === undefined).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(lq, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(lq.source_url.startsWith('https://www.btl.gov.il/') && lq.law_url.startsWith('https://www.btl.gov.il/Laws1/') && lq.work_law_url.startsWith('https://www.nevo.co.il/') && urls.length >= 40 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|www\.gov\.il|govforms\.gov\.il|www\.nevo\.co\.il)\//.test(u)), `registry: every url is an official https source (${urls.length} urls)`);
check(['qualify', 'base', 'max', 'deductions', 'start', 'multiple', 'hosp', 'complex', 'partner', 'leave', 'protect', 'parent_hour', 'unpaid', 'claim', 'grant', 'multi_allowance', 'hospital', 'differences'].every((k) => typeof lq[k].url === 'string' && lq[k].url.startsWith('https://')), 'registry: every rule block carries its own source url');
check(noPortal(JSON.stringify(lq)), 'registry: no unofficial portal anywhere');
check(lq.checked_on === '2026-10-21' && lq.from === '2026-01-01' && lq.next_update === '2027-01-01' && lq.refresh_every_days === 365, 'registry: checked 21.10.2026, figures from 1.1.2026, next update 1.1.2027');
check(near(Math.round(btl.basic_amount.b1 * lq.max.b1_mult / lq.max.divisor * 100) / 100, lq.max.daily) && lq.max.daily === 1752.33, 'maximum: 10,514 x 5 / 30 = 1,752.333 -> 1,752.33 a day (s.53(א)), consistent with rights_btl b1');
const g = lq.grant;
check([['first', 'pct_first'], ['second', 'pct_second'], ['third_plus', 'pct_third'], ['twins', 'pct_twins'], ['triplets', 'pct_triplets'], ['each_extra', 'pct_extra']].every(([k, pc]) => Math.round(btl.basic_amount.b1 * g[pc] / 100) === g[k]), 'grant: 20% / 9% / 6% / 100% / 150% / 50% of 10,514 = 2,103 / 946 / 631 / 10,514 / 15,771 / 5,257 (s.44), the Institute\'s 2026 figures');
check(lq.qualify.full_days === 105 && lq.qualify.partial_days === 56 && lq.start.before_full === 53 && lq.start.before_partial === 28 && lq.multiple.full_extra_days === 21 && lq.multiple.partial_extra_days === 14, 'registry: 105 / 56 days (s.50(א)), 53 / 28 days before the birth (s.52), 3 / 2 weeks per extra baby (s.51(א1))');
check(lq.hosp.mother_full === 28 && lq.hosp.mother_partial === 14 && lq.hosp.baby_full === 140 && lq.hosp.baby_partial === 84 && lq.complex.days === 35 && lq.complex.total_max_days === 140, 'registry: hospitalization 4 / 2 and 20 / 12 weeks (s.51(א)), complex disability 5 weeks within 20 (s.51(א3))');
check(lq.multi_allowance.rows.length === 3 && lq.multi_allowance.rows.every((x) => x.amounts.length === lq.multi_allowance.bands.length) && lq.multi_allowance.bands.reduce((a, b) => a + b[1] - b[0] + 1, 0) === lq.multi_allowance.months, 'registry: the multiple-birth table: 3, 4, 5 children, 5 bands covering 20 months');

/* ---------- 2. The example ---------- */
const ex = LE.compute(reg, EX);
check(ex.ok && ex.eligible && ex.tier === 'full' && ex.empQ.via === '14' && ex.baseDays === 105, 'example: 12 of 14 months -> full, 105 days (s.50(א)(1))');
check(ex.emp.sumShort === 45000 && ex.emp.short === 500 && ex.emp.sumLong === 90000 && ex.emp.long === 500 && ex.daily === 500 && !ex.capped, 'example: 15,000 x 3 = 45,000 / 90 = 500; 15,000 x 6 = 90,000 / 180 = 500; 500 a day, under 1,752.33 (s.54(א))');
check(LE.baseMonths('2026-12-01').join(',') === '2026-06,2026-07,2026-08,2026-09,2026-10,2026-11' && LE.monthHe('2026-09') === 'ספטמבר 2026', 'the base months: June to November 2026 (3: September to November) for a stop on 1.12.2026');
check(ex.paidStart === '2026-12-01' && ex.paidEnd === '2027-03-15' && ex.paidDays === 105 && ex.total === 52500, 'example: from the stop day 1.12.2026 (a week before the birth, within 53 days, s.52); 105 days to 15.3.2027; 500 x 105 = 52,500');
check(ex.grant.amount === 946 && ex.grant.kind === 'second' && ex.multi === null, 'example: the second child: 9% x 10,514 = 946.26 -> 946 (s.44(א)(1א))');
check(ex.leave.start === '2026-12-01' && ex.leave.end === '2027-05-31' && ex.leave.back === '2027-06-01' && ex.leave.protectEnd === '2027-07-30' && ex.leave.hourEnd === '2027-09-30' && ex.leave.unpaid === 77, 'example: 26 weeks = 182 days to 31.5.2027 (s.6(ב)(1)), 77 unpaid days after 15.3.2027; 60 days to 30.7.2027 (s.9(ג)(1א)); parenting hour to 30.9.2027 (s.7(ג)(3))');
check(ex.deadlines.map((d) => `${d.key}:${d.date}`).join(' ') === 'earliest:2026-10-06 stop:2026-12-01 birth:2026-12-08 grant:2027-01-08 paid_end:2027-03-15 back:2027-06-01 protect:2027-07-30 hour:2027-09-30 claim:2027-12-01', 'example dates: form 100 not before 6.10.2026 (9 weeks), the grant within a month, the paid end, the return, the protection, the claim by 1.12.2027 (s.296)');
check(ex.flags.length === 0, 'example: no flags');
check(ex.weeks.length === 35 && ex.weeks[0].start === '2026-12-01' && ex.weeks[34].start === '2027-07-27' && ex.weeks[1].cells.some((c) => c.birth && c.d === '2026-12-08'), 'example calendar: 35 weeks from 1.12.2026 (242 days to 30.7.2027), the birth in week 2');
const kinds = {};
ex.weeks.forEach((w) => w.cells.forEach((c) => { kinds[c.k] = (kinds[c.k] || 0) + 1; }));
check(kinds.pre === 7 && kinds.paid === 98 && kinds.unpaid === 77 && kinds.protect === 60 && kinds.post === 3 && !kinds.ext && !kinds.partner, 'example calendar cells: 7 paid before the birth + 98 after = 105; 77 unpaid; 60 protection; 3 empty to the end of week 35');

/* ---------- 3. The maximum, exactly at and one shekel above ---------- */
const at = run({ wage: 52569.9 });
const above = run({ wage: 52570.9 });
check(at.daily === 1752.33 && !at.capped && at.total === 183994.65, 'exactly at: 52,569.90 x 3 = 157,709.70 / 90 = 1,752.33, not capped; x 105 = 183,994.65');
check(above.rawBoth === 1752.36 && above.daily === 1752.33 && above.capped && above.total === 183994.65 && codes(above).includes('capped') && codes(above).includes('next_year'), 'one shekel above: 52,570.90 -> 1,752.363 -> 1,752.36, paid 1,752.33 (s.53(א)); the capped and the 2026-maximum notes');
const day1 = run({ wage: 52599.9 });
check(day1.rawBoth === 1753.33 && day1.daily === 1752.33 && day1.capped, 'one shekel a day above: 52,599.90 / 30 = 1,753.33 -> paid 1,752.33');

/* ---------- 4. Partial eligibility: 56 days ---------- */
const pa = run({ m14: 7 });
check(pa.tier === 'partial' && pa.paidDays === 56 && pa.paidStart === '2026-12-01' && pa.paidEnd === '2027-01-25' && pa.total === 28000 && codes(pa).includes('partial'), '7 of 14 months: 56 days (s.50(א)(2)), 1.12.2026 to 25.1.2027; 500 x 56 = 28,000');
check(run({ m14: 6 }).tier === 'partial' && run({ m14: 5 }).tier === 'none' && run({ m14: 9, m22: 15 }).tier === 'full' && run({ m14: 9, m22: 15 }).empQ.via === '22' && run({ m14: 9, m22: 14 }).tier === 'partial' && run({ m14: 10 }).tier === 'full', 'the edges: 6 of 14 partial, 5 none; 9 of 14 with 15 of 22 full; 14 of 22 partial; 10 of 14 full');
check(run({ m14: 7, stop: '2026-10-01' }).paidStart === '2026-11-10' && codes(run({ m14: 7, stop: '2026-10-01' })).includes('early_stop'), 'partial: not earlier than 28 days before the birth: 8.12.2026 - 28 = 10.11.2026 (s.52)');
const no = run({ m14: 4 });
check(no.ok && !no.eligible && no.total === 0 && no.paidDays === 0 && no.grant.amount === 946 && no.leave.end === '2027-05-31' && codes(no)[0] === 'none' && LU.verdictSentence(reg, no).startsWith('אין זכאות לדמי לידה'), '4 of 14 months: no maternity allowance, but the grant (946) and the 26-week leave remain');

/* ---------- 5. Twins and more ---------- */
const tw = run({ babies: 2 });
check(tw.paidDays === 126 && tw.multipleExt === 21 && tw.paidEnd === '2027-04-05' && tw.total === 63000 && tw.grant.amount === 10514 && tw.multi === null, 'twins: 105 + 21 = 126 days (s.51(א1)) to 5.4.2027; 500 x 126 = 63,000; grant 10,514 (100%); no multiple-birth allowance below 3');
check(tw.leave.end === '2027-06-21' && tw.leave.protectEnd === '2027-08-20' && tw.tcap === 21, 'twins: the leave + 3 weeks to 21.6.2027 (s.6(ג)(1)), protection to 20.8.2027; the partner together up to 21 days');
check(run({ babies: 2, m14: 7 }).paidDays === 70 && run({ babies: 2, m14: 7 }).total === 35000, 'twins with partial eligibility: 56 + 14 = 70 days; 35,000');
const tr = run({ babies: 3 });
check(tr.paidDays === 147 && tr.grant.amount === 15771 && tr.multi.total === 145513 && codes(tr).includes('multi'), 'triplets: 147 days; grant 15,771; the allowance 3 x 13,458 + 3 x 10,514 + 3 x 8,411 + 3 x 6,308 + 8 x 3,680 = 145,513 (the Institute\'s table)');
check(run({ babies: 4 }).grant.amount === 21028 && run({ babies: 5 }).grant.amount === 26285 && run({ babies: 4 }).multi.row.kids === 4 && LE.grantFor(lq, 1, 1).amount === 2103 && LE.grantFor(lq, 1, 3).amount === 631, 'grants: 4 babies 15,771 + 5,257 = 21,028; 5 babies 26,285; first child 2,103; third and later 631');

/* ---------- 6. A self-employed mother, and both ---------- */
const se = run({ who: 'self', selfIncome: 12000, selfPrev: 180000 });
check(se.ok && se.self.quarter === 36000 && se.self.short === 400 && se.self.prevQuarter === 45000 && se.self.prev === 500 && se.self.basis === 'prev' && se.daily === 500 && se.total === 52500 && se.leave === null, 'self-employed: 12,000 x 3 = 36,000 / 90 = 400; last year 180,000 / 4 = 45,000 / 90 = 500, the higher (s.54(ב)(2)); 52,500; no employer leave');
check(run({ who: 'self', selfIncome: 12000 }).total === 42000 && codes(se).includes('self') && se.weeks.length === 15, 'self-employed without last year\'s assessment: 400 x 105 = 42,000; the two-stage note; the calendar ends with the paid days');
const bo = run({ who: 'both', sm14: 7, selfIncome: 6000 });
check(bo.split && bo.daily === 700 && bo.dailyLong === 500 && bo.total === 63700 && codes(bo).includes('both_split'), 'both, employee full and self-employed partial: (500 + 200) x 56 + 500 x 49 = 39,200 + 24,500 = 63,700');
check(run({ who: 'both', sm14: 12, selfIncome: 6000 }).total === 73500 && run({ who: 'both', sm14: 3, selfIncome: 6000 }).total === 52500 && codes(run({ who: 'both', sm14: 3, selfIncome: 6000 })).includes('both_one') && run({ who: 'both', sm14: 12, selfIncome: 10000, wage: 50000 }).daily === 1752.33, 'both: full and full 700 x 105 = 73,500; the self-employed role short of months: only the wage counts (52,500); 1,666.67 + 333.33 = 2,000 capped at 1,752.33');

/* ---------- 7. The partner ---------- */
const sw = run({ partner: 'swap', pdays: 21, pwage: 18000 });
check(sw.partnerDays === 21 && sw.partnerStart === '2027-02-23' && sw.partnerDaily === 600 && sw.motherDays === 84 && sw.motherTotal === 42000 && sw.partnerTotal === 12600 && sw.total === 54600, 'swap: the last 21 days from 23.2.2027 (after 6 weeks from the birth); 18,000 / 30 = 600 x 21 = 12,600; the mother 500 x 84 = 42,000; 54,600 (s.49(ב))');
check(sw.leave.motherEnd === '2027-02-22' && sw.leave.back === '2027-02-23' && sw.leave.protectEnd === '2027-04-23' && sw.weeks.some((w) => w.cells.some((c) => c.k === 'partner' && c.prot)), 'swap: the mother returns on 23.2.2027, protection to 23.4.2027, drawn under the partner\'s days');
const to = run({ partner: 'together', pdays: 7, pwage: 18000 });
check(to.partnerStart === '2027-03-09' && to.motherTotal === 49000 && to.partnerTotal === 4200 && to.total === 53200 && to.leave.end === '2027-05-31', 'together: the mother\'s last week, 9.3 to 15.3.2027: 500 x 98 + 600 x 7 = 53,200 (s.49(ד1)); the leave unchanged');
const perr = (over) => { const r = run(over); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
check(perr({ partner: 'together', pdays: 8, pwage: 18000 }) === 'pd' && perr({ partner: 'swap', pdays: 6, pwage: 18000 }) === 'pd' && perr({ partner: 'swap', pdays: 57, pwage: 18000 }) === 'pd' && run({ partner: 'swap', pdays: 56, pwage: 18000 }).partnerStart === '2027-01-19', 'partner limits: together 7 for one baby; swap at least 7, at most the 56 days from 19.1.2027 (42 days after the birth)');
check(run({ babies: 2, partner: 'together', pdays: 21, pwage: 18000 }).partnerDays === 21 && perr({ babies: 2, partner: 'together', pdays: 22, pwage: 18000 }) === 'pd', 'twins: together up to 21 days');
check(run({ m14: 7, stop: '2026-12-08', partner: 'swap', pdays: 14, pwage: 18000 }).partnerStart === '2027-01-19' && perr({ m14: 7, stop: '2026-12-08', partner: 'swap', pdays: 15, pwage: 18000 }) === 'pd', 'partial, from the birth: 56 days to 1.2.2027, the partner only the last 14 after 42 days');
const npq = run({ partner: 'swap', pdays: 21, pwage: '', pq: false });
check(npq.ok && npq.partnerDays === 0 && npq.total === 52500 && codes(npq).includes('partner_no'), 'a partner without his own 10 of 14 months: the days stay with the mother, flagged');

/* ---------- 8. Hospitalization, complex disability ---------- */
const bh = run({ babyHosp: 30 });
check(bh.babyExt === 30 && bh.paidDays === 135 && bh.paidEnd === '2027-04-14' && bh.total === 67500 && bh.leave.end === '2027-06-30' && codes(bh).includes('hosp'), 'baby in hospital 30 days: +30 (s.51(א)); 135 days to 14.4.2027; 67,500; the leave to 30.6.2027 (s.6(ד))');
check(run({ momHosp: 20 }).momExt === 20 && run({ momHosp: 40 }).momExt === 28 && run({ momHosp: 14 }).momExt === 0 && codes(run({ momHosp: 14 })).includes('mom_short') && run({ momHosp: 20, m14: 7 }).momExt === 14, 'mother: 20 days +20; 40 days capped at 28 (4 weeks); 14 days nothing; partial capped at 14');
check(run({ momHosp: 28, babyHosp: 200 }).hospExt === 140 && run({ babyHosp: 100, m14: 7 }).hospExt === 84 && codes(run({ momHosp: 10, babyHosp: 10 })).includes('combine') && run({ momHosp: 10, babyHosp: 10 }).hospExt === 0, 'caps: 28 + 140 -> 140 (20 weeks); partial baby 100 -> 84 (12 weeks); 10 + 10 short days: the combine note, no days added');
check(run({ complex: true }).complexExt === 35 && run({ complex: true }).paidDays === 140 && run({ complex: true, babyHosp: 140 }).complexExt === 0 && run({ complex: true, birth: '2026-03-01', stop: '2026-03-01' }).complexExt === 0 && codes(run({ complex: true, birth: '2026-03-01', stop: '2026-03-01' })).includes('complex_early'), 'complex disability: +35 days from 1.4.2026 (s.51(א3)); none when the 20 weeks are used; none before 1.4.2026');

check(codes(run({ m14: 7, stop: '2026-03-20', birth: '2026-04-01' })).includes('war') && !codes(run({ stop: '2026-03-20', birth: '2026-04-01' })).includes('war') && !codes(run({ m14: 7, stop: '2026-04-10', birth: '2026-04-15' })).includes('war'), 'a birth between 28.2 and 14.4.2026 short of months: the unemployment-period note (s.49ב); not when full, not after 14.4.2026');

/* ---------- 9. Early stop, seniority ---------- */
const es = run({ stop: '2026-09-01' });
check(es.paidStart === '2026-10-16' && es.leave.start === '2026-10-20' && es.paidEnd === '2027-01-28' && codes(es).includes('early_stop') && es.weeks[0].cells[0].k === 'gap', 'stopped 1.9.2026: paid from 8.12.2026 - 53 = 16.10.2026 (s.52), the leave from 7 weeks before = 20.10.2026 (s.6(ב)(1)); the days before drawn as a gap');
const sh = run({ seniority: '6to12' });
check(sh.leave.end === '2027-03-15' && sh.leave.protectEnd === '2027-05-14' && codes(sh).includes('leave_short') && codes(run({ seniority: 'lt6' })).includes('preg_protect'), 'less than 12 months with the employer: 15 weeks to 15.3.2027 (s.6(ב)(5)), protection to 14.5.2027; less than 6: the pregnancy protection note (s.9(א))');
check(run({ wageMode: 'each', wages: [20000, 20000, 20000, 10000, 10000, 10000] }).emp.basis === 'long' && run({ wageMode: 'each', wages: [20000, 20000, 20000, 10000, 10000, 10000] }).daily === 500 && codes(run({ wageMode: 'each', wages: [20000, 20000, 20000, 10000, 10000, 10000] })).includes('basis_long'), 'a wage that dropped: 30,000 / 90 = 333.33 vs 90,000 / 180 = 500: the 6 months are higher (s.54(א))');

/* ---------- 10. Input errors ---------- */
const errs = (over) => { const r = run(over); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
check(errs({ who: 'x' }) === 'who' && errs({ m14: 15 }) === 'm14' && errs({ m14: 'x' }) === 'm14' && errs({ m14: '' }) === 'm14' && errs({ m14: 9.5 }) === 'm14', 'who, and the months of 14: a whole number 0 to 14');
check(errs({ m14: 8, m22: 7 }) === 'm22' && errs({ m14: 8, m22: 17 }) === 'm22' && errs({ m14: 8, m22: 23 }) === 'm22' && errs({ m14: 8, m22: 16 }) === '', 'the months of 22: not fewer than of 14, not more than 8 above them');
check(errs({ wage: 0 }) === 'wage' && errs({ wage: '' }) === 'wage' && errs({ wageMode: 'each', wages: [1, 2, '', 4, 5, 6] }) === 'w2' && errs({ wageMode: 'each', wages: [0, 0, 0, 0, 0, 0] }) === 'w5', 'wages: a positive amount; every month in the six-month mode; not all zero');
check(errs({ who: 'self', selfIncome: '' }) === 'si' && errs({ who: 'self', selfIncome: 5000, selfPrev: -1 }) === 'sp' && errs({ who: 'both', selfIncome: 5000, sm14: '' }) === 'sm14', 'self-employed income, last year\'s assessment, and the self-employed months when both');
check(errs({ stop: '31.2.2026' }) === 'stop' && errs({ birth: '' }) === 'birth' && errs({ stop: '2026-12-09' }) === 'stop' && errs({ stop: '2026-01-01' }) === 'stop', 'dates: a real date, the stop not after the birth, not more than 300 days before it');
check(errs({ babies: 6 }) === 'babies' && errs({ order: 4 }) === 'order' && errs({ seniority: '' }) === 'sen' && errs({ momHosp: -1 }) === 'mh' && errs({ babyHosp: 1.5 }) === 'bh', 'babies 1 to 5, the order, the seniority, the hospital days');
check(errs({ partner: 'swap', pdays: '', pwage: '' }) === 'pd,pw' && errs({ m14: 'x', wage: -5, birth: 'x' }) === 'm14,wage,birth', 'every error reported at once, with its field');
check(LU.renderResult(reg, run({ m14: 'x' })).includes('צריך לתקן את הקלט') && LU.renderDetails(reg, run({ m14: 'x' })) === '', 'the error state renders, details stay empty');

/* ---------- 11. The snapshot ---------- */
const snap = LU.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'dmei-leida' && snap.registry_version === reg.registry_version && snap.total === 52500 && snap.sticky.includes('52,500') && snap.sentence === LU.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 52,500, the sticky, the sentence, the input');
check(snap.form.includes('name="jt32-who" value="employee" checked') && snap.form.includes('value="12"') && snap.form.includes('value="15,000"') && snap.form.includes('value="1.12.2026"') && snap.form.includes('value="8.12.2026"') && snap.form.includes('name="jt32-ord" value="2" checked') && snap.form.includes('name="jt32-sen" value="gte12" checked'), 'the form is pre-filled with the example');
check(snap.result.includes('דוגמה מחושבת') && snap.result.includes('52,500') && snap.result.includes('946') && snap.result.includes('1.6.2027') && snap.sentence.includes('15.3.2027') && snap.sentence.includes('30.7.2027'), 'the result: the example label, 52,500, the grant 946, the return 1.6.2027; the sentence with the paid end and the protection');
check((snap.result.match(/class="jt32-wk[ "]/g) || []).length === 35 && (snap.result.match(/jt32-c--birth/g) || []).length === 2 && (snap.result.match(/jt32-c--end/g) || []).length === 1 && (snap.result.match(/jt32-c--back/g) || []).length === 1 && (snap.result.match(/jt32-c--protect/g) || []).length === 61, 'the picture: 35 week cards, the birth (and its legend), the last paid day, the return, 60 protection cells (and the legend)');
check(snap.details.includes('45,000 ÷ 90') && snap.details.includes('90,000 ÷ 180') && snap.details.includes('1,752.33') && snap.details.includes('data-act="ics"') && snap.details.includes('data-act="copy-list"') && snap.details.includes('טופס 100') && snap.details.includes('טופס 355') && snap.details.includes(lq.claim.form_url) && snap.details.includes('19,028'), 'the details: both bases, the maximum, the .ics and checklist buttons, forms 100 and 355 with the online claim, the hospitalization grant');
check(snap.method.startsWith('<ol>') && ['סעיף 50(א)(1)', 'סעיף 54(א)', 'סעיף 53(א)', 'סעיף 52(א)', 'סעיף 53(ד)', 'סעיף 44', 'סעיף 6(ב)(1)', 'סעיף 9(ג)(1א)'].every((s) => snap.method.includes(s)) && snap.method.includes('45,000 ÷ 90 = 500.00') && snap.method.includes('500.00 × 105 = 52,500.00') && snap.method.includes('10,514 × 5 ÷ 30 = 1,752.33') && snap.method.includes(lq.law_url) && snap.method.includes(lq.work_law_url), 'the method: every section on the path, the arithmetic, the law and the Women\'s Employment Law');
check((snap.compare_table.match(/<caption>/g) || []).length === 3 && snap.compare_table.includes('2,103') && snap.compare_table.includes('15,771') && snap.compare_table.includes('183,994.65') && snap.compare_table.includes('(מקסימום)') && snap.compare_table.includes('18 שבועות'), 'the page tables: the amount by wage (52,570 at the maximum: 183,994.65), the grant by order (2,103 ... 15,771), the weeks by babies (twins 18)');
check(all.split('jtool-cite').length > 30 && all.includes(lq.pages.period) && all.includes(lq.pages.amount) && all.includes(lq.grant.url), 'cites throughout, to the period, the amount and the grant pages');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence];
[pa, no, tw, tr, se, bo, sw, to, bh, es, sh, above, npq, run({ m14: 'x' }), run({ complex: true, babyHosp: 140, momHosp: 30 }), run({ who: 'self', selfIncome: 5000, m14: 3 })].forEach((r) => { renders.push(LU.renderResult(reg, r), LU.renderDetails(reg, r), LU.verdictSentence(reg, r)); });
renders.push(LU.renderForm(reg, Object.assign({}, EX, { who: 'both', wageMode: 'each', wages: [], partner: 'swap' })), LU.renderForm(reg, { stop: '', birth: '' }));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null/.test(joined), 'no undefined / NaN / null in any rendered string (example, partial, none, twins, triplets, self, both, swap, together, hospital, early stop, seniority, the maximum, errors)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');
check(noPortal(joined), 'no unofficial portal in any rendered string');

/* ---------- 12. The share state, the .ics and the checklist ---------- */
check(LU.stateOf(EX) === 'ke/m12/w15000/s2026-12-01/b2026-12-08/r2/ec' && JSON.stringify(LU.inputOf(decodeState(`#s=${LU.stateOf(EX)}`, LU.KEYS))) === JSON.stringify(EX), 'the example round-trips exactly, as a short readable state');
const full = { who: 'both', m14: 9, m22: 15, sm14: 7, sm22: '', wageMode: 'each', wage: '', wages: [9000, 9500, 10000, 11000, 0, 12000], selfIncome: 4000, selfPrev: 60000, stop: '2026-11-20', birth: '2026-12-25', babies: 2, order: 1, seniority: '6to12', momHosp: 16, babyHosp: 40, complex: true, partner: 'swap', pdays: 14, pwage: 21000, pq: true };
check(JSON.stringify(LU.inputOf(decodeState(`#s=${LU.stateOf(full)}`, LU.KEYS))) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns the same answers, six wages, both roles and the partner included');
check(!/[֐-׿]/.test(LU.stateOf(full)) && /^[0-9A-Za-z._~/-]+$/.test(LU.stateOf(full)) && LU.inputOf({}) === null, 'the state carries no Hebrew, no name or ID; an empty hash gives no input');
const cal = ics(ex.deadlines.map((d) => ({ date: d.date, summary: d.he })), '2026-10-21T12:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20261006') && cal.includes('DTSTART;VALUE=DATE:20270315') && cal.includes('DTSTART;VALUE=DATE:20270730') && cal.includes('DTSTART;VALUE=DATE:20271201') && (cal.match(/BEGIN:VEVENT/g) || []).length === 9, 'the .ics: 9 events, from the earliest claim to the claim deadline');
const cl = LU.checklist(reg, ex);
check(cl.length === 9 && LU.checklistText(reg, ex).startsWith('1. ') && LU.checklist(reg, sw).length === 10 && LU.checklist(reg, bh).length === 10 && LU.checklist(reg, se).some((x) => x.he.startsWith('עצמאית שילדה')) && LU.TOOL_ID === 'dmei-leida', 'the checklist: 9 steps for the example (form 100, the text message, form 355, the employer arrangement, 3 documents, the grant, the return), + form 360 for a partner, + the extension claim; the self-employed automatic payment');
const periods = LU.periods(reg, ex);
check(periods.length === 3 && periods[0].from === '2026-12-01' && periods[0].to === '2027-03-15' && periods[1].from === '2027-03-16' && periods[1].to === '2027-05-31' && periods[2].to === '2027-07-30', 'the leave in text: paid 1.12.2026 to 15.3.2027, unpaid to 31.5.2027, protection to 30.7.2027');
check(LE.byWage(reg, EX, [12000, 52570]).map((x) => `${x.daily}/${x.full}/${x.partial}/${x.twins}`).join(' ') === '400/42000/22400/50400 1752.33/183994.65/98130.48/220793.58', 'the wage table: 12,000 -> 400 a day, 42,000 / 22,400 / 50,400; 52,570 -> the maximum: 183,994.65 / 98,130.48 / 220,793.58');

console.log(`dmei-leida: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
