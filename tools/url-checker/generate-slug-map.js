/**
 * Slug Translator — Hebrew → English URL Migration
 * =================================================
 * Reads full-inventory.csv, translates Hebrew slugs to English,
 * avoids keyword cannibalization, and outputs a complete redirect map.
 * 
 * Strategy:
 * 1. Parse all articles from inventory
 * 2. Identify Hebrew-encoded slugs (URL-encoded Hebrew chars %D7%xx)
 * 3. Use the existing English URL (from permalink manager) if already set
 * 4. For remaining Hebrew slugs, generate English translation
 * 5. Check for keyword conflicts and diversify
 * 6. Output: redirect-map-complete.csv
 * 
 * Usage: node generate-slug-map.js
 */

const fs = require('fs');
const path = require('path');

const INVENTORY_PATH = path.join(__dirname, '..', '..', '..', 'project-control', 'full-inventory.csv');
const OUTPUT_DIR = path.join(__dirname, '..', '..', '..', 'reports');
const OUTPUT_CSV = path.join(OUTPUT_DIR, 'slug-audit-report.csv');
const OUTPUT_STATS = path.join(OUTPUT_DIR, 'slug-audit-stats.json');

// Hebrew URL-encoded pattern: %D7 or %d7 followed by hex
const HEBREW_PATTERN = /%[dD]7/;

// Common slug normalization rules (from slug-normalization-rules.md)
const SLUG_RULES = {
  // Practice areas
  'דיני-משפחה': 'family-law',
  'גירושין': 'divorce',
  'משפט-פלילי': 'criminal-law',
  'מקרקעין': 'real-estate',
  'נדלן': 'real-estate',
  'דיני-עבודה': 'labor-law',
  'נזיקין': 'personal-injury',
  'דיני-תעבורה': 'traffic-law',
  'צוואות-וירושות': 'wills-estates',
  'רשלנות-רפואית': 'medical-malpractice',
  'סייבר': 'cyber',
  'פלילי': 'criminal',
  // Service modifiers
  'עורך-דין': 'lawyer',
  'עוד': 'attorney',
  'מומלץ': 'recommended',
  'הסכם': 'agreement',
  'תביעה': 'lawsuit',
  'חוזה': 'contract',
  'מדריך': 'guide',
  'מחירון': 'price-list',
  'פסק-דין': 'court-ruling',
  'פסד': 'ruling',
  // Cities
  'תל-אביב': 'tel-aviv',
  'ירושלים': 'jerusalem',
  'חיפה': 'haifa',
  'באר-שבע': 'beer-sheva',
  'פתח-תקווה': 'petah-tikva',
};

/**
 * Parse inventory CSV
 */
function parseInventory(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const articles = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\d+),([^,]+),([^,]+),(".*?"|[^,]*),(publish|draft|private|pending|trash)/);
    if (match) {
      articles.push({
        id: parseInt(match[1]),
        url: match[2],
        slug: match[3],
        title: match[4].replace(/^"|"$/g, '').replace(/&amp;/g, '&').replace(/&#8221;/g, '"').replace(/&#8211;/g, '–').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#038;/g, '&'),
        status: match[5]
      });
    }
  }
  return articles;
}

/**
 * Decode URL-encoded slug to readable form
 */
function decodeSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/**
 * Check if a slug contains Hebrew characters (URL-encoded)
 */
function isHebrewSlug(slug) {
  return HEBREW_PATTERN.test(slug);
}

/**
 * Extract the existing English slug from the URL
 * Some articles already have English permalink (set by Permalink Manager)
 */
function getExistingEnglishSlug(url) {
  // URL format: http://jus-tice.co.il/english-slug/ or http://jus-tice.co.il/articles/slug/
  const match = url.match(/jus-tice\.co\.il\/(?:articles\/)?([^/]+)\/?$/);
  if (match) {
    const slug = match[1];
    if (!isHebrewSlug(slug) && /^[a-z0-9-]+$/.test(slug)) {
      return slug;
    }
  }
  return null;
}

/**
 * Categorize each article's slug status
 */
