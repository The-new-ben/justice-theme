/**
 * Golden tests for the unemployment-benefit instrument (dmei-avtala, the rights wave, 21.10.2026).
 * Run: node tests/js/test-rights-avtala.mjs
 *
 * By hand, from the National Insurance Law chapter 7 and the Institute's pages (rights_avtala, rights_btl):
 * the daily wage is the six months' income / 150 (s.170(א)); schedule 7 takes 80/50/45/30% (under 28: 60/40/35/25%) of
 * the parts up to 207.50, 311.25, 415 and 2,075 (half, three quarters, one and five times the basic daily 415); the
 * ceiling is 550.76 (13,769 / 25) for 125 payment days and 367.17 (two thirds) after (s.167(ב)); the days by age and
 * dependents (s.171(א)); 5 waiting days in every 4 months (s.172); 90 days after a resignation (s.166(ב)).
 * The example: 12,000 a month at 35 with 2 dependents, fired on 15.10.2026, registered 18.10.2026:
 * 72,000 / 150 = 480; 207.5 x 80% = 166 + 103.75 x 50% = 51.875 + 103.75 x 45% = 46.6875 + 65 x 30% = 19.5
 * = 284.0625 -> 284.06 a day; 138 days (s.171(א)(1א)); 284.06 x 25 = 7,101.50 a month; 284.06 x 138 = 39,200.28.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as AE from '../../assets/js/tools/avtala-engine.js';
import * as AUI from '../../assets/js/tools/avtala-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const av = reg.rights_avtala;
const btl = reg.rights_btl;
const EX = AUI.EXAMPLE;
const run = (over) => AE.compute(reg, Object.assign({}, EX, over));
const near = (a, b) => Math.abs(a - b) < 0.005;

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
const paths = [
	'age.min', 'age.max', 'age.section', 'qualify.months', 'qualify.window_months', 'qualify.section', 'qualify.late_months', 'base.months', 'base.divisor', 'base.section',
	'rates.basic_daily', 'rates.young_under', 'rates.tiers', 'cap.first_days', 'cap.first', 'cap.after', 'cap.section', 'month.table_days', 'days.bands', 'days.dependents_many',
	'days.window_months', 'women.days', 'women.from_age', 'women.upper_age', 'women.window_months', 'women.cap', 'women.cap_from_day', 'waiting.days', 'waiting.every_months',
	'waiting.section', 'resign.wait_days', 'resign.section', 'leave.min_days', 'repeat.under_age', 'repeat.days_pct', 'repeat.cap_first', 'repeat.section', 'pay.day_of_month',
	'register.office_days', 'claim.form', 'claim.deadline_months', 'claim.employer_form',
];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
check(paths.every((p) => get(av, p) !== undefined && get(av, p) !== null), `registry: every figure the engine reads exists (${paths.filter((p) => get(av, p) === undefined).join(', ') || 'all'})`);
const urls = [];
JSON.stringify(av, (k, v) => { if (typeof v === 'string' && /^https?:/.test(v)) { urls.push(v); } return v; });
check(av.source_url.startsWith('https://www.btl.gov.il/') && av.law_url.startsWith('https://www.btl.gov.il/Laws1/') && urls.length >= 25 && urls.every((u) => /^https:\/\/(www\.btl\.gov\.il|forms\.btl\.gov\.il|govforms\.gov\.il|www\.gov\.il|www\.taasuka\.gov\.il)\//.test(u)), `registry: every url is an official https source (${urls.length} urls)`);
check(['age', 'qualify', 'base', 'rates', 'cap', 'month', 'days', 'women', 'waiting', 'resign', 'leave', 'refuse', 'repeat', 'pay', 'register', 'claim'].every((k) => typeof av[k].url === 'string' && av[k].url.startsWith('https://')), 'registry: every rule block carries its own source url');
check(av.checked_on === '2026-10-21' && av.from === '2026-01-01' && av.next_update === '2027-01-01' && av.refresh_every_days === 365, 'registry: checked 21.10.2026, figures from 1.1.2026, next update 1.1.2027');
check(av.age.min === 20 && av.age.max === 67 && av.qualify.months === 12 && av.qualify.window_months === 18 && av.base.months === 6 && av.base.divisor === 150, 'registry: age 20 to 67 (s.160(א)), 12 of 18 months (s.161(א)), 6 months / 150 (s.170(א))');
check(av.rates.basic_daily === 415 && av.rates.tiers.map((t) => `${t.upto}:${t.pct}/${t.pct_young}`).join(',') === '0.5:80/60,0.75:50/40,1:45/35,5:30/25', 'registry: schedule 7, basic daily 415, tiers 80/50/45/30 and under 28 60/40/35/25');
check(near(btl.avg_wage.s2_benefits / av.cap.wage_divisor, av.cap.first) && near(Math.round(av.cap.first * 2 / 3 * 100) / 100, av.cap.after) && av.cap.first_days === 125, 'ceiling: 13,769 / 25 = 550.76 (s.167(ב)), two thirds 367.17 from day 126, consistent with rights_btl');
check(near(Math.round(btl.avg_wage.s2_benefits * av.women.cap_pct_of_avg) / 100, av.women.cap) && near(Math.round(av.cap.first * av.repeat.cap_pct) / 100, av.repeat.cap_first) && Math.floor(btl.avg_wage.s2_benefits * 0.57) === av.days.dependent_income_max, 'derived figures: 1.46% x 13,769 = 201.03 (s.167(ג)); 85% x 550.76 = 468.15 (s.171א); 57% x 13,769 = 7,848 (the dependants page)');
check(av.days.bands.map((b) => `${b.from}-${b.to}:${b.few}/${b.many}`).join(',') === '20-25:50/138,25-28:67/138,28-35:100/138,35-45:138/175,45-67:175/175' && av.women.days === 300 && av.women.window_months === 18, 'registry: the maximum-days table of s.171(א) and the 300 days in 18 months for women born from 1960');
check(Object.keys(av.month.workdays_2026).length === 12 && av.month.workdays_2026['2026-02'] === 24 && av.month.workdays_2026['2026-12'] === 27 && av.month.table_days === 25, 'registry: the Institute\'s possible working days of 2026, and the 25-day monthly table');

/* ---------- 2. Schedule 7 against the Institute's own 2026 table (sum.aspx), row by row ---------- */
const table28 = { 3000: 96, 4000: 128, 5000: 160, 6000: 182.25, 7000: 202.25, 8000: 221.81, 9000: 239.81, 10000: 257.81, 11000: 272.06, 12000: 284.06, 15000: 320.06, 20000: 380.06, 25000: 440.06, 33000: 536.06, 34225: 550.76 };
const tableYoung = { 3000: 72, 6000: 137.5, 7000: 153.5, 8000: 169.06, 10000: 197.06, 12000: 218.56, 20000: 298.56, 30000: 398.56, 44000: 538.56, 45220: 550.76 };
const miss28 = Object.entries(table28).filter(([w, d]) => !near(run({ wage: Number(w), age: 30 }).benefit1, d));
const missYoung = Object.entries(tableYoung).filter(([w, d]) => !near(run({ wage: Number(w), age: 26 }).benefit1, d));
check(!miss28.length, `the Institute's 2026 table, 28 and over: 15 rows from 3,000 (96) to 34,225 (550.76) match${miss28.length ? `; off: ${miss28.map((x) => x[0]).join(', ')}` : ''}`);
check(!missYoung.length, `the Institute's 2026 table, under 28: 10 rows from 3,000 (72) to 45,220 (550.76) match${missYoung.length ? `; off: ${missYoung.map((x) => x[0]).join(', ')}` : ''}`);
check(near(run({ wage: 10000 }).benefit1, 257.81) && near(AE.dailyBenefit(av, 400, 30).raw, 257.81), 'the calculation page\'s example, a daily wage of 400 with the 2026 basic amount 415: 166 + 51.875 + 39.9375 = 257.8125 -> 257.81');

