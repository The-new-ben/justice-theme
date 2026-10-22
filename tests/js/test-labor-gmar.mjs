/**
 * Golden tests for the final-settlement instrument (gmar-cheshbon, the labor wave, 22.10.2026).
 * Run: node tests/js/test-labor-gmar.mjs
 *
 * The instrument composes the sibling engines, so the first group of checks calls each sibling engine ON ITS OWN with the
 * same answers and asserts that every ledger line and the totals equal their outputs: pitzuyim-engine compute() (severance,
 * s.14, notice, tax, deadlines), chufsha-engine chRedemption() (vacation redemption) and havraa-engine compute() in mode
 * 'period' (recuperation). Then the hand arithmetic from the official texts: Severance Pay Law s.12 (a month's salary a
 * year, proportional for a part), the 1998 s.14 approval (6% -> 72%, 8 1/3% -> 100%), the Advance Notice Law ss.3-7 (a
 * month after a year; the regular wage for the days not given), the Annual Leave Law ss.10, 13 (a day = the month's pay /
 * 21 2/3 on a 5-day week, Minimum Wage Law s.1), the recuperation order s.5 (year 6: 7 days; 2026 price 451.50), the Wage
 * Protection Law ss.1, 9, 20 (due with the month, late from the ninth day; severance late after 15 days; the fund notice
 * within 15 days, s.20(e)) and the Limitation Law s.5(1) (7 years), Annual Leave Law s.31 (3 years).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from '../../assets/js/tools/gmar-engine.js';
import * as U from '../../assets/js/tools/gmar-ui.js';
import { compute as pzCompute, pzFundCheck } from '../../assets/js/tools/pitzuyim-engine.js';
import { chRedemption } from '../../assets/js/tools/chufsha-engine.js';
import * as HV from '../../assets/js/tools/havraa-engine.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.011) => Math.abs(a - b) <= eps;
const EX = U.EXAMPLE;
const run = (over) => G.gmCompute(reg, Object.assign({}, EX, over || {}));
const ln = (g, code) => g.lines.find((x) => x.code === code);
const bad = (html) => /undefined|NaN|\bnull\b/.test(html);
const words = (t) => t.trim().split(/\s+/).length;

// ---------- 1. The example equals the sibling engines' own outputs ----------
const g = run();
check(g.ok, 'the example computes');
const pz = pzCompute(reg, { payType: 'monthly', salary: 12000, jobPct: 100, start: '2021-03-01', end: '2026-09-30', reason: 'fired', s14: 'partial', noticeDate: '2026-08-31', noticeMode: 'worked' });
const ch = chRedemption(reg, { start: '2021-03-01', end: '2026-09-30', week: 5, perWeek: '', regime: 'order', payType: 'monthly', salary: 12000, mode: 'compute', used: 30, scope: 'window' });
const hv0 = HV.compute(reg, { mode: 'period', sector: 'private', start: '2021-03-01', end: '2026-09-30', asOf: '2026-10-22', jobPct: 100, paid: 0, leaves: [] });
const hvLast = hv0.rows[hv0.rows.length - 1];
const hv1 = HV.compute(reg, { mode: 'period', sector: 'private', start: '2021-03-01', end: '2026-09-30', asOf: '2026-10-22', jobPct: 100, paid: Math.round((hv0.net - hvLast.net) * 100) / 100, leaves: [] });
check(ln(g, 'severance').amount === pz.employer && pz.employer === 18760, `severance top-up = pitzuyim compute().employer = 67,000 - 72% = 18,760 (${ln(g, 'severance').amount})`);
check(ln(g, 'fund').amount === pz.fundReplaces && pz.fundReplaces === 48240, 'the fund line = pitzuyim fundReplaces = 67,000 × 72% = 48,240 (s.14, the 1998 approval)');
check(pz.severance === 67000, 'severance = 12,000 × (5 + 7/12) years = 67,000 (s.12)');
check(ln(g, 'vacation').amount === ch.value && ch.value === 10523.15, `vacation = chRedemption().value = 19 days × 553.85 = 10,523.15 (${ch.days} × ${ch.dayValue})`);
check(ch.dayValue === 553.85 && ch.days === 19 && ch.days === ch.accrued - 30, 'a vacation day = 12,000 ÷ 21⅔ = 553.85 (s.10, Minimum Wage Law s.1); 19 = accrued − 30 used');
check(ln(g, 'havraa').amount === hv1.gap && near(hv1.gap, 1843.52), `recuperation owed = havraa compute().gap for the last part-year = 7 days × 0.5833 × 451.50 = 1,843.52 (${hv1.gap})`);
check(hvLast.full === 7 && hvLast.price === 451.5 && hvLast.fraction === 0.5833, 'work year 6: 7 days (order s.5(a)), valued at the 1.7.2026 price 451.50, share 7/12');
check(ln(g, 'salary').amount === 12000, 'the final salary: September 2026 worked in full = 12,000 (Wage Protection Law s.9)');
check(ln(g, 'notice').amount === 0 && g.r.notice.month && g.r.noticeEnd === '2026-09-30', 'notice of a month from 31.8.2026 ends 30.9.2026, worked in full: nothing extra (ss.3(3), 6)');
const sumEmployer = 12000 + 0 + pz.employer + ch.value + hv1.gap;
check(near(g.employerNow, sumEmployer) && g.employerNow === 43126.67, `employer now = 12,000 + 18,760 + 10,523.15 + 1,843.52 = 43,126.67 (${g.employerNow})`);
check(g.fund === 48240 && g.total === 91366.67 && near(g.total, sumEmployer + pz.fundReplaces), 'total = 43,126.67 + 48,240 = 91,366.67');
check(g.tax.exempt === pz.exempt && pz.exempt === 67000, 'the tax-exempt part = a month (12,000 < 13,750) × the years = 67,000 (s.9(7א)(א))');
check(ln(g, 'sick').amount === 0 && ln(g, 'sick').bucket === 'none' && ln(g, 'sick').section.includes('2(א)'), 'sick days: not paid out, Sick Pay Law s.2(a)');

// ---------- 2. Dates the law sets ----------
const ev = (k) => g.events.find((e) => e.key === k);
check(ev('salary_due').date === '2026-09-30' && ev('salary_late').date === '2026-10-09', 'final salary due 30.9.2026 (s.9), late from 9.10.2026 (s.1, the ninth day)');
check(ev('due').date === '2026-09-30' && ev('grace').date === '2026-10-15', 'severance due on the last day; late after 15 days: 15.10.2026 (s.20(b))');
check(ev('cert').date === '2026-10-14' && ev('form161').date === '2026-09-30', 'certificate within 14 days: 14.10.2026 (Advance Notice Law s.8); form 161 at the retirement');
check(ev('fund_notice').date === '2026-10-15', 'the employer tells the fund within 15 days: 15.10.2026 (s.20(e))');
check(ev('vac_limit').date === '2029-09-30' && ev('limit').date === '2033-09-30', 'limitation: vacation 3 years 30.9.2029 (s.31), the rest 7 years 30.9.2033 (Limitation Law s.5(1))');
check(g.events.every((e, k, a) => !k || a[k - 1].date <= e.date), 'the dates are in order');

// ---------- 3. Hard cases ----------
const nn = U.PRESETS.nonotice.input;
const g2 = G.gmCompute(reg, nn);
check(ln(g2, 'notice').amount === 9000 && ln(g2, 'notice').section.includes('7(א)'), 'dismissed without notice after 3 years: a month of regular wage, 9,000 (s.7(a))');
check(ln(g2, 'salary').amount === 4500 && g2.last.worked === 11 && g2.last.sched === 22, 'end 15.9.2026: 11 of 22 work days (Sun-Thu) of September = 4,500');
check(ln(g2, 'severance').amount === 27024.66, '9,000 × (3 years and a day = 3 + 1/365) = 27,024.66 (s.12)');
check(g2.employerNow === 53650.59 && g2.fund === 0, 'no s.14: everything from the employer, 53,650.59');
const g3 = run({ reason: 'resign', noticeMode: 'none', noticeDate: '' });
check(ln(g3, 'notice').amount === -12000 && ln(g3, 'notice').bucket === 'offset' && g3.offset === -12000, 'resigned without notice: the worker owes a month, 12,000 (s.7(b)), shown as an offset');
check(ln(g3, 'severance').amount === 0 && ln(g3, 'fund').amount === null && g3.fundUnknown, 'an ordinary resignation: no severance from the employer; the s.14 fund is the worker\'s, amount unknown here');
check(near(g3.employerNow, g3.employerGross - 12000), 'employer now = the gross lines − the possible offset');
const g4 = run({ noticeMode: 'paid', noticeDate: '2026-09-20', end: '2026-09-25', lastDays: '' });
check(g4.ok && ln(g4, 'notice').amount === 10000 && g4.nt.days === 25, `notice 20.9, the employer waived work after 25.9: 25 days to 20.10 × 12,000 ÷ 30 = 10,000 (s.6(a)) (${ln(g4, 'notice').amount})`);
const g5 = run({ noticeMode: 'paid', noticeDate: '2026-08-31', end: '2026-08-31' });
check(ln(g5, 'notice').amount === 12000, 'waived on the notice day: capped at the month, 12,000 (s.6(a))');
const g6 = run({ reason: 'resign', noticeMode: 'worked', noticeDate: '2026-09-20', end: '2026-09-25' });
check(g6.ok && ln(g6, 'notice').bucket === 'offset' && ln(g6, 'notice').amount === -10000, `resigned, notice from 20.9, stopped 25.9: 25 missing days × 400 = 10,000 owed (s.7(b)) (${ln(g6, 'notice').amount})`);
const g7 = run({ reason: 'term', noticeMode: 'none', noticeDate: '' });
check(ln(g7, 'notice').amount === 0 && g7.r.entitled, 'a fixed term not renewed: no notice debt; severance as a dismissal (s.9)');
const g8 = run({ reason: 'worse', groundOk: true });
check(g8.r.entitled && g8.flags.some((f) => f.code === 'demand') && g8.events.find((e) => e.key === 'due').he.includes('20(ג)'), 'resignation for a worsening (s.11(a)), confirmed: severance, and the due day waits for a written demand (s.20(c))');
const g9 = run({ reason: 'worse', groundOk: false });
check(!g9.r.entitled && ln(g9, 'severance').amount === 0 && g9.flags.some((f) => f.code === 'ground_unconfirmed'), 'the same ground not confirmed: no severance computed, the condition flagged');
const g10 = run({ start: '2025-10-01', noticeDate: '2026-08-31' });
check(g10.r.yearOk && ln(g10, 'severance').amount === 3360 && ln(g10, 'fund').amount === 8640, 'exactly 12 months (1.10.2025-30.9.2026): a year, 12,000; s.14 72% = 8,640, top-up 3,360');
const g11 = run({ start: '2025-10-02', noticeDate: '2026-08-31' });
check(!g11.r.yearOk && g11.r.conditional && g11.flags.some((f) => f.code === 'near_year'), 'one day short of a year, dismissed: the s.3 presumption, proportional and flagged');
check(ln(g11, 'havraa').amount === 0 && g11.hv.state === 'not_eligible', 'less than a work year: no recuperation (order s.5)');
const g12 = run({ end: '2026-02-28', noticeDate: '2026-01-28', lastDays: '' });
check(g12.dueSalary === '2026-02-28' && g12.lateSalary === '2026-03-09', 'the last day of February: due 28.2.2026, late from 9.3.2026');
const g13 = run({ lastDays: 0 });
check(ln(g13, 'salary').amount === 0, 'no work days in the last month: no final salary');
const g14 = run({ lastDays: 30 });
check(!g14.ok && g14.errors.some((e) => e.field === 'lastDays'), 'more work days than the month has: an error, not a figure');
const g15 = run({ fundBal: 52000 });
check(ln(g15, 'fund').amount === 52000 && g15.total === 95126.67, 'the fund balance from the report replaces the law\'s measure: 43,126.67 + 52,000');
const g16 = run({ vacMode: 'balance', vacBalance: 12 });
check(ln(g16, 'vacation').amount === 6646.2, 'the payslip balance: 12 days × 553.85 = 6,646.20');
const g17 = run({ s14: 'full' });
check(ln(g17, 'severance').amount === 0 && ln(g17, 'fund').amount === 67000, 's.14 in full (8⅓%): the fund replaces all 67,000, no top-up');
const g18 = run({ salary: 6000, jobPct: 50 });
check(g18.ok && near(ln(g18, 'havraa').amount, 921.78), `part-time 50%: recuperation 7 × 0.5 × 0.5833 = 2.0416 days × 451.50 = 921.78 (${ln(g18, 'havraa').amount})`);
const g19 = run({ end: '2027-08-31', noticeDate: '2027-07-31', asOf: '2027-09-01' });
check(g19.ok && ln(g19, 'havraa').amount === null && g19.missing.includes('havraa'), 'a work year valued at an unpublished price (2027): recuperation not computed, the rest still is');
const g20 = run({ payType: 'hourly', salary: '', hourly: 45, hours: 160, lastHours: 80 });
check(ln(g20, 'salary').amount === 3600 && g20.flags.some((f) => f.code === 'hourly_due'), 'hourly: 80 hours × 45 = 3,600; the s.10 due rule flagged');
const g21 = run({ hvPaid: 'amount', hvAmount: 5000 });
check(ln(g21, 'havraa').amount === g21.hv.gap && near(g21.hv.gap, g21.hv.net - 5000), 'recuperation with an amount paid: the havraa engine\'s own gap');

// ---------- 4. Input errors ----------
check(!run({ start: '' }).ok && run({ start: '' }).errors.some((e) => e.field === 'start'), 'no start date: an error');
check(!run({ end: '31.2.2026' }).ok, 'an impossible date: an error');
check(!run({ salary: -5 }).ok && !run({ salary: '' }).ok, 'a negative or empty salary: an error');
check(!run({ noticeDate: '' }).ok, 'notice worked but no notice day: an error');
check(!run({ vacMode: 'balance', vacBalance: '' }).ok, 'payslip balance chosen but empty: an error');
check(!run({ fundBal: 'abc' }).ok, 'a fund balance that is not a number: an error');

// ---------- 5. Rendering ----------
const s = U.snapshot(reg);
const html = s.lead + s.form + s.result + s.details + s.method + s.compare_table;
check(!bad(html), 'the snapshot never renders undefined / NaN / null');
check(!/<h2[\s>]/.test(html), 'no <h2> in anything the UI renders');
check(s.result.includes('43,126.67') && s.lead.includes('43,126.67') && s.lead.includes('דוגמה מחושבת'), 'the result and the lead card carry the example figure');
check(s.result.includes('jt56-sheet') && s.result.includes('jtool-visually-hidden') && s.result.includes('ימי מחלה לא נפדים'), 'the final-settlement sheet and its text equivalent');
check((s.result.match(/data-act="rehearse"/g) || []).length === 2 && s.result.includes('purpose=mediation') && s.result.includes('purpose=court_rehearsal'), 'two rehearsal buttons: the settlement talk (mediation) and the labour court');
check(s.details.includes('data-act="print"') && s.details.includes('data-act="copy-doc"') && s.details.includes('data-act="ics"'), 'print, copy as a letter and .ics');
check(s.details.includes('jt56-print') && s.details.includes('הוכן ב-22.10.2026') && s.details.includes('נבדק'), 'the printable claim summary: prepared on, sources checked on');
check(s.result.includes('מה עושים עכשיו') && s.result.includes('work-rights-violation-complaints') && s.result.includes('/claim-labor-court/'), 'next actions: the official route and site links');
check(s.compare_table.includes('<caption>') && s.compare_table.includes('טופס 161'), 'the page table has a caption and the items');
for (const [k, p] of Object.entries(U.PRESETS)) {
	const gp = G.gmCompute(reg, p.input);
	const out = U.renderResult(reg, gp) + U.renderDetails(reg, gp, { today: '2026-10-22' }) + U.leadCard(reg, gp);
	check(gp.ok && !bad(out) && !/<h2[\s>]/.test(out), `preset ${k}: computes and renders clean`);
}
const errHtml = U.renderResult(reg, run({ start: '' })) + U.leadCard(reg, run({ start: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');

// ---------- 6. AI brief, letter, ics, share state ----------
const b1 = U.aiBrief(reg, g, 'mediation');
const b2 = U.aiBrief(reg, g, 'court_rehearsal');
check(b1.includes('43,126.67') && b1.includes('השאלה לתרגול') && words(b1) >= 40 && words(b1) <= 90, `the brief: the key figure, the question, 40-90 words (${words(b1)})`);
check(b2.includes('בית הדין האזורי לעבודה') && words(b2) <= 90 && !/\d{9}/.test(b1 + b2) && !bad(b1 + b2), 'the court brief; no 9-digit run, no raw tokens');
const lt = U.letter(reg, g, '2026-10-22');
check(lt.includes('[שם המעסיק]') && lt.includes('43,126.67') && lt.includes('20(ה)') && !bad(lt), 'the letter: placeholders, the total, the fund notice section');
check(g.events.length >= 10 && g.events.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.section), 'every .ics event has a computed date and its rule');
const st = U.stateOf(EX);
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && G.gmCompute(reg, Object.assign({}, back, { asOf: EX.asOf })).employerNow === g.employerNow && !/[א-ת]/.test(st), 'stateOf -> decodeState -> inputOf round trip gives the same result; no Hebrew in the link');
const st2 = U.stateOf(U.PRESETS.resign2.input);
const back2 = U.inputOf(decodeState(st2, U.KEYS));
check(back2.payType === 'hourly' && back2.hourly === 45 && back2.reason === 'resign', 'the round trip keeps an hourly resignation');
check(G.gmBand(g) === '60-150k' && G.gmBand(run({ start: '' })) === 'error', 'analytics gets a band, never the amount');

// ---------- 7. Registry ----------
const lg = reg.labor_gmar;
check(lg && lg.source_url.startsWith('https://') && lg.checked_on === '2026-10-22', 'labor_gmar exists with its source and date');
check(lg.wage.url.includes('nevo.co.il') && lg.wage.fund_notice_days === 15 && lg.wage.demand_section === 'סעיף 20(ג)', 'the Wage Protection Law values with their sections');
check(lg.sick.url.includes('71572') && lg.sick.accrual_max_days === 90 && lg.form_161.url.includes('notice-of-retirement'), 'the Sick Pay Law and the form-161 service');
check(reg.labor_chufsha.wage.late_day === 9 && reg.severance.late.grace_days === 15 && reg.severance.limitation.years === 7, 'the figures read from the sibling datasets exist');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
