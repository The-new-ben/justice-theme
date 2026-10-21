/**
 * Golden tests for the rights map for cohabiting partners (yeduim-batzibur, the family + land wave, 21.10.2026, HAD-579).
 * Run: node tests/js/test-fl-yeduim.mjs
 *
 * By hand, from the texts in fl_yeduim (copies in parts/yeduim/sources):
 *  - Succession Law s.55: a cohabitant takes what a married spouse would (s.11: half with children or parents, two thirds
 *    with only siblings or grandparents, all otherwise), unless either was married to someone else at the death; s.57(ג):
 *    maintenance from the estate on the same terms; s.60(א): before the distribution (6 months after, by leave).
 *  - National Insurance Law s.1: "אשתו" includes a cohabitant living with him; s.238: a year under one roof (half a year
 *    from 55), or a child (widow); the 2026 table: 40-50 no children 1,381; 50+ 1,838; 80+ 1,941; one child 2,700; two
 *    3,562; each more 862; under 40 without children a grant of 36 pensions; s.296: claim within 12 months (a grant: before
 *    18 months from the month).
 *  - Notary tariff item 6 (1.1.2026): 200 for the first declarant + 80 for the second = 280; VAT 18% = 50.40; 330.40.
 *  - Family court approval of an agreement: 541 (prenup.routes.court, item 6א). Inheritance request: 597, online 507, +66.
 * The example (today 21.10.2026): together since 1.3.2019, shared household, one child, nobody married, the apartment
 * registered to one: (2026-2019) x 12 + (10-3) = 91 months = 7 years 7 months; tests met 4 of 5 (family by the child,
 * household, nobody married, 91 >= 12 months), sharing open; reminder 21.10.2026 + 30 days = 20.11.2026.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/yeduim-engine.js';
import * as U from '../../assets/js/tools/yeduim-ui.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const TODAY = '2026-10-21';
const EX = Object.assign({}, U.EXAMPLE, { today: TODAY });
const run = (over) => E.compute(reg, Object.assign({}, EX, over));
const line = (r, k) => r.lines.find((l) => l.key === k);
const test = (r, k) => r.tests.find((t) => t.key === k);
const fy = reg.fl_yeduim;
const s = fy.nii.survivors;
// The unofficial portal's name, built from char codes so the name itself is never written in the repo (contract rule).
const PORTAL_HE = String.fromCharCode(0x05db, 0x05dc, 0x20, 0x05d6, 0x05db, 0x05d5, 0x05ea);
const PORTAL_EN = String.fromCharCode(0x6b, 0x6f, 0x6c, 0x7a, 0x63, 0x68, 0x75, 0x74);
const noPortal = (t) => !t.toLowerCase().includes(PORTAL_EN) && !t.includes(PORTAL_HE);
const clean = (t) => !/undefined|NaN|\bnull\b|\[object/.test(t);
const words = (t) => t.trim().split(/\s+/).length;

/* ---------- 1. The registry carries every figure the engine reads, each with an official source ---------- */
check(fy && fy.checked_on === '2026-10-21' && fy.next_update === '2027-01-01', 'fl_yeduim is in the registry, checked 21.10.2026');
const figures = [
	['notary.affidavit_first', fy.notary.affidavit_first, 200], ['notary.affidavit_additional', fy.notary.affidavit_additional, 80],
	['survivors.min_months', s.min_months, 12], ['survivors.min_months_older', s.min_months_older, 6], ['survivors.older_age', s.older_age, 55],
	['amounts.age40to50', s.amounts.age40to50, 1381], ['amounts.age50plus', s.amounts.age50plus, 1838], ['amounts.age80plus', s.amounts.age80plus, 1941],
	['amounts.kid1', s.amounts.kid1, 2700], ['amounts.kid2', s.amounts.kid2, 3562], ['amounts.kid_extra', s.amounts.kid_extra, 862],
	['survivors.grant_under_age', s.grant_under_age, 40], ['survivors.grant_pensions', s.grant_pensions, 36], ['survivors.widower_income_cap', s.widower_income_cap, 7848],
	['claim.months', fy.nii.claim.months, 12], ['claim.grant_months', fy.nii.claim.grant_months, 18], ['succession.maint_after_months', fy.succession.maint_after_months, 6],
];
figures.forEach(([name, v, want]) => check(v === want, `${name} = ${want} (got ${v})`));
const official = (u) => /^https:\/\/(www\.)?(nevo\.co\.il\/law_html|btl\.gov\.il|gov\.il)\//.test(u);
const urls = [fy.source_url, fy.succession.url, fy.family_court.url, fy.nii.def_url, fy.nii.page_url, fy.nii.form_107_url, fy.nii.form_112_page, s.url, s.amounts_url, s.grant_url, s.widow_url, s.widower_url, fy.nii.claim.url, fy.tax.url, fy.tax.form101_url, fy.tax.guide_url, fy.children.capacity_url, fy.children.maint_url, fy.property.ruling_url, fy.property.law_url, fy.pension.split_url, fy.notary.url];
check(urls.every(official), 'every fl_yeduim url is nevo law_html, btl.gov.il or gov.il');
check(fy.tests.length === 5 && fy.tests.every((t) => t.he && t.section && official(t.url)), 'the five proof tests each carry a name, a section and an official url');
check(reg.prenup.routes.court.fee === 541 && reg.prenup.vat.pct === 18 && reg.yerusha.payments.online_fee === 507 && reg.yerusha.payments.publication === 66, 'read from prenup / yerusha: 541 approval fee, VAT 18%, 507 online + 66 publication');
check(noPortal(JSON.stringify(fy)), 'the dataset never names the private rights portal');