/* ---------- 3. The example ---------- */
const ex = AE.compute(reg, EX);
check(ex.ok && ex.eligible && ex.status === 'ok' && ex.gates.every((g) => g.ok), 'example: eligible, every gate passes');
check(ex.base.total === 72000 && ex.base.avg === 480, 'example: 12,000 x 6 = 72,000; / 150 = 480 a day (s.170(א))');
check(ex.ben.tiers.map((t) => `${t.part}x${t.pct}=${t.amount}`).join(' ') === '207.5x80=166 103.75x50=51.88 103.75x45=46.69 65x30=19.5' && ex.ben.raw === 284.06, 'example tiers: 207.5 x 80% = 166; 103.75 x 50% = 51.88; 103.75 x 45% = 46.69; 65 x 30% = 19.50; 284.0625 -> 284.06');
check(ex.benefit1 === 284.06 && ex.benefit2 === 284.06 && !ex.capped && ex.capFirst === 550.76, 'example: under both ceilings (550.76 and 367.17)');
check(ex.maxDays === 138 && ex.daysSection === 'סעיף 171(א)(1א)', 'example: 35 with 2 dependents -> 138 days (s.171(א)(1א))');
check(ex.monthly === 7101.5 && ex.total === 39200.28 && ex.paid === 138, 'example: 284.06 x 25 = 7,101.50 a month; 284.06 x 138 = 39,200.28');
check(ex.firstPaid === '2026-10-23' && ex.waitingCount === 10 && ex.holdCount === 0, 'example: 18-22.10.2026 (Sunday to Thursday) are the 5 waiting days; first paid day Friday 23.10.2026; 5 more on 1-5.2.2027, the second 4-month period (s.172): 10 waiting days');
check(ex.rows.map((r) => `${r.key}:${r.paid}`).join(' ') === '2026-10:7 2026-11:26 2026-12:27 2027-01:26 2027-02:19 2027-03:27 2027-04:6', 'example ledger: 7 + 26 + 27 + 26 + 19 + 27 + 6 = 138 paid days, Saturdays never paid');
check(ex.rows[0].amount === 1988.42 && ex.rows[1].amount === 7385.56 && ex.rows[0].payDate === '2026-11-12', 'example: October 7 x 284.06 = 1,988.42 paid on 12.11.2026; November 26 x 284.06 = 7,385.56');
check(ex.lastPaid === '2027-04-07' && ex.firstPay === '2026-11-12' && ex.lastPay === '2027-05-12' && ex.stepDay === '2027-03-24', 'example: last paid day 7.4.2027, payments 12.11.2026 to 12.5.2027; day 126 is 24.3.2027');
check(ex.deadlines.map((d) => `${d.key}:${d.date}`).join(' ') === 'reg:2026-10-18 office:2026-11-01 first_pay:2026-11-12 last_day:2027-04-07 last_pay:2027-05-12 claim:2027-10-18', 'example dates: registration, the office within 14 days (1.11.2026), the payments, the claim within 12 months (18.10.2027); no ceiling step, the amount is below 367.17');
check(ex.flags.map((f) => f.code).join(',') === 'notice,next_year', 'example flags: notice pay delays, and the 2027 months use the 2026 figures');
check(AE.baseMonths('2026-10-18').join(',') === '2026-04,2026-05,2026-06,2026-07,2026-08,2026-09' && AE.monthHe('2026-04') === 'אפריל 2026', 'the base months: April to September 2026 for a registration in October');

