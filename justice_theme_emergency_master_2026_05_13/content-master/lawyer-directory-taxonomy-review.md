# Lawyer Directory — Taxonomy & CMS Technical Review
**Date:** 2026-05-14

## Taxonomy Architecture (Current State)

### Taxonomies Registered

| Taxonomy | Slug | CPT Attached | Hierarchical | show_in_rest | REST Base |
|----------|------|--------------|-------------|-------------|-----------|
| `practice-areas` | practice-areas | articles, post, justice_lawyer | Yes | Yes | practice-areas |
| `city` | city | justice_lawyer | No | Yes | city |
| `category` | category | post | Yes | Yes | categories |
| `post_tag` | post_tag | post | No | Yes | tags |

### Critical Finding: practice-areas Was Missing from justice_lawyer

**Root cause:** On the live server, the taxonomy `practice-areas` was registered for `Types: articles, post` only — NOT `justice_lawyer`. This happened because:

1. The `justice-core` plugin registers `practice-areas` for `array('articles', 'justice_lawyer', 'post')` at `init` (default priority 10)
2. But if the plugin loads in a specific order where another registration runs first, or if the taxonomy was cached without `justice_lawyer`, the object types were incomplete

**Fix applied (commit 1b83020):**
- Added `justice_theme_ensure_practice_areas_on_lawyer_cpt()` in `inc/taxonomy-seed.php`
- Runs at `init` priority 99 (after all registrations)
- Calls `register_taxonomy_for_object_type('practice-areas', 'justice_lawyer')` if missing
- **Verified live:** Types now include `articles, post, justice_lawyer`

### Verified REST API Status

| Check | Before Fix | After Fix |
|-------|-----------|-----------|
| `practice-areas` in taxonomy types | articles, post | articles, post, justice_lawyer |
| `practice-areas` in Nahari REST response | NOT PRESENT | ✅ Present (empty array) |
| Can assign via REST POST | ❌ No | ✅ Yes (tested: term 170 assigned) |
| `city` in Nahari REST response | ✅ [700, 721] | ✅ [700, 721] |

## Sharon Nahari Profile Status

| Field | Value | Status |
|-------|-------|--------|
| Post ID | 19309 | ✅ |
| URL | /lawyers/advocate-sharon-nahari/ | ✅ |
| Status | publish | ✅ |
| practice-areas | [170] (criminal-law / משפט פלילי) | ✅ FIXED |
| city | [700] (Tel Aviv), [721] (Bnei Brak) | ✅ |
| Featured image | 0 (none) | ❌ MISSING |
| Meta fields | 28 populated | ✅ |

## Taxonomy Questions Answered

1. **Is `practice-areas` attached to `justice_lawyer`?** YES (after fix)
2. **Is `city` attached to `justice_lawyer`?** YES
3. **Both visible in REST?** YES
4. **Both visible/editable in WP Admin?** YES (practice-areas now shows in lawyer edit screen)
5. **Available in lawyer archive filters?** YES — `/lawyers/?area=criminal-law` works
6. **Lawyer card template displays practice area and city?** YES
7. **Single lawyer template displays them?** YES
8. **Criminal Law practice-area page shows relevant lawyers?** YES (Nahari appears)
9. **Can future lawyers be assigned programmatically?** YES — REST POST to `/wp-json/wp/v2/justice_lawyer/{id}` with `practice-areas: [term_id]`
10. **Slugs clean and stable?** YES — English slugs, no URL-encoded Hebrew
11. **Duplicate category/practice-area problem?** YES — both `category/criminal-law` (ID 730, 18 posts) and `practice-areas/criminal-law` (ID 170, 139 posts) exist. Category redirects to homepage. Practice-area works. Need to consolidate.

## Action Items

| Priority | Action | Status |
|----------|--------|--------|
| DONE | Attach practice-areas to justice_lawyer | ✅ |
| DONE | Assign Criminal Law to Nahari | ✅ |
| DONE | Verify REST API assignment works | ✅ |
| TODO | Set featured image for Nahari | ❌ |
| TODO | Resolve category vs practice-area duplication | ⚠️ |
| TODO | Ensure category criminal-law (730) articles are also tagged in practice-areas | ⚠️ |
| TODO | Cache clear for robots.txt | ⚠️ |
| TODO | Add practice-area to main navigation menu | ⚠️ |
