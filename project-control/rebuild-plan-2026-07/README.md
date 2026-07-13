# Jus-Tice SEO rebuild package — 2026-07-13

Start with `D0-D8-decision-report.md`, then review `top-100-priority-urls.csv` and the complete `D1-full-url-disposition-1522.csv`.

Recommended implementation order:

1. Approve the Wave 1 medical-malpractice content split and four direct redirects.
2. Obtain a backlink export that maps each external link to its exact Jus-Tice destination URL.
3. Crawl staging and confirm canonicals, robots directives, sitemap membership, redirect targets and internal links.
4. Ship one wave at a time using the entry/exit rules in the report.
5. Re-run the machine audit after any manual decision change.

Important limits:

- The query×page export is capped and click-sorted; missing demand is not proof of zero demand.
- The supplied link exports do not include destination URLs, so the plan authorizes no 410 deletion.
- Live SERP sampling is directional and not a geo-locked rank archive.
- REBUILD requires original value, named-attorney review and primary sources; it is not automatic publishing approval.
