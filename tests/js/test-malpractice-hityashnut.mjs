/**
 * Golden tests for the malpractice limitation clock (shaon-refui, the medical-malpractice wave, 22.10.2026, HAD-594).
 * Run: node tests/js/test-malpractice-hityashnut.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Limitation Law 1958 (Nevo, current
 * to 21.7.2026: s.5 the period of a claim on which no action was filed, s.5(1) 7 years, s.6 from the day the cause arose,
 * s.8 late discovery of the facts, s.10 not before 18, s.11 a mental or intellectual impairment without a guardian, s.15 an
 * action dismissed so that a new one can be filed, s.15A 7.10.2023-6.4.2024 not counted (also for a period set by another
 * law, s.15A(e)), s.15A(c)-(d) a period that ended before Amendment 8 was published on 25.1.2024, s.16 at least 1 year after a
 * stay (2 after s.11), s.18 at least 1 year from inheritance, s.28 the State), the Civil Wrongs Ordinance (s.19 the estate,
 * s.78 the dependants, s.79 six months, s.89(2) from the discovery of the damage, never later than 10 years from it), the
 * Interpretation Law s.10(c) (a last day on a rest day moves to the next day), the Insurance Contract Law s.31 (3 / 5 years) and
 * s.31A(b) (warnings 12 and 3 months before), and the Supreme Court rulings read on the court's site (רע"א 901/07, ע"א 4275/10,
 * רע"א 4288/15, ע"א 9154/09, ע"א 2805/13), described in words only.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/hityashnut-engine.js';
import * as U from '../../assets/js/tools/hityashnut-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { isRestDay, offRestDays } from '../../assets/js/tools/dates.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const T = '2026-10-22';
const run = (over) => E.htCompute(reg, Object.assign({ today: T, found: 'damage', policy: 'none' }, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const mh = reg.malpractice_hityashnut;
const sh = reg.injury_sheon;
const ca = reg.car_accident;
const rd = (r, code) => r.readings.find((x) => x.code === code) || {};
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;
const has = (list, code) => list.some((x) => x.code === code);
const sat = (d) => new Date(`${d}T00:00:00Z`).getUTCDay() === 6;

/* ---------- 1. The registry: every figure the engine reads exists and has an official source ---------- */
check(mh && mh.checked_on === '2026-10-22' && mh.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: malpractice_hityashnut checked 22.10.2026, next update 1.1.2027');
const urls = JSON.stringify(mh).match(/https?:\/\/[^"]+/g) || [];
check(urls.length >= 15 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|www\.btl\.gov\.il|www\.gov\.il|fs\.knesset\.gov\.il|supremedecisions\.court\.gov\.il)\//.test(u)), `registry: all ${urls.length} links are official (Nevo law texts, btl.gov.il, gov.il, the Knesset, the Supreme Court)`);
check(!/kolzchut|כל זכות|כל-זכות|wikisource|wikipedia/i.test(JSON.stringify(mh)), 'registry: never the private rights portal, never Wikipedia or Wikisource');
check(mh.limitation.filed_section === 'סעיף 5' && mh.limitation.dismissed_section === 'סעיף 15' && mh.limitation.after_dismissal_years === 1 && mh.limitation.incapacity_floor_years === 2 && mh.limitation.inheritance_years === 1 && mh.limitation.inheritance_section === 'סעיף 18' && mh.limitation.state_section === 'סעיף 28', 'registry: Limitation Law s.5 filing, s.15 dismissal, s.16 one / two years, s.18 one year, s.28 the State');
check(mh.limitation.war_published === '2024-01-25' && mh.limitation.war_eve === '2024-01-24' && /3151/.test(mh.limitation.war_published_he), 'registry: Amendment 8 published in Sefer HaChukim 3151 on 25.1.2024; its eve 24.1.2024');
check(mh.torts.estate_section === 'סעיף 19(א)' && mh.torts.dependants_section === 'סעיף 78' && mh.torts.who_files_months === 6 && mh.torts.from === '1968-10-01', 'registry: Civil Wrongs Ordinance s.19(a) estate, s.78 dependants, s.79 six months, the New Version from 1.10.1968');
check(mh.case_law.length >= 8 && mh.case_law.every((c) => /^(ע"א|רע"א) \d+\/\d{2}/.test(c.file) && /^\d{4}-\d{2}-\d{2}$/.test(c.date) && c.url.startsWith('https://supremedecisions.court.gov.il/') && ['settled', 'open'].includes(c.status) && c.point_he.length > 40), 'registry: every ruling has a file number, a date, the court\'s link, settled/open and the point in words');
check(mh.case_law.filter((c) => c.status === 'open').map((c) => c.code).join() === 'minor_cap,dependants', 'registry: the two open questions (the minor and the 10-year cap; the dependants after an expired claim)');
check(mh.tracks.length === 5 && mh.tracks.every((t) => /לא נקבע|לא נקבעה/.test(t.deadline_he) && t.url.startsWith('https://')) && /רק הגשת תובענה/.test(mh.tracks_he), 'registry: five Ministry of Health tracks, none with a deadline in the texts read, none stops the clock');
check(mh.bill_2004.medical_years === 18 && mh.bill_2004.medical_minor_years === 22 && /לא נחקק/.test(mh.bill_2004.status_he), 'registry: the 2004 bill (18 / 22 years for medical treatment) marked as never enacted');
check(ca.limitation.years === 7 && ca.limitation.adult_age === 18 && ca.limitation.war.from === '2023-10-07' && ca.limitation.war.to === '2024-04-06' && sh.torts.late_cap_years === 10 && sh.limitation.late_section === 'סעיף 8' && sh.limitation.incapacity_section === 'סעיף 11' && sh.insurance.limit_years === 3 && sh.insurance.limit_long_years === 5, 'reused, not duplicated: reg.car_accident 7 years / 18 / the war window; reg.injury_sheon s.89(2) 10 years, s.8, s.11, policy 3 / 5 years');

/* ---------- 2. The example: an adult, treated 10.1.2021, the damage itself discovered 5.9.2023, today 22.10.2026 ---------- */
const ex = E.htCompute(reg, U.EXAMPLE);
check(ex.ok && ex.lead.code === 'base' && ex.lead.plain === '2028-01-10' && ex.lead.added === 183 && ex.lead.deadline === '2028-07-11' && !isRestDay('2028-07-11'), 'example: 10.1.2021 + 7 years = 10.1.2028; the window 7.10.2023-6.4.2024 = 25+30+31+31+29+31+6 = 183 days; 10.1.2028 + 183 (21+29+31+30+31+30+11) = 11.7.2028, a Tuesday');
check(ex.daysLeft === 628, 'example: 22.10.2026 to 11.7.2028 = 9 + 30 + 31 + 365 + 31 + 29 + 31 + 30 + 31 + 30 + 11 = 628 days');
const exLate = rd(ex, 'damage_late');
check(exLate.kind === 'alt' && exLate.start === '2023-09-05' && exLate.deadline === '2031-03-07' && !exLate.capped, 'example, the damage discovered 5.9.2023 (s.89(2)): 5.9.2030 + 183 days (25+31+30+31+31+28+7) = 7.3.2031, a Friday');
check(ex.cap.raw === '2031-07-12' && sat('2031-07-12') && ex.cap.deadline === '2031-07-13', 'example: the 10-year cap 10.1.2031 + 183 = 12.7.2031, a Saturday -> 13.7.2031; later than 7.3.2031, so it does not bite');
check(ex.status === 'running' && has(ex.flags, 'war') && has(ex.flags, 'late_damage') && has(ex.flags, 'state') && !has(ex.flags, 'expired'), 'example flags: the war days, the late-discovery rule, the State; not expired');

/* ---------- 3. Adult, simple ---------- */
const adult = run({ treatment: '2025-03-12' });
check(adult.lead.deadline === '2032-03-12' && adult.lead.added === 0 && adult.readings.length === 1 && has(adult.flags, 'damage_day'), 'adult treated 12.3.2025: 7 years = 12.3.2032 (a Friday), no war days (the period began after 6.4.2024), one reading; a note that a later damage counts from its day');
const policy = run({ treatment: '2025-03-12', policy: 'health' });
check(policy.pol.years === 5 && policy.pol.deadline === '2030-03-12' && policy.pol.warns.map((w) => w.date).join() === '2029-03-12,2029-12-12', 'own health policy (Insurance Contract Law s.31): 5 years to 12.3.2030; the insurer warns 12 and 3 months before (s.31A(b)): 12.3.2029, 12.12.2029');
const acc = run({ treatment: '2025-03-12', policy: 'accident', policyRight: '2025-06-01' });
check(acc.pol.years === 3 && acc.pol.fromRight && acc.pol.deadline === offRestDays('2028-06-01', ca.independence_days), 'personal-accident / disability policy: 3 years from the day the right arose (1.6.2025) = 1.6.2028');

/* ---------- 4. Minors (s.10), injured at birth, and the parents ---------- */
const birth = run({ treatment: '2020-06-01', birth: '2020-06-01' });
check(birth.minor && birth.lead.start === '2038-06-01' && birth.lead.deadline === '2045-06-01' && ev(birth, 'adult') === '2038-06-01', 'injured at birth 1.6.2020: the 7 years run from the 18th birthday 1.6.2038 to 1.6.2045, the 25th birthday (s.10; רע"א 4288/15: "even if the cause arose on the day of birth")');
check(birth.parents && birth.parents.deadline === '2027-12-01' && birth.parents.added === 183 && has(birth.flags, 'parents'), 'injured at birth: the parents\' own claim (their expenses, wrongful birth) runs 7 years from the birth: 1.6.2027 + 183 war days = 1.12.2027');
check(birth.lead.cases.includes('minor_25') && birth.parents.cases.includes('minor_25'), 'the minor\'s and the parents\' readings cite רע"א 4288/15');
const minorNo = run({ treatment: '2020-06-01', minor: true });
check(minorNo.ok && minorNo.lead.deadline === offRestDays('2027-12-01', ca.independence_days) && has(minorNo.flags, 'minor_birth'), 'a minor without a birth day: the tool counts 7 years from the treatment (the earliest) and asks for the birth day');
const sat18 = run({ treatment: '2013-05-10', birth: '2008-10-24' });
check(sat('2026-10-24') && sat18.lead.start === '2026-10-24' && sat18.lead.deadline === '2033-10-24' && !sat18.lead.rolled, 'an 18th birthday on a Saturday (24.10.2026): the start does not move, only a last day does; 24.10.2033 is a Monday');
const sat25 = run({ treatment: '2010-01-01', birth: '2008-10-08' });
check(sat('2033-10-08') && sat25.lead.deadline === '2033-10-09' && sat25.lead.rolled && has(sat25.flags, 'rest'), 'a 25th birthday on a Saturday (8.10.2033): the last day moves to Sunday 9.10.2033 (Interpretation Law s.10(c))');
check(!run({ treatment: '2020-06-01', birth: '2020-06-02' }).ok, 'error: a birth day after the treatment');

/* ---------- 5. Late discovery: the damage itself (s.89(2), the cap) and the link to the treatment (s.8, no cap) ---------- */
const a9 = run({ treatment: '2015-02-01', discovered: '2024-02-01' });
check(a9.lead.deadline === '2022-02-01' && rd(a9, 'damage_late').capped && rd(a9, 'damage_late').deadline === '2025-08-03' && a9.status === 'expired', 'adult, the damage discovered 9 years later (1.2.2024): 7 years from the treatment ended 1.2.2022; s.89(2) caps at 10 years from the damage: 1.2.2025 + 183 war days (27+31+30+31+30+31+3) = 3.8.2025, already past');
const a9l = run({ treatment: '2015-02-01', discovered: '2024-02-01', found: 'link' });
check(rd(a9l, 'link_late').deadline === '2031-04-09' && rd(a9l, 'link_late').raw === '2031-04-08' && isRestDay('2031-04-08') && a9l.status === 'expired-safe', 'the same, but the damage was known and the link to the treatment was not (s.8, no cap: רע"א 901/07, ע"א 4275/10): 1.2.2031 + 66 war days (29+31+6) = 8.4.2031, the first day of Passover -> 9.4.2031');
check(rd(a9l, 'link_late').cases.includes('no_cap_link') && rd(a9l, 'link_late').cases.includes('objective') && /קצה חוט/.test(rd(a9l, 'link_late').cond), 'the s.8 reading states its condition: the objective test (רע"א 1101/20), a "loose end" starts the clock');
const m9 = run({ treatment: '2017-03-01', birth: '2017-03-01', discovered: '2026-03-01' });
check(m9.lead.code === 'damage_late' && m9.lead.kind === 'open' && m9.lead.deadline === '2027-08-31' && has(m9.flags, 'minor_cap'), 'a minor injured at birth (1.3.2017), the damage discovered at 9 (1.3.2026): the strict reading of the open question caps at 10 years from the damage, 1.3.2027 + 183 (30+30+31+30+31+31) = 31.8.2027: the safe day');
check(rd(m9, 'damage_late_minor').deadline === '2042-03-02' && rd(m9, 'base').kind === 'alt' && rd(m9, 'base').deadline === '2042-03-02' && sat('2042-03-01'), 'the lenient reading (the cap counted from 18) and the knowable-at-birth reading: 7 years from the 18th birthday, 1.3.2042, a Saturday -> 2.3.2042');
check(m9.parents.deadline === '2024-09-01' && m9.parents.raw === '2024-08-31' && sat('2024-08-31'), 'the parents of that child: 1.3.2024 + 183 = 31.8.2024, a Saturday -> 1.9.2024 (already past)');
const after = run({ treatment: '2012-01-01', discovered: '2023-01-01' });
check(after.capBeforeDiscovery && rd(after, 'damage_late').deadline === '2022-01-02' && has(after.flags, 'cap_before') && after.status === 'expired', 'the damage discovered after the cap: 10 years from 1.1.2012 = 1.1.2022, a Saturday -> 2.1.2022, before the discovery on 1.1.2023: barred by s.89(2); a flag explains s.8 (the link) has no cap');
const afterL = run({ treatment: '2012-01-01', discovered: '2023-01-01', found: 'link' });
check(rd(afterL, 'link_late').deadline === '2030-07-03' && afterL.status === 'expired-safe', 'the same with the link discovered late (s.8): 1.1.2030 + 183 (30+28+31+30+31+30+3) = 3.7.2030');
check(!run({ treatment: '2021-01-10', discovered: '2020-01-01' }).ok && !run({ treatment: '2021-01-10', discovered: '2026-11-01' }).ok, 'error: a discovery before the treatment, or after today');

/* ---------- 6. The war window (s.15A): (a) a running period, (c)-(d) one that ended before the amendment ---------- */
const w16 = run({ treatment: '2016-11-01' });
check(w16.lead.deadline === '2023-11-01' && rd(w16, 'war_revived').deadline === '2024-05-02' && has(w16.flags, 'war_revived'), 'treated 1.11.2016: 7 years ended 1.11.2023, after 7.10.2023 and before 25.1.2024: the safe day is 1.11.2023; s.15A(c) revives it to 2.5.2024 unless the court decides otherwise (s.15A(d))');
const w17 = run({ treatment: '2017-03-01' });
check(w17.lead.added === 183 && w17.lead.raw === '2024-08-31' && w17.lead.deadline === '2024-09-01' && !has(w17.flags, 'war_revived'), 'treated 1.3.2017: 7 years end 1.3.2024, after the amendment (s.15A(a)): + 183 = 31.8.2024, a Saturday -> 1.9.2024');
const w23 = run({ treatment: '2023-12-01' });
check(w23.lead.added === 128 && w23.lead.raw === '2031-04-08' && w23.lead.deadline === '2031-04-09', 'treated inside the window (1.12.2023): 1.12.2023-6.4.2024 = 31+31+29+31+6 = 128 days; 1.12.2030 + 128 = 8.4.2031, Passover -> 9.4.2031');
check(run({ treatment: '2024-05-01' }).lead.added === 0 && run({ treatment: '2016-05-01' }).lead.added === 0, 'no war days for a period that began after 6.4.2024 or ended before 7.10.2023');

/* ---------- 7. Feb 29 ---------- */
const f29 = run({ treatment: '2024-02-29' });
check(f29.lead.plain === '2031-02-28' && f29.lead.added === 38 && f29.lead.deadline === '2031-04-07', 'treated on 29.2.2024: 7 years later is 28.2.2031 (no 29th); the war days left 29.2-6.4.2024 = 1+31+6 = 38; 28.2.2031 + 38 = 7.4.2031, a Monday');

/* ---------- 8. A claim filed (s.5) and one dismissed so that a new one can be filed (ss.15-16) ---------- */
const fOk = run({ treatment: '2021-01-10', discovered: '2023-09-05', filed: '2026-05-01' });
check(fOk.filedStatus === 'ok' && fOk.status === 'filed' && fOk.daysLeft === null && ev(fOk, 'filed') === '2026-05-01', 'filed 1.5.2026, before the safe day 11.7.2028: the clock stopped (s.5); no days counted down');
const fAlt = run({ treatment: '2018-05-01', discovered: '2019-06-01', filed: '2025-11-15' });
check(fAlt.lead.deadline === '2025-10-31' && rd(fAlt, 'damage_late').deadline === '2026-12-01' && fAlt.filedStatus === 'alt' && fAlt.status === 'filed-alt', 'treated 1.5.2018: the safe day 1.5.2025 + 183 = 31.10.2025; filed 15.11.2025, after it but before the late-discovery day 1.6.2026 + 183 = 1.12.2026: in time only if the late discovery is proven');
check(run({ treatment: '2012-01-01', filed: '2026-01-01' }).filedStatus === 'late', 'filed after every computed day: late, an exception is needed');
const dis = run({ treatment: '2018-05-01', filed: '2025-06-01', dismissed: '2026-03-01' });
check(dis.lead.pending === 273 && dis.lead.deadline === '2027-03-01' && dis.lead.floor === 'dismissed' && dis.status === 'last-year' && dis.daysLeft === 130, 'filed 1.6.2025, struck out 1.3.2026 (273 days pending, s.15): 31.10.2025 + 273 = 31.7.2026, but not before a year from the dismissal (s.16): 1.3.2027; 130 days left');
check(!run({ treatment: '2018-05-01', dismissed: '2026-03-01' }).ok && !run({ treatment: '2018-05-01', filed: '2025-06-01', dismissed: '2025-05-01' }).ok, 'error: a dismissal without a filing day, or before it');

/* ---------- 9. A death: the estate (Ordinance s.19, Limitation Law s.18) and the dependants (s.78-79) ---------- */
const d1 = run({ treatment: '2022-05-10', death: '2025-02-01' });
check(d1.lead.deadline === '2029-11-09' && d1.dependants.deadline === '2032-02-01' && d1.dependants.kind === 'safe' && ev(d1, 'who_files') === '2025-08-01', 'treated 10.5.2022, died 1.2.2025: the estate keeps 10.5.2029 + 183 = 9.11.2029; the dependants 7 years from the death, 1.2.2032; from 1.8.2025 any dependant may file for all (s.79)');
const d2 = run({ treatment: '2018-01-01', death: '2025-04-01' });
check(d2.lead.deadline === '2026-04-01' && d2.lead.floor === 'death', 'died 1.4.2025 when the patient\'s own claim ended 3.7.2025: s.18 keeps at least a year from the death: 1.4.2026');
const d3 = run({ treatment: '2010-01-01', death: '2020-01-01' });
check(d3.ownEndedBeforeDeath && d3.dependants.kind === 'open' && d3.dependants.deadline === '2027-07-04' && has(d3.flags, 'own_ended'), 'the patient\'s own claim ended (1.1.2017) before the death (1.1.2020): the estate has none by the rule; the dependants\' 7 years (1.1.2027 + 183 = 3.7.2027, a Saturday -> 4.7.2027) are an open question (רע"א 901/07)');
const d4 = run({ treatment: '2015-03-01', birth: '2015-03-01', death: '2023-03-01' });
check(d4.diedMinor && d4.lead.deadline === '2024-09-01' && rd(d4, 'estate_hendel').deadline === '2030-09-01' && rd(d4, 'estate_hendel').kind === 'open', 'a child injured at birth who died at 8 (1.3.2023): the minor\'s stay does not pass to adult heirs (ע"א 9154/09): a year from the death, 1.3.2024 + 183 = 31.8.2024 (Saturday) -> 1.9.2024; Hendel J.: 7 years from the death, 1.3.2030 + 183 -> 1.9.2030');
check(!d4.parents && !run({ treatment: '2022-05-10', death: '2022-01-01' }).ok, 'a death: no separate parents\' reading (they are dependants); error: a death before the treatment');

/* ---------- 10. A mental or intellectual impairment without a guardian (s.11, s.16) ---------- */
const inc = run({ treatment: '2020-01-01', incap: true, incapTo: '2023-01-01' });
check(rd(inc, 'incapacity').extra === 1097 && rd(inc, 'incapacity').deadline === '2030-07-04' && inc.lead.deadline === '2027-07-04', 'impaired from the treatment 1.1.2020 to 1.1.2023: 366+365+365+1 = 1,097 days not counted: 3.7.2027 + 1,097 = 4.7.2030 (a condition, never the safe day, which stays 4.7.2027)');
const incOn = run({ treatment: '2020-01-01', incap: true });
check(rd(incOn, 'incapacity').kind === 'open' && rd(incOn, 'incapacity').deadline === null && incOn.lead.deadline === '2027-07-04', 'an impairment still going: no date is guessed; the safe day stays');
const incShort = run({ treatment: '2026-01-01', incap: true, incapFrom: '2026-02-01', incapTo: '2026-03-01' });
check(rd(incShort, 'incapacity').extra === 29 && rd(incShort, 'incapacity').deadline === offRestDays('2033-01-30', ca.independence_days), 'an impairment 1.2-1.3.2026 = 29 days: 1.1.2033 + 29 = 30.1.2033; s.16\'s two years (1.3.2028) are earlier');

/* ---------- 11. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ treatment: '' }, 'treatment') && err({ treatment: '31.2.2026' }, 'treatment') && err({ treatment: '2026-10-23' }, 'treatment'), 'error: an empty, impossible or future treatment day');
check(err({ treatment: '2021-01-10', filed: '2020-01-01' }, 'filed') && err({ treatment: '2021-01-10', death: '2027-01-01' }, 'death') && err({ treatment: '2021-01-10', incap: true, incapFrom: '2022-01-01', incapTo: '2021-06-01' }, 'incapTo'), 'error: a filing before the treatment, a death after today, an impairment that ends before it starts');
check(run({ treatment: '10.1.2021', discovered: '5.9.23' }).lead.deadline === '2028-07-11', 'dates typed the Israeli way (10.1.2021, 5.9.23) are read');

/* ---------- 12. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.result.includes('11.7.2028') && s.sentence.includes('11.7.2028') && s.sentence.includes('7.3.2031') && s.total === 628 && s.sticky.includes('11.7.2028'), 'snapshot: the example figures (11.7.2028, 7.3.2031, 628 days)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><bdi>11\.7\.2028<\/bdi><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת') && s.lead.includes('7.3.2031'), 'lead card: the example\'s safe day, the conditional day, the jump to the form');
check((s.form.match(/data-preset=/g) || []).length === 5 && !s.form.includes('aria-pressed="true"') && s.form.includes('id="jt70-tr"'), 'form: 5 one-click profiles (the fixed example matches none), the treatment field');
check(U.renderForm(reg, U.htPreset('birth', T)).includes('aria-pressed="true"') && U.htPreset('birth', T).birth === '2020-10-22' && U.htPreset('late', T).discovered === '2024-10-22', 'presets relative to today: injured at birth 6 years ago (22.10.2020), its button pressed; late: the damage 2 years ago');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 19 && s.method.includes('jtool-cite'), 'page table: header + 18 rules with a caption; the method cites');
check(s.result.includes('jt70-rib') && (s.result.match(/class="jt70-lane /g) || []).length === 2 && s.result.includes('jt70-lane--lead') && s.result.includes('jt70-war') && s.result.includes('jt70-now') && s.result.includes('jt70-cap') && s.result.includes('jtool-visually-hidden'), 'the ribbon: two lanes (safe, late discovery), the war band, today, the 10-year cap line, a text equivalent');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('11.7.2028') && br.includes('10.1.2021') && br.includes('חקירה נגדית של המומחה') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br), `aiBrief: ${words} words, the key dates, the expert's cross-examination, no 9-digit run`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=witness_prep') && s.result.includes('topic=medical-malpractice') && handoffState('x', br, 'witness_prep').simulationPurpose === 'witness_prep', 'the brief under its h4; the rehearsal is witness_prep on medical-malpractice');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official.every((x) => /^https:\/\/www\.(nevo\.co\.il|gov\.il)\//.test(x.url)) && na.links.length >= 2 && na.links.length <= 4 && na.links.some((x) => x.path.startsWith('/obtaining-medical-records-copy/#s=')) && na.links.some((x) => x.path.startsWith('/what-is-medical-malpractice-definition-examples/#s=')), 'next actions: the record (s.18) and the Ministry route first, then 2-4 internal links incl. the records tool and the case check with the dates of the reader');
const RS_KEYS = ['w', 'p', 'o', 'd', 'm', 'f', 't', 'b', 'x', 'n'];
const TK_KEYS = ['k', 'p', 'e', 'b', 'o', 'h', 'i', 'u', 'x', 'g'];
const rsOf = (r) => decodeState(U.recordsLink(r).split('#')[1], RS_KEYS);
const tkOf = (r) => decodeState(U.caseLink(r).split('#')[1], TK_KEYS);
check(rsOf(ex).w === 's' && rsOf(ex).t === '2021-01-10' && !rsOf(ex).b && rsOf(birth).w === 'p' && rsOf(birth).b === '2020-06-01' && rsOf(d1).w === 'h' && rsOf(d1).x === '2025-02-01', 'cross-link to the records tool (its keys w, t, b, x): the patient, a parent of a child who is still a minor, an heir with the death day');
check(tkOf(ex).p === 'a' && tkOf(ex).e === '2021-01-10' && tkOf(ex).g === '2023-09-05' && tkOf(birth).k === 'b' && tkOf(birth).p === 'b' && !tkOf(birth).b && tkOf(sat18).p === 'm' && tkOf(sat18).b === '2008-10-24' && tkOf(d1).o === 'd', 'cross-link to the case check (its keys k, p, e, b, o, g): adult with the discovery day; an injury at birth (k=b, p=b); a minor with the birth day; a death');
check(!/[א-ת]/.test(U.recordsLink(d4) + U.caseLink(m9)) && U.recordsLink({ ok: false }) === '/obtaining-medical-records-copy/', 'cross-links: dates and codes only; without a result, the page itself');
const q = (x) => x.replace(/"/g, '&quot;');
check(!s.result.includes(q('ע"א 1254/99')) && s.details.includes(q('ע"א 1254/99')) && s.result.includes(q('רע"א 901/07')) && s.result.includes('supremedecisions.court.gov.il'), 'case law: the result names the rulings that bear on it, the details list all, each linked to the court');
check(U.tracksTable(reg, policy).includes('jt70-mine') && (U.tracksTable(reg, ex).match(/<td data-th="עוצר את השעון\?">לא<\/td>/g) || []).length === 5, 'tracks: five Ministry routes, each "does not stop the clock"; the policy row when a policy is chosen');
const icsText = ics(ex.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20280711') && icsText.includes('DTSTART;VALUE=DATE:20310307') && icsText.includes('DTSTART;VALUE=DATE:20310713') && (icsText.match(/BEGIN:VEVENT/g) || []).length === ex.events.length, 'ics: the safe day, the conditional day and the cap (11.7.2028, 7.3.2031, 13.7.2031), one event each');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('11.7.2028') && s.details.includes('jt70-print'), 'print summary: result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('1.10.1968') && s.details.includes('25.1.2024') && s.details.includes('לא נחקק'), 'what changed and when: 1.10.1968, Amendment 8 on 25.1.2024, the 2004 bill marked as not enacted');
const st = U.stateOf(Object.assign({}, U.EXAMPLE, { minor: true, birth: '2010-01-01', treatment: '2021-01-10', found: 'link', death: '2025-01-01', incap: true, incapTo: '2022-01-01', filed: '2026-01-01', dismissed: '2026-02-01', policy: 'health', policyRight: '2021-02-01' }));
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.treatment === '2021-01-10' && back.minor && back.birth === '2010-01-01' && back.found === 'link' && back.death === '2025-01-01' && back.incap && back.incapTo === '2022-01-01' && back.filed === '2026-01-01' && back.dismissed === '2026-02-01' && back.policy === 'health' && back.policyRight === '2021-02-01', 'share state: stateOf -> decodeState -> inputOf round trip');
const link = U.stateLink(reg, U.EXAMPLE);
const fromLink = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link === '/medical-malpractice-statute-of-limitations/#s=t2021-01-10/c2023-09-05/wd' && E.htCompute(reg, Object.assign(fromLink, { today: T })).lead.deadline === ex.lead.deadline, 'stateLink: /medical-malpractice-statute-of-limitations/#s=t2021-01-10/c2023-09-05/wd decodes to the same safe day');
const part = U.inputOf(decodeState('c2023-09-05/wd', U.KEYS), U.EXAMPLE);
check(part && part.treatment === U.EXAMPLE.treatment && part.filled.join() === 'treatment' && U.inputOf(decodeState('c2023-09-05', U.KEYS)) === null, 'a partial state (no treatment day) takes it from the example and says so; without a base it is refused');
check(!/[א-ת]/.test(st) && !st.includes('@') && !/[א-ת]/.test(link), 'share state: dates and codes only, no Hebrew, no free text');
for (const r of [ex, adult, birth, minorNo, sat25, a9, a9l, m9, after, w16, w23, f29, fOk, fAlt, dis, d1, d3, d4, inc, incOn, policy]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r, { today: r.today }) + U.leadCard(reg, r) + U.aiBrief(reg, r) + U.verdictSentence(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.htBand(r)})`);
}
const errHtml = U.renderResult(reg, run({ treatment: '' })) + U.leadCard(reg, run({ treatment: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');
check(U.aiBrief(reg, d4).includes('נפטר') && U.leadCard(reg, fOk).includes('השעון נעצר') && U.verdictSentence(reg, m9).includes('הקריאה המקילה'), 'texts follow the case: a death in the brief, a filed claim in the lead card, the lenient reading named in the sentence');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
