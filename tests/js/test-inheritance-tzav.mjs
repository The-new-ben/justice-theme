/**
 * Golden tests for the request planner (the inheritance wave, 21.10.2026). Run: node tests/js/test-inheritance-tzav.mjs
 *
 * The fees are the registrar's fee regulations in the text from 1.1.2026 (item 1: 597; 85% online, charged as 507 by the
 * payments service; publication 66), summed by hand. The clock is reg. 14 (the original will within 7 days of an online
 * filing) and reg. 17(א) (two weeks from the publication), counted by hand on the calendar. The documents are reg. 14-16
 * and the service page, picked by the case.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as TZ from '../../assets/js/tools/tzav-engine.js';
import * as TZUI from '../../assets/js/tools/tzav-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const ip = reg.inheritance_process;

/* ---------- The registry ---------- */
check(ip.checked_on === '2026-10-21' && ip.registrar.items.order.amount === 597 && ip.registrar.payments.online_fee === 507 && ip.registrar.payments.publication === 66, 'registry: 597 / 507 / 66 (fee regs from 1.1.2026, the payments service)');
check(ip.days.objection === 14 && ip.days.online_original_will === 7 && ip.days.amend_response === 14, 'registry: 14 days to object, 7 days for the original will, 14 days to answer an amendment');
check(ip.family_court.items.objection.amount === 1151 && ip.family_court.items.amend.amount === 1183 && ip.family_court.items.manager.amount === 1183, 'registry: the family court charges 1,151 / 1,183 / 1,183 from 1.7.2026');
check(ip.documents.length === 13 && ip.routes.length === 8 && ip.grounds.length === 10, 'registry: 13 document lines, 8 routes, 10 grounds');

/* ---------- The route ---------- */
const base = { will: 'none', filer: 'self', heirs: 3, relation: 'close', filed: '2026-11-01' };
const self = TZ.tzBuild(reg, base);
check(self.ok && self.route === 'online' && self.total === 573, `an unrepresented heir files online: 507 + 66 = 573 (engine ${self.total})`);
const lawyer = TZ.tzBuild(reg, Object.assign({}, base, { filer: 'lawyer' }));
check(lawyer.ok && lawyer.route === 'online' && lawyer.why[0].he.indexOf('מייצג') === 0, 'a represented applicant: online only');
const ext = TZ.tzBuild(reg, Object.assign({}, base, { relation: 'extended', filer: 'lawyer' }));
check(ext.ok && ext.route === 'manual' && ext.total === 663 && ext.lines[0].amount === 597, `siblings or uncles among the heirs: paper only, 597 + 66 = 663, even with a lawyer (engine ${ext.total})`);
const rel = TZ.tzBuild(reg, Object.assign({}, base, { religious: true }));
check(rel.ok && rel.route === 'religious' && rel.lines[0].amount === null && rel.steps.every((s) => s.id !== 'publish'), 'the religious court: everyone consents in writing (s.155), no registrar fee computed, no publication station');
const ex = TZ.tzBuild(reg, Object.assign({}, base, { exempt: true }));
check(ex.ok && ex.total === 0 && ex.lines.every((l) => l.amount === 0) && ex.lines[0].section === 'תקנה 4(5)', 'the exemption of reg. 4(5): no fee, publication on the registrar');

/* ---------- The documents of reg. 14-16 ---------- */
check(self.documents.length === 4 && self.documents.map((d) => d.key).join() === 'form,death,notice,fee', `three heirs, no will, no waiver: form, death certificate, notices, fee (engine ${self.documents.map((d) => d.key).join()})`);
const one = TZ.tzBuild(reg, Object.assign({}, base, { heirs: 1 }));
check(one.ok && one.documents.every((d) => d.key !== 'notice') && one.steps.every((s) => s.id !== 'notice'), 'a single heir sends no notices');
const full = TZ.tzBuild(reg, { will: 'will', filer: 'lawyer', heirs: 4, renounce: 1, renounceMinor: true, predeceased: 1, minor: true, realEstate: true, idIsrael: false, certificate: false, filed: '2026-11-01' });
check(full.ok && full.documents.length === 13, `every condition on: all 13 lines (engine ${full.documents.length})`);
check(full.documents.some((d) => d.key === 'will') && full.documents.some((d) => d.key === 'poa') && full.documents.some((d) => d.key === 'minor_renounce') && full.documents.some((d) => d.key === 'tabu'), 'the will, the power of attorney, the court approval for a minor\'s waiver, the land registration request');
check(TZUI.EXAMPLE.renounce === 1 && TZ.tzBuild(reg, TZUI.EXAMPLE).documents.length === 6, 'the example (3 heirs, one waives, a flat): 6 documents');

