/**
 * Enable lead routing for Nahari — one-shot script.
 * 
 * Run: node tools/enable-lawyer-routing.js
 * 
 * This sets `lead_routing_enabled = 1` on Nahari's lawyer profile
 * so the lead routing system will email him when criminal law leads come in.
 */

const fs = require('fs');
const path = require('path');

// Load WP credentials
const credPath = path.join(__dirname, 'gsc', 'wp-app-password.json');
let creds;
try {
  creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
} catch (e) {
  console.error('Cannot load credentials from', credPath);
  console.error('Expected format: { "username": "...", "app_password": "..." }');
  process.exit(1);
}

const SITE = 'https://jus-tice.co.il';
const AUTH = Buffer.from(`${creds.username}:${creds.app_password}`).toString('base64');

// Lawyer profiles to enable routing for
const LAWYERS = [
  { id: 19309, name: 'Sharon Nahari', area: 'criminal-law' },
  // Add more lawyers here as they sign up:
  // { id: 19130, name: 'Maya Rotenberg', area: 'family-law' },
];

async function enableRouting(lawyer) {
  console.log(`\nEnabling routing for ${lawyer.name} (ID: ${lawyer.id})...`);
  
  // WP REST API: update post meta
  const url = `${SITE}/wp-json/wp/v2/justice_lawyer/${lawyer.id}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meta: {
        lead_routing_enabled: '1',
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  ❌ FAILED (${res.status}): ${text.substring(0, 200)}`);
    return false;
  }

  const data = await res.json();
  console.log(`  ✅ Routing enabled for ${data.title?.rendered || lawyer.name}`);
  console.log(`  📧 Leads in area "${lawyer.area}" will now be emailed to this lawyer`);
  return true;
}

async function verifyLawyer(lawyer) {
  console.log(`\nVerifying ${lawyer.name} (ID: ${lawyer.id})...`);
  
  const url = `${SITE}/wp-json/wp/v2/justice_lawyer/${lawyer.id}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Basic ${AUTH}`,
    },
  });

  if (!res.ok) {
    console.error(`  ❌ Cannot fetch lawyer profile (${res.status})`);
    return;
  }

  const data = await res.json();
  console.log(`  Name: ${data.title?.rendered}`);
  console.log(`  Status: ${data.status}`);
  console.log(`  Link: ${data.link}`);
  console.log(`  Practice areas: ${JSON.stringify(data['practice-areas'])}`);
  console.log(`  Meta routing: ${JSON.stringify(data.meta?.lead_routing_enabled)}`);
}

async function main() {
  console.log('=== Lead Routing Activation ===');
  console.log(`Site: ${SITE}`);
  console.log(`Date: ${new Date().toISOString()}`);

  for (const lawyer of LAWYERS) {
    await verifyLawyer(lawyer);
    await enableRouting(lawyer);
    await verifyLawyer(lawyer); // Verify it stuck
  }

  console.log('\n=== Done ===');
  console.log('Next steps:');
  console.log('1. Submit a test lead on a criminal law article');
  console.log('2. Check if Nahari receives the email');
  console.log('3. Check the CRM in wp-admin for the routed lead');
}

main().catch(console.error);
