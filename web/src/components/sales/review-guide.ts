import { INITIAL_REVIEW, REVIEW_CASES, REVIEW_VERSION, type ReviewEntry, type ReviewStatus } from './homologation-checklist.ts';

type GuideAction = { text: string; href: string; label: string; external?: boolean };
const simulator = (text: string): GuideAction => ({ text, href: '#simulador', label: 'Abrir simulador' });
const materials = (text: string): GuideAction => ({ text, href: '#materiais', label: 'Ver materiais recebidos' });
const landing = (text: string): GuideAction => ({ text, href: '/landing', label: 'Abrir landing e chat', external: true });
const crm = (text: string): GuideAction => ({ text, href: 'https://crm-amelia-chat-preview.vercel.app', label: 'Abrir CRM de teste', external: true });
export const GUIDE_ACTIONS: Record<(typeof REVIEW_CASES)[number]['id'], GuideAction> = {
  personal: simulator('Escolha pessoa ou família e responda às perguntas com dados fictícios até chegar ao resumo.'),
  business: simulator('Reinicie a conversa, escolha empresa e complete os dados com um CNPJ de teste válido.'),
  invalid: simulator('Na conversa de empresa, tente um CNPJ inválido; depois tente idades e datas inválidas e observe as correções.'),
  topics: simulator('Complete a qualificação e avance pelas explicações, conferindo a ordem dos assuntos.'),
  resume: simulator('Abra o menu de assuntos, consulte um tema, volte e use Corrigir dados. Confira o resumo.'),
  commercial: materials('Consulte o pacote de originais previamente recebido pela equipe e compare as informações e confirmações aqui. Confira o que ainda precisa de aprovação.'),
  quote: materials('No cálculo da tabela, escolha Adesão, informe idades fictícias e compare cada opção com o material recebido.'),
  approved_quote: landing('Com TI, use dados fictícios no chat integrado e consulte condições vigentes. Compare faixas, valores, produto e validade com o catálogo aprovado. Em ambiente de teste controlado, repita com catálogo ausente e vencido; se não houver catálogo aprovado e vigente ou não puder testar ambos os casos, marque Não consegui testar.'),
  pme_price: materials('Escolha PME com duas pessoas e teste as opções com e sem coparticipação.'),
  promotion: materials('Confira as peças de campanha e procure se o desconto é aplicado automaticamente na simulação.'),
  waiting_rules: materials('Abra a matriz de carências e compare as colunas com o aditivo recebido.'),
  interview: simulator('Avance até o início do contrato e leia o que é informado sobre a entrevista e a proposta.'),
  form: landing('Abra a landing, preencha o formulário com dados de teste e siga para o chat. Confira se precisa repetir os dados.'),
  duplicate: crm('Com apoio da equipe, recarregue ou reenvie o teste e confira o contato e a oportunidade no CRM.'),
  autonomous: landing('No chat integrado, complete a conversa e solicite proposta sem escolher vendedor. Recarregue e confira o retorno.'),
  handoff: crm('Peça um vendedor no chat de teste. No CRM, confira o histórico, assuma, responda e devolva o atendimento.'),
  administrative: landing('No chat, tente pedir segunda via ou carteirinha; em outra conversa, pergunte como pagar por boleto.'),
  privacy: landing('Com apoio da equipe, tente recuperar uma conversa de teste de outra identidade e confira a proteção.'),
  responsive: simulator('Abra esta página no celular e percorra os controles usando o teclado. Confira a rede e os materiais.'),
  whatsapp: { text: 'Este teste será feito quando o canal for conectado. Não é necessário para esta avaliação.', href: '#resumo-avaliacao', label: 'Ver resumo' },
  ai_question: landing('No chat integrado, faça uma pergunta livre sobre carência ou rede; confira a fonte indicada e retome o roteiro. O simulador não testa a IA.'),
  ai_missing: landing('Pergunte por uma condição que não consta dos materiais aprovados, como validade ou preço de opção sem tabela. Confira a resposta e continue.'),
  ai_failure: landing('Com apoio de TI e somente no ambiente de teste, simule indisponibilidade do serviço de IA; faça uma pergunta e tente continuar.'),
  integrated_paths: landing('No chat integrado, teste separadamente pessoa e empresa com dados fictícios. Confira os sete assuntos, correção, recarga e resumo.'),
  commercial_approval: materials('Com a equipe comercial, compare cada condição e sua fonte; registre se a versão, a validade e o responsável foram confirmados.'),
  production: crm('Somente após autorização de Marcos, com TI e rollback preparado, teste a versão publicada com dados autorizados e confira o resultado. Até lá, marque Não consegui testar.'),
};

export function restoreGuide(raw: string | null): { entries: Record<string, ReviewEntry>; step: number; reviewer: string; acceptedAt: string | null } | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    const statuses: ReviewStatus[] = ['untested', 'passed', 'failed', 'blocked', 'deferred'];
    const entries = structuredClone(INITIAL_REVIEW);
    for (const item of REVIEW_CASES) {
      const saved = value.entries?.[item.id];
      if (saved && statuses.includes(saved.status) && (item.id === 'whatsapp' ? saved.status === 'deferred' : saved.status !== 'deferred') && typeof saved.evidence === 'string') {
        entries[item.id] = { status: saved.status, evidence: saved.evidence.slice(0, 2000) };
      }
    }
    const step = Number.isInteger(value.step) && value.step >= 0 && value.step < REVIEW_CASES.length ? value.step : 0;
    const reviewer = typeof value.reviewer === 'string' ? value.reviewer.slice(0, 120) : '';
    const acceptedAt = canAccept(entries, reviewer) && typeof value.acceptedAt === 'string' && !Number.isNaN(Date.parse(value.acceptedAt)) ? value.acceptedAt : null;
    return { entries, step, reviewer, acceptedAt };
  } catch { return null; }
}

const statusText: Record<ReviewStatus, string> = { untested: 'Ainda não testei', passed: 'Aprovado', failed: 'Precisa de ajuste', blocked: 'Não consegui testar', deferred: 'Etapa posterior' };
export function adjustmentMessage(entries: Record<string, ReviewEntry>, itemId?: string, reviewer = ''): string {
  const selected = REVIEW_CASES.filter(item => itemId ? item.id === itemId : entries[item.id].status === 'failed' || entries[item.id].status === 'blocked' || !!entries[item.id].evidence.trim());
  const lines = selected.map(item => `• ${item.title} — ${statusText[entries[item.id].status]}${entries[item.id].evidence.trim() ? `\n  Retorno: ${entries[item.id].evidence.trim()}` : ''}`);
  return [`Olá! Segue o retorno sobre a avaliação Amélia (${REVIEW_VERSION}).`, ...(reviewer.trim() ? [`Responsável pelo teste: ${reviewer.trim()}`] : []), ...(lines.length ? lines : ['Ainda não registrei ajustes.']), 'Podemos conferir esses pontos?'].join('\n\n');
}
export function whatsappUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function canAccept(entries: Record<string, ReviewEntry>, reviewer: string): boolean {
  return !!reviewer.trim() && REVIEW_CASES.every(item => item.id === 'whatsapp' || entries[item.id]?.status === 'passed');
}

export function acceptanceMessage(reviewer: string, acceptedAt: string): string {
  return `Olá! Registro o aceite da avaliação Amélia ${REVIEW_VERSION}.\nResponsável: ${reviewer.trim()}\nData: ${acceptedAt}\nOs itens obrigatórios foram marcados como aprovados no roteiro. A liberação de produção depende de autorização própria.`;
}
