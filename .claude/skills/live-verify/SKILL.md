---
name: live-verify
description: MANDATORY self-check after every change that is supposed to reach jus-tice.co.il. Owner law (2026-07-02): never report anything as done, fixed, removed, or live without verifying the RENDERED live surface. Use after every deploy, every justice-ops release, every content migration, every CSS/JS change, every image or template removal.
---

# live-verify: check yourself, on the live site, every time

Owner order, verbatim intent: "put it as a mandatory skill to check
yourself... you check, you check, you check." This exists because a
stock photo the owner ordered removed was reported gone while it still
rendered on the homepage. Never again.

## The law

1. A change is NOT done when the code is pushed, the plugin updated, or
   the snippet returned success. It is done when the RENDERED live page
   proves it.
2. Verify the POSITIVE (the new thing is present) AND the NEGATIVE (the
   old thing is absent). Most misses are negatives: the retired photo,
   the old marker, the dead class.
3. Verify on the surface the owner actually looks at (the homepage, the
   profile, the article), not only on healthchecks or REST endpoints.
4. If verification fails, the task is NOT failed silently and NOT
   reported done: diagnose the layer (see cache map below), fix, verify
   again. Report only what the rendered page proves.

## How to verify (agent-side, no browser needed)

    curl -sm 30 "https://jus-tice.co.il/<page>?cb=$(date +%s)" -o page.html

- Slice from <body>; head assets contain class names and false-positive.
- Assert the new marker string IS in the body.
- Assert the retired string is NOT in the body (grep -c returns 0).
- Deleted files: request them directly, expect 404.
- CSS/JS changes: Autoptimize aggregates and renames everything, so the
  handle or filename will NOT appear in the HTML. Extract the
  autoptimize_*.css / *.js URLs from the page and grep INSIDE them for a
  distinctive selector or code probe.
- Inline scripts: Autoptimize base64-inlines them as data: URIs; decode
  before asserting absence.
- Data endpoints: fetch the JSON and assert the actual values (counts,
  titles, no en dashes in rendered titles; wptexturize turns " - " into
  an en dash entity on output).

## The SEVEN cache layers between a change and the visitor

1. uPress SeoEdge edge cache (nginx, x-cached-engine-header: SeoEdge).
   OUTSIDE WordPress; plugin purges do not touch it. HTTP PURGE per URL
   returns 200 and refreshes: curl -X PURGE https://jus-tice.co.il/
2. SiteGround Speed Optimizer (sg-cachepress).
3. Autoptimize aggregated CSS/JS store.
4. WP-Optimize page cache.
5. Asset CleanUp.
6. WordPress object cache (wp_cache_flush).
7. The owner's browser: always tell him Ctrl+Shift+R.

Purge 2-6 inside the deploy route (see deploy-snippet-template.php),
purge 1 with HTTP PURGE on the changed URLs, then fetch fresh and
verify. If the page still looks stale, check x-cached-engine-header on
the response before blaming the deploy.

## Minimum checklist per change type

- Theme/plugin code: healthcheck version AND a rendered-body probe.
- Image/asset removal: template refs gone from rendered HTML, file URL
  404s, container hidden or removed (no broken-image icon).
- CSS: probe selector inside the aggregated CSS files.
- JS: probe string inside the aggregated JS files.
- Content/DB: the public page shows the new value; check for en dashes
  introduced by texturize.
- After EVERY verification pass: screenshot-equivalent summary to the
  owner of what was checked and what proved it.
