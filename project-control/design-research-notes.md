# Design Research Notes

## Competitor Analysis & Inspiration

### 1. din.co.il
- **What looks premium:** Highly structured directory feel. Practice area navigation is crystal clear and categorizes lawyers efficiently. Lawyer cards have strong visual hierarchy (Photo, Name, Firm, Phone, 'Send Message' CTA).
- **What to apply:** Clear contact CTAs on every lawyer card. Organized category grid.
- **What to avoid:** Looking too dated or "Web 2.0". We want a more modern aesthetic.

### 2. psakdin.co.il
- **What looks premium:** Authoritative content presentation. Very strong legal news hierarchy.
- **What to apply:** Article cards need to look like serious editorial content (category chip, date, excerpt, clear H1).
- **What to avoid:** Overcrowding. Psakdin can feel very dense. We need more whitespace and breathing room.

### 3. Justia
- **What looks premium:** Lawyer profiles are built to sell. Clear "Premium" placements. Badges for verification/status. Direct monetization pathways.
- **What to apply:** Lawyer profiles must feel like mini-websites for the lawyer. Badges, clear practice areas, big contact buttons.
- **What to avoid:** Aggressive ad placements that cheapen the look.

### 4. Modern Premium Web Design (SaaS / Legal-Tech)
- **What looks premium:** Bento grids, subtle glassmorphism (frosted panels, backdrop-filter), layered shadows (`box-shadow: 0 14px 40px rgba(7, 21, 47, 0.08)`), high-contrast typography, confident whitespace.
- **What to apply:** Apply the glassmorphism to the Hero panel. Use `premium-card` styling for all grid items. Ensure deep contrast for the Navy brand color.

## Implementation Ideas for Jus-Tice

### Homepage
- **Hero:** Deep Navy background with a subtle gradient. A glassmorphism search panel (`backdrop-filter: blur(18px)`).
- **Categories:** Shorter names (e.g., "פלילי" instead of long SEO phrases). Use elegant SVG icons, not cheap emoji or tiny icons.
- **Lawyer Cards:** "Bento" style cards. Initials placeholder if no photo. "צפייה בפרופיל" and "שליחת פנייה" buttons.

### Footer
- **Structure:** 4-column premium layout. Brand lockup on the right (RTL), Practice Areas, Resources, and Trust/Legal links.
- **Fix:** Remove the massive broken WhatsApp icon.

### Article Pages
- **Layout:** Clean reading column (max-width: 800px). Editorial note box. Breadcrumbs. Author/Lawyer attribution box.
