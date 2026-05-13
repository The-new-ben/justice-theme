/**
 * Family Law Decision Map Builder
 * ────────────────────────────────
 * Reads family-law-cluster.csv and assigns:
 *   PILLAR / SUPPORT / MERGE / REDIRECT / CASE_LAW
 * For merge/redirect targets, assigns the destination article.
 *
 * NO LIVE CHANGES — produces decision CSV for human review.
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, '../../project-control/content-master/family-law-cluster.csv');
const OUTPUT = path.resolve(__dirname, '../../project-control/content-master/family-law-decision-map.csv');
const REPORT = path.resolve(__dirname, '../../project-control/content-master/family-law-decision-report.md');

// ── CSV Parser ──────────────────────────────────────────────────────
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
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else current += ch;
  }
  result.push(current);
  return result;
}

// ── Court Ruling Detection ──────────────────────────────────────────
function isCourtRuling(title) {
  const t = (title || '').toLowerCase();
  const indicators = [
    'פסק דין', 'פס"ד', 'פסד', 'תיק', 'תמ"ש', 'תלה"מ',
    'ע"א', 'בג"ץ', 'ביה"ד', 'ביהמ"ש', 'השופט', 'השופטת',
    'גזר דין', 'ערעור',
    // HTML entities from WordPress
    '&#8221;', '&#8217;',
  ];
  // Check if title starts with or contains court ruling markers
  const hasIndicator = indicators.some(ind => t.includes(ind));
  // Also check for case number patterns like 12345-01-24
  const hasCaseNum = /\d{4,}-\d{2}-\d{2}/.test(title) || /\d{6,}\/\d+/.test(title);
  return hasIndicator || hasCaseNum;
}

// ── MAIN ────────────────────────────────────────────────────────────
function main() {
  console.log('Reading family law cluster...');
  const raw = fs.readFileSync(INPUT, 'utf-8');
  const { rows } = parseCSV(raw);
  console.log(`Total family law articles: ${rows.length}`);

  // Group by subtopic
  const bySubtopic = {};
  for (const r of rows) {
    const st = r.subtopic || 'other_family';
    if (!bySubtopic[st]) bySubtopic[st] = [];
    bySubtopic[st].push(r);
  }

  // For each subtopic, sort by depth_score desc, then word_count desc
  for (const st of Object.keys(bySubtopic)) {
    bySubtopic[st].sort((a, b) => {
      const scoreA = parseInt(a.depth_score) || 0;
      const scoreB = parseInt(b.depth_score) || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (parseInt(b.word_count) || 0) - (parseInt(a.word_count) || 0);
    });
  }

  // Decision assignment
  const decisions = [];

  for (const [subtopic, articles] of Object.entries(bySubtopic)) {
    // Separate court rulings from guides
    const guides = [];
    const rulings = [];
    for (const a of articles) {
      if (isCourtRuling(a.title)) rulings.push(a);
      else guides.push(a);
    }

    // Pick pillar from guides (highest scoring non-court-ruling)
    let pillarId = null;
    let pillarTitle = '';

    if (guides.length > 0) {
      const pillar = guides[0];
      const score = parseInt(pillar.depth_score) || 0;
      const wc = parseInt(pillar.word_count) || 0;

      // Only make pillar if score >= 50 and wc >= 1500
      if (score >= 50 && wc >= 1500) {
        pillarId = pillar.post_id;
        pillarTitle = pillar.title;
        decisions.push({
          ...pillar,
          decision: 'MAKE_PILLAR',
          target_id: '',
          target_title: '',
          article_type: 'guide',
          notes: `Best guide for ${subtopic} subtopic`,
        });
      } else {
        // No pillar-worthy article — strongest is still SUPPORT
        pillarId = pillar.post_id;
        pillarTitle = pillar.title;
        decisions.push({
          ...pillar,
          decision: 'SUPPORT_UPGRADE',
          target_id: '',
          target_title: '',
          article_type: 'guide',
          notes: `Best article for ${subtopic} but needs content expansion to become pillar`,
        });
      }

      // Process remaining guides
      for (let i = 1; i < guides.length; i++) {
        const g = guides[i];
        const score = parseInt(g.depth_score) || 0;
        const wc = parseInt(g.word_count) || 0;

        if (score >= 50 && wc >= 1500) {
          decisions.push({
            ...g,
            decision: 'SUPPORT',
            target_id: pillarId,
            target_title: pillarTitle.substring(0, 50),
            article_type: 'guide',
            notes: `Good supporting article — link to pillar ${pillarId}`,
          });
        } else if (score >= 30 || wc >= 800) {
          decisions.push({
            ...g,
            decision: 'UPGRADE_OR_MERGE',
            target_id: pillarId,
            target_title: pillarTitle.substring(0, 50),
            article_type: 'guide',
            notes: `Content thin — upgrade to standalone or merge into pillar ${pillarId}`,
          });
        } else {
          decisions.push({
            ...g,
            decision: 'MERGE_REDIRECT',
            target_id: pillarId,
            target_title: pillarTitle.substring(0, 50),
            article_type: 'guide',
            notes: `Too thin to stand alone — 301 redirect to pillar ${pillarId}`,
          });
        }
      }
    }

    // Process court rulings
    for (const r of rulings) {
      const score = parseInt(r.depth_score) || 0;
      const wc = parseInt(r.word_count) || 0;

      if (wc >= 3000) {
        decisions.push({
          ...r,
          decision: 'CASE_LAW_KEEP',
          target_id: pillarId || '',
          target_title: (pillarTitle || '').substring(0, 50),
          article_type: 'case_law',
          notes: `Substantial court ruling — keep as case law, link from ${subtopic} pillar`,
        });
      } else if (wc >= 800) {
        decisions.push({
          ...r,
          decision: 'CASE_LAW_ENRICH',
          target_id: pillarId || '',
          target_title: (pillarTitle || '').substring(0, 50),
          article_type: 'case_law',
          notes: `Court ruling needs analysis expansion — add commentary and practical takeaways`,
        });
      } else {
        decisions.push({
          ...r,
          decision: 'CASE_LAW_MERGE',
          target_id: pillarId || '',
          target_title: (pillarTitle || '').substring(0, 50),
          article_type: 'case_law',
          notes: `Thin court ruling — merge into case law digest or redirect to related guide`,
        });
      }
    }
  }

  // Sort decisions by subtopic then decision priority
  const decisionOrder = {
    'MAKE_PILLAR': 0, 'SUPPORT': 1, 'SUPPORT_UPGRADE': 2,
    'UPGRADE_OR_MERGE': 3, 'CASE_LAW_KEEP': 4, 'CASE_LAW_ENRICH': 5,
    'MERGE_REDIRECT': 6, 'CASE_LAW_MERGE': 7,
  };
  decisions.sort((a, b) => {
    if (a.subtopic !== b.subtopic) return (a.subtopic || '').localeCompare(b.subtopic || '');
    return (decisionOrder[a.decision] || 99) - (decisionOrder[b.decision] || 99);
  });

  // Write decision CSV
  const outHeaders = [
    'post_id', 'title', 'current_url', 'word_count', 'depth_score',
    'subtopic', 'article_type', 'decision', 'target_id', 'target_title',
    'quality_status', 'notes',
  ];

  let csv = outHeaders.join(',') + '\n';
  for (const d of decisions) {
    const values = outHeaders.map(h => {
      const v = (d[h] || '').toString();
      return v.includes(',') || v.includes('"') || v.includes('\n')
        ? `"${v.replace(/"/g, '""')}"` : v;
    });
    csv += values.join(',') + '\n';
  }
  fs.writeFileSync(OUTPUT, csv, 'utf-8');
  console.log(`Wrote: ${OUTPUT}`);

  // Generate report
  const decCounts = {};
  const typeCounts = {};
  for (const d of decisions) {
    decCounts[d.decision] = (decCounts[d.decision] || 0) + 1;
    typeCounts[d.article_type] = (typeCounts[d.article_type] || 0) + 1;
  }

  let report = `# Family Law Cluster — Decision Map Report\n`;
  report += `## Generated: ${new Date().toISOString().slice(0, 16)}\n\n`;

  report += `## Decision Summary\n`;
  report += `| Decision | Count | What It Means |\n`;
  report += `|----------|-------|---------------|\n`;
  report += `| MAKE_PILLAR | ${decCounts['MAKE_PILLAR'] || 0} | Becomes the main landing page for its sub-topic |\n`;
  report += `| SUPPORT | ${decCounts['SUPPORT'] || 0} | Strong supporting article — links to pillar |\n`;
  report += `| SUPPORT_UPGRADE | ${decCounts['SUPPORT_UPGRADE'] || 0} | Best in subtopic but needs expansion |\n`;
  report += `| UPGRADE_OR_MERGE | ${decCounts['UPGRADE_OR_MERGE'] || 0} | Moderate content — upgrade or merge into pillar |\n`;
  report += `| MERGE_REDIRECT | ${decCounts['MERGE_REDIRECT'] || 0} | Too thin — 301 redirect to pillar |\n`;
  report += `| CASE_LAW_KEEP | ${decCounts['CASE_LAW_KEEP'] || 0} | Substantial court ruling — keep in case library |\n`;
  report += `| CASE_LAW_ENRICH | ${decCounts['CASE_LAW_ENRICH'] || 0} | Court ruling needs analysis added |\n`;
  report += `| CASE_LAW_MERGE | ${decCounts['CASE_LAW_MERGE'] || 0} | Thin ruling — merge into digest |\n`;

  report += `\n## Article Type Breakdown\n`;
  report += `| Type | Count |\n|------|-------|\n`;
  for (const [k, v] of Object.entries(typeCounts)) {
    report += `| ${k} | ${v} |\n`;
  }

  report += `\n## Pillar Pages Selected\n`;
  report += `| Sub-topic | Post ID | Title | Word Count | Depth Score |\n`;
  report += `|-----------|---------|-------|-----------|-------------|\n`;
  for (const d of decisions.filter(x => x.decision === 'MAKE_PILLAR')) {
    const t = (d.title || '').substring(0, 55).replace(/\|/g, '\\|');
    report += `| ${d.subtopic} | ${d.post_id} | ${t} | ${d.word_count} | ${d.depth_score} |\n`;
  }

  report += `\n## Sub-topics Without Pillars (need new content)\n`;
  const pillarSubtopics = new Set(decisions.filter(x => x.decision === 'MAKE_PILLAR').map(x => x.subtopic));
  const allSubtopics = [...new Set(decisions.map(x => x.subtopic))];
  const missingPillars = allSubtopics.filter(s => !pillarSubtopics.has(s));
  for (const s of missingPillars) {
    const count = decisions.filter(x => x.subtopic === s).length;
    report += `- **${s}**: ${count} articles exist but none qualify as pillar (all need expansion)\n`;
  }

  report += `\n## Redirect Map Preview (MERGE_REDIRECT articles)\n`;
  report += `| From (Post ID) | From Title | → To (Post ID) | To Title |\n`;
  report += `|----------------|-----------|-----------------|----------|\n`;
  for (const d of decisions.filter(x => x.decision === 'MERGE_REDIRECT').slice(0, 30)) {
    const fromT = (d.title || '').substring(0, 40).replace(/\|/g, '\\|');
    const toT = (d.target_title || '').substring(0, 40).replace(/\|/g, '\\|');
    report += `| ${d.post_id} | ${fromT} | ${d.target_id} | ${toT} |\n`;
  }

  report += `\n---\n`;
  report += `## NEXT STEPS\n`;
  report += `1. **OWNER REVIEW**: Review this decision map, especially MAKE_PILLAR and MERGE_REDIRECT decisions\n`;
  report += `2. **CONTENT GAPS**: Cross-reference with content-gap-map.csv — write missing articles\n`;
  report += `3. **REDIRECT MAP**: After approval, generate the final 301 redirect list\n`;
  report += `4. **CONTENT UPGRADE**: For UPGRADE_OR_MERGE articles, decide case-by-case\n`;
  report += `5. **DO NOT EXECUTE** until this map is approved by the site owner\n`;

  fs.writeFileSync(REPORT, report, 'utf-8');
  console.log(`Wrote: ${REPORT}`);
  console.log('\nDone!');
}

main();
