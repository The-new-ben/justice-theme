/**
 * Golden tests for the waiver-of-inheritance affidavit generator (histalkut, the inheritance wave, 21.10.2026).
 * Run: node tests/js/test-inheritance-histalkut.mjs
 *
 * The gate of s.6 of the Succession Law by hand: a directed waiver only to the deceased's spouse, child or sibling
 * (s.6(ב)); a minor or a ward only with the court's approval (s.6(ג)); a conditional waiver void (s.6(ד)); no waiver after
 * division (s.6(א)); after an order, an amendment (s.72, reg. 27, fee item 2, 14 days). The notary's affidavit fee from
 * the tariff (item 7: 200 for the first signer, 80 for each additional, plus VAT 18%): 236, 330.40, 424.80, 519.20.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as HE from '../../assets/js/tools/histalkut-engine.js';
import * as HUI from '../../assets/js/tools/histalkut-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const ip = reg.inheritance_process;
const EX = HUI.EXAMPLE;
const run = (over) => HE.compute(reg, Object.assign({}, EX, over));

/* ---------- 1. The registry carries the figures the tool cites ---------- */
check(ip.sections.renounce === 'סעיף 6' && ip.sections.renounce_who === 'סעיף 6(ב)' && ip.sections.renounce_minor === 'סעיף 6(ג)' && ip.sections.renounce_conditional === 'סעיף 6(ד)' && ip.sections.transfer_share === 'סעיף 7', 'registry: s.6, 6(ב), 6(ג), 6(ד) and s.7 of the Succession Law');
check(ip.regulation_sections.renounce_affidavit === 'תקנה 16' && ip.regulation_sections.amend === 'תקנה 27' && ip.sections.amend === 'סעיף 72', 'registry: reg. 16 (the affidavit), s.72 and reg. 27 (amending an order)');
check(reg.will_cost.notary.affidavit_first === 200 && reg.will_cost.notary.affidavit_additional === 80 && reg.will_cost.vat.pct === 18 && ip.notary.item === 'פרט 7', 'registry: notary affidavit 200 + 80 per extra signer (item 7), VAT 18%');
check(ip.registrar.items.amend.amount === 597 && ip.registrar.items.amend.item === 'פרט 2' && ip.days.amend_response === 14, 'registry: amendment fee 597 (item 2) and 14 days to respond');

/* ---------- 2. The example: an adult daughter waives her whole share to her mother, the deceased's spouse ---------- */
const ex = HE.compute(reg, EX);
check(ex.ok && ex.status === 'ok' && !ex.court && !ex.amend && !ex.blocked && !ex.void && ex.directed, 'example: allowed, no court approval, no amendment, directed (s.6(ב))');
check(ex.cost.total === 0 && ex.cost.vat === 0 && ex.cost.lines.length === 2 && ex.cost.lines[1].amount === null && ex.cost.notaryAlt.total === 236 && ex.cost.notaryAlt.section === 'פרט 7', 'example: no fee at the registrar, the lawyer by agreement (no amount), the notary alternative 200 x 1.18 = 236 (item 7)');
check(ex.scopeHe === 'הכול' && HE.scopeText({ scope: 'part', pct: 40 }) === '40%' && HE.scopeText({ scope: 'bequest' }) === 'מנה', 'the scope text: הכול / 40% / מנה');
check(ex.doc.startsWith('תצהיר הסתלקות מירושה\nלפי סעיף 6 לחוק הירושה, התשכ"ה-1965, ותקנה 16 לתקנות הירושה, התשנ"ח-1998'), 'the affidavit opens with its title and the two sources');
check(ex.doc.includes('אני בתו של המנוח/ה, ויורשת על פי דין.') && ex.doc.includes('מחלקי בעיזבון המנוח/ה, כולו, לפי סעיף 6(א) לחוק') && ex.doc.includes('בן/בת זוגו של המנוח/ה (סעיף 6(ב) לחוק)'), 'the affidavit: daughter, heir by law, the whole share, to the deceased\'s spouse, each with its section');
check(ex.doc.includes('סופית, שאינה ניתנת לחזרה ושאינה מותנית בתנאי (סעיף 6(ד) לחוק)') && ex.doc.includes('הנני מצהירה כי זה שמי, זו חתימתי ותוכן תצהירי אמת') && ex.doc.includes('הופיעה בפניי') && ex.doc.includes('תהיה צפויה לעונשים') && ex.doc.includes('וחתמה עליה בפניי'), 'the affidavit: the finality clause, the truth clause and the lawyer\'s verification in the female form');
check(ex.doc.includes('[שם מלא]') && ex.doc.includes('[מספר זהות]') && ex.doc.includes('[כתובת]') && ex.doc.includes('[שם המנוח/ה]') && ex.doc.includes('[תאריך הפטירה]') && !/\d{9}/.test(ex.doc), 'placeholders only: no real name, ID or address in the document');
check(ex.share.to === 'בן/בת הזוג של המנוח/ה' && ex.share.section === 'סעיף 6(ב)' && ex.share.rows.length === 2 && ex.share.rows[1].how === 'לא יורשים דבר מהעיזבון', 'the share goes to the deceased\'s spouse; the renouncer inherits nothing (s.6(ב))');
check(ex.clock.length === 4 && ex.clock[0].now && ex.clock[2].amount === 597 && ex.clock[2].days === 14 && ex.clock[3].what.includes('אין הסתלקות'), 'the clock: four stages, the first is now, the order stage carries 597 and 14 days, the last says no waiver');
check(ex.checklist.length === 4 && ex.checklist[0].section === 'סעיף 6 לחוק; תקנה 16' && ex.checklist.some((x) => x.he.includes('פרטי הנהנה')) && !ex.checklist.some((x) => x.he.includes('אישור בית המשפט')), 'the checklist of an adult: the affidavit (reg. 16), the ID copy, the beneficiary, the request; no court approval');
check(ex.flags.map((f) => f.code).join(',') === 'final,transferred,creditors,tax' && ex.flags[1].section === 'סעיף 7(ג)' && !ex.flags[2].section, 'flags: final (6(ב)), a transferred share cannot be waived (7(ג)), creditors without a cite, tax (s.4)');

