# Lawyer Rating System Spec
Date: 2026-05-10  
Status: PRODUCT SPEC DRAFT - NOT IMPLEMENTED

## Product Principle

Jus-Tice should not launch with a subjective "lawyer quality score".

Launch safer trust signals first:
- reviews available.
- Google rating if verified.
- Jus-Tice approved reviews.
- profile completeness.
- source verified.
- articles/Q&A activity.
- response tracking in private dashboard.

## Public Labels

Allowed early labels:
- פרופיל מלא
- פרטי משרד מאומתים
- חוות דעת זמינות
- דירוג Google מחובר
- מאמרים מקצועיים בפרופיל
- מענה לשאלות באתר

Avoid until legal/business approval:
- עורך דין מומלץ
- הטוב ביותר
- מוביל
- מדורג ראשון
- נבחר על ידי Jus-Tice
- אמין
- מומחה, unless official/legal source supports it.

## Components

### 1. Google Rating Summary

Inputs:
- `google_place_id`
- `google_rating`
- `google_review_count`
- `google_reviews_last_verified`
- `google_maps_review_url`

Display:
- rating number and count, only if verified.
- source disclosure: Google.
- link to Google profile.

### 2. Jus-Tice First-Party Review Summary

Inputs:
- approved `justice_review` posts.
- rating values.
- moderation status.
- verified interaction flag.

Display:
- approved review count.
- average rating only after minimum threshold.
- no confidential facts.
- review-source disclosure.

Suggested minimum:
- Do not show an average until at least 3 approved reviews.
- Do not show review snippets until moderation approves privacy and defamation risk.

### 3. Profile Completeness Score

This is safer than "lawyer quality".

Example scoring:
- photo: 10
- office/contact details: 10
- practice areas: 10
- cities served: 5
- languages: 5
- bio: 10
- article connections: 10
- FAQ: 10
- review source connected: 10
- verification/disclosure fields: 10
- last updated within 12 months: 10

Display:
- Public: "פרופיל מלא" or progress badge only if useful.
- Admin/lawyer dashboard: numeric percentage.

### 4. Authority Signals

Inputs:
- connected articles.
- public Q&A answers.
- videos/media.
- source-approved public profiles.
- professional organization memberships if verified.

Display:
- section blocks, not numeric quality score initially.

### 5. Reputation Dashboard

Lawyer/admin view:
- Google source status.
- Jus-Tice review count.
- average rating if eligible.
- review moderation queue.
- response time.
- lead conversion.
- profile completeness.
- suggested next improvements.

## Review CPT Proposal

Post type: `justice_review`  
Public: false  
Show UI: true  
Show in REST: true  
Supports: title, editor, custom fields

Fields:
- review_id
- lawyer_id
- source
- source_review_id
- source_url
- reviewer_display_name
- reviewer_initials
- reviewer_email_hash
- rating
- review_text
- review_date
- imported_at
- verified_interaction
- review_status
- moderation_status
- consent_status
- privacy_risk
- response_text
- response_date
- source_place_id
- source_business_profile_id
- is_featured
- admin_notes

Source values:
- `justice`
- `google`
- `manual_public_source`
- `external_directory`
- `lawyer_submitted_reference`

Review status:
- `pending`
- `approved`
- `rejected`
- `hidden`
- `imported_unverified`
- `needs_legal_review`

Moderation status:
- `not_reviewed`
- `approved`
- `rejected`
- `privacy_risk`
- `conflict_of_interest`
- `suspected_fake`
- `defamation_risk`

## Public Card Rules

Directory card:
- Show rating summary only if real and source-disclosed.
- Keep card compact.
- Never show fake stars.
- If no reviews: "חוות דעת עדיין לא מוצגות" or omit section.

Mini-site:
- Review summary.
- review-source disclosure.
- approved excerpts.
- Google link.
- review collection CTA.
- moderation/privacy warning.
- professional trust signals.

## Schema

Do not add AggregateRating automatically. Follow `project-control/review-schema-policy.md`.

## Status

SPEC ONLY. No CPT, meta box, public card, schema or review UI was implemented.
