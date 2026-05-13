/**
 * Filter & Score Family Law Cluster
 * ──────────────────────────────────
 * Reads content-master-inventory.csv, identifies Family Law articles
 * by title/URL keyword matching, scores each article on content depth,
 * and outputs family-law-cluster.csv with recommendations.
 *
 * NO LIVE CHANGES — analysis only.
 */

const fs = require('fs');
const path = require('path');

// ── Paths ───────────────────────────────────────────────────────────
const MASTER_CSV = path.resolve(__dirname, '../../project-control/content-master/content-master-inventory.csv');
const OUTPUT_CSV = path.resolve(__dirname, '../../project-control/content-master/family-law-cluster.csv');
const SUMMARY_FILE = path.resolve(__dirname, '../../project-control/content-master/family-law-cluster-summary.md');

// ── Hebrew keyword detection ────────────────────────────────────────
const FAMILY_LAW_KEYWORDS_HE = [
  'גירושין', 'גירושים', 'משפחה', 'מזונות', 'משמורת',
  'הסכם ממון', 'ידועים בציבור', 'ידועה בציבור',
  'גט', 'כתובה', 'שלום בית', 'בגידה',
  'הסדרי שהות', 'חזקת הגיל', 'פירוק שיתוף',
  'בן זוג', 'בת זוג', 'בני הזוג', 'נישואין', 'נישואים',
  'חלוקת רכוש', 'בית הדין הרבני', 'דין רבני', 'בית דין רבני',
  'אלימות במשפחה', 'צו הגנה', 'מגשר', 'גישור משפחתי',
  'הסכם גירושין', 'עורך דין גירושין', 'עורך דין משפחה',
  'עורך דין לענייני משפחה', 'דיני משפחה',
  'חיוב מזונות', 'מזונות אישה', 'מזונות ילדים',
  'מזונות קטינים', 'מורד', 'מורדת',
  'רכושית', 'תביעה רכושית', 'איזון משאבים',
  'פנסיה', // in divorce context
];

const FAMILY_LAW_KEYWORDS_EN = [
  'divorce', 'family-law', 'family-lawyer', 'custody',
  'child-support', 'prenup', 'marriage', 'mediation',
  'matrimonial', 'rabbinical', 'spouse', 'infidelity',
  'alimony', 'family-mediation',
];

// These are FALSE POSITIVE guards — articles about pension/property
// that are NOT family law unless they also match a family keyword
const REQUIRES_FAMILY_CONTEXT = ['פירוק שיתוף', 'פנסיה', 'רכושית'];

// ── CSV Parser (simple, handles quoted fields) ──────────────────────
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }
  return { headers, rows };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Decode URL-encoded Hebrew ───────────────────────────────────────
function decodeSlug(slug) {
  try { return decodeURIComponent(slug); }
  catch { return slug; }
}

// ── Family Law Detection ────────────────────────────────────────────
function isFamilyLaw(row) {
  // Already tagged
  if (row.topic_cluster && row.topic_cluster.toLowerCase().includes('family')) return { match: true, source: 'existing_tag' };

  const title = (row.title || '').toLowerCase();
  const slug = decodeSlug(row.current_slug || '').toLowerCase();
  const url = (row.current_url || '').toLowerCase();

  // Check Hebrew keywords in title
  for (const kw of FAMILY_LAW_KEYWORDS_HE) {
    if (title.includes(kw)) {
      // Guard against false positives
      if (REQUIRES_FAMILY_CONTEXT.includes(kw)) {
        const hasFamilyContext = FAMILY_LAW_KEYWORDS_HE.some(fk => 
          !REQUIRES_FAMILY_CONTEXT.includes(fk) && title.includes(fk)
        );
        if (!hasFamilyContext) continue;
      }
      return { match: true, source: `title_he:${kw}` };
    }
  }

  // Check Hebrew keywords in decoded slug
  for (const kw of FAMILY_LAW_KEYWORDS_HE) {
    if (slug.includes(kw)) {
      if (REQUIRES_FAMILY_CONTEXT.includes(kw)) {
        const hasFamilyContext = FAMILY_LAW_KEYWORDS_HE.some(fk =>
          !REQUIRES_FAMILY_CONTEXT.includes(fk) && (title.includes(fk) || slug.includes(fk))
        );
        if (!hasFamilyContext) continue;
      }
      return { match: true, source: `slug_he:${kw}` };
    }
  }

  // Check English keywords in URL
  for (const kw of FAMILY_LAW_KEYWORDS_EN) {
    if (url.includes(kw)) return { match: true, source: `url_en:${kw}` };
  }

  return { match: false, source: null };
}

