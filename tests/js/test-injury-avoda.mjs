/**
 * Golden tests for the work-injury journey (teunat-avoda, the road-accident and personal-injury wave, 22.10.2026, HAD-591).
 * Run: node tests/js/test-injury-avoda.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the National Insurance Law
 * [Consolidated Version] 1995 as the Institute publishes it (btl.gov.il/Laws1/00_0001_000005.pdf, chapter 5: s.79-82 the
 * work accident and its exceptions; s.92(b) 13 weeks; s.93(a) the injury day by the employer; s.93(b) the first two days only
 * from 12 days of incapacity; s.94 the first 12 entitled days, not paid to a self-employed person; s.97(a) 75% of the
 * regular wage, at most 75% of the basic amount × 5 ÷ 30; s.98(a) the quarter's income ÷ 90; s.102 the reduced allowance,
 * 1/8 a day per hour; s.104 the 9% / 20% thresholds; s.105(a) the 100% pension = the day's allowance × 30; s.106 the share;
 * s.107(a) the grant = 43 monthly pensions; s.107(b) the increased grant before 21; and 00_0001_000014.pdf, s.296, s.328א),
 * the 1956 degree regulations (02_0001_150700.pdf: reg. 15(a) up to half more, 19% at most under 20%; reg. 19a rounding a
 * pension degree up; reg. 27(a) 30 days; reg. 28 30 more; reg. 36(a) 6 months; reg. 17 12-60 months) and the Institute's
 * pages (the daily maximum 1,314.25 and the monthly maximum 39,428 from 1.1.2026; the increased grant as if the income were
 * the average wage 13,769; the claims committee 6 months, the labor court 12 months, the appeal on the appeals committee 60
 * days). A deadline on a rest day moves to the next day (Interpretation Law s.10(c)): Saturday, Passover 22.4.2027, Rosh
 * Hashana 2-3.10.2027.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/avoda-engine.js';
import * as U from '../../assets/js/tools/avoda-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.compute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const av = reg.injury_avoda;
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;
const fl = (r, code) => r.flags.find((f) => f.code === code);

/* ---------- 1. The registry ---------- */
check(av && av.checked_on === '2026-10-22' && av.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: injury_avoda checked 22.10.2026, next update 1.1.2027');
check(av.law.url === 'https://www.btl.gov.il/Laws1/00_0001_000005.pdf' && av.law.general_url.endsWith('00_0001_000014.pdf') && av.regs.url.endsWith('02_0001_150700.pdf'), 'registry: the law (chapters 5 and 14) and the 1956 regulations are the Institute\'s consolidated texts');
check(av.allowance.max_daily === 1314.25 && E.avMaxDaily(reg) === 1314.25 && reg.rights_btl.basic_amount.b1 === 10514, 's.97(a): 75% × 10,514 × 5 ÷ 30 = 1,314.25, equal to the Institute\'s published maximum from 1.1.2026');
check(av.disability.max_monthly === 39428 && Math.round(av.allowance.max_daily * 30) === 39428 && av.disability.max_monthly_from === '2026-01-01', 'the published monthly maximum 39,428 = 1,314.25 × 30 (39,427.50) rounded to the shekel');
check(av.allowance.max_days === 91 && av.allowance.waiting_unless_days === 12 && av.allowance.first_period_days === 12 && av.disability.grant_months === 43 && av.disability.grant_min === 9 && av.disability.pension_min === 20 && av.disability.temp_min === 9, 'registry: 91 days, 12 days, 43 pensions, 9% / 20% / 9%');
check(av.regs.reg15.max_share === 50 && av.regs.reg15.grant_cap === 19 && av.regs.reg27.days === 30 && av.regs.reg28.days === 30 && av.regs.reg36.months === 6 && av.deadlines.court_days === 60 && av.deadlines.claims_committee_months === 6 && av.deadlines.labor_court_months === 12, 'registry: reg. 15 (half, 19%), reg. 27/28 30 days, reg. 36 6 months, 60 days, 6 and 12 months');
const urls = JSON.stringify(av).match(/https?:\/\/[^"]+/g) || [];
check(urls.length > 30 && urls.every((u) => /^https:\/\/(www\.)?(btl\.gov\.il|gov\.il)\//.test(u)), `registry: every source is official (btl.gov.il or gov.il), ${urls.length} links`);
check(av.changes.length >= 7 && av.changes.every((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.date) && c.section && c.url && c.he), 'registry: every "what changed" row has a date, a section and a source');

/* ---------- 2. The example: an employee, 12,000 a month, 45 days, 15% stable ---------- */
const ex = E.compute(reg, EX);
check(ex.ok && EX.injury === '2026-03-02' && EX.decision === '2026-10-05' && ex.daily.base === 400 && ex.daily.daily === 300, 'example: 12,000 × 3 = 36,000 ÷ 90 = 400 a day (s.98(a)); 75% = 300 (s.97(a))');
check(ex.pd.paid === 45 && ex.pd.waiting === 0 && ex.allowance === 13500 && ex.allowanceEnd === '2026-04-16', 'example: 45 days, 12 or more, so from the day after the injury: 45 × 300 = 13,500 to 16.4.2026');
check(ex.full === 9000 && ex.monthly === 1350 && ex.grant === 58050 && ex.benefit === 'grant', 'example: 100% = 300 × 30 = 9,000 (s.105(a)); 15% = 1,350 (s.106); a stable 9%-19.99% grant: 1,350 × 43 = 58,050 (s.107(a))');
check(ev(ex, 'claim') === '2027-03-02' && ev(ex, 'arar') === '2026-11-04' && ev(ex, 'reasons') === '2026-12-04' && ev(ex, 'aggravation') === '2027-04-05' && ev(ex, 'ia_end') === '2026-04-16', 'example dates: claim by 2.3.2027 (12 months), appeal by 4.11.2026 (5.10 + 30, reg. 27(a)), reasons by 4.12.2026 (reg. 28), aggravation from 5.4.2027 (reg. 36(a))');
check(ex.accident.status === 'yes' && fl(ex, 'presumption') && fl(ex, 'injury_day') && fl(ex, 'first_period') && fl(ex, 'employer_report'), 'example flags: the presumption (s.79), the injury day by the employer (s.93(a)), the first 12 days (s.94), the report to the labor inspector (more than 3 days)');

/* ---------- 3. The injury allowance: the days ---------- */
const short = E.compute(reg, U.avPreset('short', '2026-10-22'));
check(short.daily.daily === 225 && short.pd.waiting === 2 && short.pd.paid === 8 && short.pd.first === 3 && short.allowance === 1800 && fl(short, 'waiting'), '10 days, 9,000: 225 a day; the first two days not paid (s.93(b)): 8 × 225 = 1,800, from day 3 (the Institute\'s example: injury 1.6, paid from 4.6)');
const d11 = run({ days: 11 }); const d12 = run({ days: 12 });
check(d11.pd.paid === 9 && d12.pd.paid === 12 && d12.pd.waiting === 0 && fl(d12, 'waiting_edge'), 'boundary: 11 days -> 9 paid; exactly 12 days ("12 days at least", s.93(b)) -> all 12, with the note on the Institute\'s "more than 12"');
const d0 = run({ days: 0 });
check(d0.ok && d0.pd.paid === 0 && d0.allowance === 0 && !d0.events.some((e) => e.key === 'ia_end'), '0 days of incapacity: no allowance, no allowance-end date');
const self45 = run({ kind: 'self' }); const self12 = run({ kind: 'self', days: 12 }); const self13 = run({ kind: 'self', days: 13 }); const self10 = run({ kind: 'self', days: 10 });
check(self45.pd.selfFirst === 12 && self45.pd.paid === 33 && self45.allowance === 9900 && !fl(self45, 'injury_day'), 'self-employed, 45 days: the first 12 entitled days not paid (s.94(b)(2)): 33 × 300 = 9,900; no employer for the injury day');
check(self12.pd.paid === 0 && self13.pd.paid === 1 && self10.pd.paid === 0 && self10.pd.waiting === 2, 'self-employed: 12 days -> 0, 13 -> 1, 10 -> 0 (8 entitled days, all inside the first 12)');
const long = run({ days: 100 }); const selfLong = run({ kind: 'self', days: 100 });
check(long.pd.paid === 91 && long.pd.over === 9 && long.allowance === 27300 && fl(long, 'over91') && ev(long, 'ia_end') === '2026-06-01', '100 days: at most 13 weeks, 91 days (s.92(b)): 91 × 300 = 27,300; the window ends 1.6.2026 (2.3 + 91)');
check(selfLong.pd.paid === 79 && fl(selfLong, 'over91').he.includes('79'), 'self-employed, 100 days: 91 − 12 = 79 days as the Institute\'s page counts, with the note');
const part = run({ partDays: 10, partHours: 4 }); const part10 = run({ partDays: 10, partHours: 10 });
check(part.partial.perDay === 150 && part.partial.amount === 1500 && part10.partial.hoursUsed === 8 && part10.partial.amount === 3000 && fl(part10, 'partial_hours'), 'reduced allowance (s.102): 300 ÷ 8 × 4 hours = 150 a day × 10 = 1,500; 10 hours count as 8: 3,000');

/* ---------- 4. The ceiling ---------- */
const high = E.compute(reg, U.avPreset('high', '2026-10-22'));
check(high.daily.raw === 1500 && high.daily.daily === 1314.25 && high.daily.capped && high.full === 39428 && high.monthly === 39428 && high.benefit === 'pension' && fl(high, 'capped'), '60,000 a month: 75% of 2,000 = 1,500 > 1,314.25 -> the maximum; 100% temporary = 39,428 a month');
const atCap = run({ wage: '', quarter: 157710 }); const above = run({ wage: '', quarter: 157711 });
check(atCap.daily.daily === 1314.25 && !atCap.daily.capped && atCap.full === 39428 && above.daily.capped && above.daily.daily === 1314.25, 'exactly at the ceiling: 157,710 ÷ 90 × 75% = 1,314.25 (not above); one shekel more is capped; both pay 39,428 for 100%');
check(run({ wage: '', quarter: 36000 }).allowance === 13500 && run({ wage: '', quarter: 36000 }).quarterFromTotal, 'the 3 months\' total 36,000 gives the same 13,500 as 12,000 × 3');

/* ---------- 5. The degree: nothing, a grant or a pension; reg. 15; rounding ---------- */
const deg = (d, stable = true, reg15 = '') => run({ degree: d, stable, reg15 });
check(deg(8).benefit === 'none' && deg(8.99).benefit === 'none' && deg(9).benefit === 'grant' && deg(9).grant === 34830, 'stable 8.99% -> nothing; 9% -> a grant: 810 × 43 = 34,830 (s.104(c))');
check(deg(19.99).benefit === 'grant' && deg(19.99).degree.final === 19.99 && deg(19.99).grant === 77361.3 && deg(20).benefit === 'pension' && deg(20).monthly === 1800, 'stable 19.99% -> a grant, not rounded: 1,799.10 × 43 = 77,361.30; 20% -> a pension of 1,800 (s.104(b)(1))');
check(deg(8.9, false).benefit === 'none' && deg(9.4, false).benefit === 'pension' && deg(9.4, false).degree.final === 10 && deg(9.4, false).monthly === 900 && fl(deg(9.4, false), 'needy'), 'temporary 8.9% -> nothing; 9.4% -> a pension, rounded up to 10% (reg. 19a): 900; the needy-disabled note (reg. 18a)');
check(deg(23.5).degree.final === 24 && deg(23.5).monthly === 2160 && fl(deg(23.5), 'rounded'), 'stable 23.5% -> 24% (reg. 19a): 9,000 × 24% = 2,160');
const r20 = deg(20, true, 50); const r14 = deg(14, true, 50); const r12 = deg(12, true, 50); const r21 = deg(21, true, 25);
check(r20.degree.final === 30 && r20.monthly === 2700 && fl(r20, 'reg15'), 'reg. 15: 20% + half = 30%: 2,700 a month');
check(r14.degree.beforeRound === 19 && r14.degree.capped && r14.benefit === 'grant' && r14.grant === 73530 && fl(r14, 'reg15').level === 'warn', 'reg. 15 under 20%: 14% × 1.5 = 21%, held at 19% (a grant: 1,710 × 43 = 73,530), reg. 15(a)');
check(r12.degree.final === 18 && !r12.degree.capped && r12.grant === 69660 && r21.degree.beforeRound === 26.25 && r21.degree.final === 27 && r21.monthly === 2430, 'reg. 15: 12% × 1.5 = 18% (69,660); 21% × 1.25 = 26.25% -> 27% (reg. 19a): 2,430');
const rTemp = deg(30, false, 50);
check(rTemp.degree.final === 30 && rTemp.degree.share === 0 && fl(rTemp, 'reg15_temp'), 'reg. 15 on a temporary degree: not applied (stable only), with the note');
check(fl(deg(70), 'reg16') && fl(deg(70), 'special') && fl(deg(25), 'certificate') && !fl(deg(60), 'reg16'), '70% stable: reg. 16 (65%+ may become 100%) and s.112; 25%: the certificate (s.126); 60%: no reg. 16');

/* ---------- 6. The increased grant before 21 ---------- */
const young = run({ age: 19, wage: 6000, degree: 12 });
check(young.young.full === 10326.75 && young.young.monthly === 1239.21 && young.grant === 53286.03 && young.young.applies && fl(young, 'young'), 'injured at 19, 6,000, 12%: as if the income were the average wage 13,769: 75% = 10,326.75 for 100%, 12% = 1,239.21, × 43 = 53,286.03 (instead of 4,500 × 12% × 43 = 23,220), s.107(b)');
const young20 = run({ age: 20, wage: 20000, degree: 12 }); const adult = run({ age: 21, wage: 6000, degree: 12 });
check(!young20.young.applies && young20.grant === 77400 && adult.young === null && adult.grant === 23220, 'at 20 with 20,000: the own wage is higher (15,000 × 12% × 43 = 77,400); at 21: no increase (23,220)');

/* ---------- 7. Is it a work accident: the exceptions ---------- */
const way = run({ where: 'way', road: true, days: 30 });
check(way.accident.status === 'yes' && fl(way, 'road') && fl(way, 'road').section === 'סעיף 328א(ב)(2)' && way.accident.circ.section === 'סעיף 80(1)', 'on the way, a road accident: a work accident (s.80(1)) and the road law; the benefit is deducted from the road-law damages (s.328א(ב)(2))');
const dev = run({ where: 'way', issues: ['deviation'] }); const devOk = run({ where: 'way', issues: ['deviation', 'devok'] });
check(dev.accident.status === 'no' && fl(dev, 'deviation').level === 'danger' && devOk.accident.status === 'yes' && fl(devOk, 'deviation_ok'), 'a substantial deviation on the way: not a work accident (s.81(a)); to escort a child or for the morning prayer: not a deviation (s.81(b))');
check(run({ where: 'way', issues: ['gross'], days: 27, degree: '' }).accident.status === 'no' && run({ where: 'way', issues: ['gross'], days: 28, degree: '' }).accident.status === 'yes' && run({ where: 'way', issues: ['gross'], days: 5 }).accident.status === 'yes', 'gross negligence on the way: 27 days -> excluded; 28 days (4 weeks), or a disability (15%) -> not excluded (s.81(a))');
check(run({ issues: ['breach'], days: 9, degree: '' }).accident.status === 'no' && run({ issues: ['breach'], days: 10, degree: '' }).accident.status === 'yes' && run({ issues: ['breach'], days: 5, degree: 10 }).accident.status === 'yes', 'negligence against instructions: 9 days -> excluded; 10 days, or a disability -> not excluded (s.82)');
check(run({ kind: 'self', issues: ['unregistered'] }).accident.status === 'no' && run({ issues: ['unregistered'] }).accident.status === 'yes' && run({ kind: 'self', where: 'break' }).accident.status === 'check', 'self-employed not registered: no benefit (s.77(a)); the flag means nothing for an employee; the meal-break presumption is for an employee (check)');

/* ---------- 8. Deadlines on rest days, appeals, rejections, a late claim ---------- */
check(ev(run({ decision: '2026-10-08' }), 'arar') === '2026-11-08', 'appeal: 8.10.2026 + 30 = Saturday 7.11.2026 -> Sunday 8.11.2026 (Interpretation Law s.10(c))');
check(ev(run({ decision: '2026-10-05', appealDecision: '2027-08-03' }), 'court') === '2027-10-04', 'the labor court on the appeals committee: 3.8.2027 + 60 = 2.10.2027, Rosh Hashana (2-3.10) -> 4.10.2027');
const rej = run({ rejection: '2026-10-22' });
check(ev(rej, 'claims_committee') === '2027-04-23' && ev(rej, 'labor_court') === '2027-10-22', 'a rejection on 22.10.2026: the claims committee by 22.4.2027, the first day of Passover -> 23.4.2027; the labor court by 22.10.2027');
const p20 = run({ degree: 20 });
check(ev(p20, 'reg17_from') === '2027-10-05' && ev(p20, 'reg17_to') === '2031-10-05' && !ev(ex, 'reg17_from'), 'a stable 20%: the reg. 17 window from 5.10.2027 to 5.10.2031 (12 to 60 months); none for a grant');
const late = run({ claimDate: '2027-05-01' });
check(fl(late, 'late') && fl(late, 'late').he.includes('1,350') && !fl(run({ claimDate: '2027-03-02' }), 'late'), 'a disability claim on 1.5.2027, after 2.3.2027: the late-claim note (s.296(b)(1)), and the grant falls by one monthly pension, 1,350, a month (s.107(a)); on 2.3.2027 it is on time');
const tmp = run({ degree: 30, stable: false, tempTo: '2027-04-30' });
check(ev(tmp, 'temp_end') === '2027-04-30' && fl(tmp, 'temporary'), 'a temporary degree to 30.4.2027: its end is on the calendar; up to a year ahead (s.119)');
check(fl(run({ injury: '2025-11-01' }), 'old_year') && !fl(ex, 'old_year'), 'an injury before 1.1.2026: the note that the figures are 2026\'s (s.110)');

/* ---------- 9. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ injury: '' }, 'injury') && err({ injury: '31.2.2026' }, 'injury'), 'error: an empty or impossible injury date');
check(err({ days: -1 }, 'days') && err({ days: 1.5 }, 'days') && err({ wage: -5 }, 'wage') && err({ quarter: 0 }, 'quarter'), 'error: negative or fractional days, a negative wage, a zero quarter');
check(err({ degree: 101 }, 'degree') && err({ reg15: 60 }, 'reg15') && err({ age: 12 }, 'age') && err({ partDays: 5, partHours: '' }, 'partHours'), 'error: degree over 100, reg. 15 over half, age 12, partial days without hours');
check(err({ decision: '2026-01-01' }, 'decision') && err({ appealDecision: '2026-09-01' }, 'appealDecision') && err({ claimDate: '2025-01-01' }, 'claimDate'), 'error: a decision before the injury, an appeals decision before the decision, a claim before the injury');
const noWage = run({ wage: '' });
check(noWage.ok && noWage.allowance === null && noWage.grant === null && noWage.pd.paid === 45 && ev(noWage, 'claim') === '2027-03-02' && !bad(U.renderResult(reg, noWage)) && !bad(U.leadCard(reg, noWage)) && !bad(U.renderDetails(reg, noWage)), 'no wage: the days and the dates still come, no amount, nothing "null" rendered');

/* ---------- 10. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.total === 13500 && s.result.includes('13,500') && s.result.includes('58,050') && s.sentence.includes('2.3.2026') && s.sticky.includes('13,500'), 'snapshot: the example figures (13,500, 58,050, 2.3.2026)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><span class="jtool-amt"><bdi>13,500<\/bdi> ₪<\/span><\/strong>/.test(s.lead) && s.lead.includes('58,050') && s.lead.includes('2.3.2027') && s.lead.includes('data-lead-go'), 'lead card: the example figure 13,500, the grant, the claim date, the jump to the form');
check((s.form.match(/data-preset=/g) || []).length === 5 && (s.form.match(/aria-pressed="true"/g) || []).length === 1 && s.form.includes('data-preset="m1" aria-pressed="true"'), 'form: 5 one-click profiles, the example pressed');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 12 && s.compare_table.includes('58,050') && s.compare_table.includes('39,428') && s.method.includes('jtool-cite'), 'page table: header + 11 degree rows with a caption, the example grant and the ceiling; the method cites');
check(s.result.includes('jt61-axis') && s.result.includes('jtool-visually-hidden') && s.result.includes('jt61-seg--paid') && s.result.includes('jt61-gauge__cap') && s.result.includes('jt61-step--grant'), 'the picture: the time axis with a text equivalent, the paid band, the ceiling lines, the grant step');
const lg = U.ledger(reg, ex);
check(lg.length === 3 && lg[0].kind === 'day0' && lg[1].kind === 'paid' && lg[1].amount === 13500 && lg[2].kind === 'rest' && lg[2].days === 46, 'the ledger: the injury day, 45 paid days (13,500), 46 unused days to day 91');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('13,500') && br.includes('58,050') && br.includes('15%') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול'), `aiBrief: ${words} words, the key figures, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('data-act="rehearse"') && s.result.includes('purpose=witness_prep') && s.result.includes('topic=personal-injury') && handoffState('x', br, 'witness_prep').simulationPurpose === 'witness_prep', 'the brief under its h4 with the rehearse link (witness_prep: the medical committee; personal-injury)');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url.startsWith('https://www.btl.gov.il/') && na.official.every((x) => /^https:\/\/www\.(btl\.)?gov\.il\//.test(x.url)) && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => /^\/[a-z0-9-]+\/(#s=[0-9A-Za-z._~/-]+)?$/.test(x.path)), 'next actions: the official routes first (the appeal by 4.11.2026), then 2-4 internal links');
const icsText = ics(rej.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20270423') && icsText.includes('DTSTART;VALUE=DATE:20271022') && icsText.includes('DTSTART;VALUE=DATE:20270302') && (icsText.match(/BEGIN:VEVENT/g) || []).length === rej.events.length, 'ics: the computed dates (23.4.2027, 22.10.2027, 2.3.2027), one event each');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('58,050') && s.details.includes('jt61-print'), 'print summary: result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && ['1.2.2002', '1.6.2003', '1.1.2005', '1.4.2005', '1.1.2006', '1.1.2026'].every((d) => s.details.includes(d)), 'what changed and when: the dated official rows (13 weeks, 43 pensions, 9%, 12 days, the cap formula, 2026)');

/* ---------- 11. Share state and the cross-tool links ---------- */
const full = Object.assign({}, EX, { kind: 'self', age: 19, quarter: 40000, partDays: 3, partHours: 4, where: 'way', road: true, issues: ['deviation', 'devok'], degree: 23.5, stable: false, reg15: 0, tempTo: '2027-04-30', appealDecision: '2027-01-10', rejection: '2026-09-01', claimDate: '2026-12-01' });
const st = U.stateOf(full);
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.kind === 'self' && back.age === 19 && back.quarter === 40000 && back.where === 'way' && back.road === true && back.issues.join() === 'deviation,devok' && back.degree === 23.5 && back.stable === false && back.tempTo === '2027-04-30' && back.rejection === '2026-09-01' && JSON.stringify(E.compute(reg, back).events) === JSON.stringify(E.compute(reg, full).events), 'share state: stateOf -> decodeState -> inputOf round trip, same result');
check(!/[א-ת]/.test(st) && !st.includes('@'), 'share state: no Hebrew, no free text');
const link = U.stateLink(reg, EX);
const back2 = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/work-accident-guide/#s=') && back2.injury === '2026-03-02' && back2.wage === 12000 && back2.degree === 15 && E.compute(reg, back2).grant === 58050, `stateLink: ${link}, a round trip through decodeState + inputOf gives the same 58,050`);
const partial = U.inputOf(decodeState('s=d23.5/sp', U.KEYS), U.avPreset('m1', '2026-10-22'));
check(partial.degree === 23.5 && partial.stable === true && partial.wage === 12000 && E.compute(reg, partial).monthly === 2160 && U.inputOf(decodeState('s=d23.5', U.KEYS)) === null, 'a sibling\'s partial state (only the degree) merges onto a base profile: 24% = 2,160; without a base and an injury date: nothing');
const fromRoad = U.inputOf(decodeState('s=kw/t2026-05-01/a40/w9000/ly/r1', U.KEYS), U.avPreset('m1', '2026-10-22'));
check(fromRoad.injury === '2026-05-01' && fromRoad.wage === 9000 && fromRoad.where === 'way' && fromRoad.road && fromRoad.age === 40 && fromRoad.days === 45 && fromRoad.degree === '' && fromRoad.decision === '' && fromRoad.filled.join() === 'days', 'the road tool’s link (k w, t, a, w, l y, r 1 as teuna-ui.js builds it): only the days come from the example (named in filled); no example degree or decision leaks in');
const ownNoWage = U.inputOf(decodeState(U.stateOf(Object.assign({}, EX, { wage: '', degree: '', decision: '' })), U.KEYS));
check(ownNoWage.wage === '' && ownNoWage.degree === '' && ownNoWage.decision === '' && ownNoWage.filled.length === 0, 'the reader’s own link without a wage or a degree reloads without them (nothing from the example)');
check(U.roadLink(reg, way) === `/israel-road-accident-compensation-law/#s=t${way.injury}/w1/c12000/d15` && U.roadLink(reg, run({ road: true, degree: 20, stable: false })).endsWith('/w1/c12000') && U.roadLink(reg, run({ road: true, age: 40, degree: 20 })).endsWith('/w1/c12000/a40/d20') && U.roadLink(reg, run({ road: true, degree: 20, reg15: 50 })).endsWith('/d20'), 'the road-law link carries the date, the work flag, the income, the age and the degree by the criteria (before reg. 15), never a name');
check(U.weighLink(reg, ex) === '/regulations-insurance-1956/#s=ks/if_15_r___/d300/j2026-03-02/v2026-10-05' && U.weighLink(reg, r20).includes('/rx/x50/') && U.weighLink(reg, short) === '/regulations-insurance-1956/', 'the weighting-tool link carries the degree as one free item, reg. 15 as a custom share, the daily allowance, the injury and decision days; no degree, no state');
for (const r of [short, self45, long, high, part, young, way, dev, r14, rTemp, tmp, late, rej, d0]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r) + U.leadCard(reg, r) + U.aiBrief(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.avBand(r)})`);
}
/* ---------- PR 170 review: reduced days and the unpaid days of ss.93(ב) and 94(ב)(2) ---------- */
const ponly = run({ days: 0, partDays: 10, partHours: 8 });
check(ponly.partial.amount === 3000 && ponly.partial.unclear === 2 && ponly.partial.waitLeft === 2 && ponly.partial.low === 2400 && fl(ponly, 'partial_waiting'), 'employee, only 10 reduced days of 8 hours: 300 × 10 = 3,000, or 2,400 if the 2 waiting days of s.93(ב) fall on them (10 < 12): shown as a range with the note');
const pself = run({ kind: 'self', days: 0, partDays: 10, partHours: 8 });
check(pself.partial.unclear === 10 && pself.partial.selfLeft === 12 && pself.partial.low === 0 && pself.partial.amount === 3000 && fl(pself, 'partial_waiting').he.includes('על אף הוראות סעיף 92'), 'self-employed, only 10 reduced days: the 12 first days of s.94(ב)(2) may cover all of them: 0 to 3,000, never 3,000 alone');
const pafter = run({ days: 20, partDays: 10, partHours: 4 });
check(pafter.partial.unclear === 0 && pafter.partial.low === pafter.partial.amount && !fl(pafter, 'partial_waiting'), 'employee with 20 full days then 10 reduced: the waiting days do not apply (20 >= 12), one figure, no range');
const prange = U.renderResult(reg, ponly);
check(prange.includes('2,400') && prange.includes('3,000') && !bad(prange), 'the result shows the reduced-allowance range 2,400 to 3,000');

const errHtml = U.renderResult(reg, run({ injury: '' })) + U.leadCard(reg, run({ injury: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml) && E.avBand(run({ injury: '' })) === 'error', 'an input error renders the message, never a raw value');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
