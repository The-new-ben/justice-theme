/**
 * The family + land wave UI (HAD-579): the rabbinical-court fee ledger (agrot-rabanut, prefix jt40).
 * The picture is a court-fee ledger: one row per procedure, the rabbinical court and the family court as two columns,
 * the transcript fee and the item of the regulations under each amount, a ruled total line for each forum, and the
 * filing route the person chose drawn solid. The table is the text equivalent (caption, row and column headers), with a
 * one-sentence summary for screen readers. Under it: the file's dated clock (.ics), the refunds, the exemptions, how
 * each forum is paid, the scenario for the simulation and the next steps; a one-page summary prints on its own.
 */
import { rbCompute, rbBoth, rbGet, RB_GROUPS } from './rabanut-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'agrot-rabanut';
const P = 'jt40';
const RB_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=court_rehearsal&topic=divorce';

export const EXAMPLE = { preset: 'contested', sel: ['req', 'div', 'prop', 'cust', 'sup'], forum: 'rabbinical', abroad: false, certificates: 2, value: '', legalAid: false, reqDate: '2026-11-01', extended: false, judgmentDate: '', getDate: '' };

/** One click to a personal starting point: the common files people open, each a set of procedures. */
export const PRESETS = {
	contested: { he: 'גירושין במחלוקת, עם ילדים ורכוש', sel: ['req', 'div', 'prop', 'cust', 'sup'] },
	consent: { he: 'גירושין בהסכמה, עם הסכם', sel: ['agree'] },
	joint: { he: 'בקשה משותפת לגט, בלי הסכם', sel: ['joint'] },
	appeal: { he: 'ערעור על פסק דין', sel: ['appeal'] },
	permit: { he: 'היתר נישואין', sel: ['permit'] },
	prenup: { he: 'אישור הסכם ממון', sel: ['prenup'] },
	inherit: { he: 'צו ירושה בבית הדין', sel: ['inh'] },
};
const FORUM_HE = { rabbinical: 'בית הדין הרבני', family: 'בית המשפט לענייני משפחה' };
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
/** A ledger cell cites the item alone: "התוספת הראשונה, פרט 4(1)(א)" reads "פרט 4(1)(א)"; the caption names the schedules. */
const rbShort = (item) => String(item || '').replace(/^התוספת הראשונה, /, '').replace(/^התוספת השנייה, /, 'תוספת שנייה, ');
/** The other forum's name for the comparison: the registrar when the line is an inheritance order. */
function rbForumName(r, forum) {
	if (forum === 'rabbinical') { return FORUM_HE.rabbinical; }
	const inh = r.lines.filter((l) => l.both);
	if (inh.length && inh.every((l) => l.id === 'inh')) { return 'אצל הרשם לענייני ירושה'; }
	if (inh.length && inh.every((l) => l.group === 'inherit')) { return 'אצל הרשם ובבית המשפט לענייני משפחה'; }
	return FORUM_HE.family;
}
const rbHasBoth = (r) => r.lines.some((l) => l.both);
/** The procedures the family route's total leaves out (priced there by subject, or no item found). */
const rbMissing = (r) => r.lines.filter((l) => l.famUnknown).map((l) => l.he).join(', ');
const rbIn = (name) => (name.startsWith('אצל') ? name : `ב${name}`);
function rbCite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const rbChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
function rbToIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const fl = reg.fl_rabanut;
	const sel = input.sel || [];
	const preset = Object.keys(PRESETS).find((k) => PRESETS[k].sel.join('.') === sel.join('.')) || '';
	const field = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${P}-${id}-e"><p class="jtool-hint">${esc(hint)}</p><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const groups = RB_GROUPS.map(([g, he]) => {
		const items = fl.procedures.filter((p) => p.group === g);
		return `<fieldset class="jtool-field ${P}-group"><legend>${esc(he)}</legend><div class="jtool-chips">${items.map((p) => rbChip('p', p.id, p.he, sel.includes(p.id), 'checkbox')).join('')}</div></fieldset>`;
	}).join('');
	return `<fieldset class="jtool-field"><legend>מה פותחים בבית הדין</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">לחיצה אחת בוחרת את ההליכים של המקרה; אפשר לשנות כל הליך ברשימה המלאה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>איפה מגישים את מה ששני הפורומים דנים בו</legend><div class="jtool-chips">${rbChip('forum', 'rabbinical', FORUM_HE.rabbinical, input.forum !== 'family')}${rbChip('forum', 'family', FORUM_HE.family, input.forum === 'family')}</div>`
		+ '<p class="jtool-hint">הגט עצמו תמיד בבית הדין הרבני. רכוש, ילדים ומזונות אפשר לכרוך בתביעת הגירושין שם, או להגיש לבית המשפט; הטבלה מראה את שניהם.</p></fieldset>'
		+ `<details class="jtool-more ${P}-all"${preset ? '' : ' open'}><summary>כל ההליכים (<span data-${P}-count>${sel.length}</span> נבחרו)</summary>${groups}`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-value">סכום הכתובה או התביעה הכספית (לא חובה)</label><div class="jtool-input jtool-input--money"><input id="${P}-value" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.value === '' || input.value === undefined ? '' : money(input.value, 0))}" placeholder="0" aria-describedby="${P}-value-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-value-e" role="alert"></p></div></details>`
		+ `<fieldset class="jtool-field"><legend>מה עוד נכון לגביכם</legend><div class="jtool-chips">${rbChip('abr', '1', 'אחד מבני הזוג גר בחוץ לארץ', input.abroad, 'checkbox')}${rbChip('aid', '1', 'מיוצגים בסיוע המשפטי', input.legalAid, 'checkbox')}</div>`
		+ `<div class="jtool-chips" role="group" aria-label="תעודות גירושין">${[2, 1, 0].map((n) => rbChip('cert', String(n), n === 2 ? 'תעודה לכל אחד' : n === 1 ? 'תעודה אחת' : 'בלי תעודות', Number(input.certificates ?? 2) === n)).join('')}</div></fieldset>`
		+ `<details class="jtool-more"${input.judgmentDate || input.getDate ? ' open' : ''}><summary>תאריכים: לוח המועדים של התיק</summary><div class="jtool-row">${field('req', 'יום הגשת הבקשה ליישוב סכסוך', input.reqDate, 'מכאן נספרים 45, 60 ו-75 הימים שבחוק')}`
		+ `<div class="jtool-field" style="justify-content:flex-end"><div class="jtool-chips">${rbChip('ext', '1', 'יחידת הסיוע האריכה את הפגישות', input.extended, 'checkbox')}</div></div></div>`
		+ `<div class="jtool-row">${field('jud', 'יום מתן פסק הדין או ההחלטה', input.judgmentDate, 'מכאן נספרים מועדי הערעור')}${field('get', 'יום סידור הגט', input.getDate, 'מכאן נספרים 90 הימים של פרט 1(ג)')}</div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const here = r.forum === 'family' ? 'fam' : 'rab';
	const main = r.lines.filter((l) => (here === 'fam' ? l.inFam : l.inRab) > 0).slice(0, 6).map((l) => `${l.he} ${nis(here === 'fam' ? l.inFam : l.inRab)}`);
	if (!rbHasBoth(r)) { return `${main.join('; ')}${main.length ? '. ' : ''}סך האגרות, כולל אגרות הפרוטוקול: ${nis(r.totals.chosen)}. ההליכים האלה נדונים רק בבית הדין הרבני.`; }
	return `${main.join('; ')}${main.length ? '. ' : ''}סך האגרות, כולל אגרות הפרוטוקול, כשמגישים ל${FORUM_HE[r.forum]}: ${nis(r.totals.chosen)}; באותם הליכים ${rbIn(rbForumName(r, r.forum === 'family' ? 'rabbinical' : 'family'))}: ${nis(r.forum === 'family' ? r.totals.rab : r.totals.fam)}.`;
}

