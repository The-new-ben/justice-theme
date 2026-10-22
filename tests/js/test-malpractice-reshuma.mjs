/**
 * Golden tests for the medical-records request generator (bakashat-reshuma, the medical-malpractice wave, 22.10.2026).
 * Run: node tests/js/test-malpractice-reshuma.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Patients' Rights Law 1996 (Nevo,
 * current to 6.4.2025: s.17 the record, s.18(a) the right to a copy, s.18(c)-(e) withholding, s.20(a)(1) consent, s.27(a)(1)
 * the IDF Medical Corps), the maximum-payment regulations 2019 (Nevo, current to 18.9.2023; KT 8146 of 8.1.2019: reg. 3(a)
 * and the schedule 10 shekels and 0 for a disc, reg. 3(b) the Ministry's tariff, reg. 3(c) the 5 years, reg. 3(d) the
 * deceased patient's relative: 6 months, 30 days, reg. 4 the free items, reg. 7 commencement 90 days after publication and
 * 25.12.2019 for reg. 3(b), reg. 8(a) records from 1.1.2011), the Ministry of Health tariff from 1.10.2026 (tariff A: L0268
 * 146 for up to 10 pages, L0269 1 for every 2 more, L9413 62, L6497 153, L6498 57, L6499 24), the Director-General's circular
 * 9/2019 (no number of days to answer, C.22; heirs C.12; minors C.16; the waiver C.6), the Public Health (Keeping of Records)
 * Regulations 1976 (rows 1, 3, 6, 8, 9, 13, 14, 15, 17, 18; reg. 4(e) state and municipal hospitals), the newborn circulars
 * 21/2005 and 42/2006, the Capacity and Guardianship Law ss.3, 14, and the Interpretation Law s.10(c) (a last day on a rest
 * day moves to the next day).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/reshuma-engine.js';
import * as U from '../../assets/js/tools/reshuma-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { isRestDay } from '../../assets/js/tools/dates.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.rsCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const M = reg.malpractice_reshuma;
const has = (r, code) => r.flags.some((f) => f.code === code);
const line = (r, code) => r.lines.find((l) => l.code === code);
const item = (r, code) => r.retention.items.find((x) => x.code === code);
const words = (s) => s.split(/\s+/).filter(Boolean).length;

/* ---------- 1. The registry ---------- */
check(M && M.checked_on === '2026-10-22' && M.next_update === '2027-01-01' && M.refresh_every_days === 90 && reg.registry_version >= '2026-10-22', 'registry: malpractice_reshuma checked 22.10.2026, refresh 90 days (the tariff moves several times a year), next 1.1.2027');
const srcUrls = (JSON.stringify(Object.assign({}, M, { where: [] })).match(/https?:\/\/[^"]+/g) || []);
check(srcUrls.length > 20 && srcUrls.every((u) => /^https:\/\/(www\.nevo\.co\.il|www\.gov\.il)\//.test(u)), `registry: all ${srcUrls.length} source links are official (Nevo, gov.il); the HMO and hospital pages sit only in "where"`);
check(!/kolzchut|wikisource|כל זכות|כל-זכות/.test(JSON.stringify(M)), 'registry: neither the private rights portal nor Wikisource is named');
check(M.regs.computerised_max === 10 && M.regs.extra_disc === 0 && M.regs.years === 5 && M.regs.deceased_months === 6 && M.regs.deceased_days === 30 && M.regs.applies_from === '2011-01-01' && M.regs.paper_from === '2019-12-25' && M.regs.published === '2019-01-08' && M.regs.start_days === 90, 'registry: regulations 2019: 10 ₪ and 0 for a disc (schedule), 5 years (3(c)), 6 months and 30 days (3(d)), from 1.1.2011 (8(a)), 3(b) from 25.12.2019, published 8.1.2019, in force 90 days later (7)');
const it = M.tariff.items;
check(it.L0268.amount === 146 && it.L0268.pages === 10 && it.L0269.amount === 1 && it.L0269.per_pages === 2 && it.L9413.amount === 62 && it.L6497.amount === 153 && it.L6498.amount === 57 && it.L6499.amount === 24 && M.tariff.from === '2026-10-01', 'registry: the tariff from 1.10.2026, tariff A: L0268 146 (10 pages), L0269 1 per 2 pages, L9413 62, L6497 153, L6498 57, L6499 24');
const hist = M.tariff.history;
check(hist.map((h) => h.L0268).join() === '120,127,133,136,139,141,143,146' && hist.every((h, k) => !k || h.from > hist[k - 1].from) && hist[hist.length - 1].L0268 === it.L0268.amount, 'registry: L0268 over time 120 (1.1.2023), 127, 133, 136, 139, 141, 143, 146 (1.10.2026), ascending, the last equals today\'s');
const rows = M.retention.rows;
check(rows['1'].years === 20 && rows['1'].no_summary_years === 25 && rows['1'].death_years === 7 && rows['3'].years === 100 && rows['6'].years === 7 && rows['13'].years === 10 && rows['13'].death_years === 7 && rows['15'].years === 2 && rows['17'].years === 7 && M.retention.newborn.years === 25 && M.retention.newborn.mother_years === 25, 'registry: keeping of records 1976: file 20 / 25 / 7 after death, summary 100, ER 7, X-ray 10 / 7, negative chart 2, nurses 7; newborn 25 (21/2005), mother recommended 25 (42/2006)');
check(reg.car_accident.limitation.adult_age === 18 && reg.car_accident.limitation.minor_section === 'סעיף 10' && Array.isArray(reg.car_accident.independence_days) && M.capacity.minor_age === 18, 'reused reg.car_accident: 18 and s.10 of the Limitation Law, the Independence days; Capacity Law s.3: 18');
check(M.response.days === null && M.response.section === 'סעיף ג.22', 'registry: no number of days to answer (circular 9/2019 C.22): days is null, never guessed');

/* ---------- 2. The example: the patient asks a (not state) hospital for 5 documents of a surgery 19 months ago ---------- */
const ex = E.rsCompute(reg, EX);
check(ex.ok && EX.who === 'self' && EX.where === 'hospital' && EX.owner === 'other' && EX.treated === '2025-03-22' && EX.today === '2026-10-22' && ex.docs.join() === 'op,an,ct,im,nu,co'.replace('ct,', ''), 'example: the patient, a hospital, treated 22.3.2025 (19 months before 22.10.2026), op/an/im/nu/co');
check(ex.fiveFrom === '2021-10-22' && ex.within5 && ex.regsApply && ex.capped, 'example: 22.10.2026 − 5 years = 22.10.2021; 22.3.2025 is inside, created after 1.1.2011: the caps apply (reg. 3(c), 8(a))');
check(ex.lead.amount === 10 && ex.lead.kind === 'digital' && ex.digitalMax === 10 && ex.paperMax === 146 && line(ex, 'computerised').amount === 10 && line(ex, 'disc').amount === 0 && line(ex, 'paper').amount === 146 && line(ex, 'pages').amount === 1, 'example cost: computerised up to 10 ₪ for the whole request, discs 0; paper up to 146 ₪ for 10 pages, 1 ₪ per 2 more (reg. 3(a)-(b), tariff)');
check(item(ex, 'nu').earliest === '2032-03-22' && item(ex, 'nu').rows[0].n === '17' && item(ex, 'op').earliest === '2035-03-22' && item(ex, 'op').rows[0].n === '8' && item(ex, 'an').rows[0].n === '9' && item(ex, 'co').earliest === '2045-03-22' && ex.retention.earliest === '2032-03-22', 'example retention: nursing book 22.3.2025 + 7 = 22.3.2032 (row 17); surgery book + 10 = 22.3.2035 (row 8); anesthesia book row 9; consent forms in the file + 20 = 22.3.2045 (row 1)');
check(ex.events.length === 5 && ex.events[0].date === '2032-03-22' && ex.events.every((e, k) => !k || e.date >= ex.events[k - 1].date), 'example events: 5 retention dates, sorted, the first 22.3.2032');
check(ex.start === '2019-04-08', 'commencement: 8.1.2019 + 90 days = 23 + 28 + 31 + 8 = 8.4.2019 (reg. 7)');
check(has(ex, 'withhold') && has(ex, 'notes') && has(ex, 'original') && !has(ex, 'older5') && !has(ex, 'missing'), 'example flags: withholding with the ethics committee (s.18(c)-(e)), personal notes (s.17(a)), no original (C.20); not old, nothing missing');

/* ---------- 3. The cost: pages, format, the 5 years, 1.1.2011, who ---------- */
check(run({ pages: 10 }).paperMax === 146 && run({ pages: 11 }).paperMax === 147 && run({ pages: 12 }).paperMax === 147 && run({ pages: 13 }).paperMax === 148 && run({ pages: 25 }).paperMax === 154, 'paper pages: 10 → 146; 11 and 12 → 146 + 1; 13 → 146 + 2; 25 → 146 + ⌈15/2⌉ = 146 + 8 = 154 (L0268 + L0269)');
const dig = run({ format: 'digital' });
const pap = run({ format: 'paper' });
check(dig.paperMax === null && dig.digitalMax === 10 && !line(dig, 'paper') && pap.digitalMax === null && pap.lead.kind === 'paper' && pap.lead.amount === 146, 'format: a computerised record shows only the 10 ₪ cap; a paper record leads with 146 ₪');
const at5 = run({ treated: '2021-10-22' });
const over5 = run({ treated: '2021-10-21' });
check(at5.within5 && at5.capped && !over5.within5 && !over5.capped && has(over5, 'older5') && over5.lead.kind === 'tariff' && over5.lead.amount === 146, 'the 5 years: created on 22.10.2021, exactly 5 years before, is inside; one day earlier (21.10.2021) has no cap: the tariff line 146 ₪ is shown, flagged (reg. 3(c))');
const b2011 = run({ treated: '2010-12-31' });
const a2011 = run({ treated: '2011-01-01' });
check(!b2011.regsApply && has(b2011, 'before2011') && b2011.free.length === 0 && a2011.regsApply && !a2011.capped && a2011.free.length > 0, 'reg. 8(a): a record of 31.12.2010 is outside the regulations (no cap, no free items); 1.1.2011 is inside (free items yes, no cap: older than 5 years)');
const rep = run({ who: 'rep' });
check(!rep.capped && rep.free.length === 0 && line(rep, 'printout').amount === 62 && line(rep, 'paper').kind === 'tariff' && has(rep, 'rep_cap') && rep.capReasons.some((x) => x.includes('עורך דין')), 'a lawyer or expert: no cap in the regulations (only the patient, a relative attorney, a guardian), no free items; the tariff lines 62 / 146 are shown as the tariff, not as a cap');
check(run({ who: 'poa' }).capped && run({ who: 'guardian' }).capped && run({ who: 'parent', birth: '2015-05-01' }).capped, 'a relative holding a power of attorney, a guardian and a parent of a minor: the caps apply (reg. 3(a); Capacity Law s.14)');
const adult = run({ who: 'parent', birth: '2006-01-01', treated: '2020-05-01' });
check(adult.ok && adult.adultNow && adult.ageNow === 20 && !adult.capped && has(adult, 'adult_now') && adult.flags.find((f) => f.code === 'adult_now').level === 'danger', 'a parent of a patient born 1.1.2006: 20 today, an adult (Capacity Law s.3): the parent needs the patient\'s waiver; no cap, a danger flag');
check(has(run({ birth: '2012-01-01', treated: '2025-01-01' }), 'minor_self'), 'the patient is 14 today: a flag says a parent asks for a minor (C.16)');

/* ---------- 4. A deceased patient (reg. 3(d), circular C.12) ---------- */
const dead = run({ who: 'heir', docs: ['all'], treated: '2026-09-17', death: '2026-10-08' });
check(dead.ok && dead.dec.plainEnd === '2026-11-07' && new Date('2026-11-07T00:00:00Z').getUTCDay() === 6 && dead.dec.end === '2026-11-08' && dead.dec.rolled && dead.capped, 'death 8.10.2026: 30 days end 7.11.2026, a Saturday, so 8.11.2026 (Interpretation Law s.10(c)); the treatment of 17.9.2026 is inside the 6 months: capped (reg. 3(d))');
check(dead.events.some((e) => e.key === 'deceased' && e.date === '2026-11-08') && has(dead, 'heir_window') && has(dead, 'heir_court'), 'deceased: the calendar has the last day 8.11.2026; the flags explain the window and when a court order is needed (C.12)');
const late = run({ who: 'heir', docs: ['all'], treated: '2026-07-20', death: '2026-08-01' });
check(!isRestDay('2026-08-31') && late.dec.end === '2026-08-31' && !late.dec.inWindow && !late.capped && late.capReasons.some((x) => x.includes('30')), 'death 1.8.2026: the window ended 31.8.2026 (a Monday); on 22.10.2026 it has passed: no cap, the reason says so');
const early = run({ who: 'heir', docs: ['all'], treated: '2026-03-07', death: '2026-10-08' });
check(early.dec.from === '2026-04-08' && !early.dec.covers && !early.capped, 'a treatment on 7.3.2026, before 8.4.2026 (6 months before the death): outside reg. 3(d), no cap');
const noDeath = run({ who: 'heir', docs: ['all'], death: '' });
check(noDeath.ok && !noDeath.capped && has(noDeath, 'heir_death') && dead.free.every((f) => f.code !== 'rx') && dead.free.length === 7, 'an heir without the death day: no window guessed, a flag asks for it; the relative of a deceased gets reg. 4\'s free items except prescriptions (4(d))');

/* ---------- 5. Where: a state hospital, an unknown owner, an HMO, the IDF, a clinic ---------- */
const state = run({ owner: 'state' });
check(state.ok && state.retention === null && has(state, 'state') && state.events.length === 0 && U.slip(reg, state).includes('תקנות השמירה לא חלות'), 'a state or municipal hospital: the 1976 periods do not apply (reg. 4(e)): no dates, a flag, the slip says so');
const unk = run({ owner: 'unknown' });
check(unk.retention && unk.retention.earliest === '2032-03-22' && has(unk, 'owner_unknown'), 'an unknown owner: the periods are shown with a flag that a state hospital is different');
const hmo = run({ where: 'hmo', docs: ['all'] });
check(hmo.ok && hmo.retention === null && has(hmo, 'no_period') && has(hmo, 'hmo_unit') && U.nextActions(reg, hmo).official.some((x) => /clalit|maccabi/.test(x.url)), 'an HMO: no period found in the texts read (words, no date); one unit per HMO (reg. 2); the next steps point to the HMOs\' own pages');
const idf = run({ where: 'idf' });
check(idf.basis.some((b) => b.section === 'סעיף 27(א)(1)') && has(idf, 'idf') && U.letterText(U.letterParts(reg, idf, {})).includes('חיל הרפואה'), 'the IDF: the Medical Corps is a medical institution for ss.17-23 (s.27(a)(1)); the letter is addressed to it');
check(has(run({ where: 'clinic' }), 'clinic'), 'a private clinic: the whole record of a practitioner is one unit (reg. 2(a)(4))');

/* ---------- 6. Retention: CTG, a death, Feb 29, a child, dates already passed ---------- */
const ctg = run({ who: 'parent', docs: ['ct'], treated: '2024-08-22', birth: '2024-08-22' });
check(item(ctg, 'ct').unnamed && item(ctg, 'ct').earliest === '2026-08-22' && item(ctg, 'ct').rows[0].n === '15' && has(ctg, 'ctg') && has(ctg, 'newborn'), 'CTG strips: not named in the schedule; the earliest reading is a chart with no finding, 22.8.2024 + 2 = 22.8.2026 (row 15); flags for the reading and the newborn circulars');
const dd = run({ who: 'heir', docs: ['all'], treated: '2020-01-01', death: '2021-06-01' });
const r1 = item(dd, 'all').rows.find((x) => x.n === '1');
const r13 = item(dd, 'all').rows.find((x) => x.n === '13');
check(r1.readings[0].date === '2040-01-01' && r1.readings[1].date === '2028-06-01' && r1.date === '2028-06-01' && r13.date === '2028-06-01' && item(dd, 'all').earliest === '2027-01-01', 'death 1.6.2021: the file 1.1.2020 + 20 = 1.1.2040, without a summary min(1.1.2045, 1.6.2021 + 7 = 1.6.2028) = 1.6.2028; X-ray min(1.1.2030, 1.6.2028); ER 1.1.2020 + 7 = 1.1.2027 first');
const leap = run({ docs: ['er', 'co'], treated: '2024-02-29' });
check(item(leap, 'er').earliest === '2031-02-28' && item(leap, 'co').earliest === '2044-02-29', 'Feb 29: 29.2.2024 + 7 years = 28.2.2031 (no 29th); + 20 years = 29.2.2044');
const kid = run({ who: 'parent', docs: ['er'], treated: '2025-08-22', birth: '2025-08-22' });
check(has(kid, 'before18') && kid.flags.find((f) => f.code === 'before18').level === 'danger' && item(kid, 'er').earliest === '2032-08-22', 'a baby: the ER sheet may go on 22.8.2032 (7 years), long before the 18th birthday 22.8.2043, when the limitation starts (s.10): a danger flag');
const old = run({ docs: ['er'], treated: '2016-01-01' });
check(has(old, 'past') && old.events.length === 0, 'treated 1.1.2016: the ER sheet could be destroyed from 1.1.2023: a flag (a doctor may order longer keeping, reg. 4(d)); no past date goes to the calendar');

/* ---------- 7. The follow-up: documents missing from the copy ---------- */
const gap = E.rsCompute(reg, U.rsPreset('gap', '2026-10-22'));
check(gap.ok && gap.followup && gap.docs.length === 0 && gap.missing.join() === 'an' && has(gap, 'missing') && item(gap, 'an'), 'the gap preset: the anesthesia record is missing: a follow-up, the s.17 flag, its retention still computed');
const gapLetter = U.letterText(U.letterParts(reg, gap, {}));
check(gapLetter.startsWith('בקשה להשלמת מסמכים חסרים') && gapLetter.includes('רישום ההרדמה') && gapLetter.includes('סעיף 17(א)') && gapLetter.includes('לאשר זאת בכתב'), 'the follow-up letter: its own title, the missing document, s.17(a), and a written confirmation if it does not exist');
const gapBrief = U.aiBrief(reg, gap);
check(gapBrief.includes('חסר') && gapBrief.includes('רישום ההרדמה') && gapBrief.includes('חקירה נגדית של המומחה הרפואי מטעם בית החולים') && gapBrief.includes('הפער'), 'the gap brief: the missing anesthesia record and the cross-examination of the hospital\'s expert on the gap');

/* ---------- 8. Input errors ---------- */
const errOf = (over) => { const r = run(over); return r.ok ? '' : r.errors.map((e) => e.field).join(); };
check(errOf({ docs: [], missing: [] }) === 'docs', 'no document and nothing missing: an error on the documents');
check(errOf({ treated: '' }) === 'treated' && errOf({ treated: '31.2.2025' }) === 'treated' && errOf({ treated: '2026-10-23' }) === 'treated', 'the treatment day: empty, 31.2.2025 and a day after today are errors');
check(errOf({ birth: '2025-04-01' }) === 'birth' && errOf({ who: 'heir', death: '2025-01-01' }) === 'death' && errOf({ who: 'heir', death: '2026-10-23' }) === 'death', 'a birth after the treatment, a death before it, a death after today: errors');
check(errOf({ pages: '-1' }) === 'pages' && errOf({ pages: '2.5' }) === 'pages' && errOf({ pages: 'abc' }) === 'pages' && run({ pages: '1,200' }).paperMax === 146 + 595, 'pages: -1, 2.5 and text are errors; "1,200" reads as 1,200: 146 + ⌈1,190/2⌉ = 146 + 595');

/* ---------- 9. The letter and the Word file ---------- */
const exLetter = U.letterText(U.letterParts(reg, ex, {}));
check(exLetter.startsWith('בקשה לקבלת העתק מהרשומה הרפואית') && exLetter.includes('סעיף 18(א)') && exLetter.includes('10 ₪') && exLetter.includes('תקנה 4(ב)') && exLetter.includes('5. טופסי ההסכמה לטיפול') && exLetter.includes('6. וכל מסמך אחר') && exLetter.includes('__________'), 'the example letter: the title, s.18(a), the 10 ₪ cap, reg. 4(b), the 5 documents numbered and "any other document", blanks where no field is filled');
const fields = { pname: 'ישראלה ישראלי', pid: '123456782', inst: 'בית חולים לדוגמה', mail: 'a@example.com' };
const named = U.letterText(U.letterParts(reg, ex, fields));
check(named.includes('ישראלה ישראלי') && named.includes('123456782') && named.includes('בית חולים לדוגמה') && !U.stateOf(Object.assign({}, EX, fields)).includes('123456782') && !U.aiBrief(reg, ex).includes('ישראלה'), 'the letter fields fill the letter only: never the share state or the scenario');
const repLetter = U.letterText(U.letterParts(reg, rep, {}));
check(repLetter.includes('נספח: כתב ויתור על סודיות רפואית') && repLetter.includes('חתימת המטופל') && repLetter.includes('העד') && repLetter.includes('סעיף 20(א)(1)') && repLetter.includes('פירוט של הסכום'), 'the lawyer\'s letter: s.20(a)(1), the waiver annex (C.6: the patient\'s details, the scope, the signature, the witness), and a price asked in advance (no cap)');
check(U.letterText(U.letterParts(reg, dead, {})).includes('תקנה 3(ד)') && U.letterText(U.letterParts(reg, dead, {})).includes('סעיף ג.12'), 'the heir\'s letter: circular C.12 and the reg. 3(d) cap inside the 30 days');
const word = U.exportWordLetter(reg, ex, fields);
const wtext = new TextDecoder().decode(word.bytes);
check(word.bytes[0] === 0x50 && word.bytes[1] === 0x4b && wtext.includes('word/document.xml') && wtext.includes('ישראלה ישראלי') && wtext.includes('<w:bidi/>') && word.filename === 'medical-records-request.docx', 'the Word file: a zip (PK) with word/document.xml, right-to-left paragraphs, the name typed in the field, medical-records-request.docx');

/* ---------- 10. The UI: snapshot, lead card, no h2, nothing undefined, the scenario ---------- */
const snap = U.snapshot(reg);
check(snap.tool === 'bakashat-reshuma' && snap.total === 10 && snap.sticky === '<bdi>10 ₪</bdi>' && snap.lead.includes('דוגמה מחושבת') && snap.lead.includes('<bdi>10 ₪</bdi>') && snap.lead.includes('data-lead-go'), 'snapshot: the lead card carries the example figure 10 ₪ and the jump to the form; total 10; the sticky');
check(snap.compare_table.includes('<caption>') && snap.method.startsWith('<ol>') && snap.result.includes('jt69-slip') && snap.details.includes('data-jt69-letter') && snap.form.includes('aria-pressed="true"'), 'snapshot: the page table with a caption, the method list, the routing slip, the letter, the pressed preset');
const all = [];
for (const key of Object.keys(U.PRESETS)) {
	const input = U.rsPreset(key, '2026-10-22');
	const r = E.rsCompute(reg, input);
	all.push(U.renderForm(reg, input), U.renderResult(reg, r), U.renderDetails(reg, r, { today: '2026-10-22' }), U.leadCard(reg, r), U.printSummary(reg, r, '2026-10-22'), U.letterText(U.letterParts(reg, r, {})), U.aiBrief(reg, r), U.verdictSentence(reg, r));
}
all.push(...Object.values(snap).filter((v) => typeof v === 'string'));
check(all.every((s) => !/<h2/i.test(s)), 'no <h2> in any rendered HTML (6 presets × 8 renderers + the snapshot)');
check(all.every((s) => !bad(s)), 'no "undefined", "NaN" or "null" in any rendered string');
const briefs = Object.keys(U.PRESETS).map((k) => U.aiBrief(reg, E.rsCompute(reg, U.rsPreset(k, '2026-10-22'))));
check(briefs.every((b) => words(b) >= 40 && words(b) <= 90 && !/\d{9}/.test(b) && b.includes('חקירה נגדית של המומחה הרפואי')), `the scenario: 40-90 words for every preset (${briefs.map(words).join(', ')}), no 9-digit run, ends with the expert cross-examination`);
check(briefs.every((b) => !M.where.some((w) => b.includes(w.he.split(':')[0]))), 'the scenario never names an HMO or a hospital');
check(U.printSummary(reg, ex, '2026-10-23').includes('הודפס ב-23.10.2026') && U.printSummary(reg, ex, '2026-10-23').includes('לא ייעוץ משפטי') && U.printSummary(reg, ex, '2026-10-23').includes('נבדק 22.10.2026'), 'print summary: the day printed, the sources checked on 22.10.2026, the footer line');
const rDocs = E.rsCompute(reg, U.rsPreset('birth', '2026-10-22'));
check(rDocs.docItems.find((d) => d.code === 'su').cost === 'free_once' && U.renderResult(reg, rDocs).includes('בלי תשלום, פעם אחת'), 'the birth preset: the discharge letter is free once at the end of the treatment (reg. 4(c)(1))');
const calendar = ics(ex.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(calendar.includes('DTSTART;VALUE=DATE:20320322') && (calendar.match(/BEGIN:VEVENT/g) || []).length === 5, 'the .ics carries the computed dates (22.3.2032 first, 5 events)');

/* ---------- 11. The share state and the links between the tools ---------- */
const same = (a, b) => ['who', 'where', 'owner', 'format', 'treated', 'birth', 'death', 'pages'].every((k) => String(a[k]) === String(b[k])) && a.docs.join() === b.docs.join() && a.missing.join() === b.missing.join();
for (const key of ['surgery', 'deceased', 'gap', 'birth']) {
	const input = U.rsPreset(key, '2026-10-22');
	const back = U.inputOf(decodeState(U.stateOf(input), U.KEYS));
	check(back && same(back, input) && !/[א-ת]/.test(U.stateOf(input)), `share state round trip (${key}): stateOf → decodeState → inputOf gives the same answers, no Hebrew in the link`);
}
const link = U.stateLink(reg, EX);
const fromLink = U.inputOf(decodeState(link.slice(link.indexOf('#')), U.KEYS));
check(link.startsWith('/obtaining-medical-records-copy/#s=') && link.includes('t2025-03-22') && link.includes('dop.an.im.nu.co') && fromLink && same(fromLink, EX), `stateLink round trip: ${link}`);
const partial = U.inputOf(decodeState('#s=t2024-06-01', U.KEYS), EX);
const partial2 = U.inputOf(decodeState('#s=dct.su', U.KEYS), EX);
check(partial.filled.join() === 'docs' && partial.docs.join() === EX.docs.join() && partial.treated === '2024-06-01' && partial2.filled.join() === 'treated' && partial2.treated === EX.treated && partial2.docs.join() === 'ct,su' && U.inputOf(decodeState('#s=dct', U.KEYS)) === null, 'a partial state (a sibling\'s link) fills the rest from the example and lists it in filled; without a base it returns null');
check(U.clockLink(ex) === '/medical-malpractice-statute-of-limitations/#s=t2025-03-22' && U.clockLink(kid).includes('n1/b2025-08-22') && U.clockLink(dead).includes('m2026-10-08'), 'the clock link by its keys: t the treatment day; n and b for a minor; m the death day');
check(U.caseLink(ctg).includes('kb') && U.caseLink(gap).includes('ka') && U.caseLink(gap).includes('x1') && U.caseLink(ex).includes('ks'), 'the case-check link by its keys: k b birth / a anesthesia / s surgery, e the day, x1 when a part of the record is missing');
const kindLink = U.stateLink(reg, { treated: '2024-08-22', docs: U.KIND_DOCS.birth, who: 'parent', birth: '2024-08-22' });
const kindBack = U.inputOf(decodeState(kindLink.slice(kindLink.indexOf('#')), U.KEYS));
check(kindLink.includes('dadm.ct.nu.co.su') && kindBack.docs.join() === 'adm,ct,nu,co,su' && kindBack.who === 'parent' && Object.values(U.KIND_DOCS).every((l) => E.rsDocs(l).join() === l.join()), `a sibling's link with KIND_DOCS.birth ticks the birth documents and round-trips (${kindLink})`);
check(E.rsBand(ex) === 'self-hospital-cap' && E.rsBand(gap) === 'self-hospital-cap-gap' && !/\d/.test(E.rsBand(dead)), 'analytics band: who, where, cap or not, a gap; never a date or an amount');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
