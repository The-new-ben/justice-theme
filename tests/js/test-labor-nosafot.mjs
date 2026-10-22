/**
 * Golden tests for the overtime time card (shaot-nosafot, the labor-law wave, 22.10.2026).
 * Run: node tests/js/test-labor-nosafot.mjs
 *
 * Every expected amount is computed by hand from the official texts: the Hours of Work and Rest Law (s.1 night work = 2+
 * hours between 22:00 and 06:00; s.2 a day of 8 hours, 7 at night and on the day before the weekly rest or a holiday;
 * s.16(א) 125% for the first two overtime hours of a day, 150% after; s.17(א)(1) 150% on the weekly rest; s.21 8 hours
 * between days), the 2018 extension order (42 hours, the hourly wage = monthly / 182), the Ministry's legal department
 * (a 5-day week: 8.6 hours a day, one shortened day of 7.6; the general permit: 12 hours a day, 16 overtime hours a week,
 * 58 for a night worker), the 2018 directive (count per day and per week), the Wage Protection Law (s.9 end of month,
 * s.1 the determining day = 9 days after, s.17א(א) one year), the Limitation Law (7 years), and min_wage (35.40 from
 * 1.4.2026).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/nosafot-engine.js';
import * as U from '../../assets/js/tools/nosafot-ui.js';
import { decodeState, ics, ils } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const EX = U.EXAMPLE;
const run = (over) => E.nsCompute(reg, Object.assign({}, EX, over));
const preset = (k) => E.nsCompute(reg, Object.assign({}, E.NS_DEFAULT, U.PRESETS[k].input));
const bad = (s) => /undefined|NaN|\bnull\b/.test(s);
const ln = reg.labor_nosafot;
const ot = reg.rights_neto.overtime;
const hoursOnly = (arr, over = {}) => run(Object.assign({ days: arr, brk: 0 }, over));

/* ---------------- The registry ---------------- */
check(ln && ln.checked_on === '2026-10-22' && /^https:\/\//.test(ln.law_url) && /^https:\/\//.test(ln.wage_law_url) && /^https:\/\//.test(ln.review_url) && /^https:\/\//.test(ln.order_url) && /^https:\/\//.test(ln.directive_url) && /^https:\/\//.test(ln.youth_law_url), 'labor_nosafot is in the registry, checked 22.10.2026, every source an https url');
check(ot.first_pct === 125 && ot.next_pct === 150 && ot.rest_pct === 150 && ot.divisor === 182 && ot.week_hours === 42 && ot.max_day === 12 && ot.max_week_overtime === 16 && ot.first_hours === 2, 'the engine reads rights_neto.overtime: 125/150/150, 182, 42, 12, 16, 2 (not duplicated in labor_nosafot)');
check(ln.day.regular === 8 && ln.day.short === 7 && ln.five.day === 8.6 && ln.five.short === 7.6 && ln.night.min_hours === 2 && ln.permit.night_week === 58 && ln.pay_day.after_days === 9 && ln.burden.week === 15 && ln.burden.month === 60 && ln.delay.comp_years === 1, 'labor_nosafot holds s.2 (8/7), the 5-day week (8.6/7.6), night (2 h), 58, the 9th day, 15/60, 1 year');
check(ln.history.every((h) => /^\d{4}-\d{2}-\d{2}$/.test(h.from) && h.section && /^https:\/\//.test(h.url)) && reg.severance.limitation.years === 7, 'every history row is dated with a section and a url; the 7 years are read from severance.limitation');

/* ---------------- The example: monthly 9,100, a 5-day week ---------------- */
const ex = run({});
check(ex.ok && ex.rate === 50, 'example: 9,100 / 182 = 50 per hour (order s.2.8)');
check(ex.days[0].hours === 11 && ex.days[0].norm === 8.6 && ex.days[0].h125 === 2 && ex.days[0].h150 === 0.4, 'Sunday 07:30-19:00 less 30 min = 11 h; norm 8.6; 2.4 overtime = 2 at 125% + 0.4 at 150% (s.16(א))');
check(ex.days[1].h125 === 1.4 && ex.days[1].h150 === 0 && ex.days[3].ot === 0 && ex.days[4].norm === 7.6 && ex.days[4].hours === 7.5 && ex.days[4].ot === 0, 'Monday 10 h -> 1.4 at 125%; Wednesday 8.5 h -> none; Thursday is the shortened day (7.6), 7.5 h -> none');
check(ex.week.reg === 41.8 && ex.week.h125 === 4.8 && ex.week.h150 === 0.4 && ex.week.weeklyOt === 0, 'week: 8.6 x 3 + 8.5 + 7.5 = 41.8 regular (under 42), 4.8 at 125%, 0.4 at 150%');
check(ex.pay.p125 === 300 && ex.pay.p150 === 30 && ex.pay.extra === 330 && ex.month.extra === 1320, 'pay: 4.8 x 62.5 = 300 + 0.4 x 75 = 30 = 330 a week; x 4 weeks = 1,320 a month');
check(ex.month.gap === 1320 && ex.back.months === 12 && ex.back.amount === 15840 && ex.back.oldest === '2025-10' && ex.back.latest === '2026-09', 'nothing paid: 1,320 x 12 months (10.2025 to 9.2026) = 15,840');
check(ex.dates.due === '2026-10-31' && ex.dates.determining === '2026-11-09' && ex.back.compLimit === '2027-10-09' && ex.back.oldestLapse === '2032-10-31', 'dates: October paid by 31.10.2026 (s.9), determining day 9.11.2026 (s.1), compensation for 9.2026 until 9.10.2027 (s.17א), 10.2025 lapses 31.10.2032');
const exIcs = ics(ex.events.map((e) => ({ date: e.date, summary: e.what })), '2026-10-22T10:00:00Z');
check(['20261031', '20261109', '20271009', '20321031'].every((d) => exIcs.includes(`DTSTART;VALUE=DATE:${d}`)) && (exIcs.match(/BEGIN:VEVENT/g) || []).length === 4, 'the .ics carries the 4 law dates: 31.10.2026, 9.11.2026, 9.10.2027, 31.10.2032');

/* ---------------- The presets (hard cases of the brief) ---------------- */
const six = preset('six');
check(six.ok && six.days[0].hours === 9 && six.days[0].norm === 8 && six.days[0].h125 === 1 && six.days[5].norm === 7 && six.days[5].hours === 5.5, '6-day week, hourly 40: Sun-Thu 9 h on a norm of 8 (s.2(א)); Friday, the day before the rest, norm 7 (s.2(ב)), 5.5 h');
check(six.days[5].reg === 2 && six.days[5].weeklyOt === 3.5 && six.days[5].h125 === 2 && six.days[5].h150 === 1.5 && six.week.reg === 42, 'Friday: 40 regular before it, so 2 h reach 42 and 3.5 h are weekly overtime: 2 at 125%, 1.5 at 150%');
check(six.pay.reg === 1680 && six.pay.p125 === 350 && six.pay.p150 === 90 && six.pay.total === 2120 && six.month.total === 8480 && six.month.extra === 1760, 'hourly pay: 42 x 40 = 1,680 + 7 x 50 = 350 + 1.5 x 60 = 90 = 2,120 a week; 8,480 a month (overtime 1,760)');
const night = preset('night');
check(night.ok && night.days[0].night && night.days[0].autoNight && night.days[0].nightH === 8 && night.days[0].norm === 7 && night.days[0].hours === 8.5 && night.days[0].h125 === 1.5, 'night shift 22:00-07:00: 8 h in 22-06 -> night work (s.1), norm 7 (s.2(ב)); 8.5 h net -> 1.5 at 125%');
check(night.pay.extra === 421.88 && night.month.extra === 1687.5, 'night: 7.5 x 45 x 1.25 = 421.875 a week (421.88); the month from the exact week: 1,687.50, not 4 x 421.88');
const shab = preset('shabbat');
check(shab.ok && shab.rate === 60 && shab.week.h125 === 2 && shab.week.rest === 6 && shab.pay.pRest === 540 && shab.pay.extra === 690 && shab.month.extra === 2760, 'Saturday 09:00-15:30 (6 h net) at 150% (s.17(א)(1)): 6 x 90 = 540 + 2 x 75 = 690 a week, 2,760 a month');
check(shab.flags.some((f) => f.level === 'warn' && f.he.includes('יום המנוחה השבועית') && f.section.includes('סעיפים 9 ו-12')), 'work on the weekly rest is flagged with its permit rule (s.9, s.12) and the 36 hours (s.7)');
const glob = preset('global');
check(glob.ok && glob.rate === 70 && glob.week.h125 === 8.9 && glob.week.h150 === 1.6 && glob.pay.extra === 946.75 && glob.month.extra === 3787, 'global: 12,740 / 182 = 70; 8.9 at 125% + 1.6 at 150% = 778.75 + 168 = 946.75 a week, 3,787 a month');
check(glob.month.paid === 1500 && glob.month.gap === 2287 && !glob.month.covered && glob.back.amount === 27444, 'a fixed 1,500 for overtime: 2,287 short a month, 27,444 over 12 months');
const covered = run({ paid: 1320 });
const coveredMore = run({ paid: 1321 });
check(covered.month.gap === 0 && covered.month.covered && covered.back.amount === 0 && !covered.events.some((e) => e.kind === 'lapse') && coveredMore.month.gap === -1 && coveredMore.month.covered, 'paid exactly 1,320: covered, no back pay, no lapse event; 1,321: covered with 1 to spare');

/* ---------------- The rules: daily, weekly, the boundaries ---------------- */
const fri = hoursOnly(['8.5', '8.5', '8.5', '8.5', '7.5', '5', '']);
check(fri.days[5].norm === 7 && fri.days[5].reg === 0.5 && fri.days[5].weeklyOt === 4.5 && fri.days[5].h125 === 2 && fri.days[5].h150 === 2.5 && fri.pay.extra === 312.5, '5-day week + Friday 5 h: 41.5 regular before it, 0.5 reach 42, 4.5 weekly overtime: 2 x 62.5 + 2.5 x 75 = 312.50');
const tier = hoursOnly(['10.6', '10.7', '', '', '', '', '']);
check(tier.days[0].h125 === 2 && tier.days[0].h150 === 0 && tier.days[1].h125 === 2 && tier.days[1].h150 === 0.1, 'exactly 2 overtime hours (10.6 on 8.6): all at 125%; 0.1 more: 0.1 at 150%');
const atNorm = hoursOnly(['8.6', '8.7', '', '', '7.6', '', '']);
check(atNorm.days[0].ot === 0 && atNorm.days[1].ot === 0.1 && atNorm.days[4].ot === 0, 'at the norm (8.6, and 7.6 on the shortened day): no overtime; 8.7: 0.1');
check(E.nsNightHours(1200, 1440) === 2 && E.nsNightHours(1260, 1439) === 1.98 && run({ days: ['20:00-00:00', '', '', '', '', '', ''] }).days[0].night && !run({ days: ['21:00-23:59', '', '', '', '', '', ''] }).days[0].night, 'night boundary: 20:00-00:00 has exactly 2 h in 22-06 -> night; 21:00-23:59 has 1.98 -> not');
const early = run({ days: ['04:00-13:00', '05:00-14:00', '', '', '', '', ''] });
check(early.days[0].night && early.days[0].norm === 7 && early.days[0].h125 === 1.5 && !early.days[1].night && early.days[1].ot === 0, 'morning: 04:00-13:00 has 2 h before 06:00 -> night, 8.5 h on 7 = 1.5; 05:00-14:00 has 1 h -> a day shift, 8.5 on 8.6 = none');
const eve = run({ days: ['', '', '', '08:00-17:00', '', '', ''], kind: ['', '', '', 'eve', '', '', ''] });
check(eve.days[3].norm === 7 && eve.days[3].why === 'ערב חג' && eve.days[3].h125 === 1.5, 'the day before a holiday (s.2(ב)): norm 7; 8.5 h -> 1.5 at 125%');
const sunRest = run({ week: 6, rest: 'sun', days: ['6', '8', '8', '8', '8', '8', '7'] });
check(sunRest.days[0].rest && sunRest.days[0].hRest === 6 && sunRest.days[6].norm === 7 && sunRest.days[6].eveOfRest && sunRest.week.reg === 42 && sunRest.days[6].weeklyOt === 5, 'rest on Sunday (s.7(ב)(2)): Sunday hours at 150%; Saturday is the eve of rest (norm 7); 40 + 2 = 42, 5 weekly overtime on Saturday');
const partTime = hoursOnly(['10', '10', '10', '', '', '', ''], { salary: 4000, monthHours: 100 });
check(partTime.rate === 40 && partTime.week.h125 === 4.2 && partTime.pay.extra === 210 && !partTime.flags.some((f) => f.level === 'danger'), 'part time: 4,000 for 100 contract hours = 40 an hour; 3 days of 10 h -> 1.4 x 3 = 4.2 at 125% = 210 (daily counting, the directive)');
const restLong = run({ days: ['', '', '', '', '', '', '12'], brk: 0 });
check(restLong.days[6].hRest === 12 && restLong.days[6].restOver === 3.4 && restLong.pay.pRest === 900 && restLong.flags.some((f) => f.level === 'info' && f.he.includes('אינו קובע שיעור מצטבר')), 'rest day 12 h: 12 x 50 x 1.5 = 900; 3.4 h above a regular day flagged (no combined rate in the law)');

/* ---------------- Limits and flags ---------------- */
const twelve = hoursOnly(['12', '13', '', '', '', '', '']);
check(twelve.flags.some((f) => f.level === 'warn' && f.he.startsWith('שני:') && f.he.includes('12')) && !twelve.flags.some((f) => f.he.startsWith('ראשון')), 'a 13-hour day is over the general permit (12); exactly 12 is not flagged');
const sixteen = hoursOnly(['12', '12', '12', '12', '10', '', '']);
const seventeen = hoursOnly(['12', '12', '12', '12', '12', '', '']);
check(sixteen.week.ot === 16 && !sixteen.flags.some((f) => f.he.includes('שעות נוספות בשבוע: יותר מ-16')) && seventeen.week.ot === 18 && seventeen.flags.some((f) => f.he.includes('18 שעות נוספות בשבוע: יותר מ-16')), 'exactly 16 overtime hours: no flag; 18: over the permit (16)');
check(seventeen.flags.some((f) => f.he.includes('החזקה מכסה 15')), 'over 15 overtime hours a week: the burden-of-proof rule covers 15 of them (s.26ב(ב))');
const gap = run({ days: ['14:00-23:30', '06:00-15:00', '', '', '', '', ''] });
check(gap.flags.some((f) => f.section === 'סעיף 21' && f.he.includes('6.5')), 'Sunday out at 23:30, Monday in at 06:00: 6.5 h between days, under 8 (s.21)');
const minW = run({ pay: 'hourly', hourly: 35.39 });
const minOk = run({ pay: 'hourly', hourly: 35.4 });
check(minW.minHour === 35.4 && minW.flags.some((f) => f.level === 'danger' && f.he.includes('35.4')) && !minOk.flags.some((f) => f.level === 'danger'), 'minimum wage from 1.4.2026: 35.40 an hour; 35.39 is flagged, 35.40 is not');
const youth = run({ youth: true });
check(youth.flags.some((f) => f.level === 'danger' && f.section.includes('חוק עבודת הנוער') && f.he.includes('מעל 8 שעות') && f.he.includes('מעל 40')), 'under 18: more than 8 h a day and 40 a week are flagged (Youth Labor Law s.20)');
const nightWeek = run({ days: ['22:00-10:00', '22:00-10:00', '22:00-10:00', '22:00-10:00', '22:00-10:00', '', ''], brk: 0 });
check(nightWeek.week.total === 60 && nightWeek.flags.some((f) => f.he.includes('יותר מ-58')), 'night worker, 5 x 12 = 60 h: over the 58-hour week of the permit');

const intoRest = run({ days: ['', '', '', '', '', '22:00-06:00', ''] });
check(intoRest.days[5].night && intoRest.days[5].norm === 7 && intoRest.flags.some((f) => f.level === 'info' && f.he.includes('6 שעות לתוך יום שבת') && f.section === 'סעיף 17(א)(1)'), 'a Friday night shift into Saturday: counted on Friday (night, norm 7), and the hours after midnight are flagged as possibly inside the weekly rest (s.17)');

/* ---------------- Limitation ---------------- */
const m84 = run({ months: 84 });
const m85 = run({ months: 85 });
const m84last = run({ months: 84, asOf: '2026-10-31' });
const m85next = run({ months: 85, asOf: '2026-11-01' });
check(m84.back.months === 84 && m84.back.oldest === '2019-10' && m84.back.oldestLapse === '2026-10-31' && m85.back.months === 84 && m85.back.expired === 1 && m84last.back.months === 84 && m84last.back.oldest === '2019-10' && m85next.back.months === 84 && m85next.back.oldest === '2019-11', '84 months back on 22.10.2026: 10.2019 lapses 31.10.2026, still counted (also on 31.10, the last day); 85: 9.2019 lapsed; on 1.11.2026, 85 back reach 10.2019, now lapsed, so 84 from 11.2019');
check(run({ months: 0 }).back.amount === 0 && run({ months: 0 }).events.length === 2, 'no months to check: no back pay, only the two pay dates');

/* ---------------- Input errors ---------------- */
const err = (over, field) => { const r = run(over); return !r.ok && r.errors.some((e) => e.field === field); };
check(err({ salary: 0 }, 'salary') && err({ salary: '' }, 'salary') && err({ salary: -5 }, 'salary'), 'monthly salary zero, empty or negative: an error');
check(err({ monthHours: 183 }, 'monthHours') && !run({ monthHours: 182 }).errors, 'contract hours over 182 (the order): an error; 182 is fine');
check(err({ pay: 'hourly', hourly: 0 }, 'hourly') && err({ pay: 'x' }, 'pay'), 'hourly rate zero, or no pay type: an error');
check(err({ days: ['abc', '', '', '', '', '', ''] }, 'd0') && err({ days: ['', '08:00-08:00', '', '', '', '', ''] }, 'd1') && err({ days: ['', '', '25:00-26:00', '', '', '', ''] }, 'd2') && err({ days: ['', '', '', '', '', '', ''] }, 'd0'), 'a day that is not a range or hours, the same in and out, an hour past 24, or an empty card: errors');
check(err({ weeks: 0 }, 'weeks') && err({ weeks: 6 }, 'weeks') && err({ months: 241 }, 'months') && err({ months: 1.5 }, 'months') && err({ paid: -1 }, 'paid') && err({ brk: 200 }, 'brk'), 'weeks 0 or 6, months 241 or 1.5, a negative payment, a 200-minute break: errors');
check(E.nsParseDay('0730-1900').hours === 11.5 && E.nsParseDay('8-17').hours === 9 && E.nsParseDay('9:30').hours === 9.5 && E.nsParseDay('22:00–06:00').hours === 8 && E.nsParseDay(' ').empty, 'the parser: 0730-1900, 8-17, 9:30 (hours), an en dash past midnight, blank');

/* ---------------- Rendering ---------------- */
const snap = U.snapshot(reg);
const strings = Object.values(snap).filter((v) => typeof v === 'string');
check(strings.every((s) => !/<h2/i.test(s) && !bad(s)), 'the snapshot: no <h2>, no undefined/NaN/null in any string');
check(snap.total === 1320 && snap.sticky === ils(1320, 0) && snap.result.includes('<bdi>1,320</bdi>') && snap.compare_table.includes('<caption>'), 'the snapshot: total 1,320, the sticky string, the figure in the result, the rules table with a caption');
check(snap.method.includes('9,100 ₪ ÷ 182 = 50 ₪') && snap.method.includes('15,840') && snap.method.includes('jtool-cite'), 'the method: the divisor, the back pay, cites');
const lead = snap.lead;
check(lead.includes('דוגמה מחושבת: גמול שעות נוספות לחודש') && lead.includes('class="jtool-lead__figure"><span class="jtool-amt"><bdi>1,320</bdi> ₪</span>') && lead.includes('data-lead-go') && lead.includes('href="#jtool-shaot-nosafot"') && lead.includes('15,840'), 'the lead card: the example figure 1,320, the back pay, the jump to the form');
const leadOwn = U.leadCard(reg, glob, { example: false });
const leadErr = U.leadCard(reg, run({ salary: 0 }), { example: false });
check(leadOwn.includes('החישוב שלכם') && leadOwn.includes('3,787') && leadOwn.includes('שולמו 1,500') && leadErr.includes('jtool-lead__figure">—</strong>') && [leadOwn, leadErr].every((h) => !/<h2/i.test(h) && !bad(h)), 'the lead card for the reader: 3,787 and the payment; the error card shows "—"');
const card = U.timeCard(reg, ex);
check(card.includes('<caption>') && card.includes('11 שעות: 8.6 רגילות, 2 ב-125%, 0.4 ב-150%; התקן 8.6') && card.includes('<th scope="row">') && card.includes('jt48-seg--150') && card.includes('יום המנוחה השבועית, לא עבדו'), 'the time card: a captioned table, a text line per day for screen readers, the 150% segment, the rest row');
const brief = U.aiBrief(reg, ex);
const words = brief.split(/\s+/).length;
check(brief.includes('1,320') && brief.includes('15,840') && brief.includes('9,000 עד 10,000') && !/\d{9}/.test(brief) && !bad(brief) && words >= 40 && words <= 90 && brief.trim().endsWith('?'), `the brief: the key figures, the salary as a band, no 9-digit run, ${words} words, ends with the question`);
const hs = handoffState('x', brief, 'mediation');
check(hs.phase === 'intake' && hs.simulationPurpose === 'mediation' && hs.description.includes('1,320'), 'the handoff state: intake, mediation, the description carries 1,320');
check(snap.result.includes('<h4>התרחיש לסימולציה</h4>') && snap.result.includes('data-act="rehearse"') && snap.result.includes('purpose=mediation') && snap.result.includes('topic=employment'), 'the result renders the brief under h4 with the rehearse button (mediation, employment)');
const na = U.nextActions(reg, glob);
const allowed = ['/claim-labor-court/', '/weekly-rest-holiday-pay/', '/minimum-wage-israel-2025/', '/net-salary-calculator/', '/payslip-requirements/', '/gmar-cheshbon/'];
check(na.official.some((x) => x.url === 'https://www.gov.il/he/service/work-rights-violation-complaints') && na.links.length >= 2 && na.links.length <= 4 && na.links.every((x) => allowed.includes(x.path)) && na.links[0].path === '/claim-labor-court/', 'next actions: the Ministry complaint service + 2-4 internal links from the site list, the labor-court claim first when money is owed');
check(U.nextActions(reg, shab).links.some((x) => x.path === '/weekly-rest-holiday-pay/') && U.nextActions(reg, minW).links.some((x) => x.path === '/minimum-wage-israel-2025/'), 'next actions follow the result: rest-day work -> the rest-day page; under the minimum -> the minimum-wage tool');
const det = U.renderDetails(reg, ex, { today: '2026-10-22', printedOn: '2026-10-22' });
check(det.includes('הודפס ב-22.10.2026') && det.includes('jt48-print') && det.includes('data-act="ics"') && det.includes('data-act="print"') && det.includes('נבדק 22.10.2026'), 'details: the print summary with the print date and the checked-on date, the .ics and print buttons');
const hist = U.historyTable(reg);
check(hist.includes('28.9.1951') && hist.includes('1.4.2018') && hist.includes('19.3.2018') && hist.includes('35.40') && hist.includes('29.12'), 'what changed and when: 1951, the 2018 permit and order, the minimum hourly wage 29.12 (2018) to 35.40 (2026)');
const form = U.renderForm(reg, EX);
check(!/<h2/i.test(form) && !bad(form) && form.includes('data-preset="night"') && form.includes('aria-pressed="true"') && (form.match(/class="jt48-slot__in"/g) || []).length === 7, 'the form: 5 preset chips (the example pressed), 7 day rows, no h2');
check(!bad(U.renderResult(reg, run({ salary: 0 }))) && U.renderResult(reg, run({ salary: 0 })).includes('צריך לתקן') && U.renderDetails(reg, run({ salary: 0 })) === '', 'an input error renders its message and no details');
check(['long', 'six', 'night', 'shabbat', 'global'].every((k) => { const r = preset(k); return r.ok && !bad(U.renderResult(reg, r)) && !bad(U.renderDetails(reg, r)) && !/<h2/i.test(U.renderResult(reg, r) + U.renderDetails(reg, r)); }), 'every preset renders without undefined/NaN/null or h2');

/* ---------------- Share state ---------------- */
const st = U.stateOf(EX);
const back = U.inputOf(decodeState(`#s=${st}`, U.KEYS));
const rb = E.nsCompute(reg, back);
check(st === 'tm/s9100/w5/rs/q4/d0730-1900~0800-1830~0800-1830~0800-1700~0800-1600~n~n/b30/e4/m12' && rb.ok && rb.month.extra === 1320 && rb.back.amount === 15840, 'stateOf -> decodeState -> inputOf: the same week, 1,320 and 15,840');
const k2 = Object.assign({}, EX, { pay: 'hourly', hourly: 45.5, week: 6, rest: 'fri', kind: ['night', '', 'eve', '', '', '', ''], days: ['9.5', '22:00-06:00', '8', '', '', '', ''], paid: 200, youth: true, monthHours: 150 });
const k2b = U.inputOf(decodeState(`#s=${U.stateOf(k2)}`, U.KEYS));
check(k2b.pay === 'hourly' && k2b.hourly === 45.5 && k2b.week === 6 && k2b.rest === 'fri' && k2b.kind[0] === 'night' && k2b.kind[2] === 'eve' && k2b.days[0] === '9.5' && k2b.days[1] === '2200-0600' && k2b.paid === 200 && k2b.youth && E.nsCompute(reg, k2b).month.extra === E.nsCompute(reg, k2).month.extra, 'round trip of an hourly, 6-day, Friday-rest, night/eve, youth week');
check(!/[א-ת]/.test(U.stateOf(k2)) && !U.stateOf(Object.assign({}, EX, { days: ['שלום', '', '', '', '', '', ''] })).includes('שלום'), 'the share link carries no Hebrew free text: a day is a range, hours or "n"');

console.log(`${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