/** The ledger: two forums as columns, the transcript fee and the item under each amount, ruled totals. */
function rbCellHtml(cell, line, side, chosen, legalAid) {
	if (!cell) {
		const n = line.naHe || '';
		const shortNa = n.startsWith('בהסכם') ? 'באותו תיק' : n.startsWith('בבית המשפט האגרה לפי') ? 'לפי הנושא, לא בסך' : n.startsWith('לא נמצא') ? 'לא נמצא פרט, לא בסך' : n.startsWith('אין תביעה') ? 'אין הליך כזה' : 'רק בבית הדין';
		const long = line.naHe && !line.naHe.startsWith('רק בבית הדין הרבני:') ? `<small>${esc(line.naHe)}</small>` : '';
		return `<td class="${P}-na" data-th="${side === 'rab' ? FORUM_HE.rabbinical : FORUM_HE.family}"><span>${esc(shortNa)}</span>${long}</td>`;
	}
	const on = chosen ? ` ${P}-cell--on` : '';
	const fig = cell.exempt ? '<strong>פטור</strong>' : `<strong>${cell.min ? 'לפחות ' : ''}${ils(cell.amount, cell.amount % 1 ? 2 : 0)}</strong>`;
	const prot = cell.protocol ? `<small class="${P}-prot">ועוד ${nis(cell.protocol)} אגרת פרוטוקול (${esc(rbShort(cell.protocolItem))})</small>` : '';
	const src = cell.src === 'admin' ? `<small class="${P}-admin">לפי טבלת ההנהלה</small>` : '';
	const where = cell.where === 'rab' ? '<small>משולמת בבית הדין הרבני</small>' : '';
	const unit = line.count ? `<small>${line.count} × ${nis(cell.unit)}</small>` : '';
	const aid = legalAid && !cell.exempt && cell.amount ? '<small>בסיוע המשפטי: פטור</small>' : '';
	const note = cell.note ? `<small class="${P}-note">${esc(cell.note)}</small>` : '';
	const pct = cell.pctNote && !cell.pctNote.min ? `<small class="${P}-note">לפי ${esc(cell.pctNote.item)}: ${nis(cell.pctNote.amount)}</small>` : '';
	return `<td class="${P}-cell${on}" data-th="${side === 'rab' ? FORUM_HE.rabbinical : FORUM_HE.family}">${chosen ? `<span class="jtool-visually-hidden">המסלול שנבחר: </span>` : ''}${fig}${unit}${prot}<small class="${P}-item">${rbCite(rbShort(cell.item), cell.url)}</small>${src}${where}${aid}${pct}${note}</td>`;
}

