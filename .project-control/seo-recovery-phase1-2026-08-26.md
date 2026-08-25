# SEO Recovery Phase 1 — 2026-08-26

## Objective

Freeze automatic page creation, remove the confirmed redirect loop, make
cluster links prefer canonical root pillars, preserve rollback evidence, and
prepare the first 40 low-value URLs for a controlled 410 decision.

## Live baseline captured before deployment

- `justice-ops` live version: `2.35.18`.
- Theme live version: `2.23.1`.
- Homepage, robots, sitemap index, and four protected money pages return 200.
- `/recommended-jus-tice-team-lawyer/` returns a self-targeting 301 loop.
- Fake URLs and invalid post IDs return a genuine themed 404; the old blanket
  homepage-redirect behavior is not active.
- News engine reports `enabled: 1`.
- Encyclopedia writer reports `enabled: 1`, 102 draft skeletons, and one
  scheduled entry.

Evidence directory:

`C:\Users\777\Documents\GSC-Data\jus-tice.co.il\2025-04-25_2026-08-25\phase-1-evidence-2026-08-26`

## Code changes prepared

1. `justice-ops` 2.35.19 adds a fail-closed, reversible automatic-content
   freeze (`justice_automatic_content_paused`, default `1`).
2. Hourly news, encyclopedia, article-writer, and weekly city-page generation
   do not run while the freeze is active.
3. Scheduled `justice_term` entries are moved back to draft once. The previous
   IDs and schedule dates are retained in
   `justice_phase1_content_freeze_applied_v1` for rollback.
4. A public, non-sensitive proof endpoint is added at
   `/wp-json/justice-ops/v1/phase1-freeze-status`.
5. The known self-redirect entry is removed. A generic self-target guard fails
   closed if another bad mapping is introduced later.
6. The content-cluster resolver now checks `page`, then `post`, then
   `articles`, so root pillars beat same-slug article copies.

## Wave-1 410 gate

The 40 `WAVE_1_24H_SAFETY_GATE` candidates were checked live on 2026-08-26:

- 40/40 currently return HTTP 200.
- 40/40 are still present in a live sitemap.
- 40/40 pass the public-data gate: zero clicks, zero GSC link targets, zero
  public REST inlinks, and no protected money page.
- 0/40 are authorized for live 410 yet.

The following private gates remain mandatory before a 410 is published:

1. No attributable lead in WordPress/CRM history.
2. No material recent human/server-log demand.
3. Full host database and media backup, not only a Git code bundle.

Do not convert a pending candidate into a 410 merely because its public gate
passes. Remove approved URLs from every sitemap/internal link source before
serving an exact 410. Do not add a 301 for these retirements.

## Protected money-page allowlist

These pages are never eligible for the wave-1 retirement map:

- `/divorce-lawyer/`
- `/criminal-defense-attorney/`
- `/real-estate-attorney/`
- `/medical-malpractice-lawyer/`

## Verification completed locally

- PHP syntax checks passed on all touched PHP files.
- Full standalone PHP test suite passed.
- New tests cover content freeze idempotence, deterministic pillar resolution,
  and legacy redirect self-loop prevention.
- Plugin ZIP `plugin-dist/justice-ops-2.35.19.zip` builds and reopens
  successfully with normalized archive paths.

## Deployment and rollback

Deployment is not complete until the live healthcheck shows 2.35.19 and the
rendered live routes are verified.

After deployment verify:

1. `/wp-json/justice-ops/v1/healthcheck` reports 2.35.19 and
   `automatic_content_paused: true`.
2. `/wp-json/justice-ops/v1/phase1-freeze-status` reports the phase-1 marker.
3. News and encyclopedia status report the automatic pause.
4. The scheduled encyclopedia count is zero.
5. `/recommended-jus-tice-team-lawyer/` no longer loops.
6. The four protected money pages remain 200.
7. Fake URLs remain exact 404 and do not render the homepage.

Rollback:

- Plugin: reinstall 2.35.18 and set `justice_automatic_content_paused` to `0`
  only after the audit owner approves restarting automation.
- Scheduled term: restore the saved `post_date`, `post_date_gmt`, and `future`
  status from the snapshot option.
- Theme: restore the pre-phase-1 Git commit and use the documented uPress Git
  pull route; then purge caches and repeat rendered verification.
