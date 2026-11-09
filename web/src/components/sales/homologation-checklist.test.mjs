import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_REVIEW, REVIEW_CASES, reviewCounts, reviewExport } from './homologation-checklist.ts';
import { createJourney, journeyView, advanceJourney, TOPICS } from '../../lib/sales-journey/engine.ts';

test('only explicitly deferred WhatsApp starts outside current acceptance; no case is auto-approved', () => {
  assert.deepEqual(reviewCounts(INITIAL_REVIEW), { untested: 14, passed: 0, failed: 0, blocked: 0, deferred: 1 });
  const edited = structuredClone(INITIAL_REVIEW);
  edited.personal = { status: 'passed', evidence: 'Teste pessoa: resumo conferido.' };
  edited.commercial = { status: 'blocked', evidence: 'Tabela comercial pendente.' };
  assert.deepEqual(reviewCounts(edited), { untested: 12, passed: 1, failed: 0, blocked: 1, deferred: 1 });
  assert.equal(INITIAL_REVIEW.personal.status, 'untested');
  assert.equal(INITIAL_REVIEW.whatsapp.status, 'deferred');
  assert.match(INITIAL_REVIEW.whatsapp.evidence, /solicitação do usuário/);
  assert.ok(REVIEW_CASES.filter(item => item.id !== 'whatsapp').every(item => INITIAL_REVIEW[item.id].status === 'untested'));
});

test('export contains all test cases and evidence, including unanswered ones', () => {
  const report = reviewExport({ personal: { status: 'failed', evidence: 'Idade inválida aceita.' } }, ' TI ', ' Corrigir antes do aceite ', '2026-11-09T18:00:00Z');
  assert.equal(report.cases.length, REVIEW_CASES.length);
  assert.equal(report.reviewer, 'TI');
  assert.equal(report.note, 'Corrigir antes do aceite');
  assert.equal(report.cases[0].status, 'failed');
  assert.equal(report.cases.at(-1).status, 'untested');
  assert.equal('messages' in report, false);
  assert.match(report.scope, /WhatsApp é etapa posterior/);
  const whatsapp = report.cases.find(item => item.id === 'whatsapp');
  assert.equal(whatsapp.status, 'deferred');
  assert.equal(whatsapp.required_today, false);
  assert.ok(report.cases.filter(item => item.id !== 'whatsapp').every(item => item.required_today));
  assert.match(report.scope, /não bloqueia o aceite de hoje/);
});

test('simulator uses shared journey options and retains data through direct topic menu', () => {
  let state = createJourney();
  assert.ok(journeyView(state).options.some(option => option.value === 'sales:interest:personal'));
  for (const input of ['sales:interest:personal', 'Niterói', '2', '35, 8', 'sales:previous:no']) {
    state = advanceJourney(state, input).state;
  }
  assert.equal(state.step, 'topics');
  const before = structuredClone(state.qualification);
  state = advanceJourney(state, 'sales:menu').state;
  assert.equal(journeyView(state).options.filter(option => option.value.startsWith('sales:topic:')).length, 7);
  for (const topic of TOPICS) {
    const inspected = advanceJourney(state, `sales:topic:${topic.id}`);
    assert.match(inspected.text, new RegExp(topic.title));
    assert.deepEqual(inspected.state.qualification, before);
  }
  state = advanceJourney(state, 'sales:resume').state;
  assert.equal(state.step, 'topics');
  assert.deepEqual(state.qualification, before);
});