export function ledger(reg, r) {
	const rows = r.lines.map((l) => {
		const onRab = l.rab && (l.both ? r.forum === 'rabbinical' : true);
		const onFam = l.fam && (l.both ? r.forum === 'family' : l.chosen === 'fam');
		return `<tr><th scope="row">${esc(l.he)}</th>${rbCellHtml(l.rab, l, 'rab', onRab, r.legalAid)}${rbCellHtml(l.fam, l, 'fam', onFam, r.legalAid)}</tr>`;
	}).join('');
	const t = r.totals;
	const miss = rbMissing(r);
	const summary = `${r.lines.length} שורות. אם מגישים את כל מה שאפשר לבית הדין הרבני: ${nis(t.rab)}. אם מגישים לבית המשפט לענייני משפחה את מה שהוא דן בו: ${nis(t.fam)}${t.shared ? `, כולל ${nis(t.shared)} שמשולמים בבית הדין הרבני בכל מקרה` : ''}${miss ? `, בלי ${miss}` : ''}. ההפרש ${nis(Math.abs(t.diff))}${t.diff > 0 ? ' לטובת בית הדין' : t.diff < 0 ? ' לטובת בית המשפט' : ''}.`;
	return `<div class="${P}-ledgerwrap"><p class="jtool-visually-hidden" id="${P}-ledger-sum">${esc(summary)}</p>`
		+ `<table class="${P}-ledger" aria-describedby="${P}-ledger-sum"><caption>פנקס האגרות: אותו תיק בשני הפורומים${r.legalAid ? ' (בסיוע המשפטי: פטור מאגרה)' : ''}<small>הפרטים מהתוספת הראשונה לתקנות של כל פורום; משבצת מקווקוות היא הליך שרק בית הדין הרבני דן בו (סעיף 1 לחוק השיפוט), והוא נספר בשני המסלולים.</small></caption>`
		+ `<thead><tr><th scope="col">ההליך</th><th scope="col" class="${P}-col-rab${r.forum === 'rabbinical' ? ` ${P}-col--on` : ''}">${FORUM_HE.rabbinical}</th><th scope="col" class="${P}-col-fam${r.forum === 'family' ? ` ${P}-col--on` : ''}">${FORUM_HE.family}</th></tr></thead>`
		+ `<tbody>${rows}</tbody>`
		+ `<tfoot><tr class="${P}-total"><th scope="row">סך הכול במסלול</th><td data-th="${FORUM_HE.rabbinical}">${ils(t.rab, t.rab % 1 ? 2 : 0)}</td><td data-th="${FORUM_HE.family}">${ils(t.fam, t.fam % 1 ? 2 : 0)}${miss ? `<small>בלי: ${esc(miss)}</small>` : ''}</td></tr>`
		+ (t.shared ? `<tr class="${P}-sub"><th scope="row">מתוכם בבית הדין הרבני בכל מקרה</th><td colspan="2">${ils(t.shared, 0)} (תביעת הגירושין, הגט, התעודות והליכים שרק בו)</td></tr>` : '')
		+ `<tr class="${P}-sub"><th scope="row">ההפרש</th><td colspan="2">${t.diff ? `${ils(Math.abs(t.diff), 0)} ${t.diff > 0 ? 'יותר בבית המשפט' : 'יותר בבית הדין'}` : 'אין הפרש'}${miss ? ' (בלי ההליכים שאין להם סכום בבית המשפט)' : ''}</td></tr></tfoot></table></div>`;
}

