import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const authorityPath = path.join(root, 'inc', 'authority.php');
const schemaPath = path.join(root, 'inc', 'schema.php');
const eeatPath = path.join(root, 'inc', 'eeat.php');
const reportDir = path.join(root, 'reports');
const csvPath = path.join(reportDir, 'eeat-authority-safety-2026-05-22.csv');
const jsonPath = path.join(reportDir, 'eeat-authority-safety-2026-05-22.json');

const authority = fs.readFileSync(authorityPath, 'utf8');
const schema = fs.readFileSync(schemaPath, 'utf8');
const eeat = fs.readFileSync(eeatPath, 'utf8');

const checks = [
  {
    id: 'EEAT-001',
    area: 'article-schema',
    status: !schema.includes('#author-ben-btesh') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Article schema does not contain the old hardcoded Ben Person @id.',
  },
  {
    id: 'EEAT-002',
    area: 'article-schema',
    status: schema.includes('justice_theme_authority_organization_schema') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Article author is sourced from the safe organization authority helper.',
  },
  {
    id: 'EEAT-003',
    area: 'reviewer-schema',
    status: schema.includes('justice_theme_authority_article_reviewer_schema') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Article reviewedBy is sourced only from the verified reviewer helper.',
  },
  {
    id: 'EEAT-004',
    area: 'legacy-eeat',
    status: eeat.includes('justice_eeat_legacy_auto_injection_enabled') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Legacy E-E-A-T auto-injection has an explicit opt-in gate.',
  },
  {
    id: 'EEAT-005',
    area: 'legacy-eeat',
    status: eeat.includes("apply_filters( 'justice_theme_enable_legacy_eeat_auto_injection', false )") ? 'VERIFIED' : 'BLOCKED',
    detail: 'Legacy E-E-A-T gate defaults to false.',
  },
  {
    id: 'EEAT-006',
    area: 'legacy-eeat',
    status: (eeat.match(/justice_eeat_legacy_auto_injection_enabled\(\)/g) || []).length >= 3 ? 'VERIFIED' : 'BLOCKED',
    detail: 'Legacy Person schema and content injection paths call the opt-in gate.',
  },
  {
    id: 'EEAT-007',
    area: 'lawyer-schema',
    status: schema.includes('justice_theme_lawyer_profile_is_public_approved') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Lawyer profile schema is gated behind public profile approval.',
  },
  {
    id: 'EEAT-008',
    area: 'lawyer-person-schema',
    status: schema.includes('function justice_theme_lawyer_person_schema') && schema.includes('justice_theme_authority_get_verified_person_schema') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Verified lawyer Person schema is emitted only through the authority registry helper.',
  },
  {
    id: 'EEAT-009',
    area: 'lawyer-person-schema',
    status: authority.includes('function justice_theme_authority_verified_person_slug_for_post') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Verified person profiles resolve from the authority registry, including the Maya profile fallback.',
  },
  {
    id: 'EEAT-010',
    area: 'lawyer-schema',
    status: schema.includes('profile_public_sources') && schema.includes('justice_theme_lawyer_schema_same_as_urls') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Lawyer schema sameAs URLs are gathered from approved profile source/social fields.',
  },
  {
    id: 'EEAT-011',
    area: 'ben-entity',
    status: !authority.includes("'ben-batash'") && !authority.includes('"ben-batash"') ? 'VERIFIED' : 'BLOCKED',
    detail: 'Ben is not in the verified person authority registry until owner facts and external links are supplied.',
  },
];

fs.mkdirSync(reportDir, { recursive: true });

const csvEscape = (value) => {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

fs.writeFileSync(
  csvPath,
  ['id,area,status,detail', ...checks.map((check) => [check.id, check.area, check.status, check.detail].map(csvEscape).join(','))].join('\n') + '\n',
);

fs.writeFileSync(
  jsonPath,
  JSON.stringify({ generated_at: '2026-05-22', checks }, null, 2) + '\n',
);

const blocked = checks.filter((check) => check.status !== 'VERIFIED');
console.log(`EEAT authority safety checks: ${checks.length - blocked.length}/${checks.length} VERIFIED`);
if (blocked.length) {
  console.error(`BLOCKED checks: ${blocked.map((check) => check.id).join(', ')}`);
  process.exit(1);
}
