/**
 * Golden tests for the dispute navigator (the inheritance wave, 21.10.2026). Run: node tests/js/test-inheritance-sichsuch.mjs
 *
 * The routes each quarrel opens and the stage that closes them are read against the law (s.67 objections before the order;
 * s.72 after it; s.110 agreement until the division; s.60 maintenance up to 6 months after it). The fees are the registrar's
 * schedule (597) and the family court's schedule from 1.7.2026 (1,151 / 1,183 / 3,481 / 574). The Bar's reference is the
 * 2026 tariff by hand: 1.5% of 1,000,000 = 15,000, +25% = 18,750; 3% of a 25% share of 1,000,000 = 7,500.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as SC from '../../assets/js/tools/sichsuch-engine.js';
import * as SCUI from '../../assets/js/tools/sichsuch-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const keys = (r) => r.routes.map((x) => x.key).join();

/* ---------- Routes by quarrel and stage ---------- */
const flat = SC.scBuild(reg, { issues: ['apartment'], stage: 'before', heirs: 3 });
check(flat.ok && keys(flat) === 'agreement,mediation,partition,manager', `a shared flat before any request: agreement, mediation, partition, manager (engine ${keys(flat)})`);
const will = SC.scBuild(reg, { issues: ['will'], stage: 'published', publication: '2026-10-11', today: '2026-10-21' });
check(will.ok && keys(will) === 'objection,amend,mediation,agreement' && will.routes[0].timing === 'now' && will.routes[1].timing === 'later', 'a doubted will after publication: the objection is open now, the amendment only later');
check(will.clock.objectionsBy === '2026-10-25' && will.clock.daysLeft === 4 && will.clock.band === 'open' && will.routes[0].clock === 'עד 25.10.2026', `publication 11.10.2026: objections by 25.10, 4 days left on 21.10 (engine ${will.clock.objectionsBy} ${will.clock.daysLeft})`);
check(SC.scBuild(reg, { issues: ['will'], stage: 'published', publication: '2026-10-11', today: '2026-10-24' }).clock.band === 'closing' && SC.scBuild(reg, { issues: ['will'], stage: 'published', publication: '2026-10-11', today: '2026-10-26' }).clock.band === 'passed', 'the band closes at 3 days and passes after the deadline');
const issued = SC.scBuild(reg, { issues: ['will'], stage: 'issued' });
check(issued.ok && keys(issued) === 'amend,mediation,agreement' && issued.routes[0].timing === 'now', 'after the order: no objection; amendment or cancellation (s.72) is open');
const divided = SC.scBuild(reg, { issues: ['will', 'support', 'apartment'], stage: 'divided' });
check(divided.ok && keys(divided) === 'amend,mediation,support,partition,manager' && divided.routes.find((x) => x.key === 'support').timing === 'late', 'after the division: no agreement, maintenance only up to 6 months (s.60), partition stays');
check(divided.flags.some((f) => f.code === 'divided'), 'the division flag');
const control = SC.scBuild(reg, { issues: ['control'], stage: 'before' });
check(control.ok && keys(control) === 'declaration,manager,mediation,agreement' && control.routes[0].clock.indexOf('7 שנים') > 0 && control.routes[0].clock.indexOf('סעיף 5(1)') > 0, 'one heir holding the money: a declaration claim with the 7-year limitation (s.5(1))');
const gifts = SC.scBuild(reg, { issues: ['gifts', 'pressure'], stage: 'before' });
check(gifts.ok && keys(gifts) === 'declaration,mediation,agreement,manager,objection,amend' && gifts.flags.some((f) => f.code === 'pressure'), 'gifts and pressure: no duplicate routes, the pressure flag');
check(SC.scBuild(reg, { issues: ['support'], stage: 'before' }).routes[0].clock === reg.inheritance_process.days.support_he, 'maintenance from the estate carries the s.60 clock');
check(SC.scBuild(reg, { issues: ['mutual'], stage: 'issued' }).flags.some((f) => f.code === 'mutual'), 'a mutual will changed: the s.8א flag');

/* ---------- The first step ---------- */
check(flat.first.key === 'mediation' && SC.scBuild(reg, { issues: ['apartment'], stage: 'before', willing: 'yes' }).first.key === 'mediation', 'heirs who may talk: mediation first');
check(SC.scBuild(reg, { issues: ['apartment'], stage: 'before', willing: 'no' }).first.key === 'partition', 'an heir who refuses all contact: the first legal route (partition)');
check(SC.scBuild(reg, { issues: ['will'], stage: 'published', willing: 'no', publication: '2026-10-11', today: '2026-10-21' }).first.key === 'objection', 'refusal after publication: the objection first');

/* ---------- The fees ---------- */
const fee = (r, k) => { const x = r.routes.find((q) => q.key === k); return [x && x.fee ? x.fee.amount : null, x && x.feeCourt ? x.feeCourt.amount : null]; };
check(fee(will, 'objection').join() === '1151,' && fee(issued, 'amend').join() === '597,1183' && fee(flat, 'manager').join() === '597,1183', 'objection 1,151; amendment 597 at the registrar or 1,183 at the court; a manager 597 / 1,183');
check(fee(flat, 'partition').join() === '3481,' && fee(control, 'declaration').join() === '3481,' && fee(divided, 'support').join() === '574,' && fee(flat, 'agreement').join() === ',', 'partition and declaration 3,481 (item 2); maintenance 574 (item 6); an agreement costs no fee');
check(SC.scFee(reg.inheritance_process, 'family_court.written').amount === 282 && SC.scFee(reg.inheritance_process, 'nothing.here') === null, 'the fee resolver: a written request 282; an unknown key is null');