export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const s = r.sel;
	const has = (id) => s.includes(id);
	const linked = r.lines.filter((l) => l.group === 'linked' && l.both).map((l) => l.he.replace(/ \(.*\)$/, ''));
	let scene;
	let question;
	if (has('div')) {
		scene = `בני זוג יהודים בהליך גירושין במחלוקת. אחד מהם הגיש ${has('req') ? 'בקשה ליישוב סכסוך ואחריה ' : ''}תביעת גירושין לבית הדין הרבני${linked.length ? `, ו${r.forum === 'family' ? 'את ' : 'כרך בה את '}${linked.join(', ')}${r.forum === 'family' ? ' הגיש לבית המשפט לענייני משפחה' : ''}` : ''}.`;
		question = 'השאלה לתרגול: הדיון הראשון בבית הדין הרבני. איך מציגים בקצרה את עילת הגירושין ואת התביעות הכרוכות, ואיך עונים לשאלות הדיינים על הסמכות ועל הילדים?';
	} else if (has('agree') || has('joint')) {
		scene = `בני זוג יהודים מתגרשים בהסכמה ומבקשים ${has('agree') ? `לתת להסכם הגירושין תוקף של פסק דין ב${FORUM_HE[r.forum]}` : 'לסדר את הגט בבקשה משותפת'}, ואחר כך גט ותעודות בבית הדין הרבני.`;
		question = 'השאלה לתרגול: הדיון באישור ההסכם. מה הדיינים בודקים לפני שהם מאשרים, ואיך מראים ששני הצדדים הבינו את ההסכם והסכימו לו מרצון?';
	} else if (has('appeal') || has('leave') || has('appeal_other')) {
		scene = `צד בתיק משפחה מערער על פסק דין, ${r.forum === 'family' ? 'לבית המשפט המחוזי' : 'לבית הדין הרבני הגדול'}.`;
		question = 'השאלה לתרגול: הדיון בערעור. איך מציגים בתוך כמה דקות את הטעות בפסק הדין ולמה היא משנה את התוצאה?';
	} else if (s.some((id) => id.startsWith('inh'))) {
		scene = 'יורשים מבקשים צו ירושה או צו קיום צוואה בבית הדין הרבני, בהסכמת כולם בכתב.';
		question = 'השאלה לתרגול: הדיון בבקשה. איך מראים לדיינים שכל היורשים הסכימו, ומה עונים אם אחד מהם חוזר בו?';
	} else {
		scene = `אדם פונה לבית הדין הרבני בבקשה בעניין ${r.lines.slice(0, 2).map((l) => l.he).join(' ובעניין ')}. הדיינים בודקים את המסמכים שצורפו ושואלים את המבקש על הפרטים.`;
		question = 'השאלה לתרגול: הדיון הראשון בבית הדין הרבני. מה שואלים הדיינים, ואיך עונים בקצרה ולעניין?';
	}
	const money2 = rbHasBoth(r) ? `סך האגרות במסלול שנבחר: ${nis(r.totals.chosen)}; באותם הליכים ${rbIn(rbForumName(r, r.forum === 'family' ? 'rabbinical' : 'family'))}: ${nis(r.forum === 'family' ? r.totals.rab : r.totals.fam)}.` : `סך האגרות: ${nis(r.totals.chosen)}, רק בבית הדין הרבני.`;
	const nextDate = r.events.find((e) => e.kind === 'appeal') || r.events.find((e) => e.kind === 'pay' && e.date !== (r.dates.reqDate || ''));
	const when = nextDate ? ` המועד הבא בלוח: ${isoToHe(nextDate.date)}.` : '';
	return `${scene} ${money2}${when} ${question}`;
}

