/**
 * Golden tests for the injury wave's upgrade of the road-accident instrument (22.10.2026, HAD-591): the parts added to
 * teuna-engine.js (tnCompute and its helpers) and teuna-ui.js (lead card, profiles, ledger, panels, share state), read
 * against registry.injury_teuna and registry.car_accident. The wave-4 checks stay in tests/js/test-justice-tools.mjs.
 * Every expected value is computed by hand in the message (the section in brackets).
 *
 *   node tests/js/test-injury-teuna.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as TE from '../../assets/js/tools/teuna-engine.js';
import * as UI from '../../assets/js/tools/teuna-ui.js';
import * as DT from '../../assets/js/tools/dates.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
const ca = reg.car_accident;
const ti = reg.injury_teuna;

let failures = 0;
let checks = 0;
const check = (ok, what) => { checks += 1; if (!ok) { failures += 1; console.error(`FAIL: ${what}`); } };
const TODAY = '2026-10-22';
const run = (input) => TE.tnCompute(reg, Object.assign({ today: TODAY }, input));
const bad = (html) => /undefined|NaN|\bnull\b/.test(String(html));
const words = (s) => s.trim().split(/\s+/).length;

/* ---------- The dataset ---------- */
{
	check(ti && ti.checked_on === '2026-10-22' && ti.refresh_every_days === 365 && ti.next_update === '2027-01-01' && ti.source_url.startsWith('https://') && ti.name_he && ti.publisher_he && ti.source_name, 'injury_teuna: name, publisher, source, checked 22.10.2026, refresh 365 days, next update 1.1.2027');
	const urls = [];
	const walk = (o) => { for (const [k, v] of Object.entries(o)) { if (v && typeof v === 'object') { walk(v); } else if (/url$/.test(k)) { urls.push(v); } } };
	walk(ti);
	check(urls.length >= 15 && urls.every((u) => /^https:\/\//.test(u)), `every url of injury_teuna is https (${urls.length} urls)`);
	check(ti.max.cbs_calculator_url === reg.cpi.official_calculator_url, 'the CBS linkage calculator is the same url as reg.cpi.official_calculator_url (never two copies that drift)');
	check(ti.vat.prev_pct === 17 && ti.vat.prev_from === '2015-10-01' && ti.vat.from === '2025-01-01' && ca.fees.vat_pct === 18, 'VAT: 17% from 1.10.2015 (order 2015), 18% from 1.1.2025 (order 2024, KT 11179) read from reg.car_accident');
	const w = ti.earnings.avg_wage_rows;
	check(w.length === 3 && w[0].s1 === 11730 && w[0].s2 === 11870 && w[1].s1 === 12379 && w[1].s2 === 12536 && w[2].s1 === 13153 && w[2].s2 === 13316 && !w.some((x) => x.from === '2026-01-01'), 'average wage (btl, benefits columns): 2023 11,730/11,870, 2024 12,379/12,536, 2025 13,153/13,316; 2026 stays in reg.car_accident');
	check(ti.expert.docs_days === 15 && ti.expert.questions_days === 30 && ti.expert.opinion_days === 30 && ti.expert.summon_days === 45 && ti.expert.object_days === 7 && ti.expert.hearing_days === 60, 'experts regulations 1986: 15 days (8(א)), 30 (15(א)), 30 (15(ב)), 45 (15(ג)), 7 (10(א)), 60 (6(א))');
	check(ti.interim.late_pct === 12 && ti.interim.max_years === 2 && ti.interim.again_months === 6 && ti.future.periodic_threshold_pct === 40 && ti.ordinance.discovery_years === 10, 'law ss.5ד 12%, 5ה(ב) 2 years, 5ה(א) 6 months; periodic payments from 40% (reg. 1(1)); Ordinance s.89(2) 10 years');
	check(ti.nii.from === '2023-01-01' && ti.nii.section === 'סעיף 328א(ב)(2)' && ti.heads.map((h) => h.code).join() === 'nonpec,past,future,medical,help,travel', 's.328א(ב)(2) from 1.1.2023; six heads of damage in the ledger');
}

/* ---------- The engine: the wave-4 result is untouched ---------- */
{
	const base = { disability: 20, days: 5, age: 40, accident: '2025-03-10', amount: 150000, stage: 'none', today: '2026-10-14' };
	const a = TE.compute(reg, base);
	const b = TE.tnCompute(reg, base);
	check(b.ok && b.np.pct === 19 && b.np.pct === a.np.pct && b.fees.none.net === a.fees.none.net && b.lim.deadline === a.lim.deadline && b.figure === a.figure, 'tnCompute keeps compute() exactly: 19%, net 135,840, limitation 10.3.2032');
	check(b.tn && b.tn.ledger.nonpecOpen === 19 && b.tn.ledger.low === 0 && b.tn.ledger.high === 0 && b.tn.future === null && b.tn.events.length === 0, 'the example: the ledger holds 19% of the maximum and no shekel head yet; no future loss; no dated new step');
	check(TE.tnCompute(reg, Object.assign({}, base, { excluded: ['licence'] })).outOfScope === true, 's.7(3): out of scope stays out of scope');
	const err = TE.tnCompute(reg, Object.assign({}, base, { disability: 120, functional: 150 }));
	check(!err.ok && err.errors.some((e) => e.field === 'disability') && err.errors.some((e) => e.field === 'functional'), 'errors of the old and the new fields are shown together (disability 120, functional 150)');
}

/* ---------- Future loss of earning capacity (s.4(א)(1)-(2)) ---------- */
const A45 = UI.tnProfile('a45', TODAY, { amount: '', stage: 'none' });
{
	check(A45.accident === '2025-04-22' && A45.disability === 20 && A45.days === 7 && A45.age === 45 && A45.income === 15000 && A45.functional === 15 && A45.retire === 67, 'profile a45: accident 18 months before 22.10.2026 = 22.4.2025, 20%, 7 days, age 45, 15,000, functional 15%, to 67');
	const r = run(A45);
	check(r.ok && r.np.pct === 18.4, '20% at 45: 20 × (100 − 15)% = 17, plus 7 days × 0.2% = 1.4 → 18.4% (regs 2(א), 3)');
	const f = r.tn.future;
	check(f.gross === 2250 && f.low === 1687.5 && f.high === 2250, 'future a month: 15,000 × 15% = 2,250 before tax; after tax between 75% (1,687.50) and 100% (s.4(א)(2))');
	check(f.ceil === 40698 && f.reducedCap === 6104.7, 'the ceiling is reduced by the same share: 40,698 × 15% = 6,104.70 (s.4(א)(1), end)');
	check(f.end === '2047-04-22' && f.months === 246 && !f.exact, 'age 45 on 22.4.2025 → 67 by 22.4.2047 at the latest; 22.10.2026 → 22.4.2047 = 246 months');
	check(f.totalLow === 415125 && f.totalHigh === 553500, 'undiscounted: 1,687.50 × 246 = 415,125; 2,250 × 246 = 553,500 (no capitalisation rate in law)');
	check(!r.tn.flags.some((x) => x.code === 'periodic'), '15% functional: no periodic-payments flag (reg. 1(1) needs 40%)');
	const at = (income, fn) => run(Object.assign({}, A45, { income, functional: fn })).tn.future;
	check(at(40698, 10).capped === false && at(40698, 10).counted === 40698 && at(40699, 10).capped === true && at(40699, 10).counted === 40698, 'the ceiling edge: 40,698 is counted in full; 40,699 is capped at 40,698');
	check(at(40699, 10).gross === 4069.8 && at(40699, 10).high === 4069.9, 'one shekel above: 40,698 × 10% = 4,069.80 counted; the upper bound keeps the income (the CBS figure may raise the ceiling)');
	check(at(60000, 50).gross === 20349 && at(60000, 50).reducedCap === 20349 && at(60000, 50).high === 30000, '60,000 at 50%: the reduced ceiling 40,698 × 50% = 20,349 binds; the upper bound 30,000');
	const p40 = run(Object.assign({}, A45, { functional: 40 }));
	const p39 = run(Object.assign({}, A45, { functional: 39 }));
	check(p40.tn.flags.some((x) => x.code === 'periodic') && !p39.tn.flags.some((x) => x.code === 'periodic'), 'periodic payments: exactly 40% flags it, 39% does not (Periodic Payments Regulations 1978, reg. 1(1))');
	const past = run(Object.assign({}, A45, { age: 66 }));
	check(past.tn.future.end === '2026-04-22' && past.tn.future.months === 0 && past.tn.flags.some((x) => x.code === 'retire_past'), 'age 66 on 22.4.2025, to 67: 22.4.2026 has passed → 0 months, flagged');
	check(!run(Object.assign({}, A45, { retire: 40 })).ok && !run(Object.assign({}, A45, { retire: 'x' })).ok && !run(Object.assign({}, A45, { functional: -1 })).ok && !run(Object.assign({}, A45, { retire: 67.5 })).ok, 'input errors: a retirement age below the age, not a number or not whole; a negative functional %');
	const minor = run({ disability: 10, days: 0, age: 12, accident: '2025-03-01', birth: '2013-01-10', income: 5000, functional: 10, retire: 67 });
	check(minor.ok && minor.tn.future.exact && minor.tn.future.end === '2080-01-10' && minor.tn.future.months === 638, 'a minor with a birth day: 67 on 10.1.2080 exactly; 22.10.2026 → 10.1.2080 = 53 years 2 months = 638 months');
	check(TE.tnMonths('2026-01-31', '2026-02-28') === 1 && TE.tnMonths('2026-01-31', '2026-02-27') === 0 && TE.tnMonths('2026-05-01', '2026-04-01') === 0, 'whole months: 31.1 → 28.2 is one month (end of month), 27.2 is not; backwards is 0');
}

/* ---------- The ledger ---------- */
{
	const r = run(Object.assign({}, A45, { medical: 4200, help: 3000, travel: 800 }));
	const L = r.tn.ledger;
	check(L.rows.find((x) => x.code === 'past').low === 33750 && L.rows.find((x) => x.code === 'past').high === 45000, 'past loss: 15,000 × 3 months = 45,000; after the 25% tax cap 33,750 (s.4(א)(1)-(2))');
	check(L.low === 456875 && L.high === 606500, 'ledger in shekels: 33,750 + 415,125 + 4,200 + 3,000 + 800 = 456,875; 45,000 + 553,500 + 8,000 = 606,500');
	check(L.nonpecOpen === 18.4 && L.rows.find((x) => x.code === 'nonpec').cap.pct === 100 && L.rows.find((x) => x.code === 'past').cap.amount === 40698 && L.rows.find((x) => x.code === 'medical').cap === null, 'caps: 100% of the maximum (s.4(א)(3)), 40,698 a month (s.4(א)(1)); none for expenses');
	const withMax = run(Object.assign({}, A45, { max: 200000 }));
	check(withMax.npAmount === 36800 && withMax.tn.ledger.nonpecOpen === null && withMax.tn.ledger.low === 33750 + 415125 + 36800, 'with a maximum entered: 18.4% × 200,000 = 36,800 joins the shekel total');
	const dead = run({ death: true, accident: '2025-03-10', medical: 5000, demand: '2025-05-01' });
	check(dead.ok && dead.tn.ledger.rows.length === 1 && dead.tn.ledger.rows[0].code === 'nonpec' && dead.tn.ledger.rows[0].pct === 25 && dead.tn.events.length === 0 && dead.tn.flags.some((x) => x.code === 'dependants'), 'death: the ledger holds 25% to the estate only (reg. 4); no interim dates; the dependants flagged (Ordinance s.78)');
	check(!run(Object.assign({}, A45, { medical: -5 })).ok && !run(Object.assign({}, A45, { help: NaN })).ok, 'a negative or unreadable expense is an input error');
}

/* ---------- Dated steps (.ics) ---------- */
{
	const r = run(Object.assign({}, A45, { demand: '2025-06-01', expertNotice: '2026-05-03', opinion: '2026-08-10', late: true }));
	const ev = Object.fromEntries(r.tn.events.map((e) => [e.code, e.date]));
	check(ev.interim_due === '2025-07-31' && ev.interim_court === '2025-08-01', 'interim payment: demand received 1.6.2025 + 60 days = 31.7.2025 (s.5(ב)); the court from 1.8.2025 (s.5א)');
	check(ev.interim_max === '2027-04-22', 'interim payments: no award beyond 2 years from the accident: 22.4.2027 (s.5ה(ב))');
	check(ev.expert_docs === '2026-05-18' && ev.expert_questions === '2026-09-09', 'the expert: notice 3.5.2026 + 15 = 18.5.2026 (reg. 8(א)); opinion 10.8.2026 + 30 = 9.9.2026 (reg. 15(ב))');
	check(ev.discovery === '2035-04-22', 'late discovery: 10 years from the damage, 22.4.2035 (Ordinance s.89(2), applied by s.4(א))');
	const roll = run(Object.assign({}, A45, { demand: '2025-11-04' }));
	check(roll.tn.events.find((e) => e.code === 'interim_due').date === '2026-01-04', '4.11.2025 + 60 days = Saturday 3.1.2026 → Sunday 4.1.2026 (Interpretation Law s.10(ג))');
	check(!run(Object.assign({}, A45, { demand: '2025-01-01' })).ok && !run(Object.assign({}, A45, { opinion: '2027-01-01' })).ok && !run(Object.assign({}, A45, { expertNotice: '31.2.2026' })).ok, 'a demand before the accident, an opinion after today and an impossible date are input errors');
	const dl = UI.deadlines(reg, r);
	check(dl.length === 7 && dl.every((d, i) => i === 0 || d.date >= dl[i - 1].date) && !dl.some((d) => !d.date), 'the dates table: 7 dated rows (six new steps and the limitation) in date order; the undated interim row gives way to the dated one');
	const old = UI.deadlines(reg, TE.compute(reg, { disability: 20, days: 5, age: 40, accident: '2025-03-10', today: '2026-10-14' }));
	check(old.length === 2 && old[0].date === '2032-03-10' && old[1].date === '', 'a wave-4 result: the same two rows as before (the limitation, then the undated interim row)');
	const file = ics(dl.filter((d) => d.date).map((d) => ({ date: d.date, summary: d.what })), '2026-10-22T10:00:00Z');
	check(file.includes('DTSTART;VALUE=DATE:20250731') && file.includes('DTSTART;VALUE=DATE:20320422') && (file.match(/BEGIN:VEVENT/g) || []).length === 7, 'the .ics carries the seven dates, the interim due day and the limitation among them');
}

/* ---------- Who pays, the war window ---------- */
{
	check(TE.tnWho(ti, { karnit: true }).code === 'karnit' && TE.tnWho(ti, { karnit: true }).url === ti.who.karnit_suit_url, 'hit-and-run or no insurance: Karnit (s.12(א)) with its claim page');
	check(TE.tnWho(ti, { role: 'in', multi: true }).section === 'סעיף 3(א)' && TE.tnWho(ti, { role: 'out', multi: true }).section === 'סעיף 3(ב)' && TE.tnWho(ti, { role: 'in' }).section === 'סעיף 2(א)' && TE.tnWho(ti, {}).code === '', 'several vehicles: inside → your own vehicle (s.3(א)); outside → any of them (s.3(ב)); one vehicle → s.2(א); no answer yet → none');
	const revived = run({ disability: 10, days: 0, age: 30, accident: '2016-12-01' });
	const plainOld = run({ disability: 10, days: 0, age: 30, accident: '2016-05-01' });
	check(revived.tn.flags.some((x) => x.code === 'war_revive') && !plainOld.tn.flags.some((x) => x.code === 'war_revive'), 'seven years ending 1.12.2023, inside 7.10.2023-6.4.2024: s.15א(ג) revives it and s.15א(ד) is flagged; ending 1.5.2023 is not');
}

/* ---------- The UI: snapshot, lead, picture, brief, next steps, print ---------- */
const snap = UI.snapshot(reg);
{
	check(snap.total === 19 && snap.lead.includes('jtool-lead__figure') && snap.lead.includes('<bdi>19%</bdi>') && snap.lead.includes('135,840') && snap.lead.includes('10.3.2032') && snap.lead.includes('data-lead-go'), 'snapshot lead card: 19% of the maximum, 135,840 left of 150,000, limitation 10.3.2032, the jump link');
	check(snap.result.includes('jt10-bar') && snap.result.includes('10.3.2032') && snap.method.includes('135,840.00') && snap.compare_table.includes('<bdi>18%</bdi>'), 'the wave-4 parts are still in the snapshot (formula bar, limitation, method, share table)');
	check(snap.result.includes('<h4>התרחיש לסימולציה</h4>') && snap.result.includes('purpose=witness_prep&topic=personal-injury') && snap.result.includes('data-act="rehearse"') && snap.result.includes('<h4>מה עושים עכשיו</h4>'), 'the scenario for the simulation (witness_prep, personal-injury) and the next steps in the result');
	check(snap.details.includes(`${'jt60'}-ledger`) && snap.details.includes('פנקס התביעה') && snap.details.includes('מה השתנה ומתי') && snap.details.includes('הסכום המקסימלי לכאב וסבל: הדרך לשקלים'), 'details: the ledger, the maximum route, the what-changed table');
	check(['35,190', '37,137', '39,459', '40,698', '1.10.2015', '1.1.2025', '1.1.2023', '25.9.1976'].every((x) => snap.details.includes(x)), 'what changed: ceilings 3 × 11,730 = 35,190, 3 × 12,379 = 37,137, 3 × 13,153 = 39,459, 3 × 13,566 = 40,698; VAT 1.10.2015 and 1.1.2025; s.328א 1.1.2023; the law 25.9.1976');
	check(snap.details.includes('180,000') && snap.details.includes('14.3.2024') && snap.details.includes(ti.max.cbs_calculator_url.replace(/&/g, '&amp;')), 'the maximum: the only official mention (a 2024 report, 180,000 then) in words, and the CBS calculator; never computed');
	const parts = ['lead', 'form', 'result', 'details', 'method', 'compare_table', 'sentence'];
	check(parts.every((k) => !/<h2/i.test(snap[k])), 'no <h2> in any rendered part');
	check(parts.every((k) => !bad(snap[k])), 'no undefined, NaN or null in any rendered part');
	check((snap.form.match(/data-act="tn-profile"/g) || []).length === 5 && ['jt10-dis', 'jt10-days', 'jt10-age', 'jt10-acc', 'jt60-fn', 'jt60-ret', 'jt60-med', 'jt60-dem', 'jt60-exn', 'jt60-opn'].every((id) => snap.form.includes(`id="${id}"`)), 'the form: five profile chips, the wave-4 fields and the new ones');
	check((snap.details.match(/class="jt60-track[^"]*" role="img" aria-label="[^"]+"/g) || []).length >= 3 && snap.details.includes('<figcaption'), 'the picture has a caption and a text label on every bar (screen readers)');
	check(snap.details.includes('jt60-print') && snap.details.includes('הודפס ב-22.10.2026') && snap.details.includes('נוסח ל-14.8.2025'), 'the print summary: printed on, the law current to 14.8.2025');
	check(['סעיף 3(ג)', 'סעיף 4(ג)', 'סעיף 5ז(א)', 'סעיף 5(ה)', 'סעיף 7א', 'סעיף 7ב', 'סעיף 8(א)', 'סעיף 15א1', 'תקנה 6(א)', 'תקנה 10(א)', 'תקנה 15(ג)', 'סעיף 86', 'סעיף 76(2)', 'סעיף 89(2)', 'סעיף 15א(ד)'].every((x) => snap.details.includes(x)), 'every rule of the law, the regulations and the Ordinance that the tool does not compute is flagged with its section in the rules list');
	check(!/כל[\s-]?זכות|kolzchut/i.test(parts.map((k) => snap[k]).join('')), 'no mention of the private rights portal');
	const r = run(Object.assign({}, A45, { work: true, amount: 250000, stage: 'none' }));
	const lead = UI.leadCard(reg, r, {});
	check(lead.includes('החישוב שלכם') && lead.includes('18.4%') && lead.includes('226,400') && lead.includes('1,688 עד 2,250'), 'the reader\'s lead card: 18.4%, 250,000 − 8% − VAT = 226,400 left, future 1,688 to 2,250 a month');
	const brief = UI.aiBrief(reg, r);
	check(brief.includes('18.4%') && brief.includes('22.4.2032') && brief.includes('15,000') && !/\d{9}/.test(brief) && !bad(brief) && words(brief) >= 40 && words(brief) <= 90, `the brief: the share, the limitation, the income band; no 9-digit run; ${words(brief)} words`);
	const dbrief = UI.aiBrief(reg, run({ death: true, accident: '2025-03-10' }));
	check(dbrief.includes('25%') && words(dbrief) >= 40 && words(dbrief) <= 90, 'the brief after a death: 25% to the estate, the dependants\' testimony');
	const na = UI.nextActions(reg, r);
	const allowed = ['/sole-court-expert-road-accident/', '/regulations-insurance-1956/', '/work-accident-guide/', '/karnit-fund-uninsured-hit-run/', '/ceiling-lost-earnings-triple-wage/', '/eight-eleven-thirteen-fee-tariff/', '/car-accident-auto-injury-lawyer/'];
	check(na.official.some((x) => x.url === ti.who.insurer_lookup_url) && na.official.some((x) => x.url === ti.nii.work_url) && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => allowed.includes(x.path.split('#')[0])), 'next steps: the insurer lookup, the work-injury claim (on the way to work), 2-4 internal links from the brief\'s list');
	const pr = UI.printSummary(reg, r, '2026-10-22');
	check(pr.includes('פנקס התביעה') && pr.includes('18.4%') && pr.includes('22.4.2032') && pr.includes('הודפס ב-22.10.2026') && !bad(pr), 'the print: the ledger, the share, the dates, the day printed');
}

/* ---------- Share state and the links between the cluster's tools ---------- */
{
	const full = Object.assign({}, A45, { medical: 4200, help: 3000, travel: 800, demand: '2025-06-01', expertNotice: '2026-05-03', opinion: '2026-08-10', late: true, role: 'in', multi: true, karnit: false, work: true, amount: 250000, stage: 'settle', max: 200000 });
	const back = UI.inputOf(decodeState(UI.stateOf(full), UI.KEYS));
	const same = ['disability', 'days', 'age', 'accident', 'income', 'months', 'functional', 'retire', 'medical', 'help', 'travel', 'demand', 'expertNotice', 'opinion', 'late', 'role', 'multi', 'karnit', 'work', 'amount', 'stage', 'max'].every((k) => back[k] === full[k]);
	check(same && back.filled.length === 0, 'stateOf → decodeState → inputOf: every field comes back the same');
	const link = UI.stateLink(reg, full);
	check(link.startsWith('/israel-road-accident-compensation-law/#s=') && !/[֐-׿\s]/.test(link), `stateLink: the page path, #s=, numbers and dates only (${link.length} chars)`);
	const old = UI.inputOf(decodeState('#s=d20/h5/a40/t2025-03-10/m150000/sn', UI.KEYS));
	check(old.disability === 20 && old.days === 5 && old.age === 40 && old.accident === '2025-03-10' && old.amount === 150000 && old.stage === 'none' && old.filled.length === 0 && old.functional === '', 'a wave-4 share link still opens the same answers');
	const part = UI.inputOf(decodeState('#s=d35', UI.KEYS));
	check(part.disability === 35 && part.age === 40 && part.accident === '2025-03-10' && part.filled.join() === 'days,age,accident', 'a link with the disability only: the other three fields from the example, named so the page says so');
	const sk = UI.inputOf(decodeState('#s=d27.1/a40/t2025-03-10', UI.KEYS));
	const av = UI.inputOf(decodeState('#s=t2025-01-05/w1/c12000/a45/d15', UI.KEYS));
	check(sk.disability === 27.1 && sk.age === 40 && av.work === true && av.income === 12000 && av.disability === 15 && av.accident === '2025-01-05', 'the links the sibling tools build (shiklul: d, a, t; avoda: t, w, c, a, d) open with their numbers');
	const sib = UI.tnSiblingLinks(reg, run(Object.assign({}, A45, { work: true })));
	const skKeys = ['k', 'i', 'l', 'r', 'x', 'a', 'd', 'c', 'v', 'p', 'e', 'j'];
	const avKeys = ['k', 't', 'a', 'w', 'q', 'n', 'p', 'h', 'l', 'r', 'i', 'd', 's', 'e', 'm', 'x', 'j', 'u', 'c'];
	const skState = decodeState(sib.shiklul.split('#')[1], skKeys);
	const avState = decodeState(sib.avoda.split('#')[1], avKeys);
	check(sib.shiklul.startsWith('/regulations-insurance-1956/#s=') && skState.i === 'f_20_r___' && skState.a === '45' && skState.j === '2025-04-22', 'into shiklul-nechut: one free 20% item, age 45, the injury day (its KEYS i, a, j)');
	check(sib.avoda.startsWith('/work-accident-guide/#s=') && avState.t === '2025-04-22' && avState.w === '15000' && avState.l === 'y' && avState.r === '1', 'into teunat-avoda: the injury day, the wage, on the way to work, also a road accident (its KEYS t, w, l, r)');
}

/* ---------- Profiles ---------- */
{
	const m = UI.tnProfile('minor', TODAY);
	const r = run(m);
	check(m.accident === '2024-10-22' && m.birth === '2012-07-14' && DT.fullYears(m.birth, m.accident) === 12 && r.lim.minor && r.lim.deadline === '2037-07-14', 'profile minor: born 14.7.2012, 12 on 22.10.2024; 18 on 14.7.2030 + 7 years = 14.7.2037 (Limitation Law s.10)');
	const n = run(UI.tnProfile('none', TODAY));
	check(n.np.kind === 'other' && n.np.upTo === 10, 'profile without permanent disability or hospital days: up to 10%, agreed or awarded (reg. 2(ב))');
	const keep = UI.tnProfile('y25', TODAY, { amount: 90000, stage: 'judgment', max: 210000 });
	check(keep.amount === 90000 && keep.stage === 'judgment' && keep.max === 210000 && keep.disability === 10 && keep.age === 25, 'a profile keeps the offer, the stage and the maximum the reader typed');
	check(Object.keys(UI.PROFILES).every((k) => run(UI.tnProfile(k, TODAY)).ok), 'all five profiles compute');
}

console.log(failures ? `injury teuna: ${failures} of ${checks} checks failed` : `injury teuna: ok (${checks} checks)`);
process.exit(failures ? 1 : 0);
