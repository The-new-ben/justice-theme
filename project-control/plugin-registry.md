# Plugin Registry — Jus-Tice Legal Portal
# Last updated: 2026-05-09
# Status: ASSUMPTION — not verified on live server yet

---

## CANONICAL PLUGIN (KEEP)

| Field | Value |
|-------|-------|
| Display Name | Justice Core |
| Folder Name | justice-core |
| Main File | justice-core/justice-core.php |
| Version | 2.0.0 → upgrading to 4.0.0 |
| Status | ASSUMPTION: Active on server |
| Purpose | CPTs, taxonomies, meta boxes, REST tools, seeder, lead CRM |
| Plugin Slug (WP) | justice-core/justice-core.php |

### CPTs Registered:
- `justice_lawyer` — archive: /lawyers/
- `justice_lead` — private, CRM only
- `articles` — archive: /articles/

### Taxonomies Registered:
- `practice-areas` — on articles + lawyers
- `city` — on lawyers only

### REST Routes:
- `GET /wp-json/justice-core/v1/health`
- `GET /wp-json/justice-core/v1/theme-state`

---

## DUPLICATE PLUGIN (DEACTIVATE + DELETE)

| Field | Value |
|-------|-------|
| Display Name | Justice Core |
| Folder Name | justice-core-v3 |
| Main File | justice-core-v3/justice-core.php |
| Version | 3.1.0 |
| Status | ASSUMPTION: May be active — CONFLICT RISK |
| Purpose | Partial rebuild — now superseded |
| Plugin Slug (WP) | justice-core-v3/justice-core.php |

### RISK:
Both plugins register `justice_lawyer` CPT and `practice-areas` taxonomy.
If both are active simultaneously → PHP fatal error on pages using those CPTs.

### Resolution:
1. Deactivate `justice-core-v3/justice-core.php` in WP Admin.
2. Delete `justice-core-v3/` folder.
3. Upgrade `justice-core/` to v4.0.0.
4. Activate `justice-core/justice-core.php`.
5. Verify via REST health endpoint.

---

## OTHER ACTIVE PLUGINS (UNKNOWN — needs verification)

| Plugin | Risk |
|--------|------|
| Rank Math | SAFE — SEO only |
| Query Monitor | SAFE — debug only |
| WP File Manager | SAFE — admin tool |
| Unknown import/feed plugin | INVESTIGATE — may be source of casino spam |
| WooCommerce (if installed) | INVESTIGATE — unnecessary weight |
| Any "Auto Post" / RSS plugins | HIGH RISK — likely spam source |

---

## VERIFICATION STATUS

**NOT VERIFIED** — the following must be confirmed by calling:
```
GET https://jus-tice.co.il/wp-json/justice-core/v1/health
Authorization: Basic {base64(user:app_password)}
```

Expected response:
```json
{
  "ok": true,
  "plugin_version": "4.0.0",
  "cpt_registered": {
    "justice_lawyer": true,
    "justice_lead": true,
    "articles": true
  },
  "tax_registered": {
    "practice-areas": true,
    "city": true
  }
}
```
