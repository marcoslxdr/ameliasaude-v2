'use client';

import { useEffect, useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { INITIAL_REVIEW, REVIEW_CASES, REVIEW_VERSION, reviewCounts, reviewExport, type ReviewEntry, type ReviewStatus } from './homologation-checklist';
import { GUIDE_ACTIONS, acceptanceMessage, adjustmentMessage, canAccept, restoreGuide, whatsappUrl } from './review-guide';

const STORAGE_KEY = `amelia-avaliacao-${REVIEW_VERSION}`;
const labels: Record<ReviewStatus, string> = { untested: 'Ainda não testei', passed: 'Aprovado', failed: 'Precisa de ajuste', blocked: 'Não consegui testar', deferred: 'Etapa posterior' };

export function ReviewGuide() {
  const [entries, setEntries] = useState<Record<string, ReviewEntry>>(() => structuredClone(INITIAL_REVIEW));
  const [step, setStep] = useState(0);
  const [reviewer, setReviewer] = useState('');
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    try {
      const saved = restoreGuide(localStorage.getItem(STORAGE_KEY));
      // Restore browser-only data after hydration; the server cannot read localStorage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) { setEntries(saved.entries); setStep(saved.step); setReviewer(saved.reviewer); setAcceptedAt(saved.acceptedAt); }
    } catch { setStorageAvailable(false); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries, step, reviewer, acceptedAt })); }
    // Report storage failures so the user can export before leaving.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    catch { setStorageAvailable(false); }
  }, [entries, step, reviewer, acceptedAt, ready]);
  const item = REVIEW_CASES[step];
  const action = GUIDE_ACTIONS[item.id];
  const entry = entries[item.id];
  const counts = reviewCounts(entries);
  const completed = counts.passed + counts.failed + counts.blocked;
  const required = REVIEW_CASES.length - 1;
  function update(values: Partial<ReviewEntry>) {
    setAcceptedAt(null);
    setEntries(previous => ({ ...previous, [item.id]: { ...previous[item.id], ...values } }));
  }
  async function copyMessage(itemId?: string) {
    try { await navigator.clipboard.writeText(adjustmentMessage(entries, itemId, reviewer)); setAnnouncement('Texto copiado. Escolha onde compartilhar; ainda não foi enviado.'); }
    catch { setAnnouncement('Não foi possível copiar. Use o botão do WhatsApp ou baixe a avaliação.'); }
  }
  function download() {
    const blob = new Blob([JSON.stringify({ ...reviewExport(entries, reviewer, '', new Date().toISOString()), acceptance: acceptedAt && canAccept(entries, reviewer) ? { reviewer: reviewer.trim(), version: REVIEW_VERSION, acceptedAt } : null }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `amelia-avaliacao-${REVIEW_VERSION}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement('Arquivo baixado. Você pode compartilhá-lo com a equipe quando quiser.');
  }
  return <section id="avaliacao" className="hm-shell hm-section hm-guide" aria-labelledby="guide-title">
    <div className="hm-section-top"><div><span className="hm-eyebrow">Seu roteiro de avaliação</span><h2 id="guide-title">Vamos testar juntos, passo a passo.</h2></div><p>Qualquer pessoa da equipe pode fazer um teste por vez e contar o que encontrou. Você pode parar e voltar depois neste mesmo navegador. Use apenas exemplos fictícios e não inclua dados de clientes no retorno. Nada é enviado automaticamente.</p></div>
    <label className="hm-guide-reviewer" htmlFor="guide-reviewer">Quem está testando? <span>Opcional. Seu nome ou equipe será incluído no retorno e salvo neste navegador.</span><input id="guide-reviewer" value={reviewer} onChange={event => { setAcceptedAt(null); setReviewer(event.target.value); }} maxLength={120} placeholder="Nome ou equipe (opcional)" /></label><div className="hm-guide-progress"><div><strong>{completed} de {required} testes registrados</strong><span>WhatsApp fica para outra etapa.</span></div><progress max={required} value={completed} aria-label="Testes registrados" /></div>
    {!storageAvailable && <p className="hm-guide-warning" role="alert">Não foi possível salvar neste navegador. Baixe sua avaliação antes de sair para não perder o retorno.</p>}
    <p className="hm-guide-scope"><strong>Onde testar:</strong> o simulador nesta página demonstra o roteiro, mas não testa a IA nem grava no CRM. A preview integrada testa chat e CRM em ambiente de teste. A operação real só deve ser testada após autorização separada, com acompanhamento de TI.</p>
    <div className="hm-guide-card">
      <div className="hm-guide-step" aria-live="polite"><span className="hm-small-label">Passo {step + 1} de {REVIEW_CASES.length} · {item.area}</span><h3>{item.title}</h3></div>
      <div className="hm-guide-instructions"><div><span className="hm-small-label">O que fazer</span><p>{action.text}</p><a className="hm-link" href={action.href} {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{action.label} {action.external && <ExternalLink size={15} />}</a></div><div><span className="hm-small-label">O que deve acontecer</span><p>{item.expected}</p></div></div>
      {item.id === 'whatsapp' ? <p className="hm-pending">Este teste foi combinado para depois e não conta no progresso de hoje.</p> : <fieldset className="hm-guide-options"><legend>Como foi este teste?</legend>{(['untested', 'passed', 'failed', 'blocked'] as const).map(status => <label key={status}><input type="radio" name={`review-${item.id}`} value={status} checked={entry.status === status} onChange={() => update({ status })} /> <span>{labels[status]}</span></label>)}</fieldset>}
      <label className="hm-guide-feedback" htmlFor="guide-feedback">Seu retorno sobre este passo <span>Opcional. Descreva o ajuste ou o que impediu o teste, sem dados pessoais.</span><textarea id="guide-feedback" value={entry.evidence} onChange={event => update({ evidence: event.target.value })} rows={3} maxLength={2000} placeholder="Ex.: O botão não abriu a próxima etapa." /></label>
      <div className="hm-guide-share"><a className="hm-button hm-button-outline" href={whatsappUrl(adjustmentMessage(entries, item.id, reviewer))} target="_blank" rel="noopener noreferrer">Pedir ajuste no WhatsApp <ExternalLink size={15} /></a><button type="button" className="hm-link" onClick={() => copyMessage(item.id)}>Copiar retorno deste passo</button><p>Revise o texto, escolha o grupo ou contato e envie no WhatsApp. Abrir ou copiar não envia a mensagem.</p><p role="status">{announcement}</p></div>
      <div className="hm-guide-navigation"><button className="hm-button hm-button-outline" type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>Anterior</button><span>Passo {step + 1} de {REVIEW_CASES.length}</span>{step < REVIEW_CASES.length - 1 ? <button className="hm-button" type="button" onClick={() => setStep(step + 1)}>Próximo</button> : <a className="hm-button" href="#resumo-avaliacao">Ver resumo</a>}</div>
    </div>
    <div id="resumo-avaliacao" className="hm-guide-summary"><div><span className="hm-eyebrow">Seu retorno</span><h3>Confira o que já foi testado.</h3><p>Selecione qualquer item para voltar a ele. Baixe o arquivo e compartilhe quando desejar.</p></div><div className="hm-review-summary" aria-live="polite">{(Object.keys(labels) as ReviewStatus[]).map(status => <span key={status} className={`hm-count hm-${status}`}><b>{counts[status]}</b>{labels[status]}</span>)}</div><ol className="hm-guide-list">{REVIEW_CASES.map((testCase, index) => <li key={testCase.id}><button type="button" onClick={() => { setStep(index); document.getElementById('avaliacao')?.scrollIntoView({ block: 'start' }); }}><span>{index + 1}. {testCase.title}</span><strong>{labels[entries[testCase.id].status]}</strong></button>{entries[testCase.id].evidence && <p>{entries[testCase.id].evidence}</p>}</li>)}</ol><div className="hm-guide-acceptance"><h3>Aceite final</h3><p>Para registrar o aceite, informe seu nome ou equipe e aprove todos os itens obrigatórios, inclusive o teste controlado. O WhatsApp do bot fica para depois. Registrar o aceite não publica nem autoriza produção.</p><button type="button" className="hm-button" disabled={!canAccept(entries, reviewer) || !!acceptedAt} onClick={() => setAcceptedAt(new Date().toISOString())}>Registrar meu aceite</button>{acceptedAt && canAccept(entries, reviewer) ? <div><p role="status">Aceite registrado por {reviewer.trim()} em {new Date(acceptedAt).toLocaleString('pt-BR')} · versão {REVIEW_VERSION}.</p><a className="hm-link" target="_blank" rel="noopener noreferrer" href={whatsappUrl(acceptanceMessage(reviewer, acceptedAt))}>Compartilhar aceite no WhatsApp <ExternalLink size={15} /></a><p>Escolha o destinatário e envie. Abrir o WhatsApp não comprova entrega.</p></div> : <p>O aceite fica disponível quando todos os testes obrigatórios estiverem aprovados e o responsável estiver identificado.</p>}</div><div className="hm-guide-share"><a className="hm-button" href={whatsappUrl(adjustmentMessage(entries, undefined, reviewer))} target="_blank" rel="noopener noreferrer">Pedir ajuste no WhatsApp <ExternalLink size={15} /></a><button type="button" className="hm-link" onClick={() => copyMessage()}>Copiar retorno</button><p>Revise o texto, escolha o grupo ou contato e envie. Nada é enviado automaticamente.</p></div><button type="button" className="hm-button hm-button-outline" onClick={download}>Baixar avaliação <Download size={17} /></button><p className="hm-download-note" role="status">{announcement || 'O arquivo não é enviado automaticamente.'}</p></div>
  </section>;
}
