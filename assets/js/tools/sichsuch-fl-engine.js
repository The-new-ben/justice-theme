/**
 * The clock of a request to settle a family dispute (the family + land wave, HAD-579; tool id yishuv-sichsuch, on
 * /request-for-family-dispute-settlements/). From the day the request is filed in the family court or the rabbinical
 * court: the meetings at the support unit, the stay of proceedings, the filer's 15 days, the agreed or court-set
 * changes, the 5-day notice, the life of an urgent order and the one-year shortcut; the exceptions; the fee.
 *
 * Dependency-free ES module (dates.js only). Every number is read from the registry:
 *  - registry.divorce_cost.disputes (wave 4, re-read against the law on 21.10.2026): four meetings within 45 days,
 *    once extendable by 15 (s.3(ב)(1), (3)); no claim for 60 days, or 75 (s.3(ה)); the filer's 15 days (s.4).
 *  - registry.divorce_cost.family.request / .rabbinical.request: the request fee of each forum (item 13; item 19(טז)).
 *  - registry.fl_sichsuch: everything else, each with its section (the 5 days of s.3(ד) and reg. 8(א), the agreed
 *    extension of reg. 8(ג), the stop notice of reg. 8(ד), the court change of reg. 16(ו), the 5 months of s.3(ז)(4),
 *    the year of s.3(י)(1), the exceptions of s.2 and s.4א, the urgent list of reg. 12, maintenance from the request
 *    day under reg. 15(ב)).
 * Counting: the filing day is not counted (Interpretation Law s.10(א)); the holiday days of s.6א(א)(1) are not counted
 * in the 45/60/75 days nor in the 5 days; the 15 days to file count them unless the last day falls on one (s.6א(ג));
 * an end that falls on a Saturday or a statutory rest day moves to the next day (Interpretation Law s.10(ג)), and the
 * 15 days run from the moved end. This is the clock of the wave-4 engine (gerushin-engine, clock()), kept identical
 * (a test compares them) and extended; it is written here because that engine's compute() would collide in a bundle.
 * Periods in months or years end on the same day number, or on the month's last day (s.10(ב)).
 */
import { addDays, addCountedDays, daysBetween, isFamilyPause, offRestDays, parseDate } from './dates.js';

export const YS_FORUMS = ['family', 'rabbinical'];
export const YS_SUBJECTS = ['children', 'support', 'property', 'divorce'];
export const YS_TRACKS = ['base', 'agreed', 'court'];
// none; abroad (s.4א(1)); violence (s.4א(3)-(4)); consent (s.2); urgent (s.3(ז)); repeat (s.3(י)(1)); inheritance (s.2(2)).
export const YS_SPECIAL = ['none', 'abroad', 'violence', 'consent', 'urgent', 'repeat', 'inheritance'];

