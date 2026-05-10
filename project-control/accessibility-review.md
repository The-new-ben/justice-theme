# Accessibility Review

Date: 2026-05-10  
Status: REVIEW PLAN - no accessibility code changes executed

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
