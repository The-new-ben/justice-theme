/**
 * Golden tests for the disability-degree instrument (shiklul-nechut, the road-accident and personal-injury wave,
 * 22.10.2026, HAD-591). Run: node tests/js/test-injury-shiklul.mjs
 *
 * Every expected value is computed by hand from the official texts: the National Insurance (Determining the Degree of
 * Disability of Work-Injury Victims) Regulations 1956 (Nevo and btl.gov.il/Laws1, with KT 12359 in force 1.5.2026):
 * reg. 11(ב) the weighting (the largest in full, each next one times what is left), 11(ג)(1) the joint cap, 11(ו) the
 * left-hander, reg. 15(א) up to half, 19% under 20%, 100%, reg. 19א a pension degree's fraction rounded up, reg. 27(א) 30
 * days, reg. 28 30 more days, reg. 36 six months, reg. 17 12-60 months; the schedule's items and its two tables (52(1),
 * 72(1)); the National Insurance Law ss.104-107 (pension 20% stable / 9% temporary, grant 9% to under 20%, 30 x the daily
 * allowance, 43 monthly pensions); the Institute's examples (20% + 10% = 28%; 30% - 10% previous = 20%; 30% -> 45% by
 * reg. 15) and its appeal page (60 days to the labour court); the 1984 general-disability regulations (reg. 3(ב) rounding,
 * their list of items left out); the 1976 road regulations (1% of the maximum per percent, less 1% a year over 30).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/shiklul-engine.js';
import * as U from '../../assets/js/tools/shiklul-ui.js';
import * as NC from '../../assets/js/tools/nechut-ui.js';
import * as TE from '../../assets/js/tools/teuna-engine.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const S = reg.injury_shiklul;
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const run = (over) => E.skCompute(reg, Object.assign({}, U.EXAMPLE, over));
const items = (...list) => list.map((x) => (typeof x === 'string' ? { code: x } : (typeof x === 'number' ? { code: '', pct: x } : x)));
const ev = (r, key) => (r.events.find((e) => e.key === key) || {}).date;

/* ---------- 1. The registry ---------- */
check(S && S.checked_on === '2026-10-22' && S.next_update === '2027-01-01' && reg.registry_version >= '2026-10-22', 'registry: injury_shiklul checked 22.10.2026, next update 1.1.2027');
check(S.regs.url.includes('nevo.co.il') && S.regs.btl_url.startsWith('https://www.btl.gov.il/Laws1/') && S.regs.current_to === '2026-05-01', 'registry: the regulations on Nevo and btl.gov.il/Laws1, current to KT 12359 (1.5.2026)');
const V = S.tables.vision.grid;
const H = S.tables.hearing.grid;
check(V.length === 10 && V.every((r, i) => r.length === 10 && r.every((c, j) => c === V[j][i])) && H.length === 14 && H.every((r, i) => r.length === 14 && r.every((c, j) => c === H[j][i])), 'tables: sight 10 x 10 and hearing 14 x 14, symmetric as both official sources print them');
check(V[0][7] === 25 && V[3][9] === 45 && V[8][2] === 35 && V[9][9] === 100 && V[0][0] === 0, 'sight table 52(1): 6/6 & 3/60 = 25, 6/15-18 & NLP = 45 (KT 5737 "40" -> "45"), 1/60 & 6/12 = 35 ("30" -> "35"), NLP & NLP = 100');
check(H[0][0] === 0 && H[5][2] === 10 && H[13][13] === 60 && H[0][13] === 10 && H[4][4] === 20, 'hearing table 72(1): 15-20 both = 0, 41-45 & 26-30 = 10, over 80 both = 60, 15-20 & over 80 = 10, 36-40 both = 20');
check(S.items.length >= 20 && S.items.length <= 40 && S.items.every((x) => x.item && x.he && (x.pct !== undefined ? x.pct >= 0 && x.pct <= 100 : x.r >= 0 && x.l >= 0)), `curated items: ${S.items.length} (20-40), each with its item number and the % the schedule prints`);
check(E.skItem(reg, 'c37-5a').pct === 10 && E.skItem(reg, 'c37-7c').pct === 30 && E.skItem(reg, 'c41-4d').r === 35 && E.skItem(reg, 'c43-1c').r === 15 && E.skItem(reg, 'c43-1c').l === 10 && E.skItem(reg, 'c48-2z2').pct === 20 && E.skItem(reg, 'c34b3').pct === 20, 'items: 37(5)(א) 10%, 37(7)(ג) 30%, 41(4)(ד) 35%, 43(1)(ג) right 15% / left 10%, 48(2)(ז)(II) 20%, 34(ב)(3) 20% (the schedule, pp.55-64)');
check(S.joints.knee.r === 50 && S.joints.shoulder.r === 50 && S.joints.shoulder.l === 40 && S.joints.ankle.r === 30, 'joint caps of reg. 11(ג)(1): knee 50% (48(2)(ד)), shoulder 50% / 40% (41(3)(ב)), ankle 30% (48(3)(ג))');
check(reg.rights_nechut.medical.min === 60 && reg.rights_nechut.medical.alt_min === 40 && reg.rights_nechut.medical.single_min === 25 && reg.car_accident.nonpecuniary.disability_pct_per_pct === 1 && reg.car_accident.nonpecuniary.age_from === 30, 'reused: the general-disability gates (60 / 40 with 25) and the road regulations (1% per percent, from age 30)');
check([S.appeal.url, S.institute.calculator_url, S.r15.circular_url, S.law.url, S.general.url].every((u) => u.startsWith('https://www.btl.gov.il/')) && S.appeal.days === 30 && S.appeal.reasons_extra === 30 && S.appeal.court_days === 60, 'registry: the Institute\'s pages, appeal 30 + 30 days, labour court 60 days');

