# PR #8 Review and Deploy Readiness - 2026-05-19

PR: https://github.com/The-new-ben/justice-theme/pull/8  
Branch: `codex/eeat-authority-linear-sync`  
Status at creation: Draft, mergeable, 32 changed files, 11 commits

## Objective

Make PR #8 easier and safer to review, merge, deploy, and verify. The PR now contains real authority and revenue-path work, but it spans multiple risk areas. This document is the owner/reviewer map.

## Research Used

- Current PR review guidance emphasizes that pull request size directly affects review quality and bug risk. Large PRs need extra context, clear intent, and targeted review instructions.
- Google Search Central launch/migration guidance emphasizes pre-launch checks, post-launch verification, sitemap/robots/canonical checks, and monitoring after changes that affect crawlable pages.

## What PR #8 Delivers

### 1. E-E-A-T / Authority Governance

Purpose: stop unsafe broad legal byline/schema attribution.

Files:
- `inc/authority.php`
- `inc/schema.php`
- `single-articles.php`
- `functions.php`

Owner-visible after deploy:
- Articles should no longer broadly hardcode Ben Batash as author.
- Article schema should default to Jus-Tice Organization unless a verified reviewer/person path exists.
- Maya Rotenberg can be treated as a verified family-law reviewer only under scoped conditions.

### 2. Editorial Policy Trust Surface

Purpose: create public "who/how/why" trust support for legal/YMYL content.

Files:
- `inc/trust-routes.php`
- `template-parts/layout/site-footer.php`
- `inc/html-sitemap.php`

Owner-visible after deploy:
- `/editorial-policy/` returns a public page.
- Footer links to `מדיניות עריכה`.
- `/site-map/` links to `מדיניות עריכה`.

### 3. Live Author Attribution Audit

Purpose: prove the owner concern about broad Ben attribution with live evidence.

Files:
- `tools/check-live-author-attribution.mjs`
- `reports/live-author-attribution-audit-2026-05-19.csv`
- supporting `project-control` docs

Evidence:
- 80 live URLs checked as Googlebot.
- 45 visible Ben attributions found.
- 45 Article schema Ben authors found.
- 0 fetch errors.

### 4. Entity Footprint Plan

Purpose: prepare Google Business Profile, LinkedIn, and Organization `sameAs` without inventing unverified entity signals.

Files:
- `project-control/jus-tice-entity-footprint-checklist-2026-05-19.md`
- `project-control/jus-tice-entity-footprint-checklist-2026-05-19.csv`

Owner dependency:
- Confirm business name, address/service-area posture, phone, email, logo, social profile ownership, and Google Business eligibility.

### 5. Money-Focused Scorecard

Purpose: force execution cycles to report completion percentage, money impact, blockers, and owner-visible change.

Files:
- `project-control/goals-money-earning-scorecard-2026-05-19.md`
- `project-control/goals-money-earning-scorecard-2026-05-19.csv`

Current honest completion snapshot:
- Technical crawl/index: 72%
- SEO authority/E-E-A-T: 38%
- Money-query SEO: 28%
- Lawyer commercial pipeline: 31%
- Lead monetization/intake: 40%
- Lawyer retention/value: 22%
- Entity footprint/local trust: 18%

### 6. Uncovered Demand / Lead Monetization CRM Workflow

Purpose: stop leaking money when users request lawyer categories without current paid coverage, e.g. Thailand lawyer.

Files:
- `inc/lead-crm.php`
- supporting `project-control/uncovered-demand-*` docs

Owner-visible after deploy:
- `wp-admin -> Justice CRM` gets coverage status controls.
- Leads get a Coverage column and coverage dropdown.
- Uncovered Demand Queue appears.
- Safe no-match response template appears.
- Lawyer recruitment script appears.
- Demand summary table appears.
- Weekly recruitment brief appears.

## Review Instructions

Review PR #8 in four passes:

1. **Authority/schema pass**
   - Check `inc/authority.php`, `inc/schema.php`, `single-articles.php`.
   - Confirm no fake author/reviewer/entity claims.
   - Confirm fallback Article author is Organization, not an unverified person.

2. **Public trust/navigation pass**
   - Check `/editorial-policy/` route code.
   - Check footer and `/site-map/` link additions.
   - Confirm no "best/top/recommended" claims.

3. **CRM/admin pass**
   - Check `inc/lead-crm.php`.
   - Confirm new fields are admin-only.
   - Confirm no outbound messages are sent automatically.
   - Confirm no live records are mutated on plugin load.

4. **Docs/status pass**
   - Check `project-control` artifacts for clarity.
   - Confirm task board and current status reflect no live DB/uPress changes.

## Pre-Merge Checklist

- [ ] PR is mergeable.
- [ ] PHP lint passes for:
  - `inc/authority.php`
  - `inc/schema.php`
  - `single-articles.php`
  - `functions.php`
  - `inc/trust-routes.php`
  - `template-parts/layout/site-footer.php`
  - `inc/html-sitemap.php`
  - `inc/lead-crm.php`
  - `inc/lead-routing.php`
  - `inc/lead-classifier.php`
- [ ] `git diff --check` has no real whitespace errors.
- [ ] `node tools/check-live-journeys.mjs` passes.
- [ ] `node tools/check-live-author-attribution.mjs` can run before deploy as baseline.
- [ ] Owner understands no money is earned until deployed and used.

## Deploy Checklist After Merge

1. Pull latest `main` on uPress Git Manager for `wp-content/themes/justice-theme`.
2. Verify uPress says pull completed and working tree is clean.
3. Verify public routes:
   - `/`
   - `/site-map/`
   - `/editorial-policy/`
   - sample article
   - `/lawyer-registration/?plan_interest=pro`
   - `/robots.txt`
   - `/sitemap_index.xml`
4. Verify owner-visible admin path:
   - `wp-admin -> Justice CRM`
   - Coverage cards visible.
   - Uncovered Demand Queue visible.
   - Weekly recruitment brief visible.
5. Rerun:
   - `node tools/check-live-journeys.mjs`
   - `node tools/check-live-author-attribution.mjs`

## Post-Deploy Success Criteria

- `/editorial-policy/` returns HTTP 200 and is crawlable.
- Footer and `/site-map/` link to `/editorial-policy/`.
- Articles no longer broadly show unsafe Ben author schema/byline from the theme template.
- Remaining Ben attributions, if any, are identified as CMS/plugin/content leftovers for follow-up.
- Justice CRM shows coverage status and uncovered-demand workflow.
- No PHP errors observed in live debug log for the new modules.

## Honest Completion Assessment

PR #8 review/deploy readiness is now **55%**:

- Complete: branch exists, mergeable, tested repeatedly, documented, Linear-linked.
- Blocked: still draft, not reviewed, not merged, not pulled to uPress, no live wp-admin visual verification, no post-deploy author audit.

No money has been earned by PR #8 yet. Its revenue value is enabling: safer authority signals, better trust surface, and a CRM workflow to turn unmatched demand into paid partner recruitment.

## Recommendation

Stop adding feature scope to PR #8 unless a blocker is found. Next cycles should either:

1. make PR #8 ready for review/merge;
2. split CRM work into a smaller PR if reviewers find the branch too broad;
3. move to money-query SEO batch 001 only after PR #8 has a clear merge path.

