# Branch Review: `origin/claude/justice-website-review-aovSK`
Date: 2026-05-10

## VERIFIED
- Branch exists at `origin/claude/justice-website-review-aovSK`.
- Current remote tip observed locally: `8e965ff`.
- The branch is far behind/divergent from `main`.
- Comparing `main..origin/claude/justice-website-review-aovSK` shows roughly 20,000 deleted lines and 179 changed files.

## RISK
- Do not merge this branch wholesale.
- It deletes the newer Jus-Tice platform work from `main`, including:
  - long-form family-law content drafts,
  - LegalTech tool templates,
  - lawyer registration/dashboard/plans pages,
  - content draft importer,
  - GSC automation,
  - visual evidence screenshots,
  - many project-control files,
  - premium visual pass CSS files,
  - current `justice-core` plugin candidate.

## FIXED INTO MAIN FROM REVIEW
- Wired `template-parts/sections/ask-lawyer.php` to the existing `admin-post.php?action=justice_submit_lead` handler instead of `action="#"`.
- Added the missing `justice_whatsapp` Customizer setting used by the footer.
- Added non-singular canonical output for key archives/taxonomies/search.
- Added `noindex,follow` for search pages and lawyer-directory filter URLs.
- Added `Attorney` JSON-LD on `justice_lawyer` mini-site pages without fake rating/review claims.
- Hardened lawyer profile view counting to skip logged-in users, admin contexts, feeds, cron/ajax and common bots/previews.

## NOT MERGED
- Plugin folder rename/deletion strategy.
- Deletion of legacy plugin folders.
- Deletion of newer content/platform files.
- Taxonomy object-type changes that would remove `post` before the live content model and spam source are verified.
- Removal of file-tool placeholder files. The actual active include lists do not load `file-tools.php` or `agent-bridge.php`, but live active plugin path remains NOT VERIFIED.

## NEXT
1. Keep using `main` as the working branch.
2. Cherry-pick or manually port only specific reviewed fixes.
3. Verify live active plugin path before deleting or renaming any plugin folder.
4. Run PHP lint after every PHP change.
