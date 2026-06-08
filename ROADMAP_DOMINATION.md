# JUS-TICE Portal: Domination & Monetization Roadmap

This document defines the 5 far-reaching business and SEO goals set by the owner, along with their technical and architectural implementation requirements.

---

## 🚀 The 5 Domination Goals

### 1. Top 3 Rankings for Core Hebrew Legal Head Terms (60-Day Target)
*   **Target Keywords**: `עורך דין מקרקעין` (Real Estate), `רשלנות רפואית` (Medical Malpractice), `עורך דין פלילי` (Criminal Law).
*   **Strategy**: Topic clustering using a nested Silo directory structure. Scale to 150+ dynamic spoke pages (calculators, guides, templates) referencing statutory Israeli laws to maximize topical authority.
*   **Infrastructure**: Headless WordPress GraphQL API integration with Next.js ISR (Incremental Static Regeneration) to dynamically render and cache articles instantly, combined with XML sitemap updates and sitemap pings.

### 2. Instant Lead-to-Lawyer Ingestion & Routing CRM (10-Second Target)
*   **Target Performance**: Lead ingestion, classification, and SMS/WhatsApp routing to matching Pro-tier lawyers in under 10 seconds.
*   **Strategy**: Real-time serverless ingestion in `POST /api/leads`. Leverage Supabase Realtime row-level replication or edge triggers.
*   **Classification**: Rule-based keyword matching (e.g. detecting practice area, geographic region, and urgency) mapping to matching advocate profiles, and sending instant SMS alerts via Twilio/Resend.

### 3. Automated Peer-to-Peer & Google Review Syndication
*   **Target Feature**: Rich-snippet star ratings displayed on search result pages by collecting and verifying real reviews.
*   **Strategy**:
    *   **Google Reviews**: Programmatic Place ID sync using Google Places API, caching reviews in Supabase.
    *   **Colleague Endorsements**: A verified login portal where lawyers can endorse colleagues (building professional E-E-A-T networks).
    *   **JSON-LD Syndication**: Automated generation of `AggregateRating` and `Review` structured data on practice area pages.

### 4. Instant-Monetization Document & Signature Generator
*   **Target Revenue**: Charge ₪249–₪399 for automated demand letters, digital notary signatures, and small claims filing.
*   **Strategy**:
    *   **Digital Signature**: An HTML5 Canvas drawing tool for notarized signatures, outputting signed PDFs.
    *   **Payment Gateway**: Stripe checkout integration (`POST /api/checkout`) with webhook callback loops (`POST /api/webhooks`) to update lead status and credits automatically.
    *   **Flow**: Client fills case details -> Owed compensation calculated -> Pay button -> Signed demand letter generated.

### 5. High-DA Digital PR Link Acquisition Network
*   **Target Metric**: Boost Domain Authority (DA) from baseline to 50+ to outrank established competitors.
*   **Strategy**: Publish syndication columns and guest posts on high-traffic Israeli portals (Walla, Ynet, Globes, Calcalist). These articles link back to JUS-TICE's directory silo pages (`/practice-areas/real-estate-law`), transferring PageRank to our main hubs.

---

## 🛠️ Architectural Status

The currently executing Next.js/Supabase upgrades prepare the codebase for these goals:
1.  **Silo Directory Routes**: Established clean directory paths (`/practice-areas/[category]/[slug]`) to distribute link juice effectively.
2.  **Reviews Schema & Caching**: Designed DB schema supporting multi-source verification (Client, Colleague, Google) to dynamically populate schemas.
3.  **Payment & Webhook Gateways**: Standardized Stripe checkouts and webhook processing to automate lead purchases and document reloads.
4.  **E-E-A-T Quality Safeguards**: Programmatic tests ensuring zero AI tells and strict law citations.