/* ---------- 3. The gender switch and the male form ---------- */
const m = run({ gender: 'm', relation: 'sibling', kind: 'child' });
check(m.doc.includes('אני החתום מטה') && m.doc.includes('אני אחיו של המנוח/ה, ויורש על פי דין') && m.doc.includes('אני מסתלק בזה') && m.doc.includes('הופיע בפניי') && m.doc.includes('שזיהה את עצמו') && m.doc.includes('וחתם עליה בפניי') && !m.doc.includes('מצהירה'), 'male form: brother waiving to a child of the deceased, every verb masculine');

/* ---------- 4. Scope: a part, a bequest ---------- */
const part = run({ scope: 'part', pct: 40, estate: 1000000, sharePct: 25 });
check(part.ok && part.doc.includes('מ-40% (ארבעים אחוזים) מחלקי בעיזבון') && part.waived === 100000 && part.share.rows[1].how === 'נשארים עם 60% מחלקכם' && part.scopeHe === '40%', 'a 40% waiver of a 25% share of 1,000,000: "ארבעים אחוזים" in the text, 100,000 waived, 60% kept');
check(run({ estate: 1000000, sharePct: 25 }).waived === 250000 && run({ estate: 1000000 }).waived === null && run({ sharePct: 25 }).waived === null, 'the money sentence only with both figures: 1,000,000 x 25% = 250,000');
check(HE.wordsPct(1) === 'אחד אחוז' && HE.wordsPct(15) === 'חמישה עשר אחוזים' && HE.wordsPct(99) === 'תשעים ותשעה אחוזים' && HE.wordsPct(33.5) === '33.5 אחוזים', 'percent in words: 1, 15, 99; decimals stay digits');
const beq = run({ basis: 'will', scope: 'bequest', bequest: 'הדירה ברחוב הרצל', kind: 'general' });
check(beq.ok && beq.doc.includes('וזוכה על פי צוואת המנוח/ה מיום [תאריך הצוואה]') && beq.doc.includes('מהמנה שאני זכאי/ת לה על פי הצוואה: הדירה ברחוב הרצל, כולה') && beq.doc.includes('ההסתלקות סתמית') && beq.doc.includes('הזוכים האחרים לפי הצוואה') && beq.scopeHe === 'מנה' && beq.waived === null, 'a bequest under a will, general waiver: the will clause, the bequest named, the other beneficiaries, no money sentence');
check(!run({ basis: 'law', scope: 'bequest' }).ok && run({ basis: 'law', scope: 'bequest' }).errors[0].field === 'scope', 'a bequest exists only under a will: an input error by law');

