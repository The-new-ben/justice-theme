const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.resolve(__dirname, '../../../reports');
const AUDIT_CSV = path.join(REPORTS_DIR, 'slug-audit-report.csv');
const PHASE_A_CSV = path.join(REPORTS_DIR, 'phase-a-results.csv');
const PHASE_B_CSV = path.join(REPORTS_DIR, 'phase-b-results.csv');

function parseCSV(filepath) {
  if (!fs.existsSync(filepath)) return [];
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  return lines.slice(1).map(line => {
    const values = []; let current = ''; let inQ = false;
    for (const c of line) {
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) { values.push(current.trim()); current = ''; }
      else current += c;
    }
    values.push(current.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

// Get all articles
const audit = parseCSV(AUDIT_CSV);

// Map of postId -> newSlug
const newSlugs = new Map();

// From Phase A
const phaseA = parseCSV(PHASE_A_CSV);
phaseA.filter(r => r.status === 'OK').forEach(r => {
  newSlugs.set(r.post_id, r.actual_slug);
});

// From Phase B
const phaseB = parseCSV(PHASE_B_CSV);
phaseB.filter(r => r.status === 'OK').forEach(r => {
  newSlugs.set(r.post_id, r.actual_slug);
});

// Generate map: old_decoded_slug -> new_slug
const redirectMap = new Map();

audit.forEach(a => {
  const id = a.post_id;
  const oldSlug = a.decoded_slug;
  const targetSlug = newSlugs.get(id);
  
  if (targetSlug && oldSlug && oldSlug !== targetSlug) {
    // Only map if they are different
    redirectMap.set(oldSlug, targetSlug);
  }
});

console.log(`Generated ${redirectMap.size} redirect rules.`);

// Write to PHP file
let phpCode = `<?php
/**
 * Auto-generated 301 Redirect Map
 * Maps old Hebrew slugs to new English slugs
 * Generated on: ${new Date().toISOString()}
 */

if ( ! defined( 'ABSPATH' ) ) {
\texit;
}

function justice_theme_get_slug_redirects(): array {
\treturn [
`;

for (const [oldSlug, newSlug] of redirectMap) {
  // Escape single quotes just in case
  const safeOld = oldSlug.replace(/'/g, "\\'");
  const safeNew = newSlug.replace(/'/g, "\\'");
  phpCode += `\t\t'${safeOld}' => '${safeNew}',\n`;
}

phpCode += `\t];
}

/**
 * Hook into template_redirect to perform the native 301 redirect
 */
function justice_theme_native_slug_redirect() {
\tif ( is_admin() ) {
\t\treturn;
\t}

\t// Only intercept 404s or general requests if needed.
\t// Actually, WP might 404 on the old slug. Let's run on parse_request or template_redirect.
\t// If it's a 404, check our map.
\tif ( is_404() ) {
\t\t$req_path = $_SERVER['REQUEST_URI'] ?? '';
\t\t$path_parts = explode( '?', $req_path );
\t\t$path = trim( $path_parts[0], '/' ); // e.g. "articles/hebrew-slug"

\t\t// Extract just the slug
\t\t$segments = explode( '/', $path );
\t\t$slug = urldecode( end( $segments ) );

\t\t$redirects = justice_theme_get_slug_redirects();

\t\tif ( isset( $redirects[ $slug ] ) ) {
\t\t\t$new_slug = $redirects[ $slug ];
\t\t\t// Preserve the rest of the path (e.g. /articles/...)
\t\t\tarray_pop( $segments );
\t\t\t$segments[] = $new_slug;
\t\t\t
\t\t\t$new_url = home_url( '/' . implode( '/', $segments ) . '/' );
\t\t\t
\t\t\twp_redirect( $new_url, 301 );
\t\t\texit;
\t\t}
\t}
}
add_action( 'template_redirect', 'justice_theme_native_slug_redirect', 1 );
`;

const TARGET_PHP = path.resolve(__dirname, '../../../justice-theme/inc/url-redirects.php');
fs.writeFileSync(TARGET_PHP, phpCode, 'utf-8');
console.log(`Saved PHP redirect rules to ${TARGET_PHP}`);
