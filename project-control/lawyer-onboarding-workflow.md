# Lawyer Onboarding Workflow
Date: 2026-05-09
Status: ACTIVE MVP

## Goal

Allow lawyers to submit themselves with minimal owner effort while keeping profile quality, ethics, and trust under control.

## Current MVP

## FIXED
- Public page template: `page-lawyer-registration.php`
- Handler: `inc/lawyer-onboarding.php`
- Public URL target: `/lawyer-registration/`
- Submitted profiles become `justice_lawyer` drafts.
- Submitted profiles are marked:
  - `verification_status = pending`
  - `profile_status = pending`
  - `source_type = registration`
  - `subscription_status = pending`
- Registration now collects mini-site content inputs:
  - `profile_headline`
  - `profile_services`
  - `profile_process`
  - `profile_video_url`
  - `profile_faqs`
- Admin onboarding queue now shows a compact YES/NO mini-site content checklist for headline, services, process, video and FAQ fields.
- Owner notification email includes submitted headline and video URL for faster triage.
- Submitted city text is mapped to existing/core `city` taxonomy terms when possible, so draft profiles can later work with directory filters after approval.
- Registration form now suggests the core city names with a browser datalist to improve city-taxonomy matching without forcing a restrictive selector.
- Registration form now has canonical practice-area fallback options if taxonomy terms are unavailable, preventing empty primary-area submissions during setup.
- No profile is published automatically.

## Review Workflow

1. Open WordPress admin.
2. Go to lawyer profiles.
3. Filter/review drafts with `source_type=registration`.
4. Check identity and license details.
5. Check whether public claims are factual and conservative.
6. Add/edit practice areas and city terms.
7. Improve the mini-site fields if the lawyer paid or qualifies for a richer profile.
   - Review headline for accuracy and no exaggerated claims.
   - Convert services/process/FAQ answers into polished public sections.
   - Check video/social/media links before publishing.
8. Set commercial plan:
   - free
   - pro
   - featured
   - lead_partner
   - full_service
9. Set `verification_status`:
   - pending until checked
   - verified only after real verification
   - unverified if incomplete
10. Publish only after approval.

## Rules

- Do not auto-publish lawyers.
- Do not show fake reviews.
- Do not show fake rankings.
- Do not claim “verified” unless verified.
- Do not accept misleading specialist claims without review.
- Every paid/sponsored placement must be labeled clearly.

## Automation Roadmap

1. Add admin dashboard queue for pending lawyer registrations.
2. Add automated email to owner on new submission.
3. Add lawyer login/profile editor.
4. Add upload workflow for photo, logo, license and videos.
5. Add AI profile assistant that turns form answers into draft profile sections.
6. Add plan selection and billing.
7. Add lead inbox and lead status tracking.
8. Add content request flow where lawyers can request articles under their name.

## NOT VERIFIED

- Live page creation after admin visit.
- Live form submission.
- Whether active plugin has `justice_lawyer` available when the handler runs.
