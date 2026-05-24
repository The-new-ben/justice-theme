# Maya Lawyer CMS Activation Packet - 2026-05-24

Status: BLOCKED PUBLIC CMS ACTIVATION / VERIFIED LOCAL PACKET / NO PUBLIC CHANGES

## Summary
- VERIFIED LIVE READ-ONLY PARTIAL: current public checker still reaches the site and confirms the justice_lawyer REST type.
- BLOCKED LIVE QA: /lawyers/advocate-maya-rotenberg/ is not live-ready; current public report has 7/9 blocked packet rows.
- FIXED PLANNING: this packet converts the blocked route state into exact owner/operator activation gates.
- VERIFIED LOCAL: source safeguards remain false-by-default and approval-gated before public profile output.
- SAFETY: no public CMS record, lawyer profile, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## Required Order
1. Owner approves or holds Maya profile activation scope.
2. Operator confirms the existing live justice_lawyer record and captures rollback material.
3. Operator applies only the approved record/slug/meta changes; no duplicate profile creation.
4. Operator reruns read-only live QA, captures desktop/mobile screenshots, and verifies schema/REST behavior.

## Packet Rows
| Packet | Lane | Status | Evidence | Owner action | Operator action | Verification |
|---|---|---|---|---|---|---|
| MAYA-CMS-001 | current_live_blocker | BLOCKED LIVE QA | HTTP 404; REST slug count 0; verified rows 1/7 | Decide whether to activate the Maya profile now or keep it held. | Do not publish, redirect, canonicalize, or create a duplicate while current live QA is blocked. | Rerun node tools/check-maya-lawyer-live-readonly.mjs --reportDate=2026-05-24 |
| MAYA-CMS-002 | existing_profile_confirmation | BLOCKED ADMIN CONFIRMATION | 1 prior migration-map row(s); candidate profile IDs: 19130 | Confirm the correct existing justice_lawyer record in wp-admin or database before any new record is created. | If candidate ID 19130 or another Maya record exists, repair that record only; create no duplicate profile. | Authenticated wp-admin or WP-CLI confirmation of post type, ID, title, status, slug, and current meta. |
| MAYA-CMS-003 | rollback_capture | BLOCKED ROLLBACK REQUIRED | No rollback capture artifact for the live Maya CMS record exists in this repo packet. | Approve a rollback storage location and activation window. | Before any write, export current post fields, meta, taxonomies, permalink-manager/redirect rules, SEO fields, and screenshots where available. | Store rollback evidence path in project-control before enabling any migration filter or wp-admin edit. |
| MAYA-CMS-004 | public_approval_signals | VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION | justice_theme_lawyer_profile_is_public_approved requires publish status, non-seed signals, and approval metadata. | Approve exact public profile status and verified source fields; do not mark fake, seed, demo, or test records public. | Set only truthful approval fields after owner review; do not set subscription_status=active unless commercially true. | After edit, anonymous public route and REST must show exactly one approved Maya profile and no unapproved profile leakage. |
| MAYA-CMS-005 | opt_in_slug_migration | VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION | Slug migration and old-slug redirect filters are false by default. | Approve the English slug migration and old Hebrew URL redirect only after rollback capture. | Enable one scoped migration window if needed; verify the profile exists before enabling redirect. | After migration, /lawyers/advocate-maya-rotenberg/ must be HTTP 200 and old Hebrew URL may 301 only to the verified English URL. |
| MAYA-CMS-006 | minisite_bootstrap_fields | VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION | Mini-site bootstrap is false by default, targets Maya only, writes empty fields, and avoids invented ratings/reviews/photos/payments. | Approve or edit the profile wording and decide which empty fields may be filled. | If approved, fill only empty fields on the confirmed Maya record; leave ratings, reviews, photos, bar/license numbers, and payments untouched unless verified. | After activation, inspect visible sections, lead form routing fields, related articles, and schema output. |
| MAYA-CMS-007 | public_source_transparency | VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION | Public-source bootstrap is false by default and stores editable source references only where empty. | Confirm which public source URLs may be displayed and used in sameAs/profile context. | Do not add unreviewed awards, ratings, reviews, case wins, or license claims. | After activation, check source links, sameAs extraction, Attorney/Person schema, and no fake review/rating schema. |
| MAYA-CMS-008 | post_activation_live_qa | NOT VERIFIED | The current route is still not eligible for screenshot or Rich Results QA. | Approve a live QA window after the record, slug, approval fields, and cache state are controlled. | Rerun live checker, capture desktop/mobile screenshots, inspect JSON-LD, and validate public REST behavior. | Require HTTP 200, self-canonical, index/follow, one REST record, Attorney/Person schema, profile content, and desktop/mobile screenshots. |
| MAYA-CMS-009 | repo_safety_closeout | VERIFIED LOCAL / NO PUBLIC CHANGES | This packet and the current read-only check only wrote repo reports and project-control documents. | None required for repo artifact generation. | Keep public execution blocked until the owner/operator actions above are complete. | CSV parse, node syntax, and generated packet rows must pass locally. |

## Decision
- BLOCKED PUBLIC EXECUTION: do not mark /lawyers/advocate-maya-rotenberg/ live-ready and do not use it as support evidence for Family/Divorce uploads until post-activation live QA and screenshots pass.
- Source readiness date used: 2026-05-22.
