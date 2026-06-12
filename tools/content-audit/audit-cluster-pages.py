#!/usr/bin/env python3
"""
Content-quality audit for the cluster map pages (pillars + spokes).

Fetches each live page, isolates the article content area, and flags:
  - markdown/AI leakage:  **bold**, ## headings, "* " bullets, em/en dashes
  - emoji noise:          checkmarks, lightbulbs, warning signs in body copy
  - English scaffold:     'supporting page', 'pillar', 'spoke', 'cluster',
                          'TODO', 'placeholder', 'read more' left in Hebrew copy
  - Hebrew AI cliches:    repeated filler openers
  - thin content:         body under word threshold
  - structure:            H2 count, internal-link count

Output: CSV + prioritized Markdown worklist (priority = GSC impressions x severity).
Usage: python3 tools/content-audit/audit-cluster-pages.py
"""
import csv, json, re, sys, urllib.request, urllib.parse, html, collections, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CLUSTERS_PHP = os.path.join(ROOT, 'inc', 'content-clusters.php')
OUT_DIR = os.path.join(ROOT, 'project-control', 'content-audit-2026-06')
GSC_PAGES = None
for cand in ('reports/gsc-live-2026-06-09/pages.csv', '.reports/gsc-live-2026-06-09/pages.csv'):
    p = os.path.join(ROOT, cand)
    if os.path.exists(p):
        GSC_PAGES = p
        break

BASE = 'https://jus-tice.co.il'

def cluster_slugs():
    src = open(CLUSTERS_PHP, encoding='utf-8').read()
    body = src.split('function justice_theme_content_clusters')[1].split('/* --')[0]
    out = {}  # slug -> (cluster_key, role)
    for m in re.finditer(r"'([a-z0-9-]+)'\s*=>\s*array\(\s*\n\s*'pillar'\s*=>\s*'([a-z0-9-]+)'", body):
        out[m.group(2)] = (m.group(1), 'pillar')
    # spokes: all simple quoted slugs inside spokes arrays
    for cm in re.finditer(r"'pillar'\s*=>\s*'([a-z0-9-]+)'.*?'spokes'\s*=>\s*array\((.*?)\),\s*\)", body, re.S):
        pillar = cm.group(1)
        ckey = next((k for s,(k,r) in out.items() if s == pillar), '')
        for sm in re.finditer(r"'([a-z0-9-]{3,})'", cm.group(2)):
            slug = sm.group(1)
            if slug not in out:
                out[slug] = (ckey, 'spoke')
    return out

def gsc_impressions():
    imp = {}
    if not GSC_PAGES:
        return imp
    for row in csv.DictReader(open(GSC_PAGES, encoding='utf-8')):
        try:
            path = urllib.parse.unquote(urllib.parse.urlparse(row['page']).path).strip('/')
            imp[path] = imp.get(path, 0) + int(float(row['impressions']))
        except Exception:
            pass
    return imp

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (content-audit)'} )
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, ''
    except Exception:
        return 0, ''

def content_area(htm):
    m = re.search(r'<article[^>]*>(.*?)</article>', htm, re.S)
    if m: return m.group(1)
    m = re.search(r'class="entry-content[^"]*"[^>]*>(.*)<footer', htm, re.S)
    if m: return m.group(1)
    m = re.search(r'<main[^>]*>(.*?)</main>', htm, re.S)
    return m.group(1) if m else htm

HEB_CLICHES = ['חשוב לציין', 'חשוב לדעת', 'יתרה מזאת', 'זאת ועוד', 'כפי שצוין לעיל', 'אין ספק כי', 'בעידן המודרני', 'בעולם של היום']
SCAFFOLD = ['supporting page', 'pillar page', 'spoke', 'cluster page', 'TODO', 'placeholder', 'lorem', 'INSERT', 'tbd']
EMOJI = ['✅','✔','☑','💡','⚠️','🚩','📌','📋','🔑','⭐','👨','👩','🌐','💰','📂','🛡']

