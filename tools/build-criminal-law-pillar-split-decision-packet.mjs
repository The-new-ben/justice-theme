import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const roleMap = {
  '/practice-areas/criminal-law/': {
    proposed_role: 'central_topic_or_archive_candidate',
    role_decision: 'NEEDS_OWNER_SEO_DECISION',
    allowed_future_copy: 'Broad criminal law orientation only if upgraded into a proper pillar.',
    blocked_future_copy: 'Do not leave as a thin archive while expanding local pages against it.',
  },
  '/criminal-lawyer/': {
    proposed_role: 'legacy_declared_pillar_alias',
    role_decision: 'NEEDS_REDIRECT_CANONICAL_REVIEW_WITHOUT_ACTION',
    allowed_future_copy: 'Only if owner decides this remains the user-facing pillar route.',
    blocked_future_copy: 'Do not use as a source of truth while it lands on the weak topic/archive page.',
  },
  '/criminal-lawyer-jerusalem/': {
    proposed_role: 'local_city_practice_support_page',
    role_decision: 'HOLD_EXISTING_PUBLIC_PAGE_NO_EXPANSION_YET',
    allowed_future_copy: 'Local triage, document prep, when to check lawyer fit, and filtered directory support.',
    blocked_future_copy: 'No broad criminal-law guide, no rankings, no price/court claims without sources, no specialist-topic takeover.',
  },
  '/criminal-defense-attorney/': {
    proposed_role: 'broad_criminal_defense_comparison_page',
    role_decision: 'KEEP_DISTINCT_FROM_LOCAL_JERUSALEM',
    allowed_future_copy: 'National/broad criminal defense selection, comparison and matching intent.',
    blocked_future_copy: 'Do not make it the Jerusalem local page or duplicate its broad claims locally.',
  },
  '/sex-crime-lawyer/': {
    proposed_role: 'specialist_criminal_subtopic_page',
    role_decision: 'KEEP_SPECIALIST_PROTECTED',
    allowed_future_copy: 'Sensitive specialist intent around sexual offenses only.',
    blocked_future_copy: 'Do not let the Jerusalem local page absorb this specialist subject.',
  },
  '/traffic-lawyer/': {
    proposed_role: 'adjacent_traffic_practice_page',
    role_decision: 'KEEP_ADJACENT_ONLY',
    allowed_future_copy: 'Traffic law intent only.',
    blocked_future_copy: 'Do not mix traffic/fines intent into the criminal Jerusalem local page.',
  },
  '/lawyers/?city=jerusalem&practice=criminal-law': {
    proposed_role: 'filtered_directory_conversion_path',
    role_decision: 'VERIFY_SUPPLY_BEFORE_PUBLIC_PROMISES',
    allowed_future_copy: 'Conversion path only if lawyer coverage is verified.',
    blocked_future_copy: 'No promise of available/qualified Jerusalem criminal lawyers until profile coverage is reviewed.',
  },
  '/find-lawyer-how-to-find-good-attorney/': {
    proposed_role: 'generic_lawyer_selection_support',
    role_decision: 'SUPPORT_ONLY',
    allowed_future_copy: 'Trust and selection support link if editorially relevant.',
    blocked_future_copy: 'Do not use as the criminal-law pillar.',
  },
};

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceQa: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceQa=')) {
      args.sourceQa = arg.slice('--sourceQa='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  if (!args.sourceQa) {
    args.sourceQa = path.join(ROOT, '.reports', `live-criminal-jerusalem-page-qa-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.sourceQa)) {
    args.sourceQa = path.join(ROOT, args.sourceQa);
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `criminal-law-pillar-split-decision-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    gscTemplateCsv: path.join(ROOT, '.project-control', `criminal-law-pillar-split-gsc-template-${reportDate}.csv`),
    ownerDecisionCsv: path.join(ROOT, '.project-control', `criminal-law-pillar-split-owner-decision-template-${reportDate}.csv`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing source QA report: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function normalizePathFromUrlOrPath(value) {
  const text = String(value || '');
  if (!text) return '';
  try {
    const parsed = text.startsWith('http') ? new URL(text) : new URL(text, 'https://jus-tice.co.il');
    return parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return text;
  }
}

function routeKey(row) {
  if (row.path) return row.path;
  return normalizePathFromUrlOrPath(row.url || row.final_url);
}

function buildRoleRows(sourceQa) {
  const rows = (sourceQa.ownRows || []).map((row) => {
    const key = routeKey(row);
    const role = roleMap[key] || {
      proposed_role: 'unclassified_related_route',
      role_decision: 'REVIEW',
      allowed_future_copy: 'Only after owner/SEO review.',
      blocked_future_copy: 'Do not publish from this packet.',
    };
    const isCentralCandidate = key === '/practice-areas/criminal-law/' || key === '/criminal-lawyer/';
    const isLocalTarget = key === '/criminal-lawyer-jerusalem/';
    const isSpecialist = key === '/sex-crime-lawyer/' || key === '/traffic-lawyer/';
    const currentIssue = [];

    if (Number(row.word_estimate || 0) < 800 && (isCentralCandidate || isLocalTarget)) {
      currentIssue.push('thin_content');
    }
    if (row.public_claim_hits) {
      currentIssue.push('source_sensitive_claim_markers');
    }
    if (String(row.final_url || '').includes('/practice-areas/criminal-law/') && key === '/criminal-lawyer/') {
      currentIssue.push('declared_pillar_lands_elsewhere');
    }
    if (isSpecialist) {
      currentIssue.push('protect_specialist_intent');
    }

    return {
      id: row.id,
      route: key,
      current_role: row.role,
      proposed_role: role.proposed_role,
      role_decision: role.role_decision,
      status: row.status,
      words: row.word_estimate || 0,
      canonical: row.canonical || '',
      robots: row.robots || '',
      final_url: row.final_url || '',
      current_issue: currentIssue.join(' | ') || 'none',
      public_claim_hits: row.public_claim_hits || '',
      allowed_future_copy: role.allowed_future_copy,
      blocked_future_copy: role.blocked_future_copy,
    };
  });

  return rows.sort((a, b) => {
    const order = [
      '/practice-areas/criminal-law/',
      '/criminal-lawyer/',
      '/criminal-lawyer-jerusalem/',
      '/criminal-defense-attorney/',
      '/sex-crime-lawyer/',
      '/traffic-lawyer/',
      '/lawyers/?city=jerusalem&practice=criminal-law',
      '/find-lawyer-how-to-find-good-attorney/',
    ];
    return order.indexOf(a.route) - order.indexOf(b.route);
  });
}

function buildDecisionRows(roleRows) {
  const centralRows = roleRows.filter((row) => row.route === '/practice-areas/criminal-law/' || row.route === '/criminal-lawyer/');
  const localRow = roleRows.find((row) => row.route === '/criminal-lawyer-jerusalem/') || {};
  const specialistRows = roleRows.filter((row) => row.proposed_role.includes('specialist') || row.proposed_role.includes('adjacent'));
  const directoryRow = roleRows.find((row) => row.route.includes('/lawyers/')) || {};

  return [
    {
      id: 'CRIM-DEC-01',
      decision: 'choose_central_criminal_law_surface',
      status: 'OWNER_GSC_SEO_REQUIRED',
      evidence: centralRows.map((row) => `${row.route}:${row.status}/${row.words}w/final=${row.final_url}`).join(' | '),
      recommendation: 'Do not expand local pages until one central route is chosen and strengthened.',
      approval_needed: 'Owner + SEO/GSC + legal/editor',
    },
    {
      id: 'CRIM-DEC-02',
      decision: 'hold_or_revise_live_jerusalem_page',
      status: 'OWNER_LEGAL_EDITOR_REQUIRED',
      evidence: `${localRow.route || '/criminal-lawyer-jerusalem/'}:${localRow.status || ''}/${localRow.words || 0}w; issues=${localRow.current_issue || ''}; claims=${localRow.public_claim_hits || 'none'}`,
      recommendation: 'Preserve page as live asset for now; prepare only private revisions until GSC and legal/editor review approve exact copy.',
      approval_needed: 'Owner + legal/editor + GSC query/page evidence',
    },
    {
      id: 'CRIM-DEC-03',
      decision: 'protect_specialist_pages',
      status: 'SEO_LEGAL_REQUIRED',
      evidence: specialistRows.map((row) => `${row.route}:${row.status}/${row.words}w`).join(' | '),
      recommendation: 'Keep sex-crime and traffic intent separate from the Jerusalem local criminal page.',
      approval_needed: 'SEO/internal overlap review',
    },
    {
      id: 'CRIM-DEC-04',
      decision: 'verify_lawyer_supply_before_conversion_claims',
      status: 'SUPPLY_PROOF_REQUIRED',
      evidence: directoryRow.route
        ? `${directoryRow.route}:${directoryRow.status}/${directoryRow.words}w; filtered profile count and quality not proven by this packet`
        : 'Filtered directory route not found in source QA.',
      recommendation: 'Do not claim Jerusalem criminal lawyer availability until filtered profile count and quality are verified.',
      approval_needed: 'Owner/admin profile review',
    },
    {
      id: 'CRIM-DEC-05',
      decision: 'public_action_gate',
      status: 'BLOCKED_NO_PUBLIC_CHANGE_APPROVED',
      evidence: 'This packet creates private decision artifacts only.',
      recommendation: 'No publish/update/unpublish/redirect/canonical/noindex/sitemap/taxonomy/internal-link action from this packet.',
      approval_needed: 'Explicit owner approval after evidence is filled',
    },
  ];
}

function buildGscRows(roleRows) {
  const queryClusters = [
    {
      cluster: 'criminal_lawyer_jerusalem_exact',
      queries: 'עורך דין פלילי ירושלים | עורך דין פלילי בירושלים | עורך דין פלילי ירושלים המלצה',
      go_rule: 'If Jerusalem local terms land on /criminal-lawyer-jerusalem/ with impressions/clicks, preserve role and improve cautiously.',
    },
    {
      cluster: 'criminal_lawyer_broad',
      queries: 'עורך דין פלילי | עורך דין פלילי מומלץ | עורך דין פלילי טוב',
      go_rule: 'If broad terms land on local Jerusalem page, central pillar split is urgent before expansion.',
    },
    {
      cluster: 'criminal_defense_broad',
      queries: 'עורך דין פלילי הגנה | עורך דין פלילי כתב אישום | עורך דין פלילי חקירה',
      go_rule: 'Route broad defense intent to central/broad defense surface, not necessarily local page.',
    },
    {
      cluster: 'specialist_sex_crime',
      queries: 'עורך דין עבירות מין | עבירות מין עורך דין | חקירה עבירות מין',
      go_rule: 'Keep specialist intent on specialist page unless GSC proves local modifier demand.',
    },
    {
      cluster: 'traffic_adjacent',
      queries: 'עורך דין תעבורה פלילי | עבירת תנועה פלילית | נהיגה בשכרות עורך דין',
      go_rule: 'Keep traffic intent on traffic page unless legal/SEO approves a small cross-link.',
    },
  ];

  const routes = roleRows.map((row) => row.route).filter(Boolean);
  const rows = [];
  for (const cluster of queryClusters) {
    for (const route of routes) {
      rows.push({
        cluster: cluster.cluster,
        query_examples: cluster.queries,
        route,
        clicks_90d: '',
        impressions_90d: '',
        average_position: '',
        top_query: '',
        gsc_page_role: '',
        decision_after_export: '',
        go_rule: cluster.go_rule,
        notes_no_pii: '',
      });
    }
  }
  return rows;
}

function buildOwnerRows() {
  return [
    {
      item: 'central_route_choice',
      current_question: 'Should the criminal-law pillar be /criminal-lawyer/ or /practice-areas/criminal-law/?',
      owner_decision: '',
      evidence_required: 'GSC query/page export plus internal route role review.',
      public_action_allowed: 'no',
      notes_no_pii: '',
    },
    {
      item: 'jerusalem_page_role',
      current_question: 'Preserve, revise, consolidate, or park /criminal-lawyer-jerusalem/?',
      owner_decision: '',
      evidence_required: 'GSC export, legal/editor review, and lawyer coverage proof.',
      public_action_allowed: 'no',
      notes_no_pii: '',
    },
    {
      item: 'claim_cleanup_scope',
      current_question: 'Should price/court/leading-style markers be revised or sourced?',
      owner_decision: '',
      evidence_required: 'Legal/editor review and source list.',
      public_action_allowed: 'no',
      notes_no_pii: '',
    },
    {
      item: 'lawyer_supply',
      current_question: 'How many verified Jerusalem criminal-law profiles can the page responsibly point to?',
      owner_decision: '',
      evidence_required: 'Admin/profile review of filtered directory.',
      public_action_allowed: 'no',
      notes_no_pii: '',
    },
  ];
}

function buildMarkdown({ reportDate, summary, decisionRows, roleRows, gscRows }) {
  return [
    `# Criminal Law Pillar Split Decision Packet - ${reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private decision packet for the criminal-law pillar/local-page split. It reads prior live QA artifacts and creates owner/GSC decision templates only. It does not publish, edit CMS content, change SEO settings, contact anyone, create records, send email or deploy.',
    '',
    '## Summary',
    '',
    `- Source QA status: ${summary.sourceQaStatus}.`,
    `- Role rows: ${summary.roleRows}.`,
    `- Decision rows: ${summary.decisionRows}.`,
    `- GSC template rows: ${summary.gscRows}.`,
    `- Public actions: ${summary.publicChangesApproved}; CMS writes: ${summary.cmsWritesApproved}; SEO changes: ${summary.seoSettingsChanged}.`,
    '',
    '## Decision Rows',
    '',
    '| ID | Decision | Status | Evidence | Recommendation | Approval Needed |',
    '| --- | --- | --- | --- | --- | --- |',
    ...decisionRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.decision)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.recommendation)} | ${mdCell(row.approval_needed)} |`,
    ),
    '',
    '## Route Role Map',
    '',
    '| Route | Current Role | Proposed Role | Role Decision | Words | Issues | Allowed Future Copy | Blocked Future Copy |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...roleRows.map(
      (row) =>
        `| ${mdCell(row.route)} | ${mdCell(row.current_role)} | ${mdCell(row.proposed_role)} | ${mdCell(row.role_decision)} | ${mdCell(row.words)} | ${mdCell(row.current_issue)} | ${mdCell(row.allowed_future_copy)} | ${mdCell(row.blocked_future_copy)} |`,
    ),
    '',
    '## GSC Template Preview',
    '',
    '| Cluster | Example Queries | First Route | Go Rule |',
    '| --- | --- | --- | --- |',
    ...gscRows
      .filter((row, index) => index % roleRows.length === 0)
      .map((row) => `| ${mdCell(row.cluster)} | ${mdCell(row.query_examples)} | ${mdCell(row.route)} | ${mdCell(row.go_rule)} |`),
    '',
    '## Review',
    '',
    'The live QA shows the criminal-law cluster has a structural issue, not just a copy issue. The central criminal-law surface is weak and the local Jerusalem page is already public. The safest sequence is: fill the GSC template, choose the central route, verify lawyer supply, then prepare one owner/legal/editor-reviewed update brief. Until then, no public edit, redirect, canonical/noindex, sitemap, taxonomy or internal-link action is approved.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-criminal-law-pillar-split-decision-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceQa=.reports/file.json]');
}

const args = parseArgs();
if (args.help) {
  printHelp();
  process.exit(0);
}

const sourceQa = readJson(args.sourceQa);
const roleRows = buildRoleRows(sourceQa);
const decisionRows = buildDecisionRows(roleRows);
const gscRows = buildGscRows(roleRows);
const ownerRows = buildOwnerRows();
const files = outputFiles(args.reportDate);
const summary = {
  reportDate: args.reportDate,
  status: 'CRIMINAL_LAW_PILLAR_SPLIT_DECISION_PACKET_READY_NO_PUBLIC_CHANGE',
  sourceQaStatus: sourceQa.status || '',
  roleRows: roleRows.length,
  decisionRows: decisionRows.length,
  gscRows: gscRows.length,
  ownerDecisionRows: ownerRows.length,
  blockedPublicActionRows: decisionRows.filter((row) => row.status.includes('BLOCKED')).length,
  publicChangesApproved: 0,
  cmsWritesApproved: 0,
  seoSettingsChanged: 0,
  redirectsOrCanonicalsChanged: 0,
  crmRecordsCreated: 0,
  leadOrLawyerContactActions: 0,
  invoicesOrPaymentsCreated: 0,
  emailsSent: 0,
  upressDeploymentRequired: false,
};

const report = {
  ...summary,
  sourceQaPath: path.relative(ROOT, args.sourceQa).replace(/\\/g, '/'),
  decisionRows,
  roleRows,
  gscRows,
  ownerRows,
  files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
};

writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, summary, decisionRows, roleRows, gscRows }));
writeText(
  files.projectCsv,
  toCsv(decisionRows, ['id', 'decision', 'status', 'evidence', 'recommendation', 'approval_needed']),
);
writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
writeText(
  files.reportCsv,
  toCsv(
    [
      ...decisionRows.map((row) => ({ row_type: 'decision', ...row })),
      ...roleRows.map((row) => ({ row_type: 'role', ...row })),
      ...ownerRows.map((row) => ({ row_type: 'owner', ...row })),
    ],
    [
      'row_type',
      'id',
      'route',
      'decision',
      'status',
      'current_role',
      'proposed_role',
      'role_decision',
      'words',
      'current_issue',
      'evidence',
      'recommendation',
      'approval_needed',
      'allowed_future_copy',
      'blocked_future_copy',
      'item',
      'current_question',
      'evidence_required',
      'public_action_allowed',
    ],
  ),
);
writeText(
  files.gscTemplateCsv,
  toCsv(gscRows, [
    'cluster',
    'query_examples',
    'route',
    'clicks_90d',
    'impressions_90d',
    'average_position',
    'top_query',
    'gsc_page_role',
    'decision_after_export',
    'go_rule',
    'notes_no_pii',
  ]),
);
writeText(
  files.ownerDecisionCsv,
  toCsv(ownerRows, ['item', 'current_question', 'owner_decision', 'evidence_required', 'public_action_allowed', 'notes_no_pii']),
);

console.log(
  JSON.stringify(
    {
      reportDate: summary.reportDate,
      status: summary.status,
      sourceQaStatus: summary.sourceQaStatus,
      roleRows: summary.roleRows,
      decisionRows: summary.decisionRows,
      gscRows: summary.gscRows,
      ownerDecisionRows: summary.ownerDecisionRows,
      publicChangesApproved: summary.publicChangesApproved,
      cmsWritesApproved: summary.cmsWritesApproved,
      seoSettingsChanged: summary.seoSettingsChanged,
      emailsSent: summary.emailsSent,
      upressDeploymentRequired: summary.upressDeploymentRequired,
      files: report.files,
    },
    null,
    2,
  ),
);
