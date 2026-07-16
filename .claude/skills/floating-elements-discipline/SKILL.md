---
name: floating-elements-discipline
description: MANDATORY whenever adding, styling, or debugging any floating/fixed UI element (chat bubbles, WhatsApp buttons, AI pills, back-to-top, cookie bars). One action per corner, full source inventory before touching anything, measured geometry proof at 390px and 1440px after. Born from the 2026-07-16 jus-tice.co.il incident: two WhatsApp controls stacked in one corner, AI pill stacked on the chat bubble in the other.
---

# Floating-elements discipline

Floating elements are the highest-collision surface on a site: they come
from MULTIPLE sources (theme, plugins, snippet managers, third-party
embeds), they all claim the same two corners, and every new one silently
degrades the ones before it. This skill is the law for touching any of
them.

## Law 1 - Inventory before touching (the source map)

Never move or restyle a floating element until you can name the SOURCE of
every fixed-position element on the page. The hunt order that works:

1. **Rendered page**: list every `position:fixed` element
   (`document.querySelectorAll('*')` filtered by computed style, or
   just read the bottom of the DOM - floats are appended to body).
2. **Theme**: grep templates and CSS for the class names.
3. **Plugin managers on WordPress**: floats hide in FOUR stores beyond
   theme files - Code Snippets (`/wp-json/code-snippets/v1/snippets`),
   WPCode (`wpcode` CPT), Header Footer Code Manager (`wp_hfcm_scripts`
   table), and dedicated plugins (tawk.to, WhatsApp chat plugins).
   Autoptimize base64-encodes inline scripts into
   `src="data:text/javascript;base64,..."` - PLAIN GREP OF THE HTML
   MISSES THEM; decode every data-URI script before concluding a
   script "isn't there".
4. Write the map down: element -> selector -> source file/row -> z-index
   -> corner. The jus-tice map (2026-07-16) for reference:
   - `a.whatsapp-button` (broad strip, site logo + WA logo + page-title/URL
     message) <- WPCode snippet 12035
   - `a.whatsapp-float` (old circle) <- theme site-footer.php (kept hidden)
   - `.justice-wa-float` (duplicate pill) <- ops practice-polish.php (RETIRED)
   - `.jt-ai-fab` (AI pill) <- ops tools-discovery.php
   - tawk bubble <- tawkto-live-chat plugin, script id `tawk-script`
   - accessibility toolbar <- pojo-accessibility (side-docked, not a corner)

## Law 2 - One action per corner

The nad-lan aesthetic-ownership law ("ONE of everything - one contact
bar") + the research consensus:

- NN/g on chat UX: one entry point, don't compete with content.
- UX Movement (When to Use a Floating CTA): pick ONE action; a cluster of
  competing floats converts worse than a single clear choice.
- Adam Silver (The problem with sticky menus): every floating element
  costs content space the user chose to scroll to; stack enough of them
  and the page reads amateur.
- Digital X (Sticky CTAs and Floating Buttons: Using Them Well): modern
  sites accumulate a "cluttered fringe" of chat bubbles, cookie bars,
  badges and CTAs; start by choosing the single most important action.

Concretely: each corner holds at most ONE always-visible action. A second
element on the same side goes ONE FIXED SLOT ABOVE (measured, not
guessed), never side-by-side at the bottom line on mobile.

## Law 3 - Duplicates die in code, not in CSS

When two elements serve the same intent (two WhatsApp buttons), pick the
winner by USER VALUE (the jus-tice keeper: the broad strip whose prefilled
message carries page title + URL = the user's intent lands in the
owner's WhatsApp), then REMOVE the loser at its source. Hiding a
duplicate with display:none leaves dead weight and a future regression;
deleting the render is the fix.

## Law 4 - Cascade forensics before new CSS

Floating elements attract !important wars. Before adding rules, read what
already targets the element ACROSS ALL aggregated CSS (Autoptimize
bundles), note the highest specificity (watch for `body.home`-scoped
hides - `html body.home.rtl a.whatsapp-button{display:none}` at 0-3-3
beat an 0-2-3 restore on jus-tice mobile), and counter at the same
specificity LATER in the cascade. Never escalate specificity beyond what
is needed.

## Law 5 - Geometry proof or it didn't happen

After any change, measure with a headless browser at 390x844 and
1440x900:

```js
const r = el.getBoundingClientRect();
({left: r.left, right: r.right, bottom_gap: innerHeight - r.bottom, w: r.width})
```

- Assert NO two floats overlap (compare rects, remember a 9px "kiss"
  at 390px is a real overlap on a real phone).
- Assert thumb-zone targets are >= 44px tall.
- Screenshot both widths and LOOK at them (aesthetic-ownership scan).
- Elements that can't render offline (tawk iframe) are declared
  "CSS-verified only, needs eyes on device" - never claimed as
  rendered-verified.

## Law 6 - Respect the user's message intent

A WhatsApp/contact float must carry context: prefill the message with the
page title + URL so the conversation starts with what the user was
reading. A bare "hello" button wastes the click.
