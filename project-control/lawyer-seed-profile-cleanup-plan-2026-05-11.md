# Lawyer Seed Profile Cleanup Plan - 2026-05-11

Status: VERIFIED LIVE BASELINE / OWNER APPROVAL REQUIRED / NO CMS CHANGES EXECUTED

## Purpose

The public lawyer REST guard protects output after deployment, but it does not clean the underlying WordPress records. This plan lists the live `justice_lawyer` records currently exposed through public REST before the guard is live and defines the owner-approved cleanup path.

This is intentionally not an automatic deletion script. Lawyer records must be backed up and reviewed before any CMS/database action.

## Live Baseline

Source checked:

`https://jus-tice.co.il/wp-json/wp/v2/justice_lawyer?per_page=100`

VERIFIED:
- Public REST returned `10` `justice_lawyer` records.
- All `10` are currently `publish`.
- All `10` have placeholder/seed-style contact signals in the exported fields.
- The records include lawyer names, firm names, bar-number style values, phone/WhatsApp/email fields, plan fields and counters.
- This is a trust risk even if the visible `/lawyers/` archive currently renders `0` lawyer cards.

Export created:

`project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.csv`

## Records To Review

| ID | Title | Current status | Recommended action |
|---:|---|---|---|
| 19130 | עו"ד מאיה רוטנברג | publish | Review first; keep only if real source/contact/approval is verified, otherwise draft/private |
| 19131 | עו"ד דוד כהן | publish | Draft/private until real source approved |
| 19132 | עו"ד שרה לוי | publish | Draft/private until real source approved |
| 19133 | עו"ד יוסי מזרחי | publish | Draft/private until real source approved |
| 19134 | עו"ד נועה שפירא | publish | Draft/private until real source approved |
| 19135 | עו"ד אבי בן-דוד | publish | Draft/private until real source approved |
| 19136 | עו"ד תמר גולדשטיין | publish | Draft/private until real source approved |
| 19137 | עו"ד משה פרץ | publish | Draft/private until real source approved |
| 19138 | עו"ד ליאת אברהם | publish | Draft/private until real source approved |
| 19139 | עו"ד איתן כץ | publish | Draft/private until real source approved |

## Recommended Cleanup Sequence

1. Export a fresh backup of all `justice_lawyer` posts and post meta.
2. Confirm whether ID `19130` is the intended real Maya Rotenberg client profile or a seed-like placeholder record.
3. For any profile without verified source/contact/approval, change post status to `draft` or `private`; do not delete.
4. If Maya is real, correct the profile only after owner/client approval:
   - verified contact fields,
   - verified profile status,
   - verified source type/source URL where appropriate,
   - no fake ratings/reviews/badges,
   - correct slug decision.
5. Rerun public checks:
   - `/lawyers/`
   - `/wp-json/wp/v2/justice_lawyer?per_page=20`
   - direct seed IDs such as `/wp-json/wp/v2/justice_lawyer/19139`
   - old lawyer URLs.
6. Store after-cleanup CSV evidence in `project-control/`.

## Acceptance Criteria

VERIFIED before marketing:
- Public REST does not expose seed/unapproved lawyer records.
- Public REST does not expose lawyer custom meta such as phone, email, WhatsApp, internal notes, profile views or admin/source fields.
- No visible profile, card, schema, sitemap or related link presents seed/demo lawyers as real.
- Real lawyer profiles appear only after source/contact/approval data is real.
- No record is deleted without backup and owner approval.

## Blockers

- Owner approval is required before changing post status or meta.
- uPress pull/cache refresh is required before verifying the new REST guard.
- If Maya Rotenberg is a real client profile, owner/client verification is required before keeping that record public.

## Not Executed

- No WordPress post status changed.
- No lawyer meta changed.
- No profiles were deleted.
- No URL, redirect, canonical, sitemap, schema, menu, card or content change was executed.
