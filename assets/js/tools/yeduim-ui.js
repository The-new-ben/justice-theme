/**
 * The family + land wave UI (21.10.2026, HAD-579): the rights map for cohabiting partners (yeduim-batzibur) on
 * /cohabiting-couples-rights/. The picture is a ledger, the book a clerk keeps: one ruled line per right, the topic in the
 * margin, "what you have" on one page and "what you must prove" on the facing page, each line with its section. Under it
 * the proof meter: the five tests the law and the rulings name, each met, open or not met by what was marked (no weights,
 * no score). The tables, the print sheet and the .ics say the same in text.
 */
import { compute, survivorsRow, affidavitCost, QUESTIONS, HOMES, AGES, FAMILIES } from './yeduim-engine.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';
import { openSimulation } from './sim-handoff.js';

export const TOOL_ID = 'yeduim-batzibur';
const P = 'jt43';

export const EXAMPLE = { question: 'daily', since: '2019-03-01', household: true, kids: 1, married: false, home: 'one', age: '40to50', family: 'kids', died: '', remind: '' };

const Q_LABEL = { daily: 'ביום-יום: מה יש לנו', separation: 'אנחנו נפרדים', death: 'בן או בת הזוג נפטרו' };
const HOME_LABEL = { none: 'אין דירה בבעלות', one: 'רשומה על אחד מאיתנו', both: 'רשומה על שנינו' };
const AGE_LABEL = { u40: 'מתחת ל-40', '40to50': '40 עד 50', '50to55': '50 עד 55', '55to80': '55 עד 80', '80p': '80 ומעלה' };
const FAM_LABEL = { kids: 'ילדים או נכדים (גם מקשר קודם)', parents: 'הורים, בלי ילדים', siblings: 'רק אחים או סבים', none: 'אף אחד מאלה' };
const KIDS_LABEL = { 0: 'אין', 1: 'ילד אחד', 2: 'שניים', 3: '3 ומעלה' };
const ST_LABEL = { have: 'יש לכם', prove: 'צריך להוכיח', no: 'לא חל', info: 'לדעת' };
const ST_MARK = { have: '✓', prove: '?', no: '✕', info: 'i' };
const T_LABEL = { met: 'מתקיים', open: 'פתוח: תלוי בראיות', not: 'לא מתקיים', na: 'לא נבדק' };
const PURPOSE_LABEL = { mediation: 'לתרגל את הגישור עם הנתונים שלכם', court_rehearsal: 'לתרגל את ההוכחה בבית המשפט עם הנתונים שלכם' };
const CATALOG_PURPOSE = 'court_rehearsal';
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const cites = (list) => (list || []).map((c) => cite(c.text, c.url)).join('');
/** Numbers isolated in running Hebrew text, so "18%, 330.40" never flips (the text is escaped around them). */
const bidiText = (t) => String(t ?? '').split(/(\d[\d,.]*%?)/).map((part, i) => (i % 2 ? `<bdi>${part}</bdi>` : esc(part))).join('');
const durationHe = (r) => (r.months < 12 ? `${r.months} חודשים` : `${r.years === 1 ? 'שנה' : `${r.years} שנים`}${r.monthsRem ? ` ו-${r.monthsRem} חודשים` : ''}`);
const kidsHe = (k) => (k === 0 ? 'בלי ילדים משותפים' : k === 1 ? 'עם ילד משותף אחד' : k === 2 ? 'עם שני ילדים משותפים' : 'עם שלושה ילדים משותפים או יותר');

/** The simulation link: the same address the server builds (justice_theme_article_simulation_url), never a case story. */
export function simUrl(purpose) {
	return `https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=${encodeURIComponent(purpose)}&topic=family-law`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const fy = reg.fl_yeduim;
	const chip = (name, value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const field = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const q = QUESTIONS.includes(input.question) ? input.question : 'daily';
	const kids = [0, 1, 2, 3].includes(Number(input.kids)) ? Number(input.kids) : 0;
	const home = HOMES.includes(input.home) ? input.home : 'none';
	const age = AGES.includes(input.age) ? input.age : '40to50';
	const fam = FAMILIES.includes(input.family) ? input.family : 'kids';
	const dateText = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? isoToHe(v) : String(v || ''));
	const s = fy.nii.survivors;
	return `<fieldset class="jtool-field"><legend>מה השאלה שלכם</legend><div class="jtool-chips">${QUESTIONS.map((k) => chip('q', k, Q_LABEL[k], q === k)).join('')}</div></fieldset>`
		+ `<div class="jtool-row">${field('since', 'גרים יחד מאז', dateText(input.since), 'לדוגמה: 1.3.2019')}`
		+ `<fieldset class="jtool-field"><legend>ילדים משותפים</legend><div class="jtool-chips">${[0, 1, 2, 3].map((k) => chip('kd', k, KIDS_LABEL[k], kids === k)).join('')}</div><p class="jtool-error" id="${P}-kids-e" role="alert"></p></fieldset></div>`
		+ `<fieldset class="jtool-field"><legend>משק בית</legend><div class="jtool-chips">${chip('hh', '1', 'גרים יחד ומנהלים משק בית משותף', input.household !== false)}${chip('hh', '0', 'לא גרים יחד', input.household === false)}</div>`
		+ `<p class="jtool-hint">${esc(fy.succession.s55)} לחוק הירושה מדבר על "חיי משפחה במשק בית משותף"; הביטוח הלאומי על בני זוג שגרים יחד (${esc(fy.nii.def_section)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>נישואים לאדם אחר</legend><div class="jtool-chips">${chip('mr', '0', 'אף אחד מאיתנו לא נשוי לאחר', input.married !== true)}${chip('mr', '1', 'אחד מאיתנו עדיין נשוי לאחר', input.married === true)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הדירה שגרים בה</legend><div class="jtool-chips">${HOMES.map((k) => chip('ho', k, HOME_LABEL[k], home === k)).join('')}</div></fieldset>`
		+ `<div data-if-death${q === 'death' ? '' : ' hidden'}>`
		+ `<fieldset class="jtool-field"><legend>הגיל של מי שנשאר, ביום הפטירה</legend><div class="jtool-chips">${AGES.map((k) => chip('ag', k, AGE_LABEL[k], age === k)).join('')}</div>`
		+ `<p class="jtool-hint">מגיל ${s.older_age} מספיקה חצי שנה של מגורים יחד; מתחת לגיל ${s.grant_under_age} בלי ילדים יש מענק במקום קצבה (${esc(s.section)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הקרובים של מי שנפטר</legend><div class="jtool-chips">${FAMILIES.map((k) => chip('fm', k, FAM_LABEL[k], fam === k)).join('')}</div>`
		+ `<p class="jtool-hint">החלק בירושה כמו של בן זוג נשוי תלוי בקרובים האחרים (${esc(reg.yerusha.sections.spouse)} לחוק הירושה).</p></fieldset>`
		+ `${field('died', 'יום הפטירה (לא חובה, למועד התביעה)', dateText(input.died), 'לדוגמה: 10.5.2026')}</div>`
		+ `<details class="jtool-more" data-if-remind${q === 'death' && input.died ? ' hidden' : ''}${input.remind ? ' open' : ''}><summary>תזכורת ביומן להכין את המסמכים</summary>`
		+ `<div style="margin-top:8px">${field('remind', 'באיזה יום להזכיר (לא חובה; בלי תאריך: בעוד 30 ימים)', dateText(input.remind), 'לדוגמה: 15.11.2026')}</div>`
		+ `<p class="jtool-hint">לזכויות האלה אין מועד קבוע בחוק כל עוד שניכם בחיים, ולכן התזכורת ביום שתבחרו.</p></details>`;
}

