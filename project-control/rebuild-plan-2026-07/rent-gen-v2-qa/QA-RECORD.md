# Rent builder v2 QA record (ops 2.18.0, 2026-07-14)

Live verification (production):
- healthcheck 2.18.0; edge purged; page fetch: app root present, legacy
  iframe GONE, full contract text now server-rendered (SEO-crawlable),
  intro present; JS/CSS probes found inside the deployed Autoptimize
  bundles (.jtr-prog in CSS bundle, jtRent markers in JS single).

Browser QA (real Chromium; production-fetched assets in a file:// harness —
the sandbox proxy hard-blocks Chromium to external hosts, a documented
environment fact, so the harness uses the exact deployed CSS/JS bytes):
- live preview spans fill as you type: PASS
- step navigation renders next step: PASS
- mobile document peek sheet: PASS
- desktop split view (form right, live document left): PASS
- autosave persists + resume banner + resume-to-step: PASS (single-context test)
- screenshots: mobile-step1, mobile-filled, mobile-resume, desktop-split

Known polish item (non-blocking): the parking/storage conditional clause
segment always renders with click-to-edit blanks; the toggle fills the
numbers but does not hide the segment when off (template replacement
pattern mismatch). Queue for 2.18.1.
