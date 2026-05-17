#!/usr/bin/env node
/**
 * Cycle 1A: WordPress URL inventory export via REST API.
 * Pulls all articles, pages, posts, practice-areas, categories, lawyers.
 * Outputs: output/crawl/wp-url-inventory.csv
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE = 'https://jus-tice.co.il';
const REST = `${SITE}/wp-json/wp/v2`;
const OUT = path.join(__dirname, '..', 'output', 'crawl', 'wp-url-inventory.csv');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SEO-Rescue/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    }).on('error', reject);
  });
}

async function fetchAll(endpoint, fields) {
  const items = []; let page = 1, total = 1;
  while (page <= total) {
    const url = `${endpoint}?per_page=100&page=${page}&_fields=${fields}`;
    const r = await get(url);
    if (r.status !== 200) break;
    const data = JSON.parse(r.body);
    if (!Array.isArray(data) || !data.length) break;
    items.push(...data);
    if (page === 1 && r.headers['x-wp-totalpages']) total = parseInt(r.headers['x-wp-totalpages']);
    process.stdout.write(`\r  ${endpoint.split('/').pop()}: page ${page}/${total} (${items.length} items)`);
    page++;
  }
  console.log('');
  return items;
}

function esc(s) { return `"${String(s||'').replace(/"/g,'""').replace(/\n/g,' ')}"`; }

async function main() {
  console.log('=== WP URL INVENTORY EXPORT ===\n');

  console.log('Fetching articles...');
  const articles = await fetchAll(`${REST}/articles`, 'id,slug,title,link,status,modified,categories,practice-areas');

  console.log('Fetching pages...');
  const pages = await fetchAll(`${REST}/pages`, 'id,slug,title,link,status,modified');

  console.log('Fetching posts...');
  const posts = await fetchAll(`${REST}/posts`, 'id,slug,title,link,status,modified,categories');

  console.log('Fetching practice-areas...');
  const pa = await fetchAll(`${REST}/practice-areas`, 'id,slug,name,link,count');

  console.log('Fetching categories...');
  const cats = await fetchAll(`${REST}/categories`, 'id,slug,name,link,count');

  console.log('Fetching lawyers...');
  const lawyers = await fetchAll(`${REST}/justice_lawyer`, 'id,slug,title,link,status,modified');

  // Build CSV
  const header = 'post_id,post_type,status,title,slug,current_url,current_path,has_articles_prefix,modified,practice_areas,categories,source\n';
  const rows = [];

  for (const a of articles) {
    const t = (a.title?.rendered || '').replace(/<[^>]*>/g,'');
    const link = (a.link||'').replace(/^http:/,'https:');
    const p = new URL(link).pathname;
    rows.push([a.id,'article','publish',esc(t),esc(a.slug),esc(link),esc(p),p.startsWith('/articles/')?'YES':'NO',a.modified||'',esc((a['practice-areas']||[]).join(';')),esc((a.categories||[]).join(';')),'REST_API'].join(','));
  }
  for (const pg of pages) {
    const t = (pg.title?.rendered || '').replace(/<[^>]*>/g,'');
    const link = (pg.link||'').replace(/^http:/,'https:');
    const p = new URL(link).pathname;
    rows.push([pg.id,'page',pg.status||'publish',esc(t),esc(pg.slug),esc(link),esc(p),p.startsWith('/articles/')?'YES':'NO',pg.modified||'','','','REST_API'].join(','));
  }
  for (const po of posts) {
    const t = (po.title?.rendered || '').replace(/<[^>]*>/g,'');
    const link = (po.link||'').replace(/^http:/,'https:');
    const p = new URL(link).pathname;
    rows.push([po.id,'post',po.status||'publish',esc(t),esc(po.slug),esc(link),esc(p),p.startsWith('/articles/')?'YES':'NO',po.modified||'','',esc((po.categories||[]).join(';')),'REST_API'].join(','));
  }
  for (const t of pa) {
    const link = (t.link||'').replace(/^http:/,'https:');
    const p = new URL(link).pathname;
    rows.push([t.id,'practice-area-term','publish',esc(t.name),esc(t.slug),esc(link),esc(p),p.startsWith('/articles/')?'YES':'NO','','','','REST_API'].join(','));
  }
  for (const c of cats) {
    const link = (c.link||'').replace(/^http:/,'https:');
    const p = new URL(link).pathname;
    rows.push([c.id,'category','publish',esc(c.name),esc(c.slug),esc(link),esc(p),p.startsWith('/articles/')?'YES':'NO','','','','REST_API'].join(','));
  }
  for (const l of lawyers) {
    const t = (l.title?.rendered || '').replace(/<[^>]*>/g,'');
    const link = (l.link||'').replace(/^http:/,'https:');
    const p = new URL(link).pathname;
    rows.push([l.id,'justice_lawyer',l.status||'publish',esc(t),esc(l.slug),esc(link),esc(p),p.startsWith('/articles/')?'YES':'NO',l.modified||'','','','REST_API'].join(','));
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, header + rows.join('\n'), 'utf8');

  // Summary
  const articlesWithPrefix = rows.filter(r => r.includes(',YES,')).length;
  const articlesWithoutPrefix = rows.filter(r => r.includes(',NO,')).length;
  console.log(`\n=== WP EXPORT COMPLETE ===`);
  console.log(`Total items: ${rows.length}`);
  console.log(`  Articles: ${articles.length}`);
  console.log(`  Pages: ${pages.length}`);
  console.log(`  Posts: ${posts.length}`);
  console.log(`  Practice-areas: ${pa.length}`);
  console.log(`  Categories: ${cats.length}`);
  console.log(`  Lawyers: ${lawyers.length}`);
  console.log(`  With /articles/ prefix: ${articlesWithPrefix}`);
  console.log(`  Without /articles/ prefix: ${articlesWithoutPrefix}`);
  console.log(`Saved: ${OUT}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
