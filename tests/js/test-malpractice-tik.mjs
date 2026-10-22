/**
 * Golden tests for the medical-malpractice case check (tik-rashlanut, the medical-malpractice wave, 22.10.2026, HAD-594).
 * Run: node tests/js/test-malpractice-tik.mjs
 *
 * Every expected value is set by hand from the official texts read on 22.10.2026: the Civil Wrongs Ordinance (Nevo, current
 * to 18.9.2023: s.2 damage, s.35 negligence, s.36 duty, s.41 "the thing speaks for itself" and its three conditions, s.19(a)
 * the estate, s.78 the dependants, s.89(2) late discovery), the Patients' Rights Law (current to 6.4.2025: s.13 informed
 * consent, s.14(b) written for the First Schedule, s.15(3) emergency, s.17(a) the record, s.18(a) a copy, s.21 the inquiry
 * committee, s.22 the quality committee, s.25 the rights officer, s.34 the Dentists Ordinance s.45), the Civil Procedure
 * Regulations 2018 (current to 19.10.2026: reg. 87(a) the medical opinion attached to the claim, 87(c) 60 days, 87(d) the
 * exemption, 88(a) and (d) the court expert, 91(c) 14 days, 93(a) the sanction, 180(c) in force from 1.1.2021), the Physicians
 * Ordinance s.41 and s.44(a), the Ministry of Health complaint pages, the State Comptroller's report 62 p.217 and footnotes 37-38
 * (the case law named in words), and reg.car_accident.limitation (7 years, Limitation Law s.5(1); from 18, s.10; the war window
 * 7.10.2023-6.4.2024, s.15A; a last day on a rest day moves, Interpretation Law s.10(c)).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/tik-engine.js';
import * as U from '../../assets/js/tools/tik-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { addDays, addYears, offRestDays, isRestDay, daysBetween } from '../../assets/js/tools/dates.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.tkCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const T = reg.malpractice_tik;
const ca = reg.car_accident;
const IND = ca.independence_days;
const st = (r) => r.elements.map((e) => e.status).join(',');
const el = (r, code) => r.elements.find((e) => e.code === code);
const has = (list, code) => list.some((x) => x.code === code);

/* ---------- 1. The registry ---------- */
check(T && T.checked_on === '2026-10-22' && T.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: malpractice_tik checked 22.10.2026, next update 1.1.2027');
const urls = JSON.stringify(T).match(/https?:\/\/[^"]+/g) || [];
check(urls.length >= 10 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|www\.gov\.il|library\.mevaker\.gov\.il|supremedecisions\.court\.gov\.il|fs\.knesset\.gov\.il)\//.test(u)), `registry: all ${urls.length} source links are official (Nevo, gov.il, the State Comptroller, the Supreme Court, the Knesset)`);
check(!/kolzchut|wikipedia|wikisource|כל זכות|כל-זכות|כל־זכות/.test(JSON.stringify(T)), 'registry: no private portal, no Wikipedia or Wikisource');
check(T.torts.negligence_section === 'סעיף 35' && T.torts.duty_section === 'סעיף 36' && T.torts.damage_section === 'סעיף 2' && T.torts.res_ipsa_section === 'סעיף 41' && T.torts.res_ipsa_conditions_he.length === 3 && T.torts.dependants_section === 'סעיף 78', 'registry: Civil Wrongs Ordinance ss.35, 36, 2, 41 (three conditions), 78');
check(T.patient.consent_section === 'סעיף 13' && T.patient.consent_items_he.length === 5 && T.patient.written_section === 'סעיף 14(ב)' && T.patient.emergency_section === 'סעיף 15(3)' && T.patient.record_section === 'סעיף 17(א)' && T.patient.access_section === 'סעיף 18(א)' && T.patient.inquiry_section === 'סעיף 21', 'registry: Patients\' Rights Law s.13 (five items), 14(b), 15(3), 17(a), 18(a), 21');
check(T.procedure.expert_section === 'תקנה 87(א)' && T.procedure.counter_days === 60 && T.procedure.questions_days === 14 && T.procedure.sanction_section === 'תקנה 93(א)' && T.procedure.agreed_section === 'תקנה 88(ד)' && T.procedure.current_to === '2026-10-19', 'registry: Civil Procedure Regulations 2018 reg. 87(a), 60 days (87(c)), 14 days (91(c)), 93(a), 88(d); current to 19.10.2026');
check(T.caselaw.evidentiary_file === 'ע"א 9328/02' && T.caselaw.autonomy_files.join() === 'ע"א 2781/93,ע"א 9936/07' && T.caselaw.chance_file === 'דנ"א 4693/05' && T.caselaw.outside_basket_file === 'ע"א 4960/04', 'registry: the case law named in words with its file numbers (9328/02; 2781/93, 9936/07; 4693/05; 4960/04)');
check(T.discipline.section === 'סעיף 41' && T.discipline.dentist_section === 'סעיף 45' && T.tracks.complaint_url.startsWith('https://www.gov.il/he/service/') && T.changes.some((c) => c.from === '2021-01-01'), 'registry: Physicians Ordinance s.41, Dentists Ordinance s.45; the complaint service on gov.il; regs in force 1.1.2021');
check(ca.limitation.years === 7 && ca.limitation.adult_age === 18 && ca.limitation.war.from === '2023-10-07' && ca.limitation.war.to === '2024-04-06', 'reused reg.car_accident.limitation: 7 years, 18, the war window 7.10.2023-6.4.2024 (read, never repeated)');

/* ---------- 2. The example: surgery, under anesthesia, permanent damage, 10.6.2025, today 22.10.2026 ---------- */
const ex = E.tkCompute(reg, EX);
check(ex.ok && EX.event === '2025-06-10' && EX.today === '2026-10-22' && ex.daysSince === 499, 'example: surgery on 10.6.2025, 499 days before 22.10.2026 (365 + 20 + 31 + 31 + 30 + 22)');
check(st(ex) === 'facts,prove,prove,facts,prove' && ex.counts.facts === 2 && ex.counts.prove === 3 && ex.counts.missing === 0, 'example: duty and damage point by the facts; breach, causation and consent to prove: 2 of 5');
check(ex.deadline === '2032-06-10' && !isRestDay('2032-06-10') && ex.people.length === 1 && ex.people[0].added === 0, 'example: 10.6.2025 + 7 years = 10.6.2032, a Thursday, no war days (s.5(1))');
check(ex.daysLeft === 2058, 'example: 22.10.2026 to 10.6.2032 = 5 × 365 + 1 (29.2.2028) + 232 (9 + 30 + 31 + 31 + 29 + 31 + 30 + 31 + 10) = 2,058 days');
check(el(ex, 'consent').why.includes('סעיף 14(ב)') && el(ex, 'breach').proves[0].includes('תקנה 87(א)') && el(ex, 'breach').proves[0].includes('הכירורגי'), 'example: surgery needs written consent (s.14(b), First Schedule); the breach is proved by a surgical expert (reg. 87(a))');
check(ex.burden.map((b) => b.code).join() === 'rule,evidentiary_check,res_ipsa,autonomy' && ex.burden.find((b) => b.code === 'res_ipsa').level === 'ok', 'example burden: the rule; the record check; s.41 marked (under anesthesia: the first condition); autonomy (consent unknown)');

/* ---------- 3. The five elements, case by case ---------- */
const consentOnly = run({ kind: 'consent', outcome: 'none', informed: 'no', unaware: false, have: ['consent'] });
check(st(consentOnly) === 'facts,missing,missing,prove,facts' && el(consentOnly, 'damage').why.includes('2781/93'), 'the explanation only, no bodily damage: breach and causation missing; autonomy damage to prove (2781/93); consent facts');
const opinion = run({ have: ['discharge', 'opinion'] });
check(el(opinion, 'breach').status === 'facts' && el(opinion, 'causation').status === 'facts' && opinion.counts.facts === 4 && opinion.expert.have, 'an expert opinion in hand: breach and causation point by the facts (4 of 5)');
const none = run({ outcome: 'none' });
check(el(none, 'causation').status === 'missing' && el(none, 'damage').status === 'missing' && has(none.flags, 'no_damage') && el(none, 'damage').why.includes('סעיף 89(2)'), 'no damage: causation and damage missing; a flag; late discovery s.89(2) named');
const death = run({ outcome: 'death' });
check(el(death, 'damage').status === 'facts' && el(death, 'damage').notes[0].includes('סעיף 19(א)') && el(death, 'damage').notes[0].includes('סעיף 78') && has(death.flags, 'death'), 'death: damage by the facts; the estate (s.19(a)) and the dependants (s.78); the clock computes the dependants\' date');
check(el(run({ informed: 'yes' }), 'consent').status === 'missing' && el(run({ informed: 'no' }), 'consent').status === 'facts' && el(run({ informed: 'emergency' }), 'consent').why.includes('סעיף 15(3)'), 'informed consent: explained -> missing; not explained -> facts; an emergency -> to prove under s.15(3)');
const second = run({ have: ['second'] });
check(el(second, 'breach').status === 'prove' && el(second, 'breach').notes.some((n) => n.includes('רופא אחר')), 'a second doctor who said there was a mistake: a lead, not proof; the breach stays to prove');
const miss = run({ missing: true });
check(miss.burden.find((b) => b.code === 'evidentiary').level === 'ok' && miss.burden.find((b) => b.code === 'evidentiary').he.includes('9328/02') && miss.burden.find((b) => b.code === 'evidentiary').he.includes('סעיף 17(א)') && el(miss, 'breach').notes.some((n) => n.includes('נזק הראייתי')), 'a missing record: the evidentiary damage (9328/02) on the duty to keep a record (s.17(a)); noted on the breach');
const diag = run({ kind: 'diagnosis', unaware: false, outcome: 'progress' });
check(has(diag.burden, 'chance') && diag.burden.find((b) => b.code === 'chance').he.includes('4693/05') && has(diag.burden, 'basket') && !has(diag.burden, 'res_ipsa'), 'a late diagnosis: the lost-chance question in words (4693/05), the tests outside the basket (4960/04); s.41 not marked');
const surgSeen = run({ unaware: false });
check(surgSeen.burden.find((b) => b.code === 'res_ipsa').level === 'info' && !surgSeen.burden.find((b) => b.code === 'res_ipsa').he.includes('סימנתם'), 'surgery, not marked unaware: s.41 shown as information only');
const dental = run({ kind: 'dental', unaware: false });
check(dental.tracks.find((t) => t.code === 'discipline').he.includes('סעיף 45') && dental.expert.field.includes('שיניים'), 'dental: the Dentists Ordinance s.45 for discipline; a dental expert');

/* ---------- 4. Births: the baby from 18, the mother from the birth ---------- */
const baby = run({ kind: 'birth', patient: 'baby', event: '2025-09-01', unaware: false });
check(baby.people[0].who === 'baby' && baby.people[0].start === '2043-09-01' && baby.deadline === '2050-09-01', 'birth, the baby: born 1.9.2025, from the 18th birthday 1.9.2043, 7 years: 1.9.2050 (s.10, s.5(1))');
const both = run({ kind: 'birth', patient: 'both', event: '2025-09-01', unaware: false });
check(both.people.map((p) => `${p.who}:${p.deadline}`).join() === 'baby:2050-09-01,mother:2032-09-01' && both.deadline === '2032-09-01' && has(both.flags, 'two'), 'birth, both: the baby 1.9.2050, the mother 1.9.2032; the safe (earliest) date first: 1.9.2032');
check(baby.evidence.find((x) => x.code === 'kind').docs.includes('רצועות הניטור העוברי המלאות') && baby.expert.field.includes('מיילדות'), 'birth: the monitor strips on the evidence list; an obstetrics expert');
check(E.tkPatient('birth', 'adult') === 'baby' && E.tkPatient('surgery', 'baby') === 'adult' && E.tkPatient('surgery', 'minor') === 'minor', 'patient options fit the kind: a birth has baby / mother / both; otherwise adult / minor');
const sat25 = run({ kind: 'birth', patient: 'baby', event: '2025-09-03' });
check(new Date('2050-09-03T00:00:00Z').getUTCDay() === 6 && sat25.deadline === '2050-09-04' && sat25.people[0].rolled, 'edge: a baby born 3.9.2025: the 25th birthday 3.9.2050 is a Saturday, so the last day is 4.9.2050 (Interpretation Law s.10(c))');
const sat18 = run({ kind: 'birth', patient: 'baby', event: '2025-09-05' });
check(isRestDay('2043-09-05') && sat18.people[0].start === '2043-09-05' && sat18.deadline === offRestDays('2050-09-05', IND), 'edge: the 18th birthday on a Saturday (5.9.2043) still starts the period that day; only a last day moves');

/* ---------- 5. Minors (Limitation Law s.10) ---------- */
const minor = run({ patient: 'minor', birth: '2014-03-01', event: '2026-01-15' });
check(minor.people[0].minor && minor.people[0].start === '2032-03-01' && minor.deadline === offRestDays('2039-03-01', IND), 'minor, born 1.3.2014, treated 15.1.2026 at 11: from 1.3.2032 (18), to 1.3.2039');
const minorNo = run({ patient: 'minor', birth: '', event: '2026-01-15' });
check(minorNo.ok && minorNo.deadline === null && has(minorNo.flags, 'minor_birth') && minorNo.people.length === 0, 'minor without a birth day: no date is guessed; a flag asks for it');
check(!run({ patient: 'minor', birth: '2008-01-15', event: '2026-01-15' }).ok && run({ patient: 'minor', birth: '2008-01-16', event: '2026-01-15' }).ok, 'edge: treated on the 18th birthday -> an adult (an error asks to choose); one day before it -> still a minor');
check(!run({ patient: 'minor', birth: '2026-02-01', event: '2026-01-15' }).ok && !run({ patient: 'minor', birth: '1.13.2014', event: '2026-01-15' }).ok, 'error: a birth day after the treatment, or an impossible birth day');
check(run({ patient: 'adult', birth: '1990-01-01' }).deadline === '2032-06-10', 'adult: a birth day left in a hidden field is ignored');

/* ---------- 6. The war window (s.15A) and rest days ---------- */
const w17 = run({ event: '2017-01-01' });
check(w17.people[0].plain === '2024-01-01' && w17.people[0].added === 0 && w17.people[0].revived === '2024-07-02' && w17.deadline === '2024-01-01' && w17.expired && has(w17.flags, 'expired') && has(w17.flags, 'war_revived'), 'treated 1.1.2017: the 7 years ended 1.1.2024, inside the window and before the amendment (25.1.2024): safe 1.1.2024; 1.1.2024 + 183 days (25+30+31+31+29+31+6) = 2.7.2024 only if the court does not decide otherwise (s.15A(c)-(d)); expired today: a flag, never a verdict');
const w24 = run({ event: '2024-01-01' });
check(w24.people[0].added === 97 && w24.people[0].plain === '2031-01-01' && isRestDay('2031-04-08') && w24.deadline === '2031-04-09', 'treated 1.1.2024 inside the window: 31+29+31+6 = 97 days not counted -> 8.4.2031, a holiday (Pesach), so 9.4.2031');
const feb29 = run({ event: '2028-02-29', today: '2028-03-01' });
check(feb29.people[0].plain === '2035-02-28' && feb29.deadline === offRestDays('2035-02-28', IND), 'edge: 29.2.2028 + 7 years = 28.2.2035 (from the last day of a month, the last day of the target month)');
check(run({ event: '2024-04-07' }).people[0].added === 0, 'treated 7.4.2024, the day after the window: no war days');
const may = run({ event: '2024-05-01' }).deadline;
const atEdge = run({ event: '2024-05-01', today: may });
check(may === offRestDays('2031-05-01', IND) && !atEdge.expired && atEdge.daysLeft === 0 && run({ event: '2024-05-01', today: addDays(may, 1) }).expired && !has(atEdge.flags, 'expired'), `edge: treated 1.5.2024 (after the window): the last day ${may}; on that day not expired, 0 days left; the day after -> expired`);

/* ---------- 7. Late discovery and input errors ---------- */
const late = run({ discovered: '2026-03-01' });
check(late.ok && has(late.flags, 'late') && late.flags.find((f) => f.code === 'late').he.includes('סעיף 89(2)') && late.deadline === '2032-06-10', 'a later discovery: flagged with s.89(2), the plain date stays; the clock computes the late rule');
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ event: '' }, 'event') && err({ event: '31.2.2026' }, 'event') && err({ event: '2026-10-23' }, 'event'), 'error: an empty, impossible or future event day');
check(err({ discovered: '2025-06-09' }, 'discovered') && err({ discovered: '2026-10-23' }, 'discovered') && err({ discovered: 'xx' }, 'discovered'), 'error: a discovery before the event, after today, or not a date');
check(run({ event: '2026-10-22' }).ok && run({ event: '2026-10-22' }).daysSince === 0, 'edge: an event today is accepted (0 days since)');
check(run({ kind: 'nonsense', outcome: 'x', informed: 'y', have: ['x', 'record'] }).kind === 'surgery' && run({ have: ['x', 'record'] }).have.join() === 'record', 'unknown choices fall back to the defaults; unknown "have" items are dropped');