/* ---------- 2. The weighting of reg. 11(ב) ---------- */
check(E.skCombine([20, 10]).total === 28 && E.skCombine([10, 20]).total === 28, 'weighting: 20% + 10% of the 80% left = 28% (the Institute\'s example), in any order');
check(E.skCombine([30, 25]).total === 47.5 && E.skCombine([50, 50, 50]).total === 87.5, 'weighting: 30 + 25 x 0.7 = 47.5; 50 + 25 + 12.5 = 87.5');
check(E.skCombine([100, 20]).total === 100 && E.skCombine([]).total === 0, 'weighting: 100% leaves nothing; no items = 0');
const st3 = E.skCombine([10, 20, 30]).steps;
check(st3[0].pct === 30 && st3[1].from === 70 && st3[1].add === 14 && st3[2].from === 56 && st3[2].add === 5.6 && st3[2].rest === 50.4, 'steps: largest first: 30; 20 of 70 = 14; 10 of 56 = 5.6; 50.4 left');

/* ---------- 3. The example (the Institute's case): stable 20% + 10% ---------- */
const ex = E.skCompute(reg, U.EXAMPLE);
check(ex.ok && ex.medical === 28 && ex.degree === 28 && ex.outcome === 'pension' && !ex.rounded, 'example: 37(7)(ב) 20% + 48(2)(ז)(I) 10% = 28%, stable, a monthly pension (s.104(ב)(1))');
check(ex.money.full === 12000 && ex.money.monthly === 3360, 'example money: 400 x 30 = 12,000 (s.105(א)); 28% of it = 3,360 a month (s.106)');
check(ev(ex, 'appeal') === '2026-11-08' && ev(ex, 'reasons') === '2026-12-07', 'example dates: delivered 8.10.2026 + 30 = 7.11 (a Saturday) -> 8.11.2026 (reg. 27(א)); + 60 = 7.12.2026 (reg. 28)');
check(ev(ex, 'aggravation') === '2027-04-01' && ev(ex, 'review_from') === '2027-10-01' && ev(ex, 'review_to') === '2031-10-01', 'example dates: decided 1.10.2026: aggravation from 1.4.2027 (reg. 36), reg. 17 window 1.10.2027 - 1.10.2031');
check(ex.general.pct === 28 && ex.general.gate === 'no' && ex.road.share === 23.8, 'example: general disability 28% (under 60, and under 40), road: 28 x 1% less 15% for age 45 = 23.8% of the maximum (regs. 2(א)(2), 3)');

