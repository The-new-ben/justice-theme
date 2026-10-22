/**
 * Golden tests for the claim against a business inside the small-claims instrument (tviot-ktanot, the ktanot lane of the
 * consumer-law wave, 22.10.2026, HAD-593). The wave-1 checks stay in tests/js/test-justice-tools.mjs, unchanged.
 * Run: node tests/js/test-consumer-ktanot.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Courts Law s.60(a)(1) (39,900 ₪,
 * Nevo to 1.9.2026; the Courts Director's notice of 22.12.2025), s.61(1), s.64; the Small Claims Regulations 1976 (Nevo to
 * 14.4.2025) reg. 3 (the outline, 5 pages), 4(b) (30 days), 6(a) (1%, rounded up to 5, at least 50), 7(b1) (60/40 days),
 * 15(a) (the judgment within 7 days), 16(a) (leave to appeal in 30 days), 16A (the count); the Courts Authority's pages
 * (filing, updated 8.10.2026: 5 plaintiffs online, the witness 60 days, the interpreter 7 days; collecting a judgment,
 * updated 7.1.2024: the form 30 days after the debtor received it); the Consumer Protection Law s.31A (10,000; 50,000 under
 * (c)(1); the written request of (b); the paragraphs of (a)); the Aviation Services Law s.19 (4 years) and s.3(a)(2) (21
 * days); the Civil Procedure Regulations 2018 reg. 25(b) (one cause, one claim), as quoted in ע"א 14903-01-24.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/tviot-engine.js';
import * as U from '../../assets/js/tools/tviot-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const ON = '2026-10-22';
const k = reg.consumer_ktanot;
const sc = reg.small_claims;
const run = (over) => E.compute(reg, Object.assign({}, U.EXAMPLE_CLAIM, { on: ON }, over));
const tl = (r, code) => (r.timeline.find((e) => e.code === code) || {});
const hasFlag = (r, code) => r.flags.some((f) => f.code === code);
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const words = (s) => s.split(/\s+/).filter(Boolean).length;

/* ---------- 1. The registry ---------- */
check(k && k.checked_on === '2026-10-22' && k.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: consumer_ktanot checked 22.10.2026, next update 1.1.2027 (the ceiling is re-indexed on 1 January)');
const urls = JSON.stringify(k).match(/https?:\/\/[^"]+/g) || [];
check(urls.length > 20 && urls.every((u) => u.startsWith('https://www.nevo.co.il/') || u.startsWith('https://www.gov.il/')), `registry: every source is Nevo or gov.il (${urls.length} urls)`);
check(k.exemplary.max === 10000 && k.exemplary.aggravated_max === 50000 && k.exemplary.paragraphs.length === 15 && k.exemplary.demand_section === 'סעיף 31א(ב)', 's.31A: 10,000, 50,000 under (c)(1), 15 paragraphs of (a), the written request of (b)');
check(k.regs.judgment_max_days === 7 && k.regs.appeal_days === 30 && k.execution.after_days === 30 && k.aviation.limitation_years === 4 && k.aviation.refund_days === 21, 'periods: reg. 15(a) 7 days, reg. 16(a) 30 days, the Execution form 30 days, Aviation s.19 4 years, s.3(a)(2) 21 days');
check(E.KT_KINDS.every((x) => k.kinds[x] && k.kinds[x].grounds.length && k.kinds[x].grounds.every((g) => g.section && g.url)), 'every kind of case has legal grounds, each with a section and a url');
check(E.KT_HEADS.every((h) => k.heads[h] && k.heads[h].he) && k.splitting.section === 'תקנה 25(ב)' && k.splitting.url.includes('14903-01-24'), 'every head has its Hebrew name; the splitting rule is reg. 25(b), quoted from ע"א 14903-01-24');
check(k.changes.length >= 5 && k.changes.every((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.from) && c.url && c.src_he) && k.changes.some((c) => c.from === '2026-01-01' && c.he.includes('39,900')), 'what changed: dated official rows, the 1.1.2026 ceiling among them');

/* ---------- 2. The example: three heads against a business ---------- */
const ex = run({});
check(ex.ok && ex.claim && ex.claim.total === 12748 && ex.amount === 12748, 'example: 7,990 + 258 + 4,500 = 12,748 ₪');
check(ex.fee === 130 && ex.onePct === 127.48 && ex.rounded === 130 && !ex.floor, 'example fee: 1% of 12,748 = 127.48, rounded up to a multiple of 5 = 130 (reg. 6(a)(1),(3))');
check(ex.verdict === 'yes' && ex.claim.over === false && ex.claim.overBy === 0 && ex.claim.waived === 0, 'example: under the 39,900 ceiling, the verdict is yes');
const wave1 = E.compute(reg, Object.assign({}, U.EXAMPLE, { on: ON }));
check(wave1.claim === null && wave1.fee === ex.fee && JSON.stringify(wave1.dates) === JSON.stringify(ex.dates) && U.EXAMPLE_CLAIM.amount === U.EXAMPLE.amount, 'the wave-1 EXAMPLE (no heads) computes as before: no claim, the same fee and dates as the heads example');
check(['ok', 'mode', 'verdict', 'forum', 'amount', 'plaintiff', 'remedy', 'claims', 'ceiling', 'ceilingFrom', 'ceilingUnknown', 'overCeiling', 'overBy', 'fee', 'onePct', 'rounded', 'floor', 'conds', 'dates', 'flags', 'on'].every((key) => key in ex), 'additive: every wave-1 result field is still there');
const feeMode = E.compute(reg, { mode: 'fee', amount: 39900, heads: { price: 100 }, on: ON });
check(feeMode.fee === 400 && !('claim' in feeMode) && !('timeline' in feeMode), 'fee mode ignores heads and gets no new fields (39,900 -> 400)');

/* ---------- 3. The timeline ---------- */
check(tl(ex, 'event').date === '2026-03-01' && tl(ex, 'demand').date === '2026-03-15', 'timeline: the event 1.3.2026 and the written demand 15.3.2026');
check(tl(ex, 'service_check').date === '2026-12-17' && tl(ex, 'plaintiff_service').date === '2027-01-06' && tl(ex, 'interpreter').date === '2027-02-08', 'timeline: 60, 40 and 7 days before the hearing of 15.2.2027 (17.12.2026, 6.1.2027, 8.2.2027)');
check(tl(ex, 'judgment_latest').date === '2027-02-22', 'judgment: at the hearing, at the latest 7 days after it: 15.2.2027 + 7 = 22.2.2027 (reg. 15(a))');
check(tl(ex, 'appeal').date === '2027-03-17' && tl(ex, 'appeal').cond === true, 'leave to appeal: 15.2.2027 + 30 = 17.3.2027 (13 days to 28.2, 17 in March), marked as resting on a judgment given at the hearing (reg. 16(a), 16A)');
check(tl(ex, 'execution').date === '2027-03-17' && tl(ex, 'execution').cond === true, 'the Execution Office form: 30 days after the debtor received the judgment (the Courts Authority)');
check(tl(ex, 'limitation').date === '2033-03-01' && tl(ex, 'limitation').years === 7, 'limitation: 7 years from 1.3.2026 = 1.3.2033 (Limitation Law s.5(1))');
check(ex.timeline.every((e, i, a) => i === 0 || a[i - 1].date <= e.date), 'the timeline is in date order');
const withJ = run({ judgmentDate: '20.2.2027' });
check(tl(withJ, 'judgment').date === '2027-02-20' && !tl(withJ, 'judgment_latest').date && tl(withJ, 'appeal').date === '2027-03-22' && tl(withJ, 'appeal').cond === false && tl(withJ, 'execution').date === '2027-03-22', 'with the judgment day 20.2.2027: appeal and Execution form 22.3.2027 (8 days to 28.2, 22 in March), not conditional');
check(hasFlag(run({ judgmentDate: '2027-02-10' }), 'kt_judgment_before_hearing'), 'a judgment day before the hearing is flagged');
check(tl(ex, 'demand').past === true && tl(ex, 'hearing').past === false && tl(ex, 'service_check').soon === false, 'past and soon are marked against the day of the computation');

/* ---------- 4. Above the ceiling, exactly at it, the waiver ---------- */
const over = run({ heads: { price: 32000, repair: 6500, comp: 5000 } });
check(over.claim.total === 43500 && over.claim.over && over.claim.overBy === 3600 && over.verdict === 'no' && over.forum === 'magistrate', 'over: 32,000 + 6,500 + 5,000 = 43,500, 3,600 above 39,900: not a small claim, the magistrates\' court');
check(hasFlag(over, 'kt_over_ceiling') && over.claim.feeIfWaived === 400, 'over: the choice is flagged; the fee if the rest is waived: 1% of 39,900 = 399 -> 400');
const waived = run({ heads: { price: 32000, repair: 6500, comp: 5000 }, waive: true });
check(waived.amount === 39900 && waived.verdict === 'yes' && waived.fee === 400 && waived.claim.waived === 3600 && waived.claim.claimed === 39900, 'waiver: claims exactly 39,900, fee 400, 3,600 given up');
check(waived.flags.some((f) => f.code === 'kt_waived' && f.section === 'תקנה 25(ב)'), 'waiver: flagged with the one-cause-one-claim rule (reg. 25(b))');
const at = run({ heads: { price: 39900 }, compPar: '' });
const above1 = run({ heads: { price: 39901 } });
check(at.claim.over === false && at.verdict === 'yes' && at.fee === 400 && above1.claim.over === true && above1.claim.overBy === 1 && above1.verdict === 'no', 'edge: 39,900 exactly fits (fee 400); 39,901 is 1 ₪ over');
const unknown = E.compute(reg, Object.assign({}, U.EXAMPLE_CLAIM, { heads: { price: 43500 }, waive: true, on: '2027-01-02' }));
check(unknown.amount === 43500 && unknown.claim.over === null && hasFlag(unknown, 'kt_waive_unknown') && unknown.verdict === 'depends', 'after 1.1.2027 with no new ceiling: no cut to the old ceiling, the waiver is flagged, the verdict is "depends"');

/* ---------- 5. Agorot, the floor, blanks and errors ---------- */
const sub = run({ kind: 'sub', heads: { price: 539.4, comp: 2000 }, compPar: '2b' });
check(sub.claim.total === 2539.4 && sub.fee === 50 && sub.floor === true, 'agorot: 539.40 + 2,000 = 2,539.40; 1% = 25.39 -> 30 -> the 50 ₪ minimum (reg. 6(a)(2))');
check(E.ktHeads({ price: 0.1, other: 0.2 }).total === 0.3 && E.ktHeads({ price: '', fee: 0, repair: null }).any === false, 'heads are summed in agorot (0.10 + 0.20 = 0.30); blank and zero heads are no heads');
const neg = run({ heads: { price: -5, other: 100 } });
check(!neg.ok && neg.errors.some((e) => e.field === 'head_price'), 'a negative head is an input error on its own field');
check(!run({ heads: { price: Number.NaN } }).ok && !run({ demandDate: '31.2.2026' }).ok && run({ demandDate: '31.2.2026' }).errors[0].field === 'demand', 'a broken head and an impossible demand date are input errors');
check(!run({ kind: 'flt', passengers: 0 }).ok && !run({ kind: 'flt', passengers: 2.5 }).ok, 'passengers: a whole number, 1 or more');

/* ---------- 6. The compensation of s.31A and its gates ---------- */
check(hasFlag(run({ heads: { comp: 12000 } }), 'kt_comp_over_max') && !hasFlag(run({ heads: { comp: 12000 } }), 'kt_comp_over_law'), 'compensation 12,000: above 10,000 only for a repeated, continuing or aggravated breach (s.31A(c)(1))');
check(hasFlag(run({ heads: { comp: 60000 } }), 'kt_comp_over_law') && !hasFlag(run({ heads: { comp: 10000 } }), 'kt_comp_over_max'), 'compensation 60,000: above the law\'s 50,000; exactly 10,000 is not flagged');
check(hasFlag(run({ compPar: '' }), 'kt_comp_no_par') && hasFlag(run({ demandDate: '' }), 'kt_demand_missing') && !hasFlag(ex, 'kt_demand_missing'), 's.31A gates: a paragraph of (a) must be chosen; without a written demand the claim is flagged (s.31A(b))');
check(hasFlag(run({ filingDate: '2026-03-10' }), 'kt_demand_after_filing'), 'a demand dated after the filing day is flagged');

/* ---------- 7. Flights ---------- */
const flt = run({ kind: 'flt', heads: { price: 2900 }, compPar: '', passengers: 2, eventDate: '2026-08-14', demandDate: '2026-09-01', hearingDate: '' });
check(tl(flt, 'limitation').date === '2030-08-14' && tl(flt, 'limitation').aviation === true, 'flight: limitation 4 years from 14.8.2026 = 14.8.2030 (Aviation Services Law s.19), not 7');
check(tl(flt, 'refund21').date === '2026-09-22', 'flight: the refund was due 21 days after the written request: 1.9.2026 + 21 = 22.9.2026 (s.3(a)(2))');
check(hasFlag(flt, 'kt_flight_no_comp') && hasFlag(flt, 'kt_flight_plaintiffs'), 'flight: no statutory compensation head yet, and each adult passenger is a plaintiff (s.60(a): no assigned right)');
const old = run({ kind: 'flt', heads: { flight: 2000 }, eventDate: '2022-01-01', compPar: '', demandDate: '' });
check(hasFlag(old, 'kt_limitation_passed') && !hasFlag(old, 'limitation_passed'), 'flight on 1.1.2022: 4 years passed (flagged); the general 7 years have not');
check(hasFlag(run({ kind: 'flt', heads: { flight: 7000 }, passengers: 6 }), 'kt_manual_filing'), 'six passengers: more than the 5 plaintiffs of online filing');

/* ---------- 8. The statement-of-claim outline ---------- */
const outline = U.claimText(reg, ex);
check(outline.includes('2.1 המחיר או ההחזר שלא שולם: 7,990.00 ₪') && outline.includes('2.2 פיצויים לדוגמה לפי סעיף 31א(א)(8)') && outline.includes('סך הכול: 12,748.00 ₪'), 'outline: the heads with their amounts and the total');
check(outline.includes('סעיף 18א לחוק הגנת הצרכן') && outline.includes('31א(ב)') && outline.includes('15.3.2026') && outline.includes('תקנה 3(ה)'), 'outline: the grounds by section, the written demand of 15.3.2026, the 5-page limit');
check(outline.includes('[שם מלא]') && outline.includes('[שם העסק]') && outline.includes('הוצאות המשפט') && !/\d{9}/.test(outline), 'outline: the parties stay placeholders; costs are asked for; no ID-like number');
check(U.claimText(reg, wave1).includes('הסעד המבוקש: תשלום 12,748 ₪') && !U.claimText(reg, wave1).includes('ראשי התביעה'), 'without heads the wave-1 skeleton is unchanged');
const fltText = U.claimText(reg, run({ kind: 'flt', heads: { price: 2900, flight: 5620 }, passengers: 2, compPar: '' }));
check(fltText.includes('התובע/ת 2:') && fltText.includes('סעיף 6(א)(3) לחוק שירותי תעופה, ל-2 נוסעים') && fltText.includes('סעיפים 3 ו-6 לחוק שירותי תעופה'), 'flight outline: a plaintiff line per passenger, the compensation head and the Aviation Services Law grounds');
check(outline.includes('5.') && U.ktDocs(reg, ex).some((d) => d.includes('קבלות')) && U.ktDocs(reg, ex).some((d) => d.includes('הדרישה בכתב')), 'documents: the Courts Authority list for products, plus the demand and the receipts');

/* ---------- 9. The scenario for the simulation ---------- */
const brief = U.aiBrief(reg, ex);
check(words(brief) >= 40 && words(brief) <= 90 && brief.includes('12,748') && brief.includes('130') && brief.endsWith('?'), `aiBrief: ${words(brief)} words, the total and the fee, ends with the question to rehearse`);
check(!/\d{9}/.test(brief) && !bad(brief) && brief.includes('31א(א)(8)'), 'aiBrief: no 9-digit run, nothing undefined, the section of the compensation');
const feeBrief = U.aiBrief(reg, E.compute(reg, { mode: 'fee', amount: 39900, on: ON }));
check(words(feeBrief) >= 40 && words(feeBrief) <= 90 && feeBrief.includes('400'), `aiBrief in fee mode: ${words(feeBrief)} words with the 400 ₪ fee`);
for (const key of Object.keys(U.PRESETS)) {
	const r = E.compute(reg, Object.assign(U.ktPreset(key, ON), { on: ON }));
	const b = U.aiBrief(reg, r);
	check(r.ok && words(b) >= 40 && words(b) <= 90 && !/\d{9}/.test(b), `preset ${key}: computes, brief ${words(b)} words`);
}
check(handoffState('s', brief, 'court_rehearsal').description === brief && handoffState('s', brief, 'court_rehearsal').simulationPurpose === 'court_rehearsal', 'the handoff carries the brief as the case description, purpose court_rehearsal');

/* ---------- 10. Presets ---------- */
const pf = U.ktPreset('flt', ON);
check(pf.eventDate === '2026-08-23' && pf.demandDate === '2026-09-22' && pf.passengers === 2 && pf.kind === 'flt', 'preset "a cancelled flight, 2 passengers": the flight 60 days back, the demand 30 days back');
const pOver = E.compute(reg, Object.assign(U.ktPreset('over', ON), { on: ON }));
check(pOver.claim.total === 43500 && pOver.claim.over, 'preset "over the ceiling": 43,500 ₪');
check((U.renderForm(reg, U.EXAMPLE_CLAIM).match(/data-act="kt-preset"/g) || []).length === 5, 'the form offers 5 quick profiles');

/* ---------- 11. Share state and the sibling links ---------- */
const link = U.stateLink(reg, U.EXAMPLE_CLAIM);
const back = U.inputOf(decodeState(link.split('#')[1], U.KEYS), 'full');
check(link.startsWith('/small-claims-court-israel/#s=') && back.kind === 'def' && back.heads.price === 7990 && back.heads.comp === 4500 && back.heads.other === 258 && back.compPar === '8' && back.demandDate === '2026-03-15', 'stateLink -> decodeState -> inputOf: the kind, the heads, the paragraph and the demand round-trip');
check(E.compute(reg, Object.assign(back, { on: ON })).claim.total === 12748, 'the round trip computes the same 12,748');
const fromBitul = U.inputOf(decodeState('#s=kref/p1200/v2026-09-01/g2026-09-20', U.KEYS), 'full');
check(fromBitul.kind === 'ref' && fromBitul.amount === 1200 && E.compute(reg, Object.assign(fromBitul, { on: ON })).fee === 50, 'a bitul link without "a": refund 1,200, fee 50 (the minimum)');
const fromTisa = U.inputOf(decodeState('#s=kflt/y5620/e2/v2026-08-14', U.KEYS), 'full');
const rTisa = E.compute(reg, Object.assign(fromTisa, { on: ON }));
check(fromTisa.passengers === 2 && rTisa.claim.heads[0].code === 'flight' && rTisa.fee === 60, 'a tisa link: flight compensation 5,620 for 2 passengers, fee 1% = 56.20 -> 60');
check(U.stateLink(reg, { mode: 'fee', amount: 39900 }) === '/small-claims-fee-calculator/#s=a39900', 'fee mode link: /small-claims-fee-calculator/#s=a39900');
check(!/[א-ת]/.test(link) && !link.includes('@'), 'the share state holds numbers, dates and codes only');
const waivedLink = U.stateLink(reg, Object.assign({}, U.EXAMPLE_CLAIM, { heads: { price: 43500 }, waive: true, filingDate: '2026-11-01', judgmentDate: '2027-02-15' }));
const wb = U.inputOf(decodeState(waivedLink.split('#')[1], U.KEYS), 'full');
check(wb.waive === true && wb.filingDate === '2026-11-01' && wb.judgmentDate === '2027-02-15', 'the waiver, the filing day and the judgment day round-trip');

/* ---------- 12. The renders: lead card, ledger, track, details, print ---------- */
const s = U.snapshot(reg);
check(s.input === U.EXAMPLE_CLAIM && s.total === 130 && s.lead.includes('12,748') && s.lead.includes('130') && s.lead.includes('data-lead-go'), 'snapshot: the heads example, total = the fee 130, the lead card with 12,748 and 130');
check(s.fee.lead.includes('<bdi>400</bdi>') && s.fee.lead.includes('399.00') && s.fee.total === 400, 'fee mode lead card: 400 ₪ with 1% = 399.00');
check(s.result.includes('ראשי התביעה מול התקרה') && s.result.includes('תקרה 39,900 ₪') && s.result.includes('jt65-stamp') && s.result.includes('סך הכול 12,748 ₪'), 'the claim ledger: the ceiling line, the fee stamp and a text equivalent');
check(s.result.includes('ציר התיק') && s.result.includes('22.2.2027') && s.result.includes('17.3.2027') && s.result.includes('jt65-node--cond'), 'the case track: the judgment window and the conditional appeal day');
check(s.result.includes('אגרה: <span class="jtool-amt"><bdi>130</bdi> ₪</span>') && s.result.indexOf('data-act="rehearse"') > 0 && s.result.includes('topic=contract-dispute') && s.result.includes('purpose=court_rehearsal'), 'the result keeps the wave-1 fee figure and links the rehearsal (contract-dispute, court_rehearsal)');
check(s.details.includes('17.12.2026') && s.details.includes('6.1.2027') && s.details.includes('1.3.2033') && s.details.includes('האגרה, שורה אחרי שורה'), 'details: the wave-1 dates and the fee breakdown are still in the server HTML');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('8.10.2026') && s.details.includes('jt65-print') && s.details.includes('הודפס ב-22.10.2026') && s.details.includes('נבדק 22.10.2026'), 'details: what changed, and the one-page print with sources, the check date and the print date');
check(s.details.includes('המסמכים לצרף') && s.details.includes('data-act="copy-list"') && s.details.includes('מספר הזהות של הנתבע'), 'details: the documents checklist with the defendant-ID note');
const overHtml = U.renderResult(reg, over) + U.renderDetails(reg, over, null);
check(overHtml.includes('data-act="kt-waive"') && overHtml.includes('סעיף 61(1)') && overHtml.includes('inset-inline-start:91.72%') && overHtml.includes('jt65-stamp--off'), 'over: two roads with s.61(1), the ceiling line at 39,900 / 43,500 = 91.72%, the stamp says the fee does not apply');
check(U.leadCard(reg, over).includes('מעל התקרה ב-3,600 ₪') && U.leadCard(reg, waived).includes('נתבעים 39,900 ₪'), 'lead card: over by 3,600; after the waiver 39,900 is claimed');
check(U.renderForm(reg, U.EXAMPLE_CLAIM).includes('readonly data-kt-sum') && !U.renderForm(reg, U.EXAMPLE).includes('readonly'), 'with heads the amount field is the read-only total; without heads it is the reader\'s field');
const cf = U.compareFor(reg, U.EXAMPLE_CLAIM);
check(cf.heads === null && cf.amount === 39900, 'the what-if column B drops the heads and compares a plain 39,900');
const na = U.nextActions(reg, flt);
check(na.official[0].url === sc.service_url && na.links.some((x) => x.path === '/demand-letter-generator/') && na.links.some((x) => x.path === '/law-compensation-cancellation-2012/#s=f2026-08-14/p2/r2900/q2026-09-01'), 'next actions: the filing service first; the demand letter; the flight tool with its own keys (f the flight day, p passengers, r the ticket, q the demand)');
check(U.nextActions(reg, E.compute(reg, Object.assign({}, fromBitul, { on: ON }))).links.some((x) => x.path === '/bitul-iska/#s=d2026-09-01/x2026-09-20') && U.nextActions(reg, ex).links.some((x) => x.path === '/consumer-rights-israel/#s=yd/a7990/G2026-03-15/A4500/O258'), 'next actions: a refund case opens the cancellation tool (d the deal, x the notice); a defect opens the hub (y case, a price, G demand, A s.31A, O costs)');
check(U.siblingLinks(reg, run({ kind: 'oth' })).every((x) => !x.path.includes('#s=y')) && U.siblingLinks(reg, wave1).length === 0, 'no sibling state for a kind the hub has no case for; no sibling links without heads');
const events = ex.timeline.filter((e) => !e.past && e.code !== 'event').map((e) => ({ date: e.date, summary: `תביעה קטנה: ${e.code}` }));
const cal = ics(events, '2026-10-22T10:00:00Z');
check(cal.includes('DTSTART;VALUE=DATE:20270215') && cal.includes('DTSTART;VALUE=DATE:20270317') && cal.includes('DTSTART;VALUE=DATE:20330301') && !cal.includes('20260315'), 'ics: the hearing, the appeal day and the limitation; past steps left out');
check(E.ktBand(ex) === 'claim_def_yes' && E.ktBand(over) === 'claim_def_over' && E.ktBand(wave1) === 'yes', 'analytics band: a code, never an amount');
check(U.changesTable(reg).includes('1.1.2026') && U.changesTable(reg).includes('39,900') && U.changesTable(reg).includes('<caption>'), 'what changed: the table with its caption');
const all = [ex, over, waived, sub, flt, old, at, above1, unknown, neg, withJ, rTisa, wave1, pOver];
for (const r of all) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r, null) + U.leadCard(reg, r) + U.aiBrief(reg, r) + (r.ok && r.mode === 'full' ? U.claimText(reg, r) : '');
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.ktBand(r)})`);
}
check(!/maya|רוטנברג/i.test(JSON.stringify(s)) && !JSON.stringify(s).includes('כל זכות') && !/<form/i.test(s.form), 'no forbidden names, no <form> gate');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
