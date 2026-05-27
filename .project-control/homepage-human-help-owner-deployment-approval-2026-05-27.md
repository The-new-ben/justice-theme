# Homepage human-help owner deployment approval - 2026-05-27

Status: HOMEPAGE_HUMAN_HELP_DEPLOYMENT_APPROVAL_PACKET_READY_OWNER_DECISION_REQUIRED

## Project Manager Check

Active goal: turn the homepage improvement from internal code into a controlled deployment decision.
Current branch: `codex/homepage-human-help-local`.
Current readiness to profit: 78% locally, 0% live.
Honesty statement: this is not published, not merged to main and not pulled by uPress. Static QA passed, but real WordPress route QA is still missing.

## What Is Ready

- Public-first homepage help copy is implemented locally.
- The choosing-lawyer guide content was not edited.
- Static desktop and mobile visual QA passed after a mobile clipping fix.
- QA report: `.reports/homepage-human-help-visual-qa-2026-05-27.json`.

## What Is Not Ready

- No real WordPress route or staging page has been checked yet.
- No owner approval exists for merge to main.
- No owner approval exists for uPress Pull Git.
- No live revenue can be claimed from this work yet.

## Owner Decisions Needed

| ID | Decision | Question | Recommended | If yes | If no | Status |
| --- | --- | --- | --- | --- | --- | --- |
| HOME-APPROVAL-01 | approve_real_route_qa | לאשר בדיקת route אמיתי בסביבת WordPress או staging לפני פרסום? | yes | Codex יבדוק את עמוד הבית האמיתי בדפדפן ויוודא שאין שבירה לפני merge או uPress. | העבודה נשארת פנימית בענף, בלי פרסום. | waiting_owner_decision |
| HOME-APPROVAL-02 | approve_merge_to_main_after_route_qa_pass | אם route QA אמיתי עובר, לאשר merge ל-main? | no_until_route_qa_passes | רק אחרי route QA שעובר אפשר להכין merge ל-main. | הענף נשאר נפרד ולא נכנס למסלול פריסה. | blocked_until_route_qa |
| HOME-APPROVAL-03 | approve_upress_pull_after_main_push | אם יהיה push מאושר ל-main, לאשר uPress Pull Git לאתר החי? | no_until_main_push_approved | Codex יפתח uPress ויריץ Pull Git רק אחרי push מאושר ל-main. | לא תהיה השפעה על האתר החי. | blocked_until_owner_deployment_approval |
| HOME-APPROVAL-04 | approve_post_publish_review | אם יפורסם, לאשר בדיקת פוסט-פרסום עם URL, סקירה וקישורי קניבליזציה? | yes | Codex יבדוק את העמוד החי, יתעד URL, סקירה, סיכום תוכן וקישורים דומים לבדיקה. | לא יהיה אישור איכות אחרי פרסום. | waiting_owner_decision |

## Gates

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| HOME-DEPLOY-GATE-01 | static_visual_qa_passed | PASS | QA status: HOMEPAGE_HUMAN_HELP_VISUAL_QA_PASS_NO_PUBLIC_CHANGE. |
| HOME-DEPLOY-GATE-02 | mobile_no_horizontal_overflow | PASS | mobileOverflowX=false. |
| HOME-DEPLOY-GATE-03 | desktop_no_horizontal_overflow | PASS | desktopOverflowX=false. |
| HOME-DEPLOY-GATE-04 | real_wordpress_route_qa | BLOCKED | Static preview passed, but the real WordPress route has not been checked yet. |
| HOME-DEPLOY-GATE-05 | owner_deployment_approval | BLOCKED | Owner has not approved merge to main or uPress Pull Git. |
| HOME-DEPLOY-GATE-06 | guide_content_preserved | PASS | The implementation and QA did not edit template-parts/sections/find-lawyer-guide.php. |

## QA Snapshot

- Desktop overflow: false
- Mobile overflow: false
- Desktop selectors present: true
- Mobile selectors present: true

## Decision

Do not deploy from this packet alone. The next safe action is real WordPress route QA or an explicit owner decision to keep the work internal.