/* ---------- 5. The gate of s.6(ב): "in favour of another person" is not a waiver ---------- */
const other = run({ kind: 'other' });
check(other.ok && other.status === 'not_waiver' && other.blocked === 'not_waiver' && other.doc === '' && other.cost.total === 0 && other.cost.lines.length === 0, 'to another person: blocked, no affidavit, no cost lines');
check(other.share.rows.some((x) => x.section === 'סעיף 7(א) ו-(ג)') && other.share.rows.some((x) => x.section === 'סעיף 1 (הגדרת מכירה) לחוק מיסוי מקרקעין') && other.flags.map((f) => f.code).join(',') === 'gift,alternative', 'to another person: s.7 transfer, gift of land is a sale (s.1), the lawful alternatives (s.110)');
check(HUI.verdictSentence(reg, other).includes('זו לא הסתלקות') && HUI.verdictSentence(reg, other).includes('סעיף 6(ב)') && HUI.verdictSentence(reg, other).includes('סעיף 7'), 'the verdict for another person names s.6(ב) and s.7');
check(!run({ relation: 'spouse', kind: 'spouse' }).ok && run({ relation: 'spouse', kind: 'child' }).ok && run({ relation: 'child', kind: 'child' }).ok, 'a spouse cannot waive in favour of the spouse (themselves); to a child or from child to child is fine');

/* ---------- 6. The stages ---------- */
const div = run({ stage: 'divided' });
check(div.ok && div.status === 'divided' && div.doc === '' && div.cost.lines.length === 0 && div.clock[3].now && HUI.verdictSentence(reg, div).includes('סעיף 6(א)') && HUI.verdictSentence(reg, div).includes('סעיף 7'), 'after division: no waiver (s.6(א)), transfer or gift (s.7), no document');
const ord = run({ stage: 'ordered' });
check(ord.ok && ord.status === 'amend' && ord.amend && ord.cost.total === 597 && ord.cost.lines[2].section === 'פרט 2 לתקנות האגרות; סעיף 72 לחוק; תקנה 27' && ord.doc.includes('צו ירושה ניתן ביום [תאריך הצו]') && ord.doc.includes('לבקשה לתיקון הצו לפי סעיף 72 לחוק ותקנה 27 לתקנות') && ord.checklist.some((x) => x.he.includes('597')), 'after an order: amendment, 597 (item 2, s.72, reg. 27), the clause in the affidavit and the request in the checklist');
check(run({ stage: 'ordered', basis: 'will' }).doc.includes('צו קיום צוואה ניתן ביום'), 'after a probate order: the will wording');
const filed = run({ stage: 'filed' });
check(filed.ok && filed.status === 'ok' && filed.doc.includes('הוגשה ביום [תאריך ההגשה] בתיק [מספר התיק], וטרם ניתן צו') && filed.cost.lines[0].he.includes('לתיק הבקשה') && filed.clock[1].now, 'request filed, no order yet: the affidavit goes to the file (reg. 16), no amendment');

/* ---------- 7. Capacity (s.6(ג)) and a conditional waiver (s.6(ד)) ---------- */
const minor = run({ who: 'minor' });
check(minor.ok && minor.status === 'court' && minor.court && minor.doc.includes('אני קטין/ה, וההסתלקות טעונה אישור בית המשפט (סעיף 6(ג) לחוק)') && minor.checklist.some((x) => x.section === 'סעיף 6(ג); תקנה 16') && minor.flags[0].code === 'court', 'a minor: court approval (s.6(ג)), the approval attached (reg. 16), the clause in the affidavit');
const ward = run({ who: 'guardian' });
check(ward.status === 'court' && ward.doc.includes('מונה לי אפוטרופוס') && ward.checklist.some((x) => x.he.includes('צו מינוי אפוטרופוס')), 'a ward: court approval and the guardianship order in the checklist');
check(run({ who: 'minor', stage: 'ordered' }).status === 'amend' && run({ who: 'minor', stage: 'ordered' }).court, 'a minor after an order: both the approval and the amendment');
const cond = run({ conditional: true });
check(cond.ok && cond.void && cond.status === 'ok' && cond.doc.length > 0 && cond.flags[0].code === 'void' && cond.flags[0].section === 'סעיף 6(ד)' && HUI.verdictSentence(reg, cond).includes('בטלה (סעיף 6(ד))'), 'conditional: the result still shows, marked void (s.6(ד))');
check(HUI.renderResult(reg, cond).includes('jtool-state--danger') && HUI.renderResult(reg, cond).includes('הסתלקות על תנאי בטלה'), 'conditional: the danger pill');

