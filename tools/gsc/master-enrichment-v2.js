const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 'content-master');
const WP_DIR = path.join(BASE, 'wp-rest-export');
const GSC_DIR = path.join(BASE, 'gsc');
const MASTER = path.join(BASE, 'master-content-database.csv');
const OUTPUT = path.join(BASE, 'master-content-database-enriched-2026-05-13.csv');

function parseCsv(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) return [];
  const cols = splitLine(lines[0]);
  return lines.slice(1).filter(l => l.trim()).map(l => {
    const vals = splitLine(l);
    const obj = {};
    cols.forEach((c, i) => { obj[c] = vals[i] || ''; });
    return obj;
  });
}
function splitLine(line) {
  const r = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { if (q && line[i+1] === '"') { cur += '"'; i++; } else q = !q; }
    else if (line[i] === ',' && !q) { r.push(cur); cur = ''; }
    else cur += line[i];
  }
  r.push(cur); return r;
}
function writeCsv(file, rows, cols) {
  const h = cols.join(',');
  const body = rows.map(r => cols.map(c => {
    let v = r[c] != null ? String(r[c]) : '';
    if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g,'""') + '"';
    return v;
  }).join(',')).join('\n');
  fs.writeFileSync(file, h + '\n' + body + '\n', 'utf8');
}
function norm(u) { return (u||'').replace(/\/$/,'').toLowerCase().replace(/^http:/,'https:'); }

// Practice-area to cluster mapping
const PA_TO_CLUSTER = {
  'משפט פלילי': 'criminal-law', 'פלילי פסקי דין חשובים': 'criminal-law',
  'עורך דין פלילי פסקי דין 2022': 'criminal-law',
  'דיני משפחה': 'family-law', 'גירושין': 'family-law', 'מזונות ילדים': 'family-law',
  'משמורת ילדים': 'family-law', 'בית הדין הרבני': 'family-law',
  'בית המשפט לענייני משפחה': 'family-law',
  'פסקי דין גירושין דיני משפחה 2022': 'family-law',
  'נדל"ן': 'real-estate', 'מקרקעין': 'real-estate', 'real-estate-law': 'real-estate',
  'דיני עבודה': 'employment-law',
  'דיני תעבורה': 'traffic-law',
  'דיני נזיקין': 'personal-injury', 'פיצויים': 'personal-injury',
  'רשלנות רפואית': 'medical-malpractice',
  'ענייני ירושה': 'inheritance-wills', 'צוואות': 'inheritance-wills', 'ירושות וצוואות': 'inheritance-wills',
  'סייבר': 'cyber-privacy', 'מיסים': 'tax-law', 'ביטוח': 'insurance',
  'פורטוגל': 'notary-foreign', 'לשון הרע': 'defamation',
  'פסקי דין חשובים': 'legal-database-rulings',
  'עו"ד נזיקין פסקי דין': 'personal-injury',
  'קניין רוחני': 'intellectual-property', 'מסחרי-אזרחי': 'commercial-law',
  'שוק ההון': 'capital-markets', 'רישוי עסקים': 'business-licensing',
  'משפט מנהלי': 'administrative-law', 'איכות סביבה': 'environmental-law',
  'עורך דין': 'lawyer-directory', 'משרד המשפטים': 'legal-database-rulings',
};

