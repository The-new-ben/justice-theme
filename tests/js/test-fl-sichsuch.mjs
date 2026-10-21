/**
 * Golden tests for the dispute-settlement clock (the family + land wave, HAD-579; tool yishuv-sichsuch).
 * Run: node tests/js/test-fl-sichsuch.mjs
 *
 * Hand-computed with the Hebrew calendar of 5787: Rosh Hashana 12-13.9.2026, Yom Kippur 21.9.2026, 14-22 Tishri =
 * 25.9-3.10.2026 (12 days not counted, s.6א(א)(1)); 14-21 Nisan = 21.4-28.4.2027 (8 days). The filing day is not counted
 * (Interpretation Law s.10(א)); an end on a Saturday moves to the Sunday (s.10(ג)).
 *  - 21.10.2026 (Wed): 45 days = 5.12.2026, a Saturday -> 6.12.2026 (day 46); 60 days = 20.12.2026 (Sun); 15 more =
 *    4.1.2027; the other side from 5.1.2027; a year = 21.10.2027.
 *  - 1.9.2026: 45 + 12 = 57 days = 28.10.2026; 60 + 12 = 72 = 12.11.2026; 15 more = 27.11.2026.
 *  - 15.3.2027, extended: 60 + 8 = 68 = 22.5.2027 (Sat) -> 23.5.2027; 75 + 8 = 83 = 6.6.2027; 15 more = 21.6.2027.
 *  - 15.3.2027, not extended: 45 + 8 = 53 = 7.5.2027; 68 = 22.5.2027 (Sat) -> 23.5.2027; 15 more = 7.6.2027.
 *  - The 15 days from 18.9.2026 end on 3.10.2026, a holiday (and a Saturday): then the holidays are not counted
 *    (s.6א(ג)): 19, 20, 22, 23, 24.9 and 4-13.10 = 15 -> 13.10.2026.
 *  - 5 months (s.3(ז)(4), s.10(ב)): 31.10.2026 -> 31.3.2027; 30.9.2026 -> 28.2.2027; 28.2.2026 -> 28.7.2026.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../../assets/js/tools/sichsuch-fl-engine.js';
import * as U from '../../assets/js/tools/sichsuch-fl-ui.js';
import * as G from '../../assets/js/tools/gerushin-engine.js';
import { decodeState, ics, isoToHe } from '../../assets/js/tools/instrument.js';
import { handoffState } from '../../assets/js/tools/sim-handoff.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reg = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
let failures = 0;
let passed = 0;
const check = (ok, what) => { if (ok) { passed += 1; } else { failures += 1; console.error(`FAIL: ${what}`); } };
const fs = reg.fl_sichsuch;
const dc = reg.divorce_cost;
const ds = dc.disputes;
const EX = Object.assign({}, U.EXAMPLE, { today: '2026-10-21' });
const run = (over) => E.compute(reg, Object.assign({}, EX, over));
const ms = (r, key) => (r.milestones.find((m) => m.key === key) || {});
const words = (t) => t.trim().split(/\s+/).length;

/* ---------- 1. The registry: the wave-4 figures re-read, the new dataset, the fees ---------- */
check(ds.meetings_max === 4 && ds.meetings_days === 45 && ds.extend_days === 15 && ds.stay_days === 60 && ds.stay_days_extended === 75 && ds.claim_days === 15, 'divorce_cost.disputes: 4 meetings, 45 days (+15 once), stay 60 or 75, 15 days to file (s.3(ב)(1), (3), s.3(ה), s.4)');
check(ds.sections.meetings === 'סעיף 3(ב)(1)' && ds.sections.meetings_days === 'סעיף 3(ב)(3)' && ds.sections.stay === 'סעיף 3(ה)' && ds.sections.claims === 'סעיף 4' && ds.url === fs.law_url, 'divorce_cost.disputes: the sections match the law text, and it points at the same law page');
check(fs.checked_on === '2026-10-21' && fs.verified.on === '2026-10-21' && Object.keys(fs.verified).length === 10, 'fl_sichsuch: checked 21.10.2026, with the verification of every divorce_cost.disputes value');
check(fs.regs_year === 2016 && fs.regs_he.includes('התשע"ו-2016') && fs.regs_url.endsWith('501_431.htm') && fs.law_url.endsWith('501_151.htm'), 'the regulations are of 2016 (התשע"ו), the law of 2014, both on Nevo');
check(fs.fee_check.family_request === dc.family.request && fs.fee_check.rabbinical_request === dc.rabbinical.request && dc.family.request === 120 && dc.rabbinical.request === 119 && dc.family.items.request === 'פרט 13' && dc.rabbinical.items.request === 'פרט 19(טז)', 'the request fee: 120 (family court, item 13) and 119 (rabbinical court, item 19(טז)), the same in both datasets');
const urls = [fs.source_url, fs.law_url, fs.regs_url, fs.interpretation_url, fs.filing.family.url, fs.filing.rabbinical.url, fs.filing.guide_url, fs.filing.approve_url, ...Object.values(fs.forms).map((f) => f.url)];
check(urls.every((u) => /^https:\/\/(www\.)?(nevo\.co\.il|gov\.il)\//.test(u)), 'every source and form link is an official https url (Nevo or gov.il)');
check(fs.periods.notice_days === 5 && fs.periods.relief_months === 5 && fs.periods.repeat_years === 1 && fs.periods.agreed_claim_days === 15 && fs.periods.stop_claim_days === 15 && fs.periods.response_days === 10 && fs.periods.service_days === 3 && fs.periods.passport_days === 30, 'the other periods: 5 days notice, 5 months, 1 year, 15 + 15 days, 10 days to respond, 3 days to serve, 30 days to travel');
check(fs.urgent.list.length === 7 && fs.urgent.list.filter((x) => x.no_request).length === 5 && fs.court_change.shorten.length === 10 && fs.court_change.extend.length === 3, 'the urgent list (7, five of them without a request, reg. 2א(א)) and the grounds of reg. 16 (10 to shorten, 3 to extend)');
check(fs.scope.subjects.length === 6 && fs.scope.excluded.length === 4 && fs.scope.not_applicable.length === 4, 'the scope: 6 subjects need a request, 4 exclusions (s.2), 4 proceedings outside the law (s.4א)');

/* ---------- 2. The clock is the wave-4 clock, exactly ---------- */
const same = ['2026-10-21', '2026-09-01', '2027-03-15', '2027-04-01', '2026-08-20', '2026-09-10', '2027-04-20'].every((s) => [false, true].every((x) => { const a = E.ysClock(dc, s, x); const b = G.clock(dc, s, x); return a.meetingsBy === b.meetingsBy && a.stayEnds === b.stayEnds && a.claimsBy === b.claimsBy && a.paused === b.paused; }));
check(same, 'ysClock gives the same meetings, stay and filing dates as gerushin-engine clock() on 14 cases');

/* ---------- 3. The example: filed today, 21.10.2026, family court, children and support ---------- */
const ex = E.compute(reg, EX);
check(ex.ok && ex.applies && ex.start === '2026-10-21' && ex.stage === 'meetings' && ex.day === 0, 'example: filed today, stage meetings, day 0');
check(ex.clock.meetingsBy === '2026-12-06' && ms(ex, 'meetings').day === 46 && ex.clock.rolled.meetings, 'example: 45 days = 5.12.2026, a Saturday, so 6.12.2026 (day 46)');
check(ex.stayEnd === '2026-12-20' && ms(ex, 'stay').day === 60 && !ex.clock.rolled.stay, 'example: the stay ends 20.12.2026, day 60 (s.3(ה))');
check(ex.claimsBy === '2027-01-04' && ex.firstFile === '2026-12-21' && ex.othersFrom === '2027-01-05' && ms(ex, 'claims').day === 75, 'example: the filer files 21.12.2026 to 4.1.2027 (day 75); the other side from 5.1.2027 (s.4)');
check(ex.repeatUntil === '2027-10-21' && ex.pauses.length === 0 && ex.fee.amount === 120 && ex.daysLeft.meetings === 46 && ex.daysLeft.stay === 60, 'example: the year ends 21.10.2027, no holiday in the period, fee 120, 46 and 60 days left');
check(ex.flags.some((f) => f.code === 'support_back' && f.section === 'תקנה 15(ב)' && f.he.includes('21.10.2026')) && ex.flags.some((f) => f.code === 'children' && f.section === 'סעיף 3(ג)(4)') && ex.flags.some((f) => f.code === 'rolled'), 'example: maintenance relates back to 21.10.2026 (reg. 15(ב)), children arrangements (s.3(ג)(4)), the Saturday rule');

/* ---------- 4. The hard cases ---------- */
const tishri = run({ start: '1.9.2026' });
check(tishri.clock.meetingsBy === '2026-10-28' && tishri.stayEnd === '2026-11-12' && tishri.claimsBy === '2026-11-27' && tishri.pauses.length === 12, 'Tishri: 1.9.2026 + 45 + 12 holiday days = 28.10.2026; stay 12.11.2026; file by 27.11.2026; 12 days not counted (s.6א(א)(1))');
check(tishri.stage === 'meetings' && tishri.day === 50 && tishri.daysLeft.meetings === 7 && tishri.daysLeft.stay === 22 && tishri.flags.some((f) => f.code === 'pause' && f.he.includes('12 ימים')), 'Tishri: on 21.10.2026 it is day 50, 7 days of meetings and 22 of stay left, and the pause note counts 12 days');
const nisanX = run({ start: '15.3.2027', forum: 'rabbinical', extended: true, lastMeeting: '10.5.2027', today: '2027-05-12' });
check(nisanX.clock.meetingsBy === '2027-05-23' && nisanX.stayEnd === '2027-06-06' && nisanX.claimsBy === '2027-06-21' && nisanX.pauses.length === 8, 'Nisan, extended: 15.3.2027 + 60 + 8 = 22.5.2027 (Sat) -> 23.5.2027; stay 6.6.2027 (75 + 8); file by 21.6.2027');
check(nisanX.noticeBy === '2027-05-16' && ms(nisanX, 'notice').section === 'סעיף 3(ד); תקנה 8(א)' && nisanX.fee.amount === 119 && nisanX.forumHe === 'בית הדין הרבני', 'Nisan: the last meeting 10.5.2027 + 5 days = 15.5.2027 (Sat) -> 16.5.2027 (s.3(ד), reg. 8(א)); the rabbinical fee 119');
const nisan = run({ start: '15.3.2027' });
check(nisan.clock.meetingsBy === '2027-05-07' && nisan.stayEnd === '2027-05-23' && nisan.claimsBy === '2027-06-07' && nisan.stage === 'before', 'Nisan, not extended: 7.5.2027, 23.5.2027 (22.5 is a Saturday), file by 7.6.2027; on 21.10.2026 the request is not filed yet');
const w = E.ysFileWindow('2026-09-18', 15);
check(w.by === '2026-10-13' && w.paused, 'the 15 days from 18.9.2026 would end 3.10.2026, a holiday: the holidays are then not counted, so 13.10.2026 (s.6א(ג))');
const court = run({ start: '1.9.2026', track: 'court', courtEnd: '18.9.2026' });
check(court.stayEnd === '2026-09-18' && court.claimsBy === '2026-10-13' && court.stayKind === 'court' && court.flags.some((f) => f.code === 'court' && f.section.includes('תקנה 16')), 'a court-set end, 18.9.2026: the filer\'s 15 days run from it and end 13.10.2026 (reg. 16(ו), s.6א(ג))');
const agreed = run({ track: 'agreed', agreedEnd: '31.1.2027' });
check(agreed.stayEnd === '2027-01-31' && agreed.claimsBy === '2027-02-15' && agreed.othersFrom === '2027-02-16' && ms(agreed, 'stay').kind === 'info' && ms(agreed, 'agreed').kind === 'end', 'agreed extension to 31.1.2027: the filer files by 15.2.2027 (reg. 8(ג)); the statutory end becomes information');
const stop = run({ track: 'agreed', agreedEnd: '31.1.2027', stopOn: '10.1.2027' });
check(stop.stayEnd === '2027-01-10' && stop.claimsBy === '2027-01-25' && stop.stayKind === 'stop' && ms(stop, 'claims').section === 'תקנה 8(ד)', 'a stop notice on 10.1.2027: the filer files within 15 days, by 25.1.2027 (reg. 8(ד))');
check(E.ysAddMonths('2026-10-31', 5) === '2027-03-31' && E.ysAddMonths('2026-09-30', 5) === '2027-02-28' && E.ysAddMonths('2026-02-28', 5) === '2026-07-28', '5 months by s.10(ב): 31.10.2026 -> 31.3.2027; 30.9.2026 -> 28.2.2027; 28.2.2026 -> 28.7.2026 (not the month\'s end)');
const relief = run({ reliefOn: '31.10.2026' });
check(relief.reliefUntil === '2027-03-31' && ms(relief, 'relief').section === 'סעיף 3(ז)(4)', 'an urgent order given 31.10.2026 stands to 31.3.2027 unless the court set another period (s.3(ז)(4))');
const other = run({ role: 'other' });
check(other.flags.some((f) => f.code === 'summons') && other.flags.some((f) => f.code === 'second' && f.section === 'תקנה 2א(ב)') && ms(other, 'open').he.includes('מי שהגיש'), 'the other side: the invitation is a court summons, no second request during the stay (reg. 2א(ב)), files only after the filer\'s window');
const rep = run({ special: 'repeat', start: '1.3.2026' });
const repLate = run({ special: 'repeat', start: '1.3.2026', today: '2027-03-02' });
check(rep.fee === null && rep.flags.some((f) => f.code === 'repeat' && f.section === 'סעיף 3(י)(1)' && f.he.includes('1.3.2027')) && repLate.flags.some((f) => f.code === 'repeat' && f.section === 'סעיף 3(י)(2)'), 'a request filed 1.3.2026: on 21.10.2026 a claim without a new request until 1.3.2027 (s.3(י)(1)); on 2.3.2027 only under s.3(י)(2)');
const abroad = run({ special: 'abroad' });
const consent = run({ special: 'consent' });
const inh = run({ special: 'inheritance' });
check(abroad.ok && !abroad.applies && abroad.why.section === 'סעיף 4א(1)' && abroad.fee === null && abroad.milestones.length === 0 && abroad.flags.some((f) => f.section === 'תקנה 16(א)(5)'), 'domicile abroad: the law does not apply (s.4א(1)); no fee, no clock; staying abroad only: shorten (reg. 16(א)(5))');
check(!consent.applies && consent.why.section.includes('סעיף 2') && !inh.applies && inh.why.section === 'סעיף 2, פסקה (2)', 'divorce or an agreement by consent, and inheritance: no request (s.2)');
const urgent = run({ special: 'urgent' });
const viol = run({ special: 'violence' });
check(urgent.applies && urgent.flags.some((f) => f.code === 'urgent' && f.section.includes('סעיף 3(ז)(1)')) && viol.applies && viol.flags.some((f) => f.code === 'violence' && f.section === 'סעיף 4א(3) ו-(4)') && viol.flags.some((f) => f.code === 'violence_short' && f.section.includes('תקנה 16(א)(6)')), 'urgent: any time (s.3(ז)(1)); a protection order is outside the law (s.4א(3)-(4)) and the stay may be shortened (reg. 16(א)(6), (7))');

/* ---------- 5. Every input error ---------- */
const errOf = (r, field) => !r.ok && r.errors.some((e) => e.field === field);
check(errOf(run({ start: '31.2.2027' }), 'start') && errOf(run({ start: 'אתמול' }), 'start'), 'a date that does not exist (31.2.2027) or is not a date is an error');
check(errOf(run({ start: '1.12.2020' }), 'start') && run({ start: '1.12.2020' }).errors[0].he.includes('8.12.2020') && run({ start: '8.12.2020' }).ok, 'before 8.12.2020 the periods were different (amendment 3): an error that says so; 8.12.2020 itself computes');
check(errOf(run({ start: '1.1.2028' }), 'start'), 'a filing day more than a year ahead is an error');
check(errOf(run({ track: 'agreed' }), 'agreedEnd') && errOf(run({ track: 'agreed', agreedEnd: '20.12.2026' }), 'agreedEnd') && run({ track: 'agreed', agreedEnd: '21.12.2026' }).ok, 'the agreed extension: missing, or not after the statutory end 20.12.2026, is an error; 21.12.2026 is the first valid day');
check(errOf(run({ track: 'agreed', agreedEnd: '31.1.2027', stopOn: '20.12.2026' }), 'stopOn') && errOf(run({ track: 'agreed', agreedEnd: '31.1.2027', stopOn: '1.2.2027' }), 'stopOn') && run({ track: 'agreed', agreedEnd: '31.1.2027', stopOn: '31.1.2027' }).ok, 'a stop notice outside the extension (on 20.12.2026 or after 31.1.2027) is an error; on its last day it is valid');
check(errOf(run({ track: 'court' }), 'courtEnd') && errOf(run({ track: 'court', courtEnd: '21.10.2026' }), 'courtEnd') && errOf(run({ lastMeeting: '1.13.2026' }), 'lastMeeting') && errOf(run({ reliefOn: 'x' }), 'reliefOn'), 'the court end missing or on the filing day, a bad meeting day and a bad order day are errors');
check(run({ track: 'base', agreedEnd: 'garbage', courtEnd: 'garbage' }).ok, 'values left in hidden fields of another track never block the calculation');
const late = run({ lastMeeting: '10.12.2026' });
check(late.ok && late.flags.some((f) => f.code === 'late_meeting') && late.noticeBy === '2026-12-15', 'a last meeting after the window (10.12.2026) is computed and flagged; notice by 15.12.2026');

/* ---------- 6. Rendering: the snapshot, the picture, the print, the brief, the next actions ---------- */
const snap = U.snapshot(reg);
check(snap.tool === 'yishuv-sichsuch' && snap.input === U.EXAMPLE && snap.total === 60 && snap.sticky.includes('20.12.2026') && snap.registry_version === reg.registry_version, 'snapshot: the tool id, the example, 60 days and the sticky date 20.12.2026');
check(snap.result.includes('20.12.2026') && snap.result.includes('6.12.2026') && snap.result.includes('4.1.2027') && snap.result.includes('120') && snap.result.includes('דוגמה מחושבת'), 'snapshot result: the three dates, the fee and the example label');
check(snap.result.includes('jtool-cite') && snap.result.includes('סעיף 3(ה)') && snap.result.includes('תקנה 15(ב)') && snap.method.includes('סעיף 10(א)') && snap.method.includes('סעיף 6א(ג)') && snap.method.startsWith('<ol>'), 'the cites in the result, and the computation path as an <ol> with s.10(א) and s.6א(ג)');
check(snap.compare_table.includes('<caption>') && snap.compare_table.includes('45 ימים') && snap.compare_table.includes('75 אחרי הארכה') && snap.compare_table.includes('119 ₪') && snap.compare_table.includes('תקנה 8(ד)'), 'the page table: caption, 45 days, 60/75, both fees and every period with its section');
check(snap.result.includes('class="jt42-bar" role="img"') && /aria-label="ציר הזמן של הבקשה מ-21\.10\.2026: פגישות עד יום 46, עיכוב ההליכים עד יום 60, 15 ימים למגיש הבקשה עד יום 75\. היום: יום 0\./.test(snap.result), 'the picture: role img with a full text label (days 46, 60, 75, today day 0)');
check((snap.result.match(/class="jt42-st__i /g) || []).length === ex.milestones.length && snap.result.includes('jt42-now') && snap.result.includes('jt42-seg--meet') && snap.result.includes('jt42-seg--file'), 'the picture: one station per milestone (the text equivalent), the today marker, the segments');
const tishriHtml = U.renderResult(reg, tishri);
check((tishriHtml.match(/class="jt42-pause"/g) || []).length === 12 && tishriHtml.includes('היום, יום <bdi>50</bdi>'), 'Tishri picture: 12 hatched holiday days and today at day 50');
const pr = U.printSummary(reg, ex);
check(pr.startsWith('<section class="jt42-print">') && pr.includes('הודפס ב-') && pr.includes('21.10.2026') && pr.includes('הנתונים') && pr.includes('דרך החישוב') && pr.includes('מקורות') && pr.includes('נכון ל-1.7.2026') && pr.includes('עודכן 15.10.2026') && snap.details.includes('jt42-print'), 'the print summary: date printed, inputs, result, path, sources with their dates; inside the details');
const ev = U.icsEvents(reg, ex);
const icsText = ics(ev, '2026-10-21T20:00:00Z');
check(ev.length === ex.milestones.length && ev.some((e) => e.date === '2026-12-20') && ev.some((e) => e.date === '2027-01-04') && icsText.includes('DTSTART;VALUE=DATE:20261220') && (icsText.match(/BEGIN:VEVENT/g) || []).length === 7 && U.icsEvents(reg, abroad).length === 0, 'ics: every milestone (7 for the example), 20.12.2026 and 4.1.2027 inside; nothing when the law does not apply');
const brief = U.aiBrief(reg, ex);
check(brief.includes('20.12.2026') && brief.includes('46 ימים') && brief.includes('60 ימים') && brief.includes('הילדים והמזונות') && brief.includes('השאלה לתרגול') && words(brief) >= 40 && words(brief) <= 90, `aiBrief: the stay end, the days left, the subjects and the question, ${words(brief)} words`);
const briefs = [ex, tishri, nisanX, nisan, agreed, stop, other, rep, abroad, consent, urgent].map((r) => U.aiBrief(reg, r));
check(briefs.every((b) => !/\d{9}/.test(b) && !/undefined|NaN|null/.test(b) && words(b) >= 40 && words(b) <= 90), 'aiBrief in 11 states: 40-90 words, no 9-digit sequence, no undefined/NaN/null');
check(snap.result.includes('<h4>התרחיש לסימולציה</h4>') && snap.result.includes('data-act="rehearse"') && snap.result.includes('purpose=mediation&amp;topic=family-law'), 'the scenario is shown under its h4 with the rehearse link (family-law, mediation)');
const na = U.nextActions(reg, ex);
const nSite = na.filter((x) => !x.official);
check(snap.result.includes('<h4>מה עושים עכשיו</h4>') && na.filter((x) => x.official).every((x) => x.url.startsWith('https://')) && na.some((x) => x.official && x.url === fs.filing.family.url) && nSite.length >= 2 && nSite.length <= 4 && nSite.every((x) => x.url.startsWith('/')) && nSite.some((x) => x.url === '/family-dispute-resolution/') && nSite.some((x) => x.url === '/child-support/'), 'next actions: official links (the Judiciary service), 2-4 site steps incl. /family-dispute-resolution/ and /child-support/');
const naR = U.nextActions(reg, nisanX);
check(naR.some((x) => x.url === fs.filing.rabbinical.pay_url) && naR.some((x) => x.url === '/fees-rabbinical-courts/') && naR.some((x) => x.he.includes('16.5.2027') && x.url === fs.forms['3'].url), 'next actions, rabbinical: pay the fee online, the rabbinical fees page, form 3 by 16.5.2027');
check(U.nextActions(reg, consent).some((x) => x.url === '/settlement-agreement-approval/') && U.nextActions(reg, inh).some((x) => x.url === '/succession-law-israel/'), 'next actions when the law does not apply: agreement approval; inheritance');
const all = [ex, tishri, nisanX, nisan, agreed, stop, court, relief, other, rep, repLate, abroad, consent, inh, urgent, viol, late].map((r) => U.renderResult(reg, r) + U.renderDetails(reg, r)).join('')
	+ U.renderResult(reg, run({ start: '31.2.2027' })) + snap.form + snap.compare_table + snap.method + U.renderForm(reg, Object.assign({}, EX, { track: 'agreed', special: 'repeat' }));
check(!/<h2[\s>]/.test(all) && !/undefined|NaN|>null</.test(all), 'no <h2> and no undefined/NaN/null in any rendered state (17 states, the error, the form, the tables)');
check(all.includes('צריך לתקן את הקלט') && all.includes('לא צריך') && all.includes('שבעת הטפסים') && all.includes('סעד דחוף וסעד זמני') && all.includes('טופס 7'), 'the error, the not-needed state, the forms table, the urgent relief and the court-change sections render');
check(snap.form.includes('value="21.10.2026"') && snap.form.includes('name="jt42-forum"') && snap.form.includes('name="jt42-subj"') && snap.form.includes('name="jt42-sp"') && !snap.form.includes('ת.ז'), 'the form: the example day 21.10.2026, the forum, the subjects and the special case; no ID field');
check(U.verdictSentence(reg, ex) === 'בקשה לבית המשפט לענייני משפחה מ-21.10.2026: פגישות המהו"ת עד 6.12.2026, עיכוב ההליכים עד 20.12.2026, ואתם, כמי שהגיש את הבקשה, תובעים ראשונים עד 4.1.2027. אגרה: 120 ₪.', 'the verdict sentence, word for word');

/* ---------- 7. The share state round trip, and nothing personal in it ---------- */
const full = { forum: 'rabbinical', start: '2027-03-15', role: 'other', subjects: ['children', 'property'], extended: true, track: 'agreed', agreedEnd: '2027-07-01', stopOn: '2027-06-20', courtEnd: '', lastMeeting: '2027-05-10', reliefOn: '2027-04-02', special: 'urgent' };
const st = U.stateOf(full);
const back = U.inputOf(decodeState(`#s=${st}/@yishuv-sichsuch`, U.KEYS));
check(JSON.stringify(back) === JSON.stringify(full), 'stateOf -> decodeState -> inputOf returns the same answers (a share link names its tool)');
check(/^[0-9A-Za-z._~/-]+$/.test(st) && !/[֐-׿]/.test(st), 'the share state is codes and dates only: no Hebrew, no names');
const exBack = U.inputOf(decodeState(U.stateOf(Object.assign({}, U.EXAMPLE, { start: '2026-10-21' })), U.KEYS));
check(exBack.subjects.join() === 'children,support' && exBack.forum === 'family' && exBack.start === '2026-10-21' && U.inputOf({}) === null && U.inputOf(decodeState(U.stateOf(Object.assign({}, U.EXAMPLE, { subjects: [] })), U.KEYS)).subjects.length === 0, 'the example round-trips; an empty choice of subjects survives; an empty hash gives no input');
check(U.TOOL_ID === 'yishuv-sichsuch' && U.YS_SIM_URL.includes('topic=family-law') && U.YS_SIM_URL.includes('purpose=mediation'), 'the tool id and the simulation entry (family-law, mediation)');

/* ---------- 8. The polish round: the window handoff, the button, the sticky string ---------- */
const hs = handoffState('x', U.aiBrief(reg, ex), 'mediation');
check(hs.phase === 'intake' && hs.locale === 'he' && hs.simulationPurpose === 'mediation' && hs.sessionId === 'x' && hs.description.includes('20.12.2026') && hs.description.includes('השאלה לתרגול') && !/\d{9}/.test(hs.description) && hs.chatHistory.length === 0, 'the handoff state: intake, Hebrew, mediation, the scenario with the stay end 20.12.2026, no 9-digit run');
check(U.YS_REHEARSE_LABEL === 'לתרגל את פגישת המהו"ת עם הנתונים שלכם' && snap.result.includes('data-act="rehearse">לתרגל את פגישת המהו&quot;ת עם הנתונים שלכם</a>') && !snap.result.includes('להעתיק ולתרגל'), 'the rehearse button no longer says copy: "לתרגל את פגישת המהו"ת עם הנתונים שלכם"');
check(snap.sticky === `<bdi>${isoToHe(ex.stayEnd)}</bdi>` && snap.sticky === '<bdi>20.12.2026</bdi>' && !/^\d+(\.\d+)?$/.test(snap.sticky), 'the snapshot sticky is the same string mount writes (<bdi>20.12.2026</bdi>), never a raw number');
const srcNames = (f) => [...readFileSync(join(ROOT, 'assets/js/tools', f), 'utf8').matchAll(/^(?:export )?(?:async )?(?:function|const|let|class) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
const bundleNames = ['instrument.js', 'sim-handoff.js', 'dates.js', 'sichsuch-fl-engine.js', 'sichsuch-fl-ui.js'].flatMap(srcNames);
check(bundleNames.length === new Set(bundleNames).size && ['SIM_ORIGIN', 'SIM_TYPE', 'uuid4', 'handoffState', 'openSimulation'].every((n) => bundleNames.filter((x) => x === n).length === 1), 'no top-level name repeats across the five bundled files (sim-handoff.js included)');
const uiSrc = readFileSync(join(ROOT, 'assets/js/tools/sichsuch-fl-ui.js'), 'utf8');
const reh = uiSrc.slice(uiSrc.indexOf("act === 'rehearse'"), uiSrc.indexOf("act === 'save'"));
check(reh.includes('openSimulation(brief, purpose, b.getAttribute(\'href\'))') && reh.indexOf('ev.preventDefault()') > 0 && !reh.includes('await') && reh.includes('copyText(brief)'), 'mount: rehearse opens the handoff, preventDefault before any await, the clipboard only as the fallback');

console.log(`fl-sichsuch: ${passed} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