/** One verdict sentence from the computed lines. */
export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const head = `${r.question === 'daily' ? 'גרים יחד' : 'גרתם יחד'} ${durationHe(r)}, ${kidsHe(r.kids)}, ו${r.married ? 'אחד מכם עדיין נשוי לאחר' : 'אף אחד מכם לא נשוי לאחר'}: ${r.met} מתוך ${r.applicable} מבחני ההוכחה מתקיימים לפי מה שסימנתם.`;
	const line = (k) => r.lines.find((l) => l.key === k);
	if (r.question === 'separation') {
		return `${head} בפרידה אין איזון משאבים: ${r.home === 'one' ? 'הדירה הרשומה על אחד מכם, וכל נכס אחר, משותפים' : 'נכס משותף'} רק אם תוכיחו כוונת שיתוף (ע"א 52/80). חיסכון פנסיוני מתחלק בפסק דין, ומזונות בין בני הזוג רק לפי הסכם.`;
	}
	if (r.question === 'death') {
		const inh = line('inherit');
		const sv = r.survivors;
		const dl = r.deadlines.find((d) => d.kind === 'law');
		return `${head} ${inh.state === 'no' ? 'ירושה בלי צוואה: לא, כי אחד מכם נשוי לאחר (סעיף 55).' : `ירושה ${inh.have.replace(/\.$/, '')}, אם תוכיחו חיי משפחה ומשק בית משותף.`} ${sv.state === 'no' ? 'קצבת שארים: לא לפי מה שסימנתם.' : sv.row.grant ? `קצבת שארים: מענק של ${sv.row.pensions} קצבאות במקום קצבה.` : `קצבת שארים: ${nis(sv.amount)} בחודש, אם תוכיחו מגורים יחד.`}${dl ? ` התביעה בביטוח הלאומי עד ${isoToHe(dl.date)}.` : ''}`;
	}
	const inh = line('inherit');
	return `${head} ${inh.state === 'no' ? 'ירושה בלי צוואה: לא, כי אחד מכם נשוי לאחר.' : 'ירושה בלי צוואה כמו נשואים (סעיף 55), אם תוכיחו חיי משפחה ומשק בית משותף.'} חוק יחסי ממון לא חל${r.home === 'one' ? ', והדירה הרשומה על אחד מכם משותפת רק אם תוכיחו כוונת שיתוף' : ''}.`;
}

