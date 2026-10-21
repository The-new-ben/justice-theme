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
function browser({ url = page, href, wrapper = false, testField = false, gtag = true, receipt, networkError = false, httpOk = true, endpoint = 'https://jus-tice.co.il/wp-admin/admin-ajax.php' } = {}) {
  const events = [];
  const requests = [];
  const notice = { textContent: 'אפשר לברר את מצב הפנייה דרך פרטי הקשר באתר.' };
  const handlers = new Map();
  const document = {
    title: 'Public article',
    querySelector: selector => testField && selector === 'input[name="justice_intake_test"]' ? { value: '1' } : null,
    querySelectorAll: selector => selector === '[data-intake-receipt-notice]' ? [notice] : [],
    addEventListener: (name, handler) => handlers.set(name, handler)
  };
  const window = {
    location: new URL(url),
    dataLayer: [],
    justiceIntakeReceipt: { endpoint },
    ...(receipt !== undefined || networkError ? { fetch: (url, options) => {
      requests.push({ url, options });
      return networkError ? Promise.reject(new Error('fixture only')) : Promise.resolve({ ok: httpOk, json: () => Promise.resolve(receipt) });
    } } : {}),
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
  return { events, dataLayer: window.dataLayer, requests, notice };
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
check(count(browser({ url: page + '?lead=success' }), 'generate_lead'), 0, 'success URL alone never proves a stored enquiry');
async function confirmed(options) {
  const result = browser({ url: page + '?lead=success', ...options });
  await new Promise(resolve => setImmediate(resolve));
  return result;
}
const fresh = await confirmed({ receipt: { stored: true, fresh: true, version: 1 } });
check(count(fresh, 'generate_lead'), 1, 'fresh server receipt emits one lead event');
check(fresh.notice.textContent, 'הפנייה נשמרה במערכת.', 'storage notice appears only after verification');
check(fresh.events[0].params.form_type, 'server_confirmed_intake', 'new measurement semantics are explicit');
check(fresh.events[0].params.measurement_version, 2, 'measurement version distinguishes prior legacy events');
check(fresh.requests[0].options.credentials, 'same-origin', 'receipt uses first-party credentials only');
check(fresh.requests[0].options.cache, 'no-store', 'receipt response is not reused by browser cache');
check(fresh.requests[0].options.referrerPolicy, 'origin', 'request does not disclose query or fragment in referrer');
check(fresh.requests[0].options.headers['X-Justice-Receipt'], '1', 'non-simple header accompanies confirmation');
const duplicate = await confirmed({ receipt: { stored: true, fresh: false, version: 1 } });
check(count(duplicate, 'generate_lead'), 0, 'server-marked duplicate is not counted');
check(duplicate.notice.textContent, 'הפנייה נשמרה במערכת.', 'refresh retains verified customer confirmation');
for (const receipt of [null, {}, { stored: false, fresh: true, version: 1 }, { stored: 'true', fresh: true, version: 1 }, { stored: true, fresh: true, version: 2 }]) {
  const result = await confirmed({ receipt });
  check(count(result, 'generate_lead'), 0, 'invalid/unverified receipt is not counted');
  check(result.notice.textContent.includes('נשמרה'), false, 'invalid receipt makes no storage claim');
}
check(count(await confirmed({ receipt: { stored:true, fresh:'true', version:1 } }), 'generate_lead'),0,'string freshness is not a confirmed first claim');
check(count(await confirmed({ receipt: { stored:true,fresh:true,version:1 }, httpOk:false }), 'generate_lead'),0,'HTTP failure cannot confirm storage');
check(count(await confirmed({ networkError:true }), 'generate_lead'),0,'network failure cannot confirm storage');
check((await confirmed({ receipt:{stored:true,fresh:true,version:1},url:page+'?lead=success&lead_test=1' })).requests.length,0,'explicit test never claims a receipt');
check((await confirmed({ receipt:{stored:true,fresh:true,version:1},testField:true })).requests.length,0,'test form never claims a receipt');
check((await confirmed({ receipt:{stored:true,fresh:true,version:1},endpoint:'https://example.com/receipt' })).requests.length,0,'cross-origin endpoint rejected');
check((await confirmed({ receipt:{stored:true,fresh:true,version:1},endpoint:'https://u:p@jus-tice.co.il/wp-admin/admin-ajax.php' })).requests.length,0,'endpoint credentials rejected');
check((await confirmed({ receipt:{stored:true,fresh:true,version:1},url:page })).requests.length,0,'ordinary page makes no receipt request');
const clean = await confirmed({ url:page+'?lead=success&case=SYNTHETIC_ONLY#private',receipt:{stored:true,fresh:true,version:1,lead_id:12345,token:'DO_NOT_COPY',phone:'DO_NOT_COPY'} });
check(clean.requests[0].options.body,'action=justice_intake_receipt&return_path=%2Fcriminal-defense-attorney%2F','only the public path is posted, no URL parameters or form values');
check(/SYNTHETIC_ONLY|DO_NOT_COPY|12345/.test(JSON.stringify(clean.events)),false,'extra response fields and private URL fields never copied to event');
check((await confirmed({receipt:{stored:true,fresh:true,version:1},gtag:false})).dataLayer[0].event,'generate_lead','verified receipt supports existing dataLayer fallback');
console.log(`${checks} assertions passed. Isolated synthetic contexts; no network or live events.`);
