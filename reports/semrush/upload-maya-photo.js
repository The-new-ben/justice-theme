/**
 * Download Maya Rotenberg's photo from rotenberglaw.co.il and upload to WP
 * Also corrects bar number to 32125 (confirmed from Justia.com + Dun's100)
 */
const https = require('https');
const fs = require('fs');

const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');

const PHOTO_URL = 'https://rotenberglaw.co.il/_Uploads/dbsArticles/_cut/F0_1920_0616_advocate-maya-rotenberg(1).jpg';
const LOCAL_PATH = 'C:/Users/pro/justice/maya-photo.jpg';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.destroy();
        fs.unlink(dest, () => {});
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.destroy();
        return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

function wpPost(path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path, method: 'POST',
      headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch(e) { resolve({ status: res.statusCode, body: d }); } });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function wpUploadMedia(filePath, filename) {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const boundary = 'JusticeUpload' + Date.now();
    const CRLF = '\r\n';
    const header = '--' + boundary + CRLF +
      'Content-Disposition: form-data; name="file"; filename="' + filename + '"' + CRLF +
      'Content-Type: image/jpeg' + CRLF + CRLF;
    const footer = CRLF + '--' + boundary + '--' + CRLF;
    const bodyParts = [Buffer.from(header), fileContent, Buffer.from(footer)];
    const body = Buffer.concat(bodyParts);
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path: '/wp-json/wp/v2/media', method: 'POST',
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length,
      }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch(e) { resolve({ status: res.statusCode, body: d }); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Step 1: Downloading Maya photo from rotenberglaw.co.il...');
  await downloadFile(PHOTO_URL, LOCAL_PATH);
  const stats = fs.statSync(LOCAL_PATH);
  console.log('Downloaded OK:', stats.size, 'bytes to', LOCAL_PATH);

  console.log('Step 2: Uploading to WordPress media library...');
  const upload = await wpUploadMedia(LOCAL_PATH, 'maya-rotenberg-attorney.jpg');
  console.log('Upload HTTP status:', upload.status);

  if (upload.body && upload.body.id) {
    const mediaId = upload.body.id;
    console.log('Media uploaded: ID', mediaId, '| URL:', upload.body.source_url);

    // Update Maya's meta: alt text on the image
    await wpPost('/wp-json/wp/v2/media/' + mediaId, {
      alt_text: 'עו"ד מאיה רוטנברג — עורכת דין גירושין ודיני משפחה',
      caption: 'עו"ד מאיה רוטנברג, מומחית בדיני משפחה וגירושין | דירוג Dun\'s 100 לשנת 2026'
    });

    console.log('Step 3: Setting as Maya\'s featured image + correcting bar number...');
    const update = await wpPost('/wp-json/wp/v2/justice_lawyer/19130', {
      featured_media: mediaId,
      meta: {
        // CORRECTED bar number: 32125 confirmed from Justia.com + Dun's100 (was wrongly 83868)
        bar_number: '32125',
        phone: '054-4705733',
        office_address: 'ראול ולנברג 18, מגדל C, רמת החייל, תל אביב 6971915',
        years_experience: 20,
        linkedin_url: 'https://il.linkedin.com/in/maya-rotenberg-88035531',
      }
    });
    console.log('Maya profile update:', update.status);
    console.log('Bar number corrected to 32125');
    console.log('Photo ID', mediaId, 'set as featured image on profile ID 19130');
  } else {
    console.error('Upload failed:', JSON.stringify(upload).substring(0, 500));
  }

  fs.unlinkSync(LOCAL_PATH);
  console.log('Done!');
}

main().catch(console.error);
