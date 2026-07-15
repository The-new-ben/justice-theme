# Site-wide dash + AI-teller sweep — 2026-07-15

Method (researched first, per owner order): content-level transform through
wp_update_post (revision-safe, serialized-data-safe, gate-aware), full
DRY-RUN with per-post match list reviewed before writing, rule refinements
from the review (spaced law-years and Hebrew-prefix numbers become hyphens,
not commas), 755 posts written in 9 explicit-ID batches, caches flushed.

| Metric | Before | After |
|---|---|---|
| Posts with dashes | 663 | 32 |
| Em dashes | 301 | 66 |
| En dashes | 17650 | 2144 |
| Teller-phrase hits | 1230 | 536 |

Remainders, honestly: 42 posts are untouchable by automation
(their existing text trips the publication-safety gate, list in the dry-run
audit); remaining teller hits are mid-sentence forms that need eyes, and
wave rebuilds replace those pages anyway. Titles with dashes (19)
and in-body H1s (73) were NOT touched (not in the owner's named
scope) — listed for a named decision.

Rollback: every change is one WP revision away, per post.
