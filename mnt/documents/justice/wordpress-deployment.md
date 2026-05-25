# WordPress Deployment Notes

1. Use Gutenberg Custom HTML block for `homepage.html` or each internal page draft.
2. Paste only after legal/SEO review and after deciding whether this replaces an existing page or creates a new one.
3. Do not change slugs, canonicals, noindex, redirects, taxonomies or sitemaps from this pack without owner approval.
4. Put title and meta from `seo-meta.json` in Yoast.
5. Add JSON-LD only once. If Yoast already outputs overlapping schema, review duplicates before adding `schema-bundle.json`.
6. Generate or upload images from `images-to-generate.json`; do not use fake lawyer portraits.
7. For unclaimed lawyer cards use initials badge, not generic people photos.
8. After publishing, run visual QA on mobile and desktop, Rich Results Test, link check and GSC annotation.
9. Payment language must remain honest until Grow/Morning plugin/API, real payment, invoice and refund proof are verified.