function detectCluster(title, url, pa) {
  // 1. Practice area mapping first (most reliable)
  if (pa) {
    const parts = pa.split(' | ');
    for (const p of parts) {
      const mapped = PA_TO_CLUSTER[p.trim()];
      if (mapped && mapped !== 'lawyer-directory' && mapped !== 'legal-database-rulings') return mapped;
    }
    for (const p of parts) {
      const mapped = PA_TO_CLUSTER[p.trim()];
      if (mapped) return mapped;
    }
  }
  // 2. Keyword fallback
  const t = (title + ' ' + url).toLowerCase();
  if (/פלילי|criminal|arrest|shoplifting|lahav|מעצר|חקירה|נחקר|כתב.אישום|רישום.פלילי/.test(t)) return 'criminal-law';
  if (/גירושין|divorce|משפחה|family|מזונות|משמורת|כתובה|גט|rabbinical/.test(t)) return 'family-law';
  if (/נדל.ן|real.estate|מקרקעין|שכירות/.test(t)) return 'real-estate';
  if (/עבודה|employment|פיטורים|labor|dismissal/.test(t)) return 'employment-law';
  if (/רשלנות.רפואית|medical.malpractice/.test(t)) return 'medical-malpractice';
  if (/תנועה|traffic|נהיגה|תאונה/.test(t)) return 'traffic-law';
  if (/ירושה|wills|צוואה|inheritance/.test(t)) return 'inheritance-wills';
  if (/נוטריון|notary|אפוסטיל|פורטוגל/.test(t)) return 'notary-foreign';
  if (/מס |tax|מיסוי/.test(t)) return 'tax-law';
  if (/סייבר|cyber|פרטיות/.test(t)) return 'cyber-privacy';
  if (/נזיקין|tort|פיצוי|injury/.test(t)) return 'personal-injury';
  if (/פסק.דין|psakdin|rulings/.test(t)) return 'legal-database-rulings';
  return 'UNKNOWN';
}

function risk(c, i) {
  c = parseFloat(c)||0; i = parseFloat(i)||0;
  if (c >= 100 || i >= 20000) return 'HIGH';
  if (c >= 20 || i >= 2000) return 'MEDIUM';
  return 'LOW';
}

const COLS = [
  'row_id','source_system','post_id','post_type','wp_status','current_url','current_slug',
  'current_title','title','proposed_title','proposed_english_slug','proposed_new_url','canonical_url',
  'content_body_file','content_body_exists','content_body_available','word_count',
  'h1','h2_list','meta_title','meta_description','rank_math_title','rank_math_description',
  'author','reviewer','published_date','modified_date','date_published','date_modified',
  'categories','tags','practice_area','primary_cluster','secondary_cluster',
  'pillar_page','supporting_page','cluster_role',
  'primary_keyword','secondary_keywords','search_intent',
  'gsc_clicks_3m','gsc_impressions_3m','gsc_ctr_3m','gsc_position_3m',
  'gsc_clicks_12m','gsc_impressions_12m','gsc_ctr_12m','gsc_position_12m',
  'top_queries','traffic_risk','cannibalization_group','cannibalization_notes',
  'recommended_action','action_reason','redirect_required','redirect_type','redirect_target','redirect_priority',
  'internal_links_needed','internal_links_from','internal_links_to',
  'official_sources_needed','schema_needed','eeat_missing','legal_compliance_notes',
  'content_gap_notes','business_opportunity','lead_gen_opportunity',
  'lawyer_profile_opportunity','city_page_opportunity',
  'import_ready','owner_review_required','data_gaps',
  'last_reviewed_by','last_reviewed_date','agent_notes'
];

// Load
console.log('Loading...');
const master = parseCsv(MASTER);
const wpPA = parseCsv(path.join(WP_DIR, 'wp-articles-with-practice-areas.csv'));
const gsc3m = parseCsv(path.join(GSC_DIR, 'gsc_pages_3m.csv'));
const gsc12m = parseCsv(path.join(GSC_DIR, 'gsc_pages_12m.csv'));
const cannibal = parseCsv(path.join(GSC_DIR, 'gsc_cannibalization_map.csv'));
const qp3m = parseCsv(path.join(GSC_DIR, 'gsc_query_page_3m.csv'));

console.log(`Master: ${master.length} | WP+PA: ${wpPA.length} | GSC3m: ${gsc3m.length} | GSC12m: ${gsc12m.length}`);

// Lookups
const wpByUrl = {}; wpPA.forEach(a => { wpByUrl[norm(a.current_url)] = a; });
const g3 = {}; gsc3m.forEach(r => { g3[norm(r.page)] = r; });
const g12 = {}; gsc12m.forEach(r => { g12[norm(r.page)] = r; });
const cByUrl = {};
cannibal.forEach(c => {
  if (c.pages) c.pages.split(' | ').forEach(u => {
    const n = norm(u); if (!cByUrl[n]) cByUrl[n] = [];
    cByUrl[n].push(c.query);
  });
});

