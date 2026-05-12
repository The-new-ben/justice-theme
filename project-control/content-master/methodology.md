# Content Migration Methodology

## 1. The Danger of Redirect Chains
We must completely avoid creating redirect chains (e.g., Old Hebrew URL → Temp English URL → Final Pillar URL). 

**Correct Flow:**
Map every existing URL directly to its *final destination*.
`Old Hebrew URL` → `Final Pillar URL (English Slug)`

## 2. Cluster-by-Cluster Execution
To move quickly but safely, we will execute the restructure one topic cluster at a time.
1. **Identify Cluster:** (e.g., Family Law)
2. **Assign Pillars:** Identify 3-5 core pillar URLs for the cluster.
3. **Map Supporting Pages:** Identify which pages support the pillars via internal links.
4. **Merge/Consolidate:** For weak pages causing cannibalization, decide which pillar they belong to.
5. **Redirect Map:** Add them to `redirect-map.csv` pointing to the pillar.

## 3. Decision Matrix
Use the `recommended_action` column in `content-master-inventory.csv`:
- `MAKE_PILLAR`: This page is strong and will become the definitive guide for a topic.
- `SUPPORT_PILLAR`: This page targets a long-tail keyword safely and will link back to a pillar.
- `MERGE`: This page causes cannibalization and offers no unique value. Its content moves to a pillar, and its URL redirects to that pillar.
- `REDIRECT_LATER`: We will deal with this later.
- `NEEDS_OWNER_REVIEW`: Ambiguous intent; human review required.

## 4. Minimum Safe Checklist for Uploading a Cluster
1. `content-master-inventory.csv` fully populated for the cluster.
2. `redirect-map.csv` validated with no intermediate hops.
3. Content rewritten/merged locally if necessary.
4. Database backup taken.
