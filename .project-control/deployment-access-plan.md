# Deployment Access Plan - Jus-Tice
Date: 2026-05-11

## Goal
Give Codex a reliable way to deploy GitHub changes to the live uPress WordPress theme without waiting for the owner to press the pull button every time.

## Current Status
- LIVE VERIFIED: owner pressed uPress Git pull and the live site now serves deployment marker `2026-05-11-mobile-inner-qa-v1`.
- LIVE VERIFIED: live `premium-pass-3.css` contains the inner-page mobile fix.
- BLOCKED FOR AUTONOMOUS PULL: the direct uPress file-manager URL still redirects this Codex browser session to the uPress login screen.
- BLOCKED FOR AUTONOMOUS LOGIN: the in-app browser could not reliably type into the uPress email/password fields. Do not treat this as working access.
- 2026-05-11 RECHECK: direct file-manager URL still opens the uPress login screen, not the authenticated file manager.
- 2026-05-11 RECHECK: a controlled login attempt was stopped because the browser automation layer cannot safely fill the uPress email input and blocks JavaScript URL workarounds. Do not bypass this browser safety policy.

## Known uPress Git Method
uPress documents Git management through the file manager: open the file manager and use Manage GIT to clone or pull a repository in the current directory.

Source: https://support.upress.io/advanced/manage-git-via-file-manager/

## Option A - Persistent Authenticated uPress Browser Session
Status: AVAILABLE AFTER OWNER LOGS IN ONCE / NOT CURRENTLY ACTIVE

How it works:
1. Owner opens the uPress file-manager URL in the Codex browser session.
2. Owner signs in and completes 2FA.
3. Owner keeps the session logged in with remember-me enabled.
4. Codex can then open the same file-manager URL and press the right-panel Git / Pull button.
5. Codex verifies the public deployment marker and runs live QA.

Risk: Medium. It depends on browser session cookies and can expire.

Recommendation: use as the short-term operating method.

Current blocker: the Codex browser session is not logged in. The owner needs to complete one manual uPress login in the Codex browser and leave the session authenticated; after that Codex can attempt the right-panel Git pull button.

## Option B - SSH / WP-CLI Access
Status: NEEDS PASSWORD / SERVER ACCESS

How it works:
1. Owner provides SSH credentials or a limited deployment user.
2. Codex runs `git pull` in `/wp-content/themes/justice-theme`.
3. Codex clears cache if a safe command is available.
4. Codex verifies the deployment marker and public pages.

Risk: Medium-high unless the account is limited to the website and logged.

Recommendation: best durable path if uPress supports SSH for this plan.

## Option C - Secured Deploy Webhook
Status: NEEDS OWNER APPROVAL / SECURITY REVIEW

How it works:
1. A protected deploy endpoint receives a signed GitHub webhook.
2. The endpoint verifies an HMAC secret and allowed branch.
3. The endpoint runs a narrow deployment command only for the theme path.
4. It records timestamp, commit hash and output.
5. Codex verifies the marker after push.

Required safety gates:
- HMAC signature verification.
- Secret stored outside the repo.
- Main branch only.
- No arbitrary shell arguments.
- Rate limit and IP/log review.
- Manual rollback plan.
- Do not expose a simple public `pull.php`.

Risk: High if implemented casually.

Recommendation: plan only for now. Do not implement before owner approval and server capability confirmation.

## Option D - uPress API / Official Automation
Status: NOT FOUND IN PUBLIC DOCS

Public uPress docs found the file-manager Git workflow, but not an official public API endpoint for triggering Git pull remotely.

Recommendation: ask uPress support whether the file-manager Git pull action has an official API or deploy hook.

## Current Operating Decision
- SHORT TERM: owner keeps a uPress browser session authenticated, then Codex can use the right-panel Git pull button.
- MEDIUM TERM: request SSH/WP-CLI deployment access if available.
- FUTURE: consider a secured deploy webhook only after explicit approval.
- DO NOT: add an unsecured public pull endpoint or attempt browser-security workarounds for the uPress login form.

## Verification After Every Pull
1. Check homepage marker.
2. Check target page marker.
3. Check relevant CSS or PHP output changed.
4. Run public visual QA for affected pages.
5. Update `current-status.md`, `visual-qa-report.md` and `task-board.csv`.
