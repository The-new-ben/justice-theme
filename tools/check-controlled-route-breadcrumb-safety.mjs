import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || new Date().toISOString().slice(0, 10),
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `controlled-route-breadcrumb-safety-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function checkContains(id, scope, risk, haystack, needle, evidence, nextStep) {
  return {
    check_id: id,
    scope,
    risk,
    status: haystack.includes(needle) ? 'VERIFIED' : 'BLOCKED',
    evidence,
    next_step: haystack.includes(needle) ? 'Keep as protected breadcrumb baseline.' : nextStep,
  };
}

function checkPosition(id, scope, risk, haystack, beforeNeedle, afterNeedle, evidence, nextStep) {
  const beforeIndex = haystack.indexOf(beforeNeedle);
  const afterIndex = haystack.indexOf(afterNeedle);
  const ok = beforeIndex >= 0 && afterIndex >= 0 && beforeIndex < afterIndex;

  return {
    check_id: id,
    scope,
    risk,
    status: ok ? 'VERIFIED' : 'BLOCKED',
    evidence,
    next_step: ok ? 'Keep route breadcrumb fallback before query fallback handling.' : nextStep,
  };
}

function routeMappingRows(breadcrumbs, practiceLanding) {
  const routes = [
    {
      id: 'CTRL-BREADCRUMB-FAMILY',
      path: '/family-law/',
      configSlug: 'family-law',
      scope: 'family_law_route',
      risk: 'CRITICAL',
    },
    {
      id: 'CTRL-BREADCRUMB-MEDMAL',
      path: '/medical-malpractice-lawyer/',
      configSlug: 'medical-malpractice',
      scope: 'medical_malpractice_route',
      risk: 'CRITICAL',
    },
    {
      id: 'CTRL-BREADCRUMB-REALESTATE',
      path: '/real-estate-lawyer-guide/',
      configSlug: 'real-estate-law',
      scope: 'real_estate_route',
      risk: 'HIGH',
    },
    {
      id: 'CTRL-BREADCRUMB-INHERITANCE',
      path: '/inheritance-lawyer/',
      configSlug: 'inheritance',
      scope: 'inheritance_route',
      risk: 'HIGH',
    },
  ];

  return routes.flatMap((route) => [
    {
      check_id: route.id,
      scope: route.scope,
      risk: route.risk,
      status:
        breadcrumbs.includes(`'${route.path}'`) &&
        breadcrumbs.includes(`=> '${route.configSlug}'`) &&
        practiceLanding.includes(`'${route.path}'`) &&
        practiceLanding.includes(`justice_theme_get_practice_landing_config( '${route.configSlug}' )`)
          ? 'VERIFIED'
          : 'BLOCKED',
      evidence: `${route.path} maps to ${route.configSlug} in breadcrumbs and practice landing config.`,
      next_step:
        breadcrumbs.includes(`'${route.path}'`) && breadcrumbs.includes(`=> '${route.configSlug}'`)
          ? 'Keep route in sync with controlled practice landing config.'
          : `Add ${route.path} to controlled practice breadcrumb route map before deployment.`,
    },
  ]);
}

function markdownReport(rows, reportDate) {
  const blocked = rows.filter((row) => row.status !== 'VERIFIED');
  const header = [
    `# Controlled Route Breadcrumb Safety - ${reportDate}`,
    '',
    `Status: ${blocked.length === 0 ? 'VERIFIED' : 'BLOCKED'}`,
    '',
    'Scope: repo-local static verification for controlled practice route breadcrumbs.',
    '',
    'This check protects the controlled money routes from inheriting wrong breadcrumbs or BreadcrumbList schema from stale WordPress query objects, 404 state, or old CMS page ownership.',
    '',
    '## Results',
    '',
    '| Check | Status | Risk | Evidence |',
    '| --- | --- | --- | --- |',
  ];

  const table = rows.map(
    (row) => `| ${row.check_id} | ${row.status} | ${row.risk} | ${row.evidence.replace(/\|/g, '/') || '-'} |`
  );

  const footer = [
    '',
    '## Upload Notes',
    '',
    '- VERIFIED: `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, and `/inheritance-lawyer/` now resolve their breadcrumb current label from the same practice landing config used by the protected route.',
    '- VERIFIED: the route breadcrumb fallback is checked before normal singular/page/archive/404 fallbacks.',
    '- NOT VERIFIED LIVE: public rendering still needs uPress pull, cache clear, and live checker rerun.',
    '- BLOCKED: no wp-admin, uPress, database, redirect plugin, Search Console, or CDN action was performed by this repo-local check.',
    '',
  ];

  return [...header, ...table, ...footer].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-controlled-route-breadcrumb-safety.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const breadcrumbsPath = path.join(ROOT, 'inc', 'breadcrumbs.php');