/* ---------- 8. The expert rule, the evidence, the tracks ---------- */
check(ex.expert.section === 'תקנה 87(א)' && ex.expert.rows.map((x) => x.section).join() === 'תקנה 87(ד),תקנה 93(א),תקנה 87(ב),תקנה 87(ג),תקנה 88(א),תקנה 88(ד),תקנה 91(ג)', 'expert rule: reg. 87(a), then 87(d), 93(a), 87(b), 87(c), 88(a), 88(d), 91(c)');
const evRec = ex.evidence.find((x) => x.code === 'record');
check(evRec.kind === 'law' && evRec.section === 'סעיף 18(א)' && !evRec.have && ex.evidence.find((x) => x.code === 'discharge').have && ex.evidence.find((x) => x.code === 'opinion').section === 'תקנה 87(א)', 'evidence: the record is a right (s.18(a)) and not yet held; the discharge letter is held; the opinion by reg. 87(a)');
check(ex.tracks.map((t) => t.code).join() === 'complaint,officer,inquiry,quality,discipline,nhi' && ex.tracks.every((t) => t.title && t.url.startsWith('https://')), 'tracks: the complaint, the rights officer, the inquiry committee, the quality committee, discipline, the HMO commissioner; each titled with an official link');
check(ex.tracks.find((t) => t.code === 'inquiry').he.includes('הממצאים והמסקנות נמסרים למטופל') && ex.tracks.find((t) => t.code === 'quality').he.includes('22(ה)'), 'tracks: inquiry findings go to the patient (s.21(b)); a quality committee\'s facts enter the record (s.22(e))');
check(E.tkBand(ex) === 'surgery-230' && E.tkBand({ ok: false }) === 'error', 'analytics band: the kind and the counts only (surgery-230)');