/* ---------- 8. The notary's fee (item 7) and VAT ---------- */
const n1 = run({ verify: 'notary', signers: 1 });
check(n1.cost.total === 236 && n1.cost.vat === 36 && n1.cost.lines[1].amount === 200 && n1.cost.lines[1].section === 'פרט 7' && n1.cost.notaryAlt === null && n1.doc.includes('אני הח"מ, נוטריון [שם מלא]'), 'notary, one signer: 200 x 1.18 = 236, VAT 36 (item 7); the verification block names a notary');
check(run({ verify: 'notary', signers: 2 }).cost.total === 330.4 && run({ verify: 'notary', signers: 3 }).cost.total === 424.8 && run({ verify: 'notary', signers: 4 }).cost.total === 519.2, 'notary, 2 / 3 / 4 signers: (200 + 80n) x 1.18 = 330.40 / 424.80 / 519.20');
check(run({ verify: 'notary', signers: 2, stage: 'ordered' }).cost.total === 927.4, 'notary with two signers after an order: 330.40 + 597 = 927.40');
check(run({ verify: 'lawyer', signers: 9 }).ok && !run({ verify: 'notary', signers: 5 }).ok && !run({ verify: 'notary', signers: 0 }).ok && !run({ verify: 'notary', signers: 1.5 }).ok, 'signers 1-4 only at the notary; ignored with a lawyer');
check(HUI.verdictSentence(reg, n1).includes('236') && HUI.verdictSentence(reg, ex).includes('לפי הסכם שכר הטרחה') && HUI.verdictSentence(reg, ex).includes('סעיף 6(א) ו-6(ב)') && HUI.verdictSentence(reg, ex).includes('תקנה 16'), 'the sentence: the notary total, or the lawyer by agreement, with s.6(א), 6(ב) and reg. 16');

/* ---------- 9. Input errors ---------- */
check(!run({ scope: 'part', pct: '' }).ok && !run({ scope: 'part', pct: 0 }).ok && !run({ scope: 'part', pct: 100 }).ok && !run({ scope: 'part', pct: 'abc' }).ok && run({ scope: 'part', pct: 99 }).ok && run({ scope: 'part', pct: 33.5 }).ok, 'a part: 1 to 99 only');
check(!run({ estate: -1 }).ok && !run({ estate: NaN }).ok && !run({ sharePct: 0 }).ok && !run({ sharePct: 101 }).ok && run({ estate: 0 }).ok && run({ sharePct: 100 }).ok, 'estate and share: a positive estate, a share in (0, 100]');
check(run({ scope: 'part', pct: '', verify: 'notary', signers: 7 }).errors.map((e) => e.field).join(',') === 'pct,signers', 'every error reported at once, with its field');

/* ---------- 10. The side-by-side ---------- */
const kinds = HE.byKind(reg, EX);
check(kinds.general.status === 'ok' && kinds.spouse.status === 'ok' && kinds.child.status === 'ok' && kinds.sibling.status === 'ok' && kinds.other.status === 'not_waiver', 'the same daughter in every kind: four allowed, "another person" is not a waiver');
check(HE.byKind(reg, Object.assign({}, EX, { relation: 'spouse' })).spouse.status === 'ok', 'byKind swaps the spouse for a child in the self-referential column');
const table = HUI.kindsTable(reg);
check(table.includes('<caption>') && (table.match(/<tr>/g) || []).length === 5 && table.includes('סעיף 6(ב)') && table.includes('סעיף 7') && table.includes('סעיף 1 (הגדרת מכירה)') && table.includes('סעיף 6(ג)'), 'the page table: a caption, four kinds, s.6(ב), s.7, the land-tax definition and s.6(ג)');

