/**
 * Golden tests for the rabbinical-court fee ledger (agrot-rabanut, the family + land wave, 21.10.2026, HAD-579).
 * Run: node tests/js/test-fl-rabanut.mjs
 *
 * Every expected amount is computed by hand from the official texts: the Dayanim (Fees) Regulations 1957 (Nevo, current
 * to 22.1.2026: divorce 457 + transcript 118, property 596 + 88, custody 417 + 88, maintenance exempt for the claimant
 * under reg. 14א, agreement 536, get request 326 / 457 abroad, certificate 326, dispute request 119, appeal 775), the
 * family court's (text from 1.7.2026: 120, 601 + 86, 421 + 86, 283 + 86, 541 + 86, item 1א 1% not under 361), the
 * administration's payment table (ketubah 326, the 210 top-up, inheritance 597), and the procedure regulations
 * (appeal 30 days, leave 10, setting aside 30 and free within 15; family appeal 60 days from service).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/rabanut-engine.js';
import * as U from '../../assets/js/tools/rabanut-ui.js';
import { clock } from '../../assets/js/tools/gerushin-engine.js';
import { decodeState, ics, ils } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const fl = reg.fl_rabanut;
const EX = U.EXAMPLE;
const run = (over) => E.rbCompute(reg, Object.assign({}, EX, over));
const line = (r, id) => r.lines.find((l) => l.id === id);
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);

/* ---------- 1. The registry: every figure the engine reads resolves and has its source ---------- */
check(fl && fl.checked_on === '2026-10-21' && fl.next_update === '2027-01-01' && fl.rab.current_to === '2026-01-22' && fl.fam.from === '2026-07-01', 'registry: fl_rabanut checked 21.10.2026; rabbinical text to 22.1.2026; family text from 1.7.2026; next update 1.1.2027');
let refsOk = true;
for (const p of fl.procedures) {
	for (const side of ['rab', 'fam']) {
		const spec = p[side];
		if (!spec || spec.amount0) { continue; }
		for (const k of ['ref', 'pct_ref', 'abroad_ref', 'topup_ref']) {
			if (!spec[k]) { continue; }
			const v = E.rbGet(reg, spec[k]);
			const amount = v && typeof v === 'object' ? (v.amount ?? v.min) : v;
			if (!(typeof amount === 'number' && amount >= 0) || !/^https:\/\//.test(E.rbUrlOf(reg, spec[k]))) { refsOk = false; console.error('bad ref', p.id, side, spec[k]); }
		}
		if (spec.item_ref && typeof E.rbGet(reg, spec.item_ref) !== 'string') { refsOk = false; console.error('bad item_ref', p.id, side, spec.item_ref); }
		if (spec.protocol && typeof E.rbGet(reg, spec.protocol.ref) !== 'number') { refsOk = false; console.error('bad protocol', p.id); }
	}
}
check(refsOk && fl.procedures.length >= 30, 'registry: every ref, item_ref and protocol of the 30+ procedures resolves to a figure with an official url');
check(reg.divorce_cost.rabbinical.divorce === 457 && reg.divorce_cost.rabbinical.transcript_divorce === 118 && reg.divorce_cost.rabbinical.appeal === 775 && fl.rab.fees.appeal_leave.amount === 596 && fl.rab.fees.appeal_extend.amount === 52 && fl.rab.fees.appeal_other.amount === 297, 'registry: the reused wave-4 fees (457, 118, 775) and the appeal items 15(ב)-(ד): 596, 297, 52');
check(fl.schedule.length >= 80 && fl.schedule.every((s) => s.item && s.he && (s.kind !== 'fee' || s.amount > 0)) && fl.schedule.some((s) => s.item === '19(א)' && s.amount === 1632) && fl.schedule.some((s) => s.item === '19(טז)' && s.amount === 119), 'registry: the whole first schedule (80+ items), e.g. 19(א) 1,632 and 19(טז) 119');
check(fl.rab.admin_table.url === 'https://data.gov.il/dataset/860' && fl.rab.admin.agreement_topup.amount === 210 && fl.rab.admin.ketubah.amount === 326 && fl.rab.admin.inheritance.amount === 597, 'registry: the administration table (data.gov.il 860): top-up 210, ketubah 326, inheritance 597');
check(fl.deadlines.appeal.days === 30 && fl.deadlines.appeal.section === 'תקנה קלח(1)' && fl.deadlines.leave.days === 10 && fl.deadlines.absent.days === 30 && fl.deadlines.absent_free.days === 15 && fl.deadlines.fam_appeal.days === 60 && fl.deadlines.fam_appeal.section === 'תקנה 137(א)', 'registry: the periods: appeal 30 (קלח(1)), leave 10 (קלג(2)), setting aside 30 (קכא) and free 15 (item 17), family appeal 60 (137(א))');
check(fl.appeal_court.appeal.amount === 775 && fl.appeal_court.appeal.item === 'פרט 16ב' && fl.appeal_court.leave.amount === 596 && fl.fam.fees.spouse_money.min === 361, 'registry: district court appeal 775 (16ב), leave 596 (12א); family item 1א minimum 361');

/* ---------- 2. The example: a contested divorce, linked claims at the rabbinical court ---------- */
const ex = E.rbCompute(reg, EX);
check(ex.ok && ex.forum === 'rabbinical' && ex.lines.map((l) => l.id).join(',') === 'req,div,prop,cust,sup,get,certs', 'example: the lines request, divorce, property, custody, maintenance, the get, the certificates');
check(line(ex, 'req').inRab === 119 && line(ex, 'req').inFam === 120, 'example: dispute request 119 (19(טז)) vs 120 (item 13, no transcript fee)');
check(line(ex, 'div').inRab === 575 && line(ex, 'div').fam === null && line(ex, 'div').inFam === 575, 'example: divorce claim 457 + 118 = 575, only at the rabbinical court (counted in both routes)');
check(line(ex, 'prop').inRab === 684 && line(ex, 'prop').inFam === 687, 'example: property 596 + 88 = 684 vs 601 + 86 = 687');
check(line(ex, 'cust').inRab === 505 && line(ex, 'cust').inFam === 507, 'example: custody 417 + 88 = 505 vs 421 + 86 = 507');
check(line(ex, 'sup').inRab === 0 && line(ex, 'sup').rab.exempt && line(ex, 'sup').rab.full === 279 && line(ex, 'sup').inFam === 369, 'example: maintenance exempt for the claimant (reg. 14א; item 3(א) 279) vs 283 + 86 = 369');
check(line(ex, 'get').inRab === 0 && line(ex, 'certs').inRab === 652 && line(ex, 'certs').rab.unit === 326, 'example: the get free (4(3)(ג)); two certificates 2 x 326 = 652 (4(4)(א))');
check(ex.totals.rab === 2535 && ex.totals.fam === 2910 && ex.totals.chosen === 2535 && ex.totals.diff === 375, 'example: 119 + 575 + 684 + 505 + 0 + 652 = 2,535 at the rabbinical court; 120 + 575 + 687 + 507 + 369 + 652 = 2,910; difference 375');
check(ex.totals.shared === 1227 && ex.byForum.rab === 2535 && ex.byForum.fam === 0, 'example: 575 + 652 = 1,227 paid at the rabbinical court on either route');
check(ex.refunds.rabBase === 1764 && ex.refunds.rabEarly === 882 && ex.refunds.rabLate === 1323, 'example refunds: claims 575 + 684 + 505 = 1,764; ended before evidence -50% = 882 (12(א)(1)); after -25% = 1,323 (12(א)(2)); the request is excluded (12(ב))');
check(ex.flags.map((f) => f.code).join(',') === 'support,linked_support,each', 'example flags: maintenance exemption (14א), the temporary provision of s.3, each claim pays (reg. 9 / 2(ב))');

/* ---------- 3. The same file at the family court ---------- */
const fam = run({ forum: 'family' });
check(fam.totals.chosen === 2910 && fam.byForum.rab === 1227 && fam.byForum.fam === 1683, 'family route: 2,910 = 1,227 at the rabbinical court (divorce, certificates) + 1,683 at the family court (120 + 687 + 507 + 369)');
check(fam.refunds.famBase === 1563 && fam.refunds.famHalf === 781.5 && fam.refunds.rabBase === 575 && fam.refunds.rabEarly === 287.5, 'family route refunds: 687 + 507 + 369 = 1,563, half on a compromise before the pre-trial = 781.50 (8(ב)); the divorce claim 575 -50% = 287.50');

/* ---------- 4. Consent: the agreement, the top-up, the get request ---------- */
const consent = run({ sel: ['agree'], reqDate: '' });
check(consent.totals.rab === 1188 && consent.totals.fam === 1605 && line(consent, 'getreq').inFam === 326 && line(consent, 'getreq').inRab === 0, 'consent: 536 + 652 = 1,188 at the rabbinical court; at the family court 541 + 86 + 326 (get request) + 652 = 1,605');
const joinAgree = run({ sel: ['joint', 'agree'], reqDate: '' });
check(line(joinAgree, 'agree').inRab === 210 && joinAgree.totals.rab === 1188 && joinAgree.totals.fam === 1605 && joinAgree.flags.some((f) => f.code === 'topup'), 'joint request + agreement: 326 + the 210 top-up (536 - 326) + 652 = 1,188, the same as the agreement alone; the family route 1,605');
const joint = run({ sel: ['joint'], reqDate: '' });
check(joint.totals.rab === 978 && joint.totals.fam === 978 && joint.totals.diff === 0, 'joint request without an agreement: 326 + 652 = 978 in both routes');
const abroad = run({ sel: ['req', 'joint'], abroad: true });
check(abroad.totals.rab === 1109 && !line(abroad, 'req') && abroad.flags.some((f) => f.code === 'abroad') && abroad.flags.some((f) => f.code === 'abroad_get') && !abroad.events.length, 'a spouse abroad: no dispute request (s.4א(1)), the get request 457 (4(3)(ב)) + 652 = 1,109, no statutory clock');
check(run({ sel: ['joint'], certificates: 1, reqDate: '' }).totals.rab === 652 && run({ sel: ['joint'], certificates: 0, reqDate: '' }).totals.rab === 326, 'certificates: one = 326 + 326 = 652; none = 326');

/* ---------- 5. The percent rules (ketubah) ---------- */
const k100 = run({ sel: ['div', 'ketubah'], value: 100000, reqDate: '' });
check(line(k100, 'ketubah').inRab === 326 && line(k100, 'ketubah').rab.pctNote.amount === 1000 && line(k100, 'ketubah').inFam === 1086, 'ketubah of 100,000: 326 charged at opening (admin table), 1% = 1,000 under 4(1)(ד); family court 1% = 1,000 + 86 = 1,086 (item 1א)');
check(k100.totals.rab === 1553 && k100.totals.fam === 2313, 'ketubah of 100,000 with the divorce: 575 + 326 + 652 = 1,553 vs 575 + 1,086 + 652 = 2,313');
const k20 = run({ sel: ['ketubah'], value: 20000, reqDate: '' });
check(line(k20, 'ketubah').inFam === 447 && line(k20, 'ketubah').rab.pctNote.amount === 358 && line(k20, 'ketubah').rab.pctNote.min === false, 'ketubah of 20,000: 1% = 200 is under the minimum: 361 + 86 = 447 at the family court; 358 under 4(1)(ד)');
const k0 = run({ sel: ['ketubah'], value: '', reqDate: '' });
check(line(k0, 'ketubah').fam.min && line(k0, 'ketubah').inFam === 447 && E.rbPct(fl.fam.fees.spouse_money, 36100).amount === 361 && E.rbPct(fl.fam.fees.spouse_money, 36200).amount === 362, 'no amount: the minimum, marked "at least"; the edge: 1% of 36,100 = 361 (exactly the floor), of 36,200 = 362');

/* ---------- 6. Other procedures, both forums ---------- */
check(line(run({ sel: ['supch'], reqDate: '' }), 'supch').inRab === 367 && line(run({ sel: ['supch'], reqDate: '' }), 'supch').inFam === 369, 'reducing or cancelling maintenance: 279 + 88 = 367 vs 283 + 86 = 369 (item 3(א) / item 5)');
check(line(run({ sel: ['orders'], reqDate: '' }), 'orders').inRab === 326 && line(run({ sel: ['orders'], reqDate: '' }), 'orders').inFam === 282, 'stay of exit, attachment or injunction: 326 (18(א)) vs a written request 282 (item 7)');
check(run({ sel: ['protect'], reqDate: '' }).totals.rab === 0 && run({ sel: ['protect'], reqDate: '' }).totals.fam === 0, 'a protection order: 0 at both (admin table; family reg. 7(1))');
check(run({ sel: ['prenup'], reqDate: '' }).totals.rab === 326 && run({ sel: ['prenup'], reqDate: '' }).totals.fam === 627, 'prenup approval: 326 (1(ו)) vs 541 + 86 = 627 (6א)');
check(run({ sel: ['appeal'], reqDate: '' }).totals.rab === 775 && run({ sel: ['appeal'], reqDate: '' }).totals.fam === 775 && run({ sel: ['leave'], reqDate: '' }).totals.fam === 596 && run({ sel: ['appeal_other'], reqDate: '' }).totals.fam === 1067, 'appeals: 775 both (15(א) / 16ב); leave 596 (15(ב) / 12א); other 297 vs 1,067 (17)');
const inh = run({ sel: ['inh', 'inh_obj'], reqDate: '' });
check(inh.totals.rab === 1194 && inh.totals.fam === 1748 && !line(inh, 'certs') && inh.flags.some((f) => f.code === 'succession'), 'inheritance in the rabbinical court (s.155): 597 + 597 = 1,194; registrar 597 + family court objection 1,151 = 1,748; no get, no certificates');
check(run({ sel: ['permit', 'permit_90', 'single'], reqDate: '' }).totals.rab === 978 && run({ sel: ['permit'], reqDate: '' }).totals.fam === 326, 'marriage: permit 326 + 90-day permit 326 + singlehood 326 = 978; only at the rabbinical court');
const unk = run({ sel: ['change', 'extend', 'appeal'], reqDate: '' });
check(unk.totals.rab === 1153 && unk.totals.fam === 775 && unk.flags.filter((f) => f.code === 'fam_unknown').length === 2 && unk.totals.shared === 0 && U.ledger(reg, unk).includes('בלי: בקשה להארכת המועד לערעור, שינוי הסכם גירושין שאושר'), 'no family item (a change of an agreement, an extension): 326 + 52 + 775 = 1,153 at the rabbinical court; the family total 775 says what it leaves out, never a guessed fee');
const aid = run({ legalAid: true });
check(aid.totals.rab === 0 && aid.totals.fam === 0 && aid.flags[0].code === 'legal_aid', 'legal aid: no fee at either forum (reg. 22א; family 6(6)-(7))');

/* ---------- 7. The dated outputs ---------- */
const c = clock(reg.divorce_cost, '2026-11-01', false);
check(ex.events.map((e) => e.date).join(',') === '2026-11-01,2026-12-16,2026-12-31,2027-01-15' && ex.clock.stayEnds === c.stayEnds && c.stayEnds === '2026-12-31', 'the request clock is the wave-4 engine\'s: 1.11.2026 + 45 = 16.12, + 60 = 31.12, + 15 = 15.1.2027');
const jud = run({ sel: ['appeal', 'absent'], judgmentDate: '2026-11-10', reqDate: '' });
const d = (r, re) => (r.events.find((e) => re.test(e.what)) || {}).date;
check(d(jud, /הגדול/) === '2026-12-10' && d(jud, /רשות ערעור/) === '2026-11-20' && d(jud, /בלי אגרה/) === '2026-11-25' && d(jud, /היום ה-30 מהמסירה/) === '2026-12-10', 'judgment 10.11.2026: appeal by 10.12 (+30, קלח(1)); leave by 20.11 (+10, קלג(2)); setting aside free by 25.11 (+15, item 17) and by 10.12 (+30, קכא)');
const fj = run({ sel: ['appeal'], forum: 'family', judgmentDate: '2026-11-10', reqDate: '' });
check(d(fj, /המחוזי/) === '2027-01-10' && /עבר ליום שאחריו/.test(fj.events.find((e) => /המחוזי/.test(e.what)).what), 'family appeal: 10.11.2026 + 60 = 9.1.2027, a Saturday, moves to 10.1.2027 (Interpretation Law s.10(ג))');
const sat = run({ sel: ['appeal'], judgmentDate: '2026-11-05', reqDate: '' });
check(sat.events.find((e) => /הגדול/.test(e.what)).date === '2026-12-05' && sat.events.find((e) => /הגדול/.test(e.what)).rest && sat.flags.some((f) => f.code === 'rest'), 'a rabbinical appeal day on a Saturday (5.11 + 30 = 5.12.2026) is shown as it falls and flagged');
check(d(run({ sel: ['permit_90'], getDate: '2026-12-01', reqDate: '' }), /90 הימים/) === '2027-03-01', 'the get on 1.12.2026: the 90 days of item 1(ג) end on 1.3.2027');
const cal = ics(ex.events.map((e) => ({ date: e.date, summary: e.what })), '2026-10-21T20:00:00Z');
check((cal.match(/BEGIN:VEVENT/g) || []).length === 4 && cal.includes('DTSTART;VALUE=DATE:20261231') && cal.includes('DTSTART;VALUE=DATE:20270115'), '.ics: four events, the end of the stay 20261231 and the priority window 20270115');

/* ---------- 8. Input errors ---------- */
check(!run({ sel: [] }).ok && run({ sel: [] }).errors[0].field === 'sel', 'error: no procedure chosen');
check(!run({ certificates: 3 }).ok && run({ certificates: 3 }).errors[0].field === 'certificates', 'error: three certificates');
check(!run({ value: -5 }).ok && run({ value: -5 }).errors[0].field === 'value', 'error: a negative amount');
check(!run({ reqDate: '31.2.2026' }).ok && run({ reqDate: '31.2.2026' }).errors[0].field === 'reqDate' && !run({ judgmentDate: 'אתמול' }).ok, 'error: 31.2.2026 is not a day; free text is not a date');
check(run({ sel: ['req', 'nonsense'] }).lines.length === 1, 'an unknown procedure id is ignored');

/* ---------- 9. The UI: snapshot, ledger, brief, print, next steps, share state ---------- */
const snap = U.snapshot(reg);
const all = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.sentence].join('');
check(snap.tool === 'agrot-rabanut' && snap.total === 2535 && snap.result.includes('2,535') && snap.result.includes('2,910') && snap.result.includes('דוגמה מחושבת'), 'snapshot: the example 2,535 vs 2,910, marked as an example');
check(snap.result.includes('פרט 19(טז)') && snap.result.includes('פרט 4(1)(ב)') && snap.result.includes('class="jtool-cite"') && snap.method.includes('סעיף 1 לחוק השיפוט'), 'snapshot: the cites of the items and the jurisdiction law');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
const led = U.ledger(reg, ex);
check(led.includes('<caption>') && led.includes(`aria-describedby="jt40-ledger-sum"`) && (led.match(/<th scope="row">/g) || []).length === ex.lines.length + 3 && /2,535.*2,910.*1,227/.test(led.replace(/<[^>]+>/g, '')), 'the ledger: a caption, the screen-reader summary with 2,535 / 2,910 / 1,227, a row header per line and three total rows');
check(led.includes('jt40-cell--on') && led.includes('jt40-na') && led.includes('scope="col"'), 'the ledger: the chosen route drawn, the cells a forum does not hear struck');
const brief = U.aiBrief(reg, ex);
const words = brief.split(/\s+/).filter(Boolean).length;
check(brief.includes('2,535') && brief.includes('2,910') && brief.includes('השאלה לתרגול') && words >= 40 && words <= 90 && !/\d{9}/.test(brief) && !bad(brief), `aiBrief: the two totals, the question, ${words} words (40-90), no ID-like number`);
const briefs = [consent, joint, run({ sel: ['appeal'], reqDate: '' }), inh, run({ sel: ['permit'], reqDate: '' }), fam].map((r) => U.aiBrief(reg, r));
check(briefs.every((b) => { const n = b.split(/\s+/).length; return n >= 40 && n <= 90 && !bad(b) && b.includes('השאלה לתרגול'); }), 'aiBrief: every preset gives a brief with a question, 40-90 words');
check(U.verdictSentence(reg, run({ sel: ['permit'], reqDate: '' })).includes('רק בבית הדין הרבני') && U.verdictSentence(reg, inh).includes('אצל הרשם ובבית המשפט'), 'the sentence: a rabbinical-only procedure is not compared; inheritance compares with the registrar and the family court');
check(snap.result.includes('<h4>התרחיש לסימולציה</h4>') && snap.result.includes('data-act="rehearse"') && snap.result.includes('purpose=court_rehearsal&topic=divorce'), 'the brief is shown under "התרחיש לסימולציה" with the rehearse link (court_rehearsal, divorce)');
const na = U.nextActions(reg, ex);
check(snap.result.includes('<h4>מה עושים עכשיו</h4>') && na.official.some((x) => x.url === fl.rab.payment.url) && na.official.some((x) => x.url === fl.forms.dispute.url) && na.links.length === 4 && na.links[0].path === '/opening-divorce-file-rabbinical/' && na.links.some((x) => x.path === '/child-support/'), 'next steps: the payment service and the request form, and 4 site links (divorce cost, the request, child support, the courts)');
const pr = U.printSummary(reg, ex, '2026-10-21');
check(pr.includes('הודפס ב-21.10.2026') && pr.includes('דרך החישוב') && pr.includes('תקנות הדיינים (אגרות)') && pr.includes('2,535') && pr.includes('<ol>') && snap.details.includes('class="jt40-print"'), 'print summary: inputs, the result, the computation path, the sources with dates and the day printed');
const st = U.stateOf(Object.assign({}, EX, { value: 100000, judgmentDate: '2026-11-10' }));
const back = U.inputOf(decodeState(`#s=${st}/@agrot-rabanut`, U.KEYS));
check(back.sel.join(',') === 'req,div,prop,cust,sup' && back.forum === 'rabbinical' && back.value === 100000 && back.reqDate === '2026-11-01' && back.judgmentDate === '2026-11-10' && back.certificates === 2 && !st.includes('@'), 'share state: stateOf -> decodeState -> inputOf keeps the procedures, the forum, the amount and the dates');
const fst = U.inputOf(decodeState(U.stateOf({ sel: ['agree'], forum: 'family', abroad: true, certificates: 1, legalAid: true }), U.KEYS));
check(fst.forum === 'family' && fst.abroad && fst.certificates === 1 && fst.legalAid && fst.value === '', 'share state: family forum, abroad, one certificate, legal aid');
const scenarios = [ex, fam, consent, joinAgree, joint, abroad, k100, k0, inh, aid, jud, fj, sat];
check(scenarios.every((r) => { const h = U.renderResult(reg, r) + U.renderDetails(reg, r, { today: '2026-10-21' }) + U.verdictSentence(reg, r); return !/<h2/i.test(h) && !bad(h); }), 'every scenario renders without <h2>, undefined, NaN or null');
check(!/<h2/i.test(U.renderForm(reg, EX)) && U.renderForm(reg, EX).includes('data-preset="consent"') && U.renderForm(reg, EX).includes('aria-pressed="true"'), 'the form: one-click presets, the example preset pressed');
check(U.compareTable(reg).includes('<caption>') && U.compareTable(reg).includes('1,632') && U.compareTable(reg).includes('19(טז)') && U.compareTable(reg).includes('ההוצאות בפועל'), 'the page table: captions, the whole schedule (19(א) 1,632 ... 19(טז)), the expense items');
/* ---------- 10. The polish round: the window handoff, the sticky string, the result-first card ---------- */
check(snap.result.includes('>לתרגל את הדיון עם הנתונים שלכם</a>') && !snap.result.includes('להעתיק ולתרגל'), 'the rehearse button opens the simulation with the data ("לתרגל את הדיון עם הנתונים שלכם"), it no longer says "copy"');
const hs = handoffState('x', U.aiBrief(reg, ex), 'court_rehearsal');
check(hs.phase === 'intake' && hs.locale === 'he' && hs.simulationPurpose === 'court_rehearsal' && hs.description.includes('2,535') && hs.description.includes('2,910') && !/\d{9}/.test(hs.description), 'the handoff state: intake, Hebrew, court_rehearsal, the description carries 2,535 and 2,910 and no 9-digit run');
check(snap.sticky === ils(2535, 0) && snap.sticky.includes('2,535') && !snap.sticky.includes('.00'), 'the snapshot sticky is the string the mount writes (2,535 ₪), never a raw number');
const lead = snap.lead;
check(lead.includes('דוגמה מחושבת: גירושין במחלוקת, עם ילדים ורכוש, כשמגישים לבית הדין הרבני') && lead.includes('class="jtool-lead__figure"><span class="jtool-amt"><bdi>2,535</bdi> ₪</span>') && lead.includes('2,910') && lead.includes('פטור מאגרה (תקנה 14א)') && lead.includes('data-lead-go') && lead.includes('href="#jtool-agrot-rabanut"') && lead.includes('לחשב לפי המקרה שלכם'), 'the lead card: the example 2,535 at the rabbinical court, the family court 2,910, the maintenance exemption, the jump to the form');
const own = U.leadCard(reg, consent, { example: false });
check(own.includes('החישוב שלכם: גירושין בהסכמה, עם הסכם') && own.includes('1,188') && own.includes('1,605') && own.includes('לשנות את הנתונים') && !own.includes('14א'), 'the lead card for the reader own file: consent 1,188 vs 1,605, no maintenance line, "לשנות את הנתונים"');
const leadPermit = U.leadCard(reg, run({ sel: ['permit'], reqDate: '' }), { example: false });
const leadErr = U.leadCard(reg, run({ sel: [] }), { example: false });
check(leadPermit.includes('רק בבית הדין הרבני') && leadErr.includes('jtool-lead__figure">—</strong>') && leadErr.includes('בחרו לפחות הליך אחד') && [lead, own, leadPermit, leadErr].every((h) => !/<h2/i.test(h) && !bad(h)), 'the lead card: a rabbinical-only file is not compared; the error case shows "—" and the error; no h2, undefined, NaN or null');
const err = U.renderResult(reg, run({ sel: [] }));
check(err.includes('צריך לתקן') && err.includes('בחרו לפחות הליך אחד'), 'an input error renders its message');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