// ── Content Depth Scoring ───────────────────────────────────────────
function scoreArticle(row) {
  const wc = parseInt(row.word_count) || 0;
  const h2 = parseInt(row.h2_count) || 0;
  const h3 = parseInt(row.h3_count) || 0;
  const extLinks = parseInt(row.external_links_out) || 0;
  const hasImg = row.has_images === 'YES';

  // Word count score (0-100)
  let wcScore = 0;
  if (wc >= 3000) wcScore = 100;
  else if (wc >= 1500) wcScore = 80;
  else if (wc >= 800) wcScore = 60;
  else if (wc >= 300) wcScore = 30;

  // Heading structure score (0-100)
  let headingScore = 0;
  const totalHeadings = h2 + h3;
  if (totalHeadings >= 8) headingScore = 100;
  else if (totalHeadings >= 5) headingScore = 70;
  else if (totalHeadings >= 2) headingScore = 40;

  // External links score (0-100) — indicates source citation
  let linkScore = 0;
  if (extLinks >= 5) linkScore = 100;
  else if (extLinks >= 3) linkScore = 70;
  else if (extLinks >= 1) linkScore = 40;

  // Image score (0-100)
  const imgScore = hasImg ? 100 : 0;

  // Weighted final score
  const depthScore = Math.round(
    wcScore * 0.35 +
    headingScore * 0.25 +
    linkScore * 0.20 +
    imgScore * 0.20
  );

  return {
    depth_score: depthScore,
    wc_score: wcScore,
    heading_score: headingScore,
    link_score: linkScore,
    img_score: imgScore,
  };
}

// ── Sub-topic Classification ────────────────────────────────────────
function classifySubtopic(title, slug) {
  const t = title.toLowerCase();
  const s = decodeSlug(slug).toLowerCase();
  const combined = t + ' ' + s;

  if (combined.includes('מזונות')) return 'child_support';
  if (combined.includes('משמורת') || combined.includes('הסדרי שהות') || combined.includes('חזקת הגיל')) return 'custody';
  if (combined.includes('הסכם ממון') || combined.includes('prenup')) return 'prenuptial';
  if (combined.includes('גט') || combined.includes('רבני') || combined.includes('rabbinical')) return 'rabbinical_court';
  if (combined.includes('אלימות') || combined.includes('צו הגנה')) return 'domestic_violence';
  if (combined.includes('בגידה') || combined.includes('infidelity')) return 'infidelity';
  if (combined.includes('גישור') || combined.includes('mediation')) return 'mediation';
  if (combined.includes('רכוש') || combined.includes('פירוק שיתוף') || combined.includes('איזון משאבים')) return 'property_division';
  if (combined.includes('ידועים') || combined.includes('common-law')) return 'common_law';
  if (combined.includes('כתובה')) return 'ketubah';
  if (combined.includes('שלום בית')) return 'reconciliation';
  if (combined.includes('הסכם גירושין')) return 'divorce_agreement';
  if (combined.includes('גירושין') || combined.includes('divorce')) return 'divorce_general';
  if (combined.includes('משפחה') || combined.includes('family')) return 'family_general';
  return 'other_family';
}

// ── Recommend Action ────────────────────────────────────────────────
function recommendAction(row, score) {
  const wc = parseInt(row.word_count) || 0;
  const qs = row.quality_status || '';

  if (qs === 'THIN' || wc < 300) return 'MERGE_OR_EXPAND';
  if (score.depth_score >= 70) return 'KEEP_AS_SUPPORT';
  if (score.depth_score >= 50) return 'UPGRADE_CONTENT';
  if (score.depth_score >= 30) return 'NEEDS_MAJOR_REWRITE';
  return 'MERGE_OR_EXPAND';
}

