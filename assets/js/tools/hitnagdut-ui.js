/**
 * The inheritance wave UI: the objection clock and grounds checker (שעון ההתנגדות לצוואה ובודק העילות), 21.10.2026.
 * One picture from the subject: a court docket's 14-day track from the publication to the last day, the days already
 * gone filled in navy, today's marker in the band's colour, the dates printed in text under it. The grounds map reads
 * the person's own answers (my ground, my evidence) against the registry's sections; the draft is the objection's
 * skeleton with placeholders only.
 */
import { compute, draftText, inheritanceGrounds, heDate, FILED, STAGES, STANDINGS, STANDING_HE, FILED_HE } from './hitnagdut-engine.js';
import { addDays, parseDate } from './dates.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'hitnagdut';
const P = 'jt27';

/** The example: a probate request published 10 days before the example's "today" (the snapshot passes 2026-10-21). */
export const EXAMPLE = { filed: 'probate', stage: 'published', published: '2026-10-11', issued: '', standing: 'heir', grounds: ['capacity', 'coercion', 'beneficiary'], evidence: ['capacity', 'coercion'], represented: false, barRef: false, estate: '', extension: false };
export const EXAMPLE_TODAY = '2026-10-21';

const STAGE_HE = { published: 'הבקשה פורסמה', before: 'הבקשה עוד לא פורסמה', issued: 'הצו כבר ניתן' };
const SCOPE_HE = { whole: 'כל הצוואה', clause: 'ההוראה בלבד', depends: 'לפי המקרה' };
const BAND = {
	open: { cls: 'ok', he: '✓ חלון ההתנגדות פתוח' },
	closing: { cls: 'warn', he: '⚠ החלון נסגר בעוד ימים ספורים' },
	last: { cls: 'danger', he: '⚠ היום הוא היום האחרון' },
	passed: { cls: 'danger', he: '✕ חלון השבועיים נסגר' },
	none: { cls: 'info', he: 'עוד לא פורסם: השעון טרם התחיל' },
	issued: { cls: 'info', he: 'הצו ניתן: מסלול התיקון או הביטול' },
};

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const chip = (name, value, label, checked, type = 'radio', extra = '') => `<label class="jtool-chip"${extra}><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const ip = reg.inheritance_process;
	const filed = FILED.includes(input.filed) ? input.filed : 'probate';
	const stage = STAGES.includes(input.stage) ? input.stage : 'published';
	const standing = STANDINGS.includes(input.standing) ? input.standing : 'heir';
	const mine = new Set(Array.isArray(input.grounds) ? input.grounds : []);
	const ev = new Set(Array.isArray(input.evidence) ? input.evidence : []);
	const dateField = (id, label, value, hint, hidden) => `<div class="jtool-field" data-if-stage="${id === 'pub' ? 'published issued' : 'issued'}"${hidden ? ' hidden' : ''}><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(value ? isoToHe(value) : '')}" placeholder="לדוגמה: 11.10.2026" aria-describedby="${P}-${id === 'pub' ? 'published' : 'issued'}-e"><p class="jtool-hint">${esc(hint)}</p><p class="jtool-error" id="${P}-${id === 'pub' ? 'published' : 'issued'}-e" role="alert"></p></div>`;
	const groundRow = (g) => `<li class="${P}-ground${mine.has(g.key) ? ` ${P}-ground--on` : ''}"><p class="${P}-ground__he">${esc(g.he)}${cite(g.section, g.url || ip.law_url)}</p>`
		+ `<div class="jtool-chips">${chip(`g-${g.key}`, g.key, 'זו העילה שלי', mine.has(g.key), 'checkbox')}<span data-if-ground="${g.key}"${mine.has(g.key) ? '' : ' hidden'}>${chip(`e-${g.key}`, g.key, 'יש לי ראיה לזה', mine.has(g.key) && ev.has(g.key), 'checkbox')}</span></div>`
		+ `<p class="jtool-hint">${esc(`הראיה: ${g.evidence}`)}</p></li>`;
	const probateList = ip.grounds.map((g) => groundRow(Object.assign({}, g, { url: ip.law_url })));
	const inheritanceList = inheritanceGrounds(ip).map(groundRow);
	return `<fieldset class="jtool-field"><legend>מה הוגש לרשם לענייני ירושה</legend><div class="jtool-chips">${chip('filed', 'probate', 'בקשה לצו קיום צוואה', filed === 'probate')}${chip('filed', 'inheritance', 'בקשה לצו ירושה', filed === 'inheritance')}</div>`
		+ `<p class="jtool-hint">בקשה לצו ירושה: אין צוואה, והמחלוקת היא מי היורשים ומה חלקם (${esc(ip.sections.orders)}). בקשה לצו קיום: המחלוקת היא על הצוואה עצמה.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איפה הבקשה עומדת</legend><div class="jtool-chips">${chip('stage', 'published', STAGE_HE.published, stage === 'published')}${chip('stage', 'before', STAGE_HE.before, stage === 'before')}${chip('stage', 'issued', STAGE_HE.issued, stage === 'issued')}</div>`
		+ `<div class="jtool-row" style="margin-top:8px">${dateField('pub', 'יום הפרסום באתר האפוטרופוס הכללי', input.published, stage === 'issued' ? 'לא חובה כשהצו כבר ניתן' : ip.days.objection_he, stage === 'before')}${dateField('iss', 'יום מתן הצו', input.issued, ip.days.amend_he, stage !== 'issued')}</div>`
		+ `<div class="jtool-chips" data-if-stage="published"${stage === 'published' ? '' : ' hidden'} style="margin-top:8px">${chip('ext', '1', 'ביקשתי הארכה מהרשם', input.extension, 'checkbox')}</div>`
		+ `<p class="jtool-hint">הרשם מפרסם את הבקשה ומזמין התנגדויות בתוך שבועיים מהפרסום, או יותר אם קבע (${esc(ip.sections.publication)}; ${esc(ip.regulation_sections.publication)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הזכות שלכם בעיזבון</legend><div class="jtool-chips">${STANDINGS.map((k) => chip('standing', k, STANDING_HE[k], standing === k)).join('')}</div>`
		+ `<p class="jtool-hint">${esc(ip.objection_contents[0].he)} (${esc(ip.objection_contents[0].section)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>העילות: מה טוענים, ומה יש בידכם</legend>`
		+ `<ul class="${P}-grounds" data-if-filed="probate"${filed === 'probate' ? '' : ' hidden'}>${probateList.join('')}</ul>`
		+ `<ul class="${P}-grounds" data-if-filed="inheritance"${filed === 'inheritance' ? '' : ' hidden'}>${inheritanceList.join('')}</ul>`
		+ `<p class="jtool-hint">${esc(ip.objection_contents[1].he)} (${esc(ip.objection_contents[1].section)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ייצוג</legend><div class="jtool-chips">${chip('rep', 'self', 'בעצמי', !input.represented)}${chip('rep', 'lawyer', 'עם עורך דין', Boolean(input.represented))}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('bar', '1', 'להראות את התעריף המומלץ של הלשכה', input.barRef, 'checkbox')}</div>`
		+ `<div class="jtool-field" style="margin-top:8px" data-if-bar${input.barRef ? '' : ' hidden'}><label class="jtool-label" for="${P}-est">שווי העיזבון בערך</label><div class="jtool-input jtool-input--money"><input id="${P}-est" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.estate ? money(input.estate, 0) : '')}" placeholder="לדוגמה: 1,000,000" aria-describedby="${P}-estate-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-estate-e" role="alert"></p></div>`
		+ `<p class="jtool-hint">${esc(reg.will_cost.bar.note_he)}. הכלי לא ממליץ על מחיר.</p></fieldset>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	const fee = nis(r.fee.amount);
	if (r.stage === 'before') {
		return `הבקשה עוד לא פורסמה: שעון השבועיים מתחיל ביום הפרסום באתר האפוטרופוס הכללי וברשומות (${ip.sections.publication}; ${ip.regulation_sections.publication}). עד אז מכינים את כתב ההתנגדות, את התצהיר ואת הראיות; האגרה ${fee}, וההתנגדות נדונה בבית המשפט לענייני משפחה (${ip.sections.to_court}).`;
	}
	if (r.stage === 'issued') {
		return `הצו ניתן ב-${heDate(r.issued)}: מכאן המסלול הוא בקשה לתיקון או לביטול הצו על עובדות שלא היו בפני הרשם (${ip.sections.amend}): אגרה ${nis(r.amend.registrar.amount)} אצל הרשם, או ${nis(r.amend.court.amount)} בבית המשפט לענייני משפחה, וליורשים ${r.amend.days} ימים לתשובה (${ip.regulation_sections.amend}).`;
	}
	if (r.band === 'passed') {
		return `חלון ההתנגדות נסגר ב-${heDate(r.deadline)}, לפני ${-r.daysLeft} ימים; אפשר לבקש מהרשם הארכה (${ip.regulation_sections.publication}), וכל עוד לא ניתן צו אפשר עדיין להגיש, עם אגרה של ${fee}; אחרי הצו: בקשה לתיקון או לביטול לפי ${ip.sections.amend}.`;
	}
	const head = r.band === 'last' ? 'היום הוא היום האחרון' : `נשאר${r.daysLeft === 1 ? ' יום אחד' : `ו ${r.daysLeft} ימים`}${r.band === 'closing' ? ' בלבד' : ''}`;
	return `${head}: ההתנגדות ל${FILED_HE[r.filed]} מוגשת לרשם לענייני ירושה עד ${heDate(r.deadline)}, עם אגרה של ${fee}, ונדונה בבית המשפט לענייני משפחה (${ip.sections.to_court}).`;
}

/** The docket track: 14 day cells from the publication to the last day, today's marker, the dates in text. */
export function trackHtml(reg, r) {
	const n = r.windowDays;
	if (r.stage === 'issued') {
		const a = r.amend;
		return `<ol class="${P}-route" aria-label="המסלול אחרי הצו">`
			+ `<li class="${P}-rs ${P}-rs--done"><span class="${P}-rs__when"><bdi>${esc(heDate(r.issued))}</bdi></span><span class="${P}-rs__what">הצו ניתן</span><span class="${P}-rs__note">${esc(FILED_HE[r.filed])}</span></li>`
			+ `<li class="${P}-rs ${P}-rs--here"><span class="${P}-rs__when">עכשיו</span><span class="${P}-rs__what">בקשה לתיקון או לביטול</span><span class="${P}-rs__note">${ils(a.registrar.amount, 0)} אצל הרשם, ${ils(a.court.amount, 0)} בבית המשפט</span></li>`
			+ `<li class="${P}-rs"><span class="${P}-rs__when"><bdi>${a.days}</bdi> ימים</span><span class="${P}-rs__what">תשובת היורשים</span><span class="${P}-rs__note">${esc(a.regulation)}</span></li>`
			+ `<li class="${P}-rs"><span class="${P}-rs__when">אחר כך</span><span class="${P}-rs__what">החלטת הרשם, או העברה לבית המשפט</span><span class="${P}-rs__note">${esc(a.section)}</span></li></ol>`;
	}
	const cells = [];
	for (let i = 1; i <= n; i += 1) {
		let cls = `${P}-day`;
		if (r.elapsed !== null) { cls += i < r.elapsed ? ` ${P}-day--past` : i === r.elapsed ? ` ${P}-day--today` : ` ${P}-day--left`; } else { cls += ` ${P}-day--left`; }
		cells.push(`<li class="${cls}"></li>`);
	}
	const pos = r.elapsed === null ? 0 : Math.min(1, Math.max(0, r.elapsed / n));
	const marker = r.elapsed === null ? '' : `<span class="${P}-now" style="inset-inline-start:${(pos * 100).toFixed(2)}%"><b>היום</b></span>`;
	const dates = r.stage === 'before'
		? `<span>השעון מתחיל ביום הפרסום</span><span>${n} ימים</span><span>המועד האחרון: יום הפרסום ועוד ${n} ימים</span>`
		: `<span>פורסם <bdi>${esc(heDate(r.published))}</bdi></span><span>היום <bdi>${esc(heDate(r.today))}</bdi>${r.band === 'passed' ? `, <bdi>${-r.daysLeft}</bdi> ימים אחרי המועד` : ''}</span><span>המועד האחרון <bdi>${esc(heDate(r.deadline))}</bdi></span>`;
	return `<div class="${P}-clock ${P}-clock--${r.band}"><div class="${P}-track" aria-hidden="true"><ol class="${P}-days">${cells.join('')}</ol>${marker}</div><p class="${P}-track__dates">${dates}</p></div>`;
}

/** The grounds map: each ground the person marked, its section, the evidence it needs, what they have, the effect. */
export function mapHtml(reg, r) {
	if (!r.selected.length) {
		return `<div class="${P}-map"><p class="${P}-map__sum">לא סומנה עילה. סמנו בטופס את העילות שלכם: ${esc(reg.inheritance_process.objection_contents[1].he)} (${esc(reg.inheritance_process.objection_contents[1].section)}).</p></div>`;
	}
	const c = r.counts;
	const sum = `${c.selected === 1 ? 'עילה אחת' : `${c.selected} עילות`}: ${c.withEvidence} עם ראיות, ${c.without} בלי.${c.whole ? ` ${c.whole === 1 ? 'עילה אחת' : `${c.whole} עילות`} מבטל${c.whole === 1 ? 'ת' : 'ות'} את כל הצוואה.` : ''}`;
	return `<div class="${P}-map"><p class="${P}-map__sum">${esc(sum)}</p><ul class="${P}-map__list">`
		+ r.selected.map((g) => `<li class="${P}-g ${P}-g--${g.strength}"><span class="${P}-g__tag">${g.hasEvidence ? 'יש ראיה' : 'חסרה ראיה'}</span><span class="${P}-g__he">${esc(g.he)}${cite(g.section, g.url)}</span>`
			+ `<span class="${P}-g__eff">התוצאה: ${esc(g.effect)} <em>(${esc(SCOPE_HE[g.scope])})</em></span>`
			+ (g.hasEvidence ? '' : `<span class="${P}-g__need">מה צריך: ${esc(g.evidence)}</span>`) + '</li>').join('')
		+ '</ul></div>';
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const b = BAND[r.band];
	const label = r.stage === 'before' ? 'ימים להתנגדות, מיום הפרסום' : r.stage === 'issued' ? 'ימים ליורשים לתשובה על בקשת התיקון' : r.band === 'passed' ? 'ימים נשארו: החלון נסגר' : 'ימים נשארו להגשת ההתנגדות';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${b.cls}">${b.he}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${label}</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${r.count}</bdi> <small>ימים</small></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (r.bar.shown ? `<p class="jtool-scope">עם עורך דין, לפי התעריף המינימלי המומלץ של הלשכה (לא מחייב): ${r.bar.pct}% מהעיזבון${r.bar.atMin ? `, ולא פחות מ-${esc(nis(r.bar.min))}` : ''}, ועוד ${r.bar.addPct}% בהתנגדות: לפחות <strong>${ils(r.bar.withObjection, r.bar.withObjection % 1 ? 2 : 0)}</strong> לפני מע"מ, ו-${esc(nis(r.bar.hearing))} לכל דיון נוסף.</p>` : '')
		+ '</div>'
		+ trackHtml(reg, r)
		+ mapHtml(reg, r);
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	const dash = '—';
	// 1. The clock and the fee, each with its rule.
	const rows = [];
	if (r.stage === 'before') {
		rows.push(['החלון להתנגדות', `${r.windowDays} ימים מיום הפרסום`, ip.regulation_sections.publication, ip.regulations_url]);
	} else {
		if (r.published) { rows.push(['יום הפרסום', `<bdi>${esc(heDate(r.published))}</bdi>`, ip.sections.publication, ip.law_url]); }
		if (r.deadline) { rows.push(['המועד האחרון להתנגדות', `<bdi>${esc(heDate(r.deadline))}</bdi>`, ip.regulation_sections.publication, ip.regulations_url]); }
		rows.push(['היום', `<bdi>${esc(heDate(r.today))}</bdi>`, '', '']);
		if (r.stage === 'published') { rows.push([r.band === 'passed' ? 'ימים מאז שהחלון נסגר' : 'ימים שנשארו', `<bdi>${Math.abs(r.daysLeft)}</bdi>`, '', '']); }
		if (r.stage === 'issued') {
			rows.push(['יום מתן הצו', `<bdi>${esc(heDate(r.issued))}</bdi>`, ip.sections.orders, ip.law_url]);
			rows.push(['תשובת היורשים לבקשת התיקון', `<bdi>${r.amend.days}</bdi> ימים מקבלת הבקשה`, ip.regulation_sections.amend, ip.regulations_url]);
		}
	}
	if (r.stage === 'issued') {
		rows.push(['אגרה אצל הרשם', ils(r.amend.registrar.amount, 0), r.amend.registrar.item, r.amend.registrar.url]);
		rows.push(['אגרה בבית המשפט לענייני משפחה', ils(r.amend.court.amount, 0), r.amend.court.item, r.amend.court.url]);
	} else {
		rows.push(['אגרת ההתנגדות', ils(r.fee.amount, 0), r.fee.item, r.fee.url]);
	}
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-clock-h">השעון והאגרה</h3>${r.stage === 'issued' ? '' : `<div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספת המועד ליומן (.ics)</button></div>`}</div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-clock-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">הערך</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([what, v, rule, href]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="הערך">${v}</td><td data-th="הכלל">${rule ? cite(rule, href) : dash}</td></tr>`).join('')
		+ `</tbody><caption>${esc(r.fee.indexed)}; משלמים ב<a href="${esc(r.fee.pay)}" target="_blank" rel="noopener">${esc(r.fee.pay_he)}</a>. ${esc(ip.family_court.objection_filed_he)}.</caption></table></div></div>`;
	// 2. The draft.
	const amend = r.stage === 'issued';
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">${amend ? 'טיוטת הבקשה לתיקון או לביטול הצו' : 'טיוטת כתב ההתנגדות'}</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-doc">העתקת הטיוטה</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
		+ `<pre class="jtool-letter ${P}-doc" role="region" aria-labelledby="${P}-doc-h" tabindex="0">${esc(draftText(reg, r))}</pre>`
		+ `<p class="jtool-hint" style="padding:8px 16px 12px">שלד בלבד, עם מקומות ריקים לשמות ולעובדות; שום פרט אישי לא נשמר ולא נשלח. ${esc(ip.evidence_he)}.</p></div>`;
	// 3. What the objection holds (reg. 19).
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה כתב ההתנגדות מכיל</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ul class="${P}-list">${r.contents.map((c) => `<li>${esc(c.he)}${cite(c.section, ip.regulations_url)}</li>`).join('')}</ul></div>`;
	// 4. What happens next.
	const next = amend ? [
		[`הבקשה מוגשת למי שנתן את הצו: הרשם, או בית המשפט אם הוא נתן אותו. עובדות שאפשר היה להביא לפני הצו: הרשם מעביר לבית המשפט לענייני משפחה`, ip.sections.amend, ip.law_url],
		[`היורשים הרשומים בצו מקבלים את הבקשה ומשיבים בתוך ${r.amend.days} ימים`, ip.regulation_sections.amend, ip.regulations_url],
		['מי שקנה בתום לב ובתמורה מיורש שבצו מוגן גם אחרי התיקון', ip.sections.good_faith, ip.law_url],
		[ip.courts.mediation_he, 'גישור', ip.courts.mediation_url],
	] : [
		['ההתנגדות מוגשת לרשם לענייני ירושה, עם העתק למבקש', ip.regulation_sections.objection, ip.regulations_url],
		['הרשם מעביר את הבקשה ואת ההתנגדות לבית המשפט לענייני משפחה', ip.sections.to_court, ip.law_url],
		['בבית המשפט: מי שביקש את הצו הוא התובע, והמתנגד הוא הנתבע; הדיון כתביעה אזרחית, עם תצהירים וחקירות', ip.regulation_sections.parties, ip.regulations_url],
		[ip.courts.mediation_he, 'גישור', ip.courts.mediation_url],
		[ip.courts.religious_he, ip.sections.religious_court, ip.law_url],
	];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>מה קורה אחר כך</h3></div><ol class="${P}-steps">${next.map(([t, s, u]) => `<li>${esc(t)}${cite(s, u)}</li>`).join('')}</ol></div>`;
	// 5. The Bar reference.
	if (r.bar.shown) {
		const b = r.bar;
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-bar-h">עורך דין: התעריף המינימלי המומלץ</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-bar-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">השירות</th><th scope="col">לפני מע"מ</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ `<tr><td data-th="השירות">${esc(`בקשה לצו: ${b.pct}% מערך העיזבון (${nis(b.estate)}), לא פחות מ-${nis(b.min)}`)}</td><td data-th="לפני מע&quot;מ">${ils(b.base, b.base % 1 ? 2 : 0)}</td><td data-th="הכלל">${cite(b.items.probate, b.url)}</td></tr>`
			+ `<tr><td data-th="השירות">${esc(`תוספת בהתנגדות: ${b.addPct}%`)}</td><td data-th="לפני מע&quot;מ">${ils(b.add, b.add % 1 ? 2 : 0)}</td><td data-th="הכלל">${cite(b.items.objection, b.url)}</td></tr>`
			+ `<tr><td data-th="השירות">כל דיון נוסף</td><td data-th="לפני מע&quot;מ">${ils(b.hearing, 0)}</td><td data-th="הכלל">${cite(b.items.hearing, b.url)}</td></tr>`
			+ `<tr class="jtool-table__total"><td data-th="השירות">הבקשה עם ההתנגדות, לפחות</td><td data-th="לפני מע&quot;מ">${ils(b.withObjection, b.withObjection % 1 ? 2 : 0)}</td><td data-th="הכלל">עם מע"מ ${b.vatPct}%: ${esc(nis(b.withVat))}</td></tr></tbody>`
			+ `<caption>${esc(b.note)}.</caption></table></div></div>`;
	}
	// 6. Flags.
	if (r.flags.length) { out += `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>`; }
	return out;
}

