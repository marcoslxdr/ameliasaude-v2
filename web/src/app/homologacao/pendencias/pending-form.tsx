'use client';

import { useState } from 'react';
import { QUESTIONS, formatAnswers, whatsappLink, type Answers } from './pending-data';

const empty: Answers = { promotion: '', pricing: '', waiting: '', other: '' };
export function PendingForm() {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Answers>(empty);
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState('');
  const message = formatAnswers(name, answers, files.map(file => file.name));
  const hasAnswer = Object.values(answers).some(value => value.trim()) || files.length > 0;
  async function share() {
    const data: ShareData = { title: 'Pendências Amélia Saúde', text: message, ...(files.length ? { files } : {}) };
    if (typeof navigator.share !== 'function' || (files.length && (typeof navigator.canShare !== 'function' || !navigator.canShare(data)))) {
      setNotice('Este aparelho não compartilha os anexos por aqui. Use “Abrir WhatsApp”, escolha o grupo Amélia Saúde - Atria e anexe os arquivos manualmente antes de enviar.');
      return;
    }
    try {
      await navigator.share(data);
      setNotice('Compartilhamento aberto. Confirme no aplicativo escolhido se a mensagem e os arquivos foram enviados.');
    } catch (error) {
      setNotice(error instanceof Error && error.name === 'AbortError' ? 'Compartilhamento cancelado. Suas respostas continuam aqui.' : 'Não foi possível abrir o compartilhamento. Você pode usar o WhatsApp e anexar os arquivos manualmente.');
    }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(message); setNotice('Texto copiado. Cole no grupo e anexe os arquivos manualmente.'); }
    catch { setNotice('Não foi possível copiar. Você pode selecionar o texto da prévia abaixo e copiá-lo.'); }
  }
  return <main className="pending-page"><div className="pending-wrap">
    <a className="pending-back" href="/homologacao">← Voltar ao guia de testes</a>
    <p className="pending-kicker">AMÉLIA SAÚDE + ATRIA</p>
    <h1>Responda no seu tempo.</h1>
    <p className="pending-lead">Marcelo ou qualquer pessoa da equipe pode responder aos pontos pendentes e compartilhar documentos com a Atria. Preencha apenas o que já souber.</p>
    <div className="pending-card"><p><strong>Já recebemos:</strong> registro ANS 507.538/26-6 para Adesão, boleto no vencimento escolhido, rede e material Carioca 10, treinamento e aditivo de carências.</p><p>Não inclua dados de pacientes ou informações de saúde pessoais.</p></div>
    <form onSubmit={event => event.preventDefault()}>
      <label className="pending-label" htmlFor="pending-name">Nome ou equipe <span>(opcional)</span></label>
      <input id="pending-name" value={name} maxLength={120} onChange={e => setName(e.target.value)} placeholder="Como podemos identificar seu retorno?" />
      {QUESTIONS.map(question => <div className="pending-question" key={question.key}>
        <label className="pending-label" htmlFor={`pending-${question.key}`}>{question.label}</label><p>{question.prompt}</p>
        <textarea id={`pending-${question.key}`} value={answers[question.key]} maxLength={2000} onChange={e => setAnswers({...answers, [question.key]: e.target.value})} placeholder="Escreva sua resposta ou deixe em branco" rows={4} />
      </div>)}
      <div className="pending-question"><label className="pending-label" htmlFor="pending-files">Documentos ou imagens <span>(opcional)</span></label>
        <p>Selecione arquivos para compartilhar com a equipe. Eles ficam neste aparelho até você escolher como enviá-los.</p>
        <input id="pending-files" type="file" multiple accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg" onChange={e => setFiles(Array.from(e.target.files ?? []))} />
        {files.length > 0 && <ul>{files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}</ul>}
      </div>
      <section className="pending-card" aria-labelledby="preview-title"><h2 id="preview-title">Confira antes de enviar</h2><p>Ao compartilhar, escolha o grupo Amélia Saúde - Atria ou o contato da equipe. O envio é confirmado por você no aplicativo escolhido.</p><pre>{message}</pre>
        <div className="pending-actions"><button type="button" onClick={share} disabled={!hasAnswer}>Compartilhar respostas e arquivos</button><a aria-disabled={!hasAnswer} href={hasAnswer ? whatsappLink(message) : undefined} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a><button type="button" className="secondary" onClick={copy} disabled={!hasAnswer}>Copiar respostas</button></div>
        <p>Se usar “Abrir WhatsApp” ou “Copiar respostas”, os arquivos não são anexados automaticamente: anexe-os na conversa antes de enviar.</p><p role="status" aria-live="polite">{notice}</p>
      </section>
    </form>
  </div></main>;
}