/* ---------- 9. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.result.includes('2</bdi> מתוך 5') && s.sentence.includes('10.6.2032') && s.total === 2 && s.sticky.includes('מתוך 5'), 'snapshot: the example figures (2 of 5, 10.6.2032)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(!all.includes('לא ייעוץ משפטי'), 'snapshot: "not legal advice" is left to the tool\'s footer line (never in the rendered parts)');
check(/<strong class="jtool-lead__figure"><bdi>2<\/bdi> מתוך 5<\/strong>/.test(s.lead) && s.lead.includes('10.6.2032') && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת'), 'lead card: the example\'s figure and its plain last day, the jump to the form');
check(s.form.includes('data-act="preset"') && (s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"'), 'form: 5 one-click profiles, the example pressed');
check((s.result.match(/class="jt68-tab jt68-tab--/g) || []).length === 5 && (s.result.match(/class="jt68-ft /g) || []).length === 5 && s.result.includes('jtool-visually-hidden') && s.result.includes('תיק המטופל'), 'the chart: five tabs and five file tabs, with a text equivalent');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 17 && s.method.includes('jtool-cite'), 'page table: header + 16 rules with a caption; the method cites');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('10.6.2025') && br.includes('10.6.2032') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול') && br.includes('חקירה נגדית של המומחה הרפואי') && br.trim().endsWith('?'), `aiBrief: ${words} words, the key dates, no 9-digit run, ends with the rehearsal question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=witness_prep') && s.result.includes('topic=medical-malpractice') && handoffState('x', br, 'witness_prep').simulationPurpose === 'witness_prep', 'the brief under its h4; witness_prep, topic medical-malpractice; the handoff state carries the purpose');
const brMiss = U.aiBrief(reg, miss);
check(brMiss.includes('הרשומה החסרה') && U.aiBrief(reg, consentOnly).includes('ההסבר שניתן לפני הטיפול') && !U.aiBrief(reg, consentOnly).includes('הקשר בין הטיפול לנזק'), 'aiBrief follows the result: a missing record is a topic; the explanation-only case rehearses the explanation, not causation');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url.startsWith('https://www.gov.il/') && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/')) && na.links.some((x) => x.path.startsWith('/medical-malpractice-surgery/')), 'next actions: the Ministry complaint first, then 2-4 internal links incl. the surgery page');
const icsText = ics(U.tkEvents(reg, both).map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20500901') && icsText.includes('DTSTART;VALUE=DATE:20320901') && icsText.includes('DTSTART;VALUE=DATE:20430901'), 'ics: the computed dates (the baby 1.9.2050, the mother 1.9.2032, the 18th birthday 1.9.2043)');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('10.6.2032') && s.details.includes('jt68-print'), 'print summary: the result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('1.1.2021') && s.details.includes('1996') && s.details.includes('2024'), 'what changed and when: 1996, 1.1.2021, 2024');
for (const r of [ex, consentOnly, opinion, none, death, second, miss, diag, dental, baby, both, minor, minorNo, w17, w24, late]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r, { today: r.today }) + U.leadCard(reg, r) + U.aiBrief(reg, r) + U.verdictSentence(reg, r);
	check(!bad(html) && !/<h2/i.test(html) && !html.includes('לא ייעוץ משפטי'), `render: no undefined/NaN/null, no <h2> (${E.tkBand(r)}, ${r.patient})`);
}
const errHtml = U.renderResult(reg, run({ event: '' })) + U.leadCard(reg, run({ event: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');

/* ---------- 10. Share state, stateLink and the partial link ---------- */
check(new Set(U.KEYS).size === U.KEYS.length && U.KEYS.every((k) => k.length === 1), 'KEYS: single, unique letters');
const full = Object.assign({}, EX, { kind: 'birth', patient: 'both', outcome: 'death', have: ['record', 'consent', 'opinion'], informed: 'no', unaware: true, missing: true, discovered: '2026-01-01' });
const back = U.inputOf(decodeState(U.stateOf(full), U.KEYS));
check(back.kind === 'birth' && back.patient === 'both' && back.outcome === 'death' && back.have.join() === 'record,consent,opinion' && back.informed === 'no' && back.unaware && back.missing && back.discovered === '2026-01-01' && back.event === EX.event, 'share state: stateOf -> decodeState -> inputOf round trip');
const nothing = U.inputOf(decodeState(U.stateOf(Object.assign({}, EX, { have: [] })), U.KEYS));
check(nothing.have.length === 0 && U.stateOf(Object.assign({}, EX, { have: [] })).includes('h0'), 'share state: "nothing in hand" travels as h0 and comes back empty');
const mstate = U.stateOf(Object.assign({}, EX, { patient: 'minor', birth: '2014-03-01' }));
check(mstate.includes('b2014-03-01') && !U.stateOf(EX).includes('/b'), 'share state: the birth day only for a minor');
const link = U.stateLink(reg, EX);
const fromLink = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/what-is-medical-malpractice-definition-examples/#s=') && E.tkCompute(reg, Object.assign(fromLink, { today: EX.today })).deadline === ex.deadline && st(E.tkCompute(reg, Object.assign(fromLink, { today: EX.today }))) === st(ex), 'stateLink: the page path #s=..., decodes to the same input, the same last day and statuses');
check(!/[א-ת]/.test(link) && !/[א-ת]/.test(U.stateOf(full)), 'share state: numbers, letters and dates only, no Hebrew, no free text');
const partial = U.inputOf(decodeState('kb/e2025-09-01', U.KEYS), Object.assign({}, EX));
check(partial.kind === 'birth' && partial.patient === 'baby' && partial.event === '2025-09-01' && partial.filled.join() === 'outcome,have,informed' && E.tkCompute(reg, Object.assign(partial, { today: EX.today })).deadline === '2050-09-01', 'a sibling\'s partial link (kind + event): the rest from the example, named in `filled`; the baby\'s date 1.9.2050');
/* Cross-tool: the clock (shaon-refui) by its own keys (hityashnut-ui.js KEYS, read from its worktree on 22.10.2026 22:47). */
const HT_KEYS = ['t', 'n', 'b', 'c', 'w', 'm', 'i', 'h', 'k', 'f', 'x', 'p', 'q'];
const cl = (r, who) => decodeState(U.clockLink(r, who).split('#')[1], HT_KEYS);
check(U.clockLink(ex).startsWith('/medical-malpractice-statute-of-limitations/#s=') && cl(ex).t === '2025-06-10' && !cl(ex).n && !cl(ex).b && !cl(ex, 'baby').b, 'cross-link: the clock opens with the treatment day (t); an adult carries no birth day, even when "baby" is asked');
check(!cl(both).b && cl(both).t === '2025-09-01' && cl(both, 'baby').n === '1' && cl(both, 'baby').b === '2025-09-01' && U.renderResult(reg, both).includes('השעון עם תאריך הלידה'), 'cross-link, a birth with both: the safe (earliest) claimant first, the mother; the baby\'s link carries n1 and the birth day');
const mLate = run({ patient: 'minor', birth: '2014-03-01', event: '2026-01-15', discovered: '2026-05-01' });
check(cl(mLate).n === '1' && cl(mLate).b === '2014-03-01' && cl(mLate).c === '2026-05-01' && !/[א-ת]/.test(U.clockLink(mLate)), 'cross-link, a minor with a later discovery: n1, the birth day and the discovery day (c); dates only');
check(U.costLink(ex) === '/medical-malpractice-cost/', 'cross-link: the cost tool needs the claim amount, which this check does not hold: its page, without a state');
// The records generator (wired by the integrator, 22.10.2026): the event's documents and dates, read back by its own inputOf.
const RSU = await import('../../assets/js/tools/reshuma-ui.js');
check(JSON.stringify(U.TK_RECORD_DOCS) === JSON.stringify(RSU.KIND_DOCS), 'cross-link: the documents per event equal KIND_DOCS of the records generator');
const rsIn = (r) => RSU.inputOf(decodeState(U.recordsLink(r).split('#')[1], RSU.KEYS));
const rsEx = rsIn(ex);
check(U.recordsLink(ex).startsWith('/obtaining-medical-records-copy/#s=') && rsEx.who === 'self' && rsEx.where === 'hospital' && rsEx.treated === '2025-06-10' && rsEx.docs.join() === 'op,an,im,nu,co' && rsEx.filled.length === 0, 'cross-link: the records generator opens for the patient, a hospital, the surgery day and the surgery documents (op, an, im, nu, co)');
const rsBirth = rsIn(E.tkCompute(reg, Object.assign({}, EX, { kind: 'birth', patient: 'baby', event: '2025-09-01' })));
check(rsBirth.who === 'parent' && rsBirth.birth === '2025-09-01' && rsBirth.docs.join() === 'adm,ct,nu,co,su', 'cross-link, a birth: a parent asks for the baby, born on the event day, with the delivery documents incl. the monitor strips (ct)');
const rsMom = rsIn(E.tkCompute(reg, Object.assign({}, EX, { kind: 'birth', patient: 'mother', event: '2025-09-01' })));
check(rsMom.who === 'self' && rsMom.birth === '', 'cross-link, the mother\'s own claim: she asks for herself, no birth day in the link');
check(rsIn(mLate).who === 'parent' && rsIn(mLate).birth === '2014-03-01' && !/[א-ת]/.test(U.recordsLink(mLate)), 'cross-link, a minor: a parent asks, the birth day travels, codes and dates only');
check(U.recordsLink({ ok: false }) === '/obtaining-medical-records-copy/', 'cross-link: no result, the page without a state');
check(U.inputOf(decodeState('', U.KEYS)) === null && U.inputOf(decodeState('kb', U.KEYS)) === null, 'no state, or no event without a base: nothing is read');
check(U.tkPreset('birth', '2026-10-22').event === addDays('2026-10-22', -420) && U.tkPreset('nope', '2026-10-22') === null && daysBetween(EX.event, EX.today) === 499 && addYears(EX.event, 7) === '2032-06-10', 'presets: relative to today; an unknown preset is null');

