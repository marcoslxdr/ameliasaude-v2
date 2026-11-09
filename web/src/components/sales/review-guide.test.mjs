import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_REVIEW, REVIEW_CASES, REVIEW_VERSION } from './homologation-checklist.ts';
import { GUIDE_ACTIONS, adjustmentMessage, restoreGuide, whatsappUrl } from './review-guide.ts';

test('every review step has a clear action and destination', () => {
  for (const item of REVIEW_CASES) {
    assert.ok(GUIDE_ACTIONS[item.id]?.text);
    if (item.id === 'production') assert.equal(GUIDE_ACTIONS[item.id]?.href, undefined);
    else assert.ok(GUIDE_ACTIONS[item.id]?.href);
  }
});

test('restores version-scoped progress safely and preserves deferred WhatsApp', () => {
  const entries = structuredClone(INITIAL_REVIEW);
  entries.personal = { status: 'failed', evidence: 'Botão não abriu.' };
  const restored = restoreGuide(JSON.stringify({ entries, step: 2, reviewer: 'Equipe comercial' }));
  assert.deepEqual(restored.entries.personal, entries.personal);
  assert.equal(restored.step, 2);
  assert.equal(restored.reviewer, 'Equipe comercial');
  assert.equal(restored.entries.whatsapp.status, 'deferred');
  assert.equal(restoreGuide('{invalid'), null);
  assert.equal(restoreGuide(JSON.stringify({ entries: { personal: {status: 'unknown', evidence: 'x'} }, step: 999 })).step, 0);
});

test('WhatsApp message carries version, step, status and feedback encoded without a recipient', () => {
  const entries = structuredClone(INITIAL_REVIEW);
  entries.personal = { status: 'failed', evidence: 'Preço & botão: não abriu?' };
  const message = adjustmentMessage(entries, 'personal', 'Equipe comercial');
  assert.match(message, new RegExp(REVIEW_VERSION.replaceAll('.', '\\.')));
  assert.match(message, /Responsável pelo teste: Equipe comercial/);
  assert.match(message, /Pessoa \/ família/);
  assert.match(message, /Precisa de ajuste/);
  assert.match(message, /Preço & botão: não abriu\?/);
  const url = new URL(whatsappUrl(message));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/');
  assert.equal(url.searchParams.get('text'), message);
  assert.match(adjustmentMessage(entries), /Preço & botão/);
  assert.doesNotMatch(adjustmentMessage(entries), /Responsável pelo teste/);
});

test('final acceptance requires identification and all required steps passed, and survives only valid saved state', async () => {
  const { canAccept, acceptanceMessage } = await import('./review-guide.ts');
  const entries = structuredClone(INITIAL_REVIEW);
  assert.equal(canAccept(entries, 'Equipe'), false);
  for (const item of REVIEW_CASES) if (item.id !== 'whatsapp') entries[item.id].status = 'passed';
  assert.equal(canAccept(entries, ''), false);
  assert.equal(canAccept(entries, 'Equipe'), true);
  const acceptedAt = '2026-11-09T15:00:00.000Z';
  assert.equal(restoreGuide(JSON.stringify({ entries, reviewer: 'Equipe', acceptedAt })).acceptedAt, acceptedAt);
  entries.ai_missing.status = 'blocked';
  assert.equal(canAccept(entries, 'Equipe'), false);
  assert.equal(restoreGuide(JSON.stringify({ entries, reviewer: 'Equipe', acceptedAt })).acceptedAt, null);
  assert.match(acceptanceMessage('Equipe', acceptedAt), /Equipe/);
  assert.match(acceptanceMessage('Equipe', acceptedAt), /autorização própria/);
});


test('all three integrated quote cases are required and direct to the preview', async () => {
  const { canAccept } = await import('./review-guide.ts');
  const entries = structuredClone(INITIAL_REVIEW);
  for (const item of REVIEW_CASES) if (item.id !== 'whatsapp') entries[item.id].status = 'passed';
  for (const id of ['approved_quote', 'quote_missing', 'quote_expired']) {
    assert.equal(GUIDE_ACTIONS[id].href, 'https://ameliasaude-chat-preview.vercel.app/landing');
    entries[id].status = 'blocked';
    assert.equal(canAccept(entries, 'Equipe'), false);
    entries[id].status = 'passed';
  }
  assert.match(GUIDE_ACTIONS.quote_missing.text, /ambiente controlado/);
  assert.match(GUIDE_ACTIONS.quote_expired.text, /Não consegui testar/);
  assert.match(GUIDE_ACTIONS.production.text, /URLs reais autorizadas/);
  assert.equal(canAccept(entries, 'Equipe'), true);
});
