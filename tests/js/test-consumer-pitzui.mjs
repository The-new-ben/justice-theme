/**
 * Golden tests for the consumer's remedy and compensation calculator (pitzui-tzarchan, the consumer-law wave, 22.10.2026).
 * Run: node tests/js/test-consumer-pitzui.mjs
 *
 * Every expected value is computed by hand from the official texts read on 22.10.2026: the Consumer Protection Law 1981
 * (Nevo, consolidated to 30.9.2026: s.4ג(ב) 7 days, s.13(ב) two weeks / shekel interest, s.13א(ב)-(ג) 60-30 days and 21 days,
 * s.13ד(ג) 3 business days / 6 by registered mail, s.13ד1 10 + 4 business days, 21 business days, 16 ₪, s.14ה(א)-(ב) 14 days,
 * 5% or 100 ₪, s.17ב(ד) the shown price, s.18א(ג)-(ד) 2 hours, 300 / 600 ₪, s.31א(א) 10,000 ₪, (ג) 50,000 ₪, s.32(ב)
 * 7 days, s.22ג 25,950 / 8,260, 53,070 / 29,490, 75,620 / 42,030, s.22ד x1.5, s.22י 1/50 a day and half), the Warranty and
 * After-Sale Service Regulations 2006 (reg.1 one year and 150 ₪; reg.10 7 / 10 / 14 days, 3 weeks under reg.19; reg.10(ד)
 * Saturdays and holidays not counted; the second schedule 1 / 2 / 3 days), the Cancellation of Transaction Regulations 2010
 * (reg.4(א) 7 business days, reg.5(א) 5% or 100 ₪), reg.small_claims (39,900 from 1.1.2026, 1% rounded up to 5 ₪, at least
 * 50 ₪, 7 years) and reg.interest (shekel 5.74% from 1.7.2026, 5.36% from 1.10.2026), the Authority's 2024 report (44,612).
 * Business days leave out Friday, Saturday and the statutory rest days (the law does not define them; the page says so).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/pitzui-engine.js';
import * as U from '../../assets/js/tools/pitzui-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const T = '2026-10-22';
const run = (over) => E.pzCompute(reg, U.pzInput(Object.assign({}, U.pzPreset('refund', T), over)));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const R = reg.consumer_pitzui;
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;
const has = (list, code) => list.some((x) => x.code === code);
const line = (r, code) => (r.lines.find((l) => l.code === code) || {}).amount;

/* ---------- 1. The registry ---------- */
check(R && R.checked_on === '2026-10-22' && R.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: consumer_pitzui checked 22.10.2026, next update 1.1.2027 (the sanctions update every 1 January, s.22ט(ב))');
const urls = JSON.stringify(R).match(/https?:\/\/[^"]+/g) || [];
check(urls.length >= 8 && urls.every((u) => /^https:\/\/(www\.nevo\.co\.il|www\.gov\.il|govforms\.gov\.il)\//.test(u)), `registry: all ${urls.length} source links are official (Nevo, gov.il, govforms.gov.il)`);
check(!/kolzchut|כל זכות|כל-זכות/.test(JSON.stringify(R)), 'registry: the private rights portal is never named');
check(R.comp31a.max === 10000 && R.comp31a.max_aggravated === 50000 && R.comp31a.paras.length === 15 && R.comp31a.section === 'סעיף 31א(א)', 's.31א: 10,000 ₪, 50,000 ₪ under (ג), 15 paragraphs (1, 1א, 2, 2א, 2ב, 2ב1, 2ג, 3, 4, 4א, 4ב, 5, 6, 7, 8)');
check(R.distance.refund_days === 14 && R.distance.fee_pct === 5 && R.distance.fee_max === 100 && R.store_regs.refund_business_days === 7 && R.mislead_cancel.refund_days === 7 && R.map.return_policy_days === 7, 's.14ה: 14 days, 5% or 100 ₪; regs 4-5: 7 business days; s.32(ב) and s.4ג(ב): 7 days');
check(R.continuing.end_business_days === 3 && R.continuing.end_registered_days === 6 && R.continuing.excess_check_days === 10 && R.continuing.excess_refund_days === 4 && R.continuing.excess_answer_days === 21 && R.continuing.excess_expenses === 16, 's.13ד(ג) 3 / 6 business days; s.13ד1 10 + 4 and 21 business days, 16 ₪');
check(R.tech.wait_hours === 2 && R.tech.tiers.map((t) => `${t.over_wait_hours}:${t.amount}`).join() === '2:300,3:600' && R.tech.phone_amount === 300, 's.18א(ג)-(ד): 2 hours of waiting; 300 ₪ two hours past it, 600 ₪ three hours past it; 300 ₪ for the phone wait');
const S = R.sanctions;
check(S.tiers.a.corp === 25950 && S.tiers.a.person === 8260 && S.tiers.b.corp === 53070 && S.tiers.b.person === 29490 && S.tiers.b1.corp === 75620 && S.tiers.b1.person === 42030 && S.aggravated_x === 1.5 && S.continuing_fraction === 50 && S.repeat_half === 0.5 && S.order_x === 3, 's.22ג-22י: the three tiers as in the consolidated text; x1.5 aggravated, 1/50 a day, half for a repeat, x3 for an order');
const Wr = R.warranty;
check(Wr.years === 1 && Wr.min_price === 150 && Wr.home_days === 7 && Wr.station_days === 10 && Wr.shop_days === 14 && Wr.seller_days === 21 && Wr.seller_price === 400 && Wr.parts_price === 300 && Wr.home.length === 10 && Wr.home.find((h) => h.code === 'heater').days === null, 'warranty regulations: 1 year, over 150 ₪, 7 / 10 / 14 / 21 days, 400 ₪, 300 ₪; 10 home items, the heater without a figure');
check(R.authority.inquiries === 44612 && R.authority.inquiries_prev === 37003 && R.authority.charge_amount === 16829275 && R.authority.page_updated === '2026-08-09', 'the Authority: 44,612 inquiries in 2024 (37,003 in 2023); 16,829,275 ₪ in 44 charge notices; the service page of 9.8.2026');
check(reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount === 39900 && reg.interest.shekel.find((x) => x.from === '2026-10-01').rate === 5.36, 'reused: the small-claims ceiling 39,900 and the shekel rate 5.36% from 1.10.2026');

/* ---------- 2. The example: an online order of 1,800 ₪ cancelled, the business got the notice on 1.10.2026 ---------- */
const ex = E.pzCompute(reg, U.pzInput(U.EXAMPLE));
check(ex.ok && U.EXAMPLE.today === T && U.EXAMPLE.notice === '2026-10-01' && U.EXAMPLE.date === '2026-09-25' && U.EXAMPLE.price === 1800, 'example: 1,800 ₪, ordered 25.9.2026, the notice received 1.10.2026, today 22.10.2026');
check(ex.x.lawfulFee === 90 && line(ex, 'fee_ok') === 90 && ex.owed === 1710, 'example: the fee may be 5% of 1,800 = 90 (under 100), so the business owes 1,800 - 90 = 1,710 ₪ (s.14ה(ב)(1))');
check(ex.due === '2026-10-15' && ex.late === 7, 'example: 1.10.2026 + 14 days = 15.10.2026; 7 days late on 22.10.2026');
check(ex.c31.para === '4' && ex.c31.max === 10000 && ex.c31.demandOk && ex.c31.auto && !has(ex.flags, 'demand'), 'example: s.31א(א)(4), up to 10,000 ₪; the cancellation itself is the written request (s.31א(ב))');
check(ex.sanction.para === '22ג(ב)(16)' && ex.sanction.corp === 53070 && ex.path[2].fee === 50 && ex.claim === 1710, 'example: the sanction row 22ג(ב)(16) (53,070 ₪ for a company); a small claim of 1,710 ₪ pays the 50 ₪ minimum (1% = 17.10 -> 20 -> 50)');
check(ev(ex, 'limit') === '2033-10-02' && new Date('2033-10-01T00:00:00Z').getUTCDay() === 6, 'example: 7 years from 1.10.2026 = 1.10.2033, a Saturday, so 2.10.2033');

/* ---------- 3. Refund and fee: the four sales ---------- */
check(run({ reason: 'breach' }).owed === 1800 && run({ reason: 'breach' }).x.lawfulFee === 0, 'distance, cancelled for a defect or late supply: no fee at all, the whole 1,800 ₪ (s.14ה(א)(1))');
check(run({ price: 2500 }).x.lawfulFee === 100 && run({ price: 2500 }).owed === 2400 && run({ price: 1000 }).x.lawfulFee === 50, 'the fee: 5% of 2,500 = 125, capped at 100 -> 2,400 ₪; 5% of 1,000 = 50');
check(run({ refunded: 1500 }).owed === 210, 'partly refunded: 1,800 - 90 - 1,500 = 210 ₪');
const fee = run({ case: 'fee', price: 2500, fee: 250 });
check(fee.ok && line(fee, 'fee_back') === 150 && fee.owed === 150 && U.ktanotLink(fee).includes('/f150'), 'fee case: 250 ₪ kept on 2,500 where 100 is allowed -> 150 ₪ back; the small-claims head f150');
check(run({ case: 'fee', price: 2500, fee: 80 }).owed === 0, 'fee case: 80 ₪ under the 100 ₪ cap -> nothing owed');
const store = run({ sale: 'store', price: 400, notice: '2026-10-15' });
check(store.due === '2026-10-26' && store.x.lawfulFee === 20 && store.owed === 380 && !store.c31 && store.sanction.para === '22ג(א)(26)' && has(store.flags, 'store_no31a'), 'in store (regs): Thu 15.10.2026 + 7 business days without Fri/Sat = 26.10.2026; fee 5% of 400 = 20; 380 ₪; no s.31א; sanction 22ג(א)(26)');
const door = run({ sale: 'door' });
check(door.due === null && door.c31.para === '3' && !door.c31.demandOk && has(door.flags, 'door_days') && door.sanction.para === '22ג(ב)(15)', 'door-to-door: the law sets no number of days; s.31א(א)(3) needs a written demand first; sanction 22ג(ב)(15)');
const pol = run({ sale: 'policy', notice: '2026-10-20' });
check(pol.c31.para === '1' && ev(pol, 'policy_return') === '2026-10-27' && run({ sale: 'policy', notice: '2026-10-20', sign: 'no' }).c31.para === '2', 'return-policy sign: refused 20.10.2026 -> return by 27.10.2026 (s.4ג(ב)); para 1, or 2 when no sign was shown');
const mis = run({ case: 'mislead', notice: '2026-10-10', refunded: 0 });
check(mis.due === '2026-10-17' && mis.owed === 1800 && !mis.c31 && has(mis.flags, 'no31a') && run({ case: 'mislead', notice: '2026-10-10', place: true }).c31.para === '1a', 'misleading: refund within 7 days (10.10 -> 17.10.2026), the whole 1,800; s.31א only for the supply place (1א)');

/* ---------- 4. A defect under warranty (the 2006 regulations) ---------- */
const def = (over) => E.pzCompute(reg, U.pzInput(Object.assign({}, U.pzPreset('defect', T), { delivery: '2026-03-01', date: '2026-03-01', call: '2026-10-11', blocks: false }, over)));
check(def({ product: 'other', where: 'station' }).warranty.repairBy === '2026-10-22', 'service station: 10 days from Sun 11.10.2026 without Saturdays (Fridays count) = 22.10.2026 (reg.10(א), (ד))');
check(def({ product: 'other', where: 'home' }).warranty.repairBy === '2026-10-19' && def({ product: 'fridge' }).warranty.repairBy === '2026-10-19', 'at home: a week = 7 days without Saturdays from 11.10.2026 = 19.10.2026');
check(def({ product: 'other', where: 'shop' }).warranty.repairBy === '2026-10-27' && def({ product: 'other', where: 'station', seller: true }).warranty.repairBy === '2026-11-04', 'at the shop: 14 days = 27.10.2026; the seller (reg.19): 21 days = 4.11.2026');
check(def({ product: 'fridge', blocks: true, call: '2026-10-16' }).warranty.repairBy === '2026-10-18' && def({ product: 'stove', blocks: true, call: '2026-10-15' }).warranty.repairBy === '2026-10-18', 'second schedule: a fridge that does not cool, called Fri 16.10 -> Sun 18.10 (1 day, the Saturday not counted); a stove called Thu 15.10 -> 18.10 (2 days)');
const dlate = def({ product: 'other', where: 'home' });
check(dlate.c31 && dlate.c31.para === '8' && dlate.late === 3 && has(dlate.flags, 'late_repair') && dlate.lead.kind === 'date', 'not repaired by 19.10.2026: 3 days late on 22.10.2026; s.31א(א)(8); the lead is the law\'s date');
const dok = def({ product: 'other', where: 'home', fixed: '2026-10-18' });
check(!dok.c31 && !dok.warranty.lateRepair && def({ product: 'other', where: 'home', fixed: '2026-10-18', nocert: true }).c31.para === '7', 'repaired on 18.10 (in time): no s.31א; without a warranty certificate: s.31א(א)(7)');
check(!def({ call: '2027-03-02' }).ok && def({ call: '2027-03-02' }).errors[0].field === 'call', 'error: a repair call after today');
const out = E.pzCompute(reg, U.pzInput(Object.assign({}, U.pzPreset('defect', '2027-03-05'), { delivery: '2026-03-01', date: '2026-03-01', call: '2027-03-02' })));
check(!out.warranty.inWarranty && has(out.flags, 'out') && out.warranty.end === '2027-03-01' && !has(out.gives, 'repair'), 'a year from 1.3.2026 ends 1.3.2027: a defect found on 2.3.2027 is outside the regulations\' warranty');
check(has(def({ price: 120 }).flags, 'cheap') && def({ product: 'stove' }).warranty.parts === '2033-03-01' && def({ price: 3200 }).warranty.parts === '2028-03-01' && def({ price: 250, product: 'other' }).warranty.parts === null, 'below 150 ₪ flagged; spare parts: a stove 7 years (1.3.2033), over 300 ₪ a year after the warranty (1.3.2028), 250 ₪ only to its end');
check(has(def({ failed: true }).flags, 'failed') && def({ failed: true }).flags.find((f) => f.code === 'failed').he.includes('3,200'), 'a repair that did not restore it: new goods or the price back (3,200 ₪), at the producer\'s choice (reg.6(ג))');

/* ---------- 5. The technician (s.18א(ד)) ---------- */
const tech = (wait, phone) => E.pzCompute(reg, U.pzInput(Object.assign({}, U.pzPreset('tech', T), { wait, phone: Boolean(phone) })));
check(tech(3.9).owed === 0 && tech(4).owed === 300 && tech(4.9).owed === 300 && tech(5).owed === 600 && tech(8).owed === 600, 'technician: 3.9 hours late = 0; 4 hours (2 past the 2-hour wait) = 300 ₪; 5 hours = 600 ₪; 8 hours still 600 ₪');
check(tech(5, true).owed === 900 && !tech(5).c31 && has(tech(5).flags, 'tech_except'), 'the phone-wait breach adds 300 ₪ (s.18א(ד)(2)); the sum is fixed by the section itself, not s.31א; the unforeseeable exception flagged');

/* ---------- 6. Not supplied on time (s.13(ב), shekel interest through the existing interest engine) ---------- */
const late = (over) => E.pzCompute(reg, U.pzInput(Object.assign({ case: 'late', today: T, date: '2026-08-20', price: 2000, lsale: 'distance' }, over)));
const l1 = late({ agreed: '2026-09-01' });
check(l1.ok && l1.supply.trigger === '2026-09-15' && line(l1, 'interest') === 15.6, 'late: agreed 1.9.2026, not supplied by 15.9: shekel interest on 2,000 from 1.9 to 22.10 = 2,000 x 5.74% x 30/365 (9.4356) + 2,000 x 5.36% x 21/365 (6.1677) = 15.60 ₪');
check(!line(late({ agreed: '2026-09-01', supplied: '2026-09-10' }), 'interest') && has(late({ agreed: '2026-09-01', supplied: '2026-09-10' }).flags, 'not_yet'), 'late: supplied on 10.9, within two weeks of 1.9: no interest');
check(!line(late({ agreed: '' }), 'interest') && has(late({ agreed: '' }).flags, 'no_date') && late({ agreed: '' }).supply.trigger === '2026-10-20', 'late without an agreed date: the duty arises 2 months from the payment (20.10.2026), but the section counts from "the agreed day": no interest number');
check(has(late({ agreed: '2026-09-01' }).gives, 'cancel') && has(late({ agreed: '2026-09-01', lsale: 'store' }).flags, 'store_late'), 'late, distance: may cancel with no fee (s.14ה(א)); in a shop: the Contracts law in words');

/* ---------- 7. The shown price, the subscription, the excess charge ---------- */
const price = E.pzCompute(reg, U.pzInput(U.pzPreset('price', T)));
check(price.owed === 30 && price.c31.para === '5' && price.sanction.para === '22ג(א)(38)', 'price: 2 x (64.90 - 49.90) = 30 ₪ (s.17ב(ד)); s.31א(א)(5); sanction 22ג(א)(38)');
const sub = (over) => E.pzCompute(reg, U.pzInput(Object.assign({}, U.pzPreset('sub', T), over)));
const s1 = sub({ notice: '2026-07-19' });
check(s1.sub.end === '2026-07-22' && s1.owed === 267 && s1.c31.para === '2b' && s1.c31.auto && s1.late === 0, 'subscription: notice Sun 19.7.2026 by e-mail -> ends Wed 22.7.2026 (3 business days); 3 x 89 = 267 ₪; s.31א(א)(2ב), the notice is the request');
check(sub({ notice: '2026-07-19', channel: 'registered' }).sub.end === '2026-07-27' && sub({ notice: '2026-07-19', later: '2026-08-01' }).sub.end === '2026-08-01', 'registered mail: 6 business days, Fri 24 and Sat 25 not counted -> 27.7.2026; a later end the reader asked for wins');
const oral = sub({ notice: '2026-07-19', channel: 'phone' });
check(!oral.c31.demandOk && has(oral.flags, 'demand') && has(oral.flags, 'oral'), 'a phone cancellation ends the deal, but s.31א(ב) then needs a written request');
const fixed = sub({ subkind: 'ended', end: '2026-09-30', monthly: 120, charges: 2 });
check(fixed.owed === 240 && fixed.c31.para === '2a' && ev(fixed, 'sms') === '2026-09-09' && ev(fixed, 'fixed_notice_from') === '2026-08-01' && fixed.sanction.para === '22ג(ב)(8)', 'fixed period ended 30.9.2026: 2 x 120 = 240 ₪; s.31א(א)(2א); the SMS 21 days before (9.9) and the notice period from 60 days before (1.8)');
const exc = E.pzCompute(reg, U.pzInput({ case: 'excess', today: T, excess: 120, xcharged: '2026-09-01', claimed: '2026-10-04' }));
check(exc.excess.check === '2026-10-18' && exc.excess.refundBy === '2026-10-22' && exc.excess.answer === '2026-11-02', 'excess charge: claimed Sun 4.10.2026 -> checked by 18.10 (10 business days), refunded by 22.10 (4 more), answered by 2.11.2026 (21 business days)');
check(line(exc, 'excess_interest') === 0.94 && line(exc, 'excess_expenses') === 16 && exc.owed === 136.94 && exc.c31.para === '2b1', 'excess: 120 + shekel interest 1.9-22.10 (0.5661 + 0.3701 = 0.94) + 16 ₪ = 136.94 ₪; s.31א(א)(2ב1)');

/* ---------- 8. s.31א amounts, the ceiling, the fee ---------- */
check(has(run({ comp: 12000 }).flags, 'over_max') && !run({ comp: 60000 }).ok && run({ comp: 3000 }).claim === 4710, 's.31א: 12,000 asked is flagged (over 10,000 only under (ג)); 60,000 is an error; 3,000 asked -> a claim of 1,710 + 3,000 = 4,710');
const big = run({ price: 45000 });
check(big.owed === 44900 && has(big.flags, 'ceiling') && big.path[2].fee === 450 && big.path[2].overCeiling, 'a claim of 44,900 ₪ is over the 39,900 ceiling (flagged); its fee 1% = 449 -> rounded up to 450');
check(E.pzClaimFee(reg, 7320) === 75 && E.pzClaimFee(reg, 39900) === 400 && E.pzClaimFee(reg, 100) === 50, 'fee: 7,320 -> 73.20 -> 75; 39,900 -> 399 -> 400; 100 -> the 50 ₪ minimum');

/* ---------- 9. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ notice: '' }, 'notice') && err({ notice: '2026-10-23' }, 'notice') && err({ notice: '2026-09-20' }, 'notice') && err({ notice: '31.2.2026' }, 'notice'), 'error: the notice day empty, in the future, before the deal, impossible');
check(err({ price: '' }, 'price') && err({ price: -5 }, 'price') && err({ refunded: 2000 }, 'refunded') && err({ case: 'fee', fee: 1900 }, 'fee'), 'error: no price, a negative price, a refund above the price, a fee above the price');
check(!tech(25).ok && !E.pzCompute(reg, U.pzInput(Object.assign({}, U.pzPreset('price', T), { charged: 40 }))).ok && !sub({ charges: -1 }).ok && !E.pzCompute(reg, U.pzInput({ case: 'excess', today: T, excess: 120, xcharged: '2026-10-05', claimed: '2026-10-04' })).ok, 'error: 25 hours, a till price under the shown price, negative charges, a complaint before the charge');

/* ---------- 10. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.total === 1710 && s.sticky.includes('1,710.00') && s.result.includes('15.10.2026') && s.sentence.includes('1,710'), 'snapshot: the example figures (1,710 ₪, 15.10.2026)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><span class="jtool-amt"><bdi>1,710<\/bdi> ₪<\/span><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('דוגמה מחושבת') && s.lead.includes('10,000'), 'lead card: 1,710 ₪, the law\'s day, the s.31א maximum, the jump to the form');
check((s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"') && (s.form.match(/name="jt67-case"/g) || []).length === 9, 'form: 5 one-click profiles with the example pressed; 9 "what happened" cases');
check((s.result.match(/class="jt67-rung /g) || []).length === 3 && s.result.includes('jt67-slip__total') && s.result.includes('לא בסכום') && s.result.includes('22ג(ב)(16)'), 'the picture: a 3-rung ladder and the receipt with its total; the s.31א maximum and the sanction under the rule, outside the total');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr>/g) || []).length === 12 && s.method.includes('jtool-cite'), 'page table: header + 11 remedies with a caption; the method cites');
check(s.details.includes('25,950') && s.details.includes('53,070') && s.details.includes('75,620') && (U.c31Table(reg, ex).match(/<tr/g) || []).length === 16 && U.c31Table(reg, ex).includes('jt67-mine'), 'details: the sanctions tiers; the s.31א table with 15 paragraphs, the reader\'s marked');
check(s.details.includes('44,612') && s.details.includes('1.1.2015') && s.details.includes('1.1.2026') && s.details.includes('1.8.1981'), 'what changed and when: dated official rows (1.8.1981, 1.1.2015, 2024, 1.1.2026)');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('1,710') && br.includes('10,000') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.trim().endsWith('?'), `aiBrief: ${words} words, the key figures, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=mediation') && s.result.includes('topic=contract-dispute') && handoffState('x', br, 'mediation').simulationPurpose === 'mediation', 'the brief under its h4; mediation on the contract-dispute topic');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url === R.authority.complaint_url && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/')), 'next actions: the Authority\'s complaint service first, then 2-4 internal links');
const KT = ['a', 't', 'r', 'l', 'x', 'n', 'v', 'h', 's', 'k', 'p', 'f', 'q', 'c', 'u', 'y', 'e', 'o', 'g', 'w', 'i', 'j'];
const kt = decodeState(U.ktanotLink(Object.assign({}, ex, { demand: '2026-10-16', c31: Object.assign({}, ex.c31, { asked: 3000 }) })).split('#')[1], KT);
check(U.ktanotLink(ex).startsWith('/small-claims-court-israel/#s=') && kt.k === 'ref' && kt.p === '1710' && kt.c === '3000' && kt.u === '4' && kt.v === '2026-10-01' && kt.g === '2026-10-16', 'to the small-claims tool by its own keys (STATE-KEYS.md): k ref, p 1710, c 3000, u 4, v the event, g the demand');
check(decodeState(U.ktanotLink(dlate).split('#')[1], KT).k === 'def' && decodeState(U.ktanotLink(dlate).split('#')[1], KT).u === '8', 'a defect goes to the small-claims tool as k def with u 8');
const BT = ['s', 'k', 'b', 'r', 'p', 'y', 'n', 'd', 'c', 'o', 'v', 'x', 'f', 'm', 'a', 'g'];
const bt = decodeState(U.bitulLink(ex).split('#')[1], BT);
const btFee = decodeState(U.bitulLink(fee).split('#')[1], BT);
check(U.bitulLink(ex).startsWith('/bitul-iska/#s=') && bt.s === 'd' && bt.r === 'm' && bt.p === '1800' && bt.d === '2026-09-25' && bt.x === '2026-10-01' && btFee.g === '250' && decodeState(U.bitulLink(store).split('#')[1], BT).s === 't' && U.bitulLink(s1) === '/bitul-iska/', 'to the cancellation checker by its own keys (bitul-ui.js): s d, r m, p 1800, d the deal, x the notice, g the fee; a subscription without a deal day opens the page as it is');
const icsText = ics(ex.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20261015') && icsText.includes('DTSTART;VALUE=DATE:20331002') && (icsText.match(/BEGIN:VEVENT/g) || []).length === ex.events.length, 'ics: the computed dates (15.10.2026, 2.10.2033), one event each');
const pr = U.printSummary(reg, ex, T, { name: 'דנה', business: 'חנות', order: 'A1' });
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('1,710') && s.details.includes('jt67-print'), 'print summary: result, the letter, sources with the check date, the print date');
/* The letter: the reader's fields in the page only. */
const letter = U.letterText(reg, ex, { name: 'ישראלה כהן', business: 'חנות לדוגמה', order: 'ORD-55' });
check(letter.includes('ישראלה כהן') && letter.includes('ORD-55') && letter.includes('31א(ב)') && letter.includes('1,710') && letter.includes('15.10.2026') && letter.includes('הנדון:'), 'letter: the reader\'s fields, the sections, the amount and the day, the s.31א(ב) request');
check(U.letterText(reg, ex).includes('[שם מלא]') && U.letterText(reg, dlate).includes('לתקן את הקלקול') && U.letterText(reg, s1).includes('להפסיק מיד כל חיוב'), 'letter: placeholders when empty; a repair demand for a defect; stop charging for a subscription');
const st = U.stateOf(Object.assign({}, U.EXAMPLE, { name: 'ישראלה כהן', comp: 3000, demand: '2026-10-16' }));
const back = U.inputOf(decodeState(st, U.KEYS));
check(back && back.case === 'refund' && back.price === 1800 && back.notice === '2026-10-01' && back.comp === 3000 && back.demand === '2026-10-16' && !st.includes('ישראלה'), 'share state: stateOf -> decodeState -> inputOf round trip; the letter\'s name never enters it');
const others = ['defect', 'sub', 'price', 'tech'].map((k) => U.pzPreset(k, T));
check(others.every((i) => { const b2 = U.inputOf(decodeState(U.stateOf(i), U.KEYS)); return U.stateOf(Object.assign(b2, { today: T })) === U.stateOf(i); }), 'share state: every profile survives the round trip unchanged');
const link = U.stateLink(reg, U.EXAMPLE);
const fromLink = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/consumer-rights-israel/#s=') && E.pzCompute(reg, U.pzInput(Object.assign(fromLink, { today: T }))).owed === 1710, 'stateLink: /consumer-rights-israel/#s=..., decodes to the same input and the same 1,710 ₪');
check(!/[א-ת]/.test(st) && !st.includes('@') && !/[א-ת]/.test(link), 'share state: numbers, dates and codes only, no Hebrew, no free text');
const cases = [ex, fee, store, door, pol, mis, dlate, dok, out, tech(5, true), l1, price, s1, oral, fixed, exc, big];
for (const r of cases) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r) + U.leadCard(reg, r) + U.aiBrief(reg, r) + U.letterText(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.pzBand(r)})`);
}
const words2 = cases.map((r) => U.aiBrief(reg, r).split(/\s+/).length);
check(words2.every((n) => n >= 40 && n <= 90), `aiBrief within 40-90 words in every case (${words2.join(', ')})`);
const defaults = E.PZ_CASES.map((k) => E.pzCompute(reg, U.pzInput(U.pzCaseDefault(k, T))));
check(defaults.every((r) => r.ok && (r.owed > 0 || r.due)) && defaults.find((r) => r.case === 'fee').owed === 150 && defaults.find((r) => r.case === 'excess').owed > 136, `every one of the 9 cases has a first example that computes at once (${defaults.map((r) => `${r.case}:${r.owed}`).join(', ')})`);
const errHtml = U.renderResult(reg, run({ notice: '' })) + U.leadCard(reg, run({ notice: '' }));
check(errHtml.includes('צריך לתקן') && !bad(errHtml), 'an input error renders the message, never a raw value');
check(E.pzBand(ex) === 'refund-500-5000' && E.pzBand(tech(3)) === 'tech-none' && !/\d{3}/.test(E.pzBand(big).replace('5000plus', '')), 'analytics band: the case and a money band, never the amount');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
