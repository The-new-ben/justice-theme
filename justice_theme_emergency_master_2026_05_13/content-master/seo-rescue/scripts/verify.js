const https = require('https');
const urls = [
  '/lahav-433/', '/shoplifting/', '/immigration-lawyer/',
  '/famous-criminal-defense-lawyer/', '/golden-visa/', '/usa-lawyers/',
  '/greece-lawyers/', '/divorce-lawyer/', '/germany-lawyers/', '/spain-lawyers/',
  '/tax-investigation-guide/', '/lawyer-fee-outlook/', '/extradition-guide/',
  '/thailand-real-estate/', '/online-rent-agreement/', '/murder-in-united-states-law/',
];
let i = 0;
function test() {
  if (i >= urls.length) { console.log('\nDONE'); return; }
  const u = urls[i++];
  https.get('https://jus-tice.co.il' + u, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }, r => {
    const ok = r.statusCode === 301 && r.headers.location && r.headers.location.includes('/articles/');
    console.log(ok ? '✅' : '❌', r.statusCode, u, '->', r.headers.location || '(none)');
    test();
  }).on('error', e => { console.log('❌ ERR', u, e.message); test(); });
}
test();