/* ---------- The clock ---------- */
const willOnline = TZ.tzBuild(reg, { will: 'will', filer: 'self', heirs: 2, filed: '2026-11-01', publication: '2026-11-20', today: '2026-11-25' });
check(willOnline.ok && willOnline.clock.originalWillBy === '2026-11-08' && willOnline.clock.objectionsBy === '2026-12-04' && willOnline.clock.daysLeft === 9, `online probate: the original will by 8.11.2026, objections by 4.12.2026, 9 days left on 25.11 (engine ${willOnline.clock.originalWillBy} ${willOnline.clock.objectionsBy} ${willOnline.clock.daysLeft})`);
check(willOnline.steps.some((s) => s.id === 'original' && s.when === 'עד 8.11.2026'), 'the original-will station carries its date');
const paperWill = TZ.tzBuild(reg, { will: 'will', filer: 'self', heirs: 2, relation: 'extended', filed: '2026-11-01' });
check(paperWill.ok && paperWill.route === 'manual' && !paperWill.clock.originalWillBy && paperWill.steps.every((s) => s.id !== 'original'), 'a paper filing has no 7-day original-will station');
check(self.steps.map((s) => s.id).join() === 'docs,notice,fee,file,publish,objection,order,divide', `the docket of the base case (engine ${self.steps.map((s) => s.id).join()})`);
check(TZ.tzBuild(reg, TZUI.EXAMPLE).steps.some((s) => s.id === 'renounce' && s.link.path === '/disclaimer-renouncing-share/'), 'a waiver station links to the waiver generator');

/* ---------- Errors ---------- */
check(!TZ.tzBuild(reg, { heirs: 0 }).ok && !TZ.tzBuild(reg, { heirs: 31 }).ok && !TZ.tzBuild(reg, { heirs: '' }).ok, 'heirs outside 1-30 or empty: an input error');
check(!TZ.tzBuild(reg, { heirs: 2, renounce: 2 }).ok && TZ.tzBuild(reg, { heirs: 2, renounce: 1 }).ok, 'everyone waiving is an error; one of two is fine');
check(!TZ.tzBuild(reg, { heirs: 2, filed: '2026-11-20', publication: '2026-11-01' }).ok, 'a publication before the filing is an error');
check(!TZ.tzBuild(reg, { heirs: 2, filed: 'abc' }).ok && !TZ.tzBuild(reg, { heirs: 2, publication: '31.02.2026' }).ok, 'a bad date is an error');
check(TZ.tzBuild(reg, { heirs: 2, predeceased: 1 }).flags.some((f) => f.code === 'predeceased') && TZ.tzBuild(reg, { heirs: 2, abroad: true }).flags.some((f) => f.code === 'abroad') && TZ.tzBuild(reg, { heirs: 2, certificate: false }).flags.some((f) => f.code === 'no_certificate'), 'the flags for a predeceased heir, a deceased abroad, no death certificate');

/* ---------- The snapshot and the share state ---------- */
const snap = TZUI.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence].join('');
check(snap.total === 573 && snap.sticky.indexOf('573') > 0 && snap.result.indexOf('573') > 0 && snap.details.indexOf('<bdi>507</bdi>') > 0 && snap.details.indexOf('<bdi>66</bdi>') > 0, 'the snapshot carries 573, 507 and 66');
check(all.indexOf('undefined') < 0 && all.indexOf('NaN') < 0 && !/<h2/.test(all), 'no undefined, no NaN, no <h2> in the rendered HTML');
check(snap.result.indexOf('jt23-rail') > 0 && (snap.result.match(/class="jt23-st"/g) || []).length === 9, `the example docket has 9 stations (engine ${(snap.result.match(/class="jt23-st"/g) || []).length})`);
check(snap.details.indexOf('תקנה 14(ב)') > 0 && snap.details.indexOf('תקנה 16') > 0 && snap.method.indexOf('תקנה 17(ג)') > 0, 'the cites: reg. 14(ב), reg. 16, reg. 17(ג)');
check(snap.compare_table.indexOf('663') > 0 && snap.compare_table.indexOf('573') > 0 && snap.compare_table.indexOf('בתי הדין') > 0, 'the page table: 573 online, 663 on paper, the religious court by its own rules');
check(/^[0-9A-Za-z./_~-]*$/.test(TZUI.stateOf(TZUI.EXAMPLE)) && TZUI.stateOf(TZUI.EXAMPLE) === 'h3/r1/e1/f2026-11-01', `the share state of the example: h3/r1/e1/f2026-11-01 (engine ${TZUI.stateOf(TZUI.EXAMPLE)})`);
const fullInput = { will: 'will', filer: 'lawyer', heirs: 4, renounce: 1, renounceMinor: true, predeceased: 1, minor: true, realEstate: true, idIsrael: false, certificate: false, filed: '2026-11-01' };
const back = TZUI.inputOf(decodeState(`#s=${TZUI.stateOf(fullInput)}`, TZUI.KEYS));
check(back && back.will === 'will' && back.filer === 'lawyer' && back.heirs === 4 && back.renounce === 1 && back.renounceMinor && back.predeceased === 1 && back.minor && back.realEstate && back.idIsrael === false && back.certificate === false, 'the share state round-trips every field');
check(TZUI.inputOf(decodeState('#s=', TZUI.KEYS)) === null, 'an empty hash is no state');
check(snap.form.indexOf('jt23-heirs') > 0 && snap.form.indexOf('jt23-pub') > 0 && snap.form.indexOf('name="jt23-will"') > 0 && !/name="jt23-[a-z]+"[^>]*>\s*<span>\s*</.test(snap.form), 'the form holds the fields the reader expects, and no empty chip');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
