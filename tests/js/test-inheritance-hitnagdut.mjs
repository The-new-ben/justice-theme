/**
 * Golden tests for the objection clock and grounds checker (hitnagdut, the inheritance wave, 21.10.2026).
 * Run: node tests/js/test-inheritance-hitnagdut.mjs
 *
 * Every expected value is hand-computed from the registry's inheritance_process and will_cost datasets: 14 days from the
 * publication (s.67; reg. 17(א)), the family-court objection fee (first schedule item 4, text from 1.7.2026), the s.72
 * route (registrar item 2, family court item 4א, 14 days for the heirs, reg. 27), and the Bar's recommended minimum
 * (1.5% of the estate, at least the minimum, +25% with an objection, a fixed sum per extra hearing; VAT 18%).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/hitnagdut-engine.js';
import * as UI from '../../assets/js/tools/hitnagdut-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const near = (a, b, eps = 0.005) => Math.abs(a - b) <= eps;
const TODAY = UI.EXAMPLE_TODAY;
const ex = (over = {}) => Object.assign({}, UI.EXAMPLE, { today: TODAY }, over);

/* ---------- 1. The registry facts the tool reads ---------- */
{
	const ip = reg.inheritance_process;
	check(ip.checked_on === '2026-10-21' && ip.days.objection === 14 && ip.days.amend_response === 14 && ip.days.other_will_notice === 14, 'registry: 14 days to object (reg. 17(א)), 14 for the heirs (reg. 27), 14 for another will (reg. 18)');
	check(ip.family_court.items.objection.amount === 1151 && ip.family_court.items.objection.item === 'התוספת הראשונה, פרט 4' && ip.family_court.current_to === '2026-07-01', 'registry: objection fee 1,151 (family court, item 4, text from 1.7.2026)');
	check(ip.registrar.items.amend.amount === 597 && ip.family_court.items.amend.amount === 1183, 'registry: amendment 597 at the registrar (item 2), 1,183 at the family court (item 4א)');
	check(reg.will_cost.bar.probate_pct === 1.5 && reg.will_cost.bar.probate_min === 4281 && reg.will_cost.bar.objection_add_pct === 25 && ip.bar.hearing === 754 && reg.will_cost.vat.pct === 18, 'registry: Bar 1.5%, minimum 4,281, +25% with an objection, 754 per hearing; VAT 18%');
	check(ip.grounds.length === 10 && ip.grounds.map((g) => g.key).join() === 'capacity,coercion,mistake,beneficiary,form,revoked,mutual,unclear,illegal,forgery', 'registry: ten grounds, capacity (s.26) to forgery (ss.19-20)');
}

/* ---------- 2. The clock ---------- */
{
	const r = E.compute(reg, ex());
	check(r.ok && r.deadline === '2026-10-25' && r.daysLeft === 4 && r.elapsed === 10 && r.band === 'open' && r.count === 4, 'example: published 11.10.2026 + 14 = 25.10.2026; on 21.10.2026 four days left, band open (reg. 17(א))');
	check(E.compute(reg, ex({ published: TODAY })).daysLeft === 14 && E.compute(reg, ex({ published: TODAY })).band === 'open', 'published today: 14 days left');
	const bands = [['2026-10-10', 3, 'closing'], ['2026-10-09', 2, 'closing'], ['2026-10-08', 1, 'closing'], ['2026-10-07', 0, 'last'], ['2026-10-06', -1, 'passed'], ['2026-09-01', -36, 'passed']];
	check(bands.every(([d, left, band]) => { const q = E.compute(reg, ex({ published: d })); return q.ok && q.daysLeft === left && q.band === band; }), 'bands: 1-3 days closing, 0 the last day, below zero passed');
	check(E.compute(reg, ex({ published: '2026-10-06' })).count === 0 && E.compute(reg, ex({ published: '2026-10-06' })).route === 'objection', 'passed: the count shows 0, the route is still the objection (an extension can be asked)');
	check(E.compute(reg, ex({ published: '11.10.2026' })).deadline === '2026-10-25' && E.compute(reg, ex({ published: '11/10/26' })).deadline === '2026-10-25', 'the date field accepts 11.10.2026 and 11/10/26');
	const before = E.compute(reg, ex({ stage: 'before', published: '' }));
	check(before.ok && before.band === 'none' && before.deadline === null && before.daysLeft === null && before.count === 14, 'not yet published: no clock, the count is the 14-day window');
	const issued = E.compute(reg, ex({ stage: 'issued', issued: '2026-10-01', published: '2026-09-10' }));
	check(issued.ok && issued.band === 'issued' && issued.route === 'amend' && issued.count === 14 && issued.amend.responseBy === '2026-10-15' && issued.deadline === '2026-09-24', 'order issued 1.10.2026: the s.72 route, the heirs answer by 15.10.2026 (reg. 27); the old window (24.9.2026) still shown');
	check(E.compute(reg, ex({ stage: 'issued', issued: '2026-10-01', published: '' })).ok, 'order issued: the publication date is optional');
}

