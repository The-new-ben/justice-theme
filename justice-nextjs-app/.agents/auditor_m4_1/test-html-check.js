const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../.next/server/app/practice-areas/labor-law/severance-pay-calculator.html');
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  console.log('HTML length:', html.length);
  console.log('Contains "נבדק ואושר":', html.includes('נבדק ואושר'));
  console.log('Contains "נבדק ואושר משפטית":', html.includes('נבדק ואושר משפטית'));
  
  // Find surrounding text for "אושר"
  const idx = html.indexOf('אושר');
  if (idx !== -1) {
    console.log('Surrounding text:', html.substring(idx - 30, idx + 70));
  } else {
    console.log('"אושר" not found');
  }

  // Check the GTM inclusion as well
  console.log('Contains googletagmanager:', html.includes('googletagmanager'));
  console.log('Contains GTM-TEST1234:', html.includes('GTM-TEST1234'));
} else {
  console.log('HTML file not found at:', htmlPath);
}
