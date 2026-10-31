/**
 * Golden tests for the divorce calculator and price list (machshevon-gerushin, HAD-616, 31.10.2026).
 * Run: node tests/js/test-divorce-calc.mjs
 *
 * Every expected value is computed by hand from the registry as read on 31.10.2026: the rabbinical court fees (Dayanim (Fees)
 * Regulations 1957: dispute request 119, divorce 457, transcript 118/88, property 596, custody 417, support exempt for who
 * files, agreement 536, get request 326, certificate 326), the family court fees (Family Court (Fees) Regulations 1995, from
 * 1.7.2026: request 120, property 601, custody 421, support 283, agreement 541, transcript 86), VAT 18%, legal aid's
 * participation fee 78/157 (reg.1A), and the market rows of reg.fl_mechiron: low = the lowest published low, high = the highest
 * published high, expected = the median of the sources' mid-points rounded to 100, every source before VAT.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/machshevon-engine.js';
import * as U from '../../assets/js/tools/machshevon-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const m = reg.fl_mechiron;
const run = (key, over) => E.mgCompute(reg, Object.assign(U.mgPreset(key), over || {}));
const line = (r, code) => r.lines.find((l) => l.code === code);
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const err = (over, field) => { const r = E.mgCompute(reg, Object.assign(U.mgPreset('kids'), over)); return !r.ok && r.errors.some((e) => e.field === field); };

/* ---------- 1. The registry ---------- */
check(m && m.checked_on === '2026-10-31' && m.next_update === '2027-01-01' && reg.registry_version >= '2026-10-31', 'registry: fl_mechiron checked 31.10.2026, next update 1.1.2027');
check(m.reviewed_he === 'נבדק על ידי הצוות המשפטי של Justice', 'registry: the review line names the Justice legal team (no single author)');
// Every stored official amount still equals the value at its registry path (the dataset never drifts from the fee tables).
const drift = m.official.filter((o) => o.ref).filter((o) => { const v = E.mgGet(reg, o.ref); return (v && typeof v === 'object' ? v.amount : v) !== o.amount; });
check(drift.length === 0, `registry: every official amount equals its path (${drift.map((o) => o.id).join(', ') || 'none drifted'})`);
check(m.official.filter((o) => !o.unchecked).every((o) => typeof o.amount === 'number' && o.amount >= 0 && o.url && /^https:\/\/(www\.nevo\.co\.il|nevo\.co\.il|www\.gov\.il|data\.gov\.il|he\.wikisource\.org)\//.test(o.url)), 'registry: every checked official row has an amount and an official url');
check(m.official.filter((o) => o.unchecked).map((o) => o.id).join() === 'exec_support,exec_judgment' && m.official.filter((o) => o.unchecked).every((o) => o.amount === undefined && o.note_he), 'registry: only the execution office rows are "לא נבדק", without an amount and with what we know');
const amt = (id) => m.official.find((o) => o.id === id).amount;
check(amt('rb_request') === 119 && amt('rb_divorce') === 457 && amt('rb_transcript_divorce') === 118 && amt('rb_property') === 596 && amt('rb_custody') === 417 && amt('rb_agreement') === 536 && amt('rb_get_request') === 326 && amt('rb_certificate') === 326 && amt('rb_support') === 0, 'registry: rabbinical fees 119/457/118/596/417/536/326/326, support exempt for who files');
check(amt('fam_request') === 120 && amt('fam_property') === 601 && amt('fam_custody') === 421 && amt('fam_support') === 283 && amt('fam_agreement') === 541 && amt('fam_transcript') === 86, 'registry: family court fees 120/601/421/283/541/86 (from 1.7.2026)');
check(amt('district_appeal') === 775 && amt('rb_appeal') === 775 && amt('notary_prenup') === 446 && amt('notary_signature') === 197 && amt('notary_signature_extra') === 77 && amt('aid_low') === 78 && amt('aid_high') === 157, 'registry: appeal 775 (16ב) and 775 (15(א)); notary 446, 197, 77 (Nevo, 1.1.2026); legal aid 78/157');
const sources = m.market.flatMap((r) => r.sources);
check(sources.length >= 80 && sources.every((s) => s.status === 'verified' && /^https:\/\//.test(s.url) && s.quote_he && s.read_on === '2026-10-31' && ['plus', 'incl', 'none'].includes(s.vat) && (s.low > 0 || s.high > 0)), `registry: ${sources.length} market sources, each verified with a url, a quote, the read day and the VAT state`);
check(sources.filter((s) => s.link).every((s) => /rotenberglaw\.co\.il|gov\.il|nevo\.co\.il|idi\.org\.il/.test(s.url)) && sources.some((s) => s.link && /rotenberglaw/.test(s.url)), 'registry: only official pages and Adv. Maya Rotenberg\'s office are linked; other offices are named');
check(!/kolzchut|כל זכות|כל-זכות/.test(JSON.stringify(m)), 'registry: the private rights portal is never named');

/* ---------- 2. The market rows: low, expected (median of mid-points), high ---------- */
const mk = (id) => E.mgMarket(reg, id);
const ag = mk('lawyer_agreement');
check(ag.n === 11 && ag.low === 4000 && ag.mid === 11000 && ag.high === 20000, 'market: an agreement by consent 4,000 / 11,000 / 20,000 over 11 sources');
const co = mk('lawyer_contested');
check(co.n === 10 && co.low === 10000 && co.mid === 83800 && co.high === 250000, 'market: a full contested proceeding 10,000 / 83,800 / 250,000 (median 83,750 -> 83,800)');
check(mk('mediation_process').low === 3000 && mk('mediation_process').mid === 8000 && mk('mediation_process').high === 25000, 'market: a whole mediation 3,000 / 8,000 / 25,000');
check(mk('appraiser').low === 2376 && mk('appraiser').mid === 4300 && mk('appraiser').high === 6000, 'market: an appraiser 2,376 / 4,300 / 6,000 (median 4,250 -> 4,300)');
check(mk('actuary').low === 3000 && mk('actuary').mid === 6500 && mk('actuary').high === 25000, 'market: an actuary 3,000 / 6,500 / 25,000');
check(mk('court_expert').low === 8000 && mk('court_expert').mid === 19500 && mk('court_expert').high === 40000, 'market: a parenting evaluation 8,000 / 19,500 / 40,000 (a source with only "up to 30,000" adds a high, no low)');
const ch = mk('coordinator_hour');
check(ch.low === 300 && ch.high === 1500 && ch.mid === 900, 'market: a coordinator hour 300 / 900 / 1,500 (600-750 an hour from each side doubled to the couple)');
check(mk('lawyer_consult').low === 300 && mk('lawyer_consult').high === 1600 && mk('pleader').low === 6000 && mk('pleader').high === 40000 && mk('collaborative').low === 8000 && mk('collaborative').high === 30000, 'market: consultation 300-1,600; rabbinical pleader 6,000-40,000; collaborative divorce 8,000-30,000 a side');

/* ---------- 3. The example: consent at the rabbinical court, with children and a home ---------- */
const ex = E.mgCompute(reg, U.EXAMPLE);
check(ex.ok && ex.route === 'agree' && ex.forum === 'rabbinical', 'example: consent at the rabbinical court');
check(line(ex, 'agreement').mid === 536 && line(ex, 'certificates').mid === 326 && line(ex, 'certificates').payer === 'each' && !line(ex, 'request'), 'example: the agreement 536 (item 4(2)), a certificate 326 for each side, no dispute-settlement request');
check(ex.totals.low.gross === 10628 && ex.totals.mid.gross === 27148 && ex.totals.high.gross === 48388, 'example: 4,000×2×1.18 + 536 + 652 = 10,628; 11,000×2×1.18 + 1,188 = 27,148; 20,000×2×1.18 + 1,188 = 48,388');
check(ex.totals.mid.vat === 3960 && ex.sides.a.mid === 13574 && ex.sides.b.mid === 13574, 'example: VAT 3,960 on the lawyers; each side 12,980 + 268 + 326 = 13,574');
check(ex.dur.low === 0.5 && ex.dur.high === 6 && ex.flags.some((f) => f.code === 'complexity'), 'example: 0.5 to 6 months by the published sources; consent prices one agreement for all subjects');

/* ---------- 4. The family court, the full dispute, the compromise ---------- */
const fam = run('kids', { forum: 'family' });
check(line(fam, 'agreement').mid === 541 && line(fam, 'agreement_tr').mid === 86 && line(fam, 'get_request').mid === 326, 'family: the agreement 541 + transcript 86, then a get request 326 at the rabbinical court');
const war = run('war');
check(war.ok && line(war, 'request').mid === 120 && line(war, 'divorce').mid === 457 && line(war, 'claim_property').mid === 601 && line(war, 'claim_custody').mid === 421 && line(war, 'claim_support').mid === 283, 'dispute (family): request 120, the divorce claim 457 at the rabbinical court, property 601, custody 421, support 283');
check(line(war, 'actuary').payer === 'each' && line(war, 'appraiser').payer === 'each' && line(war, 'courtExpert').payer === 'split', 'dispute: each side its own actuary and appraiser; the court\'s expert shared');
check(war.totals.mid.gross === 249176 && war.sides.a.mid === 125717 && war.sides.b.mid === 123459, 'dispute: (167,600 + 13,000 + 8,600 + 19,500) × 1.18 + 2,258 + 652 = 249,176; side A 125,717, side B 123,459');
check(war.dur.low === 8.5 && war.dur.high === 36 && war.clock.stay === 60 && war.clock.meetings === 45, 'dispute: 8.5 to 36 months published; the law\'s 45 / 60 days');
const joint = run('war', { joint: true });
check(line(joint, 'actuary').payer === 'split' && war.totals.mid.gross - joint.totals.mid.gross === 12744, 'dispute: one agreed expert saves (6,500 + 4,300) × 1.18 = 12,744');
const half = run('half');
check(line(half, 'rep_a').mid === Math.min(3 * mk('lawyer_claim').mid, co.mid) && line(half, 'rep_a').high === co.high, 'compromise: a claim per open subject, never more than the full proceeding');
check(half.flags.some((f) => f.code === 'refund'), 'compromise: the refund of the fee on an early settlement is named');
const halfOne = run('half', { rep: 'one' });
check(line(halfOne, 'rep_one').high === co.high && line(halfOne, 'rep_one').mid === line(half, 'rep_a').mid, 'compromise with one lawyer: the same cap (review, PR 173)');
const med = run('mediate');
check(line(med, 'mediator').payer === 'split' && line(med, 'rep_a').mid === mk('lawyer_consult').mid && med.dur.low === null, 'mediation: the mediator shared; each side checks the agreement in one consultation; no published duration (לא נבדק)');

/* ---------- 5. Representation, quote, legal aid, pleader, split ---------- */
const aid = run('kids', { rep: 'aid' });
check(line(aid, 'rep_a').low === 78 && line(aid, 'rep_a').mid === 157 && line(aid, 'rep_a').vat === false && line(aid, 'rep_b').mid === 11000, 'legal aid: side A pays the participation fee 78-157 (no VAT); side B its lawyer');
const quote = run('kids', { quote: 18000, quoteVat: 'incl' });
check(Math.round(line(quote, 'rep_a').mid * 1.18) === 18000 && line(quote, 'rep_a').kind === 'own' && line(quote, 'rep_b').mid === 11000, 'quote: 18,000 with VAT replaces side A\'s range only');
const one = run('kids', { rep: 'one' });
check(line(one, 'rep_one').payer === 'split' && line(one, 'rep_check_b').mid === mk('lawyer_consult').mid && one.flags.some((f) => f.code === 'one_lawyer'), 'one lawyer: one shared drafting fee and a consultation for side B');
const pl = run('kids', { pleader: true });
check(line(pl, 'rep_a').id === 'pleader_agreement' && line(pl, 'rep_a').mid === mk('pleader_agreement').mid, 'pleader: an agreement priced by the pleaders\' published range');
const plf = run('kids', { pleader: true, forum: 'family' });
check(line(plf, 'rep_a').id === 'lawyer_agreement' && plf.flags.some((f) => f.code === 'pleader_family'), 'pleader at the family court: a lawyer, and the reason');
const self = run('kids', { rep: 'self' });
check(!line(self, 'rep_a') && self.totals.mid.gross === 536 + 652, 'no lawyer: fees only (536 + 652)');
const pct = run('war', { split: 'pct', pct: 70 });
check(pct.sides.a.mid > war.sides.a.mid && pct.sides.b.mid < war.sides.b.mid && pct.totals.mid.gross === war.totals.mid.gross, 'split 70%: the shared costs move to side A, the total stays');
const coord = run('war', { coordinator: true, hours: 10 });
check(line(coord, 'coordinator').mid === 9000 && line(coord, 'coordinator').payer === 'split', 'coordinator: 10 hours × 900');
check(line(run('war', { coordinator: true }), 'coordinator').mid === 900, 'coordinator without hours: one hour, labelled');
const exe = run('war', { execution: true });
check(!line(exe, 'execution_fee') && line(exe, 'execution_lawyer') && exe.missing.includes('exec_support'), 'execution: the unchecked fee never enters the total; the lawyer line does');

/* ---------- 6. Errors, scope, savings ---------- */
check(err({ split: 'pct', pct: 150 }, 'pct') && err({ coordinator: true, hours: 0 }, 'hours') && err({ quote: -5 }, 'quote') && err({ rep: 'aid', pleader: true }, 'rep'), 'errors: percent, hours, quote, aid with a pleader');
check(E.mgCompute(reg, { notJewish: true }).outOfScope, 'scope: a couple outside the rabbinical route is out of scope, with the reason');
const sv = E.mgSavings(reg, U.mgPreset('war'));
check(sv.length >= 3 && sv[0].save >= sv[1].save && sv.every((x) => x.save > 0) && sv.some((x) => x.code === 'joint' && x.save === 12744), 'savings: computed, largest first, only changes that save (one agreed expert 12,744)');
const sc = E.mgScenarios(reg, U.mgPreset('war'));
check(sc.agree.mid < sc.mediate.mid || sc.agree.mid > 0, 'scenarios: four routes computed');
check(sc.contested.mid === war.totals.mid.gross && sc.compromise.mid < sc.contested.mid, 'scenarios: the dispute equals the computed bill; the compromise is cheaper');

/* ---------- 7. Share state, renderers, snapshot ---------- */
const input = Object.assign(U.mgPreset('war'), { quote: 18000, quoteVat: 'incl', split: 'pct', pct: 60, hours: 10, coordinator: true });
const back = U.inputOf(decodeState(U.stateOf(input), U.KEYS));
check(Object.keys(input).every((k) => String(back[k]) === String(input[k])), `share state round trip: ${U.stateOf(input)}`);
check(!/[^\x20-\x7e]/.test(U.stateOf(input)), 'share state: selections and numbers only, no names');
const snap = U.snapshot(reg);
check(snap.total === 27148 && !bad(snap.form) && !bad(snap.result) && !bad(snap.details) && !bad(snap.compare_table), 'snapshot: the example and every renderer without undefined/NaN/null');
check((snap.compare_table.match(/<details class="jt72-group"/g) || []).length === m.price_groups.length + 1 && (snap.compare_table.match(/<details class="jt72-group" open>/g) || []).length === 4 && (snap.compare_table.match(/לא נבדק/g) || []).length >= 2, 'price list: every group a collapsible table (court fees, lawyers and time open), the unchecked rows say so');
const hrefs = [...snap.compare_table.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
check(hrefs.length > 0 && hrefs.every((h) => /^https:\/\/(www\.nevo\.co\.il|www\.gov\.il|data\.gov\.il|rotenberglaw\.co\.il|www\.idi\.org\.il|fs\.knesset\.gov\.il)\//.test(h)), `price list: ${hrefs.length} links, all official or Adv. Maya Rotenberg's office`);
check(snap.result.includes('שבועיים עד 6 חודשים') && !snap.result.includes('0.5 עד'), 'time: half a month reads "שבועיים", as the source says');
check(snap.answer.agree_n === 11 && snap.answer.agree_low === 4000 && snap.answer.contested_high === 250000 && snap.answer.rb_agreement === 536, 'snapshot: the answer box figures come from the engine');
check(/מחשבון גירושין/.test(U.printSummary(reg, ex, '2026-10-31')) && /נבדק על ידי הצוות המשפטי של Justice/.test(snap.result), 'print summary and the review line');
for (const k of Object.keys(U.PRESETS)) {
	const r = E.mgCompute(reg, U.mgPreset(k));
	check(r.ok && !bad(U.renderResult(reg, r, { input: U.mgPreset(k) })), `preset ${k}: computes and renders`);
}

console.log(`divorce calculator: ${passed} passed, ${failures} failed`);
if (failures) { process.exit(1); }
