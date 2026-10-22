/**
 * Golden tests for the cancellation-rights checker (bitul-iska, the consumer-law wave, 22.10.2026, HAD-593).
 * Run: node tests/js/test-consumer-bitul.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Consumer Protection Law 1981
 * (Nevo, current to 30.9.2026: s.4ג, 13א1 + the fourth schedule item 2, 13ד(ג) 3 / 6 business days, 14 door-to-door 14 days,
 * 14ג distance 14 days, 2 and 7 days that are not rest days, 14ג(ד) exceptions, 14ג1 4 months, 14ג2, 14ה 14 days and the fee
 * 5% or 100 shekels, 14ט, 31א, 32 7 days), the Cancellation of Transaction Regulations 2010 (Nevo, current to 18.9.2023:
 * the schedule items, "goods" over 50 shekels, reg.2 windows, reg.4 7 business days, reg.5, reg.6 exceptions), the
 * Interpretation Law 1981 s.10(a)-(c), the Payment Services Law 2019 ss.34-35 (the Bank of Israel's text, current to
 * 1.10.2024), reg.small_claims (the court fee 1% rounded up to 5, minimum 50; 7 years). Weekdays: 22.10.2026 is a Thursday.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/bitul-engine.js';
import * as U from '../../assets/js/tools/bitul-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { isRestDay } from '../../assets/js/tools/dates.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.btCompute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const B = reg.consumer_bitul;
const has = (r, code) => r.flags.some((f) => f.code === code);
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;

/* ---------- 1. The registry ---------- */
check(B && B.checked_on === '2026-10-22' && B.next_update === '2027-03-22' && reg.registry_version >= '2026-10-22', 'registry: consumer_bitul checked 22.10.2026, next update 22.3.2027 (Amendment 74 in force)');
const urls = JSON.stringify(B).match(/https?:\/\/[^"]+/g) || [];
check(urls.length >= 10 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|www\.gov\.il|forms\.gov\.il|www\.boi\.org\.il|fs\.knesset\.gov\.il)\//.test(u)), `registry: all ${urls.length} source links are official (Nevo, gov.il, the Bank of Israel, the Knesset)`);
check(!/kolzchut|כל זכות|כל-זכות/.test(JSON.stringify(B)), 'registry: the private rights portal is never named');
check(B.fee.pct === 5 && B.fee.cap === 100 && B.fee.install_cap === 100 && B.fee.law_section === 'סעיף 14ה(ב)(1)' && B.fee.regs_section === 'תקנה 5(א)', 'registry: the fee 5% or 100 (s.14ה(ב)(1), reg.5(a)); installation up to 100');
check(B.distance.days === 14 && B.distance.service_before_nonrest === 2 && B.distance.travel_before_nonrest === 7 && B.distance.refund_days === 14 && B.door.days === 14, 'registry: s.14ג 14 days, 2 and 7 days that are not rest days, refund in 14 days (s.14ה); door-to-door 14 days');
check(B.special.months === 4 && B.special.senior_age === 65 && B.special.immigrant_years === 5 && B.special.in_force === '2016-08-27' && B.special.published === '2016-07-28', 'registry: s.14ג1 4 months, 65, 5 years; Amendment 47 published 28.7.2016, in force 30 days later (27.8.2016)');
check(B.store.min_price === 50 && B.store.jewel_max === 3000 && B.store.refund_business_days === 7 && B.store.before_service_nonrest === 14 && B.store.nonrest_days_after === 2 && B.store.exceptions.length === 12, 'registry: regs: goods over 50, jewellery 3,000, refund 7 business days, 14 days before a course, 2 days for clothing, 12 exceptions of reg.6(a)');
check(B.ongoing.end_business_days === 3 && B.ongoing.end_business_days_mail === 6 && B.gym.cap_pcts.join() === '25,20,17' && B.mislead.refund_days === 7 && B.psl.stop_business_days === 1 && B.psl.charge_cancel_business_days === 3, 'registry: s.13ד(ג) 3 / 6 business days; gym caps 25/20/17%; s.32(ב) 7 days; Payment Services Law s.34(b) 1 business day, s.35(a) 3');
check(reg.small_claims.fee.pct === 1 && reg.small_claims.fee.min === 50 && reg.small_claims.limitation_years === 7, 'reused reg.small_claims: the fee 1% min 50, 7 years');

/* ---------- 2. The example: bought online, a TV-type device 1,290, deal 8.10.2026, received 13.10.2026, today 22.10.2026 ---------- */
const ex = E.btCompute(reg, EX);
check(ex.ok && ex.route === 'distance' && ex.can === 'yes' && EX.deal === '2026-10-08' && EX.received === '2026-10-13', 'example: a distance sale (s.14ג), the right applies');
check(ex.last === '2026-10-27' && !ex.rolled && ex.section === 'סעיף 14ג(ג)(1)', 'example: 13.10.2026 + 14 days (the day of receipt not counted, Interpretation Law s.10(a)) = 27.10.2026, a Tuesday');
check(ex.fee === 64.5 && ex.refund === 1225.5, 'example: fee 5% × 1,290 = 64.50 (under the 100 cap); refund 1,290 − 64.50 = 1,225.50');
check(ex.refundDue === '2026-11-05' && ex.daysLeft === 5, 'example: notice today 22.10.2026 + 14 days = 5.11.2026 (s.14ה); 5 days left to 27.10');
check(ev(ex, 'limit') === '2033-11-05', 'example: a claim for the refund by the rule: 7 years from 5.11.2026 = 5.11.2033 (reg.small_claims)');

/* ---------- 3. The fee: exactly at the cap and around it ---------- */
check(E.btFee(reg, 2000) === 100 && E.btFee(reg, 2000.01) === 100 && E.btFee(reg, 1999) === 99.95 && E.btFee(reg, 2490) === 100 && E.btFee(reg, 349) === 17.45, 'fee: 2,000 -> 100 (5% = the cap); 2,000.01 -> 100; 1,999 -> 99.95; 2,490 -> 100; 349 -> 17.45');
check(run({ reason: 'defect', price: 899 }).fee === 0 && run({ reason: 'defect', price: 899 }).refund === 899 && run({ reason: 'defect' }).returnSection === 'סעיף 14ה(א)(2)', 'defect in a distance sale: no fee (s.14ה(א)(1)), 899 back; the business collects the goods where delivered (s.14ה(א)(2))');
check(run({ reason: 'late' }).fee === 0 && run({ reason: 'mismatch' }).fee === 0 && has(run({ reason: 'late' }), 'card_late'), 'not supplied on time / not as described: no fee; a card payment: the Payment Services Law s.17 stop');
const ch = run({ charged: 150 });
check(ch.excess === 85.5 && has(ch, 'excess'), 'the business deducted 150, the law allows 64.50: 85.50 is owed back');
const inst = run({ installed: true });
check(inst.install === 100 && inst.refund === 1125.5, 'installation at home: up to 100 (s.14ה(ב2)): 1,290 − 64.50 − 100 = 1,125.50');

/* ---------- 4. Rest days and the Interpretation Law ---------- */
const sat = run({ deal: '2026-10-05', received: '2026-10-10' });
check(sat.plain === '2026-10-24' && sat.last === '2026-10-25' && sat.rolled && has(sat, 'rest'), 'received 10.10.2026: + 14 = 24.10.2026, a Saturday, so the last day is Sunday 25.10.2026 (s.10(c))');
check(isRestDay('2026-09-21') && run({ deal: '2026-09-01', received: '2026-09-07', today: '2026-09-10' }).last === '2026-09-22', 'Yom Kippur: received 7.9.2026 + 14 = 21.9.2026 (10 Tishri), so the last day is 22.9.2026');
check(E.btAddMonths('2026-02-28', 4) === '2026-06-28' && E.btAddMonths('2026-10-31', 4) === '2027-02-28' && E.btAddMonths('2026-08-25', 4) === '2026-12-25', 'months by s.10(b): 28.2 + 4 = 28.6 (the same day number, not the month end); 31.10 + 4 = 28.2.2027; 25.8 + 4 = 25.12');
check(E.btAddBiz('2026-10-22', 3) === '2026-10-27' && E.btAddBiz('2026-10-22', 6) === '2026-11-01' && E.btAddBiz('2026-10-22', 7) === '2026-11-02', 'business days from Thursday 22.10.2026 (Sun-Thu, not rest days): 3 -> Tue 27.10; 6 -> Sun 1.11; 7 -> Mon 2.11');
check(E.btCutoff('2026-10-29', 2) === '2026-10-26' && E.btCutoff('2026-11-01', 7) === '2026-10-22', 'before a service: Thu 29.10 needs 2 non-rest days (28, 27) -> cancel by 26.10; Sun 1.11 needs 7 (30-25 and 23, Saturdays skipped) -> by 22.10');

/* ---------- 5. Distance: services, holidays, exceptions ---------- */
const once = run({ kind: 'service', deal: '2026-10-20', received: '', service: '2026-10-29' });
check(once.last === '2026-10-26' && once.cutoff === '2026-10-26' && has(once, 'cutoff'), 'a one-time service on 29.10: 14 days from 20.10 would be 3.11, but at least 2 days that are not rest days before it: 26.10');
const trip = run({ kind: 'travel', deal: '2026-10-15', received: '', service: '2026-11-01' });
check(trip.last === '2026-10-22' && trip.section === 'סעיף 14ג(ד)(2)' && trip.daysLeft === 0, 'a holiday on 1.11: not within 7 days that are not rest days before it (s.14ג(ד)(2)): 22.10 is the last day, today');
const close = run({ kind: 'travel', deal: '2026-10-22', received: '', service: '2026-10-25' });
check(close.can === 'no' && has(close, 'too_close'), 'a booking on 22.10 for 25.10: already within the 7 days, no right');
const cont = run({ kind: 'continuing', deal: '2026-10-12', received: '', doc: '2026-10-15' });
check(cont.last === '2026-10-29' && has(cont, 'proportional'), 'a continuing service: 14 days from the later of the deal and the document (15.10) = 29.10; the proportional payment (s.14ה(ב1))');
check(run({ kind: 'custom' }).can === 'no' && run({ kind: 'custom' }).section === 'סעיף 14ג(ד)(4)' && run({ kind: 'info' }).can === 'no' && run({ kind: 'media', opened: true }).can === 'no' && run({ kind: 'media' }).can === 'yes', 'distance exceptions: made to order (s.14ג(ד)(4)), information, recordable goods once opened; unopened recordable goods can be cancelled');
check(run({ kind: 'underwear', price: 120 }).can === 'yes' && run({ kind: 'underwear', price: 120 }).fee === 6, 'underwear online: no exception in s.14ג(ד): cancel, fee 6 (5% of 120)');
check(run({ kind: 'custom', reason: 'defect' }).route === 'remedy' && run({ kind: 'custom', reason: 'defect' }).fee === 0, 'a defective made-to-order item: not the cancellation right, the remedies route, no fee');
const notArrived = run({ received: '' });
check(notArrived.can === 'open' && notArrived.last === null && has(notArrived, 'doc'), 'goods not received yet: the window is open until 14 days after receipt');
const expired = run({ deal: '2026-09-01', received: '2026-09-03' });
check(expired.can === 'expired' && expired.last === '2026-09-17' && expired.fee === null && expired.refundDue === null, 'received 3.9.2026: the last day was 17.9.2026; today it has passed: no fee or refund computed');
const abroad = run({ kind: 'abroad', deal: '2026-10-10', received: '', service: '2026-12-01', abroadPolicy: true });
check(abroad.route === 'abroadPolicy' && abroad.can === 'check' && abroad.last === null, 'tourism fully abroad, the foreign provider\'s policy chosen (s.14ג2): its terms decide, no date computed');

/* ---------- 6. A person with a disability, a senior citizen, a new immigrant (s.14ג1) ---------- */
const sen = run({ buyer: 'senior', conversation: true, deal: '2026-08-20', received: '2026-08-25' });
check(sen.can === 'yes' && sen.last === '2026-12-25' && sen.special4 && sen.section === 'סעיף 14ג1(ג)' && has(sen, 'special'), 'a senior citizen, a phone deal: 4 months from receipt 25.8.2026 = 25.12.2026 (s.14ג1(ג), s.10(b))');
const noTalk = run({ buyer: 'senior', conversation: false, deal: '2026-08-20', received: '2026-08-25' });
check(noTalk.can === 'expired' && noTalk.last === '2026-09-08' && has(noTalk, 'no_talk'), 'a senior citizen without a conversation: the regular 14 days, 8.9.2026, passed');
const senTrip = run({ buyer: 'immigrant', conversation: true, kind: 'travel', deal: '2026-09-01', received: '', service: '2026-11-20' });
check(senTrip.last === '2026-11-11', 'a new immigrant\'s holiday on Friday 20.11: 4 months would be 1.1.2027, but s.14ג(ד)(2) also binds s.14ג1(ג): 7 non-rest days before (19-15 and 13-12) -> 11.11.2026');
const doorSen = run({ sale: 'door', buyer: 'disability', kind: 'home', deal: '2026-09-01', received: '2026-09-03' });
check(doorSen.last === '2027-01-03' && doorSen.section === 'סעיף 14ג1(ב)', 'door-to-door, a person with a disability: 4 months from 3.9.2026 = 3.1.2027 (s.14ג1(ב)), no conversation needed');
check(run({ sale: 'store', buyer: 'senior', kind: 'electric', price: 2490 }).last === '2026-10-27' && has(run({ sale: 'store', buyer: 'senior', kind: 'electric', price: 2490 }), 'not_store'), 'a senior citizen in a store: the 4 months do not apply (14 days, 27.10)');

/* ---------- 7. In a store (the regulations) ---------- */
const tv = run({ sale: 'store', kind: 'electric', price: 2490, channel: 'store' });
check(tv.route === 'regs' && tv.item.item === '3' && tv.last === '2026-10-27' && tv.fee === 100 && tv.refund === 2390 && tv.refundDue === '2026-11-02', 'store, an electrical device 2,490: item 3, 14 days from receipt (27.10); fee capped at 100; 2,390 back within 7 business days (2.11, reg.4(a))');
check(run({ sale: 'store', kind: 'electric', price: 50 }).route === 'policy' && run({ sale: 'store', kind: 'electric', price: 50.01 }).route === 'regs', 'the 50 floor: 50 is not "goods" (reg.1) -> the store\'s policy (s.4ג); 50.01 -> the regulations');
const shirt = run({ sale: 'store', kind: 'clothing', price: 349, deal: '2026-10-21', received: '' });
const shirtFri = run({ sale: 'store', kind: 'clothing', price: 349, deal: '2026-10-16', received: '', today: '2026-10-17' });
check(shirt.last === '2026-10-23' && shirtFri.last === '2026-10-19' && run({ sale: 'store', kind: 'clothing', price: 349, deal: '2026-10-21', received: '', tagOff: true }).can === 'no', 'clothing: bought Wed 21.10 -> Thu 22, Fri 23 (2 days that are not rest days); bought Fri 16.10 -> Sun 18, Mon 19; price tag removed -> no');
check(run({ sale: 'store', kind: 'jewelry', price: 3000, deal: '2026-10-21', received: '' }).route === 'regs' && run({ sale: 'store', kind: 'jewelry', price: 3001 }).can === 'no' && run({ sale: 'store', kind: 'watch', price: 4000 }).last === '2026-10-27', 'jewellery 3,000: item 22 (2 days); 3,001: reg.6(a)(11) no; a watch of 4,000: item 23, 14 days');
check(run({ sale: 'store', kind: 'electric', used: true }).can === 'no' && run({ sale: 'store', kind: 'electric', opened: true }).can === 'yes' && run({ sale: 'store', kind: 'sealed', opened: true }).route === 'policy', 'store: connected or used -> no (reg.2(1)); opening the box alone is not use; "sealed" goods once opened leave the list');
check(run({ sale: 'store', kind: 'underwear' }).section === 'תקנה 6(א)(9)' && run({ sale: 'store', kind: 'food' }).can === 'no' && run({ sale: 'store', vouchers: true }).section === 'תקנה 6(ג)' && run({ sale: 'store', late6: true }).section === 'תקנה 6(ב)' && run({ sale: 'store', kind: 'furniture', assembled: true }).section === 'תקנה 6(א)(1)', 'store exceptions: underwear 6(a)(9), food, vouchers 6(c), a delivery asked for after 6 months 6(b), furniture assembled at home 6(a)(1)');
const courseLate = run({ sale: 'store', kind: 'course', deal: '2026-10-15', received: '', service: '2026-11-11' });
check(courseLate.last === '2026-10-25' && courseLate.cutoffN === 14, 'a course from Wed 11.11 bought 15.10: 14 days would be 29.10, but 14 days that are not rest days before it (10.11 back to 26.10) -> 25.10');
const car = run({ sale: 'store', kind: 'car', price: 150000, deal: '2026-10-15', received: '' });
check(car.last === '2026-10-29' && car.fee === 100 && run({ sale: 'store', kind: 'car', price: 150000, deal: '2026-10-15', received: '', registered: true }).can === 'no', 'a new car from an importer: 14 days from the deal (29.10), fee 100; once registered, no (reg.2(6))');
check(run({ sale: 'store', kind: 'electric', reason: 'defect' }).route === 'remedy' && has(run({ sale: 'store', kind: 'electric', reason: 'defect' }), 'remedy_store'), 'a defect in a store: not the regulations (they are for a return without a defect): the remedies route');
check(has(tv, 'clearing') && tv.channels.length === 1 && tv.channels[0].code === 'store', 'store: the card clearing charge (reg.5(b)) flagged; notice at the store, s.14ט does not apply (s.14ט(ז))');
const evt = run({ sale: 'event', kind: 'service', deal: '2026-10-20', received: '', service: '2026-10-29' });
check(evt.route === 'regs' && evt.item.item === '20' && evt.last === '2026-10-26', 'a presentation event, a one-time service on 29.10: 14 days from the deal and up to 2 days that are not rest days before it: 26.10 (reg.2(5))');

/* ---------- 8. Door-to-door ---------- */
const door = run({ sale: 'door', kind: 'home', price: 4800, deal: '2026-10-10', received: '2026-10-12' });
check(door.last === '2026-10-26' && door.fee === 0 && door.refund === 4800 && door.refundDue === null && has(door, 'door_days'), 'door-to-door: 14 days from delivery 12.10 = 26.10; s.14(ב) allows no fee: 4,800 back; the law sets no refund day (flagged)');
check(run({ sale: 'door', kind: 'service', received: '', started: true }).can === 'no' && run({ sale: 'door', kind: 'perishable' }).section === 'סעיף 14(ג)', 'door-to-door: a one-time service that started -> no (s.14(א)(2)); perishable goods -> no (s.14(ג))');

/* ---------- 9. Ending a subscription; a gym; a standing order ---------- */
const sub = run({ sale: 'ongoing', kind: 'continuing', price: 99, deal: '2025-01-01', received: '', channel: 'email' });
const subMail = run({ sale: 'ongoing', kind: 'continuing', price: 99, deal: '2025-01-01', received: '', channel: 'mail' });
check(sub.end === '2026-10-27' && subMail.end === '2026-11-01' && sub.fee === null, 'a subscription ended on 22.10: 3 business days -> 27.10; by registered mail 6 -> 1.11 (s.13ד(ג))');
const gym = run({ sale: 'ongoing', kind: 'gym', fixedTerm: true, price: 3600, months: 12, deal: '2026-07-22', service: '2026-07-22', received: '', alt: 400 });
check(gym.end === '2026-11-22' && gym.gym.usedDays === 123 && gym.gym.used === 1213.15 && gym.gym.fullMonths === 4, 'gym, 12 months from 22.7.2026, notice 22.10: in force a month later, 22.11; used 9+31+30+31+22 = 123 of 365 days: 3,600 × 123 / 365 = 1,213.15; 4 whole months');
check(gym.gym.feeRaw === 400 && gym.gym.capPct === 25 && gym.gym.cap1 === 900 && gym.gym.remaining === 2386.85 && gym.fee === 400 && gym.refund === 1986.85, 'gym fee: 4 × (400 − 300) = 400; caps 25% (first third: 92/365) = 900 and the rest of the term 3,600 × 242 / 365 = 2,386.85; fee 400; refund 3,600 − 1,213.15 − 400 = 1,986.85');
check(run({ sale: 'ongoing', kind: 'gym', fixedTerm: true, price: 3600, months: 12, deal: '2026-07-22', service: '2026-07-22', alt: 1000 }).fee === 900 && run({ sale: 'ongoing', kind: 'gym', fixedTerm: true, price: 3600, months: 12, deal: '2026-07-22', service: '2026-07-22', alt: '' }).fee === 0, 'gym: alternative 1,000 -> 4 × 700 = 2,800, capped at 25% = 900; no alternative disclosed in writing -> no fee');
const gymLate = run({ sale: 'ongoing', kind: 'gym', fixedTerm: true, price: 3600, months: 12, deal: '2026-01-22', service: '2026-01-22', alt: 400 });
check(gymLate.gym.capPct === 17 && gymLate.gym.fullMonths === 10 && gymLate.gym.feeRaw === 1000 && gymLate.gym.cap1 === 612 && gymLate.fee === 601.64 && gymLate.refund === 0, 'gym from 22.1.2026, notice 22.10: 273/365 of the term gone, the last third: cap 17% = 612; 10 months × 100 = 1,000; the rest of the term 22.11.2026-22.1.2027 = 61 days: 3,600 × 61 / 365 = 601.64, the lowest; used 304 days = 2,998.36; refund 0');
const debit = run({ sale: 'ongoing', kind: 'continuing', pay: 'debit', price: 59, deal: '2025-03-01', received: '' });
check(debit.psl.stopBy === '2026-10-25' && debit.psl.relayBy === '2026-10-26' && has(debit, 'debit') && ev(debit, 'psl_stop') === '2026-10-25', 'a standing order cancelled Thu 22.10: stopped within 1 business day (Sun 25.10, s.34(b)); relayed within 2 (Mon 26.10)');
check(has(run({ sale: 'ongoing', kind: 'continuing', deal: '2026-10-15', received: '' }), 'fresh'), 'a subscription made 7 days ago: the 14-day right may still apply (flagged)');

/* ---------- 10. Misleading (s.32) ---------- */
const mis = run({ reason: 'mislead' });
check(mis.route === 'mislead' && mis.fee === 0 && mis.refund === 1290 && mis.refundDue === '2026-10-29' && has(mis, 'regular') && has(mis, 'reasonable'), 'misleading: a reasonable time, no fee, all 1,290 back within 7 days of the notice (29.10, s.32(ב)); the regular window too');

/* ---------- 11. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ deal: '' }, 'deal') && err({ deal: '31.2.2026' }, 'deal') && err({ deal: '2026-10-23' }, 'deal'), 'error: an empty, impossible or future deal day');
check(err({ received: '2026-10-01' }, 'received') && err({ received: '2026-10-25' }, 'received') && err({ price: '' }, 'price') && err({ price: 0 }, 'price') && err({ price: -5 }, 'price'), 'error: received before the deal or after today; a price empty, zero or negative');
check(err({ sale: 'ongoing', kind: 'gym', fixedTerm: true, months: 0, received: '' }, 'months') && err({ sale: 'ongoing', kind: 'gym', fixedTerm: true, months: 1.5, received: '' }, 'months') && err({ alt: -1 }, 'alt') && err({ kind: 'travel', received: '', service: '' }, 'service'), 'error: a gym term of 0 or 1.5 months; a negative alternative price; a holiday without its date');

/* ---------- 12. Money for the next step: the small-claims fee ---------- */
check(E.btCourtFee(reg, 1225.5) === 50 && E.btCourtFee(reg, 7321) === 75 && E.btCourtFee(reg, 39900) === 400 && ex.claim.fee === 50, 'small-claims fee (reg.6(a) via reg.small_claims): 1,225.50 -> 12.26 -> 50 minimum; 7,321 -> 73.21 -> 75; 39,900 -> 399 -> 400');

/* ---------- 13. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.result.includes('27.10.2026') && s.sentence.includes('27.10.2026') && s.total === 1225.5 && s.sticky.includes('27.10.2026') && s.result.includes('1,225.50'), 'snapshot: the example figures (27.10.2026, 64.50, 1,225.50)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><bdi>27\.10\.2026<\/bdi><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת') && s.lead.includes('1,225.50'), 'lead card: the example\'s last day, the refund, the jump to the form');
check(s.form.includes('data-act="preset"') && (s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"'), 'form: 5 one-click profiles, the example pressed');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 19 && s.method.includes('jtool-cite'), 'page table: header + 18 rules with a caption; the method cites');
check((s.result.match(/class="jt64-c[ "]/g) || []).length === 29 && (s.result.match(/jt64-c--today/g) || []).length === 1 && (s.result.match(/jt64-c--last/g) || []).length === 1 && s.result.includes('jtool-visually-hidden'), 'the strip: 29 day cells (8.10 to 5.11), today and the last day marked once, a text equivalent');
check(s.result.includes('jt64-receipt') && s.result.includes('קבלה על הביטול') && /64\.50/.test(U.receipt(reg, ex)) && /jt64-r--total/.test(U.receipt(reg, ex)), 'the receipt: the fee as the only deduction, the refund as the total');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('27.10.2026') && br.includes('1,225.50') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול'), `aiBrief: ${words} words, the key figures, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=mediation') && s.result.includes('topic=contract-dispute') && handoffState('x', br, 'mediation').simulationPurpose === 'mediation', 'the brief under its h4; mediation, topic contract-dispute (the call with customer service)');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url === B.authority.page_url && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/')), 'next actions: the Authority first, then 2-4 internal links');
const KT_KEYS = ['a', 't', 'r', 'l', 'x', 'n', 'v', 'h', 's', 'k', 'p', 'f', 'q', 'c', 'u', 'y', 'e', 'o', 'g', 'w', 'i', 'j'];
const kt = decodeState(U.ktanotLink(ex).split('#')[1], KT_KEYS);
check(U.ktanotLink(ex).startsWith('/small-claims-court-israel/#s=') && kt.k === 'ref' && kt.p === '1225.5' && kt.v === '2026-10-08' && kt.g === '2026-10-22' && !kt.f, 'cross-link to small claims (its keys k, p, v, g): a refund not paid, 1,225.50, the deal day, the written notice day');
const ktx = decodeState(U.ktanotLink(ch).split('#')[1], KT_KEYS);
check(ktx.f === '85.5' && !ktx.p && !decodeState(U.ktanotLink(run({ channel: 'phone' })).split('#')[1], KT_KEYS).g, 'cross-link: an unlawful fee goes as f (85.50); a phone notice is not a written demand (no g)');
const PZ_KEYS = ['y', 'k', 'w', 'a', 'd', 'n', 'b', 'e', 'S', 'T', 'P', 'o', 'q', 'v', 'c', 'i', 'u', 'z', 'F', 'R', 'j', 'h', 'J', 'K', 'g', 'l', 'r', 's', 'C', 'Q', 'B', 'H', 'L', 'E', 'M', 'N', 'X', 'D', 'm', 'G', 'A', 'O'];
const pz = decodeState(U.pitzuiLink(ex).split('#')[1], PZ_KEYS);
const pzFee = decodeState(U.pitzuiLink(ch).split('#')[1], PZ_KEYS);
const pzSub = decodeState(U.pitzuiLink(subMail).split('#')[1], PZ_KEYS);
const pzDoor = decodeState(U.pitzuiLink(door).split('#')[1], PZ_KEYS);
check(U.pitzuiLink(ex).startsWith('/consumer-rights-israel/#s=') && pz.y === 'r' && !pz.k && pz.a === '1290' && pz.d === '2026-10-08' && pz.n === '2026-10-22' && pzFee.y === 'f' && pzFee.e === '150' && pzSub.y === 's' && pzSub.H === 'r' && pzDoor.k === 'h' && U.nextActions(reg, ex).links.some((x) => x.path.startsWith('/consumer-rights-israel/#s=')), 'cross-link to the remedy tool (its keys y, k, a, d, n, e, H): a refund not paid; a fee above the law (150 taken); a subscription by registered mail; door-to-door');
const letter = U.noticeText(reg, ex);
check(letter.includes('סעיף 14ג(ג)(1) לחוק הגנת הצרכן, התשמ"א-1981') && letter.includes('64.50') && letter.includes('5.11.2026') && letter.includes('[שם מלא]') && letter.includes('[מספר זהות]') && letter.includes('סעיף 14ט(ג)') && letter.includes('סעיף 14ט(א)(3)'), 'the notice: the section with the law\'s exact name, the fee cap, the refund day, the channel section, placeholders for name and ID (s.14ט(ג))');
const mine = U.noticeText(reg, ex, { name: 'ישראלה ישראלי', id: '123456782', biz: 'חנות לדוגמה', order: 'A-778' });
const st = U.stateOf(Object.assign({}, EX, { name: 'ישראלה ישראלי', id: '123456782', biz: 'חנות לדוגמה' }));
check(mine.includes('ישראלה ישראלי') && mine.includes('123456782') && mine.includes('A-778') && !st.includes('123456782') && !/[א-ת]/.test(st) && !U.aiBrief(reg, ex).includes('ישראלה'), 'privacy: the typed name, ID and business go into the notice only; never into the share state or the brief');
check(U.noticeText(reg, gym).includes('התוספת הרביעית') && U.noticeText(reg, gym).includes('22.11.2026') && U.noticeText(reg, sub).includes('סעיף 13ד(ג)') && U.noticeText(reg, tv).includes('תקנה 2 לתקנות הגנת הצרכן (ביטול עסקה), התשע"א-2010'), 'the notice by route: the gym (the fourth schedule, 22.11.2026), a subscription (s.13ד(ג)), a store (reg.2 with the regulations\' exact name)');
const icsText = ics(ex.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20261027') && icsText.includes('DTSTART;VALUE=DATE:20261105') && (icsText.match(/BEGIN:VEVENT/g) || []).length === ex.events.length, 'ics: the last day 27.10.2026 and the refund day 5.11.2026, one event each');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('27.10.2026') && s.details.includes('jt64-print'), 'print summary: the result, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('14.12.2010') && s.details.includes('27.8.2016') && s.details.includes('6.2.2019') && s.details.includes('14.10.2020') && s.details.includes('22.3.2027'), 'what changed and when: the regulations 14.12.2010, Amendment 47 27.8.2016, Amendment 58 6.2.2019, the Payment Services Law 14.10.2020, Amendment 74 22.3.2027');
const sl = U.stateLink(reg, Object.assign({}, EX, { buyer: 'senior', conversation: true, opened: true, charged: 150, doc: '2026-10-14', channel: 'mail' }));
const back = U.inputOf(decodeState(sl.split('#')[1], U.KEYS));
check(sl.startsWith('/bitul-iska/#s=') && back.sale === 'distance' && back.kind === 'electric' && back.buyer === 'senior' && back.conversation && back.opened && !back.used && back.charged === 150 && back.doc === '2026-10-14' && back.channel === 'mail' && back.price === 1290 && back.deal === EX.deal && back.received === EX.received, 'stateLink: /bitul-iska/#s=..., decodeState + inputOf round trip with the flags');
const g2 = U.inputOf(decodeState(U.stateOf(Object.assign({}, EX, { sale: 'ongoing', kind: 'gym', fixedTerm: true, months: 12, alt: 400, deal: '2026-07-22', service: '2026-07-22' })), U.KEYS));
check(g2.received === '' && g2.sale === 'ongoing' && g2.kind === 'gym' && g2.fixedTerm && g2.months === 12 && g2.alt === 400 && g2.service === '2026-07-22' && E.btCompute(reg, Object.assign(g2, { today: '2026-10-22' })).ok, 'share state of a gym: the term, the alternative price and the first day survive the round trip');
for (const r of [ex, ch, inst, sat, once, trip, close, cont, notArrived, expired, abroad, sen, noTalk, senTrip, doorSen, tv, shirt, car, evt, door, sub, gym, debit, mis]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r) + U.leadCard(reg, r) + U.aiBrief(reg, r) + U.noticeText(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.btBand(r)})`);
}
const errHtml = U.renderResult(reg, run({ deal: '' })) + U.leadCard(reg, run({ deal: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