/* ---------- 2. The example, by hand ---------- */
const r = run({});
check(r.ok, 'example computes');
check(r.months === 91 && r.years === 7 && r.monthsRem === 7, `1.3.2019 -> 21.10.2026 = 91 months, 7 years 7 months (got ${r.months})`);
check(r.met === 4 && r.applicable === 5, `tests met 4 of 5 (got ${r.met}/${r.applicable})`);
check(test(r, 'family').state === 'met' && test(r, 'household').state === 'met' && test(r, 'single').state === 'met' && test(r, 'roof').state === 'met' && test(r, 'sharing').state === 'open', 'family/household/single/roof met; sharing open (registered to one)');
check(line(r, 'inherit').state === 'prove' && line(r, 'property_law').state === 'no' && line(r, 'children').state === 'have', 'inheritance: prove; Property Relations Law: no; children: have');
check(r.have === 2 && r.prove === 6 && r.no === 0, `focus counts have 2 / prove 6 / no 0 (got ${r.have}/${r.prove}/${r.no})`);
check(r.costs.affidavit.base === 280 && r.costs.affidavit.vat === 50.4 && r.costs.affidavit.total === 330.4, '(200 + 80) x 1.18 = 330.40 (item 6)');
check(r.survivors.amount === 2700 && r.survivors.state === 'prove', 'survivors with one child: 2,700 a month (2026 table)');
check(r.deadlines.length === 1 && r.deadlines[0].kind === 'reminder' && r.deadlines[0].date === '2026-11-20', 'no fixed legal deadline while both live: one reminder, 21.10.2026 + 30 = 20.11.2026');
check(run({ remind: '15.11.2026' }).deadlines[0].date === '2026-11-15' && run({ remind: '15.11.2026' }).deadlines[0].picked === true, 'the reader picks the reminder day (15.11.2026)');
check(r.rehearse.topic === 'family-law' && r.rehearse.purpose === 'court_rehearsal', 'daily: rehearse family-law / court_rehearsal');
check(line(r, 'agreement').prove.includes('541') && line(r, 'agreement').prove.includes('330.4'), 'the agreement line carries the 541 approval fee and the 330.40 affidavit');

