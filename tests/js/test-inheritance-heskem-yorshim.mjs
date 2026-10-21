/**
 * Golden tests for the heirs' distribution agreement with the equalization ledger (the inheritance wave, 21.10.2026).
 * Run: node tests/js/test-inheritance-heskem-yorshim.mjs
 *
 * Every expected figure is computed by hand from the Succession Law (ss.8, 110-111, 121-122), the Land Taxation Law
 * (ss.4, 5(ג)(4), 49ב(5)), the Legal Capacity Law (ss.20, 47) and the Bar's 2026 tariff (item 11(9)(ח)), as the registry holds them.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as HY from '../../assets/js/tools/heskem-yorshim-engine.js';
import * as HYUI from '../../assets/js/tools/heskem-yorshim-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const three = () => [{ relation: 'sibling' }, { relation: 'sibling' }, { relation: 'sibling' }];
const two = () => [{ relation: 'child' }, { relation: 'child' }];

/* ---------- 1. The registry carries the rules the tool cites ---------- */
{
	const ip = reg.inheritance_process;
	check(ip && ip.checked_on === '2026-10-21' && ip.sections.division_agreement === 'סעיף 110' && ip.sections.division_court === 'סעיף 111' && ip.sections.division_rules === 'סעיפים 112 עד 117' && ip.sections.agreement_in_life_void === 'סעיף 8', 'registry: ss.110, 111, 112-117 and 8 of the Succession Law');
	check(ip.land_tax.division_not_sale === 'סעיף 5(ג)(4)' && ip.land_tax.inheritance_not_sale === 'סעיף 4' && ip.land_tax.inherited_home === 'סעיף 49ב(5)', 'registry: Land Taxation Law ss.4, 5(ג)(4), 49ב(5)');
	check(ip.capacity.minor_property === 'סעיף 20' && ip.capacity.guardian === 'סעיף 47' && ip.bar.registration_per_unit === 2190 && ip.bar.items.registration === 'פרט 11(9)(ח)' && reg.will_cost.vat.pct === 18, 'registry: Capacity Law ss.20, 47; Bar registration 2,190 per unit (item 11(9)(ח)); VAT 18%');
}

