export const REVIEW_VERSION = '2026-11-09.8';
export const REVIEW_DATE = '09/11/2026';
export const REVIEW_CASES = [
  { id: 'personal', area: 'Modelo', title: 'Pessoa / família completa a qualificação', expected: 'Coleta município, pessoas, idades e plano anterior; não presume plano individual.' },
  { id: 'business', area: 'Modelo', title: 'Empresa completa a qualificação', expected: 'CNPJ válido, município, quantidade e todas as idades chegam ao resumo.' },
  { id: 'invalid', area: 'Modelo', title: 'CNPJ, idades e datas inválidos recebem correção', expected: 'Erro compreensível, sem avançar com informação inválida.' },
  { id: 'topics', area: 'Modelo', title: 'Os sete assuntos aparecem na ordem combinada', expected: 'Cobertura → acomodação → abrangência → rede → carências → vencimentos → início.' },
  { id: 'resume', area: 'Modelo', title: 'Menu, consulta de assunto e correção preservam os dados', expected: 'É possível voltar à jornada e corrigir dados sem recomeçar.' },
  { id: 'commercial', area: 'Conteúdo', title: 'Material recebido e aprovação comercial são distinguidos', expected: 'D1–D7 recebidos em 09/11 identificados por fonte, arquivo e horário; confirmação de Marcos em 09/11 registrada separadamente: Carioca 10, ANS Adesão com terapias 507.538/26-6, boleto no vencimento escolhido e uso de treinamento/aditivo. Validade comercial e exceções não descritas continuam explícitas.' },
  { id: 'quote', area: 'Modelo / integração', title: 'Simulação de Adesão corresponde à tabela recebida', expected: 'As duas opções de Adesão usam os 20 preços D2 e faixas corretas pelo mesmo motor; resultado documental sem periodicidade presumida, desconto automático ou aprovação de elegibilidade.' },
  { id: 'approved_quote', area: 'Preview integrada · cotação', title: 'Cotação usa catálogo aprovado e vigente', expected: 'A cotação identifica produto, modalidade, versão, aprovação e validade do catálogo; faixas e valores conferem com a fonte. Sem fonte aprovada ou com fonte vencida, não informa valor como cotação válida e explica a pendência. A simulação documental não comprova esta etapa.' },
  { id: 'pme_price', area: 'Conteúdo', title: 'PME não recebe preços de Adesão', expected: 'Carioca 10 PME com coparticipação usa D5 e grupo de 2 a 29 vidas. Sem coparticipação permanece sem preço documentado; não copiar valores Adesão. O pedido pode continuar sem exigir vendedor.' },
  { id: 'promotion', area: 'Conteúdo', title: 'Promoção de 50% é explicada sem aplicação automática', expected: 'Primeira mensalidade bancária e janela 20/10–20/11 sem ano informadas; vigência, elegibilidade e base dependem de confirmação.' },
  { id: 'waiting_rules', area: 'Conteúdo', title: 'Carências seguem a matriz recebida sem aplicação automática', expected: 'D6/D7: nove grupos e 36 prazos conferidos. Distinguir contratual/sem plano/6–12/acima de 12 meses; preservar exceção Psicologia, terapias 180d, parto 300d e CPT 24 meses. Produto Carioca 10 e uso do aditivo confirmados; regras não descritas, especialmente menos de seis meses, e validade continuam pendentes.' },
  { id: 'interview', area: 'Formalização', title: 'Entrevista médica obrigatória precede vigência', expected: 'Bot explica entrevista em 100% das vendas e registra próximo passo; pedido no chat não é proposta formal emitida, entrevista agendada, assinatura, pagamento ou ativação.' },
  { id: 'form', area: 'Integração', title: 'Formulário continua no chat sem repetir cadastro', expected: 'Contato consentido e qualificação reaproveitados; campanha preservada.' },
  { id: 'duplicate', area: 'Integração', title: 'Reenvio e recarga não duplicam contato ou oportunidade', expected: 'Retoma a mesma jornada e mantém vínculos no CRM.' },
  { id: 'autonomous', area: 'Integração', title: 'Jornada solicita proposta sem exigir vendedor', expected: 'Após qualificação, explicações e simulação documental identificada, o bot registra a solicitação e continua disponível; reenvio não duplica, fonte ausente não inventa nem transfere automaticamente, pedido não vira contrato ou Ganho.' },
  { id: 'handoff', area: 'Integração', title: 'Quando solicitado, vendedor recebe histórico e resumo e assume atendimento', expected: 'Bot para durante atendimento humano e só retorna após devolução.' },
  { id: 'administrative', area: 'Integração', title: 'Pedido administrativo não vira venda', expected: 'Segunda via de boleto ou carteirinha recebe canal de atendimento; dúvida comercial sobre pagar por boleto mantém a jornada e explica vencimentos.' },
  { id: 'privacy', area: 'Integração', title: 'Histórico de outro contato fica inacessível', expected: 'Troca de identidade exige novo vínculo e não expõe conversa anterior.' },
  { id: 'responsive', area: 'Interface', title: 'Celular, teclado, documentos e rede funcionam', expected: 'Página sem cortes ou rolagem horizontal; tabelas largas rolam dentro de sua região acessível, foco visível e materiais legíveis.' },
  { id: 'whatsapp', area: 'Etapa posterior', title: 'Conectar e validar o WhatsApp posteriormente', expected: 'Fora do aceite de hoje, por decisão do usuário. Quando conectado, comprovar número Amélia, mensagens, documentos, transferência e registro no CRM.' },
  { id: 'ai_question', area: 'Preview integrada · IA', title: 'IA responde dúvida livre com fonte', expected: 'A resposta identifica o material usado, distingue informação recebida de condição aprovada e permite continuar a conversa.' },
  { id: 'ai_missing', area: 'Preview integrada · IA', title: 'IA reconhece informação ausente ou não aprovada', expected: 'Não inventa preço, cobertura ou condição; explica a pendência sem obrigar o cliente a falar com vendedor.' },
  { id: 'ai_failure', area: 'Preview integrada · IA', title: 'Indisponibilidade da IA permite continuar', expected: 'A falha é informada claramente e a conversa oferece um próximo passo, sem resposta falsa ou perda da jornada.' },
  { id: 'integrated_paths', area: 'Preview integrada', title: 'Pessoa e empresa percorrem a jornada no chat integrado', expected: 'Os dois caminhos usam dados fictícios, percorrem os sete assuntos, retomam após correção e recarga e chegam ao resumo correto.' },
  { id: 'commercial_approval', area: 'Validação comercial', title: 'Equipe confirma produtos, condições e fontes', expected: 'Versão, validade e responsável pelos materiais são confirmados; preço, rede, carência, vencimento e vigência não são tratados como aprovados sem confirmação.' },
  { id: 'production', area: 'Liberação', title: 'Aceite e teste controlado de produção', expected: 'Após autorização separada de Marcos, com rollback pronto, equipe e TI executam teste controlado da versão publicada e conferem a jornada. O registro deste passo não publica nem autoriza produção.' },
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