/* ---------- 4. The ceiling, exactly at and one shekel above ---------- */
const c1 = run({ wage: 34224 });
const c2 = run({ wage: 34225 });
const c3 = run({ wage: 34226 });
check(c1.ben.raw === 550.75 && !c1.capped && c2.ben.raw === 550.76 && c2.benefit1 === 550.76 && !c2.capped && c3.ben.raw === 550.77 && c3.benefit1 === 550.76 && c3.capped, 'first ceiling: 34,224 -> 1,368.96 a day -> 550.75; 34,225 -> 1,369 -> 264.5625 + 953.99... -> 550.76 exactly at; 34,226 -> 550.77, paid 550.76');
const s1 = run({ wage: 18926, age: 45 });
const s2 = run({ wage: 18927, age: 45 });
check(s1.benefit2 === 367.17 && s1.ben.raw === 367.17 && s2.ben.raw === 367.19 && s2.benefit2 === 367.17 && s2.total === 64257.25, 'second ceiling at 45 (175 days): 18,926 -> 757.04 -> 367.17 at; 18,927 -> 367.19, from day 126 367.17: 125 x 367.19 + 50 x 367.17 = 64,257.25');
check(c3.flags.some((f) => f.code === 'capped') && c3.flags.some((f) => f.code === 'step') && !c2.flags.some((f) => f.code === 'capped') && !run({ wage: 34226, age: 30 }).flags.some((f) => f.code === 'step') && !ex.flags.some((f) => f.code === 'step'), 'the capped flag above the ceiling; the step flag only when the days run past 125 (138 at 35, not 100 at 30) and the amount is above 367.17');
const hi = run({ wage: 40000, age: 45 });
check(hi.benefit1 === 550.76 && hi.benefit2 === 367.17 && hi.total === 87203.5 && hi.deadlines.some((d) => d.key === 'step'), 'high wage at 45: 125 x 550.76 + 50 x 367.17 = 68,845 + 18,358.50 = 87,203.50, with the step date');