/* ---------- 4. Reg. 15 ---------- */
const r15t = run({ items: items('c37-7c', { code: 'c41-4c', side: 'r' }), r15: 't' });
check(r15t.medical === 47.5 && r15t.r15.raw === 63.333333 && r15t.degree === 64 && r15t.rounded, 'reg. 15 by a third: 30 + 25 x 0.7 = 47.5; x 4/3 = 63.33; a pension degree, rounded up to 64% (reg. 19א)');
check(run({ items: items(30), r15: 'h' }).degree === 45, 'reg. 15 by half: 30% -> 45% (the Institute\'s example)');
check(run({ items: items(20), r15: 'q' }).degree === 25, 'reg. 15 by a quarter: 20% -> 25%');
check(run({ items: items(12), r15: 'h' }).degree === 18 && run({ items: items(12), r15: 'h' }).outcome === 'grant', 'reg. 15 under 20%: 12% x 1.5 = 18%, a grant');
const cap19 = run({ items: items(14), r15: 'h' });
check(cap19.r15.raw === 21 && cap19.degree === 19 && cap19.r15.capped && cap19.outcome === 'grant' && cap19.flags.some((f) => f.code === 'r15_cap'), 'reg. 15 limit: 14% x 1.5 = 21%, but under 20% the result stays at 19% (reg. 15(א)): a grant');
const keep19 = run({ items: items(10, 10), r15: 'h', daily: 300 });
check(keep19.medical === 19 && keep19.degree === 19 && keep19.r15.added === 0, 'reg. 15 at 19%: the limit of 19% never lowers the degree');
check(run({ items: items(80), r15: 'h' }).degree === 100 && run({ items: items(60), r15: 'h' }).degree === 90, 'reg. 15 at 60%: 90%; at 80%: 120% stops at 100%');
const tmp15 = run({ kind: 'temp', items: items(30), r15: 'h' });
check(tmp15.degree === 30 && tmp15.r15 === null && tmp15.flags.some((f) => f.code === 'r15_temp'), 'reg. 15 on a temporary degree: not applied, with the flag');
check(run({ items: items(30), r15: 'x', r15pct: 20 }).degree === 36, 'reg. 15, another rate: 30% + 20% of it = 36%');

/* ---------- 5. Thresholds and rounding (ss.104-107, reg. 19א) ---------- */
check(run({ items: items(8) }).outcome === 'none' && run({ items: items(9) }).outcome === 'grant' && run({ items: items(19) }).outcome === 'grant' && run({ items: items(20) }).outcome === 'pension', 'stable: 8% nothing; 9% and 19% a grant (s.104(ג)); 20% a pension (s.104(ב)(1))');
check(run({ kind: 'temp', items: items(8) }).outcome === 'none' && run({ kind: 'temp', items: items(9) }).outcome === 'temp', 'temporary: 8% nothing; 9% a pension for the period (s.104(ב)(2))');
const g196 = run({ items: items(19.6) });
check(g196.degree === 19.6 && !g196.rounded && g196.outcome === 'grant' && g196.flags.some((f) => f.code === 'no_round_grant'), 'stable 19.6%: entitles to a grant, not a pension, so reg. 19א does not round it (flagged)');
check(run({ items: items(20.2) }).degree === 21 && run({ kind: 'temp', items: items(9.5) }).degree === 10, 'stable 20.2% -> 21%; temporary 9.5% -> 10% (reg. 19א)');
check(keep19.money.monthly === 1710 && keep19.money.grant === 73530, 'grant money: 300 x 30 = 9,000; 19% = 1,710; x 43 = 73,530 (s.107(א))');

