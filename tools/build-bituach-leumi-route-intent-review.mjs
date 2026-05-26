import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    liveAuditDate: process.env.LIVE_AUDIT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--liveAuditDate=')) {
      args.liveAuditDate = arg.slice('--liveAuditDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.liveAuditDate)) {
    throw new Error('--liveAuditDate must be YYYY-MM-DD');
  }

  return args;
}

function usage() {
  return `Build Bituach Leumi route intent and anti-cannibalization review.

Usage:
  node tools/build-bituach-leumi-route-intent-review.mjs --reportDate=YYYY-MM-DD [--liveAuditDate=YYYY-MM-DD]
`;
}

function outputFiles(reportDate) {
  const base = `bituach-leumi-route-intent-review-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
  };
}

function readLiveAudit(liveAuditDate) {
  const file = path.join(ROOT, '.reports', `live-public-business-language-${liveAuditDate}.json`);
  if (!existsSync(file)) {
    return { rows: [], duplicates: [], source_file: '', source_status: 'MISSING' };
  }

  const parsed = JSON.parse(readFileSync(file, 'utf8'));
  return {
    rows: Array.isArray(parsed.rows) ? parsed.rows : [],
    duplicates: Array.isArray(parsed.duplicates) ? parsed.duplicates : [],
    source_file: file,
    source_status: 'FOUND',
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

function rowByPath(rows, routePath) {
  return rows.find((row) => row.path === routePath) || {};
}

function buildRouteRows(liveAudit) {
  const nationalInsurance = rowByPath(liveAudit.rows, '/national-insurance-attorney/');
  const guide = rowByPath(liveAudit.rows, '/bituach-leumi-appeal-guide/');

  return [
    {
      route: '/national-insurance-attorney/',
      page_role: 'practice_landing_lawyer_match',
      user_intent: 'User is already looking for a Bituach Leumi lawyer, legal representation, appeal handling, medical committee help, or rights review.',
      primary_query_family: 'עורך דין ביטוח לאומי; עורך דין לערעור ביטוח לאומי; עורך דין ועדה רפואית',
      current_live_title: nationalInsurance.title || '',
      current_live_h1: nationalInsurance.h1 || '',
      proposed_title: 'עורך דין ביטוח לאומי: מציאת עורך דין לערעור או ועדה רפואית | Jus-Tice',
      proposed_h1: 'עורך דין ביטוח לאומי לערעור, ועדה רפואית או בדיקת זכויות',
      public_copy_posture: 'Lead with legal-help matching, urgency, documents to prepare, and how to choose counsel. Keep business/revenue rationale out of all visitor-facing copy.',
      primary_cta: 'Submit case details to find a relevant Bituach Leumi lawyer.',
      internal_link_posture: 'Link to the appeal guide/calculator as a preliminary self-check before contacting a lawyer.',
      allowed_without_owner_gsc: 'Prepare draft metadata and link copy locally only.',
      blocked_until_owner_gsc: 'No CMS title/H1 upload, no canonical, no redirect, no noindex, no slug, no sitemap, no taxonomy, no router or lawyer-profile changes.',
      status: 'READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD',
    },
    {
      route: '/bituach-leumi-appeal-guide/',
      page_role: 'pillar_guide_and_tool_entry',
      user_intent: 'User wants to understand whether and how to appeal a Bituach Leumi decision before choosing the next step.',
      primary_query_family: 'ערעור ביטוח לאומי; ערעור ועדה רפואית; איך מערערים על החלטת ביטוח לאומי',
      current_live_title: guide.title || '',
      current_live_h1: guide.h1 || '',
      proposed_title: 'ערעור ביטוח לאומי: מדריך בדיקה לפני ועדה רפואית או החלטה | Jus-Tice',
      proposed_h1: 'ערעור ביטוח לאומי: מה לבדוק לפני שמגישים ערעור',
      public_copy_posture: 'Lead with user education, 60-day timing awareness where legally correct, evidence checklist, appeal-worth calculator, and a clean handoff to help.',
      primary_cta: 'Start with the appeal worth-it calculator, then request lawyer review if the case looks time-sensitive or document-heavy.',
      internal_link_posture: 'Link to the attorney landing after explaining appeal steps and evidence needs.',
      allowed_without_owner_gsc: 'Prepare draft metadata, section outline, and calculator entry text locally only.',
      blocked_until_owner_gsc: 'No CMS title/H1 upload, no canonical, no redirect, no noindex, no slug, no sitemap, no taxonomy, no live calculator or request-flow changes.',
      status: 'READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD',
    },
  ];
}

function buildDecisionRows(routeRows) {
  return [
    {
      item: 'duplicate_live_title_h1',
      finding: 'The two Bituach Leumi routes currently share the same live title and H1 in the sampled audit.',
      recommendation: 'Keep both routes only if the practice landing owns lawyer-match intent and the guide owns appeal-education/tool intent.',
      owner_decision_needed: 'Approve metadata split and internal-link posture before any CMS edit.',
      risk_if_ignored: 'Search engines and users may see two pages competing for the same appeal query instead of a clear guide-to-lawyer path.',
      status: 'OPEN_REVIEW',
    },
    {
      item: 'public_language_boundary',
      finding: 'The owner correctly rejected internal revenue-style titles on public pages.',
      recommendation: 'Use only user-facing legal-help language in titles, H1s, intros, CTAs and snippets. Keep commercial strategy inside private repo reports, Linear and owner-only admin.',
      owner_decision_needed: 'None for the rule; approval only needed for the actual public replacement copy.',
      risk_if_ignored: 'Visitors may feel exploited or confused, hurting trust and conversion.',
      status: 'RULE_CONFIRMED',
    },
    {
      item: 'seo_control_boundary',
      finding: 'This packet is a review artifact only and does not justify SEO control changes by itself.',
      recommendation: 'Do not alter canonical, redirect, noindex, sitemap, taxonomy or slug without owner approval and GSC/SERP evidence.',
      owner_decision_needed: 'Yes, if any technical SEO action is later proposed.',
      risk_if_ignored: 'An otherwise small copy duplication issue could become a traffic-loss incident.',
      status: 'BLOCKED_FOR_TECHNICAL_SEO',
    },
    {
      item: 'next_public_edit_scope',
      finding: 'The safest first edit is metadata/H1 disambiguation plus contextual internal links, not a full rewrite.',
      recommendation: `Draft the final public copy from these roles: ${routeRows.map((row) => `${row.route}=${row.page_role}`).join('; ')}.`,
      owner_decision_needed: 'Approve exact title/H1/link text and confirm whether GSC supports both URLs.',
      risk_if_ignored: 'A broad rewrite could reopen legal-fact review and delay the Bituach Leumi first paid-lead loop.',
      status: 'NEXT_STEP_DEFINED',
    },
  ];
}

function buildMarkdown({ reportDate, liveAuditDate, liveAudit, routeRows, decisionRows }) {
  const duplicate = liveAudit.duplicates.find((item) => item.duplicate_id === 'DUP-001') || {};
  const routeTable = routeRows
    .map(
      (row) =>
        `| ${row.route} | ${row.page_role} | ${row.primary_query_family} | ${row.proposed_title} | ${row.proposed_h1} | ${row.status} |`
    )
    .join('\n');
  const decisionTable = decisionRows
    .map(
      (row) =>
        `| ${row.item} | ${row.finding} | ${row.recommendation} | ${row.owner_decision_needed} | ${row.status} |`
    )
    .join('\n');

  return `# Bituach Leumi Route Intent Review - ${reportDate}

Status: READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD

Scope: repo-local anti-cannibalization review for two already-published public routes. This report does not publish or update CMS content, change titles/H1s, redirects, canonicals, noindex, sitemaps, taxonomies, lawyer routing, leads, payments or public database rows.

Source live audit: ${liveAudit.source_status}${liveAudit.source_file ? ` (${path.relative(ROOT, liveAudit.source_file).replace(/\\/g, '/')})` : ''} for ${liveAuditDate}.

## Why This Exists

The live public business-language audit found no sampled internal revenue/business-plan leakage, but it did find that \`/national-insurance-attorney/\` and \`/bituach-leumi-appeal-guide/\` share the same title and H1. That creates a user-intent and SEO cannibalization risk, especially because the Bituach Leumi route is also part of the first paid-lead loop.

The owner already made the correct call: visitor-facing pages must explain legal help for the reader, not why the page creates revenue for Jus-Tice.

## Live Duplicate Evidence

- Duplicate ID: ${duplicate.duplicate_id || 'DUP-001'}
- Routes: ${duplicate.paths || '/national-insurance-attorney/ | /bituach-leumi-appeal-guide/'}
- Shared live title from audit: ${duplicate.title || 'See live audit output.'}
- Shared live H1 from audit: ${duplicate.h1 || 'See live audit output.'}

## Proposed Route Split

| Route | Role | Query Family | Proposed Title | Proposed H1 | Status |
| --- | --- | --- | --- | --- | --- |
${routeTable}

## Route Notes

${routeRows
  .map(
    (row) => `### ${row.route}

- User intent: ${row.user_intent}
- Public copy posture: ${row.public_copy_posture}
- Primary CTA: ${row.primary_cta}
- Internal link posture: ${row.internal_link_posture}
- Allowed now: ${row.allowed_without_owner_gsc}
- Blocked: ${row.blocked_until_owner_gsc}
`
  )
  .join('\n')}

## Review Decisions

| Item | Finding | Recommendation | Owner Decision Needed | Status |
| --- | --- | --- | --- | --- |
${decisionTable}

## Implementation Guardrails

1. Do not expose owner/investor/revenue logic on public legal-help pages.
2. Do not use "best", "recommended" or outcome-promise phrasing unless compliance has approved the exact wording.
3. Do not change URL, redirect, canonical, noindex, sitemap or taxonomy from this packet alone.
4. Do not publish this metadata until owner approval and, ideally, GSC/SERP confirmation that both routes should stay live.
5. Keep the guide-to-lawyer flow natural: first understand the appeal, then ask for matched legal help if needed.

## Completion Assessment

- Bituach Leumi duplicate-intent documentation: 100%.
- Public metadata replacement readiness: 70%, pending owner/GSC approval.
- Live page correction: 0%, intentionally not performed in this repo-only cycle.
- First-paid-lead loop impact: improves trust and SEO clarity, but real revenue remains blocked by specialist supply, consented lead release and payment proof.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  const liveAudit = readLiveAudit(args.liveAuditDate);
  const routeRows = buildRouteRows(liveAudit);
  const decisionRows = buildDecisionRows(routeRows);
  const files = outputFiles(args.reportDate);

  const payload = {
    report_date: args.reportDate,
    live_audit_date: args.liveAuditDate,
    status: 'READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD',
    source: {
      status: liveAudit.source_status,
      file: liveAudit.source_file ? path.relative(ROOT, liveAudit.source_file).replace(/\\/g, '/') : '',
    },
    route_rows: routeRows,
    decision_rows: decisionRows,
    safety: {
      public_cms_changed: false,
      redirects_changed: false,
      canonicals_changed: false,
      noindex_changed: false,
      sitemaps_changed: false,
      taxonomies_changed: false,
      lawyer_routing_changed: false,
      leads_changed: false,
      payments_changed: false,
    },
  };

  const routeColumns = [
    'route',
    'page_role',
    'user_intent',
    'primary_query_family',
    'current_live_title',
    'current_live_h1',
    'proposed_title',
    'proposed_h1',
    'public_copy_posture',
    'primary_cta',
    'internal_link_posture',
    'allowed_without_owner_gsc',
    'blocked_until_owner_gsc',
    'status',
  ];

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, liveAuditDate: args.liveAuditDate, liveAudit, routeRows, decisionRows }));
  writeText(files.projectCsv, toCsv(routeRows, routeColumns));
  writeText(files.reportCsv, toCsv(routeRows, routeColumns));
  writeText(files.reportJson, JSON.stringify(payload, null, 2));

  process.stdout.write(`Wrote ${path.relative(ROOT, files.projectMd)}\n`);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.projectCsv)}\n`);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.reportJson)}\n`);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.reportCsv)}\n`);
}

main();
