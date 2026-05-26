# Workspace Rules & Guidelines — Jus-Tice Repository

Welcome! This repository is shared by multiple autonomous agents and human developers working concurrently on different aspects of the Jus-Tice legal portal (SEO automation, lawyer registries, client logins, work orders, etc.). 

To prevent conflicting changes and ensure we do not overwrite each other's code, all agents and developers **must** adhere to these strict workspace rules.

---

## 🛠️ 1. Core Development Rules

1.  **Do Not Modify Core SEO Schemas in Layouts:**
    All on-page schemas (`FAQPage`, `Article`, `LegalService`, `BreadcrumbList`) are dynamically injected via `inc/schema.php`. Do not hardcode or inject duplicate schemas into the page template files (`single.php`, `page.php`, etc.).
2.  **Breadcrumb Integrity:**
    *   Dynamic breadcrumbs are controlled programmatically by `inc/breadcrumbs.php` via `justice_theme_resolve_pillar_for_slug`. 
    *   Before pushing any routing or slug updates, you **must** run the local safety verification:
        ```bash
        node tools/check-controlled-route-breadcrumb-safety.mjs
        ```
    *   If any tests fail or show as `BLOCKED`, do not push your changes to origin.
3.  **Theme vs. Plugin Separation:**
    *   Do not put functional administrative database logic (such as lawyers' private credentials, work order databases, client log-in tables) directly in the theme's `functions.php`.
    *   All backend operational tools must reside in a dedicated core site plugin to protect functional databases from visual theme updates.

---

## ✍️ 2. SEO Content & Cannibalization Prevention Standards

1.  **No Thin Content:**
    All new pages must contain high-value, unique content. Boilerplate templates are strictly forbidden. Every local page must contain specific local court house data, pricing matrices, and actual local dynamics.
2.  **Query the Content Tree:**
    *   Before writing any new article or page, you **must** search the central inventory map:
        `project-control/master-content-tree.json`
    *   If the target keyword or slug already exists, you are **blocked** from creating a new URL. You must instead update or merge the existing page.
3.  **Strict E-E-A-T and Disclaimers:**
    *   All Bar Association credentials or stamps must be placed in the footer, formulated as an educational disclaimer, to ensure compliance with Israel Bar Association ethics rules.
    *   Every informational guide must reference exact Israeli statutes or Supreme Court case files.

---

## 🔄 3. Git & Deployment Flow

*   **Clean Branches:** Always sync your branch with `origin/main` before starting your task.
*   **Static Checks:** Run all test scripts in `/tools/` before making a commit.
*   **Detailed Commit Messages:** Provide a concise description of what was added or modified, citing specific batch IDs or feature tags.