/* ---------- 6. Previous condition, joints, sides ---------- */
const prev = run({ items: items({ code: 'c37-7c', prev: 10 }) });
check(prev.degree === 20 && prev.outcome === 'pension' && prev.general.pct === 30 && prev.flags.some((f) => f.code === 'previous'), 'previous condition: 30% - 10% = 20% (the Institute\'s example; s.120(א)); general disability counts the whole 30%');
const knee = run({ items: items({ code: 'c48-2z2' }, { code: 'c48-2e4' }, { code: 'c48-2b' }) });
check(knee.medical === 48.8 && knee.degree === 49 && knee.units.length === 1 && !knee.units[0].capped, 'one knee: 20 + 16 + 12.8 = 48.8% (under the 50% cap), rounded to 49%');
const knee4 = run({ items: items({ code: 'c48-2z2' }, { code: 'c48-2e4' }, { code: 'c48-2b' }, { code: 'c48-2z1' }) });
check(knee4.units[0].raw === 53.92 && knee4.medical === 50 && knee4.units[0].capped && knee4.flags.some((f) => f.code === 'joint' && f.level === 'warn'), 'one knee, four items: 53.92% stops at 50%, the unfavourable ankylosis of the knee (reg. 11(ג)(1), 48(2)(ד))');
const knees = run({ items: items({ code: 'c48-2z2', side: 'r' }, { code: 'c48-2z2', side: 'l' }) });
check(knees.units.length === 2 && knees.medical === 36, 'two knees are two joints: 20 + 20 x 0.8 = 36%');
const thumb = (side, lefty) => run({ items: items({ code: 'c43-1c', side }), lefty }).degree;
check(thumb('r', false) === 15 && thumb('l', false) === 10 && thumb('l', true) === 15 && thumb('r', true) === 10, 'reg. 11(ו): thumb tip 15% right / 10% left; for a left-handed person the columns swap');
const sh = run({ items: items({ code: 'c41-4d', side: 'l' }, { code: 'c41-4c', side: 'l' }), lefty: true });
check(sh.units[0].cap === 50 && sh.units[0].raw === 51.25 && sh.medical === 50, 'left shoulder of a left-handed person: 35 + 25 x 0.65 = 51.25%, capped at the right-hand column, 50%');

/* ---------- 7. The two tables ---------- */
check(E.skHearing(reg, 45, 30).pct === 10 && E.skHearing(reg, 90, 85).pct === 60 && E.skHearing(reg, 20, 21).pct === 0 && E.skHearing(reg, 21, 21).pct === 5, 'hearing: 45 & 30 dB = 10%; both over 80 = 60%; 20 & 21 = 0%; 21 & 21 = 5%');
const gap = E.skHearing(reg, 20.5, 30);
check(!gap.ok && gap.why === 'gap' && gap.options.join() === '0,5' && !E.skHearing(reg, 10, 40).ok && E.skHearing(reg, 10, 40).why === 'below', 'hearing: 20.5 dB is between two rows (0% or 5%), not guessed; under 15 dB is below the table');
check(E.skVision(reg, 0, 7).pct === 25 && E.skVision(reg, 2, 3).pct === 15 && E.skVision(reg, 0, 9).pct === 30 && !E.skVision(reg, 0, 10).ok, 'sight: 6/6 & 3/60 = 25%; 6/12 & 6/15 = 15%; 6/6 & NLP = 30%; an unknown class is an error');
const ptsd = E.skCompute(reg, U.skPreset('ptsd', {}));
check(ptsd.medical === 28 && ptsd.kind === 'temp' && ptsd.outcome === 'temp' && ptsd.general.pct === 20 && ptsd.general.out.length === 1, 'post-trauma 20% + hearing 10% = 28%, temporary; for general disability the hearing item is left out (one ear at 40 dB or less)');