/**
 * The scenario for the simulation (contract 5f): neutral, 40-90 words, only computed facts; no names, no ID, no address;
 * ends with the question to rehearse. The jus-tice.com app refuses a story in the URL, so the reader pastes this.
 */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const span = r.months < 12 ? 'פחות משנה' : `כ-${r.years === 1 ? 'שנה' : `${r.years} שנים`}`;
	const home = r.home === 'one' ? 'הדירה שבה גרו רשומה על שם אחד מהם בלבד' : r.home === 'both' ? 'הדירה רשומה על שם שניהם' : 'אין להם דירה בבעלות';
	const marr = r.married ? 'אחד מהם עדיין נשוי לאדם אחר' : 'אף אחד מהם לא נשוי לאחר';
	const hh = r.household ? 'גרים יחד ומנהלים משק בית משותף' : 'לא גרים יחד באופן קבוע';
	if (r.question === 'separation') {
		return `בני זוג לא נשואים שחיו יחד ${span}, ${kidsHe(r.kids)}, נפרדים. ${home}, ו${marr}. חוק יחסי ממון לא חל עליהם, ולכן מי שטוען לשיתוף צריך להוכיח כוונה לשתף. השאלה לגישור: איך מחלקים את הדירה ואת החיסכון הפנסיוני שנצבר${r.kids ? ', ואיך מסדרים את זמני השהות והמזונות של הילדים' : ''}, ומה כל צד מביא כדי לטעון לשיתוף?`;
	}
	if (r.question === 'death') {
		const sv = r.survivors;
		const money1 = sv.state !== 'no' && !sv.row.grant ? ` הביטוח הלאומי בודק קצבת שארים של ${nis(sv.amount)} בחודש.` : '';
		return `בן זוג נפטר אחרי ${span} של חיים משותפים בלי נישואין, ${kidsHe(r.kids)}; ${marr}. ${home}.${money1} ${r.married ? 'סעיף 55 לחוק הירושה לא חל, כי אחד מהם נשוי לאחר. השאלה לתרגול: מה עוד בן הזוג שנשאר יכול לתבוע, ואיך מוכיחים את הקשר?' : 'השאלה לתרגול: איך בן הזוג שנשאר מוכיח מול היורשים ובבית המשפט לענייני משפחה שהיו ידועים בציבור, ומה מגיע לו לפי סעיף 55?'}`;
	}
	return `בני זוג לא נשואים ${hh} ${span}, ${kidsHe(r.kids)}; ${marr}, ו${home}. גוף ציבורי או קרובי משפחה מטילים ספק בכך שהם ידועים בציבור. השאלה לתרגול: איך מוכיחים בבית המשפט לענייני משפחה חיי משפחה ומשק בית משותף, ואילו מסמכים ועדים מביאים?`;
}

/** The ledger: one ruled line per right, the topic in the margin, have and prove on facing pages. */
export function ledgerHtml(reg, rows, opts = {}) {
	const head = `<thead><tr><th scope="col" class="${P}-c-topic">הנושא</th><th scope="col" class="${P}-c-have">מה יש לכם</th><th scope="col" class="${P}-c-prove">מה צריך להוכיח</th></tr></thead>`;
	const body = rows.map((l) => `<tr class="${P}-r ${P}-r--${l.state}"><th scope="row" class="${P}-c-topic"><span class="${P}-mark" aria-hidden="true">${ST_MARK[l.state]}</span><span class="${P}-topic">${esc(l.topic)}</span><span class="${P}-st">${esc(ST_LABEL[l.state])}</span></th>`
		+ `<td class="${P}-c-have" data-th="מה יש לכם">${bidiText(l.have)}${cites(l.cites)}</td><td class="${P}-c-prove" data-th="מה צריך להוכיח">${bidiText(l.prove)}</td></tr>`).join('');
	return `<table class="${P}-ledger"${opts.id ? ` id="${opts.id}"` : ''}>${opts.caption ? `<caption>${esc(opts.caption)}</caption>` : ''}${head}<tbody>${body}</tbody></table>`;
}

/** The proof meter: the five tests as segments of one bar, each named, with its state in words. */
export function meterHtml(reg, r) {
	const label = `מד ההוכחה: ${r.met} מתוך ${r.applicable} מבחנים מתקיימים לפי מה שסימנתם. ${r.tests.map((t) => `${t.he}: ${T_LABEL[t.state]}`).join('. ')}.`;
	return `<div class="${P}-meter" role="group" aria-label="${esc(label)}"><p class="${P}-meter__h">מד ההוכחה <strong><bdi>${r.met}</bdi> מתוך <bdi>${r.applicable}</bdi></strong> <span>מבחנים מתקיימים לפי מה שסימנתם</span></p>`
		+ `<ol class="${P}-meter__bar">${r.tests.map((t) => `<li class="${P}-seg ${P}-seg--${t.state}"><span class="${P}-seg__n">${esc(t.he)}</span><span class="${P}-seg__s">${esc(T_LABEL[t.state])}</span></li>`).join('')}</ol>`
		+ `<p class="${P}-meter__note">כל מבחן בשמו מהחוק או מפסק הדין, בלי ציון ובלי משקלות. "מתקיים" לפי מה שסימנתם; בבית המשפט מוכיחים אותו בראיות.</p></div>`;
}

/** What to do now: the official form or office first, then the next pages on the site. */
export function nextActions(reg, r) {
	const fy = reg.fl_yeduim;
	const nii = fy.nii;
	const court = reg.prenup.routes.court;
	const out = [];
	if (r.question === 'death') {
		const dl = r.deadlines.find((d) => d.kind === 'law');
		out.push({ he: `להגיש תביעה לקצבת שארים בביטוח הלאומי${dl ? `, עד ${isoToHe(dl.date)}` : ''}`, anchor: 'הגשת התביעה', url: nii.survivors.claim_url, official: true });
		out.push({ he: `לצרף את שאלון ${nii.form_112} להכרה כידועים בציבור אחרי הפטירה`, anchor: `שאלון ${nii.form_112}`, url: nii.form_112_page, official: true });
		if (!r.married) { out.push({ he: 'להגיש בקשה לצו ירושה אצל הרשם לענייני ירושה', anchor: 'השירות באתר הממשלה', url: reg.yerusha.service_url, official: true }); }
		out.push({ he: 'לתכנן את הבקשה, המסמכים והמועדים', anchor: 'מתכנן הבקשה לצו ירושה', path: '/applying-order-heirs-registrar/' });
		out.push({ he: 'לראות מי יורש כמה כשאין צוואה', anchor: 'מחשבון חלוקת הירושה', path: '/succession-law-israel/' });
	} else if (r.question === 'separation') {
		out.push({ he: 'הסכם פרידה שאתם מסכימים עליו: אישור בבית המשפט לענייני משפחה', anchor: 'בקשה לאישור הסכם', url: court.svc_url, official: true });
		out.push({ he: 'לבדוק מה נחשב משותף ואיך מוכיחים', anchor: 'חלוקת רכוש בין ידועים בציבור', path: '/cohabitation-property-rights-for-unmarried-couples/' });
		out.push({ he: 'לראות את השווי של הפנסיה והנכסים לפני המשא ומתן (החוק שם לנשואים, החישוב עוזר)', anchor: 'מחשבון איזון המשאבים', path: '/resource-balancing/' });
		if (r.kids) { out.push({ he: 'לחשב את מזונות הילדים, כמו אצל הורים נשואים', anchor: 'מחשבון מזונות ילדים', path: '/child-support/' }); }
	} else {
		out.push({ he: `לשלוח לביטוח הלאומי את שאלון ${nii.form_107} עם המסמכים`, anchor: `שאלון ${nii.form_107}`, url: nii.form_107_page, official: true });
		out.push({ he: 'הסכם חיים משותפים, ואם תרצו, אישור שלו בבית המשפט לענייני משפחה', anchor: 'בקשה לאישור הסכם', url: court.svc_url, official: true });
		out.push({ he: 'לכתוב טיוטת הסכם, במסלול לידועים בציבור', anchor: 'מחולל ההסכם', path: '/prenuptial-agreement/' });
		out.push({ he: 'לבדוק מה יקבל כל אחד מכם בירושה בלי צוואה', anchor: 'מחשבון חלוקת הירושה', path: '/succession-law-israel/' });
		out.push({ he: 'מה נחשב רכוש משותף ואיך מוכיחים', anchor: 'חלוקת רכוש בין ידועים בציבור', path: '/cohabitation-property-rights-for-unmarried-couples/' });
	}
	return out;
}

