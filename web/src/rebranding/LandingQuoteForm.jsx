import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { isValidCnpj } from '../lib/sales-journey/engine';

const normalizeIntent = value => value === 'empresarial' ? 'business' : value === 'adesao' ? 'personal' : value;

export function LandingQuoteForm({ intent = '', onIntentChange, onStartChat }) {
  const id = useId(), heading = useRef(null), fields = useRef({});
  const [step, setStep] = useState(1), [interest, setInterest] = useState(normalizeIntent(intent));
  const [lives, setLives] = useState('1'), [ages, setAges] = useState('');
  const [details, setDetails] = useState({ city: '', cnpj: '', name: '', phone: '', email: '', consent: false });
  const [errors, setErrors] = useState({}), [opening, setOpening] = useState(false);
  useEffect(() => { if (intent) setInterest(normalizeIntent(intent)); }, [intent]);
  useEffect(() => { if (step > 1) heading.current?.focus({ preventScroll: true }); }, [step]);
  const update = (key, value) => { setDetails(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: undefined })); };
  const report = nextErrors => {
    setErrors(nextErrors);
    fields.current[Object.keys(nextErrors)[0]]?.focus();
    return Object.keys(nextErrors).length > 0;
  };
  const next = () => {
    const nextErrors = {};
    if (step === 1) {
      if (!['personal', 'business'].includes(interest)) nextErrors.interest = 'Escolha para quem você procura o plano.';
      if (!/^\d+$/.test(lives) || Number(lives) < 1 || Number(lives) > 1000) nextErrors.lives = 'Informe de 1 a 1.000 pessoas.';
    } else {
      if (details.city.trim().length < 2 || details.city.trim().length > 100 || !/^[\p{L}\s.'-]+$/u.test(details.city.trim())) nextErrors.city = 'Informe o nome do município de atendimento.';
      if (interest === 'business' && !isValidCnpj(details.cnpj)) nextErrors.cnpj = 'Confira os 14 dígitos do CNPJ.';
      const values = ages.trim().split(/[,;\s]+/);
      if (values.length !== Number(lives) || values.some(value => !/^\d{1,3}$/.test(value) || Number(value) > 120)) nextErrors.ages = `Informe ${lives} ${Number(lives) === 1 ? 'idade' : 'idades'}, de 0 a 120 anos, separadas por vírgula.`;
    }
    if (!report(nextErrors)) setStep(previous => previous + 1);
  };
  const submit = async event => {
    event.preventDefault();
    if (opening) return;
    const nextErrors = {};
    if (details.name.trim().length < 2) nextErrors.name = 'Informe seu nome.';
    if (!/^(?:55)?\d{10,11}$/.test(details.phone.replace(/\D/g, ''))) nextErrors.phone = 'Informe telefone com DDD, por exemplo (21) 99999-9999.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) nextErrors.email = 'Informe um e-mail válido.';
    if (!details.consent) nextErrors.consent = 'Confirme o consentimento para continuar.';
    if (report(nextErrors)) return;
    setOpening(true);
    try {
      if (!onStartChat) throw new Error('unavailable');
      await onStartChat({
        contact: { name: details.name.trim(), phone: details.phone.trim(), email: details.email.trim(), consent: true },
        qualification: { interest, city: details.city.trim(), lives: Number(lives), ages: ages.trim().split(/[,;\s]+/).map(Number), ...(interest === 'business' ? { cnpj: details.cnpj.replace(/\D/g, '') } : {}), modality: 'indefinido' },
      });
    } catch { setErrors({ submit: 'Não foi possível abrir a conversa. Tente novamente em instantes.' }); }
    finally { setOpening(false); }
  };
  const field = (key, label, type = 'text', placeholder = '', autocomplete = 'off') => <label htmlFor={`${id}-${key}`} key={key}>{label}<input id={`${id}-${key}`} ref={node => { fields.current[key] = node; }} type={type} autoComplete={autocomplete} value={details[key]} onChange={event => update(key, event.target.value)} placeholder={placeholder} maxLength={key === 'email' ? 254 : 120} required aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${id}-${key}-error` : undefined} />{errors[key] && <span id={`${id}-${key}-error`} className="field-error">{errors[key]}</span>}</label>;
  return <div className="quote-form lp-sales-form">
    <div className="quote-progress" aria-label={`Etapa ${step} de 3`}>{[1, 2, 3].map(value => <span key={value} className={step >= value ? 'progress-active' : ''} />)}</div>
    <h2 ref={heading} tabIndex={-1}>{step === 1 ? 'O plano é para quem?' : step === 2 ? 'Vamos conhecer seu perfil.' : 'Continue sua cotação no chat.'}</h2>
    <p className="quote-subtitle">{step === 1 ? 'Para você e sua família ou para sua empresa? Comece por aqui.' : step === 2 ? 'Esses dados ajudam a identificar os produtos aplicáveis.' : 'Você já entra na conversa com os dados preenchidos, para conhecer o plano e tirar suas dúvidas.'}</p>
    <p className="quote-step-label">Etapa {step} de 3 · {['Seu interesse', 'Quem vamos cuidar', 'Seu contato'][step - 1]}</p>
    {step > 1 && <button type="button" className="text-button lp-sales-back" onClick={() => { setStep(step - 1); setErrors({}); }}><ArrowLeft size={15} aria-hidden="true" /> Corrigir etapa anterior</button>}
    {step === 1 ? <>
      <div className="lp-intent-options" role="group" aria-label="Para quem é o plano?">{[['personal', 'Para mim / família'], ['business', 'Para minha empresa']].map(([value, label], index) => <button ref={index === 0 ? node => { fields.current.interest = node; } : undefined} key={value} type="button" aria-pressed={interest === value} onClick={() => { setInterest(value); onIntentChange?.(value); setErrors({}); }}>{label}</button>)}</div>
      {errors.interest && <p className="field-error" role="alert">{errors.interest}</p>}
      <p className="lp-intent-help">Seu interesse é o ponto de partida. A modalidade de contratação depende do produto e da elegibilidade.</p>
      <div className="contact-fields"><label htmlFor={`${id}-lives`}>Quantas pessoas, incluindo você?<input id={`${id}-lives`} ref={node => { fields.current.lives = node; }} type="number" inputMode="numeric" min="1" max="1000" step="1" value={lives} onChange={event => setLives(event.target.value)} aria-invalid={!!errors.lives} />{errors.lives && <span className="field-error" role="alert">{errors.lives}</span>}</label></div>
      <button type="button" className="button button-purple quote-next" onClick={next}>Continuar <ArrowRight size={18} aria-hidden="true" /></button>
    </> : step === 2 ? <>
      <div className="contact-fields">{field('city', 'Município', 'text', 'Onde você precisa de atendimento?', 'address-level2')}{interest === 'business' && field('cnpj', 'CNPJ da empresa', 'text', '00.000.000/0000-00')}
        <label htmlFor={`${id}-ages`}>{Number(lives) === 1 ? 'Idade' : `Idades das ${lives} pessoas`}<textarea id={`${id}-ages`} ref={node => { fields.current.ages = node; }} rows={Number(lives) > 10 ? 4 : 2} value={ages} onChange={event => setAges(event.target.value)} placeholder={Number(lives) === 1 ? 'Ex.: 34' : 'Ex.: 34, 32, 8'} aria-invalid={!!errors.ages} aria-describedby={`${id}-ages-hint`} maxLength={5000} /><span id={`${id}-ages-hint`} className={errors.ages ? 'field-error' : 'field-hint'}>{errors.ages || 'Informe anos completos; para bebês com menos de um ano, use 0.'}</span></label>
      </div><button type="button" className="button button-purple quote-next" onClick={next}>Continuar <ArrowRight size={18} aria-hidden="true" /></button>
    </> : <form onSubmit={submit} noValidate aria-busy={opening}>
      <div className="contact-fields">{field('name', 'Nome', 'text', 'Como podemos chamar você?', 'name')}{field('phone', 'Telefone com DDD', 'tel', '(21) 99999-9999', 'tel')}{field('email', 'E-mail', 'email', 'voce@email.com', 'email')}</div>
      <label className="quote-consent" htmlFor={`${id}-consent`}><input id={`${id}-consent`} ref={node => { fields.current.consent = node; }} type="checkbox" checked={details.consent} onChange={event => update('consent', event.target.checked)} aria-invalid={!!errors.consent} /><span>Concordo com o tratamento dos meus dados para cotação e atendimento comercial, conforme a <a href="/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</span></label>
      {errors.consent && <p className="field-error" role="alert">{errors.consent}</p>}{errors.submit && <p className="field-error" role="alert">{errors.submit}</p>}
      <button className="button button-purple quote-next" type="submit" disabled={opening}>{opening ? 'Abrindo conversa…' : 'Continuar com a Amélia'} <ArrowRight size={18} aria-hidden="true" /></button>
      <p className="lp-form-footnote">A cotação depende das condições vigentes. Enviar seus dados não contrata nem ativa um plano.</p>
    </form>}
  </div>;
}
