#!/usr/bin/env node
/**
 * Build the co.il tools (HAD-485 wave 1, HAD-490 wave 2, HAD-498 wave 3, HAD-502 wave 4, HAD-504 wave 5, HAD-506 family
 * law, the inheritance wave, the rights waves HAD-574, HAD-578 and HAD-585, the family + land wave HAD-579, the labor
 * wave, the road-accident and personal-injury wave HAD-591, the consumer-law wave HAD-593, the medical-malpractice wave
 * HAD-594) from their ES-module sources.
 *
 *   node tools/build-justice-tools.mjs          write the bundles and the server snapshots
 *   node tools/build-justice-tools.mjs --check  fail when a committed file is out of date (CI)
 *
 * 1. assets/js/tools/dist/<tool>.js: one classic script per tool (instrument + engine + UI),
 *    so the page loads a single versioned file (?ver=) that Autoptimize and old browsers handle.
 * 2. assets/data/justice-tools-snapshots.json: the example result rendered by the SAME renderers
 *    the page runs, for the server HTML (crawlers and AI bots see a real answer before any JS).
 * Both are derived from assets/data/justice-tools-registry.json; a registry refresh without a
 * rebuild fails CI, so a page can never show a number the registry does not hold.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets/js/tools');
const CHECK = process.argv.includes('--check');

const TOOLS = {
	hatzmada: ['instrument.js', 'hatzmada-engine.js', 'hatzmada-ui.js'],
	'sachar-minimum': ['instrument.js', 'minwage-engine.js', 'minwage-ui.js'],
	havraa: ['instrument.js', 'havraa-engine.js', 'havraa-ui.js'],
	// The consumer-law wave (HAD-593) added the claim against a business and the window handoff (sim-handoff.js). The engine
	// keeps its own date helpers (addDays, parseDate), so dates.js is not bundled next to it.
	'tviot-ktanot': ['instrument.js', 'sim-handoff.js', 'tviot-engine.js', 'tviot-ui.js'],
	yerusha: ['instrument.js', 'yerusha-engine.js', 'yerusha-ui.js'],
	'mas-rechisha': ['instrument.js', 'rechisha-engine.js', 'rechisha-ui.js'],
	'hetel-hashbacha': ['instrument.js', 'hashbacha-engine.js', 'hashbacha-ui.js'],
	// Wave 4 (HAD-502): dates.js is the calendar shared by the wave-4 engines.
	tzavaa: ['instrument.js', 'tzavaa-engine.js', 'tzavaa-ui.js'],
	// The injury wave (HAD-591) added the claim ledger, the future loss, the lead card and the window handoff.
	'teunat-drachim': ['instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js', 'teuna-ui.js'],
	gerushin: ['instrument.js', 'dates.js', 'gerushin-engine.js', 'gerushin-ui.js'],
	// Wave 5 (HAD-504): a rental-contract generator, severance and notice, capital gains on a home.
	'chozeh-schirut': ['instrument.js', 'dates.js', 'word-document.js', 'schirut-engine.js', 'schirut-ui.js'],
	// The labor wave (22.10.2026) added the payslip components, the pension-deposit check and the window handoff.
	pitzuyim: ['instrument.js', 'sim-handoff.js', 'dates.js', 'pitzuyim-engine.js', 'pitzuyim-ui.js'],
	'mas-shevach': ['instrument.js', 'dates.js', 'shevach-engine.js', 'shevach-ui.js'],
	// Family law (HAD-506): family-common.js holds the helpers the family engines share. The agreement generator bundles
	// the child-support and balancing engines, so its clauses carry the same numbers as those tools.
	mezonot: ['instrument.js', 'dates.js', 'family-common.js', 'mezonot-engine.js', 'mezonot-ui.js'],
	izun: ['instrument.js', 'dates.js', 'family-common.js', 'izun-engine.js', 'izun-ui.js'],
	'heskem-mamon': ['instrument.js', 'dates.js', 'family-common.js', 'mamon-engine.js', 'mamon-ui.js'],
	'heskem-gerushin': ['instrument.js', 'dates.js', 'family-common.js', 'mezonot-engine.js', 'izun-engine.js', 'horut-engine.js', 'heskem-engine.js', 'heskem-ui.js'],
	// The divorce world (HAD-539): the custody calendar reuses the parenting engine's holidays; the tracker reuses the
	// wave-1 linkage and interest engine (so dates.js is not bundled next to it: both export parseDate and addMonths);
	// the roadmap reuses the wave-4 divorce engine's fees and clock.
	'luach-shahut': ['instrument.js', 'dates.js', 'family-common.js', 'horut-engine.js', 'luach-engine.js', 'luach-ui.js'],
	'maakav-mezonot': ['instrument.js', 'hatzmada-engine.js', 'family-common.js', 'maakav-engine.js', 'maakav-ui.js'],
	'mapat-gerushin': ['instrument.js', 'dates.js', 'gerushin-engine.js', 'mapat-engine.js', 'mapat-ui.js'],
	// The inheritance wave (21.10.2026): the request planner and the dispute navigator share dates.js with wave 4.
	'tzav-yerusha': ['instrument.js', 'dates.js', 'tzav-engine.js', 'tzav-ui.js'],
	'sichsuch-yerusha': ['instrument.js', 'dates.js', 'sichsuch-engine.js', 'sichsuch-ui.js'],
	histalkut: ['instrument.js', 'histalkut-engine.js', 'histalkut-ui.js'],
	'heskem-yorshim': ['instrument.js', 'heskem-yorshim-engine.js', 'heskem-yorshim-ui.js'],
	hitnagdut: ['instrument.js', 'dates.js', 'hitnagdut-engine.js', 'hitnagdut-ui.js'],
	// The rights wave (21.10.2026, HAD-574): the two tax instruments share mas-engine.js (the tax years and the points).
	'dmei-bituach': ['instrument.js', 'bituach-engine.js', 'bituach-ui.js'],
	'nekudot-zikui': ['instrument.js', 'dates.js', 'mas-engine.js', 'zikui-ui.js'],
	'hechzer-mas': ['instrument.js', 'dates.js', 'mas-engine.js', 'hechzer-ui.js'],
	'dmei-avtala': ['instrument.js', 'dates.js', 'avtala-engine.js', 'avtala-ui.js'],
	'dmei-leida': ['instrument.js', 'dates.js', 'leida-engine.js', 'leida-ui.js'],
	'kitzbat-nechut': ['instrument.js', 'dates.js', 'nechut-engine.js', 'nechut-ui.js'],
	// The rights wave 2A (22.10.2026, HAD-578): the work grant, and gross to net on the wave-1 tax engine. sim-handoff.js
	// hands the result to the jus-tice.com simulation (the one-time window handoff, never a URL).
	'maanak-avoda': ['instrument.js', 'sim-handoff.js', 'maanak-engine.js', 'maanak-ui.js'],
	'sachar-neto': ['instrument.js', 'dates.js', 'mas-engine.js', 'sim-handoff.js', 'neto-engine.js', 'neto-ui.js'],
	// The family + land wave (21-22.10.2026, HAD-579): each instrument reuses the engines it builds on.
	'agrot-rabanut': ['instrument.js', 'sim-handoff.js', 'dates.js', 'gerushin-engine.js', 'rabanut-engine.js', 'rabanut-ui.js'],
	mishmoret: ['instrument.js', 'sim-handoff.js', 'dates.js', 'family-common.js', 'horut-engine.js', 'luach-engine.js', 'mezonot-engine.js', 'mishmoret-engine.js', 'mishmoret-ui.js'],
	'yishuv-sichsuch': ['instrument.js', 'sim-handoff.js', 'dates.js', 'sichsuch-fl-engine.js', 'sichsuch-fl-ui.js'],
	'yeduim-batzibur': ['instrument.js', 'sim-handoff.js', 'dates.js', 'yeduim-engine.js', 'yeduim-ui.js'],
	'alut-iska': ['instrument.js', 'sim-handoff.js', 'rechisha-engine.js', 'iska-engine.js', 'iska-ui.js'],
	'dira-mikablan': ['instrument.js', 'sim-handoff.js', 'dates.js', 'kablan-engine.js', 'kablan-ui.js'],
	// The rights wave 2B (22.10.2026, HAD-585): reserve duty, children, income support (and old age), each with the wave-2A
	// simulation hand-off.
	'tagmulei-miluim': ['instrument.js', 'sim-handoff.js', 'dates.js', 'miluim-engine.js', 'miluim-ui.js'],
	'kitzbat-yeladim': ['instrument.js', 'sim-handoff.js', 'dates.js', 'yeladim-engine.js', 'yeladim-ui.js'],
	'havtachat-hachnasa': ['instrument.js', 'sim-handoff.js', 'dates.js', 'havtacha-engine.js', 'havtacha-ui.js'],
	'kitzbat-zikna': ['instrument.js', 'sim-handoff.js', 'dates.js', 'zikna-engine.js', 'zikna-ui.js'],
	// The labor wave (22.10.2026): the notice instrument reuses the severance engine's service span; annual leave and
	// overtime stand alone.
	'hodaa-mukdemet': ['instrument.js', 'sim-handoff.js', 'dates.js', 'pitzuyim-engine.js', 'hodaa-engine.js', 'hodaa-ui.js'],
	'chufsha-shnatit': ['instrument.js', 'sim-handoff.js', 'chufsha-engine.js', 'chufsha-ui.js'],
	'shaot-nosafot': ['instrument.js', 'sim-handoff.js', 'dates.js', 'nosafot-engine.js', 'nosafot-ui.js'],
	// The final settlement reuses the severance, recuperation (in its own scope: it has its own compute() and date
	// helpers) and annual-leave engines, so its lines equal what each sibling page computes.
	'gmar-cheshbon': ['instrument.js', 'sim-handoff.js', 'dates.js', 'pitzuyim-engine.js', 'havraa-engine.js as HV', 'chufsha-engine.js', 'gmar-engine.js', 'gmar-ui.js'],
	// The road-accident and personal-injury wave (22.10.2026, HAD-591): the work-injury journey stands alone; the disability
	// degree and the injured person's clock read the road engine (nonPecuniary, limitation) in its own scope, as TE.
	'teunat-avoda': ['instrument.js', 'sim-handoff.js', 'dates.js', 'avoda-engine.js', 'avoda-ui.js'],
	'shiklul-nechut': ['instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'shiklul-engine.js', 'shiklul-ui.js'],
	'shaon-nezikin': ['instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'shaon-engine.js', 'shaon-ui.js'],
	// The consumer-law wave (22.10.2026, HAD-593): the cancellation-rights checker stands alone; the flight instrument reuses
	// the road engine's limitation() (the war window, rest days) as TE and the small-claims engine's ceilingOn() and fee() as
	// TV; the remedy calculator reuses the CPI and interest engine as HZ (it has its own parseDate and addMonths), each in its
	// own scope.
	'bitul-iska': ['instrument.js', 'sim-handoff.js', 'dates.js', 'bitul-engine.js', 'bitul-ui.js'],
	'pitzui-tisa': ['instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'tviot-engine.js as TV', 'tisa-engine.js', 'tisa-ui.js'],
	'pitzui-tzarchan': ['instrument.js', 'sim-handoff.js', 'dates.js', 'hatzmada-engine.js as HZ', 'pitzui-engine.js', 'pitzui-ui.js'],
	// The medical-malpractice wave (22.10.2026, HAD-594): the case check and the clock read the road engine's limitation()
	// in its own scope, as TE; the records request writes its letter through word-document.js.
	'tik-rashlanut': ['instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'tik-engine.js', 'tik-ui.js'],
	'bakashat-reshuma': ['instrument.js', 'sim-handoff.js', 'dates.js', 'word-document.js', 'reshuma-engine.js', 'reshuma-ui.js'],
	'shaon-refui': ['instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'hityashnut-engine.js', 'hityashnut-ui.js'],
	'alut-tviaa-refuit': ['instrument.js', 'sim-handoff.js', 'dates.js', 'mechir-engine.js', 'mechir-ui.js'],
};

function strip(code) {
	return code
		.replace(/^import\s[\s\S]*?from\s+'[^']+';\s*$/gm, '')
		.replace(/^export\s+(async\s+function|function|const|let|class)\s/gm, '$1 ');
}

// An entry 'x-engine.js as NS' bundles that module in its own scope, as the namespace object NS (what
// `import * as NS from './x-engine.js'` gives the module source). The labor wave needs it: the recuperation engine
// exports compute() and its own date helpers, which would collide with the severance engine and dates.js.
function part(entry) {
	const [f, ns] = entry.split(' as ');
	const raw = readFileSync(join(SRC, f), 'utf8').split(String.fromCharCode(13)).join('');
	const code = strip(raw).trim();
	if (!ns) { return `/* ---- ${f} ---- */\n${code}\n`; }
	const names = [...raw.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
	return `/* ---- ${f} (as ${ns}) ---- */\nconst ${ns} = (function () {\n${code}\nreturn { ${names.map((n) => `${n}: ${n}`).join(', ')} };\n})();\n`;
}

function bundle(tool, files) {
	const body = files.map(part).join('\n');
	return `/* Generated by tools/build-justice-tools.mjs from assets/js/tools/{${files.map((f) => f.split(' as ')[0]).join(',')}}. Do not edit. */\n`
		+ `(function () {\n'use strict';\n${body}\n`
		+ `function boot() {\n\tdocument.querySelectorAll('[data-jtool="${tool}"]').forEach(function (root) {\n`
		+ `\t\tif (root.getAttribute('data-jtool-ready')) { return; }\n`
		+ `\t\tvar data = document.getElementById(root.getAttribute('data-jtool-data'));\n`
		+ `\t\tif (!data) { return; }\n`
		+ `\t\ttry { mount(root, JSON.parse(data.textContent)); } catch (e) { root.setAttribute('data-jtool-error', '1'); if (window.console) { window.console.error(e); } }\n`
		+ `\t});\n}\n`
		+ `window.JusticeTools = window.JusticeTools || {};\nwindow.JusticeTools[${JSON.stringify(tool)}] = { mount: mount, boot: boot };\n`
		+ `if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }\n})();\n`;
}

const outputs = {};
for (const [tool, files] of Object.entries(TOOLS)) {
	outputs[`assets/js/tools/dist/${tool}.js`] = bundle(tool, files);
}

const registry = JSON.parse(readFileSync(join(ROOT, 'assets/data/justice-tools-registry.json'), 'utf8'));
const t04 = await import(pathToFileURL(join(SRC, 'hatzmada-ui.js')).href);
const t02 = await import(pathToFileURL(join(SRC, 'minwage-ui.js')).href);
const t03 = await import(pathToFileURL(join(SRC, 'havraa-ui.js')).href);
const t05 = await import(pathToFileURL(join(SRC, 'tviot-ui.js')).href);
const w3y = await import(pathToFileURL(join(SRC, 'yerusha-ui.js')).href);
const w3r = await import(pathToFileURL(join(SRC, 'rechisha-ui.js')).href);
const w3h = await import(pathToFileURL(join(SRC, 'hashbacha-ui.js')).href);
const w4w = await import(pathToFileURL(join(SRC, 'tzavaa-ui.js')).href);
const w4c = await import(pathToFileURL(join(SRC, 'teuna-ui.js')).href);
const w4d = await import(pathToFileURL(join(SRC, 'gerushin-ui.js')).href);
const w5r = await import(pathToFileURL(join(SRC, 'schirut-ui.js')).href);
const w5p = await import(pathToFileURL(join(SRC, 'pitzuyim-ui.js')).href);
const w5s = await import(pathToFileURL(join(SRC, 'shevach-ui.js')).href);
const fmz = await import(pathToFileURL(join(SRC, 'mezonot-ui.js')).href);
const fiz = await import(pathToFileURL(join(SRC, 'izun-ui.js')).href);
const fmm = await import(pathToFileURL(join(SRC, 'mamon-ui.js')).href);
const fhk = await import(pathToFileURL(join(SRC, 'heskem-ui.js')).href);
const dwl = await import(pathToFileURL(join(SRC, 'luach-ui.js')).href);
const dwm = await import(pathToFileURL(join(SRC, 'maakav-ui.js')).href);
const dwr = await import(pathToFileURL(join(SRC, 'mapat-ui.js')).href);
const ihT = await import(pathToFileURL(join(SRC, 'tzav-ui.js')).href);
const ihS = await import(pathToFileURL(join(SRC, 'sichsuch-ui.js')).href);
const ihH = await import(pathToFileURL(join(SRC, 'histalkut-ui.js')).href);
const ihA = await import(pathToFileURL(join(SRC, 'heskem-yorshim-ui.js')).href);
const ihO = await import(pathToFileURL(join(SRC, 'hitnagdut-ui.js')).href);
const rtB = await import(pathToFileURL(join(SRC, 'bituach-ui.js')).href);
const rtZ = await import(pathToFileURL(join(SRC, 'zikui-ui.js')).href);
const rtH = await import(pathToFileURL(join(SRC, 'hechzer-ui.js')).href);
const rtA = await import(pathToFileURL(join(SRC, 'avtala-ui.js')).href);
const rtL = await import(pathToFileURL(join(SRC, 'leida-ui.js')).href);
const rtN = await import(pathToFileURL(join(SRC, 'nechut-ui.js')).href);
const r2M = await import(pathToFileURL(join(SRC, 'maanak-ui.js')).href);
const r2N = await import(pathToFileURL(join(SRC, 'neto-ui.js')).href);
const fl0 = await import(pathToFileURL(join(SRC, 'rabanut-ui.js')).href);
const fl1 = await import(pathToFileURL(join(SRC, 'mishmoret-ui.js')).href);
const fl2 = await import(pathToFileURL(join(SRC, 'sichsuch-fl-ui.js')).href);
const fl3 = await import(pathToFileURL(join(SRC, 'yeduim-ui.js')).href);
const fl4 = await import(pathToFileURL(join(SRC, 'iska-ui.js')).href);
const fl5 = await import(pathToFileURL(join(SRC, 'kablan-ui.js')).href);
const r2bM = await import(pathToFileURL(join(SRC, 'miluim-ui.js')).href);
const r2bY = await import(pathToFileURL(join(SRC, 'yeladim-ui.js')).href);
const r2bH = await import(pathToFileURL(join(SRC, 'havtacha-ui.js')).href);
const r2bZ = await import(pathToFileURL(join(SRC, 'zikna-ui.js')).href);
const lbH = await import(pathToFileURL(join(SRC, 'hodaa-ui.js')).href);
const lbC = await import(pathToFileURL(join(SRC, 'chufsha-ui.js')).href);
const lbN = await import(pathToFileURL(join(SRC, 'nosafot-ui.js')).href);
const lbG = await import(pathToFileURL(join(SRC, 'gmar-ui.js')).href);
const ijA = await import(pathToFileURL(join(SRC, 'avoda-ui.js')).href);
const ijS = await import(pathToFileURL(join(SRC, 'shiklul-ui.js')).href);
const ijN = await import(pathToFileURL(join(SRC, 'shaon-ui.js')).href);
const csB = await import(pathToFileURL(join(SRC, 'bitul-ui.js')).href);
const csT = await import(pathToFileURL(join(SRC, 'tisa-ui.js')).href);
const csP = await import(pathToFileURL(join(SRC, 'pitzui-ui.js')).href);
const mpT = await import(pathToFileURL(join(SRC, 'tik-ui.js')).href);
const mpR = await import(pathToFileURL(join(SRC, 'reshuma-ui.js')).href);
const mpH = await import(pathToFileURL(join(SRC, 'hityashnut-ui.js')).href);
const mpM = await import(pathToFileURL(join(SRC, 'mechir-ui.js')).href);
const snapshots = {
	registry_version: registry.registry_version,
	hatzmada: t04.snapshot(registry),
	'sachar-minimum': t02.snapshot(registry),
	havraa: t03.snapshot(registry),
	'tviot-ktanot': t05.snapshot(registry),
	yerusha: w3y.snapshot(registry),
	'mas-rechisha': w3r.snapshot(registry),
	'hetel-hashbacha': w3h.snapshot(registry),
	tzavaa: w4w.snapshot(registry),
	'teunat-drachim': w4c.snapshot(registry),
	gerushin: w4d.snapshot(registry),
	'chozeh-schirut': w5r.snapshot(registry),
	pitzuyim: w5p.snapshot(registry),
	'mas-shevach': w5s.snapshot(registry),
	mezonot: fmz.snapshot(registry),
	izun: fiz.snapshot(registry),
	'heskem-mamon': fmm.snapshot(registry),
	'heskem-gerushin': fhk.snapshot(registry),
	'luach-shahut': dwl.snapshot(registry),
	'maakav-mezonot': dwm.snapshot(registry),
	'mapat-gerushin': dwr.snapshot(registry),
	'tzav-yerusha': ihT.snapshot(registry),
	'sichsuch-yerusha': ihS.snapshot(registry),
	histalkut: ihH.snapshot(registry),
	'heskem-yorshim': ihA.snapshot(registry),
	hitnagdut: ihO.snapshot(registry),
	'dmei-bituach': rtB.snapshot(registry),
	'nekudot-zikui': rtZ.snapshot(registry),
	'hechzer-mas': rtH.snapshot(registry),
	'dmei-avtala': rtA.snapshot(registry),
	'dmei-leida': rtL.snapshot(registry),
	'kitzbat-nechut': rtN.snapshot(registry),
	'maanak-avoda': r2M.snapshot(registry),
	'sachar-neto': r2N.snapshot(registry),
	'agrot-rabanut': fl0.snapshot(registry),
	mishmoret: fl1.snapshot(registry),
	'yishuv-sichsuch': fl2.snapshot(registry),
	'yeduim-batzibur': fl3.snapshot(registry),
	'alut-iska': fl4.snapshot(registry),
	'dira-mikablan': fl5.snapshot(registry),
	'tagmulei-miluim': r2bM.snapshot(registry),
	'kitzbat-yeladim': r2bY.snapshot(registry),
	'havtachat-hachnasa': r2bH.snapshot(registry),
	'kitzbat-zikna': r2bZ.snapshot(registry),
	'hodaa-mukdemet': lbH.snapshot(registry),
	'chufsha-shnatit': lbC.snapshot(registry),
	'shaot-nosafot': lbN.snapshot(registry),
	'gmar-cheshbon': lbG.snapshot(registry),
	'teunat-avoda': ijA.snapshot(registry),
	'shiklul-nechut': ijS.snapshot(registry),
	'shaon-nezikin': ijN.snapshot(registry),
	'bitul-iska': csB.snapshot(registry),
	'pitzui-tisa': csT.snapshot(registry),
	'pitzui-tzarchan': csP.snapshot(registry),
	'tik-rashlanut': mpT.snapshot(registry),
	'bakashat-reshuma': mpR.snapshot(registry),
	'shaon-refui': mpH.snapshot(registry),
	'alut-tviaa-refuit': mpM.snapshot(registry),
};
outputs['assets/data/justice-tools-snapshots.json'] = `${JSON.stringify(snapshots, null, 1)}\n`;

let stale = 0;
for (const [rel, text] of Object.entries(outputs)) {
	const path = join(ROOT, rel);
	let current = null;
	try { current = readFileSync(path, 'utf8').split(String.fromCharCode(13)).join(''); } catch (e) { current = null; }
	if (CHECK) {
		if (current !== text) { console.error(`out of date: ${rel} (run node tools/build-justice-tools.mjs)`); stale += 1; }
	} else if (current !== text) {
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, text);
		console.log(`wrote ${rel}`);
	}
}
if (CHECK && stale) { process.exit(1); }
if (CHECK) { console.log('justice tools build: up to date'); }