/* ---------- 5. Under 28 ---------- */
const y25 = run({ age: 25, wage: 8000 });
check(y25.ben.young && y25.ben.raw === 169.06 && y25.maxDays === 67 && y25.total === 11327.02 && y25.daysSection === 'סעיף 171(א)(2א)', 'age 25, 8,000: 320 a day: 124.5 + 41.5 + 3.0625 = 169.06 (60/40/35%); 67 days (s.171(א)(2א)); 67 x 169.06 = 11,327.02');
check(run({ age: 24 }).maxDays === 50 && run({ age: 27, deps: 3 }).maxDays === 138 && run({ age: 28 }).maxDays === 100 && !run({ age: 28 }).ben.young && run({ age: 34, deps: 3 }).maxDays === 138, 'days: 24 -> 50 (s.171(א)(2ב)); 27 with 3 dependents -> 138; 28 -> 100 at the full rates; 34 with 3 -> 138');

/* ---------- 6. Age 45 and over with 3 dependents ---------- */
const a47 = run({ age: 47, deps: 3 });
check(a47.maxDays === 175 && a47.daysSection === 'סעיף 171(א)(1)' && a47.total === 49710.5 && a47.lastPaid === '2027-05-20' && a47.lastPay === '2027-06-12', 'age 47, 3 dependents: 175 days (s.171(א)(1)); 175 x 284.06 = 49,710.50; 158 days by the end of April, 17 more to Thursday 20.5.2027, paid 12.6.2027');
check(run({ age: 35, deps: 3 }).maxDays === 175 && run({ age: 44, deps: 2 }).maxDays === 138 && run({ age: 66 }).maxDays === 175, 'days: 35 with 3 -> 175; 44 with 2 -> 138; 66 -> 175');

/* ---------- 7. A resignation without a recognised reason: 90 days ---------- */
const rs = run({ ending: 'resign' });
check(rs.ok && rs.eligible && rs.status === 'wait' && rs.entitledFrom === '2027-01-14' && rs.firstPaid === '2027-01-14', 'resigned: 15.10.2026 + 91 = 14.1.2027, the first day after 90 days (s.166(ב))');
check(rs.holdCount === 71 && rs.waitingCount === 15 && rs.lastPaid === '2027-07-05' && rs.total === 39200.28 && rs.rows[0].paid === 0 && rs.rows[3].paid === 15, 'resigned: 71 held days, 15 waiting days (Oct, 1-5.2, 1-6.6.2027), January 15 paid days, last 5.7.2027, the same 39,200.28');
check(rs.flags.some((f) => f.code === 'wait90') && rs.deadlines.some((d) => d.key === 'entitled' && d.date === '2027-01-14') && AUI.verdictSentence(reg, rs).includes('14.1.2027'), 'resigned: the 90-day flag, the date in the table and in the sentence');
check(run({ ending: 'resign_ok' }).status === 'ok' && run({ ending: 'resign_ok' }).firstPaid === '2026-10-23' && run({ ending: 'contract' }).status === 'ok', 'a recognised reason or the end of a contract: from the registration day');

/* ---------- 8. A short salary history and the qualifying period ---------- */
const sh = run({ months: 11 });
check(sh.ok && !sh.eligible && sh.status === 'no' && sh.maxDays === 0 && sh.total === 0 && !sh.gates.find((g) => g.key === 'qualify').ok && sh.flags[0].code === 'qualify' && sh.flags[0].he.includes('חסרים 1'), '11 of 18 months: no qualifying period (s.161(א)), one month short, nothing paid');
check(run({ months: 12 }).eligible && run({ months: 0 }).ok && !run({ months: 0 }).eligible, '12 months is enough; 0 computes and says no');
check(AUI.renderResult(reg, sh).includes('jtool-state--danger') && AUI.verdictSentence(reg, sh).startsWith('אין זכאות לדמי אבטלה כרגע.') && !AUI.renderResult(reg, sh).includes(`${'jt31'}-led`), 'not eligible: the danger pill, the sentence, no ledger');