/** n months after a day, Interpretation Law s.10(ב): the same day number, or the target month's last day. */
export function ysAddMonths(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const total = y * 12 + (m - 1) + n;
	const ny = Math.floor(total / 12);
	const nm = total % 12 + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(nm).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

/** The 15 days to file (s.4; reg. 8(ג)-(ד); reg. 16(ו)) after a day: holidays count unless the last day falls on one
 * (s.6א(ג)), then they do not (s.6א(א)); an end on a rest day moves to the next day (Interpretation Law s.10(ג)). */
export function ysFileWindow(from, days) {
	let raw = addDays(from, days);
	if (isFamilyPause(raw)) { raw = addCountedDays(from, days, isFamilyPause); }
	const by = offRestDays(raw);
	return { by, rolled: by !== raw, paused: raw !== addDays(from, days) };
}

/** The statutory clock from the filing day: meetings (45 or 60), the stay (60 or 75), the filer's 15 days. */
export function ysClock(dc, start, extended) {
	const d = dc.disputes;
	const meetingsDays = d.meetings_days + (extended ? d.extend_days : 0);
	const stayDays = extended ? d.stay_days_extended : d.stay_days;
	const meetingsRaw = addCountedDays(start, meetingsDays, isFamilyPause);
	const stayRaw = addCountedDays(start, stayDays, isFamilyPause);
	const meetingsBy = offRestDays(meetingsRaw);
	const stayEnds = offRestDays(stayRaw);
	const win = ysFileWindow(stayEnds, d.claim_days);
	return {
		start, extended: Boolean(extended), meetingsBy, stayEnds, claimsBy: win.by,
		paused: meetingsRaw !== addDays(start, meetingsDays) || stayRaw !== addDays(start, stayDays),
		rolled: { meetings: meetingsBy !== meetingsRaw, stay: stayEnds !== stayRaw, claims: win.rolled },
		meetingsDays, stayDays, claimDays: d.claim_days, meetings: d.meetings_max,
	};
}

/** The holiday days of s.6א(א)(1) between two days (both included). */
export function ysPauseDays(from, to) {
	const out = [];
	for (let day = from, guard = 0; day <= to && guard < 800; day = addDays(day, 1), guard += 1) {
		if (isFamilyPause(day)) { out.push(day); }
	}
	return out;
}

/** The days of a forum's request: its fee and the source of the fee. */
export function ysFee(registry, forum) {
	const dc = registry.divorce_cost;
	const f = forum === 'rabbinical' ? dc.rabbinical : dc.family;
	return { amount: f.request, section: f.items.request, url: f.url, regulation_he: f.regulation_he, current_to: f.current_to };
}

const ysBlank = (v) => v === undefined || v === null || String(v).trim() === '';
/** A ground of regulation 16 by its section (so a reordered list never cites the wrong ground). */
const ysGround = (fs, section) => fs.court_change.shorten.find((g) => g.section === section) || { he: '', section };

/**
 * input = { start (the filing day; '' = today), today (ISO; default fl_sichsuch.checked_on), forum ('family' |
 *           'rabbinical'), role ('filer' | 'other'), subjects ([...YS_SUBJECTS]), extended (the unit extended the
 *           meetings by 15 days), track ('base' | 'agreed' | 'court'), agreedEnd (the day the written extension ends),
 *           stopOn (a stop notice during the agreed extension), courtEnd (the stay's end as a court set it),
 *           lastMeeting (the last meeting's day), reliefOn (the day an urgent or temporary order was given),
 *           special (YS_SPECIAL) }
 */
export function compute(registry, input) {
	const dc = registry.divorce_cost;
	const ds = dc.disputes;
	const fs = registry.fl_sichsuch;
	const errors = [];
	const today = parseDate(input.today) || fs.checked_on;
	const forum = input.forum === 'rabbinical' ? 'rabbinical' : 'family';
	const role = input.role === 'other' ? 'other' : 'filer';
	const special = YS_SPECIAL.includes(input.special) ? input.special : 'none';
	const trk = YS_TRACKS.includes(input.track) ? input.track : 'base';
	const extended = Boolean(input.extended);
	const subjects = YS_SUBJECTS.filter((s) => Array.isArray(input.subjects) && input.subjects.includes(s));
	const dateOf = (field, label) => {
		if (ysBlank(input[field])) { return null; }
		const iso = parseDate(input[field]);
		if (!iso) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 1.11.2026` }); }
		return iso;
	};
	const start = ysBlank(input.start) ? today : dateOf('start', 'יום הגשת הבקשה');
	if (start && start < fs.start.amend3) {
		errors.push({ field: 'start', he: `${fs.start.old_he}. הכלי מחשב בקשות שהוגשו מ-${ysHe(fs.start.amend3)} (תיקון מס' 3)` });
	}
	if (start && daysBetween(today, start) > 366) { errors.push({ field: 'start', he: 'יום הגשה רחוק מדי: עד שנה מהיום' }); }
	const lastMeeting = dateOf('lastMeeting', 'יום הפגישה האחרונה');
	const reliefOn = dateOf('reliefOn', 'יום מתן הצו');
	const agreedEnd = trk === 'agreed' ? dateOf('agreedEnd', 'סוף ההארכה המוסכמת') : null;
	const stopOn = trk === 'agreed' ? dateOf('stopOn', 'יום ההודעה על הפסקת ההליך') : null;
	const courtEnd = trk === 'court' ? dateOf('courtEnd', 'סוף העיכוב שקבעה הערכאה') : null;
	if (trk === 'agreed' && ysBlank(input.agreedEnd)) { errors.push({ field: 'agreedEnd', he: 'עד איזה יום הסכמתם להאריך את העיכוב (טופס 3)?' }); }
	if (trk === 'court' && ysBlank(input.courtEnd)) { errors.push({ field: 'courtEnd', he: 'עד איזה יום קבעה הערכאה את העיכוב?' }); }
	if (errors.length) { return { ok: false, errors }; }

	const per = fs.periods;
	const forumHe = fs.filing[forum].name_he;
	const fee = ysFee(registry, forum);
	const flags = [];
	const flag = (code, he, section, url) => { flags.push({ code, he, section: section || '', url: url || fs.law_url }); };
	const base = { ok: true, today, start, forum, forumHe, role, special, track: trk, extended, subjects, fee, flags };

	// 1. Requests the law does not cover: no request, no meetings, no stay.
	if (special === 'abroad' || special === 'consent' || special === 'inheritance') {
		const why = {
			abroad: { he: dc.abroad_he, section: 'סעיף 4א(1)' },
			consent: { he: 'תביעת גירושין או אבהות שמוגשת בהסכמת שני הצדדים, ובקשה לאישור הסכם, אינן צריכות בקשה ליישוב סכסוך: מגישים ישר לערכאה', section: 'סעיף 2, הגדרות "תובענה" ו"תובענה בעניין של סכסוך משפחתי"' },
			inheritance: { he: 'תביעה בענייני ירושה אינה "סכסוך משפחתי" לפי החוק: אין בקשה ליישוב סכסוך, ומגישים לפי הדין של הירושה', section: 'סעיף 2, פסקה (2)' },
		}[special];
		flag(special, why.he, why.section);
		if (special === 'abroad') { const g = ysGround(fs, 'תקנה 16(א)(5)'); flag('abroad_short', `אם מקום המושב של הצד השני בישראל והוא רק שוהה בחוץ לארץ, החוק חל; ${g.he}: אפשר לבקש לקצר את העיכוב בטופס 7`, g.section, fs.regs_url); }
		return Object.assign(base, { applies: false, why, milestones: [], stage: 'none', fee: null });
	}

	// 2. The clock of this request.
	const clk = ysClock(dc, start, extended);
	let stayEnd = clk.stayEnds;
	let stayKind = 'law';
	let win = { by: clk.claimsBy, rolled: clk.rolled.claims };
	if (trk === 'agreed') {
		if (agreedEnd <= clk.stayEnds) { errors.push({ field: 'agreedEnd', he: `ההארכה המוסכמת באה אחרי סוף העיכוב שבחוק, ${ysHe(clk.stayEnds)}: תאריך מאוחר ממנו (סעיף 3(ה))` }); }
		if (stopOn && (stopOn <= clk.stayEnds || stopOn > agreedEnd)) { errors.push({ field: 'stopOn', he: `הודעה על הפסקת ההליך נותנים בתקופת ההארכה: אחרי ${ysHe(clk.stayEnds)} ועד ${ysHe(agreedEnd)} (תקנה 8(ד))` }); }
		if (errors.length) { return { ok: false, errors }; }
		stayEnd = stopOn || agreedEnd;
		stayKind = stopOn ? 'stop' : 'agreed';
		win = ysFileWindow(stayEnd, stopOn ? per.stop_claim_days : per.agreed_claim_days);
	} else if (trk === 'court') {
		if (courtEnd <= start) { errors.push({ field: 'courtEnd', he: `סוף העיכוב שנקבע צריך להיות אחרי יום הבקשה, ${ysHe(start)}` }); }
		if (errors.length) { return { ok: false, errors }; }
		stayEnd = courtEnd;
		stayKind = 'court';
		win = ysFileWindow(courtEnd, ds.claim_days);
	}
	const firstFile = addDays(stayEnd, 1);
	const othersFrom = addDays(win.by, 1);
	const noticeBy = lastMeeting ? offRestDays(addCountedDays(lastMeeting, per.notice_days, isFamilyPause)) : null;
	const reliefUntil = reliefOn ? ysAddMonths(reliefOn, per.relief_months) : null;
	const repeatUntil = ysAddMonths(start, 12 * per.repeat_years);
	const horizon = win.by > clk.claimsBy ? win.by : clk.claimsBy;
	const pauses = ysPauseDays(addDays(start, 1), horizon);

	// 3. The milestones, in date order, each with its day count from the filing and its section.
	const ms = [];
	const add = (key, date, he, section, url, kind) => { ms.push({ key, date, day: daysBetween(start, date), he, section, url: url || fs.law_url, kind, past: date < today }); };
	const forumUnit = fs.filing[forum].unit_he;
	add('filed', start, `הגשת הבקשה ליישוב סכסוך (טופס 1) ל${forumHe}`, `${fs.forms['1'].section}; סעיף 3(א)`, fs.regs_url, 'start');
	add('meetings', clk.meetingsBy, `סוף החלון לפגישות המהו"ת: עד ${clk.meetings} פגישות ב${forumUnit}${extended ? ', אחרי הארכה של יחידת הסיוע' : ''}`, `${ds.sections.meetings}, ${ds.sections.meetings_days}`, ds.url, 'deadline');
	if (noticeBy) { add('notice', noticeBy, `הודעה בטופס 3: להמשיך בהליך חלופי, הסכם, או שאין הסכמה (${per.notice_days} ימים מהפגישה האחרונה)`, per.notice_section, fs.regs_url, 'deadline'); }
	add('stay', clk.stayEnds, `סוף עיכוב ההליכים שבחוק (${clk.stayDays} ימים)${trk === 'base' ? '' : ': העיכוב ממשיך אחריו'}`, ds.sections.stay, ds.url, trk === 'base' ? 'end' : 'info');
	if (trk === 'agreed') { add('agreed', agreedEnd, 'סוף ההארכה המוסכמת בכתב (טופס 3)', per.agreed_section, fs.regs_url, stopOn ? 'info' : 'end'); }
	if (stopOn) { add('stop', stopOn, 'הודעה בכתב על הפסקת ההליך לפני סוף ההארכה', per.stop_section, fs.regs_url, 'end'); }
	if (trk === 'court') { add('court', courtEnd, 'סוף עיכוב ההליכים כפי שקבעה הערכאה (טופס 7)', per.court_section, fs.regs_url, 'end'); }
	add('open', firstFile, role === 'filer' ? 'היום הראשון שבו אפשר להגיש תביעה, עם טופס 4' : 'מי שהגיש את הבקשה רשאי להגיש תביעה מהיום', role === 'filer' ? `סעיף 4; ${fs.forms['4'].section}` : ds.sections.claims, role === 'filer' ? fs.regs_url : ds.url, 'window');
	add('claims', win.by, `סוף ${stayKind === 'stop' ? per.stop_claim_days : ds.claim_days} הימים שבהם רק מי שהגיש את הבקשה תובע, לכל ערכאה מוסמכת`, stayKind === 'agreed' ? 'סעיף 4; תקנה 8(ג)' : stayKind === 'stop' ? per.stop_section : stayKind === 'court' ? 'סעיף 4; תקנה 16(ו)' : ds.sections.claims, stayKind === 'law' ? ds.url : fs.regs_url, 'deadline');
	add('others', othersFrom, 'מכאן גם הצד השני רשאי להגיש תביעה, בעניינים שלא נתבעו', ds.sections.claims, ds.url, 'window');
	if (reliefUntil) { add('relief', reliefUntil, `סוף ${per.relief_months} החודשים של הצו הדחוף או הזמני, אם הערכאה לא קבעה אחרת`, per.relief_section, fs.law_url, 'deadline'); }
	add('repeat', repeatUntil, 'סוף השנה שבה מי שהגיע לפגישות תובע בלי בקשה חדשה', per.repeat_section, fs.law_url, 'info');
	ms.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	// 4. Where today stands.
	let stage;
	if (today < start) { stage = 'before'; } else if (today <= clk.meetingsBy) { stage = 'meetings'; } else if (today <= stayEnd) { stage = 'stay'; } else if (today <= win.by) { stage = 'priority'; } else if (today <= repeatUntil) { stage = 'open'; } else { stage = 'late'; }
	const left = (iso) => Math.max(0, daysBetween(today, iso));
	const daysLeft = { meetings: left(clk.meetingsBy), stay: left(stayEnd), claims: left(win.by), repeat: left(repeatUntil) };

	// 5. Notes the result must carry (each with its section).
	if (clk.paused || pauses.length) { flag('pause', `${fs.pause.he}. בתקופה הזאת: ${pauses.length} ימים כאלה.`, fs.pause.section); }
	if (clk.rolled.meetings || clk.rolled.stay || win.rolled) { flag('rolled', 'מועד שנופל בשבת או ביום מנוחה עובר ליום שאחריו; תקופה כוללת ימי מנוחה רק כשהם לא הימים האחרונים שלה', fs.interpretation_sections.rest, fs.interpretation_url); }
	if (extended) { flag('extended', `יחידת הסיוע האריכה פעם אחת את הפגישות ב-${ds.extend_days} ימים, ולכן העיכוב ${ds.stay_days_extended} ימים`, `${ds.sections.meetings_days}; ${ds.sections.stay}`, ds.url); }
	if (trk === 'court') { flag('court', fs.periods.court_he, fs.periods.court_section, fs.regs_url); }
	if (trk === 'agreed') { flag('agreed', fs.periods.agreed_he, fs.periods.agreed_section, fs.regs_url); }
	if (stopOn) { flag('stop', fs.periods.stop_he, fs.periods.stop_section, fs.regs_url); }
	if (lastMeeting && lastMeeting > clk.meetingsBy) { flag('late_meeting', `הפגישה האחרונה שהזנתם אחרי ${ysHe(clk.meetingsBy)}: לפי החוק כל הפגישות מתקיימות עד אז, ובקשה להאריך את העיכוב מגישים בטופס 7`, ds.sections.meetings_days, ds.url); }
	if (subjects.includes('support')) {
		flag('support_back', `${fs.support_back.he}: כאן ${ysHe(start)}`, fs.support_back.section, fs.regs_url);
		flag('support_urgent', fs.urgent.support_only_urgent_he, fs.urgent.support_only_urgent_section, fs.regs_url);
	}
	if (subjects.includes('children')) { flag('children', fs.meetings.children_he, fs.meetings.children_section, fs.law_url); }
	if (subjects.includes('property')) { flag('property', fs.urgent.temporary_he, fs.urgent.temporary_section, fs.regs_url); }
	if (special === 'urgent') { flag('urgent', `${fs.urgent.anytime_he}. ${fs.urgent.no_request_he}`, `${fs.urgent.anytime_section}; ${fs.urgent.no_request_section}`, fs.regs_url); }
	if (special === 'violence') {
		flag('violence', 'צו הגנה לפי החוק למניעת אלימות במשפחה, וצו לפי חוק מניעת הטרדה מאיימת, מבקשים ישר: החוק לא חל עליהם. שאר העניינים, כמו מזונות ורכוש, עוברים את השעון שלמטה', 'סעיף 4א(3) ו-(4)', fs.law_url);
		const g6 = ysGround(fs, 'תקנה 16(א)(6)');
		const g7 = ysGround(fs, 'תקנה 16(א)(7)');
		flag('violence_short', `${g6.he}; ${g7.he}: הערכאה רשאית לקצר את העיכוב (טופס 7)`, `${g6.section}, ${g7.section}`, fs.regs_url);
	}
	if (role === 'other') {
		flag('summons', `${fs.meetings.summons_he}. ${fs.nonattend.he}`, `${fs.meetings.summons_section}; ${fs.nonattend.section}`, fs.regs_url);
		flag('second', fs.periods.second_request_he, fs.periods.second_request_section, fs.regs_url);
	}
	if (special === 'repeat') {
		const can = today >= othersFrom && today <= repeatUntil;
		flag('repeat', can ? `${fs.periods.repeat_he}: אצלכם מהיום ועד ${ysHe(repeatUntil)}` : today > repeatUntil ? `עברה שנה מהבקשה הקודמת (${ysHe(repeatUntil)}). ${fs.periods.repeat2_he}` : `התקופות של הבקשה הקודמת עוד לא עברו: תביעה בלי בקשה חדשה רק מ-${ysHe(othersFrom)} ועד ${ysHe(repeatUntil)}`, can || today <= repeatUntil ? per.repeat_section : per.repeat2_section, fs.law_url);
	}
	const fileHere = !(special === 'repeat');

	return Object.assign(base, {
		applies: true, clock: clk, stayEnd, stayKind, claimsBy: win.by, firstFile, othersFrom, noticeBy, reliefUntil, repeatUntil,
		agreedEnd, stopOn, courtEnd, lastMeeting, reliefOn, horizon, pauses, milestones: ms, stage, daysLeft,
		day: daysBetween(start, today), fee: fileHere ? fee : null,
		supportFrom: subjects.includes('support') ? start : null,
	});
}

/** 2026-10-21 -> 21.10.2026 (the engine's own, so the engine needs nothing from instrument.js). */
export function ysHe(iso) {
	if (!iso) { return ''; }
	const [y, m, d] = iso.split('-').map(Number);
	return `${d}.${m}.${y}`;
}
