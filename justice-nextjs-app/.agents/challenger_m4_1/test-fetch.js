const fs = require('fs');

async function test() {
  const res = await fetch('http://127.0.0.1:59990/practice-areas/labor-law/severance-pay-calculator');
  const html = await res.text();
  console.log('HTML preview (1000 chars):', html.substring(0, 1000));

  
  // Let's check if the phrase from tests.js is in the html
  const testsJsContent = fs.readFileSync('c:/Users/pro/justice/justice-nextjs-app/tests/e2e/tests.js', 'utf8');
  
  // Find the exact phrase used in tests.js line 687
  const line = testsJsContent.split('\n')[686]; // 0-indexed line 686 (line 687)
  console.log('Line 687 from file:', JSON.stringify(line));
  
  // Extract the string inside includes(...)
  const match = line.match(/includes\('(.*?)'\)/);
  if (match) {
    const phrase = match[1];
    console.log('Extracted phrase:', JSON.stringify(phrase));
    console.log('Phrase char codes:', phrase.split('').map(c => c.charCodeAt(0)).join(', '));
    console.log('HTML contains phrase:', html.includes(phrase));
    
    // Let's search for "נבדק" in HTML and print surrounding text
    const idx = html.indexOf('נבדק');
    if (idx !== -1) {
      const surrounding = html.substring(idx, idx + 80);
      console.log('Surrounding in HTML:', JSON.stringify(surrounding));
      console.log('Surrounding char codes:', surrounding.split('').map(c => c.charCodeAt(0)).join(', '));
    } else {
      console.log('Could not find "נבדק" in HTML');
    }
  } else {
    console.log('Could not match includes() in line');
  }
}

test().catch(console.error);
