#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { buildPageControlMap, normalizeUrl } = require('./gsc-justice-deep-analysis.js');

test('fragment rows cannot overwrite the canonical page control row', () => {
  const canonical = {
    page: 'https://jus-tice.co.il/top-global-tax-cpa-firms/',
    clicks: '41',
    impressions: '12663',
  };
  const fragment = {
    page: 'https://jus-tice.co.il/top-global-tax-cpa-firms/#sec-4',
    clicks: '0',
    impressions: '1',
  };

  const controls = buildPageControlMap([canonical, fragment]);

  assert.equal(controls.get(normalizeUrl(canonical.page, true)), canonical);
});

test('fragment preference is deterministic when the fragment row arrives first', () => {
  const fragment = {
    page: 'https://jus-tice.co.il/example/#details',
    clicks: '2',
    impressions: '500',
  };
  const canonical = {
    page: 'https://jus-tice.co.il/example/',
    clicks: '1',
    impressions: '20',
  };

  const controls = buildPageControlMap([fragment, canonical]);

  assert.equal(controls.get(normalizeUrl(canonical.page, true)), canonical);
});

test('duplicate canonical rows keep the strongest page control evidence', () => {
  const weaker = { page: 'https://jus-tice.co.il/example/', clicks: '0', impressions: '8' };
  const stronger = { page: 'https://jus-tice.co.il/example/', clicks: '1', impressions: '12' };

  const controls = buildPageControlMap([weaker, stronger]);

  assert.equal(controls.get(normalizeUrl(stronger.page, true)), stronger);
});
