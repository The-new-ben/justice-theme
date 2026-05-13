const fs = require('fs');
const path = require('path');

const masterCsvPath = 'c:/Users/pro/justice/project-control/content-master/content-master-inventory.csv';
const bodiesDir = 'c:/Users/pro/justice/project-control/content-master/content-bodies';

// Parse existing CSV
function parseCsv(content) {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map(h=>h.trim());
  const rows = lines.slice(1).map(line => {
    const cols = []; let cur = '', inQ = false;
    for (const c of line) {
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { cols.push(cur); cur = ''; }
      else { cur += c; }
    }
    cols.push(cur);
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] || '');
    return obj;
  });
  return { headers, rows };
}

async function fetchAndEnrich() {
  const csvContent = fs.readFileSync(masterCsvPath, 'utf8');
  let { headers, rows } = parseCsv(csvContent);
  
  // Ensure new columns exist
  const newCols = ['word_count', 'h1_count', 'h2_count', 'h3_count', 'internal_links_out', 'external_links_out', 'has_images', 'content_body_file'];
  newCols.forEach(col => { if (!headers.includes(col)) headers.push(col); });

  let p = 1;
  const url = 'https://jus-tice.co.il/wp-json/wp/v2/articles?per_page=100&page=';
  
  const fetchedPosts = {};
  while (true) {
    try {
      const res = await fetch(url + p);
      if (!res.ok) break;
      const data = await res.json();
      if (!data || data.length === 0) break;
      data.forEach(post => { fetchedPosts[post.id] = post; });
      console.log('Fetched page ' + p + ', total posts in memory: ' + Object.keys(fetchedPosts).length);
      p++;
    } catch (e) {
      console.error(e);
      break;
    }
  }

  // Enrich rows
  rows = rows.map(row => {
    const post = fetchedPosts[row.post_id];
    if (post && post.content && post.content.rendered) {
      const html = post.content.rendered;
      const plainText = html.replace(/<[^>]+>/g, ' ');
      const words = plainText.split(/\s+/).filter(w => w.length > 0).length;
      
      const h1s = (html.match(/<h1[^>]*>/gi) || []).length;
      const h2s = (html.match(/<h2[^>]*>/gi) || []).length;
      const h3s = (html.match(/<h3[^>]*>/gi) || []).length;
      const imgs = (html.match(/<img[^>]*>/gi) || []).length > 0 ? 'YES' : 'NO';
      
      const aTags = html.match(/<a\s+[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
      let intLinks = 0, extLinks = 0;
      aTags.forEach(a => {
        if (a.includes('jus-tice.co.il') || a.match(/href=["']\//)) intLinks++;
        else if (!a.match(/href=["'](#|mailto:|tel:)/)) extLinks++;
      });

      row.word_count = words;
      row.h1_count = h1s;
      row.h2_count = h2s;
      row.h3_count = h3s;
      row.internal_links_out = intLinks;
      row.external_links_out = extLinks;
      row.has_images = imgs;
      
      // Save body
      const slug = post.slug || 'no-slug';
      const fileName = `post-${post.id}-${slug}.md`;
      const mdContent = `# ${post.title.rendered}\n\n${html}`;
      fs.writeFileSync(path.join(bodiesDir, fileName), mdContent);
      row.content_body_file = fileName;
      
      // Basic quality check
      if (words < 300) row.quality_status = 'THIN';
      else if (words > 1500) row.quality_status = 'STRONG';
      else row.quality_status = 'GOOD_BUT_NEEDS_UPDATE';
      
    } else {
      row.word_count = row.word_count || '0';
    }
    return row;
  });

  // Write updated CSV
  const outCsv = [headers.join(',')];
  rows.forEach(r => {
    outCsv.push(headers.map(h => {
      let val = String(r[h] || '');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    }).join(','));
  });
  fs.writeFileSync(masterCsvPath, outCsv.join('\n'));
  console.log('Master CSV updated with content metrics and bodies saved.');
}

fetchAndEnrich();
