const fs = require('fs');

function parseCsv(content) {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const cols = []; let cur = '', inQ = false;
    for (const c of line) {
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { cols.push(cur); cur = ''; }
      else { cur += c; }
    }
    cols.push(cur);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = cols[i] || '');
    return obj;
  });
  return { headers, rows };
}

// Read WP inventory
const wpFile = fs.readFileSync('c:/Users/pro/justice/project-control/full-inventory.csv', 'utf8');
const { rows: wpRows } = parseCsv(wpFile);

// Read GSC data (12m)
let gscRows = [];
try {
  const gscFile = fs.readFileSync('c:/Users/pro/justice/justice-theme/reports/gsc/performance-pages.csv', 'utf8');
  gscRows = parseCsv(gscFile).rows;
} catch (e) { console.error('GSC file not found', e); }

const gscMap = {};
gscRows.forEach(r => {
  const url = decodeURIComponent(r.page || '').replace(/\/$/, '').toLowerCase();
  gscMap[url] = r;
});

// Write Master CSV
const columns = [
  'post_id','post_type','status','current_url','current_slug','proposed_new_url','proposed_english_slug',
  'title','h1','seo_title','meta_description','word_count','content_length','content_hash','date_published',
  'date_modified','author','categories','tags','practice_area','city','parent_page','current_canonical',
  'proposed_canonical','internal_links_in','internal_links_out','media_count','featured_image','gsc_clicks_3m',
  'gsc_impressions_3m','gsc_ctr_3m','gsc_position_3m','gsc_clicks_12m','gsc_impressions_12m','top_queries',
  'primary_keyword','secondary_keywords','search_intent','topic_cluster','pillar_candidate','supporting_page_candidate',
  'duplicate_title_risk','duplicate_topic_risk','cannibalization_group','traffic_value','traffic_risk',
  'content_quality_score','quality_status','recommended_action','redirect_required','redirect_target',
  'import_ready','owner_approval_required','notes','last_reviewed_by','last_reviewed_at'
];

let csvContent = columns.join(',') + '\n';

wpRows.forEach(wp => {
  const cleanUrl = decodeURIComponent(wp.url || '').replace(/\/$/, '').toLowerCase();
  const gsc = gscMap[cleanUrl] || {};

  // Classify traffic risk
  let trafficRisk = 'UNKNOWN';
  const clicks = +(gsc.clicks || 0);
  if (clicks > 50) trafficRisk = 'HIGH';
  else if (clicks > 10) trafficRisk = 'MEDIUM';
  else if (clicks >= 0) trafficRisk = 'LOW';

  // Determine cluster based on URL heuristics
  let cluster = 'UNKNOWN';
  if (cleanUrl.match(/(גירושין|משפחה|מזונות|משמורת|ממון)/)) cluster = 'Family Law';
  else if (cleanUrl.match(/(פלילי|משטרה|מעצר|חקירה)/)) cluster = 'Criminal Law';

  const row = columns.map(col => {
    let val = 'UNKNOWN';
    if (col === 'post_id') val = wp.id;
    else if (col === 'post_type') val = 'article'; // Assuming from our export
    else if (col === 'status') val = wp.status;
    else if (col === 'current_url') val = cleanUrl;
    else if (col === 'current_slug') val = wp.slug;
    else if (col === 'title') val = wp.title;
    else if (col === 'gsc_clicks_12m') val = gsc.clicks || '0';
    else if (col === 'gsc_impressions_12m') val = gsc.impressions || '0';
    else if (col === 'gsc_ctr_12m') val = gsc.ctr || '0%';
    else if (col === 'traffic_risk') val = trafficRisk;
    else if (col === 'topic_cluster') val = cluster;
    else if (col === 'quality_status') val = 'NEEDS_MERGE_REVIEW';
    else if (col === 'recommended_action') val = 'NEEDS_OWNER_REVIEW';
    else if (col === 'import_ready') val = 'NO';
    
    // Escape for CSV
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      val = '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  });
  
  csvContent += row.join(',') + '\n';
});

fs.writeFileSync('c:/Users/pro/justice/project-control/content-master/content-master-inventory.csv', csvContent);
console.log('Master inventory created with ' + wpRows.length + ' rows.');

// Create redirect map structure
const redirectCols = ['old_url','new_url','post_id','reason','traffic_risk','gsc_clicks_3m','gsc_impressions_3m','redirect_type','approved','status','notes'];
fs.writeFileSync('c:/Users/pro/justice/project-control/content-master/redirect-map.csv', redirectCols.join(',') + '\n');
console.log('Redirect map template created.');