// Top queries per URL from query+page data
const topQByUrl = {};
qp3m.forEach(r => {
  const n = norm(r.page);
  if (!topQByUrl[n]) topQByUrl[n] = [];
  topQByUrl[n].push({ q: r.query, clicks: parseFloat(r.clicks)||0, imp: parseFloat(r.impressions)||0 });
});
Object.values(topQByUrl).forEach(arr => arr.sort((a,b) => b.clicks - a.clicks || b.imp - a.imp));

// Enrich
console.log('Enriching...');
let stats = { wpMatch: 0, g3Match: 0, g12Match: 0, cannib: 0 };

const rows = master.map((row, idx) => {
  const url = norm(row.current_url);
  const wp = wpByUrl[url];
  const gs3 = g3[url];
  const gs12 = g12[url];
  const cGroups = cByUrl[url] || [];
  const topQ = topQByUrl[url] || [];

  if (wp) stats.wpMatch++;
  if (gs3) stats.g3Match++;
  if (gs12) stats.g12Match++;
  if (cGroups.length) stats.cannib++;

  const pa = wp ? wp.practice_area_names : '';
  const title = wp ? wp.current_title : (row.title || row.current_title || '');
  const cluster = detectCluster(title, row.current_url, pa);
  const c12 = gs12 ? gs12.clicks : (row.gsc_clicks_export || '0');
  const i12 = gs12 ? gs12.impressions : (row.gsc_impressions_export || '0');
  const tr = risk(c12, i12);
  const hasBody = (row.content_body_available === 'YES' || (row.content_body_file && row.content_body_file !== '' && row.content_body_file !== 'NO_NOT_IN_ACCESSIBLE_CSV')) ? 'YES' : 'NO';

  const gaps = [];
  if (!wp) gaps.push('NEEDS_WP_MATCH');
  if (!pa) gaps.push('NEEDS_PRACTICE_AREA');
  if (hasBody !== 'YES') gaps.push('NEEDS_CONTENT_BODY');
  if (!gs3) gaps.push('NO_GSC_3M');
  gaps.push('NEEDS_BACKLINK_TOOL');

  let action = 'NEEDS_OWNER_REVIEW';
  if (tr === 'HIGH') action = 'DO_NOT_TOUCH_HIGH_TRAFFIC_URL';
  else if (!wp) action = 'NEEDS_WP_MATCH';
  else if (hasBody !== 'YES') action = 'NEEDS_CONTENT_BODY_MATCH';

  let ready = 'NO';
  if (wp && hasBody === 'YES' && gs12 && cluster !== 'UNKNOWN') ready = 'READY_FOR_REVIEW';
  if (tr === 'HIGH') ready = 'DO_NOT_TOUCH';

  const o = {};
  COLS.forEach(c => { o[c] = ''; });
  o.row_id = idx + 1;
  o.source_system = 'wp-rest+gsc-api+old-inventory';
  o.post_id = wp ? wp.post_id : (row.post_id && row.post_id !== 'UNKNOWN' ? row.post_id : 'NEEDS_WP_MATCH');
  o.post_type = wp ? wp.post_type : (row.post_type || 'UNKNOWN');
  o.wp_status = wp ? wp.wp_status : 'NEEDS_WP_PULL';
  o.current_url = row.current_url;
  o.current_slug = wp ? wp.current_slug : (row.current_slug || '');
  o.current_title = title;
  o.title = title;
  o.canonical_url = row.current_url;
  o.content_body_file = row.content_body_file || '';
  o.content_body_exists = hasBody;
  o.content_body_available = hasBody;
  o.word_count = row.word_count || '';
  o.rank_math_title = 'NEEDS_WP_REST_PULL';
  o.rank_math_description = 'NEEDS_WP_REST_PULL';
  o.author = wp ? wp.author_id : (row.author || 'UNKNOWN');
  o.reviewer = 'NEEDS_ASSIGNMENT';
  o.published_date = wp ? wp.published_date : (row.date_published || '');
  o.modified_date = wp ? wp.modified_date : (row.date_modified || '');
  o.date_published = o.published_date;
  o.date_modified = o.modified_date;
  o.categories = wp ? (wp.category_ids || '') : (row.categories || 'UNKNOWN');
  o.tags = wp ? (wp.tag_ids || '') : (row.tags || 'UNKNOWN');
  o.practice_area = pa || 'NEEDS_WP_MATCH';
  o.primary_cluster = cluster;
  o.gsc_clicks_3m = gs3 ? gs3.clicks : '0';
  o.gsc_impressions_3m = gs3 ? gs3.impressions : '0';
  o.gsc_ctr_3m = gs3 ? gs3.ctr : '0%';
  o.gsc_position_3m = gs3 ? gs3.position : 'NOT_IN_GSC_3M';
  o.gsc_clicks_12m = c12;
  o.gsc_impressions_12m = i12;
  o.gsc_ctr_12m = gs12 ? gs12.ctr : (row.gsc_ctr_export || '0%');
  o.gsc_position_12m = gs12 ? gs12.position : (row.gsc_position_export || 'NOT_IN_GSC');
  o.top_queries = topQ.slice(0,5).map(q => q.q).join(' | ');
  o.traffic_risk = tr;
  o.cannibalization_group = cGroups.slice(0,5).join(' | ');
  o.cannibalization_notes = cGroups.length ? `${cGroups.length} competing queries` : '';
  o.recommended_action = action;
  o.action_reason = tr === 'HIGH' ? 'High traffic URL - protect' : '';
  o.redirect_required = row.redirect_required || 'UNKNOWN';
  o.redirect_priority = tr === 'HIGH' ? 'CRITICAL' : (tr === 'MEDIUM' ? 'HIGH' : 'NORMAL');
  o.internal_links_needed = 'NEEDS_MAPPING';
  o.schema_needed = 'Article,BreadcrumbList';
  o.eeat_missing = 'author,reviewer,last-updated';
  o.legal_compliance_notes = 'Needs disclaimer';
  o.import_ready = ready;
  o.owner_review_required = 'YES';
  o.data_gaps = gaps.join(';');
  o.last_reviewed_by = 'agent-2026-05-13';
  o.last_reviewed_date = '2026-05-13';
  return o;
});