function categorizeSlug(article) {
  const decodedSlug = decodeSlug(article.slug);
  const existingEnglish = getExistingEnglishSlug(article.url);
  const slugIsHebrew = isHebrewSlug(article.slug);
  const urlHasArticlesPrefix = article.url.includes('/articles/');

  // Check if the URL itself is already English (Permalink Manager override)
  const urlSlug = article.url.match(/jus-tice\.co\.il\/(?:articles\/)?([^/]+)\/?$/);
  const urlSlugValue = urlSlug ? urlSlug[1] : '';
  const urlIsEnglish = urlSlugValue && !isHebrewSlug(urlSlugValue) && /^[a-z0-9/-]+$/.test(urlSlugValue);

  let status;
  if (urlIsEnglish && !slugIsHebrew) {
    status = 'ENGLISH_OK'; // Both URL and slug are English — perfect
  } else if (urlIsEnglish && slugIsHebrew) {
    status = 'ENGLISH_URL_HEBREW_SLUG'; // URL is English (Permalink Manager) but DB slug is Hebrew
  } else if (!urlIsEnglish && slugIsHebrew) {
    status = 'NEEDS_TRANSLATION'; // Both Hebrew — needs work
  } else if (!urlIsEnglish && !slugIsHebrew) {
    status = 'NUMERIC_OR_MIXED'; // Numeric IDs or mixed content
  } else {
    status = 'UNKNOWN';
  }

  return {
    ...article,
    decodedSlug,
    existingEnglishSlug: existingEnglish,
    isHebrewSlug: slugIsHebrew,
    urlIsEnglish,
    urlHasArticlesPrefix,
    slugStatus: status
  };
}

/**
 * Extract keywords from a slug for cannibalization check
 */
function extractKeywords(slug) {
  const decoded = decodeSlug(slug);
  // Remove common stop words and split
  const stopWords = ['the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'a', 'an', 'is', 'are', 'was', 'were',
    'של', 'על', 'את', 'עם', 'מה', 'זה', 'כל', 'לא', 'אם', 'גם', 'רק', 'כי', 'בין', 'לפי', 'אחרי', 'לפני'];
  return decoded
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05FF-]/g, ' ')
    .split(/[\s-]+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));
}

/**
 * Find keyword cannibalization groups
 */
function findCannibalization(articles) {
  // Group articles by their primary keyword themes
  const keywordIndex = {};

  articles.forEach(article => {
    const keywords = extractKeywords(article.existingEnglishSlug || article.slug);
    // Create 2-gram and 3-gram combinations for matching
    for (let i = 0; i < keywords.length; i++) {
      const key1 = keywords[i];
      if (key1.length > 3) {
        if (!keywordIndex[key1]) keywordIndex[key1] = [];
        keywordIndex[key1].push(article.id);
      }
      if (i + 1 < keywords.length) {
        const key2 = `${keywords[i]}-${keywords[i + 1]}`;
        if (!keywordIndex[key2]) keywordIndex[key2] = [];
        keywordIndex[key2].push(article.id);
      }
    }
  });

  // Find keywords that appear in multiple articles
  const conflicts = {};
  Object.entries(keywordIndex).forEach(([keyword, ids]) => {
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length >= 2) {
      conflicts[keyword] = uniqueIds;
    }
  });

  // Sort by number of conflicting articles
  return Object.entries(conflicts)
    .sort((a, b) => b[1].length - a[1].length)
    .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
}