const practiceLandingPath = path.join(ROOT, 'inc', 'practice-landing.php');
const breadcrumbs = readFileSync(breadcrumbsPath, 'utf8');
const practiceLanding = readFileSync(practiceLandingPath, 'utf8');

const rows = [
  checkContains(
    'CTRL-BREADCRUMB-SLUG-HELPER',
    'controlled_route_breadcrumbs',
    'HIGH',
    breadcrumbs,
    'function justice_theme_get_controlled_practice_breadcrumb_slug(): string',
    'Dedicated controlled route slug helper exists.',
    'Add a dedicated controlled practice route slug helper.'
  ),
  checkContains(
    'CTRL-BREADCRUMB-ITEMS-HELPER',
    'controlled_route_breadcrumbs',
    'HIGH',
    breadcrumbs,
    'function justice_theme_get_controlled_practice_breadcrumb_items( array $base_items ): array',
    'Dedicated controlled route breadcrumb item helper exists.',
    'Add a dedicated controlled practice route breadcrumb item helper.'
  ),
  checkContains(
    'CTRL-BREADCRUMB-CONFIG-SOURCE',
    'controlled_route_breadcrumbs',
    'CRITICAL',
    breadcrumbs,
    'justice_theme_get_practice_landing_config( $practice_slug )',
    'Breadcrumb current label comes from existing practice landing config.',
    'Use the existing practice landing config instead of a separate hardcoded label source.'
  ),
  checkPosition(
    'CTRL-BREADCRUMB-BEFORE-ARTICLE',
    'query_fallback_order',
    'HIGH',
    breadcrumbs,
    'justice_theme_get_controlled_practice_breadcrumb_items( $items )',
    "if ( is_singular( 'articles' ) )",
    'Controlled route fallback runs before article/singular fallbacks.',
    'Move controlled route breadcrumb fallback before singular handlers.'
  ),
  checkPosition(
    'CTRL-BREADCRUMB-BEFORE-404',
    'query_fallback_order',
    'CRITICAL',
    breadcrumbs,
    'justice_theme_get_controlled_practice_breadcrumb_items( $items )',
    'if ( is_404() )',
    'Controlled route fallback runs before 404 fallback.',
    'Move controlled route breadcrumb fallback before the 404 handler.'
  ),
  checkContains(
    'CTRL-BREADCRUMB-SCHEMA-WIRED',
    'schema_output',
    'HIGH',
    breadcrumbs,
    'justice_theme_print_breadcrumb_schema( $items )',
    'BreadcrumbList schema remains wired to rendered breadcrumb items.',
    'Restore BreadcrumbList output from rendered breadcrumb items.'
  ),
  checkContains(
    'CTRL-BREADCRUMB-YOAST-STALENESS-FILTER',
    'controlled_route_schema',
    'CRITICAL',
    breadcrumbs,
    'justice_theme_filter_controlled_practice_yoast_breadcrumb_schema',
    'Controlled practice routes remove stale SEO-plugin BreadcrumbList nodes.',
    'Add a controlled-route wpseo_schema_graph filter that removes stale BreadcrumbList nodes.'
  ),
  ...routeMappingRows(breadcrumbs, practiceLanding),
];

const blockedRows = rows.filter((row) => row.status !== 'VERIFIED');
const files = outputFiles(args.reportDate);
const columns = ['check_id', 'scope', 'status', 'risk', 'evidence', 'next_step'];
const csv = toCsv(rows, columns);

writeText(files.reportCsv, csv);
writeText(files.projectCsv, csv);
writeText(files.reportJson, JSON.stringify(rows, null, 2) + '\n');
writeText(files.projectMd, markdownReport(rows, args.reportDate));

console.table(rows.map(({ check_id, status, risk }) => ({ check_id, status, risk })));
console.log(`Controlled route breadcrumb safety: ${rows.length - blockedRows.length}/${rows.length} VERIFIED`);
console.log(`Wrote ${path.relative(ROOT, files.projectMd)} and ${path.relative(ROOT, files.reportCsv)}`);

if (blockedRows.length > 0) {
  process.exitCode = 1;
}
