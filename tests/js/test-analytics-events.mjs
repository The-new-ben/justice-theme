import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code = readFileSync(new URL('../../assets/js/analytics-events.js', import.meta.url), 'utf8');
const page = 'https://jus-tice.co.il/criminal-defense-attorney/';
let checks = 0;
function check(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
  checks++;
  console.log(`PASS ${label}`);
}
function browser({ url = page, href, wrapper = false, testField = false, gtag = true } = {}) {
  const events = [];
  const handlers = new Map();
  const document = {
    title: 'Public article',
    querySelector: selector => testField && selector === 'input[name="justice_intake_test"]' ? { value: '1' } : null,
    querySelectorAll: () => [],
    addEventListener: (name, handler) => handlers.set(name, handler)
  };
  const window = {
    location: new URL(url),
    dataLayer: [],
    ...(gtag ? { gtag: (type, name, params) => events.push({ name, params }) } : {})
  };
  vm.runInNewContext(code, { window, document, URL, URLSearchParams, WeakSet }, { timeout: 1000 });
  handlers.get('DOMContentLoaded')();
  if (href !== undefined) {
    const link = {
      textContent: 'Consult a lawyer', dataset: {},
      getAttribute: name => name === 'href' ? href : null,
      closest: selector => wrapper && selector === '.justice-content-lawyer-cta' ? {} : null
    };
    handlers.get('click')({ target: { closest: () => link }, preventDefault() {} });
  }
  return { events, dataLayer: window.dataLayer };
}
const count = (result, name) => result.events.filter(event => event.name === name).length;
for (const hash of ['#practice-lead-form', '#lead-form', '#lawyer-inquiry', '#ask-lawyer']) {
  check(count(browser({ href: hash }), 'article_cta_click'), 1, `anchor CTA ${hash}`);
  check(count(browser({ href: page + hash }), 'article_cta_click'), 1, `absolute CTA ${hash}`);
}
check(count(browser({ href: '/criminal-defense-attorney/#practice-lead-form', url: 'https://jus-tice.co.il/arrest-detention-lawyer-israel/' }), 'article_cta_click'), 1, 'cross-page relative consultation CTA');
check(count(browser({ href: 'https://example.com/#practice-lead-form' }), 'article_cta_click'), 0, 'external lookalike is not a site enquiry CTA');
check(count(browser({ href: 'https://jus-tice.co.il.example.com/#practice-lead-form' }), 'article_cta_click'), 0, 'deceptive hostname excluded');
check(count(browser({ href: '/article/#other-section' }), 'article_cta_click'), 0, 'ordinary section link unchanged');
check(count(browser({ href: '/contact/', wrapper: true }), 'article_cta_click'), 1, 'existing contextual CTA wrapper retained');
check(browser({ href: 'javascript:alert("SYNTHETIC_ONLY")', wrapper: true }).events[0].params.link_url, undefined, 'non-navigation payload not copied into analytics');
check(browser({ href: 'https://[', wrapper: true }).events[0].params.link_url, undefined, 'malformed URL omitted rather than echoed');
const contact = browser({ href: page + '?case=SYNTHETIC_ONLY#practice-lead-form', url: page + '?message=SYNTHETIC_ONLY#private-fragment' });
check(contact.events[0].params.page_location, page, 'event page location contains no query or fragment');
check(contact.events[0].params.link_url, page + '#practice-lead-form', 'destination retains approved anchor but no query');
check(browser({ href: 'https://synthetic:synthetic@jus-tice.co.il/contact/', wrapper: true }).events[0].params.link_url, 'https://jus-tice.co.il/contact/', 'URL credentials never copied to analytics');
const whatsapp = browser({ href: 'https://wa.me/0000000000?text=SYNTHETIC_ONLY&token=SYNTHETIC_ONLY#private' });
check(count(whatsapp, 'whatsapp_click'), 1, 'WhatsApp event retained');
check(whatsapp.events[0].params.link_url, 'https://wa.me/0000000000', 'WhatsApp destination contains no query or fragment');
check(count(browser({ href: 'tel:0000000000' }), 'phone_click'), 1, 'phone event retained');
check(browser({ url: page + '?lead_test=1&lead=success', href: '#practice-lead-form' }).events.length, 0, 'explicit synthetic query excluded including success event');
check(browser({ testField: true, href: '#practice-lead-form' }).events.length, 0, 'synthetic form marker excluded');
check(count(browser({ url: page + '?lead_test=0', href: '#practice-lead-form' }), 'article_cta_click'), 1, 'ordinary event not suppressed by false flag');
const fallback = browser({ href: '#practice-lead-form', gtag: false });
check(fallback.dataLayer.length, 1, 'dataLayer fallback receives one CTA event');
check(fallback.dataLayer[0].event, 'article_cta_click', 'dataLayer event name preserved');
check(browser({ href: '#practice-lead-form' }).dataLayer.length, 0, 'gtag path does not duplicate dataLayer events');
// Explicitly preserve and expose the remaining limitation, not a success claim.
check(count(browser({ url: page + '?lead=success' }), 'generate_lead'), 1, 'legacy URL success event retained pending verified-receipt contract');
console.log(`${checks} assertions passed. Isolated synthetic contexts; no network or live events. Legacy generate_lead still is not server-confirmed.`);
