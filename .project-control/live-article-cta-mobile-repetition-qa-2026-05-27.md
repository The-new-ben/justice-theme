# Live Article CTA Mobile Repetition QA - 2026-05-27

Status: ARTICLE_CTA_MOBILE_REPETITION_QA_PASS_NO_PUBLIC_CHANGE

Scope: read-only live QA packet for the owner-reported mobile article issue where the same help/request message could appear again while scrolling. It samples live article pages, checks after-content CTA counts, contextual CTA URL counts, duplicate sidebar markers, repeated CTA text groups and sidebar/after-content repetition. It does not publish, edit CMS content, change templates, alter SEO settings, create leads, contact anyone, send email or deploy.

## Summary

- Source dedupe report: .reports/live-article-cta-dedupe-2026-05-27.json (PASS, 6 rows).
- Sampled URLs: 5.
- Passed: 5; review rows: 0.
- Max after-content CTA count: 1.
- Max contextual article CTA URL count: 1.
- Max duplicate sidebar marker count: 0.
- Sidebar repeats after-content CTA rows: 0.

## Results

| URL | Status | HTTP | Lead CTA Count | Contextual URL Count | Duplicate Sidebar Count | Sidebar Cards | No-Sidebar Layout | Repeated CTA Buttons | Sidebar Repeats CTA |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/ | PASS | 200 | 1 | 1 | 0 | 0 | yes | - | no |
| https://jus-tice.co.il/most-recommended-family-lawyer/ | PASS | 200 | 1 | 1 | 0 | 0 | yes | - | no |
| https://jus-tice.co.il/experienced-family-law-attorney/ | PASS | 200 | 1 | 1 | 0 | 0 | yes | - | no |
| https://jus-tice.co.il/domestic-violence/ | PASS | 200 | 1 | 1 | 0 | 0 | yes | - | no |
| https://jus-tice.co.il/rabbinical-agreement-approval/ | PASS | 200 | 1 | 1 | 0 | 0 | yes | - | no |

## Review

The sampled live article pages do not reproduce the repeated-help-message problem: each sampled page has one after-content CTA at most, one contextual CTA URL at most, no duplicate sidebar marker and no sidebar block repeating the after-content CTA.

This is a proof packet only. If a future mobile screenshot shows a different URL still repeats the message, add that exact URL to this checker before changing the public template.
