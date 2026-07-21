#!/usr/bin/env python3
"""READ-ONLY site quality gate for jus-tice.co.il.

Born 2026-07-21 after the criminal-pillar failure: the owner's laws, encoded
as a checker that runs BEFORE any report of "done". This script never writes
anything anywhere. It fetches rendered pages and grades them against the
pillar parity contract:

  1. Ecosystem parity: firms band (unique cards), map, booking form,
     reviewed-by entity.
  2. Upper-fold law: first conversion element (form) and map must not be
     buried; depth is reported as % of document.
  3. Language laws: no AI-tells (ChatGPT filler), no site jargon (hub), no
     banned index-membership words, no em dashes.
  4. Freshness: stale non-current years are flagged for review (never
     auto-changed; rulings and law names carry legitimate years).
  5. Link integrity: internal links must resolve 200 and not land on empty
     archives.

Usage:
  python scripts/site-audit.py                      # audit the pillar set
  python scripts/site-audit.py URL [URL ...]        # audit specific pages
  python scripts/site-audit.py --links URL          # include link crawl

Exit code: 0 all green, 1 warnings only, 2 failures. Use as a gate.
"""
import re
import sys
import urllib.request
from html import unescape

PILLARS = [
    'https://jus-tice.co.il/medical-malpractice-lawyer/',
    'https://jus-tice.co.il/divorce-lawyer/',
    'https://jus-tice.co.il/criminal-defense-attorney/',
    'https://jus-tice.co.il/inheritance-lawyer/',
    'https://jus-tice.co.il/family-law/',
]

AI_TELLS = [
    'במדריך זה', 'במאמר זה נסקור', 'אנו נסקור', 'מדריך זה יסקור', 'נעמיק ונבחן',
    'חשוב לציין ש', 'ראוי לציין ש', 'יש לציין ש', 'כפי שציינו',
    'לסיכום,', 'לסיכומו של דבר', 'בשורה התחתונה',
    'בעידן המודרני', 'בעידן הדיגיטלי', 'בעולם של היום',
    'יתרה מכך', 'זאת ועוד', 'אין ספק ש', 'למותר לציין',
    'צלילה עמוקה', 'אבן דרך משמעותית', 'מגוון רחב של',
    'הן עבור', 'תובנות מעשיות', 'ננווט יחד',
]

JARGON = ['hub', 'האב של', 'עמוד ראשי מסוג', 'CMS', 'SEO קילר']
BANNED = ['מהמאגר המאומת', 'באינדקס שלנו', 'במאגר שלנו', 'אינדקס עורכי דין',
          'מאגר עורכי הדין של', 'במאגר של Jus-Tice']
CURRENT_YEAR = 2026

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) jus-tice-quality-gate/1.0'


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read().decode('utf-8', errors='ignore')


def norm_key(title):
    return re.sub(r'[^א-תa-z0-9]', '', title.lower())[:18]


def levenshtein(a, b):
    if len(a) < len(b):
        a, b = b, a
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a):
        cur = [i + 1]
        for j, cb in enumerate(b):
            cur.append(min(prev[j + 1] + 1, cur[j] + 1, prev[j] + (ca != cb)))
        prev = cur
    return prev[-1]


