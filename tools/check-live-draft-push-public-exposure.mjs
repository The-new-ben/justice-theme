import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = process.cwd();
const SITE = 'https://jus-tice.co.il';
const IDS = [20563, 20564, 20565, 20566, 20567, 20568];
const generatedAt = new Date().toISOString();

function request(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'user-agent': 'JusticeThemePublicExposureCheck/1.0',
          accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
        },
        timeout: 15000,
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          if (body.length < 2500) {
            body += chunk;
          }
        });
        res.on('end', () => {
          resolve({
            url,
            status: res.statusCode,
            finalUrl: res.headers.location || url,
            contentType: res.headers['content-type'] || '',
            bodyPreview: body.slice(0, 500),
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'timeout', finalUrl: url, contentType: '', bodyPreview: '' });
    });
    req.on('error', (error) => {
      resolve({ url, status: 'error', error: error.message, finalUrl: url, contentType: '', bodyPreview: '' });
    });
  });
}

function isLikelyPublic(check) {
  if (check.status !== 200) {
    return false;
  }
  const body = String(check.bodyPreview || '').toLowerCase();
  return !body.includes('rest_forbidden') && !body.includes('not found') && !body.includes('page not found');
}

fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'project-control'), { recursive: true });

const checks = [];
for (const id of IDS) {
  checks.push({
    id,
    restArticle: await request(`${SITE}/wp-json/wp/v2/articles/${id}`),
    publicQuery: await request(`${SITE}/?p=${id}`),
  });
}

const exposed = checks.filter((item) => isLikelyPublic(item.restArticle) || isLikelyPublic(item.publicQuery));
const result = {
  generated_at: generatedAt,
  site: SITE,
  checked_ids: IDS,
  source_of_ids: 'user pasted another-agent report claiming WordPress draft IDs 20563-20568',
  public_exposure_detected: exposed.length > 0,
  exposed_ids: exposed.map((item) => item.id),
  checks,
  interpretation: exposed.length
    ? 'At least one claimed draft ID appears reachable publicly. Review immediately before any publication or homepage assignment.'
    : 'No public exposure detected from unauthenticated REST/article checks. Keep claimed imported drafts unpublished until reviewed for accuracy and brand fit.',
  boundaries: {
    cms_login_used: false,
    cms_write_performed: false,
    redirects_or_canonicals_changed: false,
  },
};

const reportPath = path.join(ROOT, 'reports', 'live-draft-push-public-exposure-2026-05-25.json');
fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`);

const alertPath = path.join(ROOT, 'project-control', 'live-draft-push-risk-alert-2026-05-25.md');
const lines = [
  '# Live Draft Push Risk Alert - 2026-05-25',
  '',
  '## What Was Checked',
  '',
  'Another agent claimed it pushed draft article IDs 20563-20568 to the live WordPress CMS. This checker only performs unauthenticated public requests. It does not log in, edit, publish, delete, or change WordPress settings.',
  '',
  '## Result',
  '',
  result.public_exposure_detected
    ? `PUBLIC EXPOSURE DETECTED for IDs: ${result.exposed_ids.join(', ')}.`
    : 'No public exposure detected for the claimed draft IDs in unauthenticated checks.',
  '',
  '## Owner Guidance',
  '',
  '- Do not publish the generated drafts without human review.',
  '- Treat any draft that describes Jus-Tice as a law firm, invents address/phone/stats, or creates duplicate pillar URLs as unsafe.',
  '- Use the useful research patterns to improve existing approved pages and CMS-driven lawyer surfaces instead of publishing bulk generated pages.',
  '',
  `Detailed JSON: reports/live-draft-push-public-exposure-2026-05-25.json`,
  '',
];
fs.writeFileSync(alertPath, `${lines.join('\n')}\n`);

console.log(JSON.stringify({ reportPath, alertPath, publicExposureDetected: result.public_exposure_detected }, null, 2));
