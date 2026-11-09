export const REVIEW_VERSION = '2026-11-09.2';
export const REVIEW_DATE = '09/11/2026';
export const REVIEW_CASES = [
  { id: 'personal', area: 'Modelo', title: 'Pessoa / família completa a qualificação', expected: 'Coleta município, pessoas, idades e plano anterior; não presume plano individual.' },
  { id: 'business', area: 'Modelo', title: 'Empresa completa a qualificação', expected: 'CNPJ válido, município, quantidade e todas as idades chegam ao resumo.' },
  { id: 'invalid', area: 'Modelo', title: 'CNPJ, idades e datas inválidos recebem correção', expected: 'Erro compreensível, sem avançar com informação inválida.' },
  { id: 'topics', area: 'Modelo', title: 'Os sete assuntos aparecem na ordem combinada', expected: 'Cobertura → acomodação → abrangência → rede → carências → vencimentos → início.' },
  { id: 'resume', area: 'Modelo', title: 'Menu, consulta de assunto e correção preservam os dados', expected: 'É possível voltar à jornada e corrigir dados sem recomeçar.' },
  { id: 'commercial', area: 'Conteúdo', title: 'Condições e documentos têm aprovação vigente', expected: 'Preço, cobertura, carência, rede, vencimento e vigência conferidos com responsável Amélia.' },
  { id: 'quote', area: 'Integração', title: 'Cotação corresponde à tabela oficial', expected: 'Faixas e produto corretos; fonte ausente ou vencida impede preço inventado.' },
  { id: 'form', area: 'Integração', title: 'Formulário continua no chat sem repetir cadastro', expected: 'Contato consentido e qualificação reaproveitados; campanha preservada.' },
  { id: 'duplicate', area: 'Integração', title: 'Reenvio e recarga não duplicam contato ou oportunidade', expected: 'Retoma a mesma jornada e mantém vínculos no CRM.' },
  { id: 'handoff', area: 'Integração', title: 'Vendedor recebe histórico e resumo e assume atendimento', expected: 'Bot para durante atendimento humano e só retorna após devolução.' },
  { id: 'administrative', area: 'Integração', title: 'Pedido administrativo não vira venda', expected: 'Solicitação de boleto ou carteirinha recebe canal de atendimento adequado.' },
  { id: 'privacy', area: 'Integração', title: 'Histórico de outro contato fica inacessível', expected: 'Troca de identidade exige novo vínculo e não expõe conversa anterior.' },
  { id: 'responsive', area: 'Interface', title: 'Celular, teclado, documentos e rede funcionam', expected: 'Sem cortes ou rolagem horizontal; foco visível e documentos legíveis.' },
  { id: 'whatsapp', area: 'Etapa posterior', title: 'Conectar e validar o WhatsApp posteriormente', expected: 'Fora do aceite de hoje, por decisão do usuário. Quando conectado, comprovar número Amélia, mensagens, documentos, transferência e registro no CRM.' },
  { id: 'production', area: 'Liberação', title: 'Aceite e teste controlado de produção', expected: 'Marcelo/TI validam versão, Marcos autoriza publicação, rollback pronto e jornada completa comprovada.' },
] as const;
export type ReviewStatus = 'untested' | 'passed' | 'failed' | 'blocked' | 'deferred';
export type ReviewEntry = { status: ReviewStatus; evidence: string };
export const INITIAL_REVIEW: Record<string, ReviewEntry> = Object.fromEntries(REVIEW_CASES.map(item => [item.id, item.id === 'whatsapp'
  ? { status: 'deferred', evidence: 'Conexão adiada por solicitação do usuário em 09/11/2026; fora do aceite de hoje.' }
  : { status: 'untested', evidence: '' }]));
export function reviewCounts(entries: Record<string, ReviewEntry>) {
  return REVIEW_CASES.reduce((counts, item) => { counts[entries[item.id]?.status ?? INITIAL_REVIEW[item.id].status]++; return counts; }, { untested: 0, passed: 0, failed: 0, blocked: 0, deferred: 0 });
}
export function reviewExport(entries: Record<string, ReviewEntry>, reviewer: string, note: string, timestamp: string) {
  return { version: REVIEW_VERSION, exportedAt: timestamp, reviewer: reviewer.trim(), note: note.trim(), scope: 'Aceite de hoje: landing, webchat e CRM. WhatsApp é etapa posterior por decisão do usuário; não bloqueia o aceite de hoje. Avaliação manual: o simulador não comprova integrações ou produção.', cases: REVIEW_CASES.map(item => ({ ...item, required_today: item.id !== 'whatsapp', ...(entries[item.id] ?? INITIAL_REVIEW[item.id]) })) };
}
