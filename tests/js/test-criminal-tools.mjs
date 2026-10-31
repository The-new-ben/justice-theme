/**
 * Golden tests for the criminal hub's instruments (HAD-651, 31.10.2026): choosing a criminal lawyer
 * (bchirat-orech-din-plili) and the fee table by stage (sachar-orech-din-plili).
 * Run: node tests/js/test-criminal-tools.mjs
 *
 * The selector holds no price: these tests pin its rules (the guide per stage and offence, the arrest clock first, the
 * questions capped at seven, the fee rows per stage, the budget note, the directory link per district) and the share
 * link. The fee table: every row sourced and dated, ranges in order, the Bar's minimum with VAT on request.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from '../../assets/js/tools/plili-ui.js';
import * as F from '../../assets/js/tools/sachar-plili-ui.js';
import * as O from '../../assets/js/tools/onashim-ui.js';
import * as H from '../../assets/js/tools/halich-ui.js';
import * as Z from '../../assets/js/tools/zchuyot-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const p = reg.fl_plili;
const t = reg.fl_plili_sachar;
const run = (over) => S.plCompute(reg, Object.assign(S.plDefaults(reg), over || {}));
const bad = (s) => /undefined|NaN|\bnull\b|\[object/.test(s);

/* ---------- 1. The selector's dataset ---------- */
check(p && p.questions.length === 4 && p.districts.length === 7, 'dataset: four questions and seven district choices');
check(p.questions.every((q) => q.options.length >= 3 && q.options.every((o) => o.v && o.he)), 'dataset: every question has its options');
check(Object.keys(p.guide).length === 5 && Object.values(p.guide).every((g) => /^\/[a-z0-9-]+\/$/.test(g.path) && g.he), 'dataset: a guide for each of the five stages');
check(!/המומלצ|הטוב ביותר|הטובה ביותר|מוביל/.test(JSON.stringify(p.profile) + JSON.stringify(p.ask)), 'dataset: no superlative (Bar advertising rule 2א)');
check(p.urgent.he.includes('24 שעות') && p.urgent.law_he.includes('29') && p.urgent.law_he.includes('34'), 'dataset: the arrest clock with its sections');
check(Object.values(p.fee_rows).flat().every((id) => t.rows.some((r) => r.id === id)), 'dataset: every fee row the selector names exists in the fee table');

/* ---------- 2. The selector's rules ---------- */
const ex = run();
check(ex.ok && ex.guide.path === '/police-investigation-rights/' && ex.offenceGuide.path === '/assault-charges-lawyer/', 'example: the investigation guide and the assault guide');
check(!ex.urgent && ex.fees.length === 2 && ex.dir === '/lawyers/?area=criminal-law', 'example: no arrest step, two fee rows, the whole directory');
check(ex.ask.length === 6 && ex.ask.slice(0, 3).every((a, n) => a === p.ask[n].he), 'example: six questions (three general, two for the interrogation, one for violence), the general ones first');
const ar = run({ stage: 'arrest', urgency: 'now', district: 'haifa' });
check(ar.urgent && ar.urgent.he.includes('24 שעות') && ar.guide.path === '/arrest-detention-lawyer-israel/' && ar.dir.endsWith('&city=haifa'), 'arrest: the clock first, the arrest guide, Haifa in the directory');
check(ar.ask.includes(p.ask.find((a) => a.when === 'urgency:now').he), 'arrest now: the availability question');
check(S.renderResult(reg, ar).indexOf('קודם כול') < S.renderResult(reg, ar).indexOf('מה אתם צריכים'), 'arrest: the urgent step prints before the profile');
check(run({ stage: 'indict' }).fees.length === 3 && run({ stage: 'convict' }).guide.path === '/criminal-appeal/' && run({ stage: 'record' }).guide.path === '/criminal-record-deletion/', 'stages: indictment with three fee rows, appeal, record deletion');
check(run({ budget: 'pd' }).budgetNote === 'pd' && S.renderResult(reg, run({ budget: 'pd' })).includes('/eligibility-public-defender-income/'), 'budget: no means leads to the public defender');
const lowArrest = run({ stage: 'indict', budget: 'low' });
check(lowArrest.budgetNote === 'below' || Math.min(...lowArrest.fees.map((f) => f.low)) <= 5000, 'budget: a budget under the stage\'s lowest published low is flagged');
check(run({ district: 'north' }).dir === '/lawyers/?area=criminal-law' && run({ district: 'nowhere' }).district.v === '', 'districts: no city filter for the north, unknown falls back');
check(S.renderDetails(reg, run({ district: 'tlv' })).includes('בית המשפט המחוזי בתל אביב-יפו'), 'details: the district court');

