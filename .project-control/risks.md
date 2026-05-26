# Risks
Date: 2026-05-09

| ID | Severity | Status | Risk | Mitigation |
|---|---|---|---|---|
| R001 | CRITICAL | OPEN | Duplicate Justice plugins can register the same CPTs/taxonomies or leave live WP pointing to a removed plugin path | Verify active plugin before deleting/renaming legacy folders |
| R002 | CRITICAL | OPEN | Spam/casino posts may still exist in DB even if hidden from homepage | Populate `spam-candidates.csv` via authenticated REST/WP-CLI before cleanup |
| R003 | HIGH | OPEN | City/practice terms may be attached with slugs or wrong taxonomy object types | Fixed local plugin taxonomy registration; verify live term assignments |
| R004 | HIGH | OPEN | Theme name/docs mismatch can confuse sync/deployment | Decide final theme name after verifying live folder and GitHub sync rules |
| R005 | HIGH | OPEN | YMYL/legal content lacks verified authors/reviewers/disclosures | Add editorial policy, author/reviewer fields, sources, and visible disclaimers |
| R006 | MEDIUM | OPEN | Demo seeder currently publishes and marks seeded lawyers as verified in legacy code | Change seeder to draft/unverified before relying on it for production |
