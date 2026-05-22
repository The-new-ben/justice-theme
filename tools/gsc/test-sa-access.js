const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function listSites() {
  const keyFilePath = 'c:/Users/pro/justice/credentials/jus-tice-theme-a21ab27d03d2.json';
  
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({
      version: 'v1',
      auth: auth,
    });

    console.log('Attempting to contact Google Search Console API with Service Account...');
    const res = await searchconsole.sites.list();
    
    console.log('----------------------------------------------------');
    console.log('API CONNECTION SUCCESSFUL!');
    console.log('Sites accessible to this Service Account:');
    if (res.data.siteEntry && res.data.siteEntry.length > 0) {
      res.data.siteEntry.forEach(site => {
        console.log(`- ${site.siteUrl} (Permission: ${site.permissionLevel})`);
      });
    } else {
      console.log('WARNING: Connected, but no sites are assigned to this Service Account yet.');
      console.log('You need to add "gsc-reader@jus-tice-theme.iam.gserviceaccount.com" as a user (Viewer role is fine) in GSC.');
    }
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('API Error:', error.message);
  }
}

listSites();