// ── MAIN ────────────────────────────────────────────────────────────
function main() {
  console.log('Reading master CSV...');
  const raw = fs.readFileSync(MASTER_CSV, 'utf-8');
  const { headers, rows } = parseCSV(raw);
  console.log(`Total articles: ${rows.length}`);

  // Filter for Family Law
  const familyLaw = [];
  for (const row of rows) {
    const { match, source } = isFamilyLaw(row);
    if (match) {
      const scores = scoreArticle(row);
      const subtopic = classifySubtopic(row.title || '', row.current_slug || '');
      const action = recommendAction(row, scores);
      familyLaw.push({
        ...row,
        family_law_match_source: source,
        subtopic,
        depth_score: scores.depth_score,
        wc_score: scores.wc_score,
        heading_score: scores.heading_score,
        link_score: scores.link_score,
        img_score: scores.img_score,
        cluster_action: action,
      });
    }
  }

  console.log(`Family Law articles found: ${familyLaw.length}`);

  // Sort by depth_score descending
  familyLaw.sort((a, b) => b.depth_score - a.depth_score);

  // Write filtered CSV
  const outHeaders = [
    'post_id', 'title', 'current_url', 'word_count', 'quality_status',
    'subtopic', 'depth_score', 'wc_score', 'heading_score', 'link_score',
    'img_score', 'h2_count', 'h3_count', 'external_links_out', 'has_images',
    'family_law_match_source', 'cluster_action', 'content_body_file',
    'gsc_clicks_3m', 'gsc_impressions_3m', 'traffic_risk',
  ];

  let csv = outHeaders.join(',') + '\n';
  for (const row of familyLaw) {
    const values = outHeaders.map(h => {
      const v = (row[h] || '').toString();
      return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
    });
    csv += values.join(',') + '\n';
  }
  fs.writeFileSync(OUTPUT_CSV, csv, 'utf-8');
  console.log(`Wrote: ${OUTPUT_CSV}`);

  // Generate summary
  const subtopicCounts = {};
  const actionCounts = {};
  let totalDepth = 0;
  let strongCount = 0, thinCount = 0, goodCount = 0;

  for (const r of familyLaw) {
    subtopicCounts[r.subtopic] = (subtopicCounts[r.subtopic] || 0) + 1;
    actionCounts[r.cluster_action] = (actionCounts[r.cluster_action] || 0) + 1;
    totalDepth += r.depth_score;
    if (r.quality_status === 'STRONG') strongCount++;
    else if (r.quality_status === 'THIN') thinCount++;
    else goodCount++;
  }

  const avgDepth = familyLaw.length ? Math.round(totalDepth / familyLaw.length) : 0;

  let summary = `# Family Law Cluster — Analysis Summary\n`;
  summary += `## Date: ${new Date().toISOString().slice(0, 10)}\n\n`;
  summary += `## Overview\n`;
  summary += `- **Total Family Law articles**: ${familyLaw.length} out of ${rows.length} total (${Math.round(familyLaw.length/rows.length*100)}%)\n`;
  summary += `- **Average depth score**: ${avgDepth}/100\n`;
  summary += `- **STRONG quality**: ${strongCount}\n`;
  summary += `- **GOOD_BUT_NEEDS_UPDATE**: ${goodCount}\n`;
  summary += `- **THIN**: ${thinCount}\n\n`;

  summary += `## Sub-topic Distribution\n`;
  summary += `| Sub-topic | Count |\n|-----------|-------|\n`;
  for (const [k, v] of Object.entries(subtopicCounts).sort((a, b) => b[1] - a[1])) {
    summary += `| ${k} | ${v} |\n`;
  }

  summary += `\n## Recommended Actions\n`;
  summary += `| Action | Count |\n|--------|-------|\n`;
  for (const [k, v] of Object.entries(actionCounts).sort((a, b) => b[1] - a[1])) {
    summary += `| ${k} | ${v} |\n`;
  }

  summary += `\n## Top 20 Highest Scoring Articles\n`;
  summary += `| Post ID | Title | Word Count | Depth Score | Sub-topic | Action |\n`;
  summary += `|---------|-------|-----------|-------------|-----------|--------|\n`;
  for (const r of familyLaw.slice(0, 20)) {
    const shortTitle = (r.title || '').substring(0, 60).replace(/\|/g, '\\|');
    summary += `| ${r.post_id} | ${shortTitle} | ${r.word_count} | ${r.depth_score} | ${r.subtopic} | ${r.cluster_action} |\n`;
  }

  summary += `\n## Bottom 10 Lowest Scoring Articles (Merge Candidates)\n`;
  summary += `| Post ID | Title | Word Count | Depth Score | Action |\n`;
  summary += `|---------|-------|-----------|-------------|--------|\n`;
  const bottom = familyLaw.slice(-10).reverse();
  for (const r of bottom) {
    const shortTitle = (r.title || '').substring(0, 60).replace(/\|/g, '\\|');
    summary += `| ${r.post_id} | ${shortTitle} | ${r.word_count} | ${r.depth_score} | ${r.cluster_action} |\n`;
  }

  summary += `\n## Pillar Page Candidates\n`;
  summary += `The following articles have the highest depth scores AND cover broad topics.\n`;
  summary += `These are candidates to become pillar pages or be merged into pillar pages.\n\n`;

  const pillarCandidates = familyLaw.filter(r => {
    const wc = parseInt(r.word_count) || 0;
    return r.depth_score >= 60 && wc >= 3000 && 
           ['divorce_general', 'family_general', 'child_support', 'custody'].includes(r.subtopic);
  });
  summary += `| Post ID | Title | Word Count | Depth Score | Sub-topic |\n`;
  summary += `|---------|-------|-----------|-------------|----------|\n`;
  for (const r of pillarCandidates) {
    const shortTitle = (r.title || '').substring(0, 60).replace(/\|/g, '\\|');
    summary += `| ${r.post_id} | ${shortTitle} | ${r.word_count} | ${r.depth_score} | ${r.subtopic} |\n`;
  }

  fs.writeFileSync(SUMMARY_FILE, summary, 'utf-8');
  console.log(`Wrote: ${SUMMARY_FILE}`);
  console.log('\nDone! Review the summary file for analysis.');
}

main();
