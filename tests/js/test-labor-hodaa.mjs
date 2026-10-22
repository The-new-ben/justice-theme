/**
 * Golden tests for the advance-notice instrument (hodaa-mukdemet, the labor wave, 22.10.2026).
 * Run: node tests/js/test-labor-hodaa.mjs
 *
 * Every expected value is computed by hand from the official texts: the Advance Notice Law 2001 (Nevo, current to
 * 18.9.2023: s.3 monthly 1 day a month for 6 months, then 6 + 2.5 a month to the end of the first year, then a month;
 * s.4 wage: 1 a month in year 1, 14 + 1 per 2 months in year 2, 21 + 1 per 2 months in year 3, then a month; s.5 the same
 * for a resignation; s.6 waiver; s.7 compensation; s.8(b) certificate 14 days / 7 from a written request; s.12 a longer
 * contract notice wins), the Annual Leave Law s.5(a)(7) (only notice days beyond 14 count as vacation), the Women's
 * Employment Law s.9 (6 months; the leave and 60 days after not counted, s.9(c)(3)), the Discharged Soldiers Law s.41A
 * (30 days after a reserve service longer than two days; not counted, s.41A(c)), the Wage Protection Law s.20 (15 / 30
 * days) and the Limitation Law s.5(1) (7 years). The calendar: the notice day is not counted, a month ends on the same
 * day number next month (Interpretation Law s.10). The month counted is the month of work in which the notice is given, as
 * the Ministry of Labor's published table counts it (gov.il guide: wage worker month 12 = 12, 13 = 14, 24 = 19, 25 = 21,
 * 36 = 26). Pay: each counted day as a share of its own month.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/hodaa-engine.js';
import * as U from '../../assets/js/tools/hodaa-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.hdCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const r2 = (n) => Math.round(n * 100) / 100;
const lh = reg.labor_hodaa;
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;

/* ---------- 1. The registry ---------- */
check(lh && lh.checked_on === '2026-10-22' && lh.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: labor_hodaa checked 22.10.2026, next update 1.1.2027');
check(lh.law.url.includes('nevo.co.il') && lh.law.current_to === '2023-09-18' && lh.leave.url.includes('nevo.co.il') && lh.women.url.includes('nevo.co.il') && lh.reserve.url.includes('nevo.co.il'), 'registry: every law text is Nevo, with its current-to date');
check(lh.leave.free_days === 14 && lh.leave.section === 'סעיף 5(א)(7)' && lh.reserve.after_days === 30 && lh.reserve.min_days_for_after === 3 && lh.reserve.partner_after_days === 14, 'registry: 14 days (Annual Leave Law s.5(a)(7)), 30 days after reserve duty of more than two days (s.41A(b)), 14 days for a partner (s.41A2(e))');
check(lh.women.gates.length === 7 && lh.women.gates.every((g) => g.section && g.he) && lh.women.permit_url.startsWith('https://www.gov.il/'), 'registry: 7 women-law gates with sections, the gov.il permit service');
const sn = reg.severance.notice;
check(sn.monthly.first_months === 6 && sn.monthly.base_days === 6 && sn.monthly.per_month === 2.5 && sn.wage.y2_base === 14 && sn.wage.y3_base === 21 && sn.cert_days === 14 && sn.cert_request_days === 7, 'reused reg.severance.notice: 6 / 6 + 2.5 / 14 / 21, certificate 14 and 7 days');
check(reg.rights_leida.protect.pregnancy_months === 6 && reg.rights_leida.protect.after_days === 60, 'reused reg.rights_leida.protect: 6 months, 60 days');
check([lh.guide.url, lh.hearing.url, lh.form_161.url].every((u) => u.startsWith('https://www.gov.il/')), 'registry: the guide, the hearing page and form 161 are gov.il');

/* ---------- 2. The example: monthly, 8 months, dismissal ---------- */
const ex = E.hdCompute(reg, EX);
check(ex.ok && EX.start === '2026-02-23' && EX.noticeDate === '2026-10-22' && ex.months === 8 && ex.span.days === 0, 'example: 23.2.2026 to 22.10.2026 = 8 full months');
check(ex.stat.days === 11 && ex.stat.section === 'סעיף 3(2)' && ex.end === '2026-11-02', 'example: 6 + 2.5 × 2 = 11 days (s.3(2)); the notice day not counted: 22.10 + 11 = 2.11.2026');
check(ex.periodPay === 3212.9, 'example: 9,000 × (9/31 for 23-31.10 + 2/30 for 1-2.11) = 2,612.90 + 600 = 3,212.90');
check(ex.counted === 11 && ex.vacation.allowed === 0 && !ex.severanceDue, 'example: 11 counted days, so no notice day can be vacation (11 − 14 < 0); under a year, no severance dates');
check(ev(ex, 'notice') === '2026-10-22' && ev(ex, 'end') === '2026-11-02' && ev(ex, 'cert') === '2026-11-16' && ev(ex, 'limit') === '2033-11-02', 'example events: notice 22.10, last day 2.11, certificate by 16.11.2026 (2.11 + 14, s.8(b)), limitation 2.11.2033');

/* ---------- 3. The tiers, at and around every boundary ---------- */
const at = (months, payType = 'monthly') => run({ payType, salary: payType === 'monthly' ? 9000 : '', hourly: payType === 'hourly' ? 40 : '', hours: payType === 'hourly' ? 160 : '', start: new Date(Date.UTC(2026, 9 - months, 23)).toISOString().slice(0, 10) });
const m5 = at(5); const m6 = at(6); const m7 = at(7); const m11 = at(11); const m12 = at(12);
check(m5.months === 5 && m5.stat.days === 5 && m5.stat.section === 'סעיף 3(1)', 'monthly 5 months: 5 days (s.3(1))');
check(m6.months === 6 && m6.stat.days === 6 && m6.stat.section === 'סעיף 3(1)' && m6.end === '2026-10-28', 'monthly exactly 6 months (boundary): 6 days, s.3(1), last day 28.10');
check(m7.stat.days === 8.5 && m7.stat.section === 'סעיף 3(2)' && m7.end === '2026-10-31' && m7.periodPay === r2(9000 * 8.5 / 31), 'monthly 7 months: 6 + 2.5 = 8.5 days; the calendar ends on 31.10 (9 days), the pay counts 8.5/31 × 9,000 = 2,467.74');
check(m11.stat.days === 18.5 && m12.stat.month === true && m12.stat.section === 'סעיף 3(3)' && m12.end === '2026-11-22' && m12.periodPay === 9000, 'monthly 11 months: 18.5 days; 12 months: a month (s.3(3)) to 22.11, one month of pay 9,000');
const h11 = at(11, 'hourly'); const h12 = at(12, 'hourly'); const h13 = at(13, 'hourly'); const h14 = at(14, 'hourly'); const h24 = at(24, 'hourly'); const h35 = at(35, 'hourly'); const h36 = at(36, 'hourly');
check(h11.stat.days === 11 && h11.stat.section === 'סעיף 4(1)', 'hourly 11 months: 11 days (s.4(1))');
check(h12.stat.days === 12 && h12.stat.section === 'סעיף 4(1)' && h13.stat.days === 14 && h14.stat.days === 14 && h12.stat.n === 12, 'hourly exactly 12 / 13 / 14 months: 12, 14, 14 days (the Ministry table: month 12 = 12, 13 = 14, 14 = 14)');
check(h24.stat.days === 19 && h24.stat.section === 'סעיף 4(2)' && h35.stat.days === 26 && h35.stat.section === 'סעיף 4(3)', 'hourly 24 months: 14 + 5 = 19 (s.4(2)); 35 months: 21 + 5 = 26 (s.4(3))');
check(h36.stat.days === 26 && !h36.stat.month && at(37, 'hourly').stat.month === true && at(37, 'hourly').stat.section === 'סעיף 4(4)', 'hourly exactly 36 months: 26 days; 37 months (more than 36): a month (s.4(4))');
const h18 = E.hdCompute(reg, U.hdPreset('h18', '2026-10-22'));
check(h18.months === 18 && h18.stat.days === 16 && h18.end === '2026-11-07' && h18.periodPay === 3351.4, 'hourly preset 18 months: 14 + 2 = 16 days to 7.11; 40 × 160 = 6,400 a month × (9/31 + 7/30) = 1,858.06 + 1,493.33 = 3,351.40');
const MIN = lh.guide.wage_table;
check(MIN.length === 36 && MIN[11] === 12 && MIN[12] === 14 && MIN[23] === 19 && MIN[24] === 21 && MIN[35] === 26 && MIN.every((d, i) => E.hdNoticeDays(reg.severance, 'hourly', { months: i + 1, days: 0 }).days === d), 'the wage worker\'s table, months 1-36, equals the Ministry of Labor\'s published table row by row (gov.il guide)');
check(E.hdNoticeDays(reg.severance, 'monthly', { months: 11, days: 5 }).days === 21 && E.hdNoticeDays(reg.severance, 'monthly', { months: 12, days: 0 }).month, 'monthly: in the 12th month 6 + 2.5 × 6 = 21 days ("up to three weeks"); 12 full months: a month');
const part = run({ start: '2026-02-01' });
check(part.span.months === 8 && part.span.days === 22 && part.stat.n === 9 && part.stat.days === 13.5 && part.flags.some((f) => f.code === 'month_started'), 'a started month counts: 8 months and 22 days = the 9th month, 6 + 2.5 × 3 = 13.5 days, with the flag');
const zero = run({ start: '2026-10-01' });
check(zero.ok && zero.months === 0 && zero.stat.n === 1 && zero.stat.days === 1 && zero.end === '2026-10-23', 'the first month of work (22 days): one day (s.3(1), the Ministry table row 1)');
const eom = run({ start: '2026-01-01', noticeDate: '2027-01-31' });
check(eom.stat.month && eom.end === '2027-02-28', 'a month from 31.1.2027 ends on 28.2.2027 (Interpretation Law s.10(b))');
const eod = run({ noticeDate: '2026-10-31', start: '2026-03-01' });
check(eod.months === 8 && eod.end === '2026-11-11', 'last day of a month: 8 months, 11 days from 31.10 = 11.11');

/* ---------- 4. Both directions and what happened in the notice ---------- */
const y3 = E.hdCompute(reg, U.hdPreset('y3', '2026-10-22'));
check(y3.dir === 'resign' && y3.stat.month && y3.periodPay === 12000 && y3.flags.some((f) => f.code === 'resign_tiers' && f.section === 'סעיף 5'), 'resignation, 3 years: a month (s.3(3) through s.5), 12,000');
const n5 = E.hdCompute(reg, U.hdPreset('none5', '2026-10-22'));
check(n5.mode === 'none' && n5.endWork === '2026-10-22' && n5.owed === 11000 && n5.owedBy === 'employer' && n5.paySection === 'סעיף 7(א)', 'dismissal without notice, 5 years: the employer owes a month, 11,000 (s.7(a)); work ended on the notice day');
const nr = run({ dir: 'resign', mode: 'none' });
check(nr.owedBy === 'employee' && nr.owed === 3212.9 && nr.paySection === 'סעיף 7(ב)', 'resignation without notice: the employee owes the 11 days, 3,212.90 (s.7(b))');
const sh = run({ start: '2026-04-23', mode: 'short', lastDay: '2026-10-25' });
check(sh.stat.days === 6 && sh.end === '2026-10-28' && sh.missing.days === 3 && sh.owed === 870.97 && sh.owedBy === 'employer', 'work ended 25.10, 3 days before 28.10: 3/31 × 9,000 = 870.97 from the employer (s.7(a))');
check(ev(sh, 'work_end') === '2026-10-25' && ev(sh, 'cert') === '2026-11-08', 'short: the certificate counts from the last day worked, 25.10 + 14 = 8.11');
const wv = run({ start: '2025-10-23', mode: 'waived' });
const wvr = run({ start: '2025-10-23', mode: 'waived', dir: 'resign' });
check(wv.owed === 9000 && wv.owedBy === 'employer' && wv.paySection === 'סעיף 6(א)' && wvr.paySection === 'סעיף 6(ב)', 'waived: the employer pays the month, 9,000 (s.6(a); on a resignation s.6(b))');
const shortLate = run({ mode: 'short', lastDay: '2026-11-30' });
check(shortLate.ok && shortLate.missing.days === 0 && shortLate.owed === null && shortLate.endWork === '2026-11-02', 'short with a last day after the notice end: nothing missing, nobody owes');

/* ---------- 5. Contract, vacation, the paused periods ---------- */
const con = run({ start: '2025-10-23', contractDays: 45 });
check(con.useContract && con.end === '2026-12-06' && con.periodPay === r2(9000 * (1 + 15 / 31)) && con.flags.some((f) => f.code === 'contract'), 'contract 45 days beats the month (s.12): to 6.12.2026; 9,000 × (9/31 + 1 + 6/31) = 13,354.84');
const conR = run({ start: '2025-10-23', contractDays: 45, dir: 'resign' });
check(!conR.useContract && conR.end === '2026-11-22' && conR.flags.some((f) => f.code === 'contract_resign'), 'resignation: a contract cannot lengthen the notice beyond the law (the Ministry guide); the month stands, with the flag');
const conShort = run({ start: '2025-10-23', contractDays: 20 });
check(!conShort.useContract && conShort.stat.month && conShort.end === '2026-11-22', 'a contract shorter than the law is ignored: the month stands');
const v20 = run({ start: '2025-10-23', vacation: 20 });
const v17 = run({ start: '2025-10-23', vacation: 17 });
check(v20.vacation.allowed === 17 && v20.vacation.over === 3 && v20.flags.some((f) => f.code === 'vacation_over'), 'vacation in a 31-day notice: only 31 − 14 = 17 count; 20 planned, 3 over (Annual Leave Law s.5(a)(7))');
check(v17.vacation.over === 0 && v17.flags.some((f) => f.code === 'vacation_ok'), 'vacation 17 days: exactly at the limit, no warning');
const vr = run({ dir: 'resign', vacation: 5 });
check(vr.vacation.over === 0 && vr.flags.some((f) => f.code === 'vacation_resign'), 'resignation: the 14-day rule is for a dismissal notice only');
const rs = run({ start: '2023-03-23', pauseKind: 'reserve', pauseFrom: '2026-11-01', pauseTo: '2026-11-10' });
check(rs.win.to === '2026-12-10' && rs.paused === 40 && rs.end === '2027-01-01' && rs.periodPay === 9000, 'reserve 1-10.11 (10 days > 2): window to 10.12 (+30, s.41A(b)-(c)); 40 days not counted, the month ends 1.1.2027; pay stays one month');
const rs2 = run({ start: '2023-03-23', pauseKind: 'reserve', pauseFrom: '2026-11-01', pauseTo: '2026-11-02' });
check(rs2.win.after === 0 && rs2.paused === 2 && rs2.end === '2026-11-24', 'reserve of exactly two days: no 30 days after; 2 days not counted, the month moves from 22.11 to 24.11');
const lv = run({ start: '2023-03-23', pauseKind: 'leave', pauseFrom: '2026-11-01', pauseTo: '2027-04-30' });
check(lv.win.to === '2027-06-29' && lv.end === '2027-07-21' && ev(lv, 'pause_end') === '2027-06-29', 'birth leave 1.11.2026-30.4.2027 + 60 days (to 29.6.2027) not counted (s.9(c)(3)): 9 days before, 22 after, last day 21.7.2027');
const rsr = run({ dir: 'resign', start: '2023-03-23', pauseKind: 'reserve', pauseFrom: '2026-11-01', pauseTo: '2026-11-10' });
check(rsr.paused === 0 && rsr.end === '2026-11-22' && rsr.flags.some((f) => f.code === 'pause_resign'), 'resignation: the paused periods do not apply, the month ends 22.11');
const inside = run({ start: '2023-03-23', pauseKind: 'reserve', pauseFrom: '2026-10-20', pauseTo: '2026-10-25' });
check(inside.flags.some((f) => f.code === 'notice_in_window' && f.level === 'danger'), 'a notice handed over during reserve duty: a danger flag');
const sev = run({ start: '2023-03-23' });
check(sev.severanceDue && ev(sev, 'sev_due') === '2026-11-22' && ev(sev, 'sev_grace') === '2026-12-07' && ev(sev, 'sev_late') === '2026-12-22' && ev(sev, 'limit') === '2033-11-22', '43 months, dismissal: severance due 22.11, day 15 = 7.12, day 30 = 22.12 (s.20), limitation 22.11.2033');

/* ---------- 6. The gates ---------- */
const preg8 = run({ gates: ['pregnant'] });
const preg5 = run({ start: '2026-05-23', gates: ['pregnant'] });
check(preg8.blocked && preg8.gates[0].level === 'danger' && preg8.gates[0].url === lh.women.permit_url, 'pregnant after 8 months: permit needed (s.9(a)), blocked, the gov.il permit service');
check(!preg5.blocked && preg5.gates[0].level === 'info' && preg5.months === 5, 'pregnant after 5 months: the s.9(a) permit does not apply (6 months), not blocked');
const pregR = run({ dir: 'resign', gates: ['pregnant', 'reserve'] });
check(!pregR.blocked && pregR.gates.every((g) => g.level === 'info'), 'resignation: the dismissal protections are information only');
const res = run({ gates: ['reserve', 'partner', 'fertility', 'miscarriage'] });
check(res.blocked && res.gates.find((g) => g.code === 'reserve').section === 'סעיף 41א(ב)' && res.gates.find((g) => g.code === 'partner').level === 'warn' && res.gates.find((g) => g.code === 'fertility').section === 'סעיף 9(ה)', 'gates: reserve (s.41A(b), danger), partner (warn), fertility (s.9(e))');

/* ---------- 7. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ start: '' }, 'start') && err({ start: '31.2.2026' }, 'start'), 'error: empty or impossible start date');
check(err({ noticeDate: '2025-01-01' }, 'noticeDate'), 'error: a notice before the start');
check(err({ salary: -5 }, 'salary') && err({ payType: 'hourly', hourly: 40, hours: 0 }, 'hours'), 'error: a negative salary; zero monthly hours');
check(err({ mode: 'short', lastDay: '' }, 'lastDay') && err({ mode: 'short', lastDay: '2026-10-01' }, 'lastDay'), 'error: short without a last day, or before the notice');
check(err({ contractDays: 'x' }, 'contractDays') && err({ vacation: 2.5 }, 'vacation'), 'error: contract days not a number; half a vacation day');
check(err({ pauseKind: 'reserve', pauseFrom: '2026-11-01', pauseTo: '' }, 'pause') && err({ pauseKind: 'leave', pauseFrom: '2026-11-05', pauseTo: '2026-11-01' }, 'pause'), 'error: a paused period without an end, or ending before it starts');
const noPay = run({ salary: '' });
check(noPay.ok && noPay.periodPay === null && noPay.stat.days === 11 && !bad(U.renderResult(reg, noPay)) && !bad(U.leadCard(reg, noPay)), 'no salary: the days and dates still come, no amount, no "null" rendered');

/* ---------- 8. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.result.includes('11') && s.result.includes('3,212.90') && s.sentence.includes('2.11.2026') && s.total === 11, 'snapshot: the example figures (11 days, 2.11.2026, 3,212.90)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(s.lead.includes('jtool-lead__figure') && /<strong class="jtool-lead__figure"><bdi>11<\/bdi><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('2.11.2026'), 'lead card: the example figure 11, the last day, the jump to the form');
check(s.form.includes('data-act="preset"') && (s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"'), 'form: 5 one-click profiles, the example pressed');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 38 && s.method.includes('jtool-cite'), 'page table: header + 37 month rows with a caption; the method cites');
check(s.result.includes('jt46-ribbon') && s.result.includes('jtool-visually-hidden') && (s.result.match(/jt46-d--counted/g) || []).length === 11 && (s.result.match(/jt46-d--last/g) || []).length === 1, 'ribbon: 11 counted day cells, the last one ruled, with a text equivalent');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('11 ימים') && br.includes('3,212.90') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול'), `aiBrief: ${words} words, the key figures, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('data-act="rehearse"') && s.result.includes('purpose=mediation') && s.result.includes('topic=employment') && handoffState('x', br, 'mediation').simulationPurpose === 'mediation', 'the brief is shown under its h4 with the rehearse link (mediation, employment)');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official.some((x) => x.url.startsWith('https://www.gov.il/')) && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/') && x.path.endsWith('/')), 'next actions: gov.il first, then 2-4 internal links');
const icsText = ics(sev.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20261122') && icsText.includes('DTSTART;VALUE=DATE:20261207') && icsText.includes('DTSTART;VALUE=DATE:20331122') && (icsText.match(/BEGIN:VEVENT/g) || []).length === sev.events.length, 'ics: the computed dates (22.11, 7.12.2026, 22.11.2033), one event each');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('3,212.90') && s.details.includes('jt46-print'), 'print summary: result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('28.2.2026') && s.details.includes('29.4.2026') && s.details.includes('1.1.2024'), 'what changed and when: the dated official rows');
const st = U.stateOf(Object.assign({}, EX, { gates: ['pregnant', 'after_leave'], vacation: 3, pauseKind: 'reserve', pauseFrom: '2026-11-01', pauseTo: '2026-11-10' }));
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.start === EX.start && back.noticeDate === EX.noticeDate && back.salary === 9000 && back.gates.join() === 'pregnant,after_leave' && back.vacation === 3 && back.pauseTo === '2026-11-10' && E.hdCompute(reg, back).end === E.hdCompute(reg, Object.assign({}, EX, { gates: ['pregnant', 'after_leave'], vacation: 3, pauseKind: 'reserve', pauseFrom: '2026-11-01', pauseTo: '2026-11-10' })).end, 'share state: stateOf -> decodeState -> inputOf round trip, same result');
check(!/[א-ת]/.test(st) && !st.includes('@'), 'share state: no Hebrew, no free text');
for (const r of [m7, h36, n5, sh, con, rs, lv, preg8, res, y3, zero]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r) + U.leadCard(reg, r) + U.aiBrief(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.hdBand(r)}, ${r.mode})`);
}
const errHtml = U.renderResult(reg, run({ start: '' })) + U.leadCard(reg, run({ start: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
