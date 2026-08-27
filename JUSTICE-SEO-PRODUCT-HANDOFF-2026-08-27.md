# Justice SEO → product handoff — 2026-08-27

## Decision

Organic visitors move from `jus-tice.co.il` through the existing `/legal-simulation/` bridge into the Matter-first product at `jus-tice.com/#/intake`. The handoff contains only allow-listed acquisition dimensions. It never contains the visitor's description, a page title, a search query, contact details, evidence, or any other Matter content.

The bridge is implemented in the theme, independently of the older Justice Ops shortcode, so the normal theme deployment can replace the old direct-to-arena behavior without rebuilding or publishing a plugin ZIP.

## Contract

Example:

```text
https://jus-tice.com/#/intake?jurisdiction=IL&source=organic&cluster=criminal-law&owner=%2Fcriminal-defense-attorney%2F
```

Allowed fields:

| Field | Rule |
|---|---|
| `jurisdiction` | fixed to `IL` for the Israeli editorial site |
| `source` | fixed to `organic` |
| `cluster` | one of the 11 reconciled GSC cluster keys |
| `owner` | derived from the selected cluster; never accepted as arbitrary request content |
| `embed` | fixed rendering flag used only inside the WordPress iframe |
| `domain` / `host` | fixed embed context, not visitor data |

## 11-cluster ownership map

| Cluster | Canonical owner path |
|---|---|
| `family-law` | `/divorce-lawyer/` |
| `criminal-law` | `/criminal-defense-attorney/` |
| `real-estate` | `/articles/real-estate-attorney/` |
| `immigration` | `/immigration-lawyer/` |
| `international-real-estate` | `/buying-property-abroad-guide/` |
| `traffic-law` | `/articles/traffic-lawyer/` |
| `inheritance` | `/inheritance-lawyer/` |
| `employment` | `/labor-lawyer/` |
| `medical-malpractice` | `/medical-malpractice-lawyer/` |
| `personal-injury` | `/personal-injury-law/` |
| `tax` | `/real-estate-tax-advisor/` |

This map is sourced from the reconciled GSC architecture output at the local, non-repository run directory. Raw GSC client data and OAuth files remain outside Git.

## Wiring

- `inc/simulation-handoff.php` owns the allow-list, taxonomy mapping, local bridge URL, product URL, and the theme-level `justice_arena_embed` shortcode.
- `inc/legal-tools-app.php` sends article simulation CTAs to the bridge with the article's mapped cluster owner.
- `template-parts/redesign/ai-tools-strip.php` sends the homepage continuation to Matter intake, not to a seeded recorded channel.
- User-entered homepage facts remain in the editorial browser and are not placed in the cross-domain URL.
- `tests/test-simulation-handoff.php` proves 11 unique owners, all four commercial journeys, and fail-closed behavior for an unknown value containing phone-like digits.
- CourtAI's post-simulation professional action maps the same 11 clusters to allow-listed `/lawyers/?area=…` values and never transfers Matter content.
- The reverse product-to-professional leg now uses an opaque browser-session `journey_id`; the directory, lawyer profile and consented lead form preserve it without Matter content. The full KPI and release contract is in `JUSTICE-JURIS-LEAD-REVENUE-ATTRIBUTION-2026-08-27.md`.
- `justice-ops/map-cinema.php` now retains an incoming canonical area in the server-rendered finder instead of silently reverting to Family; `justice-ops/city-practice.php` adds Medical Malpractice as its own finder option.

## Live finding and release order

The 2026-08-27 live check found that:

1. `/legal-simulation/` still embeds the old direct JURIS arena entry without cluster/owner attribution.
2. `jus-tice.com/#/intake` still serves an older access-code portal on the current production deployment.
3. The Matter-first intake exists on CourtAI PR 238, but the production deployment has not yet received it.

Therefore the WordPress handoff must not be published first. Safe release order:

1. pass and deploy the current CourtAI PR build;
2. verify `#/intake` visibly renders the Matter-first flow on desktop and mobile;
3. deploy this theme branch;
4. verify an allow-listed criminal, family, real-estate, and medical-malpractice journey;
5. verify the product analytics event contains the canonical cluster/owner and no Matter content;
6. finish one real JURIS run, save a deliverable, use the professional-review action, and verify the destination finder retains the same legal area and opaque journey;
7. submit only a synthetic no-PII test lead with explicit consent and verify the CRM joins the same journey to the correct cluster;
8. preserve desktop/mobile screenshots and the deployed commit identifiers.

## Rollback

If the destination fails after release, revert only the theme handoff commit so the local `/legal-simulation/` page returns to its previous arena embed. Do not add a 301, change an SEO owner URL, delete content, or alter the GSC architecture as part of rollback.

## Verification performed

- PHP syntax checks passed for the handoff module, legal-tools bridge, and homepage template.
- `php tests/test-simulation-handoff.php` passed and now asserts criminal, family, real-estate and medical-malpractice cluster/owner URLs separately.
- `php tests/test-map-sponsored-truth.php` now executes the finder for the same four journeys and proves both the selected option and no-JavaScript fallback URL retain the requested area.
- repository whitespace check passed for the implementation files.
- live before-state inspected in Chrome on both domains.
- the CourtAI preview at https://6a8fa2421cfd5857b008ce1e--courtai-code-ai.netlify.app visibly confirmed the real-estate handoff and its zero-Matter-content analytics boundary; fresh browser sessions confirmed the other three commercial labels.
- CourtAI preview `6a8faad8d9c9639846fb4614` adds tested `deliverable_saved` and `professional_action_started` wiring and unlocks the professional action only after useful work product exists; visual post-simulation proof remains gated by the already-documented provider failure rather than bypassed with mock data.

Production after-state is intentionally not claimed until the CourtAI product deployment is updated first.
