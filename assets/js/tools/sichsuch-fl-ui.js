/**
 * The family + land wave (HAD-579), lane sichsuch: the clock of a request to settle a family dispute
 * (/request-for-family-dispute-settlements/, tool id yishuv-sichsuch, CSS prefix jt42).
 * The picture is the court's own calendar: one track from the filing day, in day counts, with the meetings window,
 * the stay of proceedings and the filer's 15 days as segments, the holiday days that the law does not count hatched,
 * and today's marker. The stations under it, the table of dates and the printed summary say the same in text.
 * Bundle: instrument.js + sim-handoff.js + dates.js + sichsuch-fl-engine.js + sichsuch-fl-ui.js (no name shared with
 * sichsuch-ui.js, the inheritance dispute navigator, which is never bundled with this tool).
 * The rehearse button opens the simulation with the scenario already written (sim-handoff.js, a one-time window
 * handoff); when the popup is blocked it copies the scenario and the plain link opens.
 */
import { compute, ysHe, YS_SUBJECTS, YS_SPECIAL } from './sichsuch-fl-engine.js';
import { daysBetween, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'yishuv-sichsuch';
const P = 'jt42';
// The simulation of the first meeting at the support unit (the catalog's rehearse entry: family-law, mediation).
export const YS_SIM_URL = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=family-law';
export const YS_REHEARSE_LABEL = 'לתרגל את פגישת המהו"ת עם הנתונים שלכם';

export const EXAMPLE = { start: '', forum: 'family', role: 'filer', subjects: ['children', 'support'], extended: false, track: 'base', agreedEnd: '', stopOn: '', courtEnd: '', lastMeeting: '', reliefOn: '', special: 'none' };

const YS_SUBJECT_HE = { children: 'ילדים: החזקה וזמני שהות', support: 'מזונות', property: 'רכוש ואיזון משאבים', divorce: 'הגירושין עצמם' };
const YS_SUBJECT_SHORT = { children: 'הילדים', support: 'המזונות', property: 'הרכוש', divorce: 'הגירושין' };
const YS_SPECIAL_HE = { none: 'אין', abroad: 'הצד השני גר בחוץ לארץ', violence: 'צו הגנה או הטרדה מאיימת', consent: 'גירושין או הסכם בהסכמה', urgent: 'יש עניין דחוף', repeat: 'בקשה קודמת בשנה האחרונה, והגעתי לפגישות', inheritance: 'סכסוך ירושה' };
const YS_STAGE_HE = { before: 'הבקשה עוד לא הוגשה', meetings: 'פגישות המהו"ת', stay: 'עיכוב ההליכים, אחרי חלון הפגישות', priority: '15 הימים של מי שהגיש את הבקשה', open: 'אפשר להגיש תביעה', late: 'עברה שנה מהבקשה', none: 'החוק לא חל' };

function ysCite(text, href) { return href && text ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const ysNis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const ysChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const ysDateField = (id, label, value, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(value)}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
const ysAsDate = (v) => { const raw = String(v || '').trim(); if (!raw) { return ''; } const iso = parseDate(raw); return iso ? isoToHe(iso) : raw; };
function ysList(items) { return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ו${items[items.length - 1]}`; }

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const fs = reg.fl_sichsuch;
	const today = parseDate(input.today) || fs.checked_on;
	const subj = Array.isArray(input.subjects) ? input.subjects : [];
	const special = YS_SPECIAL.includes(input.special) ? input.special : 'none';
	const trk = ['agreed', 'court'].includes(input.track) ? input.track : 'base';
	const more = input.extended || trk !== 'base' || input.lastMeeting || input.reliefOn;
	return `<fieldset class="jtool-field"><legend>איפה מגישים</legend><div class="jtool-chips">${ysChip('forum', 'family', 'בית המשפט לענייני משפחה', input.forum !== 'rabbinical')}${ysChip('forum', 'rabbinical', 'בית הדין הרבני', input.forum === 'rabbinical')}</div>`
		+ `<p class="jtool-hint">לפי הסמכות המקומית (${esc(fs.filing.local_section)}). אחרי העיכוב אפשר לתבוע בכל ערכאה מוסמכת (סעיף 4).</p></fieldset>`
		+ `<div class="jtool-row">${ysDateField('start', special === 'repeat' ? 'יום הגשת הבקשה הקודמת' : 'יום הגשת הבקשה', ysAsDate(input.start) || isoToHe(today), 'הימים נספרים מהיום שאחריו')}`
		+ `<fieldset class="jtool-field"><legend>מי הגיש</legend><div class="jtool-chips">${ysChip('role', 'filer', 'אני הגשתי', input.role !== 'other')}${ysChip('role', 'other', 'הצד השני הגיש', input.role === 'other')}</div></fieldset></div>`
		+ `<fieldset class="jtool-field"><legend>על מה המחלוקת</legend><div class="jtool-chips">${YS_SUBJECTS.map((k) => ysChip('subj', k, YS_SUBJECT_HE[k], subj.includes(k), 'checkbox')).join('')}</div>`
		+ `<p class="jtool-hint">משמש רק לתוצאה ולתרגול. לא נשמר אצלנו.</p></fieldset>`
		+ `<details class="jtool-more"${more ? ' open' : ''}><summary>מה קרה מאז ההגשה</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px">${ysChip('ext', '1', `יחידת הסיוע האריכה את הפגישות ב-${reg.divorce_cost.disputes.extend_days} ימים`, input.extended, 'checkbox')}</div>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>עיכוב ההליכים</legend><div class="jtool-chips">${ysChip('trk', 'base', 'כמו בחוק', trk === 'base')}${ysChip('trk', 'agreed', 'הסכמנו בכתב להאריך (טופס 3)', trk === 'agreed')}${ysChip('trk', 'court', 'הערכאה קיצרה או האריכה (טופס 7)', trk === 'court')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-trk="agreed"${trk === 'agreed' ? '' : ' hidden'}>${ysDateField('agreedEnd', 'ההארכה המוסכמת עד', ysAsDate(input.agreedEnd))}${ysDateField('stopOn', 'הודעה על הפסקת ההליך (אם ניתנה)', ysAsDate(input.stopOn))}</div>`
		+ `<div class="jtool-row" data-if-trk="court"${trk === 'court' ? '' : ' hidden'}>${ysDateField('courtEnd', 'העיכוב שקבעה הערכאה, עד', ysAsDate(input.courtEnd))}</div>`
		+ `<div class="jtool-row">${ysDateField('lastMeeting', 'הפגישה האחרונה ביחידת הסיוע', ysAsDate(input.lastMeeting), 'למועד של טופס 3')}${ysDateField('reliefOn', 'ניתן צו דחוף או זמני ביום', ysAsDate(input.reliefOn), 'לסוף תוקף הצו')}</div></details>`
		+ `<details class="jtool-more"${special !== 'none' ? ' open' : ''}><summary>מקרה מיוחד</summary><div class="jtool-chips" style="margin-top:8px">${YS_SPECIAL.map((k) => ysChip('sp', k, YS_SPECIAL_HE[k], special === k)).join('')}</div>`
		+ `<p class="jtool-hint">${esc(fs.start.permanent_he)}. ${esc(fs.start.amend3_he)}.</p></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (!r.applies) { return `${r.why.he} (${r.why.section}).`; }
	const c = r.clock;
	const filer = r.role === 'filer' ? 'אתם, כמי שהגיש את הבקשה, תובעים ראשונים' : 'רק מי שהגיש את הבקשה תובע';
	return `בקשה ל${r.forumHe} מ-${ysHe(r.start)}: פגישות המהו"ת עד ${ysHe(c.meetingsBy)}, עיכוב ההליכים עד ${ysHe(r.stayEnd)}, ו${filer} עד ${ysHe(r.claimsBy)}.${r.fee ? ` אגרה: ${ysNis(r.fee.amount)}.` : ''}`;
}

/** The track: day 0 to the first day the other side may file, segments and today. */
export function clockHtml(reg, r) {
	const c = r.clock;
	const end = r.othersFrom;
	const D = Math.max(1, daysBetween(r.start, end));
	const at = (iso) => Math.min(100, Math.max(0, (daysBetween(r.start, iso) / D) * 100));
	const seg = (cls, from, to, label) => { const a = at(from); const b = at(to); return b > a ? `<span class="jt42-seg ${cls}" style="inset-inline-start:${a.toFixed(2)}%;width:${(b - a).toFixed(2)}%" title="${esc(label)}"></span>` : ''; };
	const lawStay = c.stayEnds;
	let bar = seg('jt42-seg--meet', r.start, c.meetingsBy, 'פגישות המהו"ת');
	bar += seg('jt42-seg--stay', c.meetingsBy, lawStay < r.stayEnd ? lawStay : r.stayEnd, 'עיכוב ההליכים');
	if (r.stayEnd > lawStay) { bar += seg('jt42-seg--more', lawStay, r.stayEnd, r.stayKind === 'court' ? 'העיכוב שקבעה הערכאה' : 'ההארכה המוסכמת'); }
	bar += seg('jt42-seg--file', r.stayEnd, r.claimsBy, '15 הימים של מגיש הבקשה');
	bar += seg('jt42-seg--open', r.claimsBy, end, 'כל צד תובע');
	bar += r.pauses.filter((p) => p <= end).map((p) => `<span class="jt42-pause" style="inset-inline-start:${(at(p) - 100 / D).toFixed(2)}%;width:${(100 / D).toFixed(2)}%"></span>`).join('');
	const ticks = [[r.start, 0], [c.meetingsBy, daysBetween(r.start, c.meetingsBy)], [r.stayEnd, daysBetween(r.start, r.stayEnd)], [r.claimsBy, daysBetween(r.start, r.claimsBy)]];
	bar += ticks.map(([iso, n]) => `<span class="jt42-tick" style="inset-inline-start:${at(iso).toFixed(2)}%"><bdi>${n}</bdi></span>`).join('');
	// The pin's label leans into the track near either end, so it never leaves the card at 390 px.
	const pin = (pos, text) => `<span class="jt42-now${pos < 15 ? ' jt42-now--s' : pos > 85 ? ' jt42-now--e' : ''}" style="inset-inline-start:${pos.toFixed(2)}%"><b>${text}</b></span>`;
	const now = r.today < r.start ? pin(0, 'היום: לפני ההגשה') : r.today <= end ? pin(at(r.today), `היום, יום <bdi>${r.day}</bdi>`) : pin(100, `היום: יום <bdi>${r.day}</bdi>`);
	const label = `ציר הזמן של הבקשה מ-${ysHe(r.start)}: פגישות עד יום ${daysBetween(r.start, c.meetingsBy)}, עיכוב ההליכים עד יום ${daysBetween(r.start, r.stayEnd)}, 15 ימים למגיש הבקשה עד יום ${daysBetween(r.start, r.claimsBy)}. היום: יום ${r.day}.${r.pauses.length ? ` ${r.pauses.length} ימי חג שלא נספרים.` : ''}`;
	const stations = r.milestones.map((m) => `<li class="jt42-st__i jt42-st__i--${m.kind}${m.past ? ' jt42-st__i--past' : ''}"><span class="jt42-st__day">יום <bdi>${m.day}</bdi>${m.past ? ' · עבר' : m.date === r.today ? ' · היום' : ''}</span><strong class="jt42-st__date"><bdi>${isoToHe(m.date)}</bdi></strong><span class="jt42-st__what">${esc(m.he)}</span><span class="jt42-st__sec">${ysCite(m.section, m.url)}</span></li>`).join('');
	return `<figure class="jt42-clock"><p class="jt42-clock__h">השעון שבחוק, בימים מיום ההגשה</p>`
		+ `<div class="jt42-bar" role="img" aria-label="${esc(label)}">${bar}${now}</div>`
		+ `<p class="jt42-legend" aria-hidden="true"><span><i class="jt42-key jt42-seg--meet"></i>פגישות</span><span><i class="jt42-key jt42-seg--stay"></i>עיכוב הליכים</span>${r.stayEnd > lawStay ? `<span><i class="jt42-key jt42-seg--more"></i>${r.stayKind === 'court' ? 'עיכוב שקבעה הערכאה' : 'הארכה מוסכמת'}</span>` : ''}<span><i class="jt42-key jt42-seg--file"></i>15 ימים למגיש</span><span><i class="jt42-key jt42-pause jt42-key--pause"></i>חג שלא נספר</span></p>`
		+ `<figcaption><ol class="jt42-st" aria-label="התחנות בציר, לפי תאריך">${stations}</ol></figcaption></figure>`;
}

/** The scenario for the simulation: neutral, built only from the computed facts (no names, no ID, no address). */
export function aiBrief(reg, r) {
	if (!r || !r.ok) { return ''; }
	const subj = r.subjects.length ? ysList(r.subjects.map((s) => YS_SUBJECT_SHORT[s])) : '';
	const subjLine = subj ? `נושאי המחלוקת: ${subj}.` : 'נושאי המחלוקת: עוד לא נבחרו.';
	const forum = r.forumHe;
	if (!r.applies) {
		return `סכסוך משפחתי שמתנהל מול ${forum}. ${r.why.he}. ${subjLine} השאלה לתרגול: איך לנהל שיחה רגועה עם הצד השני כדי להגיע להסכמות לפני שפונים לערכאה, ומה להציע קודם?`;
	}
	const c = r.clock;
	const dl = r.daysLeft;
	const when = r.day === 0 ? 'היום' : r.day > 0 ? `לפני ${r.day} ימים, ב-${ysHe(r.start)}` : `בעוד ${-r.day} ימים, ב-${ysHe(r.start)}`;
	const future = r.day < 0;
	const who = r.role === 'filer' ? (future ? 'אני אגיש את הבקשה.' : 'אני הגשתי את הבקשה.') : (future ? 'הצד השני יגיש את הבקשה, ואני אוזמן לפגישות.' : 'הצד השני הגיש את הבקשה, ואני הוזמנתי לפגישות.');
	const stage = {
		before: `אחרי ההגשה יהיו ${c.meetingsDays} ימים לעד ${c.meetings} פגישות מהו"ת ו-${c.stayDays} ימי עיכוב הליכים.`,
		meetings: `השלב: פגישות המהו"ת ביחידת הסיוע, עד ${c.meetings} פגישות; נשארו ${dl.meetings} ימים לפגישות ו-${dl.stay} ימים עד סוף עיכוב ההליכים ב-${ysHe(r.stayEnd)}.`,
		stay: `חלון הפגישות נגמר; נשארו ${dl.stay} ימים עד סוף עיכוב ההליכים ב-${ysHe(r.stayEnd)}.`,
		priority: `עיכוב ההליכים נגמר; עד ${ysHe(r.claimsBy)} רק מי שהגיש את הבקשה תובע, עוד ${dl.claims} ימים.`,
		open: `עיכוב ההליכים נגמר ב-${ysHe(r.stayEnd)}, ו-15 הימים של מי שהגיש את הבקשה נגמרו ב-${ysHe(r.claimsBy)}; מאז כל צד רשאי לתבוע, ועד ${ysHe(r.repeatUntil)} בלי בקשה חדשה.`,
		late: `עיכוב ההליכים נגמר ב-${ysHe(r.stayEnd)}, ועברה שנה מהבקשה ב-${ysHe(r.repeatUntil)}; תביעה חדשה צריכה עכשיו בקשה חדשה, אלא אם תלויה ועומדת בינינו תביעה, או שהסתיימה בשנה האחרונה.`,
	}[r.stage];
	const about = subj || 'הסכסוך';
	const q = r.stage === 'before' || r.stage === 'meetings'
		? `איך להציג בפגישה הראשונה ביחידת הסיוע, בלי עורך דין, מה חשוב לי לגבי ${about}, ולהציע הסדר זמני בהסכמה עד סוף העיכוב?`
		: r.stage === 'stay'
			? `איך להסכים עם הצד השני על המשך בגישור, ומה להציע כדי להגיע להסכם על ${about}?`
			: `איך לנסות עוד פעם גישור על ${about} לפני שמגישים תביעה?`;
	return `בקשה ליישוב סכסוך ${future ? 'תוגש' : 'הוגשה'} ל${forum} ${when}. ${who} ${stage} ${subjLine} השאלה לתרגול: ${q}`;
}

/** The next actions: the form, the office, the deadline (official links), then 2-4 steps on the site. */
export function nextActions(reg, r) {
	if (!r.ok) { return []; }
	const fs = reg.fl_sichsuch;
	const fl = fs.filing[r.forum];
	const out = [];
	const official = (he, url) => out.push({ he, url, official: true });
	const site = (he, url) => out.push({ he, url, official: false });
	if (!r.applies) {
		if (r.special === 'consent') {
			official('בקשה לאישור הסכם בין בני זוג, בלי בקשה ליישוב סכסוך', fs.filing.approve_url);
			site('אישור הסכם: מה בודקים ואיך מגישים', '/settlement-agreement-approval/');
			site('הסכם גירושין: מה כולל', '/divorce-agreement/');
		} else if (r.special === 'inheritance') {
			site('חוק הירושה: מי יורש ובכמה', '/succession-law-israel/');
		} else {
			official('הרשות השופטת: מתי לא פותחים יישוב סכסוך', fs.filing.family.url);
			site('בתי המשפט לענייני משפחה לפי מחוז', '/directory-family-courts/');
		}
		site('דיני משפחה: כל המדריכים והכלים', '/family-law/');
		return out;
	}
	if (r.stage === 'before' || (r.role === 'filer' && r.day <= 0)) {
		official(`להגיש טופס 1 ל${fl.name_he}: ${fl.channels[0]}`, fl.url);
	}
	if (r.fee) {
		official(`אגרה ${ysNis(r.fee.amount)} (${r.fee.section}); ${fl.exempt_he}`, r.forum === 'rabbinical' ? fl.pay_url : fl.exempt_url);
	}
	if (r.stage === 'before' || r.stage === 'meetings') {
		official(`עד ${ysHe(r.clock.meetingsBy)}: להגיע לפגישות המהו"ת; לראשונה בלי עורך דין`, fs.filing.guide_url);
	}
	if (r.noticeBy && r.noticeBy >= r.today) { official(`עד ${ysHe(r.noticeBy)}: טופס 3 ליחידת הסיוע ולצד השני`, fs.forms['3'].url); }
	if (r.special === 'urgent' || r.special === 'violence') { official('סעד דחוף בטופס 6, בכל עת', fs.forms['6'].url); }
	if (r.role === 'filer') {
		official(`מ-${ysHe(r.firstFile)} עד ${ysHe(r.claimsBy)}: תביעה לערכאה המוסמכת, עם טופס 4`, fs.filing.family.url);
	} else {
		official(`עד ${ysHe(r.claimsBy)} רק מי שהגיש תובע; מ-${ysHe(r.othersFrom)} גם אתם, בעניינים שלא נתבעו`, fs.law_url);
	}
	site('מה קורה ביחידת הסיוע ומה להכין לפגישה', '/family-dispute-resolution/');
	const bySubject = [
		['support', 'מחשבון מזונות ילדים, לפני שמדברים על סכום', '/child-support/'],
		['children', 'משמורת וזמני שהות: מה בודקים', '/child-custody/'],
		['property', 'מחשבון איזון משאבים: מי משלם למי', '/resource-balancing/'],
		['divorce', 'פתיחת תיק גירושין: האגרות והמועדים', '/opening-divorce-file-rabbinical/'],
	].filter(([k]) => r.subjects.includes(k)).slice(0, 2);
	bySubject.forEach(([, he, url]) => site(he, url));
	if (r.stage === 'stay' || r.stage === 'priority') { site('גישור גירושין: איך מתכוננים', '/divorce-mediation/'); }
	site(r.forum === 'rabbinical' ? 'אגרות בית הדין הרבני' : 'בתי המשפט לענייני משפחה לפי מחוז', r.forum === 'rabbinical' ? '/fees-rabbinical-courts/' : '/directory-family-courts/');
	// 2-4 steps on the site.
	const siteItems = out.filter((x) => !x.official).slice(0, 4);
	return out.filter((x) => x.official).concat(siteItems);
}

function ysNextHtml(reg, r) {
	const items = nextActions(reg, r);
	return `<div class="jt42-next"><h4>מה עושים עכשיו</h4><ul>${items.map((x) => `<li${x.official ? ' class="jt42-next__off"' : ''}><a href="${esc(x.url)}"${x.official ? ' target="_blank" rel="noopener"' : ''}>${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

function ysBriefHtml(reg, r) {
	return `<div class="jt42-brief"><h4>התרחיש לסימולציה</h4><p class="jt42-brief__text">${esc(aiBrief(reg, r))}</p>`
		+ `<a class="jtool-btn" href="${esc(YS_SIM_URL)}" target="_blank" rel="noopener" data-act="rehearse">${esc(YS_REHEARSE_LABEL)}</a>`
		+ '<p class="jtool-hint">בלי שמות ובלי פרטים מזהים. הדמויות בסימולציה הן AI, והתרגול לא נשמר.</p></div>';
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const flags = r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}${ysCite(f.section, f.url)}</li>`).join('')}</ul>` : '';
	if (!r.applies) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--info">${esc(YS_SPECIAL_HE[r.special])}: החוק לא מחייב בקשה</p>`
			+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}בקשה ליישוב סכסוך</p><strong class="jtool-verdict__figure">לא צריך</strong>`
			+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>${flags}${ysBriefHtml(reg, r)}${ysNextHtml(reg, r)}`;
	}
	const dl = r.daysLeft;
	const left = r.stage === 'before' ? 'הבקשה עוד לא הוגשה' : r.stage === 'meetings' ? `נשארו ${dl.meetings} ימים לפגישות ו-${dl.stay} ימים לסוף העיכוב` : r.stage === 'stay' ? `נשארו ${dl.stay} ימים לסוף העיכוב` : r.stage === 'priority' ? `נשארו ${dl.claims} ימים ל-15 הימים של מגיש הבקשה` : 'העיכוב ו-15 הימים כבר נגמרו';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ השלב היום: ${esc(YS_STAGE_HE[r.stage])}${r.stage === 'before' ? '' : `, יום <bdi>${r.day}</bdi>`}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת, בקשה שמוגשת היום: ' : ''}סוף עיכוב ההליכים${r.stayKind === 'law' ? '' : r.stayKind === 'court' ? ', כפי שקבעה הערכאה' : r.stayKind === 'stop' ? ', בהודעת הפסקה' : ', בהארכה המוסכמת'}</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${isoToHe(r.stayEnd)}</bdi></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">${esc(left)}. מהיום ה-<bdi>${daysBetween(r.start, r.firstFile)}</bdi> אפשר להגיש תביעה.</p></div>`
		+ clockHtml(reg, r) + flags + ysBriefHtml(reg, r) + ysNextHtml(reg, r);
}

/** Every dated milestone, for the calendar file. */
export function icsEvents(reg, r) {
	if (!r.ok || !r.applies) { return []; }
	return r.milestones.map((m) => ({ date: m.date, summary: `יישוב סכסוך: ${m.he}`, description: `${m.section}. יום ${m.day} מהגשת הבקשה. חושב ב-jus-tice.co.il, מידע כללי ולא ייעוץ משפטי.` }));
}

/** The computation path, with the section of each step (the snapshot's method and the printed summary). */
export function methodHtml(reg, r) {
	const fs = reg.fl_sichsuch;
	const ds = reg.divorce_cost.disputes;
	if (!r.ok) { return ''; }
	if (!r.applies) { return `<ol><li>${esc(r.why.he)}${ysCite(r.why.section, fs.law_url)}</li></ol>`; }
	const c = r.clock;
	return `<ol><li>יום ההגשה, ${isoToHe(r.start)}, לא נספר; סופרים מהיום שאחריו${ysCite(fs.interpretation_sections.days, fs.interpretation_url)}</li>`
		+ `<li>פגישות המהו"ת: ${c.meetingsDays} ימים${c.extended ? ` (${ds.meetings_days} ועוד ${ds.extend_days} בהארכה)` : ''}, בלי ימי החג: ${isoToHe(c.meetingsBy)}${ysCite(ds.sections.meetings_days, ds.url)}${ysCite(fs.pause.section, fs.law_url)}</li>`
		+ `<li>עיכוב ההליכים: ${c.stayDays} ימים, בלי ימי החג: ${isoToHe(c.stayEnds)}${ysCite(ds.sections.stay, ds.url)}</li>`
		+ (r.stayKind !== 'law' ? `<li>${r.stayKind === 'court' ? 'הערכאה קבעה סוף אחר לעיכוב' : r.stayKind === 'stop' ? 'הודעה על הפסקת ההליך בתקופת ההארכה' : 'הארכה מוסכמת בכתב'}: ${isoToHe(r.stayEnd)}${ysCite(r.stayKind === 'court' ? fs.periods.court_section : r.stayKind === 'stop' ? fs.periods.stop_section : fs.periods.agreed_section, fs.regs_url)}</li>` : '')
		+ `<li>15 הימים של מי שהגיש את הבקשה: עד ${isoToHe(r.claimsBy)}; ימי החג נספרים בהם, אלא אם היום האחרון נופל בהם${ysCite(ds.sections.claims, ds.url)}${ysCite('סעיף 6א(ג)', fs.law_url)}</li>`
		+ `<li>מועד שנופל בשבת או ביום מנוחה עובר ליום שאחריו${ysCite(fs.interpretation_sections.rest, fs.interpretation_url)}</li>`
		+ (r.noticeBy ? `<li>הודעה בטופס 3: ${fs.periods.notice_days} ימים מהפגישה האחרונה, ${isoToHe(r.lastMeeting)}: עד ${isoToHe(r.noticeBy)}${ysCite(fs.periods.notice_section, fs.regs_url)}</li>` : '')
		+ (r.reliefUntil ? `<li>צו דחוף או זמני מ-${isoToHe(r.reliefOn)}: ${fs.periods.relief_months} חודשים, עד ${isoToHe(r.reliefUntil)}${ysCite(fs.periods.relief_section, fs.law_url)}</li>` : '')
		+ `<li>שנה מהבקשה, עד ${isoToHe(r.repeatUntil)}: מי שהגיע לפגישות תובע בלי בקשה חדשה${ysCite(fs.periods.repeat_section, fs.law_url)}</li>`
		+ (r.fee ? `<li>אגרת הבקשה ב${esc(r.forumHe)}: ${ysNis(r.fee.amount)}${ysCite(r.fee.section, r.fee.url)}</li>` : '')
		+ '</ol>';
}

/** The one-page summary to bring to the meeting (shown only in print). */
export function printSummary(reg, r) {
	if (!r.ok) { return ''; }
	const fs = reg.fl_sichsuch;
	const dc = reg.divorce_cost;
	const inputs = [
		['איפה', r.forumHe],
		['מי הגיש', r.role === 'filer' ? 'אני' : 'הצד השני'],
		['יום ההגשה', isoToHe(r.start)],
		['על מה המחלוקת', r.subjects.length ? r.subjects.map((s) => YS_SUBJECT_HE[s]).join('; ') : 'לא צוין'],
		['מקרה מיוחד', YS_SPECIAL_HE[r.special]],
	];
	if (r.applies) {
		inputs.push(['עיכוב ההליכים', r.stayKind === 'law' ? (r.extended ? 'כמו בחוק, אחרי הארכת הפגישות' : 'כמו בחוק') : r.stayKind === 'court' ? `הערכאה קבעה עד ${isoToHe(r.stayEnd)}` : r.stayKind === 'stop' ? `הודעת הפסקה ב-${isoToHe(r.stayEnd)}` : `הארכה מוסכמת עד ${isoToHe(r.stayEnd)}`]);
	}
	const rows = r.applies ? r.milestones.map((m) => `<tr><td><bdi>${isoToHe(m.date)}</bdi></td><td><bdi>${m.day}</bdi></td><td>${esc(m.he)}</td><td>${esc(m.section)}</td></tr>`).join('') : '';
	const sources = [
		[fs.law_he, fs.law_url, `נוסח עדכני, נבדק ${isoToHe(fs.checked_on)}`],
		[fs.regs_he, fs.regs_url, `כולל התיקון מ-${isoToHe(fs.regs_last_amended)}, נבדק ${isoToHe(fs.checked_on)}`],
		[fs.interpretation_he, fs.interpretation_url, 'סעיף 10'],
		[dc.family.regulation_he, dc.family.url, `${dc.family.items.request}, נכון ל-${isoToHe(dc.family.current_to)}`],
		[dc.rabbinical.regulation_he, dc.rabbinical.url, `${dc.rabbinical.items.request}, נכון ל-${isoToHe(dc.rabbinical.current_to)}`],
		['הרשות השופטת: בקשה ליישוב סכסוך במשפחה', fs.filing.family.url, `עודכן ${isoToHe(fs.filing.family.updated)}`],
		['בתי הדין הרבניים: פתיחת תיק ליישוב סכסוך', fs.filing.rabbinical.url, `עודכן ${isoToHe(fs.filing.rabbinical.updated)}`],
	];
	return `<section class="jt42-print"><h3>סיכום לפגישה ביחידת הסיוע: בקשה ליישוב סכסוך</h3><p class="jt42-print__date">הודפס ב-<bdi data-jt42-printed>${isoToHe(r.today)}</bdi> · jus-tice.co.il · מידע כללי, לא ייעוץ משפטי</p>`
		+ `<h4>הנתונים</h4><dl class="jt42-print__in">${inputs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`
		+ `<h4>התוצאה</h4><p>${esc(verdictSentence(reg, r))}</p>`
		+ (rows ? `<table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">יום</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody></table>` : '')
		+ `<h4>דרך החישוב</h4>${methodHtml(reg, r)}`
		+ `<h4>מקורות</h4><ul>${sources.map(([n, u, t]) => `<li>${esc(n)} (${esc(t)}): ${esc(u)}</li>`).join('')}</ul></section>`;
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const fs = reg.fl_sichsuch;
	let out = '';
	if (r.applies) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">כל המועדים, יום אחרי יום</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">יום</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ r.milestones.map((m) => `<tr${m.past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(m.date)}</bdi>${m.past ? ' (עבר)' : ''}</td><td data-th="יום"><bdi>${m.day}</bdi></td><td data-th="מה">${esc(m.he)}</td><td data-th="הכלל">${ysCite(m.section, m.url)}</td></tr>`).join('')
			+ `</tbody><caption>${esc(fs.pause.he)} (${esc(fs.pause.section)}). ${esc(fs.start.permanent_he)}.</caption></table></div></div>`;
	}
	// Where and how to file, and the fee.
	const fl = fs.filing[r.forum];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-how-h">איך מגישים ל${esc(fl.name_he)}</h3></div><ul class="jt42-list">`
		+ fl.channels.map((x) => `<li>${esc(x)}</li>`).join('')
		+ (fl.attach_he ? `<li>מצרפים: ${esc(fl.attach_he)}</li>` : '')
		+ `<li>אגרה: ${ysNis(reg.divorce_cost[r.forum].request)}${ysCite(reg.divorce_cost[r.forum].items.request, reg.divorce_cost[r.forum].url)}. ${esc(fl.exempt_he)}${ysCite(fl.exempt_section, fl.exempt_url || fl.url)}</li>`
		+ (fl.no_refund_he ? `<li>${esc(fl.no_refund_he)}${ysCite(fl.no_refund_section, fl.fee_regulation_url)}</li>` : '')
		+ (fl.phone_he ? `<li>${esc(fl.phone_he)}</li>` : '')
		+ `<li>${esc(fs.forms['1'].note_he)}</li>`
		+ `<li><a href="${esc(fl.url)}" target="_blank" rel="noopener">דף השירות הרשמי</a> (עודכן ${isoToHe(fl.updated)})</li></ul></div>`;
	// The forms.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-forms-h">שבעת הטפסים של ההליך</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-forms-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">הטופס</th><th scope="col">התקנה</th></tr></thead><tbody>`
		+ Object.keys(fs.forms).map((k) => `<tr><td data-th="הטופס"><a href="${esc(fs.forms[k].url)}" target="_blank" rel="noopener">${esc(fs.forms[k].he)}</a></td><td data-th="התקנה">${ysCite(fs.forms[k].section, fs.regs_url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	// The meetings, in one list.
	const mt = fs.meetings;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-mt-h">פגישות המהו"ת: מה החוק קובע</h3></div><ul class="jt42-list">`
		+ ['summons', 'in_person', 'first_alone', 'lawyers_join', 'free', 'no_sign', 'confidential', 'recommend', 'mediator', 'agreement'].map((k) => `<li>${esc(mt[`${k}_he`])}${ysCite(mt[`${k}_section`], k === 'summons' || k === 'in_person' || k === 'recommend' || k === 'agreement' ? fs.law_url : fs.regs_url)}</li>`).join('')
		+ `<li>${esc(fs.nonattend.he)}${ysCite(fs.nonattend.section, fs.regs_url)}</li></ul></div>`;
	// What needs a request and what does not.
	const sc = fs.scope;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-scope-h">מה צריך בקשה ליישוב סכסוך, ומה לא</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-scope-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">העניין</th><th scope="col">בקשה קודם?</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ sc.subjects.map((x) => `<tr><td data-th="העניין">${esc(x.he)}</td><td data-th="בקשה קודם?">כן</td><td data-th="הכלל">${ysCite(x.section, fs.law_url)}</td></tr>`).join('')
		+ sc.excluded.concat(sc.not_applicable).map((x) => `<tr><td data-th="העניין">${esc(x.he)}</td><td data-th="בקשה קודם?">לא</td><td data-th="הכלל">${ysCite(x.section, fs.law_url)}</td></tr>`).join('')
		+ `<tr><td data-th="העניין">${esc(fs.periods.repeat_he)}</td><td data-th="בקשה קודם?">לא</td><td data-th="הכלל">${ysCite(fs.periods.repeat_section, fs.law_url)}</td></tr>`
		+ `</tbody></table></div></div>`;
	// Urgent and temporary relief.
	const ur = fs.urgent;
	out += `<details class="jtool-more jt42-more"${r.special === 'urgent' || r.special === 'violence' ? ' open' : ''}><summary>סעד דחוף וסעד זמני, בכל עת</summary><p class="jtool-hint">${esc(ur.anytime_he)}${ysCite(ur.anytime_section, fs.law_url)}. ${esc(ur.no_request_he)}${ysCite(ur.no_request_section, fs.regs_url)}.</p>`
		+ `<ul class="jt42-list">${ur.list.map((x) => `<li>${esc(x.he)}: ${x.no_request ? 'גם בלי בקשה ליישוב סכסוך' : 'רק עם בקשה ליישוב סכסוך'}${ysCite(x.section, fs.regs_url)}</li>`).join('')}`
		+ `<li>${esc(ur.temporary_he)}${ysCite(ur.temporary_section, fs.regs_url)}; ${esc(fs.periods.response_he)}${ysCite(fs.periods.response_section, fs.regs_url)}</li>`
		+ `<li>${esc(fs.periods.relief_he)}${ysCite(fs.periods.relief_section, fs.law_url)}</li><li>${esc(ur.no_double_he)}${ysCite(ur.no_double_section, fs.law_url)}</li></ul></details>`;
	// Shortening or extending the stay.
	const cc = fs.court_change;
	out += `<details class="jtool-more jt42-more"${r.track === 'court' ? ' open' : ''}><summary>מתי הערכאה מקצרת או מאריכה את העיכוב (טופס 7)</summary>`
		+ `<p class="jtool-hint">מקצרת:</p><ul class="jt42-list">${cc.shorten.map((x) => `<li>${esc(x.he)}${ysCite(x.section, fs.regs_url)}</li>`).join('')}</ul>`
		+ `<p class="jtool-hint">מאריכה:</p><ul class="jt42-list">${cc.extend.map((x) => `<li>${esc(x.he)}${ysCite(x.section, fs.regs_url)}</li>`).join('')}</ul>`
		+ `<p class="jtool-hint">${esc(fs.periods.court_he)}. ${esc(fs.nonattend.shorten_he)} (${esc(fs.nonattend.shorten_section)}).</p></details>`;
	out += printSummary(reg, r);
	return out;
}

/** Page section: every period of the law, from the registry. */
export function periodsTable(reg) {
	const fs = reg.fl_sichsuch;
	const ds = reg.divorce_cost.disputes;
	const p = fs.periods;
	const rows = [
		['פגישות מהו"ת ביחידת הסיוע', `עד ${ds.meetings_max} פגישות בתוך ${ds.meetings_days} ימים`, 'מיום הגשת הבקשה', 'לא', `${ds.sections.meetings}, ${ds.sections.meetings_days}`, ds.url],
		['הארכה של יחידת הסיוע', `פעם אחת, ${ds.extend_days} ימים`, 'בהודעה לערכאה ולצדדים', 'לא', ds.sections.meetings_days, ds.url],
		['הודעה על המשך ההליך (טופס 3)', `${p.notice_days} ימים`, 'מהפגישה האחרונה', 'לא', p.notice_section, fs.regs_url],
		['עיכוב ההליכים', `${ds.stay_days} ימים, ${ds.stay_days_extended} אחרי הארכה`, 'מיום הגשת הבקשה', 'לא', ds.sections.stay, ds.url],
		['רק מי שהגיש את הבקשה תובע', `${ds.claim_days} ימים`, 'מסוף העיכוב', 'כן, אלא אם היום האחרון נופל בחג', `${ds.sections.claims}; סעיף 6א(ג)`, ds.url],
		['אחרי הארכה מוסכמת בכתב', `${p.agreed_claim_days} ימים לתביעה`, 'מסוף ההארכה', 'כמו בסעיף 4', p.agreed_section, fs.regs_url],
		['הודעה על הפסקת ההליך', `${p.stop_claim_days} ימים לתביעה`, 'מיום ההודעה', 'כמו בסעיף 4', p.stop_section, fs.regs_url],
		['צו דחוף או זמני', `${p.relief_months} חודשים`, 'מיום מתן הצו', 'לא רלוונטי', p.relief_section, fs.law_url],
		['תביעה בלי בקשה חדשה', `${p.repeat_years} שנה`, 'מהבקשה הקודמת', 'לא רלוונטי', p.repeat_section, fs.law_url],
		['תשובה לבקשה לסעד זמני', `${p.response_days} ימים`, 'מקבלת הבקשה', 'לפי סדרי הדין', p.response_section, fs.regs_url],
		['מסירה לצד השני בידי עורך הדין', `${p.service_days} ימים`, 'מיום הגשת הבקשה', 'לפי סדרי הדין', p.service_section, fs.regs_url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כל המועדים של ${esc(fs.law_he)} ושל ${esc(fs.regs_he)}, נכון ל-${isoToHe(fs.checked_on)}. ימי חג: שני ימי ראש השנה, יום הכיפורים, י"ד עד כ"ב בתשרי וי"ד עד כ"א בניסן (${esc(fs.pause.section)}).</caption>`
		+ '<thead><tr><th scope="col">מה</th><th scope="col">כמה</th><th scope="col">מתי מתחילים לספור</th><th scope="col">ימי החג נספרים?</th><th scope="col">הכלל</th></tr></thead><tbody>'
		+ rows.map(([a, b, c, d, s, u]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="כמה">${esc(b)}</td><td data-th="מתי מתחילים לספור">${esc(c)}</td><td data-th="ימי החג נספרים?">${esc(d)}</td><td data-th="הכלל"><a href="${esc(u)}" target="_blank" rel="noopener">${esc(s)}</a></td></tr>`).join('')
		+ `<tr><td data-th="מה">אגרת הבקשה</td><td data-th="כמה">${ysNis(reg.divorce_cost.family.request)} בבית המשפט לענייני משפחה, ${ysNis(reg.divorce_cost.rabbinical.request)} בבית הדין הרבני</td><td data-th="מתי מתחילים לספור">משלמים בהגשה</td><td data-th="ימי החג נספרים?">—</td><td data-th="הכלל"><a href="${esc(reg.divorce_cost.family.url)}" target="_blank" rel="noopener">${esc(reg.divorce_cost.family.items.request)}</a>; <a href="${esc(reg.divorce_cost.rabbinical.url)}" target="_blank" rel="noopener">${esc(reg.divorce_cost.rabbinical.items.request)}</a></td></tr>`
		+ '</tbody></table></div>';
}

export function snapshot(reg) {
	const input = Object.assign({}, EXAMPLE, { today: reg.fl_sichsuch.checked_on });
	const r = compute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.clock.stayDays,
		sticky: `<bdi>${isoToHe(r.stayEnd)}</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: methodHtml(reg, r),
		compare_table: periodsTable(reg),
		sentence: verdictSentence(reg, r),
		brief: aiBrief(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const YS_SP_CODE = { none: '', abroad: 'a', violence: 'v', consent: 'k', urgent: 'u', repeat: 'y', inheritance: 'i' };
const YS_SUBJ_CODE = { children: 'c', support: 's', property: 'p', divorce: 'd' };
const ysIsoOrBlank = (v) => { const iso = parseDate(v); return iso || ''; };
export function stateOf(i) {
	return encodeState({
		f: i.forum === 'rabbinical' ? 'r' : '', d: ysIsoOrBlank(i.start), o: i.role === 'other' ? 1 : '',
		s: (i.subjects || []).map((k) => YS_SUBJ_CODE[k]).filter(Boolean).join('.'), x: i.extended ? 1 : '',
		t: i.track === 'agreed' ? 'a' : i.track === 'court' ? 'c' : '', a: ysIsoOrBlank(i.agreedEnd), p: ysIsoOrBlank(i.stopOn),
		c: ysIsoOrBlank(i.courtEnd), l: ysIsoOrBlank(i.lastMeeting), r: ysIsoOrBlank(i.reliefOn), e: YS_SP_CODE[i.special] || '',
		// "n" marks a state with no subject chosen, so an empty choice survives the round trip.
		n: (i.subjects || []).length ? '' : 1,
	});
}
export const KEYS = ['f', 'd', 'o', 's', 'x', 't', 'a', 'p', 'c', 'l', 'r', 'e', 'n'];
export function inputOf(s) {
	if (!s || !Object.keys(s).length) { return null; }
	const subj = s.s ? s.s.split('.').map((c) => Object.keys(YS_SUBJ_CODE).find((k) => YS_SUBJ_CODE[k] === c)).filter(Boolean) : [];
	return {
		forum: s.f === 'r' ? 'rabbinical' : 'family', start: s.d ? ysIsoOrBlank(s.d) : '', role: s.o === '1' ? 'other' : 'filer',
		subjects: s.n === '1' ? [] : subj, extended: s.x === '1', track: s.t === 'a' ? 'agreed' : s.t === 'c' ? 'court' : 'base',
		agreedEnd: s.a ? ysIsoOrBlank(s.a) : '', stopOn: s.p ? ysIsoOrBlank(s.p) : '', courtEnd: s.c ? ysIsoOrBlank(s.c) : '',
		lastMeeting: s.l ? ysIsoOrBlank(s.l) : '', reliefOn: s.r ? ysIsoOrBlank(s.r) : '',
		special: Object.keys(YS_SP_CODE).find((k) => YS_SP_CODE[k] === (s.e || '')) || 'none',
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (id) => ((root.querySelector(`#${P}-${id}`) || {}).value || '').trim();
	const pick = (name, dflt) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || dflt;
	return {
		forum: pick('forum', 'family'), start: val('start'), role: pick('role', 'filer'),
		subjects: [...root.querySelectorAll(`input[name="${P}-subj"]:checked`)].map((x) => x.value),
		extended: Boolean(root.querySelector(`input[name="${P}-ext"]:checked`)), track: pick('trk', 'base'),
		agreedEnd: val('agreedEnd'), stopOn: val('stopOn'), courtEnd: val('courtEnd'), lastMeeting: val('lastMeeting'), reliefOn: val('reliefOn'),
		special: pick('sp', 'none'),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const fs = reg.fl_sichsuch;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(fs.checked_on, fs.refresh_every_days) || (fs.next_update && today >= fs.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרה התעדכנה'); }
	}
	const withToday = (input) => Object.assign({}, input, { today });
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const trk = (root.querySelector(`input[name="${P}-trk"]:checked`) || {}).value || 'base';
		form.querySelectorAll('[data-if-trk]').forEach((el) => { el.hidden = el.getAttribute('data-if-trk') !== trk; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, withToday(input));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok && r.applies ? `<bdi>${isoToHe(r.stayEnd)}</bdi>` : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.applies ? r.stage : r.special }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	// A share link names its tool (/@yishuv-sichsuch); on a page with several tools only the named one reads it.
	const owner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !owner || owner === TOOL_ID ? inputOf(decodeState(window.location.hash, KEYS)) : null;
	if (fromHash) {
		form.innerHTML = renderForm(reg, withToday(fromHash));
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(fromHash, { silent: true });
	} else {
		// A fresh visit counts the clock from today; the server HTML holds the example's day.
		const startField = root.querySelector(`#${P}-start`);
		if (startField) { startField.value = isoToHe(today); }
		run(readForm(root), { silent: true });
		if (store.get(saveKey)) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	}
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		// A click while the debounce is pending renders it now; otherwise the shown result is current and stays in place
		// (the clicked rehearse link is not re-rendered under the pointer).
		const pending = Boolean(timer);
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root);
		const r = pending ? run(input, { silent: true }) : compute(reg, withToday(input));
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok && r.applies) {
			download('yishuv-sichsuch.ics', 'text/calendar;charset=utf-8', ics(icsEvents(reg, r), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			root.querySelectorAll('[data-jt42-printed]').forEach((el) => { el.textContent = isoToHe(ilToday()); });
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים ובחירות, בלי שמות ובלי פרטים מזהים.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · השעון של בקשה ליישוב סכסוך ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(today)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The app refuses a case story in the URL: the scenario travels by the one-time window handoff (never in the URL);
			// if the popup is blocked it goes to the clipboard and the plain link opens. preventDefault stays synchronous.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? (r.applies ? r.stage : r.special) : 'error' });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'mediation';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, withToday(s)); sync(); run(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
