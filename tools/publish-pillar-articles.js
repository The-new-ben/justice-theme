/**
 * Publish New Pillar Articles to WordPress
 * ──────────────────────────────────────────
 * Creates 6 new Family Law pillar articles as draft posts via WP REST API.
 * Each article:
 *   - Created as `articles` CPT (matching existing Family Law inventory)
 *   - Tagged with practice-areas taxonomy (family-law + specific sub-topic)
 *   - Set with article_expert_lawyer_id meta pointing to Maya Rotenberg
 *   - Published as DRAFT for owner review before going live
 *
 * Usage: node publish-pillar-articles.js --user admin --pass xxxx
 *        OR: WP_USER=admin WP_APP_PASS=xxxx node publish-pillar-articles.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Config ──────────────────────────────────────────────────────────
const SITE = 'https://jus-tice.co.il';
const ARTICLES_DIR = path.resolve(__dirname, '../../project-control/content-master/new-articles');

// Auth.
let WP_USER = process.env.WP_USER || '';
let WP_PASS = process.env.WP_APP_PASS || '';
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--user' && args[i + 1]) WP_USER = args[i + 1];
  if (args[i] === '--pass' && args[i + 1]) WP_PASS = args[i + 1];
  if (args[i] === '--publish') PUBLISH_STATUS = 'publish'; // Override to publish immediately.
}
let PUBLISH_STATUS = 'draft'; // Safe default.

if (!WP_USER || !WP_PASS) {
  console.log('Usage: node publish-pillar-articles.js --user admin --pass xxxx');
  process.exit(1);
}

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// ── Article definitions ─────────────────────────────────────────────
const ARTICLES = [
  {
    file: 'pillar-rabbinical-court-divorce.md',
    slug: 'rabbinical-court-divorce-guide',
    title: 'בית הדין הרבני — מדריך מקיף: הליך גירושין, גט, ומה שחשוב לדעת',
    subtopic: 'rabbinical-court',
    keyword: 'בית הדין הרבני גירושין',
    description: 'מדריך מקיף להליך גירושין בבית הדין הרבני: שלבים, מסמכים, עלויות, וסוגיות הלכתיות.',
  },
  {
    file: 'pillar-property-division-divorce.md',
    slug: 'property-division-divorce-guide',
    title: 'חלוקת רכוש בגירושין — מדריך מקיף: דירה, פנסיה, עסק ונכסים',
    subtopic: 'property-division',
    keyword: 'חלוקת רכוש בגירושין',
    description: 'המדריך המלא לחלוקת רכוש בגירושין בישראל: חוק יחסי ממון, דירה, פנסיה, עסק ונכסים.',
  },
  {
    file: 'pillar-domestic-violence.md',
    slug: 'domestic-violence-guide',
    title: 'אלימות במשפחה — מדריך מקיף: זכויות, צו הגנה והליכים משפטיים',
    subtopic: 'domestic-violence',
    keyword: 'אלימות במשפחה צו הגנה',
    description: 'מדריך מקיף לנפגעי אלימות במשפחה: צו הגנה, מקלטים, זכויות, ודרכי פעולה.',
  },
  {
    file: 'pillar-ketubah.md',
    slug: 'ketubah-guide',
    title: 'כתובה — המדריך המלא: משמעות משפטית, גביית כתובה וכל מה שחשוב לדעת',
    subtopic: 'ketubah',
    keyword: 'כתובה גירושין',
    description: 'מדריך מקיף בנושא כתובה: משמעות משפטית, גובה הסכום, תביעת כתובה בגירושין.',
  },
  {
    file: 'pillar-infidelity.md',
    slug: 'infidelity-marriage-guide',
    title: 'בגידה בנישואין — השלכות משפטיות, גירושין וזכויות',
    subtopic: 'infidelity',
    keyword: 'בגידה גירושין השלכות',
    description: 'מדריך מקיף על השלכות בגידה בנישואין: גירושין, כתובה, משמורת, ראיות וזכויות.',
  },
  {
    file: 'pillar-reconciliation.md',
    slug: 'reconciliation-shalom-bayit-guide',
    title: 'שלום בית — מדריך משפטי: הליכים, ייעוץ זוגי והשלכות משפטיות',
    subtopic: 'reconciliation',
    keyword: 'שלום בית תביעה',
    description: 'מדריך מקיף על שלום בית: תביעה, ייעוץ זוגי, השלכות משפטיות ומתי לנסות.',
  },
];

// ── HTTP Helpers ─────────────────────────────────────────────────────
function wpRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(SITE + apiPath);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + (url.search || ''),
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH,
        'User-Agent': 'JusticeTools/1.0',
      },
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(options, (res) => {
      let respBody = '';
      res.on('data', chunk => respBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(respBody) });
        } catch {
          resolve({ status: res.statusCode, data: respBody });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Simple Markdown to HTML (basic conversion for WP).
function mdToHtml(md) {
  let html = md;

  // Remove front matter if any (between --- markers).
  html = html.replace(/^---[\s\S]*?---\n*/m, '');

  // Remove the first H1 (will be post_title).
  html = html.replace(/^# .+\n+/m, '');

  // Headers.
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)(\s*\{#[^}]+\})?$/gm, '<h2>$1</h2>');

  // Bold.
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Blockquotes.
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Lists.
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

  // Links.
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Tables (basic pass — wrap in table tags).
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter(c => c.trim());
    if (cells.every(c => c.trim().match(/^[-:]+$/))) return ''; // separator row
    const tag = cells.length > 0 ? 'td' : 'td';
    return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
  });

  // Paragraph breaks.
  html = html.replace(/\n\n+/g, '\n\n');

  // Wrap paragraphs (lines that aren't HTML tags).
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<')) return block;
    return `<p>${block}</p>`;
  }).join('\n\n');

  // Clean up empty blocks.
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/---/g, '<hr>');

  return html;
}

