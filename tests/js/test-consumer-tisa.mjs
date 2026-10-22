/**
 * Golden tests for the flight-disruption instrument (pitzui-tisa, the consumer-law wave, 22.10.2026, HAD-593).
 * Run: node tests/js/test-consumer-tisa.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Aviation Services Law 2012 in its
 * consolidated text on Nevo (law 119611, current to 5.2.2026): s.1 (a cancelled flight: not operated, or departed 8 hours late
 * or more), s.2 (the gates), s.3(a) (refund within 21 days of the written request; compensation within 45 days; downgrade
 * within 21 days of the flight), s.3(b)(2) (a return leg: half the price), s.3(b)(3) and the Third Schedule (package prices),
 * s.5 (denied boarding; halving up to 4/5/6 hours; security s.5(e)), s.6 (cancelled: halving up to 2/3/4 hours; notice 14
 * days, 7-14 days with 2/4 hours, under 7 days with 1/2 hours; s.6(d); s.6(e) exemptions), s.7 (2 hours food and calls; 5 hours
 * refund or another ticket), s.8 (advanced more than 5 / more than 8 hours with notice under 14 days), s.9 and the Second
 * Schedule (60 / 80 / 90 / 100%), s.11 (12,240), s.19 (4 years), s.20; the First Schedule for 2026: 1,530 / 2,450 / 3,670;
 * the temporary order "Swords of Iron" (SH 3372, 11.2.2025): s.2(a) four windows, s.2(b) 1.12.2023-29.2.2024 with 3 days'
 * notice; the domestic regulations 2013 (3 hours; base 300 / 180 / 240); the Limitation Law s.15A (7.10.2023-6.4.2024 not
 * counted, also for a period of another law, s.15A(e)); the Interpretation Law s.10(c) (a rest day moves the last day); the
 * small-claims ceiling 39,900 from 1.1.2026 and the fee of reg. 6(a) (1%, up to a multiple of 5, at least 50).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/tisa-engine.js';
import * as U from '../../assets/js/tools/tisa-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { addDays, isRestDay, offRestDays } from '../../assets/js/tools/dates.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.tsCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const T = reg.consumer_tisa;
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;
const has = (r, code) => r.flags.some((f) => f.code === code);
const ind = reg.car_accident.independence_days;

/* ---------- 1. The registry ---------- */
check(T && T.checked_on === '2026-10-22' && T.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: consumer_tisa checked 22.10.2026, next update 1.1.2027');
const urls = JSON.stringify(T).match(/https?:\/\/[^"]+/g) || [];
check(urls.length > 15 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|main\.knesset\.gov\.il|fs\.knesset\.gov\.il|www\.gov\.il)\//.test(u)), `registry: all ${urls.length} source links are official (Nevo law texts, the Knesset, gov.il)`);
check(!/kolzchut|כל זכות|כל-זכות/.test(JSON.stringify(T)), 'registry: the private rights portal is never named');
check(T.amounts.bands.map((b) => b.amount).join() === '1530,2450,3670' && T.amounts.bands.map((b) => b.base).join() === '1250,2000,3000' && T.amounts.year === 2026, 'registry: First Schedule 2026 1,530 / 2,450 / 3,670 (consolidated text to 5.2.2026); 2012 base 1,250 / 2,000 / 3,000');
check(T.exemplary.max === 12240 && T.benefits.refund_days === 21 && T.benefits.comp_days === 45 && T.benefits.downgrade_days === 21 && T.limitation.years === 4 && T.defs.cancelled_hours === 8, 'registry: s.11 12,240; s.3(a)(2) 21 days; s.3(a)(4) 45 days; s.3(a)(5) 21 days; s.19 4 years; s.1 8 hours');
check(T.domestic.cancelled_hours === 3 && T.domestic.lines.map((l) => l.base).join() === '300,180,240' && T.domestic.update_found === false, 'registry: domestic regs: 3 hours (reg.1), base 300 / 180 / 240 (reg.2), the 2026 update not found');
check(T.war.nocomp.length === 4 && T.war.nocomp[0].from === '2023-10-07' && T.war.nocomp[3].to === '2024-10-05' && T.war.notice_from === '2023-12-01' && T.war.notice_to === '2024-02-29' && T.war.notice_days === 3 && T.war.booklet === 3372, 'registry: the war temporary order SH 3372: 4 windows (7.10.2023 ... 5.10.2024), 1.12.2023-29.2.2024 with 3 days');
check(T.downgrade.rows.map((x) => x.pct).join() === '60,80,90,100' && T.package.rows.economy.prices.join() === '920,1840,3060' && T.package.rows.first.prices[2] === 15300, 'registry: Second Schedule 60/80/90/100%; Third Schedule economy 920/1,840/3,060, first long-haul 15,300');
check(reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount === 39900 && reg.car_accident.limitation.war.from === '2023-10-07', 'reused: reg.small_claims 39,900 from 1.1.2026; reg.car_accident.limitation the war window');

/* ---------- 2. The example: cancelled on the day, 2,000-4,500 km, 2 passengers, 1,900 each, flight 14.9.2026, today 22.10.2026 ---------- */
const ex = E.tsCompute(reg, EX);
check(ex.ok && EX.flight === '2026-09-14' && EX.today === '2026-10-22' && ex.event === 'cancel' && ex.band === 'b2', 'example: cancelled flight of 14.9.2026, band 2,000-4,500 km');
check(ex.perDue === 2450 && ex.total === 4900 && ex.comp.due && ex.comp.section === 'סעיף 6(א)', 'example: 2,450 × 2 = 4,900 ₪ (s.6(a), First Schedule 2026)');
check(ex.refund.amount === 3800 && ex.refundDue === '2026-11-12' && ex.compDue === '2026-12-06', 'example: refund 1,900 × 2 = 3,800 ₪; sent today 22.10.2026: refund by 12.11.2026 (+21), compensation by 6.12.2026 (+45: 9 + 30 + 6)');
check(ex.lim.plain === '2030-09-14' && isRestDay('2030-09-14') && ex.deadline === '2030-09-15' && ex.lim.added === 0, 'example: 4 years: 14.9.2030 is a Saturday, so the last day is 15.9.2030 (s.19; Interpretation Law s.10(c))');
check(ex.court.claim === 8700 && ex.court.small && ex.court.fee === 90, 'example: the small claim 4,900 + 3,800 = 8,700 ₪ under 39,900; fee 1% = 87 -> up to 90 ₪ (reg. 6(a))');
check(ex.assistance.map((a) => a.code).join() === 'food,comms,hotel,transport' && ex.alt, 'example: assistance s.3(a)(1): food, calls, hotel and transport as needed; refund or another ticket');

/* ---------- 3. Distance bands (s.12, First Schedule) ---------- */
check(E.tsBandOf(reg, 2000, 'b3') === 'b1' && E.tsBandOf(reg, 2001, 'b1') === 'b2' && E.tsBandOf(reg, 4500, 'b1') === 'b2' && E.tsBandOf(reg, 4501, 'b1') === 'b3' && E.tsBandOf(reg, null, 'b3') === 'b3', 'bands: exactly 2,000 km -> up to 2,000; 2,001 and exactly 4,500 -> the middle band; 4,501 -> over 4,500; km wins over a picked band');
check(run({ km: 4501 }).perDue === 3670 && run({ km: 1999, band: 'b3' }).perDue === 1530, 'bands: 4,501 km -> 3,670; 1,999 km -> 1,530 even when another band was picked');

/* ---------- 4. Delays (s.7, s.1) ---------- */
const d = (h, over) => run(Object.assign({ event: 'delay', hours: h, choice: 'flew' }, over || {}));
check(d(1.9).assistance.length === 0 && d(2).assistance.map((a) => a.code).join() === 'food,comms' && !d(4.9).refund && d(5).refund && d(5).alt, 'delay: 1.9 hours nothing; 2 hours food and calls (s.7(a)); 4.9 no refund; 5 hours refund or another ticket (s.7(b))');
check(d(7.9).total === 0 && !d(7.9).legalCancel && d(8).legalCancel && d(8).total === 4900 && d(8).comp.code === 'delay8', 'delay: 7.9 hours no money; exactly 8 hours is a cancelled flight (s.1): 4,900 ₪');
check(d(6, { exempt: 'strike' }).refund && !d(6, { exempt: 'strike' }).alt && has(d(6, { exempt: 'strike' }), 'strike'), 'delay 5-8 hours by a protected strike: refund, food and calls only (s.7(b))');
check(d(2.9, { type: 'domestic' }).total === 0 && d(3, { type: 'domestic' }).legalCancel && d(3, { type: 'domestic', line: 'eilat' }).total === 600, 'domestic: 2.9 hours no money; 3 hours is a cancelled domestic flight (reg.1): Eilat base 300 × 2 = 600');
check(d(9).refund && !d(9).refund.chosen && has(d(9), 'flew'), 'delay 9 hours, flew on the late flight: no refund (s.3(b)(4)), the compensation stays');

/* ---------- 5. The notice exemptions (s.6(c), s.6(d)) ---------- */
const n = (days, over) => run(Object.assign({ notice: addDays(EX.flight, -days) }, over || {}));
check(n(14).total === 0 && n(14).comp.code === 'notice_full' && has(n(14), 'notice'), 'notice 14 days before: no money (s.6(c)(1)), the refund stays');
check(n(13, { offered: true, early: 2, late: 4 }).total === 0 && n(13, { offered: true, early: 2, late: 4.5 }).total === 4900 && n(13).total === 4900, 'notice 13 days: exempt only with an alternative leaving up to 2 hours earlier and landing up to 4 hours later (s.6(c)(2))');
check(n(7, { offered: true, early: 2, late: 4 }).total === 0 && n(6, { offered: true, early: 2, late: 4 }).total === 4900 && n(6, { offered: true, early: 1, late: 2 }).total === 0, 'notice exactly 7 days is the middle tier; 6 days needs 1 hour earlier / 2 hours later (s.6(c)(3))');
check(n(14, { refusedAlt: true }).total === 4900 && has(n(14, { refusedAlt: true }), 'refused'), 'refused the alternative for a companion, security, religion or health: the notice does not exempt (s.6(d))');

/* ---------- 6. Halving (s.6(b), s.5(c)) ---------- */
check(run({ choice: 'alt', late: 3 }).perDue === 1225 && run({ choice: 'alt', late: 3 }).total === 2450 && run({ choice: 'alt', late: 3.5 }).perDue === 2450, 'halving: an accepted alternative landing 3 hours late (2,000-4,500 km): 2,450 / 2 = 1,225; 3.5 hours: full');
check(run({ choice: 'alt', late: 2, band: 'b1' }).perDue === 765 && run({ choice: 'alt', late: 4, band: 'b3' }).perDue === 1835 && run({ choice: 'refund', late: 1 }).perDue === 2450, 'halving: up to 2 hours (1,530 -> 765), up to 4 hours (3,670 -> 1,835); with a refund there is no halving');
const den = (over) => run(Object.assign({ event: 'denied', band: 'b1', pax: 4 }, over || {}));
check(den({ choice: 'alt', late: 4 }).perDue === 765 && den({ choice: 'alt', late: 5 }).total === 6120 && den().total === 6120, 'denied boarding: halving up to 4 hours (s.5(c)): 765; 5 hours: 1,530 × 4 = 6,120');

/* ---------- 7. The war-time temporary order (SH 3372, s.2) ---------- */
check(run({ flight: '2023-11-01' }).total === 0 && run({ flight: '2023-11-01' }).comp.code === 'war_a' && run({ flight: '2023-11-01' }).refund.amount === 3800, 'flight 1.11.2023 (window 7.10-30.11.2023): no money (s.2(a)); the refund stays');
check(run({ flight: '2024-04-15' }).comp.code === 'war_a' && run({ flight: '2024-04-19' }).total === 4900 && run({ flight: '2024-08-08' }).comp.code === 'war_a' && run({ flight: '2024-10-06' }).total === 4900, 'windows: 15.4.2024 in, 19.4.2024 out; 8.8.2024 (last day) in; 6.10.2024 out');
check(run({ flight: '2024-01-10', notice: '2024-01-07' }).comp.code === 'war_b' && run({ flight: '2024-01-10', notice: '2024-01-08' }).total === 4900 && has(run({ flight: '2024-01-10', notice: '2024-01-08' }), 'war_b_short'), '1.12.2023-29.2.2024: notice 3 days before -> no money (s.2(b)); 2 days -> the ordinary rules');
check(run({ flight: '2023-11-01', event: 'denied' }).total === 4900 && run({ flight: '2024-08-05', event: 'advance', hours: 9 }).total === 0, 'the order covers cancelled and advanced flights only: denied boarding in a window still pays; an advance of 9 hours in a window does not');

/* ---------- 8. Exemptions the airline raises (s.6(e), s.6(g)) and s.20 ---------- */
const xo = run({ exempt: 'extraordinary' });
check(xo.disputed && xo.total === 4900 && has(xo, 'exempt'), 'the airline claims extraordinary circumstances: shown as its burden; the amount stays 4,900 unless proven (s.6(e)(1))');
check(!run({ event: 'advance', hours: 9, exempt: 'shabbat' }).disputed && has(run({ event: 'advance', hours: 9, exempt: 'shabbat' }), 'exempt_advance'), 'an advance: the Sabbath exemption does not apply (s.8(b)(1) excepts only s.6(e)(1)-(2))');
check(run({ foreign: true }).total === 0 && run({ foreign: true }).comp.code === 'foreign', 'compensation received under a foreign law: none of the same kind (s.20)');

/* ---------- 9. Advanced departure (s.8) ---------- */
const adv = (h, days) => run({ event: 'advance', hours: h, notice: days === null ? '' : addDays(EX.flight, -days) });
check(adv(9, 10).total === 4900 && adv(9, 14).total === 0 && !adv(9, 14).refund && adv(6, 3).total === 0 && adv(6, 3).refund && !adv(5, 3).refund, 'advance: 9 hours with 10 days notice -> money + refund (s.8(b)); 14 days -> nothing; 6 hours -> refund only (s.8(a)); exactly 5 hours -> nothing');

/* ---------- 10. Denied boarding (s.5(d)-(e)) ---------- */
check(den({ denied: 'security' }).total === 0 && den({ denied: 'security', securityOk: true }).total === 6120 && den({ denied: 'health' }).total === 0 && den({ denied: 'documents' }).total === 0, 'denied for security: money only if at the airport 3 hours before, cooperated, documents valid (s.5(e)); health or documents: nothing (s.5(d))');

/* ---------- 11. Downgrade (s.9, Second and Third Schedules) ---------- */
const dg = (over) => run(Object.assign({ event: 'downgrade', pax: 1, price: 3000 }, over || {}));
check(dg({ down: 'be' }).total === 2400 && dg({ down: 'be', band: 'b3' }).total === 3000 && dg({ down: 'fb', band: 'b3' }).total === 1800 && dg({ down: 'fe' }).total === 2700, 'downgrade on 3,000: business->economy 80% = 2,400; over 4,500 km 100% = 3,000; first->business stays 60% = 1,800; first->economy 90% = 2,700');
check(dg({ down: 'be', km: 3000, segKm: 1500 }).total === 1200 && ev(dg({ down: 'be' }), 'downgrade_due') === offRestDays('2026-10-05', ind), 'downgrade on a connecting flight: 2,400 × 1,500 / 3,000 = 1,200; paid within 21 days of 14.9.2026 = 5.10.2026');
check(dg({ price: '', pkg: true, down: 'be' }).total === 3424 && has(dg({ price: '', down: 'be' }), 'need_price'), 'downgrade in a package without a price: business 4,280 (Third Schedule, 2,000-4,500) × 80% = 3,424; no price and no package: a flag');

/* ---------- 12. The refund (s.3(b)) ---------- */
check(run({ leg: 'back' }).refund.amount === 1900 && run({ leg: 'out' }).refund.amount === 3800, 'refund on a round trip: the return leg half (1,900 × 50% × 2 = 1,900); the outbound leg in full (s.3(b)(2))');
check(run({ price: '', pkg: true, cls: 'economy', band: 'b3' }).refund.amount === 6120 && run({ price: '' }).refund.amount === null && has(run({ price: '' }), 'refund_price'), 'refund in a package without a price: 3,060 × 2 = 6,120 (Third Schedule); no price: the whole sum paid, in words');

/* ---------- 13. The gates of s.2 ---------- */
check(run({ free: true }).none.code === 'free' && run({ free: true }).total === 0 && !run({ free: true }).refund && run({ moved: true }).none.code === 'moved', 'gates: a free / non-public fare (s.2(b)(2)) and a transfer that landed on time (s.2(b)(1)): no benefits');
check(d(6, { noCheckin: true }).none.code === 'checkin' && run({ noCheckin: true }).total === 4900, 'gates: not checked in on time kills a delay claim (s.2(a)); for a cancelled flight check-in is not required');

/* ---------- 14. The limitation (s.19 + Limitation Law s.15A(e)) ---------- */
const l22 = run({ flight: '2022-06-01' });
check(l22.lim.plain === '2026-06-01' && l22.lim.added === 183 && l22.deadline === offRestDays('2026-12-01', ind) && !l22.expired && has(l22, 'limit_war'), 'flight 1.6.2022: 4 years end 1.6.2026, after the war window: 7.10.2023-6.4.2024 = 183 days added -> 1.12.2026');
const l21 = run({ flight: '2021-06-01' });
check(l21.expired && has(l21, 'expired') && l21.deadline < '2026-10-22', 'flight 1.6.2021: the 4 years (with the war days) ended in 2025: expired, a flag, never a verdict');

/* ---------- 15. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ flight: '' }, 'flight') && err({ flight: '31.2.2026' }, 'flight') && err({ flight: '2012-08-15' }, 'flight') && !run({ flight: '2012-08-16' }).ok === false, 'errors: no flight day, an impossible day, a flight before the law (16.8.2012)');
check(err({ pax: 0 }, 'pax') && err({ pax: 100 }, 'pax') && err({ pax: 1.5 }, 'pax') && err({ pax: '' }, 'pax'), 'errors: passengers 0, 100, a fraction, empty');
check(err({ event: 'delay', hours: '' }, 'hours') && err({ event: 'delay', hours: -1 }, 'hours') && err({ notice: '2026-09-20' }, 'notice') && err({ demand: '2026-10-23' }, 'demand') && err({ km: 0 }, 'km'), 'errors: a delay without hours, negative hours, a notice after the flight, a demand after today, zero km');
check(err({ event: 'downgrade', km: 1000, segKm: 1500 }, 'segKm') && err({ price: -5 }, 'price'), 'errors: a segment longer than the flight; a negative price');

/* ---------- 16. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.total === 4900 && s.result.includes('4,900') && s.sentence.includes('4,900') && s.sticky.includes('4,900') && s.sentence.includes('15.9.2030'), 'snapshot: the example figures (4,900 ₪, the last day 15.9.2030)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><bdi>4,900<\/bdi> ₪<\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת') && s.lead.includes('3,800'), 'lead card: the example\'s 4,900 ₪, the refund 3,800, the jump to the form');
check(s.form.includes('data-act="preset"') && (s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"'), 'form: 5 one-click profiles, the example pressed');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 10 && s.method.includes('jtool-cite'), 'page table: header + 9 situations with a caption; the method cites');
check((s.result.match(/class="jt66-step[ "]/g) || []).length === 3 && s.result.includes('jt66-step--mine') && s.result.includes('jt66-strip') && s.result.includes('jtool-visually-hidden'), 'the board: the 3-step ladder with the reader\'s step lit, the hours strip, a text equivalent');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('4,900') && br.includes('3,800') && br.includes('14.9.2026') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול') && br.trim().endsWith('?'), `aiBrief: ${words} words, the key figures, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=court_rehearsal') && s.result.includes('topic=contract-dispute') && handoffState('x', br, 'court_rehearsal').simulationPurpose === 'court_rehearsal', 'the brief under its h4; the small-claims hearing (court_rehearsal), topic contract-dispute');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official.every((x) => /^https:\/\/(www\.nevo\.co\.il|www\.gov\.il)\//.test(x.url)) && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/')), 'next actions: the law, the CAA list, the judiciary service; then 2-4 internal links');
const KT_KEYS = ['a', 't', 'r', 'l', 'x', 'n', 'v', 'h', 's', 'k', 'p', 'f', 'q', 'c', 'u', 'y', 'e', 'o', 'g', 'w', 'i', 'j'];
const kl = U.ktanotLink(ex);
const ks = decodeState(kl.split('#')[1], KT_KEYS);
check(kl.startsWith('/small-claims-court-israel/#s=') && ks.k === 'flt' && ks.y === '4900' && ks.e === '2' && ks.p === '3800' && ks.v === '2026-09-14' && !ks.g, 'cross-link to the small-claims tool by its published keys: k=flt, y 4,900, e 2, p 3,800, v the flight day');
check(decodeState(U.ktanotLink(run({ demand: '2026-10-01' })).split('#')[1], KT_KEYS).g === '2026-10-01' && !decodeState(U.ktanotLink(n(14)).split('#')[1], KT_KEYS).y && U.nextActions(reg, ex).links[0].path.startsWith('/small-claims-court-israel/#s='), 'cross-link: the demand day travels as g; no compensation -> no y; the small-claims link comes first');
const evs = ex.events.filter((e) => e.kind !== 'start');
const icsText = ics(evs.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20261112') && icsText.includes('DTSTART;VALUE=DATE:20261206') && icsText.includes('DTSTART;VALUE=DATE:20300915') && (icsText.match(/BEGIN:VEVENT/g) || []).length === 3, 'ics: the refund day 12.11.2026, the reply (payment) day 6.12.2026, the limitation 15.9.2030');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('4,900') && s.details.includes('jt66-print'), 'print summary: result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('16.8.2012') && s.details.includes('14.7.2020') && s.details.includes('11.2.2025') && s.details.includes('1.1.2026'), 'what changed and when: 2012, the COVID order 2020, the war order 2025, the 2026 amounts');
check(s.details.includes('1,530') && s.details.includes('1,250') && s.details.includes('15,300') && s.details.includes('jt66-quote') && s.details.includes('6(א)(3), 8(ב)(1) ו־18'), 'the schedules (1,530 vs 1,250; 15,300) and the war order quoted');
const lt = U.letterText(reg, ex, { name: 'דנה כהן', airline: 'חברה לדוגמה', booking: 'AB12CD' }, '2026-10-22');
check(lt.includes('סעיף 3(א)(4)') && lt.includes('סעיף 3(א)(2)') && lt.includes('סעיף 6(ז)') && lt.includes('סעיף 17') && lt.includes('4,900') && lt.includes('3,800') && lt.includes('דנה כהן') && lt.includes('AB12CD'), 'the demand letter: the sections, the amounts, the typed name and booking (in the page only)');
check(!U.stateOf(EX).includes('AB12CD') && !U.letterText(reg, ex).includes('undefined') && U.letterText(reg, ex).includes('[שם הנוסע/ת]') && !/data-ts-letter="[a-z]+" value="[^"]+"/.test(s.details), 'the letter: placeholders when nothing is typed; the snapshot has empty letter fields; the state never carries them');
const st = U.stateOf(Object.assign({}, EX, { event: 'delay', hours: 9.5, notice: '2026-09-10', km: 3200, leg: 'back', choice: 'alt', offered: true, early: 1, late: 3, exempt: 'extraordinary', demand: '2026-10-01', pkg: true, cls: 'business', foreign: true, order: true }));
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.event === 'delay' && back.hours === 9.5 && back.notice === '2026-09-10' && back.km === 3200 && back.leg === 'back' && back.choice === 'alt' && back.offered && back.early === 1 && back.late === 3 && back.exempt === 'extraordinary' && back.demand === '2026-10-01' && back.pkg && back.cls === 'business' && back.foreign && back.order && back.pax === 2 && back.price === 1900, 'share state: stateOf -> decodeState -> inputOf round trip');
const link = U.stateLink(reg, EX);
const fromLink = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/law-compensation-cancellation-2012/#s=') && fromLink.flight === EX.flight && E.tsCompute(reg, Object.assign(fromLink, { today: EX.today })).total === ex.total, 'stateLink: /law-compensation-cancellation-2012/#s=..., decodes to the same input and the same 4,900');
check(!/[א-ת]/.test(st) && !st.includes('@') && !/[א-ת]/.test(link), 'share state: numbers, dates and codes only, no Hebrew, no free text');
const dom = run({ type: 'domestic', line: 'north' });
check(dom.total === 360 && dom.amountBase && has(dom, 'domestic_base') && U.renderResult(reg, dom).includes('סכום הבסיס'), 'domestic: Sde Dov - Ein Yahav / Rosh Pina base 180 × 2 = 360, flagged as the 2013 base (reg. 3), never linked by the tool');
for (const r of [ex, d(2), d(6), d(9), n(14), xo, den(), den({ denied: 'health' }), dg({ down: 'be' }), dg({ price: '' }), run({ flight: '2023-11-01' }), run({ free: true }), l21, dom, adv(6, 3)]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r, { printedOn: '2026-10-22' }) + U.leadCard(reg, r) + U.aiBrief(reg, r) + U.letterText(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.tsBand(r)})`);
}
const errHtml = U.renderResult(reg, run({ flight: '' })) + U.leadCard(reg, run({ flight: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');
for (const k of Object.keys(U.PRESETS)) {
	const r = E.tsCompute(reg, U.tsPreset(k, '2026-10-22'));
	const expect = { cancel: 4900, delay9: 3670, delay6: 0, notice10: 0, denied: 6120 }[k];
	check(r.ok && r.total === expect, `preset ${k}: ${expect} ₪ (cancel 2 × 2,450; delay 9 h 1 × 3,670; delay 6 h refund only; notice 10 days + 1/3 hours exempt; denied 4 × 1,530, landing 5 h late: no halving)`);
}

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
