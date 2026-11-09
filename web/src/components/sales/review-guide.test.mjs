import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_REVIEW, REVIEW_CASES, REVIEW_VERSION } from './homologation-checklist.ts';
import { GUIDE_ACTIONS, adjustmentMessage, restoreGuide, whatsappUrl } from './review-guide.ts';

test('every review step has a clear action and destination', () => {
  for (const item of REVIEW_CASES) {
    assert.ok(GUIDE_ACTIONS[item.id]?.text);
    assert.ok(GUIDE_ACTIONS[item.id]?.href);
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


test('integrated approved quote is required for acceptance and distinguishes missing or expired catalogs', async () => {
  const { canAccept } = await import('./review-guide.ts');
  const item = REVIEW_CASES.find(c => c.id === 'approved_quote');
  assert.ok(item);
  assert.match(item.expected, /aprovada|aprovação/);
  assert.match(item.expected, /vencida/);
  assert.match(item.expected, /faixas e valores/);
  assert.match(GUIDE_ACTIONS.approved_quote.text, /ausente e vencido/);
  assert.match(GUIDE_ACTIONS.approved_quote.text, /Não consegui testar/);
  assert.equal(GUIDE_ACTIONS.approved_quote.href, '/landing');
  const entries = structuredClone(INITIAL_REVIEW);
  for (const testCase of REVIEW_CASES) if (testCase.id !== 'whatsapp') entries[testCase.id].status = 'passed';
  entries.approved_quote.status = 'blocked';
  assert.equal(canAccept(entries, 'Equipe'), false);
  entries.approved_quote.status = 'untested';
  assert.equal(canAccept(entries, 'Equipe'), false);
  entries.approved_quote.status = 'passed';
  assert.equal(canAccept(entries, 'Equipe'), true);
});