/* ---------- The Bar reference ---------- */
const bar = SC.scBuild(reg, { issues: ['will', 'apartment'], stage: 'published', publication: '2026-10-11', today: '2026-10-21', barRef: true, estate: 1000000, share: 25 });
check(bar.ok && bar.barRef.probate === 15000 && bar.barRef.objection === 18750 && bar.barRef.partition === 7500 && bar.barRef.nonmonetary === 6307 && bar.barRef.hearing === 754, `the Bar: 15,000 / 18,750 / 7,500 / 6,307 / 754 (engine ${bar.barRef.probate} ${bar.barRef.objection} ${bar.barRef.partition})`);
check(SC.scBuild(reg, { issues: ['will'], stage: 'before', barRef: true }).barRef.probate === 4281 && SC.scBuild(reg, { issues: ['will'], stage: 'before', barRef: true }).barRef.objection === 5351.25, 'no estate value: the minimum 4,281, and 5,351.25 with an objection');
check(SC.scBuild(reg, { issues: ['apartment'], stage: 'before', barRef: true, estate: 100000, share: 10 }).barRef.partition === 6307, 'a small share: the partition minimum 6,307');
check(SC.scBuild(reg, { issues: ['will'], stage: 'before', barRef: false, estate: -5 }).ok && !SC.scBuild(reg, { issues: ['will'], stage: 'before', barRef: true, estate: -5 }).ok, 'the estate value is read only with the reference on');
check(!SC.scBuild(reg, { issues: ['will'], stage: 'before', barRef: true, share: 120 }).ok, 'a share over 100% is an error');

/* ---------- Errors ---------- */
check(!SC.scBuild(reg, { issues: [], stage: 'before' }).ok && !SC.scBuild(reg, { issues: ['nope'], stage: 'before' }).ok, 'no issue chosen, or an unknown one: an input error');
check(!SC.scBuild(reg, { issues: ['will'], stage: 'before', heirs: 1 }).ok && !SC.scBuild(reg, { issues: ['will'], stage: 'before', heirs: 31 }).ok, 'heirs outside 2-30: an error');
check(!SC.scBuild(reg, { issues: ['will'], stage: 'published', publication: 'xx' }).ok && SC.scBuild(reg, { issues: ['will'], stage: 'published', publication: '' }).ok, 'a bad publication date is an error; none is allowed');

/* ---------- The snapshot and the share state ---------- */
const snap = SCUI.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence].join('');
check(snap.total === 5 && snap.sticky === '<bdi>5</bdi>' && snap.result.indexOf('jt25-cross') > 0 && (snap.result.match(/jt25-post"/g) || []).length === 4 && snap.result.indexOf('jt25-post--first') > 0, 'the example: 5 open routes, a crossroads with 5 signposts, the first lit');
check(all.indexOf('undefined') < 0 && all.indexOf('NaN') < 0 && !/<h2/.test(all), 'no undefined, no NaN, no <h2> in the rendered HTML');
check(snap.details.indexOf('<bdi>597</bdi>') > 0 && snap.details.indexOf('<bdi>1,183</bdi>') > 0 && snap.details.indexOf('<bdi>3,481</bdi>') > 0 && snap.details.indexOf('סעיפים 37 עד 40') > 0, 'the routes table: 597, 1,183, 3,481, the Land Law sections');
check(snap.method.indexOf('סעיף 110') > 0 && snap.method.indexOf('סעיף 72') > 0 && snap.compare_table.indexOf('העיזבון כבר חולק') > 0, 'the method cites s.110 and s.72; the page table runs the four stages');
check(SCUI.stateOf(SCUI.EXAMPLE) === 'i2.3/sissued/h3/a1', `the share state of the example (engine ${SCUI.stateOf(SCUI.EXAMPLE)})`);
const back = SCUI.inputOf(decodeState(`#s=${SCUI.stateOf({ issues: ['will', 'gifts'], stage: 'published', publication: '2026-10-11', heirs: 4, apartment: true, minor: true, willing: 'no', barRef: true, estate: 1000000, share: 25 })}`, SCUI.KEYS));
check(back && back.issues.join() === 'will,gifts' && back.stage === 'published' && back.publication === '2026-10-11' && back.heirs === 4 && back.apartment && back.minor && back.willing === 'no' && back.barRef && back.estate === 1000000 && back.share === 25, 'the share state round-trips every field');
check(SCUI.inputOf(decodeState('#s=', SCUI.KEYS)) === null, 'an empty hash is no state');
check(SCUI.mapText(reg, snap.result ? SC.scBuild(reg, SCUI.EXAMPLE) : null).split('\n').length === 5, 'the copied map lists every route on its own line');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