/* ---------- 8. General disability and road ---------- */
check(r15t.general.pct === 48 && r15t.general.gate === 'alt' && r15t.general.largest === 30, 'general: 47.5% rounded up to 48% (1984 reg. 3(ב)), no reg. 15; 40% with one item of 30% (25% or more): the alternative gate');
check(run({ items: items(50, 30) }).general.gate === 'min', 'general: 50 + 15 = 65%: over 60%');
const g2519 = run({ items: items(25, 19) });
check(g2519.general.raw === 39.25 && g2519.general.pct === 40 && g2519.general.gate === 'alt' && g2519.degree === 39.25 + 0.75, 'general: 25 + 19 x 0.75 = 39.25%, rounded up to 40% (1984 reg. 3(ב)), with one item of 25%: passes the 40% gate; for work injury 39.25% is a pension degree, rounded to 40% (reg. 19א)');
const out = run({ items: items('c37-8a', 'c37-7b') });
check(out.medical === 24 && out.general.pct === 20 && out.general.out[0].item === '37(8)(א)', 'general: 37(8)(א) (5%) is left out by the 1984 schedule: 24% for work, 20% for general disability');
const see3 = run({ items: items({ code: 'see', a: 0, b: 7 }) });
const see2 = run({ items: items({ code: 'see', a: 2, b: 3 }) });
check(see3.general.pct === 25 && see2.general.pct === 0 && see2.general.out.length === 1, 'general: sight of 25% counts when one eye is 3/60; 15% without 3/60 is left out (25% or less)');
const np = TE.nonPecuniary(reg.car_accident, { disability: 28, days: 0, age: 45 });
check(np.parts[0].pct === 23.8 && run({ age: 28 }).road.share === 28 && run({ kind: 'temp' }).road.permanent === false, 'road: the same nonPecuniary() as the road tool (28 x 0.85 = 23.8); at 28 no age cut; a temporary degree is not "permanent"');

/* ---------- 9. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ items: [] }, 'items') && err({ items: [{ code: '', pct: '' }] }, 'items'), 'error: no item at all');
check(err({ items: items(0) }, 'item0') && err({ items: items(101) }, 'item0') && err({ items: items('c99-9') }, 'item0'), 'error: 0%, 101%, an unknown item');
check(err({ items: items({ code: 'c37-5a', prev: 15 }) }, 'item0') && err({ items: items({ code: 'c37-5a', prev: -1 }) }, 'item0'), 'error: a previous condition above the item, or negative');
check(err({ r15: 'x', r15pct: 60 }, 'r15') && err({ r15: 'x', r15pct: '' }, 'r15'), 'error: reg. 15 above half, or empty');
check(err({ age: 2.5 }, 'age') && err({ daily: -1 }, 'daily') && err({ decided: '31.2.2026' }, 'decided') && err({ decided: '2026-10-08', received: '2026-10-01' }, 'received'), 'error: half a year of age, a negative allowance, an impossible date, delivered before decided');
const noExtra = run({ age: '', daily: '', decided: '', received: '' });
check(noExtra.ok && noExtra.money.monthly === null && !noExtra.events.length && !bad(U.renderResult(reg, noExtra) + U.renderDetails(reg, noExtra) + U.leadCard(reg, noExtra)), 'no extras: the degree still comes, no amount and no dates, nothing "null" rendered');

/* ---------- 10. Dates ---------- */
const court = run({ appealReceived: '2026-11-01' });
check(ev(court, 'court') === '2026-12-31', 'labour court: the appeals committee\'s decision delivered 1.11.2026 + 60 = 31.12.2026 (the Institute\'s appeal page)');
const tmpEnd = run({ kind: 'temp', tempTo: '2027-04-30' });
check(ev(tmpEnd, 'temp_end') === '2027-04-30' && !ev(run({ tempTo: '2027-04-30' }), 'temp_end') && !ev(tmpEnd, 'review_from'), 'temporary: the end of the period is a date; a stable degree has no such date; reg. 17 is for a stable degree');
const icsText = ics(ex.events.map((e) => ({ date: e.date, summary: e.he })), '2026-10-22T10:00:00Z');
check(icsText.includes('DTSTART;VALUE=DATE:20261108') && icsText.includes('DTSTART;VALUE=DATE:20261207') && icsText.includes('DTSTART;VALUE=DATE:20311001') && (icsText.match(/BEGIN:VEVENT/g) || []).length === ex.events.length, 'ics: the computed dates (8.11.2026, 7.12.2026, 1.10.2031), one event each');