// ── MAIN ────────────────────────────────────────────────────────────
async function main() {
  console.log('=== PUBLISH PILLAR ARTICLES ===\n');
  console.log(`Status: ${PUBLISH_STATUS}\n`);

  // 1. Find Maya Rotenberg's lawyer ID.
  console.log('Looking up Maya Rotenberg...');
  let mayaId = null;
  const res = await wpRequest('GET', '/wp-json/wp/v2/justice_lawyer?per_page=100');
  if (res.status === 200 && Array.isArray(res.data)) {
    const maya = res.data.find(l =>
      l.title?.rendered?.includes('מאיה') || l.title?.rendered?.includes('רוטנברג')
    );
    if (maya) {
      mayaId = maya.id;
      console.log(`Found Maya: ID=${mayaId}`);
    }
  }
  if (!mayaId) {
    console.log('WARNING: Maya not found in published lawyers. Continuing without expert assignment.\n');
  }

  // 2. Find or confirm practice-areas terms exist.
  console.log('Checking practice-areas taxonomy...');
  const termsRes = await wpRequest('GET', '/wp-json/wp/v2/practice-areas?per_page=100');
  const termMap = {};
  if (termsRes.status === 200 && Array.isArray(termsRes.data)) {
    termsRes.data.forEach(t => { termMap[t.slug] = t.id; });
    console.log(`Found ${Object.keys(termMap).length} practice-area terms.`);
  }

  // 3. Publish each article.
  const results = [];
  for (const article of ARTICLES) {
    console.log(`\n--- Publishing: ${article.slug} ---`);

    // Read markdown.
    const mdPath = path.join(ARTICLES_DIR, article.file);
    if (!fs.existsSync(mdPath)) {
      console.log(`ERROR: File not found: ${mdPath}`);
      results.push({ slug: article.slug, status: 'error', message: 'File not found' });
      continue;
    }
    const md = fs.readFileSync(mdPath, 'utf-8');
    const html = mdToHtml(md);

    // Build practice-areas term IDs.
    const termIds = [];
    if (termMap['family-law']) termIds.push(termMap['family-law']);
    if (termMap[article.subtopic]) termIds.push(termMap[article.subtopic]);

    // Create the post.
    const postBody = {
      title: article.title,
      slug: article.slug,
      content: html,
      status: PUBLISH_STATUS,
      excerpt: article.description,
      'practice-areas': termIds.length ? termIds : undefined,
      meta: {
        primary_keyword: article.keyword,
        content_cluster: 'family-law',
        content_status: 'pillar_draft_review',
        connected_lawyer_slug: 'advocate-maya-rotenberg',
      },
    };

    if (mayaId) {
      postBody.meta.article_expert_lawyer_id = mayaId;
    }

    const createRes = await wpRequest('POST', '/wp-json/wp/v2/articles', postBody);

    if (createRes.status === 201) {
      console.log(`✅ Created: ID=${createRes.data.id}, slug=${createRes.data.slug}`);
      results.push({ slug: article.slug, status: 'created', id: createRes.data.id });
    } else {
      console.log(`❌ Failed (${createRes.status}): ${JSON.stringify(createRes.data).substring(0, 200)}`);
      results.push({ slug: article.slug, status: 'error', code: createRes.status });
    }
  }

  // 4. Summary.
  console.log('\n=== RESULTS ===');
  const created = results.filter(r => r.status === 'created');
  const errors = results.filter(r => r.status === 'error');
  console.log(`Created: ${created.length} / ${ARTICLES.length}`);
  if (errors.length) console.log(`Errors: ${errors.length}`);
  created.forEach(r => console.log(`  ✅ ${r.slug} → ID ${r.id}`));
  errors.forEach(r => console.log(`  ❌ ${r.slug} → ${r.message || r.code}`));

  // Save results.
  const resultsPath = path.resolve(__dirname, '../../project-control/content-master/pillar-publish-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);
}

main().catch(console.error);