// Codex review of PR 172: a period that ended between 7.10.2023 and the eve of Amendment 8 is revived only conditionally
// (s.15A(c)-(d)): the safe date is the plain end (off a rest day), the revived date is kept apart and flagged.
const rvA = E.tkCompute(reg, Object.assign({}, EX, { kind: 'surgery', patient: 'adult', event: '2016-12-01' }));
check(rvA.people[0].plain === '2023-12-01' && rvA.people[0].revived && rvA.people[0].revived > '2024-01-24' && rvA.deadline === offRestDays('2023-12-01', reg.car_accident.independence_days) && rvA.people[0].added === 0, `s.15A(c): treated 1.12.2016, the 7 years ended 1.12.2023 inside the window and before 25.1.2024: safe ${rvA.deadline}, revived ${rvA.people[0].revived} only conditionally`);
check(rvA.expired && rvA.flags.some((f) => f.code === 'war_revived' && /15א\(ג\)/.test(f.section)), 's.15A(c): the safe date has passed and a warning names the conditional revival with its section');
const rvB = E.tkCompute(reg, Object.assign({}, EX, { kind: 'surgery', patient: 'adult', event: '2017-02-01' }));
check(rvB.people[0].plain === '2024-02-01' && !rvB.people[0].revived && rvB.people[0].added === 183 && !rvB.flags.some((f) => f.code === 'war_revived'), 's.15A(a): treated 1.2.2017, the period still ran on the eve of the amendment: 183 war days added, no revival warning');
const rvC = E.tkCompute(reg, Object.assign({}, EX, { kind: 'surgery', patient: 'adult', event: '2016-10-06' }));
check(!rvC.people[0].revived && rvC.people[0].added === 0 && rvC.deadline === offRestDays('2023-10-06', reg.car_accident.independence_days), 'before the window: treated 6.10.2016 ends 6.10.2023 (a day before 7.10.2023), no war days, no revival');
console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
