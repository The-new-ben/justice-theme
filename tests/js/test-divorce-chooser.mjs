/**
 * Golden tests for choosing a divorce lawyer (bchirat-orech-din, HAD-616, 31.10.2026).
 * Run: node tests/js/test-divorce-chooser.mjs
 *
 * The tool holds no number and ranks no one: these tests pin the rules (the profile per answer, the urgent step first, the
 * questions capped at seven, the calculator preset per situation, the directory link per city), the honest label of the
 * featured lawyer, and the share link's round trip.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as U from '../../assets/js/tools/bchira-ui.js';
import * as C from '../../assets/js/tools/machshevon-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const b = reg.fl_bchira;
const run = (over) => U.bcCompute(reg, Object.assign(U.bcDefaults(reg), over || {}));
const bad = (s) => /undefined|NaN|\bnull\b|\[object/.test(s);

/* ---------- 1. The dataset ---------- */
check(b && b.checked_on === '2026-10-31' && b.questions.length === 5 && b.cities.length >= 10, 'dataset: five questions and the directory cities');
check(b.questions.every((q) => q.options.length >= 3 && q.options.every((o) => o.v && o.he)), 'dataset: every question has its options');
check(!/\d{3,}/.test(JSON.stringify(b.profile) + JSON.stringify(b.ask) + JSON.stringify(b.red_flags)), 'dataset: no price or count in the rules (the cost lives in the calculator)');
check(Object.values(b.calc_preset).every((k) => C.PRESETS[k]) && C.PRESETS.plain && C.PRESETS.mediate, 'dataset: every preset exists in the divorce calculator');
check(!/המומלצ|הטוב ביותר|הטובה ביותר|מוביל/.test(b.featured.label_he + b.disclosure_he) && b.featured.label_he.includes('בודקת') && b.disclosure_he.includes('לא מדרג'), 'dataset: no superlative (Bar advertising rule 2א); the featured lawyer is labelled by fact, and the tool says it ranks no one');
check(b.sources.length >= 2 && b.sources.every((s) => /^https:\/\//.test(s.url)), 'dataset: sources with links');

/* ---------- 2. The profile ---------- */
const ex = run();
check(ex.ok && ex.profile.startsWith(b.profile.stage.agree) && ex.profile.includes(b.profile.open.kids) && ex.profile.includes(b.profile.open.home) && ex.profile.endsWith('.'), 'example: agree + kids + home');
check(!ex.urgent && ex.preset === 'kids' && ex.dir === '/lawyers/?area=family-law', 'example: no urgent step, the calculator\'s "kids" preset, the whole directory');
const rb = run({ stage: 'dispute', forum: 'rabbinical', open: ['business'] });
check(rb.profile.includes(b.profile.forum.rabbinical) && rb.profile.includes(b.profile.open.business) && rb.preset === 'war', 'dispute in the rabbinical court with a business: forum and subject in the profile, the full-dispute preset');
check(run({ stage: 'case' }).preset === 'half' && run({ stage: 'agree', open: [] }).preset === 'plain' && run({ stage: 'think' }).preset === 'mediate' && run({ stage: 'think', open: [] }).preset === 'plain', 'presets: case, agree without kids or home, thinking with and without');
const three = run({ open: ['kids', 'home', 'pension'] });
check(three.profile.includes(`, וגם ${b.profile.open.pension}`), 'three subjects: joined with "וגם" before the last');

/* ---------- 3. Urgent, questions, warnings ---------- */
const v = run({ urgent: 'violence' });
check(v.urgent && v.urgent.he.includes('100') && v.urgent.anchor.startsWith('#'), 'violence: the urgent step with the emergency number and the page anchor');
const html = U.renderResult(reg, v);
check(html.indexOf('קודם כול') < html.indexOf('מה אתם צריכים'), 'violence: the urgent step prints before the profile');
const all = run({ stage: 'dispute', forum: 'rabbinical', focus: 'cost', open: ['kids', 'home', 'business', 'pension', 'abroad'] });
check(all.ask.length === 7 && all.ask.slice(0, 3).every((a, n) => a === b.ask[n].he), 'questions: the three general ones first, capped at seven');
check(ex.ask.length === 5 && ex.ask.includes(b.ask.find((a) => a.when === 'stage:agree').he) && ex.ask.includes(b.ask.find((a) => a.when === 'open:kids').he), 'questions: the example gets the agreement and the children questions');
check(ex.flags.length === 4 && ex.flags.some((f) => f.includes('ניגוד עניינים')), 'warnings: four, conflict of interest among them');

/* ---------- 4. City and the directory ---------- */
check(run({ city: 'haifa' }).dir === '/lawyers/?area=family-law&city=haifa' && run({ city: 'nowhere' }).dir === '/lawyers/?area=family-law', 'directory: by city, an unknown city falls back to the whole country');
const details = U.renderDetails(reg, run({ city: 'jerusalem' }));
check(details.includes('בירושלים') && details.includes('data-preset="kids"') && details.includes(b.featured.path) && details.includes(b.disclosure_he), 'details: the city, the calculator preset, the featured profile and the disclosure');

/* ---------- 5. Validation and rendering ---------- */
const badStage = U.bcCompute(reg, Object.assign(U.bcDefaults(reg), { stage: 'x' }));
check(!badStage.ok && badStage.errors[0].field === 'stage' && !bad(U.renderResult(reg, badStage)), 'validation: an unknown answer asks for an answer');
check(U.bcCompute(reg, Object.assign(U.bcDefaults(reg), { open: ['kids', 'evil'] })).input.open.join() === 'kids', 'validation: unknown subjects are dropped');
for (const stage of ['think', 'agree', 'dispute', 'case']) {
	for (const urgent of ['none', 'violence', 'assets', 'travel']) {
		const r = run({ stage, urgent, forum: 'family' });
		check(r.ok && !bad(U.renderResult(reg, r) + U.renderDetails(reg, r) + U.printSummary(reg, r, '2026-10-31')), `render ${stage}/${urgent}`);
	}
}

/* ---------- 6. Share link ---------- */
const input = Object.assign(U.bcDefaults(reg), { stage: 'dispute', open: ['business', 'abroad'], urgent: 'assets', forum: 'family', focus: 'full', city: 'netanya' });
const back = U.inputOf(reg, decodeState(U.stateOf(reg, input), U.KEYS));
check(JSON.stringify(back) === JSON.stringify(input), 'share link: every answer survives the round trip');
check(!/[א-ת]/.test(U.stateOf(reg, input)), 'share link: letters and digits only');

/* ---------- 7. Snapshot ---------- */
const snap = U.snapshot(reg);
check(snap.form.includes('jt74-city') && snap.result.includes(ex.profile) && snap.answer.ask_n === 5 && !bad(JSON.stringify(snap)), 'snapshot: form, result and the answer box figures');

console.log(`divorce lawyer chooser: ${passed} passed, ${failures} failed`);
if (failures) { process.exit(1); }