/* ---------- 11. The snapshot ---------- */
const snap = HUI.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence, snap.sticky].join('');
check(snap.tool === 'histalkut' && snap.registry_version === reg.registry_version && snap.total === 0 && snap.sticky === '<bdi>הכול</bdi>' && snap.sentence === HUI.verdictSentence(reg, ex), 'snapshot: tool id, registry version, no cost, the sticky scope text, the sentence');
check(snap.form.includes(`value="law" checked`) && snap.form.includes(`value="child" checked`) && snap.form.includes(`value="spouse" checked`) && snap.form.includes(`value="before" checked`) && snap.form.includes(`value="lawyer" checked`) && snap.form.includes(`value="f" checked`), 'the form is pre-filled with the example');
check(snap.result.includes('jt24-flow') && snap.result.includes('aria-hidden="true"') && snap.result.includes('jt24-flow__text') && snap.result.includes('דוגמה מחושבת') && snap.result.includes('מותר להסתלק') && snap.result.includes('בן/בת הזוג של המנוח/ה'), 'the result: the share-flow picture, hidden from readers with its text twin, the example label, the verdict');
check(snap.details.includes('jt24-doc') && snap.details.includes('data-act="copy-doc"') && snap.details.includes('תצהיר הסתלקות מירושה') && snap.details.includes('236') && snap.details.includes('פרט 7') && snap.details.includes('597') && snap.details.includes('14 ימים') && snap.details.includes('jt24-now') && snap.details.includes('data-act="copy-list"'), 'the details: the affidavit sheet with its copy button, the notary alternative 236 (item 7), the clock with 597 and 14 days, the checklist');
check(snap.method.includes('<ol>') && snap.method.includes('סעיף 6(א)') && snap.method.includes('סעיף 6(ב)') && snap.method.includes('סעיף 6(ג)') && snap.method.includes('סעיף 6(ד)') && snap.method.includes('תקנה 16') && snap.method.includes('597') && snap.method.includes('236') && snap.method.includes(ip.law_url) && snap.method.includes(reg.will_cost.notary.url), 'the method cites every subsection of s.6, reg. 16, 597 and 236, with the official urls');
check(all.split('jtool-cite').length > 12 && all.includes(ip.regulations_url) && all.includes(ip.land_tax.url), 'cites throughout, to the law, the regulations and the land-tax law');
check(!/<h2[\s>]/.test(all) && !all.includes('undefined') && !all.includes('NaN') && !all.includes('null'), 'no <h2>, no undefined / NaN / null in any rendered string');
const blockedHtml = HUI.renderResult(reg, other) + HUI.renderDetails(reg, other) + HUI.renderResult(reg, div) + HUI.renderDetails(reg, div) + HUI.renderDetails(reg, minor) + HUI.renderDetails(reg, n1) + HUI.renderResult(reg, part) + HUI.renderResult(reg, run({ scope: 'part', pct: '' }));
check(!blockedHtml.includes('undefined') && !blockedHtml.includes('NaN') && blockedHtml.includes('jt24-node--wall') && blockedHtml.includes('צריך לתקן את הקלט') && blockedHtml.includes('100,000'), 'blocked, minor, notary, part and error states render clean; the wall node; the money sentence 100,000');

/* ---------- 12. The share state round trip, and nothing personal in it ---------- */
const full = { basis: 'will', relation: 'grandchild', scope: 'part', pct: 33.5, bequest: 'הדירה', kind: 'sibling', who: 'guardian', stage: 'ordered', conditional: true, verify: 'notary', signers: 3, gender: 'm', estate: 2500000, sharePct: 12.5 };
const st = HUI.stateOf(full);
const back = HUI.inputOf(decodeState(`#s=${st}`, HUI.KEYS));
check(JSON.stringify(back) === JSON.stringify(Object.assign({}, full, { bequest: '' })), 'stateOf -> decodeState -> inputOf returns the same answers, with the bequest text left out');
check(!/[֐-׿]/.test(st) && !st.includes('הדירה') && /^[0-9A-Za-z._~\/-]+$/.test(st), 'the share state carries no Hebrew and no description, only answer codes');
check(JSON.stringify(HUI.inputOf(decodeState(HUI.stateOf(EX), HUI.KEYS))) === JSON.stringify(EX) && HUI.inputOf({}) === null, 'the example round-trips exactly; an empty hash gives no input');
check(HUI.stateOf(EX) === 'bl/rc/sa/ks/wa/tb', 'the example state is short and readable');
check(HUI.checklistText(ex).startsWith('1. ') && HUI.checklistText(ex).includes('(סעיף 6 לחוק; תקנה 16)') && HUI.TOOL_ID === 'histalkut', 'the checklist as numbered text, and the tool id');

console.log(`histalkut: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
