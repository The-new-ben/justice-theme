---
name: seo-money-loop
description: The resumable per-cycle loop that moves jus-tice.co.il money pages up the real Israeli SERP. Use for ANY "improve the SEO", "next page", "continue the loop", "fix cannibalization", "check the hierarchy" request. One cycle = pick target from GSC by opportunity score, verify the REAL position in Chrome (never trust GSC or SerpApi alone), tear down the pages actually ranking, apply only evidence-derived fixes, verify rendered, screenshot, log state. Never invent titles, first paragraphs or signals. Proven 2026-07-25 on the Greece cluster.
---

# seo-money-loop: one page per cycle, evidence only, always resumable

Owner mandate: "I cannot prompt you on everything. You complete the 99%."
Every cycle runs all nine steps. State is written to
`.project-control/seo/loop-state.json` so the next session resumes without
re-deriving anything.

## Step 0 — resume

Read `.project-control/seo/loop-state.json`. It holds `completed[]` (slug +
date + what changed + before/after position), `in_progress`, and `next_targets[]`.
Never re-open a page listed in `completed` unless its GSC position got worse.

## Step 1 — pick the target by opportunity score, not by gut

Pull GSC (service-account JWT; token expires HOURLY, rebuild every session;
Hebrew filters MUST be written as UTF-8 JSON files and sent with
`--data-binary`, inline shell Hebrew silently returns zero rows).

Score = `impressions × proximity_gain`, where gain is 0.1 for positions 1-3
(already won), 0.6 for 4-10, **1.0 for 11-20 (the strike zone)**, 0.5 beyond 20.
Take the highest score not already in `completed`.

## Step 2 — verify the REAL position in Chrome. Never skip this.

**GSC position is an average across devices, locations and time. It lies.**
Measured 2026-07-25: GSC said "דירה ביוון מחיר" was position 18.3; the real
Israeli desktop SERP had us at **position 4**. SerpApi has its own failure mode:
it matched Chrome exactly on head keywords but claimed we were #3 on a long-tail
where we were not on page 1 at all.

Open `google.co.il/search?q=…&hl=he&gl=il&num=20` in the owner's real Chrome and
extract the organic list from the DOM. Record: our true position, the top 5
hosts+titles, and **whether an AI Overview is present** (`סקירת AI`) and who it
cites. On country/real-estate queries the AI Overview sits above every organic
result, so being cited there outranks ranking #1.

## Step 3 — tear down the pages that actually beat us

Fetch the top 3 with a browser UA (some 404 on bot UA, and their SERP URL is
often not their real URL). For each, extract: title, meta, H1/H2 tree, word
count, table count, and how many times they use the searcher's exact phrase.

Compare to ours in one table. **The fix must fall out of this comparison.**
If it doesn't, you have not found the real gap yet.

## Step 4 — the four gaps that keep repeating on this site

Measured on the Greece page, all four present at once:

1. **Missing year.** Two of the top five carried `2026` in the title; ours said
   only "מעודכנת". Israeli buyers filter by year.
2. **Missing the searcher's exact words.** "כמה עולה" appeared **zero times in
   12,561 words** while the top two used it in their titles. Depth without the
   phrase does not rank.
3. **Promise without proof.** Our title promised "טבלת מחירים" and the page had
   **no `<table>` at all**. Tables are also what AI Overviews quote.
4. **Stale opener.** The first line read "מחירון 2025" in 2026.

## Step 5 — fix surgically, never rewrite

We had 12,561 words against competitors' 473 and 1,470. The depth was never the
problem. Change the title, add the direct-answer H2 in the searcher's words, add
a real table **built only from figures already verified on our own page**, fix
the stale year. Nothing invented: every number in the table came from our own
prose.

Titles: `[exact query] [year]: [our differentiator] | Jus-Tice`.

## Step 6 — hierarchy, in the same cycle

A page is never fixed alone. Check: which of our pages also rank for this query
(cannibalization), whether the money page or an encyclopedia page owns it, that
the page is linked from its pillar and from the homepage path, and that
supporting pages point up rather than compete. When two pages fight, prefer
**de-optimizing the weaker title** over deleting content — it keeps the link
equity and stops the signal split.

## Step 7 — deploy through the gate

`php -l` on every touched file in a check that **aborts the whole chain** on
failure. A stray `),` took the site down for 40 minutes on 2026-07-21. Snippet
bodies get linted too before they are POSTed. Content edits go by REST PUT;
Yoast title/meta need a one-shot snippet (not REST-writable) plus an indexable
purge.

## Step 8 — prove it, then log it

Purge the URL, re-fetch, assert every change rendered, then **screenshot**.
On this machine: real Chrome, fixed overlay at scrollY 0 cloning the changed
sections plus a proof bar with `document.title` and `location.pathname`.
No report without a screenshot.

Append to `loop-state.json`: slug, date, gaps found, changes made, position
before, and the query to re-measure next cycle.

## Standing rules

- Never `noindex` a content article. Not a decision the agent may make.
- No invented reviews, ratings, experience or statistics.
- Public copy never says firms are in our index/מאגר/אינדקס.
- No em dashes. No AI-tells ("במדריך זה", "חשוב לציין", "לסיכום").
- Text before widgets: the band and map belong in the lower-upper fold.
- Report what failed as plainly as what worked.

## Queue

Greece (done 2026-07-25) → Cyprus (geography page cannibalizes the lawyer page)
→ Dubai (most commercially pure: 250 commercial vs 65 informational impressions)
→ Portugal (`אזרחות פורטוגלית`, 190 impressions at position 24) → the criminal
and family pillars → the 1,510 zero-impression pages.
