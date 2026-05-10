# Export Folder

Date: 2026-05-10
Status: PUBLIC REST EXPORT V1 COMPLETED

This folder is reserved for the full content audit exports.

The public REST export script was run safely without WordPress login or live writes:

```powershell
powershell -ExecutionPolicy Bypass -File tools\content-audit\wp-rest-export.ps1 -SiteUrl "https://jus-tice.co.il" -OutDir "project-control\exports"
```

Result:
- Content rows exported: 1,220
- Internal links exported: 1,707
- Menu export: blocked by WordPress REST 401, requires authentication
- Traffic metrics: UNKNOWN until GSC access exists

Expected files after the export:

- `all-content-export.csv`
- `all-posts-export.csv`
- `all-pages-export.csv`
- `all-articles-export.csv`
- `all-categories-export.csv`
- `all-tags-export.csv`
- `all-taxonomies-export.csv`
- `all-practice-areas-export.csv`
- `all-cities-export.csv`
- `all-menus-export.csv`
- `all-media-export.csv`
- `all-internal-links-export.csv`
- `all-url-export.csv`
- `../content-master-inventory.csv`

Important:
- Public REST export is a public-only snapshot.
- Private/draft/menu/meta/GSC fields require authenticated access.
- Empty/UNKNOWN fields are acceptable in the first export; fake data is not.