/** The "what to do now" list: the official form, office and payment, the next date, and 2-4 pages of this site. */
export function nextActions(reg, r) {
	const fl = reg.fl_rabanut;
	const s = r.sel;
	const out = [];
	const famUsed = r.forum === 'family' && r.lines.some((l) => l.both);
	if (r.lines.some((l) => l.rab && l.inRab > 0) || r.forum === 'rabbinical') { out.push({ he: `לשלם בשירות התשלומים של בתי הדין הרבניים, לפני הגשת המסמכים: ${fl.rab.payment.how_he}`, url: fl.rab.payment.url, official: true }); }
	if (famUsed) { out.push({ he: `לשלם בבית המשפט לענייני משפחה: ${fl.fam.payment.how_he}`, url: fl.fam.payment.url, official: true }); }
	if (s.includes('req') && !r.abroad) { out.push({ he: fl.forms.dispute.he, url: fl.forms.dispute.url, official: true }); }
	if (famUsed) { out.push({ he: `${fl.fam.exempt_service.he} (${fl.fam.rules.exempt.section})`, url: fl.fam.exempt_service.url, official: true }); }
	const ev = r.events.find((e) => e.kind === 'appeal') || r.events.find((e) => e.kind === 'pay' && e.date !== (r.dates.reqDate || ''));
	if (ev) { out.push({ he: `המועד הבא: ${isoToHe(ev.date)}, ${ev.what}`, rule: ev.rule }); }
	const links = [];
	if (r.isDivorce) { links.push({ path: '/opening-divorce-file-rabbinical/', he: 'פתיחת תיק גירושין: העלות לפי המסלול והמועדים שבחוק' }); }
	if (s.includes('req')) { links.push({ path: '/request-for-family-dispute-settlements/', he: 'מה כותבים בבקשה ליישוב סכסוך' }); }
	if (s.includes('sup') || s.includes('supch')) { links.push({ path: '/child-support/', he: 'כמה מזונות ילדים, לפי הלכת 919/15' }); }
	if (s.includes('agree') || s.includes('joint') || s.includes('change')) { links.push({ path: '/divorce-agreement/', he: 'הסכם גירושין: מה כולל, ומחולל טיוטה' }); }
	if (s.includes('prenup')) { links.push({ path: '/prenuptial-agreement/', he: 'הסכם ממון: מה כולל ואיך מאשרים' }); }
	if (s.some((id) => id.startsWith('inh'))) { links.push({ path: '/applying-order-heirs-registrar/', he: 'בקשה לצו ירושה אצל הרשם, צעד אחר צעד' }); }
	if (s.includes('appeal') || s.includes('leave')) { links.push({ path: '/great-rabbinical-court/', he: 'בית הדין הרבני הגדול: ערעור ורשות ערעור' }); }
	links.push(r.forum === 'family' ? { path: '/directory-family-courts/', he: 'איזה בית משפט לענייני משפחה, לפי מחוז' } : { path: '/regional-rabbinical-courts/', he: 'איזה בית דין רבני אזורי, לפי מקום המגורים' });
	links.push({ path: '/family-law/', he: 'כל ההליכים בדיני משפחה' });
	return { official: out, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const fl = reg.fl_rabanut;
	const other = r.forum === 'family' ? r.totals.rab : r.totals.fam;
	const delta = Math.round((other - r.totals.chosen) * 100) / 100;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי תקנות האגרות, בנוסח 2026</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}כמה עולות האגרות כשמגישים ל${FORUM_HE[r.forum]}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.totals.chosen, r.totals.chosen % 1 ? 2 : 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (rbHasBoth(r) ? `<p class="jtool-scope">אותו תיק ${rbIn(rbForumName(r, r.forum === 'family' ? 'rabbinical' : 'family'))}: <strong>${ils(other, other % 1 ? 2 : 0)}</strong>${delta ? ` (${nis(Math.abs(delta))} ${delta > 0 ? 'יותר ממה שבחרתם' : 'פחות ממה שבחרתם'})` : ''}${rbMissing(r) ? `, בלי ${esc(rbMissing(r))}` : ''}. האגרות מתעדכנות ב-${isoToHe(fl.next_update)}.</p></div>`
			: `<p class="jtool-scope">להליכים האלה אין מקבילה בבית המשפט לענייני משפחה: הם בשיפוט בית הדין הרבני. האגרות מתעדכנות ב-${isoToHe(fl.next_update)}.</p></div>`)
		+ ledger(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${RB_SIM}" target="_blank" rel="noopener" data-act="rehearse">להעתיק ולתרגל את הדיון</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a>` : esc(x.he)}${x.rule ? ` (${esc(x.rule)})` : ''}</li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

export function deadlinesTable(reg, r, opts = {}) {
	if (!r.events.length) {
		return `<p class="jtool-scope">הקלידו תאריך (הגשת הבקשה ליישוב סכסוך, מתן פסק הדין או סידור הגט) כדי לראות את המועדים שהחוק והתקנות קובעים. ${esc(reg.fl_rabanut.deadlines.summons.he)} (${esc(reg.fl_rabanut.deadlines.summons.section)}).</p>`;
	}
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}${e.rest ? ` <small>(${esc(e.rest)})</small>` : ''}</td><td data-th="מה">${esc(e.what)}</td><td data-th="הכלל">${rbCite(e.rule, e.url)}</td></tr>`; }).join('')
		+ `</tbody><caption>מועדים שהחוק או התקנות קובעים בלבד. החוק לא קובע כמה זמן נמשך תיק, ולכן אין כאן תאריך לפסק הדין.</caption></table></div>`;
}

function rbExemptions(reg) {
	const fl = reg.fl_rabanut;
	const rr = fl.rab.rules;
	const fr = fl.fam.rules;
	const li = (x, url) => `<li>${esc(x.he)}${rbCite(x.section, url)}</li>`;
	return `<div class="${P}-cols"><div><p class="${P}-col__h">${FORUM_HE.rabbinical}</p><ul class="${P}-list">${[rr.support, rr.legal_aid, rr.defer, rr.exempt_after, rr.free, rr.restore, rr.counter].map((x) => li(x, fl.rab.url)).join('')}</ul></div>`
		+ `<div><p class="${P}-col__h">${FORUM_HE.family}</p><ul class="${P}-list">${[fr.legal_aid, fr.exempt, fr.matters, fr.bereaved, fr.copy_free, fr.demand].map((x) => li(x, fl.fam.url)).join('')}</ul></div></div>`;
}

function rbRefunds(reg, r) {
	const fl = reg.fl_rabanut;
	const rr = fl.rab.rules;
	const fr = fl.fam.rules;
	const f = r.refunds;
	if (!f.rabBase && !f.famBase) { return `<p class="jtool-scope">${esc(rr.refund_not.he)} (${esc(rr.refund_not.section)}). בהליכים שבחרתם אין אגרה שקטנה בסיום מוקדם.</p>`; }
	const rows = [];
	if (f.rabBase) {
		rows.push(`<tr><td data-th="מתי">${esc(rr.refund_early.he)}</td><td data-th="משלמים">${ils(f.rabEarly, f.rabEarly % 1 ? 2 : 0)} במקום ${nis(f.rabBase)}</td><td data-th="הכלל">${rbCite(rr.refund_early.section, fl.rab.url)}</td></tr>`);
		rows.push(`<tr><td data-th="מתי">${esc(rr.refund_late.he)}</td><td data-th="משלמים">${ils(f.rabLate, f.rabLate % 1 ? 2 : 0)} במקום ${nis(f.rabBase)}</td><td data-th="הכלל">${rbCite(rr.refund_late.section, fl.rab.url)}</td></tr>`);
	}
	if (f.famBase) {
		rows.push(`<tr><td data-th="מתי">${esc(fr.refund_half.he)}</td><td data-th="משלמים">${ils(f.famHalf, f.famHalf % 1 ? 2 : 0)} במקום ${nis(f.famBase)}</td><td data-th="הכלל">${rbCite(fr.refund_half.section, fl.fam.url)}</td></tr>`);
		rows.push(`<tr><td data-th="מתי">${esc(fr.refund_all.he)}</td><td data-th="משלמים">החזר מלא, לפי החלטת בית המשפט</td><td data-th="הכלל">${rbCite(fr.refund_all.section, fl.fam.url)}</td></tr>`);
	}
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-rf-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתי</th><th scope="col">משלמים</th><th scope="col">הכלל</th></tr></thead><tbody>${rows.join('')}</tbody>`
		+ `<caption>על התביעות במסלול שבחרתם, כולל אגרת הפרוטוקול (תקנה 3א(ב)). ${esc(rr.refund_not.he)} (${esc(rr.refund_not.section)}).</caption></table></div>`;
}

/** The one-page print: inputs, result, the computation path, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_rabanut;
	const here = r.forum === 'family' ? 'inFam' : 'inRab';
	const path = r.lines.map((l) => {
		const cell = r.forum === 'family' && l.fam ? l.fam : (l.rab || l.fam);
		return `<li>${esc(l.he)}: ${l[here] ? nis(l[here]) : 'בלי אגרה'}${cell && cell.item ? ` (${esc(cell.item)}${cell.protocol && l[here] ? `; פרוטוקול ${esc(cell.protocolItem)}` : ''})` : ''}</li>`;
	}).join('');
	return `<h3>אגרות בית הדין הרבני ובית המשפט לענייני משפחה: סיכום</h3>`
		+ `<p><strong>מה נבחר:</strong> ${esc(r.lines.map((l) => l.he).join('; '))}. הגשה ל${FORUM_HE[r.forum]}${r.abroad ? '; אחד מבני הזוג בחוץ לארץ' : ''}${r.legalAid ? '; בסיוע המשפטי' : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${nis(r.totals.chosen)} במסלול שנבחר; ${FORUM_HE.rabbinical} ${nis(r.totals.rab)}, ${FORUM_HE.family} ${nis(r.totals.fam)}.</p>`
		+ `<p><strong>דרך החישוב:</strong></p><ol>${path}<li>סך הכול: ${nis(r.totals.chosen)}</li></ol>`
		+ (r.events.length ? `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.what)}`).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(fl.rab.regulation_he)}, נוסח ל-${isoToHe(fl.rab.current_to)}; ${esc(fl.rab.admin_table.he)}, ${esc(fl.rab.admin_table.version_he)}; ${esc(fl.fam.regulation_he)}, נוסח מ-${isoToHe(fl.fam.from)}; ${esc(fl.deadlines.rab_he)}. נבדק ${isoToHe(fl.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_rabanut;
	let out = `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">לוח המועדים של התיק</h3>${r.events.length ? '<div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div>' : ''}</div>${deadlinesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-rf-h">אם התיק נגמר מוקדם</h3></div>${rbRefunds(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ex-h">פטורים, דחייה והנחות</h3></div>${rbExemptions(reg)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-pay-h">איך ואיפה משלמים</h3></div><div class="${P}-cols">`
		+ `<div><p class="${P}-col__h">${FORUM_HE.rabbinical}</p><p>${esc(fl.rab.payment.how_he)}.${rbCite(fl.rab.payment.he, fl.rab.payment.url)}</p><p class="jtool-hint">${esc(fl.rab.rules.pay_first.he)} (${esc(fl.rab.rules.pay_first.section)}).</p></div>`
		+ `<div><p class="${P}-col__h">${FORUM_HE.family}</p><p>${esc(fl.fam.payment.how_he)}.${rbCite(fl.fam.payment.he, fl.fam.payment.url)}</p><p class="jtool-hint">${esc(fl.fam.rules.pay_first.he)} (${esc(fl.fam.rules.pay_first.section)}).</p></div></div></div>`
		+ `</div>`;
	out += `<div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || fl.checked_on)}</div>`;
	return out;
}

/** Page section: the same claims in both forums, and the whole first schedule of the Dayanim (Fees) Regulations. */
export function compareTable(reg) {
	const fl = reg.fl_rabanut;
	const both = fl.procedures.filter((p) => p.rab && p.fam && p.group !== 'inherit');
	const cell = (spec) => {
		if (!spec) { return '—'; }
		if (spec.amount0) { return 'פטור'; }
		if (spec.pct_ref && !spec.ref) { const r = rbGet(reg, spec.pct_ref); return `${r.pct}%, לפחות ${nis(r.min)}`; }
		const v = rbGet(reg, spec.ref);
		const amount = v && typeof v === 'object' ? v.amount : v;
		const prot = spec.protocol && !spec.exempt ? rbGet(reg, spec.protocol.ref) : 0;
		return spec.exempt ? 'פטור לתובע' : `${nis(amount)}${prot ? ` + ${nis(prot)}` : ''}`;
	};
	const rows = both.map((p) => `<tr><td data-th="ההליך">${esc(p.he)}</td><td data-th="${FORUM_HE.rabbinical}">${cell(p.rab)}</td><td data-th="${FORUM_HE.family}">${cell(p.fam)}</td></tr>`).join('');
	const sched = fl.schedule.map((s) => `<tr><td data-th="פרט">${esc(s.item)}</td><td data-th="ההליך">${esc(s.he)}</td><td data-th="אגרה">${s.kind === 'exempt' ? 'פטור' : s.kind === 'expenses' ? 'ההוצאות בפועל' : s.kind === 'pct' ? `לפחות ${nis(s.amount)}` : nis(s.amount)}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>אותה תביעה בשני הפורומים: אגרה ועוד אגרת פרוטוקול. בית הדין: ${esc(fl.rab.regulation_he)}, בתוקף מ-${isoToHe(fl.rab.from)}; בית המשפט: ${esc(fl.fam.regulation_he)}, בתוקף מ-${isoToHe(fl.fam.from)}.</caption><thead><tr><th scope="col">ההליך</th><th scope="col">${FORUM_HE.rabbinical}</th><th scope="col">${FORUM_HE.family}</th></tr></thead><tbody>${rows}</tbody></table></div>`
		+ `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הטבלה המלאה: כל פרטי התוספת הראשונה לתקנות הדיינים (אגרות), בנוסח ל-${isoToHe(fl.rab.current_to)}. ${esc(fl.rab.indexed_he)}.</caption><thead><tr><th scope="col">פרט</th><th scope="col">ההליך</th><th scope="col">אגרה</th></tr></thead><tbody>${sched}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = rbCompute(reg, EXAMPLE);
	const fl = reg.fl_rabanut;
	const dc = reg.divorce_cost;
	const rb = dc.rabbinical;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.totals.chosen,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>בקשה ליישוב סכסוך בבית הדין הרבני: ${money(rb.request, 0)} ₪${rbCite(rb.items.request, rb.url)}; בבית המשפט ${money(dc.family.request, 0)} ₪${rbCite(dc.family.items.request, dc.family.url)}</li>`
			+ `<li>תביעת גירושין: ${money(rb.divorce, 0)} ₪ ועוד ${money(rb.transcript_divorce, 0)} ₪ אגרת פרוטוקול${rbCite(rb.items.divorce, rb.url)}${rbCite(rb.items.transcript_divorce, rb.url)}; רק בבית הדין הרבני${rbCite('סעיף 1 לחוק השיפוט', fl.jurisdiction.url)}</li>`
			+ `<li>רכוש: ${money(rb.property, 0)} + ${money(rb.transcript_other, 0)} ₪ בבית הדין${rbCite(rb.items.property, rb.url)}, ${money(dc.family.property, 0)} + ${money(dc.family.transcript, 0)} ₪ בבית המשפט${rbCite(dc.family.items.property, dc.family.url)}</li>`
			+ `<li>החזקת ילדים: ${money(rb.custody, 0)} + ${money(rb.transcript_other, 0)} ₪ בבית הדין${rbCite(rb.items.custody, rb.url)}, ${money(dc.family.custody, 0)} + ${money(dc.family.transcript, 0)} ₪ בבית המשפט${rbCite(dc.family.items.custody, dc.family.url)}</li>`
			+ `<li>מזונות: פטור לתובע בבית הדין${rbCite(fl.rab.rules.support.section, fl.rab.url)}, ${money(dc.family.support, 0)} + ${money(dc.family.transcript, 0)} ₪ בבית המשפט${rbCite(dc.family.items.support, dc.family.url)}</li>`
			+ `<li>סידור הגט: פטור${rbCite(rb.items.get_free, rb.url)}; תעודת גירושין לכל אחד: 2 × ${money(rb.certificate, 0)} ₪${rbCite(rb.items.certificate, rb.url)}</li>`
			+ `<li>סך הכול: ${money(r.totals.rab, 0)} ₪ כשהכול בבית הדין, ${money(r.totals.fam, 0)} ₪ כשהתביעות הכרוכות בבית המשפט.</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const FORUM_CODE = { rabbinical: 'r', family: 'f' };
export const KEYS = ['s', 'f', 'a', 'c', 'v', 'l', 'd', 'e', 'j', 'g'];
export const stateOf = (i) => encodeState({ s: (i.sel || []).join('.'), f: FORUM_CODE[i.forum] || 'r', a: i.abroad ? 1 : '', c: i.certificates === 2 || i.certificates === undefined ? '' : i.certificates, v: i.value === '' || i.value === undefined ? '' : Math.round(Number(i.value)), l: i.legalAid ? 1 : '', d: i.reqDate || '', e: i.extended ? 1 : '', j: i.judgmentDate || '', g: i.getDate || '' });
export function inputOf(s) {
	if (!s.s) { return null; }
	return {
		sel: String(s.s).split('.').filter(Boolean), forum: s.f === 'f' ? 'family' : 'rabbinical', abroad: s.a === '1',
		certificates: s.c === undefined || s.c === '' ? 2 : Number(s.c), value: s.v === undefined || s.v === '' ? '' : Number(s.v),
		legalAid: s.l === '1', reqDate: s.d || '', extended: s.e === '1', judgmentDate: s.j || '', getDate: s.g || '',
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const v = val(`#${P}-value`).trim();
	return {
		sel: [...root.querySelectorAll(`input[name="${P}-p"]:checked`)].map((x) => x.value),
		forum: (root.querySelector(`input[name="${P}-forum"]:checked`) || {}).value || 'rabbinical',
		abroad: on('abr'), legalAid: on('aid'), extended: on('ext'),
		certificates: Number((root.querySelector(`input[name="${P}-cert"]:checked`) || {}).value ?? 2),
		value: v === '' ? '' : parseMoney(v),
		reqDate: rbToIso(val(`#${P}-req`)), judgmentDate: rbToIso(val(`#${P}-jud`)), getDate: rbToIso(val(`#${P}-get`)),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const fl = reg.fl_rabanut;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(fl.checked_on, fl.refresh_every_days) || (fl.next_update && today >= fl.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { reqDate: 'req', judgmentDate: 'jud', getDate: 'get', value: 'value' };
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		const n = form.querySelector(`[data-${P}-count]`);
		if (n) { n.textContent = String(input.sel.length); }
		const key = Object.keys(PRESETS).find((k) => PRESETS[k].sel.join('.') === input.sel.join('.')) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = rbCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.totals.chosen, 0) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.forum}-${r.lines.length > 4 ? 'many' : 'few'}` }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = readForm(root); sync(input); run(input); }, 160);
	};
	// A share link names its tool (/@agrot-rabanut); on a page with several tools only that tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const p = PRESETS[b.getAttribute('data-preset')];
			if (!p) { return; }
			const input = Object.assign(readForm(root), { sel: p.sel.slice() });
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok && r.events.length) {
			download('agrot-rabanut.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `תיק בבית הדין: ${e.what}`, description: `${e.rule}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי תקנות האגרות ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(fl.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief goes to the clipboard and the link opens as is.
			if (r.ok) { copyText(aiBrief(reg, r)); }
			toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.forum : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