writeCsv(OUTPUT, rows, COLS);

// Stats
const s = (fn) => rows.filter(fn).length;
console.log('\n=== FINAL ENRICHMENT STATS ===');
console.log('Total rows: ' + rows.length);
console.log('post_id real: ' + s(r => r.post_id && r.post_id !== 'NEEDS_WP_MATCH'));
console.log('wp_status real: ' + s(r => r.wp_status && r.wp_status !== 'NEEDS_WP_PULL'));
console.log('content_body YES: ' + s(r => r.content_body_exists === 'YES'));
console.log('practice_area real: ' + s(r => r.practice_area && !r.practice_area.startsWith('NEEDS')));
console.log('categories real: ' + s(r => r.categories && r.categories !== 'UNKNOWN' && r.categories !== ''));
console.log('primary_cluster real: ' + s(r => r.primary_cluster && r.primary_cluster !== 'UNKNOWN'));
console.log('GSC 3m with data: ' + s(r => r.gsc_impressions_3m && r.gsc_impressions_3m !== '0'));
console.log('GSC 12m with data: ' + s(r => r.gsc_impressions_12m && r.gsc_impressions_12m !== '0' && r.gsc_impressions_12m !== 'UNKNOWN'));
console.log('top_queries populated: ' + s(r => r.top_queries && r.top_queries.trim() !== ''));
console.log('HIGH traffic: ' + s(r => r.traffic_risk === 'HIGH'));
console.log('MEDIUM traffic: ' + s(r => r.traffic_risk === 'MEDIUM'));
console.log('READY_FOR_REVIEW: ' + s(r => r.import_ready === 'READY_FOR_REVIEW'));
console.log('DO_NOT_TOUCH: ' + s(r => r.import_ready === 'DO_NOT_TOUCH'));
console.log('Criminal law: ' + s(r => r.primary_cluster === 'criminal-law'));
console.log('Family law: ' + s(r => r.primary_cluster === 'family-law'));
console.log('Real estate: ' + s(r => r.primary_cluster === 'real-estate'));
console.log('WP matched: ' + stats.wpMatch);
console.log('GSC 3m matched: ' + stats.g3Match);
console.log('GSC 12m matched: ' + stats.g12Match);
console.log('Cannib matched: ' + stats.cannib);
console.log('\nOutput: ' + OUTPUT);
