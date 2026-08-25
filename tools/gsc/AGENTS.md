# GSC Agent Instructions

1. Read `START-HERE-OAUTH.md` and `README-GSC-CONNECTION.md` before any Google
   Search Console task.
2. Use `gsc-universal-pull.js` for exact-property exports; never use a fallback
   property and never mix data from different sites.
3. Credentials are local files outside the repository. Read their paths from
   `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`; never print file contents.
4. OAuth scope must be `https://www.googleapis.com/auth/webmasters.readonly`.
5. Keep raw GSC data, property registries, workbooks, and generated analysis
   outside the repository under `%USERPROFILE%\Documents\GSC-Data\`.
6. All WordPress, sitemap, and GSC operations in this directory are read-only
   unless the user gives a separate, explicit live-change instruction.
7. Run syntax checks and `gsc-nadlan-analysis.test.js` after relevant changes.
8. Never commit a token, OAuth client, client secret, refresh token, password,
   private property registry, or raw client data.
