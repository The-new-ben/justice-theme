# Accessibility Review

Date: 2026-05-10  
Status: REVIEW PLAN - no accessibility code changes executed

## 2026-05-11 Live Floating-Control Accessibility Check
- LIVE VERIFIED: after uPress pull, sampled inner mobile pages use marker `2026-05-11-mobile-inner-qa-v1`.
- FIXED: duplicate theme WhatsApp control is hidden on sampled non-home mobile pages, reducing repeated/fixed contact targets.
- LIVE VERIFIED: one compact third-party WhatsApp button remains available.
- PARTIAL: Pojo accessibility toolbar still exists and is intentionally positioned off-canvas until opened; deeper keyboard/screen-reader review remains pending.
- EVIDENCE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json`.

## Goal

The legal portal must be usable by people who navigate with keyboard, screen readers, mobile touch and high-contrast needs. Accessibility also supports trust and conversion.

## Global Checks

- skip link visible on focus.
- keyboard navigation through header/menu/forms/cards.
- visible focus states.
- sufficient color contrast.
- semantic headings.
- form labels and error messages.
- ARIA labels only where needed and accurate.
- mobile tap targets large enough.
- breadcrumbs understandable in RTL.
- no important text embedded only in images.
- no CTA hidden behind hover-only behavior.

## Template Matrix

| Template | Risk | Status | Next action |
|---|---|---|---|
| Homepage | hero/search/CTA order and focus flow | NOT VERIFIED | keyboard and mobile walkthrough |
| Header/menu | dropdown/mobile menu focus trap risk | NOT VERIFIED | keyboard open/close test |
| Breadcrumbs | RTL separator and screen reader clarity | PARTIAL | inspect markup and visual mobile |
| Article page | long content, FAQ, related cards | NOT VERIFIED | heading outline and link purpose check |
| Practice/category page | archive cards and filters | NOT VERIFIED | form/filter labels and keyboard use |
| Lawyer directory | filter controls and lawyer card CTAs | NOT VERIFIED | labels, focus, tap target check |
| Lawyer profile | lead form/contact buttons | NOT VERIFIED | form error states and CTA labels |
| Search | results/no-results copy | PARTIAL | Hebrew labels and pagination test |
| 404 | recovery links | NOT VERIFIED | Hebrew copy and useful links test |

## Required Documentation

After each visual QA pass, record:
- page URL.
- device/viewport.
- issue.
- user impact.
- recommended fix.
- status.

## Current Decision

Accessibility review is now a launch gate, not a post-launch nice-to-have.

## 2026-05-10 Visual Accessibility Findings

VISUAL VERIFIED:
- Logo and hamburger are visible on mobile.
- Breadcrumbs are visible on article/archive/search/practice pages.
- The accessibility launcher is visible.

RISK / NEEDS FIX:
- Accessibility launcher overlaps article/practice/search content in the first viewport.
- WhatsApp and green lead CTA overlap lower content and can obscure article/search cards on mobile.
- Search form fields/buttons on mobile appear as plain controls; labels/spacing need review for tap targets and accessible names.
- Topic-strip pills are horizontally constrained on mobile; verify keyboard/scroll access.
- Hamburger menu contents and focus behavior were not opened/tested in this pass.

Status:
- VISUAL VERIFIED / PARTIAL.
- Keyboard and screen-reader checks remain NOT VERIFIED.

## 2026-05-10 Mobile Floating Control Repair

- LIVE VERIFIED BEFORE FIX: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png` shows the accessibility launcher over customer-facing hero content.
- CODE FIXED: the Pojo accessibility toolbar is repositioned on mobile and its overlay is capped to the viewport height.
- CODE FIXED: the theme WhatsApp button is smaller, raised above the bottom CTA zone, and no longer uses the highest stacking layer on mobile.
- CODE FIXED: mobile bottom safe-space padding was added so fixed controls are less likely to cover footer/form content.
- VERIFIED: CSS diff passed `git diff --check`.
- NOT LIVE VERIFIED: needs uPress pull/cache clear and mobile screenshot recheck.

## 2026-05-10 Third-Party Mobile Lead Button Repair

- LIVE VERIFIED ISSUE: the remaining green lower-right mobile control is `a.whatsapp-button`, about 255x61px before fix, and can obscure first-viewport content.
- CODE FIXED: mobile CSS compacts that injected control to a 54x54px round WhatsApp icon-only tap target.
- CODE FIXED: the extra embedded Jus-Tice logo and direct text label are hidden only in the compact mobile state; the WhatsApp icon and link remain available.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-chat-widget-css-test-final-2026-05-10.png`.
- NOT LIVE VERIFIED AFTER CODE FIX: needs uPress pull/cache clear and fresh mobile screenshot recheck.

## 2026-05-10 Homepage Mobile Floating Button Final State

- LIVE VERIFIED: after uPress pull/cache clear, homepage mobile hides `.whatsapp-float` and third-party `a.whatsapp-button` so fixed controls do not cover the guided search form or CTAs.
- VISUAL VERIFIED: `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png`.
- VERIFIED: computed homepage mobile check shows no horizontal overflow.
- PARTIAL: non-home mobile pages still need QA because compact floating contact buttons remain enabled outside `body.home`.

## 2026-05-11 Inner-Page Accessibility Overlay Follow-Up

- LIVE VERIFIED BEFORE FIX: four non-home mobile pages were sampled at 390px. The practice page had horizontal overflow and duplicate fixed WhatsApp controls.
- CODE FIXED: mobile CSS hides the duplicate theme `.whatsapp-float` on non-home pages while preserving the compact third-party `a.whatsapp-button`.
- CODE FIXED: the Pojo toolbar mobile selector is strengthened to override the plugin's right-side placement and keep the launcher predictable.
- CODE FIXED: page-level horizontal overflow is clipped on mobile, and practice-hub long descriptions are allowed to wrap inside their grid column.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json` shows all sampled pages passing overflow and duplicate-button checks.
- NOT LIVE VERIFIED AFTER CODE FIX: requires uPress pull/cache clear.

Remaining accessibility risk:
- The accessibility launcher is still visually prominent on mobile. It is now predictable and no longer creates horizontal overflow, but final placement should be reviewed after live deployment with keyboard/touch testing.