/* ---------- 2. The example: three siblings, a flat to one, cash common, a car to another ---------- */
{
	const r = HY.compute(reg, HYUI.EXAMPLE);
	check(r.ok && r.total === 3060000 && r.n === 3, 'example: the estate is 2,400,000 + 600,000 + 60,000 = 3,060,000');
	check(r.heirs.every((h) => h.entitled === 1020000 && h.pct === 33.33), 'example: equal shares, 1,020,000 each (s.110 lets them divide otherwise)');
	check(r.heirs[0].received === 2600000 && r.heirs[1].received === 260000 && r.heirs[2].received === 200000, 'example: received 2,400,000 + 200,000; 60,000 + 200,000; 200,000');
	check(r.heirs[0].delta === 1580000 && r.heirs[1].delta === -760000 && r.heirs[2].delta === -820000, 'example: deltas +1,580,000 / −760,000 / −820,000');
	check(r.estateCash === 600000 && r.heirs[0].cashShare === 200000 && r.equalization === 1580000, 'example: 600,000 of estate cash, 200,000 of it is heir 1\'s share; equalization 1,580,000');
	check(r.fromEstate === 200000 && r.fromPrivate === 1380000 && r.missing === 0, 'example: 200,000 from estate cash first, 1,380,000 from heir 1\'s own money (s.5(ג)(4) gate)');
	check(r.pairs.length === 3 && r.pairs[0].from === 0 && r.pairs[0].to === 2 && r.pairs[0].amount === 200000 && r.pairs[0].source === 'estate', 'example: the estate cash goes to the heir who lacks most (heir 3, 820,000)');
	check(r.pairs[1].to === 2 && r.pairs[1].amount === 620000 && r.pairs[1].source === 'private' && r.pairs[2].to === 1 && r.pairs[2].amount === 760000 && r.pairs[2].source === 'private', 'example: private 620,000 to heir 3 and 760,000 to heir 2');
	check(r.buys.length === 2 && r.buys[0].fraction === 25.83 && r.buys[1].fraction === 31.67 && r.buys.every((b) => b.land && b.asset === 0), 'example: heir 1 buys 25.83% and 31.67% of the flat (620,000 and 760,000 of 2,400,000)');
	check(r.realEstate && r.registration.units === 1 && r.registration.total === 2190 && r.registration.withVat === 2584.2, 'example: one land unit, 2,190 before VAT, 2,584.20 with 18%');
	check(r.flags.some((f) => f.code === 'private' && f.he.includes('1,380,000')) && r.flags.some((f) => f.code === 'no_court') && !r.flags.some((f) => f.code === 'minor'), 'example: the private-money flag names 1,380,000; no court approval needed');
	check(r.text.includes('הסכם חלוקת עיזבון') && r.text.includes('3.5 הצדדים יודעים שהסכום של 1,380,000 ₪') && r.text.includes('סעיף 5(ג)(4)') && r.text.includes('[מספר זהות]') && !r.text.includes('7. קטין'), 'example draft: the title, the outside-consideration disclosure with the section, ID placeholders, no minor clause');
	check(r.text.includes('ניתן צו ירושה מספר [מספר הצו]') && r.text.includes('25.83% מהזכויות בדירה') && r.text.includes('2,190 ₪ ליחידת מקרקעין'), 'example draft: after the order, the bought fraction, the Bar registration reference');
	check(r.checklist.length === 7 && r.checklist[0].includes('צו הירושה') && r.checklist.some((x) => x.includes('נסח רישום')) && r.checklist.some((x) => x.includes('מיסוי מקרקעין')), 'example checklist: the order, the Tabu extract, the land-tax declaration');
}

