/**
 * Golden tests for the closing ledger of an apartment deal (alut-iska, the family + land wave, 21.10.2026, HAD-579).
 * Run: node tests/js/test-fl-iska.mjs
 *
 * Every expected amount is computed by hand from the official texts: the Land (Fees) Regulations 1974 as in force from
 * 1.1.2026 (sale 44, item 1; warning note 188, item 13(א)(1); mortgage 188, item 2(א); mortgage deletion free when the
 * bank is paid directly, item 2(ג)(1), 188 when deposited, 2(ג)(2); online extract 18, item 7(א2)), the Land Taxation
 * Law (single-home brackets of s.9(ג1ג)(3): 0% to 1,978,745, 3.5% to 2,347,040, 5% to 6,055,070; additional home 8%
 * under s.9(ג1ו); 30 days s.73, 60 days s.90א; the seller's advance 7.5% / 15% under s.15(ב)), the VAT order (18% from
 * 1.1.2025, 17% before) and the Bar's recommended minimum tariff (not binding, rule 2; items 11(1) and 11(9)(ג)).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/iska-engine.js';
import * as U from '../../assets/js/tools/iska-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const fl = reg.fl_iska;
const EX = U.EXAMPLE;
const buy = (over) => E.ikCompute(reg, Object.assign({}, EX, over));
const sell = (over) => E.ikCompute(reg, Object.assign({}, U.SELL_EXAMPLE, over));
const line = (r, id) => r.lines.find((l) => l.id === id);
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const near = (a, b) => Math.abs(a - b) < 0.005;

/* ---------- 1. The registry: every figure the engine reads exists and has its source ---------- */
check(fl && fl.checked_on === '2026-10-21' && fl.next_update === '2027-01-01' && fl.tabu.from === '2026-01-01', 'registry: fl_iska checked 21.10.2026; Land Registry fees in force from 1.1.2026; next update 1.1.2027 (reg. 2(ב))');
const F = fl.tabu.fees;
check(F.sale.amount === 44 && F.sale.item === 'פרט 1' && F.warning.amount === 188 && F.warning.item === 'פרט 13(א)(1)' && F.warning_delete.amount === 127, 'registry: sale 44 (item 1), warning note 188 (item 13(א)(1)), its deletion 127 (item 13(ב))');
check(F.mortgage.amount === 188 && F.mortgage_delete_direct.amount === 0 && F.mortgage_delete_deposit.amount === 188 && F.extract_online.amount === 18 && F.extract_counter.amount === 88, 'registry: mortgage 188 (2(א)), deletion free when paid directly (2(ג)(1)) or 188 deposited (2(ג)(2)), extract 18 online (7(א2)) and 88 at the counter (7(א))');
check([fl.tabu.url, fl.tabu.notice_url, fl.tabu.page_url, fl.bar.url, fl.bar.law_url, fl.ethics.url, fl.advance.law_url, fl.services.declare.url, fl.services.extract.url].every((u) => /^https:\/\/(www\.)?(nevo\.co\.il|gov\.il)\//.test(u)), 'registry: every source of fl_iska is an official https url (nevo / gov.il)');
check(fl.bar.binding === false && fl.bar.rule2_section === 'כלל 2' && fl.bar.drafting.brackets.length === 5 && fl.bar.drafting.top_min === 37761 && fl.bar.registration.threshold === 633967, 'registry: the Bar tariff is not binding (rule 2); item 11(1) has five bands and a 37,761 floor above 3,806,082; item 11(9)(ג) turns at 633,967');
check(fl.advance.pct_after === 7.5 && fl.advance.pct_before === 15 && fl.advance.cutoff === '2001-11-07', 'registry: the seller\'s advance 7.5% / 15% by the 7.11.2001 cut-off (s.15(ב))');
check(reg.purchase_tax.vat_pct === 18 && reg.purchase_tax.vat_from === '2025-01-01' && reg.purchase_tax.vat_prior.pct === 17 && reg.shevach.deadlines.declare_days === 30 && reg.shevach.deadlines.pay_days === 60, 'registry (reused): VAT 18% from 1.1.2025, 17% before; the seller\'s 30 / 60 days (ss.73(א), 90א)');

/* ---------- 2. The example: buying a single home at 2,400,000 on 15.11.2026, fee 0.5% + VAT, with a mortgage ---------- */
const r = buy({});
check(r.ok && near(r.tax.amount, 15538.33), `example tax: 368,295 x 3.5% = 12,890.325 + 52,960 x 5% = 2,648 = 15,538.33 (s.9(ג1ג)(3)) (${r.tax && r.tax.amount})`);
check(r.lawyer.net === 12000 && r.lawyer.vat === 2160 && r.lawyer.gross === 14160, 'example fee: 0.5% x 2,400,000 = 12,000 + 18% VAT 2,160 = 14,160');
check(line(r, 'extract_online').amount === 18 && line(r, 'warning').amount === 188 && line(r, 'mortgage').amount === 188 && line(r, 'sale').amount === 44, 'example Land Registry lines: extract 18 + warning note 188 + mortgage 188 + sale 44 = 438');
check(near(r.total, 30136.33), `example total: 15,538.33 + 14,160 + 438 = 30,136.33 (${r.total})`);
check(near(r.officialTotal, 15976.33) && near(r.ownTotal, 14160), 'example split: 15,976.33 by law and regulations, 14,160 by the quote');
check(r.lines.map((l) => l.id).join(',') === 'extract_online,lawyer,warning,tax,mortgage,sale' && near(r.lines[3].running, 29904.33) && near(r.lines[5].running, 30136.33), 'example ledger order by station (before, sign, tax, close) and the running total: 18, 14,178, 14,366, 29,904.33, 30,092.33, 30,136.33');
check(r.events[1].date === '2026-12-15' && r.events[2].date === '2027-01-14', 'example dates: declaration 15.11 + 30 = 15.12.2026 (s.73(ג)); payment + 60 = 14.1.2027 (s.90א)');
check(r.pctOfPrice === 1.26, `example: 30,136.33 / 2,400,000 = 1.26% of the price (${r.pctOfPrice})`);

/* ---------- 3. Hard cases ---------- */
const add = buy({ track: 'additional' });
check(add.ok && add.tax.amount === 192000 && near(add.total, 206598), `additional home: 8% x 2,400,000 = 192,000 (s.9(ג1ו)); total 192,000 + 14,160 + 438 = 206,598 (${add.total})`);
const late = buy({ track: 'additional', date: '2027-03-01' });
check(!late.ok && late.outOfScope, 'additional home after 10.2.2027: the rate is not published, the engine refuses (no guess)');
const ol = buy({ track: 'oleh', aliyah: '' });
check(!ol.ok && ol.errors.some((e) => e.field === 'aliyah'), 'new immigrant without the aliyah day: an error on that field (reg. 12א window)');
const ol2 = buy({ track: 'oleh', aliyah: '2026-06-01' });
check(ol2.ok && near(ol2.tax.amount, 2106.28), `new immigrant: 0% to 1,978,745, 0.5% x 421,255 = 2,106.28 (reg. 12א) (${ol2.tax && ol2.tax.amount})`);
const v17 = buy({ date: '2024-12-01' });
check(v17.ok && v17.vatRate === 17 && v17.lawyer.gross === 14040, 'signed 1.12.2024: VAT 17%, 12,000 + 2,040 = 14,040');
const fx = buy({ feeMode: 'fixed', fee: 11800, feeVat: true });
check(fx.lawyer.net === 10000 && fx.lawyer.vat === 1800 && fx.lawyer.gross === 11800, 'fixed quote 11,800 with VAT included: 10,000 + 1,800');
const fx2 = buy({ feeMode: 'fixed', fee: 9000 });
check(fx2.lawyer.gross === 10620 && fx2.feePctOfPrice === 0.38, 'fixed quote 9,000 before VAT: 10,620 with VAT; 9,000 / 2,400,000 = 0.38% of the price');
const rest = buy({ date: '2026-12-01' });
check(rest.events[2].date === '2027-01-31', 'rest day: 1.12.2026 + 60 = 30.1.2027, a Saturday, moves to 31.1.2027 (Interpretation Law s.10(ג))');
const noMtg = buy({ mortgage: false });
check(!line(noMtg, 'mortgage') && near(noMtg.total, 29948.33), 'no mortgage: no 188 line; 30,136.33 - 188 = 29,948.33');
const repl = buy({ track: 'replacement' });
check(repl.ok && repl.events.some((e) => e.kind === 'replacement' && e.date >= '2028-11-15'), 'replacement home bought 15.11.2026: the sale deadline (24 months, s.9(ג1ג)(2)(ב)) is a dated event');

/* ---------- 4. The sale ---------- */
const s = sell({});
check(s.ok && s.lawyer.gross === 14160 && s.broker.net === 48000 && s.broker.gross === 56640 && s.total === 70800, 'sale: fee 14,160 + broker 2% = 48,000 + 18% = 56,640; total 70,800');
check(line(s, 'mortgage_delete_direct') && line(s, 'mortgage_delete_direct').amount === 0, 'sale: mortgage paid directly to the bank: the deletion line shows, exempt (item 2(ג)(1))');
check(s.advance && s.advance.pct === 7.5 && s.advance.amount === 180000, 'sale: bought 1.5.2012 (after 7.11.2001): advance 7.5% x 2,400,000 = 180,000 (s.15(ב))');
check(sell({ buyDate: '1999-01-01' }).advance.amount === 360000, 'sale: bought 1.1.1999 (before 7.11.2001): advance 15% = 360,000');
check(sell({ exempt: true }).advance === null, 'sale with an exemption claimed: no advance (s.15(ח)(1))');
check(sell({ payoff: 'deposit' }).total === 70988, 'sale: money deposited at the registry: deletion 188 (item 2(ג)(2)); 70,800 + 188 = 70,988');
check(sell({ early: 3500 }).total === 74300, 'sale: the bank\'s early-repayment fee 3,500 is the user\'s figure: 74,300');
check(s.events[1].date === '2026-12-15' && s.events[2].date === '2027-01-14' && s.events[1].rule.startsWith('סעיף 73(א)'), 'sale dates: the seller\'s declaration 15.12.2026 (s.73(א)), payment 14.1.2027 (s.90א)');
check(s.shevachLink === 'tq/a2012-05-01/b1300000/c2026-11-15/d2400000/f70800', `sale: the mas-shevach share state carries status, both dates, both prices and the sale costs (${s.shevachLink})`);
const SH_KEYS = ['t', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'm', 'p', 'r', 'o', 'w', 'n', 'v', 'l', 'k', 'j', 'x', 'y', 'z', 'q', 'u', 'G', 'H', 'R'];
const sh = decodeState(`#s=${s.shevachLink}`, SH_KEYS);
check(sh.t === 'q' && sh.a === '2012-05-01' && sh.c === '2026-11-15' && sh.d === '2400000' && sh.f === '70800', 'sale: the state decodes with the mas-shevach KEYS (shevach-ui.js) into its fields');
check(sell({ buyDate: '' }).shevachLink === '', 'sale without the purchase day: no prefilled state (the tool needs both dates)');

/* ---------- 5. The Bar's non-binding tariff ---------- */
check(near(E.ikBar(reg, 2400000).drafting, 27029.90), 'tariff 11(1) at 2,400,000: 1,900.08 + 4,239.05 + 4,793.19 + 15,222.19 + 875.39 = 27,029.90');
check(near(E.ikBar(reg, 2400000).registration, 19584.92), 'tariff 11(9)(ג) at 2,400,000: 1% x 633,967 = 6,339.67 + 0.75% x 1,766,033 = 13,245.25 = 19,584.92');
check(near(E.ikBar(reg, 633967).registration, 6339.67) && near(E.ikBar(reg, 633968).registration, 6339.68), 'tariff 11(9)(ג) edge: exactly at 633,967 = 6,339.67; one shekel above = 6,339.68');
check(E.ikBar(reg, 30000).drafting === 790 && E.ikBar(reg, 50000).drafting === 1000, 'tariff 11(1)(א): 2% with a 790 floor (30,000 -> 790; 50,000 -> 1,000)');
check(E.ikBar(reg, 3900000).drafting === 37761 && E.ikBar(reg, 3900000).byAgreement, 'tariff 11(1)(ו): above 3,806,082 by agreement, at least 37,761');

/* ---------- 6. Input errors ---------- */
check(!buy({ price: 0 }).ok && buy({ price: 0 }).errors[0].field === 'price', 'error: price 0');
check(!buy({ date: '31.2.2026' }).ok, 'error: an impossible date');
check(!buy({ fee: 11 }).ok && buy({ fee: 11 }).errors.some((e) => e.field === 'fee'), 'error: a fee above 10%');
check(!buy({ broker: 12 }).ok, 'error: a broker fee above 10%');
check(!buy({ appraiser: -5 }).ok, 'error: a negative appraiser fee');
check(!sell({ buyDate: '2027-01-01' }).ok && sell({ buyDate: '2027-01-01' }).errors[0].field === 'buyDate', 'error: bought after the sale');

/* ---------- 7. Renderers: no <h2>, no undefined, the picture's text equivalent, the brief, print, ics, next steps ---------- */
const snap = U.snapshot(reg);
const all = Object.values(snap).filter((v) => typeof v === 'string').join('\n');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined / NaN / null');
check(snap.result.includes('30,136.33') && snap.result.includes('15,538.33') && snap.result.includes('14,160') && snap.method.includes('פרט 13(א)(1)') && snap.method.includes('סעיף 90א'), 'snapshot: the example figures and the cites are in the server HTML');
check(snap.compare_table.includes('<caption>') && snap.compare_table.includes('44 ₪') && snap.compare_table.includes('127 ₪') && snap.compare_table.includes('27,779.9'), 'compare table: captions, the 2026 Land Registry fees, and tariff 11(1) at 2,500,000 = 26,154.50 + 0.75% x 216,719 = 27,779.90');
const sellHtml = U.renderResult(reg, s) + U.renderDetails(reg, s);
check(!/<h2/i.test(sellHtml) && !bad(sellHtml) && sellHtml.includes('/land-appreciation-tax/#s=tq/') && sellHtml.includes('180,000'), 'sale result: no <h2>, the mas-shevach link with state, the advance 180,000');
const lg = U.ledger(reg, r);
check(lg.includes('<caption') && lg.includes('scope="col"') && lg.includes('jtool-visually-hidden') && lg.includes('30,136.33 ₪ בסך הכול') && U.strip(reg, r).includes('aria-hidden="true"'), 'the picture: the strip is aria-hidden; the ledger table (caption, column headers, a one-line summary) is its text equivalent');
const brief = U.aiBrief(reg, r);
const words = brief.split(/\s+/).length;
check(brief.includes('30,136.33') && brief.includes('15,538.33') && brief.includes('15.12.2026') && !/\d{9}/.test(brief) && !bad(brief), 'aiBrief: the totals and the declaration day, no 9-digit run, no undefined');
check(words >= 40 && words <= 90 && brief.includes('כ-2.4 מיליון') && !brief.includes('2,400,000'), `aiBrief: 40-90 words (${words}), the price as a band only`);
const sbrief = U.aiBrief(reg, s);
check(sbrief.includes('70,800') && sbrief.includes('7.5%') && !/\d{9}/.test(sbrief) && !bad(sbrief), 'aiBrief (sale): the costs, the advance rate, no ID-like run');
const pr = U.printSummary(reg, r, '2026-10-22');
check(pr.includes('דף הסגירה של הקנייה') && pr.includes('30,136.33') && pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 21.10.2026') && pr.includes('15.12.2026'), 'print: the closing sheet has inputs, total, the path, the dates, sources with the check date and the day printed');
const cal = ics(r.events.map((e) => ({ date: e.date, summary: e.what })), '2026-10-22T00:00:00Z');
check((cal.match(/BEGIN:VEVENT/g) || []).length === 3 && cal.includes('DTSTART;VALUE=DATE:20261115') && cal.includes('DTSTART;VALUE=DATE:20261215') && cal.includes('DTSTART;VALUE=DATE:20270114'), 'ics: signing 15.11.2026, declaration 15.12.2026, payment 14.1.2027');
const na = U.nextActions(reg, r);
check(na.official[0].url === fl.services.declare.url && na.links.length === 4 && na.links.every((l) => l.path.startsWith('/')) && na.links.some((l) => l.path === '/acquisition-tax-brackets-2026/'), 'next actions: the declaration service first, four internal next-step links');
check(snap.result.includes('<h4>מה עושים עכשיו</h4>') && snap.result.includes('<h4>התרחיש לסימולציה</h4>') && snap.result.includes('data-act="rehearse"') && snap.result.includes('purpose=mediation&topic=real-estate'), 'result: "what to do now", the brief under its h4 and the rehearse button (real-estate, mediation)');
check(snap.result.includes('כלל 2') && snap.result.includes('כלל 14(ב) ו-14(ד)'), 'fee box: the tariff is cited as non-binding (rule 2) and the one-lawyer rule (14(ב), 14(ד))');

/* ---------- 8. Share state round trip ---------- */
for (const [name, inp] of [['buy', EX], ['sell', U.SELL_EXAMPLE], ['oleh fixed', Object.assign({}, EX, { track: 'oleh', aliyah: '2026-06-01', feeMode: 'fixed', fee: 9000, feeVat: true, appraiser: 2500 })]]) {
	const back = U.inputOf(decodeState(`#s=${U.stateOf(inp)}`, U.KEYS));
	const a = E.ikCompute(reg, inp);
	const b = E.ikCompute(reg, back);
	check(back && a.ok && b.ok && a.total === b.total && back.side === inp.side, `share state (${name}): stateOf -> decodeState -> inputOf gives the same result (${a.total})`);
}

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
