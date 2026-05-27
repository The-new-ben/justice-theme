import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const HOMEPAGE_URL = 'https://jus-tice.co.il/';

const forbiddenPublicMarkers = [
  'revenue',
  'ARR',
  'MRR',
  'business plan',
  'Lawhive',
  'Harvey',
  'monetization',
  'package economics',
  '\u05d4\u05db\u05e0\u05e1\u05d4',
  '\u05e8\u05d5\u05d5\u05d7',
  '\u05de\u05d5\u05d3\u05dc \u05e2\u05e1\u05e7\u05d9',
  '\u05ea\u05db\u05e0\u05d9\u05ea \u05e2\u05e1\u05e7\u05d9\u05ea',
];

const competitorNotes = [
  {
    id: 'COMP-HCTA-01',
    source: 'din.co.il',
    url: 'https://www.din.co.il/',
    observed_pattern: 'Search/category discovery is the dominant first action, while individual lawyer exposure appears as card-level contact context rather than a new homepage promise.',
    usable_takeaway: 'Keep the homepage led by legal-help search and guidance; make repeated lawyer-card actions local to the cards and visually secondary.',
  },
  {
    id: 'COMP-HCTA-02',
    source: 'lawzone.co.il',
    url: 'https://lawzone.co.il/',
    observed_pattern: 'The top flow emphasizes finding a lawyer by field/location, then uses a separate consultation form lower on the page.',
    usable_takeaway: 'Do not add more competing top-level CTAs; if the card action stays, it should not overpower search, category and guidance flows.',
  },
  {
    id: 'COMP-HCTA-03',
    source: 'myattorney.co.il',
    url: 'https://www.myattorney.co.il/',
    observed_pattern: 'The homepage opens with search and recommended lawyers, with lawyer cards functioning as discovery items.',
    usable_takeaway: 'Lawyer cards can stay commercially useful without every repeated action reading like the main homepage CTA.',
  },
  {
    id: 'COMP-HCTA-04',
    source: 'mishpati.co.il',
    url: 'https://www.mishpati.co.il/',
    observed_pattern: 'Provider cards use a transactional reveal-style action for phone visibility, while the page still carries editorial/legal-topic content.',
    usable_takeaway: 'A clear but quieter repeated card action is acceptable when it is scoped to one provider card and does not blur the page-level legal-help intent.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    auditDate: process.env.AUDIT_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    visualQaDate: process.env.VISUAL_QA_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    densityPacketDate: process.env.DENSITY_PACKET_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--auditDate=')) {
      args.auditDate = arg.slice('--auditDate='.length);
    } else if (arg.startsWith('--visualQaDate=')) {
      args.visualQaDate = arg.slice('--visualQaDate='.length);
    } else if (arg.startsWith('--densityPacketDate=')) {
      args.densityPacketDate = arg.slice('--densityPacketDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries(args)) {
    if (name === 'help') {
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `homepage-cta-lower-section-implementation-guard-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerDecisionCsv: path.join(ROOT, '.project-control', `homepage-cta-lower-section-owner-decision-template-${reportDate}.csv`),
    screenshotTemplateCsv: path.join(ROOT, '.project-control', `homepage-cta-lower-section-screenshot-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourcePaths(args) {
  return {
    auditJson: path.join(ROOT, '.reports', `live-public-cta-density-${args.auditDate}.json`),
    visualQaJson: path.join(ROOT, '.reports', `homepage-cta-visual-qa-packet-${args.visualQaDate}.json`),
    densityPacketJson: path.join(ROOT, '.reports', `homepage-cta-density-review-packet-${args.densityPacketDate}.json`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required JSON: ${filePath}`);
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

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function homepageAuditRow(audit) {
  return (audit.rows || []).find((row) => row.path === '/' || row.url === HOMEPAGE_URL) || {};
}

function buildGuardRows({ homepage, visualSummary, densitySummary }) {
  const repeated = homepage.repeated_text_groups || '-';
  return [
    {
      id: 'HLCG-01',
      section: 'source_finding',
      status: homepage.status === 'REVIEW' ? 'REVIEW_CONFIRMED' : 'SOURCE_AUDIT_NOT_REVIEW',
      evidence: `Live homepage audit: status ${homepage.status || 'missing'}, ${homepage.primary_cta_count || 'missing'} primary CTAs, ${homepage.unique_primary_cta_texts || 'missing'} unique visible labels, repeated group ${repeated}.`,
      implementation_rule: 'Treat the repeated card action as a lower-section design problem, not as permission to add another homepage CTA.',
      owner_decision_needed: 'Choose keep as-is, visual-only quieter treatment, copy/link review, or reduce card exposure.',
      public_change_approved: 'no',
      blocker: 'No homepage label, link, CSS, layout, CMS, SEO or deployment change is approved here.',
    },
    {
      id: 'HLCG-02',
      section: 'visual_gap',
      status: visualSummary?.lowerLawyerCardSectionStillNeedsQa ? 'LOWER_SECTION_QA_MISSING' : 'CHECK_VISUAL_PACKET',
      evidence: 'The earlier mobile screenshot covered header/hero/search/trust/three-step flow; the repeated lawyer-card buttons were lower than the captured area.',
      implementation_rule: 'Before any code change is treated as ready, capture the actual lawyer-card section on mobile and desktop.',
      owner_decision_needed: 'Confirm whether the before/after card section feels useful and not pushy on mobile.',
      public_change_approved: 'no',
      blocker: 'Missing lower-section screenshots and owner/design approval.',
    },
    {
      id: 'HLCG-03',
      section: 'competitor_pattern',
      status: 'COMPETITOR_INFORMED',
      evidence: 'din.co.il keeps search/category discovery as the main first action and treats lawyer exposure as card-level contact context.',
      implementation_rule: 'Preserve Jus-Tice search and guidance as the main homepage path; keep lawyer-card actions visually local.',
      owner_decision_needed: 'None if choosing visual-only treatment; required if changing labels or destinations.',
      public_change_approved: 'no',
      blocker: 'Competitor inspiration does not approve copying content, layout or public code.',
    },
    {
      id: 'HLCG-04',
      section: 'competitor_pattern',
      status: 'COMPETITOR_INFORMED',
      evidence: 'LawZone and MyAttorney lead with find-a-lawyer search flows, then expose lawyer/category discovery below.',
      implementation_rule: 'Avoid turning the lawyer-card strip into the homepage headline action; make card actions secondary to legal-help discovery.',
      owner_decision_needed: 'None if only changing action weight after approval.',
      public_change_approved: 'no',
      blocker: 'Do not introduce public sales-language, supplier-language or package claims.',
    },
    {
      id: 'HLCG-05',
      section: 'competitor_pattern',
      status: 'COMPETITOR_INFORMED',
      evidence: 'Mishpati uses repeated provider-card phone reveal actions, but each action is scoped to one provider card.',
      implementation_rule: 'A repeated action can stay if it is clearly a card-local action, visually quieter than the hero/search CTA and still tappable.',
      owner_decision_needed: 'Approve whether Jus-Tice should keep contact-form destination or move toward profile-first behavior later.',
      public_change_approved: 'no',
      blocker: 'Destination changes are a separate product decision and need route/cannibalization review.',
    },
    {
      id: 'HLCG-06',
      section: 'preferred_candidate',
      status: 'OPTION_B_READY_FOR_APPROVAL_ONLY',
      evidence: 'The source density packet already named visual-only quieter treatment as the lowest-risk candidate; the visual QA packet did not disprove it.',
      implementation_rule: 'Preferred candidate: keep existing card hrefs and Hebrew label, but restyle repeated lawyer-card actions as secondary/compact actions inside cards.',
      owner_decision_needed: 'Owner/design must approve this exact direction before CSS or template work.',
      public_change_approved: 'no',
      blocker: 'Approval missing; lower-section before/after screenshots missing.',
    },
    {
      id: 'HLCG-07',
      section: 'copy_guard',
      status: 'COPY_CHANGE_BLOCKED',
      evidence: 'The current repeated label maps to contact-form URLs; changing visible text could mislead if the target remains a contact form.',
      implementation_rule: 'Do not rename the card action to profile/details/fit-check wording unless the destination and user promise are also reviewed.',
      owner_decision_needed: 'Approve exact Hebrew copy and destination if Option C is selected.',
      public_change_approved: 'no',
      blocker: 'Copy/link-destination mismatch risk.',
    },
    {
      id: 'HLCG-08',
      section: 'implementation_gate',
      status: 'REQUIRED_BEFORE_LOCAL_DIFF',
      evidence: 'A safe implementation needs a constrained selector for homepage lawyer-card actions only.',
      implementation_rule: 'If approved, change only the homepage lawyer-card action treatment; do not touch article CTAs, legal-help CTAs, directory filters or provider routes.',
      owner_decision_needed: 'Approve exact scope before file edits.',
      public_change_approved: 'no',
      blocker: 'No theme diff until the owner approves scope.',
    },
    {
      id: 'HLCG-09',
      section: 'qa_gate',
      status: 'REQUIRED_AFTER_LOCAL_DIFF',
      evidence: 'Mobile density concern came from a real device view; the lower card area must be checked directly.',
      implementation_rule: 'After any local/staging diff: capture mobile 390px lower-card section, desktop 1440px lower-card section, rerun CTA-density audit and scan for business-language leaks.',
      owner_decision_needed: 'Approve or reject based on screenshots and audit output.',
      public_change_approved: 'no',
      blocker: 'QA artifacts missing.',
    },
    {
      id: 'HLCG-10',
      section: 'publication_gate',
      status: 'PUBLICATION_BLOCKED',
      evidence: `Prior density review status: ${densitySummary?.status || 'missing'}; visual QA status: ${visualSummary?.status || 'missing'}.`,
      implementation_rule: 'Only after owner approval, local QA and live/staging verification should the change be committed for deployment. After live publication, email the owner in Hebrew with review URL, summary and associated pages.',
      owner_decision_needed: 'Explicit public-change approval.',
      public_change_approved: 'no',
      blocker: 'No uPress pull or public-change email because no public change exists in this packet.',
    },
    {
      id: 'HLCG-11',
      section: 'associated_pages',
      status: 'REVIEW_BEFORE_PUBLIC_CHANGE',
      evidence: '/lawyers/; /find-lawyer-how-to-find-good-attorney/; /national-insurance-attorney/; /bituach-leumi-appeal-guide/; /rental-agreement/; /labor-lawyer/; /consumer-rights-israel/; /eviction-notice-israel/',
      implementation_rule: 'If the homepage card action becomes profile-first or contact-first, inspect these surfaces for CTA wording, internal-link flow and cannibalization.',
      owner_decision_needed: 'Choose whether card traffic should primarily feed lawyer profiles, contact forms or practice pages.',
      public_change_approved: 'no',
      blocker: 'No internal-link or route decision from this guard.',
    },
    {
      id: 'HLCG-12',
      section: 'hard_stop',
      status: 'NO_PUBLIC_OR_LIVE_ACTION',
      evidence: 'This guard is private implementation preparation only.',
      implementation_rule: 'Do not publish, change CMS, SEO settings, CRM, leads, contacts, invoices, payments, email, WhatsApp, TalkTo, uPress or public homepage code from this artifact alone.',
      owner_decision_needed: 'Owner approval required before any public-facing change.',
      public_change_approved: 'no',
      blocker: 'All live/public actions remain blocked.',
    },
  ];
}

function buildOwnerRows() {
  return [
    {
      decision_id: 'HLCG-DECISION-01',
      question: 'Which homepage lawyer-card CTA direction is approved?',
      recommended_choice: 'approve_option_b_visual_only_quieter',
      allowed_answers: 'keep_as_is | approve_option_b_visual_only_quieter | request_copy_link_review | reduce_card_exposure | park',
      required_evidence_before_public: 'owner decision; lower-section mobile before screenshot; lower-section desktop before screenshot',
      public_action_unblocked: 'no until local diff and QA pass',
      notes: 'Recommended path preserves legal-help-first homepage and avoids changing the user promise.',
    },
    {
      decision_id: 'HLCG-DECISION-02',
      question: 'Should the repeated visible label change?',
      recommended_choice: 'no_label_change_for_first_pass',
      allowed_answers: 'no_label_change_for_first_pass | approve_exact_hebrew_label | decide_after_profile_destination_review',
      required_evidence_before_public: 'copy/link destination review if any label changes',
      public_action_unblocked: 'no until exact copy is approved',
      notes: 'Label changes are riskier because current URLs are contact-form URLs.',
    },
    {
      decision_id: 'HLCG-DECISION-03',
      question: 'Which destination should future card actions prioritize?',
      recommended_choice: 'keep_current_contact_destination_for_visual_only_pass',
      allowed_answers: 'keep_current_contact_destination_for_visual_only_pass | profile_first | practice_page_first | decide_later',
      required_evidence_before_public: 'associated-page and route-flow review if destination changes',
      public_action_unblocked: 'no for destination changes',
      notes: 'Destination changes affect conversion flow and should not be bundled into the first visual cleanup.',
    },
    {
      decision_id: 'HLCG-DECISION-04',
      question: 'What email/update rule applies?',
      recommended_choice: 'email_only_after_verified_public_change',
      allowed_answers: 'email_only_after_verified_public_change | request_private_summary_now',
      required_evidence_before_public: 'review URL; public-change summary; associated pages; cannibalization notes; own concise review',
      public_action_unblocked: 'no',
      notes: 'No email is sent for this private guard because no public page changed.',
    },
  ];
}

function buildScreenshotRows(reportDate) {
  return [
    {
      capture_id: 'HLCG-SHOT-01',
      stage: 'before',
      viewport: 'mobile_390',
      url: HOMEPAGE_URL,
      target_area: 'homepage lawyer-card section showing repeated card actions',
      file_name: `.project-control/visual-evidence/homepage-cta-lower-section-before-mobile-${reportDate}.png`,
      pass_criteria: 'Buttons do not dominate the mobile section; no duplicated article CTA message; legal-help-first flow remains clear.',
    },
    {
      capture_id: 'HLCG-SHOT-02',
      stage: 'before',
      viewport: 'desktop_1440',
      url: HOMEPAGE_URL,
      target_area: 'homepage lawyer-card section showing repeated card actions',
      file_name: `.project-control/visual-evidence/homepage-cta-lower-section-before-desktop-${reportDate}.png`,
      pass_criteria: 'Card actions are understood as card-local and do not compete with search/hero actions.',
    },
    {
      capture_id: 'HLCG-SHOT-03',
      stage: 'after_local_or_staging',
      viewport: 'mobile_390',
      url: 'local_or_staging_homepage_url',
      target_area: 'same lower lawyer-card section',
      file_name: `.project-control/visual-evidence/homepage-cta-lower-section-after-mobile-${reportDate}.png`,
      pass_criteria: 'Quieter treatment remains tappable, readable and commercially useful without feeling like repeated sales pressure.',
    },
    {
      capture_id: 'HLCG-SHOT-04',
      stage: 'after_local_or_staging',
      viewport: 'desktop_1440',
      url: 'local_or_staging_homepage_url',
      target_area: 'same lower lawyer-card section',
      file_name: `.project-control/visual-evidence/homepage-cta-lower-section-after-desktop-${reportDate}.png`,
      pass_criteria: 'Desktop cards remain scannable; primary homepage discovery flow stays visually dominant.',
    },
    {
      capture_id: 'HLCG-SHOT-05',
      stage: 'after_live_if_deployed',
      viewport: 'mobile_390_and_desktop_1440',
      url: HOMEPAGE_URL,
      target_area: 'post-deployment verification',
      file_name: `.project-control/visual-evidence/homepage-cta-lower-section-live-after-${reportDate}.png`,
      pass_criteria: 'Live page matches approved treatment; CTA density audit and business-language scan pass before Hebrew owner email.',
    },
  ];
}

function findForbiddenMarkerHits(rows) {
  const hits = [];
  for (const row of rows) {
    const text = [
      row.implementation_rule,
      row.owner_decision_needed,
    ].join(' ').toLowerCase();

    for (const marker of forbiddenPublicMarkers) {
      if (text.includes(marker.toLowerCase())) {
        hits.push({
          id: row.id,
          section: row.section,
          marker,
        });
      }
    }
  }
  return hits;
}

function markdownReport({ summary, rows, ownerRows, screenshotRows }) {
  return [
    `# Homepage CTA Lower-Section Implementation Guard - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    `Target route: ${HOMEPAGE_URL}`,
    '',
    'Scope: private implementation guard for the homepage lawyer-card CTA density issue. It translates the live audit, visual QA gap and competitor patterns into a guarded approval path. It does not publish, edit CMS content, alter homepage labels/links/CSS/layout, change SEO settings, create leads, contact anyone, send email or deploy.',
    '',
    '## Summary',
    '',
    `- Homepage audit status: ${summary.homepageAuditStatus}`,
    `- Homepage primary CTAs: ${summary.homepagePrimaryCtaCount}`,
    `- Unique visible CTA labels: ${summary.homepageUniquePrimaryCtaTexts}`,
    `- Repeated text groups: ${summary.homepageRepeatedTextGroups || '-'}`,
    `- Competitor notes included: ${summary.competitorNotes}`,
    `- Guard rows: ${summary.guardRows}`,
    `- Owner decision rows: ${summary.ownerDecisionRows}`,
    `- Screenshot template rows: ${summary.screenshotTemplateRows}`,
    `- Forbidden public marker hits in candidate directions: ${summary.forbiddenPublicMarkerHits}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Recommended Path',
    '',
    '1. Keep the homepage legal-help-first: search, problem selection, lawyer fit and practical guidance stay visually dominant.',
    '2. If the owner approves a first pass, use Option B only: make repeated lawyer-card actions visually quieter while keeping current hrefs and the current visible label.',
    '3. Do not change card action copy, destinations, internal links or article CTAs in the same pass.',
    '4. Require lower-section mobile and desktop before/after screenshots, CTA-density rerun and business-language scan before any live publication.',
    '',
    '## Competitor Notes',
    '',
    '| ID | Source | URL | Observed Pattern | Usable Takeaway |',
    '| --- | --- | --- | --- | --- |',
    ...competitorNotes.map((row) => `| ${row.id} | ${row.source} | ${row.url} | ${mdCell(row.observed_pattern)} | ${mdCell(row.usable_takeaway)} |`),
    '',
    '## Guard Rows',
    '',
    '| ID | Section | Status | Evidence | Implementation Rule | Owner Decision Needed | Public Change Approved | Blocker |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) =>
      `| ${row.id} | ${row.section} | ${row.status} | ${mdCell(row.evidence)} | ${mdCell(row.implementation_rule)} | ${mdCell(row.owner_decision_needed)} | ${row.public_change_approved} | ${mdCell(row.blocker)} |`
    ),
    '',
    '## Owner Decision Template',
    '',
    '| Decision ID | Question | Recommended Choice | Allowed Answers | Required Evidence Before Public | Public Action Unblocked | Notes |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...ownerRows.map((row) =>
      `| ${row.decision_id} | ${mdCell(row.question)} | ${row.recommended_choice} | ${mdCell(row.allowed_answers)} | ${mdCell(row.required_evidence_before_public)} | ${mdCell(row.public_action_unblocked)} | ${mdCell(row.notes)} |`
    ),
    '',
    '## Screenshot Template',
    '',
    '| Capture ID | Stage | Viewport | URL | Target Area | File Name | Pass Criteria |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...screenshotRows.map((row) =>
      `| ${row.capture_id} | ${row.stage} | ${row.viewport} | ${mdCell(row.url)} | ${mdCell(row.target_area)} | ${mdCell(row.file_name)} | ${mdCell(row.pass_criteria)} |`
    ),
    '',
    '## Safety Statement',
    '',
    'This packet is private and repo-local. It prepares the next homepage review step only. No public page, CMS content, route, title/H1/meta/body, label, link, CSS/layout, redirect, canonical/noindex, sitemap, taxonomy, CRM record, lead, lawyer/supplier/client contact, invoice, payment, email, WhatsApp, TalkTo, wp-admin write, provider setting or uPress deployment changed.',
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-homepage-cta-lower-section-implementation-guard.mjs [--reportDate=YYYY-MM-DD] [--auditDate=YYYY-MM-DD] [--visualQaDate=YYYY-MM-DD] [--densityPacketDate=YYYY-MM-DD]');
    return;
  }

  const sources = sourcePaths(args);
  const audit = readJson(sources.auditJson);
  const visualQa = readJson(sources.visualQaJson);
  const densityPacket = readJson(sources.densityPacketJson);
  const homepage = homepageAuditRow(audit);
  const visualSummary = visualQa.summary || {};
  const densitySummary = {
    status: densityPacket.status,
    ...(densityPacket.summary || {}),
  };
  const rows = buildGuardRows({ homepage, visualSummary, densitySummary });
  const ownerRows = buildOwnerRows();
  const screenshotRows = buildScreenshotRows(args.reportDate);
  const markerHits = findForbiddenMarkerHits(rows);
  const status = markerHits.length
    ? 'HOMEPAGE_CTA_LOWER_SECTION_IMPLEMENTATION_GUARD_REVIEW_MARKERS'
    : 'HOMEPAGE_CTA_LOWER_SECTION_IMPLEMENTATION_GUARD_READY_NO_PUBLIC_CHANGE';
  const files = outputFiles(args.reportDate);
  const columns = [
    'id',
    'section',
    'status',
    'evidence',
    'implementation_rule',
    'owner_decision_needed',
    'public_change_approved',
    'blocker',
  ];
  const ownerColumns = [
    'decision_id',
    'question',
    'recommended_choice',
    'allowed_answers',
    'required_evidence_before_public',
    'public_action_unblocked',
    'notes',
  ];
  const screenshotColumns = [
    'capture_id',
    'stage',
    'viewport',
    'url',
    'target_area',
    'file_name',
    'pass_criteria',
  ];
  const summary = {
    reportDate: args.reportDate,
    auditDate: args.auditDate,
    visualQaDate: args.visualQaDate,
    densityPacketDate: args.densityPacketDate,
    status,
    targetRoute: HOMEPAGE_URL,
    sourceAuditJson: rel(sources.auditJson),
    sourceVisualQaJson: rel(sources.visualQaJson),
    sourceDensityPacketJson: rel(sources.densityPacketJson),
    homepageAuditStatus: homepage.status || '',
    homepagePrimaryCtaCount: Number(homepage.primary_cta_count || 0),
    homepageUniquePrimaryCtaTexts: Number(homepage.unique_primary_cta_texts || 0),
    homepageRepeatedTextGroups: homepage.repeated_text_groups || '',
    competitorNotes: competitorNotes.length,
    guardRows: rows.length,
    ownerDecisionRows: ownerRows.length,
    screenshotTemplateRows: screenshotRows.length,
    forbiddenPublicMarkerHits: markerHits.length,
    publicChangesApproved: 0,
    cmsChangesApproved: 0,
    seoSettingsChanged: 0,
    crmRecordsCreated: 0,
    contactsSent: 0,
    invoicesOrPaymentsCreated: 0,
    emailSent: 0,
    upressDeploymentRequired: false,
  };

  writeText(files.projectMd, markdownReport({ summary, rows, ownerRows, screenshotRows }));
  writeText(files.projectCsv, toCsv(rows, columns));
  writeText(files.ownerDecisionCsv, toCsv(ownerRows, ownerColumns));
  writeText(files.screenshotTemplateCsv, toCsv(screenshotRows, screenshotColumns));
  writeText(files.reportJson, `${JSON.stringify({ summary, competitorNotes, markerHits, rows, ownerRows, screenshotRows }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(rows, columns));

  console.log(JSON.stringify({ ...summary, files }, null, 2));
}

main();