/* ---------- 11. Rendering, the bar of the wave ---------- */
const s = U.snapshot(reg);
const all = [s.form, s.result, s.details, s.method, s.compare_table, s.lead, s.sentence, s.sticky].join('');
check(s.total === 28 && s.sticky === '<bdi>28%</bdi>' && s.result.includes('3,360') && s.sentence.includes('28%'), 'snapshot: the example figures (28%, 3,360 ₪)');
check(!/<h2/i.test(all) && !bad(all), 'snapshot: no <h2>, no undefined/NaN/null');
check(/<strong class="jtool-lead__figure"><bdi>28%<\/bdi><\/strong>/.test(s.lead) && s.lead.includes('data-lead-go') && s.lead.includes('3,360'), 'lead card: the example figure 28%, the money line, the jump to the form');
check(s.form.includes('data-act="preset"') && (s.form.match(/data-preset=/g) || []).length === 5 && s.form.includes('aria-pressed="true"') && (s.form.match(/<optgroup/g) || []).length >= 2 * Object.keys(S.areas).length, 'form: 5 one-click profiles with the example pressed; each item row lists the items by area');
check(s.compare_table.includes('<caption>') && (s.compare_table.match(/<tr/g) || []).length === S.items.length + 1 && s.compare_table.includes('37(8)(א)') && s.compare_table.includes('לא נספר'), 'page table: every curated item with its number and %, a caption, the general-disability exclusions');
check(s.result.includes('jt62-cap') && s.result.includes('jtool-visually-hidden') && (s.result.match(/class="jt62-seg jt62-seg--\d"/g) || []).length === 2 && s.result.includes('jt62-rest') && (s.result.match(/jt62-tick/g) || []).length >= 4, 'the bar: 2 cut segments, the remaining capacity, the 9/20/40/60 ticks, with a text equivalent');
const br = U.aiBrief(reg, ex);
const words = br.split(/\s+/).filter(Boolean).length;
check(words >= 40 && words <= 90 && br.includes('28%') && br.includes('20%') && !/\d{9}/.test(br.replace(/[,.]/g, '')) && !bad(br) && br.includes('השאלה לתרגול'), `aiBrief: ${words} words, the key figures, no 9-digit run, ends with the question`);
check(s.result.includes('<h4>התרחיש לסימולציה</h4>') && s.result.includes('purpose=witness_prep') && s.result.includes('topic=personal-injury') && handoffState('x', br, 'witness_prep').simulationPurpose === 'witness_prep', 'rehearse: the brief under its h4, the medical committee (witness_prep, personal-injury)');
const na = U.nextActions(reg, ex);
check(s.result.includes('<h4>מה עושים עכשיו</h4>') && na.official[0].url.startsWith('https://www.btl.gov.il/') && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => x.path.startsWith('/') && x.path.endsWith('/')), 'next actions: the Institute first, then 2-4 internal links');
check(s.result.includes('מה הדרגה אומרת') && (s.result.match(/data-sk-sibling/g) || []).length === 3, 'meaning table: work injury, general disability, road accident, each with its next tool');
const pr = U.printSummary(reg, ex, '2026-10-22');
check(pr.includes('הודפס ב-22.10.2026') && pr.includes('נבדק 22.10.2026') && pr.includes('8.11.2026') && s.details.includes('jt62-print'), 'print summary: result, dates, sources with the check date, the print date');
check(s.details.includes('מה השתנה ומתי') && s.details.includes('1.4.2000') && s.details.includes('1.1.2005') && s.details.includes('1.5.2026'), 'what changed and when: the dated official rows');
check(s.details.includes('jt62-grid') && (s.details.match(/class="jt62-hit"/g) || []).length === 0 && U.lookupTables(reg, ptsd).includes('jt62-hit'), 'the two tables in the details; the reader\'s hearing cell is marked');