/* ---------- 3. Hard cases ---------- */
const d1 = run({ question: 'death', died: '2026-05-10' });
check(d1.months === 86 && d1.deadlines[0].date === '2027-05-10' && d1.deadlines[0].kind === 'law', 'death 10.5.2026: 86 months together; claim by 10.5.2027 (s.296(א))');
check(line(d1, 'inherit').have.includes('מחצית') && line(d1, 'estate_maint').state === 'prove', 'death with a child: half the estate (s.11(א)(1)); maintenance from the estate (s.57(ג))');
check(run({ question: 'death', family: 'siblings' }).lines.find((l) => l.key === 'inherit').have.includes('שני שלישים') && run({ question: 'death', family: 'siblings' }).flags.some((f) => f.code === 'apartment'), 'only siblings: two thirds (s.11(א)(2)), with the 3-year apartment note');
check(run({ question: 'death', family: 'none' }).lines.find((l) => l.key === 'inherit').have.includes('כל העיזבון'), 'no relatives: the whole estate (s.11(ב))');
const m = run({ question: 'death', married: true, died: '2026-05-10' });
check(line(m, 'inherit').state === 'no' && line(m, 'estate_maint').state === 'no' && test(m, 'single').state === 'not', 'married to another: no s.55, no s.57(ג), the test not met');
check(m.flags.some((f) => f.code === 'several') && m.survivors.state === 'prove', 'married to another: the Institute still checks each widow as the only one');
const young = run({ question: 'death', since: '2025-09-10', died: '2026-05-10', kids: 0, age: '40to50' });
check(young.months === 8 && young.survivors.state === 'no' && test(young, 'roof').state === 'not', '8 months, no child, aged 40-50: no survivors pension (s.238)');
check(run({ question: 'death', since: '2025-09-10', died: '2026-05-10', kids: 0, age: '55to80' }).survivors.amount === 1838, '8 months but aged 55+: half a year is enough; 1,838 a month');
const kid8 = run({ question: 'death', since: '2025-09-10', died: '2026-05-10', kids: 1, age: '40to50' });
check(kid8.survivors.state === 'prove' && test(kid8, 'roof').state === 'open' && line(kid8, 'survivors').have.includes('אלמן צריך 12'), '8 months with a child: a widow qualifies, a widower needs 12 months');
check(run({ question: 'death', kids: 2 }).survivors.amount === 3562 && run({ question: 'death', kids: 3 }).survivors.amount === 4424, 'two children 3,562; three 3,562 + 862 = 4,424');
check(run({ question: 'death', kids: 0, age: '80p' }).survivors.amount === 1941 && run({ question: 'death', kids: 0, age: '40to50' }).survivors.amount === 1381, '80+: 1,941; 40-50 without children: 1,381');
const g = run({ question: 'death', kids: 0, age: 'u40', since: '2020-01-01', died: '2025-01-01' });
check(g.survivors.row.grant === true && g.survivors.amount === null && g.deadlines[0].date === '2026-06-30', 'under 40 without children: a grant; filed before 18 months from January 2025 -> by 30.6.2026');
check(g.flags.some((f) => f.code === 'late' && f.level === 'warn'), 'the grant window has passed on 21.10.2026: a late warning');
const sep = run({ question: 'separation' });
check(line(sep, 'inherit').state === 'no' && line(sep, 'inherit').cites.some((c) => c.text === fy.succession.revoke) && line(sep, 'survivors').state === 'no', 'separation: s.55 will not apply; the will stays until revoked (s.36(א)); no survivors pension');
check(sep.rehearse.purpose === 'mediation' && line(sep, 'spousal').state === 'no' && line(sep, 'pension_split').state === 'prove', 'separation: mediation; no spousal maintenance by law; the pension split law applies (s.2)');
const apart = run({ household: false });
check(line(apart, 'nii').state === 'no' && test(apart, 'household').state === 'not' && test(apart, 'roof').state === 'not' && apart.flags.some((f) => f.code === 'apart'), 'not living together: no NI status, two tests not met, a warning');
const both = run({ home: 'both' });
check(line(both, 'home').state === 'have' && both.met === 5 && both.applicable === 5, 'registered to both: the home line is "have"; 5 of 5');
const none = run({ home: 'none', kids: 0 });
check(test(none, 'sharing').state === 'na' && none.applicable === 4 && none.met === 3 && !line(none, 'home'), 'no apartment and no child: sharing not checked, 3 of 4, no home line');
check(run({ question: 'death' }).flags.some((f) => f.code === 'died') && run({ question: 'death' }).deadlines[0].kind === 'reminder', 'death without a date: a note, and the reminder instead of the claim date');

