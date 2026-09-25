#!/usr/bin/env python3
"""Warm the uPress Smart Varnish page cache from the sitemap (HAD-284, 25.9.2026).

Why: on 24.9.2026, 68 of 70 random URLs came back uncached (median first byte 1.48 s, /lawyers/
8.9 s). A cached page answers in about 0.06 s. The site has ~1,800 URLs and modest traffic per
URL, so most pages had expired from the cache before their next visitor arrived.

What it does: reads every URL from the Yoast sitemap index and requests each one once, the way a
visitor would (no query string: the cache key includes the query string, so ?x=1 would warm a
different entry). The cache does not vary by device, encoding or cookie (checked 25.9.2026), so
one request per URL is enough. With --refresh-age N, a page whose cached copy is already N
seconds old is purged and fetched again, so it starts a fresh lifetime instead of expiring
between two runs. Measurement mode (--sample N) requests a random sample once and reports how
many were already cached and how fast they answered.

Zero dependencies (plain python3). Read-only apart from the optional per-URL PURGE of pages
that are about to expire. Never prints or needs credentials.

Examples:
  python3 tools/cache_warmup.py --report warmup.json
  python3 tools/cache_warmup.py --refresh-age 2700 --concurrency 2
  python3 tools/cache_warmup.py --sample 70 --seed 2409 --report before.json
"""
from __future__ import annotations

import argparse
import json
import random
import statistics
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor

UA = "Mozilla/5.0 (compatible; JusticeCacheWarmer/1.0; +https://jus-tice.co.il/)"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def fetch(url: str, method: str = "GET", timeout: float = 60.0) -> dict:
    """One request. Returns status, time to first byte, total time, Age and cache flag."""
    req = urllib.request.Request(url, method=method, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    start = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            ttfb = time.perf_counter() - start
            body = resp.read()
            total = time.perf_counter() - start
            headers = resp.headers
            status = resp.status
    except urllib.error.HTTPError as err:
        return {"url": url, "status": err.code, "ttfb": round(time.perf_counter() - start, 3), "error": f"HTTP {err.code}"}
    except Exception as err:  # noqa: BLE001 - report every failure, never stop the run
        return {"url": url, "status": 0, "ttfb": round(time.perf_counter() - start, 3), "error": type(err).__name__}
    age = headers.get("Age")
    return {
        "url": url,
        "status": status,
        "ttfb": round(ttfb, 3),
        "total": round(total, 3),
        "bytes": len(body),
        "age": int(age) if age and age.isdigit() else None,
        "cacheable": headers.get("X-Cacheable"),
    }


def sitemap_urls(site: str) -> list[str]:
    """Every <loc> of every child sitemap listed in the Yoast sitemap index, same host only."""
    host = site.rstrip("/") + "/"

    def locs(url: str) -> tuple[list[str], list[str]]:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as resp:
            root = ET.fromstring(resp.read())
        maps = [e.text.strip() for e in root.findall("sm:sitemap/sm:loc", NS) if e.text]
        pages = [e.text.strip() for e in root.findall("sm:url/sm:loc", NS) if e.text]
        return maps, pages

    children, pages = locs(host + "sitemap_index.xml")
    for child in children:
        try:
            _, found = locs(child)
            pages.extend(found)
        except Exception as err:  # noqa: BLE001
            print(f"warning: sitemap {child} skipped ({type(err).__name__})", file=sys.stderr)
    seen: dict[str, None] = {}
    for url in pages:
        if url.startswith(host) and "?" not in url:
            seen.setdefault(url, None)
    return list(seen)


def warm(url: str, refresh_age: int, pause: float) -> dict:
    first = fetch(url)
    first["was_cached"] = bool(first.get("age"))
    if refresh_age and first.get("age") is not None and first["age"] >= refresh_age:
        fetch(url, method="PURGE", timeout=15)
        again = fetch(url)
        first["refreshed"] = True
        first["refresh_ttfb"] = again.get("ttfb")
        first["refresh_status"] = again.get("status")
    time.sleep(pause)
    return first


def summarize(rows: list[dict], seconds: float) -> dict:
    ok = [r for r in rows if r.get("status") == 200]
    hits = [r for r in ok if r.get("was_cached")]
    misses = [r for r in ok if not r.get("was_cached")]

    def med(values: list[float]) -> float | None:
        return round(statistics.median(values), 3) if values else None

    def p90(values: list[float]) -> float | None:
        return round(sorted(values)[int(0.9 * (len(values) - 1))], 3) if values else None

    ttfb = [r["ttfb"] for r in ok]
    return {
        "urls": len(rows),
        "ok": len(ok),
        "error_count": sum(1 for r in rows if r.get("status") != 200),
        "errors": [{"url": r["url"], "status": r.get("status"), "error": r.get("error")} for r in rows if r.get("status") != 200][:50],
        "already_cached": len(hits),
        "not_cached": len(misses),
        "refreshed": sum(1 for r in rows if r.get("refreshed")),
        "median_ttfb_all": med(ttfb),
        "p90_ttfb_all": p90(ttfb),
        "median_ttfb_cached": med([r["ttfb"] for r in hits]),
        "median_ttfb_uncached": med([r["ttfb"] for r in misses]),
        "slowest": sorted(({"url": r["url"], "ttfb": r["ttfb"]} for r in ok), key=lambda r: -r["ttfb"])[:10],
        "run_seconds": round(seconds, 1),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--site", default="https://jus-tice.co.il")
    parser.add_argument("--concurrency", type=int, default=2, help="parallel requests (keep it low: misses render in PHP)")
    parser.add_argument("--pause", type=float, default=0.2, help="seconds each worker waits between requests")
    parser.add_argument("--refresh-age", type=int, default=0, help="purge and refetch pages whose cached copy is at least this old (s)")
    parser.add_argument("--limit", type=int, default=0, help="only the first N sitemap URLs")
    parser.add_argument("--sample", type=int, default=0, help="measurement: a random sample of N URLs, no refresh")
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--extra", action="append", default=[], help="additional path to include, e.g. /lawyers/")
    parser.add_argument("--report", help="write the full JSON report here")
    args = parser.parse_args()

    urls = sitemap_urls(args.site)
    base = args.site.rstrip("/")
    for path in args.extra:
        url = base + "/" + path.strip("/") + "/"
        if url not in urls:
            urls.append(url)
    if args.sample:
        urls = random.Random(args.seed).sample(urls, min(args.sample, len(urls)))
    elif args.limit:
        urls = urls[: args.limit]
    refresh = 0 if args.sample else args.refresh_age

    start = time.perf_counter()
    with ThreadPoolExecutor(max_workers=max(1, args.concurrency)) as pool:
        rows = list(pool.map(lambda u: warm(u, refresh, args.pause), urls))
    summary = summarize(rows, time.perf_counter() - start)
    summary["mode"] = "sample" if args.sample else "warm"
    summary["refresh_age"] = refresh
    print(json.dumps(summary, ensure_ascii=False, indent=1))
    if args.report:
        with open(args.report, "w", encoding="utf-8") as fh:
            json.dump({"summary": summary, "rows": rows}, fh, ensure_ascii=False, indent=1)
    error_rate = summary["error_count"] / max(1, len(rows))
    return 1 if error_rate > 0.05 else 0


if __name__ == "__main__":
    sys.exit(main())