/* ---------- 3. Input errors ---------- */
{
	const bad = (over, field) => { const q = E.compute(reg, ex(over)); return !q.ok && q.errors.some((e) => e.field === field); };
	check(bad({ published: '2026-10-30' }, 'published'), 'a publication date after today is an error');
	check(bad({ published: '' }, 'published') && bad({ published: 'מחר' }, 'published') && bad({ published: '31.2.2026' }, 'published'), 'a missing, non-date or impossible publication date is an error');
	check(bad({ stage: 'issued', issued: '' }, 'issued') && bad({ stage: 'issued', issued: '2026-11-01' }, 'issued'), 'order issued: a missing date, or one after today, is an error');
	check(bad({ stage: 'issued', issued: '2026-10-01', published: '2026-10-11' }, 'issued'), 'an order dated before the publication is an error');
	check(bad({ barRef: true, estate: -5 }, 'estate') && E.compute(reg, ex({ barRef: false, estate: -5 })).ok, 'a negative estate is an error only when the Bar reference is on (otherwise the field is not read)');
}

/* ---------- 4. The grounds map ---------- */
{
	const r = E.compute(reg, ex());
	check(r.counts.selected === 3 && r.counts.withEvidence === 2 && r.counts.without === 1, 'example: three grounds, two with evidence (capacity s.26, coercion s.30(א)), one without (beneficiary s.35)');
	const by = Object.fromEntries(r.grounds.map((g) => [g.key, g]));
	check(by.capacity.strength === 'strong' && by.coercion.strength === 'strong' && by.beneficiary.strength === 'needs' && by.mistake.strength === '' && !by.mistake.mine, 'strength: strong with evidence, needs without, blank when not selected');
	check(by.capacity.scope === 'whole' && by.forgery.scope === 'whole' && by.coercion.scope === 'clause' && by.beneficiary.scope === 'clause' && by.form.scope === 'depends' && by.revoked.scope === 'depends', 'scope from the registry text: the will void (s.26, forgery) vs the clause (s.30(א), s.35) vs depends (s.25, s.36)');
	check(r.counts.whole === 1 && r.counts.clause === 2 && by.capacity.section === 'סעיף 26' && by.beneficiary.section === 'סעיף 35', 'counts by scope, and the sections travel with the grounds');
	check(E.compute(reg, ex({ grounds: ['capacity'], evidence: ['coercion'] })).counts.withEvidence === 0, 'evidence counts only for a ground that was selected');
	const ih = E.compute(reg, ex({ filed: 'inheritance', grounds: ['missing_heir', 'capacity'], evidence: [] }));
	check(ih.ok && ih.grounds.length === 4 && ih.counts.selected === 1 && ih.grounds[0].section === 'סעיף 66' && ih.grounds[3].section === 'סעיף 67', 'an inheritance order: four grounds on the heirs and shares, cited to s.66-67 only; probate keys are ignored');
	check(E.inheritanceGrounds(reg.inheritance_process).every((g) => g.he && g.evidence && g.effect && g.url === reg.inheritance_process.law_url), 'inheritance grounds carry a text, the evidence, the effect and the law url');
}

/* ---------- 5. Fees and the Bar reference ---------- */
{
	const r = E.compute(reg, ex());
	check(r.fee.amount === 1151 && r.fee.item === 'התוספת הראשונה, פרט 4' && r.fee.url === reg.inheritance_process.family_court.url && r.fee.pay === reg.inheritance_process.registrar.payments.url, 'the objection fee 1,151 with its item, the regulation url and the payments url');
	check(r.amend.registrar.amount === 597 && r.amend.court.amount === 1183 && r.amend.days === 14 && r.amend.section === 'סעיף 72', 'the s.72 route: 597 / 1,183 and 14 days');
	check(!r.bar.shown && !E.compute(reg, ex({ barRef: true, estate: '' })).bar.shown, 'the Bar reference is hidden until it is on and an estate value is typed');
	const b = E.compute(reg, ex({ barRef: true, estate: 1000000 })).bar;
	check(b.shown && b.base === 15000 && b.add === 3750 && b.withObjection === 18750 && b.withVat === 22125 && b.hearing === 754 && !b.atMin, 'estate 1,000,000: 1.5% = 15,000; +25% = 18,750 before VAT; 22,125 with VAT 18%; 754 per extra hearing (item 4.א(4))');
	const m = E.compute(reg, ex({ barRef: true, estate: 100000 })).bar;
	check(m.base === 4281 && m.withObjection === 5351.25 && near(m.withVat, 6314.48, 0.01) && m.atMin, 'estate 100,000: 1.5% = 1,500 is below the minimum, so 4,281; +25% = 5,351.25');
}