/* ---------- 4. Edges ---------- */
check(run({ since: TODAY }).months === 0 && run({ since: TODAY }).ok, 'since today: 0 months, still valid');
check(run({ question: 'death', since: '2025-05-10', died: '2026-05-10', kids: 0 }).survivors.state === 'prove', 'exactly 12 months at the death: the survivors test is met');
check(run({ question: 'death', since: '2025-05-11', died: '2026-05-10', kids: 0 }).survivors.state === 'no', '11 months and 29 days, no child: not met');
check(run({ question: 'death', since: '2025-11-10', died: '2026-05-10', kids: 0, age: '55to80' }).survivors.state === 'prove', 'aged 55+, exactly 6 months: met');
check(run({ question: 'death', since: '2025-11-11', died: '2026-05-10', kids: 0, age: '55to80' }).survivors.state === 'no', 'aged 55+, one day short of 6 months: not met');
check(E.monthsBetween('2024-01-31', '2024-02-29') === 0 && E.monthsBetween('2024-01-31', '2024-03-31') === 2, 'full months count the day of the month');
check(E.lastDayOfMonthAfter('2025-01-01', 17) === '2026-06-30', 'the last day of the 18th month window');

/* ---------- 5. Every input error ---------- */
const err = (over, field) => { const x = run(over); return !x.ok && x.errors.some((e) => e.field === field); };
check(err({ since: '' }, 'since') && err({ since: '31.2.2020' }, 'since') && err({ since: 'מרץ' }, 'since'), 'since: empty, impossible day, words');
check(err({ since: '2027-01-01' }, 'since'), 'since after today');
check(err({ kids: 4 }, 'kids') && err({ kids: -1 }, 'kids') && err({ kids: 1.5 }, 'kids'), 'kids: 0 to 3 only');
check(err({ question: 'death', died: '2018-01-01' }, 'died') && err({ question: 'death', died: '2027-01-01' }, 'died') && err({ question: 'death', died: '40.1.2026' }, 'died'), 'died: before since, after today, impossible');
check(err({ remind: '2026-10-20' }, 'remind') && err({ remind: 'מחר' }, 'remind'), 'remind: in the past, words');
check(run({ question: 'separation', died: 'xx' }).ok, 'a death date is ignored unless the question is a death');

