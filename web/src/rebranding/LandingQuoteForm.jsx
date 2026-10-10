import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { QUOTE_WHATSAPP_URL } from './quote-request.mjs';
import { trackQuoteStep, useQuoteSubmission } from './useQuoteSubmission.jsx';

const emptyContact = () => ({ name: '', city: '', whatsapp: '', email: '', consent: false });
const isValidAge = age => age !== '' && Number.isInteger(Number(age)) && Number(age) >= 0 && Number(age) <= 120;

export function LandingQuoteForm({ intent = '', onIntentChange }) {
  const selectedIntent = intent === 'empresarial' || intent === 'adesao' ? intent : '';
  return <LandingQuoteFlow key={selectedIntent} selectedIntent={selectedIntent} onIntentChange={onIntentChange} />;
}

function LandingQuoteFlow({ selectedIntent, onIntentChange }) {
  const idPrefix = useId();
  const headingRef = useRef(null);
  const ageRefs = useRef([]);
  const contactRefs = useRef({});
  const consentRef = useRef(null);
  const previousStage = useRef(`${selectedIntent}:1:false`);
  const [step, setStep] = useState(1);
  const [lives, setLives] = useState(0);
  const [more, setMore] = useState(false);
  const [ages, setAges] = useState([]);
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState({});
  const [website, setWebsite] = useState('');
  const { status, errorMessage, submitQuote, resetSubmission } = useQuoteSubmission();
  const success = status === 'success', pending = status === 'submitting';

  const resetFlow = () => {
    setStep(1);
    setLives(0);
    setMore(false);
    setAges([]);
    setContact(emptyContact());
    setErrors({});
    setWebsite('');
    resetSubmission();
  };

  useEffect(() => {
    const stage = `${selectedIntent}:${step}:${success}`;
    if (previousStage.current !== stage) {
      const heading = headingRef.current;
      heading?.focus({ preventScroll: true });
      const bounds = heading?.getBoundingClientRect();
      if (bounds && (bounds.top < 104 || bounds.bottom > window.innerHeight - 32)) {
        heading.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
      previousStage.current = stage;
    }
  }, [selectedIntent, step, success]);

  const chooseLives = (amount, extra = false) => {
    if (!selectedIntent || (selectedIntent === 'empresarial' && amount < 2)) return;
    setLives(amount);
    setMore(extra);
    setAges(previous => previous.length === amount ? previous : Array(amount).fill(''));
    setErrors({});
    setStep(2);
    resetSubmission();
    trackQuoteStep('cotacao_step_vidas', amount, extra, selectedIntent);
  };

  const nextStep = () => {
    const invalidIndex = ages.findIndex(age => !isValidAge(age));
    if (invalidIndex !== -1 || ages.length !== lives) {
      setErrors({ ages: 'Preencha uma idade inteira de 0 a 120 para cada vida.' });
      ageRefs.current[Math.max(invalidIndex, 0)]?.focus();
      return;
    }
    setErrors({});
    setStep(3);
    resetSubmission();
    trackQuoteStep('cotacao_step_idades', lives, more, selectedIntent);
  };

  const submit = async event => {
    event.preventDefault();
    const result = await submitQuote({ contact, lives, ages, more, website, intent: selectedIntent });
    if (result.status === 'busy') return;
    const nextErrors = result.errors || {};
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0];
      (firstField === 'consent' ? consentRef.current : contactRefs.current[firstField])?.focus();
      return;
    }
  };

  if (success) return <div className="quote-success" role="status">
    <Check size={38} strokeWidth={1.4} aria-hidden="true" />
    <h2 ref={headingRef} tabIndex={-1}>Solicitação recebida</h2>
    <p>Recebemos sua solicitação. Nossa equipe fala com você no WhatsApp para montar a proposta.</p>
    <a href={QUOTE_WHATSAPP_URL} className="button button-purple" target="_blank" rel="noopener noreferrer">Abrir WhatsApp agora <ArrowRight size={18} aria-hidden="true" /></a>
    <button type="button" className="text-button" onClick={resetFlow}>Fazer outra cotação</button>
  </div>;

  const title = step === 1
    ? selectedIntent ? 'Quantas vidas você quer incluir?' : 'Qual modalidade quer conhecer?'
    : step === 2 ? 'Qual a idade de cada vida?' : 'Por onde te retornamos?';
  const subtitle = step === 1
    ? selectedIntent ? 'Escolha a quantidade de pessoas que você quer incluir.' : 'Escolha um caminho antes de informar a quantidade de vidas.'
    : step === 2
      ? more ? 'Informe as 10 primeiras idades. O restante alinhamos no WhatsApp.' : 'Informe a idade de cada pessoa para encontrar a faixa da proposta.'
      : 'WhatsApp é o principal. E-mail é opcional.';
  const minimum = selectedIntent === 'empresarial' ? 2 : 1;
  const selectedLabel = selectedIntent === 'empresarial' ? 'Empresa com CNPJ' : 'Por adesão';
  const livesLabel = more ? '10 ou mais vidas' : `${lives} ${lives === 1 ? 'vida' : 'vidas'}`;

  return <div className="quote-form">
    <div className="quote-progress" aria-label={`Etapa ${step} de 3`}>
      {[1, 2, 3].map(number => <span key={number} className={step >= number ? 'progress-active' : ''} />)}
    </div>
    <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
    <p className="quote-subtitle">{subtitle}</p>
    <p className="quote-step-label">Etapa {step} de 3</p>

    {step === 1 ? <>
      <div className="lp-intent-options" role="group" aria-label="Modalidade da cotação">
        <button type="button" aria-pressed={selectedIntent === 'empresarial'} onClick={() => onIntentChange?.('empresarial')}>Empresa com CNPJ</button>
        <button type="button" aria-pressed={selectedIntent === 'adesao'} onClick={() => onIntentChange?.('adesao')}>Por adesão</button>
      </div>
      <p className="lp-intent-help">
        {selectedIntent === 'empresarial'
          ? 'Caminho empresarial para empresas com CNPJ, a partir de 2 beneficiários. As condições dependem do produto e da proposta vigente.'
          : selectedIntent === 'adesao'
            ? 'Contratação por entidade de classe, conforme vínculo aceito. O mínimo de vidas e a inclusão de dependentes seguem as regras da entidade e do contrato.'
            : 'Empresarial via CNPJ ou adesão via entidade de classe. A elegibilidade depende do produto.'}
      </p>
      {selectedIntent ? <>
        <p className="quote-label">Quantas vidas? ({minimum} a 10 ou mais)</p>
        <div className="lives-grid" role="group" aria-label="Quantidade de vidas">
          {Array.from({ length: 11 - minimum }, (_, index) => minimum + index).map(amount => <button type="button" key={amount} onClick={() => chooseLives(amount)}>{amount}</button>)}
        </div>
        <button type="button" className="more-lives" onClick={() => chooseLives(10, true)}>10 ou mais vidas</button>
      </> : null}
    </> : step === 2 ? <>
      <p className="lp-intent-help">{selectedLabel}</p>
      <div className="quote-back-row">
        <button type="button" className="text-button" onClick={() => { setStep(1); setErrors({}); }}><ArrowLeft size={15} aria-hidden="true" /> Alterar modalidade ou quantidade</button>
        <span>{livesLabel}</span>
      </div>
      <div className="ages-grid">
        {ages.map((age, index) => <label key={index} htmlFor={`${idPrefix}-age-${index}`}>
          Vida {index + 1}
          <input id={`${idPrefix}-age-${index}`} ref={node => { ageRefs.current[index] = node; }} type="number" inputMode="numeric" min="0" max="120" step="1" placeholder="Idade" value={age} onChange={event => {
            setAges(previous => previous.map((value, currentIndex) => currentIndex === index ? event.target.value : value));
            setErrors({});
          }} aria-invalid={!!errors.ages} aria-describedby={errors.ages ? `${idPrefix}-ages-error` : undefined} />
        </label>)}
      </div>
      {errors.ages ? <p role="alert" id={`${idPrefix}-ages-error`} className="field-error">{errors.ages}</p> : null}
      <button type="button" className="button button-purple quote-next" onClick={nextStep}>Continuar <ArrowRight size={18} aria-hidden="true" /></button>
    </> : <form onSubmit={submit} noValidate aria-busy={pending}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
      <p className="lp-intent-help">{selectedLabel}</p>
      <div className="quote-back-row">
        <button type="button" disabled={pending} className="text-button" onClick={() => { setStep(2); setErrors({}); resetSubmission(); }}><ArrowLeft size={15} aria-hidden="true" /> Voltar às idades</button>
        <span>{livesLabel}</span>
      </div>
      <div className="contact-fields">
        {[
          ['name', 'Nome', 'Seu nome', 'text', 'name'],
          ['city', 'Cidade', 'Sua cidade', 'text', 'address-level2'],
          ['whatsapp', 'WhatsApp', '(21) 99999-9999', 'tel', 'tel'],
          ['email', 'E-mail (opcional)', 'se quiser, voce@email.com', 'email', 'email'],
        ].map(([key, label, placeholder, type, autocomplete]) => <label key={key} htmlFor={`${idPrefix}-${key}`}>
          {label}
          <input id={`${idPrefix}-${key}`} ref={node => { contactRefs.current[key] = node; }} name={key} aria-label={label} type={type} autoComplete={autocomplete} maxLength={key === 'email' ? 255 : key === 'whatsapp' ? 40 : 120} placeholder={placeholder} value={contact[key]} disabled={pending} required={key !== 'email'} onChange={event => {
            setContact(previous => ({ ...previous, [key]: event.target.value }));
            setErrors(previous => ({ ...previous, [key]: undefined }));
          }} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${idPrefix}-${key}-error` : key === 'whatsapp' ? `${idPrefix}-whatsapp-hint` : undefined} />
          {errors[key] ? <span role="alert" className="field-error" id={`${idPrefix}-${key}-error`}>{errors[key]}</span> : key === 'whatsapp' ? <span className="field-hint" id={`${idPrefix}-whatsapp-hint`}>Canal principal do retorno</span> : null}
        </label>)}
      </div>
      <label className="quote-consent" htmlFor={`${idPrefix}-consent`}>
        <input id={`${idPrefix}-consent`} ref={consentRef} type="checkbox" checked={contact.consent} disabled={pending} required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined} onChange={event => {
          setContact(previous => ({ ...previous, consent: event.target.checked }));
          setErrors(previous => ({ ...previous, consent: undefined }));
        }} />
        <span>Concordo com o tratamento dos meus dados para receber a cotação, conforme a <a href="/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</span>
      </label>
      {errors.consent ? <p role="alert" id={`${idPrefix}-consent-error`} className="field-error">{errors.consent}</p> : null}
      {status === 'error' ? <div role="alert" className="field-error"><p>{errorMessage}</p><a href={QUOTE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a></div> : null}
      <button className="button button-purple quote-next" type="submit" disabled={pending}>{pending ? 'Enviando...' : status === 'error' ? 'Tentar novamente' : 'Enviar cotação'} <ArrowRight size={18} aria-hidden="true" /></button>
    </form>}
  </div>;
}