/* ---------- 3. Balanced, estate-only, missing, custom shares, sold assets ---------- */
{
	const bal = HY.compute(reg, { heirs: two(), assets: [{ type: 'cash', value: 100000, to: 'common' }] });
	check(bal.ok && bal.balanced && bal.equalization === 0 && bal.pairs.length === 0 && bal.text.includes('ואין בין הצדדים תשלומי איזון'), 'cash left common: balanced, no pairs, the draft says so');
	const est = HY.compute(reg, { heirs: two(), assets: [{ type: 'flat', value: 1000000, to: 0 }, { type: 'cash', value: 1000000, to: 'common' }] });
	check(est.ok && est.equalization === 500000 && est.fromEstate === 500000 && est.fromPrivate === 0 && est.missing === 0 && est.pairs[0].source === 'estate', 'flat to one, cash common: 500,000 covered by forgoing the cash share: not a sale');
	check(est.text.includes('אינה מכירה (סעיף 5(ג)(4)') && !est.flags.some((f) => f.code === 'private') && est.buys.length === 0, 'estate-only draft declares no outside consideration (s.5(ג)(4))');
	const miss = HY.compute(reg, Object.assign({}, HYUI.EXAMPLE, { privateMoney: false }));
	check(miss.ok && miss.fromEstate === 200000 && miss.fromPrivate === 0 && miss.missing === 1380000 && miss.flags.some((f) => f.code === 'missing' && f.he.includes('1,380,000')), 'estate money only: 1,380,000 missing, flagged with the amount');
	const cus = HY.compute(reg, { heirs: [{ relation: 'spouse', share: 50 }, { relation: 'child', share: 25 }, { relation: 'child', share: 25 }], custom: true, assets: [{ type: 'cash', value: 400000, to: 'common' }, { type: 'flat', value: 1000000, to: 1 }], privateMoney: true });
	check(cus.ok && cus.total === 1400000 && cus.heirs.map((h) => h.entitled).join() === '700000,350000,350000' && cus.heirs.map((h) => h.delta).join() === '-500000,750000,-250000', 'custom 50/25/25: entitled 700,000 / 350,000 / 350,000; deltas −500,000 / +750,000 / −250,000');
	check(cus.fromEstate === 100000 && cus.fromPrivate === 650000 && cus.pairs.map((p) => `${p.from}>${p.to}:${p.amount}:${p.source[0]}`).join() === '1>0:100000:e,1>0:400000:p,1>2:250000:p', 'custom: the child\'s 100,000 cash share first, then 400,000 and 250,000 private');
	const sold = HY.compute(reg, { heirs: three(), assets: [{ type: 'flat', value: 2400000, to: 'sell' }, { type: 'cash', value: 600000, to: 'common' }] });
	check(sold.ok && sold.balanced && sold.estateCash === 3000000 && sold.heirs.every((h) => h.received === 1000000) && sold.text.includes('תימכר בידי היורשים יחד'), 'flat sold and cash common: 1,000,000 each, balanced, the draft sells the flat');
	const fem = HY.compute(reg, { heirs: two(), assets: [{ type: 'flat', value: 1500000, to: 1 }, { type: 'car', value: 50000, to: 0 }, { type: 'shares', value: 200000, to: 'sell' }] });
	check(fem.ok && fem.text.includes('תועבר במלואה ליורש/ת 2') && fem.text.includes('יועבר במלואו ליורש/ת 1') && fem.text.includes('יימכרו, והתמורה נטו'), 'the division clause conjugates by the asset: the flat (f), the car (m), the shares (pl)');
	const noLand = HY.compute(reg, { heirs: two(), assets: [{ type: 'car', value: 100000, to: 0 }, { type: 'cash', value: 20000, to: 'common' }], privateMoney: true });
	check(noLand.ok && noLand.fromPrivate === 40000 && noLand.buys[0].land === false && noLand.buys[0].fraction === null && noLand.flags.find((f) => f.code === 'private').he.includes('אין מקרקעין') && !noLand.realEstate, 'private money with no real estate: the land-tax law does not apply to the payment, no registration lines');
}

/* ---------- 4. Minor, stage, basis ---------- */
{
	const m = HY.compute(reg, Object.assign({}, HYUI.EXAMPLE, { minor: true, stage: 'before', basis: 'will' }));
	check(m.ok && m.flags.some((f) => f.code === 'minor') && !m.flags.some((f) => f.code === 'no_court') && m.text.includes('7. קטין או חסוי') && m.text.includes('סעיף 20 ו-47 לחוק הכשרות'), 'a minor among the heirs: the court-approval clause with ss.20 and 47');
	check(m.text.includes('טרם ניתן צו קיום צוואה') && m.text.includes('הזוכים על פי הצוואה') && m.text.includes('8. יישוב מחלוקות') && m.checklist[0].includes('אישור הגשת הבקשה לצו קיום צוואה'), 'before the order, by a will: the recital, the parties, the clause numbering shifts, the checklist');
	check(m.flags.some((f) => f.code === 'before' && f.he.includes('סעיף 8')) && HY.compute(reg, HYUI.EXAMPLE).text.includes('8. כללי'), 'before the order: the s.8 flag; after the order the general clause is 8');
}

