## 2026-06-08T18:31:56Z
You are the Worker for Milestone 4 (SEO Silo Routing & Programmatic SEO).
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m4.

Please implement the following changes in the Next.js app:

1. **Fix Prerender / Build Failure in `src/app/lawyers/[slug]/page.js`**:
   - Locate the button element on line 92 that contains `onClick={() => alert(...)}`.
   - Replace it with a static `<Link>` component from `next/link` pointing to `/contact?lawyer=${encodeURIComponent(lawyer.title)}`.
   - Ensure you import `Link` from `next/link`.

2. **Prevent Keyword Cannibalization in Catch-All Router `src/app/[slug]/page.js`**:
   - Check if the requested slug is a category hub or spoke using `getLocalHub` and `getAllLocalSpokes` from `@/lib/wordpress`.
   - If it is, use `permanentRedirect()` from `next/navigation` to perform a 308 redirect to `/practice-areas/[category]` or `/practice-areas/[category]/[slug]`.
   - Change canonical URLs to absolute urls: `https://jus-tice.co.il/${decodedSlug}`.

3. **Convert Header Links to Link Components in `src/app/components/Header.js`**:
   - Import `Link` from `next/link`.
   - Replace standard HTML `<a>` tags with `<Link>` components for all internal links (keeping their styling/attributes intact) to fix ESLint warnings/errors.

4. **Update Breadcrumb Trails in Hub & Spoke Pages**:
   - In `src/app/practice-areas/[category]/page.js` and `src/app/practice-areas/[category]/[slug]/page.js`, update the "תחומי התמחות" breadcrumb item `href` from `/#features` to `/practice-areas`.

5. **Create the Practice Areas Index Landing Page**:
   - Create `src/app/practice-areas/page.js`.
   - Retrieve all categories using `getAllLocalHubs()` from `@/lib/wordpress`.
   - Render them in a clean, responsive card layout in RTL, using Header and Breadcrumbs components.
   - Enforce quality copywriting guidelines: no em-dashes (—), no AI transition tells ("בנוסף", "חשוב לציין כי", "לסיכום", "ראוי לציין"), and use active voice.

6. **Update Sitemap Generation in `src/app/sitemap.js`**:
   - Import `getAllLocalHubs` and `getAllLocalSpokes` from `@/lib/wordpress`.
   - Add directory page urls `/lawyers` and `/practice-areas` with appropriate priorities.
   - Add category hubs and spokes with correct URL paths under `/practice-areas/`.
   - Filter `pageEntries` and `postEntries` so they do not duplicate any slugs that are already hubs or spokes.

7. **Implement Sitemap Ping API**:
   - Create `src/app/api/ping-sitemap/route.js`.
   - It should support a POST request, return Google status as deprecated, and trigger a fetch to Bing's sitemap ping endpoint and IndexNow API.
   - Generate a static verification key file at `public/8f828a2a7cf84028945a05b38a4cdb83.txt` containing only the key string `8f828a2a7cf84028945a05b38a4cdb83`.

8. **Fix Hoisting / ESLint Issues in Homepage `src/app/page.js`**:
   - Move the declaration of `const triggerClaimLead = () => { ... }` (line 353) before the `useEffect` on line 307 which invokes it, to prevent reference errors and lint errors during compilation.

9. **Build and Test Verification**:
   - Run the build command (`npm run build`) and the linter (`npm run lint`).
   - Document commands and results in your handoff report.
