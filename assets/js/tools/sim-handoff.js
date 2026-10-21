/**
 * The rights wave 2A (22.10.2026, HAD-578): one click from a tool's result into the jus-tice.com AI simulation, with the
 * reader's scenario already written in the first box.
 *
 * The simulation never accepts a case story from a URL (articleSimulationEntry.ts: "Never accept a case story or personal
 * details from a URL"). It does accept a one-time window handoff from https://jus-tice.co.il (windowHandoff.ts,
 * HANDOFF_VERSION 'hadmaya:window:v1'): the portal opens #/simulation?handoff=<uuid>&from=<origin>, the new window says
 * 'ready', the portal posts 'deliver' with an intake-phase state, and the window answers 'accepted'. The scenario travels
 * by postMessage only, never in the URL, the server or analytics; it holds the tool's figures, never a name or an ID.
 * When a popup is blocked or the protocol is unavailable, the plain topic link (the anchor's href) opens instead.
 */

export const SIM_ORIGIN = 'https://jus-tice.com';
export const SIM_TYPE = 'hadmaya:window:v1';

const uuid4 = () => {
	try {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') { return crypto.randomUUID(); }
	} catch (e) { /* fall through */ }
	return '';
};

/** The intake state the simulation's parseHandoff() accepts (phase 'intake', Hebrew, no chat yet). */
export function handoffState(sessionId, description, purpose) {
	return {
		sessionId, description: String(description || '').slice(0, 4000), locale: 'he', phase: 'intake', intensity: 'medium',
		judgePersona: 'procedural', simulationPurpose: purpose, userRole: 'observer', voiceEnabled: true, sources: [],
		chatHistory: [], casePreview: null, caseData: null,
	};
}

/** Opens the simulation with the scenario. Returns false when the caller should follow the plain link instead. */
export function openSimulation(description, purpose, fallbackHref) {
	if (typeof window === 'undefined') { return false; }
	const nonce = uuid4();
	const sessionId = uuid4();
	if (!nonce || !sessionId || window.location.origin.indexOf('jus-tice.co.il') === -1) { return false; }
	const url = `${SIM_ORIGIN}/#/simulation?handoff=${nonce}&from=${encodeURIComponent(window.location.origin)}`;
	let popup = null;
	try { popup = window.open(url, '_blank'); } catch (e) { popup = null; }
	if (!popup) { return false; }
	const state = handoffState(sessionId, description, purpose);
	let done = false;
	const stop = () => { done = true; window.removeEventListener('message', onMessage); clearTimeout(timer); };
	function onMessage(ev) {
		if (done || ev.origin !== SIM_ORIGIN || ev.source !== popup) { return; }
		const d = ev.data;
		if (!d || d.type !== SIM_TYPE || d.nonce !== nonce) { return; }
		if (d.action === 'ready') {
			popup.postMessage({ type: SIM_TYPE, action: 'deliver', nonce, payload: { state, checkpoint: null } }, SIM_ORIGIN);
		} else if (d.action === 'accepted') {
			stop();
		}
	}
	window.addEventListener('message', onMessage);
	// The simulation gives up after 30 s and opens an empty intake; the topic link stays one click away.
	const timer = setTimeout(() => { if (!done) { stop(); if (fallbackHref && popup && !popup.closed) { try { popup.location.href = fallbackHref; } catch (e) { /* cross-origin */ } } } }, 30000);
	return true;
}