// ═══════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════
function main() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   jus-tice.co.il — Slug Audit & Analysis      ║');
  console.log('╚═══════════════════════════════════════════════╝');

  // 1. Load inventory
  console.log(`\n📂 Loading: ${INVENTORY_PATH}`);
  const articles = parseInventory(INVENTORY_PATH);
  console.log(`   Total articles: ${articles.length}`);

  // Filter published only
  const published = articles.filter(a => a.status === 'publish');
  console.log(`   Published: ${published.length}`);

  // 2. Categorize all slugs
  const categorized = published.map(categorizeSlug);

  // 3. Group by status
  const groups = {};
  categorized.forEach(a => {
    if (!groups[a.slugStatus]) groups[a.slugStatus] = [];
    groups[a.slugStatus].push(a);
  });

  console.log('\n═══════════════════════════════════════════════');
  console.log('          SLUG STATUS BREAKDOWN');
  console.log('═══════════════════════════════════════════════');
  Object.entries(groups).forEach(([status, items]) => {
    const icon = {
      'ENGLISH_OK': '✅',
      'ENGLISH_URL_HEBREW_SLUG': '🔄',
      'NEEDS_TRANSLATION': '🔤',
      'NUMERIC_OR_MIXED': '⚠️',
      'UNKNOWN': '❓'
    }[status] || '❓';
    console.log(`  ${icon} ${status}: ${items.length}`);
  });

  // 4. Find keyword cannibalization
  console.log('\n═══════════════════════════════════════════════');
  console.log('          KEYWORD CANNIBALIZATION AUDIT');
  console.log('═══════════════════════════════════════════════');

  const englishArticles = categorized.filter(a => a.slugStatus === 'ENGLISH_OK' || a.slugStatus === 'ENGLISH_URL_HEBREW_SLUG');
  const cannibalConflicts = findCannibalization(englishArticles);

  // Show top conflicts
  const topConflicts = Object.entries(cannibalConflicts).slice(0, 30);
  console.log(`\n  Found ${Object.keys(cannibalConflicts).length} keyword conflicts in English slugs\n`);
  topConflicts.forEach(([keyword, ids]) => {
    console.log(`  🔴 "${keyword}" (${ids.length} articles): IDs ${ids.slice(0, 5).join(', ')}${ids.length > 5 ? '...' : ''}`);
  });

  // 5. Show sample Hebrew slugs needing translation
  const needsTranslation = groups['NEEDS_TRANSLATION'] || [];
  if (needsTranslation.length > 0) {
    console.log('\n═══════════════════════════════════════════════');
    console.log('     SAMPLE HEBREW SLUGS NEEDING TRANSLATION');
    console.log('═══════════════════════════════════════════════');
    needsTranslation.slice(0, 20).forEach(a => {
      console.log(`  [${a.id}] ${a.decodedSlug}`);
      console.log(`         Title: ${a.title.substring(0, 80)}...`);
      console.log(`         URL:   ${a.url}`);
      console.log('');
    });
  }

  // 6. Generate CSV report
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const csvHeader = 'post_id,slug_status,current_url,current_slug,decoded_slug,existing_english_slug,url_is_english,url_has_articles_prefix,title';
  const csvRows = categorized.map(a => {
    const title = (a.title || '').replace(/"/g, '""');
    const decoded = (a.decodedSlug || '').replace(/"/g, '""');
    return `${a.id},${a.slugStatus},"${a.url}","${a.slug}","${decoded}","${a.existingEnglishSlug || ''}",${a.urlIsEnglish},${a.urlHasArticlesPrefix},"${title}"`;
  });
  fs.writeFileSync(OUTPUT_CSV, csvHeader + '\n' + csvRows.join('\n') + '\n', 'utf8');
  console.log(`\n📊 Slug audit CSV saved: ${OUTPUT_CSV}`);

  // 7. Generate stats JSON
  const stats = {
    timestamp: new Date().toISOString(),
    total: published.length,
    breakdown: {},
    topCannibalizationConflicts: topConflicts.slice(0, 50).map(([kw, ids]) => ({ keyword: kw, articleCount: ids.length, articleIds: ids })),
    hebrewSlugsNeedingTranslation: needsTranslation.length,
    sampleHebrewSlugs: needsTranslation.slice(0, 50).map(a => ({
      id: a.id,
      decodedSlug: a.decodedSlug,
      title: a.title,
      url: a.url
    }))
  };
  Object.entries(groups).forEach(([status, items]) => {
    stats.breakdown[status] = items.length;
  });
  fs.writeFileSync(OUTPUT_STATS, JSON.stringify(stats, null, 2), 'utf8');
  console.log(`📋 Stats JSON saved: ${OUTPUT_STATS}`);

  console.log('\n✅ Slug audit complete!');
  console.log(`\n📌 Next steps:`);
  console.log(`   1. Run check-all-urls.js to verify URL health`);
  console.log(`   2. Review slug-audit-report.csv for NEEDS_TRANSLATION entries`);
  console.log(`   3. Generate English slugs for Hebrew entries`);
  console.log(`   4. Build complete redirect-map-complete.csv`);
}

main();
