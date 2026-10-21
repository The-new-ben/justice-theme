import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../assets/js/article-anchor-clearance.js', import.meta.url), 'utf8');
function fixture(options = {}) {
  const events = {};
  const root = {};
  const header = { height: 144.5, top: '32px', position: 'sticky', display: 'block', getBoundingClientRect() { return { height: this.height }; } };
  const heading = { tagName: 'H2', style: {}, top: 32, scrolls: [], getBoundingClientRect() { return { top: this.top }; }, scrollIntoView(opts) { this.scrolls.push(opts); } };
  const form = { tagName: 'FORM', style: {} };
  const ids = { 'מהו-הסדר': heading, form };
  const links = ['#מהו-הסדר', '#%D7%9E%D7%94%D7%95-%D7%94%D7%A1%D7%93%D7%A8', '#missing', '#%E0', '#form'].map(href => ({
    getAttribute() { return href; }, addEventListener(name, fn) { this[name] = fn; }
  }));
  const window = { location: { hash: options.hash || '' }, addEventListener(name, fn) { (events[name] ||= []).push(fn); } };
  const document = { documentElement: root, readyState: options.complete ? 'complete' : 'loading',
    querySelector() { return options.noHeader ? null : header; }, querySelectorAll() { return options.noLinks ? [] : links; }, getElementById(id) { return ids[id] || null; } };
  let resize;
  vm.runInNewContext(source, { document, window, getComputedStyle(el) {
    if (el === header) return header;
    if (el === root) return { scrollPaddingTop: options.padding ?? '32px' };
    return { scrollMarginTop: options.original || '0px' };
  }, ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} } });
  return { heading, form, header, links, resize, events, emit: name => (events[name] || []).forEach(fn => fn()) };
}

let f = fixture();
assert.equal(f.heading.style.scrollMarginTop, '157px', 'logged-in desktop subtracts existing admin scroll-padding');
assert.deepEqual(f.form.style, {}, 'form target untouched');
assert.equal(f.heading.scrolls.length, 0, 'normal entry does not jump');
f.header.height = 120;
f.header.top = '0px';
f.resize();
assert.equal(f.heading.style.scrollMarginTop, '100px', 'header resize recomputes rather than accumulating margin');
f.header.height = 144.5;
f.header.top = '32px';
f.links[0].click();
assert.equal(f.heading.style.scrollMarginTop, '157px', 'click refresh preserves native navigation');
f.header.position = 'static';
f.emit('resize');
assert.equal(f.heading.style.scrollMarginTop, '0px', 'nonsticky header does not reserve blank space');
f = fixture({ padding: '0px' });
f.header.top = '0px'; f.emit('resize');
assert.equal(f.heading.style.scrollMarginTop, '157px', 'anonymous desktop uses actual header height');
f.header.height = 110; f.emit('resize');
assert.equal(f.heading.style.scrollMarginTop, '122px', 'mobile actual height is respected');
f = fixture({ original: '240px' });
assert.equal(f.heading.style.scrollMarginTop, '240px', 'larger existing clearance is retained');
f = fixture({ hash: '#מהו-הסדר' });
f.emit('load');
assert.equal(f.heading.scrolls.length, 1, 'initial deep link obscured by header is corrected');
assert.equal(f.heading.scrolls[0].behavior, 'instant', 'initial correction does not animate or override reduced-motion preference');
for (const event of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
  f = fixture({ hash: '#מהו-הסדר' }); f.emit(event); f.emit('load');
  assert.equal(f.heading.scrolls.length, 0, `${event} prevents a late jump`);
}
f = fixture({ hash: '#מהו-הסדר' }); f.heading.top = -900; f.emit('load');
assert.equal(f.heading.scrolls.length, 0, 'restored reading position is retained');
f = fixture({ hash: '#מהו-הסדר' }); f.heading.top = 300; f.emit('load');
assert.equal(f.heading.scrolls.length, 0, 'already clear heading is not moved');
for (const hash of ['#%E0', '#form', '#missing']) {
  f = fixture({ hash }); f.emit('load'); assert.equal(f.heading.scrolls.length, 0);
}
assert.deepEqual(fixture({ noHeader: true }).heading.style, {});
assert.deepEqual(fixture({ noLinks: true }).heading.style, {});
assert.equal(fixture({ complete: true, hash: '#מהו-הסדר' }).heading.scrolls.length, 1);
assert.ok(!/preventDefault|pushState|replaceState|\.focus\(/.test(source), 'native history and focus remain browser-owned');
const enqueue = readFileSync(new URL('../../inc/enqueue.php', import.meta.url), 'utf8');
assert.ok(enqueue.includes("'justice-article-anchor-clearance'"));
console.log('PASS article anchor clearance: geometry, admin padding, mobile, preserved offsets, native links, initial hashes, interaction and no-TOC guards');