/* ---------- 5. Input errors ---------- */
{
	const bad = (input) => HY.compute(reg, input);
	check(!bad({ heirs: [{}], assets: [{ type: 'cash', value: 1, to: 'common' }] }).ok && !bad({ heirs: Array(9).fill({}), assets: [{ type: 'cash', value: 1, to: 'common' }] }).ok, 'one heir or nine heirs: error');
	check(bad({ heirs: [{}], assets: [{ type: 'cash', value: 1, to: 'common' }] }).errors[0].field === 'heirs', 'the heirs error names its field');
	const sh = bad({ heirs: [{ share: 50 }, { share: 25 }, { share: 20 }], custom: true, assets: [{ type: 'cash', value: 1, to: 'common' }] });
	check(!sh.ok && sh.errors[0].field === 'shares' && sh.errors[0].he.includes('95%'), 'custom shares that sum to 95%: error with the sum');
	check(bad({ heirs: [{ share: 50 }, { share: 'x' }], custom: true, assets: [{ type: 'cash', value: 1, to: 'common' }] }).errors[0].field === 'share-1' && bad({ heirs: [{ share: 50 }, { share: 50.005 }], custom: true, assets: [{ type: 'cash', value: 1, to: 'common' }] }).ok, 'a non-numeric share is an error; 100.005% is within the tolerance');
	check(!bad({ heirs: two(), assets: [] }).ok && !bad({ heirs: two(), assets: Array(11).fill({ type: 'cash', value: 1, to: 'common' }) }).ok, 'no assets or eleven assets: error');
	check(bad({ heirs: two(), assets: [{ type: 'cash', value: 0, to: 'common' }] }).errors[0].field === 'asset-0' && bad({ heirs: two(), assets: [{ type: 'cash', value: 'abc', to: 'common' }] }).errors[0].field === 'asset-0' && bad({ heirs: two(), assets: [{ type: 'cash', value: '', to: 'common' }] }).errors[0].field === 'asset-0', 'a zero, text or blank value: error on that asset');
	check(bad({ heirs: two(), assets: [{ type: 'cash', value: 5, to: 2 }] }).errors[0].field === 'asset-0' && bad({ heirs: two(), assets: [{ type: 'cash', value: 5, to: '' }] }).errors[0].field === 'asset-0', 'an allocation to a heir that does not exist, or none: error');
}

/* ---------- 6. The snapshot: the example figures and the cites in the server HTML ---------- */
{
	const s = HYUI.snapshot(reg);
	const all = s.form + s.result + s.details + s.method + s.compare_table + s.sticky + s.sentence;
	check(s.tool === 'heskem-yorshim' && s.registry_version === reg.registry_version && s.total === 1580000 && s.sticky.includes('1,580,000'), 'snapshot: tool id, registry version, the equalization total in the sticky bar');
	check(s.result.includes('jt26-beam') && s.result.includes('aria-hidden="true"') && s.result.includes('jtool-visually-hidden') && s.result.includes('1,580,000') && s.result.includes('העתקת ההסכם'), 'snapshot result: the ledger beam, its hidden table, the figure, the copy-doc button');
	check(s.details.includes('jt26-doc') && s.details.includes('2,600,000') && s.details.includes('1,380,000') && s.details.includes('25.83%') && s.details.includes('2,584.20') && s.details.includes('data-act="copy-doc"') && s.details.includes('data-act="copy-list"'), 'snapshot details: the draft, the ledger figures, the fraction bought, the registration with VAT, the actions');
	check(all.includes('סעיף 5(ג)(4)') && all.includes('סעיף 110') && all.includes('סעיף 20') && all.includes('פרט 11(9)(ח)') && s.method.includes(reg.inheritance_process.land_tax.url) && s.method.includes(reg.inheritance_process.law_url), 'snapshot: the cites to ss.5(ג)(4), 110, 20 and the Bar item, with the official urls');
	check(s.details.includes('/acquisition-tax-brackets-2026/') && s.details.includes('/land-appreciation-tax/'), 'snapshot: the tax block links the purchase-tax and appreciation-tax calculators');
	check(s.compare_table.includes('<caption>') && s.compare_table.includes('1,400,000') && s.compare_table.includes('58.33%') && s.compare_table.includes('1,000,000'), 'compare table: sell (1,000,000 each), estate cash only (1,400,000 missing), private (58.33% of the flat)');
	check(s.sentence.includes('1,580,000') && s.sentence.includes('1,380,000') && s.sentence.includes('מכירה') && s.sentence.includes('לא טעון אישור'), 'the verdict sentence: the total, the private part as a sale, no court approval');
	check(!/<h2/i.test(s.form + s.result + s.details), 'no <h2> inside the card (the TOC injector rule)');
	check(!/undefined|NaN/.test(all), 'no "undefined" or "NaN" in any rendered string');
	const ids = (s.form + s.result + s.details).match(/ id="[^"]+"/g) || [];
	check(new Set(ids).size === ids.length, 'every id in the card is unique');
	check(s.form.includes('data-heir="2"') && s.form.includes('data-asset="2"') && s.form.includes('2,400,000') && s.form.includes('משותף לכולם לפי החלקים') && (s.form.match(/<option value="x"/g) || []).length === 3, 'the form: three heirs, three assets, the common/sold options on every asset');
	const err = HYUI.renderResult(reg, HY.compute(reg, { heirs: [{}], assets: [] }));
	check(err.includes('jtool-state--danger') && err.includes('היורשים') && HYUI.renderDetails(reg, { ok: false, errors: [] }) === '', 'an error result shows the messages and no details');
	const bal = HYUI.renderResult(reg, HY.compute(reg, { heirs: two(), assets: [{ type: 'cash', value: 100000, to: 'common' }] }));
	check(bal.includes('jtool-state--ok') && bal.includes('החלוקה מאוזנת') && !bal.includes('jtool-flags'), 'a balanced division: the ok state and no flags in the result');
}

