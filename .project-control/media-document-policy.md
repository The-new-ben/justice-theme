# Media And Document URL Policy
Date: 2026-05-10
Status: DRAFT POLICY / NO LIVE CHANGES EXECUTED

## Why This Exists

GSC indexing examples include PDFs, DOCX files and uploaded documents. Some uploaded files also have meaningful search performance. Therefore media URLs are not automatically bad and must not be deleted or redirected as a cleanup shortcut.

## Current Evidence

- VERIFIED: sampled GSC indexing examples include PDF and DOCX upload URLs.
- VERIFIED: prior GSC notes show high-traffic media URLs, including a PDF with 99 clicks and 928 impressions.
- VERIFIED: active practice-area sitemap output includes at least one media/image URL.

## Policy

1. Do not delete media files during content cleanup unless they are spam, private, illegal, or explicitly approved for removal.
2. Do not redirect media URLs to homepage.
3. Do not noindex valuable documents until GSC traffic and user purpose are reviewed.
4. If a document is useful, prefer an HTML wrapper page with:
   - plain Hebrew summary,
   - source/context,
   - date,
   - related article links,
   - download/view link,
   - legal disclaimer where needed.
5. If a document is outdated but still has traffic, keep it accessible and link it from an updated HTML guide where appropriate.
6. If a document is technical noise, remove it from sitemaps/internal links first; noindex/delete only after approval.

## Recommended Classifications

- KEEP_DOCUMENT_SOURCE: useful source/document with user value.
- CREATE_HTML_WRAPPER: useful document but weak as a standalone search result.
- REMOVE_FROM_SITEMAP_ONLY: should not be submitted, but still can exist.
- NOINDEX_LATER: low-value document, only after approval.
- DELETE_ONLY_AFTER_APPROVAL: spam/private/irrelevant file after backup and owner approval.

## Next Step

Create a media inventory from sitemap/GSC examples and separate high-value legal documents from noise.