/* ---------- 9. One month far above the others ---------- */
const sp = run({ wageMode: 'each', wages: [12000, 12000, 12000, 12000, 12000, 30000] });
check(sp.base.total === 90000 && sp.base.avg === 600 && sp.ben.raw === 320.06 && sp.monthly === 8001.5 && sp.flags.some((f) => f.code === 'spike'), 'a 30,000 month among 12,000s: 90,000 / 150 = 600; 264.5625 + 185 x 30% = 320.06; 8,001.50 a month; the spike note');
check(!run({ wageMode: 'each', wages: [12000, 12500, 11800, 12000, 12200, 13000] }).flags.some((f) => f.code === 'spike'), 'ordinary variation is not flagged');

/* ---------- 10. Women born from 1960, repeat claims, the gate ---------- */
const w58 = run({ age: 58, women: true, wage: 30000 });
check(w58.maxDays === 300 && w58.windowEnd === '2028-03-31' && w58.benefit1 === 500.06 && w58.benefit3 === 201.03 && w58.total === 105994.75 && w58.womenStepDay === '2027-05-21', 'woman 58 born from 1960, 30,000: 300 days in 18 months (s.171(א)(1ג)); 125 x 500.06 + 50 x 367.17 + 125 x 201.03 = 105,994.75; day 176 on 21.5.2027 (s.167(ג))');
check(run({ age: 61, women: true }).maxDays === 300 && run({ age: 61, women: true }).benefit3 === null && run({ age: 58, women: false }).maxDays === 175 && run({ age: 56, women: true }).maxDays === 175, 'woman 61: 300 days, no 201.03 cap (s.171(א)(1ב)); without the 1960 mark or at 56: the table');
const rp = run({ deps: 3, repeat: true, wage: 40000 });
check(rp.repeatUnder && rp.maxDays === 140 && rp.benefit1 === 468.15 && rp.total === 64026.3 && rp.flags.some((f) => f.code === 'repeat'), 'repeat claim under 40, 175 days: 80% = 140; 125 x 468.15 + 15 x 367.17 = 64,026.30 (s.171א)');
check(run({ repeat: true }).maxDays === 110 && run({ age: 45, repeat: true }).maxDays === 175 && run({ age: 45, repeat: true }).flags.some((f) => f.code === 'repeat_over'), 'repeat under 40 with 138 days: 110 (80% = 110.4, not more); at 45 no cut, the 11-month note');
check(!run({ age: 67 }).eligible && run({ age: 67 }).flags.some((f) => f.code === 'over67') && !run({ age: 19 }).eligible && run({ age: 19 }).flags.some((f) => f.code === 'under20') && run({ age: 20 }).eligible && run({ age: 66 }).eligible, 'age: 19 and 67 not eligible (s.160), 20 and 66 eligible');
check(!run({ ending: 'leave_own' }).eligible && !run({ ending: 'leave_short' }).eligible && run({ ending: 'leave' }).eligible && run({ ending: 'leave' }).flags.some((f) => f.code === 'vacation'), 'unpaid leave: only at the employer\'s initiative and 30 days or more; the vacation-days note');
check(run({ stop: '2026-06-15' }).flags.some((f) => f.code === 'late') && !run({ stop: '2026-07-02' }).flags.some((f) => f.code === 'late'), 'late registration: more than 3 months from 15.6.2026 to 1.10.2026 is flagged; 2.7.2026 is not');
const tight = JSON.parse(JSON.stringify(reg));
tight.rights_avtala.days.window_months = 3;
const tw = AE.compute(tight, EX);
check(tw.unused > 0 && tw.paid + tw.unused === 138 && tw.lastPaid <= '2026-12-31' && tw.flags.some((f) => f.code === 'window'), 'a window that ends first: the unused days are counted and flagged');
const mw = run({ wage: 3000 });
check(mw.flags.some((f) => f.code === 'floor') && !ex.flags.some((f) => f.code === 'floor'), 'below the daily minimum wage (257.75): the s.170(ו) note');