function nextHtml(reg, r) {
	return `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ol>${nextActions(reg, r).map((a) => `<li>${esc(a.he)}: ${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.anchor)}</a>` : `<a href="${esc(a.path)}">${esc(a.anchor)}</a>`}</li>`).join('')}</ol></div>`;
}

function briefHtml(reg, r) {
	const p = r.rehearse.purpose;
	return `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p class="${P}-brief__t">${bidiText(aiBrief(reg, r))}</p>`
		+ `<a class="jtool-btn" href="${esc(simUrl(p))}" target="_blank" rel="noopener" data-act="rehearse">${esc(PURPOSE_LABEL[p])}</a>`
		+ `<p class="${P}-brief__n">בלחיצה נפתח תרגול עם התרחיש הזה, בלי שמות ובלי פרטים מזהים. אם החלון לא נפתח, התרחיש מועתק, ומדביקים אותו בתיאור המקרה.</p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const focus = r.lines.filter((l) => l.focus);
	const state = r.no && !r.have ? '<p class="jtool-state jtool-state--warn">! חלק מהזכויות לא חלות עליכם</p>' : `<p class="jtool-state jtool-state--ok">✓ ${r.met} מתוך ${r.applicable} מבחנים מתקיימים</p>`;
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}מפת הזכויות שלכם, ${esc(Q_LABEL[r.question])}</p>`
		+ `<strong class="jtool-verdict__figure ${P}-fig"><span><bdi>${r.have}</bdi> יש</span> <span><bdi>${r.prove}</bdi> להוכיח</span> <span><bdi>${r.no}</bdi> לא חל</span></strong>`
		+ `<p class="jtool-verdict__sentence">${bidiText(verdictSentence(reg, r))}</p></div>`;
	out += `<div class="${P}-book"><p class="${P}-book__h" id="${P}-book-h">פנקס הזכויות: ${esc(Q_LABEL[r.question])}</p>`
		+ ledgerHtml(reg, focus, { caption: `${focus.length} שורות לשאלה שבחרתם; שאר השורות מתחת לתוצאה. כל שורה עם הסעיף שלה.` }) + `</div>`;
	out += meterHtml(reg, r);
	const flags = r.flags.filter((f) => f.level === 'warn');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((f) => `<li><strong aria-hidden="true">!</strong> ${bidiText(f.he)}</li>`).join('')}</ul>`; }
	out += briefHtml(reg, r) + nextHtml(reg, r);
	return out;
}

