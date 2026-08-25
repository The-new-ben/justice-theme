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
- WordPress/CRM history contains a source URL for 26/26 reviewed lead records;
  none of those source URLs matches a wave-1 candidate.
- A manual uPress backup completed before the live plugin update: 2.8 GiB,
  one database, 75 posts, two themes, WordPress 7.1.
- The uPress activity UI exposed only the current-day window. That log is
  contaminated by this audit because each of the 40 candidate paths appears
  once from the preflight requests themselves.
- 0/40 are authorized for live 410. No 410 was published.

The following private gates remain mandatory before a 410 is published:

1. No attributable lead in WordPress/CRM history. **Passed for all 40 in the
   26-record source-URL review.**
2. No material recent human/server-log demand. **Blocked: the available
   current-day log is too short and audit-contaminated.**
3. Full host database and media backup, not only a Git code bundle. **Passed.**

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

## Live execution result — 2026-08-26

- A manual uPress backup completed before deployment (2.8 GiB, one database,
  75 posts, two themes, WordPress 7.1).
- `justice-ops` 2.35.19 was installed through the WordPress updater and the
  cache-clear action was run.
- The live healthcheck reports 2.35.19, marker
  `seo-recovery-phase1-freeze-v1`, and
  `automatic_content_paused: true`.
- The freeze snapshot reports one scheduled `justice_term` moved to draft;
  the encyclopedia engine now reports zero scheduled entries. News and
  encyclopedia settings remain stored as enabled, but the global freeze
  prevents automatic publication.
- `/recommended-jus-tice-team-lawyer/` now returns an exact 404 with no
  `Location` header, so the self-redirect loop is gone.
- The four protected money pages return 200.
- The production 404-routing check passes 7/7.
- Three representative rendered cluster links resolve to their canonical
  root pillars and return 200:
  `/free-divorce-agreement-template/` -> `/divorce-lawyer/`,
  `/lawyer-for-buying-or-selling-a-house/` -> `/real-estate-attorney/`, and
  `/speeding/` -> `/traffic-lawyer/`. No sampled link targets an
  `/articles/` copy.
- No wave-1 410 was published because the server-log gate did not pass.

Live evidence is stored outside Git in the evidence directory named above.
The final local delivery ZIP intentionally excludes OAuth credentials and
other secrets.

## Live theme worktree blocker

The uPress Git-status screen showed a dirty live theme worktree with modified,
deleted, and untracked files, including `inc/content-clusters.php`. No theme
Pull was run and no live file was overwritten. The merged repository fix
remains the future reconciliation source. Current rendered production output
already passes the three sampled canonical-cluster checks, so this blocker
does not invalidate the live proof; it prevents claiming that the live theme
was updated from Git in this phase.

## Deployment and rollback

The safe plugin subset is deployed and rendered verification is complete.
The theme Pull was intentionally not performed because the live worktree is
dirty. Re-run these checks after any future theme reconciliation:

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