def audit_page(url, check_links=False):
    fails, warns = [], []
    try:
        status, h = fetch(url)
    except Exception as e:
        return [f'FETCH FAILED: {e}'], []
    if status != 200:
        return [f'HTTP {status}'], []
    visible_html = re.sub(
        r'<script[^>]*>.*?</script>|<style[^>]*>.*?</style>', ' ', h, flags=re.S)
    text = re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', ' ', visible_html)))
    size = len(h)

    # 1. ecosystem parity
    names = [n.strip() for n in re.findall(
        r'lawyer-card__name[^>]*>\s*(?:<a[^>]*>)?\s*([^<]{3,60})', h)]
    if not names:
        fails.append('band: NO firm cards')
    else:
        keys = [norm_key(n) for n in names]
        twins = [(a, b) for i, a in enumerate(keys) for b in keys[i + 1:]
                 if a == b or levenshtein(a, b) <= 4]
        if twins:
            fails.append(f'band: duplicate/twin firms {len(twins)}')
        if len(names) < 6:
            warns.append(f'band: only {len(names)} cards')
    if h.find('jtcm-') < 0 and h.find('legal-map') < 0:
        fails.append('map: missing')
    if 'נבדק על ידי' not in h:
        fails.append('reviewed-by: missing')

    # 2. upper-fold law — measured in VISIBLE-TEXT position (raw-byte offsets
    # overstate depth because of head/schema/minified chrome).
    def text_depth(byte_pos):
        visible_before = len(re.sub(r'\s+', ' ', re.sub(
            r'<[^>]+>', ' ', re.sub(
                r'<script[^>]*>.*?</script>|<style[^>]*>.*?</style>', ' ',
                h[:byte_pos], flags=re.S))))
        total = len(text)
        return round(100 * visible_before / total) if total else 0

    def chars_before(byte_pos):
        return len(re.sub(r'\s+', ' ', re.sub(
            r'<[^>]+>', ' ', re.sub(
                r'<script[^>]*>.*?</script>|<style[^>]*>.*?</style>', ' ',
                h[:byte_pos], flags=re.S))))

    # The blind-librarian law (owner, 2026-07-21): TEXT first, then the
    # engagement block in the lower upper fold. Google reads the page like
    # braille: the first thing after the H1 must be relevant text, never a
    # widget wall. So: at least ~1200 visible chars of text between the H1
    # and the first widget (band/map), the widgets present and sitting in
    # the middle zone (not buried past 75%), and a form on the page.
    forms = [m.start() for m in re.finditer(r'<form', h)]
    band_pos = min([p for p in (
        h.find('lawyer-card__name'), h.find('jt-registered-band')) if p > 0],
        default=-1)
    map_pos = max(h.find('jtcm-'), h.find('legal-map'))
    h1_pos = h.find('<h1')
    base = chars_before(h1_pos) if h1_pos > 0 else 0

    def after_h1(p):
        return max(0, chars_before(p) - base)

    if not forms:
        fails.append('form: missing')
    first_widget = min([p for p in (band_pos, map_pos) if p > 0], default=-1)
    if first_widget > 0:
        lead_text = after_h1(first_widget)
        if lead_text < 1200:
            fails.append(
                f'text-first: only {lead_text} visible chars between the H1 '
                f'and the first widget (need 1200+)')
        depth = text_depth(first_widget)
        if depth > 75:
            warns.append(f'engagement block buried at {depth}%')
    mappos = max(h.find('jtcm-'), h.find('legal-map'))
    if mappos > 0 and text_depth(mappos) > 65:
        warns.append(f'map: deep at {text_depth(mappos)}% of visible text')

    # 3. language laws
    for t in AI_TELLS:
        n = text.count(t)
        if n:
            fails.append(f'AI-tell: "{t}" x{n}')
    for t in JARGON:
        n = len(re.findall(re.escape(t), text, re.I)) if t.isascii() else text.count(t)
        if n:
            fails.append(f'jargon: "{t}" x{n}')
    for t in BANNED:
        if t in text:
            fails.append(f'BANNED WORD: "{t}"')
    if chr(8212) in h:
        fails.append(f'em-dash x{h.count(chr(8212))}')

    # 4. freshness (flag only, human decides); ISO dates and datetime
    # attributes are metadata, not stale copy.
    text_no_dates = re.sub(r'\b\d{4}-\d{2}-\d{2}\b', ' ', text)
    for y in range(2020, CURRENT_YEAR):
        n = len(re.findall(rf'\b{y}\b', text_no_dates))
        if n > 3:
            warns.append(f'year {y} appears x{n} (review: factual or stale?)')

    # 5. link integrity (sampled)
    if check_links:
        links = list(dict.fromkeys(re.findall(
            r'href="(https://jus-tice\.co\.il/[^"#?]+/)"', h)))[:25]
        for link in links:
            try:
                st, lh = fetch(link, timeout=20)
                if st != 200:
                    fails.append(f'link {link} -> HTTP {st}')
                elif ('לא נמצאו' in lh or 'אין תוצאות' in lh) and \
                        len(re.findall(r'<article', lh)) == 0:
                    fails.append(f'link {link} -> EMPTY archive')
            except Exception as e:
                fails.append(f'link {link} -> {type(e).__name__}')
    return fails, warns


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check_links = '--links' in sys.argv
    urls = args or PILLARS
    worst = 0
    for url in urls:
        fails, warns = audit_page(url, check_links)
        mark = 'FAIL' if fails else ('WARN' if warns else 'PASS')
        worst = max(worst, 2 if fails else (1 if warns else 0))
        print(f'[{mark}] {url}')
        for f in fails:
            print(f'   FAIL {f}')
        for w in warns:
            print(f'   warn {w}')
    sys.exit(worst)


if __name__ == '__main__':
    main()
