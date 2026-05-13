# Prompt To Agent

Read `justice-theme/project-control/` completely before doing anything.

Do not change the live site.
Do not publish content.
Do not change URLs.
Do not run redirects.
Do not delete anything.

Your first task is to make the master file reliable.

Use:
- `content-master/master-content-database.csv`
- `content-master/methodology.md`
- `content-master/missing-data-request.csv`
- `content-master/manifests/rar-file-manifest.csv`
- `agent-workflow/AGENT_RULES.md`

Important:
The RAR archives contain real `content-bodies/` files. Extract the archives locally with 7-Zip/WinRAR/unrar and copy the real content-body files into:

`project-control/content-master/content-bodies/`

Then update the master file.

Do not classify articles by WordPress category alone.

Classification must use:
1. category
2. tags
3. practice area
4. title
5. URL
6. article body
7. GSC queries
8. semantic keywords
9. internal links

The master file must eventually tell us for every article:
- current URL
- current title
- body file
- cluster
- primary keyword
- search intent
- pillar/support status
- GSC traffic
- cannibalization risk
- recommended action
- proposed English slug
- redirect target
- import readiness

Before upload, choose a small pilot cluster.

Do not start with all 1,200 articles.
Do not start with all Family Law if it is too large.
Recommend the safest pilot after validating the master file.

Answer in chat:
STATUS:
WHAT YOU VERIFIED:
WHAT IS MISSING:
MASTER FILE RELIABILITY:
BEST PILOT:
RISKS:
NEXT 5 ACTIONS:
