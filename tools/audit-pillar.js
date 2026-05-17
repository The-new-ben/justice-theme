// Quick pillar page SEO audit
async function audit() {
  const r = await fetch('https://jus-tice.co.il/criminal-defense-attorney/');
  const html = await r.text();
  
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || 'NONE';
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const desc = descMatch ? descMatch[1] : 'NONE';
  const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  const canonical = canonMatch ? canonMatch[1] : 'NONE';
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const h1 = h1Match ? h1Match[1] : 'NONE';
  const h2s = Array.from(html.matchAll(/<h2[^>]*>([^<]{3,80})<\/h2>/g)).map(m => m[1].trim());
  const schemas = Array.from(html.matchAll(/<script type="application\/ld\+json">/g));
  
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = text.split(' ').length;
  
  const hasLeadForm = html.includes('justice_submit_lead');
  const hasAskLawyer = html.includes('ask-lawyer');
  const hasCtaSection = html.includes('cta-section');
  
  console.log('=== PILLAR PAGE SEO AUDIT ===');
  console.log('URL: https://jus-tice.co.il/criminal-defense-attorney/');
  console.log('Status:', r.status);
  console.log('Title:', title);
  console.log('Meta desc:', desc ? desc.substring(0, 120) + '...' : 'NONE');
  console.log('Canonical:', canonical);
  console.log('H1:', h1);
  console.log('H2 count:', h2s.length);
  h2s.slice(0, 10).forEach(h => console.log('  -', h));
  console.log('Schema blocks:', schemas.length);
  console.log('Approx word count:', wordCount);
  console.log('');
  console.log('=== CONVERSION ELEMENTS ===');
  console.log('Lead form (justice_submit_lead):', hasLeadForm);
  console.log('Ask-lawyer anchor:', hasAskLawyer);
  console.log('CTA section:', hasCtaSection);
  
  // Now verify a random article has the injected link
  console.log('');
  console.log('=== VERIFY INJECTION ===');
  const check = await fetch('https://jus-tice.co.il/lahav-433/');
  const checkHtml = await check.text();
  const hasLink = checkHtml.includes('criminal-defense-attorney');
  const hasCTA = checkHtml.includes('justice-pillar-link');
  console.log('lahav-433 article links to pillar:', hasLink);
  console.log('lahav-433 has CTA block:', hasCTA);
}
audit().catch(console.error);
