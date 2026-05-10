# Polish Cycles
Date: 2026-05-09

## Cycle 0 - Audit Foundation
Status: IN PROGRESS

Research:
- Competitor patterns reviewed from Din, PsakDin, Justia, Midrag, Takdin.

Code improvements:
- Fixed lawyer archive duplicate `</main>`.
- Fixed lead form Hebrew label.
- Corrected taxonomy ownership in plugin code.

Desktop check:
- NOT VERIFIED

Mobile check:
- NOT VERIFIED

Buttons/links:
- PARTIALLY VERIFIED from public HTML only.

Performance risk:
- NOT VERIFIED

Proof:
- Public HTTP extracts show homepage and `/lawyers/` load.

## Cycle 1 - Logo/Favicon/Search Branding
Status: CODE FIXED / NOT LIVE VERIFIED

Research:
- Google favicon guidance reviewed: crawlable icon file, stable URL, larger-than-minimum square asset recommended.
- WordPress Site Icon guidance reviewed: use a square 512x512 PNG through Site Identity/admin where possible.

Code improvements:
- Replaced dummy repo logo with the owner-provided Jus-Tice logo source.
- Added square favicon/app icon assets in 16, 32, 48, 180, 192 and 512 sizes plus ICO.
- Updated SVG fallback favicon with a square legal mark and red accent.
- Expanded theme fallback icon tags while preserving WordPress Site Icon priority.
- Tightened fallback wordmark size and red-dot pulse.

Desktop check:
- NOT LIVE VERIFIED after deploy.

Mobile check:
- NOT LIVE VERIFIED after deploy.

Search branding:
- LIVE VERIFIED current live icon URLs return 200.
- NOT VERIFIED after fallback deploy and wp-admin Site Icon review.

Proof:
- `project-control/favicon-logo-task.md`
