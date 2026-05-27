import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TARGET_PATH = '/divorce-lawyer-tel-aviv/';
const PILLAR_PATH = '/divorce-lawyer/';
const DIRECTORY_PATH = '/lawyers/?city=tel-aviv&area=family-law';

const PROTECTED_PAGE_ROLES = new Map([
  [TARGET_PATH, 'target_private_local_page'],
  [PILLAR_PATH, 'protected_divorce_lawyer_pillar'],
  ['/family-law/', 'protected_family_law_overview'],
  [DIRECTORY_PATH, 'canonical_tel_aviv_family_law_directory'],
  ['/child-custody/', 'protected_child_custody_route'],
  ['/child-support-calculator-2023/', 'protected_child_support_route'],
  ['/divorce-mediation/', 'protected_mediation_route'],
  ['/what-is-a-divorce-settlement-agreement/', 'protected_settlement_route'],
  ['/free-divorce-agreement-template/', 'protected_template_route'],
  ['/how-much-does-a-divorce-agreement-cost/', 'protected_cost_route'],
]);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDate=')) {
      args.sourceDate = arg.slice('--sourceDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries(args)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `tel-aviv-family-focused-gsc-export-operator-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    pasteTemplateCsv: path.join(ROOT, '.project-control', `tel-aviv-family-gsc-export-paste-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    publication: path.join(ROOT, '.reports', `tel-aviv-family-publication-review-packet-${sourceDate}.json`),
    gsc: path.join(ROOT, '.reports', `tel-aviv-family-gsc-cache-review-${sourceDate}.json`),
    focusedTemplate: path.join(ROOT, '.project-control', `tel-aviv-family-focused-gsc-export-template-${sourceDate}.csv`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source file: ${filePath}`);
  }
  return readFileSync(filePath, 'utf8');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length || row.length) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  const [header = [], ...records] = rows;
  return records.map((record) => Object.fromEntries(header.map((name, index) => [name, record[index] || ''])));
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function statusOf(report) {
  return report.summary?.status || report.status || 'missing_status';
}

function gscDateRanges(reportDate) {
  return [
    {
      date_range_id: 'last_16_months',
      gsc_ui_instruction: 'Use the GSC maximum recent range, normally Last 16 months.',
      export_window_hint: `Rolling 16-month window ending on the export date; report prepared ${reportDate}.`,
    },
    {
      date_range_id: 'last_90_days',
      gsc_ui_instruction: 'Use the recent 90-day range or the closest equivalent available in the GSC UI.',
      export_window_hint: `Recent 90-day window ending on the export date; report prepared ${reportDate}.`,
    },
  ];
}

function sortPriority(row) {
  if (row.page_filter === TARGET_PATH && row.query_cluster === 'exact_local_divorce_lawyer') {
    return 1;
  }
  if (row.page_filter === PILLAR_PATH && row.query_cluster === 'broad_divorce_lawyer') {
    return 2;
  }
  if (row.page_filter === DIRECTORY_PATH) {
    return 3;
  }
  if (String(row.page_filter || '').includes('/wp-content/') || String(row.page_filter || '').includes('/עורכי-דין/')) {
    return 4;
  }
  return 5;
}

function buildPasteRows({ focusedRows, gsc, reportDate }) {
  const ranges = gscDateRanges(reportDate);
  const rows = [];
  let index = 1;

  for (const sourceRow of focusedRows) {
    for (const dateRange of ranges) {
      rows.push({
        paste_id: `TA-GSC-PASTE-${String(index).padStart(3, '0')}`,
        date_range_id: dateRange.date_range_id,
        gsc_ui_instruction: dateRange.gsc_ui_instruction,
        export_window_hint: dateRange.export_window_hint,
        query_cluster: sourceRow.query_cluster,
        offline_query_filter: sourceRow.query_filter,
        page_filter: sourceRow.page_filter,
        page_role: PROTECTED_PAGE_ROLES.get(sourceRow.page_filter) || 'review_route',
        export_dimensions: sourceRow.export_dimensions || 'Query + Page',
        country: sourceRow.country || 'Israel if available',
        device: sourceRow.device || 'all',
        query: '',
        page: '',
        clicks: '',
        impressions: '',
        ctr: '',
        position: '',
        existing_route_owner: sourceRow.existing_route_owner,
        preliminary_cache_status: sourceRow.preliminary_cache_status || 'not_filled',
        reviewer_decision: 'not_filled',
        notes_no_pii: '',
        source_row: 'focused_export_template',
        public_action_approved: 'no',
      });
      index += 1;
    }
  }

  const seenLegacyPages = new Set();
  const legacyRows = (gsc.matchedRows || [])
    .filter((row) => row.page_display && !PROTECTED_PAGE_ROLES.has(row.page_display))
    .sort((a, b) => Number(b.impressions || 0) - Number(a.impressions || 0))
    .filter((row) => {
      if (seenLegacyPages.has(row.page_display)) {
        return false;
      }
      seenLegacyPages.add(row.page_display);
      return true;
    })
    .slice(0, 12);

  for (const legacyRow of legacyRows) {
    for (const dateRange of ranges) {
      rows.push({
        paste_id: `TA-GSC-PASTE-${String(index).padStart(3, '0')}`,
        date_range_id: dateRange.date_range_id,
        gsc_ui_instruction: dateRange.gsc_ui_instruction,
        export_window_hint: dateRange.export_window_hint,
        query_cluster: legacyRow.cluster_id || 'legacy_or_profile_cache_review',
        offline_query_filter: `cache sample query: ${legacyRow.query || ''}`,
        page_filter: legacyRow.page_display,
        page_role: legacyRow.route_family || 'legacy_or_profile_cache_review',
        export_dimensions: 'Query + Page',
        country: 'Israel if available',
        device: 'all',
        query: '',
        page: '',
        clicks: '',
        impressions: '',
        ctr: '',
        position: '',
        existing_route_owner: legacyRow.route_family || 'legacy_or_profile_cache_review',
        preliminary_cache_status: legacyRow.current_or_cache_signal || 'cache_signal_present',
        reviewer_decision: 'not_filled',
        notes_no_pii: '',
        source_row: 'legacy_profile_cache_page',
        public_action_approved: 'no',
      });
      index += 1;
    }
  }

  return rows.sort((a, b) => sortPriority(a) - sortPriority(b) || a.paste_id.localeCompare(b.paste_id));
}

function buildOperatorRows({ publication, gsc, focusedRows, pasteRows }) {
  const publicationGate = (publication.rows || []).find((row) => row.gate === 'focused_gsc_exact_local_evidence');
  const exactLocal = gsc.summary?.exactLocalCacheRows ?? 0;
  const broadRows = gsc.summary?.broadDivorceLawyerRows ?? 0;
  const legacyCount = pasteRows.filter((row) => row.source_row === 'legacy_profile_cache_page').length;

  return [
    {
      id: 'TA-GSC-OP-01',
      step: 'open_gsc_manually',
      status: 'OWNER_OPERATOR_ACTION_REQUIRED',
      evidence: 'No GSC API/OAuth call is made by this packet.',
      next_action: 'Owner/operator opens Search Console manually in an approved logged-in session and selects the jus-tice.co.il property.',
      hard_no: 'No unattended login, scraping, CAPTCHA/MFA bypass, API call or public site change.',
      public_action_approved: 'no',
    },
    {
      id: 'TA-GSC-OP-02',
      step: 'export_query_page_rows',
      status: 'READY_TEMPLATE_ROWS',
      evidence: `${focusedRows.length} focused source rows expand into ${pasteRows.length} paste rows across two required date windows and legacy/profile cache checks.`,
      next_action: `Fill .project-control/tel-aviv-family-gsc-export-paste-template-${publication.summary?.reportDate || ''}.csv with Query + Page exports.`,
      hard_no: 'Do not treat blank rows as zero unless the owner/operator actually checked the page/query range.',
      public_action_approved: 'no',
    },
    {
      id: 'TA-GSC-OP-03',
      step: 'prove_or_block_exact_local_demand',
      status: exactLocal > 0 ? 'REVIEW_CACHE_SIGNAL_NOT_FINAL' : 'BLOCKED_FOCUSED_EXPORT_REQUIRED',
      evidence: publicationGate?.evidence || `Local cache exact local rows: ${exactLocal}.`,
      next_action: `Fill target ${TARGET_PATH}, pillar ${PILLAR_PATH}, directory and protected route rows for exact local divorce-lawyer intent.`,
      hard_no: 'Do not publish or internally link the target from preliminary local-cache evidence.',
      public_action_approved: 'no',
    },
    {
      id: 'TA-GSC-OP-04',
      step: 'protect_pillar_and_associated_routes',
      status: 'READY_REVIEW_BOUNDARY',
      evidence: `Broad divorce-lawyer cache rows: ${broadRows}; protected focused rows include ${PROTECTED_PAGE_ROLES.size} current route/page filters.`,
      next_action: 'Compare target, pillar, family overview, custody, child support, mediation, settlement, template and cost rows before copy approval.',
      hard_no: 'Do not move broad divorce, cost, agreement, mediation, custody or support intent into the local page without legal/editor approval.',
      public_action_approved: 'no',
    },
    {
      id: 'TA-GSC-OP-05',
      step: 'inspect_legacy_profile_cache_pages',
      status: legacyCount ? 'READY_LEGACY_PROFILE_REVIEW_ROWS' : 'REVIEW_NO_LEGACY_ROWS_ADDED',
      evidence: `${legacyCount} paste rows added for top legacy/profile/attachment cache pages discovered in the local cache.`,
      next_action: 'Use these only to understand current query ownership; do not consolidate, redirect, canonicalize or noindex from this packet.',
      hard_no: 'No redirect, canonical/noindex, sitemap, taxonomy or CMS migration decision from this operator packet.',
      public_action_approved: 'no',
    },
    {
      id: 'TA-GSC-OP-06',
      step: 'record_reviewer_decisions',
      status: 'READY_FILLABLE_REVIEW',
      evidence: 'Every paste row has reviewer_decision and notes_no_pii fields.',
      next_action: 'After exports are pasted, reviewer marks keep_private, local_target_supported, preserve_existing_owner, or needs_more_evidence.',
      hard_no: 'No PII, client names, lawyer contact details, CRM data or payment evidence belongs in this GSC template.',
      public_action_approved: 'no',
    },
    {
      id: 'TA-GSC-OP-07',
      step: 'hold_publication_gate',
      status: 'PUBLICATION_STILL_BLOCKED',
      evidence: 'Focused GSC data, lawyer readiness, legal/editor approval and owner publication approval are still not filled.',
      next_action: 'Use the filled paste template as input for the next private go/no-go review only.',
      hard_no: 'No CMS page, title/H1/meta/body/internal links, redirects, canonicals/noindex, sitemap, taxonomy, CRM, contact, invoice, payment, email or uPress.',
      public_action_approved: 'no',
    },
  ];
}

function buildPageSummaryRows(pasteRows) {
  const map = new Map();
  for (const row of pasteRows) {
    const current = map.get(row.page_filter) || {
      page_filter: row.page_filter,
      page_role: row.page_role,
      paste_rows: 0,
      clusters: new Set(),
      date_ranges: new Set(),
      source_rows: new Set(),
    };
    current.paste_rows += 1;
    current.clusters.add(row.query_cluster);
    current.date_ranges.add(row.date_range_id);
    current.source_rows.add(row.source_row);
    map.set(row.page_filter, current);
  }
  return [...map.values()].map((row) => ({
    page_filter: row.page_filter,
    page_role: row.page_role,
    paste_rows: row.paste_rows,
    clusters: [...row.clusters].join(' | '),
    date_ranges: [...row.date_ranges].join(' | '),
    source_rows: [...row.source_rows].join(' | '),
    public_action_approved: 'no',
  }));
}

function buildMarkdown({ reportDate, sourceDate, status, publication, gsc, operatorRows, pasteRows, pageSummaryRows, outputs }) {
  const currentPages = pageSummaryRows.filter((row) => !row.source_rows.includes('legacy_profile_cache_page')).slice(0, 20);
  const legacyRows = pageSummaryRows.filter((row) => row.source_rows.includes('legacy_profile_cache_page')).slice(0, 12);

  const lines = [
    `# Tel Aviv Family Focused GSC Export Operator Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Target: ${TARGET_PATH}`,
    '',
    'Scope: private owner/operator packet only. It does not call the GSC API, open OAuth, automate login, bypass platform protections, publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, or deploy.',
    '',
    '## Source Chain',
    '',
    `- Publication review (${sourceDate}): ${statusOf(publication)}`,
    `- GSC cache review (${sourceDate}): ${statusOf(gsc)}`,
    `- Focused template rows: ${gsc.summary?.focusedExportTemplateRows || 0}`,
    `- Exact local cache rows: ${gsc.summary?.exactLocalCacheRows || 0}`,
    `- Broad divorce-lawyer cache rows: ${gsc.summary?.broadDivorceLawyerRows || 0}`,
    '',
    '## Manual Export Workflow',
    '',
    '1. In an approved owner session, open Search Console for jus-tice.co.il and go to Performance / Search results.',
    '2. Export Query + Page rows for each paste-template row using the page filter and the matching date window.',
    '3. Use the query-cluster column as an offline reviewer filter; do not rely on wildcard UI behavior.',
    '4. Paste query, page, clicks, impressions, CTR and position into the paste template. Mark checked zero-row cases explicitly in notes.',
    '5. Reviewer fills reviewer_decision only after both date windows are checked. Blank rows keep publication blocked.',
    '',
    '## Generated Files',
    '',
    `- Operator packet: ${path.relative(ROOT, outputs.projectMd)}`,
    `- Operator task CSV: ${path.relative(ROOT, outputs.projectCsv)}`,
    `- Paste template: ${path.relative(ROOT, outputs.pasteTemplateCsv)}`,
    `- Machine report: ${path.relative(ROOT, outputs.reportJson)}`,
    '',
    '## Operator Gates',
    '',
    '| ID | Step | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...operatorRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.step)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
    '',
    '## Current And Protected Pages To Export',
    '',
    '| Page Filter | Role | Paste Rows | Date Ranges |',
    '| --- | --- | ---: | --- |',
    ...currentPages.map((row) => `| ${mdCell(row.page_filter)} | ${mdCell(row.page_role)} | ${mdCell(row.paste_rows)} | ${mdCell(row.date_ranges)} |`),
    '',
    '## Legacy/Profile Cache Pages To Inspect',
    '',
    legacyRows.length ? '| Page Filter | Cache Role | Paste Rows |' : '- None added from the local cache.',
    legacyRows.length ? '| --- | --- | ---: |' : '',
    ...legacyRows.map((row) => `| ${mdCell(row.page_filter)} | ${mdCell(row.page_role)} | ${mdCell(row.paste_rows)} |`),
    '',
    '## Decision Rule',
    '',
    'This packet prepares the evidence collection step only. The page remains private unless focused GSC rows, lawyer readiness, legal/editor copy approval and explicit owner publication approval are all filled in a later private review packet.',
  ];

  return `${lines.filter((line) => line !== undefined).join('\n')}\n`;
}

