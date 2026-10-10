import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collectQuoteErrors, createQuoteRequestSession, quoteSource } from './quote-request.mjs';
import { validateAndNormalizeCotacao } from '../lib/cotacao.ts';

const UUID = '550e8400-e29b-41d4-a716-446655440000';
const UUID2 = '550e8400-e29b-41d4-a716-446655440001';
const input = overrides => ({
  contact: { name: 'Pessoa Teste', city: 'Rio de Janeiro', email: '', whatsapp: '(21) 99999-9999', consent: true },
  lives: 2, ages: ['35', '0'], website: '',
  pageUrl: 'https://www.ameliasaude.com.br/landing?utm_source=google&utm_medium=cpc&gclid=mock&email=private@example.com',
  referrer: 'https://www.google.com/?q=personal',
  ...overrides,
});
const response = (status = 202, body = { ok: true }) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
const make = fetchImpl => createQuoteRequestSession({ fetchImpl, createUuid: () => UUID, now: () => '2026-10-09T20:00:00.000Z' });

test('posts an API-valid normalized request to the same origin, including consent, attribution and honeypot', async () => {
  let posted;
  const session = make(async (url, options) => { posted = { url, options, payload: JSON.parse(options.body) }; return response(); });
  assert.deepEqual(await session.submit(input()), { status: 'success' });
  assert.equal(posted.url, '/api/cotacao');
  assert.equal(posted.options.method, 'POST');
  assert.deepEqual(posted.options.headers, { 'Content-Type': 'application/json' });
  assert.equal(posted.payload.requestId, UUID);
  assert.equal(posted.payload.whatsapp, '5521999999999');
  assert.deepEqual(posted.payload.ages, [35, 0]);
  assert.equal(posted.payload.email, '');
  assert.equal(posted.payload.consent, true);
  assert.equal(posted.payload.consentAt, '2026-10-09T20:00:00.000Z');
  assert.equal(posted.payload.source.utmSource, 'google');
  assert.equal(posted.payload.source.gclid, 'mock');
  assert.equal(posted.payload.source.pageUrl.includes('email='), false);
  assert.equal(posted.payload.source.referrer, 'https://www.google.com/');
  assert.equal(posted.payload.website, '');
  assert.equal('brand' in posted.payload, false);
  assert.equal(validateAndNormalizeCotacao(posted.payload).success, true);
});

test('10 ou mais preserves the server contract of ten ages and ten lives', async () => {
  let payload;
  const result = await make(async (_url, options) => { payload = JSON.parse(options.body); return response(); }).submit(input({ lives: 10, ages: Array(10).fill('30'), more: true }));
  assert.equal(result.status, 'success');
  assert.equal(payload.livesCount, 10);
  assert.equal(payload.ages.length, 10);
  assert.equal(validateAndNormalizeCotacao(payload).success, true);
});

test('forwards the honeypot without changing the trusted brand contract', async () => {
  let payload;
  await make(async (_url, options) => { payload = JSON.parse(options.body); return response(); }).submit(input({ website: 'https://spam.invalid' }));
  assert.equal(payload.website, 'https://spam.invalid');
  assert.equal('brand' in payload, false);
});

test('invalid consent, DDD and ages never reach the network', async () => {
  let calls = 0;
  const session = make(async () => { calls += 1; return response(); });
  const consent = await session.submit(input({ contact: { ...input().contact, consent: false } }));
  assert.ok(consent.errors.consent);
  const whatsapp = await session.submit(input({ contact: { ...input().contact, whatsapp: '20999999999' } }));
  assert.ok(whatsapp.errors.whatsapp);
  const ages = await session.submit(input({ ages: [''] }));
  assert.ok(ages.errors.ages);
  assert.equal(calls, 0);
});

test('same failed request keeps its UUID and consent timestamp for retry', async () => {
  const payloads = []; let attempt = 0;
  const session = make(async (_url, options) => { payloads.push(JSON.parse(options.body)); return ++attempt === 1 ? response(503, { ok: false, error: 'unavailable' }) : response(); });
  assert.equal((await session.submit(input())).status, 'error');
  assert.equal((await session.submit(input())).status, 'success');
  assert.equal(payloads[0].requestId, payloads[1].requestId);
  assert.equal(payloads[0].consentAt, payloads[1].consentAt);
});

test('a corrected contact starts a new identity instead of silently reusing a previous payload', async () => {
  const payloads = []; let ids = 0;
  const session = createQuoteRequestSession({ createUuid: () => ++ids === 1 ? UUID : UUID2, fetchImpl: async (_url, options) => { payloads.push(JSON.parse(options.body)); return response(503, { error: 'unavailable' }); } });
  await session.submit(input());
  await session.submit(input({ contact: { ...input().contact, city: 'Niterói' } }));
  assert.notEqual(payloads[0].requestId, payloads[1].requestId);
});

test('parallel submissions make only one POST', async () => {
  let release, calls = 0;
  const session = make(async () => { calls += 1; return await new Promise(resolve => { release = resolve; }); });
  const first = session.submit(input());
  assert.equal(session.pending, true);
  assert.deepEqual(await session.submit(input()), { status: 'busy' });
  assert.equal(calls, 1);
  release(response());
  assert.equal((await first).status, 'success');
  assert.equal(session.pending, false);
});

for (const status of [400, 429, 502, 503]) test(`HTTP ${status} is an error and releases the pending lock`, async () => {
  const session = make(async () => response(status, { ok: false, error: status === 429 ? 'rate_limited' : 'unavailable' }));
  const result = await session.submit(input());
  assert.equal(result.status, 'error');
  assert.equal(session.pending, false);
  if (status === 429) assert.equal(result.code, 'rate_limited');
});

test('network errors allow another attempt and never simulate success', async () => {
  const session = make(async () => { throw new Error('mock network failure'); });
  assert.equal((await session.submit(input())).code, 'network');
  assert.equal(session.pending, false);
});

test('a successful HTML or malformed API response is not a quote success', async () => {
  const session = make(async () => ({ ...response(200), json: async () => { throw new Error('html'); } }));
  assert.equal((await session.submit(input())).status, 'error');
});

test('field validation checks limits and attribution contains only campaign query keys', () => {
  assert.ok(collectQuoteErrors(input({ contact: { ...input().contact, name: 'x'.repeat(121) } })).name);
  const source = quoteSource('https://www.ameliasaude.com.br/cotacao?utm_campaign=test&token=secret&name=private', 'android-app://test');
  assert.equal(source.pageUrl, 'https://www.ameliasaude.com.br/cotacao?utm_campaign=test');
  assert.equal(source.utmCampaign, 'test');
  assert.equal(source.referrer, undefined);
});
