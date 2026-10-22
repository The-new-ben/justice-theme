/**
 * Golden tests for the cost and fee estimator of a malpractice claim (alut-tviaa-refuit, the medical-malpractice wave,
 * 22.10.2026). Run: node tests/js/test-malpractice-mechir.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Court Fees Regulations 2007
 * (Nevo, current to 1.1.2026, and the judiciary's notice of 2025 for 1.1.2026: reg.5(a) a fixed fee for bodily injury,
 * item 2 = 8,061 in the magistrates' court, item 9 = 50,380 in the district court; reg.5(b)(1) at filing only item 34 = 839
 * or item 35 = 1,429; reg.5(b)(2)-(7) who pays at each ending; reg.5(c) the district claim that ends below 60% of the
 * magistrates' amount; reg.14(b) 15 days to ask for an exemption), the Courts Law s.51(a)(2) (2,500,000 on the filing day,
 * read from reg.small_claims), VAT 18% (the VAT rate order s.1, read from reg.car_accident), the Civil Procedure Regulations
 * 2018 (reg.87(c) 60 days for a counter-opinion, reg.91(c) 14 days for clarification questions, reg.179(b) recess days not
 * deducted), the Interpretation Law s.10(c) (a last day on a rest day moves on), and the Ministry of Justice's legal-aid table
 * from 1.2.2026 (9,225 to 3 persons, 826 a person more, property 41,307; the participation fee 78 or 157, reg.1A).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/mechir-engine.js';
import * as U from '../../assets/js/tools/mechir-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { isRestDay } from '../../assets/js/tools/dates.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.mcCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const m = reg.malpractice_mechir;
const row = (r, code) => r.endings.rows.find((x) => x.code === code);
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;
const has = (list, code) => list.some((x) => x.code === code);
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };

/* ---------- 1. The registry ---------- */
check(m && m.checked_on === '2026-10-22' && m.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: malpractice_mechir checked 22.10.2026, next update 1.1.2027 (reg.11: the fees change every 1 January)');
const official = JSON.stringify(Object.assign({}, m, { experts: Object.assign({}, m.experts, { published_ranges: [] }) }));
const urls = official.match(/https?:\/\/[^"]+/g) || [];
check(urls.length >= 12 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|nevo\.co\.il|www\.gov\.il)\//.test(u)), `registry: all ${urls.length} official links are Nevo or gov.il`);
check(m.experts.published_ranges.length >= 3 && m.experts.published_ranges.every((x) => x.official === false && x.url && x.read_on === '2026-10-22' && x.name_he), 'registry: the published expert prices are labelled not official, with a name, a url and the read date');
check(!/kolzchut|כל זכות|כל-זכות/.test(JSON.stringify(m)), 'registry: the private rights portal is never named');
check(m.fees.magistrate.full === 8061 && m.fees.magistrate.full_item === 'פרט 2' && m.fees.district.full === 50380 && m.fees.district.full_item === 'פרט 9', 'registry: the fixed bodily-injury fee from 1.1.2026: item 2 = 8,061, item 9 = 50,380 (reg.5(a))');
check(m.fees.magistrate.first === 839 && m.fees.magistrate.first_item === 'פרט 34' && m.fees.district.first === 1429 && m.fees.district.first_item === 'פרט 35' && m.fees.first_section === 'תקנה 5(ב)(1)', 'registry: at filing only item 34 = 839 or item 35 = 1,429 (reg.5(b)(1))');
check(m.fees.low_pct === 60 && m.fees.third_div === 3 && m.fees.early_sessions === 3 && m.fees.exempt.request_days === 15 && m.fees.demand_days === 20, 'registry: 60% (reg.5(c)), a third (5(b)(3)-(4)), the third pre-trial session (5(b)(2)), 15 days (14(b)), 20 days (2(f))');
check(reg.small_claims.magistrate_max === 2500000 && reg.small_claims.magistrate_section === 'סעיף 51(א)(2)' && reg.car_accident.fees.vat_pct === 18, 'reused: the magistrates\' amount 2,500,000 (Courts Law s.51(a)(2), reg.small_claims) and VAT 18% (reg.car_accident)');
const la = m.legal_aid;
check(la.avg_wage === reg.rights_btl.avg_wage.s2_benefits && la.income_base === Math.round(la.avg_wage * la.income_pct / 100) && la.per_person === Math.round(la.avg_wage * la.extra_pct / 100) && la.property_max === la.avg_wage * la.property_times, 'legal aid: the Ministry\'s table matches the regulation: 13,769 × 67% = 9,225; × 6% = 826; × 3 = 41,307 (reg.2(b))');
const needed = [['fees', 'url'], ['fees', 'notice_url'], ['experts', 'url'], ['fee', 'bar_url'], ['fee', 'road_url'], ['fee', 'ethics_url'], ['legal_aid', 'regs_url'], ['legal_aid', 'table_url'], ['legal_aid', 'service_url'], ['court', 'url']];
check(needed.every(([a, b]) => typeof m[a][b] === 'string' && m[a][b].startsWith('https://')) && reg.car_accident.fees.vat_url && reg.car_accident.independence_days && reg.car_accident.limitation.interpretation_he, 'registry: every source the engine reads exists and has a url');

/* ---------- 2. The example: filed in the magistrates' court on 15.10.2026, 600,000 expected, 20% + VAT ---------- */
const ex = E.mcCompute(reg, EX);
check(ex.ok && ex.court.code === 'magistrate' && ex.court.full === 8061 && ex.court.first === 839, 'example: 1,200,000 <= 2,500,000: the magistrates\' court; the fee 8,061, at filing 839');
check(ex.fee === 120000 && ex.feeVat === 21600 && ex.feeShare === 23.6, 'example: 600,000 × 20% = 120,000; VAT 18% = 21,600; together 23.6% of the compensation');
check(ex.expertsTotal === 21000 && ex.courtFee === 839 && ex.net === 436561, 'example: 600,000 − 120,000 − 21,600 − 15,000 − 6,000 − 839 = 436,561');
check(ex.netShare === 72.76 && ex.failCost === 29061, 'example: 436,561 / 600,000 = 72.76%; if the claim fails: 8,061 + 21,000 = 29,061');
check(ev(ex, 'filing') === '2026-10-15' && ev(ex, 'exempt') === '2026-10-30' && !isRestDay('2026-10-30'), 'example dates: filing 15.10.2026; the exemption request by 30.10.2026 (15 days, reg.14(b); a Friday)');
check(row(ex, 'early').plaintiff === 839 && row(ex, 'dropped').plaintiff === 2687 && row(ex, 'settle_mid').defendant === 2687 && row(ex, 'settle_mid').plaintiff === 0 && row(ex, 'won').defendant === 8061 && row(ex, 'lost').plaintiff === 8061, 'example endings: early 839 (5(b)(2)); dropped 8,061 / 3 = 2,687 (5(b)(3)); settled before the evidence: the defendant 2,687 (5(b)(4)); won: the defendant 8,061 (5(b)(5)); dismissed: 8,061 (5(b)(7))');
check(ex.lines.map((x) => x.code).join() === 'fee,vat,expert1,expert2,court_fee' && has(ex.flags, 'no_cap') && has(ex.flags, 'road_cap') && !has(ex.flags, 'exempt_passed'), 'example ledger: fee, VAT, two opinions, the fee paid at filing; the no-cap and the road-cap notes');

/* ---------- 3. Which court: the boundary of s.51(a)(2) ---------- */
check(E.mcCourt(reg, 2500000).code === 'magistrate' && E.mcCourt(reg, 2500001).code === 'district' && E.mcCourt(reg, 1).code === 'magistrate', 'court: exactly 2,500,000 the magistrates\' court; 2,500,001 the district court');
check(E.mcCourt(reg, 2500001).full === 50380 && E.mcCourt(reg, 2500001).first === 1429 && E.mcCourt(reg, 2500001).section === 'סעיף 40(1)', 'district: the fee 50,380, at filing 1,429 (s.40(1))');

/* ---------- 4. reg.5(c): a district claim that ends below 60% of 2,500,000 = 1,500,000 ---------- */
const dw = run({ stage: 'judgment', outcome: 'won', amount: 4000000, comp: 1200000 });
check(dw.court.code === 'district' && row(dw, 'won').defendant === 8061 && row(dw, 'won').plaintiff === 42319 && dw.courtFee === 42319 && has(dw.flags, 'district_low'), 'district, judgment for 1,200,000 < 1,500,000: the defendant pays the magistrates\' 8,061 and the plaintiff completes 50,380 − 8,061 = 42,319 (reg.5(c))');
const d15 = run({ stage: 'judgment', outcome: 'won', amount: 4000000, comp: 1500000 });
check(!d15.endings.low && d15.courtFee === 0 && row(d15, 'won').defendant === 50380, 'district, exactly 1,500,000 (not below 60%): the defendant pays all 50,380 and refunds the plaintiff (reg.5(b)(5))');
const d14 = run({ stage: 'judgment', outcome: 'won', amount: 4000000, comp: 1499999 });
check(d14.endings.low && d14.courtFee === 42319, 'district, 1,499,999 (one shekel below): reg.5(c) applies');
const dm = run({ stage: 'settled', when: 'mid', amount: 4000000, comp: 1000000 });
check(row(dm, 'settle_mid').defendant === 2687 && row(dm, 'settle_mid').plaintiff === 14106.33 && dm.courtFee === 14106.33 && dm.flags.find((x) => x.code === 'district_low').he.includes('לא אומרת במפורש'), 'district, settled before the evidence at 1,000,000: a third each: 50,380 / 3 = 16,793.33 − 8,061 / 3 = 2,687 → 14,106.33, flagged as the tool\'s reading');
const dd = run({ stage: 'settled', when: 'early', amount: 4000000, comp: 1000000 });
check(dd.courtFee === 1429 && row(dd, 'dropped').plaintiff === 16793.33 && row(dd, 'lost').plaintiff === 50380, 'district: an early settlement leaves only 1,429; dropped before the evidence 16,793.33; dismissed 50,380');

/* ---------- 5. The stages ---------- */
const pre = run({ stage: 'pre', filing: '2026-11-15', defOpinion: '2026-12-01' });
check(pre.ok && pre.courtFee === 0 && !pre.lines.some((x) => x.code === 'court_fee') && ev(pre, 'filing') === '2026-11-15' && !ev(pre, 'counter'), 'before filing: no fee yet; a planned filing day may be in the future; a defence opinion is ignored');
const early = run({ stage: 'settled', when: 'early' });
check(early.courtFee === 839 && early.end === 'early' && early.net === 436561, 'settled before the end of the third pre-trial session: only the 839 paid at filing (reg.5(b)(2))');
const mid = run({ stage: 'settled', when: 'mid' });
check(mid.courtFee === 0 && mid.net === 437400 && has(mid.flags, 'mediation'), 'settled before the evidence: the defendant pays a third and refunds the 839: net 437,400; the mediation note (reg.5(b)(6))');
const late = run({ stage: 'settled', when: 'late' });
check(late.courtFee === 0 && late.end === 'won', 'settled after the evidence began: the defendant pays the whole fee (reg.5(b)(5))');
const lost = run({ stage: 'judgment', outcome: 'lost', courtExpert: 8000 });
check(lost.lost && lost.comp === null && lost.courtFee === 8061 && lost.failCost === 37061 && lost.outOfPocket === 37061 && !lost.lines.some((x) => x.code === 'fee'), 'dismissed: 8,061 + 21,000 opinions + 8,000 court expert = 37,061; no fee line (reg.5(b)(7))');

/* ---------- 6. The lawyer's fee and VAT ---------- */
const incl = run({ comp: 300000, feePct: 20, vat: 'incl' });
check(incl.fee === 50847.46 && incl.feeVat === 9152.54 && incl.fee + incl.feeVat === 60000, '20% including VAT on 300,000 = 60,000: 60,000 / 1.18 = 50,847.46 + 9,152.54 VAT');
const noFee = run({ feePct: '' });
check(noFee.fee === 0 && noFee.feeVat === 0 && noFee.net === 600000 - 21000 - 839, 'no fee entered: no fee line: 600,000 − 21,000 − 839 = 578,161');
const neg = run({ comp: 10000, e1: 15000, e2: '' });
check(has(neg.flags, 'negative') && neg.net < 0, 'costs above the compensation: the net is negative and a red flag says so');

/* ---------- 7. Experts and the dates the regulations set ---------- */
const op = run({ defOpinion: '2026-09-01', filing: '2026-08-01', courtOpinion: '2026-10-15' });
check(ev(op, 'counter') === '2026-11-01' && isRestDay('2026-10-31'), 'counter-opinion: 1.9.2026 + 60 days = 31.10.2026, a Saturday, so 1.11.2026 (reg.87(c); Interpretation Law s.10(c))');
check(ev(op, 'questions') === '2026-10-29' && has(op.flags, 'recess') && has(op.flags, 'exempt_passed'), 'clarification questions: 15.10.2026 + 14 = 29.10.2026 (reg.91(c)); recess days not deducted (reg.179(b)); filed 1.8.2026: the 15 days for an exemption passed');
const yk = run({ filing: '2026-09-06', today: '2026-10-22' });
check(ev(yk, 'exempt') === '2026-09-22' && isRestDay('2026-09-21'), 'filed 6.9.2026: 15 days = 21.9.2026, Yom Kippur, so 22.9.2026');
const leap = run({ stage: 'pre', filing: '2028-02-29' });
check(ev(leap, 'exempt') === '2028-03-15' && !run({ stage: 'pre', filing: '29.2.2027' }).ok, 'Feb 29: a planned filing on 29.2.2028 → 15.3.2028; 29.2.2027 does not exist');
const exOnly = run({});
check(exOnly.expertsTotal === 21000 && !exOnly.lines.some((x) => /published|range/.test(x.code)), 'the published prices are never added: only the reader\'s two quotes (15,000 + 6,000)');

/* ---------- 8. Legal aid (the Ministry's table from 1.2.2026) ---------- */
const a3 = run({ household: 3, income: 9225 });
check(a3.aid.status === 'within' && a3.aid.limit === 9225 && a3.aid.participation === 157, 'legal aid, 3 persons, income exactly 9,225: within; above half (4,612.50): participation 157');
check(run({ household: 3, income: 9226 }).aid.status === 'above', 'legal aid, 9,226 (one shekel above): above the line');
check(E.mcAidLimit(reg, 5) === 10877 && E.mcAidLimit(reg, 12) === 16659 && E.mcAidLimit(reg, 1) === 9225, 'legal aid lines: 5 persons 9,225 + 2 × 826 = 10,877; 12 persons 16,659; 1 person 9,225 (as the table)');
check(run({ household: 2, income: 4612.5 }).aid.participation === 78 && run({ household: 2, income: 4613 }).aid.participation === 157, 'participation fee: up to half the line 78, above it 157 (reg.1A)');

/* ---------- 9. Input errors ---------- */
check(err({ amount: '' }, 'amount') && err({ amount: 0 }, 'amount') && err({ amount: -5 }, 'amount'), 'error: the claim\'s amount empty, zero or negative');
check(err({ feePct: 101 }, 'feePct') && err({ feePct: -1 }, 'feePct') && run({ feePct: 100 }).ok, 'error: a fee above 100% or below 0; exactly 100% is accepted');
check(err({ filing: '2026-10-23' }, 'filing') && err({ filing: '31.2.2026' }, 'filing') && err({ defOpinion: '2026-10-01', filing: '2026-10-15' }, 'defOpinion'), 'error: a filed claim with a future filing day; an impossible date; a defence opinion before the filing');
check(err({ household: 0 }, 'household') && err({ household: 2.5 }, 'household') && err({ household: 21 }, 'household') && err({ dp: 120 }, 'dp') && err({ e1: -1 }, 'e1'), 'error: persons 0, 2.5 or 21; a disability of 120%; a negative quote');

/* ---------- 10. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.total === 436561 && s.sticky.includes('436,561') && s.sentence.includes('436,561') && s.result.includes('436,561'), 'snapshot: the example figure 436,561 everywhere');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><bdi>436,561<\/bdi><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת') && s.lead.includes('839'), 'lead card: the example\'s net, the fee at filing, the jump to the form');
check((s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"') && s.form.includes('להמחשה בלבד'), 'form: 5 one-click profiles, the example pressed, labelled as illustrations, not a price list');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 21 && s.compare_table.includes('אין תקרה בחוק') && s.compare_table.includes('לא חלה כאן'), 'page table: header + 20 rules with a caption; no cap for malpractice; the road cap marked as not applying');
check((s.result.match(/class="jt71-row /g) || []).length === 7 && s.result.includes('jtool-visually-hidden') && s.result.includes('jt71-row--net'), 'the ledger: the compensation, 5 cost lines and the net, with a text equivalent');
check((s.result.match(/class="jt71-st[ "]/g) || []).length === 5 && (s.result.match(/jt71-st--now/g) || []).length === 1, 'the fee track: 5 stations, the reader\'s station once');
check(U.renderResult(reg, dw).includes('jt71-mine') && U.renderResult(reg, dw).includes('42,319'), 'the endings table marks the reader\'s ending (district, judgment: 42,319)');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('20 נקודות') && br.includes('בין מיליון ל-1.5 מיליון') && !br.includes('600,000') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול') && br.trim().endsWith('?'), `aiBrief: ${words} words, the disability gap, amounts as bands, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=witness_prep') && s.result.includes('topic=medical-malpractice') && handoffState('x', br, 'witness_prep').simulationPurpose === 'witness_prep', 'the brief under its h4; the expert\'s cross-examination (witness_prep, medical-malpractice)');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url.startsWith('https://www.gov.il/') && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/')) && na.links.some((x) => x.path.startsWith('/medical-malpractice-statute-of-limitations/')) && na.links.some((x) => x.path.startsWith('/what-is-medical-malpractice-definition-examples/')), 'next actions: the judiciary\'s fee table first, then 2-4 internal links incl. the clock and the case check');
const hrefs = (s.result.match(/href="([^"]+)"/g) || []).map((h) => h.slice(6, -1));
check(hrefs.length > 10 && hrefs.every((h) => h.startsWith('/') || h.startsWith('#') || /^https:\/\/(www\.nevo\.co\.il|nevo\.co\.il|www\.gov\.il|jus-tice\.com)\//.test(h)), `links: ${hrefs.length} links, only the site, Nevo, gov.il and the simulation: no firm is linked`);
const rb = U.rangesBox(reg);
check(rb.includes('לא מקור רשמי') && (rb.match(/data-act="pick"/g) || []).length === 2 && rb.includes('data-amount="5000"') && rb.includes('data-amount="10000"') && !rb.includes('href='), 'published prices: labelled not official, read date, pick buttons only where a number is published, plain text urls');
const icsText = ics(op.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20261101') && icsText.includes('DTSTART;VALUE=DATE:20261029') && icsText.includes('DTSTART;VALUE=DATE:20260816') && (icsText.match(/BEGIN:VEVENT/g) || []).length === op.events.length, 'ics: the computed dates (1.11.2026, 29.10.2026, the exemption 16.8.2026), one event each');
check(U.renderDetails(reg, run({ filing: '' }), {}).includes('אין עדיין מועד שתקנה קובעת'), 'no filing day: the dates table explains why there is no date (the balance has none)');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('436,561') && s.details.includes('jt71-print'), 'print summary: result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('1.1.2021') && s.details.includes('1.1.2025') && s.details.includes('1.1.2026') && s.details.includes('1.2.2026'), 'what changed and when: the dated official rows');

/* ---------- 11. Share state and the cluster links ---------- */
const st = U.stateOf(Object.assign({}, EX, { stage: 'settled', when: 'mid', vat: 'incl', e3: 4000, courtExpert: 7000, household: 4, income: 8000, defOpinion: '2026-10-20' }));
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.stage === 'settled' && back.when === 'mid' && back.vat === 'incl' && back.amount === 1200000 && back.comp === 600000 && back.feePct === 20 && back.e3 === 4000 && back.courtExpert === 7000 && back.household === 4 && back.filing === EX.filing && back.defOpinion === '2026-10-20' && back.dp === 30, 'share state: stateOf -> decodeState -> inputOf round trip');
check(back.income === '' && !st.includes('8000') && !/[א-ת]/.test(st), 'share state: the income never travels; numbers and dates only');
const link = U.stateLink(reg, EX);
const fromLink = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/medical-malpractice-cost/#s=') && E.mcCompute(reg, Object.assign(fromLink, { today: EX.today })).net === ex.net, 'stateLink: /medical-malpractice-cost/#s=..., the same input and the same net');
const lostLink = U.inputOf(decodeState(U.stateOf(U.mcPreset('lost', '2026-10-22')), U.KEYS), EX);
check(lostLink.comp === '' && lostLink.outcome === 'lost' && lostLink.filled.length === 0, 'a full state with no compensation is not filled from the example');
const partial = U.inputOf(decodeState('s=a3000000', U.KEYS), EX);
const pr2 = E.mcCompute(reg, Object.assign(partial, { today: '2026-10-22' }));
check(partial.amount === 3000000 && partial.filled.join() === 'comp,feePct,e1' && partial.dp === '' && partial.filing === '' && pr2.court.code === 'district', 'a sibling\'s partial link (the amount only): district court; the compensation, the fee and the opinions from the example and listed; no date or disability % invented');
check(U.inputOf(decodeState('s=a3000000', U.KEYS)) === null && U.inputOf({}, EX) === null, 'a partial state without a base, or an empty one: nothing');

for (const r of [ex, dw, d15, dm, dd, pre, early, mid, late, lost, incl, noFee, neg, op, yk, a3]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r, { today: r.today }) + U.leadCard(reg, r) + U.aiBrief(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.mcBandOf(r)})`);
}
const errR = run({ amount: '' });
const errHtml = U.renderResult(reg, errR) + U.leadCard(reg, errR);
check(errHtml.includes('צריך לתקן') && !bad(errHtml) && E.mcBandOf(errR) === 'error', 'an input error renders the message, never a raw value');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