function assertNoReplacementCharacter(label, text) {
  if (text.includes('\uFFFD')) {
    throw new Error(`${label} contains a replacement character`);
  }
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-tel-aviv-family-focused-gsc-export-operator-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const publication = readJson(sources.publication);
  const gsc = readJson(sources.gsc);
  const focusedRows = parseCsv(readText(sources.focusedTemplate));

  if (!statusOf(publication).includes('BLOCKED_FOCUSED_GSC')) {
    throw new Error(`Publication source is not blocked on focused GSC: ${statusOf(publication)}`);
  }

  if (!focusedRows.length) {
    throw new Error('Focused GSC export template is empty');
  }

  const outputs = outputFiles(args.reportDate);
  const pasteRows = buildPasteRows({ focusedRows, gsc, reportDate: args.reportDate });
  const operatorRows = buildOperatorRows({ publication, gsc, focusedRows, pasteRows });
  const pageSummaryRows = buildPageSummaryRows(pasteRows);
  const status = 'TEL_AVIV_FAMILY_GSC_EXPORT_OPERATOR_PACKET_READY_NO_API_NO_PUBLIC_CHANGE';

  const operatorColumns = ['id', 'step', 'status', 'evidence', 'next_action', 'hard_no', 'public_action_approved'];
  const pasteColumns = [
    'paste_id',
    'date_range_id',
    'gsc_ui_instruction',
    'export_window_hint',
    'query_cluster',
    'offline_query_filter',
    'page_filter',
    'page_role',
    'export_dimensions',
    'country',
    'device',
    'query',
    'page',
    'clicks',
    'impressions',
    'ctr',
    'position',
    'existing_route_owner',
    'preliminary_cache_status',
    'reviewer_decision',
    'notes_no_pii',
    'source_row',
    'public_action_approved',
  ];

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetPath: TARGET_PATH,
    publicationStatus: statusOf(publication),
    gscCacheStatus: statusOf(gsc),
    focusedSourceRows: focusedRows.length,
    pasteTemplateRows: pasteRows.length,
    protectedCurrentPageFilters: [...PROTECTED_PAGE_ROLES.keys()].length,
    legacyProfilePasteRows: pasteRows.filter((row) => row.source_row === 'legacy_profile_cache_page').length,
    operatorRows: operatorRows.length,
    exactLocalCacheRows: gsc.summary?.exactLocalCacheRows || 0,
    broadDivorceLawyerRows: gsc.summary?.broadDivorceLawyerRows || 0,
    gscApiCalled: 0,
    oauthOpened: 0,
    unattendedLoginAutomation: 0,
    paidLlmApiUsed: 0,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    files: {
      projectMd: path.relative(ROOT, outputs.projectMd),
      projectCsv: path.relative(ROOT, outputs.projectCsv),
      pasteTemplateCsv: path.relative(ROOT, outputs.pasteTemplateCsv),
      reportJson: path.relative(ROOT, outputs.reportJson),
      reportCsv: path.relative(ROOT, outputs.reportCsv),
    },
  };

  const markdown = buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, publication, gsc, operatorRows, pasteRows, pageSummaryRows, outputs });
  const operatorCsv = toCsv(operatorRows, operatorColumns);
  const pasteCsv = toCsv(pasteRows, pasteColumns);
  const reportJson = `${JSON.stringify({ summary, operatorRows, pageSummaryRows, pasteRows, sourceFiles: Object.fromEntries(Object.entries(sources).map(([key, value]) => [key, path.relative(ROOT, value)])) }, null, 2)}\n`;

  assertNoReplacementCharacter('markdown', markdown);
  assertNoReplacementCharacter('operatorCsv', operatorCsv);
  assertNoReplacementCharacter('pasteCsv', pasteCsv);
  assertNoReplacementCharacter('reportJson', reportJson);

  writeText(outputs.projectMd, markdown);
  writeText(outputs.projectCsv, operatorCsv);
  writeText(outputs.pasteTemplateCsv, pasteCsv);
  writeText(outputs.reportJson, reportJson);
  writeText(outputs.reportCsv, operatorCsv);

  console.log(JSON.stringify(summary, null, 2));
}

main();