def audit(slug, ckey, role, imp):
    url = f'{BASE}/{slug}/'
    status, htm = fetch(url)
    if status != 200 or not htm:
        return {'slug': slug, 'cluster': ckey, 'role': role, 'status': status, 'impressions': imp,
                'words': 0, 'issues': 'PAGE NOT 200', 'severity': 9 if imp > 1000 else 3}
    area = content_area(htm)
    text = html.unescape(re.sub(r'<script.*?</script>|<style.*?</style>', '', area, flags=re.S))
    text_only = re.sub(r'<[^>]+>', ' ', text)
    words = len(re.findall(r'[֐-׿]{2,}', text_only))
    issues, severity = [], 0
    n = text_only.count('—') + text_only.count('–')
    if n: issues.append(f'em/en-dash x{n}'); severity += min(n, 5)
    n = len(re.findall(r'\*\*[^*]+\*\*', text_only))
    if n: issues.append(f'markdown **bold** x{n}'); severity += min(n*2, 8)
    n = len(re.findall(r'^\s*#{2,}\s', text_only, re.M))
    if n: issues.append(f'markdown ## x{n}'); severity += min(n*2, 8)
    n = len(re.findall(r'^\s*\*\s+\S', text_only, re.M))
    if n: issues.append(f'asterisk bullets x{n}'); severity += min(n, 5)
    hits = [e for e in EMOJI if e in text_only]
    if hits: issues.append('emoji in body: ' + ''.join(hits[:6])); severity += min(len(hits), 4)
    low = text_only.lower()
    sc = [s for s in SCAFFOLD if s in low]
    if sc: issues.append('EN scaffold: ' + ', '.join(sc)); severity += 6
    cl = [(c, text_only.count(c)) for c in HEB_CLICHES if text_only.count(c) >= 2]
    if cl: issues.append('cliches: ' + ', '.join(f'{c} x{k}' for c, k in cl)); severity += min(sum(k for _, k in cl), 5)
    if words and words < 400:
        issues.append(f'THIN ({words} heb words)'); severity += 7 if role == 'pillar' else 4
    h2 = len(re.findall(r'<h2[ >]', area))
    if role == 'pillar' and h2 < 4:
        issues.append(f'few H2 ({h2})'); severity += 3
    internal = len(re.findall(r'href="(?:https?://jus-tice\.co\.il)?/[a-z]', area))
    if internal < 3:
        issues.append(f'few internal links ({internal})'); severity += 2
    return {'slug': slug, 'cluster': ckey, 'role': role, 'status': status, 'impressions': imp,
            'words': words, 'h2': h2, 'internal_links': internal,
            'issues': ' | '.join(issues) if issues else 'clean', 'severity': severity}

def main():
    slugs = cluster_slugs()
    imps = gsc_impressions()
    rows = []
    for slug, (ckey, role) in sorted(slugs.items(), key=lambda kv: -imps.get(kv[0], 0)):
        r = audit(slug, ckey, role, imps.get(slug, 0))
        r['priority'] = round((r['impressions'] + 100) * (r['severity'] + 1) / 100)
        rows.append(r)
        print(f"  [{r['status']}] sev={r['severity']:>2} imp={r['impressions']:>6} {r['role']:6} {slug[:50]:50} {r['issues'][:80]}")
    rows.sort(key=lambda r: -r['priority'])
    os.makedirs(OUT_DIR, exist_ok=True)
    cols = ['priority','slug','cluster','role','status','impressions','words','h2','internal_links','severity','issues']
    with open(os.path.join(OUT_DIR, 'content-audit.csv'), 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore'); w.writeheader(); w.writerows(rows)
    with open(os.path.join(OUT_DIR, 'WORKLIST.md'), 'w', encoding='utf-8') as f:
        f.write('# Content tightening worklist (auto-generated)\n\n')
        f.write('Priority = (GSC impressions + 100) x (severity + 1) / 100. Fix top-down.\n')
        f.write('Owner writes the Hebrew; this list only marks WHERE and WHAT.\n\n')
        f.write('| # | Page | Role | Imp (16m) | Words | Issues |\n|---|---|---|---:|---:|---|\n')
        for i, r in enumerate(rows, 1):
            if r['issues'] == 'clean': continue
            f.write(f"| {i} | `/{r['slug']}/` | {r['role']} | {r['impressions']:,} | {r['words']} | {r['issues']} |\n")
    print(f"\nWrote {OUT_DIR}/content-audit.csv and WORKLIST.md ({len(rows)} pages scanned)")

if __name__ == '__main__':
    main()