/* ---------- 6. Flags ---------- */
{
	const codes = (over) => E.compute(reg, ex(over)).flags.map((f) => f.code);
	check(codes({}).length === 0, 'the example raises no flag');
	check(codes({ published: '2026-10-01' }).includes('extension') && codes({ published: '2026-10-01', extension: true }).includes('extension_asked'), 'passed: ask the registrar for an extension (reg. 17(א)); a different line once it was asked');
	check(codes({ published: '2026-10-10' }).includes('rest_day') && E.compute(reg, ex({ published: '2026-10-10' })).deadline === '2026-10-24', 'a last day on Saturday 24.10.2026 is flagged');
	check(codes({ standing: 'prior_will' }).includes('other_will') && codes({ standing: 'other' }).includes('standing'), 'a beneficiary of another will: reg. 18; another standing: state the right (reg. 19)');
	check(codes({ stage: 'issued', issued: '2026-10-01', published: '' }).includes('good_faith') && codes({ stage: 'issued', issued: '2026-09-01', published: '' }).includes('amend_old'), 'after the order: good-faith buyers (s.73); an old order: the registrar refers to the court (s.72)');
	check(codes({ represented: true }).includes('poa') && codes({ evidence: [] }).includes('no_evidence') && codes({ filed: 'inheritance', grounds: ['will_exists'] }).includes('will_exists'), 'represented: a power of attorney; no evidence at all; a will exists against an inheritance order');
	check(E.compute(reg, ex({ published: '2026-10-01' })).flags.every((f) => !f.section || f.url), 'every flag with a section carries a url to cite');
}

/* ---------- 7. The draft ---------- */
{
	const r = E.compute(reg, ex());
	const d = E.draftText(reg, r);
	check(d.startsWith('בפני הרשם לענייני ירושה ב[מחוז]') && d.includes('כתב התנגדות למתן צו קיום צוואה') && d.includes('1. הזכות של המתנגד/ת') && d.includes('5. נספחים') && d.includes('תצהיר לאימות העובדות'), 'the draft: heading, title, standing, annexes, affidavit line');
	check(d.includes('3.1 ') && d.includes('(סעיף 26 לחוק הירושה)') && d.includes('(סעיף 30(א) לחוק הירושה)') && d.includes('(סעיף 35 לחוק הירושה)') && d.includes('[להשלים לפני ההגשה]'), 'one numbered paragraph per ground with its section; the missing evidence is marked');
	check(d.includes('1,151 ₪') && d.includes('11.10.2026') && d.includes('[שם מלא]') && d.includes('[מספר זהות]') && !/\d{9}/.test(d), 'the fee and the publication date are in; names and IDs are placeholders only');
	const a = E.draftText(reg, E.compute(reg, ex({ stage: 'issued', issued: '2026-10-01', published: '' })));
	check(a.includes('בקשה לתיקון או לביטול צו קיום צוואה (סעיף 72') && a.includes('597 ₪') && a.includes('1,183 ₪') && a.includes('1.10.2026') && a.includes('14 ימים'), 'after the order: the s.72 request with both fees and the heirs\' 14 days');
	const w = E.draftText(reg, E.compute(reg, ex({ standing: 'prior_will', grounds: ['coercion', 'beneficiary'], evidence: ['coercion', 'beneficiary'] })));
	check(w.includes('זוכה בצוואה קודמת מיום') && w.includes('(סעיף 38)') && w.includes('לקיים את הצוואה הקודמת'), 'clause-only grounds with an earlier will: cancel the clauses, keep the rest (s.38), uphold the earlier will');
	check(E.draftText(reg, E.compute(reg, ex({ represented: true }))).includes('ג. ייפוי כוח'), 'represented: the power of attorney is an annex');
}

/* ---------- 8. The snapshot (server HTML) ---------- */
{
	const s = UI.snapshot(reg);
	check(s.tool === 'hitnagdut' && s.registry_version === reg.registry_version && s.total === 4 && s.sticky === '<bdi>4</bdi>' && s.input === UI.EXAMPLE, 'snapshot: tool id, registry version, the count 4 for the sticky bar');
	check(s.sentence === 'נשארו 4 ימים: ההתנגדות לצו קיום צוואה מוגשת לרשם לענייני ירושה עד 25.10.2026, עם אגרה של 1,151 ₪, ונדונה בבית המשפט לענייני משפחה (סעיף 67א).', 'the verdict sentence, word for word');
	check(s.result.includes('jt27-clock--open') && s.result.includes('jt27-day--today') && (s.result.match(/jt27-day--past/g) || []).length === 9 && (s.result.match(/jt27-day--left/g) || []).length === 4 && s.result.includes('25.10.2026') && s.result.includes('11.10.2026') && s.result.includes('aria-hidden="true"'), 'the track: 9 days gone, today, 4 left; the dates in text; the cells hidden from screen readers');
	check(s.result.includes('jt27-map') && s.result.includes('יש ראיה') && s.result.includes('חסרה ראיה') && s.result.includes('3 עילות: 2 עם ראיות, 1 בלי') && s.result.includes('סעיף 26') && s.result.includes('כל הצוואה'), 'the grounds map with the strength summary and the scope');
	check(s.result.includes('דוגמה מחושבת') && s.result.includes('<bdi>4</bdi>') && s.result.includes('jtool-state--ok'), 'the result is marked as the example, with the figure and the open state');
	check(s.details.includes('jt27-doc') && s.details.includes('כתב התנגדות למתן צו קיום צוואה') && s.details.includes('data-act="copy-doc"') && s.details.includes('data-act="ics"') && s.details.includes('data-act="copy-list"'), 'details: the draft with copy, the calendar button, the checklist copy');
	check(s.details.includes('1,151') && s.details.includes('25.10.2026') && s.details.includes('תקנה 19') && s.details.includes('תקנה 21') && s.details.includes('סעיף 67א') && s.details.includes('סעיף 155') && s.details.includes(reg.inheritance_process.courts.mediation_url) && s.details.includes(reg.inheritance_process.registrar.payments.url), 'details: the clock table, the fee, reg. 19 contents, the parties (reg. 21), the court, the religious court, mediation, the payments link');
	check(s.method.includes('25.10.2026') && s.method.includes('1,151') && s.method.includes('סעיף 67') && s.method.includes('תקנה 17(א)') && s.method.includes('סעיף 35'), 'the method lists the publication, the deadline, the fee and the grounds with cites');
	check(s.compare_table.includes('<caption') && s.compare_table.includes('1,151') && s.compare_table.includes('597') && s.compare_table.includes('1,183') && s.compare_table.includes('סעיף 72') && s.compare_table.includes('<bdi>14</bdi>'), 'the page table: three stages with the fees, the clocks and the sections');
	check(s.form.includes('11.10.2026') && (s.form.match(/jt27-ground"/g) || []).length + (s.form.match(/jt27-ground jt27-ground--on"/g) || []).length === 14 && s.form.includes('זו העילה שלי') && s.form.includes('יש לי ראיה לזה') && s.form.includes('ביקשתי הארכה מהרשם'), 'the form: the example date, ten probate grounds and four inheritance grounds, the two chips, the extension box');
	const all = [s.form, s.result, s.details, s.method, s.compare_table, s.sticky, s.sentence].join('');
	check(!/<h2[\s>]/.test(all), 'no <h2> inside the tool HTML (the TOC injector rule)');
	check(!/undefined|NaN|\[object/.test(all), 'no undefined, NaN or [object in any rendered string');
	check(!/Infinity/.test(all) && !all.includes('null'), 'no Infinity or null leaks into the HTML');
}

/* ---------- 9. Other states rendered ---------- */
{
	const none = UI.renderResult(reg, E.compute(reg, ex({ stage: 'before', published: '' })));
	check(none.includes('jt27-clock--none') && none.includes('השעון מתחיל ביום הפרסום') && !none.includes('jt27-now') && none.includes('<bdi>14</bdi>'), 'not yet published: an empty track, no today marker, the 14-day window as the figure');
	const passed = E.compute(reg, ex({ published: '2026-10-01' }));
	const ph = UI.renderResult(reg, passed);
	check(ph.includes('jtool-state--danger') && UI.verdictSentence(reg, passed).includes('חלון ההתנגדות נסגר ב-15.10.2026, לפני 6 ימים') && UI.verdictSentence(reg, passed).includes('תקנה 17(א)') && UI.verdictSentence(reg, passed).includes('סעיף 72'), 'passed: the danger state and the sentence with the extension and the s.72 route');
	const iss = E.compute(reg, ex({ stage: 'issued', issued: '2026-10-01', published: '' }));
	const ih = UI.renderResult(reg, iss) + UI.renderDetails(reg, iss);
	check(ih.includes('jt27-route') && ih.includes('1.10.2026') && ih.includes('597') && ih.includes('1,183') && ih.includes('תקנה 27') && !ih.includes('data-act="ics"') && UI.verdictSentence(reg, iss).includes('סעיף 72'), 'after the order: the route strip, both fees, reg. 27; no calendar button');
	check(UI.verdictSentence(reg, E.compute(reg, ex({ published: '2026-10-07' }))).startsWith('היום הוא היום האחרון') && UI.verdictSentence(reg, E.compute(reg, ex({ published: '2026-10-08' }))).startsWith('נשאר יום אחד בלבד'), 'the last day, and one day left, in words');
	const err = UI.renderResult(reg, E.compute(reg, ex({ published: '2026-12-01' })));
	check(err.includes('jtool-state--danger') && err.includes('יום הפרסום לא יכול להיות אחרי היום (21.10.2026)'), 'an input error renders the message');
	const bar = UI.renderDetails(reg, E.compute(reg, ex({ barRef: true, estate: 1000000 })));
	check(bar.includes('התעריף המינימלי המומלץ') && bar.includes('15,000') && bar.includes('3,750') && bar.includes('18,750') && bar.includes('22,125') && bar.includes('754') && bar.includes('פרט 4.א(4)(ב)'), 'the Bar table: 15,000 + 3,750 = 18,750, 22,125 with VAT, 754 per hearing');
}

/* ---------- 10. Share state and the calendar ---------- */
{
	const back = UI.inputOf(decodeState(`#s=${UI.stateOf(UI.EXAMPLE)}`, UI.KEYS));
	check(back && back.filed === 'probate' && back.stage === 'published' && back.published === '2026-10-11' && back.standing === 'heir' && back.grounds.join() === 'capacity,coercion,beneficiary' && back.evidence.join() === 'capacity,coercion' && back.represented === false && back.barRef === false && back.estate === '' && back.extension === false, 'share state round trip: the example comes back whole');
	const full = { filed: 'inheritance', stage: 'issued', published: '2026-09-10', issued: '1.10.2026', standing: 'prior_will', grounds: ['missing_heir'], evidence: ['missing_heir'], represented: true, barRef: true, estate: 1000000, extension: true };
	const fb = UI.inputOf(decodeState(`#s=${UI.stateOf(full)}`, UI.KEYS));
	check(fb.filed === 'inheritance' && fb.stage === 'issued' && fb.issued === '2026-10-01' && fb.published === '2026-09-10' && fb.standing === 'prior_will' && fb.represented && fb.barRef && fb.estate === 1000000 && fb.extension, 'share state round trip: every answer, with a d.m.y date normalised to ISO');
	check(!/[֐-׿]/.test(UI.stateOf(full)) && !UI.stateOf(UI.EXAMPLE).includes('today') && UI.inputOf({}) === null, 'the share state holds answers only, no Hebrew text, no "today"; an empty state is no input');
	const events = UI.icsEvents(reg, E.compute(reg, ex()));
	check(events.length === 2 && events[0].date === '2026-10-22' && events[1].date === '2026-10-25' && events[1].summary.includes('המועד האחרון'), 'the calendar: a reminder three days before (22.10.2026) and the last day (25.10.2026)');
	const text = ics(events, '2026-10-21T10:00:00.000Z');
	check(text.includes('DTSTART;VALUE=DATE:20261025') && text.includes('DTSTART;VALUE=DATE:20261022') && text.includes('BEGIN:VEVENT'), 'the .ics carries both dates');
	check(UI.icsEvents(reg, E.compute(reg, ex({ published: '2026-10-08' }))).length === 1 && UI.icsEvents(reg, E.compute(reg, ex({ stage: 'before', published: '' }))).length === 0, 'one day left: the reminder is in the past, so only the last day; not yet published: nothing to add');
}

console.log(`hitnagdut: ${passed} checks passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
