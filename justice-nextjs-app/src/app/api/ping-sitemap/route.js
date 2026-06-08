import { NextResponse } from 'next/server';

export async function POST() {
  const sitemapUrl = 'https://jus-tice.co.il/sitemap.xml';
  const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  const indexNowUrl = 'https://api.indexnow.org/IndexNow';

  const indexNowPayload = {
    host: 'jus-tice.co.il',
    key: '8f828a2a7cf84028945a05b38a4cdb83',
    keyLocation: 'https://jus-tice.co.il/8f828a2a7cf84028945a05b38a4cdb83.txt',
    urlList: [sitemapUrl],
  };

  const results = {
    google: {
      status: 'deprecated',
      message: 'Google no longer supports sitemap ping requests via GET/POST endpoint.'
    },
    bing: {
      status: 'pending',
      statusCode: null,
      message: null
    },
    indexNow: {
      status: 'pending',
      statusCode: null,
      message: null
    }
  };

  // 1. Ping Bing
  try {
    const bingRes = await fetch(bingPingUrl, { method: 'GET' });
    results.bing.status = bingRes.ok ? 'success' : 'failed';
    results.bing.statusCode = bingRes.status;
  } catch (err) {
    results.bing.status = 'error';
    results.bing.message = err.message;
  }

  // 2. Ping IndexNow
  try {
    const indexNowRes = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indexNowPayload)
    });
    results.indexNow.status = indexNowRes.ok ? 'success' : 'failed';
    results.indexNow.statusCode = indexNowRes.status;
  } catch (err) {
    results.indexNow.status = 'error';
    results.indexNow.message = err.message;
  }

  return NextResponse.json(results);
}
