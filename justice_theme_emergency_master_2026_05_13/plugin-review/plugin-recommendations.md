# Plugin / Import Recommendations

Recommended reading/export:
1. WordPress REST API for controlled exports.
2. WP All Export if REST cannot expose needed metadata.
3. GSC API for query/page traffic.

Recommended writing/import:
1. REST API batch update for approved post IDs only.
2. Redirection plugin or Rank Math redirect CSV for approved redirects.
3. Avoid WP All Import for first pilot unless exact rollback is tested.

Do not use a plugin that tags all posts or updates all posts without a filtered approved post_id list.
