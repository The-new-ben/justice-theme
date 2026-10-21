/**
 * Golden tests for the parenting-time planner on /child-custody/ (mishmoret, the family + land wave, HAD-579).
 * Run: node tests/js/test-fl-mishmoret.mjs
 *
 * The example by hand: 5-2-2-5 (A-nights 1,2,5,6,7,8,9 of 14) from Sunday 1.11.2026, 365 nights = 26 cycles of 14 + 1
 * night (index 364 = 0 = B): 182 regular nights with the father (A), 183 with the mother. The Ministry of Education's
 * vacations of 5787 in the window (notice 0363), nights from the evening of the last school day to the night before
 * school resumes: Hanukkah 5-12.12 (8), Purim 22-24.3 (3), Pesach 12-28.4 (17), Independence 11-12.5 (2), Shavuot 9-12.6
 * (4), summer 30.6-31.8 (63) = 97 nights. Turns from Rosh Hashana (index 0, A): Hanukkah (2) A, Purim (3) B, Pesach (4)
 * A, Independence (5) B, Shavuot (6) A, summer (7) B. Halves from 6 nights: Hanukkah A4/B4, Pesach A9/B8, summer B32/A31.
 * Shifts against the schedule (day index mod 14): Hanukkah 0, Purim 2 to B, Pesach 5 + 5, Independence 1 to B, Shavuot 4
 * to A, summer 16 to B + 14 to A: 23 to A, 24 to B. Total A = 182 + 23 - 24 = 181 (49.6%), B = 184; 181 x 14 / 365 = 6.94
 * -> 7 of 14, the equal split of 919/15 para. 3. Child support at 7 of 14 (mezonot-engine): child 4 (father alone,
 * 1,300 + 1,000 + 700 x 0.6087 = 2,726.09, low 2,726.09 - 0.5 x 1,500 = 1,976.09) + child 9 (ratio 0.15318 x 3,900 =
 * 597.4, para. 61 163.04 + 304.35 = 467.39) = 2,443.48 .. 3,323.49 -> 2,440 .. 3,320.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/mishmoret-engine.js';
import * as U from '../../assets/js/tools/mishmoret-ui.js';
import * as LU from '../../assets/js/tools/luach-engine.js';
import * as MZU from '../../assets/js/tools/mezonot-ui.js';
import { computeSupport } from '../../assets/js/tools/mezonot-engine.js';
import { decodeState, ics } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const fl = reg.fl_mishmoret;
const EX = U.EXAMPLE;
const run = (over) => E.compute(reg, Object.assign({}, EX, over));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const DAY = 86400000;
const idx = (iso) => Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse('2026-11-01T00:00:00Z')) / DAY);

/* ---------- 1. The registry carries every figure and section the tool shows ---------- */
check(fl && fl.checked_on === '2026-10-21' && /^https:\/\/apps\.education\.gov\.il\/mankal\/Hodaa\.aspx\?siduri=362$/.test(fl.source_url) && fl.refresh_every_days > 0 && fl.next_update, 'registry: fl_mishmoret, checked 21.10.2026, notice 0363 as the source, a refresh date');
check(fl.breaks.length === 8 && fl.breaks.every((b) => /^\d{4}-\d{2}-\d{2}$/.test(b.off) && /^\d{4}-\d{2}-\d{2}$/.test(b.resume) && b.text_he && b.section_he), 'registry: eight vacations of 5787, each with its first day off, the day school resumes, the text and the section');
check(fl.school_year.first_day === '2026-09-01' && fl.school_year.next_first_day === '2027-09-01' && fl.stages.k6.last_day === '2027-06-30' && fl.stages.mid.last_day === '2027-06-20' && fl.stages.high.last_day === '2027-06-20', 'registry: 5787 opens 1.9.2026, ends 30.6 (kindergartens, elementary) and 20.6 (middle, upper); 5788 opens 1.9.2027 (notice 0363 s.1, s.11)');
check(Object.values(fl.stages).every((s) => /^https:\/\/apps\.education\.gov\.il\//.test(s.url) && s.notice_he) && fl.stages.high.url.endsWith('siduri=363'), 'registry: every stage cites its circular (0363, 0364 for the upper divisions)');
check(fl.law.tender_until === 6 && fl.law.minor_until === 18 && fl.law.sections.agreement === 'סעיף 24' && fl.law.sections.no_agreement === 'סעיף 25' && fl.law.sections.natural === 'סעיף 14' && /nevo\.co\.il\/law_html\/law00\/70325/.test(fl.law.url), 'registry: Capacity and Guardianship Law ss.3, 14, 24, 25 (tender years to 6, minor to 18), Nevo');
check(fl.child_heard.from_age === 6 && fl.child_heard.sections.age === 'תקנה 51(ב)' && fl.child_heard.sections.right === 'תקנה 49' && /196390/.test(fl.child_heard.url), 'registry: Family Court Procedure Regulations 2020, reg. 49 and reg. 51(ב), the child is heard from 6');
check(fl.welfare.sections.report === 'סעיף 2' && fl.welfare.sections.parties === 'סעיף 4' && /055_081/.test(fl.welfare.url), 'registry: Welfare Procedure Law 1955, s.2 (the report) and s.4 (the parties see it)');
check(fl.ruling.equal_nights === 7 && fl.ruling.equal_of === 14 && fl.ruling.equal_month_nights === 15 && fl.ruling.paras.equal === 'פסקה 3' && /supremedecisions/.test(fl.ruling.url), 'registry: 919/15 para. 3, shared physical custody = 7 of 14 nights or 15 of 30');
check(fl.template.long_from_nights === 6 && reg.child_support.ages.father_only_to === 6 && reg.child_support.ages.equal_from === 15 && reg.divorce_agreement.schedule_he, 'registry: the template threshold (6 nights), the child-support ages it reuses, the divorce agreement\'s schedule note');

/* ---------- 2. Reuse: the patterns are the custody calendar's, the support is the child-support engine's ---------- */
check(['two_two_three', 'two_two_five', 'week_week', 'three_four', 'weekends_mid', 'weekends_2mid'].every((k) => E.mmNights(k).join('') === LU.luNights(k).join('')) && E.mmNights('weekends_eve').join('') === LU.luNights('weekends').join(''), 'every template is a luach-engine pattern (weekends_eve = alternate weekends + an evening)');
check(E.mmNights('custom', [0, 13]).join('') === 'ABBBBBBBBBBBBA', 'custom: the marked A-nights only');

/* ---------- 3. The vacations by stage (notice 0363 / 0364), nights from the evening of the last school day ---------- */
const k6 = E.mmBreaks(fl, 'k6');
const hi = E.mmBreaks(fl, 'high');
const mid = E.mmBreaks(fl, 'mid');
check(k6.map((b) => b.nights).join(',') === '4,15,8,3,17,2,4,63', 'k6 nights: RH 10-13.9 = 4, YK+Sukkot 19.9-3.10 = 15, Hanukkah 8, Purim 3, Pesach 17, Independence 2, Shavuot 4, summer 30.6-31.8 = 1 + 31 + 31 = 63');
check(hi[1].to === '2026-10-04' && hi[1].nights === 16 && hi[7].from === '2027-06-20' && hi[7].nights === 73 && mid[7].nights === 73 && mid[1].nights === 15, 'upper divisions: Sukkot to Isru Chag (resume 5.10, 16 nights); middle and upper summer 20.6-31.8 = 11 + 31 + 31 = 73');
check(k6[4].from === '2027-04-12' && k6[4].to === '2027-04-28' && k6[0].from === '2026-09-10' && k6[0].to === '2026-09-13', 'Pesach nights 12.4-28.4 (off 13.4, resume 29.4); Rosh Hashana nights 10.9-13.9 (off 11.9, resume 14.9)');

/* ---------- 4. The example, by hand ---------- */
const ex = E.compute(reg, EX);
check(ex.ok && ex.start === '2026-11-01' && ex.end === '2027-10-31' && ex.nightsA === 7, 'example: 5-2-2-5 from Sunday 1.11.2026 to 31.10.2027, 7 of 14 nights with the father');
check(ex.year.regularA === 182 && ex.year.regularB === 183, 'example: 26 x 7 = 182 regular nights with A, 26 x 7 + 1 = 183 with B');
check(ex.year.holidayNights === 97 && ex.breaks.map((b) => b.key).join(',') === 'hanukkah,purim,pesach,indep,shavuot,summer', 'example: 8 + 3 + 17 + 2 + 4 + 63 = 97 vacation nights, six vacations in the window');
const parts = Object.fromEntries(ex.breaks.map((b) => [b.key, b.parts.map((p) => `${p.who}${p.nights}`).join('/')]));
check(parts.hanukkah === 'A4/B4' && parts.purim === 'B3' && parts.pesach === 'A9/B8' && parts.indep === 'B2' && parts.shavuot === 'A4' && parts.summer === 'B32/A31', 'example turns: Hanukkah A4/B4, Purim B, Pesach A9/B8 (ceil 17/2 = 9), Independence B, Shavuot A, summer B32/A31');
check(ex.breaks.map((b) => b.shifted).join(',') === '0,2,10,1,4,30' && ex.year.shiftedToA === 23 && ex.year.shiftedToB === 24, 'example shifts: 0, 2, 10, 1, 4, 30; 23 nights to A, 24 to B');
// The same shifts from the pattern alone, without the engine's loop (day index mod 14).
const A_SET = new Set([1, 2, 5, 6, 7, 8, 9]);
const regAt = (iso) => (A_SET.has(((idx(iso) % 14) + 14) % 14) ? 'A' : 'B');
const pes = ex.breaks.find((b) => b.key === 'pesach');
let toA = 0; let toB = 0;
for (let d = Date.parse(`${pes.from}T00:00:00Z`); d <= Date.parse(`${pes.to}T00:00:00Z`); d += DAY) {
	const iso = new Date(d).toISOString().slice(0, 10);
	const who = iso <= '2027-04-20' ? 'A' : 'B';
	if (who !== regAt(iso)) { if (who === 'A') { toA += 1; } else { toB += 1; } }
}
check(idx('2027-04-12') === 162 && 162 % 14 === 8 && toA === 5 && toB === 5, 'Pesach by hand: 12.4.2027 is night 162 (mod 14 = 8); 5 nights move to A, 5 to B');
check(ex.year.a === 181 && ex.year.b === 184 && ex.year.aPct === 49.6 && ex.year.bPct === 50.4, 'example: 182 + 23 - 24 = 181 nights with A (49.6%), 184 with B (50.4%)');
check(ex.nights14 === 7 && ex.equal, 'example: 181 x 14 / 365 = 6.94 -> 7 of 14, equal by 919/15 para. 3');
check(ex.year.after === 61 && ex.flags.some((f) => f.code === 'unpublished' && f.he.includes('61') && f.he.includes('1.9.2027')), 'example: 1.9-31.10.2027 = 30 + 31 = 61 nights after 5788 opens; the calendar is not published, flagged');
check(ex.handovers.length === ex.days.filter((d, i) => i > 0 && d.who !== ex.days[i - 1].who).length && ex.stays.length === ex.handovers.length + 1, 'handovers = every change of home; stays = handovers + 1');
check(ex.stays.filter((s) => s.who === 'A').reduce((n, s) => n + s.nights, 0) === 181 && ex.stays.filter((s) => s.who === 'B').reduce((n, s) => n + s.nights, 0) === 184, 'the stays add up to 181 and 184 nights');
check(ex.months.length === 12 && ex.months.reduce((n, m) => n + m.a, 0) === 181 && ex.months[0].key === '2026-11' && ex.months[11].key === '2027-10', 'twelve months, Nov 2026 to Oct 2027, adding up to 181 nights with A');

/* ---------- 5. Money: the child-support engine at the plan's split ---------- */
const x = ex.support.result;
check(ex.support.ok && x.payer === 'A' && x.low === 2440 && x.high === 3320, 'support at 7 of 14: the father pays 2,443.48 .. 3,323.49 -> 2,440 .. 3,320 (by hand in the header)');
check(ex.support.table.map((t) => `${t.nightsA}:${t.low}-${t.high}`).join(' ') === '2:3510-4720 4:3090-4160 7:2440-3320' && ex.support.table.find((t) => t.mine).nightsA === 7, 'the same family at 2, 4 and 7 nights: 3,510-4,720, 3,090-4,160, 2,440-3,320 (the plan\'s row marked)');
const direct = computeSupport(reg, { incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000, children: EX.children, nightsA: 7, father: 'A', law: 'jewish', asOf: '2026-11-01' });
check(direct.low === x.low && direct.high === x.high, 'the band is exactly computeSupport() of mezonot-engine');
const link = U.supportLink(ex);
const st = decodeState(link.split('#s=')[1].replace(/\/@mezonot$/, ''), ['o', 'p', 'l', 'i', 'k', 'n', 'd', 'c', 'x', 'a', 'b']);
const mzModel = MZU.modelOf(st);
const viaLink = computeSupport(reg, MZU.toSupportInput(Object.assign(mzModel, { asOf: '2026-11-01' })));
check(link.startsWith('/child-support/#s=') && link.endsWith('/@mezonot') && mzModel.nightsA === 7 && mzModel.children.join() === EX.children.join() && viaLink.low === 2440 && viaLink.high === 3320, 'the /child-support/ link opens the mezonot tool with the same family and 7 nights: it computes 2,440-3,320 too');
const mom = run({ parentA: 'אמא' });
check(mom.support.result.payer === 'B' && U.supportLink(mom).includes('/p') && U.supportLink(mom).includes('/pm/'), 'parent A is the mother: the father (B) pays, the link carries p=m');
const none = run({ incomeA: '', incomeB: '' });
check(none.ok && none.support === null && U.renderResult(reg, none).includes('ממלאים את ההכנסות'), 'no incomes: the plan without a support figure, and a line that says why');
check(!run({ incomeA: -5 }).ok && run({ incomeA: -5 }).errors[0].field === 'incomeA', 'a negative income is an input error');

/* ---------- 6. Hard cases ---------- */
const eve = run({ template: 'weekends_eve' });
check(eve.nightsA === 2 && eve.evenings.length === 37, 'alternate weekends + an evening: 2 of 14 nights; 52 Tuesdays minus 15 inside vacations (Hanukkah 1, Purim 1, Pesach 3, Independence 1, summer 9) = 37 evenings');
check(eve.year.a === 87 && eve.nights14 === 3 && eve.support.result.low === 3300 && eve.support.result.high === 4440, 'alternate weekends with the vacation halves: 87 nights a year (3 of 14 on average), support 3,300-4,440');
check(run({ holidays: 'none' }).year.a === 182 && run({ holidays: 'none' }).flags.some((f) => f.code === 'norule'), 'no vacation split: the schedule alone, 182 nights, flagged');
const alt = run({ holidays: 'alternate' });
check(alt.year.a === 193 && alt.breaks.find((b) => b.key === 'pesach').parts.map((p) => `${p.who}${p.nights}`).join() === 'A17' && alt.breaks.find((b) => b.key === 'summer').parts.length === 2, 'whole vacations in turns: Pesach all 17 nights to A, the summer still in halves; 193 nights with A');
check(run({ firstA: false }).year.a === 182 && run({ firstA: false }).breaks.find((b) => b.key === 'summer').parts[0].who === 'A', 'the turns flipped: the summer\'s first half goes to A');
const high = run({ stage: 'high' });
check(high.breaks.find((b) => b.key === 'summer').nights === 73 && high.breaks.find((b) => b.key === 'summer').from === '2027-06-20', 'upper division: the summer from the night of 20.6, 73 nights');
const wed = run({ start: '2026-11-04' });
check(wed.start === '2026-11-01' && wed.flags[0].code === 'sunday', 'a Wednesday start snaps to its Sunday, flagged');
const aug = run({ start: '2026-08-02' });
check(aug.year.before === 30 && aug.flags.some((f) => f.code === 'before'), 'a start before 1.9.2026: 30 nights outside the published school year, flagged');
const sep = run({ start: '2026-09-06' });
check(sep.breaks.length === 8 && sep.year.after === 5 && sep.breaks[0].key === 'rh', 'a start on 6.9.2026: all eight vacations, 5 nights after 5788 opens');
const six = run({ children: ['2021-03-15'] });
check(six.kids[0].age === 5 && six.kids[0].tender && !six.kids[0].heard && six.kids[0].milestones[0].date === '2027-03-15' && six.kids[0].milestones[0].key === 'six', 'a child of 5 turns 6 on 15.3.2027 inside the year: tender years until then, heard from then (s.25, reg. 51(ב))');
check(U.icsEvents(reg, six).some((e) => e.date === '2027-03-15' && e.summary.includes('בן/בת 6')), 'the 6th birthday is a calendar event');
const teen = run({ children: ['2011-05-01', '2006-01-01'] });
check(teen.ok && teen.kids[0].bracket === '15to18' && teen.kids[0].heard && !teen.kids[1].minor && teen.flags.some((f) => f.code === 'adult'), 'a child of 15 (equal support) and one of 20 (not a minor, flagged)');
check(E.mmAgeRules(reg, '2020-11-01', '2026-11-01').bracket === '6to15' && E.mmAgeRules(reg, '2020-11-02', '2026-11-01').bracket === 'under6', 'the 6th birthday edge: 6 on the day (6 to 15), one day younger is under 6');

/* ---------- 7. Input errors ---------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ start: '2026-02-30' }, 'start') && err({ start: '' }, 'start'), 'start: 30.2 and blank are errors');
check(err({ children: [] }, 'children'), 'no children: an error');
check(err({ children: ['2027-01-01'] }, 'child-0'), 'a child born after the plan starts: an error');
check(err({ children: ['2000-01-01'] }, 'children'), 'only adults: an error (s.3)');
check(err({ children: ['2020-01-01', '2020-01-01', '2020-01-01', '2020-01-01', '2020-01-01', '2020-01-01', '2020-01-01'] }, 'children'), 'seven children: an error (the support engine\'s limit is 6)');
check(err({ template: 'custom', custom: [] }, 'custom') && run({ template: 'custom', custom: [5, 6] }).nightsA === 2, 'custom with no A-night is an error; custom 5, 6 = 2 nights');

/* ---------- 8. The rendered result: picture, text equivalent, ages, money, scenario, next steps, print ---------- */
const html = U.renderResult(reg, ex, { today: '2026-10-21' });
check(html.includes('<bdi dir="ltr">181 / 365</bdi>') && html.includes('49.6%') && html.includes('2,440') && html.includes('3,320'), 'the result shows 181 / 365, 49.6% and the support band');
check((html.match(/class="jt41-d /g) || []).length === 365, 'the picture: 365 nights in the ribbon');
const sr = (html.match(/<ul class="jt41-sr">([\s\S]*?)<\/ul>/) || [])[1] || '';
check((sr.match(/<li>/g) || []).length === 12 && sr.includes('נובמבר 2026') && sr.includes('לילות אצל האב') && sr.includes('חופשה: פסח'), 'the picture\'s text equivalent: twelve month lines with nights per parent and the vacations');
check(html.includes('<h4 id="jt41-ages-h">') && html.includes('סעיף 25') && html.includes('תקנה 51(ב)') && html.includes('סעיף 2') && html.includes('ב-<bdi>1.3.2028</bdi>, בגיל 6'), 'ages: tender years (s.25), hearing the child (reg. 51(ב)), the welfare report (s.2), the next birthday 1.3.2028');
check(html.includes('<h4 id="jt41-money-h">') && html.includes('href="/child-support/#s=') && html.includes('data-act="support"'), 'money: the panel with the link that opens /child-support/ with the numbers');
const brief = U.aiBrief(reg, ex);
const words = brief.split(/\s+/).filter(Boolean).length;
check(html.includes('<h4 id="jt41-brief-h">התרחיש לסימולציה</h4>') && html.includes('data-act="rehearse"') && html.includes('purpose=mediation&amp;topic=divorce'), 'the scenario under "התרחיש לסימולציה" with the rehearse link (divorce, mediation)');
check(brief.includes('181') && brief.includes('49.6%') && brief.includes('2,400 עד 3,400') && brief.includes('5-2-2-5') && brief.endsWith('?'), 'aiBrief: the nights, the share, the support band (2,400-3,400), the arrangement, ends with the question');
check(words >= 40 && words <= 90 && !/\d{9}/.test(brief) && !bad(brief), `aiBrief: ${words} words, no 9-digit sequence, no undefined`);
check(!/אבא|אמא/.test(brief.replace(/האב|האם/g, '')) && !/שם|ת"ז|כתובת/.test(brief), 'aiBrief: roles only, no name, ID or address');
const next = (html.match(/<h4 id="jt41-next-h">מה עושים עכשיו<\/h4>([\s\S]*?)<\/section>/) || [])[1] || '';
check(['/divorce-agreement/', '/request-for-family-dispute-settlements/', '/divorce-mediation/', '/child-support/#s='].every((p) => next.includes(`href="${p}`)) && next.includes(fl.services.dispute_url) && next.includes(fl.services.agreement_url) && next.includes(fl.services.moe_url), 'next steps: the official dispute request, agreement approval and vacation calendar, and four internal steps');
const pr = (html.match(/<div class="jt41-print">([\s\S]*?)<\/div>$/) || [])[1] || '';
check(pr.includes('תוכנית הורות: סיכום') && pr.includes('הודפס ב-<bdi data-jt41-printed>21.10.2026</bdi>') && pr.includes('<bdi>181</bdi>') && pr.includes('5-2-2-5') && pr.includes('הודעה 0363') && pr.includes('סעיף 24') && pr.includes('נבדק ב-21.10.2026'), 'print summary: title, the date printed, inputs, nights, the circular, the law, the check date');
check(pr.includes('<ol class="jt41-print__path">') && pr.includes('2,440'), 'print summary: the computation path and the support band');

/* ---------- 9. The calendar files ---------- */
const all = U.icsEvents(reg, ex);
check(all.length === ex.handovers.length + 9 + 5 && all.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.summary && !bad(e.summary + e.description)), `ics: ${ex.handovers.length} handovers + 9 vacation parts + 5 birthdays, every one dated`);
check(all.some((e) => e.date === '2027-04-12' && e.summary === 'פסח: הילדים אצל האב') && all.some((e) => e.date === '2027-04-21' && e.summary === 'פסח: הילדים אצל האם'), 'ics: Pesach, the father from the night of 12.4, the mother from 21.4');
const evA = U.icsEvents(reg, ex, 'A');
check(evA.length === ex.stays.filter((s) => s.who === 'A').length && evA.every((e) => e.summary.startsWith('הילדים אצלך')), 'ics for parent A: one event per stay with A');
const cal = ics(all, '2026-10-21T12:00:00Z');
check((cal.match(/BEGIN:VEVENT/g) || []).length === all.length && cal.includes('DTSTART;VALUE=DATE:20270412'), 'the .ics text holds every event (instrument.js ics())');

/* ---------- 10. Snapshot, page tables, share state, hygiene ---------- */
const snap = U.snapshot(reg);
check(snap.tool === 'mishmoret' && snap.total === 181 && snap.sticky === '<bdi dir="ltr">181/365</bdi>' && snap.registry_version === reg.registry_version, 'snapshot: tool, total 181, sticky 181/365');
check(snap.result.includes('דוגמה: לילות') && snap.method.startsWith('<ol>') && snap.method.includes('jtool-cite') && snap.method.includes('2,440') && snap.method.includes('פסקה 3'), 'snapshot: the example result and the computation path with cites');
check(snap.compare_table.includes('<caption>') && snap.compare_table.includes('5-2-2-5') && snap.compare_table.includes('3,510') && snap.holidays_table.includes('<caption>') && snap.holidays_table.includes('<bdi>73</bdi>'), 'page tables: the templates with the support band, the vacations by stage (73 nights for the middle schools\' summer), each with a caption');
check(snap.form.includes('name="jt41-tpl"') && snap.form.includes('id="jt41-start"') && snap.form.includes('value="14,000"'), 'form: template chips, the start day, the incomes pre-filled from the child-support example');
const strings = [snap.form, snap.result, snap.details, snap.method, snap.compare_table, snap.holidays_table, snap.sentence, snap.brief];
check(strings.every((s) => !/<h2/i.test(s)), 'no <h2> in any rendered HTML');
check(strings.every((s) => !bad(s)) && !bad(U.renderResult(reg, eve)) && !bad(U.renderDetails(reg, high)) && !bad(U.renderResult(reg, none)), 'no undefined / NaN / null in any rendered string');
check(!bad(U.renderResult(reg, run({ start: 'x' }))) && U.renderResult(reg, run({ start: 'x' })).includes('צריך לתקן'), 'an error result renders the errors');
const model = { parentA: 'אמא', children: ['2019-02-03'], template: 'custom', custom: [0, 3, 7], start: '2026-12-06', stage: 'high', holidays: 'alternate', firstA: false, incomeA: 0, incomeB: '', housingA: 3000, housingB: '' };
const back = U.modelOf(decodeState(U.stateOf(model), U.KEYS));
check(JSON.stringify(back) === JSON.stringify(model), 'share state round trip: stateOf -> decodeState -> modelOf (an explicit 0 survives, a blank stays blank)');
check(!/[א-ת]/.test(U.stateOf(EX)) && !U.stateOf(EX).includes('@'), 'the share state holds no Hebrew text (no names)');

/* ---------- 11. Polish round: the window handoff and the result-first card ---------- */
check(html.includes('data-act="rehearse">לתרגל את הגישור עם הנתונים שלכם</a>') && !/להעתיק/.test(html.match(/data-act="rehearse">[^<]*/)[0]), 'the rehearse button says what it does (practise with your figures), not "copy"');
const hs = handoffState('x', U.aiBrief(reg, ex), 'mediation');
check(hs.phase === 'intake' && hs.locale === 'he' && hs.simulationPurpose === 'mediation' && hs.description.includes('181') && hs.description.includes('2,400 עד 3,400') && !/\d{9}/.test(hs.description), 'handoff state: intake, Hebrew, mediation, the scenario with 181 nights and the support band, no 9-digit run');
const lead = U.leadCard(reg, ex, { example: true });
check(lead.includes('דוגמה מחושבת: לילות ב-12 החודשים אצל האב') && lead.includes('<bdi dir="ltr">181/365</bdi>') && lead.includes('49.6%') && lead.includes('5-2-2-5') && lead.includes('2,440 ₪ עד 3,320 ₪') && lead.includes('data-lead-go') && lead.includes('לחשב לפי המקרה שלכם'), 'lead card (example): 181/365, 49.6%, 5-2-2-5 and the support band, the jump to the form');
check(snap.lead === lead && !/<h2/i.test(lead) && !bad(lead), 'snapshot().lead is the example card; no h2, no undefined/NaN/null');
const leadOwn = U.leadCard(reg, eve, {});
check(leadOwn.includes('החישוב שלכם') && leadOwn.includes('<bdi dir="ltr">87/365</bdi>') && leadOwn.includes('לשנות את הנתונים') && !bad(leadOwn), 'lead card (your answers): 87/365 for alternate weekends + an evening');
const leadErr = U.leadCard(reg, run({ start: 'x' }), {});
check(leadErr.includes('jtool-lead__figure">—</strong>') && leadErr.includes('יום תחילת הלוח לא תקין') && !bad(leadErr), 'lead card (error): a dash and the error');
check(!bad(U.leadCard(reg, none, {})) && U.leadCard(reg, none, {}).includes('בלי הכנסות'), 'lead card without incomes: no support band, says so');
check(snap.sticky === '<bdi dir="ltr">181/365</bdi>', 'the snapshot sticky is the exact string the mount writes');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