/* ---------- 11. Input errors ---------- */
const errs = (over) => { const r = run(over); return r.ok ? '' : r.errors.map((e) => e.field).join(','); };
check(errs({ age: 'abc' }) === 'age' && errs({ age: 15 }) === 'age' && errs({ age: 91 }) === 'age' && errs({ age: 35.5 }) === 'age' && errs({ age: '' }) === 'age', 'age: a whole number 16 to 90');
check(errs({ deps: -1 }) === 'deps' && errs({ deps: 1.5 }) === 'deps' && errs({ ending: 'x' }) === 'ending', 'dependents and the ending');
check(errs({ stop: '31.2.2026' }) === 'stop' && errs({ reg: '' }) === 'reg' && errs({ reg: '2026-10-10' }) === 'reg' && errs({ stop: '2024-01-01' }) === 'reg', 'dates: a real date, registration not before the stop, not two years after');
check(errs({ months: 19 }) === 'months' && errs({ months: 1.5 }) === 'months' && errs({ months: '' }) === 'months', 'months: 0 to 18, whole');
check(errs({ wage: 0 }) === 'wage' && errs({ wage: '' }) === 'wage' && errs({ wageMode: 'each', wages: [1, 2, 3, '', 5, 6] }) === 'w3' && errs({ wageMode: 'each', wages: [] }) === 'w0,w1,w2,w3,w4,w5', 'wages: a positive amount, every month in the six-month mode');
check(errs({ age: 'x', months: 30, wage: -5 }) === 'age,months,wage', 'every error reported at once, with its field');
check(AUI.renderResult(reg, run({ age: 'x' })).includes('צריך לתקן את הקלט') && AUI.renderDetails(reg, run({ age: 'x' })) === '', 'the error state renders, details stay empty');

/* ---------- 12. The snapshot ---------- */
const snap = AUI.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'dmei-avtala' && snap.registry_version === reg.registry_version && snap.total === 284.06 && snap.sticky.includes('284.06') && snap.sentence === AUI.verdictSentence(reg, ex) && JSON.stringify(snap.input) === JSON.stringify(EX), 'snapshot: tool id, registry version, total 284.06, the sticky, the sentence, the input');
check(snap.form.includes('value="35"') && snap.form.includes('name="jt31-dep" value="2" checked') && snap.form.includes('value="fired" checked') && snap.form.includes('value="15.10.2026"') && snap.form.includes('value="18.10.2026"') && snap.form.includes('value="18"') && snap.form.includes('value="12,000"') && snap.form.includes('value="same" checked'), 'the form is pre-filled with the example');
check(snap.result.includes('דוגמה מחושבת') && snap.result.includes('284.06') && snap.result.includes('7,101.50') && snap.result.includes('39,200.28') && snap.result.includes('12.5.2027') && snap.result.includes('138'), 'the result: the example label, 284.06, 7,101.50, 39,200.28, 138 days, the last payment');
const led = snap.result.split('jt31-led__legend')[0];
check(snap.result.includes('jt31-ch__svg') && snap.result.includes('role="img"') && (led.match(/class="jt31-led__row"/g) || []).length === 7 && (led.match(/jt31-c--wait/g) || []).length === 10 && (led.match(/jt31-c--first/g) || []).length === 1 && (led.match(/jt31-c--last/g) || []).length === 1 && (led.match(/jt31-c--step/g) || []).length === 1, 'the picture: the ceiling chart, a ledger of 7 months with 10 waiting cells, the first, the day-126 and the last day');
check(snap.details.includes('480') && snap.details.includes('207.50 × 80%') && snap.details.includes('data-act="ics"') && snap.details.includes('data-act="copy-list"') && snap.details.includes('טופס 1500') && snap.details.includes('טופס 100') && snap.details.includes(av.register.taasuka_url) && snap.details.includes(av.claim.form_url), 'the details: the daily wage, the tiers, the .ics and checklist buttons, forms 1500 and 100, the Employment Service and the online claim');
check(snap.method.startsWith('<ol>') && ['סעיף 160(א)', 'סעיף 161(א)', 'סעיף 170(א)', 'לוח ז&#39;', 'סעיף 167(א)', 'סעיף 167(ב)', 'סעיף 171(א)(1א)', 'סעיף 172'].every((s) => snap.method.includes(s)) && snap.method.includes('72,000 ÷ 150 = 480.00') && snap.method.includes('284.06 × 138 = 39,200.28') && snap.method.includes(av.law_url) && snap.method.includes(av.schedules_url), 'the method: every section on the path, the arithmetic, the law and the schedules');
check(snap.compare_table.includes('<caption>') && (snap.compare_table.match(/<caption>/g) || []).length === 2 && ['50 ימים', '67 ימים', '100 ימים', '138 ימים', '175 ימים', '300 ימים'].every((s) => snap.compare_table.replace(/<[^>]+>/g, '').includes(s)) && snap.compare_table.includes('218.56') && snap.compare_table.includes('7,101.50'), 'the page tables: the maximum days (50 to 300) and the amount by wage (12,000: 284.06 / 7,101.50; under 28: 218.56)');
check(all.split('jtool-cite').length > 25 && all.includes(av.pages.days) && all.includes(av.pages.calc) && all.includes(av.pages.pay), 'cites throughout, to the days, the calculation and the payment pages');
const renders = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence];
[rs, sh, sp, w58, rp, hi, y25, a47, run({ age: 'x' }), run({ ending: 'leave' }), run({ ending: 'leave_own' }), run({ age: 67 }), mw, tw].forEach((r) => { renders.push(AUI.renderResult(reg, r), AUI.renderDetails(reg, r), AUI.verdictSentence(reg, r)); });
renders.push(AUI.renderForm(reg, Object.assign({}, EX, { wageMode: 'each', wages: [], age: 60, repeat: true })), AUI.renderForm(reg, { age: '', reg: '', stop: '' }));
const joined = renders.join('');
check(!/<h2[\s>]/.test(joined), 'no <h2> in any rendered HTML');
check(!/undefined|NaN|null/.test(joined), 'no undefined / NaN / null in any rendered string (example, resignation, not eligible, spike, women, repeat, ceiling, under 28, errors, leave, window)');
check(!/[A-Za-z]{4,}/.test(joined.replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/https?:\S+/g, '')), 'no English words in the visible text');

