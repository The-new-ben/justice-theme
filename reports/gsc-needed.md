# Google Search Console Integration & Data Needs

To properly resolve content cannibalization and ensure our new pillar architecture is successful, we need the following data extracts from Google Search Console once access is granted.

## Required Reports

1. **Last 3 Months Performance Data**
   * Dimensions: Query, Page
   * Metrics: Clicks, Impressions, CTR, Position
   * Reason: Identify recent cannibalization and active pages.

2. **Last 12 Months Performance Data**
   * Dimensions: Query, Page
   * Metrics: Clicks, Impressions, CTR, Position
   * Reason: Understand seasonality and long-term trends for legal topics.

3. **Index Coverage Report**
   * Identify all indexed pages (Valid).
   * Identify "Excluded" pages (Discovered - currently not indexed / Crawled - currently not indexed).
   * Reason: We need to see if Google is ignoring our articles due to low quality or duplication.

4. **Low CTR Opportunities**
   * Filter: Impressions > 1000, CTR < 2%
   * Reason: These are pages that rank but fail to attract clicks. Needs title/meta description optimization.

5. **Position 5-20 Opportunities**
   * Reason: These are striking-distance keywords. Improving internal linking to these pages will yield quick wins.

6. **Duplicate Query Map**
   * Pivot the data to show: `Query -> List of Pages ranking for it`
   * Reason: This is the definitive proof of cannibalization. We will use this to finalize the merge/redirect strategy.

7. **Traffic Drop Analysis**
   * Compare last 3 months vs previous year.
   * Reason: Identify if the site was hit by a recent Google Helpful Content Update (HCU) or Core Update.