/* ---------- 7. The share state: choices and amounts, never the labels ---------- */
{
	const named = Object.assign({}, HYUI.EXAMPLE, { heirs: HYUI.EXAMPLE.heirs.map((h, i) => Object.assign({}, h, { label: `דני ${i}` })) });
	const st = HYUI.stateOf(named);
	check(st === 'p1/hb_~b_~b_/af.0_2400000~c.x_600000~r.1_60000' && !/דני/.test(st), `the share state is compact and carries no label: ${st}`);
	const back = HYUI.inputOf(decodeState(`#s=${st}/@heskem-yorshim`, ['t', 'b', 'c', 'p', 'm', 'h', 'a']));
	check(back && back.stage === 'after' && back.basis === 'law' && back.privateMoney === true && back.minor === false && back.custom === false && back.heirs.length === 3 && back.heirs.every((h) => h.relation === 'sibling' && h.label === '' && h.share === ''), 'round trip: the choices and the heirs come back, labels blank');
	check(JSON.stringify(back.assets) === JSON.stringify(HYUI.EXAMPLE.assets) && HY.compute(reg, back).equalization === 1580000, 'round trip: the assets come back exactly and compute the same 1,580,000');
	const cus = { stage: 'before', basis: 'will', custom: true, privateMoney: false, minor: true, heirs: [{ relation: 'spouse', share: 50 }, { relation: 'child', share: 25 }, { relation: 'child', share: 25 }], assets: [{ type: 'flat', value: 1000000, to: 1 }, { type: 'shares', value: 250000.5, to: 'sell' }] };
	const st2 = HYUI.stateOf(cus);
	const back2 = HYUI.inputOf(decodeState(st2, ['t', 'b', 'c', 'p', 'm', 'h', 'a']));
	check(st2 === 'tb/bw/c1/m1/hs_50~c_25~c_25/af.1_1000000~h.s_250000.5' && back2.stage === 'before' && back2.basis === 'will' && back2.custom && back2.minor && !back2.privateMoney && back2.heirs[0].share === 50 && back2.assets[1].value === 250000.5 && back2.assets[1].to === 'sell', `round trip with custom shares, a sold asset and a decimal: ${st2}`);
	check(HYUI.inputOf(decodeState('#s=p1', ['t', 'b', 'c', 'p', 'm', 'h', 'a'])) === null && HYUI.inputOf({}) === null, 'a hash without heirs and assets is not a shared state');
}

console.log(`heskem-yorshim: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
