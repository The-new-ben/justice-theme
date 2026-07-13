# Wave-1 Content Factory — how to run (Ben's 6 steps)

1. Open Claude Cowork on your desktop and point it at THIS folder
   (wave1-factory/) with file read/write access.
2. Paste the full text of `cowork-content-factory-prompt.md` as the task.
3. Cowork will produce ONE unit only (U01) and stop — that's the dry run.
   Send the `output/` folder (U01.html + manifest.csv) back to Claude Code
   for QA before letting Cowork continue.
4. After QA passes, tell Cowork: "U01 approved — continue U02-U30."
5. When `output/DONE.txt` appears, send the whole `output/` folder back to
   Claude Code. The QA gauntlet + fact-verification runs there.
6. You get a final go/no-go sheet. Nothing goes live without your word.

Cowork may draft pages with ChatGPT 5.6 (it has the template embedded) or
write itself — either is fine; the quality gates are identical.
