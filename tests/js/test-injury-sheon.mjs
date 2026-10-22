/**
 * Golden tests for the injured person's clock (shaon-nezikin, the road-accident and personal-injury wave, 22.10.2026).
 * Run: node tests/js/test-injury-sheon.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Limitation Law 1958 (Nevo,
 * current to 21.7.2026: s.5(1) 7 years, s.6 from the day the cause arose, s.8 late discovery, s.10 not before 18, s.15A
 * 7.10.2023-6.4.2024 not counted, also for a period set by another law, s.15A(e)), the Civil Wrongs Ordinance s.89(2) (from
 * the discovery, at most 10 years from the damage; applied to road accidents by s.4(a) of the road law), the Interpretation
 * Law s.10(c) (a last day on a rest day moves to the next day), the Insurance Contract Law ss.27 (30 days), 31 (3 years; 5 for
 * health, hospitalisation and long-term care), 31A(b) (warnings 12 and 3 months before), the road law ss.3(a), 5(b) (60 days),
 * 5E(b) (2 years), 12 (Karnit), the National Insurance Law s.296(a) (12 months), the Institute's pages (injury allowance up to
 * 91 days; accident allowance: the check within 72 hours, the claim within 90 days; medical appeal 30 days, the labor court on
 * the appeals committee 60 days, the claims committee 6 months, the labor court 12 months), the Courts Law s.51(a)(2)
 * (2,500,000 on the filing day) and the small-claims ceiling 39,900 from 1.1.2026, the Bar fee rules (8/11/13% + VAT 18%).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/shaon-engine.js';
import * as U from '../../assets/js/tools/shaon-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { addDays, offRestDays, isRestDay } from '../../assets/js/tools/dates.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.shCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const sh = reg.injury_sheon;
const ca = reg.car_accident;
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;
const has = (list, code) => list.some((x) => x.code === code);

/* ---------- 1. The registry ---------- */
check(sh && sh.checked_on === '2026-10-22' && sh.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: injury_sheon checked 22.10.2026, next update 1.1.2027');
const urls = JSON.stringify(sh).match(/https?:\/\/[^"]+/g) || [];
check(urls.length > 20 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|www\.btl\.gov\.il|www\.gov\.il|meyda\.education\.gov\.il)\//.test(u)), `registry: all ${urls.length} source links are official (Nevo, btl.gov.il, gov.il, education.gov.il)`);
check(!/kolzchut|כל זכות|כל-זכות/.test(JSON.stringify(sh)), 'registry: the private rights portal is never named');
check(sh.insurance.limit_years === 3 && sh.insurance.limit_long_years === 5 && sh.insurance.warn_months.join() === '12,3' && sh.insurance.pay_days === 30 && sh.insurance.limit_section === 'סעיף 31', 'registry: Insurance Contract Law 3 / 5 years (s.31), warnings 12 and 3 months (s.31A(b)), payment 30 days (s.27)');
check(sh.torts.late_cap_years === 10 && sh.torts.late_cap_section === 'סעיף 89(2)' && sh.torts.dog_section === 'סעיף 41א', 'registry: Civil Wrongs Ordinance s.89(2) 10 years; s.41A dog');
check(sh.nii.claim_months === 12 && sh.nii.claim_section === 'סעיף 296(א)' && sh.nii.work.days === 91 && sh.nii.work.weeks === 13 && sh.nii.accident.exam_hours === 72 && sh.nii.accident.claim_days === 90 && sh.nii.accident.min_age === 18, 'registry: NI Law s.296(a) 12 months; injury allowance 91 days / 13 weeks; accident allowance 72 hours, 90 days, from 18');
check(sh.nii.work.medical_appeal_days === 30 && sh.nii.work.court_days === 60 && sh.nii.appeal.committee_months === 6 && sh.nii.appeal.court_months === 12, 'registry: appeals 30 days, 60 days, 6 months, 12 months (btl.gov.il)');
check(ca.limitation.years === 7 && ca.limitation.adult_age === 18 && ca.limitation.war.from === '2023-10-07' && ca.limitation.war.to === '2024-04-06' && ca.interim_days === 60 && sh.road.interim_max_years === 2, 'reused reg.car_accident: 7 years, 18, the war window 7.10.2023-6.4.2024, 60 days; road s.5E(b) 2 years');
check(reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount === 39900 && reg.small_claims.magistrate_max === 2500000, 'reused reg.small_claims: 39,900 from 1.1.2026, magistrates 2,500,000 (Courts Law s.51(a)(2))');

/* ---------- 2. The example: a road accident, a passenger, 8.10.2026, today 22.10.2026, age 34 ---------- */
const ex = E.shCompute(reg, EX);
check(ex.ok && EX.injury === '2026-10-08' && EX.today === '2026-10-22' && ex.daysSince === 14, 'example: injured 8.10.2026, 14 days before 22.10.2026');
check(ex.lim.plain === '2033-10-08' && new Date('2033-10-08T00:00:00Z').getUTCDay() === 6 && ex.lim.rolled && ex.deadline === '2033-10-09', 'example: 8.10.2026 + 7 years = 8.10.2033, a Saturday, so the last day is 9.10.2033 (s.5(1); Interpretation Law s.10(c))');
check(ex.daysLeft === 2544, 'example: 22.10.2026 to 9.10.2033 = 7 × 365 + 2 leap days − 13 = 2,544 days');
check(ev(ex, 'interim_max') === '2028-10-08' && ev(ex, 'limit') === '2033-10-09', 'example events: interim payments only for 2 years, to 8.10.2028 (s.5E(b)); the limitation 9.10.2033');
check(ex.pays[0].code === 'vehicle' && ex.pays[0].role === 'primary' && ex.pays[0].section === 'סעיף 3(א)' && has(ex.pays, 'karnit') && has(ex.pays, 'excluded'), 'example who pays: the insurer of the vehicle the passenger was in (s.3(a)); Karnit and s.7 to check');
check(ex.steps.map((s) => s.code).join() === 'treat,details,police,demand,records,evidence,nosign,lawyer,calendar' && ex.steps.find((s) => s.code === 'details').kind === 'law' && ex.steps.find((s) => s.code === 'demand').kind === 'right' && ex.steps.find((s) => s.code === 'lawyer').section === ca.sections.fee, 'example checklist: 9 steps; the driver\'s details a duty (reg.144(a)(3)); the interim-payment demand a right; the fee cap s.16(a)');
check(ex.flags.some((f) => f.code === 'rest') && !ex.expired && ex.inFirst30, 'example flags: the rest-day move; not expired; still in the first 30 days');

/* ---------- 3. Minors (Limitation Law s.10) ---------- */
const m12 = run({ role: 'pedestrian', age: 12, birth: '2014-03-01' });
check(m12.lim.minor && m12.lim.start === '2032-03-01' && m12.deadline === offRestDays('2039-03-01', ca.independence_days) && ev(m12, 'adult') === '2032-03-01', 'minor, born 1.3.2014, injured at 12: the 7 years run from 1.3.2032 (18) to 1.3.2039');
const mNoBirth = run({ age: 12, birth: '' });
check(mNoBirth.ok && mNoBirth.deadline === null && mNoBirth.flags.some((f) => f.code === 'minor_birth') && ev(mNoBirth, 'interim_max') === '2028-10-08', 'minor without a birth day: no last day is guessed, a flag asks for it; the other dates still come');
check(!run({ age: 12, birth: '2010-01-01' }).ok, 'minor: a birth day that gives another age is an error, never a silent choice');
const adultBirth = run({ age: 34, birth: '1990-01-01' });
check(adultBirth.ok && adultBirth.deadline === '2033-10-09', 'adult: a birth day left in a hidden field is ignored');

/* ---------- 4. The war window (s.15A) ---------- */
const w16 = run({ injury: '2016-11-01', age: 30 });
check(w16.lim.plain === '2023-11-01' && w16.lim.added === 183 && w16.deadline === '2024-05-02', 'injured 1.11.2016: the 7 years end 1.11.2023, inside the window; 7.10.2023-6.4.2024 = 25+30+31+31+29+31+6 = 183 days added: 2.5.2024');
check(w16.expired && has(w16.flags, 'expired') && has(w16.flags, 'war_ended') && has(w16.flags, 'after_stay'), 'injured 1.11.2016: today the date has passed: flags for the exceptions, s.15A(c)-(d) and s.16, never a verdict');
const w24 = run({ injury: '2024-01-01', age: 30 });
check(w24.lim.added === 97 && w24.deadline === offRestDays(addDays('2031-01-01', 97), ca.independence_days), 'injured 1.1.2024, inside the window: 1.1-6.4.2024 = 31+29+31+6 = 97 days not counted');
check(run({ injury: '2024-05-01', age: 30 }).lim.added === 0, 'injured after 6.4.2024: no war days');
const old16 = run({ injury: '2016-05-01', age: 30 });
check(old16.lim.added === 0 && old16.deadline === '2023-05-01' && old16.expired, 'injured 1.5.2016: ended 1.5.2023, before the window: no war days, expired');

/* ---------- 5. Late discovery (Civil Wrongs Ordinance s.89(2), Limitation Law s.8) ---------- */
const late = run({ injury: '2019-01-01', discovered: '2024-06-01', age: 30 });
check(late.late && late.capped && late.cap.added === 183 && late.deadline === '2029-07-03' && ev(late, 'discovered') === '2024-06-01', 'injured 1.1.2019, discovered 1.6.2024: 7 years from the discovery (1.6.2031) but at most 10 from the damage: 1.1.2029 + 183 war days = 3.7.2029');
const late2 = run({ injury: '2025-01-01', discovered: '2025-03-01', age: 30 });
check(late2.late && !late2.capped && late2.deadline === offRestDays('2032-03-01', ca.independence_days), 'injured 1.1.2025, discovered 1.3.2025: 7 years from the discovery (1.3.2032), the 10-year cap (1.1.2035) is later');
check(!run({ discovered: '2026-10-01' }).ok && !run({ discovered: '2026-11-01' }).ok, 'error: a discovery before the injury, or after today');

/* ---------- 6. One's own policy (Insurance Contract Law ss.27, 31, 31A) ---------- */
const fall = run({ type: 'other', sub: 'fall', policy: 'accident', docs: '2026-10-20', age: 52 });
check(fall.pol.years === 3 && fall.pol.deadline === '2029-10-08' && fall.pol.warns.map((w) => w.date).join() === '2028-10-08,2029-07-08' && fall.pol.payBy === '2026-11-19', 'personal accident policy: 3 years to 8.10.2029; the insurer warns by 8.10.2028 and 8.7.2029; docs on 20.10 -> paid by 19.11.2026');
const health = run({ type: 'other', sub: 'fall', policy: 'health', age: 52 });
check(health.pol.years === 5 && health.pol.deadline === offRestDays('2031-10-08', ca.independence_days), 'health / hospitalisation policy: 5 years (s.31)');
const right = run({ type: 'other', sub: 'fall', policy: 'accident', policyRight: '2026-10-15', age: 52 });
check(right.pol.fromRight && right.pol.deadline === offRestDays('2029-10-15', ca.independence_days), 'disability under a policy: from the day the right arose (15.10.2026) -> 15.10.2029');
const student = run({ type: 'other', sub: 'student', age: 12, birth: '2014-03-01' });
check(student.policy === 'accident' && student.pays[0].code === 'student_policy' && has(student.flags, 'policy_minor') && !has(student.pays, 'nii_accident'), 'student: the Ministry of Education policy pays first; 3 years; no accident allowance under 18; the minor question flagged');

/* ---------- 7. Work injury (National Insurance) ---------- */
const work = run({ type: 'work', job: 'employee', age: 46 });
check(ev(work, 'nii_claim') === offRestDays('2027-10-08', ca.independence_days) && ev(work, 'allowance_end') === '2027-01-07', 'work injury 8.10.2026: claim by 8.10.2027 (12 months, s.296(a)); the 91 days end 7.1.2027 (23 + 30 + 31 + 7)');
check(work.pays[0].code === 'nii_work' && has(work.pays, 'employer_day') && work.pays.find((p) => p.code === 'employer_tort').section === 'סעיף 24(א)(1)', 'work: the Institute first, the employer pays the injury day (s.93(a)); a tort claim against the employer goes to the civil court (Labor Court Law s.24(a)(1))');
const self = run({ type: 'work', job: 'self', age: 46 });
check(!has(self.pays, 'employer_day') && has(self.flags, 'self'), 'self-employed: no employer day; form 283');
const med = run({ type: 'work', decision: 'medical', decisionDate: '2026-10-20' });
const app = run({ type: 'work', decision: 'appeals', decisionDate: '2026-10-20' });
const clerk = run({ type: 'work', decision: 'clerk', decisionDate: '2026-10-20' });
check(ev(med, 'appeal_medical') === '2026-11-19' && ev(app, 'appeal_court') === '2026-12-20' && isRestDay('2026-12-19'), 'decision 20.10.2026: medical appeal by 19.11.2026 (30 days); the labor court on the appeals committee 19.12.2026 is a Saturday -> 20.12.2026 (60 days)');
check(ev(clerk, 'appeal_committee') === '2027-04-20' && ev(clerk, 'appeal_labor') === '2027-10-20', 'a claims officer\'s decision on 20.10.2026: claims committee by 20.4.2027 (6 months), labor court by 20.10.2027 (12 months)');
check(!run({ type: 'work', decision: 'medical', decisionDate: '' }).ok, 'error: a decision without its date');

/* ---------- 8. A road accident on the way to work ---------- */
const both = run({ type: 'both', role: 'driver', demand: '2026-10-12' });
check(both.pays[0].code === 'own_vehicle' && both.pays[0].section === 'סעיף 3(א)(2)' && has(both.pays, 'nii_work') && has(both.pays, 'deduct') && has(both.flags, 'binding'), 'way to work, driving: the own vehicle\'s insurer (Ordinance s.3(a)(2)), the Institute, the s.328A deduction, s.6B binding');
check(ev(both, 'interim_due') === '2026-12-11' && both.steps.find((s) => s.code === 'driver').section === 'תקנה 144(א)(4)', 'demand on 12.10.2026 -> the insurer pays by 11.12.2026 (19 + 30 + 11 = 60 days, s.5(b)); the driver reports to the police as soon as possible (reg.144(a)(4))');
const hit = run({ hitrun: true });
check(hit.pays[0].code === 'karnit' && hit.pays[0].section === ca.sections.karnit && has(hit.steps, 'karnit'), 'unknown or uninsured driver: Karnit pays (s.12)');

/* ---------- 9. Other injuries ---------- */
const dog = run({ type: 'other', sub: 'dog', age: 40 });
check(dog.pays[0].code === 'dog_owner' && dog.pays[0].section === 'סעיף 41א' && has(dog.steps, 'dog') && ev(dog, 'exam72') === '2026-10-11' && ev(dog, 'accident_claim') === '2027-01-06', 'dog bite: the owner is liable without negligence (s.41A); accident allowance: check by 11.10 (72 hours), claim by 6.1.2027 (23 + 30 + 31 + 6 = 90 days)');
const assault = run({ type: 'other', sub: 'assault', job: 'none', age: 40 });
check(assault.pays[0].section === 'סעיף 23' && has(assault.flags, 'sexual') && has(assault.flags, 'accident_nonworker'), 'assault: s.23; s.18A flagged, not computed; a non-worker\'s accident allowance from day 15');
const teen = run({ type: 'other', sub: 'fall', age: 17, birth: '2009-01-01' });
check(!has(teen.pays, 'nii_accident') && has(teen.flags, 'accident_age') && !ev(teen, 'accident_claim'), 'age 17, a fall: no accident allowance (from 18), no 90-day date');
const mal = run({ type: 'malpractice' });
check(!mal.ok && mal.outOfScope && mal.errors[0].he.includes('רשלנות רפואית') && !mal.events, 'medical malpractice: its own rules, nothing computed');

const counts = [ex, m12, work, self, both, hit, fall, student, dog, assault, teen, health].map((r) => r.steps.length);
check(counts.every((n) => n >= 8 && n <= 14), `checklist: 8 to 14 steps for every type (${counts.join(', ')})`);

/* ---------- 10. Which court and the fee caps ---------- */
check(E.shCourt(reg, 39900).code === 'small' && E.shCourt(reg, 39901).code === 'magistrate' && E.shCourt(reg, 2500000).code === 'magistrate' && E.shCourt(reg, 2500001).code === 'district' && E.shCourt(reg, '').code === 'unknown', 'court: 39,900 small claims; 39,901 and exactly 2,500,000 the magistrates\' court; 2,500,001 the district court');
const fee = run({ amount: 100000 });
check(fee.fees.map((f) => `${f.pct}:${f.fee}:${f.withVat}`).join() === '8:8000:9440,11:11000:12980,13:13000:15340', 'fees on 100,000: 8% = 8,000 + 18% VAT = 9,440; 11% = 12,980; 13% = 15,340');
check(run({ type: 'other', amount: 100000, age: 40 }).fees.length === 0, 'fees: the road law cap only for a road accident');

/* ---------- 11. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ injury: '' }, 'injury') && err({ injury: '31.2.2026' }, 'injury') && err({ injury: '2026-10-23' }, 'injury'), 'error: an empty, impossible or future injury day');
check(err({ age: '' }, 'age') && err({ age: -1 }, 'age') && err({ age: 2.5 }, 'age') && err({ age: 121 }, 'age'), 'error: age empty, negative, a fraction, over 120');
check(err({ amount: -5 }, 'amount') && err({ injury: '1975-01-01', age: 30 }, 'injury') && err({ demand: '2026-10-01' }, 'demand'), 'error: a negative amount; a road accident before the law (25.9.1976); a demand before the injury');

/* ---------- 12. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.result.includes('9.10.2033') && s.sentence.includes('9.10.2033') && s.total === 2544 && s.sticky.includes('9.10.2033'), 'snapshot: the example figures (9.10.2033, 2,544 days)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><bdi>9\.10\.2033<\/bdi><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת'), 'lead card: the example\'s last day, the jump to the form');
check(s.form.includes('data-act="preset"') && (s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"'), 'form: 5 one-click profiles, the example pressed');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 18 && s.method.includes('jtool-cite'), 'page table: header + 17 rules with a caption; the method cites');
check((s.result.match(/class="jt63-c[ "]/g) || []).length === 31 && (s.result.match(/jt63-c--today/g) || []).length === 1 && s.result.includes('jtool-visually-hidden') && s.result.includes('jt63-legend'), 'the clock: 31 day cells, today marked once, a text equivalent and a numbered legend');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('9.10.2033') && br.includes('8.10.2026') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול'), `aiBrief: ${words} words, the key dates, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=court_rehearsal') && s.result.includes('topic=personal-injury') && U.renderResult(reg, work).includes('purpose=witness_prep') && handoffState('x', br, 'court_rehearsal').simulationPurpose === 'court_rehearsal', 'the brief under its h4; the first hearing (court_rehearsal); a work injury rehearses the medical committee (witness_prep)');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url.startsWith('https://www.gov.il/') && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/')), 'next actions: the police service first, then 2-4 internal links');
const roadL = na.links.find((x) => x.path.startsWith('/israel-road-accident-compensation-law/'));
const roadS = roadL ? decodeState(roadL.path.split('#')[1], ['d', 'h', 'a', 't', 'b', 'x', 'w', 'm', 's', 'c', 'o', 'k', 'e']) : {};
check(roadS.t === '2026-10-08' && roadS.a === '34' && !roadS.b, 'cross-link: the road tool opens with the reader\'s accident day and age (its own keys t, a)');
check(U.roadLink(m12).includes('b2014-03-01') && U.roadLink(m12).includes('/go') && U.roadLink(both).includes('w1') && U.roadLink(hit).includes('j1') && U.roadLink(both).includes('q2026-10-12'), 'cross-link to the road tool: a minor carries the birth day and outside the vehicle (g=o); the way to work w1; Karnit j1; the demand day q');
const AV_KEYS = ['k', 't', 'a', 'w', 'q', 'n', 'p', 'h', 'l', 'r', 'i', 'd', 's', 'e', 'm', 'x', 'j', 'u', 'c'];
const wl = U.workLink(both);
const ws = decodeState(wl.split('#')[1], AV_KEYS);
check(wl.startsWith('/work-accident-guide/#s=') && ws.t === both.injury && ws.k === 'w' && ws.a === '34' && ws.r === '1' && decodeState(U.workLink(self).split('#')[1], AV_KEYS).k === 's', 'cross-link to the work tool (its keys k, t, a, r): employee or self-employed, the injury day, the age, a road accident');
check(U.nextActions(reg, work).links.some((x) => x.path.startsWith('/work-accident-guide/#s=')), 'next actions of a work injury open the work tool with the reader\'s day');
const icsText = ics(work.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20271008') && icsText.includes('DTSTART;VALUE=DATE:20270107') && icsText.includes('DTSTART;VALUE=DATE:20331009') && (icsText.match(/BEGIN:VEVENT/g) || []).length === work.events.length, 'ics: the computed dates (8.10.2027, 7.1.2027, 9.10.2033), one event each');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('9.10.2033') && s.details.includes('jt63-print'), 'print summary: result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('1.2.2002') && s.details.includes('1.4.2005') && s.details.includes('1.1.2026') && s.details.includes('1.9.2026'), 'what changed and when: the dated official rows');
check(U.courtTable(reg, run({ amount: 39901 })).includes('jt63-mine') && U.feeTable(reg, fee).includes('9,440.00'), 'court table marks the reader\'s amount; fee table with VAT');
const st = U.stateOf(Object.assign({}, EX, { type: 'both', role: 'driver', hitrun: true, policy: 'health', docs: '2026-10-20', demand: '2026-10-12', decision: 'clerk', decisionDate: '2026-10-20', amount: 250000 }));
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.type === 'both' && back.role === 'driver' && back.hitrun && back.policy === 'health' && back.docs === '2026-10-20' && back.demand === '2026-10-12' && back.decision === 'clerk' && back.amount === 250000 && back.age === 34, 'share state: stateOf -> decodeState -> inputOf round trip');
const link = U.stateLink(reg, EX);
const fromLink = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/tort-lawyer/#s=') && fromLink.injury === EX.injury && E.shCompute(reg, Object.assign(fromLink, { today: EX.today })).deadline === ex.deadline, 'stateLink: /tort-lawyer/#s=..., decodes to the same input and the same last day');
check(!/[א-ת]/.test(st) && !st.includes('@') && !/[א-ת]/.test(link), 'share state: numbers and dates only, no Hebrew, no free text');
for (const r of [ex, m12, mNoBirth, w16, late, fall, student, work, med, clerk, both, hit, dog, assault, teen, fee]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r, { today: r.today }) + U.leadCard(reg, r) + U.aiBrief(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.shBand(r)})`);
}
const malHtml = U.renderResult(reg, mal) + U.leadCard(reg, mal);
check(malHtml.includes('רשלנות רפואית') && !bad(malHtml) && !malHtml.includes('href="/medical'), 'malpractice renders its own line, links nothing to the malpractice pages');
/* ---------- PR 170 review: accident allowance only up to the retirement age ---------- */
const old80 = run({ type: 'other', sub: 'fall', policy: 'none', age: 80 });
check(!has(old80.pays, 'nii_accident') && !ev(old80, 'exam72') && !ev(old80, 'accident_claim') && old80.flags.some((f) => f.code === 'accident_retired'), 'a fall at 80: no accident allowance, no 72-hour or 90-day events, a note on the retirement age');
const age64 = run({ type: 'other', sub: 'fall', policy: 'none', age: 64 });
check(age64.pays.find((p) => p.code === 'nii_accident').role === 'check' && age64.pays.find((p) => p.code === 'nii_accident').he.includes('67') && ev(age64, 'accident_claim'), 'a fall at 64: accident allowance to check (the retirement age of a woman depends on her month of birth; a man to 67)');
const age40 = run({ type: 'other', sub: 'fall', policy: 'none', age: 40 });
check(age40.pays.find((p) => p.code === 'nii_accident').role === 'also' && ev(age40, 'exam72'), 'a fall at 40: accident allowance offered, with the 72-hour examination');
check(E.shAccidentAge(reg, 17, 18) === 'no' && E.shAccidentAge(reg, 61, 18) === 'yes' && E.shAccidentAge(reg, 62, 18) === 'check' && E.shAccidentAge(reg, 66, 18) === 'check' && E.shAccidentAge(reg, 67, 18) === 'no' && E.shAccidentAge({}, 50, 18) === 'check', 'shAccidentAge: under 18 no; 18-61 yes; 62-66 check (women 62-65 by month of birth); 67 no; without the table: check');

const errHtml = U.renderResult(reg, run({ injury: '' })) + U.leadCard(reg, run({ injury: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
