# Links — Manual Export Needed

The GSC Search Analytics API does NOT provide backlink/link data.
You must export links manually from the GSC web interface.

## How to Export Links

1. Open Google Search Console: https://search.google.com/search-console
2. Select the property: jus-tice.co.il
3. Go to **Links** in the left sidebar
4. Export **External Links → Top linked pages** → save CSV
5. Export **External Links → Top linking sites** → save CSV  
6. Export **Internal Links → Top linked pages** → save CSV
7. Save all files into: `gsc-mirror/links/`

## Expected Files

- `links/external-top-linked-pages.csv`
- `links/external-top-linking-sites.csv`
- `links/internal-top-linked-pages.csv`

## Status

Until these are exported, all backlink-related fields are marked: **NEEDS_LINKS_UI_EXPORT**

Do not block the GSC mirror because links are missing. The mirror is fully functional without them.
