# CHATGPT OPERATING GUIDE — HOW TO RUN A DEEP RESEARCH JOB CORRECTLY
(For the browser operator. This replaces guesswork with a fixed procedure.
You are launching ONE long research job per run-card. Nothing else.)

## WHAT YOU ARE DOING, IN ONE LINE
Paste one run-card into a CLEAN Deep-Research chat, send it, answer one
possible clarifying question, wait for the research to finish, save the
complete output to a local file. That is the entire job. No images, no
Work mode, no other tools.

## STATE CHECKLIST — verify ALL FIVE before pasting anything
1. **Tab: "Chat"** (top toggle). NOT "Work". Deep research lives in Chat.
2. **Fresh chat** (New chat button). The composer must be EMPTY.
3. **No tool pills stuck in the composer.** If you see "Create image" or any
   other pill attached to the composer: click the small ✕ on the pill, or
   abandon the chat and open another new one. NEVER send with an image tool
   attached. ("Create image" as gray PLACEHOLDER TEXT inside the empty box
   is fine — that's just a suggestion; a highlighted/active pill is not.)
4. **"Deep research" chip ACTIVE** — click it in the composer toolbar (the
   telescope/magnifier chip). When active it appears highlighted/blue.
   Web browsing is built into Deep research; there is no separate web toggle.
5. **Model:** if a model picker is visible, select 5.6 (Pro is fine). If
   Deep research hides the picker — that's normal, proceed.

Take a screenshot for yourself after the checklist; if any item failed,
fix it before pasting.

## LAUNCH
6. Paste the ENTIRE run-card section (from "# RUN x" to its last line) as
   ONE message. After pasting, scroll INSIDE the composer to the bottom and
   verify the text ends with the card's final rules section — if the end is
   missing, the paste truncated: clear and re-paste.
7. Send.
8. **Expected: ChatGPT asks 1-3 clarifying questions first** (normal for
   Deep research). Reply EXACTLY once:
   "Proceed exactly per the instructions in my message. Do not narrow the
   scope. All article output in Hebrew as specified."
   Do not answer differently, do not add preferences.
9. Research starts: you'll see a progress panel ("researching", source
   counter, activity log). This runs **10-45 minutes**. Keep the tab open.
   Do NOT click stop, do NOT send more messages, do NOT start another run.

## HOW TO KNOW IT WORKED vs FAILED
- WORKED: long visible research activity, then a long final answer
  (thousands of words, Hebrew article blocks with `=== Uxx ===` separators
  or the pillar HTML).
- FAILED — instant answer (finished in under a minute, no research panel):
  Deep research wasn't active. Abandon that chat, redo from checklist step 2.
- FAILED — "You've reached your deep research limit" (or similar quota
  message): STOP, report the exact message to the owner. Do not burn
  regular-chat attempts as a substitute.
- Interrupted/error mid-research: retry ONCE in a fresh chat; second
  failure → save whatever partial output exists as RUNx-PARTIAL-raw.md and
  report exactly what happened.

## CAPTURE (the part most often done wrong)
10. When the final answer renders: use the **Copy button** at the bottom of
    the answer (copies the complete markdown — better than manual
    selection). Paste into a new local file:
    C:\Users\pro\justice\war-output\RUN1-PILLAR-raw.md
    (RUN2-birth-raw.md, RUN3-surgery-raw.md, RUN4-money-core-raw.md,
    RUN5-diagnosis-raw.md, RUN6-cases-raw.md for the later runs.)
11. If the answer contains downloadable files/canvas documents — download
    every one into the same folder, original names.
12. **Verify the capture:** the saved file for a real run should be LARGE
    (a 10,000-word Hebrew article is ~120KB+; spoke batches 60KB+). If your
    file is under ~20KB, the copy was partial — recapture by scrolling the
    full answer and copying again in parts (part1/part2 files are fine).
13. Tell the owner: "RUN x saved to war-output — drag the folder to Claude
    Code for engineering QA." **After RUN 1: STOP until engineering
    approves.** Runs 2-6 only after that approval, one at a time, each in a
    fresh chat from the checklist.

## LAWS (unchanged)
- You never edit, trim, "clean up," or reformat ChatGPT's output. Raw
  fidelity only — engineering does all fixing.
- One run at a time. Never two research jobs in parallel on this account.
- Report what actually happened, including your own missteps.
