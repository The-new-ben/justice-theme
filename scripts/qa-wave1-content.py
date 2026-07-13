#!/usr/bin/env python3
"""QA gauntlet for wave-1 factory output (run: python3 scripts/qa-wave1-content.py <output_dir>).

Machine-checks every gate from the Cowork operating manual against the
returned output/ folder before anything is eligible for upload:
work-order fidelity (titles, URLs, coverage), length caps, HTML tag
whitelist, internal-link allowlist, E-E-A-T block with the bar license,
TODO-VERIFY extraction, forbidden style phrases, FAQ presence, and
query/title drift across units. Exit code 1 if any unit fails.
"""
import csv, html.parser, re, sys, unicodedata
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / 'project-control' / 'rebuild-plan-2026-07'
FACTORY = BASE / 'wave1-factory'
ALLOWED_TAGS = {'h2','h3','p','ul','ol','li','table','thead','tbody','tr','th','td',
                'blockquote','a','strong','em','div','br','span'}
FORBIDDEN = ['בעולם של היום','בעולם המודרני','אין ספק ש','כידוע לכולם','למותר לציין']
LICENSE = 'מ.ר. 32125'

def norm(s):
    s = unicodedata.normalize('NFKC', (s or '').strip().lower())
    s = s.replace('עו"ד','עורך דין').replace('עו״ד','עורך דין')
    s = re.sub(r'[0-9]{4}','', s); s = re.sub(r'[^֐-׿a-z ]',' ', s)
    return re.sub(r'\s+',' ', s).strip()

class TagAudit(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.bad = set(); self.links = []
    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED_TAGS: self.bad.add(tag)
        if tag == 'a':
            for k, v in attrs:
                if k == 'href': self.links.append(v or '')

def main(outdir):
    out = Path(outdir)
    work = {r['unit_id']: r for r in csv.DictReader(open(FACTORY/'wave1-content-work-order.csv', encoding='utf-8-sig'))}
    allow = {l.strip() for l in open(FACTORY/'wave1-link-allowlist.txt', encoding='utf-8') if l.strip()}
    allow |= {'/legal-simulation/'}
    man_path = out/'manifest.csv'
    if not man_path.exists():
        print('FATAL: manifest.csv missing'); sys.exit(1)
    man = list(csv.DictReader(open(man_path, encoding='utf-8-sig')))
    failures, report, seen_titles, seen_queries = 0, [], {}, {}
    for m in man:
        uid = m.get('unit_id','?'); probs = []
        w = work.get(uid)
        if not w:
            report.append((uid,['unknown unit_id'])); failures += 1; continue
        if (m.get('notes') or '').startswith('BLOCKED'):
            report.append((uid, [f"BLOCKED (accepted): {m['notes'][:90]}"])); continue
        title = (m.get('title') or '').strip()
        if title != (w['new_title'] or '').strip(): probs.append('title != work order new_title')
        if len(title) > 60: probs.append(f'title {len(title)} chars > 60')
        meta = (m.get('meta_description') or '').strip()
        if not meta: probs.append('meta missing')
        elif len(meta) > 155: probs.append(f'meta {len(meta)} > 155')
        if norm(title) in seen_titles: probs.append(f'duplicate title family with {seen_titles[norm(title)]}')
        seen_titles.setdefault(norm(title), uid)
        q = norm(m.get('primary_query') or '')
        if q in seen_queries: probs.append(f'duplicate primary query with {seen_queries[q]}')
        seen_queries.setdefault(q, uid)
        f = out/(m.get('filename') or f'{uid}.html')
        if not f.exists():
            probs.append('html file missing')
        else:
            body = f.read_text(encoding='utf-8')
            aud = TagAudit(); aud.feed(body)
            if aud.bad: probs.append(f'forbidden tags: {sorted(aud.bad)}')
            internal = [l for l in aud.links if l.startswith('/')]
            bad_links = [l for l in internal if l not in allow]
            if bad_links: probs.append(f'links outside allowlist: {bad_links[:4]}')
            if '/medical-malpractice-lawyer/' not in internal and w['url'] != '/medical-malpractice-lawyer/':
                probs.append('no pillar link')
            if LICENSE not in body: probs.append('E-E-A-T block / license missing')
            if body.count('<li><a ') + body.count('<li> <a') < 2 and 'מקורות' in body:
                probs.append('fewer than 2 linked sources')
            if 'מקורות' not in body: probs.append('sources section missing')
            for ph in FORBIDDEN:
                if ph in body: probs.append(f'forbidden phrase: {ph}')
            words = len(re.sub(r'<[^>]+>',' ', body).split())
            declared = int(float(m.get('word_count') or 0))
            if declared and abs(words-declared)/max(declared,1) > 0.3:
                probs.append(f'word_count declared {declared} vs actual ~{words}')
            todos = re.findall(r'\[TODO-VERIFY:[^\]]*\]', body)
            if str(len(todos)) != (m.get('todo_verify_count') or '0').strip():
                probs.append(f'todo count mismatch: body {len(todos)} vs manifest {m.get("todo_verify_count")}')
            if 'שאלות נפוצות' not in body: probs.append('FAQ section missing')
        if probs: failures += 1
        report.append((uid, probs or ['OK']))
    done_units = {m['unit_id'] for m in man}
    missing = [u for u in work if u not in done_units]
    print(f'=== QA GAUNTLET: {len(man)} units in manifest, {len(missing)} missing, {failures} failing ===')
    for uid, probs in report:
        print(f'{uid}: ' + ('OK' if probs==['OK'] else ' | '.join(probs)))
    if missing: print('MISSING UNITS:', missing)
    sys.exit(1 if (failures or missing) else 0)

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'output')