/** The documents to prepare: the questionnaire's own list (form 107, sections 2-3). */
export function checklist(reg, r) { return r.docs.slice(); }
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x}`).join('\n'); }

/** RFC 5545 TEXT: backslash, comma, semicolon and new lines escaped. */
export function icsText(t) { return String(t).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n'); }

/** The .ics events: the Institute's claim window after a death, or the reminder on the day the reader picked. */
export function icsEvents(reg, r) {
	return r.deadlines.map((d) => ({
		date: d.date,
		summary: icsText(d.kind === 'law' ? `ידועים בציבור: ${d.he.split('.')[0]}` : 'ידועים בציבור: להכין את המסמכים'),
		description: icsText(d.kind === 'law'
			? `${d.he} (${d.section}). חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.`
			: `שאלון 107 של הביטוח הלאומי מבקש: ${r.docs.slice(0, 4).join('; ')}. חושב ב-jus-tice.co.il.`),
	}));
}

/** The one-page print sheet: inputs, result, every line, the tests, the dates and the sources with their dates. */
export function printHtml(reg, r) {
	const fy = reg.fl_yeduim;
	const pn = reg.prenup;
	const inputs = [
		['השאלה', Q_LABEL[r.question]], ['גרים יחד מאז', `${isoToHe(r.since)} (${durationHe(r)})`], ['משק בית משותף', r.household ? 'כן' : 'לא'],
		['ילדים משותפים', KIDS_LABEL[r.kids]], ['נשוי לאחר', r.married ? 'אחד מכם' : 'אף אחד'], ['הדירה', HOME_LABEL[r.home]],
	];
	if (r.question === 'death') { inputs.push(['גיל מי שנשאר', AGE_LABEL[r.age]], ['קרובי הנפטר', FAM_LABEL[r.family]], ['יום הפטירה', r.died ? isoToHe(r.died) : 'לא הוזן']); }
	const sources = [
		[fy.succession.law_he, fy.succession.url, `נוסח עדכני ל-${isoToHe(fy.succession.current_to)}`],
		[fy.nii.law_he, fy.nii.def_url, `סעיפים 1, 238, 296; דפי המוסד נבדקו ${isoToHe(fy.checked_on)}`],
		['קצבה לאלמן ולאלמנה, המוסד לביטוח לאומי', fy.nii.survivors.amounts_url, `מ-${isoToHe(fy.nii.survivors.amounts_from)}`],
		[fy.tax.law_he, fy.tax.url, `נבדק ${isoToHe(fy.checked_on)}`],
		[fy.family_court.law_he, fy.family_court.url, `נוסח עדכני ל-${isoToHe(fy.family_court.current_to)}`],
		[fy.notary.regulation_he, fy.notary.url, `מ-${isoToHe(fy.notary.from)}`],
		[pn.routes.court.fee_he, pn.routes.court.fee_url, `נבדק ${isoToHe(pn.checked_on)}`],
		[fy.property.ruling_he, fy.property.ruling_url, String(fy.property.ruling_year)],
	];
	return `<div class="${P}-print"><p class="${P}-print__h">מפת הזכויות של ידועים בציבור · jus-tice.co.il</p><p>הודפס ב-${esc(isoToHe(r.today))}. המקורות נבדקו ב-${esc(isoToHe(fy.checked_on))}.</p>`
		+ `<h4>מה הזנתם</h4><p>${esc(inputs.map(([a, b]) => `${a}: ${b}`).join('; '))}.</p>`
		+ `<h4>התוצאה</h4><p>${esc(verdictSentence(reg, r))}</p>`
		+ `<table class="${P}-print__t"><thead><tr><th scope="col">הנושא</th><th scope="col">מה יש לכם</th><th scope="col">מה צריך להוכיח</th></tr></thead><tbody>`
		+ r.lines.filter((l) => l.focus).map((l) => `<tr><td>${esc(l.topic)}: ${esc(ST_LABEL[l.state])} (${esc(l.cites.map((c) => c.text).slice(0, 2).join('; '))})</td><td>${esc(l.have)}</td><td>${esc(l.prove)}</td></tr>`).join('')
		+ `</tbody></table><p>עוד בפנקס: ${esc(r.lines.filter((l) => !l.focus).map((l) => `${l.topic} (${ST_LABEL[l.state]})`).join('; '))}.</p>`
		+ `<h4>מבחני ההוכחה: ${r.met} מתוך ${r.applicable}</h4><p>${esc(r.tests.map((t) => `${t.he}: ${T_LABEL[t.state]} (${t.section})`).join('; '))}.</p>`
		+ `<h4>המועדים</h4><ul>${r.deadlines.map((d) => `<li>${esc(isoToHe(d.date))}: ${esc(d.he)} (${esc(d.section)})</li>`).join('')}</ul>`
		+ `<h4>מקורות</h4><ul>${sources.map(([a, u, d]) => `<li>${esc(a)}, ${esc(d)}: ${esc(u)}</li>`).join('')}</ul>`
		+ `<p>מידע כללי, לא ייעוץ משפטי.</p></div>`;
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const fy = reg.fl_yeduim;
	const s = fy.nii.survivors;
	const nt = fy.notary;
	const pn = reg.prenup;
	const y = reg.yerusha;
	let out = `<div class="${P}-screen">`;
	// 1. The rest of the ledger.
	const rest = r.lines.filter((l) => !l.focus);
	if (rest.length) {
		out += `<details class="jtool-more ${P}-rest"><summary>עוד ${rest.length} שורות בפנקס</summary>${ledgerHtml(reg, rest)}</details>`;
	}
	// 2. The tests, each with its source.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-tests-h">מבחני ההוכחה, ומאיפה הם</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-tests-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">המבחן</th><th scope="col">אצלכם</th><th scope="col">מה זה אומר</th></tr></thead><tbody>`
		+ r.tests.map((t) => `<tr><td data-th="המבחן">${esc(t.he)}${cite(t.section, t.url)}</td><td data-th="אצלכם">${esc(T_LABEL[t.state])}: ${esc(t.note)}</td><td data-th="מה זה אומר">${esc(t.why)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(fy.property.burden_he)} (${esc(fy.property.ruling_he)}, ${esc(fy.property.burden_para)}).</caption></table></div></div>`;
	// 3. What it costs, by the regulations.
	const a = r.costs.affidavit;
	const costRows = [
		[`תצהיר אצל נוטריון, המצהיר הראשון`, ilsn(nt.affidavit_first), `${cite(nt.item_first, nt.url)}`],
		[`כל מצהיר נוסף על אותו תצהיר`, ilsn(nt.affidavit_additional), `${cite(nt.item_additional, nt.url)}`],
		[`מע"מ ${a.vatPct}%`, ilsn(a.vat), `${cite('מע"מ', pn.vat.url)}`],
		[`תצהיר משותף לשניכם, כולל מע"מ`, ilsn(a.total), esc(nt.fixed_he)],
		[`אישור הסכם בבית המשפט לענייני משפחה`, ilsn(r.costs.court.fee), cite(r.costs.court.item, r.costs.court.url)],
		[`בקשה לצו ירושה או קיום צוואה, במקוון`, ilsn(r.costs.order.online), `${cite(y.fees.section, y.fees.url)}${cite('שירות התשלומים', y.payments.url)}`],
		[`אותה בקשה, בהגשה רגילה`, ilsn(r.costs.order.fee), cite(y.fees.section, y.fees.url)],
		[`פרסום הבקשה`, ilsn(r.costs.order.publication), cite(y.publication_section, y.regulations_url)],
	];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-cost-h">כמה זה עולה, לפי התקנות</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-cost-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ costRows.map(([x, v, z]) => `<tr><td data-th="מה">${esc(x)}</td><td data-th="סכום">${v}</td><td data-th="מקור">${z}</td></tr>`).join('')
		+ `</tbody><caption>תעריף הנוטריונים מ-${esc(isoToHe(nt.from))}; אגרות הרשם מ-${esc(isoToHe(y.fees.from))}. ${esc(nt.when_he)}.</caption></table></div></div>`;
	// 4. The survivors' table (2026), the reader's row marked.
	const am = s.amounts;
	const mine = r.survivors.row.key;
	const srows = [
		['age40to50', 'אלמן או אלמנה בגיל 40 עד 50, בלי ילדים', am.age40to50], ['age50plus', 'בגיל 50 ומעלה, בלי ילדים', am.age50plus], ['age80plus', 'בגיל 80 ומעלה', am.age80plus],
		['kids1', 'עם ילד אחד', am.kid1], ['kids2', 'עם שני ילדים', am.kid2], ['extra', 'לכל ילד נוסף', am.kid_extra], ['half', 'מקבלי קצבת אזרח ותיק (מחצית)', am.half_old_age],
	];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-surv-h">קצבת שארים מהביטוח הלאומי, לחודש</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-surv-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מי</th><th scope="col">לחודש</th></tr></thead><tbody>`
		+ srows.map(([k, he, v]) => `<tr${k === mine || (mine === 'kids3' && k === 'extra') ? ` class="${P}-mine"` : ''}><td data-th="מי">${esc(he)}${k === mine ? ' (אתם)' : ''}</td><td data-th="לחודש">${ilsn(v)}</td></tr>`).join('')
		+ `<tr${mine === 'grant' ? ` class="${P}-mine"` : ''}><td data-th="מי">מתחת לגיל ${s.grant_under_age}, בלי ילדים${mine === 'grant' ? ' (אתם)' : ''}</td><td data-th="לחודש">${esc(s.grant_he)}: ${s.grant_pensions} קצבאות חודשיות${cite('מענק שאירים', s.grant_url)}</td></tr>`
		+ `</tbody><caption>הסכומים מ-${esc(isoToHe(s.amounts_from))}${cite('סכומי הקצבה', s.amounts_url)}. ${esc(s.supplements_he)}. ${esc(s.widower_he)} (התקרה: ${ilsn(s.widower_income_cap)} בחודש מ-${esc(isoToHe(s.widower_cap_from))}). ${esc(s.separated_he)}.</caption></table></div></div>`;
	// 5. The dates.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ r.deadlines.map((d) => `<tr><td data-th="תאריך"><bdi>${esc(isoToHe(d.date))}</bdi></td><td data-th="מה">${esc(d.he)}${d.kind === 'reminder' ? (d.picked ? ' (היום שבחרתם)' : ' (בעוד 30 ימים; אפשר לבחור יום)') : ''}</td><td data-th="מקור">${cite(d.section, d.url)}</td></tr>`).join('')
		+ `</tbody><caption>${r.deadlines.some((d) => d.kind === 'law') ? `${esc(fy.nii.claim.section)}: תביעה לגמלה תוך ${fy.nii.claim.months} חודשים; מענק: לפני שחלפו ${fy.nii.claim.grant_months} חודשים (${esc(fy.nii.claim.late_section)}).` : 'כל עוד שניכם בחיים אין לזכויות האלה מועד קבוע בחוק; התזכורת היא להכנת המסמכים.'}</caption></table></div></div>`;
	// 6. The documents.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">המסמכים שמוכיחים את החיים המשותפים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${bidiText(x)}</li>`).join('')}</ol><p class="${P}-list__src">הרשימה מתוך ${cite(`שאלון ${fy.nii.form_107} של הביטוח הלאומי`, fy.nii.form_107_url)}, ${esc(fy.nii.documents_section)}.</p></div>`;
	const info = r.flags.filter((f) => f.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שפועלים</h3></div><ul class="${P}-info">${info.map((f) => `<li>${bidiText(f.he)}</li>`).join('')}</ul></div>`; }
	out += `</div>`;
	return out + printHtml(reg, r);
}

/** Page section: married couples and cohabitants side by side, by the law, from the registry. */
export function compareTable(reg) {
	const fy = reg.fl_yeduim;
	const y = reg.yerusha;
	const pn = reg.prenup;
	const s = fy.nii.survivors;
	const rows = [
		['ירושה בלי צוואה', `החלק של בן זוג (${y.sections.spouse})`, `אותו חלק, אם אף אחד לא היה נשוי לאחר (${fy.succession.s55})`, fy.succession.url],
		['מזונות מן העיזבון', 'כן, כל זמן האלמנות (סעיף 57(א)(1))', `כן, באותו תנאי (${fy.succession.s57c})`, fy.succession.url],
		['ביטוח לאומי', 'בני זוג', `כמו נשואים אחרי הכרה; "אשתו" כוללת ידועה בציבור (${fy.nii.def_section})`, fy.nii.def_url],
		['קצבת שארים', `נשואים שנה לפחות (מגיל ${s.older_age}: חצי שנה), או ילד`, `שנה של מגורים תחת קורת גג אחת (מגיל ${s.older_age}: חצי שנה), או ילד לאלמנה (${s.section})`, s.url],
		['רכוש בפרידה', 'איזון משאבים לפי חוק יחסי ממון', `חזקת שיתוף שצריך להוכיח, בנטל כבד יותר (${fy.property.ruling_he})`, fy.property.ruling_url],
		['חיסכון פנסיוני', 'מתחלק בפסק דין', `אותו חוק (${fy.pension.split_section})`, fy.pension.split_url],
		['מזונות בין בני הזוג', `לפי הדין האישי (${fy.spousal.section} לחוק המזונות)`, 'אין בחוק; רק לפי הסכם', fy.spousal.url],
		['מס הכנסה', 'בן זוג רשום, חישוב נפרד או מאוחד', `כל אחד נישום לבד (${fy.tax.spouse_section})`, fy.tax.url],
		['ילדים', 'אפוטרופסים ומזונות', `אותו דין (${fy.children.guardian_section}; ${fy.children.maint_section})`, fy.children.capacity_url],
		['הסכם ביניכם', `הסכם ממון טעון אישור (${pn.sections.approval})`, `חוזה רגיל; אישור בבית המשפט לענייני משפחה ${nis(pn.routes.court.fee)}`, pn.routes.court.fee_url],
		['פרידה', 'גירושין', `אין הליך גירושין; מחלוקת בבית המשפט לענייני משפחה (${fy.family_court.section})`, fy.family_court.url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>נשואים מול ידועים בציבור, לפי החוק ופסיקת בית המשפט העליון (נבדק ${esc(isoToHe(fy.checked_on))})</caption><thead><tr><th scope="col">הנושא</th><th scope="col">נשואים</th><th scope="col">ידועים בציבור</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map(([t, m, c, u]) => `<tr><td data-th="הנושא">${esc(t)}</td><td data-th="נשואים">${esc(m)}</td><td data-th="ידועים בציבור">${esc(c)}</td><td data-th="מקור"><a href="${esc(u)}" target="_blank" rel="noopener">המקור</a></td></tr>`).join('')
		+ `</tbody></table></div>`;
}

/** Tests left to prove, by their names in the card's words. */
const LEAD_OPEN = { family: 'חיי משפחה', household: 'משק בית משותף', single: 'שאף אחד מכם לא נשוי לאחר', roof: 'שנה תחת קורת גג אחת', sharing: 'כוונת השיתוף בדירה' };

/** The result-first card at the top of the page ([justice_tool_lead]): the tests met of the example (or of the reader's own
 * answers once they change anything), the strongest right and what is left to prove, and a jump to the form. Same markup on
 * the server and in the browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי המקרה שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">מבחני ההוכחה של ידועים בציבור</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}מבחני ההוכחה של ידועים בציבור, ${Q_LABEL[r.question]}`;
	const inherit = r.lines.find((l) => l.key === 'inherit');
	const surv = r.survivors.amount ? `, וקצבת שארים ${money(r.survivors.amount, 0)} ₪ בחודש` : (r.survivors.state !== 'no' && r.survivors.row.grant ? `, ומענק שארים של ${r.survivors.row.pensions} קצבאות` : '');
	let strong;
	if (r.question === 'separation') {
		strong = 'בפרידה: חזקת השיתוף ברכוש (ע"א 52/80) וחלוקת הפנסיה בפסק דין; איזון משאבים לא חל';
	} else if (inherit && inherit.state === 'prove') {
		strong = `ירושה בלי צוואה כמו נשואים (סעיף 55)${surv}`;
	} else {
		strong = `ירושה רק בצוואה, כי אחד מכם נשוי לאחר (סעיף 55)${surv}`;
	}
	const open = r.tests.filter((t) => t.state === 'open').map((t) => LEAD_OPEN[t.key]);
	const not = r.tests.filter((t) => t.state === 'not').map((t) => LEAD_OPEN[t.key]);
	const left = open.length ? ` נשאר להוכיח: ${open.join(', ')}.` : ' כל המבחנים מתקיימים לפי מה שסימנתם; בבית המשפט מוכיחים אותם בראיות.';
	const line = `${strong}.${left}${not.length ? ` לא מתקיים: ${not.join(', ')}.` : ''}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${r.met}</bdi> מתוך <bdi>${r.applicable}</bdi></strong><span class="jtool-lead__unit">מבחנים מתקיימים</span></p>`
		+ `<p class="jtool-lead__line">${bidiText(line)}</p>${go}`;
}

export function snapshot(reg) {
	// The server snapshot is computed on the dataset's check day, so the build is the same on every day (build --check in CI);
	// the live page re-renders with today's date when it mounts.
	const r = compute(reg, Object.assign({}, EXAMPLE, { today: reg.fl_yeduim.checked_on }));
	const fy = reg.fl_yeduim;
	const aff = affidavitCost(reg);
	const row = survivorsRow(fy, EXAMPLE.age, EXAMPLE.kids);
	const rem = r.deadlines[0];
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.met,
		sticky: `<bdi>${r.met}</bdi> מתוך <bdi>${r.applicable}</bdi>`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>גרים יחד מ-${isoToHe(r.since)}: ${r.months} חודשים, ${durationHe(r)}</li>`
			+ `<li>המבחנים: משק בית משותף, אף אחד לא נשוי לאחר, ילד משותף ויותר מ-${fy.nii.survivors.min_months} חודשים תחת קורת גג אחת מתקיימים; כוונת השיתוף בדירה הרשומה על אחד מכם פתוחה: ${r.met} מתוך ${r.applicable}${cite(fy.succession.s55, fy.succession.url)}${cite(fy.nii.survivors.section, fy.nii.survivors.url)}${cite('ע"א 52/80', fy.property.ruling_url)}</li>`
			+ `<li>ירושה בלי צוואה: כמו בן זוג נשוי, מחצית כשיש ילדים או הורים${cite(fy.succession.s55, fy.succession.url)}${cite(reg.yerusha.sections.spouse, reg.yerusha.law_url)}</li>`
			+ `<li>קצבת שארים עם ילד אחד: ${money(row.amount, 0)} ₪ בחודש מ-${isoToHe(fy.nii.survivors.amounts_from)}${cite('סכומי הקצבה', fy.nii.survivors.amounts_url)}</li>`
			+ `<li>תצהיר משותף אצל נוטריון: <bdi>(${money(fy.notary.affidavit_first, 0)} + ${money(fy.notary.affidavit_additional, 0)}) × ${(100 + aff.vatPct) / 100} = ${money(aff.total)}</bdi> ₪${cite(fy.notary.item, fy.notary.url)}</li>`
			+ `<li>אישור הסכם בבית המשפט לענייני משפחה: ${money(reg.prenup.routes.court.fee, 0)} ₪${cite(reg.prenup.routes.court.fee_item, reg.prenup.routes.court.fee_url)}</li>`
			+ `<li>אין מועד קבוע בחוק כל עוד שניכם בחיים: תזכורת להכין את המסמכים ב-${isoToHe(rem.date)}${cite(fy.nii.documents_section, fy.nii.form_107_page)}</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
		brief: aiBrief(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	return {
		question: radio('q', 'daily'), since: val(`#${P}-since`).trim(), household: radio('hh', '1') === '1', kids: Number(radio('kd', '0')),
		married: radio('mr', '0') === '1', home: radio('ho', 'none'), age: radio('ag', '40to50'), family: radio('fm', 'kids'),
		died: val(`#${P}-died`).trim(), remind: val(`#${P}-remind`).trim(), today: ilToday(),
	};
}

const QM = { daily: 'd', separation: 's', death: 'x' };
const HM = { none: 'n', one: 'o', both: 'b' };
const AM = { u40: 'a', '40to50': 'b', '50to55': 'c', '55to80': 'e', '80p': 'f' };
const FM = { kids: 'k', parents: 'p', siblings: 's', none: 'n' };
const keyOf = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
const isoOrEmpty = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? v : '');
export function stateOf(i) {
	const death = i.question === 'death';
	return encodeState({
		q: QM[i.question] || 'd', s: isoOrEmpty(i.since) || String(i.since || '').replace(/[./]/g, '-'), h: i.household === false ? 0 : '', k: Number(i.kids) || '',
		m: i.married ? 1 : '', o: HM[i.home] || 'n', a: death ? AM[i.age] : '', f: death ? FM[i.family] : '',
		d: death ? isoOrEmpty(i.died) || String(i.died || '').replace(/[./]/g, '-') : '', r: isoOrEmpty(i.remind) || String(i.remind || '').replace(/[./]/g, '-'),
	});
}
export const KEYS = ['q', 's', 'h', 'k', 'm', 'o', 'a', 'f', 'd', 'r'];
export function inputOf(s) {
	if (!s.s) { return null; }
	const dm = (v) => { const m = String(v || '').match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/); return m ? `${m[1]}.${m[2]}.${m[3]}` : (v || ''); };
	return {
		question: keyOf(QM, s.q, 'daily'), since: dm(s.s), household: s.h !== '0', kids: s.k ? Math.min(3, Number(s.k) || 0) : 0, married: s.m === '1',
		home: keyOf(HM, s.o, 'none'), age: keyOf(AM, s.a, '40to50'), family: keyOf(FM, s.f, 'kids'), died: dm(s.d), remind: dm(s.r),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	let own = false;
	const fy = reg.fl_yeduim;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(fy.checked_on, fy.refresh_every_days) || (fy.next_update && today >= fy.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו ב-1 בינואר'); }
	}
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
		const q = (root.querySelector(`input[name="${P}-q"]:checked`) || {}).value || 'daily';
		const died = ((root.querySelector(`#${P}-died`) || {}).value || '').trim();
		form.querySelectorAll('[data-if-death]').forEach((el) => { el.hidden = q !== 'death'; });
		form.querySelectorAll('[data-if-remind]').forEach((el) => { el.hidden = q === 'death' && died !== ''; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${r.met}</bdi> מתוך <bdi>${r.applicable}</bdi>` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.question}-${r.met}` }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(Object.assign({}, fromHash, { today }), { silent: true });
	} else {
		// The server snapshot was computed on the build day: the months together and the reminder move with today.
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	// The card's jump: to the form, first field focused (the page anchor is the fallback without the script).
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector('input:not([type="radio"]):not([type="checkbox"])');
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	// The reader's own answers from the first change on: the card says "החישוב שלכם".
	const mine = () => { own = true; };
	form.addEventListener('input', mine, true);
	form.addEventListener('change', mine, true);
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const btn = ev.target.closest('[data-act]');
		if (!btn) { return; }
		const act = btn.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('yeduim-batzibur.ics', 'text/calendar;charset=utf-8', ics(icsEvents(reg, r), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklistText(reg, r));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			if (r.ok) { details.innerHTML = renderDetails(reg, r); }
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · נבדק ב-jus-tice.co.il לפי חוק הירושה וחוק הביטוח הלאומי ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (נבדק ב-jus-tice.co.il, ${isoToHe(fy.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// One window handoff with the scenario (sim-handoff.js); a blocked popup falls back to the anchor and the clipboard.
			const brief = r.ok ? aiBrief(reg, r) : '';
			const pm = String(btn.getAttribute('href') || '').match(/purpose=([a-z_]+)/);
			const purpose = pm ? pm[1] : CATALOG_PURPOSE;
			if (brief && openSimulation(brief, purpose, btn.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.question : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; form.innerHTML = renderForm(reg, s); sync(); run(Object.assign({}, s, { today })); }
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
