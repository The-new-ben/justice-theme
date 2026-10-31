/**
 * Golden tests for the divorce statistics (netunei-gerushin, HAD-616 b, 31.10.2026).
 * Run: node tests/js/test-divorce-stats.mjs
 *
 * Expected values are the published figures, read on 31.10.2026: the Statistical Abstract of Israel 2026, table 2.20
 * (12.10.2026): 2024 divorces 16,499 (Jews 12,489, Muslims 2,808, Christians 177, Druze 186), marriages 53,025, 2014
 * divorces 14,430, the earlier peak 16,300 in 2021; "Divorce, selected data" (15.9.2026): 1.7 per 1,000 residents, 8.8 per
 * 1,000 married, median age 43.0 (husbands) and 39.8 (wives) in 2024; table 2.25: aged 35-39, 2,693 wives and 2,507
 * husbands, 12.3 and 12.0 per 1,000 married; the rabbinical courts on data.gov.il: 11,093 couples in 2025.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as U from '../../assets/js/tools/netunim-ui.js';
import { decodeState } from '../../assets/js/tools/instrument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
const src = JSON.parse(readFileSync(join(ROOT, 'tools/justice_tools_fl_netunim.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const n = reg.fl_netunim;
const c = n.series.count;
const bad = (s) => /undefined|NaN|\bnull\b|\[object/.test(s);

/* ---------- 1. The published figures ---------- */
check(n.checked_on === '2026-10-31' && n.latest_year === '2024', 'dataset: checked 31.10.2026, latest CBS year 2024');
check(c.all['2024'] === 16499 && c.jews['2024'] === 12489 && c.muslims['2024'] === 2808 && c.christians['2024'] === 177 && c.druze['2024'] === 186, 'table 2.20: 2024 by religion');
check(n.series.marriages.all['2024'] === 53025 && c.all['2014'] === 14430 && c.all['2021'] === 16300 && c.all['2022'] === 15196, 'table 2.20: marriages 2024, divorces 2014, 2021, 2022');
check(n.series.rate.all['2024'] === 1.7 && n.series.married.all['2024'] === 8.8 && n.series.age_m.all['2024'] === 43 && n.series.age_f.all['2024'] === 39.8, 'selected data: rates and median ages 2024');
check(c.all['1955'] === 2156 && Object.keys(c.all).length === 70 && !('2025' in c.all), 'series: 1955 to 2024, 70 years, no 2025 (not yet published)');
check(JSON.stringify(n.series) === JSON.stringify(src.series) && JSON.stringify(n.rabbinical_tables) === JSON.stringify(src.rabbinical_tables), 'registry: identical to the committed source file');
for (const y of Object.keys(c.all)) {
	const parts = ['jews', 'muslims', 'christians', 'druze'].map((g) => c[g][y]);
	if (parts.every((v) => typeof v === 'number')) {
		check(parts.reduce((s, v) => s + v, 0) <= c.all[y], `series ${y}: the four communities never exceed the total (the total includes unknown religion)`);
	}
}
const files = n.rabbinical_tables.find((t) => t.id === 'files');
check(files.rows.find((r) => r.year === '2025').couples === 11093 && files.rows.find((r) => r.year === '2024').couples === 11539, 'rabbinical courts: couples divorced 2024 and 2025');
check(n.sources.every((s) => /^https:\/\//.test(s.url) && s.published) && n.sources.some((s) => s.url.includes('st02_20.xlsx')), 'sources: every one linked and dated, table 2.20 among them');

/* ---------- 2. The engine ---------- */
const ex = U.ntCompute(reg, U.ntDefaults(reg));
check(ex.ok && ex.input.year === '2024' && ex.input.vs === '2014' && ex.value === 16499 && ex.change === 14.3, 'example: 2024 against 2014, +14.3%');
check(ex.sentence === 'בשנת 2024 התגרשו בישראל 16,499 זוגות, 14.3% יותר מבשנת 2014 (14,430).', 'example: the sentence');
const ratio = U.ntCompute(reg, { metric: 'ratio', year: '2024' });
check(ratio.value === 31.1 && ratio.sentence.includes('31.1 גירושין לכל 100 חתונות'), 'ratio: 16,499 / 53,025 = 31.1 per 100 weddings');
const druze = U.ntCompute(reg, { metric: 'rate', group: 'druze', year: '1970' });
check(druze.ok && druze.input.year === '2024' && druze.years[0] === '2000', 'rate: from 2000 only; a year before the series falls back to the latest');
const age = U.ntCompute(reg, { metric: 'age_f', group: 'jews' });
check(age.ok && age.sentence.includes('הגיל החציוני של אישה שהתגרשה') && age.sentence.includes('בקרב יהודים') && /שנים (יותר|פחות)|כמו בשנת/.test(age.sentence), 'median age: the change in years, among Jews');
const same = U.ntCompute(reg, { year: '2024', vs: '2024' });
check(same.input.vs === '2014', 'a year against itself moves the comparison ten years back');

/* ---------- 3. The breakdowns and "your age" ---------- */
const a38 = U.ntCompute(reg, { age: '38', cut: 'age_f' });
check(a38.age && a38.age.band === '35-39' && a38.age.wives === 2693 && a38.age.husbands === 2507 && a38.age.rateF === 12.3 && a38.age.rateM === 12, 'age 38: band 35-39 of table 2.25, women and men, rates per 1,000 married');
check(U.liveBlock(reg, a38).includes('jt75-row is-you') && U.renderResult(reg, a38).includes('2,693'), 'age 38: the band is marked in the age breakdown, the line under the sentence');
check(U.ntCompute(reg, { age: '70' }).age.band === '55 ומעלה' && !U.ntCompute(reg, { age: '12' }).ok && !U.ntCompute(reg, { age: 'abc' }).ok, 'age: 70 falls in 55+; 12 and text are refused');
const city = U.ntCompute(reg, { cut: 'city' });
const cityHtml = U.liveBlock(reg, city);
check(cityHtml.includes('בני ברק') && cityHtml.includes('<bdi>2.8</bdi>') && cityHtml.includes('<bdi>5.3</bdi>'), 'cities: rates per 1,000 women 15+ (Bnei Brak 2.8, Beer Sheva 5.3)');
check(U.liveBlock(reg, U.ntCompute(reg, { cut: 'district' })).includes('(2022)'), 'district: labelled 2022, the latest table by district');
check(U.liveBlock(reg, U.ntCompute(reg, { cut: 'rb_outcome' })).includes('<bdi>78%</bdi>'), 'rabbinical claims: 78% ended in a divorce (IDI 2024)');

/* ---------- 4. Every measure and community renders ---------- */
for (const m of n.metrics) {
	for (const g of U.ntGroups(reg, m.id)) {
		const r = U.ntCompute(reg, { metric: m.id, group: g.id });
		check(r.ok && !bad(U.renderResult(reg, r) + U.liveBlock(reg, r)), `render ${m.id}/${g.id}`);
	}
}
const details = U.renderDetails(reg, ex);
check(details.includes('jt75-live') && details.includes('<th scope="row" data-th="שנה">1955</th>') && details.includes('11,093') && details.includes('חיוב גט') && !bad(details), 'details: the full table from 1955, the rabbinical tables');
check((details.match(/<tr>/g) || []).length > 100, 'details: every year and the rabbinical rows in the server HTML');

const other = U.ntCompute(reg, { metric: 'married', group: 'jews', year: '2010' });
check(U.printText(reg, other, '2026-11-01') === `${other.sentence} (נתוני גירושין בישראל, jus-tice.co.il, 1.11.2026)` && U.printText(reg, other, '2026-11-01') !== U.printText(reg, ex, '2026-11-01'), 'print: the line follows the current choice, not the server example (PR 176 review)');
const clash = U.ntCompute(reg, { year: '2014', vs: '2014' });
check(clash.input.year === '2014' && clash.input.vs === '2004', 'a year against itself: the engine moves the comparison ten years back, and mount() writes it into the menu (PR 176 review)');

/* ---------- 5. Share link ---------- */
const input = { metric: 'married', group: 'muslims', year: '2010', vs: '2020', cut: 'city', age: '41' };
const back = U.inputOf(reg, decodeState(U.stateOf(reg, input), U.KEYS));
check(JSON.stringify(back) === JSON.stringify(input), 'share link: every choice survives the round trip');

/* ---------- 6. Snapshot ---------- */
const snap = U.snapshot(reg);
check(snap.answer.count === 16499 && snap.answer.peak_prev.year === '2021' && snap.answer.peak_prev.value === 16300 && snap.answer.rb_year.couples === 11093 && snap.answer.consent_days.value === 58 && snap.answer.women_filed_pct.value === 67, 'snapshot: the answer box figures');
check(snap.form.includes('jt75-age') && snap.result.includes('16,499') && !bad(JSON.stringify(snap)), 'snapshot: the form and the example');

console.log(`divorce statistics: ${passed} passed, ${failures} failed`);
if (failures) { process.exit(1); }
