/**
 * master-enrichment.js
 * Rebuilds master-content-database.csv with enriched WP REST + GSC data.
 * SAFE: read-only data merge. No changes to WordPress.
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 'content-master');
const WP_DIR = path.join(BASE, 'wp-rest-export');
const GSC_DIR = path.join(BASE, 'gsc');
const MASTER = path.join(BASE, 'master-content-database.csv');
const BACKUP_DIR = path.join(BASE, 'backups');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// ── CSV Parser (simple, handles quoted fields) ───────────
function parseCsv(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) return [];
  const cols = splitCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = splitCsvLine(lines[i]);
    const obj = {};
    cols.forEach((c, idx) => { obj[c] = vals[idx] !== undefined ? vals[idx] : ''; });
    rows.push(obj);
  }
  return rows;
}

function splitCsvLine(line) {
  const result = [];
  let cur = '', inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i+1] === '"') { cur += '"'; i++; }
      else { inQuote = !inQuote; }
    } else if (ch === ',' && !inQuote) {
      result.push(cur); cur = '';
    } else { cur += ch; }
  }
  result.push(cur);
  return result;
}

function writeCsv(file, rows, cols) {
  const header = cols.join(',');
  const lines = rows.map(r => cols.map(c => {
    let v = r[c] !== undefined && r[c] !== null ? String(r[c]) : '';
    if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g, '""') + '"';
    return v;
  }).join(','));
  fs.writeFileSync(file, header + '\n' + lines.join('\n') + '\n', 'utf8');
}

function normUrl(u) { return (u || '').replace(/\/$/, '').toLowerCase().replace(/^http:/, 'https:'); }

// ── Criminal law classifier (Hebrew keyword matcher) ─────
const CRIMINAL_KEYWORDS = [
  'פלילי','פליל','חקירה','נחקר','מעצר','כתב אישום','רישום פלילי','עבירות סמים',
  'עבירות מין','עבירות אלימות','עבירות רכוש','צווארון לבן','הליך פלילי','תיק פלילי',
  'משפט פלילי','סגירת תיק','שימוע','הסדר מותנה','lahav','גנבה','שוד','מרמה','גניבה',
  'עבירה','ייעוץ לפני חקירה','crime','criminal','arrest','shoplifting','drug',
  'sex offense','violence','white collar','indictment','criminal record'
];
function isCriminal(row) {
  const text = [row.current_url, row.current_title, row.primary_cluster, row.practice_area, row.categories].join(' ').toLowerCase();
  return CRIMINAL_KEYWORDS.some(k => text.includes(k.toLowerCase()));
}

// ── Practice area classifier ──────────────────────────────
function detectCluster(row) {
  const t = [row.current_url, row.current_title, row.categories, row.practice_area].join(' ').toLowerCase();
  if (/פלילי|criminal|crime|arrest|drug|sex.offens|shoplifting|lahav|גנבה|מעצר|חקירה|נחקר|כתב אישום|רישום פלילי|violence|white.collar/.test(t)) return 'criminal-law';
  if (/גירושין|divorce|משפחה|family|מזונות|משמורת|הורות|כתובה|גט|נישואין|בית.הדין|rabbinical|פירוד|prenuptial/.test(t)) return 'family-law';
  if (/נדל.ן|real.estate|דירה|מקרקעין|שכירות|רכישה|מכירה|קניה|בית|בניה|תמ.א|חוזה שכירות/.test(t)) return 'real-estate';
  if (/עבודה|employment|פיטורים|פיצויים|הסכם.עבודה|שכר|עובד|מעביד|dismissal|labor/.test(t)) return 'employment-law';
  if (/רשלנות.רפואית|medical.malpractice|רופא|בית.חולים|רפואי|ניתוח|אבחון/.test(t)) return 'medical-malpractice';
  if (/תנועה|traffic|נהיגה|נהג|תאונה|רישיון נהיגה|דו.ח|רכב|ביטוח רכב/.test(t)) return 'traffic-law';
  if (/ירושה|wills|צוואה|עיזבון|ניהול עיזבון|inheritance|probate/.test(t)) return 'inheritance-wills';
  if (/נוטריון|notary|אפוסטיל|תרגום|ייפוי כוח|אפוסטיל/.test(t)) return 'notary-foreign';
  if (/מס|tax|מיסוי|מע.מ|מס הכנסה|הון|רווח הון/.test(t)) return 'tax-law';
  if (/סייבר|cyber|פרטיות|privacy|האקינג|הונאה מקוונת|פישינג/.test(t)) return 'cyber-privacy';
  if (/נזיקין|tort|פיצוי|נזק|accident|injury/.test(t)) return 'personal-injury';
  if (/פסק.דין|פסיקה|psakdin|rulings|court.ruling/.test(t)) return 'legal-database-rulings';
  return 'UNKNOWN';
}

function trafficRisk(clicks, impressions) {
  const c = parseFloat(clicks) || 0;
  const i = parseFloat(impressions) || 0;
  if (c >= 100 || i >= 20000) return 'HIGH';
  if (c >= 20 || i >= 2000) return 'MEDIUM';
  return 'LOW';
}

// ── FULL COLUMN SCHEMA ────────────────────────────────────
const COLUMNS = [
  'row_id','source_system','post_id','post_type','wp_status','current_url','current_slug',
  'current_title','proposed_title','proposed_english_slug','proposed_new_url','canonical_url',
  'content_body_file','content_body_exists','word_count','h1','meta_title','meta_description',
  'rank_math_title','rank_math_description','author','reviewer','published_date','modified_date',
  'categories','tags','practice_area','primary_cluster','secondary_cluster','pillar_page',
  'supporting_page','cluster_role','primary_keyword','secondary_keywords','search_intent',
  'gsc_clicks_3m','gsc_impressions_3m','gsc_ctr_3m','gsc_position_3m',
  'gsc_clicks_12m','gsc_impressions_12m','gsc_ctr_12m','gsc_position_12m',
  'top_queries','traffic_risk','cannibalization_group','cannibalization_notes',
  'recommended_action','action_reason','redirect_required','redirect_type','redirect_target',
  'redirect_priority','internal_links_needed','official_sources_needed','schema_needed',
  'eeat_missing','legal_compliance_notes','content_gap_notes','business_opportunity',
  'lead_gen_opportunity','lawyer_profile_opportunity','city_page_opportunity',
  'import_ready','owner_review_required','data_gaps','backlink_check_needed',
  'last_reviewed_by','last_reviewed_date','agent_notes'
];

// ── Load data ─────────────────────────────────────────────
console.log('Loading data sources...');
const master = parseCsv(MASTER);
const wpArticles = parseCsv(path.join(WP_DIR, 'wp-articles-enriched.csv'));
const cats = parseCsv(path.join(WP_DIR, 'wp-categories.csv'));
const pas = parseCsv(path.join(WP_DIR, 'wp-practice-areas.csv'));
const gsc3m = parseCsv(path.join(GSC_DIR, 'gsc_pages_3m.csv'));
const gsc12m = parseCsv(path.join(GSC_DIR, 'gsc_pages_12m.csv'));
const cannibal = parseCsv(path.join(GSC_DIR, 'gsc_cannibalization_map.csv'));

console.log(`Master: ${master.length} | WP: ${wpArticles.length} | Cats: ${cats.length} | PAs: ${pas.length}`);
console.log(`GSC 3m: ${gsc3m.length} | GSC 12m: ${gsc12m.length} | Cannibalization: ${cannibal.length}`);

// Build lookups
const wpByUrl = {};
wpArticles.forEach(a => { wpByUrl[normUrl(a.current_url)] = a; });

const gsc3mByUrl = {};
gsc3m.forEach(r => { gsc3mByUrl[normUrl(r.page)] = r; });

const gsc12mByUrl = {};
gsc12m.forEach(r => { gsc12mByUrl[normUrl(r.page)] = r; });

// Build cannibalization lookup by URL
const cannibByUrl = {};
cannibal.forEach(c => {
  if (c.pages) {
    c.pages.split(' | ').forEach(u => {
      const n = normUrl(u);
      if (!cannibByUrl[n]) cannibByUrl[n] = [];
      cannibByUrl[n].push(c.query);
    });
  }
});

// Build practice-area map
const paById = {};
pas.forEach(p => { paById[p.id] = p.name; });

const paBySlug = {};
pas.forEach(p => { paBySlug[p.slug] = p.name; });

// ── Enrich and rebuild each row ───────────────────────────
console.log('Enriching master rows...');
let wpMatched = 0, gsc3mMatched = 0, gsc12mMatched = 0, cannibMatched = 0;

const enriched = master.map((row, idx) => {
  const url = normUrl(row.current_url);
  const wp = wpByUrl[url];
  const g3 = gsc3mByUrl[url];
  const g12 = gsc12mByUrl[url];
  const cannibGroups = cannibByUrl[url] || [];

  if (wp) wpMatched++;
  if (g3) gsc3mMatched++;
  if (g12) gsc12mMatched++;
  if (cannibGroups.length > 0) cannibMatched++;

  // Resolve practice area from WP
  let practiceArea = row.practice_area || '';
  if (!practiceArea || practiceArea === 'UNKNOWN') {
    practiceArea = 'NEEDS_WP_REST_PULL';
  }

  // Detect primary cluster
  let cluster = row.primary_cluster || '';
  if (!cluster || cluster === 'UNKNOWN' || cluster === '') {
    const tmpRow = { ...row, categories: wp ? wp.category_names : '', practice_area: practiceArea };
    cluster = detectCluster(tmpRow);
  }

  // 12m GSC data
  const clicks12 = g12 ? g12.clicks : (row.gsc_clicks_export || '0');
  const impr12 = g12 ? g12.impressions : (row.gsc_impressions_export || '0');
  const ctr12 = g12 ? g12.ctr : (row.gsc_ctr_export || '0%');
  const pos12 = g12 ? g12.position : (row.gsc_position_export || 'NOT_IN_GSC');

  // Traffic risk
  const risk = trafficRisk(clicks12, impr12);

  // Content body
  const hasBody = (row.content_body_available === 'YES' || row.content_body_file && row.content_body_file !== '' && row.content_body_file !== 'NO_NOT_IN_ACCESSIBLE_CSV') ? 'YES' : 'NO';

  // Data gaps
  const gaps = [];
  if (!wp) gaps.push('NEEDS_WP_MATCH');
  if (!wp || !wp.category_names) gaps.push('NEEDS_CATEGORIES');
  if (hasBody !== 'YES') gaps.push('NEEDS_CONTENT_BODY');
  if (!g3) gaps.push('NEEDS_GSC_3M');
  gaps.push('NEEDS_BACKLINK_TOOL');
  if (!wp || !wp.wp_status) gaps.push('NEEDS_WP_STATUS');

  // Recommended action
  let action = row.recommended_action || 'NEEDS_OWNER_REVIEW';
  if (risk === 'HIGH') action = 'DO_NOT_TOUCH_HIGH_TRAFFIC_URL';
  else if (!wp) action = 'NEEDS_WP_MATCH';
  else if (hasBody !== 'YES') action = 'NEEDS_CONTENT_BODY_MATCH';

  // Import readiness
  let importReady = 'NO';
  let ownerReview = 'YES';
  if (wp && hasBody === 'YES' && g12 && cluster !== 'UNKNOWN') {
    importReady = 'READY_FOR_REVIEW';
    ownerReview = 'YES';
  }
  if (risk === 'HIGH') { importReady = 'DO_NOT_TOUCH'; ownerReview = 'YES'; }

  const out = {};
  COLUMNS.forEach(c => { out[c] = ''; });

  out.row_id = idx + 1;
  out.source_system = 'wp-rest-api+gsc-api+old-inventory';
  out.post_id = wp ? wp.post_id : (row.post_id || 'NEEDS_WP_MATCH');
  out.post_type = wp ? wp.post_type : (row.post_type || 'articles');
  out.wp_status = wp ? wp.wp_status : 'NEEDS_WP_PULL';
  out.current_url = row.current_url;
  out.current_slug = wp ? wp.current_slug : (row.current_slug || '');
  out.current_title = wp ? wp.current_title : (row.title || row.current_title || '');
  out.proposed_title = row.proposed_title || '';
  out.proposed_english_slug = row.proposed_english_slug || '';
  out.proposed_new_url = row.proposed_new_url || '';
  out.canonical_url = row.current_canonical || row.canonical_url || row.current_url;
  out.content_body_file = row.content_body_file || '';
  out.content_body_exists = hasBody;
  out.word_count = row.word_count || '';
  out.h1 = row.h1 || '';
  out.meta_title = row.meta_title || '';
  out.meta_description = row.meta_description || '';
  out.rank_math_title = row.rank_math_title || 'NEEDS_WP_REST_PULL';
  out.rank_math_description = row.rank_math_description || 'NEEDS_WP_REST_PULL';
  out.author = wp ? wp.author_id : (row.author || 'UNKNOWN');
  out.reviewer = 'NEEDS_ASSIGNMENT';
  out.published_date = wp ? wp.published_date : (row.date_published || '');
  out.modified_date = wp ? wp.modified_date : (row.date_modified || '');
  out.categories = wp ? wp.category_names : (row.categories || 'UNKNOWN');
  out.tags = wp ? wp.tag_names : (row.tags || 'UNKNOWN');
  out.practice_area = practiceArea;
  out.primary_cluster = cluster;
  out.secondary_cluster = row.secondary_cluster || '';
  out.pillar_page = (cluster && cluster !== 'UNKNOWN') ? `NEEDS_MAPPING_${cluster}` : '';
  out.supporting_page = '';
  out.cluster_role = '';
  out.primary_keyword = row.primary_keyword || '';
  out.secondary_keywords = row.secondary_keywords || '';
  out.search_intent = row.search_intent || '';
  out.gsc_clicks_3m = g3 ? g3.clicks : '0';
  out.gsc_impressions_3m = g3 ? g3.impressions : '0';
  out.gsc_ctr_3m = g3 ? g3.ctr : '0%';
  out.gsc_position_3m = g3 ? g3.position : 'NOT_IN_GSC_3M';
  out.gsc_clicks_12m = clicks12;
  out.gsc_impressions_12m = impr12;
  out.gsc_ctr_12m = ctr12;
  out.gsc_position_12m = pos12;
  out.top_queries = row.top_queries || '';
  out.traffic_risk = risk;
  out.cannibalization_group = cannibGroups.slice(0,5).join(' | ');
  out.cannibalization_notes = cannibGroups.length > 0 ? `${cannibGroups.length} competing queries` : '';
  out.recommended_action = action;
  out.action_reason = risk === 'HIGH' ? 'High traffic - protect before any change' : '';
  out.redirect_required = row.redirect_required || 'UNKNOWN';
  out.redirect_type = row.redirect_type || '';
  out.redirect_target = row.redirect_target || '';
  out.redirect_priority = risk === 'HIGH' ? 'CRITICAL' : (risk === 'MEDIUM' ? 'HIGH' : 'NORMAL');
  out.internal_links_needed = 'NEEDS_MAPPING';
  out.official_sources_needed = 'NEEDS_REVIEW';
  out.schema_needed = 'Article,BreadcrumbList';
  out.eeat_missing = 'author,reviewer,last-updated';
  out.legal_compliance_notes = 'Add: אין באמור ייעוץ משפטי';
  out.content_gap_notes = row.content_gap_notes || '';
  out.business_opportunity = cluster !== 'UNKNOWN' ? `Lead gen via ${cluster}` : '';
  out.lead_gen_opportunity = 'lawyer-contact-form';
  out.lawyer_profile_opportunity = 'YES';
  out.city_page_opportunity = 'YES';
  out.import_ready = importReady;
  out.owner_review_required = ownerReview;
  out.data_gaps = gaps.join(';');
  out.backlink_check_needed = 'YES_NEEDS_BACKLINK_TOOL';
  out.last_reviewed_by = 'agent-2026-05-13';
  out.last_reviewed_date = '2026-05-13';
  out.agent_notes = '';

  return out;
});

// ── Write backup and new master ───────────────────────────
ensureDir(BACKUP_DIR);
const ts = new Date().toISOString().replace(/[:.]/g,'-').slice(0,16);
fs.copyFileSync(MASTER, path.join(BACKUP_DIR, `master-content-database-${ts}.csv`));
console.log(`Backup written: master-content-database-${ts}.csv`);

const MASTER_NEW = MASTER.replace('.csv', '-rebuilt.csv');
writeCsv(MASTER_NEW, enriched, COLUMNS);
console.log(`Master written to: master-content-database-rebuilt.csv`);
console.log(`To replace: rename master-content-database-rebuilt.csv to master-content-database.csv`);
console.log(`Master rebuilt: ${enriched.length} rows, ${COLUMNS.length} columns`);

// ── Stats ─────────────────────────────────────────────────
const withId = enriched.filter(r => r.post_id && r.post_id !== 'NEEDS_WP_MATCH').length;
const withStatus = enriched.filter(r => r.wp_status && r.wp_status !== 'NEEDS_WP_PULL').length;
const withBody = enriched.filter(r => r.content_body_exists === 'YES').length;
const withCat = enriched.filter(r => r.categories && r.categories !== 'UNKNOWN' && r.categories !== '').length;
const withCluster = enriched.filter(r => r.primary_cluster && r.primary_cluster !== 'UNKNOWN').length;
const withGSC3 = enriched.filter(r => r.gsc_impressions_3m && r.gsc_impressions_3m !== '0').length;
const withGSC12 = enriched.filter(r => r.gsc_impressions_12m && r.gsc_impressions_12m !== '0' && r.gsc_impressions_12m !== 'NOT_IN_GSC').length;
const highTraffic = enriched.filter(r => r.traffic_risk === 'HIGH').length;
const readyReview = enriched.filter(r => r.import_ready === 'READY_FOR_REVIEW').length;
const criminal = enriched.filter(r => r.primary_cluster === 'criminal-law').length;

console.log('\n=== ENRICHMENT STATS ===');
console.log(`Total rows: ${enriched.length}`);
console.log(`post_id populated: ${withId} (${Math.round(withId/enriched.length*100)}%)`);
console.log(`wp_status populated: ${withStatus} (${Math.round(withStatus/enriched.length*100)}%)`);
console.log(`content body exists: ${withBody} (${Math.round(withBody/enriched.length*100)}%)`);
console.log(`categories populated: ${withCat} (${Math.round(withCat/enriched.length*100)}%)`);
console.log(`cluster classified: ${withCluster} (${Math.round(withCluster/enriched.length*100)}%)`);
console.log(`GSC 3m: ${withGSC3} | GSC 12m: ${withGSC12}`);
console.log(`HIGH traffic: ${highTraffic}`);
console.log(`Ready for review: ${readyReview}`);
console.log(`Criminal law cluster: ${criminal}`);
console.log('\nWP matched: ' + wpMatched);
console.log('GSC 3m matched: ' + gsc3mMatched);
console.log('GSC 12m matched: ' + gsc12mMatched);
console.log('Cannibalization URL matches: ' + cannibMatched);