/* ---------- 6. Snapshot, renderers, text equivalents ---------- */
const snap = U.snapshot(reg);
const html = [snap.form, snap.result, snap.details, snap.method, snap.compare_table].join('');
check(snap.tool === 'yeduim-batzibur' && snap.registry_version === reg.registry_version, 'snapshot ids');
check(!/<h2[\s>]/i.test(html), 'no <h2> in any rendered HTML');
check(clean(html) && clean(snap.sentence) && clean(snap.brief), 'no undefined / NaN / null in the snapshot');
check(snap.result.includes('2,700') && snap.details.includes('330.40') && snap.details.includes('541') && snap.details.includes('1,381'), 'the snapshot carries 2,700, 330.40, 541 and the survivors table');
check(snap.result.includes('nevo.co.il/law_html/law00/72178.htm') && snap.result.includes('btl.gov.il') && snap.result.includes('sf-21.pdf'), 'the result cites the Succession Law, the Institute and C.A. 52/80');
check(/<table class="jt43-ledger"[^>]*>.*<caption>/.test(snap.result) && (snap.result.match(/<th scope="row"/g) || []).length === 9, 'the ledger is a table with a caption and 9 row headers for the daily question');
check(/class="jt43-meter" role="group" aria-label="מד ההוכחה: \d מתוך \d/.test(snap.result) && fy.tests.every((t) => snap.result.includes(t.he)), 'the proof meter has a text label and names all five tests');
check(/<caption>נשואים מול ידועים בציבור/.test(snap.compare_table) && (snap.compare_table.match(/<tr>/g) || []).length === 12, 'compare table: caption, a header and 11 rows');
check(snap.method.startsWith('<ol>') && snap.method.includes('330.40') && snap.method.includes('91 חודשים') === (r.months === 91), 'the method is an ordered path with the hand figures');
check(snap.sticky.includes('<bdi>4</bdi>') && snap.total === 4, 'sticky: 4 of 5');
check(snap.result.includes('<bdi>2,700</bdi>') && !/&#<bdi>|&<bdi>|<bdi>[^<]*<bdi>/.test(html), 'numbers in running text sit in <bdi>, and no entity or tag is split');
check(noPortal(html + snap.brief), 'no portal name in any rendered text');
for (const q of ['daily', 'separation', 'death']) {
	const x = run({ question: q, died: q === 'death' ? '2026-05-10' : '' });
	const all = U.renderForm(reg, Object.assign({}, EX, { question: q })) + U.renderResult(reg, x) + U.renderDetails(reg, x);
	check(!/<h2[\s>]/i.test(all) && clean(all), `${q}: no <h2> and no undefined/NaN/null`);
	check(/<h4>מה עושים עכשיו<\/h4>/.test(all) && /<h4>התרחיש לסימולציה<\/h4>/.test(all), `${q}: the result ends with "מה עושים עכשיו" and shows the scenario`);
	const acts = U.nextActions(reg, x);
	const internal = acts.filter((a) => a.path);
	check(acts.some((a) => a.official && official(a.url)) && internal.length >= 2 && internal.length <= 4 && internal.every((a) => a.path.startsWith('/') && a.path.endsWith('/')), `${q}: an official link and 2-4 internal next steps`);
}
const bad = E.compute(reg, Object.assign({}, EX, { since: '' }));
check(U.renderResult(reg, bad).includes('צריך לתקן') && U.renderDetails(reg, bad) === '', 'an input error renders the error state only');

/* ---------- 7. The scenario for the simulation ---------- */
const briefs = [r, sep, d1, m, g, apart].map((x) => U.aiBrief(reg, x));
check(briefs.every((b) => words(b) >= 40 && words(b) <= 90), `every scenario is 40-90 words (${briefs.map(words).join(', ')})`);
check(briefs.every((b) => !/\d{9}/.test(b) && clean(b)), 'no 9-digit sequence and no undefined in any scenario');
check(briefs[0].includes('7 שנים') && briefs[2].includes('2,700') && briefs[1].includes('לגישור'), 'the scenario carries the years, the pension and the question to rehearse');
check(U.simUrl('mediation') === 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=family-law', 'the simulation link matches the server format, family-law');
check(U.renderResult(reg, sep).includes('purpose=mediation') && U.renderResult(reg, r).includes('purpose=court_rehearsal'), 'the visible rehearse button follows the question');

/* ---------- 8. Print, .ics, share link ---------- */
const pr = U.printHtml(reg, d1);
check(pr.includes('הודפס ב-21.10.2026') && pr.includes('מה הזנתם') && pr.includes('10.5.2027') && pr.includes('מידע כללי'), 'the print sheet: date printed, inputs, the deadline, the disclaimer');
check(d1.lines.every((l) => pr.includes(l.topic)) && pr.includes('נוסח עדכני ל-1.1.2025') && pr.includes('מ-1.1.2026'), 'the print sheet lists every line and the sources with their dates');
const evD = U.icsEvents(reg, d1);
const icsD = ics(evD, '2026-10-21T20:00:00Z');
check(evD.length === 1 && icsD.includes('DTSTART;VALUE=DATE:20270510') && icsD.includes('SUMMARY:ידועים בציבור: תביעה לקצבת שארים'), '.ics after a death: the claim date 10.5.2027');
const icsR = ics(U.icsEvents(reg, r), '2026-10-21T20:00:00Z');
check(icsR.includes('DTSTART;VALUE=DATE:20261120') && icsR.includes('\\,') && !/DESCRIPTION:[^\r]*[^\\],/.test(icsR), '.ics reminder: 20.11.2026, commas escaped');
check(U.icsText('a,b;c\\d\ne') === 'a\\,b\\;c\\\\d\\ne', 'RFC 5545 text escaping');
for (const over of [{}, { question: 'death', died: '10.5.2026', age: '55to80', family: 'siblings', kids: 0, home: 'both' }, { question: 'separation', household: false, married: true, kids: 3, home: 'none', remind: '1.12.2026' }]) {
	const input = Object.assign({}, EX, over);
	const back = U.inputOf(decodeState(U.stateOf(input), U.KEYS));
	const a1 = E.compute(reg, input);
	const a2 = E.compute(reg, Object.assign({}, back, { today: TODAY }));
	check(a2.ok && JSON.stringify(a1.tests) === JSON.stringify(a2.tests) && JSON.stringify(a1.deadlines) === JSON.stringify(a2.deadlines) && a1.question === a2.question && a1.home === a2.home, `share link round trip (${over.question || 'daily'})`);
}
check(!/[A-Za-z]{3,}@|\d{9}/.test(U.stateOf(EX)), 'the share state carries no name, e-mail or ID');

/* ---------- 9. The simulation handoff and the result-first card (polish round, 22.10.2026) ---------- */
check(U.renderResult(reg, sep).includes('>לתרגל את הגישור עם הנתונים שלכם</a>') && U.renderResult(reg, r).includes('>לתרגל את ההוכחה בבית המשפט עם הנתונים שלכם</a>') && !/להעתיק/.test(U.renderResult(reg, r)), 'the rehearse button opens the practice with your data; its label no longer says copy');
const hs = handoffState('x', U.aiBrief(reg, r), 'court_rehearsal');
check(hs.phase === 'intake' && hs.locale === 'he' && hs.simulationPurpose === 'court_rehearsal' && hs.description.includes('7 שנים') && !/\d{9}/.test(hs.description), 'handoff state: intake, Hebrew, the scenario with "7 שנים", no 9-digit run');
const hsSep = handoffState('y', U.aiBrief(reg, sep), 'mediation');
check(hsSep.phase === 'intake' && hsSep.description.includes('לגישור') && hsSep.simulationPurpose === 'mediation', 'separation: the handoff carries the mediation scenario');
check(snap.lead.includes('דוגמה מחושבת: מבחני ההוכחה') && snap.lead.includes('<bdi>4</bdi> מתוך <bdi>5</bdi>') && snap.lead.includes('<bdi>2,700</bdi>') && snap.lead.includes('נשאר להוכיח: כוונת השיתוף בדירה') && snap.lead.includes('href="#jtool-yeduim-batzibur" data-lead-go'), 'the lead card: 4 of 5, inheritance as married and 2,700 a month, what is left to prove, the jump');
check(!/<h2[\s>]/i.test(snap.lead) && clean(snap.lead), 'the lead card: no h2, no undefined/NaN/null');
const leadBad = U.leadCard(reg, bad, { example: false });
check(leadBad.includes('jtool-lead__figure">—') && leadBad.includes('ממתי אתם גרים יחד') && leadBad.includes('לשנות את הנתונים') && clean(leadBad), 'the lead card on an input error: a dash and the error');
check(U.leadCard(reg, sep, {}).includes('החישוב שלכם') && U.leadCard(reg, sep, {}).includes('איזון משאבים לא חל') && U.leadCard(reg, m, {}).includes('לא מתקיים: שאף אחד מכם לא נשוי לאחר'), 'the lead card for separation and for a partner married to another');
check(snap.sticky === `<bdi>${snap.total}</bdi> מתוך <bdi>5</bdi>`, 'the snapshot sticky is the same string the mount writes');

/* ---------- 10. The checklist ---------- */
check(U.checklist(reg, r).length === fy.nii.documents_he.length && U.checklist(reg, d1)[0].includes('112'), 'documents: the questionnaire list; after a death, questionnaire 112 first');
check(U.checklistText(reg, r).startsWith('1. ') && !U.checklistText(reg, r).includes('undefined'), 'the copied list is numbered');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
