import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SiteLink } from './App.jsx';
import { QUOTE_WHATSAPP_URL } from './quote-request.mjs';
import { trackQuoteStep, useQuoteSubmission } from './useQuoteSubmission.jsx';

const emptyContact = () => ({ name: '', city: '', whatsapp: '', email: '', consent: false });

export function QuoteForm({ navigate }) {
  const idPrefix = useId(), headingRef = useRef(null), previousStage = useRef('1:false');
  const ageRefs = useRef([]), contactRefs = useRef({}), consentRef = useRef(null);
  const [step, setStep] = useState(1), [lives, setLives] = useState(1), [more, setMore] = useState(false);
  const [ages, setAges] = useState([]), [errors, setErrors] = useState({});
  const [contact, setContact] = useState(emptyContact), [website, setWebsite] = useState('');
  const { status, errorMessage, submitQuote, resetSubmission } = useQuoteSubmission();
  const success = status === 'success', pending = status === 'submitting';

  useEffect(() => {
    const stage = `${step}:${success}`;
    if (previousStage.current !== stage) { headingRef.current?.focus(); previousStage.current = stage; }
  }, [step, success]);

  const chooseLives = (amount, extra = false) => {
    setLives(amount); setMore(extra); setAges(Array(amount).fill('')); setErrors({}); resetSubmission(); setStep(2);
    trackQuoteStep('cotacao_step_vidas', amount, extra);
  };
  const nextStep = () => {
    const index = ages.findIndex(age => age === '' || !Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 120);
    if (index !== -1 || ages.length !== lives) { setErrors({ ages: 'Preencha a idade de cada vida (0 a 120).' }); ageRefs.current[Math.max(index, 0)]?.focus(); return; }
    setErrors({}); resetSubmission(); setStep(3);
    trackQuoteStep('cotacao_step_idades', lives, more);
  };
  const submit = async event => {
    event.preventDefault();
    const result = await submitQuote({ contact, lives, ages, more, website });
    if (result.status === 'busy') return;
    setErrors(result.errors || {});
    const field = Object.keys(result.errors || {})[0];
    if (field === 'ages') { setStep(2); ageRefs.current[0]?.focus(); }
    else if (field) (field === 'consent' ? consentRef.current : contactRefs.current[field])?.focus();
  };
  const resetFlow = () => { resetSubmission(); setStep(1); setLives(1); setMore(false); setAges([]); setErrors({}); setContact(emptyContact()); setWebsite(''); };
  const title = step === 1 ? 'Quantas vidas você precisa?' : step === 2 ? 'Qual a idade de cada vida?' : 'Por onde te retornamos?';
  const subtitle = step === 1 ? 'Escolha a quantidade. Depois informamos a idade e o WhatsApp para enviar a proposta.' : step === 2 ? more ? 'Informe as 10 primeiras idades. O restante alinhamos no WhatsApp.' : 'Isso define a faixa certa da proposta.' : 'WhatsApp é o principal. E-mail é opcional.';

  if (success) return <div className="quote-success" role="status"><Check size={38} strokeWidth={1.4} aria-hidden="true" /><h2 ref={headingRef} tabIndex={-1}>Solicitação recebida</h2><p>Recebemos sua solicitação. Nossa equipe fala com você no WhatsApp para montar a proposta.</p><a href={QUOTE_WHATSAPP_URL} className="button button-purple" target="_blank" rel="noopener noreferrer">Abrir WhatsApp agora <ArrowRight size={20} aria-hidden="true" /></a><button type="button" className="text-button" onClick={resetFlow}>Fazer outra cotação</button></div>;
  return <div className="quote-form">
    <div className="quote-progress" aria-label={`Etapa ${step} de 3`}>{[1, 2, 3].map(number => <span key={number} className={step >= number ? 'progress-active' : ''} />)}</div>
    <h2 ref={headingRef} tabIndex={-1}>{title}</h2><p className="quote-subtitle">{subtitle}</p><p className="quote-step-label">Etapa {step} de 3</p>
    {step === 1 ? <><p className="quote-label">Quantas vidas? (1 a 10 ou mais)</p><div className="lives-grid">{Array.from({ length: 10 }, (_, index) => index + 1).map(amount => <button type="button" key={amount} onClick={() => chooseLives(amount)}>{amount}</button>)}</div><button type="button" className="more-lives" onClick={() => chooseLives(10, true)}>10 ou mais vidas</button></> : step === 2 ? <>
      <div className="quote-back-row"><button type="button" className="text-button" onClick={() => { setStep(1); setErrors({}); resetSubmission(); }}><ArrowLeft size={15} aria-hidden="true" /> Alterar quantidade</button><span>{more ? '10 ou mais vidas' : `${lives} ${lives === 1 ? 'vida' : 'vidas'}`}</span></div>
      <div className="ages-grid">{ages.map((age, index) => <label key={index}>Vida {index + 1}<input ref={node => { ageRefs.current[index] = node; }} type="number" inputMode="numeric" min="0" max="120" step="1" placeholder="Idade" value={age} onChange={event => { setAges(previous => previous.map((value, currentIndex) => currentIndex === index ? event.target.value : value)); setErrors({}); }} aria-invalid={!!errors.ages} aria-describedby={errors.ages ? `${idPrefix}-ages-error` : undefined} /></label>)}</div>
      {errors.ages ? <p role="alert" id={`${idPrefix}-ages-error`} className="field-error">{errors.ages}</p> : null}<button type="button" className="button button-purple quote-next" onClick={nextStep}>Continuar <ArrowRight size={18} aria-hidden="true" /></button>
    </> : <form onSubmit={submit} noValidate aria-busy={pending}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
      <div className="quote-back-row"><button type="button" disabled={pending} className="text-button" onClick={() => { setStep(2); setErrors({}); resetSubmission(); }}><ArrowLeft size={15} aria-hidden="true" /> Voltar às idades</button><span>{more ? '10 ou mais vidas' : `${lives} ${lives === 1 ? 'vida' : 'vidas'}`}</span></div>
      <div className="contact-fields">{[['name', 'Nome', 'Seu nome', 'text', 'name'], ['city', 'Cidade', 'Sua cidade', 'text', 'address-level2'], ['whatsapp', 'WhatsApp', '(21) 99999-9999', 'tel', 'tel'], ['email', 'E-mail (opcional)', 'se quiser, voce@email.com', 'email', 'email']].map(([key, label, placeholder, type, autocomplete]) => <label key={key}>{label}<input ref={node => { contactRefs.current[key] = node; }} name={key} aria-label={label} autoComplete={autocomplete} type={type} maxLength={key === 'email' ? 255 : key === 'whatsapp' ? 40 : 120} placeholder={placeholder} value={contact[key]} disabled={pending} required={key !== 'email'} onChange={event => { setContact(previous => ({ ...previous, [key]: event.target.value })); setErrors(previous => ({ ...previous, [key]: undefined })); }} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${idPrefix}-${key}-error` : key === 'whatsapp' ? `${idPrefix}-whatsapp-hint` : undefined} />{errors[key] ? <span role="alert" className="field-error" id={`${idPrefix}-${key}-error`}>{errors[key]}</span> : key === 'whatsapp' ? <span className="field-hint" id={`${idPrefix}-whatsapp-hint`}>Canal principal do retorno</span> : null}</label>)}</div>
      <label className="quote-consent"><input ref={consentRef} type="checkbox" checked={contact.consent} disabled={pending} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined} onChange={event => { setContact(previous => ({ ...previous, consent: event.target.checked })); setErrors(previous => ({ ...previous, consent: undefined })); }} required /><span>Concordo com o tratamento dos meus dados para receber a cotação, conforme a <SiteLink href="/privacidade" navigate={navigate} target="_blank" rel="noopener noreferrer">Política de Privacidade</SiteLink>.</span></label>
      {errors.consent ? <p role="alert" id={`${idPrefix}-consent-error`} className="field-error">{errors.consent}</p> : null}
      {status === 'error' ? <div role="alert" className="field-error"><p>{errorMessage}</p><a href={QUOTE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a></div> : null}
      <button className="button button-purple quote-next" type="submit" disabled={pending}>{pending ? 'Enviando...' : status === 'error' ? 'Tentar novamente' : 'Enviar cotação'} <ArrowRight size={18} aria-hidden="true" /></button>
    </form>}
  </div>;
}