/** The calendar events: the last day, and a reminder three days before it. */
export function icsEvents(reg, r) {
	if (!r.ok || r.stage !== 'published' || !r.deadline) { return []; }
	const what = FILED_HE[r.filed];
	const events = [];
	const reminder = addDays(r.deadline, -3);
	if (reminder >= r.today) { events.push({ date: reminder, summary: `התנגדות ל${what}: עוד 3 ימים למועד האחרון להגשה לרשם`, description: `המועד האחרון ${heDate(r.deadline)}, אגרה ${nis(r.fee.amount)}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` }); }
	events.push({ date: r.deadline, summary: `התנגדות ל${what}: המועד האחרון להגשה לרשם לענייני ירושה`, description: `${r.windowDays} ימים מיום הפרסום (${heDate(r.published)}). חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` });
	return events;
}

/** Page section: the three stages side by side, from the registry. */
export function stagesTable(reg) {
	const ip = reg.inheritance_process;
	const fc = ip.family_court;
	const rg = ip.registrar;
	const rows = [
		['מה מגישים', 'מכינים את כתב ההתנגדות, את התצהיר ואת הראיות', 'כתב התנגדות (תקנה 19)', 'בקשה לתיקון או לביטול הצו, על עובדות שלא היו בפני הרשם'],
		['למי', 'עוד אין למי: הבקשה לא פורסמה', 'לרשם לענייני ירושה; נדון בבית המשפט לענייני משפחה', 'למי שנתן את הצו; כשאפשר היה לטעון קודם, הרשם מעביר לבית המשפט'],
		['האגרה', ils(fc.items.objection.amount, 0), ils(fc.items.objection.amount, 0), `${ils(rg.items.amend.amount, 0)} אצל הרשם, ${ils(fc.items.amend.amount, 0)} בבית המשפט`],
		['השעון', 'מתחיל ביום הפרסום', `<bdi>${ip.days.objection}</bdi> ימים מיום הפרסום, או יותר אם הרשם קבע`, `ליורשים <bdi>${ip.days.amend_response}</bdi> ימים לתשובה`],
		['הסעיף', `${ip.sections.publication}; ${ip.regulation_sections.publication}`, `${ip.sections.publication} ו-${ip.sections.to_court}; תקנות 17, 19 ו-20`, `${ip.sections.amend}; ${ip.regulation_sections.amend}`],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>התנגדות לצוואה בשלושה שלבים: לפני הפרסום, בתוך ${ip.days.objection} הימים, ואחרי שהצו ניתן. אגרות בנוסח מ-${isoToHe(fc.current_to)} (בית המשפט) ומ-${isoToHe(rg.from)} (הרשם).</caption><thead><tr><th scope="col">השלב</th><th scope="col">לפני הפרסום</th><th scope="col">בתוך ${ip.days.objection} הימים</th><th scope="col">אחרי הצו</th></tr></thead><tbody>`
		+ rows.map(([h, a, b, c]) => `<tr><th scope="row">${esc(h)}</th><td data-th="לפני הפרסום">${a}</td><td data-th="בתוך ${ip.days.objection} הימים">${b}</td><td data-th="אחרי הצו">${c}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

export function snapshot(reg) {
	const ip = reg.inheritance_process;
	const input = Object.assign({}, EXAMPLE, { today: EXAMPLE_TODAY });
	const r = compute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.count,
		sticky: `<bdi>${r.count}</bdi>`,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>הבקשה לצו קיום צוואה פורסמה ב-${heDate(r.published)} באתר האפוטרופוס הכללי וברשומות${cite(ip.sections.publication, ip.law_url)}${cite(ip.regulation_sections.publication, ip.regulations_url)}</li>`
			+ `<li>המועד האחרון: ${r.windowDays} ימים מיום הפרסום, ${heDate(r.deadline)}${cite(ip.regulation_sections.publication, ip.regulations_url)}</li>`
			+ `<li>היום ${heDate(r.today)}: נשארו ${r.daysLeft} ימים</li>`
			+ `<li>אגרת ההתנגדות ${money(r.fee.amount, 0)} ₪, בנוסח מ-${isoToHe(ip.family_court.current_to)}${cite(r.fee.item, r.fee.url)}</li>`
			+ `<li>העילות שסומנו: ${r.counts.selected}, מהן ${r.counts.withEvidence} עם ראיות${r.selected.map((g) => cite(g.section, g.url)).join('')}</li>`
			+ `<li>ההתנגדות מוגשת לרשם ונדונה בבית המשפט לענייני משפחה; המבקש תובע, המתנגד נתבע${cite(ip.sections.to_court, ip.law_url)}${cite(ip.regulation_sections.parties, ip.regulations_url)}</li></ol>`,
		compare_table: stagesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, dflt) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || dflt;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const filed = radio('filed', 'probate');
	const box = root.querySelector(`[data-if-filed="${filed}"]`) || root;
	const keys = [...box.querySelectorAll(`input[name^="${P}-g-"]:checked`)].map((i) => i.value);
	const ev = [...box.querySelectorAll(`input[name^="${P}-e-"]:checked`)].map((i) => i.value);
	return {
		filed, stage: radio('stage', 'published'),
		published: val(`#${P}-pub`).trim(), issued: val(`#${P}-iss`).trim(),
		standing: radio('standing', 'heir'), grounds: keys, evidence: ev.filter((k) => keys.includes(k)),
		represented: radio('rep', 'self') === 'lawyer',
		barRef: on('bar'), estate: !on('bar') || val(`#${P}-est`).trim() === '' ? '' : parseMoney(val(`#${P}-est`)),
		extension: on('ext'),
	};
}

const FM = { probate: 'p', inheritance: 'i' };
const SM = { published: 'p', before: 'b', issued: 'i' };
const TM = { heir: 'h', prior_will: 'w', creditor: 'c', other: 'o' };
const keyOf = (map, v) => Object.keys(map).find((k) => map[k] === v);
/** Only answers: never a name, an ID or a free text. */
export const stateOf = (i) => encodeState({ f: FM[i.filed] || 'p', s: SM[i.stage] || 'p', d: parseDate(i.published) || '', o: parseDate(i.issued) || '', t: TM[i.standing] || 'h', g: (i.grounds || []).join('.'), e: (i.evidence || []).join('.'), r: i.represented ? 1 : '', b: i.barRef ? 1 : '', v: i.barRef && i.estate ? i.estate : '', x: i.extension ? 1 : '' });
export const KEYS = ['f', 's', 'd', 'o', 't', 'g', 'e', 'r', 'b', 'v', 'x'];
export function inputOf(s) {
	if (!s.f) { return null; }
	return {
		filed: keyOf(FM, s.f) || 'probate', stage: keyOf(SM, s.s) || 'published', published: s.d || '', issued: s.o || '',
		standing: keyOf(TM, s.t) || 'heir', grounds: s.g ? s.g.split('.').filter(Boolean) : [], evidence: s.e ? s.e.split('.').filter(Boolean) : [],
		represented: s.r === '1', barRef: s.b === '1', estate: s.v ? Number(s.v) : '', extension: s.x === '1',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const ip = reg.inheritance_process;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ip.checked_on, ip.refresh_every_days) || (ip.next_update && today >= ip.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { published: 'pub', issued: 'iss', estate: 'est' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const stage = (root.querySelector(`input[name="${P}-stage"]:checked`) || {}).value || 'published';
		const filed = (root.querySelector(`input[name="${P}-filed"]:checked`) || {}).value || 'probate';
		form.querySelectorAll('[data-if-stage]').forEach((el) => { el.hidden = !el.getAttribute('data-if-stage').split(' ').includes(stage); });
		form.querySelectorAll('[data-if-filed]').forEach((el) => { el.hidden = el.getAttribute('data-if-filed') !== filed; });
		form.querySelectorAll('[data-if-ground]').forEach((el) => {
			const k = el.getAttribute('data-if-ground');
			const li = el.closest(`.${P}-ground`);
			const onIt = Boolean(li && li.querySelector(`input[name="${P}-g-${k}"]:checked`));
			el.hidden = !onIt;
			if (li) { li.classList.toggle(`${P}-ground--on`, onIt); }
		});
		form.querySelectorAll('[data-if-bar]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-bar"]:checked`); });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, Object.assign({}, input, { today }));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${r.count}</bdi>` : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.band }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	// A share link names its tool (/@hitnagdut); on a page with several tools only that tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(fromHash, { silent: true });
	} else {
		// A fresh visit: the example's publication moves to ten days before today in Israel, so the clock in the result is
		// today's (the server HTML holds the example's fixed day).
		const pub = root.querySelector(`#${P}-pub`);
		if (pub && (root.querySelector(`input[name="${P}-stage"]:checked`) || {}).value === 'published') { pub.value = isoToHe(addDays(today, -10)); }
		sync();
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		// A click while the debounce is pending runs it now; every action computes what the form holds now.
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics') {
			const events = icsEvents(reg, r);
			if (!events.length) { toast(root, r.ok && r.stage === 'issued' ? 'אחרי הצו אין מועד קבוע ליומן: ליורשים 14 ימים מקבלת הבקשה.' : 'המועד ליומן נקבע רק אחרי יום הפרסום.'); return; }
			download('hitnagdut.ics', 'text/calendar;charset=utf-8', ics(events, new Date().toISOString()));
			toast(root, 'קובץ היומן ירד: המועד האחרון, ותזכורת 3 ימים לפניו.');
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copy-doc' && r.ok) {
			const ok = await copyText(`${draftText(reg, r)}\n\nשלד שנבנה ב-jus-tice.co.il (${isoToHe(ip.checked_on)}). מידע כללי, לא ייעוץ משפטי; עורך דין צריך לעבור על ההתנגדות לפני ההגשה.`);
			toast(root, ok ? 'הטיוטה הועתקה. הדביקו אותה במסמך והשלימו את הפרטים.' : 'לא הצלחנו להעתיק. אפשר לסמן את הטקסט ולהעתיק ידנית.');
			track('tool_download', { tool_id: TOOL_ID, type: 'copy-draft' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(r.contents.map((c, i) => `${i + 1}. ${c.he} (${c.section})`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if ((act === 'link' || act === 'save') && !r.ok) {
			toast(root, 'יש שדה שצריך לתקן. תקנו אותו, ואז אפשר לשתף או לשמור.');
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · שעון ההתנגדות מ-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ip.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.band : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד, בלי שמות. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); sync(); run(s); }
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