/* ---------- 12. Share state and the cluster links ---------- */
const complex = Object.assign({}, U.EXAMPLE, { kind: 'stable', lefty: true, r15: 'x', r15pct: 20, items: [{ code: 'hear', a: 45, b: 30, side: 'r', prev: '', pct: '' }, { code: 'see', a: 2, b: 3, side: 'r', prev: '', pct: '' }, { code: '', pct: 12.5, side: 'r', prev: 2, a: '', b: '' }, { code: 'c43-1c', side: 'l', pct: '', prev: '', a: '', b: '' }], injury: '2026-03-10', appealReceived: '2026-11-01' });
const stx = U.stateOf(complex);
const back = U.inputOf(decodeState(stx, U.KEYS));
check(back && back.items.length === 4 && back.items[0].a === 45 && back.items[2].pct === 12.5 && back.items[2].prev === 2 && back.lefty && back.r15pct === 20 && E.skCompute(reg, back).degree === E.skCompute(reg, complex).degree, 'share state: stateOf -> decodeState -> inputOf round trip (tables, a free item, a previous condition, the left hand, reg. 15), same degree');
check(!/[א-ת]/.test(stx) && !stx.includes('@'), 'share state: no Hebrew, no free text');
const link = U.stateLink(reg, U.EXAMPLE);
const back2 = U.inputOf(decodeState(link.split('#')[1], U.KEYS));
check(link.startsWith('/regulations-insurance-1956/#s=') && back2 && E.skCompute(reg, back2).degree === 28, 'stateLink: /regulations-insurance-1956/#s=<state>, and it reloads the same 28%');
const sib = U.siblingLinks(reg, run({ injury: '2026-03-10' }));
const road = decodeState(sib.drachim.split('#')[1], ['d', 'h', 'a', 't', 'b', 'x', 'w', 'm', 's', 'c', 'o', 'k', 'e']);
check(sib.drachim.startsWith('/israel-road-accident-compensation-law/#s=') && road.d === '28' && road.a === '45' && road.t === '2026-03-10', 'cluster: the road tool opens with 28%, age 45 and the injury day (its KEYS d, a, t)');
const nc = NC.inputOf(decodeState(sib.nechut.split('#')[1], NC.KEYS));
check(sib.nechut.startsWith('/general-disability-pension-2026/#s=') && nc && nc.medMode === 'list' && nc.meds.join() === '20,10' && nc.age === 45, 'cluster: the general-disability tool opens in list mode with 20% and 10%, age 45 (its own inputOf)');
check(U.siblingLinks(reg, run({ age: '' })).nechut === '/general-disability-pension-2026/' && U.siblingLinks(reg, run({ kind: 'temp' })).drachim === '/israel-road-accident-compensation-law/', 'cluster: without an age, the general-disability page has no state; a temporary degree is not sent to the road tool (no state is guessed)');
const av = decodeState(U.siblingLinks(reg, r15t).avoda.split('#')[1], ['k', 't', 'a', 'w', 'q', 'n', 'p', 'h', 'l', 'r', 'i', 'd', 's', 'e', 'm', 'x', 'j', 'u', 'c']);
check(U.siblingLinks(reg, r15t).avoda.startsWith('/work-accident-guide/#s=') && av.d === '47.5' && av.s === 'p' && av.e === '33.33' && av.m === '2026-10-08' && !av.k, 'cluster: the work-injury tool opens with the degree by the tests (47.5%), stable, reg. 15 by 33.33% of it, the decision day (its KEYS d, s, e, m)');
for (const r of [ex, r15t, cap19, tmp15, g196, prev, knee4, sh, ptsd, out, see3, court, tmpEnd]) {
	const html = U.renderResult(reg, r) + U.renderDetails(reg, r) + U.leadCard(reg, r) + U.aiBrief(reg, r) + U.capacityBar(reg, r);
	check(!bad(html) && !/<h2/i.test(html), `render: no undefined/NaN/null, no <h2> (${E.skBand(r)}, ${r.items.length} items)`);
}
const errR = run({ items: items(0) });
check(U.renderResult(reg, errR).includes('צריך לתקן') && !bad(U.renderResult(reg, errR) + U.leadCard(reg, errR)), 'an input error renders the message, never a raw value');

console.log(`${passed} checks passed${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