/* ---------- 3. Validation and rendering ---------- */
const badStage = S.plCompute(reg, Object.assign(S.plDefaults(reg), { stage: 'x' }));
check(!badStage.ok && badStage.errors[0].field === 'stage' && !bad(S.renderResult(reg, badStage)), 'validation: an unknown answer asks for an answer');
for (const stage of ['before', 'arrest', 'indict', 'convict', 'record']) {
	for (const offence of ['drugs', 'violence', 'sex', 'white', 'traffic', 'other']) {
		const r = run({ stage, offence, budget: 'low', district: 'south' });
		check(r.ok && r.ask.length <= 7 && !bad(S.renderResult(reg, r) + S.renderDetails(reg, r) + S.printSummary(reg, r, '2026-10-31')), `render ${stage}/${offence}`);
	}
}

/* ---------- 4. Share links ---------- */
const input = Object.assign(S.plDefaults(reg), { stage: 'indict', offence: 'white', urgency: 'plan', budget: 'high', district: 'jerusalem' });
check(JSON.stringify(S.inputOf(reg, decodeState(S.stateOf(reg, input), S.KEYS))) === JSON.stringify(input), 'selector share link: every answer survives the round trip');
const fin = { stage: t.rows[3].id, vat: false };
check(JSON.stringify(F.inputOf(reg, decodeState(F.stateOf(reg, fin), F.KEYS))) === JSON.stringify(fin), 'fee share link: the stage and VAT survive the round trip');