/* ---------- 13. The share state, the .ics and the checklist ---------- */
check(JSON.stringify(AUI.inputOf(decodeState(`#s=${AUI.stateOf(EX)}`, AUI.KEYS))) === JSON.stringify(EX) && AUI.stateOf(EX) === 'a35/d2/ef/s2026-10-15/g2026-10-18/m18/p12000', 'the example round-trips exactly, as a short readable state');
const full = { age: 58, women: true, deps: 3, ending: 'resign', stop: '2026-06-30', reg: '2026-07-05', months: 14, wageMode: 'each', wage: '', wages: [9000, 9500, 10000, 11000, 30000, 12000], repeat: true };
check(JSON.stringify(AUI.inputOf(decodeState(`#s=${AUI.stateOf(full)}`, AUI.KEYS))) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns the same answers, six wages included');
check(!/[֐-׿]/.test(AUI.stateOf(full)) && /^[0-9A-Za-z._~/-]+$/.test(AUI.stateOf(full)) && AUI.inputOf({}) === null, 'the state carries no Hebrew, no name or ID; an empty hash gives no input');
const cal = ics(ex.deadlines.map((d) => ({ date: d.date, summary: d.he })), '2026-10-21T12:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20261018') && cal.includes('DTSTART;VALUE=DATE:20261101') && cal.includes('DTSTART;VALUE=DATE:20270512') && (cal.match(/BEGIN:VEVENT/g) || []).length === 6, 'the .ics: registration, the office, the payments and the claim, 6 events');
const cl = AUI.checklist(reg, ex);
check(cl.length === 10 && AUI.checklistText(reg, ex).startsWith('1. ') && AUI.checklist(reg, run({ ending: 'resign_ok' })).length === 11 && AUI.checklist(reg, run({ ending: 'leave' })).length === 11 && AUI.TOOL_ID === 'dmei-avtala', 'the checklist: 10 steps when fired (register, the office, form 1500, form 100, 5 documents, the bank account), plus the reason documents or the leave letter; numbered text');
check(AE.byAge(reg, EX).map((x) => x.r.maxDays).join(',') === '50,67,100,138,175' && AUI.daysTable(reg).includes('סעיף 171(א)(2ב)') && AUI.wageTable(reg).includes('5,464'), 'the side-by-side: 50, 67, 100, 138, 175 days at each band; the page tables carry the sections and 218.56 x 25 = 5,464');

console.log(`dmei-avtala: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
