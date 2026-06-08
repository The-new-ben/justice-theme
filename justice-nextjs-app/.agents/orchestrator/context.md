# JUS-TICE Portal Context

## Key Environments & Setup
- Project root: `c:\Users\pro\justice\justice-nextjs-app`
- Supabase: Uses `@supabase/supabase-js` package. Client config in `src/lib/supabase.js`. Relies on `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Safe fallbacks are used in code if these are undefined.
- GTM events: Expected dataLayer pushes for tracking.
- Canonical domain: `https://jus-tice.co.il`.

## Advisory Board Credentials (20 members)
We have a listed Advisory Board of 20 experts (Rand Fishkin, Danny Sullivan, etc.) whose credentials must be displayed and linked to E-E-A-T structured schema data.

## Working Directories for Subagents
Each subagent spawned should have its own workspace folder under `c:\Users\pro\justice\justice-nextjs-app\.agents/`:
- E2E Testing: `.agents/testing_track/`
- Milestone 2 (Reviews): `.agents/milestone_2_reviews/`
- Milestone 3 (UI): `.agents/milestone_3_ui/`
- Milestone 4 (SEO): `.agents/milestone_4_seo/`
- Milestone 5 (Funnels): `.agents/milestone_5_funnels/`
- Milestone 6 (EEAT): `.agents/milestone_6_eeat/`
- Milestone 7 (Hardening): `.agents/milestone_7_hardening/`