/* ---------- 5. The fee table ---------- */
check(t && t.rows.length >= 7 && t.vat_rate === 0.18 && t.bar.url.startsWith('https://'), 'fees: the stages, VAT 18% and the Bar notice');
check(t.rows.every((r) => (r.low === null && r.high === null) || (r.low > 0 && r.low <= r.mid && r.mid <= r.high)), 'fees: every published range is in order (low ≤ mid ≤ high)');
check(t.rows.every((r) => r.low === null || (r.n >= 2 && r.sources.length === r.n && r.sources.every((s) => /^https:\/\//.test(s.url) && s.publisher))), 'fees: every range rests on at least two linked sources');
check(t.rows.every((r) => !r.floor || (r.floor.amount > 0 && r.floor.item_he)), 'fees: every Bar minimum names its tariff item');
const withVat = F.scCompute(reg, { stage: t.rows.find((r) => r.floor && !r.floor.vat_included)?.id || t.rows[0].id, vat: true });
const noVat = F.scCompute(reg, { stage: withVat.input.stage, vat: false });
check(!withVat.floor || Math.abs(withVat.floor.amount - noVat.floor.amount * 1.18) < 1, 'fees: the Bar minimum gets VAT added on request');
check(F.feeTable(reg, withVat).includes('<caption>') && F.feeTable(reg, withVat).includes('scope="col"') && F.feeTable(reg, withVat).includes(t.public_defender.path), 'fees: an accessible table with the public defender row');
check(!bad(F.renderResult(reg, withVat) + F.renderDetails(reg, withVat)), 'fees: render');

/* ---------- 6. Snapshots ---------- */
const s1 = S.snapshot(reg);
const s2 = F.snapshot(reg);
check(s1.form.includes('jt76-district') && s1.answer.ask_n === 6 && !bad(JSON.stringify(s1)), 'selector snapshot');
check(s2.form.includes('jt77-stage') && s2.answer.rows.length === t.rows.length && !bad(JSON.stringify(s2.form + s2.result + s2.details)), 'fee snapshot');

/* ---------- 7. Offences and penalties ---------- */
const on = reg.fl_plili_onashim;
check(on && on.rows.length === 15 && on.rows.every((r) => /^https:\/\/he\.wikisource\.org\//.test(r.url) && r.section && r.law_he && r.max_short_he), 'offences: fifteen verified rows, each with its statute link, section and maximum');
check(on.rows.every((r) => typeof r.max_years !== 'number' || r.court_he === (r.max_years <= 7 ? 'שלום' : 'מחוזי')), 'offences: the court follows the seven-year rule');
const dr = O.oaCompute(reg, { family: 'drugs' });
check(dr.ok && dr.rows.length === 2 && dr.top.max_years === 20 && dr.district === 1 && dr.guide.path === '/drug-related-crime/', 'offences: drugs, trafficking the heaviest (20 years), heard in the district court');
check(O.oaCompute(reg, { family: 'violence' }).rows.length === 4 && O.oaCompute(reg, { family: 'nope' }).ok === false, 'offences: four violence rows; an unknown family asks again');
check(on.rows.find((r) => r.id === 'assault-simple').max_years === 2 && on.rows.find((r) => r.id === 'rape').max_years === 16 && on.rows.find((r) => r.id === 'tax-evasion').max_years === 7, 'offences: the anchors (assault 2, rape 16, tax evasion 7)');
const oall = O.oaCompute(reg, {});
check(!bad(O.renderResult(reg, oall) + O.renderDetails(reg, oall)) && O.offenceTable(reg, oall).includes('<caption>') && O.offenceTable(reg, oall).includes('scope="col"'), 'offences: an accessible table that renders clean');
check(JSON.stringify(O.inputOf(reg, decodeState(O.stateOf(reg, { family: 'sex' }), O.KEYS))) === JSON.stringify({ family: 'sex' }), 'offences: share link round trip');

/* ---------- 8. The process timeline ---------- */
const hl = reg.fl_plili_halich;
check(hl && hl.steps.length === 7 && hl.steps.every((s) => s.facts.length === 3 && s.facts.every((f) => f.he && f.law && f.section && /^https:\/\//.test(f.url)) && /^\/[a-z0-9-]+\/$/.test(s.guide.path)), 'timeline: seven steps, three sourced facts each, a guide each');
const rec = hl.steps.find((s) => s.id === 'record');
check(rec.facts.every((f) => f.law === 'חוק המידע הפלילי ותקנת השבים') && !JSON.stringify(hl.steps).includes('חוק המרשם הפלילי'), 'timeline: record deletion cites the 2019 law, never the repealed 1981 law');
check(hl.steps.find((s) => s.id === 'appeal').facts[0].he.includes('45 יום'), 'timeline: the appeal is 45 days');
const tl = H.hlCompute(reg, { step: 'indictment' });
check(tl.ok && tl.at === 3 && tl.steps[2].state === 'done' && tl.steps[3].state === 'now' && tl.steps[4].state === 'next' && tl.next.id === 'trial', 'timeline: the steps before are done, the chosen one is now');
check(H.timeline(reg, tl).includes('aria-current="step"') && !bad(H.renderResult(reg, tl) + H.renderDetails(reg, tl)), 'timeline: the current step is marked for screen readers, renders clean');
check(JSON.stringify(H.inputOf(reg, decodeState(H.stateOf(reg, { step: 'appeal' }), H.KEYS))) === JSON.stringify({ step: 'appeal' }), 'timeline: share link round trip');

/* ---------- 9. The rights card ---------- */
const za = Z.zcCompute(reg, { mode: 'arrest' });
const zi = Z.zcCompute(reg, { mode: 'interrogation' });
check(za.ok && za.rights.length === 7 && zi.ok && zi.rights.length === 3 && zi.rights.every((x) => ['silence', 'language', 'video'].includes(x.id)), 'rights: seven under arrest, three under caution');
check(za.rights.filter((x) => x.urgent).length === 1 && za.rights.find((x) => x.urgent).section === '29(א)', 'rights: only the 24 hours in the danger tone');
const cardHtml = Z.card(reg, za);
check(za.rights.filter((x) => x.quote).every((x) => cardHtml.includes(`"${x.text}"`)) && za.rights.filter((x) => !x.quote).length === (cardHtml.match(/בניסוח חופשי/g) || []).length, 'rights: quotes in quotation marks, the rest marked as plain wording');
check(!bad(Z.renderResult(reg, za) + Z.renderDetails(reg, za) + Z.printText(reg, za, '2026-10-31')), 'rights: render');
check(JSON.stringify(Z.inputOf(reg, decodeState(Z.stateOf(reg, { mode: 'interrogation' }), Z.KEYS))) === JSON.stringify({ mode: 'interrogation' }), 'rights: share link round trip');

console.log(`criminal tools: ${passed} passed, ${failures} failed`);
if (failures) { process.exit(1); }
